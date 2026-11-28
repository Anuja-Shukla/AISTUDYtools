/* AIgametools: teacher hosting, student joining, coins, questions and leaderboard.
   Live games run peer-to-peer: the teacher's browser is the game server and phones connect
   with a join code through the free PeerJS relay. Add ?local=1 to test with tabs on one computer. */
(function () {
'use strict';
const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} }
};
const params = new URLSearchParams(location.search);
const LOCAL = params.has('local');
const HERE = document.currentScript && document.currentScript.src || location.href;
const PEERJS = window.AIGT_PEERJS || new URL('vendor/peerjs-1.5.4.min.js', HERE).href; // MIT licence, self-hosted
const QRLIB = window.AIGT_QRLIB || new URL('vendor/qrcode-generator-1.4.4.js', HERE).href; // MIT licence, self-hosted
const loaded = {};
const loadScript = src => (src === PEERJS && window.Peer) || (src === QRLIB && window.qrcode) ? Promise.resolve() : loaded[src] || (loaded[src] = new Promise((res, rej) => {
  const s = document.createElement('script'); s.src = src; s.onload = res;
  s.onerror = () => { delete loaded[src]; rej(new Error('Could not load ' + src)); };
  document.head.appendChild(s);
}));
const GAMES = window.AIGT_GAMES || {};
const GAME_META = {
  snakes: { title: 'Snakes & Ladders', em: '🐍', blurb: 'Race the bots to 100. Answer to escape snakes.' },
  ludo: { title: 'Ludo', em: '🎯', blurb: 'Get all four tokens home. Answer to defend them.' },
  jump: { title: 'Jump Quest', em: '🤖', blurb: 'Run, jump and open quiz crates with Jugg the robot.' },
  race: { title: 'Quiz Race', em: '🏁', blurb: 'Speed rounds against two bots. Faster right answers score more.' },
  tambola: { title: 'Tambola', em: '🎟️', blurb: 'Housie with answers on your ticket. Claim lines before the bots.' },
  tycoon: { title: 'Business Tycoon', em: '🏢', blurb: 'Buy companies, collect rent, answer to win deals.' },
  crossword: { title: 'Crossword', em: '✏️', blurb: 'The questions are the clues. Fill in the answers.' },
  wordsearch: { title: 'Word Search', em: '🔎', blurb: 'Find each answer hidden in the letter grid.' },
  quest: { title: 'Campus Quest', em: '🎒', blurb: 'Run and jump through 4 worlds. Answer to beat the bosses.' }
};
const MODE_META = {
  free: { title: 'Free play', note: 'Each student picks a game on their phone and plays against bots. Questions pop up during play.' },
  race: { title: 'Quiz Race', note: 'Everyone gets the same question at the same time. Show this screen on the projector; students tap answers on their phones. Faster correct answers score more.' },
  tambola: { title: 'Tambola', note: 'Every student gets a ticket of answers. You call questions on the projector; students mark the answer if it is on their ticket and claim Early Five, lines and Full House.' }
};
const isClass = s => !!(s && s.mode && s.mode !== 'free');
const fmtTime = ms => { if (ms == null) return '∞'; ms = Math.max(0, ms); const s = Math.ceil(ms / 1000); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };

/* ---------- sound & toasts ---------- */
let actx = null, sfxOn = LS.get('aigt-sfx', true);
function sfx(type) {
  if (!sfxOn) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const seq = { good: [[660, .08], [880, .12]], bad: [[220, .2]], coin: [[988, .05], [1319, .08]], win: [[523, .1], [659, .1], [784, .1], [1047, .22]], hit: [[160, .16]], roll: [[420, .03], [520, .03], [470, .03]], jump: [[440, .06]], up: [[523, .06], [784, .08]] }[type];
    if (!seq) return;
    let t = actx.currentTime;
    seq.forEach(([f, d]) => {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = type === 'bad' || type === 'hit' ? 'sawtooth' : 'triangle'; o.frequency.value = f;
      g.gain.setValueAtTime(.1, t); g.gain.exponentialRampToValueAtTime(.001, t + d);
      o.connect(g).connect(actx.destination); o.start(t); o.stop(t + d + .02); t += d;
    });
  } catch (e) {}
}
let toastT = null;
function toast(msg, ms) {
  let el = document.querySelector('.gt-toast');
  if (!el) { el = document.createElement('div'); el.className = 'gt-toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
  el.textContent = msg; el.hidden = false;
  clearTimeout(toastT); toastT = setTimeout(() => { el.hidden = true; }, ms || 2300);
}
function floatText(txt, color) {
  const r = $('hCoins').getBoundingClientRect();
  const el = document.createElement('div'); el.className = 'gt-float'; el.textContent = txt; el.style.color = color;
  el.style.left = (r.left + 10) + 'px'; el.style.top = (r.bottom + 4) + 'px';
  document.body.appendChild(el); setTimeout(() => el.remove(), 1300);
}

/* ---------- screens ---------- */
const SCR = ['Home', 'Setup', 'Lobby', 'Live', 'Report', 'Join', 'Wait', 'Play', 'Class', 'Done'];
function show(n) { SCR.forEach(s => { $('scr' + s).hidden = s !== n; }); window.scrollTo(0, 0); }
document.addEventListener('click', e => { const g = e.target.closest('[data-go]'); if (g) { e.preventDefault(); go(g.dataset.go); } });
function go(w) {
  if (w === 'home') { leaveAll(); show('Home'); renderResume(); }
  else if (w === 'host' || w === 'solo') { setupMode = w; openSetup(); }
  else if (w === 'join') { show('Join'); setTimeout(() => $(($('jCode').value ? 'jName' : 'jCode')).focus(), 50); }
}
function leaveAll() {
  stopGame();
  if (NETP.link) { NETP.link.close(); NETP.link = null; }
  if (H.net && H.phase === 'end') { H.net.close(); H.net = null; }
  P.over = true; clearInterval(P.tick);
  closeQ(false);
}

/* ================= SETUP: questions ================= */
let setupMode = 'host';
let Qs = LS.get('aigt-qs-v1', []);
const saveQs = () => LS.set('aigt-qs-v1', Qs);
function qStatus(msg, cls) { const s = $('qStatus'); s.className = 'status' + (cls ? ' ' + cls : ''); s.innerHTML = msg; }
function openSetup() {
  $('setupTitle').textContent = setupMode === 'host' ? 'Host a game' : 'Practise solo';
  $('createBtn').textContent = setupMode === 'host' ? 'Create game room' : 'Start playing';
  $('boardOpt').hidden = setupMode !== 'host';
  $('modeOpt').hidden = setupMode !== 'host';
  const s = LS.get('aigt-settings-v1', null);
  if (s && (s.v || 0) < 3 && !(s.games || []).includes('quest')) s.games = (s.games || []).concat(['quest']);
  if (s && !s.v) s.games = (s.games || []).concat(['tycoon', 'race', 'tambola', 'crossword', 'wordsearch']);
  if (s) { $('sDur').value = s.dur; $('sCoins').value = s.coins; document.querySelectorAll('.sGame').forEach(c => { c.checked = s.games.includes(c.value); }); $('sBoard').checked = s.board !== false; if (s.mode && MODE_META[s.mode]) $('sMode').value = s.mode; if (s.qsec) $('sQsec').value = s.qsec; if (s.csec != null) $('sCsec').value = s.csec; }
  if (setupMode !== 'host') $('sMode').value = 'free';
  updateMode(); renderQs(); show('Setup');
}
document.querySelectorAll('.gt-tab').forEach(t => t.onclick = () => {
  document.querySelectorAll('.gt-tab').forEach(x => x.classList.toggle('on', x === t));
  document.querySelectorAll('[data-pane]').forEach(p => { p.hidden = p.dataset.pane !== t.dataset.tab; });
  qStatus('');
});
function addQs(list, label) {
  const have = new Set(Qs.map(q => q.q.toLowerCase().trim()));
  let n = 0;
  list.forEach(q => { const k = q.q.toLowerCase().trim(); if (!have.has(k)) { have.add(k); Qs.push({ q: q.q, options: q.options, answer: q.answer }); n++; } });
  saveQs(); renderQs();
  return n;
}
function renderQs() {
  $('qCount').textContent = `(${Qs.length})`;
  $('qList').innerHTML = Qs.length ? Qs.map((q, i) => `<div class="gt-qi"><div class="qq">${i + 1}. ${esc(q.q)}</div><ol>${q.options.map((o, j) => `<li${j === q.answer ? ' class="c"' : ''}>${esc(o)}</li>`).join('')}</ol><button class="x" data-del="${i}" title="Remove question" aria-label="Remove question ${i + 1}">×</button></div>`).join('')
    : '<p class="note">No questions yet. Add some above. You need at least 5.</p>';
  checkCreate();
}
$('qList').addEventListener('click', e => { const b = e.target.closest('[data-del]'); if (!b) return; Qs.splice(+b.dataset.del, 1); saveQs(); renderQs(); });
$('qClear').onclick = () => { if (!Qs.length || confirm('Remove all ' + Qs.length + ' questions?')) { Qs = []; saveQs(); renderQs(); } };
function checkCreate() {
  const mode = $('sMode').value, games = [...document.querySelectorAll('.sGame:checked')].length;
  const pool = window.AIGT_KIT ? window.AIGT_KIT.pool(Qs).length : 99;
  const err = Qs.length < 5 ? `Add at least 5 questions (you have ${Qs.length}).` : mode === 'free' && !games ? 'Pick at least one game.' : mode === 'tambola' && pool < 9 ? `Tambola needs at least 9 questions with different answers (you have ${pool}).` : '';
  $('createBtn').disabled = !!err;
  $('createStatus').className = 'status';
  $('createStatus').textContent = err;
}
function updateMode() {
  const m = $('sMode').value;
  $('modeNote').textContent = MODE_META[m].note;
  $('gamesOpt').hidden = m !== 'free'; $('raceOpt').hidden = m !== 'race'; $('tamOpt').hidden = m !== 'tambola';
  $('coinNote').innerHTML = m === 'race' ? '<b>Coins:</b> correct answer +10, plus up to +10 for speed. No answer or a wrong answer scores 0.'
    : m === 'tambola' ? '<b>Coins:</b> each correct mark +3 · marking an answer that has not been called −2 · Early Five +20 · each line +25 · Full House +60 · a false claim (bogie) −10.'
    : '<b>Coins:</b> correct answer +10 (plus up to +10 streak bonus) · dice roll −5 · Jump Quest level −10 · snake, capture or fall −10 if the rescue question is missed · Tycoon: buy companies and collect rent · word games: +10 a word.';
  checkCreate();
}
document.querySelectorAll('.sGame').forEach(c => c.onchange = checkCreate);
$('sMode').onchange = updateMode;
function readSettings() {
  const s = { dur: +$('sDur').value, coins: +$('sCoins').value, games: [...document.querySelectorAll('.sGame:checked')].map(c => c.value), board: $('sBoard').checked, mode: setupMode === 'host' ? $('sMode').value : 'free', qsec: +$('sQsec').value, csec: +$('sCsec').value, v: 3 };
  LS.set('aigt-settings-v1', s); return s;
}

/* --- from PDF --- */
let pdfDoc = null, pdfLabel = '';
async function openPdf(file) {
  if (!file) return;
  if (!/\.pdf$/i.test(file.name) && file.type !== 'application/pdf') { qStatus('That file is not a PDF.', 'err'); return; }
  qStatus('Opening ' + esc(file.name) + '…');
  try {
    pdfDoc = await window.AIQGen.openPdf(file); pdfLabel = file.name;
    $('pdfName').innerHTML = `<b>${esc(file.name)}</b> · ${pdfDoc.numPages} page${pdfDoc.numPages > 1 ? 's' : ''} ·`;
    $('pFrom').value = 1; $('pTo').value = Math.min(pdfDoc.numPages, 50); $('pFrom').max = $('pTo').max = pdfDoc.numPages;
    $('rangeRow').hidden = false;
    if (pdfDoc.numPages > 50) qStatus(`This PDF has ${pdfDoc.numPages} pages. Pick up to 50 pages (for example one chapter), then press <b>Make questions</b>.`);
    else readPdf();
  } catch (e) {
    qStatus(/password/i.test(e && e.message) ? 'This PDF is password-protected. Remove the password and try again.' : 'Sorry, this PDF could not be opened. Check your internet connection (the PDF reader loads once) or paste MCQs instead.', 'err');
  }
}
async function readPdf() {
  if (!pdfDoc) return;
  let a = Math.max(1, Math.min(pdfDoc.numPages, +$('pFrom').value || 1)), b = Math.max(a, Math.min(pdfDoc.numPages, +$('pTo').value || a));
  if (b - a + 1 > 50) { b = a + 49; $('pTo').value = b; }
  $('pdfGo').disabled = true;
  try {
    const pages = await window.AIQGen.readPages(pdfDoc, a, b, n => qStatus(`Reading page ${n} of ${b}…`));
    const chars = pages.reduce((s, p) => s + p.lines.reduce((t, l) => t + l.t.length, 0), 0);
    if (chars < 60 * pages.length) { qStatus('Very little text was found. This PDF looks like scanned images, which cannot be read. Try a text-based PDF or paste your MCQs.', 'err'); return; }
    qStatus('Making questions…');
    const made = window.AIQGen.generate(pages, 30);
    if (made.length < 3) { qStatus('Only a few questions could be made from these pages. Try more pages, or notes that define key terms and list key points.', 'err'); return; }
    const n = addQs(made);
    qStatus(`Made <b>${n}</b> questions from ${esc(pdfLabel)} (pages ${a}–${b}). Check them below and remove any that don't fit.`, 'ok');
  } catch (e) { qStatus('Something went wrong while reading the PDF. Try fewer pages.', 'err'); }
  finally { $('pdfGo').disabled = false; }
}
$('pdfFile').addEventListener('change', e => { openPdf(e.target.files[0]); e.target.value = ''; });
$('pdfGo').onclick = readPdf;
const drop = $('drop');
['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('over'); }));
['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('over'); }));
drop.addEventListener('drop', e => { const f = e.dataTransfer.files[0]; if (f) openPdf(f); });

/* --- own MCQs: block format or CSV --- */
function csvRows(text) {
  const rows = []; let row = [], f = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === ',' || c === '\t') { row.push(f); f = ''; }
    else if (c === '\n') { row.push(f); rows.push(row); row = []; f = ''; }
    else if (c !== '\r') f += c;
  }
  row.push(f); rows.push(row);
  return rows.map(r => r.map(x => x.trim())).filter(r => r.some(Boolean));
}
function answerIndex(raw, options) {
  raw = String(raw || '').trim().replace(/^\(|\)$/g, '');
  if (/^[A-Fa-f]$/.test(raw)) return raw.toUpperCase().charCodeAt(0) - 65;
  if (/^[1-6]$/.test(raw)) return +raw - 1;
  const m = raw.match(/^([A-Fa-f])[).:\s]/); if (m) return m[1].toUpperCase().charCodeAt(0) - 65;
  return options.findIndex(o => o.toLowerCase() === raw.toLowerCase());
}
function parseMCQs(text) {
  text = text.replace(/\r/g, '').replace(/ /g, ' ');
  const out = []; let bad = 0;
  const lines = text.split('\n').filter(l => l.trim());
  const OPT = /^\s*(\*)?\s*\(?([A-Fa-f])\s*[).:\]]\s*(.+?)\s*(\*|\(correct\)|✓|✔)?\s*$/i;
  const looksCSV = lines.length && !lines.some(l => OPT.test(l)) && csvRows(lines[0]).length && lines.filter(l => csvRows(l)[0] && csvRows(l)[0].length >= 4).length >= lines.length * 0.6;
  if (looksCSV) {
    csvRows(text).forEach((r, i) => {
      if (i === 0 && /question/i.test(r[0])) return;
      const cells = r.filter((x, j) => x || j < 2);
      if (cells.length < 4) { bad++; return; }
      const q = cells[0], ans = cells[cells.length - 1], options = cells.slice(1, -1).filter(Boolean).slice(0, 6);
      const k = answerIndex(ans, options);
      if (options.length < 2 || k < 0 || k >= options.length) { bad++; return; }
      out.push({ q, options, answer: k });
    });
    return { out, bad };
  }
  const ANS = /^\s*(?:ans(?:wer)?|correct(?:\s+answer)?|key|solution)\s*[:\-–=.]?\s*(.+)$/i;
  let cur = null;
  const finish = () => {
    if (!cur) return;
    if (cur.q && cur.options.length >= 2) {
      let k = cur.ans != null ? answerIndex(cur.ans, cur.options) : cur.star;
      if (k != null && k >= 0 && k < cur.options.length) out.push({ q: cur.q, options: cur.options.slice(0, 6), answer: k }); else bad++;
    } else if (cur.q) bad++;
    cur = null;
  };
  lines.forEach(l => {
    const am = l.match(ANS), om = l.match(OPT);
    if (am && cur && cur.options.length) { cur.ans = am[1]; return; }
    if (om && cur && (cur.options.length || cur.q)) {
      const k = om[2].toUpperCase().charCodeAt(0) - 65;
      if (k === cur.options.length) { cur.options.push(om[3].replace(/\s*\*$/, '')); if (om[1] || om[4]) cur.star = k; return; }
    }
    if (cur && cur.options.length) finish();
    const qt = l.replace(/^\s*(?:q(?:uestion)?\s*\d*\s*[.:)\-]|\d{1,3}\s*[.):]|\(\d{1,3}\))\s*/i, '').trim();
    if (!cur) cur = { q: qt, options: [], ans: null, star: null };
    else cur.q += ' ' + qt;
  });
  finish();
  return { out, bad };
}
function addPasted(text, label) {
  const { out, bad } = parseMCQs(text);
  if (!out.length) { qStatus('No questions could be read. Check the format: a question, then lines starting A) B) C) D), then <b>Answer: B</b>.', 'err'); return; }
  const n = addQs(out);
  qStatus(`Added <b>${n}</b> question${n === 1 ? '' : 's'}${label ? ' from ' + esc(label) : ''}.${out.length > n ? ` ${out.length - n} duplicate${out.length - n === 1 ? ' was' : 's were'} skipped.` : ''}${bad ? ` <span style="color:var(--bad)">${bad} could not be read (missing options or answer).</span>` : ''}`, 'ok');
}
$('mcqGo').onclick = () => { const t = $('mcqText').value.trim(); if (!t) { qStatus('Paste or type your questions first.', 'err'); return; } addPasted(t); };
$('mcqFile').addEventListener('change', async e => { const f = e.target.files[0]; e.target.value = ''; if (!f) return; addPasted(await f.text(), f.name); });
$('tplBtn').onclick = () => {
  const csv = 'question,option A,option B,option C,option D,answer\n"What does MVP stand for?",Most valuable player,Minimum viable product,Maximum value proposition,Market validation plan,B\n"Which is NOT one of the 4Ps of marketing?",Product,Price,People,Promotion,C\n';
  download('aigametools-questions-template.csv', csv, 'text/csv');
};
function download(name, text, type) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + text], { type: type + ';charset=utf-8' })); a.download = name;
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}

