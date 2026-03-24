#!/usr/bin/env python3
"""史学热点论文数据更新脚本（Scrapling 版）

用法：
    python scripts/scraper.py

功能：
    - 用 Scrapling DynamicFetcher（Playwright Chromium）爬取知网真实论文
    - 知网失败时自动降级至万方
    - 只追加新论文，不覆盖已有真实数据
    - 重新计算所有论文热度评分
    - 更新 topics.json / metadata.json
"""

import json
import time
import random
import logging
import re
from datetime import datetime
from pathlib import Path
from urllib.parse import quote

# ─────────────────────────────────────────────
# Scrapling 导入（运行前需: pip install "scrapling[fetchers]" && scrapling install）
# ─────────────────────────────────────────────
try:
    from scrapling.fetchers import DynamicFetcher, DynamicSession, StealthyFetcher
    SCRAPLING_AVAILABLE = True
except ImportError:
    SCRAPLING_AVAILABLE = False

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
)
logger = logging.getLogger(__name__)

BASE_DIR   = Path(__file__).parent.parent
DATA_DIR   = BASE_DIR / 'public' / 'data'
TOPICS_FILE   = DATA_DIR / 'topics.json'
METADATA_FILE = DATA_DIR / 'metadata.json'

MAX_PER_TOPIC = 5          # 每个话题最多抓取的新论文数
DELAY_MIN     = 3.0        # 礼貌延迟（秒）
DELAY_MAX     = 6.0
PAGE_TIMEOUT  = 30_000     # 毫秒


# ─────────────────────────────────────────────
# 评分算法
# ─────────────────────────────────────────────

def calculate_score(paper: dict, current_year: int) -> float:
    age     = max(0, current_year - paper.get('year', current_year))
    recency = max(0, 10 - age)
    norm_c  = min(paper.get('citations', 0) / 100, 10)
    norm_d  = min(paper.get('downloads', 0) / 1000, 10)
    return round(norm_c * 0.5 + norm_d * 0.3 + recency * 0.2, 1)


# ─────────────────────────────────────────────
# 工具函数
# ─────────────────────────────────────────────

def _extract_year(text: str | None) -> int:
    if not text:
        return datetime.now().year
    m = re.search(r'(19|20)\d{2}', str(text))
    return int(m.group()) if m else datetime.now().year


def _parse_int(text, default: int = 0) -> int:
    digits = ''.join(c for c in str(text or '') if c.isdigit())
    return int(digits) if digits else default


def _split_authors(raw: str) -> list[str]:
    """拆分逗号/分号分隔的作者字符串"""
    if not raw:
        return []
    parts = re.split(r'[,，;；]', raw)
    return [p.strip() for p in parts if p.strip()]


# ─────────────────────────────────────────────
# 知网爬取（Scrapling DynamicFetcher）
# ─────────────────────────────────────────────

# 知网 kns8s 搜索结果页（限定期刊数据库 CJFD）
_CNKI_URL = (
    'https://kns.cnki.net/kns8s/defaultresult/index'
    '?kw={kw}&crossdb=1&dbcode=CJFD'
)

def _parse_cnki_page(page) -> list[dict]:
    """从已渲染的知网页面对象中解析论文列表"""
    papers = []

    # 兼容 kns8 新旧两种表格结构
    rows = page.css('tr.odd, tr.even')
    if not rows:
        rows = page.css('.result-item-wrap')
    if not rows:
        logger.debug('未匹配到已知结果容器，尝试通用选择器')
        rows = page.css('[class*="result"] tr')

    logger.info('知网：找到 %d 条原始结果行', len(rows))

    for row in rows[:MAX_PER_TOPIC]:
        # ── 标题 ──
        title_el = row.css('a.fz14')
        if not title_el:
            continue
        title = (title_el.css('::text').get() or '').strip()
        if not title:
            continue

        # ── 知网文件名 ID（如 LSYJ202301004）──
        href    = title_el.get_attribute('href') or ''
        cnki_id = ''
        m = re.search(r'filename=([^&]+)', href, re.IGNORECASE)
        if m:
            cnki_id = m.group(1).upper()

        # ── 作者 ──
        author_raw = (
            row.css('.author::text').get() or
            row.css('[class*="author"]::text').get() or ''
        )
        authors = _split_authors(author_raw)

        # ── 期刊 ──
        journal = (
            row.css('.source a::text').get() or
            row.css('.source::text').get() or ''
        ).strip()

        # ── 年份 ──
        year = _extract_year(
            row.css('.year::text').get() or
            row.css('[class*="year"]::text').get()
        )

        # ── 引用量（kns8 列表页部分版本显示）──
        citations = _parse_int(
            row.css('.quote a::text').get() or
            row.css('[class*="cited"] a::text').get() or
            row.css('.cite-num::text').get()
        )

        # ── 下载量 ──
        downloads = _parse_int(
            row.css('.download a::text').get() or
            row.css('[class*="download"] a::text').get() or
            row.css('.dl::text').get()
        )

        papers.append({
            'title':     title,
            'authors':   authors,
            'journal':   journal,
            'year':      year,
            'citations': citations,
            'downloads': downloads,
            'source':    '知网',
            'cnki_id':   cnki_id,
        })

    return papers


