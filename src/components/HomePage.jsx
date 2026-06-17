import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CURRICULUM } from '../data/curriculum';
import { useProgress } from '../lib/progress.jsx';
import { useAuth } from '../lib/auth.jsx';
import LoginModal from './LoginModal.jsx';

function UserBar({ onLogin }) {
  const { configured, user, displayName, signOut } = useAuth();
  const loggedIn = !!user;
  const name = displayName();
  const initial = (name || '?').slice(0, 1).toUpperCase();
  const tag = loggedIn ? '已登录 · 云端同步' : configured ? '未登录' : '本地学习';

  return (
    <div className="userbar">
      <div className="user-chip">
        <div className="user-avatar">{loggedIn ? initial : '👤'}</div>
        <div className="user-meta">
          <div className="user-name">{name}</div>
          <div className="user-tag">{tag}</div>
        </div>
      </div>
      {loggedIn ? (
        <button className="user-btn" onClick={() => signOut()}><i className="ti ti-logout"></i> 退出</button>
      ) : configured ? (
        <button className="user-btn solid" onClick={onLogin}><i className="ti ti-login"></i> 登录</button>
      ) : null}
    </div>
  );
}

function Dashboard() {
  const { totalStars, streak, completedUnits, recentDays, checkedToday } = useProgress();
  const t = totalStars();
  const pct = t.total ? Math.round((t.got / t.total) * 100) : 0;
  const days = recentDays(7);

  return (
    <div className="dash">
      <div className="dash-row">
        <div className="dash-stat">
          <div className="dash-num">{t.got}<span>/{t.total}</span></div>
          <div className="dash-lab"><i className="ti ti-star"></i> 累计星星</div>
        </div>
        <div className="dash-stat">
          <div className="dash-num">{streak()}<span> 天</span></div>
          <div className="dash-lab"><i className="ti ti-flame"></i> 连续打卡</div>
        </div>
        <div className="dash-stat">
          <div className="dash-num">{completedUnits()}<span> 关</span></div>
          <div className="dash-lab"><i className="ti ti-checkbox"></i> 已学单元</div>
        </div>
      </div>
      <div className="dash-bar"><div className="dash-fill" style={{ width: pct + '%' }}></div></div>
      <div className="dash-week">
        {days.map((d) => (
          <div key={d.date} className={'wday' + (d.on ? ' on' : '') + (d.isToday ? ' today' : '')}>
            <span className="wday-dot">{d.on ? <i className="ti ti-check"></i> : ''}</span>
            <span className="wday-num">{d.day}</span>
          </div>
        ))}
      </div>
      <div className="dash-tip">{checkedToday() ? '今天已打卡，继续保持！🎉' : '今天还没学习，做一关就打卡啦～'}</div>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { levelStars } = useProgress();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <UserBar onLogin={() => setShowLogin(true)} />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      <div className="hero">
        <div className="hero-emoji">🔤</div>
        <h1 className="hero-title">Phonics Fun</h1>
        <p className="hero-sub">自然拼读 · 听音 · 拼词 · 闯关学习</p>
      </div>
      <Dashboard />
      <div className="level-grid">
        {CURRICULUM.map((lv) => {
          const st = levelStars(lv);
          return (
            <button key={lv.id} className={'level-card c-' + lv.color} onClick={() => navigate('/level/' + lv.id)}>
              <div className="lv-icon"><i className={'ti ' + lv.icon}></i></div>
              <div className="lv-main">
                <div className="lv-title">{lv.title}</div>
                <div className="lv-cn">{lv.cn}</div>
              </div>
              <div className="lv-stars"><i className="ti ti-star"></i> {st.got}/{st.total}</div>
            </button>
          );
        })}
      </div>
      <p className="foot">内容改编自 KizPhonics 分级教材 · 发音由设备语音合成</p>
    </>
  );
}