/* --- ready-made sets --- */
const mk = (q, right, ...wrong) => ({ q, options: [right, ...wrong], answer: 0 });
const SETS = {
  'Key terms (great for word games)': [
    mk('The middle value of an ordered data set is the…', 'Median', 'Mean', 'Mode', 'Range'),
    mk('The value that occurs most often in a data set is the…', 'Mode', 'Median', 'Mean', 'Range'),
    mk('Largest value minus smallest value gives the…', 'Range', 'Variance', 'Median', 'Mode'),
    mk('A clear, step-by-step set of instructions that solves a problem is an…', 'Algorithm', 'Database', 'Browser', 'Compiler'),
    mk('The instruction you type to a generative AI tool is called a…', 'Prompt', 'Token', 'Dataset', 'Plugin'),
    mk('The small unit of text a language model reads and writes is a…', 'Token', 'Prompt', 'Pixel', 'Byte'),
    mk('Money a firm earns from sales before any costs are taken away is…', 'Revenue', 'Profit', 'Equity', 'Margin'),
    mk('Revenue minus all costs is…', 'Profit', 'Revenue', 'Turnover', 'Capital'),
    mk('Something a business owns that has economic value is an…', 'Asset', 'Liability', 'Expense', 'Invoice'),
    mk('A general, sustained rise in prices in an economy is…', 'Inflation', 'Deflation', 'Recession', 'Depreciation'),
    mk('The simplest version of a product used to test an idea with real users (short form)', 'MVP', 'KPI', 'ROI', 'CRM'),
    mk('Customers who stop using a product in a period are measured as…', 'Churn', 'Retention', 'Conversion', 'Reach'),
    mk('Dividing a market into groups of buyers with similar needs is…', 'Segmentation', 'Positioning', 'Branding', 'Pricing'),
    mk('The marketing-mix P that covers where and how a product is sold is…', 'Place', 'Price', 'Promotion', 'People')
  ],
  'AI basics': [
    mk('What does LLM stand for?', 'Large language model', 'Linear learning machine', 'Logical language module', 'Layered logic model'),
    mk('Machine learning systems mainly learn from…', 'Data and examples', 'Hand-written rules only', 'Random guesses', 'Faster hardware'),
    mk('An AI “hallucination” is…', 'A confident answer that is false or made up', 'A hardware fault', 'A special visual effect', 'A very fast response'),
    mk('Which is an example of supervised learning?', 'Training a spam filter on emails labelled spam or not spam', 'Grouping customers without any labels', 'A robot learning only from rewards', 'Sorting files alphabetically'),
    mk('Grouping customers into segments without labels is called…', 'Clustering', 'Regression', 'Classification', 'Reinforcement learning'),
    mk('Predicting the price of a house (a number) is a…', 'Regression task', 'Clustering task', 'Classification task', 'Translation task'),
    mk('In machine learning, overfitting means the model…', 'Learns the training data too closely and does poorly on new data', 'Is too simple to learn anything', 'Runs out of memory', 'Trains too quickly'),
    mk('A prompt is…', 'The instruction or input given to a generative AI model', 'The model’s training data', 'A type of computer chip', 'An error message'),
    mk('Learning by trial and error with rewards and penalties is called…', 'Reinforcement learning', 'Clustering', 'Regression', 'Tokenisation'),
    mk('Generative AI refers to models that…', 'Create new content such as text, images or audio', 'Only store data', 'Only sort lists', 'Only detect viruses'),
    mk('Why do we keep a separate test set of data?', 'To check how well the model works on data it has not seen', 'To make training faster', 'To store backups', 'To increase the data size'),
    mk('Computer vision is the area of AI that deals with…', 'Understanding images and video', 'Understanding sound only', 'Managing spreadsheets', 'Building networks')
  ],
  'Marketing basics': [
    mk('The 4Ps of marketing are…', 'Product, Price, Place, Promotion', 'Product, Profit, People, Process', 'Price, Plan, Place, Profit', 'Promotion, Packaging, People, Positioning'),
    mk('STP in marketing stands for…', 'Segmentation, Targeting, Positioning', 'Sales, Trade, Promotion', 'Strategy, Tactics, Planning', 'Selling, Testing, Pricing'),
    mk('Dividing a market into groups with similar needs is called…', 'Segmentation', 'Positioning', 'Branding', 'Distribution'),
    mk('A unique selling proposition (USP) is…', 'What makes a product different from and better than competitors', 'The lowest price in the market', 'A sales target', 'A type of discount'),
    mk('SWOT stands for…', 'Strengths, Weaknesses, Opportunities, Threats', 'Sales, Wages, Orders, Targets', 'Strategy, Work, Objectives, Tactics', 'Strengths, Wins, Options, Trends'),
    mk('Which part of SWOT is an external factor?', 'Threats', 'Strengths', 'Weaknesses', 'Brand reputation'),
    mk('Penetration pricing means…', 'Starting with a low price to win market share quickly', 'Starting with a high price and lowering it later', 'Adding a fixed margin to cost', 'Giving the product away free forever'),
    mk('Setting a high launch price and lowering it over time is…', 'Price skimming', 'Penetration pricing', 'Psychological pricing', 'Bundle pricing'),
    mk('In the product life cycle, sales grow fastest in the…', 'Growth stage', 'Introduction stage', 'Maturity stage', 'Decline stage'),
    mk('Customer acquisition cost (CAC) is…', 'Sales and marketing spend divided by new customers acquired', 'Revenue divided by profit', 'The price of the product', 'The number of customers lost'),
    mk('Conversion rate is…', 'The percentage of visitors who complete a desired action', 'The number of website visits', 'The cost of an advert', 'The growth in revenue'),
    mk('Word-of-mouth marketing relies on…', 'Customers recommending a product to others', 'TV adverts only', 'Cold calling', 'Price cuts')
  ],
  'Product management': [
    mk('A minimum viable product (MVP) is…', 'The smallest version that lets a team learn the most with the least effort', 'The final product with fewer bugs', 'The most expensive version', 'A marketing plan'),
    mk('RICE prioritisation stands for…', 'Reach, Impact, Confidence, Effort', 'Revenue, Income, Cost, Expense', 'Risk, Impact, Cost, Efficiency', 'Reach, Interest, Cost, Engagement'),
    mk('The RICE score is calculated as…', '(Reach × Impact × Confidence) / Effort', 'Reach + Impact + Confidence + Effort', 'Effort / (Reach × Impact)', 'Reach × Effort'),
    mk('A North Star metric is…', 'The single measure that best captures the value a product delivers', 'The company’s total revenue', 'The number of employees', 'A metric used only by investors'),
    mk('In the Kano model, “must-be” features are ones that…', 'Customers expect, and are unhappy when missing', 'Surprise and delight customers', 'Customers don’t care about', 'Some customers prefer without'),
    mk('Jobs-to-be-done sees customers as…', 'Hiring a product to make progress in a situation', 'Employees of the company', 'Only price-sensitive buyers', 'Data points in a survey'),
    mk('An A/B test…', 'Shows two versions to different users and compares a metric', 'Tests a product in two countries', 'Compares two competitors', 'Checks code for bugs'),
    mk('Churn rate is…', 'The percentage of customers who stop using a product in a period', 'The number of new sign-ups', 'The speed of a website', 'The price increase each year'),
    mk('Many subscription businesses aim for an LTV to CAC ratio of at least…', '3:1', '1:1', '1:3', '1:10'),
    mk('Freemium is a pricing model that…', 'Offers a basic product free and charges for premium features', 'Charges everyone the same price', 'Is always free with ads', 'Charges per hour of use'),
    mk('A Now-Next-Later roadmap groups work by…', 'Time horizon instead of exact dates', 'Team size', 'Budget', 'Customer age'),
    mk('Good customer interviews ask about…', 'Past behaviour rather than opinions about the future', 'What price the customer would pay', 'Whether they like the idea', 'Their favourite features')
  ],
  'Business statistics': [
    mk('What is the mean of 2, 4, 6 and 8?', '5', '4', '6', '20'),
    mk('What is the median of 3, 9, 1, 7, 5?', '5', '7', '3', '9'),
    mk('What is the mode of 2, 3, 3, 5, 7?', '3', '2', '5', '4'),
    mk('What is the range of 4, 10, 7, 15?', '11', '15', '9', '4'),
    mk('Which measure is most affected by extreme values?', 'Mean', 'Median', 'Mode', 'Interquartile range'),
    mk('Standard deviation measures…', 'How spread out values are around the mean', 'The most common value', 'The middle value', 'The total of all values'),
    mk('Variance is…', 'The square of the standard deviation', 'The square root of the mean', 'Half the range', 'The same as the median'),
    mk('In a perfectly symmetrical distribution…', 'Mean, median and mode are equal', 'The mean is always zero', 'The mode is larger than the mean', 'There is no median'),
    mk('In a right (positively) skewed distribution, the mean is usually…', 'Greater than the median', 'Less than the median', 'Equal to the mode', 'Zero'),
    mk('The coefficient of variation is…', '(Standard deviation / Mean) × 100', 'Mean × Median', 'Range / 2', 'Variance − Mean'),
    mk('A sample is…', 'A subset of the population', 'The whole population', 'A type of average', 'A chart'),
    mk('The interquartile range is…', 'Q3 − Q1', 'Q1 + Q3', 'Maximum − Minimum', 'Median − Mean')
  ]
};
$('sets').innerHTML = Object.keys(SETS).map(k => `<button class="gt-set" data-set="${esc(k)}"><b>${esc(k)}</b><small>${SETS[k].length} questions</small></button>`).join('');
$('sets').addEventListener('click', e => { const b = e.target.closest('[data-set]'); if (!b) return; const n = addQs(SETS[b.dataset.set].map(q => { const o = shuffle(q.options.map((t, i) => ({ t, i }))); return { q: q.q, options: o.map(x => x.t), answer: o.findIndex(x => x.i === q.answer) }; })); qStatus(n ? `Added <b>${n}</b> questions from ${esc(b.dataset.set)}.` : 'Those questions are already in your list.', 'ok'); });

