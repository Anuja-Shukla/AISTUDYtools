/* SSC CGL lesson video */
var META = {"crumb": "SSC CGL \u00b7 Quantitative Aptitude \u00b7 <b>Mixtures & alligation</b>"};
var SPEC = [
{
"k": "intro",
"title": "Mixtures & alligation",
"sub": "SSC CGL · Quantitative Aptitude · Topic 9",
"pills": [
"The cross",
"Strengths",
"Water",
"Replacement"
]
},
{
"k": "flow",
"t": "The mixture lies in between",
"steps": [
"Cheaper",
"Mean",
"Dearer"
],
"note": "Alligation finds the mixing ratio in one step"
},
{
"k": "eq",
"t": "The alligation cross",
"lines": [
"Rice ₹40 and ₹60 → mix at ₹46",
"(60 − 46) : (46 − 40) = 14 : 6"
],
"box": "Cheaper : Dearer = 7 : 3",
"note": "Each side gets the difference on the other side"
},
{
"k": "eq",
"t": "Strengths and averages",
"lines": [
"20% and 50% acid → 30%",
"(50 − 30) : (30 − 20)"
],
"box": "= 2 : 1",
"note": "Boys 60, girls 75, class 66 → 9 : 6 = 3 : 2"
},
{
"k": "eq",
"t": "Water costs ₹0",
"lines": [
"Milk ₹50/L → mixture ₹40/L",
"Water : Milk = (50 − 40) : (40 − 0)"
],
"box": "= 1 : 4",
"note": "Sold at CP of milk with 25% gain → water is 25% of milk"
},
{
"k": "eq",
"t": "Removal and replacement",
"lines": [
"Left = x × (1 − y/x)ⁿ",
"40 L, 4 L replaced twice"
],
"box": "40 × 0.9 × 0.9 = 32.4 L",
"note": "A fixed % is lost each time"
},
{
"k": "two",
"t": "Mixing two mixtures",
"a": [
"A  3 : 1",
"3/4 milk",
"equal amounts"
],
"b": [
"B  5 : 3",
"5/8 milk",
"average = 11/16 → 11 : 5"
]
},
{
"k": "mcq",
"q": "Tea at ₹30 and ₹45 per kg is mixed to cost ₹40 per kg. The ratio is…",
"opts": [
"1 : 2",
"2 : 1",
"1 : 3",
"3 : 1"
],
"why": "(45 − 40) : (40 − 30) = 5 : 10"
},
{
"k": "recap",
"items": [
[
"Cross",
"(d − m) : (m − c)"
],
[
"Water",
"costs ₹0"
],
[
"Replacement",
"(1 − y/x)ⁿ"
],
[
"Two mixtures",
"average the fractions"
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
