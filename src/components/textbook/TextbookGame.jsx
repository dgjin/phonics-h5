import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTextbook } from '../../data/textbook';
import { useProgress } from '../../lib/progress.jsx';
import { Header, Confetti } from '../common.jsx';
import { TB_ACTIVITIES, TB_ACTS } from './tbActivities.jsx';

export default function TextbookGame() {
  const navigate = useNavigate();
  const { bookId, unitId, type } = useParams();
  const { setStars } = useProgress();
  const [result, setResult] = useState(null);

  const book = getTextbook(bookId);
  const levelId = 'tb-' + book.id;
  const u = book.units.find((x) => x.id === unitId);
  const Comp = TB_ACTIVITIES[type];
  const label = (TB_ACTS.find((a) => a.type === type) || {}).name || '练习';

  if (!u || !Comp) {
    return (
      <div className="c-green">
        <Header title="练习" color="green" backTo={'/tb/' + bookId + '/' + unitId} />
        <p className="level-desc">练习不存在</p>
      </div>
    );
  }

  const onFinish = (stars) => {
    setStars(levelId, unitId, stars);
    setResult(stars);
  };

  if (result != null) {
    const tip = result >= 3 ? '太棒了，全对！' : result === 2 ? '做得不错！' : '继续加油！';
    return (
      <div className="c-green">
        <Header title={label} sub={u.title} color="green" backTo={'/tb/' + bookId + '/' + unitId} />
        <Confetti />
        <div className="result">
          <div className="result-emoji">{result >= 3 ? '🎉' : result === 2 ? '😃' : '💪'}</div>
          <div className="result-title">{tip}</div>
          <div className="result-stars">
            {[0, 1, 2].map((i) => <i key={i} className={'ti ti-star' + (i < result ? ' on' : '')}></i>)}
          </div>
          <div className="result-actions">
            <button className="btn primary" onClick={() => setResult(null)}>再来一次</button>
            <button className="btn ghost" onClick={() => navigate('/tb/' + bookId + '/' + unitId)}>返回单元</button>
            <button className="btn ghost" onClick={() => navigate('/tb/' + bookId)}>返回教材</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="c-green">
      <Header title={label} sub={u.title} color="green" backTo={'/tb/' + bookId + '/' + unitId} />
      <Comp words={u.words} onFinish={onFinish} />
    </div>
  );
}
