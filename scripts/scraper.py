#!/usr/bin/env python3
"""史学热点论文数据更新脚本

用法：
    python scripts/scraper.py

功能：
    - 读取 public/data/topics.json 中的现有数据
    - 重新计算所有论文的热度评分
    - 尝试从知网爬取最新论文数据（失败时保留原数据）
    - 更新 public/data/topics.json 和 public/data/metadata.json
"""

import json
import time
import random
import logging
from datetime import datetime
from pathlib import Path
from urllib.parse import quote

import requests
from bs4 import BeautifulSoup


# ──────────────────────────────────────────────
# 配置
# ──────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
)
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / 'public' / 'data'
TOPICS_FILE = DATA_DIR / 'topics.json'
METADATA_FILE = DATA_DIR / 'metadata.json'

CNKI_SEARCH_URL = (
    'https://kns.cnki.net/kns8s/defaultresult/index'
    '?kw={keyword}&crossdb=1'
)

REQUEST_HEADERS = {
    'User-Agent': (
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
        'AppleWebKit/537.36 (KHTML, like Gecko) '
        'Chrome/120.0.0.0 Safari/537.36'
    ),
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
}

REQUEST_TIMEOUT = 15  # 秒
MAX_RESULTS_PER_TOPIC = 5
DELAY_MIN = 2.0  # 礼貌延迟下界（秒）
DELAY_MAX = 4.0  # 礼貌延迟上界（秒）


# ──────────────────────────────────────────────
# 评分算法
# ──────────────────────────────────────────────

def calculate_score(paper: dict, current_year: int) -> float:
    """根据引用量、下载量和时效性计算论文热度评分（0-10）。

    权重：引用量 50%，下载量 30%，时效性 20%。
    """
    age = max(0, current_year - paper.get('year', current_year))
    recency = max(0, 10 - age)
    norm_citations = min(paper.get('citations', 0) / 100, 10)
    norm_downloads = min(paper.get('downloads', 0) / 1000, 10)
    score = norm_citations * 0.5 + norm_downloads * 0.3 + recency * 0.2
    return round(score, 1)


# ──────────────────────────────────────────────
# 知网爬取
# ──────────────────────────────────────────────

def _parse_cnki_results(html: str) -> list[dict]:
    """从知网搜索结果页面解析论文列表。

    知网页面结构可能随时变化，解析失败时返回空列表。
    """
    papers = []
    try:
        soup = BeautifulSoup(html, 'lxml')

        # 知网结果条目选择器（基于 kns8s 结果页结构）
        items = soup.select('div.result-item-wrap') or soup.select('tr.odd, tr.even')
        if not items:
            logger.debug('未找到已知的结果条目选择器，尝试备用选择器')
            items = soup.select('[class*="result"]')

        for item in items[:MAX_RESULTS_PER_TOPIC]:
            title_tag = (
                item.select_one('a.fz14')
                or item.select_one('.title a')
                or item.select_one('a[href*="detail"]')
            )
            if not title_tag:
                continue

            title = title_tag.get_text(strip=True)
            if not title:
                continue

            # 尝试提取年份
            year = datetime.now().year
            year_tag = item.select_one('.year') or item.select_one('[class*="year"]')
            if year_tag:
                year_text = year_tag.get_text(strip=True)
                digits = ''.join(filter(str.isdigit, year_text))
                if len(digits) == 4:
                    year = int(digits)

            # 引用量和下载量在知网详情页，搜索列表页通常不展示，默认为 0
            paper = {
                'title': title,
                'year': year,
                'citations': 0,
                'downloads': 0,
            }
            papers.append(paper)

    except Exception as exc:
        logger.warning('解析知网结果时出错：%s', exc)

    return papers


