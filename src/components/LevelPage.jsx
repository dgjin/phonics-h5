import { useParams, useNavigate } from 'react-router-dom';
import { Header, Stars } from './common.jsx';
import { findLevel } from '../data/curriculum';
import { useProgress } from '../lib/progress.jsx';

export default function LevelPage() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { getStars } = useProgress();
  const level = findLevel(levelId);

  if (!level) return <div className="page-msg">未找到该级别</div>;

  return (
    <>
      <Header title={level.title} sub={level.cn} color={level.color} backTo="/" />
      <p className="level-desc">{level.desc}</p>
      <div className="unit-list">
        {level.units.map((u, i) => (
          <button
            key={u.id}
            className={'unit-card c-' + level.color}
            onClick={() => navigate('/unit/' + level.id + '/' + u.id)}
          >
            <div className="unit-no">{i + 1}</div>
            <div className="unit-main">
              <div className="unit-title">{u.title}</div>
              <div className="unit-cn">{u.cn}</div>
            </div>
            <Stars count={getStars(level.id, u.id)} />
          </button>
        ))}
      </div>
    </>
  );
}
