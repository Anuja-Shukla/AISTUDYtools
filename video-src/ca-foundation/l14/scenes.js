/* Lesson 1.4 — Mathematics of Finance */
var META = { crumb: "CA Foundation · Quantitative Aptitude · <b>Mathematics of Finance</b>" };
function rs(x) { return "₹" + Math.round(x).toLocaleString("en-IN"); }
var SCENES = [
  introScene("Mathematics of Finance", "CA Foundation · Quantitative Aptitude · Lesson 1.4", ["Interest", "Annuities", "EMI", "NPV &amp; CAGR"]),
  { tag: "Interest", draw: function () {
    return T("Simple vs compound interest") + sp(36) + '<div class="row" style="gap:24px;align-items:stretch">' + cardT("Simple interest", "SI = PRT / 100", "only on the principal", 0.08, 340, "var(--teal)") + cardT("Compound interest", "A = P(1 + i)ⁿ", "interest on interest", 0.45, 340, "var(--orange)") + "</div>";
  } },
  { tag: "Interest", draw: function () {
    return T("₹10,000 at 10% for 3 years") + sp(14) + '<b class="t" style="font-size:22px" ' + rv(0.18) + '>Simple interest</b>' + hbars([["Year 1", 11000, "", "#1F9A94"], ["Year 2", 12000, "", "#1F9A94"], ["Year 3", 13000, "", "#1F9A94"]], 13310, 0.2, 0.07, 420, rs) + sp(4) +
      '<b class="o" style="font-size:22px" ' + rv(0.58) + '>Compound interest</b>' +
      hbars([["Year 1", 11000, "", "#F28C28"], ["Year 2", 12100, "", "#F28C28"], ["Year 3", 13310, "", "#F28C28"]], 13310, 0.6, 0.07, 420, rs);
  } },
  { tag: "Interest", draw: function () {
    return T("Use the rate per period") + sp(30) + '<div class="row" style="gap:20px">' + cardT("Rate per period", "i = R ÷ 100k", "", 0.3, 320, "var(--teal)") + cardT("Number of periods", "n = k × years", "", 0.55, 320, "var(--orange)") + "</div>" + sp(30) +
      '<div class="row">' + note("Half-yearly k = 2", 0.7, true) + note("Quarterly k = 4", 0.75, true) + note("Monthly k = 12", 0.8, true) + "</div>";
  } },
  { tag: "Worked example", draw: function () {
    return T("₹50,000 at 8%, quarterly, 2 years") + sp(20) + '<div class="row">' + pill("i = 8 ÷ 400 = 0.02", 0.25, "l") + pill("n = 4 × 2 = 8", 0.35, "l") + "</div>" + sp(20) + eq("A = 50,000 × (1.02)<sup>8</sup>", 0.5, 40) + eq("= 50,000 × 1.171659", 0.62, 34, "m") + sp(10) + boxed("A ≈ ₹58,583", 0.75) + sp(10) + eq('Interest ≈ <span class="t">₹8,583</span>', 0.85, 28);
  } },
  { tag: "Interest", draw: function () {
    return T("Effective rate of interest") + sp(26) + boxed("E = (1 + i)<sup>k</sup> − 1", 0.08) + sp(26) + '<div class="row" style="gap:20px">' + cardT("8% quarterly", "8.24%", "(1.02)⁴ − 1", 0.4, 300, "var(--teal)") + cardT("12% monthly", "12.68%", "(1.01)¹² − 1", 0.75, 300, "var(--orange)") + "</div>";
  } },
  { tag: "Depreciation", draw: function () {
    return T("Reducing-balance depreciation") + sp(16) + boxed("Value = P(1 − r)<sup>n</sup>", 0.12) + sp(18) + hbars([["Cost", 200000, "", "#1E2A47"], ["Year 1", 180000, "", "#1F9A94"], ["Year 2", 162000, "", "#1F9A94"], ["Year 3", 145800, "", "#F28C28"]], 200000, 0.4, 0.08, 420, rs);
  } },
  { tag: "Annuities", draw: function () {
    var W = 760, s = '<line x1="30" y1="90" x2="' + (W - 30) + '" y2="90" stroke="#1E2A47" stroke-width="3"/>';
    for (var i = 0; i <= 6; i++) { var x = 30 + i * (W - 60) / 6, q = k(0.15 + i * 0.08); s += '<line x1="' + x + '" y1="82" x2="' + x + '" y2="98" stroke="#1E2A47" stroke-width="2"/><text x="' + x + '" y="124" text-anchor="middle" font-size="18" font-weight="600" fill="#6B7590" font-family="Outfit">' + i + "</text>"; if (i > 0) s += '<g opacity="' + q + '"><rect x="' + (x - 34) + '" y="' + (30 - 10 * (1 - q)) + '" width="68" height="36" rx="8" fill="#1F9A94"/><text x="' + x + '" y="' + (54 - 10 * (1 - q)) + '" text-anchor="middle" font-size="18" font-weight="700" fill="#fff" font-family="Outfit">A</text></g>'; }
    return T("An annuity: equal payments, equal intervals") + sp(40) + '<svg width="' + W + '" height="140" viewBox="0 0 ' + W + ' 140">' + s + "</svg>" + sp(26) + '<div class="row">' + note("SIP", 0.6, true) + note("Lease rent", 0.68, true) + note("Loan EMI", 0.76, true) + "</div>";
  } },
  { tag: "Annuities", draw: function () {
    return T("Future and present value") + sp(26) + card('<div class="m" style="font-size:20px;font-weight:700">Future value (ordinary annuity)</div><div class="eq" style="font-size:34px">FV = A[(1 + i)<sup>n</sup> − 1] ÷ i</div>', 0.05, 640) + sp(16) +
      card('<div class="m" style="font-size:20px;font-weight:700">Present value (ordinary annuity)</div><div class="eq" style="font-size:34px">PV = A[1 − (1 + i)<sup>−n</sup>] ÷ i</div>', 0.35, 640) + sp(20) + note("Annuity due (paid at the start): multiply by (1 + i)", 0.72);
  } },
  { tag: "Annuities", draw: function () {
    return T("Perpetuity: payments forever") + sp(36) + boxed("PV = A ÷ i", 0.2, 44) + sp(30) + eq("6,000 ÷ 0.12 = <span class='t'>₹50,000</span>", 0.55, 40);
  } },
  { tag: "Loans", draw: function () {
    return T("EMI on a loan") + sp(22) + boxed("EMI = P · i(1 + i)<sup>n</sup> ÷ [(1 + i)<sup>n</sup> − 1]", 0.1, 32) + sp(22) + '<div class="row">' + pill("P = ₹5,00,000", 0.5, "l") + pill("i = 9% ÷ 12 = 0.75%", 0.55, "l") + pill("n = 60", 0.6, "l") + "</div>" + sp(22) + eq("EMI ≈ <span class='t'>₹10,379</span>", 0.78, 46);
  } },
  { tag: "Investment decisions", draw: function () {
    return T("Net present value at 10%") + sp(10) + table(["Year", "Cash flow", "Present value"], [["0", "−1,00,000", "−1,00,000"], ["1", "30,000", "27,273"], ["2", "40,000", "33,058"], ["3", "50,000", "37,566"], ["4", "20,000", "13,660"]], 0.12, 0.08, -1, 600) + sp(14) + '<div class="row" style="gap:16px">' + boxed("NPV ≈ ₹11,557", 0.68, 30) + pill("Positive → accept", 0.8) + "</div>";
  } },
  { tag: "Investment decisions", draw: function () {
    return T("CAGR: steady yearly growth") + sp(26) + boxed("CAGR = (End ÷ Start)<sup>1/n</sup> − 1", 0.1, 36) + sp(26) + eq("(1,61,051 ÷ 1,00,000)<sup>1/5</sup> − 1", 0.55, 34) + eq("= 1.1 − 1 = <span class='t'>10%</span>", 0.75, 40);
  } },
  mcqScene("₹10,000 at 10% a year, compounded half-yearly, for 1 year. The amount is…", ["₹11,025", "₹11,000", "₹11,050", "₹10,500"], 0, "i = 5% per half-year, n = 2: 10,000 × 1.05² = ₹11,025."),
  recapScene([["Rate per period", "i = R ÷ 100k, n = k × years"], ["Compound amount", "A = P(1 + i)ⁿ"], ["Annuities, EMIs, perpetuities", "PV, FV, A ÷ i"], ["Decisions", "NPV > 0 → accept · CAGR"]])
];
