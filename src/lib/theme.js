/* 主题：浅色 / 深色 / 跟随系统。应用到 <html data-theme>，存 localStorage。 */
const KEY = 'phonics_theme';
const mq = () => (typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null);

export function getTheme() {
  try { return localStorage.getItem(KEY) || 'auto'; } catch (e) { return 'auto'; } // 'auto' | 'light' | 'dark'
}
export function applyTheme(t) {
  if (typeof document === 'undefined') return;
  const m = mq();
  const mode = t === 'auto' ? (m && m.matches ? 'dark' : 'light') : t;
  document.documentElement.dataset.theme = mode;
}
export function setTheme(t) {
  try { localStorage.setItem(KEY, t); } catch (e) {}
  applyTheme(t);
}
export function initTheme() {
  applyTheme(getTheme());
  const m = mq();
  if (m) {
    const onChange = () => { if (getTheme() === 'auto') applyTheme('auto'); };
    if (m.addEventListener) m.addEventListener('change', onChange);
    else if (m.addListener) m.addListener(onChange);
  }
}
