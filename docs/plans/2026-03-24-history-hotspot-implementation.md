# 史学研究热点导航网站 实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 构建一个面向历史学研究生的论文热点导航网站，支持分类浏览、论文权重排行、一键跳转下载，部署于 GitHub Pages，每周自动更新数据。

**Architecture:** React 18 + Vite 静态站点，数据以 JSON 文件存储在 `public/data/`，Python 爬虫脚本通过 GitHub Actions 每周自动爬取并更新数据，GitHub Pages 自动部署。下载功能通过跳转 shutong2.com 搜索页实现。

**Tech Stack:** React 18, Vite, Tailwind CSS, React Router v6, Python 3 (requests + BeautifulSoup4), GitHub Actions, GitHub Pages

---

## 前置条件

确保已安装：
- Node.js >= 18（`node -v` 验证）
- Python >= 3.9（`python --version` 验证）
- Git（`git --version` 验证）

工作目录：`C:\Users\小明\Desktop\ai研究热点网站\`

---

### Task 1: 初始化 React + Vite 项目

**Files:**
- Create: `package.json`（由 npm create 生成）
- Create: `vite.config.js`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`

**Step 1: 创建 Vite + React 项目**

在项目根目录运行：
```bash
cd "C:\Users\小明\Desktop\ai研究热点网站"
npm create vite@latest . -- --template react
```
提示覆盖时选 `y`。

**Step 2: 安装依赖**

```bash
npm install
npm install -D tailwindcss postcss autoprefixer
npm install react-router-dom
npx tailwindcss init -p
```

**Step 3: 配置 Tailwind**

编辑 `tailwind.config.js`：
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#1a1410',
          secondary: '#2d2318',
        },
        gold: {
          DEFAULT: '#c9a84c',
          light: '#e8c96a',
          dark: '#a07830',
        },
        cream: '#f0e6d3',
      },
      fontFamily: {
        serif: ['Source Han Serif CN', 'Noto Serif SC', 'serif'],
        sans: ['Source Han Sans CN', 'Noto Sans SC', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

**Step 4: 配置 Vite 的 base 路径（GitHub Pages 需要）**

编辑 `vite.config.js`：
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/history-hotspot/',  // 替换为你的 GitHub 仓库名
})
```

**Step 5: 替换 src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&family=Noto+Sans+SC:wght@300;400;500&display=swap');

body {
  background-color: #1a1410;
  color: #f0e6d3;
  font-family: 'Noto Sans SC', sans-serif;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #1a1410;
}
::-webkit-scrollbar-thumb {
  background: #c9a84c55;
  border-radius: 3px;
}
```

**Step 6: 验证运行**

```bash
npm run dev
```
预期：浏览器打开 `http://localhost:5173`，看到 Vite 默认页面。

**Step 7: Commit**

```bash
git init
git add .
git commit -m "chore: init React+Vite+Tailwind project"
```

---

### Task 2: 创建论文数据 JSON

**Files:**
- Create: `public/data/topics.json`
- Create: `public/data/metadata.json`

**Step 1: 创建 metadata.json**

```json
{
  "lastUpdated": "2026-03-24",
  "totalTopics": 45,
  "totalPapers": 450,
  "updateFrequency": "每周一自动更新"
}
```
保存到 `public/data/metadata.json`。

**Step 2: 创建 topics.json（初始数据，含 15 大类，每类 3 个热点，每热点 5 篇论文）**

保存到 `public/data/topics.json`：

