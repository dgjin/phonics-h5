import { useState } from 'react';
import { useAuth } from '../lib/auth.jsx';
import { useProgress } from '../lib/progress.jsx';
import { getAccent, setAccent } from '../lib/tts';
import LoginModal from './LoginModal.jsx';

/* 「我的」标签页：账号 + 进度概览 + 设置 */
export default function ProfilePage() {
  const { configured, user, displayName, signOut } = useAuth();
  const { totalStars, completedUnits, streak } = useProgress();
  const [showLogin, setShowLogin] = useState(false);
  const [accent, setAcc] = useState(getAccent());

  const loggedIn = !!user;
  const name = displayName();
  const initial = (name || '?').slice(0, 1).toUpperCase();
  const t = totalStars();
  const chooseAccent = (a) => { setAcc(a); setAccent(a); };

  return (
    <div className="profile">
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      <div className="page-title">我的</div>

      <div className="profile-head">
        <div className="profile-avatar">{loggedIn ? initial : '👤'}</div>
        <div className="profile-name">{name}</div>
        <div className="profile-tag">
          {loggedIn ? '已登录 · 云端同步' : configured ? '未登录 · 进度存本设备' : '本地学习模式'}
        </div>
        {loggedIn ? (
          <button className="btn ghost" onClick={() => signOut()}><i className="ti ti-logout"></i> 退出登录</button>
        ) : configured ? (
          <button className="btn primary" onClick={() => setShowLogin(true)}><i className="ti ti-login"></i> 登录 / 注册</button>
        ) : null}
      </div>

      <div className="profile-stats">
        <div className="pstat"><div className="pstat-num">{t.got}</div><div className="pstat-lab">累计星星</div></div>
        <div className="pstat"><div className="pstat-num">{completedUnits()}</div><div className="pstat-lab">已学单元</div></div>
        <div className="pstat"><div className="pstat-num">{streak()}</div><div className="pstat-lab">连续天数</div></div>
      </div>

      <div className="profile-card">
        <div className="pcard-title"><i className="ti ti-volume"></i> 默认发音口音</div>
        <div className="pcard-sub">背单词页默认使用的真人发音口音</div>
        <div className="accent-toggle">
          <button className={accent === 'us' ? 'on' : ''} onClick={() => chooseAccent('us')}>美式</button>
          <button className={accent === 'uk' ? 'on' : ''} onClick={() => chooseAccent('uk')}>英式</button>
        </div>
      </div>

      <p className="foot">Phonics Fun · 自然拼读 H5 · 内容改编自 KizPhonics 分级教材</p>
    </div>
  );
}
