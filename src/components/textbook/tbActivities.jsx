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
  const { addMistake } = useProgress();
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
  const { addMistake } = useProgress();
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

export const TB_ACTIVITIES = { vocab: VocabCard, trans: TransChoice, listen: ListenPick };

export const TB_ACTS = [
  { type: 'vocab', name: '认词卡', icon: 'ti-cards', desc: '学单词与中文' },
  { type: 'trans', name: '中英选择', icon: 'ti-language', desc: '看中文选英文' },
  { type: 'listen', name: '听音选词', icon: 'ti-ear', desc: '听发音选单词' },
  { type: 'dictation', name: '听写练习', icon: 'ti-keyboard', desc: '听音写单词' },
];
