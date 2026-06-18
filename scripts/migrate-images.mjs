/*
 * 教材图片迁移 · 第 1 步：把词表里所有第三方图片下载到本地 r2-assets/
 * 无需 Cloudflare 账号即可运行：
 *   node scripts/migrate-images.mjs
 * 下载完成后，第 2 步用 scripts/upload-r2.sh 上传到 R2（需先完成 Cloudflare 授权）。
 */
import { TEXTBOOKS } from '../src/data/textbook.js';
import { mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';

const OUT = path.resolve('r2-assets');

// 收集去重后的图片 URL
const urls = new Set();
for (const b of TEXTBOOKS)
  for (const u of b.units)
    for (const w of u.words)
      if (w.img) urls.add(w.img);
const list = [...urls];
console.log(`共 ${list.length} 张图片待下载 → ${OUT}`);

await mkdir(OUT, { recursive: true });
const fileOf = (url) => url.slice(url.lastIndexOf('/') + 1);
const exists = async (p) => { try { await access(p); return true; } catch { return false; } };

let ok = 0, skip = 0, fail = 0;
const failed = [];

async function download(url) {
  const dest = path.join(OUT, fileOf(url));
  if (await exists(dest)) { skip++; return; }
  try {
    const res = await fetch(url, { headers: { Referer: 'https://yyld.51jiaoxi.com/' } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    await writeFile(dest, Buffer.from(await res.arrayBuffer()));
    ok++;
  } catch (e) {
    fail++; failed.push({ url, err: String(e && e.message || e) });
  }
}

const CONC = 8;
for (let i = 0; i < list.length; i += CONC) {
  await Promise.all(list.slice(i, i + CONC).map(download));
  process.stdout.write(`\r下载中… ${Math.min(i + CONC, list.length)}/${list.length}`);
}
console.log(`\n完成：成功 ${ok}，已存在跳过 ${skip}，失败 ${fail}`);
if (failed.length) {
  await writeFile(path.join(OUT, '_failed.json'), JSON.stringify(failed, null, 2));
  console.log(`失败 ${failed.length} 个，清单见 r2-assets/_failed.json`);
}
console.log('下一步：完成 Cloudflare 授权后运行  bash scripts/upload-r2.sh');
