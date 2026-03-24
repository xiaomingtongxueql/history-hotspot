/**
 * Export Stitch screens - Get HTML and images for all 3 designs
 */

import { stitch } from '@google/stitch-sdk';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.STITCH_API_KEY = 'AQ.Ab8RN6I7g-lQUBdUGB1CtsXGku252kv_zxV31ufsTZwnJBQZBA';

const PROJECT_ID = '1175676234053981107';
const SCREENS = [
  { name: 'mobile', id: '2270feea34f74500861333d460fc87d2' },
  { name: 'desktop', id: '7f3cec2ed97149bc899d8f364f6783e6' },
  { name: 'ipad', id: '6b4df07c6c8f42e1afadd41618502e18' }
];

function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(outputPath);
    
    protocol.get(url, { timeout: 30000 }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location, outputPath).then(resolve).catch(reject);
        return;
      }
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log('🎨 Stitch Screen Exporter');
  console.log('═══════════════════════════════════════\n');

  const outputDir = path.join(__dirname, '..', 'stitch-export');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  for (const screen of SCREENS) {
    console.log(`\n📱 处理: ${screen.name} (${screen.id})`);
    
    try {
      const result = await stitch.callTool('get_screen', {
        name: `projects/${PROJECT_ID}/screens/${screen.id}`,
        projectId: PROJECT_ID,
        screenId: screen.id
      });

      console.log('   结果类型:', typeof result);
      
      // Parse result
      let screenData = result;
      if (result?.content?.[0]?.text) {
        try { screenData = JSON.parse(result.content[0].text); } catch(e) {}
      }
      
      console.log('   Screen data keys:', Object.keys(screenData || {}));
      
      // Get URLs
      const htmlUrl = screenData?.htmlCode?.downloadUrl;
      const imageUrl = screenData?.screenshot?.downloadUrl;
      
      if (htmlUrl) {
        console.log('   📄 下载 HTML...');
        await downloadFile(htmlUrl, path.join(outputDir, `${screen.name}.html`));
        console.log('   ✅ HTML 已保存');
      } else {
        console.log('   ⚠️ 无 HTML URL');
      }
      
      if (imageUrl) {
        console.log('   🖼️  下载截图...');
        await downloadFile(imageUrl, path.join(outputDir, `${screen.name}.png`));
        console.log('   ✅ 截图已保存');
      } else {
        console.log('   ⚠️ 无截图 URL');
      }
      
    } catch (err) {
      console.error(`   ❌ 错误: ${err.message}`);
    }
  }

  console.log('\n═══════════════════════════════════════');
  console.log('✨ 导出完成！');
  console.log('📁 输出目录:', outputDir);
  console.log('\n文件列表:');
  fs.readdirSync(outputDir).forEach(f => console.log('  -', f));
}

main().catch(err => {
  console.error('❌ 致命错误:', err.message || err);
  process.exit(1);
});
