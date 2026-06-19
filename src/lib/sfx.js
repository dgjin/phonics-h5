/* 答题音效：Web Audio 合成（无需音频文件）。答对 / 答错 / 过关三种提示音。
 * 总开关存 localStorage（phonics_sfx），默认开。 */
let ctx = null;
function getCtx() {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try { ctx = new AC(); } catch (e) { return null; }
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

export function sfxOn() {
  try { return localStorage.getItem('phonics_sfx') !== 'off'; } catch (e) { return true; }
}
export function setSfxOn(v) {
  try { localStorage.setItem('phonics_sfx', v ? 'on' : 'off'); } catch (e) {}
}

function beep(freq, t0, dur, gain = 0.18, type = 'sine') {
  const c = getCtx();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  o.connect(g); g.connect(c.destination);
  const now = c.currentTime + t0;
  g.gain.setValueAtTime(0.0001, now);
  g.gain.linearRampToValueAtTime(gain, now + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  o.start(now);
  o.stop(now + dur + 0.03);
}

export function sfxCorrect() { if (!sfxOn()) return; beep(660, 0, 0.12); beep(880, 0.10, 0.17); }            // 叮-咚（上行）
export function sfxWrong() { if (!sfxOn()) return; beep(233, 0, 0.18, 0.15, 'triangle'); beep(185, 0.09, 0.2, 0.13, 'triangle'); } // 低沉
export function sfxFinish() { if (!sfxOn()) return; [523, 659, 784, 1047].forEach((f, i) => beep(f, i * 0.09, 0.18, 0.16)); } // 过关琶音
