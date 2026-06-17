import { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from './common.jsx';
import { findLevel, findUnit } from '../data/curriculum';
import { useProgress } from '../lib/progress.jsx';
import { ACTIVITIES } from './activities.jsx';

const LABELS = {
  flashcard: '学习卡', trace: '描红写字', listen: '听音选择', match: '连线匹配', spell: '拼单词',
};

export default function GamePage() {
  const { levelId, unitId, gameType } = useParams();
  const navigate = useNavigate();
  const { setStars } = useProgress();

  // 所有 Hook 必须在任何提前 return 之前调用
  const handleFinish = useCallback(
    (stars) => {
      setStars(levelId, unitId, stars);
      navigate('/result/' + levelId + '/' + unitId + '/' + gameType + '/' + stars, { replace: true });
    },
    [levelId, unitId, gameType, setStars, navigate]
  );

  const level = findLevel(levelId);
  const unit = findUnit(levelId, unitId);
  const Activity = ACTIVITIES[gameType];

  if (!level || !unit) return <div className="page-msg">未找到该单元</div>;
  if (!Activity) return <div className="page-msg">未知的练习类型</div>;

  return (
    <>
      <Header title={LABELS[gameType] || gameType} sub={unit.title} color={level.color} backTo={'/unit/' + levelId + '/' + unitId} />
      <div className={'play-mount c-' + level.color}>
        <Activity unit={unit} onFinish={handleFinish} />
      </div>
    </>
  );
}
