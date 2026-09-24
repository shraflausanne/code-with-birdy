// Module 2: جادوئی ڈبے (Magic boxes = variables)
// Every level: learn -> guess (optional) -> task -> recap. Children only ever type English.
// Every variable shows on the stage as a labelled box (stage.boxes), so the text can say "look at the box".
(function () {
  // Box names the child made with `let` (strings and comments ignored).
  function lets(code, T) {
    var re = /\blet\s+([A-Za-z_$][\w$]*)/g, b = T.bare(code), m, a = [];
    while ((m = re.exec(b))) if (a.indexOf(m[1]) < 0) a.push(m[1]);
    return a;
  }
  // Lines that make Mithu speak (strings blanked, so a word inside quotes does not count as a box).
  function sayLines(code, T) {
    return T.bare(code).split('\n').filter(function (l) { return /(^|[^\w$.])(say|console\s*\.\s*log)\s*\(/.test(l); });
  }
  function uses(line, name) { return new RegExp('(^|[^\\w$.])' + name.replace(/\$/g, '\\$') + '(?![\\w$])').test(line); }
  function str(o) { return String(o.value); }
  // Is the value glued to a letter everywhere it appears? ("SalaamAli")
  function stuck(s, v) {
    var at = s.indexOf(v), any = false;
    while (at >= 0) {
      any = true;
      var before = at > 0 && /[A-Za-z]/.test(s[at - 1]), after = /[A-Za-z]/.test(s[at + v.length] || '');
      if (!before && !after) return false;
      at = s.indexOf(v, at + 1);
    }
    return any;
  }

  var M = {
    id: 'm2',
    number: 2,
    title: 'جادوئی ڈبے',
    badge: { name: 'ڈبوں کا جادوگر', line: 'آپ نے ڈبوں میں چیزیں رکھنا اور بدلنا سیکھ لیا!' },
    next: 'اگلے ماڈیول میں برڈی <strong>رنگوں</strong> سے تصویریں بنانا سیکھے گا۔',
    stage: { draw: false, boxes: true },

    lesson:
      '<p><strong>ڈبہ</strong> (variable) کمپیوٹر کی یادداشت ہے۔</p>' +
      '<p>`let fruit = "Mango"` کا مطلب ہے: ایک ڈبہ بناؤ، اس پر `fruit` لکھو، اور اس میں `Mango` رکھ دو۔</p>' +
      '<p>ڈبے کا نام <strong>بغیر</strong> `" "` کے لکھیں تو کمپیوٹر ڈبہ کھول کر اندر کی چیز استعمال کرتا ہے: `say(fruit)`</p>' +
      '<p>ڈبہ ایک ہی بار `let` سے بنتا ہے۔ چیز بدلنی ہو تو صرف `fruit = "Banana"` لکھیں۔</p>' +
      '<p>ڈبے کے نام انگریزی حروف میں، بغیر خالی جگہ کے لکھیں: `myName` ٹھیک ہے، `my name` غلط۔</p>',

    commands: [
      { code: 'let box = …', ur: 'نیا ڈبہ بناتا ہے اور اس میں چیز رکھتا ہے۔', from: '2.1' },
      { code: 'box = …', ur: 'ڈبے میں نئی چیز رکھتا ہے۔ یہاں `let` نہیں لکھتے۔', from: '2.3' },
      { code: 'a / b', ur: '`/` کا مطلب ہے تقسیم: `12 / 4` سے 3 بنتا ہے۔', from: '2.4' }
    ],

    keys: [
      { t: 'let … =', ins: 'let | = ', tpl: true },
      { t: 'say(…)', ins: 'say(|)', tpl: true },
      { t: '=', ins: ' = ' },
      { t: '"', ins: '"' },
      { t: '+', ins: ' + ' },
      { t: '(', ins: '(' },
      { t: ')', ins: ')' },
      { t: '↵', ins: '\n' }
    ],

    levels: [
      {
        id: '2.1', short: 'ڈبہ', title: 'ڈبے میں کیا ہے؟',
        learn: {
          say: [
            'کمپیوٹر چیزیں <strong>ڈبوں</strong> میں یاد رکھتا ہے۔ ہر ڈبے پر ایک نام لکھا ہوتا ہے۔',
            '`let` نیا ڈبہ بناتا ہے، اور `=` اس میں چیز رکھ دیتا ہے۔',
            'اسٹیج پر ڈبہ دیکھیں! `say(fruit)` لکھیں تو برڈی ڈبہ کھول کر اندر والی چیز بولتا ہے۔'
          ],
          example: 'let fruit = "Mango"',
          parts: [
            { t: 'let', l: 'نیا ڈبہ بناؤ' },
            { t: 'fruit', l: 'ڈبے کا نام' },
            { t: '=', l: 'اس میں رکھو' },
            { t: '"Mango"', l: 'ڈبے کی چیز' }
          ]
        },
        guess: {
          q: 'برڈی کیا بولے گا؟',
          code: 'let fruit = "Mango"\nsay(fruit)\nsay("fruit")',
          options: ['دونوں بار `Mango`', 'پہلے `Mango`، پھر `fruit`', 'دونوں بار `fruit`'],
          correct: 1,
          why: '`fruit` بغیر `" "` کے ڈبے کا نام ہے، تو برڈی نے ڈبہ کھولا: `Mango`۔ `"fruit"` کے گرد `" "` ہیں، تو برڈی نے بس یہ لفظ بولا۔'
        },
        task: {
          intro: 'ڈبے میں <strong>اپنا پسندیدہ پھل</strong> رکھیں، تاکہ برڈی پہلی لائن میں وہ پھل بولے۔',
          steps: [
            'پہلی لائن میں `" "` کے اندر سے `Mango` مٹائیں۔',
            'وہاں اپنا پسندیدہ پھل انگریزی میں لکھیں، جیسے `Banana`۔',
            '`say(fruit)` کو ویسے ہی رہنے دیں۔ «چلاؤ» دبائیں اور اسٹیج پر ڈبہ دیکھیں!'
          ],
          starter: 'let fruit = "Mango"\nsay(fruit)\nsay("fruit")',
          hints: [
            'برڈی کو پھل کا نام ڈبے سے مل رہا ہے۔ ڈبے میں چیز کس لائن میں رکھی گئی ہے؟',
            'پہلی لائن بدلیں: `let fruit = "Banana"`، مگر `Banana` کی جگہ اپنا پھل۔'
          ],
          solution: 'let fruit = "Banana"\nsay(fruit)\nsay("fruit")',
          solutionNote: 'صرف ڈبے کی چیز بدلی۔ `say(fruit)` نے ڈبہ کھولا اور نیا پھل بولا۔',
          check: function (out, code, r, T) {
            var said = sayLines(code, T).some(function (l) { return uses(l, 'fruit'); });
            if (!said) {
              var other = lets(code, T).filter(function (n) { return n !== 'fruit' && sayLines(code, T).some(function (l) { return uses(l, n); }); })[0];
              if (other && r.boxes.fruit === undefined) return { mood: 'nudge', msg: 'ڈبے کا نام `fruit` ہی رہنے دیں۔ صرف `" "` کے اندر والا پھل بدلیں: `let fruit = "Banana"`' };
              if (out.length && out.every(function (o) { return str(o) === 'fruit'; }))
                return { msg: 'برڈی نے بس لفظ `fruit` بولا، ڈبہ نہیں کھولا۔ ڈبہ کھولنے کے لیے `" "` کے بغیر لکھیں: `say(fruit)`' };
              if (out.length) return { msg: 'برڈی نے پھل کا نام تو کہا، مگر ڈبے سے نہیں! `say(fruit)` واپس لکھیں، اور ڈبے کے اندر کی چیز بدلیں۔' };
              return { msg: 'برڈی خاموش رہا۔ `say(fruit)` والی لائن واپس لکھیں۔' };
            }
            var f = r.boxes.fruit;
            if (f === undefined) return { msg: 'ڈبہ `fruit` نہیں ملا۔ پہلی لائن ایسی ہو: `let fruit = "Banana"`' };
            var v = String(f).trim();
            if (!v) return { mood: 'nudge', msg: 'ڈبہ خالی ہے! `" "` کے اندر اپنا پسندیدہ پھل لکھیں۔' };
            if (v.toLowerCase() === 'mango') return { mood: 'nudge', msg: 'ڈبے میں ابھی بھی `Mango` ہے۔ کوئی اور پھل رکھیں، جیسے `"Banana"`۔' };
            if (!out.some(function (o) { return str(o).indexOf(String(f)) >= 0; }))
              return { msg: 'برڈی نے ڈبے والا پھل نہیں بولا۔ کیا `say(fruit)` ڈبہ بننے کے بعد والی لائن میں ہے؟' };
            return { pass: true };
          }
        },
        tests: [
          { code: 'let fruit = "Apple"\nsay(fruit)', pass: true, note: 'another fruit, one say' },
          { code: 'let fruit="Orange"\nconsole.log( fruit )\nsay("fruit")', pass: true, note: 'console.log and no spaces' },
          { code: 'let fruit = "Mango"\nsay("Banana")\nsay("fruit")', pass: false, note: 'changed say(fruit) instead of the box', has: 'ڈبے سے نہیں' },
          { code: 'let fruit = "Mango"\nsay(fruit)\nsay("fruit")', pass: false, note: 'unchanged', has: 'Mango' },
          { code: 'let fruit = ""\nsay(fruit)', pass: false, note: 'empty box', has: 'خالی' },
          { code: 'let fruit = Banana\nsay(fruit)', pass: false, note: 'forgot the quotes (Error Doctor)', has: '" "' },
          { code: 'let fruit = "Banana"\nsay("fruit")', pass: false, note: 'only the word fruit, box not opened', has: 'ڈبہ نہیں کھولا' },
          { code: 'let food = "Banana"\nsay(food)', pass: false, note: 'renamed the box', has: 'نام `fruit`' },
          { code: 'let fruit = "Green apple"\nsay("I like " + fruit)', pass: true, note: 'two words, joined with text' },
          { code: 'let fruit = "Banana"\nSay(fruit)', pass: false, note: 'capital S (Error Doctor)', has: '`say`' }
        ],
        recap: '`fruit` بغیر `" "` کے یعنی: ڈبہ کھولو اور اندر دیکھو۔ `"fruit"` یعنی: بس یہ لفظ بولو۔ ایک چھوٹا سا نشان، بڑا فرق!'
      },

      {
        id: '2.2', short: 'نام اور شہر', title: 'اپنا نام، اپنا شہر',
        learn: {
          say: [
            '`" "` کے اندر والے الفاظ کو <strong>لکھائی</strong> کہتے ہیں۔ ڈبے کو لکھائی کے ساتھ `+` سے جوڑا جا سکتا ہے۔',
            'کمپیوٹر ڈبہ کھولتا ہے اور اندر والی چیز جملے میں رکھ دیتا ہے۔',
            '`"I love my "` کے آخر میں ایک خالی جگہ ہے، تاکہ الفاظ آپس میں نہ چپکیں۔'
          ],
          example: 'let pet = "cat"\nsay("I love my " + pet)',
          flow: true
        },
        guess: {
          q: 'برڈی کیا بولے گا؟',
          code: 'let name = "Ali"\nsay("Salaam " + name)',
          options: ['`Salaam name`', '`Salaam Ali`', '`Salaam + name`'],
          correct: 1,
          why: '`name` بغیر `" "` کے ہے، تو کمپیوٹر نے ڈبہ کھول کر `Ali` نکالا۔ پھر `+` نے دونوں ٹکڑے جوڑ دیے۔'
        },
        task: {
          intro: 'دو ڈبے بنائیں: `name` میں اپنا نام اور `city` میں اپنا شہر۔ پھر برڈی سے دونوں <strong>ایک جملے</strong> میں کہلوائیں۔',
          steps: [
            '`Ali` کی جگہ اپنا نام لکھیں۔',
            'پہلی لائن کے نیچے دوسرا ڈبہ بنائیں: `let city = "Lahore"`، مگر اپنا شہر۔',
            '`say` والی لائن ایسے بدلیں: `say("Salaam " + name + "! You are from " + city)`',
            '«چلاؤ» دبائیں اور اسٹیج پر دونوں ڈبے دیکھیں۔'
          ],
          starter: 'let name = "Ali"\nsay("Salaam " + name)',
          hints: [
            'دوسرا ڈبہ بالکل پہلے ڈبے کی طرح بنتا ہے، بس نام اور چیز الگ ہیں۔',
            'پہلے `let city = "Lahore"` لکھیں، پھر: `say("Salaam " + name + "! You are from " + city)`'
          ],
          solution: 'let name = "Ali"\nlet city = "Lahore"\nsay("Salaam " + name + "! You are from " + city)',
          solutionNote: 'دو ڈبے اوپر بنے، اور `+` نے انہیں لکھائی کے ساتھ ایک جملے میں جوڑ دیا۔',
          check: function (out, code, r, T) {
            var names = lets(code, T).filter(function (n) { return r.boxes[n] !== undefined; });
            if (names.length < 2) return { mood: 'nudge', msg: 'ابھی ایک ہی ڈبہ ہے۔ دوسرا ڈبہ بنائیں: `let city = "Lahore"`، مگر اپنا شہر۔' };
            var joined = sayLines(code, T).some(function (l) {
              return names.filter(function (n) { return uses(l, n); }).length >= 2;
            });
            if (!joined) return { mood: 'nudge', msg: 'دونوں ڈبے ایک ہی `say` کے جملے میں `+` سے جوڑیں، جیسے `"Salaam " + name + "! You are from " + city`' };
            var vals = names.map(function (n) { return String(r.boxes[n]).trim(); }).filter(function (v) { return v.length > 0; });
            var good = out.some(function (o) { return vals.filter(function (v) { return str(o).indexOf(v) >= 0 && (v.length < 2 || !stuck(str(o), v)); }).length >= 2; });
            if (good) return { pass: true };
            if (out.some(function (o) { return vals.some(function (v) { return v.length > 1 && stuck(str(o), v); }); }))
              return { mood: 'nudge', msg: 'الفاظ آپس میں چپک گئے! `" "` کے اندر آخر میں ایک خالی جگہ چھوڑیں، جیسے `"Salaam "`' };
            return { msg: 'برڈی کے جملے میں دونوں ڈبوں کی چیزیں نہیں آئیں۔ کیا دونوں ڈبوں میں کچھ لکھا ہے؟' };
          }
        },
        tests: [
          { code: 'let name = "Sara"\nlet city = "Karachi"\nsay("Salaam " + name + "! You are from " + city)', pass: true, note: 'own name and city' },
          { code: 'let myName = "Bilal"\nlet city = "Multan"\nconsole.log("Hi " + myName + ", welcome from " + city + "!")', pass: true, note: 'other box name, console.log' },
          { code: 'let name = "Ali"\nlet city = "Lahore"\nsay("Salaam" + name + "! You are from" + city)', pass: false, note: 'no spaces, words stick', has: 'چپک' },
          { code: 'let name = "Ali"\nsay("Salaam " + name + "! You are from " + city)\nlet city = "Lahore"', pass: false, note: 'city used before let city', has: 'بننے سے پہلے' },
          { code: 'let name = "Sara"\nsay("Salaam " + name)', pass: false, note: 'only one box', has: 'ایک ہی ڈبہ' },
          { code: 'let name = "Sara"\nlet city = "Karachi"\nsay("Salaam Sara! You are from Karachi")', pass: false, note: 'typed the words instead of using the boxes', has: 'جوڑیں' },
          { code: 'let name = "Sara"\nlet city = "Karachi"\nsay("Salaam " + name)\nsay("You are from " + city)', pass: false, note: 'two sentences, not one', has: 'ایک ہی' },
          { code: 'let name = "Ali"\nlet city = "Lahore"\nsay("Salaam " + name + "! You are from " + city)\nsay("Bye" + name)', pass: true, note: 'good sentence plus an extra stuck line' },
          { code: 'let name = "Ali"\nlet city = "Lahore"\nsay(name + city)', pass: false, note: 'no space at all', has: 'چپک' },
          { code: 'let name = "Ali"\nlet city = "Lahore"\nsay("Salaam " + name + "! You are from " + City)', pass: false, note: 'capital C (Error Doctor)', has: '`City`' }
        ],
        recap: '`+` سے لکھائی اور ڈبے جڑ کر پورے جملے بنتے ہیں۔ ڈبہ بدلیں تو جملہ اپنے آپ بدل جاتا ہے!'
      },

      {
        id: '2.3', short: 'گنتی', title: 'امرود گنیں',
        learn: {
          say: [
            'ڈبے کی چیز <strong>بدلی</strong> بھی جا سکتی ہے۔',
            '`score = score + 1` کا مطلب ہے: ڈبے سے پرانا نمبر نکالو، اس میں 1 جمع کرو، اور نیا نمبر واپس ڈبے میں رکھ دو۔',
            'ڈبہ صرف ایک بار `let` سے بنتا ہے۔ بدلتے وقت `let` نہیں لکھتے۔'
          ],
          example: 'let score = 5\nscore = score + 1\nsay(score)',
          flow: true
        },
        task: {
          intro: 'برڈی نے تین امرود کھائے! ہر امرود کے بعد ڈبے میں 1 جمع کریں، تاکہ برڈی گنے: 1، 2، 3',
          steps: [
            'تختی پر تین خالی جگہیں `___` ہیں۔',
            'ہر `___` مٹا کر وہاں لکھیں: `guavas + 1`',
            '«چلاؤ» دبائیں اور اسٹیج پر ڈبے کی گنتی دیکھیں۔'
          ],
          starter: 'let guavas = 0\nguavas = ___\nsay(guavas)\nguavas = ___\nsay(guavas)\nguavas = ___\nsay(guavas)',
          hints: [
            'نیا نمبر = پرانا نمبر + 1۔ پرانا نمبر کس ڈبے میں رکھا ہے؟',
            'ہر `___` کی جگہ `guavas + 1` لکھیں، تاکہ ہر لائن ایسی بن جائے: `guavas = guavas + 1`'
          ],
          solution: 'let guavas = 0\nguavas = guavas + 1\nsay(guavas)\nguavas = guavas + 1\nsay(guavas)\nguavas = guavas + 1\nsay(guavas)',
          solutionNote: 'ہر بار ڈبے سے پرانا نمبر نکلا، 1 جمع ہوا، اور نیا نمبر واپس ڈبے میں گیا: 0 سے 1، 2، 3۔',
          check: function (out, code, r, T) {
            // The count Mithu said: numbers, or a number inside a sentence ("I ate 3"). Other words are extra and fine.
            if (out.some(function (o) { return str(o) === 'guavas'; }))
              return { msg: 'برڈی نے بس لفظ `guavas` بولا، ڈبہ نہیں کھولا۔ `say(guavas)` میں `" "` نہیں لگتے۔' };
            if (out.some(function (o) { return o.vtype === 'string' && /^0?1+$/.test(str(o)) && str(o).length > 1; }))
              return { msg: 'نمبر جمع ہونے کی بجائے ساتھ جڑ گئے! `1` کو `" "` کے بغیر لکھیں: `guavas + 1`' };
            var said = out.map(function (o) { return o.vtype === 'number' ? o.value : (/^\D*(\d+)\D*$/.exec(str(o)) || [])[1]; })
              .filter(function (v) { return v !== undefined; }).map(Number);
            var adds = (T.squash(code).match(/guavas=guavas\+1(?![\d.])|guavas=1\+guavas|guavas\+=1(?![\d.])|guavas\+\+|\+\+guavas/g) || []).length;
            if (said.length && said.every(function (v) { return v === 0; }))
              return { msg: 'آپ نے جمع تو کیا، مگر نیا نمبر ڈبے میں واپس نہیں رکھا۔ `guavas = guavas + 1` لکھیں تاکہ نتیجہ ڈبے میں جائے۔' };
            if (said.length > 1 && said.every(function (v) { return v === said[0]; }))
              return { msg: 'برڈی ہر بار ایک ہی نمبر بول رہا ہے۔ نیا نمبر = پرانا نمبر + 1، یعنی `guavas + 1`۔' };
            if (said.length > 3 && said.slice(0, 3).join() === '1,2,3')
              return { mood: 'nudge', msg: 'برڈی نے تین ہی امرود کھائے! 3 کے بعد والی لائنیں مٹا دیں۔' };
            if (said.join() !== '1,2,3')
              return { msg: 'برڈی کو 1، 2، 3 گننا ہے۔ ہر `say(guavas)` سے پہلے لکھیں: `guavas = guavas + 1`' };
            if (adds < 3) return { mood: 'nudge', msg: 'گنتی تو ٹھیک ہے، مگر نمبر آپ نے خود لکھے! ہر جگہ `guavas + 1` لکھیں تاکہ کمپیوٹر خود گنے۔' };
            return { pass: true };
          }
        },
        tests: [
          { code: 'let guavas = 0\nguavas = 1 + guavas\nsay(guavas)\nguavas = guavas+1\nsay(guavas)\nguavas = guavas + 1\nconsole.log(guavas)', pass: true, note: '1 + guavas, spacing, console.log' },
          { code: 'let guavas = 0\nguavas = 1\nsay(guavas)\nguavas = 2\nsay(guavas)\nguavas = 3\nsay(guavas)', pass: false, note: 'typed 1, 2, 3 by hand', has: 'خود' },
          { code: 'let guavas = 0\nlet guavas = guavas + 1\nsay(guavas)\nguavas = guavas + 1\nsay(guavas)\nguavas = guavas + 1\nsay(guavas)', pass: false, note: 'let guavas again (Error Doctor)', has: 'ایک ہی بار' },
          { code: 'let guavas = 0\nguavas + 1\nsay(guavas)\nguavas + 1\nsay(guavas)\nguavas + 1\nsay(guavas)', pass: false, note: 'added but did not put it back in the box', has: 'واپس' },
          { code: 'let guavas = 0\nguavas = 0 + 1\nsay(guavas)\nguavas = 0 + 1\nsay(guavas)\nguavas = 0 + 1\nsay(guavas)', pass: false, note: '1, 1, 1', has: 'ایک ہی نمبر' },
          { code: 'let guavas = 0\nguavas = guavas + 1\nsay(guavas)\nguavas = ___\nsay(guavas)\nguavas = ___\nsay(guavas)', pass: false, note: 'gaps not filled (Error Doctor)', has: '___' },
          { code: 'let guavas = 0\nguavas = guavas + 1\nsay(guavas)\nguavas = guavas + 1\nsay(guavas)', pass: false, note: 'only two guavas', has: '1، 2، 3' },
          { code: 'let guavas = 0\nguavas += 1\nsay(guavas)\nguavas++\nsay(guavas)\nguavas = guavas + 1\nsay("I ate " + guavas + " guavas")\nsay("Yum!")', pass: true, note: '+=, ++, number in a sentence, extra line' },
          { code: 'let guavas = 0\nguavas = guavas + 1\nsay(guavas)\nguavas = guavas + 1\nsay(guavas)\nguavas = guavas + 1\nsay("guavas")', pass: false, note: 'quotes around the box name', has: 'ڈبہ نہیں کھولا' },
          { code: 'let guavas = 0\nguavas = guavas + "1"\nsay(guavas)\nguavas = guavas + "1"\nsay(guavas)\nguavas = guavas + "1"\nsay(guavas)', pass: false, note: '"1" in quotes joins instead of adding', has: 'جڑ گئے' },
          { code: 'let guavas = 0\nguavas = guavas + 1\nsay(guavas)\nguavas = guavas + 1\nsay(guavas)\nguavas = guavas + 1\nsay(guavas)\nguavas = guavas + 1\nsay(guavas)', pass: false, note: 'four guavas', has: 'تین ہی' }
        ],
        recap: '`guavas = guavas + 1` یعنی: پرانا نمبر نکالو، 1 جمع کرو، نیا نمبر واپس ڈبے میں رکھو۔ کھیلوں میں اسکور ایسے ہی بڑھتا ہے!'
      },

      {
        id: '2.4', short: 'بانٹیں', title: 'آم بانٹیں',
        learn: {
          say: [
            'ڈبوں سے حساب بھی ہوتا ہے۔ `/` کا مطلب ہے <strong>تقسیم</strong>: `12 / 4` سے 3 بنتا ہے۔',
            'ایک ڈبہ استعمال ہونے سے <strong>پہلے</strong> بننا چاہیے، اس لیے اس کی `let` والی لائن اوپر آتی ہے۔'
          ],
          example: 'let sweets = 10\nlet children = 2\nsay(sweets / children)',
          flow: true
        },
        task: {
          parsons: {
            lines: [
              'say("Each friend gets " + each + " mangoes")',
              'let friends = 4',
              'let each = mangoes / friends',
              'let mangoes = 12'
            ],
            order: [3, 1, 2, 0],
            intro: 'برڈی کے پاس 12 آم ہیں اور 4 دوست۔ ہر دوست کو کتنے آم ملیں گے؟ مگر لائنیں الٹی پلٹی ہو گئی ہیں!',
            steps: [
              '▲ ▼ والے بٹن سے لائنیں اوپر نیچے کریں۔',
              'جو ڈبے حساب میں استعمال ہوتے ہیں، وہ پہلے بنیں۔ `say` سب سے آخر میں۔',
              '«چلاؤ» دبائیں۔'
            ],
            check: function (out) {
              if (out.some(function (o) { return /\b3\b/.test(str(o)); })) return { pass: true };
              return { msg: 'کمپیوٹر کو ایک ڈبہ بننے سے پہلے ہی استعمال کرنا پڑا۔ جو ڈبے حساب میں آتے ہیں، انہیں اوپر رکھیں۔' };
            },
            cursorBefore: '12',
            wrong: 'کمپیوٹر کو ایک ڈبہ بننے سے پہلے ہی استعمال کرنا پڑا۔ جو ڈبے حساب میں آتے ہیں، انہیں اوپر رکھیں۔',
            done: 'زبردست! ہر دوست کو 3 آم ملے۔ اب ایک آخری کام۔'
          },
          intro: 'اب برڈی کے پاس <strong>20 آم</strong> ہیں! حساب دوبارہ نہ لکھیں، بس ایک نمبر بدلیں۔',
          steps: [
            '`let mangoes = 12` والی لائن ڈھونڈیں۔',
            '`12` کی جگہ `20` لکھیں۔',
            '«چلاؤ» دبائیں۔ ہر دوست کو اب کتنے آم ملے؟ اسٹیج پر ڈبے بھی دیکھیں!'
          ],
          hints: [
            'کمپیوٹر کسی ڈبے کو استعمال کرنے سے پہلے اسے بنتا ہوا دیکھنا چاہتا ہے۔ کون سے ڈبے پہلے بننے چاہئیں؟',
            'ترتیب: `mangoes`، پھر `friends`، پھر `each`، پھر `say`۔ پھر `12` کو `20` کر دیں۔ `/` کا مطلب ہے تقسیم۔'
          ],
          solution: 'let mangoes = 20\nlet friends = 4\nlet each = mangoes / friends\nsay("Each friend gets " + each + " mangoes")',
          solutionNote: 'حساب ایک ہی بار لکھا ہے۔ آم 20 ہوئے تو `each` خود بخود 5 ہو گیا۔',
          check: function (out, code, r, T) {
            var maths = T.bare(code).split('\n').filter(function (l) { return /\//.test(l.replace(/\/\/.*$/, '')); });
            if (!maths.length) return { msg: 'حساب کمپیوٹر کو کرنے دیں! `let each = mangoes / friends` واپس لکھیں، اور صرف `let mangoes` والی لائن میں نمبر بدلیں۔' };
            if (!maths.some(function (l) { return uses(l, 'mangoes') && uses(l, 'friends'); }))
              return { msg: 'حساب میں نمبر نہیں، ڈبے لکھیں: `let each = mangoes / friends`۔ تب آم بدلنے پر جواب خود بدلے گا۔' };
            if (!sayLines(code, T).some(function (l) { return uses(l, 'each'); }))
              return { msg: 'جواب ڈبے `each` سے آنا چاہیے، خود نہ لکھیں۔ `say` والی لائن ایسی ہو: `say("Each friend gets " + each + " mangoes")`' };
            if (Number(r.boxes.friends) !== 4) return { mood: 'nudge', msg: 'دوست 4 ہی رہنے دیں۔ صرف آم بدلنے ہیں: `let mangoes = 20`' };
            if (Number(r.boxes.mangoes) === 12) return { mood: 'nudge', msg: 'بہت خوب، ترتیب ٹھیک ہے! اب آم 20 کر کے دیکھیں: `12` کی جگہ `20` لکھیں۔' };
            if (Number(r.boxes.mangoes) !== 20) return { mood: 'nudge', msg: 'برڈی کے پاس 20 آم ہیں۔ لکھیں: `let mangoes = 20`' };
            if (!out.some(function (o) { return /\b5\b/.test(str(o)); })) return { msg: 'برڈی نے ابھی 5 نہیں بولا۔ کیا `say` والی لائن سب سے آخر میں ہے؟' };
            return { pass: true };
          }
        },
        tests: [
          { code: 'let friends = 4\nlet mangoes = 20\nlet each = mangoes / friends\nsay("Each friend gets " + each + " mangoes")', pass: true, note: 'friends first also works' },
          { code: 'let mangoes = 12\nlet friends = 4\nlet each = mangoes / friends\nsay("Each friend gets " + each + " mangoes")', pass: false, note: 'right order but still 12', has: '20' },
          { code: 'let mangoes = 20\nlet friends = 4\nlet each = 5\nsay("Each friend gets " + each + " mangoes")', pass: false, note: 'worked it out by hand', has: 'حساب' },
          { code: 'let mangoes = 20\nlet friends = 4\nlet each = mangoes / friends\nsay("Each friend gets 5 mangoes")', pass: false, note: 'typed the answer in the sentence', has: '`each`' },
          { code: 'let friends = 4\nlet each = mangoes / friends\nlet mangoes = 20\nsay("Each friend gets " + each + " mangoes")', pass: false, note: 'box used before it was made (Error Doctor)', has: 'بننے سے پہلے' },
          { code: 'let mangoes = 20\nlet friends = 5\nlet each = mangoes / friends\nsay("Each friend gets " + each + " mangoes")', pass: false, note: 'changed friends too', has: 'دوست' },
          { code: 'let mangoes = 20\nlet friends = 4\nlet each = 20 / 4\nsay("Each friend gets " + each + " mangoes")', pass: false, note: 'numbers in the maths instead of boxes', has: 'ڈبے لکھیں' },
          { code: 'let mangoes = 12\nmangoes = 20\nlet friends = 4\nlet each = mangoes / friends\nconsole.log("Each friend gets " + each + " mangoes")', pass: true, note: 'changed the box on a new line, console.log' },
          { code: 'let mangoes = 20\nlet friends = 4\nlet each = mangoes / friends\nsay("Each friend gets " + each + " mangoes")\nlet mangoes = 20', pass: false, note: 'let mangoes written twice (Error Doctor)', has: 'ایک ہی بار' }
        ],
        recap: 'آپ نے حساب <strong>ایک بار</strong> لکھا، اور آم بدلنے پر جواب خود بخود بدل گیا۔ ڈبوں کا یہی جادو ہے!'
      },

      {
        id: '2.5', short: 'کہانی', title: 'کہانی مشین', make: true,
        bubble: 'آج آپ کہانی کار ہیں! ✨',
        learn: {
          say: [
            'اب ڈبوں سے ایک <strong>کہانی مشین</strong> بنائیں!',
            'کہانی کے الفاظ ڈبوں میں رکھیں، اور `+` سے انہیں جملوں میں جوڑیں۔ ڈبوں میں کچھ اور ڈالیں تو نئی کہانی تیار!'
          ],
          example: 'let hero = "Birdy"\nlet place = "school"\nsay(hero + " went to " + place)',
          flow: true
        },
        task: {
          intro: 'خالی جگہیں بھریں اور کم از کم <strong>3 لائنوں</strong> کی مزے دار کہانی بنائیں، جس میں تینوں ڈبے آئیں۔',
          steps: [
            'ہر `"___"` میں `___` مٹا کر ایک انگریزی لفظ لکھیں، جیسے `"Birdy"`، `"elephant"`، `"zoo"`۔',
            'نیچے کم از کم 3 لائنیں `say` سے لکھیں، اور `+` سے ڈبے جوڑیں۔',
            '«چلاؤ» دبائیں۔ پھر ڈبوں میں کچھ اور ڈال کر نئی کہانی سنیں!'
          ],
          starter: 'let hero = "___"\nlet animal = "___"\nlet place = "___"\n// Birdy, tell the story!\n',
          hints: [
            'کہانی سوچیں: کون؟ کہاں گیا؟ وہاں کون سا جانور ملا؟',
            'ایک لائن ایسی ہو سکتی ہے: `say("One day " + hero + " went to the " + place)`'
          ],
          solution: 'let hero = "Birdy"\nlet animal = "elephant"\nlet place = "zoo"\n// Birdy, tell the story!\n' +
            'say("One day " + hero + " went to the " + place + ".")\n' +
            'say("At the " + place + ", " + hero + " met a big " + animal + ".")\n' +
            'say("The " + animal + " and " + hero + " ate mangoes together!")',
          solutionNote: 'تینوں ڈبے بھرے ہوئے ہیں، اور تینوں `say` میں `+` سے جوڑے گئے ہیں۔',
          check: function (out, code, r, T) {
            var names = lets(code, T);
            for (var i = 0; i < names.length; i++) {
              var v = r.boxes[names[i]];
              if (v === undefined || !String(v).trim() || String(v).trim() === '___')
                return { mood: 'nudge', msg: 'ڈبہ `' + names[i] + '` ابھی خالی ہے۔ `"___"` میں `___` مٹا کر کوئی انگریزی لفظ لکھیں۔' };
            }
            if (names.length < 3) return { mood: 'nudge', msg: 'کہانی کے لیے 3 ڈبے چاہئیں: `hero`، `animal` اور `place`۔' };
            if (!out.length) return { mood: 'nudge', msg: 'برڈی ابھی خاموش ہے۔ نیچے کم از کم 3 لائنیں `say` سے لکھیں۔' };
            if (out.length < 3) return { mood: 'nudge', msg: 'کہانی کم از کم 3 لائنوں کی ہو۔ برڈی نے ابھی صرف ' + out.length + (out.length === 1 ? ' لائن بولی۔' : ' لائنیں بولیں۔') + ' `say` والی لائنیں اور لکھیں۔' };
            var lines = sayLines(code, T);
            for (var j = 0; j < names.length; j++) {
              var n = names[j], val = String(r.boxes[n]);
              var used = lines.some(function (l) { return uses(l, n); }) && out.some(function (o) { return str(o).indexOf(val) >= 0; });
              if (!used) return { mood: 'nudge', msg: 'ڈبہ `' + n + '` کہانی میں نہیں آیا۔ اسے `+` سے کسی `say` میں جوڑیں، جیسے `" met a " + ' + n + '`' };
            }
            if (!lines.some(function (l) { return /\+/.test(l) && names.some(function (n) { return uses(l, n); }); }))
              return { mood: 'nudge', msg: 'کہانی کے جملے بنائیں! ڈبوں کو لکھائی کے ساتھ `+` سے جوڑیں، جیسے `hero + " went to the " + place`' };
            return { pass: true };
          }
        },
        tests: [
          { code: 'let hero = "Ayesha"\nlet animal = "tiger"\nlet place = "jungle"\nconsole.log(hero + " went to the " + place)\nconsole.log("There she saw a " + animal)\nsay("The " + animal + " said hello!")\nsay("The end")', pass: true, note: 'another story, console.log' },
          { code: 'let hero = "___"\nlet animal = "___"\nlet place = "___"\nsay(hero)\nsay(animal)\nsay(place)', pass: false, note: 'gaps not filled', has: '___' },
          { code: 'let hero = "Ali"\nlet animal = ""\nlet place = "park"\nsay(hero + " " + animal)\nsay(place)\nsay("The end")', pass: false, note: 'one box empty', has: 'خالی' },
          { code: 'let hero = "Ali"\nlet animal = "cat"\nlet place = "park"\nsay(hero + " went to the " + place)\nsay("He saw a " + animal)', pass: false, note: 'only two lines', has: '3' },
          { code: 'let hero = "Ali"\nlet animal = "cat"\nlet place = "park"\nsay(hero + " went to the " + place)\nsay("It was sunny")\nsay("The end")', pass: false, note: 'animal box not used', has: 'animal' },
          { code: 'let hero = "Ali"\nlet animal = "cat"\nlet place = "park"\nsay("Ali went to the park")\nsay("He saw a cat")\nsay("The end")', pass: false, note: 'typed the words instead of using the boxes', has: 'hero' },
          { code: 'let hero = "Birdy"\nlet animal = "elephant"\nlet place = "zoo"\nsay(hero)\nsay(animal)\nsay(place)', pass: false, note: 'boxes said alone, no sentences', has: '`+`' },
          { code: 'let hero = "Birdy"\nlet animal = "elephant"\nlet place = "zoo"\n// Birdy, tell the story!\n', pass: false, note: 'no say lines yet', has: 'خاموش' },
          { code: 'let hero = "Sara"\nlet animal = "camel"\nlet place = "desert"\nsay("One day " + hero + " went to the " + place + ".")\nsay("There was a " + animal + "!")\nsay("The end")\nhero = "Ali"\nsay(hero + " came too")', pass: true, note: 'extra lines and a changed box' }
        ],
        recap: 'آپ نے ایک مشین بنائی ہے: ڈبوں میں کچھ بھی ڈالیں، نئی کہانی تیار! بڑی بڑی ایپس بھی ایسے ہی ڈبوں سے بنتی ہیں۔'
      }
    ]
  };

  // What Mithu says out loud: very short, very simple English, read slowly by the device's own voice.
  var VOICE = {
    '2.1': {
      learn: 'The computer keeps things in boxes. Every box has a name. Let makes a new box. The equals sign puts something inside it. Look at the box on the stage! When you write say fruit, Birdy opens the box and says what is inside.',
      guess: 'Look at this code. What will Birdy say? Choose one answer.',
      why: 'Fruit without quotes is the name of a box. So Birdy opens the box and says Mango. Fruit with quotes is just a word. So Birdy says the word fruit.',
      task: 'Your turn. Put your favourite fruit in the box. One. Delete the word Mango. Two. Type your fruit in English. Three. Keep say fruit as it is, and press Run. Then look at the box!',
      hints: ['Birdy gets the fruit from the box. Which line puts the fruit in the box?',
              'Change the first line. Let fruit equals, and your fruit in quotes.'],
      solution: 'Only the thing inside the box changed. Say fruit opened the box and said the new fruit.',
      recap: 'Well done! Fruit without quotes means: open the box. Fruit with quotes means: just say this word. A tiny mark makes a big difference!'
    },
    '2.2': {
      learn: 'You can join a box to words with plus. The computer opens the box and puts what is inside into the sentence. Leave a space at the end of the words in quotes, so the words do not stick together.',
      guess: 'What will Birdy say? Choose one answer.',
      why: 'Name has no quotes. So the computer opens the box and finds Ali. Then plus joins the two pieces.',
      task: 'Your turn. Make two boxes. Name, with your name. And city, with your city. Then make Birdy say both in one sentence. Look at both boxes on the stage!',
      hints: ['The second box is made just like the first box. Only the name and the thing inside are different.',
              'First write: let city equals Lahore. Then join name and city in the say line with plus.'],
      solution: 'Two boxes at the top. Plus joins them with the words, into one sentence.',
      recap: 'Well done! With plus, you can join words and boxes into full sentences. Change a box, and the sentence changes by itself!'
    },
    '2.3': {
      learn: 'You can change what is inside a box. Score equals score plus 1 means: take the old number out of the box, add 1, and put the new number back in the box. You make a box with let only once.',
      task: 'Birdy ate three guavas! Count them. There are three empty gaps. In each gap, type: guavas plus 1. Then press Run, and watch the box count on the stage.',
      hints: ['The new number is the old number plus 1. Which box holds the old number?',
              'In every gap, write guavas plus 1. Then each line says: guavas equals guavas plus 1.'],
      solution: 'Each time, the old number came out, 1 was added, and the new number went back in the box. 1. 2. 3.',
      recap: 'Well done! Guavas equals guavas plus 1 means: take the old number, add 1, put it back. This is how a score goes up in a game!'
    },
    '2.4': {
      learn: 'Boxes can do maths too. The slash sign means divide. 12 divided by 4 is 3. A box must be made before it is used. So its let line goes higher up.',
      taskA: 'Birdy has 12 mangoes and 4 friends. How many mangoes does each friend get? But the lines are mixed up! Use the up and down buttons. Make the boxes first. Say goes at the bottom. Then press Run.',
      task: 'Great order! Now Birdy has 20 mangoes. Do not write the maths again. Just change one number. Change 12 to 20, and press Run.',
      hints: ['The computer wants to see a box being made before it is used. Which boxes must come first?',
              'The order is: mangoes, friends, each, and then say. Then change 12 to 20.'],
      solution: 'The maths is written only once. With 20 mangoes, each friend gets 5, all by itself.',
      recap: 'Well done! You wrote the maths once. When the mangoes changed, the answer changed by itself. That is the magic of boxes!'
    },
    '2.5': {
      learn: 'Now make a story machine with boxes! Put the story words in boxes. Join them into sentences with plus. Put new words in the boxes, and you get a new story!',
      task: 'Fill the gaps, and write a fun story of at least three lines. Use all three boxes. Then put new words in the boxes, and hear a new story!',
      hints: ['Think of a story. Who? Where did they go? Which animal did they meet?',
              'One line could be: say, One day, plus hero, plus went to the, plus place.'],
      solution: 'All three boxes are filled. All three are joined into the say lines with plus.',
      recap: 'Amazing! You made a machine. Put anything in the boxes, and a new story is ready. Big apps are made with boxes like these!'
    }
  };
  M.levels.forEach(function (L) { L.voice = VOICE[L.id]; });
  (window.MODULES = window.MODULES || []).push(M);
})();