def scrape_cnki(keyword: str, session) -> list[dict]:
    url = _CNKI_URL.format(kw=quote(keyword))
    logger.info('知网搜索：%s', keyword)
    try:
        page = session.fetch(
            url,
            network_idle=True,
            timeout=PAGE_TIMEOUT,
            ignore_https_errors=True,   # 绕过 ERR_CERT_COMMON_NAME_INVALID
        )
        # 检测反爬：验证码 / 内容过短
        raw_len = len(page.get_all_text() or '')
        if raw_len < 200:
            logger.warning('知网返回内容过短（%d 字），疑似反爬或空结果', raw_len)
            return []
        results = _parse_cnki_page(page)
        logger.info('知网：解析出 %d 篇论文', len(results))
        return results
    except Exception as exc:
        logger.warning('知网爬取失败（%s）：%s', keyword, exc)
        return []


# ─────────────────────────────────────────────
# 万方爬取（备用）
# ─────────────────────────────────────────────

_WANFANG_URL = (
    'https://s.wanfangdata.com.cn/paper'
    '?q={kw}&type=perio'
)

def _parse_wanfang_page(page) -> list[dict]:
    """
    万方数据 s.wanfangdata.com.cn 搜索结果页真实结构：
      容器: div.normal-list
      标题: span.title（内含多个 span.highlight）
      论文ID: span.title-id-hidden  → "periodical_xxx"
      作者:  多个 span.authors（最后一个是年期，需过滤）
      期刊:  span.periodical-title  → "《xxx》"
      统计:  div.stat-item.download → "下载 12"
             div.stat-item.quote   → "被引 0"
    """
    papers = []
    items = page.css('div.normal-list')
    logger.info('万方：找到 %d 条原始结果', len(items))

    for item in items[:MAX_PER_TOPIC]:
        # ── 标题（含 span.highlight 子节点中的文字）──
        title_el = item.css('span.title')
        if not title_el:
            continue
        # 用 *, ::text 取全部后代文本，再拼接
        title_parts = title_el.css('::text, *::text').getall()
        title = ''.join(title_parts).strip()
        if not title:
            continue

        # ── 作者（过滤掉"2015年6期"形式的年期条目）──
        all_authors = [
            a.strip() for a in item.css('span.authors::text').getall()
            if a.strip() and not re.search(r'\d{4}年', a)
        ]

        # ── 期刊（去除书名号《》）──
        journal_raw = (item.css('span.periodical-title::text').get() or '').strip()
        journal = journal_raw.strip('《》')

        # ── 年份（从"2015年6期"样式中提取）──
        year_str = ''
        for a in item.css('span.authors::text').getall():
            if re.search(r'\d{4}年', a):
                year_str = a
                break
        year = _extract_year(year_str)

        # ── 引用量 / 下载量 ──
        citations = _parse_int(
            next((t for t in item.css('div.stat-item.quote::text').getall() if t.strip()), '0')
            .replace('被引', '').strip()
        )
        downloads = _parse_int(
            next((t for t in item.css('div.stat-item.download::text').getall() if t.strip()), '0')
            .replace('下载', '').strip()
        )

        # ── 万方论文 ID ──
        wf_id = (item.css('span.title-id-hidden::text').get() or '').strip()

        papers.append({
            'title':     title,
            'authors':   all_authors,
            'journal':   journal,
            'year':      year,
            'citations': citations,
            'downloads': downloads,
            'source':    '万方',
            'cnki_id':   wf_id,
        })

    return papers


def scrape_wanfang(keyword: str, session) -> list[dict]:
    url = _WANFANG_URL.format(kw=quote(keyword))
    logger.info('万方搜索（备用）：%s', keyword)
    try:
        # wait_selector 等待真实论文条目渲染完毕
        page = session.fetch(
            url,
            network_idle=True,
            timeout=PAGE_TIMEOUT,
            wait_selector='div.normal-list',
        )
        results = _parse_wanfang_page(page)
        logger.info('万方：解析出 %d 篇论文', len(results))
        return results
    except Exception as exc:
        logger.warning('万方爬取失败（%s）：%s', keyword, exc)
        return []


# ─────────────────────────────────────────────
# 数据合并
# ─────────────────────────────────────────────

def merge_papers(existing: list[dict], new_papers: list[dict], current_year: int) -> list[dict]:
    """将新爬到的论文追加到已有列表（按标题去重，已有数据优先）"""
    existing_titles = {p.get('title', '').strip() for p in existing}
    merged = list(existing)
    added  = 0

    for p in new_papers:
        title = p.get('title', '').strip()
        if not title or title in existing_titles:
            continue
        merged.append({**p, 'score': calculate_score(p, current_year)})
        existing_titles.add(title)
        added += 1

    if added:
        logger.info('新增 %d 篇论文', added)
    return merged


