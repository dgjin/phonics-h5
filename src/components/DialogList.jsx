import { useNavigate } from 'react-router-dom';
import { DIALOGUES } from '../data/dialogues';
import { useProgress } from '../lib/progress.jsx';
import { Header, Stars } from './common.jsx';

/* 句型 / 对话列表 */
export default function DialogList() {
  const navigate = useNavigate();
  const { getStars } = useProgress();

  return (
    <div className="c-coral">
      <Header title="句型对话" sub="情景对话 · 跟读 · 句子排序" color="coral" backTo="/" />
      <p className="level-desc">听情景对话、跟读练口语，再把句子排排序～</p>
      <div className="unit-list">
        {DIALOGUES.map((d) => (
          <button key={d.id} className={'story-card c-' + d.color} onClick={() => navigate('/dialog/' + d.id)}>
            <div className="story-cover">{d.emoji}</div>
            <div className="unit-main">
              <div className="unit-title">{d.title} <span className="story-lv">{d.level}</span></div>
              <div className="unit-cn">{d.cn} · {d.lines.length} 句</div>
            </div>
            <Stars count={getStars('dialog', d.id)} />
          </button>
        ))}
      </div>
    </div>
  );
}