$('createBtn').onclick = () => { const s = readSettings(); if (setupMode === 'host') hostCreate(s); else startSolo(s); };

/* ================= NETWORK ================= */
const NET = {
  async host(code, h) {
    if (LOCAL) {
      const ch = new BroadcastChannel('aigt-' + code);
      ch.onmessage = e => { const m = e.data; if (m.to !== 'host') return; if (m.k === 'bye') h.close(m.from); else h.msg(m.from, m.d); };
      return { send(cid, d) { ch.postMessage({ to: cid, d }); }, close() { ch.close(); } };
    }
    await loadScript(PEERJS);
    return new Promise((res, rej) => {
      const peer = new window.Peer('aijgt-' + code.toLowerCase(), { debug: 0 });
      const conns = new Map(); let n = 0, opened = false;
      const api = {
        send(cid, d) { const c = conns.get(cid); if (c && c.open) try { c.send(d); } catch (e) {} },
        close() { try { peer.destroy(); } catch (e) {} }
      };
      peer.on('open', () => { opened = true; res(api); });
      peer.on('error', e => { if (!opened) rej(e); else if (h.status) h.status(e.type); });
      peer.on('disconnected', () => { if (!peer.destroyed) setTimeout(() => { try { peer.reconnect(); } catch (e) {} }, 1500); });
      peer.on('connection', conn => {
        const cid = 'c' + (++n);
        conns.set(cid, conn);
        conn.on('data', d => h.msg(cid, d));
        conn.on('close', () => { conns.delete(cid); h.close(cid); });
        conn.on('error', () => {});
      });
    });
  },
  async join(code, h) {
    if (LOCAL) {
      const me = 'b' + Math.random().toString(36).slice(2, 9);
      const ch = new BroadcastChannel('aigt-' + code);
      ch.onmessage = e => { if (e.data.to === me) h.msg(e.data.d); };
      const bye = () => ch.postMessage({ to: 'host', from: me, k: 'bye' });
      window.addEventListener('pagehide', bye);
      setTimeout(() => h.open(), 30);
      return { send(d) { ch.postMessage({ to: 'host', from: me, d }); }, close() { bye(); ch.close(); } };
    }
    await loadScript(PEERJS);
    let peer = null, conn = null, closed = false, tries = 0, rt = null;
    const retry = why => { h.down(why, tries); if (closed || rt) return; tries++; rt = setTimeout(() => { rt = null; connect(); }, Math.min(8000, 1200 * tries)); };
    const dial = () => {
      if (closed) return;
      conn = peer.connect('aijgt-' + code.toLowerCase(), { reliable: true });
      conn.on('open', () => { tries = 0; h.open(); });
      conn.on('data', d => h.msg(d));
      conn.on('close', () => { if (!closed) retry('closed'); });
      conn.on('error', () => {});
    };
    const connect = () => {
      if (closed) return;
      if (!peer || peer.destroyed) {
        peer = new window.Peer({ debug: 0 });
        peer.on('open', dial);
        peer.on('error', e => { if (closed) return; retry(e.type === 'peer-unavailable' ? 'notfound' : 'network'); });
        peer.on('disconnected', () => { if (!peer.destroyed && !closed) setTimeout(() => { try { peer.reconnect(); } catch (e) {} }, 1000); });
      } else if (peer.open) dial();
      else { try { peer.destroy(); } catch (e) {} peer = null; connect(); }
    };
    connect();
    return { send(d) { if (conn && conn.open) try { conn.send(d); } catch (e) {} }, close() { closed = true; clearTimeout(rt); try { peer && peer.destroy(); } catch (e) {} } };
  }
};
const CODE_CH = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const genCode = () => Array.from({ length: 5 }, () => CODE_CH[Math.floor(Math.random() * CODE_CH.length)]).join('');
const joinUrl = code => location.origin + location.pathname + '?join=' + code + (LOCAL ? '&local=1' : '');