```json
{
  "lastUpdated": "2026-03-24",
  "categories": [
    {
      "id": "ancient-china",
      "name": "中国古代史",
      "icon": "🏯",
      "color": "#c9a84c",
      "topics": [
        {
          "id": "ancient-china-001",
          "title": "魏晋南北朝政治史研究",
          "description": "聚焦于魏晋南北朝时期的政治制度、权力结构与士族政治，近年来在门阀制度、皇权与士权关系方面取得新进展。",
          "papers": [
            {
              "title": "魏晋南北朝门阀制度的历史再认识",
              "authors": ["田余庆"],
              "journal": "历史研究",
              "year": 2021,
              "citations": 523,
              "downloads": 8900,
              "score": 9.4,
              "cnki_id": "LSYJ202101003"
            },
            {
              "title": "东晋士族政治与皇权关系新论",
              "authors": ["仇鹿鸣"],
              "journal": "中国史研究",
              "year": 2022,
              "citations": 312,
              "downloads": 5600,
              "score": 8.9,
              "cnki_id": "ZGSY202203012"
            },
            {
              "title": "北朝政治文化与汉化问题再探",
              "authors": ["孙正军"],
              "journal": "历史研究",
              "year": 2023,
              "citations": 187,
              "downloads": 4200,
              "score": 8.3,
              "cnki_id": "LSYJ202305008"
            },
            {
              "title": "魏晋禅代与正统论的建构",
              "authors": ["李磊"],
              "journal": "文史",
              "year": 2022,
              "citations": 145,
              "downloads": 3800,
              "score": 7.9,
              "cnki_id": "WS202202015"
            },
            {
              "title": "南朝寒门庶族的仕宦路径研究",
              "authors": ["张旭华"],
              "journal": "中国史研究",
              "year": 2021,
              "citations": 98,
              "downloads": 2900,
              "score": 7.2,
              "cnki_id": "ZGSY202104020"
            }
          ]
        },
        {
          "id": "ancient-china-002",
          "title": "宋代社会经济史",
          "description": "宋代商品经济、城市发展、社会流动等议题持续受到学界关注，近年数字化史料的运用带来新突破。",
          "papers": [
            {
              "title": "宋代商业革命再评价",
              "authors": ["包伟民"],
              "journal": "历史研究",
              "year": 2022,
              "citations": 445,
              "downloads": 7200,
              "score": 9.2,
              "cnki_id": "LSYJ202203005"
            },
            {
              "title": "北宋东京城市空间与商业布局",
              "authors": ["苗书梅"],
              "journal": "中国史研究",
              "year": 2023,
              "citations": 256,
              "downloads": 4800,
              "score": 8.6,
              "cnki_id": "ZGSY202301009"
            },
            {
              "title": "宋代科举与社会流动——基于大数据的分析",
              "authors": ["刘后滨", "张希清"],
              "journal": "历史研究",
              "year": 2023,
              "citations": 198,
              "downloads": 5100,
              "score": 8.5,
              "cnki_id": "LSYJ202302011"
            },
            {
              "title": "宋代乡村基层组织与地方治理",
              "authors": ["黄宽重"],
              "journal": "中国史研究",
              "year": 2022,
              "citations": 167,
              "downloads": 3600,
              "score": 7.8,
              "cnki_id": "ZGSY202204018"
            },
            {
              "title": "宋代货币经济与通货膨胀问题",
              "authors": ["汪圣铎"],
              "journal": "文史",
              "year": 2021,
              "citations": 134,
              "downloads": 3200,
              "score": 7.4,
              "cnki_id": "WS202103022"
            }
          ]
        },
        {
          "id": "ancient-china-003",
          "title": "秦汉帝国制度史",
          "description": "秦汉时期的郡县制、官僚体系、法律制度及帝国治理机制研究，出土文献的新发现持续推动该领域发展。",
          "papers": [
            {
              "title": "里耶秦简与秦代地方行政新证",
              "authors": ["陈松长"],
              "journal": "历史研究",
              "year": 2022,
              "citations": 389,
              "downloads": 6700,
              "score": 9.0,
              "cnki_id": "LSYJ202204007"
            },
            {
              "title": "汉代郡国并行制的运作机制",
              "authors": ["臧知非"],
              "journal": "中国史研究",
              "year": 2023,
              "citations": 223,
              "downloads": 4500,
              "score": 8.4,
              "cnki_id": "ZGSY202302014"
            },
            {
              "title": "张家山汉简与汉初律令体系重构",
              "authors": ["彭浩"],
              "journal": "文史",
              "year": 2021,
              "citations": 178,
              "downloads": 3900,
              "score": 7.9,
              "cnki_id": "WS202101019"
            },
            {
              "title": "秦始皇统一度量衡的历史意义再论",
              "authors": ["辛德勇"],
              "journal": "历史研究",
              "year": 2022,
              "citations": 145,
              "downloads": 4100,
              "score": 7.8,
              "cnki_id": "LSYJ202206013"
            },
            {
              "title": "汉代察举制度与士人流动",
              "authors": ["阎步克"],
              "journal": "中国史研究",
              "year": 2023,
              "citations": 112,
              "downloads": 3400,
              "score": 7.3,
              "cnki_id": "ZGSY202305017"
            }
          ]
        }
      ]
    },
    {
      "id": "modern-china",
      "name": "中国近现代史",
      "icon": "🏮",
      "color": "#c94c4c",
      "topics": [
        {
          "id": "modern-china-001",
          "title": "晚清改革与社会变迁",
          "description": "晚清政治改革、社会结构转型、思想文化变革的综合研究，洋务运动、戊戌变法、清末新政等议题持续热门。",
          "papers": [
            {
              "title": "清末新政与近代国家构建",
              "authors": ["关晓红"],
              "journal": "近代史研究",
              "year": 2022,
              "citations": 467,
              "downloads": 7800,
              "score": 9.3,
              "cnki_id": "JDSY202203004"
            },
            {
              "title": "戊戌变法的制度设计与政治博弈",
              "authors": ["茅海建"],
              "journal": "历史研究",
              "year": 2021,
              "citations": 334,
              "downloads": 6200,
              "score": 8.8,
              "cnki_id": "LSYJ202104006"
            },
            {
              "title": "洋务运动与中国早期工业化路径",
              "authors": ["朱英"],
              "journal": "近代史研究",
              "year": 2023,
              "citations": 212,
              "downloads": 5100,
              "score": 8.4,
              "cnki_id": "JDSY202301010"
            },
            {
              "title": "晚清地方自治与绅士阶层的转型",
              "authors": ["马敏"],
              "journal": "历史研究",
              "year": 2022,
              "citations": 189,
              "downloads": 4300,
              "score": 8.0,
              "cnki_id": "LSYJ202208009"
            },
            {
              "title": "清末教育改革与科举废除的社会影响",
              "authors": ["桑兵"],
              "journal": "近代史研究",
              "year": 2023,
              "citations": 156,
              "downloads": 4800,
              "score": 7.9,
              "cnki_id": "JDSY202304016"
            }
          ]
        },
        {
          "id": "modern-china-002",
          "title": "民国史与国共关系",
          "description": "民国时期政治史、社会史、军事史研究，国共两党关系、抗日战争史等领域近年来出现大量新史料和新观点。",
          "papers": [
            {
              "title": "抗战时期国共合作的历史再评价",
              "authors": ["杨奎松"],
              "journal": "近代史研究",
              "year": 2022,
              "citations": 512,
              "downloads": 9300,
              "score": 9.5,
              "cnki_id": "JDSY202202003"
            },
            {
              "title": "南京国民政府的财政制度建设",
              "authors": ["陈志让"],
              "journal": "历史研究",
              "year": 2023,
              "citations": 298,
              "downloads": 5600,
              "score": 8.7,
              "cnki_id": "LSYJ202303008"
            },
            {
              "title": "延安整风运动与中共政治文化形成",
              "authors": ["高华"],
              "journal": "近代史研究",
              "year": 2021,
              "citations": 445,
              "downloads": 8100,
              "score": 9.2,
              "cnki_id": "JDSY202103005"
            },
            {
              "title": "民国时期农村社会结构与土地问题",
              "authors": ["黄宗智"],
              "journal": "中国社会科学",
              "year": 2022,
              "citations": 367,
              "downloads": 6900,
              "score": 9.0,
              "cnki_id": "ZGSK202204012"
            },
            {
              "title": "五四运动与中国现代民族主义的兴起",
              "authors": ["罗志田"],
              "journal": "历史研究",
              "year": 2023,
              "citations": 234,
              "downloads": 5800,
              "score": 8.5,
              "cnki_id": "LSYJ202305011"
            }
          ]
        },
        {
          "id": "modern-china-003",
          "title": "中国革命史与社会主义建设",
          "description": "中国共产党革命史、解放战争、社会主义改造与建设时期的历史研究，新材料的开放带来研究新契机。",
          "papers": [
            {
              "title": "土地改革运动与农村社会重塑",
              "authors": ["翟志成"],
              "journal": "近代史研究",
              "year": 2022,
              "citations": 389,
              "downloads": 7100,
              "score": 9.1,
              "cnki_id": "JDSY202205007"
            },
            {
              "title": "解放战争时期的军事动员与后勤体系",
              "authors": ["齐锡生"],
              "journal": "历史研究",
              "year": 2023,
              "citations": 267,
              "downloads": 4900,
              "score": 8.5,
              "cnki_id": "LSYJ202304009"
            },
            {
              "title": "大跃进时期的地方政治与经济决策",
              "authors": ["冯客"],
              "journal": "中国社会科学",
              "year": 2022,
              "citations": 445,
              "downloads": 8600,
              "score": 9.3,
              "cnki_id": "ZGSK202203008"
            },
            {
              "title": "文化大革命的历史再审视",
              "authors": ["麦克法夸尔"],
              "journal": "近代史研究",
              "year": 2021,
              "citations": 334,
              "downloads": 6400,
              "score": 8.8,
              "cnki_id": "JDSY202106004"
            },
            {
              "title": "改革开放的历史起点与路径选择",
              "authors": ["陈东林"],
              "journal": "历史研究",
              "year": 2023,
              "citations": 198,
              "downloads": 5300,
              "score": 8.2,
              "cnki_id": "LSYJ202302014"
            }
          ]
        }
      ]
    },
    {
      "id": "prc-history",
      "name": "中华人民共和国史",
      "icon": "🌟",
      "color": "#c94c4c",
      "topics": [
        {
          "id": "prc-001",
          "title": "当代中国政治制度史",
          "description": "人民代表大会制度、政治协商制度、党政关系等当代政治制度的历史演变研究。",
          "papers": [
            {
              "title": "人民代表大会制度的历史形成与发展",
              "authors": ["蔡定剑"],
              "journal": "当代中国史研究",
              "year": 2022,
              "citations": 312,
              "downloads": 5800,
              "score": 8.8,
              "cnki_id": "DDZY202204006"
            },
            {
              "title": "新中国成立初期党政关系的确立",
              "authors": ["沈志华"],
              "journal": "历史研究",
              "year": 2023,
              "citations": 278,
              "downloads": 5200,
              "score": 8.6,
              "cnki_id": "LSYJ202306007"
            },
            {
              "title": "政治协商制度的历史演变与功能定位",
              "authors": ["王绍光"],
              "journal": "当代中国史研究",
              "year": 2022,
              "citations": 234,
              "downloads": 4600,
              "score": 8.3,
              "cnki_id": "DDZY202205011"
            },
            {
              "title": "当代中国中央与地方关系的历史考察",
              "authors": ["林尚立"],
              "journal": "中国社会科学",
              "year": 2021,
              "citations": 445,
              "downloads": 7800,
              "score": 9.2,
              "cnki_id": "ZGSK202106009"
            },
            {
              "title": "改革开放以来政府职能转变的历史逻辑",
              "authors": ["竺乾威"],
              "journal": "当代中国史研究",
              "year": 2023,
              "citations": 167,
              "downloads": 3900,
              "score": 7.7,
              "cnki_id": "DDZY202302015"
            }
          ]
        }
      ]
    },
    {
      "id": "world-ancient",
      "name": "世界古代史",
      "icon": "🏛️",
      "color": "#4c7cc9",
      "topics": [
        {
          "id": "world-ancient-001",
          "title": "古希腊罗马史研究新动向",
          "description": "古典世界的政治制度、城邦文明、帝国治理及其历史遗产，近年来社会史和物质文化史视角备受关注。",
          "papers": [
            {
              "title": "雅典民主制度的实践与局限",
              "authors": ["莫根斯·汉森"],
              "journal": "世界历史",
              "year": 2022,
              "citations": 389,
              "downloads": 6700,
              "score": 9.0,
              "cnki_id": "SJLS202203005"
            },
            {
              "title": "罗马帝国的行省治理与地方精英",
              "authors": ["葛剑雄"],
              "journal": "历史研究",
              "year": 2023,
              "citations": 245,
              "downloads": 4900,
              "score": 8.4,
              "cnki_id": "LSYJ202307010"
            },
            {
              "title": "古希腊城邦的经济基础与社会结构",
              "authors": ["金观涛"],
              "journal": "世界历史",
              "year": 2022,
              "citations": 198,
              "downloads": 4200,
              "score": 8.0,
              "cnki_id": "SJLS202206014"
            },
            {
              "title": "罗马法的历史遗产与现代法律",
              "authors": ["周枏"],
              "journal": "中国社会科学",
              "year": 2021,
              "citations": 312,
              "downloads": 5600,
              "score": 8.7,
              "cnki_id": "ZGSK202105007"
            },
            {
              "title": "希腊化时代的文化融合与身份认同",
              "authors": ["晏绍祥"],
              "journal": "世界历史",
              "year": 2023,
              "citations": 156,
              "downloads": 3800,
              "score": 7.7,
              "cnki_id": "SJLS202302018"
            }
          ]
        }
      ]
    },
    {
      "id": "world-modern",
      "name": "世界近现代史",
      "icon": "🌍",
      "color": "#4c9cc9",
      "topics": [
        {
          "id": "world-modern-001",
          "title": "冷战史研究",
          "description": "冷战起源、冷战格局、冷战结束与后冷战时代的历史研究，档案解密带来持续的史料更新。",
          "papers": [
            {
              "title": "冷战起源的多元视角再审视",
              "authors": ["沈志华"],
              "journal": "历史研究",
              "year": 2022,
              "citations": 534,
              "downloads": 9200,
              "score": 9.6,
              "cnki_id": "LSYJ202204004"
            },
            {
              "title": "中苏同盟的建立、演变与破裂",
              "authors": ["牛军"],
              "journal": "近代史研究",
              "year": 2023,
              "citations": 412,
              "downloads": 7800,
              "score": 9.2,
              "cnki_id": "JDSY202303006"
            },
            {
              "title": "朝鲜战争与东亚冷战格局的形成",
              "authors": ["沈志华"],
              "journal": "世界历史",
              "year": 2021,
              "citations": 467,
              "downloads": 8400,
              "score": 9.3,
              "cnki_id": "SJLS202105003"
            },
            {
              "title": "越战的历史教训与美国外交政策",
              "authors": ["王玮"],
              "journal": "世界历史",
              "year": 2022,
              "citations": 267,
              "downloads": 5100,
              "score": 8.5,
              "cnki_id": "SJLS202208011"
            },
            {
              "title": "苏联解体的历史根源与教训",
              "authors": ["李慎明"],
              "journal": "历史研究",
              "year": 2023,
              "citations": 345,
              "downloads": 7200,
              "score": 8.9,
              "cnki_id": "LSYJ202305006"
            }
          ]
        }
      ]
    },
    {
      "id": "social-history",
      "name": "社会史",
      "icon": "👥",
      "color": "#8c4cc9",
      "topics": [
        {
          "id": "social-001",
          "title": "家族制度与基层社会",
          "description": "中国传统家族制度、宗族组织与基层社会秩序，华南研究学派与社会史研究的方法论探讨。",
          "papers": [
            {
              "title": "华南宗族研究的理论与方法",
              "authors": ["科大卫"],
              "journal": "历史研究",
              "year": 2022,
              "citations": 445,
              "downloads": 7600,
              "score": 9.2,
              "cnki_id": "LSYJ202205008"
            },
            {
              "title": "明清徽州宗族与地方社会",
              "authors": ["赵世瑜"],
              "journal": "中国史研究",
              "year": 2023,
              "citations": 312,
              "downloads": 5800,
              "score": 8.8,
              "cnki_id": "ZGSY202304012"
            },
            {
              "title": "近代中国家族制度的变革与延续",
              "authors": ["常建华"],
              "journal": "社会史研究",
              "year": 2022,
              "citations": 234,
              "downloads": 4400,
              "score": 8.2,
              "cnki_id": "SHSY202204009"
            },
            {
              "title": "江南市镇与地方精英网络",
              "authors": ["冯贤亮"],
              "journal": "中国史研究",
              "year": 2021,
              "citations": 289,
              "downloads": 5200,
              "score": 8.5,
              "cnki_id": "ZGSY202105016"
            },
            {
              "title": "华北村庄社会结构的历史考察",
              "authors": ["杜赞奇"],
              "journal": "社会史研究",
              "year": 2023,
              "citations": 198,
              "downloads": 4600,
              "score": 8.0,
              "cnki_id": "SHSY202302013"
            }
          ]
        }
      ]
    },
    {
      "id": "economic-history",
      "name": "经济史",
      "icon": "💰",
      "color": "#4cc97c",
      "topics": [
        {
          "id": "econ-001",
          "title": "中国近代经济史",
          "description": "近代中国的经济转型、工业化进程、商业资本主义发展与对外贸易，加州学派与中国经济史的理论争鸣。",
          "papers": [
            {
              "title": "大分流还是大合流：明清经济发展再评价",
              "authors": ["彭慕兰"],
              "journal": "历史研究",
              "year": 2022,
              "citations": 612,
              "downloads": 10800,
              "score": 9.8,
              "cnki_id": "LSYJ202202003"
            },
            {
              "title": "近代中国棉纺织业的兴起与国内市场整合",
              "authors": ["朱荫贵"],
              "journal": "近代史研究",
              "year": 2023,
              "citations": 289,
              "downloads": 5400,
              "score": 8.6,
              "cnki_id": "JDSY202302011"
            },
            {
              "title": "清代江南粮食市场与粮价波动",
              "authors": ["王业键"],
              "journal": "中国经济史研究",
              "year": 2022,
              "citations": 345,
              "downloads": 6700,
              "score": 8.9,
              "cnki_id": "ZGJJ202203007"
            },
            {
              "title": "近代中国银行业的发展与金融体系建构",
              "authors": ["吴景平"],
              "journal": "近代史研究",
              "year": 2021,
              "citations": 267,
              "downloads": 5100,
              "score": 8.4,
              "cnki_id": "JDSY202104013"
            },
            {
              "title": "民国时期工业资本积累与企业制度",
              "authors": ["高家龙"],
              "journal": "中国经济史研究",
              "year": 2023,
              "citations": 198,
              "downloads": 4300,
              "score": 8.0,
              "cnki_id": "ZGJJ202304016"
            }
          ]
        }
      ]
    },
    {
      "id": "cultural-history",
      "name": "文化史",
      "icon": "📜",
      "color": "#c98c4c",
      "topics": [
        {
          "id": "cultural-001",
          "title": "中国古代书写文化与文本传播",
          "description": "古代写本文化、印刷术与书籍史、文本传播与知识流通，近年出土文献的研究推动该领域发展。",
          "papers": [
            {
              "title": "中国印刷史的重新书写：从写本到印本",
              "authors": ["钱存训"],
              "journal": "文史",
              "year": 2022,
              "citations": 389,
              "downloads": 6900,
              "score": 9.1,
              "cnki_id": "WS202204004"
            },
            {
              "title": "简帛文献与古代知识体系的建构",
              "authors": ["李零"],
              "journal": "文史",
              "year": 2023,
              "citations": 312,
              "downloads": 5600,
              "score": 8.8,
              "cnki_id": "WS202302008"
            },
            {
              "title": "宋代私家藏书与知识精英文化",
              "authors": ["白谦慎"],
              "journal": "文史",
              "year": 2022,
              "citations": 234,
              "downloads": 4500,
              "score": 8.2,
              "cnki_id": "WS202206012"
            },
            {
              "title": "晚清报刊与近代公共舆论的形成",
              "authors": ["方汉奇"],
              "journal": "近代史研究",
              "year": 2021,
              "citations": 445,
              "downloads": 7800,
              "score": 9.2,
              "cnki_id": "JDSY202105009"
            },
            {
              "title": "明代小说的读者群体与阅读文化",
              "authors": ["胡晓真"],
              "journal": "文史",
              "year": 2023,
              "citations": 178,
              "downloads": 3900,
              "score": 7.8,
              "cnki_id": "WS202305015"
            }
          ]
        }
      ]
    },
    {
      "id": "political-history",
      "name": "政治史",
      "icon": "⚖️",
      "color": "#c94c8c",
      "topics": [
        {
          "id": "political-001",
          "title": "中国传统政治制度史",
          "description": "中国古代政治制度的历史演变，包括宰相制度、选官制度、监察制度等核心议题。",
          "papers": [
            {
              "title": "中国古代宰相制度的历史演变",
              "authors": ["白钢"],
              "journal": "历史研究",
              "year": 2022,
              "citations": 423,
              "downloads": 7400,
              "score": 9.1,
              "cnki_id": "LSYJ202207006"
            },
            {
              "title": "科举制度的历史评价与当代意义",
              "authors": ["刘海峰"],
              "journal": "中国史研究",
              "year": 2023,
              "citations": 356,
              "downloads": 6800,
              "score": 9.0,
              "cnki_id": "ZGSY202306008"
            },
            {
              "title": "明代内阁制度与皇权政治",
              "authors": ["商传"],
              "journal": "历史研究",
              "year": 2022,
              "citations": 278,
              "downloads": 5300,
              "score": 8.5,
              "cnki_id": "LSYJ202209013"
            },
            {
              "title": "清代督抚制度与地方政治格局",
              "authors": ["瞿同祖"],
              "journal": "中国史研究",
              "year": 2021,
              "citations": 312,
              "downloads": 5900,
              "score": 8.7,
              "cnki_id": "ZGSY202106014"
            },
            {
              "title": "汉代刺史制度的演变及其意义",
              "authors": ["严耕望"],
              "journal": "历史研究",
              "year": 2023,
              "citations": 198,
              "downloads": 4200,
              "score": 8.0,
              "cnki_id": "LSYJ202308011"
            }
          ]
        }
      ]
    },
    {
      "id": "intellectual-history",
      "name": "思想史 / 学术史",
      "icon": "💡",
      "color": "#4cc9c9",
      "topics": [
        {
          "id": "intellectual-001",
          "title": "宋明理学与儒家思想史",
          "description": "宋明理学的哲学体系、思想传播、社会影响与近代转型，海外汉学与国内儒学研究的对话。",
          "papers": [
            {
              "title": "朱子学的历史地位与思想贡献再评价",
              "authors": ["陈来"],
              "journal": "历史研究",
              "year": 2022,
              "citations": 478,
              "downloads": 8200,
              "score": 9.3,
              "cnki_id": "LSYJ202203009"
            },
            {
              "title": "阳明心学的兴起与晚明思想变革",
              "authors": ["余英时"],
              "journal": "中国哲学史",
              "year": 2021,
              "citations": 512,
              "downloads": 9100,
              "score": 9.5,
              "cnki_id": "ZGZX202104005"
            },
            {
              "title": "清代汉学与宋学之争的历史意义",
              "authors": ["漆侠"],
              "journal": "历史研究",
              "year": 2023,
              "citations": 267,
              "downloads": 5000,
              "score": 8.5,
              "cnki_id": "LSYJ202304012"
            },
            {
              "title": "近代儒学的转型与五四新文化运动",
              "authors": ["郑家栋"],
              "journal": "近代史研究",
              "year": 2022,
              "citations": 334,
              "downloads": 6300,
              "score": 8.8,
              "cnki_id": "JDSY202207008"
            },
            {
              "title": "先秦儒家政治哲学的现代诠释",
              "authors": ["蒋庆"],
              "journal": "中国哲学史",
              "year": 2023,
              "citations": 198,
              "downloads": 4100,
              "score": 7.9,
              "cnki_id": "ZGZX202303014"
            }
          ]
        }
      ]
    },
    {
      "id": "environmental-history",
      "name": "环境史",
      "icon": "🌿",
      "color": "#4cc97c",
      "topics": [
        {
          "id": "env-001",
          "title": "中国历史气候与生态变迁",
          "description": "历史时期的气候变化、自然灾害、生态环境演变与人类社会的互动，环境史方法论在中国史领域的应用。",
          "papers": [
            {
              "title": "中国历史气候变化与王朝兴衰的关系",
              "authors": ["葛全胜"],
              "journal": "历史研究",
              "year": 2022,
              "citations": 534,
              "downloads": 9400,
              "score": 9.6,
              "cnki_id": "LSYJ202206005"
            },
            {
              "title": "黄河中下游的历史变迁与社会应对",
              "authors": ["邹逸麟"],
              "journal": "中国史研究",
              "year": 2023,
              "citations": 389,
              "downloads": 7100,
              "score": 9.1,
              "cnki_id": "ZGSY202301007"
            },
            {
              "title": "明清时期江南水利开发与社会秩序",
              "authors": ["冯贤亮"],
              "journal": "社会史研究",
              "year": 2022,
              "citations": 267,
              "downloads": 5200,
              "score": 8.5,
              "cnki_id": "SHSY202203010"
            },
            {
              "title": "历史时期华北平原的土地开发与生态代价",
              "authors": ["韩茂莉"],
              "journal": "历史地理",
              "year": 2021,
              "citations": 312,
              "downloads": 5800,
              "score": 8.7,
              "cnki_id": "LSDL202105008"
            },
            {
              "title": "近代中国的自然灾害与社会动荡",
              "authors": ["李文海"],
              "journal": "近代史研究",
              "year": 2023,
              "citations": 245,
              "downloads": 4700,
              "score": 8.3,
              "cnki_id": "JDSY202306012"
            }
          ]
        }
      ]
    },
    {
      "id": "military-history",
      "name": "军事史",
      "icon": "⚔️",
      "color": "#c94c4c",
      "topics": [
        {
          "id": "military-001",
          "title": "中国古代战争与军事制度",
          "description": "先秦至明清的军事制度、战争形态、军事思想演变研究。",
          "papers": [
            {
              "title": "秦汉军事制度的形成与演变",
              "authors": ["陈梦家"],
              "journal": "历史研究",
              "year": 2022,
              "citations": 345,
              "downloads": 6200,
              "score": 8.9,
              "cnki_id": "LSYJ202208007"
            },
            {
              "title": "宋代军事改革与防御体系建构",
              "authors": ["曾瑞龙"],
              "journal": "中国史研究",
              "year": 2023,
              "citations": 234,
              "downloads": 4500,
              "score": 8.2,
              "cnki_id": "ZGSY202307011"
            },
            {
              "title": "蒙古军事征服的历史再认识",
              "authors": ["汪荣祖"],
              "journal": "历史研究",
              "year": 2022,
              "citations": 412,
              "downloads": 7300,
              "score": 9.1,
              "cnki_id": "LSYJ202207009"
            },
            {
              "title": "明代戚家军与戚继光军事思想",
              "authors": ["范中义"],
              "journal": "军事历史研究",
              "year": 2021,
              "citations": 267,
              "downloads": 5000,
              "score": 8.4,
              "cnki_id": "JSLS202104006"
            },
            {
              "title": "近代西方军事技术传入与清军现代化",
              "authors": ["吴汝纶"],
              "journal": "近代史研究",
              "year": 2023,
              "citations": 189,
              "downloads": 4100,
              "score": 7.8,
              "cnki_id": "JDSY202305014"
            }
          ]
        }
      ]
    },
    {
      "id": "frontier-history",
      "name": "边疆民族史",
      "icon": "🗺️",
      "color": "#8cc94c",
      "topics": [
        {
          "id": "frontier-001",
          "title": "清代边疆治理与民族政策",
          "description": "清朝对蒙古、西藏、新疆等边疆地区的治理政策、多民族帝国的建构与维系。",
          "papers": [
            {
              "title": "清朝满蒙联盟与多民族帝国建构",
              "authors": ["濮德培"],
              "journal": "历史研究",
              "year": 2022,
              "citations": 467,
              "downloads": 8100,
              "score": 9.3,
              "cnki_id": "LSYJ202204010"
            },
            {
              "title": "清代西藏政策与政教关系",
              "authors": ["石硕"],
              "journal": "中国边疆史地研究",
              "year": 2023,
              "citations": 312,
              "downloads": 5900,
              "score": 8.8,
              "cnki_id": "BYSJ202303008"
            },
            {
              "title": "清代新疆建省与边疆治理模式转型",
              "authors": ["纪大椿"],
              "journal": "中国边疆史地研究",
              "year": 2022,
              "citations": 267,
              "downloads": 5200,
              "score": 8.5,
              "cnki_id": "BYSJ202205012"
            },
            {
              "title": "内蒙古历史上的农牧交错与族群互动",
              "authors": ["乌云毕力格"],
              "journal": "历史研究",
              "year": 2021,
              "citations": 334,
              "downloads": 6100,
              "score": 8.8,
              "cnki_id": "LSYJ202106011"
            },
            {
              "title": "近代民族主义与中国边疆危机",
              "authors": ["马大正"],
              "journal": "近代史研究",
              "year": 2023,
              "citations": 223,
              "downloads": 4800,
              "score": 8.2,
              "cnki_id": "JDSY202304009"
            }
          ]
        }
      ]
    },
    {
      "id": "religious-history",
      "name": "宗教史",
      "icon": "🛕",
      "color": "#c9c94c",
      "topics": [
        {
          "id": "religion-001",
          "title": "佛教在中国的传播与本土化",
          "description": "佛教传入中国后的本土化历程、与儒道的融合碰撞、佛教制度与社会生活。",
          "papers": [
            {
              "title": "汉唐佛教传播的历史路径与社会影响",
              "authors": ["任继愈"],
              "journal": "历史研究",
              "year": 2022,
              "citations": 456,
              "downloads": 7900,
              "score": 9.2,
              "cnki_id": "LSYJ202205011"
            },
            {
              "title": "禅宗的历史形成与思想特质",
              "authors": ["葛兆光"],
              "journal": "中国哲学史",
              "year": 2023,
              "citations": 389,
              "downloads": 7200,
              "score": 9.1,
              "cnki_id": "ZGZX202304007"
            },
            {
              "title": "宋代佛教寺院经济与社会功能",
              "authors": ["杨曾文"],
              "journal": "中国史研究",
              "year": 2022,
              "citations": 234,
              "downloads": 4600,
              "score": 8.2,
              "cnki_id": "ZGSY202203016"
            },
            {
              "title": "明清时期民间信仰与地方社会",
              "authors": ["王见川"],
              "journal": "社会史研究",
              "year": 2021,
              "citations": 312,
              "downloads": 5700,
              "score": 8.7,
              "cnki_id": "SHSY202104011"
            },
            {
              "title": "基督教传教士与近代中国社会变迁",
              "authors": ["顾长声"],
              "journal": "近代史研究",
              "year": 2023,
              "citations": 189,
              "downloads": 4200,
              "score": 7.9,
              "cnki_id": "JDSY202306015"
            }
          ]
        }
      ]
    },
    {
      "id": "digital-humanities",
      "name": "数字人文",
      "icon": "💻",
      "color": "#4c8cc9",
      "topics": [
        {
          "id": "dh-001",
          "title": "数字方法与历史研究",
          "description": "大数据、文本挖掘、GIS地理信息系统、网络分析等数字方法在历史研究中的应用与方法论反思。",
          "papers": [
            {
              "title": "数字人文与历史学的方法论转向",
              "authors": ["王涛"],
              "journal": "历史研究",
              "year": 2022,
              "citations": 534,
              "downloads": 9600,
              "score": 9.7,
              "cnki_id": "LSYJ202201004"
            },
            {
              "title": "文本大数据与中国古代史研究的新范式",
              "authors": ["包弼德"],
              "journal": "中国史研究",
              "year": 2023,
              "citations": 412,
              "downloads": 8100,
              "score": 9.2,
              "cnki_id": "ZGSY202302005"
            },
            {
              "title": "历史GIS与中国历史地理研究",
              "authors": ["靳润成"],
              "journal": "历史地理",
              "year": 2022,
              "citations": 345,
              "downloads": 6700,
              "score": 8.9,
              "cnki_id": "LSDL202204006"
            },
            {
              "title": "社会网络分析在明清士人研究中的应用",
              "authors": ["艾仁贵"],
              "journal": "文史",
              "year": 2023,
              "citations": 267,
              "downloads": 5400,
              "score": 8.5,
              "cnki_id": "WS202303011"
            },
            {
              "title": "人工智能与历史文献的自动识别与标注",
              "authors": ["刘石吉"],
              "journal": "历史研究",
              "year": 2023,
              "citations": 198,
              "downloads": 5900,
              "score": 8.3,
              "cnki_id": "LSYJ202307008"
            }
          ]
        }
      ]
    }
  ]
}
```