def search_cnki(keyword: str, max_results: int = MAX_RESULTS_PER_TOPIC, session: requests.Session = None) -> list[dict]:
    """在知网搜索关键词，返回论文列表。

    遭遇任何错误（网络超时、反爬、解析失败）时返回空列表，
    由调用方决定降级处理策略。
    """
    url = CNKI_SEARCH_URL.format(keyword=quote(keyword))
    logger.info('正在搜索知网：%s  URL: %s', keyword, url)

    requester = session if session is not None else requests
    try:
        response = requester.get(
            url,
            headers=REQUEST_HEADERS,
            timeout=REQUEST_TIMEOUT,
            allow_redirects=True,
        )
        response.raise_for_status()
    except requests.exceptions.Timeout:
        logger.warning('知网请求超时（关键词：%s）', keyword)
        return []
    except requests.exceptions.TooManyRedirects:
        logger.warning('知网请求重定向过多（关键词：%s）', keyword)
        return []
    except requests.exceptions.HTTPError as exc:
        logger.warning('知网 HTTP 错误 %s（关键词：%s）', exc.response.status_code, keyword)
        return []
    except requests.exceptions.ConnectionError as exc:
        logger.warning('知网连接失败（关键词：%s）：%s', keyword, exc)
        return []
    except requests.exceptions.RequestException as exc:
        logger.warning('知网请求异常（关键词：%s）：%s', keyword, exc)
        return []

    # 检测反爬响应（验证码页面、空内容等）
    content_length = len(response.text)
    if content_length < 500:
        logger.warning('知网响应内容过短（%d 字节），疑似反爬（关键词：%s）', content_length, keyword)
        return []

    if '验证码' in response.text or 'captcha' in response.text.lower():
        logger.warning('知网返回验证码页面，跳过（关键词：%s）', keyword)
        return []

    papers = _parse_cnki_results(response.text)
    logger.info('知网搜索完成，获取 %d 条结果（关键词：%s）', len(papers), keyword)
    return papers[:max_results]


# ──────────────────────────────────────────────
# 数据处理
# ──────────────────────────────────────────────

def update_scores(data: dict) -> dict:
    """遍历所有主题的论文，重新计算热度评分，返回更新后的数据副本。"""
    current_year = datetime.now().year
    updated_categories = []

    for category in data.get('categories', []):
        updated_topics = []
        for topic in category.get('topics', []):
            updated_papers = []
            for paper in topic.get('papers', []):
                updated_paper = {**paper, 'score': calculate_score(paper, current_year)}
                updated_papers.append(updated_paper)

            updated_topic = {**topic, 'papers': updated_papers}
            updated_topics.append(updated_topic)

        updated_category = {**category, 'topics': updated_topics}
        updated_categories.append(updated_category)

    return {**data, 'categories': updated_categories}


def _merge_papers(existing_papers: list[dict], new_papers: list[dict], current_year: int) -> list[dict]:
    """将爬取到的新论文与现有论文合并。

    - 按标题去重（已有的保留，不覆盖）
    - 新增论文计算初始评分
    """
    existing_titles = {p.get('title', '').strip() for p in existing_papers}
    merged = list(existing_papers)

    added = 0
    for paper in new_papers:
        title = paper.get('title', '').strip()
        if not title or title in existing_titles:
            continue
        new_paper = {
            'title': title,
            'year': paper.get('year', current_year),
            'citations': paper.get('citations', 0),
            'downloads': paper.get('downloads', 0),
            'authors': [],
            'score': calculate_score(paper, current_year),
        }
        merged.append(new_paper)
        existing_titles.add(title)
        added += 1

    if added:
        logger.info('新增 %d 篇论文', added)

    return merged


def try_update_papers(data: dict, session: requests.Session = None) -> dict:
    """尝试为每个主题爬取知网数据。

    单个主题爬取失败时记录日志并继续，不中断整体流程（降级处理）。
    """
    current_year = datetime.now().year
    updated_categories = []

    all_topics = [
        (category_idx, topic_idx, category, topic)
        for category_idx, category in enumerate(data.get('categories', []))
        for topic_idx, topic in enumerate(category.get('topics', []))
    ]
    total_topics = len(all_topics)

    processed = 0
    for category_idx, topic_idx, category, topic in all_topics:
        processed += 1
        topic_name = topic.get('name', topic.get('title', f'主题{processed}'))
        logger.info('处理主题 %d/%d：%s', processed, total_topics, topic_name)

        keyword = topic.get('keyword') or topic_name
        existing_papers = topic.get('papers', [])

        try:
            new_papers = search_cnki(keyword, session=session)
            if new_papers:
                merged_papers = _merge_papers(existing_papers, new_papers, current_year)
                updated_topic = {**topic, 'papers': merged_papers}
            else:
                logger.info('未获取到新论文，保留原有数据（主题：%s）', topic_name)
                updated_topic = topic
        except Exception as exc:
            logger.error('处理主题 %s 时发生意外错误：%s，保留原有数据', topic_name, exc)
            updated_topic = topic

        # 在对应 category 的 updated_topics 列表中记录结果
        # 按 category 分组收集
        while len(updated_categories) <= category_idx:
            src = data['categories'][len(updated_categories)]
            updated_categories.append({**src, 'topics': []})
        updated_categories[category_idx]['topics'].append(updated_topic)

        # 礼貌延迟，避免触发反爬
        if processed < total_topics:
            delay = random.uniform(DELAY_MIN, DELAY_MAX)
            logger.debug('等待 %.1f 秒后继续...', delay)
            time.sleep(delay)

    return {**data, 'categories': updated_categories}


