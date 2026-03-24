import { createRequire } from 'module';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 使用 puppeteer-extra + stealth 插件完全伪装成真人浏览器
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

/**
 * 历史研究热点 - 知网真实论文抓取工具 v2.0
 *
 * 核心改进：
 * - 使用 puppeteer-extra + stealth 插件绕过知网 HTTP 418 反机器人检测
 * - 真正打开知网搜索页面，逐字输入关键词，等待结果加载
 * - 支持滑块验证码暂停等待（由您手动拖拽）
 * - 成功抓取后直接覆写 public/data/topics.json
 */

const topicsPath = path.join(__dirname, '../public/data/topics.json');
const CNKI_SEARCH_URL = 'https://kns.cnki.net/kns8/defaultresult/index';

// 支持的通用检索关键词（每个 category 一组）
const SEARCH_QUERIES = [
    { category: 'ancient-china', topic: 'ancient-china-001', query: '汉简秦简制度史', yearFrom: 2021 },
    { category: 'ancient-china', topic: 'ancient-china-002', query: '唐宋社会转型', yearFrom: 2021 },
    { category: 'modern-china', topic: 'modern-china-001', query: '晚清新政改革', yearFrom: 2021 },
    { category: 'modern-china', topic: 'modern-china-002', query: '民国社会史抗战', yearFrom: 2021 },
    { category: 'prc-history', topic: 'prc-history-001', query: '改革开放历史', yearFrom: 2021 },
    { category: 'world-ancient', topic: 'world-ancient-001', query: '古代希腊罗马帝国', yearFrom: 2021 },
    { category: 'southwest-univ', topic: 'southwest-univ-001', query: '修昔底德 西南大学', yearFrom: 2021 },
];

// 随机延迟，模拟人类操作节奏（ms）
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const humanDelay = () => sleep(800 + Math.random() * 1200);

async function extractPapersFromPage(page) {
    return await page.evaluate(() => {
        const results = [];
        const rows = document.querySelectorAll('table.result-table-list tbody tr');
        for (let i = 0; i < Math.min(5, rows.length); i++) {
            const tr = rows[i];
            const titleEl = tr.querySelector('.name a, td:nth-child(2) a');
            const title = titleEl ? titleEl.innerText.trim() : null;
            if (!title) continue;

            const authorEls = tr.querySelectorAll('.author a, td:nth-child(3) a');
            const authors = Array.from(authorEls).map(a => a.innerText.trim()).filter(Boolean);

            const sourceEl = tr.querySelector('.source a, td:nth-child(4) a');
            const journal = sourceEl ? sourceEl.innerText.trim() : '未知期刊';

            const dateEl = tr.querySelector('.date, td:nth-child(5)');
            const dateStr = dateEl ? dateEl.innerText.trim() : '';
            const yearMatch = dateStr.match(/\d{4}/);
            const year = yearMatch ? parseInt(yearMatch[0]) : 2023;

            const quoteEl = tr.querySelector('.quote, td:nth-child(6)');
            const downloadEl = tr.querySelector('.download, td:nth-child(7)');
            const citations = quoteEl ? parseInt(quoteEl.innerText.trim()) || 0 : 0;
            const downloads = downloadEl ? parseInt(downloadEl.innerText.trim()) || 0 : 0;
            const score = parseFloat(Math.min(9.9, 7.0 + citations / 80 + downloads / 5000).toFixed(1));

            results.push({ title, authors: authors.length ? authors : ['佚名'], journal, year, citations, downloads, score, source: '知网' });
        }
        return results;
    });
}

