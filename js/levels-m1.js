// Module 1: میٹھو، بولو! (Mithu, speak!)
// Every level: learn -> guess (optional) -> task -> recap. Children only ever type English.
// Urdu is for reading; backticks mark code. check(outputs, code) returns {pass:true} or {msg, mood:'nudge'}.
(function () {
  function text(o) { return String(o.value).trim(); }
  // Mithu said nothing: point at square brackets if the child used them, else at say.
  function silent(code) {
    if (/\b(say|console\.log)\s*\[/.test(code)) return { msg: 'برڈی خاموش رہا۔ `say` کے بعد گول بریکٹ `(` اور `)` لگائیں، `[` `]` نہیں۔' };
    return { msg: 'برڈی خاموش رہا۔ کیا لائن `say` سے شروع ہوتی ہے؟' };
  }

  var M = {
    id: 'm1',
    number: 1,
    title: 'برڈی، بولو!',
    badge: { name: 'بولنے والا طوطا', line: 'آپ نے برڈی کو بولنا سکھا دیا!' },
    next: 'اگلے ماڈیول میں برڈی چیزیں <strong>یاد رکھنا</strong> سیکھے گا۔',

    lesson:
      '<p>`say` کا مطلب ہے: <strong>بولو!</strong> یہ برڈی کو بولنے کا حکم ہے۔</p>' +
      '<p>برڈی کے الفاظ `" "` کے اندر لکھیں: `say("Salaam")`</p>' +
      '<p>کمپیوٹر لائنیں <strong>اوپر سے نیچے</strong> پڑھتا ہے۔</p>' +
      '<p>نمبر بغیر `" "` کے لکھیں تو `+` انہیں جمع کرتا ہے: `say(2 + 3)` سے برڈی 5 بولتا ہے۔</p>' +
      '<p>کوڈ ہمیشہ <strong>انگریزی حروف</strong> میں لکھیں۔</p>',

    commands: [
      { code: 'say("…")', ur: 'برڈی `" "` کے اندر والے الفاظ بولتا ہے۔', from: '1.1' },
      { code: 'console.log(…)', ur: 'بڑے پروگرامر والا `say`۔ جواب نیچے کنسول میں آتا ہے۔', from: '1.4' }
    ],

    levels: [
      {
        id: '1.1', short: 'پہلا حکم', title: 'برڈی کو بلوائیں',
        learn: {
          say: [
            'برڈی وہی بولتا ہے جو ہم اسے کہیں۔',
            'اسے بلوانے کے لیے ہم ایک <strong>حکم</strong> لکھتے ہیں: `say`',
            '`say` کا مطلب ہے: <strong>بولو!</strong>'
          ],
          example: 'say("Salaam")',
          parts: [
            { t: 'say', l: 'حکم: بولو' },
            { t: '(', l: 'بریکٹ' },
            { t: '"Salaam"', l: 'برڈی کے الفاظ' },
            { t: ')', l: 'بریکٹ بند' }
          ]
        },
        guess: {
          q: 'اگر ہم لکھیں `say("Hello")` تو برڈی کیا بولے گا؟',
          code: 'say("Hello")',
          options: ['Hello', 'say', 'Salaam'],
          correct: 0,
          why: 'برڈی صرف `" "` کے اندر والے الفاظ بولتا ہے۔ `say` تو حکم ہے، وہ نہیں بولا جاتا۔'
        },
        task: {
          intro: 'اب برڈی سے <strong>اپنا نام</strong> بلوائیں۔',
          steps: [
            'تختی پر لفظ `Salaam` مٹائیں۔',
            'اس کی جگہ اپنا نام انگریزی میں لکھیں، جیسے `Ali`۔',
            '«چلاؤ» دبائیں۔'
          ],
          starter: 'say("Salaam")',
          hints: [
            'صرف دونوں `"` کے بیچ والا لفظ بدلنا ہے۔ نشان نہ مٹائیں۔',
            'ایسے لکھیں: `say("Ali")`، مگر `Ali` کی جگہ اپنا نام۔'
          ],
          solution: 'say("Ali")',
          solutionNote: '`" "` کے اندر `Salaam` کی جگہ نام لکھا گیا ہے۔',
          check: function (out, code) {
            if (!out.length) return silent(code);
            if (out.some(function (o) { return text(o) && !/^salaam!?$/i.test(text(o)); })) return { pass: true };
            if (out.some(function (o) { return /^salaam!?$/i.test(text(o)); })) return { mood: 'nudge', msg: 'برڈی نے ابھی بھی Salaam کہا۔ `" "` کے اندر اپنا نام لکھیں۔' };
            return { mood: 'nudge', msg: '`" "` کے اندر کچھ نہیں لکھا۔ وہاں اپنا نام لکھیں۔' };
          }
        },
        tests: [
          { code: 'say("Fatima Khan")', pass: true, note: 'two-word name' },
          { code: "say('Ali')", pass: true, note: 'single quotes' },
          { code: 'console.log("Ali")', pass: true, note: 'console.log instead of say' },
          { code: 'say("Salaam")\nsay("Ali")', pass: true, note: 'kept Salaam and added a line' },
          { code: 'say("Salaam")', pass: false, note: 'did not change the word', has: 'Salaam' },
          { code: 'say("")', pass: false, note: 'deleted the word', has: 'کچھ نہیں' },
          { code: 'Say("Ali")', pass: false, note: 'capital S', has: 'بڑے اور چھوٹے' },
          { code: 'sai("Ali")', pass: false, note: 'typo in say', has: '`say`' },
          { code: 'say("Ali)', pass: false, note: 'missing end quote', has: '`"`' },
          { code: 'say["Ali"]', pass: false, note: 'square brackets', has: 'گول بریکٹ' }
        ],
        recap: '`say` برڈی کو بولنے کا حکم ہے۔ جو `" "` کے اندر ہو، برڈی وہی بولتا ہے۔'
      },

      {
        id: '1.2', short: 'پوری لائن', title: 'اپنی پہلی پوری لائن',
        noTemplateKey: true,
        learn: {
          say: [
            'ہر لائن کے <strong>چار حصے</strong> ہوتے ہیں۔',
            'ایک بھی حصہ رہ جائے تو برڈی بول نہیں پاتا۔',
            'الفاظ کے <strong>دونوں طرف</strong> `"` ضرور لگائیں۔'
          ],
          example: 'say("Good morning")',
          parts: [
            { t: 'say', l: '1۔ حکم' },
            { t: '(', l: '2۔ بریکٹ' },
            { t: '"Good morning"', l: '3۔ الفاظ، دونوں طرف "' },
            { t: ')', l: '4۔ بریکٹ بند' }
          ]
        },
        guess: {
          q: 'اس لائن میں کیا کمی ہے؟',
          code: 'say(Salaam)',
          showsError: true,
          options: ['`" "` نہیں ہیں', 'بریکٹ نہیں ہیں', 'کوئی کمی نہیں'],
          correct: 0,
          why: 'صحیح! `" "` کے بغیر کمپیوٹر نہیں سمجھتا کہ یہ برڈی کے الفاظ ہیں۔'
        },
        task: {
          intro: 'تختی خالی ہے۔ اب <strong>خود</strong> پوری لائن لکھیں تاکہ برڈی `Good morning` بولے۔',
          steps: [
            '`say` لکھیں۔',
            'نیچے کی کنجیوں سے `(` اور `"` لگائیں۔',
            '`Good morning` لکھیں۔',
            'آخر میں `"` اور `)` لگا کر «چلاؤ» دبائیں۔'
          ],
          starter: '',
          hints: [
            'اوپر سیکھے ہوئے چار حصے یاد کریں: حکم، بریکٹ، الفاظ، بریکٹ بند۔',
            'پوری لائن ایسے ہوگی: `say("Good morning")`'
          ],
          solution: 'say("Good morning")',
          solutionNote: 'چاروں حصے: `say` پھر `(` پھر `"Good morning"` پھر `)`۔',
          check: function (out, code) {
            if (out.some(function (o) { return /good\s*morning/i.test(String(o.value)); })) return { pass: true };
            if (out.length) return { mood: 'nudge', msg: 'برڈی بولا، مگر Good morning نہیں۔ `" "` کے اندر `Good morning` لکھیں۔' };
            return silent(code);
          }
        },
        tests: [
          { code: 'say("Good Morning!")', pass: true, note: 'capital M and !' },
          { code: 'console.log("Good morning")', pass: true, note: 'console.log' },
          { code: 'say("Good night")', pass: false, note: 'other words', has: 'Good morning' },
          { code: 'say "Good morning"', pass: false, note: 'no brackets', has: '`(`' },
          { code: 'say("Good morning"', pass: false, note: 'missing )', has: '`)`' },
          { code: 'say(Good morning")', pass: false, note: 'missing first quote', has: '`"`' },
          { code: '"Good morning"', pass: false, note: 'no say', has: '`say`' },
          { code: 'SAY("Good morning")', pass: false, note: 'capitals', has: 'بڑے اور چھوٹے' }
        ],
        recap: 'پوری لائن = `say` + `(` + `"..."` + `)`۔ آپ نے اپنی پہلی لائن خود لکھی!'
      },

      {
        id: '1.3', short: 'اوپر سے نیچے', title: 'پہلے کون بولے گا؟',
        learn: {
          say: [
            'جب کئی لائنیں ہوں تو کمپیوٹر <strong>اوپر والی</strong> لائن پہلے پڑھتا ہے۔',
            'پھر دوسری، پھر تیسری۔ بالکل ایسے جیسے ہم کتاب پڑھتے ہیں: اوپر سے نیچے۔'
          ],
          example: 'say("Salaam")\nsay("I am Birdy")\nsay("Khuda Hafiz")',
          flow: true
        },
        guess: {
          q: 'برڈی <strong>سب سے پہلے</strong> کیا بولے گا؟',
          code: 'say("One")\nsay("Two")\nsay("Three")',
          options: ['One', 'Three', 'تینوں ایک ساتھ'],
          correct: 0,
          why: 'کمپیوٹر اوپر سے شروع کرتا ہے، اس لیے پہلے `One`، پھر `Two`، پھر `Three`۔'
        },
        task: {
          parsons: {
            lines: ['say("I am 3 years old")', 'say("Khuda Hafiz!")', 'say("Assalam o Alaikum")', 'say("My name is Birdy")'],
            order: [2, 3, 0, 1],
            intro: 'لائنیں الٹی پلٹی ہو گئی ہیں! انہیں صحیح ترتیب میں لگائیں۔',
            steps: [
              '▲ ▼ والے بٹن سے لائنیں اوپر نیچے کریں۔',
              'سب سے اوپر سلام، پھر نام، پھر عمر، اور سب سے نیچے خدا حافظ۔',
              '«چلاؤ» دبائیں۔'
            ],
            cursorBefore: 'say("Khuda',
            hints: ['ملتے وقت ہم سب سے پہلے کیا کہتے ہیں؟ اور جاتے وقت سب سے آخر میں؟', 'ترتیب: `Assalam o Alaikum`، پھر `My name is Birdy`، پھر `I am 3 years old`، اور آخر میں `Khuda Hafiz!`'],
            wrong: 'برڈی نے اسی ترتیب میں بولا جس میں آپ نے لائنیں لگائیں۔ کیا سلام سب سے اوپر ہے؟',
            done: 'زبردست ترتیب! اب ایک آخری کام۔'
          },
          intro: 'اب برڈی سے آپ کو <strong>آپ کے نام</strong> سے سلام کروائیں۔',
          steps: [
            '`Khuda Hafiz` والی لائن سے پہلے ایک نئی لائن بنائیں۔',
            'لکھیں: `say("Salaam, Ali!")`، مگر `Ali` کی جگہ اپنا نام۔',
            '«چلاؤ» دبائیں۔'
          ],
          hints: [
            'ملتے وقت پہلے سلام کرتے ہیں، جاتے وقت خدا حافظ۔ نئی لائن ان کے بیچ میں ہو۔',
            'نئی لائن `say("Khuda Hafiz!")` سے بالکل اوپر لکھیں: `say("Salaam, Ali!")`'
          ],
          solution: 'say("Assalam o Alaikum")\nsay("My name is Birdy")\nsay("I am 3 years old")\nsay("Salaam, Ali!")\nsay("Khuda Hafiz!")',
          solutionNote: 'پہلے سلام، آخر میں خدا حافظ، اور نئی لائن ان کے بیچ میں۔',
          check: function (out) {
            if (!out.length || !/assalam/i.test(text(out[0]))) return { msg: 'برڈی کو سب سے پہلے سلام کرنا ہے۔ `Assalam o Alaikum` والی لائن سب سے اوپر رکھیں۔' };
            if (!/khuda hafiz/i.test(text(out[out.length - 1]))) return { msg: 'برڈی خدا حافظ کے بعد بھی بول رہا ہے! نئی لائن کو خدا حافظ سے اوپر لے جائیں۔' };
            if (out.length < 5) return { mood: 'nudge', msg: 'ترتیب ٹھیک ہے! اب `Khuda Hafiz` سے پہلے نئی لائن لکھیں۔' };
            return { pass: true };
          }
        },
        tests: [
          { code: 'say("Assalam o Alaikum")\nsay("My name is Birdy")\nsay("I am 3 years old")\nsay("Salaam, Sara!")\nsay("Khuda Hafiz!")', pass: true, note: 'another name' },
          { code: 'say("Assalam o Alaikum")\nsay("My name is Birdy")\nsay("I am 3 years old")\nsay("Salaam, " + "Sara!")\nsay("Khuda Hafiz!")', pass: true, note: 'joined with +' },
          { code: 'say("Assalam o Alaikum")\nsay("My name is Birdy")\nsay("I am 3 years old")\nconsole.log("Salaam, Sara!")\nsay("Khuda Hafiz!")', pass: true, note: 'console.log line' },
          { code: 'say("Assalam o Alaikum")\nsay("My name is Birdy")\nsay("I am 3 years old")\nsay("Khuda Hafiz!")\nsay("Salaam, Sara!")', pass: false, note: 'new line after Khuda Hafiz', has: 'خدا حافظ' },
          { code: 'say("Salaam, Sara!")\nsay("Assalam o Alaikum")\nsay("My name is Birdy")\nsay("I am 3 years old")\nsay("Khuda Hafiz!")', pass: false, note: 'new line at the very top', has: 'Assalam o Alaikum' },
          { code: 'say("Assalam o Alaikum")\nsay("My name is Birdy")\nsay("I am 3 years old")\n\nsay("Khuda Hafiz!")', pass: false, note: 'only an empty line', has: 'نئی لائن' },
          { code: 'say("Assalam o Alaikum")\nsay("My name is Birdy")\nsay("I am 3 years old")\nsay("Salaam, Sara!)\nsay("Khuda Hafiz!")', pass: false, note: 'missing quote, line 4', has: '`"`' }
        ],
        recap: 'کمپیوٹر لائنیں <strong>اوپر سے نیچے</strong>، ایک ایک کر کے پڑھتا ہے۔ ترتیب بدلیں تو بات بدل جاتی ہے۔'
      },

      {
        id: '1.4', short: 'نمبر', title: 'برڈی حساب کرتا ہے',
        learn: {
          say: [
            'برڈی حساب بھی کر سکتا ہے!',
            'نمبر <strong>بغیر</strong> `" "` کے لکھیں تو `+` انہیں جمع کرتا ہے۔ `say(2 + 3)` سے برڈی 5 بولتا ہے۔',
            'نمبر `" "` کے <strong>اندر</strong> ہوں تو وہ الفاظ بن جاتے ہیں، اور `+` انہیں بس ساتھ جوڑ دیتا ہے۔ `say("2" + "3")` سے برڈی 23 بولتا ہے۔'
          ],
          example: 'say(2 + 3)\nsay("2" + "3")',
          flow: true
        },
        guess: {
          q: '`say(10 + 5)` لکھیں تو برڈی کیا بولے گا؟',
          code: 'say(10 + 5)',
          options: ['15', '105', '10 + 5'],
          correct: 0,
          why: 'نمبر `" "` کے بغیر ہیں، اس لیے کمپیوٹر نے جمع کیا: 10 اور 5 مل کر 15۔'
        },
        task: {
          intro: 'برڈی سے <strong>125 اور 378 کا جوڑ</strong> بلوائیں۔ جواب خود نہ نکالیں، کمپیوٹر نکالے گا!',
          steps: [
            '`say(` لکھیں۔',
            'پھر `125 + 378` لکھیں، <strong>بغیر</strong> `" "` کے۔',
            '`)` لگا کر «چلاؤ» دبائیں۔'
          ],
          starter: '',
          hints: [
            'نمبر جمع کروانے ہیں، تو `" "` نہیں لگانے۔',
            'پوری لائن ایسے ہوگی: `say(125 + 378)`'
          ],
          solution: 'say(125 + 378)',
          solutionNote: 'نمبر `" "` کے بغیر ہیں، اس لیے کمپیوٹر انہیں جمع کرتا ہے۔',
          check: function (out, code, r, T) {
            // The computer did the sum only if 125, 378 and + are in the code itself, not inside quotes or a comment.
            var bare = T.bare(code), computed = /\b125\b/.test(bare) && /\b378\b/.test(bare) && /\+/.test(bare);
            var hit = out.some(function (o) { return o.vtype === 'number' ? o.value === 503 : /(^|\D)503(\D|$)/.test(String(o.value)); });
            if (hit && computed) return { pass: true };
            if (hit) return { mood: 'nudge', msg: 'جواب تو ٹھیک ہے، مگر حساب آپ نے کیا! `125 + 378` لکھیں تاکہ کمپیوٹر حساب کرے۔' };
            if (out.some(function (o) { return String(o.value) === '125378'; }))
              return { msg: 'برڈی نے نمبر ساتھ جوڑ دیے، جمع نہیں کیے! `" "` ہٹا دیں۔' };
            if (out.some(function (o) { return /125\s*\+\s*378/.test(String(o.value)); }))
              return { msg: 'برڈی نے `125 + 378` ویسے ہی بول دیا، کیونکہ وہ `" "` کے اندر تھا۔ `" "` ہٹا دیں تاکہ کمپیوٹر جمع کرے۔' };
            return { msg: 'ابھی برڈی نے 125 اور 378 کا جوڑ نہیں بولا۔ `say(125 + 378)` جیسی لائن لکھیں۔' };
          }
        },
        tests: [
          { code: 'say(125+378)', pass: true, note: 'no spaces' },
          { code: 'console.log(125 + 378)', pass: true, note: 'console.log' },
          { code: 'say(378 + 125)', pass: true, note: 'other order' },
          { code: 'say("The answer is " + (125 + 378))', pass: true, note: 'sentence with the sum' },
          { code: 'say(125 + 378) // 503', pass: true, note: '503 only in a comment' },
          { code: 'say("125" + "378")', pass: false, note: 'numbers in quotes', has: 'جوڑ دیے' },
          { code: 'say(503)', pass: false, note: 'worked it out alone', has: 'حساب آپ نے کیا' },
          { code: 'say("125 + 378")', pass: false, note: 'whole sum in quotes', has: 'ویسے ہی' },
          { code: 'say(125 - 378)', pass: false, note: 'minus', has: 'جوڑ نہیں' },
          { code: 'say(125 + 378', pass: false, note: 'missing )', has: '`)`' }
        ],
        recap: 'بغیر `" "` کے نمبر <strong>جمع</strong> ہوتے ہیں۔ `" "` کے اندر وہ الفاظ بن جاتے ہیں۔' +
          '<br><strong>ایک راز:</strong> بڑے پروگرامر `say` کی جگہ `console.log` لکھتے ہیں۔ کبھی آزما کر دیکھیں!'
      },

      {
        id: '1.5', short: 'نظم', title: 'برڈی کی نظم', make: true,
        learn: {
          say: [
            'آپ نے بہت کچھ سیکھ لیا! اب سب ملا کر ایک <strong>نظم</strong> بنائیں۔',
            '`+` سے دو ٹکڑے جوڑ کر ایک جملہ بنتا ہے۔ پہلے ٹکڑے کے آخر میں ایک خالی جگہ چھوڑیں تاکہ الفاظ چپکیں نہیں۔'
          ],
          example: 'say("Green " + "parrot")',
          parts: [
            { t: 'say', l: 'حکم' },
            { t: '"Green "', l: 'پہلا ٹکڑا' },
            { t: '+', l: 'جوڑو' },
            { t: '"parrot"', l: 'دوسرا ٹکڑا' }
          ]
        },
        task: {
          intro: 'اپنی نظم لکھیں! پہلی لائن ہم نے لکھ دی ہے۔',
          steps: [
            'کم از کم <strong>4 لائنیں</strong> لکھیں، ہر لائن `say` سے شروع ہو۔',
            'کسی ایک لائن میں `+` سے دو ٹکڑے جوڑیں۔',
            '«چلاؤ» دبائیں اور برڈی سے اپنی نظم سنیں!'
          ],
          starter: 'say("Green green parrot")\n',
          hints: [
            'نظم کسی بھی چیز پر ہو سکتی ہے: آم، بارش، اسکول یا برڈی۔ انگریزی میں لکھیں۔',
            'جوڑنے کی مثال: `say("Red " + "beak")`'
          ],
          solution: 'say("Green green parrot")\nsay("Red red beak")\nsay("Birdy " + "sings a song")\nsay("Salaam to everyone!")',
          solutionNote: 'چار لائنیں، اور تیسری لائن میں `+` سے دو ٹکڑے جوڑے گئے ہیں۔',
          check: function (out, code) {
            if (!out.length) return silent(code);
            if (out.length === 1) return { mood: 'nudge', msg: 'برڈی نے ابھی 1 لائن بولی۔ کم از کم 4 لائنیں چاہئیں، ہر لائن `say` سے شروع ہو۔' };
            if (out.length < 4) return { mood: 'nudge', msg: 'برڈی نے ' + out.length + ' لائنیں بولیں۔ کم از کم 4 چاہئیں۔' };
            var joins = code.split('\n').some(function (l) { return /(say|console\.log)\s*\(/.test(l) && /["'][^"']*["']\s*\+|\+\s*["']/.test(l); });
            if (!joins) return { mood: 'nudge', msg: 'بہت پیاری نظم! اب کسی ایک لائن میں `+` سے دو ٹکڑے جوڑیں، جیسے `say("Red " + "beak")`۔' };
            return { pass: true };
          }
        },
        tests: [
          { code: 'say("Rain rain")\nconsole.log("Rain " + "falls")\nsay("On the roof")\nsay("Hooray!")', pass: true, note: 'console.log join' },
          { code: "say('Mango tree')\nsay('Mango ' + 'tree')\nsay('Big')\nsay('Sweet')", pass: true, note: 'single quotes' },
          { code: 'say("Green green parrot")\nsay("Red")\nsay("Beak")\nsay("Birdy "+"sings"+"!")', pass: true, note: 'three pieces, no spaces round +' },
          { code: 'say("Green green parrot")\nsay("Red red beak")\nsay("Birdy sings")\nsay("Bye")', pass: false, note: 'no + join', has: '`+`' },
          { code: 'say("Green green parrot")\nsay("A + B")\nsay("x")\nsay("y")', pass: false, note: '+ inside the quotes', has: '`+`' },
          { code: 'say("Green green parrot")\nsay("Red " + "beak")', pass: false, note: 'only 2 lines', has: '4' },
          { code: 'say("Green green parrot")\n', pass: false, note: 'starter only', has: '1 لائن' },
          { code: 'say("Green green parrot")\nsay("Mango " + tree)\nsay("x")\nsay("y")', pass: false, note: 'second piece without quotes' }
        ],
        recap: 'آپ نے `say`، `" "`، ترتیب، نمبر اور `+`، سب استعمال کر لیا۔ برڈی اب آپ کی بات سنتا ہے!'
      }
    ]
  };
  // What Mithu says out loud: very short, very simple English, read slowly by the device's own voice.
  var VOICE = {
    '1.1': {
      learn: 'Birdy says what we tell him. To make Birdy talk, we write the word: say. Say means: speak!',
      guess: 'Look at this code. What will Birdy say? Choose one answer.',
      why: 'Birdy only says the words inside the quotes. The word say is the command. Birdy does not say it.',
      task: 'Now it is your turn. Make Birdy say your name. One. Delete the word Salaam. Two. Type your name in English. Three. Press the green Run button.',
      hints: ['Only change the word between the two quote marks. Do not delete the marks.',
              'Type it like this. Say. Bracket. Quote. Your name. Quote. Bracket.'],
      solution: 'Your name goes inside the quotes, in place of Salaam.',
      recap: 'Well done! Today you learned: say tells Birdy to speak. Birdy says the words inside the quotes.'
    },
    '1.2': {
      learn: 'Every line has four parts. The command: say. An open bracket. The words, inside quotes. And a close bracket. If one part is missing, Birdy cannot speak.',
      guess: 'Look at this line. What is missing? Choose one answer.',
      why: 'Yes! The quotes are missing. Without quotes, the computer does not know these are Birdy\'s words.',
      task: 'Your turn. The slate is empty. Write the whole line yourself, so Birdy says: Good morning. Type say. Add a bracket and a quote. Type Good morning. Add a quote and a bracket. Then press Run.',
      hints: ['Remember the four parts. Command. Bracket. Words in quotes. Close bracket.',
              'The whole line is: say. Bracket. Quote. Good morning. Quote. Bracket.'],
      solution: 'All four parts. Say. Open bracket. Good morning, in quotes. Close bracket.',
      recap: 'Well done! A full line is: say, brackets, and words inside quotes. You wrote your first line!'
    },
    '1.3': {
      hintsA: ['What do we say first when we meet? And last, when we leave?', 'The order is: Assalam o Alaikum. My name is Birdy. I am 3 years old. Khuda Hafiz.'],
      learn: 'When there are many lines, the computer reads the top line first. Then the next line. Then the next. Top to bottom. Just like reading a book.',
      guess: 'Look at these three lines. What will Birdy say first?',
      why: 'The computer starts at the top. So first: One. Then: Two. Then: Three.',
      taskA: 'Oh no! The lines are mixed up. Put them in the right order. Use the up and down buttons. The greeting goes at the top. Khuda Hafiz goes at the bottom. Then press Run.',
      task: 'Great order! Now make Birdy greet you by name. Make a new line above Khuda Hafiz. Type: say, Salaam, and your name. Then press Run.',
      hints: ['We say hello first, and goodbye last. Put the new line in the middle.',
              'Write the new line just above Khuda Hafiz. For example: say, Salaam, Ali.'],
      solution: 'Greeting first. Khuda Hafiz last. Your new line goes in between.',
      recap: 'Well done! The computer reads lines from top to bottom, one by one. Change the order, and the message changes.'
    },
    '1.4': {
      learn: 'Birdy can do maths! Numbers without quotes get added. Two plus three, and Birdy says five. But numbers inside quotes become words. Then plus just sticks them together. So Birdy says twenty three.',
      guess: 'What will Birdy say for ten plus five? Choose one answer.',
      why: 'The numbers have no quotes. So the computer adds them. Ten and five make fifteen.',
      task: 'Your turn. Make Birdy add 125 and 378. Do not work it out yourself. The computer will do it! Type say, and a bracket. Type 125 plus 378, with no quotes. Close the bracket. Then press Run.',
      hints: ['You want to add numbers. So do not use quotes.',
              'The whole line is: say. Bracket. 125 plus 378. Bracket.'],
      solution: 'The numbers have no quotes, so the computer adds them.',
      recap: 'Well done! Numbers without quotes get added. Numbers inside quotes become words.'
    },
    '1.5': {
      learn: 'You learned so much! Now let\'s make a poem. Plus can join two pieces into one sentence. Leave a space at the end of the first piece, so the words do not stick together.',
      task: 'Write your own poem! We wrote the first line for you. Write at least four lines. Each line starts with say. In one line, join two pieces with plus. Then press Run, and listen to Birdy!',
      hints: ['Your poem can be about anything. Mangoes. Rain. School. Or Birdy! Write in English.',
              'To join, write: say. Bracket. Quote. Red, and a space. Quote. Plus. Quote. Beak. Quote. Bracket.'],
      solution: 'Four lines. The third line joins two pieces with plus.',
      recap: 'Amazing! You used say, quotes, order, numbers, and plus. Birdy listens to you now!'
    }
  };
  M.levels.forEach(function (L) { L.voice = VOICE[L.id]; });
  (window.MODULES = window.MODULES || []).push(M);
})();
