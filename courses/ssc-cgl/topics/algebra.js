/* SSC CGL · Quant · Algebra. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["algebra"] = {
  id: "algebra", subject: "quant", num: 12, title: "Algebra",
  minutes: 55,
  why: "Algebra gives 2–4 Tier 1 questions and many more in Tier 2. Most are solved with a handful of identities, the x + 1/x ladder and smart substitution.",
  video: "videos/SSC_Q12_Algebra.mp4",
  slides: [
    { h: "Why algebra matters", body: "<p>SSC algebra is mostly about recognising patterns, not long working:</p><ul><li>standard identities</li><li>x + 1/x questions</li><li>a + b + c = 0 tricks</li><li>linear equations and quadratic roots</li><li>the remainder theorem</li></ul><p>Learn the identities by heart and you can answer many questions in under 30 seconds.</p>" },
    { h: "The key identities", body: "<p class='f'>(a + b)² = a² + 2ab + b² &nbsp;&nbsp; (a − b)² = a² − 2ab + b²</p><p class='f'>a² − b² = (a + b)(a − b)</p><p class='f'>(a + b)³ = a³ + b³ + 3ab(a + b)</p><p class='f'>a³ + b³ = (a + b)(a² − ab + b²) &nbsp;&nbsp; a³ − b³ = (a − b)(a² + ab + b²)</p><p>Fast squares: 103² = (100 + 3)² = 10,000 + 600 + 9 = <b>10,609</b>.</p>", viz: { type: "sq", a: 3, b: 2 } },
    { h: "Using identities with given values", body: "<p>If a + b = 7 and ab = 12, then a² + b² = (a + b)² − 2ab = 49 − 24 = <b>25</b>.</p><p>If a + b = 5 and a³ + b³ = 35: 35 = 125 − 3ab × 5 → ab = <b>6</b>.</p>",
      ask: { q: "a − b = 3 and ab = 10. Find a² + b².", a: "(a − b)² + 2ab = 9 + 20 = 29." } },
    { h: "The x + 1/x ladder", body: "<p>If x + 1/x = k:</p><p class='f'>x² + 1/x² = k² − 2 &nbsp;&nbsp; x³ + 1/x³ = k³ − 3k</p><p>x + 1/x = 3 → x² + 1/x² = 7, x³ + 1/x³ = 27 − 9 = 18.</p><p>If x − 1/x = k, then x² + 1/x² = k² + 2.</p><p class='warn'>x + 1/x = 2 means x = 1, so every power gives 2.</p>",
      ask: { q: "x − 1/x = 4. Find x² + 1/x².", a: "4² + 2 = 18." } },
    { h: "When a + b + c = 0", body: "<p class='f'>a³ + b³ + c³ − 3abc = (a + b + c)(a² + b² + c² − ab − bc − ca)</p><p>So if a + b + c = 0, then <b>a³ + b³ + c³ = 3abc</b>.</p><p>And if a² + b² + c² = ab + bc + ca, then a = b = c.</p>",
      ask: { q: "a + b + c = 0 and abc = 4. Find a³ + b³ + c³.", a: "3 × 4 = 12." } },
    { h: "Linear equations", body: "<p>Solve 2x + 3y = 12 and x − y = 1.</p><ul><li>From the second: x = y + 1.</li><li>Substitute: 2(y + 1) + 3y = 12 → 5y = 10 → y = 2, x = 3.</li></ul><p>Or eliminate: multiply the second by 3 and add.</p><p>Each equation is a straight line; the answer is where they cross.</p>",
      ask: { q: "3x + 2y = 18 and 2x − y = 5. Find y.", a: "y = 2x − 5 → 3x + 4x − 10 = 18 → x = 4, y = 3." } },
    { h: "Quadratic equations", body: "<p>For ax² + bx + c = 0:</p><p class='f'>Sum of roots = −b/a &nbsp;&nbsp; Product = c/a</p><p>x² − 5x + 6 = 0 = (x − 2)(x − 3) → roots 2 and 3 (sum 5, product 6).</p><p class='f'>x = [−b ± √(b² − 4ac)] ÷ 2a</p>",
      ask: { q: "Find the sum of the roots of 2x² − 8x + 3 = 0.", a: "−(−8)/2 = 4." } },
    { h: "Remainder theorem", body: "<p>When p(x) is divided by (x − a), the remainder is <b>p(a)</b>.</p><p>p(x) = x³ − 2x² + 3x − 5 divided by (x − 2): p(2) = 8 − 8 + 6 − 5 = <b>1</b>.</p><p>For (x + 1), use p(−1). If p(a) = 0, then (x − a) is a factor.</p>",
      ask: { q: "Find the remainder when x⁴ − 3x² + 2x + 1 is divided by (x + 1).", a: "p(−1) = 1 − 3 − 2 + 1 = −3." } },
    { h: "Substitute easy values", body: "<p>When a question works for <b>any</b> values that fit the condition, pick simple ones.</p><ul><li>a + b + c = 0 → try a = 1, b = 1, c = −2.</li><li>x + 1/x = 2 → x = 1.</li><li>x = 2 + √3 → 1/x = 2 − √3, so x + 1/x = 4.</li></ul><p>Then check which option matches.</p>" },
    { h: "Exam strategy", body: "<ul><li>Write the identity you need before substituting.</li><li>x + 1/x = k: square for the 2nd power, cube for the 3rd.</li><li>Test options or pick values when allowed.</li><li>Remainder theorem: just evaluate p(a).</li></ul><p>Next: try the <b>Try it</b> tools, then the practice set.</p>" }
  ],
  tools: ["identity", "xinv", "lin2", "quadr"],
  formulas: [
    ["(a ± b)²", "a² ± 2ab + b²"],
    ["a² − b²", "(a + b)(a − b)"],
    ["(a ± b)³", "a³ ± b³ ± 3ab(a ± b)"],
    ["a³ ± b³", "(a ± b)(a² ∓ ab + b²)"],
    ["a² + b² from a + b and ab", "(a + b)² − 2ab"],
    ["x + 1/x = k", "x² + 1/x² = k² − 2; x³ + 1/x³ = k³ − 3k"],
    ["x − 1/x = k", "x² + 1/x² = k² + 2; x³ − 1/x³ = k³ + 3k"],
    ["a + b + c = 0", "a³ + b³ + c³ = 3abc"],
    ["a² + b² + c² = ab + bc + ca", "a = b = c"],
    ["ax² + bx + c = 0", "sum = −b/a, product = c/a"],
    ["Roots", "[−b ± √(b² − 4ac)] ÷ 2a"],
    ["Remainder theorem", "p(x) ÷ (x − a) leaves p(a)"]
  ],
  /* a: index of the correct option is always 0 here; options are shuffled on screen */
  practice: [
    { q: "If a + b = 7 and ab = 12, then a² + b² = ?", o: ["25", "37", "49", "13"], why: "(a + b)² − 2ab = 49 − 24 = 25.", hint: "Start from (a + b)²." },
    { q: "If x + 1/x = 3, then x² + 1/x² = ?", o: ["7", "9", "11", "5"], why: "3² − 2 = 7.", hint: "Square both sides." },
    { q: "If x + 1/x = 3, then x³ + 1/x³ = ?", o: ["18", "27", "24", "36"], why: "k³ − 3k = 27 − 9 = 18.", hint: "Cube both sides." },
    { q: "If a + b + c = 0 and abc = 4, then a³ + b³ + c³ = ?", o: ["12", "4", "0", "64"], why: "a³ + b³ + c³ = 3abc = 12.", hint: "Use the a + b + c = 0 result." },
    { q: "If 2x + 3y = 12 and x − y = 1, then x = ?", o: ["3", "2", "4", "1"], why: "x = y + 1 → 5y + 2 = 12 → y = 2, x = 3.", hint: "Substitute x = y + 1." },
    { q: "The roots of x² − 5x + 6 = 0 are…", o: ["2 and 3", "−2 and −3", "1 and 6", "−1 and 6"], why: "(x − 2)(x − 3) = 0.", hint: "Two numbers with sum 5 and product 6." },
    { q: "The remainder when x³ − 2x² + 3x − 5 is divided by (x − 2) is…", o: ["1", "−1", "3", "5"], why: "p(2) = 8 − 8 + 6 − 5 = 1.", hint: "Put x = 2." },
    { q: "103² = ?", o: ["10609", "10600", "10906", "10069"], why: "(100 + 3)² = 10,000 + 600 + 9.", hint: "Use (a + b)²." },
    { q: "If a − b = 3 and ab = 10, then a² + b² = ?", o: ["29", "19", "9", "39"], why: "(a − b)² + 2ab = 9 + 20.", hint: "Start from (a − b)²." },
    { q: "999² − 1 = ?", o: ["998000", "999000", "997999", "998001"], why: "(999 − 1)(999 + 1) = 998 × 1,000.", hint: "a² − b²." }
  ],
  test: {
    minutes: 9, right: 2, wrong: 0.5,
    items: [
      { q: "If x − 1/x = 4, then x² + 1/x² = ?", o: ["18", "16", "14", "20"], why: "k² + 2 = 16 + 2 = 18." },
      { q: "If a + b = 5 and a³ + b³ = 35, then ab = ?", o: ["6", "5", "4", "10"], why: "a³ + b³ = (a + b)³ − 3ab(a + b) → 35 = 125 − 15ab → ab = 6." },
      { q: "If x + 1/x = 2, then x¹⁰ + 1/x¹⁰ = ?", o: ["2", "1", "1024", "0"], why: "x + 1/x = 2 means x = 1, so 1 + 1 = 2." },
      { q: "The sum of the roots of 2x² − 8x + 3 = 0 is…", o: ["4", "−4", "3/2", "8"], why: "−b/a = 8/2 = 4." },
      { q: "If x = 2 + √3, then x + 1/x = ?", o: ["4", "2√3", "2", "4 + 2√3"], why: "1/x = 2 − √3, so the sum is 4." },
      { q: "(0.75³ + 0.25³) ÷ (0.75² − 0.75 × 0.25 + 0.25²) = ?", o: ["1", "0.5", "0.25", "2"], why: "(a³ + b³) ÷ (a² − ab + b²) = a + b = 1." },
      { q: "If 3x + 2y = 18 and 2x − y = 5, then y = ?", o: ["3", "4", "2", "5"], why: "y = 2x − 5 → 7x − 10 = 18 → x = 4, y = 3." },
      { q: "If a² + b² + c² = ab + bc + ca and a = 4, then a + b + c = ?", o: ["12", "4", "8", "0"], why: "The condition means a = b = c = 4." },
      { q: "The remainder when x⁴ − 3x² + 2x + 1 is divided by (x + 1) is…", o: ["−3", "1", "3", "−1"], why: "p(−1) = 1 − 3 − 2 + 1 = −3." },
      { q: "If x + y = 10 and xy = 21, then x² + y² = ?", o: ["58", "79", "121", "42"], why: "100 − 2 × 21 = 58." }
    ]
  }
};