async function searchOnCNKI(page, query) {
    console.log(`\n🔍 检索关键词: 【${query}】`);

    // 进入检索页
    await page.goto(CNKI_SEARCH_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await sleep(2000);

    // 🧩 检测是否有 iframe 方式的验证码（知网有时会用 iframe 弹出验证）
    const frames = await page.frames();
    console.log(`📄 当前页面共 ${frames.length} 个 frame`);

    // 找搜索框，知网搜索框有多个候选 selector
    const searchSelectors = [
        '#txt_SearchText',
        '.search-input input',
        'input[placeholder*="检索"]',
        'input[name="txt_SearchText"]',
        '.search-box input[type="text"]'
    ];

    let searchInput = null;
    for (const sel of searchSelectors) {
        try {
            await page.waitForSelector(sel, { timeout: 5000 });
            searchInput = sel;
            console.log(`✅ 找到搜索框: ${sel}`);
            break;
        } catch (e) {
            // 继续找下一个
        }
    }

    if (!searchInput) {
        console.log('⚠️ 找不到搜索框，可能遇到了验证码页面。');
        console.log('👉 请您在弹出的浏览器里手动操作：完成验证后，输入关键词并搜索。');
        console.log('⏳ 脚本将等待 60 秒，等待您手动完成...');
        try {
            await page.waitForSelector('table.result-table-list tbody tr', { timeout: 60000 });
            console.log('✅ 检测到结果出现，开始提取！');
            return await extractPapersFromPage(page);
        } catch {
            console.log('❌ 超时，跳过此关键词。');
            return [];
        }
    }

    // 清空并输入关键词（模拟人类打字）
    await page.click(searchInput, { clickCount: 3 });
    await humanDelay();
    await page.keyboard.type(query, { delay: 100 });
    await humanDelay();

    // 点击搜索按钮
    const btnSelectors = ['.search-btn', 'button[type="submit"]', '#btnSearch', '.btn-search'];
    for (const btnSel of btnSelectors) {
        try {
            await page.click(btnSel);
            console.log(`🖱️ 点击搜索按钮: ${btnSel}`);
            break;
        } catch { /* ignore */ }
    }

    // 等待结果加载，或等待验证码出现（最多 45 秒）
    console.log('⏳ 等待搜索结果（若有验证码请手动拖动滑块，最多等 45 秒）...');
    try {
        await page.waitForSelector('table.result-table-list tbody tr', { timeout: 45000 });
        console.log('✅ 结果已加载，开始提取...');
        return await extractPapersFromPage(page);
    } catch {
        console.log('⚠️ 45秒内未检测到结果，跳过此关键词。');
        return [];
    }
}

async function scrapeCNKI() {
    console.log('🚀 [系统] 正在启动知网真实隐身爬虫（已启用 Stealth 反检测模式）...');

    if (!fs.existsSync(topicsPath)) {
        console.error('❌ 找不到 topics.json！请确认您在根目录下运行。');
        return;
    }

    const db = JSON.parse(fs.readFileSync(topicsPath, 'utf8'));

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: [
            '--start-maximized',
            '--ignore-certificate-errors',
            '--disable-blink-features=AutomationControlled',
        ]
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

    // 先打开知网首页，让 Cookie 正常建立
    console.log('🌐 打开知网首页建立 Cookie...');
    await page.goto('https://www.cnki.net', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await sleep(3000); // 等页面稳定

    let updated = 0;

    for (const task of SEARCH_QUERIES) {
        console.log(`\n📚 正在处理: [${task.category}] -> [${task.topic}]`);
        try {
            const papers = await searchOnCNKI(page, task.query);
            if (papers.length === 0) {
                console.log('⚠️ 未抓取到任何论文，跳过。');
                continue;
            }

            // 过滤近五年（2021年及以后）的论文
            const recentPapers = papers.filter(p => p.year >= 2021);
            if (recentPapers.length === 0) {
                console.log(`⚠️ 无2021年后的论文，跳过。`);
                continue;
            }

            // 写入对应的 category/topic
            const cat = db.categories.find(c => c.id === task.category);
            if (cat) {
                const topicObj = cat.topics.find(t => t.id === task.topic);
                if (topicObj) {
                    topicObj.papers = recentPapers;
                    updated++;
                    console.log(`💾 成功写入 ${recentPapers.length} 篇真实论文！`);
                }
            }

            // 每次搜索完后随机等一会儿，防止连续请求被封
            const pause = 5000 + Math.random() * 5000;
            console.log(`  ⏸ 等待 ${(pause / 1000).toFixed(1)}s 避免反爬封禁...`);
            await sleep(pause);

        } catch (err) {
            console.error(`❌ 抓取失败: ${err.message}`);
        }
    }

    if (updated > 0) {
        db.lastUpdated = new Date().toISOString().split('T')[0];
        fs.writeFileSync(topicsPath, JSON.stringify(db, null, 2), 'utf8');
        console.log(`\n🎉 更新完成！共成功更新 ${updated} 个话题的真实数据。`);
        console.log('👉 刷新您的网站 http://127.0.0.1:5173 即可看到最新真实论文！');
    } else {
        console.log('\n⚠️ 本次运行没有任何数据被成功抓取。请检查网络或手动操作。');
    }

    console.log('\n🛑 浏览器将在 5 秒后关闭...');
    await sleep(5000);
    await browser.close();
}

scrapeCNKI().catch(console.error);
