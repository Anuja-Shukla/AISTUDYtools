/* AIStudyTools CSEET course app (shared kit). Original teaching material; not affiliated with or endorsed by ICSI. */
(function () {
  "use strict";

  function fmt(x, d) {
    if (typeof x !== "number" || !isFinite(x)) return String(x);
    var p = Math.pow(10, d === undefined ? 2 : d), r = Math.round(x * p) / p;
    if (Object.is(r, -0)) r = 0;
    return String(r);
  }
  function inr(x) { return "₹" + (Math.round(x * 100) / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function chips(a, cls) {
    return '<div class="chips">' + a.map(function (x, i) {
      var c = typeof cls === "function" ? cls(x, i) : (cls || "");
      return '<span class="chip ' + c + '">' + esc(x) + "</span>";
    }).join("") + "</div>";
  }
  function list(items) { return '<ul class="clean">' + items.map(function (t) { return "<li>" + t + "</li>"; }).join("") + "</ul>"; }
  function box(text, kind) { return '<div class="pbox ' + (kind || "") + '">' + esc(text) + "</div>"; }
  function tbl(head, rows) { return '<div class="tscroll"><table><tr>' + head.map(function (h) { return "<th>" + h + "</th>"; }).join("") + "</tr>" + rows.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") + "</table></div>"; }
  function steps(arr) { return '<ol class="steps">' + arr.map(function (s) { return "<li>" + s + "</li>"; }).join("") + "</ol>"; }


  /* ================= TOOL HELPERS ================= */
  function ta(id, v, rows, label) { return '<div class="field"><label for="' + id + '">' + label + '</label><textarea id="' + id + '" rows="' + (rows || 4) + '">' + esc(v || "") + "</textarea></div>"; }
  function inp(id, v, label, ph, mode) { return '<div class="field"><label for="' + id + '">' + label + '</label><input id="' + id + '" value="' + esc(v === undefined ? "" : v) + '" placeholder="' + esc(ph || "") + '"' + (mode ? ' inputmode="' + mode + '"' : ' inputmode="decimal"') + "></div>"; }
  function sel(id, opts, v, label) { return '<div class="field"><label for="' + id + '">' + label + '</label><select id="' + id + '">' + opts.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (String(o[0]) === String(v) ? " selected" : "") + ">" + esc(o[1]) + "</option>"; }).join("") + "</select></div>"; }
  function val(id) { var e = document.getElementById(id); return e ? e.value : ""; }
  function n(id) { var s = val(id).replace(/[,\s₹%]/g, "").replace(/−/g, "-"); return s === "" ? NaN : Number(s); }
  function nums(s) { return String(s).replace(/−/g, "-").split(/[\s,;]+/).filter(Boolean).map(Number); }
  function err(t) { return '<p class="err">' + t + "</p>"; }
  function kv(pairs) { return '<div class="kv">' + pairs.map(function (p) { return "<span>" + p[0] + ": <b>" + p[1] + "</b></span>"; }).join("") + "</div>"; }
  function g2(a, b) { return '<div class="grid g2">' + a + b + "</div>"; }
  function g3(a, b, c) { return '<div class="grid g3">' + a + b + c + "</div>"; }
  function sub(t) { return '<h4 style="margin:14px 0 2px">' + t + "</h4>"; }
  function note(t) { return '<p class="small muted" style="margin-top:6px">' + t + "</p>"; }
  function fin(x) { return typeof x === "number" && isFinite(x); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a; }
  var SUP = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻" };
  function sup(k) { return String(k).split("").map(function (c) { return SUP[c] || c; }).join(""); }
  function svgWrap(w, h, label, inner) { return '<svg class="chart" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + esc(label) + '">' + inner + "</svg>"; }

  /* bar chart (gap = 0 → histogram) */
  function barsSvg(labels, vals, label, opts) {
    opts = opts || {};
    var W = 560, H = 230, L = 40, B = 34, T = 14, R = 10, max = Math.max.apply(null, vals.concat([0])) || 1;
    var bw = (W - L - R) / vals.length, gap = opts.gap === undefined ? 0.18 : opts.gap, s = "";
    for (var k = 0; k <= 4; k++) { var yv = max * k / 4, y = H - B - (H - B - T) * k / 4; s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y + '" y2="' + y + '" style="stroke:var(--border)"/><text x="' + (L - 6) + '" y="' + (y + 4) + '" text-anchor="end" class="ax">' + fmt(yv, opts.dp === undefined ? 2 : opts.dp) + "</text>"; }
    vals.forEach(function (v, i) {
      var h = (H - B - T) * v / max, x = L + i * bw + bw * gap / 2, w = bw * (1 - gap);
      s += '<rect x="' + x + '" y="' + (H - B - h) + '" width="' + Math.max(w, 1) + '" height="' + h + '" style="fill:' + (opts.hl === i ? "var(--sun-strong)" : "var(--accent)") + ';stroke:#fff;stroke-width:' + (gap ? 0 : 1) + '"><title>' + esc(labels[i] + ": " + fmt(v, 4)) + "</title></rect>";
      if (vals.length <= 16 || i % Math.ceil(vals.length / 16) === 0) s += '<text x="' + (L + i * bw + bw / 2) + '" y="' + (H - B + 16) + '" text-anchor="middle" class="ax">' + esc(labels[i]) + "</text>";
    });
    return svgWrap(W, H, label, s);
  }

  var TOOLS = {};

  var ICAI_URL = "https://www.icai.org/post/sm-foundation-p4-may2027";
  var CFG = {
    key: "caf_eco_progress_v1", title: "CA Foundation: Business Economics", hours: 9, videos: "CAFECO_VIDEOS", paper: "Paper 4 (Business Economics)", edition: "May 2027 onwards",
    lead: "Demand, cost and markets, national income, money, public finance and international trade, with calculators that show every step of the numbers.",
    intro: "For CA Foundation students preparing for Paper 4 and anyone who wants a clear base in economics for business. The course follows the units of the CA Foundation Paper 4 syllabus (May 2027 onwards) in five modules, one lesson per unit. Every lesson has notes, a worked example, an interactive calculator or sorter and two quick checks, followed by a final test and a certificate.",
    exam: "The exam paper is objective (multiple choice), 100 marks, 2 hours, with negative marking of one quarter of a mark for each wrong answer.",
    testNote: "(as in the exam, read every option before you answer)",
    certPrefix: "CAFE", certSub: "Microeconomics · Production & Markets · National Income · Public Finance & Money · Trade & Indian Economy"
  };

  /* Fictional examples: Chai Point Co (tea seller), Kiran's Bakery, Orbit Motors, Rangpur (a two-good economy), Indus and Delta (two countries). */
  var LESSONS = [
    /* ---------------- MODULE 1: INTRODUCTION, DEMAND AND SUPPLY ---------------- */
    {
      id: "1.1", mod: 1, ch: "Chapter 1, Unit 1", title: "Introduction to Business Economics", time: "13 min", tool: "sort",
      tcfg: { d: "Is each question about microeconomics or macroeconomics?", buckets: ["Microeconomics", "Macroeconomics"], items: [
        ["How should Kiran's Bakery price its new cake?", "Microeconomics", "Pricing by a single firm is a micro question."],
        ["Why did India's GDP growth slow last year?", "Macroeconomics", "Growth of the whole economy is macro."],
        ["How will a rise in onion prices change a household's spending?", "Microeconomics", "One consumer's choice is micro."],
        ["What causes inflation across the economy?", "Macroeconomics", "The general price level is a macro concept."],
        ["How many workers should a car factory hire?", "Microeconomics", "A firm's input decision is micro."],
        ["How does the RBI's repo rate affect total spending?", "Macroeconomics", "Monetary policy and aggregate demand are macro."],
        ["What is the equilibrium price of wheat in a market?", "Microeconomics", "Price in one market is micro."],
        ["Why is unemployment higher in a recession?", "Macroeconomics", "Economy-wide employment is macro."]] },
      outcomes: ["Explain what economics studies and the main definitions (Smith, Marshall, Robbins, Samuelson)", "Distinguish microeconomics from macroeconomics and positive from normative statements", "Explain the nature and scope of business economics", "Describe the deductive and inductive methods"],
      notes: `<p><b>Economics</b> studies how people and societies use <b>scarce resources</b> that have <b>alternative uses</b> to satisfy <b>unlimited wants</b>. The definition has evolved: Adam Smith saw it as the science of <b>wealth</b>; Alfred Marshall as the study of mankind in the ordinary business of life, focusing on material <b>welfare</b>; Lionel Robbins as the science that studies human behaviour as a relationship between ends and <b>scarce means</b> which have alternative uses; and Paul Samuelson added choice over time and <b>growth</b>. Scarcity forces <b>choice</b>, and every choice has an <b>opportunity cost</b>: the value of the next best alternative given up.</p>
<p style="margin-top:10px"><b>Microeconomics</b> studies individual units: consumers, firms and particular markets (demand, production, cost, price). <b>Macroeconomics</b> studies the economy as a whole: national income, employment, inflation, money, growth and the balance of payments. A <b>positive</b> statement describes what is, and can be tested ('a 10% rise in price cut sales by 5%'); a <b>normative</b> statement says what ought to be, and involves value judgements ('the government should subsidise fuel').</p>
<p style="margin-top:10px"><b>Business economics</b> (also called managerial economics) applies economic theory and tools to business <b>decision-making</b>: what to produce, how much, at what price, how to invest, how to forecast demand and how to respond to government policy. It is mainly <b>microeconomic</b> in character, but uses <b>macroeconomics</b> to understand the environment (interest rates, inflation, taxes, trade). It is <b>pragmatic</b> and <b>normative</b> in approach, inter-disciplinary (drawing on statistics, accounting, mathematics) and focused on the <b>firm</b>. Its scope covers demand analysis and forecasting, production and cost analysis, pricing and market structure, profit management, capital budgeting, and the business environment.</p>
<p style="margin-top:10px">Economists use two <b>methods</b>: the <b>deductive</b> method reasons from general assumptions to particular conclusions (for example, from 'people prefer more to less' to the law of demand); the <b>inductive</b> method builds general conclusions from observed data. In practice they complement each other.</p>`,
      formula: "Scarcity → choice → opportunity cost<small>micro: individual units · macro: the whole economy · positive: what is · normative: what ought to be</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Positive vs normative</h4>" + tbl(["Statement", "Type"], [["Raising the GST rate on cars reduced car sales", "Positive"], ["The government should lower tax on electric cars", "Normative"], ["India's inflation was above 6% in that year", "Positive (testable against data)"], ["Inflation is more harmful than unemployment", "Normative"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Chai Point Co (fictional) has ₹10 lakh. It can open a new outlet (expected profit ₹2.2 lakh a year), buy a delivery van (saving ₹1.8 lakh a year) or keep the money in a fixed deposit (₹70,000 a year).</p>" +
          tbl(["Choice", "Gain", "Opportunity cost"], [["Open the outlet", "₹2.2 lakh", "₹1.8 lakh (the van, the next best)"], ["Buy the van", "₹1.8 lakh", "₹2.2 lakh (the outlet)"], ["Fixed deposit", "₹0.7 lakh", "₹2.2 lakh"]]) +
          "<p class=\"muted small\" style=\"margin-top:10px\">The outlet is best: its gain exceeds its opportunity cost. Business economics turns such choices into explicit comparisons.</p>";
      },
      use: ["Use opportunity cost for every 'which option?' decision.", "Classify questions as micro or macro to choose the right tools.", "Mistake: treating a normative claim as a fact.", "Mistake: measuring opportunity cost as the sum of all options given up; it is only the next best one."],
      walk: function () { return [
        { t: "The central idea", c: "Wants are unlimited; resources are scarce.", h: box("Scarcity → Choice → Opportunity cost", "good") },
        { t: "Four definitions", c: "Wealth, welfare, scarcity, growth.", h: chips(["Smith", "Marshall", "Robbins", "Samuelson"], "ac") },
        { t: "Micro and macro", c: "The tree and the forest.", h: chips(["Micro: a firm, a market", "Macro: GDP, inflation"], function (x, i) { return i ? "hl" : "mi"; }) },
        { t: "Positive and normative", c: "What is, versus what ought to be.", h: chips(["Testable", "Value judgement"], "ac") },
        { t: "Business economics", c: "Theory applied to firm decisions.", h: chips(["Demand", "Cost", "Pricing", "Investment"], "ac") }]; },
      recap: ["Economics studies choice under scarcity; every choice has an opportunity cost", "Business economics applies mostly micro tools, with macro context, to decisions"],
      qc: [{ q: "Which definition of economics emphasises scarce means with alternative uses?", o: ["Robbins", "Adam Smith", "Marshall", "Samuelson"], a: 0, e: "Robbins defined economics in terms of scarcity and choice." },
        { q: "'The government should raise the minimum wage' is a…", o: ["Normative statement", "Positive statement", "Macroeconomic identity", "Testable hypothesis"], a: 0, e: "It contains a value judgement ('should')." }]
    },
    {
      id: "1.2", mod: 1, ch: "Chapter 1, Unit 2", title: "Basic Problems of an Economy and the Price Mechanism", time: "15 min", tool: "ppf",
      outcomes: ["State the central problems: what, how and for whom to produce, and growth", "Use a production possibility curve to show scarcity and opportunity cost", "Compare capitalist, socialist and mixed economies", "Explain how the price mechanism solves the central problems"],
      notes: `<p>Every economy faces the <b>central problems</b>: <b>what</b> to produce and in what quantities; <b>how</b> to produce (labour-intensive or capital-intensive techniques); <b>for whom</b> to produce (how output is distributed); and how to ensure full use of resources and <b>growth</b> over time.</p>
<p style="margin-top:10px">A <b>production possibility curve (PPC)</b> shows the combinations of two goods an economy can produce with given resources and technology, using them fully and efficiently. Points on the curve are efficient; points inside show unemployment or inefficiency; points outside are unattainable now. The curve is usually <b>concave to the origin</b> because of <b>increasing opportunity cost</b>: resources are not equally suited to both goods, so each extra unit of one good costs more and more of the other. The slope of the PPC is the <b>marginal rate of transformation</b>. Growth in resources or technology shifts it outward.</p>
<p style="margin-top:10px"><b>Economic systems</b> answer the central problems differently. In a <b>capitalist (market) economy</b>, resources are privately owned and the <b>price mechanism</b> decides; it offers freedom of choice, efficiency and incentives, but can produce inequality, instability and neglect of public goods. In a <b>socialist (command) economy</b>, resources are collectively owned and a central planning authority decides; it can reduce inequality but tends to suffer from inefficiency, weak incentives and limited choice. A <b>mixed economy</b>, like India's, combines a private sector working through markets with a public sector and government regulation.</p>
<p style="margin-top:10px">The <b>price mechanism</b> works through the interaction of demand and supply. A shortage raises the price, which encourages producers to supply more and consumers to buy less; a surplus lowers it. Prices thus <b>signal</b> scarcity, give producers an <b>incentive</b> to use cheaper techniques and make profitable goods, and <b>ration</b> goods among those willing and able to pay, answering what, how and for whom.</p>`,
      formula: "Opportunity cost of 1 more X = units of Y given up ÷ extra units of X<small>PPC concave → increasing opportunity cost · inside = inefficiency · outside = unattainable</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Three systems</h4>" + tbl(["Feature", "Capitalist", "Socialist", "Mixed"], [["Ownership", "Private", "State / collective", "Both"], ["Decisions", "Price mechanism", "Central planning", "Markets plus planning and regulation"], ["Motive", "Profit", "Social welfare", "Both"], ["Main weakness", "Inequality, instability", "Inefficiency, weak incentives", "Can combine both sets of problems"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">The fictional economy of Rangpur can make wheat and cloth with its resources:</p>" +
          tbl(["Point", "Wheat (tonnes)", "Cloth (bales)", "Opportunity cost of extra cloth"], [["A", "100", "0", "—"], ["B", "90", "10", "10 wheat for 10 cloth = 1"], ["C", "70", "20", "20 for 10 = 2"], ["D", "40", "30", "30 for 10 = 3"], ["E", "0", "40", "40 for 10 = 4"]]) +
          "<p class=\"muted small\" style=\"margin-top:10px\">Each extra 10 bales of cloth costs more wheat: increasing opportunity cost, so the PPC bows outward. Producing 60 wheat and 20 cloth would be inside the curve, wasting resources.</p>";
      },
      use: ["Read opportunity cost from a PPC as the slope between points.", "Use the PPC to show unemployment (inside) and growth (outward shift).", "Mistake: saying a point inside the PPC is unattainable; it is attainable but inefficient.", "Mistake: assuming opportunity cost is constant; that gives a straight-line PPC, a special case."],
      walk: function () { return [
        { t: "The central problems", c: "What, how, for whom, and growth.", h: chips(["What?", "How?", "For whom?", "Growth?"], "ac") },
        { t: "The PPC", c: "Combinations possible with full, efficient use of resources.", h: box("On: efficient · Inside: waste\nOutside: not yet possible", "good") },
        { t: "Increasing opportunity cost", c: "Each extra unit costs more.", h: chips(["1", "2", "3", "4"], "hl") },
        { t: "Three systems", c: "Who decides?", h: chips(["Market", "Plan", "Mixed"], "ac") },
        { t: "Price mechanism", c: "Signals, incentives and rationing.", h: chips(["Shortage → price ↑", "Surplus → price ↓"], function (x, i) { return i ? "hl" : "mi"; }) }]; },
      recap: ["The PPC shows scarcity, choice and increasing opportunity cost", "Markets solve the central problems through the price mechanism; planning and mixed systems differ in who decides"],
      qc: [{ q: "A point inside the production possibility curve shows…", o: ["Unemployment or inefficient use of resources", "An unattainable combination", "Economic growth", "Maximum efficiency"], a: 0, e: "More of both goods could be produced." },
        { q: "The PPC is concave to the origin because of…", o: ["Increasing opportunity cost", "Constant opportunity cost", "Decreasing opportunity cost", "Unlimited resources"], a: 0, e: "Resources are not equally efficient in producing both goods." }]
    },
    {
      id: "1.3", mod: 1, ch: "Chapter 2, Unit 1", title: "Law of Demand and Elasticity of Demand", time: "20 min", tool: "elastic",
      outcomes: ["List the determinants of demand and state the law of demand and its exceptions", "Distinguish a movement along the demand curve from a shift", "Measure price, income, cross and advertising elasticity, including point, arc and total outlay methods", "Explain the determinants of elasticity and its uses in business"],
      notes: `<p><b>Demand</b> is the quantity of a good that consumers are <b>willing and able</b> to buy at a given price, over a given period. It depends on the good's own <b>price</b>, the prices of <b>related goods</b> (substitutes and complements), consumers' <b>income</b>, <b>tastes and preferences</b>, <b>expectations</b> of future prices or income, the <b>size and composition of the population</b>, the distribution of income, and factors such as advertising, credit and climate.</p>
<p style="margin-top:10px">The <b>law of demand</b>: other things being equal, quantity demanded rises when price falls, and falls when price rises, so the demand curve slopes <b>downward</b>. Reasons include the law of diminishing marginal utility, the <b>income effect</b> (a lower price raises real income), the <b>substitution effect</b> (the good becomes cheaper than substitutes), new buyers entering, and multiple uses. <b>Exceptions</b>: <b>Giffen goods</b> (inferior staples where a strong negative income effect outweighs the substitution effect), <b>Veblen or prestige goods</b> bought for display, expectations of further price rises, consumers' ignorance (judging quality by price), and necessities whose demand hardly changes.</p>
<p style="margin-top:10px">A change in the good's own price causes a <b>movement along</b> the curve (extension or contraction). A change in any other determinant <b>shifts</b> the curve: an <b>increase</b> (rightward) or a <b>decrease</b> (leftward) in demand.</p>
<p style="margin-top:10px"><b>Elasticity</b> measures responsiveness. <b>Price elasticity</b> Ep = % change in quantity demanded ÷ % change in price (usually stated as a positive number). Demand is <b>elastic</b> if Ep &gt; 1, <b>inelastic</b> if Ep &lt; 1, <b>unitary</b> if 1, and perfectly elastic (∞) or perfectly inelastic (0) at the extremes. The <b>point</b> method uses (ΔQ/ΔP) × (P/Q); on a straight-line demand curve, Ep at a point = lower segment ÷ upper segment, so elasticity differs at each point. The <b>arc</b> method uses averages: (ΔQ / (Q1+Q2)) ÷ (ΔP / (P1+P2)). By the <b>total outlay method</b>, if total spending rises when price falls, demand is elastic; if it stays the same, unitary; if it falls, inelastic. <b>Income elasticity</b> is positive for normal goods (above 1 for luxuries, between 0 and 1 for necessities) and negative for inferior goods. <b>Cross elasticity</b> is positive for substitutes and negative for complements. <b>Advertising (promotional) elasticity</b> measures the response of sales to advertising spending.</p>
<p style="margin-top:10px">Elasticity is higher when there are close <b>substitutes</b>, the good is a <b>luxury</b>, it takes a large share of the <b>budget</b>, it has <b>many uses</b>, and over a <b>longer period</b>; it is lower for necessities and habit-forming goods. Firms use it for <b>pricing</b> (raise price only where demand is inelastic), governments for <b>taxation</b> (taxing inelastic goods raises revenue), and both for forecasting.</p>`,
      formula: "Ep = (ΔQ/Q) ÷ (ΔP/P) · arc: (ΔQ/(Q1+Q2)) ÷ (ΔP/(P1+P2))<small>income: + normal, − inferior · cross: + substitutes, − complements</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Total outlay method</h4>" + tbl(["Price change", "Total spending", "Demand is"], [["Price falls", "Rises", "Elastic (Ep > 1)"], ["Price falls", "Unchanged", "Unitary (Ep = 1)"], ["Price falls", "Falls", "Inelastic (Ep < 1)"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Chai Point Co cuts the price of a cup of tea from ₹20 to ₹16, and daily sales rise from 500 to 700 cups.</p>" +
          steps(["Percentage method (base: original values): %ΔQ = 200/500 = 40%; %ΔP = 4/20 = 20% → Ep = 40 ÷ 20 = 2", "Arc method: (200 / 1,200) ÷ (4 / 36) = 0.1667 ÷ 0.1111 = 1.5", "Total outlay: before ₹20 × 500 = ₹10,000; after ₹16 × 700 = ₹11,200 → spending rose when price fell → elastic", "Either way demand is elastic, so the price cut raised revenue."]);
      },
      use: ["Say which formula the question wants: percentage, point or arc.", "Use the sign of income and cross elasticity to classify goods.", "Mistake: calling a shift in demand a 'change in quantity demanded'.", "Mistake: assuming a straight-line demand curve has the same elasticity everywhere."],
      walk: function () { return [
        { t: "Determinants of demand", c: "Price is only one of them.", h: chips(["Own price", "Related prices", "Income", "Tastes", "Expectations"], "ac") },
        { t: "Law of demand", c: "Price ↓ → quantity ↑, other things equal.", h: chips(["Income effect", "Substitution effect"], "mi") },
        { t: "Movement or shift?", c: "Own price → movement; anything else → shift.", h: chips(["Extension / contraction", "Increase / decrease"], function (x, i) { return i ? "hl" : "mi"; }) },
        { t: "Price elasticity", c: "% ΔQ ÷ % ΔP.", h: box("40% ÷ 20% = 2 → elastic", "good") },
        { t: "Income and cross", c: "The sign tells you the type of good.", h: chips(["+ normal", "− inferior", "+ substitutes", "− complements"], "ac") }]; },
      recap: ["Demand falls as price rises, other things equal; other determinants shift the curve", "Elasticity measures responsiveness; its value and sign guide pricing and classification"],
      qc: [{ q: "If a fall in price leaves total expenditure unchanged, price elasticity of demand is…", o: ["Unitary (= 1)", "Greater than 1", "Less than 1", "Zero"], a: 0, e: "Total outlay method." },
        { q: "Cross elasticity between tea and coffee is…", o: ["Positive (substitutes)", "Negative (complements)", "Zero", "Infinite"], a: 0, e: "A rise in coffee's price raises the demand for tea." }]
    },
    {
      id: "1.4", mod: 1, ch: "Chapter 2, Unit 2", title: "Theory of Consumer Behaviour", time: "18 min", tool: "utility",
      outcomes: ["Explain the law of diminishing marginal utility and the law of equi-marginal utility", "Measure consumer surplus", "Explain indifference curves, the marginal rate of substitution and the budget line", "Find consumer equilibrium and separate price, income and substitution effects"],
      notes: `<p><b>Utility</b> is the want-satisfying power of a good. In the <b>cardinal</b> approach (Marshall), utility can be measured in units ('utils'). <b>Total utility</b> (TU) is the satisfaction from all units; <b>marginal utility</b> (MU) is the extra satisfaction from one more unit. By the <b>law of diminishing marginal utility</b>, as a consumer has more units of a good in a given period, the MU of each further unit falls. TU is at its maximum when MU is zero and falls when MU is negative. The law assumes units are homogeneous and consumed continuously, with tastes and income unchanged.</p>
<p style="margin-top:10px">A consumer buying one good is in equilibrium where <b>MU = price</b> (with utility measured in money). With several goods, the <b>law of equi-marginal utility</b> says he maximises satisfaction by spending so that the <b>MU per rupee</b> is the same for every good: MUx/Px = MUy/Py = MU of money. <b>Consumer surplus</b> (Marshall) is the difference between what the consumer is <b>willing to pay</b> and what he <b>actually pays</b>: the sum of (MU − price) over the units bought, or the area under the demand curve above the price.</p>
<p style="margin-top:10px">The <b>ordinal</b> approach (Hicks and Allen) only ranks preferences. An <b>indifference curve</b> shows combinations of two goods that give equal satisfaction. Indifference curves slope downward, are <b>convex</b> to the origin because of the diminishing <b>marginal rate of substitution</b> (MRSxy, the amount of Y given up for one more X while staying equally satisfied), never intersect, and a higher curve means higher satisfaction. The <b>budget line</b> shows the combinations a consumer can afford: Px·X + Py·Y = M, with slope −Px/Py. The consumer is in <b>equilibrium</b> where the budget line <b>touches</b> the highest attainable indifference curve: MRSxy = Px/Py, with the curve convex at that point.</p>
<p style="margin-top:10px">A change in income alone gives the <b>income effect</b> (traced by the income consumption curve); a change in price gives the <b>price effect</b>, which can be split into a <b>substitution effect</b> (always increases quantity when price falls) and an <b>income effect</b> (positive for normal goods, negative for inferior goods). A <b>Giffen good</b> is an inferior good whose negative income effect is larger than its substitution effect, so quantity falls when price falls.</p>`,
      formula: "Equilibrium (one good): MU = P · Equi-marginal: MUx/Px = MUy/Py<small>consumer surplus = willingness to pay − amount paid · indifference curve equilibrium: MRSxy = Px/Py</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Cardinal vs ordinal</h4>" + tbl(["Basis", "Cardinal (Marshall)", "Ordinal (Hicks–Allen)"], [["Utility", "Measurable in utils or money", "Only ranked"], ["Tool", "MU schedule", "Indifference curves and budget line"], ["Equilibrium", "MU = P; equal MU per rupee", "MRS = price ratio"], ["MU of money", "Assumed constant", "No such assumption"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Isha values successive samosas (in rupees of satisfaction) at ₹30, ₹24, ₹18, ₹12, ₹6. A samosa costs ₹15.</p>" +
          tbl(["Samosa", "MU (₹)", "Price (₹)", "Surplus (₹)"], [["1st", "30", "15", "15"], ["2nd", "24", "15", "9"], ["3rd", "18", "15", "3"], ["4th", "12", "15", "not bought"]]) +
          "<p class=\"muted small\" style=\"margin-top:10px\">She buys 3 (MU of the 4th, ₹12, is below the price). Consumer surplus = 15 + 9 + 3 = ₹27; she would pay ₹72 for three but pays only ₹45.</p>";
      },
      use: ["Stop buying where the next unit's MU is less than its price.", "Compare MU per rupee, not MU, when choosing between goods.", "Mistake: saying indifference curves can cross; that breaks transitivity.", "Mistake: calling every inferior good a Giffen good."],
      walk: function () { return [
        { t: "Diminishing marginal utility", c: "Each extra unit satisfies less.", h: chips(["30", "24", "18", "12", "6"], "hl") },
        { t: "When to stop buying", c: "MU = price.", h: box("MU ₹18 ≥ ₹15 → buy the 3rd\nMU ₹12 < ₹15 → stop", "good") },
        { t: "Consumer surplus", c: "Willing to pay minus paid.", h: chips(["₹72 − ₹45 = ₹27"], "mi") },
        { t: "Indifference curves", c: "Equal satisfaction; convex; never cross.", h: chips(["MRS falls"], "ac") },
        { t: "Equilibrium", c: "Budget line tangent to the highest curve.", h: chips(["MRSxy = Px/Py"], "ac") }]; },
      recap: ["Marginal utility diminishes; buy until MU equals price and equalise MU per rupee across goods", "In the ordinal approach, equilibrium is where MRS equals the price ratio"],
      qc: [{ q: "Total utility is maximum when marginal utility is…", o: ["Zero", "Maximum", "Negative", "Equal to price"], a: 0, e: "After that, extra units reduce total utility." },
        { q: "Indifference curves are convex to the origin because of…", o: ["Diminishing marginal rate of substitution", "Increasing marginal utility", "Constant prices", "The budget line"], a: 0, e: "The consumer gives up less and less Y for each extra X." }]
    },
    {
      id: "1.5", mod: 1, ch: "Chapter 2, Unit 3", title: "Supply", time: "14 min", tool: "supply",
      outcomes: ["List the determinants of supply and state the law of supply", "Distinguish movements along the supply curve from shifts", "Measure the elasticity of supply, including the geometric rule for straight-line curves", "Explain how demand and supply set the equilibrium price"],
      notes: `<p><b>Supply</b> is the quantity of a good that producers are <b>willing and able to offer for sale</b> at a given price over a period. Its <b>determinants</b> are the good's own <b>price</b>, prices of <b>related goods</b> (a farmer may switch land to a crop that has become more profitable), prices of <b>factors of production</b> (input costs), <b>technology</b>, the <b>number of firms</b>, government policy (<b>taxes</b> reduce supply; <b>subsidies</b> increase it), producers' <b>expectations</b>, and natural factors such as weather.</p>
<p style="margin-top:10px">The <b>law of supply</b>: other things being equal, quantity supplied rises as price rises, so the supply curve slopes <b>upward</b>, because a higher price makes production more profitable and covers rising marginal cost. A change in the good's own price causes a <b>movement</b> along the curve (<b>extension</b> or <b>contraction</b>); a change in any other determinant <b>shifts</b> it (<b>increase</b> to the right, <b>decrease</b> to the left). Supply is a flow per period, and differs from <b>stock</b>, the total quantity held.</p>
<p style="margin-top:10px">The <b>elasticity of supply</b> Es = % change in quantity supplied ÷ % change in price. It is usually positive. For a <b>straight-line supply curve</b>: if it passes through the <b>origin</b>, Es = 1 at every point; if extended it meets the <b>price axis</b> (positive intercept on the price axis), Es &gt; 1; if it meets the <b>quantity axis</b>, Es &lt; 1. Supply is more elastic over a <b>longer time</b> (Marshall's market period, short period and long period), when spare capacity exists, when inputs are easily available, and for goods that can be stored.</p>
<p style="margin-top:10px">The market <b>equilibrium</b> price is where quantity demanded equals quantity supplied. An increase in demand raises both price and quantity; an increase in supply lowers price and raises quantity. When both shift, the effect on one of them depends on the relative size of the shifts.</p>`,
      formula: "Es = (ΔQs/Qs) ÷ (ΔP/P)<small>straight line through origin: Es = 1 · meets price axis: Es > 1 · meets quantity axis: Es < 1</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Movement vs shift</h4>" + tbl(["Cause", "Effect on the supply curve"], [["Own price rises", "Extension (movement up)"], ["Own price falls", "Contraction (movement down)"], ["Better technology, lower input cost, subsidy", "Increase (shift right)"], ["Higher tax, costlier inputs, bad weather", "Decrease (shift left)"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">When the price of bread rises from ₹40 to ₹50, Kiran's Bakery raises daily supply from 300 to 420 loaves.</p>" +
          steps(["%ΔQs = 120 / 300 = 40%", "%ΔP = 10 / 40 = 25%", "Es = 40 ÷ 25 = 1.6 → elastic supply", "Check with the straight line through the two points: slope ΔP/ΔQ = 10/120; extended back, it meets the price axis at ₹40 − 300 × (10/120) = ₹15 (positive), so Es > 1 ✓"]);
      },
      use: ["Use the axis the extended supply line meets to judge elasticity at a glance.", "Separate supply (a flow) from stock.", "Mistake: calling a tax-induced shift a 'contraction in supply'.", "Mistake: forgetting that time increases the elasticity of supply."],
      walk: function () { return [
        { t: "Law of supply", c: "Price ↑ → quantity supplied ↑.", h: chips(["Upward-sloping curve"], "ac") },
        { t: "Determinants", c: "Costs, technology, taxes, related goods…", h: chips(["Input prices", "Technology", "Taxes", "Subsidies"], "ac") },
        { t: "Elasticity of supply", c: "% ΔQs ÷ % ΔP.", h: box("40% ÷ 25% = 1.6 → elastic", "good") },
        { t: "The geometric rule", c: "Where does the line meet the axes?", h: chips(["Origin: 1", "Price axis: > 1", "Quantity axis: < 1"], "ac") },
        { t: "Equilibrium", c: "Demand meets supply.", h: chips(["Qd = Qs"], "mi") }]; },
      recap: ["Supply rises with price; other determinants shift the curve", "Elasticity of supply depends on time, capacity and inputs; a line through the origin has Es = 1"],
      qc: [{ q: "A straight-line supply curve passing through the origin has elasticity…", o: ["Equal to 1 at every point", "Greater than 1", "Less than 1", "Zero"], a: 0, e: "A standard geometric result." },
        { q: "A subsidy to producers causes…", o: ["An increase in supply (shift right)", "An extension of supply", "A decrease in supply", "A contraction of supply"], a: 0, e: "It lowers costs, shifting the curve." }]
    },

    /* ---------------- MODULE 2: PRODUCTION, COST AND MARKETS ---------------- */
    {
      id: "2.1", mod: 2, ch: "Chapter 3, Unit 1", title: "Theory of Production", time: "17 min", tool: "product",
      outcomes: ["Identify the factors of production and the role of the entrepreneur", "Define a production function and distinguish the short run from the long run", "Explain total, average and marginal product and the law of variable proportions (three stages)", "Explain returns to scale, isoquants and the producer's equilibrium"],
      notes: `<p><b>Production</b> is the creation of utility (goods and services). The <b>factors of production</b> are <b>land</b> (all natural resources; supply fixed, earns rent), <b>labour</b> (human effort; earns wages), <b>capital</b> (man-made means of production; earns interest) and the <b>entrepreneur</b> (who organises the others, takes risk and innovates; earns profit). A <b>production function</b> shows the maximum output obtainable from given inputs with given technology: Q = f(L, K). The <b>short run</b> is a period in which at least one input is <b>fixed</b>; in the <b>long run</b>, all inputs are variable.</p>
<p style="margin-top:10px">With one variable input (labour) and a fixed input: <b>total product</b> (TP) is total output; <b>average product</b> AP = TP/L; <b>marginal product</b> MP = ΔTP/ΔL. The <b>law of variable proportions</b> says that as more of a variable factor is combined with a fixed factor, MP may rise at first, but eventually <b>falls</b>. It has three <b>stages</b>: <b>Stage I</b> (increasing returns to the factor), from the origin to where <b>AP is at its maximum</b> (MP = AP); <b>Stage II</b> (diminishing returns), from maximum AP to where <b>MP = 0</b> (TP at its maximum); <b>Stage III</b> (negative returns), where MP is negative and TP falls. A rational producer operates in <b>Stage II</b>. MP cuts AP at AP's maximum: while MP &gt; AP, AP rises; when MP &lt; AP, AP falls.</p>
<p style="margin-top:10px"><b>Returns to scale</b> describe the long run, when all inputs change in the same proportion: <b>increasing</b> (output rises more than proportionately, from specialisation and indivisibilities), <b>constant</b> (same proportion) or <b>decreasing</b> (less than proportionately, often from management problems). The <b>Cobb–Douglas</b> function Q = A·L^α·K^β shows constant returns if α + β = 1, increasing if &gt; 1, decreasing if &lt; 1.</p>
<p style="margin-top:10px">An <b>isoquant</b> shows combinations of two inputs giving the same output; it slopes downward and is convex because of the diminishing <b>marginal rate of technical substitution</b> (MRTS). An <b>isocost</b> line shows input combinations with the same total cost. The <b>producer's equilibrium</b> (least-cost combination) is where the isocost line touches the isoquant: MRTS = w/r, the ratio of input prices, or MPL/w = MPK/r.</p>`,
      formula: "AP = TP/L · MP = ΔTP/ΔL<small>Stage I ends at max AP (MP = AP) · Stage II ends at MP = 0 · least cost: MRTS = w/r</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Three stages</h4>" + tbl(["Stage", "TP", "AP", "MP"], [["I: increasing returns", "Rises fast", "Rises to its maximum", "Rises, then falls but stays above AP"], ["II: diminishing returns", "Rises at a falling rate, to its maximum", "Falls", "Falls to zero"], ["III: negative returns", "Falls", "Falls", "Negative"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Kiran's Bakery has one oven (fixed) and adds bakers:</p>" +
          tbl(["Bakers", "TP (loaves)", "AP", "MP"], [["1", "40", "40", "40"], ["2", "100", "50", "60"], ["3", "150", "50", "50"], ["4", "180", "45", "30"], ["5", "190", "38", "10"], ["6", "190", "31.7", "0"], ["7", "175", "25", "−15"]]) +
          "<p class=\"muted small\" style=\"margin-top:10px\">AP peaks at 50 (2–3 bakers): Stage I ends. MP reaches zero at 6 bakers: Stage II ends. With 7, MP is negative: Stage III. The bakery should employ between 3 and 6 bakers.</p>";
      },
      use: ["Find the stages from the table: maximum AP and MP = 0 are the boundaries.", "Use returns to scale only for the long run, when all inputs change together.", "Mistake: mixing up diminishing returns to a factor (short run) with decreasing returns to scale (long run).", "Mistake: saying a firm operates where MP is highest; it operates in Stage II."],
      walk: function () { return [
        { t: "Factors and rewards", c: "Land, labour, capital, entrepreneur.", h: chips(["Rent", "Wages", "Interest", "Profit"], "ac") },
        { t: "TP, AP, MP", c: "Average and marginal product.", h: box("AP = TP ÷ L\nMP = change in TP from one more L", "good") },
        { t: "Three stages", c: "Rational producers stay in Stage II.", h: chips(["I", "II ✓", "III"], function (x, i) { return i === 1 ? "mi" : "hl"; }) },
        { t: "Returns to scale", c: "All inputs change together.", h: chips(["Increasing", "Constant", "Decreasing"], "ac") },
        { t: "Least-cost combination", c: "Isoquant meets isocost.", h: chips(["MRTS = w/r"], "ac") }]; },
      recap: ["The law of variable proportions has three stages; producers operate in Stage II", "Returns to scale apply in the long run; the least-cost combination sets MRTS equal to the input price ratio"],
      qc: [{ q: "Stage II of the law of variable proportions ends where…", o: ["Marginal product is zero", "Average product is maximum", "Total product begins", "Marginal product is maximum"], a: 0, e: "At MP = 0, TP is at its maximum." },
        { q: "In Q = A·L^0.6·K^0.4, returns to scale are…", o: ["Constant", "Increasing", "Decreasing", "Negative"], a: 0, e: "0.6 + 0.4 = 1." }]
    },
    {
      id: "2.2", mod: 2, ch: "Chapter 3, Unit 2", title: "Theory of Cost", time: "17 min", tool: "cost",
      outcomes: ["Distinguish explicit, implicit, opportunity, accounting and economic costs", "Calculate TFC, TVC, TC, AFC, AVC, ATC and MC", "Explain the shapes of short-run cost curves and the relations between them", "Explain long-run average cost and economies and diseconomies of scale"],
      notes: `<p><b>Explicit costs</b> are actual payments to outsiders (wages, rent, materials). <b>Implicit costs</b> are the imputed value of the owner's own resources used in the business (his own capital, building, labour). <b>Accounting cost</b> includes only explicit costs; <b>economic cost</b> includes both, so <b>economic profit</b> = revenue − explicit − implicit costs. <b>Normal profit</b> is the minimum return needed to keep the entrepreneur in the business and is part of economic cost. Other cost concepts include <b>opportunity cost</b>, <b>sunk cost</b> (already incurred and unrecoverable), <b>incremental cost</b> and <b>private versus social cost</b>.</p>
<p style="margin-top:10px">In the <b>short run</b>: <b>total fixed cost</b> (TFC) does not change with output (rent, salaries of permanent staff, insurance) and is incurred even at zero output; <b>total variable cost</b> (TVC) rises with output (materials, power, wages of casual labour); TC = TFC + TVC. <b>Average fixed cost</b> AFC = TFC/Q falls continuously (a rectangular hyperbola). <b>Average variable cost</b> AVC = TVC/Q and <b>average total cost</b> ATC = TC/Q = AFC + AVC are <b>U-shaped</b> because of the law of variable proportions. <b>Marginal cost</b> MC = ΔTC/ΔQ = ΔTVC/ΔQ (fixed cost does not affect MC). MC cuts <b>both AVC and ATC at their minimum points</b>, from below. The minimum point of ATC lies to the right of, and above, the minimum of AVC.</p>
<p style="margin-top:10px">In the <b>long run</b>, all costs are variable. The <b>long-run average cost</b> (LAC) curve is the <b>envelope</b> of short-run average cost curves (a 'planning curve'). It is usually U-shaped (flatter than the SAC curves) because of <b>economies of scale</b> at first and <b>diseconomies</b> later. <b>Internal economies</b> arise inside the firm as it grows: technical (bigger, more efficient machines), managerial (specialised managers), marketing (bulk buying, advertising spread over more units), financial (cheaper credit) and risk-bearing (diversification). <b>External economies</b> arise from the growth of the industry (better infrastructure, skilled labour pools, ancillary suppliers). Beyond a point, <b>diseconomies</b> (coordination problems, rising input prices, congestion) raise LAC. The <b>minimum efficient scale</b> is the lowest output at which LAC is at its minimum.</p>`,
      formula: "TC = TFC + TVC · AFC = TFC/Q · AVC = TVC/Q · ATC = TC/Q · MC = ΔTC/ΔQ<small>MC cuts AVC and ATC at their minimum points</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Accounting vs economic profit</h4>" + tbl(["Item", "₹"], [["Revenue", "12,00,000"], ["Explicit costs", "8,00,000"], ["Accounting profit", "4,00,000"], ["Implicit costs (owner's salary foregone ₹3,00,000 + interest on own capital ₹60,000)", "3,60,000"], ["Economic profit", "40,000"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Kiran's Bakery has fixed costs of ₹600 a day. Total variable cost for 1 to 6 batches is ₹400, 700, 900, 1,200, 1,700, 2,400.</p>" +
          tbl(["Q", "TVC", "TC", "AFC", "AVC", "ATC", "MC"], [["1", "400", "1,000", "600", "400", "1,000", "400"], ["2", "700", "1,300", "300", "350", "650", "300"], ["3", "900", "1,500", "200", "300", "500", "200"], ["4", "1,200", "1,800", "150", "300", "450", "300"], ["5", "1,700", "2,300", "120", "340", "460", "500"], ["6", "2,400", "3,000", "100", "400", "500", "700"]]) +
          "<p class=\"muted small\" style=\"margin-top:10px\">AVC is lowest (₹300) at 3–4 batches; ATC is lowest (₹450) at 4. MC rises past AVC and ATC near their minimum points.</p>";
      },
      use: ["Compute MC from TC or TVC; it is the same either way.", "A firm can stay open in the short run if price covers AVC.", "Mistake: including sunk costs in a decision about the future.", "Mistake: thinking AFC eventually rises; it always falls as output grows."],
      walk: function () { return [
        { t: "Explicit and implicit", c: "Economic cost includes both.", h: chips(["Accounting profit", "Economic profit"], "ac") },
        { t: "Fixed and variable", c: "TC = TFC + TVC.", h: box("AFC ↓ always\nAVC, ATC: U-shaped", "good") },
        { t: "Marginal cost", c: "Fixed cost does not affect it.", h: chips(["MC = ΔTVC/ΔQ"], "mi") },
        { t: "The key relation", c: "MC cuts AVC and ATC at their minimum.", h: chips(["min AVC", "min ATC"], "ac") },
        { t: "Long run", c: "LAC envelopes SAC curves.", h: chips(["Economies", "Diseconomies"], function (x, i) { return i ? "hl" : "mi"; }) }]; },
      recap: ["ATC = AFC + AVC; MC cuts AVC and ATC at their minimum points", "The LAC is an envelope, U-shaped because of economies and then diseconomies of scale"],
      qc: [{ q: "Which cost curve is a rectangular hyperbola?", o: ["Average fixed cost", "Average variable cost", "Marginal cost", "Average total cost"], a: 0, e: "AFC × Q = TFC, a constant." },
        { q: "The marginal cost curve cuts the average total cost curve…", o: ["At its minimum point", "At its maximum point", "Where AFC is minimum", "Never"], a: 0, e: "When MC < ATC, ATC falls; when MC > ATC, it rises." }]
    },
    {
      id: "2.3", mod: 2, ch: "Chapter 4, Unit 1", title: "Meaning and Types of Markets", time: "13 min", tool: "sort",
      tcfg: { d: "Which market form does each description fit best?", buckets: ["Perfect competition", "Monopoly", "Monopolistic competition", "Oligopoly"], items: [
        ["Thousands of farmers sell identical wheat; none can affect the price", "Perfect competition", "Many sellers, homogeneous product, price taker."],
        ["A single firm supplies piped gas to a city, with no close substitute", "Monopoly", "One seller and barriers to entry."],
        ["Many restaurants sell similar but differentiated meals and advertise heavily", "Monopolistic competition", "Many sellers with product differentiation."],
        ["Four telecom firms watch each other's tariffs closely", "Oligopoly", "Few sellers and mutual interdependence."],
        ["A few large firms dominate cement, and one firm's price change is followed by the others", "Oligopoly", "Price leadership is common in oligopoly."],
        ["Many brands of toothpaste, each with loyal customers", "Monopolistic competition", "Differentiated products and selling costs."],
        ["A government-owned railway is the only rail operator", "Monopoly", "A legal or natural monopoly."]] },
      outcomes: ["Define a market and classify markets by area, time and competition", "List the features of perfect competition, monopoly, monopolistic competition and oligopoly", "Explain the demand curve faced by a firm in each market form", "Recognise other forms: duopoly, monopsony and bilateral monopoly"],
      notes: `<p>In economics a <b>market</b> is any arrangement through which buyers and sellers come into contact to exchange goods or services; a physical place is not needed. Markets can be classified by <b>area</b> (local, regional, national, international), by <b>time</b> (Marshall's <b>very short period</b> or market period, when supply is fixed; <b>short period</b>, when output can change with existing plant; and <b>long period</b>, when plant and the number of firms can change) and by the degree of <b>competition</b>.</p>
<p style="margin-top:10px"><b>Perfect competition</b>: a <b>large number</b> of buyers and sellers, a <b>homogeneous</b> product, <b>free entry and exit</b>, <b>perfect knowledge</b>, perfect mobility of factors and no transport costs. Each firm is a <b>price taker</b>: the industry sets the price and the firm faces a <b>perfectly elastic (horizontal)</b> demand curve, so AR = MR = price. <b>Monopoly</b>: a <b>single seller</b>, <b>no close substitutes</b> and strong <b>barriers to entry</b> (legal rights such as patents and licences, control of a key input, economies of scale, or a natural monopoly). The monopolist is a <b>price maker</b>, but faces a downward-sloping demand curve, so MR &lt; AR.</p>
<p style="margin-top:10px"><b>Monopolistic competition</b> (Chamberlin): many sellers, <b>differentiated products</b> (by brand, design, location, service), free entry, and heavy <b>selling costs</b> (advertising). Each firm has some control over its price and faces a downward-sloping, fairly <b>elastic</b> demand curve. <b>Oligopoly</b>: a <b>few</b> sellers whose decisions are <b>interdependent</b>; products may be homogeneous (cement, steel) or differentiated (cars). There are barriers to entry and uncertainty about rivals' reactions; it may be collusive (a <b>cartel</b>, price leadership) or non-collusive. Price rigidity is explained by the <b>kinked demand curve</b> (Sweezy). A <b>duopoly</b> has two sellers.</p>
<p style="margin-top:10px">On the buying side, a <b>monopsony</b> has a single buyer (a sole employer in a town) and an <b>oligopsony</b> a few buyers. <b>Bilateral monopoly</b> is a single seller facing a single buyer.</p>`,
      formula: "Perfect competition: AR = MR = P (horizontal) · Monopoly and others: AR slopes down, MR < AR<small>oligopoly: few sellers, interdependence · monopolistic: differentiation and selling costs</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Market forms compared</h4>" + tbl(["Feature", "Perfect comp.", "Monopoly", "Monopolistic comp.", "Oligopoly"], [["Sellers", "Very many", "One", "Many", "Few"], ["Product", "Identical", "No close substitute", "Differentiated", "Identical or differentiated"], ["Entry", "Free", "Blocked", "Free", "Difficult"], ["Price control", "None", "Considerable", "Some", "Interdependent"], ["Selling costs", "None", "Some", "High", "High"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">How would each firm react if it raised its price by 10% while rivals did not?</p>" +
          tbl(["Firm", "Market form", "Likely result"], [["A wheat farmer", "Perfect competition", "Sells nothing: buyers move to identical wheat"], ["The city's piped-gas supplier", "Monopoly", "Loses some customers, keeps most"], ["A popular café", "Monopolistic competition", "Loses some customers to other cafés"], ["One of four telecom firms", "Oligopoly", "Loses many customers if rivals hold prices: it must predict their reaction"]]);
      },
      use: ["Classify a market by number of sellers, product type and entry conditions.", "Remember that only under perfect competition is the firm's demand curve horizontal.", "Mistake: thinking a monopolist can charge any price and sell any quantity; it is limited by demand.", "Mistake: ignoring interdependence in oligopoly."],
      walk: function () { return [
        { t: "What is a market?", c: "Contact between buyers and sellers.", h: chips(["Area", "Time", "Competition"], "ac") },
        { t: "Perfect competition", c: "Many sellers, identical product, price taker.", h: box("AR = MR = Price\n(horizontal demand curve)", "good") },
        { t: "Monopoly", c: "One seller, barriers to entry.", h: chips(["Patents", "Licences", "Natural monopoly"], "ac") },
        { t: "Monopolistic competition", c: "Differentiated products.", h: chips(["Brands", "Advertising"], "mi") },
        { t: "Oligopoly", c: "Few sellers watching each other.", h: chips(["Cartel", "Price leadership", "Kinked demand"], "hl") }]; },
      recap: ["Market forms differ by the number of sellers, product type and ease of entry", "A competitive firm is a price taker; other firms face downward-sloping demand with MR below AR"],
      qc: [{ q: "Under perfect competition, the demand curve faced by a single firm is…", o: ["Perfectly elastic (horizontal)", "Downward sloping", "Perfectly inelastic", "Kinked"], a: 0, e: "The firm can sell any quantity at the market price." },
        { q: "The kinked demand curve is used to explain price rigidity in…", o: ["Oligopoly", "Perfect competition", "Monopoly", "Monopolistic competition"], a: 0, e: "Sweezy's model." }]
    },
    {
      id: "2.4", mod: 2, ch: "Chapter 4, Unit 2", title: "Determination of Prices", time: "15 min", tool: "equil",
      outcomes: ["Find the equilibrium price and quantity from demand and supply", "Predict the effect of shifts in demand, supply or both", "Explain the effect of price ceilings and price floors", "Explain the role of time in price determination"],
      notes: `<p>In a competitive market, <b>equilibrium</b> is reached where the quantity demanded equals the quantity supplied (Qd = Qs). At a price above equilibrium there is a <b>surplus</b> (excess supply), which pushes the price down; below it there is a <b>shortage</b> (excess demand), which pushes the price up. With straight-line curves Qd = a − bP and Qs = c + dP, the equilibrium price is P* = (a − c) ÷ (b + d).</p>
<p style="margin-top:10px"><b>Shifts</b>: an <b>increase in demand</b> raises equilibrium price and quantity; a <b>decrease</b> lowers both. An <b>increase in supply</b> lowers price and raises quantity; a <b>decrease</b> raises price and lowers quantity. When both shift in the <b>same direction</b>, quantity changes in that direction and the effect on price depends on which shift is larger; when they shift in <b>opposite directions</b>, price moves in the direction of the demand shift and the effect on quantity depends on the relative sizes. If demand is perfectly inelastic, a supply increase only lowers price; if supply is perfectly inelastic (as in the very short period), price is decided by demand alone.</p>
<p style="margin-top:10px"><b>Government intervention</b>: a <b>price ceiling</b> (maximum price) set <b>below</b> equilibrium causes a <b>shortage</b>, and often rationing, queues and black markets. A <b>price floor</b> (minimum support price, minimum wage) set <b>above</b> equilibrium causes a <b>surplus</b>, which the government may have to buy and store. A <b>tax</b> on sellers shifts supply left; its burden is shared between buyers and sellers, with the more <b>inelastic</b> side bearing more.</p>
<p style="margin-top:10px">Marshall showed the importance of <b>time</b>: in the <b>very short period</b>, supply is fixed and price depends on demand; in the <b>short period</b>, supply can change with existing plant, so both blades of the 'scissors' matter; in the <b>long period</b>, supply adjusts fully and price tends to equal the minimum average cost (with constant costs, long-run supply is horizontal).</p>`,
      formula: "Equilibrium: Qd = Qs · with Qd = a − bP and Qs = c + dP, P* = (a − c)/(b + d)<small>ceiling below P* → shortage · floor above P* → surplus</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Shifts at a glance</h4>" + tbl(["Change", "Price", "Quantity"], [["Demand ↑", "↑", "↑"], ["Demand ↓", "↓", "↓"], ["Supply ↑", "↓", "↑"], ["Supply ↓", "↑", "↓"], ["Both ↑", "?", "↑"], ["Demand ↑, supply ↓", "↑", "?"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">In a fictional market for mangoes: Qd = 1,200 − 20P and Qs = 200 + 30P (P in ₹ per kg, Q in kg).</p>" +
          steps(["Set Qd = Qs: 1,200 − 20P = 200 + 30P → 1,000 = 50P → P* = ₹20", "Q* = 1,200 − 20 × 20 = 800 kg (check: 200 + 30 × 20 = 800 ✓)", "A price ceiling of ₹15: Qd = 900, Qs = 650 → shortage of 250 kg", "A price floor of ₹25: Qd = 700, Qs = 950 → surplus of 250 kg"]);
      },
      use: ["Solve straight-line demand and supply by setting them equal.", "When both curves shift, state clearly which result is certain and which is indeterminate.", "Mistake: saying a price ceiling above equilibrium causes a shortage; it has no effect.", "Mistake: assuming the seller always bears a tax in full."],
      walk: function () { return [
        { t: "Equilibrium", c: "Where the curves cross.", h: box("1,200 − 20P = 200 + 30P\nP* = ₹20, Q* = 800", "good") },
        { t: "Out of equilibrium", c: "Surplus pushes price down; shortage pushes it up.", h: chips(["Surplus → P↓", "Shortage → P↑"], "ac") },
        { t: "Shifts", c: "Demand ↑: P↑ Q↑ · Supply ↑: P↓ Q↑.", h: chips(["D↑", "S↑", "Both"], "ac") },
        { t: "Price controls", c: "Ceilings cause shortages; floors cause surpluses.", h: chips(["Ceiling ₹15: short 250", "Floor ₹25: surplus 250"], "hl") },
        { t: "Time", c: "Very short, short and long period.", h: chips(["Marshall's scissors"], "mi") }]; },
      recap: ["Equilibrium is where Qd = Qs; shifts move it predictably", "A ceiling below equilibrium creates a shortage; a floor above it, a surplus"],
      qc: [{ q: "If demand increases and supply decreases, the equilibrium price will…", o: ["Rise", "Fall", "Stay the same", "Be indeterminate"], a: 0, e: "Both shifts push the price up; quantity is indeterminate." },
        { q: "A minimum support price set above the equilibrium price leads to…", o: ["A surplus", "A shortage", "No effect", "A fall in supply"], a: 0, e: "Quantity supplied exceeds quantity demanded." }]
    },
    {
      id: "2.5", mod: 2, ch: "Chapter 4, Unit 3", title: "Price-Output Determination under Different Market Forms", time: "21 min", tool: "firmeq",
      outcomes: ["State the conditions of equilibrium: MR = MC and MC cutting MR from below", "Find short-run and long-run equilibrium under perfect competition, including the shut-down point", "Find the monopolist's equilibrium and explain price discrimination", "Explain equilibrium under monopolistic competition and models of oligopoly"],
      notes: `<p>A firm maximises profit where <b>marginal revenue equals marginal cost</b> (MR = MC), with <b>MC cutting MR from below</b> (the second-order condition). Total revenue TR = P × Q; average revenue AR = TR/Q = price; MR = ΔTR/ΔQ. For a straight-line demand curve P = a − bQ, MR = a − 2bQ (twice as steep). The relation MR = AR × (e − 1)/e links revenue to elasticity: MR is positive only where demand is <b>elastic</b>.</p>
<p style="margin-top:10px"><b>Perfect competition</b>: P = AR = MR, so the firm produces where <b>P = MC</b>. In the <b>short run</b> it may earn <b>supernormal profit</b> (P &gt; ATC), <b>normal profit</b> (P = ATC) or a <b>loss</b>. It continues production while <b>P ≥ AVC</b>, as it covers variable cost and part of fixed cost; the <b>shut-down point</b> is <b>minimum AVC</b>. The <b>break-even point</b> is minimum ATC. The part of the MC curve above minimum AVC is the firm's <b>short-run supply curve</b>. In the <b>long run</b>, free entry and exit eliminate abnormal profits: <b>P = MR = MC = minimum LAC</b>, and firms earn only normal profit, producing at the most efficient scale.</p>
<p style="margin-top:10px"><b>Monopoly</b>: the monopolist chooses output where MR = MC and charges the price given by the demand curve at that output, so <b>P &gt; MC</b>. It always produces on the <b>elastic</b> part of demand. It can earn supernormal profit even in the long run because entry is blocked. A monopolist has no supply curve. <b>Price discrimination</b> means charging different prices for the same product to different buyers, for reasons unrelated to cost. It needs <b>market power</b>, <b>separable markets</b> (no resale) and <b>different elasticities</b>; the higher price is charged in the <b>less elastic</b> market, and output is allocated so that MR is equal in each market and equal to MC. Pigou described <b>first</b>-degree (each unit at the maximum the buyer will pay), <b>second</b>-degree (prices fall with quantity bought) and <b>third</b>-degree (different groups or markets) discrimination.</p>
<p style="margin-top:10px"><b>Monopolistic competition</b>: in the short run, a firm can earn supernormal profit like a monopolist; in the long run, entry removes it, and the firm earns <b>normal profit</b> where its demand (AR) curve is <b>tangent</b> to the LAC curve, on the <b>falling</b> part of LAC. It therefore has <b>excess capacity</b>. <b>Oligopoly</b> has no single model: the <b>kinked demand curve</b> (rivals follow price cuts but not rises, so prices are rigid), <b>price leadership</b> (by a dominant or low-cost firm), <b>cartels</b> (firms jointly set price and output like a monopolist, as OPEC does for oil), and game-theory approaches.</p>`,
      formula: "Profit maximum: MR = MC (MC rising) · Competition: P = MC · Monopoly: P > MC<small>shut down if P < min AVC · long run (competition): P = min LAC · straight-line demand: MR = a − 2bQ</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Long-run equilibrium compared</h4>" + tbl(["Feature", "Perfect competition", "Monopoly", "Monopolistic competition"], [["Condition", "P = MC = min LAC", "MR = MC, P > MC", "AR tangent to LAC, MR = MC"], ["Profit", "Normal", "Can be supernormal", "Normal"], ["Capacity", "Optimum", "Usually excess", "Excess capacity"], ["Price vs competition", "Lowest", "Higher", "Higher"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">A fictional monopolist faces demand P = 100 − 2Q and has TC = 200 + 20Q.</p>" +
          steps(["TR = 100Q − 2Q², so MR = 100 − 4Q; MC = 20", "MR = MC: 100 − 4Q = 20 → Q = 20", "Price from demand: P = 100 − 2 × 20 = ₹60", "Profit = TR − TC = 60 × 20 − (200 + 20 × 20) = 1,200 − 600 = ₹600", "Under perfect competition (P = MC = 20), output would be Q = 40 at ₹20: the monopolist restricts output and charges more."]);
      },
      use: ["Always find output from MR = MC first, then read the price from demand.", "For the shut-down decision, compare price with AVC, not ATC.", "Mistake: saying the monopolist sets price where MC = AR.", "Mistake: charging the higher price in the more elastic market under discrimination."],
      walk: function () { return [
        { t: "The golden rule", c: "Produce where MR = MC, with MC rising.", h: chips(["MR = MC"], "ac") },
        { t: "Perfect competition", c: "P = MC; shut down below min AVC.", h: box("Short run: profit, normal profit or loss\nLong run: P = min LAC", "good") },
        { t: "Monopoly", c: "MR = MC, price from demand.", h: chips(["Q = 20", "P = ₹60", "Profit ₹600"], "mi") },
        { t: "Price discrimination", c: "Higher price where demand is less elastic.", h: chips(["1st", "2nd", "3rd degree"], "ac") },
        { t: "Monopolistic competition and oligopoly", c: "Excess capacity; interdependence.", h: chips(["Tangency", "Kinked demand", "Cartels"], "hl") }]; },
      recap: ["Every firm maximises profit at MR = MC; a competitive firm sets P = MC and shuts down below min AVC", "A monopolist restricts output and charges P > MC; monopolistic competitors earn normal profit with excess capacity"],
      qc: [{ q: "A perfectly competitive firm should shut down in the short run when price falls below…", o: ["Minimum average variable cost", "Minimum average total cost", "Marginal revenue", "Average fixed cost"], a: 0, e: "Below min AVC it cannot even cover variable costs." },
        { q: "A discriminating monopolist charges a higher price in the market where demand is…", o: ["Less elastic", "More elastic", "Unit elastic", "Perfectly elastic"], a: 0, e: "Buyers there respond less to a higher price." }]
    },

    /* ---------------- MODULE 3: NATIONAL INCOME AND BUSINESS CYCLES ---------------- */
    {
      id: "3.1", mod: 3, ch: "Chapter 5, Unit 1", title: "National Income Accounting", time: "19 min", tool: "nia",
      outcomes: ["Explain the circular flow of income in two, three and four sector economies", "Define GDP, GNP, NDP, NNP at market prices and at factor cost, and GVA at basic prices", "Explain the value added, income and expenditure methods", "State the difficulties of measuring national income and its uses"],
      notes: `<p><b>National income</b> is the money value of all <b>final</b> goods and services produced by the normal residents of a country during a year. In the <b>circular flow</b>, households supply factors to firms and receive incomes, which they spend on firms' output; with a government (taxes, spending) and the rest of the world (exports, imports), there are <b>leakages</b> (saving, taxes, imports) and <b>injections</b> (investment, government spending, exports).</p>
<p style="margin-top:10px">Key aggregates: <b>GDP at market prices</b> is the value of final output produced <b>within the domestic territory</b>. <b>GNP</b> = GDP + <b>net factor income from abroad</b> (NFIA: factor income earned by residents abroad minus factor income earned by non-residents in the country). <b>Net</b> aggregates deduct <b>depreciation</b> (consumption of fixed capital): NDP = GDP − depreciation; NNP = GNP − depreciation. <b>Factor cost</b> = market price − <b>net indirect taxes</b> (indirect taxes − subsidies). <b>NNP at factor cost</b> is <b>national income</b>. India's official statistics also use <b>GVA at basic prices</b>: GVA at factor cost + production taxes − production subsidies; GDP = GVA at basic prices + product taxes − product subsidies.</p>
<p style="margin-top:10px"><b>Methods</b>: (1) the <b>value added (product) method</b> sums the value added by each sector (value of output − intermediate consumption), avoiding <b>double counting</b>; (2) the <b>income method</b> sums factor incomes: compensation of employees, rent, interest, profit and mixed income of the self-employed; (3) the <b>expenditure method</b> sums final expenditure: private final consumption (C), government final consumption (G), gross investment (I, fixed capital formation plus change in stocks) and <b>net exports</b> (X − M). Excluded items include <b>transfer payments</b> (pensions, scholarships), sale of second-hand goods (except dealers' commission), purely financial transactions (shares, bonds), and intermediate goods. <b>Personal income</b> and <b>personal disposable income</b> (after personal taxes) measure what households actually receive. <b>Real</b> GDP values output at constant (base-year) prices; the <b>GDP deflator</b> = nominal GDP ÷ real GDP × 100.</p>
<p style="margin-top:10px"><b>Difficulties</b>: the large non-monetised and informal sector, lack of reliable data, double counting, valuing depreciation and inventories, illegal activities, and household services that are not counted. National income figures are used to measure <b>growth</b> and living standards (per capita income), compare countries, plan policy and study the structure of the economy, though GDP does not measure welfare, inequality or environmental damage.</p>`,
      formula: "GNP = GDP + NFIA · NNP = GNP − depreciation · FC = MP − (indirect taxes − subsidies)<small>national income = NNP at factor cost · expenditure method: C + I + G + (X − M)</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Included or not?</h4>" + tbl(["Item", "In national income?"], [["Wages of a factory worker", "Yes"], ["Old-age pension from the government", "No (transfer payment)"], ["Sale of a used car (price)", "No; the dealer's commission is"], ["Purchase of shares", "No (financial transaction)"], ["Imputed rent of owner-occupied houses", "Yes"], ["Housework by family members", "No"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">A fictional economy (₹ crore): private consumption 6,000; government consumption 1,500; gross investment 2,000; exports 1,200; imports 1,400; depreciation 700; NFIA −100; indirect taxes 900; subsidies 200.</p>" +
          steps(["GDP at MP = 6,000 + 1,500 + 2,000 + (1,200 − 1,400) = 9,300", "GNP at MP = 9,300 + (−100) = 9,200", "NNP at MP = 9,200 − 700 = 8,500", "NNP at FC (national income) = 8,500 − (900 − 200) = 7,800"]);
      },
      use: ["Move between aggregates with three adjustments: NFIA (domestic ↔ national), depreciation (gross ↔ net), net indirect taxes (MP ↔ FC).", "Use value added, not the value of output, to avoid double counting.", "Mistake: including transfer payments in national income.", "Mistake: adding subsidies the wrong way: factor cost = market price − indirect taxes + subsidies."],
      walk: function () { return [
        { t: "Circular flow", c: "Income and spending move in a circle.", h: chips(["Leakages: S, T, M", "Injections: I, G, X"], "ac") },
        { t: "Three adjustments", c: "Domestic ↔ national, gross ↔ net, MP ↔ FC.", h: box("+ NFIA · − depreciation\n− (indirect taxes − subsidies)", "good") },
        { t: "Three methods", c: "They should give the same answer.", h: chips(["Value added", "Income", "Expenditure"], "ac") },
        { t: "What's left out", c: "Transfers, second-hand sales, shares.", h: chips(["Pensions ✗", "Used cars ✗", "Shares ✗"], "hl") },
        { t: "The answer", c: "National income = NNP at factor cost.", h: chips(["₹7,800 crore"], "mi") }]; },
      recap: ["GDP is domestic output; add NFIA for GNP, subtract depreciation for net, and net indirect taxes for factor cost", "Value added, income and expenditure methods all measure the same flow; transfers are excluded"],
      qc: [{ q: "NNP at factor cost is also called…", o: ["National income", "GDP at market prices", "Personal income", "GVA"], a: 0, e: "It is the sum of factor incomes earned by residents." },
        { q: "Which of these is included in national income?", o: ["Imputed rent of owner-occupied houses", "Old-age pensions", "Purchase of shares", "Sale of a second-hand car"], a: 0, e: "It is an imputed value of a service produced." }]
    },
    {
      id: "3.2", mod: 3, ch: "Chapter 5, Unit 2", title: "The Keynesian Theory of Determination of National Income", time: "19 min", tool: "multiplier",
      outcomes: ["Explain aggregate demand and its components", "Use the consumption and saving functions: APC, MPC, APS, MPS", "Find equilibrium income in two, three and four sector models", "Calculate the investment, government spending and tax multipliers, and explain the paradox of thrift and inflationary and deflationary gaps"],
      notes: `<p>Keynes argued that in the short run, with unused capacity, <b>aggregate demand</b> (AD) determines the levels of output and employment. In a two-sector economy, AD = C + I; with a government, AD = C + I + G; in an open economy, AD = C + I + G + (X − M). <b>Equilibrium income</b> is where <b>aggregate demand equals aggregate supply</b> (output, Y), or equivalently where planned <b>saving equals planned investment</b> (S = I in the two-sector model). Equilibrium may occur below full employment.</p>
<p style="margin-top:10px">The <b>consumption function</b> is C = a + bY, where <b>a</b> is autonomous consumption and <b>b</b> is the <b>marginal propensity to consume</b> (MPC = ΔC/ΔY, between 0 and 1). The <b>average propensity to consume</b> APC = C/Y falls as income rises. Since Y = C + S, the <b>saving function</b> is S = −a + (1 − b)Y, with MPC + MPS = 1 and APC + APS = 1. Investment is usually treated as <b>autonomous</b> (decided by the marginal efficiency of capital and the rate of interest, not by current income).</p>
<p style="margin-top:10px">In the two-sector model, Y = a + bY + I, so <b>Y* = (a + I) ÷ (1 − b)</b>. The <b>investment multiplier</b> k = ΔY/ΔI = 1/(1 − MPC) = 1/MPS: an increase in investment raises income by a multiple, because each round of spending becomes someone's income, part of which is spent again. With a lump-sum tax T, C = a + b(Y − T): the <b>government spending multiplier</b> = 1/(1 − b), the <b>tax multiplier</b> = −b/(1 − b), and the <b>balanced budget multiplier</b> (equal rises in G and T) = 1. With a proportional tax rate t, k = 1/(1 − b(1 − t)); in an open economy with a marginal propensity to import m, k = 1/(1 − b + m). The multiplier works in reverse too, and is weakened by leakages such as saving, taxes and imports.</p>
<p style="margin-top:10px">The <b>paradox of thrift</b>: if everyone tries to save more, AD falls, income falls, and total saving may not rise at all. A <b>deflationary (recessionary) gap</b> is the shortfall of AD below the level needed for full-employment output; it causes unemployment. An <b>inflationary gap</b> is the excess of AD over full-employment output; it causes rising prices.</p>`,
      formula: "Y* = (a + I) ÷ (1 − b) · k = 1/(1 − MPC) = 1/MPS<small>tax multiplier = −b/(1 − b) · balanced budget multiplier = 1 · open economy: 1/(1 − b + m)</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">MPC and the multiplier</h4>" + tbl(["MPC", "MPS", "Multiplier"], [["0.5", "0.5", "2"], ["0.75", "0.25", "4"], ["0.8", "0.2", "5"], ["0.9", "0.1", "10"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">A two-sector economy: C = 200 + 0.8Y (₹ crore) and autonomous investment I = 300.</p>" +
          steps(["Y* = (200 + 300) ÷ (1 − 0.8) = 500 ÷ 0.2 = ₹2,500 crore", "Check: C = 200 + 0.8 × 2,500 = 2,200; C + I = 2,500 = Y ✓; S = 2,500 − 2,200 = 300 = I ✓", "Multiplier k = 1/0.2 = 5", "If investment rises by ₹100 crore, income rises by 5 × 100 = ₹500 crore, to ₹3,000 crore"]);
      },
      use: ["Write down C, I, G, T and X − M, then solve Y = AD.", "Use the right multiplier for the change: spending, tax or balanced budget.", "Mistake: forgetting that MPC + MPS = 1.", "Mistake: using 1/MPC as the multiplier."],
      walk: function () { return [
        { t: "Aggregate demand", c: "C + I + G + (X − M).", h: chips(["C", "I", "G", "X − M"], "ac") },
        { t: "Consumption function", c: "C = a + bY.", h: chips(["MPC = b", "MPS = 1 − b"], "mi") },
        { t: "Equilibrium", c: "Y = AD, or S = I.", h: box("Y* = (200 + 300) ÷ 0.2 = 2,500", "good") },
        { t: "The multiplier", c: "k = 1 ÷ MPS.", h: chips(["MPC 0.8 → k = 5"], "ac") },
        { t: "Gaps", c: "Too little AD: unemployment. Too much: inflation.", h: chips(["Deflationary gap", "Inflationary gap"], "hl") }]; },
      recap: ["Equilibrium income is where AD equals output; with C = a + bY, Y* = (a + I)/(1 − b)", "The multiplier is 1/MPS; leakages weaken it; the balanced budget multiplier is 1"],
      qc: [{ q: "If MPC is 0.75, the investment multiplier is…", o: ["4", "0.75", "1.33", "3"], a: 0, e: "1 ÷ (1 − 0.75) = 4." },
        { q: "In the two-sector Keynesian model, equilibrium income is where…", o: ["Planned saving equals planned investment", "Consumption equals income", "Saving is zero", "Investment equals consumption"], a: 0, e: "Equivalently, AD = AS." }]
    },
    {
      id: "3.3", mod: 3, ch: "Chapter 6", title: "Business Cycles", time: "14 min", tool: "sort",
      tcfg: { d: "Is each indicator usually leading, coincident or lagging?", buckets: ["Leading", "Coincident", "Lagging"], items: [
        ["Stock market prices", "Leading", "Markets anticipate changes in profits."],
        ["New orders for capital goods", "Leading", "Orders come before production."],
        ["Building permits issued", "Leading", "Construction plans move before activity."],
        ["Industrial production", "Coincident", "It moves with the cycle."],
        ["Real GDP", "Coincident", "It measures current activity."],
        ["Employment in the formal sector", "Coincident", "Payrolls track current activity."],
        ["Unemployment duration", "Lagging", "Joblessness persists after recovery begins."],
        ["Bank lending rates", "Lagging", "Rates adjust after the economy has turned."],
        ["Inventory to sales ratio", "Lagging", "Stocks pile up or run down after sales change."]] },
      outcomes: ["Define a business cycle and describe its four phases", "List the features of business cycles", "Explain the main theories of business cycles", "Use leading, coincident and lagging indicators, and explain why cycles matter to business"],
      notes: `<p>A <b>business cycle</b> is a recurring pattern of <b>expansion and contraction</b> in aggregate economic activity (output, income, employment, prices) around its long-run trend. Cycles are <b>recurrent but not periodic</b>: they differ in length and depth.</p>
<p style="margin-top:10px">Its <b>phases</b>: (1) <b>expansion</b> (prosperity or boom): output, employment, incomes, investment, credit and prices rise; (2) <b>peak</b>: the upper turning point, where growth stops, capacity is fully used, input costs and interest rates are high and shortages appear; (3) <b>contraction</b> (recession, or a <b>depression</b> if it is severe and prolonged): output, employment, investment and demand fall, inventories pile up and firms cut back; (4) <b>trough</b>: the lowest point, with excess capacity and low interest rates, from which <b>recovery</b> begins. A <b>recession</b> is often described as at least two consecutive quarters of falling real GDP.</p>
<p style="margin-top:10px"><b>Features</b>: cycles affect almost all sectors together (they are <b>pervasive</b>); they are <b>cumulative</b> (each phase feeds itself); capital goods and durables fluctuate more than consumer non-durables; they spread across countries through trade and finance; and they are hard to predict.</p>
<p style="margin-top:10px"><b>Theories</b>: <b>internal (endogenous)</b> causes include fluctuations in <b>aggregate demand</b> (Keynes: changes in investment, magnified by the multiplier, with the <b>accelerator</b> adding to it), <b>monetary</b> factors (Hawtrey: expansion and contraction of bank credit), <b>innovations</b> (Schumpeter: waves of new products and methods), <b>psychological</b> factors (Pigou: waves of optimism and pessimism), and over- or under-investment. <b>External (exogenous)</b> causes include wars, pandemics, oil price shocks, technology shocks (the <b>real business cycle</b> view), changes in government policy, and even weather (Jevons' sunspot theory linked cycles to harvests). <b>Indicators</b> help businesses track the cycle: <b>leading</b> indicators change before the economy does, <b>coincident</b> ones move with it, and <b>lagging</b> ones change after it.</p>
<p style="margin-top:10px">For business, the cycle affects demand, prices, costs, credit and investment decisions. Firms plan inventory, capacity, hiring and financing around it, and governments respond with <b>counter-cyclical</b> fiscal and monetary policy.</p>`,
      formula: "Expansion → Peak → Contraction → Trough → (recovery) → Expansion<small>indicators: leading (stock prices, orders) · coincident (GDP, output) · lagging (unemployment duration, lending rates)</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Phases at a glance</h4>" + tbl(["Phase", "Output and jobs", "Prices and interest", "Business mood"], [["Expansion", "Rising", "Rising", "Optimistic"], ["Peak", "At capacity", "High", "Overconfident"], ["Contraction", "Falling", "Falling", "Pessimistic"], ["Trough", "Lowest", "Low", "Bottoming out"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Orbit Motors (fictional) sees these signals. Where is the economy heading?</p>" +
          tbl(["Signal", "Type", "Reading"], [["Share prices up 12% over six months", "Leading", "Expansion ahead"], ["New orders for trucks rising", "Leading", "Expansion ahead"], ["Industrial output just started rising", "Coincident", "Recovery under way"], ["Unemployment still high", "Lagging", "Will fall later"]]) +
          "<p class=\"muted small\" style=\"margin-top:10px\">Leading indicators point up while lagging ones are still weak: the economy is moving out of the trough. Orbit Motors should start building stock and hiring.</p>";
      },
      use: ["Read leading indicators to anticipate turning points.", "Match the theory to its author: Hawtrey (money), Schumpeter (innovation), Pigou (psychology), Keynes (demand).", "Mistake: calling cycles periodic; they recur but irregularly.", "Mistake: treating unemployment as a leading indicator; it usually lags."],
      walk: function () { return [
        { t: "What is a business cycle?", c: "Recurring ups and downs in activity.", h: chips(["Recurrent", "Not periodic"], "ac") },
        { t: "Four phases", c: "Expansion, peak, contraction, trough.", h: box("↗ Expansion → Peak\n↘ Contraction → Trough", "good") },
        { t: "Why do they happen?", c: "Internal and external causes.", h: chips(["Demand (Keynes)", "Credit (Hawtrey)", "Innovation (Schumpeter)", "Mood (Pigou)"], "ac") },
        { t: "Indicators", c: "Leading, coincident, lagging.", h: chips(["Stock prices", "GDP", "Unemployment"], "mi") },
        { t: "For business", c: "Plan capacity, stock and finance around the cycle.", h: chips(["Counter-cyclical policy"], "ac") }]; },
      recap: ["Business cycles have four phases and are recurrent but not periodic", "Theories stress demand, credit, innovation, psychology or external shocks; indicators help spot turning points"],
      qc: [{ q: "Schumpeter explained business cycles mainly by…", o: ["Innovations", "Sunspots", "Bank credit", "Waves of optimism and pessimism"], a: 0, e: "Clusters of innovations start expansions." },
        { q: "Which is usually a leading indicator?", o: ["Stock market prices", "Unemployment duration", "Real GDP", "Bank lending rates"], a: 0, e: "Share prices anticipate future profits." }]
    },

    /* ---------------- MODULE 4: PUBLIC FINANCE AND MONEY ---------------- */
    {
      id: "4.1", mod: 4, ch: "Chapter 7, Unit 1", title: "Fiscal Functions and Centre-State Finance", time: "15 min", tool: "sort",
      tcfg: { d: "Which fiscal function (Musgrave) does each government action mainly serve?", buckets: ["Allocation", "Distribution", "Stabilisation"], items: [
        ["Building national highways", "Allocation", "Providing a public good the market under-supplies."],
        ["Progressive income-tax rates", "Distribution", "Higher rates on higher incomes reduce inequality."],
        ["Raising public spending in a recession", "Stabilisation", "Counter-cyclical spending supports demand and employment."],
        ["Free food grains for poor households", "Distribution", "A transfer to lower-income groups."],
        ["Funding defence and the police", "Allocation", "Pure public goods."],
        ["Cutting expenditure when inflation is high", "Stabilisation", "Reducing excess demand."],
        ["Taxing tobacco to discourage its use", "Allocation", "Correcting a negative externality changes resource use."]] },
      outcomes: ["Explain the role of government in an economy and Musgrave's three fiscal functions", "Describe the division of taxing and spending powers between the Centre and the States", "Explain the role of the Finance Commission and the sharing of central taxes", "Describe grants and other transfers to States and local bodies"],
      notes: `<p>Markets alone may not provide public goods, may produce an unequal distribution of income and can be unstable. Richard Musgrave classified the <b>fiscal functions</b> of government into three: the <b>allocation</b> function (providing public goods and correcting market failures, so that resources are used for the right mix of goods); the <b>distribution</b> function (making the distribution of income and wealth fairer through progressive taxes, transfers and subsidies); and the <b>stabilisation</b> function (maintaining high employment, stable prices and steady growth through fiscal policy). A fourth role, <b>economic growth</b>, is often added for developing countries.</p>
<p style="margin-top:10px">India is a <b>federation</b> in which the Constitution divides subjects between the Union, State and Concurrent Lists (Seventh Schedule). Major central taxes include income tax (other than on agricultural income), corporation tax, customs and central excise on some goods; States levy taxes such as stamp duty, taxes on alcohol for human consumption and on land; since 2017 the <b>Goods and Services Tax</b> has replaced most indirect taxes on goods and services, with the Centre levying CGST and IGST and the States SGST, under the guidance of the <b>GST Council</b>. Because States have large spending responsibilities (health, police, agriculture, education) but fewer buoyant taxes, there is a <b>vertical imbalance</b>; differences in capacity among States create a <b>horizontal imbalance</b>.</p>
<p style="margin-top:10px">The <b>Finance Commission</b>, set up by the President every five years under <b>Article 280</b>, recommends the share of the divisible pool of central taxes to be given to the States (<b>vertical devolution</b>), how it is divided among States (<b>horizontal devolution</b>, using criteria such as population, area, income distance and forest cover), and principles for <b>grants-in-aid</b> under <b>Article 275</b>, including grants to local bodies and for disaster management. Other transfers include centrally sponsored schemes and specific-purpose grants.</p>`,
      formula: "Musgrave: allocation · distribution · stabilisation<small>Finance Commission: Article 280 · grants-in-aid: Article 275 · GST Council guides GST rates</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Fiscal federalism in brief</h4>" + tbl(["Issue", "Meaning"], [["Vertical imbalance", "States' spending duties exceed their own revenue"], ["Horizontal imbalance", "States differ in revenue capacity and needs"], ["Vertical devolution", "Share of central taxes given to all States together"], ["Horizontal devolution", "How that share is divided among the States"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Classify the measures in a fictional State budget:</p>" +
          tbl(["Measure", "Function"], [["Free bicycles for girl students from poor families", "Distribution"], ["A new public hospital", "Allocation"], ["Bringing forward road projects during a slowdown", "Stabilisation"], ["A higher tax on plastic bags", "Allocation (correcting an externality)"]]);
      },
      use: ["Link each policy to one of Musgrave's functions by its main purpose.", "Know the articles: 280 (Finance Commission) and 275 (grants-in-aid).", "Mistake: confusing vertical and horizontal imbalance.", "Mistake: thinking the Finance Commission decides GST rates; the GST Council does."],
      walk: function () { return [
        { t: "Why government?", c: "Markets fail in important ways.", h: chips(["Public goods", "Inequality", "Instability"], "ac") },
        { t: "Three functions", c: "Musgrave's classification.", h: chips(["Allocation", "Distribution", "Stabilisation"], "ac") },
        { t: "Fiscal federalism", c: "Centre and States share powers.", h: box("Union List · State List · Concurrent List", "good") },
        { t: "The imbalance", c: "States spend more than they raise.", h: chips(["Vertical", "Horizontal"], "hl") },
        { t: "Finance Commission", c: "Shares central taxes; recommends grants.", h: chips(["Art. 280", "Art. 275"], "mi") }]; },
      recap: ["Government has allocation, distribution and stabilisation functions", "The Finance Commission (Art. 280) recommends how central taxes are shared with States, and grants (Art. 275)"],
      qc: [{ q: "Progressive taxation mainly serves the…", o: ["Distribution function", "Allocation function", "Stabilisation function", "Regulatory function"], a: 0, e: "It reduces inequality." },
        { q: "The Finance Commission is constituted under Article…", o: ["280", "275", "112", "356"], a: 0, e: "Every five years, by the President." }]
    },
    {
      id: "4.2", mod: 4, ch: "Chapter 7, Unit 2", title: "Market Failure and Government Intervention", time: "16 min", tool: "sort",
      tcfg: { d: "What kind of market failure is shown?", buckets: ["Public good", "Negative externality", "Positive externality", "Information failure", "Market power"], items: [
        ["Street lighting: no one can be excluded and one person's use does not reduce another's", "Public good", "Non-excludable and non-rival."],
        ["A factory dumps waste into a river used by fishermen", "Negative externality", "A cost imposed on third parties."],
        ["A neighbour's flower garden that everyone enjoys", "Positive externality", "A benefit to third parties that is not paid for."],
        ["A used-car seller knows the car's defects but the buyer does not", "Information failure", "Asymmetric information (the 'market for lemons')."],
        ["A single firm controls a medicine and charges a very high price", "Market power", "Monopoly restricts output and raises price."],
        ["Vaccination protects others as well as the person vaccinated", "Positive externality", "Social benefit exceeds private benefit."],
        ["People with health risks are more likely to buy insurance", "Information failure", "Adverse selection."]] },
      outcomes: ["Define market failure and its main causes", "Explain public goods, the free-rider problem, and merit and demerit goods", "Explain externalities and asymmetric information (adverse selection, moral hazard)", "Evaluate government responses: taxes, subsidies, regulation, provision, price controls and tradable permits"],
      notes: `<p><b>Market failure</b> occurs when markets left to themselves do not allocate resources efficiently. Its main sources are: <b>market power</b> (monopoly and oligopoly restrict output and raise price); <b>externalities</b>; <b>public goods</b>; and <b>incomplete or asymmetric information</b>.</p>
<p style="margin-top:10px"><b>Externalities</b> are costs or benefits that fall on third parties who are not part of the transaction. A <b>negative externality</b> (pollution, congestion, passive smoking) means social cost exceeds private cost, so the market <b>over-produces</b>. A <b>positive externality</b> (education, vaccination, research) means social benefit exceeds private benefit, so the market <b>under-produces</b>. Externalities can arise in production or consumption.</p>
<p style="margin-top:10px">A <b>pure public good</b> is <b>non-rival</b> (one person's use does not reduce another's) and <b>non-excludable</b> (people cannot be stopped from using it), such as national defence or street lighting. Because people can enjoy it without paying (the <b>free-rider problem</b>), markets under-supply it, and the government provides it from taxes. <b>Quasi-public goods</b> have some of these features (roads, parks). <b>Merit goods</b> (education, health) are those the government thinks people under-consume; <b>demerit goods</b> (tobacco, alcohol) are those it thinks people over-consume. <b>Asymmetric information</b> causes <b>adverse selection</b> (before a deal: high-risk people seek insurance; bad used cars drive out good ones) and <b>moral hazard</b> (after a deal: insured people take less care).</p>
<p style="margin-top:10px"><b>Government responses</b>: <b>Pigovian taxes</b> on negative externalities and <b>subsidies</b> for positive ones; <b>regulation</b> (emission standards, bans, zoning); <b>tradable pollution permits</b> (cap and trade); <b>direct provision</b> of public and merit goods; <b>information</b> requirements (labelling, disclosure); <b>competition law</b> against abuse of market power (the Competition Commission of India); and <b>price controls</b> (maximum or minimum prices). Intervention can itself fail (<b>government failure</b>) through poor information, high costs, delays or political influence.</p>`,
      formula: "Negative externality: social cost > private cost → over-production · Positive: social benefit > private benefit → under-production<small>public good: non-rival + non-excludable → free riders</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Kinds of goods</h4>" + tbl(["", "Excludable", "Non-excludable"], [["Rival", "Private goods (food, clothes)", "Common resources (fish in the sea)"], ["Non-rival", "Club goods (cable TV, a toll road)", "Public goods (defence, street lights)"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">A fictional factory makes a chemical. Each tonne costs the firm ₹8,000, but causes ₹2,000 of pollution damage downstream. The market price is ₹8,000.</p>" +
          steps(["Private marginal cost = ₹8,000; social marginal cost = ₹8,000 + ₹2,000 = ₹10,000", "The firm produces where price = private cost, ignoring the ₹2,000 damage, so it over-produces", "A Pigovian tax of ₹2,000 a tonne makes the firm face the full social cost", "Output falls to the socially efficient level, and the tax revenue can fund the clean-up"]);
      },
      use: ["Identify who bears the cost or receives the benefit outside the transaction.", "Match the remedy to the failure: tax for negative, subsidy for positive, provision for public goods.", "Mistake: calling any government-provided good a public good.", "Mistake: confusing adverse selection (before) with moral hazard (after)."],
      walk: function () { return [
        { t: "Market failure", c: "Markets misallocate resources.", h: chips(["Market power", "Externalities", "Public goods", "Information"], "ac") },
        { t: "Externalities", c: "Costs or benefits to third parties.", h: chips(["Negative → too much", "Positive → too little"], "hl") },
        { t: "Public goods", c: "Non-rival, non-excludable.", h: box("Free riders → the market under-supplies", "good") },
        { t: "Information", c: "One side knows more.", h: chips(["Adverse selection", "Moral hazard"], "ac") },
        { t: "Remedies", c: "Taxes, subsidies, rules, permits, provision.", h: chips(["Pigovian tax", "Subsidy", "Regulation", "Cap and trade"], "mi") }]; },
      recap: ["Markets fail through market power, externalities, public goods and information problems", "Governments respond with taxes, subsidies, regulation, provision and permits, but can fail too"],
      qc: [{ q: "A good that is non-rival and non-excludable is a…", o: ["Pure public good", "Merit good", "Private good", "Club good"], a: 0, e: "Defence and street lighting are examples." },
        { q: "A tax to correct a negative externality is called a…", o: ["Pigovian tax", "Progressive tax", "Lump-sum tax", "Direct tax"], a: 0, e: "Named after A.C. Pigou." }]
    },
    {
      id: "4.3", mod: 4, ch: "Chapter 7, Unit 3", title: "The Process of Budget Making: Sources of Revenue, Expenditure Management and Public Debt", time: "17 min", tool: "deficit",
      outcomes: ["Explain the Union Budget, its parts and the stages of budget making", "Classify receipts into revenue and capital, tax and non-tax", "Calculate revenue, effective revenue, fiscal and primary deficits", "Explain public debt and expenditure management, including the FRBM framework"],
      notes: `<p>The <b>budget</b> (the 'Annual Financial Statement' under <b>Article 112</b> of the Constitution) is the government's estimate of its receipts and expenditure for a financial year (1 April to 31 March). It is presented in Parliament, passed through discussion and voting on demands for grants, the <b>Appropriation Bill</b> (authorising withdrawals from the Consolidated Fund) and the <b>Finance Bill</b> (giving effect to tax proposals). The process involves the Ministry of Finance preparing estimates with ministries, and Parliament's approval; a <b>vote on account</b> may allow spending before the full budget is passed.</p>
<p style="margin-top:10px">The budget has a <b>revenue account</b> and a <b>capital account</b>. <b>Revenue receipts</b> neither create liabilities nor reduce assets: <b>tax revenue</b> (direct taxes such as income and corporation tax; indirect taxes such as GST, customs, excise) and <b>non-tax revenue</b> (interest and dividends received, fees, fines, profits of public enterprises). <b>Capital receipts</b> create liabilities or reduce assets: <b>borrowings</b> and other liabilities, recovery of loans, and <b>disinvestment</b> proceeds; recoveries of loans and disinvestment are <b>non-debt capital receipts</b>. <b>Revenue expenditure</b> does not create assets (salaries, interest payments, subsidies, pensions, grants to States); <b>capital expenditure</b> creates assets or reduces liabilities (roads, machinery, loans given, repayment of debt).</p>
<p style="margin-top:10px">Measures of <b>deficit</b>: <b>revenue deficit</b> = revenue expenditure − revenue receipts; <b>effective revenue deficit</b> = revenue deficit − grants for creation of capital assets; <b>fiscal deficit</b> = total expenditure − (revenue receipts + non-debt capital receipts), which equals the government's <b>borrowing</b> requirement; <b>primary deficit</b> = fiscal deficit − interest payments, showing borrowing for current needs other than interest. The <b>Fiscal Responsibility and Budget Management (FRBM) Act, 2003</b> set targets for reducing these deficits and for debt; the targets have been revised over time.</p>
<p style="margin-top:10px"><b>Public debt</b> is borrowing by the government: <b>internal</b> (market loans, treasury bills, small savings) and <b>external</b>. Borrowing finances deficits and development, but rising debt increases interest payments, can <b>crowd out</b> private investment, and may create a debt trap. <b>Expenditure management</b> aims to spend efficiently and in line with priorities, using tools such as outcome budgets, zero-based budgeting and controls on revenue expenditure.</p>`,
      formula: "Fiscal deficit = total expenditure − (revenue receipts + non-debt capital receipts)<small>revenue deficit = revenue exp. − revenue receipts · primary deficit = fiscal deficit − interest payments</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Revenue or capital?</h4>" + tbl(["Item", "Classification"], [["GST collected", "Revenue receipt (tax)"], ["Dividend from a public sector bank", "Revenue receipt (non-tax)"], ["Disinvestment proceeds", "Capital receipt (non-debt)"], ["Market borrowing", "Capital receipt (debt)"], ["Interest paid on debt", "Revenue expenditure"], ["Building a new airport", "Capital expenditure"], ["Repayment of a loan", "Capital expenditure"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">A fictional budget (₹ crore): revenue receipts 26,000; revenue expenditure 33,000 (including interest 9,000); grants for creation of capital assets 3,000; capital expenditure 10,000; recovery of loans 300; disinvestment 700.</p>" +
          steps(["Revenue deficit = 33,000 − 26,000 = 7,000", "Effective revenue deficit = 7,000 − 3,000 = 4,000", "Fiscal deficit = (33,000 + 10,000) − (26,000 + 300 + 700) = 43,000 − 27,000 = 16,000", "Primary deficit = 16,000 − 9,000 = 7,000"]);
      },
      use: ["Put every item into one of four boxes: revenue or capital, receipt or expenditure.", "Use non-debt capital receipts (not borrowing) when computing the fiscal deficit.", "Mistake: counting borrowing as a receipt that reduces the fiscal deficit; borrowing is the fiscal deficit.", "Mistake: treating disinvestment as a revenue receipt."],
      walk: function () { return [
        { t: "The budget", c: "Annual Financial Statement (Art. 112).", h: chips(["Appropriation Bill", "Finance Bill"], "ac") },
        { t: "Receipts", c: "Revenue (tax, non-tax) and capital.", h: chips(["Tax", "Non-tax", "Borrowing", "Disinvestment"], "ac") },
        { t: "Expenditure", c: "Revenue (no assets) and capital (assets).", h: chips(["Salaries, interest", "Roads, loans"], function (x, i) { return i ? "mi" : "hl"; }) },
        { t: "Four deficits", c: "Each tells a different story.", h: box("RD 7,000 · ERD 4,000\nFD 16,000 · PD 7,000", "good") },
        { t: "Public debt", c: "Borrowing has costs.", h: chips(["Interest burden", "Crowding out", "FRBM targets"], "hl") }]; },
      recap: ["Receipts and expenditure are split into revenue and capital accounts", "Fiscal deficit is total borrowing; primary deficit removes interest; revenue deficit shows borrowing for current spending"],
      qc: [{ q: "Fiscal deficit minus interest payments equals the…", o: ["Primary deficit", "Revenue deficit", "Effective revenue deficit", "Budget deficit"], a: 0, e: "It shows borrowing for needs other than interest." },
        { q: "Disinvestment proceeds are a…", o: ["Non-debt capital receipt", "Revenue receipt", "Debt capital receipt", "Revenue expenditure"], a: 0, e: "They reduce the government's assets without creating a liability." }]
    },
    {
      id: "4.4", mod: 4, ch: "Chapter 7, Unit 4", title: "Fiscal Policy", time: "15 min", tool: "cases",
      tcfg: { d: "Choose the fiscal policy response or effect.", cases: [
        { q: "The economy is in a deep recession with high unemployment. The right fiscal stance is…", o: ["Expansionary: raise spending and/or cut taxes", "Contractionary: cut spending and raise taxes", "Neutral: balance the budget at once", "Raise the CRR"], a: 0, e: "Expansionary fiscal policy raises aggregate demand." },
        { q: "Demand is running ahead of capacity and inflation is high. The government should…", o: ["Reduce spending or raise taxes", "Increase transfers", "Cut income tax", "Increase capital spending sharply"], a: 0, e: "Contractionary fiscal policy closes an inflationary gap." },
        { q: "Heavy government borrowing pushes up interest rates and reduces private investment. This is called…", o: ["Crowding out", "The multiplier effect", "The paradox of thrift", "Fiscal drag"], a: 0, e: "Public borrowing competes with private borrowers for funds." },
        { q: "Unemployment benefits rise automatically in a downturn without any new decision. They act as…", o: ["Automatic (built-in) stabilisers", "Discretionary fiscal policy", "Monetary policy", "Supply-side policy"], a: 0, e: "Progressive taxes and transfers stabilise income automatically." },
        { q: "Which is NOT an instrument of fiscal policy?", o: ["Changing the repo rate", "Public expenditure", "Taxation", "Public borrowing"], a: 0, e: "The repo rate is a monetary policy tool of the RBI." }] },
      outcomes: ["Define fiscal policy and its objectives", "Explain its instruments: government spending, taxes, public debt and budget balance", "Distinguish expansionary from contractionary policy, and discretionary from automatic stabilisers", "Explain the limitations of fiscal policy, including crowding out and time lags"],
      notes: `<p><b>Fiscal policy</b> is the use of government <b>spending</b>, <b>taxation</b> and <b>borrowing</b> to influence aggregate demand and the economy. Its <b>objectives</b> include full employment, price stability, economic growth, a fairer distribution of income, balance of payments stability, and the efficient allocation of resources.</p>
<p style="margin-top:10px"><b>Instruments</b>: <b>government expenditure</b> (consumption, investment and transfers); <b>taxes</b> (direct and indirect, with changes in rates and structure); <b>public debt</b> (borrowing and its management); and the overall <b>budget</b> stance (deficit, balanced or surplus). <b>Expansionary</b> (stimulative) policy raises spending and/or cuts taxes to increase aggregate demand in a recession, usually increasing the deficit. <b>Contractionary</b> policy cuts spending and/or raises taxes to reduce excess demand and inflation. Changes made by deliberate decision are <b>discretionary</b>; features such as progressive taxes and unemployment benefits, which change automatically with income, are <b>automatic stabilisers</b>.</p>
<p style="margin-top:10px">Fiscal policy works through the <b>multiplier</b>, but faces <b>limitations</b>: <b>time lags</b> (recognition, decision and implementation lags; budgets take time to pass), <b>crowding out</b> (government borrowing raises interest rates and reduces private investment), difficulties in forecasting, political pressures that make spending hard to reverse, the large informal sector which taxes do not reach, rising <b>public debt</b> and interest burden, and offsetting behaviour by households that expect higher future taxes. Fiscal and <b>monetary</b> policy are most effective when they are coordinated.</p>`,
      formula: "Expansionary: G ↑ and/or T ↓ → AD ↑ · Contractionary: G ↓ and/or T ↑ → AD ↓<small>limitations: lags · crowding out · debt · forecasting</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Fiscal vs monetary policy</h4>" + tbl(["Basis", "Fiscal policy", "Monetary policy"], [["Who", "Government (Ministry of Finance)", "Central bank (RBI)"], ["Tools", "Spending, taxes, borrowing", "Repo rate, CRR, SLR, OMOs"], ["Works through", "Directly on AD", "Money supply, credit and interest rates"], ["Speed of decision", "Slower (Parliament)", "Faster (MPC meetings)"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">A fictional economy has a deflationary gap of ₹400 crore, and MPC is 0.75.</p>" +
          steps(["Spending multiplier = 1 ÷ (1 − 0.75) = 4", "Extra government spending needed = 400 ÷ 4 = ₹100 crore", "Tax multiplier = −0.75 ÷ 0.25 = −3, so a tax cut of 400 ÷ 3 ≈ ₹133 crore would be needed instead", "A spending increase closes the gap with a smaller change in the budget."]);
      },
      use: ["Match the stance to the problem: expansionary for recession, contractionary for inflation.", "Use the multiplier to size a fiscal response.", "Mistake: listing the repo rate or CRR as fiscal tools.", "Mistake: ignoring crowding out when borrowing is large."],
      walk: function () { return [
        { t: "What is fiscal policy?", c: "Spending, taxes and borrowing.", h: chips(["G", "T", "Debt"], "ac") },
        { t: "Two directions", c: "Expansionary or contractionary.", h: chips(["Recession → expand", "Inflation → contract"], function (x, i) { return i ? "hl" : "mi"; }) },
        { t: "Automatic stabilisers", c: "Work without new decisions.", h: chips(["Progressive tax", "Unemployment benefits"], "ac") },
        { t: "Sizing it", c: "Gap ÷ multiplier.", h: box("₹400 crore gap ÷ 4 = ₹100 crore of spending", "good") },
        { t: "Limits", c: "Lags, crowding out, debt.", h: chips(["Time lags", "Crowding out", "Debt"], "hl") }]; },
      recap: ["Fiscal policy uses spending, taxes and borrowing to manage demand", "It is limited by time lags, crowding out and debt; automatic stabilisers help"],
      qc: [{ q: "In a recession, an expansionary fiscal policy would…", o: ["Increase government spending or cut taxes", "Raise taxes", "Reduce spending", "Increase the CRR"], a: 0, e: "It raises aggregate demand." },
        { q: "Crowding out refers to…", o: ["Government borrowing reducing private investment", "Imports replacing domestic goods", "Taxes reducing consumption", "Inflation reducing saving"], a: 0, e: "Higher interest rates discourage private borrowers." }]
    },
    {
      id: "4.5", mod: 4, ch: "Chapter 8, Unit 1", title: "The Concept of Money Demand: Important Theories", time: "17 min", tool: "qtm",
      outcomes: ["Define money and its functions", "Explain the quantity theory of money (Fisher) and the Cambridge cash balance approach", "Explain Keynes' liquidity preference theory and its three motives", "Outline the post-Keynesian theories: Baumol–Tobin and Friedman"],
      notes: `<p><b>Money</b> is anything generally accepted as a means of payment. Its <b>functions</b> are <b>primary</b> (medium of exchange, measure of value or unit of account), <b>secondary</b> (store of value, standard of deferred payments) and <b>contingent</b> (basis of credit, a measure of liquidity). Modern money is <b>fiat money</b>, accepted because of government decree and trust, together with bank deposits. The <b>demand for money</b> is the desire to hold wealth in the form of money (liquid balances) rather than other assets.</p>
<p style="margin-top:10px"><b>Fisher's quantity theory</b>: <b>MV = PT</b>, where M is the money supply, V its velocity of circulation (how many times a unit of money is spent in a period), P the price level and T the volume of transactions. With V and T assumed constant in the short run, the price level changes in proportion to the money supply. Including bank money: MV + M'V' = PT. The theory treats money mainly as a medium of exchange.</p>
<p style="margin-top:10px">The <b>Cambridge cash balance approach</b> (Marshall, Pigou, Keynes' early work) emphasises money as a store of value: people want to hold a fraction <b>k</b> of their money income as cash, so <b>Md = kPY</b>. Here k = 1/V. <b>Keynes' liquidity preference theory</b> says people hold money for three motives: the <b>transactions</b> motive (for day-to-day spending, depending on income), the <b>precautionary</b> motive (for emergencies, also depending on income) and the <b>speculative</b> motive (to avoid capital losses on bonds when interest rates are expected to rise; it varies <b>inversely</b> with the rate of interest). At a very low interest rate, the speculative demand becomes perfectly elastic: the <b>liquidity trap</b>, in which monetary policy cannot lower rates further.</p>
<p style="margin-top:10px"><b>Post-Keynesian</b> theories: <b>Baumol and Tobin</b> applied inventory analysis to transactions demand, which also depends on the interest rate and the cost of converting bonds to cash (the 'square root' rule); <b>Tobin</b> also treated speculative demand as portfolio choice between risky bonds and safe money. <b>Friedman's</b> modern quantity theory treats money as one form of wealth, with demand depending on permanent income and the returns on other assets.</p>`,
      formula: "Fisher: MV = PT · Cambridge: Md = kPY (k = 1/V)<small>Keynes: transactions + precautionary (income) + speculative (interest rate, inverse)</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Keynes' three motives</h4>" + tbl(["Motive", "Why hold money", "Depends on"], [["Transactions", "Daily spending", "Income"], ["Precautionary", "Unforeseen needs", "Income"], ["Speculative", "Wait for better bond prices", "Interest rate (inversely)"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">In a fictional economy, M = ₹5,000 crore, V = 4 and T = 10,000 crore units.</p>" +
          steps(["MV = PT → P = (5,000 × 4) ÷ 10,000 = 2", "If M doubles to ₹10,000 crore with V and T unchanged, P = (10,000 × 4) ÷ 10,000 = 4: prices double", "Cambridge version: k = 1/V = 0.25 → people hold a quarter of money income as cash", "With nominal income PY = ₹20,000 crore, Md = 0.25 × 20,000 = ₹5,000 crore = M ✓"]);
      },
      use: ["Use MV = PT for 'what happens to prices if money supply changes' questions.", "Remember that k and V are reciprocals.", "Mistake: linking the speculative motive to income; it depends on the interest rate.", "Mistake: assuming velocity never changes; it is constant only by assumption."],
      walk: function () { return [
        { t: "What money does", c: "Exchange, measure, store, defer.", h: chips(["Medium of exchange", "Unit of account", "Store of value"], "ac") },
        { t: "Fisher", c: "MV = PT.", h: box("M doubles, V and T fixed → P doubles", "good") },
        { t: "Cambridge", c: "Md = kPY.", h: chips(["k = 1/V"], "mi") },
        { t: "Keynes", c: "Three motives.", h: chips(["Transactions", "Precautionary", "Speculative"], "ac") },
        { t: "Liquidity trap", c: "Rates too low to fall further.", h: chips(["Speculative demand → ∞"], "hl") }]; },
      recap: ["Fisher: MV = PT; Cambridge: Md = kPY with k = 1/V", "Keynes adds speculative demand, inversely related to the interest rate, and the liquidity trap"],
      qc: [{ q: "In Keynes' theory, the speculative demand for money depends on…", o: ["The rate of interest (inversely)", "Income (directly)", "The price level", "Velocity"], a: 0, e: "When rates are expected to rise, people hold money to avoid capital losses on bonds." },
        { q: "In the Cambridge equation Md = kPY, k is…", o: ["The reciprocal of the velocity of money", "The money multiplier", "The MPC", "The interest rate"], a: 0, e: "k = 1/V." }]
    },
    {
      id: "4.6", mod: 4, ch: "Chapter 8, Unit 2", title: "The Concept of Money Supply", time: "16 min", tool: "mmult",
      outcomes: ["Define money supply and the RBI's measures: M0, M1, M2, M3 and M4", "Explain high-powered money (reserve money)", "Explain the money multiplier and how banks create credit", "Identify the determinants of money supply"],
      notes: `<p>The <b>money supply</b> is the total stock of money held by the <b>public</b> (households and firms, excluding the government and the banking system) at a point in time. The RBI publishes several measures. <b>Reserve money (M0)</b> = currency in circulation + bankers' deposits with the RBI + other deposits with the RBI. <b>Narrow money (M1)</b> = currency with the public + demand deposits with banks + other deposits with the RBI. <b>M2</b> = M1 + savings deposits with post office savings banks. <b>Broad money (M3)</b> = M1 + time deposits with banks, the most widely used measure. <b>M4</b> = M3 + all deposits with post office savings banks (excluding National Savings Certificates). Liquidity falls from M1 to M4.</p>
<p style="margin-top:10px"><b>High-powered money</b> (H, the monetary base, equal to reserve money) is created by the RBI and the government. It is called high-powered because each unit of it supports several units of money supply through the banking system. Banks keep only a fraction of deposits as reserves (the <b>cash reserve ratio</b>, CRR, with the RBI, plus excess reserves) and lend the rest; loans are redeposited and lent again, so a new deposit creates a multiple expansion of deposits (<b>credit creation</b>).</p>
<p style="margin-top:10px">The <b>money multiplier</b> links money supply to the base: M = m × H. In the simple case with no cash leakage, the <b>deposit multiplier</b> = 1/r, where r is the reserve ratio. Allowing for the public's <b>currency-deposit ratio</b> c, the multiplier is <b>m = (1 + c) ÷ (c + r)</b>, where r includes required and excess reserves. The multiplier is larger when c and r are smaller.</p>
<p style="margin-top:10px"><b>Determinants</b> of money supply: the size of the <b>monetary base</b> (RBI's purchases of government securities and foreign exchange, lending to banks and the government); the <b>reserve requirements</b> (CRR) and banks' excess reserves; the public's preference for <b>currency</b>; the demand for <b>credit</b> and banks' willingness to lend; and the interest rate.</p>`,
      formula: "M3 = M1 + time deposits · M = m × H · m = (1 + c)/(c + r)<small>simple deposit multiplier = 1/r</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Measures of money (RBI)</h4>" + tbl(["Measure", "Components"], [["M0 (reserve money)", "Currency in circulation + bankers' deposits with RBI + other deposits with RBI"], ["M1 (narrow)", "Currency with public + demand deposits + other deposits with RBI"], ["M2", "M1 + savings deposits of post office savings banks"], ["M3 (broad)", "M1 + time deposits with banks"], ["M4", "M3 + total post office deposits (excluding NSCs)"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">A fictional economy has high-powered money of ₹2,000 crore, a currency-deposit ratio of 0.2 and a reserve ratio of 0.1.</p>" +
          steps(["m = (1 + 0.2) ÷ (0.2 + 0.1) = 1.2 ÷ 0.3 = 4", "Money supply M = 4 × 2,000 = ₹8,000 crore", "If the reserve ratio falls to 0.05: m = 1.2 ÷ 0.25 = 4.8 → M = ₹9,600 crore", "With no cash leakage (c = 0) and r = 0.1, the simple deposit multiplier would be 1/0.1 = 10"]);
      },
      use: ["Use M3 when a question says 'broad money'.", "Lower reserve ratios or currency holdings raise the multiplier.", "Mistake: including inter-bank deposits or government deposits in money supply.", "Mistake: confusing reserve money (M0) with narrow money (M1)."],
      walk: function () { return [
        { t: "Money supply", c: "Money held by the public.", h: chips(["Not government", "Not banks"], "ac") },
        { t: "The measures", c: "From M0 to M4.", h: box("M1 = currency + demand deposits + other deposits\nM3 = M1 + time deposits", "good") },
        { t: "High-powered money", c: "The base the RBI controls.", h: chips(["H = M0"], "mi") },
        { t: "The multiplier", c: "(1 + c) ÷ (c + r).", h: chips(["1.2 ÷ 0.3 = 4"], "ac") },
        { t: "Determinants", c: "Base, reserves, currency preference.", h: chips(["CRR", "Currency ratio", "Credit demand"], "ac") }]; },
      recap: ["M1 is narrow money; M3 (broad money) adds time deposits; M0 is the monetary base", "Money supply = multiplier × high-powered money; m = (1 + c)/(c + r)"],
      qc: [{ q: "Broad money (M3) is…", o: ["M1 + time deposits with banks", "M1 + post office savings deposits", "Currency + bankers' deposits with RBI", "M2 + all post office deposits"], a: 0, e: "The RBI's main measure." },
        { q: "If the currency-deposit ratio is 0.25 and the reserve ratio is 0.15, the money multiplier is…", o: ["3.125", "4", "6.67", "2.5"], a: 0, e: "(1 + 0.25) ÷ (0.25 + 0.15) = 1.25 ÷ 0.4 = 3.125." }]
    },
    {
      id: "4.7", mod: 4, ch: "Chapter 8, Unit 3", title: "Monetary Policy", time: "17 min", tool: "sort",
      tcfg: { d: "Would each RBI action make monetary policy tighter or looser?", buckets: ["Tightening (contractionary)", "Easing (expansionary)"], items: [
        ["Raising the repo rate", "Tightening (contractionary)", "Banks' borrowing costs rise, and lending rates follow."],
        ["Cutting the cash reserve ratio", "Easing (expansionary)", "Banks have more funds to lend."],
        ["Selling government securities in open market operations", "Tightening (contractionary)", "It absorbs liquidity from banks."],
        ["Buying government securities in open market operations", "Easing (expansionary)", "It injects liquidity."],
        ["Raising the statutory liquidity ratio", "Tightening (contractionary)", "Banks must hold more liquid assets instead of lending."],
        ["Lowering the repo rate", "Easing (expansionary)", "Cheaper funds encourage borrowing and spending."],
        ["Raising the Standing Deposit Facility rate", "Tightening (contractionary)", "Banks earn more by parking funds with the RBI rather than lending."]] },
      outcomes: ["Define monetary policy and its objectives in India", "Explain the flexible inflation targeting framework and the Monetary Policy Committee", "Explain the instruments: repo, SDF, MSF, CRR, SLR, open market operations and others", "Describe the transmission mechanism and limits of monetary policy"],
      notes: `<p><b>Monetary policy</b> is the use of money supply, credit and interest rates by the central bank to achieve economic goals. In India the <b>Reserve Bank of India</b> conducts it under the RBI Act, 1934. Its main objective is <b>price stability</b> while keeping in mind the objective of <b>growth</b>; it also supports financial stability and an adequate flow of credit.</p>
<p style="margin-top:10px">Since 2016, India has followed <b>flexible inflation targeting</b>. The Government, in consultation with the RBI, sets the inflation target in terms of <b>CPI (Combined)</b> inflation: <b>4%</b>, with a tolerance band of <b>2 percentage points</b> either side. The six-member <b>Monetary Policy Committee</b> (MPC), chaired by the RBI Governor (three RBI members and three external members appointed by the Government), decides the <b>policy repo rate</b> by majority, with the Governor having a casting vote. If inflation stays outside the band for three consecutive quarters, the RBI must report the reasons and remedial actions to the Government.</p>
<p style="margin-top:10px"><b>Instruments</b>. <b>Quantitative (general)</b>: the <b>repo rate</b> (the rate at which the RBI lends to banks against government securities under the liquidity adjustment facility; the key policy rate); the <b>Standing Deposit Facility (SDF)</b> rate (the floor of the interest rate corridor, at which banks can park surplus funds with the RBI without collateral); the <b>Marginal Standing Facility (MSF)</b> rate (the ceiling, for banks' overnight emergency borrowing); the <b>bank rate</b>; the <b>cash reserve ratio (CRR)</b>, a share of deposits banks must keep with the RBI; the <b>statutory liquidity ratio (SLR)</b>, a share of deposits banks must hold in liquid assets such as government securities; <b>open market operations (OMOs)</b>, the purchase or sale of government securities; and variable rate repos and reverse repos. <b>Qualitative (selective)</b>: margin requirements on secured loans, consumer credit regulation, credit ceilings, moral suasion and direct action.</p>
<p style="margin-top:10px">The <b>transmission mechanism</b> runs from the policy rate to money market rates, bank lending and deposit rates, asset prices, the exchange rate and expectations, and then to spending, output and inflation. Transmission can be <b>slow or incomplete</b> because of rigid deposit rates, the share of small savings, banks' balance-sheet weaknesses, a large informal sector and fiscal dominance. Monetary policy is also less effective in a liquidity trap and against supply-side inflation (food, fuel).</p>`,
      formula: "Tighten: repo ↑ · CRR ↑ · SLR ↑ · OMO sales · Ease: the reverse<small>inflation target: CPI 4% ± 2 percentage points · corridor: SDF (floor) < repo < MSF (ceiling)</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Policy rates</h4>" + tbl(["Rate", "What it is"], [["Repo rate", "RBI lends to banks against securities: the policy rate"], ["SDF rate", "Banks deposit surplus funds with RBI without collateral: the corridor floor"], ["MSF rate", "Banks borrow overnight from RBI beyond normal limits: the corridor ceiling"], ["Bank rate", "RBI's rate for rediscounting; aligned with MSF; used for penal rates"]]) + note("The levels of these rates and of CRR change with each policy decision; check the RBI's latest policy statement for current values."); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">CPI inflation in a fictional quarter rises to 6.8% because demand is strong. What might the MPC do, and how would it work?</p>" +
          steps(["6.8% is above the upper tolerance limit of 6%", "The MPC raises the repo rate; banks' cost of funds rises", "Banks raise lending rates; borrowing for homes, cars and business investment slows", "Aggregate demand cools, and inflation eases back toward 4% over the following quarters", "If the inflation came from a bad monsoon (food supply), the rate rise would be less effective."]);
      },
      use: ["Classify each instrument as quantitative or qualitative, and its direction.", "Know the corridor: SDF below repo below MSF.", "Mistake: calling the repo rate the rate at which banks lend to customers.", "Mistake: treating fiscal tools such as taxes as monetary policy."],
      walk: function () { return [
        { t: "Who and why", c: "The RBI: price stability with growth.", h: chips(["RBI Act, 1934", "MPC"], "ac") },
        { t: "Inflation targeting", c: "CPI 4% ± 2 percentage points.", h: box("Band: 2% to 6%", "good") },
        { t: "Quantitative tools", c: "Rates and ratios.", h: chips(["Repo", "SDF", "MSF", "CRR", "SLR", "OMO"], "ac") },
        { t: "Qualitative tools", c: "Selective credit controls.", h: chips(["Margins", "Moral suasion", "Direct action"], "mi") },
        { t: "Transmission", c: "Policy rate → bank rates → spending → inflation.", h: chips(["Can be slow"], "hl") }]; },
      recap: ["The RBI's MPC sets the repo rate to keep CPI inflation at 4% ± 2 percentage points", "Tools include repo, SDF, MSF, CRR, SLR and OMOs, plus selective controls; transmission can be slow"],
      qc: [{ q: "To control inflation, the RBI would most likely…", o: ["Raise the repo rate", "Cut the CRR", "Buy government securities", "Lower the SLR"], a: 0, e: "A higher policy rate tightens credit." },
        { q: "The floor of the RBI's interest rate corridor is the…", o: ["Standing Deposit Facility rate", "MSF rate", "Bank rate", "Repo rate"], a: 0, e: "Since 2022 the SDF has been the floor." }]
    },

    /* ---------------- MODULE 5: INTERNATIONAL TRADE AND THE INDIAN ECONOMY ---------------- */
    {
      id: "5.1", mod: 5, ch: "Chapter 9, Unit 1", title: "Theories of International Trade", time: "18 min", tool: "compadv",
      outcomes: ["Explain why countries trade and the gains from trade", "Explain mercantilism, Adam Smith's absolute advantage and Ricardo's comparative advantage", "Explain the Heckscher–Ohlin theory and the Leontief paradox", "Outline new trade theory and the role of economies of scale"],
      notes: `<p><b>International trade</b> is the exchange of goods and services across national borders. Countries trade because resources, technology and costs differ between them; trade lets each <b>specialise</b>, widens markets, gives consumers more variety at lower prices, spreads technology and allows economies of scale. Trade also brings challenges: competition for domestic industries, dependence on other countries and exposure to external shocks.</p>
<p style="margin-top:10px"><b>Mercantilism</b> (16th–18th centuries) held that a nation's wealth lay in gold and silver, so it should maximise exports, minimise imports and run trade surpluses, with heavy state control. It treated trade as a zero-sum game. <b>Adam Smith's absolute advantage</b>: a country should specialise in goods it can produce with <b>less labour</b> (absolutely more efficiently) than others, and trade for the rest; both gain. But what if one country is better at everything?</p>
<p style="margin-top:10px"><b>David Ricardo's comparative advantage</b> answered this: even if a country has an absolute advantage in both goods, both countries gain if each specialises in the good in which it has the <b>lower opportunity cost</b> (its comparative advantage) and trades. Gains arise as long as the <b>terms of trade</b> lie <b>between</b> the two countries' domestic opportunity cost ratios. The theory assumes two countries and two goods, labour as the only factor, constant costs, full employment and free trade with no transport costs.</p>
<p style="margin-top:10px">The <b>Heckscher–Ohlin (factor endowment)</b> theory explains comparative advantage by differences in <b>factor endowments</b>: a country exports goods that use intensively its <b>abundant</b> factor (labour-abundant India exports labour-intensive goods; capital-abundant countries export capital-intensive goods). Trade tends to equalise factor prices (the factor price equalisation theorem). The <b>Leontief paradox</b> found that the USA, though capital-abundant, exported relatively labour-intensive goods, raising doubts about the simple theory. <b>New trade theory</b> (Paul Krugman) explains trade between similar countries in similar products (<b>intra-industry trade</b>) by <b>economies of scale</b>, product differentiation and consumers' love of variety, with first-mover advantages and imperfect competition.</p>`,
      formula: "Specialise where opportunity cost is lowest · gains if the terms of trade lie between the two domestic cost ratios<small>H–O: export goods using your abundant factor · new trade theory: scale economies and variety</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Trade theories at a glance</h4>" + tbl(["Theory", "Basis of trade", "Key idea"], [["Mercantilism", "Accumulating gold", "Exports good, imports bad"], ["Absolute advantage (Smith)", "Lower labour cost", "Specialise where you are most efficient"], ["Comparative advantage (Ricardo)", "Lower opportunity cost", "Both gain even if one is better at everything"], ["Heckscher–Ohlin", "Factor endowments", "Export goods using the abundant factor"], ["New trade theory (Krugman)", "Economies of scale, variety", "Explains intra-industry trade"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Labour hours needed for one unit in two fictional countries:</p>" +
          tbl(["", "Cloth", "Wheat"], [["Indus", "10 hours", "20 hours"], ["Delta", "30 hours", "40 hours"]]) +
          steps(["Indus is better at both (absolute advantage in both).", "Opportunity cost of 1 cloth: Indus 10/20 = 0.5 wheat; Delta 30/40 = 0.75 wheat → Indus has comparative advantage in cloth", "Opportunity cost of 1 wheat: Indus 2 cloth; Delta 1.33 cloth → Delta has comparative advantage in wheat", "Both gain if 1 wheat trades for between 1.33 and 2 cloth (for example 1 wheat = 1.6 cloth)."]);
      },
      use: ["Work out opportunity costs for both goods in both countries before deciding.", "Check that the terms of trade lie between the two domestic ratios.", "Mistake: deciding by absolute advantage when the question asks about comparative advantage.", "Mistake: treating trade as zero-sum, as the mercantilists did."],
      walk: function () { return [
        { t: "Why trade?", c: "Countries differ in costs and resources.", h: chips(["Specialisation", "Variety", "Scale"], "ac") },
        { t: "Absolute advantage", c: "Smith: produce with less labour.", h: chips(["Smith"], "mi") },
        { t: "Comparative advantage", c: "Ricardo: lower opportunity cost.", h: box("Indus: cloth (0.5 wheat)\nDelta: wheat (1.33 cloth)", "good") },
        { t: "Factor endowments", c: "Export what uses your abundant factor.", h: chips(["Heckscher–Ohlin", "Leontief paradox"], "ac") },
        { t: "New trade theory", c: "Scale and variety explain intra-industry trade.", h: chips(["Krugman"], "mi") }]; },
      recap: ["Comparative advantage, based on opportunity cost, explains gains from trade even when one country is better at everything", "H–O links trade to factor endowments; new trade theory adds economies of scale and variety"],
      qc: [{ q: "The theory of comparative advantage is associated with…", o: ["David Ricardo", "Adam Smith", "Heckscher and Ohlin", "Paul Krugman"], a: 0, e: "Ricardo, 1817." },
        { q: "The Leontief paradox found that the USA exported goods that were relatively…", o: ["Labour-intensive", "Capital-intensive", "Land-intensive", "Technology-free"], a: 0, e: "This contradicted the simple Heckscher–Ohlin prediction." }]
    },
    {
      id: "5.2", mod: 5, ch: "Chapter 9, Unit 2", title: "The Instruments of Trade Policy", time: "16 min", tool: "tariff",
      outcomes: ["Distinguish free trade from protection and state the arguments for protection", "Explain tariffs: specific, ad valorem, compound, and their effects", "Calculate the effective rate of protection", "Explain non-tariff measures: quotas, subsidies, voluntary export restraints, anti-dumping and technical barriers"],
      notes: `<p><b>Trade policy</b> is the set of government measures affecting a country's imports and exports. <b>Free trade</b> means no barriers; <b>protection</b> means restricting imports to help domestic producers. Arguments for protection include protecting <b>infant industries</b> until they can compete, national <b>security</b>, saving <b>jobs</b>, correcting a <b>balance of payments</b> deficit, raising <b>revenue</b>, preventing <b>dumping</b> and retaliating against unfair practices. Critics point to higher prices for consumers, inefficiency and retaliation by other countries.</p>
<p style="margin-top:10px">A <b>tariff</b> (customs duty) is a tax on imports (or occasionally exports). A <b>specific</b> tariff is a fixed amount per unit (₹500 per tonne); an <b>ad valorem</b> tariff is a percentage of value (10% of the import price); a <b>compound</b> (mixed) tariff combines both. Tariffs raise the domestic price, which increases domestic production, reduces consumption and imports, and earns revenue, but causes a <b>deadweight loss</b> from inefficient production and lost consumption. The <b>nominal</b> tariff rate applies to the final good; the <b>effective rate of protection</b> (ERP) measures protection of <b>domestic value added</b>, taking into account tariffs on inputs: ERP = (t − a·ti) ÷ (1 − a), where t is the tariff on the final good, ti the tariff on inputs and a the share of imported inputs in the free-trade price. Tariff <b>escalation</b> (low tariffs on inputs, high on final goods) raises effective protection.</p>
<p style="margin-top:10px"><b>Non-tariff measures</b>: <b>import quotas</b> (quantity limits; the scarcity rent goes to licence holders), <b>voluntary export restraints</b> (the exporting country limits its own exports), <b>export subsidies</b> and <b>export taxes</b>, <b>anti-dumping duties</b> (against goods sold abroad below their normal value) and <b>countervailing duties</b> (against subsidised imports), <b>safeguard measures</b> against sudden import surges, <b>technical barriers to trade</b> (standards, labelling) and <b>sanitary and phytosanitary</b> measures (food and plant safety), local content requirements, government procurement rules and administrative procedures.</p>`,
      formula: "Ad valorem duty = rate × value · Specific = amount × units · ERP = (t − a·ti) ÷ (1 − a)<small>tariff → price ↑, domestic output ↑, imports ↓, revenue ↑, deadweight loss</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Tariffs vs quotas</h4>" + tbl(["Basis", "Tariff", "Quota"], [["Limits", "Price (via tax)", "Quantity directly"], ["Revenue", "To the government", "Scarcity rent to licence holders (unless auctioned)"], ["Effect of rising demand", "More imports at the same tax", "Imports fixed; price rises more"], ["Transparency", "High", "Lower"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">A fictional bicycle sells for ₹10,000 under free trade, with imported parts worth ₹6,000 (a = 0.6). The tariff is 20% on bicycles and 10% on parts.</p>" +
          steps(["Value added at free-trade prices = 10,000 − 6,000 = ₹4,000", "With tariffs: bicycle price 12,000; parts cost 6,600 → domestic value added = ₹5,400", "ERP = (5,400 − 4,000) ÷ 4,000 = 35%", "Formula check: (0.20 − 0.6 × 0.10) ÷ (1 − 0.6) = 0.14 ÷ 0.4 = 35% ✓ (far above the nominal 20%)"]);
      },
      use: ["Compute ERP to see how much domestic producers are really protected.", "Know which measure targets dumping (anti-dumping duty) and which targets subsidies (countervailing duty).", "Mistake: assuming a tariff's burden always falls on foreign exporters.", "Mistake: thinking quotas raise revenue for the government automatically."],
      walk: function () { return [
        { t: "Free trade or protection?", c: "Infant industry, security, jobs, revenue…", h: chips(["Infant industry", "Security", "Anti-dumping"], "ac") },
        { t: "Kinds of tariffs", c: "Specific, ad valorem, compound.", h: chips(["₹ per unit", "% of value", "Both"], "ac") },
        { t: "Effects of a tariff", c: "Price up, imports down, revenue up.", h: chips(["Deadweight loss"], "hl") },
        { t: "Effective protection", c: "Protection of value added.", h: box("(0.20 − 0.06) ÷ 0.4 = 35%", "good") },
        { t: "Non-tariff measures", c: "Quotas, VERs, subsidies, standards.", h: chips(["Quota", "VER", "Anti-dumping", "TBT", "SPS"], "mi") }]; },
      recap: ["Tariffs may be specific, ad valorem or compound; they raise prices and cut imports with a deadweight loss", "ERP measures protection of value added; non-tariff measures include quotas, VERs, anti-dumping and technical barriers"],
      qc: [{ q: "A duty of 15% on the value of imported cars is…", o: ["Ad valorem", "Specific", "Compound", "Countervailing"], a: 0, e: "A percentage of value." },
        { q: "A duty imposed on imports sold below their normal value in the home market is…", o: ["An anti-dumping duty", "A countervailing duty", "A safeguard duty", "A specific duty"], a: 0, e: "Countervailing duties target subsidies." }]
    },
    {
      id: "5.3", mod: 5, ch: "Chapter 9, Unit 3", title: "Trade Negotiations", time: "15 min", tool: "cases",
      tcfg: { d: "Answer each question on the multilateral trading system.", cases: [
        { q: "Under the WTO, a concession given to one member must be given to all members. This is the principle of…", o: ["Most-favoured-nation treatment", "National treatment", "Reciprocity", "Transparency"], a: 0, e: "MFN: no discrimination between trading partners (with exceptions such as free trade areas)." },
        { q: "Once imported goods enter the market, they must be treated no less favourably than domestic goods. This is…", o: ["National treatment", "MFN", "Binding of tariffs", "Safeguards"], a: 0, e: "It applies after goods have cleared customs." },
        { q: "Which agreement covers patents, copyrights and trade marks?", o: ["TRIPS", "GATS", "TRIMs", "SPS"], a: 0, e: "Trade-Related Aspects of Intellectual Property Rights." },
        { q: "Domestic farm support that does not distort trade (such as research and extension) falls in the…", o: ["Green box", "Amber box", "Blue box", "Red box"], a: 0, e: "Under the Agreement on Agriculture, green box support is permitted without limits." },
        { q: "The WTO came into existence on…", o: ["1 January 1995", "1 January 1948", "1 April 1991", "14 November 2001"], a: 0, e: "It succeeded GATT after the Uruguay Round (1986–94)." },
        { q: "Two countries agree to remove tariffs between themselves but keep their own tariffs on others. This is a…", o: ["Free trade area", "Customs union", "Common market", "Economic union"], a: 0, e: "A customs union also adopts a common external tariff." }] },
      outcomes: ["Explain the forms of regional trade agreements and economic integration", "Trace the history of GATT and its rounds, ending in the Uruguay Round", "Describe the WTO's objectives, structure and principles", "Outline the major WTO agreements and current issues in trade negotiations"],
      notes: `<p>Countries negotiate trade rules <b>bilaterally</b>, <b>regionally</b> and <b>multilaterally</b>. Regional integration has stages: a <b>preferential trade agreement</b> (lower tariffs on some goods), a <b>free trade area</b> (no tariffs among members, each keeping its own tariffs on others), a <b>customs union</b> (free trade plus a <b>common external tariff</b>), a <b>common market</b> (plus free movement of labour and capital), an <b>economic union</b> (plus harmonised economic policies) and full economic integration. India's agreements include SAFTA and FTAs or comprehensive agreements with ASEAN, Japan, South Korea, the UAE and Australia.</p>
<p style="margin-top:10px">The <b>General Agreement on Tariffs and Trade (GATT)</b>, signed in 1947 and in force from 1948, provided rules for trade in goods and a forum for negotiations through eight <b>rounds</b>, which cut tariffs sharply. The <b>Uruguay Round</b> (1986–94) extended rules to agriculture, textiles, services and intellectual property and created the <b>World Trade Organization (WTO)</b>, established on <b>1 January 1995</b> with its headquarters in Geneva. India is a founding member.</p>
<p style="margin-top:10px">The WTO's <b>principles</b> are: non-discrimination through <b>most-favoured-nation (MFN)</b> treatment and <b>national treatment</b>; freer trade through negotiation; <b>predictability</b> through binding tariff commitments and transparency; promoting <b>fair competition</b>; and special and differential treatment for <b>developing countries</b>. Its highest body is the <b>Ministerial Conference</b>, normally meeting every two years; the <b>General Council</b> runs it day to day and also acts as the Dispute Settlement Body and Trade Policy Review Body. Major agreements include GATT 1994, the <b>Agreement on Agriculture</b> (market access, domestic support classified into amber, blue and green boxes, and export subsidies), <b>GATS</b> (services), <b>TRIPS</b> (intellectual property), <b>TRIMs</b> (investment measures), <b>SPS</b> and <b>TBT</b> (standards), anti-dumping, subsidies and safeguards, and the <b>Dispute Settlement Understanding</b>.</p>
<p style="margin-top:10px">The <b>Doha Development Round</b>, launched in 2001, has made limited progress; outcomes since include the Trade Facilitation Agreement (2013, in force 2017) and an agreement on fisheries subsidies (2022). Current concerns include the functioning of the dispute settlement <b>Appellate Body</b>, agricultural public stockholding for food security, e-commerce, and the growth of regional and plurilateral deals.</p>`,
      formula: "PTA → FTA → customs union → common market → economic union<small>WTO principles: MFN · national treatment · binding · transparency · special treatment for developing countries</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Boxes under the Agreement on Agriculture</h4>" + tbl(["Box", "Meaning"], [["Amber", "Trade-distorting support (price support); subject to reduction commitments"], ["Blue", "Support linked to production-limiting programmes; allowed"], ["Green", "Minimal or no trade distortion (research, extension, environmental programmes); allowed without limits"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Indus, Delta and a third country, Coral, are WTO members. Indus cuts its tariff on Delta's tea from 30% to 10%.</p>" +
          steps(["Under MFN, Indus must give Coral's tea the same 10% tariff", "Exception: if Indus and Delta form a free trade area that covers substantially all their trade, the lower tariff can apply to Delta alone", "Once Coral's tea enters Indus, national treatment means it cannot face a higher sales tax than Indus's own tea"]);
      },
      use: ["Know the order of integration stages and what each adds.", "Separate MFN (between foreign suppliers) from national treatment (foreign vs domestic).", "Mistake: dating the WTO to 1947; that was GATT.", "Mistake: thinking the green box is restricted; it is the permitted category."],
      walk: function () { return [
        { t: "Levels of negotiation", c: "Bilateral, regional, multilateral.", h: chips(["PTA", "FTA", "Customs union", "Common market"], "ac") },
        { t: "From GATT to WTO", c: "1947 → Uruguay Round → 1995.", h: box("GATT 1947 · Uruguay Round 1986–94\nWTO from 1 January 1995", "good") },
        { t: "Principles", c: "Non-discrimination above all.", h: chips(["MFN", "National treatment", "Binding", "Transparency"], "ac") },
        { t: "Agreements", c: "Goods, services, IP and more.", h: chips(["AoA", "GATS", "TRIPS", "TRIMs", "DSU"], "mi") },
        { t: "Doha and beyond", c: "Slow progress; new issues.", h: chips(["Trade facilitation", "Fisheries subsidies", "Appellate Body"], "hl") }]; },
      recap: ["Integration runs from preferential deals to economic union; the WTO replaced GATT in 1995", "WTO rules rest on MFN and national treatment, with agreements on agriculture, services, IP and disputes"],
      qc: [{ q: "A free trade area plus a common external tariff is a…", o: ["Customs union", "Common market", "Economic union", "Preferential trade area"], a: 0, e: "A common market adds free factor movement." },
        { q: "GATS deals with trade in…", o: ["Services", "Goods", "Intellectual property", "Investment measures"], a: 0, e: "General Agreement on Trade in Services." }]
    },
    {
      id: "5.4", mod: 5, ch: "Chapter 9, Unit 4", title: "Exchange Rate and its Economic Effects", time: "17 min", tool: "fx",
      outcomes: ["Read direct and indirect quotes and calculate cross rates", "Explain how exchange rates are determined in fixed, floating and managed systems", "Distinguish depreciation from devaluation, and nominal from real exchange rates", "Explain the effects of exchange rate changes on trade, prices and business"],
      notes: `<p>An <b>exchange rate</b> is the price of one currency in terms of another. A <b>direct quote</b> gives the units of home currency per unit of foreign currency (₹84 = $1), the method used in India; an <b>indirect quote</b> gives units of foreign currency per unit of home currency ($0.0119 = ₹1). A <b>cross rate</b> is derived from two rates with a common currency (₹/€ = ₹/$ × $/€). The <b>spot</b> rate is for immediate delivery; the <b>forward</b> rate is agreed now for future delivery.</p>
<p style="margin-top:10px">Under a <b>floating</b> (flexible) system, the rate is set by the <b>demand</b> for and <b>supply</b> of foreign exchange. Demand for dollars comes from imports, travel abroad, foreign investment by residents and debt repayment; supply comes from exports, inflows of foreign investment, remittances and borrowing from abroad. Under a <b>fixed</b> (pegged) system, the central bank holds the rate at a set level by buying and selling reserves. Most countries, including India, follow a <b>managed float</b>: the market sets the rate, but the central bank intervenes to reduce excessive volatility.</p>
<p style="margin-top:10px">In a floating system, a fall in the value of the home currency is <b>depreciation</b> and a rise is <b>appreciation</b>; in a fixed system, a deliberate official cut is <b>devaluation</b> and a rise is <b>revaluation</b>. With direct quotes, a <b>rise</b> in ₹ per $ means the <b>rupee has depreciated</b>. The <b>nominal</b> exchange rate is the market rate; the <b>real exchange rate</b> adjusts it for relative price levels (RER = nominal rate × foreign price ÷ domestic price), and the <b>real effective exchange rate</b> (REER) is a trade-weighted average against many currencies. Purchasing power parity suggests that, in the long run, exchange rates move to equalise the price of identical goods.</p>
<p style="margin-top:10px">A <b>depreciation</b> makes exports cheaper for foreigners and imports dearer at home, which tends to raise exports, reduce imports and improve the trade balance (after a lag: the <b>J-curve</b>, and if the Marshall–Lerner condition on elasticities holds). It also raises import costs and can feed <b>inflation</b>, raises the rupee cost of foreign debt and affects firms' profits depending on whether they export or import. Appreciation has the opposite effects. Businesses manage this <b>exchange rate risk</b> with forward contracts, futures, options and natural hedging.</p>`,
      formula: "Direct quote: ₹ per $ · rise = rupee depreciation · % change = (new − old)/old<small>cross rate: ₹/€ = ₹/$ × $/€ · real rate = nominal × P(foreign) ÷ P(home)</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Who gains when the rupee depreciates?</h4>" + tbl(["Group", "Effect"], [["Exporters (IT services, textiles)", "Gain: more rupees per dollar earned"], ["Importers (oil, electronics)", "Lose: imports cost more"], ["Firms with dollar loans", "Lose: repayment costs more"], ["Foreign tourists in India", "Gain: India is cheaper"], ["Families receiving remittances", "Gain"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">The rupee moves from ₹80 = $1 to ₹84 = $1. The euro is at $1.10.</p>" +
          steps(["Rise in the dollar's price = (84 − 80) ÷ 80 = 5%: the dollar has appreciated by 5%", "The rupee's value in dollars: 1/80 = 0.0125 → 1/84 = 0.01190, a fall of (0.0125 − 0.0119) ÷ 0.0125 ≈ 4.76%: the rupee has depreciated by about 4.76%", "Cross rate: ₹/€ = 84 × 1.10 = ₹92.40", "An Indian exporter earning $10,000 now gets ₹8,40,000 instead of ₹8,00,000"]);
      },
      use: ["Always check whether a quote is direct or indirect before saying which currency has strengthened.", "Compute the % change of each currency on its own base: they are not the same.", "Mistake: calling a market-driven fall in the rupee a 'devaluation'.", "Mistake: assuming depreciation improves the trade balance immediately."],
      walk: function () { return [
        { t: "Reading a quote", c: "Direct: ₹ per $. Indirect: $ per ₹.", h: chips(["₹84 = $1", "$0.0119 = ₹1"], "ac") },
        { t: "What sets the rate?", c: "Demand and supply of foreign exchange.", h: chips(["Imports, outflows → demand", "Exports, inflows → supply"], "mi") },
        { t: "Systems", c: "Fixed, floating, managed float.", h: chips(["India: managed float"], "ac") },
        { t: "The 5% vs 4.76% trap", c: "Each currency's change has its own base.", h: box("$ up 5% · ₹ down 4.76%", "good") },
        { t: "Effects", c: "Exports up, imports dearer, possible inflation.", h: chips(["J-curve", "Hedging"], "hl") }]; },
      recap: ["A rise in a direct quote means the home currency has depreciated; cross rates come through a common currency", "Depreciation helps exports and hurts importers; India runs a managed float"],
      qc: [{ q: "If the rate moves from ₹82/$ to ₹80/$, the rupee has…", o: ["Appreciated", "Depreciated", "Been devalued", "Not changed in value"], a: 0, e: "Fewer rupees are needed per dollar." },
        { q: "A deliberate reduction in the official value of a currency under a fixed system is…", o: ["Devaluation", "Depreciation", "Appreciation", "Revaluation"], a: 0, e: "Depreciation is the market-driven fall under a floating system." }]
    },
    {
      id: "5.5", mod: 5, ch: "Chapter 9, Unit 5", title: "International Capital Movements", time: "14 min", tool: "sort",
      tcfg: { d: "Is each inflow foreign direct investment (FDI) or foreign portfolio investment (FPI)?", buckets: ["FDI", "FPI"], items: [
        ["A Japanese carmaker builds a new plant in India", "FDI", "A greenfield investment with lasting control."],
        ["A US pension fund buys 2% of an Indian bank's shares on the stock exchange", "FPI", "A small, financial stake without control."],
        ["A Korean firm buys 60% of an Indian electronics company", "FDI", "A brownfield acquisition giving control."],
        ["A foreign fund buys Indian government bonds", "FPI", "Debt securities for financial return."],
        ["A European retailer sets up a wholly owned subsidiary", "FDI", "Lasting interest and management control."],
        ["A Singapore investor buys 4% of a listed IT company to profit from price rises", "FPI", "Below the 10% threshold; a portfolio holding."]] },
      outcomes: ["Distinguish FDI from FPI and identify the forms of foreign capital", "Explain the reasons for, and the benefits and costs of, foreign direct investment", "Describe modes of FDI entry: greenfield, brownfield, joint ventures and mergers", "Outline India's approach to foreign investment"],
      notes: `<p><b>International capital movements</b> are flows of financial resources across borders for investment. Forms of foreign capital include <b>foreign direct investment (FDI)</b>, <b>foreign portfolio investment (FPI)</b>, external commercial borrowings, loans from multilateral institutions (World Bank, ADB), official development assistance (aid), NRI deposits and trade credit.</p>
<p style="margin-top:10px"><b>FDI</b> is investment made to acquire a <b>lasting interest</b> and an effective voice in the <b>management</b> of an enterprise in another country. In India, an investment of <b>10% or more</b> of the post-issue paid-up equity of a listed company is treated as FDI; below that, it is FPI. FDI can be <b>greenfield</b> (a new facility), <b>brownfield</b> (acquiring or merging with an existing firm), a <b>joint venture</b> with a local partner, or <b>horizontal</b> (the same activity abroad), <b>vertical</b> (a stage of the supply chain) or <b>conglomerate</b>. <b>FPI</b> is investment in financial assets (shares, bonds) for financial return, without management control; it is more liquid and volatile ('hot money').</p>
<p style="margin-top:10px"><b>Reasons</b> for FDI include access to markets, cheaper or specialised inputs and labour, natural resources, avoiding tariffs, tax advantages and strategic assets. <b>Benefits</b> to the host country: capital, technology and management skills, employment, exports and productivity spillovers, competition and infrastructure. <b>Costs</b>: outflow of profits and royalties, crowding out of local firms, transfer pricing and tax avoidance, dependence on foreign firms, and environmental or labour concerns. Multinational corporations (MNCs) are the main vehicles of FDI.</p>
<p style="margin-top:10px"><b>India</b> opened up gradually after 1991. Today most sectors allow FDI through the <b>automatic route</b> (no prior approval), while some sensitive sectors need <b>government approval</b> and a few (such as atomic energy, lotteries and gambling) prohibit it. Investments from countries sharing a land border with India need approval. Policy is framed by the Department for Promotion of Industry and Internal Trade (DPIIT) and administered under FEMA.</p>`,
      formula: "FDI: lasting interest + control (in India ≥ 10% of a listed company's equity) · FPI: financial stake, no control<small>FDI modes: greenfield · brownfield · joint venture</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">FDI vs FPI</h4>" + tbl(["Basis", "FDI", "FPI"], [["Aim", "Control and lasting interest", "Financial return"], ["Stake", "Usually 10% or more", "Below 10%"], ["Stability", "Long-term, stable", "Volatile ('hot money')"], ["Brings", "Capital, technology, management", "Mainly capital"], ["Exit", "Slow", "Quick"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Orbit Motors (fictional) is choosing how to enter a new foreign market.</p>" +
          tbl(["Option", "Mode", "Trade-off"], [["Build its own plant", "Greenfield FDI", "Full control; slow and costly"], ["Buy a local carmaker", "Brownfield FDI", "Quick market access; integration risk"], ["Partner with a local firm", "Joint venture", "Shared risk and local knowledge; shared control"], ["Buy 5% of a listed foreign carmaker", "FPI", "Financial return only; no say in management"]]);
      },
      use: ["Use the purpose (control or return) and the 10% threshold to classify flows.", "Weigh benefits and costs of FDI for the host country, not just the investor.", "Mistake: calling every foreign share purchase FDI.", "Mistake: treating FPI as stable long-term capital."],
      walk: function () { return [
        { t: "Forms of foreign capital", c: "FDI, FPI, loans, aid.", h: chips(["FDI", "FPI", "ECB", "Aid"], "ac") },
        { t: "FDI", c: "Lasting interest and control.", h: box("≥ 10% of a listed company → FDI", "good") },
        { t: "Modes", c: "Greenfield, brownfield, JV.", h: chips(["Greenfield", "Brownfield", "Joint venture"], "ac") },
        { t: "Benefits and costs", c: "Technology and jobs vs profit outflows.", h: chips(["Spillovers", "Transfer pricing"], function (x, i) { return i ? "hl" : "mi"; }) },
        { t: "India's policy", c: "Automatic route for most sectors.", h: chips(["Automatic", "Approval", "Prohibited"], "ac") }]; },
      recap: ["FDI brings control and lasting interest; FPI is a financial stake without control", "FDI brings capital and technology but can drain profits; India allows most FDI through the automatic route"],
      qc: [{ q: "Setting up a completely new factory abroad is…", o: ["Greenfield investment", "Brownfield investment", "Portfolio investment", "A joint venture"], a: 0, e: "Brownfield means acquiring an existing facility." },
        { q: "Which is generally more volatile?", o: ["Foreign portfolio investment", "Foreign direct investment", "Official aid", "Long-term loans from the World Bank"], a: 0, e: "FPI can leave quickly." }]
    },
    {
      id: "5.6", mod: 5, ch: "Chapter 10", title: "Indian Economy", time: "18 min", tool: "cases",
      tcfg: { d: "Test your knowledge of India's economic history and reforms.", cases: [
        { q: "India's first Five-Year Plan began in…", o: ["1951", "1947", "1961", "1991"], a: 0, e: "Plans ran from 1951 to 2017 (twelve Five-Year Plans, with plan holidays)." },
        { q: "Which body replaced the Planning Commission in January 2015?", o: ["NITI Aayog", "The Finance Commission", "The GST Council", "The National Development Council"], a: 0, e: "NITI Aayog is a policy think-tank, not an allocator of funds." },
        { q: "The economic reforms of 1991 are often summed up as…", o: ["Liberalisation, privatisation and globalisation", "Nationalisation and planning", "Green revolution and land reform", "Demonetisation and GST"], a: 0, e: "They followed the balance of payments crisis of 1991." },
        { q: "The Goods and Services Tax was introduced on…", o: ["1 July 2017", "1 April 2016", "8 November 2016", "1 January 2015"], a: 0, e: "It replaced many central and state indirect taxes." },
        { q: "The sector with the largest share of India's GDP today is…", o: ["Services", "Agriculture", "Manufacturing", "Mining"], a: 0, e: "Agriculture still employs the largest share of workers, but services contribute the most to output." },
        { q: "The Insolvency and Bankruptcy Code, which set up time-bound insolvency resolution, was enacted in…", o: ["2016", "1991", "2003", "2019"], a: 0, e: "It created the IBBI and uses the NCLT as adjudicating authority." }] },
      outcomes: ["Describe the Indian economy at independence and the planning era (1951–2017)", "Explain the 1991 crisis and the liberalisation, privatisation and globalisation reforms", "Outline major later reforms: NITI Aayog, GST, IBC, inflation targeting and digital public infrastructure", "Describe the structure of the economy and its main challenges"],
      notes: `<p>At <b>independence</b> in 1947, India was a low-income, largely <b>agrarian</b> economy with stagnant agriculture, weak industry, poor infrastructure, low literacy and life expectancy, and widespread poverty, the legacy of colonial rule. The <b>Industrial Policy Resolutions</b> of 1948 and 1956 gave the <b>public sector</b> a leading role in a <b>mixed economy</b>.</p>
<p style="margin-top:10px"><b>Planning</b>: the Planning Commission (1950) prepared <b>twelve Five-Year Plans</b>, from 1951 to 2017. The First Plan stressed agriculture; the Second (Mahalanobis model) heavy industry; later plans added self-reliance, poverty removal and growth with social justice. Achievements included a strong industrial and scientific base, the <b>Green Revolution</b> (from the mid-1960s, making India self-sufficient in food grains), and expansion of education and health. Weaknesses included slow growth (the '<b>Hindu rate of growth</b>' of about 3.5% a year), the 'licence-permit raj', inefficient public enterprises, and persistent poverty. Banks were nationalised in 1969 and 1980.</p>
<p style="margin-top:10px">The <b>1991 crisis</b> (very low foreign exchange reserves, high fiscal deficits, inflation, the Gulf War oil shock) led to the <b>New Economic Policy</b>: <b>liberalisation</b> (abolishing most industrial licensing, deregulation, financial sector reform), <b>privatisation</b> (disinvestment and opening sectors reserved for the public sector) and <b>globalisation</b> (cutting tariffs, allowing foreign investment, current account convertibility of the rupee, joining the WTO in 1995). Growth accelerated, services boomed, especially IT, and reserves rose.</p>
<p style="margin-top:10px"><b>Later reforms</b>: the FRBM Act (2003); <b>NITI Aayog</b> replacing the Planning Commission (2015); the <b>Insolvency and Bankruptcy Code</b> (2016); <b>flexible inflation targeting</b> and the Monetary Policy Committee (2016); the <b>Goods and Services Tax</b> (2017); demonetisation of high-value notes (2016); financial inclusion through Jan Dhan accounts, Aadhaar and mobile phones; <b>digital public infrastructure</b> such as UPI; production-linked incentive (PLI) schemes for manufacturing; and labour codes. India is now among the world's <b>largest economies</b> and one of the fastest-growing major economies.</p>
<p style="margin-top:10px"><b>Structure and challenges</b>: services contribute the largest share of GDP, while agriculture still employs the largest share of the workforce, showing low productivity in farming. Challenges include creating enough productive <b>jobs</b> for a young population, raising <b>manufacturing</b>'s share, improving agricultural productivity, the large <b>informal sector</b>, regional and income <b>inequality</b>, health and education quality, infrastructure, the fiscal position, and climate change.</p>`,
      formula: "1951–2017: planning era (12 Five-Year Plans) · 1991: LPG reforms · 2015: NITI Aayog · 2016: IBC, MPC · 2017: GST<small>services lead output; agriculture leads employment</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Milestones</h4>" + tbl(["Year", "Event"], [["1951", "First Five-Year Plan"], ["1956", "Industrial Policy Resolution: leading role for the public sector"], ["Mid-1960s", "Green Revolution begins"], ["1969", "Nationalisation of 14 major banks"], ["1991", "Balance of payments crisis; LPG reforms"], ["1995", "India a founding member of the WTO"], ["2003", "FRBM Act"], ["2015", "NITI Aayog replaces the Planning Commission"], ["2016", "IBC; Monetary Policy Committee; demonetisation"], ["2017", "GST introduced"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Match each problem India faced in 1991 with the reform that addressed it:</p>" +
          tbl(["Problem in 1991", "Reform"], [["Foreign exchange reserves enough for only a few weeks of imports", "Devaluation of the rupee, then a market-determined exchange rate; IMF support"], ["Industrial licensing stifled investment", "Abolition of licensing for most industries"], ["High tariffs and import controls", "Steady tariff cuts and removal of quotas"], ["Restrictions on foreign capital", "Opening to FDI and FPI"], ["Large fiscal deficit", "Fiscal consolidation, later the FRBM Act"]]);
      },
      use: ["Learn the reform timeline in order; objective questions often test dates.", "Connect each reform to the problem it addressed.", "Mistake: saying agriculture has the largest share of GDP; it has the largest share of employment.", "Mistake: describing NITI Aayog as a planning body that allocates funds; it advises."],
      walk: function () { return [
        { t: "At independence", c: "Agrarian, poor, low industry.", h: chips(["Low income", "Weak industry", "Low literacy"], "hl") },
        { t: "Planning era", c: "12 Five-Year Plans, 1951–2017.", h: chips(["Public sector", "Green Revolution", "Licence raj"], "ac") },
        { t: "1991", c: "Crisis led to LPG reforms.", h: box("Liberalisation · Privatisation · Globalisation", "good") },
        { t: "Later reforms", c: "NITI Aayog, IBC, MPC, GST, UPI.", h: chips(["2015", "2016", "2017"], "ac") },
        { t: "Today", c: "Services lead output; jobs are the challenge.", h: chips(["Services", "Manufacturing", "Agriculture"], "mi") }]; },
      recap: ["India moved from planned, public-sector-led growth to market reforms after the 1991 crisis", "Later reforms (NITI Aayog, IBC, MPC, GST, digital infrastructure) and the challenge of productive jobs define the present"],
      qc: [{ q: "The 'Hindu rate of growth' refers to India's growth of about…", o: ["3.5% a year in the decades before 1980", "8% after 2003", "1% before independence", "6% in the 1990s"], a: 0, e: "A term coined by Raj Krishna." },
        { q: "Which sector employs the largest share of India's workforce?", o: ["Agriculture", "Services", "Manufacturing", "Construction"], a: 0, e: "Even though its share of GDP is smaller." }]
    }
  ];

  var MODULES = [
    { n: 1, title: "Introduction, Demand and Supply", sub: "Nature and scope of business economics, the central problems and the price mechanism, demand and elasticity, consumer behaviour and supply.", tag: "Module 1", short: "Demand & supply", takeaway: "Economics is about choice under scarcity. Demand slopes down and supply up; elasticity measures how strongly each responds, and consumers balance marginal utility against price." },
    { n: 2, title: "Production, Cost and Markets", sub: "Production function and the law of variable proportions, short- and long-run costs, market forms, price determination and equilibrium under each market form.", tag: "Module 2", short: "Production & markets", takeaway: "Firms produce in Stage II, watch MC against AVC and ATC, and maximise profit where MR = MC. Market structure decides whether price equals MC and whether profits last." },
    { n: 3, title: "National Income and Business Cycles", sub: "National income concepts and methods, the Keynesian theory of income determination and the multiplier, and business cycles.", tag: "Module 3", short: "National income", takeaway: "National income is NNP at factor cost. Aggregate demand sets output in the short run, magnified by the multiplier, and economies move through recurring cycles." },
    { n: 4, title: "Public Finance and Money", sub: "Fiscal functions and federal finance, market failure, the budget and deficits, fiscal policy, demand for and supply of money, and monetary policy.", tag: "Module 4", short: "Public finance & money", takeaway: "Governments allocate, redistribute and stabilise through budgets and fiscal policy. Money demand and supply, and the RBI's tools, shape interest rates and inflation." },
    { n: 5, title: "International Trade and the Indian Economy", sub: "Theories of trade, trade policy instruments, trade negotiations and the WTO, exchange rates, international capital movements, and the Indian economy.", tag: "Module 5", short: "Trade & India", takeaway: "Comparative advantage explains gains from trade; tariffs and other tools restrict it; exchange rates and capital flows link economies. India's growth story runs from planning to reform." }
  ];

  /* ================= FINAL TEST (30 questions across the 5 modules) ================= */
  var TEST = [
    { m: 1, q: "Opportunity cost is…", o: ["The value of the next best alternative given up", "The money paid for a good", "The total of all alternatives given up", "The cost of production"], a: 0, e: "Only the next best alternative counts." },
    { m: 1, q: "A production possibility curve is concave to the origin because of…", o: ["Increasing opportunity cost", "Constant returns", "Unlimited resources", "Decreasing opportunity cost"], a: 0, e: "Resources are not equally suited to both goods." },
    { m: 1, q: "Price falls from ₹10 to ₹8 and quantity demanded rises from 100 to 130. Price elasticity (percentage method) is…", o: ["1.5", "0.67", "3", "1"], a: 0, e: "30% ÷ 20% = 1.5." },
    { m: 1, q: "Negative income elasticity indicates…", o: ["An inferior good", "A luxury", "A necessity", "A complement"], a: 0, e: "Demand falls as income rises." },
    { m: 1, q: "A consumer is in equilibrium with two goods when…", o: ["MUx/Px = MUy/Py", "MUx = MUy", "Px = Py", "TUx = TUy"], a: 0, e: "The law of equi-marginal utility." },
    { m: 1, q: "A straight-line supply curve that meets the quantity axis when extended has elasticity…", o: ["Less than 1", "Equal to 1", "Greater than 1", "Infinite"], a: 0, e: "Through the origin: 1; price axis: > 1." },
    { m: 2, q: "A rational producer operates in which stage of the law of variable proportions?", o: ["Stage II", "Stage I", "Stage III", "Any stage"], a: 0, e: "Between maximum AP and MP = 0." },
    { m: 2, q: "Which cost does not affect marginal cost?", o: ["Fixed cost", "Variable cost", "Total cost", "Wages of casual labour"], a: 0, e: "MC = ΔTVC/ΔQ." },
    { m: 2, q: "The marginal cost curve cuts the AVC curve…", o: ["At its minimum point", "At its maximum point", "Where AFC is lowest", "Never"], a: 0, e: "And the ATC curve at its minimum too." },
    { m: 2, q: "Product differentiation and selling costs are features of…", o: ["Monopolistic competition", "Perfect competition", "Pure monopoly", "Monopsony"], a: 0, e: "Chamberlin's model." },
    { m: 2, q: "Qd = 100 − 2P and Qs = 10 + 4P. The equilibrium price is…", o: ["15", "10", "20", "25"], a: 0, e: "100 − 2P = 10 + 4P → P = 15." },
    { m: 2, q: "A competitive firm's short-run supply curve is the part of its MC curve above…", o: ["Minimum AVC", "Minimum ATC", "Minimum AFC", "The price"], a: 0, e: "Below min AVC, it shuts down." },
    { m: 2, q: "In long-run equilibrium under monopolistic competition, firms earn…", o: ["Normal profit, with excess capacity", "Supernormal profit", "Losses", "Normal profit at minimum LAC"], a: 0, e: "AR is tangent to LAC on its falling part." },
    { m: 3, q: "NNP at market prices minus net indirect taxes equals…", o: ["NNP at factor cost (national income)", "GDP at market prices", "Personal income", "GNP"], a: 0, e: "Net indirect taxes = indirect taxes − subsidies." },
    { m: 3, q: "Which is excluded from national income?", o: ["Old-age pensions", "Wages", "Rent", "Profits"], a: 0, e: "Transfer payments are not payments for current production." },
    { m: 3, q: "If MPS is 0.2, the investment multiplier is…", o: ["5", "0.2", "1.25", "4"], a: 0, e: "1 ÷ MPS." },
    { m: 3, q: "The balanced budget multiplier is…", o: ["1", "0", "1/(1 − MPC)", "MPC"], a: 0, e: "Equal rises in G and T raise income by the same amount." },
    { m: 3, q: "Which phase of the business cycle has the lowest level of activity?", o: ["Trough", "Peak", "Expansion", "Boom"], a: 0, e: "Recovery begins from the trough." },
    { m: 4, q: "Musgrave's stabilisation function is concerned with…", o: ["Employment and price stability", "Providing public goods", "Reducing inequality", "Collecting customs duties"], a: 0, e: "It uses fiscal policy against cycles." },
    { m: 4, q: "A good that is non-rival and non-excludable is…", o: ["A pure public good", "A merit good", "A private good", "A club good"], a: 0, e: "Free riders make markets under-supply it." },
    { m: 4, q: "Fiscal deficit minus interest payments is…", o: ["Primary deficit", "Revenue deficit", "Effective revenue deficit", "Monetised deficit"], a: 0, e: "It shows borrowing for current needs other than interest." },
    { m: 4, q: "Crowding out happens when…", o: ["Government borrowing raises interest rates and reduces private investment", "Imports replace domestic goods", "Exports fall", "Taxes fall"], a: 0, e: "A limitation of fiscal policy." },
    { m: 4, q: "In Fisher's equation MV = PT, V stands for…", o: ["Velocity of circulation of money", "Volume of transactions", "Value of output", "Variable cost"], a: 0, e: "T is the volume of transactions." },
    { m: 4, q: "Broad money M3 equals…", o: ["M1 + time deposits with banks", "M1 + post office savings deposits", "Currency + demand deposits", "Reserve money"], a: 0, e: "The RBI's main measure." },
    { m: 4, q: "India's inflation target under flexible inflation targeting is…", o: ["CPI inflation of 4%, with a band of ±2 percentage points", "WPI inflation of 5%", "CPI inflation of 2%", "Zero inflation"], a: 0, e: "The band is 2% to 6%." },
    { m: 5, q: "A country should specialise in the good in which it has…", o: ["A comparative advantage (lower opportunity cost)", "An absolute disadvantage", "The highest price", "The most labour"], a: 0, e: "Ricardo's theory." },
    { m: 5, q: "A fixed duty of ₹2,000 per tonne of steel imported is a…", o: ["Specific tariff", "Ad valorem tariff", "Quota", "Countervailing duty"], a: 0, e: "Ad valorem is a percentage of value." },
    { m: 5, q: "The WTO principle that requires equal treatment of all trading partners is…", o: ["Most-favoured-nation treatment", "National treatment", "Reciprocity", "Transparency"], a: 0, e: "National treatment compares foreign and domestic goods." },
    { m: 5, q: "If the exchange rate moves from ₹80/$ to ₹84/$, the rupee has…", o: ["Depreciated", "Appreciated", "Been revalued", "Stayed the same"], a: 0, e: "More rupees are needed for each dollar." },
    { m: 5, q: "NITI Aayog replaced the Planning Commission in…", o: ["2015", "1991", "2004", "2017"], a: 0, e: "1 January 2015." }
  ];
  var PASS = 0.7;

  var GLOSSARY = [
    ["Opportunity cost", "The value of the next best alternative given up.", "Choosing the outlet over the van", "1.1"],
    ["Positive economics", "Statements about what is; can be tested.", "Higher GST cut car sales", "1.1"],
    ["Normative economics", "Statements about what ought to be.", "Fuel should be subsidised", "1.1"],
    ["Production possibility curve", "Combinations of two goods possible with full use of resources.", "Rangpur's wheat and cloth", "1.2"],
    ["Price mechanism", "Allocation of resources through prices set by demand and supply.", "Shortage → price rises", "1.2"],
    ["Law of demand", "Quantity demanded falls as price rises, other things equal.", "Tea at ₹16 sells more than at ₹20", "1.3"],
    ["Price elasticity of demand", "% change in quantity demanded ÷ % change in price.", "40% ÷ 20% = 2", "1.3"],
    ["Cross elasticity", "Response of demand for one good to the price of another.", "Tea and coffee: positive", "1.3"],
    ["Giffen good", "An inferior good whose demand rises when its price rises.", "A staple for very poor households", "1.3"],
    ["Marginal utility", "Extra satisfaction from one more unit.", "₹30, ₹24, ₹18 …", "1.4"],
    ["Consumer surplus", "Willingness to pay minus price paid.", "₹72 − ₹45 = ₹27", "1.4"],
    ["Indifference curve", "Combinations giving equal satisfaction.", "Convex to the origin", "1.4"],
    ["Elasticity of supply", "% change in quantity supplied ÷ % change in price.", "40% ÷ 25% = 1.6", "1.5"],
    ["Marginal product", "Extra output from one more unit of a variable input.", "60 loaves from the 2nd baker", "2.1"],
    ["Law of variable proportions", "MP of a variable factor eventually falls when combined with a fixed factor.", "Three stages", "2.1"],
    ["Returns to scale", "Output response when all inputs change in the same proportion.", "α + β = 1: constant", "2.1"],
    ["Implicit cost", "Imputed value of the owner's own resources.", "Owner's foregone salary", "2.2"],
    ["Marginal cost", "Extra cost of one more unit of output.", "MC = ΔTC/ΔQ", "2.2"],
    ["Economies of scale", "Fall in long-run average cost as output grows.", "Bulk buying", "2.2"],
    ["Perfect competition", "Many sellers, identical product, free entry; firms are price takers.", "Wheat farmers", "2.3"],
    ["Oligopoly", "A few interdependent sellers.", "Telecom firms", "2.3"],
    ["Equilibrium price", "Price at which quantity demanded equals quantity supplied.", "₹20 for mangoes", "2.4"],
    ["Price ceiling", "A legal maximum price.", "Below equilibrium → shortage", "2.4"],
    ["Shut-down point", "Minimum AVC: below it a competitive firm stops production.", "P < min AVC", "2.5"],
    ["Price discrimination", "Charging different prices for the same product, not based on cost.", "Higher price in the less elastic market", "2.5"],
    ["GDP", "Value of final output produced within the domestic territory.", "₹9,300 crore", "3.1"],
    ["NFIA", "Net factor income from abroad.", "GNP = GDP + NFIA", "3.1"],
    ["National income", "NNP at factor cost.", "₹7,800 crore", "3.1"],
    ["MPC", "Share of extra income spent on consumption.", "0.8", "3.2"],
    ["Multiplier", "Ratio of the change in income to the change in investment.", "1/MPS = 5", "3.2"],
    ["Paradox of thrift", "Trying to save more can reduce income without raising total saving.", "Keynes", "3.2"],
    ["Business cycle", "Recurring expansion and contraction of economic activity.", "Peak and trough", "3.3"],
    ["Leading indicator", "A variable that changes before the economy does.", "Stock prices", "3.3"],
    ["Allocation function", "Providing public goods and correcting market failure.", "Highways", "4.1"],
    ["Finance Commission", "Constitutional body (Art. 280) recommending sharing of central taxes.", "Every five years", "4.1"],
    ["Externality", "A cost or benefit to third parties.", "Factory pollution", "4.2"],
    ["Free-rider problem", "People enjoy a good without paying for it.", "Street lighting", "4.2"],
    ["Fiscal deficit", "Total expenditure − (revenue receipts + non-debt capital receipts).", "₹16,000 crore", "4.3"],
    ["Primary deficit", "Fiscal deficit − interest payments.", "₹7,000 crore", "4.3"],
    ["Automatic stabilisers", "Taxes and transfers that change automatically with income.", "Unemployment benefits", "4.4"],
    ["Liquidity trap", "Very low interest rates at which money demand becomes perfectly elastic.", "Keynes", "4.5"],
    ["High-powered money", "Reserve money (M0), the base of the money supply.", "Currency + bank reserves", "4.6"],
    ["Money multiplier", "Ratio of money supply to high-powered money.", "(1 + c)/(c + r)", "4.6"],
    ["Repo rate", "Rate at which the RBI lends to banks against securities; the policy rate.", "Set by the MPC", "4.7"],
    ["Comparative advantage", "Lower opportunity cost in producing a good.", "Indus in cloth", "5.1"],
    ["Effective rate of protection", "Protection of domestic value added.", "35% for bicycles", "5.2"],
    ["Most-favoured-nation", "WTO rule: treat all members equally.", "Same tariff for all", "5.3"],
    ["Depreciation (currency)", "A market-driven fall in a currency's value.", "₹80 → ₹84 per $", "5.4"],
    ["FDI", "Cross-border investment with lasting interest and control.", "A new car plant", "5.5"],
    ["LPG reforms", "Liberalisation, privatisation and globalisation from 1991.", "Abolition of licensing", "5.6"]
  ];

  /* ================= ECONOMICS TOOLS ================= */
  function money(x) { return inr(x).replace(".00", ""); }
  function pct(x, d) { return fmt(x * 100, d === undefined ? 2 : d) + "%"; }
  function rows(id) { return val(id).split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean).map(function (l) { return l.split(/\s*[,|;\t]\s*/).map(Number); }); }
  function fg(x, d) { return Number(Number(x).toFixed(d === undefined ? 2 : d)).toLocaleString("en-IN"); }
  function need() { for (var i = 0; i < arguments.length; i++) if (!fin(arguments[i])) return false; return true; }
  function elWord(e) { e = Math.abs(e); return e === 0 ? "perfectly inelastic" : e < 0.999 ? "inelastic (< 1)" : e <= 1.001 ? "unitary (= 1)" : "elastic (> 1)"; }

  /* 1.2 PPC */
  TOOLS.ppf = { d: "Enter the PPC points, one per line as: good X (e.g. wheat), good Y (e.g. cloth), in order. Test any other combination to see whether it is on, inside or outside the curve.",
    b: function () { return ta("pp_in", "100, 0\n90, 10\n70, 20\n40, 30\n0, 40", 6, "Points (X, Y)") + g2(inp("pp_tx", "60", "Test point: X"), inp("pp_ty", "20", "Test point: Y")); },
    run: function () { var p = rows("pp_in"); if (p.length < 2 || p.some(function (r) { return r.length < 2 || !need(r[0], r[1]) || r[0] < 0 || r[1] < 0; })) return err("Enter at least two points as: X, Y.");
      p.sort(function (a, b) { return a[1] - b[1]; });
      var t = [], inc = true, last = -1;
      for (var i = 1; i < p.length; i++) { var dY = p[i][1] - p[i - 1][1], dX = p[i - 1][0] - p[i][0]; if (dY <= 0) return err("Each point should have more Y and less X than the one before."); var oc = dX / dY; if (oc < last - 1e-9) inc = false; last = oc; t.push([fmt(p[i - 1][0]) + ", " + fmt(p[i - 1][1]) + " → " + fmt(p[i][0]) + ", " + fmt(p[i][1]), fmt(dX) + " X for " + fmt(dY) + " Y", fmt(oc, 3) + " X per Y"]); }
      var h = tbl(["Move", "Given up", "Opportunity cost of 1 more Y"], t) + note(inc ? "Opportunity cost rises along the curve: the PPC is concave (bowed out)." : "Opportunity cost does not rise throughout: check the figures (a typical PPC shows increasing opportunity cost).");
      var tx = n("pp_tx"), ty = n("pp_ty");
      if (need(tx, ty)) { var cap = null; for (var j = 1; j < p.length; j++) if (ty >= p[j - 1][1] && ty <= p[j][1]) { cap = p[j - 1][0] + (p[j][0] - p[j - 1][0]) * (ty - p[j - 1][1]) / (p[j][1] - p[j - 1][1]); break; }
        var res = cap === null ? "outside (more Y than the economy can make)" : Math.abs(tx - cap) < 1e-6 ? "on the curve: efficient" : tx < cap ? "inside the curve: resources unemployed or used inefficiently (up to " + fmt(cap, 2) + " X is possible with " + fmt(ty) + " Y)" : "outside the curve: unattainable now (at most " + fmt(cap, 2) + " X with " + fmt(ty) + " Y)";
        h += kv([["Point (" + fmt(tx) + ", " + fmt(ty) + ")", res]]); }
      return h; } };

  /* 1.3 elasticity of demand */
  TOOLS.elastic = { d: "Price elasticity from two price-quantity points, plus income and cross elasticity (optional).",
    b: function () { return sub("Price elasticity") + g2(inp("el_p1", "20", "Original price (₹)"), inp("el_p2", "16", "New price (₹)")) + g2(inp("el_q1", "500", "Original quantity"), inp("el_q2", "700", "New quantity")) +
      sub("Income elasticity (optional)") + g2(inp("el_y1", "20000", "Original income (₹)"), inp("el_y2", "24000", "New income (₹)")) + g2(inp("el_yq1", "10", "Quantity before"), inp("el_yq2", "11", "Quantity after")) +
      sub("Cross elasticity (optional)") + g2(inp("el_c1", "100", "Price of the other good before (₹)"), inp("el_c2", "120", "Price of the other good after (₹)")) + g2(inp("el_cq1", "50", "Quantity of this good before"), inp("el_cq2", "55", "Quantity of this good after")); },
    run: function () { var p1 = n("el_p1"), p2 = n("el_p2"), q1 = n("el_q1"), q2 = n("el_q2"), h = "";
      if (need(p1, p2, q1, q2) && p1 > 0 && q1 > 0 && p1 !== p2) { var e = ((q2 - q1) / q1) / ((p2 - p1) / p1), arc = ((q2 - q1) / (q1 + q2)) / ((p2 - p1) / (p1 + p2)), te1 = p1 * q1, te2 = p2 * q2;
        var tom = (p2 < p1) === (te2 > te1) ? (Math.abs(te2 - te1) < 1e-9 ? "unchanged → unitary" : "moved opposite to price → elastic") : (Math.abs(te2 - te1) < 1e-9 ? "unchanged → unitary" : "moved with price → inelastic");
        h += kv([["% change in quantity", pct((q2 - q1) / q1)], ["% change in price", pct((p2 - p1) / p1)], ["Ep (percentage method)", fmt(Math.abs(e), 3) + " → " + elWord(e)], ["Ep (arc method)", fmt(Math.abs(arc), 3) + " → " + elWord(arc)], ["Total spending", money(te1) + " → " + money(te2) + ": " + tom]]); }
      else h += err("Price elasticity: enter two different prices and positive quantities.");
      var y1 = n("el_y1"), y2 = n("el_y2"), a = n("el_yq1"), b = n("el_yq2");
      if (need(y1, y2, a, b) && y1 > 0 && a > 0 && y1 !== y2) { var ey = ((b - a) / a) / ((y2 - y1) / y1); h += kv([["Income elasticity", fmt(ey, 3) + " → " + (ey < 0 ? "inferior good" : ey > 1 ? "normal good: luxury" : ey === 0 ? "neutral" : "normal good: necessity")]]); }
      var c1 = n("el_c1"), c2 = n("el_c2"), x1 = n("el_cq1"), x2 = n("el_cq2");
      if (need(c1, c2, x1, x2) && c1 > 0 && x1 > 0 && c1 !== c2) { var ec = ((x2 - x1) / x1) / ((c2 - c1) / c1); h += kv([["Cross elasticity", fmt(ec, 3) + " → " + (ec > 0 ? "substitutes" : ec < 0 ? "complements" : "unrelated")]]); }
      return h; } };

  /* 1.4 marginal utility and consumer surplus */
  TOOLS.utility = { d: "Enter the marginal utility (in rupees) of successive units and the price. The tool finds how many units the consumer buys and the consumer surplus.",
    b: function () { return g2(inp("ut_mu", "30, 24, 18, 12, 6", "Marginal utility of units 1, 2, 3 … (₹)", "", "text"), inp("ut_p", "15", "Price per unit (₹)")); },
    run: function () { var mu = nums(val("ut_mu")), p = n("ut_p"); if (!mu.length || !mu.every(fin) || !fin(p) || p < 0) return err("Enter marginal utilities and a price.");
      var k = 0, tu = 0, cs = 0, t = []; mu.forEach(function (m, i) { tu += m; var buy = m >= p && k === i; if (buy) { k++; cs += m - p; } t.push([String(i + 1), fmt(m), fmt(tu), buy ? fmt(m - p) : "not bought"]); });
      return tbl(["Unit", "MU (₹)", "TU (₹)", "Surplus (₹)"], t) + kv([["Units bought (MU ≥ price)", k], ["Willing to pay", money(mu.slice(0, k).reduce(function (s, x) { return s + x; }, 0))], ["Actually pays", money(k * p)], ["Consumer surplus", money(cs)]]) + (mu.some(function (m, i) { return i && m > mu[i - 1]; }) ? note("Marginal utility should normally diminish; check the schedule.") : ""); } };

  /* 1.5 elasticity of supply */
  TOOLS.supply = { d: "Enter two price-quantity points on a supply curve to measure the elasticity of supply and apply the geometric rule.",
    b: function () { return g2(inp("su_p1", "40", "Original price (₹)"), inp("su_p2", "50", "New price (₹)")) + g2(inp("su_q1", "300", "Original quantity supplied"), inp("su_q2", "420", "New quantity supplied")); },
    run: function () { var p1 = n("su_p1"), p2 = n("su_p2"), q1 = n("su_q1"), q2 = n("su_q2"); if (!need(p1, p2, q1, q2) || p1 <= 0 || q1 <= 0 || p1 === p2) return err("Enter two different prices and positive quantities.");
      var e = ((q2 - q1) / q1) / ((p2 - p1) / p1), arc = ((q2 - q1) / (q1 + q2)) / ((p2 - p1) / (p1 + p2)), rows = [["Es (percentage method)", fmt(e, 3) + " → " + elWord(e)], ["Es (arc method)", fmt(arc, 3)]];
      if (q2 !== q1) { var slope = (p2 - p1) / (q2 - q1), pint = p1 - slope * q1; rows.push(["Line extended meets", Math.abs(pint) < 1e-9 ? "the origin → Es = 1 everywhere" : pint > 0 ? "the price axis at ₹" + fmt(pint, 2) + " → Es > 1" : "the quantity axis at " + fmt(q1 - p1 / slope, 2) + " units → Es < 1"]); }
      if (e < 0) rows.push(["Note", "Negative elasticity of supply is unusual; check the figures."]);
      return kv(rows); } };

  /* 2.1 production */
  TOOLS.product = { d: "Enter total product for 1, 2, 3 … units of the variable input. The tool finds AP, MP and the three stages.",
    b: function () { return inp("pr_tp", "40, 100, 150, 180, 190, 190, 175", "Total product for 1, 2, 3 … workers", "", "text"); },
    run: function () { var tp = nums(val("pr_tp")); if (tp.length < 3 || !tp.every(fin)) return err("Enter at least three total product figures.");
      var ap = tp.map(function (x, i) { return x / (i + 1); }), mp = tp.map(function (x, i) { return x - (i ? tp[i - 1] : 0); }), mx = Math.max.apply(null, ap), endI = ap.lastIndexOf(mx) + 1, endII = -1;
      for (var i = 0; i < mp.length; i++) if (mp[i] <= 0) { endII = i; break; }
      var iMax = ap.lastIndexOf(mx), st = tp.map(function (x, k) { return mp[k] < 0 ? "III" : mp[k] === 0 ? "II (ends: MP = 0)" : k < iMax ? "I" : k === iMax ? "I ends (max AP)" : "II"; });
      return tbl(["Workers", "TP", "AP", "MP", "Stage"], tp.map(function (x, i) { return [String(i + 1), fmt(x), fmt(ap[i], 2), fmt(mp[i]), st[i]]; })) +
        kv([["AP is maximum", fmt(mx, 2) + " at " + (ap.indexOf(mx) === ap.lastIndexOf(mx) ? ap.indexOf(mx) + 1 : (ap.indexOf(mx) + 1) + "–" + (ap.lastIndexOf(mx) + 1)) + " workers (Stage I ends)"], ["MP reaches zero or below", endII >= 0 ? "at " + (endII + 1) + " workers (Stage II ends)" : "not within this range"], ["Rational range", "Stage II: from maximum AP to MP = 0"]]); } };

  /* 2.2 costs */
  TOOLS.cost = { d: "Enter total fixed cost and the total variable cost for outputs 1, 2, 3 …. Optionally enter a market price to find the profit-maximising output for a competitive firm.",
    b: function () { return g2(inp("cs_f", "600", "Total fixed cost (₹)"), inp("cs_p", "500", "Market price (₹, optional)")) + inp("cs_v", "400, 700, 900, 1200, 1700, 2400", "Total variable cost for output 1, 2, 3 … (₹)", "", "text"); },
    run: function () { var f = n("cs_f"), v = nums(val("cs_v")), p = n("cs_p"); if (!fin(f) || f < 0 || v.length < 2 || !v.every(fin)) return err("Enter fixed cost and at least two variable cost figures.");
      var rowsT = v.map(function (x, i) { var q = i + 1, tc = f + x, mc = x - (i ? v[i - 1] : 0); return { q: q, tvc: x, tc: tc, afc: f / q, avc: x / q, atc: tc / q, mc: mc }; });
      var mAVC = rowsT.reduce(function (b, r) { return r.avc < b.avc ? r : b; }), mATC = rowsT.reduce(function (b, r) { return r.atc < b.atc ? r : b; });
      var h = tbl(["Q", "TVC", "TC", "AFC", "AVC", "ATC", "MC"], rowsT.map(function (r) { return [String(r.q), fmt(r.tvc), fmt(r.tc), fmt(r.afc, 2), fmt(r.avc, 2), fmt(r.atc, 2), fmt(r.mc)]; })) + kv([["Minimum AVC (shut-down point)", money(mAVC.avc) + " at Q = " + mAVC.q], ["Minimum ATC (break-even point)", money(mATC.atc) + " at Q = " + mATC.q]]);
      if (fin(p) && p > 0) { var best = null; rowsT.forEach(function (r) { var pr = p * r.q - r.tc; if (!best || pr >= best.pr - 1e-9) best = { q: r.q, pr: pr, avc: r.avc }; });
        h += sub("At a price of " + money(p)) + kv([["Profit-maximising output (P = MC, MC rising)", best.q], ["Profit (+) or loss (−)", money(best.pr)], ["Decision", p < mAVC.avc ? "Price below minimum AVC: shut down (loss = fixed cost " + money(f) + ")" : best.pr >= 0 ? "Produce: price covers ATC" : "Produce in the short run: price covers AVC and part of fixed cost"]]); }
      return h; } };

  /* 2.4 equilibrium */
  TOOLS.equil = { d: "Straight-line demand Qd = a − bP and supply Qs = c + dP. Find the equilibrium, then test a price ceiling, a price floor or a per-unit tax on sellers.",
    b: function () { return g2(inp("eq_a", "1200", "a (demand intercept)"), inp("eq_b", "20", "b (demand slope)")) + g2(inp("eq_c", "200", "c (supply intercept)"), inp("eq_d", "30", "d (supply slope)")) + g3(inp("eq_ce", "15", "Price ceiling (₹, optional)"), inp("eq_fl", "25", "Price floor (₹, optional)"), inp("eq_t", "0", "Tax per unit on sellers (₹, optional)")); },
    run: function () { var a = n("eq_a"), b = n("eq_b"), c = n("eq_c"), d = n("eq_d"); if (!need(a, b, c, d) || b < 0 || d < 0 || b + d === 0) return err("Enter a, b, c and d (slopes not negative).");
      var P = (a - c) / (b + d), Q = a - b * P; if (P < 0 || Q < 0) return err("These curves do not meet at a positive price and quantity.");
      var h = kv([["Equilibrium price P*", money(P)], ["Equilibrium quantity Q*", fmt(Q, 2)]]), ce = n("eq_ce"), fl = n("eq_fl"), t = n("eq_t");
      if (fin(ce) && val("eq_ce").trim()) { var qd = a - b * ce, qs = c + d * ce; h += kv([["Ceiling at " + money(ce), ce >= P ? "Above equilibrium: no effect" : "Qd = " + fmt(qd, 2) + ", Qs = " + fmt(qs, 2) + " → shortage of " + fmt(qd - qs, 2)]]); }
      if (fin(fl) && val("eq_fl").trim()) { var qd2 = a - b * fl, qs2 = c + d * fl; h += kv([["Floor at " + money(fl), fl <= P ? "Below equilibrium: no effect" : "Qd = " + fmt(qd2, 2) + ", Qs = " + fmt(qs2, 2) + " → surplus of " + fmt(qs2 - qd2, 2)]]); }
      if (fin(t) && t > 0) { var Pb = (a - c + d * t) / (b + d), Qt = a - b * Pb; h += sub("Tax of " + money(t) + " per unit") + kv([["Price buyers pay", money(Pb)], ["Price sellers keep", money(Pb - t)], ["New quantity", fmt(Qt, 2)], ["Buyers' share of the tax", pct((Pb - P) / t, 1)], ["Sellers' share", pct((P - (Pb - t)) / t, 1)], ["Tax revenue", money(t * Qt)]]) + note("The side with the less elastic curve bears more of the tax."); }
      return h; } };

  /* 2.5 firm equilibrium */
  TOOLS.firmeq = { d: "Cost: TC = F + cQ + eQ². Choose the market form. A monopolist faces demand P = a − bQ; a competitive firm takes the price as given.",
    b: function () { return g3(sel("fe_m", [["mono", "Monopoly"], ["pc", "Perfect competition"]], "mono", "Market form"), inp("fe_a", "100", "Demand: a (monopoly)"), inp("fe_b", "2", "Demand: b (monopoly)")) + g3(inp("fe_F", "200", "Fixed cost F (₹)"), inp("fe_c", "20", "c"), inp("fe_e", "0", "e")) + inp("fe_p", "60", "Market price (₹, competition)"); },
    run: function () { var m = val("fe_m"), F = n("fe_F"), c = n("fe_c"), e = n("fe_e"); if (!need(F, c, e) || F < 0 || e < 0) return err("Enter F, c and e (not negative).");
      function TC(q) { return F + c * q + e * q * q; }
      if (m === "mono") { var a = n("fe_a"), b = n("fe_b"); if (!need(a, b) || b <= 0 || a <= c) return err("Enter a demand curve with a > c and b > 0.");
        var Q = (a - c) / (2 * b + 2 * e), P = a - b * Q, pr = P * Q - TC(Q), Qc = (a - c) / (b + 2 * e), Pc = a - b * Qc;
        return steps(["MR = " + fmt(a) + " − " + fmt(2 * b) + "Q; MC = " + fmt(c) + (e ? " + " + fmt(2 * e) + "Q" : ""), "MR = MC → Q = " + fmt(Q, 2), "Price from demand: P = " + fmt(a) + " − " + fmt(b) + " × " + fmt(Q, 2) + " = " + money(P), "Profit = TR − TC = " + money(P * Q) + " − " + money(TC(Q)) + " = " + money(pr)]) + kv([["Price elasticity at equilibrium", fmt(P / (b * Q), 2) + " (> 1: on the elastic part)"], ["Competitive outcome (P = MC)", "Q = " + fmt(Qc, 2) + " at " + money(Pc)], ["Deadweight loss", money(0.5 * (P - (c + 2 * e * Q)) * (Qc - Q))]]); }
      var p = n("fe_p"); if (!fin(p) || p <= 0) return err("Enter the market price.");
      if (e === 0) return p > c ? err("With constant MC (e = 0) below the price, output has no limit; enter e > 0 for rising MC.") : kv([["Decision", p < c ? "Price below AVC: shut down" : "Price = MC at every output: any output earns the same"]]);
      var Qp = (p - c) / (2 * e), pr2 = p * Qp - TC(Qp), avc = c + e * Qp;
      return steps(["P = MC: " + fmt(p) + " = " + fmt(c) + " + " + fmt(2 * e) + "Q → Q = " + fmt(Qp, 2), "TR = " + money(p * Qp) + "; TC = " + money(TC(Qp)), "Profit = " + money(pr2)]) + kv([["AVC at this output", money(avc)], ["Minimum ATC", money(c + 2 * Math.sqrt(F * e)) + " at Q = " + fmt(Math.sqrt(F / e), 2)], ["Decision", p < c ? "Shut down: price below minimum AVC" : pr2 >= 0 ? (pr2 > 1e-6 ? "Supernormal profit: in the long run, entry will push price down" : "Normal profit") : "Loss, but stay open in the short run: price covers AVC"]]); } };

  /* 3.1 national income */
  var NI = [["ni_c", "Private final consumption (C)", "6000"], ["ni_g", "Government final consumption (G)", "1500"], ["ni_i", "Gross investment (I)", "2000"], ["ni_x", "Exports (X)", "1200"], ["ni_m", "Imports (M)", "1400"], ["ni_d", "Depreciation", "700"], ["ni_f", "Net factor income from abroad (can be negative)", "-100"], ["ni_t", "Indirect taxes", "900"], ["ni_s", "Subsidies", "200"]];
  TOOLS.nia = { d: "Enter the expenditure figures and adjustments (₹ crore) to derive every national income aggregate.",
    b: function () { return '<div class="grid g3">' + NI.map(function (f) { return inp(f[0], f[2], f[1]); }).join("") + "</div>"; },
    run: function () { var v = {}; for (var i = 0; i < NI.length; i++) { var x = n(NI[i][0]); if (!fin(x)) return err("Enter all nine figures (0 if none)."); v[NI[i][0]] = x; }
      var gdp = v.ni_c + v.ni_g + v.ni_i + v.ni_x - v.ni_m, nit = v.ni_t - v.ni_s, gnp = gdp + v.ni_f, ndp = gdp - v.ni_d, nnp = gnp - v.ni_d;
      return tbl(["Aggregate", "Market prices", "Factor cost"], [["Gross domestic product", fg(gdp), fg(gdp - nit)], ["Gross national product", fg(gnp), fg(gnp - nit)], ["Net domestic product", fg(ndp), fg(ndp - nit)], ["Net national product", fg(nnp), "<b>" + fg(nnp - nit) + "</b> (national income)"]]) +
        steps(["GDP at MP = C + G + I + (X − M) = " + fg(gdp), "GNP = GDP + NFIA (" + fg(v.ni_f) + ") = " + fg(gnp), "NNP = GNP − depreciation = " + fg(nnp), "NNP at FC = NNP at MP − (indirect taxes − subsidies) = " + fg(nnp) + " − " + fg(nit) + " = " + fg(nnp - nit)]); } };

  /* 3.2 Keynesian multiplier */
  TOOLS.multiplier = { d: "C = a + b(Y − T). Enter the values (₹ crore) to find equilibrium income and the effect of a change in investment, government spending or taxes.",
    b: function () { return g3(inp("mu_a", "200", "Autonomous consumption a"), inp("mu_b", "0.8", "MPC b"), inp("mu_i", "300", "Investment I")) + g3(inp("mu_g", "0", "Government spending G"), inp("mu_t", "0", "Lump-sum taxes T"), inp("mu_x", "0", "Net exports (autonomous)")) + g3(inp("mu_m", "0", "Marginal propensity to import m"), inp("mu_di", "100", "Change in I or G"), inp("mu_dt", "0", "Change in T")); },
    run: function () { var a = n("mu_a"), b = n("mu_b"), I = n("mu_i"), G = n("mu_g") || 0, T = n("mu_t") || 0, X = n("mu_x") || 0, m = n("mu_m") || 0, dI = n("mu_di") || 0, dT = n("mu_dt") || 0;
      if (!need(a, b, I) || b <= 0 || b >= 1 || m < 0 || 1 - b + m <= 0) return err("Enter a, I and an MPC between 0 and 1.");
      var den = 1 - b + m, Y = (a - b * T + I + G + X) / den, k = 1 / den, kt = -b / den, Y2 = Y + k * dI + kt * dT, C = a + b * (Y - T);
      return kv([["Equilibrium income Y*", fg(Y, 2)], ["Consumption at Y*", fg(C, 2)], ["Saving (Y − T − C)", fg(Y - T - C, 2)], ["Spending multiplier 1/(1 − b + m)", fmt(k, 3)], ["Tax multiplier −b/(1 − b + m)", fmt(kt, 3)], ["New income after the changes", fg(Y2, 2) + " (change " + fg(Y2 - Y, 2) + ")"]]) + (m === 0 && G === 0 && T === 0 && X === 0 ? note("Two-sector check: saving " + fg(Y - C, 2) + " = investment " + fg(I, 2) + ".") : ""); } };

  /* 4.3 deficits */
  var DF = [["df_rr", "Revenue receipts", "26000"], ["df_re", "Revenue expenditure", "33000"], ["df_in", "of which interest payments", "9000"], ["df_gr", "Grants for creation of capital assets (in revenue exp.)", "3000"], ["df_ce", "Capital expenditure", "10000"], ["df_rl", "Recovery of loans", "300"], ["df_di", "Disinvestment and other non-debt capital receipts", "700"], ["df_gdp", "GDP (optional, for % of GDP)", "200000"]];
  TOOLS.deficit = { d: "Enter budget figures (₹ crore) to calculate the four deficit measures.",
    b: function () { return '<div class="grid g3">' + DF.map(function (f) { return inp(f[0], f[2], f[1]); }).join("") + "</div>"; },
    run: function () { var v = {}; for (var i = 0; i < DF.length - 1; i++) { var x = n(DF[i][0]); if (!fin(x) || x < 0) return err("Enter all budget figures (0 if none)."); v[DF[i][0]] = x; }
      var gdp = n("df_gdp"), rd = v.df_re - v.df_rr, erd = rd - v.df_gr, fd = v.df_re + v.df_ce - v.df_rr - v.df_rl - v.df_di, pd = fd - v.df_in;
      function g(x) { return fin(gdp) && gdp > 0 ? " (" + pct(x / gdp) + " of GDP)" : ""; }
      return kv([["Revenue deficit", fg(rd) + g(rd)], ["Effective revenue deficit", fg(erd) + g(erd)], ["Fiscal deficit (= borrowing)", fg(fd) + g(fd)], ["Primary deficit", fg(pd) + g(pd)]]) + steps(["RD = revenue expenditure − revenue receipts", "ERD = RD − grants for creation of capital assets", "FD = total expenditure − revenue receipts − non-debt capital receipts", "PD = FD − interest payments"]); } };

  /* 4.5 quantity theory */
  TOOLS.qtm = { d: "Fisher's MV = PT and the Cambridge Md = kPY. Change the money supply to see the effect on prices, with V and T held constant.",
    b: function () { return g3(inp("qt_m", "5000", "Money supply M"), inp("qt_v", "4", "Velocity V"), inp("qt_t", "10000", "Transactions T")) + inp("qt_m2", "10000", "New money supply"); },
    run: function () { var M = n("qt_m"), V = n("qt_v"), T = n("qt_t"), M2 = n("qt_m2"); if (!need(M, V, T) || M <= 0 || V <= 0 || T <= 0) return err("Enter positive M, V and T.");
      var P = M * V / T, h = kv([["Price level P = MV/T", fg(P, 4)], ["Cambridge k = 1/V", fmt(1 / V, 4)], ["Nominal income PT (= MV)", fg(M * V)], ["Money demanded kPT", fg(M * V / V) + " (= M in equilibrium)"]]);
      if (fin(M2) && M2 > 0) { var P2 = M2 * V / T; h += kv([["New price level", fg(P2, 4)], ["Change in money supply", pct((M2 - M) / M)], ["Change in price level", pct((P2 - P) / P) + " (proportional, as the theory predicts)"]]); }
      return h; } };

  /* 4.6 money multiplier */
  TOOLS.mmult = { d: "Money supply = money multiplier × high-powered money, with m = (1 + c) ÷ (c + r).",
    b: function () { return g3(inp("mm_h", "2000", "High-powered money H (₹ crore)"), inp("mm_c", "0.2", "Currency-deposit ratio c"), inp("mm_r", "0.1", "Reserve ratio r")) + inp("mm_r2", "0.05", "New reserve ratio (optional)"); },
    run: function () { var H = n("mm_h"), c = n("mm_c"), r = n("mm_r"), r2 = n("mm_r2"); if (!need(H, c, r) || H <= 0 || c < 0 || r <= 0 || r > 1) return err("Enter H, c ≥ 0 and r between 0 and 1.");
      var m = (1 + c) / (c + r), D = H / (c + r), h = kv([["Money multiplier", fmt(m, 3)], ["Money supply", fg(m * H, 2)], ["Deposits", fg(D, 2)], ["Currency with the public", fg(c * D, 2)], ["Bank reserves", fg(r * D, 2)], ["Simple deposit multiplier 1/r", fmt(1 / r, 3)]]);
      if (fin(r2) && r2 > 0 && val("mm_r2").trim()) { var m2 = (1 + c) / (c + r2); h += kv([["New multiplier", fmt(m2, 3)], ["New money supply", fg(m2 * H, 2) + " (" + (m2 > m ? "+" : "") + pct((m2 - m) / m) + ")"]]); }
      return h; } };

  /* 5.1 comparative advantage */
  TOOLS.compadv = { d: "Labour hours needed per unit of each good in two countries. The tool finds absolute and comparative advantage and checks whether proposed terms of trade benefit both.",
    b: function () { return g2(inp("ca_n1", "Indus", "Country A", "", "text"), inp("ca_n2", "Delta", "Country B", "", "text")) + g2(inp("ca_g1", "Cloth", "Good 1", "", "text"), inp("ca_g2", "Wheat", "Good 2", "", "text")) + g2(inp("ca_a1", "10", "A: hours per unit of good 1"), inp("ca_a2", "20", "A: hours per unit of good 2")) + g2(inp("ca_b1", "30", "B: hours per unit of good 1"), inp("ca_b2", "40", "B: hours per unit of good 2")) + inp("ca_tot", "1.6", "Terms of trade: units of good 1 per unit of good 2"); },
    run: function () { var A = val("ca_n1") || "A", B = val("ca_n2") || "B", G1 = val("ca_g1") || "good 1", G2 = val("ca_g2") || "good 2", a1 = n("ca_a1"), a2 = n("ca_a2"), b1 = n("ca_b1"), b2 = n("ca_b2"), tt = n("ca_tot");
      if (!need(a1, a2, b1, b2) || [a1, a2, b1, b2].some(function (x) { return x <= 0; })) return err("Enter positive labour hours.");
      var oA = a1 / a2, oB = b1 / b2; A = esc(A); B = esc(B); G1 = esc(G1); G2 = esc(G2);
      var rowsT = [["Absolute advantage in " + G1, a1 < b1 ? A : b1 < a1 ? B : "neither"], ["Absolute advantage in " + G2, a2 < b2 ? A : b2 < a2 ? B : "neither"], ["Opportunity cost of 1 " + G1, A + ": " + fmt(oA, 3) + " " + G2 + " · " + B + ": " + fmt(oB, 3) + " " + G2], ["Opportunity cost of 1 " + G2, A + ": " + fmt(1 / oA, 3) + " " + G1 + " · " + B + ": " + fmt(1 / oB, 3) + " " + G1]];
      if (Math.abs(oA - oB) < 1e-12) return kv(rowsT) + note("Opportunity costs are equal: there is no comparative advantage and no gain from trade.");
      var aG = oA < oB ? G1 : G2, bG = oA < oB ? G2 : G1, lo = Math.min(1 / oA, 1 / oB), hi = Math.max(1 / oA, 1 / oB);
      rowsT.push([A + " should specialise in", aG], [B + " should specialise in", bG], ["Mutually beneficial terms of trade", "1 " + G2 + " = between " + fmt(lo, 3) + " and " + fmt(hi, 3) + " " + G1]);
      if (fin(tt) && tt > 0) rowsT.push(["At 1 " + G2 + " = " + fmt(tt, 3) + " " + G1, tt > lo && tt < hi ? "Both countries gain ✓" : tt === lo || tt === hi ? "One country gains nothing" : "One country would lose: outside the range"]);
      return kv(rowsT); } };

  /* 5.2 tariffs */
  TOOLS.tariff = { d: "Part A: customs duty under specific, ad valorem and compound tariffs. Part B: the effective rate of protection.",
    b: function () { return sub("A. Duty payable") + g2(inp("tf_v", "500000", "Value of imports (₹)"), inp("tf_u", "100", "Number of units")) + g2(inp("tf_av", "10", "Ad valorem rate %"), inp("tf_sp", "500", "Specific duty per unit (₹)")) +
      sub("B. Effective rate of protection") + g3(inp("tf_p", "10000", "Free-trade price of the final good (₹)"), inp("tf_in", "6000", "Imported inputs at free-trade prices (₹)"), inp("tf_t", "20", "Tariff on the final good %")) + inp("tf_ti", "10", "Tariff on inputs %"); },
    run: function () { var h = "", v = n("tf_v"), u = n("tf_u"), av = n("tf_av") / 100, sp = n("tf_sp");
      if (need(v, u, av, sp) && v >= 0 && u >= 0) h += kv([["Ad valorem duty", money(v * av)], ["Specific duty", money(u * sp)], ["Compound duty (both)", money(v * av + u * sp)], ["Compound duty as % of value", v > 0 ? pct((v * av + u * sp) / v) : "—"]]);
      var p = n("tf_p"), inp_ = n("tf_in"), t = n("tf_t") / 100, ti = n("tf_ti") / 100;
      if (need(p, inp_, t, ti) && p > 0 && inp_ >= 0 && inp_ < p) { var a = inp_ / p, va0 = p - inp_, va1 = p * (1 + t) - inp_ * (1 + ti), erp = (va1 - va0) / va0;
        h += steps(["Value added at free-trade prices = " + money(p) + " − " + money(inp_) + " = " + money(va0), "With tariffs: " + money(p * (1 + t)) + " − " + money(inp_ * (1 + ti)) + " = " + money(va1), "ERP = (" + money(va1) + " − " + money(va0) + ") ÷ " + money(va0) + " = " + pct(erp), "Formula: (t − a·ti) ÷ (1 − a) = (" + fmt(t, 3) + " − " + fmt(a, 3) + " × " + fmt(ti, 3) + ") ÷ " + fmt(1 - a, 3) + " = " + pct((t - a * ti) / (1 - a))]) + note(erp > t ? "Effective protection exceeds the nominal tariff (tariff escalation)." : "Effective protection is not above the nominal tariff."); }
      return h || err("Enter the figures."); } };

  /* 5.4 exchange rates */
  TOOLS.fx = { d: "Enter direct quotes (₹ per $) to see appreciation or depreciation of each currency, a cross rate and a conversion.",
    b: function () { return g3(inp("fx_o", "80", "Old rate (₹ per $)"), inp("fx_n", "84", "New rate (₹ per $)"), inp("fx_e", "1.10", "$ per € (for the cross rate)")) + inp("fx_a", "10000", "Amount in $ to convert"); },
    run: function () { var o = n("fx_o"), nw = n("fx_n"), e = n("fx_e"), a = n("fx_a"); if (!need(o, nw) || o <= 0 || nw <= 0) return err("Enter both rates.");
      var dol = (nw - o) / o, rup = (1 / nw - 1 / o) / (1 / o), rows = [["Dollar", (dol >= 0 ? "appreciated " : "depreciated ") + pct(Math.abs(dol))], ["Rupee", (rup >= 0 ? "appreciated " : "depreciated ") + pct(Math.abs(rup))], ["Indirect quote", "$" + fmt(1 / o, 5) + " → $" + fmt(1 / nw, 5) + " per ₹"]];
      if (fin(e) && e > 0) rows.push(["Cross rate ₹ per €", "₹" + fmt(nw * e, 2)]);
      if (fin(a) && a > 0) rows.push(["$" + fmt(a) + " in rupees", money(a * o) + " → " + money(a * nw) + " (" + (nw > o ? "an exporter gains " : "an exporter loses ") + money(Math.abs(a * (nw - o))) + ")"]);
      return kv(rows) + note("The two percentages differ because each is measured on its own currency's base."); } };

  /* ================= CSEET PAPER 3: NEW LESSONS (Unit 4 and Part B) =================
     Fictional examples: Kavya Organics (a start-up), Nimbus Paper Products Ltd (a listed company). */
  var NEWL = {
    "2.3": {
      id: "2.3", mod: 2, ch: "Unit 4 (Indian financial markets)", title: "Indian Financial Markets", time: "18 min", tool: "sort",
      tcfg: { d: "Which part of the financial system does each item belong to?", buckets: ["Bank", "NBFC", "Development finance institution", "Capital market"], items: [
        ["A regional rural bank lending to farmers in a district", "Bank", "RRBs are scheduled banks, jointly owned by the Centre, a state and a sponsor bank."],
        ["A company that gives vehicle loans but cannot offer cheque books", "NBFC", "NBFCs lend but cannot accept demand deposits or issue cheques drawn on themselves."],
        ["SIDBI refinancing banks that lend to small industries", "Development finance institution", "SIDBI (1990) is the principal DFI for the MSME sector."],
        ["A company raising money through an IPO of equity shares", "Capital market", "The primary capital market is where new securities are issued."],
        ["A small finance bank opening savings accounts in a small town", "Bank", "Small finance banks are licensed by the RBI to serve under-served customers."],
        ["Investors buying and selling listed debentures on the NSE", "Capital market", "Trading in existing securities is the secondary market."],
        ["IFCI providing long-term loans to industry", "Development finance institution", "IFCI (1948) was India's first DFI."]] },
      outcomes: ["Describe the structure of India's financial system and the role of the RBI and SEBI", "Distinguish public, private, regional rural, co-operative, small finance and payments banks", "Explain what NBFCs and development finance institutions such as IFCI and SIDBI do", "Explain shares and debentures, and the main sources of finance for MSMEs and start-ups"],
      notes: `<p>The <b>financial system</b> moves savings from households to businesses and government. It has <b>institutions</b> (banks, NBFCs, insurers, mutual funds, development finance institutions), <b>markets</b> (the money market for short-term funds and the capital market for long-term funds), <b>instruments</b> (deposits, loans, shares, debentures, bonds) and <b>regulators</b>: the <b>RBI</b> (banks, NBFCs and the money market), <b>SEBI</b> (the securities market), <b>IRDAI</b> (insurance) and <b>PFRDA</b> (pensions).</p>
<p style="margin-top:10px"><b>Banks.</b> <b>Public sector banks</b> are majority-owned by the government (fourteen large banks were nationalised in 1969 and six more in 1980; mergers since 2017 have produced fewer, larger banks). <b>Private sector banks</b> are owned by private shareholders. <b>Regional rural banks</b> (from 1975) serve rural areas and are owned by the Centre, the state government and a sponsor bank. <b>Co-operative banks</b> are owned by their members and serve local communities. <b>Small finance banks</b> lend mainly to small businesses and low-income customers, and <b>payments banks</b> accept small deposits and handle payments but cannot lend.</p>
<p style="margin-top:10px"><b>NBFCs</b> (non-banking financial companies) are companies registered under the Companies Act that lend, lease or invest, and are regulated by the RBI. Unlike banks they cannot accept <b>demand deposits</b>, cannot issue cheques drawn on themselves, and their deposits are not covered by deposit insurance. <b>Development finance institutions</b> provide long-term finance for development: <b>IFCI</b> (1948, the first DFI), <b>NABARD</b> (1982, agriculture and rural development), <b>EXIM Bank</b> (1982, foreign trade), <b>SIDBI</b> (1990, micro, small and medium enterprises) and <b>NaBFID</b> (2021, infrastructure).</p>
<p style="margin-top:10px"><b>Capital market.</b> Companies raise long-term funds in the <b>primary market</b> (public issues such as IPOs, rights issues, private placements) and investors trade existing securities in the <b>secondary market</b> (stock exchanges such as the BSE and the NSE). <b>Equity shares</b> make the holder an <b>owner</b> with voting rights and a share of residual profit; <b>preference shares</b> carry a fixed dividend paid before equity; <b>debentures</b> make the holder a <b>creditor</b> who earns fixed interest whether or not there is profit. <b>MSMEs and start-ups</b> raise funds from bank loans (including MUDRA loans under the Pradhan Mantri MUDRA Yojana, 2015), credit guarantees (CGTMSE), invoice discounting on <b>TReDS</b> platforms, SIDBI's Fund of Funds for Startups, angel investors and venture capital, and the SME platforms of stock exchanges.</p>`,
      formula: "Regulators: RBI (banks, NBFCs) · SEBI (securities) · IRDAI (insurance) · PFRDA (pensions)<small>shareholder = owner · debenture holder = creditor</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Development finance institutions</h4>" + tbl(["Institution", "Year", "Focus"], [["IFCI", "1948", "Long-term industrial finance (first DFI)"], ["NABARD", "1982", "Agriculture and rural development"], ["EXIM Bank", "1982", "Exports and imports"], ["SIDBI", "1990", "Micro, small and medium enterprises"], ["NaBFID", "2021", "Infrastructure"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Kavya Organics, a two-year-old start-up making organic soaps, needs money at three stages. Which source fits each?</p>" +
          tbl(["Need", "Suitable source", "Why"], [["₹4 lakh to buy a mixing machine", "A MUDRA loan from a bank", "Small business loans without collateral under PMMY"], ["₹2 crore to expand into five states", "Venture capital or angel investors", "Equity for a fast-growing business without a long profit record"], ["Cash stuck in 90-day invoices from a large retailer", "Invoice discounting on TReDS", "Gets paid early against approved invoices"], ["₹25 crore, three years later", "An IPO on an SME exchange platform", "Raises public equity once the business has a track record"]]);
      },
      use: ["Link each body to its regulator: banks and NBFCs to the RBI, securities to SEBI.", "Remember the DFIs by year and sector; objective questions often ask which one serves MSMEs (SIDBI).", "Mistake: calling a debenture holder an owner; he is a creditor.", "Mistake: saying NBFCs can accept demand deposits; they cannot."],
      walk: function () { return [
        { t: "The system", c: "Savers → institutions and markets → users.", h: chips(["Institutions", "Markets", "Instruments", "Regulators"], "ac") },
        { t: "Banks", c: "Six kinds, all under the RBI.", h: chips(["Public", "Private", "RRB", "Co-operative", "Small finance", "Payments"], "hl") },
        { t: "NBFCs and DFIs", c: "Lend, but no demand deposits; DFIs give long-term finance.", h: chips(["IFCI 1948", "NABARD 1982", "SIDBI 1990"], "ac") },
        { t: "Capital market", c: "Primary issues and secondary trading.", h: box("Shares = ownership · Debentures = debt", "good") },
        { t: "MSMEs and start-ups", c: "MUDRA, CGTMSE, TReDS, VC, SME platforms.", h: chips(["Loans", "Guarantees", "Equity"], "mi") }]; },
      recap: ["The RBI regulates banks and NBFCs and SEBI the securities market; DFIs such as IFCI, NABARD and SIDBI give long-term finance", "Shareholders own, debenture holders lend; MSMEs and start-ups use MUDRA, guarantees, TReDS, venture capital and SME exchanges"],
      qc: [{ q: "Which institution is the principal development finance institution for the MSME sector?", o: ["SIDBI", "NABARD", "EXIM Bank", "IFCI"], a: 0, e: "SIDBI was set up in 1990 for micro, small and medium enterprises." },
        { q: "A payments bank can…", o: ["Accept small deposits and provide payment services, but not lend", "Lend to small businesses", "Issue credit cards and give home loans", "Accept unlimited deposits"], a: 0, e: "Payments banks cannot give loans." }]
    },

    "4.1": {
      id: "4.1", mod: 4, ch: "Unit 6 (Entrepreneurship scenario)", title: "The Entrepreneurship Scenario in India", time: "15 min", tool: "cases",
      tcfg: { d: "Which government initiative fits each entrepreneur?", cases: [
        { q: "A woman entrepreneur needs ₹40 lakh to set up her first manufacturing unit.", o: ["Stand-Up India", "PM-KISAN", "Atal Pension Yojana", "Swachh Bharat"], a: 0, e: "Stand-Up India (2016) supports bank loans between ₹10 lakh and ₹1 crore for SC/ST and women entrepreneurs setting up greenfield enterprises." },
        { q: "A tea-stall owner needs a small loan to buy a refrigerator.", o: ["Pradhan Mantri MUDRA Yojana", "Startup India Seed Fund", "Production-linked incentive scheme", "Make in India"], a: 0, e: "MUDRA loans (2015) are for small non-farm businesses." },
        { q: "A three-year-old tech company wants official recognition as a start-up for tax and compliance benefits.", o: ["DPIIT recognition under Startup India", "Registration with NABARD", "A licence from the RBI", "Listing on a stock exchange"], a: 0, e: "DPIIT recognises eligible start-ups under the Startup India programme (2016)." },
        { q: "A school wants a lab where students can build robots and prototypes.", o: ["Atal Tinkering Labs under the Atal Innovation Mission", "Stand-Up India", "TReDS", "MGNREGA"], a: 0, e: "The Atal Innovation Mission (2016) runs Atal Tinkering Labs and Atal Incubation Centres." },
        { q: "A mobile-phone maker wants incentives linked to increased domestic production.", o: ["A production-linked incentive (PLI) scheme", "Stand-Up India", "PM-JAY", "Mudra Shishu loan"], a: 0, e: "PLI schemes (from 2020) pay incentives on incremental sales of goods made in India." }] },
      outcomes: ["Explain who an entrepreneur is and why entrepreneurship matters for India", "Describe the main government initiatives for entrepreneurs", "State when an entity is recognised as a start-up by DPIIT", "Identify the barriers that slow the growth of entrepreneurship"],
      notes: `<p>An <b>entrepreneur</b> spots an opportunity, organises resources and bears the <b>risk</b> of a new venture in return for profit. Entrepreneurship matters for India because it <b>creates jobs</b> for a young and growing workforce, brings <b>innovation</b> and new products, spreads development to smaller towns, raises exports and tax revenue, and turns job seekers into <b>job creators</b>.</p>
<p style="margin-top:10px"><b>Government initiatives.</b> <b>Make in India</b> (2014) promotes manufacturing and investment. <b>Startup India</b> (launched 16 January 2016) gives recognised start-ups easier compliance, tax benefits, faster patent examination and funding support through SIDBI's Fund of Funds. <b>Stand-Up India</b> (2016) supports bank loans of ₹10 lakh to ₹1 crore to SC/ST and women entrepreneurs for new enterprises. The <b>Pradhan Mantri MUDRA Yojana</b> (2015) gives loans to small non-farm businesses in categories such as Shishu, Kishor and Tarun. The <b>Atal Innovation Mission</b> (2016) runs tinkering labs and incubation centres. <b>Production-linked incentive (PLI)</b> schemes (from 2020) reward extra domestic production, and <b>Skill India</b> trains workers. Digital public infrastructure such as Aadhaar, UPI and GST registration has made it cheaper to start and run a business.</p>
<p style="margin-top:10px"><b>Start-up recognition.</b> DPIIT (the Department for Promotion of Industry and Internal Trade) recognises an entity as a start-up if it is a private limited company, a registered partnership firm or an LLP, is <b>up to ten years</b> old from incorporation, has had a turnover of <b>not more than ₹100 crore</b> in any financial year, and works towards innovation or improvement of products, processes or services, or a scalable business model. An entity formed by splitting up or reconstructing an existing business does not qualify.</p>
<p style="margin-top:10px"><b>Barriers.</b> Entrepreneurs still face difficulty in getting <b>finance</b> (especially without collateral), complex <b>regulation</b> and compliance, delays in getting paid, limited access to markets and technology, shortage of skilled workers, inadequate infrastructure in some regions, social attitudes that discourage risk-taking and failure, and weak support networks for women and first-generation entrepreneurs.</p>`,
      formula: "Make in India 2014 · MUDRA 2015 · Startup India, Stand-Up India, AIM 2016 · PLI 2020<small>DPIIT start-up: up to 10 years old · turnover ≤ ₹100 crore · innovation</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Initiatives at a glance</h4>" + tbl(["Initiative", "Year", "Who it helps"], [["Make in India", "2014", "Manufacturers and investors"], ["Pradhan Mantri MUDRA Yojana", "2015", "Small non-farm businesses"], ["Startup India", "2016", "Innovative start-ups"], ["Stand-Up India", "2016", "SC/ST and women entrepreneurs"], ["Atal Innovation Mission", "2016", "Students, innovators, incubators"], ["PLI schemes", "2020", "Manufacturers in chosen sectors"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Is each entity eligible for DPIIT start-up recognition?</p>" +
          tbl(["Entity", "Eligible?", "Reason"], [["Kavya Organics Pvt Ltd: 2 years old, turnover ₹3 crore, new plant-based packaging", "Yes", "Private company, under 10 years, turnover under ₹100 crore, innovative"], ["A 12-year-old LLP with a new app", "No", "Older than ten years"], ["A company formed by splitting an existing business", "No", "Formed by reconstruction of an existing business"], ["A sole proprietorship selling an innovative gadget", "No", "Must be a company, a registered partnership or an LLP"]]);
      },
      use: ["Learn each scheme with its year and its target group.", "For recognition, check three tests: legal form, age (≤ 10 years) and turnover (≤ ₹100 crore).", "Mistake: confusing Startup India (innovative start-ups) with Stand-Up India (SC/ST and women entrepreneurs).", "Mistake: thinking a sole proprietorship can be a recognised start-up."],
      walk: function () { return [
        { t: "Why it matters", c: "Jobs, innovation, regional growth.", h: chips(["Jobs", "Innovation", "Exports"], "ac") },
        { t: "Key initiatives", c: "Each with a year and a target group.", h: chips(["Make in India", "MUDRA", "Startup India", "Stand-Up India", "PLI"], "hl") },
        { t: "Start-up test", c: "Form, age, turnover, innovation.", h: box("≤ 10 years · ≤ ₹100 crore · innovative", "good") },
        { t: "Barriers", c: "Finance, regulation, markets, skills.", h: chips(["Finance", "Compliance", "Late payments", "Skills"], "mi") }]; },
      recap: ["Government support runs from Make in India (2014) to MUDRA, Startup India, Stand-Up India and PLI schemes", "A DPIIT start-up is a company, firm or LLP up to ten years old with turnover up to ₹100 crore, working on innovation"],
      qc: [{ q: "Stand-Up India mainly supports…", o: ["SC/ST and women entrepreneurs setting up new enterprises", "All start-ups under ten years old", "Exporters of services", "Farmers buying seeds"], a: 0, e: "It supports bank loans of ₹10 lakh to ₹1 crore for greenfield enterprises." },
        { q: "For DPIIT recognition, a start-up's turnover must not have exceeded…", o: ["₹100 crore in any financial year", "₹25 crore", "₹500 crore", "₹10 crore"], a: 0, e: "Along with the ten-year age limit and an innovation focus." }]
    },

    "4.2": {
      id: "4.2", mod: 4, ch: "Unit 7 (Business environment)", title: "The Business Environment", time: "15 min", tool: "sort",
      tcfg: { d: "Which part of the macro environment does each change belong to?", buckets: ["Economic", "Socio-cultural", "Political", "Legal", "Technological"], items: [
        ["The RBI raises the repo rate and loans become dearer", "Economic", "Interest rates, inflation and growth are economic factors."],
        ["More people prefer ready-to-eat meals as both partners work", "Socio-cultural", "Lifestyles, values and demographics are socio-cultural."],
        ["A new government changes its policy on foreign investment", "Political", "Government stability and policy direction are political factors."],
        ["Labour laws are consolidated into four labour codes", "Legal", "Acts, rules and court decisions form the legal environment."],
        ["UPI makes small digital payments instant and free", "Technological", "New technology changes how business is done."],
        ["A rising number of senior citizens increases demand for health care", "Socio-cultural", "Age structure is a demographic, socio-cultural factor."],
        ["GST rates on a product are changed", "Economic", "Tax rates affect prices and demand, so they are treated here as economic policy."]] },
      outcomes: ["Define the business environment and state its features", "Distinguish the internal, micro and macro environment", "Classify environmental factors as economic, socio-cultural, political, legal or technological", "Describe how ease of doing business is measured, by the World Bank and by DPIIT"],
      notes: `<p>The <b>business environment</b> is the sum of all the forces outside a business's direct control that affect how it works and performs. Its features: it is <b>dynamic</b> (always changing), <b>complex</b> (many forces interact), <b>uncertain</b>, <b>relative</b> (it differs between countries and industries) and has both <b>specific</b> and <b>general</b> forces. Studying it helps a firm spot <b>opportunities</b> early, see <b>threats</b>, plan, use resources well and adapt.</p>
<p style="margin-top:10px">The <b>internal environment</b> (the firm's own resources, culture, management and structure) can be controlled. The <b>micro environment</b> is the firm's immediate setting: customers, suppliers, competitors, marketing intermediaries, financiers and the public. The <b>macro environment</b> is the wider setting that affects all firms: <b>economic</b> (growth, inflation, interest rates, the tax system, the exchange rate), <b>socio-cultural</b> (population, lifestyles, values, education), <b>political</b> (the government's stability and policies), <b>legal</b> (laws, rules and court decisions) and <b>technological</b> (new products, processes and digital platforms). Adding <b>environmental</b> factors gives the familiar PESTLE framework.</p>
<p style="margin-top:10px"><b>Ease of doing business.</b> The World Bank's <b>Doing Business</b> report ranked countries on how easy it was to start and run a business (starting a business, permits, credit, taxes, contracts, insolvency and so on). India rose from 142nd in the 2015 report to 63rd in the 2020 report. The World Bank stopped the report in 2021 after an internal review of data irregularities and has since replaced it with a new assessment, <b>Business Ready (B-READY)</b>. Within India, <b>DPIIT</b> ranks states under the <b>Business Reform Action Plan (BRAP)</b>, which measures how far each state has carried out agreed reforms such as single-window clearances and online approvals, so that states compete to improve their business climate.</p>`,
      formula: "Internal (controllable) · Micro (customers, suppliers, competitors) · Macro (economic, socio-cultural, political, legal, technological)<small>World Bank Doing Business (to 2021) → B-READY · DPIIT's BRAP ranks states</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Micro or macro?</h4>" + tbl(["Force", "Level"], [["A key supplier raises prices", "Micro"], ["A rival opens a store next door", "Micro"], ["Inflation rises across the country", "Macro (economic)"], ["A new data protection law", "Macro (legal)"], ["Customers switch to online buying", "Micro (customers), driven by a macro (technological) change"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Nimbus Paper Products Ltd scans its environment before planning next year.</p>" +
          tbl(["Factor", "Change", "Opportunity or threat"], [["Economic", "Rising interest rates", "Threat: costlier loans for the new plant"], ["Socio-cultural", "Shift to eco-friendly packaging", "Opportunity: launch recycled-paper boxes"], ["Political and legal", "Ban on some single-use plastics", "Opportunity: paper replaces plastic"], ["Technological", "More digital documents", "Threat: falling demand for office paper"]]);
      },
      use: ["Sort each factor first into internal, micro or macro, then into its macro category.", "Remember: the World Bank report has ended; DPIIT's BRAP ranks Indian states.", "Mistake: treating competitors as part of the macro environment; they are micro.", "Mistake: saying a business can control its environment; it can only respond to it."],
      walk: function () { return [
        { t: "Meaning", c: "Outside forces a firm cannot control.", h: chips(["Dynamic", "Complex", "Uncertain", "Relative"], "ac") },
        { t: "Three levels", c: "Internal, micro and macro.", h: chips(["Internal", "Micro", "Macro"], "hl") },
        { t: "Macro factors", c: "Economic, socio-cultural, political, legal, technological.", h: box("PESTLE adds environmental", "good") },
        { t: "Ease of doing business", c: "World Bank report ended 2021; DPIIT ranks states.", h: chips(["India 63rd (2020)", "B-READY", "BRAP"], "mi") }]; },
      recap: ["The business environment is dynamic and uncertain; it has internal, micro and macro levels", "Macro factors are economic, socio-cultural, political, legal and technological; DPIIT's BRAP ranks states' business reforms"],
      qc: [{ q: "Which of these is part of a firm's micro environment?", o: ["Its suppliers", "The inflation rate", "A new tax law", "Population growth"], a: 0, e: "Suppliers, customers and competitors make up the immediate (micro) environment." },
        { q: "In the World Bank's Doing Business 2020 report, India was ranked…", o: ["63rd", "142nd", "1st", "100th"], a: 0, e: "Up from 142nd in the 2015 report. The report was discontinued in 2021." }]
    },

    "4.3": {
      id: "4.3", mod: 4, ch: "Unit 8 (Key government institutions)", title: "Key Government Institutions", time: "16 min", tool: "cases",
      tcfg: { d: "Which institution handles each matter?", cases: [
        { q: "A listed company delays disclosing a major contract to the stock exchange.", o: ["SEBI", "CCI", "IBBI", "NITI Aayog"], a: 0, e: "SEBI regulates listed companies' disclosures and the securities market." },
        { q: "Two cement makers agree to fix prices together.", o: ["CCI", "SEBI", "RBI", "MCA"], a: 0, e: "Cartels are anti-competitive agreements under the Competition Act, 2002." },
        { q: "A creditor files for insolvency resolution against a company that has defaulted.", o: ["NCLT", "CCI", "RBI", "NITI Aayog"], a: 0, e: "The NCLT is the adjudicating authority for companies under the IBC." },
        { q: "A shareholder wants to appeal against an NCLT order.", o: ["NCLAT", "The High Court", "SEBI", "IBBI"], a: 0, e: "Appeals from the NCLT go to the NCLAT, and from there to the Supreme Court." },
        { q: "A bank needs approval to open a new type of savings product.", o: ["RBI", "SEBI", "MCA", "CCI"], a: 0, e: "The RBI regulates banks." },
        { q: "A company must file its annual return and financial statements.", o: ["MCA (through the Registrar of Companies)", "SEBI", "IBBI", "NITI Aayog"], a: 0, e: "Filings under the Companies Act go to the Registrar of Companies, under the MCA." },
        { q: "A person wants to register as an insolvency professional.", o: ["IBBI", "NCLAT", "RBI", "CCI"], a: 0, e: "The IBBI regulates insolvency professionals and agencies." }] },
      outcomes: ["State the role of NITI Aayog and the Ministry of Corporate Affairs", "Explain what SEBI and the RBI regulate", "Describe the IBBI and the Competition Commission of India", "Explain the roles of the NCLT and the NCLAT"],
      notes: `<p><b>NITI Aayog</b> (National Institution for Transforming India) replaced the Planning Commission on <b>1 January 2015</b>. Chaired by the Prime Minister, it is a <b>policy think-tank</b>: it advises the Centre and the states, promotes co-operative federalism, and monitors programmes. Unlike the Planning Commission, it does not allocate funds to states.</p>
<p style="margin-top:10px">The <b>Ministry of Corporate Affairs (MCA)</b> administers company and LLP law: the <b>Companies Act, 2013</b>, the <b>LLP Act, 2008</b>, and (with others) the Competition Act and the IBC. Its <b>Registrars of Companies</b> register companies and receive their filings through the MCA portal. <b>SEBI</b> (set up in 1988, a statutory body under the SEBI Act, 1992) protects investors and regulates and develops the <b>securities market</b>: stock exchanges, brokers, mutual funds, public issues and listed companies' disclosures. The <b>RBI</b> (1935) is the central bank: it issues currency, conducts monetary policy, regulates banks and NBFCs, manages foreign exchange and oversees payment systems.</p>
<p style="margin-top:10px">The <b>Insolvency and Bankruptcy Board of India (IBBI)</b>, set up in 2016 under the <b>Insolvency and Bankruptcy Code, 2016</b>, regulates insolvency professionals, insolvency professional agencies and information utilities, and makes regulations for the insolvency process. The <b>Competition Commission of India (CCI)</b>, under the <b>Competition Act, 2002</b>, prevents <b>anti-competitive agreements</b> (such as cartels), <b>abuse of a dominant position</b>, and regulates large <b>combinations</b> (mergers and acquisitions above set thresholds).</p>
<p style="margin-top:10px">The <b>National Company Law Tribunal (NCLT)</b> and the <b>National Company Law Appellate Tribunal (NCLAT)</b> were constituted in <b>2016</b> under the Companies Act, 2013. The NCLT decides company law matters such as oppression and mismanagement, mergers and schemes, and acts as the <b>adjudicating authority for corporate insolvency</b> under the IBC. The NCLAT hears <b>appeals</b> from the NCLT, from the IBBI and from the CCI. Appeals from the NCLAT lie to the <b>Supreme Court</b>.</p>`,
      formula: "NITI Aayog 2015 (advises) · SEBI 1988/1992 (securities) · RBI 1935 (banks) · CCI (Competition Act 2002) · IBBI 2016 · NCLT and NCLAT 2016<small>NCLT → NCLAT → Supreme Court</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Who regulates what</h4>" + tbl(["Institution", "Law", "Main role"], [["MCA", "Companies Act 2013, LLP Act 2008", "Company and LLP law; Registrars of Companies"], ["SEBI", "SEBI Act 1992", "Securities market and listed companies"], ["RBI", "RBI Act 1934", "Monetary policy, banks, NBFCs"], ["CCI", "Competition Act 2002", "Cartels, dominance, combinations"], ["IBBI", "IBC 2016", "Insolvency professionals and process"], ["NCLT / NCLAT", "Companies Act 2013", "Company law and insolvency cases; appeals"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Follow one insolvency case through the institutions.</p>" +
          tbl(["Step", "Institution"], [["A financial creditor applies to start insolvency against a defaulting company", "NCLT (adjudicating authority)"], ["The NCLT appoints an insolvency professional registered with the regulator", "IBBI"], ["The company's promoter appeals against the admission order", "NCLAT"], ["A further appeal on a question of law", "Supreme Court"], ["The resolution plan involves a merger above the thresholds", "CCI approval for the combination"]]);
      },
      use: ["Match each body to its law and year; objective questions test both.", "Remember the appeal chain: NCLT → NCLAT → Supreme Court.", "Mistake: describing NITI Aayog as allocating funds; it advises.", "Mistake: saying the IBBI decides insolvency cases; the NCLT does, and the IBBI regulates."],
      walk: function () { return [
        { t: "Policy", c: "NITI Aayog advises; MCA runs company law.", h: chips(["NITI Aayog 2015", "MCA"], "ac") },
        { t: "Markets and money", c: "SEBI for securities, RBI for banks.", h: chips(["SEBI", "RBI"], "hl") },
        { t: "Competition and insolvency", c: "CCI and IBBI.", h: chips(["CCI 2002 Act", "IBBI 2016"], "ac") },
        { t: "Tribunals", c: "NCLT decides; NCLAT hears appeals.", h: box("NCLT → NCLAT → Supreme Court", "good") }]; },
      recap: ["NITI Aayog advises, the MCA runs company law, SEBI regulates securities and the RBI banks", "The CCI polices competition, the IBBI regulates insolvency, and the NCLT and NCLAT decide company and insolvency cases"],
      qc: [{ q: "Appeals against orders of the CCI lie to the…", o: ["NCLAT", "NCLT", "SEBI", "IBBI"], a: 0, e: "Since 2017 the NCLAT hears appeals from the CCI." },
        { q: "NITI Aayog replaced the Planning Commission in…", o: ["2015", "2010", "1991", "2017"], a: 0, e: "On 1 January 2015." }]
    },

    "4.4": {
      id: "4.4", mod: 4, ch: "Unit 9 (Global environment)", title: "The Global Environment", time: "15 min", tool: "cases",
      tcfg: { d: "Name the international body.", cases: [
        { q: "Which body sets and enforces the rules of world trade and settles trade disputes?", o: ["WTO", "OPEC", "ADB", "OECD"], a: 0, e: "The WTO (1995, Geneva) replaced GATT." },
        { q: "Which World Bank Group member lends to and invests in the private sector of developing countries?", o: ["IFC", "IDA", "IBRD", "IMF"], a: 0, e: "The International Finance Corporation (1956)." },
        { q: "Which World Bank Group member gives interest-free or very low-interest loans and grants to the poorest countries?", o: ["IDA", "IFC", "EBRD", "OPEC"], a: 0, e: "The International Development Association (1960)." },
        { q: "Which regional bank, headquartered in Manila, finances development in Asia and the Pacific?", o: ["ADB", "EBRD", "IFC", "OECD"], a: 0, e: "The Asian Development Bank (1966)." },
        { q: "Which body co-ordinates the petroleum policies of its oil-exporting member countries?", o: ["OPEC", "WTO", "OECD", "ADB"], a: 0, e: "OPEC (1960), headquartered in Vienna." },
        { q: "Which Paris-based body of mainly developed economies sets standards on tax, governance and economic policy?", o: ["OECD", "WTO", "EBRD", "IDA"], a: 0, e: "The OECD (1961). India is not a member but works with it as a key partner." }] },
      outcomes: ["Explain why the global environment matters for Indian business", "Describe the role of the WTO", "Distinguish the members of the World Bank Group, especially the IFC and IDA, and the IMF", "State the roles of the ADB, OECD, EBRD and OPEC"],
      notes: `<p>Indian businesses export, import, borrow abroad, receive foreign investment and compete with global firms, so world events (oil prices, interest rates in large economies, trade rules, exchange rates) quickly reach them. A set of <b>international organisations</b> sets rules and provides finance for the <b>global economic and financial system</b>.</p>
<p style="margin-top:10px">The <b>World Trade Organization (WTO)</b> came into being on <b>1 January 1995</b>, replacing GATT (1947); it is based in <b>Geneva</b>. It administers trade agreements (on goods, services and intellectual property), provides a forum for negotiations, and <b>settles disputes</b> between members. Its principles include <b>most-favoured-nation</b> treatment (no discrimination between trading partners) and <b>national treatment</b> (imported goods treated like local ones once inside the market). India is a founding member.</p>
<p style="margin-top:10px">The <b>World Bank Group</b> (headquartered in Washington, D.C.) finances development. The <b>IBRD</b> (1944) lends to middle-income governments; the <b>International Development Association (IDA, 1960)</b> gives concessional loans and grants to the <b>poorest countries</b>; the <b>International Finance Corporation (IFC, 1956)</b> invests in the <b>private sector</b>; MIGA and ICSID insure investments and settle investment disputes. Its sister institution, the <b>IMF</b> (1944), watches over the international monetary system and lends to countries with balance of payments problems.</p>
<p style="margin-top:10px">Other bodies: the <b>Asian Development Bank (ADB)</b>, set up in <b>1966</b> and based in <b>Manila</b>, finances development in Asia and the Pacific; India is a founding member and a major borrower. The <b>OECD</b> (Organisation for Economic Co-operation and Development, <b>1961</b>, <b>Paris</b>) brings together mainly developed economies to compare policies and set standards, for example on international tax; India is a key partner, not a member. The <b>European Bank for Reconstruction and Development (EBRD)</b>, set up in <b>1991</b> in <b>London</b> to help former communist economies move to market economies, now invests in more than thirty countries; India became a shareholder in 2018. <b>OPEC</b> (Organization of the Petroleum Exporting Countries) was founded in <b>1960</b> in Baghdad and is headquartered in <b>Vienna</b>; its output decisions influence world oil prices, which matters greatly to India as a large oil importer.</p>`,
      formula: "WTO 1995 Geneva · IBRD 1944 · IFC 1956 (private sector) · IDA 1960 (poorest) · ADB 1966 Manila · OECD 1961 Paris · EBRD 1991 London · OPEC 1960 Vienna<small>MFN + national treatment = WTO non-discrimination</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Quick reference</h4>" + tbl(["Body", "Year", "Headquarters", "Main role"], [["WTO", "1995", "Geneva", "Trade rules and disputes"], ["IBRD", "1944", "Washington, D.C.", "Loans to middle-income governments"], ["IFC", "1956", "Washington, D.C.", "Private-sector investment"], ["IDA", "1960", "Washington, D.C.", "Concessional finance for the poorest"], ["IMF", "1944", "Washington, D.C.", "Monetary stability, BoP support"], ["ADB", "1966", "Manila", "Development in Asia-Pacific"], ["OECD", "1961", "Paris", "Policy standards, mainly developed economies"], ["EBRD", "1991", "London", "Transition and private-sector investment"], ["OPEC", "1960", "Vienna", "Oil producers' policy"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">How global bodies touch one Indian company, Nimbus Paper Products Ltd.</p>" +
          tbl(["Event", "Body involved", "Effect on Nimbus"], [["OPEC members cut oil output", "OPEC", "Fuel and freight costs rise"], ["Another country puts an unfair duty on Indian paper", "WTO dispute settlement", "India can challenge the duty"], ["A private equity partner of the IFC invests in a paper mill in Asia", "IFC", "A new, well-funded competitor"], ["New global minimum tax rules for large groups", "OECD", "Tax planning for its foreign subsidiary changes"]]);
      },
      use: ["Learn each body with its year, headquarters and one-line role.", "IFC = private sector; IDA = poorest countries; IBRD = middle-income governments.", "Mistake: calling the IMF a part of the World Bank; it is a separate sister institution.", "Mistake: saying India is an OECD member; it is a key partner."],
      walk: function () { return [
        { t: "Why it matters", c: "Trade, capital and prices cross borders.", h: chips(["Exports", "FDI", "Oil prices"], "ac") },
        { t: "WTO", c: "Trade rules and dispute settlement since 1995.", h: box("MFN · national treatment", "good") },
        { t: "World Bank Group", c: "IBRD, IDA, IFC, MIGA, ICSID.", h: chips(["IFC: private", "IDA: poorest"], "hl") },
        { t: "Others", c: "ADB, OECD, EBRD, OPEC.", h: chips(["Manila", "Paris", "London", "Vienna"], "ac") }]; },
      recap: ["The WTO (1995) runs trade rules; the World Bank Group (IBRD, IDA, IFC) and the IMF provide finance and stability", "The ADB (Manila), OECD (Paris), EBRD (London) and OPEC (Vienna) shape regional finance, policy standards and oil prices"],
      qc: [{ q: "The International Finance Corporation mainly…", o: ["Invests in the private sector of developing countries", "Lends only to governments", "Regulates world trade", "Sets oil prices"], a: 0, e: "IFC (1956) is the World Bank Group's private-sector arm." },
        { q: "The WTO came into being on…", o: ["1 January 1995", "1 January 1948", "1 July 1991", "1 April 2001"], a: 0, e: "It replaced GATT, which dated from 1947." }]
    },

    "5.1": {
      id: "5.1", mod: 5, ch: "Unit 10 (Environmental governance)", title: "Environmental Governance", time: "16 min", tool: "cases",
      tcfg: { d: "Apply the rules on responsible business conduct.", cases: [
        { q: "A company had net profit of ₹8 crore last year (and less before). Must it spend on CSR under section 135?", o: ["Yes: net profit of ₹5 crore or more in the preceding year triggers CSR", "No: only listed companies must", "No: the limit is ₹50 crore", "Only if it chooses to"], a: 0, e: "Any one of net worth ≥ ₹500 crore, turnover ≥ ₹1,000 crore or net profit ≥ ₹5 crore in the preceding financial year applies." },
        { q: "Average net profit of the three preceding years is ₹12 crore. The minimum CSR spend is…", o: ["₹24 lakh (2%)", "₹12 lakh", "₹60 lakh", "₹1.2 crore"], a: 0, e: "2% of ₹12 crore = ₹0.24 crore." },
        { q: "Which listed companies must file a Business Responsibility and Sustainability Report (BRSR)?", o: ["The top 1,000 listed companies by market capitalisation", "All companies", "Only public sector companies", "Only banks"], a: 0, e: "SEBI made BRSR mandatory for the top 1,000 listed companies from 2022–23." },
        { q: "The National Guidelines on Responsible Business Conduct (2019) were issued by…", o: ["The Ministry of Corporate Affairs", "SEBI", "The RBI", "The WTO"], a: 0, e: "The NGRBC set out nine principles." },
        { q: "India's target year for net-zero emissions is…", o: ["2070", "2030", "2050", "2100"], a: 0, e: "Announced at COP26 in Glasgow in 2021." }] },
      outcomes: ["Explain why environmental care and profitability can go together", "Describe the National Guidelines on Responsible Business Conduct", "Explain CSR under section 135 and SEBI's BRSR", "Describe key national and international environmental initiatives"],
      notes: `<p><b>Environmental governance</b> means the rules, structures and practices through which a business manages its impact on the environment. Preserving the environment and making profits are not opposites: energy and water savings cut costs, cleaner products win customers, good environmental records attract investors and lenders, and early action avoids penalties and the risk of being shut down. The idea of the <b>triple bottom line</b> (people, planet, profit) asks companies to report on all three.</p>
<p style="margin-top:10px">The <b>National Guidelines on Responsible Business Conduct (NGRBC)</b>, issued by the <b>Ministry of Corporate Affairs in 2019</b>, set out <b>nine principles</b>: businesses should conduct themselves with integrity and transparency; provide goods and services that are sustainable and safe; respect the well-being of employees; respond to all stakeholders; respect human rights; <b>protect and restore the environment</b>; engage with public policy responsibly; promote inclusive growth; and serve consumers responsibly.</p>
<p style="margin-top:10px"><b>Corporate social responsibility (CSR)</b>: under <b>section 135</b> of the Companies Act, 2013, a company with net worth of ₹500 crore or more, turnover of ₹1,000 crore or more, or net profit of ₹5 crore or more in the preceding financial year must form a CSR policy and spend at least <b>2% of its average net profit of the three preceding financial years</b> on activities in <b>Schedule VII</b>, which includes environmental sustainability. <b>SEBI's Business Responsibility and Sustainability Report (BRSR)</b>, built on the nine NGRBC principles, is mandatory for the <b>top 1,000 listed companies</b> by market capitalisation from 2022–23, with a 'BRSR Core' of key indicators that the largest companies must have independently assured.</p>
<p style="margin-top:10px"><b>Initiatives.</b> In India: the Environment (Protection) Act, 1986; the National Green Tribunal (2010); the National Action Plan on Climate Change (2008); Mission LiFE (Lifestyle for Environment, 2022); and the Green Credit Programme (2023). Internationally: the UN <b>Sustainable Development Goals</b> (17 goals, adopted in 2015 for 2030) and the <b>Paris Agreement</b> (2015), under which countries set national climate targets; India has announced a target of <b>net-zero emissions by 2070</b>.</p>`,
      formula: "CSR (s.135): net worth ≥ ₹500 cr or turnover ≥ ₹1,000 cr or net profit ≥ ₹5 cr → spend ≥ 2% of average net profit (3 years)<small>NGRBC 2019: 9 principles · BRSR: top 1,000 listed · net zero 2070</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Who issues what</h4>" + tbl(["Framework", "Issued by", "Applies to"], [["NGRBC (2019)", "Ministry of Corporate Affairs", "All businesses (guidance)"], ["CSR, s.135", "Companies Act, 2013", "Companies above any one threshold"], ["BRSR", "SEBI", "Top 1,000 listed companies"], ["SDGs (2015)", "United Nations", "All countries, for 2030"], ["Paris Agreement (2015)", "UN climate convention", "Member countries' climate targets"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Nimbus Paper Products Ltd: net profit before tax for CSR purposes in the last three years was ₹9 crore, ₹11 crore and ₹13 crore.</p>" +
          steps(["Last year's net profit (₹13 crore) is at least ₹5 crore, so section 135 applies.", "Average net profit = (9 + 11 + 13) ÷ 3 = ₹11 crore.", "Minimum CSR spend = 2% × ₹11 crore = <b>₹22 lakh</b>.", "It chooses a Schedule VII activity linked to its business: planting and maintaining trees in its pulpwood catchment area (environmental sustainability).", "As a listed company in the top 1,000, it also reports on Principle 6 (environment) in its BRSR."]);
      },
      use: ["For CSR, test the three thresholds on the preceding year, then compute 2% of the three-year average.", "Link the BRSR to the nine NGRBC principles; it reports against them.", "Mistake: computing CSR on last year's profit alone; it is the three-year average.", "Mistake: confusing the SDG year (2030) with India's net-zero year (2070)."],
      walk: function () { return [
        { t: "Why it pays", c: "Lower costs, better reputation, easier finance.", h: chips(["People", "Planet", "Profit"], "ac") },
        { t: "NGRBC", c: "MCA's nine principles (2019).", h: box("Principle 6: protect and restore the environment", "good") },
        { t: "CSR and BRSR", c: "s.135 spending; SEBI reporting.", h: chips(["2% of average profit", "Top 1,000 listed"], "hl") },
        { t: "Initiatives", c: "LiFE, Green Credit, SDGs, Paris.", h: chips(["2030 SDGs", "Net zero 2070"], "mi") }]; },
      recap: ["The MCA's NGRBC (2019) has nine principles; SEBI's BRSR reports against them for the top 1,000 listed companies", "CSR applies above any one threshold and requires 2% of the three-year average net profit; India targets net zero by 2070"],
      qc: [{ q: "Under section 135, the minimum CSR spend is based on…", o: ["2% of the average net profit of the three preceding financial years", "2% of turnover", "5% of last year's profit", "1% of net worth"], a: 0, e: "Average net profit of the three immediately preceding financial years." },
        { q: "The National Guidelines on Responsible Business Conduct contain…", o: ["Nine principles", "Five principles", "Seventeen goals", "Twelve rules"], a: 0, e: "Seventeen is the number of UN SDGs." }]
    },

    "5.2": {
      id: "5.2", mod: 5, ch: "Unit 11 (AI and business environment)", title: "Artificial Intelligence and Business", time: "15 min", tool: "sort",
      tcfg: { d: "Which kind of AI is each example?", buckets: ["Narrow AI", "General AI (not yet achieved)", "Generative AI"], items: [
        ["A bank's system that flags unusual card transactions", "Narrow AI", "It does one task well: fraud detection."],
        ["A tool that drafts a first version of a board note from bullet points", "Generative AI", "It creates new text; generative AI is a kind of narrow AI focused on creating content."],
        ["A machine that can learn any intellectual task a human can", "General AI (not yet achieved)", "Artificial general intelligence remains a research goal."],
        ["A chess program that beats grandmasters", "Narrow AI", "Excellent at one game, useless outside it."],
        ["A system that creates product images from a text description", "Generative AI", "It generates new images."],
        ["Voice assistants that set reminders", "Narrow AI", "They handle a limited set of tasks."]] },
      outcomes: ["Trace the evolution of artificial intelligence", "Distinguish the types of AI by capability and the main techniques", "Describe uses of AI in business and in a company secretary's work", "Explain the risks of AI and the need for responsible use"],
      notes: `<p><b>Artificial intelligence (AI)</b> is the ability of machines to perform tasks that normally need human intelligence: understanding language, recognising images, learning from data, making decisions and creating content. The term was coined at the <b>Dartmouth conference of 1956</b> (John McCarthy). Early AI used hand-written rules (expert systems in the 1970s–80s); <b>machine learning</b> then let computers learn patterns from data; <b>deep learning</b> with neural networks (from the 2010s) brought big gains in image and speech recognition; and <b>generative AI</b> using large language models (from about 2022) can write, summarise, translate and create images.</p>
<p style="margin-top:10px"><b>Types by capability</b>: <b>narrow (weak) AI</b> does specific tasks and is the only kind that exists today; <b>general AI</b> would match human intelligence across tasks; <b>super AI</b> would exceed it (both are still theoretical). <b>Main techniques</b>: machine learning, deep learning, <b>natural language processing</b> (understanding and producing language), <b>computer vision</b> (images and video), robotics and generative AI.</p>
<p style="margin-top:10px"><b>Uses in business</b>: customer service chatbots, product recommendations, demand forecasting, fraud detection, credit scoring, predictive maintenance of machines, recruitment screening, and marketing content. For a <b>company secretary</b>: drafting first versions of notices, minutes and letters; tracking compliance deadlines; reviewing contracts and spotting clauses; searching laws and circulars; and summarising long documents. Every AI output must be <b>checked by a person</b>, because AI can produce confident but wrong answers.</p>
<p style="margin-top:10px"><b>Risks and responsible use</b>: wrong or invented answers ('hallucinations'), <b>bias</b> learned from data, lack of transparency, <b>privacy and confidentiality</b> (never put unpublished price-sensitive or personal data into public tools), intellectual property, cyber security and job displacement. In India, the <b>Digital Personal Data Protection Act, 2023</b> governs personal data, and the <b>IndiaAI Mission</b> (approved in 2024) supports computing capacity, datasets and safe and trusted AI.</p>`,
      formula: "Rules (1956 →) → machine learning → deep learning → generative AI<small>narrow AI exists today · general and super AI are theoretical · a human checks every output</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Use and safeguard</h4>" + tbl(["Use", "Safeguard"], [["Draft minutes from notes", "The CS checks every decision against the record"], ["Summarise a SEBI circular", "Read the circular itself before advising"], ["Screen job applications", "Test for bias; keep a human decision"], ["Answer customer queries", "Escalate complaints to people; protect personal data"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Meher, company secretary of Nimbus Paper Products Ltd, wants to use a generative AI tool.</p>" +
          tbl(["Task", "Appropriate?", "Why"], [["Ask it to draft a standard notice of a board meeting, then edit it", "Yes", "Saves time; she checks dates, items and the law"], ["Paste unpublished quarterly results to get a press release", "No", "Unpublished price-sensitive information must not go into a public tool"], ["Ask it which section of the Act applies, and file on that basis without checking", "No", "AI can give confident but wrong answers; she must verify"], ["Use it to make a checklist of annual filing dates, then confirm each on the MCA portal", "Yes", "Useful first draft, verified against the source"]]);
      },
      use: ["Remember that all AI in use today is narrow AI.", "Name one use and one risk for each business function.", "Mistake: treating AI output as final; a person must check it.", "Mistake: putting confidential or personal data into public AI tools."],
      walk: function () { return [
        { t: "Evolution", c: "From rules to learning to generating.", h: chips(["1956", "Machine learning", "Deep learning", "Generative AI"], "ac") },
        { t: "Types", c: "Only narrow AI exists today.", h: chips(["Narrow", "General", "Super"], "hl") },
        { t: "Uses", c: "Forecasting, fraud, service, drafting.", h: chips(["Chatbots", "Fraud alerts", "Drafting"], "ac") },
        { t: "Responsible use", c: "Check, protect data, watch bias.", h: box("Human review · confidentiality · DPDP Act 2023", "good") }]; },
      recap: ["AI grew from rule-based systems (1956) to machine learning, deep learning and generative AI; all AI today is narrow", "Business uses AI for forecasting, fraud detection, service and drafting, but outputs need human checks and data must be protected"],
      qc: [{ q: "Which type of AI exists in practical use today?", o: ["Narrow AI", "General AI", "Super AI", "Self-aware AI"], a: 0, e: "General and super AI are still theoretical." },
        { q: "A company secretary using generative AI to draft minutes should…", o: ["Check the draft against the actual proceedings before it is signed", "Sign it as produced", "Share board papers with any public tool", "Let the tool decide the resolutions"], a: 0, e: "Human review and confidentiality are essential." }]
    },

    "5.3": {
      id: "5.3", mod: 5, ch: "Unit 12 (Elements of corporate governance)", title: "Elements of Corporate Governance", time: "18 min", tool: "cases",
      tcfg: { d: "Spot the governance issue.", cases: [
        { q: "A listed company has 9 directors, of whom 2 are independent.", o: ["Too few independent directors: a listed company needs at least one-third (3 of 9)", "No issue", "It needs a majority of independent directors in all cases", "Independent directors are optional"], a: 0, e: "Section 149(4) requires at least one-third of a listed company's directors to be independent (SEBI LODR may require more, such as half where the chair is an executive)." },
        { q: "The CEO's brother runs the firm that audits the company.", o: ["A conflict of interest that threatens auditor independence", "Good, because he knows the business", "Not a governance matter", "Only a tax issue"], a: 0, e: "Auditors must be independent of management." },
        { q: "A company shows invented cash balances for years to inflate profits (as in the Satyam case, 2009).", o: ["A governance failure: fraud and weak oversight by the board and auditors", "Aggressive but legal accounting", "A minor clerical error", "Good for shareholders"], a: 0, e: "Satyam is India's best-known corporate governance failure." },
        { q: "A mutual fund votes on every resolution of companies it invests in and publishes its voting policy.", o: ["Good stewardship by an institutional investor", "Interference in management", "Against SEBI rules", "Irrelevant to governance"], a: 0, e: "SEBI's Stewardship Code (2019) asks mutual funds and AIFs to monitor and engage with investee companies." },
        { q: "A listed company publishes its ESG data with independent assurance.", o: ["Good practice that improves transparency", "Not allowed", "Only needed for banks", "A breach of confidentiality"], a: 0, e: "Assured ESG reporting builds stakeholder trust." }] },
      outcomes: ["Explain the meaning and principles of good corporate governance", "Describe the legal framework and reporting requirements for governance in India", "Explain ESG and stewardship", "Learn from governance successes and failures"],
      notes: `<p><b>Corporate governance</b> is the system of rules, practices and processes by which a company is <b>directed and controlled</b>, balancing the interests of shareholders, management, employees, customers, lenders, government and society. A <b>company</b> is a separate legal person owned by shareholders and managed by directors; because ownership and management are separate, governance protects owners and other stakeholders from managers acting in their own interest (the <b>agency problem</b>). The principles of good governance are <b>accountability</b>, <b>transparency</b>, <b>fairness</b>, <b>responsibility</b>, <b>independence</b> and <b>ethical conduct</b>.</p>
<p style="margin-top:10px"><b>Development and legal framework.</b> The UK's <b>Cadbury Committee (1992)</b> shaped modern governance codes. In India, the <b>Kumar Mangalam Birla Committee (1999)</b> led to <b>Clause 49</b> of the listing agreement; the <b>Narayana Murthy Committee (2003)</b> strengthened it, and the <b>Uday Kotak Committee (2017)</b> led to further reforms. Today the main sources are the <b>Companies Act, 2013</b> (independent directors under s.149, with at least one-third of a listed company's board; a woman director for listed and certain public companies; the audit committee, s.177; the nomination and remuneration committee, s.178; CSR, s.135; key managerial personnel including the company secretary, s.203) and <b>SEBI's Listing Obligations and Disclosure Requirements (LODR) Regulations, 2015</b>, together with the <b>Secretarial Standards</b> issued by ICSI.</p>
<p style="margin-top:10px"><b>Reporting.</b> Companies report on governance through the <b>board's report</b>, a <b>corporate governance report</b> in the annual report of listed companies (with a certificate from an auditor or a practising company secretary), the <b>secretarial audit report</b> (s.204), the BRSR, and disclosures to stock exchanges. <b>ESG</b> (environmental, social and governance) reporting lets investors judge long-term risk: carbon emissions, safety, diversity, board independence and ethics.</p>
<p style="margin-top:10px"><b>Institutions and stewardship.</b> SEBI, the MCA, stock exchanges, auditors and ICSI are key governance institutions; company secretaries are often called the <b>conscience keepers</b> of the company. <b>Stewardship</b> means institutional investors actively monitor and engage with the companies they invest in: SEBI's <b>Stewardship Code</b> (2019) applies to mutual funds and alternative investment funds, and IRDAI and PFRDA have similar codes for insurers and pension funds. The syllabus also covers <b>ICSI's own stewardship principles</b>; read them in ICSI's study material. <b>Case studies</b>: <b>Satyam (2009)</b>, where the chairman confessed to inflating cash and profits for years, and the <b>IL&amp;FS</b> default (2018) show what weak boards and oversight cost; companies known for transparent disclosure and independent boards show that good governance builds investor trust and a lower cost of capital.</p>`,
      formula: "Principles: accountability · transparency · fairness · responsibility · independence<small>Companies Act 2013 (ss.149, 177, 178, 135, 203, 204) · SEBI LODR 2015 · Secretarial Standards · Stewardship Code 2019</small>",
      extra: function () { return "<h4 style=\"margin:4px 0 8px\">Milestones in Indian governance</h4>" + tbl(["Year", "Event"], [["1992", "Cadbury Committee report (UK)"], ["1999", "Kumar Mangalam Birla Committee → Clause 49"], ["2003", "Narayana Murthy Committee"], ["2009", "Satyam fraud revealed"], ["2013", "Companies Act, 2013"], ["2015", "SEBI LODR Regulations"], ["2017", "Uday Kotak Committee"], ["2019", "SEBI Stewardship Code for mutual funds and AIFs"]]); },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Check the board of Nimbus Paper Products Ltd (listed): 10 directors — chairman (executive), 2 executive directors, 3 non-executive non-independent directors, 4 independent directors, one of them a woman.</p>" +
          tbl(["Test", "Requirement", "Result"], [["Independent directors (Companies Act)", "At least one-third: 4 of 10", "Met (4)"], ["Independent directors (LODR, executive chair)", "At least half: 5 of 10", "Not met: one more needed"], ["Woman director", "At least one", "Met"], ["Audit committee (LODR)", "At least two-thirds independent, chaired by an independent director", "Check when the committee is formed"]]) +
          "<p class=\"small muted\" style=\"margin-top:8px\">Thresholds shown are the general rules; check the current Act and LODR for exact conditions.</p>";
      },
      use: ["Learn the principles as a list of five or six words; essay questions start there.", "Know the main sections: 149, 177, 178, 135, 203, 204.", "Mistake: thinking governance is only about obeying the law; it is also about ethics and transparency.", "Mistake: confusing stewardship (investors' duty) with the board's duty."],
      walk: function () { return [
        { t: "Meaning", c: "How a company is directed and controlled.", h: chips(["Accountability", "Transparency", "Fairness", "Independence"], "ac") },
        { t: "Framework", c: "Companies Act, LODR, Secretarial Standards.", h: chips(["s.149", "s.177", "s.178", "LODR 2015"], "hl") },
        { t: "Reporting and ESG", c: "Governance report, secretarial audit, BRSR.", h: chips(["E", "S", "G"], "ac") },
        { t: "Lessons", c: "Satyam and IL&FS show the cost of failure.", h: box("Strong boards + stewardship = trust", "good") }]; },
      recap: ["Governance directs and controls a company through accountability, transparency, fairness and independence", "In India it rests on the Companies Act, 2013, SEBI's LODR and the Secretarial Standards, with ESG reporting and investor stewardship"],
      qc: [{ q: "Clause 49 of the listing agreement came from the recommendations of the…", o: ["Kumar Mangalam Birla Committee", "Cadbury Committee", "Uday Kotak Committee", "Narasimham Committee"], a: 0, e: "Its 1999 report led to Clause 49." },
        { q: "Under s.149, at least what share of a listed company's directors must be independent?", o: ["One-third", "One-half", "Two-thirds", "One-quarter"], a: 0, e: "LODR may require half where the chair is an executive director." }]
    }
  };

  /* ================= CSEET PAPER 3 LAYER =================
     Part A reuses AIStudyTools' own CA Foundation Business Economics lessons; Unit 4 and Part B are new (07-new.js). */
  ICAI_URL = "https://www.icsi.edu/media/webmodules/student/Paper_3_Economic_and_Business_Environment_CSEET_18122025.pdf";
  CFG = {
    key: "cseet_ebe_progress_v1", title: "CSEET: Economic and Business Environment", hours: 7, videos: "CSEBE_VIDEOS", paper: "Paper 3 (Economic and Business Environment)", edition: "restructured CSEET, June 2026 onwards",
    lead: "Demand, supply and markets, national income, the Union Budget, financial markets and the Indian economy, then the business environment, institutions, global bodies, sustainability, AI and corporate governance.",
    intro: "For students preparing for Paper 3 of the CS Executive Entrance Test (CSEET). Part A (Economics) and Part B (Business Environment) of the restructured syllabus are covered in five modules. Every lesson has notes, a worked example, an interactive tool and two quick checks, followed by a final test and a certificate.",
    exam: "Paper 3 is a written paper: 100 marks, 3 hours, with Part A Economics (50 marks) and Part B Business Environment (50 marks).",
    testNote: "(the real paper is written; this test checks your concepts)",
    certPrefix: "CSEB", certSub: "Demand & Markets · National Income & Finance · Indian Economy · Business Environment · Governance",
    body: { name: "ICSI", full: "the Institute of Company Secretaries of India (ICSI)", site: "icsi.edu", home: "https://www.icsi.edu/", exam: "CSEET" }
  };
  (function () {
    var U = { 1: "Unit 1 (Demand, supply and forms of market competition)", 2: "Unit 2 (National income accounting)", 3: "Unit 3 (Indian Union Budget)", 5: "Unit 5 (Indian economy)" };
    /* [CA lesson id or new id, CSEET id, module, unit] */
    var MAP = [["1.3", "1.1", 1, 1], ["1.5", "1.2", 1, 1], ["2.3", "1.3", 1, 1], ["2.4", "1.4", 1, 1],
      ["3.1", "2.1", 2, 2], ["4.3", "2.2", 2, 3], ["NEW", "2.3"],
      ["5.6", "3.1", 3, 5], ["5.5", "3.2", 3, 5],
      ["NEW", "4.1"], ["NEW", "4.2"], ["NEW", "4.3"], ["NEW", "4.4"], ["NEW", "5.1"], ["NEW", "5.2"], ["NEW", "5.3"]];
    var byCa = {}; LESSONS.forEach(function (l) { byCa[l.id] = l; });
    var idMap = {};
    LESSONS = MAP.map(function (m) { if (m[0] === "NEW") return NEWL[m[1]]; var l = byCa[m[0]]; idMap[m[0]] = m[1]; l.id = m[1]; l.mod = m[2]; l.ch = U[m[3]]; return l; });
    GLOSSARY = GLOSSARY.filter(function (g) { return idMap[g[3]]; }).map(function (g) { return [g[0], g[1], g[2], idMap[g[3]]]; }).concat([
      ["NBFC", "A company that lends or invests, regulated by the RBI, that cannot accept demand deposits.", "A vehicle-finance company", "2.3"],
      ["Development finance institution", "A body that provides long-term finance for development.", "IFCI, NABARD, SIDBI", "2.3"],
      ["Debenture", "A debt instrument; the holder is a creditor earning fixed interest.", "10% debentures of ₹1,000", "2.3"],
      ["TReDS", "An online platform where MSMEs discount invoices on large buyers.", "Getting paid early on a 90-day invoice", "2.3"],
      ["Entrepreneur", "A person who spots an opportunity, organises resources and bears the risk of a venture.", "Kavya's organic soap start-up", "4.1"],
      ["DPIIT start-up", "A company, registered firm or LLP up to 10 years old, turnover ≤ ₹100 crore, working on innovation.", "Recognition under Startup India", "4.1"],
      ["Macro environment", "Wide forces affecting all firms: economic, socio-cultural, political, legal, technological.", "A rise in interest rates", "4.2"],
      ["Micro environment", "A firm's immediate setting: customers, suppliers, competitors, intermediaries.", "A key supplier raising prices", "4.2"],
      ["BRAP", "DPIIT's Business Reform Action Plan, which ranks states on business reforms.", "Single-window clearances", "4.2"],
      ["NCLT", "Tribunal deciding company law matters and corporate insolvency (adjudicating authority under the IBC).", "Admitting an insolvency application", "4.3"],
      ["CCI", "Competition Commission of India, under the Competition Act, 2002.", "Penalising a cartel", "4.3"],
      ["WTO", "World Trade Organization (1995, Geneva): trade rules and dispute settlement.", "Challenging an unfair duty", "4.4"],
      ["IDA", "World Bank Group member giving concessional finance to the poorest countries.", "Interest-free loans for primary schools", "4.4"],
      ["CSR", "Corporate social responsibility under s.135: at least 2% of average net profit of three years.", "Tree planting in a catchment area", "5.1"],
      ["BRSR", "SEBI's Business Responsibility and Sustainability Report for the top 1,000 listed companies.", "Reporting on the nine NGRBC principles", "5.1"],
      ["Narrow AI", "AI designed for a specific task; the only kind in use today.", "Fraud detection", "5.2"],
      ["Generative AI", "AI that creates new text, images or other content.", "Drafting a first version of a notice", "5.2"],
      ["Corporate governance", "The system by which companies are directed and controlled.", "An independent audit committee", "5.3"],
      ["Stewardship", "Institutional investors' duty to monitor and engage with investee companies.", "A mutual fund publishing its voting record", "5.3"]]);
    var keep = [[2, 1], [3, 1], [5, 1], [9, 1], [10, 1], [13, 2], [14, 2], [20, 2], [29, 3]];
    var old = TEST;
    TEST = keep.map(function (k) { var q = old[k[0]]; return { m: k[1], q: q.q, o: q.o, a: q.a, e: q.e }; }).concat([
      { m: 2, q: "Which body regulates NBFCs in India?", o: ["The RBI", "SEBI", "IRDAI", "NABARD"], a: 0, e: "NBFCs are registered companies regulated by the RBI." },
      { m: 2, q: "A debenture holder of a company is its…", o: ["Creditor", "Owner", "Director", "Partner"], a: 0, e: "Debentures are debt; shareholders are owners." },
      { m: 3, q: "Foreign investment that gives a lasting interest and say in management is…", o: ["Foreign direct investment", "Foreign portfolio investment", "External commercial borrowing", "Foreign aid"], a: 0, e: "FPI is investment in securities without control." },
      { m: 3, q: "India's economic reforms of 1991 followed a crisis in its…", o: ["Balance of payments", "Agricultural output", "Banking system only", "Stock market"], a: 0, e: "Foreign exchange reserves had fallen to a few weeks of imports." },
      { m: 4, q: "DPIIT recognises an entity as a start-up for up to how many years from incorporation?", o: ["10", "5", "7", "15"], a: 0, e: "With turnover up to ₹100 crore in any year." },
      { m: 4, q: "Stand-Up India supports bank loans of…", o: ["₹10 lakh to ₹1 crore for SC/ST and women entrepreneurs", "Up to ₹50,000 for street vendors", "₹5 crore and above for exporters", "Any amount for start-ups"], a: 0, e: "For greenfield enterprises." },
      { m: 4, q: "Competitors of a firm are part of its…", o: ["Micro environment", "Macro environment", "Internal environment", "Legal environment"], a: 0, e: "Customers, suppliers and competitors form the micro environment." },
      { m: 4, q: "Which of these is a technological factor in the business environment?", o: ["Growth of UPI digital payments", "A rise in inflation", "A change of government", "An ageing population"], a: 0, e: "The others are economic, political and socio-cultural." },
      { m: 4, q: "The adjudicating authority for corporate insolvency under the IBC is the…", o: ["NCLT", "IBBI", "CCI", "SEBI"], a: 0, e: "The IBBI regulates; the NCLT adjudicates." },
      { m: 4, q: "Cartels and abuse of dominance are dealt with by the…", o: ["Competition Commission of India", "SEBI", "RBI", "MCA"], a: 0, e: "Under the Competition Act, 2002." },
      { m: 4, q: "SEBI became a statutory body in…", o: ["1992", "1988", "1935", "2002"], a: 0, e: "Set up in 1988, statutory under the SEBI Act, 1992." },
      { m: 4, q: "The headquarters of the Asian Development Bank is in…", o: ["Manila", "Tokyo", "Beijing", "New Delhi"], a: 0, e: "ADB was set up in 1966." },
      { m: 4, q: "OPEC is headquartered in…", o: ["Vienna", "Riyadh", "Geneva", "Baghdad"], a: 0, e: "It was founded in Baghdad in 1960." },
      { m: 5, q: "A company with net profit of ₹6 crore in the preceding year must…", o: ["Spend on CSR under s.135", "Do nothing, as it is below ₹10 crore", "Only file a BRSR", "Get SEBI approval"], a: 0, e: "Net profit of ₹5 crore or more is one of the three thresholds." },
      { m: 5, q: "The Business Responsibility and Sustainability Report is required by…", o: ["SEBI, for the top 1,000 listed companies", "The MCA, for all companies", "The RBI, for banks only", "The WTO"], a: 0, e: "Mandatory from 2022–23." },
      { m: 5, q: "The UN Sustainable Development Goals number…", o: ["17", "9", "12", "21"], a: 0, e: "Adopted in 2015, to be met by 2030." },
      { m: 5, q: "Machine learning is best described as…", o: ["Computers learning patterns from data", "Robots replacing all workers", "Hand-written rules only", "A type of computer virus"], a: 0, e: "It powers most AI uses today." },
      { m: 5, q: "Which is a key risk of generative AI in business?", o: ["Confident but wrong answers", "It cannot produce text", "It works only offline", "It needs no data"], a: 0, e: "Outputs must be checked by a person." },
      { m: 5, q: "The term 'agency problem' in corporate governance refers to…", o: ["Managers acting in their own interest rather than the owners'", "Problems with advertising agencies", "Disputes between two companies", "Delays at government agencies"], a: 0, e: "It arises because ownership and management are separate." },
      { m: 5, q: "India's best-known corporate governance failure, revealed in 2009, involved…", o: ["Satyam Computer Services", "Infosys", "Tata Steel", "State Bank of India"], a: 0, e: "Its chairman admitted inflating cash and profits." },
      { m: 5, q: "SEBI's Stewardship Code applies to…", o: ["Mutual funds and alternative investment funds", "All private companies", "Banks only", "Start-ups"], a: 0, e: "IRDAI and PFRDA have similar codes for insurers and pension funds." }
    ]);
    MODULES = [
      { n: 1, title: "Demand, Supply and Markets", sub: "Law of demand and elasticity, supply, forms of market competition and the determination of equilibrium price.", tag: "Module 1", short: "Demand & markets", takeaway: "Demand slopes down and supply up; their meeting point sets the price, and market structure decides how much power sellers have." },
      { n: 2, title: "National Income, Budget and Financial Markets", sub: "National income concepts and methods, the Union Budget and deficits, and India's financial system.", tag: "Module 2", short: "Income & finance", takeaway: "National income measures output; the Budget shows how government raises and spends it; financial institutions and markets move savings to investment." },
      { n: 3, title: "The Indian Economy", sub: "Sectors, planning and reforms, agricultural and industrial policy, trade, the balance of payments and foreign investment.", tag: "Module 3", short: "Indian economy", takeaway: "India moved from planning to market reforms after 1991; services lead output, agriculture leads employment, and foreign capital links India to the world." },
      { n: 4, title: "Business Environment and Institutions", sub: "Entrepreneurship, the business environment and ease of doing business, key government institutions and the global environment.", tag: "Module 4", short: "Environment", takeaway: "Firms work within micro and macro forces, supported by Indian regulators and tribunals and shaped by global bodies." },
      { n: 5, title: "Sustainability, AI and Corporate Governance", sub: "Environmental governance, artificial intelligence in business, and the elements of corporate governance.", tag: "Module 5", short: "Governance", takeaway: "Responsible conduct, careful use of AI and strong governance protect stakeholders and build long-term value." }
    ];
  })();

  /* spread quick-check answers across positions (the final test is shuffled per attempt) */
  (function () { var T = [1, 0, 2, 3, 2, 1, 0, 3, 3, 1, 2, 0, 1, 3]; var k = 0; LESSONS.forEach(function (l) { l.qc.forEach(function (q) { var t = T[k++ % T.length], a = q.a, o = q.o[a]; q.o[a] = q.o[t]; q.o[t] = o; q.a = t; }); }); })();

  /* ================= GENERIC TOOLS (shared by all papers) =================
     sort:  l.tcfg = { d, buckets: [..], items: [[text, bucket, why], ..] }  — classify each item
     cases: l.tcfg = { d, cases: [{ q, o: [..], a, e }, ..] }                  — scenario trainer   */
  function shuffleCopy(a) { var b = a.slice(); for (var i = b.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = b[i]; b[i] = b[j]; b[j] = t; } return b; }
  TOOLS.sort = {
    d: function (l) { return l.tcfg.d || "Decide where each item belongs. Click a button for each item to check your answer."; },
    b: function () { return ""; },
    wire: function (l, cout) {
      var c = l.tcfg, items = c.items.map(function (x, i) { return { t: x[0], b: x[1], e: x[2] || "", i: i }; }), ans = {};
      function draw() {
        var done = Object.keys(ans).length, right = items.filter(function (x) { return ans[x.i] === x.b; }).length;
        cout.innerHTML = '<div class="stack">' + items.map(function (x) {
          var a = ans[x.i], ok = a === x.b;
          return '<div class="q" style="padding:12px 14px"><b style="margin-bottom:8px">' + x.t + '</b><div class="row" style="gap:8px">' + c.buckets.map(function (bk) {
            var cls = a === undefined ? "" : (bk === x.b ? "ok" : (bk === a ? "bad" : ""));
            return '<button class="opt ' + cls + '" style="padding:7px 12px;font-size:15px" data-i="' + x.i + '" data-b="' + esc(bk) + '"' + (a !== undefined ? " disabled" : "") + ">" + esc(bk) + "</button>";
          }).join("") + "</div>" + (a !== undefined ? '<div class="expl">' + (ok ? "✅ Correct. " : "Not quite: it is <b>" + esc(x.b) + "</b>. ") + x.e + "</div>" : "") + "</div>";
        }).join("") + "</div>" + kv([["Answered", done + " of " + items.length], ["Correct", right]]) +
          (done ? '<div class="row" style="margin-top:6px"><button class="btn btn-soft btn-sm" id="srt_reset">Try again</button></div>' : "");
      }
      cout.addEventListener("click", function (e) {
        var b = e.target.closest("[data-i]"); if (b && !b.disabled) { ans[+b.getAttribute("data-i")] = b.getAttribute("data-b"); draw(); return; }
        if (e.target.id === "srt_reset") { ans = {}; items = shuffleCopy(items); draw(); }
      });
      items = shuffleCopy(items); draw();
    }
  };
  TOOLS.cases = {
    d: function (l) { return l.tcfg.d || "Work through each case. Choose an answer to see the explanation, then move to the next case."; },
    b: function () { return ""; },
    wire: function (l, cout) {
      var cs = l.tcfg.cases.map(function (c) { var p = shuffleCopy(c.o.map(function (_, i) { return i; })); return { q: c.q, e: c.e, o: p.map(function (i) { return c.o[i]; }), a: p.indexOf(c.a) }; }), k = 0, ans = {};
      function draw() {
        var c = cs[k], a = ans[k], right = Object.keys(ans).filter(function (i) { return ans[i] === cs[i].a; }).length;
        cout.innerHTML = '<div class="row" style="justify-content:space-between"><span class="tag indigo">Case ' + (k + 1) + " of " + cs.length + '</span><span class="small muted">' + right + " correct so far</span></div>" +
          '<div class="q" style="margin-top:10px"><b>' + c.q + '</b><div class="opts">' + c.o.map(function (o, i) {
            var cls = a === undefined ? "" : (i === c.a ? "ok" : (i === a ? "bad" : ""));
            return '<button class="opt ' + cls + '" data-o="' + i + '"' + (a !== undefined ? " disabled" : "") + '><span class="k">' + "ABCD"[i] + ".</span><span>" + o + "</span></button>";
          }).join("") + "</div>" + (a !== undefined ? '<div class="expl">' + (a === c.a ? "✅ Correct. " : "Not quite. ") + c.e + "</div>" : "") + "</div>" +
          '<div class="row" style="justify-content:space-between;margin-top:10px"><button class="btn btn-soft btn-sm" id="cs_prev"' + (k ? "" : " disabled") + '>← Previous case</button><button class="btn btn-ink btn-sm" id="cs_next"' + (k < cs.length - 1 ? "" : " disabled") + ">Next case →</button></div>";
      }
      cout.addEventListener("click", function (e) {
        var b = e.target.closest("[data-o]"); if (b && !b.disabled) { ans[k] = +b.getAttribute("data-o"); draw(); return; }
        if (e.target.id === "cs_prev" && k > 0) { k--; draw(); }
        if (e.target.id === "cs_next" && k < cs.length - 1) { k++; draw(); }
      });
      draw();
    }
  };

  function toolBlock(l) {
    var t = TOOLS[l.tool], d = typeof t.d === "function" ? t.d(l) : t.d;
    return '<div class="card calc"><p class="muted small" style="margin-bottom:12px">' + d + "</p>" + t.b(l) + '<div id="cout" class="res" aria-live="polite"></div></div>';
  }
  function toolWire(l) {
    var cout = document.getElementById("cout"), t = TOOLS[l.tool];
    if (t.wire) { t.wire(l, cout); return; }
    function run() { try { cout.innerHTML = t.run(l); } catch (e) { cout.innerHTML = err("Something went wrong with that input. Please check the values."); } }
    var card = cout.parentElement, timerT = null;
    card.addEventListener("input", function (e) { if (e.target.closest("#cout")) return; clearTimeout(timerT); timerT = setTimeout(run, 180); });
    card.addEventListener("change", function (e) { if (e.target.closest("#cout") || e.target.tagName !== "SELECT") return; run(); });
    card.addEventListener("click", function (e) { if (e.target.closest("[data-run]")) run(); });
    run();
  }
  var BODY = CFG.body || { name: "ICAI", full: "the Institute of Chartered Accountants of India (ICAI)", site: "icai.org", home: "https://www.icai.org/", exam: "CA Foundation" };
  /* ================= STATE ================= */
  var KEY = CFG.key;
  var st;
  function load() { try { st = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { st = {}; } st.done = st.done || {}; st.watch = st.watch || {}; st.qc = st.qc || {}; st.test = st.test || null; st.cert = st.cert || null; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  load();
  function idx(id) { for (var i = 0; i < LESSONS.length; i++) if (LESSONS[i].id === id) return i; return -1; }
  function unlocked(id) { var i = idx(id); return i === 0 || (i > 0 && !!st.done[LESSONS[i - 1].id]); }
  function doneCount() { return LESSONS.filter(function (l) { return st.done[l.id]; }).length; }
  function allDone() { return doneCount() === LESSONS.length; }
  function passed() { return !!(st.test && st.test.passed); }
  function nextLesson() { for (var i = 0; i < LESSONS.length; i++) if (!st.done[LESSONS[i].id]) return LESSONS[i]; return null; }

  var app = document.getElementById("app");
  var timer = null;
  function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }

  /* ================= VIEWS ================= */
  function lessonList(m) {
    return '<ul class="lessons">' + LESSONS.filter(function (l) { return l.mod === m; }).map(function (l) {
      var d = st.done[l.id], u = unlocked(l.id);
      var badge = '<span class="st ' + (d ? "done" : (u ? "" : "lock")) + '">' + (d ? "✓" : (u ? l.id : "🔒")) + "</span>";
      if (!u) return '<li><span class="lk" title="Complete the previous lesson to unlock">' + badge + "Lesson " + l.id + " · " + l.title + "<em>Locked</em></span></li>";
      return '<li><a href="#/lesson/' + l.id + '">' + badge + "Lesson " + l.id + " · " + l.title + "<em>" + (d ? "Completed" : l.time) + "</em></a></li>";
    }).join("") + "</ul>";
  }
  function progressRing() {
    var steps = LESSONS.length + 2, got = doneCount() + (passed() ? 1 : 0) + (st.cert ? 1 : 0);
    var p = Math.round(got / steps * 100);
    return '<div class="ring" style="--p:' + p + '%"><span>' + p + "%<small>complete</small></span></div>";
  }
  function viewHome() {
    var nl = nextLesson();
    var cta = nl ? '<a class="btn btn-accent" href="#/lesson/' + nl.id + '">' + (doneCount() ? "Continue: Lesson " + nl.id : "Start the course") + "</a>" :
      (passed() ? '<a class="btn btn-accent" href="#/certificate">Get your certificate</a>' : '<a class="btn btn-accent" href="#/test">Take the final test</a>');
    var h = '<section class="hero"><div><span class="tag">Free course · about ' + CFG.hours + ' hours · ' + LESSONS.length + ' lessons</span><h1 style="margin-top:14px">' + CFG.title + '</h1>' +
      '<p class="lead">' + CFG.lead + '</p>' +
      '<p class="muted" style="margin-top:12px">' + CFG.intro + '</p>' +
      '<p class="small muted" style="margin-top:10px">' + CFG.exam + ' Always confirm the current scheme on <a href="' + BODY.home + '" target="_blank" rel="noopener">' + BODY.site + '</a>.</p>' +
      '<div class="row" style="margin-top:18px">' + cta + '<a class="btn btn-soft" href="#/path">See the course path</a></div></div>' +
      '<div class="card" style="text-align:center">' + progressRing() + '<div class="stack small" style="margin-top:14px;text-align:left">' +
      "<div>📘 Lessons completed: <b>" + doneCount() + " of " + LESSONS.length + "</b></div>" +
      "<div>📝 Final test: <b>" + (st.test ? (st.test.passed ? "Passed (" + st.test.best + "%)" : "Best score " + st.test.best + "%") : (allDone() ? "Unlocked" : "Locked")) + "</b></div>" +
      "<div>🏅 Certificate: <b>" + (st.cert ? "Issued" : (passed() ? "Ready to claim" : "Pass the test to unlock")) + "</b></div></div></div></section>";
    h += '<div class="stack">' + MODULES.map(function (m) {
      var ls = LESSONS.filter(function (l) { return l.mod === m.n; }), d = ls.filter(function (l) { return st.done[l.id]; }).length;
      return '<div class="card mod"><span class="tag indigo">' + m.tag + "</span><h3>" + m.title + '</h3><p class="muted small">' + m.sub + '</p><div class="bar" style="margin-top:12px"><i style="width:' + (d / ls.length * 100) + '%"></i></div><p class="small muted" style="margin-top:6px">' + d + " of " + ls.length + " lessons completed</p>" + lessonList(m.n) + "</div>";
    }).join("") + "</div>";
    h += '<div class="card" style="margin-top:18px"><h3>How the course works</h3><div class="grid g3" style="margin-top:12px">' +
      ["<b>1. Learn, one lesson at a time</b><br><span class=\"muted small\">Watch the walkthrough, read the notes and try the interactive tool. Lessons unlock in order.</span>",
        "<b>2. Check yourself</b><br><span class=\"muted small\">Answer two quick questions in each lesson, then mark it complete.</span>",
        "<b>3. Test and certificate</b><br><span class=\"muted small\">Score 70% or more in the " + TEST.length + "-question final test to download your certificate.</span>"].map(function (t) { return "<div>" + t + "</div>"; }).join("") + "</div></div>";
    return h;
  }
  function viewPath() {
    var h = '<h1 style="font-size:clamp(30px,4vw,42px)">Course path</h1><p class="muted" style="margin:8px 0 22px">Lessons unlock one by one. The final test unlocks after all ' + LESSONS.length + ' lessons.</p>';
    MODULES.forEach(function (m) {
      h += '<div class="card mod" style="margin-bottom:16px"><span class="tag indigo">' + m.tag + "</span><h3>" + m.title + "</h3>" + lessonList(m.n) +
        (LESSONS.filter(function (l) { return l.mod === m.n; }).every(function (l) { return st.done[l.id]; }) ? '<p style="margin-top:12px"><a href="#/recap/' + m.n + '">Module ' + m.n + " recap →</a></p>" : "") + "</div>";
    });
    h += '<div class="card"><h3>Final test and certificate</h3><p class="muted small" style="margin:6px 0 12px">' + TEST.length + ' questions · pass mark 70%</p>' +
      (allDone() ? '<a class="btn btn-accent" href="#/test">Take the final test</a>' : '<span class="tag grey">🔒 Complete all ' + LESSONS.length + ' lessons to unlock</span>') +
      '</div><p style="margin-top:22px"><button class="btn btn-soft btn-sm" id="reset">Reset my progress</button></p>';
    return h;
  }
  function videoEmbed(url) {
    var yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{6,})/);
    if (yt) return '<div class="vid"><iframe src="https://www.youtube.com/embed/' + yt[1] + '?rel=0" title="Lesson video" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>';
    var vm = url.match(/vimeo\.com\/(\d+)/);
    if (vm) return '<div class="vid"><iframe src="https://player.vimeo.com/video/' + vm[1] + '" title="Lesson video" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>';
    return '<div class="vid"><video id="lvid" controls playsinline preload="metadata" src="' + esc(url) + '"></video></div>';
  }
  function quizBlock(qs, lid) {
    return qs.map(function (q, qi) {
      var ans = st.qc[lid + ":" + qi];
      return '<div class="q" data-q="' + qi + '"><b>' + (qi + 1) + ". " + q.q + '</b><div class="opts">' + q.o.map(function (o, oi) {
        var cls = ans === undefined ? "" : (oi === q.a ? "ok" : (oi === ans ? "bad" : ""));
        return '<button class="opt ' + cls + '" data-o="' + oi + '"' + (ans !== undefined ? " disabled" : "") + '><span class="k">' + "ABCD"[oi] + ".</span><span>" + o + "</span></button>";
      }).join("") + "</div>" + (ans !== undefined ? '<div class="expl">' + (ans === q.a ? "✅ Correct. " : "Not quite. ") + q.e + "</div>" : "") + "</div>";
    }).join("");
  }
  function viewLesson(id) {
    var i = idx(id);
    if (i < 0) return viewNotFound();
    var l = LESSONS[i];
    if (!unlocked(id)) return '<div class="card" style="text-align:center;max-width:640px;margin:30px auto"><div style="font-size:44px">🔒</div><h2>Lesson ' + id + " is locked</h2><p class=\"muted\" style=\"margin:10px 0 18px\">Complete Lesson " + LESSONS[i - 1].id + " (" + LESSONS[i - 1].title + ") to unlock it.</p><a class=\"btn btn-accent\" href=\"#/lesson/" + LESSONS[i - 1].id + "\">Go to Lesson " + LESSONS[i - 1].id + "</a></div>";
    var mod = MODULES[l.mod - 1], url = (window[CFG.videos] && window[CFG.videos][id]) || "";
    var h = '<div class="crumb"><a href="#/">Course home</a> › ' + mod.tag + ": " + mod.title + "</div>" +
      '<div class="lhead"><div><span class="tag indigo">Lesson ' + id + " of " + LESSONS.length + " · " + l.time + "</span><h1 style=\"font-size:clamp(30px,4.4vw,46px);margin-top:10px\">" + l.title + "</h1></div>" +
      (st.done[id] ? '<span class="tag mint">✓ Completed</span>' : "") + "</div>";
    h += '<div class="sec"><h3>Teaching video</h3>' +
      (url ? '<div id="vpane">' + videoEmbed(url) + '<p style="margin-top:10px"><label class="small"><input type="checkbox" id="watched"' + (st.watch[id] ? " checked" : "") + "> I have watched this video</label></p></div></div>" +
        '<div class="sec"><h3>Self-paced learning</h3><p class="muted small" style="margin:-4px 0 10px">Go through the steps at your own pace with the arrows below.</p>' : "") +
      '<div id="wpane"><div class="wt" aria-label="Animated walkthrough"><div class="wt-stage" id="wst"></div><div class="wt-cap" id="wcap"></div><div class="wt-ctl"><button id="wprev" aria-label="Previous step">‹</button><button id="wplay" aria-label="Play or pause">❚❚</button><div class="dots" id="wdots"></div><button id="wnext" aria-label="Next step">›</button></div></div></div></div>';
    h += '<div class="sec"><h3>Learning outcomes</h3>' + list(l.outcomes) + "</div>";
    h += '<div class="sec"><h3>Concept notes</h3><div class="stack">' + l.notes + '<div class="formula">' + l.formula + "</div></div></div>";
    h += '<div class="sec"><h3>Worked example</h3><div class="card">' + l.example() + "</div></div>";
    h += '<div class="sec"><div class="card">' + l.extra() + "</div></div>";
    h += '<div class="sec"><h3>Try it yourself</h3>' + toolBlock(l) + "</div>";
    h += '<div class="sec"><h3>When to use it · common mistakes</h3>' + list(l.use) + "</div>";
    h += '<div class="sec"><div class="note">📗 <b>Official study material:</b> this lesson covers the topics of ' + l.ch + ' of the ' + BODY.exam + ' ' + CFG.paper + ' syllabus (' + CFG.edition + '). For the full official text and more practice questions, read ' + BODY.name + '\'s study material on <a href="' + ICAI_URL + '" target="_blank" rel="noopener">' + BODY.site + '</a>.</div></div>';
    h += '<div class="sec"><h3>Quick check</h3><div class="stack" id="qc">' + quizBlock(l.qc, id) + "</div></div>";
    var next = LESSONS[i + 1];
    h += '<div class="sec card" id="donebox"></div>';
    return { html: h, after: function () { lessonWire(l, url, next); } };
  }
  function lessonWire(l, url, next) {
    var id = l.id;
    /* walkthrough */
    var slides = l.walk(), k = 0, playing = !url;
    var stg = document.getElementById("wst"), cap = document.getElementById("wcap"), dots = document.getElementById("wdots"), pb = document.getElementById("wplay");
    function show() {
      stg.innerHTML = '<div class="fade" style="display:grid;gap:14px;justify-items:center;width:100%"><div class="wt-title">' + slides[k].t + "</div>" + slides[k].h + "</div>";
      cap.textContent = slides[k].c;
      dots.innerHTML = slides.map(function (s, j) { return '<i class="' + (j <= k ? "on" : "") + '"></i>'; }).join("");
      if (k === slides.length - 1 && !st.watch[id]) { st.watch[id] = true; save(); updateDone(); }
    }
    function tick() { if (k < slides.length - 1) { k++; show(); } else { setPlay(false); } }
    function setPlay(p) { playing = p; pb.textContent = p ? "❚❚" : "▶"; stopTimer(); if (p) timer = setInterval(tick, 5200); }
    document.getElementById("wprev").onclick = function () { if (k > 0) { k--; show(); } setPlay(false); };
    document.getElementById("wnext").onclick = function () { if (k < slides.length - 1) { k++; show(); } setPlay(false); };
    pb.onclick = function () { if (!playing && k === slides.length - 1) { k = 0; show(); } setPlay(!playing); };
    show(); setPlay(playing);
    /* tabs + video */
    document.querySelectorAll("[data-tab]").forEach(function (b) {
      b.onclick = function () {
        document.querySelectorAll("[data-tab]").forEach(function (x) { x.classList.toggle("on", x === b); });
        var v = b.getAttribute("data-tab") === "v";
        document.getElementById("vpane").style.display = v ? "" : "none";
        document.getElementById("wpane").style.display = v ? "none" : "";
        if (v) setPlay(false); else { k = 0; show(); setPlay(true); }
      };
    });
    var cb = document.getElementById("watched");
    if (cb) cb.onchange = function () { st.watch[id] = cb.checked || st.watch[id]; save(); updateDone(); };
    var lv = document.getElementById("lvid");
    if (lv) lv.addEventListener("ended", function () { st.watch[id] = true; if (cb) cb.checked = true; save(); updateDone(); });
    /* interactive tool */
    toolWire(l);
    /* quick check */
    document.getElementById("qc").addEventListener("click", function (e) {
      var b = e.target.closest(".opt"); if (!b || b.disabled) return;
      var qi = +b.closest(".q").getAttribute("data-q"), oi = +b.getAttribute("data-o");
      st.qc[id + ":" + qi] = oi; save();
      document.getElementById("qc").innerHTML = quizBlock(l.qc, id); updateDone();
    });
    function updateDone() {
      var w = !!st.watch[id], q = l.qc.every(function (q, qi) { return st.qc[id + ":" + qi] !== undefined; });
      var box = document.getElementById("donebox"); if (!box) return;
      var nextHref = next ? (next.mod !== l.mod ? "#/recap/" + l.mod : "#/lesson/" + next.id) : "#/recap/" + MODULES.length;
      var nextLabel = next ? (next.mod !== l.mod ? "Module " + l.mod + " recap →" : "Next: Lesson " + next.id + " →") : "Module " + MODULES.length + " recap →";
      if (st.done[id]) { box.innerHTML = '<div class="row" style="justify-content:space-between"><div><b>✓ Lesson complete.</b> <span class="muted small">Great work.</span></div><a class="btn btn-accent" href="' + nextHref + '">' + nextLabel + "</a></div>"; return; }
      box.innerHTML = "<h3>Finish this lesson</h3><ul class=\"clean\" style=\"margin:8px 0 14px;list-style:none;padding:0\"><li>" + (w ? "✅" : "⬜") + " " + (url ? "Watch the video (or finish the self-paced steps)" : "Finish the animated walkthrough") + "</li><li>" + (q ? "✅" : "⬜") + " Answer both quick-check questions</li></ul>" +
        '<button class="btn btn-accent" id="mark"' + (w && q ? "" : " disabled") + ">Mark lesson complete</button>";
      var mk = document.getElementById("mark");
      if (mk) mk.onclick = function () { st.done[id] = true; save(); updateDone(); };
    }
    updateDone();
  }
  function viewRecap(m) {
    var ls = LESSONS.filter(function (l) { return l.mod === m; }), mod = MODULES[m - 1];
    if (!ls.every(function (l) { return st.done[l.id]; })) return '<div class="card" style="text-align:center;max-width:640px;margin:30px auto"><div style="font-size:44px">🔒</div><h2>Finish Module ' + m + ' first</h2><p style="margin-top:14px"><a class="btn btn-accent" href="#/path">Go to the course path</a></p></div>';
    var t = '<table><tr><th>Lesson</th><th>Key idea</th><th>Remember</th></tr>' + ls.map(function (l) { return "<tr><td><b>" + l.id + " " + l.title + "</b></td><td>" + l.recap[0] + "</td><td>" + l.recap[1] + "</td></tr>"; }).join("") + "</table>";
    var nextMod = MODULES[m];
    return '<span class="tag indigo">Module ' + m + ' recap</span><h1 style="font-size:clamp(30px,4vw,42px);margin-top:10px">' + mod.title + '</h1><p class="muted" style="margin:8px 0 18px">The main ideas from each lesson, on one page.</p>' +
      '<div class="card tscroll">' + t + "</div>" +
      '<div class="card" style="margin-top:16px"><h3>Key takeaway</h3><p class="muted" style="margin-top:6px">' + mod.takeaway + "</p></div>" +
      '<p style="margin-top:20px">' + (nextMod ? '<a class="btn btn-accent" href="#/lesson/' + LESSONS.filter(function (l) { return l.mod === nextMod.n; })[0].id + '">Start Module ' + nextMod.n + ": " + nextMod.title + " →</a>" : '<a class="btn btn-sun" href="#/test">Take the final test →</a>') + "</p>";
  }
  /* ---- final test ---- */
  var T = null; /* active attempt */
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function newAttempt() {
    var order = shuffle(TEST.map(function (q, i) { return i; }));
    T = { qs: order.map(function (qi) { var q = TEST[qi]; var perm = shuffle([0, 1, 2, 3]); return { m: q.m, q: q.q, e: q.e, o: perm.map(function (p) { return q.o[p]; }), a: perm.indexOf(q.a) }; }), ans: {}, cur: 0, done: false };
  }
  function viewTest() {
    if (!allDone()) return '<div class="card" style="text-align:center;max-width:640px;margin:30px auto"><div style="font-size:44px">🔒</div><h2>The final test is locked</h2><p class="muted" style="margin:10px 0 18px">Complete all ' + LESSONS.length + ' lessons first (' + doneCount() + ' of ' + LESSONS.length + ' done).</p><a class="btn btn-accent" href="#/path">Go to the course path</a></div>';
    if (!T) {
      return '<div class="card" style="max-width:720px;margin:0 auto"><span class="tag">Final test</span><h1 style="font-size:clamp(30px,4vw,42px);margin-top:10px">' + CFG.title + ', final test</h1>' +
        '<ul class="clean" style="margin:14px 0 18px"><li>' + TEST.length + ' multiple-choice questions in random order, covering every module ' + CFG.testNote + '</li><li>Answers are revealed only after you submit</li><li>Pass mark: 70% (' + Math.ceil(TEST.length * PASS) + ' of ' + TEST.length + ')</li><li>No negative marking here, unlike the real exam</li><li>You can review your answers and retake the test</li></ul>' +
        (st.test ? '<p class="small muted" style="margin-bottom:14px">Previous best: ' + st.test.best + "% · attempts: " + st.test.attempts + (st.test.passed ? " · passed ✓" : "") + "</p>" : "") +
        '<button class="btn btn-accent" id="tstart">Start the test</button></div>';
    }
    if (T.done) return testResults();
    var q = T.qs[T.cur], answered = Object.keys(T.ans).length;
    return '<div style="max-width:760px;margin:0 auto"><div class="row" style="justify-content:space-between"><span class="tag indigo">Question ' + (T.cur + 1) + " of " + T.qs.length + " · Module " + q.m + '</span><span class="small muted">' + answered + " answered</span></div>" +
      '<div class="bar" style="margin:12px 0 18px"><i style="width:' + ((T.cur + 1) / T.qs.length * 100) + '%"></i></div>' +
      '<div class="q"><b style="font-size:19px">' + q.q + '</b><div class="opts" id="topts">' + q.o.map(function (o, oi) { return '<button class="opt ' + (T.ans[T.cur] === oi ? "sel" : "") + '" data-o="' + oi + '"><span class="k">' + "ABCD"[oi] + ".</span><span>" + o + "</span></button>"; }).join("") + "</div></div>" +
      '<div class="row" style="justify-content:space-between;margin-top:16px"><button class="btn btn-soft" id="tprev"' + (T.cur === 0 ? " disabled" : "") + '>← Previous</button>' +
      (T.cur < T.qs.length - 1 ? '<button class="btn btn-ink" id="tnext">Next →</button>' : '<button class="btn btn-accent" id="tsubmit">Submit test</button>') + "</div>" +
      '<p id="terr" class="err" style="margin-top:10px"></p></div>';
  }
  function testResults() {
    var c = 0, mc = {}, mt = {}; MODULES.forEach(function (m) { mc[m.n] = 0; mt[m.n] = 0; });
    T.qs.forEach(function (q, i) { mt[q.m]++; if (T.ans[i] === q.a) { c++; mc[q.m]++; } });
    var pct = Math.round(c / T.qs.length * 100), ok = c / T.qs.length >= PASS;
    var h = '<div style="max-width:820px;margin:0 auto"><div class="card" style="text-align:center"><div style="font-size:48px">' + (ok ? "🎉" : "📘") + "</div><h1 style=\"font-size:clamp(30px,4vw,42px)\">" + (ok ? "You passed!" : "Not quite yet") + "</h1>" +
      '<p style="font-size:22px;font-weight:800;margin-top:8px">' + c + " / " + T.qs.length + " · " + pct + "%</p>" +
      '<div class="kv" style="justify-content:center;margin-top:10px">' + MODULES.map(function (m) { return "<span>" + m.short + ": " + mc[m.n] + " / " + mt[m.n] + "</span>"; }).join("") + "</div>" +
      '<p class="muted" style="margin-top:10px">' + (ok ? "Excellent work. Your certificate is ready." : "You need 70% to pass. Review the lessons for the module where you scored lower, then try again.") + "</p>" +
      '<div class="row" style="justify-content:center;margin-top:16px">' + (ok ? '<a class="btn btn-sun" href="#/certificate">Get your certificate</a>' : "") + '<button class="btn btn-soft" id="tretake">Retake the test</button></div></div>' +
      '<h2 style="margin:28px 0 12px">Review your answers</h2><div class="stack">' + T.qs.map(function (q, i) {
        return '<div class="q"><b>' + (i + 1) + ". " + q.q + '</b><div class="opts">' + q.o.map(function (o, oi) { var cls = oi === q.a ? "ok" : (T.ans[i] === oi ? "bad" : ""); return '<div class="opt ' + cls + '"><span class="k">' + "ABCD"[oi] + ".</span><span>" + o + (oi === q.a ? " ✓" : (T.ans[i] === oi ? " (your answer)" : "")) + "</span></div>"; }).join("") + '</div><div class="expl">' + q.e + "</div></div>";
      }).join("") + "</div></div>";
    return h;
  }
  function testWire() {
    var s = document.getElementById("tstart"); if (s) s.onclick = function () { newAttempt(); render(); };
    var r = document.getElementById("tretake"); if (r) r.onclick = function () { newAttempt(); render(); };
    var o = document.getElementById("topts");
    if (o) o.onclick = function (e) { var b = e.target.closest(".opt"); if (!b) return; T.ans[T.cur] = +b.getAttribute("data-o"); render(); };
    var p = document.getElementById("tprev"); if (p) p.onclick = function () { T.cur--; render(); };
    var n = document.getElementById("tnext"); if (n) n.onclick = function () { T.cur++; render(); };
    var sb = document.getElementById("tsubmit");
    if (sb) sb.onclick = function () {
      var miss = []; T.qs.forEach(function (q, i) { if (T.ans[i] === undefined) miss.push(i + 1); });
      if (miss.length) { document.getElementById("terr").textContent = "Please answer question" + (miss.length > 1 ? "s " : " ") + miss.join(", ") + " before submitting."; return; }
      T.done = true;
      var c = T.qs.filter(function (q, i) { return T.ans[i] === q.a; }).length, pct = Math.round(c / T.qs.length * 100);
      var prev = st.test || { best: 0, attempts: 0, passed: false };
      st.test = { best: Math.max(prev.best, pct), attempts: prev.attempts + 1, passed: prev.passed || c / T.qs.length >= PASS, last: pct };
      if (c / T.qs.length >= PASS && (!st.test.passScore || pct > st.test.passScore)) st.test.passScore = pct;
      if (prev.passScore && (!st.test.passScore || prev.passScore > st.test.passScore)) st.test.passScore = prev.passScore;
      save(); render(); window.scrollTo(0, 0);
    };
  }
  /* ---- certificate ---- */
  function certId() { var c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", s = ""; for (var i = 0; i < 6; i++) s += c[Math.floor(Math.random() * c.length)]; return CFG.certPrefix + "-" + new Date().getFullYear() + "-" + s; }
  function viewCert() {
    if (!passed()) return '<div class="card" style="text-align:center;max-width:640px;margin:30px auto"><div style="font-size:44px">🏅</div><h2>Your certificate is waiting</h2><p class="muted" style="margin:10px 0 18px">Complete all ' + LESSONS.length + ' lessons and score at least 70% in the final test to unlock it.</p><a class="btn btn-accent" href="' + (allDone() ? "#/test" : "#/path") + '">' + (allDone() ? "Take the final test" : "Continue the course") + "</a></div>";
    if (!st.cert) {
      return '<div class="card" style="max-width:620px;margin:0 auto"><span class="tag mint">Passed · ' + (st.test.passScore || st.test.best) + '%</span><h1 style="font-size:clamp(28px,4vw,40px);margin-top:10px">Claim your certificate</h1><p class="muted" style="margin:8px 0 16px">Enter your name exactly as it should appear on the certificate.</p>' +
        '<div class="stack"><div class="field"><label for="cn">Full name</label><input id="cn" maxlength="60" autocomplete="name"></div><div class="field"><label for="ci">Institution (optional)</label><input id="ci" maxlength="80" autocomplete="organization"></div><p id="cerr" class="err"></p><button class="btn btn-accent" id="cgo2">Create my certificate</button></div></div>';
    }
    var c = st.cert;
    return '<div class="cert" id="certv"><div class="small muted" style="letter-spacing:.12em;font-weight:700">AISTUDYTOOLS</div><h2 style="margin-top:6px">Certificate of Completion</h2><p class="muted" style="margin-top:14px">This is to certify that</p><div class="nm">' + esc(c.name) + "</div>" +
      (c.inst ? '<p class="muted">' + esc(c.inst) + "</p>" : "") + '<p style="margin-top:10px">has successfully completed the course</p><h3 style="font-size:26px;margin-top:6px;color:var(--accent-dk)">' + CFG.title + '</h3>' +
      '<p class="muted small" style="margin-top:6px">' + CFG.certSub + '</p><p style="margin-top:12px">with a final test score of <b>' + c.score + "%</b></p>" +
      '<div class="row" style="justify-content:space-between;margin-top:26px;text-align:left"><div class="small"><b>Date:</b> ' + esc(c.date) + "<br><b>Certificate ID:</b> " + esc(c.id) + '</div><div class="small" style="text-align:right;width:220px;max-width:100%">' + SIG_SVG + '<div style="border-top:1px solid #C9CCF7;padding-top:4px;margin-top:2px"><b>Founder</b><br>Intellique Research School</div></div></div></div>' +
      '<div class="row noprint" style="justify-content:center;margin-top:18px"><button class="btn btn-accent" id="cpdf">Download certificate (PDF)</button><button class="btn btn-soft" id="cprint">Print</button></div>' +
      '<p class="small muted noprint" style="text-align:center;margin-top:10px">This is a certificate of completion issued by AIStudyTools, a subsidiary of Intellique Research School Private Limited. It is not an accredited qualification, and it is not issued by or affiliated with ' + BODY.full + '.</p>';
  }
  function certWire() {
    var g = document.getElementById("cgo2");
    if (g) g.onclick = function () {
      var nm = document.getElementById("cn").value.trim().replace(/\s+/g, " "), ins = document.getElementById("ci").value.trim();
      if (nm.length < 2) { document.getElementById("cerr").textContent = "Please enter your full name."; return; }
      var d = new Date();
      st.cert = { name: nm, inst: ins, id: certId(), date: d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), score: st.test.passScore || st.test.best };
      save(); render();
    };
    var p = document.getElementById("cprint"); if (p) p.onclick = function () { window.print(); };
    var pdf = document.getElementById("cpdf"); if (pdf) pdf.onclick = makePdf;
  }
var SIG_SVG = '<svg style="width:100%;height:auto;display:block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 891.858594 196.918767"><g transform="translate(-4.000000,200.919555) scale(0.100000,-0.100000)" fill="#1E3A8A"><path d="M5095 1986 c-367 -97 -821 -442 -791 -600 11 -60 82 -109 252 -176 168 -67 314 -158 314 -196 0 -5 -39 -20 -87 -33 -334 -91 -725 -331 -794 -487 -72 -161 169 -163 496 -4 260 127 445 317 445 457 0 45 -3 43 88 56 7 1 12 7 10 12 -2 6 -27 9 -58 7 -51 -3 -57 -2 -70 23 -32 59 -140 127 -320 201 -196 80 -230 103 -230 157 0 196 743 636 943 558 73 -28 -13 -186 -133 -244 -66 -31 -200 -151 -200 -178 0 -40 40 -23 155 66 334 260 323 472 -20 381z m-213 -1074 c-26 -97 -112 -193 -268 -297 -247 -166 -594 -265 -594 -169 0 135 470 434 820 522 48 13 57 1 42 -56z M7305 2003 c-141 -18 -465 -102 -702 -182 -29 -10 -53 -17 -53 -16 0 2 7 16 15 31 38 73 -2 73 -43 1 -29 -52 -33 -55 -119 -87 -367 -136 -652 -288 -669 -356 -12 -46 19 -63 147 -85 63 -11 121 -22 131 -25 23 -7 32 13 10 25 -10 5 -58 17 -108 26 -152 27 -165 42 -86 100 86 63 613 308 629 292 1 -1 -53 -111 -120 -244 l-121 -241 -56 -17 c-121 -38 -250 -89 -254 -102 -11 -26 24 -24 106 6 110 41 109 41 124 5 12 -29 8 -41 -92 -260 -203 -444 -222 -494 -190 -494 9 0 20 10 25 23 19 50 366 805 373 812 17 18 416 128 439 122 27 -7 57 18 42 34 -16 16 -136 -7 -300 -57 -65 -20 -126 -39 -136 -41 -22 -7 9 61 139 311 l89 170 85 28 c370 125 781 216 805 178 9 -14 35 0 35 20 0 29 -46 36 -145 23z m-1122 -830 c-11 -33 -16 -37 -23 -17 -9 23 -4 34 15 34 9 0 12 -6 8 -17z M2646 1896 c-282 -102 -687 -484 -828 -781 -45 -95 -32 -165 30 -165 30 0 28 18 -4 30 -24 9 -26 14 -21 46 43 264 689 854 936 854 112 0 76 -183 -119 -600 l-72 -155 -116 -58 c-396 -195 -792 -657 -792 -922 0 -53 40 -105 82 -105 175 0 541 441 829 1000 33 63 36 65 94 83 33 11 66 21 74 23 39 12 -9 24 -54 14 -26 -6 -49 -9 -51 -7 -2 2 22 60 55 129 129 272 189 458 177 541 -14 92 -94 118 -220 73z m-175 -955 c-203 -373 -461 -706 -635 -822 -149 -100 -180 9 -67 236 122 244 413 535 677 677 49 26 90 45 92 43 3 -2 -28 -63 -67 -134z M3300 1673 c-77 -86 -175 -240 -252 -394 -69 -140 -129 -213 -206 -253 -38 -20 -42 -20 -42 -1 0 47 -73 34 -102 -18 -7 -13 -28 -46 -46 -73 -24 -36 -32 -58 -30 -84 7 -79 96 -32 153 80 18 35 33 52 51 56 14 4 46 22 71 41 32 25 44 30 38 17 -42 -100 -86 -227 -81 -239 10 -27 23 -17 106 81 45 52 84 94 85 92 2 -2 0 -21 -5 -43 -19 -84 15 -114 80 -71 49 32 48 33 46 -6 -2 -53 38 -50 102 7 l51 46 3 -28 c5 -42 37 -41 87 2 53 43 55 43 34 0 -13 -26 -14 -38 -5 -47 8 -8 29 6 84 57 l73 68 3 -39 c5 -63 34 -74 93 -33 l25 18 -4 -30 c-6 -42 11 -37 81 26 69 63 74 65 83 30 13 -54 70 -68 146 -38 51 20 175 91 184 104 18 31 -20 22 -111 -26 -136 -71 -185 -72 -185 -3 0 53 -43 45 -113 -21 l-28 -26 16 37 c26 65 11 66 -55 4 -25 -24 -57 -49 -69 -56 l-24 -12 7 56 c10 79 -21 77 -113 -8 l-33 -31 21 42 c11 23 21 49 21 58 0 22 -27 19 -40 -5 -15 -28 -133 -125 -137 -113 -2 6 5 34 17 62 24 63 24 61 1 61 -10 0 -24 7 -31 15 -21 25 -38 18 -105 -45 -78 -72 -155 -124 -168 -111 -5 5 0 38 11 79 34 120 -12 115 -123 -12 l-45 -51 41 100 c59 142 76 173 131 235 110 123 293 426 286 474 -5 35 -25 27 -78 -31z m-36 -134 c-47 -81 -153 -239 -160 -239 -8 0 41 83 119 202 77 118 100 138 41 37z m29 -601 c-21 -22 -51 -49 -67 -61 l-29 -21 24 43 c31 57 102 120 107 96 2 -10 -13 -35 -35 -57z m-548 2 c-18 -35 -83 -105 -91 -98 -7 8 20 72 46 108 29 40 67 32 45 -10z M885 1655 c-227 -42 -506 -196 -696 -385 -97 -95 -149 -174 -149 -223 0 -27 28 -57 53 -57 21 0 22 19 2 26 -48 19 5 114 133 236 237 225 615 397 809 369 l43 -6 -116 -220 c-64 -121 -142 -271 -173 -333 l-57 -112 -121 -60 c-310 -152 -496 -328 -439 -414 113 -173 854 183 1102 528 37 52 42 55 82 56 23 0 42 5 42 10 0 6 -9 10 -19 10 -32 0 -52 11 -43 24 25 31 54 136 55 196 2 118 -87 253 -208 316 -29 16 -52 32 -49 35 7 12 -17 22 -28 11 -6 -6 -24 -6 -46 -1 -49 11 -92 10 -177 -6z m296 -83 c161 -103 210 -267 128 -430 l-34 -66 -64 -3 c-75 -4 -211 -34 -330 -74 -46 -16 -86 -27 -88 -25 -2 2 44 93 102 202 58 110 131 250 163 312 31 61 61 112 67 112 6 0 31 -13 56 -28z m41 -569 c-170 -203 -464 -397 -739 -489 -264 -89 -359 -35 -199 113 88 81 378 263 420 263 3 0 -4 -21 -15 -46 -20 -43 -20 -74 -1 -74 5 0 22 32 37 71 16 38 36 74 45 79 41 22 297 101 367 114 132 24 131 24 85 -31z M7514 1215 c-3 -8 -3 -19 1 -25 9 -14 35 6 35 26 0 19 -29 18 -36 -1z M7609 1141 c-16 -17 -29 -40 -29 -54 0 -24 -54 -78 -107 -105 -35 -19 -36 -15 -9 35 19 33 23 49 16 57 -8 8 -15 6 -25 -7 -16 -22 -164 -117 -181 -117 -20 0 -5 36 32 77 19 21 31 31 28 22 -9 -28 14 -31 31 -5 43 65 -8 84 -68 26 -51 -51 -127 -105 -127 -91 0 6 9 33 20 61 31 77 5 79 -72 4 -51 -50 -58 -54 -44 -27 16 32 21 63 10 63 -3 0 -36 -27 -72 -60 -90 -81 -92 -80 -48 23 18 41 14 60 -9 50 -8 -3 -15 0 -15 6 0 26 -45 8 -93 -37 -60 -56 -224 -182 -237 -182 -18 0 12 58 65 125 76 97 79 104 59 112 -9 3 -36 -1 -60 -10 -44 -16 -55 -12 -32 11 9 9 9 15 1 23 -18 18 -62 -15 -69 -51 -4 -19 -64 -90 -180 -214 -96 -102 -174 -188 -174 -191 0 -29 107 70 268 247 93 103 119 126 152 135 l41 10 -26 -31 c-68 -84 -105 -167 -85 -191 20 -24 41 -18 110 34 61 47 65 48 70 28 9 -34 42 -31 91 7 37 30 45 33 48 18 8 -39 40 -33 94 16 30 28 33 26 15 -13 -9 -20 -9 -28 0 -37 9 -9 27 3 77 52 67 67 72 69 55 26 -20 -55 9 -70 66 -35 l34 21 0 -26 c0 -50 47 -42 153 28 l27 18 0 -25 c0 -52 35 -47 116 19 64 53 62 52 69 11 6 -30 1 -38 -75 -114 -90 -90 -103 -125 -47 -131 59 -7 153 82 164 155 7 46 14 56 58 82 l33 19 -5 -33 c-4 -26 -1 -35 15 -44 25 -13 38 -9 122 42 36 22 68 41 72 43 3 2 1 -10 -5 -26 -13 -34 -2 -63 26 -68 18 -4 113 80 122 107 6 19 356 83 558 101 125 12 265 0 283 -25 6 -8 19 -15 28 -15 25 0 16 29 -17 54 -51 38 -335 29 -599 -17 -243 -43 -225 -42 -233 -18 -12 40 -89 29 -105 -14 -8 -22 -191 -135 -218 -135 -18 0 -14 24 11 60 25 38 47 50 47 26 0 -26 18 -18 35 15 37 71 4 96 -56 42 -23 -21 -69 -54 -103 -75 l-61 -37 -14 30 c-14 28 -13 31 16 62 66 69 29 125 -38 58z m29 -31 c-7 -11 -17 -20 -22 -20 -5 0 -1 9 9 20 10 11 20 20 22 20 2 0 -2 -9 -9 -20z m-783 -128 c-71 -66 -82 -60 -25 13 50 65 73 82 79 57 2 -10 -19 -37 -54 -70z m1179 69 c17 -6 14 -12 -24 -52 -49 -50 -63 -40 -29 21 24 43 24 43 53 31z m-460 -192 c-30 -42 -94 -90 -94 -70 0 17 108 126 117 118 3 -4 -7 -26 -23 -48z M1451 1089 c-11 -18 -17 -37 -15 -43 2 -6 -34 -60 -81 -120 -70 -91 -90 -126 -71 -126 2 0 43 50 91 110 49 61 91 110 94 110 3 0 17 3 30 7 21 5 20 2 -14 -46 -99 -137 -61 -218 54 -115 69 62 67 87 -2 34 -92 -69 -94 -43 -8 79 25 36 50 71 54 78 15 25 -3 32 -45 17 -51 -18 -49 -18 -38 10 17 47 -22 50 -49 5z M5106 1026 c-130 -130 -128 -258 2 -141 l52 47 0 -30 c0 -54 26 -52 97 5 l43 34 -6 -29 c-10 -51 13 -46 83 17 73 67 83 72 83 38 0 -35 35 -62 78 -61 62 2 252 105 252 137 0 15 -16 9 -94 -33 -143 -77 -196 -86 -196 -34 0 14 -5 34 -10 45 -12 22 -42 12 -99 -37 -35 -29 -38 -26 -15 17 28 54 9 67 -34 23 -53 -55 -131 -118 -138 -111 -3 3 6 31 20 62 26 57 26 81 1 71 -7 -2 -16 2 -19 10 -11 28 -55 15 -100 -30z m74 -7 c0 -20 -83 -109 -121 -130 -33 -17 2 42 60 102 53 55 61 58 61 28z M1625 850 c-4 -7 -3 -16 3 -22 14 -14 45 -2 40 15 -6 16 -34 21 -43 7z"/></g></svg>';
  function sigPng(cb) { try { var img = new Image(); img.onload = function () { var cv = document.createElement("canvas"); cv.width = 1200; cv.height = Math.round(1200 * 196.92 / 891.86); cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height); cb(cv.toDataURL("image/png")); }; img.onerror = function () { cb(null); }; img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(SIG_SVG); } catch (e) { cb(null); } }
  function makePdf() {
    var c = st.cert;
    if (!window.jspdf || !window.jspdf.jsPDF) { alertBox("The PDF tool is still loading or blocked. Please use Print → Save as PDF instead."); return; }
    var doc = new window.jspdf.jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    var W = 297, H = 210;
    doc.setFillColor(250, 250, 255); doc.rect(0, 0, W, H, "F");
    doc.setDrawColor(79, 70, 229); doc.setLineWidth(2.2); doc.rect(10, 10, W - 20, H - 20);
    doc.setLineWidth(0.6); doc.rect(14, 14, W - 28, H - 28);
    doc.setFillColor(79, 70, 229); doc.circle(W / 2 - 4, 30, 5, "F"); doc.setFillColor(251, 191, 36); doc.circle(W / 2, 26.5, 2, "F");
    doc.setTextColor(110, 108, 148); doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.text("AISTUDYTOOLS", W / 2, 44, { align: "center" });
    doc.setTextColor(30, 27, 75); doc.setFontSize(30); doc.text("Certificate of Completion", W / 2, 60, { align: "center" });
    doc.setFont("helvetica", "normal"); doc.setFontSize(13); doc.setTextColor(74, 72, 120); doc.text("This is to certify that", W / 2, 76, { align: "center" });
    doc.setFont("helvetica", "bold"); doc.setFontSize(28); doc.setTextColor(55, 48, 163); doc.text(c.name, W / 2, 93, { align: "center" });
    doc.setDrawColor(201, 204, 247); doc.setLineWidth(0.5); doc.line(W / 2 - 70, 97, W / 2 + 70, 97);
    var y = 106;
    if (c.inst) { doc.setFont("helvetica", "normal"); doc.setFontSize(12); doc.setTextColor(74, 72, 120); doc.text(c.inst, W / 2, y, { align: "center" }); y += 9; }
    doc.setFont("helvetica", "normal"); doc.setFontSize(13); doc.setTextColor(30, 27, 75); doc.text("has successfully completed the course", W / 2, y + 2, { align: "center" });
    doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.setTextColor(55, 48, 163); doc.text(CFG.title, W / 2, y + 15, { align: "center" });
    doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(110, 108, 148); doc.text(CFG.certSub.replace(/ · /g, "  |  "), W / 2, y + 23, { align: "center" });
    doc.setFontSize(13); doc.setTextColor(30, 27, 75); doc.text("Final test score: " + c.score + "%", W / 2, y + 33, { align: "center" });
    doc.setFontSize(11); doc.setTextColor(74, 72, 120);
    doc.text("Date: " + c.date, 30, H - 30); doc.text("Certificate ID: " + c.id, 30, H - 24);
    doc.setFont("helvetica", "bold"); doc.setTextColor(30, 27, 75); doc.text("Founder", W - 30, H - 30, { align: "right" });
    doc.setFont("helvetica", "normal"); doc.setTextColor(74, 72, 120); doc.text("Intellique Research School", W - 30, H - 24, { align: "right" });
    doc.setFontSize(8.5); doc.setTextColor(150, 150, 170); doc.text("Certificate of completion issued by AIStudyTools (www.aistudytools.com), a subsidiary of Intellique Research School Private Limited.", W / 2, H - 17, { align: "center" }); doc.text("Not an accredited qualification. Not issued by or affiliated with " + BODY.full + ".", W / 2, H - 13, { align: "center" });
    sigPng(function (png) {
      if (png) doc.addImage(png, "PNG", W - 86, H - 48.5, 56, 12.4);
      doc.setDrawColor(201, 204, 247); doc.setLineWidth(0.4); doc.line(W - 86, H - 35, W - 30, H - 35);
      doc.save(CFG.title.replace(/[^A-Za-z0-9]+/g, "-") + "-Certificate-" + c.name.replace(/[^A-Za-z0-9]+/g, "-") + ".pdf");
    });
  }
  function alertBox(msg) { var d = document.createElement("p"); d.className = "err noprint"; d.style.textAlign = "center"; d.textContent = msg; app.appendChild(d); }
  /* ---- glossary ---- */
  function viewGlossary() {
    return '<h1 style="font-size:clamp(30px,4vw,42px)">Glossary</h1><p class="muted" style="margin:8px 0 16px">' + GLOSSARY.length + ' key terms. Search or filter by module.</p>' +
      '<div class="row" style="margin-bottom:16px;flex-wrap:wrap"><input id="gq" placeholder="Search terms or definitions" style="flex:1;min-width:220px;font:inherit;font-size:16px;padding:11px 14px;border:2px solid var(--border);border-radius:14px"><select id="gm" style="max-width:100%;font:inherit;font-size:16px;padding:11px 14px;border:2px solid var(--border);border-radius:14px;background:#fff"><option value="">All modules</option>' + MODULES.map(function (m) { return '<option value="' + m.n + '">Module ' + m.n + ": " + m.title + "</option>"; }).join("") + '</select></div><div class="grid g2" id="gl"></div>';
  }
  function glossWire() {
    var q = document.getElementById("gq"), m = document.getElementById("gm"), out = document.getElementById("gl");
    function draw() {
      var t = q.value.trim().toLowerCase(), mv = m.value;
      var items = GLOSSARY.slice().sort(function (a, b) { return a[0].localeCompare(b[0]); }).filter(function (g) { return (!mv || g[3].charAt(0) === mv) && (!t || (g[0] + " " + g[1]).toLowerCase().indexOf(t) >= 0); });
      out.innerHTML = items.length ? items.map(function (g) {
        var l = LESSONS[idx(g[3])];
        return '<div class="gl-item"><b>' + g[0] + '</b><p class="muted small" style="margin-top:4px">' + g[1] + '</p><p class="small" style="margin-top:6px"><i>Example:</i> ' + g[2] + '</p><p class="small" style="margin-top:6px">Lesson ' + (unlocked(l.id) ? '<a href="#/lesson/' + l.id + '">' + l.id + " · " + l.title + "</a>" : l.id + " · " + l.title + " 🔒") + "</p></div>";
      }).join("") : '<p class="muted">No terms match your search. Try a different word.</p>';
    }
    q.oninput = draw; m.onchange = draw; draw();
  }
  function viewNotFound() { return '<div class="card" style="text-align:center;max-width:600px;margin:30px auto"><h2>Page not found</h2><p style="margin-top:14px"><a class="btn btn-accent" href="#/">Go to course home</a></p></div>'; }

  /* ================= ROUTER ================= */
  function render() {
    stopTimer();
    var hsh = location.hash.replace(/^#\/?/, ""), parts = hsh.split("/"), r = parts[0] || "home", out, after = null;
    if (r === "home") out = viewHome();
    else if (r === "path") out = viewPath();
    else if (r === "lesson") out = viewLesson(parts[1]);
    else if (r === "recap") out = viewRecap(Math.min(Math.max(parseInt(parts[1], 10) || 1, 1), MODULES.length));
    else if (r === "test") { out = viewTest(); after = testWire; }
    else if (r === "certificate") { out = viewCert(); after = certWire; }
    else if (r === "glossary") { out = viewGlossary(); after = glossWire; }
    else out = viewNotFound();
    if (out && typeof out === "object") { after = out.after; out = out.html; }
    app.innerHTML = out;
    if (r === "path") { var rs = document.getElementById("reset"); if (rs) rs.onclick = function () { if (confirm("Reset all your progress, test results and certificate in this browser?")) { localStorage.removeItem(KEY); load(); T = null; render(); } }; }
    if (after) after();
    document.querySelectorAll(".tnav a[data-r]").forEach(function (a) { a.classList.toggle("on", a.getAttribute("data-r") === r || (r === "lesson" && a.getAttribute("data-r") === "path")); });
    var titles = { home: CFG.title, path: "Course path", lesson: "Lesson " + (parts[1] || ""), recap: "Module recap", test: "Final test", certificate: "Certificate", glossary: "Glossary" };
    document.title = (titles[r] || CFG.title) + " | AIStudyTools";
  }
  var lastRoute = "";
  window.addEventListener("hashchange", function () { var r = location.hash; if (r.indexOf("#/test") !== 0) T = T && T.done ? null : T; render(); if (r !== lastRoute) window.scrollTo(0, 0); lastRoute = r; });
  render();
})();
