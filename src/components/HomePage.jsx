import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CURRICULUM } from '../data/curriculum';
import { TEXTBOOKS } from '../data/textbook';
import { useProgress } from '../lib/progress.jsx';
import { useAuth } from '../lib/auth.jsx';
import { useIsMobile } from '../lib/useDevice';
import LoginModal from './LoginModal.jsx';


/* ===== 首页内嵌帮助区（折叠卡片） ===== */
const GUIDE = [
  { icon: 'ti-school', title: '闯关学习', desc: '6 个级别、32 个单元，5 种题型：学习卡、描红写字、听音选择、连线匹配、拼单词。每关最多得 3 颗星。' },
  { icon: 'ti-cards', title: '背单词', desc: '「翻卡复习」看中文意思与图片；「听写练习」听发音写出单词。可选美式/英式真人发音。' },
  { icon: 'ti-alert-triangle', title: '错题库', desc: '做题或听写答错的单词会自动收集，进入「我的 → 错题库」可专项练习，答对后自动移出。' },
  { icon: 'ti-flame', title: '每日打卡', desc: '每天学习任意一关就自动打卡，记录连续天数，养成学习习惯。' },
  { icon: 'ti-cloud', title: '账号与同步', desc: '登录后学习进度、错题、头像与昵称都会云端保存，换手机或电脑都能同步。' },
];
const FAQ = [
  { q: '没有声音怎么办？', a: '移动端浏览器需先轻触屏幕解锁声音。真人发音需联网，离线时自动改用设备语音。' },
  { q: '怎么切换美式/英式发音？', a: '在背单词页顶部切换，或到「我的 → 默认发音口音」全站设置。' },
  { q: '学习进度会丢失吗？', a: '登录后云端保存并跨设备同步；未登录存在当前设备，清理浏览器数据可能丢失。' },
];

