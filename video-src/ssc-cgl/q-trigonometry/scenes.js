/* SSC CGL lesson video */
var META = {"crumb": "SSC CGL \u00b7 Quantitative Aptitude \u00b7 <b>Trigonometry</b>"};
var SPEC = [
{
"k": "intro",
"title": "Trigonometry, heights & distances",
"sub": "SSC CGL · Quantitative Aptitude · Topic 15",
"pills": [
"Ratios",
"Values",
"Identities",
"Heights"
]
},
{
"k": "list",
"t": "The six ratios",
"items": [
[
"sin θ",
"P / H"
],
[
"cos θ",
"B / H"
],
[
"tan θ",
"P / B"
],
[
"cosec, sec, cot",
"1/sin, 1/cos, 1/tan"
]
],
"w": 700
},
{
"k": "table",
"t": "Standard values",
"head": [
"θ",
"0°",
"30°",
"45°",
"60°",
"90°"
],
"rows": [
[
"sin",
"0",
"1/2",
"1/√2",
"√3/2",
"1"
],
[
"cos",
"1",
"√3/2",
"1/√2",
"1/2",
"0"
],
[
"tan",
"0",
"1/√3",
"1",
"√3",
"—"
]
],
"w": 760
},
{
"k": "list",
"t": "Three identities",
"items": [
[
"sin²θ + cos²θ",
"= 1"
],
[
"1 + tan²θ",
"= sec²θ"
],
[
"1 + cot²θ",
"= cosec²θ"
]
],
"note": "sec θ + tan θ = k → sec θ − tan θ = 1/k",
"w": 640
},
{
"k": "eq",
"t": "Complementary angles",
"lines": [
"sin(90° − θ) = cos θ",
"tan(90° − θ) = cot θ"
],
"box": "sin 37° ÷ cos 53° = 1",
"note": "tan 10° tan 20° tan 70° tan 80° = 1"
},
{
"k": "eq",
"t": "Maximum value",
"lines": [
"a sin θ + b cos θ ≤ √(a² + b²)",
"3 sin θ + 4 cos θ"
],
"box": "Maximum = 5",
"note": "a sin²θ + b cos²θ lies between a and b"
},
{
"k": "eq",
"t": "Heights and distances",
"lines": [
"tan θ = height ÷ distance",
"30 m away, elevation 60°"
],
"box": "Height = 30√3 m",
"note": "Shadow = height → elevation 45°"
},
{
"k": "mcq",
"q": "If sin θ = 3/5, then tan θ = ?",
"opts": [
"3/4",
"4/3",
"4/5",
"5/3"
],
"why": "3-4-5 triangle: P = 3, B = 4"
},
{
"k": "recap",
"items": [
[
"Ratios",
"draw the triangle"
],
[
"Values",
"learn the table"
],
[
"Identities",
"sin² + cos² = 1"
],
[
"Heights",
"tan = height ÷ distance"
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