/* ================= HOST ================= */
const H = { net: null, code: '', questions: [], settings: null, phase: 'none', endsAt: null, players: {}, cids: {}, qstats: [], tick: null };
let saveHT = null;
function saveH() {
  clearTimeout(saveHT);
  saveHT = setTimeout(() => LS.set('aigt-host-v1', { code: H.code, questions: H.questions, settings: H.settings, phase: H.phase, endsAt: H.endsAt, players: H.players, qstats: H.qstats, cls: H.cls ? Object.assign({}, H.cls, { timer: null, auto: null }) : null, t: Date.now() }), 300);
}
async function hostOpen(code) {
  const handlers = {
    msg: (cid, d) => hostMsg(cid, d),
    close: cid => { const pid = H.cids[cid]; delete H.cids[cid]; if (pid && H.players[pid] && !Object.values(H.cids).includes(pid)) { H.players[pid].online = false; renderHost(); } },
    status: t => { $('netStatus').textContent = t === 'network' || t === 'server-error' ? 'Connection to the relay dropped. Reconnecting…' : ''; }
  };
  H.net = await NET.host(code, handlers);
  H.code = code;
}
async function hostCreate(settings) {
  $('createBtn').disabled = true;
  const cs = $('createStatus'); cs.className = 'status'; cs.textContent = 'Creating your game room…';
  H.questions = Qs.slice(); H.settings = settings; H.players = {}; H.cids = {}; H.phase = 'lobby'; H.endsAt = null;
  H.qstats = H.questions.map(() => ({ n: 0, ok: 0 }));
  if (H.net) { H.net.close(); H.net = null; }
  let ok = false;
  for (let i = 0; i < 4 && !ok; i++) {
    try { await hostOpen(genCode()); ok = true; }
    catch (e) { if (!(e && e.type === 'unavailable-id')) { cs.className = 'status err'; cs.textContent = 'Could not create a room. Check your internet connection and try again.' + (e && e.type ? ` (${e.type})` : ''); $('createBtn').disabled = false; return; } }
  }
  if (!ok) { cs.className = 'status err'; cs.textContent = 'Could not create a room. Please try again.'; $('createBtn').disabled = false; return; }
  cs.textContent = ''; $('createBtn').disabled = false;
  saveH(); openLobby();
}
function openLobby() {
  $('lobbyCode').textContent = H.code;
  $('joinHost').textContent = location.host + location.pathname;
  $('joinUrl').textContent = joinUrl(H.code);
  $('lobbyInfo').innerHTML = `${H.questions.length} questions · ${H.settings.dur ? H.settings.dur + ' minutes' : 'no time limit'} · ${isClass(H.settings) ? MODE_META[H.settings.mode].title + ' for the whole class' : H.settings.games.map(g => GAME_META[g].title).join(', ')}.<br>Keep this tab open until the game ends. Students need internet on their phones.`;
  const qr = $('qr'); qr.hidden = true;
  loadScript(QRLIB).then(() => {
    const q = window.qrcode(0, 'M'); q.addData(joinUrl(H.code)); q.make();
    let svg = q.createSvgTag(4, 0);
    const m = svg.match(/width="(\d+)px" height="(\d+)px"/) || svg.match(/width="(\d+)" height="(\d+)"/);
    if (m && !/viewBox/.test(svg)) svg = svg.replace('<svg ', `<svg viewBox="0 0 ${m[1]} ${m[2]}" `);
    qr.innerHTML = svg; qr.hidden = false;
  }).catch(() => {});
  renderHost(); show('Lobby');
}
function uniqueName(name, pid) {
  name = String(name || 'Player').replace(/[<>]/g, '').trim().slice(0, 18) || 'Player';
  const taken = new Set(Object.values(H.players).filter(p => p.pid !== pid).map(p => p.name.toLowerCase()));
  let n = name, i = 2; while (taken.has(n.toLowerCase())) n = name + ' ' + i++;
  return n;
}
function remaining() { return H.endsAt ? Math.max(0, H.endsAt - Date.now()) : null; }
function hostMsg(cid, d) {
  if (!d || typeof d !== 'object') return;
  if (d.t === 'hello') {
    const pid = String(d.pid || cid).slice(0, 20);
    let p = H.players[pid];
    if (!p) {
      if (H.phase === 'end') { H.net.send(cid, { t: 'end', rank: 0, n: 0, top: [] }); return; }
      p = H.players[pid] = { pid, name: uniqueName(d.name, pid), coins: H.settings.coins, correct: 0, wrong: 0, wins: 0, best: 0, game: '', joined: Date.now() };
      if (d.stats && typeof d.stats.coins === 'number') Object.assign(p, pickStats(d.stats));
    }
    p.online = true; H.cids[cid] = pid;
    H.net.send(cid, { t: 'welcome', pid, name: p.name, questions: H.questions, settings: H.settings, phase: H.phase, left: remaining(), stats: pickStats(p) });
    if (H.phase === 'end') sendEnd(cid, pid);
    else if (H.phase === 'play' && isClass(H.settings)) classJoin(cid, p);
    renderHost(); saveH();
    return;
  }
  const pid = H.cids[cid], p = pid && H.players[pid]; if (!p) return;
  if (isClass(H.settings)) { classMsg(cid, p, d); return; }
  if (d.t === 'stat') { Object.assign(p, pickStats(d)); renderHostSoon(); saveH(); }
  else if (d.t === 'pv') { p.pv = { s: String(d.s || '').slice(0, 80), p: Math.max(0, Math.min(100, +d.p || 0)) }; renderHostSoon(); }
  else if (d.t === 'ev') { feedAdd(p.name, String(d.x || '').slice(0, 80)); }
  else if (d.t === 'ans' && H.qstats[d.qi]) { H.qstats[d.qi].n++; if (d.ok) H.qstats[d.qi].ok++; renderHostSoon(); saveH(); }
}
function pickStats(s) {
  const n = v => Math.max(0, Math.min(1e7, Math.round(+v || 0)));
  return { coins: n(s.coins), correct: n(s.correct), wrong: n(s.wrong), wins: n(s.wins), best: n(s.best), game: GAME_META[s.game] ? s.game : '' };
}
const ranked = () => Object.values(H.players).sort((a, b) => b.coins - a.coins || b.correct - a.correct || a.joined - b.joined);
let rhT = null; function renderHostSoon() { if (!rhT) rhT = setTimeout(() => { rhT = null; renderHost(); }, 400); }
function renderHost() {
  if (PJ.open) renderProj();
  const ps = ranked();
  if (H.phase === 'lobby') {
    $('pCount').textContent = `(${ps.length})`;
    $('pList').innerHTML = ps.length ? ps.map(p => `<span class="gt-chip${p.online ? '' : ' off'}">${esc(p.name)}</span>`).join('') : '<span class="note">Waiting for students to join…</span>';
    $('startBtn').disabled = !ps.length;
  }
  if (H.phase === 'play') {
    const max = Math.max(1, ...ps.map(p => p.coins));
    $('liveBoard').innerHTML = ps.length ? ps.slice(0, 40).map((p, i) => {
      const tot = p.correct + p.wrong;
      return `<div class="gt-bar"><div class="fill" style="width:${(p.coins / max * 100).toFixed(1)}%"></div><span class="rk">${i + 1}</span><span class="nm">${esc(p.name)}<small>${p.game ? GAME_META[p.game].em + ' ' : ''}${tot ? Math.round(p.correct / tot * 100) + '% right' : ''}${p.online ? '' : ' · offline'}</small></span><span class="cn">🪙 ${p.coins.toLocaleString('en-IN')}</span></div>`;
    }).join('') : '<p class="note">No players yet. Students can still join with the code.</p>';
    const c = ps.reduce((s, p) => s + p.correct, 0), w = ps.reduce((s, p) => s + p.wrong, 0);
    $('stPlayers').textContent = ps.length; $('stAnswers').textContent = c + w;
    $('stAcc').textContent = c + w ? Math.round(c / (c + w) * 100) + '%' : '–';
    $('stWins').textContent = ps.reduce((s, p) => s + p.wins, 0);
  }
}
function boardFor(pid) {
  const ps = ranked(), i = ps.findIndex(p => p.pid === pid);
  if (!H.settings.board) return { t: 'board', left: remaining() };
  return { t: 'board', left: remaining(), rank: i + 1, n: ps.length, top: ps.slice(0, 5).map(p => ({ n: p.name, c: p.coins, me: p.pid === pid })), mine: i >= 0 ? ps[i].coins : 0 };
}
function broadcastBoard() { Object.entries(H.cids).forEach(([cid, pid]) => H.net.send(cid, boardFor(pid))); }
function hostStart() {
  H.phase = 'play'; H.endsAt = H.settings.dur ? Date.now() + H.settings.dur * 60000 : null;
  Object.keys(H.cids).forEach(cid => H.net.send(cid, { t: 'start', left: remaining() }));
  $('liveCode').textContent = H.code; show('Live'); renderHost(); saveH(); hostTicker();
  if (isClass(H.settings)) classStart(); else { H.cls = null; $('classHost').hidden = true; }
}
function hostTicker() {
  clearInterval(H.tick); let k = 0;
  const step = () => {
    const left = remaining();
    $('liveTimer').textContent = left == null ? 'No limit' : fmtTime(left);
    $('liveTimer').classList.toggle('low', left != null && left < 60000);
    if (left === 0) { hostEnd(); return; }
    if (k++ % 2 === 0) broadcastBoard();
  };
  step(); H.tick = setInterval(step, 1000);
}
function sendEnd(cid, pid) {
  const ps = ranked(), i = ps.findIndex(p => p.pid === pid);
  H.net.send(cid, { t: 'end', rank: i + 1, n: ps.length, coins: i >= 0 ? ps[i].coins : 0, top: ps.slice(0, 5).map(p => ({ n: p.name, c: p.coins, me: p.pid === pid })) });
}
function hostEnd() {
  classStop(); projClose();
  clearInterval(H.tick); H.phase = 'end'; H.endsAt = null; saveH();
  Object.entries(H.cids).forEach(([cid, pid]) => sendEnd(cid, pid));
  sfx('win'); renderReport(); show('Report');
}
$('startBtn').onclick = hostStart;
$('endBtn').onclick = () => { if (confirm('End the game for everyone now?')) hostEnd(); };
$('addTime').onclick = () => { if (H.endsAt) H.endsAt += 120000; else { H.endsAt = Date.now() + 120000; } saveH(); broadcastBoard(); toast('Added 2 minutes'); };
$('lobbyCancel').onclick = () => { if (H.net) H.net.close(); H.net = null; H.phase = 'none'; LS.del('aigt-host-v1'); show('Setup'); };
$('againBtn').onclick = () => { Qs = H.questions.slice(); saveQs(); hostCreate(H.settings); };
window.addEventListener('beforeunload', e => { if (H.phase === 'play' || H.phase === 'lobby') { e.preventDefault(); e.returnValue = ''; } });
function renderReport() {
  const ps = ranked();
  const colors = ['#f5a623', '#9aa7bd', '#c98b5a'], heights = [130, 100, 80];
  $('podium').innerHTML = ps.length ? [1, 0, 2].filter(i => ps[i]).map(i => `<div class="gt-pod"><div class="n">${esc(ps[i].name)}</div><div class="c">🪙 ${ps[i].coins.toLocaleString('en-IN')}</div><div class="blk" style="height:${heights[i]}px;background:${colors[i]}">${i + 1}</div></div>`).join('') : '<p class="note">No one joined this game.</p>';
  const acc = p => p.correct + p.wrong ? Math.round(p.correct / (p.correct + p.wrong) * 100) : null;
  $('repPlayers').innerHTML = '<tr><th>#</th><th>Name</th><th>Coins</th><th>Correct</th><th>Wrong</th><th>Accuracy</th><th>Games won</th><th>Best streak</th></tr>' +
    ps.map((p, i) => `<tr><td>${i + 1}</td><td>${esc(p.name)}</td><td>${p.coins}</td><td>${p.correct}</td><td>${p.wrong}</td><td>${acc(p) == null ? '–' : acc(p) + '%'}</td><td>${p.wins}</td><td>${p.best}</td></tr>`).join('');
  const qs = H.questions.map((q, i) => ({ q, i, s: H.qstats[i] || { n: 0, ok: 0 } })).sort((a, b) => (b.s.n > 0) - (a.s.n > 0) || a.s.ok / (a.s.n || 1) - b.s.ok / (b.s.n || 1) || b.s.n - a.s.n);
  $('repQs').innerHTML = '<tr><th>Question</th><th>Correct answer</th><th>Attempts</th><th>Got it right</th></tr>' +
    qs.map(x => { const pct = x.s.n ? Math.round(x.s.ok / x.s.n * 100) : null; return `<tr><td>${esc(x.q.q)}</td><td>${esc(x.q.options[x.q.answer])}</td><td>${x.s.n}</td><td>${pct == null ? '<span class="note">not asked</span>' : `<div class="meter"><i style="width:${pct}%"></i></div>${pct}%`}</td></tr>`; }).join('');
}
$('csvBtn').onclick = () => {
  const c = v => '"' + String(v).replace(/"/g, '""') + '"';
  const ps = ranked();
  let csv = 'AIgametools report,' + c(new Date().toLocaleString('en-IN')) + '\n\nRank,Name,Coins,Correct,Wrong,Accuracy %,Games won,Best streak\n';
  csv += ps.map((p, i) => [i + 1, c(p.name), p.coins, p.correct, p.wrong, p.correct + p.wrong ? Math.round(p.correct / (p.correct + p.wrong) * 100) : '', p.wins, p.best].join(',')).join('\n');
  csv += '\n\nQuestion,Correct answer,Attempts,Correct attempts,% correct\n';
  csv += H.questions.map((q, i) => { const s = H.qstats[i] || { n: 0, ok: 0 }; return [c(q.q), c(q.options[q.answer]), s.n, s.ok, s.n ? Math.round(s.ok / s.n * 100) : ''].join(','); }).join('\n');
  download(`aigametools-report-${H.code}.csv`, csv, 'text/csv');
};
function renderResume() {
  let el = $('resumeBox');
  const s = LS.get('aigt-host-v1', null);
  const live = s && (s.phase === 'lobby' || s.phase === 'play') && Date.now() - s.t < 6 * 3600e3 && H.phase !== 'play' && H.phase !== 'lobby';
  if (!live) { if (el) el.remove(); return; }
  if (!el) { el = document.createElement('div'); el.id = 'resumeBox'; el.className = 'gt-panel'; el.style.marginTop = '16px'; $('scrHome').querySelector('.gt-roles').before(el); }
  el.innerHTML = `<b>You have a game in progress</b> (room ${esc(s.code)}, ${Object.keys(s.players || {}).length} players). <button class="gt-btn sm gold" id="resumeBtn">Resume it</button> <button class="gt-btn sm ghost" id="discardBtn">Discard</button>`;
  $('discardBtn').onclick = () => { LS.del('aigt-host-v1'); el.remove(); };
  $('resumeBtn').onclick = async () => {
    $('resumeBtn').disabled = true; $('resumeBtn').textContent = 'Reconnecting…';
    Object.assign(H, { questions: s.questions, settings: s.settings, phase: s.phase, endsAt: s.endsAt, players: s.players || {}, qstats: s.qstats || [], cls: s.cls || null, cids: {} });
    Object.values(H.players).forEach(p => { p.online = false; });
    for (let i = 0; i < 6; i++) {
      try { await hostOpen(s.code); break; }
      catch (e) { if (i === 5) { el.innerHTML = 'Could not reopen that room. Please create a new game.'; LS.del('aigt-host-v1'); H.phase = 'none'; return; } await new Promise(r => setTimeout(r, 3000)); }
    }
    el.remove();
    if (H.phase === 'lobby') openLobby(); else { if (H.endsAt && H.endsAt < Date.now()) { hostEnd(); return; } $('liveCode').textContent = H.code; show('Live'); renderHost(); hostTicker(); if (isClass(H.settings)) classResume(); else $('classHost').hidden = true; }
  };
}

/* ================= PLAYER (live + solo) ================= */
const P = { mode: 'solo', name: '', coins: 0, correct: 0, wrong: 0, streak: 0, best: 0, wins: 0, game: '', missed: [], questions: [], settings: null, endsAt: null, over: true, tick: null, code: '', pid: '' };
const NETP = { link: null, connected: false, everConnected: false };
let deck = [], lastQ = -1;
function nextQ() {
  if (!deck.length) deck = shuffle(P.questions.map((_, i) => i));
  let qi = deck.shift();
  if (qi === lastQ && P.questions.length > 1) { deck.push(qi); qi = deck.shift(); }
  lastQ = qi; return qi;
}
function saveP() { if (P.mode === 'net') LS.set('aigt-p-' + P.code + '-' + P.pid, statsOf()); }
const statsOf = () => ({ coins: P.coins, correct: P.correct, wrong: P.wrong, wins: P.wins, best: P.best, game: P.game, streak: P.streak, missed: P.missed });
let pvT = null, pvLast = null;
function pvSend(s, p) {
  if (P.mode !== 'net') return;
  pvLast = { t: 'pv', s, p };
  if (!pvT) pvT = setTimeout(() => { pvT = null; if (NETP.link && pvLast) NETP.link.send(pvLast); }, 900);
}
function evSend(x) { if (P.mode === 'net' && NETP.link && !P.over) NETP.link.send({ t: 'ev', x: String(x).slice(0, 80) }); }
let statT = null;
function syncStat() {
  if (P.mode !== 'net' || statT) return;
  statT = setTimeout(() => { statT = null; if (NETP.link) { const s = statsOf(); delete s.missed; s.t = 'stat'; NETP.link.send(s); } }, 500);
}
function hud() {
  $('hCoins').textContent = '🪙 ' + P.coins.toLocaleString('en-IN');
  $('hStreak').textContent = '🔥 ' + P.streak;
}
function setCoins(v, delta, why) {
  P.coins = Math.max(0, Math.round(v)); hud();
  if (delta) floatText((delta > 0 ? '+' : '−') + Math.abs(delta) + (why ? ' ' + why : ''), delta > 0 ? '#1d8a4e' : '#c8432b');
  saveP(); syncStat();
}
const api = {
  get coins() { return P.coins; },
  get over() { return P.over; },
  get busy() { return !$('qm').hidden; },
  spend(n, why) {
    if (P.over) return false;
    if (P.coins < n) { toast(`You need ${n} coins. Answer questions to earn more!`); openEarn(n); return false; }
    setCoins(P.coins - n, -n, why); return true;
  },
  gain(n, why) { if (!P.over) { setCoins(P.coins + n, n, why); sfx('coin'); } },
  lose(n, why) { if (!P.over) { const d = Math.min(n, P.coins); setCoins(P.coins - d, d ? -d : 0, why); sfx('hit'); } },
  ask(kind, o) { return P.over ? Promise.resolve(false) : new Promise(res => openQ(kind, o || {}, res)); },
  won() { P.wins++; sfx('win'); saveP(); syncStat(); evSend('🏆 won ' + (GAME_META[P.game] ? GAME_META[P.game].title : 'a game')); },
  get questions() { return P.questions; },
  status(text, pct) { pvSend(String(text || '').slice(0, 80), Math.max(0, Math.min(100, Math.round(+pct || 0)))); },
  record(qi, ok) {
    if (P.over || !P.questions[qi]) return;
    if (P.mode === 'net' && NETP.link) NETP.link.send({ t: 'ans', qi, ok: !!ok });
    if (ok) { P.correct++; P.streak++; P.best = Math.max(P.best, P.streak); }
    else { P.wrong++; P.streak = 0; if (!P.missed.includes(qi)) P.missed.push(qi); }
    hud(); saveP(); syncStat();
  },
  toast, sfx
};

/* --- question modal --- */
let QM = null;
const reward = () => 10 + 2 * Math.min(P.streak, 5);
function openQ(kind, o, done) {
  if (QM) closeQ(false);
  QM = { kind, o, done, qi: -1, answered: false };
  $('qm').hidden = false; $('qbox').className = 'gt-qbox ' + kind;
  showQ();
}
function openEarn(need) { return api.ask('earn', { need }); }
function showQ() {
  const { kind, o } = QM;
  const qi = QM.qi = nextQ(), q = P.questions[qi];
  QM.answered = false; QM.n = (QM.n || 0) + 1; QM.order = shuffle(q.options.map((_, i) => i));
  $('qmKind').textContent = kind === 'earn' ? 'Earn coins' : kind === 'bonus' ? '⭐ ' + (o.title || 'Quiz crate') : '🛡 ' + (o.title || 'Rescue question');
  $('qmSub').textContent = kind === 'rescue' ? (o.sub || 'Answer correctly to save yourself.') + ' Correct: +5 coins.'
    : `Correct answer: +${reward()} coins${P.streak ? ' (streak bonus included)' : ''}.` + (kind === 'earn' && o.need && P.coins < o.need ? ` You need ${o.need} coins to continue.` : '');
  $('qmQ').textContent = q.q;
  $('qmOpts').innerHTML = QM.order.map((oi, k) => `<button class="gt-opt" data-k="${'ABCDEF'[k]}" data-i="${oi}">${esc(q.options[oi])}</button>`).join('');
  $('qmFb').textContent = ''; $('qmFb').className = 'gt-fb';
  $('qmNext').hidden = true; $('qmClose').hidden = kind !== 'earn';
  $('qmClose').textContent = 'Back to game';
  const first = $('qmOpts').querySelector('button'); if (first) first.focus({ preventScroll: true });
}
$('qmOpts').addEventListener('click', e => { const b = e.target.closest('.gt-opt'); if (b && QM && !QM.answered) answerQ(+b.dataset.i); });
function answerQ(i) {
  const q = P.questions[QM.qi], ok = i === q.answer; QM.answered = true; QM.ok = ok;
  $('qmOpts').querySelectorAll('.gt-opt').forEach(b => { b.disabled = true; const bi = +b.dataset.i; if (bi === q.answer) b.classList.add('ok'); else if (bi === i) b.classList.add('bad'); });
  if (P.mode === 'net' && NETP.link) NETP.link.send({ t: 'ans', qi: QM.qi, ok });
  if (ok) {
    const r = QM.kind === 'rescue' ? 5 : reward();
    P.correct++; P.streak++; P.best = Math.max(P.best, P.streak); if ([3, 5, 10, 15, 20].includes(P.streak)) evSend(`🔥 ${P.streak} correct in a row`);
    setCoins(P.coins + r, r); sfx('good');
    $('qmFb').className = 'gt-fb ok'; $('qmFb').textContent = `Correct! +${r} coins` + (P.streak >= 3 ? ` · 🔥 ${P.streak} in a row` : '');
  } else {
    P.wrong++; P.streak = 0; sfx('bad');
    if (!P.missed.includes(QM.qi)) P.missed.push(QM.qi);
    deck.splice(Math.min(3, deck.length), 0, QM.qi);
    $('qmFb').className = 'gt-fb bad'; $('qmFb').textContent = 'Not quite. The right answer is highlighted.';
    hud(); saveP(); syncStat();
  }
  if (QM.kind === 'earn') {
    $('qmNext').textContent = 'Next question'; $('qmNext').hidden = false;
    if (ok) { const cur = QM, qi = QM.qi, n = QM.n; setTimeout(() => { if (QM === cur && QM.answered && QM.n === n && QM.qi === qi) showQ(); }, 900); }
  } else {
    $('qmNext').textContent = 'Continue'; $('qmNext').hidden = false;
    if (ok) { const cur = QM; setTimeout(() => { if (QM === cur) closeQ(true); }, 1100); }
  }
  $('qmNext').focus({ preventScroll: true });
}
$('qmNext').onclick = () => { if (!QM) return; if (QM.kind === 'earn') showQ(); else closeQ(QM.ok); };
$('qmClose').onclick = () => closeQ(false);
function closeQ(result) {
  if (!QM) { $('qm').hidden = true; return; }
  const d = QM.done, k = QM.kind, o = QM.o || {}; QM = null; $('qm').hidden = true;
  if (k === 'rescue' && !P.over) evSend(result ? `🛡 ${o.title || 'Rescue question'}: answered and saved` : `💥 ${o.title || 'Rescue question'}: missed`);
  try { d(!!result); } catch (e) {}
}
document.addEventListener('keydown', e => {
  if (!QM) return;
  if (!QM.answered) { const k = '1234ABCD'.indexOf(e.key.toUpperCase()); if (k >= 0) { const b = $('qmOpts').querySelectorAll('.gt-opt')[k % 4]; if (b) { e.preventDefault(); b.click(); } } }
  else if (e.key === 'Enter' && !$('qmNext').hidden) { e.preventDefault(); $('qmNext').click(); }
  if (e.key === 'Escape' && QM && QM.kind === 'earn') closeQ(false);
});
$('earnBtn').onclick = () => openEarn(0);
$('sfxBtn').onclick = () => { sfxOn = !sfxOn; LS.set('aigt-sfx', sfxOn); $('sfxBtn').textContent = sfxOn ? '🔊' : '🔇'; };
$('sfxBtn').textContent = sfxOn ? '🔊' : '🔇';

/* --- games --- */
let current = null;
function stopGame() { if (current) { try { current.destroy(); } catch (e) {} current = null; } $('stage').innerHTML = ''; $('stage').hidden = true; }
function showPicker() {
  stopGame(); $('picker').hidden = false; $('pickBtn').hidden = true;
  const gs = (P.settings.games || []).filter(g => GAMES[g]);
  $('gameCards').innerHTML = gs.map(g => `<button class="gt-game ${g}" data-game="${g}"><span class="em" aria-hidden="true">${GAME_META[g].em}</span><b>${GAME_META[g].title}</b><span>${GAME_META[g].blurb}</span></button>`).join('');
  if (gs.length === 1) startGame(gs[0]);
}
$('gameCards').addEventListener('click', e => { const b = e.target.closest('[data-game]'); if (b) startGame(b.dataset.game); });
function startGame(g) {
  stopGame(); $('picker').hidden = true; $('stage').hidden = false;
  $('pickBtn').hidden = (P.settings.games || []).length < 2;
  P.game = g; syncStat(); evSend(`🎮 started ${GAME_META[g].title}`);
  current = GAMES[g].create($('stage'), api);
}
$('pickBtn').onclick = showPicker;
function startPlayScreen() {
  P.over = false; deck = []; lastQ = -1;
  hud(); show('Play'); showPicker();
  clearInterval(P.tick);
  const tickFn = () => {
    if (P.endsAt == null) { $('hTime').hidden = true; return; }
    const left = P.endsAt - Date.now();
    $('hTime').hidden = false; $('hTime').textContent = '⏱ ' + fmtTime(left);
    if (left <= 0 && P.mode === 'solo') finishSolo();
  };
  tickFn(); P.tick = setInterval(tickFn, 500);
}

/* --- solo --- */
function startSolo(settings) {
  Object.assign(P, { mode: 'solo', name: 'You', coins: settings.coins, correct: 0, wrong: 0, streak: 0, best: 0, wins: 0, game: '', missed: [], questions: Qs.slice(), settings: Object.assign({}, settings, { board: true }), endsAt: settings.dur ? Date.now() + settings.dur * 60000 : null });
  $('hRank').hidden = true; $('soloEnd').hidden = false; $('sideTitle').textContent = 'Best scores on this device';
  renderSoloBest(); $('connNote').textContent = '';
  startPlayScreen();
}
function renderSoloBest(highlight) {
  const best = LS.get('aigt-solo-best', []);
  $('sideBoard').innerHTML = best.length ? best.map((b, i) => `<div class="gt-bar${b.t === highlight ? ' me' : ''}"><span class="rk">${i + 1}</span><span class="nm">${esc(new Date(b.t).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }))}<small>${b.acc}% right</small></span><span class="cn">🪙 ${b.coins}</span></div>`).join('') : '<p class="note">Your top scores will appear here.</p>';
}
function finishSolo() {
  if (P.over) return;
  P.over = true; clearInterval(P.tick); closeQ(false); stopGame();
  const tot = P.correct + P.wrong, t = Date.now();
  const best = LS.get('aigt-solo-best', []); best.push({ coins: P.coins, acc: tot ? Math.round(P.correct / tot * 100) : 0, t });
  best.sort((a, b) => b.coins - a.coins); LS.set('aigt-solo-best', best.slice(0, 5));
  const place = best.findIndex(b => b.t === t);
  $('dLabel').textContent = 'Practice finished';
  $('dRank').textContent = '🪙 ' + P.coins.toLocaleString('en-IN');
  $('dCoins').textContent = place === 0 && best.length > 1 ? 'New personal best!' : place >= 0 && place < 5 ? `#${place + 1} of your best scores` : 'Well played!';
  $('dBoardWrap').hidden = true;
  showDone();
}
$('soloEnd').onclick = () => { if (confirm('Finish this practice game?')) finishSolo(); };
function showDone() {
  const tot = P.correct + P.wrong;
  $('dStats').textContent = `${P.correct} of ${tot} answers correct${tot ? ` (${Math.round(P.correct / tot * 100)}%)` : ''} · best streak ${P.best} · ${P.wins} game${P.wins === 1 ? '' : 's'} won`;
  $('dAgain').hidden = P.mode !== 'solo';
  const miss = P.missed.map(i => P.questions[i]).filter(Boolean);
  $('dRevTitle').textContent = miss.length ? 'Questions to review' : '';
  $('dReview').innerHTML = miss.length ? miss.map(q => `<div>${esc(q.q)}<br>Answer: <b>${esc(q.options[q.answer])}</b></div>`).join('') : '<p class="note">You didn’t miss any questions. Excellent!</p>';
  show('Done');
}
$('dAgain').onclick = () => startSolo(P.settings);

/* --- live player --- */
function jStatus(msg, cls) { const s = $('jStatus'); s.className = 'status' + (cls ? ' ' + cls : ''); s.innerHTML = msg; }
$('jCode').addEventListener('input', e => { e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); });
[$('jCode'), $('jName')].forEach(i => i.addEventListener('keydown', e => { if (e.key === 'Enter') $('jBtn').click(); }));
$('jBtn').onclick = async () => {
  const code = $('jCode').value.trim().toUpperCase(), name = $('jName').value.trim();
  if (code.length !== 5) { jStatus('Enter the 5-character code on your teacher’s screen.', 'err'); return; }
  if (!name) { jStatus('Enter a nickname.', 'err'); $('jName').focus(); return; }
  // the player id lives in this tab only, so a refresh rejoins as the same player
  let tab = {}; try { tab = JSON.parse(sessionStorage.getItem('aigt-tab') || '{}'); } catch (e) {}
  const pid = tab.code === code && tab.pid ? tab.pid : 'p' + Math.random().toString(36).slice(2, 10);
  try { sessionStorage.setItem('aigt-tab', JSON.stringify({ code, pid })); } catch (e) {}
  LS.set('aigt-me', { name });
  if (NETP.link) NETP.link.close();
  Object.assign(P, { mode: 'net', code, pid, name, over: true });
  NETP.connected = false; NETP.everConnected = false;
  $('jBtn').disabled = true; jStatus('Connecting…');
  try {
    NETP.link = await NET.join(code, {
      open() {
        NETP.connected = true; NETP.everConnected = true; $('connNote').textContent = '';
        NETP.link.send({ t: 'hello', pid, name, stats: LS.get('aigt-p-' + code + '-' + pid, null) });
      },
      msg: playerMsg,
      down(why, tries) {
        NETP.connected = false;
        if (!NETP.everConnected) {
          if (why === 'notfound' && tries >= 2) { NETP.link && NETP.link.close(); NETP.link = null; $('jBtn').disabled = false; jStatus('No game found with that code. Check the code, and make sure your teacher’s game screen is open.', 'err'); }
          else if (why === 'network' && tries >= 3) { NETP.link && NETP.link.close(); NETP.link = null; $('jBtn').disabled = false; jStatus('Could not connect. Check your internet connection and try again.', 'err'); }
        } else $('connNote').textContent = 'Reconnecting to your teacher… you can keep playing.';
      }
    });
  } catch (e) { $('jBtn').disabled = false; jStatus('Could not connect. Check your internet connection and try again.', 'err'); }
};
function playerMsg(d) {
  if (!d || typeof d !== 'object') return;
  if (d.t === 'welcome') {
    $('jBtn').disabled = false; jStatus('');
    P.name = d.name; P.questions = d.questions; P.settings = d.settings;
    const s = LS.get('aigt-p-' + P.code + '-' + P.pid, null) || d.stats || {};
    if (P.over) Object.assign(P, { coins: s.coins != null ? s.coins : d.settings.coins, correct: s.correct || 0, wrong: s.wrong || 0, wins: s.wins || 0, best: s.best || 0, streak: s.streak || 0, missed: s.missed || [] });
    $('hRank').hidden = !d.settings.board; $('soloEnd').hidden = true; $('sideTitle').textContent = 'Leaderboard';
    $('wName').textContent = d.name; $('wInfo').textContent = `${d.questions.length} questions · ${isClass(d.settings) ? MODE_META[d.settings.mode].title + ' with the whole class' : d.settings.games.map(g => GAME_META[g].title).join(', ')}`;
    if (d.phase === 'lobby') { if (P.over) show('Wait'); }
    else if (d.phase === 'play') { setLeft(d.left); if (isClass(d.settings)) pClassStart(); else if (P.over) startPlayScreen(); }
    saveP(); if (!isClass(d.settings)) syncStat();
  } else if (d.t === 'start') { setLeft(d.left); if (isClass(P.settings)) pClassStart(); else if (P.over) startPlayScreen(); }
  else if (['rq', 'tk', 'call', 'me', 'won'].includes(d.t)) pClassMsg(d);
  else if (d.t === 'board') {
    setLeft(d.left);
    if (!P.settings) return;
    if (!P.settings.board || !d.top) { $('sideBoard').innerHTML = '<p class="note">Your teacher has hidden the leaderboard. Keep earning!</p>'; return; }
    $('hRank').textContent = `🏆 #${d.rank} of ${d.n}`; $('cRank').hidden = false; $('cRank').textContent = `🏆 #${d.rank} of ${d.n}`;
    let h = d.top.map((p, i) => `<div class="gt-bar${p.me ? ' me' : ''}"><span class="rk">${i + 1}</span><span class="nm">${esc(p.n)}</span><span class="cn">${p.c}</span></div>`).join('');
    if (d.rank > 5) h += `<div class="note" style="text-align:center">…</div><div class="gt-bar me"><span class="rk">${d.rank}</span><span class="nm">${esc(P.name)}</span><span class="cn">${d.mine}</span></div>`;
    $('sideBoard').innerHTML = h;
  } else if (d.t === 'end') {
    P.over = true; clearInterval(P.tick); closeQ(false); stopGame(); pClassStop(); saveP();
    $('dLabel').textContent = 'Game over · your rank';
    $('dRank').textContent = d.rank ? '#' + d.rank : '–';
    $('dCoins').textContent = d.rank ? `of ${d.n} players · 🪙 ${(d.coins != null ? d.coins : P.coins).toLocaleString('en-IN')}` : 'This game has ended.';
    $('dBoardWrap').hidden = !(d.top && d.top.length && P.settings && P.settings.board);
    $('dBoard').innerHTML = (d.top || []).map((p, i) => `<div class="gt-bar${p.me ? ' me' : ''}"><span class="rk">${i + 1}</span><span class="nm">${esc(p.n)}</span><span class="cn">🪙 ${p.c}</span></div>`).join('');
    showDone();
    if (d.rank && d.rank <= 3) sfx('win');
  }
}
function setLeft(left) {
  if (left == null) { P.endsAt = null; return; }
  const e = Date.now() + left;
  if (P.endsAt == null || Math.abs(P.endsAt - e) > 1500) P.endsAt = e;
}

