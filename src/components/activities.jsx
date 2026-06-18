import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ProgressDots, Feedback } from './common.jsx';
import { speak, speakItem, speakLetter, stop } from '../lib/tts';
import { shuffle, sample, tilesOf, starsFor, highlight } from '../data/utils';
import { useProgress } from '../lib/progress.jsx';

/* 即时反馈：返回 [node, fire(ok)] */
function useFeedback() {
  const [fb, setFb] = useState(null);
  const timer = useRef(null);
  const fire = useCallback((ok) => {
    setFb(ok ? 'ok' : 'no');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setFb(null), 850);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  const node = fb ? <Feedback ok={fb === 'ok'} /> : null;
  return [node, fire];
}

/* ================= 学习卡 ================= */
export function Flashcard({ unit, onFinish }) {
  const items = unit.items;
  const [idx, setIdx] = useState(0);
  const it = items[idx];
  const last = idx === items.length - 1;

  useEffect(() => {
    const t = setTimeout(() => speakItem(it), 250);
    return () => { clearTimeout(t); stop(); };
  }, [idx, it]);

  return (
    <>
      <ProgressDots idx={idx} total={items.length} />
      <div className="stage">
        <div className="flash" onClick={() => speakItem(it)}>
          <div className="flash-letter">{it.l}</div>
          <div className="flash-sound">{it.s}</div>
          <div className="flash-emoji">{it.e}</div>
          <div className="flash-word" dangerouslySetInnerHTML={{ __html: highlight(it) }} />
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

/* ================= 听音选择 ================= */
export function Listen({ unit, onFinish }) {
  const items = unit.items;
  const qs = useMemo(() => shuffle(items).slice(0, Math.min(6, items.length)), [items]);
  const [idx, setIdx] = useState(0);
  const [locked, setLocked] = useState(false);
  const [picked, setPicked] = useState(null);
  const correct = useRef(0);
  const [fbNode, fire] = useFeedback();
  const { addMistake } = useProgress();
  const ans = qs[idx];
  const opts = useMemo(() => {
    const distract = sample(items.filter((x) => x !== ans), Math.min(2, items.length - 1));
    return shuffle([ans, ...distract]);
  }, [ans, items]);

  useEffect(() => {
    setLocked(false); setPicked(null);
    const t = setTimeout(() => speak(ans.w), 300);
    return () => { clearTimeout(t); stop(); };
  }, [idx, ans]);

  const choose = (o) => {
    if (locked) return;
    setLocked(true); setPicked(o);
    const ok = o === ans;
    if (ok) correct.current += 1;
    else addMistake(ans);
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
            if (picked) {
              if (o === ans) cls += ' right';
              else if (o === picked) cls += ' wrong';
            }
            return (
              <button key={i} className={cls} onClick={() => choose(o)}>
                <div className="opt-emoji">{o.e}</div>
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

/* ================= 连线匹配 ================= */
export function Match({ unit, onFinish }) {
  const items = unit.items;
  const pool = useMemo(() => shuffle(items).slice(0, Math.min(5, items.length)), [items]);
  const left = useMemo(() => shuffle(pool), [pool]);
  const right = useMemo(() => shuffle(pool), [pool]);
  const [matched, setMatched] = useState(() => new Set());
  const [selWord, setSelWord] = useState(null);
  const [selEmoji, setSelEmoji] = useState(null);
  const [shake, setShake] = useState(false);
  const mistakes = useRef(0);
  const [fbNode, fire] = useFeedback();
  const { addMistake } = useProgress();
  const finishedRef = useRef(false);

  useEffect(() => () => stop(), []);

  useEffect(() => {
    if (!selWord || !selEmoji) return;
    if (selWord === selEmoji) {
      speak(selWord.w);
      const nextMatched = new Set(matched); nextMatched.add(selWord);
      setMatched(nextMatched);
      setSelWord(null); setSelEmoji(null);
      if (nextMatched.size === pool.length && !finishedRef.current) {
        finishedRef.current = true;
        fire(true);
        setTimeout(() => onFinish(starsFor(pool.length - Math.min(mistakes.current, pool.length), pool.length)), 900);
      }
    } else {
      mistakes.current += 1;
      if (selWord) addMistake(selWord);
      setShake(true);
      const t = setTimeout(() => { setShake(false); setSelWord(null); setSelEmoji(null); }, 500);
      return () => clearTimeout(t);
    }
  }, [selWord, selEmoji, matched, pool, onFinish, fire, addMistake]);

  const idOf = (it) => it.w;

  return (
    <>
      <ProgressDots idx={matched.size} total={pool.length} />
      <div className="stage">
        <div className="q-title"><i className="ti ti-link"></i> 把单词和图片连起来</div>
        <div className="match-cols">
          <div className="match-col">
            {left.map((it) => {
              const done = matched.has(it);
              let cls = 'mtile word';
              if (done) cls += ' done';
              else if (selWord === it) cls += ' sel' + (shake ? ' shake' : '');
              return (
                <button key={idOf(it)} className={cls} disabled={done} onClick={() => setSelWord(it)}>
                  <span onClick={(e) => { e.stopPropagation(); speak(it.w); }}><i className="ti ti-volume"></i></span>
                  <span className="mtile-label">{it.w}</span>
                </button>
              );
            })}
          </div>
          <div className="match-col">
            {right.map((it) => {
              const done = matched.has(it);
              let cls = 'mtile pic';
              if (done) cls += ' done';
              else if (selEmoji === it) cls += ' sel' + (shake ? ' shake' : '');
              return (
                <button key={idOf(it)} className={cls} disabled={done} onClick={() => setSelEmoji(it)}>
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

/* ================= 拼单词 ================= */
export function Spell({ unit, onFinish }) {
  const items = unit.items;
  const qs = useMemo(() => shuffle(items).slice(0, Math.min(6, items.length)), [items]);
  const [idx, setIdx] = useState(0);
  const correct = useRef(0);
  const [fbNode, fire] = useFeedback();
  const { addMistake } = useProgress();
  const it = qs[idx];
  const answer = useMemo(() => tilesOf(it), [it]);
  const trayTiles = useMemo(
    () => shuffle(answer.map((t, i) => ({ t, i }))),
    [answer]
  );
  const [placed, setPlaced] = useState([]); // [{t,i}]
  const [shake, setShake] = useState(false);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    setPlaced([]); setShake(false); setSolved(false);
    const t = setTimeout(() => speak(it.w), 250);
    return () => { clearTimeout(t); stop(); };
  }, [idx, it]);

  const usedIdx = new Set(placed.map((p) => p.i));

  const place = (tile) => {
    if (solved || usedIdx.has(tile.i) || placed.length >= answer.length) return;
    const next = [...placed, tile];
    setPlaced(next);
    if (next.length === answer.length) {
      const guess = next.map((p) => p.t).join('');
      if (guess === answer.join('')) {
        setSolved(true); correct.current += 1; speak(it.w); fire(true);
        setTimeout(() => {
          if (idx < qs.length - 1) setIdx(idx + 1);
          else onFinish(starsFor(correct.current, qs.length));
        }, 1100);
      } else {
        addMistake(it);
        setShake(true);
        setTimeout(() => { setShake(false); setPlaced([]); }, 600);
      }
    }
  };
  const unplaceLast = () => { if (!solved) setPlaced(placed.slice(0, -1)); };

  return (
    <>
      <ProgressDots idx={idx} total={qs.length} />
      <div className="stage">
        <div className="q-title"><i className="ti ti-pencil"></i> 拼出这个单词</div>
        <div className="spell-head" onClick={() => speak(it.w)}>
          <div className="spell-emoji">{it.e}</div>
          <button className="replay small"><i className="ti ti-volume"></i> 听发音</button>
        </div>
        <div className={'slots' + (solved ? ' right' : '') + (shake ? ' shake' : '')}>
          {answer.map((_, i) => {
            const p = placed[i];
            return (
              <span
                key={i}
                className={'slot' + (p ? ' filled' : '')}
                onClick={() => p && i === placed.length - 1 && unplaceLast()}
              >
                {p ? p.t : ''}
              </span>
            );
          })}
        </div>
        <div className="tray">
          {trayTiles.map((tile) => (
            <button
              key={tile.i}
              className={'tile' + (usedIdx.has(tile.i) ? ' used' : '')}
              disabled={usedIdx.has(tile.i)}
              onClick={() => place(tile)}
            >
              {tile.t}
            </button>
          ))}
        </div>
      </div>
      {fbNode}
    </>
  );
}

/* ================= 描红写字 ================= */
export function Trace({ unit, onFinish }) {
  const items = unit.items;
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);
  const canvasRef = useRef(null);
  const boxRef = useRef(null);
  const draw = useRef({ ctx: null, last: null, length: 0 });
  const it = items[idx];
  const last = idx === items.length - 1;
  const THRESHOLD = 1100;

  const setup = useCallback(() => {
    const canvas = canvasRef.current, box = boxRef.current;
    if (!canvas || !box) return;
    const w = box.clientWidth, h = box.clientHeight;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = w * ratio; canvas.height = h * ratio;
    const ctx = canvas.getContext('2d');
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = getComputedStyle(box).getPropertyValue('--accent') || '#7F77DD';
    draw.current = { ctx, last: null, length: 0 };
  }, []);

  useEffect(() => {
    setDone(false);
    setup();
    const t = setTimeout(() => speakLetter(it.l[0] || it.l), 250);
    return () => { clearTimeout(t); stop(); };
  }, [idx, it, setup]);

  const pos = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    return { x: p.clientX - r.left, y: p.clientY - r.top };
  };
  const start = (e) => { e.preventDefault(); draw.current.last = pos(e); };
  const move = (e) => {
    const d = draw.current;
    if (!d.last || !d.ctx) return;
    e.preventDefault();
    const p = pos(e);
    d.ctx.beginPath(); d.ctx.moveTo(d.last.x, d.last.y); d.ctx.lineTo(p.x, p.y); d.ctx.stroke();
    d.length += Math.hypot(p.x - d.last.x, p.y - d.last.y);
    d.last = p;
    if (!done && d.length > THRESHOLD) setDone(true);
  };
  const end = () => { draw.current.last = null; };
  const clear = () => {
    const c = canvasRef.current; if (!c) return;
    draw.current.ctx.clearRect(0, 0, c.width, c.height);
    draw.current.length = 0; setDone(false);
  };

  return (
    <>
      <ProgressDots idx={idx} total={items.length} />
      <div className="stage">
        <div className="q-title"><i className="ti ti-pencil"></i> 用手指描出字母</div>
        <div ref={boxRef} className={'trace-box' + (done ? ' trace-done' : '')}>
          <div className="trace-guide">{it.l}</div>
          <canvas
            ref={canvasRef}
            className="trace-canvas"
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={end}
            onPointerLeave={end}
          ></canvas>
        </div>
        <div className="trace-ctrls">
          <button className="btn ghost" onClick={() => speakLetter(it.l[0] || it.l)}><i className="ti ti-volume"></i> 发音</button>
          <button className="btn ghost" onClick={clear}><i className="ti ti-eraser"></i> 重写</button>
          <button className="btn primary" disabled={!done} onClick={() => (last ? onFinish(3) : setIdx(idx + 1))}>
            {last ? <>完成 <i className="ti ti-check"></i></> : <>下一个 <i className="ti ti-arrow-right"></i></>}
          </button>
        </div>
      </div>
    </>
  );
}

export const ACTIVITIES = { flashcard: Flashcard, trace: Trace, listen: Listen, match: Match, spell: Spell };
