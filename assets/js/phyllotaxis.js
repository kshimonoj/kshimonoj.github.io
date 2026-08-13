(function () {
  var canvas = document.getElementById('phyllotaxis');
  if (!canvas) return;

  var GA = Math.PI * (3 - Math.sqrt(5)); // 黄金角
  var N = 1597; // フィボナッチ数

  function draw() {
    var ctx = canvas.getContext('2d');
    var rect = canvas.parentElement.getBoundingClientRect();
    var w = rect.width;
    var h = rect.height;
    var dpr = window.devicePixelRatio || 1;

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    var dark = document.documentElement.dataset.theme !== 'light';
    var R = Math.max(w, h) * 0.8;
    var cx = w * 0.79;
    var cy = h * 0.4;

    for (var i = 0; i < N; i++) {
      var f = i / N;
      var r = R * Math.sqrt(f);
      var a = i * GA;
      var t = 1 - f;
      var b = t * t * (3 - 2 * t); // smoothstep 減衰
      var x = cx + r * Math.cos(a);
      var y = cy + r * Math.sin(a);
      if (x < -2 || x > w + 2 || y < -2 || y > h + 2) continue;
      ctx.fillStyle = dark
        ? 'rgba(72,207,173,' + (0.04 + b * 0.30) + ')'
        : 'rgba(26,156,126,' + (0.05 + b * 0.38) + ')';
      ctx.beginPath();
      ctx.arc(x, y, 0.7 + b * 1.1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  window.__redrawPhyllotaxis = draw;
  window.addEventListener('resize', draw);
  draw();
})();
