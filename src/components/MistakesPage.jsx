import { useNavigate } from 'react-router-dom';
import { useProgress } from '../lib/progress.jsx';
import { cnOf } from '../data/word-cn';
import { speakReal, getAccent } from '../lib/tts';
import { Header } from './common.jsx';

/* 错题库：自动收集的答错单词，可发音、删除、一键专项练习 */
export default function MistakesPage() {
  const navigate = useNavigate();
  const { mistakes, removeMistake } = useProgress();

  const practice = (mode) => navigate('/review', { state: { scope: 'mistakes', mode, auto: true } });

  return (
    <div className="c-coral">
      <Header title="错题库" sub={mistakes.length ? `共 ${mistakes.length} 个易错词` : '暂无错题'} color="coral" backTo="/me" />

      {mistakes.length === 0 ? (
        <div className="mk-empty">
          <div className="mk-empty-emoji">🎯</div>
          <div className="mk-empty-title">还没有错题</div>
          <div className="mk-empty-sub">做题或听写答错的单词会自动收集到这里，方便集中攻克。</div>
          <button className="btn primary" onClick={() => navigate('/')}>去学习</button>
        </div>
      ) : (
        <>
          <div className="mk-actions">
            <button className="btn primary" onClick={() => practice('flip')}><i className="ti ti-cards"></i> 翻卡练习</button>
            <button className="btn ghost" onClick={() => practice('dictation')}><i className="ti ti-keyboard"></i> 听写练习</button>
          </div>
          <div className="mk-list">
            {mistakes.map((m) => (
              <div key={m.w} className="mk-row">
                <span className="mk-emoji">{m.e || '🔤'}</span>
                <div className="mk-main">
                  <div className="mk-word">{m.w}</div>
                  <div className="mk-cn">{cnOf(m.w) || m.s || ''}</div>
                </div>
                <button className="mk-icon" onClick={() => speakReal(m.w, getAccent())} aria-label="发音"><i className="ti ti-volume"></i></button>
                <button className="mk-icon del" onClick={() => removeMistake(m.w)} aria-label="移除"><i className="ti ti-x"></i></button>
              </div>
            ))}
          </div>
          <p className="rv-note">答对（听写写对 / 翻卡点「认识」）后会自动移出错题库。</p>
        </>
      )}
    </div>
  );
}
