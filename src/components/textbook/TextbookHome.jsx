import { useNavigate, useParams } from 'react-router-dom';
import { getTextbook } from '../../data/textbook';
import { useProgress } from '../../lib/progress.jsx';
import { Header, Stars } from '../common.jsx';

export default function TextbookHome() {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const book = getTextbook(bookId);
  const levelId = 'tb-' + book.id;
  const { getStars } = useProgress();

  return (
    <div className="c-green">
      <Header title={book.name} sub={book.volume} color="green" backTo={'/tb/' + book.id} />
      <p className="level-desc">跟着课本单元学单词 · 真人发音 · 答错自动进错题库</p>
      <div className="unit-list">
        {book.units.map((u, i) => (
          <button key={u.id} className="unit-card" onClick={() => navigate('/tb/' + book.id + '/' + u.id)}>
            <div className="unit-no">{i + 1}</div>
            <div className="unit-main">
              <div className="unit-title">{u.title}</div>
              <div className="unit-cn">{u.words.length} 个单词</div>
            </div>
            <Stars count={getStars(levelId, u.id)} />
          </button>
        ))}
      </div>
    </div>
  );
}