# ──────────────────────────────────────────────
# 文件 I/O
# ──────────────────────────────────────────────

def load_topics() -> dict:
    """读取 topics.json，若文件不存在则返回空结构。"""
    if not TOPICS_FILE.exists():
        logger.warning('topics.json 不存在，将使用空数据结构：%s', TOPICS_FILE)
        return {'categories': []}

    try:
        with TOPICS_FILE.open(encoding='utf-8') as fh:
            data = json.load(fh)
        total_topics = sum(
            len(cat.get('topics', []))
            for cat in data.get('categories', [])
        )
        logger.info('成功读取 topics.json，共 %d 个分类，%d 个主题',
                    len(data.get('categories', [])), total_topics)
        return data
    except json.JSONDecodeError as exc:
        logger.error('topics.json 解析失败：%s，将使用空数据结构', exc)
        return {'categories': []}
    except OSError as exc:
        logger.error('读取 topics.json 失败：%s，将使用空数据结构', exc)
        return {'categories': []}


def save_topics(data: dict) -> None:
    """将更新后的数据写回 topics.json（原子写入）。"""
    today = datetime.now().strftime('%Y-%m-%d')
    updated_data = {**data, 'lastUpdated': today}

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    tmp_path = TOPICS_FILE.with_suffix('.tmp')
    try:
        with tmp_path.open('w', encoding='utf-8') as fh:
            json.dump(updated_data, fh, ensure_ascii=False, indent=2)
        tmp_path.replace(TOPICS_FILE)
        logger.info('topics.json 保存成功：%s', TOPICS_FILE)
    except OSError as exc:
        logger.error('保存 topics.json 失败：%s', exc)
        raise


def save_metadata(data: dict) -> None:
    """根据当前数据生成并保存 metadata.json。"""
    topics = [
        topic
        for category in data.get('categories', [])
        for topic in category.get('topics', [])
    ]
    total_papers = sum(len(t.get('papers', [])) for t in topics)
    today = datetime.now().strftime('%Y-%m-%d')

    metadata = {
        'lastUpdated': today,
        'totalTopics': len(topics),
        'totalPapers': total_papers,
        'updateFrequency': '每周一自动更新',
    }

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    try:
        with METADATA_FILE.open('w', encoding='utf-8') as fh:
            json.dump(metadata, fh, ensure_ascii=False, indent=2)
        logger.info('metadata.json 保存成功（主题数：%d，论文数：%d）', len(topics), total_papers)
    except OSError as exc:
        logger.error('保存 metadata.json 失败：%s', exc)
        raise


# ──────────────────────────────────────────────
# 入口
# ──────────────────────────────────────────────

def main() -> None:
    """主流程：读取 → 更新评分 → 尝试爬取 → 保存。"""
    logger.info('========== 史学热点数据更新开始 ==========')
    start_time = time.monotonic()

    # 1. 读取现有数据
    data = load_topics()

    # 2. 重新计算所有论文评分（不依赖网络，始终执行）
    logger.info('正在更新论文评分...')
    data = update_scores(data)

    # 3. 尝试从知网爬取新论文（失败时降级保留原数据）
    session = requests.Session()
    session.headers.update(REQUEST_HEADERS)
    if data.get('categories'):
        logger.info('正在尝试从知网爬取最新论文数据...')
        data = try_update_papers(data, session=session)
    else:
        logger.info('暂无主题数据，跳过爬取步骤')

    # 4. 保存数据
    save_topics(data)
    save_metadata(data)

    elapsed = time.monotonic() - start_time
    logger.info('========== 更新完成，耗时 %.1f 秒 ==========', elapsed)


if __name__ == '__main__':
    main()
