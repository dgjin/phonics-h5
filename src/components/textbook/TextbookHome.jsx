import { useNavigate } from 'react-router-dom';
import { TEXTBOOK } from '../../data/textbook';
import { useProgress } from '../../lib/progress.jsx';
import { Header, Stars } from '../common.jsx';

export const TB_LEVEL = 'tb-' + TEXTBOOK.id;

export default function TextbookHome() {
  const navigate = useNavigate();
  const { getStars } = useProgress();

  return (
    <div className="c-green">
      <Header title={TEXTBOOK.name} sub={TEXTBOOK.volume} color="green" backTo="/" />
      <p className="level-desc">跟着课本单元学单词 · 真人发音 · 答错自动进错题库</p>
      <div className="unit-list">
        {TEXTBOOK.units.map((u, i) => (
          <button key={u.id} className="unit-card" onClick={() => navigate('/tb/' + u.id)}>
            <div className="unit-no">{i + 1}</div>
            <div className="unit-main">
              <div className="unit-title">{u.title}</div>
              <div className="unit-cn">{u.words.length} 个单词</div>
            </div>
            <Stars count={getStars(TB_LEVEL, u.id)} />
          </button>
        ))}
      </div>
    </div>
  );
}
