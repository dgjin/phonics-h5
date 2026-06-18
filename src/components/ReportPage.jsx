import { useNavigate } from 'react-router-dom';
import { useProgress } from '../lib/progress.jsx';
import { cnOf } from '../data/word-cn';
import { Header } from './common.jsx';

/* 家长周报：近 7 天学习概况，全部由学习记录派生 */
export default function ReportPage() {
  const navigate = useNavigate();
  const {
    weekReport, totalStars, completedUnits, streak,
    srsTotal, srsMastered, mistakes, achievedCount, achievementTotal,
  } = useProgress();

  const wr = weekReport();
  const t = totalStars();
  const maxLessons = Math.max(1, ...wr.days.map((d) => d.lessons));
  const top = mistakes.slice().sort((a, b) => (b.count || 0) - (a.count || 0)).slice(0, 5);

  const tips = [];
  if (wr.activeDays >= 5) tips.push('本周坚持得很好，继续保持每天学习的好习惯。');
  else if (wr.activeDays >= 1) tips.push(`本周学习了 ${wr.activeDays} 天，建议每天固定时间学一会儿，更易养成习惯。`);
  else tips.push('本周还没怎么学习，陪孩子从「今日复习」或一关小游戏开始吧。');
  if (top.length) tips.push(`目前有 ${mistakes.length} 个易错词，建议做一次「错题专项」巩固。`);
  if (srsTotal) tips.push(`已学 ${srsTotal} 个单词，其中 ${srsMastered} 个已较熟练，可多用「听写 / 跟读」加深。`);

  return (
    <div className="c-pink">
      <Header title="家长周报" sub="近 7 天学习概况" color="pink" backTo="/me" />

      <div className="rep-row">
        <div className="rep-stat"><div className="rep-num">{wr.activeDays}</div><div className="rep-lab">学习天数</div></div>
        <div className="rep-stat"><div className="rep-num">{wr.lessons}</div><div className="rep-lab">完成关数</div></div>
        <div className="rep-stat"><div className="rep-num">{streak()}</div><div className="rep-lab">连续天数</div></div>
      </div>

      <div className="rep-card">
        <div className="rep-title"><i className="ti ti-chart-bar"></i> 每日学习</div>
        <div className="rep-bars">
          {wr.days.map((d) => (
            <div key={d.date} className="rep-bar-col">
              <div className="rep-bar-track">
                <div className="rep-bar-fill" style={{ height: Math.round((d.lessons / maxLessons) * 100) + '%' }}></div>
              </div>
              <div className="rep-bar-num">{d.lessons || ''}</div>
              <div className={'rep-bar-day' + (d.isToday ? ' today' : '')}>{d.day}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rep-card">
        <div className="rep-title"><i className="ti ti-school"></i> 学习成果</div>
        <div className="rep-facts">
          <div><b>{t.got}</b> 累计星星</div>
          <div><b>{completedUnits()}</b> 已学单元</div>
          <div><b>{srsTotal}</b> 已学单词</div>
          <div><b>{srsMastered}</b> 已较熟练</div>
          <div><b>{achievedCount}/{achievementTotal}</b> 成就徽章</div>
        </div>
      </div>

      <div className="rep-card">
        <div className="rep-title"><i className="ti ti-alert-triangle"></i> 易错词{top.length ? ` TOP${top.length}` : ''}</div>
        {top.length ? (
          <>
            <div className="rep-mk">
              {top.map((m) => (
                <span key={m.w} className="rep-mk-chip">{m.e || '🔤'} {m.w} <i>{cnOf(m.w)}</i> ×{m.count || 1}</span>
              ))}
            </div>
            <button className="btn primary block" onClick={() => navigate('/mistakes')}>去练错题</button>
          </>
        ) : <div className="rep-empty">暂无易错词，很棒！</div>}
      </div>

      <div className="rep-card">
        <div className="rep-title"><i className="ti ti-bulb"></i> 给家长的建议</div>
        <ul className="rep-tips">{tips.map((x, i) => <li key={i}>{x}</li>)}</ul>
      </div>

      <p className="foot">数据来自孩子在本账号 / 设备的学习记录</p>
    </div>
  );
}
