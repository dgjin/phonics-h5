# Phonics Fun · 自然拼读 H5

面向 3–10 岁儿童的英语自然拼读互动学习应用，兼容 KizPhonics 分级课程与外研版·新交际英语教材。基于 **React 19 + Vite + React Router**，自适应手机 / 平板 / 电脑，可安装为 PWA 离线使用，支持云端账号同步学习进度。

**在线预览**：https://phonics-h5.pages.dev

## 主要功能

### 课程学习
- **自然拼读 6 级别 · 32 单元**：Preschool 字母认知、K1/K2 短元音与词尾辅音、G1 双字母音、G1-2 连缀与长元音、G2 长元音进阶 / r 控制 / 双元音。
- **外研版·新交际英语教材**：一上 / 一下 / 二上 / 二下共 4 册，每册按单元展示词汇与图片，支持单元闯关。
- **10 种互动题型**：
  - 学习卡、描红写字、听音选择、连线匹配、拼单词
  - **连连看**（单词 ↔ 图片/emoji 配对）
  - **看图拼词**（拖拽字母块拼写单词）
  - **限时挑战**（倒计时听词选图/选词）
  - **句型对话**（情景气泡对话、角色跟读录音、读后句子排序）
  - **绘本故事**（分级阅读、自动朗读、读后小测）

### 复习与记忆
- **背单词**：汇总全部课程单词，支持按级别、教材单元、错题本、SRS 间隔复习筛选。
- **自适应难度**：根据每词熟练度（Leitner 盒子）智能排序，薄弱词优先出现。
- **错题本**：答错/跟读失败的词自动收录，集中攻克。
- **间隔复习（SRS）**：按艾宾浩斯/Leitner 算法安排复习时间。

### 发音与朗读
- **真人发音 · 美式 / 英式**：单词使用有道词典真人发音，可一键切换美式/英式（需联网）。
- **课程本地音频**：141 个单词 + 26 个字母由 macOS 高品质音色生成 `m4a` 文件，点击即读，离线可用。
- **句子/绘本朗读**：短语和句子自动使用浏览器 Web Speech；在 Android/iOS 上额外兼容 Google Translate TTS 音频备选。
- **录音跟读**：使用 `MediaRecorder` 录制儿童跟读并回放对比（替代不稳定的语音识别打分）。
- **自动朗读预热**：首次用户手势自动解锁音频与语音引擎，避免移动端自动播放被阻止。

### 激励与记录
- **每日目标**：设定每日学习单词数，完成自动打卡。
- **成就徽章墙**：连续打卡、累计星星、单元通关等成就。
- **家长周报**：每周生成学习统计（学习天数、新学/复习词数、薄弱环节）。
- **总进度看板**：累计星星、连续打卡天数、已学单元、近 7 天打卡日历。

### 账号与同步
- **Supabase 邮箱登录**：注册/登录后学习进度、错题、头像、昵称云端保存，跨设备同步。
- **本地访客模式**：未配置 Supabase 或离线时自动降级，进度存本地，仍可正常使用。
- **头像上传**：支持上传图片并压缩为 DataURI，登录后云端同步不丢失。

### 显示与体验
- **深色模式**：支持浅色 / 深色 / 跟随系统。
- **Pad 自适应**：自动识别 tablet 与 desktop，区分横屏/竖屏布局；平板显示更大触控目标与双栏/三栏布局。
- **答题音效**：Web Audio 合成答对/答错/过关音效。
- **PWA**：可「添加到主屏幕」，离线缓存应用、音频与数据。

## 本地运行

```bash
cd phonics-h5
npm install          # 安装依赖（vite、@supabase/supabase-js 等）
npm run dev          # 开发服务器，默认 http://localhost:5173
```

构建与本地预览生产包：

```bash
npm run build        # 产物输出到 dist/
npm run preview      # 本地预览 dist（默认 http://localhost:4173）
```

> 注：开发模式（`npm run dev`）不注册 Service Worker，避免缓存模块；PWA 离线仅在生产构建启用。

## 配置云端账号（可选）

1. 在 https://supabase.com 创建一个免费项目。
2. 进入 **Project Settings → API**，复制 `Project URL` 和 `anon public` key，填入 [`src/config.js`](src/config.js)：
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
4. （可选）在 **Authentication → Providers → Email** 关闭「Confirm email」可免邮箱验证直接登录，适合自用；正式使用建议保留验证。

配置完成后，首页会出现「登录/注册」入口；登录后进度自动上传/下载合并（按 unit 取较高星数、打卡日期取并集、个人资料取最新）。

## 部署

```bash
npm run build            # 生成 dist/
```

