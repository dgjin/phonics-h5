import { useNavigate } from 'react-router-dom';
import { STORIES } from '../data/stories';
import { useProgress } from '../lib/progress.jsx';
import { Header, Stars } from './common.jsx';

/* 绘本故事列表 */
export default function StoryList() {
  const navigate = useNavigate();
  const { getStars } = useProgress();

  return (
    <div className="c-teal">
      <Header title="绘本故事" sub="分级阅读 · 整句朗读" color="teal" backTo="/" />
      <p className="level-desc">读小故事，听整句朗读，读完做个小测～</p>
      <div className="unit-list">
        {STORIES.map((s) => (
          <button key={s.id} className={'story-card c-' + s.color} onClick={() => navigate('/story/' + s.id)}>
            <div className="story-cover">{s.emoji}</div>
            <div className="unit-main">
              <div className="unit-title">{s.title} <span className="story-lv">{s.level}</span></div>
              <div className="unit-cn">{s.cn} · {s.lines.length} 句</div>
            </div>
            <Stars count={getStars('story', s.id)} />
          </button>
        ))}
      </div>
    </div>
  );
}
