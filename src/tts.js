/* 发音封装：优先播放本地音频文件(Samantha 录制)，回退到浏览器 Web Speech */
window.TTS = (function () {
  var synth = window.speechSynthesis;
  var voice = null;
  var manifest = window.AUDIO_MANIFEST || { words: {}, letters: {} };
  var cur = null; // 当前 Audio 对象

  function pickVoice() {
    if (!synth) return;
    var voices = synth.getVoices();
    if (!voices.length) return;
    var prefer = voices.filter(function (v) { return /^en/i.test(v.lang); });
    voice = prefer.find(function (v) { return /female|samantha|karen|moira|google us/i.test(v.name); })
      || prefer.find(function (v) { return /en-US/i.test(v.lang); }) || prefer[0] || voices[0];
  }
  if (synth) { pickVoice(); if (synth.onvoiceschanged !== undefined) synth.onvoiceschanged = pickVoice; }

  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, ''); }

  function webspeak(text, opts) {
    if (!synth || !text) return;
    opts = opts || {};
    synth.cancel();
    var u = new SpeechSynthesisUtterance(String(text));
    if (voice) u.voice = voice;
    u.lang = (voice && voice.lang) || 'en-US';
    u.rate = opts.rate != null ? opts.rate : 0.85;
    u.pitch = opts.pitch != null ? opts.pitch : 1.05;
    synth.speak(u);
  }

  function stop() {
    if (cur) { try { cur.pause(); } catch (e) {} cur = null; }
    if (synth) synth.cancel();
  }

  // 播放一个音频文件；onend 在播完或失败时回调。返回 true 表示有文件可播。
  function playFile(src, fallbackText, onend) {
    var a = new Audio(src);
    cur = a;
    a.onended = function () { if (cur === a) cur = null; if (onend) onend(); };
    a.onerror = function () { if (cur === a) cur = null; if (fallbackText) webspeak(fallbackText); if (onend) onend(); };
    a.play().catch(function () { if (fallbackText) webspeak(fallbackText); if (onend) onend(); });
    return a;
  }

  // 通用：说一个词（或任意文本）
  function speak(text, opts) {
    stop();
    var s = slug(text);
    if (manifest.words[s]) { playFile('audio/w_' + s + '.m4a', text); }
    else webspeak(text, opts);
  }

  function speakLetter(letter, onend) {
    var k = String(letter).toLowerCase();
    if (manifest.letters[k]) playFile('audio/l_' + k + '.m4a', letter, onend);
    else { webspeak(letter); if (onend) setTimeout(onend, 600); }
  }

  // 学习卡：字母卡先读字母名再读单词；其它直接读单词
  function speakItem(item) {
    if (!item) return;
    stop();
    var l = item.l || '';
    var isLetterCard = l.length === 2 && l[0].toLowerCase() === l[1].toLowerCase();
    if (isLetterCard && item.w) {
      speakLetter(l[0], function () { setTimeout(function () { speak(item.w); }, 180); });
    } else if (item.w) {
      speak(item.w);
    } else {
      speak(l);
    }
  }

  return { speak: speak, speakItem: speakItem, speakLetter: speakLetter, stop: stop, available: !!synth || true };
})();
