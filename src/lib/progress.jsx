/* 学习进度 Context：星星 + 打卡，本地 localStorage 持久化；登录后与 Supabase 双向同步 */
import { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { CURRICULUM } from '../data/curriculum';
import { useAuth } from './auth.jsx';

const ProgressContext = createContext(null);

const lsKey = (uid) => 'phonics_data_v2:' + (uid || 'guest');
function load(uid) {
  try {
    const d = JSON.parse(localStorage.getItem(lsKey(uid))) || {};
    return {
      stars: d.stars || {},
      checkins: d.checkins || [],
      mistakes: d.mistakes || {},
      profile: d.profile || {},
      srs: d.srs || {},
    };
  } catch {
    return { stars: {}, checkins: [], mistakes: {}, profile: {}, srs: {} };
  }
}

/* 间隔复习（Leitner 盒子）：每盒对应一个再次出现的间隔 */
const DAY = 86400000;
const SRS_INTERVALS = [10 * 60 * 1000, 1 * DAY, 2 * DAY, 4 * DAY, 8 * DAY, 16 * DAY];
function save(uid, data) {
  try { localStorage.setItem(lsKey(uid), JSON.stringify(data)); } catch {}
}
function todayStr() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
const keyOf = (levelId, unitId) => levelId + '/' + unitId;

function mergeData(local, remote) {
  const stars = { ...local.stars };
  const rs = remote.stars || {};
  Object.keys(rs).forEach((k) => { if ((rs[k] || 0) > (stars[k] || 0)) stars[k] = rs[k]; });
  const set = {};
  const checkins = local.checkins.slice();
  checkins.forEach((d) => { set[d] = 1; });
  (remote.checkins || []).forEach((d) => { if (!set[d]) { checkins.push(d); set[d] = 1; } });
  checkins.sort();
  // 错题：按词并集
  const mistakes = { ...(remote.mistakes || {}), ...(local.mistakes || {}) };
  // 个人资料：取较新的
  const lp = local.profile || {}, rp = remote.profile || {};
  const profile = (rp.updatedAt || 0) > (lp.updatedAt || 0) ? rp : lp;
  // 间隔复习：按词合并，取最近一次复习记录
  const srs = {};
  const ls = local.srs || {}, rsrs = remote.srs || {};
  new Set([...Object.keys(ls), ...Object.keys(rsrs)]).forEach((k) => {
    const a = ls[k], b = rsrs[k];
    srs[k] = (!b || (a && (a.ts || 0) >= (b.ts || 0))) ? a : b;
  });
  return { stars, checkins, mistakes, profile, srs };
}

export function ProgressProvider({ children }) {
  const { configured, user, userId, client } = useAuth();
  const [data, setData] = useState(() => load('guest'));
  const ctxRef = useRef({ userId, configured, user, client });
  const pushTimer = useRef(null);

  useEffect(() => { ctxRef.current = { userId, configured, user, client }; });

  const pushRemote = useCallback((next) => {
    const { userId, configured, user, client } = ctxRef.current;
    if (!configured || !user || !client) return;
    clearTimeout(pushTimer.current);
    pushTimer.current = setTimeout(() => {
      client.from('user_progress')
        .upsert({ user_id: userId, data: next, updated_at: new Date().toISOString() })
        .then(({ error }) => { if (error) console.warn('进度上传失败', error.message); });
    }, 700);
  }, []);

  // 用户切换：加载该用户本地进度，并与云端合并
  useEffect(() => {
    const local = load(userId);
    setData(local);
    if (!configured || !user || !client) return;
    let cancelled = false;
    client.from('user_progress').select('data').eq('user_id', userId).maybeSingle()
      .then(({ data: row, error }) => {
        if (cancelled) return;
        if (error) { console.warn('进度下载失败', error.message); return; }
        const merged = row && row.data ? mergeData(local, row.data) : local;
        setData(merged);
        save(userId, merged);
        client.from('user_progress')
          .upsert({ user_id: userId, data: merged, updated_at: new Date().toISOString() })
          .then(({ error }) => { if (error) console.warn('进度回传失败', error.message); });
      });
    return () => { cancelled = true; };
  }, [userId, configured, user, client]);

  const setStars = useCallback((levelId, unitId, stars) => {
    setData((prev) => {
      const k = keyOf(levelId, unitId);
      const next = { stars: { ...prev.stars }, checkins: prev.checkins.slice() };
      if (stars > (next.stars[k] || 0)) next.stars[k] = stars;
      const t = todayStr();
      if (next.checkins.indexOf(t) < 0) next.checkins.push(t);
      save(ctxRef.current.userId, next);
      pushRemote(next);
      return next;
    });
  }, [pushRemote]);

  const getStars = useCallback((levelId, unitId) => data.stars[keyOf(levelId, unitId)] || 0, [data]);

  const addMistake = useCallback((item) => {
    if (!item || !item.w) return;
    setData((prev) => {
      const next = { ...prev, mistakes: { ...prev.mistakes } };
      const k = item.w.toLowerCase();
      const cur = next.mistakes[k] || {};
      next.mistakes[k] = {
        w: item.w, e: item.e || cur.e || '', s: item.s || cur.s || '', level: item.level || cur.level || '',
        count: (cur.count || 0) + 1, ts: Date.now(),
      };
      save(ctxRef.current.userId, next);
      pushRemote(next);
      return next;
    });
  }, [pushRemote]);

  const removeMistake = useCallback((word) => {
    if (!word) return;
    setData((prev) => {
      const k = String(word).toLowerCase();
      if (!prev.mistakes[k]) return prev;
      const mistakes = { ...prev.mistakes };
      delete mistakes[k];
      const next = { ...prev, mistakes };
      save(ctxRef.current.userId, next);
      pushRemote(next);
      return next;
    });
  }, [pushRemote]);

  const setProfile = useCallback((patch) => {
    setData((prev) => {
      const next = { ...prev, profile: { ...prev.profile, ...patch, updatedAt: Date.now() } };
      save(ctxRef.current.userId, next);
      pushRemote(next);
      return next;
    });
  }, [pushRemote]);

  /* 记录一次复习结果：答对升盒、答错回到第 0 盒，并安排下次到期时间 */
  const srsReview = useCallback((item, correct) => {
    if (!item || !item.w) return;
    setData((prev) => {
      const srs = { ...(prev.srs || {}) };
      const k = item.w.toLowerCase();
      const cur = srs[k] || { box: 0, reps: 0 };
      const box = correct ? Math.min((cur.box || 0) + 1, SRS_INTERVALS.length - 1) : 0;
      srs[k] = {
        w: item.w, e: item.e || cur.e || '', s: item.s || cur.s || '', cn: item.cn || cur.cn || '',
        box, reps: (cur.reps || 0) + 1, due: Date.now() + SRS_INTERVALS[box], ts: Date.now(),
      };
      const next = { ...prev, srs };
      save(ctxRef.current.userId, next);
      pushRemote(next);
      return next;
    });
  }, [pushRemote]);

  const value = useMemo(() => {
    const levelStars = (level) => {
      let got = 0;
      level.units.forEach((u) => { got += data.stars[keyOf(level.id, u.id)] || 0; });
      return { got, total: level.units.length * 3 };
    };
    const totalStars = () => {
      let got = 0, total = 0;
      CURRICULUM.forEach((lv) => { const s = levelStars(lv); got += s.got; total += s.total; });
      return { got, total };
    };
    const completedUnits = () => Object.values(data.stars).filter((v) => v > 0).length;
    const streak = () => {
      const set = {};
      data.checkins.forEach((d) => { set[d] = 1; });
      const fmt = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      let n = 0, cur = new Date();
      if (!set[fmt(cur)]) cur.setDate(cur.getDate() - 1);
      while (set[fmt(cur)]) { n++; cur.setDate(cur.getDate() - 1); }
      return n;
    };
    const recentDays = (n) => {
      const set = {};
      data.checkins.forEach((d) => { set[d] = 1; });
      const out = [], base = new Date();
      for (let i = n - 1; i >= 0; i--) {
        const d = new Date(base); d.setDate(base.getDate() - i);
        const s = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        out.push({ date: s, day: d.getDate(), on: !!set[s], isToday: i === 0 });
      }
      return out;
    };
    const checkedToday = () => data.checkins.indexOf(todayStr()) >= 0;
    const mistakes = Object.values(data.mistakes || {}).sort((a, b) => (b.ts || 0) - (a.ts || 0));
    const now = Date.now();
    const srsDue = () => Object.values(data.srs || {})
      .filter((x) => (x.due || 0) <= now)
      .sort((a, b) => (a.due || 0) - (b.due || 0))
      .map((x) => ({ w: x.w, e: x.e, s: x.s, cn: x.cn, level: '复习' }));
    const srsDueCount = srsDue().length;
    const srsTotal = Object.keys(data.srs || {}).length;
    return {
      getStars, setStars, levelStars, totalStars, completedUnits, streak, recentDays, checkedToday,
      mistakes, mistakeCount: mistakes.length, addMistake, removeMistake,
      profile: data.profile || {}, setProfile,
      srsReview, srsDue, srsDueCount, srsTotal,
    };
  }, [data, getStars, setStars, addMistake, removeMistake, setProfile, srsReview]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress 必须在 ProgressProvider 内使用');
  return ctx;
}
