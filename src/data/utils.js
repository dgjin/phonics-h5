export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function sample(arr, n, except) {
  const pool = arr.filter(x => !except || !except.includes(x));
  return shuffle(pool).slice(0, n);
}

export function starsArray(n) {
  return Array(3).fill(0).map((_, i) => i < n);
}

export function tilesOf(item) {
  return item.p && item.p.length ? item.p.slice() : item.w.split('');
}

export function starsFor(correct, total) {
  if (total === 0) return 3;
  const r = correct / total;
  if (r >= 0.9) return 3;
  if (r >= 0.6) return 2;
  return 1;
}

export function highlight(item) {
  const w = item.w, l = item.l;
  if (l && l.indexOf('_') < 0 && l.length <= 3 && w.indexOf(l) >= 0) {
    return w.replace(l, '<b>' + l + '</b>');
  }
  return w;
}

export function getDeviceType() {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}
