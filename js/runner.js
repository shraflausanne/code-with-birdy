// Runs a child's code in a Web Worker, so an endless loop can be stopped.
// Runner.run(code, opts) -> Promise<{events, error, uses, session}>
//   opts: { answers, randoms, boxes, actions, live, ms }
//   live: when the program waits for clicks, keys or forever(), keep it running and return a session to talk to it.
// Runner.test(code, opts) -> Promise<summary>: an invisible scripted run, used by the checks.
(function () {
  var E = MithuEngineFactory({}); // helpers only (summarize, kit); programs run in the worker
  var WORKER =
    'var E=(' + MithuEngineFactory.toString() + ')(self);' +
    'var ctl=null,buf=[],timer=null;' +
    'function flush(err){var b=buf;buf=[];self.postMessage({t:"batch",events:b,error:err||null});}' +
    'function safe(f){try{f();flush(null);}catch(e){if(timer)clearInterval(timer);flush(E.toErr(e));}}' +
    'self.onmessage=function(m){var d=m.data;' +
      'if(d.cmd==="script"){var r=E.runScripted(d.code,d.opts);self.postMessage({t:"result",events:r.events,error:r.error,uses:r.uses});return;}' +
      'if(d.cmd==="live"){var err=null;buf=[];' +
        'try{ctl=E.start(d.code,d.opts,function(e){if(buf.length>=E.LIMIT)throw E.MErr("toomuch");buf.push(e);});}catch(e){err=E.toErr(e);}' +
        'var live=!err&&!!ctl&&ctl.live(),b=buf;buf=[];' +
        'self.postMessage({t:"result",events:b,error:err,uses:ctl?ctl.uses():null,live:live});' +
        'if(live&&ctl.uses().forever)timer=setInterval(function(){safe(function(){ctl.tick();});},50);return;}' +
      'if(d.cmd==="click")safe(function(){buf.push({t:"click",x:d.x,y:d.y});ctl.click(d.x,d.y);});' +
      'if(d.cmd==="key")safe(function(){buf.push({t:"key",key:d.key});ctl.key(d.key);});' +
    '};';

  var url = null;
  try { url = URL.createObjectURL(new Blob([WORKER], { type: 'text/javascript' })); } catch (e) {}

  function timeoutErr(ms) { return { name: 'Timeout', message: 'Stopped after ' + ms + ' ms', line: null }; }

  // A running program that waits for clicks, keys or forever() frames.
  function session(post, kill, uses) {
    // early: what arrived before anyone listened (the page subscribes after playing the first run), replayed to the first listener
    var subs = [], early = [], dead = false, beat = Date.now(), waiting = false;
    function deliver(events, error) {
      if (!subs.length) early.push([events, error]);
      else subs.forEach(function (h) { h(events, error); });
    }
    var dog = setInterval(function () {
      if ((uses.forever || waiting) && Date.now() - beat > (uses.forever ? 4000 : 2000)) fail(timeoutErr(2000));
    }, 400);
    function stop() { if (dead) return; dead = true; clearInterval(dog); kill(); }
    function fail(err) { if (dead) return; stop(); deliver([], err); }
    function receive(events, error) {
      if (dead) return;
      beat = Date.now(); waiting = false;
      deliver(events, error);
      if (error) stop();
    }
    return {
      uses: uses,
      receive: receive,
      onBatch: function (h) { subs.push(h); early.splice(0).forEach(function (b) { h(b[0], b[1]); }); },
      click: function (x, y) { if (dead) return; waiting = true; beat = Date.now(); post({ cmd: 'click', x: x, y: y }); },
      key: function (k) { if (dead) return; waiting = true; beat = Date.now(); post({ cmd: 'key', key: k }); },
      stop: stop,
      alive: function () { return !dead; }
    };
  }

  // Without workers (very old browsers): run on the page. No protection from endless loops.
  var E0 = null;
  function inline(code, opts) {
    E0 = E0 || MithuEngineFactory(window);
    if (!opts.live) return E0.runScripted(code, opts);
    var buf = [], err = null, ctl = null, timer = null;
    try { ctl = E0.start(code, opts, function (e) { buf.push(e); }); } catch (e) { err = E0.toErr(e); }
    var res = { events: buf, error: err, uses: ctl ? ctl.uses() : null };
    if (err || !ctl || !ctl.live()) return res;
    buf = [];
    var s = session(function (m) {
      setTimeout(function () {
        try { if (m.cmd === 'click') ctl.click(m.x, m.y); else if (m.cmd === 'key') ctl.key(m.key); s.receive(buf.splice(0), null); }
        catch (e) { s.receive(buf.splice(0), E0.toErr(e)); }
      });
    }, function () { clearInterval(timer); }, res.uses);
    if (res.uses.forever) timer = setInterval(function () {
      try { ctl.tick(); s.receive(buf.splice(0), null); } catch (e) { s.receive(buf.splice(0), E0.toErr(e)); }
    }, 50);
    res.session = s;
    return res;
  }

  function run(code, opts) {
    opts = opts || {};
    var ms = opts.ms || 3000;
    var o = { answers: opts.answers || [], randoms: opts.randoms || [], boxes: !!opts.boxes, actions: opts.actions || [] };
    return new Promise(function (resolve) {
      var w;
      try { w = new Worker(url); } catch (e) { return resolve(inline(code, Object.assign({ live: opts.live }, o))); }
      var timer = setTimeout(function () { w.terminate(); resolve({ events: [], error: timeoutErr(ms), uses: null }); }, ms);
      w.onmessage = function (e) {
        var d = e.data;
        if (d.t !== 'result') return;
        clearTimeout(timer);
        if (!d.live) { w.terminate(); resolve({ events: d.events, error: d.error, uses: d.uses }); return; }
        var s = session(function (m) { w.postMessage(m); }, function () { w.terminate(); }, d.uses);
        w.onmessage = function (ev) { if (ev.data.t === 'batch') s.receive(ev.data.events, ev.data.error); };
        resolve({ events: d.events, error: null, uses: d.uses, session: s });
      };
      w.onerror = function (ev) {
        ev.preventDefault(); clearTimeout(timer); w.terminate();
        resolve({ events: [], error: { name: 'Error', message: ev.message || 'Error', line: null }, uses: null });
      };
      w.postMessage({ cmd: opts.live ? 'live' : 'script', code: code, opts: o });
    });
  }

  window.Runner = {
    E: E,
    run: run,
    test: function (code, opts) { return run(code, opts).then(function (res) { return E.summarize(res); }); }
  };
})();
