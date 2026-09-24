// Module 5: اگر… تو… (If… then… = decisions)
// Every level: learn -> guess (optional) -> task -> recap. Children only ever type English.
// Levels 5.2 to 5.5 are "the computer tests your code": the check runs the code again with other inputs
// (T.run + T.setLet / answers / randoms) and returns the test runs so the child sees each one.
(function () {
  function text(o) { return String(o.value).trim(); }
  function said(r) { return r.says.map(String).join(' / '); }
  function got(r) { return r.error ? 'غلطی' : (said(r) || 'خاموش'); }

  // 5.1: the starting code without the `let weather` line, squashed.
  var START_51 = 'let weather = "rain"\nif (weather === "rain") {\n  say("Take an umbrella!")\n} else {\n  say("Fly a kite!")\n}';
  function restOf(T, code) {
    var lines = T.squash(code).split('\n'), at = -1;
    lines.forEach(function (l, i) { if (at < 0 && /^letweather=/.test(l)) at = i; });
    return { found: at >= 0, rest: lines.filter(function (l, i) { return i !== at; }) };
  }
  function norm(s) { return s.replace(/console\.log\(/g, 'say(').replace(/'/g, '"').replace(/;/g, ''); }

  var PREFIX_54 = 'let secret = random(1, 10)\nlet guess = askNumber("Guess a number from 1 to 10")';

  var M = {
    id: 'm5',
    number: 5,
    title: 'اگر… تو…',
    badge: { name: 'فیصلہ ساز', line: 'آپ نے برڈی کو فیصلے کرنا سکھا دیا!' },
    next: 'اگلے ماڈیول میں آپ کا <strong>اپنا کھیل</strong> بنے گا!',
    stage: { draw: 'auto', boxes: true },

    lesson:
      '<p>کمپیوٹر <strong>فیصلہ</strong> بھی کر سکتا ہے: `if (...) { } else { }`</p>' +
      '<p>`if` کے بعد والی شرط سچ ہو تو پہلا حصہ چلتا ہے، ورنہ `else` والا۔ دونوں کبھی ایک ساتھ نہیں چلتے۔</p>' +
      '<p>`===` پوچھتا ہے: کیا دونوں بالکل برابر ہیں؟ `>` پوچھتا ہے: بڑا ہے؟ `<` پوچھتا ہے: چھوٹا ہے؟</p>' +
      '<p>ایک `=` ڈبے میں چیز <strong>رکھتا</strong> ہے، تین `===` <strong>پوچھتے</strong> ہیں۔</p>' +
      '<p>`random(1, 10)` کوئی بھی نمبر چنتا ہے۔ `askNumber("...")` آپ سے نمبر پوچھ کر ڈبے میں رکھتا ہے۔</p>' +
      '<p>`else if` سے دو سے زیادہ راستے بنتے ہیں۔ کمپیوٹر اوپر سے پوچھتا جاتا ہے اور پہلی سچی شرط والا راستہ لیتا ہے۔</p>',

    commands: [
      { code: 'if (…) { } else { }', ur: 'فیصلہ: شرط سچ ہو تو پہلا حصہ، ورنہ `else` والا۔', from: '5.1' },
      { code: '===', ur: 'پوچھتا ہے: کیا دونوں بالکل برابر ہیں؟', from: '5.2' },
      { code: 'random(min, max)', ur: '`min` اور `max` کے بیچ کوئی بھی نمبر چنتا ہے۔', from: '5.3' },
      { code: 'askNumber(question)', ur: 'آپ سے نمبر پوچھتا ہے۔', from: '5.3' },
      { code: '> <', ur: 'پوچھتے ہیں: بڑا ہے؟ چھوٹا ہے؟', from: '5.4' },
      { code: 'else if (…) { }', ur: 'ایک اور راستہ، ایک اور شرط کے ساتھ۔', from: '5.4' },
      { code: 'ask(question)', ur: 'آپ سے کوئی لفظ پوچھتا ہے، جیسے آپ کا نام۔', from: '5.5' }
    ],

    keys: [
      { t: 'if…else', ins: 'if (|) {\n  \n} else {\n  \n}', tpl: true },
      { t: '===', ins: ' === ' },
      { t: '>', ins: ' > ' },
      { t: '{', ins: '{' },
      { t: '}', ins: '}' },
      { t: '"', ins: '"' },
      { t: '(', ins: '(' },
      { t: ')', ins: ')' },
      { t: '↵', ins: '\n' }
    ],

    levels: [
      {
        id: '5.1', short: 'فیصلہ', title: 'بارش یا دھوپ؟',
        learn: {
          say: [
            'کمپیوٹر <strong>فیصلہ</strong> بھی کر سکتا ہے۔ اس کے لیے ہم `if` لکھتے ہیں، یعنی <strong>اگر</strong>۔',
            '`if` کے بعد بریکٹ میں ایک سوال ہوتا ہے، جسے <strong>شرط</strong> کہتے ہیں، جیسے `fruit === "mango"` یعنی کیا پھل آم ہے؟',
            'جواب ہاں ہو تو پہلا حصہ چلتا ہے، ورنہ `else` والا۔ دونوں حصے کبھی ایک ساتھ نہیں چلتے۔'
          ],
          example: 'let fruit = "mango"\nif (fruit === "mango") {\n  say("Yummy!")\n} else {\n  say("No, thank you")\n}',
          flow: true
        },
        guess: {
          q: 'برڈی کیا کہے گا؟',
          code: START_51,
          options: ['Take an umbrella!', 'Fly a kite!', 'دونوں باتیں'],
          correct: 0,
          why: 'ڈبے `weather` میں `"rain"` ہے، اس لیے سوال کا جواب ہاں ہے اور پہلا حصہ چلا۔ `else` والا حصہ نہیں چلا۔'
        },
        task: {
          intro: 'صرف <strong>ایک</strong> چیز بدلیں تاکہ برڈی `Fly a kite!` کہے۔',
          steps: [
            'سوچیں: برڈی کا فیصلہ کس ڈبے پر منحصر ہے؟',
            'پہلی لائن میں `"rain"` کی جگہ `"sunny"` لکھیں۔ باقی کوڈ کو ہاتھ نہ لگائیں۔',
            '«چلاؤ» دبائیں۔'
          ],
          starter: START_51,
          hints: [
            'برڈی کا فیصلہ کس ڈبے پر منحصر ہے؟ اسی ڈبے میں موسم بدلیں۔',
            'پہلی لائن ایسے ہوگی: `let weather = "sunny"`'
          ],
          solution: 'let weather = "sunny"\nif (weather === "rain") {\n  say("Take an umbrella!")\n} else {\n  say("Fly a kite!")\n}',
          solutionNote: 'ڈبے میں اب بارش نہیں، اس لیے سوال کا جواب نہیں ہے اور `else` والا حصہ چلا۔',
          check: function (out, code, r, T) {
            var all = out.map(text).join(' ');
            var now = restOf(T, code), start = restOf(T, START_51);
            if (!now.found) return { msg: '`let weather` والی لائن غائب ہے۔ اسے واپس لکھیں، جیسے `let weather = "sunny"`' };
            // The if/else block must still be there, unchanged (extra lines, one-line layout, ' or ; or console.log are fine).
            if (norm(now.rest.join('')).indexOf(norm(start.rest.join(''))) < 0) {
              var says = function (x) { return norm(x.rest.filter(function (l) { return /say\(|console\.log\(/.test(l); }).join('')); };
              if (says(now) !== says(start) && /fly a kite/i.test(all))
                return { msg: 'برڈی نے `Fly a kite!` تو کہا، مگر فیصلہ نہیں بدلا! `say` کی لکھائی واپس ویسی کریں، اور ڈبے کا موسم بدلیں۔' };
              return { msg: 'آپ نے `if` والے حصے میں کچھ بدل دیا ہے۔ اسے ویسا ہی رہنے دیں اور صرف پہلی لائن میں ڈبے کا موسم بدلیں۔' };
            }
            if (/umbrella/i.test(all)) return { mood: 'nudge', msg: 'برڈی نے ابھی بھی چھتری کا کہا، کیونکہ ڈبے میں ابھی بھی `"rain"` ہے۔ پہلی لائن میں موسم بدلیں۔' };
            if (/fly a kite/i.test(all)) return { pass: true };
            return { msg: 'برڈی نے `Fly a kite!` نہیں کہا۔ پہلی لائن میں `"rain"` کی جگہ `"sunny"` لکھیں۔' };
          }
        },
        tests: [
          { code: 'let weather = "sunny"\nif (weather === "rain") {\n  say("Take an umbrella!")\n} else {\n  say("Fly a kite!")\n}', pass: true, note: 'sunny' },
          { code: 'let weather = "snow"\nif (weather === "rain") {\n  say("Take an umbrella!")\n} else {\n  say("Fly a kite!")\n}', pass: true, note: 'any other weather' },
          { code: "let weather='sunny'  // no rain today\nif (weather === \"rain\") {\n  say(\"Take an umbrella!\")\n} else {\n  say(\"Fly a kite!\")\n}", pass: true, note: 'single quotes, no spaces, a comment' },
          { code: 'let weather = "rain"\nif (weather === "rain") {\n  say("Fly a kite!")\n} else {\n  say("Fly a kite!")\n}', pass: false, note: 'edited the text inside say', has: 'فیصلہ نہیں بدلا' },
          { code: 'let weather = "rain"\nif (weather === "sunny") {\n  say("Take an umbrella!")\n} else {\n  say("Fly a kite!")\n}', pass: false, note: 'changed the if line instead of the box', has: 'پہلی لائن' },
          { code: START_51, pass: false, note: 'nothing changed', has: 'چھتری' },
          { code: 'if (weather === "rain") {\n  say("Take an umbrella!")\n} else {\n  say("Fly a kite!")\n}\nlet weather = "sunny"', pass: false, note: 'box made after it is used (runtime error)' },
          { code: 'let weather = "sunny"\nif (weather === "rain") {\n  console.log("Take an umbrella!")\n} else {\n  console.log("Fly a kite!")\n}', pass: true, note: 'console.log instead of say' },
          { code: 'let weather = "sunny"\nif (weather === "rain") { say("Take an umbrella!") } else { say("Fly a kite!") }', pass: true, note: 'whole if on one line' },
          { code: START_51.replace('"rain"', '"sunny"') + '\nsay("Have fun!")', pass: true, note: 'an extra line at the end' }
        ],
        recap: '`if` کے بعد والی شرط سچ ہو تو پہلا حصہ چلتا ہے، ورنہ `else` والا۔ <strong>دونوں کبھی ایک ساتھ نہیں چلتے۔</strong>'
      },

      {
        id: '5.2', short: 'ٹیسٹ', title: 'ٹریفک لائٹ',
        learn: {
          say: [
            'ایک `=` ڈبے میں چیز <strong>رکھتا</strong> ہے۔',
            'تین `===` <strong>پوچھتے</strong> ہیں: کیا دونوں بالکل برابر ہیں؟',
            'جواب `true` یعنی ہاں، یا `false` یعنی نہیں ہوتا ہے۔'
          ],
          example: 'let fruit = "apple"\nsay(fruit === "apple")\nsay(fruit === "mango")',
          flow: true
        },
        guess: {
          q: 'اگر `light` میں `"green"` ہو تو کون سی لائنیں چلیں گی؟',
          code: 'let light = "green"\nif (light === "red") {\n  circle(200, 150, 60, "red")\n  say("Stop!")\n} else {\n  circle(200, 150, 60, "green")\n  say("Go!")\n}',
          options: ['`if` والی', '`else` والی', 'دونوں'],
          correct: 1,
          why: 'بتی لال نہیں، اس لیے سوال کا جواب نہیں ہے۔ تو `else` والی لائنیں چلیں: ہرا دائرہ اور `Go!`۔'
        },
        task: {
          intro: 'بتی لال ہو تو برڈی <strong>رکے</strong>، ورنہ <strong>چلے</strong>۔ کمپیوٹر آپ کا کوڈ <strong>لال، پیلی اور ہری</strong> تینوں بتیوں سے آزمائے گا۔',
          steps: [
            'لائن 2 میں `___` مٹائیں۔',
            'اس کی جگہ شرط لکھیں جو پوچھے: کیا `light` لال ہے؟',
            '«چلاؤ» دبائیں اور تینوں ٹیسٹ دیکھیں۔'
          ],
          starter: 'let light = "red"\nif (___) {\n  circle(200, 150, 60, "red")\n  say("Stop!")\n} else {\n  circle(200, 150, 60, "green")\n  say("Go!")\n}',
          hints: [
            'ہمیں پوچھنا ہے: کیا `light` لال ہے؟ پوچھنے کے لیے کون سا نشان لگتا ہے؟',
            'شرط ایسے ہوگی: `light === "red"`'
          ],
          solution: 'let light = "red"\nif (light === "red") {\n  circle(200, 150, 60, "red")\n  say("Stop!")\n} else {\n  circle(200, 150, 60, "green")\n  say("Go!")\n}',
          solutionNote: '`===` پوچھتا ہے کہ کیا بتی لال ہے۔ لال ہو تو `Stop!`، ورنہ `Go!`۔',
          check: async function (out, code, r, T) {
            if (!/\blet\s+light\s*=/.test(T.bare(code)))
              return { msg: 'کمپیوٹر کو `let light` والی لائن چاہیے تاکہ وہ بتی بدل کر آزما سکے۔ وہ لائن واپس لکھیں۔' };
            var cases = [['red', 'لال بتی', 'Stop!'], ['yellow', 'پیلی بتی', 'Go!'], ['green', 'ہری بتی', 'Go!']];
            var tests = [], bad = null;
            for (var i = 0; i < cases.length; i++) {
              var c = cases[i], rr = await T.run(T.setLet(code, 'light', c[0]), { boxes: true }), s = said(rr);
              var stop = /stop/i.test(s), go = /\bgo\b/i.test(s);
              var ok = !rr.error && (c[2] === 'Stop!' ? stop && !go : go && !stop);
              tests.push({ label: c[1], ok: ok, got: got(rr) });
              if (!ok && !bad) bad = { c: c, s: s };
            }
            if (!bad) return { pass: true, tests: tests };
            var passed = tests.filter(function (t) { return t.ok; }).length;
            var ifs = code.split('\n').filter(function (l) { return /\bif\s*\(/.test(l); }).join(' ');
            if (/["'](Red|RED)["']/.test(ifs))
              return { mood: 'nudge', tests: tests, msg: 'کمپیوٹر بڑے اور چھوٹے حروف میں فرق کرتا ہے: `"Red"` اور `"red"` اس کے لیے الگ ہیں۔ شرط میں چھوٹے حروف میں `"red"` لکھیں۔' };
            return {
              mood: passed ? 'nudge' : undefined, tests: tests,
              msg: bad.c[1] + ' پر برڈی کو `' + bad.c[2] + '` کہنا تھا، مگر ' + (bad.s ? 'اس نے `' + bad.s + '` کہا۔' : 'وہ خاموش رہا۔') +
                ' شرط دوبارہ دیکھیں: کیا وہ پوچھ رہی ہے کہ بتی لال ہے؟'
            };
          }
        },
        tests: [
          { code: 'let light = "red"\nif (light === "red") {\n  circle(200, 150, 60, "red")\n  say("Stop!")\n} else {\n  circle(200, 150, 60, "green")\n  say("Go!")\n}', pass: true, note: 'the solution' },
          { code: 'let light = "green"\nif ("red" === light) {\n  circle(200, 150, 60, "red")\n  say("Stop!")\n} else {\n  circle(200, 150, 60, "green")\n  say("Go!")\n}', pass: true, note: 'reversed sides, box starts green' },
          { code: 'let light = "red"\nif (light !== "red") {\n  circle(200, 150, 60, "green")\n  say("Go!")\n} else {\n  circle(200, 150, 60, "red")\n  say("Stop!")\n}', pass: true, note: '!== with swapped branches' },
          { code: 'let light = "red"\nif (light = "red") {\n  circle(200, 150, 60, "red")\n  say("Stop!")\n} else {\n  circle(200, 150, 60, "green")\n  say("Go!")\n}', pass: false, note: 'single = (Error Doctor lint)', has: '`===`' },
          { code: 'let light = "red"\nif (light === "green") {\n  circle(200, 150, 60, "red")\n  say("Stop!")\n} else {\n  circle(200, 150, 60, "green")\n  say("Go!")\n}', pass: false, note: 'asked about green: wrong for red and yellow', has: 'لال بتی' },
          { code: 'let light = "red"\nif (light !== "green") {\n  circle(200, 150, 60, "red")\n  say("Stop!")\n} else {\n  circle(200, 150, 60, "green")\n  say("Go!")\n}', pass: false, note: 'wrong branch for yellow', has: 'پیلی بتی' },
          { code: 'let light = "red"\nif (light !== "red") {\n  circle(200, 150, 60, "red")\n  say("Stop!")\n} else {\n  circle(200, 150, 60, "green")\n  say("Go!")\n}', pass: false, note: '!== without swapping the branches', has: 'لال بتی' },
          { code: 'if ("red" === "red") {\n  circle(200, 150, 60, "red")\n  say("Stop!")\n} else {\n  circle(200, 150, 60, "green")\n  say("Go!")\n}', pass: false, note: 'deleted the let light line', has: '`let light`' },
          { code: 'let light = "red"\nif (light === "Red") {\n  circle(200, 150, 60, "red")\n  say("Stop!")\n} else {\n  circle(200, 150, 60, "green")\n  say("Go!")\n}', pass: false, note: 'capital R in "Red"', has: 'حروف' }
        ],
        recap: 'کمپیوٹر نے آپ کا ایک ہی کوڈ <strong>تین</strong> بتیوں سے آزمایا۔ اسے <strong>ٹیسٹ</strong> کرنا کہتے ہیں، اور اصل پروگرامر یہی کرتے ہیں!' +
          '<br><strong>مگر پیلی بتی پر `Go!`؟</strong> اصل سڑک پر پیلی بتی کا مطلب ہے: تیار ہو جاؤ۔ دو سے زیادہ راستے کیسے بنتے ہیں؟ یہ اگلے لیولوں میں!'
      },

      {
        id: '5.3', short: 'نمبر بوجھیں', title: 'نمبر بوجھیں',
        learn: {
          say: [
            '`random(1, 6)` 1 سے 6 تک کوئی بھی نمبر چنتا ہے، بالکل لوڈو کے پانسے کی طرح۔ ہر بار نیا نمبر!',
            '`askNumber` آپ سے ایک نمبر پوچھ کر ڈبے میں رکھ دیتا ہے۔'
          ],
          example: 'let dice = random(1, 6)\nsay("You rolled " + dice)\nif (dice === 6) {\n  say("Six! Lucky!")\n} else {\n  say("Roll again!")\n}',
          flow: true
        },
        task: {
          intro: 'ایک کھیل بنائیں! برڈی ایک راز والا نمبر چنتا ہے اور آپ بوجھتے ہیں۔ شرط لکھیں تاکہ صحیح اندازہ ہو تو برڈی شاباش دے۔',
          steps: [
            'لائن 3 میں `___` مٹائیں۔',
            'شرط لکھیں جو پوچھے: کیا `guess` اور `secret` برابر ہیں؟',
            '«چلاؤ» دبائیں، نمبر بوجھیں اور کھیلیں!'
          ],
          starter: 'let secret = random(1, 10)\nlet guess = askNumber("Guess a number from 1 to 10")\nif (___) {\n  say("Wow! You got it!")\n} else {\n  say("No! The number was " + secret)\n}',
          answers: [5],
          hints: [
            'دو ڈبوں کا موازنہ کرنا ہے۔ کون سے دو ڈبے؟',
            'شرط ایسے ہوگی: `guess === secret`'
          ],
          solution: 'let secret = random(1, 10)\nlet guess = askNumber("Guess a number from 1 to 10")\nif (guess === secret) {\n  say("Wow! You got it!")\n} else {\n  say("No! The number was " + secret)\n}',
          solutionNote: '`===` پوچھتا ہے کہ کیا آپ کا اندازہ اور راز والا نمبر بالکل برابر ہیں۔',
          check: async function (out, code, r, T) {
            var b = T.bare(code);
            if (!/\brandom\s*\(/.test(b) || !/\baskNumber\s*\(/.test(b))
              return { msg: '`random` اور `askNumber` والی لائنیں واپس لائیں۔ انہی سے کھیل بنتا ہے۔' };
            var runs = [[7, 7], [3, 8], [4, 4], [9, 2]], tests = [], bad = null, outs = [];
            for (var i = 0; i < runs.length; i++) outs.push(await T.run(code, { randoms: [runs[i][0]], answers: [runs[i][1]], boxes: true }));
            // The child may write their own messages: then the "right" message is whatever Mithu says when the guess is right,
            // and it must be the same both times and never appear for a wrong guess.
            var own = !outs.some(function (x) { return /wow|got it|\bno\b|number was/i.test(said(x)); });
            var hit = said(outs[0]);
            if (own && /oops|sorry|wrong|not|\bno\b/i.test(hit)) hit = '';
            for (var i = 0; i < runs.length; i++) {
              var sec = runs[i][0], gs = runs[i][1], same = sec === gs, rr = outs[i], s = said(rr);
              var yes = own ? !!hit && s === hit : /wow|got it/i.test(s), no = own ? !!s && s !== hit : /\bno\b|number was/i.test(s);
              var ok = !rr.error && (same ? yes && !no : no && !yes);
              tests.push({ label: 'راز ' + sec + '، اندازہ ' + gs, ok: ok, got: got(rr) });
              if (!ok && !bad) bad = { sec: sec, gs: gs, same: same, quiet: !rr.error && !s };
            }
            if (!bad) return { pass: true, tests: tests };
            if (/["']secret["']/.test(code))
              return { tests: tests, msg: '`"secret"` لکھنے سے `secret` ڈبہ نہیں، صرف ایک لفظ بن گیا! `secret` کے گرد سے `" "` ہٹائیں۔' };
            if (bad.quiet && !bad.same)
              return { tests: tests, msg: 'جب راز ' + bad.sec + ' تھا اور اندازہ ' + bad.gs + ' تھا، تو برڈی خاموش رہا۔ `else` والا حصہ واپس لائیں، تاکہ غلط اندازے پر بھی برڈی کچھ کہے۔' };
            if (bad.same)
              return { tests: tests, msg: 'جب راز ' + bad.sec + ' تھا اور اندازہ بھی ' + bad.gs + ' تھا، تب بھی برڈی نے شاباش نہیں دی۔ شرط میں `guess` اور `secret` کا موازنہ کریں۔' };
            return { tests: tests, msg: 'جب راز ' + bad.sec + ' تھا اور اندازہ ' + bad.gs + ' تھا، تب بھی برڈی نے شاباش دے دی! شرط کو پوچھنا ہے کہ کیا دونوں <strong>برابر</strong> ہیں۔' };
          }
        },
        tests: [
          { code: 'let secret = random(1, 10)\nlet guess = askNumber("Guess a number from 1 to 10")\nif (guess === secret) {\n  say("Wow! You got it!")\n} else {\n  say("No! The number was " + secret)\n}', pass: true, note: 'the solution' },
          { code: 'let secret = random(1, 10)\nlet guess = askNumber("Guess a number from 1 to 10")\nif (secret === guess) {\n  say("Wow! You got it!")\n} else {\n  say("No! The number was " + secret)\n}', pass: true, note: 'sides swapped' },
          { code: 'let secret = random(1, 10)\nlet guess = askNumber("Guess a number from 1 to 10")\nif (guess !== secret) {\n  console.log("No! The number was " + secret)\n} else {\n  console.log("Wow! You got it!")\n}', pass: true, note: '!== with swapped branches, console.log' },
          { code: 'let secret = random(1, 10)\nlet guess = askNumber("Guess a number from 1 to 10")\nif (guess === "secret") {\n  say("Wow! You got it!")\n} else {\n  say("No! The number was " + secret)\n}', pass: false, note: 'guess === "secret"', has: '`" "`' },
          { code: 'let secret = random(1, 10)\nlet guess = askNumber("Guess a number from 1 to 10")\nif (guess = secret) {\n  say("Wow! You got it!")\n} else {\n  say("No! The number was " + secret)\n}', pass: false, note: 'single =', has: '`===`' },
          { code: 'let secret = random(1, 10)\nlet guess = askNumber("Guess a number from 1 to 10")\nif (guess > secret) {\n  say("Wow! You got it!")\n} else {\n  say("No! The number was " + secret)\n}', pass: false, note: 'used >', has: 'شاباش' },
          { code: 'let secret = random(1, 10)\nlet guess = askNumber("Guess a number from 1 to 10")\nif (guess === 7) {\n  say("Wow! You got it!")\n} else {\n  say("No! The number was " + secret)\n}', pass: false, note: 'compared with a fixed number', has: 'شاباش' },
          { code: 'let secret = 7\nlet guess = askNumber("Guess a number from 1 to 10")\nif (guess === secret) {\n  say("Wow! You got it!")\n} else {\n  say("No! The number was " + secret)\n}', pass: false, note: 'removed random', has: '`random`' },
          { code: 'let secret = random(1, 10)\nlet guess = askNumber("Your guess?")\nif (guess === secret) {\n  say("Yes! Well done")\n} else {\n  say("Sorry, it was " + secret)\n}', pass: true, note: 'own messages and question' },
          { code: 'let secret = random(1, 10)\nlet guess = askNumber("Guess a number from 1 to 10")\nif (guess === secret) {\n  say("Wow! You got it!")\n}', pass: false, note: 'deleted the else part', has: 'خاموش' }
        ],
        recap: '`random(1, 10)` ہر بار نیا نمبر چنتا ہے، اس لیے کھیل ہر بار مختلف ہوتا ہے۔ `askNumber` آپ سے نمبر پوچھ کر ڈبے میں رکھ دیتا ہے۔'
      },

      {
        id: '5.4', short: 'تین راستے', title: 'بڑا، چھوٹا یا بالکل ٹھیک؟',
        learn: {
          say: [
            'کبھی دو سے زیادہ راستے چاہئیں۔ اس کے لیے `else if` لکھتے ہیں، یعنی <strong>ورنہ اگر</strong>۔',
            '`>` پوچھتا ہے: کیا بڑا ہے؟ `<` پوچھتا ہے: کیا چھوٹا ہے؟ جیسے `marks > 5`۔',
            'کمپیوٹر اوپر سے پوچھتا جاتا ہے۔ جس پہلی شرط کا جواب ہاں ہو، وہی راستہ لیتا ہے۔',
            'کسی کا جواب ہاں نہ ہو تو آخری `else` والا راستہ۔'
          ],
          example: 'let marks = 7\nif (marks === 10) {\n  say("Full marks!")\n} else if (marks > 5) {\n  say("Well done!")\n} else {\n  say("Keep trying!")\n}',
          flow: true
        },
        task: {
          parsons: {
            lines: [
              '} else if (guess > secret) {',
              '  say("Too big! Guess a smaller number")',
              'if (guess === secret) {',
              '} else {',
              '  say("Too small! Guess a bigger number")',
              '  say("Just right!")',
              '}'
            ],
            order: [2, 5, 0, 1, 3, 4, 6],
            prefix: PREFIX_54,
            final: true,
            intro: 'لائنیں ترتیب دیں تاکہ برڈی بتائے کہ اندازہ <strong>بڑا</strong> ہے، <strong>چھوٹا</strong> ہے یا <strong>بالکل ٹھیک</strong>۔ اوپر والی دو لائنیں اپنی جگہ پکی ہیں۔',
            steps: [
              '▲ ▼ والے بٹن سے لائنیں اوپر نیچے کریں۔',
              'سب سے پہلے پوچھیں: کیا بالکل ٹھیک ہے؟ پھر: کیا بڑا ہے؟ باقی بچا: چھوٹا۔',
              '«چلاؤ» دبائیں۔ کمپیوٹر تینوں طرح کے اندازے آزمائے گا۔'
            ],
            wrong: 'ابھی ترتیب ٹھیک نہیں۔ ہر `say` اپنے سوال کے فوراً نیچے ہونا چاہیے۔',
            done: 'زبردست ترتیب!'
          },
          answers: [5],
          hints: [
            'تین ممکنہ نتیجے ہیں۔ پہلے سب سے خوشی والا سوال پوچھیں: کیا بالکل ٹھیک ہے؟',
            'ترتیب: `if (guess === secret)`، پھر `else if (guess > secret)`، پھر `else`۔ ہر ایک کے نیچے اس کا `say`، اور آخر میں `}`۔'
          ],
          solution: PREFIX_54 + '\nif (guess === secret) {\n  say("Just right!")\n} else if (guess > secret) {\n  say("Too big! Guess a smaller number")\n} else {\n  say("Too small! Guess a bigger number")\n}',
          solutionNote: 'پہلے برابر، پھر بڑا، اور جو باقی بچا وہ چھوٹا۔ ہر `say` اپنے سوال کے نیچے۔',
          check: async function (out, code, r, T) {
            var runs = [
              [5, 'بالکل ٹھیک', /just right/i, '`Just right!`'],
              [8, 'بڑا اندازہ', /too big/i, '`Too big!`'],
              [2, 'چھوٹا اندازہ', /too small/i, '`Too small!`']
            ];
            var all = [/just right/i, /too big/i, /too small/i], tests = [], bad = null;
            for (var i = 0; i < runs.length; i++) {
              var c = runs[i], rr = await T.run(code, { randoms: [5], answers: [c[0]], boxes: true }), s = said(rr);
              var ok = !rr.error && all.every(function (re) { return re.test(s) === (re.source === c[2].source); });
              tests.push({ label: c[1] + ' (' + c[0] + ')', ok: ok, got: got(rr) });
              if (!ok && !bad) bad = c;
            }
            if (!bad) return { pass: true, tests: tests };
            return {
              tests: tests,
              msg: 'جب راز 5 تھا اور اندازہ ' + bad[0] + ' تھا، تو برڈی کو ' + bad[3] + ' کہنا تھا۔ دیکھیں کہ ہر `say` اپنے سوال کے فوراً نیچے ہو۔'
            };
          }
        },
        tests: [
          { code: PREFIX_54 + '\nif (guess === secret) {\n  say("Just right!")\n} else if (guess > secret) {\n  say("Too big! Guess a smaller number")\n} else {\n  say("Too small! Guess a bigger number")\n}', pass: true, note: 'the right order' },
          { code: PREFIX_54 + '\nif (guess === secret) {\n  say("Just right!")\n} else if (guess < secret) {\n  say("Too small! Guess a bigger number")\n} else {\n  say("Too big! Guess a smaller number")\n}', pass: true, note: 'asks "smaller?" second' },
          { code: PREFIX_54 + '\nif (guess > secret) {\n  say("Too big! Guess a smaller number")\n} else if (guess < secret) {\n  say("Too small! Guess a bigger number")\n} else {\n  say("Just right!")\n}', pass: true, note: 'equal case last' },
          { code: PREFIX_54 + '\nif (guess === secret) {\n  say("Just right!")\n} else if (guess > secret) {\n  say("Too small! Guess a bigger number")\n} else {\n  say("Too big! Guess a smaller number")\n}', pass: false, note: 'big and small messages swapped', has: '`Too big!`' },
          { code: PREFIX_54 + '\nif (guess === secret) {\n  say("Too big! Guess a smaller number")\n} else if (guess > secret) {\n  say("Just right!")\n} else {\n  say("Too small! Guess a bigger number")\n}', pass: false, note: 'just right under the wrong question', has: '`Just right!`' },
          { code: PREFIX_54 + '\nif (guess === secret) {\n  say("Just right!")\n  say("Too big! Guess a smaller number")\n} else if (guess > secret) {\n} else {\n  say("Too small! Guess a bigger number")\n}', pass: false, note: 'two says in the first branch', has: 'فوراً نیچے' },
          { code: PREFIX_54 + '\nif (guess === "secret") {\n  say("Just right!")\n} else if (guess > secret) {\n  say("Too big! Guess a smaller number")\n} else {\n  say("Too small! Guess a bigger number")\n}', pass: false, note: 'guess === "secret"', has: '`Just right!`' },
          { code: PREFIX_54 + '\nif (guess === secret) {\n  say("Just right!")\n} else {\n  say("Too small! Guess a bigger number")\n} else if (guess > secret) {\n  say("Too big! Guess a smaller number")\n}', pass: false, note: 'else before else if (Error Doctor)', has: '`else`' }
        ],
        recap: '`else if` سے جتنے چاہیں راستے بن سکتے ہیں۔ کمپیوٹر اوپر سے پوچھتا جاتا ہے اور جس پہلی شرط کا جواب ہاں ہو، وہی راستہ لیتا ہے۔'
      },

      {
        id: '5.5', short: 'نجومی', title: 'نجومی طوطا', make: true,
        bubble: 'آج میں نجومی ہوں! ✨',
        learn: {
          say: [
            'برڈی اب <strong>نجومی</strong> بنے گا اور آپ کا مستقبل بتائے گا!',
            '`random` ایک نمبر چنتا ہے، اور `if` ہر نمبر پر الگ بات کہلواتا ہے۔ یہاں سکہ اچھالا گیا ہے:'
          ],
          example: 'let coin = random(1, 2)\nif (coin === 1) {\n  say("Heads!")\n} else {\n  say("Tails!")\n}',
          flow: true
        },
        task: {
          intro: 'برڈی ایک نجومی ہے! `luck` کے ہر نمبر پر برڈی ایک <strong>مختلف</strong> مزے دار پیش گوئی کرے۔',
          steps: [
            '`if`، `else if` اور `else` سے کم از کم <strong>3 راستے</strong> بنائیں۔',
            'ہر راستے میں ایک `say` لکھیں، ہر ایک میں الگ پیش گوئی۔',
            '«چلاؤ» دبائیں۔ کمپیوٹر آپ کا کوڈ `luck` کے 1، 2 اور 3 سے آزمائے گا۔',
            'بونس: سب سے اوپر `let name = ask("What is your name?")` لکھیں، اور پیش گوئی میں نام بھی ڈالیں: `say(name + ", you will be rich!")`'
          ],
          starter: 'let luck = random(1, 3)\n// Write Birdy\'s fortunes here\n',
          answers: ['Ali', 'Ali', 'Ali'],
          hints: [
            'لیول 5.4 کی طرح `if`، `else if` اور `else` استعمال کریں۔',
            'ایسے شروع کریں: `if (luck === 1) { say("You will get mangoes today!") } else if (luck === 2) { ... }`'
          ],
          solution: 'let luck = random(1, 3)\nif (luck === 1) {\n  say("You will get mangoes today!")\n} else if (luck === 2) {\n  say("You will meet an old friend!")\n} else {\n  say("Full marks in your next test!")\n}',
          solutionNote: 'تین راستے، اور ہر راستے میں الگ پیش گوئی۔ `luck` جو بھی ہو، برڈی کچھ نیا کہتا ہے۔',
          check: async function (out, code, r, T) {
            var b = T.bare(code);
            if (!/\bif\s*\(/.test(b)) return { mood: 'nudge', msg: 'برڈی کو `luck` دیکھ کر فیصلہ کرنا ہے۔ `if (luck === 1)` سے شروع کریں۔' };
            if (!/\blet\s+luck\s*=\s*random\s*\(/.test(b)) return { msg: 'پہلی لائن `let luck = random(1, 3)` ویسی ہی رکھیں، تاکہ ہر بار نئی قسمت نکلے۔' };
            var tests = [], seen = {}, silent = null;
            for (var n = 1; n <= 3; n++) {
              var rr = await T.run(code, { randoms: [n], answers: ['Ali', 'Ali', 'Ali'], boxes: true }), s = said(rr);
              var ok = !rr.error && !!s && !seen[s];
              tests.push({ label: 'نمبر ' + n, ok: ok, got: got(rr) });
              if (!s && silent === null) silent = n;
              if (s) seen[s] = true;
            }
            var kinds = Object.keys(seen).length;
            if (/(===|==|!==)\s*["']\d+["']|["']\d+["']\s*(===|==|!==)/.test(code))
              return { tests: tests, msg: 'نمبر کے گرد `" "` نہیں لگتے۔ `luck === "1"` کی جگہ `luck === 1` لکھیں۔' };
            if (silent !== null) return { mood: 'nudge', tests: tests, msg: 'جب `luck` میں ' + silent + ' تھا تو برڈی خاموش رہا۔ ہر نمبر کے لیے ایک پیش گوئی لکھیں۔' };
            if (kinds < 3) return { mood: 'nudge', tests: tests, msg: 'تین نمبروں پر برڈی نے صرف ' + kinds + ' طرح کی پیش گوئی کی۔ ہر نمبر کی پیش گوئی <strong>مختلف</strong> ہو۔' };
            return { pass: true, tests: tests };
          }
        },
        tests: [
          { code: 'let luck = random(1, 3)\nif (luck === 1) {\n  say("You will get mangoes today!")\n} else if (luck === 2) {\n  say("You will meet an old friend!")\n} else {\n  say("Full marks in your next test!")\n}', pass: true, note: 'the example solution' },
          { code: 'let luck = random(1, 3)\nif (luck === 1) {\n  say("A kite day!")\n}\nif (luck === 2) {\n  say("Rain is coming!")\n}\nif (luck === 3) {\n  say("Biryani for dinner!")\n}', pass: true, note: 'three separate ifs' },
          { code: 'let name = ask("What is your name?")\nlet luck = random(1, 3)\nif (luck === 1) {\n  say(name + ", you will be rich!")\n} else if (luck === 2) {\n  say(name + ", you will fly a plane!")\n} else {\n  say(name + ", you will win a cricket match!")\n}', pass: true, note: 'optional extra: ask for a name', answers: ['Sara'] },
          { code: 'let luck = random(1, 3)\nif (luck === 1) {\n  say("Good luck!")\n} else {\n  say("Bad luck!")\n}', pass: false, note: 'only two fortunes', has: 'مختلف' },
          { code: 'let luck = random(1, 3)\nif (luck === 1) {\n  say("Good luck!")\n} else if (luck === 2) {\n  say("Good luck!")\n}', pass: false, note: 'same text twice, silent on 3', has: 'خاموش' },
          { code: 'let luck = 2\nif (luck === 1) {\n  say("A")\n} else if (luck === 2) {\n  say("B")\n} else {\n  say("C")\n}', pass: false, note: 'fixed luck, no random', has: '`let luck = random(1, 3)`' },
          { code: 'let luck = random(1, 3)\nsay("You will get mangoes!")\nsay("You will meet a friend!")\nsay("Full marks!")', pass: false, note: 'no if at all', has: '`if (luck === 1)`' },
          { code: 'let luck = random(1, 3)\nif (luck === "1") {\n  say("A")\n} else if (luck === "2") {\n  say("B")\n} else {\n  say("C")\n}', pass: false, note: 'numbers in quotes', has: '`luck === 1`' },
          { code: 'let luck = random(1, 3)\nsay("Birdy looks at the stars...")\nif (luck === 1) {\n  console.log("Rain tomorrow!")\n} else if (luck === 2) {\n  console.log("A new bicycle!")\n} else {\n  console.log("Ice cream tonight!")\n}', pass: true, note: 'same first line, then console.log fortunes' },
          { code: 'let luck = random(1, 4)\nif (luck === 1) {\n  say("A")\n} else if (luck === 2) {\n  say("B")\n} else if (luck === 3) {\n  say("C")\n} else {\n  say("D")\n}', pass: true, note: 'four fortunes' }
        ],
        recap: '`random` اور `if` مل کر ایسا پروگرام بناتے ہیں جو ہر بار نیا لگے۔ یہی کھیلوں کی جان ہے!'
      }
    ]
  };

  // What Mithu says out loud: very short, very simple English, read slowly by the device's own voice.
  var VOICE = {
    '5.1': {
      learn: 'The computer can make a choice! We write the word: if. After if, we ask a question in brackets. Like: is the fruit mango? If the answer is yes, the first part runs. If not, the else part runs. Never both.',
      guess: 'Look at this code. What will Birdy say? Choose one answer.',
      why: 'The weather box has rain in it. So the answer is yes, and the first part runs. The else part does not run.',
      task: 'Your turn. Change only one thing, so Birdy says: Fly a kite. Think. Which box does Birdy look at? In the first line, change rain to sunny. Then press Run.',
      hints: ['Which box does Birdy look at to decide? Change the weather in that box.',
              'The first line is: let weather equals sunny. Sunny goes inside quotes.'],
      solution: 'There is no rain in the box now. So the answer is no, and the else part runs.',
      recap: 'Well done! If the question is true, the first part runs. If not, the else part runs. Never both together.'
    },
    '5.2': {
      learn: 'One equals sign puts something in a box. Three equals signs ask a question: are these two the same? The answer is true, for yes. Or false, for no.',
      guess: 'The light is green. Which lines will run? Choose one answer.',
      why: 'The light is not red. So the answer is no, and the else lines run. A green circle, and Go.',
      task: 'Your turn. If the light is red, Birdy stops. If not, Birdy goes. The computer will test your code with red, yellow and green. Delete the blanks on line 2. Write a question: is light red? Then press Run, and look at the three tests.',
      hints: ['We want to ask: is the light red? Which sign asks a question?',
              'The question is: light, three equals signs, red in quotes.'],
      solution: 'Three equals signs ask: is the light red? Red means Stop. Anything else means Go.',
      recap: 'Great! The computer tested your code with three lights. This is called testing. Real programmers do it too! But Go on a yellow light? We will learn more paths soon.'
    },
    '5.3': {
      learn: 'random 1 to 6 picks any number from 1 to 6, like a Ludo dice. A new number every time! askNumber asks you for a number, and puts it in a box.',
      task: 'Let\'s make a game! Birdy picks a secret number, and you guess it. Delete the blanks on line 3. Write a question: are guess and secret the same? Then press Run, and play!',
      hints: ['You need to compare two boxes. Which two boxes?',
              'The question is: guess, three equals signs, secret.'],
      solution: 'Three equals signs ask: is your guess the same as the secret number?',
      recap: 'Well done! random picks a new number every time, so the game is different every time. askNumber asks you for a number.'
    },
    '5.4': {
      learn: 'Sometimes we need more than two paths. Then we write: else if. The greater than sign asks: is it bigger? The less than sign asks: is it smaller? The computer asks from the top. It takes the first path where the answer is yes. If no answer is yes, it takes the last else.',
      taskA: 'Put the lines in order. Birdy should say if your guess is too big, too small, or just right. The top two lines are fixed. First ask: is it just right? Then ask: is it too big? What is left is too small. Then press Run.',
      hints: ['There are three results. First ask the happy question: is it just right?',
              'The order is: if equal. Then else if bigger. Then else. Put each say under its question. The last line is a closing curly bracket.'],
      solution: 'First equal. Then bigger. What is left is smaller. Each say sits under its own question.',
      recap: 'Great! With else if, you can make as many paths as you want. The computer takes the first path where the answer is yes.'
    },
    '5.5': {
      learn: 'Birdy is a fortune teller now! random picks a number. And if makes Birdy say something different for each number. Here, we toss a coin.',
      task: 'Make Birdy a fortune teller! Use if, else if, and else, to make three paths. In each path, write a different fortune with say. Then press Run. The computer will test your code with luck 1, 2 and 3. Bonus: use ask, to ask for a name, and put the name in your fortunes!',
      hints: ['Use if, else if, and else, just like in level 5.4.',
              'Start like this: if luck equals 1, say: You will get mangoes today. Else if luck equals 2, and so on.'],
      solution: 'Three paths. A different fortune in each path. Whatever the luck, Birdy says something new.',
      recap: 'Amazing! random and if together make a program that feels new every time. This is the heart of every game!'
    }
  };
  M.levels.forEach(function (L) { L.voice = VOICE[L.id]; });
  (window.MODULES = window.MODULES || []).push(M);
})();
