import { useParams, useNavigate } from 'react-router-dom';
import { Confetti } from './common.jsx';
import { findLevel, findUnit } from '../data/curriculum';

const LABELS = {
  flashcard: '学习卡', trace: '描红写字', listen: '听音选择', match: '连线匹配', spell: '拼单词',
};

export default function ResultPage() {
  const { levelId, unitId, gameType, stars } = useParams();
  const navigate = useNavigate();
  const level = findLevel(levelId);
  const unit = findUnit(levelId, unitId);
  if (!level || !unit) return <div className="page-msg">未找到</div>;

  const n = parseInt(stars, 10) || 0;
  const emoji = n >= 3 ? '🏆' : n >= 2 ? '🎉' : '👍';
  const title = n >= 3 ? '太棒了！' : n >= 2 ? '做得好！' : '继续加油！';

  return (
    <>
      <div className={'result c-' + level.color}>
        <div className="result-emoji">{emoji}</div>
        <div className="result-title">{title}</div>
        <div className="result-stars">
          {[0, 1, 2].map((i) => (
            <i key={i} className={'ti ti-star' + (i < n ? ' on' : '')}></i>
          ))}
        </div>
        <div className="result-sub">{unit.title} · {LABELS[gameType] || gameType}</div>
        <div className="result-actions">
          <button className="btn primary" onClick={() => navigate('/game/' + levelId + '/' + unitId + '/' + gameType)}>
            <i className="ti ti-refresh"></i> 再来一次
          </button>
          <button className="btn ghost" onClick={() => navigate('/unit/' + levelId + '/' + unitId)}>
            <i className="ti ti-list"></i> 选其它练习
          </button>
        </div>
      </div>
      {n >= 2 && <Confetti />}
    </>
  );
}
