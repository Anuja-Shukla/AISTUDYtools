/* AIgametools games, part 2: Quiz Race, Tambola, Business Tycoon, Crossword and Word Search.
   Same contract as aigt-games.js: GAMES.<id>.create(root, api) returns { destroy() }.
   api: coins, over, busy, questions, spend/gain/lose(n, why), ask(kind, o), record(qi, ok), won(), toast(t), sfx(type).
   AIGT_KIT holds helpers that the whole-class modes in aigt-app.js also use. */
(function () {
'use strict';
const GAMES = window.AIGT_GAMES = window.AIGT_GAMES || {};
const sleep = ms => new Promise(r => setTimeout(r, ms));
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------------- shared kit ---------------- */
const KIT = window.AIGT_KIT = {};
KIT.esc = esc; KIT.shuffle = shuffle;
/* distinct correct answers: [{ text, qis: [question indices] }] */
KIT.pool = qs => {
  const m = new Map();
  qs.forEach((q, i) => { const a = String(q.options[q.answer]).trim(), k = a.toLowerCase(); if (!m.has(k)) m.set(k, { text: a, qis: [] }); m.get(k).qis.push(i); });
  return [...m.values()];
};
KIT.ticketSize = n => n >= 15 ? 15 : n >= 9 ? 9 : 0;
KIT.ticket = n => shuffle([...Array(n).keys()]).slice(0, KIT.ticketSize(n)); /* pool indices, row by row (3 rows) */
KIT.PRIZES = [
  { id: 'early', name: 'Early Five', coins: 20, test: (t, m) => t.filter(c => m.has(c)).length >= 5 },
  { id: 'top', name: 'Top line', coins: 25, test: (t, m) => KIT.row(t, 0).every(c => m.has(c)) },
  { id: 'middle', name: 'Middle line', coins: 25, test: (t, m) => KIT.row(t, 1).every(c => m.has(c)) },
  { id: 'bottom', name: 'Bottom line', coins: 25, test: (t, m) => KIT.row(t, 2).every(c => m.has(c)) },
  { id: 'full', name: 'Full House', coins: 60, test: (t, m) => t.every(c => m.has(c)) }
];
KIT.row = (t, r) => { const w = t.length / 3; return t.slice(r * w, r * w + w); };
KIT.short = (s, n) => { s = String(s); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
KIT.cellCls = t => String(t).split(/\s+/).some(w => w.length > 10) ? ' lg' : '';
/* one-word (or two-word) answers usable in crossword and word search */
KIT.words = qs => {
  const seen = new Set(), out = [];
  qs.forEach((q, qi) => {
    const disp = String(q.options[q.answer]).trim();
    if (!/^[A-Za-z][A-Za-z' -]*$/.test(disp) || disp.split(/[\s-]+/).length > 2) return;
    const w = disp.toUpperCase().replace(/[^A-Z]/g, '');
    if (w.length < 3 || w.length > 12 || seen.has(w)) return;
    seen.add(w); out.push({ word: w, disp, clue: q.q, qi });
  });
  return out;
};
const COLORS = ['#e74c3c', '#2a6fb0', '#f5a623', '#1d8a4e', '#8e44ad', '#16a085'];
const SHAPES = ['▲', '◆', '●', '■', '★', '⬟'];
KIT.COLORS = COLORS; KIT.SHAPES = SHAPES;

function css(id, text) { if (document.getElementById(id)) return; const s = document.createElement('style'); s.id = id; s.textContent = text; document.head.appendChild(s); }
css('aigt-g2-css', `
.g2 { color: #14213D; }
.g2-head { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 10px; }
.g2-head b { font-size: 18px; }
.g2-msg { color: #14213D; font-size: 15px; line-height: 1.45; min-height: 22px; margin-top: 10px; }
.g2-q { font-size: 19px; font-weight: 700; line-height: 1.4; margin: 6px 0 12px; }
.g2-kopts { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
@media (max-width: 520px) { .g2-kopts { grid-template-columns: 1fr; } }
.g2-kopt { font: inherit; font-weight: 700; font-size: 16px; color: #fff; border: 0; border-radius: 14px; padding: 16px 14px 16px 48px; text-align: left; cursor: pointer; position: relative; min-height: 64px; line-height: 1.3; transition: transform .1s, opacity .2s; }
.g2-kopt::before { content: attr(data-s); position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 22px; opacity: .9; }
.g2-kopt:hover:not(:disabled) { transform: translateY(-2px); }
.g2-kopt:disabled { cursor: default; }
.g2-kopt.dim { opacity: .35; }
.g2-kopt.ok { box-shadow: 0 0 0 4px #1d8a4e; } .g2-kopt.bad { box-shadow: 0 0 0 4px #14213D; }
.g2-tbar { height: 10px; background: #eee6d3; border-radius: 999px; overflow: hidden; margin: 4px 0 6px; }
.g2-tbar i { display: block; height: 100%; background: #f5a623; transition: width .2s linear; }
.g2-track { display: grid; gap: 6px; margin-bottom: 12px; }
.g2-lane { display: grid; grid-template-columns: 92px 1fr 54px; gap: 8px; align-items: center; font-size: 14px; font-weight: 700; }
.g2-lane .road { height: 30px; background: repeating-linear-gradient(90deg, #e8e2d2 0 18px, #f3efe4 18px 36px); border-radius: 8px; position: relative; overflow: hidden; }
.g2-lane .car { position: absolute; top: 2px; font-size: 22px; transition: left .7s ease; transform: scaleX(-1); }
.g2-lane .pts { text-align: right; color: #8a5a0e; }
.g2-lane.me { color: #c27c00; }
.g2-btns { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
/* tambola */
.g2-call { background: #14213D; color: #fff; border-radius: 16px; padding: 14px 16px; }
.g2-call small { color: #b9c3d8; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; font-size: 12px; }
.g2-call .q { font-size: 18px; font-weight: 700; line-height: 1.4; margin-top: 4px; }
.g2-ticket { display: grid; gap: 6px; margin: 12px 0; background: #fff6e3; border: 2px solid #f5a623; border-radius: 14px; padding: 8px; }
.g2-cell { font: inherit; font-size: 13.5px; font-weight: 700; line-height: 1.25; border: 1px solid #e5dfcf; background: #fff; color: #14213D; border-radius: 10px; padding: 8px 6px; min-height: 58px; cursor: pointer; display: flex; align-items: center; justify-content: center; text-align: center; overflow-wrap: anywhere; position: relative; }
.g2-cell.lg { font-size: 11px; letter-spacing: -.01em; }
.g2-cell.on { background: #1d8a4e; color: #fff; border-color: #1d8a4e; }
.g2-cell.on::after { content: '✓'; position: absolute; right: 5px; top: 2px; font-size: 12px; }
.g2-cell.shake { animation: g2shake .4s; border-color: #c8432b; }
@keyframes g2shake { 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
.g2-prizes { display: flex; gap: 6px; flex-wrap: wrap; }
.g2-prize { font: inherit; font-size: 13.5px; font-weight: 700; border-radius: 999px; padding: 8px 12px; border: 2px solid #f5a623; background: #fff; color: #14213D; cursor: pointer; }
.g2-prize.ready { background: #f5a623; animation: g2pulse 1s infinite; }
.g2-prize.gone { border-color: #e5dfcf; color: #8a93a5; background: #f6f3ea; cursor: default; text-decoration: line-through; }
.g2-prize.mine { border-color: #1d8a4e; background: #e7f6ed; color: #1d8a4e; text-decoration: none; }
@keyframes g2pulse { 50% { box-shadow: 0 0 0 5px #f5a62355; } }
.g2-bots { font-size: 13.5px; color: #5b6475; margin-top: 8px; }
/* tycoon */
.g2-board { display: grid; grid-template-columns: repeat(6, 1fr); grid-template-rows: repeat(6, minmax(64px, auto)); gap: 4px; }
.g2-sq { background: #fff; border: 2px solid #e5dfcf; border-radius: 10px; padding: 4px; font-size: 11px; line-height: 1.2; text-align: center; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; min-width: 0; }
.g2-sq .e { font-size: 20px; line-height: 1.1; }
.g2-sq .n { font-weight: 700; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
.g2-sq .p { color: #8a5a0e; font-weight: 700; }
.g2-sq .band { position: absolute; left: 0; right: 0; top: 0; height: 5px; border-radius: 8px 8px 0 0; }
.g2-sq .tk { display: flex; gap: 2px; margin-top: auto; min-height: 12px; }
.g2-sq .tk i { width: 11px; height: 11px; border-radius: 50%; border: 1.5px solid #14213D; display: block; }
.g2-sq.here { box-shadow: 0 0 0 3px #f5a623; }
.g2-center { grid-column: 2 / 6; grid-row: 2 / 6; background: #F7F4EC; border-radius: 12px; padding: 10px; display: flex; flex-direction: column; gap: 8px; justify-content: center; min-width: 0; }
.g2-center .gt-die { margin: 0; }
.g2-wallets { display: grid; gap: 4px; font-size: 13.5px; }
.g2-wallets div { display: flex; justify-content: space-between; gap: 6px; }
.g2-wallets i { display: inline-block; width: 11px; height: 11px; border-radius: 50%; margin-right: 6px; vertical-align: -1px; border: 1.5px solid #14213D; }
@media (max-width: 520px) { .g2-board { grid-template-rows: repeat(6, minmax(56px, auto)); gap: 3px; } .g2-sq { font-size: 9.5px; padding: 3px 2px; } .g2-sq .e { font-size: 16px; } .g2-center { padding: 6px; font-size: 13px; } .g2-center .gt-btn { padding: 8px 10px; font-size: 13px; } }
/* crossword + word search */
.g2-xgrid { display: grid; gap: 2px; margin: 0 auto 12px; max-width: 100%; }
.g2-x { aspect-ratio: 1; background: #fff; border: 1.5px solid #14213D; border-radius: 3px; position: relative; display: grid; place-items: center; font-weight: 800; color: #14213D; font-size: clamp(11px, 3.2vw, 18px); cursor: pointer; }
.g2-x.blank { background: transparent; border-color: transparent; cursor: default; }
.g2-x .num { position: absolute; left: 2px; top: 0; font-size: 9px; font-weight: 700; color: #5b6475; }
.g2-x.sel { background: #fff1d6; }
.g2-x.done { background: #e7f6ed; }
.g2-clues { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
@media (max-width: 640px) { .g2-clues { grid-template-columns: 1fr; } }
.g2-clues h4 { margin: 0 0 6px; color: #14213D; }
.g2-clue { font: inherit; display: block; width: 100%; text-align: left; background: #fff; border: 1px solid #e5dfcf; border-radius: 10px; padding: 8px 10px; margin-bottom: 6px; cursor: pointer; color: #14213D; font-size: 14px; line-height: 1.35; }
.g2-clue.on { border-color: #f5a623; box-shadow: 0 0 0 2px #f5a62355; }
.g2-clue.done { background: #e7f6ed; border-color: #b9e2c8; }
.g2-clue b { margin-right: 4px; }
.g2-clue .ans { display: block; color: #1d8a4e; font-weight: 800; margin-top: 2px; }
.g2-entry { background: #F7F4EC; border-radius: 12px; padding: 12px; margin-bottom: 12px; }
.g2-entry .pat { font-family: ui-monospace, Menlo, monospace; letter-spacing: .25em; font-weight: 800; font-size: 18px; margin: 4px 0 8px; }
.g2-entry input { text-transform: uppercase; letter-spacing: .12em; font-weight: 700; }
.g2-wgrid { display: grid; gap: 3px; user-select: none; -webkit-user-select: none; touch-action: none; margin: 0 auto 12px; max-width: 520px; }
.g2-w { aspect-ratio: 1; display: grid; place-items: center; background: #fff; border: 1px solid #e5dfcf; border-radius: 6px; font-weight: 800; font-size: clamp(12px, 3.6vw, 19px); color: #14213D; cursor: pointer; }
.g2-w.a { background: #fff1d6; border-color: #f5a623; }
.g2-w.f { background: #d8f0e1; border-color: #1d8a4e; color: #145c34; }
.g2-w.h { animation: g2pulse 1s 3; background: #ffe2a8; }
`);
function kopts(q, order) {
  return order.map((oi, k) => `<button class="g2-kopt" data-i="${oi}" data-s="${SHAPES[k]}" style="background:${COLORS[k]}">${esc(q.options[oi])}</button>`).join('');
}
KIT.kopts = kopts;

/* ======================= QUIZ RACE (vs bots) ======================= */
GAMES.race = { create(root, api) {
  const QN = 8, LIMIT = 20000;
  const racers = [{ name: 'You', pts: 0, me: true }, { name: 'Robo Ria', pts: 0, acc: .7 }, { name: 'Robo Raj', pts: 0, acc: .62 }];
  let alive = true, n = 0, timer = 0, start = 0, cur = null, order = [], answered = false, deck = [];
  root.innerHTML = `<div class="g2"><div class="g2-head"><b>🏁 Quiz Race</b><span class="note" data-r="count"></span></div>
    <div class="g2-track" data-r="track"></div>
    <div data-r="play"></div><div class="g2-msg" data-r="msg"></div><div class="g2-btns" data-r="btns"></div></div>`;
  const R = k => root.querySelector(`[data-r=${k}]`);
  const st = (t, p) => { if (api.status) api.status(t, p); };
  const msg = t => { R('msg').innerHTML = t; const rk = racers.slice().sort((a, b) => b.pts - a.pts).indexOf(racers[0]) + 1; st(`Question ${n} of ${QN} · ${['1st', '2nd', '3rd'][rk - 1]} place`, n / QN * 100); };
  function track() {
    const max = Math.max(60, ...racers.map(r => r.pts));
    R('track').innerHTML = racers.map(r => `<div class="g2-lane${r.me ? ' me' : ''}"><span>${r.me ? '★ You' : r.name}</span><div class="road"><span class="car" style="left:calc(${(r.pts / max * 88).toFixed(1)}%)">${r.me ? '🏎️' : '🚙'}</span></div><span class="pts">${r.pts}</span></div>`).join('');
  }
  function pick() { if (!deck.length) deck = shuffle(api.questions.map((_, i) => i)); return deck.shift(); }
  function ask() {
    if (!alive) return;
    if (n >= QN) return finish();
    n++; answered = false; cur = pick(); const q = api.questions[cur]; order = shuffle(q.options.map((_, i) => i));
    R('count').textContent = `Question ${n} of ${QN}`;
    R('play').innerHTML = `<div class="g2-tbar"><i style="width:100%"></i></div><div class="g2-q">${esc(q.q)}</div><div class="g2-kopts">${kopts(q, order)}</div>`;
    R('btns').innerHTML = ''; msg('Answer fast: quicker correct answers score more.');
    racers.forEach(r => { if (!r.me) { r.t = rnd(3000, 15000); r.ok = Math.random() < r.acc; } });
    start = Date.now(); clearInterval(timer);
    timer = setInterval(() => { const left = LIMIT - (Date.now() - start); const bar = R('play').querySelector('.g2-tbar i'); if (bar) bar.style.width = Math.max(0, left / LIMIT * 100) + '%'; if (left <= 0) answer(-1); }, 100);
  }
  root.addEventListener('click', e => { const b = e.target.closest('.g2-kopt'); if (b && !answered) answer(+b.dataset.i); });
  async function answer(i) {
    if (answered || !alive) return; answered = true; clearInterval(timer);
    const q = api.questions[cur], el = Date.now() - start, ok = i === q.answer;
    const pts = ok ? 10 + Math.round(10 * Math.max(0, 1 - el / LIMIT)) : 0;
    R('play').querySelectorAll('.g2-kopt').forEach(b => { b.disabled = true; const bi = +b.dataset.i; if (bi === q.answer) b.classList.add('ok'); else b.classList.add('dim'); if (bi === i && !ok) b.classList.add('bad'); });
    api.record(cur, ok);
    if (ok) { racers[0].pts += pts; api.gain(pts, 'race'); } else api.sfx('bad');
    racers.forEach(r => { if (!r.me && r.ok) r.pts += 10 + Math.round(10 * Math.max(0, 1 - r.t / LIMIT)); });
    track();
    msg(ok ? `Correct! <b>+${pts}</b> (${(el / 1000).toFixed(1)} s)` : i < 0 ? `Time's up. The answer was <b>${esc(q.options[q.answer])}</b>.` : `Not quite. The answer was <b>${esc(q.options[q.answer])}</b>.`);
    await sleep(ok ? 1500 : 2600); if (alive) ask();
  }
  function finish() {
    const rank = racers.slice().sort((a, b) => b.pts - a.pts);
    const place = rank.indexOf(racers[0]) + 1;
    R('play').innerHTML = `<div class="g2-q">${place === 1 ? '🏆 You won the race!' : place === 2 ? '🥈 Second place' : '🥉 Third place'}</div>`;
    if (place === 1) { api.gain(30, 'race win'); api.won(); }
    msg(place === 1 ? '<b>+30 coins</b> race bonus.' : 'Answer faster next time to overtake the bots.');
    R('btns').innerHTML = '<button class="gt-btn gold" data-a="again">Race again</button>';
    R('btns').querySelector('[data-a=again]').onclick = () => { racers.forEach(r => { r.pts = 0; }); n = 0; track(); ask(); };
  }
  track();
  R('play').innerHTML = `<p class="note">${QN} questions, ${LIMIT / 1000} seconds each. Beat Robo Ria and Robo Raj to the finish. Correct answers score 10 points plus up to 10 for speed, and every point is a coin.</p>`;
  R('btns').innerHTML = '<button class="gt-btn gold" data-a="go">Start the race</button>';
  R('btns').querySelector('[data-a=go]').onclick = ask;
  return { destroy() { alive = false; clearInterval(timer); } };
} };

/* ======================= TAMBOLA (vs bots) ======================= */
GAMES.tambola = { create(root, api) {
  const pool = KIT.pool(api.questions);
  if (!KIT.ticketSize(pool.length)) { root.innerHTML = `<div class="g2"><b>🎟️ Tambola</b><p class="note">Tambola needs at least 9 questions with different answers. This set has ${pool.length}. Pick another game or add more questions.</p></div>`; return { destroy() {} }; }
  let alive = true, calls = [], called = [], callIdx = -1, auto = 0, autoOn = true, over = false;
  const me = { name: 'You', t: [], m: new Set() }, bots = [{ name: 'Robo Ria', t: [], m: new Set() }, { name: 'Robo Raj', t: [], m: new Set() }];
  const won = {};
  root.innerHTML = `<div class="g2"><div class="g2-head"><b>🎟️ Tambola</b><span class="note" data-r="count"></span></div>
    <div class="g2-call" data-r="call"></div>
    <div class="g2-ticket" data-r="ticket"></div>
    <div class="g2-prizes" data-r="prizes"></div>
    <div class="g2-msg" data-r="msg"></div>
    <div class="g2-btns"><button class="gt-btn gold" data-a="next">Next call</button><label class="gt-chk" style="margin:0"><input type="checkbox" data-a="auto" checked> Auto-call every 15 s</label></div>
    <div class="g2-bots" data-r="bots"></div></div>`;
  const R = k => root.querySelector(`[data-r=${k}]`);
  const st = (t, p) => { if (api.status) api.status(t, p); };
  const msg = t => { R('msg').innerHTML = t; if (me.t.length) st(`${me.m.size} of ${me.t.length} marked · ${Object.values(won).filter(w => w === 'You').length} prizes`, me.m.size / me.t.length * 100); };
  function newGame() {
    calls = shuffle(api.questions.map((_, i) => i)); called = []; callIdx = -1; over = false;
    [me, ...bots].forEach(p => { p.t = KIT.ticket(pool.length); p.m = new Set(); });
    Object.keys(won).forEach(k => delete won[k]);
    drawTicket(); drawPrizes(); drawBots();
    R('call').innerHTML = '<small>Caller</small><div class="q">Press <b>Next call</b> to hear the first question. Tap its answer if it is on your ticket.</div>';
    msg('Claim <b>Early Five</b>, a line or <b>Full House</b> before the bots do.');
  }
  function drawTicket() {
    const w = me.t.length / 3;
    R('ticket').style.gridTemplateColumns = `repeat(${w}, 1fr)`;
    R('ticket').innerHTML = me.t.map(c => `<button class="g2-cell${KIT.cellCls(pool[c].text)}${me.m.has(c) ? ' on' : ''}" data-c="${c}">${esc(KIT.short(pool[c].text, 46))}</button>`).join('');
  }
  function drawPrizes() {
    R('prizes').innerHTML = KIT.PRIZES.map(p => {
      const w = won[p.id], ready = !w && p.test(me.t, me.m);
      return `<button class="g2-prize${w ? (w === 'You' ? ' mine' : ' gone') : ready ? ' ready' : ''}" data-p="${p.id}" ${w ? 'disabled' : ''}>${p.name}${w ? ' · ' + esc(w) : ' +' + p.coins}</button>`;
    }).join('');
  }
  function drawBots() { R('bots').textContent = bots.map(b => `${b.name}: ${b.m.size} of ${b.t.length} marked`).join(' · '); }
  const calledCell = c => pool[c].qis.some(qi => called.includes(qi));
  function next() {
    if (over || !alive) return;
    clearTimeout(auto);
    if (callIdx >= 0) { const pq = api.questions[calls[callIdx]]; R('call').dataset.last = pq.options[pq.answer]; }
    callIdx++;
    if (callIdx >= calls.length) { endGame('All questions have been called.'); return; }
    const qi = calls[callIdx]; called.push(qi);
    const last = R('call').dataset.last;
    R('call').innerHTML = `<small>Call ${callIdx + 1} of ${calls.length}</small><div class="q">${esc(api.questions[qi].q)}</div>${last ? `<div class="note" style="color:#b9c3d8;margin-top:6px">Last answer: ${esc(last)}</div>` : ''}`;
    R('count').textContent = `${called.length} called`;
    api.sfx('roll');
    bots.forEach(b => { const c = b.t.find(c => pool[c].qis.includes(qi)); if (c != null && Math.random() < .85) setTimeout(() => { if (!alive || over) return; b.m.add(c); drawBots(); botClaims(b); }, rnd(1500, 6000)); });
    if (autoOn) auto = setTimeout(next, 15000);
  }
  function botClaims(b) {
    KIT.PRIZES.forEach(p => { if (!won[p.id] && p.test(b.t, b.m)) setTimeout(() => { if (!alive || over || won[p.id] || !p.test(b.t, b.m)) return; won[p.id] = b.name; drawPrizes(); msg(`${b.name} claimed <b>${p.name}</b>.`); api.sfx('hit'); if (p.id === 'full') endGame(`${b.name} got Full House.`); }, rnd(800, 3500)); });
  }
  function endGame(why) {
    over = true; clearTimeout(auto);
    const mine = KIT.PRIZES.filter(p => won[p.id] === 'You').length;
    msg(`${esc(why)} You won ${mine} prize${mine === 1 ? '' : 's'}. <button class="gt-btn gold sm" data-a="new">New ticket</button>`);
    if (won.full === 'You') api.won();
  }
  root.addEventListener('click', e => {
    if (!alive) return;
    const cell = e.target.closest('.g2-cell'), pz = e.target.closest('.g2-prize'), a = e.target.closest('[data-a]');
    if (cell && !over) {
      const c = +cell.dataset.c; if (me.m.has(c)) return;
      if (!called.length) { msg('Wait for the first call.'); return; }
      if (calledCell(c)) {
        me.m.add(c); cell.classList.add('on'); api.gain(3, 'mark'); api.sfx('good');
        const qi = pool[c].qis.filter(q => called.includes(q)).pop(); api.record(qi, true);
        drawPrizes();
      } else {
        cell.classList.remove('shake'); void cell.offsetWidth; cell.classList.add('shake');
        api.lose(2, 'not called'); api.record(called[called.length - 1], false);
        msg('That answer has not been called yet.');
      }
    } else if (pz && !over) {
      const p = KIT.PRIZES.find(x => x.id === pz.dataset.p); if (!p || won[p.id]) return;
      if (p.test(me.t, me.m)) { won[p.id] = 'You'; api.gain(p.coins, p.name); api.sfx('win'); msg(`You claimed <b>${p.name}</b>! +${p.coins} coins.`); drawPrizes(); if (p.id === 'full') endGame('Full House!'); }
      else { api.lose(10, 'bogie'); msg(`Bogie! Your ticket does not have ${p.name} yet. −10 coins.`); }
    } else if (a && a.dataset.a === 'next') next();
    else if (a && a.dataset.a === 'new') newGame();
  });
  root.querySelector('[data-a=auto]').onchange = e => { autoOn = e.target.checked; clearTimeout(auto); if (autoOn && callIdx >= 0 && !over) auto = setTimeout(next, 15000); };
  newGame();
  return { destroy() { alive = false; clearTimeout(auto); } };
} };

/* ======================= BUSINESS TYCOON (vs bots) ======================= */
GAMES.tycoon = { create(root, api) {
  const SQ = [
    { t: 'start', n: 'Start', e: '🏁' },
    { t: 'co', n: 'Tea Stall', e: '☕', p: 30, s: 'Food' }, { t: 'news', n: 'Market News', e: '📰' }, { t: 'co', n: 'Bakery', e: '🥐', p: 35, s: 'Food' },
    { t: 'co', n: 'Textile Mill', e: '🧵', p: 50, s: 'Industry' }, { t: 'tax', n: 'Tax Audit', e: '🧾' },
    { t: 'co', n: 'Steel Plant', e: '🏭', p: 55, s: 'Industry' }, { t: 'co', n: 'App Studio', e: '📱', p: 60, s: 'Tech' },
    { t: 'meet', n: 'Board Meeting', e: '💼' }, { t: 'co', n: 'Fintech', e: '💳', p: 65, s: 'Tech' },
    { t: 'co', n: 'Logistics', e: '🚚', p: 70, s: 'Transport' }, { t: 'co', n: 'Airline', e: '✈️', p: 80, s: 'Transport' },
    { t: 'news', n: 'Market News', e: '📰' }, { t: 'co', n: 'Pharma Lab', e: '💊', p: 85, s: 'Health' },
    { t: 'co', n: 'Hospital', e: '🏥', p: 90, s: 'Health' }, { t: 'rest', n: 'Startup Expo', e: '🎪' },
    { t: 'co', n: 'Solar Farm', e: '☀️', p: 95, s: 'Energy' }, { t: 'co', n: 'EV Maker', e: '🔋', p: 100, s: 'Energy' },
    { t: 'tax', n: 'Tax Audit', e: '🧾' }, { t: 'co', n: 'Bank', e: '🏦', p: 110, s: 'Finance' }
  ];
  const SEC = { Food: '#e67e22', Industry: '#7f8c8d', Tech: '#2a6fb0', Transport: '#16a085', Health: '#c8432b', Energy: '#f1c40f', Finance: '#8e44ad' };
  const POS = []; for (let c = 0; c < 6; c++) POS.push([0, c]); for (let r = 1; r < 6; r++) POS.push([r, 5]); for (let c = 4; c >= 0; c--) POS.push([5, c]); for (let r = 4; r >= 1; r--) POS.push([r, 0]);
  const TURNS = 12, SALARY = 20;
  const pl = [{ name: 'You', col: '#f5a623' }, { name: 'Robo Ria', col: '#2a6fb0' }, { name: 'Robo Raj', col: '#c8432b' }];
  let alive = true, busy = false, turn = 0, owner = {}, offer = null;
  root.innerHTML = `<div class="g2"><div class="g2-board" data-r="board"></div></div>`;
  const B = root.querySelector('[data-r=board]');
  const rent = i => { const s = SQ[i], o = owner[i]; if (o == null) return 0; const base = Math.round(s.p / 5); const both = SQ.every((x, j) => x.s !== s.s || owner[j] === o); return both && s.s !== 'Finance' ? base * 2 : base; };
  const cash = i => i ? pl[i].cash : api.coins;
  const worth = i => cash(i) + SQ.reduce((m, s, j) => m + (owner[j] === i ? s.p : 0), 0);
  function reset() { pl.forEach((p, i) => { p.pos = 0; p.out = false; if (i) p.cash = 200; }); owner = {}; turn = 0; offer = null; }
  function draw(text, btns) {
    let h = '';
    SQ.forEach((s, i) => {
      const [r, c] = POS[i], o = owner[i];
      h += `<div class="g2-sq${pl[0].pos === i ? ' here' : ''}" style="grid-row:${r + 1};grid-column:${c + 1};${o != null ? `border-color:${pl[o].col};background:${pl[o].col}18` : ''}">${s.s ? `<span class="band" style="background:${SEC[s.s]}"></span>` : ''}<span class="e">${s.e}</span><span class="n">${esc(s.n)}</span>${s.p ? `<span class="p">${o != null ? 'rent ' + rent(i) : s.p}</span>` : ''}<span class="tk">${pl.map((p, k) => !p.out && p.pos === i ? `<i style="background:${p.col}"></i>` : '').join('')}</span></div>`;
    });
    h += `<div class="g2-center"><div style="display:flex;gap:8px;align-items:center;justify-content:space-between;flex-wrap:wrap"><b>🏢 Business Tycoon</b><span class="note">Turn ${Math.min(turn + 1, TURNS)} of ${TURNS}</span></div>
      <div class="g2-wallets">${pl.map((p, i) => `<div><span><i style="background:${p.col}"></i>${p.name}${p.out ? ' (bankrupt)' : ''}</span><b>🪙 ${cash(i)} · worth ${worth(i)}</b></div>`).join('')}</div>
      <div class="g2-msg" style="margin:0">${text || ''}</div>
      <div class="g2-btns" style="margin:0;align-items:center">${btns || ''}</div></div>`;
    B.innerHTML = h;
    if (api.status) api.status(`Turn ${Math.min(turn + 1, TURNS)} of ${TURNS} · worth ${worth(0)}`, turn / TURNS * 100);
  }
  const rollBtn = () => `<div class="gt-die" data-r="die">🎲</div><button class="gt-btn gold" data-a="roll" ${busy ? 'disabled' : ''}>Roll dice</button>`;
  async function moveP(i, d) {
    const p = pl[i];
    for (let k = 0; k < d; k++) { p.pos = (p.pos + 1) % SQ.length; if (p.pos === 0) { if (i) p.cash += SALARY; else api.gain(SALARY, 'salary'); } draw(i ? `${p.name} is moving…` : 'Moving…'); await sleep(170); if (!alive) return; }
  }
  async function myTurn() {
    if (busy || api.busy || api.over) return;
    busy = true; offer = null;
    const d = rnd(1, 6); api.sfx('roll');
    await moveP(0, d); if (!alive) return;
    const i = pl[0].pos, s = SQ[i];
    let text = `You rolled ${d} and landed on <b>${esc(s.n)}</b>.`, btns = '';
    if (s.t === 'co') {
      const o = owner[i];
      if (o == null) {
        if (api.coins >= s.p) { offer = i; text += ` Buy it for ${s.p} coins? Answer a due-diligence question first.`; btns = `<button class="gt-btn gold" data-a="buy">Buy (${s.p})</button><button class="gt-btn ghost" data-a="skip">Skip</button>`; }
        else text += ` It costs ${s.p} coins. Earn more coins to buy companies.`;
      } else if (o === 0) text += ' You own it.';
      else {
        const r = rent(i);
        const ok = await api.ask('rescue', { title: 'Negotiate the rent', sub: `${pl[o].name} owns ${s.n}. Rent is ${r} coins. Answer correctly to pay only half.` });
        if (!alive) return;
        const pay = ok ? Math.ceil(r / 2) : r, paid = Math.min(pay, api.coins);
        api.lose(paid, 'rent'); pl[o].cash += paid;
        text += ok ? ` Good negotiating: you paid half rent (${paid}).` : ` You paid ${paid} coins rent to ${pl[o].name}.`;
      }
    } else if (s.t === 'news') {
      const ok = await api.ask('bonus', { title: 'Market News' }); if (!alive) return;
      if (!ok) { api.lose(5, 'bad news'); text += ' The market moved against you (−5).'; } else text += ' You read the market right!';
    } else if (s.t === 'meet') {
      const ok = await api.ask('bonus', { title: 'Board Meeting' }); if (!alive) return;
      if (ok) { api.gain(10, 'dividend'); text += ' The board pays you a dividend (+10).'; }
    } else if (s.t === 'tax') {
      const ok = await api.ask('rescue', { title: 'Tax audit', sub: 'Answer correctly to pass the audit without paying 10 coins.' }); if (!alive) return;
      if (!ok) { api.lose(10, 'tax'); text += ' You paid 10 coins tax.'; } else text += ' Audit passed, no tax!';
    } else if (s.t === 'rest') text += ' Network and relax.';
    if (offer != null) { busy = false; draw(text, btns); return; }
    await bots(text);
  }
  async function bots(text) {
    busy = true; draw(text, rollBtn());
    for (let b = 1; b < pl.length; b++) {
      const p = pl[b]; if (p.out) continue;
      await sleep(700); if (!alive) return;
      const d = rnd(1, 6); await moveP(b, d); if (!alive) return;
      const i = p.pos, s = SQ[i];
      if (s.t === 'co') {
        const o = owner[i];
        if (o == null && p.cash >= s.p + 20 && Math.random() < .8) { p.cash -= s.p; owner[i] = b; text = `${p.name} bought ${s.n}.`; }
        else if (o === 0) { const r = rent(i); p.cash -= r; api.gain(r, 'rent'); text = `${p.name} paid you ${r} coins rent for ${s.n}!`; }
        else if (o != null && o !== b) { const r = rent(i); p.cash -= r; pl[o].cash += r; text = `${p.name} paid ${pl[o].name} rent.`; }
        else text = `${p.name} landed on ${s.n}.`;
      } else if (s.t === 'tax') { p.cash -= 10; text = `${p.name} paid tax.`; }
      else if (s.t === 'meet' || s.t === 'news') { const g = Math.random() < .6 ? 10 : -5; p.cash += g; text = `${p.name} ${g > 0 ? 'got a dividend' : 'lost on the market'}.`; }
      else text = `${p.name} landed on ${s.n}.`;
      if (p.cash < 0) { p.out = true; Object.keys(owner).forEach(k => { if (owner[k] === b) delete owner[k]; }); text += ` ${p.name} is bankrupt!`; }
      draw(text, rollBtn());
    }
    turn++; busy = false;
    if (turn >= TURNS || pl.slice(1).every(p => p.out)) return finish();
    draw(text + ' Your turn: roll the dice.', rollBtn());
  }
  function finish() {
    const ws = pl.map((p, i) => worth(i)), best = Math.max(...ws), win = ws[0] === best;
    if (win) { api.gain(60, 'tycoon win'); api.won(); }
    draw(win ? `🏆 You are the top tycoon with a net worth of ${ws[0]}! <b>+60 coins</b>.` : `Game over. ${pl[ws.indexOf(best)].name} wins with a net worth of ${best}. Yours is ${ws[0]}.`, '<button class="gt-btn gold" data-a="new">New game</button>');
  }
  root.addEventListener('click', async e => {
    const a = e.target.closest('[data-a]'); if (!a || !alive) return;
    if (a.dataset.a === 'roll') myTurn();
    else if (a.dataset.a === 'new') { reset(); draw('A new game! Roll the dice. Buy companies, collect rent and finish with the highest net worth.', rollBtn()); }
    else if ((a.dataset.a === 'buy' || a.dataset.a === 'skip') && offer != null) {
      const i = offer; offer = null; let text;
      if (a.dataset.a === 'buy') {
        const ok = await api.ask('rescue', { title: 'Due diligence', sub: `Answer correctly to buy ${SQ[i].n} for ${SQ[i].p} coins.` }); if (!alive) return;
        if (ok && api.spend(SQ[i].p, 'bought ' + SQ[i].n)) { owner[i] = 0; text = `You bought <b>${esc(SQ[i].n)}</b>! Others pay you rent when they land here.`; }
        else text = ok ? 'You could not afford it.' : 'The deal fell through this time.';
      } else text = 'You passed on the deal.';
      await bots(text);
    }
  });
  reset();
  draw(`Roll the dice and move round the board. Buy companies (answer a question first), collect rent, and finish ${TURNS} turns with the highest net worth. Passing Start pays ${SALARY} coins. Own both companies in a sector to double the rent.`, rollBtn());
  return { destroy() { alive = false; } };
} };

/* ======================= CROSSWORD ======================= */
function buildCross(list, max) {
  let best = null;
  for (let t = 0; t < 40; t++) {
    const words = shuffle(list).slice(0, Math.min(list.length, max * 2)).sort((a, b) => b.word.length - a.word.length + (Math.random() - .5) * 2);
    const cells = new Map(), placed = [];
    const key = (r, c) => r + ',' + c;
    const get = (r, c) => cells.get(key(r, c));
    const put = (w, r, c, dir) => { for (let k = 0; k < w.word.length; k++) { const rr = r + (dir ? k : 0), cc = c + (dir ? 0 : k), cur = get(rr, cc) || { ch: w.word[k], dirs: [] }; cur.dirs.push(dir); cells.set(key(rr, cc), cur); } placed.push(Object.assign({}, w, { r, c, dir })); };
    const fits = (w, r, c, dir) => {
      let cross = 0; const L = w.word.length;
      const before = dir ? get(r - 1, c) : get(r, c - 1), after = dir ? get(r + L, c) : get(r, c + L);
      if (before || after) return -1;
      for (let k = 0; k < L; k++) {
        const rr = r + (dir ? k : 0), cc = c + (dir ? 0 : k), cur = get(rr, cc);
        if (cur) { if (cur.ch !== w.word[k] || cur.dirs.includes(dir)) return -1; cross++; }
        else { const n1 = dir ? get(rr, cc - 1) : get(rr - 1, cc), n2 = dir ? get(rr, cc + 1) : get(rr + 1, cc); if (n1 || n2) return -1; }
      }
      return cross;
    };
    put(words[0], 0, 0, 0);
    for (const w of words.slice(1)) {
      if (placed.length >= max) break;
      const cand = [];
      cells.forEach((v, k) => { const [r, c] = k.split(',').map(Number); for (let i = 0; i < w.word.length; i++) if (w.word[i] === v.ch) [0, 1].forEach(dir => { if (v.dirs.includes(dir)) return; const r0 = dir ? r - i : r, c0 = dir ? c : c - i, x = fits(w, r0, c0, dir); if (x > 0) cand.push([x + Math.random(), r0, c0, dir]); }); });
      if (cand.length) { cand.sort((a, b) => b[0] - a[0]); put(w, cand[0][1], cand[0][2], cand[0][3]); }
    }
    if (!best || placed.length > best.placed.length) best = { placed, cells };
    if (best.placed.length >= Math.min(max, list.length)) break;
  }
  let r0 = Infinity, c0 = Infinity, r1 = -Infinity, c1 = -Infinity;
  best.cells.forEach((_, k) => { const [r, c] = k.split(',').map(Number); r0 = Math.min(r0, r); c0 = Math.min(c0, c); r1 = Math.max(r1, r); c1 = Math.max(c1, c); });
  const P = best.placed.map(p => Object.assign(p, { r: p.r - r0, c: p.c - c0 }));
  const starts = [...new Set(P.map(p => p.r * 100 + p.c))].sort((a, b) => a - b);
  P.forEach(p => { p.num = starts.indexOf(p.r * 100 + p.c) + 1; });
  return { rows: r1 - r0 + 1, cols: c1 - c0 + 1, words: P.sort((a, b) => a.dir - b.dir || a.num - b.num) };
}
GAMES.crossword = { create(root, api) {
  const all = KIT.words(api.questions);
  if (all.length < 4) { root.innerHTML = `<div class="g2"><b>✏️ Crossword</b><p class="note">Crossword needs at least 4 questions whose answer is one or two words (3 to 12 letters). This set has ${all.length}. Pick another game, or add questions with short answers.</p></div>`; return { destroy() {} }; }
  let alive = true, X, solved, sel = -1, revealed;
  root.innerHTML = '<div class="g2"><div class="g2-head"><b>✏️ Crossword</b><span class="note" data-r="count"></span></div><div class="g2-xgrid" data-r="grid"></div><div class="g2-entry" data-r="entry"></div><div class="g2-clues" data-r="clues"></div><div class="g2-msg" data-r="msg"></div></div>';
  const R = k => root.querySelector(`[data-r=${k}]`);
  const st = (t, p) => { if (api.status) api.status(t, p); };
  const msg = t => { R('msg').innerHTML = t; if (X) st(`${solved.size} of ${X.words.length} words`, solved.size / X.words.length * 100); };
  const at = (w, k) => [w.r + (w.dir ? k : 0), w.c + (w.dir ? 0 : k)];
  function letters() { const m = {}; X.words.forEach((w, i) => { for (let k = 0; k < w.word.length; k++) { const [r, c] = at(w, k), id = r + ',' + c; if (solved.has(i) || revealed[i].has(k)) m[id] = w.word[k]; } }); return m; }
  function newPuzzle() {
    X = buildCross(all, Math.min(8, all.length)); solved = new Set(); revealed = X.words.map(() => new Set()); sel = -1;
    draw(); entry(); msg('Tap a clue, type the answer and press <b>Check</b>. Correct words earn 10 coins.');
  }
  function draw() {
    const L = letters(), nums = {}, map = {}, selCells = new Set();
    X.words.forEach((w, i) => { nums[w.r + ',' + w.c] = w.num; for (let k = 0; k < w.word.length; k++) { const id = at(w, k).join(','); map[id] = map[id] || []; map[id].push(i); if (i === sel) selCells.add(id); } });
    const g = R('grid'); g.style.gridTemplateColumns = `repeat(${X.cols}, minmax(0, 1fr))`; g.style.maxWidth = Math.min(560, X.cols * 40) + 'px';
    let h = '';
    for (let r = 0; r < X.rows; r++) for (let c = 0; c < X.cols; c++) {
      const id = r + ',' + c;
      if (!map[id]) { h += '<div class="g2-x blank"></div>'; continue; }
      const done = map[id].every(i => solved.has(i)) || map[id].some(i => solved.has(i));
      h += `<div class="g2-x${selCells.has(id) ? ' sel' : done && L[id] ? ' done' : ''}" data-w="${map[id][0]}">${nums[id] ? `<span class="num">${nums[id]}</span>` : ''}${L[id] || ''}</div>`;
    }
    g.innerHTML = h;
    const list = dir => X.words.map((w, i) => w.dir !== dir ? '' : `<button class="g2-clue${i === sel ? ' on' : ''}${solved.has(i) ? ' done' : ''}" data-w="${i}"><b>${w.num}</b>${esc(w.clue)} <span class="note">(${w.word.length})</span>${solved.has(i) ? `<span class="ans">${esc(w.disp)}</span>` : ''}</button>`).join('');
    R('clues').innerHTML = `<div><h4>Across</h4>${list(0) || '<p class="note">None</p>'}</div><div><h4>Down</h4>${list(1) || '<p class="note">None</p>'}</div>`;
    R('count').textContent = `${solved.size} of ${X.words.length} solved`;
  }
  function entry() {
    const e = R('entry');
    if (sel < 0 || solved.has(sel)) { e.innerHTML = '<span class="note">Pick a clue to answer it.</span>'; return; }
    const w = X.words[sel], L = letters();
    const pat = w.word.split('').map((ch, k) => L[at(w, k).join(',')] || '_').join(' ');
    e.innerHTML = `<b>${w.num} ${w.dir ? 'Down' : 'Across'}</b> · ${esc(w.clue)}<div class="pat">${pat}</div><div class="row" style="margin-top:0"><input type="text" data-r="in" maxlength="${w.word.length + 4}" autocomplete="off" autocapitalize="characters" spellcheck="false" style="max-width:240px"><button class="gt-btn gold sm" data-a="check">Check</button><button class="gt-btn ghost sm" data-a="hint">Reveal a letter · 3</button></div>`;
    const inp = R('in'); inp.focus({ preventScroll: true }); inp.onkeydown = ev => { if (ev.key === 'Enter') check(); };
  }
  function check() {
    const w = X.words[sel], v = (R('in').value || '').toUpperCase().replace(/[^A-Z]/g, '');
    if (!v) return;
    if (v === w.word) {
      solved.add(sel); api.record(w.qi, true); const r = 10; api.gain(r, 'word'); api.sfx('good');
      msg(`Correct: <b>${esc(w.disp)}</b>. +${r} coins.`);
      const nxt = X.words.findIndex((_, i) => !solved.has(i)); sel = nxt; draw(); entry();
      if (solved.size === X.words.length) { api.gain(30, 'puzzle'); api.won(); msg('🎉 Puzzle complete! <b>+30 coins</b>. <button class="gt-btn gold sm" data-a="new">New puzzle</button>'); }
    } else { api.record(w.qi, false); api.lose(2, 'wrong word'); msg(`Not “${esc(v)}”. Try again or reveal a letter.`); R('in').select(); }
  }
  root.addEventListener('click', e => {
    if (!alive) return;
    const c = e.target.closest('[data-w]'), a = e.target.closest('[data-a]');
    if (a) { if (a.dataset.a === 'check') check(); else if (a.dataset.a === 'new') newPuzzle(); else if (a.dataset.a === 'hint') {
      const w = X.words[sel], L = letters(), ks = [...Array(w.word.length).keys()].filter(k => !L[at(w, k).join(',')]);
      if (ks.length <= 1) { msg('Only one letter left: you can do it!'); return; }
      if (!api.spend(3, 'hint')) return; revealed[sel].add(ks[rnd(0, ks.length - 1)]); draw(); entry(); } return; }
    if (c) { const i = +c.dataset.w; if (!solved.has(i)) { sel = i; draw(); entry(); } }
  });
  newPuzzle();
  return { destroy() { alive = false; } };
} };

/* ======================= WORD SEARCH ======================= */
GAMES.wordsearch = { create(root, api) {
  const all = KIT.words(api.questions);
  if (all.length < 4) { root.innerHTML = `<div class="g2"><b>🔎 Word Search</b><p class="note">Word Search needs at least 4 questions whose answer is one or two words (3 to 12 letters). This set has ${all.length}. Pick another game, or add questions with short answers.</p></div>`; return { destroy() {} }; }
  const DIRS = [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]];
  let alive = true, N, G, placed, found, a = null;
  root.innerHTML = '<div class="g2"><div class="g2-head"><b>🔎 Word Search</b><span class="note" data-r="count"></span></div><div class="g2-wgrid" data-r="grid"></div><div class="g2-btns" style="margin:0 0 10px"><button class="gt-btn ghost sm" data-a="hint">Hint · 5 coins</button></div><div data-r="clues"></div><div class="g2-msg" data-r="msg"></div></div>';
  const R = k => root.querySelector(`[data-r=${k}]`);
  const st = (t, p) => { if (api.status) api.status(t, p); };
  const msg = t => { R('msg').innerHTML = t; if (placed) st(`${found.size} of ${placed.length} found`, found.size / placed.length * 100); };
  function newPuzzle() {
    const pick = shuffle(all).slice(0, 8);
    N = Math.max(10, Math.min(13, Math.max(...pick.map(w => w.word.length)) + 1));
    G = Array.from({ length: N }, () => Array(N).fill('')); placed = [];
    pick.sort((x, y) => y.word.length - x.word.length).forEach(w => {
      for (let t = 0; t < 300; t++) {
        const [dr, dc] = DIRS[rnd(0, DIRS.length - 1)], L = w.word.length;
        const r = rnd(0, N - 1), c = rnd(0, N - 1), r2 = r + dr * (L - 1), c2 = c + dc * (L - 1);
        if (r2 < 0 || r2 >= N || c2 < 0 || c2 >= N) continue;
        let ok = true; for (let k = 0; k < L; k++) { const ch = G[r + dr * k][c + dc * k]; if (ch && ch !== w.word[k]) { ok = false; break; } }
        if (!ok) continue;
        for (let k = 0; k < L; k++) G[r + dr * k][c + dc * k] = w.word[k];
        placed.push(Object.assign({ r, c, dr, dc }, w)); break;
      }
    });
    const AB = 'ABCDEFGHIJKLMNOPRSTUVWY';
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (!G[r][c]) G[r][c] = AB[rnd(0, AB.length - 1)];
    found = new Set(); a = null; draw();
    msg('Each clue is a question. Find its answer hidden in the grid: tap the first letter, then the last letter (or drag).');
  }
  const cellsOf = w => Array.from({ length: w.word.length }, (_, k) => (w.r + w.dr * k) + ',' + (w.c + w.dc * k));
  function draw() {
    const F = new Set(); placed.forEach((w, i) => { if (found.has(i)) cellsOf(w).forEach(x => F.add(x)); });
    const g = R('grid'); g.style.gridTemplateColumns = `repeat(${N}, minmax(0, 1fr))`;
    let h = ''; for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) h += `<div class="g2-w${F.has(r + ',' + c) ? ' f' : ''}${a && a[0] === r && a[1] === c ? ' a' : ''}" data-rc="${r},${c}">${G[r][c]}</div>`;
    g.innerHTML = h;
    R('clues').innerHTML = placed.map((w, i) => `<div class="g2-clue${found.has(i) ? ' done' : ''}" style="cursor:default"><b>${i + 1}.</b>${esc(w.clue)} <span class="note">(${w.word.length} letters)</span>${found.has(i) ? `<span class="ans">${esc(w.disp)}</span>` : ''}</div>`).join('');
    R('count').textContent = `${found.size} of ${placed.length} found`;
  }
  function tryLine(r1, c1, r2, c2) {
    const dr = Math.sign(r2 - r1), dc = Math.sign(c2 - c1), L = Math.max(Math.abs(r2 - r1), Math.abs(c2 - c1)) + 1;
    if (!(r1 === r2 || c1 === c2 || Math.abs(r2 - r1) === Math.abs(c2 - c1))) { msg('Words run in straight lines: across, down or diagonal.'); return; }
    let s = ''; for (let k = 0; k < L; k++) s += G[r1 + dr * k][c1 + dc * k];
    const rev = s.split('').reverse().join('');
    const i = placed.findIndex((w, j) => !found.has(j) && (w.word === s || w.word === rev));
    if (i < 0) { msg(`“${s}” is not one of the answers.`); return; }
    found.add(i); api.record(placed[i].qi, true); api.gain(10, 'found'); api.sfx('good');
    msg(`Found <b>${esc(placed[i].disp)}</b>: ${esc(KIT.short(placed[i].clue, 90))} +10 coins.`);
    if (found.size === placed.length) { api.gain(30, 'puzzle'); api.won(); msg('🎉 All answers found! <b>+30 coins</b>. <button class="gt-btn gold sm" data-a="new">New puzzle</button>'); }
  }
  const rcOf = el => el && el.dataset && el.dataset.rc ? el.dataset.rc.split(',').map(Number) : null;
  let downAt = null;
  R('grid').addEventListener('pointerdown', e => { const p = rcOf(e.target.closest('.g2-w')); if (!p) return; downAt = p; e.preventDefault(); });
  R('grid').addEventListener('pointerup', e => {
    const p = rcOf(document.elementFromPoint(e.clientX, e.clientY)); const d = downAt; downAt = null; if (!p || !d || !alive) return;
    if (p[0] !== d[0] || p[1] !== d[1]) { a = null; tryLine(d[0], d[1], p[0], p[1]); draw(); return; }
    if (!a) { a = p; draw(); return; }
    const s = a; a = null; if (s[0] === p[0] && s[1] === p[1]) { draw(); return; } tryLine(s[0], s[1], p[0], p[1]); draw();
  });
  root.addEventListener('click', e => {
    const b = e.target.closest('[data-a]'); if (!b || !alive) return;
    if (b.dataset.a === 'new') newPuzzle();
    else if (b.dataset.a === 'hint') {
      const left = placed.map((_, i) => i).filter(i => !found.has(i)); if (!left.length) return;
      if (!api.spend(5, 'hint')) return;
      const w = placed[left[rnd(0, left.length - 1)]], el = R('grid').querySelector(`[data-rc="${w.r},${w.c}"]`);
      if (el) { el.classList.add('h'); setTimeout(() => el.classList.remove('h'), 3200); }
      msg(`Hint: an answer starts at the flashing letter (clue: ${esc(KIT.short(w.clue, 70))}).`);
    }
  });
  newPuzzle();
  return { destroy() { alive = false; } };
} };
})();