/* ================= PROJECTOR VIEW (host) =================
   A full-screen view for the classroom projector: every student's game live, plus a feed of moments. */
const PJ = { open: false, feed: [], prev: {} };
function feedAdd(name, x) {
  PJ.feed.unshift({ n: name, x, t: Date.now() }); PJ.feed = PJ.feed.slice(0, 40);
  if (PJ.open) renderFeed();
}
function projOpen() {
  if (H.phase !== 'play') return;
  PJ.open = true; const el = $('proj'); el.hidden = false; document.body.style.overflow = 'hidden';
  if (isClass(H.settings)) { $('projClass').appendChild($('classHost')); }
  renderProj(); renderFeed();
  if (el.requestFullscreen && !document.fullscreenElement) el.requestFullscreen().catch(() => {});
}
function projClose() {
  if (!PJ.open) return;
  PJ.open = false; $('proj').hidden = true; document.body.style.overflow = '';
  const ch = $('classHost'); if (ch.parentNode !== $('scrLive')) $('scrLive').insertBefore(ch, $('scrLive').querySelector('.gt-stats'));
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
}
$('projBtn').onclick = projOpen;
$('projExit').onclick = projClose;
document.addEventListener('keydown', e => { if (e.key === 'Escape' && PJ.open && !document.fullscreenElement) projClose(); });
let rpT = null;
function renderProj() {
  if (!PJ.open) return;
  const ps = ranked(), cls = isClass(H.settings), left = remaining();
  $('projCode').textContent = H.code;
  if (!$('projQr').innerHTML && $('qr').innerHTML) $('projQr').innerHTML = $('qr').innerHTML;
  $('projJoin').textContent = location.host + location.pathname.replace(/index\.html$/, '');
  $('projTime').textContent = left == null ? '' : fmtTime(left);
  const c = ps.reduce((s, p) => s + p.correct, 0), w = ps.reduce((s, p) => s + p.wrong, 0);
  $('projStats').innerHTML = `<span><b>${ps.filter(p => p.online).length}</b> playing</span><span><b>${c + w}</b> answers</span><span><b>${c + w ? Math.round(c / (c + w) * 100) + '%' : '–'}</b> correct</span>`;
  $('projClass').hidden = !cls; $('projTiles').hidden = cls;
  if (cls) {
    $('projSide').innerHTML = '<h3>Leaderboard</h3>' + ps.slice(0, 10).map((p, i) => `<div class="pj-row"><span class="rk">${i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1}</span><span class="nm">${esc(p.name)}</span><span class="cn">🪙 ${p.coins.toLocaleString('en-IN')}</span></div>`).join('');
    return;
  }
  const many = ps.length > 24;
  $('projTiles').className = 'pj-tiles' + (many ? ' many' : '');
  $('projTiles').innerHTML = ps.length ? ps.map((p, i) => {
    const g = GAME_META[p.game], tot = p.correct + p.wrong, prev = PJ.prev[p.pid], up = prev != null && p.coins > prev;
    PJ.prev[p.pid] = p.coins;
    return `<div class="pj-tile${p.online ? '' : ' off'}${up ? ' up' : ''}">
      <div class="pj-top"><span class="rk">${i < 3 ? ['🥇', '🥈', '🥉'][i] : '#' + (i + 1)}</span><span class="nm">${esc(p.name)}</span><span class="cn">🪙 ${p.coins.toLocaleString('en-IN')}</span></div>
      <div class="pj-game">${g ? g.em + ' ' + g.title : '<span class="dim">choosing a game…</span>'}</div>
      <div class="pj-st">${p.pv && p.pv.s ? esc(p.pv.s) : p.online ? '&nbsp;' : 'offline'}</div>
      <div class="pj-bar"><i style="width:${p.pv ? p.pv.p : 0}%"></i></div>
      <div class="pj-foot"><span>${tot ? Math.round(p.correct / tot * 100) + '% right' : 'no answers yet'}</span>${p.wins ? `<span>🏆 ${p.wins}</span>` : ''}</div>
    </div>`;
  }).join('') : '<p class="pj-empty">Waiting for students to join with the code above…</p>';
}
function renderFeed() {
  if (isClass(H.settings)) return;
  $('projSide').innerHTML = '<h3>Live moments</h3>' + (PJ.feed.length ? PJ.feed.slice(0, 14).map(f => `<div class="pj-ev"><b>${esc(f.n)}</b> ${esc(f.x)}</div>`).join('') : '<p class="dim">Rescues, wins and streaks appear here as students play.</p>');
}
setInterval(() => { if (PJ.open) { const left = remaining(); $('projTime').textContent = left == null ? '' : fmtTime(left); } }, 1000);