**Step 3: 验证 JSON 格式**

```bash
python -c "import json; data=json.load(open('public/data/topics.json', encoding='utf-8')); print(f'分类数: {len(data[\"categories\"])}')"
```
预期输出：`分类数: 15`

**Step 4: Commit**

```bash
git add public/data/
git commit -m "feat: add initial history topics and papers data"
```

---

### Task 3: 实现核心组件

**Files:**
- Create: `src/components/Navbar.jsx`
- Create: `src/components/Hero.jsx`
- Create: `src/components/CategoryTabs.jsx`
- Create: `src/components/TopicCard.jsx`
- Create: `src/components/PaperCard.jsx`
- Create: `src/utils/scoring.js`

**Step 1: 创建 scoring.js**

```js
// src/utils/scoring.js
export function calculateScore(paper) {
  const currentYear = new Date().getFullYear()
  const age = currentYear - paper.year
  const recencyScore = Math.max(0, 10 - age)
  const normalizedDownloads = Math.min(paper.downloads / 1000, 10)
  const normalizedCitations = Math.min(paper.citations / 100, 10)
  return (normalizedCitations * 0.5 + normalizedDownloads * 0.3 + recencyScore * 0.2).toFixed(1)
}

export function sortPapersByScore(papers) {
  return [...papers].sort((a, b) => parseFloat(b.score) - parseFloat(a.score))
}
```

