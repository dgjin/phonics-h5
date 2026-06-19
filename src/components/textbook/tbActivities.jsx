import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ProgressDots, Feedback } from '../common.jsx';
import { speak, stop } from '../../lib/tts';
import { shuffle, sample, starsFor } from '../../data/utils';
import { useProgress } from '../../lib/progress.jsx';

/* 无 emoji 时用首字母方块兜底 */
function visual(it, cls) {
  return it.e
    ? <div className={cls}>{it.e}</div>
    : <div className={cls + ' letter-fallback'}>{(it.w[0] || '?').toUpperCase()}</div>;
}

function useFeedback() {
  const [fb, setFb] = useState(null);
  const timer = useRef(null);
  const fire = useCallback((ok) => {
    setFb(ok ? 'ok' : 'no');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setFb(null), 850);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  return [fb ? <Feedback ok={fb === 'ok'} /> : null, fire];
}

/* ============ 认词卡：学单词 ============ */
export function VocabCard({ words, onFinish }) {
  const [idx, setIdx] = useState(0);
  const it = words[idx];
  const last = idx === words.length - 1;

  useEffect(() => {
    const t = setTimeout(() => speak(it.w), 250);
    return () => { clearTimeout(t); stop(); };
  }, [idx, it]);

  return (
    <>
      <ProgressDots idx={idx} total={words.length} />
      <div className="stage">
        <div className="flash" onClick={() => speak(it.w)}>
          {visual(it, 'flash-emoji')}
          <div className="flash-word">{it.w}</div>
          <div className="flash-sound">{it.cn}</div>
          <div className="tap-hint"><i className="ti ti-volume"></i> 点卡片听发音</div>
        </div>
        <div className="nav-row">
          <button className="btn ghost" onClick={() => idx > 0 && setIdx(idx - 1)} aria-label="上一个">
            <i className="ti ti-arrow-left"></i>
          </button>
          <button className="btn primary" onClick={() => (last ? onFinish(3) : setIdx(idx + 1))}>
            {last ? <>完成 <i className="ti ti-check"></i></> : <>下一个 <i className="ti ti-arrow-right"></i></>}
          </button>
        </div>
      </div>
    </>
  );
}

/* ============ 中英选择：看中文/图，选英文 ============ */
export function TransChoice({ words, onFinish }) {
  const qs = useMemo(() => shuffle(words).slice(0, Math.min(8, words.length)), [words]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [locked, setLocked] = useState(false);
  const correct = useRef(0);
  const { addMistake, srsReview } = useProgress();
  const [fbNode, fire] = useFeedback();
  const ans = qs[idx];
  const opts = useMemo(
    () => shuffle([ans, ...sample(words.filter((w) => w !== ans), Math.min(3, words.length - 1))]),
    [ans, words]
  );

  useEffect(() => { setPicked(null); setLocked(false); return () => stop(); }, [idx]);

  const choose = (o) => {
    if (locked) return;
    setLocked(true); setPicked(o);
    const ok = o === ans;
    if (ok) { correct.current += 1; speak(ans.w); } else addMistake(ans);
    srsReview(ans, ok);
    fire(ok);
    setTimeout(() => {
      if (idx < qs.length - 1) setIdx(idx + 1);
      else onFinish(starsFor(correct.current, qs.length));
    }, 1100);
  };

  return (
    <>
      <ProgressDots idx={idx} total={qs.length} />
      <div className="stage">
        <div className="q-title"><i className="ti ti-language"></i> 选出正确的英文单词</div>
        <div className="trans-prompt">
          {visual(ans, 'trans-emoji')}
          <div className="trans-cn">{ans.cn}</div>
        </div>
        <div className="opt-grid">
          {opts.map((o, i) => {
            let cls = 'opt';
            if (picked) { if (o === ans) cls += ' right'; else if (o === picked) cls += ' wrong'; }
            return (
              <button key={i} className={cls} onClick={() => choose(o)}>
                <div className="opt-word">{o.w}</div>
              </button>
            );
          })}
        </div>
      </div>
      {fbNode}
    </>
  );
}

/* ============ 听音选词：听发音，选英文 ============ */
export function ListenPick({ words, onFinish }) {
  const qs = useMemo(() => shuffle(words).slice(0, Math.min(8, words.length)), [words]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [locked, setLocked] = useState(false);
  const correct = useRef(0);
  const { addMistake, srsReview } = useProgress();
  const [fbNode, fire] = useFeedback();
  const ans = qs[idx];
  const opts = useMemo(
    () => shuffle([ans, ...sample(words.filter((w) => w !== ans), Math.min(3, words.length - 1))]),
    [ans, words]
  );

  useEffect(() => {
    setPicked(null); setLocked(false);
    const t = setTimeout(() => speak(ans.w), 300);
    return () => { clearTimeout(t); stop(); };
  }, [idx, ans]);

  const choose = (o) => {
    if (locked) return;
    setLocked(true); setPicked(o);
    const ok = o === ans;
    if (ok) correct.current += 1; else addMistake(ans);
    srsReview(ans, ok);
    fire(ok);
    setTimeout(() => {
      if (idx < qs.length - 1) setIdx(idx + 1);
      else onFinish(starsFor(correct.current, qs.length));
    }, 1100);
  };

  return (
    <>
      <ProgressDots idx={idx} total={qs.length} />
      <div className="stage">
        <div className="q-title"><i className="ti ti-ear"></i> 听一听，选出正确的词</div>
        <button className="replay" onClick={() => speak(ans.w)}><i className="ti ti-volume"></i> 再听一次</button>
        <div className="opt-grid">
          {opts.map((o, i) => {
            let cls = 'opt';
            if (picked) { if (o === ans) cls += ' right'; else if (o === picked) cls += ' wrong'; }
            return (
              <button key={i} className={cls} onClick={() => choose(o)}>
                {o.e ? <div className="opt-emoji">{o.e}</div> : null}
                <div className="opt-word">{o.w}</div>
              </button>
            );
          })}
        </div>
      </div>
      {fbNode}
    </>
  );
}

/* ============ 连连看：单词 ↔ 图片配对 ============ */
export function MatchTb({ words, onFinish }) {
  const { addMistake, srsReview } = useProgress();
  const withPic = useMemo(() => words.filter((w) => w.e), [words]);
  const pool = useMemo(() => shuffle(withPic).slice(0, Math.min(5, withPic.length)), [withPic]);
  const left = useMemo(() => shuffle(pool), [pool]);
  const right = useMemo(() => shuffle(pool), [pool]);
  const [matched, setMatched] = useState(() => new Set());
  const [selWord, setSelWord] = useState(null);
  const [selPic, setSelPic] = useState(null);
  const [shake, setShake] = useState(false);
  const miss = useRef(0);
  const [fbNode, fire] = useFeedback();
  const doneRef = useRef(false);

  useEffect(() => () => stop(), []);
  useEffect(() => {
    if (!selWord || !selPic) return;
    if (selWord === selPic) {
      speak(selWord.w); srsReview(selWord, true);
      const next = new Set(matched); next.add(selWord);
      setMatched(next); setSelWord(null); setSelPic(null);
      if (next.size === pool.length && !doneRef.current) {
        doneRef.current = true; fire(true);
        setTimeout(() => onFinish(starsFor(pool.length - Math.min(miss.current, pool.length), pool.length)), 900);
      }
    } else {
      miss.current += 1; addMistake(selWord); srsReview(selWord, false);
      setShake(true);
      const t = setTimeout(() => { setShake(false); setSelWord(null); setSelPic(null); }, 500);
      return () => clearTimeout(t);
    }
  }, [selWord, selPic]); // eslint-disable-line

  if (pool.length < 2) return <div className="stage"><div className="q-title">本单元可连图的词不够~</div></div>;

  return (
    <>
      <ProgressDots idx={matched.size} total={pool.length} />
      <div className="stage">
        <div className="q-title"><i className="ti ti-link"></i> 把单词和图片连起来</div>
        <div className="match-cols">
          <div className="match-col">
            {left.map((it) => {
              const done = matched.has(it);
              let cls = 'mtile word'; if (done) cls += ' done'; else if (selWord === it) cls += ' sel' + (shake ? ' shake' : '');
              return (
                <button key={it.w} className={cls} disabled={done} onClick={() => setSelWord(it)}>
                  <span onClick={(e) => { e.stopPropagation(); speak(it.w); }}><i className="ti ti-volume"></i></span>
                  <span className="mtile-label">{it.w}</span>
                </button>
              );
            })}
          </div>
          <div className="match-col">
            {right.map((it) => {
              const done = matched.has(it);
              let cls = 'mtile pic'; if (done) cls += ' done'; else if (selPic === it) cls += ' sel' + (shake ? ' shake' : '');
              return (
                <button key={it.w} className={cls} disabled={done} onClick={() => setSelPic(it)}>
                  <span className="mtile-emoji">{it.e}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {fbNode}
    </>
  );
}

/* ============ 看图拼词：字母块拼单词 ============ */
export function SpellTb({ words, onFinish }) {
  const { addMistake, srsReview } = useProgress();
  const spellable = useMemo(() => words.filter((w) => /^[a-z]+$/i.test(w.w)), [words]);
  const qs = useMemo(() => shuffle(spellable).slice(0, Math.min(6, spellable.length)), [spellable]);
  const [idx, setIdx] = useState(0);
  const correct = useRef(0);
  const [fbNode, fire] = useFeedback();
  const it = qs[idx];
  const answer = useMemo(() => (it ? it.w.split('') : []), [it]);
  const trayTiles = useMemo(() => shuffle(answer.map((t, i) => ({ t, i }))), [answer]);
  const [placed, setPlaced] = useState([]);
  const [shake, setShake] = useState(false);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    setPlaced([]); setShake(false); setSolved(false);
    const t = setTimeout(() => it && speak(it.w), 250);
    return () => { clearTimeout(t); stop(); };
  }, [idx, it]);

  if (!qs.length) return <div className="stage"><div className="q-title">本单元没有可拼写的单词~</div></div>;

  const usedIdx = new Set(placed.map((p) => p.i));
  const place = (tile) => {
    if (solved || usedIdx.has(tile.i) || placed.length >= answer.length) return;
    const next = [...placed, tile]; setPlaced(next);
    if (next.length === answer.length) {
      if (next.map((p) => p.t).join('') === answer.join('')) {
        setSolved(true); correct.current += 1; speak(it.w); srsReview(it, true); fire(true);
        setTimeout(() => { if (idx < qs.length - 1) setIdx(idx + 1); else onFinish(starsFor(correct.current, qs.length)); }, 1100);
      } else {
        addMistake(it); srsReview(it, false); setShake(true);
        setTimeout(() => { setShake(false); setPlaced([]); }, 600);
      }
    }
  };
  const unplaceLast = () => { if (!solved) setPlaced(placed.slice(0, -1)); };

  return (
    <>
      <ProgressDots idx={idx} total={qs.length} />
      <div className="stage">
        <div className="q-title"><i className="ti ti-pencil"></i> 看图拼出单词</div>
        <div className="spell-head" onClick={() => speak(it.w)}>
          {visual(it, 'spell-emoji')}
          <div className="spell-cn">{it.cn}</div>
        </div>
        <div className={'slots' + (solved ? ' right' : '') + (shake ? ' shake' : '')}>
          {answer.map((_, i) => {
            const p = placed[i];
            return <span key={i} className={'slot' + (p ? ' filled' : '')} onClick={() => p && i === placed.length - 1 && unplaceLast()}>{p ? p.t : ''}</span>;
          })}
        </div>
        <div className="tray">
          {trayTiles.map((tile) => (
            <button key={tile.i} className={'tile' + (usedIdx.has(tile.i) ? ' used' : '')} disabled={usedIdx.has(tile.i)} onClick={() => place(tile)}>{tile.t}</button>
          ))}
        </div>
      </div>
      {fbNode}
    </>
  );
}

/* ============ 限时挑战：60 秒看中文抢选英文 ============ */
export function ChallengeTb({ words, onFinish }) {
  const { srsReview } = useProgress();
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [q, setQ] = useState(null);
  const [picked, setPicked] = useState(null);
  const scoreRef = useRef(0);
  const overRef = useRef(false);

  const nextQ = useCallback(() => {
    const ans = words[Math.floor(Math.random() * words.length)];
    const opts = shuffle([ans, ...sample(words.filter((w) => w !== ans), Math.min(3, words.length - 1))]);
    setQ({ ans, opts }); setPicked(null);
  }, [words]);

  useEffect(() => { nextQ(); return () => stop(); }, []); // eslint-disable-line
  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(t); overRef.current = true;
          const sc = scoreRef.current;
          setTimeout(() => onFinish(sc >= 8 ? 3 : sc >= 5 ? 2 : sc >= 1 ? 1 : 0), 50);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []); // eslint-disable-line

  const choose = (o) => {
    if (picked || overRef.current) return;
    setPicked(o);
    const ok = o === q.ans;
    if (ok) { scoreRef.current += 1; setScore(scoreRef.current); srsReview(q.ans, true); } else srsReview(q.ans, false);
    setTimeout(() => { if (!overRef.current) nextQ(); }, 380);
  };

  if (!q) return <div className="stage" />;

  return (
    <div className="stage">
      <div className="challenge-bar"><div className="challenge-time" style={{ width: (timeLeft / 60) * 100 + '%' }}></div></div>
      <div className="challenge-top"><span><i className="ti ti-clock"></i> {timeLeft}s</span><span><i className="ti ti-bolt"></i> 得分 {score}</span></div>
      <div className="q-title">看中文，快选英文</div>
      <div className="trans-prompt">
        {visual(q.ans, 'trans-emoji')}
        <div className="trans-cn">{q.ans.cn}</div>
      </div>
      <div className="opt-grid">
        {q.opts.map((o, i) => {
          let cls = 'opt'; if (picked) { if (o === q.ans) cls += ' right'; else if (o === picked) cls += ' wrong'; }
          return <button key={i} className={cls} onClick={() => choose(o)}><div className="opt-word">{o.w}</div></button>;
        })}
      </div>
    </div>
  );
}

export const TB_ACTIVITIES = { vocab: VocabCard, trans: TransChoice, listen: ListenPick, match: MatchTb, spell: SpellTb, challenge: ChallengeTb };

export const TB_ACTS = [
  { type: 'vocab', name: '认词卡', icon: 'ti-cards', desc: '学单词与中文' },
  { type: 'trans', name: '中英选择', icon: 'ti-language', desc: '看中文选英文' },
  { type: 'listen', name: '听音选词', icon: 'ti-ear', desc: '听发音选单词' },
  { type: 'match', name: '连连看', icon: 'ti-link', desc: '单词连图片' },
  { type: 'spell', name: '看图拼词', icon: 'ti-pencil', desc: '字母块拼词' },
  { type: 'challenge', name: '限时挑战', icon: 'ti-bolt', desc: '60 秒抢答' },
  { type: 'dictation', name: '听写练习', icon: 'ti-keyboard', desc: '听音写单词' },
];
