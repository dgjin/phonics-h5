/* 界面渲染 + hash 路由 */
window.Screens = (function () {
  var el = U.el, clear = U.clear;
  var app;

  function find(levelId, unitId) {
    var level = CURRICULUM.find(function (l) { return l.id === levelId; });
    var unit = level && unitId ? level.units.find(function (u) { return u.id === unitId; }) : null;
    return { level: level, unit: unit };
  }

  function header(title, sub, backHash, color) {
    return el('header.app-head' + (color ? '.c-' + color : ''), {}, [
      backHash != null ? el('button.head-back', { onclick: function () { location.hash = backHash; }, html: '<i class="ti ti-arrow-left"></i>' }) : el('span.head-spacer'),
      el('div.head-titles', {}, [
        el('div.head-title', { text: title }),
        sub ? el('div.head-sub', { text: sub }) : null,
      ]),
      el('span.head-spacer'),
    ]);
  }

  // ===== 顶部用户条 =====
  function userBar() {
    var name = Auth.displayName();
    var loggedIn = !!Auth.currentUser();
    var initial = (name || '?').slice(0, 1).toUpperCase();
    return el('div.userbar', {}, [
      el('div.user-chip', {}, [
        el('div.user-avatar', { text: loggedIn ? initial : '👤' }),
        el('div.user-meta', {}, [
          el('div.user-name', { text: name }),
          el('div.user-tag', { text: loggedIn ? '已登录 · 云端同步' : (Auth.isConfigured() ? '未登录' : '本地模式') }),
        ]),
      ]),
      loggedIn
        ? el('button.user-btn', { onclick: function () { Auth.signOut(); }, html: '<i class="ti ti-logout"></i> 退出' })
        : (Auth.isConfigured()
          ? el('button.user-btn.solid', { onclick: function () { loginOverlay(); }, html: '<i class="ti ti-login"></i> 登录' })
          : null),
    ]);
  }

  // ===== 总进度看板 =====
  function dashboard() {
    var t = Progress.totalStars();
    var pct = t.total ? Math.round(t.got / t.total * 100) : 0;
    var streak = Progress.streak();
    var days = Progress.recentDays(7);
    var card = el('div.dash', {}, [
      el('div.dash-row', {}, [
        el('div.dash-stat', {}, [
          el('div.dash-num', { html: t.got + '<span>/' + t.total + '</span>' }),
          el('div.dash-lab', { html: '<i class="ti ti-star"></i> 累计星星' }),
        ]),
        el('div.dash-stat', {}, [
          el('div.dash-num', { html: streak + '<span> 天</span>' }),
          el('div.dash-lab', { html: '<i class="ti ti-flame"></i> 连续打卡' }),
        ]),
        el('div.dash-stat', {}, [
          el('div.dash-num', { html: Progress.completedUnits() + '<span> 关</span>' }),
          el('div.dash-lab', { html: '<i class="ti ti-checkbox"></i> 已学单元' }),
        ]),
      ]),
      el('div.dash-bar', {}, [el('div.dash-fill', { style: 'width:' + pct + '%' })]),
      el('div.dash-week', {}, days.map(function (d) {
        return el('div.wday' + (d.on ? '.on' : '') + (d.isToday ? '.today' : ''), {}, [
          el('span.wday-dot', { html: d.on ? '<i class="ti ti-check"></i>' : '' }),
          el('span.wday-num', { text: d.day }),
        ]);
      })),
      el('div.dash-tip', { text: Progress.checkedToday() ? '今天已打卡，继续保持！🎉' : '今天还没学习，做一关就打卡啦～' }),
    ]);
    return card;
  }

  // ===== 首页 =====
  function home() {
    clear(app);
    app.appendChild(userBar());
    app.appendChild(el('div.hero', {}, [
      el('div.hero-emoji', { text: '🔤' }),
      el('h1.hero-title', { text: 'Phonics Fun' }),
      el('p.hero-sub', { text: '自然拼读 · 听音 · 拼词 · 闯关学习' }),
    ]));
    app.appendChild(dashboard());
    var grid = el('div.level-grid');
    CURRICULUM.forEach(function (lv) {
      var st = Progress.levelStars(lv);
      grid.appendChild(el('button.level-card.c-' + lv.color, {
        onclick: function () { location.hash = '#/level/' + lv.id; }
      }, [
        el('div.lv-icon', { html: '<i class="ti ' + lv.icon + '"></i>' }),
        el('div.lv-main', {}, [
          el('div.lv-title', { text: lv.title }),
          el('div.lv-cn', { text: lv.cn }),
        ]),
        el('div.lv-stars', { html: '<i class="ti ti-star"></i> ' + st.got + '/' + st.total }),
      ]));
    });
    app.appendChild(grid);
    app.appendChild(el('p.foot', { html: '内容改编自 KizPhonics 分级教材 · 发音由设备语音合成' }));
  }

  // ===== 级别页（单元列表） =====
  function level(levelId) {
    var level = find(levelId).level;
    if (!level) return home();
    clear(app);
    app.appendChild(header(level.title, level.cn, '#/', level.color));
    app.appendChild(el('p.level-desc', { text: level.desc }));
    var list = el('div.unit-list');
    level.units.forEach(function (u, i) {
      var stars = Progress.getStars(level.id, u.id);
      list.appendChild(el('button.unit-card.c-' + level.color, {
        onclick: function () { location.hash = '#/unit/' + level.id + '/' + u.id; }
      }, [
        el('div.unit-no', { text: i + 1 }),
        el('div.unit-main', {}, [
          el('div.unit-title', { text: u.title }),
          el('div.unit-cn', { text: u.cn }),
        ]),
        el('div.unit-stars', { html: U.starsHtml(stars) }),
      ]));
    });
    app.appendChild(list);
  }

  // ===== 单元页（题型菜单） =====
  function unit(levelId, unitId) {
    var r = find(levelId, unitId);
    if (!r.unit) return level(levelId);
    clear(app);
    app.appendChild(header(r.unit.title, r.unit.cn, '#/level/' + levelId, r.level.color));

    // 焦点预览
    var prev = el('div.unit-preview');
    r.unit.items.slice(0, 8).forEach(function (it) {
      prev.appendChild(el('button.prev-chip', { onclick: function () { TTS.speakItem(it); } }, [
        el('span.prev-emoji', { text: it.e }),
        el('span.prev-word', { text: it.w }),
      ]));
    });
    app.appendChild(el('p.section-label', { text: '本单元单词（点击发音）' }));
    app.appendChild(prev);

    app.appendChild(el('p.section-label', { text: '选择练习' }));
    var menu = el('div.act-menu');
    var ICONS = { flashcard: 'ti-cards', listen: 'ti-ear', match: 'ti-link', spell: 'ti-pencil', trace: 'ti-writing' };
    r.unit.acts.forEach(function (t) {
      menu.appendChild(el('button.act-card.c-' + r.level.color, {
        onclick: function () { location.hash = '#/play/' + levelId + '/' + unitId + '/' + t; }
      }, [
        el('div.act-icon', { html: '<i class="ti ' + ICONS[t] + '"></i>' }),
        el('div.act-name', { text: Activities.LABELS[t] }),
      ]));
    });
    app.appendChild(menu);
  }

  // ===== 游戏页 =====
  function play(levelId, unitId, type) {
    var r = find(levelId, unitId);
    if (!r.unit) return level(levelId);
    clear(app);
    app.appendChild(header(Activities.LABELS[type], r.unit.title, '#/unit/' + levelId + '/' + unitId, r.level.color));
    var mount = el('div.play-mount.c-' + r.level.color);
    app.appendChild(mount);
    Activities.run(type, r.unit, mount, function (stars) {
      Progress.setStars(levelId, unitId, stars);
      result(r, type, stars);
    });
  }

  // ===== 结算页 =====
  function result(r, type, stars) {
    clear(app);
    var color = r.level.color;
    app.appendChild(el('div.result.c-' + color, {}, [
      el('div.result-emoji', { text: stars >= 3 ? '🏆' : stars >= 2 ? '🎉' : '👍' }),
      el('div.result-title', { text: stars >= 3 ? '太棒了！' : stars >= 2 ? '做得好！' : '继续加油！' }),
      el('div.result-stars', { html: U.starsHtml(stars) }),
      el('div.result-sub', { text: r.unit.title + ' · ' + Activities.LABELS[type] }),
      el('div.result-actions', {}, [
        el('button.btn.primary', { onclick: function () { location.hash = '#/play/' + r.level.id + '/' + r.unit.id + '/' + type; }, html: '<i class="ti ti-refresh"></i> 再来一次' }),
        el('button.btn.ghost', { onclick: function () { location.hash = '#/unit/' + r.level.id + '/' + r.unit.id; }, html: '<i class="ti ti-list"></i> 选其它练习' }),
      ]),
    ]));
    if (stars >= 2) burst();
  }

  // 简单彩纸庆祝
  function burst() {
    var colors = ['#7F77DD', '#1D9E75', '#D85A30', '#D4537E', '#639922', '#EF9F27'];
    for (var i = 0; i < 24; i++) {
      var c = el('span.confetti');
      c.style.left = Math.random() * 100 + 'vw';
      c.style.background = colors[i % colors.length];
      c.style.animationDelay = (Math.random() * 0.3) + 's';
      c.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
      document.body.appendChild(c);
      (function (node) { setTimeout(function () { node.remove(); }, 2000); })(c);
    }
  }

  // ===== 登录 / 注册浮层 =====
  function loginOverlay() {
    var mode = 'in'; // in | up
    var overlay = el('div.overlay');
    var panel = el('div.login-card');
    overlay.appendChild(panel);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);

    function render() {
      clear(panel);
      var email = el('input.field', { type: 'email', placeholder: '邮箱', autocomplete: 'username' });
      var pw = el('input.field', { type: 'password', placeholder: '密码（至少 6 位）', autocomplete: 'current-password' });
      var nick = el('input.field', { type: 'text', placeholder: '昵称（可选）' });
      var msg = el('div.login-msg');
      var submit = el('button.btn.primary.block', { html: mode === 'in' ? '登录' : '注册' });

      submit.addEventListener('click', function () {
        msg.textContent = ''; msg.className = 'login-msg';
        if (!email.value || !pw.value) { msg.textContent = '请输入邮箱和密码'; msg.classList.add('err'); return; }
        submit.setAttribute('disabled', 'disabled'); submit.textContent = '请稍候…';
        var p = mode === 'in' ? Auth.signIn(email.value.trim(), pw.value)
          : Auth.signUp(email.value.trim(), pw.value, nick.value.trim());
        p.then(function () {
          if (mode === 'up') { msg.textContent = '注册成功！如开启了邮箱验证请先查收邮件，然后登录。'; msg.classList.add('ok'); submit.removeAttribute('disabled'); submit.textContent = '注册'; }
          else { overlay.remove(); }
        }).catch(function (e) {
          msg.textContent = (e && e.message) || '操作失败，请重试'; msg.classList.add('err');
          submit.removeAttribute('disabled'); submit.textContent = mode === 'in' ? '登录' : '注册';
        });
      });

      panel.appendChild(el('div.login-head', {}, [
        el('div.login-title', { text: mode === 'in' ? '登录账号' : '注册账号' }),
        el('button.login-x', { onclick: function () { overlay.remove(); }, html: '<i class="ti ti-x"></i>' }),
      ]));
      panel.appendChild(el('p.login-sub', { text: '登录后学习进度会云端保存，换设备也能继续。' }));
      panel.appendChild(email);
      panel.appendChild(pw);
      if (mode === 'up') panel.appendChild(nick);
      panel.appendChild(submit);
      panel.appendChild(msg);
      panel.appendChild(el('button.login-switch', {
        onclick: function () { mode = mode === 'in' ? 'up' : 'in'; render(); },
        text: mode === 'in' ? '没有账号？去注册' : '已有账号？去登录'
      }));
    }
    render();
  }

  // ===== 路由 =====
  function route() {
    var h = location.hash.replace(/^#\/?/, '');
    var p = h.split('/').filter(Boolean);
    window.scrollTo(0, 0);
    if (p[0] === 'level') level(p[1]);
    else if (p[0] === 'unit') unit(p[1], p[2]);
    else if (p[0] === 'play') play(p[1], p[2], p[3]);
    else home();
  }

  function onHome() { return !location.hash || location.hash === '#/' || location.hash === '#'; }

  function init() {
    app = document.getElementById('app');
    window.addEventListener('hashchange', route);
    // 数据/登录状态变化时，若在首页则刷新看板
    Progress.onChange(function () { if (onHome()) route(); });
    Auth.onChange(function (user) { Progress.useUser(user ? user.id : 'guest'); if (onHome()) route(); });
    route();
  }

  return { init: init };
})();
