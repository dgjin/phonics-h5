import { useParams, useNavigate } from 'react-router-dom';
import { Header } from './common.jsx';
import { findLevel, findUnit, ACTIVITY_ICONS } from '../data/curriculum';
import { speakItem } from '../lib/tts';

const ACT_LABELS = {
  flashcard: '学习卡', trace: '描红写字', listen: '听音选择', match: '连线匹配', spell: '拼单词',
};

export default function UnitPage() {
  const { levelId, unitId } = useParams();
  const navigate = useNavigate();
  const level = findLevel(levelId);
  const unit = findUnit(levelId, unitId);

  if (!level || !unit) return <div className="page-msg">未找到该单元</div>;

  return (
    <>
      <Header title={unit.title} sub={unit.cn} color={level.color} backTo={'/level/' + levelId} />

      <p className="section-label">本单元单词（点击发音）</p>
      <div className="unit-preview">
        {unit.items.slice(0, 8).map((it, i) => (
          <button key={i} className="prev-chip" onClick={() => speakItem(it)}>
            <span className="prev-emoji">{it.e}</span>
            <span className="prev-word">{it.w}</span>
          </button>
        ))}
      </div>

      <p className="section-label">选择练习</p>
      <div className="act-menu">
        {unit.acts.map((act) => (
          <button
            key={act}
            className={'act-card c-' + level.color}
            onClick={() => navigate('/game/' + levelId + '/' + unitId + '/' + act)}
          >
            <div className="act-icon"><i className={'ti ' + (ACTIVITY_ICONS[act] || 'ti-player-play')}></i></div>
            <div className="act-name">{ACT_LABELS[act] || act}</div>
          </button>
        ))}
      </div>
    </>
  );
}
