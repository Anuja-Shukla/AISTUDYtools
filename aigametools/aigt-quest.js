/* AIgametools: Campus Quest, an original side-scrolling platform game.
   Hero: Vidya, a student. 4 worlds (Library, Science Lab, Market, Exam Hall), 2 levels + a boss each.
   Quiz crates give power-ups, hits are saved by answering, bosses are beaten by answering. */
(function () {
'use strict';
const GAMES = window.AIGT_GAMES = window.AIGT_GAMES || {};
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

const TH = [
  { name: 'Library', em: '📚', sky: ['#f6e7c8', '#fdf6e8'], far: '#e6d2ab', ground: '#8b5a2b', top: '#c99a5b', walker: 'A Doze blob', flyer: 'A paper bat', spike: 'Sharp pencils', fall: 'You fell off the shelf!', boss: { name: 'Snoozer the Owl', kind: 'owl', col: '#8a6a45' } },
  { name: 'Science Lab', em: '🧪', sky: ['#d6ecf3', '#f3fafc'], far: '#c2dbe4', ground: '#5f6f80', top: '#a3b4c3', walker: 'A glitch bot', flyer: 'A buzz drone', spike: 'Broken glass', fall: 'You fell into the acid!', boss: { name: 'Error 404', kind: 'robot', col: '#c8432b' } },
  { name: 'Market', em: '🛒', sky: ['#ffd6a3', '#fff3e0'], far: '#f2b878', ground: '#9a4f2a', top: '#e07b39', walker: 'A rush cart', flyer: 'A spam drone', spike: 'Loose nails', fall: 'You slipped off the stalls!', boss: { name: 'Mega Cart', kind: 'cart', col: '#2a6fb0' } },
  { name: 'Exam Hall', em: '📝', sky: ['#1d2b4f', '#3a4d7a'], far: '#2b3c63', ground: '#3d4a63', top: '#8a9bc0', walker: 'An eraser', flyer: 'A doubt cloud', spike: 'Ink spikes', fall: 'You fell behind!', boss: { name: 'The Deadline', kind: 'clock', col: '#8e44ad' }, dark: true }
];
const POWERS = {
  chai: { em: '☕', name: 'Chai power: run faster', t: 12 },
  bulb: { em: '💡', name: 'Bright idea: double jump', t: 15 },
  book: { em: '📘', name: 'Book shield: blocks one hit', t: 0 },
  magnet: { em: '🧲', name: 'Coin magnet', t: 12 }
};
const SAVE = 'aigt-quest-v1';

GAMES.quest = { create(root, api) {
  const VH = 360, TS = 30, ROWS = 12;
  let VW = 640;
  root.innerHTML = `<div class="cv" style="position:relative"></div><div class="gt-pad"><button data-k="L" aria-label="Move left">◀</button><button data-k="R" aria-label="Move right">▶</button><button class="j" data-k="J" aria-label="Jump">⤒ Jump</button></div><div class="gt-stagebar"><button class="gt-btn gold" data-act="go"></button><button class="gt-btn ghost sm" data-act="restart" hidden>Start again from World 1</button><div class="msg"></div></div>`;
  const cv = root.querySelector('.cv'), goBtn = root.querySelector('[data-act=go]'), resetBtn = root.querySelector('[data-act=restart]'), msgEl = root.querySelector('.msg');
  if ((root.clientWidth || 640) < 560) VW = 420;
  const c = document.createElement('canvas'), dpr = Math.min(2, window.devicePixelRatio || 1);
  c.width = VW * dpr; c.height = VH * dpr; const ctx = c.getContext('2d'); ctx.scale(dpr, dpr); cv.appendChild(c);
  let prog = { s: 0, beat: 0 }; try { prog = Object.assign(prog, JSON.parse(localStorage.getItem(SAVE) || '{}')); } catch (e) {}
  const saveProg = () => { try { localStorage.setItem(SAVE, JSON.stringify(prog)); } catch (e) {} };
  const stageName = s => `${Math.floor(s / 3) + 1}-${s % 3 === 2 ? 'Boss' : s % 3 + 1}`;
  let alive = true, raf = 0, last = 0, mode = 'map', paused = false, stage = 0, th = TH[0], t0 = 0;
  let grid = [], W = 0, ents = [], movers = [], shots = [], sparks = [], items = [], pl = null, check = null, gateX = 0, camX = 0, inv = 0, hearts = 3, boss = null;
  const pw = { chai: 0, bulb: 0, book: 0, magnet: 0 }; let airJumps = 0;
  const keys = { L: false, R: false, J: false }; let jumpBuf = 0, coyote = 0, jumpHeld = false;
  const SOLID = '#BU';
  const at = (tx, ty) => (ty < 0 || ty >= ROWS ? '.' : tx < 0 || tx >= W ? '#' : grid[ty][tx]);
  const solid = (tx, ty) => ty >= 0 && ty < ROWS && (SOLID.includes(at(tx, ty)) || at(tx, ty) === 'Q');
  const status = () => { if (api.status) api.status(mode === 'map' ? `Map · next ${stageName(prog.s % 12)}` : `World ${stageName(stage)} · ${'❤'.repeat(Math.max(0, hearts))}`, (prog.s % 12) / 12 * 100); };
  const msg = t => { msgEl.innerHTML = t; status(); };

  /* ---------- levels ---------- */
  function gen(s) {
    const w = Math.floor(s / 3), l = s % 3, diff = w * 2 + l;
    th = TH[w]; W = 95 + diff * 12; grid = Array.from({ length: ROWS }, () => Array(W).fill('.')); ents = []; movers = []; shots = []; items = []; boss = null;
    const ground = (a, b) => { for (let x = a; x <= b && x < W; x++) { grid[10][x] = '#'; grid[11][x] = '#'; } };
    ground(0, 9); let x = 10, crateAt = 14, checkPlaced = false;
    while (x < W - 16) {
      if (Math.random() < 0.22 + diff * 0.015) {
        if (w >= 1 && Math.random() < 0.45) { const g = 5; movers.push({ x: (x + 1) * TS, y: 8 * TS, w: TS * 2, h: 12, a: (x + 0.2) * TS, b: (x + g - 2.2) * TS, v: 55 + w * 10, dx: 0 }); grid[5][x + 2] = 'o'; x += g; continue; }
        const g = 2 + (Math.random() < 0.3 + diff * 0.04 ? 1 : 0); grid[7][x + Math.floor(g / 2)] = 'o'; x += g; continue;
      }
      const len = rnd(5, 9); ground(x, x + len - 1);
      if (!checkPlaced && x > W / 2) { grid[9][x + 1] = 'C'; checkPlaced = true; }
      else {
        const r = Math.random(), mid = (x + Math.floor(len / 2)) * TS;
        if (r < 0.32 + diff * 0.03) ents.push({ k: w >= 2 && Math.random() < 0.35 ? 'run' : 'walk', x: mid, y: 10 * TS - 20, w: 24, h: 20, vx: (Math.random() < 0.5 ? -1 : 1) * (45 + diff * 5) * (w >= 2 && Math.random() < 0.35 ? 1.8 : 1), alive: true, ph: Math.random() * 6 });
        else if (w >= 1 && r < 0.5) ents.push({ k: 'fly', x: mid, y0: rnd(5, 7) * TS, y: 6 * TS, w: 26, h: 18, vx: Math.random() < 0.5 ? -40 : 40, x0: mid - 70, x1: mid + 70, alive: true, ph: Math.random() * 6 });
        else if (r < 0.62) grid[9][x + rnd(2, len - 3)] = 'S';
        if (w >= 2 && Math.random() < 0.25) { const sx = x + rnd(1, len - 2); if (grid[9][sx] === '.') { grid[9][sx] = 'J'; for (let k = 2; k <= 5; k++) grid[k][sx] = 'o'; } }
        if (Math.random() < 0.2) { const px = x + rnd(1, len - 3); if (grid[9][px] === '.') { grid[9][px] = 'B'; if (Math.random() < 0.5) grid[8][px] = 'B'; grid[6][px] = 'o'; } }
      }
      if (x >= crateAt) { const cx = x + rnd(1, len - 2); if (grid[9][cx] === '.' && grid[8][cx] === '.') { grid[7][cx] = 'Q'; crateAt = x + rnd(13, 20); } }
      else if (Math.random() < 0.35 && len >= 6) { const px = x + 1, n = rnd(3, 4); for (let i = 0; i < n; i++) { grid[6][px + i] = 'B'; grid[5][px + i] = 'o'; } }
      else for (let i = 1; i < len - 1; i += 2) if (Math.random() < 0.3 && grid[9][x + i] === '.') grid[8][x + i] = 'o';
      x += len;
    }
    ground(x, W - 1); gateX = (W - 6) * TS; grid[9][W - 6] = 'G';
    spawn();
  }
  function genBoss(s) {
    const w = Math.floor(s / 3); th = TH[w]; W = 28; ents = []; movers = []; shots = []; items = [];
    grid = Array.from({ length: ROWS }, () => Array(W).fill('.'));
    for (let x = 0; x < W; x++) { grid[10][x] = '#'; grid[11][x] = '#'; }
    for (let y = 0; y < 10; y++) { grid[y][0] = '#'; grid[y][W - 1] = '#'; }
    for (let x = 5; x <= 7; x++) grid[6][x] = 'B'; for (let x = 20; x <= 22; x++) grid[6][x] = 'B';
    grid[3][6] = 'Q'; grid[3][21] = 'Q';
    boss = { x: 19 * TS, y: 10 * TS - 64, w: 64, h: 64, vx: 0, hp: 3, max: 3, st: 'intro', t: 1.6, face: -1, flash: 0, sp: 70 + w * 18, dash: 330 + w * 40, dead: 0 };
    gateX = Infinity; spawn();
  }
  function spawn() {
    pl = { x: 2 * TS, y: 10 * TS - 28, w: 20, h: 28, vx: 0, vy: 0, on: false, face: 1, walk: 0, plat: null };
    check = { x: pl.x, y: pl.y }; camX = 0; inv = 0; sparks = []; hearts = 3; airJumps = 0;
  }
  function startStage() {
    if (mode !== 'map' || api.busy || api.over) return;
    if (!api.spend(10, 'stage')) return;
    stage = prog.s % 12; if (stage % 3 === 2) genBoss(stage); else gen(stage);
    mode = 'play'; paused = false; t0 = performance.now(); last = 0;
    Object.keys(pw).forEach(k => { pw[k] = 0; });
    goBtn.hidden = true; resetBtn.hidden = true;
    msg(boss ? `<b>Boss: ${th.boss.name}!</b> Dodge its attacks. When it stops to rest (it glows), jump on it and answer the question to land a hit. 3 hits win.` : `<b>World ${stageName(stage)}: ${th.name}.</b> Hit ⭐ crates from below for power-ups. Reach the gate!`);
  }
  goBtn.onclick = startStage;
  resetBtn.onclick = () => { if (confirm('Start again from World 1-1?')) { prog.s = 0; saveProg(); showMap(); } };
  function showMap(note) {
    mode = 'map'; goBtn.hidden = false;
    const s = prog.s % 12; goBtn.textContent = `Play ${stageName(s)}${s % 3 === 2 ? ' (' + TH[Math.floor(s / 3)].boss.name + ')' : ''} · 10 coins`;
    resetBtn.hidden = prog.s === 0;
    msg(note || 'Guide Vidya through 4 worlds. Each stage costs 10 coins; finishing a level pays 40 and beating a boss pays 80.');
  }

  /* ---------- damage, crates, bosses ---------- */
  async function hurt(kind, e) {
    if (paused || inv > 0 || mode !== 'play') return;
    if (pw.book && kind !== 'fall') { pw.book = 0; inv = 1.5; api.toast('Your book shield blocked the hit!'); api.sfx('up'); if (e && e !== boss) e.alive = false; return; }
    paused = true; api.sfx('hit'); keys.L = keys.R = keys.J = false;
    const title = kind === 'fall' ? th.fall : kind === 'spike' ? th.spike + '!' : kind === 'boss' ? `${th.boss.name} hit you!` : kind === 'shot' ? `${th.boss.name}'s attack hit you!` : (e && e.k === 'fly' ? th.flyer : th.walker) + ' got you!';
    const ok = await api.ask('rescue', { title, sub: 'Answer correctly to keep your heart.' });
    if (!alive) return;
    if (ok) { if (e && e !== boss) e.alive = false; api.toast('Saved! You keep your heart.'); }
    else { hearts--; api.lose(5, 'heart'); }
    if (hearts <= 0) { api.lose(10, 'out of hearts'); api.toast('Out of hearts! Back to the checkpoint.', 2200); hearts = 3; pl.x = check.x; pl.y = check.y; pl.vx = pl.vy = 0; if (boss) { boss.hp = boss.max; boss.st = 'walk'; boss.t = 2; boss.x = 19 * TS; shots = []; } }
    else if (kind === 'fall') { pl.x = check.x; pl.y = check.y; pl.vx = pl.vy = 0; }
    else { pl.vx = -pl.face * 170; pl.vy = -320; }
    inv = 1.6; paused = false; last = 0; status();
  }
  async function crate(tx, ty) {
    grid[ty][tx] = 'U'; paused = true; keys.L = keys.R = keys.J = false;
    for (let i = 0; i < 6; i++) sparks.push({ x: tx * TS + 15, y: ty * TS, vx: (Math.random() - .5) * 160, vy: -120 - Math.random() * 120, life: .7, col: '245,166,35' });
    const ok = await api.ask('bonus', { title: 'Quiz crate: answer for a power-up' });
    if (!alive) return;
    if (ok) {
      const k = ['chai', 'bulb', 'book', 'magnet'][rnd(0, 3)];
      items.push({ k, x: tx * TS + 4, y: ty * TS - 26, life: 1.2 });
      pw[k] = POWERS[k].t || 1; api.toast(POWERS[k].em + ' ' + POWERS[k].name);
    } else api.toast('No power-up this time.');
    paused = false; last = 0;
  }
  async function bossHit() {
    paused = true; keys.L = keys.R = keys.J = false;
    const ok = await api.ask('rescue', { title: `Boss battle: ${th.boss.name}`, sub: 'Answer correctly to land the hit.' });
    if (!alive) return;
    pl.vy = -420; pl.vx = -pl.face * 120;
    if (ok) { boss.hp--; boss.flash = 0.8; api.sfx('up'); for (let i = 0; i < 12; i++) sparks.push({ x: boss.x + 32, y: boss.y + 20, vx: (Math.random() - .5) * 300, vy: -Math.random() * 300, life: .8, col: '255,255,255' }); }
    else api.toast(`${th.boss.name} shrugged it off!`);
    if (boss.hp <= 0) { boss.st = 'dead'; boss.dead = 1.6; }
    else { boss.st = 'walk'; boss.t = 1.8; boss.x = boss.x < W * TS / 2 ? boss.x + 40 : boss.x - 40; }
    inv = 1; paused = false; last = 0;
  }
  function finishStage(isBoss) {
    mode = 'won'; const secs = Math.round((performance.now() - t0) / 1000);
    if (isBoss) { api.gain(80, 'boss'); api.won(); } else { api.gain(40, 'stage'); api.won(); }
    const wasLast = stage === 11; prog.s = stage + 1; if (wasLast) { prog.beat++; prog.s = 0; api.gain(100, 'campus champion'); } saveProg();
    setTimeout(() => { if (!alive) return; showMap(wasLast ? `🎓 <b>Campus champion!</b> You beat all 4 worlds (+100 bonus). Play again for a higher score.` : isBoss ? `🏆 You beat ${th.boss.name}! <b>+80 coins</b>. ${TH[Math.floor(prog.s / 3)].em} ${TH[Math.floor(prog.s / 3)].name} is open.` : `🚪 World ${stageName(stage)} cleared in ${secs} s! <b>+40 coins</b>.`); }, 1200);
  }

  /* ---------- update ---------- */
  function update(dt) {
    const fast = pw.chai > 0 ? 1.35 : 1, ACC = 1500, RUN = 200 * fast, G = 1500, JV = 560;
    if (keys.L && !keys.R) { pl.vx = Math.max(-RUN, pl.vx - ACC * dt); pl.face = -1; }
    else if (keys.R && !keys.L) { pl.vx = Math.min(RUN, pl.vx + ACC * dt); pl.face = 1; }
    else { const f = 1700 * dt; pl.vx = Math.abs(pl.vx) <= f ? 0 : pl.vx - Math.sign(pl.vx) * f; }
    const press = keys.J && !jumpHeld; jumpBuf = press ? 0.12 : Math.max(0, jumpBuf - dt); jumpHeld = keys.J;
    coyote = pl.on ? 0.09 : Math.max(0, coyote - dt);
    if (pl.on) airJumps = pw.bulb > 0 ? 1 : 0;
    if (jumpBuf > 0 && coyote > 0) { pl.vy = -JV; jumpBuf = 0; coyote = 0; pl.on = false; api.sfx('jump'); }
    else if (press && !pl.on && coyote <= 0 && airJumps > 0 && pw.bulb > 0) { pl.vy = -JV * 0.9; airJumps--; jumpBuf = 0; api.sfx('jump'); for (let i = 0; i < 6; i++) sparks.push({ x: pl.x + 10, y: pl.y + 28, vx: (Math.random() - .5) * 120, vy: Math.random() * 80, life: .4, col: '255,214,102' }); }
    if (!keys.J && pl.vy < -220) pl.vy = -220;
    pl.vy = Math.min(900, pl.vy + G * dt);
    Object.keys(pw).forEach(k => { if (POWERS[k].t && pw[k] > 0) pw[k] = Math.max(0, pw[k] - dt); });
    // moving platforms
    movers.forEach(m => { const ox = m.x; m.x += m.v * dt; if (m.x < m.a || m.x > m.b) { m.v = -m.v; m.x = Math.max(m.a, Math.min(m.b, m.x)); } m.dx = m.x - ox; });
    if (pl.plat) pl.x += pl.plat.dx;
    // X
    pl.x += pl.vx * dt;
    let y0 = Math.floor(pl.y / TS), y1 = Math.floor((pl.y + pl.h - 1) / TS);
    if (pl.vx > 0) { const tx = Math.floor((pl.x + pl.w) / TS); for (let ty = y0; ty <= y1; ty++) if (solid(tx, ty)) { pl.x = tx * TS - pl.w - 0.01; pl.vx = 0; break; } }
    else if (pl.vx < 0) { const tx = Math.floor(pl.x / TS); for (let ty = y0; ty <= y1; ty++) if (solid(tx, ty)) { pl.x = (tx + 1) * TS + 0.01; pl.vx = 0; break; } }
    if (pl.x < 0) pl.x = 0;
    // Y
    const prevBottom = pl.y + pl.h;
    pl.y += pl.vy * dt; pl.on = false; pl.plat = null;
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
    if (pl.vy >= 0) movers.forEach(m => { if (pl.x + pl.w > m.x && pl.x < m.x + m.w && prevBottom <= m.y + 2 && pl.y + pl.h >= m.y) { pl.y = m.y - pl.h; pl.vy = 0; pl.on = true; pl.plat = m; } });
    pl.walk += Math.abs(pl.vx) * dt;
    // tiles touched
    const cx0 = Math.floor(pl.x / TS), cx1 = Math.floor((pl.x + pl.w) / TS), cy0 = Math.floor(pl.y / TS), cy1 = Math.floor((pl.y + pl.h) / TS);
    for (let ty = cy0; ty <= cy1; ty++) for (let tx = cx0; tx <= cx1; tx++) {
      const ch = at(tx, ty);
      if (ch === 'o') { grid[ty][tx] = '.'; api.gain(1, ''); }
      else if (ch === 'C' && check.x < tx * TS) { check = { x: tx * TS, y: 10 * TS - pl.h }; api.toast('Checkpoint reached!'); api.sfx('up'); }
      else if (ch === 'S' && pl.y + pl.h > ty * TS + 14 && inv <= 0) { hurt('spike'); return; }
      else if (ch === 'J' && pl.vy >= 0 && pl.y + pl.h > ty * TS + 10) { pl.vy = -880; pl.on = false; api.sfx('up'); }
    }
    if (pw.magnet > 0) { const ptx = Math.floor((pl.x + 10) / TS), pty = Math.floor((pl.y + 14) / TS); for (let ty = Math.max(0, pty - 3); ty <= Math.min(ROWS - 1, pty + 3); ty++) for (let tx = ptx - 3; tx <= ptx + 3; tx++) if (at(tx, ty) === 'o') { grid[ty][tx] = '.'; api.gain(1, ''); sparks.push({ x: tx * TS + 15, y: ty * TS + 15, vx: (pl.x - tx * TS) * 3, vy: (pl.y - ty * TS) * 3, life: .25, col: '245,166,35' }); } }
    if (pl.y > ROWS * TS + 30) { hurt('fall'); return; }
    if (pl.x >= gateX) { finishStage(false); return; }
    // enemies
    for (const e of ents) {
      if (!e.alive || Math.abs(e.x - pl.x) > VW) continue;
      e.ph += dt * 8;
      if (e.k === 'fly') { e.x += e.vx * dt; if (e.x < e.x0 || e.x > e.x1) e.vx = -e.vx; e.y = e.y0 + Math.sin(e.ph / 3) * 26; }
      else { e.x += e.vx * dt; const front = e.vx > 0 ? e.x + e.w : e.x, ftx = Math.floor(front / TS); if (!solid(ftx, 10) || solid(ftx, 9) || at(ftx, 9) === 'S' || at(ftx, 9) === 'J') { e.vx = -e.vx; e.x += e.vx * dt * 2; } }
      if (pl.x < e.x + e.w && pl.x + pl.w > e.x && pl.y < e.y + e.h && pl.y + pl.h > e.y) {
        if (pl.vy > 0 && pl.y + pl.h - e.y < 15) { e.alive = false; pl.vy = -380; api.gain(3, 'stomp'); for (let i = 0; i < 6; i++) sparks.push({ x: e.x + 12, y: e.y + 9, vx: (Math.random() - .5) * 200, vy: -Math.random() * 200, life: .5, col: '245,166,35' }); }
        else if (inv <= 0) { hurt('enemy', e); return; }
      }
    }
    if (boss) { if (updBoss(dt)) return; }
    shots.forEach(s => { s.x += s.vx * dt; s.y += s.vy * dt; s.vy += 500 * dt; s.r += dt * 8; if (s.y > 10 * TS - 6 || solid(Math.floor(s.x / TS), Math.floor(s.y / TS))) s.dead = true; if (!s.dead && inv <= 0 && Math.abs(s.x - (pl.x + 10)) < 16 && Math.abs(s.y - (pl.y + 14)) < 18) { s.dead = true; hurt('shot'); } });
    shots = shots.filter(s => !s.dead);
    if (inv > 0) inv -= dt;
    camX = Math.max(0, Math.min(W * TS - VW, pl.x - VW * 0.38));
  }
  function updBoss(dt) {
    const b = boss; b.t -= dt; if (b.flash > 0) b.flash -= dt;
    const ground = 10 * TS - b.h;
    if (b.st === 'dead') { b.dead -= dt; if (b.dead <= 0 && mode === 'play') { finishStage(true); return true; } return false; }
    if (b.st === 'intro') { if (b.t <= 0) { b.st = 'walk'; b.t = 2; } }
    else if (b.st === 'walk') {
      b.face = pl.x < b.x ? -1 : 1; b.x += b.face * b.sp * dt;
      if (b.t <= 0) { if (Math.random() < 0.55) { b.st = 'wind'; b.t = 0.7; } else { b.st = 'shoot'; b.t = 1.4; b.n = 3; b.nt = 0.1; } }
    } else if (b.st === 'wind') { if (b.t <= 0) { b.st = 'dash'; b.vx = b.face * b.dash; } }
    else if (b.st === 'dash') {
      b.x += b.vx * dt;
      if (b.x < TS + 2 || b.x + b.w > (W - 1) * TS - 2) { b.x = Math.max(TS + 2, Math.min((W - 1) * TS - b.w - 2, b.x)); b.st = 'tired'; b.t = 2.6; api.sfx('hit'); for (let i = 0; i < 8; i++) sparks.push({ x: b.x + (b.vx > 0 ? b.w : 0), y: ground + 40, vx: (Math.random() - .5) * 200, vy: -Math.random() * 200, life: .6, col: '200,200,200' }); }
    } else if (b.st === 'shoot') {
      b.nt -= dt;
      if (b.nt <= 0 && b.n > 0) { b.n--; b.nt = 0.4; const dx = (pl.x + 10) - (b.x + 32); shots.push({ x: b.x + 32, y: ground + 10, vx: Math.max(-260, Math.min(260, dx * 0.9)) + (Math.random() - .5) * 60, vy: -380 - Math.random() * 120, r: 0 }); api.sfx('roll'); }
      if (b.t <= 0) { b.st = 'tired'; b.t = 2.2; }
    } else if (b.st === 'tired') { if (b.t <= 0) { b.st = 'walk'; b.t = 2 + Math.random(); } }
    b.y = ground;
    if (pl.x < b.x + b.w - 6 && pl.x + pl.w > b.x + 6 && pl.y < b.y + b.h && pl.y + pl.h > b.y + 4) {
      if (b.st === 'tired' && pl.vy > 0 && pl.y + pl.h - b.y < 22) { bossHit(); return true; }
      if (inv <= 0 && b.st !== 'intro') { hurt('boss', b); return true; }
    }
    return false;
  }

  /* ---------- drawing ---------- */
  function drawHero(x, y) {
    if (inv > 0 && Math.floor(inv * 12) % 2) return;
    const f = pl.face, step = pl.on ? Math.sin(pl.walk / 7) * 3 : -2;
    ctx.fillStyle = '#14213D'; ctx.fillRect(x + 4, y + 22 + Math.max(0, step), 5, 6); ctx.fillRect(x + 11, y + 22 + Math.max(0, -step), 5, 6);
    ctx.fillStyle = '#f5a623'; rr(ctx, x + (f > 0 ? -4 : 16), y + 10, 8, 11, 3); ctx.fill();
    ctx.fillStyle = pw.chai > 0 ? '#e67e22' : '#1f9e8f'; rr(ctx, x + 1, y + 10, 18, 14, 5); ctx.fill();
    ctx.fillStyle = '#f2c8a0'; ctx.beginPath(); ctx.arc(x + 10, y + 6, 7, 0, 7); ctx.fill();
    ctx.fillStyle = '#2b1d14'; ctx.beginPath(); ctx.arc(x + 10, y + 3, 7, Math.PI, 0); ctx.fill(); ctx.beginPath(); ctx.arc(x + 10 - f * 7, y + 1, 3.5, 0, 7); ctx.fill();
    ctx.fillStyle = '#c8432b'; ctx.fillRect(x + 3, y + 1, 14, 2);
    ctx.fillStyle = '#14213D'; ctx.fillRect(x + 10 + f * 3, y + 5, 2, 2);
    if (pw.book) { ctx.strokeStyle = 'rgba(42,111,176,.7)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x + 10, y + 14, 19, 0, 7); ctx.stroke(); }
    if (pw.bulb > 0) { ctx.font = '12px system-ui'; ctx.textAlign = 'center'; ctx.fillText('💡', x + 10, y - 6); }
  }
  function drawEnemy(e, X) {
    const y = e.y, ph = e.ph;
    if (e.k === 'fly') {
      const wing = Math.sin(ph * 2) * 6;
      ctx.fillStyle = th.dark ? '#c9d3ea' : '#6d7a8c'; ctx.beginPath(); ctx.ellipse(X + 13, y + 9, 11, 8, 0, 0, 7); ctx.fill();
      ctx.fillStyle = th.dark ? '#eef2fb' : '#9aa6b6'; ctx.beginPath(); ctx.moveTo(X + 6, y + 6); ctx.lineTo(X - 4, y + wing); ctx.lineTo(X + 8, y + 10); ctx.fill(); ctx.beginPath(); ctx.moveTo(X + 20, y + 6); ctx.lineTo(X + 30, y + wing); ctx.lineTo(X + 18, y + 10); ctx.fill();
      ctx.fillStyle = '#c8432b'; ctx.beginPath(); ctx.arc(X + 13 + (e.vx > 0 ? 4 : -4), y + 8, 2.5, 0, 7); ctx.fill();
      return;
    }
    const col = e.k === 'run' ? '#c8432b' : ['#7d4fa3', '#4f5d6e', '#b5651d', '#d35d8a'][TH.indexOf(th)];
    ctx.fillStyle = col; rr(ctx, X, y + 2, 24, 16, 6); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.arc(X + 6, y + 19, 3, 0, 7); ctx.arc(X + 18, y + 19, 3, 0, 7); ctx.fill();
    const ex = e.vx > 0 ? 14 : 4;
    ctx.fillStyle = '#fff'; ctx.fillRect(X + ex, y + 6, 6, 5);
    ctx.fillStyle = '#111'; ctx.fillRect(X + ex + (e.vx > 0 ? 3 : 0), y + 7, 3, 3);
    if (TH.indexOf(th) === 0 && e.k === 'walk') { ctx.fillStyle = '#5b6475'; ctx.font = '700 10px system-ui'; ctx.fillText('z', X + 22, y - 2 + Math.sin(ph) * 2); }
  }
  function drawBoss(ox) {
    const b = boss; if (!b) return; const X = b.x + ox, Y = b.y;
    if (b.st === 'dead') ctx.globalAlpha = Math.max(0, b.dead / 1.6);
    if (b.st === 'tired') { ctx.fillStyle = 'rgba(255,214,102,.35)'; ctx.beginPath(); ctx.arc(X + 32, Y + 32, 46 + Math.sin(performance.now() / 120) * 4, 0, 7); ctx.fill(); }
    const shake = b.st === 'wind' ? (Math.random() - .5) * 4 : 0, col = b.flash > 0 && Math.floor(b.flash * 14) % 2 ? '#fff' : th.boss.col, k = th.boss.kind, f = b.face;
    const x = X + shake;
    if (k === 'owl') {
      ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x + 32, Y + 36, 30, 28, 0, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x + 8, Y + 14); ctx.lineTo(x + 14, Y); ctx.lineTo(x + 22, Y + 12); ctx.fill(); ctx.beginPath(); ctx.moveTo(x + 56, Y + 14); ctx.lineTo(x + 50, Y); ctx.lineTo(x + 42, Y + 12); ctx.fill();
      ctx.fillStyle = '#f6e7c8'; ctx.beginPath(); ctx.arc(x + 22, Y + 26, 10, 0, 7); ctx.arc(x + 42, Y + 26, 10, 0, 7); ctx.fill();
      ctx.fillStyle = '#14213D'; if (b.st === 'tired') { ctx.fillRect(x + 15, Y + 26, 14, 2); ctx.fillRect(x + 35, Y + 26, 14, 2); } else { ctx.beginPath(); ctx.arc(x + 22 + f * 3, Y + 26, 4, 0, 7); ctx.arc(x + 42 + f * 3, Y + 26, 4, 0, 7); ctx.fill(); }
      ctx.fillStyle = '#f5a623'; ctx.beginPath(); ctx.moveTo(x + 28, Y + 34); ctx.lineTo(x + 36, Y + 34); ctx.lineTo(x + 32, Y + 42); ctx.fill();
    } else if (k === 'robot') {
      ctx.fillStyle = col; rr(ctx, x + 4, Y + 14, 56, 46, 8); ctx.fill(); ctx.fillStyle = '#2c3e50'; rr(ctx, x + 12, Y + 22, 40, 20, 4); ctx.fill();
      ctx.fillStyle = b.st === 'tired' ? '#7f8c8d' : '#7ff0e2'; ctx.font = '700 14px ui-monospace, monospace'; ctx.textAlign = 'center'; ctx.fillText(b.st === 'tired' ? 'z z' : '404', x + 32, Y + 37);
      ctx.strokeStyle = '#2c3e50'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 32, Y + 14); ctx.lineTo(x + 32, Y + 2); ctx.stroke(); ctx.fillStyle = '#f5a623'; ctx.beginPath(); ctx.arc(x + 32, Y + 2, 4, 0, 7); ctx.fill();
      ctx.fillStyle = '#2c3e50'; ctx.fillRect(x + 12, Y + 58, 12, 6); ctx.fillRect(x + 40, Y + 58, 12, 6);
    } else if (k === 'cart') {
      ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x + (f > 0 ? 60 : 4), Y + 6); ctx.lineTo(x + (f > 0 ? 54 : 10), Y + 16); ctx.stroke();
      ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x + 4, Y + 16); ctx.lineTo(x + 60, Y + 16); ctx.lineTo(x + 52, Y + 48); ctx.lineTo(x + 12, Y + 48); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 2; for (let i = 1; i < 5; i++) { ctx.beginPath(); ctx.moveTo(x + 6 + i * 11, Y + 18); ctx.lineTo(x + 8 + i * 9, Y + 46); ctx.stroke(); }
      ctx.fillStyle = '#14213D'; ctx.beginPath(); ctx.arc(x + 18, Y + 56, 7, 0, 7); ctx.arc(x + 46, Y + 56, 7, 0, 7); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x + 24, Y + 28, 6, 0, 7); ctx.arc(x + 40, Y + 28, 6, 0, 7); ctx.fill(); ctx.fillStyle = '#14213D'; ctx.beginPath(); ctx.arc(x + 24 + f * 2, Y + 29, 3, 0, 7); ctx.arc(x + 40 + f * 2, Y + 29, 3, 0, 7); ctx.fill();
    } else {
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x + 32, Y + 34, 30, 0, 7); ctx.fill(); ctx.fillStyle = '#fdf6e8'; ctx.beginPath(); ctx.arc(x + 32, Y + 34, 23, 0, 7); ctx.fill();
      ctx.strokeStyle = '#14213D'; ctx.lineWidth = 3; const tt = performance.now() / (b.st === 'tired' ? 900 : 180);
      ctx.beginPath(); ctx.moveTo(x + 32, Y + 34); ctx.lineTo(x + 32 + Math.cos(tt) * 16, Y + 34 + Math.sin(tt) * 16); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x + 32, Y + 34); ctx.lineTo(x + 32 + Math.cos(tt / 12) * 10, Y + 34 + Math.sin(tt / 12) * 10); ctx.stroke();
      ctx.fillStyle = col; ctx.fillRect(x + 10, Y + 2, 12, 8); ctx.fillRect(x + 42, Y + 2, 12, 8); ctx.fillRect(x + 14, Y + 60, 8, 6); ctx.fillRect(x + 42, Y + 60, 8, 6);
    }
    ctx.globalAlpha = 1;
  }
  function drawBg() {
    const sky = ctx.createLinearGradient(0, 0, 0, VH); sky.addColorStop(0, th.sky[0]); sky.addColorStop(1, th.sky[1]); ctx.fillStyle = sky; ctx.fillRect(0, 0, VW, VH);
    const w = TH.indexOf(th), px = camX * 0.3;
    ctx.fillStyle = th.far;
    if (w === 0) { for (let i = -1; i < 6; i++) { const X = i * 180 - px % 180; ctx.fillRect(X + 10, 60, 150, 240); ctx.fillStyle = 'rgba(0,0,0,.08)'; for (let s = 0; s < 4; s++) ctx.fillRect(X + 10, 90 + s * 56, 150, 6); ctx.fillStyle = th.far; } }
    else if (w === 1) { for (let i = -1; i < 7; i++) { const X = i * 150 - px % 150; ctx.beginPath(); ctx.moveTo(X + 50, 150); ctx.lineTo(X + 70, 150); ctx.lineTo(X + 70, 200); ctx.lineTo(X + 100, 280); ctx.lineTo(X + 20, 280); ctx.lineTo(X + 50, 200); ctx.fill(); } }
    else if (w === 2) { for (let i = -1; i < 6; i++) { const X = i * 200 - px % 200; ctx.fillRect(X + 20, 170, 150, 130); for (let s = 0; s < 6; s++) { ctx.fillStyle = s % 2 ? '#fff6e8' : '#e07b39'; ctx.fillRect(X + 15 + s * 27, 150, 27, 26); } ctx.fillStyle = th.far; } }
    else { const kx = VW - 120; ctx.fillStyle = '#fdf6e8'; ctx.beginPath(); ctx.arc(kx, 80, 26, 0, 7); ctx.fill(); ctx.strokeStyle = '#14213D'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(kx, 80); ctx.lineTo(kx, 62); ctx.moveTo(kx, 80); ctx.lineTo(kx + 14, 84); ctx.stroke(); ctx.fillStyle = th.far; for (let i = -1; i < 7; i++) { const X = i * 160 - px % 160; ctx.fillRect(X + 30, 110, 70, 110); ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(X + 36, 116, 58, 98); ctx.fillStyle = th.far; } }
  }
  function draw(now) {
    drawBg();
    if (!grid.length) return;
    const ox = -Math.round(camX), tx0 = Math.max(0, Math.floor(camX / TS) - 1), tx1 = Math.min(W - 1, tx0 + Math.ceil(VW / TS) + 2), w = TH.indexOf(th);
    if (w === 1) { ctx.fillStyle = 'rgba(80,220,120,.75)'; for (let tx = tx0; tx <= tx1; tx++) if (at(tx, 10) === '.') ctx.fillRect(tx * TS + ox, 11 * TS + 8 + Math.sin(now / 300 + tx) * 2, TS, TS); }
    for (let ty = 0; ty < ROWS; ty++) for (let tx = tx0; tx <= tx1; tx++) {
      const ch = grid[ty][tx], X = tx * TS + ox, Y = ty * TS;
      if (ch === '#') { ctx.fillStyle = th.ground; ctx.fillRect(X, Y, TS, TS); if (!solid(tx, ty - 1)) { ctx.fillStyle = th.top; ctx.fillRect(X, Y, TS, 7); } ctx.fillStyle = 'rgba(0,0,0,.1)'; ctx.fillRect(X + 4, Y + 14, 6, 4); ctx.fillRect(X + 18, Y + 21, 5, 3); }
      else if (ch === 'B') {
        if (w === 0) { const cols = ['#c8432b', '#2a6fb0', '#1d8a4e', '#f5a623', '#8e44ad']; for (let k = 0; k < 3; k++) { ctx.fillStyle = cols[(tx + ty + k) % 5]; ctx.fillRect(X, Y + k * 10, TS, 10); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(X + 3, Y + k * 10 + 4, TS - 6, 2); } }
        else if (w === 3) { ctx.fillStyle = '#8a6a45'; ctx.fillRect(X, Y, TS, 9); ctx.fillStyle = '#5b4630'; ctx.fillRect(X + 3, Y + 9, 4, TS - 9); ctx.fillRect(X + TS - 7, Y + 9, 4, TS - 9); }
        else { ctx.fillStyle = w === 1 ? '#7f8c8d' : '#c08a4f'; ctx.fillRect(X, Y, TS, TS); ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 2; ctx.strokeRect(X + 1, Y + 1, TS - 2, TS - 2); ctx.beginPath(); ctx.moveTo(X + 2, Y + 2); ctx.lineTo(X + TS - 2, Y + TS - 2); ctx.stroke(); }
      }
      else if (ch === 'Q' || ch === 'U') { ctx.fillStyle = ch === 'Q' ? '#f5a623' : '#b9a98c'; rr(ctx, X + 1, Y + 1, TS - 2, TS - 2, 5); ctx.fill(); ctx.strokeStyle = '#7a4c06'; ctx.lineWidth = 2; ctx.stroke(); if (ch === 'Q') { ctx.font = '700 17px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('⭐', X + TS / 2, Y + TS / 2 + 1 + Math.sin(now / 250) * 1.5); ctx.textBaseline = 'alphabetic'; } }
      else if (ch === 'S') { ctx.fillStyle = w === 0 ? '#f5c542' : w === 3 ? '#2a2a72' : '#8b95a5'; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(X + k * 10, Y + TS); ctx.lineTo(X + k * 10 + 5, Y + 12); ctx.lineTo(X + k * 10 + 10, Y + TS); ctx.fill(); } if (w === 0) { ctx.fillStyle = '#e88fa0'; for (let k = 0; k < 3; k++) ctx.fillRect(X + k * 10 + 2, Y + TS - 4, 6, 4); } }
      else if (ch === 'J') { ctx.fillStyle = '#c8432b'; rr(ctx, X + 3, Y + 18, 24, 12, 4); ctx.fill(); ctx.strokeStyle = '#14213D'; ctx.lineWidth = 2; ctx.beginPath(); for (let k = 0; k < 4; k++) { ctx.moveTo(X + 6, Y + 18 - k * 3); ctx.lineTo(X + 24, Y + 16 - k * 3); } ctx.stroke(); }
      else if (ch === 'o') { const b = Math.sin(now / 200 + tx) * 2; ctx.fillStyle = '#f5a623'; ctx.beginPath(); ctx.ellipse(X + 15, Y + 15 + b, 7, 8, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#ffe4a3'; ctx.fillRect(X + 13, Y + 10 + b, 3, 8); }
      else if (ch === 'C') { ctx.fillStyle = '#5b6475'; ctx.fillRect(X + 13, Y - 30, 3, 60); ctx.fillStyle = check && check.x >= tx * TS ? '#1f9e8f' : '#ff8a65'; ctx.beginPath(); ctx.moveTo(X + 16, Y - 30); ctx.lineTo(X + 34, Y - 22); ctx.lineTo(X + 16, Y - 14); ctx.fill(); }
      else if (ch === 'G') { ctx.fillStyle = '#14213D'; rr(ctx, X - 6, Y - 64, 48, 94, 10); ctx.fill(); ctx.fillStyle = '#f5a623'; rr(ctx, X, Y - 56, 36, 86, 8); ctx.fill(); ctx.fillStyle = '#14213D'; ctx.beginPath(); ctx.arc(X + 28, Y - 10, 3, 0, 7); ctx.fill(); ctx.font = '700 11px system-ui'; ctx.textAlign = 'center'; ctx.fillText('NEXT', X + 18, Y - 36); ctx.fillText('LEVEL', X + 18, Y - 24); }
    }
    movers.forEach(m => { const X = m.x + ox; ctx.fillStyle = '#f5a623'; rr(ctx, X, m.y, m.w, m.h + 2, 5); ctx.fill(); ctx.strokeStyle = '#14213D'; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = '#14213D'; for (let k = 8; k < m.w - 4; k += 12) ctx.fillRect(X + k, m.y + 5, 5, 3); });
    ents.forEach(e => { if (!e.alive) return; const X = e.x + ox; if (X < -40 || X > VW + 40) return; drawEnemy(e, X); });
    drawBoss(ox);
    shots.forEach(s => { ctx.save(); ctx.translate(s.x + ox, s.y); ctx.rotate(s.r); ctx.fillStyle = '#fff'; ctx.strokeStyle = '#14213D'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-9, 0); ctx.lineTo(9, -4); ctx.lineTo(9, 4); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); });
    items.forEach(it => { ctx.globalAlpha = Math.max(0, it.life); ctx.font = '22px system-ui'; ctx.textAlign = 'center'; ctx.fillText(POWERS[it.k].em, it.x + 11 + ox, it.y); ctx.globalAlpha = 1; });
    sparks.forEach(s => { ctx.fillStyle = `rgba(${s.col},${Math.max(0, s.life * 1.4)})`; ctx.fillRect(s.x + ox - 2, s.y - 2, 4, 4); });
    if (pl) drawHero(Math.round(pl.x + ox), Math.round(pl.y));
    // HUD
    ctx.fillStyle = th.dark ? 'rgba(255,255,255,.9)' : 'rgba(20,33,61,.85)'; ctx.font = '700 13px system-ui'; ctx.textAlign = 'left';
    ctx.fillText(`${th.em} ${stageName(stage)}`, 12, 22);
    ctx.font = '15px system-ui'; ctx.fillText('❤️'.repeat(Math.max(0, hearts)) + '🤍'.repeat(Math.max(0, 3 - hearts)), 92, 23);
    let px = 168; Object.keys(pw).forEach(k => { if (pw[k] > 0) { ctx.font = '15px system-ui'; ctx.fillText(POWERS[k].em, px, 23); if (POWERS[k].t) { ctx.font = '700 10px system-ui'; ctx.fillText(Math.ceil(pw[k]), px + 18, 23); } px += 38; } });
    if (boss) {
      const bx = VW - 236; ctx.fillStyle = 'rgba(20,33,61,.8)'; rr(ctx, bx, 34, 226, 26, 8); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = '700 12px system-ui'; ctx.fillText(th.boss.name, bx + 10, 51);
      for (let i = 0; i < boss.max; i++) { ctx.fillStyle = i < boss.hp ? '#c8432b' : 'rgba(255,255,255,.25)'; rr(ctx, bx + 140 + i * 28, 40, 22, 14, 4); ctx.fill(); }
    } else {
      const bw = Math.min(180, VW - 330), bx = VW - bw - 14;
      if (bw > 40) { ctx.fillStyle = th.dark ? 'rgba(255,255,255,.2)' : 'rgba(20,33,61,.15)'; rr(ctx, bx, 13, bw, 10, 5); ctx.fill();
      ctx.fillStyle = '#1f9e8f'; rr(ctx, bx, 13, Math.max(10, bw * Math.min(1, pl.x / gateX)), 10, 5); ctx.fill(); }
    }
  }
  function drawMap(now) {
    th = TH[Math.floor((prog.s % 12) / 3)];
    const g = ctx.createLinearGradient(0, 0, 0, VH); g.addColorStop(0, '#14213D'); g.addColorStop(1, '#23345c'); ctx.fillStyle = g; ctx.fillRect(0, 0, VW, VH);
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.font = '700 28px Georgia, serif'; ctx.fillText('Campus Quest', VW / 2, 46);
    ctx.font = (VW < 600 ? 11 : 14) + 'px system-ui'; ctx.fillStyle = '#b9c3d8'; ctx.fillText('← → move · ↑ or Space jump · ⭐ crates from below · jump on enemies', VW / 2, 70);
    const pts = TH.map((_, i) => [VW * (0.14 + i * 0.24), 180 + (i % 2 ? -30 : 30)]);
    ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 6; ctx.setLineDash([2, 12]); ctx.lineCap = 'round'; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.setLineDash([]);
    const cur = prog.s % 12;
    TH.forEach((t, i) => {
      const [x, y] = pts[i], open = Math.floor(cur / 3) >= i || prog.beat > 0, here = Math.floor(cur / 3) === i;
      const R = VW < 600 ? 28 : 34; ctx.fillStyle = open ? t.sky[0] : '#4b5b7c'; ctx.beginPath(); ctx.arc(x, y, here ? R + 4 + Math.sin(now / 300) * 2 : R, 0, 7); ctx.fill();
      if (here) { ctx.strokeStyle = '#f5a623'; ctx.lineWidth = 4; ctx.stroke(); }
      ctx.font = '30px system-ui'; ctx.fillText(open ? t.em : '🔒', x, y + 10);
      ctx.fillStyle = '#fff'; ctx.font = `700 ${VW < 600 ? 12 : 14}px system-ui`; ctx.fillText(t.name, x, y + 60);
      for (let k = 0; k < 3; k++) { const sIdx = i * 3 + k, done = sIdx < cur || prog.beat > 0 && sIdx >= cur && false; ctx.fillStyle = sIdx < cur ? '#1d8a4e' : sIdx === cur ? '#f5a623' : 'rgba(255,255,255,.25)'; ctx.beginPath(); ctx.arc(x - 18 + k * 18, y + 76, k === 2 ? 7 : 5, 0, 7); ctx.fill(); }
    });
    ctx.fillStyle = '#dfe5f1'; ctx.font = '14px system-ui'; ctx.fillText(prog.beat ? `Completed ${prog.beat} time${prog.beat > 1 ? 's' : ''} 🎓` : 'Two levels and a boss in every world.', VW / 2, 330);
    pl = { x: 0, y: 0, w: 20, h: 28, face: 1, on: true, walk: now / 6 };
    const [hx, hy] = pts[Math.floor(cur / 3)]; drawHero(hx - 10, hy - 86);
  }
  function loop(now) {
    if (!alive) return;
    const dt = last ? Math.min(1 / 30, (now - last) / 1000) : 0; last = now;
    if (mode === 'play' || mode === 'won') {
      if (mode === 'play' && !paused && !api.busy) update(dt);
      sparks.forEach(s => { s.x += s.vx * dt; s.y += s.vy * dt; s.vy += 600 * dt; s.life -= dt; }); sparks = sparks.filter(s => s.life > 0);
      items.forEach(it => { it.y -= 30 * dt; it.life -= dt; }); items = items.filter(it => it.life > 0);
      draw(now);
    } else drawMap(now);
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame(loop);
  const KM = { ArrowLeft: 'L', a: 'L', A: 'L', ArrowRight: 'R', d: 'R', D: 'R', ArrowUp: 'J', w: 'J', W: 'J', ' ': 'J' };
  const kd = e => { if (api.busy || !KM[e.key] || /INPUT|TEXTAREA|SELECT/.test(document.activeElement && document.activeElement.tagName)) return; if (mode === 'play') e.preventDefault(); keys[KM[e.key]] = true; };
  const ku = e => { if (KM[e.key]) keys[KM[e.key]] = false; };
  window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
  root.querySelectorAll('.gt-pad button').forEach(b => {
    const k = b.dataset.k, on = e => { e.preventDefault(); keys[k] = true; }, off = e => { e.preventDefault(); keys[k] = false; };
    b.addEventListener('pointerdown', on); b.addEventListener('pointerup', off); b.addEventListener('pointerleave', off); b.addEventListener('pointercancel', off);
    b.addEventListener('contextmenu', e => e.preventDefault());
  });
  root.__quest = { get pl() { return pl; }, get boss() { return boss; }, get mode() { return mode; }, get gateX() { return gateX; }, get hearts() { return hearts; }, keys, pw, prog, setStage(s) { prog.s = s; saveProg(); showMap(); } };
  showMap();
  return { destroy() { alive = false; cancelAnimationFrame(raf); window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); } };
} };
})();
