# Phonics Fun · 自然拼读 H5

面向儿童的自然拼读互动学习网站，内容改编自 KizPhonics 分级教材（Preschool → G2）。
基于 **React 19 + Vite**（React Router 哈希路由），自适应手机 / 平板 / 电脑，可安装为 PWA 离线使用。

## 功能

- **6 个级别 · 32 个单元**：Preschool 字母认知、K1/K2 短元音与词尾辅音、G1 双字母音、
  G1-2 连缀与长元音、G2 长元音进阶 / r 控制 / 双元音。
- **5 种互动题型**：学习卡、**描红写字**（手指描字母）、听音选择、连线匹配、拼单词。
- **真人质感发音**：本地用 macOS `Samantha` 语音批量生成的音频文件（`audio/*.m4a`），
  点击即读；无音频或失败时回退到浏览器 Web Speech。
- **总进度看板**：累计星星、连续打卡天数、已学单元、近 7 天打卡日历，每天学习自动打卡。
- **用户账号（Supabase）**：邮箱/密码注册登录，学习进度**云端保存、跨设备同步**；
  未配置密钥时自动降级为「本地访客」模式（进度存本设备，仍可离线）。
- **PWA**：可「添加到主屏幕」，离线缓存应用与音频。

## 本地运行（Vite）

```bash
cd phonics-h5
npm install          # 安装依赖（vite、@supabase/supabase-js）
npm run dev          # 开发服务器，默认 http://localhost:5173
```

构建与本地预览生产包：

```bash
npm run build        # 产物输出到 dist/
npm run preview      # 本地预览 dist（默认 http://localhost:4173）
```

> 注：开发模式（`npm run dev`）不注册 Service Worker，避免缓存模块；PWA 离线仅在生产构建启用。

## 配置云端账号（可选，但你选择了云端同步）

1. 在 https://supabase.com 创建一个免费项目。
2. 进入 **Project Settings → API**，复制 `Project URL` 和 `anon public` key，
   填入 [`src/config.js`](src/config.js)：
   ```js
   export const CONFIG = {
     SUPABASE_URL: 'https://xxxx.supabase.co',
     SUPABASE_ANON_KEY: 'eyJhbGci....',
   };
   ```
3. 进入 **SQL Editor**，执行下面的建表与权限 SQL：
   ```sql
   create table if not exists public.user_progress (
     user_id uuid primary key references auth.users(id) on delete cascade,
     data jsonb not null default '{}'::jsonb,
     updated_at timestamptz not null default now()
   );
   alter table public.user_progress enable row level security;
   create policy "own_select" on public.user_progress
     for select using (auth.uid() = user_id);
   create policy "own_insert" on public.user_progress
     for insert with check (auth.uid() = user_id);
   create policy "own_update" on public.user_progress
     for update using (auth.uid() = user_id);
   ```
4. （可选）在 **Authentication → Providers → Email** 关闭「Confirm email」可免邮箱验证直接登录，
   适合自用；正式使用建议保留验证。

配置完成后，首页右上角会出现「登录」按钮；登录后进度自动上传/下载合并（按 unit 取较高星数、打卡日期取并集）。

## 部署

```bash
npm run build            # 生成 dist/
```

把 **`dist/`** 目录发布到任意静态托管即可：

- **Vercel / Netlify**：Framework 选 Vite，Build Command `npm run build`，Output `dist`。
- **GitHub Pages / OSS / COS + CDN**：直接上传 `dist/` 内容。`vite.config.js` 里 `base: './'`
  已用相对路径，部署到子目录也能正常工作。

HTTPS 下 PWA 安装/离线、Web Speech 才完整可用。无需自建后端（Supabase 即后端）。

## 目录结构

```
index.html               Vite 入口（引用 /src/main.jsx）
vite.config.js           含 @vitejs/plugin-react
package.json
public/                  原样拷贝到 dist 根目录
  manifest.json          PWA 清单
  sw.js                  Service Worker（运行时缓存，适配哈希文件名）
  icons/                 PWA 图标（192/512/maskable）
  audio/                 单词与字母发音 m4a（141 词 + 26 字母）
src/
  main.jsx               入口：挂载 React，包裹 AuthProvider → ProgressProvider → HashRouter，
                         并 import 字体 / 图标 / styles.css
  App.jsx                路由表（home / level / unit / game / result）
  styles.css             全部样式（主题色 c-{color}、响应式、动效）
  config.js              Supabase 密钥（自填，export const CONFIG）
  audio-manifest.js      可用音频清单（由生成脚本产出，挂 window.AUDIO_MANIFEST）
  data/
    curriculum.js        课程数据 + findLevel/findUnit/ACTIVITY_ICONS
    utils.js             shuffle / sample / tilesOf / starsFor / highlight
  lib/
    auth.jsx             AuthProvider + useAuth（Supabase 登录/注册）
    progress.jsx         ProgressProvider + useProgress（星星/打卡 + 云端同步）
    tts.js               发音（音频文件优先，Web Speech 回退）
  components/
    HomePage / LevelPage / UnitPage / GamePage / ResultPage
    activities.jsx       5 种题型：Flashcard / Trace / Listen / Match / Spell
    common.jsx           Header / Button / Stars / ProgressDots / Feedback / Confetti
    LoginModal.jsx       登录/注册弹窗
```

## 自定义 / 维护

- **改内容**：编辑 `src/data/curriculum.js`。item 格式
  `{ l:'a', s:'/æ/', w:'cat', e:'🐱', p:['c','a','t'] }`（l=焦点字母，s=发音，w=单词，e=emoji，p=拼词分块可选）。
  `acts` 决定该单元题型：`flashcard / trace / listen / match / spell`（字符串数组）。
- **加新题型**：在 `src/components/activities.jsx` 写一个 `({ unit, onFinish }) => …` 组件，
  并注册进文件末尾的 `ACTIVITIES` 映射；在 `GamePage.jsx`/`UnitPage.jsx` 的标签表里加中文名即可。
- **重新生成音频**（新增单词后，在 macOS 上运行）：用 `say -v Samantha` 输出 aiff，
  再 `afconvert -f m4af -d aac` 转 m4a 放入 `public/audio/`，并刷新 `src/audio-manifest.js`
  （遍历 `src/data/curriculum.js` 中所有 `w` 与 A–Z 字母名）。
- **更新缓存**：构建产物文件名自动带哈希，无需手动改版本；如需强制刷新 SW，提升 `public/sw.js`
  顶部的 `VERSION`。

## 备注

- 发音为 macOS 高质量合成音色（非真人录制），比浏览器 TTS 更自然、离线一致。
- 部分浏览器需先有一次点击/触摸才允许发声，应用已自动预热。
