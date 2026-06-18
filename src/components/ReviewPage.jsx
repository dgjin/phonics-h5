import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CURRICULUM } from '../data/curriculum';
import { TEXTBOOKS, getTextbook, textbookWords } from '../data/textbook';
import { cnOf } from '../data/word-cn';
import { speakReal, getAccent, setAccent, stop } from '../lib/tts';
import { shuffle } from '../data/utils';
import { useAuth } from '../lib/auth.jsx';
import { useProgress } from '../lib/progress.jsx';
import { Header, Confetti } from './common.jsx';


/* ============================================================
 * ScopeSelector — 结构化范围选择器
 * 三层：① 快捷入口行（全部/错题/自然拼读级别）
 *       ② 教材同步折叠面板（可按册展开/收起）
 * ============================================================ */
function ScopeSelector({ scope, setScope, mistakes }) {
  const [openBook, setOpenBook] = useState(null); // 当前展开的册 id

  // 判断教材相关 scope 是否属于某册
  const bookOf = (s) => {
    if (!s.startsWith('tb:')) return null;
    const parts = s.slice(3).split(':');
    return parts.length >= 2 ? parts[0] : null;
  };
  const activeBook = bookOf(scope);

  // 展开当前选中册（scope 从教材来时自动展开）
  const effectiveOpen = openBook !== null ? openBook : activeBook;

  const toggleBook = (id) => {
    setOpenBook(prev => prev === id ? null : id);
  };

  // 自然拼读级别快捷行
  const phonicsScopes = [
    { id: 'all', label: '全部', icon: 'ti-books' },
    ...(mistakes.length > 0 ? [{ id: 'mistakes', label: `错题 ${mistakes.length}`, icon: 'ti-alert-triangle', cls: 'mk' }] : []),
    ...CURRICULUM.map((lv) => ({ id: lv.id, label: lv.title, icon: 'ti-abc' })),
  ];

  return (
    <div className="scope-selector">
      {/* ── 第一行：快捷入口 ── */}
      <div className="scope-row">
        <div className="scope-row-label"><i className="ti ti-sparkles"></i> 自然拼读</div>
        <div className="scope-pills">
          {phonicsScopes.map((s) => (
            <button
              key={s.id}
              className={'scope-pill' + (scope === s.id ? ' on' : '') + (s.cls ? ' ' + s.cls : '')}
              onClick={() => setScope(s.id)}
            >
              <i className={'ti ' + s.icon}></i>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 第二块：教材同步手风琴 ── */}
      <div className="scope-row">
        <div className="scope-row-label"><i className="ti ti-book-2"></i> 教材同步</div>
        <div className="scope-books">
          {TEXTBOOKS.map((book) => {
            const isOpen = effectiveOpen === book.id;
            const hasActive = activeBook === book.id;
            return (
              <div key={book.id} className={'scope-book' + (isOpen ? ' open' : '') + (hasActive ? ' active-book' : '')}>
                {/* 册标题行（点击展开/收起） */}
                <button className="scope-book-hd" onClick={() => toggleBook(book.id)}>
                  <span className="scope-book-vol">{book.volume}</span>
                  <span className="scope-book-info">
                    {book.units.length} 单元
                    {hasActive && <span className="scope-book-dot"></span>}
                  </span>
                  <i className={'ti ti-chevron-' + (isOpen ? 'up' : 'down') + ' scope-book-chevron'}></i>
                </button>
                {/* 单元列表（折叠/展开） */}
                {isOpen && (
                  <div className="scope-book-units">
                    {book.units.map((u, idx) => {
                      const tbScope = 'tb:' + book.id + ':' + u.id;
                      const on = scope === tbScope;
                      return (
                        <button
                          key={u.id}
                          className={'scope-unit' + (on ? ' on' : '')}
                          onClick={() => setScope(tbScope)}
                        >
                          <span className="scope-unit-no">{idx + 1}</span>
                          <span className="scope-unit-title">{u.title.replace(/^Unit \d+ /, '')}</span>
                          <span className="scope-unit-cnt">{u.words.length}词</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

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
        out.push({ w: it.w, e: it.e, s: it.s, cn: cnOf(it.w), level: lv.title });
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
  const location = useLocation();
  const init = location.state || {};
  const { userId } = useAuth();
  const { mistakes, addMistake, removeMistake } = useProgress();
  const mkey = 'phonics_review_v1:' + (userId || 'guest');
  const loadMastered = () => {
    try { return new Set(JSON.parse(localStorage.getItem(mkey)) || []); } catch (e) { return new Set(); }
  };
  const saveMastered = (set) => {
    try { localStorage.setItem(mkey, JSON.stringify([...set])); } catch (e) {}
  };

  const [accent, setAcc] = useState(getAccent());
  const [mode, setMode] = useState(init.mode === 'dictation' ? 'dictation' : 'flip'); // flip | dictation
  const [scope, setScope] = useState(init.scope || 'all'); // all | mistakes | <levelId> | tb:<unitId>
  const [mastered, setMastered] = useState(loadMastered);
  const autoStarted = useRef(false);
  const [queue, setQueue] = useState(null); // null = 设置页
  const [flipped, setFlipped] = useState(false);
  const [typed, setTyped] = useState('');
  const [checkRes, setCheckRes] = useState(null); // null | 'ok' | 'no'
  const [round, setRound] = useState(0);
  const known = useRef(0);

  useEffect(() => { setMastered(loadMastered()); }, [userId]); // eslint-disable-line

  const mistakeWords = useMemo(
    () => mistakes.map((m) => ({ w: m.w, e: m.e, s: m.s, cn: cnOf(m.w), level: m.level || '错题' })),
    [mistakes]
  );
  const allWords = scope === 'mistakes'
    ? mistakeWords
    : scope.indexOf('tb:') === 0
      ? (() => {
          const parts = scope.slice(3).split(':');
          if (parts.length >= 2) return textbookWords(parts[0], parts[1]);
          return textbookWords(parts[0]); // 兼容旧格式 tb:unitId
        })()
      : buildWords(scope);
  const unmastered = allWords.filter((w) => !mastered.has(w.w)).length;
  const current = queue && queue[0];

  useEffect(() => {
    if (!current) return;
    setFlipped(false); setTyped(''); setCheckRes(null);
    const t = setTimeout(() => speakReal(current.w, accent), 250);
    return () => { clearTimeout(t); stop(); };
  }, [round, accent, current && current.w]); // eslint-disable-line

  const chooseAccent = (a) => { setAcc(a); setAccent(a); };

  const start = (onlyNew) => {
    const deck = onlyNew ? allWords.filter((w) => !mastered.has(w.w)) : allWords;
    if (!deck.length) return;
    known.current = 0;
    setFlipped(false); setTyped(''); setCheckRes(null);
    setQueue(shuffle(deck));
    setRound((r) => r + 1);
  };

  // 从错题库进入时自动开始
  useEffect(() => {
    if (init.auto && !autoStarted.current && queue === null && allWords.length) {
      autoStarted.current = true;
      start(false);
    }
  }); // eslint-disable-line

  const mark = (isKnown) => {
    if (!current) return;
    stop();
    setFlipped(false);
    const head = current;
    if (isKnown) {
      known.current += 1;
      const nm = new Set(mastered); nm.add(head.w);
      setMastered(nm); saveMastered(nm);
      removeMistake(head.w); // 答对/认识 → 移出错题库
    }
    setQueue((q) => (isKnown ? q.slice(1) : [...q.slice(1), head]));
    setRound((r) => r + 1);
  };

  const checkSpelling = () => {
    if (!current || !typed.trim()) return;
    const ok = typed.trim().toLowerCase() === current.w.toLowerCase();
    setCheckRes(ok ? 'ok' : 'no');
    if (ok) setTimeout(() => mark(true), 950);
    else addMistake(current); // 听写写错 → 入错题库
  };

  /* ---------- 设置页 ---------- */
  if (queue === null) {
    return (
      <div className="c-amber">
        <Header title="背单词" sub="真人发音 · 翻卡 / 听写" color="amber" backTo="/" />
        <div className="review-setup">
          <div className="rv-field-label">练习方式</div>
          <div className="mode-tabs">
            <button className={'mode-tab' + (mode === 'flip' ? ' on' : '')} onClick={() => setMode('flip')}>
              <i className="ti ti-cards"></i> 翻卡复习
            </button>
            <button className={'mode-tab' + (mode === 'dictation' ? ' on' : '')} onClick={() => setMode('dictation')}>
              <i className="ti ti-keyboard"></i> 听写练习
            </button>
          </div>
          <div className="rv-field-label">发音口音</div>
          <AccentToggle accent={accent} onChange={chooseAccent} />
          <div className="rv-field-label">选择范围</div>
          <ScopeSelector scope={scope} setScope={setScope} mistakes={mistakeWords} />
          <div className="rv-summary">
            共 <b>{allWords.length}</b> 个单词 · 已掌握 <b>{allWords.length - unmastered}</b> 个
          </div>
          <div className="rv-start">
            <button className="btn primary block" onClick={() => start(false)}>
              {mode === 'dictation' ? '开始听写' : '开始背单词'}（{allWords.length}）
            </button>
            <button className="btn ghost block" disabled={!unmastered} onClick={() => start(true)}>只练未掌握（{unmastered}）</button>
          </div>
          <p className="rv-note">
            {mode === 'dictation'
              ? '听真人发音，写出英文单词，自动判分。'
              : '翻面看中文意思与图片。点「认识」记为已掌握，「不认识」会稍后再次出现。'}
            发音来自有道词典真人录音（需联网）。
          </p>
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
          <div className="result-title">{mode === 'dictation' ? '听写完成！' : '全部掌握啦！'}</div>
          <div className="result-sub">这一轮{mode === 'dictation' ? '写对' : '认识'}了 {known.current} 个单词</div>
          <div className="result-actions">
            <button className="btn primary" onClick={() => start(false)}>再来一遍</button>
            <button className="btn ghost" onClick={() => setQueue(null)}>换个设置</button>
            <button className="btn ghost" onClick={() => navigate('/')}>返回首页</button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- 练习页 ---------- */
  return (
    <div className="c-amber">
      <Header title={mode === 'dictation' ? '听写练习' : '背单词'} sub={current.level} color="amber" backTo="/" />
      <div className="rv-top">
        <span className="rv-count"><i className="ti ti-cards"></i> 剩余 {queue.length}</span>
        <AccentToggle accent={accent} onChange={chooseAccent} small />
        <span className="rv-count"><i className="ti ti-circle-check"></i> {known.current}</span>
      </div>

      <div className="stage">
        {mode === 'flip' ? (
          <>
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
                  {current.e
                    ? <div className="rv-emoji">{current.e}</div>
                    : <div className="rv-emoji letter-fallback">{(current.w[0] || '?').toUpperCase()}</div>}
                  <div className="rv-cn">{current.cn || '—'}</div>
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
          </>
        ) : (
          <div className="dictation">
            <button className="replay" onClick={() => speakReal(current.w, accent)}>
              <i className="ti ti-volume"></i> 听发音（{accent === 'uk' ? '英式' : '美式'}）
            </button>
            <div className="dict-hint">
              {current.e
                ? <span className="dict-emoji">{current.e}</span>
                : <span className="dict-emoji letter-fallback">{(current.w[0] || '?').toUpperCase()}</span>}
              <span className="dict-cn">{current.cn || '听音拼写'}</span>
            </div>
            <input
              className={'dict-input' + (checkRes === 'ok' ? ' ok' : checkRes === 'no' ? ' no' : '')}
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="听发音，写出单词"
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
              disabled={checkRes === 'ok'}
              onKeyDown={(e) => { if (e.key === 'Enter' && checkRes !== 'ok') checkSpelling(); }}
            />
            {checkRes === 'ok' && <div className="dict-result ok"><i className="ti ti-circle-check"></i> 正确！</div>}
            {checkRes === 'no' && <div className="dict-result no">正确答案：<b>{current.w}</b></div>}
            <div className="rv-actions">
              {checkRes === 'no' ? (
                <>
                  <button className="btn dont" onClick={() => { setTyped(''); setCheckRes(null); }}><i className="ti ti-rotate"></i> 再试</button>
                  <button className="btn primary" onClick={() => mark(false)}>下一个 <i className="ti ti-arrow-right"></i></button>
                </>
              ) : (
                <button className="btn know block" disabled={!typed.trim() || checkRes === 'ok'} onClick={checkSpelling}>
                  <i className="ti ti-check"></i> 检查
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
