(function () {
  'use strict';
  var C = window.COURSE;
  var MODS = (window.MODULES || []).slice().sort(function (a, b) { return a.number - b.number; });
  var M = MODS[0], LV = M.levels;
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var KEY = 'mithu-course-v3', OLD_KEY = 'mithu-m1-v2'; // storage key kept on purpose: it holds children's progress
  var PREVIEW = location.hash === '#preview'; // opens every level, for reviewers
  var DEFAULT_KEYS = [
    { t: 'say("…")', ins: 'say("|")', tpl: true }, { t: '(', ins: '(' }, { t: ')', ins: ')' }, { t: '"', ins: '"' }, { t: '+', ins: ' + ' }, { t: '↵', ins: '\n' }
  ];

  // ---------- state ----------
  var S = { mod: 0, cur: 0, curBy: {}, lv: {}, sound: true, name: '', certName: '', streak: { day: '', n: 0 } };
  try {
    var saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (!saved) {
      var old = JSON.parse(localStorage.getItem(OLD_KEY) || 'null'); // Module 1 progress from before there were more modules
      if (old) saved = { lv: old.lv || {}, curBy: { m1: old.cur || 0 }, sound: old.sound !== false };
    }
    if (saved) S = Object.assign(S, saved);
  } catch (e) {}
  if (!S.name && S.certName) S.name = S.certName;
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  // at: which step of the lesson; said: how many teaching sentences are showing; step: 0 = puzzle, 1 = code after the puzzle
  function lvState(L) {
    var s = S.lv[L.id] || (S.lv[L.id] = {});
    if (s.at == null) s.at = 0;
    if (s.said == null) s.said = 0;
    if (s.hints == null) s.hints = 0;
    return s;
  }
  function st(i) { return lvState(LV[i == null ? S.cur : i]); }
  function lvDone(L) { return !!(S.lv[L.id] || {}).done; }
  function modDone(mi) { var ls = MODS[mi].levels; return lvDone(ls[ls.length - 1]); }
  function modOpen(mi) { return PREVIEW || mi === 0 || modDone(mi - 1) || MODS[mi].levels.some(lvDone); }
  function levelOpen(mi, li) { var ls = MODS[mi].levels; return PREVIEW || (modOpen(mi) && (li === 0 || lvDone(ls[li - 1]) || lvDone(ls[li]))); }
  function allDone() { return MODS.every(function (m, i) { return modDone(i); }); }
  function starsTotal() { var n = 0; Object.keys(S.lv).forEach(function (k) { n += S.lv[k].stars || 0; }); return n; }
  // The next level to play: the first open level that is not done.
  function nextUp() {
    for (var mi = 0; mi < MODS.length; mi++) for (var li = 0; li < MODS[mi].levels.length; li++)
      if (!lvDone(MODS[mi].levels[li]) && levelOpen(mi, li)) return { mi: mi, li: li };
    return null;
  }
  function today() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function yesterday() { var d = new Date(Date.now() - 864e5); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function bumpStreak() {
    var t = today();
    if (S.streak.day === t) return;
    S.streak = { day: t, n: S.streak.day === yesterday() ? S.streak.n + 1 : 1 };
  }
  function streakNow() { return S.streak.day === today() || S.streak.day === yesterday() ? S.streak.n : 0; }

  // ---------- helpers ----------
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  // The left-to-right mark keeps a chip that is only a symbol, like `(` or `<`, from being mirrored inside Urdu text.
  function rich(s) { return String(s).replace(/`([^`]+)`/g, function (m, c) { return '<code dir="ltr">‎' + esc(c) + '</code>'; }); }
  function isLatin(s) { return /^[\x00-\x7F…]+$/.test(s); }
  function nameHtml() { return '<bdi dir="ltr" class="kid">' + esc(S.name) + '</bdi>'; }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  function motion() { return calm.matches ? 'auto' : 'smooth'; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  var SPEAK_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4zM16 8.5a5 5 0 010 7M18.5 6a8.5 8.5 0 010 12" /></svg>';
  var CHECK_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  var LOCK_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></svg>';
  var PLAY_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>';
  var BULB_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z"/></svg>';
  var E = Runner.E;
  // What the checks get: helpers plus an invisible test run.
  var T = Object.assign({
    run: function (code, o) { return Runner.test(code, Object.assign({ boxes: true }, o)); },
    explain: function (err, code) { var d = err && Doctor.explain(err, code); return d ? d.msg : ''; }
  }, E.kit);

  // ---------- Birdy ----------
  var bird = Mithu($('#bird'));
  var meBird = Mithu($('#me-bird'));

  // ---------- narrator: recorded Kokoro voice (audio/), else the device's own English voice ----------
  var Narrator = (function () {
    var synth = window.speechSynthesis, voice = null, talking = null, left = 0, round = 0;
    var files = null, audio = new Audio(), prog = null; // prog(fraction 0..1): how far the current line has been spoken
    audio.addEventListener('playing', function () { if (talking) talking.talk(true); });
    audio.addEventListener('timeupdate', function () { if (prog && audio.duration) prog(audio.currentTime / audio.duration); });
    audio.addEventListener('ended', function () { if (prog) { var p = prog; prog = null; p(1); } });
    ['pause', 'ended', 'error'].forEach(function (ev) { audio.addEventListener(ev, function () { if (talking) talking.talk(false); }); });
    fetch('audio/manifest.json').then(function (r) { return r.ok ? r.json() : null; }).then(function (m) {
      if (m && m.ids) { files = {}; m.ids.forEach(function (id) { files[id] = true; }); refresh(); }
    }).catch(function () {});
    // Same id as tools/narration.mjs, so each sentence finds its recording.
    function voiceId(text) {
      var x = 0x811c9dc5;
      for (var i = 0; i < text.length; i++) { x ^= text.charCodeAt(i); x = Math.imul(x, 0x01000193) >>> 0; }
      return ('0000000' + x.toString(16)).slice(-8);
    }
    var NOVELTY = /Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Deranged|Good News|Hysterical|Jester|Junior|Organ|Superstar|Trinoids|Whisper|Wobble|Zarvox|Ralph|Fred|Grandma|Grandpa|Rocko|Shelley|Eddy|Flo|Reed|Sandy/;
    function score(v) {
      var n = v.name, s = 0;
      if (/Natural|Neural/i.test(n)) s += 60;
      if (/Online/i.test(n)) s += 20;
      if (/Premium/i.test(n)) s += 50;
      if (/Enhanced/i.test(n)) s += 40;
      if (/^Google/i.test(n)) s += 30;
      if (/Ava|Emma|Jenny|Aria|Sonia|Libby|Zoe|Allison|Susan|Serena|Kate|Stephanie/i.test(n)) s += 8;
      if (/en[-_](GB|US)/i.test(v.lang)) s += 5;
      if (!v.localService) s += 3;
      return s;
    }
    function findVoice() {
      var list = synth.getVoices().filter(function (v) { return /^en[-_]/i.test(v.lang) && !NOVELTY.test(v.name); });
      list.sort(function (a, b) { return score(b) - score(a); });
      voice = list[0] || null;
      refresh();
    }
    if (synth) { findVoice(); synth.onvoiceschanged = findVoice; }
    // Phones only allow speech after a tap; unlock on the first one.
    document.addEventListener('pointerdown', function unlock() {
      if (synth) { var u = new SpeechSynthesisUtterance(''); u.volume = 0; synth.speak(u); }
      document.removeEventListener('pointerdown', unlock);
    });

    function ready() { return !!(files || voice); }
    function refresh() {
      $$('.sound-btn').forEach(function (b) {
        b.hidden = !ready();
        b.setAttribute('aria-pressed', S.sound);
        b.setAttribute('aria-label', S.sound ? 'آواز بند کریں' : 'آواز چلائیں');
      });
      $$('.speak').forEach(function (b) { b.hidden = !ready(); });
    }
    function stop() {
      round++;
      prog = null;
      audio.pause();
      if (synth) synth.cancel();
      left = 0;
      if (talking) talking.talk(false);
    }
    // force: the child pressed a speaker button, so speak even when sound is switched off.
    // onProgress (optional) hears how far the line has got, so text on screen can keep pace with the voice.
    // Returns false when nothing will be spoken (sound off, no voice).
    function say(text, who, force, onProgress) {
      stop();
      if (!ready() || (!S.sound && !force) || !text) return false;
      talking = who || bird;
      var id = voiceId(String(text));
      if (files && files[id]) {
        prog = onProgress || null;
        audio.src = 'audio/' + id + '.mp4';
        audio.play().catch(function () { if (prog) { var p = prog; prog = null; p(1); } });
        return true;
      }
      if (!voice) return false;
      var parts = String(text).match(/[^.!?]+[.!?]*/g) || [text], run = ++round, total = String(text).length, done = 0;
      left = parts.length;
      parts.forEach(function (p) {
        var u = new SpeechSynthesisUtterance(p.trim()), from = done;
        done += p.length;
        u.voice = voice; u.lang = voice.lang; u.rate = .78; u.pitch = 1.08;
        u.onstart = function () { if (run === round) { talking.talk(true); if (onProgress) onProgress(from / total); } };
        u.onend = u.onerror = function () { if (run === round && --left <= 0) { talking.talk(false); if (onProgress) onProgress(1); } };
        synth.speak(u);
      });
      return true;
    }
    // The child's name is never in the recordings: the device's own voice says it first (it sounds different, on purpose),
    // then Birdy's recorded line follows. Without a device voice, only the recording plays.
    function withName(words, text, who) {
      stop();
      if (!ready() || !S.sound) return;
      if (!synth || !voice || !S.name) { say(text, who); return; }
      talking = who || bird;
      var run = ++round, u = new SpeechSynthesisUtterance(words);
      u.voice = voice; u.lang = voice.lang; u.rate = .85; u.pitch = 1.1;
      u.onstart = function () { if (run === round) talking.talk(true); };
      u.onend = u.onerror = function () { if (run !== round) return; talking.talk(false); say(text, who); };
      synth.speak(u);
    }
    return { say: say, withName: withName, stop: stop, ready: ready, refresh: refresh };
  })();
  $$('.sound-btn').forEach(function (b) {
    b.onclick = function () { S.sound = !S.sound; save(); Narrator.refresh(); if (!S.sound) Narrator.stop(); };
  });

  // ---------- screens ----------
  function show(screen) {
    $('#app').dataset.screen = screen;
    window.scrollTo(0, 0);
  }
  // Parked parts (stage, slate, keys) move into the step that needs them.
  function park() {
    ['#stage', '#slate', '#keys'].forEach(function (s) { $('#parking').appendChild($(s)); });
  }
  function place(sel, into) { into.appendChild($(sel)); if (sel === '#stage') Stage.size(); }

  // ---------- editor ----------
  var ta = $('#code'), hl = $('#hl'), gutter = $('#gutter');
  var badLine = null;
  var TOKENS = /(\/\/.*$)|("(?:[^"\\]|\\.)*"?|'(?:[^'\\]|\\.)*'?)|(\b\d+(?:\.\d+)?\b)|(\b(?:let|const|var|for|if|else|while|function|return|true|false)\b)|(\b(?:say|console\.log|console|log|background|circle|rect|triangle|star|kite|text|randomColor|random|askNumber|ask|jump|moveKite|onClick|onKey|forever|mango|basket|near)\b)/g;
  function highlightLine(line) {
    var out = '', re = new RegExp(TOKENS.source, 'g'), last = 0, m;
    while ((m = re.exec(line))) {
      out += esc(line.slice(last, m.index));
      out += '<span class="' + (m[1] ? 't-com' : m[2] ? 't-str' : m[3] ? 't-num' : m[4] ? 't-kw' : 't-cmd') + '">' + esc(m[0]) + '</span>';
      last = re.lastIndex;
    }
    return out + esc(line.slice(last));
  }
  function paint() {
    hl.innerHTML = ta.value.split('\n').map(function (l, i) {
      var h = highlightLine(l);
      return i + 1 === badLine ? '<span class="line-bad">' + (h || ' ') + '</span>' : h;
    }).join('\n') + '\n';
    var n = ta.value.split('\n').length, g = '';
    for (var i = 1; i <= n; i++) g += '<span' + (i === badLine ? ' class="bad"' : '') + '>' + i + '</span>';
    gutter.innerHTML = g;
    syncScroll();
  }
  function syncScroll() { hl.scrollTop = ta.scrollTop; hl.scrollLeft = ta.scrollLeft; gutter.scrollTop = ta.scrollTop; }
  ta.addEventListener('scroll', syncScroll);
  ta.addEventListener('input', function () {
    if (/[“”„″‘’]/.test(ta.value)) { // phones insert curly quotes; code needs straight ones
      var p = ta.selectionStart;
      ta.value = ta.value.replace(/[“”„″]/g, '"').replace(/[‘’]/g, "'");
      ta.setSelectionRange(p, p);
    }
    badLine = null;
    st().code = ta.value; save();
    paint();
  });
  function indentHere() {
    var before = ta.value.slice(0, ta.selectionStart);
    return /^[ \t]*/.exec(before.slice(before.lastIndexOf('\n') + 1))[0];
  }
  ta.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); run(); return; }
    // New line keeps the indentation, and indents after "{".
    if (e.key === 'Enter' && !e.shiftKey && !e.altKey && !e.isComposing) {
      var s = ta.selectionStart, before = ta.value.slice(0, s), line = before.slice(before.lastIndexOf('\n') + 1);
      var ind = /^[ \t]*/.exec(line)[0] + (/\{\s*$/.test(line) ? '  ' : '');
      if (!ind) return;
      e.preventDefault();
      ta.setRangeText('\n' + ind, s, ta.selectionEnd, 'end');
      ta.dispatchEvent(new Event('input'));
    }
  });
  function setCode(v) { ta.value = v; badLine = null; paint(); }

  // Symbol keys under the slate (phones hide brackets and quotes).
  function renderKeys() {
    $('#keys').innerHTML = (M.keys || DEFAULT_KEYS).map(function (k, i) {
      return '<button type="button" data-k="' + i + '"' + (k.tpl ? ' class="tpl"' : '') + (k.ins === '\n' ? ' aria-label="نئی لائن"' : '') + '>' + esc(k.t) + '</button>';
    }).join('');
  }
  $('#keys').addEventListener('pointerdown', function (e) { if (e.target.closest('button')) e.preventDefault(); }); // keep the phone keyboard open
  $('#keys').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var k = (M.keys || DEFAULT_KEYS)[+b.dataset.k];
    var ins = k.ins.replace(/\n/g, '\n' + indentHere()), at = ins.indexOf('|');
    ins = ins.replace('|', '');
    var s = ta.selectionStart, en = ta.selectionEnd;
    ta.focus();
    ta.setRangeText(ins, s, en, 'end');
    if (at >= 0) ta.setSelectionRange(s + at, s + at);
    ta.dispatchEvent(new Event('input'));
  });

  // ---------- Parsons puzzle ----------
  function pz(L) { return (L || LV[S.cur]).task.parsons; }
  function orderedCode(P, order) { return (P.prefix ? P.prefix + '\n' : '') + order.map(function (i) { return P.lines[i]; }).join('\n'); }
  function taskStart(L) { return pz(L) ? orderedCode(pz(L), pz(L).order) + '\n' : L.task.starter; }
  $('#reset').onclick = function () {
    var s = st();
    Live.stop();
    if (inParsonsStep()) { s.order = null; save(); renderParsons(); return; }
    setCode(taskStart(LV[S.cur])); s.code = null; save();
  };
  function inParsonsStep() { return stepKind() === 'puzzle'; }
  function currentOrder() { return st().order || pz().lines.map(function (_, i) { return i; }); }
  function renderParsons(moved) {
    var P = pz(), order = currentOrder();
    var fixed = P.prefix ? P.prefix.split('\n').map(function (l) { return '<li class="fixed"><span class="ln">' + esc(l) + '</span><span class="lock" aria-label="یہ لائن اپنی جگہ پر ہے">📌</span></li>'; }).join('') : '';
    $('#parsons').innerHTML = fixed + order.map(function (li, pos) {
      return '<li' + (pos === moved ? ' class="moved"' : '') + '><span class="ln">' + esc(P.lines[li]) + '</span>' +
        '<button type="button" data-mv="-1" data-pos="' + pos + '" aria-label="اوپر"' + (pos === 0 ? ' disabled' : '') + '>▲</button>' +
        '<button type="button" data-mv="1" data-pos="' + pos + '" aria-label="نیچے"' + (pos === order.length - 1 ? ' disabled' : '') + '>▼</button></li>';
    }).join('');
  }
  $('#parsons').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var pos = +b.dataset.pos, to = pos + (+b.dataset.mv), order = currentOrder().slice();
    var t = order[pos]; order[pos] = order[to]; order[to] = t;
    st().order = order; save();
    renderParsons(to);
    var rows = $('#parsons').querySelectorAll('li:not(.fixed)'), row = rows[to], nb = row.querySelector('[data-mv="' + b.dataset.mv + '"]');
    (nb && !nb.disabled ? nb : row.querySelector('button:not(:disabled)')).focus();
  });

  // ---------- modules ----------
  function useModule(mi) {
    if (!MODS[mi]) mi = 0;
    S.mod = mi; M = MODS[mi]; LV = M.levels;
    var sg = M.stage || {};
    $('#app').dataset.draw = !!sg.draw;
    $('#wall-wrap').hidden = sg.draw !== true; // 'auto': the wall appears only when something is drawn
    renderKeys();
  }

  // ================= FIRST VISIT =================
  // Three small screens: Birdy says hello, the child types a name, Birdy is happy.
  var onbBird = null;
  function onboarding(stage) {
    show('onb');
    var el = $('#scr-onb'), h;
    if (stage === 'hello') {
      h = '<div class="onb-hero"><div class="bird-spot hero" id="onb-bird"></div></div>' +
        '<div class="onb-body"><div class="chat">' + C.welcome.map(function (t, i) { return '<p class="say" style="--i:' + i + '">' + rich(t) + '</p>'; }).join('') + '</div></div>' +
        '<div class="onb-foot"><button type="button" class="big primary" id="onb-go">السلام علیکم، برڈی! 👋</button></div>';
    } else if (stage === 'name') {
      h = '<div class="onb-hero small"><div class="bird-spot hero" id="onb-bird"></div></div>' +
        '<form class="onb-body name-form" id="name-form"><label for="name-in" class="q-big">' + C.askName + '</label>' +
        '<input id="name-in" dir="ltr" lang="en" autocomplete="given-name" autocapitalize="words" spellcheck="false" maxlength="20" placeholder="Ali">' +
        '<p class="help" id="name-help">' + C.askNameHelp + '</p></form>' +
        '<div class="onb-foot"><button type="submit" form="name-form" class="big primary" id="onb-go" disabled>آگے</button></div>';
    } else {
      h = '<div class="onb-hero"><div class="bird-spot hero" id="onb-bird"></div><div class="feathers" id="onb-feathers" aria-hidden="true"></div></div>' +
        '<div class="onb-body"><div class="chat"><p class="say big-say">آپ سے مل کر خوشی ہوئی، ' + nameHtml() + '! 🎉</p>' +
        '<p class="say" style="--i:1">پہلا سبق بہت آسان ہے۔ چلیں شروع کریں!</p></div></div>' +
        '<div class="onb-foot"><button type="button" class="big primary" id="onb-go">پہلا سبق شروع کریں</button></div>';
    }
    el.innerHTML = h;
    onbBird = Mithu($('#onb-bird'));
    if (stage === 'hello') { onbBird.mood('wave', 2600); Narrator.say(C.welcomeEn, onbBird); $('#onb-go').onclick = function () { onboarding('name'); }; }
    else if (stage === 'name') {
      onbBird.mood('think');
      Narrator.say(C.askNameEn, onbBird);
      var inp = $('#name-in'), go = $('#onb-go');
      inp.value = S.name || '';
      function clean(v) { return v.replace(/[^A-Za-z .'-]/g, '').replace(/\s+/g, ' ').replace(/^\s+/, ''); }
      function check() {
        var bad = /[^A-Za-z .'\-\s]/.test(inp.value);
        if (bad) { inp.value = clean(inp.value); $('#name-help').textContent = 'صرف انگریزی حروف (A سے Z) لکھیں۔'; $('#name-help').classList.add('warn'); }
        go.disabled = !inp.value.trim();
      }
      inp.addEventListener('input', check);
      check();
      setTimeout(function () { inp.focus(); }, 300);
      $('#name-form').onsubmit = function (e) {
        e.preventDefault();
        var v = inp.value.trim().replace(/\b[a-z]/g, function (c) { return c.toUpperCase(); });
        if (!v) return;
        S.name = v; if (!S.certName) S.certName = v; save();
        onboarding('met');
      };
    } else {
      onbBird.mood('happy', 2400);
      feathers($('#onb-feathers'));
      Narrator.withName(S.name + '!', C.metEn, onbBird);
      $('#onb-go').onclick = function () {
        var n = nextUp() || { mi: 0, li: 0 };
        startLevel(n.mi, n.li);
      };
    }
  }

  // ================= HOME =================
  var homeMsg = null; // what Birdy says on the home screen next time it opens
  function renderHome() {
    useModule(S.mod);
    $('#hello-title').innerHTML = (homeMsg && homeMsg.title) || ('خوش آمدید، ' + nameHtml() + '!');
    $('#hello-sub').textContent = (homeMsg && homeMsg.sub) || (nextUp() ? 'آئیں، جاری رکھیں۔' : 'آپ نے سارا کورس مکمل کر لیا!');
    $('#streak-n').textContent = streakNow();
    $('#stars-n').textContent = starsTotal();
    $('#stat-streak').setAttribute('aria-label', streakNow() + ' دن لگاتار');
    $('#stat-stars').setAttribute('aria-label', starsTotal() + ' ستارے');
    var up = nextUp();
    var OFF = [0, 1, 2, 1, 0, -1, -2, -1]; // zig-zag
    var h = '';
    MODS.forEach(function (m, mi) {
      var open = modOpen(mi), done = modDone(mi);
      h += '<section class="unit' + (open ? '' : ' locked') + (done ? ' done' : '') + '" data-u="' + mi + '" style="--u:' + mi + '">' +
        '<div class="unit-head"><div><span class="unit-n">ماڈیول ' + m.number + '</span><h2>' + esc(m.title) + '</h2></div>' +
        '<button type="button" class="guide" data-guide="' + mi + '"' + (open ? '' : ' disabled') + '><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5C6.5 4 9.5 4 12 6c2.5-2 5.5-2 8-.5V19c-2.5-1.5-5.5-1.5-8 .5-2.5-2-5.5-2-8-.5z M12 6v13.5" /></svg><span>سبق</span></button></div>' +
        '<ol class="nodes">';
      m.levels.forEach(function (L, li) {
        var isUp = up && up.mi === mi && up.li === li, lo = levelOpen(mi, li), d = lvDone(L), s = S.lv[L.id] || {};
        var cls = 'node' + (d ? ' done' : '') + (isUp ? ' up' : '') + (lo ? '' : ' locked') + (L.make ? ' make' : '');
        var inner = d ? CHECK_ICON : lo ? (L.make ? '✨' : PLAY_ICON) : LOCK_ICON;
        var stars = d ? '<span class="nstars" aria-hidden="true">' + [1, 2, 3].map(function (k) { return '<i' + (k <= (s.stars || 0) ? ' class="on"' : '') + '>★</i>'; }).join('') + '</span>' : '';
        var started = isUp && (s.at || 0) > 0;
        h += '<li style="--off:' + OFF[(li + mi * 5) % OFF.length] + '">' +
          (isUp ? '<span class="start-tip" aria-hidden="true">' + (started ? 'جاری رکھیں' : 'شروع') + '</span>' : '') +
          '<button type="button" class="' + cls + '" data-mi="' + mi + '" data-li="' + li + '"' + (lo ? '' : ' disabled') +
          ' aria-label="لیول ' + L.id + '، ' + esc(L.title) + (d ? '، مکمل' : lo ? '' : '، بند') + '"' + (isUp ? ' aria-current="step"' : '') + '>' +
          '<span class="disc">' + inner + '</span></button>' + stars +
          '<span class="nlbl">' + esc(L.short) + '</span></li>';
      });
      h += '</ol>';
      if (done) h += '<div class="unit-badge"><span class="medal"><span class="bird-spot"></span></span><span><b>' + esc(m.badge.name) + '</b></span></div>';
      h += '</section>';
    });
    h += '<div class="trophy' + (allDone() ? ' won' : '') + '"><button type="button" class="node trophy-btn" data-cert' + (allDone() || PREVIEW ? '' : ' disabled') + ' aria-label="سند"><span class="disc">🎓</span></button><span class="nlbl">سند</span></div>';
    $('#path').innerHTML = h;
    $$('#path .medal .bird-spot').forEach(function (el) { Mithu(el); });
    var cb = $('#continue-btn');
    if (up) {
      var L = MODS[up.mi].levels[up.li], started2 = ((S.lv[L.id] || {}).at || 0) > 0;
      cb.innerHTML = (started2 ? 'جاری رکھیں' : 'شروع کریں') + ' <span class="cb-sub">لیول ' + L.id + ' · ' + esc(L.short) + '</span>';
      cb.onclick = function () { startLevel(up.mi, up.li); };
    } else {
      cb.innerHTML = '🎓 میری سند';
      cb.onclick = openCertificate;
    }
    homeMsg = null;
  }
  function goHome(msg, speak) {
    closeLesson();
    homeMsg = msg || null;
    show('home');
    renderHome();
    meBird.mood(msg && msg.mood || 'wave', 2200);
    if (speak) Narrator.withName(S.name + '!', speak, meBird);
    // bring the next level into view
    var up = $('#path .node.up');
    if (up) setTimeout(function () { up.scrollIntoView({ block: 'center', behavior: motion() }); }, 120);
  }
  $('#path').addEventListener('click', function (e) {
    var g = e.target.closest('[data-guide]');
    if (g) { openGuide(+g.dataset.guide, 'lesson'); return; }
    if (e.target.closest('[data-cert]')) { openCertificate(); return; }
    var n = e.target.closest('.node[data-mi]'); if (!n || n.disabled) return;
    startLevel(+n.dataset.mi, +n.dataset.li);
  });
  $('#me-btn').onclick = function () {
    openSheet({
      title: 'میرا نام',
      body: '<label class="cert-in">اپنا نام انگریزی حروف میں لکھیں:<input id="rename-in" dir="ltr" autocomplete="off" autocapitalize="words" maxlength="20" value="' + esc(S.name) + '"></label>',
      actions: [{ label: 'محفوظ کریں', cls: 'primary', onClick: function () {
        var v = $('#rename-in').value.replace(/[^A-Za-z .'-]/g, '').trim();
        if (v) { if (S.certName === S.name) S.certName = v; S.name = v; save(); }
        sheet.close(); renderHome();
      } }]
    });
  };

  // ================= LESSON =================
  // Steps: teach (sentences one by one) → show (Birdy runs the example) → guess → puzzle → code → done.
  function stepsFor(L) {
    var a = ['teach', 'show'];
    if (L.guess) a.push('guess');
    var P = L.task.parsons;
    if (P) a.push('puzzle');
    if (!P || !P.final) a.push('code');
    a.push('done');
    return a;
  }
  var inLesson = false;
  function stepKind() { if (!inLesson) return null; var a = stepsFor(LV[S.cur]); return a[Math.min(st().at, a.length - 1)]; }

  function startLevel(mi, li) {
    Narrator.stop();
    forgetDiag();
    useModule(mi);
    S.cur = li; S.curBy[M.id] = li;
    var s = st();
    if (s.done && s.at >= stepsFor(LV[li]).length - 1) { s.at = 0; s.said = 0; } // replay a finished level from the start
    save();
    if (!inLesson) history.pushState({ lesson: true }, '');
    inLesson = true;
    show('lesson');
    renderStep();
  }
  function closeLesson() {
    if (!inLesson) return;
    inLesson = false;
    Live.stop(); Narrator.stop(); clearStage(); closeResult(); park();
    if (history.state && history.state.lesson) history.back();
  }
  window.addEventListener('popstate', function () { if (inLesson) { inLesson = false; Live.stop(); Narrator.stop(); clearStage(); closeResult(); park(); show('home'); renderHome(); } });
  $('#ls-close').onclick = function () { goHome(); };

  function next() {
    var s = st(), a = stepsFor(LV[S.cur]);
    if (s.at < a.length - 1) s.at++;
    save();
    renderStep();
  }

  function setBar() {
    var L = LV[S.cur], s = st(), a = stepsFor(L), n = a.length - 1, k = a[s.at];
    var sub = k === 'teach' ? (s.said + 1) / (L.learn.say.length + 1) : 0;
    var pct = Math.round(Math.min(1, (s.at + sub) / n) * 100);
    $('#ls-bar i').style.width = pct + '%';
    $('#ls-bar').setAttribute('aria-valuenow', pct);
  }

  function speakBtn(key) { return '<button type="button" class="speak" data-speak="' + key + '" aria-label="سنیں"' + (Narrator.ready() ? '' : ' hidden') + '>' + SPEAK_ICON + '</button>'; }
  function head(title, key) {
    return '<div class="step-head"><h1 id="step-title" tabindex="-1">' + title + '</h1>' + (key ? speakBtn(key) : '') + '</div>';
  }
  function codeBlock(code, flow) {
    return '<div class="example' + (flow ? ' flow' : '') + '"><pre dir="ltr">' + code.split('\n').map(function (l, i) {
      return '<span class="ex-line"><span class="ex-n">' + (i + 1) + '</span>' + highlightLine(l) + '</span>';
    }).join('') + '</pre>' + (flow ? '<span class="flow-lbl"><span aria-hidden="true">↓</span> اوپر سے نیچے</span>' : '') + '</div>';
  }
  function tokKind(t) {
    if (/^["']/.test(t)) return 'str';
    if (/^-?\d/.test(t)) return 'num';
    if (/^(let|const|var|for|if|else|while|function|return|true|false)$/.test(t)) return 'kw';
    if (E.COMMANDS[t] != null || /^console\.log$/.test(t)) return 'cmd';
    if (/^[^\w$"']+$/.test(t)) return 'sym';
    return 'name';
  }
  function anatomy(parts) {
    return '<div class="anatomy-wrap"><div class="anatomy" dir="ltr">' + parts.map(function (pt, i) {
      return '<div class="part k-' + tokKind(pt.t) + '" style="--i:' + i + '"><code class="tok">' + esc(pt.t) + '</code><span class="plbl" dir="rtl">' + esc(pt.l) + '</span></div>';
    }).join('') + '</div></div>';
  }
  function badgeHtml(m) {
    return '<div class="badge-card"><span class="medal"><span class="bird-spot"></span></span><div><b>' + esc(m.badge.name) + '</b><span>' + esc(m.badge.line) + '</span></div></div>';
  }
  function foot(html) { $('#ls-foot').innerHTML = html; }
  function narration(key) {
    var V = LV[S.cur].voice || {};
    if (key === 'code') return V.task || V.taskA;
    if (key === 'puzzle') return V.taskA;
    if (key === 'teach') return V.learn;
    if (key === 'done') return V.recap;
    return V[key];
  }

  function renderStep(quiet) {
    var L = LV[S.cur], s = st(), a = stepsFor(L);
    if (s.at > a.length - 1) s.at = a.length - 1;
    var k = a[s.at], body = $('#ls-body'), h = '';
    Live.stop(); closeResult(); park(); clearStage();
    $('#app').dataset.step = k;
    $('#ls-book').hidden = !(k === 'code' || k === 'puzzle');
    setBar();
    body.scrollTop = 0; window.scrollTo(0, 0);

    if (k === 'teach') {
      h = '<p class="lvl-chip">لیول ' + L.id + ' · ' + esc(L.title) + '</p>' +
        '<div class="teach-row"><div class="bird-spot talker" id="talker"></div><div class="chat" id="chat">' +
        L.learn.say.slice(0, s.said + 1).map(function (t, i) { return '<p class="say' + (i === s.said ? ' new' : '') + '">' + rich(t) + '</p>'; }).join('') +
        '</div>' + speakBtn('teach') + '</div>';
      body.innerHTML = h;
      var talker = Mithu($('#talker'));
      talker.mood('wave', 1600);
      foot('<button type="button" class="big primary" data-act="more">آگے</button>');
      teachBird = talker;
      if (!quiet && s.said === 0) teachAlong(L, talker);
    } else if (k === 'show') {
      h = head('دیکھیں، برڈی کیسے کرتا ہے') + (L.learn.parts ? anatomy(L.learn.parts) : codeBlock(L.learn.example, L.learn.flow)) +
        '<div class="slot" id="slot-stage"></div><p class="demo-note" id="demo-note" hidden></p>';
      body.innerHTML = h;
      place('#stage', $('#slot-stage'));
      bubble('نیچے والا بٹن دبائیں، میں کر کے دکھاتا ہوں!', true);
      renderShowFoot();
    } else if (k === 'guess') {
      var G = L.guess;
      h = head('اندازہ لگائیں 🤔', 'guess') + '<p class="q">' + rich(G.q) + '</p>' + codeBlock(G.code) +
        '<div class="opts" role="radiogroup" aria-label="اندازہ">' + G.options.map(function (o, i) {
          var cls = 'opt' + (s.revealed && i === G.correct ? ' right' : '') + (s.revealed && i === s.guess && i !== G.correct ? ' wrong' : '');
          var label = isLatin(o) ? '<span class="en" dir="ltr">' + esc(o) + '</span>' : rich(o);
          return '<button type="button" role="radio" class="' + cls + '" data-o="' + i + '" aria-checked="' + (s.guess === i) + '"' + (s.revealed ? ' disabled' : '') + '><span class="okey">' + (i + 1) + '</span>' + label + '</button>';
        }).join('') + '</div>' +
        (s.revealed ? '<div class="why ' + (s.guess === G.correct ? 'yes' : 'no') + '"><p>' + rich(G.why) + '</p></div>' : '');
      body.innerHTML = h;
      renderGuessFoot();
      if (!quiet && !s.revealed) Narrator.say(narration('guess'));
    } else if (k === 'puzzle' || k === 'code') {
      var K = k === 'puzzle' ? pz(L) : L.task;
      h = head(k === 'puzzle' ? 'لائنیں ترتیب سے لگائیں' : (L.make ? 'اب اپنی چیز بنائیں! ✨' : 'اب آپ کی باری! ✏️'), k) +
        '<p class="intro">' + rich(K.intro) + '</p><ol class="steps">' +
        K.steps.map(function (t) { return '<li><span>' + rich(t) + '</span></li>'; }).join('') + '</ol>' +
        '<div class="slot" id="slot-slate"></div>';
      body.innerHTML = h;
      var slot = $('#slot-slate');
      place('#slate', slot);
      $('#editor').hidden = k === 'puzzle';
      $('#parsons').hidden = k !== 'puzzle';
      if (k === 'puzzle') renderParsons();
      else {
        place('#keys', slot);
        $$('#keys .tpl').forEach(function (b) { b.hidden = !!L.noTemplateKey; });
        setCode(s.code != null ? s.code : taskStart(L));
      }
      renderDoFoot();
      if (!quiet) Narrator.say(narration(k));
    } else {
      renderDone(L, s);
    }
    if (!quiet) { var t = $('#step-title'); if (t) t.focus({ preventScroll: true }); }
  }
  var teachBird = null;

  // While Birdy reads the lesson aloud, each Urdu bubble appears when the voice reaches it.
  // The English and Urdu sentences do not match one to one, so the timing follows the share of the Urdu text:
  // bubble i appears once the voice has covered the text before it (a little early rather than late).
  function teachAlong(L, talker, force) {
    var says = L.learn.say, total = 0, starts = [];
    says.forEach(function (t) { starts.push(total); total += t.length; });
    Narrator.say(narration('teach'), talker, force, function (f) {
      if (stepKind() !== 'teach' || LV[S.cur] !== L) return;
      var want = 0;
      starts.forEach(function (st0, i) { if (f >= st0 / total - 0.04) want = i; });
      if (f >= 1) want = says.length - 1;
      while (st().said < want) revealNext(L);
    });
  }
  function revealNext(L) {
    var s = st();
    if (s.said >= L.learn.say.length - 1) return false;
    s.said++; save();
    var p = document.createElement('p');
    p.className = 'say new'; p.innerHTML = rich(L.learn.say[s.said]);
    $$('#chat .say').forEach(function (x) { x.classList.remove('new'); });
    $('#chat').appendChild(p);
    p.scrollIntoView({ block: 'nearest', behavior: motion() });
    setBar();
    return true;
  }

  function renderShowFoot() {
    var s = st();
    foot(s.shown
      ? '<button type="button" class="big ghost icon-only" data-act="demo" aria-label="دوبارہ دیکھیں">↻</button><button type="button" class="big primary" data-act="next">آگے</button>'
      : '<button type="button" class="big primary" data-act="demo">' + PLAY_ICON + ' چلا کر دیکھیں</button>');
  }
  function renderGuessFoot() {
    var s = st();
    foot(s.revealed ? '<button type="button" class="big primary" data-act="next">آگے</button>'
      : '<button type="button" class="big primary" data-act="check"' + (s.guess == null ? ' disabled' : '') + '>جانچیں</button>');
  }
  function renderDoFoot() {
    var s = st();
    foot('<button type="button" class="big ghost hint-btn" data-act="hint" aria-label="اشارہ">' + BULB_ICON + '<span>' + (s.hints >= 2 ? 'حل' : 'اشارہ') + '</span></button>' +
      '<button type="button" class="big primary" data-act="run" id="run-btn">' + PLAY_ICON + ' چلاؤ</button>');
  }

  function renderDone(L, s) {
    var isLast = S.cur === LV.length - 1, nextMod = isLast && MODS[S.mod + 1];
    var stars = s.stars || 3;
    var h = '<div class="done-hero"><div class="bird-spot hero" id="done-bird"></div><div class="feathers" id="done-feathers" aria-hidden="true"></div></div>' +
      '<h1 id="step-title" tabindex="-1" class="done-title">' + (isLast ? (nextMod ? 'ماڈیول مکمل! 🏆' : 'کورس مکمل! 🏆') : 'شاباش، ' + nameHtml() + '!') + '</h1>' +
      '<div class="big-stars" aria-label="' + stars + ' ستارے">' + [1, 2, 3].map(function (k) { return '<span class="' + (k <= stars ? 'on' : '') + '" style="--i:' + k + '">★</span>'; }).join('') + '</div>' +
      '<div class="learned"><p class="learned-lbl">آج آپ نے سیکھا:</p><p class="recap">' + rich(L.recap) + '</p>' + speakBtn('done') + '</div>' +
      (isLast ? badgeHtml(M) + (M.next ? '<p class="next-line">' + M.next + '</p>' : '') : '');
    $('#ls-body').innerHTML = h;
    var db = Mithu($('#done-bird'));
    db.mood('happy', 3000);
    feathers($('#done-feathers'));
    $$('#ls-body .medal .bird-spot').forEach(function (el) { Mithu(el); });
    foot(isLast && !nextMod
      ? '<button type="button" class="big primary" data-act="cert">🎓 میری سند</button>'
      : '<button type="button" class="big primary" data-act="home">جاری رکھیں</button>');
    Narrator.withName('Well done, ' + S.name + '!', narration('done'), db);
  }

  // Taps inside the lesson
  $('#scr-lesson').addEventListener('click', function (e) {
    var L = LV[S.cur], s = st();
    var sp = e.target.closest('[data-speak]');
    if (sp) {
      if (sp.dataset.speak === 'teach') teachAlong(L, teachBird, true);
      else Narrator.say(narration(sp.dataset.speak), bird, true);
      return;
    }
    var o = e.target.closest('.opt');
    if (o && !s.revealed) {
      s.guess = +o.dataset.o; save();
      $$('.opt').forEach(function (b) { b.setAttribute('aria-checked', b === o); });
      renderGuessFoot();
      return;
    }
    var a = e.target.closest('[data-act]'); if (!a || a.disabled) return;
    var act = a.dataset.act;
    if (act === 'more') {
      if (!revealNext(L)) next(); // the child can move ahead of the voice
    } else if (act === 'next') next();
    else if (act === 'demo') {
      a.disabled = true;
      demo(L.learn.example).then(function (ok) {
        if (stepKind() !== 'show' || LV[S.cur] !== L) return;
        if (ok) { s.shown = true; save(); }
        renderShowFoot();
        var n = $('#ls-foot .primary'); if (n) n.focus({ preventScroll: true });
      });
    } else if (act === 'check') checkGuess(L, s);
    else if (act === 'run') run();
    else if (act === 'hint') openHint();
    else if (act === 'home') {
      var up = nextUp();
      goHome({ title: 'شاباش، ' + nameHtml() + '! 🎉', sub: up ? 'اگلا لیول کھل گیا ہے۔' : 'آپ نے سارا کورس مکمل کر لیا!', mood: 'happy' });
    } else if (act === 'cert') openCertificate();
  });
  $('#ls-book').onclick = function () { openGuide(S.mod, 'commands'); };

  // ---------- guess: pick, check, see Birdy run it ----------
  function checkGuess(L, s) {
    if (busy || s.guess == null) return;
    var G = L.guess, right = s.guess === G.correct;
    openResult();
    demo(G.code, true).then(function (ok) {
      if (!ok || LV[S.cur] !== L || stepKind() !== 'guess') return;
      s.revealed = true; save();
      // mark the answers in place (re-rendering the step would clear the stage)
      $$('.opt').forEach(function (b, i) {
        b.disabled = true;
        if (i === G.correct) b.classList.add('right');
        else if (i === s.guess) b.classList.add('wrong');
      });
      verdict(right ? 'ok' : 'try', right ? pick(['بالکل ٹھیک!', 'زبردست!', 'بالکل ٹھیک، ' + nameHtml() + '!']) : 'اچھی کوشش!',
        (right ? '' : 'صحیح جواب: <b>' + (isLatin(G.options[G.correct]) ? '<bdi dir="ltr">' + esc(G.options[G.correct]) + '</bdi>' : rich(G.options[G.correct])) + '</b><br>') + rich(G.why),
        [{ label: 'آگے', cls: 'primary', act: next }]);
      Narrator.say(L.voice && L.voice.why);
      // A guess about broken code: Birdy's "I did not understand" must not sound like a reply to the child's answer.
      if (demoFailed) bubble(right ? 'بالکل ٹھیک! اس کوڈ میں کمی ہے، اسی لیے میں سمجھ نہیں پایا۔' : 'اس کوڈ میں کمی ہے، اسی لیے میں سمجھ نہیں پایا۔', true);
      bird.mood(right ? 'happy' : 'think', 1800);
    });
  }

  // ---------- result panel ----------
  function openResult(keepStage) {
    var r = $('#result');
    if (!keepStage) {
      place('#stage', $('#res-stage'));
      $('#res-verdict').hidden = true;
      $('#res-foot').hidden = true;
      $('.res-inner').scrollTop = 0;
      r.dataset.kind = 'run';
    }
    r.hidden = false;
    $('#app').classList.add('has-result');
  }
  function closeResult() {
    $('#result').hidden = true;
    $('#app').classList.remove('has-result');
  }
  // kind: ok | try | nudge | err
  function verdict(kind, title, msg, buttons, tests, raw) {
    var r = $('#result');
    r.dataset.kind = kind;
    $('#res-verdict').hidden = false;
    $('#res-ico').textContent = { ok: '✓', nudge: '!', try: '↻', err: '🩺' }[kind] || '';
    $('#res-title').innerHTML = title;
    $('#res-msg').innerHTML = msg || '';
    $('#res-raw').hidden = !raw;
    $('#res-raw-text').textContent = raw || '';
    var tl = $('#res-tests');
    tl.hidden = !(tests && tests.length);
    tl.innerHTML = (tests || []).map(function (t) {
      return '<li class="' + (t.ok ? 'ok' : 'no') + '"><span class="mark" aria-hidden="true">' + (t.ok ? '✓' : '✗') + '</span><span class="tl">' + rich(t.label) + '</span>' +
        (t.got != null && t.got !== '' ? '<span class="got" dir="ltr">‎' + esc(t.got) + '</span>' : '') + '<span class="sr">' + (t.ok ? 'ٹھیک' : 'غلط') + '</span></li>';
    }).join('');
    var f = $('#res-foot');
    f.innerHTML = '';
    f.hidden = !(buttons && buttons.length);
    (buttons || []).forEach(function (b) {
      var el = document.createElement('button');
      el.type = 'button'; el.className = 'big ' + (b.cls || 'ghost'); el.innerHTML = b.label;
      el.onclick = b.act;
      f.appendChild(el);
    });
    // on phones the verdict sits under the stage: bring it into view (not while a game is running: the game is the reward)
    setTimeout(function () {
      var inner = $('.res-inner');
      if (!Live.s && inner.scrollHeight > inner.clientHeight) inner.scrollTo({ top: inner.scrollHeight, behavior: motion() });
      var first = f.querySelector('.primary') || f.querySelector('button'); if (first) first.focus({ preventScroll: true });
    }, 60);
  }
  function tryAgain() {
    Live.stop();
    closeResult();
    if (!inParsonsStep()) {
      if (badLine) { var lines = ta.value.split('\n'), at = 0; for (var i = 0; i < badLine - 1; i++) at += lines[i].length + 1; ta.setSelectionRange(at, at); }
      ta.focus({ preventScroll: true });
      $('#slate').scrollIntoView({ block: 'nearest', behavior: motion() });
    }
  }

  // ---------- stage ----------
  function clearStage() {
    playToken++;
    $('#said').innerHTML = ''; saidDropped = 0; $('#said').style.counterReset = '';
    $('#said-wrap').hidden = true;
    $('#bubble').hidden = true;
    Stage.reset();
    if ((M.stage || {}).draw === 'auto') $('#wall-wrap').hidden = true;
    bird.talk(false);
  }
  function bubble(text, ur) {
    var b = $('#bubble');
    b.hidden = false;
    b.classList.toggle('ur', !!ur);
    b.style.animation = 'none'; void b.offsetWidth; b.style.animation = '';
    $('#bubble-text').textContent = text;
  }
  function addSaid(o) {
    $('#said-wrap').hidden = false;
    var ol = $('#said'), li = document.createElement('li');
    li.className = o.kind === 'log' ? 'log' : '';
    var type = o.vtype === 'number' ? '<span class="type num">نمبر</span>' : o.vtype === 'string' ? '<span class="type">الفاظ</span>' : '';
    li.innerHTML = '<span class="val">' + esc(o.value === '' ? ' ' : o.value) + '</span>' + type;
    ol.appendChild(li);
    while (ol.children.length > 40) { ol.removeChild(ol.firstChild); saidDropped++; }
    ol.style.counterReset = 'said ' + saidDropped; // numbers keep matching the program's turns
  }
  var saidDropped = 0;

  // Plays what the program did, slowly enough to follow: words, shapes one by one, boxes changing.
  var playToken = 0;
  async function playEvents(events) {
    var token = ++playToken, t0 = Date.now(), slow = 0;
    var nOut = 0, nShape = 0, nBox = 0;
    events.forEach(function (e) { if (e.t === 'out') nOut++; else if (e.t === 'shape') nShape++; else if (e.t === 'box') nBox++; });
    var fast = nOut > 6, shapeWait = nShape ? Math.min(240, 1600 / nShape) : 0, boxWait = nBox > 12 ? 80 : 420;
    for (var i = 0; i < events.length; i++) {
      if (token !== playToken) return;
      var e = events[i];
      if (slow > 60 || Date.now() - t0 > 5000) { applyNow(events.slice(i)); break; }
      if (e.t === 'out' || e.t === 'box') slow++;
      if (e.t === 'out') {
        addSaid(e);
        if (e.kind === 'say') {
          bubble(String(e.value), !isLatin(String(e.value)));
          bird.mood('idle'); bird.talk(true);
          await sleep(fast ? 280 : Math.min(1400, 520 + String(e.value).length * 28));
          bird.talk(false);
          await sleep(fast ? 60 : 160);
        } else await sleep(fast ? 120 : 380);
      } else if (e.t === 'shape') { showWall(); Stage.add(e.s); if (shapeWait >= 4) await sleep(shapeWait); }
      else if (e.t === 'bg') { showWall(); Stage.bg(e.color); if (shapeWait >= 4) await sleep(120); }
      else if (e.t === 'box') { Stage.box(e.name, e.value, e.vtype, true); await sleep(boxWait); }
      else if (e.t === 'kite') { showWall(); Stage.kite(e.x, e.y); }
      else if (e.t === 'jump') { bird.mood('happy', 900); await sleep(450); }
    }
    if (!nOut) $('#bubble').hidden = true;
  }
  function showWall() { if ((M.stage || {}).draw && $('#wall-wrap').hidden) { $('#wall-wrap').hidden = false; Stage.size(); } }
  function applyNow(events) {
    events.forEach(function (e) {
      if (e.t === 'shape' || e.t === 'bg' || e.t === 'kite') showWall();
      if (e.t === 'out') { addSaid(e); if (e.kind === 'say') { bubble(String(e.value), !isLatin(String(e.value))); bird.talk(true); clearTimeout(applyNow.t); applyNow.t = setTimeout(function () { bird.talk(false); }, 500); } }
      else if (e.t === 'shape') Stage.add(e.s);
      else if (e.t === 'bg') Stage.bg(e.color);
      else if (e.t === 'box') Stage.box(e.name, e.value, e.vtype, false);
      else if (e.t === 'kite') Stage.kite(e.x, e.y);
      else if (e.t === 'jump') bird.mood('happy', 700);
    });
  }

  // A program that keeps running (onClick, onKey, forever).
  var Live = {
    s: null, code: '',
    start: function (session, code) {
      this.stop();
      this.s = session; this.code = code;
      var u = session.uses;
      showWall(); $('#wall-wrap').hidden = false;
      $('#livebar').hidden = false;
      $('#live-text').textContent = u.forever && u.keys.length ? 'کھیل چل رہا ہے! تیر والے بٹن دبائیں۔'
        : u.keys.length ? 'پروگرام چل رہا ہے: تیر والے بٹن دبائیں۔'
        : u.click ? 'پروگرام چل رہا ہے: اسٹیج پر کلک کریں۔' : 'پروگرام چل رہا ہے۔';
      $('#pad').hidden = !u.keys.length;
      $$('#pad button').forEach(function (b) { b.disabled = u.keys.indexOf(b.dataset.key) < 0; });
      $('#wall-wrap').classList.toggle('tappable', u.click);
      $('#result').classList.add('is-live'); Stage.size();
      if (u.keys.length && document.activeElement === ta) ta.blur();
      var first = null, sync = true;
      session.onBatch(function (events, err) {
        applyNow(events);
        if (!err) return;
        Live.stop();
        var d = Doctor.explain(err, code);
        if (sync) first = d; else showError(d);
      });
      sync = false;
      return first;
    },
    stop: function () {
      if (this.s) this.s.stop();
      this.s = null;
      $('#livebar').hidden = true; $('#pad').hidden = true;
      $('#wall-wrap').classList.remove('tappable');
      $('#result').classList.remove('is-live');
    }
  };
  $('#live-stop').onclick = function () { Live.stop(); };
  Stage.onTap(function (x, y) { if (Live.s && Live.s.uses.click) Live.s.click(x, y); });
  $('#pad').addEventListener('click', function (e) { var b = e.target.closest('[data-key]'); if (b && Live.s) Live.s.key(b.dataset.key); });
  document.addEventListener('keydown', function (e) {
    if (!Live.s || Live.s.uses.keys.indexOf(e.key) < 0) return;
    if (e.target.closest && e.target.closest('textarea, input, dialog')) return;
    e.preventDefault();
    Live.s.key(e.key);
  });

  // Questions asked with ask()/askNumber(): the child answers before the program runs.
  async function answersFor(code) {
    var re = /\b(askNumber|ask)\s*\(\s*(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)')?/g, m, out = [];
    var text = code.split('\n').map(function (l) { return l.slice(0, E.scanLine(l).cut); }).join('\n');
    while ((m = re.exec(text))) {
      var q = m[2] != null ? m[2] : m[3] != null ? m[3] : '?';
      bubble(q, !isLatin(q)); bird.mood('think');
      var a = await Stage.ask(q, m[1] === 'askNumber');
      if (a === null) return null; // the child left the level
      out.push(a);
    }
    return out;
  }

  // Lint, ask the questions, run, play. Returns {diag} or {r}.
  async function execute(code) {
    var diag = Doctor.lint(code);
    if (diag) return { diag: diag };
    var L0 = LV[S.cur], K0 = stepKind();
    function moved() { return LV[S.cur] !== L0 || stepKind() !== K0; }
    var answers = await answersFor(code);
    if (answers === null || moved()) return { cancelled: true };
    var res = await Runner.run(code, { boxes: !!(M.stage && M.stage.boxes), answers: answers, live: true });
    if (moved()) { if (res.session) res.session.stop(); return { cancelled: true }; }
    await sleep(250);
    var runaway = res.error && (res.error.code === 'toomuch' || res.error.name === 'Timeout');
    await playEvents(runaway ? res.events.slice(0, 12) : res.events);
    if (moved()) { if (res.session) res.session.stop(); return { cancelled: true }; }
    var r = E.summarize(res);
    if (res.error) return { diag: Doctor.explain(res.error, code), r: r };
    if (res.session) { var early = Live.start(res.session, code); if (early) return { diag: early, r: r }; }
    r.answers = answers;
    return { r: r };
  }

  // Birdy shows an example (show and guess steps). An error here is part of the lesson.
  var busy = false, demoFailed = false; // demoFailed: the last example stopped with an error
  async function demo(code, inResult) {
    demoFailed = false;
    if (busy) return false; busy = true;
    Narrator.stop(); Live.stop();
    clearStage();
    var note = $('#demo-note'); if (note) note.hidden = true;
    if (!inResult) $('#stage').scrollIntoView({ block: 'nearest', behavior: motion() });
    bird.mood('think');
    try {
      var x = await execute(code);
      if (x.cancelled) return false;
      if (x.diag) {
        demoFailed = true;
        bubble('اوہو! میں سمجھ نہیں پایا…', true);
        bird.mood('sad', 2600);
        if (note && !inResult) { note.innerHTML = '<b>دیکھا؟</b> ' + rich(x.diag.msg); note.hidden = false; }
      } else bird.mood('idle');
      return true;
    } finally { busy = false; }
  }

  // ---------- run (puzzle and code steps) ----------
  var lastDiag = null;
  function forgetDiag() { lastDiag = null; }
  function codeNow() { return inParsonsStep() ? orderedCode(pz(), currentOrder()) : ta.value; }

  async function run() {
    var k = stepKind();
    if (busy || (k !== 'code' && k !== 'puzzle')) return;
    var L = LV[S.cur], s = st(), code = codeNow();
    Live.stop();
    if (!code.replace(/\/\/.*$/gm, '').trim()) {
      openResult();
      verdict('nudge', 'تختی خالی ہے', 'اوپر والے قدموں کے مطابق کوڈ لکھیں۔', [{ label: 'ٹھیک ہے', cls: 'primary', act: tryAgain }]);
      bird.mood('think', 1800);
      return;
    }
    busy = true;
    var rb = $('#run-btn'); if (rb) rb.disabled = true;
    Narrator.stop();
    if (document.activeElement === ta) ta.blur(); // close the phone keyboard so the result is visible
    clearStage();
    openResult();
    bird.mood('think');
    try {
      var x = await execute(code);
      if (x.cancelled) { if (LV[S.cur] === L) closeResult(); }
      else if (x.diag) showError(x.diag);
      else await judge(L, s, x.r, code);
    } finally {
      busy = false;
      rb = $('#run-btn'); if (rb) rb.disabled = false;
    }
  }

  function showError(d) {
    badLine = d.line || null;
    if (!inParsonsStep()) paint();
    lastDiag = d;
    openResult(true);
    verdict('err', 'غلطی ڈاکٹر', (d.line ? '<b>لائن ' + d.line + ':</b> ' : '') + rich(d.msg), [{ label: 'ٹھیک کریں', cls: 'primary', act: tryAgain }], null, d.raw);
    bubble('اوہو! کچھ گڑبڑ ہے…', true);
    bird.mood('sad', 2600);
  }

  async function verdictOf(fn, r, code) {
    try { return (await fn(r.outputs, code, r, T)) || { msg: 'کچھ گڑبڑ ہے۔ دوبارہ کوشش کریں۔' }; }
    catch (e) { console.error(e); return { msg: 'برڈی آپ کا کام جانچ نہیں سکا۔ دوبارہ «چلاؤ» دبائیں۔' }; }
  }
  function praise() { return pick(['شاباش، ' + nameHtml() + '!', 'زبردست!', 'کمال کر دیا!', 'بہت خوب، ' + nameHtml() + '!']); }
  async function judge(L, s, r, code) {
    var P = pz(L), v;
    if (P && inParsonsStep()) {
      if (P.check) v = await verdictOf(P.check, r, code);
      else if (P.final) v = await verdictOf(L.task.check, r, code);
      else v = orderedCode(P, currentOrder()) === orderedCode(P, P.order) ? { pass: true } : { msg: P.wrong };
      if (!v.pass) { fail(v, P.wrong); return; }
      if (!P.final) {
        s.step = 1; s.code = null;
        if (P.hints) s.hints = 0; // the code step has new hints
        save();
        verdict('ok', praise(), rich(P.done || 'زبردست ترتیب!'), [{ label: 'آگے', cls: 'primary', act: next }], v.tests);
        bird.mood('happy', 1800);
        return;
      }
    } else {
      if (L.task.tested) { openResult(true); verdict('run', 'آزمائش…', 'کمپیوٹر آپ کا کوڈ آزما رہا ہے…'); }
      v = await verdictOf(L.task.check, r, code);
    }
    if (v.pass) {
      var first = !s.done;
      s.done = true;
      var earned = s.sol ? 1 : s.hints ? 2 : 3;
      s.stars = Math.max(s.stars || 0, earned);
      bumpStreak();
      save();
      verdict('ok', praise(), rich(v.msg || 'آپ نے کر دکھایا!'), [{ label: 'آگے', cls: 'primary', act: next }], v.tests);
      bird.mood('happy', 2200);
      if (first) setBar();
    } else fail(v);
  }
  function fail(v, fallback) {
    var nudge = v.mood === 'nudge';
    verdict(nudge ? 'nudge' : 'try', nudge ? 'تقریباً!' : 'ابھی نہیں', rich(v.msg || fallback || ''), [{ label: 'دوبارہ کوشش', cls: 'primary', act: tryAgain }], v.tests);
    bird.mood(nudge ? 'think' : 'sad', 2200);
  }

  // ---------- sheet (hints, solution, guidebook, name) ----------
  var sheet = $('#sheet');
  function openSheet(o) {
    $('#sheet-title').textContent = o.title;
    $('#sheet-body').innerHTML = o.body;
    $('#sheet-foot').innerHTML = '';
    (o.actions || []).forEach(function (a) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'btn ' + (a.cls || ''); b.textContent = a.label; b.onclick = a.onClick;
      $('#sheet-foot').appendChild(b);
    });
    var tabs = $('#sheet-tabs');
    tabs.hidden = !o.tabs;
    tabs.innerHTML = o.tabs ? o.tabs.map(function (t) {
      return '<button type="button" role="tab" data-tool="' + t.id + '" aria-selected="' + (t.id === o.tab) + '">' + t.label + '</button>';
    }).join('') : '';
    $('#sheet-speak').onclick = function () { Narrator.say(o.speak, bird, true); };
    $('#sheet-speak').hidden = !Narrator.ready() || !o.speak;
    if (!sheet.open) sheet.showModal();
    if (o.onClose) sheet.addEventListener('close', o.onClose, { once: true });
    if (o.speak) Narrator.say(o.speak);
  }
  sheet.addEventListener('close', function () { Narrator.stop(); });
  sheet.addEventListener('click', function (e) {
    if (e.target === sheet || e.target.closest('[data-close]')) { sheet.close(); return; }
    var t = e.target.closest('#sheet-tabs [data-tool]');
    if (t) { openGuide(guideMod, t.dataset.tool); }
  });

  // Hints one at a time; after two, the solution.
  function openHint() {
    var L = LV[S.cur], s = st(), V = L.voice || {}, puzzle = inParsonsStep();
    if (s.hints >= 2) { openSolution(); return; }
    s.hints++; save();
    renderDoFoot();
    var H = (puzzle && pz(L).hints) || L.task.hints, VH = (puzzle && pz(L).hints && V.hintsA) || V.hints;
    var body = H.slice(0, s.hints).map(function (h, i) {
      return '<div class="hint-card"><span class="n">اشارہ ' + (i + 1) + '</span><p>' + rich(h) + '</p></div>';
    }).join('');
    openSheet({
      title: 'اشارہ 💡', body: body, speak: (VH || [])[s.hints - 1],
      actions: s.hints >= 2 ? [{ label: 'ٹھیک ہے', cls: 'primary', onClick: function () { sheet.close(); } }, { label: 'حل دیکھیں', onClick: function () { sheet.close(); openSolution(); } }]
        : [{ label: 'ٹھیک ہے', cls: 'primary', onClick: function () { sheet.close(); } }]
    });
    bird.mood('think', 1500);
  }
  function openSolution() {
    var L = LV[S.cur];
    openSheet({
      title: 'حل', speak: L.voice && L.voice.solution,
      body: '<p>' + rich(L.task.solutionNote) + '</p><pre dir="ltr">' + esc(L.task.solution) + '</pre>',
      actions: [
        { label: 'یہ کوڈ لگائیں اور چلائیں', cls: 'primary', onClick: function () {
          var s = st(), P = pz(L);
          s.sol = true;
          if (P && inParsonsStep()) s.order = P.order.slice();
          else s.code = L.task.solution;
          save();
          sheet.close();
          renderStep(true);
          setTimeout(run, 250);
        } },
        { label: 'پہلے خود کوشش', onClick: function () { sheet.close(); } }
      ]
    });
  }

  // Guidebook: the module's lesson summary and its commands.
  var guideMod = 0;
  var TOOLS = [{ id: 'lesson', label: 'سبق' }, { id: 'commands', label: 'حکم' }];
  function openGuide(mi, id) {
    guideMod = mi;
    var m = MODS[mi], body;
    if (id === 'lesson') body = rich(m.lesson);
    else {
      body = '<ul class="cmd-list">' + MODS.slice(0, mi + 1).map(function (mm, i) {
        return mm.commands.map(function (c) {
          var open = PREVIEW || i < mi || mm.levels.some(function (L, li) { return L.id === c.from && levelOpen(i, li); });
          return '<li class="' + (open ? '' : 'locked') + '"><code dir="ltr">' + esc(c.code) + '</code><span>' + rich(c.ur) + (open ? '' : ' (لیول ' + c.from + ' میں کھلے گا)') + '</span></li>';
        }).join('');
      }).reverse().join('') + '</ul>';
      if (MODS.slice(0, mi + 1).some(function (mm) { return mm.stage && mm.stage.draw; }))
        body += '<p class="doc-empty">' + rich('رنگ انگریزی میں لکھیں، جیسے `"red"`، `"blue"`، `"green"`، `"yellow"`، `"orange"`، `"pink"`، `"purple"`، `"brown"`، `"black"`، `"white"`، `"gold"`، `"skyblue"`، `"navy"`۔') + '</p>';
    }
    openSheet({ title: 'ماڈیول ' + m.number + ' · ' + m.title, body: body, tabs: TOOLS, tab: id });
  }

  // ---------- certificate ----------
  var modal = $('#modal'), modalBird = Mithu($('#modal-bird'));
  function openModal(o) {
    $('#modal-title').innerHTML = o.title;
    $('#modal-text').innerHTML = o.html;
    $('#modal-foot').innerHTML = '';
    o.actions.forEach(function (a) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'btn ' + (a.cls || ''); b.textContent = a.label;
      b.onclick = function () { modal.close(); if (a.onClick) a.onClick(); };
      $('#modal-foot').appendChild(b);
    });
    if (!modal.open) modal.showModal();
    modalBird.mood('happy', 2600);
    feathers($('#feathers'));
    $('#modal-text').querySelectorAll('.medal .bird-spot').forEach(function (el) { Mithu(el); });
  }
  modal.addEventListener('close', function () { Narrator.stop(); });
  function feathers(el) {
    if (!el) return;
    var colors = ['#8EDB7E', '#4DBF62', '#FFD84D', '#FF97AA', '#3E8FD6'], h = '';
    for (var i = 0; i < 18; i++) {
      h += '<i style="left:' + (4 + Math.random() * 92) + '%;--c:' + colors[i % 5] + ';--d:' + (1.8 + Math.random() * 1.4) + 's;--delay:' + (Math.random() * .6) + 's;--x:' + (Math.random() * 80 - 40) + 'px;--r:' + (Math.random() * 400 - 200) + 'deg"></i>';
    }
    el.innerHTML = h;
  }
  function openCertificate() {
    var html = '<div class="cert"><p class="cert-top">سند</p><p class="cert-name" id="cert-name" dir="ltr"></p>' +
      '<p class="cert-line">نے «برڈی کے ساتھ کوڈ» کے سارے ماڈیول مکمل کر لیے۔ <strong>آپ اب پروگرامر ہیں!</strong></p>' +
      '<ul class="cert-badges">' + MODS.map(function (m, i) {
        return '<li class="' + (modDone(i) ? '' : 'todo') + '"><span class="medal"><span class="bird-spot"></span></span><span>' + esc(m.badge.name) + '</span></li>';
      }).join('') + '</ul></div>' +
      '<label class="cert-in">سند پر نام (انگریزی حروف میں):<input id="cert-in" dir="ltr" autocomplete="off" autocapitalize="words" maxlength="40"></label>' +
      '<p class="doc-empty">سند کی تصویر (اسکرین شاٹ) لے کر گھر والوں کو دکھائیں!</p>';
    openModal({ title: 'مبارک ہو، ' + nameHtml() + '! 🎓', html: html, actions: [{ label: 'بہت خوب!', cls: 'primary' }] });
    var inp = $('#cert-in'), out = $('#cert-name');
    function showName() { out.textContent = inp.value.trim() || S.name || 'Your name'; }
    inp.value = S.certName || S.name || '';
    showName();
    inp.addEventListener('input', function () { S.certName = inp.value; save(); showName(); });
  }

  // ---------- start ----------
  Narrator.refresh();
  if (!S.name) onboarding(S.welcomed ? 'name' : 'hello');
  else {
    var returning = Object.keys(S.lv).some(function (k) { return S.lv[k].done || S.lv[k].at; });
    goHome(returning ? { title: 'خوش آمدید، ' + nameHtml() + '! 👋', sub: nextUp() ? 'آئیں، جاری رکھیں۔' : 'آپ نے سارا کورس مکمل کر لیا!' } : null, returning ? C.backEn : null);
  }
})();
