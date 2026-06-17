/* 发音：优先播放本地音频文件(Samantha 录制)，回退浏览器 Web Speech。
 * 移动端（iOS Safari 等）要求音频首次播放发生在用户手势内，否则被静默拦截。
 * 解决：复用同一个 Audio 元素，并在首次用户手势时解锁它（之后程序化播放即被允许）。 */
import '../audio-manifest.js'; // 设置 window.AUDIO_MANIFEST

const manifest = window.AUDIO_MANIFEST || { words: {}, letters: {} };
const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
let voice = null;
let audioEl = null;     // 复用的单个音频元素
let unlocked = false;

function getEl() {
  if (!audioEl) {
    audioEl = new Audio();
    audioEl.preload = 'auto';
    audioEl.playsInline = true;
    audioEl.setAttribute('playsinline', '');
  }
  return audioEl;
}

function pickVoice() {
  if (!synth) return;
  const voices = synth.getVoices();
  if (!voices.length) return;
  const prefer = voices.filter((v) => /^en/i.test(v.lang));
  voice =
    prefer.find((v) => /female|samantha|karen|moira|google us/i.test(v.name)) ||
    prefer.find((v) => /en-US/i.test(v.lang)) ||
    prefer[0] ||
    voices[0];
}
if (synth) {
  pickVoice();
  if (synth.onvoiceschanged !== undefined) synth.onvoiceschanged = pickVoice;
}

function slug(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

function webspeak(text, opts = {}) {
  if (!synth || !text) return;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(String(text));
  if (opts.lang) {
    const vs = synth.getVoices();
    const want = opts.lang.replace('_', '-').toLowerCase();
    const v = vs.find((x) => x.lang && x.lang.replace('_', '-').toLowerCase() === want);
    if (v) u.voice = v; else if (voice) u.voice = voice;
    u.lang = opts.lang;
  } else {
    if (voice) u.voice = voice;
    u.lang = (voice && voice.lang) || 'en-US';
  }
  u.rate = opts.rate != null ? opts.rate : 0.85;
  u.pitch = opts.pitch != null ? opts.pitch : 1.05;
  synth.speak(u);
}

export function stop() {
  if (audioEl) { try { audioEl.pause(); } catch (e) {} audioEl.onended = null; audioEl.onerror = null; }
  if (synth) synth.cancel();
}

function playFile(src, fallback, onend) {
  const a = getEl();
  try { a.pause(); } catch (e) {}
  const fb = () => { if (typeof fallback === 'function') fallback(); else if (fallback) webspeak(fallback); };
  a.onended = () => { a.onended = null; if (onend) onend(); };
  a.onerror = () => { a.onerror = null; fb(); if (onend) onend(); };
  try { a.src = src; a.currentTime = 0; } catch (e) {}
  const p = a.play();
  if (p && p.catch) p.catch(() => { fb(); if (onend) onend(); });
}

export function speak(text, opts) {
  stop();
  const s = slug(text);
  if (manifest.words[s]) playFile('audio/w_' + s + '.m4a', text);
  else webspeak(text, opts);
}

export function speakLetter(letter, onend) {
  stop();
  const k = String(letter).toLowerCase();
  if (manifest.letters[k]) playFile('audio/l_' + k + '.m4a', letter, onend);
  else { webspeak(letter); if (onend) setTimeout(onend, 600); }
}

export function speakItem(item) {
  if (!item) return;
  const l = item.l || '';
  const isLetterCard = l.length === 2 && l[0].toLowerCase() === l[1].toLowerCase();
  if (isLetterCard && item.w) {
    speakLetter(l[0], () => setTimeout(() => speak(item.w), 180));
  } else if (item.w) {
    speak(item.w);
  } else {
    speak(l);
  }
}

/* ---------- 真人发音：在线有道词典，支持美式 / 英式 ---------- */
const ACCENT_KEY = 'phonics_accent';
export function getAccent() {
  try { return localStorage.getItem(ACCENT_KEY) === 'uk' ? 'uk' : 'us'; } catch (e) { return 'us'; }
}
export function setAccent(a) {
  try { localStorage.setItem(ACCENT_KEY, a === 'uk' ? 'uk' : 'us'); } catch (e) {}
}
function youdaoUrl(word, accent) {
  const type = accent === 'uk' ? 1 : 2; // 1=英式  2=美式
  return 'https://dict.youdao.com/dictvoice?type=' + type + '&audio=' + encodeURIComponent(word);
}
/* 播放真人美/英发音；联网失败时回退到对应口音的浏览器语音 */
export function speakReal(word, accent, onend) {
  if (!word) { if (onend) onend(); return; }
  stop();
  const acc = accent === 'uk' ? 'uk' : 'us';
  const lang = acc === 'uk' ? 'en-GB' : 'en-US';
  playFile(youdaoUrl(word, acc), () => webspeak(word, { lang }), onend);
}

/* 在用户手势内调用：解锁音频与语音引擎 */
export function unlock() {
  if (unlocked) return;
  unlocked = true;
  try {
    const a = getEl();
    // 关键：必须在手势内“非静音”地播放真实音频才能解锁 iOS 的可发声播放。
    // 用一段真正的静音片段（不出声但完成一次播放），从而解锁后续程序化播放。
    a.muted = false;
    a.src = 'audio/_silence.wav';
    a.currentTime = 0;
    const p = a.play();
    if (p && p.then) p.then(() => { try { a.pause(); a.currentTime = 0; } catch (e) {} }).catch(() => {});
  } catch (e) {}
  try {
    if (synth) { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; synth.speak(u); }
  } catch (e) {}
}

// 首次用户手势自动解锁
if (typeof window !== 'undefined') {
  const fire = () => { unlock(); cleanup(); };
  const events = ['pointerdown', 'touchend', 'click', 'keydown'];
  const cleanup = () => events.forEach((ev) => window.removeEventListener(ev, fire));
  events.forEach((ev) => window.addEventListener(ev, fire, { passive: true }));
}

export const TTS = { speak, speakItem, speakLetter, speakReal, getAccent, setAccent, stop, unlock };
