/* SSC CGL lesson video */
var META = { crumb: "SSC CGL \u00b7 Quantitative Aptitude \u00b7 <b>Percentages</b>" };
var SPEC = [
{
"k": "intro",
"title": "Percentages",
"sub": "SSC CGL · Quantitative Aptitude · Topic 3",
"pills": [
"Meaning",
"Fraction table",
"% change",
"Successive change"
]
},
{
"k": "eq",
"t": "What is a per cent?",
"lines": [
"Per cent = per hundred",
"x% of y = x ÷ 100 × y"
],
"box": "20% of 450 = 90",
"note": "Tip: x% of y = y% of x, so 8% of 25 = 25% of 8 = 2"
},
{
"k": "table",
"t": "Fractions every topper knows",
"head": [
"Fraction",
"Per cent",
"Fraction",
"Per cent"
],
"rows": [
[
"1/2",
"50%",
"1/6",
"16⅔%"
],
[
"1/3",
"33⅓%",
"1/7",
"14 2/7%"
],
[
"1/4",
"25%",
"1/8",
"12½%"
],
[
"1/5",
"20%",
"1/9",
"11 1/9%"
]
],
"w": 720
},
{
"k": "eq",
"t": "Percentage change",
"lines": [
"Change % = (New − Old) ÷ Old × 100",
"Price rises from ₹80 to ₹100"
],
"box": "20 ÷ 80 × 100 = 25% increase",
"note": "Always divide by the OLD value"
},
{
"k": "two",
"t": "The base trap",
"a": [
"Up 20%, then down 20%",
"₹100 → ₹120 → ₹96",
"net loss of 4%"
],
"b": [
"A is 25% more than B",
"B is 20% less than A",
"25 ÷ 125 = 20%"
]
},
{
"k": "eq",
"t": "Successive change",
"lines": [
"Net % = a + b + ab ÷ 100",
"+10% and then +20%"
],
"box": "10 + 20 + 200 ÷ 100 = 32% rise",
"note": "For a decrease, put b as a negative number"
},
{
"k": "list",
"t": "Three exam shortcuts",
"items": [
[
"Multiplying factor",
"+15% → × 1.15, −15% → × 0.85"
],
[
"Keep spending fixed",
"cut use by r ÷ (100 + r) × 100"
],
[
"Growth over n years",
"P × (1 + r/100)ⁿ"
]
],
"w": 760
},
{
"k": "mcq",
"q": "Sugar costs 25% more. To keep spending the same, cut consumption by…",
"opts": [
"20%",
"25%",
"15%",
"30%"
],
"why": "25 ÷ 125 × 100 = 20%"
},
{
"k": "recap",
"items": [
[
"Per cent",
"per hundred"
],
[
"% change",
"divide by the old value"
],
[
"Successive",
"a + b + ab/100"
],
[
"Practise",
"the fraction table daily"
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
