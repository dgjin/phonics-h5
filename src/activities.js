/* 四种题型引擎。Activities.run(type, unit, mount, onFinish(stars)) */
window.Activities = (function () {
  var el = U.el, shuffle = U.shuffle, sample = U.sample, clear = U.clear;

  var LABELS = {
    flashcard: '学习卡', listen: '听音选择', match: '连线匹配', spell: '拼单词', trace: '描红写字'
  };

  function starsFor(correct, total) {
    if (total === 0) return 3;
    var r = correct / total;
    if (r >= 0.9) return 3;
    if (r >= 0.6) return 2;
    return 1;
  }

  function tilesOf(item) {
    return item.p && item.p.length ? item.p.slice() : item.w.split('');
  }

  // ---- 主流程 ----
  function run(type, unit, mount, onFinish) {
    var items = unit.items;
    var stage = el('div.stage');
    var bar = el('div.qbar');
    clear(mount);
    mount.appendChild(bar);
    mount.appendChild(stage);

    if (type === 'flashcard') return runFlashcard(items, stage, bar, onFinish);
    if (type === 'listen') return runQuiz('listen', items, stage, bar, onFinish);
    if (type === 'match') return runMatch(items, stage, bar, onFinish);
    if (type === 'spell') return runSpell(items, stage, bar, onFinish);
    if (type === 'trace') return runTrace(items, stage, bar, onFinish);
  }

  function progressBar(bar, idx, total) {
    clear(bar);
    for (var i = 0; i < total; i++) {
      bar.appendChild(el('span.dot' + (i < idx ? '.done' : i === idx ? '.cur' : ''), {}));
    }
  }

  // ====== 学习卡 ======
  function runFlashcard(items, stage, bar, onFinish) {
    var idx = 0;
    function show() {
      progressBar(bar, idx, items.length);
      clear(stage);
      var it = items[idx];
      var card = el('div.flash', { onclick: function () { TTS.speakItem(it); } }, [
        el('div.flash-letter', { text: it.l }),
        el('div.flash-sound', { text: it.s }),
        el('div.flash-emoji', { text: it.e }),
        el('div.flash-word', { html: highlight(it) }),
        el('div.tap-hint', { html: '<i class="ti ti-volume"></i> 点卡片听发音' }),
      ]);
      stage.appendChild(card);
      var nav = el('div.nav-row', {}, [
        el('button.btn.ghost', { onclick: function () { if (idx > 0) { idx--; show(); } }, html: '<i class="ti ti-arrow-left"></i>' }),
        el('button.btn.primary', { onclick: next, html: idx === items.length - 1 ? '完成 <i class="ti ti-check"></i>' : '下一个 <i class="ti ti-arrow-right"></i>' }),
      ]);
      stage.appendChild(nav);
      setTimeout(function () { TTS.speakItem(it); }, 250);
    }
    function next() {
      if (idx < items.length - 1) { idx++; show(); }
      else onFinish(3); // 学习卡：完成即满星
    }
    show();
  }

  function highlight(it) {
    var w = it.w, f = it.l;
    if (f && f.indexOf('_') < 0 && f.length <= 3 && w.indexOf(f) >= 0) {
      return w.replace(f, '<b>' + f + '</b>');
    }
    return w;
  }

  // ====== 听音选择 ======
  function runQuiz(mode, items, stage, bar, onFinish) {
    var qs = shuffle(items).slice(0, Math.min(6, items.length));
    var idx = 0, correct = 0, locked = false;

    function show() {
      progressBar(bar, idx, qs.length);
      clear(stage);
      locked = false;
      var ans = qs[idx];
      var distractors = sample(items, Math.min(2, items.length - 1), [ans]);
      var opts = shuffle([ans].concat(distractors));

      stage.appendChild(el('div.q-title', { html: '<i class="ti ti-ear"></i> 听一听，选出正确的词' }));
      stage.appendChild(el('button.replay', { onclick: function () { TTS.speak(ans.w); }, html: '<i class="ti ti-volume"></i> 再听一次' }));

      var grid = el('div.opt-grid');
      opts.forEach(function (o) {
        var btn = el('button.opt', { onclick: function () { choose(btn, o, ans); } }, [
          el('div.opt-emoji', { text: o.e }),
          el('div.opt-word', { text: o.w }),
        ]);
        grid.appendChild(btn);
      });
      stage.appendChild(grid);
      setTimeout(function () { TTS.speak(ans.w); }, 300);
    }

    function choose(btn, o, ans) {
      if (locked) return;
      locked = true;
      if (o === ans) {
        btn.classList.add('right'); correct++;
        feedback(true);
      } else {
        btn.classList.add('wrong');
        // 高亮正确项
        Array.prototype.forEach.call(stage.querySelectorAll('.opt'), function (b) {
          if (b.querySelector('.opt-word').textContent === ans.w) b.classList.add('right');
        });
        feedback(false);
      }
      setTimeout(nextQ, 1100);
    }
    function nextQ() {
      if (idx < qs.length - 1) { idx++; show(); }
      else onFinish(starsFor(correct, qs.length));
    }
    show();
  }

  // ====== 连线匹配 ======
  function runMatch(items, stage, bar, onFinish) {
    var pool = shuffle(items).slice(0, Math.min(5, items.length));
    var total = pool.length, matched = 0, mistakes = 0;
    var selWord = null, selEmoji = null;
    progressBar(bar, 0, total);

    stage.appendChild(el('div.q-title', { html: '<i class="ti ti-link"></i> 把单词和图片连起来' }));
    var cols = el('div.match-cols');
    var leftCol = el('div.match-col');
    var rightCol = el('div.match-col');
    cols.appendChild(leftCol); cols.appendChild(rightCol);
    stage.appendChild(cols);

    shuffle(pool).forEach(function (it) {
      leftCol.appendChild(el('button.mtile.word', { 'data-w': it.w, onclick: function () { pickWord(this, it); } }, [
        el('span', { onclick: function (e) { e.stopPropagation(); TTS.speak(it.w); }, html: '<i class="ti ti-volume"></i>' }),
        el('span.mtile-label', { text: it.w }),
      ]));
    });
    shuffle(pool).forEach(function (it) {
      rightCol.appendChild(el('button.mtile.pic', { 'data-w': it.w, onclick: function () { pickEmoji(this, it); } }, [
        el('span.mtile-emoji', { text: it.e }),
      ]));
    });

    function clearSel() {
      if (selWord) selWord.el.classList.remove('sel');
      if (selEmoji) selEmoji.el.classList.remove('sel');
      selWord = null; selEmoji = null;
    }
    function pickWord(node, it) {
      if (node.classList.contains('done')) return;
      if (selWord) selWord.el.classList.remove('sel');
      selWord = { el: node, it: it }; node.classList.add('sel');
      tryMatch();
    }
    function pickEmoji(node, it) {
      if (node.classList.contains('done')) return;
      if (selEmoji) selEmoji.el.classList.remove('sel');
      selEmoji = { el: node, it: it }; node.classList.add('sel');
      tryMatch();
    }
    function tryMatch() {
      if (!selWord || !selEmoji) return;
      if (selWord.it === selEmoji.it) {
        selWord.el.classList.add('done'); selEmoji.el.classList.add('done');
        selWord.el.classList.remove('sel'); selEmoji.el.classList.remove('sel');
        TTS.speak(selWord.it.w);
        selWord = null; selEmoji = null;
        matched++; progressBar(bar, matched, total);
        if (matched === total) { feedback(true); setTimeout(function () { onFinish(starsFor(total - Math.min(mistakes, total), total)); }, 900); }
      } else {
        mistakes++;
        var w = selWord.el, p = selEmoji.el;
        w.classList.add('shake'); p.classList.add('shake');
        setTimeout(function () { w.classList.remove('shake', 'sel'); p.classList.remove('shake', 'sel'); clearSel(); }, 500);
      }
    }
  }

  // ====== 拼单词 ======
  function runSpell(items, stage, bar, onFinish) {
    var qs = shuffle(items).slice(0, Math.min(6, items.length));
    var idx = 0, correct = 0;

    function show() {
      progressBar(bar, idx, qs.length);
      clear(stage);
      var it = qs[idx];
      var answer = tilesOf(it);
      var placed = [];

      stage.appendChild(el('div.q-title', { html: '<i class="ti ti-pencil"></i> 拼出这个单词' }));
      var head = el('div.spell-head', { onclick: function () { TTS.speak(it.w); } }, [
        el('div.spell-emoji', { text: it.e }),
        el('button.replay.small', { html: '<i class="ti ti-volume"></i> 听发音' }),
      ]);
      stage.appendChild(head);

      var slots = el('div.slots');
      answer.forEach(function () { slots.appendChild(el('span.slot', {})); });
      stage.appendChild(slots);

      var tray = el('div.tray');
      stage.appendChild(tray);

      var trayBtns = [];
      shuffle(answer.map(function (t, i) { return { t: t, i: i }; })).forEach(function (o) {
        var b = el('button.tile', { text: o.t, onclick: function () { place(o, b); } });
        trayBtns.push(b); tray.appendChild(b);
      });

      function renderSlots() {
        Array.prototype.forEach.call(slots.children, function (s, i) {
          if (placed[i]) {
            s.textContent = placed[i].o.t; s.classList.add('filled');
            s.onclick = function () { unplace(i); };
          } else { s.textContent = ''; s.classList.remove('filled'); s.onclick = null; }
        });
      }
      function place(o, btn) {
        if (btn.classList.contains('used')) return;
        var slot = placed.length;
        if (slot >= answer.length) return;
        placed.push({ o: o, btn: btn });
        btn.classList.add('used');
        renderSlots();
        if (placed.length === answer.length) check();
      }
      function unplace(i) {
        if (i >= placed.length) i = placed.length - 1; // 只允许从末尾移除，保持顺序
        var last = placed.pop();
        if (last) last.btn.classList.remove('used');
        renderSlots();
      }
      function check() {
        var guess = placed.map(function (p) { return p.o.t; }).join('');
        if (guess === answer.join('')) {
          correct++;
          slots.classList.add('right'); TTS.speak(it.w); feedback(true);
          setTimeout(nextQ, 1100);
        } else {
          slots.classList.add('shake');
          setTimeout(function () {
            slots.classList.remove('shake');
            placed.forEach(function (p) { p.btn.classList.remove('used'); });
            placed = []; renderSlots();
          }, 600);
        }
      }
      renderSlots();
    }
    function nextQ() {
      stage.querySelector('.slots').classList.remove('right');
      if (idx < qs.length - 1) { idx++; show(); }
      else onFinish(starsFor(correct, qs.length));
    }
    show();
  }

  // ====== 描红写字 ======
  function runTrace(items, stage, bar, onFinish) {
    var idx = 0;
    function show() {
      progressBar(bar, idx, items.length);
      clear(stage);
      var it = items[idx];
      var done = false;

      stage.appendChild(el('div.q-title', { html: '<i class="ti ti-pencil"></i> 用手指描出字母' }));

      var box = el('div.trace-box');
      box.appendChild(el('div.trace-guide', { text: it.l }));
      var canvas = el('canvas.trace-canvas');
      box.appendChild(canvas);
      stage.appendChild(box);

      var nextBtn = el('button.btn.primary', {
        disabled: 'disabled',
        onclick: function () { if (!done) return; if (idx < items.length - 1) { idx++; show(); } else onFinish(3); },
        html: idx === items.length - 1 ? '完成 <i class="ti ti-check"></i>' : '下一个 <i class="ti ti-arrow-right"></i>'
      });
      var ctrls = el('div.trace-ctrls', {}, [
        el('button.btn.ghost', { onclick: function () { TTS.speakLetter((it.l[0] || it.l)); }, html: '<i class="ti ti-volume"></i> 发音' }),
        el('button.btn.ghost', { onclick: clearCanvas, html: '<i class="ti ti-eraser"></i> 重写' }),
        nextBtn,
      ]);
      stage.appendChild(ctrls);

      var ctx, drawn = 0, threshold = 1100, last = null, ratio = 1;
      function setup() {
        var w = box.clientWidth, h = box.clientHeight;
        ratio = window.devicePixelRatio || 1;
        canvas.width = w * ratio; canvas.height = h * ratio;
        ctx = canvas.getContext('2d');
        ctx.scale(ratio, ratio);
        ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.strokeStyle = getComputedStyle(box).getPropertyValue('--accent') || '#7F77DD';
      }
      function pos(e) {
        var r = canvas.getBoundingClientRect();
        var p = e.touches ? e.touches[0] : e;
        return { x: p.clientX - r.left, y: p.clientY - r.top };
      }
      function start(e) { e.preventDefault(); last = pos(e); }
      function move(e) {
        if (!last) return; e.preventDefault();
        var p = pos(e);
        ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke();
        drawn += Math.hypot(p.x - last.x, p.y - last.y); last = p;
        if (!done && drawn > threshold) { done = true; nextBtn.removeAttribute('disabled'); box.classList.add('trace-done'); feedback(true); }
      }
      function end() { last = null; }
      function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawn = 0; done = false; nextBtn.setAttribute('disabled', 'disabled'); box.classList.remove('trace-done');
      }

      canvas.addEventListener('pointerdown', start);
      canvas.addEventListener('pointermove', move);
      window.addEventListener('pointerup', end);
      requestAnimationFrame(function () { setup(); });
      setTimeout(function () { TTS.speakLetter(it.l[0] || it.l); }, 250);
    }
    show();
  }

  // 通用即时反馈浮层
  function feedback(ok) {
    var f = el('div.feedback' + (ok ? '.ok' : '.no'), {
      html: ok ? '<i class="ti ti-circle-check"></i> 棒极了！' : '<i class="ti ti-info-circle"></i> 再试试'
    });
    document.body.appendChild(f);
    requestAnimationFrame(function () { f.classList.add('in'); });
    setTimeout(function () { f.classList.remove('in'); setTimeout(function () { f.remove(); }, 300); }, 800);
  }

  return { run: run, LABELS: LABELS };
})();
