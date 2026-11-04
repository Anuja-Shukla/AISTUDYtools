/* SSC CGL · Reasoning · Coding-decoding. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["coding"] = {
  id: "coding", subject: "reasoning", num: 4, title: "Coding-decoding",
  minutes: 40,
  why: "Coding-decoding gives 2–3 Tier 1 marks. A word is changed by a hidden rule: letter shifts, opposite letters, reversal, numbers or a code language. Find the rule on the example, then apply it.",
  video: "videos/SSC_R04_Coding.mp4",
  slides: [
    { h: "What coding-decoding asks", body: "<p>You get one word and its code. Find the rule, then code (or decode) a new word.</p><ul><li><b>Letter shift</b>: each letter moves forward or back</li><li><b>Opposite letters</b>: A ↔ Z, B ↔ Y …</li><li><b>Reversal</b> or rearrangement</li><li><b>Number codes</b>: positions or sums</li><li><b>Code language</b>: sentences with common words</li></ul>" },
    { h: "Learn the positions", body: "<p>Know A = 1 to Z = 26 by heart. A quick memory aid: <b>E J O T Y</b> = 5, 10, 15, 20, 25.</p><p>Opposite pairs add up to 27: A–Z, B–Y, C–X, M–N.</p>", viz: { type: "alpha" } },
    { h: "Letter shift", body: "<p>Write the gap for each letter of the example.</p><p>CAT → DBU: C→D +1, A→B +1, T→U +1. So DOG → <b>EPH</b>.</p><p>Gaps can also grow: FRIEND → HUMJTK is +2, +3, +4, +5, +6, +7.</p>",
      ask: { q: "If PEN = QFO, then INK = ?", a: "+1 each → JOL." } },
    { h: "Opposite letters", body: "<p>If the code letters seem random, check opposites (sum 27).</p><p>CAT → XZG: C (3) ↔ X (24), A (1) ↔ Z (26), T (20) ↔ G (7).</p><p>So DOG → <b>WLT</b>.</p>" },
    { h: "Reversal and alternating shifts", body: "<ul><li>MANGO → OGNAM is the word reversed, so CHAIR → <b>RIAHC</b>.</li><li>CODE → DNED is +1, −1, +1, −1, so GOLD → <b>HNMC</b>.</li></ul><p>Always check the first and last letters first; they reveal reversal quickly.</p>" },
    { h: "Number codes", body: "<ul><li>Positions: PEN → 16-5-14.</li><li>Sum of positions: CAT = 3 + 1 + 20 = <b>24</b>, so DOG = 4 + 15 + 7 = <b>26</b>.</li><li>Digit for letter: if ROSE = 6821, then SORE = <b>2861</b>.</li></ul>",
      ask: { q: "If CAT = 24, then BAT = ?", a: "2 + 1 + 20 = 23." } },
    { h: "Code language", body: "<p>Compare sentences two at a time. A word common to both sentences has the code common to both.</p><p>“mo na ti” = sun is hot; “ti ra so” = hot and cold; “pe na” = sun rises.</p><p>hot is in sentences 1 and 2 → common code <b>ti</b>. sun is in 1 and 3 → <b>na</b>.</p>" },
    { h: "Exam strategy", body: "<ul><li>Write positions under the example word and its code.</li><li>Check, in order: same shift → growing shift → opposite → reversal → alternating.</li><li>For code language, intersect two sentences at a time.</li><li>Check the rule on every letter before coding the new word.</li></ul><p>Next: try the <b>Try it</b> tools, then the practice set.</p>" }
  ],
  tools: ["codeshift", "codefind", "codelang", "codegame"],
  formulas: [
    ["Positions", "A = 1 … Z = 26; EJOTY = 5, 10, 15, 20, 25"],
    ["Opposite letter", "position of opposite = 27 − position"],
    ["Shift", "code = letter + k (wrap after Z)"],
    ["Reverse position", "reverse position = 27 − position (same as opposite)"],
    ["Code language", "a common word ↔ a common code"]
  ],
  practice: [
    { q: "If CAT is coded DBU, how is DOG coded?", o: ["EPH", "EPG", "FQI", "CNF"], why: "Each letter +1.", hint: "Compare C and D." },
    { q: "If CAT = 24, then DOG = ?", o: ["26", "24", "25", "27"], why: "4 + 15 + 7 = 26.", hint: "Add the positions." },
    { q: "If MANGO is written OGNAM, how is LEMON written?", o: ["NOMEL", "NOMLE", "LNOME", "MELON"], why: "The word is reversed.", hint: "Read the code backwards." },
    { q: "If A is coded Z, B is Y and so on, CAT is coded as:", o: ["XZG", "XZH", "YZG", "XAG"], why: "Opposite letters: C↔X, A↔Z, T↔G.", hint: "Positions add to 27." },
    { q: "Each letter is moved two places back. GOOD becomes:", o: ["EMMB", "IQQF", "EMMC", "FNNC"], why: "G−2 = E, O−2 = M, D−2 = B.", hint: "Count backwards." },
    { q: "If BOOK = 2-15-15-11, then PEN = ?", o: ["16-5-14", "15-5-14", "16-4-14", "16-5-13"], why: "Letter positions.", hint: "P is the 16th letter." },
    { q: "If FRIEND is coded HUMJTK, CANDLE is coded:", o: ["EDRIRL", "EDQIRL", "DCRIRL", "EDRJRL"], why: "Shifts +2, +3, +4, +5, +6, +7.", hint: "The shift grows by one." },
    { q: "If SKY is written TLZ, how is BLUE written?", o: ["CMVF", "CMVE", "AKTD", "CNVF"], why: "Each letter +1.", hint: "Compare S and T." },
    { q: "If ROSE is coded 6821, how is SORE coded?", o: ["2861", "2816", "6821", "8261"], why: "R = 6, O = 8, S = 2, E = 1.", hint: "Match each letter to its digit." },
    { q: "“ka pa ri” = red big ball and “pa lo” = big box. Code for “big”?", o: ["pa", "ka", "ri", "lo"], why: "big is common to both; pa is the common code.", hint: "Find the common word." }
  ],
  test: {
    minutes: 7, right: 2, wrong: 0.5,
    items: [
      { q: "If PEN = QFO, then INK = ?", o: ["JOL", "JOK", "HMJ", "JPL"], why: "+1 each." },
      { q: "If CAT = 24, then BAT = ?", o: ["23", "24", "22", "25"], why: "2 + 1 + 20." },
      { q: "Using opposite letters (A↔Z), DOG is coded:", o: ["WLT", "WMT", "XLT", "WLU"], why: "D↔W, O↔L, G↔T." },
      { q: "Each letter moves two places forward. BOOK becomes:", o: ["DQQM", "CPPL", "DQQL", "DPPM"], why: "+2 each." },
      { q: "If COLD = DPME, then HEAT = ?", o: ["IFBU", "IFBT", "GDZS", "IEBU"], why: "+1 each." },
      { q: "If TABLE is written ELBAT, CHAIR is written:", o: ["RIAHC", "RIACH", "RAIHC", "CHAIR"], why: "Reversed." },
      { q: "“mo na ti” = sun is hot, “ti ra so” = hot and cold, “pe na” = sun rises. Code for “sun”?", o: ["na", "ti", "mo", "pe"], why: "sun is in sentences 1 and 3; na is common to both." },
      { q: "If MOUSE is coded PRXVH, RAT is coded:", o: ["UDW", "UDV", "TCV", "UCW"], why: "+3 each." },
      { q: "If APPLE = 50, then GRAPE = ?", o: ["47", "50", "45", "48"], why: "7 + 18 + 1 + 16 + 5." },
      { q: "If CODE is coded DNED, GOLD is coded:", o: ["HNMC", "HPMC", "HNME", "FNKC"], why: "+1, −1, +1, −1." }
    ]
  }
};
