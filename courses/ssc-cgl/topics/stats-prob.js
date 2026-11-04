/* SSC CGL · Quant · Statistics & probability (Tier 2). Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["stats-prob"] = {
  id: "stats-prob", subject: "quant", num: 17, title: "Statistics & probability",
  minutes: 50,
  why: "Statistics and probability are part of Tier 2 Paper I: mean, median, mode, spread, and simple probability with coins, dice, cards and balls.",
  video: "videos/SSC_Q17_Stats_Probability.mp4",
  slides: [
    { h: "Why statistics and probability matter", body: "<p>Tier 2 adds two short topics:</p><ul><li><b>Statistics</b>: mean, median, mode, range, variance and standard deviation</li><li><b>Probability</b>: coins, dice, cards and drawing balls from a bag</li></ul><p>Both are formula-based and quick once the basics are clear.</p>" },
    { h: "Mean", body: "<p class='f'>Mean = Σx ÷ n &nbsp;&nbsp; With frequencies: Σfx ÷ Σf</p><p>4, 8, 6, 10, 12 → 40 ÷ 5 = <b>8</b>.</p><p>x: 1, 2, 3, 4 with f: 3, 5, 8, 4 → Σfx = 53, Σf = 20 → mean <b>2.65</b>.</p>",
      ask: { q: "Find the mean of the first 10 natural numbers.", a: "55 ÷ 10 = 5.5." } },
    { h: "Median and mode", body: "<ul><li><b>Median</b>: the middle value after sorting. For an even count, average the two middle values.</li><li><b>Mode</b>: the most frequent value.</li></ul><p>3, 5, 7, 9, 11, 13 → median (7 + 9) ÷ 2 = <b>8</b>. &nbsp; 2, 3, 3, 5, 5, 5, 7 → mode <b>5</b>.</p><p class='f'>Empirical relation: Mode = 3 Median − 2 Mean</p>",
      ask: { q: "Mean 20 and median 22. Estimate the mode.", a: "3 × 22 − 2 × 20 = 26." } },
    { h: "Spread: range, variance, SD", body: "<p class='f'>Range = largest − smallest</p><p class='f'>Variance = Σ(x − mean)² ÷ n &nbsp;&nbsp; SD = √variance</p><p>2, 4, 4, 4, 5, 5, 7, 9: mean 5, squared deviations add to 32 → variance 4 → <b>SD 2</b>.</p><ul><li>Adding a constant to every value: SD does <b>not</b> change.</li><li>Multiplying every value by k: SD × |k|, variance × k².</li></ul>", viz: { type: "dots", v: [2, 4, 4, 4, 5, 5, 7, 9] } },
    { h: "Probability basics", body: "<p class='f'>P(event) = favourable outcomes ÷ total outcomes</p><ul><li>0 ≤ P ≤ 1; P(certain) = 1, P(impossible) = 0</li><li>P(not A) = 1 − P(A)</li><li>One die: P(even) = 3/6 = 1/2</li></ul><p>A bag has 4 red and 6 green balls: P(not red) = 6/10 = <b>3/5</b>.</p>" },
    { h: "Coins and dice", body: "<ul><li>n coins → 2ⁿ outcomes. Two coins: P(at least one head) = 1 − 1/4 = <b>3/4</b>. Three coins: P(exactly 2 heads) = 3/8.</li><li>Two dice → 36 outcomes. Sum 7: (1,6) (2,5) (3,4) (4,3) (5,2) (6,1) → 6/36 = <b>1/6</b>.</li></ul>",
      ask: { q: "Two dice are thrown. P(sum = 10)?", a: "(4,6), (5,5), (6,4): 3/36 = 1/12." } },
    { h: "Cards", body: "<p>A pack has 52 cards: 4 suits of 13 (2 red, 2 black). Face cards are J, Q, K: 12 in all.</p><ul><li>P(king) = 4/52 = <b>1/13</b></li><li>P(red face card) = 6/52 = <b>3/26</b></li><li>P(spade) = 13/52 = 1/4</li></ul>" },
    { h: "Drawing balls", body: "<p>Use combinations: ⁿCr = n! ÷ [r!(n − r)!].</p><p>A bag has 5 red and 3 blue balls; 2 are drawn. P(both red) = ⁵C₂ ÷ ⁸C₂ = 10 ÷ 28 = <b>5/14</b>.</p><p>“Or” with overlap: P(A or B) = P(A) + P(B) − P(both). A number from 1–20 is a multiple of 3 or 5: (6 + 4 − 1)/20 = 9/20.</p>",
      ask: { q: "Three coins are tossed. P(exactly two heads)?", a: "HHT, HTH, THH: 3/8." } },
    { h: "Exam strategy", body: "<ul><li>Sort the data before finding the median.</li><li>Use Mode = 3 Median − 2 Mean when two are given.</li><li>“At least one” → 1 − P(none).</li><li>List small sample spaces (two dice, three coins) rather than guessing.</li></ul><p>Next: try the <b>Try it</b> tools, then the practice set.</p>" }
  ],
  tools: ["statsx", "freqm", "dicegrid", "bagdraw"],
  formulas: [
    ["Mean", "Σx ÷ n; with frequencies Σfx ÷ Σf"],
    ["Median", "middle value after sorting (average the two middle ones if n is even)"],
    ["Mode", "most frequent value; Mode = 3 Median − 2 Mean"],
    ["Range", "largest − smallest"],
    ["Variance / SD", "Σ(x − mean)² ÷ n / √variance"],
    ["Add c to every value", "mean + c, SD unchanged"],
    ["Multiply every value by k", "mean × k, SD × |k|, variance × k²"],
    ["Probability", "favourable ÷ total; P(not A) = 1 − P(A)"],
    ["A or B", "P(A) + P(B) − P(A and B)"],
    ["Coins / two dice", "2ⁿ outcomes / 36 outcomes"],
    ["Cards", "52 = 4 suits × 13; 12 face cards; 26 red"],
    ["Combinations", "ⁿCr = n! ÷ [r!(n − r)!]"]
  ],
  /* a: index of the correct option is always 0 here; options are shuffled on screen */
  practice: [
    { q: "The mean of 4, 8, 6, 10 and 12 is…", o: ["8", "7", "9", "10"], why: "40 ÷ 5 = 8.", hint: "Add and divide by 5." },
    { q: "The median of 3, 9, 5, 7, 11, 13 is…", o: ["8", "7", "9", "7.5"], why: "Sorted: 3, 5, 7, 9, 11, 13 → (7 + 9) ÷ 2.", hint: "Sort first; there are 6 values." },
    { q: "The mode of 2, 3, 3, 5, 5, 5, 7 is…", o: ["5", "3", "4", "7"], why: "5 appears most often.", hint: "Most frequent value." },
    { q: "Mean = 20 and median = 22. The mode is about…", o: ["26", "24", "21", "18"], why: "3 × 22 − 2 × 20 = 26.", hint: "Mode = 3 Median − 2 Mean." },
    { q: "The standard deviation of 2, 4, 4, 4, 5, 5, 7, 9 is…", o: ["2", "4", "5", "1.5"], why: "Mean 5; Σ(x − 5)² = 32; variance 4; SD 2.", hint: "Find the variance first." },
    { q: "If 5 is added to every value, the standard deviation…", o: ["is unchanged", "increases by 5", "is multiplied by 5", "decreases by 5"], why: "Shifting all values does not change the spread.", hint: "Spread vs position." },
    { q: "Two dice are thrown. P(sum = 7) = ?", o: ["1/6", "7/36", "1/12", "5/36"], why: "6 outcomes out of 36.", hint: "List the pairs." },
    { q: "Two coins are tossed. P(at least one head) = ?", o: ["3/4", "1/2", "1/4", "2/3"], why: "1 − P(no head) = 1 − 1/4.", hint: "Use 1 − P(none)." },
    { q: "A card is drawn from a pack of 52. P(king) = ?", o: ["1/13", "1/52", "4/13", "1/4"], why: "4/52.", hint: "There are 4 kings." },
    { q: "A bag has 5 red and 3 blue balls. Two are drawn. P(both red) = ?", o: ["5/14", "25/64", "5/8", "3/14"], why: "⁵C₂ ÷ ⁸C₂ = 10/28.", hint: "Use combinations." }
  ],
  test: {
    minutes: 9, right: 2, wrong: 0.5,
    items: [
      { q: "The mean of the first 10 natural numbers is…", o: ["5.5", "5", "6", "10"], why: "55 ÷ 10." },
      { q: "x: 1, 2, 3, 4 with frequencies 3, 5, 8, 4. The mean is…", o: ["2.65", "2.5", "2.75", "3"], why: "Σfx = 53, Σf = 20 → 2.65." },
      { q: "The median of 12, 7, 15, 9, 20 is…", o: ["12", "15", "9", "12.6"], why: "Sorted 7, 9, 12, 15, 20 → 12." },
      { q: "If every observation is multiplied by 3, the variance is…", o: ["multiplied by 9", "multiplied by 3", "unchanged", "increased by 3"], why: "Variance × k² = 9." },
      { q: "The range of 15, 7, 22, 9, 30, 11 is…", o: ["23", "15", "30", "7"], why: "30 − 7 = 23." },
      { q: "Two dice are thrown. P(sum = 10) = ?", o: ["1/12", "1/9", "1/6", "5/36"], why: "(4,6), (5,5), (6,4): 3/36." },
      { q: "A card is drawn from a pack of 52. P(red face card) = ?", o: ["3/26", "3/13", "1/26", "6/13"], why: "6 red face cards: 6/52." },
      { q: "Three coins are tossed. P(exactly two heads) = ?", o: ["3/8", "1/2", "1/4", "1/8"], why: "3 of 8 outcomes." },
      { q: "A number is picked from 1 to 20. P(it is a multiple of 3 or 5) = ?", o: ["9/20", "1/2", "2/5", "7/20"], why: "6 + 4 − 1 (for 15) = 9." },
      { q: "A bag has 4 red and 6 green balls. One is drawn. P(not red) = ?", o: ["3/5", "2/5", "1/2", "2/3"], why: "6/10." }
    ]
  }
};
