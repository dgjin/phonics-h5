import { useProgress } from '../lib/progress.jsx';
import { Header } from './common.jsx';

/* 成就徽章墙：全部由学习进度自动派生 */
export default function AchievementsPage() {
  const { achievements, achievedCount, achievementTotal } = useProgress();

  return (
    <div className="c-amber">
      <Header title="成就" sub={`已获得 ${achievedCount} / ${achievementTotal} 枚`} color="amber" backTo="/me" />
      <div className="ach-grid">
        {achievements.map((a) => (
          <div key={a.id} className={'ach' + (a.got ? ' got' : '')}>
            <div className="ach-emoji">{a.emoji}</div>
            <div className="ach-name">{a.name}</div>
            <div className="ach-desc">{a.desc}</div>
            {a.got ? (
              <div className="ach-badge"><i className="ti ti-circle-check"></i> 已达成</div>
            ) : (
              <>
                <div className="ach-bar"><div className="ach-fill" style={{ width: a.pct + '%' }}></div></div>
                <div className="ach-prog">{Math.min(a.cur, a.target)} / {a.target}</div>
              </>
            )}
          </div>
        ))}
      </div>
      <p className="foot">继续学习就能解锁更多徽章 ~</p>
    </div>
  );
}
