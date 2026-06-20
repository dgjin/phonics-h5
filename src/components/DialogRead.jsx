import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDialogue } from '../data/dialogues';
import { speakReal, stop } from '../lib/tts';
import { recorderSupported, startRecorder } from '../lib/recorder';
import { shuffle, starsFor } from '../data/utils';
import { useProgress } from '../lib/progress.jsx';
import { Header, Confetti, Feedback, ProgressDots } from './common.jsx';

function useFeedback() {
  const [fb, setFb] = useState(null);
  const timer = useRef(null);
  const fire = useCallback((ok) => { setFb(ok ? 'ok' : 'no'); clearTimeout(timer.current); timer.current = setTimeout(() => setFb(null), 850); }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  return [fb ? <Feedback ok={fb === 'ok'} /> : null, fire];
}

export default function DialogRead() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dlg = getDialogue(id);
  const { setStars } = useProgress();
  const recOK = recorderSupported();

  const [phase, setPhase] = useState('read'); // read | order | done
  const [idx, setIdx] = useState(0);
  const [doneStars, setDoneStars] = useState(0);
  // 录音
  const [recording, setRecording] = useState(false);
  const [myUrl, setMyUrl] = useState(null);
  const recRef = useRef(null), recTimer = useRef(null), urlRef = useRef(null), myAudioRef = useRef(null);

  // 句子排序题
  const orderQs = useMemo(() => {
    if (!dlg) return [];
    return shuffle(dlg.lines).slice(0, Math.min(3, dlg.lines.length)).map((l) => ({ cn: l.cn, full: l.en, ans: l.en.split(' ') }));
  }, [dlg]);
  const [qi, setQi] = useState(0);
  const [placed, setPlaced] = useState([]);
  const [shake, setShake] = useState(false);
  const correct = useRef(0);
  const [fbNode, fire] = useFeedback();

  const clearRec = () => {
    clearTimeout(recTimer.current);
    if (recRef.current) { recRef.current.cancel(); recRef.current = null; }
    if (urlRef.current) { URL.revokeObjectURL(urlRef.current); urlRef.current = null; }
  };

  // 阅读：自动朗读当前句，重置录音
  useEffect(() => {
    if (phase !== 'read' || !dlg) return;
    clearRec(); setRecording(false); setMyUrl(null);
    const t = setTimeout(() => speakReal(dlg.lines[idx].en), 250);
    return () => { clearTimeout(t); stop(); clearRec(); };
  }, [phase, idx, dlg]); // eslint-disable-line

  // 排序题：每题重置
  const q = orderQs[qi];
  const tray = useMemo(() => (q ? shuffle(q.ans.map((w, i) => ({ w, i }))) : []), [q]);
  useEffect(() => { setPlaced([]); setShake(false); }, [qi]);

  if (!dlg) return <div className="c-coral"><Header title="对话" color="coral" backTo="/dialog" /><p className="level-desc">未找到该对话</p></div>;

  /* ----- 录音（角色跟读） ----- */
  const startR = () => {
    if (urlRef.current) { URL.revokeObjectURL(urlRef.current); urlRef.current = null; setMyUrl(null); }
    startRecorder().then((ctrl) => {
      recRef.current = ctrl; setRecording(true);
      clearTimeout(recTimer.current); recTimer.current = setTimeout(() => stopR(), 5000);
    }).catch(() => {});
  };
  const stopR = () => {
    clearTimeout(recTimer.current);
    const ctrl = recRef.current; if (!ctrl) return;
    recRef.current = null; setRecording(false);
    ctrl.stop().then((url) => { if (!url) return; urlRef.current = url; setMyUrl(url); const a = new Audio(url); myAudioRef.current = a; a.play().catch(() => {}); });
  };
  const toggleR = () => { if (recording) stopR(); else startR(); };
  const playMine = () => { if (!urlRef.current) return; const a = myAudioRef.current || new Audio(urlRef.current); myAudioRef.current = a; try { a.currentTime = 0; } catch (e) {} a.play().catch(() => {}); };

  const startOrder = () => { correct.current = 0; setQi(0); setPlaced([]); setPhase('order'); };

  /* ----- 句子排序 ----- */
  const usedI = new Set(placed.map((p) => p.i));
  const place = (tile) => {
    if (usedI.has(tile.i) || placed.length >= q.ans.length) return;
    const next = [...placed, tile]; setPlaced(next);
    if (next.length === q.ans.length) {
      if (next.map((p) => p.w).join(' ') === q.full) {
        correct.current += 1; speakReal(q.full); fire(true);
        setTimeout(() => {
          if (qi < orderQs.length - 1) setQi(qi + 1);
          else { const s = starsFor(correct.current, orderQs.length); setStars('dialog', id, s); setDoneStars(s); setPhase('done'); }
        }, 1000);
      } else { setShake(true); setTimeout(() => { setShake(false); setPlaced([]); }, 600); }
    }
  };
  const unplace = (i) => { if (i === placed.length - 1) setPlaced(placed.slice(0, -1)); };

  /* ========== 完成 ========== */
  if (phase === 'done') {
    return (
      <div className="c-coral">
        <Header title={dlg.title} sub={dlg.cn} color="coral" backTo="/dialog" />
        <Confetti />
        <div className="result">
          <div className="result-emoji">{doneStars >= 3 ? '🎉' : doneStars === 2 ? '😃' : '💪'}</div>
          <div className="result-title">{doneStars >= 3 ? '说得真棒！' : '完成啦！'}</div>
          <div className="result-stars">{[0, 1, 2].map((i) => <i key={i} className={'ti ti-star' + (i < doneStars ? ' on' : '')}></i>)}</div>
          <div className="result-actions">
            <button className="btn primary" onClick={() => { setPhase('read'); setIdx(0); }}>再读一遍</button>
            <button className="btn ghost" onClick={() => navigate('/dialog')}>返回对话</button>
          </div>
        </div>
      </div>
    );
  }

  /* ========== 句子排序 ========== */
  if (phase === 'order') {
    return (
      <div className="c-coral">
        <Header title="句子排序" sub={dlg.title} color="coral" backTo="/dialog" />
        <ProgressDots idx={qi} total={orderQs.length} />
        <div className="stage">
          <div className="q-title"><i className="ti ti-arrows-sort"></i> 把句子排成正确顺序</div>
          <div className="ord-cn">{q.cn}</div>
          <div className={'ord-answer' + (shake ? ' shake' : '')}>
            {placed.map((p, i) => <button key={i} className="ord-tile" onClick={() => unplace(i)}>{p.w}</button>)}
          </div>
          <div className="ord-tray">
            {tray.map((t) => <button key={t.i} className={'ord-tile tray' + (usedI.has(t.i) ? ' used' : '')} disabled={usedI.has(t.i)} onClick={() => place(t)}>{t.w}</button>)}
          </div>
        </div>
        {fbNode}
      </div>
    );
  }

  /* ========== 对话阅读 ========== */
  const line = dlg.lines[idx];
  const last = idx === dlg.lines.length - 1;
  return (
    <div className="c-coral">
      <Header title={dlg.title} sub={dlg.cn} color="coral" backTo="/dialog" />
      <ProgressDots idx={idx} total={dlg.lines.length} />
      <div className="dialog">
        {dlg.lines.slice(0, idx + 1).map((l, i) => (
          <div key={i} className={'bubble ' + (l.speaker === 'A' ? 'left' : 'right') + (i === idx ? ' cur' : '')}>
            <div className="bubble-emoji">{l.e || (l.speaker === 'A' ? '🧒' : '🧑')}</div>
            <div className="bubble-body">
              <div className="bubble-en">{l.en}</div>
              <div className="bubble-cn">{l.cn}</div>
            </div>
            <button className="bubble-play" onClick={() => speakReal(l.en)} aria-label="朗读"><i className="ti ti-volume"></i></button>
          </div>
        ))}
      </div>

      {recOK && (
        <div className="dialog-rec">
          <button className={'dialog-mic' + (recording ? ' rec' : '')} onClick={toggleR}>
            <i className={'ti ' + (recording ? 'ti-player-stop-filled' : 'ti-microphone')}></i> {recording ? '停止' : myUrl ? '再录' : '跟读这句'}
          </button>
          {myUrl && !recording && <button className="dialog-mic play" onClick={playMine}><i className="ti ti-player-play-filled"></i> 我的录音</button>}
        </div>
      )}

      <div className="nav-row">
        <button className="btn ghost" onClick={() => idx > 0 && setIdx(idx - 1)} aria-label="上一句"><i className="ti ti-arrow-left"></i></button>
        <button className="btn primary" onClick={() => (last ? startOrder() : setIdx(idx + 1))}>
          {last ? <>句子排序 <i className="ti ti-arrow-right"></i></> : <>下一句 <i className="ti ti-arrow-right"></i></>}
        </button>
      </div>
    </div>
  );
}
