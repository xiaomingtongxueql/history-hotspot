# 史学研究热点导航网站 设计文档

## 项目概述

面向历史学研究生的论文热点导航网站，提供史学研究热点分类浏览、高质量论文排行、一键跳转下载功能。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | React 18 + Vite |
| 样式 | Tailwind CSS |
| 数据格式 | JSON（存于 /public/data/） |
| 爬虫 | Python 3（requests + BeautifulSoup） |
| 自动更新 | GitHub Actions（每周一 UTC 00:00） |
| 部署 | GitHub Pages |

## 视觉风格

- **主题**：深色学术风
- **主背景**：`#1a1410`（深棕黑）
- **次背景**：`#2d2318`（深棕）
- **主题金色**：`#c9a84c`（古铜金）
- **文字色**：`#f0e6d3`（米白）
- **字体**：标题使用思源宋体，正文使用思源黑体
- **卡片**：圆角 8px，金色微边框，hover 时金色发光效果

## 页面结构

### 首页
1. 顶部导航栏：Logo（史学研究热点）+ 搜索框
2. Hero 横幅：大字标题 + 数据统计（论文总数、热点数、更新时间）
3. 分类 Tab 栏：15 大史学分类
4. 热点卡片网格：每个分类下的研究热点主题卡片

### 热点详情页
- 面包屑导航
- 热点简介
- 论文列表（按综合权重排序）
- 每张论文卡片：标题、作者、期刊、年份、引用量、下载量、综合评分、下载按钮

## 史学分类（15 大类）

1. 中国古代史
2. 中国近现代史
3. 中华人民共和国史
4. 世界古代史
5. 世界近现代史
6. 社会史
7. 经济史
8. 文化史
9. 政治史
10. 思想史 / 学术史
11. 环境史
12. 军事史
13. 边疆民族史
14. 宗教史
15. 数字人文

## 论文权重算法

```
综合分 = 引用量 × 0.5 + 下载量(归一化) × 0.3 + 时效分 × 0.2

时效分 = max(0, 10 - (当前年份 - 发表年份))
下载量归一化 = 下载量 / 1000（上限为 10）
```

## 下载功能

点击"立即下载"按钮时：
- 新窗口打开 https://3.shutong2.com/
- URL 参数预填论文标题（搜索关键词）
- 用户需在浏览器中保持登录状态（账号：30178114）

## 数据文件结构

```json
// public/data/topics.json
{
  "lastUpdated": "2026-03-24",
  "categories": [
    {
      "id": "ancient-china",
      "name": "中国古代史",
      "topics": [
        {
          "id": "topic-001",
          "title": "魏晋南北朝史研究新动向",
          "description": "...",
          "papers": [
            {
              "title": "论文标题",
              "authors": ["作者1", "作者2"],
              "journal": "期刊名",
              "year": 2023,
              "citations": 342,
              "downloads": 1200,
              "score": 9.2,
              "cnki_url": "https://..."
            }
          ]
        }
      ]
    }
  ]
}
```

## 目录结构

```
/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── CategoryTabs.jsx
│   │   ├── TopicCard.jsx
│   │   └── PaperCard.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   └── TopicDetail.jsx
│   ├── utils/
│   │   └── scoring.js
│   ├── App.jsx
│   └── main.jsx
├── public/
│   └── data/
│       └── topics.json
├── scripts/
│   └── scraper.py
├── .github/
│   └── workflows/
│       └── update-data.yml
├── docs/plans/
└── package.json
```

## GitHub Actions 工作流

每周一自动运行：
1. 运行 `scripts/scraper.py`
2. 更新 `public/data/topics.json`
3. git commit & push
4. GitHub Pages 自动重新部署
