/* Service Worker：运行时缓存（适配 Vite 哈希文件名）。首屏访问后即可离线。 */
var VERSION = 'phonics-v3';
var FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdn.jsdelivr.net'];

self.addEventListener('install', function () { self.skipWaiting(); });

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return; // 不拦截 Supabase 等写请求
  var url = new URL(req.url);
  var sameOrigin = url.origin === self.location.origin;
  var isFont = FONT_HOSTS.indexOf(url.hostname) >= 0;
  if (!sameOrigin && !isFont) return; // 其它跨域(如 Supabase API)直连网络

  // 导航请求：网络优先，离线回退已缓存首页
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).catch(function () {
      return caches.match(req).then(function (m) { return m || caches.match(self.registration.scope); });
    }));
    return;
  }
  // 静态资源 / 音频 / 字体：缓存优先，缺失则取网络并回填
  e.respondWith(caches.match(req).then(function (hit) {
    if (hit) return hit;
    return fetch(req).then(function (res) {
      if (res && (res.ok || res.type === 'opaque')) {
        var copy = res.clone();
        caches.open(VERSION).then(function (c) { c.put(req, copy); });
      }
      return res;
    }).catch(function () { return hit; });
  }));
});
