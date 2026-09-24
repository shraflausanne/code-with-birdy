// غلطی ڈاکٹر: turns code problems into friendly Urdu. Backticks mark code (rendered left to right).
// lint(code) finds problems before running; explain(err, code) explains an error from running.
// Both return {line, msg, raw} (line is 1-based or null) or null.
(function (root) {
  var E = (root.Runner && root.Runner.E) || root.MithuEngineFactory({});
  var API = Object.keys(E.COMMANDS).concat(['console.log', 'console']);
  var KEYWORDS = ['if', 'else', 'for', 'while', 'function', 'return', 'let', 'const', 'var', 'true', 'false', 'switch', 'catch', 'typeof', 'new', 'do'];
  var STARTERS = ['function', 'let', 'for', 'if', 'else', 'return', 'while'];
  var BUILTINS = ['String', 'Number', 'parseInt', 'parseFloat', 'isNaN', 'Math', 'Boolean', 'Array'];
  var INPUTS = {
    circle: '`x`، `y`، سائز، رنگ', rect: '`x`، `y`، چوڑائی، اونچائی، رنگ', triangle: '`x`، `y`، چوڑائی، اونچائی، رنگ',
    star: '`x`، `y`، سائز، رنگ', kite: '`x`، `y`، رنگ', text: 'الفاظ، `x`، `y`، اور چاہیں تو رنگ', background: 'رنگ', random: 'سب سے چھوٹا نمبر، سب سے بڑا نمبر',
    moveKite: 'دائیں بائیں کتنا، اوپر نیچے کتنا', onKey: 'بٹن کا نام، ترکیب', onClick: 'ترکیب', forever: 'ترکیب', mango: '`x`، `y`', basket: '`x`، `y`',
    near: 'دو نمبر', ask: 'سوال', askNumber: 'سوال', jump: '', randomColor: ''
  };
  var WHAT = { x: '`x`', y: '`y`', size: 'سائز', width: 'چوڑائی', height: 'اونچائی', dx: 'پہلی چیز (دائیں بائیں)', dy: 'دوسری چیز (اوپر نیچے)', min: 'پہلی چیز', max: 'دوسری چیز', a: 'پہلی چیز', b: 'دوسری چیز' };
  var FN_EXAMPLE = { onClick: 'onClick(whenClicked)', onKey: 'onKey("ArrowRight", goRight)', forever: 'forever(play)' };

  var MSG = {
    quote: 'الفاظ شروع تو ہوئے مگر ختم نہیں! الفاظ کے آخر میں بھی `"` لگائیں۔',
    apostrophe: 'الفاظ کے اندر `\'` آ گیا ہے، اس لیے کمپیوٹر سمجھا کہ الفاظ وہیں ختم ہو گئے۔ الفاظ کے دونوں طرف `"` لگائیں، جیسے `say("Let\'s go")`۔',
    open: 'ایک `(` کھلا ہے مگر بند نہیں ہوا۔ ہر `(` کے لیے ایک `)` چاہیے۔',
    close: 'یہاں ایک `)` زیادہ ہے۔ ہر `)` سے پہلے ایک `(` ہونا چاہیے۔',
    braceOpen: 'ایک `{` کھلا رہ گیا ہے۔ ہر `{` کا ایک `}` ہونا چاہیے۔',
    braceClose: 'یہاں ایک `}` زیادہ ہے۔ ہر `}` سے پہلے ایک `{` ہونا چاہیے۔',
    mixed: 'بریکٹ الٹ پلٹ ہو گئے ہیں۔ جو بریکٹ بعد میں کھلا، وہ پہلے بند ہونا چاہیے۔',
    urdu: 'کوڈ میں اردو والا نشان (`،` `؛` یا `۔`) آ گیا ہے۔ کوڈ میں انگریزی والے نشان استعمال کریں، نیچے کی کنجیوں سے۔',
    urduWord: 'کوڈ میں اردو حروف آ گئے ہیں۔ کوڈ ہمیشہ انگریزی حروف میں لکھیں۔ الفاظ ہوں تو انہیں `" "` کے اندر رکھیں۔',
    words: 'الفاظ کو `" "` کے اندر لکھیں، جیسے `say("Good morning")`۔ `" "` کے بغیر کمپیوٹر الفاظ کو نہیں سمجھتا۔',
    joiner: 'اس لائن میں دو چیزوں کے بیچ کچھ رہ گیا ہے۔ دو ٹکڑے جوڑنے ہوں تو بیچ میں `+` لگائیں، جیسے `"Red " + "beak"`۔ حکم کی چیزوں کے بیچ `,` لگائیں، جیسے `circle(100, 100, 20, "red")`۔',
    assignIf: 'شرط میں صرف ایک `=` ہے۔ ایک `=` ڈبے میں چیز رکھتا ہے۔ پوچھنے کے لیے تین `===` لکھیں۔',
    flipped: 'یہ نشان الٹا لکھا گیا ہے۔ `<=` اور `>=` میں `=` بعد میں آتا ہے۔',
    forCommas: '`for` کے تینوں حصوں کے بیچ `;` لگتا ہے، `,` نہیں: `for (let i = 0; i < 5; i++)`',
    timeout: 'برڈی چکر میں پھنس گیا اور گھومتا ہی رہا! دیکھیں کہ چکر کی شرط کبھی ختم ہوتی ہے یا نہیں۔',
    toomuch: 'برڈی کو بہت زیادہ کام مل گیا اور وہ رکا ہی نہیں! دیکھیں کہ کوئی چکر ہمیشہ تو نہیں چل رہا۔ یا چکر بہت بڑا ہے: نمبر چھوٹا کریں۔',
    recursion: 'ترکیب خود کو بار بار بلا رہی ہے اور رکتی ہی نہیں! ترکیب کے اندر اسی ترکیب کا نام نہ لکھیں۔',
    syntax: 'کمپیوٹر یہ لائن نہیں سمجھ پایا۔ ہجے، بریکٹ اور `"` غور سے دیکھیں، یا اشارہ لیں۔',
    blank: 'اس لائن میں خالی جگہ `___` ابھی بھری نہیں۔ `___` مٹا کر اس کی جگہ صحیح چیز لکھیں۔',
    elseAlone: 'یہاں `else` غلط جگہ پر ہے۔ `else` ہمیشہ `if` کے `}` کے فوراً بعد آتا ہے: `} else {`۔ اور سادہ `else` ہمیشہ سب سے آخر میں آتا ہے۔',
    semicolon: '`)` کے بعد `;` نہ لگائیں۔ `{` فوراً بعد آتا ہے، جیسے `if (a === 1) {`۔',
    elseCond: 'سادہ `else` کے ساتھ شرط نہیں لگتی۔ شرط چاہیے تو `else if (...)` لکھیں، ورنہ صرف `} else {`۔',
    condBrackets: 'شرط ہمیشہ گول بریکٹ میں لکھیں، جیسے `if (guess > secret) {`۔',
    elseIf: '`else` اور `if` الگ الگ لکھیں، بیچ میں خالی جگہ کے ساتھ: `} else if (...) {`۔',
    comment: 'اپنے لیے نوٹ لکھنا ہو تو اس سے پہلے دو ترچھی لکیریں `//` لگائیں، جیسے `// roof`۔',
    maths: 'کمپیوٹر میں ضرب کے لیے `*` اور تقسیم کے لیے `/` لکھتے ہیں، جیسے `i * 45` یا `mangoes / friends`۔',
    fnCall: 'ترکیب استعمال کرنی ہو تو `function` نہ لکھیں، صرف نام اور بریکٹ: ',
    fnBrackets: 'ترکیب کے نام کے بعد `()` لگائیں، جیسے `function drawTree() {`۔',
    fnNumber: 'ترکیب بناتے وقت بریکٹ میں ڈبے کا نام لکھیں، جیسے `function drawTree(x)`۔ نمبر بلاتے وقت لکھیں: `drawTree(100)`۔',
    generic: 'کوئی گڑبڑ ہوئی ہے۔ اس لائن کو غور سے دیکھیں، یا اشارہ لیں۔'
  };

  function lev(a, b) {
    var d = [], i, j;
    for (i = 0; i <= a.length; i++) d[i] = [i];
    for (j = 0; j <= b.length; j++) d[0][j] = j;
    for (i = 1; i <= a.length; i++)
      for (j = 1; j <= b.length; j++) {
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1); // swapped letters
      }
    return d[a.length][b.length];
  }
  function scan(line) { var s = E.scanLine(line); return { bare: s.bare.slice(0, s.cut), openQuote: s.openQuote }; }
  // The line with every piece of text in quotes replaced by S (to see what surrounds text).
  function marked(line) {
    return line.slice(0, E.scanLine(line).cut).replace(/"(?:[^"\\]|\\.)*"?|'(?:[^'\\]|\\.)*'?/g, 'S');
  }
  function noun(n) { return n === 1 ? '1 چیز چاہیے' : n + ' چیزیں چاہئیں'; }

  // Names the child made: functions, boxes and function inputs.
  function ownNames(code) {
    var names = [], re = /\b(?:function\s+([A-Za-z_$][\w$]*)|(?:let|const|var)\s+([A-Za-z_$][\w$]*))/g, m;
    var bare = code.split('\n').map(function (l) { return scan(l).bare; }).join('\n');
    while ((m = re.exec(bare))) names.push(m[1] || m[2]);
    var p = /function\s*[A-Za-z_$]*\s*\(([^)]*)\)/g;
    while ((m = p.exec(bare))) m[1].split(',').forEach(function (n) { n = n.trim(); if (n) names.push(n); });
    return names;
  }
  // A close name the child probably meant: same letters in other case first, then a small spelling slip.
  function closest(name, pool) {
    var i, best = null, bestD = name.length > 4 ? 3 : 2;
    for (i = 0; i < pool.length; i++) if (pool[i] !== name && pool[i].toLowerCase() === name.toLowerCase()) return { word: pool[i], caps: true };
    for (i = 0; i < pool.length; i++) {
      var d = lev(name.toLowerCase(), pool[i].toLowerCase());
      if (pool[i] !== name && d < bestD) { bestD = d; best = pool[i]; }
    }
    return best ? { word: best, caps: false } : null;
  }
  function capsMsg(name, right) { return 'کمپیوٹر بڑے اور چھوٹے حروف میں فرق کرتا ہے۔ `' + name + '` کی جگہ `' + right + '` لکھیں۔'; }
  function unknown(name, code) {
    if (/^(else_?if|elsif|elif|elseif)$/i.test(name)) return MSG.elseIf;
    var own = code ? ownNames(code) : [];
    var c = closest(name, API.concat(own).concat(KEYWORDS));
    if (c && c.caps) return capsMsg(name, c.word);
    if (c) return 'کمپیوٹر `' + name + '` نام کا کوئی حکم نہیں جانتا۔ کیا ہجے ٹھیک ہیں؟ کیا آپ کا مطلب `' + c.word + '` تھا؟';
    return 'کمپیوٹر `' + name + '` نام کا کوئی حکم نہیں جانتا۔ ٹول باکس میں «حکم» دیکھیں۔';
  }

  // Two things side by side inside ( ) with nothing between them: `circle(350 50, …)`, `say("Hi " name)`.
  function missingJoiner(line) {
    var mk = marked(line), re = /\(([^()]*)\)/g, m;
    while ((m = re.exec(mk))) {
      var inner = m[1], g = /([\w$]+|S|\))\s+([\w$]+|S|\()/g, x;
      while ((x = g.exec(inner))) if (!/^(let|var|const|typeof|new|return|in|of|else)$/.test(x[1])) return true;
    }
    return false;
  }

  // First line whose code the computer cannot read (for syntax errors without a line number).
  // Each piece is tested with its open brackets closed, so an unfinished `{` block does not count as an error.
  function syntaxLine(code) {
    var lines = code.split('\n'), stack = [];
    for (var n = 1; n <= lines.length; n++) {
      var bare = scan(lines[n - 1]).bare;
      for (var i = 0; i < bare.length; i++) {
        var c = bare[i];
        if (c === '(' || c === '{' || c === '[') stack.push(c);
        else if (c === ')' || c === '}' || c === ']') stack.pop();
      }
      var close = stack.slice().reverse().map(function (o) { return { '(': ')', '{': '}', '[': ']' }[o]; }).join('');
      try { new Function('"use strict";' + lines.slice(0, n).join('\n') + '\n' + close); }
      catch (e) {
        if (/end of input|Unexpected EOF|end of script|Unterminated|unterminated/i.test(e.message)) continue;
        return n;
      }
    }
    return null;
  }
  function lineMatching(code, re, which) {
    var lines = code.split('\n'), hits = [];
    for (var i = 0; i < lines.length; i++) if (re.test(scan(lines[i]).bare)) hits.push(i + 1);
    return which === 'last' ? hits[hits.length - 1] || null : which === 'second' ? hits[1] || hits[0] || null : hits[0] || null;
  }
  function wordLine(code, w) { return lineMatching(code, new RegExp('(^|[^\\w$.])' + w.replace(/\$/g, '\\$') + '\\b')); }
  function lineText(code, ln) { return ln ? code.split('\n')[ln - 1] || '' : ''; }
  function count(code, w) { return (code.split('\n').map(function (l) { return scan(l).bare; }).join('\n').match(new RegExp('(^|[^\\w$.])' + w + '(?![\\w$])', 'g')) || []).length; }
  // Names made with let/const/var or function (not the inputs of a function).
  function madeNames(code) {
    var names = [], re = /\b(?:function\s+([A-Za-z_$][\w$]*)|(?:let|const|var)\s+([A-Za-z_$][\w$]*))/g, m;
    var bare = code.split('\n').map(function (l) { return scan(l).bare; }).join('\n');
    while ((m = re.exec(bare))) names.push(m[1] || m[2]);
    return names;
  }
  // The recipe whose { } holds line ln: {name, inputs} or null.
  function enclosingFn(code, ln) {
    var lines = code.split('\n'), stack = [];
    for (var n = 0; n < ln && n < lines.length; n++) {
      var bare = scan(lines[n]).bare, h = /\bfunction\s*([A-Za-z_$][\w$]*)?\s*\(([^)]*)\)/.exec(bare);
      for (var i = 0; i < bare.length; i++) {
        if (bare[i] === '{') stack.push(h && i > h.index ? { name: h[1] || '', inputs: h[2].trim() } : null);
        else if (bare[i] === '}') stack.pop();
      }
    }
    for (var k = stack.length - 1; k >= 0; k--) if (stack[k]) return stack[k];
    return null;
  }
  // `fr uit` or `my city`: two words that are one of the child's names with a space inside.
  function spacedName(bare, own) {
    var re = /([A-Za-z_$][\w$]*)[ \t]+([A-Za-z_$][\w$]*)/g, m;
    while ((m = re.exec(bare))) {
      var j = (m[1] + m[2]).toLowerCase();
      for (var i = 0; i < own.length; i++) if (own[i].toLowerCase() === j) return { two: m[1] + ' ' + m[2], one: own[i] };
      re.lastIndex = m.index + m[1].length;
    }
    return null;
  }
  function spaceMsg(two, one) { return 'نام ایک ہی لفظ ہوتا ہے، بیچ میں خالی جگہ نہیں۔ `' + two + '` کی جگہ `' + one + '` لکھیں۔'; }

  root.Doctor = {
    lint: function (code) {
      var lines = code.split('\n'), stack = [], own = null;
      for (var n = 0; n < lines.length; n++) {
        var s = scan(lines[n]), bare = s.bare, m, ln = n + 1;
        if (/[،؛۔]/.test(bare)) return { line: ln, msg: MSG.urdu };
        if (/[؀-ۿ]/.test(bare)) return { line: ln, msg: MSG.urduWord };
        if (s.openQuote === "'" && /[A-Za-z]'[A-Za-z]/.test(lines[n])) return { line: ln, msg: MSG.apostrophe };
        if (s.openQuote === '"' || s.openQuote === "'") return { line: ln, msg: MSG.quote };
        if (/(^|[^\w$])_{2,}(?![\w$])/.test(bare)) return { line: ln, msg: MSG.blank };
        if ((m = /(^|[^\w$.])(Let|For|If|Else|Function|While|Return|Const)\b/.exec(bare))) return { line: ln, msg: capsMsg(m[2], m[2].toLowerCase()) };
        // a misspelt word at the start of a line: fucntion drawTree(), lett x = 1
        if ((m = /^\s*([A-Za-z]{3,})\s+[A-Za-z_$]/.exec(bare)) && KEYWORDS.indexOf(m[1]) < 0 && API.indexOf(m[1]) < 0) {
          for (var k = 0; k < STARTERS.length; k++) {
            if (lev(m[1].toLowerCase(), STARTERS[k]) <= (STARTERS[k].length >= 5 ? 2 : 1))
              return { line: ln, msg: 'کیا ہجے ٹھیک ہیں؟ `' + m[1] + '` کی جگہ `' + STARTERS[k] + '` لکھیں۔' };
          }
        }
        // names with a space: let my city = ..., function draw Tree()
        if ((m = /^\s*(let|const|var|function)\s+([A-Za-z_$][\w$]*)\s+([A-Za-z_$][\w$]*)\s*[=(]/.exec(bare)))
          return { line: ln, msg: spaceMsg(m[2] + ' ' + m[3], m[2] + m[3][0].toUpperCase() + m[3].slice(1)) };
        // recipes: function drawTree { · function drawTree(100) { · function drawTree() used to call it
        if (/^\s*function\s+[A-Za-z_$][\w$]*\s*\{/.test(bare)) return { line: ln, msg: MSG.fnBrackets };
        if (/^\s*function\s+[A-Za-z_$][\w$]*\s*\((?:[^)]*,)?\s*[-\d]/.test(bare)) return { line: ln, msg: MSG.fnNumber };
        if ((m = /^\s*function\s+([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*$/.exec(bare))) {
          var nx = n + 1;
          while (nx < lines.length && !scan(lines[nx]).bare.trim()) nx++;
          if (nx >= lines.length || !/^\s*\{/.test(scan(lines[nx]).bare)) return { line: ln, msg: MSG.fnCall + '`' + m[1] + '()`۔' };
        }
        // a note with one slash, a backslash or #: `/ roof`, `rect(...) / wall`
        if (/^\s*(\/|\\+|#+)\s*[A-Za-z]/.test(bare) || (/^\s*[A-Za-z]+\s*\(.*\)\s*(\/|\\|#)\s*[A-Za-z][A-Za-z ]*$/.test(bare) && !/^\s*[\w$]+\s*=[^=]/.test(bare)))
          return { line: ln, msg: MSG.comment };
        if (/\b(for|if|while)\s*\((?:[^()]|\([^()]*\))*\)\s*;/.test(bare) && !/\}\s*while\b/.test(bare)) return { line: ln, msg: MSG.semicolon };
        var raw = lines[n].replace(/\/\/.*$/, '');
        if ((m = /(^|[^\w$.])(say|console\.log|circle|rect|triangle|star|kite|background|text)\s*["'\d]/.exec(raw)) && !new RegExp('\\b' + m[2].replace('.', '\\.') + '\\s*\\(').test(bare))
          return { line: ln, msg: 'حکم کے بعد `(` لگانا ضروری ہے، جیسے `' + m[2] + '(...)`۔' };
        if (/\bfor\s*\(\s*let\s+[\w$]+\s*=[^;)]*,/.test(bare)) return { line: ln, msg: MSG.forCommas };
        if (/\b(if|while|for)\s*\(.*(=<|=>)/.test(bare)) return { line: ln, msg: MSG.flipped };
        if (/\b(if|while)\s*\((?:[^()]|\([^()]*\))*?[^=!<>]=(?!=)/.test(bare)) return { line: ln, msg: MSG.assignIf };
        own = own || ownNames(code);
        var sp = spacedName(bare, own);
        if (sp) return { line: ln, msg: spaceMsg(sp.two, sp.one) };
        if (/\b(say|console\.log)\s*\(\s*[A-Za-z_$][\w$]*\s+[A-Za-z_$]/.test(bare)) return { line: ln, msg: MSG.words };
        // brackets across the whole program
        for (var i = 0; i < bare.length; i++) {
          var c = bare[i];
          if (c === '(' || c === '{' || c === '[') stack.push({ c: c, line: ln });
          else if (c === ')' || c === '}' || c === ']') {
            var top = stack.pop();
            if (!top) return { line: ln, msg: c === '}' ? MSG.braceClose : c === ')' ? MSG.close : MSG.generic };
            if ({ '(': ')', '{': '}', '[': ']' }[top.c] !== c) {
              if (top.c === '(' && c === '}') return { line: top.line, msg: MSG.open };
              if (top.c === '{' && c === ')') return { line: ln, msg: MSG.close };
              return { line: ln, msg: MSG.mixed };
            }
          }
        }
        if (/[×✕✖÷]/.test(bare) || /[\w)]\s+x\s+[\d(]/.test(bare) || /[\w)]\s*\\\s*[\w(]/.test(bare)) return { line: ln, msg: MSG.maths };
        if (missingJoiner(lines[n])) return { line: ln, msg: MSG.joiner };
        // commands the computer does not know
        var re = /(\.?)\s*\b([A-Za-z_$][\w$]*)\s*\(/g;
        while ((m = re.exec(bare))) {
          var name = m[2];
          if (m[1] === '.') {
            if (/console\s*\.\s*$/.test(bare.slice(0, m.index + 1)) && name !== 'log') return { line: ln, msg: unknown('console.' + name, code) };
            continue;
          }
          if (API.indexOf(name) >= 0 || KEYWORDS.indexOf(name) >= 0 || BUILTINS.indexOf(name) >= 0) continue;
          if (/\bfunction\s*$/.test(bare.slice(0, m.index))) continue; // defining it: function drawTree(
          own = own || ownNames(code);
          if (own.indexOf(name) >= 0) continue;
          return { line: ln, msg: unknown(name, code) };
        }
      }
      if (stack.length) {
        var t = stack[stack.length - 1];
        return { line: t.line, msg: t.c === '{' ? MSG.braceOpen : t.c === '(' ? MSG.open : MSG.generic };
      }
      return null;
    },

    explain: function (err, code) {
      var raw = err.name + ': ' + err.message, msg = err.message || '', line = err.line || null, m;
      if (err.name === 'Timeout') return { line: null, msg: MSG.timeout, raw: raw };
      if (err.name === 'MithuError') {
        var d = err.data || {};
        if (err.code === 'toomuch') return { line: line, msg: MSG.toomuch, raw: raw };
        if (err.code === 'cmdvalue') {
          var cv = d.cmd || '';
          if (!E.COMMANDS.hasOwnProperty(cv))
            return { line: line, msg: (cv ? '`' + cv + '` ایک ترکیب ہے، ڈبہ نہیں۔ ترکیب چلانے کے لیے بریکٹ لگائیں: `' + cv + '()`۔' : 'یہاں ایک ترکیب لکھی ہے، ڈبہ نہیں۔ ترکیب چلانے کے لیے اس کے نام کے بعد بریکٹ لگائیں۔'), raw: raw };
          if (cv === 'randomColor') return { line: line, msg: '`randomColor` کے بعد `()` لگائیں: `randomColor()`، تبھی وہ رنگ چنتا ہے۔', raw: raw };
          return { line: line, raw: raw, msg: '`' + cv + '` ایک حکم ہے، ڈبہ نہیں۔ حکم چلانے کے لیے بریکٹ لگائیں، جیسے `' + cv + (E.COMMANDS[cv] ? '(...)' : '()') + '`۔' +
            (/^(random|ask|askNumber|near)$/.test(cv) ? '' : ' کیا آپ کسی ڈبے کا نام لکھنا چاہتے تھے؟ ہجے دیکھیں۔') };
        }
        if (err.code === 'args') {
          var inputs = INPUTS[d.cmd], many = d.max > d.need ? d.need + ' یا ' + d.max + ' چیزیں چاہئیں' : noun(d.need);
          var body = d.need === 0 && !d.max ? '`' + d.cmd + '()` کو کوئی چیز نہیں چاہیے، بریکٹ خالی رکھیں۔'
            : '`' + d.cmd + '` کو ' + many + (inputs ? ': ' + inputs : '') + '۔ آپ نے ' + d.got + ' دیں۔' + (d.need > 1 ? ' ہر چیز کے بیچ میں `,` لگائیں۔' : '');
          return { line: line, msg: body, raw: raw };
        }
        if (err.code === 'color') {
          return {
            line: line, raw: raw,
            msg: d.notText ? 'رنگ کا نام `" "` کے اندر انگریزی میں لکھیں، جیسے `"red"`۔'
              : 'کمپیوٹر `"' + d.value + '"` نام کا رنگ نہیں جانتا۔ انگریزی نام لکھیں، جیسے `"red"`، `"blue"` یا `"green"`، اور `" "` کے اندر۔'
          };
        }
        if (err.code === 'num') {
          if (d.value === 'NaN' || d.value === 'undefined')
            return { line: line, msg: '`' + d.cmd + '` کو ' + (WHAT[d.what] || d.what) + ' کے لیے نمبر نہیں ملا۔ کیا ترکیب بلاتے وقت بریکٹ میں نمبر لکھنا رہ گیا، جیسے `drawTree(100)`؟ یا کسی ڈبے میں نمبر نہیں؟', raw: raw };
          return {
            line: line, raw: raw,
            msg: '`' + d.cmd + '` میں ' + (WHAT[d.what] || d.what) + ' کی جگہ نمبر چاہیے، مگر وہاں `' + d.value + '` ہے۔' +
              (/^"\s*-?[\d.]+\s*"$/.test(d.value) ? ' نمبر کے گرد `" "` نہیں لگتے۔'
                : INPUTS[d.cmd] && /^"/.test(d.value) ? ' کیا چیزوں کی ترتیب بدل گئی؟ ترتیب یہ ہے: ' + INPUTS[d.cmd] + '۔' : '')
          };
        }
        if (err.code === 'key') return { line: line, msg: 'بٹن کا نام `"' + d.value + '"` ٹھیک نہیں۔ ان میں سے لکھیں: `"ArrowLeft"`، `"ArrowRight"`، `"ArrowUp"`، `"ArrowDown"`۔', raw: raw };
        if (err.code === 'fn') return { line: line, msg: '`' + d.cmd + '` کو ترکیب کا نام چاہیے، بغیر `()` کے۔ جیسے `' + (FN_EXAMPLE[d.cmd] || d.cmd + '(play)') + '`۔', raw: raw };
      }
      if ((m = /Cannot access '([\w$]+)' before initialization|can't access lexical declaration '?([\w$]+)'? before initialization/.exec(msg)) || /Cannot access uninitialized variable/.test(msg)) {
        var w = m ? m[1] || m[2] : null, bl = line || (w && wordLine(code, w));
        if (w && count(code, 'let\\s+' + w) >= 2)
          return { line: lineMatching(code, new RegExp('\\blet\\s+' + w + '\\b'), 'second'), msg: 'ڈبہ `' + w + '` اوپر پہلے ہی بن چکا ہے۔ `{ }` کے اندر دوبارہ `let` نہ لکھیں، صرف `' + w + ' = ...` لکھیں۔', raw: raw };
        if (w && bl && new RegExp('\\blet\\s+' + w + '\\s*=.*\\b' + w + '\\b').test(scan(lineText(code, bl)).bare))
          return { line: bl, msg: 'ڈبہ `' + w + '` ابھی بن رہا ہے، اس لیے اسی لائن میں اسے استعمال نہیں کر سکتے۔ پہلی بار ڈبے میں شروع والا نمبر رکھیں، جیسے `let ' + w + ' = 0`۔', raw: raw };
        return {
          line: bl,
          msg: w ? 'ڈبہ `' + w + '` بننے سے پہلے استعمال ہو گیا۔ `let ' + w + '` والی لائن اوپر لے جائیں، اس لائن سے پہلے۔'
            : 'ایک ڈبہ بننے سے پہلے استعمال ہو گیا۔ `let` والی لائن اوپر لے جائیں۔',
          raw: raw
        };
      }
      if ((m = /Identifier '([\w$]+)' has already been declared|Cannot declare a (?:let|const) variable twice: '([\w$]+)'|redeclaration of (?:let |const )?([\w$]+)/.exec(msg))) {
        var v = m[1] || m[2] || m[3];
        return {
          line: lineMatching(code, new RegExp('\\blet\\s+' + v + '\\b'), 'second'),
          msg: 'ڈبہ `' + v + '` پہلے ہی بن چکا ہے۔ ڈبہ ایک ہی بار بنتا ہے۔ دوبارہ `let` نہ لکھیں، صرف `' + v + ' = ...` لکھیں۔',
          raw: raw
        };
      }
      m = /^(?:Can't find variable: |)([A-Za-z_$][\w$]*)(?: is not defined|)$/.exec(msg);
      if (err.name === 'ReferenceError' && m) {
        var name = m[1], ln = line || wordLine(code, name), text = scan(lineText(code, ln)).bare;
        if (/^_+$/.test(name)) return { line: line || lineMatching(code, /(^|[^\w$])_{2,}(?![\w$])/), msg: MSG.blank, raw: raw };
        var own = ownNames(code);
        var called = ln && new RegExp('\\b' + name + '\\s*[.(]').test(text);
        var near = closest(name, own.concat(API)), made = madeNames(code);
        if (near && near.caps) {
          // only the name where it was made has other letters: change that one place
          var decl = own.indexOf(near.word) >= 0 && count(code, name) > count(code, near.word) &&
            lineMatching(code, new RegExp('\\b(?:let|const|var|function)\\s+' + near.word + '(?![\\w$])|\\bfunction\\s*[\\w$]*\\s*\\([^)]*\\b' + near.word + '(?![\\w$])'));
          if (decl) return { line: decl, msg: capsMsg(near.word, name), raw: raw };
          return { line: ln, msg: capsMsg(name, near.word), raw: raw };
        }
        if (called && new RegExp('\\bfunction\\s+' + name + '\\b').test(code))
          return { line: ln, msg: 'ترکیب `' + name + '` کسی دوسری ترکیب کے `{ }` کے اندر بنی ہے، اس لیے یہاں نہیں ملتی۔ اسے باہر نکالیں۔', raw: raw };
        if (called) return { line: ln, msg: unknown(name, code), raw: raw };
        if (new RegExp('\\b(onKey|onClick|forever)\\s*\\([^)]*\\b' + name + '\\b').test(text))
          return { line: ln, msg: 'ترکیب `' + name + '` ابھی بنی نہیں۔ پہلے اسے بنائیں: `function ' + name + '() { ... }`۔', raw: raw };
        if (near && near.word.length > 2 && own.indexOf(near.word) >= 0)
          return { line: ln, msg: 'کمپیوٹر کو `' + name + '` نہیں ملا۔ کیا آپ کا مطلب `' + near.word + '` تھا؟ ہجے غور سے دیکھیں۔', raw: raw };
        if (own.indexOf(name) >= 0 && made.indexOf(name) < 0) {
          var fm = new RegExp('\\bfunction\\s+([A-Za-z_$][\\w$]*)\\s*\\([^)]*\\b' + name + '\\b').exec(code), fname = fm ? fm[1] : 'drawTree';
          return { line: ln, msg: '`' + name + '` صرف ترکیب کے اندر کام کرتا ہے۔ ترکیب بلاتے وقت بریکٹ میں نمبر لکھیں، جیسے `' + fname + '(100)`۔', raw: raw };
        }
        var inFn = ln && enclosingFn(code, ln);
        if (inFn && inFn.name && !inFn.inputs)
          return { line: ln, msg: 'ترکیب `' + inFn.name + '` کو `' + name + '` نہیں ملا۔ ترکیب کے نام کے بعد بریکٹ میں `' + name + '` لکھیں: `function ' + inFn.name + '(' + name + ')`، تاکہ بلاتے وقت دیا گیا نمبر اس میں آ جائے۔', raw: raw };
        if (own.indexOf(name) >= 0) {
          var inLoop = new RegExp('\\bfor\\s*\\(\\s*let\\s+' + name + '\\b').test(code);
          return {
            line: ln, raw: raw,
            msg: inLoop ? '`' + name + '` صرف اپنے چکر کے `{ }` کے اندر کام کرتا ہے۔ یہ لائن چکر کے `{ }` کے اندر لے جائیں۔'
              : 'ڈبہ `' + name + '` صرف اپنے `{ }` کے اندر کام کرتا ہے، جہاں وہ بنا تھا۔ اسے `{ }` سے باہر، سب سے اوپر بنائیں۔'
          };
        }
        if (new RegExp('[(,]\\s*' + name + '\\s*=[^=]').test(text) && !/\bfor\s*\(/.test(text))
          return { line: ln, msg: 'حکم کی چیزوں میں `' + name + '=` نہ لکھیں، صرف نمبر لکھیں، جیسے `circle(350, 50, 20, "red")`۔', raw: raw };
        if (new RegExp('\\bfor\\s*\\(\\s*' + name + '\\s*=').test(text))
          return { line: ln, msg: 'چکر کا ڈبہ پہلی بار بنتا ہے، اس لیے `' + name + '` سے پہلے `let` لکھیں: `for (let ' + name + ' = 0; ...)`', raw: raw };
        if (new RegExp('^\\s*' + name + '\\s*=[^=]').test(text))
          return { line: ln, msg: 'ڈبہ `' + name + '` ابھی بنا ہی نہیں۔ پہلی بار ڈبہ بناتے وقت `let` لکھیں: `let ' + name + ' = ...`', raw: raw };
        if (!/\b(let|const|var)\b/.test(code) && name.length > 1)
          return { line: ln, msg: 'کمپیوٹر `' + name + '` کو نہیں پہچانتا۔ اگر یہ برڈی کے الفاظ ہیں تو انہیں `" "` کے اندر لکھیں: `"' + name + '"`', raw: raw };
        return { line: ln, msg: 'کمپیوٹر کو `' + name + '` نام کا کوئی ڈبہ نہیں ملا۔ اگر یہ الفاظ ہیں تو انہیں `" "` کے اندر لکھیں۔ اگر ڈبہ ہے تو ہجے دیکھیں، یا پہلے `let ' + name + ' = ...` سے بنائیں۔', raw: raw };
      }
      if (err.name === 'TypeError' && (m = /([\w$.]+) is not a function/.exec(msg))) {
        return { line: line, msg: '`' + m[1] + '` کوئی حکم یا ترکیب نہیں، اس لیے اس کے بعد `()` نہیں لگ سکتا۔ ہجے دیکھیں۔', raw: raw };
      }
      if (err.name === 'RangeError' && /call stack/i.test(msg)) return { line: line, msg: MSG.recursion, raw: raw };
      if (err.name === 'SyntaxError') {
        var sl = line || syntaxLine(code), t = lineText(code, sl);
        var tb = scan(t).bare;
        if (sl && /\belse\s*\(/.test(tb)) return { line: sl, msg: MSG.elseCond, raw: raw };
        if (sl && (/\belse\s+if\s*\{/.test(tb) || /\bif\s+[^(\s]/.test(tb))) return { line: sl, msg: MSG.condBrackets, raw: raw };
        if (/\belse\b/.test(msg) || (sl && /\belse\b/.test(scan(t).bare) && /Unexpected/.test(msg))) return { line: sl || lineMatching(code, /\belse\b/), msg: MSG.elseAlone, raw: raw };
        if (sl && /\b(say|console\.log)\s*\(\s*[A-Za-z_$][\w$]*\s+[A-Za-z_$]/.test(scan(t).bare)) return { line: sl, msg: MSG.words, raw: raw };
        if (sl && missingJoiner(t)) return { line: sl, msg: MSG.joiner, raw: raw };
        return { line: sl, msg: MSG.syntax, raw: raw };
      }
      return { line: line, msg: MSG.generic, raw: raw };
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