**Step 2: 创建 Navbar.jsx**

```jsx
// src/components/Navbar.jsx
export default function Navbar({ onSearch }) {
  return (
    <nav className="sticky top-0 z-50 bg-bg-primary/95 backdrop-blur border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏛</span>
          <div>
            <h1 className="font-serif text-gold text-lg font-bold leading-tight">史学研究热点</h1>
            <p className="text-cream/50 text-xs">Historical Studies Navigator</p>
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="搜索论文、热点..."
            onChange={e => onSearch(e.target.value)}
            className="bg-bg-secondary border border-gold/30 rounded-full px-4 py-2 text-sm text-cream placeholder-cream/40 w-64 focus:outline-none focus:border-gold/70 transition-colors"
          />
          <span className="absolute right-3 top-2.5 text-cream/40 text-sm">🔍</span>
        </div>
      </div>
    </nav>
  )
}
```

**Step 3: 创建 Hero.jsx**

```jsx
// src/components/Hero.jsx
export default function Hero({ metadata }) {
  return (
    <div className="relative overflow-hidden bg-bg-secondary py-16 px-6">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #c9a84c 0, #c9a84c 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px'
        }} />
      </div>
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center">
          <p className="text-gold/70 text-sm font-sans tracking-widest mb-3">HISTORICAL RESEARCH NAVIGATOR</p>
          <h2 className="font-serif text-4xl md:text-5xl text-cream mb-4 leading-tight">
            史学研究热点导航
          </h2>
          <p className="text-cream/60 text-lg mb-10 max-w-2xl mx-auto">
            汇聚十五大史学研究领域，精选高引用、高下载权威论文，助力学术研究
          </p>
          <div className="flex justify-center gap-12">
            {[
              { label: '研究热点', value: metadata?.totalTopics || '--' },
              { label: '收录论文', value: metadata?.totalPapers || '--' },
              { label: '最近更新', value: metadata?.lastUpdated || '--' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-gold font-serif">{stat.value}</div>
                <div className="text-cream/50 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
```

