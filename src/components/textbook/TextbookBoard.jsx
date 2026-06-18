import { useNavigate } from 'react-router-dom';
import { TEXTBOOK } from '../../data/textbook';
import { useProgress } from '../../lib/progress.jsx';
import { Header } from '../common.jsx';
import { TB_LEVEL } from './TextbookHome.jsx';

export default function TextbookBoard() {
  const navigate = useNavigate();
  const { getStars } = useProgress();

  // 总进度：所有单元的星数总和 / 最大可能星数（单元数 × 3）
  const unitStars = TEXTBOOK.units.map(u => ({ ...u, stars: getStars(TB_LEVEL, u.id) }));
  const maxStars = TEXTBOOK.units.length * 3;
  const gotStars = unitStars.reduce((s, u) => s + u.stars, 0);
  const pct = maxStars > 0 ? Math.round((gotStars / maxStars) * 100) : 0;

  // 计算锁定状态：从前往后找，最高星数为 0 的索引即为 lockedThreshold
  let lockedThreshold = -1;
  for (let i = 0; i < unitStars.length; i++) { if (unitStars[i].stars === 0) lockedThreshold = i; }

  return (
    <div className="tb-board c-green">
      <Header title={TEXTBOOK.name} sub={TEXTBOOK.volume + ' · 闯关地图'} color="green" backTo="/" />

      {/* 总体进度条 */}
      <div className="board-progress">
        <div className="board-pbar">
          <div className="board-fill" style={{ width: pct + '%' }}></div>
        </div>
        <div className="board-pinfo">{gotStars} / {maxStars} 星</div>
      </div>

      {/* 闯关格子地图 */}
      <div className="board-grid">
        {TEXTBOOK.units.map((u, i) => {
          const stars = unitStars[i].stars;
          const locked = i >= lockedThreshold;
          const done = stars >= 3;
          return (
            <button
              key={u.id}
              className={'board-tile' + (locked ? ' locked' : '') + (done ? ' done' : '') + (stars > 0 && stars < 3 ? ' partial' : '')}
              disabled={locked}
              onClick={() => { if (!locked) navigate('/tb/' + u.id); }}
            >
              {/* 格子编号 */}
              <div className="tile-num">{i + 1}</div>
              {/* 单元标题 */}
              <div className="tile-title">{u.title.match(/^(Unit \d+)/)?.[1] ?? '单元' + (i + 1)}</div>
              <div className="tile-sub">{u.title.replace(/^(Unit \d+ )/, '')}</div>

              {/* 星星 */}
              {!locked && (
                <div className="tile-stars">
                  {[0, 1, 2].map(s => (
                    <i key={s} className={'ti ti-star' + (s < stars ? ' on' : '')}></i>
                  ))}
                </div>
              )}

              {/* 锁定遮罩 */}
              {locked && <div className="tile-lock"><i className="ti ti-lock"></i></div>}

              {/* 完成标记 */}
              {done && !locked && (
                <div className="tile-check">
                  <i className="ti ti-circle-check-fill"></i>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 单元详情展开（可选，点击某个格子后） */}
      <button className="board-home" onClick={() => navigate('/tb/home')}>
        <i className="ti ti-list"></i> 列表视图
      </button>
    </div>
  );
}
