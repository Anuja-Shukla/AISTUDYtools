/* SSC CGL lesson video */
var META = {"crumb": "SSC CGL \u00b7 Quantitative Aptitude \u00b7 <b>Averages</b>"};
var SPEC = [
{
"k": "intro",
"title": "Averages",
"sub": "SSC CGL · Quantitative Aptitude · Topic 5",
"pills": [
"Totals",
"Join & replace",
"Combined",
"Average speed"
]
},
{
"k": "eq",
"t": "Average and total",
"lines": [
"Average = Sum ÷ Count",
"Sum = Average × Count"
],
"box": "Work with totals",
"note": "24, 36, 42, 18, 30 → 150 ÷ 5 = 30"
},
{
"k": "eq",
"t": "Deviation method",
"lines": [
"72, 75, 78, 81, 74   base 75",
"−3, 0, +3, +6, −1  →  +5 ÷ 5 = +1"
],
"box": "Average = 76",
"note": "Pick a base close to the numbers"
},
{
"k": "eq",
"t": "Someone joins",
"lines": [
"10 students, average 15  →  total 150",
"+ teacher: 11 people, average 16  →  176"
],
"box": "Teacher = 176 − 150 = 26",
"note": "Shortcut: 16 + 10 × 1 = 26"
},
{
"k": "eq",
"t": "Replacement",
"lines": [
"New = old + count × change",
"52 + 8 × 1.5"
],
"box": "New person = 64 kg",
"note": "The count does not change"
},
{
"k": "eq",
"t": "Combined average",
"lines": [
"30 students × 60 = 1,800",
"20 students × 70 = 1,400"
],
"box": "3,200 ÷ 50 = 64",
"note": "The bigger group pulls the average towards it"
},
{
"k": "two",
"t": "The average speed trap",
"a": [
"Wrong",
"(40 + 60) ÷ 2 = 50",
"simple mean"
],
"b": [
"Right",
"2 × 40 × 60 ÷ 100 = 48",
"equal distances"
]
},
{
"k": "mcq",
"q": "11th innings: scores 90, average rises by 5. New average?",
"opts": [
"40",
"45",
"35",
"50"
],
"why": "90 − 10 × 5 = 40"
},
{
"k": "recap",
"items": [
[
"Totals",
"average × count"
],
[
"Join / leave",
"compare totals"
],
[
"Replace",
"old + n × change"
],
[
"Speed",
"2xy ÷ (x + y)"
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