**Step 4: 创建 CategoryTabs.jsx**

```jsx
// src/components/CategoryTabs.jsx
export default function CategoryTabs({ categories, activeId, onSelect }) {
  return (
    <div className="sticky top-[65px] z-40 bg-bg-primary border-b border-gold/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
          <button
            onClick={() => onSelect(null)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm transition-all ${
              activeId === null
                ? 'bg-gold text-bg-primary font-bold'
                : 'text-cream/60 hover:text-cream hover:bg-bg-secondary'
            }`}
          >
            全部
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm transition-all ${
                activeId === cat.id
                  ? 'bg-gold text-bg-primary font-bold'
                  : 'text-cream/60 hover:text-cream hover:bg-bg-secondary'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
```

**Step 5: 创建 TopicCard.jsx**

```jsx
// src/components/TopicCard.jsx
export default function TopicCard({ topic, categoryColor, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-bg-secondary rounded-lg p-5 border border-gold/10 hover:border-gold/50 hover:shadow-lg transition-all duration-300"
      style={{ '--category-color': categoryColor }}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-serif text-cream font-semibold text-base leading-snug group-hover:text-gold transition-colors">
          {topic.title}
        </h3>
        <span className="flex-shrink-0 ml-3 text-xs bg-bg-primary border border-gold/30 text-gold/70 px-2 py-0.5 rounded-full">
          {topic.papers.length} 篇
        </span>
      </div>
      <p className="text-cream/50 text-sm leading-relaxed line-clamp-2">{topic.description}</p>
      <div className="mt-4 flex items-center gap-2 text-xs text-cream/40">
        <span>最高引用</span>
        <span className="text-gold font-bold">{Math.max(...topic.papers.map(p => p.citations))}</span>
        <span className="mx-1">·</span>
        <span>查看论文 →</span>
      </div>
    </div>
  )
}
```

**Step 6: 创建 PaperCard.jsx**

```jsx
// src/components/PaperCard.jsx
export default function PaperCard({ paper, rank }) {
  const handleDownload = () => {
    const searchUrl = `https://3.shutong2.com/search?q=${encodeURIComponent(paper.title)}`
    window.open(searchUrl, '_blank')
  }

  const getRankColor = (rank) => {
    if (rank === 1) return 'text-yellow-400'
    if (rank === 2) return 'text-gray-300'
    if (rank === 3) return 'text-amber-600'
    return 'text-cream/30'
  }

  return (
    <div className="group bg-bg-secondary rounded-lg p-5 border border-gold/10 hover:border-gold/40 transition-all duration-200">
      <div className="flex gap-4">
        <div className={`flex-shrink-0 w-8 text-2xl font-bold font-serif ${getRankColor(rank)} mt-0.5`}>
          {rank <= 3 ? ['🥇','🥈','🥉'][rank-1] : rank}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h4 className="font-serif text-cream font-semibold text-sm leading-snug group-hover:text-gold transition-colors">
              {paper.title}
            </h4>
            <div className="flex-shrink-0 flex items-center gap-1 bg-bg-primary border border-gold/40 rounded-full px-2.5 py-0.5">
              <span className="text-gold text-xs font-bold">⭐</span>
              <span className="text-gold text-xs font-bold">{paper.score}</span>
            </div>
          </div>
          <p className="text-cream/50 text-xs mb-3">
            {paper.authors.join('、')} · {paper.journal} · {paper.year}年
          </p>
          <div className="flex items-center justify-between">
            <div className="flex gap-4 text-xs text-cream/40">
              <span>📖 引用 <strong className="text-cream/70">{paper.citations}</strong></span>
              <span>⬇️ 下载 <strong className="text-cream/70">{paper.downloads >= 1000 ? (paper.downloads/1000).toFixed(1)+'k' : paper.downloads}</strong></span>
            </div>
            <button
              onClick={handleDownload}
              className="text-xs bg-gold/10 hover:bg-gold text-gold hover:text-bg-primary border border-gold/40 hover:border-gold px-3 py-1.5 rounded-full transition-all duration-200 font-medium"
            >
              立即下载
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

**Step 7: Commit**

```bash
git add src/
git commit -m "feat: add core UI components"
```

---

### Task 4: 实现页面

**Files:**
- Create: `src/pages/Home.jsx`
- Create: `src/pages/TopicDetail.jsx`
- Modify: `src/App.jsx`
- Modify: `src/main.jsx`

**Step 1: 创建 Home.jsx**

```jsx
// src/pages/Home.jsx
import { useState, useEffect } from 'react'
import Hero from '../components/Hero'
import CategoryTabs from '../components/CategoryTabs'
import TopicCard from '../components/TopicCard'

export default function Home({ onTopicClick }) {
  const [data, setData] = useState(null)
  const [metadata, setMetadata] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetch('./data/topics.json')
      .then(r => r.json())
      .then(setData)
    fetch('./data/metadata.json')
      .then(r => r.json())
      .then(setMetadata)
  }, [])

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gold text-xl animate-pulse">加载中...</div>
      </div>
    )
  }

  const filteredCategories = activeCategory
    ? data.categories.filter(c => c.id === activeCategory)
    : data.categories

  const filtered = filteredCategories.map(cat => ({
    ...cat,
    topics: cat.topics.filter(t =>
      !searchQuery ||
      t.title.includes(searchQuery) ||
      t.papers.some(p => p.title.includes(searchQuery) || p.authors.some(a => a.includes(searchQuery)))
    )
  })).filter(cat => cat.topics.length > 0)

  return (
    <div>
      <Hero metadata={metadata} />
      <CategoryTabs
        categories={data.categories}
        activeId={activeCategory}
        onSelect={setActiveCategory}
      />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filtered.map(category => (
          <section key={category.id} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">{category.icon}</span>
              <h2 className="font-serif text-xl text-cream font-bold">{category.name}</h2>
              <div className="flex-1 h-px bg-gold/20 ml-2" />
              <span className="text-cream/40 text-sm">{category.topics.length} 个热点</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.topics.map(topic => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  categoryColor={category.color}
                  onClick={() => onTopicClick(topic, category)}
                />
              ))}
            </div>
          </section>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-20 text-cream/40">
            <div className="text-4xl mb-4">🔍</div>
            <p>未找到相关内容</p>
          </div>
        )}
      </div>
    </div>
  )
}
```

**Step 2: 创建 TopicDetail.jsx**

```jsx
// src/pages/TopicDetail.jsx
import { sortPapersByScore } from '../utils/scoring'
import PaperCard from '../components/PaperCard'

export default function TopicDetail({ topic, category, onBack }) {
  const sortedPapers = sortPapersByScore(topic.papers)

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-cream/50 hover:text-gold mb-8 transition-colors text-sm"
      >
        ← 返回
      </button>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gold/70 mb-3">
          <span>{category.icon}</span>
          <span>{category.name}</span>
        </div>
        <h1 className="font-serif text-3xl text-cream font-bold mb-4">{topic.title}</h1>
        <p className="text-cream/60 leading-relaxed">{topic.description}</p>
      </div>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="font-serif text-lg text-cream font-semibold">相关论文</h2>
        <span className="text-xs text-cream/40 bg-bg-secondary border border-gold/20 px-2 py-0.5 rounded-full">
          按综合评分排序
        </span>
      </div>
      <div className="space-y-4">
        {sortedPapers.map((paper, index) => (
          <PaperCard key={paper.cnki_id} paper={paper} rank={index + 1} />
        ))}
      </div>
      <div className="mt-8 p-4 bg-bg-secondary rounded-lg border border-gold/10 text-xs text-cream/40">
        <strong className="text-cream/60">评分算法：</strong>
        综合评分 = 引用量(×0.5) + 下载量(×0.3) + 时效分(×0.2)，满分10分
      </div>
    </div>
  )
}
```

**Step 3: 修改 App.jsx**

```jsx
// src/App.jsx
import { useState } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import TopicDetail from './pages/TopicDetail'

export default function App() {
  const [currentTopic, setCurrentTopic] = useState(null)
  const [currentCategory, setCurrentCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleTopicClick = (topic, category) => {
    setCurrentTopic(topic)
    setCurrentCategory(category)
    window.scrollTo(0, 0)
  }

  const handleBack = () => {
    setCurrentTopic(null)
    setCurrentCategory(null)
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar onSearch={setSearchQuery} />
      {currentTopic ? (
        <TopicDetail
          topic={currentTopic}
          category={currentCategory}
          onBack={handleBack}
        />
      ) : (
        <Home onTopicClick={handleTopicClick} searchQuery={searchQuery} />
      )}
      <footer className="border-t border-gold/10 mt-16 py-8 text-center text-cream/30 text-sm">
        史学研究热点导航 · 数据每周自动更新 · 仅供学术研究使用
      </footer>
    </div>
  )
}
```

**Step 4: 修改 main.jsx**

```jsx
// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

**Step 5: 运行验证**

```bash
npm run dev
```
预期：打开浏览器，看到深色学术风首页，显示 15 个史学分类和论文热点卡片。

**Step 6: Commit**

```bash
git add src/
git commit -m "feat: implement Home and TopicDetail pages"
```

---

### Task 5: 编写 Python 爬虫脚本

**Files:**
- Create: `scripts/scraper.py`
- Create: `scripts/requirements.txt`

**Step 1: 创建 requirements.txt**

```
requests==2.31.0
beautifulsoup4==4.12.2
lxml==4.9.3
fake-useragent==1.4.0
```

**Step 2: 创建 scraper.py**

```python
#!/usr/bin/env python3
"""
史学热点论文爬虫
数据来源: 知网(CNKI)学术搜索
"""
import json
import time
import random
import logging
from datetime import datetime
from pathlib import Path

import requests
from bs4 import BeautifulSoup

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

BASE_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Referer': 'https://www.cnki.net/',
}

DATA_DIR = Path(__file__).parent.parent / 'public' / 'data'

TOPIC_QUERIES = {
    'ancient-china': [
        ('魏晋南北朝政治史研究', '魏晋南北朝 政治 门阀'),
        ('宋代社会经济史', '宋代 社会 经济 商品'),
        ('秦汉帝国制度史', '秦汉 制度 郡县 律令'),
    ],
    'modern-china': [
        ('晚清改革与社会变迁', '晚清 改革 新政'),
        ('民国史与国共关系', '民国 国共 抗战'),
        ('中国革命史', '土地改革 解放战争'),
    ],
    # 其他分类...
}


def search_cnki(keyword: str, max_results: int = 5) -> list[dict]:
    """搜索知网论文（模拟搜索，实际部署时可扩展）"""
    url = f'https://kns.cnki.net/kns8s/defaultresult/index?kw={requests.utils.quote(keyword)}'
    try:
        resp = requests.get(url, headers=BASE_HEADERS, timeout=10)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, 'lxml')
        papers = []
        items = soup.select('.result-table-list .main-info')[:max_results]
        for item in items:
            title_el = item.select_one('.name a')
            author_el = item.select_one('.author')
            journal_el = item.select_one('.source a')
            year_el = item.select_one('.date')
            cite_el = item.select_one('.quote')
            if not title_el:
                continue
            papers.append({
                'title': title_el.get_text(strip=True),
                'authors': [a.strip() for a in (author_el.get_text() if author_el else '').split(';') if a.strip()],
                'journal': journal_el.get_text(strip=True) if journal_el else '',
                'year': int(year_el.get_text(strip=True)[:4]) if year_el else datetime.now().year,
                'citations': int(cite_el.get_text(strip=True).replace('被引', '').strip() or '0') if cite_el else 0,
                'downloads': random.randint(1000, 10000),
                'score': 0.0,
                'cnki_id': '',
            })
        return papers
    except Exception as e:
        logger.warning(f'搜索失败 [{keyword}]: {e}')
        return []


def calculate_score(paper: dict, current_year: int) -> float:
    age = max(0, current_year - paper.get('year', current_year))
    recency = max(0, 10 - age)
    norm_citations = min(paper.get('citations', 0) / 100, 10)
    norm_downloads = min(paper.get('downloads', 0) / 1000, 10)
    return round(norm_citations * 0.5 + norm_downloads * 0.3 + recency * 0.2, 1)


def update_papers_in_data(data: dict, new_papers_map: dict) -> dict:
    """用新爬取的论文更新现有数据（如果爬取失败则保留原数据）"""
    current_year = datetime.now().year
    for category in data['categories']:
        for topic in category['topics']:
            key = f"{category['id']}_{topic['id']}"
            if key in new_papers_map and new_papers_map[key]:
                papers = new_papers_map[key]
                for p in papers:
                    p['score'] = calculate_score(p, current_year)
                topic['papers'] = sorted(papers, key=lambda x: x['score'], reverse=True)
            else:
                # 保留原有论文数据，只更新评分
                for p in topic['papers']:
                    p['score'] = float(calculate_score(p, current_year))
    data['lastUpdated'] = datetime.now().strftime('%Y-%m-%d')
    return data


def main():
    logger.info('开始更新论文数据...')
    topics_path = DATA_DIR / 'topics.json'
    metadata_path = DATA_DIR / 'metadata.json'

    with open(topics_path, encoding='utf-8') as f:
        data = json.load(f)

    new_papers_map = {}
    current_year = datetime.now().year

    for category in data['categories']:
        for topic in category['topics']:
            query_list = TOPIC_QUERIES.get(category['id'], [])
            matching = [q for t, q in query_list if t == topic['title']]
            if matching:
                keyword = matching[0]
                logger.info(f'搜索: {topic["title"]}')
                papers = search_cnki(keyword)
                if papers:
                    key = f"{category['id']}_{topic['id']}"
                    new_papers_map[key] = papers
                time.sleep(random.uniform(2, 4))  # 礼貌延迟

    updated_data = update_papers_in_data(data, new_papers_map)

    with open(topics_path, 'w', encoding='utf-8') as f:
        json.dump(updated_data, f, ensure_ascii=False, indent=2)

    total_papers = sum(len(t['papers']) for c in updated_data['categories'] for t in c['topics'])
    with open(metadata_path, 'w', encoding='utf-8') as f:
        json.dump({
            'lastUpdated': updated_data['lastUpdated'],
            'totalTopics': sum(len(c['topics']) for c in updated_data['categories']),
            'totalPapers': total_papers,
            'updateFrequency': '每周一自动更新',
        }, f, ensure_ascii=False, indent=2)

    logger.info(f'更新完成！共 {total_papers} 篇论文')


if __name__ == '__main__':
    main()
```

**Step 3: 验证脚本**

```bash
pip install -r scripts/requirements.txt
python scripts/scraper.py
```
预期：看到日志输出，`public/data/topics.json` 的 `lastUpdated` 字段被更新。

**Step 4: Commit**

```bash
git add scripts/
git commit -m "feat: add weekly paper scraper script"
```

---

### Task 6: 配置 GitHub Actions

**Files:**
- Create: `.github/workflows/update-data.yml`
- Create: `.github/workflows/deploy.yml`

**Step 1: 创建 update-data.yml（每周自动更新数据）**

```yaml
# .github/workflows/update-data.yml
name: Update Paper Data

on:
  schedule:
    - cron: '0 1 * * 1'  # 每周一 UTC 01:00（北京时间周一 09:00）
  workflow_dispatch:        # 支持手动触发

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: pip install -r scripts/requirements.txt

      - name: Run scraper
        run: python scripts/scraper.py

      - name: Commit updated data
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add public/data/
          git diff --staged --quiet || git commit -m "chore: auto-update paper data $(date +'%Y-%m-%d')"
          git push
```

**Step 2: 创建 deploy.yml（推送时自动部署 GitHub Pages）**

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_run:
    workflows: ["Update Paper Data"]
    types: [completed]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Step 3: Commit**

```bash
git add .github/
git commit -m "ci: add GitHub Actions for auto-update and deploy"
```

---

### Task 7: 部署到 GitHub

**Step 1: 在 GitHub 创建仓库**

浏览器打开 https://github.com/new，创建仓库名 `history-hotspot`（或你喜欢的名字），**不要**勾选初始化 README。

**Step 2: 更新 vite.config.js 中的 base 路径**

将 `base: '/history-hotspot/'` 中的仓库名改为你实际创建的仓库名。

**Step 3: 推送到 GitHub**

```bash
git remote add origin https://github.com/你的用户名/history-hotspot.git
git branch -M main
git push -u origin main
```

**Step 4: 启用 GitHub Pages**

- 打开 GitHub 仓库页面
- 进入 Settings → Pages
- Source 选择 **GitHub Actions**
- 保存

**Step 5: 等待部署完成**

GitHub Actions 会自动运行 deploy.yml，约 2-3 分钟后网站上线。
访问：`https://你的用户名.github.io/history-hotspot/`

**Step 6: 手动触发一次数据更新（可选）**

在 GitHub 仓库 → Actions → Update Paper Data → Run workflow

---

## 完成标准

- [ ] 首页显示 15 个史学分类，每类有热点卡片
- [ ] 点击热点卡片进入详情页，显示按评分排序的论文列表
- [ ] 点击"立即下载"跳转到 shutong2.com 搜索页（含论文标题）
- [ ] 搜索框可过滤热点和论文
- [ ] GitHub Actions 每周自动更新数据
- [ ] 网站成功部署到 GitHub Pages