def update_scores(data: dict) -> dict:
    """不依赖网络，重新计算所有论文评分"""
    cy = datetime.now().year
    new_cats = []
    for cat in data.get('categories', []):
        new_topics = []
        for topic in cat.get('topics', []):
            new_papers = [{**p, 'score': calculate_score(p, cy)} for p in topic.get('papers', [])]
            new_topics.append({**topic, 'papers': new_papers})
        new_cats.append({**cat, 'topics': new_topics})
    return {**data, 'categories': new_cats}


# ─────────────────────────────────────────────
# 主爬取流程
# ─────────────────────────────────────────────

def try_update_papers(data: dict, session) -> dict:
    cy = datetime.now().year
    new_cats = []

    all_items = [
        (ci, ti, cat, topic)
        for ci, cat   in enumerate(data.get('categories', []))
        for ti, topic in enumerate(cat.get('topics', []))
    ]
    total = len(all_items)

    for idx, (ci, ti, cat, topic) in enumerate(all_items, 1):
        keyword  = topic.get('keyword') or topic.get('title', '')
        existing = topic.get('papers', [])
        t_name   = topic.get('title', f'话题{idx}')
        logger.info('── [%d/%d] %s', idx, total, t_name)

        # 万方为主要数据源（可稳定访问）；知网作后备但当前环境 SSL 受限
        new_papers = scrape_wanfang(keyword, session)
        if not new_papers:
            logger.info('万方无结果，尝试知网...')
            new_papers = scrape_cnki(keyword, session)

        merged = merge_papers(existing, new_papers, cy) if new_papers else existing
        updated_topic = {**topic, 'papers': merged}

        # 按分类索引收集
        while len(new_cats) <= ci:
            src = data['categories'][len(new_cats)]
            new_cats.append({**src, 'topics': []})
        new_cats[ci]['topics'].append(updated_topic)

        if idx < total:
            delay = random.uniform(DELAY_MIN, DELAY_MAX)
            logger.debug('等待 %.1f 秒...', delay)
            time.sleep(delay)

    return {**data, 'categories': new_cats}


# ─────────────────────────────────────────────
# 文件 I/O
# ─────────────────────────────────────────────

def load_topics() -> dict:
    if not TOPICS_FILE.exists():
        logger.warning('topics.json 不存在，使用空结构')
        return {'categories': []}
    try:
        with TOPICS_FILE.open(encoding='utf-8') as f:
            data = json.load(f)
        topics_count = sum(len(c.get('topics', [])) for c in data.get('categories', []))
        logger.info('读取成功：%d 分类 / %d 话题', len(data.get('categories', [])), topics_count)
        return data
    except json.JSONDecodeError as e:
        # 致命错误：JSON 解析失败时直接中止，绝不用空数据覆盖原文件
        logger.error('topics.json JSON 解析失败，脚本终止以保护原始数据：%s', e)
        raise SystemExit(1)
    except OSError as e:
        logger.error('读取 topics.json 失败：%s', e)
        raise SystemExit(1)


def save_topics(data: dict) -> None:
    today   = datetime.now().strftime('%Y-%m-%d')
    payload = {**data, 'lastUpdated': today}
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    tmp = TOPICS_FILE.with_suffix('.tmp')
    with tmp.open('w', encoding='utf-8') as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    tmp.replace(TOPICS_FILE)
    logger.info('topics.json 已保存')


def save_metadata(data: dict) -> None:
    topics = [t for c in data.get('categories', []) for t in c.get('topics', [])]
    papers = sum(len(t.get('papers', [])) for t in topics)
    today  = datetime.now().strftime('%Y-%m-%d')
    meta   = {
        'lastUpdated':    today,
        'totalTopics':    len(topics),
        'totalPapers':    papers,
        'updateFrequency': '每周一自动更新',
    }
    with METADATA_FILE.open('w', encoding='utf-8') as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)
    logger.info('metadata.json 已保存（话题 %d / 论文 %d）', len(topics), papers)


# ─────────────────────────────────────────────
# 入口
# ─────────────────────────────────────────────

def main() -> None:
    logger.info('========== 史学热点数据更新开始 ==========')
    t0 = time.monotonic()

    data = load_topics()
    data = update_scores(data)  # 先更新评分（不需要网络）

    if not SCRAPLING_AVAILABLE:
        logger.warning('scrapling 未安装，跳过爬取。请运行：')
        logger.warning('  pip install "scrapling[fetchers]"')
        logger.warning('  scrapling install')
    elif data.get('categories'):
        logger.info('启动 Chromium（headless）...')
        try:
            # --ignore-certificate-errors 解决知网 ERR_CERT_COMMON_NAME_INVALID
            with DynamicSession(
                headless=True,
                extra_chromium_args=['--ignore-certificate-errors', '--disable-web-security'],
            ) as session:
                data = try_update_papers(data, session)
        except Exception as exc:
            logger.error('Scrapling 主流程异常：%s，保留现有数据', exc)
    else:
        logger.info('无话题数据，跳过爬取')

    save_topics(data)
    save_metadata(data)
    logger.info('========== 完成，耗时 %.1f 秒 ==========', time.monotonic() - t0)


if __name__ == '__main__':
    main()
