/* 启动 */
(function () {
  function start() {
    document.addEventListener('pointerdown', function warm() {
      try { TTS.speak(' '); } catch (e) {}
      document.removeEventListener('pointerdown', warm);
    }, { once: true });

    // 先恢复登录态，再渲染界面
    Auth.init().catch(function (e) { console.warn('Auth init', e); }).then(function () {
      var u = Auth.currentUser();
      return Progress.useUser(u ? u.id : 'guest');
    }).catch(function () {}).then(function () {
      Screens.init();
    });

    // PWA service worker（仅生产构建注册，避免开发时缓存模块）
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register(import.meta.env.BASE_URL + 'sw.js').catch(function (e) { console.warn('SW', e); });
      });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
