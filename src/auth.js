/* 用户认证：Supabase 邮箱/密码。未配置密钥时为本地访客模式。 */
import { createClient } from '@supabase/supabase-js';

window.Auth = (function () {
  var cfg = window.CONFIG || {};
  var client = null, user = null, listeners = [];
  var configured = !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY);

  function emit() { listeners.forEach(function (fn) { try { fn(user); } catch (e) {} }); }

  function init() {
    if (!configured) return Promise.resolve();
    client = createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
    return client.auth.getSession().then(function (res) {
      user = (res.data && res.data.session && res.data.session.user) || null;
      client.auth.onAuthStateChange(function (_e, session) {
        user = (session && session.user) || null; emit();
      });
    });
  }

  function signUp(email, password, nickname) {
    if (!configured) return Promise.reject(new Error('未配置云端账号'));
    return client.auth.signUp({ email: email, password: password, options: { data: { nickname: nickname || '' } } })
      .then(function (r) { if (r.error) throw r.error; return r.data; });
  }
  function signIn(email, password) {
    if (!configured) return Promise.reject(new Error('未配置云端账号'));
    return client.auth.signInWithPassword({ email: email, password: password })
      .then(function (r) { if (r.error) throw r.error; return r.data; });
  }
  function signOut() {
    if (!configured) return Promise.resolve();
    return client.auth.signOut();
  }

  function displayName() {
    if (!user) return '访客';
    var m = user.user_metadata || {};
    return m.nickname || (user.email ? user.email.split('@')[0] : '学习者');
  }

  return {
    init: init, signUp: signUp, signIn: signIn, signOut: signOut,
    isConfigured: function () { return configured; },
    currentUser: function () { return user; },
    userId: function () { return user ? user.id : 'guest'; },
    displayName: displayName,
    client: function () { return client; },
    onChange: function (fn) { listeners.push(fn); },
  };
})();
