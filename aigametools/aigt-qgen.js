/* AIgametools question maker: builds MCQs from PDF or pasted notes, in the browser (no AI key).
   Shares its rules-based engine with the Cheat Sheet tool. */
(function () {
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const PDFJS = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs';
const WORKER = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs';

const STOP = new Set(('a about above after again against all also am an and any are as at be because been before being below between both but by can could did do does doing down during each either etc few for from further had has have having he her here hers him his how however i if in into is it its itself just less like may me might more most must my no nor not now of off on once only or other our out over own per same shall she should since so some such than that the their them then there these they this those through thus to too under until up upon us use used using very via was we were what when where whether which while who whom whose why will with within without would yet you your e.g i.e eg ie one two three four five first second third new many much well also often usually generally given called known example examples include includes including based able make makes made way ways get gets need needs case cases different important key main lecture slide slides chapter page figure table').split(' '));
const PRON = /^(this|that|these|those|it|they|them|he|she|we|you|there|here|such|which|its|their|our|also|thus|hence|so|but|and|or|when|if|while|because|although|though|as|since|where|how|why|what|once|after|before|unless|many|some|most|all|each|every|both|other|another|more|less|higher|lower|shorter|longer|larger|smaller|greater|better|worse|faster|slower|in|on|for|with|by|to|from)\b/i;
function textToPages(txt) {
  const lines = txt.replace(/\r/g, '').split('\n').map(t => ({ t: t.replace(/^#+\s*/, m => (m ? '' : '')).trim(), size: /^\s*#/.test(t) ? 14 : 10, mdHead: /^\s*#/.test(t) })).filter(l => l.t);
  return [{ n: 1, lines }];
}
const BULLET = /^\s*(?:[•●▪◦‣∙·○■□➢➤►\-–—*]|\(?\d{1,2}[.)]|\(?[a-hA-H][.)])\s+/;
function analyse(pages) {
  // drop repeated headers/footers and page numbers
  const norm = t => t.toLowerCase().replace(/\d+/g, '#').replace(/\s+/g, ' ').trim();
  const seen = {};
  pages.forEach(p => new Set(p.lines.map(l => norm(l.t))).forEach(k => { seen[k] = (seen[k] || 0) + 1; }));
  const rep = k => pages.length >= 2 && seen[k] >= Math.max(2, pages.length * 0.4) && k.length < 120;
  const all = [];
  pages.forEach(p => p.lines.forEach(l => {
    if (/^(page\s*)?\d+(\s*(of|\/)\s*\d+)?$/i.test(l.t) || rep(norm(l.t))) return;
    all.push({ t: l.t, size: l.size, page: p.n, md: l.mdHead });
  }));
  if (!all.length) return null;
  // body font size = most common size by characters
  const bySize = {}; all.forEach(l => { bySize[l.size] = (bySize[l.size] || 0) + l.t.length; });
  const body = +Object.entries(bySize).sort((a, b) => b[1] - a[1])[0][0];
  const anyMd = all.some(l => l.md);
  const isHeading = (l, next) => {
    const w = l.t.split(/\s+/).length;
    if (BULLET.test(l.t) || w > 12 || l.t.length > 90 || /[.,;:]$/.test(l.t) && !l.md) return false;
    if (l.md) return true;
    if (l.size >= body * 1.15) return true;
    if (/^[A-Z0-9][A-Z0-9 &:,'’()\-\/]{3,}$/.test(l.t) && w <= 8 && /[A-Z]{3}/.test(l.t)) return true;
    // plain-text heading: short title-like line followed by a longer line
    return pages.length === 1 && !anyMd && w <= 7 && /^[A-Z0-9]/.test(l.t) && !/[.?!]$/.test(l.t) && next && next.t.length > l.t.length + 20 && !/=/.test(l.t);
  };
  // build sections of paragraphs / bullet items
  const sections = []; let sec = { head: 'Overview', page: all[0].page, blocks: [] }; sections.push(sec);
  let firstHead = null;
  let para = null;
  all.forEach((l, i) => {
    if (isHeading(l, all[i + 1])) { if (!firstHead) firstHead = l.t; sec = { head: l.t.replace(/\s*[:\-–]\s*$/, ''), page: l.page, blocks: [] }; sections.push(sec); para = null; return; }
    const bullet = BULLET.test(l.t);
    const text = l.t.replace(BULLET, '');
    const formulaLine = isFormula(text);
    if (bullet || formulaLine || !para || /[.?!:]["”)]?$/.test(para.t) && /^[A-Z0-9"“(]/.test(text) || para.bullet && !/^[a-z]/.test(text) || para.formula) {
      para = { t: text, page: l.page, bullet, formula: formulaLine }; sec.blocks.push(para);
    } else {
      para.t = para.t.replace(/-$/, '') + (/-$/.test(para.t) ? '' : ' ') + text;
    }
  });
  const secs = sections.filter(s => s.blocks.length);
  // sentences
  const sents = [];
  secs.forEach((s, si) => s.blocks.forEach(b => {
    if (b.formula) return;
    const parts = b.bullet ? [b.t] : b.t.split(/(?<=[.?!])\s+(?=[A-Z0-9"“(])/);
    parts.forEach(t => { t = t.trim(); if (t.split(/\s+/).length >= 3) sents.push({ t, page: b.page, si, bullet: b.bullet }); });
  }));
  // candidate terms
  const freq = {}, spread = {};
  const addTerm = (raw, si, w) => {
    const k = raw.toLowerCase().replace(/[’']s$/, '');
    if (k.length < 3 || /^\d/.test(k)) return;
    freq[k] = (freq[k] || 0) + w; (spread[k] = spread[k] || new Set()).add(si);
  };
  sents.forEach(s => {
    const toks = s.t.replace(/[^\p{L}\p{N}\s\-’']/gu, ' ').split(/\s+/).filter(Boolean);
    for (let i = 0; i < toks.length; i++) for (let n = 1; n <= 3 && i + n <= toks.length; n++) {
      const g = toks.slice(i, i + n);
      if (g.some(x => STOP.has(x.toLowerCase())) || g.some(x => x.length < 2)) continue;
      if (n === 1 && (g[0].length < 5 && !/^[A-Z]{2,6}s?$/.test(g[0]))) continue;
      addTerm(g.join(' '), s.si, n === 1 ? 1 : n === 2 ? 1.8 : 2.4);
    }
  });
  // definitions
  const defs = []; const defKeys = new Set();
  const DEF1 = /^(?:(?:An?|The)\s+)?(.{2,70}?)\s+(is defined as|can be defined as|is known as|is called|refers to|refer to|means|describes|represents|is|are)\s+((?:(?:a|an|the)\s+)?.{12,})$/i;
  const DEF2 = /^([A-Z][^:]{1,55}):\s+(.{10,})$/;
  const DEF3 = /^([A-Z][^–—]{1,50})\s+[–—-]\s+(.{12,})$/;
  sents.forEach(s => {
    const m2 = s.t.match(DEF2), m3 = !m2 && s.t.match(DEF3), m1 = !m2 && !m3 && s.t.match(DEF1);
    const m = m2 || m3 || m1;
    if (!m) return;
    let term = m[1].trim().replace(/^(an?|the)\s+/i, ''), def = (m1 ? m[3] : m[2]).trim();
    if (m1 && /^(is|are)$/i.test(m[2]) && !/^(a|an|the|one|any|how|what|when|where|that|which|whether)\b/i.test(def)) return;
    if (/^\w+ly\b/i.test(def)) return;
    const w = term.replace(/\s*\(.*?\)\s*/g, ' ').trim().split(/\s+/).length;
    if (w > 6 || PRON.test(term) || /\b(is|are|was|has|have|can|will|should|must)\b/i.test(term) || /^\d/.test(term) || /[.?!,;]/.test(term.replace(/\(.*?\)/g, ''))) return;
    if (m1 && w > 5) return;
    const key = term.toLowerCase().replace(/\s*\(.*?\)\s*/g, '').trim();
    if (defKeys.has(key)) return;
    def = def.replace(/\s+/g, ' ');
    if (def.length > 230) def = def.slice(0, 230).replace(/\s\S*$/, '') + '…';
    defKeys.add(key);
    defs.push({ term: term.replace(/\s+/g, ' '), key, def: def[0].toUpperCase() + def.slice(1), page: s.page, si: s.si, src: s.t });
    addTerm(key, s.si, 6);
    const ac = term.match(/\(([A-Z][A-Za-z0-9/&]{1,7})\)/); if (ac) addTerm(ac[1], s.si, 3);
  });
  // score terms
  const terms = Object.keys(freq).map(k => ({ k, score: freq[k] * (1 + 0.3 * (spread[k].size - 1)) }))
    .filter(t => t.score >= 2.5).sort((a, b) => b.score - a.score);
  const kept = [];
  terms.forEach(t => { if (!kept.some(o => (o.k.includes(t.k) || t.k.includes(o.k)) && o.score >= t.score * 0.7)) kept.push(t); });
  const termScore = {}; kept.slice(0, 60).forEach(t => { termScore[t.k] = t.score; });
  // formulas
  const formulas = [];
  secs.forEach(s => s.blocks.forEach(b => {
    const cands = b.formula ? [b.t] : (b.t.match(/[A-Za-z][A-Za-z0-9 ()\/]{0,40}\s=\s[^.;]{2,90}/g) || []);
    cands.forEach(f => { f = f.trim().replace(/[.,;]$/, ''); if (isFormula(f) && !formulas.some(x => x.f === f)) formulas.push({ f, lhs: f.split('=')[0].trim(), page: b.page, head: s.head }); });
  }));
  // lists / frameworks
  const lists = [];
  secs.forEach((s, si) => {
    let run = [], intro = null;
    const flush = () => { if (run.length >= 3) { const items = run.map(b => b.t.replace(/[.;]$/, '')).filter(x => x.length <= 140); if (items.length >= 3) lists.push({ title: listTitle(intro, s.head), items, page: run[0].page, si }); } run = []; };
    s.blocks.forEach(b => { if (b.bullet) { if (!run.length) intro = s.blocks[s.blocks.indexOf(b) - 1]; run.push(b); } else flush(); });
    flush();
  });
  sents.forEach(s => {
    const m = s.t.match(/^(?:(?:The|An?)\s+)?(.{3,60}?)\s+(?:are|include|includes|consists? of|comprises?|has \w+ (?:categories|types|stages|steps|parts|elements|components)|have \w+ (?:categories|types|stages|steps|parts))\s*:?\s+(.+?)\.?$/i);
    if (!m || PRON.test(m[1])) return;
    const items = m[2].split(/,\s*(?:and\s+|or\s+)?|\s+and\s+/).map(x => x.trim().replace(/^(?:and|or)\s+/, '')).filter(Boolean);
    if (items.length >= 3 && items.length <= 8 && items.every(x => x.split(/\s+/).length <= 5 && x.length > 1)) lists.push({ title: m[1].trim(), items, page: s.page, si: s.si, inline: true });
  });
  // key sentences
  const defSrc = new Set(defs.map(d => d.src));
  const CUE = /\b(important|key|main|therefore|because|must|should|advantage|benefit|limitation|risk|helps?|aims?|focus|best|whereas|while|instead|rather than|compared)\b/i;
  sents.forEach(s => {
    const low = s.t.toLowerCase(); let sc = 0; const has = [];
    Object.keys(termScore).forEach(k => { if (k.length > 2 && new RegExp('\\b' + reEsc(k) + '\\b').test(low)) { sc += Math.log(1 + termScore[k]); has.push(k); } });
    const w = s.t.split(/\s+/).length;
    if (CUE.test(s.t)) sc += 1.2;
    if (/\d/.test(s.t)) sc += 0.4;
    if (w < 7 || w > 40) sc *= 0.5;
    if (PRON.test(s.t)) sc *= 0.6;
    if (defSrc.has(s.t)) sc *= 0.3;
    s.score = sc; s.terms = has;
  });
  const big = all.filter(l => l.size >= body * 1.3 && l.t.length <= 90);
  const title = (big[0] && big[0].t) || firstHead || 'Cheat sheet';
  return { secs, sents, defs, formulas, lists: dedupeLists(lists), termScore, body, title, pages: pages.length };
}
function isFormula(t) {
  if (!/=/.test(t) || /https?:|www\./i.test(t) || t.length > 140) return false;
  const [l, r] = [t.slice(0, t.indexOf('=')), t.slice(t.indexOf('=') + 1)];
  if (!/[A-Za-zΣ∑]/.test(l) || !r.trim() || l.split(/\s+/).length > 7) return false;
  return /[×x*÷\/+\-−^√Σ∑()%]|\d/.test(r) || r.split(/\s+/).length <= 10;
}
function listTitle(intro, head) {
  if (intro && !intro.bullet && /:$/.test(intro.t.trim())) {
    const last = intro.t.trim().replace(/:$/, '').split(/(?<=[.?!])\s+/).pop();
    const m = last.match(/^(?:(the|an?)\s+)?(.{2,50}?)\s+(?:has|have|includes?|consists? of|comprises?|are|is made up of|can be grouped into)\b/i);
    if (m && !PRON.test(m[2])) return (m[1] && /^the$/i.test(m[1]) ? 'the ' : '') + m[2];
    if (last.length <= 60 && !PRON.test(last)) return last;
  }
  return head;
}
function dedupeLists(L) { const out = []; L.forEach(l => { if (!out.some(o => o.items.join('|') === l.items.join('|'))) out.push(l); }); return out; }
const cap = s => s ? s[0].toUpperCase() + s.slice(1) : s;
const balanced = s => { let d = 0; for (const c of s) { if (c === '(') d++; if (c === ')' && --d < 0) return false; } return d === 0; };
const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function pickDistractors(answer, pool, n = 3, prefer = 0) {
  const a = answer.toLowerCase();
  const wc = answer.split(/\s+/).length, isAc = /^[A-Z0-9]{2,7}s?$/.test(answer);
  const seenL = new Set(); const cands = pool.filter(p => { const l = p.toLowerCase().trim(); if (seenL.has(l)) return false; seenL.add(l); return l !== a && !l.includes(a) && !a.includes(l) && p.length > 1; });
  const rank = new Map(pool.map((p, i) => [p, i]));
  const scored = shuffle(cands).map(p => ({ p, d: (prefer && rank.get(p) >= prefer ? 1.5 : 0) + Math.abs(p.split(/\s+/).length - wc) + (/^[A-Z0-9]{2,7}s?$/.test(p) !== isAc ? 2 : 0) + Math.abs(p.length - answer.length) / 25 }));
  return scored.sort((x, y) => x.d - y.d).slice(0, n).map(x => x.p);
}
function numDistractors(numStr) {
  const pct = /%$/.test(numStr), v = parseFloat(numStr.replace(/[^\d.]/g, ''));
  if (!isFinite(v)) return null;
  const dec = (numStr.split('.')[1] || '').replace(/\D/g, '').length;
  const year = !pct && /^(19|20)\d{2}$/.test(numStr);
  let opts = year ? [v - 2, v + 1, v + 3, v - 5] : [v * 2, v / 2, v * 1.5, v + (v >= 10 ? 10 : 1), v - (v > 10 ? 10 : 0.5)];
  opts = [...new Set(opts.filter(x => x > 0 && x !== v && (!pct || x <= 100)).map(x => (dec ? x.toFixed(dec) : String(Math.round(x))) + (pct ? '%' : '')))].filter(x => x !== numStr);
  return shuffle(opts).slice(0, 3);
}
function shorten(s, n) { s = s.replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n).replace(/\s\S*$/, '') + '…' : s; }
function blank(sentence, word) {
  const re = new RegExp('\\b' + reEsc(word) + '\\b', 'i');
  return sentence.replace(re, '_______');
}
function buildMCQs() {
  const Q = [];
  const defs = A.defs;
  const raw = ' ' + A.sents.map(x => x.t).join(' ');
  const surface = k => { const re = new RegExp('(.)\\s?\\b(' + reEsc(k) + ')\\b', 'ig'); let m, first = null; while ((m = re.exec(raw))) { if (!first) first = m[2]; if (!/[.!?:]/.test(m[1])) return m[2]; } return first || k; };
  const isAcr = k => /^[A-Z0-9]{2,6}s?$/.test(surface(k));
  const termPool = [...defs.map(d => cap(d.term.replace(/\s*\(.*?\)\s*/g, '').trim())), ...Object.keys(A.termScore).filter(k => k.split(' ').length <= 4 && (k.includes(' ') || isAcr(k))).map(k => cap(surface(k)))];
  const nDefTerms = defs.length;
  // name the term
  defs.forEach(d => {
    const ans = cap(d.term.replace(/\s*\(.*?\)\s*/g, '').trim());
    const ds = pickDistractors(ans, termPool, 3, nDefTerms); if (ds.length < 3) return;
    const stem = shorten(d.def.replace(new RegExp('\\b' + reEsc(ans) + '\\b', 'ig'), 'this'), 200);
    Q.push({ type: 'term', q: `Which term matches this description? “${stem.replace(/\.$/, '')}”`, a: ans, opts: ds, src: d.src, page: d.page, w: 3 });
  });
  // what does X mean
  if (defs.length >= 4) defs.forEach(d => {
    const others = shuffle(defs.filter(o => o !== d)).slice(0, 3).map(o => shorten(o.def, 120));
    Q.push({ type: 'def', q: `What does “${d.term.replace(/\s*\(.*?\)\s*/g, '')}” mean?`, a: shorten(d.def, 120), opts: others, src: d.src, page: d.page, w: 2.5 });
  });
  // list membership
  A.lists.forEach((l, i) => {
    const otherItems = A.lists.filter(o => o !== l).flatMap(o => o.items).concat(termPool);
    const short = l.items.map(x => shorten(x.split(/:\s/)[0], 70));
    const pick = short[Math.floor(Math.random() * short.length)];
    const ds = pickDistractors(pick, otherItems.map(x => shorten(x.split(/:\s/)[0], 70)).filter(x => !short.includes(x)));
    if (ds.length >= 3) Q.push({ type: 'list', q: `Which of these is part of ${l.title}?`, a: pick, opts: ds, src: `${l.title}: ${short.join('; ')}`, page: l.page, w: 2.5 });
    if (short.length >= 3) {
      const out = pickDistractors(short[0], otherItems.map(x => shorten(x.split(/:\s/)[0], 70)).filter(x => !short.includes(x)), 1)[0];
      if (out) Q.push({ type: 'listnot', q: `Which of these is NOT part of ${l.title}?`, a: out, opts: shuffle(short).slice(0, 3), src: `${l.title}: ${short.join('; ')}`, page: l.page, w: 2 });
    }
  });
  // formulas
  if (A.formulas.length >= 2) A.formulas.forEach(f => {
    const rhs = f.f.slice(f.f.indexOf('=') + 1).trim();
    const others = A.formulas.filter(o => o !== f).map(o => o.f.slice(o.f.indexOf('=') + 1).trim());
    const tweaks = [];
    if (rhs.split('/').length === 2) { const [n, d] = rhs.split('/'); if (balanced(n) && balanced(d)) tweaks.push(`${d.trim()} / ${n.trim()}`); }
    if (/×/.test(rhs)) tweaks.push(rhs.replace(/×/, '+'));
    if (/\+/.test(rhs)) tweaks.push(rhs.replace(/\+/, '−'));
    const ds = [...new Set([...tweaks, ...others])].filter(x => x !== rhs).slice(0, 3);
    if (ds.length >= 3) Q.push({ type: 'formula', q: `${f.lhs} = ?`, a: rhs, opts: ds, src: f.f, page: f.page, w: 2.5, mono: true });
  });
  // fill in the blank (terms)
  const topTerms = [...new Set([...A.defs.map(d => d.key), ...Object.keys(A.termScore).filter(k => k.split(' ').length >= 2 || isAcr(k) && A.termScore[k] >= 4)])].filter(k => k.length > 2).slice(0, 50);
  const defSrcs = new Set(A.defs.map(d => d.src));
  const usedSent = new Set();
  A.sents.filter(s => s.score > 1 && s.t.split(/\s+/).length >= 8 && s.t.split(/\s+/).length <= 38 && !PRON.test(s.t)).sort((a, b) => b.score - a.score).forEach(s => {
    if (usedSent.has(s.t) || defSrcs.has(s.t) || s.bullet) return;
    const low = s.t.toLowerCase();
    const k = topTerms.find(k => (low.match(new RegExp('\\b' + reEsc(k) + '\\b', 'g')) || []).length === 1 && low.indexOf(k) > 0);
    if (!k) return;
    const orig = s.t.match(new RegExp('\\b' + reEsc(k) + '\\b', 'i'))[0];
    const pool = topTerms.filter(x => x !== k).map(x => { const sf = surface(x); return /^[A-Z]/.test(orig) ? cap(sf) : (isAcr(x) ? sf : sf[0].toLowerCase() + sf.slice(1)); });
    const ds = pickDistractors(orig, pool); if (ds.length < 3) return;
    usedSent.add(s.t);
    Q.push({ type: 'blank', q: `Fill in the blank: “${blank(s.t, orig)}”`, a: orig, opts: ds, src: s.t, page: s.page, w: 1.6 + Math.min(1, s.score / 6) });
  });
  // fill in the number
  A.sents.forEach(s => {
    const m = s.t.match(/(?<![\w.])(\d+(?:\.\d+)?%?)(?![\w.])/g); if (!m || s.t.split(/\s+/).length < 7) return;
    const n = m.find(x => !/^[0-3]$/.test(x)) || m[0];
    const ds = numDistractors(n); if (!ds || ds.length < 3) return;
    Q.push({ type: 'num', q: `Fill in the number: “${s.t.replace(n, '_____')}”`, a: n, opts: ds, src: s.t, page: s.page, w: 1.8 });
  });
  return Q;
}
let libP = null;
function loadLib() {
  if (!libP) libP = import(window.AIGT_PDFJS || PDFJS).then(m => { m.GlobalWorkerOptions.workerSrc = window.AIGT_PDFJS_WORKER || WORKER; return m; }).catch(e => { libP = null; throw e; });
  return libP;
}
async function openPdf(file) {
  const lib = await loadLib();
  return lib.getDocument({ data: await file.arrayBuffer() }).promise;
}
async function readPages(doc, a, b, onProg) {
  const pages = [];
  for (let n = a; n <= b; n++) {
    if (onProg) onProg(n, a, b);
    const page = await doc.getPage(n);
    const tc = await page.getTextContent();
    const lines = []; let cur = null;
    tc.items.forEach(it => {
      if (!('str' in it)) return;
      const y = it.transform[5], size = Math.round(Math.hypot(it.transform[2], it.transform[3]) * 10) / 10 || it.height || 10;
      if (!cur || Math.abs(y - cur.y) > Math.max(2, size * 0.45)) { cur = { y, size, t: '' }; lines.push(cur); }
      if (it.str.trim() && size > cur.size) cur.size = size;
      cur.t += (cur.t && !/\s$/.test(cur.t) && it.str && !/^\s/.test(it.str) ? (it.str.length > 1 || /\w/.test(it.str) ? ' ' : '') : '') + it.str;
      if (it.hasEOL) cur = null;
    });
    pages.push({ n, lines: lines.map(l => ({ t: l.t.replace(/\s+/g, ' ').trim(), size: l.size })).filter(l => l.t) });
  }
  return pages;
}
let A = null;
// Returns [{q, options:[4], answer:index, src, page}] with a varied mix and no repeated answers.
function generate(pages, max) {
  A = analyse(pages);
  if (!A) return [];
  const Q = buildMCQs();
  const byType = {}; shuffle(Q).sort((a, b) => b.w - a.w + (Math.random() - 0.5) * 1.2).forEach(q => { (byType[q.type] = byType[q.type] || []).push(q); });
  const types = Object.keys(byType); const out = []; const ans = new Set(); let guard = 0;
  while (out.length < (max || 30) && guard++ < 800 && types.some(t => byType[t].length)) {
    const q = byType[types[guard % types.length]].shift(); if (!q) continue;
    const k = q.a.toLowerCase(); if (ans.has(k)) continue; ans.add(k);
    const opts = shuffle([q.a, ...q.opts.slice(0, 3)]);
    if (opts.length < 4 || new Set(opts.map(o => o.toLowerCase())).size < 4) continue;
    out.push({ q: q.q, options: opts, answer: opts.indexOf(q.a), src: q.src, page: q.page });
  }
  return out;
}
window.AIQGen = { openPdf, readPages, textToPages, generate };
})();
