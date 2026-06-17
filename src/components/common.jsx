import { useNavigate } from 'react-router-dom';

export function Header({ title, sub, color, backTo }) {
  const navigate = useNavigate();
  return (
    <header className={'app-head c-' + (color || 'purple')}>
      <button className="head-back" onClick={() => (backTo ? navigate(backTo) : navigate(-1))} aria-label="返回">
        <i className="ti ti-arrow-left"></i>
      </button>
      <div className="head-titles">
        <div className="head-title">{title}</div>
        {sub && <div className="head-sub">{sub}</div>}
      </div>
      <span className="head-spacer"></span>
    </header>
  );
}

export function Button({ children, className = '', onClick, disabled, variant = 'primary' }) {
  const cls = ['btn', variant, className].filter(Boolean).join(' ');
  return (
    <button className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export function Stars({ count = 0 }) {
  return (
    <span className="unit-stars">
      {[0, 1, 2].map((i) => (
        <i key={i} className={'ti ti-star' + (i < count ? ' on' : '')}></i>
      ))}
    </span>
  );
}

export function ProgressDots({ idx, total }) {
  return (
    <div className="qbar">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={'dot' + (i < idx ? ' done' : i === idx ? ' cur' : '')}></span>
      ))}
    </div>
  );
}

export function Feedback({ ok }) {
  return (
    <div className={'feedback in ' + (ok ? 'ok' : 'no')}>
      {ok ? (
        <><i className="ti ti-circle-check"></i> 棒极了！</>
      ) : (
        <><i className="ti ti-info-circle"></i> 再试试</>
      )}
    </div>
  );
}

export function Confetti() {
  const colors = ['#7F77DD', '#1D9E75', '#D85A30', '#D4537E', '#639922', '#EF9F27'];
  return (
    <>
      {Array.from({ length: 24 }).map((_, i) => (
        <span
          key={i}
          className="confetti"
          style={{
            left: Math.random() * 100 + 'vw',
            background: colors[i % colors.length],
            animationDelay: Math.random() * 0.3 + 's',
            transform: 'rotate(' + Math.random() * 360 + 'deg)',
          }}
        ></span>
      ))}
    </>
  );
}
