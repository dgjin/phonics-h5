import { useNavigate } from 'react-router-dom';
import { TEXTBOOKS } from '../../data/textbook';
import { useProgress } from '../../lib/progress.jsx';
import { Header } from '../common.jsx';

const BOOK_COLORS = ['green', 'blue', 'amber', 'red'];
const BOOK_ICONS = ['ti-book-2', 'ti-book', 'ti-books', 'ti-notebook'];

export default function TextbookSelect() {
  const navigate = useNavigate();
  const { getStars } = useProgress();

  return (
    <div className="c-green">
      <Header title="教材同步" sub="外研版·新交际英语" color="green" backTo="/" />
      <p className="level-desc">跟课本单元学单词 · 真人发音 · 闯关打星</p>
      <div className="book-select">
        {TEXTBOOKS.map((book, i) => {
          const levelId = 'tb-' + book.id;
          const totalUnits = book.units.length;
          const totalWords = book.units.reduce((s, u) => s + u.words.length, 0);
          const gotStars = book.units.reduce((s, u) => s + getStars(levelId, u.id), 0);
          const maxStars = totalUnits * 3;
          const pct = maxStars > 0 ? Math.round((gotStars / maxStars) * 100) : 0;
          const color = BOOK_COLORS[i % BOOK_COLORS.length];
          const icon = BOOK_ICONS[i % BOOK_ICONS.length];

          return (
            <button
              key={book.id}
              className={'book-card c-' + color}
              onClick={() => navigate('/tb/' + book.id)}
            >
              <div className="book-icon"><i className={'ti ' + icon}></i></div>
              <div className="book-main">
                <div className="book-grade">{book.grade}</div>
                <div className="book-vol">{book.volume}</div>
                <div className="book-meta">
                  <span>{totalUnits} 单元</span>
                  <span className="dot">·</span>
                  <span>{totalWords} 词</span>
                  <span className="dot">·</span>
                  <span><i className="ti ti-star"></i> {gotStars}/{maxStars}</span>
                </div>
                <div className="book-pbar-wrap">
                  <div className="book-pbar">
                    <div className="book-pfill" style={{ width: pct + '%' }}></div>
                  </div>
                  <span className="book-pct">{pct}%</span>
                </div>
              </div>
              <i className="ti ti-chevron-right book-arrow"></i>
            </button>
          );
        })}
      </div>
    </div>
  );
}
