/* SSC CGL lesson video */
var META = {"crumb": "SSC CGL \u00b7 General Intelligence & Reasoning \u00b7 <b>Counting figures</b>"};
var SPEC = [
{
"k": "intro",
"title": "Counting Figures",
"sub": "SSC CGL · Reasoning · Topic 15",
"pills": [
"Triangles",
"Squares",
"Rectangles",
"Formulas"
]
},
{
"k": "flow",
"t": "Count in a fixed order",
"steps": [
"Smallest",
"Two pieces",
"Three pieces",
"Whole"
],
"note": "Never count at random"
},
{
"k": "eq",
"t": "Square with both diagonals",
"lines": [
"4 small triangles",
"4 made of two small ones"
],
"box": "8 triangles",
"note": "Group by size"
},
{
"k": "eq",
"t": "Squares in an n × n grid",
"lines": [
"1² + 2² + … + n²",
"3 × 3 → 9 + 4 + 1"
],
"box": "14 squares",
"note": "4 × 4 → 30"
},
{
"k": "eq",
"t": "Rectangles",
"lines": [
"choose 2 horizontal and 2 vertical lines",
"2 × 3 grid: C(3,2) × C(4,2)"
],
"box": "3 × 6 = 18",
"note": "Squares count as rectangles"
},
{
"k": "eq",
"t": "Lines from one corner",
"lines": [
"k lines to the base",
"triangles = C(k + 2, 2)"
],
"box": "1 median → 3",
"note": "2 lines → 6"
},
{
"k": "table",
"t": "The classic 16",
"head": [
"Size",
"Count"
],
"rows": [
[
"small",
"8"
],
[
"two pieces",
"4"
],
[
"four pieces",
"4"
],
[
"total",
"16"
]
],
"w": 520
},
{
"k": "mcq",
"q": "How many squares are in a 4 × 4 grid?",
"opts": [
"30",
"16",
"25",
"20"
],
"why": "16 + 9 + 4 + 1"
},
{
"k": "recap",
"items": [
[
"Order",
"smallest first"
],
[
"Grid squares",
"sum of squares"
],
[
"Rectangles",
"C(h,2) × C(v,2)"
],
[
"Care",
"no double counting"
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
