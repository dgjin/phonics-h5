import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth.jsx';
import { useProgress } from '../lib/progress.jsx';
import { useIsMobile } from '../lib/useIsMobile';
import { getAccent, setAccent } from '../lib/tts';
import { TEXTBOOK } from '../data/textbook';
import { Header } from './common.jsx';
import LoginModal from './LoginModal.jsx';

/* 选图 → 居中裁剪缩放到 size×size → JPEG dataURL */
function resizeImage(file, size, cb) {
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext('2d');
      const scale = Math.max(size / img.width, size / img.height);
      const w = img.width * scale, h = img.height * scale;
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
      try { cb(canvas.toDataURL('image/jpeg', 0.82)); } catch (e) {}
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { configured, user, displayName, signOut } = useAuth();
  const { totalStars, completedUnits, streak, profile, setProfile, mistakeCount } = useProgress();
  const [showLogin, setShowLogin] = useState(false);
  const [accent, setAcc] = useState(getAccent());
  const [name, setName] = useState(profile.name || '');
  const fileRef = useRef(null);

  const loggedIn = !!user;
  const shownName = profile.name || displayName();
  const initial = (shownName || '?').slice(0, 1).toUpperCase();
  const t = totalStars();
  const chooseAccent = (a) => { setAcc(a); setAccent(a); };

  const onPickFile = (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!f) return;
    resizeImage(f, 128, (dataUrl) => setProfile({ avatar: dataUrl }));
  };
  const saveName = () => {
    const v = name.trim();
    if (v !== (profile.name || '')) setProfile({ name: v });
  };

  return (
    <div className="profile">
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {isMobile ? <div className="page-title">我的</div> : <Header title="我的" color="purple" backTo="/" />}

      <div className="profile-head">
        <button className="profile-avatar editable" onClick={() => fileRef.current && fileRef.current.click()} aria-label="更换头像">
          {profile.avatar ? <img src={profile.avatar} alt="头像" /> : <span>{loggedIn ? initial : '👤'}</span>}
          <span className="avatar-cam"><i className="ti ti-camera"></i></span>
        </button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPickFile} />
        <div className="profile-name">{shownName}</div>
        <div className="profile-tag">
          {loggedIn ? '已登录 · 云端同步' : configured ? '未登录 · 进度存本设备' : '本地学习模式'}
        </div>
        {loggedIn ? (
          <button className="btn ghost" onClick={() => signOut()}><i className="ti ti-logout"></i> 退出登录</button>
        ) : configured ? (
          <button className="btn primary" onClick={() => setShowLogin(true)}><i className="ti ti-login"></i> 登录 / 注册</button>
        ) : null}
      </div>

      <div className="profile-card">
        <div className="pcard-title"><i className="ti ti-user-edit"></i> 个人信息</div>
        <div className="pcard-sub">昵称将作为全站显示的称呼</div>
        <div className="name-row">
          <input
            className="field name-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={saveName}
            onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
            placeholder="给自己起个昵称"
            maxLength={16}
          />
          <button className="btn primary" onClick={saveName}>保存</button>
        </div>
        <button className="btn ghost block avatar-btn" onClick={() => fileRef.current && fileRef.current.click()}>
          <i className="ti ti-photo"></i> 上传图片做头像
        </button>
      </div>

      <div className="profile-stats">
        <div className="pstat"><div className="pstat-num">{t.got}</div><div className="pstat-lab">累计星星</div></div>
        <div className="pstat"><div className="pstat-num">{completedUnits()}</div><div className="pstat-lab">已学单元</div></div>
        <div className="pstat"><div className="pstat-num">{streak()}</div><div className="pstat-lab">连续天数</div></div>
      </div>

      <button
        className="entry-card c-green"
        onClick={() => navigate('/review', { state: { scope: 'tb:' + TEXTBOOK.units[0].id } })}
      >
        <div className="entry-icon"><i className="ti ti-book-2"></i></div>
        <div className="entry-main">
          <div className="entry-title">教材同步{TEXTBOOK.sample ? '（示例）' : ''}</div>
          <div className="entry-sub">{TEXTBOOK.name} · {TEXTBOOK.volume}</div>
        </div>
        <i className="ti ti-chevron-right entry-arrow"></i>
      </button>

      <button className="entry-card c-coral" onClick={() => navigate('/mistakes')}>
        <div className="entry-icon"><i className="ti ti-alert-triangle"></i></div>
        <div className="entry-main">
          <div className="entry-title">错题库</div>
          <div className="entry-sub">{mistakeCount ? `${mistakeCount} 个易错词 · 专项攻克` : '答错的词会自动收集到这里'}</div>
        </div>
        <i className="ti ti-chevron-right entry-arrow"></i>
      </button>

      <div className="profile-card">
        <div className="pcard-title"><i className="ti ti-volume"></i> 默认发音口音</div>
        <div className="pcard-sub">背单词页默认使用的真人发音口音</div>
        <div className="accent-toggle">
          <button className={accent === 'us' ? 'on' : ''} onClick={() => chooseAccent('us')}>美式</button>
          <button className={accent === 'uk' ? 'on' : ''} onClick={() => chooseAccent('uk')}>英式</button>
        </div>
      </div>

      <button className="entry-card c-teal" onClick={() => navigate('/help')}>
        <div className="entry-icon"><i className="ti ti-help-circle"></i></div>
        <div className="entry-main">
          <div className="entry-title">帮助</div>
          <div className="entry-sub">使用指南 · 常见问题</div>
        </div>
        <i className="ti ti-chevron-right entry-arrow"></i>
      </button>

      <p className="foot">Phonics Fun · 自然拼读 H5 · 内容改编自 KizPhonics 分级教材</p>
    </div>
  );
}
