/**
 * 生成完整的动态页面，使用真实数据
 */

import fs from 'fs';

// 读取真实数据
const topicsData = JSON.parse(fs.readFileSync('public/data/topics.json', 'utf8'));
const metadata = JSON.parse(fs.readFileSync('public/data/metadata.json', 'utf8'));

// 处理数据
const allTopics = [];
const allPapers = [];
topicsData.categories.forEach(cat => {
  cat.topics.forEach(topic => {
    allTopics.push({...topic, category: cat.name, categoryIcon: cat.icon});
    topic.papers.forEach(paper => {
      allPapers.push({...paper, topicTitle: topic.title, category: cat.name});
    });
  });
});

// 按引用排序
const sortedPapers = allPapers.sort((a, b) => b.citations - a.citations);
const topPapers = sortedPapers.slice(0, 8);
const topTopics = allTopics.slice(0, 6);

// 生成 HTML
const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>热点论文 - 史学研究热点导航</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&family=Newsreader:ital,wght@0,400;0,600&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Noto Serif SC', serif; background: #f9f9f7; }
    .font-display { font-family: 'Noto Serif SC', serif; }
    .font-body { font-family: 'Newsreader', 'Noto Serif SC', serif; }
    .ink-bg {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1;
      background: radial-gradient(circle at 20% 30%, rgba(120, 86, 0, 0.05) 0%, transparent 50%),
                  radial-gradient(circle at 80% 70%, rgba(26, 24, 20, 0.03) 0%, transparent 60%);
      filter: blur(60px);
      animation: inkFlow 20s ease-in-out infinite;
    }
    @keyframes inkFlow {
      0% { transform: translate(0, 0) scale(1); opacity: 0.3; }
      50% { transform: translate(5%, 2%) scale(1.1); opacity: 0.5; }
      100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
    }
    .paper-texture { position: fixed; inset: 0; z-index: -2; background-color: #f9f9f7; opacity: 0.4; }
    .card-hover { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer; }
    .card-hover:hover { transform: translateY(-8px); box-shadow: 0 24px 48px rgba(0,0,0,0.12); }
    .vertical-text { writing-mode: vertical-rl; text-orientation: mixed; }
    .modal { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 100; backdrop-filter: blur(8px); }
    .modal.active { display: flex; align-items: center; justify-content: center; }
  </style>
</head>
<body class="text-[#1a1c1b]">
  <div class="paper-texture"></div>
  <div class="ink-bg"></div>

  <!-- Navigation -->
  <nav class="w-full bg-[#f9f9f7] flex justify-between items-center px-8 py-6 max-w-[1920px] mx-auto sticky top-0 z-50 border-b border-[#d3c4af]/20">
    <div class="flex items-center gap-8">
      <span class="text-2xl font-bold tracking-[0.2em] font-serif">热点论文</span>
      <div class="hidden md:flex space-x-8">
        <a href="#topics" class="font-serif text-lg tracking-wide opacity-60 hover:text-[#785600] transition-colors">研究热点</a>
        <a href="#papers" class="font-serif text-lg tracking-wide opacity-60 hover:text-[#785600] transition-colors">论文排行</a>
        <a href="#" class="font-serif text-lg tracking-wide text-[#785600] border-t-2 border-[#785600] pt-1 font-bold">档案</a>
      </div>
    </div>
    <div class="flex items-center gap-4">
      <div class="relative">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#785600]">search</span>
        <input type="text" id="searchInput" placeholder="搜索论文..." class="bg-transparent border-b border-[#817563]/40 focus:border-[#785600] px-10 py-1 font-serif text-sm w-64 transition-all" onkeyup="searchPapers(this.value)">
      </div>
    </div>
  </nav>

  <!-- Side Navigation -->
  <aside class="fixed left-0 top-1/4 flex flex-col space-y-12 items-center px-4 z-40">
    <div class="flex flex-col items-center space-y-12">
      <div class="flex flex-col items-center group cursor-pointer" onclick="document.getElementById('topics').scrollIntoView({behavior:'smooth'})">
        <span class="material-symbols-outlined text-[#1a1c1b]/40 group-hover:text-[#785600]">history_edu</span>
        <span class="text-[10px] uppercase tracking-[0.2em] font-serif vertical-text mt-2 text-[#1a1c1b]/40 group-hover:text-[#785600]">编年史</span>
      </div>
      <div class="flex flex-col items-center group cursor-pointer" onclick="document.getElementById('papers').scrollIntoView({behavior:'smooth'})">
        <span class="material-symbols-outlined text-[#785600] scale-110 font-black">approval</span>
        <span class="text-[10px] uppercase tracking-[0.2em] font-serif vertical-text mt-2 text-[#785600] font-black">论文</span>
      </div>
    </div>
  </aside>

  <!-- Main Content -->
  <main class="max-w-[1600px] mx-auto px-8 md:pl-32 pt-20">
    
    <!-- Header -->
    <header class="mb-24 flex items-end justify-between border-b border-[#d3c4af]/20 pb-12">
      <div class="max-w-2xl">
        <span class="font-body text-[#785600] text-xs uppercase tracking-[0.3em] font-bold block mb-2">每周自动更新 · ${topicsData.lastUpdated}</span>
        <h1 class="text-6xl md:text-7xl font-bold tracking-tighter mb-4 leading-tight">史学研究<br><span class="text-[#785600]">热点导航</span></h1>
        <p class="text-xl text-[#4f4535] max-w-lg font-body italic">汇聚十五大史学研究领域，精选权威期刊高引用论文。</p>
      </div>
      <div class="text-right">
        <div class="flex flex-col items-end">
          <span class="text-6xl font-black text-[#4f4535] tabular-nums">${allPapers.length}</span>
          <span class="text-sm text-[#4f4535]/60 italic">收录论文</span>
        </div>
        <p class="text-4xl font-serif font-bold mt-8">${new Date().getFullYear()}</p>
      </div>
    </header>

    <!-- Featured Topic -->
    <section class="mb-24">
      <div class="grid grid-cols-12 gap-0 bg-[#f4f4f2] overflow-hidden relative group border-l-4 border-[#785600]/20">
        <div class="col-span-12 md:col-span-7 relative h-[500px] overflow-hidden">
          <img src="https://images.unsplash.com/photo-1533669955142-6a73332af4db?w=1200&h=800&fit=crop" class="w-full h-full object-cover grayscale contrast-125 brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700">
          <div class="absolute inset-0 bg-gradient-to-r from-[#f4f4f2] via-transparent to-transparent"></div>
        </div>
        <div class="col-span-12 md:col-span-5 p-12 flex flex-col justify-center relative">
          <div class="absolute top-0 right-0 p-8">
            <span class="font-serif text-[#785600]/10 text-[8rem] font-bold leading-none">研</span>
          </div>
          <div class="relative z-10">
            <span class="inline-block bg-[#785600] text-white px-3 py-1 text-[10px] tracking-[0.2em] mb-6 uppercase font-bold">精选热点</span>
            <h2 class="text-4xl font-bold mb-4 leading-tight">${topTopics[0].title}</h2>
            <p class="text-lg text-[#4f4535] mb-8 leading-relaxed font-body">${topTopics[0].description}</p>
            <div class="flex items-center space-x-8">
              <button onclick="openTopic(0)" class="bg-[#785600] text-white px-8 py-3 text-sm font-bold tracking-widest hover:brightness-110 transition-all">查看详情</button>
              <span class="text-xs text-[#1a1c1b]/40">${topTopics[0].papers.length} 篇论文</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Topics Grid -->
    <section id="topics" class="mb-24">
      <div class="flex items-center justify-between mb-12">
        <h3 class="text-3xl font-bold">研究热点</h3>
        <div class="h-px bg-[#d3c4af]/20 flex-grow mx-8"></div>
        <button class="text-[#785600] text-sm tracking-widest uppercase flex items-center gap-2 font-bold">
          查看全部 <span class="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        ${topTopics.slice(0, 6).map((topic, index) => `
        <article class="bg-white p-8 card-hover border border-[#e2e3e1]" onclick="openTopic(${index})">
          <div class="flex items-start justify-between mb-4">
            <span class="text-5xl font-serif text-[#d3c4af] font-bold">${String(index + 1).padStart(2, '0')}</span>
            <span class="text-xs bg-[#f4f4f2] px-3 py-1">${topic.papers.length} 篇论文</span>
          </div>
          <h4 class="text-xl font-bold mb-2 hover:text-[#785600]">${topic.title}</h4>
          <p class="text-[#4f4535] text-sm mb-4 line-clamp-2 font-body">${topic.description}</p>
          <div class="flex items-center justify-between text-xs text-[#817563]">
            <span>${topic.categoryIcon} ${topic.category}</span>
            <span class="text-[#785600]">最高引用 ${Math.max(...topic.papers.map(p => p.citations))}</span>
          </div>
        </article>
        `).join('')}
      </div>
    </section>

    <!-- Papers List -->
    <section id="papers" class="mb-24">
      <h3 class="text-3xl font-bold mb-12 text-center">高引用论文排行</h3>
      <div class="space-y-4">
        ${topPapers.map((paper, index) => `
        <div class="bg-white p-6 border border-[#e2e3e1] flex items-start gap-4 hover:border-[#785600]/30 transition-colors cursor-pointer" onclick="showPaperDetail(${index})">
          <div class="w-12 h-12 ${index < 3 ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white' : 'bg-[#f4f4f2] text-[#1a1c1b]'} rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0">
            ${index + 1}
          </div>
          <div class="flex-1">
            <h4 class="font-bold mb-1 hover:text-[#785600]">${paper.title}</h4>
            <p class="text-sm text-[#4f4535] mb-2">${paper.authors.join('、')} · ${paper.journal || '未知期刊'} · ${paper.year}年</p>
            <div class="flex items-center gap-4 text-xs text-[#817563]">
              <span>引用 ${paper.citations}</span>
              <span>下载 ${paper.downloads || 0}</span>
              <span class="text-[#785600] bg-[#785600]/10 px-2 py-0.5">${paper.source}</span>
            </div>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-[#785600]">${paper.score}</div>
            <div class="text-xs text-[#817563]">评分</div>
          </div>
        </div>
        `).join('')}
      </div>
    </section>

  </main>

  <!-- Footer -->
  <footer class="bg-[#f9f9f7] flex flex-col md:flex-row justify-between items-center px-16 py-12 w-full mt-24 border-t border-[#d3c4af]/20">
    <div class="flex flex-col items-start mb-8 md:mb-0">
      <span class="text-sm font-bold font-serif mb-2">热点论文</span>
      <p class="font-serif text-xs italic tracking-tight text-[#785600] max-w-xs">© ${new Date().getFullYear()} 热点论文 · 史学研究热点导航 · 数据每周自动更新</p>
    </div>
    <div class="flex flex-wrap justify-center gap-8">
      <a href="#" class="font-serif text-xs text-[#1a1c1b]/60 hover:text-[#785600] transition-all">隐私政策</a>
      <a href="#" class="font-serif text-xs text-[#1a1c1b]/60 hover:text-[#785600] transition-all">数据说明</a>
      <a href="#" class="font-serif text-xs text-[#1a1c1b]/60 hover:text-[#785600] transition-all">联系我们</a>
    </div>
    <div class="mt-8 md:mt-0 flex space-x-4 items-center">
      <span class="text-[10px] uppercase tracking-widest text-[#817563]">数字化保存</span>
      <div class="w-2 h-2 rounded-full bg-[#785600] animate-pulse"></div>
    </div>
  </footer>

  <!-- Modal -->
  <div id="topicModal" class="modal" onclick="closeModal(event)">
    <div class="bg-white max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl" onclick="event.stopPropagation()">
      <div class="p-8">
        <div class="flex justify-between items-start mb-6">
          <h2 id="modalTitle" class="text-3xl font-bold"></h2>
          <button onclick="closeModal()" class="text-2xl text-[#1a1c1b]/40 hover:text-[#785600]">&times;</button>
        </div>
        <p id="modalDesc" class="text-[#4f4535] mb-8 font-body text-lg leading-relaxed"></p>
        <h3 class="text-xl font-bold mb-4 border-b border-[#d3c4af]/20 pb-2">相关论文</h3>
        <div id="modalPapers" class="space-y-4"></div>
      </div>
    </div>
  </div>

  <script>
    const topics = ${JSON.stringify(topTopics)};
    const papers = ${JSON.stringify(topPapers)};
    
    function openTopic(index) {
      const topic = topics[index];
      document.getElementById('modalTitle').textContent = topic.title;
      document.getElementById('modalDesc').textContent = topic.description;
      
      const papersHtml = topic.papers.sort((a,b) => b.citations - a.citations).map(p => 
        '<div class="p-4 bg-[#f9f9f7] border-l-2 border-[#785600]">' +
          '<h4 class="font-bold mb-1">' + p.title + '</h4>' +
          '<p class="text-sm text-[#4f4535] mb-2">' + p.authors.join('、') + ' · ' + (p.journal || '未知期刊') + ' · ' + p.year + '年</p>' +
          '<div class="flex items-center gap-4 text-xs text-[#817563]">' +
            '<span>引用 ' + p.citations + '</span>' +
            '<span>评分 ' + p.score + '</span>' +
          '</div>' +
        '</div>'
      ).join('');
      
      document.getElementById('modalPapers').innerHTML = papersHtml;
      document.getElementById('topicModal').classList.add('active');
    }
    
    function closeModal(e) {
      if (!e || e.target.id === 'topicModal') {
        document.getElementById('topicModal').classList.remove('active');
      }
    }
    
    function showPaperDetail(index) {
      const paper = papers[index];
      alert('论文详情：\\n\\n' + paper.title + '\\n作者：' + paper.authors.join('、') + '\\n期刊：' + (paper.journal || '未知') + '\\n引用：' + paper.citations);
    }
    
    function searchPapers(query) {
      // Simple search - in real app would filter the displayed content
      console.log('Searching:', query);
    }
  </script>
</body>
</html>`;

// 保存
fs.writeFileSync('index.html', html, 'utf8');
console.log('✅ 已生成完整动态页面 index.html');
console.log(`- ${allTopics.length} 个热点`);
console.log(`- ${allPapers.length} 篇论文`);
