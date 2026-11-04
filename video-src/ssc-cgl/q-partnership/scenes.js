/* SSC CGL lesson video */
var META = {"crumb": "SSC CGL \u00b7 Quantitative Aptitude \u00b7 <b>Partnership</b>"};
var SPEC = [
{
"k": "intro",
"title": "Partnership",
"sub": "SSC CGL · Quantitative Aptitude · Topic 8",
"pills": [
"Capital",
"Capital × months",
"Working partner"
]
},
{
"k": "eq",
"t": "Same time: share by capital",
"lines": [
"A ₹30,000 · B ₹45,000",
"Ratio 2 : 3 · profit ₹15,000"
],
"box": "A ₹6,000 · B ₹9,000",
"note": "5 parts → 1 part = ₹3,000"
},
{
"k": "eq",
"t": "Different times",
"lines": [
"A: 40,000 × 12 = 480",
"B: 60,000 × 6 = 360"
],
"box": "Profit ratio 4 : 3",
"note": "Profit share ∝ capital × months"
},
{
"k": "eq",
"t": "Joining later",
"lines": [
"B joins after 4 months → in for 8",
"50 × 12 = 600 · 60 × 8 = 480"
],
"box": "A : B = 5 : 4",
"note": "In for 12 − x months, not x"
},
{
"k": "eq",
"t": "Changing capital",
"lines": [
"A: 30 × 6 + 20 × 6 = 300",
"B: 25 × 12 = 300"
],
"box": "A : B = 1 : 1",
"note": "Add each block of capital × months"
},
{
"k": "flow",
"t": "Working partner",
"steps": [
"Profit ₹50,000",
"10% salary to A",
"₹45,000 left",
"Share 3 : 2"
],
"note": "A = 5,000 + 27,000 = ₹32,000 · B = ₹18,000"
},
{
"k": "eq",
"t": "Finding the missing time",
"lines": [
"Time ratio = profit ratio ÷ capital ratio",
"Capitals 3 : 5 · profits 9 : 10"
],
"box": "Times = 9/3 : 10/5 = 3 : 2",
"note": "Same idea finds a missing capital"
},
{
"k": "mcq",
"q": "A invests ₹50,000 for 12 months, B ₹60,000 for 8 months. Profit ratio?",
"opts": [
"5 : 4",
"5 : 6",
"3 : 2",
"1 : 1"
],
"why": "600 : 480 = 5 : 4"
},
{
"k": "recap",
"items": [
[
"Same time",
"share by capital"
],
[
"Different times",
"capital × months"
],
[
"Joined after x",
"12 − x months"
],
[
"Salary",
"pay it first"
]
]
}
];
function R(s) {
  var T_ = s.t ? (s.t.length > 34 ? T2(s.t) : T(s.t)) : "";
  switch (s.k) {
    case "intro": return null;
    case "list": return T(s.t) + sp(24) + listOf(s.items, 0.1, 0.6 / s.items.length, s.w || 720, s.size || 25) + (s.note ? sp(20) + note(s.note, 0.85, true) : "");
    case "grid": return T(s.t) + sp(26) + grid(s.cards, s.cols || Math.min(3, s.cards.length), 0.1, 0.55 / s.cards.length, s.w || (s.cards.length >= 3 ? 250 : 330)) + (s.note ? sp(20) + note(s.note, 0.85) : "");
    case "table": return T(s.t) + sp(18) + table(s.head, s.rows, 0.06, 0.6 / (s.rows.length + 1), s.hl === undefined ? -1 : s.hl, s.w || 760) + (s.note ? sp(14) + note(s.note, 0.88, true) : "");
    case "eq": var n = s.lines.length, h = T(s.t) + sp(22);
      s.lines.forEach(function (l, i) { h += eq(l, 0.08 + i * (0.5 / Math.max(n, 1)), s.size || 27); });
      if (s.box) h += sp(16) + boxed(s.box, 0.66, 30);
      if (s.note) h += sp(14) + note(s.note, 0.84, true);
      return h;
    case "two": return T(s.t) + sp(30) + '<div class="row" style="gap:24px;align-items:stretch">' + cardT(s.a[0], s.a[1], s.a[2] || "", 0.12, 360, "var(--teal)") + cardT(s.b[0], s.b[1], s.b[2] || "", 0.45, 360, "var(--orange)") + "</div>" + (s.note ? sp(24) + note(s.note, 0.8) : "");
    case "flow": var f = '<div class="row" style="gap:6px;flex-wrap:wrap;justify-content:center">', m = s.steps.length;
      s.steps.forEach(function (x, i) { f += pill(x, 0.08 + i * (0.6 / m), i % 2 ? "n" : ""); if (i < m - 1) f += arrow(0.12 + i * (0.6 / m)); });
      return T(s.t) + sp(34) + f + "</div>" + (s.note ? sp(30) + note(s.note, 0.82) : "");
    case "chips": return T(s.t) + sp(34) + chipsRow(s.items, 0.1, 0.6 / s.items.length) + (s.note ? sp(28) + note(s.note, 0.84, true) : "");
  }
  return T(s.t || "");
}
var SCENES = SPEC.map(function (s) {
  if (s.k === "intro") return introScene(s.title, s.sub, s.pills);
  if (s.k === "mcq") return mcqScene(s.q, s.opts, 0, s.why);
  if (s.k === "recap") return recapScene(s.items, s.last);
  return { tag: s.tag || "Lesson", draw: function () { return R(s); } };
});
