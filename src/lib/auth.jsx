/* 认证 Context：Supabase 邮箱/密码登录；未配置密钥时为本地访客模式 */
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { CONFIG } from '../config.js';

const AuthContext = createContext(null);
const configured = !!(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY);

export function AuthProvider({ children }) {
  const clientRef = useRef(null);
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(!configured);

  if (configured && !clientRef.current) {
    clientRef.current = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
  }

  useEffect(() => {
    if (!configured) return;
    const client = clientRef.current;
    let sub;
    client.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user || null);
      setReady(true);
      const res = client.auth.onAuthStateChange((_e, session) => setUser(session?.user || null));
      sub = res.data.subscription;
    });
    return () => { if (sub) sub.unsubscribe(); };
  }, []);

  const value = useMemo(() => {
    const client = clientRef.current;
    const displayName = () => {
      if (!user) return '小朋友';
      const m = user.user_metadata || {};
      return m.nickname || (user.email ? user.email.split('@')[0] : '学习者');
    };
    return {
      configured,
      ready,
      user,
      userId: user ? user.id : 'guest',
      displayName,
      client,
      signUp: (email, password, nickname) =>
        client.auth.signUp({ email, password, options: { data: { nickname: nickname || '' } } })
          .then((r) => { if (r.error) throw r.error; return r.data; }),
      signIn: (email, password) =>
        client.auth.signInWithPassword({ email, password })
          .then((r) => { if (r.error) throw r.error; return r.data; }),
      signOut: () => (client ? client.auth.signOut() : Promise.resolve()),
    };
  }, [user, ready]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth 必须在 AuthProvider 内使用');
  return ctx;
}
