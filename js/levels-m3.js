// Module 3: رنگوں کی دنیا (World of colours = drawing)
// Every level: learn -> guess (optional) -> task -> recap. Children only ever type English, colours too.
// The drawing wall is 400 x 400. (0, 0) is the top-left corner, x grows to the right, y grows downwards.
(function () {
  // The biggest rect on the wall (the wall of the house in 3.4).
  function biggestRect(r, T) {
    return T.of(r, 'rect').reduce(function (a, s) { return !a || Math.abs(s.w * s.h) > Math.abs(a.w * a.h) ? s : a; }, null);
  }
  // A rect that stands on the bottom edge of the wall: the door.
  function isDoor(s, wall) { return s.type === 'rect' && s.y + s.h >= wall.y + wall.h - 2; }

  var M = {
    id: 'm3',
    number: 3,
    title: 'رنگوں کی دنیا',
    badge: { name: 'کوڈ مصور', line: 'آپ نے کوڈ سے تصویر بنا دی!' },
    next: 'اگلے ماڈیول میں برڈی ایک ہی کام <strong>بار بار</strong> کرنا سیکھے گا۔',
    stage: { draw: true, boxes: false },

    lesson:
      '<p>اسٹیج پر ہر جگہ کا ایک پتا ہوتا ہے: `x` اور `y`۔</p>' +
      '<p>`x` = بائیں کنارے سے کتنا دور۔ دھیان رہے، اردو کے الٹ، گنتی <strong>بائیں</strong> سے شروع ہوتی ہے!</p>' +
      '<p>`y` = اوپر کے کنارے سے کتنا نیچے۔ `(0, 0)` اوپر بائیں کونا ہے۔ اسٹیج 400 چوڑا اور 400 اونچا ہے۔</p>' +
      '<p>`circle(x, y, size, color)` دائرہ بناتا ہے۔ `rect(x, y, width, height, color)` چوکور بناتا ہے۔</p>' +
      '<p>جو شکل <strong>بعد میں</strong> بنے، وہ <strong>اوپر</strong> نظر آتی ہے۔</p>' +
      '<p>رنگ انگریزی میں اور `" "` کے اندر لکھیں: `"red"`، `"green"`، `"skyblue"`۔</p>',

    commands: [
      { code: 'circle(x, y, size, color)', ur: 'دائرہ بناتا ہے۔ `x` اور `y` دائرے کا بیچ ہے، `size` اس کا سائز۔', from: '3.1' },
      { code: 'background(color)', ur: 'پورے اسٹیج کو ایک رنگ سے رنگ دیتا ہے۔', from: '3.2' },
      { code: 'rect(x, y, width, height, color)', ur: 'چوکور بناتا ہے۔ `x` اور `y` اس کا اوپر والا بایاں کونا ہے۔', from: '3.3' },
      { code: 'triangle(x, y, width, height, color)', ur: 'تکون بناتا ہے، نوک اوپر کی طرف۔', from: '3.4' },
      { code: 'star(x, y, size, color)', ur: 'ستارہ بناتا ہے۔', from: '3.5' },
      { code: 'text(words, x, y, color)', ur: 'اسٹیج پر الفاظ لکھتا ہے۔ رنگ لکھنا ضروری نہیں۔', from: '3.5' }
    ],

    keys: [
      { t: 'circle(…)', ins: 'circle(|)', tpl: true },
      { t: 'rect(…)', ins: 'rect(|)', tpl: true },
      { t: ',', ins: ', ' },
      { t: '"', ins: '"' },
      { t: '(', ins: '(' },
      { t: ')', ins: ')' },
      { t: '↵', ins: '\n' }
    ],

    levels: [
      {
        id: '3.1', short: 'نقطہ', title: 'نقطہ کہاں آئے گا؟',
        learn: {
          say: [
            'برڈی اب <strong>تصویر</strong> بنائے گا! اسٹیج پر ہر جگہ کا ایک پتا ہے: `x` اور `y`۔',
            '`x` بتاتا ہے کہ <strong>بائیں</strong> کنارے سے کتنا دور۔ دھیان رہے، اردو کے الٹ، گنتی بائیں سے شروع ہوتی ہے! `y` بتاتا ہے کہ اوپر سے کتنا <strong>نیچے</strong>۔',
            'اسٹیج پر کہیں بھی انگلی رکھیں تو اس جگہ کا `(x, y)` نظر آئے گا۔ «جالی» دبائیں تو خانے بھی دکھائی دیں گے۔'
          ],
          example: 'circle(50, 50, 20, "red")',
          parts: [
            { t: 'circle', l: 'حکم: دائرہ' },
            { t: '(', l: 'بریکٹ' },
            { t: '50', l: 'x: بائیں سے' },
            { t: '50', l: 'y: اوپر سے' },
            { t: '20', l: 'سائز' },
            { t: '"red"', l: 'رنگ' },
            { t: ')', l: 'بریکٹ بند' }
          ]
        },
        guess: {
          q: 'یہ لال نقطہ اسٹیج پر <strong>کہاں</strong> بنے گا؟',
          code: 'circle(100, 300, 20, "red")',
          options: ['اوپر بائیں', 'نیچے بائیں', 'اوپر دائیں', 'نیچے دائیں'],
          correct: 1,
          why: '`x` میں 100 کا مطلب ہے: بائیں کنارے سے صرف 100 دور، یعنی <strong>بائیں</strong>۔ `y` میں 300 کا مطلب ہے: اوپر سے 300 نیچے، یعنی <strong>نیچے</strong>۔'
        },
        task: {
          intro: 'لال نقطے کو اسٹیج کے <strong>اوپر دائیں</strong> کونے میں لے جائیں۔',
          steps: [
            'پہلا نمبر `x` ہے۔ اسے بدل کر نقطے کو <strong>دائیں</strong> لے جائیں۔',
            'دوسرا نمبر `y` ہے۔ اسے بدل کر نقطے کو <strong>اوپر</strong> لے جائیں۔',
            '«چلاؤ» دبائیں۔'
          ],
          starter: 'circle(100, 300, 20, "red")',
          hints: [
            'دائیں جانا ہو تو `x` بڑا کریں یا چھوٹا؟ اوپر جانا ہو تو `y` بڑا کریں یا چھوٹا؟',
            '`x` کو 350 کے قریب اور `y` کو 50 کے قریب کریں: `circle(350, 50, 20, "red")`'
          ],
          solution: 'circle(350, 50, 20, "red")',
          solutionNote: '`x` بڑا ہوا تو نقطہ دائیں گیا، `y` چھوٹا ہوا تو نقطہ اوپر گیا۔',
          check: function (out, code, r, T) {
            var cs = T.of(r, 'circle');
            if (!cs.length) return { msg: 'اسٹیج پر کوئی دائرہ نہیں بنا۔ کیا لائن `circle(` سے شروع ہوتی ہے؟' };
            if (cs.some(function (c) { return c.x >= 300 && c.y <= 100 && T.partlyOn(c); })) return { pass: true };
            var c = cs[cs.length - 1];
            if (!T.partlyOn(c)) return { mood: 'nudge', msg: 'نقطہ اسٹیج سے باہر نکل گیا! اسٹیج 400 چوڑا اور 400 اونچا ہے۔ `x` اور `y` کو 0 اور 400 کے بیچ رکھیں۔' };
            if (c.x >= 300) return { mood: 'nudge', msg: 'نقطہ دائیں تو آ گیا! اب اسے اور <strong>اوپر</strong> لے جائیں: `y` اور چھوٹا کریں، جیسے 50۔ یاد رکھیں: `y` جتنا چھوٹا، نقطہ اتنا اوپر۔' };
            if (c.y <= 100) return { mood: 'nudge', msg: 'نقطہ اوپر تو آ گیا! اب اسے اور <strong>دائیں</strong> لے جائیں: `x` اور بڑا کریں، جیسے 350۔' };
            return { msg: 'نقطہ ابھی اوپر دائیں کونے میں نہیں۔ دائیں جانے کے لیے `x` بڑا کریں، اوپر جانے کے لیے `y` چھوٹا۔' };
          }
        },
        tests: [
          { code: 'circle(380, 20, 20, "red")', pass: true, note: 'right in the corner' },
          { code: 'circle(320, 80, 10, "blue")', pass: true, note: 'other colour, smaller dot' },
          { code: 'circle(350, 350, 20, "red")', pass: false, note: 'went bottom-right', has: 'دائیں تو آ گیا' },
          { code: 'circle(300, 50, 20, "red")', pass: true, note: 'edge of the corner, x = 300' },
          { code: 'circle(350, 100, 20, "red")', pass: true, note: 'edge of the corner, y = 100' },
          { code: 'circle(50, 50, 20, "red")', pass: false, note: 'went top-left', has: 'بڑا' },
          { code: 'circle(500, 50, 20, "red")', pass: false, note: 'off the wall', has: 'باہر' },
          { code: 'circle(200, 200, 20, "red")', pass: false, note: 'only to the middle', has: 'اوپر دائیں' },
          { code: 'circle(100, 300, 20, "red")\ncircle(350, 50, 20, "red")', pass: true, note: 'kept the old dot, added a new one' },
          { code: 'circle(350,50,20,"Red")', pass: true, note: 'no spaces, capital colour' },
          { code: 'Circle(350, 50, 20, "red")', pass: false, note: 'capital C', has: '`circle`' },
          { code: 'circle(350, 50, 20, red)', pass: false, note: 'colour without quotes', has: '`" "`' }
        ],
        recap: 'کمپیوٹر کی دنیا میں `(0, 0)` <strong>اوپر بائیں</strong> کونا ہے۔ `x` بڑھے تو دائیں، `y` بڑھے تو <strong>نیچے</strong>۔ یہ کتاب والے گراف سے الٹا ہے، تو دھیان رکھیں!'
      },

      {
        id: '3.2', short: 'سورج', title: 'سورج نکلا',
        learn: {
          say: [
            '`background` پورے اسٹیج کو ایک رنگ سے رنگ دیتا ہے، جیسے آسمان۔',
            'حکم کے اندر کی چیزیں <strong>ان پٹ</strong> کہلاتی ہیں۔ `circle` کے ان پٹ ہمیشہ اسی ترتیب میں آتے ہیں: `x`، `y`، سائز، رنگ۔',
            'ہر ان پٹ کے بیچ میں `,` لگتا ہے۔'
          ],
          example: 'background("lightgreen")\ncircle(200, 200, 40, "white")',
          flow: true
        },
        guess: {
          q: 'پہلے کوڈ تھا `circle(200, 200, 20, "yellow")`۔ ہم نے تیسرا نمبر `20` سے `60` کر دیا۔ اب کیا بدلے گا؟',
          code: 'background("skyblue")\ncircle(200, 200, 60, "yellow")',
          options: ['دائرہ دائیں چلا جائے گا', 'دائرہ بڑا ہو جائے گا', 'دائرے کا رنگ بدل جائے گا'],
          correct: 1,
          why: 'تیسرا نمبر <strong>سائز</strong> ہے۔ سائز بڑا کیا تو دائرہ بڑا ہو گیا۔ جگہ اور رنگ وہی رہے۔'
        },
        task: {
          intro: 'آسمان میں ایک <strong>بڑا پیلا سورج</strong> بنائیں، اوپر بائیں کونے میں۔',
          steps: [
            '`x` اور `y` چھوٹے کریں تاکہ سورج اوپر بائیں آ جائے۔',
            'سائز 40 یا اس سے بڑا کریں۔',
            '«چلاؤ» دبائیں۔'
          ],
          starter: 'background("skyblue")\ncircle(200, 200, 20, "yellow")',
          hints: [
            'حکم کے اندر ہر نمبر کا اپنا کام ہے: پہلا `x`، دوسرا `y`، تیسرا سائز۔',
            'ایسے لکھیں: `circle(80, 80, 50, "yellow")`'
          ],
          solution: 'background("skyblue")\ncircle(80, 80, 50, "yellow")',
          solutionNote: '`x` اور `y` 80 ہیں، اس لیے سورج اوپر بائیں ہے۔ سائز 50 ہے، اس لیے سورج بڑا ہے۔',
          check: function (out, code, r, T) {
            if (r.allShapes.length > r.shapes.length) return { msg: 'سورج بنا تو، مگر `background` نے اسے ڈھانپ دیا! `background` والی لائن سب سے اوپر رکھیں۔' };
            if (!r.bg) return { mood: 'nudge', msg: 'آسمان کہاں گیا؟ سب سے اوپر `background("skyblue")` والی لائن واپس لکھیں۔' };
            var cs = T.of(r, 'circle');
            if (!cs.length) return { msg: 'اسٹیج پر کوئی سورج نہیں بنا۔ `circle` والی لائن لکھیں۔' };
            if (cs.some(function (c) { return T.isFamily(c.color, 'yellow') && c.x < 150 && c.y < 150 && c.size >= 40 && T.partlyOn(c); })) return { pass: true };
            var ys = cs.filter(function (s) { return T.isFamily(s.color, 'yellow'); });
            var c = ys.length ? ys[ys.length - 1] : cs[cs.length - 1];
            if (!T.isFamily(c.color, 'yellow')) return { mood: 'nudge', msg: 'سورج تو پیلا ہوتا ہے! رنگ `"yellow"` یا `"gold"` لکھیں۔' };
            if (c.size < 40) return { mood: 'nudge', msg: 'سورج ابھی چھوٹا ہے۔ تیسرا نمبر، یعنی سائز، 40 یا اس سے بڑا کریں۔' };
            if (!T.partlyOn(c)) return { mood: 'nudge', msg: 'سورج اسٹیج سے باہر نکل گیا! `x` اور `y` کو 0 اور 400 کے بیچ رکھیں۔' };
            return { mood: 'nudge', msg: 'سورج بڑا اور پیلا ہے! اب اسے <strong>اوپر بائیں</strong> کونے میں لے جائیں: `x` اور `y` دونوں 150 سے چھوٹے کریں۔' };
          }
        },
        tests: [
          { code: 'background("skyblue")\ncircle(100, 60, 45, "gold")', pass: true, note: 'gold, other spot' },
          { code: 'background("lightblue")\ncircle(70, 70, 60, "yellow")', pass: true, note: 'other sky colour' },
          { code: 'background("skyblue")\ncircle(80, 80, 20, "yellow")', pass: false, note: 'right place, still small', has: 'چھوٹا' },
          { code: 'background("skyblue")\ncircle(320, 80, 50, "yellow")', pass: false, note: 'top-right instead of top-left', has: 'اوپر بائیں' },
          { code: 'background("skyblue")\ncircle(80, 80, 50, "blue")', pass: false, note: 'wrong colour', has: 'پیلا' },
          { code: 'circle(80, 80, 50, "yellow")\nbackground("skyblue")', pass: false, note: 'background drawn after the sun', has: 'ڈھانپ' },
          { code: 'circle(80, 80, 50, "yellow")', pass: false, note: 'deleted the sky', has: 'آسمان' },
          { code: 'background("skyblue")\ncircle(80, 80, 50, "yellow")\ncircle(300, 70, 30, "white")', pass: true, note: 'sun plus a cloud' },
          { code: 'background("skyblue")\ncircle(80, 80, 20, "yellow")\ncircle(300, 70, 30, "white")', pass: false, note: 'small sun plus a cloud: talk about the sun', has: 'چھوٹا' },
          { code: 'background("skyblue")\ncircle(80, 80, "yellow", 50)', pass: false, note: 'size and colour swapped', has: 'سائز' }
        ],
        recap: 'حکم کے اندر کی چیزیں <strong>ان پٹ</strong> کہلاتی ہیں۔ ان کی <strong>ترتیب</strong> اہم ہے: پہلے جگہ، پھر سائز، پھر رنگ۔'
      },

      {
        id: '3.3', short: 'درخت', title: 'درخت لگائیں',
        learn: {
          say: [
            '`rect` چوکور بناتا ہے۔ اس کے 5 ان پٹ ہیں: `x`، `y`، چوڑائی، اونچائی، رنگ۔',
            'یہاں `x` اور `y` چوکور کا <strong>اوپر والا بایاں کونا</strong> ہے۔ چوڑائی دائیں طرف اور اونچائی نیچے کی طرف ناپی جاتی ہے۔',
            'ناپنے کے لیے «جالی» کھولیں، یا اسٹیج پر انگلی رکھ کر `(x, y)` دیکھیں۔'
          ],
          example: 'rect(100, 150, 200, 100, "orange")',
          parts: [
            { t: 'rect', l: 'حکم: چوکور' },
            { t: '100', l: 'x: کونا' },
            { t: '150', l: 'y: کونا' },
            { t: '200', l: 'چوڑائی' },
            { t: '100', l: 'اونچائی' },
            { t: '"orange"', l: 'رنگ' }
          ]
        },
        task: {
          intro: 'ایک درخت لگائیں! کوڈ میں تین جگہ `___` خالی ہے۔ انہیں صحیح نمبروں سے بھریں۔',
          steps: [
            '<strong>زمین</strong> (`ground`): چوڑائی اتنی رکھیں کہ زمین پورے اسٹیج پر پھیل جائے۔',
            '<strong>تنا</strong> (`trunk`): اونچائی اتنی رکھیں کہ تنا زمین تک پہنچے۔ زمین 320 سے شروع ہوتی ہے۔',
            '<strong>پتے</strong> (`leaves`): سائز اتنا رکھیں کہ پتے تنے کو چھوئیں۔ پھر «چلاؤ» دبائیں۔'
          ],
          starter: 'background("skyblue")\nrect(0, 320, ___, 80, "green")     // ground\nrect(190, 220, 20, ___, "brown")   // trunk\ncircle(200, 200, ___, "green")     // leaves',
          hints: [
            'اسٹیج کتنا چوڑا ہے؟ تنا 220 سے شروع ہوتا ہے۔ 320 تک پہنچنے کے لیے کتنا لمبا ہو؟',
            'زمین کی چوڑائی `400`، تنے کی اونچائی `100`، پتوں کا سائز `40`۔'
          ],
          solution: 'background("skyblue")\nrect(0, 320, 400, 80, "green")     // ground\nrect(190, 220, 20, 100, "brown")   // trunk\ncircle(200, 200, 40, "green")     // leaves',
          solutionNote: 'اسٹیج 400 چوڑا ہے۔ تنا 220 سے 100 نیچے جا کر 320 پر زمین سے ملتا ہے۔ سائز 40 کے پتے تنے کو ڈھانپ لیتے ہیں۔',
          check: function (out, code, r, T) {
            var rects = T.of(r, 'rect');
            var ground = rects.filter(function (s) { return s.y >= 300; })[0];
            var trunk = rects.filter(function (s) { return s.y < 300; })[0];
            var leaves = T.of(r, 'circle')[0];
            if (!ground || !trunk || !leaves) return { msg: 'زمین، تنا یا پتے غائب ہیں۔ تینوں لائنیں رکھیں اور صرف `___` والی جگہ بھریں۔' };
            if (ground.x > 0 || ground.x + ground.w < 400) return { mood: 'nudge', msg: 'زمین ابھی پورے اسٹیج پر نہیں پھیلی۔ اسٹیج کتنا چوڑا ہے؟ زمین کی چوڑائی اتنی ہی کریں۔' };
            if (trunk.y + trunk.h < ground.y) return { mood: 'nudge', msg: 'درخت ہوا میں لٹک رہا ہے! تنے کی اونچائی بڑھائیں تاکہ وہ زمین تک پہنچے۔' };
            if (!T.overlap(leaves, trunk)) return { mood: 'nudge', msg: 'پتے تنے سے الگ ہیں! پتوں کا سائز بڑا کریں تاکہ وہ تنے کو چھوئیں۔' };
            return { pass: true };
          }
        },
        tests: [
          { code: 'background("skyblue")\nrect(0, 320, 400, 80, "green")\nrect(190, 220, 20, 100, "brown")\ncircle(200, 200, 60, "green")', pass: true, note: 'bigger leaves' },
          { code: 'background("skyblue")\nrect(0, 320, 500, 80, "green")\nrect(190, 220, 20, 120, "brown")\ncircle(200, 200, 40, "darkgreen")', pass: true, note: 'wider ground, longer trunk, other green' },
          { code: 'background("skyblue")\nrect(0, 320, 400, 80, "green")\nrect(190, 220, 20, 50, "brown")\ncircle(200, 200, 40, "green")', pass: false, note: 'trunk floating', has: 'ہوا میں' },
          { code: 'background("skyblue")\nrect(0, 320, 200, 80, "green")\nrect(190, 220, 20, 100, "brown")\ncircle(200, 200, 40, "green")', pass: false, note: 'ground only half the wall', has: 'زمین' },
          { code: 'background("skyblue")\nrect(0, 320, 400, 80, "green")\nrect(190, 220, 20, 100, "brown")\ncircle(200, 200, 10, "green")', pass: false, note: 'leaves too small to touch the trunk', has: 'پتے' },
          { code: 'background("skyblue")\nrect(0, 320, 400, 80, "green")\nrect(190, 220, 20, ___, "brown")\ncircle(200, 200, 40, "green")', pass: false, note: 'one gap left', has: 'خالی جگہ' },
          { code: 'background("skyblue")\ncircle(200, 200, 40, "green")\nrect(0, 320, 400, 80, "green")\nrect(190, 220, 20, 100, "brown")', pass: true, note: 'leaves drawn first' },
          { code: 'background("skyblue")\nrect(0, 320, 400, 80, "green")\nrect(190, 220, 20, 100, "brown")\ncircle(200, 200, "40", "green")', pass: false, note: 'number in quotes', has: 'نمبر' },
          { code: 'background("skyblue")\nrect(0, 320, 400, 80, "green")\nrect(190, 220, 20, 100 "brown")\ncircle(200, 200, 40, "green")', pass: false, note: 'missing comma' }
        ],
        recap: '`rect` کے لیے پہلے <strong>کونے کی جگہ</strong> `(x, y)`، پھر <strong>چوڑائی</strong> اور <strong>اونچائی</strong>۔ آپ نے ناپ تول کر تصویر بنائی، بالکل انجینئر کی طرح!'
      },

      {
        id: '3.4', short: 'تہیں', title: 'میرا گھر',
        learn: {
          say: [
            'کمپیوٹر ہر شکل پچھلی شکل کے <strong>اوپر</strong> بناتا ہے، جیسے کاغذ پر کاغذ رکھنا۔',
            'اس لیے جو شکل <strong>بعد میں</strong> بنے، وہ اوپر نظر آتی ہے۔',
            'نیا حکم: `triangle` تکون بناتا ہے۔ اس کی نوک اوپر بیچ میں ہوتی ہے۔ ان پٹ `rect` والے ہی ہیں۔'
          ],
          example: 'rect(100, 200, 200, 150, "gold")\ntriangle(100, 100, 200, 100, "green")\ncircle(200, 280, 40, "red")',
          flow: true
        },
        task: {
          parsons: {
            lines: [
              'rect(170, 280, 60, 70, "brown")     // door',
              'triangle(100, 150, 200, 80, "red")  // roof',
              'rect(100, 230, 200, 120, "orange")  // wall'
            ],
            order: [2, 1, 0],
            intro: 'گھر کا <strong>دروازہ</strong> نظر نہیں آ رہا! لائنوں کی ترتیب ٹھیک کریں تاکہ دیوار، چھت اور دروازہ سب دکھائی دیں۔',
            steps: [
              '▲ ▼ والے بٹن سے لائنیں اوپر نیچے کریں۔',
              'سوچیں: کون سی چیز سب سے پیچھے ہے؟ وہ سب سے پہلے بنے۔',
              '«چلاؤ» دبائیں۔'
            ],
            hints: ['کمپیوٹر ہر چیز پچھلی چیز کے <strong>اوپر</strong> بناتا ہے، جیسے کاغذ پر کاغذ رکھنا۔ دروازہ کب بننا چاہیے؟', 'دیوار سب سے پہلے، پھر چھت، اور دروازہ دیوار کے <strong>بعد</strong>، سب سے نیچے والی لائن میں۔'],
            wrong: 'دروازہ بنا تو ہے، مگر گھر کی دیوار نے اسے ڈھانپ لیا۔ دروازے والی لائن دیوار والی لائن سے <strong>نیچے</strong> لے جائیں۔',
            done: 'زبردست! اب پورا گھر نظر آ رہا ہے۔ ایک آخری کام۔',
            check: function (out, code, r, T) {
              var wall = biggestRect(r, T);
              var door = T.of(r, 'rect').filter(function (s) { return s !== wall; })[0];
              if (wall && door && r.shapes.indexOf(door) > r.shapes.indexOf(wall)) return { pass: true };
              return { msg: 'دروازہ بنا تو ہے، مگر گھر کی دیوار نے اسے ڈھانپ لیا۔ دروازے والی لائن دیوار والی لائن سے <strong>نیچے</strong> لے جائیں۔' };
            }
          },
          intro: 'اب گھر کی دیوار پر ایک <strong>کھڑکی</strong> لگائیں۔',
          steps: [
            'سب سے نیچے ایک نئی لائن بنائیں۔',
            'لکھیں: `rect(120, 250, 40, 40, "white")`، یا اپنی پسند کی جگہ اور رنگ۔',
            'کھڑکی <strong>گھر کی دیوار کے اندر</strong> ہو۔ پھر «چلاؤ» دبائیں۔'
          ],
          hints: [
            'گھر کی دیوار `x` 100 سے 300 تک اور `y` 230 سے 350 تک ہے۔ کھڑکی اس کے اندر ہو، اور دیوار کے <strong>بعد</strong> بنے۔',
            'آخری لائن کے نیچے لکھیں: `rect(120, 250, 40, 40, "white")`'
          ],
          solution: 'rect(100, 230, 200, 120, "orange")  // wall\ntriangle(100, 150, 200, 80, "red")  // roof\nrect(170, 280, 60, 70, "brown")     // door\nrect(120, 250, 40, 40, "white")     // window',
          solutionNote: 'دیوار سب سے پہلے بنی۔ دروازہ اور کھڑکی دیوار کے <strong>بعد</strong> بنے، اس لیے اوپر نظر آتے ہیں۔',
          check: function (out, code, r, T) {
            if (r.allShapes.length > r.shapes.length) return { msg: 'گھر بنا تو، مگر `background` نے اسے ڈھانپ دیا! `background` والی لائن سب سے اوپر رکھیں۔' };
            var wall = biggestRect(r, T);
            if (!wall) return { msg: 'گھر کی دیوار نظر نہیں آ رہی۔ دیوار والی `rect` لائن واپس لکھیں۔' };
            var wi = r.shapes.indexOf(wall);
            var inner = r.shapes.filter(function (s) { return s !== wall && T.inside(s, wall); });
            var hidden = inner.filter(function (s) { return r.shapes.indexOf(s) < wi; });
            if (hidden.length) {
              var d = hidden.some(function (s) { return isDoor(s, wall); });
              return { msg: (d ? 'دروازہ بنا' : 'کھڑکی بنی') + ' تو ہے، مگر گھر کی دیوار نے اسے ڈھانپ لیا۔ ' + (d ? 'دروازے' : 'کھڑکی') + ' والی لائن دیوار والی لائن سے <strong>نیچے</strong> لے جائیں۔' };
            }
            if (!T.of(r, 'triangle').length) return { mood: 'nudge', msg: 'چھت کہاں گئی؟ `triangle` والی لائن واپس لکھیں۔' };
            var doors = inner.filter(function (s) { return isDoor(s, wall); });
            if (!doors.length) return { mood: 'nudge', msg: 'دروازہ کہاں گیا؟ `rect(170, 280, 60, 70, "brown")` والی لائن واپس لکھیں۔' };
            var windows = inner.filter(function (s) { return !isDoor(s, wall); });
            if (windows.some(function (s) { return s.color !== wall.color; })) return { pass: true };
            if (windows.length) return { mood: 'nudge', msg: 'کھڑکی بن گئی، مگر اس کا رنگ دیوار جیسا ہے، اس لیے نظر نہیں آ رہی! کوئی اور رنگ لکھیں، جیسے `"white"`۔' };
            var outside = r.shapes.filter(function (s) { return s !== wall && s.type !== 'triangle' && !T.inside(s, wall); });
            if (outside.length) return { mood: 'nudge', msg: 'کھڑکی بن گئی، مگر گھر کی دیوار کے اندر پوری نہیں! دیوار `x` 100 سے 300 تک اور `y` 230 سے 350 تک ہے۔' };
            return { mood: 'nudge', msg: 'ترتیب ٹھیک ہے! اب گھر کی دیوار پر ایک کھڑکی لگائیں، جیسے `rect(120, 250, 40, 40, "white")`۔' };
          }
        },
        tests: [
          { code: 'triangle(100, 150, 200, 80, "red")\nrect(100, 230, 200, 120, "orange")\nrect(170, 280, 60, 70, "brown")\nrect(240, 250, 40, 40, "skyblue")', pass: true, note: 'roof first, window on the right' },
          { code: 'rect(100, 230, 200, 120, "orange")\ntriangle(100, 150, 200, 80, "red")\nrect(170, 280, 60, 70, "brown")\ncircle(140, 270, 20, "white")', pass: true, note: 'round window' },
          { code: 'rect(100, 230, 200, 120, "orange")\ntriangle(100, 150, 200, 80, "red")\nrect(170, 280, 60, 70, "brown")\nrect(120, 250, 40, 40, "white")\nrect(240, 250, 40, 40, "white")', pass: true, note: 'two windows' },
          { code: 'rect(170, 280, 60, 70, "brown")\nrect(100, 230, 200, 120, "orange")\ntriangle(100, 150, 200, 80, "red")\nrect(120, 250, 40, 40, "white")', pass: false, note: 'door hidden behind the wall', has: 'دروازے والی لائن' },
          { code: 'rect(120, 250, 40, 40, "white")\nrect(100, 230, 200, 120, "orange")\ntriangle(100, 150, 200, 80, "red")\nrect(170, 280, 60, 70, "brown")', pass: false, note: 'window hidden behind the wall', has: 'کھڑکی والی لائن' },
          { code: 'rect(100, 230, 200, 120, "orange")\ntriangle(100, 150, 200, 80, "red")\nrect(170, 280, 60, 70, "brown")\nrect(20, 250, 40, 40, "white")', pass: false, note: 'window outside the wall', has: 'دیوار کے اندر' },
          { code: 'rect(100, 230, 200, 120, "orange")\ntriangle(100, 150, 200, 80, "red")\nrect(170, 280, 60, 70, "brown")', pass: false, note: 'no window yet', has: 'کھڑکی لگائیں' },
          { code: 'rect(100, 230, 200, 120, "orange")\ntriangle(100, 150, 200, 80, "red")\nrect(170, 280, 60, 70, "brown")\nrect(120, 250, 40, 40, "orange")', pass: false, note: 'window same colour as the wall', has: 'رنگ' },
          { code: 'rect(100, 230, 200, 120, "orange")\ntriangle(100, 150, 200, 80, "red")\nrect(170, 280, 60, 70, "brown")\nrect(120, 250, 40, 40, "white")\nbackground("skyblue")', pass: false, note: 'background at the end', has: 'ڈھانپ' },
          { code: 'background("skyblue")\nrect(100, 230, 200, 120, "orange")\ntriangle(100, 150, 200, 80, "red")\nrect(170, 280, 60, 70, "brown")\nstar(140, 270, 15, "yellow")', pass: true, note: 'sky first, star window' }
        ],
        recap: 'جو چیز <strong>بعد میں</strong> بنتی ہے، وہ <strong>اوپر</strong> نظر آتی ہے۔ ڈیزائنر اسے <strong>تہیں</strong> (layers) کہتے ہیں۔'
      },

      {
        id: '3.5', short: 'تصویر', title: 'میری تصویر', make: true,
        bubble: 'آج آپ مصور ہیں! ✨',
        learn: {
          say: [
            'دو نئے حکم! `star` ستارہ بناتا ہے، بالکل `circle` کی طرح: `x`، `y`، سائز، رنگ۔',
            '`text` اسٹیج پر الفاظ لکھتا ہے: پہلے الفاظ `" "` میں، پھر `x` اور `y`، اور چاہیں تو رنگ۔',
            'اب سب ملا کر اپنی <strong>تصویر</strong> بنائیں!'
          ],
          example: 'background("navy")\ncircle(300, 90, 50, "white")\nstar(100, 100, 20, "gold")\ntext("Good night", 130, 360, "white")',
          flow: true
        },
        task: {
          intro: 'اپنی پسند کی تصویر بنائیں: جھنڈا، باغ، رات کا آسمان، کچھ بھی!',
          steps: [
            'پہلے سوچیں کہ کیا بنانا ہے۔ پیچھے والی چیز (آسمان یا زمین) سب سے پہلے بنائیں۔',
            'کم از کم <strong>5 شکلیں</strong> اور <strong>3 رنگ</strong> استعمال کریں۔',
            'ہر شکل اسٹیج پر نظر آئے۔ پھر «چلاؤ» دبائیں۔'
          ],
          starter: 'background("skyblue")\n',
          hints: [
            'پہلے سوچیں کیا بنانا ہے۔ `circle`، `rect`، `triangle`، `star` اور `text` سب استعمال کر سکتے ہیں۔',
            'نئی شکل: `star(200, 100, 30, "gold")`۔ پاکستان کا جھنڈا بنانا ہو تو «حل» میں مثال دیکھیں۔'
          ],
          solution: 'background("skyblue")\nrect(20, 80, 90, 240, "white")        // flag: white part\nrect(110, 80, 270, 240, "darkgreen")  // flag: green part\ncircle(245, 205, 70, "white")         // moon\ncircle(265, 185, 62, "darkgreen")     // cut the moon\nstar(292, 165, 18, "white")           // star\ntext("Pakistan Zindabad", 110, 370, "darkgreen")',
          solutionNote: 'پاکستان کا جھنڈا: سفید اور ہرا `rect`، دو `circle` سے چاند، اور ایک سفید `star`۔ ہرے دائرے نے سفید دائرے کو ڈھانپ کر چاند بنا دیا۔',
          check: function (out, code, r, T) {
            if (r.allShapes.length > r.shapes.length) return { msg: 'کچھ شکلیں `background` کے نیچے چھپ گئیں! `background` والی لائن سب سے اوپر لکھیں۔' };
            var sh = r.shapes;
            if (sh.some(function (s) { return !T.partlyOn(s); })) return { mood: 'nudge', msg: 'ایک شکل اسٹیج سے باہر چلی گئی، اس لیے نظر نہیں آ رہی۔ `x` اور `y` کو 0 اور 400 کے بیچ رکھیں۔' };
            if (sh.length < 5) return { mood: 'nudge', msg: sh.length ? 'اچھی شروعات! ابھی ' + (sh.length === 1 ? '1 شکل ہے' : sh.length + ' شکلیں ہیں') + '۔ کم از کم 5 شکلیں بنائیں۔' : 'اب شکلیں بنائیں! کم از کم 5 شکلیں چاہئیں۔' };
            var colors = [];
            sh.forEach(function (s) { var c = s.color === '#17261c' ? 'black' : s.color; if (c && colors.indexOf(c) < 0) colors.push(c); });
            if (r.bg && colors.indexOf(r.bg) < 0) colors.push(r.bg);
            if (colors.length < 3) return { mood: 'nudge', msg: 'بہت خوب! ابھی ' + colors.length + ' رنگ ' + (colors.length === 1 ? 'ہے' : 'ہیں') + '۔ کم از کم 3 رنگ استعمال کریں۔' };
            return { pass: true };
          }
        },
        tests: [
          { code: 'background("navy")\ncircle(300, 90, 50, "white")\nstar(100, 100, 20, "gold")\nstar(180, 60, 12, "gold")\nstar(60, 220, 15, "gold")\ntext("Good night", 130, 360, "white")', pass: true, note: 'night sky' },
          { code: 'rect(0, 300, 400, 100, "green")\ncircle(80, 80, 50, "yellow")\nrect(190, 220, 20, 80, "brown")\ncircle(200, 200, 40, "green")\ntriangle(250, 220, 100, 80, "red")', pass: true, note: 'garden without background' },
          { code: 'background("skyblue")\ncircle(80, 80, 50, "yellow")\nrect(0, 300, 400, 100, "green")\nstar(300, 80, 20, "white")', pass: false, note: 'only 3 shapes', has: 'کم از کم 5' },
          { code: 'background("white")\ncircle(50, 50, 20, "red")\ncircle(150, 50, 20, "red")\ncircle(250, 50, 20, "red")\ncircle(350, 50, 20, "red")\ncircle(200, 200, 20, "red")', pass: false, note: 'only 2 colours', has: '3 رنگ' },
          { code: 'background("skyblue")\ncircle(80, 80, 50, "yellow")\nrect(0, 300, 400, 100, "green")\nstar(300, 80, 20, "white")\ncircle(200, 200, 40, "red")\ncircle(600, 200, 40, "red")', pass: false, note: 'one shape off the wall', has: 'باہر' },
          { code: 'circle(80, 80, 50, "yellow")\nrect(0, 300, 400, 100, "green")\nstar(300, 80, 20, "white")\ncircle(200, 200, 40, "red")\ncircle(300, 200, 40, "red")\nbackground("skyblue")', pass: false, note: 'background at the end hides everything', has: 'چھپ گئیں' },
          { code: 'background("skyblue")\ntext("A", 10, 30)\ntext("B", 10, 60)\ntext("C", 10, 90)\ntext("D", 10, 120)\ntext("E", 10, 150)', pass: false, note: 'text only, 2 colours', has: '2 رنگ ہیں' },
          { code: 'background("skyblue")\ncircle(80, 80, 50, "yellow")', pass: false, note: 'one shape', has: '1 شکل ہے' },
          { code: 'background("skyblue")\nrect(0, 300, 400, 100, "green")\ncircle(80, 80, 50, "yellow")\nstar(300, 80, 20, "white")\ntext(Hello, 150, 200)', pass: false, note: 'words without quotes', has: '`" "`' }
        ],
        recap: 'آپ نے کوڈ سے ایک تصویر بنا دی! ویڈیو گیمز اور کارٹون بھی ایسی ہی شکلوں اور رنگوں سے بنتے ہیں۔'
      }
    ]
  };

  // What Mithu says out loud: very short, very simple English, read slowly by the device's own voice.
  var VOICE = {
    '3.1': {
      learn: 'Now Birdy will draw! Every spot on the stage has an address: x and y. x tells how far from the left edge. Be careful! We count x from the left side. Urdu is written from the right, so this is the opposite. y tells how far down from the top. Touch the stage to see the x and y of any spot.',
      guess: 'Look at this code. Where will the red dot appear? Choose one answer.',
      why: 'x is 100. That is close to the left edge. y is 300. That is far down from the top. So the dot is at the bottom left.',
      task: 'Your turn. Move the red dot to the top right corner. The first number is x. Change it to move the dot right. The second number is y. Change it to move the dot up. Then press Run.',
      hints: ['To go right, should x get bigger or smaller? To go up, should y get bigger or smaller?',
              'Make x about 350, and make y about 50.'],
      solution: 'A bigger x moves the dot right. A smaller y moves the dot up.',
      recap: 'Well done! Zero, zero is the top left corner. When x grows, we go right. When y grows, we go down. This is upside down from a maths graph, so be careful!'
    },
    '3.2': {
      learn: 'Background paints the whole stage with one colour, like the sky. The things inside a command are called inputs. For circle, the order is always the same. x. y. Size. Colour. Put a comma between the inputs.',
      guess: 'Before, the code was circle 200, 200, 20, yellow. We changed the third number from 20 to 60. What will change? Choose one answer.',
      why: 'The third number is the size. A bigger size makes a bigger circle. The place and the colour stay the same.',
      task: 'Your turn. Draw a big yellow sun in the top left corner of the sky. Make x and y small, so the sun goes to the top left. Make the size 40 or more. Then press Run.',
      hints: ['Every number has its own job. The first is x. The second is y. The third is the size.',
              'Try x 80, y 80, and size 50.'],
      solution: 'x and y are 80, so the sun is at the top left. The size is 50, so the sun is big.',
      recap: 'Well done! The things inside a command are called inputs. Their order matters. First the place, then the size, then the colour.'
    },
    '3.3': {
      learn: 'Rect draws a box. It has five inputs. x. y. Width. Height. Colour. Here, x and y are the top left corner of the box. The width goes to the right. The height goes down. Use the grid to measure.',
      task: 'Plant a tree! There are three gaps in the code. Fill each gap with the right number. The ground must cover the whole stage. The trunk must reach the ground at 320. The leaves must touch the trunk. Then press Run.',
      hints: ['How wide is the stage? The trunk starts at 220. How long must it be to reach 320?',
              'The ground is 400 wide. The trunk is 100 high. The leaves have size 40.'],
      solution: 'The stage is 400 wide. The trunk goes down 100, from 220 to 320, and meets the ground. Leaves of size 40 cover the top of the trunk.',
      recap: 'Well done! For rect, first the corner, then the width and the height. You measured your picture, just like an engineer!'
    },
    '3.4': {
      hintsA: ['The computer draws each thing on top of the last one. Like paper on paper. When should the door be drawn?', 'Wall first. Then the roof. The door goes after the wall, on the last line.'],
      learn: 'The computer draws each shape on top of the one before. Like putting paper on paper. So a shape drawn later is on top. Here is a new command: triangle. Its point is at the top middle. Its inputs are the same as rect.',
      taskA: 'Oh no! The door of the house is hidden. Put the lines in the right order, so we can see the wall, the roof and the door. Think. Which thing is at the back? Draw it first. Then press Run.',
      task: 'Great! Now add a window to the wall. Make a new line at the bottom. Draw a small white rect inside the wall. Then press Run.',
      hints: ['The window must be inside the wall. And it must be drawn after the wall.',
              'At the bottom, write: rect, 120, 250, 40, 40, white.'],
      solution: 'The wall is drawn first. The door and the window come after the wall, so we can see them on top.',
      recap: 'Well done! What is drawn later, shows on top. Designers call these layers.'
    },
    '3.5': {
      learn: 'Two new commands! Star draws a star, just like circle. x. y. Size. Colour. Text writes words on the stage. First the words in quotes. Then x and y. And a colour if you like. Now make your own picture!',
      task: 'Make any picture you like. A flag. A garden. A night sky. Anything! Draw the things at the back first. Use at least five shapes and three colours. Keep every shape on the stage. Then press Run.',
      hints: ['First think about what to draw. You can use circle, rect, triangle, star and text.',
              'A star looks like this: star, 200, 100, 30, gold. For the Pakistan flag, look at the solution.'],
      solution: 'The Pakistan flag. A white rect and a green rect. Two circles make the moon. And a white star.',
      recap: 'Amazing! You made a picture with code. Video games and cartoons are made from shapes and colours too!'
    }
  };
  M.levels.forEach(function (L) { L.voice = VOICE[L.id]; });
  (window.MODULES = window.MODULES || []).push(M);
})();
