import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../lib/progress.jsx';
import { Header, Feedback } from './common.jsx';
import { speakReal, stop } from '../lib/tts';
import { CURRICULUM } from '../data/curriculum';
import { shuffle, sample } from '../data/utils';

/* 从课程数据中提取所有单词 */
function allWords() {
  const out = [];
  CURRICULUM.forEach((lv) => {
    lv.units.forEach((u) => {
      u.items.forEach((it) => {
        if (it.w) out.push({ w: it.w, e: it.e || '', cn: it.cn || '', s: it.s || '', level: lv.id });
      });
    });
  });
  return out;
}

/* 生成 3 道随机题目 */
function genTasks(pool) {
  if (pool.length < 4) return [];
  const picked = sample(pool, 3);
  const types = ['listen', 'spell', 'pic'];
  return picked.map((item, i) => {
    const type = types[i % 3];
    const distractors = sample(pool.filter((x) => x.w !== item.w), 3).map((x) => x.w);
    const opts = shuffle([item.w, ...distractors]);
    return { type, item, opts, ans: item.w };
  });
}

/* 单道题渲染 */
function TaskCard({ task, idx, onAnswer, fb }) {
  const { type, item, opts, ans } = task;
  const [picked, setPicked] = useState(null);
  const [localFb, setLocalFb] = useState(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const choose = (opt) => {
    if (picked) return;
    setPicked(opt);
    const ok = opt === ans;
    setLocalFb(ok ? 'ok' : 'no');
    timer.current = setTimeout(() => {
      onAnswer(ok, idx);
      setLocalFb(null);
    }, 900);
  };

  if (type === 'listen') {
    return (
      <div className="dc-card">
        <div className="dc-type"><i className="ti ti-headphones"></i> 听音选词</div>
        <button className="dc-play" onClick={() => speakReal(item.w)}>
          <i className="ti ti-volume"></i> 再听一次
        </button>
        {localFb && <Feedback ok={localFb === 'ok'} />}
        <div className="dc-opts">
          {opts.map((o) => (
            <button key={o}
              className={'dc-opt' + (picked === o ? (o === ans ? ' ok' : ' no') : '')}
              onClick={() => choose(o)}>
              {o}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'pic') {
    return (
      <div className="dc-card">
        <div className="dc-type"><i className="ti ti-photo"></i> 看图选词</div>
        <div className="dc-pic-emoji">{item.e || '❓'}</div>
        <div className="dc-pic-cn">{item.cn}</div>
        {localFb && <Feedback ok={localFb === 'ok'} />}
        <div className="dc-opts">
          {opts.map((o) => (
            <button key={o}
              className={'dc-opt' + (picked === o ? (o === ans ? ' ok' : ' no') : '')}
              onClick={() => choose(o)}>
              {o}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // spell - 听音拼写（选择题形式简化）
  return (
    <div className="dc-card">
      <div className="dc-type"><i className="ti ti-writing"></i> 听音拼词</div>
      <button className="dc-play" onClick={() => speakReal(item.w)}>
        <i className="ti ti-volume"></i> 播放发音
      </button>
      <div className="dc-hint">提示：{item.cn}</div>
      {localFb && <Feedback ok={localFb === 'ok'} />}
      <div className="dc-opts">
        {opts.map((o) => (
          <button key={o}
            className={'dc-opt' + (picked === o ? (o === ans ? ' ok' : ' no') : '')}
            onClick={() => choose(o)}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function DailyChallenge() {
  const navigate = useNavigate();
  const { srsTotal, setDailyChallenge, getDailyChallenge, completeDailyChallenge } = useProgress();
  const [phase, setPhase] = useState('intro'); // intro | play | done
  const [qi, setQi] = useState(0);
  const [correct, setCorrect] = useState(0);

  const pool = useMemo(() => allWords(), []);
  const tasks = useMemo(() => {
    const today = getDailyChallenge();
    if (today && today.tasks && today.tasks.length === 3) {
      return today.tasks; // 今天已有题目，复用
    }
    return genTasks(pool);
  }, [pool, getDailyChallenge]);

  useEffect(() => {
    if (phase === 'play' && tasks[qi]) {
      const t = setTimeout(() => speakReal(tasks[qi].item.w), 300);
      return () => { clearTimeout(t); stop(); };
    }
  }, [phase, qi, tasks]);

  if (tasks.length < 3) {
    return (
      <div className="c-purple">
        <Header title="每日挑战" sub="每天 3 道题" color="purple" backTo="/" />
        <div className="dc-empty">
          <div className="dc-empty-emoji">📝</div>
          <p>学完更多单词后就能开始每日挑战啦！</p>
          <button className="btn primary" onClick={() => navigate('/')}>去学习</button>
        </div>
      </div>
    );
  }

  if (phase === 'intro') {
    return (
      <div className="c-purple">
        <Header title="每日挑战" sub="每天 3 道题 · 赢宝箱" color="purple" backTo="/" />
        <div className="dc-intro">
          <div className="dc-chest">🎁</div>
          <h2>今日挑战</h2>
          <p>完成 3 道题，赢取宝箱奖励！</p>
          <div className="dc-task-preview">
            {tasks.map((t, i) => (
              <div key={i} className="dc-preview-item">
                <span className="dc-preview-num">{i + 1}</span>
                <span className="dc-preview-type">
                  {t.type === 'listen' ? '🎧 听音选词' : t.type === 'pic' ? '🖼️ 看图选词' : '✍️ 听音拼词'}
                </span>
              </div>
            ))}
          </div>
          <button className="btn primary big" onClick={() => {
            setDailyChallenge(tasks);
            setPhase('play');
          }}>
            <i className="ti ti-player-play-filled"></i> 开始挑战
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'play') {
    const task = tasks[qi];
    return (
      <div className="c-purple">
        <Header title="每日挑战" sub={`第 ${qi + 1} / 3 题`} color="purple" backTo="/" />
        <div className="dc-progress">
          {tasks.map((_, i) => (
            <span key={i} className={'dc-dot' + (i < qi ? ' done' : i === qi ? ' on' : '')}></span>
          ))}
        </div>
        <TaskCard
          key={qi}
          task={task}
          idx={qi}
          onAnswer={(ok, i) => {
            if (ok) setCorrect((c) => c + 1);
            setTimeout(() => {
              if (qi < 2) setQi(qi + 1);
              else setPhase('done');
            }, 100);
          }}
        />
      </div>
    );
  }

  // done
  const stars = correct >= 3 ? 3 : correct >= 2 ? 2 : correct >= 1 ? 1 : 0;
  // 保存挑战结果
  if (stars > 0) completeDailyChallenge(stars);
  const reward = stars >= 3 ? '🏆 完美通关！' : stars >= 2 ? '🎉 很棒！' : stars >= 1 ? '👍 加油！' : '💪 继续努力！';

  return (
    <div className="c-purple">
      <Header title="挑战完成" sub="看看你的成绩" color="purple" backTo="/" />
      <div className="dc-done">
        <div className="dc-done-chest">{stars >= 3 ? '🏆' : stars >= 2 ? '🎁' : stars >= 1 ? '⭐' : '📦'}</div>
        <h2>{reward}</h2>
        <div className="dc-score">
          <div className="dc-score-num">{correct}<span> / 3</span></div>
          <div className="dc-score-lab">答对题数</div>
        </div>
        <div className="dc-stars-row">
          {[1, 2, 3].map((n) => (
            <span key={n} className={'dc-star' + (n <= stars ? ' on' : '')}>
              <i className="ti ti-star"></i>
            </span>
          ))}
        </div>
        <div className="dc-done-actions">
          <button className="btn ghost" onClick={() => navigate('/')}>
            <i className="ti ti-home"></i> 回首页
          </button>
          <button className="btn primary" onClick={() => {
            setPhase('intro'); setQi(0); setCorrect(0);
          }}>
            <i className="ti ti-refresh"></i> 再来一次
          </button>
        </div>
      </div>
    </div>
  );
}