/* ================= WHOLE-CLASS MODES: Quiz Race and Tambola =================
   The teacher's screen (projector) drives the game; phones answer. The host keeps the score. */
const KX = () => window.AIGT_KIT;
const cidsOf = pid => Object.keys(H.cids).filter(c => H.cids[c] === pid);
function sendMe(cid, p, extra) { H.net.send(cid, Object.assign({ t: 'me', coins: p.coins, correct: p.correct, wrong: p.wrong, best: p.best, wins: p.wins }, extra || {})); }
function classStart() {
  const mode = H.settings.mode;
  if (mode === 'race') H.cls = { mode, order: shuffle(H.questions.map((_, i) => i)), n: -1, open: false, qi: -1, opts: [], t0: 0, ans: {}, lim: (H.settings.qsec || 20) * 1000 };
  else {
    H.cls = { mode, calls: shuffle(H.questions.map((_, i) => i)), called: [], won: {}, csec: H.settings.csec || 0, paused: false, showAns: false };
    Object.values(H.players).forEach(classTicket);
    Object.entries(H.cids).forEach(([cid, pid]) => sendTicket(cid, H.players[pid]));
  }
  $('classHost').hidden = false; renderClassHost(); saveH();
}
function classResume() {
  const C = H.cls; if (!C) { classStart(); return; }
  $('classHost').hidden = false;
  if (C.mode === 'race' && C.open) { C.t0 = Date.now(); C.ans = {}; raceTimer(); }
  if (C.mode === 'tambola') tamAuto();
  renderClassHost();
}
function classStop() { const C = H.cls; if (!C) return; clearInterval(C.timer); clearTimeout(C.auto); }
function classTicket(p) { if (!p.ticket) { p.ticket = KX().ticket(KX().pool(H.questions).length); p.marks = []; } }
function sendTicket(cid, p) { H.net.send(cid, { t: 'tk', ticket: p.ticket, marks: p.marks, called: H.cls.called, won: H.cls.won }); sendMe(cid, p); }
function classJoin(cid, p) {
  const C = H.cls; if (!C) return;
  if (C.mode === 'race') { sendMe(cid, p); if (C.open) sendRq(cid); }
  else { classTicket(p); sendTicket(cid, p); saveH(); }
}
function classMsg(cid, p, d) {
  const C = H.cls; if (!C || H.phase !== 'play') return;
  if (C.mode === 'race' && d.t === 'ra') {
    if (!C.open || d.n !== C.n || C.ans[p.pid] || !(d.i >= 0 && d.i < H.questions[C.qi].options.length)) return;
    C.ans[p.pid] = { i: +d.i, ms: Date.now() - C.t0 };
    renderClassHostSoon();
    const online = Object.values(H.players).filter(x => x.online);
    if (online.length && online.every(x => C.ans[x.pid])) setTimeout(raceReveal, 400);
  } else if (C.mode === 'tambola' && d.t === 'mk') {
    const c = +d.c, K = KX(), pool = K.pool(H.questions);
    if (!p.ticket || !p.ticket.includes(c) || p.marks.includes(c)) return;
    const hit = pool[c].qis.filter(q => C.called.includes(q)), last = C.called[C.called.length - 1];
    if (hit.length) {
      p.marks.push(c); p.coins += 3; p.correct++; p.streak = (p.streak || 0) + 1; p.best = Math.max(p.best, p.streak);
      const qi = hit[hit.length - 1]; H.qstats[qi].n++; H.qstats[qi].ok++;
      sendMe(cid, p, { mk: c, ok: 1 });
    } else {
      p.coins = Math.max(0, p.coins - 2); p.wrong++; p.streak = 0; if (last != null) H.qstats[last].n++;
      sendMe(cid, p, { mk: c, ok: 0, miss: last });
    }
    renderHostSoon(); saveH();
  } else if (C.mode === 'tambola' && d.t === 'claim') {
    const K = KX(), pr = K.PRIZES.find(x => x.id === d.id); if (!pr || !p.ticket) return;
    if (C.won[pr.id]) { sendMe(cid, p, { claim: pr.id, res: 'taken' }); return; }
    if (pr.test(p.ticket, new Set(p.marks))) {
      C.won[pr.id] = p.name; p.coins += pr.coins; p.wins++;
      Object.keys(H.cids).forEach(x => H.net.send(x, { t: 'won', id: pr.id, name: p.name }));
      sendMe(cid, p, { claim: pr.id, res: 'ok' }); sfx('win'); toast(`${p.name} claimed ${pr.name}!`, 3000); renderClassHost();
      if (pr.id === 'full') { clearTimeout(C.auto); setTimeout(() => { if (H.phase === 'play') hostEnd(); }, 6000); }
    } else { p.coins = Math.max(0, p.coins - 10); sendMe(cid, p, { claim: pr.id, res: 'bogie' }); }
    renderHostSoon(); saveH();
  }
}
/* --- race (host) --- */
function sendRq(cid) { const C = H.cls; H.net.send(cid, { t: 'rq', n: C.n, qi: C.qi, opts: C.opts, left: Math.max(0, C.lim - (Date.now() - C.t0)), lim: C.lim, of: C.order.length }); }
function raceNext() {
  const C = H.cls; clearInterval(C.timer);
  if (C.n + 1 >= C.order.length) { hostEnd(); return; }
  C.n++; C.qi = C.order[C.n]; C.opts = shuffle(H.questions[C.qi].options.map((_, i) => i)); C.ans = {}; C.open = true; C.t0 = Date.now();
  Object.keys(H.cids).forEach(sendRq);
  raceTimer(); renderClassHost(); saveH(); sfx('roll');
}
function raceTimer() {
  const C = H.cls; clearInterval(C.timer);
  C.timer = setInterval(() => {
    const left = C.lim - (Date.now() - C.t0), el = $('chTime');
    if (el) el.textContent = Math.max(0, Math.ceil(left / 1000));
    if (left <= 0) raceReveal();
  }, 250);
}
function raceReveal() {
  const C = H.cls; if (!C || !C.open) return;
  clearInterval(C.timer); C.open = false;
  const q = H.questions[C.qi], st = H.qstats[C.qi];
  Object.values(H.players).forEach(p => {
    const a = C.ans[p.pid], ok = !!a && a.i === q.answer, pts = ok ? 10 + Math.round(10 * Math.max(0, 1 - a.ms / C.lim)) : 0;
    p.last = { ok, pts, answered: !!a };
    if (!a && !p.online) return;
    st.n++;
    if (ok) { st.ok++; p.correct++; p.streak = (p.streak || 0) + 1; p.best = Math.max(p.best, p.streak); p.coins += pts; }
    else { p.wrong++; p.streak = 0; }
  });
  const ps = ranked();
  Object.entries(H.cids).forEach(([cid, pid]) => {
    const p = H.players[pid]; if (!p) return; const r = ps.indexOf(p) + 1;
    sendMe(cid, p, { rr: 1, n: C.n, ok: p.last.ok, gain: p.last.pts, answered: p.last.answered, answer: q.answer, qi: C.qi, rank: r, of: ps.length });
  });
  sfx('good'); renderClassHost(); renderHost(); saveH();
}
/* --- tambola (host) --- */
function tamCall() {
  const C = H.cls; clearTimeout(C.auto);
  if (C.called.length >= C.calls.length) { toast('All questions have been called.'); return; }
  const qi = C.calls[C.called.length]; C.called.push(qi);
  Object.keys(H.cids).forEach(cid => H.net.send(cid, { t: 'call', qi, k: C.called.length, of: C.calls.length }));
  sfx('roll'); renderClassHost(); saveH(); tamAuto();
  if (C.called.length >= C.calls.length) setTimeout(() => { if (H.phase === 'play' && H.cls === C) { toast('Last call made. The game ends in 30 seconds.', 4000); C.auto = setTimeout(() => { if (H.phase === 'play') hostEnd(); }, 30000); } }, 500);
}
function tamAuto() { const C = H.cls; clearTimeout(C.auto); if (C.csec && !C.paused && H.phase === 'play' && C.called.length && C.called.length < C.calls.length) C.auto = setTimeout(tamCall, C.csec * 1000); }
/* --- host view --- */
let rchT = null; function renderClassHostSoon() { if (!rchT) rchT = setTimeout(() => { rchT = null; renderClassHost(); }, 300); }
function renderClassHost() {
  const el = $('classHost'), C = H.cls, K = KX(); if (!C || !el) return;
  if (C.mode === 'race') {
    if (C.n < 0 || C.qi < 0) { el.innerHTML = `<div class="ch-card"><div class="ch-kicker">🏁 Quiz Race</div><div class="ch-q">${H.questions.length} questions, ${C.lim / 1000} seconds each. Show this screen on the projector. Students answer on their phones; faster correct answers score more.</div><div class="row"><button class="gt-btn gold big" data-ch="next">Show the first question</button></div></div>`; return; }
    const q = H.questions[C.qi], n = Object.keys(C.ans).length, on = Object.values(H.players).filter(p => p.online).length;
    const opts = C.opts.map((oi, k) => { const cnt = Object.values(C.ans).filter(a => a.i === oi).length; return `<div class="ch-opt${!C.open && oi === q.answer ? ' ok' : !C.open ? ' dim' : ''}" style="background:${K.COLORS[k]}"><span class="s">${K.SHAPES[k]}</span><span class="t">${esc(q.options[oi])}</span>${!C.open ? `<span class="cnt">${cnt}</span>` : ''}</div>`; }).join('');
    el.innerHTML = `<div class="ch-card"><div class="ch-top"><span class="ch-kicker">Question ${C.n + 1} of ${C.order.length}</span>${C.open ? `<span class="ch-time" id="chTime">${Math.max(0, Math.ceil((C.lim - (Date.now() - C.t0)) / 1000))}</span>` : '<span class="ch-kicker" style="color:#1d8a4e">Answer</span>'}<span class="ch-kicker">${n} of ${on} answered</span></div>
      <div class="ch-q">${esc(q.q)}</div><div class="ch-opts">${opts}</div>
      <div class="row">${C.open ? '<button class="gt-btn ghost" data-ch="reveal">Show the answer now</button>' : `<button class="gt-btn gold big" data-ch="next">${C.n + 1 >= C.order.length ? 'Finish and show results' : 'Next question'}</button>`}</div></div>`;
  } else {
    const cur = C.called.length ? H.questions[C.called[C.called.length - 1]] : null, prev = C.called.length > 1 ? H.questions[C.called[C.called.length - 2]] : null;
    const list = C.showAns ? `<div class="ch-list">${C.called.slice().reverse().map((qi, k) => `<div><span class="note">${C.called.length - k}.</span> ${esc(H.questions[qi].q)} <b>${esc(H.questions[qi].options[H.questions[qi].answer])}</b></div>`).join('')}</div>` : '';
    el.innerHTML = `<div class="ch-card"><div class="ch-top"><span class="ch-kicker">🎟️ Tambola · call ${C.called.length} of ${C.calls.length}</span><span class="ch-kicker">${C.csec ? (C.paused ? 'auto-call paused' : `auto-call every ${C.csec} s`) : 'you call each question'}</span></div>
      <div class="ch-q">${cur ? esc(cur.q) : 'Press <b>Next call</b> to call the first question. Students mark its answer if it is on their ticket.'}</div>
      ${prev ? `<div class="ch-last">Last answer: <b>${esc(prev.options[prev.answer])}</b></div>` : ''}
      <div class="ch-prizes">${K.PRIZES.map(p => `<span class="ch-prize${C.won[p.id] ? ' won' : ''}">${p.name}${C.won[p.id] ? ': ' + esc(C.won[p.id]) : ' · +' + p.coins}</span>`).join('')}</div>
      <div class="row"><button class="gt-btn gold big" data-ch="call" ${C.called.length >= C.calls.length || C.won.full ? 'disabled' : ''}>Next call</button>${C.csec ? `<button class="gt-btn ghost" data-ch="pause">${C.paused ? 'Resume auto-call' : 'Pause auto-call'}</button>` : ''}<button class="gt-btn ghost sm" data-ch="answers">${C.showAns ? 'Hide' : 'Show'} called answers</button></div>${list}</div>`;
  }
}
$('classHost').addEventListener('click', e => {
  const b = e.target.closest('[data-ch]'), C = H.cls; if (!b || !C || H.phase !== 'play') return;
  const a = b.dataset.ch;
  if (a === 'next') raceNext(); else if (a === 'reveal') raceReveal();
  else if (a === 'call') tamCall();
  else if (a === 'pause') { C.paused = !C.paused; tamAuto(); renderClassHost(); saveH(); }
  else if (a === 'answers') { C.showAns = !C.showAns; renderClassHost(); }
});