把 **`dist/`** 目录发布到任意静态托管即可：

- **Cloudflare Pages**：`npx wrangler pages deploy dist --project-name phonics-h5`
- **Vercel / Netlify**：Framework 选 Vite，Build Command `npm run build`，Output `dist`。
- **GitHub Pages / OSS / COS + CDN**：直接上传 `dist/` 内容；`vite.config.js` 里 `base: '/'` 已适配根路径部署（如需子目录请改回 `'./'`）。

HTTPS 下 PWA 安装/离线、Web Speech、录音才完整可用。无需自建后端（Supabase 即后端）。

> **真人发音说明**：单词优先使用有道词典真人发音；短语/句子因有道接口不支持，改用浏览器 Web Speech 或 Google Translate TTS 备选。部署到带严格 CSP 的环境时，需放行对应音频/连接域名。

## 目录结构

```
index.html               Vite 入口（引用 /src/main.jsx）
vite.config.js           含 @vitejs/plugin-react，base 配置
package.json
public/                  原样拷贝到 dist 根目录
  manifest.json          PWA 清单
  sw.js                  Service Worker（运行时缓存，适配哈希文件名）
  icons/                 PWA 图标（192/512/maskable）
  audio/                 单词与字母发音 m4a（141 词 + 26 字母）
  _redirects             SPA 路由回退（Cloudflare Pages）
src/
  main.jsx               入口：挂载 React，包裹 ErrorBoundary → AuthProvider → ProgressProvider → BrowserRouter
  App.jsx                路由表（首页 / 自然拼读 / 教材 / 背单词 / 绘本 / 对话 / 我的）
  styles.css             全部样式（主题色、深色模式、Pad 适配、动画）
  config.js              Supabase 密钥（自填）
  audio-manifest.js      可用音频清单（由生成脚本产出）
  data/
    curriculum.js        自然拼读课程数据
    textbook.js          外研版教材 4 册数据
    stories.js           分级绘本故事
    dialogues.js         句型/对话数据
    utils.js             shuffle / sample / starsFor / getDeviceType 等工具
  lib/
    auth.jsx             AuthProvider + useAuth
    progress.jsx         ProgressProvider + useProgress（星星/打卡/SRS/云端同步）
    tts.js               发音（真人/本地/Web Speech/Google TTS 回退）
    recorder.js          MediaRecorder 录音封装
    useDevice.js         设备类型 + 横竖屏检测 hook
  components/
    HomePage.jsx         首页：用户栏、学习入口、每日目标、成就、帮助
    LevelPage / UnitPage / GamePage / ResultPage
    ReviewPage.jsx       背单词主流程（自适应排序、跟读、错题）
    activities.jsx       自然拼读 5 种基础题型
    tbActivities.jsx     教材 7 种题型（含连连看/看图拼词/限时挑战）
    StoryList / StoryRead.jsx   绘本列表与阅读
    DialogList / DialogRead.jsx 句型对话列表与阅读
    textbook/            教材相关组件（选册、单元板、单元页、游戏）
    common.jsx           Header / Stars / ProgressDots / Feedback / Confetti 等
    LoginModal.jsx       登录/注册弹窗
```

## 自定义 / 维护

- **改自然拼读内容**：编辑 `src/data/curriculum.js`。item 格式 `{ l:'a', s:'/æ/', w:'cat', e:'🐱', p:['c','a','t'] }`。
- **改教材内容**：编辑 `src/data/textbook.js`；新增册按 `BOOK_1A` 格式添加并加入 `TEXTBOOKS` 数组。
- **改绘本/对话**：编辑 `src/data/stories.js` 或 `src/data/dialogues.js`。
- **加新题型**：在 `src/components/activities.jsx` 或 `src/components/textbook/tbActivities.jsx` 写组件并注册进 `ACTIVITIES` 映射。
- **重新生成音频**（新增单词后，在 macOS 上运行）：用 `say -v Samantha` 输出 aiff，再 `afconvert -f m4af -d aac` 转 m4a 放入 `public/audio/`，并刷新 `src/audio-manifest.js`。
- **更新缓存**：构建产物文件名自动带哈希；如需强制刷新 SW，提升 `public/sw.js` 顶部的 `VERSION`。

## 备注

- 课程单词音频为 macOS 高质量合成音色（非真人录制），比浏览器 TTS 更自然、离线一致。
- 部分浏览器需先有一次点击/触摸才允许发声，应用已自动预热。
- 头像、进度等数据本地存 `localStorage`；登录后同步到 Supabase，合并策略优先保留较高星星、最新个人资料、并集打卡日期。
