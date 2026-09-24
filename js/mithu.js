// Mithu, a rose-ringed parakeet drawn in SVG. Moods are CSS classes on the wrapper:
// data-mood = idle | happy | sad | think | wave, plus the .talking class while he speaks.
(function () {
  function star(x, y, r, fill) {
    var p = [];
    for (var i = 0; i < 10; i++) {
      var a = Math.PI / 5 * i - Math.PI / 2, rr = i % 2 ? r * 0.45 : r;
      p.push((x + rr * Math.cos(a)).toFixed(1) + ' ' + (y + rr * Math.sin(a)).toFixed(1));
    }
    return '<path d="M' + p.join(' L') + ' Z" fill="' + fill + '"/>';
  }

  var SVG =
    '<svg class="mithu-svg" viewBox="0 0 200 240" aria-hidden="true" focusable="false">' +
    '<g class="m-bird">' +
      '<g class="m-tail">' +
        '<path d="M128 166 C150 196 166 222 180 240 C168 238 148 214 116 178 Z" fill="#1E7F46"/>' +
        '<path d="M118 172 C136 202 148 226 156 240 C146 238 132 216 108 182 Z" fill="#2E9A57"/>' +
        '<path d="M172 229 C176 234 179 237 180 240 C173 239 168 235 164 231 Z" fill="#3E8FD6"/>' +
      '</g>' +
      '<g class="m-feet">' +
        '<ellipse cx="94" cy="199" rx="9" ry="5" fill="#E7A29F"/>' +
        '<ellipse cx="117" cy="199" rx="9" ry="5" fill="#E7A29F"/>' +
      '</g>' +
      '<g class="m-body">' +
        '<ellipse cx="108" cy="140" rx="46" ry="58" fill="#4DBF62"/>' +
        '<ellipse cx="96" cy="154" rx="27" ry="38" fill="#8EDB7E"/>' +
      '</g>' +
      '<g class="m-wing">' +
        '<path d="M110 98 C152 102 162 160 140 188 C122 178 104 150 110 98 Z" fill="#2FA04C"/>' +
        '<path d="M124 126 C136 140 140 160 136 178" stroke="#23823C" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<path d="M116 118 C127 136 129 156 125 172" stroke="#23823C" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '</g>' +
      '<g class="m-head">' +
        '<path d="M82 44 Q86 24 96 36 Q102 22 108 42 Z" fill="#5ACB6B"/>' +
        '<circle cx="94" cy="78" r="40" fill="#5ACB6B"/>' +
        '<path d="M60 100 Q96 128 132 98" stroke="#1C1C1C" stroke-width="5" fill="none" stroke-linecap="round"/>' +
        '<path d="M64 107 Q96 135 130 105" stroke="#F58FB3" stroke-width="4" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="104" cy="92" rx="9" ry="5" fill="#FF97AA" opacity=".7"/>' +
        '<g class="m-eye">' +
          '<circle cx="84" cy="68" r="12.5" fill="#fff" stroke="#F3A23A" stroke-width="2.5"/>' +
          '<g class="m-pupil"><circle cx="80" cy="69" r="7.2" fill="#1B1B1B"/><circle cx="77.5" cy="65.8" r="2.5" fill="#fff"/></g>' +
        '</g>' +
        '<path class="m-happy-eye" d="M72 72 Q84 58 96 72" stroke="#1B1B1B" stroke-width="4.5" fill="none" stroke-linecap="round"/>' +
        '<path class="m-brow" d="M71 50 Q82 50 97 58" stroke="#1B1B1B" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
        '<g class="m-beak">' +
          '<path class="m-jaw" d="M64 92 C54 92 47 98 50 104 C56 107 64 102 68 96 Z" fill="#B3312B"/>' +
          '<path d="M66 64 C46 60 35 80 40 100 C46 92 54 88 66 92 C71 84 71 72 66 64 Z" fill="#E2463D"/>' +
          '<path d="M55 70 C49 73 46 79 45 86" stroke="#F47B6F" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
        '</g>' +
      '</g>' +
    '</g>' +
    '<g class="m-fx">' +
      '<g class="m-spark">' + star(34, 42, 11, '#FFD84D') + star(170, 70, 8, '#FFD84D') + star(26, 150, 7, '#FF97AA') + star(176, 146, 9, '#8EDB7E') + '</g>' +
      '<text class="m-q" x="150" y="52">?</text>' +
      '<g class="m-dots"><circle cx="136" cy="44" r="4"/><circle cx="151" cy="36" r="5"/><circle cx="168" cy="26" r="6.5"/></g>' +
    '</g>' +
    '</svg>';

  // Mount a Mithu inside el. Returns a small controller.
  window.Mithu = function (el) {
    el.classList.add('mithu');
    el.innerHTML = SVG;
    el.dataset.mood = 'idle';
    var timer;
    return {
      mood: function (m, ms) {
        clearTimeout(timer);
        el.dataset.mood = 'idle';
        void el.offsetWidth; // restart CSS animations when the same mood repeats
        el.dataset.mood = m;
        if (ms) timer = setTimeout(function () { el.dataset.mood = 'idle'; }, ms);
      },
      talk: function (on) { el.classList.toggle('talking', !!on); }
    };
  };
})();
