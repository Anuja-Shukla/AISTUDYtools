/* SSC CGL · Quant · Simplification & BODMAS. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["simplification"] = {
  id: "simplification", subject: "quant", num: 2, title: "Simplification & BODMAS",
  minutes: 45,
  why: "Simplification and approximation give quick marks in Tier 1, and fast calculation saves time in every other Quant question.",
  video: "videos/SSC_Q02_Simplification.mp4",
  slides: [
    { h: "Why simplification matters", body: "<p>Simplification questions test two things:</p><ul><li>doing operations in the <b>right order</b> (BODMAS)</li><li>calculating <b>fast</b>: fractions, decimals, squares, roots and shortcuts</li></ul><p>They are the quickest marks in the paper, and the same speed helps in every arithmetic topic.</p>" },
    { h: "The order: VBODMAS", body: "<p>Solve in this order:</p><ol><li><b>V</b>inculum (bar over numbers)</li><li><b>B</b>rackets: ( ) first, then { }, then [ ]</li><li><b>O</b>f</li><li><b>D</b>ivision and <b>M</b>ultiplication, left to right</li><li><b>A</b>ddition and <b>S</b>ubtraction, left to right</li></ol><p>18 ÷ 3 × 2 + 4 − 6 → 6 × 2 + 4 − 6 → 12 + 4 − 6 = <b>10</b>.</p><p class='warn'>÷ does not always come before ×. Go left to right.</p>",
      ask: { q: "Simplify 24 ÷ 4 × 3 − 2.", a: "Left to right: 24 ÷ 4 = 6, 6 × 3 = 18, 18 − 2 = 16." } },
    { h: "“Of” and the vinculum", body: "<p><b>Of</b> means multiply, but it comes <b>before</b> ÷ and ×.</p><p>1001 ÷ 11 of 13 = 1001 ÷ (11 × 13) = 1001 ÷ 143 = <b>7</b> (not 1001 ÷ 11 × 13).</p><p>A <b>vinculum</b> (bar) acts like a bracket and is solved first: 6 − <span style='text-decoration:overline'>4 − 1</span> = 6 − 3 = 3.</p>",
      ask: { q: "Simplify 3/4 of 120 ÷ 9 + 5.", a: "“Of” first: 90. Then 90 ÷ 9 = 10, and 10 + 5 = 15." } },
    { h: "Brackets from the inside out", body: "<p>20 − [12 − {8 − (6 − <span style='text-decoration:overline'>4 − 1</span>)}]</p><ul><li>Bar: 4 − 1 = 3</li><li>( ): 6 − 3 = 3</li><li>{ }: 8 − 3 = 5</li><li>[ ]: 12 − 5 = 7</li><li>20 − 7 = <b>13</b></li></ul><p>Write each step on a new line in rough work. Most mistakes are sign mistakes.</p>" },
    { h: "Fractions and decimals", body: "<ul><li>Add or subtract: make the denominators equal (use the LCM).</li><li>Divide by a fraction: multiply by its reciprocal. 1/3 ÷ 1/4 = 1/3 × 4 = 4/3.</li><li>Change decimals to fractions to cancel: 0.125 = 1/8, 0.375 = 3/8, 0.04 = 1/25.</li></ul><p>1/2 + 1/3 ÷ 1/4 × 1/5 = 1/2 + 4/3 × 1/5 = 1/2 + 4/15 = <b>23/30</b>.</p>",
      ask: { q: "Simplify 0.125 × 48 + 0.375 × 16.", a: "1/8 × 48 = 6 and 3/8 × 16 = 6, so the answer is 12." } },
    { h: "Recurring decimals", body: "<p class='f'>0.ab̅ (all digits repeat) = ab ÷ 99</p><p class='f'>0.ab̅ (only b repeats) = (ab − a) ÷ 90</p><p>0.3̅6̅ = 36/99 = <b>4/11</b>. &nbsp; 0.16̅ = (16 − 1)/90 = 15/90 = <b>1/6</b>.</p><p>One 9 for each repeating digit, one 0 for each non-repeating digit after the point.</p>",
      ask: { q: "Write 0.4̅ as a fraction.", a: "4/9." } },
    { h: "Squares, roots and indices", body: "<ul><li>Learn squares up to 30 and cubes up to 15.</li><li>√ of a perfect square: the last digit narrows it down. √1764: 40² = 1600 and 45² = 2025, last digit 4 → 42 or 48 → <b>42</b>.</li><li>Indices: a<sup>m</sup> × a<sup>n</sup> = a<sup>m+n</sup>, (a<sup>m</sup>)<sup>n</sup> = a<sup>mn</sup>, a<sup>m/n</sup> = (ⁿ√a)<sup>m</sup>.</li></ul><p>64<sup>2/3</sup> = (∛64)² = 4² = <b>16</b>.</p>",
      ask: { q: "Find (256)^0.25 × (81)^0.5.", a: "256^(1/4) = 4 and 81^(1/2) = 9, so 4 × 9 = 36." } },
    { h: "Speed multiplication", body: "<ul><li><b>Near 100</b>: 98 × 102 = 100² − 2² = <b>9,996</b>.</li><li><b>a² − b²</b>: 47 × 53 = 50² − 3² = 2,500 − 9 = <b>2,491</b>.</li><li><b>× 99</b>: 47 × 99 = 4,700 − 47 = 4,653. <b>× 999</b>: 47,000 − 47.</li><li><b>× 25</b>: multiply by 100, divide by 4. 48 × 25 = 4,800 ÷ 4 = 1,200.</li><li><b>Same tens, units add to 10</b>: 64 × 66 → 6 × 7 = 42, 4 × 6 = 24 → <b>4,224</b>.</li></ul>",
      ask: { q: "Find 104 × 107 quickly.", a: "Base 100: 104 + 7 = 111, and 4 × 7 = 28, so 11,128." } },
    { h: "Approximation (≈) questions", body: "<p>When the question says “approximately”, round each number first:</p><p>39.97% of 600.12 + 14.98 × 7.99 ≈ 40% of 600 + 15 × 8 = 240 + 120 = <b>360</b>.</p><ul><li>Round to the nearest easy number (whole number, 10, a perfect square).</li><li>Options are usually far apart, so a close estimate is enough.</li></ul>",
      ask: { q: "Approximately: √4899 + 25.02 × 3.98.", a: "√4900 = 70 and 25 × 4 = 100, so about 170." } },
    { h: "Continued fractions", body: "<p>Work from the <b>bottom</b> up:</p><p>3 + 1/(3 + 1/(3 + 1/3))</p><ul><li>3 + 1/3 = 10/3</li><li>3 + 3/10 = 33/10</li><li>3 + 10/33 = <b>109/33</b></li></ul>" },
    { h: "Exam strategy", body: "<ul><li>Write VBODMAS at the top of your rough sheet until it is automatic.</li><li>Convert decimals to fractions before multiplying.</li><li>For ≈ questions, round first and check which option is closest.</li><li>Spend no more than 30–40 seconds; if stuck, move on.</li></ul><p>Next: try the <b>Try it</b> tools, then the practice set.</p>" }
  ],
  tools: ["bodmas", "recur", "speedx", "sqsprint"],
  formulas: [
    ["Order", "Vinculum → Brackets ( ) { } [ ] → Of → ÷ and × (left to right) → + and − (left to right)"],
    ["“Of”", "multiply, done before ÷ and ×"],
    ["Divide by a fraction", "multiply by its reciprocal"],
    ["0.ab̅ (all repeat)", "ab ÷ 99"],
    ["0.ab̅ (b repeats)", "(ab − a) ÷ 90"],
    ["Common decimals", "0.125 = 1/8 · 0.375 = 3/8 · 0.625 = 5/8 · 0.04 = 1/25 · 0.0625 = 1/16"],
    ["Indices", "aᵐ × aⁿ = aᵐ⁺ⁿ · (aᵐ)ⁿ = aᵐⁿ · a^(m/n) = (ⁿ√a)ᵐ · a⁰ = 1"],
    ["a² − b²", "(a + b)(a − b): 47 × 53 = 50² − 3²"],
    ["Near a base", "(100 + x)(100 + y) = (100 + x + y) × 100 + xy"],
    ["× 99 / × 999 / × 25", "× 100 − n / × 1000 − n / × 100 ÷ 4"],
    ["Same tens, units add to 10", "tens × (tens + 1), then units × units"],
    ["Continued fraction", "solve from the bottom up"]
  ],
  /* a: index of the correct option is always 0 here; options are shuffled on screen */
  practice: [
    { q: "Simplify 18 ÷ 3 × 2 + 4 − 6.", o: ["10", "1", "7", "4"], why: "Left to right: 18 ÷ 3 = 6, 6 × 2 = 12, then 12 + 4 − 6 = 10.", hint: "÷ and × have equal rank: go left to right." },
    { q: "Simplify 3/4 of 120 ÷ 9 + 5.", o: ["15", "45", "10", "50"], why: "“Of” first: 3/4 of 120 = 90. Then 90 ÷ 9 = 10, and 10 + 5 = 15.", hint: "“Of” comes before ÷." },
    { q: "Simplify 20 − [12 − {8 − (6 − 3)}].", o: ["13", "7", "11", "9"], why: "(6 − 3) = 3, {8 − 3} = 5, [12 − 5] = 7, 20 − 7 = 13.", hint: "Open the innermost bracket first." },
    { q: "0.363636… written as a fraction is…", o: ["4/11", "9/25", "36/100", "2/11"], why: "Both digits repeat: 36/99 = 4/11.", hint: "Two repeating digits → divide by 99." },
    { q: "0.1666… written as a fraction is…", o: ["1/6", "4/25", "1/9", "16/99"], why: "Only 6 repeats: (16 − 1)/90 = 15/90 = 1/6.", hint: "One non-repeating digit and one repeating digit → 90." },
    { q: "98 × 102 = ?", o: ["9996", "10004", "9994", "9896"], why: "(100 − 2)(100 + 2) = 100² − 2² = 10,000 − 4 = 9,996.", hint: "Use a² − b²." },
    { q: "√1764 = ?", o: ["42", "38", "44", "48"], why: "40² = 1,600 and 45² = 2,025. A square ending in 4 has a root ending in 2 or 8, so 42 (42² = 1,764).", hint: "Find the two tens it lies between." },
    { q: "(64)^(2/3) = ?", o: ["16", "8", "32", "4"], why: "∛64 = 4, and 4² = 16.", hint: "a^(m/n) = (n-th root of a)^m." },
    { q: "999 × 47 = ?", o: ["46953", "46947", "47953", "46943"], why: "47 × 1,000 − 47 = 47,000 − 47 = 46,953.", hint: "999 = 1,000 − 1." },
    { q: "Approximately, 39.97% of 600.12 + 14.98 × 7.99 = ?", o: ["360", "340", "400", "320"], why: "40% of 600 = 240 and 15 × 8 = 120. 240 + 120 = 360.", hint: "Round every number first." }
  ],
  test: {
    minutes: 8, right: 2, wrong: 0.5,
    items: [
      { q: "Simplify 1/2 + 1/3 ÷ 1/4 × 1/5.", o: ["23/30", "1/30", "7/12", "17/30"], why: "1/3 ÷ 1/4 = 4/3, then 4/3 × 1/5 = 4/15. 1/2 + 4/15 = 15/30 + 8/30 = 23/30." },
      { q: "Simplify 5 + 5 × 5 − 5 ÷ 5.", o: ["29", "49", "9", "25"], why: "5 × 5 = 25 and 5 ÷ 5 = 1, so 5 + 25 − 1 = 29." },
      { q: "(0.75 × 0.75 − 0.25 × 0.25) ÷ (0.75 − 0.25) = ?", o: ["1", "0.5", "1.5", "0.25"], why: "a² − b² = (a + b)(a − b), so the answer is a + b = 0.75 + 0.25 = 1." },
      { q: "2.444… + 1.333… = ?", o: ["34/9", "37/10", "7/2", "11/3"], why: "2.4̅ = 22/9 and 1.3̅ = 12/9. Sum = 34/9." },
      { q: "√0.0169 = ?", o: ["0.13", "0.013", "1.3", "0.41"], why: "0.0169 = 169/10,000, so the root is 13/100 = 0.13." },
      { q: "If 2^x = 32 and 3^y = 81, then x + y = ?", o: ["9", "20", "8", "10"], why: "32 = 2⁵ and 81 = 3⁴, so x + y = 5 + 4 = 9." },
      { q: "3 + 1/(3 + 1/(3 + 1/3)) = ?", o: ["109/33", "33/10", "10/33", "100/33"], why: "From the bottom: 3 + 1/3 = 10/3; 3 + 3/10 = 33/10; 3 + 10/33 = 109/33." },
      { q: "Simplify 1001 ÷ 11 of 13.", o: ["7", "1183", "91", "13"], why: "“Of” first: 11 of 13 = 143. 1001 ÷ 143 = 7." },
      { q: "Approximately, √4899 + 25.02 × 3.98 = ?", o: ["170", "150", "190", "210"], why: "√4900 = 70 and 25 × 4 = 100, so about 170." },
      { q: "(256)^0.25 × (81)^0.5 = ?", o: ["36", "12", "24", "81"], why: "256^(1/4) = 4 and 81^(1/2) = 9. 4 × 9 = 36." }
    ]
  }
};
