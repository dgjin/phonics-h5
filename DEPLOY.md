# 部署到 Cloudflare Pages（图片同源自托管）

## 当前方案：图片随应用打包，同源托管（默认，免费，无需 R2）

教材图片（198 张）已下载并放入 `public/word-img/`，随应用一起部署，由站点(Pages/Vercel)**同源 CDN** 提供；
应用通过 [`src/config.js`](src/config.js) 的 `ASSETS_BASE`（默认 `/word-img`）读取，不再依赖第三方 `51jiaoxi`，也**不需要 R2**。

部署：
```bash
npm run deploy:pages
# = npm run build && npx wrangler pages deploy dist --project-name phonics-h5
```
线上地址：https://phonics-h5.pages.dev

> 新增/更新教材图片时：`npm run migrate:images` 下载到 `r2-assets/`，再把新增文件拷进 `public/word-img/` 即可。

---

## 可选：改用 R2/自有 CDN（需先在控制台启用 R2 + 令牌带 R2 权限）

若日后图片很多、想从仓库里挪出去，可迁到 R2 或任意 CDN：把 `ASSETS_BASE`（或构建变量 `VITE_ASSETS_BASE`）
改成公开域名 + `/word-img`，再上传图片。下面是 R2 路径备忘。

### 把教材图片迁到自有 R2

```bash
# 1) 下载全部图片到本地 r2-assets/（无需 Cloudflare 账号，可先跑）
npm run migrate:images

# 2) 建 bucket（授权后）
npx wrangler r2 bucket create phonics-assets

# 3) 上传（key 前缀 word-img/，与词表文件名一致）
R2_BUCKET=phonics-assets npm run upload:r2

# 4) 开启该 bucket 的公开访问：
#    Cloudflare 控制台 → R2 → phonics-assets → Settings → Public access
#    记下公开域名（形如 https://pub-xxxx.r2.dev 或你绑定的自定义域）
```

把公开域名 + `/word-img` 填入图片基址，二选一：
- 改 [`src/config.js`](src/config.js) 的 `ASSETS_BASE`，例如
  `export const ASSETS_BASE = 'https://pub-xxxx.r2.dev/word-img';`
- 或在构建环境变量里设 `VITE_ASSETS_BASE=https://pub-xxxx.r2.dev/word-img`（推荐，免改码）。

> 应用读图走 [`src/lib/assets.js`](src/lib/assets.js) 的 `assetUrl()`：未配置时用原始地址，配置后自动改用 R2 同名文件。无需改词表。

## 二、部署到 Cloudflare Pages

```bash
npm run deploy:pages
# = npm run build && npx wrangler pages deploy dist --project-name phonics-h5
```

首次会创建 Pages 项目并提示选择生产分支。完成后给出 `*.pages.dev` 地址。
配置见 [`wrangler.jsonc`](wrangler.jsonc)（`pages_build_output_dir: dist`）。

也可走控制台：Pages → 连接 GitHub 仓库 `dgjin/phonics-h5` → Framework 选 Vite、输出目录 `dist`，并在环境变量加 `VITE_ASSETS_BASE`。

## 三、CSP / 跨域提醒

- 发音仍依赖 `dict.youdao.com`；若加 CSP 需放行 `media-src https://dict.youdao.com`。
- 图片迁到 R2 后，`img-src` 放行你的 R2 公开域名即可，不再依赖第三方。

## 检查清单

- [ ] `npm run migrate:images` 全部成功（失败清单见 `r2-assets/_failed.json`）
- [ ] R2 bucket 已建、已上传、已开公开访问
- [ ] `ASSETS_BASE` / `VITE_ASSETS_BASE` 已填，本地 `npm run build && npm run preview` 验证图片走 R2
- [ ] `npm run deploy:pages` 成功，线上图片/发音正常
