/**
 * Stitch UI Generation Script
 * 使用 Google Stitch SDK 为历史研究热点网站生成新 UI 设计
 */

import { stitch } from '@google/stitch-sdk';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Set API key via env
process.env.STITCH_API_KEY = 'AQ.Ab8RN6I7g-lQUBdUGB1CtsXGku252kv_zxV31ufsTZwnJBQZBA';

async function downloadContent(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  console.log('🎨 正在连接 Google Stitch...');

  // List available tools
  const toolsResult = await stitch.listTools();
  const tools = toolsResult?.tools || toolsResult || [];
  console.log('✅ 可用工具:', (Array.isArray(tools) ? tools : []).map(t => t.name).join(', '));

  // Create a new Stitch project
  console.log('\n📁 创建 Stitch 项目...');
  const projectResult = await stitch.callTool('create_project', {
    title: '历史研究热点导航 - History Hotspot Navigator'
  });
  console.log('项目创建结果:', JSON.stringify(projectResult, null, 2));

  // Extract project ID from various response formats
  let projectId = null;
  if (projectResult?.name?.startsWith('projects/')) {
    projectId = projectResult.name.replace('projects/', '');
  } else if (projectResult?.content?.[0]?.text) {
    const parsed = JSON.parse(projectResult.content[0].text);
    projectId = parsed?.project?.id || parsed?.id;
  } else if (projectResult?.project?.id) {
    projectId = projectResult.project.id;
  } else if (projectResult?.id) {
    projectId = projectResult.id;
  }

  if (!projectId) {
    console.error('❌ 无法获取项目 ID，结果:', projectResult);
    process.exit(1);
  }
  console.log('✅ 项目 ID:', projectId);

  const project = await stitch.project(projectId);

  // Generate screens
  const screens = [
    {
      name: 'home',
      prompt: `Design a sophisticated Chinese academic history research navigation website homepage.
      Style: "Light Academic Minimalism" — warm cream/ivory background (#FAFAF8), classic serif fonts (Playfair Display + Noto Serif SC for Chinese), antique gold (#B8860B) accent color.
      Layout:
      - Top navigation bar with site title "溯史" (History Hotspot), search bar, update button
      - Hero section: large elegant title "历史研究热点导航", subtitle in Chinese, stats showing paper counts
      - Category filter tabs (15 categories like: 史学理论、中国古代史、中国近代史、世界史、历史地理 etc.) in horizontal scrollable row
      - Card grid showing topic cards. Each card has: colored left border, topic title in Chinese, brief description, number of papers, journal badge
      - Warm ink-like colors, classical bookshelf aesthetic, subtle parchment texture
      - Footer with GitHub link and update timestamp
      Make it look like an elegant Chinese academic journal website, not a modern tech site.`
    },
    {
      name: 'topic-detail',
      prompt: `Design a Chinese academic paper list page for a specific history research topic.
      Style: "Light Academic Minimalism" — warm cream (#FAFAF8), antique gold (#B8860B) accents, serif fonts.
      Layout:
      - Breadcrumb navigation: 首页 > 中国近代史 > 近代学术转型与新史学
      - Topic header with large serif title, description, metadata
      - Paper ranking list (5 papers shown). Each paper card has:
        * Rank badge (🥇🥈🥉 or number)
        * Paper title in Chinese (bold, serif font)
        * Authors, journal name, year in smaller text
        * Source badge: "来源：万方" or "来源：知网" in gold
        * Citation count, download count as small stats
        * Star score (gold stars)
        * Download button (elegant, dark bg on hover)
      - Clean academic typography, excellent whitespace
      - Back button to return to home
      All text should be in Chinese. Make it elegant and scholarly.`
    }
  ];

  const outputDir = path.join(__dirname, '..', 'stitch-output');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  for (const screenDef of screens) {
    console.log(`\n🎨 生成页面: ${screenDef.name}...`);
    try {
      const screen = await project.generate(screenDef.prompt);
      console.log(`✅ 生成完成: ${screenDef.name}`);

      // Get HTML
      const htmlUrl = await screen.getHtml();
      console.log(`📄 HTML URL: ${htmlUrl}`);
      if (htmlUrl) {
        const html = await downloadContent(htmlUrl);
        fs.writeFileSync(path.join(outputDir, `${screenDef.name}.html`), html, 'utf8');
        console.log(`💾 已保存: stitch-output/${screenDef.name}.html`);
      }

      // Get screenshot URL
      const imageUrl = await screen.getImage();
      console.log(`🖼️  截图 URL: ${imageUrl}`);
      if (imageUrl) {
        fs.writeFileSync(
          path.join(outputDir, `${screenDef.name}-url.txt`),
          imageUrl,
          'utf8'
        );
      }
    } catch (err) {
      console.error(`❌ 生成 ${screenDef.name} 失败:`, err.message);
    }
  }

  console.log('\n✨ 完成！请查看 stitch-output/ 目录中的生成结果。');
}

main().catch(console.error);
