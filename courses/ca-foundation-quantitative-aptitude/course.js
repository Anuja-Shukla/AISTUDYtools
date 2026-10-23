/* CA Foundation: Quantitative Aptitude — course content and app (no external services; progress saved in localStorage).
   Original teaching material by AIStudyTools, following the topics of the CA Foundation Paper 3 syllabus.
   Not affiliated with or endorsed by ICAI. */
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

  var ICAI_URL = "https://www.icai.org/post/19139";

  /* ================= LESSONS =================
     Running example: Riya (fictional), a CA Foundation student who also helps at Kiran Traders (fictional), a small furniture business.
     All figures are illustrative. */
  var LESSONS = [
    /* ---------------- MODULE 1: BUSINESS MATHEMATICS ---------------- */
    {
      id: "1.1", mod: 1, ch: "Chapter 1", title: "Ratio, Proportion, Indices and Logarithms", time: "16 min", tool: "ratio",
      outcomes: ["Simplify ratios and find compound, duplicate, sub-duplicate and inverse ratios", "Use proportion to find a mean, third or fourth proportional", "Apply the laws of indices to simplify expressions", "Use the rules of logarithms, including change of base"],
      notes: `<p>A <b>ratio</b> compares two quantities of the same kind: <b>a : b</b> means a ÷ b. It has no units, so convert both quantities to the same unit first (₹ with ₹, metres with metres). Multiplying or dividing both terms by the same non-zero number does not change a ratio, so 12 : 18 = 2 : 3.</p>
<p style="margin-top:10px">Useful kinds of ratio: the <b>compound ratio</b> of a : b and c : d is ac : bd; the <b>duplicate ratio</b> of a : b is a² : b², the <b>triplicate</b> is a³ : b³, the <b>sub-duplicate</b> is √a : √b, and the <b>inverse</b> ratio is b : a. To join a : b and b : c into one continued ratio a : b : c, make the common term (b) equal in both.</p>
<p style="margin-top:10px">A <b>proportion</b> says two ratios are equal: a : b = c : d, so <b>ad = bc</b> (product of extremes = product of means). The <b>mean proportional</b> of a and b is √(ab); the <b>third proportional</b> to a and b is b²/a; the <b>fourth proportional</b> to a, b, c is bc/a. If a/b = c/d, then <b>componendo–dividendo</b> gives (a + b)/(a − b) = (c + d)/(c − d), which often shortens algebra.</p>
<p style="margin-top:10px"><b>Indices</b>: aᵐ × aⁿ = aᵐ⁺ⁿ, aᵐ ÷ aⁿ = aᵐ⁻ⁿ, (aᵐ)ⁿ = aᵐⁿ, a⁰ = 1, a⁻ⁿ = 1/aⁿ and a<sup>1/n</sup> = ⁿ√a. <b>Logarithms</b> are indices in reverse: log<sub>a</sub> x = y means aʸ = x. The rules follow from the index laws: log(mn) = log m + log n, log(m/n) = log m − log n, log(mⁿ) = n log m, log<sub>a</sub> a = 1, log<sub>a</sub> 1 = 0, and the change of base rule log<sub>a</sub> x = log x ÷ log a. “log” on its own usually means base 10 (common log); “ln” means base e (natural log).</p>`,
      formula: "a : b = c : d ⟺ ad = bc  ·  log<sub>a</sub> x = y ⟺ aʸ = x<small>log(mn) = log m + log n · log(mⁿ) = n log m · log<sub>a</sub> x = log x ÷ log a</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">The ratio family at a glance (for 4 : 9)</h4>" +
          tbl(["Ratio", "Rule", "Result"], [
            ["Inverse", "b : a", "9 : 4"], ["Duplicate", "a² : b²", "16 : 81"], ["Sub-duplicate", "√a : √b", "2 : 3"],
            ["Triplicate", "a³ : b³", "64 : 729"], ["Compound with 3 : 2", "ac : bd", "12 : 18 = 2 : 3"]]);
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Kiran Traders (fictional) shares a bonus of ₹7,200 among three workers A, B and C. A : B = 2 : 3 and B : C = 4 : 5.</p>" +
          steps(["Make B equal in both ratios: A : B = 2 : 3 = 8 : 12 and B : C = 4 : 5 = 12 : 15.", "So A : B : C = 8 : 12 : 15, a total of 35 parts.", "A = 7,200 × 8/35 ≈ ₹1,645.71, B = 7,200 × 12/35 ≈ ₹2,468.57, C = 7,200 × 15/35 ≈ ₹3,085.71.", "Check: 1,645.71 + 2,468.57 + 3,085.71 ≈ ₹7,200 (rounding aside)."]) +
          "<p class=\"muted small\" style=\"margin-top:10px\">Logarithm check: log<sub>2</sub> 32 = 5 because 2⁵ = 32. With a calculator, log 32 ÷ log 2 = 1.5051 ÷ 0.3010 = 5.</p>";
      },
      use: ["Use ratios to share amounts, compare mixtures and scale recipes or costs.", "Use logarithms to solve equations where the unknown is a power, such as compound interest periods.", "Mistake: comparing quantities in different units (paise with rupees, months with years).", "Mistake: writing log(m + n) = log m + log n. Logs turn products into sums, not sums into sums."],
      walk: function () {
        return [
          { t: "A ratio is a division", c: "a : b means a ÷ b, with no units.", h: chips(["12 : 18", "=", "2 : 3"], function (x, i) { return ["ac", "", "mi"][i]; }) },
          { t: "Join ratios through the common term", c: "Make B equal in both, then read A : B : C.", h: box("A : B = 2 : 3 = 8 : 12\nB : C = 4 : 5 = 12 : 15\nA : B : C = 8 : 12 : 15", "good") },
          { t: "Proportion", c: "Product of extremes equals product of means.", h: '<div class="big">a : b = c : d ⟹ ad = bc</div>' },
          { t: "Index laws", c: "Add powers when you multiply, subtract when you divide.", h: chips(["2³ × 2⁴ = 2⁷", "(2³)² = 2⁶", "2⁻¹ = 1/2"], "ac") },
          { t: "Logs are powers in reverse", c: "log₂ 32 = 5 because 2⁵ = 32.", h: chips(["log(mn) = log m + log n", "log mⁿ = n log m"], "hl") }
        ];
      },
      recap: ["Ratios compare like quantities; proportion means ad = bc", "Logs turn multiplication into addition and powers into multiplication"],
      qc: [
        { q: "What is the compound ratio of 2 : 3 and 3 : 4?", o: ["1 : 2", "5 : 7", "6 : 7", "2 : 1"], a: 0, e: "Multiply term by term: (2 × 3) : (3 × 4) = 6 : 12 = 1 : 2." },
        { q: "What is log<sub>2</sub> 64?", o: ["6", "8", "32", "5"], a: 0, e: "2⁶ = 64, so log<sub>2</sub> 64 = 6." }
      ]
    },
    {
      id: "1.2", mod: 1, ch: "Chapter 2", title: "Equations: Linear, Simultaneous and Quadratic", time: "15 min", tool: "equation",
      outcomes: ["Solve linear equations and pairs of simultaneous linear equations", "Solve quadratic equations with the formula and by factorising", "Use the discriminant to describe the nature of the roots", "Use the sum and product of roots to form an equation"],
      notes: `<p>An <b>equation</b> is a statement that two expressions are equal, and solving it means finding the value(s) of the unknown that make it true. A <b>linear</b> equation in one variable (ax + b = 0) has one root, x = −b/a.</p>
<p style="margin-top:10px"><b>Simultaneous linear equations</b> in two variables (a₁x + b₁y = c₁ and a₂x + b₂y = c₂) are solved by <b>elimination</b> (make one variable's coefficients equal, then add or subtract), <b>substitution</b>, or <b>cross-multiplication</b>. Using determinants (Cramer's rule): x = (c₁b₂ − c₂b₁)/(a₁b₂ − a₂b₁) and y = (a₁c₂ − a₂c₁)/(a₁b₂ − a₂b₁). If the denominator is 0, the lines are parallel (no solution) or the same line (infinitely many).</p>
<p style="margin-top:10px">A <b>quadratic</b> equation ax² + bx + c = 0 (a ≠ 0) has roots x = [−b ± √(b² − 4ac)] ÷ 2a. The <b>discriminant</b> D = b² − 4ac decides the nature of the roots: D &gt; 0 gives two real, unequal roots (rational if D is a perfect square and a, b, c are rational); D = 0 gives two equal real roots; D &lt; 0 gives no real roots (they are imaginary/complex). For roots α and β: <b>α + β = −b/a</b> and <b>αβ = c/a</b>, so an equation with given roots is x² − (sum)x + (product) = 0.</p>
<p style="margin-top:10px">A <b>cubic</b> equation (power 3) can often be solved by finding one root by trial (try ±1, ±2, …), dividing out that factor and solving the remaining quadratic. In multiple-choice questions, <b>substituting the options</b> back into the equation is often the fastest method.</p>`,
      formula: "x = [−b ± √(b² − 4ac)] ÷ 2a<small>D = b² − 4ac · α + β = −b/a · αβ = c/a</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">What the discriminant tells you</h4>" +
          tbl(["D = b² − 4ac", "Roots", "Example"], [
            ["D &gt; 0, perfect square", "Real, unequal, rational", "x² − 5x + 6 = 0 → 2, 3"], ["D &gt; 0, not a perfect square", "Real, unequal, irrational", "x² − 2x − 1 = 0 → 1 ± √2"],
            ["D = 0", "Real and equal", "x² − 6x + 9 = 0 → 3, 3"], ["D &lt; 0", "Not real (complex)", "x² + x + 1 = 0"]]);
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Kiran Traders sells chairs at ₹50 each. Its costs are ₹30 per chair plus a fixed ₹10,000 a month. How many chairs must it sell to break even?</p>" +
          steps(["Break-even means revenue = cost: 50x = 30x + 10,000.", "So 20x = 10,000 and x = 500 chairs a month.", "Simultaneous example: 2x + 3y = 13 and 3x − y = 3. From the second, y = 3x − 3.", "Substitute: 2x + 9x − 9 = 13, so 11x = 22, x = 2 and y = 3. Check: 2(2) + 3(3) = 13 ✓."]) +
          "<p class=\"muted small\" style=\"margin-top:10px\">Quadratic: x² − 5x + 6 = 0 has D = 25 − 24 = 1, so the roots are (5 ± 1)/2 = 3 and 2. Sum 5 = −b/a ✓, product 6 = c/a ✓.</p>";
      },
      use: ["Use linear equations for break-even, mixtures and age problems.", "Use the sum and product of roots to answer “form the equation” questions without solving.", "Mistake: forgetting that a quadratic's coefficient a must not be 0.", "Mistake: dropping the ± and reporting only one root."],
      walk: function () {
        return [
          { t: "One unknown, one equation", c: "ax + b = 0 gives x = −b/a.", h: '<div class="big">20x = 10,000 → x = 500</div>' },
          { t: "Two unknowns, two equations", c: "Eliminate one variable, solve, then substitute back.", h: box("2x + 3y = 13\n3x − y = 3  → y = 3x − 3\n11x = 22 → x = 2, y = 3", "good") },
          { t: "The quadratic formula", c: "Works for every quadratic.", h: '<div class="big">x = (−b ± √D) / 2a</div>' },
          { t: "Read the discriminant", c: "D decides whether the roots are real, equal or complex.", h: chips(["D > 0: two real", "D = 0: equal", "D < 0: not real"], function (x, i) { return ["mi", "hl", "ac"][i]; }) },
          { t: "Sum and product shortcut", c: "α + β = −b/a and αβ = c/a.", h: chips(["x² − (sum)x + product = 0"], "ac") }
        ];
      },
      recap: ["Eliminate or substitute for simultaneous equations; use the formula for quadratics", "D = b² − 4ac tells you the nature of the roots; α + β = −b/a, αβ = c/a"],
      qc: [
        { q: "What are the roots of x² − 7x + 12 = 0?", o: ["3 and 4", "−3 and −4", "2 and 6", "1 and 12"], a: 0, e: "3 + 4 = 7 and 3 × 4 = 12, so (x − 3)(x − 4) = 0." },
        { q: "If the discriminant of a quadratic is negative, its roots are…", o: ["Not real (complex)", "Real and equal", "Real and unequal", "Always zero"], a: 0, e: "A negative number has no real square root, so the roots are complex." }
      ]
    },
    {
      id: "1.3", mod: 1, ch: "Chapter 3", title: "Linear Inequalities and Linear Programming", time: "15 min", tool: "lp",
      outcomes: ["Solve linear inequalities in one variable and show them on a number line", "Graph the half-plane of an inequality in two variables", "Find the feasible region of a system of inequalities", "Find the best (maximum or minimum) value with the corner-point method"],
      notes: `<p>An <b>inequality</b> uses &lt;, &gt;, ≤ or ≥. Solve it like an equation, with one key rule: <b>multiplying or dividing both sides by a negative number reverses the sign</b>. So −2x &gt; 6 gives x &lt; −3.</p>
<p style="margin-top:10px">In two variables, a linear inequality such as x + 2y ≤ 40 describes a <b>half-plane</b>: draw the boundary line x + 2y = 40 (solid for ≤ or ≥, dashed for &lt; or &gt;), then test a point such as (0, 0). If the point satisfies the inequality, shade its side; otherwise shade the other side.</p>
<p style="margin-top:10px">A <b>system</b> of inequalities is satisfied only where all the shaded regions overlap. In business problems this overlap is the <b>feasible region</b>: every point in it is a plan the business can actually carry out with its limited resources. The conditions x ≥ 0 and y ≥ 0 (<b>non-negativity</b>) keep us in the first quadrant, because you cannot make a negative number of chairs.</p>
<p style="margin-top:10px"><b>Linear programming</b> chooses the point in the feasible region that gives the best value of an <b>objective function</b> such as profit Z = 30x + 50y. The <b>corner-point theorem</b> says that if a best value exists, it occurs at a corner (vertex) of the feasible region. So: find every corner, evaluate Z at each, and pick the largest (for maximum) or smallest (for minimum).</p>`,
      formula: "Best value of Z = px + qy occurs at a corner of the feasible region<small>dividing or multiplying an inequality by a negative number flips the sign</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">Corner-point method in four steps</h4>" +
          tbl(["Step", "What to do"], [["1", "Write the constraints as inequalities and add x ≥ 0, y ≥ 0"], ["2", "Draw each boundary line and shade the feasible side"], ["3", "List the corner points (where boundary lines meet)"], ["4", "Evaluate Z at every corner; choose the best"]]);
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Kiran Traders makes chairs (x) and tables (y). Profit is ₹30 per chair and ₹50 per table. Carpentry: x + 2y ≤ 40 hours. Polishing: 3x + 2y ≤ 60 hours. x, y ≥ 0.</p>" +
          tbl(["Corner (x, y)", "Z = 30x + 50y"], [["(0, 0)", "0"], ["(20, 0)", "600"], ["(0, 20)", "1,000"], ["(10, 15)", "<b>1,050 (maximum)</b>"]]) +
          "<p class=\"muted small\" style=\"margin-top:10px\">(10, 15) is where x + 2y = 40 meets 3x + 2y = 60: subtracting gives 2x = 20, so x = 10 and y = 15. Making 10 chairs and 15 tables gives the highest profit, ₹1,050.</p>";
      },
      use: ["Use inequalities for budgets, capacity limits and minimum requirements.", "Use the corner-point method to plan production or a diet at the lowest cost.", "Mistake: forgetting to flip the sign when dividing by a negative number.", "Mistake: checking only some of the corners, or forgetting the points on the axes."],
      walk: function () {
        return [
          { t: "Flip the sign for negatives", c: "Dividing by −2 reverses the inequality.", h: box("−2x > 6\n x < −3", "good") },
          { t: "Each inequality is a half-plane", c: "Draw the line, test (0, 0), shade the true side.", h: chips(["x + 2y ≤ 40", "test (0,0): 0 ≤ 40 ✓"], function (x, i) { return ["ac", "mi"][i]; }) },
          { t: "Feasible region", c: "Where every constraint is satisfied at once.", h: chips(["Carpentry", "∩", "Polishing", "∩", "x, y ≥ 0"], function (x, i) { return i % 2 ? "" : "ac"; }) },
          { t: "Corners decide", c: "The best value of a linear objective is at a corner.", h: chips(["(0,0)", "(20,0)", "(10,15)", "(0,20)"], function (x, i) { return i === 2 ? "hl" : "ac"; }) },
          { t: "Pick the best", c: "Z = 30x + 50y is largest at (10, 15): ₹1,050.", h: '<div class="big">₹1,050</div>' }
        ];
      },
      recap: ["Flip the sign when multiplying or dividing by a negative", "The optimum of a linear objective lies at a corner of the feasible region"],
      qc: [
        { q: "Solve −3x ≥ 12.", o: ["x ≤ −4", "x ≥ −4", "x ≥ 4", "x ≤ 4"], a: 0, e: "Divide by −3 and reverse the sign: x ≤ −4." },
        { q: "In linear programming, the maximum of Z = px + qy over a bounded feasible region occurs…", o: ["At a corner point", "At the centre of the region", "Always at (0, 0)", "Outside the region"], a: 0, e: "This is the corner-point theorem." }
      ]
    },
    {
      id: "1.4", mod: 1, ch: "Chapter 4", title: "Mathematics of Finance", time: "18 min", tool: "finance",
      outcomes: ["Calculate simple and compound interest and the effective rate of interest", "Find the present and future value of an annuity, and a perpetuity", "Calculate an EMI, a sinking fund instalment and depreciation", "Use NPV and CAGR to compare investments"],
      notes: `<p><b>Simple interest</b> is earned only on the original amount: SI = P × R × T / 100. <b>Compound interest</b> is earned on interest too: A = P(1 + i)ⁿ, where i is the rate per period and n the number of periods. For R% a year compounded k times a year for t years, i = R/(100k) and n = kt. CI = A − P.</p>
<p style="margin-top:10px">The <b>effective rate</b> is the yearly rate that would give the same result with annual compounding: E = (1 + i)ᵏ − 1. So 12% compounded monthly is about 12.68% effective. <b>Depreciation</b> on the reducing-balance method works like compound interest in reverse: value after n years = P(1 − r)ⁿ.</p>
<p style="margin-top:10px">An <b>annuity</b> is a series of equal payments at equal intervals. For an <b>ordinary annuity</b> (payments at the end of each period) of A per period: future value = A[(1 + i)ⁿ − 1]/i and present value = A[1 − (1 + i)⁻ⁿ]/i. For an <b>annuity due</b> (payments at the start), multiply either by (1 + i). A <b>perpetuity</b> pays forever: PV = A/i. A <b>sinking fund</b> is money set aside regularly to reach a target, so the instalment is target × i / [(1 + i)ⁿ − 1].</p>
<p style="margin-top:10px">A loan repaid by equal instalments is an annuity, so the <b>EMI</b> = P × i(1 + i)ⁿ / [(1 + i)ⁿ − 1]. To compare projects, <b>NPV</b> = present value of all inflows − present value of outflows (accept if NPV &gt; 0). <b>CAGR</b> = (ending value ÷ beginning value)<sup>1/n</sup> − 1 gives the steady yearly growth rate.</p>`,
      formula: "A = P(1 + i)ⁿ · E = (1 + i)ᵏ − 1<small>PV of annuity = A[1 − (1 + i)⁻ⁿ]/i · EMI = P·i(1 + i)ⁿ/[(1 + i)ⁿ − 1] · CAGR = (End/Start)<sup>1/n</sup> − 1</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">Which formula when?</h4>" +
          tbl(["Situation", "Use"], [["One deposit grows", "A = P(1 + i)ⁿ"], ["Compare quoted rates", "Effective rate E"], ["Regular savings toward a goal", "FV of annuity / sinking fund"], ["Value of future regular receipts today", "PV of annuity"], ["Loan repayment", "EMI formula"], ["Accept or reject a project", "NPV"], ["Average growth over years", "CAGR"]]);
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Riya (fictional) deposits ₹50,000 at 8% a year compounded quarterly for 2 years.</p>" +
          steps(["Rate per quarter i = 8/400 = 0.02; number of quarters n = 4 × 2 = 8.", "A = 50,000 × 1.02⁸ = 50,000 × 1.171659 ≈ ₹58,582.97.", "Compound interest = 58,582.97 − 50,000 = ₹8,582.97.", "Effective rate = 1.02⁴ − 1 = 0.082432, about 8.24% a year."]) +
          "<p class=\"muted small\" style=\"margin-top:10px\">EMI check: a ₹5,00,000 loan at 9% a year for 5 years, repaid monthly (i = 0.0075, n = 60), has an EMI of about ₹10,379.</p>";
      },
      use: ["Use compound interest for deposits, loans and growth; use effective rates to compare offers.", "Use annuity formulas for EMIs, SIPs, leases and pension-type receipts.", "Mistake: using the yearly rate with monthly periods (always convert to the rate per period).", "Mistake: mixing up annuity due and ordinary annuity: check whether payments are at the start or end."],
      walk: function () {
        return [
          { t: "Simple vs compound", c: "Compound interest earns interest on interest.", h: chips(["SI = PRT/100", "A = P(1 + i)ⁿ"], function (x, i) { return i ? "hl" : "ac"; }) },
          { t: "Per-period rate", c: "8% compounded quarterly: i = 2%, n = 4 per year.", h: box("i = R / (100k)\nn = k × years", "good") },
          { t: "Effective rate", c: "12% monthly ≈ 12.68% a year.", h: '<div class="big">E = (1 + i)ᵏ − 1</div>' },
          { t: "Annuities", c: "Equal payments: find their future or present value.", h: chips(["FV = A[(1+i)ⁿ − 1]/i", "PV = A[1 − (1+i)⁻ⁿ]/i"], "ac") },
          { t: "Decisions", c: "EMI for loans, NPV for projects, CAGR for growth.", h: chips(["EMI", "NPV > 0 → accept", "CAGR"], function (x, i) { return ["ac", "mi", "hl"][i]; }) }
        ];
      },
      recap: ["Convert to the rate per period; A = P(1 + i)ⁿ", "Annuity formulas give EMIs, sinking funds and present values; NPV > 0 means accept"],
      qc: [
        { q: "What is the effective annual rate of 12% a year compounded monthly (approximately)?", o: ["12.68%", "12.00%", "13.20%", "11.89%"], a: 0, e: "(1.01)¹² − 1 ≈ 0.1268, i.e. 12.68%." },
        { q: "A perpetuity pays ₹6,000 a year. At 12% a year, what is its present value?", o: ["₹50,000", "₹72,000", "₹6,720", "₹5,357"], a: 0, e: "PV = A/i = 6,000/0.12 = ₹50,000." }
      ]
    },
    {
      id: "1.5", mod: 1, ch: "Chapter 5", title: "Permutations and Combinations", time: "15 min", tool: "pnc",
      outcomes: ["Use the fundamental principles of counting (multiplication and addition)", "Count arrangements with ⁿPᵣ, including repeated and identical items", "Count circular arrangements", "Count selections with ⁿCᵣ, including “at least” conditions"],
      notes: `<p>The <b>multiplication principle</b>: if one job can be done in m ways and, after it, another in n ways, both together can be done in m × n ways. The <b>addition principle</b>: if a job can be done in m ways <i>or</i> in n other ways (not both), it can be done in m + n ways. <b>n!</b> (n factorial) = n × (n − 1) × … × 1, with 0! = 1.</p>
<p style="margin-top:10px">A <b>permutation</b> is an <b>arrangement</b>, where order matters. The number of ways to arrange r of n different things is <b>ⁿPᵣ = n!/(n − r)!</b>. With repetition allowed, it is nʳ. If n things include p alike of one kind and q alike of another, they can be arranged in n!/(p! q!) ways. Around a circle, n different people can sit in <b>(n − 1)!</b> ways (fix one person, arrange the rest); for necklaces or garlands, where clockwise and anticlockwise look the same, it is (n − 1)!/2.</p>
<p style="margin-top:10px">A <b>combination</b> is a <b>selection</b>, where order does not matter. The number of ways to choose r of n different things is <b>ⁿCᵣ = n!/[r!(n − r)!]</b>. Useful facts: ⁿCᵣ = ⁿCₙ₋ᵣ, ⁿC₀ = ⁿCₙ = 1, ⁿCᵣ + ⁿCᵣ₋₁ = ⁿ⁺¹Cᵣ, and ⁿPᵣ = r! × ⁿCᵣ. The number of ways to choose <b>at least one</b> of n things is 2ⁿ − 1.</p>
<p style="margin-top:10px">Ask yourself first: <b>does order matter?</b> Arranging (seats, rankings, words, numbers) → permutation. Choosing (committees, teams, hands of cards) → combination. For “at least one” conditions, it is often quickest to subtract the unwanted cases from the total.</p>`,
      formula: "ⁿPᵣ = n!/(n − r)! · ⁿCᵣ = n!/[r!(n − r)!]<small>circular: (n − 1)! · identical items: n!/(p! q!) · at least one: 2ⁿ − 1</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">Arrangement or selection?</h4>" +
          tbl(["Question", "Order matters?", "Use"], [["Ways to award gold, silver, bronze to 8 runners", "Yes", "⁸P₃ = 336"], ["Ways to pick 3 of 8 runners for a relay pool", "No", "⁸C₃ = 56"], ["4-digit codes from 0–9, repeats allowed", "Yes", "10⁴ = 10,000"], ["Seat 6 people round a table", "Yes (circle)", "5! = 120"]]);
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">A committee of 3 is chosen from 5 men and 4 women. In how many ways does it include at least one woman?</p>" +
          steps(["Total committees of 3 from 9 people: ⁹C₃ = 84.", "Committees with no woman (all men): ⁵C₃ = 10.", "At least one woman = 84 − 10 = 74.", "Check by cases: 1 woman ⁴C₁·⁵C₂ = 40, 2 women ⁴C₂·⁵C₁ = 30, 3 women ⁴C₃ = 4 → 74 ✓."]) +
          "<p class=\"muted small\" style=\"margin-top:10px\">Arrangements of the letters of ACCOUNT: 7 letters with C twice, so 7!/2! = 2,520.</p>";
      },
      use: ["Use permutations for seating, ranking, passwords and arranging letters or digits.", "Use combinations for committees, teams, samples and selections.", "Mistake: using ⁿPᵣ when order does not matter (it over-counts by r!).", "Mistake: forgetting to divide by the factorials of repeated letters."],
      walk: function () {
        return [
          { t: "Multiply for “and”, add for “or”", c: "3 shirts and 4 trousers give 3 × 4 = 12 outfits.", h: chips(["3", "×", "4", "=", "12"], function (x, i) { return i === 4 ? "hl" : (i % 2 ? "" : "ac"); }) },
          { t: "Arrangements: ⁿPᵣ", c: "Order matters: first, second, third…", h: '<div class="big">⁸P₃ = 8 × 7 × 6 = 336</div>' },
          { t: "Selections: ⁿCᵣ", c: "Order does not matter, so divide by r!.", h: '<div class="big">⁸C₃ = 336 ÷ 3! = 56</div>' },
          { t: "Circles and repeats", c: "Circle: (n − 1)!. Repeated letters: divide by their factorials.", h: chips(["6 round a table: 5! = 120", "ACCOUNT: 7!/2! = 2,520"], "ac") },
          { t: "At least one", c: "Total minus the unwanted case.", h: box("⁹C₃ − ⁵C₃ = 84 − 10 = 74", "good") }
        ];
      },
      recap: ["Order matters → ⁿPᵣ; order does not matter → ⁿCᵣ", "Circular (n − 1)!; for “at least”, subtract the unwanted cases"],
      qc: [
        { q: "In how many ways can 6 people sit around a round table?", o: ["120", "720", "60", "36"], a: 0, e: "Circular arrangements: (6 − 1)! = 5! = 120." },
        { q: "What is ¹⁰C₈?", o: ["45", "90", "1,814,400", "80"], a: 0, e: "¹⁰C₈ = ¹⁰C₂ = (10 × 9)/2 = 45." }
      ]
    },
    {
      id: "1.6", mod: 1, ch: "Chapter 6", title: "Sequences and Series: AP and GP", time: "14 min", tool: "series",
      outcomes: ["Find the nth term and the sum of n terms of an arithmetic progression", "Find the nth term, the sum of n terms and the sum to infinity of a geometric progression", "Find arithmetic and geometric means", "Use the sums of natural numbers, squares and cubes"],
      notes: `<p>A <b>sequence</b> is an ordered list of numbers; a <b>series</b> is their sum. In an <b>arithmetic progression (AP)</b> each term is the previous term plus a fixed <b>common difference d</b>: a, a + d, a + 2d, … The nth term is <b>tₙ = a + (n − 1)d</b> and the sum of n terms is <b>Sₙ = n/2 [2a + (n − 1)d]</b>, which also equals n/2 (first term + last term). The <b>arithmetic mean</b> of a and b is (a + b)/2.</p>
<p style="margin-top:10px">In a <b>geometric progression (GP)</b> each term is the previous term multiplied by a fixed <b>common ratio r</b>: a, ar, ar², … The nth term is <b>tₙ = arⁿ⁻¹</b> and the sum of n terms is <b>Sₙ = a(rⁿ − 1)/(r − 1)</b> for r ≠ 1 (or a(1 − rⁿ)/(1 − r), handy when r &lt; 1). If −1 &lt; r &lt; 1 the terms shrink toward zero and the series has a <b>sum to infinity, S∞ = a/(1 − r)</b>. The <b>geometric mean</b> of two positive numbers a and b is √(ab), and for positive numbers <b>AM ≥ GM</b>.</p>
<p style="margin-top:10px">Three standard sums: 1 + 2 + … + n = <b>n(n + 1)/2</b>; 1² + 2² + … + n² = <b>n(n + 1)(2n + 1)/6</b>; 1³ + 2³ + … + n³ = <b>[n(n + 1)/2]²</b>.</p>
<p style="margin-top:10px">In business, APs model amounts that rise by a fixed sum each period (instalments, salaries with fixed increments) and GPs model amounts that grow by a fixed percentage (compound growth, depreciation).</p>`,
      formula: "AP: tₙ = a + (n − 1)d, Sₙ = n/2[2a + (n − 1)d] · GP: tₙ = arⁿ⁻¹, Sₙ = a(rⁿ − 1)/(r − 1)<small>S∞ = a/(1 − r) when |r| &lt; 1 · Σn = n(n + 1)/2</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">AP or GP?</h4>" +
          tbl(["Sequence", "Test", "Type"], [["4, 7, 10, 13", "Differences all 3", "AP, d = 3"], ["3, 6, 12, 24", "Ratios all 2", "GP, r = 2"], ["100, 90, 81, 72.9", "Ratios all 0.9", "GP, r = 0.9"], ["1, 4, 9, 16", "Differences 3, 5, 7", "Neither (squares)"]]);
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Riya saves ₹500 in month 1 and ₹100 more each month after that.</p>" +
          steps(["This is an AP with a = 500 and d = 100.", "Saving in month 12: t₁₂ = 500 + 11 × 100 = ₹1,600.", "Total in 12 months: S₁₂ = 12/2 × [2 × 500 + 11 × 100] = 6 × 2,100 = ₹12,600.", "GP comparison: 3, 6, 12, … has 8th term 3 × 2⁷ = 384 and the sum of 8 terms is 3(2⁸ − 1) = 765."]);
      },
      use: ["Use an AP for fixed increments: instalments, salaries, straight-line patterns.", "Use a GP for fixed percentage growth or decay: compounding, depreciation, population growth.", "Mistake: using n instead of (n − 1) in the nth-term formula.", "Mistake: using S∞ when |r| ≥ 1 (the series does not settle to a sum)."],
      walk: function () {
        return [
          { t: "AP: add the same amount", c: "500, 600, 700, … has d = 100.", h: chips(["500", "600", "700", "800"], "ac") },
          { t: "AP formulas", c: "Find any term or the total without listing every term.", h: box("tₙ = a + (n − 1)d\nSₙ = n/2 [2a + (n − 1)d]", "good") },
          { t: "GP: multiply by the same ratio", c: "3, 6, 12, 24, … has r = 2.", h: chips(["3", "6", "12", "24"], "hl") },
          { t: "Sum to infinity", c: "Only when the ratio is between −1 and 1.", h: '<div class="big">1 + ½ + ¼ + … = 2</div>' },
          { t: "Means", c: "AM = (a + b)/2, GM = √(ab), and AM ≥ GM.", h: chips(["AM of 4, 16 = 10", "GM of 4, 16 = 8"], "ac") }
        ];
      },
      recap: ["AP adds d; GP multiplies by r", "S∞ = a/(1 − r) only when |r| < 1"],
      qc: [
        { q: "What is the 10th term of the AP 2, 5, 8, …?", o: ["29", "32", "26", "30"], a: 0, e: "t₁₀ = 2 + 9 × 3 = 29." },
        { q: "What is the sum to infinity of 1 + 1/2 + 1/4 + …?", o: ["2", "1.5", "Infinite", "4"], a: 0, e: "a = 1, r = 1/2, so S∞ = 1/(1 − 1/2) = 2." }
      ]
    },
    {
      id: "1.7", mod: 1, ch: "Chapter 7", title: "Sets, Relations, Functions, Limits and Continuity", time: "17 min", tool: "sets",
      outcomes: ["Use set notation and operations, including Venn diagrams and De Morgan's laws", "Find Cartesian products and identify reflexive, symmetric and transitive relations", "Identify functions, including one-one and onto functions, and form compositions", "Evaluate basic limits and check a function for continuity"],
      notes: `<p>A <b>set</b> is a well-defined collection of objects, written in roster form {1, 2, 3} or set-builder form {x : x is a natural number, x &lt; 4}. Key ideas: the <b>empty set</b> ∅, <b>subsets</b> (A ⊆ B), the <b>universal set</b> U, and the <b>power set</b> P(A), the set of all subsets, which has <b>2ⁿ</b> elements if A has n. Operations: union A ∪ B, intersection A ∩ B, difference A − B (in A, not in B) and complement A′ (in U, not in A). <b>De Morgan's laws</b>: (A ∪ B)′ = A′ ∩ B′ and (A ∩ B)′ = A′ ∪ B′. For counting: <b>n(A ∪ B) = n(A) + n(B) − n(A ∩ B)</b>.</p>
<p style="margin-top:10px">The <b>Cartesian product</b> A × B is the set of all ordered pairs (a, b), with n(A) × n(B) elements. A <b>relation</b> from A to B is any subset of A × B, so there are 2<sup>n(A)·n(B)</sup> possible relations. A relation on a set is <b>reflexive</b> if every element is related to itself, <b>symmetric</b> if (a, b) gives (b, a), and <b>transitive</b> if (a, b) and (b, c) give (a, c). A relation with all three properties is an <b>equivalence relation</b>.</p>
<p style="margin-top:10px">A <b>function</b> f : A → B is a relation in which <b>every element of A has exactly one image</b> in B. A is the domain, B the co-domain, and the set of images the range. f is <b>one-one</b> (injective) if different inputs give different outputs, <b>onto</b> (surjective) if the range is all of B, and <b>bijective</b> if both, in which case it has an inverse f⁻¹. The <b>composition</b> (g∘f)(x) = g(f(x)).</p>
<p style="margin-top:10px">A <b>limit</b> lim<sub>x→a</sub> f(x) = L means f(x) gets as close to L as we like as x approaches a. Standard results: lim<sub>x→a</sub> (xⁿ − aⁿ)/(x − a) = naⁿ⁻¹, lim<sub>x→0</sub> (eˣ − 1)/x = 1, lim<sub>n→∞</sub> (1 + 1/n)ⁿ = e. For a 0/0 form, factorise and cancel first. f is <b>continuous</b> at x = a if f(a) is defined, the limit exists, and the limit equals f(a), i.e. the graph has no break there.</p>`,
      formula: "n(A ∪ B) = n(A) + n(B) − n(A ∩ B) · n(P(A)) = 2ⁿ<small>(A ∪ B)′ = A′ ∩ B′ · continuous at a ⟺ lim<sub>x→a</sub> f(x) = f(a)</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">Quick reference</h4>" +
          tbl(["Idea", "Example"], [["A = {1, 2}, B = {a, b, c}", "A × B has 2 × 3 = 6 pairs"], ["Relations from A to B", "2⁶ = 64"], ["f(x) = 2x + 3 on real numbers", "One-one and onto; f⁻¹(x) = (x − 3)/2"], ["lim<sub>x→2</sub> (x² − 4)/(x − 2)", "= lim (x + 2) = 4"], ["lim<sub>x→1</sub> (x⁵ − 1)/(x − 1)", "= 5 × 1⁴ = 5"]]);
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">In a class of 100 CA Foundation students (fictional survey), 60 like Accounts, 50 like Economics and 20 like both.</p>" +
          steps(["n(A ∪ E) = 60 + 50 − 20 = 90 students like at least one subject.", "Neither: 100 − 90 = 10 students.", "Only Accounts: 60 − 20 = 40; only Economics: 50 − 20 = 30.", "Check: 40 + 30 + 20 + 10 = 100 ✓."]);
      },
      use: ["Use Venn diagrams and the union formula for survey and overlap questions.", "Use function tests (one image per input) before asking about inverses.", "Mistake: adding n(A) + n(B) without subtracting the overlap.", "Mistake: substituting directly into a 0/0 limit instead of simplifying first."],
      walk: function () {
        return [
          { t: "Sets and operations", c: "Union, intersection, difference and complement.", h: chips(["A ∪ B", "A ∩ B", "A − B", "A′"], "ac") },
          { t: "Count the overlap once", c: "n(A ∪ B) = n(A) + n(B) − n(A ∩ B).", h: '<div class="big">60 + 50 − 20 = 90</div>' },
          { t: "Relations", c: "Reflexive, symmetric, transitive → equivalence.", h: chips(["Reflexive", "Symmetric", "Transitive"], "hl") },
          { t: "Functions", c: "Every input has exactly one output.", h: chips(["One-one", "Onto", "Bijective → inverse"], function (x, i) { return ["ac", "ac", "mi"][i]; }) },
          { t: "Limits and continuity", c: "Simplify 0/0 forms; continuous means no break.", h: box("lim x→2 (x² − 4)/(x − 2)\n= lim (x + 2) = 4", "good") }
        ];
      },
      recap: ["n(A ∪ B) = n(A) + n(B) − n(A ∩ B); a power set has 2ⁿ elements", "A function gives each input exactly one output; continuity means limit = value"],
      qc: [
        { q: "How many elements does the power set of {1, 2, 3} have?", o: ["8", "6", "3", "9"], a: 0, e: "2³ = 8 subsets, including ∅ and the set itself." },
        { q: "What is lim<sub>x→3</sub> (x² − 9)/(x − 3)?", o: ["6", "0", "3", "Does not exist"], a: 0, e: "(x² − 9)/(x − 3) = x + 3, which tends to 6." }
      ]
    },
    {
      id: "1.8", mod: 1, ch: "Chapter 8", title: "Calculus in Business: Differentiation and Integration", time: "18 min", tool: "calc",
      outcomes: ["Differentiate polynomial, exponential and logarithmic functions with the standard rules", "Find marginal cost and marginal revenue", "Find maximum and minimum values with the first and second derivative tests", "Integrate standard functions and recover total cost from marginal cost"],
      notes: `<p>The <b>derivative</b> dy/dx measures how fast y changes as x changes: the slope of the curve. Standard results: d/dx (xⁿ) = nxⁿ⁻¹, d/dx (constant) = 0, d/dx (eˣ) = eˣ, d/dx (log x) = 1/x, d/dx (aˣ) = aˣ log a. Rules: the derivative of a sum is the sum of derivatives; <b>product rule</b> (uv)′ = uv′ + vu′; <b>quotient rule</b> (u/v)′ = (vu′ − uv′)/v²; <b>chain rule</b> dy/dx = dy/du × du/dx.</p>
<p style="margin-top:10px">In business, if C(x) is the total cost of x units, <b>marginal cost MC = dC/dx</b> is the approximate cost of one more unit. Likewise, <b>marginal revenue MR = dR/dx</b>. Average cost AC = C(x)/x. Profit P(x) = R(x) − C(x) is largest where MR = MC.</p>
<p style="margin-top:10px"><b>Maxima and minima</b>: set f′(x) = 0 to find the stationary points. Then check the second derivative: f″(x) &lt; 0 means a <b>maximum</b>, f″(x) &gt; 0 means a <b>minimum</b>. A useful result: at the minimum average cost, MC = AC.</p>
<p style="margin-top:10px"><b>Integration</b> reverses differentiation: ∫xⁿ dx = xⁿ⁺¹/(n + 1) + C (n ≠ −1), ∫(1/x) dx = log x + C, ∫eˣ dx = eˣ + C. A <b>definite integral</b> ∫<sub>a</sub><sup>b</sup> f(x) dx = F(b) − F(a) gives the accumulated total (an area under the curve). Total cost = ∫MC dx + fixed cost, so the constant of integration is the fixed cost.</p>`,
      formula: "d/dx(xⁿ) = nxⁿ⁻¹ · ∫xⁿ dx = xⁿ⁺¹/(n + 1) + C<small>MC = dC/dx · max if f′ = 0 and f″ &lt; 0 · min if f′ = 0 and f″ &gt; 0</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">Standard derivatives and integrals</h4>" +
          tbl(["f(x)", "f′(x)", "∫ f(x) dx"], [["xⁿ", "nxⁿ⁻¹", "xⁿ⁺¹/(n + 1) + C"], ["eˣ", "eˣ", "eˣ + C"], ["1/x", "−1/x²", "log x + C"], ["log x", "1/x", "x log x − x + C"], ["k (constant)", "0", "kx + C"]]);
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Kiran Traders' cost of making x tables is C(x) = 2x² + 20x + 800 and its revenue is R(x) = 200x − x² (₹ hundreds, illustrative).</p>" +
          steps(["Marginal cost MC = dC/dx = 4x + 20. At x = 20, MC = 100.", "Average cost AC = 2x + 20 + 800/x. Setting d(AC)/dx = 2 − 800/x² = 0 gives x = 20, where AC = 40 + 20 + 40 = 100 = MC ✓.", "Profit P = R − C = −3x² + 180x − 800. P′ = −6x + 180 = 0 gives x = 30; P″ = −6 &lt; 0, so this is a maximum.", "Maximum profit P(30) = −2,700 + 5,400 − 800 = 1,900."]) +
          "<p class=\"muted small\" style=\"margin-top:10px\">Integration check: ∫(4x + 20) dx = 2x² + 20x + C, and the fixed cost 800 gives back C(x).</p>";
      },
      use: ["Use derivatives for marginal cost and revenue, and to find the output that maximises profit or minimises average cost.", "Use integration to recover total cost or revenue from marginal functions.", "Mistake: forgetting to check f″ to decide between maximum and minimum.", "Mistake: dropping the constant of integration (the fixed cost)."],
      walk: function () {
        return [
          { t: "Derivative = rate of change", c: "The slope of the curve at a point.", h: '<div class="big">d/dx (xⁿ) = nxⁿ⁻¹</div>' },
          { t: "Marginal cost", c: "C = 2x² + 20x + 800 gives MC = 4x + 20.", h: chips(["C(x)", "→ d/dx →", "MC = 4x + 20"], function (x, i) { return ["ac", "", "hl"][i]; }) },
          { t: "Find the peak", c: "Set P′ = 0, then check P″.", h: box("P = −3x² + 180x − 800\nP′ = −6x + 180 = 0 → x = 30\nP″ = −6 < 0 → maximum", "good") },
          { t: "Integration reverses it", c: "∫(4x + 20) dx = 2x² + 20x + C.", h: chips(["MC", "→ ∫ →", "C(x) + fixed cost"], function (x, i) { return ["hl", "", "ac"][i]; }) },
          { t: "Definite integral", c: "F(b) − F(a): the total between two points.", h: '<div class="big">∫₀² 3x² dx = 8</div>' }
        ];
      },
      recap: ["MC = dC/dx; set f′ = 0 and use f″ to classify", "Integration reverses differentiation; the constant is the fixed cost"],
      qc: [
        { q: "What is d/dx (5x³)?", o: ["15x²", "5x²", "15x³", "5x⁴/4"], a: 0, e: "Bring down the power and reduce it by one: 5 × 3x² = 15x²." },
        { q: "What is ∫ 6x² dx?", o: ["2x³ + C", "12x + C", "6x³ + C", "3x² + C"], a: 0, e: "6 × x³/3 = 2x³, plus the constant C." }
      ]
    },
    /* ---------------- MODULE 2: LOGICAL REASONING ---------------- */
    {
      id: "2.1", mod: 2, ch: "Chapter 9", title: "Number Series, Coding–Decoding and Odd Man Out", time: "14 min", tool: "pattern",
      outcomes: ["Find the next term of number and letter series by testing common patterns", "Use letter positions (A = 1 … Z = 26) and reverse positions to decode words", "Crack letter-shift, reverse-alphabet and substitution codes", "Spot the odd one out by finding the property the others share"],
      notes: `<p><b>Number series</b> follow a rule. Test the common ones in this order: (1) <b>differences</b> between terms (constant → AP; differences that themselves form a pattern → look at second differences); (2) <b>ratios</b> (constant → GP); (3) <b>squares and cubes</b>, with or without ±1, ±2 (e.g. 2, 5, 10, 17 = n² + 1); (4) <b>mixed operations</b> such as ×2 + 1; (5) <b>two series interleaved</b> (look at alternate terms); (6) <b>primes</b> and their multiples.</p>
<p style="margin-top:10px">For <b>letter series</b> and coding, convert letters to their <b>positions</b>: A = 1, B = 2, … Z = 26. The landmark trick <b>EJOTY</b> gives E = 5, J = 10, O = 15, T = 20, Y = 25. The <b>reverse position</b> is 27 − position, so A ↔ Z, B ↔ Y, M ↔ N (opposite letters always add to 27).</p>
<p style="margin-top:10px"><b>Coding–decoding</b> questions use a rule to change a word: shift each letter forward or back by a fixed number (CAT → DBU is +1), replace each letter with its opposite (GOLD → TLOW), write the word backwards, use position numbers (CAB → 3-1-2), or swap whole words (“sky is called sea”). Work out the rule from the example, test it on every letter, then apply it.</p>
<p style="margin-top:10px"><b>Odd man out</b> (classification) questions list items where all but one share a property. Check: prime or composite, perfect square or cube, even or odd, divisibility, digit sum, letter gaps, or category (fruits vs vegetables, metals vs non-metals). Choose the property that fits all the others <i>exactly</i>.</p>`,
      formula: "Position: A = 1 … Z = 26 · Reverse = 27 − position<small>EJOTY = 5, 10, 15, 20, 25 · test differences → ratios → squares/cubes → alternate terms</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">Pattern checklist with examples</h4>" +
          tbl(["Series", "Pattern", "Next"], [["7, 11, 15, 19", "+4 each time", "23"], ["2, 6, 12, 20, 30", "+4, +6, +8, +10", "42"], ["3, 9, 27, 81", "×3", "243"], ["2, 5, 10, 17, 26", "n² + 1", "37"], ["1, 2, 4, 7, 11", "+1, +2, +3, +4", "16"], ["5, 10, 7, 14, 11", "×2, −3 alternately", "22"]]);
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">In a code, FISH is written as GJTI. How is BIRD written?</p>" +
          steps(["Compare letters: F→G, I→J, S→T, H→I. Each letter moves forward by 1.", "Apply +1 to BIRD: B→C, I→J, R→S, D→E.", "So BIRD is written as <b>CJSE</b>.", "Reverse-alphabet example: G(7)→T(20), O(15)→L(12), L(12)→O(15), D(4)→W(23), so GOLD → TLOW."]) +
          "<p class=\"muted small\" style=\"margin-top:10px\">Odd man out: 27, 64, 125, 144, 216. All are perfect cubes except 144 (12²).</p>";
      },
      use: ["Write the differences under the series before guessing.", "Write letter positions above the letters when decoding.", "Mistake: stopping at the first rule that fits two terms; check it on every term.", "Mistake: miscounting letter positions; use EJOTY as checkpoints."],
      walk: function () {
        return [
          { t: "Look at the differences", c: "2, 6, 12, 20, 30: differences 4, 6, 8, 10.", h: chips(["2", "6", "12", "20", "30", "42?"], function (x, i) { return i === 5 ? "hl" : "ac"; }) },
          { t: "Then ratios, squares and cubes", c: "3, 9, 27 is ×3; 2, 5, 10, 17 is n² + 1.", h: chips(["×3", "n² + 1", "n³"], "ac") },
          { t: "Letters as numbers", c: "EJOTY: E = 5, J = 10, O = 15, T = 20, Y = 25.", h: chips(["E5", "J10", "O15", "T20", "Y25"], "hl") },
          { t: "Find the code rule", c: "FISH → GJTI: every letter +1.", h: box("F I S H\nG J T I   (+1)\nBIRD → CJSE", "good") },
          { t: "Odd one out", c: "Find the property all the others share.", h: chips(["27", "64", "125", "144", "216"], function (x, i) { return i === 3 ? "hl" : "ac"; }) }
        ];
      },
      recap: ["Test differences, ratios, powers and alternate terms in turn", "Convert letters to positions; opposite letters add to 27"],
      qc: [
        { q: "What comes next: 3, 9, 27, 81, …?", o: ["243", "162", "108", "324"], a: 0, e: "Each term is multiplied by 3: 81 × 3 = 243." },
        { q: "If CAT is coded as DBU, how is DOG coded?", o: ["EPH", "CNF", "EOH", "FQI"], a: 0, e: "Each letter moves forward by one: D→E, O→P, G→H." }
      ]
    },
    {
      id: "2.2", mod: 2, ch: "Chapter 10", title: "Direction Sense", time: "12 min", tool: "direction",
      outcomes: ["Use the eight directions and turns (left, right, about-turn) correctly", "Track a person's position through a series of moves", "Find the shortest distance and direction from the starting point", "Solve shadow questions using the position of the sun"],
      notes: `<p>There are four <b>main directions</b> (North, East, South, West) and four <b>intermediate</b> ones (North-East, South-East, South-West, North-West). Draw them like a compass with North at the top. A <b>right turn</b> is a 90° clockwise turn and a <b>left turn</b> is 90° anticlockwise, both measured from the way the person is <i>currently facing</i>. Facing North, a right turn means you now face East; facing South, a right turn means you face West. An <b>about-turn</b> is 180°.</p>
<p style="margin-top:10px">To solve a route question, draw it step by step on rough paper, or track coordinates: East is +x, North is +y. Add each move to the running position. The <b>shortest distance</b> back to the start is √(x² + y²) (Pythagoras), and the <b>direction</b> from the start comes from the signs of x and y: x &gt; 0 and y &gt; 0 means North-East, x &gt; 0 and y &lt; 0 means South-East, and so on.</p>
<p style="margin-top:10px"><b>Shadow questions</b>: the sun rises in the East and sets in the West. A shadow always falls on the side opposite the sun, so in the <b>morning</b> shadows point <b>West</b> and in the <b>evening</b> they point <b>East</b>. At noon in India, the shadow is very short and points roughly North. If a person's shadow in the morning falls to their right, they must be facing South (because West is to the right of someone facing South).</p>`,
      formula: "Distance = √(x² + y²) · East = +x, North = +y<small>right turn = 90° clockwise · morning shadow points West, evening shadow points East</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">Turning table</h4>" +
          tbl(["Facing", "After a right turn", "After a left turn"], [["North", "East", "West"], ["East", "South", "North"], ["South", "West", "East"], ["West", "North", "South"]]);
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Riya walks 5 km North, turns right and walks 3 km, then turns right again and walks 9 km. How far and in which direction is she from her starting point?</p>" +
          steps(["Start at (0, 0). 5 km North → (0, 5).", "Facing North, a right turn means East. 3 km East → (3, 5).", "Facing East, a right turn means South. 9 km South → (3, −4).", "Distance = √(3² + 4²) = 5 km. x &gt; 0 and y &lt; 0, so she is <b>5 km South-East</b> of the start."]);
      },
      use: ["Draw every move; never solve a route question only in your head.", "Turn relative to the current facing direction, not to North.", "Mistake: treating “turns right” as “goes East” every time.", "Mistake: giving the total distance walked instead of the straight-line distance."],
      walk: function () {
        return [
          { t: "Eight directions", c: "N, NE, E, SE, S, SW, W, NW.", h: chips(["N", "E", "S", "W"], "ac") },
          { t: "Turns are relative", c: "Facing South, a right turn means West.", h: box("Facing N + right → E\nFacing S + right → W", "good") },
          { t: "Track coordinates", c: "East +x, North +y.", h: chips(["(0,5)", "(3,5)", "(3,−4)"], "ac") },
          { t: "Straight-line distance", c: "√(3² + 4²) = 5 km.", h: '<div class="big">5 km South-East</div>' },
          { t: "Shadows", c: "Morning shadow → West; evening shadow → East.", h: chips(["Sun in East → shadow West", "Sun in West → shadow East"], "hl") }
        ];
      },
      recap: ["Turns are relative to the current facing direction", "Shortest distance = √(x² + y²); morning shadows point West"],
      qc: [
        { q: "Facing North, Riya turns right, then right again, then left. Which way is she facing now?", o: ["East", "West", "South", "North"], a: 0, e: "North → right → East → right → South → left → East." },
        { q: "A man walks 6 km East and then 8 km North. How far is he from the start?", o: ["10 km", "14 km", "2 km", "12 km"], a: 0, e: "√(6² + 8²) = √100 = 10 km." }
      ]
    },
    {
      id: "2.3", mod: 2, ch: "Chapter 11", title: "Seating Arrangements", time: "14 min", tool: "seating",
      outcomes: ["Interpret left and right correctly for rows facing North or South", "Interpret left and right for circular seating facing the centre", "Place people step by step, starting with definite clues", "Handle cases and eliminate options that break a clue"],
      notes: `<p><b>Linear arrangements</b>: people sit in a row. If they face <b>North</b>, their left is your left as you look at the page; if they face <b>South</b> (towards you), their left is <i>your</i> right. “Immediately left of B” means the very next seat on B's left; “left of B” alone means anywhere on that side. In a row of n people, the person kth from the left is (n − k + 1)th from the right.</p>
<p style="margin-top:10px"><b>Circular arrangements</b>: people sit round a table. When everyone faces the <b>centre</b>, a person's <b>left is clockwise</b> and their <b>right is anticlockwise</b>. (Picture yourself at the bottom of the circle facing up: your left hand points to 9 o'clock, which is the clockwise way round.) When everyone faces <b>outward</b>, this reverses. With n people evenly spaced, the person “opposite” is n/2 seats away.</p>
<p style="margin-top:10px">A reliable method: (1) draw the seats; (2) place people from the <b>definite</b> clues first (“C is in the middle”, “B sits at the right end”); (3) use “immediately next to” clues to fix neighbours; (4) if a clue allows two positions, draw both <b>cases</b>; (5) use negative clues (“E is not at an end”) to eliminate cases. Finally, re-read every clue against your answer.</p>`,
      formula: "Row facing North: left = your left · facing South: left = your right<small>circle facing centre: left = clockwise · kth from left = (n − k + 1)th from right</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">Words that matter</h4>" +
          tbl(["Clue", "Meaning"], [["A is immediately left of B", "A is in the next seat on B's left"], ["A is to the left of B", "Anywhere on B's left"], ["A is second to the right of B", "One person sits between them, on B's right"], ["A sits between B and C", "Usually immediately between (B A C or C A B)"], ["A is opposite B (circle)", "n/2 seats apart when n is even"]]);
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Five friends A, B, C, D and E sit in a row facing North. C is in the middle. B sits at the right end. A is immediately to the left of C. E is not at either end.</p>" +
          steps(["Five seats, numbered 1–5 from the left. C is in the middle: seat 3.", "B is at the right end: seat 5. A is immediately left of C: seat 2.", "Seats 1 and 4 are left for D and E. E is not at an end, so E is in seat 4 and D in seat 1.", "Answer: <b>D A C E B</b>. Who is second from the right? <b>E</b>."]);
      },
      use: ["Start with the clue that fixes a seat exactly.", "Draw both cases when a clue allows two positions, then eliminate.", "Mistake: flipping left and right for people facing South (or facing the centre).", "Mistake: reading “left of” as “immediately left of”."],
      walk: function () {
        return [
          { t: "Draw the seats", c: "Number them 1 to n from the left.", h: chips(["1", "2", "3", "4", "5"], "") },
          { t: "Definite clues first", c: "C in the middle, B at the right end.", h: chips(["·", "·", "C", "·", "B"], function (x, i) { return x === "·" ? "dim" : "ac"; }) },
          { t: "Immediate neighbours next", c: "A is immediately left of C.", h: chips(["·", "A", "C", "·", "B"], function (x, i) { return x === "·" ? "dim" : (i === 1 ? "hl" : "ac"); }) },
          { t: "Negative clues eliminate", c: "E is not at an end, so E takes seat 4.", h: chips(["D", "A", "C", "E", "B"], function (x, i) { return i === 3 ? "hl" : "ac"; }) },
          { t: "Circles: left is clockwise", c: "When everyone faces the centre.", h: '<div class="big">⟳ = left</div>' }
        ];
      },
      recap: ["Facing South or facing the centre changes which way “left” is", "Place definite clues first, then neighbours, then eliminate with negative clues"],
      qc: [
        { q: "In a row of 7 people facing North, Asha is 3rd from the left. What is her position from the right?", o: ["5th", "4th", "3rd", "6th"], a: 0, e: "n − k + 1 = 7 − 3 + 1 = 5." },
        { q: "People sit round a table facing the centre. Moving to a person's immediate left means moving…", o: ["Clockwise", "Anticlockwise", "Across the table", "It depends on the number of people"], a: 0, e: "Facing the centre, a person's left hand points clockwise round the table." }
      ]
    },
    {
      id: "2.4", mod: 2, ch: "Chapter 12", title: "Blood Relations", time: "12 min", tool: "relation",
      outcomes: ["Name relations across generations (grandparents to grandchildren)", "Work out a relation from a chain such as “my mother's brother's son”", "Draw a family tree with symbols for gender, couples and generations", "Solve coded relation questions (e.g. “A + B means A is the father of B”)"],
      notes: `<p>Blood relation questions test whether you can follow a chain of relations without losing track of <b>generation</b> and <b>gender</b>. Learn the core names: parents and grandparents (one and two generations up), children and grandchildren (one and two down), siblings (same generation), <b>uncle/aunt</b> (a parent's brother or sister), <b>nephew/niece</b> (a sibling's son or daughter), <b>cousin</b> (an uncle's or aunt's child), and the <b>in-laws</b>: a spouse's parent is a father- or mother-in-law; a spouse's sibling or a sibling's spouse is a brother- or sister-in-law; a child's spouse is a son- or daughter-in-law.</p>
<p style="margin-top:10px">Solve a chain <b>from the end nearest to the speaker</b>: “my grandfather's only son's daughter” → my grandfather's only son is my father → his daughter is my sister (or me, if I am female). Watch for words like <b>only</b>, which pin the answer down.</p>
<p style="margin-top:10px">For harder puzzles draw a <b>family tree</b>: a square or “+” for males, a circle or “−” for females, a double line (=) for a married couple, and a vertical line down to children. Keep each generation on its own level. Don't assume a gender that is not stated: “A is the child of B” does not tell you whether B is the father or mother.</p>
<p style="margin-top:10px"><b>Coded relations</b> define symbols, e.g. “P + Q means P is the father of Q, P × Q means P is the sister of Q”. Decode one symbol at a time, write each as a link in the tree, then read off the relation asked for.</p>`,
      formula: "Work from the speaker outward · track generation (+1 up, −1 down) and gender<small>parent's sibling = uncle/aunt · sibling's child = nephew/niece · uncle's child = cousin</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">Common chains</h4>" +
          tbl(["Chain", "Relation"], [["Father's father", "Grandfather"], ["Mother's brother", "Maternal uncle"], ["Father's sister's son", "Cousin"], ["Brother's daughter", "Niece"], ["Son's wife", "Daughter-in-law"], ["Wife's brother", "Brother-in-law"], ["Husband's mother", "Mother-in-law"]]);
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Pointing to a man, Riya says: “He is the son of my grandfather's only son.” How is the man related to Riya?</p>" +
          steps(["Start next to Riya: her grandfather's <b>only</b> son must be Riya's father.", "The son of Riya's father is Riya's <b>brother</b>.", "Coded example: A × B means A is the brother of B; A + B means A is the mother of B. Decode P × Q + R.", "P is the brother of Q, and Q is the mother of R, so P is R's <b>maternal uncle</b>."]);
      },
      use: ["Draw a family tree for any chain longer than two links.", "Track generations: up for parents, down for children, level for siblings and spouses.", "Mistake: assuming a gender that the question never states.", "Mistake: reading the chain from the wrong end."],
      walk: function () {
        return [
          { t: "Generations", c: "Grandparents +2, parents +1, you 0, children −1.", h: chips(["+2", "+1", "0", "−1", "−2"], function (x, i) { return i === 2 ? "hl" : "ac"; }) },
          { t: "Read from the speaker outward", c: "“My grandfather's only son” = my father.", h: box("grandfather's only son → father\nfather's son → brother", "good") },
          { t: "Key names", c: "Parent's sibling = uncle/aunt; their child = cousin.", h: chips(["Uncle/Aunt", "Cousin", "Nephew/Niece"], "ac") },
          { t: "In-laws", c: "Spouse's parent, spouse's sibling, child's spouse.", h: chips(["Mother-in-law", "Brother-in-law", "Daughter-in-law"], "hl") },
          { t: "Coded relations", c: "Decode one symbol at a time.", h: box("P × Q + R\nP brother of Q; Q mother of R\n→ P is R's maternal uncle", "good") }
        ];
      },
      recap: ["Track generation and gender at every link", "Draw a tree; never assume an unstated gender"],
      qc: [
        { q: "How is your father's sister's husband related to you?", o: ["Uncle", "Cousin", "Brother-in-law", "Nephew"], a: 0, e: "Your father's sister is your aunt; her husband is your uncle." },
        { q: "Rahul's father's only brother's son is Rahul's…", o: ["Cousin", "Brother", "Nephew", "Uncle"], a: 0, e: "The father's only brother is Rahul's uncle; the uncle's son is Rahul's cousin." }
      ]
    },

    /* ---------------- MODULE 3: STATISTICS ---------------- */
    {
      id: "3.1", mod: 3, ch: "Chapter 13", title: "Statistical Description of Data and Sampling", time: "16 min", tool: "freq",
      outcomes: ["Distinguish primary and secondary data and the ways of classifying data", "Build a frequency distribution with class limits, boundaries, mid-values and cumulative frequencies", "Choose a suitable chart: bar, pie, histogram, frequency polygon or ogive", "Describe random and non-random sampling methods and the errors in sampling"],
      notes: `<p><b>Primary data</b> are collected first-hand for the purpose at hand (interviews, questionnaires, observation); <b>secondary data</b> were collected by someone else (government publications, company reports). Data are <b>classified</b> chronologically (by time), geographically (by place), qualitatively (by attribute, e.g. gender) or quantitatively (by a measured variable, e.g. marks). A <b>table</b> has a title, stub (row headings), caption (column headings), body and source notes.</p>
<p style="margin-top:10px">A <b>frequency distribution</b> groups values into <b>classes</b>. In the class 40–60, 40 and 60 are the class limits, 60 − 40 = 20 is the <b>class width</b> and (40 + 60)/2 = 50 is the <b>mid-value</b>. In <b>exclusive</b> classes (40–60, 60–80) a value of 60 goes in the upper class; <b>inclusive</b> classes (40–59, 60–79) have gaps, so we use <b>class boundaries</b> (39.5–59.5) for charts. <b>Cumulative frequency</b> (less-than or more-than) adds frequencies class by class. <b>Frequency density</b> = frequency ÷ class width, used when class widths differ.</p>
<p style="margin-top:10px">Charts: <b>bar</b> and <b>pie</b> charts for categories; a <b>histogram</b> (touching bars, area proportional to frequency) for continuous classes; a <b>frequency polygon</b> joining mid-points; and an <b>ogive</b> (cumulative frequency curve), where the less-than and more-than ogives cross at the <b>median</b>.</p>
<p style="margin-top:10px">A <b>census</b> studies every member of the population; a <b>sample survey</b> studies part of it, saving time and money. A <b>parameter</b> describes the population, a <b>statistic</b> describes a sample. <b>Random</b> (probability) methods: simple random (lottery or random numbers), <b>stratified</b> (split into similar groups, sample from each), <b>systematic</b> (every kth item, k = N/n) and <b>cluster/multistage</b>. <b>Non-random</b> methods: purposive (judgement), quota and convenience. <b>Sampling errors</b> arise because only part of the population is studied; <b>non-sampling errors</b> (bias, wrong answers, recording mistakes) can occur even in a census. Sampling works because of the <b>law of statistical regularity</b> and the <b>law of inertia of large numbers</b>.</p>`,
      formula: "Class width = upper − lower · mid-value = (lower + upper)/2<small>systematic sampling interval k = N/n · frequency density = frequency ÷ class width</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">Sampling methods</h4>" +
          tbl(["Method", "How", "Random?"], [["Simple random", "Every unit has an equal chance (lottery, random numbers)", "Yes"], ["Stratified", "Divide into similar groups (strata), sample each", "Yes"], ["Systematic", "Random start, then every kth unit", "Yes"], ["Cluster / multistage", "Pick whole groups, or sample in stages", "Yes"], ["Purposive / quota / convenience", "Chosen by judgement, quotas or ease", "No"]]);
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Marks of 20 students (fictional): 12, 25, 37, 41, 44, 48, 52, 55, 57, 58, 61, 63, 66, 68, 72, 75, 78, 83, 88, 95. Group them in classes of width 20.</p>" +
          tbl(["Marks", "Mid-value", "Frequency", "Less-than cumulative"], [["0–20", "10", "1", "1"], ["20–40", "30", "2", "3"], ["40–60", "50", "7", "10"], ["60–80", "70", "7", "17"], ["80–100", "90", "3", "20"]]) +
          "<p class=\"muted small\" style=\"margin-top:10px\">Exclusive classes: a mark of exactly 60 would go in 60–80. To pick a systematic sample of 5 from these 20, use k = 20/5 = 4: a random start between 1 and 4, then every 4th student.</p>";
      },
      use: ["Use frequency tables and histograms to see the shape of a large data set.", "Use stratified sampling when the population has clearly different groups.", "Mistake: drawing a histogram with gaps, or with unequal class widths without using frequency density.", "Mistake: calling a convenience sample “random”."],
      walk: function () {
        return [
          { t: "Primary or secondary", c: "First-hand collection, or someone else's data.", h: chips(["Survey you run", "Published report"], function (x, i) { return i ? "hl" : "ac"; }) },
          { t: "Group into classes", c: "Limits, width, mid-value and frequency.", h: box("40–60: width 20, mid-value 50\nfrequency 7", "good") },
          { t: "Cumulative frequency", c: "Add up as you go: 1, 3, 10, 17, 20.", h: chips(["1", "3", "10", "17", "20"], "ac") },
          { t: "Pick the right chart", c: "Histogram for classes; ogives cross at the median.", h: chips(["Bar", "Pie", "Histogram", "Ogive"], "ac") },
          { t: "Sampling", c: "Random methods give every unit a known chance.", h: chips(["Simple", "Stratified", "Systematic", "Cluster"], "hl") }
        ];
      },
      recap: ["Class width, mid-value and cumulative frequency summarise grouped data", "Random sampling (simple, stratified, systematic, cluster) avoids selection bias"],
      qc: [
        { q: "A systematic sample of 50 is taken from a list of 1,000. What is the sampling interval?", o: ["20", "50", "100", "10"], a: 0, e: "k = N/n = 1,000/50 = 20." },
        { q: "Which sampling method divides the population into similar groups and samples from each?", o: ["Stratified sampling", "Convenience sampling", "Systematic sampling", "Quota sampling"], a: 0, e: "Stratified sampling draws a random sample from every stratum." }
      ]
    },
    {
      id: "3.2", mod: 3, ch: "Chapter 14 (Unit I)", title: "Measures of Central Tendency", time: "17 min", tool: "central",
      outcomes: ["Calculate the arithmetic mean for raw, discrete and grouped data (including weighted and combined means)", "Find the median, quartiles and percentiles, including for grouped data", "Find the mode, including the grouped-data formula and the empirical relation", "Use geometric and harmonic means, e.g. for growth rates and average speeds"],
      notes: `<p>An <b>average</b> is a single value that represents the whole data set. The <b>arithmetic mean</b> x̄ = Σx/n (raw data) or Σfx/Σf (frequency data, using mid-values for classes). With an assumed mean A and class width h, x̄ = A + (Σfd/Σf) × h where d = (x − A)/h. The sum of deviations from the mean is always zero, and the <b>combined mean</b> of two groups is (n₁x̄₁ + n₂x̄₂)/(n₁ + n₂). A <b>weighted mean</b> Σwx/Σw gives more importance to some values.</p>
<p style="margin-top:10px">The <b>median</b> is the middle value of ordered data: the ((n + 1)/2)th value. For grouped data, find the median class (where the cumulative frequency first reaches N/2), then Median = L + [(N/2 − cf)/f] × h, where L is the lower boundary of the median class, cf the cumulative frequency before it, f its frequency and h its width. <b>Quartiles</b> Q₁ and Q₃ use N/4 and 3N/4 in the same way; deciles and percentiles split the data into 10 and 100 parts.</p>
<p style="margin-top:10px">The <b>mode</b> is the most frequent value. For grouped data, Mode = L + [(f₁ − f₀)/(2f₁ − f₀ − f₂)] × h, where f₁ is the modal class frequency and f₀, f₂ those of the classes before and after. For moderately skewed data, the <b>empirical relation</b> Mode ≈ 3 Median − 2 Mean holds.</p>
<p style="margin-top:10px">The <b>geometric mean</b> GM = (x₁x₂…xₙ)<sup>1/n</sup> suits growth rates and ratios; the <b>harmonic mean</b> HM = n/Σ(1/x) suits rates such as average speed over equal distances. For positive values, <b>AM ≥ GM ≥ HM</b>, and for two numbers GM² = AM × HM.</p>`,
      formula: "x̄ = Σfx/Σf · Median = L + [(N/2 − cf)/f]·h · Mode = L + [(f₁ − f₀)/(2f₁ − f₀ − f₂)]·h<small>Mode ≈ 3 Median − 2 Mean · AM ≥ GM ≥ HM</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">Which average?</h4>" +
          tbl(["Situation", "Best average", "Why"], [["Marks of a class", "Mean", "Uses every value"], ["Incomes with a few very high earners", "Median", "Not pulled by extremes"], ["Most popular shoe size", "Mode", "The most common value"], ["Average growth rate over years", "GM", "Growth multiplies"], ["Average speed, equal distances", "HM", "Averages rates"]]);
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Daily sales (units) at Kiran Traders over 30 days (fictional): 10–20: 4 days, 20–30: 6, 30–40: 10, 40–50: 7, 50–60: 3.</p>" +
          steps(["Mean: Σfx = 4(15) + 6(25) + 10(35) + 7(45) + 3(55) = 1,040, so x̄ = 1,040/30 ≈ 34.67 units.", "Median: N/2 = 15. Cumulative frequencies 4, 10, 20, … so the median class is 30–40. Median = 30 + [(15 − 10)/10] × 10 = 35.", "Mode: modal class 30–40 with f₁ = 10, f₀ = 6, f₂ = 7. Mode = 30 + [4/(20 − 6 − 7)] × 10 ≈ 35.71.", "Check: 3(35) − 2(34.67) ≈ 35.67, close to 35.71 ✓."]) +
          "<p class=\"muted small\" style=\"margin-top:10px\">Average speed: 40 km/h one way and 60 km/h back over the same distance gives HM = 2 × 40 × 60/(40 + 60) = 48 km/h, not 50.</p>";
      },
      use: ["Use the median for skewed data such as incomes or house prices.", "Use the HM for average speeds over equal distances, and the GM for average growth rates.", "Mistake: using class limits instead of boundaries (L) for inclusive classes.", "Mistake: forgetting to sort the data before finding the median."],
      walk: function () {
        return [
          { t: "Mean", c: "Add up and divide: Σfx/Σf with mid-values.", h: '<div class="big">1,040 ÷ 30 ≈ 34.67</div>' },
          { t: "Median", c: "The middle of the ordered data.", h: box("N/2 = 15 → class 30–40\n30 + (15 − 10)/10 × 10 = 35", "good") },
          { t: "Mode", c: "The most frequent value; formula for classes.", h: chips(["f₀ = 6", "f₁ = 10", "f₂ = 7"], function (x, i) { return i === 1 ? "hl" : "ac"; }) },
          { t: "Empirical relation", c: "Mode ≈ 3 Median − 2 Mean.", h: '<div class="big">≈ 35.7</div>' },
          { t: "GM and HM", c: "Growth rates and average speeds.", h: chips(["AM ≥ GM ≥ HM"], "hl") }
        ];
      },
      recap: ["Mean = Σfx/Σf; median and mode have grouped-data formulas", "Mode ≈ 3 Median − 2 Mean; AM ≥ GM ≥ HM"],
      qc: [
        { q: "What is the median of 3, 8, 5, 12, 10?", o: ["8", "5", "7.6", "10"], a: 0, e: "Sorted: 3, 5, 8, 10, 12. The middle (3rd) value is 8." },
        { q: "If the mean is 40 and the median is 42, the empirical relation gives the mode as about…", o: ["46", "44", "38", "41"], a: 0, e: "Mode ≈ 3 × 42 − 2 × 40 = 126 − 80 = 46." }
      ]
    },
    {
      id: "3.3", mod: 3, ch: "Chapter 14 (Unit II)", title: "Measures of Dispersion", time: "16 min", tool: "dispersion",
      outcomes: ["Explain absolute and relative measures of dispersion", "Calculate range, quartile deviation and mean deviation, with their coefficients", "Calculate variance and standard deviation for raw and frequency data", "Use the coefficient of variation to compare consistency"],
      notes: `<p><b>Dispersion</b> measures how spread out values are around the average. Two data sets can share a mean but differ greatly in spread. <b>Absolute</b> measures are in the data's units (₹, kg); <b>relative</b> measures (coefficients) are unit-free, so you can compare different data sets.</p>
<p style="margin-top:10px"><b>Range</b> = largest − smallest (L − S); coefficient of range = (L − S)/(L + S). <b>Quartile deviation</b> QD = (Q₃ − Q₁)/2; coefficient of QD = (Q₃ − Q₁)/(Q₃ + Q₁). <b>Mean deviation</b> MD = Σ|x − A|/n about the mean or median A; it is smallest when taken about the <b>median</b>. Coefficient of MD = MD ÷ the average used.</p>
<p style="margin-top:10px">The <b>standard deviation</b> σ = √[Σ(x − x̄)²/n] is the most used measure; its square is the <b>variance</b>. A shortcut: σ² = Σx²/n − x̄². SD is <b>not affected by a change of origin</b> (adding a constant to every value) but <b>is affected by a change of scale</b> (multiplying every value by k multiplies σ by |k|). The SD of the first n natural numbers is √[(n² − 1)/12]. For two groups, the <b>combined SD</b> uses σ² = [n₁(σ₁² + d₁²) + n₂(σ₂² + d₂²)]/(n₁ + n₂), where dᵢ is each group's mean minus the combined mean.</p>
<p style="margin-top:10px">The <b>coefficient of variation</b> CV = (σ/x̄) × 100 compares variability relative to the mean. The data set with the <b>lower CV is more consistent</b> (more stable, less risky).</p>`,
      formula: "σ = √[Σ(x − x̄)²/n] · CV = (σ/x̄) × 100<small>QD = (Q₃ − Q₁)/2 · coefficient of range = (L − S)/(L + S) · SD unaffected by change of origin</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">Measures side by side</h4>" +
          tbl(["Measure", "Uses", "Weakness"], [["Range", "Quick look at spread", "Depends only on two extreme values"], ["Quartile deviation", "Spread of the middle 50%", "Ignores the outer 50%"], ["Mean deviation", "Average distance from the centre", "Ignores signs, hard to use further"], ["Standard deviation", "Most analysis, normal curve", "Affected by extreme values"], ["CV", "Comparing consistency", "Needs a positive mean"]]);
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Weekly sales (₹ thousand, fictional) of two sales staff over 5 weeks. A: 10, 12, 14, 16, 18. B: 5, 10, 20, 25, 30. Who is more consistent?</p>" +
          steps(["A: mean = 14. Squared deviations 16, 4, 0, 4, 16 sum to 40, so σ² = 8 and σ ≈ 2.83. CV = 2.83/14 × 100 ≈ 20.2%.", "B: mean = 18. Squared deviations 169, 64, 4, 49, 144 sum to 430, so σ² = 86 and σ ≈ 9.27. CV ≈ 51.5%.", "A has the lower CV, so A's sales are more consistent.", "Also for A: range = 8, coefficient of range = 8/28 ≈ 0.29, mean deviation about the mean = (4 + 2 + 0 + 2 + 4)/5 = 2.4."]);
      },
      use: ["Use SD and CV to compare risk and consistency (returns, sales, output).", "Use QD when there are extreme values that would distort the SD.", "Mistake: comparing SDs of data with different means or units; compare CVs instead.", "Mistake: thinking that adding a constant to every value changes the SD (it does not)."],
      walk: function () {
        return [
          { t: "Same mean, different spread", c: "Both sets have similar averages, very different scatter.", h: chips(["10 12 14 16 18", "5 10 20 25 30"], function (x, i) { return i ? "hl" : "ac"; }) },
          { t: "Range and QD", c: "Quick but use only a few values.", h: box("Range = L − S\nQD = (Q₃ − Q₁)/2", "good") },
          { t: "Standard deviation", c: "Square the deviations, average, take the root.", h: '<div class="big">σ = √(40/5) ≈ 2.83</div>' },
          { t: "Origin and scale", c: "Adding a constant leaves σ unchanged; ×k multiplies σ by |k|.", h: chips(["x + 5 → σ same", "3x → 3σ"], "ac") },
          { t: "CV for comparison", c: "Lower CV = more consistent.", h: chips(["A: 20.2%", "B: 51.5%"], function (x, i) { return i ? "" : "mi"; }) }
        ];
      },
      recap: ["σ = √[Σ(x − x̄)²/n]; SD ignores change of origin but not scale", "Lower coefficient of variation = more consistent"],
      qc: [
        { q: "What is the standard deviation of 5, 5, 5, 5?", o: ["0", "5", "1", "2.5"], a: 0, e: "All values equal the mean, so every deviation is zero." },
        { q: "A data set has mean 50 and SD 10. What is its coefficient of variation?", o: ["20%", "5%", "500%", "10%"], a: 0, e: "CV = 10/50 × 100 = 20%." }
      ]
    },
    {
      id: "3.4", mod: 3, ch: "Chapter 15", title: "Probability", time: "17 min", tool: "prob",
      outcomes: ["Use the language of experiments, sample spaces and events (mutually exclusive, exhaustive, independent)", "Calculate classical probabilities, including with cards, dice and coins, and convert odds", "Apply the addition and multiplication theorems and conditional probability", "Find the expected value and variance of a random variable"],
      notes: `<p>A random <b>experiment</b> has outcomes we cannot predict with certainty; the set of all outcomes is the <b>sample space</b> S, and an <b>event</b> is a subset of it. Events are <b>mutually exclusive</b> if they cannot happen together, <b>exhaustive</b> if together they cover S, and <b>independent</b> if one happening does not change the chance of the other.</p>
<p style="margin-top:10px"><b>Classical probability</b>: P(A) = favourable outcomes ÷ total equally likely outcomes. Always 0 ≤ P(A) ≤ 1 and P(A′) = 1 − P(A). <b>Odds in favour</b> a : b means P(A) = a/(a + b); odds against a : b means P(A) = b/(a + b). Know the standard sample spaces: a coin (2), a die (6), two dice (36), a pack of 52 cards (4 suits × 13; 26 red, 26 black; 12 face cards; 4 aces).</p>
<p style="margin-top:10px"><b>Addition theorem</b>: P(A ∪ B) = P(A) + P(B) − P(A ∩ B); for mutually exclusive events, P(A ∪ B) = P(A) + P(B). <b>Conditional probability</b>: P(A | B) = P(A ∩ B)/P(B). <b>Multiplication theorem</b>: P(A ∩ B) = P(A) × P(B | A); for independent events, P(A ∩ B) = P(A) × P(B). Bayes' theorem reverses a conditional probability using these rules.</p>
<p style="margin-top:10px">A <b>random variable</b> X assigns a number to each outcome. Its <b>expected value</b> E(X) = Σx·p(x) is the long-run average, and its variance V(X) = E(X²) − [E(X)]². Useful rules: E(aX + b) = aE(X) + b and V(aX + b) = a²V(X).</p>`,
      formula: "P(A ∪ B) = P(A) + P(B) − P(A ∩ B) · P(A ∩ B) = P(A)·P(B | A)<small>independent: P(A ∩ B) = P(A)P(B) · E(X) = Σx·p · V(X) = E(X²) − [E(X)]²</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">Sums of two dice (36 outcomes)</h4>" +
          tbl(["Sum", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], [["Ways", "1", "2", "3", "4", "5", "6", "5", "4", "3", "2", "1"]]);
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">One card is drawn from a well-shuffled pack of 52.</p>" +
          steps(["P(king) = 4/52 and P(heart) = 13/52. The king of hearts is in both, so P(king ∩ heart) = 1/52.", "P(king or heart) = 4/52 + 13/52 − 1/52 = 16/52 = 4/13.", "Expected value: a game (fictional) pays ₹100 with probability 0.2, ₹20 with probability 0.5 and ₹0 with probability 0.3.", "E(X) = 100(0.2) + 20(0.5) + 0(0.3) = ₹30. If it costs ₹35 to play, a player loses ₹5 per game on average."]);
      },
      use: ["Use the addition theorem for “or”, the multiplication theorem for “and”.", "Use expected value to judge games, insurance and investment choices.", "Mistake: adding probabilities of events that can happen together without subtracting the overlap.", "Mistake: confusing mutually exclusive (cannot happen together) with independent (do not affect each other)."],
      walk: function () {
        return [
          { t: "Favourable ÷ total", c: "Only when outcomes are equally likely.", h: '<div class="big">P(7 with two dice) = 6/36</div>' },
          { t: "“Or”: addition theorem", c: "Subtract the overlap.", h: box("P(K ∪ H) = 4/52 + 13/52 − 1/52\n= 16/52 = 4/13", "good") },
          { t: "“And”: multiplication theorem", c: "Independent events: multiply.", h: chips(["P(A) = 0.5", "P(B) = 0.4", "P(A ∩ B) = 0.2"], function (x, i) { return i === 2 ? "hl" : "ac"; }) },
          { t: "Odds", c: "Odds in favour 3 : 5 → P = 3/8.", h: chips(["a : b → a/(a + b)"], "ac") },
          { t: "Expected value", c: "The long-run average: Σx·p.", h: '<div class="big">E(X) = ₹30</div>' }
        ];
      },
      recap: ["P(A ∪ B) = P(A) + P(B) − P(A ∩ B); independent → multiply", "E(X) = Σx·p is the long-run average"],
      qc: [
        { q: "The odds in favour of an event are 3 : 5. What is its probability?", o: ["3/8", "3/5", "5/8", "2/5"], a: 0, e: "P = a/(a + b) = 3/(3 + 5) = 3/8." },
        { q: "A and B are independent with P(A) = 0.5 and P(B) = 0.4. What is P(A ∩ B)?", o: ["0.2", "0.9", "0.1", "0.7"], a: 0, e: "For independent events, P(A ∩ B) = 0.5 × 0.4 = 0.2." }
      ]
    },
    {
      id: "3.5", mod: 3, ch: "Chapter 16", title: "Theoretical Distributions: Binomial, Poisson and Normal", time: "18 min", tool: "dist",
      outcomes: ["Recognise when to use the binomial, Poisson and normal distributions", "Calculate binomial probabilities, mean and variance", "Calculate Poisson probabilities and use Poisson to approximate the binomial", "Use the standard normal variable z to find areas and probabilities"],
      notes: `<p>The <b>binomial distribution</b> applies to n independent trials, each with two outcomes (success with probability p, failure with q = 1 − p). P(X = x) = ⁿCₓ pˣ qⁿ⁻ˣ for x = 0, 1, …, n. Its <b>mean is np</b> and its <b>variance npq</b> (so variance &lt; mean). It is symmetric when p = 0.5. The most likely value (mode) lies near (n + 1)p.</p>
<p style="margin-top:10px">The <b>Poisson distribution</b> models the number of rare events in a fixed interval (defects per sheet, calls per minute, accidents per day). P(X = x) = e⁻ᵐ mˣ / x! for x = 0, 1, 2, …, where m is the average. Its <b>mean = variance = m</b>. When n is large and p is small, the binomial can be approximated by a Poisson with m = np.</p>
<p style="margin-top:10px">The <b>normal distribution</b> is a continuous, bell-shaped, symmetric curve with <b>mean = median = mode</b> and total area 1. It is described by μ and σ. Convert any value to the <b>standard normal variable z = (x − μ)/σ</b> and use the standard normal table. About <b>68.27%</b> of values lie within μ ± σ, <b>95.45%</b> within μ ± 2σ and <b>99.73%</b> within μ ± 3σ. The curve's points of inflexion are at μ ± σ; QD ≈ 0.6745σ and MD ≈ 0.7979σ (roughly 4/5 of σ).</p>`,
      formula: "Binomial: P(x) = ⁿCₓ pˣqⁿ⁻ˣ, mean np, variance npq · Poisson: P(x) = e⁻ᵐmˣ/x!, mean = variance = m<small>Normal: z = (x − μ)/σ · μ ± σ: 68.27% · μ ± 2σ: 95.45% · μ ± 3σ: 99.73%</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">Which distribution?</h4>" +
          tbl(["", "Binomial", "Poisson", "Normal"], [["Variable", "Discrete, 0 to n", "Discrete, 0, 1, 2, …", "Continuous"], ["Parameters", "n, p", "m", "μ, σ"], ["Mean", "np", "m", "μ"], ["Variance", "npq", "m", "σ²"], ["Typical use", "Defectives in a sample of n", "Rare events per interval", "Heights, marks, errors"]]);
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">A supplier's items are 10% defective (fictional). Kiran Traders checks a sample of 5.</p>" +
          steps(["Binomial with n = 5, p = 0.1, q = 0.9.", "P(exactly 1 defective) = ⁵C₁(0.1)(0.9)⁴ = 5 × 0.1 × 0.6561 ≈ 0.3281.", "Mean = np = 0.5 defective; variance = npq = 0.45.", "Normal: if marks are normal with μ = 60 and σ = 10, P(X &gt; 80) = P(z &gt; 2) ≈ 0.0228, about 2.3% of students."]) +
          "<p class=\"muted small\" style=\"margin-top:10px\">Poisson: if a page has on average 2 typing errors, P(no errors) = e⁻² ≈ 0.1353.</p>";
      },
      use: ["Binomial: a fixed number of yes/no trials with the same p.", "Poisson: counts of rare events in time or space; normal: measurements that cluster around an average.", "Mistake: using the Poisson when p is large or n is small.", "Mistake: forgetting to convert x to z before reading the normal table."],
      walk: function () {
        return [
          { t: "Binomial", c: "n trials, success probability p.", h: box("P(x) = ⁿCₓ pˣ qⁿ⁻ˣ\nmean np, variance npq", "good") },
          { t: "Poisson", c: "Rare events; mean = variance = m.", h: '<div class="big">P(0) = e⁻ᵐ</div>' },
          { t: "Normal curve", c: "Symmetric bell; mean = median = mode.", h: chips(["μ − σ", "μ", "μ + σ"], function (x, i) { return i === 1 ? "hl" : "ac"; }) },
          { t: "Standardise", c: "z = (x − μ)/σ, then read the table.", h: '<div class="big">z = (80 − 60)/10 = 2</div>' },
          { t: "68 – 95 – 99.7", c: "Share of values within 1, 2 and 3 SDs.", h: chips(["68.27%", "95.45%", "99.73%"], "ac") }
        ];
      },
      recap: ["Binomial mean np and variance npq; Poisson mean = variance = m", "Normal: z = (x − μ)/σ; 68.27% within one SD"],
      qc: [
        { q: "A binomial distribution has n = 20 and p = 0.25. What is its mean?", o: ["5", "3.75", "20", "0.25"], a: 0, e: "Mean = np = 20 × 0.25 = 5." },
        { q: "Which distribution has its mean equal to its variance?", o: ["Poisson", "Binomial", "Normal (always)", "None"], a: 0, e: "For the Poisson distribution, mean = variance = m." }
      ]
    },
    {
      id: "3.6", mod: 3, ch: "Chapter 17", title: "Correlation and Regression", time: "18 min", tool: "corr",
      outcomes: ["Describe correlation from a scatter diagram (positive, negative, none)", "Calculate Karl Pearson's coefficient r and Spearman's rank correlation", "Find the regression lines of y on x and x on y and use them to estimate", "Use the links between r and the regression coefficients"],
      notes: `<p><b>Correlation</b> measures how closely two variables move together. A <b>scatter diagram</b> gives a first look: points rising left to right show positive correlation, falling show negative, and no pattern shows little or none. Correlation does not prove causation.</p>
<p style="margin-top:10px"><b>Karl Pearson's coefficient</b> r = Cov(x, y)/(σₓσᵧ) = Σdxdy/√(Σdx²·Σdy²), where dx = x − x̄ and dy = y − ȳ. Always <b>−1 ≤ r ≤ 1</b>: r = +1 is perfect positive, r = −1 perfect negative, r = 0 no linear relation. r is unaffected by a change of origin and of scale (except that multiplying one variable by a negative number flips its sign). The <b>coefficient of determination r²</b> is the share of the variation in y explained by x. Probable error PE = 0.6745 (1 − r²)/√n.</p>
<p style="margin-top:10px"><b>Spearman's rank correlation</b> R = 1 − 6Σd²/[n(n² − 1)], where d is the difference between ranks. Use it for ranked or qualitative data (judges' rankings). For tied ranks, give each tied item the average rank.</p>
<p style="margin-top:10px"><b>Regression</b> estimates one variable from another. The line of <b>y on x</b> is y − ȳ = bᵧₓ(x − x̄) with bᵧₓ = rσᵧ/σₓ = Σdxdy/Σdx²; the line of <b>x on y</b> is x − x̄ = bₓᵧ(y − ȳ) with bₓᵧ = Σdxdy/Σdy². Both lines pass through (x̄, ȳ). The regression coefficients have the same sign as r, and <b>r = ±√(bᵧₓ × bₓᵧ)</b>, so their product cannot exceed 1. Use y on x to estimate y from a given x.</p>`,
      formula: "r = Σdxdy/√(Σdx²·Σdy²) · R = 1 − 6Σd²/[n(n² − 1)]<small>y − ȳ = bᵧₓ(x − x̄) · bᵧₓ = Σdxdy/Σdx² · r = ±√(bᵧₓ·bₓᵧ)</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">Reading r</h4>" +
          tbl(["r", "Meaning"], [["+1", "Perfect positive linear relation"], ["0.7 to 0.99", "Strong positive"], ["0.3 to 0.69", "Moderate positive"], ["About 0", "No linear relation"], ["Negative values", "Same scale, but one rises as the other falls"]]);
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">Kiran Traders' advertising spend x (₹ thousand) and sales y (₹ lakh) over five months (fictional): x = 2, 3, 5, 6, 9 and y = 5, 7, 8, 10, 15.</p>" +
          steps(["x̄ = 5, ȳ = 9. dx = −3, −2, 0, 1, 4 and dy = −4, −2, −1, 1, 6.", "Σdxdy = 41, Σdx² = 30, Σdy² = 58. r = 41/√(30 × 58) = 41/41.71 ≈ 0.983, a very strong positive correlation.", "bᵧₓ = 41/30 ≈ 1.367, so y − 9 = 1.367(x − 5). Spending ₹7 thousand gives an estimated y ≈ 9 + 2.73 = 11.73 (₹ lakh).", "bₓᵧ = 41/58 ≈ 0.707. Check: √(1.367 × 0.707) ≈ 0.983 = r ✓."]);
      },
      use: ["Use r to measure how strongly two variables move together; use regression to estimate one from the other.", "Use Spearman's R for rankings and qualitative judgements.", "Mistake: using the x-on-y line to estimate y.", "Mistake: concluding that one variable causes the other just because r is high."],
      walk: function () {
        return [
          { t: "Scatter first", c: "Rising points mean positive correlation.", h: chips(["↗ positive", "↘ negative", "· no pattern"], "ac") },
          { t: "Karl Pearson's r", c: "Between −1 and +1.", h: box("r = Σdxdy / √(Σdx² · Σdy²)\n= 41 / √(30 × 58) ≈ 0.983", "good") },
          { t: "Spearman for ranks", c: "R = 1 − 6Σd²/[n(n² − 1)].", h: '<div class="big">1 − 24/120 = 0.8</div>' },
          { t: "Regression line", c: "y on x estimates y from x.", h: chips(["y − ȳ = bᵧₓ(x − x̄)"], "hl") },
          { t: "Linked coefficients", c: "r = ±√(bᵧₓ · bₓᵧ), same sign.", h: chips(["0.8 × 0.45 = 0.36", "r = 0.6"], "ac") }
        ];
      },
      recap: ["r = Σdxdy/√(Σdx²Σdy²), between −1 and +1; Spearman for ranks", "Use y on x to estimate y; r = ±√(bᵧₓ·bₓᵧ)"],
      qc: [
        { q: "If bᵧₓ = 0.8 and bₓᵧ = 0.45, what is r?", o: ["0.6", "0.36", "1.25", "−0.6"], a: 0, e: "r = √(0.8 × 0.45) = √0.36 = 0.6, positive like the coefficients." },
        { q: "Which statement about Karl Pearson's r is true?", o: ["It always lies between −1 and +1", "It can be greater than 1", "It changes when you add a constant to x", "r = 0 proves the variables are independent in every way"], a: 0, e: "−1 ≤ r ≤ 1, and r is unaffected by a change of origin." }
      ]
    },
    {
      id: "3.7", mod: 3, ch: "Chapter 18", title: "Index Numbers", time: "16 min", tool: "index",
      outcomes: ["Explain what index numbers measure and how a base year is chosen", "Calculate simple aggregative and average-of-relatives indices", "Calculate Laspeyres, Paasche, Fisher's, Marshall–Edgeworth and Bowley's indices", "Apply the time reversal and factor reversal tests, and deflate values with a price index"],
      notes: `<p>An <b>index number</b> measures the relative change in a variable (price, quantity or value) between a <b>base period</b> (index = 100) and a current period. A good base year is a normal year, not too far in the past. Price indices such as the Consumer Price Index (CPI) and Wholesale Price Index (WPI) track inflation and are used to adjust wages and contracts.</p>
<p style="margin-top:10px">Unweighted methods: the <b>simple aggregative</b> index Σp₁/Σp₀ × 100, and the <b>simple average of price relatives</b>, the mean of (p₁/p₀ × 100) across items. Weighted methods use quantities as weights: <b>Laspeyres</b> = Σp₁q₀/Σp₀q₀ × 100 (base-year quantities); <b>Paasche</b> = Σp₁q₁/Σp₀q₁ × 100 (current-year quantities); <b>Marshall–Edgeworth</b> = Σp₁(q₀ + q₁)/Σp₀(q₀ + q₁) × 100; <b>Bowley</b> = (L + P)/2; and <b>Fisher's ideal index</b> = √(L × P).</p>
<p style="margin-top:10px">Tests of a good index: the <b>unit test</b> (unchanged by the units of measurement); the <b>time reversal test</b> P₀₁ × P₁₀ = 1; the <b>factor reversal test</b> P₀₁ × Q₀₁ = Σp₁q₁/Σp₀q₀ (the value index); and the <b>circular test</b>. Fisher's index satisfies both time and factor reversal, which is why it is called “ideal”. Laspeyres and Paasche satisfy neither.</p>
<p style="margin-top:10px">Practical uses: a <b>chain index</b> links each year to the previous one; <b>base shifting</b> divides every index by the new base year's index × 100; <b>splicing</b> joins two series with different bases. <b>Deflating</b> converts money values into real values: real income = money income ÷ price index × 100.</p>`,
      formula: "Laspeyres = Σp₁q₀/Σp₀q₀ × 100 · Paasche = Σp₁q₁/Σp₀q₁ × 100 · Fisher = √(L × P)<small>real value = money value ÷ price index × 100 · Fisher satisfies time and factor reversal</small>",
      extra: function () {
        return "<h4 style=\"margin:4px 0 8px\">Which test does each index pass?</h4>" +
          tbl(["Index", "Time reversal", "Factor reversal"], [["Laspeyres", "No", "No"], ["Paasche", "No", "No"], ["Marshall–Edgeworth", "Yes", "No"], ["Fisher's ideal", "Yes", "Yes"], ["Simple aggregative", "Yes", "No"]]);
      },
      example: function () {
        return "<p class=\"muted\" style=\"margin-bottom:10px\">A household basket (fictional, prices in ₹, quantities per month). Rice: p₀ 40, q₀ 10, p₁ 50, q₁ 8. Oil: p₀ 120, q₀ 5, p₁ 150, q₁ 5. Sugar: p₀ 40, q₀ 4, p₁ 45, q₁ 5.</p>" +
          steps(["Σp₀q₀ = 400 + 600 + 160 = 1,160 and Σp₁q₀ = 500 + 750 + 180 = 1,430. Laspeyres = 1,430/1,160 × 100 ≈ 123.28.", "Σp₀q₁ = 320 + 600 + 200 = 1,120 and Σp₁q₁ = 400 + 750 + 225 = 1,375. Paasche = 1,375/1,120 × 100 ≈ 122.77.", "Fisher = √(123.28 × 122.77) ≈ 123.02.", "Deflating: a salary of ₹60,000 when the CPI is 150 is worth 60,000/150 × 100 = ₹40,000 at base-year prices."]);
      },
      use: ["Use price indices to measure inflation and to adjust salaries, rents and contracts.", "Use deflating to compare real incomes across years.", "Mistake: swapping q₀ and q₁ between Laspeyres and Paasche.", "Mistake: forgetting to multiply by 100."],
      walk: function () {
        return [
          { t: "Base = 100", c: "An index shows change relative to the base period.", h: '<div class="big">123 = 23% higher</div>' },
          { t: "Laspeyres", c: "Weights: base-year quantities.", h: box("Σp₁q₀ / Σp₀q₀ × 100\n= 1,430 / 1,160 × 100 ≈ 123.28", "good") },
          { t: "Paasche", c: "Weights: current-year quantities.", h: box("Σp₁q₁ / Σp₀q₁ × 100\n= 1,375 / 1,120 × 100 ≈ 122.77", "good") },
          { t: "Fisher's ideal", c: "Geometric mean of L and P; passes both reversal tests.", h: '<div class="big">√(L × P) ≈ 123.02</div>' },
          { t: "Deflate", c: "Real value = money value ÷ index × 100.", h: chips(["₹60,000", "÷ 150 × 100", "= ₹40,000"], function (x, i) { return i === 2 ? "hl" : "ac"; }) }
        ];
      },
      recap: ["Laspeyres uses q₀, Paasche uses q₁; Fisher = √(L × P) is ideal", "Real value = money value ÷ price index × 100"],
      qc: [
        { q: "Fisher's ideal index is the…", o: ["Geometric mean of the Laspeyres and Paasche indices", "Arithmetic mean of the Laspeyres and Paasche indices", "Laspeyres index with current weights", "Simple aggregative index"], a: 0, e: "Fisher = √(L × P); the arithmetic mean (L + P)/2 is Bowley's index." },
        { q: "Which quantities does the Laspeyres index use as weights?", o: ["Base-year quantities (q₀)", "Current-year quantities (q₁)", "The average of q₀ and q₁", "No weights"], a: 0, e: "Laspeyres = Σp₁q₀/Σp₀q₀ × 100." }
      ]
    }
  ];

  var MODULES = [
    { n: 1, title: "Business Mathematics", sub: "Ratios and logs, equations, inequalities, finance, counting, progressions, sets and functions, and calculus.", tag: "Module 1", short: "Business Mathematics", takeaway: "Most Business Mathematics questions reward a clear method: write the formula, convert to the right units or per-period rate, and check the answer by substituting back." },
    { n: 2, title: "Logical Reasoning", sub: "Number and letter series, coding–decoding, direction sense, seating arrangements and blood relations.", tag: "Module 2", short: "Logical Reasoning", takeaway: "Reasoning questions are won on paper: write positions, draw directions, seats and family trees, and test every clue against your final answer." },
    { n: 3, title: "Statistics", sub: "Describing data and sampling, averages and spread, probability, distributions, correlation and regression, and index numbers.", tag: "Module 3", short: "Statistics", takeaway: "Statistics turns data into decisions: summarise with averages and spread, model uncertainty with probability and distributions, and measure relationships and price changes with correlation, regression and index numbers." }
  ];

  /* ================= FINAL TEST (30 questions: 12 + 6 + 12, matching the paper's 40 : 20 : 40 weighting) ================= */
  var TEST = [
    { m: 1, q: "If a : b = 3 : 4 and b : c = 2 : 5, what is a : c?", o: ["3 : 10", "3 : 5", "6 : 5", "15 : 8"], a: 0, e: "a/c = (a/b) × (b/c) = (3/4) × (2/5) = 6/20 = 3/10." },
    { m: 1, q: "What is the mean proportional between 9 and 16?", o: ["12", "12.5", "25", "144"], a: 0, e: "√(9 × 16) = √144 = 12." },
    { m: 1, q: "Given log 2 = 0.3010, what is log 8?", o: ["0.9030", "0.6020", "2.4080", "0.0903"], a: 0, e: "log 8 = log 2³ = 3 log 2 = 0.9030." },
    { m: 1, q: "Which quadratic equation has roots 2 and 5?", o: ["x² − 7x + 10 = 0", "x² + 7x + 10 = 0", "x² − 10x + 7 = 0", "x² − 3x − 10 = 0"], a: 0, e: "x² − (sum)x + product = x² − 7x + 10 = 0." },
    { m: 1, q: "Solve 2x + y = 8 and x − y = 1.", o: ["x = 3, y = 2", "x = 2, y = 4", "x = 4, y = 0", "x = 3, y = 1"], a: 0, e: "Adding the equations: 3x = 9, so x = 3 and y = 2." },
    { m: 1, q: "Solve −4x < 12.", o: ["x > −3", "x < −3", "x > 3", "x < 3"], a: 0, e: "Dividing by −4 reverses the sign: x > −3." },
    { m: 1, q: "₹10,000 is invested at 10% a year compounded annually. What is the amount after 2 years?", o: ["₹12,100", "₹12,000", "₹11,000", "₹12,210"], a: 0, e: "10,000 × 1.1² = ₹12,100." },
    { m: 1, q: "How many diagonals does a hexagon (6 sides) have?", o: ["9", "15", "6", "12"], a: 0, e: "Lines joining 2 of 6 vertices: ⁶C₂ = 15, minus the 6 sides = 9." },
    { m: 1, q: "In how many ways can the letters of LETTER be arranged?", o: ["180", "720", "360", "120"], a: 0, e: "6 letters with E twice and T twice: 6!/(2! 2!) = 720/4 = 180." },
    { m: 1, q: "What is the sum to infinity of 6 + 3 + 1.5 + …?", o: ["12", "10.5", "18", "Infinite"], a: 0, e: "a = 6, r = 1/2, so S∞ = 6/(1 − 1/2) = 12." },
    { m: 1, q: "A set has 4 elements. How many subsets does it have?", o: ["16", "8", "4", "15"], a: 0, e: "A set with n elements has 2ⁿ = 2⁴ = 16 subsets." },
    { m: 1, q: "If C(x) = x² + 10x + 50, what is the marginal cost at x = 5?", o: ["20", "125", "15", "35"], a: 0, e: "MC = dC/dx = 2x + 10 = 20 at x = 5." },
    { m: 2, q: "What comes next: 1, 4, 9, 16, 25, …?", o: ["36", "30", "35", "49"], a: 0, e: "These are the squares 1², 2², 3², 4², 5², so next is 6² = 36." },
    { m: 2, q: "If ROAD is written as SPBE in a code, how is PATH written?", o: ["QBUI", "OZSG", "QBTI", "RCVJ"], a: 0, e: "Each letter moves forward by one: P→Q, A→B, T→U, H→I." },
    { m: 2, q: "Which is the odd one out: 2, 3, 5, 9, 11?", o: ["9", "2", "5", "11"], a: 0, e: "All the others are prime numbers; 9 = 3 × 3." },
    { m: 2, q: "Ravi is facing South. He turns left. Which direction is he facing now?", o: ["East", "West", "North", "South"], a: 0, e: "Facing South, a left turn (90° anticlockwise) means East." },
    { m: 2, q: "Five people sit in a row facing North. Priya is 2nd from the left. What is her position from the right?", o: ["4th", "3rd", "2nd", "5th"], a: 0, e: "n − k + 1 = 5 − 2 + 1 = 4." },
    { m: 2, q: "Pointing to a boy, a woman says, “His mother is the only daughter of my mother.” How is the woman related to the boy?", o: ["Mother", "Aunt", "Sister", "Grandmother"], a: 0, e: "The only daughter of the woman's mother is the woman herself, so she is the boy's mother." },
    { m: 3, q: "Data collected first-hand by an investigator for a specific purpose are called…", o: ["Primary data", "Secondary data", "Census data", "Derived data"], a: 0, e: "Primary data are collected first-hand; secondary data were collected by someone else." },
    { m: 3, q: "The less-than and more-than ogives intersect at the…", o: ["Median", "Mean", "Mode", "Range"], a: 0, e: "Both curves reach N/2 at the median." },
    { m: 3, q: "What is the mean of 4, 8, 12, 16 and 20?", o: ["12", "10", "14", "60"], a: 0, e: "Sum 60 ÷ 5 = 12." },
    { m: 3, q: "Which average is most suitable for finding an average speed over equal distances?", o: ["Harmonic mean", "Arithmetic mean", "Geometric mean", "Mode"], a: 0, e: "Speeds are rates over equal distances, so the harmonic mean applies." },
    { m: 3, q: "The largest value in a data set is 40 and the smallest is 10. What is the coefficient of range?", o: ["0.6", "30", "0.75", "4"], a: 0, e: "(L − S)/(L + S) = 30/50 = 0.6." },
    { m: 3, q: "If 5 is added to every value in a data set, the standard deviation…", o: ["Does not change", "Increases by 5", "Increases by 25", "Becomes 5 times larger"], a: 0, e: "SD is unaffected by a change of origin." },
    { m: 3, q: "Two dice are thrown. What is the probability that the sum is 7?", o: ["1/6", "7/36", "1/12", "5/36"], a: 0, e: "6 favourable outcomes out of 36: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1)." },
    { m: 3, q: "P(A) = 0.6, P(B) = 0.5 and P(A ∩ B) = 0.3. What is P(A ∪ B)?", o: ["0.8", "1.1", "0.3", "0.9"], a: 0, e: "0.6 + 0.5 − 0.3 = 0.8." },
    { m: 3, q: "What is the variance of a binomial distribution with n = 10 and p = 0.5?", o: ["2.5", "5", "0.25", "1.58"], a: 0, e: "Variance = npq = 10 × 0.5 × 0.5 = 2.5." },
    { m: 3, q: "In a normal distribution, about what share of values lies within μ ± 2σ?", o: ["95.45%", "68.27%", "99.73%", "50%"], a: 0, e: "The 68–95–99.7 rule: about 95.45% within two standard deviations." },
    { m: 3, q: "For 5 pairs of ranks, Σd² = 10. What is Spearman's rank correlation?", o: ["0.5", "0.9", "−0.5", "0.6"], a: 0, e: "R = 1 − 6 × 10/[5(25 − 1)] = 1 − 60/120 = 0.5." },
    { m: 3, q: "A salary of ₹30,000 is paid when the consumer price index is 120 (base 100). What is the real salary?", o: ["₹25,000", "₹36,000", "₹30,000", "₹24,000"], a: 0, e: "Real value = 30,000 ÷ 120 × 100 = ₹25,000." }
  ];
  var PASS = 0.7;

  var GLOSSARY = [
    ["Ratio", "A comparison of two quantities of the same kind by division.", "₹600 : ₹900 = 2 : 3", "1.1"],
    ["Compound ratio", "The product of the corresponding terms of two or more ratios.", "2 : 3 and 3 : 4 → 6 : 12", "1.1"],
    ["Proportion", "An equality of two ratios; the product of extremes equals the product of means.", "2 : 3 = 4 : 6", "1.1"],
    ["Mean proportional", "The square root of the product of two numbers.", "Between 4 and 9: 6", "1.1"],
    ["Logarithm", "The power to which a base must be raised to give a number.", "log₂ 32 = 5", "1.1"],
    ["Discriminant", "b² − 4ac; decides the nature of a quadratic's roots.", "x² − 5x + 6: D = 1", "1.2"],
    ["Simultaneous equations", "Two or more equations solved together for common values.", "2x + 3y = 13, 3x − y = 3", "1.2"],
    ["Feasible region", "The set of points satisfying every constraint.", "x + 2y ≤ 40, 3x + 2y ≤ 60, x, y ≥ 0", "1.3"],
    ["Objective function", "The quantity to be maximised or minimised in linear programming.", "Z = 30x + 50y", "1.3"],
    ["Compound interest", "Interest earned on both the principal and earlier interest.", "A = P(1 + i)ⁿ", "1.4"],
    ["Effective rate", "The annual rate equivalent to a rate compounded more often.", "12% monthly ≈ 12.68%", "1.4"],
    ["Annuity", "A series of equal payments at equal intervals.", "An EMI or a monthly SIP", "1.4"],
    ["Perpetuity", "An annuity that continues forever; PV = A/i.", "₹6,000 a year at 12% → ₹50,000", "1.4"],
    ["Net present value (NPV)", "Present value of inflows minus present value of outflows.", "Accept a project if NPV > 0", "1.4"],
    ["CAGR", "The steady yearly growth rate between two values.", "(End/Start)^(1/n) − 1", "1.4"],
    ["Permutation", "An arrangement, where order matters.", "⁸P₃ = 336", "1.5"],
    ["Combination", "A selection, where order does not matter.", "⁸C₃ = 56", "1.5"],
    ["Factorial", "n! = n × (n − 1) × … × 1, with 0! = 1.", "5! = 120", "1.5"],
    ["Arithmetic progression (AP)", "A sequence with a constant difference between terms.", "4, 7, 10, 13", "1.6"],
    ["Geometric progression (GP)", "A sequence with a constant ratio between terms.", "3, 6, 12, 24", "1.6"],
    ["Power set", "The set of all subsets of a set; it has 2ⁿ elements.", "P({1, 2}) has 4 elements", "1.7"],
    ["Function", "A relation giving each input exactly one output.", "f(x) = 2x + 3", "1.7"],
    ["Equivalence relation", "A relation that is reflexive, symmetric and transitive.", "“Is equal to” on numbers", "1.7"],
    ["Limit", "The value f(x) approaches as x approaches a point.", "lim x→2 (x² − 4)/(x − 2) = 4", "1.7"],
    ["Derivative", "The rate of change of a function; the slope of its curve.", "d/dx (x³) = 3x²", "1.8"],
    ["Marginal cost", "The derivative of total cost: the cost of one more unit.", "C = 2x² + 20x + 800 → MC = 4x + 20", "1.8"],
    ["Integration", "The reverse of differentiation; finds totals from rates.", "∫2x dx = x² + C", "1.8"],
    ["Coding–decoding", "Turning words into codes by a rule, and back.", "FISH → GJTI (+1)", "2.1"],
    ["Odd man out", "The item that does not share the property of the others.", "144 among cubes", "2.1"],
    ["Cardinal directions", "North, East, South and West; plus NE, SE, SW and NW.", "Facing N, a right turn → E", "2.2"],
    ["Circular arrangement", "People seated round a table; facing the centre, left is clockwise.", "6 people: 5! = 120 ways", "2.3"],
    ["Family tree", "A diagram of relations by generation, gender and marriage.", "Grandfather → father → you", "2.4"],
    ["Primary data", "Data collected first-hand for the study.", "Your own survey", "3.1"],
    ["Frequency distribution", "A table showing how many values fall in each class.", "40–60: 7 students", "3.1"],
    ["Ogive", "A cumulative frequency curve; the two ogives cross at the median.", "Less-than ogive", "3.1"],
    ["Stratified sampling", "Dividing the population into similar groups and sampling each.", "Sampling students from each section", "3.1"],
    ["Arithmetic mean", "The sum of values divided by their number.", "(4 + 8 + 12)/3 = 8", "3.2"],
    ["Median", "The middle value of ordered data.", "3, 5, 8, 10, 12 → 8", "3.2"],
    ["Mode", "The most frequent value.", "2, 3, 3, 5 → 3", "3.2"],
    ["Harmonic mean", "n divided by the sum of reciprocals; used for average rates.", "40 and 60 km/h → 48", "3.2"],
    ["Standard deviation", "The square root of the mean squared deviation from the mean.", "10, 12, 14, 16, 18 → 2.83", "3.3"],
    ["Coefficient of variation", "SD as a percentage of the mean; lower means more consistent.", "σ = 10, x̄ = 50 → 20%", "3.3"],
    ["Quartile deviation", "Half the interquartile range: (Q₃ − Q₁)/2.", "Q₁ = 20, Q₃ = 40 → 10", "3.3"],
    ["Mutually exclusive events", "Events that cannot happen together.", "Getting 2 and 5 on one throw", "3.4"],
    ["Independent events", "Events where one does not change the probability of the other.", "Two separate coin tosses", "3.4"],
    ["Expected value", "The long-run average of a random variable: Σx·p.", "₹30 in the example game", "3.4"],
    ["Binomial distribution", "Number of successes in n independent yes/no trials.", "Defectives in a sample of 5", "3.5"],
    ["Poisson distribution", "Counts of rare events; mean = variance = m.", "Typing errors per page", "3.5"],
    ["Normal distribution", "A continuous, symmetric, bell-shaped distribution.", "Marks with μ = 60, σ = 10", "3.5"],
    ["Correlation coefficient (r)", "A measure of linear association between −1 and +1.", "r ≈ 0.98 for ads and sales", "3.6"],
    ["Regression line", "The line used to estimate one variable from another.", "y − 9 = 1.367(x − 5)", "3.6"],
    ["Index number", "A measure of relative change from a base period (= 100).", "CPI = 150", "3.7"],
    ["Fisher's ideal index", "The geometric mean of Laspeyres and Paasche indices.", "√(123.28 × 122.77)", "3.7"],
    ["Deflating", "Converting money values into real values with a price index.", "₹60,000 at CPI 150 → ₹40,000", "3.7"]
  ];

  /* spread quick-check answers across positions (the final test is shuffled per attempt) */
  (function () { var T = [1, 0, 2, 3, 2, 1, 0, 3, 3, 1, 2, 0, 1, 3]; var k = 0; LESSONS.forEach(function (l) { l.qc.forEach(function (q) { var t = T[k++ % T.length], a = q.a, o = q.o[a]; q.o[a] = q.o[t]; q.o[t] = o; q.a = t; }); }); })();

  /* ================= TRY-IT TOOLS (all run in the browser; nothing is sent anywhere) ================= */
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

  /* ---------- 1.1 ratio, proportion, logs ---------- */
  function simpRatio(a, b) {
    var k = 1; while ((Math.abs(a * k - Math.round(a * k)) > 1e-9 || Math.abs(b * k - Math.round(b * k)) > 1e-9) && k < 1e6) k *= 10;
    var x = Math.round(a * k), y = Math.round(b * k), g = gcd(x, y) || 1;
    return (x / g) + " : " + (y / g);
  }
  function rootStr(v) { var r = Math.sqrt(v); return Math.abs(r - Math.round(r)) < 1e-9 ? String(Math.round(r)) : "√" + fmt(v, 4); }
  function runRatio() {
    var a = n("r_a"), b = n("r_b"), c = n("r_c"), d = n("r_d"), h = "";
    if (![a, b, c, d].every(function (x) { return fin(x) && x > 0; })) return err("Enter four positive numbers for the two ratios.");
    h += sub("Ratio a : b = " + fmt(a, 4) + " : " + fmt(b, 4)) + kv([["Simplest form", simpRatio(a, b)], ["Inverse", simpRatio(b, a)], ["Duplicate", simpRatio(a * a, b * b)], ["Sub-duplicate", rootStr(a) + " : " + rootStr(b)], ["Triplicate", simpRatio(a * a * a, b * b * b)]]);
    h += sub("Combining with c : d = " + fmt(c, 4) + " : " + fmt(d, 4)) + kv([["Compound ratio (ac : bd)", simpRatio(a * c, b * d)], ["Continued ratio, if b and c are the same quantity", (function () { var A = a * c, B = b * c, C = b * d, k = 1; while ([A, B, C].some(function (x) { return Math.abs(x * k - Math.round(x * k)) > 1e-9; }) && k < 1e6) k *= 10; A = Math.round(A * k); B = Math.round(B * k); C = Math.round(C * k); var g = gcd(gcd(A, B), C) || 1; return A / g + " : " + B / g + " : " + C / g; })()], ["Do they form a proportion?", Math.abs(a * d - b * c) < 1e-9 ? "Yes, ad = bc = " + fmt(a * d, 4) : "No (ad = " + fmt(a * d, 4) + ", bc = " + fmt(b * c, 4) + ")"]]);
    h += kv([["Mean proportional of a and b", fmt(Math.sqrt(a * b), 4)], ["Third proportional to a and b", fmt(b * b / a, 4)], ["Fourth proportional to a, b, c", fmt(b * c / a, 4)]]);
    var amt = n("r_amt"), parts = nums(val("r_parts").replace(/:/g, " "));
    if (fin(amt) && parts.length >= 2 && parts.every(function (p) { return fin(p) && p > 0; })) {
      var tot = parts.reduce(function (s, p) { return s + p; }, 0);
      h += sub("Share " + inr(amt) + " in the ratio " + parts.join(" : ")) + kv(parts.map(function (p, i) { return ["Part " + (i + 1), inr(amt * p / tot)]; }));
    }
    var base = n("r_base"), x = n("r_x");
    if (fin(base) && fin(x)) {
      if (base <= 0 || base === 1 || x <= 0) h += err("For logarithms the base must be positive and not 1, and the number must be positive.");
      else { var y = Math.log(x) / Math.log(base); h += sub("Logarithm") + kv([["log" + "<sub>" + fmt(base, 4) + "</sub> " + fmt(x, 6), fmt(y, 6)], ["Check", fmt(base, 4) + "<sup>" + fmt(y, 4) + "</sup> = " + fmt(Math.pow(base, y), 6)], ["log₁₀ " + fmt(x, 6), fmt(Math.log10(x), 6)], ["ln " + fmt(x, 6), fmt(Math.log(x), 6)]]); }
    }
    return h;
  }

  /* ---------- 1.2 equations ---------- */
  function runEquation() {
    var a = n("q_a"), b = n("q_b"), c = n("q_c"), h = "";
    if (![a, b, c].every(fin)) h += err("Enter numbers for a, b and c.");
    else if (a === 0) h += err("a cannot be 0 in a quadratic. With a = 0 the equation is linear: x = " + (b !== 0 ? fmt(-c / b, 4) : "no unique solution") + ".");
    else {
      var D = b * b - 4 * a * c, rows = [["Discriminant D = b² − 4ac", fmt(D, 4)], ["Sum of roots −b/a", fmt(-b / a, 4)], ["Product of roots c/a", fmt(c / a, 4)]], nat;
      if (D > 1e-12) { var s = Math.sqrt(D), r1 = (-b + s) / (2 * a), r2 = (-b - s) / (2 * a); var perfect = Math.abs(s - Math.round(s)) < 1e-9 && [a, b, c].every(Number.isInteger); nat = "Real and unequal" + (perfect ? ", rational" : (([a, b, c].every(Number.isInteger)) ? ", irrational" : "")); rows.push(["Roots", fmt(r1, 4) + " and " + fmt(r2, 4)]); }
      else if (Math.abs(D) <= 1e-12) { nat = "Real and equal"; rows.push(["Roots", fmt(-b / (2 * a), 4) + " (twice)"]); }
      else { nat = "Not real (complex)"; rows.push(["Roots", fmt(-b / (2 * a), 4) + " ± " + fmt(Math.sqrt(-D) / (2 * Math.abs(a)), 4) + "i"]); }
      rows.splice(1, 0, ["Nature of roots", nat]);
      h += sub("Quadratic: " + fmt(a, 4) + "x² " + (b < 0 ? "− " : "+ ") + fmt(Math.abs(b), 4) + "x " + (c < 0 ? "− " : "+ ") + fmt(Math.abs(c), 4) + " = 0") + kv(rows);
    }
    var a1 = n("s_a1"), b1 = n("s_b1"), c1 = n("s_c1"), a2 = n("s_a2"), b2 = n("s_b2"), c2 = n("s_c2");
    if ([a1, b1, c1, a2, b2, c2].every(fin)) {
      var det = a1 * b2 - a2 * b1;
      h += sub("Simultaneous: " + fmt(a1, 4) + "x + " + fmt(b1, 4) + "y = " + fmt(c1, 4) + " and " + fmt(a2, 4) + "x + " + fmt(b2, 4) + "y = " + fmt(c2, 4));
      if (Math.abs(det) < 1e-12) h += kv([["a₁b₂ − a₂b₁", "0"], ["Result", Math.abs(a1 * c2 - a2 * c1) < 1e-12 && Math.abs(c1 * b2 - c2 * b1) < 1e-12 ? "Same line: infinitely many solutions" : "Parallel lines: no solution"]]);
      else { var X = (c1 * b2 - c2 * b1) / det, Y = (a1 * c2 - a2 * c1) / det; h += kv([["a₁b₂ − a₂b₁", fmt(det, 4)], ["x", fmt(X, 4)], ["y", fmt(Y, 4)], ["Check eq. 1", fmt(a1 * X + b1 * Y, 4) + " = " + fmt(c1, 4)], ["Check eq. 2", fmt(a2 * X + b2 * Y, 4) + " = " + fmt(c2, 4)]]); }
    } else h += err("Enter all six numbers for the simultaneous equations.");
    return h;
  }

  /* ---------- 1.3 linear programming (corner points) ---------- */
  function parseLin(s) {
    s = s.replace(/\s+/g, "").replace(/−/g, "-").replace(/≤/g, "<=").replace(/≥/g, ">=").replace(/\*/g, "").toLowerCase();
    var m = s.match(/^(.*?)(<=|>=|=<|=>|<|>|=)(.*)$/); if (!m) return null;
    var op = m[2].indexOf("<") >= 0 ? "<=" : (m[2].indexOf(">") >= 0 ? ">=" : "=");
    function side(t) {
      var o = { x: 0, y: 0, k: 0 }; if (t === "") return null;
      var terms = t.replace(/-/g, "+-").split("+").filter(function (z) { return z !== ""; });
      for (var i = 0; i < terms.length; i++) {
        var z = terms[i], mm = z.match(/^(-?\d*\.?\d*)([xy]?)$/); if (!mm) return null;
        var co = mm[1] === "" ? 1 : (mm[1] === "-" ? -1 : Number(mm[1])); if (!isFinite(co)) return null;
        if (mm[2]) o[mm[2]] += co; else { if (mm[1] === "" || mm[1] === "-") return null; o.k += co; }
      }
      return o;
    }
    var L = side(m[1]), R = side(m[3]); if (!L || !R) return null;
    return { a: L.x - R.x, b: L.y - R.y, c: R.k - L.k, op: op, txt: m[1] + " " + (op === "<=" ? "≤" : op === ">=" ? "≥" : "=") + " " + m[3] };
  }
  function lpCorners(cons) {
    var lines = cons.map(function (c) { return [c.a, c.b, c.c]; }), pts = [];
    for (var i = 0; i < lines.length; i++) for (var j = i + 1; j < lines.length; j++) {
      var p = lines[i], q = lines[j], det = p[0] * q[1] - q[0] * p[1]; if (Math.abs(det) < 1e-12) continue;
      var x = (p[2] * q[1] - q[2] * p[1]) / det, y = (p[0] * q[2] - q[0] * p[2]) / det;
      if (cons.every(function (c) { var v = c.a * x + c.b * y; return c.op === "<=" ? v <= c.c + 1e-7 : c.op === ">=" ? v >= c.c - 1e-7 : Math.abs(v - c.c) < 1e-7; }) &&
        !pts.some(function (t) { return Math.abs(t[0] - x) < 1e-7 && Math.abs(t[1] - y) < 1e-7; })) pts.push([Math.abs(x) < 1e-10 ? 0 : x, Math.abs(y) < 1e-10 ? 0 : y]);
    }
    return pts;
  }
  function runLp() {
    var lines = val("lp_c").split(/\n+/).map(function (s) { return s.trim(); }).filter(Boolean);
    if (!lines.length) return err("Enter at least one constraint, e.g. x + 2y <= 40.");
    if (lines.length > 8) return err("Please use 8 constraints or fewer.");
    var cons = [], bad = [];
    lines.forEach(function (l) { var c = parseLin(l); if (!c || (c.a === 0 && c.b === 0)) bad.push(l); else cons.push(c); });
    if (bad.length) return err("I could not read: " + bad.map(esc).join("; ") + ". Use the form 3x + 2y <= 60.");
    var obj = val("lp_z").replace(/\s+/g, "").replace(/−/g, "-").toLowerCase().replace(/^z=/, ""), oz = parseLin(obj + "=0");
    if (!oz) return err("Write the objective like 30x + 50y.");
    var zx = oz.a, zy = oz.b, goal = val("lp_goal");
    var base = cons.concat([{ a: 1, b: 0, c: 0, op: ">=" }, { a: 0, b: 1, c: 0, op: ">=" }]);
    var M = 1e6, pts = lpCorners(base.concat([{ a: 1, b: 0, c: M, op: "<=" }, { a: 0, b: 1, c: M, op: "<=" }]));
    if (!pts.length) return err("No point satisfies all the constraints together (the feasible region is empty).");
    var real = pts.filter(function (p) { return p[0] < M - 1 && p[1] < M - 1; });
    var Z = function (p) { return zx * p[0] + zy * p[1]; };
    var best = pts.reduce(function (bp, p) { return (goal === "max" ? Z(p) > Z(bp) + 1e-9 : Z(p) < Z(bp) - 1e-9) ? p : bp; }, pts[0]);
    var unbounded = best[0] >= M - 1 || best[1] >= M - 1;
    var bestZ = unbounded ? null : Z(best), ties = real.filter(function (p) { return bestZ !== null && Math.abs(Z(p) - bestZ) < 1e-7; });
    var h = '<div class="tscroll"><table><tr><th>Corner point (x, y)</th><th>Z = ' + esc(val("lp_z")) + "</th></tr>" + real.map(function (p) { var hit = ties.some(function (t) { return t === p; }); return "<tr" + (hit ? ' style="background:var(--sun)"' : "") + "><td>(" + fmt(p[0], 3) + ", " + fmt(p[1], 3) + ")</td><td>" + fmt(Z(p), 3) + (hit ? " ← " + (goal === "max" ? "maximum" : "minimum") : "") + "</td></tr>"; }).join("") + "</table></div>";
    if (unbounded) h += '<p class="err">The feasible region is unbounded in the direction that improves Z, so there is no finite ' + (goal === "max" ? "maximum" : "minimum") + ".</p>";
    else h += kv([[(goal === "max" ? "Maximum" : "Minimum") + " Z", fmt(bestZ, 3)], ["At", ties.map(function (p) { return "(" + fmt(p[0], 3) + ", " + fmt(p[1], 3) + ")"; }).join(" and ") + (ties.length > 1 ? " (and every point on the edge between them)" : "")]]);
    /* plot */
    var ext = 1; real.forEach(function (p) { ext = Math.max(ext, p[0], p[1]); });
    cons.forEach(function (c) { if (c.a > 0 && c.c > 0) ext = Math.max(ext, c.c / c.a); if (c.b > 0 && c.c > 0) ext = Math.max(ext, c.c / c.b); });
    ext = Math.min(ext * 1.15, 1e5);
    var view = lpCorners(base.concat([{ a: 1, b: 0, c: ext, op: "<=" }, { a: 0, b: 1, c: ext, op: "<=" }]));
    var W = 420, H = 320, P = 40, sx = function (x) { return P + (W - P - 12) * x / ext; }, sy = function (y) { return H - P - (H - P - 12) * y / ext; };
    var s = '<line x1="' + P + '" y1="' + (H - P) + '" x2="' + (W - 6) + '" y2="' + (H - P) + '" style="stroke:var(--ink)"/><line x1="' + P + '" y1="' + (H - P) + '" x2="' + P + '" y2="6" style="stroke:var(--ink)"/><text x="' + (W - 8) + '" y="' + (H - P - 6) + '" class="ax" text-anchor="end" style="font-weight:700">x</text><text x="' + (P + 6) + '" y="14" class="ax" style="font-weight:700">y</text>';
    for (var k = 1; k <= 4; k++) { var t = ext * k / 4; s += '<text x="' + sx(t) + '" y="' + (H - P + 14) + '" text-anchor="middle" class="ax">' + fmt(t, 1) + '</text><text x="' + (P - 4) + '" y="' + (sy(t) + 4) + '" text-anchor="end" class="ax">' + fmt(t, 1) + "</text>"; }
    if (view.length >= 3) {
      var cx = 0, cy = 0; view.forEach(function (p) { cx += p[0]; cy += p[1]; }); cx /= view.length; cy /= view.length;
      view.sort(function (p, q) { return Math.atan2(p[1] - cy, p[0] - cx) - Math.atan2(q[1] - cy, q[0] - cx); });
      s += '<polygon points="' + view.map(function (p) { return sx(p[0]) + "," + sy(p[1]); }).join(" ") + '" style="fill:var(--accent);fill-opacity:.16;stroke:none"/>';
    }
    cons.forEach(function (c, i) {
      var seg = [];
      [[0, null], [ext, null], [null, 0], [null, ext]].forEach(function (e) { var x, y; if (e[0] !== null) { if (Math.abs(c.b) < 1e-12) return; x = e[0]; y = (c.c - c.a * x) / c.b; } else { if (Math.abs(c.a) < 1e-12) return; y = e[1]; x = (c.c - c.b * y) / c.a; } if (x >= -1e-9 && x <= ext + 1e-9 && y >= -1e-9 && y <= ext + 1e-9) seg.push([x, y]); });
      if (seg.length >= 2) s += '<line x1="' + sx(seg[0][0]) + '" y1="' + sy(seg[0][1]) + '" x2="' + sx(seg[1][0]) + '" y2="' + sy(seg[1][1]) + '" style="stroke:' + ["#4F46E5", "#DB2777", "#0891B2", "#CA8A04", "#16A34A", "#9333EA", "#EA580C", "#475569"][i % 8] + ';stroke-width:2"><title>' + esc(c.txt) + "</title></line>";
    });
    real.forEach(function (p) { var hit = ties.indexOf(p) >= 0; s += '<circle cx="' + sx(p[0]) + '" cy="' + sy(p[1]) + '" r="' + (hit ? 6 : 4) + '" style="fill:' + (hit ? "var(--sun-strong)" : "var(--ink)") + ';stroke:#fff;stroke-width:1.5"><title>(' + fmt(p[0], 3) + ", " + fmt(p[1], 3) + ")</title></circle>"; });
    h += '<div style="max-width:440px">' + svgWrap(W, H, "Feasible region and corner points", s) + "</div>" + note("Shaded: the feasible region (with x, y ≥ 0). Coloured lines: your constraints. Yellow dot: the best corner.");
    return h;
  }

  /* ---------- 1.4 mathematics of finance ---------- */
  var FIN_MODES = [["ci", "Compound interest and effective rate"], ["annuity", "Annuity: future and present value"], ["emi", "Loan EMI"], ["sinking", "Sinking fund instalment"], ["perp", "Perpetuity"], ["dep", "Depreciation (reducing balance)"], ["npv", "Net present value (NPV)"], ["cagr", "CAGR"]];
  function finInputs(m) {
    if (m === "ci") return g2(inp("f_p", "50000", "Principal P (₹)"), inp("f_r", "8", "Rate % a year")) + g2(inp("f_t", "2", "Years"), sel("f_k", [["1", "Yearly"], ["2", "Half-yearly"], ["4", "Quarterly"], ["12", "Monthly"]], "4", "Compounded"));
    if (m === "annuity") return g2(inp("f_a", "10000", "Payment per period (₹)"), inp("f_r", "8", "Rate % a year")) + g3(inp("f_t", "5", "Years"), sel("f_k", [["1", "Yearly"], ["2", "Half-yearly"], ["4", "Quarterly"], ["12", "Monthly"]], "1", "Payments"), sel("f_type", [["ord", "At the end (ordinary)"], ["due", "At the start (annuity due)"]], "ord", "Payment timing"));
    if (m === "emi") return g3(inp("f_p", "500000", "Loan amount (₹)"), inp("f_r", "9", "Rate % a year"), inp("f_t", "5", "Years (monthly payments)"));
    if (m === "sinking") return g2(inp("f_a", "1000000", "Target amount (₹)"), inp("f_r", "8", "Rate % a year")) + g2(inp("f_t", "5", "Years"), sel("f_k", [["1", "Yearly"], ["2", "Half-yearly"], ["4", "Quarterly"], ["12", "Monthly"]], "1", "Instalments"));
    if (m === "perp") return g2(inp("f_a", "6000", "Payment per period (₹)"), inp("f_r", "12", "Rate % per period"));
    if (m === "dep") return g3(inp("f_p", "200000", "Cost (₹)"), inp("f_r", "10", "Depreciation % a year"), inp("f_t", "3", "Years"));
    if (m === "npv") return g2(inp("f_r", "10", "Discount rate % a year"), inp("f_cf", "-100000, 30000, 40000, 50000, 20000", "Cash flows, year 0 first (outflows negative)", "", "text"));
    return g3(inp("f_s", "100000", "Starting value"), inp("f_e", "161051", "Ending value"), inp("f_t", "5", "Years"));
  }
  var finShown = "";
  function runFinance() {
    var m = val("f_mode");
    if (m !== finShown) { document.getElementById("f_in").innerHTML = finInputs(m); finShown = m; }
    var P = n("f_p"), A = n("f_a"), R = n("f_r"), t = n("f_t"), k = Number(val("f_k") || 1);
    if (m === "ci") {
      if (![P, R, t].every(fin) || P <= 0 || t <= 0) return err("Enter a positive principal, rate and number of years.");
      var i = R / (100 * k), N = k * t, amt = P * Math.pow(1 + i, N), si = P * R * t / 100;
      return kv([["Rate per period i", fmt(i * 100, 4) + "%"], ["Number of periods n", fmt(N, 2)], ["Amount A = P(1 + i)ⁿ", inr(amt)], ["Compound interest", inr(amt - P)], ["Simple interest (for comparison)", inr(si)], ["Effective annual rate", fmt((Math.pow(1 + i, k) - 1) * 100, 4) + "%"]]);
    }
    if (m === "annuity") {
      if (![A, R, t].every(fin) || A <= 0 || R <= 0 || t <= 0) return err("Enter a positive payment, rate and number of years.");
      var i2 = R / (100 * k), N2 = Math.round(k * t), due = val("f_type") === "due" ? 1 + i2 : 1;
      var fv = A * (Math.pow(1 + i2, N2) - 1) / i2 * due, pv = A * (1 - Math.pow(1 + i2, -N2)) / i2 * due;
      return kv([["i per period", fmt(i2 * 100, 4) + "%"], ["Payments n", N2], ["Future value", inr(fv)], ["Present value", inr(pv)], ["Total paid in", inr(A * N2)]]) + note(due > 1 ? "Annuity due: both values are the ordinary-annuity values × (1 + i)." : "Ordinary annuity: payments at the end of each period.");
    }
    if (m === "emi") {
      if (![P, R, t].every(fin) || P <= 0 || R <= 0 || t <= 0) return err("Enter a positive loan amount, rate and number of years.");
      var i3 = R / 1200, N3 = Math.round(t * 12), f = Math.pow(1 + i3, N3), emi = P * i3 * f / (f - 1);
      return kv([["Monthly rate i", fmt(i3 * 100, 4) + "%"], ["Number of EMIs", N3], ["EMI", inr(emi)], ["Total repaid", inr(emi * N3)], ["Total interest", inr(emi * N3 - P)], ["First EMI: interest / principal", inr(P * i3) + " / " + inr(emi - P * i3)]]);
    }
    if (m === "sinking") {
      if (![A, R, t].every(fin) || A <= 0 || R <= 0 || t <= 0) return err("Enter a positive target, rate and number of years.");
      var i4 = R / (100 * k), N4 = Math.round(k * t), ins = A * i4 / (Math.pow(1 + i4, N4) - 1);
      return kv([["Instalment (end of each period)", inr(ins)], ["Number of instalments", N4], ["Total deposited", inr(ins * N4)], ["Interest earned", inr(A - ins * N4)]]);
    }
    if (m === "perp") {
      if (![A, R].every(fin) || A <= 0 || R <= 0) return err("Enter a positive payment and rate.");
      return kv([["Present value = A ÷ i", inr(A / (R / 100))], ["Perpetuity due (first payment today)", inr(A / (R / 100) + A)]]);
    }
    if (m === "dep") {
      if (![P, R, t].every(fin) || P <= 0 || R < 0 || R >= 100 || t <= 0) return err("Enter a positive cost, a rate below 100% and the number of years.");
      var rows = "", v = P; for (var y = 1; y <= Math.min(t, 30); y++) { var dd = v * R / 100; rows += "<tr><td>" + y + "</td><td>" + inr(v) + "</td><td>" + inr(dd) + "</td><td>" + inr(v - dd) + "</td></tr>"; v -= dd; }
      return kv([["Value after " + fmt(t, 2) + " years = P(1 − r)ⁿ", inr(P * Math.pow(1 - R / 100, t))], ["Total depreciation", inr(P - P * Math.pow(1 - R / 100, t))]]) + '<div class="tscroll"><table><tr><th>Year</th><th>Opening value</th><th>Depreciation</th><th>Closing value</th></tr>' + rows + "</table></div>";
    }
    if (m === "npv") {
      var cf = nums(val("f_cf"));
      if (!fin(R) || cf.length < 2 || !cf.every(fin)) return err("Enter a rate and at least two cash flows, year 0 first.");
      var tot = 0, rr = "";
      cf.forEach(function (c, y) { var pvf = Math.pow(1 + R / 100, -y), pvv = c * pvf; tot += pvv; rr += "<tr><td>" + y + "</td><td>" + inr(c) + "</td><td>" + fmt(pvf, 4) + "</td><td>" + inr(pvv) + "</td></tr>"; });
      return '<div class="tscroll"><table><tr><th>Year</th><th>Cash flow</th><th>Discount factor</th><th>Present value</th></tr>' + rr + "</table></div>" + kv([["NPV", inr(tot)], ["Decision", tot > 0 ? "Accept (NPV > 0)" : tot < 0 ? "Reject (NPV < 0)" : "Indifferent (NPV = 0)"]]);
    }
    var S = n("f_s"), E = n("f_e");
    if (![S, E, t].every(fin) || S <= 0 || E <= 0 || t <= 0) return err("Enter positive starting and ending values and years.");
    return kv([["CAGR = (End/Start)^(1/n) − 1", fmt((Math.pow(E / S, 1 / t) - 1) * 100, 4) + "%"], ["Total growth", fmt((E / S - 1) * 100, 2) + "%"]]);
  }

  /* ---------- 1.5 permutations and combinations ---------- */
  function bfact(k) { var r = 1n; for (var i = 2n; i <= BigInt(k); i++) r *= i; return r; }
  function big(x) { var s = x.toString(); return s.length > 24 ? s.slice(0, 1) + "." + s.slice(1, 6) + " × 10" + sup(s.length - 1) : BigInt(s).toLocaleString("en-IN"); }
  function runPnc() {
    var N = n("p_n"), r = n("p_r"), h = "";
    if (!(Number.isInteger(N) && Number.isInteger(r) && N >= 0 && r >= 0 && N <= 200)) h += err("Enter whole numbers with 0 ≤ n ≤ 200 and r ≥ 0.");
    else if (r > N) h += err("r cannot be more than n for ⁿPᵣ and ⁿCᵣ (choose r ≤ n).") + kv([["n" + sup("r") + " (with repetition)", big(BigInt(N) ** BigInt(r))]]);
    else {
      var nP = bfact(N) / bfact(N - r), nC = nP / bfact(r);
      h += kv([["n!", big(bfact(N))], ["ⁿPᵣ = n!/(n − r)!", big(nP)], ["ⁿCᵣ = n!/[r!(n − r)!]", big(nC)], ["Arrangements with repetition nʳ", big(BigInt(N) ** BigInt(r))], ["Round a table (n − 1)!", N >= 1 ? big(bfact(N - 1)) : "—"], ["Necklace / garland (n − 1)!/2", N >= 3 ? big(bfact(N - 1) / 2n) : "—"], ["Choose at least one: 2ⁿ − 1", big(2n ** BigInt(N) - 1n)]]) +
        note("Check: ⁿCᵣ = ⁿCₙ₋ᵣ, and ⁿPᵣ = r! × ⁿCᵣ = " + big(bfact(r)) + " × " + big(nC) + ".");
    }
    var w = val("p_word").toUpperCase().replace(/[^A-Z]/g, "");
    if (w) {
      if (w.length > 30) return h + err("Please use a word of 30 letters or fewer.");
      var cnt = {}; w.split("").forEach(function (ch) { cnt[ch] = (cnt[ch] || 0) + 1; });
      var rep = Object.keys(cnt).filter(function (ch) { return cnt[ch] > 1; }), den = rep.reduce(function (d, ch) { return d * bfact(cnt[ch]); }, 1n);
      h += sub("Arranging the letters of " + esc(w)) + kv([["Letters", w.length], ["Repeated", rep.length ? rep.map(function (ch) { return ch + " × " + cnt[ch]; }).join(", ") : "none"], ["Arrangements", w.length + "!" + (rep.length ? " / (" + rep.map(function (ch) { return cnt[ch] + "!"; }).join(" ") + ")" : "") + " = " + big(bfact(w.length) / den)]]);
    }
    return h;
  }

  /* ---------- 1.6 AP and GP ---------- */
  function runSeries() {
    var type = val("g_type"), a = n("g_a"), d = n("g_d"), N = n("g_n"), h = "";
    if (![a, d].every(fin) || !(Number.isInteger(N) && N >= 1 && N <= 10000)) h += err("Enter the first term, the " + (type === "ap" ? "common difference" : "common ratio") + " and a whole number of terms (1 to 10,000).");
    else {
      var terms = [], i;
      for (i = 0; i < Math.min(N, 10); i++) terms.push(type === "ap" ? a + i * d : a * Math.pow(d, i));
      var tn = type === "ap" ? a + (N - 1) * d : a * Math.pow(d, N - 1);
      var sn = type === "ap" ? N / 2 * (2 * a + (N - 1) * d) : (d === 1 ? a * N : a * (Math.pow(d, N) - 1) / (d - 1));
      h += chips(terms.map(function (x) { return fmt(x, 4); }).concat(N > 10 ? ["…"] : []), "ac");
      var rows = [["t" + "<sub>" + N + "</sub>", fmt(tn, 4)], ["S" + "<sub>" + N + "</sub>", fmt(sn, 4)]];
      if (type === "gp") rows.push(["Sum to infinity", Math.abs(d) < 1 ? fmt(a / (1 - d), 4) : "Does not exist (|r| ≥ 1)"]);
      h += kv(rows) + note(type === "ap" ? "tₙ = a + (n − 1)d and Sₙ = n/2 [2a + (n − 1)d]." : "tₙ = arⁿ⁻¹ and Sₙ = a(rⁿ − 1)/(r − 1); S∞ = a/(1 − r) when |r| < 1.");
    }
    var p = n("g_p"), q = n("g_q");
    if ([p, q].every(fin)) {
      var am = (p + q) / 2, rows2 = [["AM", fmt(am, 4)]];
      if (p > 0 && q > 0) { var gm = Math.sqrt(p * q), hm = 2 * p * q / (p + q); rows2.push(["GM", fmt(gm, 4)], ["HM", fmt(hm, 4)], ["AM ≥ GM ≥ HM", am + 1e-12 >= gm && gm + 1e-12 >= hm ? "✓" : "✗"], ["GM² = AM × HM", fmt(gm * gm, 4) + " = " + fmt(am * hm, 4)]); }
      h += sub("Means of " + fmt(p, 4) + " and " + fmt(q, 4)) + kv(rows2);
    }
    var M = n("g_m");
    if (Number.isInteger(M) && M >= 1 && M <= 1e6) h += sub("Standard sums up to " + M) + kv([["Σn", (M * (M + 1) / 2).toLocaleString("en-IN")], ["Σn²", (M * (M + 1) * (2 * M + 1) / 6).toLocaleString("en-IN")], ["Σn³", Math.pow(M * (M + 1) / 2, 2).toLocaleString("en-IN")]]);
    return h;
  }

  /* ---------- 1.7 sets ---------- */
  function setOf(s) { var seen = {}, out = []; String(s).split(/[,;\n]+/).map(function (x) { return x.trim(); }).filter(Boolean).forEach(function (x) { if (!seen[x]) { seen[x] = 1; out.push(x); } }); return out; }
  function showSet(a) { return a.length ? "{" + a.map(esc).join(", ") + "}" : "∅"; }
  function runSets() {
    var U = setOf(val("t_u")), A = setOf(val("t_a")), B = setOf(val("t_b"));
    var inA = function (x) { return A.indexOf(x) >= 0; }, inB = function (x) { return B.indexOf(x) >= 0; };
    var uni = A.concat(B.filter(function (x) { return !inA(x); })), inter = A.filter(inB), aMb = A.filter(function (x) { return !inB(x); }), bMa = B.filter(function (x) { return !inA(x); });
    var h = kv([["A ∪ B", showSet(uni)], ["A ∩ B", showSet(inter)], ["A − B", showSet(aMb)], ["B − A", showSet(bMa)], ["Symmetric difference", showSet(aMb.concat(bMa))]]);
    h += kv([["n(A)", A.length], ["n(B)", B.length], ["n(A ∪ B) = n(A) + n(B) − n(A ∩ B)", A.length + " + " + B.length + " − " + inter.length + " = " + uni.length], ["Subsets of A (2ⁿ)", Math.pow(2, A.length).toLocaleString("en-IN")], ["n(A × B)", A.length * B.length], ["Relations from A to B", "2" + sup(A.length * B.length)]]);
    if (U.length) {
      var outside = A.concat(B).filter(function (x) { return U.indexOf(x) < 0; });
      if (outside.length) h += err("These elements are not in U: " + outside.map(esc).join(", "));
      else {
        var Ac = U.filter(function (x) { return !inA(x); }), Bc = U.filter(function (x) { return !inB(x); }), uc = U.filter(function (x) { return uni.indexOf(x) < 0; }), dm = Ac.filter(function (x) { return Bc.indexOf(x) >= 0; });
        h += kv([["A′", showSet(Ac)], ["B′", showSet(Bc)], ["(A ∪ B)′", showSet(uc)], ["A′ ∩ B′", showSet(dm)], ["De Morgan holds?", uc.length === dm.length ? "Yes ✓" : "No"]]);
      }
    }
    if (A.length * B.length && A.length * B.length <= 24) h += note("A × B = {" + A.map(function (x) { return B.map(function (y) { return "(" + esc(x) + ", " + esc(y) + ")"; }).join(", "); }).join(", ") + "}");
    var nU = U.length ? U.length - uni.length : null;
    var s = '<rect x="4" y="4" width="352" height="192" rx="12" style="fill:none;stroke:var(--border);stroke-width:2"/><text x="16" y="26" class="ax">U' + (nU !== null ? " · outside both: " + nU : "") + '</text>' +
      '<circle cx="140" cy="108" r="72" style="fill:var(--accent);fill-opacity:.15;stroke:var(--accent);stroke-width:2"/><circle cx="220" cy="108" r="72" style="fill:#DB2777;fill-opacity:.12;stroke:#DB2777;stroke-width:2"/>' +
      '<text x="96" y="58" class="ax" style="font-weight:700">A</text><text x="258" y="58" class="ax" style="font-weight:700">B</text>' +
      '<text x="108" y="116" text-anchor="middle" class="vn">' + aMb.length + '</text><text x="180" y="116" text-anchor="middle" class="vn">' + inter.length + '</text><text x="252" y="116" text-anchor="middle" class="vn">' + bMa.length + "</text>";
    return h + '<div style="max-width:380px">' + svgWrap(360, 200, "Venn diagram with counts", s) + "</div>";
  }

  /* ---------- 1.8 calculus with polynomials ---------- */
  var SUPIN = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9" };
  function parsePoly(s) {
    s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, function (m) { return "^" + m.split("").map(function (c) { return SUPIN[c]; }).join(""); }).replace(/\s+/g, "").replace(/−/g, "-").replace(/\*/g, "").replace(/·/g, "").toLowerCase();
    if (!s) return null;
    var terms = s.replace(/-/g, "+-").split("+").filter(function (t) { return t !== ""; }), c = {};
    for (var i = 0; i < terms.length; i++) {
      var m = terms[i].match(/^(-?\d*\.?\d*)(x(\^(\d+))?)?$/); if (!m || (m[1] === "" && !m[2]) || (m[1] === "-" && !m[2])) return null;
      var co = m[1] === "" ? 1 : m[1] === "-" ? -1 : Number(m[1]), p = m[2] ? (m[4] ? Number(m[4]) : 1) : 0;
      if (!isFinite(co) || p > 12) return null; c[p] = (c[p] || 0) + co;
    }
    return c;
  }
  function polyStr(c, dp) {
    var ps = Object.keys(c).map(Number).filter(function (p) { return Math.abs(c[p]) > 1e-12; }).sort(function (a, b) { return b - a; });
    if (!ps.length) return "0";
    return ps.map(function (p, i) { var co = c[p], ab = Math.abs(co), cs = (ab === 1 && p > 0) ? "" : fmt(ab, dp || 4); return (i === 0 ? (co < 0 ? "−" : "") : (co < 0 ? " − " : " + ")) + cs + (p > 0 ? "x" + (p > 1 ? sup(p) : "") : ""); }).join("");
  }
  function pDer(c) { var d = {}; Object.keys(c).forEach(function (k) { var p = Number(k); if (p > 0) d[p - 1] = (d[p - 1] || 0) + c[k] * p; }); return d; }
  function pInt(c) { var d = {}; Object.keys(c).forEach(function (k) { var p = Number(k); d[p + 1] = c[k] / (p + 1); }); return d; }
  function pVal(c, x) { return Object.keys(c).reduce(function (s, k) { return s + c[k] * Math.pow(x, Number(k)); }, 0); }
  function runCalc() {
    var c = parsePoly(val("c_f"));
    if (!c) return err("Write a polynomial such as 2x^2 + 20x + 800 (powers 0 to 12).");
    var d1 = pDer(c), d2 = pDer(d1), I = pInt(c), x0 = n("c_x"), a = n("c_a"), b = n("c_b"), h = "";
    h += kv([["f(x)", polyStr(c)], ["f′(x)", polyStr(d1)], ["f″(x)", polyStr(d2)], ["∫ f(x) dx", polyStr(I) + " + C"]]);
    if (fin(x0)) h += kv([["f(" + fmt(x0, 4) + ")", fmt(pVal(c, x0), 4)], ["f′(" + fmt(x0, 4) + ") (marginal value)", fmt(pVal(d1, x0), 4)], ["f(x)/x (average value)", x0 !== 0 ? fmt(pVal(c, x0) / x0, 4) : "—"]]);
    var deg = Math.max.apply(null, Object.keys(d1).map(Number).filter(function (p) { return Math.abs(d1[p]) > 1e-12; }).concat([-1])), roots = [];
    if (deg === 1) roots = [-(d1[0] || 0) / d1[1]];
    else if (deg === 2) { var A = d1[2], B = d1[1] || 0, C = d1[0] || 0, D = B * B - 4 * A * C; if (D >= -1e-12) { var s = Math.sqrt(Math.max(D, 0)); roots = D < 1e-12 ? [-B / (2 * A)] : [(-B + s) / (2 * A), (-B - s) / (2 * A)]; } }
    if (deg >= 3) h += note("Stationary points are shown for polynomials up to degree 3.");
    else if (deg >= 1) {
      h += sub("Stationary points (f′(x) = 0)") + (roots.length ? kv(roots.sort(function (p, q) { return p - q; }).map(function (r) { var s2 = pVal(d2, r); return ["x = " + fmt(r, 4), "f = " + fmt(pVal(c, r), 4) + ", f″ = " + fmt(s2, 4) + " → " + (s2 < -1e-12 ? "maximum" : s2 > 1e-12 ? "minimum" : "test further")]; })) : note("f′(x) = 0 has no real solution, so there is no stationary point."));
    }
    if (fin(a) && fin(b)) h += sub("Definite integral") + kv([["∫ from " + fmt(a, 4) + " to " + fmt(b, 4), fmt(pVal(I, b) - pVal(I, a), 4)]]);
    return h;
  }

  /* ---------- 2.1 series and codes ---------- */
  function same(arr) { return arr.every(function (v) { return Math.abs(v - arr[0]) < 1e-9; }); }
  function diffs(a) { var d = []; for (var i = 1; i < a.length; i++) d.push(a[i] - a[i - 1]); return d; }
  function addTxt(v) { return v < 0 ? "subtract " + fmt(-v, 4) : "add " + fmt(v, 4); }
  function isPrime(k) { if (!Number.isInteger(k) || k < 2) return false; for (var i = 2; i * i <= k; i++) if (k % i === 0) return false; return true; }
  function detect(s) {
    var L = s.length, d = diffs(s), last = s[L - 1];
    if (L >= 3 && same(d)) return ["Arithmetic: add " + fmt(d[0], 4) + " each time", last + d[0]];
    if (L >= 3 && s.every(function (v) { return v !== 0; })) { var r = s.slice(1).map(function (v, i) { return v / s[i]; }); if (same(r)) return ["Geometric: multiply by " + fmt(r[0], 4) + " each time", last * r[0]]; }
    if (L >= 4) { var d2 = diffs(d); if (same(d2)) return ["Differences " + d.map(function (v) { return fmt(v, 4); }).join(", ") + " rise by " + fmt(d2[0], 4) + " each time", last + d[d.length - 1] + d2[0]]; }
    if (L >= 4 && Math.abs(s[1] - s[0]) > 1e-12) { var m = (s[2] - s[1]) / (s[1] - s[0]), c = s[1] - m * s[0]; if (s.slice(1).every(function (v, i) { return Math.abs(v - (m * s[i] + c)) < 1e-6; })) return ["Each term = previous × " + fmt(m, 4) + (c >= 0 ? " + " : " − ") + fmt(Math.abs(c), 4), m * last + c]; }
    if (L >= 4 && s.slice(2).every(function (v, i) { return Math.abs(v - s[i] - s[i + 1]) < 1e-9; })) return ["Each term = sum of the two before it", s[L - 1] + s[L - 2]];
    if (L >= 5) { var d3 = diffs(diffs(d)); if (same(d3)) { var dd = diffs(d); return ["Third differences are constant (" + fmt(d3[0], 4) + ")", last + d[d.length - 1] + dd[dd.length - 1] + d3[0]]; } }
    if (L >= 5) { var ev = s.filter(function (v, i) { return i % 2 === 0; }), od = s.filter(function (v, i) { return i % 2 === 1; }), nxt = L % 2 === 0 ? ev : od;
      var sub1 = detect(ev.length >= 3 ? ev : []), sub2 = detect(od.length >= 3 ? od : []);
      if (ev.length >= 3 && od.length >= 2 && sub1 && (sub2 || od.length === 2)) { var tgt = nxt === ev ? sub1 : sub2; if (tgt) return ["Two series alternate. Odd positions: " + sub1[0].toLowerCase() + (sub2 ? "; even positions: " + sub2[0].toLowerCase() : ""), tgt[1]]; }
      var ad = []; for (var i = 1; i < L; i++) ad.push(i % 2 ? s[i] - s[i - 1] : s[i] / s[i - 1]);
      var sa = ad.filter(function (v, i) { return i % 2 === 0; }), sm = ad.filter(function (v, i) { return i % 2 === 1; });
      if (same(sa) && same(sm)) return ["Alternately " + addTxt(sa[0]) + " and multiply by " + fmt(sm[0], 4), L % 2 ? last + sa[0] : last * sm[0]];
      var ad2 = []; for (i = 1; i < L; i++) ad2.push(i % 2 ? s[i] / s[i - 1] : s[i] - s[i - 1]);
      var ma = ad2.filter(function (v, i) { return i % 2 === 0; }), aa = ad2.filter(function (v, i) { return i % 2 === 1; });
      if (same(ma) && same(aa)) return ["Alternately multiply by " + fmt(ma[0], 4) + " and " + addTxt(aa[0]), L % 2 ? last * ma[0] : last + aa[0]];
    }
    if (L >= 3 && s.every(isPrime)) { var all = [], k = 2; while (all.length < 400) { if (isPrime(k)) all.push(k); k++; } var st = all.indexOf(s[0]); if (st >= 0 && s.every(function (v, i) { return all[st + i] === v; })) return ["Consecutive prime numbers", all[st + L]]; }
    return null;
  }
  function runPattern() {
    var s = nums(val("pt_s")), h = "";
    if (s.length < 3 || !s.every(fin)) h += err("Enter at least three numbers, separated by commas.");
    else if (s.length > 30) h += err("Please enter 30 numbers or fewer.");
    else {
      var r = detect(s);
      h += sub("Differences") + chips(diffs(s).map(function (v) { return fmt(v, 4); }), "") ;
      h += r ? kv([["Pattern", r[0]], ["Next term", fmt(r[1], 4)]]) : '<p class="err">No standard pattern found. Check for squares or cubes ± a number, digit operations, or a typing error.</p>';
    }
    var w = val("pt_w").toUpperCase().replace(/[^A-Z ]/g, ""), mode = val("pt_mode"), k = n("pt_k");
    if (w.trim()) {
      var enc = w.split("").map(function (ch) { if (ch === " ") return " "; var p = ch.charCodeAt(0) - 64; if (mode === "shift") { var kk = fin(k) ? Math.round(k) : 1; return String.fromCharCode(65 + ((p - 1 + kk) % 26 + 26) % 26); } if (mode === "rev") return String.fromCharCode(64 + 27 - p); return ch; });
      if (mode === "back") enc = w.split("").reverse();
      h += sub("Coding " + esc(w.trim())) + '<div class="tscroll"><table><tr><th>Letter</th>' + w.split("").filter(function (ch) { return ch !== " "; }).map(function (ch) { return "<td><b>" + ch + "</b></td>"; }).join("") + "</tr><tr><th>Position</th>" + w.split("").filter(function (ch) { return ch !== " "; }).map(function (ch) { return "<td>" + (ch.charCodeAt(0) - 64) + "</td>"; }).join("") + "</tr><tr><th>Reverse position</th>" + w.split("").filter(function (ch) { return ch !== " "; }).map(function (ch) { return "<td>" + (27 - (ch.charCodeAt(0) - 64)) + "</td>"; }).join("") + "</tr></table></div>" +
        kv([["Coded word", enc.join("")], ["Sum of positions", w.split("").filter(function (ch) { return ch !== " "; }).reduce(function (t, ch) { return t + ch.charCodeAt(0) - 64; }, 0)]]);
    }
    return h;
  }

  /* ---------- 2.2 direction sense ---------- */
  var DIRS = { n: [0, 1], north: [0, 1], e: [1, 0], east: [1, 0], s: [0, -1], south: [0, -1], w: [-1, 0], west: [-1, 0], ne: [Math.SQRT1_2, Math.SQRT1_2], "north-east": [Math.SQRT1_2, Math.SQRT1_2], northeast: [Math.SQRT1_2, Math.SQRT1_2], nw: [-Math.SQRT1_2, Math.SQRT1_2], "north-west": [-Math.SQRT1_2, Math.SQRT1_2], northwest: [-Math.SQRT1_2, Math.SQRT1_2], se: [Math.SQRT1_2, -Math.SQRT1_2], "south-east": [Math.SQRT1_2, -Math.SQRT1_2], southeast: [Math.SQRT1_2, -Math.SQRT1_2], sw: [-Math.SQRT1_2, -Math.SQRT1_2], "south-west": [-Math.SQRT1_2, -Math.SQRT1_2], southwest: [-Math.SQRT1_2, -Math.SQRT1_2] };
  var NAMES8 = ["East", "North-East", "North", "North-West", "West", "South-West", "South", "South-East"];
  function dirName(x, y) {
    if (Math.abs(x) < 1e-9 && Math.abs(y) < 1e-9) return "at the start";
    if (Math.abs(x) < 1e-9) return y > 0 ? "North" : "South";
    if (Math.abs(y) < 1e-9) return x > 0 ? "East" : "West";
    return (y > 0 ? "North" : "South") + "-" + (x > 0 ? "East" : "West");
  }
  function facingName(v) { var ang = Math.atan2(v[1], v[0]), k = Math.round(ang / (Math.PI / 4)); return NAMES8[(k % 8 + 8) % 8]; }
  function runDirection() {
    var face = DIRS[val("d_face")], lines = val("d_moves").split(/\n+/).map(function (s) { return s.trim().toLowerCase(); }).filter(Boolean);
    if (!lines.length) return err("Enter at least one move, e.g. N 5 or right 3.");
    if (lines.length > 30) return err("Please use 30 moves or fewer.");
    var x = 0, y = 0, path = [[0, 0]], rows = "", bad = [], walked = 0;
    lines.forEach(function (l) {
      var m = l.match(/^(?:turn\s+)?([a-z\-]+)(?:\s+turn)?\s*(?:and\s+walk|and\s+go|walk|go)?\s*(-?\d*\.?\d+)?\s*(?:km|m|metres|meters|steps)?$/);
      if (!m) { bad.push(l); return; }
      var w = m[1], dist = m[2] ? Number(m[2]) : 0;
      if (DIRS[w]) face = DIRS[w];
      else if (w === "right") face = [face[1], -face[0]];
      else if (w === "left") face = [-face[1], face[0]];
      else if (w === "back" || w === "about-turn" || w === "about" || w === "u-turn") face = [-face[0], -face[1]];
      else if (w === "straight" || w === "ahead" || w === "forward") { /* keep facing */ }
      else { bad.push(l); return; }
      x += face[0] * dist; y += face[1] * dist; walked += dist; path.push([x, y]);
      rows += "<tr><td>" + esc(l) + "</td><td>" + facingName(face) + "</td><td>(" + fmt(x, 3) + ", " + fmt(y, 3) + ")</td></tr>";
    });
    if (bad.length) return err("I could not read: " + bad.map(esc).join("; ") + ". Use a direction (N, E, S, W, NE …) or a turn (right, left, back) followed by a distance.");
    var dist = Math.sqrt(x * x + y * y);
    var h = '<div class="tscroll"><table><tr><th>Move</th><th>Facing</th><th>Position (x = East, y = North)</th></tr>' + rows + "</table></div>" +
      kv([["Shortest distance from start", fmt(dist, 3)], ["Direction from start", dirName(x, y)], ["Total distance walked", fmt(walked, 3)], ["Facing at the end", facingName(face)]]);
    var mx = 1; path.forEach(function (p) { mx = Math.max(mx, Math.abs(p[0]), Math.abs(p[1])); });
    var W = 300, c = W / 2, sc = (W / 2 - 26) / mx, s = '<line x1="' + c + '" y1="10" x2="' + c + '" y2="' + (W - 10) + '" style="stroke:var(--border)"/><line x1="10" y1="' + c + '" x2="' + (W - 10) + '" y2="' + c + '" style="stroke:var(--border)"/><text x="' + c + '" y="9" text-anchor="middle" class="ax">N</text><text x="' + (W - 4) + '" y="' + (c + 4) + '" text-anchor="end" class="ax">E</text><text x="' + c + '" y="' + (W - 1) + '" text-anchor="middle" class="ax">S</text><text x="4" y="' + (c + 4) + '" class="ax">W</text>';
    s += '<polyline points="' + path.map(function (p) { return (c + p[0] * sc) + "," + (c - p[1] * sc); }).join(" ") + '" style="fill:none;stroke:var(--accent);stroke-width:3;stroke-linejoin:round"/>';
    s += '<line x1="' + c + '" y1="' + c + '" x2="' + (c + x * sc) + '" y2="' + (c - y * sc) + '" style="stroke:var(--sun-strong);stroke-width:2;stroke-dasharray:5 4"/>';
    s += '<circle cx="' + c + '" cy="' + c + '" r="5" style="fill:var(--ink)"/><circle cx="' + (c + x * sc) + '" cy="' + (c - y * sc) + '" r="6" style="fill:var(--sun-strong);stroke:#fff;stroke-width:2"/>';
    return h + '<div style="max-width:320px">' + svgWrap(W, W, "Route drawn from the start point", s) + "</div>" + note("Black dot: start. Blue line: the route. Yellow dashed line: the straight-line distance back to the start.");
  }

  /* ---------- 2.3 seating arrangement solver ---------- */
  var ORD = { first: 1, "1st": 1, second: 2, "2nd": 2, third: 3, "3rd": 3, fourth: 4, "4th": 4, fifth: 5, "5th": 5, sixth: 6, "6th": 6, seventh: 7, "7th": 7, eighth: 8, "8th": 8 };
  function parseClue(line, names) {
    var orig = " " + line.replace(/[.,;]/g, " ").replace(/\s+/g, " ").trim() + " ", t = orig.toLowerCase();
    /* single-letter names are matched case-sensitively, so the word "a" is not read as person A */
    var found = []; names.forEach(function (nm) { var one = nm.length === 1, re = new RegExp("(^|\\s)" + (one ? nm : nm.toLowerCase()).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?=\\s)", "g"), src = one ? orig : t, mm; while ((mm = re.exec(src))) found.push([mm.index, nm]); });
    found.sort(function (a, b) { return a[0] - b[0]; });
    var who = found.map(function (f) { return f[1]; }), neg = /\b(not|never|isn't|doesn't)\b/.test(t), A = who[0], B = who[1], C = who[2];
    if (!A) return null;
    var k = 1, km = t.match(/\b(first|1st|second|2nd|third|3rd|fourth|4th|fifth|5th|sixth|6th|seventh|7th|eighth|8th)\b/); if (km) k = ORD[km[1]];
    var dm = t.match(/\b(\d+)\s*(?:st|nd|rd|th)?\b/);
    if (/between/.test(t) && B && C) return { type: "between", a: A, b: B, c: C, neg: neg };
    if (/opposite|facing each other|face each other/.test(t) && B) return { type: "opp", a: A, b: B, neg: neg };
    if (/(next to|beside|adjacent|neighbou?r|sits? with)/.test(t) && B) return { type: "adj", a: A, b: B, neg: neg };
    if (/\bleft\b/.test(t) && B) return { type: "side", a: A, b: B, dir: "L", k: k, imm: /immediate|immediately|just|next/.test(t) || !!km, any: !km && !/immediate|immediately|just/.test(t), neg: neg };
    if (/\bright\b/.test(t) && B) return { type: "side", a: A, b: B, dir: "R", k: k, imm: /immediate|immediately|just|next/.test(t) || !!km, any: !km && !/immediate|immediately|just/.test(t), neg: neg };
    if (/middle|centre|center/.test(t)) return { type: "mid", a: A, neg: neg };
    if (/left end|leftmost|extreme left/.test(t)) return { type: "end", a: A, side: "L", neg: neg };
    if (/right end|rightmost|extreme right/.test(t)) return { type: "end", a: A, side: "R", neg: neg };
    if (/\bends?\b|corner|extreme/.test(t)) return { type: "end", a: A, side: "any", neg: neg };
    if (/from (the )?left/.test(t) && (km || dm)) return { type: "pos", a: A, k: km ? k : Number(dm[1]), from: "L", neg: neg };
    if (/from (the )?right/.test(t) && (km || dm)) return { type: "pos", a: A, k: km ? k : Number(dm[1]), from: "R", neg: neg };
    if (/(seat|position|place|chair)\s*(no\.?|number)?\s*\d+/.test(t)) return { type: "pos", a: A, k: Number(t.match(/(?:seat|position|place|chair)\s*(?:no\.?|number)?\s*(\d+)/)[1]), from: "L", neg: neg };
    return null;
  }
  function checkClue(c, pos, N, kind) {
    var circ = kind === "circle", pa = pos[c.a], pb = pos[c.b], ok;
    /* lsign: index step towards the seated people's left */
    var ls = kind === "south" ? 1 : (circ ? 1 : -1);
    function step(p, d, k) { var q = p + d * k; return circ ? ((q % N) + N) % N : q; }
    if (c.type === "adj") ok = circ ? (((pa - pb) % N + N) % N === 1 || ((pb - pa) % N + N) % N === 1) : Math.abs(pa - pb) === 1;
    else if (c.type === "opp") ok = circ && N % 2 === 0 && ((pa - pb) % N + N) % N === N / 2;
    else if (c.type === "between") { var pc = pos[c.c]; ok = circ ? ((step(pb, 1, 1) === pa && step(pa, 1, 1) === pc) || (step(pc, 1, 1) === pa && step(pa, 1, 1) === pb)) : ((pb + 1 === pa && pa + 1 === pc) || (pc + 1 === pa && pa + 1 === pb)); }
    else if (c.type === "side") {
      var d = c.dir === "L" ? ls : -ls;
      if (c.any && !circ) ok = d > 0 ? pa > pb : pa < pb;
      else ok = step(pb, d, c.k) === pa;
    }
    else if (c.type === "mid") ok = !circ && N % 2 === 1 && pa === (N - 1) / 2;
    else if (c.type === "end") { var leftEnd = kind === "south" ? N - 1 : 0, rightEnd = kind === "south" ? 0 : N - 1; ok = !circ && (c.side === "any" ? (pa === 0 || pa === N - 1) : pa === (c.side === "L" ? leftEnd : rightEnd)); }
    else if (c.type === "pos") { var fromLeft = kind === "south" ? N - pa : pa + 1; ok = !circ && (c.from === "L" ? fromLeft === c.k : (N + 1 - fromLeft) === c.k); }
    return c.neg ? !ok : ok;
  }
  function permute(arr, fn) { var a = arr.slice(), N = a.length, c = new Array(N).fill(0), i = 0; fn(a.slice()); while (i < N) { if (c[i] < i) { var j = i % 2 ? c[i] : 0, t = a[j]; a[j] = a[i]; a[i] = t; fn(a.slice()); c[i]++; i = 0; } else { c[i] = 0; i++; } } }
  function runSeating() {
    var kind = val("st_kind"), names = setOf(val("st_names").replace(/\s+/g, ",")), lines = val("st_clues").split(/\n+/).map(function (s) { return s.trim(); }).filter(Boolean);
    if (names.length < 3 || names.length > 8) return err("Enter 3 to 8 names (or letters), separated by commas.");
    var clues = [], bad = [];
    lines.forEach(function (l) { var c = parseClue(l, names); if (!c) bad.push(l); else clues.push([l, c]); });
    if (bad.length) return err("I could not read: " + bad.map(esc).join("; ") + ". Each clue must name the people involved (e.g. “A immediately left of C”, “E not at an end”, “B opposite D”).");
    var N = names.length, sols = [], circ = kind === "circle";
    if (circ && clues.some(function (c) { return ["mid", "end", "pos"].indexOf(c[1].type) >= 0; })) return err("“Middle”, “end” and seat-number clues apply only to rows. Switch to a row, or remove those clues.");
    var rest = circ ? names.slice(1) : names;
    permute(rest, function (p) {
      var seats = circ ? [names[0]].concat(p) : p, pos = {}; seats.forEach(function (nm, i) { pos[nm] = i; });
      if (clues.every(function (c) { return checkClue(c[1], pos, N, kind); })) sols.push(seats);
    });
    var h = kv([["People", N], ["Clues read", clues.length], ["Arrangements that fit every clue", sols.length + (circ ? " (rotations counted once)" : "")]]);
    if (!sols.length) return h + '<p class="err">No arrangement satisfies all the clues. Check for a clue that contradicts another, or a left/right mix-up.</p>';
    if (sols.length === 1) h += '<p class="small" style="margin-top:6px"><b>Unique arrangement ✓</b></p>';
    sols.slice(0, 6).forEach(function (seats, idx) {
      if (!circ) h += '<div style="margin-top:10px"><span class="small muted">' + (sols.length > 1 ? "Case " + (idx + 1) + ": " : "") + (kind === "south" ? "seen from the front, people facing you (South)" : "people facing North (left to right as you read)") + "</span>" + chips(seats, "ac") + "</div>";
      else {
        var W = 220, c = 110, R = 80, s = '<circle cx="' + c + '" cy="' + c + '" r="' + (R - 26) + '" style="fill:var(--soft);stroke:var(--line)"/><text x="' + c + '" y="' + (c + 4) + '" text-anchor="middle" class="ax">table</text>';
        seats.forEach(function (nm, i) { var ang = -Math.PI / 2 + 2 * Math.PI * i / N, x = c + R * Math.cos(ang), y = c + R * Math.sin(ang); s += '<circle cx="' + x + '" cy="' + y + '" r="17" style="fill:var(--accent)"/><text x="' + x + '" y="' + (y + 5) + '" text-anchor="middle" style="fill:#fff;font-weight:800;font-size:13px">' + esc(nm.slice(0, 3)) + "</text>"; });
        h += '<div style="display:inline-block;width:230px;margin:10px 10px 0 0;vertical-align:top"><span class="small muted">' + (sols.length > 1 ? "Case " + (idx + 1) : "Arrangement") + " (clockwise from top)</span>" + svgWrap(W, W, "Circular seating arrangement", s) + "</div>";
      }
    });
    if (sols.length > 6) h += note("Showing 6 of " + sols.length + " possible arrangements. Add a clue to narrow it down.");
    if (circ) h += note("Everyone faces the centre: a person's left is the next seat clockwise.");
    return h;
  }

  /* ---------- 2.4 blood relations ---------- */
  var REL = { father: ["U", "m"], dad: ["U", "m"], mother: ["U", "f"], mom: ["U", "f"], mum: ["U", "f"], parent: ["U", "?"], son: ["D", "m"], daughter: ["D", "f"], child: ["D", "?"], brother: ["B", "m"], sister: ["B", "f"], sibling: ["B", "?"], husband: ["S", "m"], wife: ["S", "f"], spouse: ["S", "?"],
    grandfather: ["UU", "m"], grandmother: ["UU", "f"], grandson: ["DD", "m"], granddaughter: ["DD", "f"] };
  function g(gn, m, f, q) { return gn === "m" ? m : gn === "f" ? f : (q || m + "/" + f); }
  function relName(seq) {
    var letters = seq.map(function (s) { return s.k; }).join(""), last = seq[seq.length - 1], gn = last ? last.g : "?";
    var mm = letters.match(/^(S?)(U*)(B?)(D*)(S?)$/);
    if (!letters) return "the person themself";
    if (!mm) return null;
    var s1 = !!mm[1], a = mm[2].length, b = !!mm[3], d = mm[4].length, s2 = !!mm[5];
    var side = a ? (seq[s1 ? 1 : 0].g === "m" ? "paternal " : seq[s1 ? 1 : 0].g === "f" ? "maternal " : "") : "";
    function greats(k) { return k > 0 ? new Array(k + 1).join("great-") : ""; }
    if (!s1 && !s2) {
      if (a && !b && !d) return a === 1 ? g(gn, "father", "mother", "parent") : greats(a - 2) + g(gn, "grandfather", "grandmother", "grandparent");
      if (!a && !b && d) return d === 1 ? g(gn, "son", "daughter", "child") : greats(d - 2) + g(gn, "grandson", "granddaughter", "grandchild");
      if (!a && b && !d) return g(gn, "brother", "sister", "sibling");
      if (a && b && !d) return a === 1 ? side + g(gn, "uncle", "aunt") : greats(a - 2) + "grand-" + g(gn, "uncle", "aunt") + " (" + side.trim() + " side)";
      if (!a && b && d) return d === 1 ? g(gn, "nephew", "niece") : greats(d - 2) + "grand-" + g(gn, "nephew", "niece");
      if (a === 1 && b && d === 1) return side + "cousin (" + g(gn, "male", "female", "gender not stated") + ")";
      if (a && b && d) return "a cousin-type relative: " + a + " generation(s) up then " + d + " down through a sibling";
    }
    if (s1 && !a && !b && !d && !s2) return g(gn, "husband", "wife", "spouse");
    if (s1 && a === 1 && !b && !d && !s2) return g(gn, "father-in-law", "mother-in-law");
    if (s1 && a >= 2 && !b && !d && !s2) return "spouse's " + g(gn, "grandfather", "grandmother");
    if (s1 && !a && b && !d && !s2) return g(gn, "brother-in-law", "sister-in-law") + " (spouse's sibling)";
    if (s1 && !a && !b && d && !s2) return (d === 1 ? g(gn, "son", "daughter") : g(gn, "grandson", "granddaughter")) + " (or step-" + g(gn, "son", "daughter") + ")";
    if (!s1 && !a && b && !d && s2) return g(gn, "brother-in-law", "sister-in-law") + " (sibling's spouse)";
    if (!s1 && !a && !b && d === 1 && s2) return g(gn, "son-in-law", "daughter-in-law");
    if (!s1 && !a && !b && d === 2 && s2) return "grandchild's spouse (grand-" + g(gn, "son", "daughter") + "-in-law)";
    if (!s1 && a === 1 && b && !d && s2) return side + g(gn, "uncle", "aunt") + " (by marriage)";
    if (!s1 && !a && b && d === 1 && s2) return "nephew's or niece's spouse";
    if (s1 && !a && b && !d && s2) return "spouse's sibling's spouse (co-" + g(gn, "brother", "sister") + "-in-law)";
    return null;
  }
  function runRelation() {
    var raw = val("rl_chain").toLowerCase().replace(/[’`]/g, "'").replace(/\bmy\b|\bthe\b|\bof\b|\bone\b/g, " ");
    var toks = raw.split(/'s\b|'|\s+|,|>|→/).map(function (x) { return x.trim(); }).filter(Boolean);
    if (!toks.length) return err("Enter a chain such as: mother's brother's son");
    var steps0 = [], bad = [], only = false;
    toks.forEach(function (t) { if (t === "only") { only = true; return; } var r = REL[t] || REL[t.replace(/s$/, "")]; if (!r) bad.push(t); else { r[0].split("").forEach(function (k, i, arr) { steps0.push({ k: k, g: i === arr.length - 1 ? r[1] : "?", only: only && i === arr.length - 1 }); }); } only = false; });
    if (bad.length) return err("Unknown word(s): " + bad.map(esc).join(", ") + ". Use father, mother, son, daughter, brother, sister, husband, wife, grandfather, grandmother, grandson, granddaughter.");
    if (steps0.length > 12) return err("Please use a chain of 12 links or fewer.");
    var notes = [], seq = [];
    steps0.forEach(function (st) {
      var p = seq[seq.length - 1], pp = seq[seq.length - 2];
      if (p && p.k === "U" && st.k === "D" && st.only && pp && pp.k === "U" && (pp.g === st.g || pp.g === "?")) { seq.pop(); pp.g = st.g; notes.push("“only " + (st.g === "f" ? "daughter" : "son") + "” must be the person already in the chain, one generation down"); }
      else if (p && p.k === "U" && st.k === "D") { seq.pop(); seq.push({ k: "B", g: st.g }); notes.push("a parent's child is treated as a sibling (it could also be the person themself)"); }
      else if (p && p.k === "B" && st.k === "B") { p.g = st.g; notes.push("a sibling's sibling is treated as a sibling (it could also be the person themself)"); }
      else if (p && p.k === "B" && st.k === "U") { seq.pop(); seq.push(st); }
      else if (p && p.k === "U" && st.k === "S") { p.g = st.g; notes.push("a parent's spouse is treated as the other parent (it could be a step-parent)"); }
      else if (p && p.k === "S" && st.k === "S") { seq.pop(); }
      else if (p && p.k === "D" && st.k === "U") { seq.pop(); notes.push("a child's parent is the person themself or their spouse"); }
      else seq.push({ k: st.k, g: st.g });
    });
    var name = relName(seq), gen = seq.reduce(function (s, x) { return s + (x.k === "U" ? 1 : x.k === "D" ? -1 : 0); }, 0);
    var h = kv([["Chain", esc(toks.join(" → "))], ["Relation", name ? "<span style=\"text-transform:capitalize\">" + name + "</span>" : "A more distant relative"], ["Generation", gen === 0 ? "Same as the person" : Math.abs(gen) + " generation" + (Math.abs(gen) > 1 ? "s" : "") + (gen > 0 ? " above" : " below")]]);
    var labels = { U: "up to a parent", D: "down to a child", B: "across to a sibling", S: "across to a spouse" };
    h += steps(seq.map(function (x) { return labels[x.k] + (x.g === "m" ? " (male)" : x.g === "f" ? " (female)" : ""); }));
    if (notes.length) h += note("Note: " + notes.filter(function (x, i) { return notes.indexOf(x) === i; }).join("; ") + ".");
    return h;
  }

  /* ---------- 3.1 frequency distribution ---------- */
  var MARKS0 = "12, 25, 37, 41, 44, 48, 52, 55, 57, 58, 61, 63, 66, 68, 72, 75, 78, 83, 88, 95";
  function runFreq() {
    var d = nums(val("fr_d")), w = n("fr_w"), st = n("fr_s"), h = "";
    if (d.length < 2 || !d.every(fin)) return err("Enter at least two numbers.");
    if (d.length > 5000) return err("Please enter 5,000 values or fewer.");
    if (!fin(w) || w <= 0) return err("Enter a positive class width.");
    var mn = Math.min.apply(null, d), mx = Math.max.apply(null, d);
    if (!fin(st)) st = Math.floor(mn / w) * w;
    if (st > mn) return err("The first class must start at or below the smallest value (" + fmt(mn, 4) + ").");
    var k = Math.floor((mx - st) / w) + 1; if (k > 40) return err("That makes " + k + " classes. Use a wider class width.");
    var f = new Array(k).fill(0); d.forEach(function (v) { f[Math.min(Math.floor((v - st) / w + 1e-12), k - 1)]++; });
    var cum = 0, rows = "", labels = [];
    f.forEach(function (fi, i) { var lo = st + i * w, hi = lo + w; cum += fi; labels.push(fmt(lo, 2) + "–" + fmt(hi, 2)); rows += "<tr><td>" + labels[i] + "</td><td>" + fmt((lo + hi) / 2, 3) + "</td><td>" + fi + "</td><td>" + cum + "</td><td>" + (d.length - cum + fi) + "</td><td>" + fmt(fi / d.length * 100, 2) + "%</td></tr>"; });
    h += kv([["Values", d.length], ["Smallest", fmt(mn, 4)], ["Largest", fmt(mx, 4)], ["Range", fmt(mx - mn, 4)], ["Classes", k]]);
    h += '<div class="tscroll"><table><tr><th>Class (exclusive)</th><th>Mid-value</th><th>Frequency</th><th>Less-than cf</th><th>More-than cf</th><th>Relative</th></tr>' + rows + "</table></div>";
    h += barsSvg(labels, f, "Histogram of the frequency distribution", { gap: 0, dp: 0 }) + note("Histogram: bars touch because the classes are continuous. A value equal to an upper limit goes into the next class.");
    var NN = n("fr_N"), nn = n("fr_n");
    if (Number.isInteger(NN) && Number.isInteger(nn) && NN > 0 && nn > 0 && nn <= NN) {
      var kk = Math.floor(NN / nn), start = 1 + Math.floor(Math.random() * kk), pick = []; for (var i = 0; i < nn; i++) pick.push(start + i * kk);
      h += sub("Systematic sample") + kv([["Interval k = N/n", NN / nn === kk ? kk : fmt(NN / nn, 3) + " → use " + kk], ["Random start (1 to " + kk + ")", start]]) + note("Selected items: " + pick.slice(0, 60).join(", ") + (pick.length > 60 ? " …" : "") + ". Change any number to draw a new random start.");
    }
    return h;
  }

  /* ---------- 3.2 central tendency ---------- */
  function sorted(a) { return a.slice().sort(function (p, q) { return p - q; }); }
  function posVal(s, p) { if (p <= 1) return s[0]; if (p >= s.length) return s[s.length - 1]; var lo = Math.floor(p); return s[lo - 1] + (p - lo) * (s[lo] - s[lo - 1]); }
  function modes(a) { var c = {}, best = 0; a.forEach(function (v) { c[v] = (c[v] || 0) + 1; best = Math.max(best, c[v]); }); if (best === 1) return "No mode (every value occurs once)"; return Object.keys(c).filter(function (k) { return c[k] === best; }).map(Number).sort(function (p, q) { return p - q; }).map(function (v) { return fmt(v, 4); }).join(", ") + " (occurs " + best + " times)"; }
  function parseGrouped(t) {
    var rows = [], bad = 0;
    t.split(/\n+/).map(function (l) { return l.trim(); }).filter(Boolean).forEach(function (l) { var m = l.replace(/−|–|—/g, "-").match(/^(-?\d*\.?\d+)\s*(?:-|to)\s*(-?\d*\.?\d+)\s*[:=,\s]\s*(\d*\.?\d+)$/i); if (!m) bad++; else rows.push([Number(m[1]), Number(m[2]), Number(m[3])]); });
    return { rows: rows, bad: bad };
  }
  function runCentral() {
    var d = nums(val("ct_d")), h = "";
    if (d.length && d.every(fin)) {
      var s = sorted(d), N = s.length, sum = d.reduce(function (t, v) { return t + v; }, 0), mean = sum / N;
      var med = N % 2 ? s[(N - 1) / 2] : (s[N / 2 - 1] + s[N / 2]) / 2, rows = [["n", N], ["Mean", fmt(mean, 4)], ["Median", fmt(med, 4)], ["Mode", modes(d)], ["Q₁ ((n + 1)/4th value)", fmt(posVal(s, (N + 1) / 4), 4)], ["Q₃ (3(n + 1)/4th value)", fmt(posVal(s, 3 * (N + 1) / 4), 4)]];
      if (d.every(function (v) { return v > 0; })) { var gm = Math.exp(d.reduce(function (t, v) { return t + Math.log(v); }, 0) / N), hm = N / d.reduce(function (t, v) { return t + 1 / v; }, 0); rows.push(["Geometric mean", fmt(gm, 4)], ["Harmonic mean", fmt(hm, 4)]); }
      h += sub("Raw data") + kv(rows) + note("Sorted: " + s.slice(0, 40).map(function (v) { return fmt(v, 4); }).join(", ") + (N > 40 ? " …" : ""));
    } else if (val("ct_d").trim()) h += err("Raw data: enter numbers separated by commas.");
    var gp = parseGrouped(val("ct_g"));
    if (gp.bad) return h + err("Grouped data: write one class per line, like 30-40: 10.");
    if (gp.rows.length >= 2) {
      var R = gp.rows, F = 0, sfx = 0; R.forEach(function (r) { F += r[2]; sfx += r[2] * (r[0] + r[1]) / 2; });
      if (F <= 0) return h + err("The frequencies must add up to more than zero.");
      var gap = R[1][0] - R[0][1]; if (gap > 0 && gap <= 1) R = R.map(function (r) { return [r[0] - gap / 2, r[1] + gap / 2, r[2]]; });
      var cf = 0, mi = 0; for (var i = 0; i < R.length; i++) { if (cf + R[i][2] >= F / 2) { mi = i; break; } cf += R[i][2]; }
      var L = R[mi][0], hw = R[mi][1] - R[mi][0], median = L + (F / 2 - cf) / R[mi][2] * hw;
      var mo = 0; R.forEach(function (r, j) { if (r[2] > R[mo][2]) mo = j; });
      var f1 = R[mo][2], f0 = mo > 0 ? R[mo - 1][2] : 0, f2 = mo < R.length - 1 ? R[mo + 1][2] : 0, den = 2 * f1 - f0 - f2, mode = den ? R[mo][0] + (f1 - f0) / den * (R[mo][1] - R[mo][0]) : NaN;
      var meanG = sfx / F;
      h += sub("Grouped data") + kv([["N = Σf", fmt(F, 4)], ["Mean = Σfx/Σf", fmt(sfx, 4) + " / " + fmt(F, 4) + " = " + fmt(meanG, 4)], ["Median class", fmt(R[mi][0], 2) + "–" + fmt(R[mi][1], 2)], ["Median", fmt(L, 4) + " + (" + fmt(F / 2, 4) + " − " + fmt(cf, 4) + ")/" + fmt(R[mi][2], 4) + " × " + fmt(hw, 4) + " = " + fmt(median, 4)], ["Modal class", fmt(R[mo][0], 2) + "–" + fmt(R[mo][1], 2)], ["Mode", fin(mode) ? fmt(mode, 4) : "Cannot use the formula (2f₁ − f₀ − f₂ = 0)"], ["3 Median − 2 Mean", fmt(3 * median - 2 * meanG, 4)]]) + (gap > 0 && gap <= 1 ? note("Inclusive classes detected: boundaries were used (each class widened by " + fmt(gap / 2, 2) + " on both sides).") : "");
    }
    return h || err("Enter raw data, grouped data, or both.");
  }

  /* ---------- 3.3 dispersion ---------- */
  function dispStats(d) {
    var s = sorted(d), N = d.length, mean = d.reduce(function (t, v) { return t + v; }, 0) / N, med = N % 2 ? s[(N - 1) / 2] : (s[N / 2 - 1] + s[N / 2]) / 2;
    var L = s[N - 1], S = s[0], q1 = posVal(s, (N + 1) / 4), q3 = posVal(s, 3 * (N + 1) / 4), varr = d.reduce(function (t, v) { return t + (v - mean) * (v - mean); }, 0) / N, sd = Math.sqrt(varr);
    return { N: N, mean: mean, med: med, L: L, S: S, q1: q1, q3: q3, md1: d.reduce(function (t, v) { return t + Math.abs(v - mean); }, 0) / N, md2: d.reduce(function (t, v) { return t + Math.abs(v - med); }, 0) / N, varr: varr, sd: sd, cv: mean !== 0 ? sd / mean * 100 : NaN };
  }
  function dispTable(x, label) {
    return sub(label) + kv([["Mean", fmt(x.mean, 4)], ["Range", fmt(x.L - x.S, 4)], ["Coeff. of range", x.L + x.S !== 0 ? fmt((x.L - x.S) / (x.L + x.S), 4) : "—"], ["QD", fmt((x.q3 - x.q1) / 2, 4)], ["Coeff. of QD", x.q3 + x.q1 !== 0 ? fmt((x.q3 - x.q1) / (x.q3 + x.q1), 4) : "—"], ["MD about mean", fmt(x.md1, 4)], ["MD about median", fmt(x.md2, 4)], ["Variance σ²", fmt(x.varr, 4)], ["SD σ", fmt(x.sd, 4)], ["CV", fin(x.cv) ? fmt(x.cv, 2) + "%" : "—"]]);
  }
  function runDispersion() {
    var A = nums(val("ds_a")), B = nums(val("ds_b")), h = "";
    if (A.length < 2 || !A.every(fin)) return err("Enter at least two numbers for data set A.");
    var a = dispStats(A); h += dispTable(a, "Data set A (n = " + a.N + ")");
    if (val("ds_b").trim()) {
      if (B.length < 2 || !B.every(fin)) return h + err("Enter at least two numbers for data set B, or leave it empty.");
      var b = dispStats(B); h += dispTable(b, "Data set B (n = " + b.N + ")");
      if (fin(a.cv) && fin(b.cv)) h += kv([["More consistent", Math.abs(a.cv - b.cv) < 1e-9 ? "Equally consistent (same CV)" : (a.cv < b.cv ? "A" : "B") + " (lower CV)"]]);
    }
    return h + note("SD here divides by n (the population formula used in this paper). QD uses Q₁ and Q₃ at the (n + 1)/4th and 3(n + 1)/4th positions.");
  }

  /* ---------- 3.4 probability ---------- */
  function runProb() {
    var pa = n("pb_a"), pb = n("pb_b"), mode = val("pb_rel"), pab = mode === "ind" ? pa * pb : mode === "me" ? 0 : n("pb_ab"), h = "";
    if (![pa, pb].every(function (v) { return fin(v) && v >= 0 && v <= 1; })) h += err("P(A) and P(B) must be between 0 and 1.");
    else if (!fin(pab) || pab < -1e-12 || pab > Math.min(pa, pb) + 1e-12 || pa + pb - pab > 1 + 1e-12) h += err("That P(A ∩ B) is impossible here: it must be at most " + fmt(Math.min(pa, pb), 4) + " and at least " + fmt(Math.max(0, pa + pb - 1), 4) + ".");
    else {
      var u = pa + pb - pab;
      h += kv([["P(A ∩ B)", fmt(pab, 4)], ["P(A ∪ B)", fmt(u, 4)], ["P(A′)", fmt(1 - pa, 4)], ["P(B′)", fmt(1 - pb, 4)], ["P(only A)", fmt(pa - pab, 4)], ["P(neither)", fmt(1 - u, 4)], ["P(A | B)", pb > 0 ? fmt(pab / pb, 4) : "—"], ["P(B | A)", pa > 0 ? fmt(pab / pa, 4) : "—"], ["Independent?", Math.abs(pab - pa * pb) < 1e-9 ? "Yes: P(A ∩ B) = P(A)P(B)" : "No"], ["Mutually exclusive?", Math.abs(pab) < 1e-12 ? "Yes" : "No"]]);
    }
    var xs = nums(val("pb_x")), ps = nums(val("pb_p"));
    if (val("pb_x").trim() || val("pb_p").trim()) {
      if (!xs.length || xs.length !== ps.length || !xs.concat(ps).every(fin)) h += err("Expected value: enter the same number of values and probabilities.");
      else if (ps.some(function (p) { return p < 0; }) || Math.abs(ps.reduce(function (t, p) { return t + p; }, 0) - 1) > 1e-6) h += err("Expected value: the probabilities must be non-negative and add up to 1 (they add up to " + fmt(ps.reduce(function (t, p) { return t + p; }, 0), 4) + ").");
      else { var E = 0, E2 = 0; xs.forEach(function (x, i) { E += x * ps[i]; E2 += x * x * ps[i]; }); h += sub("Random variable") + kv([["E(X) = Σx·p", fmt(E, 4)], ["E(X²)", fmt(E2, 4)], ["V(X) = E(X²) − [E(X)]²", fmt(E2 - E * E, 4)], ["SD", fmt(Math.sqrt(Math.max(E2 - E * E, 0)), 4)]]); }
    }
    var oa = n("pb_oa"), ob = n("pb_ob");
    if (fin(oa) && fin(ob) && oa >= 0 && ob >= 0 && oa + ob > 0) h += sub("Odds " + fmt(oa, 4) + " : " + fmt(ob, 4)) + kv([["P(event) if odds in favour", fmt(oa / (oa + ob), 4)], ["P(event) if odds against", fmt(ob / (oa + ob), 4)]]);
    return h;
  }

  /* ---------- 3.5 distributions ---------- */
  function lfact(k) { var s = 0; for (var i = 2; i <= k; i++) s += Math.log(i); return s; }
  function erf(x) { var t = 1 / (1 + 0.3275911 * Math.abs(x)), y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return x >= 0 ? y : -y; }
  function phi(z) { return 0.5 * (1 + erf(z / Math.SQRT2)); }
  var DIST_MODES = [["bin", "Binomial (n, p)"], ["poi", "Poisson (m)"], ["nor", "Normal (μ, σ)"]];
  function distInputs(m) {
    if (m === "bin") return g3(inp("ds_n", "5", "Trials n", "", "numeric"), inp("ds_p", "0.1", "Success probability p"), inp("ds_x", "1", "x (number of successes)", "", "numeric"));
    if (m === "poi") return g2(inp("ds_m", "2", "Mean m"), inp("ds_x", "0", "x (number of events)", "", "numeric"));
    return g2(inp("ds_mu", "60", "Mean μ"), inp("ds_sd", "10", "Standard deviation σ")) + g2(inp("ds_lo", "50", "From x₁ (leave empty for −∞)"), inp("ds_hi", "70", "To x₂ (leave empty for +∞)"));
  }
  var distShown = "";
  function runDist() {
    var m = val("ds_mode");
    if (m !== distShown) { document.getElementById("ds_in").innerHTML = distInputs(m); distShown = m; }
    if (m === "bin") {
      var N = n("ds_n"), p = n("ds_p"), x = n("ds_x");
      if (!(Number.isInteger(N) && N >= 1 && N <= 1000) || !(p >= 0 && p <= 1) || !(Number.isInteger(x) && x >= 0 && x <= N)) return err("Use a whole number n (1–1,000), 0 ≤ p ≤ 1 and a whole number x from 0 to n.");
      var pmf = function (k) { if (p === 0) return k === 0 ? 1 : 0; if (p === 1) return k === N ? 1 : 0; return Math.exp(lfact(N) - lfact(k) - lfact(N - k) + k * Math.log(p) + (N - k) * Math.log(1 - p)); };
      var all = []; for (var k = 0; k <= N; k++) all.push(pmf(k));
      var le = all.slice(0, x + 1).reduce(function (t, v) { return t + v; }, 0);
      var show = Math.min(N, 40);
      return kv([["P(X = " + x + ")", fmt(all[x], 6)], ["P(X ≤ " + x + ")", fmt(le, 6)], ["P(X ≥ " + x + ")", fmt(1 - le + all[x], 6)], ["Mean np", fmt(N * p, 4)], ["Variance npq", fmt(N * p * (1 - p), 4)], ["SD", fmt(Math.sqrt(N * p * (1 - p)), 4)]]) +
        barsSvg(all.slice(0, show + 1).map(function (v, i) { return String(i); }), all.slice(0, show + 1), "Binomial probabilities", { hl: x <= show ? x : -1, dp: 3 }) + (N > 40 ? note("Chart shows x = 0 to 40.") : "");
    }
    if (m === "poi") {
      var M = n("ds_m"), X = n("ds_x");
      if (!(M > 0 && M <= 500) || !(Number.isInteger(X) && X >= 0 && X <= 2000)) return err("Use a mean m between 0 and 500 and a whole number x ≥ 0.");
      var pp = function (k) { return Math.exp(-M + k * Math.log(M) - lfact(k)); }, cum = 0; for (var j = 0; j <= X; j++) cum += pp(j);
      var top = Math.min(Math.max(Math.ceil(M + 4 * Math.sqrt(M)), X, 8), 60), arr = []; for (j = 0; j <= top; j++) arr.push(pp(j));
      return kv([["P(X = " + X + ")", fmt(pp(X), 6)], ["P(X ≤ " + X + ")", fmt(cum, 6)], ["P(X ≥ " + X + ")", fmt(1 - cum + pp(X), 6)], ["Mean = variance = m", fmt(M, 4)], ["SD", fmt(Math.sqrt(M), 4)]]) +
        barsSvg(arr.map(function (v, i) { return String(i); }), arr, "Poisson probabilities", { hl: X <= top ? X : -1, dp: 3 });
    }
    var mu = n("ds_mu"), sd = n("ds_sd"), lo = val("ds_lo").trim() === "" ? -Infinity : n("ds_lo"), hi = val("ds_hi").trim() === "" ? Infinity : n("ds_hi");
    if (!fin(mu) || !(sd > 0) || isNaN(lo) || isNaN(hi)) return err("Enter μ, a positive σ, and the limits (or leave a limit empty).");
    if (lo > hi) return err("x₁ must not be greater than x₂.");
    var z1 = (lo - mu) / sd, z2 = (hi - mu) / sd, P = phi(z2) - phi(z1);
    var W = 560, H = 200, B = 30, xs = function (z) { return 20 + (W - 40) * (z + 4) / 8; }, ys = function (v) { return H - B - (H - B - 10) * v / 0.4; }, path = "", area = "";
    for (var z = -4; z <= 4.0001; z += 0.05) { var yv = Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI); path += (z === -4 ? "M" : "L") + xs(z) + "," + ys(yv); }
    var za = Math.max(z1, -4), zb = Math.min(z2, 4);
    if (za < zb) { area = "M" + xs(za) + "," + ys(0); for (z = za; z <= zb + 1e-9; z += 0.02) area += "L" + xs(z) + "," + ys(Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI)); area += "L" + xs(zb) + "," + ys(0) + "Z"; }
    var s = '<path d="' + area + '" style="fill:var(--sun-strong);opacity:.55"/><path d="' + path + '" style="fill:none;stroke:var(--accent);stroke-width:2.5"/><line x1="20" x2="' + (W - 20) + '" y1="' + ys(0) + '" y2="' + ys(0) + '" style="stroke:var(--ink)"/>';
    for (var t = -3; t <= 3; t++) s += '<text x="' + xs(t) + '" y="' + (H - 8) + '" text-anchor="middle" class="ax">' + fmt(mu + t * sd, 2) + "</text>";
    return kv([["z₁", fin(z1) ? fmt(z1, 4) : "−∞"], ["z₂", fin(z2) ? fmt(z2, 4) : "+∞"], ["P(x₁ < X < x₂)", fmt(P, 6) + " (" + fmt(P * 100, 2) + "%)"], ["P(X < x₁)", fmt(phi(z1), 6)], ["P(X > x₂)", fmt(1 - phi(z2), 6)]]) + svgWrap(W, H, "Normal curve with the shaded area", s) + note("Labels under the curve are μ − 3σ to μ + 3σ.");
  }

  /* ---------- 3.6 correlation and regression ---------- */
  function ranks(a) { var idx = a.map(function (v, i) { return [v, i]; }).sort(function (p, q) { return q[0] - p[0]; }), r = new Array(a.length), ties = []; for (var i = 0; i < idx.length;) { var j = i; while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++; var avg = (i + j) / 2 + 1; for (var k = i; k <= j; k++) r[idx[k][1]] = avg; if (j > i) ties.push(j - i + 1); i = j + 1; } return { r: r, ties: ties }; }
  function runCorr() {
    var X = nums(val("co_x")), Y = nums(val("co_y")), x0 = n("co_x0"), y0 = n("co_y0");
    if (X.length < 3 || X.length !== Y.length || !X.concat(Y).every(fin)) return err("Enter the same number of x and y values (at least 3 pairs).");
    if (X.length > 500) return err("Please use 500 pairs or fewer.");
    var N = X.length, mx = X.reduce(function (t, v) { return t + v; }, 0) / N, my = Y.reduce(function (t, v) { return t + v; }, 0) / N, sxy = 0, sxx = 0, syy = 0;
    X.forEach(function (x, i) { sxy += (x - mx) * (Y[i] - my); sxx += (x - mx) * (x - mx); syy += (Y[i] - my) * (Y[i] - my); });
    if (sxx === 0 || syy === 0) return err("One variable has no variation (all values equal), so r cannot be calculated.");
    var r = sxy / Math.sqrt(sxx * syy), byx = sxy / sxx, bxy = sxy / syy;
    var rx = ranks(X), ry = ranks(Y), d2 = 0; rx.r.forEach(function (v, i) { d2 += (v - ry.r[i]) * (v - ry.r[i]); });
    var cf = rx.ties.concat(ry.ties).reduce(function (t, m) { return t + (m * m * m - m) / 12; }, 0), R = 1 - 6 * (d2 + cf) / (N * (N * N - 1));
    var h = kv([["x̄", fmt(mx, 4)], ["ȳ", fmt(my, 4)], ["Σdxdy", fmt(sxy, 4)], ["Σdx²", fmt(sxx, 4)], ["Σdy²", fmt(syy, 4)]]) +
      kv([["Karl Pearson's r", fmt(r, 4)], ["r² (explained)", fmt(r * r * 100, 2) + "%"], ["Probable error 0.6745(1 − r²)/√n", fmt(0.6745 * (1 - r * r) / Math.sqrt(N), 4)], ["Spearman's R" + (cf ? " (tie-corrected)" : ""), fmt(R, 4)]]) +
      kv([["bᵧₓ", fmt(byx, 4)], ["Line y on x", "y = " + fmt(my - byx * mx, 4) + (byx < 0 ? " − " : " + ") + fmt(Math.abs(byx), 4) + "x"], ["bₓᵧ", fmt(bxy, 4)], ["Line x on y", "x = " + fmt(mx - bxy * my, 4) + (bxy < 0 ? " − " : " + ") + fmt(Math.abs(bxy), 4) + "y"], ["√(bᵧₓ·bₓᵧ)", fmt(Math.sqrt(Math.abs(byx * bxy)), 4)]]);
    if (fin(x0)) h += kv([["Estimated y when x = " + fmt(x0, 4), fmt(my + byx * (x0 - mx), 4)]]);
    if (fin(y0)) h += kv([["Estimated x when y = " + fmt(y0, 4), fmt(mx + bxy * (y0 - my), 4)]]);
    var minx = Math.min.apply(null, X), maxx = Math.max.apply(null, X), miny = Math.min.apply(null, Y), maxy = Math.max.apply(null, Y), px = (maxx - minx) * 0.1 || 1, py = (maxy - miny) * 0.1 || 1;
    minx -= px; maxx += px; miny -= py; maxy += py;
    var W = 460, H = 280, P = 40, sx = function (v) { return P + (W - P - 10) * (v - minx) / (maxx - minx); }, sy = function (v) { return H - P - (H - P - 10) * (v - miny) / (maxy - miny); };
    var s = '<line x1="' + P + '" y1="' + (H - P) + '" x2="' + (W - 6) + '" y2="' + (H - P) + '" style="stroke:var(--ink)"/><line x1="' + P + '" y1="' + (H - P) + '" x2="' + P + '" y2="6" style="stroke:var(--ink)"/>';
    for (var k = 0; k <= 4; k++) { var vx = minx + (maxx - minx) * k / 4, vy = miny + (maxy - miny) * k / 4; s += '<text x="' + sx(vx) + '" y="' + (H - P + 15) + '" text-anchor="middle" class="ax">' + fmt(vx, 2) + '</text><text x="' + (P - 4) + '" y="' + (sy(vy) + 4) + '" text-anchor="end" class="ax">' + fmt(vy, 2) + "</text>"; }
    var ya = my + byx * (minx - mx), yb = my + byx * (maxx - mx);
    s += '<line x1="' + sx(minx) + '" y1="' + sy(ya) + '" x2="' + sx(maxx) + '" y2="' + sy(yb) + '" style="stroke:var(--sun-strong);stroke-width:2.5"/>';
    X.forEach(function (x, i) { s += '<circle cx="' + sx(x) + '" cy="' + sy(Y[i]) + '" r="5" style="fill:var(--accent);stroke:#fff;stroke-width:1.5"><title>(' + fmt(x, 4) + ", " + fmt(Y[i], 4) + ")</title></circle>"; });
    return h + '<div style="max-width:480px">' + svgWrap(W, H, "Scatter diagram with the regression line of y on x", s) + "</div>" + note("Yellow line: regression of y on x.");
  }

  /* ---------- 3.7 index numbers ---------- */
  var BASKET0 = "Rice, 40, 10, 50, 8\nOil, 120, 5, 150, 5\nSugar, 40, 4, 45, 5";
  function runIndex() {
    var rows = [], bad = [];
    val("ix_d").split(/\n+/).map(function (l) { return l.trim(); }).filter(Boolean).forEach(function (l) { var parts = l.split(/[,;\t]+/).map(function (x) { return x.trim(); }); var v = parts.slice(-4).map(Number); if (parts.length < 4 || v.length < 4 || !v.every(function (x) { return fin(x) && x >= 0; })) bad.push(l); else rows.push([parts.length >= 5 ? parts.slice(0, parts.length - 4).join(" ") : "Item " + (rows.length + 1)].concat(v)); });
    if (bad.length) return err("I could not read: " + bad.map(esc).join("; ") + ". Use: item, p₀, q₀, p₁, q₁");
    if (!rows.length) return err("Enter at least one item.");
    var s = { p0q0: 0, p1q0: 0, p0q1: 0, p1q1: 0, p0: 0, p1: 0, rel: 0 }, bad0 = false, tr = "";
    rows.forEach(function (r) { var p0 = r[1], q0 = r[2], p1 = r[3], q1 = r[4]; if (p0 === 0) bad0 = true; s.p0q0 += p0 * q0; s.p1q0 += p1 * q0; s.p0q1 += p0 * q1; s.p1q1 += p1 * q1; s.p0 += p0; s.p1 += p1; s.rel += p0 ? p1 / p0 * 100 : 0; tr += "<tr><td>" + esc(r[0]) + "</td><td>" + fmt(p0, 4) + "</td><td>" + fmt(q0, 4) + "</td><td>" + fmt(p1, 4) + "</td><td>" + fmt(q1, 4) + "</td><td>" + fmt(p0 * q0, 4) + "</td><td>" + fmt(p1 * q0, 4) + "</td><td>" + fmt(p0 * q1, 4) + "</td><td>" + fmt(p1 * q1, 4) + "</td></tr>"; });
    if (bad0) return err("Base-year prices (p₀) must be greater than zero.");
    if (!s.p0q0 || !s.p0q1) return err("The quantity weights add up to zero; check q₀ and q₁.");
    var L = s.p1q0 / s.p0q0 * 100, P = s.p1q1 / s.p0q1 * 100, F = Math.sqrt(L * P), ME = (s.p1q0 + s.p1q1) / (s.p0q0 + s.p0q1) * 100, BW = (L + P) / 2;
    var QL = s.p0q1 / s.p0q0, QP = s.p1q1 / s.p1q0, QF = Math.sqrt(QL * QP), V = s.p1q1 / s.p0q0;
    var PF10 = Math.sqrt((s.p0q1 / s.p1q1) * (s.p0q0 / s.p1q0));
    var h = '<div class="tscroll"><table><tr><th>Item</th><th>p₀</th><th>q₀</th><th>p₁</th><th>q₁</th><th>p₀q₀</th><th>p₁q₀</th><th>p₀q₁</th><th>p₁q₁</th></tr>' + tr + '<tr style="font-weight:700"><td>Total</td><td>' + fmt(s.p0, 4) + "</td><td></td><td>" + fmt(s.p1, 4) + "</td><td></td><td>" + fmt(s.p0q0, 4) + "</td><td>" + fmt(s.p1q0, 4) + "</td><td>" + fmt(s.p0q1, 4) + "</td><td>" + fmt(s.p1q1, 4) + "</td></tr></table></div>";
    h += kv([["Simple aggregative Σp₁/Σp₀ × 100", fmt(s.p1 / s.p0 * 100, 2)], ["Average of price relatives", fmt(s.rel / rows.length, 2)], ["Laspeyres", fmt(L, 2)], ["Paasche", fmt(P, 2)], ["Fisher's ideal √(L × P)", fmt(F, 2)], ["Marshall–Edgeworth", fmt(ME, 2)], ["Bowley (L + P)/2", fmt(BW, 2)]]);
    h += sub("Tests for Fisher's index") + kv([["Time reversal P₀₁ × P₁₀", fmt(F / 100 * PF10, 6) + (Math.abs(F / 100 * PF10 - 1) < 1e-9 ? " = 1 ✓" : "")], ["Factor reversal P₀₁ × Q₀₁", fmt(F / 100 * QF, 6)], ["Value ratio Σp₁q₁/Σp₀q₀", fmt(V, 6) + (Math.abs(F / 100 * QF - V) < 1e-9 ? " ✓ equal" : "")]]);
    var mv = n("ix_m"), ci = n("ix_i");
    if (fin(mv) && fin(ci) && ci > 0) h += sub("Deflating") + kv([["Real value = money value ÷ index × 100", fmt(mv / ci * 100, 2)]]);
    return h;
  }

  /* ---------- tool registry ---------- */
  var TOOLS = {
    ratio: { d: "Enter two ratios to see their simplest form and the related ratios, share an amount in a ratio, and work out a logarithm.", b: function () { return g2(g2(inp("r_a", "4", "a"), inp("r_b", "9", "b")), g2(inp("r_c", "3", "c"), inp("r_d", "2", "d"))) + g2(inp("r_amt", "7200", "Amount to share (₹)"), inp("r_parts", "8 : 12 : 15", "In the ratio", "", "text")) + g2(inp("r_base", "2", "Log base"), inp("r_x", "32", "Number")); }, run: runRatio },
    equation: { d: "Solve a quadratic ax² + bx + c = 0 and a pair of simultaneous linear equations. The tool shows the discriminant, the nature of the roots and a check.", b: function () { return sub("Quadratic") + g3(inp("q_a", "1", "a"), inp("q_b", "-5", "b"), inp("q_c", "6", "c")) + sub("Simultaneous: a₁x + b₁y = c₁ and a₂x + b₂y = c₂") + g3(inp("s_a1", "2", "a₁"), inp("s_b1", "3", "b₁"), inp("s_c1", "13", "c₁")) + g3(inp("s_a2", "3", "a₂"), inp("s_b2", "-1", "b₂"), inp("s_c2", "3", "c₂")); }, run: runEquation },
    lp: { d: "Write each constraint on its own line (x ≥ 0 and y ≥ 0 are added for you) and the objective. The tool finds every corner point, evaluates Z and draws the feasible region.", b: function () { return ta("lp_c", "x + 2y <= 40\n3x + 2y <= 60", 4, "Constraints (one per line)") + g2(inp("lp_z", "30x + 50y", "Objective Z", "", "text"), sel("lp_goal", [["max", "Maximise"], ["min", "Minimise"]], "max", "Goal")); }, run: runLp },
    finance: { d: "Choose a calculation. Rates are yearly percentages; the tool converts them to the rate per period for you.", b: function () { finShown = "ci"; return sel("f_mode", FIN_MODES, "ci", "Calculation") + '<div id="f_in">' + finInputs("ci") + "</div>"; }, run: runFinance },
    pnc: { d: "Enter n and r to see factorials, permutations, combinations and circular arrangements. Type a word to count the arrangements of its letters.", b: function () { return g3(inp("p_n", "9", "n (total)", "", "numeric"), inp("p_r", "3", "r (chosen)", "", "numeric"), inp("p_word", "ACCOUNT", "Word (optional)", "", "text")); }, run: runPnc },
    series: { d: "Pick AP or GP, enter the first term, the common difference or ratio and the number of terms. You can also find the AM, GM and HM of two numbers and the standard sums.", b: function () { return g2(sel("g_type", [["ap", "Arithmetic progression (AP)"], ["gp", "Geometric progression (GP)"]], "ap", "Type"), inp("g_n", "12", "Number of terms n", "", "numeric")) + g2(inp("g_a", "500", "First term a"), inp("g_d", "100", "Common difference d (AP) or ratio r (GP)")) + g3(inp("g_p", "4", "Means of: first number"), inp("g_q", "16", "second number"), inp("g_m", "10", "Standard sums up to n =", "", "numeric")); }, run: runSeries },
    sets: { d: "List the elements of U, A and B, separated by commas. The tool shows the set operations, counts, De Morgan's law and a Venn diagram.", b: function () { return inp("t_u", "1, 2, 3, 4, 5, 6, 7, 8, 9, 10", "Universal set U (optional)", "", "text") + g2(inp("t_a", "2, 4, 6, 8, 10", "Set A", "", "text"), inp("t_b", "3, 6, 9", "Set B", "", "text")); }, run: runSets },
    calc: { d: "Enter a polynomial (e.g. a cost or profit function). The tool differentiates and integrates it, finds and classifies stationary points, and evaluates a definite integral.", b: function () { return inp("c_f", "-3x^2 + 180x - 800", "f(x)", "", "text") + g3(inp("c_x", "30", "Evaluate at x ="), inp("c_a", "0", "Integrate from a ="), inp("c_b", "10", "to b =")); }, run: runCalc },
    pattern: { d: "Enter a number series to find its rule and the next term. Type a word to see letter positions and encode it.", b: function () { return inp("pt_s", "2, 6, 12, 20, 30", "Number series", "", "text") + g3(inp("pt_w", "FISH", "Word to code", "", "text"), sel("pt_mode", [["shift", "Shift each letter"], ["rev", "Opposite letter (A↔Z)"], ["back", "Write backwards"]], "shift", "Code rule"), inp("pt_k", "1", "Shift by (e.g. 1 or −2)")); }, run: runPattern },
    direction: { d: "Choose the starting direction, then enter one move per line: a direction and a distance (N 5, SE 2) or a turn and a distance (right 3, left 4, back 2).", b: function () { return sel("d_face", [["n", "North"], ["e", "East"], ["s", "South"], ["w", "West"]], "n", "Facing at the start") + ta("d_moves", "N 5\nright 3\nright 9", 5, "Moves (one per line)"); }, run: runDirection },
    seating: { d: "Enter the names and one clue per line. The tool tries every arrangement and shows the ones that fit all the clues. Left and right are the seated people's own left and right.", b: function () { return g2(sel("st_kind", [["north", "Row, facing North"], ["south", "Row, facing South"], ["circle", "Round table, facing the centre"]], "north", "Arrangement"), inp("st_names", "A, B, C, D, E", "People", "", "text")) + ta("st_clues", "C is in the middle\nB sits at the right end\nA is immediately left of C\nE is not at an end", 5, "Clues (one per line)") + note("Clues it understands: next to / not next to, immediately left/right of, left/right of (anywhere), second/third to the left/right of, between, opposite, in the middle, at an end, at the left/right end, kth from the left/right."); }, run: runSeating },
    relation: { d: "Type a chain of relations, starting from the person. The tool tracks generation and gender and names the relation.", b: function () { return inp("rl_chain", "mother's brother's son", "Relation chain", "", "text") + note("Try: father's sister's husband · husband's mother · brother's wife · son's wife · grandfather's only son's daughter"); }, run: runRelation },
    freq: { d: "Paste raw data and choose a class width. The tool builds an exclusive-class frequency table with cumulative frequencies and draws the histogram. It can also draw a systematic sample.", b: function () { return ta("fr_d", MARKS0, 3, "Raw data") + g2(inp("fr_w", "20", "Class width"), inp("fr_s", "0", "First class starts at (optional)")) + g2(inp("fr_N", "1000", "Systematic sample: population size N", "", "numeric"), inp("fr_n", "50", "Sample size n", "", "numeric")); }, run: runFreq },
    central: { d: "Enter raw data, grouped data (one class per line, like 30-40: 10) or both. The tool shows every average with the formula steps.", b: function () { return ta("ct_d", "3, 8, 5, 12, 10, 8", 2, "Raw data") + ta("ct_g", "10-20: 4\n20-30: 6\n30-40: 10\n40-50: 7\n50-60: 3", 5, "Grouped data (class: frequency)"); }, run: runCentral },
    dispersion: { d: "Enter one or two data sets. The tool calculates every measure of dispersion and compares consistency with the coefficient of variation.", b: function () { return ta("ds_a", "10, 12, 14, 16, 18", 2, "Data set A") + ta("ds_b", "5, 10, 20, 25, 30", 2, "Data set B (optional)"); }, run: runDispersion },
    prob: { d: "Enter P(A), P(B) and how they are related. You can also find the expected value of a random variable and convert odds.", b: function () { return g3(inp("pb_a", "0.6", "P(A)"), inp("pb_b", "0.5", "P(B)"), inp("pb_ab", "0.3", "P(A ∩ B)")) + sel("pb_rel", [["given", "Use the P(A ∩ B) I entered"], ["ind", "A and B are independent"], ["me", "A and B are mutually exclusive"]], "given", "Relationship") + g2(inp("pb_x", "100, 20, 0", "Values of X", "", "text"), inp("pb_p", "0.2, 0.5, 0.3", "Their probabilities", "", "text")) + g2(inp("pb_oa", "3", "Odds a"), inp("pb_ob", "5", "Odds b")); }, run: runProb },
    dist: { d: "Choose a distribution and enter its parameters. The tool gives exact probabilities, the mean and variance, and a chart.", b: function () { distShown = "bin"; return sel("ds_mode", DIST_MODES, "bin", "Distribution") + '<div id="ds_in">' + distInputs("bin") + "</div>"; }, run: runDist },
    corr: { d: "Enter paired x and y values. The tool calculates Karl Pearson's r, Spearman's rank correlation, both regression lines and an estimate, and draws the scatter diagram.", b: function () { return g2(inp("co_x", "2, 3, 5, 6, 9", "x values", "", "text"), inp("co_y", "5, 7, 8, 10, 15", "y values", "", "text")) + g2(inp("co_x0", "7", "Estimate y for x ="), inp("co_y0", "", "Estimate x for y =")); }, run: runCorr },
    index: { d: "Enter one item per line as: item, p₀, q₀, p₁, q₁. The tool calculates the main price indices and checks Fisher's index against the reversal tests.", b: function () { return ta("ix_d", BASKET0, 4, "Items (item, p₀, q₀, p₁, q₁)") + g2(inp("ix_m", "60000", "Deflate: money value"), inp("ix_i", "150", "Price index")); }, run: runIndex }
  };

  function toolBlock(l) {
    var t = TOOLS[l.tool];
    return '<div class="card calc"><p class="muted small" style="margin-bottom:12px">' + t.d + "</p>" + t.b() + '<div id="cout" class="res" aria-live="polite"></div></div>';
  }
  function toolWire(l) {
    var cout = document.getElementById("cout"), t = TOOLS[l.tool];
    function run() { try { cout.innerHTML = t.run(); } catch (e) { cout.innerHTML = err("Something went wrong with that input. Please check the values."); } }
    var card = cout.parentElement, timerT = null;
    card.addEventListener("input", function (e) { if (e.target.closest("#cout")) return; clearTimeout(timerT); timerT = setTimeout(run, 180); });
    card.addEventListener("change", function (e) { if (e.target.closest("#cout") || e.target.tagName !== "SELECT") return; run(); });
    run();
  }
  /* ================= STATE ================= */
  var KEY = "caq_progress_v1";
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
    var h = '<section class="hero"><div><span class="tag">Free course · about 5 hours · 19 lessons</span><h1 style="margin-top:14px">CA Foundation: Quantitative Aptitude</h1>' +
      '<p class="lead">Business Mathematics, Logical Reasoning and Statistics, explained step by step with calculators you can check your answers on.</p>' +
      '<p class="muted" style="margin-top:12px">For CA Foundation students preparing for Paper 3, and for anyone who wants a solid base in business maths and statistics. The course follows the topics of the CA Foundation Paper 3 syllabus in three modules. Every lesson has an animated walkthrough, clear notes, a worked example, an interactive tool and two quick checks. Then pass the final test to earn your certificate.</p>' +
      '<p class="small muted" style="margin-top:10px">The exam paper is objective, 100 marks: Business Mathematics 40, Logical Reasoning 20, Statistics 40, with ¼ mark deducted for each wrong answer. Always confirm the current scheme on <a href="https://www.icai.org/" target="_blank" rel="noopener">icai.org</a>.</p>' +
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
    var mod = MODULES[l.mod - 1], url = (window.CAQ_VIDEOS && window.CAQ_VIDEOS[id]) || "";
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
    h += '<div class="sec"><div class="note">📗 <b>Official study material:</b> this lesson covers the topics of ' + l.ch + ' of the CA Foundation Paper 3 syllabus. For the full official text and more practice questions, read ICAI\'s free study material on <a href="' + ICAI_URL + '" target="_blank" rel="noopener">icai.org</a>.</div></div>';
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
      return '<div class="card" style="max-width:720px;margin:0 auto"><span class="tag">Final test</span><h1 style="font-size:clamp(30px,4vw,42px);margin-top:10px">CA Foundation: Quantitative Aptitude, final test</h1>' +
        '<ul class="clean" style="margin:14px 0 18px"><li>' + TEST.length + ' multiple-choice questions in random order: 12 Business Mathematics, 6 Logical Reasoning, 12 Statistics (the same 40 : 20 : 40 weighting as the exam)</li><li>Answers are revealed only after you submit</li><li>Pass mark: 70% (' + Math.ceil(TEST.length * PASS) + ' of ' + TEST.length + ')</li><li>No negative marking here, unlike the real exam</li><li>You can review your answers and retake the test</li></ul>' +
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
  function certId() { var c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", s = ""; for (var i = 0; i < 6; i++) s += c[Math.floor(Math.random() * c.length)]; return "CAQ-" + new Date().getFullYear() + "-" + s; }
  function viewCert() {
    if (!passed()) return '<div class="card" style="text-align:center;max-width:640px;margin:30px auto"><div style="font-size:44px">🏅</div><h2>Your certificate is waiting</h2><p class="muted" style="margin:10px 0 18px">Complete all ' + LESSONS.length + ' lessons and score at least 70% in the final test to unlock it.</p><a class="btn btn-accent" href="' + (allDone() ? "#/test" : "#/path") + '">' + (allDone() ? "Take the final test" : "Continue the course") + "</a></div>";
    if (!st.cert) {
      return '<div class="card" style="max-width:620px;margin:0 auto"><span class="tag mint">Passed · ' + (st.test.passScore || st.test.best) + '%</span><h1 style="font-size:clamp(28px,4vw,40px);margin-top:10px">Claim your certificate</h1><p class="muted" style="margin:8px 0 16px">Enter your name exactly as it should appear on the certificate.</p>' +
        '<div class="stack"><div class="field"><label for="cn">Full name</label><input id="cn" maxlength="60" autocomplete="name"></div><div class="field"><label for="ci">Institution (optional)</label><input id="ci" maxlength="80" autocomplete="organization"></div><p id="cerr" class="err"></p><button class="btn btn-accent" id="cgo2">Create my certificate</button></div></div>';
    }
    var c = st.cert;
    return '<div class="cert" id="certv"><div class="small muted" style="letter-spacing:.12em;font-weight:700">AISTUDYTOOLS</div><h2 style="margin-top:6px">Certificate of Completion</h2><p class="muted" style="margin-top:14px">This is to certify that</p><div class="nm">' + esc(c.name) + "</div>" +
      (c.inst ? '<p class="muted">' + esc(c.inst) + "</p>" : "") + '<p style="margin-top:10px">has successfully completed the course</p><h3 style="font-size:26px;margin-top:6px;color:var(--accent-dk)">CA Foundation: Quantitative Aptitude</h3>' +
      '<p class="muted small" style="margin-top:6px">Business Mathematics · Logical Reasoning · Statistics</p><p style="margin-top:12px">with a final test score of <b>' + c.score + "%</b></p>" +
      '<div class="row" style="justify-content:space-between;margin-top:26px;text-align:left"><div class="small"><b>Date:</b> ' + esc(c.date) + "<br><b>Certificate ID:</b> " + esc(c.id) + '</div><div class="small" style="text-align:right;width:220px;max-width:100%">' + SIG_SVG + '<div style="border-top:1px solid #C9CCF7;padding-top:4px;margin-top:2px"><b>Founder</b><br>Intellique Research School</div></div></div></div>' +
      '<div class="row noprint" style="justify-content:center;margin-top:18px"><button class="btn btn-accent" id="cpdf">Download certificate (PDF)</button><button class="btn btn-soft" id="cprint">Print</button></div>' +
      '<p class="small muted noprint" style="text-align:center;margin-top:10px">This is a certificate of completion issued by AIStudyTools, a subsidiary of Intellique Research School Private Limited. It is not an accredited qualification, and it is not issued by or affiliated with the Institute of Chartered Accountants of India (ICAI).</p>';
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
    doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.setTextColor(55, 48, 163); doc.text("CA Foundation: Quantitative Aptitude", W / 2, y + 15, { align: "center" });
    doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(110, 108, 148); doc.text("Business Mathematics  |  Logical Reasoning  |  Statistics", W / 2, y + 23, { align: "center" });
    doc.setFontSize(13); doc.setTextColor(30, 27, 75); doc.text("Final test score: " + c.score + "%", W / 2, y + 33, { align: "center" });
    doc.setFontSize(11); doc.setTextColor(74, 72, 120);
    doc.text("Date: " + c.date, 30, H - 30); doc.text("Certificate ID: " + c.id, 30, H - 24);
    doc.setFont("helvetica", "bold"); doc.setTextColor(30, 27, 75); doc.text("Founder", W - 30, H - 30, { align: "right" });
    doc.setFont("helvetica", "normal"); doc.setTextColor(74, 72, 120); doc.text("Intellique Research School", W - 30, H - 24, { align: "right" });
    doc.setFontSize(8.5); doc.setTextColor(150, 150, 170); doc.text("Certificate of completion issued by AIStudyTools (www.aistudytools.com), a subsidiary of Intellique Research School Private Limited.", W / 2, H - 17, { align: "center" }); doc.text("Not an accredited qualification. Not issued by or affiliated with the Institute of Chartered Accountants of India (ICAI).", W / 2, H - 13, { align: "center" });
    sigPng(function (png) {
      if (png) doc.addImage(png, "PNG", W - 86, H - 48.5, 56, 12.4);
      doc.setDrawColor(201, 204, 247); doc.setLineWidth(0.4); doc.line(W - 86, H - 35, W - 30, H - 35);
      doc.save("CA-Foundation-Quantitative-Aptitude-Certificate-" + c.name.replace(/[^A-Za-z0-9]+/g, "-") + ".pdf");
    });
  }
  function alertBox(msg) { var d = document.createElement("p"); d.className = "err noprint"; d.style.textAlign = "center"; d.textContent = msg; app.appendChild(d); }
  /* ---- glossary ---- */
  function viewGlossary() {
    return '<h1 style="font-size:clamp(30px,4vw,42px)">Glossary</h1><p class="muted" style="margin:8px 0 16px">' + GLOSSARY.length + ' key terms. Search or filter by module.</p>' +
      '<div class="row" style="margin-bottom:16px;flex-wrap:wrap"><input id="gq" placeholder="Search terms or definitions" style="flex:1;min-width:220px;font:inherit;font-size:16px;padding:11px 14px;border:2px solid var(--border);border-radius:14px"><select id="gm" style="font:inherit;font-size:16px;padding:11px 14px;border:2px solid var(--border);border-radius:14px;background:#fff"><option value="">All modules</option>' + MODULES.map(function (m) { return '<option value="' + m.n + '">Module ' + m.n + ": " + m.title + "</option>"; }).join("") + '</select></div><div class="grid g2" id="gl"></div>';
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
    var titles = { home: "CA Foundation: Quantitative Aptitude", path: "Course path", lesson: "Lesson " + (parts[1] || ""), recap: "Module recap", test: "Final test", certificate: "Certificate", glossary: "Glossary" };
    document.title = (titles[r] || "CA Foundation: Quantitative Aptitude") + " | AIStudyTools";
  }
  var lastRoute = "";
  window.addEventListener("hashchange", function () { var r = location.hash; if (r.indexOf("#/test") !== 0) T = T && T.done ? null : T; render(); if (r !== lastRoute) window.scrollTo(0, 0); lastRoute = r; });
  render();
})();
