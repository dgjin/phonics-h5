# Phonics+ / 拼读加 — 项目说明（给 Claude Code 的上手文档）

面向中国小学生的英语自然拼读 H5 学习应用（儿童向）。线上：https://phonics-h5.pages.dev ｜ 仓库：https://github.com/dgjin/phonics-h5 ｜ 部署：Cloudflare Pages（项目名 `phonics-h5`）。

## 沟通约定
- 本项目**所有输出一律用中文**（含回复、代码注释、commit message、PR 描述）；仅固定格式的英文（如 `Co-Authored-By:`）和代码标识符保留英文。

## 技术栈与结构
- React 19 + rolldown-vite（vite 8.x）+ HashRouter，纯前端 H5，移动端优先。
- 状态：`src/lib/auth.jsx`（Supabase 登录）、`src/lib/progress.jsx`（进度/错题/SRS 间隔重复/成就/每日打卡，双写 Supabase `user_progress` 表 + localStorage `phonics_data_v2:{uid}`）。
- 页面组件在 `src/components/`，教材相关在 `src/components/textbook/`。
- 数据在 `src/data/`：`stories.js`（绘本）、`dialogues.js`（句型对话）、`curriculum.js`/`textbook.js`/`word-cn.js`（拼读/教材词表）。
- 工具库 `src/lib/`：`tts.js`（有道 dictvoice 朗读 + Web Speech 兜底）、`sfx.js`（Web Audio 音效）、`recorder.js`（MediaRecorder 跟读录音）、`theme.js`（深色模式）、`assets.js`。
- 静态资源在 `public/`：`stories/`（绘本插画 WebP）、`word-img/`（教材图，自托管同源）、`audio/`。
- 云端配置 `src/config.js`：Supabase URL + **公开 anon key（已在仓库，受 RLS 保护，可放心 clone 即用）**；留空则降级为「本地访客」离线模式。

## 常用命令
```bash
npm install
npm run dev      # 本地开发，端口 5173
npm run build    # 产物到 dist/
# 部署到 Cloudflare Pages（需先 wrangler login）：
npm run build && npx --yes wrangler@latest pages deploy dist --project-name phonics-h5 --branch main --commit-dirty=true
git push origin main
```

## 绘本插画管线（重要，易踩坑）
- 插画为 AI 文生图（flux 水彩绘本风），自托管在 `public/stories/`。
- **存储规格强制：WebP / 最长边 800px / quality 82**。新生成的图（1024 原图）部署前必须用 Pillow 转成该规格，否则移动端会很慢（历史：50 张 PNG/JPEG 曾共 62MB，转 WebP 后 4.7MB）。
- 生成器：临时 Cloudflare Worker（`@cf/black-forest-labs/flux-1-schnell`），用完即删（开放端点别久留）。**CF Workers AI 免费档每日 10,000 neurons（约 40 张），0 点 UTC 重置**；当天耗尽可用 Pollinations（`image.pollinations.ai/prompt/<enc>?model=flux`，免费、同为 flux、输出锁 768² 需放大）兜底。
- 一致性经验：文生图跨页无法保证「同一角色/器物像素级一致」。已用招数——① 同场景不同状态（如乌鸦喝水的水位）取一张母版页、用 Pillow 局部改画;② 8 本书封面统一复用各书代表性内页（标题由 app 叠加，图内不要文字，避免乱码）。

## 注意事项
- **R2 不可用**（账号未开通，错误 10042），图片一律自托管在 `public/` 走 Pages 同源 CDN。
- `loading=lazy`（列表封面）、`decoding=async` + 预加载下一页（阅读页）已接入，新增图片渲染处沿用。
- 部署唯一需要的凭据是 `wrangler login`（Cloudflare 账号）；其余 clone 即可跑。
