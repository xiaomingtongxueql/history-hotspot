/**
 * 完整替换 Stitch HTML 中的英文内容为中文
 * 并填充真实数据
 */

import fs from 'fs';

// 读取 Stitch HTML
let html = fs.readFileSync('public/v1-museum.html', 'utf8');

// 读取真实数据
const topicsData = JSON.parse(fs.readFileSync('public/data/topics.json', 'utf8'));
const metadata = JSON.parse(fs.readFileSync('public/data/metadata.json', 'utf8'));

// 获取前3个热点
const realTopics = [];
topicsData.categories.forEach(cat => {
  cat.topics.forEach(topic => {
    realTopics.push({...topic, category: cat.name, categoryIcon: cat.icon});
  });
});
const topTopics = realTopics.slice(0, 3);

// 获取高引用论文
const allPapers = [];
realTopics.forEach(topic => {
  topic.papers.forEach(paper => {
    allPapers.push({
      ...paper,
      topicTitle: topic.title,
      category: topic.category
    });
  });
});
const topPapers = allPapers.sort((a, b) => b.citations - a.citations).slice(0, 5);

console.log('Top topics:', topTopics.map(t => t.title));
console.log('Top papers:', topPapers.map(p => p.title));

// 1. 基础替换
html = html.replace(/The Scholar's Ledger/g, '热点论文');
html = html.replace(/热点论文 - 动态水墨优化版 \| 热点论文/g, '热点论文 - 史学研究热点导航');

// 2. 导航菜单翻译
html = html.replace(/Eras/g, '时代');
html = html.replace(/Manuscripts/g, '手稿');
html = html.replace(/Calligraphy/g, '书法');
html = html.replace(/Maps/g, '地图');
html = html.replace(/Archive/g, '档案');
html = html.replace(/Search Archives\.\.\./g, '搜索论文...');

// 3. 侧边栏翻译
html = html.replace(/Chronicles/g, '编年史');
html = html.replace(/Imperial Seals/g, '印玺');
html = html.replace(/Poetry/g, '诗词');
html = html.replace(/Lineage/g, '世系');
html = html.replace(/Reference/g, '参考');

// 4. 标题区翻译
html = html.replace(/Current Research Hotspots/g, '当前研究热点');
html = html.replace(/Exploring the echoes of empires through digital curation and historical forensics\./g, '汇聚权威期刊高引用论文，为历史学研究者提供一站式学术资源导航。');
html = html.replace(/(\d+,?\d*)\s*Archived Records/g, (match, num) => `${metadata.totalPapers} 收录论文`);
html = html.replace(/MMXXIV/g, '2024');

// 5. 精选热点区替换
const topic1 = topTopics[0];
html = html.replace(/Featured Exhibit/g, '精选热点');
html = html.replace(/晚清变法与新政/, topic1.title);
html = html.replace(/An exploration of the seismic shifts during the late 19th century, from the Hundred Days' Reform to the twilight of the imperial era\./, topic1.description);
html = html.replace(/ENTER ARCHIVE/, '查看详情');
html = html.replace(/Updated 2 days ago/, `更新于 ${metadata.lastUpdated}`);

// 6. 研究热点卡片替换
const investigationTitles = [
  { old: 'Sanxingdui Sacrifice', new: topTopics[0]?.title || '古代地理文献' },
  { old: '三星堆祭祀坑研究', new: topTopics[0]?.title || '古代地理文献' },
  { old: 'SHU ARCHAEOLOGY', new: '中国古代史' },
  
  { old: 'Song Dynasty Urban Life', new: topTopics[1]?.title || '早期中国研究' },
  { old: '宋代城市商业景观', new: topTopics[1]?.title || '早期中国研究' },
  { old: 'SOCIOLOGY', new: '中国古代史' },
  
  { old: 'Silk Road Fragments', new: topTopics[2]?.title || '唐宋明清制度' },
  { old: '丝绸之路文书碎片', new: topTopics[2]?.title || '唐宋明清制度' },
  { old: 'PALAEOGRAPHY', new: '中国古代史' }
];

investigationTitles.forEach(({old, new: newText}) => {
  html = html.replace(new RegExp(old, 'g'), newText);
});

// 替换引用数
html = html.replace(/1,402 CITATIONS/, `${topTopics[0]?.papers?.[0]?.citations || 42} 引用`);
html = html.replace(/3,891 CITATIONS/, `${topTopics[1]?.papers?.[0]?.citations || 25} 引用`);
html = html.replace(/924 CITATIONS/, `${topTopics[2]?.papers?.[0]?.citations || 18} 引用`);

// 7. 底部区域翻译
html = html.replace(/Spatial Archives/g, '空间档案');
html = html.replace(/Maritime Silk Road Expansion/g, '海上丝绸之路扩展');
html = html.replace(/Tracking trade-wind dynamics and pottery shipwrecks between the 9th and 13th centuries\./g, '追踪9至13世纪的贸易风动态与陶瓷沉船。');
html = html.replace(/Imperial Capital Relocations/g, '帝都迁徙');
html = html.replace(/A strategic overview of capital shifts from Chang'an to Luoyang across five dynasties\./g, '从长安到洛阳，跨越五朝的帝都战略迁徙概览。');

// 8. Footer 翻译
html = html.replace(/© MMXXIV 热点论文\. All Rights Reserved\. Institutional Partner of the National Academy\./g, 
  `© 2024 热点论文 · 史学研究热点导航 · 数据每周自动更新`);
html = html.replace(/Privacy Policy/g, '隐私政策');
html = html.replace(/Institutional Access/g, '机构访问');
html = html.replace(/Citations/g, '引用');
html = html.replace(/Contact Archivist/g, '联系管理员');
html = html.replace(/Digitally Preserved/g, '数字化保存');

// 9. 替换 Ongoing Investigations 标题
html = html.replace(/Ongoing Investigations/g, '正在研究');
html = html.replace(/View All Folders/g, '查看全部');

// 保存
fs.writeFileSync('index.html', html, 'utf8');
console.log('✅ 已生成完整中文版本 index.html');
