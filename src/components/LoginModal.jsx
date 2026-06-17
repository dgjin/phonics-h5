import { useState } from 'react';
import { useAuth } from '../lib/auth.jsx';

export default function LoginModal({ onClose }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('in');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [nick, setNick] = useState('');
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!email || !pw) { setMsg({ type: 'err', text: '请输入邮箱和密码' }); return; }
    setBusy(true); setMsg(null);
    try {
      if (mode === 'in') {
        await signIn(email.trim(), pw);
        onClose();
      } else {
        await signUp(email.trim(), pw, nick.trim());
        setMsg({ type: 'ok', text: '注册成功！如开启了邮箱验证请先查收邮件，然后登录。' });
        setBusy(false);
      }
    } catch (e) {
      setMsg({ type: 'err', text: (e && e.message) || '操作失败，请重试' });
      setBusy(false);
    }
  };

  return (
    <div className="overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="login-card">
        <div className="login-head">
          <div className="login-title">{mode === 'in' ? '登录账号' : '注册账号'}</div>
          <button className="login-x" onClick={onClose} aria-label="关闭"><i className="ti ti-x"></i></button>
        </div>
        <p className="login-sub">登录后学习进度会云端保存，换设备也能继续。</p>
        <input className="field" type="email" placeholder="邮箱" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
        <input className="field" type="password" placeholder="密码（至少 6 位）" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" />
        {mode === 'up' && (
          <input className="field" type="text" placeholder="昵称（可选）" value={nick} onChange={(e) => setNick(e.target.value)} />
        )}
        <button className="btn primary block" disabled={busy} onClick={submit}>
          {busy ? '请稍候…' : mode === 'in' ? '登录' : '注册'}
        </button>
        {msg && <div className={'login-msg ' + (msg.type === 'err' ? 'err' : 'ok')}>{msg.text}</div>}
        <button className="login-switch" onClick={() => { setMode(mode === 'in' ? 'up' : 'in'); setMsg(null); }}>
          {mode === 'in' ? '没有账号？去注册' : '已有账号？去登录'}
        </button>
      </div>
    </div>
  );
}
