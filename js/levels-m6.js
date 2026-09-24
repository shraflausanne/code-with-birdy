// Module 6: اپنا کھیل بنائیں (Make your own game: functions and events). The last module.
// Every level: learn -> guess (optional) -> task -> recap. Children only ever type English.
// Levels 6.3 to 6.5 are tested by the computer: the check runs the code again with clicks, arrow keys and forever() ticks.
(function () {
  // Where a name is called: outside every function, or inside one. bare = code with strings and comments blanked.
  function callSites(bare, name) {
    var stack = [], pendingFn = false, res = { out: 0, inside: 0 }, i, c;
    var re = new RegExp('^' + name + '\\s*\\(');
    for (i = 0; i < bare.length; i++) {
      var before = bare[i - 1] || ' ';
      if (/[\w$]/.test(before)) continue;
      var rest = bare.slice(i);
      if (/^function\b/.test(rest)) { pendingFn = true; i += 7; continue; }
      c = bare[i];
      if (c === '{') { stack.push(pendingFn); pendingFn = false; }
      else if (c === '}') stack.pop();
      else if (re.test(rest) && !/function\s+$/.test(bare.slice(0, i))) {
        if (stack.indexOf(true) >= 0) res.inside++; else res.out++;
      }
    }
    return res;
  }
  function defines(bare, name) { return new RegExp('\\bfunction\\s+' + name + '\\b').test(bare); }

  // Splits a test run into what happened after each click or key press.
  function afterEach(events, kind) {
    var segs = [], cur = null;
    events.forEach(function (e) {
      if (e.t === kind) { cur = { jumps: 0, says: [] }; segs.push(cur); }
      else if (cur) {
        if (e.t === 'jump') cur.jumps++;
        else if (e.t === 'out') cur.says.push(e.value);
      }
    });
    return segs;
  }
  // The last number in something Mithu said ("Jumps: 3" -> 3).
  function lastNum(v) { var m = /(-?\d+)(?!.*\d)/.exec(String(v)); return m ? +m[1] : null; }

  // Kite position before and after each key press.
  function kiteMoves(events) {
    var pos = null, segs = [];
    events.forEach(function (e) {
      if (e.t === 'kite') { pos = { x: e.x, y: e.y }; if (segs.length) segs[segs.length - 1].after = pos; }
      else if (e.t === 'key') segs.push({ key: e.key, before: pos, after: pos });
    });
    return segs;
  }
  function dir(b, a) {
    if (!b || !a) return 'none';
    var dx = a.x - b.x, dy = a.y - b.y;
    if (!dx && !dy) return 'none';
    if (dx > 0 && !dy) return 'right';
    if (dx < 0 && !dy) return 'left';
    if (dy < 0 && !dx) return 'up';
    if (dy > 0 && !dx) return 'down';
    return 'diag';
  }
  var DIR_UR = { right: 'دائیں', left: 'بائیں', up: 'اوپر', down: 'نیچے', none: 'نہیں ہلی', diag: 'ترچھی' };

  // Shapes of each forever() frame.
  function frames(events) {
    var list = [], cur = null;
    events.forEach(function (e) {
      if (e.t === 'frame') { cur = []; list.push(cur); }
      else if (cur && e.t === 'shape') cur.push(e.s);
    });
    return list;
  }
  function first(shapes, type) { for (var i = 0; i < shapes.length; i++) if (shapes[i].type === type) return shapes[i]; return null; }
  // The score: the `score` box, or the last number written on the stage.
  function scoreOf(r) {
    if (typeof r.boxes.score === 'number') return r.boxes.score;
    var n = null;
    r.shapes.forEach(function (s) { if (s.type === 'text' && lastNum(s.text) !== null) n = lastNum(s.text); });
    return n;
  }
  function many(v, n) { var a = []; for (var i = 0; i < n; i++) a.push(v); return a; }

  // A test run (clicks, keys, ticks) stopped with an error: the Error Doctor's message, with the line.
  function crash(r, code, T, when) {
    var e = r.error, m = /^([A-Za-z_$][\w$]*) is not defined$/.exec(e.message || ''), d;
    if (e.name === 'ReferenceError' && m) {
      var own = (T.bare(code).match(/\b(?:let|function)\s+[A-Za-z_$][\w$]*/g) || []).map(function (s) { return s.split(/\s+/)[1]; });
      var same = own.filter(function (n) { return n !== m[1] && n.toLowerCase() === m[1].toLowerCase(); })[0];
      if (same) d = 'کمپیوٹر بڑے اور چھوٹے حروف میں فرق کرتا ہے۔ `' + m[1] + '` کی جگہ `' + same + '` لکھیں۔';
    }
    d = d || T.explain(e, code) || 'اس لائن کو غور سے دیکھیں، یا اشارہ لیں۔';
    return { msg: when + ' ' + (e.line ? 'لائن ' + e.line + ' میں: ' : '') + d };
  }

  var TREE = 'function drawTree() {\n  rect(190, 250, 20, 80, "brown")\n  circle(200, 230, 40, "green")\n}\n';
  var TREE_X = 'function drawTree(x) {\n  rect(x - 10, 250, 20, 80, "brown")\n  circle(x, 230, 40, "green")\n}\n';
  var SOL4 = 'function goRight() {\n  moveKite(10, 0)\n}\nonKey("ArrowRight", goRight)\n\n' +
    'function goLeft() {\n  moveKite(-10, 0)\n}\nonKey("ArrowLeft", goLeft)\n\n' +
    'function goUp() {\n  moveKite(0, -10)\n}\nonKey("ArrowUp", goUp)\n\n' +
    'function goDown() {\n  moveKite(0, 10)\n}\nonKey("ArrowDown", goDown)';
  var GAME_TOP =
    'let basketX = 200\nlet mangoX = random(20, 380)\nlet mangoY = 0\nlet score = 0\n\n' +
    'onKey("ArrowLeft", function () { basketX = basketX - 20 })\n';
  function game(right, speed, sky, msg) {
    return GAME_TOP +
      'onKey("ArrowRight", function () { basketX = ' + right + ' })\n\n' +
      'forever(function () {\n' +
      '  background("' + (sky || 'skyblue') + '")\n' +
      '  mango(mangoX, mangoY)\n' +
      '  basket(basketX, 360)\n' +
      '  mangoY = mangoY + ' + speed + '   // how fast does the mango fall?\n' +
      '  // && means: both must be true. Is the mango low AND near the basket?\n' +
      '  if (mangoY > 360 && near(mangoX, basketX)) {\n' +
      '    score = score + 1\n' +
      '    mangoY = 0\n' +
      '    mangoX = random(20, 380)\n' +
      '  }\n' +
      '  if (mangoY > 400) {   // the mango hit the ground\n' +
      '    mangoY = 0\n' +
      '    mangoX = random(20, 380)\n' +
      '  }\n' +
      '  text("' + (msg || 'Score: ') + '" + score, 20, 30)\n' +
      '})';
  }

  var M = {
    id: 'm6',
    number: 6,
    title: 'اپنا کھیل بنائیں',
    badge: { name: 'کھیل ساز', line: 'آپ نے اپنا کھیل خود بنا لیا!' },
    stage: { draw: true, boxes: true },

    lesson:
      '<p><strong>ترکیب</strong> (function) آپ کا اپنا بنایا ہوا نیا حکم ہے: `function drawTree() { }`</p>' +
      '<p>ترکیب لکھنے سے کچھ نہیں ہوتا، جب تک آپ اسے <strong>بلائیں</strong> نہیں: `drawTree()`</p>' +
      '<p>ترکیب کو <strong>ان پٹ</strong> بھی دے سکتے ہیں: `drawTree(100)` سے `x` میں 100 آتا ہے۔</p>' +
      '<p>`onClick(whenClicked)`: کلک ہو تو یہ ترکیب چلاؤ۔ `onKey("ArrowRight", goRight)`: یہ بٹن دبے تو یہ ترکیب چلاؤ۔</p>' +
      '<p>`forever(...)` ترکیب کو ہمیشہ، ایک سیکنڈ میں 20 بار چلاتا ہے۔ کھیل ایسے ہی چلتے ہیں!</p>',

    commands: [
      { code: 'function name(x) { }', ur: 'اپنی ترکیب (نیا حکم) بناتا ہے۔ `name(100)` لکھ کر اسے بلائیں۔', from: '6.1' },
      { code: 'jump()', ur: 'برڈی اچھلتا ہے۔', from: '6.3' },
      { code: 'onClick(f)', ur: 'اسٹیج پر کلک ہو تو ترکیب `f` چلاتا ہے۔', from: '6.3' },
      { code: 'moveKite(dx, dy)', ur: 'پتنگ کو ہلاتا ہے: پہلا نمبر دائیں بائیں، دوسرا اوپر نیچے۔', from: '6.4' },
      { code: 'onKey("ArrowUp", f)', ur: 'تیر والا بٹن دبے تو ترکیب `f` چلاتا ہے۔', from: '6.4' },
      { code: 'forever(f)', ur: 'ترکیب کو بار بار، ہمیشہ چلاتا ہے (کھیل کے لیے)۔', from: '6.5' },
      { code: 'mango(x, y)', ur: 'آم بناتا ہے۔', from: '6.5' },
      { code: 'basket(x, y)', ur: 'ٹوکری بناتا ہے۔', from: '6.5' },
      { code: 'near(a, b)', ur: 'پوچھتا ہے: کیا دونوں پاس پاس ہیں؟', from: '6.5' }
    ],

    // Phones lack easy brackets, = and +. No "," key: it sits on the main Android keyboard.
    keys: [
      { t: 'function', ins: 'function |() {\n  \n}', tpl: true },
      { t: '{', ins: '{' }, { t: '}', ins: '}' },
      { t: '(', ins: '(' }, { t: ')', ins: ')' },
      { t: '=', ins: ' = ' }, { t: '+', ins: ' + ' },
      { t: '-', ins: '-' }, { t: '"', ins: '"' },
      { t: '↵', ins: '\n' }
    ],

    levels: [
      {
        id: '6.1', short: 'ترکیب', title: 'درخت کی ترکیب',
        learn: {
          say: [
            'اب اپنا <strong>نیا حکم</strong> بھی بنائیں! اسے <strong>ترکیب</strong> (function) کہتے ہیں۔',
            '`function drawSun()` کے بعد `{ }` کے اندر ترکیب کے حکم لکھیں۔',
            'ترکیب لکھنے سے کچھ نہیں ہوتا۔ جب آپ `drawSun()` لکھ کر اسے <strong>بلائیں</strong>، تب وہ چلتی ہے۔'
          ],
          example: 'function drawSun() {\n  circle(320, 80, 40, "gold")\n}\ndrawSun()'
        },
        guess: {
          q: 'یہ کوڈ چلائیں تو اسٹیج پر کتنے درخت بنیں گے؟',
          code: 'background("skyblue")\n' + TREE,
          options: ['ایک بھی نہیں', '1', '2'],
          correct: 0,
          why: 'ترکیب لکھی تو گئی، مگر کسی نے اسے <strong>بلایا</strong> نہیں۔ اس لیے صرف آسمان بنا۔'
        },
        task: {
          intro: 'ترکیب کو <strong>بلائیں</strong> تاکہ درخت نظر آئے۔',
          steps: [
            'ترکیب کے آخری `}` کے <strong>نیچے</strong> ایک نئی لائن پر جائیں۔',
            'وہاں ترکیب کا نام لکھیں اور ساتھ `()` لگائیں۔',
            '«چلاؤ» دبائیں۔'
          ],
          starter: 'background("skyblue")\n' + TREE,
          hints: [
            'ترکیب ایک نسخے کی طرح ہے: نسخہ لکھنے سے کھانا نہیں بنتا، جب تک کوئی پکائے نہیں!',
            'سب سے آخر میں، `}` کے بعد لکھیں: `drawTree()`'
          ],
          solution: 'background("skyblue")\n' + TREE + 'drawTree()',
          solutionNote: '`drawTree()` ترکیب کے <strong>باہر</strong> لکھا ہے، اس لیے ترکیب چلی اور درخت بنا۔',
          check: function (out, code, r, T) {
            var bare = T.bare(code), s = callSites(bare, 'drawTree');
            if (!defines(bare, 'drawTree')) return { msg: 'ترکیب `drawTree` نہیں ملی۔ «شروع والا کوڈ» سے ترکیب واپس لائیں۔' };
            if (!s.out && s.inside) return { mood: 'nudge', msg: '`drawTree()` ترکیب کے <strong>اندر</strong> لکھا ہے، تو اسے کبھی کوئی نہیں بلائے گا۔ اسے آخری `}` کے <strong>بعد</strong> لکھیں۔' };
            if (!s.out && /(^|[^\w$])drawTree\s*($|[\n;])/m.test(bare.replace(/function\s+drawTree/g, '')))
              return { mood: 'nudge', msg: 'نام تو لکھ دیا! اب اس کے ساتھ `()` بھی لگائیں: `drawTree()`۔ بریکٹ کے بغیر ترکیب نہیں چلتی۔' };
            if (!s.out) return { msg: 'ابھی درخت نہیں بنا۔ ترکیب کو بلائیں: سب سے آخر میں `drawTree()` لکھیں۔' };
            if (!T.of(r, 'circle').length && !T.of(r, 'rect').length)
              return { mood: 'nudge', msg: 'ترکیب چلی، مگر بعد میں `background` نے درخت ڈھانپ دیا۔ `drawTree()` کو `background` والی لائن کے <strong>نیچے</strong> لکھیں۔' };
            return { pass: true };
          }
        },
        tests: [
          { code: 'background("skyblue")\n' + TREE + 'drawTree()\ndrawTree()', pass: true, note: 'called twice' },
          { code: 'background("skyblue")\ndrawTree()\n' + TREE, pass: true, note: 'call above the function (still works)' },
          { code: 'background("skyblue")\nfunction drawTree() {\n  rect(190, 250, 20, 80, "brown")\n  circle(200, 230, 40, "green")\n  drawTree()\n}', pass: false, note: 'call inside the function', has: 'اندر' },
          { code: 'background("skyblue")\n' + TREE + 'drawTree', pass: false, note: 'no brackets', has: '`()`' },
          { code: 'drawTree()\nbackground("skyblue")\n' + TREE, pass: false, note: 'called before background, which covers it', has: 'background' },
          { code: 'background("skyblue")\n' + TREE + 'rect(190, 250, 20, 80, "brown")', pass: false, note: 'drew by hand instead of calling', has: 'drawTree()' },
          { code: 'background("skyblue")\n' + TREE + 'drawTree();\nsay("My tree!")', pass: true, note: 'semicolon and an extra say' },
          { code: 'background("skyblue")\n' + TREE + '// drawTree()', pass: false, note: 'call only in a comment', has: 'drawTree()' },
          { code: 'background("skyblue")\n' + TREE + 'drawtree()', pass: false, note: 'lower-case t (Error Doctor)', has: 'drawTree' }
        ],
        recap: 'آپ نے `say` اور `circle` کی طرح اپنا <strong>نیا حکم</strong> بنا لیا! اب `drawTree()` لکھیں اور درخت حاضر۔'
      },

      {
        id: '6.2', short: 'ان پٹ', title: 'جنگل اگائیں',
        learn: {
          say: [
            'ترکیب کو <strong>ان پٹ</strong> بھی دے سکتے ہیں۔ `drawTree(x)` میں `x` ایک ڈبہ ہے۔',
            '`drawTree(100)` لکھیں تو `x` میں 100 آتا ہے، اور درخت وہیں بنتا ہے۔',
            'ایک ترکیب، ہر بار نیا ان پٹ، ہر بار نئی جگہ!'
          ],
          example: TREE_X + 'drawTree(100)\ndrawTree(250)'
        },
        guess: {
          q: '`drawTree(300)` لکھیں تو نیا درخت کہاں بنے گا؟',
          code: 'background("skyblue")\n' + TREE_X + 'drawTree(100)\ndrawTree(300)',
          options: ['بائیں طرف', 'دائیں طرف', 'پہلے درخت کے اوپر'],
          correct: 1,
          why: '`x` میں 300 گیا۔ `x` بڑا ہو تو چیز <strong>دائیں</strong> طرف بنتی ہے۔'
        },
        task: {
          intro: 'کم از کم <strong>3 درختوں</strong> کا جنگل اگائیں، ہر درخت الگ جگہ پر۔',
          steps: [
            '`drawTree(100)` کے نیچے ترکیب کو دو بار اور بلائیں۔',
            'ہر بار بریکٹ میں <strong>مختلف</strong> نمبر لکھیں، 0 اور 400 کے بیچ۔',
            '«چلاؤ» دبائیں۔ بونس: چکر سے 5 درخت اگائیں!'
          ],
          starter: 'background("skyblue")\n' + TREE_X + 'drawTree(100)',
          hints: [
            'ایک ہی ترکیب، مختلف ان پٹ۔ ترکیب کو کئی بار بلائیں۔',
            'ایسے لکھیں: `drawTree(100)` پھر `drawTree(200)` پھر `drawTree(300)`'
          ],
          solution: 'background("skyblue")\n' + TREE_X + 'drawTree(100)\ndrawTree(200)\ndrawTree(300)',
          solutionNote: 'ایک ترکیب تین بار بلائی گئی، ہر بار نئے `x` کے ساتھ۔ چکر سے: `for (let i = 0; i < 5; i++) { drawTree(40 + i * 80) }`',
          check: function (out, code, r, T) {
            var bare = T.bare(code), s = callSites(bare, 'drawTree');
            // Trees whose middles are less than 25 apart look like one tree: count them once.
            var xs = [];
            T.of(r, 'circle').forEach(function (c) {
              if (T.partlyOn(c) && !xs.some(function (x) { return Math.abs(x - c.x) < 25; })) xs.push(c.x);
            });
            var loop = /\bfor\s*\(/.test(bare);
            var circles = r.allShapes.filter(function (c) { return c.type === 'circle'; });
            if (!defines(bare, 'drawTree')) return { msg: 'ترکیب `drawTree` نہیں ملی۔ «شروع والا کوڈ» سے ترکیب واپس لائیں۔' };
            if (xs.length >= 3 && (s.out >= 2 || (loop && s.out >= 1))) return { pass: true };
            if (xs.length >= 3) return { mood: 'nudge', msg: 'جنگل تو بن گیا! مگر درخت ہاتھ سے بنانے کی بجائے ترکیب کو بلائیں: `drawTree(200)`۔ یہی ترکیب کا فائدہ ہے۔' };
            if (circles.length > T.of(r, 'circle').length)
              return { mood: 'nudge', msg: 'درخت بنے، مگر بعد میں `background` نے انہیں ڈھانپ دیا۔ `background` والی لائن سب سے اوپر رکھیں۔' };
            if (circles.some(function (c) { return !T.partlyOn(c); }))
              return { mood: 'nudge', msg: 'کچھ درخت اسٹیج سے باہر بن گئے، اس لیے نظر نہیں آتے۔ بریکٹ میں 0 اور 400 کے بیچ کا نمبر لکھیں۔' };
            if (s.out >= 3) return { mood: 'nudge', msg: 'کچھ درخت ایک ہی جگہ، ایک دوسرے کے اوپر بن گئے۔ ہر بار بریکٹ میں <strong>مختلف</strong> نمبر لکھیں، جیسے 100، 200، 300۔' };
            return { mood: 'nudge', msg: (xs.length === 1 ? 'اسٹیج پر ابھی 1 درخت ہے۔' : 'اسٹیج پر ' + xs.length + ' درخت ہیں۔') + ' کم از کم 3 چاہئیں: ترکیب کو اور بلائیں، جیسے `drawTree(300)`۔' };
          }
        },
        tests: [
          { code: 'background("skyblue")\n' + TREE_X + 'for (let i = 0; i < 5; i++) {\n  drawTree(40 + i * 80)\n}', pass: true, note: 'bonus: loop of 5' },
          { code: TREE_X + 'drawTree(50)\ndrawTree(150)\ndrawTree(250)\ndrawTree(350)', pass: true, note: '4 trees, no background' },
          { code: 'background("skyblue")\n' + TREE_X + 'drawTree(100)\ndrawTree(100)\ndrawTree(100)', pass: false, note: 'same input three times', has: 'مختلف' },
          { code: 'background("skyblue")\n' + TREE_X + 'drawTree(100)\ndrawTree(300)', pass: false, note: 'only 2 trees', has: '3' },
          { code: 'background("skyblue")\n' + TREE_X + 'drawTree(100)\ndrawTree(600)\ndrawTree(900)', pass: false, note: 'trees off the stage', has: 'باہر' },
          { code: 'background("skyblue")\n' + TREE_X + 'drawTree(100)\nrect(190, 250, 20, 80, "brown")\ncircle(200, 230, 40, "green")\nrect(290, 250, 20, 80, "brown")\ncircle(300, 230, 40, "green")', pass: false, note: 'trees drawn by hand', has: 'ترکیب' },
          { code: 'background("skyblue")\n' + TREE_X + 'drawTree(100)\ndrawTree(120)\ndrawTree(140)', pass: false, note: 'three trees squashed into one', has: 'مختلف' },
          { code: 'background("skyblue")\n' + TREE_X + 'drawTree(100)\ndrawTree(200)\ndrawTree(300)\nbackground("skyblue")', pass: false, note: 'background at the end covers the forest', has: 'background' },
          { code: 'background("skyblue")\n' + TREE_X + 'drawTree(0)\ndrawTree(200)\ndrawTree(400)\nsay("Forest!")', pass: true, note: 'trees on both edges, extra say' },
          { code: 'background("skyblue")\n' + TREE_X + 'drawTree(100)\ndrawTree("200")\ndrawTree("300")', pass: false, note: 'numbers in quotes (Error Doctor)', has: '" "' }
        ],
        recap: '<strong>ان پٹ</strong> سے ایک ترکیب ہر بار کچھ مختلف کر سکتی ہے۔ ایک بار لکھیں، سو بار استعمال کریں!'
      },

      {
        id: '6.3', short: 'کلک', title: 'کلک کریں، برڈی اچھلے!',
        learn: {
          say: [
            'اب تک پروگرام اوپر سے نیچے چل کر ختم ہو جاتا تھا۔ اب وہ <strong>انتظار</strong> کرے گا!',
            '`onClick(whenClicked)` کمپیوٹر سے کہتا ہے: جب اسٹیج پر کلک ہو، تب یہ ترکیب چلاؤ۔ اسے <strong>ایونٹ</strong> کہتے ہیں۔',
            '`onClick` میں ترکیب کا نام <strong>بغیر</strong> `()` کے لکھیں۔ `jump()` سے برڈی اچھلتا ہے۔'
          ],
          example: 'function whenClicked() {\n  jump()\n  say("Hop!")\n}\nonClick(whenClicked)'
        },
        task: {
          intro: 'ہر کلک پر برڈی اچھلے اور بتائے کہ اب تک <strong>کتنی بار</strong> اچھلا: 1، 2، 3…',
          steps: [
            '`___` مٹائیں۔',
            'اس جگہ ایسی لائن لکھیں جو `jumps` میں 1 جمع کر کے واپس ڈبے میں رکھے۔',
            '«چلاؤ» دبائیں، پھر اسٹیج پر کلک کریں۔ کمپیوٹر بھی خود 3 بار کلک کر کے جانچے گا۔'
          ],
          tested: true,
          starter: 'let jumps = 0\nfunction whenClicked() {\n  jump()\n  ___\n  say(jumps)\n}\nonClick(whenClicked)',
          hints: [
            'ماڈیول 2 کے امرود یاد ہیں؟ ڈبے میں گنتی کیسے بڑھائی تھی؟',
            'خالی جگہ پر لکھیں: `jumps = jumps + 1`'
          ],
          solution: 'let jumps = 0\nfunction whenClicked() {\n  jump()\n  jumps = jumps + 1\n  say(jumps)\n}\nonClick(whenClicked)',
          solutionNote: 'ہر کلک پر ترکیب چلتی ہے: برڈی اچھلتا ہے، `jumps` میں 1 جمع ہوتا ہے، اور برڈی نئی گنتی بولتا ہے۔',
          check: async function (out, code, r, T) {
            var r2 = await T.run(code, { actions: [{ click: [100, 120] }, { click: [200, 200] }, { click: [300, 280] }] });
            if (r2.error) {
              if (/before initialization|already been declared/.test(r2.error.message) || (T.bare(code).match(/\blet\s+jumps\b/g) || []).length > 1)
                return { msg: 'کلک کرنے پر غلطی آئی: ڈبہ `jumps` دوبارہ بن رہا ہے۔ ترکیب کے اندر `let` نہ لکھیں، صرف `jumps = jumps + 1`۔' };
              return crash(r2, code, T, 'کلک کرنے پر غلطی آئی۔');
            }
            if (!r2.uses || !r2.uses.click) return { msg: 'ترکیب تیار ہے، مگر کمپیوٹر کو بتایا نہیں کہ کلک پر اسے چلائے۔ آخر میں لکھیں: `onClick(whenClicked)`' };
            if (callSites(T.bare(code), 'onClick').out > 1)
              return { mood: 'nudge', msg: '`onClick` ایک سے زیادہ بار لکھا ہے، اس لیے ہر کلک پر ترکیب کئی بار چلتی ہے۔ صرف ایک `onClick(whenClicked)` رکھیں۔' };
            var segs = afterEach(r2.events, 'click');
            var nums = segs.map(function (g) { return g.says.length ? lastNum(g.says[g.says.length - 1]) : null; });
            var tests = segs.map(function (g, i) {
              return { label: 'کلک ' + (i + 1), ok: g.jumps > 0 && nums[i] === i + 1, got: g.says.length ? String(g.says[g.says.length - 1]) : '…' };
            });
            if (tests.every(function (t) { return t.ok; })) return { pass: true, tests: tests };
            if (segs.some(function (g) { return !g.jumps; })) return { msg: 'کلک پر برڈی نہیں اچھلا۔ ترکیب میں `jump()` ضرور رہنے دیں۔', tests: tests };
            if (nums.every(function (n) { return n === null; }) && segs.some(function (g) { return g.says.length; }))
              return { mood: 'nudge', msg: 'برڈی گنتی کی جگہ لفظ بول رہا ہے۔ ڈبے کا نام `" "` کے بغیر لکھیں: `say(jumps)`', tests: tests };
            if (nums.every(function (n) { return n === null; })) return { mood: 'nudge', msg: 'برڈی اچھلا مگر کچھ نہیں بولا۔ ترکیب کے اندر `say(jumps)` رہنے دیں۔', tests: tests };
            if (nums[0] === nums[1] && nums[1] === nums[2]) return { mood: 'nudge', msg: 'برڈی اچھل رہا ہے، مگر گنتی نہیں بڑھ رہی۔ `jumps` میں 1 جمع کر کے <strong>واپس</strong> ڈبے میں رکھیں: `jumps = jumps + 1`', tests: tests };
            if (nums[0] === 0 && nums[1] === 1 && nums[2] === 2) return { mood: 'nudge', msg: 'برڈی ایک پیچھے گن رہا ہے! گنتی <strong>پہلے</strong> بڑھائیں، پھر `say(jumps)`۔ یعنی جمع والی لائن `say` سے اوپر رکھیں۔', tests: tests };
            return { mood: 'nudge', msg: 'کمپیوٹر نے 3 بار کلک کیا۔ برڈی کو 1، 2، 3 بولنا تھا۔ ہر کلک پر `jumps` میں صرف 1 جمع کریں۔', tests: tests };
          }
        },
        tests: [
          { code: 'let jumps = 0\nfunction whenClicked() {\n  jump()\n  jumps++\n  say(jumps)\n}\nonClick(whenClicked)', pass: true, note: 'jumps++' },
          { code: 'let jumps = 0\nfunction whenClicked() {\n  jump()\n  jumps += 1\n  console.log("Jumps: " + jumps)\n}\nonClick(whenClicked)', pass: true, note: '+= and console.log with words' },
          { code: 'let jumps = 0\nfunction whenClicked() {\n  jump()\n  jumps + 1\n  say(jumps)\n}\nonClick(whenClicked)', pass: false, note: 'count stays at 0', has: 'واپس' },
          { code: 'let jumps = 0\nfunction whenClicked() {\n  jump()\n  say(jumps)\n  jumps = jumps + 1\n}\nonClick(whenClicked)', pass: false, note: 'adds after saying: 0, 1, 2', has: 'پہلے' },
          { code: 'let jumps = 0\nfunction whenClicked() {\n  jump()\n  let jumps = jumps + 1\n  say(jumps)\n}\nonClick(whenClicked)', pass: false, note: 'let inside the function', has: 'let' },
          { code: 'let jumps = 0\nfunction whenClicked() {\n  jump()\n  jumps = jumps + 1\n  say(jumps)\n}\nwhenClicked()', pass: false, note: 'called once instead of onClick', has: 'onClick' },
          { code: 'let jumps = 0\nfunction whenClicked() {\n  jumps = jumps + 1\n  say(jumps)\n}\nonClick(whenClicked)', pass: false, note: 'jump() deleted', has: 'jump()' },
          { code: 'let jumps = 0\nfunction whenClicked() {\n  jump()\n  jumps = jumps + 1\n  say("jumps")\n}\nonClick(whenClicked)', pass: false, note: 'say("jumps") in quotes', has: '" "' },
          { code: 'let jumps = 0\nfunction whenClicked() {\n  jump()\n  jumps = jumps + 1\n  say(jumps)\n}\nonClick(whenClicked)\nonClick(whenClicked)', pass: false, note: 'onClick written twice: 2, 4, 6', has: 'onClick' },
          { code: 'let jumps = 0\nfunction whenClicked() {\n  jump()\n  Jumps = jumps + 1\n  say(jumps)\n}\nonClick(whenClicked)', pass: false, note: 'capital J, error only on click', has: 'لائن 4' }
        ],
        recap: '`onClick` کمپیوٹر سے کہتا ہے: "انتظار کرو، اور جب کلک ہو تب یہ ترکیب چلاؤ۔" اسے <strong>ایونٹ</strong> کہتے ہیں۔ ہر کھیل ایونٹس پر چلتا ہے!'
      },

      {
        id: '6.4', short: 'تیر', title: 'پتنگ اڑائیں',
        learn: {
          say: [
            '`onKey` بھی ایک ایونٹ ہے: جب کوئی <strong>تیر والا بٹن</strong> دبے، تب ترکیب چلتی ہے۔',
            '`moveKite(10, 0)` پتنگ کو 10 قدم دائیں لے جاتا ہے۔ پہلا نمبر دائیں بائیں، دوسرا اوپر نیچے۔',
            'اسٹیج کے نیچے تیر والے بٹن ہیں۔ کی بورڈ کے تیر بھی کام کرتے ہیں۔'
          ],
          example: 'function goRight() {\n  moveKite(10, 0)\n}\nonKey("ArrowRight", goRight)'
        },
        task: {
          intro: 'دائیں والے بٹن سے پتنگ دائیں جاتی ہے۔ اب <strong>بائیں</strong>، <strong>اوپر</strong> اور <strong>نیچے</strong> والے بٹن بھی چلائیں۔',
          steps: [
            'نیچے ایک نئی ترکیب `goLeft` بنائیں۔ `function` والی کنجی مدد کرے گی۔',
            'اس کے اندر `moveKite` لکھیں۔ بائیں جانے کے لیے پہلا نمبر <strong>منفی</strong> ہو، جیسے `-10`۔',
            'اس کے نیچے لکھیں: `onKey("ArrowLeft", goLeft)`',
            'اسی طرح اوپر (`goUp`، `ArrowUp`) اور نیچے (`goDown`، `ArrowDown`) بنائیں۔ پھر «چلاؤ» دبا کر پتنگ اڑائیں۔'
          ],
          tested: true,
          starter: 'function goRight() {\n  moveKite(10, 0)\n}\nonKey("ArrowRight", goRight)\n',
          hints: [
            'ہر سمت کے لیے ایک نئی ترکیب اور ایک نیا `onKey`۔ بٹنوں کے نام: `ArrowLeft`، `ArrowUp`، `ArrowDown`',
            'بائیں = `moveKite(-10, 0)`، اوپر = `moveKite(0, -10)`، نیچے = `moveKite(0, 10)`۔ یاد ہے؟ اوپر جانے کے لیے `y` <strong>کم</strong> ہوتا ہے۔'
          ],
          solution: SOL4,
          solutionNote: 'چار ترکیبیں اور چار `onKey`۔ منفی نمبر پتنگ کو بائیں یا اوپر لے جاتا ہے۔',
          check: async function (out, code, r, T) {
            var KEYS = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'];
            var WANT = { ArrowRight: 'right', ArrowLeft: 'left', ArrowUp: 'up', ArrowDown: 'down' };
            var NAME = { ArrowRight: 'goRight', ArrowLeft: 'goLeft', ArrowUp: 'goUp', ArrowDown: 'goDown' };
            var FIX = { ArrowRight: 'moveKite(10, 0)', ArrowLeft: 'moveKite(-10, 0)', ArrowUp: 'moveKite(0, -10)', ArrowDown: 'moveKite(0, 10)' };
            var r2 = await T.run(code, { actions: KEYS.map(function (k) { return { key: k }; }) });
            if (r2.error) return crash(r2, code, T, 'بٹن دبانے پر غلطی آئی۔');
            var moves = kiteMoves(r2.events), got = {};
            moves.forEach(function (m) { got[m.key] = dir(m.before, m.after); });
            var tests = KEYS.map(function (k) { return { label: DIR_UR[WANT[k]] + ' والا بٹن', ok: got[k] === WANT[k], got: DIR_UR[got[k] || 'none'] }; });
            if (tests.every(function (t) { return t.ok; })) return { pass: true, tests: tests };
            if (got.ArrowUp === 'down' && got.ArrowDown === 'up')
              return { mood: 'nudge', msg: 'پتنگ الٹی اڑ رہی ہے! ماڈیول 3 یاد کریں: `y` <strong>چھوٹا</strong> = اوپر۔ اوپر کے لیے `moveKite(0, -10)` لکھیں۔', tests: tests };
            var nearly = tests.filter(function (t) { return t.ok; }).length >= 3 ? 'nudge' : undefined;
            for (var i = 0; i < KEYS.length; i++) {
              var k = KEYS[i];
              if (got[k] === 'none') return { mood: nearly, msg: '`"' + k + '"` دبانے پر پتنگ نہیں ہلی۔ اس کے لیے ایک ترکیب بنائیں اور لکھیں: `onKey("' + k + '", ' + NAME[k] + ')`', tests: tests };
              if (got[k] !== WANT[k]) return { mood: nearly, msg: DIR_UR[WANT[k]] + ' والا بٹن دبانے پر پتنگ ' + DIR_UR[got[k]] + ' گئی۔ اس کی ترکیب میں لکھیں: `' + FIX[k] + '`', tests: tests };
            }
            return { msg: 'پتنگ ٹھیک نہیں اڑی۔ ہر بٹن کے لیے ایک ترکیب اور ایک `onKey` لکھیں۔', tests: tests };
          }
        },
        tests: [
          { code: 'onKey("ArrowRight", function () { moveKite(20, 0) })\nonKey("ArrowLeft", function () { moveKite(-20, 0) })\nonKey("ArrowUp", function () { moveKite(0, -20) })\nonKey("ArrowDown", function () { moveKite(0, 20) })', pass: true, note: 'functions without names, speed 20' },
          { code: 'function goRight() {\n  moveKite(10, 0)\n}\nfunction left() {\n  moveKite(-5, 0)\n}\nfunction up() {\n  moveKite(0, -5)\n}\nfunction down() {\n  moveKite(0, 5)\n}\nonKey("ArrowRight", goRight)\nonKey("ArrowLeft", left)\nonKey("ArrowUp", up)\nonKey("ArrowDown", down)', pass: true, note: 'other names, onKey lines at the end' },
          { code: 'function goRight() {\n  moveKite(10, 0)\n}\nonKey("ArrowRight", goRight)\nfunction goLeft() {\n  moveKite(-10, 0)\n}\nonKey("ArrowLeft", goLeft)\nfunction goUp() {\n  moveKite(0, 10)\n}\nonKey("ArrowUp", goUp)\nfunction goDown() {\n  moveKite(0, -10)\n}\nonKey("ArrowDown", goDown)', pass: false, note: 'up and down swapped', has: 'الٹی' },
          { code: 'function goRight() {\n  moveKite(10, 0)\n}\nonKey("ArrowRight", goRight)\nfunction goLeft() {\n  moveKite(-10, 0)\n}\nonKey("ArrowLeft", goLeft)\nfunction goUp() {\n  moveKite(0, -10)\n}\nonKey("ArrowUp", goUp)', pass: false, note: 'down arrow missing', has: 'ArrowDown' },
          { code: 'function goRight() {\n  moveKite(10, 0)\n}\nonKey("ArrowRight", goRight)\nfunction goLeft() {\n  moveKite(10, 0)\n}\nonKey("ArrowLeft", goLeft)\nfunction goUp() {\n  moveKite(0, -10)\n}\nonKey("ArrowUp", goUp)\nfunction goDown() {\n  moveKite(0, 10)\n}\nonKey("ArrowDown", goDown)', pass: false, note: 'left goes right (forgot the minus)', has: 'moveKite(-10, 0)' },
          { code: 'function goRight() {\n  moveKite(10, 0)\n}\nonKey("ArrowRight", goRight)\nonKey("ArrowLeft", goRight)\nonKey("ArrowUp", goRight)\nonKey("ArrowDown", goRight)', pass: false, note: 'every key uses goRight', has: 'moveKite(-10, 0)' },
          { code: 'function goRight() {\n  moveKite(10, 0)\n}\nonKey("ArrowRight", goRight)\nfunction goLeft() {\n  moveKite(-10, 0)\n}\nonKey("ArrowLeft", goLeft)\nfunction goUp() {\n  moveKite(-10, 0)\n}\nonKey("ArrowUp", goUp)\nfunction goDown() {\n  moveKite(10, 0)\n}\nonKey("ArrowDown", goDown)', pass: false, note: 'up and down change x instead of y', has: 'moveKite(0, -10)' },
          { code: SOL4.replace('moveKite(-10, 0)', 'moveKite("-10", 0)'), pass: false, note: 'number in quotes, error only on key press', has: 'لائن 7' },
          { code: SOL4.replace('onKey("ArrowDown", goDown)', 'onKey("arrowDown", goDown)'), pass: false, note: 'lower-case arrowDown (Error Doctor)', has: 'ArrowDown' },
          { code: SOL4.replace('moveKite(-10, 0)', 'moveKite(-10, -10)'), pass: false, note: 'left goes diagonally', has: 'ترچھی' }
        ],
        recap: 'اب پتنگ آپ کے اشاروں پر ناچتی ہے! منفی نمبر (`-10`) کا مطلب ہے الٹی سمت۔'
      },

      {
        id: '6.5', short: 'کھیل', title: 'آم پکڑیں', make: true,
        bubble: 'آج آپ کا اپنا کھیل بنے گا! ✨',
        learn: {
          say: [
            'ہر کھیل کا ایک دل ہوتا ہے جو ہمیشہ دھڑکتا ہے: `forever`۔ یہ ترکیب کو ایک سیکنڈ میں 20 بار چلاتا ہے۔',
            'ہر بار آم تھوڑا نیچے بنتا ہے، تو لگتا ہے آم گر رہا ہے! یہاں ترکیب کا نام نہیں، بس `function () { }`۔',
            '`near(a, b)` پوچھتا ہے: کیا دونوں پاس پاس ہیں؟ آم ٹوکری کے پاس ہو تو آم پکڑا گیا!',
            '`&&` کا مطلب ہے <strong>اور</strong>: دونوں باتیں سچ ہوں، تب ہی۔'
          ],
          example: 'let y = 0\nforever(function () {\n  background("skyblue")\n  mango(200, y)\n  y = y + 4\n  if (y > 400) {\n    y = 0\n  }\n})'
        },
        task: {
          intro: 'کھیل تقریباً تیار ہے! دو خالی جگہیں بھریں اور کم از کم 1 آم پکڑیں۔',
          steps: [
            'پہلی `___`: دائیں والے بٹن پر ٹوکری دائیں جائے۔ اس سے اوپر والی `ArrowLeft` لائن دیکھیں: وہاں `basketX - 20` ہے۔',
            'دوسری `___`: آم ہر بار کتنا نیچے گرے؟ ایک چھوٹا نمبر لکھیں۔',
            '«چلاؤ» دبائیں اور تیر والے بٹنوں سے ٹوکری ہلا کر آم پکڑیں!',
            'بونس: کھیل کو <strong>اپنا</strong> بنائیں: آسمان کا رنگ، رفتار یا `"Score: "` والا پیغام بدلیں۔'
          ],
          tested: true,
          starter: game('___', '___'),
          hints: [
            'بائیں والی لائن میں `basketX` کم ہوتا ہے۔ دائیں جانے کے لیے کیا ہو گا؟ اور آم کو ہر بار تھوڑا <strong>نیچے</strong> جانا ہے، یعنی `mangoY` بڑھے۔',
            'پہلی جگہ `basketX + 20`، اور رفتار کے لیے `4`۔ (`near(mangoX, basketX)` پوچھتا ہے: کیا آم اور ٹوکری پاس پاس ہیں؟)'
          ],
          solution: game('basketX + 20', '4'),
          solutionNote: 'دائیں بٹن پر `basketX` میں 20 جمع ہوتا ہے، اور ہر بار `mangoY` میں 4، تو آم گرتا ہے۔',
          check: async function (out, code, r, T) {
            var fall = await T.run(code, { randoms: many(200, 100000), actions: [{ ticks: 3 }], boxes: true });
            var right = await T.run(code, { randoms: many(200, 100000), actions: [{ ticks: 1 }, { key: 'ArrowRight' }, { ticks: 1 }], boxes: true });
            var stay = await T.run(code, { randoms: many(200, 100000), actions: [{ ticks: 500 }], boxes: true });
            // The basket stays at 200, every mango falls at x = 40: far away.
            var away = await T.run(code, { randoms: many(40, 100000), actions: [{ ticks: 500 }], boxes: true });
            var bad = [fall, right, stay, away].filter(function (x) { return x.error; })[0];
            if (bad) {
              var e = bad.error;
              if (e.code === 'num' && /^(mango|basket)$/.test(e.data && e.data.cmd))
                return { msg: 'کھیل چلتے چلتے رک گیا۔ جو خالی جگہیں بھریں، وہاں نمبر یا `basketX + 20` جیسی چیز ہو، `" "` کے بغیر۔' };
              return crash(bad, code, T, 'کھیل چلتے چلتے رک گیا۔');
            }
            if (!fall.uses || !fall.uses.forever) return { msg: '`forever(function () { ... })` والا حصہ نہیں ملا۔ «شروع والا کوڈ» سے کھیل واپس لائیں۔' };
            var f = frames(fall.events), m1 = f[0] && first(f[0], 'mango'), m2 = f[1] && first(f[1], 'mango');
            var speed = m1 && m2 ? m2.y - m1.y : 0;
            // A huge step (say 400) drops the mango off the stage in one frame, so every frame shows it at the top again.
            var step = /mangoY=mangoY\+(\d+(\.\d+)?)/.exec(T.squash(code));
            if (speed <= 0 && step && +step[1] > 20) speed = +step[1];
            var rf = frames(right.events), b1 = rf[0] && first(rf[0], 'basket'), b2 = rf[1] && first(rf[1], 'basket');
            var moved = b1 && b2 ? b2.x - b1.x : 0;
            var caught = scoreOf(stay), missed = scoreOf(away);
            var tests = [
              { label: 'آم نیچے گرتا ہے', ok: speed > 0, got: String(speed) },
              { label: 'دائیں بٹن سے ٹوکری دائیں', ok: moved > 0, got: String(moved) },
              { label: 'ٹوکری آم کے نیچے: اسکور بڑھا', ok: caught > 0, got: String(caught) },
              { label: 'ٹوکری دور: اسکور نہیں بڑھا', ok: missed === 0, got: String(missed) }
            ];
            if (speed <= 0) return { mood: 'nudge', msg: 'آم گر ہی نہیں رہا! دوسری `___` کی جگہ ایک چھوٹا نمبر لکھیں، جیسے 4، تاکہ `mangoY` ہر بار بڑھے۔', tests: tests };
            if (moved <= 0 && !/\bbasket\(basketX,/.test(T.squash(code)))
              return { mood: 'nudge', msg: '`basketX` تو بڑھا، مگر ٹوکری وہیں رہی۔ `forever` کے اندر `basket(basketX, 360)` رہنے دیں۔', tests: tests };
            if (moved <= 0) return { mood: 'nudge', msg: 'دائیں والا بٹن ٹوکری کو دائیں نہیں لے جاتا۔ `x` بڑا ہو تو چیز دائیں جاتی ہے: `basketX + 20` لکھیں۔', tests: tests };
            if (moved < 5) return { mood: 'nudge', msg: 'ٹوکری بہت تھوڑا ہلتی ہے، آم تک پہنچ ہی نہیں پائے گی۔ ہر بار 20 جمع کریں: `basketX + 20`', tests: tests };
            if (speed > 20) return { mood: 'nudge', msg: 'آم اتنا تیز گرتا ہے کہ کوئی نہیں پکڑ سکتا۔ رفتار کم کریں، جیسے 4 یا 6۔', tests: tests };
            if (caught === null) return { mood: 'nudge', msg: 'اسکور کہیں نظر نہیں آ رہا۔ آخر والی لائن `text("Score: " + score, 20, 30)` رہنے دیں۔', tests: tests };
            if (!(caught > 0)) return { mood: 'nudge', msg: 'ٹوکری آم کے بالکل نیچے تھی، مگر اسکور نہیں بڑھا۔ `near(mangoX, basketX)` اور `score = score + 1` والی لائنیں دیکھیں۔', tests: tests };
            if (missed !== 0) return { mood: 'nudge', msg: 'ٹوکری آم سے دور تھی، پھر بھی اسکور بڑھ گیا! `if` کی شرط میں `near(mangoX, basketX)` رہنے دیں۔', tests: tests };
            return { pass: true, tests: tests };
          }
        },
        tests: [
          { code: game('basketX + 20', '6', 'lightgreen', 'Mangoes: '), pass: true, note: 'own colour, speed and message' },
          { code: game('basketX + 20', '0'), pass: false, note: 'speed 0: the mango never falls', has: 'گر' },
          { code: game('basketX - 20', '4'), pass: false, note: 'right arrow moves left', has: '`basketX + 20`' },
          { code: game('basketX + 20', '4').replace(' && near(mangoX, basketX)', ''), pass: false, note: 'near() removed: every mango counts', has: 'دور' },
          { code: game('basketX + 20', '"4"'), pass: false, note: 'speed in quotes', has: '" "' },
          { code: game('basketX + 20', '25'), pass: false, note: 'speed 25: too fast to catch', has: 'تیز' },
          { code: game('basketX + 20', '400'), pass: false, note: 'speed 400: off the stage in one frame, still too fast', has: 'تیز' },
          { code: game('basketX + 1', '4'), pass: false, note: 'basket moves 1 step: can never reach the mango', has: '`basketX + 20`' },
          { code: game('basketX + 20', '4').replace('basket(basketX, 360)', 'basket(200, 360)'), pass: false, note: 'basket drawn at a fixed place', has: '`basket(basketX, 360)`' },
          { code: game('basketX + 20', '4', 'light blue'), pass: false, note: 'colour with a space (error inside forever)', has: 'لائن 10' },
          { code: game('basketx + 20', '4'), pass: false, note: 'lower-case x, error only on key press', has: 'basketX' },
          { code: game('basketX+20', '4', 'pink', 'Aam: ').replace('text("Aam: " + score, 20, 30)', 'say(score)'), pass: true, note: 'no spaces, pink sky, say(score) instead of text' }
        ],
        recap: 'آپ نے برڈی کو بولنا، یاد رکھنا، تصویر بنانا، بار بار کام کرنا، فیصلے کرنا اور کھیلنا، سب سکھا دیا۔ ' +
          'انہی چیزوں سے دنیا کی ہر ایپ اور ہر کھیل بنتا ہے۔ <strong>آپ اب پروگرامر ہیں!</strong> 🎉'
      }
    ]
  };

  // What Mithu says out loud: very short, very simple English, read slowly by the device's own voice.
  var VOICE = {
    '6.1': {
      learn: 'You can make your own new command! It is called a function. Write the steps inside the curly brackets. But writing a function does nothing by itself. You must call it, by writing its name with brackets.',
      guess: 'Look at this code. How many trees will we see? Choose one answer.',
      why: 'None! The function is written, but nobody called it. So we only see the sky.',
      task: 'Your turn. Call the function, so the tree appears. Go to a new line below the last curly bracket. Type the name, drawTree, and add brackets. Then press Run.',
      hints: ['A function is like a recipe. Writing a recipe does not cook the food. Someone has to cook it!',
              'At the very end, after the curly bracket, type: drawTree, bracket, bracket.'],
      solution: 'drawTree is called outside the function. So the function runs, and the tree appears.',
      recap: 'Well done! You made your own new command, just like say and circle. Now write drawTree, and a tree appears!'
    },
    '6.2': {
      learn: 'A function can take an input. In drawTree x, the x is a box. Write drawTree 100, and x gets 100. The tree grows there. One function. A new input each time. A new place each time!',
      guess: 'We call drawTree with 300. Where will the new tree grow? Choose one answer.',
      why: 'x got 300. A bigger x means further to the right.',
      task: 'Your turn. Grow a forest of at least 3 trees, each in a different place. Call drawTree two more times. Put a different number in the brackets each time. Then press Run. Bonus: grow 5 trees with a loop!',
      hints: ['One function, different inputs. Call the function many times.',
              'Type drawTree 100. Then drawTree 200. Then drawTree 300.'],
      solution: 'One function, called three times, with a new x each time.',
      recap: 'Well done! With an input, one function can do something different every time. Write it once, use it a hundred times!'
    },
    '6.3': {
      learn: 'Until now, a program ran from top to bottom, and stopped. Now it will wait! onClick tells the computer: when someone clicks the stage, run this function. This is called an event. And jump makes Birdy hop.',
      task: 'Your turn. On every click, Birdy jumps, and says how many times he has jumped. Delete the blank. Write a line that adds 1 to jumps, and puts it back in the box. Press Run, then click the stage. The computer will also click 3 times to test it.',
      hints: ['Remember the guavas in module 2? How did we count up in a box?',
              'In the blank, type: jumps equals jumps plus 1.'],
      solution: 'On every click the function runs. Birdy jumps. jumps gets 1 more. And Birdy says the new number.',
      recap: 'Well done! onClick tells the computer: wait, and when there is a click, run this function. This is an event. Every game runs on events!'
    },
    '6.4': {
      learn: 'onKey is an event too. When an arrow button is pressed, the function runs. moveKite 10, 0 moves the kite 10 steps right. The first number is left and right. The second number is up and down. Use the arrow buttons under the stage, or the arrow keys.',
      task: 'Your turn. The right arrow already works. Now make the left, up and down arrows work too. Make a new function for each one, with moveKite inside. Then add an onKey line for each arrow. Press Run, and fly the kite!',
      hints: ['One new function and one new onKey for each arrow. The names are ArrowLeft, ArrowUp and ArrowDown.',
              'Left is minus 10, 0. Up is 0, minus 10. Down is 0, 10. Remember? To go up, y gets smaller.'],
      solution: 'Four functions and four onKey lines. A minus number moves the kite left, or up.',
      recap: 'Well done! Now the kite dances to your buttons. A minus number means the other way.'
    },
    '6.5': {
      learn: 'Every game has a heart that beats forever. forever runs a function 20 times every second. Each time, the mango is drawn a little lower. So it looks like it is falling! near asks: are these two close together? If the mango is near the basket, you caught it! The two and signs mean: both things must be true.',
      task: 'Your last project! The game is almost ready. Fill the two blanks. First: make the right arrow move the basket right. Look at the left arrow line. Second: how far does the mango fall each time? Type a small number. Press Run, and catch a mango! Bonus: make the game your own. Change the colour, the speed, or the message.',
      hints: ['In the left line, basketX gets smaller. What happens to go right? And the mango must go a little lower each time.',
              'The first blank is basketX plus 20. For the speed, try 4.'],
      solution: 'The right arrow adds 20 to basketX. And mangoY gets 4 more each time, so the mango falls.',
      recap: 'Amazing! You taught Birdy to speak, to remember, to draw, to repeat, to decide, and to play. Every app and every game in the world is made from these things. You are a programmer now! Birdy is so proud of you!'
    }
  };
  M.levels.forEach(function (L) { L.voice = VOICE[L.id]; });
  (window.MODULES = window.MODULES || []).push(M);
})();
