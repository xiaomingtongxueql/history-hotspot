# 项目修复计划 — 2026-03-25

## 背景
经全面代码审查，发现 4 类共 9 项问题，按严重程度制定修复任务。

---

## 任务列表

### TASK-01 🔴【严重】恢复 React 入口 index.html
**问题**：index.html 被 Stitch 生成的静态页面覆盖，导致 React 应用完全不打包
**步骤**：
1. 将 `index.html` 的内容替换为标准的 Vite+React 入口格式
2. 包含 `<div id="root">` 和 `<script type="module" src="/src/main.jsx">`
3. 保留中文 meta、正确 title
4. 验证：运行 `npm run build`，dist/assets/ 下应出现 JS/CSS 文件

---

### TASK-02 🟠【高】补全 tailwind.config.js 缺失的颜色与工具类
**问题**：`bg-bg-hover`、`text-ink-secondary`、`border-border` 等 8 种类名未定义
**步骤**：
1. 在 `tailwind.config.js` 的 `theme.extend.colors` 中添加：
   - `bg` 颜色组：primary / secondary / hover
   - `ink.secondary` 颜色
   - `border.DEFAULT` 颜色
2. 在 `theme.extend.borderRadius` 中添加 `card` 和 `modal`
3. 在 `theme.extend.boxShadow` 中添加 `modal`
4. 在 `src/index.css` 中添加 `.glass` 工具类（复用 glass-premium 的核心样式）
5. 验证：`npm run build` 无错误；dev 服务器下检查组件样式正常

---

### TASK-03 🟡【中】修复数据问题 — 空热点 & 评分异常
**问题**：2 个热点 0 篇论文；9 篇论文 score=0；Hero 文案写"十五大"但实际 9 个分类
**步骤**：
1. 修改 `src/components/Hero.jsx`：将"十五大"改为与分类数动态一致的文案（读 metadata）
2. 为 `考古学 → 汉唐墓葬与物质文化` 补充 3-5 篇真实论文数据（知网/万方可查）
3. 为 `社会史 → 宗族、乡村与地方社会` 补充 3-5 篇真实论文数据
4. 对 score=0 的论文重新计算 score（调用 calculateScore 逻辑写入 JSON）
5. 删除 `经济史` 分类中与历史无关的论文（"中国数字贸易地区分化之谜"）
6. 更新 `public/data/metadata.json` 统计数字
7. 验证：前端加载后无空列表；所有论文 score > 0

---

### TASK-04 🟡【中】修复 scoring.js — 启动时动态计算 score
**问题**：sortPapersByScore 仅读预存 score，calculateScore 从未被调用
**步骤**：
1. 修改 `src/utils/scoring.js` 中的 `sortPapersByScore`：在排序前先调用 `calculateScore` 重新计算
2. 验证：更改 paper 的 year 后排序结果正确变化

---

### TASK-05 🔵【低】整理 package.json 依赖
**问题**：puppeteer 系列在 dependencies；react-router-dom 已安装但未使用
**步骤**：
1. 将 `puppeteer`、`puppeteer-extra`、`puppeteer-extra-plugin-stealth` 移到 `devDependencies`
2. 从 `dependencies` 中删除 `react-router-dom`（整个项目无任何 import）
3. 运行 `npm install` 同步 lock 文件
4. 验证：`npm run build` 正常；生产 bundle 不含 puppeteer

---

### TASK-06 🔵【低】修复 font-serif 误用
**问题**：`TopicDetail.jsx` 中 `font-serif` 使用 Tailwind 默认字体而非项目中文字体
**步骤**：
1. 在 `src/pages/TopicDetail.jsx` 中把所有 `font-serif` 替换为 `font-heading`
2. 验证：TopicDetail 页面标题使用 Noto Serif SC

---

## 执行顺序
TASK-01 → TASK-02 → TASK-05 → TASK-03 → TASK-04 → TASK-06

## 验收标准
- [ ] `npm run build` 成功，dist/assets 含 JS/CSS chunks
- [ ] 所有 React 组件样式正常渲染（无 Tailwind 类名缺失）
- [ ] 无空论文热点
- [ ] 所有论文 score > 0
- [ ] 生产 bundle 不含 puppeteer
