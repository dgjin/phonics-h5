/* 发音：优先播放本地音频文件(Samantha 录制)，回退浏览器 Web Speech */
import '../audio-manifest.js'; // 设置 window.AUDIO_MANIFEST

const manifest = window.AUDIO_MANIFEST || { words: {}, letters: {} };
const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
let voice = null;
let cur = null;

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
  if (voice) u.voice = voice;
  u.lang = (voice && voice.lang) || 'en-US';
  u.rate = opts.rate != null ? opts.rate : 0.85;
  u.pitch = opts.pitch != null ? opts.pitch : 1.05;
  synth.speak(u);
}

export function stop() {
  if (cur) {
    try { cur.pause(); } catch (e) {}
    cur = null;
  }
  if (synth) synth.cancel();
}

function playFile(src, fallbackText, onend) {
  const a = new Audio(src);
  cur = a;
  a.onended = () => { if (cur === a) cur = null; if (onend) onend(); };
  a.onerror = () => { if (cur === a) cur = null; if (fallbackText) webspeak(fallbackText); if (onend) onend(); };
  a.play().catch(() => { if (fallbackText) webspeak(fallbackText); if (onend) onend(); });
  return a;
}

export function speak(text, opts) {
  stop();
  const s = slug(text);
  if (manifest.words[s]) playFile('audio/w_' + s + '.m4a', text);
  else webspeak(text, opts);
}

export function speakLetter(letter, onend) {
  const k = String(letter).toLowerCase();
  if (manifest.letters[k]) playFile('audio/l_' + k + '.m4a', letter, onend);
  else { webspeak(letter); if (onend) setTimeout(onend, 600); }
}

export function speakItem(item) {
  if (!item) return;
  stop();
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

export const TTS = { speak, speakItem, speakLetter, stop };
