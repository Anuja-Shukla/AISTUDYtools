/* SSC CGL lesson video */
var META = {"crumb": "SSC CGL \u00b7 Quantitative Aptitude \u00b7 <b>Mensuration</b>"};
var SPEC = [
{
"k": "intro",
"title": "Mensuration",
"sub": "SSC CGL · Quantitative Aptitude · Topic 14",
"pills": [
"2D areas",
"Scaling",
"3D solids",
"Melting"
]
},
{
"k": "eq",
"t": "Triangles",
"lines": [
"Area = ½ × base × height",
"Heron: √[s(s − a)(s − b)(s − c)]"
],
"box": "13, 14, 15 → s = 21 → 84",
"note": "Equilateral: (√3/4)a²"
},
{
"k": "list",
"t": "Other plane figures",
"items": [
[
"Rhombus",
"½ × d₁ × d₂"
],
[
"Trapezium",
"½ × (a + b) × h"
],
[
"Circle",
"πr², 2πr"
],
[
"Sector",
"(θ/360) × πr²"
]
],
"w": 720
},
{
"k": "chips",
"t": "Scaling every length",
"items": [
"+10% length",
"+21% area",
"+33.1% volume"
],
"note": "Lengths × k → area × k² → volume × k³"
},
{
"k": "two",
"t": "Cube and cuboid",
"a": [
"Cuboid",
"V = lbh",
"diagonal √(l² + b² + h²)"
],
"b": [
"Cube",
"V = a³",
"surface 6a²"
]
},
{
"k": "eq",
"t": "Cylinder and cone",
"lines": [
"Cylinder V = πr²h · Cone V = ⅓πr²h",
"Slant l = √(r² + h²)"
],
"box": "r 7, h 24 → l = 25",
"note": "Cone curved surface = πrl = 550"
},
{
"k": "eq",
"t": "Sphere and melting",
"lines": [
"V = (4/3)πr³ · SA = 4πr²",
"Volume before = volume after"
],
"box": "r 6 → r 2: (6 ÷ 2)³ = 27",
"note": "Hemisphere total surface = 3πr²"
},
{
"k": "mcq",
"q": "A rhombus has diagonals 16 and 12. Its area is…",
"opts": [
"96",
"192",
"48",
"100"
],
"why": "½ × 16 × 12 = 96"
},
{
"k": "recap",
"items": [
[
"Formula",
"write it first"
],
[
"π",
"22/7 for multiples of 7"
],
[
"Scaling",
"k² area, k³ volume"
],
[
"Melting",
"equate volumes"
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
