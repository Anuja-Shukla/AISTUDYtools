/* AIgametools games: Snakes & Ladders, Ludo and Jump Quest.
   Each game gets an `api` from the app: spend / gain / lose coins, ask questions, sounds. */
(function () {
'use strict';
const GAMES = window.AIGT_GAMES = window.AIGT_GAMES || {};
const sleep = ms => new Promise(r => setTimeout(r, ms));
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
function makeCanvas(parent, w, h) {
  const c = document.createElement('canvas');
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  c.width = w * dpr; c.height = h * dpr;
  const ctx = c.getContext('2d'); ctx.scale(dpr, dpr);
  parent.appendChild(c);
  return { c, ctx, pt(e) { const r = c.getBoundingClientRect(); return { x: (e.clientX - r.left) * w / r.width, y: (e.clientY - r.top) * h / r.height }; } };
}
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
const FACES = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
async function rollDie(el, api, alive) {
  api.sfx('roll'); el.classList.remove('roll'); void el.offsetWidth; el.classList.add('roll');
  for (let i = 0; i < 6; i++) { el.textContent = rnd(1, 6); await sleep(70); if (!alive()) return 1; }
  const d = rnd(1, 6); el.textContent = d; return d;
}
function shell(root, extra) {
  root.innerHTML = `<div class="cv"></div><div class="gt-stagebar"><div class="gt-die" aria-live="polite">🎲</div><button class="gt-btn gold" data-act="roll">Roll dice · 5 coins</button><div class="msg" aria-live="polite"></div></div>${extra || ''}`;
  return { cv: root.querySelector('.cv'), die: root.querySelector('.gt-die'), btn: root.querySelector('[data-act=roll]'), msg: root.querySelector('.msg') };
}

/* ======================= SNAKES & LADDERS ======================= */
GAMES.snakes = { create(root, api) {
  const S = 50, N = 500, UI = shell(root);
  const { ctx, c } = makeCanvas(UI.cv, N, N);
  const SNAKES = { 16: 6, 47: 26, 49: 11, 62: 19, 87: 24, 93: 73, 98: 78 };
  const LADDERS = { 4: 14, 9: 31, 21: 42, 28: 84, 51: 67, 71: 91, 80: 100 };
  const SN_COL = ['#2f8f4e', '#8e44ad', '#c8432b', '#1f7a8c', '#d35400', '#2c3e50', '#16a085'];
  const players = [{ name: 'You', color: '#f5a623' }, { name: 'Robo Ria', color: '#2a6fb0' }, { name: 'Robo Raj', color: '#c8432b' }];
  const OFF = [[-9, -8], [9, -8], [0, 9]];
  let alive = true, busy = false, raf = 0, round = 1;
  const cell = n => { if (n <= 0) return { x: -14, y: N - S / 2 }; const r = Math.floor((n - 1) / 10); let col = (n - 1) % 10; if (r % 2) col = 9 - col; return { x: col * S + S / 2, y: N - (r * S + S / 2) }; };
  function reset() { players.forEach(p => { p.pos = 0; const c0 = cell(1); p.x = c0.x; p.y = c0.y; p.tx = p.x; p.ty = p.y; }); }
  reset();
  const setT = (i, n) => { const q = cell(Math.max(1, n)); players[i].tx = q.x; players[i].ty = q.y; };
  const st = (t, p) => { if (api.status) api.status(t, p); };
  const msg = t => { UI.msg.innerHTML = t; st(`Square ${players[0].pos} of 100`, players[0].pos); };
  const setBtn = () => { UI.btn.disabled = busy; };
  function drawSnake(a, b, col) {
    const p = cell(a), q = cell(b), dx = q.x - p.x, dy = q.y - p.y, len = Math.hypot(dx, dy), nx = -dy / len, ny = dx / len;
    const pts = []; for (let i = 0; i <= 40; i++) { const t = i / 40, w = Math.sin(t * Math.PI * 3) * 13 * (1 - t * 0.4); pts.push([p.x + dx * t + nx * w, p.y + dy * t + ny * w]); }
    ctx.lineCap = 'round';
    for (let i = 0; i < pts.length - 1; i++) { ctx.strokeStyle = col; ctx.lineWidth = 11 - 7 * i / pts.length; ctx.beginPath(); ctx.moveTo(pts[i][0], pts[i][1]); ctx.lineTo(pts[i + 1][0], pts[i + 1][1]); ctx.stroke(); }
    ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(p.x, p.y, 10, 8, Math.atan2(dy, dx), 0, 7); ctx.fill();
    ctx.fillStyle = '#fff'; [[-3, -3], [3, -3]].forEach(([ox, oy]) => { ctx.beginPath(); ctx.arc(p.x + ox, p.y + oy, 2.6, 0, 7); ctx.fill(); });
    ctx.fillStyle = '#111'; [[-3, -3], [3, -3]].forEach(([ox, oy]) => { ctx.beginPath(); ctx.arc(p.x + ox, p.y + oy, 1.2, 0, 7); ctx.fill(); });
  }
  function drawLadder(a, b) {
    const p = cell(a), q = cell(b), dx = q.x - p.x, dy = q.y - p.y, len = Math.hypot(dx, dy), nx = -dy / len * 8, ny = dx / len * 8;
    ctx.strokeStyle = '#8a5a2b'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    [[nx, ny], [-nx, -ny]].forEach(([ox, oy]) => { ctx.beginPath(); ctx.moveTo(p.x + ox, p.y + oy); ctx.lineTo(q.x + ox, q.y + oy); ctx.stroke(); });
    ctx.lineWidth = 3; for (let d = 14; d < len - 6; d += 16) { const t = d / len; ctx.beginPath(); ctx.moveTo(p.x + dx * t + nx, p.y + dy * t + ny); ctx.lineTo(p.x + dx * t - nx, p.y + dy * t - ny); ctx.stroke(); }
  }
  function draw() {
    if (!alive) return;
    ctx.clearRect(0, 0, N, N);
    for (let n = 1; n <= 100; n++) {
      const q = cell(n), r = Math.floor(q.y / S), col = Math.floor(q.x / S);
      ctx.fillStyle = (r + col) % 2 ? '#fdf3dc' : '#e8f1e4'; if (n === 100) ctx.fillStyle = '#ffd98a';
      ctx.fillRect(q.x - S / 2, q.y - S / 2, S, S);
      ctx.fillStyle = '#7a8394'; ctx.font = '600 11px system-ui, sans-serif'; ctx.textAlign = 'left'; ctx.fillText(n, q.x - S / 2 + 4, q.y - S / 2 + 13);
    }
    ctx.fillStyle = '#14213D'; ctx.font = '700 12px system-ui'; ctx.textAlign = 'center'; ctx.fillText('FINISH', cell(100).x, cell(100).y + 12);
    Object.entries(LADDERS).forEach(([a, b]) => drawLadder(+a, b));
    Object.entries(SNAKES).forEach(([a, b], i) => drawSnake(+a, b, SN_COL[i % SN_COL.length]));
    players.forEach((p, i) => {
      p.x += (p.tx - p.x) * 0.25; p.y += (p.ty - p.y) * 0.25;
      const x = p.x + OFF[i][0], y = p.y + OFF[i][1];
      ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(x, y + 9, 9, 3, 0, 0, 7); ctx.fill();
      ctx.fillStyle = p.color; ctx.strokeStyle = '#14213D'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 9, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.font = '700 9px system-ui'; ctx.textAlign = 'center'; ctx.fillText(i ? 'B' + i : '★', x, y + 3);
    });
    raf = requestAnimationFrame(draw);
  }
  draw();
  async function move(i, d) {
    const p = players[i];
    if (p.pos + d > 100) { if (!i) msg(`You rolled ${d}. You need exactly ${100 - p.pos} to finish.`); return; }
    for (let k = 0; k < d; k++) { p.pos++; setT(i, p.pos); await sleep(140); if (!alive) return; }
    if (LADDERS[p.pos]) {
      await sleep(150); p.pos = LADDERS[p.pos]; setT(i, p.pos); api.sfx('up');
      if (!i) { api.gain(5, 'ladder'); msg(`A ladder! You climbed to ${p.pos}.`); }
      await sleep(500);
    } else if (SNAKES[p.pos]) {
      if (!i) {
        msg(`Uh oh, a snake at ${p.pos}!`);
        const ok = await api.ask('rescue', { title: 'Snake ahead!', sub: `You landed on a snake at square ${p.pos}. Answer correctly to escape it.` });
        if (!alive) return;
        if (ok) { msg('You escaped the snake! 🎉'); api.toast('You escaped the snake!'); return; }
        api.lose(10, 'snake');
      }
      p.pos = SNAKES[p.pos]; setT(i, p.pos);
      if (!i) msg(`The snake took you down to ${p.pos}.`);
      await sleep(600);
    }
  }
  async function roundWon(i) {
    if (!i) { api.gain(60, 'win'); api.won(); msg('You reached 100! <b>+60 coins</b>. A new board starts…'); }
    else { api.lose(15, 'lost round'); msg(`${players[i].name} reached 100 first. −15 coins. A new board starts…`); }
    await sleep(2200); if (!alive) return; round++; reset(); msg(`Round ${round}. Your turn: roll the dice.`);
  }
  async function turn() {
    if (busy || api.busy || api.over) return;
    if (!api.spend(5, 'roll')) return;
    busy = true; setBtn();
    try {
      const d = await rollDie(UI.die, api, () => alive); if (!alive) return;
      msg(`You rolled ${d}.`);
      await move(0, d); if (!alive) return;
      if (players[0].pos === 100) { await roundWon(0); return; }
      for (let b = 1; b < players.length; b++) {
        await sleep(450); if (!alive) return;
        const db = rnd(1, 6); UI.die.textContent = db;
        await move(b, db); if (!alive) return;
        if (players[b].pos === 100) { await roundWon(b); return; }
      }
      const lead = players.slice(1).reduce((m, p) => Math.max(m, p.pos), 0);
      msg(`You're on ${players[0].pos}. ${lead > players[0].pos ? 'The bots are ahead, roll again!' : 'You lead! Roll again.'}`);
    } finally { busy = false; setBtn(); }
  }
  UI.btn.onclick = turn;
  msg('Race Robo Ria and Robo Raj to square 100. Each roll costs 5 coins. Land on a snake and answer to escape!');
  return { destroy() { alive = false; cancelAnimationFrame(raf); } };
} };

/* ======================= LUDO ======================= */
GAMES.ludo = { create(root, api) {
  const C = 40, N = 600;
  const T = []; const add = (x, y) => T.push([x, y]);
  for (let x = 1; x <= 5; x++) add(x, 6); for (let y = 5; y >= 0; y--) add(6, y); add(7, 0); add(8, 0);
  for (let y = 1; y <= 5; y++) add(8, y); for (let x = 9; x <= 14; x++) add(x, 6); add(14, 7); add(14, 8);
  for (let x = 13; x >= 9; x--) add(x, 8); for (let y = 9; y <= 14; y++) add(8, y); add(7, 14); add(6, 14);
  for (let y = 13; y >= 9; y--) add(6, y); for (let x = 5; x >= 0; x--) add(x, 8); add(0, 7); add(0, 6);
  const SAFE = new Set([0, 8, 13, 21, 26, 34, 39, 47]);
  const COLORS = {
    red: { fill: '#d9463b', light: '#f7d4d0', start: 0, yard: [0, 0], home: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7]], end: [6.55, 7.5] },
    green: { fill: '#2e9e5b', light: '#cfeedd', start: 13, yard: [9, 0], home: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5]], end: [7.5, 6.55] },
    yellow: { fill: '#e2a90b', light: '#fbecc0', start: 26, yard: [9, 9], home: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7]], end: [8.45, 7.5] },
    blue: { fill: '#2a6fb0', light: '#d3e3f4', start: 39, yard: [0, 9], home: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9]], end: [7.5, 8.45] }
  };
  const UI = shell(root);
  const { ctx, c, pt } = makeCanvas(UI.cv, N, N);
  let alive = true, raf = 0, seats = [], busy = true, pick = null, pulse = 0, games = 0;
  const st = (t, p) => { if (api.status) api.status(t, p); };
  const msg = t => { UI.msg.innerHTML = t; if (seats.length) { const me = seats[0].t; st(`${me.filter(p => p === 56).length} of 4 tokens home`, me.reduce((m, p) => m + Math.max(0, p), 0) / 224 * 100); } };
  UI.btn.disabled = true;
  // opponent choice
  const choose = document.createElement('div'); choose.className = 'gt-stagebar';
  choose.innerHTML = '<span class="msg"><b>Choose your opponents:</b></span><button class="gt-btn" data-n="1">1 bot (quick game)</button><button class="gt-btn ghost" data-n="3">3 bots</button>';
  root.insertBefore(choose, UI.cv.nextSibling);
  choose.onclick = e => { const b = e.target.closest('[data-n]'); if (!b) return; choose.remove(); newGame(+b.dataset.n); };
  function newGame(nb) {
    games++;
    const order = nb === 1 ? ['red', 'yellow'] : ['red', 'green', 'yellow', 'blue'];
    const names = { red: 'You', green: 'Robo Gita', yellow: 'Robo Yash', blue: 'Robo Bala' };
    seats = order.map(k => Object.assign({ key: k, name: names[k], t: [-1, -1, -1, -1], d: [null, null, null, null] }, COLORS[k]));
    seats.nb = nb; busy = false; UI.btn.disabled = false;
    msg(games > 1 ? 'New game! Your turn: roll the dice.' : 'You are <b style="color:#d9463b">red</b>. Roll a 6 to bring a token out. Each roll costs 5 coins.');
  }
  const abs = (s, p) => (s.start + p) % 52;
  function spot(s, k) {
    const p = s.t[k];
    if (p < 0) { const [x0, y0] = s.yard; return [x0 + (k % 2 ? 4 : 2), y0 + (k < 2 ? 2 : 4)]; }
    if (p <= 50) { const [x, y] = T[abs(s, p)]; return [x + 0.5, y + 0.5]; }
    if (p <= 55) { const [x, y] = s.home[p - 51]; return [x + 0.5, y + 0.5]; }
    return [s.end[0] + (k % 2 ? .25 : -.25) * (s.key === 'red' || s.key === 'yellow' ? 0 : 1), s.end[1] + (k < 2 ? -.25 : .25) * (s.key === 'green' || s.key === 'blue' ? 0 : 1)];
  }
  function draw() {
    if (!alive) return;
    pulse += 0.08;
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, N, N);
    Object.values(COLORS).forEach(col => {
      const [x0, y0] = col.yard; ctx.fillStyle = col.fill; ctx.fillRect(x0 * C, y0 * C, 6 * C, 6 * C);
      ctx.fillStyle = '#fff'; rr(ctx, (x0 + 1) * C, (y0 + 1) * C, 4 * C, 4 * C, 14); ctx.fill();
      [[2, 2], [4, 2], [2, 4], [4, 4]].forEach(([a, b]) => { ctx.fillStyle = col.light; ctx.beginPath(); ctx.arc((x0 + a) * C, (y0 + b) * C, C * 0.62, 0, 7); ctx.fill(); });
      col.home.forEach(([x, y]) => { ctx.fillStyle = col.fill; ctx.fillRect(x * C, y * C, C, C); });
      const [sx, sy] = T[col.start]; ctx.fillStyle = col.fill; ctx.fillRect(sx * C, sy * C, C, C);
    });
    ctx.strokeStyle = '#c9cfd8'; ctx.lineWidth = 1;
    T.forEach(([x, y], i) => { ctx.strokeRect(x * C + .5, y * C + .5, C - 1, C - 1); if (SAFE.has(i) && ![0, 13, 26, 39].includes(i)) { ctx.fillStyle = '#9aa3b2'; ctx.font = '22px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('★', x * C + C / 2, y * C + C / 2 + 1); } });
    Object.values(COLORS).forEach(col => col.home.forEach(([x, y]) => ctx.strokeRect(x * C + .5, y * C + .5, C - 1, C - 1)));
    const m = [7.5 * C, 7.5 * C], tri = (col, a, b) => { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(m[0], m[1]); ctx.lineTo(a[0] * C, a[1] * C); ctx.lineTo(b[0] * C, b[1] * C); ctx.closePath(); ctx.fill(); };
    tri(COLORS.red.fill, [6, 6], [6, 9]); tri(COLORS.green.fill, [6, 6], [9, 6]); tri(COLORS.yellow.fill, [9, 6], [9, 9]); tri(COLORS.blue.fill, [6, 9], [9, 9]);
    ctx.textBaseline = 'alphabetic';
    seats.forEach(s => { const [x0, y0] = s.yard; ctx.fillStyle = '#fff'; ctx.font = '700 15px system-ui'; ctx.textAlign = 'center'; ctx.fillText(s.name, (x0 + 3) * C, (y0 + 0.68) * C); });
    // tokens, with stacking offsets
    const groups = {};
    seats.forEach((s, si) => s.t.forEach((p, k) => { const [x, y] = spot(s, k); const key = p >= 0 && p <= 55 ? x + ',' + y : si + ':' + k; (groups[key] = groups[key] || []).push([si, k, x, y]); }));
    Object.values(groups).forEach(g => g.forEach(([si, k, x, y], j) => {
      const s = seats[si], off = g.length > 1 ? (j - (g.length - 1) / 2) * 0.22 : 0;
      const tx = (x + off) * C, ty = (y + (g.length > 1 ? -off * 0.4 : 0)) * C;
      if (!s.d[k]) s.d[k] = [tx, ty];
      s.d[k][0] += (tx - s.d[k][0]) * 0.3; s.d[k][1] += (ty - s.d[k][1]) * 0.3;
      const [dx, dy] = s.d[k], R = C * (s.t[k] === 56 ? 0.22 : 0.32);
      if (pick && si === 0 && pick.mv.includes(k)) { ctx.strokeStyle = 'rgba(245,166,35,' + (0.55 + 0.45 * Math.sin(pulse * 2)) + ')'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(dx, dy, R + 6, 0, 7); ctx.stroke(); }
      ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(dx, dy + R * 0.9, R * 0.9, R * 0.3, 0, 0, 7); ctx.fill();
      ctx.fillStyle = s.fill; ctx.strokeStyle = '#14213D'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(dx, dy, R, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.beginPath(); ctx.arc(dx, dy, R * 0.45, 0, 7); ctx.fill();
    }));
    raf = requestAnimationFrame(draw);
  }
  draw();
  const movable = (s, d) => s.t.map((p, k) => ((p < 0 && d === 6) || (p >= 0 && p + d <= 56) ? k : -1)).filter(k => k >= 0);
  const victimsAt = (si, a) => { const out = []; if (SAFE.has(a)) return out; seats.forEach((o, oi) => { if (oi !== si) o.t.forEach((p, j) => { if (p >= 0 && p <= 50 && abs(o, p) === a) out.push([oi, j]); }); }); return out; };
  async function doMove(si, k, d) {
    const s = seats[si]; let extra = false;
    if (s.t[k] < 0) { s.t[k] = 0; api.sfx('up'); await sleep(250); }
    else for (let i = 0; i < d; i++) { s.t[k]++; await sleep(120); if (!alive) return false; }
    const p = s.t[k];
    if (p === 56) { extra = true; if (!si) { api.gain(15, 'token home'); msg('A token reached home! <b>+15 coins</b> and a bonus roll.'); } }
    if (p <= 50) {
      for (const [oi, j] of victimsAt(si, abs(s, p))) {
        const o = seats[oi];
        if (oi === 0) {
          msg(`${s.name} is about to capture your token!`);
          const ok = await api.ask('rescue', { title: 'Defend your token!', sub: `${s.name} landed on your token. Answer correctly to protect it.` });
          if (!alive) return false;
          if (ok) { api.toast('Shield up! Your token is safe.'); msg('You defended your token. 🛡'); continue; }
          api.lose(10, 'captured'); msg('Your token was captured and sent back to the yard.');
        } else if (!si) { api.gain(10, 'capture'); msg(`You captured ${o.name}’s token! <b>+10 coins</b> and a bonus roll.`); }
        o.t[j] = -1; extra = true; api.sfx('hit');
      }
    }
    return extra;
  }
  function botChoice(si, mv, d) {
    const s = seats[si];
    let best = mv[0], bs = -1e9;
    mv.forEach(k => {
      const p = s.t[k], np = p < 0 ? 0 : p + d; let sc = Math.random() * 3 + np * 0.3;
      if (np === 56) sc += 60; if (p < 0) sc += 40;
      if (np <= 50) { const a = abs(s, np); if (victimsAt(si, a).length) sc += 70; if (SAFE.has(a)) sc += 12; } else sc += 25;
      if (sc > bs) { bs = sc; best = k; }
    });
    return best;
  }
  async function gameWon(si) {
    busy = true; UI.btn.disabled = true;
    if (!si) { api.gain(80, 'win'); api.won(); msg('🏆 All four tokens home. You win! <b>+80 coins</b>. New game soon…'); }
    else { api.lose(20, 'lost game'); msg(`${seats[si].name} got all tokens home first. −20 coins. New game soon…`); }
    await sleep(2600); if (alive) newGame(seats.nb);
  }
  async function after(si, d, extra) {
    if (!alive) return;
    if (seats[si].t.every(p => p === 56)) { await gameWon(si); return; }
    if (d === 6 || extra) { if (!si) { busy = false; UI.btn.disabled = false; msg((d === 6 ? 'You rolled a 6: ' : '') + 'bonus roll! Roll again.'); return; } await botTurn(si); return; }
    const nx = (si + 1) % seats.length;
    if (!nx) { busy = false; UI.btn.disabled = false; msg('Your turn. Roll the dice.'); return; }
    await botTurn(nx);
  }
  async function botTurn(si) {
    await sleep(500); if (!alive) return;
    const d = rnd(1, 6); UI.die.textContent = d; UI.die.style.borderColor = seats[si].fill;
    const mv = movable(seats[si], d);
    if (!mv.length) { await after(si, d === 6 ? 0 : d, false); return; }
    const extra = await doMove(si, botChoice(si, mv, d), d);
    await after(si, d, extra);
  }
  root.__ludo = { get seats() { return seats; }, get pick() { return pick; } };
  function pickToken(mv) { return new Promise(res => { pick = { mv, res }; }); }
  c.addEventListener('click', e => {
    if (!pick) return;
    const p = pt(e), s = seats[0];
    let best = -1, bd = C * 0.8;
    pick.mv.forEach(k => { const [x, y] = s.d[k] || [0, 0]; const dd = Math.hypot(p.x - x, p.y - y); if (dd < bd) { bd = dd; best = k; } });
    if (best >= 0) { const r = pick.res; pick = null; c.style.cursor = ''; r(best); }
  });
  UI.btn.onclick = async () => {
    if (busy || api.busy || api.over || !seats.length) return;
    if (!api.spend(5, 'roll')) return;
    busy = true; UI.btn.disabled = true; UI.die.style.borderColor = '';
    const d = await rollDie(UI.die, api, () => alive); if (!alive) return;
    const mv = movable(seats[0], d);
    if (!mv.length) { msg(`You rolled ${d}. ${seats[0].t.every(p => p < 0) ? 'You need a 6 to bring a token out.' : 'No move possible.'}`); await sleep(900); await after(0, d === 6 ? 0 : d, false); return; }
    let k = mv[0];
    const distinct = new Set(mv.map(j => seats[0].t[j])).size;
    if (distinct > 1) { msg(`You rolled ${d}. Tap a glowing token to move it.`); c.style.cursor = 'pointer'; k = await pickToken(mv); if (!alive) return; }
    const extra = await doMove(0, k, d);
    await after(0, d, extra);
  };
  msg('Pick how many bots you want to play against.');
  return { destroy() { alive = false; cancelAnimationFrame(raf); if (pick) pick.res(0); } };
} };

/* ======================= JUMP QUEST ======================= */
GAMES.jump = { create(root, api) {
  const VW = 640, VH = 360, TS = 30, ROWS = 12;
  root.innerHTML = `<div class="cv" style="position:relative"></div><div class="gt-pad"><button data-k="L" aria-label="Move left">◀</button><button data-k="R" aria-label="Move right">▶</button><button class="j" data-k="J" aria-label="Jump">⤒ Jump</button></div><div class="gt-stagebar"><button class="gt-btn gold" data-act="go">Start level 1 · 10 coins</button><div class="msg"></div></div>`;
  const cv = root.querySelector('.cv'), goBtn = root.querySelector('[data-act=go]'), msgEl = root.querySelector('.msg');
  const { ctx } = makeCanvas(cv, VW, VH);
  const st = (t, p) => { if (api.status) api.status(t, p); };
  const msg = t => { msgEl.innerHTML = t; st(level ? `Level ${level}${running ? ' · playing' : ' · cleared'}` : 'Starting', Math.min(100, level * 20)); };
  let alive = true, raf = 0, last = 0, level = 0, running = false, paused = false, t0 = 0;
  let grid = [], W = 0, enemies = [], pl = null, check = null, flagX = 0, camX = 0, inv = 0, sparks = [];
  const keys = { L: false, R: false, J: false }; let jumpBuf = 0, coyote = 0, jumpHeld = false;
  const SOLID = '#BPQU';
  const at = (tx, ty) => (ty < 0 || ty >= ROWS ? '.' : tx < 0 || tx >= W ? '#' : grid[ty][tx]);
  const solid = (tx, ty) => ty >= 0 && ty < ROWS && SOLID.includes(at(tx, ty));
  function gen(lv) {
    W = 100 + lv * 25; grid = Array.from({ length: ROWS }, () => Array(W).fill('.')); enemies = [];
    const ground = (a, b) => { for (let x = a; x <= b && x < W; x++) { grid[10][x] = '#'; grid[11][x] = '#'; } };
    ground(0, 9); let x = 10, crateAt = 16, checkPlaced = false;
    while (x < W - 16) {
      if (Math.random() < 0.24 + lv * 0.02) {
        const g = 2 + (Math.random() < 0.25 + lv * 0.05 ? 1 : 0);
        grid[7][x + Math.floor(g / 2)] = 'o'; x += g; continue;
      }
      const len = rnd(5, 9); ground(x, x + len - 1);
      if (!checkPlaced && x > W / 2) { grid[9][x + 1] = 'C'; check = null; checkPlaced = true; }
      else {
        if (Math.random() < 0.4 + lv * 0.05) enemies.push({ x: (x + Math.floor(len / 2)) * TS, y: 10 * TS - 18, w: 24, h: 18, vx: Math.random() < 0.5 ? -45 - lv * 6 : 45 + lv * 6, alive: true, ph: Math.random() * 6 });
        else if (Math.random() < 0.35) grid[9][x + rnd(2, len - 3)] = 'S';
        if (Math.random() < 0.22) { const px = x + rnd(1, len - 3); grid[9][px] = 'P'; if (Math.random() < 0.5) grid[8][px] = 'P'; grid[Math.random() < .5 ? 7 : 6][px] = 'o'; }
      }
      if (x >= crateAt) { const cx = x + rnd(1, len - 2); if (grid[9][cx] === '.') { grid[7][cx] = 'Q'; crateAt = x + rnd(16, 24); } }
      else if (Math.random() < 0.35 && len >= 6) { const px = x + 1, pw = rnd(3, 4); for (let i = 0; i < pw; i++) { grid[6][px + i] = 'B'; grid[5][px + i] = 'o'; } }
      else for (let i = 1; i < len - 1; i += 2) if (Math.random() < 0.3 && grid[9][x + i] === '.') grid[8][x + i] = 'o';
      x += len;
    }
    ground(x, W - 1); flagX = (W - 6) * TS; grid[9][W - 6] = 'F';
    pl = { x: 2 * TS, y: 10 * TS - 26, w: 22, h: 26, vx: 0, vy: 0, on: false, face: 1, walk: 0 };
    check = { x: pl.x, y: pl.y }; camX = 0; inv = 0; sparks = [];
  }
  function startLevel() {
    if (running || api.busy || api.over) return;
    if (!api.spend(10, 'level')) return;
    level++; gen(level); running = true; paused = false; t0 = performance.now();
    goBtn.hidden = true; msg(`<b>Level ${level}.</b> Collect coins, open ⭐ quiz crates from below, stomp bugs. Reach the finish flag!`);
  }
  goBtn.onclick = startLevel;
  root.__jump = { get pl() { return pl; }, get grid() { return grid; }, get enemies() { return enemies; }, get flagX() { return flagX; } };
  async function hurt(kind, enemy) {
    if (paused || inv > 0) return;
    paused = true; api.sfx('hit'); keys.L = keys.R = keys.J = false;
    const ok = await api.ask('rescue', { title: kind === 'fall' ? 'You fell!' : kind === 'spike' ? 'Spikes!' : 'A bug got you!', sub: 'Answer correctly to save your life.' });
    if (!alive) return;
    if (ok) {
      api.toast(enemy ? 'Your answer zapped the bug!' : 'Saved! Back to the checkpoint.');
      if (enemy) enemy.alive = false;
    } else api.lose(10, kind === 'enemy' ? 'bug' : kind);
    if (kind !== 'enemy') { pl.x = check.x; pl.y = check.y; pl.vx = pl.vy = 0; }
    else if (!ok) { pl.vx = -pl.face * 160; pl.vy = -300; }
    inv = 1.6; paused = false; last = performance.now();
  }
  async function crate(tx, ty) {
    grid[ty][tx] = 'U'; paused = true; keys.L = keys.R = keys.J = false;
    for (let i = 0; i < 6; i++) sparks.push({ x: tx * TS + 15, y: ty * TS, vx: (Math.random() - .5) * 160, vy: -120 - Math.random() * 120, life: .7 });
    await api.ask('bonus', {});
    if (!alive) return; paused = false; last = performance.now();
  }
  async function finish() {
    running = false; api.gain(40, 'level'); api.won();
    msg(`🏁 Level ${level} complete in ${Math.round((performance.now() - t0) / 1000)} s! <b>+40 coins</b>. Levels get longer and trickier.`);
    goBtn.textContent = `Start level ${level + 1} · 10 coins`; goBtn.hidden = false;
  }
  function update(dt) {
    const ACC = 1500, RUN = 200, G = 1500, JV = 560;
    if (keys.L && !keys.R) { pl.vx = Math.max(-RUN, pl.vx - ACC * dt); pl.face = -1; }
    else if (keys.R && !keys.L) { pl.vx = Math.min(RUN, pl.vx + ACC * dt); pl.face = 1; }
    else { const f = 1700 * dt; pl.vx = Math.abs(pl.vx) <= f ? 0 : pl.vx - Math.sign(pl.vx) * f; }
    jumpBuf = keys.J && !jumpHeld ? 0.12 : Math.max(0, jumpBuf - dt); jumpHeld = keys.J;
    coyote = pl.on ? 0.09 : Math.max(0, coyote - dt);
    if (jumpBuf > 0 && coyote > 0) { pl.vy = -JV; jumpBuf = 0; coyote = 0; pl.on = false; api.sfx('jump'); }
    if (!keys.J && pl.vy < -220) pl.vy = -220;
    pl.vy = Math.min(900, pl.vy + G * dt);
    // X
    pl.x += pl.vx * dt;
    let y0 = Math.floor(pl.y / TS), y1 = Math.floor((pl.y + pl.h - 1) / TS);
    if (pl.vx > 0) { const tx = Math.floor((pl.x + pl.w) / TS); for (let ty = y0; ty <= y1; ty++) if (solid(tx, ty)) { pl.x = tx * TS - pl.w - 0.01; pl.vx = 0; break; } }
    else if (pl.vx < 0) { const tx = Math.floor(pl.x / TS); for (let ty = y0; ty <= y1; ty++) if (solid(tx, ty)) { pl.x = (tx + 1) * TS + 0.01; pl.vx = 0; break; } }
    if (pl.x < 0) pl.x = 0;
    // Y
    pl.y += pl.vy * dt; pl.on = false;
    const x0 = Math.floor(pl.x / TS), x1 = Math.floor((pl.x + pl.w - 1) / TS);
    if (pl.vy > 0) { const ty = Math.floor((pl.y + pl.h) / TS); for (let tx = x0; tx <= x1; tx++) if (solid(tx, ty)) { pl.y = ty * TS - pl.h; pl.vy = 0; pl.on = true; break; } }
    else if (pl.vy < 0) {
      const ty = Math.floor(pl.y / TS);
      for (let tx = x0; tx <= x1; tx++) if (solid(tx, ty)) {
        pl.y = (ty + 1) * TS; pl.vy = 0;
        const cx = Math.floor((pl.x + pl.w / 2) / TS), hit = at(cx, ty) === 'Q' ? cx : at(tx, ty) === 'Q' ? tx : -1;
        if (hit >= 0) crate(hit, ty);
        break;
      }
    }
    pl.walk += Math.abs(pl.vx) * dt;
    // pickups and hazards
    const cx0 = Math.floor(pl.x / TS), cx1 = Math.floor((pl.x + pl.w) / TS), cy0 = Math.floor(pl.y / TS), cy1 = Math.floor((pl.y + pl.h) / TS);
    for (let ty = cy0; ty <= cy1; ty++) for (let tx = cx0; tx <= cx1; tx++) {
      const ch = at(tx, ty);
      if (ch === 'o') { grid[ty][tx] = '.'; api.gain(1, ''); }
      else if (ch === 'C' && check.x < tx * TS) { check = { x: tx * TS, y: 10 * TS - pl.h }; api.toast('Checkpoint reached!'); api.sfx('up'); }
      else if (ch === 'S' && pl.y + pl.h > ty * TS + 14 && inv <= 0) { hurt('spike'); return; }
    }
    if (pl.y > ROWS * TS + 30) { hurt('fall'); return; }
    if (pl.x >= flagX) { finish(); return; }
    // enemies
    enemies.forEach(e => {
      if (!e.alive) return;
      if (Math.abs(e.x - pl.x) > VW) return;
      e.x += e.vx * dt; e.ph += dt * 10;
      const front = e.vx > 0 ? e.x + e.w : e.x, ftx = Math.floor(front / TS);
      if (!solid(ftx, 10) || solid(ftx, 9)) { e.vx = -e.vx; e.x += e.vx * dt * 2; }
      if (pl.x < e.x + e.w && pl.x + pl.w > e.x && pl.y < e.y + e.h && pl.y + pl.h > e.y) {
        if (pl.vy > 0 && pl.y + pl.h - e.y < 14) { e.alive = false; pl.vy = -380; api.gain(3, 'stomp'); for (let i = 0; i < 5; i++) sparks.push({ x: e.x + 12, y: e.y + 9, vx: (Math.random() - .5) * 200, vy: -Math.random() * 200, life: .5 }); }
        else if (inv <= 0) hurt('enemy', e);
      }
    });
    if (inv > 0) inv -= dt;
    camX = Math.max(0, Math.min(W * TS - VW, pl.x - VW * 0.38));
  }
  function drawRobot(x, y) {
    if (inv > 0 && Math.floor(inv * 12) % 2) return;
    const f = pl.face, step = pl.on ? Math.sin(pl.walk / 7) * 3 : 0;
    ctx.fillStyle = '#14213D'; ctx.fillRect(x + 3, y + 21 + Math.max(0, step), 6, 5); ctx.fillRect(x + 13, y + 21 + Math.max(0, -step), 6, 5);
    ctx.strokeStyle = '#14213D'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 11, y + 3); ctx.lineTo(x + 11 - f * 3, y - 5); ctx.stroke();
    ctx.fillStyle = '#f5a623'; ctx.beginPath(); ctx.arc(x + 11 - f * 3, y - 6, 3, 0, 7); ctx.fill();
    ctx.fillStyle = '#1f9e8f'; rr(ctx, x, y + 2, 22, 20, 7); ctx.fill(); ctx.strokeStyle = '#0f5e55'; ctx.stroke();
    ctx.fillStyle = '#14213D'; rr(ctx, x + 3 + (f > 0 ? 3 : 0), y + 6, 13, 8, 3); ctx.fill();
    ctx.fillStyle = '#7ff0e2'; ctx.fillRect(x + 6 + (f > 0 ? 3 : 0), y + 8, 3, 4); ctx.fillRect(x + 11 + (f > 0 ? 3 : 0), y + 8, 3, 4);
  }
  function draw(now) {
    const sky = ctx.createLinearGradient(0, 0, 0, VH); sky.addColorStop(0, '#bfe3f5'); sky.addColorStop(1, '#f2f9fc');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, VW, VH);
    ctx.fillStyle = '#d7ecef'; for (let i = -1; i < 6; i++) { const hx = i * 260 - (camX * 0.25) % 260; ctx.beginPath(); ctx.arc(hx + 130, 330, 150, Math.PI, 0); ctx.fill(); }
    ctx.fillStyle = '#fff'; for (let i = -1; i < 5; i++) { const cx = i * 220 - (camX * 0.1) % 220 + 60; ctx.beginPath(); ctx.arc(cx, 60, 18, 0, 7); ctx.arc(cx + 22, 52, 22, 0, 7); ctx.arc(cx + 46, 62, 16, 0, 7); ctx.fill(); }
    if (!grid.length) return;
    const ox = -Math.round(camX), tx0 = Math.max(0, Math.floor(camX / TS) - 1), tx1 = Math.min(W - 1, tx0 + Math.ceil(VW / TS) + 2);
    for (let ty = 0; ty < ROWS; ty++) for (let tx = tx0; tx <= tx1; tx++) {
      const ch = grid[ty][tx], X = tx * TS + ox, Y = ty * TS;
      if (ch === '#') { const top = !solid(tx, ty - 1); ctx.fillStyle = ty === 10 ? '#c77d4a' : '#a8643a'; ctx.fillRect(X, Y, TS, TS); if (top) { ctx.fillStyle = '#e9c27a'; ctx.fillRect(X, Y, TS, 7); } ctx.fillStyle = 'rgba(0,0,0,.08)'; ctx.fillRect(X + 4, Y + 14, 6, 4); ctx.fillRect(X + 18, Y + 21, 5, 3); }
      else if (ch === 'B' || ch === 'P') { ctx.fillStyle = '#2f4b7c'; ctx.fillRect(X, Y, TS, TS); ctx.fillStyle = '#4b6aa0'; ctx.fillRect(X + 2, Y + 2, TS - 4, 5); ctx.strokeStyle = '#1d3155'; ctx.lineWidth = 1; ctx.strokeRect(X + .5, Y + .5, TS - 1, TS - 1); }
      else if (ch === 'Q' || ch === 'U') { ctx.fillStyle = ch === 'Q' ? '#f5a623' : '#b9a98c'; rr(ctx, X + 1, Y + 1, TS - 2, TS - 2, 5); ctx.fill(); ctx.strokeStyle = '#7a4c06'; ctx.lineWidth = 2; ctx.stroke(); if (ch === 'Q') { ctx.fillStyle = '#fff'; ctx.font = '700 18px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('⭐', X + TS / 2, Y + TS / 2 + 1 + Math.sin(now / 250) * 1.5); ctx.textBaseline = 'alphabetic'; } }
      else if (ch === 'S') { ctx.fillStyle = '#8b95a5'; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(X + k * 10, Y + TS); ctx.lineTo(X + k * 10 + 5, Y + 12); ctx.lineTo(X + k * 10 + 10, Y + TS); ctx.fill(); } }
      else if (ch === 'o') { const b = Math.sin(now / 200 + tx) * 2; ctx.fillStyle = '#f5a623'; ctx.beginPath(); ctx.ellipse(X + 15, Y + 15 + b, 7, 8, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#ffe4a3'; ctx.fillRect(X + 13, Y + 10 + b, 3, 8); }
      else if (ch === 'C') { ctx.fillStyle = '#5b6475'; ctx.fillRect(X + 13, Y - 30, 3, 60); ctx.fillStyle = check && check.x >= tx * TS ? '#1f9e8f' : '#ff8a65'; ctx.beginPath(); ctx.moveTo(X + 16, Y - 30); ctx.lineTo(X + 34, Y - 22); ctx.lineTo(X + 16, Y - 14); ctx.fill(); }
      else if (ch === 'F') { ctx.fillStyle = '#14213D'; ctx.fillRect(X + 13, Y - 150, 4, 180); ctx.fillStyle = '#f5a623'; ctx.fillRect(X + 17, Y - 150, 54, 30); ctx.fillStyle = '#14213D'; ctx.font = '700 12px system-ui'; ctx.textAlign = 'left'; ctx.fillText('FINISH', X + 21, Y - 131); }
    }
    enemies.forEach(e => {
      if (!e.alive) return; const X = e.x + ox; if (X < -40 || X > VW + 40) return;
      ctx.strokeStyle = '#3b1d4a'; ctx.lineWidth = 2; for (let k = 0; k < 3; k++) { const lx = X + 5 + k * 7, sw = Math.sin(e.ph + k) * 3; ctx.beginPath(); ctx.moveTo(lx, e.y + 12); ctx.lineTo(lx + sw, e.y + e.h); ctx.stroke(); }
      ctx.fillStyle = '#6b2f8a'; ctx.beginPath(); ctx.ellipse(X + 12, e.y + 9, 12, 9, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(X, e.y + 8, 24, 5);
      ctx.fillStyle = '#fff'; const ex = e.vx > 0 ? 15 : 5; ctx.beginPath(); ctx.arc(X + ex, e.y + 6, 3, 0, 7); ctx.arc(X + ex + 5, e.y + 6, 3, 0, 7); ctx.fill();
      ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(X + ex + (e.vx > 0 ? 1 : -1), e.y + 6, 1.4, 0, 7); ctx.arc(X + ex + 5 + (e.vx > 0 ? 1 : -1), e.y + 6, 1.4, 0, 7); ctx.fill();
    });
    sparks.forEach(s => { ctx.fillStyle = `rgba(245,166,35,${Math.max(0, s.life * 1.4)})`; ctx.fillRect(s.x + ox - 2, s.y - 2, 4, 4); });
    if (pl) drawRobot(Math.round(pl.x + ox), Math.round(pl.y));
    // progress bar
    ctx.fillStyle = 'rgba(20,33,61,.15)'; rr(ctx, 12, 12, 200, 10, 5); ctx.fill();
    ctx.fillStyle = '#1f9e8f'; rr(ctx, 12, 12, Math.max(10, 200 * Math.min(1, pl.x / flagX)), 10, 5); ctx.fill();
    ctx.fillStyle = '#14213D'; ctx.font = '700 13px system-ui'; ctx.textAlign = 'left'; ctx.fillText('Level ' + level, 222, 22);
  }
  function drawIntro() {
    draw(performance.now());
    ctx.fillStyle = 'rgba(20,33,61,.78)'; rr(ctx, 120, 70, 400, 210, 18); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.font = '700 26px system-ui'; ctx.fillText(level ? `Level ${level} complete!` : 'Jump Quest', 320, 115);
    ctx.font = '15px system-ui'; ctx.fillStyle = '#dfe5f1';
    ['Move: ← → or A D (or the buttons)', 'Jump: ↑, W or Space', '⭐ crates: hit from below for a bonus question', 'Bugs, spikes and gaps: answer to save a life'].forEach((t, i) => ctx.fillText(t, 320, 150 + i * 26));
    pl = pl || { x: 290, y: 250, w: 22, h: 26, face: 1, on: true, walk: 0 }; drawRobot(298, 228 + 18);
  }
  function loop(now) {
    if (!alive) return;
    const dt = Math.min(1 / 30, (now - (last || now)) / 1000); last = now;
    if (running) { if (!paused && !api.busy) update(dt); sparks.forEach(s => { s.x += s.vx * dt; s.y += s.vy * dt; s.vy += 600 * dt; s.life -= dt; }); sparks = sparks.filter(s => s.life > 0); if (running) draw(now); else drawIntro(); }
    else drawIntro();
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame(loop);
  const KM = { ArrowLeft: 'L', a: 'L', A: 'L', ArrowRight: 'R', d: 'R', D: 'R', ArrowUp: 'J', w: 'J', W: 'J', ' ': 'J' };
  const kd = e => { if (api.busy || !KM[e.key] || /INPUT|TEXTAREA|SELECT/.test(document.activeElement && document.activeElement.tagName)) return; if (running) e.preventDefault(); keys[KM[e.key]] = true; };
  const ku = e => { if (KM[e.key]) keys[KM[e.key]] = false; };
  window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
  root.querySelectorAll('.gt-pad button').forEach(b => {
    const k = b.dataset.k, on = e => { e.preventDefault(); keys[k] = true; }, off = e => { e.preventDefault(); keys[k] = false; };
    b.addEventListener('pointerdown', on); b.addEventListener('pointerup', off); b.addEventListener('pointerleave', off); b.addEventListener('pointercancel', off);
    b.addEventListener('contextmenu', e => e.preventDefault());
  });
  msg('Help Jugg the robot reach the finish flag. Each level costs 10 coins; finishing pays 40.');
  return { destroy() { alive = false; cancelAnimationFrame(raf); window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); } };
} };
})();
