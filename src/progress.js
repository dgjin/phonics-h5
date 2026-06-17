/* 学习进度：按用户命名空间存 localStorage，登录后与 Supabase 双向同步。
   数据结构 { stars:{ 'level/unit':0-3 }, checkins:['YYYY-MM-DD', ...] } */
window.Progress = (function () {
  var uid = 'guest';
  var data = { stars: {}, checkins: [] };
  var listeners = [];
  var pushTimer = null;

  function lsKey() { return 'phonics_data_v2:' + uid; }
  function emit() { listeners.forEach(function (fn) { try { fn(); } catch (e) {} }); }

  function loadLocal() {
    try { data = JSON.parse(localStorage.getItem(lsKey())) || { stars: {}, checkins: [] }; }
    catch (e) { data = { stars: {}, checkins: [] }; }
    if (!data.stars) data.stars = {};
    if (!data.checkins) data.checkins = [];
  }
  function saveLocal() { try { localStorage.setItem(lsKey(), JSON.stringify(data)); } catch (e) {} }

  function key(levelId, unitId) { return levelId + '/' + unitId; }
  function today() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  // ---- 进度读写 ----
  function getStars(levelId, unitId) { return data.stars[key(levelId, unitId)] || 0; }
  function setStars(levelId, unitId, stars) {
    var k = key(levelId, unitId);
    var changed = false;
    if (stars > (data.stars[k] || 0)) { data.stars[k] = stars; changed = true; }
    if (recordCheckin()) changed = true;
    if (changed) { saveLocal(); schedulePush(); emit(); }
  }
  function levelStars(level) {
    var got = 0, total = level.units.length * 3;
    level.units.forEach(function (u) { got += getStars(level.id, u.id); });
    return { got: got, total: total };
  }
  function totalStars() {
    var got = 0, total = 0;
    (window.CURRICULUM || []).forEach(function (lv) { var s = levelStars(lv); got += s.got; total += s.total; });
    return { got: got, total: total };
  }
  function completedUnits() {
    return Object.keys(data.stars).filter(function (k) { return data.stars[k] > 0; }).length;
  }

  // ---- 打卡 / 连续天数 ----
  function recordCheckin() {
    var t = today();
    if (data.checkins.indexOf(t) < 0) { data.checkins.push(t); return true; }
    return false;
  }
  function checkedToday() { return data.checkins.indexOf(today()) >= 0; }
  function streak() {
    if (!data.checkins.length) return 0;
    var set = {}; data.checkins.forEach(function (d) { set[d] = 1; });
    var n = 0, cur = new Date();
    function fmt(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
    // 今天没打卡则从昨天起算
    if (!set[fmt(cur)]) cur.setDate(cur.getDate() - 1);
    while (set[fmt(cur)]) { n++; cur.setDate(cur.getDate() - 1); }
    return n;
  }
  function checkinCount() { return data.checkins.length; }
  function recentDays(n) {
    var out = [], set = {};
    data.checkins.forEach(function (d) { set[d] = 1; });
    var cur = new Date();
    for (var i = n - 1; i >= 0; i--) {
      var d = new Date(cur); d.setDate(cur.getDate() - i);
      var s = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      out.push({ date: s, day: d.getDate(), on: !!set[s], isToday: i === 0 });
    }
    return out;
  }

  // ---- 云端同步 ----
  function merge(remote) {
    if (!remote) return;
    var rs = remote.stars || {};
    Object.keys(rs).forEach(function (k) { if ((rs[k] || 0) > (data.stars[k] || 0)) data.stars[k] = rs[k]; });
    var rc = remote.checkins || [];
    var set = {}; data.checkins.forEach(function (d) { set[d] = 1; });
    rc.forEach(function (d) { if (!set[d]) { data.checkins.push(d); set[d] = 1; } });
    data.checkins.sort();
  }
  function schedulePush() {
    if (!Auth.isConfigured() || !Auth.currentUser()) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(push, 800);
  }
  function push() {
    if (!Auth.isConfigured() || !Auth.currentUser()) return Promise.resolve();
    return Auth.client().from('user_progress')
      .upsert({ user_id: Auth.userId(), data: data, updated_at: new Date().toISOString() })
      .then(function (r) { if (r.error) console.warn('同步上传失败', r.error.message); });
  }
  function pull() {
    if (!Auth.isConfigured() || !Auth.currentUser()) return Promise.resolve();
    return Auth.client().from('user_progress').select('data').eq('user_id', Auth.userId()).maybeSingle()
      .then(function (r) {
        if (r.error) { console.warn('同步下载失败', r.error.message); return; }
        if (r.data && r.data.data) { merge(r.data.data); saveLocal(); emit(); }
        return push(); // 合并后回传
      });
  }

  // 切换当前用户（登录/登出/首次）
  function useUser(newUid) {
    uid = newUid || 'guest';
    loadLocal();
    emit();
    return pull();
  }

  function reset() { data = { stars: {}, checkins: [] }; saveLocal(); schedulePush(); emit(); }

  loadLocal();

  return {
    getStars: getStars, setStars: setStars, levelStars: levelStars, totalStars: totalStars,
    completedUnits: completedUnits, streak: streak, checkedToday: checkedToday,
    checkinCount: checkinCount, recentDays: recentDays, useUser: useUser, reset: reset,
    onChange: function (fn) { listeners.push(fn); },
  };
})();
