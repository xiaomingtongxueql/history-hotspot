/**
 * Stitch UI Generation Script v2
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

function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log('🎨 正在连接 Google Stitch...');
  console.log('API Key:', process.env.STITCH_API_KEY.substring(0, 20) + '...');

  // List available tools
  const toolsResult = await stitch.listTools();
  console.log('✅ 可用工具:', JSON.stringify(toolsResult));

  // Create a new Stitch project
  console.log('\n📁 创建 Stitch 项目...');
  const projectResult = await stitch.callTool('create_project', {
    title: '历史研究热点导航 v3 - 博物馆级设计'
  });
  console.log('项目创建结果:', JSON.stringify(projectResult, null, 2));

  // Extract project ID
  let projectId = null;
  if (projectResult?.name?.startsWith('projects/')) {
    projectId = projectResult.name.replace('projects/', '');
  } else if (projectResult?.id) {
    projectId = projectResult.id;
  }

  if (!projectId) {
    console.error('❌ 无法获取项目 ID');
    process.exit(1);
  }
  console.log('✅ 项目 ID:', projectId);

  // Generate screen using callTool directly
  console.log('\n🎨 生成首页设计...');
  
  const generateResult = await stitch.callTool('generate_screen_from_text', {
    projectId: `projects/${projectId}`,
    prompt: `Design a museum-quality Chinese academic history research homepage.

Style: 
- Ivory/cream background (#FDFCF8)
- Antique gold accents (#98690E)
- Playfair Display + Noto Serif SC fonts
- Ultra minimal with generous whitespace (80px+ between sections)
- Subtle animations

Layout:
1. Fixed glass-effect navbar with centered logo "溯史" 
2. Hero section (70vh): Large serif title "历史研究热点导航" with animated entrance
3. Stats row: 22 热点 · 107 论文 · 每周更新
4. Category pills: horizontal scrollable (中国古代史, 世界史, etc.)
5. Card grid (3 cols): White cards with large #01, #02 numbers, topic titles, hover glow
6. Minimal footer

Feel like a luxury museum or high-end academic journal. All text in Chinese.`,
    deviceType: 'DESKTOP'
  });
  
  console.log('生成结果:', JSON.stringify(generateResult, null, 2));

  // Extract and download HTML
  const outputDir = path.join(__dirname, '..', 'stitch-output');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  // Check for HTML URL in response
  let htmlUrl = null;
  let imageUrl = null;
  
  if (generateResult?.content) {
    for (const item of generateResult.content) {
      if (item.type === 'text') {
        try {
          const parsed = JSON.parse(item.text);
          htmlUrl = parsed?.htmlCode?.downloadUrl;
          imageUrl = parsed?.screenshot?.downloadUrl;
        } catch (e) {}
      }
    }
  }

  if (htmlUrl) {
    console.log('📄 下载 HTML...');
    await downloadFile(htmlUrl, path.join(outputDir, 'home.html'));
    console.log('✅ HTML 已保存');
  }

  if (imageUrl) {
    console.log('🖼️ 下载截图...');
    await downloadFile(imageUrl, path.join(outputDir, 'home.png'));
    console.log('✅ 截图已保存');
  }

  console.log('\n✨ 完成！');
  console.log('📁 输出目录:', outputDir);
}

main().catch(err => {
  console.error('❌ 错误:', err.message);
  process.exit(1);
});
