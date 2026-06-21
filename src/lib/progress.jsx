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
      daily: d.daily || {},
    };
  } catch {
    return { stars: {}, checkins: [], mistakes: {}, profile: {}, srs: {}, daily: {} };
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
  // 个人资料：优先保留有头像的一方；都有头像则取较新的；
  // 防止被无 profile 的旧数据覆盖掉本地头像
  const lp = local.profile || {}, rp = remote.profile || {};
  let profile;
  if (lp.avatar && !rp.avatar) {
    profile = lp;
  } else if (rp.avatar && !lp.avatar) {
    profile = rp;
  } else {
    profile = (rp.updatedAt || 0) > (lp.updatedAt || 0) ? rp : lp;
  }
  // 间隔复习：按词合并，取最近一次复习记录
  const srs = {};
  const ls = local.srs || {}, rsrs = remote.srs || {};
  new Set([...Object.keys(ls), ...Object.keys(rsrs)]).forEach((k) => {
    const a = ls[k], b = rsrs[k];
    srs[k] = (!b || (a && (a.ts || 0) >= (b.ts || 0))) ? a : b;
  });
  // 每日学习计数：按日期取较大次数
  const daily = {};
  const ld = local.daily || {}, rd = remote.daily || {};
  new Set([...Object.keys(ld), ...Object.keys(rd)]).forEach((d) => {
    daily[d] = { lessons: Math.max((ld[d] && ld[d].lessons) || 0, (rd[d] && rd[d].lessons) || 0) };
  });
  return { stars, checkins, mistakes, profile, srs, daily };
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
      const next = { ...prev, stars: { ...prev.stars }, checkins: prev.checkins.slice(), daily: { ...(prev.daily || {}) } };
      if (stars > (next.stars[k] || 0)) next.stars[k] = stars;
      const t = todayStr();
      if (next.checkins.indexOf(t) < 0) next.checkins.push(t);
      next.daily[t] = { lessons: ((prev.daily && prev.daily[t] && prev.daily[t].lessons) || 0) + 1 };
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

  /* 每日挑战：存储/获取今日题目 */
  const setDailyChallenge = useCallback((tasks) => {
    setData((prev) => {
      const daily = { ...(prev.daily || {}) };
      const t = todayStr();
      daily[t] = { ...(daily[t] || {}), challenge: { tasks, done: false, ts: Date.now() } };
      const next = { ...prev, daily };
      save(ctxRef.current.userId, next);
      pushRemote(next);
      return next;
    });
  }, [pushRemote]);

  const getDailyChallenge = useCallback(() => {
    const t = todayStr();
    const d = data.daily && data.daily[t] && data.daily[t].challenge;
    return d || null;
  }, [data.daily]);

  const completeDailyChallenge = useCallback((stars) => {
    setData((prev) => {
      const daily = { ...(prev.daily || {}) };
      const t = todayStr();
      daily[t] = { ...(daily[t] || {}), challenge: { ...(daily[t] && daily[t].challenge || {}), done: true, stars, ts: Date.now() } };
      const next = { ...prev, daily };
      save(ctxRef.current.userId, next);
      pushRemote(next);
      return next;
    });
  }, [pushRemote]);

  const challengeDoneToday = () => {
    const t = todayStr();
    const d = data.daily && data.daily[t] && data.daily[t].challenge;
    return !!(d && d.done);
  };

  const challengeStreak = () => {
    let n = 0;
    const d = new Date();
    while (true) {
      const s = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      const rec = data.daily && data.daily[s] && data.daily[s].challenge;
      if (rec && rec.done) { n++; d.setDate(d.getDate() - 1); } else break;
    }
    return n;
  };

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

    // 每日目标
    const dailyGoal = 3;
    const todayLessons = (data.daily && data.daily[todayStr()] && data.daily[todayStr()].lessons) || 0;

    // 成就徽章（全部由现有进度派生，无需额外存储）
    const allStars = Object.values(data.stars || {}).reduce((a, b) => a + (b || 0), 0);
    const units = completedUnits();
    const st = streak();
    // 统计绘本和对话完成情况
    const storyStars = Object.entries(data.stars || {}).filter(([k]) => k.startsWith('story/')).reduce((a, [,v]) => a + (v || 0), 0);
    const dialogStars = Object.entries(data.stars || {}).filter(([k]) => k.startsWith('dialog/')).reduce((a, [,v]) => a + (v || 0), 0);
    const challengeSt = challengeStreak();
    const mistakeCount = Object.keys(data.mistakes || {}).length;

    const achDefs = [
      // === 闯关类 ===
      { id: 'first', emoji: '🌱', name: '初次启程', desc: '完成第 1 关', cur: units, target: 1 },
      { id: 'unit10', emoji: '📚', name: '闯关达人', desc: '通关 10 个单元', cur: units, target: 10 },
      { id: 'unit30', emoji: '🧭', name: '闯关大师', desc: '通关 30 个单元', cur: units, target: 30 },
      { id: 'unit50', emoji: '🏆', name: '全能勇者', desc: '通关 50 个单元', cur: units, target: 50 },
      // === 星星类 ===
      { id: 'star10', emoji: '⭐', name: '星光初现', desc: '累计 10 颗星', cur: allStars, target: 10 },
      { id: 'star50', emoji: '🌟', name: '星光熠熠', desc: '累计 50 颗星', cur: allStars, target: 50 },
      { id: 'star100', emoji: '💫', name: '百星达人', desc: '累计 100 颗星', cur: allStars, target: 100 },
      { id: 'star200', emoji: '✨', name: '星光璀璨', desc: '累计 200 颗星', cur: allStars, target: 200 },
      // === 打卡类 ===
      { id: 'streak3', emoji: '🔥', name: '坚持三天', desc: '连续打卡 3 天', cur: st, target: 3 },
      { id: 'streak7', emoji: '🏅', name: '一周不断', desc: '连续打卡 7 天', cur: st, target: 7 },
      { id: 'streak30', emoji: '👑', name: '月度学霸', desc: '连续打卡 30 天', cur: st, target: 30 },
      { id: 'streak100', emoji: '💎', name: '百日传奇', desc: '连续打卡 100 天', cur: st, target: 100 },
      // === 词汇类 ===
      { id: 'word20', emoji: '🗣️', name: '词汇新手', desc: '学习 20 个单词', cur: srsTotal, target: 20 },
      { id: 'word60', emoji: '🎓', name: '词汇能手', desc: '学习 60 个单词', cur: srsTotal, target: 60 },
      { id: 'word120', emoji: '📖', name: '词汇高手', desc: '学习 120 个单词', cur: srsTotal, target: 120 },
      { id: 'word300', emoji: '🧠', name: '词汇大师', desc: '学习 300 个单词', cur: srsTotal, target: 300 },
      // === 绘本类 ===
      { id: 'story3', emoji: '📕', name: '绘本新手', desc: '读完 3 本绘本', cur: storyStars, target: 3 },
      { id: 'story10', emoji: '📗', name: '小书虫', desc: '绘本累计 10 颗星', cur: storyStars, target: 10 },
      { id: 'story24', emoji: '📘', name: '阅读达人', desc: '绘本累计 24 颗星', cur: storyStars, target: 24 },
      // === 对话类 ===
      { id: 'dialog3', emoji: '💬', name: '对话新手', desc: '完成 3 个对话', cur: dialogStars, target: 3 },
      { id: 'dialog10', emoji: '🗨️', name: '口语达人', desc: '对话累计 10 颗星', cur: dialogStars, target: 10 },
      // === 每日挑战类 ===
      { id: 'challenge1', emoji: '🎯', name: '初次挑战', desc: '完成 1 次每日挑战', cur: challengeSt, target: 1 },
      { id: 'challenge7', emoji: '⚔️', name: '挑战勇者', desc: '连续 7 天完成挑战', cur: challengeSt, target: 7 },
      { id: 'challenge30', emoji: '🛡️', name: '挑战王者', desc: '连续 30 天完成挑战', cur: challengeSt, target: 30 },
      // === 错题类 ===
      { id: 'mistake5', emoji: '🔧', name: '知错能改', desc: '错题本积累 5 个词', cur: mistakeCount, target: 5 },
    ];
    const achievements = achDefs.map((d) => ({
      ...d, got: d.cur >= d.target, pct: Math.min(100, Math.round((d.cur / d.target) * 100)),
    }));
    const achievedCount = achievements.filter((a) => a.got).length;

    // 家长周报派生（近 7 天）
    const srsMastered = Object.values(data.srs || {}).filter((x) => (x.box || 0) >= 4).length;
    // 单词熟练度盒子：0(最弱)..5(最熟)，-1 表示没学过
    const srsBox = (w) => { const x = (data.srs || {})[String(w).toLowerCase()]; return x ? (x.box || 0) : -1; };
    const weekReport = () => {
      const days = recentDays(7).map((d) => ({
        ...d, lessons: (data.daily && data.daily[d.date] && data.daily[d.date].lessons) || 0,
      }));
      return { days, activeDays: days.filter((d) => d.on).length, lessons: days.reduce((a, d) => a + d.lessons, 0) };
    };

    return {
      getStars, setStars, levelStars, totalStars, completedUnits, streak, recentDays, checkedToday,
      mistakes, mistakeCount: mistakes.length, addMistake, removeMistake,
      profile: data.profile || {}, setProfile,
      srsReview, srsDue, srsDueCount, srsTotal, srsMastered, srsBox,
      dailyGoal, todayLessons, achievements, achievedCount, achievementTotal: achievements.length,
      setDailyChallenge, getDailyChallenge, completeDailyChallenge, challengeDoneToday: challengeDoneToday(), challengeStreak: challengeStreak(),
      weekReport,
    };
  }, [data, getStars, setStars, addMistake, removeMistake, setProfile, srsReview]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress 必须在 ProgressProvider 内使用');
  return ctx;
}
