/**
 * Stitch Direct Generation - 简化版
 */

import { stitch } from '@google/stitch-sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.STITCH_API_KEY = 'AQ.Ab8RN6I7g-lQUBdUGB1CtsXGku252kv_zxV31ufsTZwnJBQZBA';

async function main() {
  console.log('🎨 连接 Stitch...');
  
  // 使用已有项目或创建新项目
  const projectId = '1175676234053981107'; // 之前创建的项目
  
  console.log('✅ 使用项目 ID:', projectId);
  const project = await stitch.project(projectId);
  
  // 生成首页设计
  console.log('\n🎨 生成首页...');
  const screen = await project.generate(`Design a museum-quality Chinese academic history research homepage.
  
  Aesthetic: Ivory background (#FDFCF8), antique gold (#98690E) accents, Playfair Display + Noto Serif SC fonts. Ultra minimal with 80px+ whitespace. Feels like a luxury museum.
  
  Layout:
  - Fixed glass navbar with centered "溯史" logo
  - 70vh hero: Large serif title "历史研究热点导航", animated entrance
  - Stats: 22 热点 · 107 论文 · 每周更新  
  - Category pills: horizontal scrollable
  - 3-col card grid with #01, #02 numbers, hover glow
  - Minimal footer
  
  All Chinese text.`);
  
  console.log('✅ 生成完成！');
  
  // 获取截图
  const imageUrl = await screen.getImage();
  console.log('\n🖼️ 截图 URL:', imageUrl);
  
  // 获取 HTML  
  const htmlUrl = await screen.getHtml();
  console.log('📄 HTML URL:', htmlUrl);
  
  // 保存截图 URL
  const outputDir = path.join(__dirname, '..', 'stitch-output');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  
  if (imageUrl) {
    fs.writeFileSync(path.join(outputDir, 'screenshot-url.txt'), imageUrl);
  }
  if (htmlUrl) {
    fs.writeFileSync(path.join(outputDir, 'html-url.txt'), htmlUrl);
  }
  
  console.log('\n✨ 完成！截图URL已保存到 stitch-output/');
}

main().catch(err => {
  console.error('❌ 错误:', err.message || err);
  process.exit(1);
});
