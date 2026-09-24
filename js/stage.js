// The stage under Mithu: the drawing wall (canvas), memory boxes, question card and arrow pad.
(function () {
  var $ = function (s) { return document.querySelector(s); };
  var cv = $('#wall'), ctx = cv.getContext('2d');
  var list = [], bg = null, kite = null, grid = false, dirty = false, onTap = null;
  var MAX = 4000;

  function size() {
    var w = cv.clientWidth || 400, dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    var px = Math.round(w * dpr);
    if (cv.width !== px) { cv.width = px; cv.height = px; }
    draw();
  }
  if (window.ResizeObserver) new ResizeObserver(size).observe(cv); else window.addEventListener('resize', size);

  function later() { if (!dirty) { dirty = true; requestAnimationFrame(function () { dirty = false; draw(); }); } }

  // ---------- shapes ----------
  function starPath(x, y, r) {
    ctx.beginPath();
    for (var i = 0; i < 10; i++) {
      var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r;
      ctx[i ? 'lineTo' : 'moveTo'](x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    ctx.closePath();
  }
  function kitePath(x, y, color, tail) {
    if (tail) {
      ctx.strokeStyle = '#8b9c8f'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(x, y + 22); ctx.quadraticCurveTo(x - 10, y + 34, x, y + 44); ctx.quadraticCurveTo(x + 10, y + 54, x + 2, y + 62); ctx.stroke();
    }
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.moveTo(x, y - 22); ctx.lineTo(x + 16, y - 4); ctx.lineTo(x, y + 22); ctx.lineTo(x - 16, y - 4); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(x, y - 22); ctx.lineTo(x, y + 22); ctx.moveTo(x - 16, y - 4); ctx.lineTo(x + 16, y - 4); ctx.stroke();
  }
  function shape(s) {
    ctx.fillStyle = s.color || '#000';
    switch (s.type) {
      case 'circle': ctx.beginPath(); ctx.arc(s.x, s.y, Math.abs(s.size), 0, Math.PI * 2); ctx.fill(); break;
      case 'rect': ctx.fillRect(s.x, s.y, s.w, s.h); break;
      case 'triangle': ctx.beginPath(); ctx.moveTo(s.x + s.w / 2, s.y); ctx.lineTo(s.x + s.w, s.y + s.h); ctx.lineTo(s.x, s.y + s.h); ctx.closePath(); ctx.fill(); break;
      case 'star': starPath(s.x, s.y, Math.abs(s.size)); ctx.fill(); break;
      case 'kite': kitePath(s.x, s.y, s.color, true); break;
      case 'text':
        ctx.font = '700 20px "Baloo 2", system-ui, sans-serif'; ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
        ctx.fillText(s.text, s.x, s.y); break;
      case 'mango':
        var g = ctx.createRadialGradient(s.x - 5, s.y - 6, 2, s.x, s.y, 20);
        g.addColorStop(0, '#FFE066'); g.addColorStop(.6, '#FFB020'); g.addColorStop(1, '#E07B00');
        ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(s.x, s.y, 14, 18, -.25, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#2E9B4A'; ctx.beginPath(); ctx.ellipse(s.x + 7, s.y - 19, 8, 3.5, -.6, 0, Math.PI * 2); ctx.fill();
        break;
      case 'basket':
        ctx.fillStyle = '#A0652F';
        ctx.beginPath(); ctx.moveTo(s.x - 35, s.y); ctx.lineTo(s.x + 35, s.y); ctx.lineTo(s.x + 27, s.y + 34); ctx.lineTo(s.x - 27, s.y + 34); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#6E4527'; ctx.lineWidth = 2;
        for (var i = 1; i < 3; i++) { ctx.beginPath(); ctx.moveTo(s.x - 35 + i * 2.6, s.y + i * 11); ctx.lineTo(s.x + 35 - i * 2.6, s.y + i * 11); ctx.stroke(); }
        ctx.fillStyle = '#7A4A22'; ctx.fillRect(s.x - 38, s.y - 4, 76, 6);
        break;
    }
  }
  function drawGrid() {
    ctx.lineWidth = 1;
    for (var v = 50; v < 400; v += 50) {
      ctx.strokeStyle = v % 100 ? 'rgba(20,40,30,.12)' : 'rgba(20,40,30,.28)';
      ctx.beginPath(); ctx.moveTo(v, 0); ctx.lineTo(v, 400); ctx.moveTo(0, v); ctx.lineTo(400, v); ctx.stroke();
    }
    ctx.font = '700 11px "JetBrains Mono", ui-monospace, monospace'; ctx.textBaseline = 'top';
    for (v = 0; v < 400; v += 100) {
      label(String(v), v + 3, 3);
      if (v) label(String(v), 3, v + 3);
    }
    label('x →', 360, 3); label('y ↓', 3, 380);
  }
  function label(t, x, y) {
    var w = ctx.measureText(t).width + 6;
    ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fillRect(x - 2, y - 1, w, 14);
    ctx.fillStyle = '#1C4A73'; ctx.textAlign = 'left'; ctx.fillText(t, x + 1, y);
  }
  function draw() {
    var k = cv.width / 400;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.setTransform(k, 0, 0, k, 0, 0);
    ctx.fillStyle = bg || '#ffffff'; ctx.fillRect(0, 0, 400, 400);
    list.forEach(shape);
    if (kite) kitePath(kite.x, kite.y, '#D63B34', true);
    if (grid) drawGrid();
  }

  // ---------- taps and coordinates ----------
  function pos(e) {
    var r = cv.getBoundingClientRect();
    return { x: Math.round((e.clientX - r.left) / r.width * 400), y: Math.round((e.clientY - r.top) / r.height * 400) };
  }
  function showXY(p) {
    var c = $('#coord');
    c.hidden = false;
    c.textContent = 'x: ' + Math.max(0, Math.min(400, p.x)) + ',  y: ' + Math.max(0, Math.min(400, p.y));
  }
  cv.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse') showXY(pos(e)); });
  cv.addEventListener('pointerleave', function () { $('#coord').hidden = true; });
  cv.addEventListener('pointerdown', function (e) { var p = pos(e); showXY(p); if (onTap) onTap(p.x, p.y); });
  $('#grid-btn').addEventListener('click', function () {
    grid = !grid;
    $('#grid-btn').setAttribute('aria-pressed', grid);
    draw();
  });

  // ---------- memory boxes ----------
  function fmt(v, t) { return t === 'string' ? '"' + v + '"' : String(v); }
  function box(name, value, vtype, flash) {
    var wrap = $('#boxes'), listEl = $('#box-list');
    wrap.hidden = false;
    var el = listEl.querySelector('[data-name="' + CSS.escape(name) + '"]');
    if (!el) {
      if (listEl.children.length >= 12) return;
      el = document.createElement('div');
      el.className = 'box'; el.dataset.name = name;
      el.innerHTML = '<span class="box-val"></span><span class="box-lid"></span>';
      el.querySelector('.box-lid').textContent = name;
      listEl.appendChild(el);
    }
    var val = el.querySelector('.box-val');
    val.textContent = fmt(value, vtype);
    val.className = 'box-val ' + (vtype === 'number' ? 'num' : vtype === 'string' ? 'str' : '');
    if (flash) { el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); }
  }

  // ---------- questions (ask / askNumber) ----------
  var pendingAsk = null; // resolves with null when the stage is reset (the child left the level)
  function ask(q, numeric) {
    return new Promise(function (resolve) {
      pendingAsk = resolve;
      var f = $('#ask'), inp = $('#ask-in');
      $('#ask-q').textContent = q;
      inp.value = '';
      inp.type = numeric ? 'number' : 'text';
      inp.inputMode = numeric ? 'numeric' : 'text';
      $('#ask-hint').textContent = numeric ? 'ایک نمبر لکھیں، پھر «جواب دیں» دبائیں۔' : 'انگریزی میں جواب لکھیں، پھر «جواب دیں» دبائیں۔';
      f.hidden = false;
      setTimeout(function () { inp.focus({ preventScroll: true }); f.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, 60);
      f.onsubmit = function (e) {
        e.preventDefault();
        var v = inp.value.trim();
        if (numeric && (v === '' || isNaN(Number(v)))) { inp.focus(); $('#ask-hint').textContent = 'یہاں صرف نمبر لکھیں، جیسے 7۔'; return; }
        f.hidden = true; f.onsubmit = null; pendingAsk = null;
        resolve(v);
      };
    });
  }

  window.Stage = {
    reset: function () {
      list = []; bg = null; kite = null; $('#box-list').innerHTML = ''; $('#boxes').hidden = true; $('#ask').hidden = true;
      if (pendingAsk) { var r = pendingAsk; pendingAsk = null; $('#ask').onsubmit = null; r(null); }
      later();
    },
    clearDrawing: function () { list = []; bg = null; kite = null; later(); },
    bg: function (c) { bg = c; list = []; later(); },
    add: function (s) { list.push(s); if (list.length > MAX) list.splice(0, list.length - MAX); later(); },
    kite: function (x, y) { kite = { x: x, y: y }; later(); },
    box: box,
    ask: ask,
    onTap: function (f) { onTap = f; },
    size: size,
    empty: function () { return !list.length && !bg && !kite; }
  };
})();
