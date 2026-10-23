/* Lesson 1.1 — Ratio, Proportion, Indices and Logarithms (scenes match lines.txt, one per line) */
var META = { crumb: "CA Foundation · Quantitative Aptitude · <b>Ratio, Proportion, Indices &amp; Logs</b>" };
function sp(n) { return '<div style="height:' + n + 'px"></div>'; }
function arrow(at, label) { return '<div ' + rv(at, 0) + ' class="m" style="font-size:34px;font-weight:700;margin:0 8px;line-height:1">' + (label ? '<div style="font-size:21px;color:var(--orange);margin-bottom:2px">' + label + "</div>" : "") + "→</div>"; }
var SHOP = '<svg viewBox="0 0 300 170" width="300" height="170"><rect x="10" y="10" width="280" height="150" rx="16" fill="#fff"/><rect x="24" y="22" width="252" height="6" fill="#1E2A47"/>' +
  [0, 1, 2, 3, 4].map(function (i) { return '<path d="M' + (24 + i * 50.4) + ' 28 h50.4 v22 a25.2 25.2 0 0 1 -50.4 0 z" fill="' + (i % 2 ? "#fff" : "#1F9A94") + '" stroke="#1F9A94" stroke-width="1.5"/>'; }).join("") +
  '<rect x="44" y="84" width="34" height="6" rx="3" fill="#F28C28"/><rect x="46" y="90" width="4" height="22" fill="#F28C28"/><rect x="72" y="90" width="4" height="22" fill="#F28C28"/><rect x="44" y="64" width="6" height="26" rx="3" fill="#F28C28"/>' +
  '<rect x="214" y="80" width="56" height="8" rx="3" fill="#1E2A47"/><rect x="220" y="88" width="5" height="26" fill="#1E2A47"/><rect x="259" y="88" width="5" height="26" fill="#1E2A47"/>' +
  '<rect x="30" y="122" width="240" height="30" rx="7" fill="#1E2A47"/><text x="150" y="143" text-anchor="middle" font-family="Outfit" font-weight="800" font-size="17" fill="#fff" letter-spacing="1.5">KIRAN TRADERS</text></svg>';
