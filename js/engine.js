// The engine: runs a child's program and records everything it does as a list of events.
// The same source runs inside a Web Worker (runner.js), on the page, and in Node (tools/test-levels.mjs),
// so the checks in the level files behave the same everywhere.
// Events: out {kind, value, vtype} · bg {color} · shape {s} · box {name, value, vtype} · jump · kite {x, y}
//         · frame (a new forever() frame) · ask {q} · click {x, y} · key {key}
function MithuEngineFactory(G) {
  'use strict';
  var W = 400, H = 400;
  var KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
  var COLORS = ('aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood ' +
    'cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen ' +
    'darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray ' +
    'darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia ' +
    'gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki lavender ' +
    'lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink ' +
    'lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta ' +
    'maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise ' +
    'mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid ' +
    'palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red ' +
    'rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow ' +
    'springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen').split(' ');
  var PALETTE = ['red', 'orange', 'gold', 'limegreen', 'deepskyblue', 'royalblue', 'purple', 'hotpink', 'tomato', 'turquoise', 'yellowgreen', 'orchid'];
  // Every command a child can use, with the inputs it needs (for the Error Doctor).
  var COMMANDS = {
    say: 1, background: 1, circle: 4, rect: 5, triangle: 5, star: 4, kite: 3, text: 3, randomColor: 0, random: 2,
    ask: 1, askNumber: 1, jump: 0, moveKite: 2, onClick: 1, onKey: 2, forever: 1, mango: 2, basket: 2, near: 2
  };

  function MErr(code, data) { var e = new Error(code); e.name = 'MithuError'; e.code = code; e.data = data || {}; return e; }

  // Line number (in the child's code) of the error, from the stack.
  function lineOf(e) {
    var m = /mithu-code\.js:(\d+)/.exec(String(e && e.stack || ''));
    return m ? Math.max(1, +m[1] - 1) : null;
  }
  function toErr(e) {
    if (!e || typeof e !== 'object') return { name: 'Error', message: String(e), line: null, code: null, data: null };
    return { name: String(e.name || 'Error'), message: String(e.message), line: lineOf(e), code: e.code || null, data: e.data || null };
  }

  function isColor(c) {
    if (typeof c !== 'string') return false;
    c = c.trim().toLowerCase();
    return COLORS.indexOf(c) >= 0 || /^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(c);
  }

  // Code outside strings and comments ("bare"), and where a // comment starts.
  function scanLine(line) {
    var out = '', q = null, i, c, cut = line.length;
    for (i = 0; i < line.length; i++) {
      c = line[i];
      if (q) {
        if (c === '\\') { out += '  '; i++; continue; }
        if (c === q) q = null;
        out += ' ';
        continue;
      }
      if (c === '/' && line[i + 1] === '/') { cut = i; break; }
      if (c === '"' || c === "'" || c === '`') { q = c; out += ' '; continue; }
      out += c;
    }
    return { bare: out, cut: cut, openQuote: q };
  }

  // Shows every box (variable) on the stage: after a line like `score = score + 1`, add `;__box("score", score)`.
  // Same line, so error line numbers do not move.
  var NOT_BOX = /^(if|for|while|else|return|function|let|var|const|typeof|new)$/;
  function instrument(code) {
    var lines = code.split('\n');
    var out = lines.map(function (ln, i) {
      var s = scanLine(ln), bare = s.bare.slice(0, s.cut);
      var m = /^\s*(?:let\s+|var\s+|const\s+)?([A-Za-z_$][\w$]*)\s*(?:=(?!=)|\+=|-=|\*=|\/=|\+\+|--)/.exec(bare);
      if (!m || NOT_BOX.test(m[1]) || COMMANDS[m[1]] != null) return ln;
      if (/[{}]/.test(bare)) return ln;
      var bal = 0;
      for (var k = 0; k < bare.length; k++) { var c = bare[k]; if (c === '(' || c === '[') bal++; else if (c === ')' || c === ']') bal--; }
      if (bal !== 0) return ln;
      var end = ln.slice(0, s.cut).trimEnd(); // with the text in quotes, so `let a = "Mango"` counts as finished
      if (/[-+*\/=,(&|?:.]$/.test(end) && !/(\+\+|--)$/.test(end)) return ln;
      for (var j = i + 1; j < lines.length; j++) {
        var nx = scanLine(lines[j]).bare.trim();
        if (!nx) continue;
        if (/^([.+\-*\/?:]|&&|\|\|)/.test(nx)) return ln;
        break;
      }
      return ln.slice(0, s.cut).replace(/\s*;?\s*$/, '') + ';__box("' + m[1] + '",' + m[1] + ')' + (s.cut < ln.length ? ' ' + ln.slice(s.cut) : '');
    });
    // Boxes made at the top can also change inside onClick/onKey/forever (even on one-line `{ }`):
    // one extra last line lets the engine look at them after every click, key and frame.
    var depth = 0, top = [];
    lines.forEach(function (ln) {
      var b = scanLine(ln).bare.slice(0, scanLine(ln).cut), m = /^\s*let\s+([A-Za-z_$][\w$]*)/.exec(b);
      if (depth === 0 && m && top.indexOf(m[1]) < 0) top.push(m[1]);
      for (var k = 0; k < b.length; k++) { if (b[k] === '{') depth++; else if (b[k] === '}') depth--; }
    });
    if (top.length && /\b(onClick|onKey|forever)\b/.test(code)) {
      out.push(';__snap(function(){var __o={};' + top.map(function (n) { return 'try{__o.' + n + '=' + n + '}catch(__e){}'; }).join('') + 'return __o})');
    }
    return out.join('\n');
  }

  // Starts a program. emit(event) receives everything it does. Throws if the program fails.
  // opts: { answers: [...], randoms: [...], boxes: bool }
  function start(code, opts, emit) {
    opts = opts || {};
    var answers = (opts.answers || []).slice(), randoms = (opts.randoms || []).slice();
    var S = { click: [], keys: {}, loop: null, kite: null, snap: null, last: {} };

    function arity(cmd, args, min, max) {
      if (args.length < min || args.length > (max == null ? min : max)) throw MErr('args', { cmd: cmd, need: min, max: max == null ? min : max, got: args.length });
    }
    function num(cmd, v, what) {
      if (typeof v !== 'number' || !isFinite(v)) throw MErr('num', { cmd: cmd, what: what, value: typeof v === 'string' ? '"' + v + '"' : String(v) });
      return v;
    }
    function col(v) {
      if (typeof v === 'function') throw MErr('cmdvalue', { cmd: v.name || '' });
      if (!isColor(v)) throw MErr('color', { value: String(v), notText: typeof v !== 'string' });
      return v.trim().toLowerCase();
    }
    function fn(cmd, f) { if (typeof f !== 'function') throw MErr('fn', { cmd: cmd }); return f; }
    function shape(s) { emit({ t: 'shape', s: s }); }
    function out(kind, args) {
      var v = args.length === 1 ? args[0] : Array.prototype.map.call(args, String).join(' ');
      var t = typeof v;
      if (t === 'function') throw MErr('cmdvalue', { cmd: v.name || '' });
      if (t !== 'number' && t !== 'string' && t !== 'boolean') v = String(v);
      emit({ t: 'out', kind: kind, value: v, vtype: t });
    }
    function clampX(v) { return Math.max(0, Math.min(W, v)); }
    function clampY(v) { return Math.max(0, Math.min(H, v)); }

    var api = {
      say: function () { out('say', arguments); },
      console: { log: function () { out('log', arguments); } },
      background: function (c) { arity('background', arguments, 1); emit({ t: 'bg', color: col(c) }); },
      circle: function (x, y, size, c) {
        arity('circle', arguments, 4);
        shape({ type: 'circle', x: num('circle', x, 'x'), y: num('circle', y, 'y'), size: num('circle', size, 'size'), color: col(c) });
      },
      rect: function (x, y, w, h, c) {
        arity('rect', arguments, 5);
        shape({ type: 'rect', x: num('rect', x, 'x'), y: num('rect', y, 'y'), w: num('rect', w, 'width'), h: num('rect', h, 'height'), color: col(c) });
      },
      triangle: function (x, y, w, h, c) {
        arity('triangle', arguments, 5);
        shape({ type: 'triangle', x: num('triangle', x, 'x'), y: num('triangle', y, 'y'), w: num('triangle', w, 'width'), h: num('triangle', h, 'height'), color: col(c) });
      },
      star: function (x, y, size, c) {
        arity('star', arguments, 4);
        shape({ type: 'star', x: num('star', x, 'x'), y: num('star', y, 'y'), size: num('star', size, 'size'), color: col(c) });
      },
      kite: function (x, y, c) {
        arity('kite', arguments, 3);
        shape({ type: 'kite', x: num('kite', x, 'x'), y: num('kite', y, 'y'), color: col(c) });
      },
      text: function (words, x, y, c) {
        arity('text', arguments, 3, 4);
        shape({ type: 'text', text: String(words), x: num('text', x, 'x'), y: num('text', y, 'y'), color: c === undefined ? '#17261c' : col(c) });
      },
      mango: function (x, y) { arity('mango', arguments, 2); shape({ type: 'mango', x: num('mango', x, 'x'), y: num('mango', y, 'y') }); },
      basket: function (x, y) { arity('basket', arguments, 2); shape({ type: 'basket', x: num('basket', x, 'x'), y: num('basket', y, 'y') }); },
      randomColor: function () { arity('randomColor', arguments, 0); return PALETTE[Math.floor(Math.random() * PALETTE.length)]; },
      random: function (a, b) {
        arity('random', arguments, 2);
        num('random', a, 'min'); num('random', b, 'max');
        if (a > b) { var t = a; a = b; b = t; }
        if (randoms.length) return randoms.shift();
        return Math.ceil(a) + Math.floor(Math.random() * (Math.floor(b) - Math.ceil(a) + 1));
      },
      ask: function (q) { arity('ask', arguments, 1); emit({ t: 'ask', q: String(q) }); return answers.length ? String(answers.shift()) : ''; },
      askNumber: function (q) {
        arity('askNumber', arguments, 1);
        emit({ t: 'ask', q: String(q) });
        var v = answers.length ? Number(answers.shift()) : 0;
        return isNaN(v) ? 0 : v;
      },
      jump: function () { arity('jump', arguments, 0); emit({ t: 'jump' }); },
      moveKite: function (dx, dy) {
        arity('moveKite', arguments, 2);
        num('moveKite', dx, 'dx'); num('moveKite', dy, 'dy');
        if (!S.kite) S.kite = { x: 200, y: 200 };
        S.kite.x = clampX(S.kite.x + dx); S.kite.y = clampY(S.kite.y + dy);
        emit({ t: 'kite', x: S.kite.x, y: S.kite.y });
      },
      onClick: function (f) { arity('onClick', arguments, 1); S.click.push(fn('onClick', f)); },
      onKey: function (k, f) {
        arity('onKey', arguments, 2);
        if (KEYS.indexOf(k) < 0) throw MErr('key', { value: String(k) });
        (S.keys[k] = S.keys[k] || []).push(fn('onKey', f));
      },
      forever: function (f) { arity('forever', arguments, 1); S.loop = fn('forever', f); },
      near: function (a, b) { arity('near', arguments, 2); return Math.abs(num('near', a, 'a') - num('near', b, 'b')) < 40; },
      __snap: function (f) { S.snap = f; },
      __box: function (name, v) {
        if (typeof v === 'function' || v === undefined) return;
        S.last[name] = v;
        var t = typeof v;
        emit({ t: 'box', name: name, value: t === 'number' || t === 'string' || t === 'boolean' ? v : String(v), vtype: t });
      }
    };
    // A command used as a value (`jumps = jump + 1`, `say(say)`) must not turn into the engine's source code.
    Object.keys(api).forEach(function (k) {
      if (typeof api[k] === 'function' && k.indexOf('__') !== 0) api[k].toString = api[k].valueOf = function () { throw MErr('cmdvalue', { cmd: k }); };
    });
    api.console.log.toString = api.console.log.valueOf = function () { throw MErr('cmdvalue', { cmd: 'console.log' }); };
    Object.keys(api).forEach(function (k) { G[k] = api[k]; });

    if (/\bmoveKite\b/.test(code)) { S.kite = { x: 200, y: 200 }; emit({ t: 'kite', x: 200, y: 200 }); }
    var src = opts.boxes ? instrument(code) : code;
    var f = (0, eval)('(function(){"use strict";\n' + src + '\n})\n//# sourceURL=mithu-code.js');
    f();

    function snap() {
      if (!S.snap) return;
      var o = S.snap();
      Object.keys(o).forEach(function (k) { if (o[k] !== S.last[k]) api.__box(k, o[k]); });
    }
    return {
      live: function () { return !!(S.click.length || Object.keys(S.keys).length || S.loop); },
      uses: function () { return { click: S.click.length > 0, keys: Object.keys(S.keys), forever: !!S.loop }; },
      click: function (x, y) { S.click.forEach(function (h) { h(x, y); }); snap(); },
      key: function (k) { (S.keys[k] || []).forEach(function (h) { h(); }); snap(); },
      tick: function () { if (S.loop) { emit({ t: 'frame' }); S.loop(); snap(); } }
    };
  }

  // Runs a program and then plays scripted actions (clicks, keys, forever ticks). Used for checks and tests.
  // opts.actions: [{click: [x, y]}, {key: 'ArrowLeft'}, {ticks: 50}]
  var LIMIT = 20000;
  function runScripted(code, opts) {
    opts = opts || {};
    var events = [], error = null, ctl = null;
    function emit(e) { if (events.length >= LIMIT) throw MErr('toomuch'); events.push(e); }
    try { ctl = start(code, opts, emit); } catch (e) { error = toErr(e); }
    var acts = opts.actions || [];
    for (var i = 0; !error && ctl && i < acts.length; i++) {
      var a = acts[i];
      try {
        if (a.click) { events.push({ t: 'click', x: a.click[0], y: a.click[1] }); ctl.click(a.click[0], a.click[1]); }
        else if (a.key) { events.push({ t: 'key', key: a.key }); ctl.key(a.key); }
        else if (a.ticks) for (var k = 0; k < a.ticks; k++) ctl.tick();
      } catch (e) { error = toErr(e); }
    }
    return { events: events, error: error, uses: ctl ? ctl.uses() : null };
  }

  // Turns events into a simple picture of the result, for checks.
  function summarize(res) {
    var r = {
      outputs: [], says: [], shapes: [], allShapes: [], bg: null, bgCount: 0, boxes: {}, boxLog: [], jumps: 0,
      kite: null, kiteLog: [], frames: 0, asks: [], error: res.error || null, uses: res.uses || null, events: res.events || []
    };
    r.events.forEach(function (e) {
      if (e.t === 'out') { r.outputs.push(e); r.says.push(e.value); }
      else if (e.t === 'bg') { r.bg = e.color; r.bgCount++; r.shapes = []; }
      else if (e.t === 'shape') { r.shapes.push(e.s); r.allShapes.push(e.s); }
      else if (e.t === 'box') { r.boxes[e.name] = e.value; r.boxLog.push(e); }
      else if (e.t === 'jump') r.jumps++;
      else if (e.t === 'kite') { r.kite = { x: e.x, y: e.y }; r.kiteLog.push(r.kite); }
      else if (e.t === 'frame') { r.frames++; }
      else if (e.t === 'ask') r.asks.push(e.q);
    });
    return r;
  }

  // ---------- helpers for the checks in the level files ----------
  var FAMILY = {
    red: 'red darkred crimson firebrick indianred tomato orangered',
    orange: 'orange darkorange coral tomato orangered sandybrown',
    yellow: 'yellow gold khaki lightyellow lemonchiffon goldenrod palegoldenrod darkkhaki lightgoldenrodyellow',
    green: 'green lime limegreen darkgreen forestgreen seagreen mediumseagreen lightgreen palegreen springgreen mediumspringgreen ' +
      'lawngreen chartreuse greenyellow yellowgreen olivedrab olive darkolivegreen darkseagreen',
    blue: 'blue navy darkblue mediumblue royalblue dodgerblue deepskyblue skyblue lightskyblue lightblue steelblue cornflowerblue ' +
      'midnightblue powderblue cadetblue',
    brown: 'brown saddlebrown sienna chocolate peru maroon rosybrown sandybrown burlywood tan darkgoldenrod',
    white: 'white snow ivory whitesmoke ghostwhite floralwhite seashell mintcream azure aliceblue linen',
    black: 'black'
  };
  function hexHue(c) {
    var m = /^#(?:([0-9a-f])([0-9a-f])([0-9a-f])|([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2}))$/.exec(c);
    if (!m) return null;
    var r = parseInt(m[1] ? m[1] + m[1] : m[4], 16) / 255, g = parseInt(m[2] ? m[2] + m[2] : m[5], 16) / 255, b = parseInt(m[3] ? m[3] + m[3] : m[6], 16) / 255;
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, h = 0, l = (mx + mn) / 2;
    if (d) h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return { h: (h * 60 + 360) % 360, s: d ? d / (1 - Math.abs(2 * l - 1)) : 0, l: l };
  }
  // Is colour c in a family ("yellow", "green" ...)? Accepts names and #hex.
  function isFamily(c, fam) {
    c = String(c || '').trim().toLowerCase();
    if ((' ' + FAMILY[fam] + ' ').indexOf(' ' + c + ' ') >= 0) return true;
    var x = hexHue(c);
    if (!x) return false;
    if (fam === 'white') return x.l > .9;
    if (fam === 'black') return x.l < .12;
    if (x.s < .25 || x.l < .1 || x.l > .92) return false;
    var ranges = { red: [[345, 360], [0, 15]], orange: [[15, 45]], yellow: [[45, 70]], green: [[70, 170]], blue: [[170, 260]], brown: [[10, 45]] };
    if (fam === 'brown' && x.l > .45) return false;
    return (ranges[fam] || []).some(function (rg) { return x.h >= rg[0] && x.h <= rg[1]; });
  }
  function bbox(s) {
    switch (s.type) {
      case 'circle': case 'star': return [s.x - s.size, s.y - s.size, s.x + s.size, s.y + s.size];
      case 'rect': case 'triangle': return [Math.min(s.x, s.x + s.w), Math.min(s.y, s.y + s.h), Math.max(s.x, s.x + s.w), Math.max(s.y, s.y + s.h)];
      case 'kite': return [s.x - 16, s.y - 22, s.x + 16, s.y + 22];
      case 'text': return [s.x, s.y - 20, s.x + s.text.length * 10, s.y + 4];
      case 'mango': return [s.x - 14, s.y - 18, s.x + 14, s.y + 18];
      case 'basket': return [s.x - 35, s.y, s.x + 35, s.y + 34];
    }
    return [0, 0, 0, 0];
  }
  var kit = {
    W: W, H: H,
    bbox: bbox,
    fullyOn: function (s) { var b = bbox(s); return b[0] >= 0 && b[1] >= 0 && b[2] <= W && b[3] <= H; },
    partlyOn: function (s) { var b = bbox(s); return b[2] > 0 && b[3] > 0 && b[0] < W && b[1] < H; },
    // Does shape a sit completely inside shape b?
    inside: function (a, b) { var p = bbox(a), q = bbox(b); return p[0] >= q[0] && p[1] >= q[1] && p[2] <= q[2] && p[3] <= q[3]; },
    overlap: function (a, b) { var p = bbox(a), q = bbox(b); return p[0] < q[2] && q[0] < p[2] && p[1] < q[3] && q[1] < p[3]; },
    isFamily: isFamily,
    isColor: isColor,
    of: function (r, type) { return r.shapes.filter(function (s) { return s.type === type; }); },
    // Code without comments, blank lines and extra spaces: for "did the child change this?" checks.
    squash: function (code) { return code.split('\n').map(function (l) { return l.slice(0, scanLine(l).cut).replace(/\s+/g, ''); }).filter(Boolean).join('\n'); },
    // Code with strings and comments blanked out: for "is `let` used?" style checks that must ignore text.
    bare: function (code) { return code.split('\n').map(function (l) { var s = scanLine(l); return s.bare.slice(0, s.cut); }).join('\n'); },
    // Replace the value in `let name = ...` (first one) with a new value, e.g. to test with other inputs.
    setLet: function (code, name, value) {
      var re = new RegExp('(^|\\n)(\\s*let\\s+' + name + '\\s*=\\s*)([^\\n]*?)(\\s*(?://[^\\n]*)?)(?=\\n|$)');
      return code.replace(re, function (m, a, b, c, d) { return a + b + JSON.stringify(value) + d; });
    }
  };

  return {
    start: start, runScripted: runScripted, summarize: summarize, instrument: instrument, toErr: toErr, MErr: MErr,
    isColor: isColor, scanLine: scanLine, kit: kit, COMMANDS: COMMANDS, KEYS: KEYS, COLORS: COLORS, PALETTE: PALETTE, W: W, H: H, LIMIT: LIMIT
  };
}
if (typeof window !== 'undefined') window.MithuEngineFactory = MithuEngineFactory;
