/* Vite 入口：按依赖顺序导入各模块（模块内部仍以 window.X 形式挂载全局） */
/* 本地化字体与图标（去掉外部 CDN 依赖，适配 Coze webview / 严格 CSP） */
import '@fontsource/fredoka/400.css';
import '@fontsource/fredoka/500.css';
import '@fontsource/fredoka/600.css';
import '@fontsource/fredoka/700.css';
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/600.css';
import '@fontsource/nunito/700.css';
import '@fontsource/nunito/800.css';
import '@tabler/icons-webfont/dist/tabler-icons.min.css';
import './styles.css';
import './util.js';
import './curriculum.js';
import './audio-manifest.js';
import './config.js';
import './auth.js';
import './tts.js';
import './progress.js';
import './activities.js';
import './screens.js';
import './app.js';