/* --- player side of the whole-class modes --- */
const PC = { ticket: null, marks: new Set(), pend: new Set(), called: [], won: {}, n: -1, k: 0, of: 0, answered: false, tm: null };
function cHud() { $('cCoins').textContent = '🪙 ' + P.coins.toLocaleString('en-IN'); }
function cMsg(t) { const m = $('cMsg'); if (m) m.innerHTML = t; }
function pClassStart() {
  const first = P.over; P.over = false; show('Class'); cHud();
  $('cTitle').textContent = MODE_META[P.settings.mode].title;
  if (first) { Object.assign(PC, { ticket: null, marks: new Set(), pend: new Set(), called: [], won: {}, n: -1 }); $('cStage').innerHTML = `<div class="g2 gt-me"><div style="font-size:48px">${P.settings.mode === 'race' ? '🏁' : '🎟️'}</div><h2 style="margin:6px 0">Look at your teacher's screen</h2><p class="note">${P.settings.mode === 'race' ? 'The question appears there and here. Tap your answer fast.' : 'Your ticket is on its way…'}</p></div>`; }
  clearInterval(P.tick);
  P.tick = setInterval(() => { if (P.endsAt == null) { $('cTime').hidden = true; return; } $('cTime').hidden = false; $('cTime').textContent = '⏱ ' + fmtTime(P.endsAt - Date.now()); }, 500);
}
function pClassStop() { clearInterval(PC.tm); }
function pClassMsg(d) {
  const K = KX(); if (!K || !P.settings) return;
  if (d.t === 'me') {
    Object.assign(P, { coins: d.coins, correct: d.correct, wrong: d.wrong, best: d.best, wins: d.wins }); cHud(); saveP();
    if (d.rr) pRaceResult(d);
    if (d.mk != null) {
      PC.pend.delete(d.mk);
      const cell = $('cStage').querySelector(`.g2-cell[data-c="${d.mk}"]`);
      if (d.ok) { PC.marks.add(d.mk); if (cell) cell.classList.add('on'); sfx('good'); cMsg('Marked! +3 coins.'); }
      else { if (cell) { cell.classList.remove('shake'); void cell.offsetWidth; cell.classList.add('shake'); } sfx('bad'); cMsg('That answer has not been called yet. −2 coins.'); if (d.miss != null && !P.missed.includes(d.miss)) P.missed.push(d.miss); }
      pPrizes();
    }
    if (d.claim) { const pr = K.PRIZES.find(x => x.id === d.claim); cMsg(d.res === 'ok' ? `🎉 You won <b>${pr.name}</b>! +${pr.coins} coins.` : d.res === 'taken' ? `${pr.name} has already been won.` : `Bogie! Your ticket does not have ${pr.name} yet. −10 coins.`); if (d.res === 'ok') sfx('win'); else sfx('bad'); }
    return;
  }
  if (d.t === 'rq') {
    if (!P.questions[d.qi]) return;
    PC.n = d.n; PC.answered = false; const q = P.questions[d.qi]; PC.qi = d.qi;
    $('cStage').innerHTML = `<div class="g2"><div class="g2-head"><b>Question ${d.n + 1} of ${d.of}</b><span class="note" id="cSec"></span></div><div class="g2-tbar"><i id="cBar" style="width:100%"></i></div><div class="g2-q">${esc(q.q)}</div><div class="g2-kopts">${K.kopts(q, d.opts)}</div><div class="g2-msg" id="cMsg">Tap your answer. Faster correct answers score more.</div></div>`;
    const end = Date.now() + d.left; clearInterval(PC.tm);
    PC.tm = setInterval(() => { const left = end - Date.now(), bar = $('cBar'), sec = $('cSec'); if (bar) bar.style.width = Math.max(0, left / d.lim * 100) + '%'; if (sec) sec.textContent = Math.max(0, Math.ceil(left / 1000)) + ' s'; if (left <= 0) { clearInterval(PC.tm); if (!PC.answered) { $('cStage').querySelectorAll('.g2-kopt').forEach(b => { b.disabled = true; }); cMsg("Time's up. Look at the screen for the answer."); } } }, 100);
    sfx('roll');
  } else if (d.t === 'tk') {
    PC.ticket = d.ticket; PC.marks = new Set(d.marks || []); PC.pend = new Set(); PC.called = d.called || []; PC.won = d.won || {};
    PC.k = PC.called.length; pTicket();
  } else if (d.t === 'call') {
    if (!PC.called.includes(d.qi)) PC.called.push(d.qi); PC.k = d.k; PC.of = d.of; pCall(); sfx('roll');
  } else if (d.t === 'won') {
    PC.won[d.id] = d.name; pPrizes(); if (d.name !== P.name) toast(`${d.name} won ${K.PRIZES.find(x => x.id === d.id).name}`, 2500);
  }
}
$('cStage').addEventListener('click', e => {
  if (!P.settings || P.over || !NETP.link) return;
  const o = e.target.closest('.g2-kopt'), cell = e.target.closest('.g2-cell'), pz = e.target.closest('.g2-prize');
  if (o && !PC.answered) {
    PC.answered = true; NETP.link.send({ t: 'ra', n: PC.n, i: +o.dataset.i });
    $('cStage').querySelectorAll('.g2-kopt').forEach(b => { b.disabled = true; if (b !== o) b.classList.add('dim'); });
    cMsg('Answer locked in. Look at the screen.'); sfx('coin');
  } else if (cell) {
    const c = +cell.dataset.c; if (PC.marks.has(c) || PC.pend.has(c)) return;
    if (!PC.called.length) { cMsg('Wait for the first call.'); return; }
    PC.pend.add(c); NETP.link.send({ t: 'mk', c });
  } else if (pz && !pz.disabled) NETP.link.send({ t: 'claim', id: pz.dataset.p });
});
function pRaceResult(d) {
  clearInterval(PC.tm);
  const q = P.questions[d.qi]; if (!q) return;
  if (!d.ok && !P.missed.includes(d.qi)) P.missed.push(d.qi);
  $('cStage').querySelectorAll('.g2-kopt').forEach(b => { b.disabled = true; const bi = +b.dataset.i; b.classList.toggle('dim', bi !== d.answer); if (bi === d.answer) b.classList.add('ok'); });
  cMsg(`<div style="font-size:22px;font-weight:800;margin-top:4px">${d.ok ? `✅ Correct! +${d.gain}` : d.answered ? '❌ Not this time' : '⏱ No answer'}</div>${d.ok ? '' : `The answer is <b>${esc(q.options[q.answer])}</b>. `}You are <b>#${d.rank}</b> of ${d.of}.`);
  if (d.ok) sfx('good');
}
function pCall() {
  const el = $('cCall'); if (!el) return;
  const cur = PC.called.length ? P.questions[PC.called[PC.called.length - 1]] : null;
  el.innerHTML = `<small>${cur ? `Call ${PC.k || PC.called.length}${PC.of ? ' of ' + PC.of : ''}` : 'Caller'}</small><div class="q">${cur ? esc(cur.q) : 'Waiting for the first call…'}</div>`;
}
function pPrizes() {
  const el = $('cPrizes'), K = KX(); if (!el || !PC.ticket) return;
  el.innerHTML = K.PRIZES.map(p => { const w = PC.won[p.id], ready = !w && p.test(PC.ticket, PC.marks); return `<button class="g2-prize${w ? (w === P.name ? ' mine' : ' gone') : ready ? ' ready' : ''}" data-p="${p.id}" ${w ? 'disabled' : ''}>${p.name}${w ? ' · ' + esc(w) : ' +' + p.coins}</button>`; }).join('');
}
function pTicket() {
  const K = KX(), pool = K.pool(P.questions), w = PC.ticket.length / 3;
  $('cStage').innerHTML = `<div class="g2"><div class="g2-call" id="cCall"></div><div class="g2-ticket" style="grid-template-columns:repeat(${w},1fr)">${PC.ticket.map(c => `<button class="g2-cell${pool[c] ? K.cellCls(pool[c].text) : ''}${PC.marks.has(c) ? ' on' : ''}" data-c="${c}">${esc(K.short(pool[c] ? pool[c].text : '?', 46))}</button>`).join('')}</div><div class="g2-prizes" id="cPrizes"></div><div class="g2-msg" id="cMsg">When a question is called, tap its answer if it is on your ticket. Claim a prize as soon as you have it.</div></div>`;
  pCall(); pPrizes();
}

/* ---------- start-up ---------- */
const jc = (params.get('join') || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5);
if (jc) {
  $('jCode').value = jc;
  const me = LS.get('aigt-me', {});
  if (me.name) $('jName').value = me.name;
  show('Join'); setTimeout(() => $('jName').focus(), 50);
} else if (params.has('host')) { setupMode = 'host'; openSetup(); }
else { show('Home'); renderResume(); }
window.AIGT_APP = { H, P, parseMCQs };
})();
