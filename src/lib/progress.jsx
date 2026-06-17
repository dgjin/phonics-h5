/* 学习进度 Context：星星 + 打卡，本地 localStorage 持久化；登录后与 Supabase 双向同步 */
import { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { CURRICULUM } from '../data/curriculum';
import { useAuth } from './auth.jsx';

const ProgressContext = createContext(null);

const lsKey = (uid) => 'phonics_data_v2:' + (uid || 'guest');
function load(uid) {
  try {
    const d = JSON.parse(localStorage.getItem(lsKey(uid))) || {};
    return { stars: d.stars || {}, checkins: d.checkins || [] };
  } catch {
    return { stars: {}, checkins: [] };
  }
}
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
  return { stars, checkins };
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
    return { getStars, setStars, levelStars, totalStars, completedUnits, streak, recentDays, checkedToday };
  }, [data, getStars, setStars]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress 必须在 ProgressProvider 内使用');
  return ctx;
}
