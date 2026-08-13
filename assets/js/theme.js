(function () {
  var root = document.documentElement;
  var mq = window.matchMedia('(prefers-color-scheme: dark)');

  root.dataset.theme = mq.matches ? 'dark' : 'light';

  // OS 設定が変わったら追従する（トグルでの上書きもページ滞在中のみなので単純に追従）
  if (mq.addEventListener) {
    mq.addEventListener('change', function (e) {
      root.dataset.theme = e.matches ? 'dark' : 'light';
      if (window.__redrawPhyllotaxis) window.__redrawPhyllotaxis();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      if (window.__redrawPhyllotaxis) window.__redrawPhyllotaxis();
    });
  });
})();
