import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getStory, STORIES } from '../data/stories';
import { speakReal, stop } from '../lib/tts';
import { shuffle, sample, starsFor } from '../data/utils';
import { useProgress } from '../lib/progress.jsx';
import { Header, Confetti, Feedback, ProgressDots } from './common.jsx';

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

export default function StoryRead() {
  const navigate = useNavigate();
  const { id } = useParams();
  const story = getStory(id);
  const { setStars } = useProgress();

  const [phase, setPhase] = useState('read'); // read | quiz | done
  const [idx, setIdx] = useState(0);
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState(null);
  const [doneStars, setDoneStars] = useState(0);
  const correct = useRef(0);
  const [fbNode, fire] = useFeedback();

  const allLines = useMemo(() => STORIES.flatMap((s) => s.lines.map((l) => l.en)), []);
  const quiz = useMemo(() => {
    if (!story) return [];
    return story.lines.slice(0, Math.min(3, story.lines.length)).map((line) => ({
      cn: line.cn, ans: line.en, opts: shuffle([line.en, ...sample(allLines.filter((x) => x !== line.en), 2)]),
    }));
  }, [story, allLines]);

  // 阅读：自动朗读当前句
  useEffect(() => {
    if (phase !== 'read' || !story) return;
    const t = setTimeout(() => speakReal(story.lines[idx].en), 250);
    return () => { clearTimeout(t); stop(); };
  }, [phase, idx, story]);

  // 小测：自动朗读题目句
  useEffect(() => {
    if (phase !== 'quiz') return;
    setPicked(null);
    const t = setTimeout(() => speakReal(quiz[qi].ans), 250);
    return () => { clearTimeout(t); stop(); };
  }, [phase, qi, quiz]);

  if (!story) {
    return <div className="c-teal"><Header title="故事" color="teal" backTo="/story" /><p className="level-desc">未找到该故事</p></div>;
  }

  const startQuiz = () => { correct.current = 0; setQi(0); setPicked(null); setPhase('quiz'); };

  const choose = (o) => {
    if (picked) return;
    setPicked(o);
    const ok = o === quiz[qi].ans;
    if (ok) correct.current += 1;
    fire(ok);
    setTimeout(() => {
      if (qi < quiz.length - 1) setQi(qi + 1);
      else {
        const stars = starsFor(correct.current, quiz.length);
        setStars('story', id, stars);
        setDoneStars(stars); setPhase('done');
      }
    }, 1100);
  };

  /* ---------- 完成 ---------- */
  if (phase === 'done') {
    return (
      <div className="c-teal">
        <Header title={story.title} sub={story.cn} color="teal" backTo="/story" />
        <Confetti />
        <div className="result">
          <div className="result-emoji">{doneStars >= 3 ? '🎉' : doneStars === 2 ? '😃' : '💪'}</div>
          <div className="result-title">{doneStars >= 3 ? '读得真棒！' : '完成啦！'}</div>
          <div className="result-stars">
            {[0, 1, 2].map((i) => <i key={i} className={'ti ti-star' + (i < doneStars ? ' on' : '')}></i>)}
          </div>
          <div className="result-actions">
            <button className="btn primary" onClick={() => { setPhase('read'); setIdx(0); }}>再读一遍</button>
            <button className="btn ghost" onClick={() => navigate('/story')}>返回故事</button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- 小测 ---------- */
  if (phase === 'quiz') {
    const q = quiz[qi];
    return (
      <div className="c-teal">
        <Header title="读后小测" sub={story.title} color="teal" backTo="/story" />
        <ProgressDots idx={qi} total={quiz.length} />
        <div className="stage">
          <div className="q-title"><i className="ti ti-help-circle"></i> 选出对应的英文句子</div>
          <div className="story-quiz-cn">{q.cn}</div>
          <div className="story-opts">
            {q.opts.map((o, i) => {
              let cls = 'story-opt';
              if (picked) { if (o === q.ans) cls += ' right'; else if (o === picked) cls += ' wrong'; }
              return <button key={i} className={cls} onClick={() => choose(o)}>{o}</button>;
            })}
          </div>
        </div>
        {fbNode}
      </div>
    );
  }

  /* ---------- 阅读 ---------- */
  const line = story.lines[idx];
  const last = idx === story.lines.length - 1;
  return (
    <div className="c-teal">
      <Header title={story.title} sub={story.cn} color="teal" backTo="/story" />
      <ProgressDots idx={idx} total={story.lines.length} />
      <div className="stage">
        <div className="story-page" onClick={() => speakReal(line.en)}>
          <div className="story-page-emoji">{line.e || story.emoji}</div>
          <div className="story-page-en">{line.en}</div>
          <div className="story-page-cn">{line.cn}</div>
          <div className="tap-hint"><i className="ti ti-volume"></i> 点卡片听整句朗读</div>
        </div>
        <div className="nav-row">
          <button className="btn ghost" onClick={() => idx > 0 && setIdx(idx - 1)} aria-label="上一句"><i className="ti ti-arrow-left"></i></button>
          <button className="btn primary" onClick={() => (last ? startQuiz() : setIdx(idx + 1))}>
            {last ? <>读后小测 <i className="ti ti-arrow-right"></i></> : <>下一句 <i className="ti ti-arrow-right"></i></>}
          </button>
        </div>
      </div>
    </div>
  );
}
