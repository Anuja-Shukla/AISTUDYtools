/* SSC CGL lesson video */
var META = {"crumb": "SSC CGL \u00b7 General Intelligence & Reasoning \u00b7 <b>Series</b>"};
var SPEC = [
{
"k": "intro",
"title": "Number & Letter Series",
"sub": "SSC CGL · Reasoning · Topic 3",
"pills": [
"Next term",
"Missing term",
"Wrong term",
"Letters"
]
},
{
"k": "flow",
"t": "The checklist",
"steps": [
"Differences",
"2nd differences",
"Ratios",
"Squares / cubes",
"Alternating"
],
"note": "Check your rule on every term"
},
{
"k": "table",
"t": "Differences",
"head": [
"Series",
"Gaps",
"Next"
],
"rows": [
[
"2, 5, 10, 17, 26",
"+3 +5 +7 +9",
"37"
],
[
"3, 4, 8, 17, 33",
"+1 +4 +9 +16",
"58"
]
],
"w": 640
},
{
"k": "table",
"t": "Ratios",
"head": [
"Series",
"Rule",
"Next"
],
"rows": [
[
"3, 6, 12, 24",
"× 2",
"48"
],
[
"1, 2, 6, 24, 120",
"× 2, × 3, × 4 …",
"720"
],
[
"1, 3, 7, 15, 31",
"× 2 + 1",
"63"
]
],
"w": 640
},
{
"k": "chips",
"t": "Standard families",
"items": [
"n²: 1, 4, 9, 16",
"n³: 1, 8, 27, 64",
"n(n+1): 2, 6, 12, 20",
"n³ − 1: 0, 7, 26, 63",
"Primes: 2, 3, 5, 7, 11"
]
},
{
"k": "two",
"t": "Alternating series",
"a": [
"Odd positions",
"2, 4, 6",
"next: 8"
],
"b": [
"Even positions",
"10, 20, 30",
"next: 40"
]
},
{
"k": "eq",
"t": "Letter series",
"lines": [
"A C F J O → 1, 3, 6, 10, 15",
"Gaps +2 +3 +4 +5 → +6"
],
"box": "Next: U (21)",
"note": "A = 1 … Z = 26"
},
{
"k": "mcq",
"q": "6, 11, 21, 41, 81, ?",
"opts": [
"161",
"162",
"121",
"160"
],
"why": "Each term × 2 − 1"
},
{
"k": "recap",
"items": [
[
"Differences",
"first, then gaps of gaps"
],
[
"Ratios",
"when terms grow fast"
],
[
"Families",
"squares, cubes, primes"
],
[
"Alternating",
"split odd / even"
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
