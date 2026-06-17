const fs = require('fs');
const path = require('path');

const components = {
  'common.js': `import { useNavigate } from 'react-router-dom';

export function Header({ title, sub, color }) {
  const navigate = useNavigate();
  return (
    <header className={'app-head c-' + color}>
      <button className="head-back" onClick={() => navigate(-1)}>
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

export function Button({ children, className = '', onClick, disabled, variant = 'default' }) {
  const baseClass = 'btn';
  const variantClass = {
    primary: 'primary',
    ghost: 'ghost',
    block: 'block',
  }[variant] || '';
  return (
    <button className={baseClass + ' ' + variantClass + ' ' + className} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export function Stars({ count }) {
  return (
    <div className="stars">
      {Array(3).fill(0).map((_, i) => (
        <i key={i} className={'ti ti-star' + (i < count ? ' on' : '')}></i>
      ))}
    </div>
  );
}

export function Feedback({ show, ok }) {
  if (!show) return null;
  return (
    <div className={'feedback ' + (ok ? 'ok' : 'no') + ' in'}>
      {ok ? <><i className="ti ti-circle-check"></i> 棒极了！</> : <><i className="ti ti-info-circle"></i> 再试试</>}
    </div>
  );
}

export function Confetti() {
  const colors = ['#7F77DD', '#1D9E75', '#D85A30', '#D4537E', '#639922', '#EF9F27'];
  return (
    <>
      {Array(24).fill(0).map((_, i) => (
        <span key={i} className="confetti" style={{
          left: Math.random() * 100 + 'vw',
          background: colors[i % 6],
          animationDelay: Math.random() * 0.3 + 's',
          transform: 'rotate(' + Math.random() * 360 + 'deg)',
        }}></span>
      ))}
    </>
  );
}`,
  'HomePage.js': `import { useNavigate } from 'react-router-dom';
import { CURRICULUM } from '../data/curriculum';
import { Stars } from './common';
import { useProgress } from '../hooks/useProgress';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg"></div>
      <div className="hero-content">
        <h1 className="hero-title">自然拼读</h1>
        <p className="hero-sub">学习英语发音，爱上阅读</p>
      </div>
    </section>
  );
}

function Dashboard() {
  const { streak, totalStars, todayCompleted } = useProgress();
  return (
    <section className="dashboard">
      <div className="dash-card">
        <div className="dash-icon">🔥</div>
        <div className="dash-info">
          <div className="dash-value">{streak}</div>
          <div className="dash-label">连续打卡</div>
        </div>
      </div>
      <div className="dash-card">
        <div className="dash-icon">⭐</div>
        <div className="dash-info">
          <div className="dash-value">{totalStars}</div>
          <div className="dash-label">获得星星</div>
        </div>
      </div>
      <div className="dash-card">
        <div className="dash-icon">✅</div>
        <div className="dash-info">
          <div className="dash-value">{todayCompleted}</div>
          <div className="dash-label">今日完成</div>
        </div>
      </div>
    </section>
  );
}

function LevelGrid() {
  const navigate = useNavigate();
  const { getStars } = useProgress();
  
  return (
    <section className="level-grid">
      <h2 className="section-title">选择级别</h2>
      <div className="grid">
        {CURRICULUM.map((level) => {
          const stars = getStars(level.id, null);
          return (
            <button key={level.id} className="level-card" onClick={() => navigate('/level/' + level.id)}>
              <div className="level-icon" style={{ background: level.color }}>
                {level.icon}
              </div>
              <div className="level-info">
                <div className="level-title">{level.title}</div>
                <Stars count={stars} />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="page home">
      <Hero />
      <Dashboard />
      <LevelGrid />
    </div>
  );
}`,
  'LevelPage.js': `import { useParams, useNavigate } from 'react-router-dom';
import { Header, Stars } from './common';
import { findLevel } from '../data/curriculum';
import { useProgress } from '../hooks/useProgress';

function UnitList({ units, levelId, color }) {
  const navigate = useNavigate();
  const { getStars } = useProgress();
  
  return (
    <section className="unit-list">
      <h2 className="section-title">学习单元</h2>
      <div className="list">
        {units.map((unit) => {
          const stars = getStars(levelId, unit.id);
          return (
            <button key={unit.id} className="unit-card" onClick={() => navigate('/unit/' + levelId + '/' + unit.id)}>
              <div className="unit-icon" style={{ background: color }}>
                <i className="ti ti-book-open"></i>
              </div>
              <div className="unit-info">
                <div className="unit-title">{unit.title}</div>
                <div className="unit-desc">{unit.desc}</div>
              </div>
              <Stars count={stars} />
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default function LevelPage() {
  const { levelId } = useParams();
  const level = findLevel(levelId);
  
  if (!level) {
    return <div>Level not found</div>;
  }
  
  return (
    <div className="page level">
      <Header title={level.title} sub={level.desc} color={level.color} />
      <div className="level-hero" style={{ background: level.color }}>
        <div className="level-hero-content">
          <div className="level-hero-icon">{level.icon}</div>
          <h1 className="level-hero-title">{level.title}</h1>
          <p className="level-hero-desc">{level.desc}</p>
        </div>
      </div>
      <UnitList units={level.units} levelId={levelId} color={level.color} />
    </div>
  );
}`,
  'UnitPage.js': `import { useParams, useNavigate } from 'react-router-dom';
import { Header, Button, Stars } from './common';
import { findLevel, findUnit } from '../data/curriculum';
import { useProgress } from '../hooks/useProgress';

function ActCard({ act, levelId, unitId, color, onStart }) {
  const actTypes = {
    listen: '听音辨音',
    match: '单词匹配',
    spell: '拼写练习',
    read: '阅读练习',
    identify: '字母识别',
  };
  
  return (
    <button className="act-card" onClick={() => onStart(act)}>
      <div className="act-icon" style={{ background: color }}>
        <i className="ti ti-play"></i>
      </div>
      <div className="act-info">
        <div className="act-title">{actTypes[act.type] || act.type}</div>
        <div className="act-items">{act.items.length} 个单词</div>
      </div>
      <div className="act-arrow">
        <i className="ti ti-chevron-right"></i>
      </div>
    </button>
  );
}

export default function UnitPage() {
  const { levelId, unitId } = useParams();
  const navigate = useNavigate();
  const { getStars } = useProgress();
  const level = findLevel(levelId);
  const unit = findUnit(levelId, unitId);
  
  if (!level || !unit) {
    return <div>Not found</div>;
  }
  
  const stars = getStars(levelId, unitId);
  
  const handleStart = (act) => {
    navigate('/game/' + levelId + '/' + unitId + '/' + act.type);
  };
  
  return (
    <div className="page unit">
      <Header title={unit.title} sub={unit.desc} color={level.color} />
      <div className="unit-stats">
        <div className="unit-stars">
          <Stars count={stars} />
          <span className="unit-stars-label">完成度</span>
        </div>
      </div>
      <section className="act-list">
        <h2 className="section-title">练习项目</h2>
        <div className="list">
          {unit.acts.map((act, index) => (
            <ActCard key={index} act={act} levelId={levelId} unitId={unitId} color={level.color} onStart={handleStart} />
          ))}
        </div>
      </section>
      <Button variant="block" onClick={() => navigate('/level/' + levelId)}>
        返回级别
      </Button>
    </div>
  );
}`,
  'GamePage.js': `import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header, Feedback, Confetti } from './common';
import { findLevel, findUnit } from '../data/curriculum';
import { useProgress } from '../hooks/useProgress';
import { shuffle, sample } from '../data/utils';

function ListenGame({ items, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackOk, setFeedbackOk] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  
  const currentItem = items[currentIndex];
  
  useEffect(() => {
    const allWords = items.map((i) => i.w);
    const correctWord = currentItem.w;
    const others = sample(allWords.filter((w) => w !== correctWord), 3);
    setOptions(shuffle([correctWord, ...others]));
    setSelected(null);
  }, [currentIndex, items, currentItem]);
  
  const handleSelect = (word) => {
    if (selected !== null) return;
    setSelected(word);
    const ok = word === currentItem.w;
    setFeedbackOk(ok);
    setShowFeedback(true);
    
    if (ok) {
      setCorrectCount((prev) => prev + 1);
    }
    
    setTimeout(() => {
      setShowFeedback(false);
      if (currentIndex < items.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        onComplete(correctCount);
      }
    }, 1500);
  };
  
  return (
    <div className="game listen-game">
      <div className="game-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: ((currentIndex + 1) / items.length) * 100 + '%' }}></div>
        </div>
        <span className="progress-text">{currentIndex + 1}/{items.length}</span>
      </div>
      <div className="game-content">
        <div className="listen-word">{currentItem.w}</div>
        <p className="listen-hint">选择正确的发音</p>
      </div>
      <div className="options-grid">
        {options.map((word) => (
          <button
            key={word}
            className={'option-btn' + (selected === word ? (word === currentItem.w ? ' correct' : ' wrong') : '')}
            onClick={() => handleSelect(word)}
            disabled={selected !== null}
          >
            {word}
          </button>
        ))}
      </div>
      <Feedback show={showFeedback} ok={feedbackOk} />
    </div>
  );
}

function MatchGame({ items, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matched, setMatched] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  
  const currentItem = items[currentIndex];
  
  const handleMatch = (target) => {
    if (matched.length === 2) return;
    const newMatched = [...matched, target];
    setMatched(newMatched);
    
    if (newMatched.length === 2) {
      const [first, second] = newMatched;
      const ok = (first === currentItem.l && second === currentItem.w) || (first === currentItem.w && second === currentItem.l);
      setShowFeedback(true);
      
      if (ok) {
        setCorrectCount((prev) => prev + 1);
      }
      
      setTimeout(() => {
        setShowFeedback(false);
        setMatched([]);
        if (currentIndex < items.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          onComplete(correctCount);
        }
      }, 1500);
    }
  };
  
  return (
    <div className="game match-game">
      <div className="game-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: ((currentIndex + 1) / items.length) * 100 + '%' }}></div>
        </div>
        <span className="progress-text">{currentIndex + 1}/{items.length}</span>
      </div>
      <div className="game-content">
        <p className="match-hint">匹配字母和单词</p>
      </div>
      <div className="match-grid">
        <button className={'match-item' + (matched.includes(currentItem.l) ? ' matched' : '')} onClick={() => handleMatch(currentItem.l)} disabled={matched.length === 2}>{currentItem.l}</button>
        <button className={'match-item' + (matched.includes(currentItem.w) ? ' matched' : '')} onClick={() => handleMatch(currentItem.w)} disabled={matched.length === 2}>{currentItem.w}</button>
        <button className={'match-item' + (matched.includes('distractor1') ? ' matched' : '')} onClick={() => handleMatch('distractor1')} disabled={matched.length === 2}>Xxx</button>
        <button className={'match-item' + (matched.includes('distractor2') ? ' matched' : '')} onClick={() => handleMatch('distractor2')} disabled={matched.length === 2}>Yyy</button>
      </div>
      <Feedback show={showFeedback} ok={matched.length === 2 && ((matched[0] === currentItem.l && matched[1] === currentItem.w) || (matched[0] === currentItem.w && matched[1] === currentItem.l))} />
    </div>
  );
}

function SpellGame({ items, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackOk, setFeedbackOk] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  
  const currentItem = items[currentIndex];
  
  const handleSubmit = () => {
    const ok = input.toLowerCase() === currentItem.w.toLowerCase();
    setFeedbackOk(ok);
    setShowFeedback(true);
    
    if (ok) {
      setCorrectCount((prev) => prev + 1);
    }
    
    setTimeout(() => {
      setShowFeedback(false);
      setInput('');
      if (currentIndex < items.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        onComplete(correctCount);
      }
    }, 1500);
  };
  
  return (
    <div className="game spell-game">
      <div className="game-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: ((currentIndex + 1) / items.length) * 100 + '%' }}></div>
        </div>
        <span className="progress-text">{currentIndex + 1}/{items.length}</span>
      </div>
      <div className="game-content">
        <div className="spell-prompt">{currentItem.l}</div>
        <p className="spell-hint">输入对应的单词</p>
      </div>
      <div className="spell-input">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSubmit()} placeholder="输入单词..." autoFocus />
        <button className="btn primary" onClick={handleSubmit}>确认</button>
      </div>
      <Feedback show={showFeedback} ok={feedbackOk} />
    </div>
  );
}

function ReadGame({ items, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  
  const currentItem = items[currentIndex];
  
  const handleComplete = () => {
    setShowFeedback(true);
    setCorrectCount((prev) => prev + 1);
    
    setTimeout(() => {
      setShowFeedback(false);
      if (currentIndex < items.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        onComplete(correctCount);
      }
    }, 1500);
  };
  
  return (
    <div className="game read-game">
      <div className="game-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: ((currentIndex + 1) / items.length) * 100 + '%' }}></div>
        </div>
        <span className="progress-text">{currentIndex + 1}/{items.length}</span>
      </div>
      <div className="game-content">
        <div className="read-word">{currentItem.w}</div>
        <p className="read-hint">{currentItem.s}</p>
        <button className="btn primary" onClick={handleComplete}>我读完了</button>
      </div>
      <Feedback show={showFeedback} ok={true} />
    </div>
  );
}

function IdentifyGame({ items, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackOk, setFeedbackOk] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  
  const currentItem = items[currentIndex];
  
  useEffect(() => {
    const allLetters = items.map((i) => i.l);
    const correctLetter = currentItem.l;
    const others = sample(allLetters.filter((l) => l !== correctLetter), 3);
    setOptions(shuffle([correctLetter, ...others]));
    setSelected(null);
  }, [currentIndex, items, currentItem]);
  
  const handleSelect = (letter) => {
    if (selected !== null) return;
    setSelected(letter);
    const ok = letter === currentItem.l;
    setFeedbackOk(ok);
    setShowFeedback(true);
    
    if (ok) {
      setCorrectCount((prev) => prev + 1);
    }
    
    setTimeout(() => {
      setShowFeedback(false);
      if (currentIndex < items.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        onComplete(correctCount);
      }
    }, 1500);
  };
  
  return (
    <div className="game identify-game">
      <div className="game-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: ((currentIndex + 1) / items.length) * 100 + '%' }}></div>
        </div>
        <span className="progress-text">{currentIndex + 1}/{items.length}</span>
      </div>
      <div className="game-content">
        <div className="identify-word">{currentItem.w}</div>
        <p className="identify-hint">选择开头字母</p>
      </div>
      <div className="options-grid">
        {options.map((letter) => (
          <button key={letter} className={'option-btn' + (selected === letter ? (letter === currentItem.l ? ' correct' : ' wrong') : '')} onClick={() => handleSelect(letter)} disabled={selected !== null}>{letter}</button>
        ))}
      </div>
      <Feedback show={showFeedback} ok={feedbackOk} />
    </div>
  );
}

export default function GamePage() {
  const { levelId, unitId, gameType } = useParams();
  const navigate = useNavigate();
  const { setStars } = useProgress();
  const level = findLevel(levelId);
  const unit = findUnit(levelId, unitId);
  
  if (!level || !unit) {
    return <div>Not found</div>;
  }
  
  const act = unit.acts.find((a) => a.type === gameType);
  if (!act) {
    return <div>Game not found</div>;
  }
  
  const [showConfetti, setShowConfetti] = useState(false);
  
  const handleComplete = useCallback((correctCount) => {
    const total = act.items.length;
    const percentage = correctCount / total;
    const stars = percentage >= 0.9 ? 3 : percentage >= 0.6 ? 2 : 1;
    
    setStars(levelId, unitId, stars);
    
    if (stars >= 2) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    
    navigate('/result/' + levelId + '/' + unitId + '/' + stars);
  }, [act.items.length, levelId, unitId, setStars, navigate]);
  
  const renderGame = () => {
    switch (gameType) {
      case 'listen':
        return <ListenGame items={act.items} onComplete={handleComplete} />;
      case 'match':
        return <MatchGame items={act.items} onComplete={handleComplete} />;
      case 'spell':
        return <SpellGame items={act.items} onComplete={handleComplete} />;
      case 'read':
        return <ReadGame items={act.items} onComplete={handleComplete} />;
      case 'identify':
        return <IdentifyGame items={act.items} onComplete={handleComplete} />;
      default:
        return <div>Unknown game type</div>;
    }
  };
  
  return (
    <div className="page game-page">
      <Header title="游戏" sub={act.type} color={level.color} />
      {renderGame()}
      {showConfetti && <Confetti />}
    </div>
  );
}`,
  'ResultPage.js': `import { useParams, useNavigate } from 'react-router-dom';
import { Button, Stars, Confetti } from './common';
import { findLevel, findUnit } from '../data/curriculum';

export default function ResultPage() {
  const { levelId, unitId, stars } = useParams();
  const navigate = useNavigate();
  const level = findLevel(levelId);
  const unit = findUnit(levelId, unitId);
  
  if (!level || !unit) {
    return <div>Not found</div>;
  }
  
  const starCount = parseInt(stars) || 0;
  
  const messages = {
    3: '太棒了！完美通过！',
    2: '做得不错！继续加油！',
    1: '还要努力哦！',
  };
  
  return (
    <div className="page result">
      <div className="result-hero" style={{ background: level.color }}>
        <div className="result-icon">🎉</div>
        <h1 className="result-title">完成啦！</h1>
        <p className="result-message">{messages[starCount] || '完成练习'}</p>
      </div>
      <div className="result-content">
        <div className="result-stars">
          <Stars count={starCount} />
        </div>
        <div className="result-info">
          <div className="result-unit">{unit.title}</div>
          <div className="result-level">{level.title}</div>
        </div>
        <div className="result-buttons">
          <Button variant="primary" onClick={() => navigate('/game/' + levelId + '/' + unitId + '/listen')}>再玩一次</Button>
          <Button variant="ghost" onClick={() => navigate('/unit/' + levelId + '/' + unitId)}>返回单元</Button>
          <Button variant="ghost" onClick={() => navigate('/level/' + levelId)}>返回级别</Button>
        </div>
      </div>
      {starCount >= 2 && <Confetti />}
    </div>
  );
}`,
};

const componentsDir = path.join(__dirname, '../src/components');

if (!fs.existsSync(componentsDir)) {
  fs.mkdirSync(componentsDir, { recursive: true });
}

Object.entries(components).forEach(([filename, content]) => {
  const filePath = path.join(componentsDir, filename);
  fs.writeFileSync(filePath, content);
  console.log('Created:', filePath);
});