function person(lbl, at, col) { return '<div ' + rv(at) + ' style="display:flex;flex-direction:column;align-items:center;gap:6px"><svg width="70" height="70" viewBox="0 0 70 70"><circle cx="35" cy="35" r="34" fill="' + col + '"/><circle cx="35" cy="27" r="11" fill="#fff"/><path d="M15 58 q20 -24 40 0" fill="#fff"/></svg><b style="font-size:22px;color:var(--navy)">Worker ' + lbl + "</b></div>"; }
function bar(lbl, amt, frac, at, col) {
  var q = k(at), w = 520 * frac * ease((LT - at * LD) / 1.0);
  return '<div ' + rv(at, 0) + ' style="display:flex;align-items:center;gap:14px;margin:8px 0"><b style="width:30px;font-size:26px;color:var(--navy)">' + lbl + '</b><div style="height:40px;width:' + w.toFixed(1) + 'px;background:' + col + ';border-radius:8px"></div><b style="font-size:26px;color:var(--navy);min-width:120px;text-align:left">' + inr(count(0, amt, at, 1.0)) + "</b></div>";
}
var SCENES = [
  { tag: "Introduction", draw: function () {
    return sp(40) + '<h1 ' + rv(0) + '>Ratio, Proportion,<br>Indices &amp; Logarithms</h1><div class="sub" ' + rv(0.08) + '>CA Foundation · Quantitative Aptitude · Lesson 1.1</div>' + sp(44) +
      '<div class="row">' + ["Ratio", "Proportion", "Indices", "Logarithms"].map(function (x, i) { return '<span class="pill' + (i % 2 ? " n" : "") + '" ' + rvs(0.42 + i * 0.12) + ">" + x + "</span>"; }).join("") + "</div>";
  } },
  { tag: "Introduction", draw: function () {
    return '<h2 ' + rv(0) + '>Sharing a bonus</h2>' + sp(22) + '<div class="row" style="gap:40px"><div ' + rvs(0.05) + ">" + SHOP + '</div><div ' + rvs(0.35) + '><div class="box" style="font-size:44px">₹7,200</div><div class="m" style="font-size:18px;margin-top:8px;font-weight:600">bonus to share</div></div></div>' + sp(28) +
      '<div class="row" style="gap:46px">' + person("A", 0.72, "#1F9A94") + person("B", 0.8, "#F28C28") + person("C", 0.88, "#1E2A47") + "</div>";
  } },
  { tag: "Ratio", draw: function () {
    return '<h2 ' + rv(0) + '>What is a ratio?</h2>' + sp(46) + '<div class="card" ' + rvs(0.32) + ' ><div class="big">a : b &nbsp;=&nbsp; <span class="t">a ÷ b</span></div></div>' + sp(36) +
      '<div class="row"><span class="note" ' + rv(0.25) + '>Same kind of quantity</span><span class="note" ' + rv(0.6) + '>“a to b” means a divided by b</span></div>';
  } },
  { tag: "Ratio", draw: function () {
    return '<h2 ' + rv(0) + '>Simplify by dividing both terms</h2>' + sp(70) + '<div class="row" style="gap:26px"><div class="big" ' + rv(0.1) + '>12 : 18</div>' + arrow(0.35, "÷ 6 both") + '<span class="pill" style="font-size:48px;padding:10px 30px" ' + rvs(0.62) + '>2 : 3</span></div>' + sp(50) +
      '<div class="eq m" ' + rv(0.5) + ' style="font-size:30px">12 ÷ 6 = 2 &nbsp;&nbsp;·&nbsp;&nbsp; 18 ÷ 6 = 3</div>';
  } },
  { tag: "Ratio", draw: function () {
    return '<h2 ' + rv(0) + '>Same units first</h2>' + sp(60) + '<div class="row" style="gap:20px"><div class="mid" ' + rv(0.25) + '>50 paise : ₹2</div>' + arrow(0.45, "₹2 = 200 paise") + '<div class="mid" ' + rv(0.55) + '>50 : 200</div>' + arrow(0.7, "÷ 50") + '<span class="pill" style="font-size:36px" ' + rvs(0.8) + '>1 : 4</span></div>' + sp(48) +
      '<span class="note" ' + rv(0.12) + '>A ratio has no units</span>';
  } },
  { tag: "Ratio", draw: function () {
    var cards = [["Inverse", "b : a", "9 : 4", 0.2], ["Duplicate", "a² : b²", "16 : 81", 0.38], ["Sub-duplicate", "√a : √b", "2 : 3", 0.58], ["Triplicate", "a³ : b³", "64 : 729", 0.76]];
    return '<h2 ' + rv(0) + '>The ratio family of <span class="t">4 : 9</span></h2>' + sp(34) + '<div style="display:grid;grid-template-columns:repeat(2,310px);gap:20px">' + cards.map(function (c) {
      return '<div class="card" ' + rvs(c[3]) + '><div class="m" style="font-size:19px;font-weight:700">' + c[0] + ' <span style="color:var(--orange)">' + c[1] + '</span></div><div class="mid n" style="margin-top:6px;font-size:40px">' + c[2] + "</div></div>";
    }).join("") + "</div>";
  } },
  { tag: "Ratio", draw: function () {
    return '<h2 ' + rv(0) + '>Compound ratio</h2>' + sp(40) + '<div class="eq" ' + rv(0.15) + '>(2 : 3) &nbsp;and&nbsp; (3 : 4)</div><div class="eq" ' + rv(0.3) + '>= (2 × 3) : (3 × 4)</div><div class="eq t" ' + rv(0.52) + '>= 6 : 12</div>' + sp(10) + '<div class="box" ' + rvs(0.72) + '>= 1 : 2</div>';
  } },
  { tag: "Worked example", draw: function () {
    var B = function (at) { return '<span style="color:' + (hl(at) ? "var(--orange)" : "inherit") + ';' + (hl(at) ? "background:var(--orange-soft);border-radius:8px;padding:0 8px" : "") + '">B</span>'; };
    return '<h2 ' + rv(0) + '>Step 1 · Make B the same</h2>' + sp(50) + '<div class="card" ' + rv(0.12) + ' style="min-width:480px"><div class="eq">A : ' + B(0.62) + ' = 2 : <span class="o">3</span></div><div class="eq" ' + rv(0.3) + '>' + B(0.62) + ' : C = <span class="o">4</span> : 5</div></div>' + sp(30) +
      '<span class="note" ' + rv(0.65) + '>B appears in both ratios</span>';
  } },
  { tag: "Worked example", draw: function () {
    return '<h2>Step 1 · Make B the same</h2>' + sp(34) + '<div class="row" style="gap:18px"><div class="mid">A : B = 2 : 3</div>' + arrow(0.1, "× 4") + '<div class="mid t" ' + rv(0.2) + '>8 : <span class="o">12</span></div></div>' + sp(14) +
      '<div class="row" style="gap:18px"><div class="mid">B : C = 4 : 5</div>' + arrow(0.32, "× 3") + '<div class="mid t" ' + rv(0.42) + '><span class="o">12</span> : 15</div></div>' + sp(40) +
      '<div class="box" ' + rvs(0.7) + '>A : B : C = 8 : 12 : 15</div>';
  } },
  { tag: "Worked example", draw: function () {
    return '<h2 ' + rv(0) + '>Step 2 · Share ₹7,200</h2>' + sp(22) + '<div class="row" ' + rv(0.04) + '><span class="chip">8</span><b class="m" style="font-size:28px">+</b><span class="chip">12</span><b class="m" style="font-size:28px">+</b><span class="chip">15</span><b class="m" style="font-size:28px">=</b><span class="pill o" style="font-size:28px">35 parts</span></div>' + sp(26) +
      '<div style="text-align:left;width:760px;padding-left:60px">' + bar("A", 7200 * 8 / 35, 8 / 15, 0.2, "#1F9A94") + bar("B", 7200 * 12 / 35, 12 / 15, 0.62, "#F28C28") + bar("C", 7200 * 15 / 35, 1, 0.82, "#1E2A47") + "</div>" +
      '<div class="m" ' + rv(0.25) + ' style="font-size:22px;margin-top:8px;font-weight:600">Each share = ₹7,200 × its parts ÷ 35</div>';
  } },
  { tag: "Proportion", draw: function () {
    var ex = hl(0.62), me = hl(0.62);
    return '<h2 ' + rv(0) + '>Proportion: two equal ratios</h2>' + sp(50) + '<div class="big" ' + rv(0.18) + ' style="letter-spacing:2px"><span class="' + (ex ? "o" : "") + '">a</span> : <span class="' + (me ? "t" : "") + '">b</span> = <span class="' + (me ? "t" : "") + '">c</span> : <span class="' + (ex ? "o" : "") + '">d</span></div>' + sp(18) +
      '<div class="row" ' + rv(0.62) + ' style="gap:30px"><span class="note">Extremes: a and d</span><span class="note" style="background:var(--teal-soft);color:var(--teal-dk)">Means: b and c</span></div>' + sp(34) + '<div class="box" ' + rvs(0.42) + '>a × d = b × c</div>';
  } },
  { tag: "Proportion", draw: function () {
    return '<h2 ' + rv(0) + '>Two quick results</h2>' + sp(40) + '<div class="row" style="gap:26px;align-items:stretch">' +
      '<div class="card" ' + rvs(0.08) + ' style="width:360px"><div class="m" style="font-size:20px;font-weight:700">Mean proportional of a, b</div><div class="mid" style="margin:8px 0;color:var(--orange)">√(ab)</div><div class="eq" style="font-size:32px" ' + rv(0.22) + '>√(4 × 9) = <b class="t">6</b></div></div>' +
      '<div class="card" ' + rvs(0.5) + ' style="width:360px"><div class="m" style="font-size:20px;font-weight:700">Fourth proportional to a, b, c</div><div class="mid" style="margin:8px 0;color:var(--orange)">bc ÷ a</div><div class="eq" style="font-size:32px" ' + rv(0.7) + '>(3 × 4) ÷ 2 = <b class="t">6</b></div></div></div>';
  } },
  { tag: "Indices", draw: function () {
    return '<h2 ' + rv(0) + '>Laws of indices</h2>' + sp(36) + '<div class="card" ' + rv(0.25) + ' style="width:640px"><div class="eq">2<sup>3</sup> × 2<sup>4</sup> = 2<sup>3+4</sup> = <span class="t">2<sup>7</sup></span></div><div class="pill l" style="font-size:22px">aᵐ × aⁿ = aᵐ⁺ⁿ</div></div>' + sp(20) +
      '<div class="card" ' + rv(0.65) + ' style="width:640px"><div class="eq">2<sup>5</sup> ÷ 2<sup>2</sup> = 2<sup>5−2</sup> = <span class="t">2<sup>3</sup></span></div><div class="pill l" style="font-size:22px">aᵐ ÷ aⁿ = aᵐ⁻ⁿ</div></div>';
  } },
  { tag: "Indices", draw: function () {
    var r = [["(2<sup>3</sup>)<sup>2</sup> = 2<sup>3×2</sup> = <span class='t'>2<sup>6</sup></span>", "(aᵐ)ⁿ = aᵐⁿ", 0.08], ["5<sup>0</sup> = <span class='t'>1</span>", "a⁰ = 1 (a ≠ 0)", 0.38], ["2<sup>−1</sup> = <span class='t'>1/2</span>", "a⁻ⁿ = 1/aⁿ", 0.7]];
    return '<h2 ' + rv(0) + '>Three more index laws</h2>' + sp(30) + '<div class="list" style="width:700px">' + r.map(function (x) { return '<div class="li" ' + rv(x[2]) + ' style="justify-content:space-between"><span class="eq" style="font-size:34px;line-height:1.2">' + x[0] + '</span><span class="pill l" style="font-size:21px">' + x[1] + "</span></div>"; }).join("") + "</div>";
  } },
  { tag: "Logarithms", draw: function () {
    var steps = Math.max(0, Math.min(5, Math.floor((LT - 0.45 * LD) / 0.45) + 1));
    return '<h2 ' + rv(0) + '>Logarithms: indices in reverse</h2>' + sp(34) + '<div class="row" style="gap:30px"><div class="big" ' + rv(0.12) + '>log<sub>2</sub> 32 = <span class="t">5</span></div><div class="mid m" ' + rv(0.3) + '>⟺</div><div class="big" ' + rv(0.4) + '>2<sup>5</sup> = 32</div></div>' + sp(40) +
      '<div class="row" ' + rv(0.45) + '>' + [1, 2, 4, 8, 16, 32].map(function (v, i) { return (i ? '<b style="color:' + (i <= steps ? "var(--orange)" : "#C8CEDA") + ';font-size:20px">×2</b>' : "") + '<span class="chip" style="' + (i === 5 && steps === 5 ? "background:var(--teal);color:#fff;border-top-color:var(--teal)" : (i > steps ? "opacity:.35" : "")) + '">' + v + "</span>"; }).join("") + '</div><div class="m" style="font-size:20px;margin-top:12px;font-weight:600" ' + rv(0.75) + '>five doublings take 1 to 32</div>';
  } },
  { tag: "Logarithms", draw: function () {
    var r = [["log(mn) = log m + log n", "product → sum", 0.25], ["log(m/n) = log m − log n", "quotient → difference", 0.55], ["log mⁿ = n log m", "power → multiple", 0.78]];
    return '<h2 ' + rv(0) + '>Laws of logarithms</h2>' + sp(30) + '<div class="list" style="width:740px">' + r.map(function (x, i) { return '<div class="li" ' + rv(x[2]) + '><span class="num" style="background:' + ["#1F9A94", "#F28C28", "#1E2A47"][i] + '">' + (i + 1) + '</span><span style="font-size:30px;flex:1">' + x[0] + '</span><span class="m" style="font-size:19px">' + x[1] + "</span></div>"; }).join("") + "</div>";
  } },
  { tag: "Logarithms", draw: function () {
    return '<h2 ' + rv(0) + '>Change of base</h2>' + sp(26) + '<div class="box" ' + rvs(0.08) + '>log<sub>a</sub> x = log x ÷ log a</div>' + sp(16) +
      '<div class="eq m" ' + rv(0.2) + ' style="font-size:28px">log<sub>2</sub> 32 = 1.5051 ÷ 0.3010 = <b class="t">5</b></div>' + sp(30) +
      '<div class="card" ' + rvs(0.55) + ' style="border:3px solid #F6C9C4"><div class="eq" style="font-size:36px"><span class="strike">log(m + n) = log m + log n</span></div><div class="o" style="font-weight:700;font-size:20px">Common mistake: logs turn products into sums, not sums into sums</div></div>';
  } },
  { tag: "Summary", draw: function () {
    var r = [["Ratio compares", "a : b = a ÷ b"], ["Proportion equates", "a : b = c : d ⟹ ad = bc"], ["Indices add when you multiply", "aᵐ × aⁿ = aᵐ⁺ⁿ"], ["Logs turn × into +", "log mn = log m + log n"]];
    return '<h2 ' + rv(0) + '>Four ideas to remember</h2>' + sp(24) + '<div class="list" style="width:760px">' + r.map(function (x, i) { return '<div class="li" ' + rv(0.12 + i * 0.13) + '><span class="num" style="background:' + ["#1F9A94", "#F28C28", "#1E2A47", "#1F9A94"][i] + '">' + (i + 1) + '</span><span style="flex:1">' + x[0] + '</span><span class="t" style="font-size:22px">' + x[1] + "</span></div>"; }).join("") + '</div>' + sp(24) +
      '<span class="pill" ' + rvs(0.78) + '>Now try the interactive tool below ↓</span>';
  } }
];
