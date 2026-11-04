/* SSC CGL lesson video */
var META = {"crumb": "SSC CGL \u00b7 Quantitative Aptitude \u00b7 <b>Profit, loss & discount</b>"};
var SPEC = [
{
"k": "intro",
"title": "Profit, loss & discount",
"sub": "SSC CGL · Quantitative Aptitude · Topic 7",
"pills": [
"CP · MP · SP",
"Mark-up",
"Discounts",
"Tricks"
]
},
{
"k": "flow",
"t": "Three prices",
"steps": [
"Cost price",
"Marked price",
"Selling price"
],
"note": "Profit and loss on CP · Discount on MP"
},
{
"k": "eq",
"t": "Profit %",
"lines": [
"Profit % = (SP − CP) ÷ CP × 100",
"CP ₹400 → SP ₹500"
],
"box": "100 ÷ 400 = 25%",
"note": "Back from SP: 690 at 15% profit → 690 ÷ 1.15 = ₹600"
},
{
"k": "chips",
"t": "Mark up 40%, then 25% off",
"items": [
"CP 100",
"MP 140",
"SP 105",
"Profit 5%"
],
"note": "1.4 × 0.75 = 1.05, not 1.15"
},
{
"k": "eq",
"t": "Successive discounts",
"lines": [
"d₁ + d₂ − d₁d₂ ÷ 100",
"20 + 10 − 2"
],
"box": "= 28%, not 30%",
"note": "₹5,000 → ₹4,000 → ₹3,600"
},
{
"k": "eq",
"t": "Same SP: gain on one, loss on the other",
"lines": [
"Each sold for ₹990",
"10% gain and 10% loss"
],
"box": "Always a loss of x² ÷ 100 = 1%",
"note": "CPs are ₹900 and ₹1,100: total 2,000, SP 1,980"
},
{
"k": "two",
"t": "Dealers and offers",
"a": [
"False weight",
"900 g for 1 kg",
"100 ÷ 900 = 11 1/9%"
],
"b": [
"Buy 3 get 1 free",
"1 free out of 4",
"discount 25%"
]
},
{
"k": "mcq",
"q": "The CP of 12 articles equals the SP of 10. Profit %?",
"opts": [
"20%",
"16⅔%",
"2%",
"25%"
],
"why": "(12 − 10) ÷ 10 = 20%"
},
{
"k": "recap",
"items": [
[
"Profit / loss",
"% of CP"
],
[
"Discount",
"% of MP"
],
[
"Chain",
"CP × 1.4 × 0.75"
],
[
"Two discounts",
"d₁ + d₂ − d₁d₂/100"
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
