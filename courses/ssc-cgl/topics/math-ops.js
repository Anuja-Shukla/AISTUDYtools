/* SSC CGL · Reasoning · Mathematical operations. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["math-ops"] = {
  id: "math-ops", subject: "reasoning", num: 8, title: "Mathematical operations",
  minutes: 30,
  why: "Mathematical operations gives 1–2 Tier 1 marks. Signs are swapped or given new meanings, and you evaluate with BODMAS. Rewrite first, then calculate.",
  video: "videos/SSC_R08_Math_Operations.mp4",
  slides: [
    { h: "Three question types", body: "<ul><li><b>Changed meanings</b>: “+ means ×, × means −” …</li><li><b>Interchange</b>: which two signs must be swapped to make the equation true?</li><li><b>Hidden rule</b>: 2 * 3 = 13, 4 * 5 = 41, so 3 * 4 = ?</li></ul><p>All three end with BODMAS.</p>" },
    { h: "BODMAS first", body: "<p>Order: Brackets → Of → Division and Multiplication (left to right) → Addition and Subtraction (left to right).</p><p>18 − 12 ÷ 4 × 2 + 3</p><p>= 18 − 3 × 2 + 3 = 18 − 6 + 3 = <b>15</b></p>",
      ask: { q: "7 + 3 × 2 − 8 ÷ 4 = ?", a: "7 + 6 − 2 = 11." } },
    { h: "Changed meanings: rewrite first", body: "<p>“+ means ×, × means −, − means ÷, ÷ means +”</p><p>8 + 4 × 6 − 2 ÷ 5 becomes</p><p>8 × 4 − 6 ÷ 2 + 5 = 32 − 3 + 5 = <b>34</b></p><p>Rewrite the whole line before you calculate. Never mix the two steps.</p>" },
    { h: "Letter symbols", body: "<p>P means +, Q means −, R means ×, S means ÷.</p><p>20 S 4 R 3 P 6 Q 2 = 20 ÷ 4 × 3 + 6 − 2</p><p>= 15 + 6 − 2 = <b>19</b></p>" },
    { h: "Interchange signs", body: "<p>“Which two signs must be swapped to make 12 ÷ 4 + 3 × 2 = 11 true?”</p><p>Try each option: swap + and × → 12 ÷ 4 × 3 + 2 = 9 + 2 = <b>11</b> ✓</p><p>Tip: the answer must be near the right-hand side, so test the options that change the biggest term first.</p>" },
    { h: "Hidden rules", body: "<p>2 * 3 = 13 and 4 * 5 = 41. Try common rules:</p><ul><li>a² + b²: 4 + 9 = 13 ✓, 16 + 25 = 41 ✓</li></ul><p>So 3 * 4 = 9 + 16 = <b>25</b>.</p><p>Common rules: a² ± b², a × b ± a, 2a + b, (a + b)², a² ÷ b.</p>",
      ask: { q: "5 # 3 = 16 and 7 # 2 = 45. 6 # 4 = ?", a: "a² − b² → 36 − 16 = 20." } },
    { h: "Exam strategy", body: "<ul><li>Rewrite with the real signs, then BODMAS.</li><li>For swaps, test each option quickly; reject any that give a fraction.</li><li>For hidden rules, test the rule on both examples.</li><li>Never solve left to right without BODMAS.</li></ul>" }
  ],
  tools: ["opmean", "bodmas", "swapfind", "rulefind"],
  formulas: [
    ["BODMAS", "Brackets → Of → ÷ × (left to right) → + − (left to right)"],
    ["Changed meanings", "rewrite the whole line, then calculate"],
    ["Interchange", "swap both signs everywhere they appear"],
    ["Hidden rules", "a² + b², a² − b², ab + a, 2a + b, (a + b)²"]
  ],
  practice: [
    { q: "If + means ×, × means −, − means ÷ and ÷ means +, then 8 + 4 × 6 − 2 ÷ 5 = ?", o: ["34", "30", "22", "40"], why: "8 × 4 − 6 ÷ 2 + 5 = 32 − 3 + 5.", hint: "Rewrite first." },
    { q: "If × means + and + means ×, then 5 × 3 + 2 = ?", o: ["11", "16", "13", "30"], why: "5 + 3 × 2 = 11.", hint: "Then BODMAS." },
    { q: "Which two signs must be interchanged to make 12 ÷ 4 + 3 × 2 = 11 correct?", o: ["+ and ×", "÷ and ×", "+ and ÷", "÷ and +"], why: "12 ÷ 4 × 3 + 2 = 9 + 2 = 11.", hint: "Test each option." },
    { q: "18 − 12 ÷ 4 × 2 + 3 = ?", o: ["15", "3", "9", "21"], why: "18 − 6 + 3.", hint: "÷ and × left to right." },
    { q: "P means +, Q means −, R means ×, S means ÷. 20 S 4 R 3 P 6 Q 2 = ?", o: ["19", "17", "21", "15"], why: "20 ÷ 4 × 3 + 6 − 2 = 19.", hint: "Replace the letters." },
    { q: "If 2 * 3 = 13 and 4 * 5 = 41, then 3 * 4 = ?", o: ["25", "12", "49", "7"], why: "a² + b².", hint: "Squares." },
    { q: "If 5 # 3 = 16 and 7 # 2 = 45, then 6 # 4 = ?", o: ["20", "52", "10", "24"], why: "a² − b².", hint: "Difference of squares." },
    { q: "7 + 3 × 2 − 8 ÷ 4 = ?", o: ["11", "3", "18", "13"], why: "7 + 6 − 2.", hint: "BODMAS." },
    { q: "If a $ b = a × b + a, then 4 $ 5 = ?", o: ["24", "20", "29", "25"], why: "20 + 4.", hint: "Apply the rule." },
    { q: "If − means +, + means −, then 15 − 5 + 8 = ?", o: ["12", "18", "28", "2"], why: "15 + 5 − 8 = 12.", hint: "Swap the two signs." }
  ],
  test: {
    minutes: 6, right: 2, wrong: 0.5,
    items: [
      { q: "If + means −, − means ×, × means ÷, ÷ means +, then 30 × 5 + 4 − 2 ÷ 6 = ?", o: ["4", "8", "16", "2"], why: "30 ÷ 5 − 4 × 2 + 6 = 6 − 8 + 6." },
      { q: "24 ÷ 6 × 3 + 2 − 5 = ?", o: ["9", "1", "12", "8"], why: "4 × 3 + 2 − 5." },
      { q: "If × means +, + means ×, − means ÷, ÷ means −, then 6 × 4 + 3 − 2 ÷ 1 = ?", o: ["11", "12", "10", "15"], why: "6 + 4 × 3 ÷ 2 − 1 = 6 + 6 − 1." },
      { q: "If 3 @ 4 = 25 and 5 @ 12 = 169, then 6 @ 8 = ?", o: ["100", "48", "14", "196"], why: "a² + b²." },
      { q: "If a ★ b = 2a + b, then 7 ★ 3 = ?", o: ["17", "13", "20", "21"], why: "14 + 3." },
      { q: "Which two signs must be interchanged to make 12 + 6 × 14 ÷ 3 = 31 correct?", o: ["+ and ÷", "+ and ×", "× and ÷", "+ and −"], why: "12 ÷ 6 × 14 + 3 = 28 + 3." },
      { q: "50 − 10 × 3 + 12 ÷ 4 = ?", o: ["23", "123", "33", "17"], why: "50 − 30 + 3." },
      { q: "A means ÷, B means ×, C means +, D means −. 36 A 6 B 2 C 5 D 3 = ?", o: ["14", "8", "16", "6"], why: "36 ÷ 6 × 2 + 5 − 3 = 12 + 2." },
      { q: "If 8 & 2 = 32 and 9 & 3 = 27, then 10 & 5 = ?", o: ["20", "50", "15", "25"], why: "a² ÷ b: 100 ÷ 5." },
      { q: "Which two signs must be interchanged to make 11 ÷ 4 + 5 − 18 = 31 correct?", o: ["÷ and ×", "+ and −", "÷ and +", "− and ÷"], why: "11 × 4 + 5 − 18 = 31." }
    ]
  }
};
