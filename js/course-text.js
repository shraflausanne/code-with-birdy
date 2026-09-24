// Course-wide text: first-visit welcome and greetings. Backticks mark code (shown left to right).
// The *En lines are what Birdy says out loud (recorded by tools/make-voice.py).
window.COURSE = {
  welcome: [
    'السلام علیکم! میں برڈی ہوں، ایک ہرا طوطا۔',
    'میں وہی بولتا ہوں جو آپ مجھے کہیں۔ کمپیوٹر بھی ایسا ہی ہے!',
    'آئیں، مل کر کمپیوٹر کی زبان JavaScript سیکھیں۔'
  ],
  welcomeEn: 'Hello! I am Birdy, a green parrot. I say what you tell me. A computer is just like me! Let us learn the computer language together.',

  askName: 'آپ کا نام کیا ہے؟',
  askNameHelp: 'انگریزی حروف میں لکھیں، جیسے Ali یا Sara۔',
  askNameEn: 'What is your name? Please type it in English letters.',

  metEn: 'Nice to meet you! First, let me show you what code can do.',
  backEn: 'Welcome back! Let us continue.',

  // Opening lesson "0": what JavaScript is, what children can build with it, and their goal.
  intro: {
    title: 'کوڈ کیا ہے؟',
    say: [
      'JavaScript کمپیوٹر کی ایک زبان ہے۔',
      'اس زبان میں ہم کمپیوٹر کو حکم دیتے ہیں، اور کمپیوٹر وہی کرتا ہے۔',
      'تقریباً ہر ویب سائٹ، اور بہت سی ایپس اور کھیل، JavaScript سے بنتے ہیں۔ یوٹیوب بھی!'
    ],
    sayEn: 'JavaScript is a language for computers. With it, we give the computer orders, and the computer does them. Almost every website, and many apps and games, are made with JavaScript. Even YouTube!',
    showTitle: 'دیکھیں، آپ کیا کیا بنا سکتے ہیں!',
    showHelp: 'کسی کارڈ کو دبائیں، برڈی چلا کر دکھائے گا۔',
    showEn: 'Look what you can make! Tap a card, and I will show you.',
    promise: 'اس کورس کے آخر تک آپ یہ چاروں خود بنا لیں گے!',
    goalTitle: 'آپ سب سے پہلے کیا بنانا چاہتے ہیں؟',
    goalEn: 'What do you want to make first? Choose one.',
    setEn: 'Great choice! Let us start.'
  },

  // Goals: each is a "make" level. mods = modules needed to get there; won = the sentence when it is reached (Urdu gender per noun).
  goals: [
    { id: 'story', icon: '📖', name: 'کہانی', blurb: 'برڈی آپ کی کہانی سناتا ہے', level: '2.5', mods: 2, won: 'آپ نے اپنی کہانی خود بنا لی!' },
    { id: 'drawing', icon: '🎨', name: 'تصویر', blurb: 'کوڈ سے رنگین تصویر', level: '3.5', mods: 3, won: 'آپ نے اپنی تصویر خود بنا لی!' },
    { id: 'fortune', icon: '🔮', name: 'نجومی طوطا', blurb: 'برڈی آپ کی قسمت بتاتا ہے', level: '5.5', mods: 5, won: 'آپ نے اپنا نجومی طوطا خود بنا لیا!' },
    { id: 'game', icon: '🎮', name: 'کھیل', blurb: 'ٹوکری سے آم پکڑنے کا کھیل', level: '6.5', mods: 6, won: 'آپ نے اپنا کھیل خود بنا لیا!' }
  ],

  // What each module adds to the child's projects (shown at the end of a module, on the way to the goal).
  skills: {
    1: 'اب آپ کمپیوٹر سے بات کروا سکتے ہیں۔',
    2: 'اب آپ کا پروگرام چیزیں یاد رکھ سکتا ہے، جیسے نام اور اسکور۔',
    3: 'اب آپ کا پروگرام رنگ اور شکلیں بنا سکتا ہے۔',
    4: 'اب آپ کا پروگرام ایک کام بار بار کر سکتا ہے۔',
    5: 'اب آپ کا پروگرام فیصلے کر سکتا ہے۔',
    6: 'اب آپ کا پروگرام بٹن دبانے پر چل سکتا ہے۔'
  }
};
