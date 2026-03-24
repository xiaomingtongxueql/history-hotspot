/**
 * 将真实数据填充到 Stitch 生成的 HTML 中
 */

import fs from 'fs';
import path from 'path';

// 读取 Stitch HTML
const stitchHtml = fs.readFileSync('public/v1-museum.html', 'utf8');

// 读取真实数据
const topicsData = JSON.parse(fs.readFileSync('public/data/topics.json', 'utf8'));

// 提取前3个热点
const realTopics = topicsData.categories[0].topics.slice(0, 3);

// 提取前5篇高引用论文
const allPapers = [];
topicsData.categories.forEach(cat => {
  cat.topics.forEach(topic => {
    topic.papers.forEach(paper => {
      allPapers.push({...paper, topic: topic.title});
    });
  });
});
const sortedPapers = allPapers.sort((a, b) => b.citations - a.citations).slice(0, 5);

console.log('真实热点:', realTopics.map(t => t.title));
console.log('真实论文:', sortedPapers.map(p => p.title));

// 替换函数
let html = stitchHtml;

// 1. 替换标题
html = html.replace(/热点论文 - 动态水墨优化版 \| The Scholar's Ledger/g, '热点论文 - 史学研究热点导航');
html = html.replace(/The Scholar's Ledger/g, '热点论文');

// 2. 替换 Featured Research Card (晚清变法与新政)
const topic1 = realTopics[0];
html = html.replace(
  /晚清变法与新政/,
  topic1.title
);
html = html.replace(
  /An exploration of the seismic shifts during the late 19th century, from the Hundred Days' Reform to the twilight of the imperial era\./,
  topic1.description
);
html = html.replace(
  /<span class="font-headline text-primary\/10 text-\[10rem\] font-bold leading-none">清<\/span>/,
  `<span class="font-headline text-primary/10 text-[8rem] font-bold leading-none">研</span>`
);

// 3. 替换三个 Investigation 卡片
const investigations = [
  { title: 'Sanxingdui Sacrifice', cnTitle: '三星堆祭祀坑研究', topic: realTopics[0] },
  { title: 'Song Dynasty Urban Life', cnTitle: '宋代城市商业景观', topic: realTopics[1] || realTopics[0] },
  { title: 'Silk Road Fragments', cnTitle: '丝绸之路文书碎片', topic: realTopics[2] || realTopics[0] }
];

investigations.forEach((inv, i) => {
  // 替换标题
  html = html.replace(
    new RegExp(inv.title, 'g'),
    inv.topic.title
  );
  // 替换中文标题
  html = html.replace(
    new RegExp(inv.cnTitle, 'g'),
    inv.topic.title
  );
});

// 4. 保存结果
fs.writeFileSync('index.html', html, 'utf8');
console.log('✅ 已生成填充真实数据的 index.html');
