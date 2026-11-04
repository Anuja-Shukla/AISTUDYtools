/* SSC CGL lesson video */
var META = {"crumb": "SSC CGL \u00b7 Quantitative Aptitude \u00b7 <b>Geometry</b>"};
var SPEC = [
{
"k": "intro",
"title": "Geometry",
"sub": "SSC CGL · Quantitative Aptitude · Topic 13",
"pills": [
"Angles",
"Triangles",
"Centres",
"Circles"
]
},
{
"k": "list",
"t": "Parallel lines",
"items": [
[
"Corresponding",
"equal"
],
[
"Alternate",
"equal"
],
[
"Co-interior",
"add to 180°"
],
[
"Vertically opposite",
"equal"
]
],
"w": 700
},
{
"k": "eq",
"t": "Triangle angles",
"lines": [
"A + B + C = 180°",
"Exterior angle = sum of opposite interiors"
],
"box": "2 : 3 : 4 → 40°, 60°, 80°",
"note": "Exterior 110°, one interior 45° → other 65°"
},
{
"k": "chips",
"t": "Pythagorean triplets",
"items": [
"3-4-5",
"5-12-13",
"8-15-17",
"7-24-25",
"6-8-10",
"9-12-15"
],
"note": "h² = b² + p²; multiples work too"
},
{
"k": "table",
"t": "The four centres",
"head": [
"Centre",
"Fact"
],
"rows": [
[
"Centroid",
"divides medians 2 : 1"
],
[
"Incentre",
"∠BIC = 90° + A/2"
],
[
"Orthocentre",
"∠BHC = 180° − A"
],
[
"Circumcentre",
"∠BOC = 2A"
]
],
"w": 700
},
{
"k": "list",
"t": "Angles in a circle",
"items": [
[
"Centre angle",
"2 × circumference angle"
],
[
"Semicircle",
"90°"
],
[
"Same segment",
"equal angles"
],
[
"Cyclic quadrilateral",
"opposite angles add to 180°"
]
],
"w": 760
},
{
"k": "two",
"t": "Tangents and chords",
"a": [
"Tangent",
"√(d² − r²)",
"d 13, r 5 → 12"
],
"b": [
"Chord",
"2 × √(r² − d²)",
"r 10, d 6 → 16"
]
},
{
"k": "mcq",
"q": "In triangle ABC, ∠A = 70°. At the incentre, ∠BIC = ?",
"opts": [
"125°",
"110°",
"140°",
"35°"
],
"why": "90 + 70/2 = 125°"
},
{
"k": "recap",
"items": [
[
"Triangle",
"angles add to 180°"
],
[
"Right angle",
"look for a triplet"
],
[
"Centres",
"90 + A/2 · 180 − A · 2A"
],
[
"Circle",
"centre angle doubles"
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
