/* Basics of Statistics — course content and app (no external services; progress saved in localStorage) */
(function () {
  "use strict";

  /* ================= STATISTICS FUNCTIONS ================= */
  var S = {
    sum: function (a) { var s = 0; for (var i = 0; i < a.length; i++) s += a[i]; return s; },
    sorted: function (a) { return a.slice().sort(function (x, y) { return x - y; }); },
    mean: function (a) { return S.sum(a) / a.length; },
    median: function (a) {
      var s = S.sorted(a), n = s.length, m = Math.floor(n / 2);
      return n % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
    },
    freq: function (a) {
      var map = {}, order = [];
      a.forEach(function (x) { var k = String(x); if (!(k in map)) { map[k] = 0; order.push(x); } map[k]++; });
      return order.map(function (x) { return { v: x, f: map[String(x)] }; });
    },
    modes: function (a) {
      var fr = S.freq(a), max = 0;
      fr.forEach(function (o) { if (o.f > max) max = o.f; });
      if (fr.length > 1 && fr.every(function (o) { return o.f === max; })) return [];
      return fr.filter(function (o) { return o.f === max; }).map(function (o) { return o.v; });
    },
    /* quartiles by the median-of-halves method (median excluded from both halves when n is odd) */
    halves: function (a) {
      var s = S.sorted(a), n = s.length, h = Math.floor(n / 2);
      return { lower: s.slice(0, h), upper: s.slice(n % 2 ? h + 1 : h) };
    },
    quartiles: function (a) {
      var hv = S.halves(a);
      return { q1: S.median(hv.lower), q2: S.median(a), q3: S.median(hv.upper), lower: hv.lower, upper: hv.upper };
    },
    sqDevSum: function (a) { var m = S.mean(a), t = 0; a.forEach(function (x) { t += (x - m) * (x - m); }); return t; },
    popVar: function (a) { return S.sqDevSum(a) / a.length; },
    sampVar: function (a) { return S.sqDevSum(a) / (a.length - 1); },
    popSD: function (a) { return Math.sqrt(S.popVar(a)); },
    sampSD: function (a) { return Math.sqrt(S.sampVar(a)); },
    meanDev: function (a) { var m = S.mean(a), t = 0; a.forEach(function (x) { t += Math.abs(x - m); }); return t / a.length; },
    weightedMean: function (x, w) { var t = 0, ws = 0; for (var i = 0; i < x.length; i++) { t += x[i] * w[i]; ws += w[i]; } return t / ws; }
  };
  window.BOS_STATS = S;

  function fmt(x) {
    if (typeof x !== "number" || !isFinite(x)) return String(x);
    var r = Math.round(x * 100) / 100;
    if (Object.is(r, -0)) r = 0;
    return String(r);
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function chips(a, cls) {
    return '<div class="chips">' + a.map(function (x, i) {
      var c = typeof cls === "function" ? cls(x, i) : (cls || "");
      return '<span class="chip ' + c + '">' + esc(x) + "</span>";
    }).join("") + "</div>";
  }
  function list(items) { return '<ul class="clean">' + items.map(function (t) { return "<li>" + t + "</li>"; }).join("") + "</ul>"; }

  /* ================= DATASETS ================= */
  var RUN = [2, 4, 4, 4, 5, 5, 7, 9]; /* weekly study hours of 8 students */
  var SALES = [12, 15, 11, 18, 14];
  var DELIV = [32, 28, 45, 30, 35];
  var SAL = [25, 28, 30, 32, 35, 300];
  var BIMODAL = [3, 3, 5, 7, 7, 8];
  var ODD9 = [3, 7, 8, 5, 12, 14, 21, 13, 18];
  var CLASSA = [60, 62, 65, 68, 70], CLASSB = [40, 50, 65, 80, 90];
  var SIB_X = [0, 1, 2, 3], SIB_F = [5, 8, 4, 3];
  var GR_X = [80, 70, 90], GR_W = [4, 3, 2];

  function devTable(a, kind) {
    var m = S.mean(a);
    var h = "<tr><th>x</th><th>x − x̄</th>" + (kind === "sq" ? "<th>(x − x̄)²</th>" : "<th>|x − x̄|</th>") + "</tr>";
    var rows = a.map(function (x) {
      var d = x - m;
      return "<tr><td>" + fmt(x) + "</td><td>" + fmt(d) + "</td><td>" + fmt(kind === "sq" ? d * d : Math.abs(d)) + "</td></tr>";
    }).join("");
    var tot = kind === "sq" ? S.sqDevSum(a) : S.meanDev(a) * a.length;
    rows += "<tr><th>Σ</th><th>" + fmt(0) + "</th><th>" + fmt(tot) + "</th></tr>";
    return '<div class="tscroll"><table>' + h + rows + "</table></div>";
  }
  function freqTable(a) {
    var fr = S.freq(S.sorted(a).map(function (x) { return x; }));
    return '<div class="tscroll"><table><tr><th>Value</th>' + fr.map(function (o) { return "<td>" + esc(o.v) + "</td>"; }).join("") +
      "</tr><tr><th>Frequency</th>" + fr.map(function (o) { return "<td>" + o.f + "</td>"; }).join("") + "</tr></table></div>";
  }
  function boxPlot(a) {
    var q = S.quartiles(a), s = S.sorted(a), iqr = q.q3 - q.q1, lo = q.q1 - 1.5 * iqr, hi = q.q3 + 1.5 * iqr;
    var inl = s.filter(function (x) { return x >= lo && x <= hi; });
    var wmin = inl[0], wmax = inl[inl.length - 1];
    var mn = s[0], mx = s[s.length - 1], span = (mx - mn) || 1;
    function X(v) { return 30 + (v - mn) / span * 500; }
    var out = s.filter(function (x) { return x < lo || x > hi; });
    var g = '<svg class="bp" viewBox="0 0 560 120" role="img" aria-label="Box plot">';
    g += '<line x1="' + X(wmin) + '" y1="50" x2="' + X(q.q1) + '" y2="50" stroke="#4A4878" stroke-width="2"/>';
    g += '<line x1="' + X(q.q3) + '" y1="50" x2="' + X(wmax) + '" y2="50" stroke="#4A4878" stroke-width="2"/>';
    g += '<line x1="' + X(wmin) + '" y1="38" x2="' + X(wmin) + '" y2="62" stroke="#4A4878" stroke-width="2"/>';
    g += '<line x1="' + X(wmax) + '" y1="38" x2="' + X(wmax) + '" y2="62" stroke="#4A4878" stroke-width="2"/>';
    g += '<rect x="' + X(q.q1) + '" y="28" width="' + Math.max(2, X(q.q3) - X(q.q1)) + '" height="44" rx="6" fill="#EEF0FF" stroke="#4F46E5" stroke-width="2"/>';
    g += '<line x1="' + X(q.q2) + '" y1="28" x2="' + X(q.q2) + '" y2="72" stroke="#F59E0B" stroke-width="4"/>';
    out.forEach(function (o) { g += '<circle cx="' + X(o) + '" cy="50" r="6" fill="#F87171"/>'; });
    [["Q1", q.q1], ["Median", q.q2], ["Q3", q.q3]].forEach(function (p, i) { g += '<text x="' + X(p[1]) + '" y="' + (i === 1 ? 20 : 92) + '" text-anchor="middle" font-size="13" fill="#1E1B4B" font-family="Outfit,sans-serif">' + p[0] + " " + fmt(p[1]) + "</text>"; });
    g += '<text x="' + X(mn) + '" y="114" text-anchor="middle" font-size="12" fill="#6E6C94" font-family="Outfit,sans-serif">' + fmt(mn) + '</text><text x="' + X(mx) + '" y="114" text-anchor="middle" font-size="12" fill="#6E6C94" font-family="Outfit,sans-serif">' + fmt(mx) + "</text></svg>";
    return g;
  }

  /* ================= LESSON CONTENT ================= */
  var Q1 = S.quartiles(RUN);
  var LESSONS = [
    {
      id: "1.1", mod: 1, title: "Mean (Arithmetic Mean)", time: "12 min", calc: "mean",
      outcomes: ["Calculate the mean of a list of values", "Calculate the mean of a frequency distribution", "Use a weighted mean when items count differently", "Explain why outliers pull the mean"],
      notes: "<p>The <b>mean</b> is what most people call the average: add all the values and divide by how many there are. It uses every value in the data, which makes it informative, but it also means one very large or very small value (an <b>outlier</b>) can pull it a long way.</p>",
      formula: "x̄ = Σx ÷ n<small>Σx = sum of all values, n = number of values</small>",
      extra: function () {
        var fx = SIB_X.map(function (x, i) { return x * SIB_F[i]; });
        return "<h4 style=\"margin:4px 0 8px\">Mean of a frequency distribution</h4><p class=\"muted small\" style=\"margin-bottom:8px\">Number of siblings for 20 students. Multiply each value by its frequency, add, then divide by the total frequency.</p>" +
          '<div class="tscroll"><table><tr><th>Siblings (x)</th>' + SIB_X.map(function (x) { return "<td>" + x + "</td>"; }).join("") + "<th>Total</th></tr><tr><th>Students (f)</th>" + SIB_F.map(function (f) { return "<td>" + f + "</td>"; }).join("") + "<td><b>" + S.sum(SIB_F) + "</b></td></tr><tr><th>f × x</th>" + fx.map(function (v) { return "<td>" + v + "</td>"; }).join("") + "<td><b>" + S.sum(fx) + "</b></td></tr></table></div>" +
          '<div class="formula" style="font-size:18px;margin-top:10px">x̄ = Σfx ÷ Σf = ' + S.sum(fx) + " ÷ " + S.sum(SIB_F) + " = " + fmt(S.weightedMean(SIB_X, SIB_F)) + " siblings</div>" +
          "<h4 style=\"margin:16px 0 8px\">Weighted mean</h4><p class=\"muted small\">A student scores " + GR_X[0] + " in a " + GR_W[0] + "-credit course, " + GR_X[1] + " in a " + GR_W[1] + "-credit course and " + GR_X[2] + " in a " + GR_W[2] + "-credit course. Credits are the weights: (" + GR_X[0] + "×" + GR_W[0] + " + " + GR_X[1] + "×" + GR_W[1] + " + " + GR_X[2] + "×" + GR_W[2] + ") ÷ " + S.sum(GR_W) + " = <b>" + fmt(S.weightedMean(GR_X, GR_W)) + "</b>. The simple mean would be " + fmt(S.mean(GR_X)) + ", which ignores that the first course counts more.</p>";
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Weekly study hours of 8 students: " + RUN.join(", ") + "</p>" + chips(RUN) +
          '<div class="formula" style="margin-top:12px">x̄ = (' + RUN.join(" + ") + ") ÷ " + RUN.length + " = " + S.sum(RUN) + " ÷ " + RUN.length + " = " + fmt(S.mean(RUN)) + " hours</div>" +
          "<p class=\"muted small\" style=\"margin-top:10px\">Second example, monthly sales (₹ lakh): " + SALES.join(", ") + " → mean = " + S.sum(SALES) + " ÷ " + SALES.length + " = <b>" + fmt(S.mean(SALES)) + "</b>.</p>";
      },
      use: ["Use it for numeric data without extreme outliers, e.g., average marks or average daily sales.", "It is the basis for standard deviation and many other statistics.", "Mistake: forgetting to divide by the number of values (n).", "Mistake: using the mean for skewed data like salaries, where one huge value distorts it."],
      walk: function () {
        return [
          { t: "The data", c: "Here are the weekly study hours of 8 students.", h: chips(RUN) },
          { t: "Add them up", c: "First, add every value.", h: chips(RUN, "hl") + '<div class="big">Σx = ' + S.sum(RUN) + "</div>" },
          { t: "Count them", c: "Next, count how many values there are.", h: chips(RUN.map(function (x, i) { return i + 1; }), "ac") + '<div class="big">n = ' + RUN.length + "</div>" },
          { t: "Divide", c: "Mean = total ÷ count.", h: '<div class="formula">x̄ = ' + S.sum(RUN) + " ÷ " + RUN.length + " = " + fmt(S.mean(RUN)) + "</div>" },
          { t: "Watch out for outliers", c: "If one student studied 45 hours instead of 9, the mean jumps from " + fmt(S.mean(RUN)) + " to " + fmt(S.mean([2, 4, 4, 4, 5, 5, 7, 45])) + ".", h: chips([2, 4, 4, 4, 5, 5, 7, 45], function (x) { return x === 45 ? "hl" : ""; }) + '<div class="big">x̄ = ' + fmt(S.mean([2, 4, 4, 4, 5, 5, 7, 45])) + "</div>" }
        ];
      },
      qc: [
        { q: "What is the mean of 3, 7 and 8?", o: ["6", "7", "18", "5"], a: 0, e: "(3 + 7 + 8) ÷ 3 = 18 ÷ 3 = 6." },
        { q: "One student's study hours change from 9 to 45. What happens to the mean?", o: ["It rises a lot, because the mean uses every value", "It stays the same", "It falls", "Only the median changes"], a: 0, e: "The mean includes every value, so a single extreme value pulls it strongly (here from 5 to 9.5)." }
      ]
    },
    {
      id: "1.2", mod: 1, title: "Median", time: "10 min", calc: "median",
      outcomes: ["Find the median for an odd and an even number of values", "Explain why the data must be sorted first", "Explain why the median resists outliers", "Choose the median for skewed data such as incomes"],
      notes: "<p>The <b>median</b> is the middle value once the data are <b>sorted</b> from smallest to largest. Half of the values lie below it and half above. Because it depends only on position, a few extreme values hardly move it. This makes it the preferred average for skewed data such as salaries, house prices or delivery times.</p>",
      formula: "Median = value in position (n + 1) ÷ 2<small>odd n: the middle value · even n: the mean of the two middle values</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">Median vs mean with an outlier</h4><p class=\"muted small\">Monthly salaries in a small team (₹ thousand): " + SAL.join(", ") + ". The mean is " + fmt(S.mean(SAL)) + ", but five of the six people earn far less than that. The median is (" + S.sorted(SAL)[2] + " + " + S.sorted(SAL)[3] + ") ÷ 2 = <b>" + fmt(S.median(SAL)) + "</b>, which describes a typical salary much better.</p>" +
          "<p class=\"muted small\" style=\"margin-top:8px\">For a frequency table, add up the frequencies cumulatively and find the value where the running total first reaches half of the total frequency.</p>";
      },
      example: function () {
        var s = S.sorted(DELIV);
        return "<p class=\"muted\" style=\"margin-bottom:10px\"><b>Odd n.</b> Delivery times (minutes): " + DELIV.join(", ") + ". Sorted:</p>" + chips(s, function (x, i) { return i === 2 ? "hl" : ""; }) +
          '<p style="margin-top:8px">n = 5, so the median is the 3rd value: <b>' + fmt(S.median(DELIV)) + " minutes</b>.</p>" +
          "<p class=\"muted\" style=\"margin:14px 0 10px\"><b>Even n.</b> Study hours (already sorted): " + RUN.join(", ") + "</p>" + chips(RUN, function (x, i) { return i === 3 || i === 4 ? "hl" : ""; }) +
          '<p style="margin-top:8px">n = 8, so take the mean of the 4th and 5th values: (4 + 5) ÷ 2 = <b>' + fmt(S.median(RUN)) + " hours</b>.</p>";
      },
      use: ["Use it for skewed data or data with outliers: incomes, prices, waiting times.", "It also works for ranked (ordinal) data such as ratings.", "Mistake: picking the middle value without sorting first.", "Mistake: with an even count, taking just one of the two middle values."],
      walk: function () {
        var s = S.sorted(DELIV);
        return [
          { t: "The data", c: "Delivery times in minutes, in the order they were recorded.", h: chips(DELIV) },
          { t: "Step 1: sort", c: "Always sort the values from smallest to largest first.", h: chips(s) },
          { t: "Step 2: find the middle", c: "There are 5 values, so the middle one is the 3rd.", h: chips(s, function (x, i) { return i === 2 ? "hl" : "dim"; }) + '<div class="big">Median = ' + fmt(S.median(DELIV)) + "</div>" },
          { t: "Even number of values?", c: "With 8 values there is no single middle, so average the 4th and 5th.", h: chips(RUN, function (x, i) { return i === 3 || i === 4 ? "hl" : "dim"; }) + '<div class="big">(4 + 5) ÷ 2 = ' + fmt(S.median(RUN)) + "</div>" },
          { t: "Robust to outliers", c: "Salaries with one very high earner: the mean is " + fmt(S.mean(SAL)) + ", the median stays at " + fmt(S.median(SAL)) + ".", h: chips(SAL, function (x) { return x === 300 ? "hl" : ""; }) + '<div class="big">Median = ' + fmt(S.median(SAL)) + "</div>" }
        ];
      },
      qc: [
        { q: "What is the median of 9, 2, 6, 4?", o: ["5", "6", "4", "5.25"], a: 0, e: "Sorted: 2, 4, 6, 9. With 4 values, average the middle two: (4 + 6) ÷ 2 = 5. (5.25 is the mean.)" },
        { q: "What is the first step in finding a median?", o: ["Sort the values", "Add the values", "Find the most common value", "Divide by n"], a: 0, e: "The median depends on position, so the data must be sorted first." }
      ]
    },
    {
      id: "1.3", mod: 1, title: "Mode", time: "10 min", calc: "mode",
      outcomes: ["Find the mode, including bimodal data and data with no mode", "Use the mode for categorical data", "Choose between the mean, median and mode", "Describe how the three averages relate in skewed data"],
      notes: "<p>The <b>mode</b> is the value that appears most often. A dataset can have one mode (<b>unimodal</b>), two (<b>bimodal</b>), more (<b>multimodal</b>) or none, when every value appears equally often. The mode is the only average that works for <b>categorical</b> data such as favourite brand, blood group or the shoe size a shop should stock most.</p>",
      formula: "Mode = the most frequent value<small>count how often each value appears, then pick the highest count</small>",
      extra: function () {
        var brands = ["Nike", "Adidas", "Puma", "Nike", "Bata", "Nike", "Puma"];
        return "<h4 style=\"margin:4px 0 8px\">Mode for categories</h4><p class=\"muted small\">Favourite sports-shoe brand of 7 students: " + brands.join(", ") + ". Mode = <b>" + S.modes(brands)[0] + "</b> (3 times). A mean or median makes no sense here.</p>" +
          "<h4 style=\"margin:16px 0 8px\">Choosing an average</h4>" +
          '<div class="tscroll"><table><tr><th>Situation</th><th>Best average</th></tr><tr><td>Numeric data, roughly symmetric, no outliers</td><td>Mean</td></tr><tr><td>Skewed data or outliers (incomes, prices)</td><td>Median</td></tr><tr><td>Categories, or "most popular" questions</td><td>Mode</td></tr></table></div>' +
          "<p class=\"muted small\" style=\"margin-top:10px\">In <b>right-skewed</b> data (a long tail of high values, like incomes) the order is usually mean &gt; median &gt; mode. In left-skewed data it is usually the reverse. In a perfectly symmetric single-peaked distribution all three are equal.</p>";
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Study hours: " + RUN.join(", ") + "</p>" + freqTable(RUN) +
          '<p style="margin-top:8px">4 appears 3 times, more than any other value, so the <b>mode is ' + S.modes(RUN).join(", ") + " hours</b>.</p>" +
          "<p class=\"muted\" style=\"margin:14px 0 8px\"><b>Bimodal:</b> " + BIMODAL.join(", ") + " → modes " + S.modes(BIMODAL).join(" and ") + " (each appears twice).<br><b>No mode:</b> 1, 2, 3, 4 → every value appears once.</p>";
      },
      use: ["Use it for categorical data and \"most popular\" questions: sizes, brands, choices.", "Useful alongside the mean and median to spot skew.", "Mistake: reporting a mode when every value appears equally often (there is no mode).", "Mistake: forgetting that there can be more than one mode."],
      walk: function () {
        var fr = S.freq(RUN);
        return [
          { t: "The data", c: "Study hours of 8 students.", h: chips(RUN) },
          { t: "Count each value", c: "Count how many times each value appears.", h: '<div class="chips">' + fr.map(function (o) { return '<span class="chip">' + o.v + " <small style=\"color:#6E6C94\">×" + o.f + "</small></span>"; }).join("") + "</div>" },
          { t: "Pick the most frequent", c: "4 appears 3 times, more than any other value.", h: chips(RUN, function (x) { return x === 4 ? "hl" : "dim"; }) + '<div class="big">Mode = 4</div>' },
          { t: "Two modes", c: "Here 3 and 7 both appear twice: the data are bimodal.", h: chips(BIMODAL, function (x) { return x === 3 || x === 7 ? "hl" : "dim"; }) + '<div class="big">Modes = 3 and 7</div>' },
          { t: "Categories too", c: "The mode is the only average that works for categories.", h: chips(["Nike", "Adidas", "Puma", "Nike", "Bata", "Nike", "Puma"], function (x) { return x === "Nike" ? "hl" : ""; }) + '<div class="big">Mode = Nike</div>' }
        ];
      },
      qc: [
        { q: "What is the mode of 1, 4, 4, 6, 6, 6, 9?", o: ["6", "4", "5.14", "No mode"], a: 0, e: "6 appears three times, more than any other value." },
        { q: "Which average should a shoe shop use to decide which size to stock most?", o: ["Mode", "Mean", "Median", "Range"], a: 0, e: "The shop needs the most popular size, which is the mode." }
      ]
    },
    {
      id: "2.1", mod: 2, title: "Interquartile Range (IQR)", time: "12 min", calc: "iqr",
      outcomes: ["Explain why the range alone can mislead", "Find Q1, Q3 and the IQR using the median-of-halves method", "Read a simple box plot", "Identify outliers with the 1.5 × IQR rule"],
      notes: "<p>Averages tell us the centre; <b>measures of dispersion</b> tell us how spread out the data are. The <b>range</b> (largest − smallest) is quick but depends on just two values, so one outlier distorts it. The <b>interquartile range</b> measures the spread of the <b>middle 50%</b> of the data: IQR = Q3 − Q1, where Q1 is the median of the lower half and Q3 is the median of the upper half.</p>" +
        '<div class="note" style="margin-top:12px"><b>Method used in this course:</b> sort the data, split it into a lower and an upper half (when n is odd, leave the median out of both halves), then take the median of each half. Excel and other software may use a slightly different method and give slightly different quartiles.</div>',
      formula: "IQR = Q3 − Q1<small>outliers: below Q1 − 1.5 × IQR or above Q3 + 1.5 × IQR</small>",
      extra: function () {
        var q = S.quartiles(SAL), iqr = q.q3 - q.q1;
        return "<h4 style=\"margin:4px 0 8px\">Box plot</h4><p class=\"muted small\" style=\"margin-bottom:8px\">A box plot draws the middle 50% as a box from Q1 to Q3, with a line at the median. Below: the salary data (₹ thousand) " + SAL.join(", ") + ".</p>" + boxPlot(SAL) +
          "<p class=\"muted small\">Q1 = " + fmt(q.q1) + ", Q3 = " + fmt(q.q3) + ", IQR = " + fmt(iqr) + ". Upper fence = " + fmt(q.q3) + " + 1.5 × " + fmt(iqr) + " = " + fmt(q.q3 + 1.5 * iqr) + ", so <b>300 is an outlier</b> (red dot). The range (" + fmt(Math.max.apply(null, SAL) - Math.min.apply(null, SAL)) + ") is dominated by it; the IQR is not.</p>";
      },
      example: function () {
        var q = S.quartiles(ODD9), s = S.sorted(ODD9);
        return "<p class=\"muted\" style=\"margin-bottom:10px\"><b>Even n.</b> Study hours " + RUN.join(", ") + ": lower half " + Q1.lower.join(", ") + " → Q1 = <b>" + fmt(Q1.q1) + "</b>; upper half " + Q1.upper.join(", ") + " → Q3 = <b>" + fmt(Q1.q3) + "</b>; IQR = " + fmt(Q1.q3) + " − " + fmt(Q1.q1) + " = <b>" + fmt(Q1.q3 - Q1.q1) + " hours</b>.</p>" +
          "<p class=\"muted\" style=\"margin-bottom:10px\"><b>Odd n.</b> Exam scores " + ODD9.join(", ") + ". Sorted:</p>" + chips(s, function (x, i) { return i === 4 ? "hl" : (i < 4 ? "ac" : "mi"); }) +
          '<p style="margin-top:8px">Median = ' + fmt(q.q2) + " (left out of both halves). Lower half " + q.lower.join(", ") + " → Q1 = " + fmt(q.q1) + ". Upper half " + q.upper.join(", ") + " → Q3 = " + fmt(q.q3) + ". <b>IQR = " + fmt(q.q3 - q.q1) + "</b> (range = " + fmt(s[s.length - 1] - s[0]) + ").</p>";
      },
      use: ["Use the IQR with the median for skewed data or data with outliers.", "Use box plots to compare the spread of two or more groups.", "Mistake: forgetting to sort before splitting into halves.", "Mistake: treating the range as reliable when there are outliers."],
      walk: function () {
        return [
          { t: "Sorted data", c: "Start with the sorted study hours.", h: chips(RUN) },
          { t: "Split into halves", c: "With 8 values, the lower half is the first 4 and the upper half the last 4.", h: chips(RUN, function (x, i) { return i < 4 ? "ac" : "mi"; }) },
          { t: "Q1: median of the lower half", c: "Lower half 2, 4, 4, 4 → Q1 = (4 + 4) ÷ 2 = 4.", h: chips(Q1.lower, "ac") + '<div class="big">Q1 = ' + fmt(Q1.q1) + "</div>" },
          { t: "Q3: median of the upper half", c: "Upper half 5, 5, 7, 9 → Q3 = (5 + 7) ÷ 2 = 6.", h: chips(Q1.upper, "mi") + '<div class="big">Q3 = ' + fmt(Q1.q3) + "</div>" },
          { t: "IQR", c: "IQR = Q3 − Q1: the spread of the middle half of the data.", h: '<div class="formula">IQR = ' + fmt(Q1.q3) + " − " + fmt(Q1.q1) + " = " + fmt(Q1.q3 - Q1.q1) + " hours</div>" },
          { t: "Spot outliers", c: "Values beyond Q3 + 1.5 × IQR are outliers. In the salary data, 300 is far beyond the fence.", h: boxPlot(SAL) }
        ];
      },
      qc: [
        { q: "If Q1 = 12 and Q3 = 30, what is the IQR?", o: ["18", "42", "21", "30"], a: 0, e: "IQR = Q3 − Q1 = 30 − 12 = 18." },
        { q: "The IQR describes the spread of…", o: ["the middle 50% of the data", "all of the data", "the top 25% of the data", "the outliers"], a: 0, e: "It runs from Q1 (25th percentile) to Q3 (75th percentile), covering the middle half." }
      ]
    },
    {
      id: "2.2", mod: 2, title: "Standard Deviation (SD)", time: "15 min", calc: "sd",
      outcomes: ["Calculate deviations, squared deviations and the variance", "Calculate the population and the sample standard deviation", "Explain in plain words why the sample SD divides by n − 1", "Interpret a large versus a small standard deviation"],
      notes: "<p>The <b>standard deviation</b> measures the typical distance of values from the mean. We find each value's deviation from the mean, square it (so negatives don't cancel positives), average the squares to get the <b>variance</b>, and take the square root to return to the original units.</p>" +
        "<p style=\"margin-top:10px\">If the data are the <b>whole population</b> (every student in the class), divide by N. If they are a <b>sample</b> used to estimate a bigger population, divide by <b>n − 1</b>. A sample's values sit a little closer to their own mean than to the true population mean, so dividing by n would underestimate the spread; n − 1 corrects for this.</p>",
      formula: "σ = √( Σ(x − μ)² ÷ N )  ·  s = √( Σ(x − x̄)² ÷ (n − 1) )<small>population SD · sample SD</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">Same mean, different spread</h4><p class=\"muted small\" style=\"margin-bottom:8px\">Two classes both have a mean mark of " + fmt(S.mean(CLASSA)) + ".</p>" +
          '<div class="tscroll"><table><tr><th>Class</th><th>Marks</th><th>Mean</th><th>Population SD</th></tr><tr><td>A</td><td>' + CLASSA.join(", ") + "</td><td>" + fmt(S.mean(CLASSA)) + "</td><td>" + fmt(S.popSD(CLASSA)) + "</td></tr><tr><td>B</td><td>" + CLASSB.join(", ") + "</td><td>" + fmt(S.mean(CLASSB)) + "</td><td>" + fmt(S.popSD(CLASSB)) + "</td></tr></table></div>" +
          "<p class=\"muted small\" style=\"margin-top:8px\">Class B's marks are far more spread out. The mean alone would hide this difference.</p>";
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Study hours " + RUN.join(", ") + ", mean = " + fmt(S.mean(RUN)) + ".</p>" + devTable(RUN, "sq") +
          '<div class="kv" style="margin-top:10px"><span>Σ(x − x̄)² = ' + fmt(S.sqDevSum(RUN)) + "</span><span>Population variance = " + fmt(S.sqDevSum(RUN)) + " ÷ " + RUN.length + " = " + fmt(S.popVar(RUN)) + "</span><span>Population SD = √" + fmt(S.popVar(RUN)) + " = " + fmt(S.popSD(RUN)) + "</span><span>Sample SD = √(" + fmt(S.sqDevSum(RUN)) + " ÷ " + (RUN.length - 1) + ") = " + fmt(S.sampSD(RUN)) + "</span></div>" +
          "<p class=\"muted small\" style=\"margin-top:8px\">Notice that the deviations always add up to 0, which is why we square them.</p>";
      },
      use: ["Use the SD with the mean for roughly symmetric data without strong outliers.", "Compare SDs only for data in the same units and on a similar scale.", "Mistake: dividing by n when the data are a sample (use n − 1).", "Mistake: forgetting the square root (that gives the variance, not the SD)."],
      walk: function () {
        var m = S.mean(RUN);
        return [
          { t: "Start with the mean", c: "The mean study time is " + fmt(m) + " hours.", h: chips(RUN) + '<div class="big">x̄ = ' + fmt(m) + "</div>" },
          { t: "Deviations", c: "Subtract the mean from each value. These always add up to zero.", h: chips(RUN.map(function (x) { return fmt(x - m); }), "ac") },
          { t: "Square them", c: "Squaring removes the minus signs.", h: chips(RUN.map(function (x) { return fmt((x - m) * (x - m)); }), "hl") + '<div class="big">Σ = ' + fmt(S.sqDevSum(RUN)) + "</div>" },
          { t: "Variance", c: "Average the squares (population: divide by N = 8).", h: '<div class="formula">σ² = ' + fmt(S.sqDevSum(RUN)) + " ÷ 8 = " + fmt(S.popVar(RUN)) + "</div>" },
          { t: "Square root", c: "Take the square root to get back to hours.", h: '<div class="formula">σ = √' + fmt(S.popVar(RUN)) + " = " + fmt(S.popSD(RUN)) + " hours</div>" },
          { t: "Sample SD", c: "If these 8 students are a sample, divide by n − 1 = 7 instead.", h: '<div class="formula">s = √(' + fmt(S.sqDevSum(RUN)) + " ÷ 7) ≈ " + fmt(S.sampSD(RUN)) + " hours</div>" }
        ];
      },
      qc: [
        { q: "What is the standard deviation of 5, 5, 5, 5?", o: ["0", "5", "1", "20"], a: 0, e: "Every value equals the mean, so every deviation is 0 and the SD is 0." },
        { q: "Class X has SD 3 and class Y has SD 15 (same mean). What does this tell you?", o: ["Class Y's marks are more spread out", "Class Y scored higher", "Class X has more students", "Class X's marks are more spread out"], a: 0, e: "A larger SD means values are, on average, further from the mean." }
      ]
    },
    {
      id: "2.3", mod: 2, title: "Mean Deviation (Mean Absolute Deviation)", time: "10 min", calc: "md",
      outcomes: ["Calculate the mean deviation about the mean", "Explain why absolute values are used", "Compare the mean deviation with the standard deviation", "Use the coefficient of variation to compare spread across datasets"],
      notes: "<p>The <b>mean deviation</b> (or mean absolute deviation) is the average distance of the values from the mean. Deviations from the mean always add up to zero, so we take their <b>absolute values</b> (ignore the signs) before averaging. It is easy to explain: \"on average, values are this far from the mean\". It can also be measured about the median.</p>" +
        "<p style=\"margin-top:10px\">The SD squares deviations, so it gives more weight to large deviations; for the same data the SD is always at least as large as the mean deviation.</p>",
      formula: "MD = Σ|x − x̄| ÷ n<small>|…| means the absolute value: ignore the minus sign</small>",
      extra: function () {
        var cvA = S.popSD(CLASSA) / S.mean(CLASSA) * 100, cvB = S.popSD(CLASSB) / S.mean(CLASSB) * 100;
        return "<h4 style=\"margin:4px 0 8px\">Coefficient of variation (CV)</h4><p class=\"muted small\">To compare spread between datasets with different means or units, divide the SD by the mean: <b>CV = (SD ÷ mean) × 100%</b>. Class A: " + fmt(S.popSD(CLASSA)) + " ÷ " + fmt(S.mean(CLASSA)) + " = <b>" + fmt(cvA) + "%</b>. Class B: " + fmt(S.popSD(CLASSB)) + " ÷ " + fmt(S.mean(CLASSB)) + " = <b>" + fmt(cvB) + "%</b>. The higher CV means relatively more variability.</p>";
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Study hours " + RUN.join(", ") + ", mean = " + fmt(S.mean(RUN)) + ".</p>" + devTable(RUN, "abs") +
          '<div class="kv" style="margin-top:10px"><span>Σ|x − x̄| = ' + fmt(S.meanDev(RUN) * RUN.length) + "</span><span>MD = " + fmt(S.meanDev(RUN) * RUN.length) + " ÷ " + RUN.length + " = " + fmt(S.meanDev(RUN)) + " hours</span><span>Population SD = " + fmt(S.popSD(RUN)) + " (larger than MD)</span></div>";
      },
      use: ["Use it when you want a simple, easy-to-explain measure of typical distance from the average.", "Use the CV to compare variability of different measures, e.g., price vs sales volume.", "Mistake: adding signed deviations (they always sum to zero).", "Mistake: comparing SDs of data with very different means instead of using the CV."],
      walk: function () {
        var m = S.mean(RUN);
        return [
          { t: "Deviations cancel out", c: "Signed deviations from the mean always add up to zero, so we can't just average them.", h: chips(RUN.map(function (x) { return fmt(x - m); }), "ac") + '<div class="big">Σ = 0</div>' },
          { t: "Take absolute values", c: "Ignore the signs: each value's distance from the mean.", h: chips(RUN.map(function (x) { return fmt(Math.abs(x - m)); }), "hl") },
          { t: "Add the distances", c: "Add up the distances.", h: '<div class="big">Σ|x − x̄| = ' + fmt(S.meanDev(RUN) * RUN.length) + "</div>" },
          { t: "Average them", c: "Divide by n = 8: on average, a student is 1.5 hours from the mean.", h: '<div class="formula">MD = ' + fmt(S.meanDev(RUN) * RUN.length) + " ÷ 8 = " + fmt(S.meanDev(RUN)) + " hours</div>" },
          { t: "Compare with the SD", c: "The SD (2) is larger than the MD (1.5) because squaring gives big deviations more weight.", h: '<div class="chips"><span class="chip mi">MD = ' + fmt(S.meanDev(RUN)) + '</span><span class="chip ac">SD = ' + fmt(S.popSD(RUN)) + "</span></div>" }
        ];
      },
      qc: [
        { q: "What is the mean deviation of 2, 4, 6?", o: ["1.33", "0", "1.63", "4"], a: 0, e: "Mean = 4; distances 2, 0, 2; MD = 4 ÷ 3 ≈ 1.33. (1.63 is the population SD.)" },
        { q: "For the same data, how does the SD compare with the mean deviation?", o: ["SD is always at least as large", "SD is always smaller", "They are always equal", "There is no relationship"], a: 0, e: "Squaring gives extra weight to large deviations, so the SD is greater than or equal to the MD." }
      ]
    }
  ];

  var MODULES = [
    { n: 1, title: "Measures of Central Tendency", sub: "Find the single value that best represents the centre of your data.", tag: "Module 1" },
    { n: 2, title: "Measures of Dispersion", sub: "Measure how spread out your data are around the centre.", tag: "Module 2" }
  ];

  /* ================= FINAL TEST (20 questions) ================= */
  var TEST = [
    { m: 1, q: "What is the mean of 6, 8, 10, 12, 14?", o: ["10", "8", "12", "50"], a: 0, e: "Sum = 50, n = 5, so 50 ÷ 5 = 10. (50 is the sum, not the mean.)" },
    { m: 1, q: "What is the median of 12, 3, 9, 1, 5?", o: ["5", "6", "9", "3"], a: 0, e: "Sorted: 1, 3, 5, 9, 12. The middle (3rd) value is 5. 9 is the middle of the unsorted list and 6 is the mean." },
    { m: 1, q: "What is the median of 4, 8, 6, 10?", o: ["7", "6", "8", "14"], a: 0, e: "Sorted: 4, 6, 8, 10. Average the two middle values: (6 + 8) ÷ 2 = 7." },
    { m: 1, q: "What is the mode of 2, 3, 3, 5, 5, 5, 8?", o: ["5", "3", "4.43", "8"], a: 0, e: "5 appears three times, more than any other value. 4.43 is the mean." },
    { m: 1, q: "A company's salaries include the CEO's, which is 50 times the typical salary. Which average best describes a typical employee's salary?", o: ["Median", "Mean", "Range", "Mean deviation"], a: 0, e: "The median is not pulled up by the one extreme salary; the mean would be." },
    { m: 1, q: "A survey asks students for their favourite food-delivery app. Which average can summarise the answers?", o: ["Mode", "Mean", "Median", "Standard deviation"], a: 0, e: "App names are categories; only the mode (most frequent answer) applies." },
    { m: 1, q: "The values 10, 12, 14 become 10, 12, 14, 100. Which changes more?", o: ["The mean (12 → 34)", "The median (12 → 13)", "Both change equally", "Neither changes"], a: 0, e: "Mean: 136 ÷ 4 = 34. Median: (12 + 14) ÷ 2 = 13. The mean is far more sensitive to the outlier." },
    { m: 1, q: "A student scores 80 in a test worth weight 3 and 60 in a test worth weight 1. What is the weighted mean?", o: ["75", "70", "72.5", "80"], a: 0, e: "(80 × 3 + 60 × 1) ÷ (3 + 1) = 300 ÷ 4 = 75. 70 is the unweighted mean." },
    { m: 1, q: "Household incomes have a long tail of very high values (right-skewed). What is the usual order of the averages?", o: ["Mean > median > mode", "Mode > median > mean", "Mean = median = mode", "Median > mean > mode"], a: 0, e: "High values pull the mean up the most, so in right-skewed data mean > median > mode." },
    { m: 1, q: "What is the mode of 1, 2, 2, 3, 3, 4?", o: ["2 and 3 (bimodal)", "2", "3", "No mode"], a: 0, e: "2 and 3 each appear twice, so the data have two modes." },
    { m: 2, q: "If Q1 = 20 and Q3 = 35, what is the interquartile range?", o: ["15", "55", "27.5", "35"], a: 0, e: "IQR = Q3 − Q1 = 35 − 20 = 15." },
    { m: 2, q: "What is the range of 4, 9, 2, 15, 7?", o: ["13", "11", "15", "7.4"], a: 0, e: "Range = largest − smallest = 15 − 2 = 13." },
    { m: 2, q: "Using the median-of-halves method, what is the IQR of 1, 3, 5, 7, 9, 11, 13, 15?", o: ["8", "14", "7", "4"], a: 0, e: "Lower half 1, 3, 5, 7 → Q1 = 4. Upper half 9, 11, 13, 15 → Q3 = 12. IQR = 12 − 4 = 8. (14 is the range.)" },
    { m: 2, q: "Q1 = 10, Q3 = 20, so IQR = 10. Using the 1.5 × IQR rule, which value is an outlier?", o: ["40", "30", "35", "12"], a: 0, e: "Upper fence = 20 + 1.5 × 10 = 35. Only values above 35 are outliers, so 40 is an outlier (35 itself is not)." },
    { m: 2, q: "What is the population standard deviation of 2, 4, 6?", o: ["1.63", "2", "2.67", "1.33"], a: 0, e: "Mean 4; squared deviations 4, 0, 4 → sum 8; variance 8 ÷ 3 ≈ 2.67; SD ≈ 1.63. 2 is the sample SD, 2.67 the variance and 1.33 the mean deviation." },
    { m: 2, q: "Why does the sample standard deviation divide by n − 1 instead of n?", o: ["Values sit closer to the sample mean than to the true mean, so dividing by n would underestimate the spread", "To make the calculation easier", "Because one value is always an outlier", "To convert the variance into the original units"], a: 0, e: "Using n − 1 corrects the tendency of a sample to understate the population's variability." },
    { m: 2, q: "Two sections have the same mean score. Section A has SD 3 and section B has SD 15. Which statement is correct?", o: ["Section B's scores are more spread out", "Section B scored higher on average", "Section A's scores are more spread out", "Both sections have identical score distributions"], a: 0, e: "Same mean, larger SD: B's scores are further from the mean on average." },
    { m: 2, q: "What is the mean deviation (about the mean) of 3, 5, 7, 9?", o: ["2", "0", "2.24", "4"], a: 0, e: "Mean 6; distances 3, 1, 1, 3 → 8 ÷ 4 = 2. 0 is the sum of signed deviations and 2.24 is the population SD." },
    { m: 2, q: "Why do we take absolute values when calculating the mean deviation?", o: ["Because signed deviations from the mean always add up to zero", "To make the answer larger", "Because the data might be negative", "To remove outliers"], a: 0, e: "Positive and negative deviations cancel exactly, so we use distances instead." },
    { m: 2, q: "Product A's price has mean ₹50 and SD ₹5. Product B's has mean ₹200 and SD ₹10. Which is relatively more variable?", o: ["A (CV = 10%)", "B (CV = 5%)", "B, because its SD is larger", "Both equally"], a: 0, e: "CV = SD ÷ mean: A = 5 ÷ 50 = 10%, B = 10 ÷ 200 = 5%. Relative to its mean, A varies more." }
  ];
  var PASS = 0.7;

  var GLOSSARY = [
    ["Data set", "A collection of values about the same thing.", "Marks of 30 students in a test.", "1.1"],
    ["Observation", "A single value in a data set.", "One student's mark.", "1.1"],
    ["Mean", "Sum of values divided by the number of values.", "Mean of 2, 4, 6 is 4.", "1.1"],
    ["Weighted mean", "A mean where some values count more than others.", "Grade point average weighted by course credits.", "1.1"],
    ["Outlier", "A value far away from most of the others.", "One salary of 300 among salaries of about 30.", "2.1"],
    ["Median", "The middle value of sorted data.", "Median of 1, 3, 9 is 3.", "1.2"],
    ["Mode", "The most frequent value.", "Mode of 2, 2, 5 is 2.", "1.3"],
    ["Bimodal", "Having two modes.", "1, 1, 4, 4, 6 has modes 1 and 4.", "1.3"],
    ["Categorical data", "Data made of labels or groups rather than numbers.", "Favourite brand, blood group.", "1.3"],
    ["Skewness", "Lack of symmetry: a longer tail on one side.", "Incomes are usually right-skewed.", "1.3"],
    ["Range", "Largest value minus smallest value.", "Range of 2, 5, 11 is 9.", "2.1"],
    ["Quartiles", "Values that split sorted data into four equal parts (Q1, Q2, Q3).", "Q2 is the median.", "2.1"],
    ["Interquartile range (IQR)", "Q3 − Q1: the spread of the middle 50% of the data.", "Q1 = 4, Q3 = 6 → IQR = 2.", "2.1"],
    ["Box plot", "A chart showing the median, quartiles and outliers.", "Comparing exam scores of two sections.", "2.1"],
    ["Deviation", "How far a value is from the mean (x − x̄).", "Value 7, mean 5 → deviation 2.", "2.2"],
    ["Variance", "The average of the squared deviations.", "Squared deviations 4, 0, 4 → variance 8 ÷ 3.", "2.2"],
    ["Standard deviation", "The square root of the variance; the typical distance from the mean.", "Study hours 2…9 have SD 2 hours.", "2.2"],
    ["Population vs sample", "A population is the whole group; a sample is part of it, used to estimate the whole.", "All students in a university vs 50 surveyed.", "2.2"],
    ["Mean deviation", "The average absolute distance of values from the mean.", "2, 4, 6 → MD ≈ 1.33.", "2.3"],
    ["Coefficient of variation (CV)", "SD ÷ mean × 100%: spread relative to the mean.", "SD 5, mean 50 → CV 10%.", "2.3"]
  ];

  /* ================= STATE ================= */
  var KEY = "bos_progress_v1";
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
    var h = '<section class="hero"><div><span class="tag">Free course · about 70 minutes</span><h1 style="margin-top:14px">Basics of Statistics</h1>' +
      '<p class="lead">Understand your data: averages, spread and what they really tell you.</p>' +
      '<p class="muted" style="margin-top:12px">For students, MBA/PGDM learners and professionals with no prior statistics background. Work through six short lessons, each with a teaching video, clear notes, a worked example and a calculator you can try with your own numbers. Then pass the final test to earn your certificate.</p>' +
      '<div class="row" style="margin-top:18px">' + cta + '<a class="btn btn-soft" href="#/path">See the course path</a></div></div>' +
      '<div class="card" style="text-align:center">' + progressRing() + '<div class="stack small" style="margin-top:14px;text-align:left">' +
      "<div>📘 Lessons completed: <b>" + doneCount() + " of " + LESSONS.length + "</b></div>" +
      "<div>📝 Final test: <b>" + (st.test ? (st.test.passed ? "Passed (" + st.test.best + "%)" : "Best score " + st.test.best + "%") : (allDone() ? "Unlocked" : "Locked")) + "</b></div>" +
      "<div>🏅 Certificate: <b>" + (st.cert ? "Issued" : (passed() ? "Ready to claim" : "Pass the test to unlock")) + "</b></div></div></div></section>";
    h += '<div class="grid g2">' + MODULES.map(function (m) {
      var ls = LESSONS.filter(function (l) { return l.mod === m.n; }), d = ls.filter(function (l) { return st.done[l.id]; }).length;
      return '<div class="card mod"><span class="tag indigo">' + m.tag + "</span><h3>" + m.title + '</h3><p class="muted small">' + m.sub + '</p><div class="bar" style="margin-top:12px"><i style="width:' + (d / ls.length * 100) + '%"></i></div><p class="small muted" style="margin-top:6px">' + d + " of " + ls.length + " lessons completed</p>" + lessonList(m.n) + "</div>";
    }).join("") + "</div>";
    h += '<div class="card" style="margin-top:18px"><h3>How the course works</h3><div class="grid g3" style="margin-top:12px">' +
      ["<b>1. Learn, one lesson at a time</b><br><span class=\"muted small\">Watch the video, read the notes and try the calculator. Lessons unlock in order.</span>",
        "<b>2. Check yourself</b><br><span class=\"muted small\">Answer two quick questions in each lesson, then mark it complete.</span>",
        "<b>3. Test and certificate</b><br><span class=\"muted small\">Score 70% or more in the 20-question final test to download your certificate.</span>"].map(function (t) { return "<div>" + t + "</div>"; }).join("") + "</div></div>";
    return h;
  }
  function viewPath() {
    var h = '<h1 style="font-size:clamp(30px,4vw,42px)">Course path</h1><p class="muted" style="margin:8px 0 22px">Lessons unlock one by one. The final test unlocks after all six lessons.</p>';
    MODULES.forEach(function (m) {
      h += '<div class="card mod" style="margin-bottom:16px"><span class="tag indigo">' + m.tag + "</span><h3>" + m.title + "</h3>" + lessonList(m.n) +
        (LESSONS.filter(function (l) { return l.mod === m.n; }).every(function (l) { return st.done[l.id]; }) ? '<p style="margin-top:12px"><a href="#/recap/' + m.n + '">Module ' + m.n + " recap →</a></p>" : "") + "</div>";
    });
    h += '<div class="card"><h3>Final test and certificate</h3><p class="muted small" style="margin:6px 0 12px">20 questions · pass mark 70%</p>' +
      (allDone() ? '<a class="btn btn-accent" href="#/test">Take the final test</a>' : '<span class="tag grey">🔒 Complete all six lessons to unlock</span>') +
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
  function calcBlock(l) {
    var ph = { mean: "e.g. 12, 15, 11, 18, 14", median: "e.g. 32, 28, 45, 30, 35", mode: "e.g. 3, 3, 5, 7, 7, 8", iqr: "e.g. 3, 7, 8, 5, 12, 14, 21, 13, 18", sd: "e.g. 60, 62, 65, 68, 70", md: "e.g. 2, 4, 4, 4, 5, 5, 7, 9" }[l.calc];
    return '<div class="card calc"><label for="cin" style="font-weight:700">Enter numbers separated by commas or spaces</label><div class="row" style="margin-top:8px;flex-wrap:nowrap"><input id="cin" inputmode="decimal" placeholder="' + ph + '" value="' + ph.replace("e.g. ", "") + '"><button class="btn btn-ink" id="cgo">Calculate</button></div><div id="cout" class="res" aria-live="polite"></div></div>';
  }
  function runCalc(kind, raw) {
    var parts = raw.split(/[\s,;]+/).filter(function (x) { return x !== ""; });
    if (!parts.length) return '<p class="err">Please enter at least one number.</p>';
    var a = [];
    for (var i = 0; i < parts.length; i++) { var v = Number(parts[i]); if (!isFinite(v)) return '<p class="err">"' + esc(parts[i]) + '" is not a number. Use digits only, separated by commas or spaces.</p>'; a.push(v); }
    if (a.length > 500) return '<p class="err">Please enter 500 numbers or fewer.</p>';
    var s = S.sorted(a), n = a.length, out = "";
    if (kind === "mean") {
      out = '<div class="kv"><span>n = ' + n + "</span><span>Σx = " + fmt(S.sum(a)) + "</span><span>Mean = " + fmt(S.sum(a)) + " ÷ " + n + " = " + fmt(S.mean(a)) + "</span></div>";
    } else if (kind === "median") {
      var m = Math.floor(n / 2);
      out = "<div><b>Sorted:</b></div>" + chips(s, function (x, i) { return (n % 2 ? i === m : (i === m || i === m - 1)) ? "hl" : ""; }) +
        '<div class="kv"><span>n = ' + n + (n % 2 ? " (odd): middle position " + (m + 1) : " (even): average positions " + m + " and " + (m + 1)) + "</span><span>Median = " + fmt(S.median(a)) + "</span></div>";
    } else if (kind === "mode") {
      var md = S.modes(a);
      out = freqTable(a) + '<div class="kv"><span>' + (n === 1 ? "Only one value, so the mode is " + fmt(a[0]) : (md.length === 0 ? "No mode: every value appears equally often" : (md.length === 1 ? "Mode = " + md.map(fmt).join("") : "Modes = " + md.map(fmt).join(", ") + (md.length === 2 ? " (bimodal)" : " (multimodal)")))) + "</span></div>";
    } else if (kind === "iqr") {
      if (n < 2) return '<p class="err">Enter at least 2 numbers to find quartiles.</p>';
      var q = S.quartiles(a), iqr = q.q3 - q.q1, lo = q.q1 - 1.5 * iqr, hi = q.q3 + 1.5 * iqr;
      var outl = s.filter(function (x) { return x < lo || x > hi; });
      out = "<div><b>Sorted</b> (lower half in blue, upper half in green" + (n % 2 ? ", median in yellow" : "") + "):</div>" + chips(s, function (x, i) { var h = Math.floor(n / 2); return i < h ? "ac" : (n % 2 && i === h ? "hl" : "mi"); }) +
        '<div class="kv"><span>Q1 = ' + fmt(q.q1) + "</span><span>Median = " + fmt(q.q2) + "</span><span>Q3 = " + fmt(q.q3) + "</span><span>IQR = " + fmt(iqr) + "</span><span>Range = " + fmt(s[n - 1] - s[0]) + "</span><span>Fences: " + fmt(lo) + " to " + fmt(hi) + "</span><span>Outliers: " + (outl.length ? outl.map(fmt).join(", ") : "none") + "</span></div>" + boxPlot(a);
    } else if (kind === "sd") {
      out = devTable(a, "sq") + '<div class="kv"><span>Mean = ' + fmt(S.mean(a)) + "</span><span>Σ(x − x̄)² = " + fmt(S.sqDevSum(a)) + "</span><span>Population variance = " + fmt(S.popVar(a)) + "</span><span>Population SD = " + fmt(S.popSD(a)) + "</span>" +
        (n > 1 ? "<span>Sample variance = " + fmt(S.sampVar(a)) + "</span><span>Sample SD = " + fmt(S.sampSD(a)) + "</span>" : "<span>Sample SD needs at least 2 values</span>") + "</div>";
    } else if (kind === "md") {
      var mean = S.mean(a);
      out = devTable(a, "abs") + '<div class="kv"><span>Mean = ' + fmt(mean) + "</span><span>Σ|x − x̄| = " + fmt(S.meanDev(a) * n) + "</span><span>Mean deviation = " + fmt(S.meanDev(a)) + "</span><span>Population SD = " + fmt(S.popSD(a)) + "</span>" +
        (mean !== 0 ? "<span>CV = " + fmt(S.popSD(a) / Math.abs(mean) * 100) + "%</span>" : "<span>CV undefined (mean is 0)</span>") + "</div>";
    }
    return out;
  }
  function viewLesson(id) {
    var i = idx(id);
    if (i < 0) return viewNotFound();
    var l = LESSONS[i];
    if (!unlocked(id)) return '<div class="card" style="text-align:center;max-width:640px;margin:30px auto"><div style="font-size:44px">🔒</div><h2>Lesson ' + id + " is locked</h2><p class=\"muted\" style=\"margin:10px 0 18px\">Complete Lesson " + LESSONS[i - 1].id + " (" + LESSONS[i - 1].title + ") to unlock it.</p><a class=\"btn btn-accent\" href=\"#/lesson/" + LESSONS[i - 1].id + "\">Go to Lesson " + LESSONS[i - 1].id + "</a></div>";
    var mod = MODULES[l.mod - 1], url = (window.BOS_VIDEOS && window.BOS_VIDEOS[id]) || "";
    var h = '<div class="crumb"><a href="#/">Course home</a> › ' + mod.tag + ": " + mod.title + "</div>" +
      '<div class="lhead"><div><span class="tag indigo">Lesson ' + id + " of 6 · " + l.time + "</span><h1 style=\"font-size:clamp(30px,4.4vw,46px);margin-top:10px\">" + l.title + "</h1></div>" +
      (st.done[id] ? '<span class="tag mint">✓ Completed</span>' : "") + "</div>";
    h += '<div class="sec"><h3>Teaching video</h3>' +
      (url ? '<div id="vpane">' + videoEmbed(url) + '<p style="margin-top:10px"><label class="small"><input type="checkbox" id="watched"' + (st.watch[id] ? " checked" : "") + "> I have watched this video</label></p></div></div>" +
        '<div class="sec"><h3>Self-paced learning</h3><p class="muted small" style="margin:-4px 0 10px">Go through the steps at your own pace with the arrows below.</p>' : "") +
      '<div id="wpane"><div class="wt" aria-label="Animated walkthrough"><div class="wt-stage" id="wst"></div><div class="wt-cap" id="wcap"></div><div class="wt-ctl"><button id="wprev" aria-label="Previous step">‹</button><button id="wplay" aria-label="Play or pause">❚❚</button><div class="dots" id="wdots"></div><button id="wnext" aria-label="Next step">›</button></div></div></div></div>';
    h += '<div class="sec"><h3>Learning outcomes</h3>' + list(l.outcomes) + "</div>";
    h += '<div class="sec"><h3>Concept notes</h3><div class="stack">' + l.notes + '<div class="formula">' + l.formula + "</div></div></div>";
    h += '<div class="sec"><h3>Worked example</h3><div class="card">' + l.example() + "</div></div>";
    h += '<div class="sec"><div class="card">' + l.extra() + "</div></div>";
    h += '<div class="sec"><h3>Try it yourself</h3>' + calcBlock(l) + "</div>";
    h += '<div class="sec"><h3>When to use it · common mistakes</h3>' + list(l.use) + "</div>";
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
    /* calculator */
    var cin = document.getElementById("cin"), cout = document.getElementById("cout");
    function calc() { cout.innerHTML = runCalc(l.calc, cin.value); }
    document.getElementById("cgo").onclick = calc;
    cin.addEventListener("keydown", function (e) { if (e.key === "Enter") calc(); });
    calc();
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
      var nextHref = next ? (next.mod !== l.mod ? "#/recap/" + l.mod : "#/lesson/" + next.id) : "#/recap/2";
      var nextLabel = next ? (next.mod !== l.mod ? "Module " + l.mod + " recap →" : "Next: Lesson " + next.id + " →") : "Module 2 recap →";
      if (st.done[id]) { box.innerHTML = '<div class="row" style="justify-content:space-between"><div><b>✓ Lesson complete.</b> <span class="muted small">Great work.</span></div><a class="btn btn-accent" href="' + nextHref + '">' + nextLabel + "</a></div>"; return; }
      box.innerHTML = "<h3>Finish this lesson</h3><ul class=\"clean\" style=\"margin:8px 0 14px;list-style:none;padding:0\"><li>" + (w ? "✅" : "⬜") + " " + (url ? "Watch the video (or finish the self-paced steps)" : "Finish the animated walkthrough") + "</li><li>" + (q ? "✅" : "⬜") + " Answer both quick-check questions</li></ul>" +
        '<button class="btn btn-accent" id="mark"' + (w && q ? "" : " disabled") + ">Mark lesson complete</button>";
      var mk = document.getElementById("mark");
      if (mk) mk.onclick = function () { st.done[id] = true; save(); updateDone(); };
    }
    updateDone();
  }
  function viewRecap(m) {
    var ls = LESSONS.filter(function (l) { return l.mod === m; });
    if (!ls.every(function (l) { return st.done[l.id]; })) return '<div class="card" style="text-align:center;max-width:640px;margin:30px auto"><div style="font-size:44px">🔒</div><h2>Finish Module ' + m + ' first</h2><p style="margin-top:14px"><a class="btn btn-accent" href="#/path">Go to the course path</a></p></div>';
    var t1 = '<table><tr><th>Measure</th><th>How to find it</th><th>Study hours example</th><th>Best for</th></tr>' +
      "<tr><td><b>Mean</b></td><td>Σx ÷ n</td><td>" + fmt(S.mean(RUN)) + "</td><td>Symmetric numeric data</td></tr>" +
      "<tr><td><b>Median</b></td><td>Middle of sorted data</td><td>" + fmt(S.median(RUN)) + "</td><td>Skewed data, outliers</td></tr>" +
      "<tr><td><b>Mode</b></td><td>Most frequent value</td><td>" + S.modes(RUN).join(", ") + "</td><td>Categories, most popular</td></tr></table>";
    var t2 = '<table><tr><th>Measure</th><th>How to find it</th><th>Study hours example</th><th>Best for</th></tr>' +
      "<tr><td><b>IQR</b></td><td>Q3 − Q1</td><td>" + fmt(Q1.q3 - Q1.q1) + "</td><td>Skewed data, with the median</td></tr>" +
      "<tr><td><b>Standard deviation</b></td><td>√(average squared deviation)</td><td>" + fmt(S.popSD(RUN)) + " (population)</td><td>Symmetric data, with the mean</td></tr>" +
      "<tr><td><b>Mean deviation</b></td><td>Average |x − x̄|</td><td>" + fmt(S.meanDev(RUN)) + "</td><td>Simple, easy-to-explain spread</td></tr></table>";
    var h = '<span class="tag indigo">Module ' + m + ' recap</span><h1 style="font-size:clamp(30px,4vw,42px);margin-top:10px">' + MODULES[m - 1].title + '</h1><p class="muted" style="margin:8px 0 18px">Running example: weekly study hours ' + RUN.join(", ") + ".</p>" +
      '<div class="card tscroll">' + (m === 1 ? t1 : t2) + "</div>" +
      '<div class="card" style="margin-top:16px"><h3>Key takeaway</h3><p class="muted" style="margin-top:6px">' + (m === 1 ? "Always ask what kind of data you have and whether there are outliers before choosing an average. Reporting the mean and median together often tells the story best." : "An average is incomplete without a measure of spread. Pair the mean with the standard deviation, and the median with the IQR.") + "</p></div>" +
      '<p style="margin-top:20px">' + (m === 1 ? '<a class="btn btn-accent" href="#/lesson/2.1">Start Module 2: Measures of Dispersion →</a>' : '<a class="btn btn-sun" href="#/test">Take the final test →</a>') + "</p>";
    return h;
  }
  /* ---- final test ---- */
  var T = null; /* active attempt */
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function newAttempt() {
    var order = shuffle(TEST.map(function (q, i) { return i; }));
    T = { qs: order.map(function (qi) { var q = TEST[qi]; var perm = shuffle([0, 1, 2, 3]); return { m: q.m, q: q.q, e: q.e, o: perm.map(function (p) { return q.o[p]; }), a: perm.indexOf(q.a) }; }), ans: {}, cur: 0, done: false };
  }
  function viewTest() {
    if (!allDone()) return '<div class="card" style="text-align:center;max-width:640px;margin:30px auto"><div style="font-size:44px">🔒</div><h2>The final test is locked</h2><p class="muted" style="margin:10px 0 18px">Complete all six lessons first (' + doneCount() + ' of 6 done).</p><a class="btn btn-accent" href="#/path">Go to the course path</a></div>';
    if (!T) {
      return '<div class="card" style="max-width:720px;margin:0 auto"><span class="tag">Final test</span><h1 style="font-size:clamp(30px,4vw,42px);margin-top:10px">Basics of Statistics: final test</h1>' +
        '<ul class="clean" style="margin:14px 0 18px"><li>20 multiple-choice questions (10 per module), in random order</li><li>Answers are revealed only after you submit</li><li>Pass mark: 70% (14 of 20)</li><li>You can review your answers and retake the test</li></ul>' +
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
    var c = 0, mc = { 1: 0, 2: 0 }, mt = { 1: 0, 2: 0 };
    T.qs.forEach(function (q, i) { mt[q.m]++; if (T.ans[i] === q.a) { c++; mc[q.m]++; } });
    var pct = Math.round(c / T.qs.length * 100), ok = c / T.qs.length >= PASS;
    var h = '<div style="max-width:820px;margin:0 auto"><div class="card" style="text-align:center"><div style="font-size:48px">' + (ok ? "🎉" : "📘") + "</div><h1 style=\"font-size:clamp(30px,4vw,42px)\">" + (ok ? "You passed!" : "Not quite yet") + "</h1>" +
      '<p style="font-size:22px;font-weight:800;margin-top:8px">' + c + " / " + T.qs.length + " · " + pct + "%</p>" +
      '<div class="kv" style="justify-content:center;margin-top:10px"><span>Module 1: ' + mc[1] + " / " + mt[1] + "</span><span>Module 2: " + mc[2] + " / " + mt[2] + "</span></div>" +
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
  function certId() { var c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", s = ""; for (var i = 0; i < 6; i++) s += c[Math.floor(Math.random() * c.length)]; return "BOS-" + new Date().getFullYear() + "-" + s; }
  function viewCert() {
    if (!passed()) return '<div class="card" style="text-align:center;max-width:640px;margin:30px auto"><div style="font-size:44px">🏅</div><h2>Your certificate is waiting</h2><p class="muted" style="margin:10px 0 18px">Complete all six lessons and score at least 70% in the final test to unlock it.</p><a class="btn btn-accent" href="' + (allDone() ? "#/test" : "#/path") + '">' + (allDone() ? "Take the final test" : "Continue the course") + "</a></div>";
    if (!st.cert) {
      return '<div class="card" style="max-width:620px;margin:0 auto"><span class="tag mint">Passed · ' + (st.test.passScore || st.test.best) + '%</span><h1 style="font-size:clamp(28px,4vw,40px);margin-top:10px">Claim your certificate</h1><p class="muted" style="margin:8px 0 16px">Enter your name exactly as it should appear on the certificate.</p>' +
        '<div class="stack"><div class="field"><label for="cn">Full name</label><input id="cn" maxlength="60" autocomplete="name"></div><div class="field"><label for="ci">Institution (optional)</label><input id="ci" maxlength="80" autocomplete="organization"></div><p id="cerr" class="err"></p><button class="btn btn-accent" id="cgo2">Create my certificate</button></div></div>';
    }
    var c = st.cert;
    return '<div class="cert" id="certv"><div class="small muted" style="letter-spacing:.12em;font-weight:700">AISTUDYTOOLS</div><h2 style="margin-top:6px">Certificate of Completion</h2><p class="muted" style="margin-top:14px">This is to certify that</p><div class="nm">' + esc(c.name) + "</div>" +
      (c.inst ? '<p class="muted">' + esc(c.inst) + "</p>" : "") + '<p style="margin-top:10px">has successfully completed the course</p><h3 style="font-size:26px;margin-top:6px;color:var(--accent-dk)">Basics of Statistics</h3>' +
      '<p class="muted small" style="margin-top:6px">Measures of Central Tendency · Measures of Dispersion</p><p style="margin-top:12px">with a final test score of <b>' + c.score + "%</b></p>" +
      '<div class="row" style="justify-content:space-between;margin-top:26px;text-align:left"><div class="small"><b>Date:</b> ' + esc(c.date) + "<br><b>Certificate ID:</b> " + esc(c.id) + '</div><div class="small" style="text-align:right"><b>Dr. Anuja Shukla</b><br>Course Instructor</div></div></div>' +
      '<div class="row noprint" style="justify-content:center;margin-top:18px"><button class="btn btn-accent" id="cpdf">Download certificate (PDF)</button><button class="btn btn-soft" id="cprint">Print</button></div>' +
      '<p class="small muted noprint" style="text-align:center;margin-top:10px">This is a certificate of completion issued by AIStudyTools. It is not an accredited qualification.</p>';
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
    doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.setTextColor(55, 48, 163); doc.text("Basics of Statistics", W / 2, y + 15, { align: "center" });
    doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(110, 108, 148); doc.text("Measures of Central Tendency  |  Measures of Dispersion", W / 2, y + 23, { align: "center" });
    doc.setFontSize(13); doc.setTextColor(30, 27, 75); doc.text("Final test score: " + c.score + "%", W / 2, y + 33, { align: "center" });
    doc.setFontSize(11); doc.setTextColor(74, 72, 120);
    doc.text("Date: " + c.date, 30, H - 30); doc.text("Certificate ID: " + c.id, 30, H - 24);
    doc.setFont("helvetica", "bold"); doc.setTextColor(30, 27, 75); doc.text("Dr. Anuja Shukla", W - 30, H - 30, { align: "right" });
    doc.setFont("helvetica", "normal"); doc.setTextColor(74, 72, 120); doc.text("Course Instructor", W - 30, H - 24, { align: "right" });
    doc.setFontSize(8.5); doc.setTextColor(150, 150, 170); doc.text("Certificate of completion issued by AIStudyTools (www.aistudytools.com). Not an accredited qualification.", W / 2, H - 15, { align: "center" });
    doc.save("Basics-of-Statistics-Certificate-" + c.name.replace(/[^A-Za-z0-9]+/g, "-") + ".pdf");
  }
  function alertBox(msg) { var d = document.createElement("p"); d.className = "err noprint"; d.style.textAlign = "center"; d.textContent = msg; app.appendChild(d); }
  /* ---- glossary ---- */
  function viewGlossary() {
    return '<h1 style="font-size:clamp(30px,4vw,42px)">Glossary</h1><p class="muted" style="margin:8px 0 16px">' + GLOSSARY.length + ' key terms. Search or filter by module.</p>' +
      '<div class="row" style="margin-bottom:16px;flex-wrap:wrap"><input id="gq" placeholder="Search terms or definitions" style="flex:1;min-width:220px;font:inherit;font-size:16px;padding:11px 14px;border:2px solid var(--border);border-radius:14px"><select id="gm" style="font:inherit;font-size:16px;padding:11px 14px;border:2px solid var(--border);border-radius:14px;background:#fff"><option value="">All modules</option><option value="1">Module 1: Central tendency</option><option value="2">Module 2: Dispersion</option></select></div><div class="grid g2" id="gl"></div>';
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
    else if (r === "recap") out = viewRecap(+parts[1] === 2 ? 2 : 1);
    else if (r === "test") { out = viewTest(); after = testWire; }
    else if (r === "certificate") { out = viewCert(); after = certWire; }
    else if (r === "glossary") { out = viewGlossary(); after = glossWire; }
    else out = viewNotFound();
    if (out && typeof out === "object") { after = out.after; out = out.html; }
    app.innerHTML = out;
    if (r === "path") { var rs = document.getElementById("reset"); if (rs) rs.onclick = function () { if (confirm("Reset all your progress, test results and certificate in this browser?")) { localStorage.removeItem(KEY); load(); T = null; render(); } }; }
    if (after) after();
    document.querySelectorAll(".tnav a[data-r]").forEach(function (a) { a.classList.toggle("on", a.getAttribute("data-r") === r || (r === "lesson" && a.getAttribute("data-r") === "path")); });
    var titles = { home: "Basics of Statistics", path: "Course path", lesson: "Lesson " + (parts[1] || ""), recap: "Module recap", test: "Final test", certificate: "Certificate", glossary: "Glossary" };
    document.title = (titles[r] || "Basics of Statistics") + " | AIStudyTools";
  }
  var lastRoute = "";
  window.addEventListener("hashchange", function () { var r = location.hash; if (r.indexOf("#/test") !== 0) T = T && T.done ? null : T; render(); if (r !== lastRoute) window.scrollTo(0, 0); lastRoute = r; });
  render();
})();
