#!/usr/bin/env bash
# 教材图片迁移 · 第 2 步：把 r2-assets/ 里的图片上传到 Cloudflare R2。
# 前置：① 已完成 Cloudflare 授权（/mcp 或 npx wrangler login）；② 已建好 bucket。
# 用法：
#   R2_BUCKET=phonics-assets bash scripts/upload-r2.sh
set -euo pipefail

BUCKET="${R2_BUCKET:-phonics-assets}"
PREFIX="word-img"

shopt -s nullglob
files=(r2-assets/*.jpg r2-assets/*.jpeg r2-assets/*.png)
if [ ${#files[@]} -eq 0 ]; then
  echo "r2-assets/ 没有图片，请先运行：node scripts/migrate-images.mjs"
  exit 1
fi

echo "上传 ${#files[@]} 个文件到 r2://$BUCKET/$PREFIX/ ..."
n=0
for f in "${files[@]}"; do
  key="$PREFIX/$(basename "$f")"
  npx wrangler r2 object put "$BUCKET/$key" --file "$f" --remote >/dev/null
  n=$((n+1))
  printf "\r  已上传 %d/%d" "$n" "${#files[@]}"
done
echo ""
echo "完成。请在 R2 给该 bucket 开启公开访问，并把公开域名 + /$PREFIX 填入 src/config.js 的 ASSETS_BASE（或构建环境变量 VITE_ASSETS_BASE）。"
