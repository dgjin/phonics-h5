import { useLocation, useNavigate } from 'react-router-dom';

const TABS = [
  { to: '/', icon: 'ti-home-2', label: '首页' },
  { to: '/review', icon: 'ti-cards', label: '背单词' },
  { to: '/me', icon: 'ti-user', label: '我的' },
];

/* iOS 风格底部标签栏（仅移动端、仅顶层页面显示） */
export default function TabBar() {
  const loc = useLocation();
  const navigate = useNavigate();
  const isActive = (to) => (to === '/' ? loc.pathname === '/' : loc.pathname.startsWith(to));

  return (
    <nav className="tabbar" role="tablist">
      <div className="tabbar-inner">
        {TABS.map((t) => (
          <button
            key={t.to}
            className={'tab' + (isActive(t.to) ? ' on' : '')}
            onClick={() => navigate(t.to)}
            role="tab"
            aria-selected={isActive(t.to)}
          >
            <i className={'ti ' + t.icon}></i>
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