function HomeHelp() {
  const [open, setOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);
  return (
    <div className="home-help">
      <button className={'home-help-hd' + (open ? ' open' : '')} onClick={() => setOpen(v => !v)}>
        <i className="ti ti-help-circle"></i>
        <span>使用帮助</span>
        <i className={'ti ti-chevron-' + (open ? 'up' : 'down') + ' home-help-chev'}></i>
      </button>
      {open && (
        <div className="home-help-body">
          <div className="home-help-sub">玩法介绍</div>
          <div className="home-help-guide">
            {GUIDE.map((g) => (
              <div key={g.title} className="home-guide-item">
                <i className={'ti ' + g.icon + ' home-guide-ic'}></i>
                <div>
                  <div className="home-guide-title">{g.title}</div>
                  <div className="home-guide-desc">{g.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="home-help-sub" style={{ marginTop: 14 }}>常见问题</div>
          {FAQ.map((f, i) => (
            <div key={i} className={'home-faq' + (faqOpen === i ? ' open' : '')} onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
              <div className="home-faq-q">
                <span>{f.q}</span>
                <i className={'ti ti-chevron-' + (faqOpen === i ? 'up' : 'down')}></i>
              </div>
              {faqOpen === i && <div className="home-faq-a">{f.a}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UserBar({ onLogin }) {
  const navigate = useNavigate();
  const { configured, user, displayName, signOut } = useAuth();
  const { profile } = useProgress();
  const loggedIn = !!user;
  const name = profile.name || displayName();
  const initial = (name || '?').slice(0, 1).toUpperCase();
  const tag = loggedIn ? '已登录 · 云端同步' : configured ? '未登录' : '本地学习';

  return (
    <div className="userbar">
      <button className="user-chip" onClick={() => navigate('/me')} title="查看个人信息">
        <div className="user-avatar">
          {profile.avatar ? <img src={profile.avatar} alt="头像" /> : (loggedIn ? initial : '👤')}
        </div>
        <div className="user-meta">
          <div className="user-name">{name}</div>
          <div className="user-tag">{tag}</div>
        </div>
        <i className="ti ti-chevron-right user-go"></i>
      </button>
      {loggedIn ? (
        <button className="user-btn" onClick={() => signOut()}><i className="ti ti-logout"></i> 退出</button>
      ) : configured ? (
        <button className="user-btn solid" onClick={onLogin}><i className="ti ti-login"></i> 登录</button>
      ) : null}
    </div>
  );
}

function Dashboard() {
  const { totalStars, streak, completedUnits, recentDays, checkedToday, todayLessons, dailyGoal } = useProgress();
  const t = totalStars();
  const pct = t.total ? Math.round((t.got / t.total) * 100) : 0;
  const days = recentDays(7);
  const goalMet = todayLessons >= dailyGoal;
  const goalPct = Math.min(100, Math.round((todayLessons / dailyGoal) * 100));

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
      <div className="dash-goal">
        <div className="dash-goal-top">
          <span><i className="ti ti-target"></i> 今日目标</span>
          <span>{Math.min(todayLessons, dailyGoal)}/{dailyGoal} 关</span>
        </div>
        <div className="dash-bar"><div className="dash-fill" style={{ width: goalPct + '%' }}></div></div>
      </div>
      <div className="dash-tip">
        {goalMet ? '今日目标已完成，太棒啦！🎉' : checkedToday() ? '今天已打卡，再做一关冲目标～' : '今天还没学习，做一关就打卡啦～'}
      </div>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { levelStars, srsDueCount } = useProgress();
  const [showLogin, setShowLogin] = useState(false);
  const isMobile = useIsMobile();

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
      {srsDueCount > 0 && (
        <button className="review-entry c-pink" onClick={() => navigate('/review', { state: { scope: 'srs', mode: 'flip', auto: true } })}>
          <div className="re-icon"><i className="ti ti-clock-bolt"></i></div>
          <div className="re-main">
            <div className="re-title">今日复习</div>
            <div className="re-cn">{srsDueCount} 个单词到复习时间 · 趁热打铁</div>
          </div>
          <i className="ti ti-chevron-right re-arrow"></i>
        </button>
      )}
      <button className="review-entry c-green" onClick={() => navigate('/tb')}>
        <div className="re-icon"><i className="ti ti-book-2"></i></div>
        <div className="re-main">
          <div className="re-title">教材同步</div>
          <div className="re-cn">外研版·新交际英语 · {TEXTBOOKS.length} 册 · 单元闯关</div>
        </div>
        <i className="ti ti-chevron-right re-arrow"></i>
      </button>
      <button className="review-entry c-teal" onClick={() => navigate('/story')}>
        <div className="re-icon"><i className="ti ti-book"></i></div>
        <div className="re-main">
          <div className="re-title">绘本故事</div>
          <div className="re-cn">分级阅读 · 整句朗读 · 读后小测</div>
        </div>
        <i className="ti ti-chevron-right re-arrow"></i>
      </button>
      <button className="review-entry c-coral" onClick={() => navigate('/dialog')}>
        <div className="re-icon"><i className="ti ti-messages"></i></div>
        <div className="re-main">
          <div className="re-title">句型对话</div>
          <div className="re-cn">情景对话 · 角色跟读 · 句子排序</div>
        </div>
        <i className="ti ti-chevron-right re-arrow"></i>
      </button>
      {!isMobile && (
        <button className="review-entry c-amber" onClick={() => navigate('/review')}>
          <div className="re-icon"><i className="ti ti-cards"></i></div>
          <div className="re-main">
            <div className="re-title">背单词</div>
            <div className="re-cn">真人发音 · 美式/英式 · 翻卡复习</div>
          </div>
          <i className="ti ti-chevron-right re-arrow"></i>
        </button>
      )}
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
      <HomeHelp />
      <p className="foot">内容改编自 KizPhonics 分级教材 · 真人发音（美式 / 英式）</p>
    </>
  );
}
