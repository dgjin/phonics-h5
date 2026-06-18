/* 语音识别（跟读评测）：基于浏览器 Web Speech API（Chrome/Edge/部分 Safari 支持）。
 * 录一次音 → 返回若干候选转写文本；调用方与目标词比对。 */

function SR() {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export function speechSupported() {
  return !!SR();
}

/* 录一次音，resolve 候选文本数组（已小写去标点）；失败 reject(Error.code) */
export function recognizeOnce({ lang = 'en-US', timeout = 7000 } = {}) {
  return new Promise((resolve, reject) => {
    const Ctor = SR();
    if (!Ctor) return reject(new Error('unsupported'));
    const r = new Ctor();
    r.lang = lang;
    r.interimResults = false;
    r.maxAlternatives = 5;
    r.continuous = false;
    let done = false;
    const finish = (fn, arg) => { if (done) return; done = true; try { r.stop(); } catch (e) {} fn(arg); };
    const timer = setTimeout(() => finish(reject, new Error('timeout')), timeout);

    r.onresult = (e) => {
      clearTimeout(timer);
      const res = e.results && e.results[0];
      const alts = [];
      if (res) for (let i = 0; i < res.length; i++) alts.push(normalize(res[i].transcript));
      finish(resolve, alts.filter(Boolean));
    };
    r.onerror = (e) => { clearTimeout(timer); finish(reject, new Error(e.error || 'error')); };
    r.onend = () => { clearTimeout(timer); finish(reject, new Error('no-speech')); };
    try { r.start(); } catch (err) { clearTimeout(timer); finish(reject, err); }
  });
}

export function normalize(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9 ]+/g, '').replace(/\s+/g, ' ').trim();
}

/* 判断候选里是否命中目标词（容忍标点/大小写） */
export function matchWord(target, alternatives) {
  const t = normalize(target);
  return (alternatives || []).some((a) => a === t || a.replace(/\s+/g, '') === t.replace(/\s+/g, ''));
}
