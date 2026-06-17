import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CURRICULUM } from '../data/curriculum';
import { speakReal, getAccent, setAccent, stop } from '../lib/tts';
import { shuffle } from '../data/utils';
import { useAuth } from '../lib/auth.jsx';
import { Header, Confetti } from './common.jsx';

/* 汇总全部课程单词，按词去重；可按级别筛选 */
function buildWords(scope) {
  const out = [];
  const seen = new Set();
  CURRICULUM.forEach((lv) => {
    if (scope !== 'all' && lv.id !== scope) return;
    lv.units.forEach((u) =>
      u.items.forEach((it) => {
        if (!it.w || seen.has(it.w)) return;
        seen.add(it.w);
        out.push({ w: it.w, e: it.e, s: it.s, level: lv.title });
      })
    );
  });
  return out;
}

function AccentToggle({ accent, onChange, small }) {
  return (
    <div className={'accent-toggle' + (small ? ' sm' : '')}>
      <button className={accent === 'us' ? 'on' : ''} onClick={() => onChange('us')}>美式</button>
      <button className={accent === 'uk' ? 'on' : ''} onClick={() => onChange('uk')}>英式</button>
    </div>
  );
}

export default function ReviewPage() {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const mkey = 'phonics_review_v1:' + (userId || 'guest');
  const loadMastered = () => {
    try { return new Set(JSON.parse(localStorage.getItem(mkey)) || []); } catch (e) { return new Set(); }
  };
  const saveMastered = (set) => {
    try { localStorage.setItem(mkey, JSON.stringify([...set])); } catch (e) {}
  };

  const [accent, setAcc] = useState(getAccent());
  const [scope, setScope] = useState('all');
  const [mastered, setMastered] = useState(loadMastered);
  const [queue, setQueue] = useState(null); // null = 设置页
  const [flipped, setFlipped] = useState(false);
  const [round, setRound] = useState(0);
  const known = useRef(0);

  useEffect(() => { setMastered(loadMastered()); }, [userId]); // eslint-disable-line

  const allWords = useMemo(() => buildWords(scope), [scope]);
  const unmastered = allWords.filter((w) => !mastered.has(w.w)).length;
  const current = queue && queue[0];

  useEffect(() => {
    if (!current) return;
    setFlipped(false);
    const t = setTimeout(() => speakReal(current.w, accent), 250);
    return () => { clearTimeout(t); stop(); };
  }, [round, accent, current && current.w]); // eslint-disable-line

  const chooseAccent = (a) => { setAcc(a); setAccent(a); };

  const start = (onlyNew) => {
    const deck = onlyNew ? allWords.filter((w) => !mastered.has(w.w)) : allWords;
    if (!deck.length) return;
    known.current = 0;
    setFlipped(false);
    setQueue(shuffle(deck));
    setRound((r) => r + 1);
  };

  const mark = (isKnown) => {
    if (!current) return;
    stop();
    setFlipped(false);
    const head = current;
    if (isKnown) {
      known.current += 1;
      const nm = new Set(mastered); nm.add(head.w);
      setMastered(nm); saveMastered(nm);
    }
    setQueue((q) => (isKnown ? q.slice(1) : [...q.slice(1), head]));
    setRound((r) => r + 1);
  };

  /* ---------- 设置页 ---------- */
  if (queue === null) {
    return (
      <div className="c-amber">
        <Header title="背单词" sub="真人发音 · 翻卡复习" color="amber" backTo="/" />
        <div className="review-setup">
          <div className="rv-field-label">发音口音</div>
          <AccentToggle accent={accent} onChange={chooseAccent} />
          <div className="rv-field-label">选择范围</div>
          <div className="scope-chips">
            <button className={'scope-chip' + (scope === 'all' ? ' on' : '')} onClick={() => setScope('all')}>全部</button>
            {CURRICULUM.map((lv) => (
              <button key={lv.id} className={'scope-chip' + (scope === lv.id ? ' on' : '')} onClick={() => setScope(lv.id)}>
                {lv.title}
              </button>
            ))}
          </div>
          <div className="rv-summary">
            共 <b>{allWords.length}</b> 个单词 · 已掌握 <b>{allWords.length - unmastered}</b> 个
          </div>
          <div className="rv-start">
            <button className="btn primary block" onClick={() => start(false)}>开始背单词（{allWords.length}）</button>
            <button className="btn ghost block" disabled={!unmastered} onClick={() => start(true)}>只背未掌握（{unmastered}）</button>
          </div>
          <p className="rv-note">真人美式 / 英式发音来自有道词典（需联网）。点「认识」记为已掌握，「不认识」会稍后再次出现。</p>
        </div>
      </div>
    );
  }

  /* ---------- 完成页 ---------- */
  if (queue.length === 0) {
    return (
      <div className="c-amber">
        <Header title="背单词" color="amber" backTo="/" />
        <Confetti />
        <div className="result">
          <div className="result-emoji">🎉</div>
          <div className="result-title">全部掌握啦！</div>
          <div className="result-sub">这一轮认识了 {known.current} 个单词</div>
          <div className="result-actions">
            <button className="btn primary" onClick={() => start(false)}>再背一遍</button>
            <button className="btn ghost" onClick={() => setQueue(null)}>换个范围</button>
            <button className="btn ghost" onClick={() => navigate('/')}>返回首页</button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- 卡片页 ---------- */
  return (
    <div className="c-amber">
      <Header title="背单词" sub={current.level} color="amber" backTo="/" />
      <div className="rv-top">
        <span className="rv-count"><i className="ti ti-cards"></i> 剩余 {queue.length}</span>
        <AccentToggle accent={accent} onChange={chooseAccent} small />
        <span className="rv-count"><i className="ti ti-circle-check"></i> {known.current}</span>
      </div>
      <div className="stage">
        <div className={'rv-card' + (flipped ? ' flip' : '')} onClick={() => setFlipped((f) => !f)}>
          <div className="rv-inner">
            <div className="rv-face rv-front">
              <div className="rv-word">{current.w}</div>
              <div className="rv-ipa">{current.s}</div>
              <button className="replay small rv-play" onClick={(e) => { e.stopPropagation(); speakReal(current.w, accent); }}>
                <i className="ti ti-volume"></i> {accent === 'uk' ? '英式' : '美式'}发音
              </button>
              <div className="rv-hint"><i className="ti ti-hand-finger"></i> 想想意思，点卡片翻面</div>
            </div>
            <div className="rv-face rv-back">
              <div className="rv-emoji">{current.e}</div>
              <div className="rv-word sm">{current.w}</div>
              <button className="replay small rv-play" onClick={(e) => { e.stopPropagation(); speakReal(current.w, accent); }}>
                <i className="ti ti-volume"></i> 再听一次
              </button>
            </div>
          </div>
        </div>
        <div className="rv-actions">
          <button className="btn dont" onClick={() => mark(false)}><i className="ti ti-rotate"></i> 不认识</button>
          <button className="btn know" onClick={() => mark(true)}><i className="ti ti-check"></i> 认识</button>
        </div>
      </div>
    </div>
  );
}
