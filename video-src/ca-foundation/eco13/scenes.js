/* Business Economics Lesson 1.3 — Demand and Elasticity */
var META = { crumb: "CA Foundation · Business Economics · <b>Demand and Elasticity</b>" };
function dcurve(at, shift, pts) {
  var W = 400, H = 320, s = '<line x1="50" y1="20" x2="50" y2="280" stroke="#1E2A47" stroke-width="3"/><line x1="50" y1="280" x2="380" y2="280" stroke="#1E2A47" stroke-width="3"/><text x="40" y="30" text-anchor="end" font-size="18" font-weight="700" fill="#1E2A47" font-family="Outfit">P</text><text x="378" y="304" text-anchor="end" font-size="18" font-weight="700" fill="#1E2A47" font-family="Outfit">Q</text>';
  var g = k(at); s += '<line x1="80" y1="50" x2="' + (80 + 260 * g) + '" y2="' + (50 + 210 * g) + '" stroke="#1F9A94" stroke-width="6" stroke-linecap="round"/><text x="335" y="255" font-size="20" font-weight="800" fill="#1F9A94" font-family="Outfit" opacity="' + g + '">D</text>';
  if (shift) { var q = k(shift); s += '<line x1="140" y1="50" x2="370" y2="236" stroke="#F28C28" stroke-width="6" stroke-linecap="round" opacity="' + q + '"/><text x="360" y="222" font-size="20" font-weight="800" fill="#F28C28" font-family="Outfit" opacity="' + q + '">D₁</text>'; }
  if (pts) { var m = k(pts), y1 = 110, x1 = 80 + (y1 - 50) * 260 / 210, y2 = 190, x2 = 80 + (y2 - 50) * 260 / 210; s += '<g opacity="' + m + '"><circle cx="' + x1 + '" cy="' + y1 + '" r="9" fill="#1E2A47"/><circle cx="' + x2 + '" cy="' + y2 + '" r="9" fill="#F28C28"/><text x="' + (x1 + 14) + '" y="' + (y1 - 8) + '" font-size="17" font-weight="700" fill="#1E2A47" font-family="Outfit">₹20, 500</text><text x="' + (x2 + 14) + '" y="' + (y2 - 8) + '" font-size="17" font-weight="700" fill="#F28C28" font-family="Outfit">₹16, 700</text></g>'; }
  return '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '">' + s + "</svg>";
}
var SCENES = [
  introScene("Demand and Elasticity", "CA Foundation · Business Economics · Lesson 1.3", ["Law of demand", "Movement vs shift", "Price elasticity", "Income and cross"]),
  { tag: "Determinants", draw: function () {
    return T("What decides demand?") + sp(34) + chipsRow(["Own price", "Related goods", "Income", "Tastes", "Expectations", "Population"], 0.1, 0.11, 0);
  } },
  { tag: "Law of demand", draw: function () {
    return side(T2("Price ↓ → quantity ↑") + sp(12) + note("Other things equal", 0.3, true) + sp(10) + note("Income and substitution effects", 0.6), dcurve(0.05), 420);
  } },
  { tag: "Movement vs shift", draw: function () {
    return side(T2("Along the curve, or a new curve?") + sp(12) + eq("Own price → movement", 0.15, 26) + eq("<span class='o'>Income, tastes… → shift</span>", 0.5, 26), dcurve(-1, 0.55), 420);
  } },
  { tag: "Price elasticity", draw: function () {
    return T("Price elasticity of demand") + sp(30) + boxed("Ep = % change in quantity ÷ % change in price", 0.12, 30) + sp(26) + '<div class="row" style="gap:16px">' + pill("Ep > 1 elastic", 0.4) + pill("Ep = 1 unitary", 0.52, "n") + pill("Ep < 1 inelastic", 0.64) + "</div>";
  } },
  { tag: "Worked example", draw: function () {
    return side(T2("Chai Point cuts its price") + sp(12) + listOf([["Price", "₹20 → ₹16"], ["Cups a day", "500 → 700"]], 0.15, 0.25, 330, 24), dcurve(-1, 0, 0.4), 360);
  } },
  { tag: "Worked example", draw: function () {
    return T("Work it out") + sp(20) + eq("%ΔQ = 200 ÷ 500 = 40%", 0.08, 28) + eq("%ΔP = 4 ÷ 20 = 20%", 0.25, 28) + eq("Ep = 40 ÷ 20 = <span class='t'>2 → elastic</span>", 0.42, 30) + sp(14) + note("Arc method: (200 ÷ 1,200) ÷ (4 ÷ 36) = 1.5", 0.72, true);
  } },
  { tag: "Total outlay", draw: function () {
    return T("Check with total spending") + sp(24) + hbars([["Before", 10000, "₹10,000"], ["After", 11200, "₹11,200", "#F28C28"]], 12000, 0.12, 0.25, 480) + sp(18) + note("Price fell, spending rose → elastic", 0.7);
  } },
  { tag: "Other elasticities", draw: function () {
    return T("The sign tells the type of good") + sp(22) + table(["Elasticity", "Positive", "Negative"], [["Income", "Normal good", "Inferior good"], ["Cross", "Substitutes", "Complements"]], 0.08, 0.2, -1, 640);
  } },
  mcqScene("A fall in price leaves total spending unchanged. Price elasticity of demand is…", ["Unitary (= 1)", "Greater than 1", "Less than 1", "Zero"], 0, "By the total outlay method, unchanged spending means unitary elasticity."),
  recapScene([["Law of demand", "price ↓, quantity ↑"], ["Movement vs shift", "own price vs other factors"], ["Elasticity", "% ΔQ ÷ % ΔP"], ["Signs", "income: normal +, cross: substitutes +"]], "Now try the calculator below ↓")
];
