// Module 4: بار بار (Again and again = loops)
// Every level: learn -> guess (optional) -> task -> recap. Children only ever type English.
// Urdu is for reading; backticks mark code. check(out, code, r, T) returns {pass:true} or {msg, mood:'nudge'}.
(function () {
  function hasFor(code, T) { return /\bfor\s*\(/.test(T.bare(code)); }
  function uniq(list) { return list.filter(function (v, i) { return list.indexOf(v) === i; }); }
  function line(n, s) { var a = []; for (var i = 0; i < n; i++) a.push(s); return a.join('\n'); }

  // 4.4: 25 circles on 5 different x and 5 different y places = a 5 by 5 grid.
  function grid(out, code, r, T) {
    var c = T.of(r, 'circle');
    if (c.length === 5) return { mood: 'nudge', msg: 'صرف ایک قطار بنی، 5 دائرے۔ `circle` والی لائن <strong>دونوں</strong> چکروں کے اندر ہونی چاہیے۔' };
    if (c.length !== 25) return { msg: 'جال کے لیے 25 دائرے چاہئیں، ابھی ' + c.length + ' بنے۔ کیا ہر چکر کا `{` اور `}` صحیح جگہ پر ہے؟' };
    var xs = uniq(c.map(function (s) { return s.x; })), ys = uniq(c.map(function (s) { return s.y; }));
    var spots = uniq(c.map(function (s) { return s.x + ',' + s.y; }));
    if (xs.length !== 5 || ys.length !== 5 || spots.length !== 25)
      return { msg: '25 دائرے تو بنے، مگر جال کی شکل میں نہیں۔ ہر دائرے کی جگہ `row` اور `col` دونوں سے بدلنی چاہیے۔' };
    return { pass: true };
  }

  var M = {
    id: 'm4',
    number: 4,
    title: 'بار بار',
    badge: { name: 'چکر کا استاد', line: 'آپ نے کمپیوٹر سے ایک کام بار بار کروا لیا!' },
    next: 'اگلے ماڈیول میں برڈی <strong>فیصلے</strong> کرنا سیکھے گا: اگر ایسا ہو، تو یہ کرو۔',
    stage: { draw: true, boxes: false },

    lesson:
      '<p>ایک ہی کام بار بار کرنا ہو تو <strong>چکر</strong> لگائیں۔ انگریزی میں اسے `loop` کہتے ہیں۔</p>' +
      '<p>`for (let i = 0; i < 5; i++) { }` کا مطلب ہے:</p>' +
      '<p>`let i = 0` : `i` کو 0 سے <strong>شروع</strong> کرو۔<br>`i < 5` : <strong>جب تک</strong> `i` پانچ سے کم ہے، کام کرتے رہو۔<br>`i++` : ہر چکر کے بعد `i` میں <strong>1 بڑھاؤ</strong>۔</p>' +
      '<p>جو کام `{ }` کے اندر ہو، وہ ہر چکر میں ایک بار ہوتا ہے۔</p>' +
      '<p>`*` کا مطلب ہے ضرب: `3 * 70` سے 210 بنتا ہے۔ اس لیے `50 + i * 70` سے ہر چیز پچھلی سے 70 آگے بنتی ہے۔</p>' +
      '<p>ہر چکر میں `i` بدلتا ہے: 0، 1، 2، 3، 4۔ `i` کو جگہ، سائز یا گنتی میں لکھیں تو ہر بار کچھ نیا بنتا ہے۔</p>' +
      '<p>`for` والی کنجی یہ پورا ڈھانچہ خود لکھ دیتی ہے۔</p>',

    commands: [
      { code: 'for (let i = 0; i < n; i++) { }', ur: '`{ }` کے اندر والا کام `n` بار دہراتا ہے۔', from: '4.1' },
      { code: 'a * b', ur: '`*` کا مطلب ہے ضرب: `3 * 70` سے 210 بنتا ہے۔', from: '4.1' },
      { code: 'kite(x, y, color)', ur: 'پتنگ بناتا ہے۔', from: '4.2' },
      { code: 'randomColor()', ur: 'ہر بار کوئی بھی ایک رنگ چن دیتا ہے۔', from: '4.3' }
    ],

    keys: [
      { t: 'for', ins: 'for (let i = 0; i < 5; i++) {\n  |\n}', tpl: true },
      { t: '{', ins: '{' }, { t: '}', ins: '}' },
      { t: '*', ins: ' * ' }, { t: '+', ins: ' + ' }, { t: ',', ins: ', ' },
      { t: '"', ins: '"' }, { t: '(', ins: '(' }, { t: ')', ins: ')' }, { t: '↵', ins: '\n' }
    ],

    levels: [
      {
        id: '4.1', short: 'چکر', title: 'کتنے ستارے؟',
        learn: {
          say: [
            'ایک ہی کام بار بار کرنا ہو تو <strong>چکر</strong> لگاتے ہیں۔ جو کام `{ }` کے اندر ہو، وہ ہر چکر میں ہوتا ہے۔',
            '`let i = 0` یعنی 0 سے <strong>شروع</strong> کرو۔ `i < 5` یعنی <strong>جب تک</strong> `i` پانچ سے کم ہے، چلتے رہو۔ `i++` یعنی ہر چکر کے بعد `i` میں <strong>1 بڑھاؤ</strong>۔',
            'اس لیے `i` بنتا ہے 0، 1، 2، 3، 4: پانچ چکر، پانچ ستارے! `*` کا مطلب ہے ضرب، اس لیے `i * 70` سے ہر ستارہ پچھلے سے 70 آگے بنتا ہے۔'
          ],
          example: 'for (let i = 0; i < 5; i++) { star(50 + i * 70, 200, 20, "gold") }',
          parts: [
            { t: 'for', l: 'حکم: دہراؤ' },
            { t: 'let i = 0', l: 'شروع: 0 سے' },
            { t: 'i < 5', l: 'جب تک 5 سے کم' },
            { t: 'i++', l: '1 بڑھاؤ' },
            { t: '{ star(...) }', l: 'بار بار والا کام' }
          ]
        },
        guess: {
          q: 'اب چکر <strong>1</strong> سے شروع ہوتا ہے۔ اسٹیج پر <strong>کتنے</strong> ستارے بنیں گے؟',
          code: 'background("navy")\nfor (let i = 1; i < 5; i++) {\n  star(50 + i * 70, 200, 20, "gold")\n}',
          options: ['4', '5', '6', 'صرف 1'],
          correct: 0,
          why: '`i` بنا 1، 2، 3، 4۔ 5 پر `i < 5` جھوٹ ہو گیا، اس لیے صرف 4 چکر اور 4 ستارے۔'
        },
        task: {
          intro: 'اب <strong>8 ستارے</strong> بنائیں، اور سب اسٹیج کے <strong>اندر</strong> رہیں۔',
          steps: [
            'وہ نمبر ڈھونڈیں جو بتاتا ہے کہ چکر کتنی بار چلے گا۔ اسے 8 کر دیں۔',
            '«چلاؤ» دبا کر دیکھیں: کیا سب ستارے اسٹیج پر ہیں؟',
            'اگر نہیں، تو ستاروں کا فاصلہ `70` کم کریں اور پھر «چلاؤ» دبائیں۔'
          ],
          starter: 'background("navy")\nfor (let i = 0; i < 5; i++) {\n  star(50 + i * 70, 200, 20, "gold")\n}',
          hints: [
            'کون سا نمبر بتاتا ہے کہ چکر کتنی بار چلے گا؟ اور کون سا نمبر ستاروں کا فاصلہ بتاتا ہے؟',
            '`i < 8` کریں، اور `70` کی جگہ `45` لکھیں تاکہ سب ستارے اسٹیج میں سما جائیں۔'
          ],
          solution: 'background("navy")\nfor (let i = 0; i < 8; i++) {\n  star(50 + i * 45, 200, 20, "gold")\n}',
          solutionNote: '`i < 8` سے چکر 8 بار چلتا ہے، اور `45` کا فاصلہ سب ستاروں کو اسٹیج کے اندر رکھتا ہے۔',
          check: function (out, code, r, T) {
            var s = T.of(r, 'star');
            if (!hasFor(code, T)) return { mood: 'nudge', msg: 'ستارے بنے، مگر چکر کہاں گیا؟ ایک ہی `star` والی لائن `for` کے اندر رکھیں اور چکر سے 8 ستارے بنوائیں۔' };
            if (s.length !== 8) return { mood: s.length > 5 ? 'nudge' : undefined, msg: 'ابھی ' + s.length + ' ستارے بنے، 8 چاہئیں۔ کون سا نمبر بتاتا ہے کہ چکر کتنی بار چلے گا؟' };
            if (!s.every(T.fullyOn)) {
              var first = s.some(function (x) { var b = T.bbox(x); return b[0] < 0; });
              return { mood: 'nudge', msg: first ? 'پہلا ستارہ بائیں طرف سے اسٹیج سے باہر نکل گیا! شروع والا نمبر بڑا کریں، جیسے `50`۔'
                : '8 ستارے بنے، مگر کچھ اسٹیج سے باہر نکل گئے! فاصلہ کم کریں، جیسے `70` کی جگہ `45`۔' };
            }
            for (var a = 0; a < s.length; a++)
              for (var b = a + 1; b < s.length; b++)
                if (Math.hypot(s[a].x - s[b].x, s[a].y - s[b].y) < Math.max(s[a].size, s[b].size))
                  return { mood: 'nudge', msg: 'ستارے ایک دوسرے کے اوپر چڑھ گئے ہیں۔ فاصلہ تھوڑا بڑھائیں تاکہ سب الگ الگ نظر آئیں۔' };
            return { pass: true };
          }
        },
        tests: [
          { code: 'background("navy")\nfor (let i = 0; i <= 7; i++) {\n  star(30 + i * 48, 200, 20, "gold")\n}', pass: true, note: 'i <= 7 and another gap' },
          { code: 'background("navy")\nfor (let i = 1; i <= 8; i++) {\n  star(i * 44, 100, 15, "yellow")\n}', pass: true, note: 'counts 1 to 8' },
          { code: 'background("navy")\nfor (let i = 0; i < 8; i++) {\n  star(50 + i * 70, 200, 20, "gold")\n}', pass: false, note: 'stars off the wall', has: 'باہر' },
          { code: 'background("navy")\nfor (let i = 0; i < 9; i++) {\n  star(30 + i * 40, 200, 20, "gold")\n}', pass: false, note: '9 stars', has: '8 چاہئیں' },
          { code: 'background("navy")\nfor (let i = 0; i < 8; i++) {\n  star(50 + i * 5, 200, 20, "gold")\n}', pass: false, note: 'stars piled up', has: 'چڑھ' },
          { code: 'background("navy")\n' + [40, 85, 130, 175, 220, 265, 310, 355].map(function (x) { return 'star(' + x + ', 200, 20, "gold")'; }).join('\n'), pass: false, note: '8 lines, no loop', has: 'چکر' },
          { code: 'background("navy")\nfor (let i = 0; i < 8; i++) {\n  star(10 + i * 50, 200, 20, "gold")\n}', pass: false, note: 'first star off the left edge', has: 'شروع والا نمبر' },
          { code: 'for (let j = 0; j < 8; j++) {\n  star(40 + j * 45, 100 + j * 30, 15, "white")\n}', pass: true, note: 'other box name, no background, slanting' },
          { code: 'background("navy")\nfor (let i = 0; i < 8; i++) {\n  star(50 + i * 45, 200, 20, "gold")\n  say(i)\n}', pass: true, note: 'extra say(i) inside the loop' },
          { code: 'background("navy")\nfor (let i = 0; i < 8; i++) {\n  Star(50 + i * 45, 200, 20, "gold")\n}', pass: false, note: 'Star with a capital (Error Doctor)', has: '`star`' }
        ],
        recap: 'ایک نمبر بدلا اور 5 سے 8 ستارے! چکر میں کام <strong>ایک بار لکھتے</strong> ہیں، اور کمپیوٹر اسے <strong>جتنی بار چاہیں</strong> دہراتا ہے۔'
      },

      {
        id: '4.2', short: 'پتنگیں', title: 'پتنگیں کہاں گئیں؟',
        learn: {
          say: [
            'نیا حکم: `kite(x, y, color)` ایک پتنگ بناتا ہے۔',
            'چکر میں `i` ہر بار بدلتا ہے۔ جگہ میں `i` لکھیں تو جگہ بھی بدلتی ہے: `60 + i * 90` سے دائرے 60، 150، 240 اور 330 پر بنتے ہیں۔'
          ],
          example: 'background("skyblue")\nkite(200, 120, "red")\nfor (let i = 0; i < 4; i++) {\n  circle(60 + i * 90, 300, 25, "white")\n}',
          flow: true
        },
        guess: {
          q: 'یہ کوڈ 10 پتنگیں بناتا ہے۔ مگر اسٹیج پر کتنی <strong>نظر</strong> آئیں گی؟',
          code: 'background("skyblue")\nfor (let i = 0; i < 10; i++) {\n  kite(200, 150, "red")\n}',
          options: ['10', 'صرف 1', 'ایک بھی نہیں'],
          correct: 1,
          why: 'دس پتنگیں بنیں، مگر سب ایک ہی جگہ پر، ایک کے اوپر ایک۔ اس لیے صرف ایک نظر آتی ہے۔'
        },
        task: {
          intro: 'غلطی ٹھیک کریں تاکہ 10 پتنگیں <strong>ایک قطار میں</strong> الگ الگ نظر آئیں۔',
          steps: [
            '`kite` والی لائن میں `x` والا نمبر `200` ڈھونڈیں۔',
            'اس کی جگہ ایسی چیز لکھیں جس میں `i` ہو، تاکہ ہر پتنگ نئی جگہ پر بنے۔',
            '«چلاؤ» دبائیں اور دیکھیں: کیا سب پتنگیں اسٹیج کے اندر ہیں؟'
          ],
          starter: 'background("skyblue")\nfor (let i = 0; i < 10; i++) {\n  kite(200, 150, "red")\n}',
          hints: [
            'سب پتنگیں ایک ہی جگہ (200، 150) پر بن رہی ہیں۔ کون سی چیز ہر چکر میں بدلتی ہے؟',
            '`200` کی جگہ `20 + i * 38` لکھیں۔'
          ],
          solution: 'background("skyblue")\nfor (let i = 0; i < 10; i++) {\n  kite(20 + i * 38, 150, "red")\n}',
          solutionNote: 'اب ہر چکر میں `i` بدلتا ہے، اس لیے `x` بھی بدلتا ہے اور ہر پتنگ نئی جگہ پر بنتی ہے۔',
          check: function (out, code, r, T) {
            var k = T.of(r, 'kite');
            if (!hasFor(code, T)) return { mood: 'nudge', msg: 'پتنگیں بنیں، مگر چکر کہاں گیا؟ ایک ہی `kite` والی لائن `for` کے اندر رکھیں۔' };
            if (k.length !== 10) return { msg: 'ابھی ' + k.length + ' پتنگیں بنیں، 10 چاہئیں۔ چکر کی گنتی `i < 10` ہی رہنے دیں۔' };
            var xs = uniq(k.map(function (s) { return s.x; })).sort(function (a, b) { return a - b; });
            var ys = uniq(k.map(function (s) { return s.y; }));
            if (xs.length === 1 && ys.length === 1) return { msg: 'سب پتنگیں ابھی بھی ایک ہی جگہ پر ہیں، ایک کے اوپر ایک۔ `x` کی جگہ کچھ ایسا لکھیں جس میں `i` ہو۔' };
            if (xs.length === 1) return { mood: 'nudge', msg: 'پتنگیں اوپر نیچے الگ ہو گئیں! مگر قطار کے لیے دائیں بائیں والا نمبر `x` بدلنا ہے۔ `i` کو `kite` کے پہلے نمبر میں لکھیں۔' };
            if (xs.length < 10) return { mood: 'nudge', msg: 'کچھ پتنگیں ابھی بھی ایک ہی جگہ پر ہیں۔ ہر پتنگ کا `x` الگ ہونا چاہیے۔' };
            for (var i = 1; i < xs.length; i++)
              if (xs[i] - xs[i - 1] < 12) return { mood: 'nudge', msg: 'پتنگیں ایک دوسرے پر چڑھی ہوئی ہیں۔ `i` کو بڑے نمبر سے ضرب دیں تاکہ فاصلہ بڑھے۔' };
            if (!k.every(T.fullyOn)) return { mood: 'nudge', msg: 'پتنگیں الگ ہو گئیں، مگر کچھ اسٹیج سے باہر نکل گئیں! فاصلہ کم کریں، یا شروع والا نمبر بدلیں۔' };
            return { pass: true };
          }
        },
        tests: [
          { code: 'background("skyblue")\nfor (let i = 0; i < 10; i++) {\n  kite(25 + i * 35, 200, "green")\n}', pass: true, note: 'another gap and colour' },
          { code: 'background("skyblue")\nfor (let i = 0; i < 10; i++) {\n  kite(20 + i * 38, 60 + i * 30, "red")\n}', pass: true, note: 'a slanting row' },
          { code: 'background("skyblue")\nfor (let i = 0; i < 10; i++) {\n  kite(i * 40, 150, "red")\n}', pass: false, note: 'first kite half off the wall', has: 'باہر' },
          { code: 'background("skyblue")\nfor (let i = 0; i < 10; i++) {\n  kite(200, 25 + i * 38, "red")\n}', pass: false, note: 'changed y instead of x', has: 'قطار' },
          { code: 'background("skyblue")\nfor (let i = 0; i < 10; i++) {\n  kite(150 + i * 3, 150, "red")\n}', pass: false, note: 'kites still piled up', has: 'چڑھی' },
          { code: 'background("skyblue")\nfor (let i = 0; i < 5; i++) {\n  kite(40 + i * 70, 150, "red")\n}', pass: false, note: 'only 5 kites', has: '10 چاہئیں' },
          { code: 'background("skyblue")\nfor (let i = 0; i < 10; i++) {\n  kite(i, 150, "red")\n}', pass: false, note: 'x = i: kites 1 apart', has: 'چڑھی' },
          { code: 'background("skyblue")\nfor (let i = 1; i <= 10; i++) {\n  kite(i * 36, 150, randomColor())\n}', pass: true, note: 'counts 1 to 10, random colours' },
          { code: 'background("skyblue")\nfor (let i = 0; i < 10; i++) {\n  kite(380 - i * 38, 150, "red")\n}', pass: true, note: 'row from right to left' },
          { code: 'background("skyblue")\nfor (let i = 0; i < 10; i++) {\n  kite(20 + i * 38, 150)\n}', pass: false, note: 'forgot the colour (Error Doctor)', has: '3 چیزیں' }
        ],
        recap: 'چکر میں <strong>`i`</strong> ہی وہ چیز ہے جو ہر بار بدلتی ہے۔ `i` کو جگہ میں لکھیں تو ہر چیز نئی جگہ پر بنتی ہے۔'
      },

      {
        id: '4.3', short: 'گنتی', title: 'گنتی اور بڑھتے دائرے',
        learn: {
          say: [
            '`i` کو ہم <strong>کہیں بھی</strong> لکھ سکتے ہیں: `say` میں، جگہ میں، یا سائز میں۔',
            'یہ چکر 1 سے شروع ہوتا ہے۔ `i <= 3` کا مطلب ہے: 3 سے کم <strong>یا برابر</strong>۔ اس لیے `i` بنتا ہے 1، 2، 3۔',
            'نیچے والی مثال میں برڈی `i * 10` بولتا ہے، اور ہر ستارہ پچھلے سے نیچے بنتا ہے۔'
          ],
          example: 'for (let i = 1; i <= 3; i++) {\n  say(i * 10)\n  star(200, i * 100, 25, "gold")\n}',
          flow: true
        },
        task: {
          intro: 'دو خالی جگہیں `___` بھریں۔ برڈی 1 سے 6 تک <strong>گنے</strong>، اور ہر گنتی پر ایک دائرہ پچھلے سے <strong>بڑا</strong> بنے۔',
          steps: [
            '`say(___)` میں `___` مٹا کر وہ چیز لکھیں جو 1، 2، 3… گنتی ہے۔',
            '`circle` میں دوسرے `___` کی جگہ سائز لکھیں جو ہر چکر میں بڑا ہو، مگر سب دائرے اسٹیج کے اندر رہیں۔',
            '«چلاؤ» دبائیں۔'
          ],
          starter: 'for (let i = 1; i <= 6; i++) {\n  say(___)\n  circle(i * 55, 200, ___, "orange")\n}',
          hints: [
            '`i` خود ہی 1، 2، 3… ہے! سائز کو `i` سے کیسے بڑا کریں؟',
            '`say(i)` لکھیں، اور سائز کی جگہ `i * 5`۔ مزہ چاہیے؟ `"orange"` کی جگہ `randomColor()` لکھ کر دیکھیں!'
          ],
          solution: 'for (let i = 1; i <= 6; i++) {\n  say(i)\n  circle(i * 55, 200, i * 5, randomColor())\n}',
          solutionNote: '`i` خود گنتی ہے، اس لیے `say(i)` سے برڈی 1 سے 6 گنتا ہے۔ `i * 5` سے سائز 5، 10، 15… بڑھتا ہے۔',
          check: function (out, code, r, T) {
            var said = out.map(function (o) { return String(o.value).trim(); });
            var nums = said.map(function (t) { var m = /-?\d+$/.exec(t); return m ? +m[0] : null; });  // "3" or "Number 3"
            if (nums.join() !== '1,2,3,4,5,6') {
              if (said.length > 1 && uniq(said).length === 1) return { msg: 'برڈی ہر بار ایک ہی چیز بولا۔ گنتی کے لیے `say` کے اندر صرف `i` لکھیں، بغیر `" "` کے۔' };
              var steps = nums.length > 1 && nums.every(function (n, j) { return n !== null && (j === 0 || n === nums[j - 1] + 1); });
              if (steps && nums[0] !== 1) return { mood: 'nudge', msg: 'برڈی ' + nums[0] + ' سے گننے لگا۔ گنتی 1 سے شروع ہونی چاہیے: `let i = 1` ہی رہنے دیں۔' };
              if (steps && nums[nums.length - 1] !== 6) return { mood: 'nudge', msg: 'برڈی ' + nums[nums.length - 1] + ' پر رک گیا۔ گنتی 6 تک جانی چاہیے: `i <= 6` ہی رہنے دیں۔' };
              return { msg: 'برڈی کو 1 سے 6 تک گننا ہے۔ `say` کے اندر `i` لکھیں۔' };
            }
            if ((T.bare(code).match(/\b(say|console\s*\.\s*log)\s*\(/g) || []).length > 2)
              return { mood: 'nudge', msg: 'برڈی نے گن لیا، مگر اتنے `say` لکھنے کی ضرورت نہیں! چکر کے اندر ایک ہی `say(i)` کافی ہے۔' };
            var c = T.of(r, 'circle');
            if (c.length !== 6) return { msg: '6 دائرے بننے چاہئیں، ابھی ' + c.length + ' بنے۔ `circle` والی لائن چکر کے اندر ہی رہنے دیں۔' };
            var sizes = c.map(function (s) { return s.size; });
            if (uniq(sizes).length === 1) return { mood: 'nudge', msg: 'برڈی گن رہا ہے، مگر دائرے ایک جیسے ہیں۔ سائز میں بھی `i` ڈالیں۔' };
            for (var i = 1; i < sizes.length; i++)
              if (!(sizes[i] > sizes[i - 1])) return { mood: 'nudge', msg: 'ہر دائرہ پچھلے سے بڑا ہونا چاہیے۔ سائز میں `i` کو کسی نمبر سے ضرب دیں، جیسے `i * 5`۔' };
            for (var a = 0; a < c.length; a++)
              for (var b = a + 1; b < c.length; b++)
                if (T.inside(c[a], c[b])) return { mood: 'nudge', msg: 'سب دائرے بنے، مگر بڑے دائرے چھوٹوں کو ڈھانپ رہے ہیں۔ `x` میں `i * 55` رہنے دیں تاکہ ہر دائرہ الگ جگہ پر بنے۔' };
            if (!c.every(T.fullyOn)) return { mood: 'nudge', msg: 'بڑے دائرے اسٹیج سے باہر نکل گئے! سائز میں چھوٹا نمبر لگائیں، جیسے `i * 5`۔' };
            return { pass: true };
          }
        },
        tests: [
          { code: 'for (let i = 1; i <= 6; i++) {\n  say("Number " + i)\n  circle(i * 55, 200, i * 8, "orange")\n}', pass: true, note: 'says Number 1 ..., i * 8' },
          { code: 'for (let i = 1; i <= 6; i++) {\n  console.log(i)\n  circle(i * 55, 200, 5 + i * 4, randomColor())\n}', pass: true, note: 'console.log and 5 + i * 4' },
          { code: 'for (let i = 1; i <= 6; i++) {\n  say(i)\n  circle(i * 55, 200, 25, "orange")\n}', pass: false, note: 'all circles the same size', has: 'ایک جیسے' },
          { code: 'for (let i = 1; i <= 6; i++) {\n  say(i)\n  circle(200, 200, i * 25, "orange")\n}', pass: false, note: 'same place: only the biggest circle shows', has: 'ڈھانپ' },
          { code: 'for (let i = 1; i <= 6; i++) {\n  say(i)\n  circle(i * 55, 200, i * 25, "orange")\n}', pass: false, note: 'big circles off the wall', has: 'باہر' },
          { code: 'for (let i = 1; i <= 6; i++) {\n  say("i")\n  circle(i * 55, 200, i * 5, "orange")\n}', pass: false, note: 'said the letter i', has: 'ایک ہی چیز' },
          { code: 'for (let i = 1; i <= 6; i++) {\n  say(i)\n  circle(i * 55, 200, 40 - i * 5, "orange")\n}', pass: false, note: 'circles get smaller', has: 'بڑا' },
          { code: 'for (let i = 1; i <= 6; i++) {\n  say(i)\n  circle(i * 55, 200, ___, "orange")\n}', pass: false, note: 'second gap still empty' },
          { code: 'for (let i = 1; i < 6; i++) {\n  say(i)\n  circle(i * 55, 200, i * 5, "orange")\n}', pass: false, note: 'i < 6 stops at 5', has: 'رک گیا' },
          { code: 'say(1)\nsay(2)\nsay(3)\nsay(4)\nsay(5)\nsay(6)\nfor (let i = 1; i <= 6; i++) {\n  circle(i * 55, 200, i * 5, "orange")\n}', pass: false, note: 'counted by hand', has: 'say(i)' }
        ],
        recap: '`i <= 6` میں `<=` کا مطلب ہے "6 سے کم <strong>یا برابر</strong>"، اس لیے گنتی 6 تک گئی۔ `i` کو گنتی، سائز یا جگہ، کسی بھی چیز میں ڈال سکتے ہیں۔ اور `randomColor()` ہر بار نیا رنگ چنتا ہے!'
      },

      {
        id: '4.4', short: 'جال', title: 'چکر کے اندر چکر',
        learn: {
          say: [
            'ایک چکر ایک <strong>قطار</strong> بناتا ہے۔ پوری قطار کو بار بار بنانا ہو تو چکر کو دوسرے چکر کے <strong>اندر</strong> رکھتے ہیں۔',
            'باہر والا چکر `row` گنتا ہے (کون سی قطار)۔ اندر والا چکر `col` گنتا ہے (قطار میں کون سا خانہ)۔',
            'ہر `{` کا اپنا `}` ہوتا ہے۔ اندر والا چکر پہلے بند ہوتا ہے۔'
          ],
          example: 'for (let row = 0; row < 2; row++) {\n  for (let col = 0; col < 3; col++) {\n    star(80 + col * 120, 120 + row * 160, 30, "gold")\n  }\n}',
          flow: true
        },
        task: {
          parsons: {
            lines: [
              '  }',
              '    circle(40 + col * 80, 40 + row * 80, 25, "green")',
              'for (let row = 0; row < 5; row++) {',
              '}',
              '  for (let col = 0; col < 5; col++) {'
            ],
            order: [2, 4, 1, 0, 3],
            final: true,
            intro: 'لائنیں بکھر گئی ہیں! انہیں ترتیب دیں تاکہ دائروں کا <strong>جال</strong> بنے: 5 قطاریں، ہر قطار میں 5 دائرے۔',
            steps: [
              '▲ ▼ والے بٹن سے لائنیں اوپر نیچے کریں۔',
              'لائن کے شروع کی خالی جگہ دیکھیں: جتنی زیادہ خالی جگہ، لائن اتنی <strong>اندر</strong>۔',
              '«چلاؤ» دبائیں۔'
            ],
            wrong: 'ابھی جال نہیں بنا۔ کیا `row` والا چکر سب سے باہر ہے، اور `circle` سب سے اندر؟',
            done: 'واہ، پورا جال! 25 دائرے۔',
            check: grid
          },
          hints: [
            'ایک چکر ایک <strong>قطار</strong> بناتا ہے۔ پوری قطاروں کو بار بار بنانے کے لیے کیا چاہیے؟',
            'سب سے اوپر `row` والا چکر، اس کے اندر `col` والا چکر، اور سب سے اندر `circle`۔ پھر پہلے اندر والا `}`، آخر میں باہر والا `}`۔'
          ],
          solution: 'for (let row = 0; row < 5; row++) {\n  for (let col = 0; col < 5; col++) {\n    circle(40 + col * 80, 40 + row * 80, 25, "green")\n  }\n}',
          solutionNote: '`col` والا چکر ایک قطار میں 5 دائرے بناتا ہے، اور `row` والا چکر اسے 5 بار دہراتا ہے۔',
          check: grid
        },
        tests: [
          { code: 'for (let col = 0; col < 5; col++) {\n  for (let row = 0; row < 5; row++) {\n    circle(40 + col * 80, 40 + row * 80, 25, "green")\n  }\n}', pass: true, note: 'col loop outside: still a 5 by 5 grid' },
          { code: 'for (let row = 0; row < 5; row++) {\n  for (let col = 0; col < 5; col++) {\n    circle(40 + col * 80, 40 + row * 80, 25, "green")\n}\n  }', pass: true, note: 'the two } lines swapped' },
          { code: 'for (let row = 0; row < 5; row++) {\n  for (let col = 0; col < 5; col++) {\n  }\n    circle(40 + col * 80, 40 + row * 80, 25, "green")\n}', pass: false, note: 'circle outside the inner loop' },
          { code: '  for (let col = 0; col < 5; col++) {\n    circle(40 + col * 80, 40, 25, "green")\n  }', pass: false, note: 'only one row', has: 'ایک قطار' },
          { code: 'for (let row = 0; row < 5; row++) {\n  for (let col = 0; col < 4; col++) {\n    circle(40 + col * 80, 40 + row * 80, 25, "green")\n  }\n}', pass: false, note: '20 circles', has: '25 دائرے' },
          { code: 'for (let row = 0; row < 5; row++) {\n  for (let col = 0; col < 5; col++) {\n    circle(40 + col * 80, 200, 25, "green")\n  }\n}', pass: false, note: '25 circles on one line', has: 'جال کی شکل' },
          { code: '    circle(40 + col * 80, 40 + row * 80, 25, "green")\nfor (let row = 0; row < 5; row++) {\n  for (let col = 0; col < 5; col++) {\n  }\n}', pass: false, note: 'circle above both loops (Error Doctor)' },
          { code: 'for (let row = 0; row < 5; row++) {\n  }\n    circle(40 + col * 80, 40 + row * 80, 25, "green")\n}\n  for (let col = 0; col < 5; col++) {', pass: false, note: 'a } before its { (Error Doctor)', has: '`}`' }
        ],
        recap: 'اندر والا چکر ہر قطار میں 5 دائرے بناتا ہے، اور باہر والا اسے 5 بار دہراتا ہے۔ 5 قطاریں، 5 خانے: 25 دائرے! چھوٹے کوڈ سے بڑا کام۔'
      },

      {
        id: '4.5', short: 'رنگولی', title: 'رنگولی', make: true,
        bubble: 'آج آپ نقاش ہیں! ✨',
        learn: {
          say: [
            'اب اپنا <strong>نقش</strong> بنائیں: رنگولی، اجرک، یا ٹائلوں والا فرش۔',
            'چکر کے اندر ایک سے زیادہ شکلیں لکھ سکتے ہیں۔ یہ مثال ہر خانے میں ایک چوکور اور اس پر ایک ستارہ بناتی ہے: 50 شکلیں!'
          ],
          example: 'background("maroon")\nfor (let row = 0; row < 5; row++) {\n  for (let col = 0; col < 5; col++) {\n    rect(15 + col * 80, 15 + row * 80, 50, 50, "indigo")\n    star(40 + col * 80, 40 + row * 80, 18, "white")\n  }\n}',
          flow: true
        },
        task: {
          intro: 'چکر سے اپنا نقش بنائیں۔ کم از کم <strong>20 شکلیں</strong> چکر سے بنیں۔',
          steps: [
            '`for` والی کنجی سے ایک چکر لگائیں۔',
            'چکر کے اندر شکلیں لکھیں۔ جگہ یا سائز میں `i` ڈالیں۔',
            'چکر کی گنتی اتنی رکھیں کہ کم از کم 20 شکلیں بنیں۔',
            '«چلاؤ» دبائیں اور اپنا نقش دیکھیں!'
          ],
          starter: 'background("maroon")\n',
          hints: [
            '4.4 والا جال یاد ہے؟ اسے لیں اور شکلیں، رنگ اور فاصلے بدل کر دیکھیں۔',
            'سائز یا جگہ کو `row` اور `col` سے بدلیں، جیسے سائز `10 + col * 5`۔ اور `randomColor()` سے رنگ بھریں!'
          ],
          solution: 'background("maroon")\nfor (let row = 0; row < 5; row++) {\n  for (let col = 0; col < 5; col++) {\n    circle(40 + col * 80, 40 + row * 80, 10 + col * 5, randomColor())\n    star(40 + col * 80, 40 + row * 80, 8, "white")\n  }\n}',
          solutionNote: 'دو چکر مل کر 25 خانے بناتے ہیں۔ ہر خانے میں ایک دائرہ اور ایک ستارہ: 50 شکلیں۔',
          check: function (out, code, r, T) {
            var loop = hasFor(code, T);
            var n = r.shapes.filter(function (s) { return s.type !== 'text' && T.partlyOn(s); }).length;
            if (!loop) return { mood: n ? 'nudge' : undefined, msg: 'اس نقش میں ابھی چکر نہیں ہے۔ `for` والی کنجی سے چکر لگائیں، اور شکلیں اس کے `{ }` کے اندر لکھیں۔' };
            if ((T.bare(code).match(/\b(circle|rect|triangle|star|kite)\s*\(/g) || []).length >= 20)
              return { mood: 'nudge', msg: 'آپ نے اتنی ساری شکلیں ہاتھ سے لکھ دیں! شکل <strong>ایک بار</strong> چکر کے اندر لکھیں، اور چکر سے 20 بار بنوائیں۔' };
            var hidden = r.allShapes.length - r.shapes.length;
            if (n < 20 && r.bgCount > 2 && hidden > 0)
              return { mood: 'nudge', msg: '`background` چکر کے اندر ہے، اس لیے ہر چکر میں پچھلی شکلیں مٹ جاتی ہیں۔ `background` والی لائن چکر سے باہر، سب سے اوپر رکھیں۔' };
            if (n < 20 && hidden > 0 && n + hidden >= 20)
              return { mood: 'nudge', msg: 'شکلیں بنیں، مگر `background` بعد میں آ کر انہیں ڈھانپ گیا۔ `background` والی لائن سب سے اوپر رکھیں۔' };
            if (n < 20) return { mood: 'nudge', msg: 'ابھی اسٹیج پر ' + n + (n === 1 ? ' شکل بنی۔' : ' شکلیں بنیں۔') + ' کم از کم 20 چاہئیں۔ چکر کی گنتی بڑھائیں، یا چکر کے اندر ایک اور چکر لگائیں۔' };
            return { pass: true };
          }
        },
        tests: [
          { code: 'background("maroon")\nfor (let row = 0; row < 5; row++) {\n  for (let col = 0; col < 5; col++) {\n    rect(15 + col * 80, 15 + row * 80, 50, 50, "indigo")\n    star(40 + col * 80, 40 + row * 80, 18, "white")\n  }\n}', pass: true, note: 'the ajrak example' },
          { code: 'background("black")\nfor (let i = 0; i < 20; i++) {\n  circle(200, 200, 200 - i * 10, randomColor())\n}', pass: true, note: 'one loop, 20 rings' },
          { code: 'background("white")\nfor (let i = 0; i < 10; i++) {\n  triangle(i * 40, 100, 40, 40, "orange")\n  rect(i * 40, 250, 30, 30, "teal")\n}', pass: true, note: 'two shapes per round' },
          { code: 'background("maroon")\nfor (let i = 0; i < 8; i++) {\n  star(30 + i * 45, 200, 15, "gold")\n}', pass: false, note: 'only 8 shapes', has: '20' },
          { code: 'background("maroon")\nsay("for (let i = 0")\n' + line(20, 'circle(200, 200, 30, "gold")'), pass: false, note: '20 shapes by hand, for only in a string', has: 'چکر' },
          { code: 'for (let i = 0; i < 25; i++) {\n  circle(20 + i * 15, 200, 10, "gold")\n}\nbackground("maroon")', pass: false, note: 'background last hides everything', has: 'background' },
          { code: 'background("maroon")\nfor (let i = 0; i < 25; i++) {\n  circle(500 + i * 15, 200, 10, "gold")\n}', pass: false, note: 'all shapes off the wall', has: '20' },
          { code: 'background("maroon")\nfor (let i = 0; i < 25; i++) {\n  background("navy")\n  circle(20 + i * 15, 200, 10, "gold")\n}', pass: false, note: 'background inside the loop', has: 'چکر کے اندر' },
          { code: 'background("maroon")\nfor (let i = 0; i < 1; i++) {\n}\n' + line(20, 'circle(200, 200, 30, "gold")'), pass: false, note: 'empty loop, 20 shapes by hand', has: 'ہاتھ' },
          { code: 'background("maroon")\nfor (let i = 0; i < 19; i++) {\n  star(20 + i * 19, 200, 10, randomColor())\n}', pass: false, note: '19 stars', has: '19' }
        ],
        recap: 'آپ نے کمپیوٹر سے وہ کام کروایا جسے ہاتھ سے کرنے میں گھنٹوں لگ جاتے! کپڑوں اور ٹائلوں کے ڈیزائن بھی ایسے ہی کوڈ سے بنتے ہیں۔'
      }
    ]
  };

  // What Mithu says out loud: very short, very simple English, read slowly by the device's own voice.
  var VOICE = {
    '4.1': {
      learn: 'When we want to do the same job again and again, we use a loop. The loop line has three small parts. Let i be 0 means: start at 0. i less than 5 means: keep going while i is less than 5. i plus plus means: add 1 to i after each round. So i goes 0, 1, 2, 3, 4. Five rounds, five stars! The star sign means times. So i times 70 puts each star 70 steps after the one before.',
      guess: 'Now the loop starts at 1. How many stars will it draw? Choose one answer.',
      why: 'i was 1, 2, 3 and 4. At 5, i less than 5 is false, so the loop stops. Only four rounds, so four stars.',
      task: 'Your turn. Make 8 stars, and keep them all on the wall. One. Find the number that says how many times the loop runs. Make it 8. Two. Press Run. Are all the stars on the wall? Three. If not, make the gap of 70 smaller, and press Run again.',
      hints: ['Which number says how many times the loop runs? And which number is the gap between the stars?',
              'Change i less than 5 to i less than 8. And change 70 to 45, so all the stars fit.'],
      solution: 'i less than 8 makes the loop run 8 times. A gap of 45 keeps all the stars on the wall.',
      recap: 'Well done! You changed one number, and got 8 stars. In a loop, you write the job once. The computer repeats it as many times as you want.'
    },
    '4.2': {
      learn: 'A new command: kite. It draws a kite. In a loop, i changes every round. If you put i in the place of a shape, the place changes too. So each circle is drawn in a new place.',
      guess: 'This code draws 10 kites. How many will you see on the wall? Choose one answer.',
      why: 'Ten kites were drawn. But all in the same place, one on top of the other. So you see only one.',
      task: 'Your turn. Fix the bug, so you see 10 kites in a row. One. In the kite line, find the x number, 200. Two. Change it to something with i in it, so each kite gets a new place. Three. Press Run. Are all the kites on the wall?',
      hints: ['All the kites are drawn in the same place. Which thing changes in every round?',
              'In place of 200, write: 20 plus i times 38.'],
      solution: 'Now i changes every round, so x changes too. Each kite is drawn in a new place.',
      recap: 'Well done! In a loop, i is the thing that changes every time. Put i in the place, and each shape goes to a new place.'
    },
    '4.3': {
      learn: 'You can put i anywhere. In say. In the place. Or in the size. This loop starts at 1. Less than or equal to 3 means: up to 3. So i is 1, then 2, then 3.',
      task: 'Your turn. Fill the two gaps. Birdy should count from 1 to 6. And each circle should be bigger than the one before. One. In say, delete the gap. Write the thing that counts 1, 2, 3. Two. In circle, fill the second gap with a size that grows. Keep all the circles on the wall. Three. Press Run.',
      hints: ['i is already 1, 2, 3, and so on! How can you use i to make the size bigger?',
              'Write say i. For the size, write i times 5. Want some fun? Put random color in place of orange!'],
      solution: 'i is the count, so say i makes Birdy count to 6. i times 5 makes the size grow: 5, 10, 15, and so on.',
      recap: 'Well done! Less than or equal to 6 means the count goes up to 6. You can put i in a count, a size, or a place. And random color picks a new colour every time!'
    },
    '4.4': {
      learn: 'One loop makes one row. To make many rows, we put a loop inside another loop. The outside loop counts the rows. The inside loop counts the places in a row. Every open curly bracket has its own close curly bracket.',
      taskA: 'The lines are mixed up! Put them in order, to make a grid of circles. Five rows, with five circles in each row. Use the up and down buttons. Look at the space at the start of each line. More space means further inside. Then press Run.',
      hints: ['One loop makes one row. What do you need to make that row again and again?',
              'The row loop goes on top. The col loop goes inside it. The circle goes in the middle. Then close the inside loop first, and the outside loop last.'],
      solution: 'The col loop makes 5 circles in a row. The row loop repeats that row 5 times.',
      recap: 'Well done! The inside loop makes 5 circles in each row. The outside loop repeats it 5 times. 5 rows of 5 makes 25 circles! Small code, big job.'
    },
    '4.5': {
      learn: 'Now make your own pattern. It can be a rangoli, an ajrak, or a tiled floor. You can put more than one shape inside a loop. This example draws a square and a star in every place. That is 50 shapes!',
      task: 'Make your own pattern with a loop. Draw at least 20 shapes with it. Add a loop with the for key. Write shapes inside the loop. Put i in the place or the size. Then press Run, and look at your pattern!',
      hints: ['Remember the grid from the last level? Take it, and change the shapes, colours and gaps.',
              'Let row and col change the size or the place. And fill it with random colors!'],
      solution: 'Two loops make 25 places. Each place gets a circle and a star. That is 50 shapes.',
      recap: 'Amazing! The computer did a job that would take hours by hand. Designs on clothes and tiles are made with code like this too.'
    }
  };
  M.levels.forEach(function (L) { L.voice = VOICE[L.id]; });
  (window.MODULES = window.MODULES || []).push(M);
})();
