/* SSC CGL lesson video */
var META = {"crumb": "SSC CGL \u00b7 Quantitative Aptitude \u00b7 <b>Time, speed & distance</b>"};
var SPEC = [
{
"k": "intro",
"title": "Time, speed & distance",
"sub": "SSC CGL · Quantitative Aptitude · Topic 11",
"pills": [
"Units",
"Relative speed",
"Trains",
"Boats"
]
},
{
"k": "eq",
"t": "The core formula",
"lines": [
"Distance = Speed × Time",
"km/h → m/s: × 5/18"
],
"box": "72 km/h = 20 m/s",
"note": "m/s → km/h: × 18/5"
},
{
"k": "two",
"t": "Relative speed",
"a": [
"Towards each other",
"add speeds",
"300 km at 40 + 60 → 3 h"
],
"b": [
"Same direction",
"subtract speeds",
"2 km gap at 12 − 10 → 1 h"
]
},
{
"k": "eq",
"t": "Trains",
"lines": [
"150 m train at 15 m/s",
"Pole: 150 ÷ 15 = 10 s"
],
"box": "250 m platform: 400 ÷ 15 = 26⅔ s",
"note": "Add the length of whatever it crosses"
},
{
"k": "eq",
"t": "Two trains",
"lines": [
"Time = (L₁ + L₂) ÷ relative speed",
"120 m + 180 m, 50 and 40 km/h opposite"
],
"box": "300 ÷ 25 m/s = 12 s",
"note": "Same direction: 300 ÷ (10 × 5/18) = 108 s"
},
{
"k": "list",
"t": "Boats and streams",
"items": [
[
"Downstream",
"b + s"
],
[
"Upstream",
"b − s"
],
[
"Boat",
"(down + up) ÷ 2"
],
[
"Stream",
"(down − up) ÷ 2"
]
],
"note": "Down 15, up 9 → boat 12, stream 3",
"w": 720
},
{
"k": "eq",
"t": "Races",
"lines": [
"A beats B by 20 m in a 100 m race",
"A runs 100 while B runs 80"
],
"box": "Speed ratio A : B = 5 : 4",
"note": "Chain races: 1,000 → 900 → 810"
},
{
"k": "mcq",
"q": "A thief 2 km ahead runs at 10 km/h. Police follow at 12 km/h. Caught in…",
"opts": [
"1 hour",
"2 hours",
"30 minutes",
"12 minutes"
],
"why": "2 ÷ (12 − 10) = 1 hour"
},
{
"k": "recap",
"items": [
[
"Units",
"× 5/18"
],
[
"Approaching",
"add speeds"
],
[
"Chasing",
"subtract speeds"
],
[
"Trains",
"add the lengths"
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
