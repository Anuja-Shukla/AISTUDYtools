/* SSC CGL · Reasoning · Number, letter & figure series. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["series"] = {
  id: "series", subject: "reasoning", num: 3, title: "Number, letter & figure series",
  minutes: 40,
  why: "Series questions give 2–3 Tier 1 marks: find the next term, a missing term or the wrong term. A short checklist of patterns solves almost all of them.",
  video: "videos/SSC_R03_Series.mp4",
  slides: [
    { h: "Why series matter", body: "<p>A series follows a hidden rule. You are asked to find:</p><ul><li>the <b>next</b> term</li><li>a <b>missing</b> term in the middle</li><li>the <b>wrong</b> term that breaks the rule</li></ul><p>Work through a checklist: differences → ratios → squares/cubes → alternating series.</p>" },
    { h: "Step 1: differences", body: "<p>Write the gaps between terms.</p><p>2, 5, 10, 17, 26 → gaps +3, +5, +7, +9 → next gap +11 → <b>37</b>.</p><p>If the gaps are not simple, take the gaps of the gaps (second differences).</p><p>3, 4, 8, 17, 33 → +1, +4, +9, +16 (squares) → next +25 → <b>58</b>.</p>",
      ask: { q: "7, 12, 19, 28, 39, ?", a: "Gaps 5, 7, 9, 11 → next 13 → 52." } },
    { h: "Step 2: ratios", body: "<p>If terms grow fast, divide instead of subtracting.</p><ul><li>3, 6, 12, 24 → × 2 → <b>48</b></li><li>1, 2, 6, 24, 120 → × 2, × 3, × 4, × 5 → <b>720</b></li><li>1, 3, 7, 15, 31 → × 2 + 1 → <b>63</b></li><li>6, 11, 21, 41, 81 → × 2 − 1 → <b>161</b></li></ul>" },
    { h: "Step 3: squares, cubes and primes", body: "<ul><li>1, 8, 27, 64 → cubes → <b>125</b></li><li>4, 9, 25, 49 → squares of primes (2, 3, 5, 7) → <b>121</b></li><li>2, 6, 12, 20, 30 → n(n + 1) → <b>42</b></li><li>0, 7, 26, 63 → n³ − 1 → <b>124</b></li><li>120, 99, 80, 63, 48 → 11² − 1, 10² − 1 … → <b>35</b></li></ul>" },
    { h: "Step 4: alternating series", body: "<p>If nothing fits, split the series into odd and even positions.</p><p>2, 10, 4, 20, 6, 30, ? → (2, 4, 6, …) and (10, 20, 30) → next is <b>8</b>.</p>", viz: { type: "alt", v: [2, 10, 4, 20, 6, 30] } },
    { h: "Letter series", body: "<p>Change letters to positions (A = 1 … Z = 26) and look at the gaps.</p><ul><li>A, C, F, J, O → +2, +3, +4, +5 → +6 → <b>U</b></li><li>Z, X, V, T → −2 each → <b>R</b></li><li>AZ, BY, CX → first letter +1, second −1 → <b>DW</b></li></ul>",
      ask: { q: "B, E, H, K, ?", a: "+3 each → N." } },
    { h: "Wrong term", body: "<p>Find the rule using most terms, then the term that does not fit.</p><p>1, 4, 9, <b>15</b>, 25, 36 → squares; 15 should be 16.</p><p>Tip: check from both ends; the wrong term usually breaks two gaps at once.</p>" },
    { h: "Exam strategy", body: "<ul><li>Differences first, then ratios, then squares/cubes, then alternating.</li><li>Fast growth → multiplication; slow growth → addition.</li><li>Letters → positions.</li><li>Verify your rule on every term before answering.</li></ul><p>Next: try the <b>Try it</b> tools, then the practice set.</p>" }
  ],
  tools: ["sdiff", "lser", "altsplit", "sergame"],
  formulas: [
    ["Checklist", "differences → second differences → ratios → squares/cubes → alternating"],
    ["Common patterns", "× k ± c; n², n³, n² ± 1, n³ ± 1, n(n + 1); primes"],
    ["Factorial", "1, 2, 6, 24, 120, 720"],
    ["Letters", "use positions A = 1 … Z = 26; opposites add to 27"],
    ["Wrong term", "the one that breaks two consecutive gaps"]
  ],
  /* a: index of the correct option is always 0 here; options are shuffled on screen */
  practice: [
    { q: "2, 5, 10, 17, 26, ?", o: ["37", "35", "36", "39"], why: "Gaps 3, 5, 7, 9, 11.", hint: "Odd-number gaps." },
    { q: "3, 6, 12, 24, ?", o: ["48", "36", "30", "42"], why: "× 2.", hint: "Divide each term by the previous." },
    { q: "1, 3, 7, 15, 31, ?", o: ["63", "62", "47", "61"], why: "× 2 + 1.", hint: "Double and add." },
    { q: "1, 8, 27, 64, ?", o: ["125", "100", "81", "216"], why: "Cubes.", hint: "n³." },
    { q: "2, 10, 4, 20, 6, 30, ?", o: ["8", "40", "12", "36"], why: "Odd positions: 2, 4, 6, 8.", hint: "Split into two series." },
    { q: "A, C, F, J, O, ?", o: ["U", "T", "V", "S"], why: "Gaps +2, +3, +4, +5, +6.", hint: "Use positions." },
    { q: "5, 11, 23, 47, ?", o: ["95", "94", "71", "96"], why: "× 2 + 1.", hint: "Double and add 1." },
    { q: "2, 3, 5, 7, 11, ?", o: ["13", "12", "15", "17"], why: "Prime numbers.", hint: "Primes." },
    { q: "Z, X, V, T, ?", o: ["R", "S", "Q", "P"], why: "−2 each.", hint: "Going backwards." },
    { q: "4, 9, 25, 49, ?", o: ["121", "81", "64", "100"], why: "Squares of primes 2, 3, 5, 7, 11.", hint: "Square roots are 2, 3, 5, 7." }
  ],
  test: {
    minutes: 7, right: 2, wrong: 0.5,
    items: [
      { q: "7, 12, 19, 28, 39, ?", o: ["52", "50", "51", "54"], why: "Gaps 5, 7, 9, 11, 13." },
      { q: "120, 99, 80, 63, 48, ?", o: ["35", "36", "33", "37"], why: "n² − 1 for n = 11 down to 6." },
      { q: "1, 2, 6, 24, 120, ?", o: ["720", "600", "240", "840"], why: "× 2, × 3, × 4, × 5, × 6." },
      { q: "3, 4, 8, 17, 33, ?", o: ["58", "49", "56", "66"], why: "Gaps are squares 1, 4, 9, 16, 25." },
      { q: "Find the wrong term: 1, 4, 9, 15, 25, 36", o: ["15", "9", "25", "36"], why: "Squares; 15 should be 16." },
      { q: "B, E, H, K, ?", o: ["N", "M", "O", "L"], why: "+3 each." },
      { q: "6, 11, 21, 41, 81, ?", o: ["161", "162", "121", "160"], why: "× 2 − 1." },
      { q: "2, 6, 12, 20, 30, ?", o: ["42", "40", "36", "44"], why: "n(n + 1)." },
      { q: "AZ, BY, CX, ?", o: ["DW", "DX", "EW", "DV"], why: "First letter +1, second letter −1." },
      { q: "0, 7, 26, 63, ?", o: ["124", "125", "99", "100"], why: "n³ − 1." }
    ]
  }
};
