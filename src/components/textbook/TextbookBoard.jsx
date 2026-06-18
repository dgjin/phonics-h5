import { useNavigate, useParams } from 'react-router-dom';
import { getTextbook } from '../../data/textbook';
import { useProgress } from '../../lib/progress.jsx';
import { Header } from '../common.jsx';

export default function TextbookBoard() {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const book = getTextbook(bookId);
  const levelId = 'tb-' + book.id;
  const { getStars } = useProgress();

  const unitStars = book.units.map(u => ({ ...u, stars: getStars(levelId, u.id) }));
  const maxStars = book.units.length * 3;
  const gotStars = unitStars.reduce((s, u) => s + u.stars, 0);
  const pct = maxStars > 0 ? Math.round((gotStars / maxStars) * 100) : 0;

  let lockedThreshold = -1;
  for (let i = 0; i < unitStars.length; i++) { if (unitStars[i].stars === 0) lockedThreshold = i; }

  return (
    <div className="tb-board c-green">
      <Header title={book.name} sub={book.volume + ' · 闯关地图'} color="green" backTo="/tb" />

      <div className="board-progress">
        <div className="board-pbar">
          <div className="board-fill" style={{ width: pct + '%' }}></div>
        </div>
        <div className="board-pinfo">{gotStars} / {maxStars} 星</div>
      </div>

      <div className="board-grid">
        {book.units.map((u, i) => {
          const stars = unitStars[i].stars;
          const locked = i >= lockedThreshold;
          const done = stars >= 3;
          return (
            <button
              key={u.id}
              className={'board-tile' + (locked ? ' locked' : '') + (done ? ' done' : '') + (stars > 0 && stars < 3 ? ' partial' : '')}
              disabled={locked}
              onClick={() => { if (!locked) navigate('/tb/' + book.id + '/' + u.id); }}
            >
              <div className="tile-num">{i + 1}</div>
              <div className="tile-title">{u.title.match(/^(Unit \d+)/)?.[1] ?? '单元' + (i + 1)}</div>
              <div className="tile-sub">{u.title.replace(/^(Unit \d+ )/, '')}</div>
              {!locked && (
                <div className="tile-stars">
                  {[0, 1, 2].map(s => (
                    <i key={s} className={'ti ti-star' + (s < stars ? ' on' : '')}></i>
                  ))}
                </div>
              )}
              {locked && <div className="tile-lock"><i className="ti ti-lock"></i></div>}
              {done && !locked && (
                <div className="tile-check">
                  <i className="ti ti-circle-check-fill"></i>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <button className="board-home" onClick={() => navigate('/tb/' + book.id + '/home')}>
        <i className="ti ti-list"></i> 列表视图
      </button>
    </div>
  );
}
