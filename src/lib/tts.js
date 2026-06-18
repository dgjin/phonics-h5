/* 发音：统一优先「在线真人语音」（有道词典，支持美式 type=2 / 英式 type=1），
 * 失败时回退本地 Samantha 音频(audio/*.m4a)，再回退浏览器 Web Speech。
 * 移动端（iOS Safari 等）要求音频首次播放发生在用户手势内：复用同一个 Audio 元素，
 * 并在首次手势时解锁它（之后程序化播放即被允许）。 */
import '../audio-manifest.js'; // 设置 window.AUDIO_MANIFEST

const manifest = window.AUDIO_MANIFEST || { words: {}, letters: {} };
const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
let voice = null;
let audioEl = null; // 复用的单个音频元素
let unlocked = false;

/* ---------- 口音（全局，美式/英式） ---------- */
const ACCENT_KEY = 'phonics_accent';
export function getAccent() {
  try { return localStorage.getItem(ACCENT_KEY) === 'uk' ? 'uk' : 'us'; } catch (e) { return 'us'; }
}
export function setAccent(a) {
  try { localStorage.setItem(ACCENT_KEY, a === 'uk' ? 'uk' : 'us'); } catch (e) {}
}
function langOf(accent) { return accent === 'uk' ? 'en-GB' : 'en-US'; }
function youdaoUrl(word, accent) {
  const type = accent === 'uk' ? 1 : 2; // 1=英式  2=美式
  return 'https://dict.youdao.com/dictvoice?type=' + type + '&audio=' + encodeURIComponent(word);
}

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

/* 在线真人发音（显式指定口音；用于背单词页等） */
export function speakReal(word, accent, onend) {
  if (!word) { if (onend) onend(); return; }
  stop();
  const acc = accent === 'uk' ? 'uk' : accent === 'us' ? 'us' : getAccent();
  playFile(youdaoUrl(word, acc), () => webspeak(word, { lang: langOf(acc) }), onend);
}

/* 单词发音：在线真人(按全局口音) → 本地 m4a → 设备语音 */
export function speak(text, opts) {
  if (!text) return;
  stop();
  const acc = getAccent();
  const s = slug(text);
  const local = manifest.words[s] ? 'audio/w_' + s + '.m4a' : null;
  playFile(youdaoUrl(text, acc), () => {
    if (local) playFile(local, () => webspeak(text, { lang: langOf(acc) }));
    else webspeak(text, Object.assign({ lang: langOf(acc) }, opts));
  });
}

/* 字母发音：在线真人(按全局口音) → 本地 m4a → 设备语音 */
export function speakLetter(letter, onend) {
  if (!letter) { if (onend) onend(); return; }
  stop();
  const acc = getAccent();
  const k = String(letter).toLowerCase();
  const local = manifest.letters[k] ? 'audio/l_' + k + '.m4a' : null;
  const fb = () => {
    if (local) playFile(local, () => webspeak(letter, { lang: langOf(acc) }));
    else webspeak(letter, { lang: langOf(acc) });
  };
  playFile(youdaoUrl(letter, acc), fb, onend);
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

/* 在用户手势内调用：解锁音频与语音引擎 */
export function unlock() {
  if (unlocked) return;
  unlocked = true;
  try {
    const a = getEl();
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
