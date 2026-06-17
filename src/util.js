/* 通用工具：DOM 构建、洗牌、随机抽取 */
window.U = (function () {
  // el('div.card', {onclick:fn, html:'..'}, [child, ...])
  function el(spec, props, children) {
    var parts = spec.split('.');
    var tag = parts[0] || 'div';
    var node = document.createElement(tag);
    if (parts.length > 1) node.className = parts.slice(1).join(' ');
    props = props || {};
    Object.keys(props).forEach(function (k) {
      var v = props[k];
      if (k === 'html') node.innerHTML = v;
      else if (k === 'text') node.textContent = v;
      else if (k === 'class') node.className = node.className ? node.className + ' ' + v : v;
      else if (k === 'style') node.setAttribute('style', v);
      else if (k.slice(0, 2) === 'on' && typeof v === 'function') node.addEventListener(k.slice(2), v);
      else if (v != null) node.setAttribute(k, v);
    });
    (children || []).forEach(function (c) {
      if (c == null) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // 从数组随机取 n 个（不含 except 中的元素）
  function sample(arr, n, except) {
    var pool = arr.filter(function (x) { return !except || except.indexOf(x) < 0; });
    return shuffle(pool).slice(0, n);
  }

  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  function starsHtml(n) {
    var s = '';
    for (var i = 0; i < 3; i++) s += '<i class="ti ti-star' + (i < n ? ' on' : '') + '"></i>';
    return s;
  }

  return { el: el, shuffle: shuffle, sample: sample, clear: clear, starsHtml: starsHtml };
})();
