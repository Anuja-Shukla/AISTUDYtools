/* Accounting Lesson 2.9 — Depreciation */
var META = { crumb: "CA Foundation · Accounting · <b>Depreciation</b>" };
var SLM = [410000, 320000, 230000, 140000, 50000], WDVc = [100000, 80000, 64000, 51200, 40960];
function L(x) { return "₹" + Math.round(x).toLocaleString("en-IN"); }
var SCENES = [
  introScene("Depreciation", "CA Foundation · Accounting · Lesson 2.9", ["What it is", "Straight line", "Written down value", "Sale of an asset"]),
  { tag: "Idea", draw: function () {
    return T("Spread the cost over the useful life") + sp(30) + '<div class="row" style="gap:16px">' + [1, 2, 3, 4, 5].map(function (y, i) { return card('<div class="m" style="font-size:19px;font-weight:700">Year ' + y + '</div><div class="mid" style="font-size:26px;margin-top:6px">₹90,000</div>', 0.12 + i * 0.1, 140); }).join("") + "</div>" + sp(26) + note("Matching cost with revenue, not market valuation", 0.72);
  } },
  { tag: "Inputs", draw: function () {
    return T("Three things you need") + sp(28) + grid([["Cost", "₹5,00,000", "price + installation"], ["Residual value", "₹50,000", "expected at the end"], ["Useful life", "5 years", "estimated"]], 3, 0.15, 0.2, 250);
  } },
  { tag: "Example", draw: function () {
    return T("Sunrise Textiles buys a machine") + sp(30) + listOf([["Cost", "₹5,00,000"], ["Expected sale value after 5 years", "₹50,000"], ["Useful life", "5 years"]], 0.12, 0.2, 640, 26);
  } },
  { tag: "Straight line method", draw: function () {
    return side(T2("Same charge every year") + sp(12) + eq("(5,00,000 − 50,000) ÷ 5", 0.15, 26) + eq("= <span class='t'>₹90,000 a year</span>", 0.4, 30), vbars(["Y1", "Y2", "Y3", "Y4", "Y5"], [90000, 90000, 90000, 90000, 90000], 0.55, { w: 420, h: 260, max: 100000, vals: ['90k', '90k', '90k', '90k', '90k'] }), 400);
  } },
  { tag: "Written down value", draw: function () {
    return side(T2("Fixed rate on book value") + sp(12) + eq("Y1: 20% × 5,00,000 = 1,00,000", 0.12, 22) + eq("Y2: 20% × 4,00,000 = 80,000", 0.35, 22) + eq("Y3: 20% × 3,20,000 = 64,000", 0.58, 22), vbars(["Y1", "Y2", "Y3", "Y4", "Y5"], WDVc, 0.75, { w: 420, h: 260, max: 110000, col: "#F28C28", vals: ['100k', '80k', '64k', '51.2k', '41k'] }), 430);
  } },
  { tag: "Compare", draw: function () {
    return T("Flat vs falling charge") + sp(20) + table(["Year", "SLM charge", "WDV charge (20%)"], [1, 2, 3, 4, 5].map(function (y, i) { return [String(y), "₹90,000", L(WDVc[i])]; }), 0.08, 0.12, 0, 640);
  } },
  { tag: "Choosing", draw: function () {
    return T("Which method?") + sp(30) + '<div class="row" style="gap:24px;align-items:stretch">' + cardT("Straight line", "Even use", "buildings, furniture, leases", 0.12, 340, "var(--teal)") + cardT("Written down value", "More benefit early", "machinery, vehicles, computers", 0.45, 340, "var(--orange)") + "</div>";
  } },
  { tag: "Sale of an asset", draw: function () {
    return T("Sold at the end of year 2") + sp(24) + eq("Book value = 5,00,000 − 2 × 90,000 = <span class='t'>3,20,000</span>", 0.12, 26) + sp(8) + eq("Sale price = 3,30,000", 0.38, 26) + sp(16) + boxed("Profit on sale = ₹10,000", 0.62, 30) + sp(16) + note("Sale price − book value", 0.82, true);
  } },
  mcqScene("A van costs ₹4,00,000, has no residual value and a life of 8 years. Annual SLM depreciation is…", ["₹50,000", "₹40,000", "₹80,000", "₹32,000"], 0, "₹4,00,000 ÷ 8 = ₹50,000."),
  recapScene([["SLM", "(cost − residual) ÷ life"], ["WDV", "fixed % of opening book value"], ["Charges", "SLM flat, WDV falling"], ["Sale", "price − book value = profit or loss"]])
];
