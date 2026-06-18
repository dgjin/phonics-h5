import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTextbook } from '../../data/textbook';
import { speak } from '../../lib/tts';
import { assetUrl } from '../../lib/assets';
import { Header } from '../common.jsx';
import { TB_ACTS } from './tbActivities.jsx';

/* 单词预览 chip：有图用图，图片失效（如第三方 404）自动回退到 emoji */
function PrevChip({ w }) {
  const [err, setErr] = useState(false);
  const showImg = w.img && !err;
  return (
    <button className="prev-chip" onClick={() => speak(w.w)}>
      {showImg
        ? <img src={assetUrl(w.img)} alt={w.w} className="prev-chip-img" loading="lazy" onError={() => setErr(true)} />
        : <span className="prev-emoji">{w.e || '🔤'}</span>}
      {w.w}
    </button>
  );
}

export default function TextbookUnit() {
  const navigate = useNavigate();
  const { bookId, unitId } = useParams();
  const book = getTextbook(bookId);
  const u = book.units.find((x) => x.id === unitId);
  if (!u) return (
    <div className="c-green">
      <Header title="单元" color="green" backTo={'/tb/' + bookId} />
      <p className="level-desc">未找到该单元</p>
    </div>
  );

  const launch = (type) => {
    if (type === 'dictation') {
      navigate('/review', { state: { scope: 'tb:' + bookId + ':' + unitId, mode: 'dictation', auto: true } });
    } else {
      navigate('/tb/' + bookId + '/' + unitId + '/' + type);
    }
  };

  return (
    <div className="c-green">
      <Header title={u.title} sub={book.volume} color="green" backTo={'/tb/' + bookId} />
      <div className="section-label">本单元单词（{u.words.length}）</div>
      <div className="unit-preview">
        {u.words.map((w) => <PrevChip key={w.w} w={w} />)}
      </div>
      <div className="section-label">选择练习</div>
      <div className="act-menu">
        {TB_ACTS.map((a) => (
          <button key={a.type} className="act-card" onClick={() => launch(a.type)}>
            <div className="act-icon"><i className={'ti ' + a.icon}></i></div>
            <div className="act-name">{a.name}</div>
            <div className="act-sub">{a.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
