/* SSC CGL · Quant · Ratio & proportion. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["ratio"] = {
  id: "ratio", subject: "quant", num: 4, title: "Ratio & proportion",
  minutes: 45,
  why: "Ratio gives 1–2 direct Tier 1 questions and is the engine behind partnership, mixtures, ages, time & work and speed questions.",
  video: "videos/SSC_Q04_Ratio.mp4",
  slides: [
    { h: "Why ratio matters", body: "<p>A ratio compares two quantities of the same kind. You will use it in:</p><ul><li>direct ratio and proportion questions</li><li>partnership, mixtures and ages</li><li>time & work and speed (as inverse ratios)</li></ul><p>Thinking in “parts” makes most of these one-line questions.</p>" },
    { h: "What a ratio means", body: "<p><b>a : b</b> means a ÷ b. Multiply or divide both terms by the same number and the ratio does not change.</p><ul><li>Always use the <b>same units</b>: 45 minutes : 2 hours = 45 : 120 = <b>3 : 8</b>.</li><li>Write it in lowest terms by dividing by the HCF.</li></ul><p>If A : B = 3 : 5, think of A as 3 parts and B as 5 parts of the same size.</p>",
      ask: { q: "Write 75 paise : ₹3 in its simplest form.", a: "₹3 = 300 paise, so 75 : 300 = 1 : 4." } },
    { h: "Sharing an amount", body: "<p>Add the parts, find one part, then multiply.</p><p>₹1,800 in the ratio 2 : 3 : 4 → 9 parts → 1 part = ₹200 → <b>₹400, ₹600, ₹800</b>.</p>", viz: { type: "share", r: [2, 3, 4], total: 1800 },
      ask: { q: "Share ₹2,400 between A and B in the ratio 3 : 5.", a: "8 parts, 1 part = ₹300. A = ₹900, B = ₹1,500." } },
    { h: "Joining two ratios", body: "<p>A : B = 2 : 3 and B : C = 4 : 5. Make B the same in both.</p><p>B is 3 in the first and 4 in the second. LCM = 12, so multiply the first by 4 and the second by 3:</p><p class='f'>A : B : C = 8 : 12 : 15</p><p>Then A : C = 8 : 15.</p>",
      ask: { q: "A : B = 3 : 4 and B : C = 6 : 7. Find A : B : C.", a: "Make B = 12: 9 : 12 and 12 : 14, so 9 : 12 : 14." } },
    { h: "Compound and duplicate ratios", body: "<ul><li><b>Compound</b> ratio of a : b and c : d = ac : bd. Of 2 : 3 and 4 : 5 → 8 : 15.</li><li><b>Duplicate</b> a² : b², <b>triplicate</b> a³ : b³.</li><li><b>Sub-duplicate</b> √a : √b, <b>sub-triplicate</b> ∛a : ∛b.</li><li><b>Inverse</b> ratio of a : b is b : a.</li></ul>",
      ask: { q: "Find the compound ratio of 3 : 4, 5 : 6 and 8 : 9.", a: "(3 × 5 × 8) : (4 × 6 × 9) = 120 : 216 = 5 : 9." } },
    { h: "Proportion", body: "<p>a, b, c, d are in proportion (a : b :: c : d) when <b>a × d = b × c</b> (product of extremes = product of means).</p><ul><li>Fourth proportional to a, b, c = bc ÷ a</li><li>Third proportional to a, b = b² ÷ a</li><li>Mean proportional of a, b = √(ab)</li></ul>",
      ask: { q: "Find the mean proportional of 9 and 16, and the fourth proportional to 4, 6 and 10.", a: "√(9 × 16) = 12. Fourth proportional = 6 × 10 ÷ 4 = 15." } },
    { h: "Adding a number to change a ratio", body: "<p>What number added to each of 7 and 11 makes the ratio 3 : 4?</p><p>(7 + x) ÷ (11 + x) = 3 ÷ 4 → 28 + 4x = 33 + 3x → <b>x = 5</b>. Check: 12 : 16 = 3 : 4.</p><p class='warn'>In the exam, test the options. It is faster than solving.</p>",
      ask: { q: "What must be subtracted from each of 15, 28, 20 and 38 so that they are in proportion?", a: "Try 2: 13, 26, 18, 36 → 13 × 36 = 468 = 26 × 18. Answer 2." } },
    { h: "Income, spending and savings", body: "<p>Incomes of A and B are 3 : 2 and their spending is 5 : 3. Each saves ₹1,000.</p><p>Income = 3x and 2x, spending = 5y and 3y. Savings: 3x − 5y = 1,000 and 2x − 3y = 1,000 → y = 1,000, x = 2,000.</p><p>A's income = <b>₹6,000</b>, B's = ₹4,000.</p>" },
    { h: "Coins and parts", body: "<p>A bag has ₹1, 50 p and 25 p coins in the ratio 1 : 2 : 3, worth ₹66 in all.</p><p>One “set” = 1 × ₹1 + 2 × ₹0.50 + 3 × ₹0.25 = ₹2.75. Sets = 66 ÷ 2.75 = 24.</p><p>So 24 one-rupee coins, 48 fifty-paise coins and <b>72</b> twenty-five-paise coins.</p>",
      ask: { q: "In that bag, what is the total value of the 50 p coins?", a: "48 × ₹0.50 = ₹24." } },
    { h: "Direct and inverse proportion", body: "<ul><li><b>Direct</b>: both rise together. x ∝ y → x₁ ÷ y₁ = x₂ ÷ y₂. If 8 pens cost ₹96, 14 pens cost ₹168.</li><li><b>Inverse</b>: one rises, the other falls. Men × days stays the same. If 12 men take 10 days, 15 men take 12 × 10 ÷ 15 = <b>8 days</b>.</li></ul>" },
    { h: "Exam strategy", body: "<ul><li>Think in parts: write 3x and 5x, not A and B.</li><li>Join ratios by making the common term equal (LCM).</li><li>For “add/subtract to make a ratio” questions, test the options.</li><li>Check units before you write the ratio.</li></ul><p>Next: try the <b>Try it</b> tools, then the practice set.</p>" }
  ],
  tools: ["share", "chain", "propn", "makeratio"],
  formulas: [
    ["a : b", "a ÷ b; multiply or divide both terms by the same number"],
    ["Share S in a : b : c", "S × a ÷ (a + b + c), and so on"],
    ["Join A : B and B : C", "make B equal using the LCM"],
    ["Compound ratio", "ac : bd"],
    ["Duplicate / sub-duplicate", "a² : b² / √a : √b"],
    ["Proportion a : b :: c : d", "ad = bc"],
    ["Fourth proportional to a, b, c", "bc ÷ a"],
    ["Third proportional to a, b", "b² ÷ a"],
    ["Mean proportional of a, b", "√(ab)"],
    ["Add x to a and b to get p : q", "x = (pb − qa) ÷ (q − p)"],
    ["Direct proportion", "x₁ ÷ y₁ = x₂ ÷ y₂"],
    ["Inverse proportion", "x₁ × y₁ = x₂ × y₂ (e.g. men × days)"]
  ],
  /* a: index of the correct option is always 0 here; options are shuffled on screen */
  practice: [
    { q: "The ratio of 45 minutes to 2 hours is…", o: ["3 : 8", "3 : 4", "9 : 20", "8 : 3"], why: "2 hours = 120 minutes. 45 : 120 = 3 : 8.", hint: "Use the same units first." },
    { q: "₹1,800 is shared in the ratio 2 : 3 : 4. What is the largest share?", o: ["₹800", "₹600", "₹900", "₹720"], why: "9 parts, 1 part = ₹200, largest = 4 × 200 = ₹800.", hint: "Add the parts first." },
    { q: "A : B = 2 : 3 and B : C = 4 : 5. Find A : B : C.", o: ["8 : 12 : 15", "2 : 3 : 5", "8 : 12 : 5", "6 : 12 : 15"], why: "Make B = 12: A : B = 8 : 12 and B : C = 12 : 15.", hint: "Make B the same in both ratios." },
    { q: "The mean proportional of 9 and 16 is…", o: ["12", "12.5", "25", "144"], why: "√(9 × 16) = √144 = 12.", hint: "Mean proportional = √(ab)." },
    { q: "The fourth proportional to 4, 6 and 10 is…", o: ["15", "12", "20", "24"], why: "4 : 6 :: 10 : x → x = 6 × 10 ÷ 4 = 15.", hint: "Product of extremes = product of means." },
    { q: "What number must be added to each of 7 and 11 to make the ratio 3 : 4?", o: ["5", "4", "3", "6"], why: "(7 + 5) : (11 + 5) = 12 : 16 = 3 : 4.", hint: "Test the options." },
    { q: "The compound ratio of 3 : 4, 5 : 6 and 8 : 9 is…", o: ["5 : 9", "16 : 19", "4 : 9", "5 : 6"], why: "(3 × 5 × 8) : (4 × 6 × 9) = 120 : 216 = 5 : 9.", hint: "Multiply the first terms and the second terms." },
    { q: "The third proportional to 4 and 6 is…", o: ["9", "8", "12", "24"], why: "4 : 6 :: 6 : x → x = 36 ÷ 4 = 9.", hint: "Third proportional = b² ÷ a." },
    { q: "Two numbers are in the ratio 5 : 7 and their sum is 96. The larger number is…", o: ["56", "40", "48", "64"], why: "12 parts = 96, 1 part = 8, larger = 7 × 8 = 56.", hint: "Total parts = 12." },
    { q: "If a : b = 3 : 4, then (2a + 3b) : (3a + 4b) = ?", o: ["18 : 25", "17 : 24", "3 : 4", "6 : 7"], why: "Put a = 3, b = 4: (6 + 12) : (9 + 16) = 18 : 25.", hint: "Substitute a = 3 and b = 4." }
  ],
  test: {
    minutes: 8, right: 2, wrong: 0.5,
    items: [
      { q: "The incomes of A and B are in the ratio 3 : 2 and their expenses in the ratio 5 : 3. If each saves ₹1,000, A's income is…", o: ["₹6,000", "₹4,000", "₹5,000", "₹3,000"], why: "3x − 5y = 1,000 and 2x − 3y = 1,000 give x = 2,000, y = 1,000. A's income = 3 × 2,000 = ₹6,000." },
      { q: "A bag has ₹1, 50 p and 25 p coins in the ratio 1 : 2 : 3, worth ₹66. How many 25 p coins are there?", o: ["72", "24", "48", "36"], why: "One set is worth ₹2.75, so there are 66 ÷ 2.75 = 24 sets and 3 × 24 = 72 coins of 25 p." },
      { q: "The salaries of A, B and C are in the ratio 2 : 3 : 5. After rises of 15%, 10% and 20%, the new ratio is…", o: ["23 : 33 : 60", "3 : 3 : 10", "2 : 3 : 5", "20 : 33 : 60"], why: "2 × 1.15 : 3 × 1.1 : 5 × 1.2 = 2.3 : 3.3 : 6 = 23 : 33 : 60." },
      { q: "What must be subtracted from each of 15, 28, 20 and 38 so that they are in proportion?", o: ["2", "3", "1", "4"], why: "13, 26, 18, 36: 13 × 36 = 468 = 26 × 18." },
      { q: "A : B = 3 : 4, B : C = 6 : 7 and C : D = 14 : 15. Find A : D.", o: ["3 : 5", "9 : 14", "3 : 7", "1 : 2"], why: "A : B : C = 9 : 12 : 14, and C : D = 14 : 15, so A : D = 9 : 15 = 3 : 5." },
      { q: "₹6,300 is shared so that A gets half of B's share and B gets one-third of C's share. C's share is…", o: ["₹4,200", "₹1,400", "₹700", "₹2,100"], why: "A : B : C = 1 : 2 : 6. C = 6/9 × 6,300 = ₹4,200." },
      { q: "x varies directly as y. If x = 12 when y = 8, find x when y = 14.", o: ["21", "18", "24", "16"], why: "x ÷ y = 12 ÷ 8 = 1.5, so x = 1.5 × 14 = 21." },
      { q: "Two numbers are in the ratio 3 : 5. If 9 is subtracted from each, the ratio becomes 12 : 23. The larger number is…", o: ["55", "33", "45", "65"], why: "(3k − 9) : (5k − 9) = 12 : 23 gives k = 11. Larger = 5 × 11 = 55." },
      { q: "The ages of A and B are in the ratio 4 : 5. After 6 years the ratio will be 6 : 7. A's present age is…", o: ["12 years", "15 years", "18 years", "20 years"], why: "(4k + 6) : (5k + 6) = 6 : 7 gives k = 3, so A is 12." },
      { q: "50 litres of a mixture has milk and water in the ratio 7 : 3. How much water must be added to make the ratio 7 : 5?", o: ["10 litres", "5 litres", "8 litres", "12 litres"], why: "Milk = 35 L, water = 15 L. 35 : (15 + w) = 7 : 5 → 15 + w = 25 → w = 10." }
    ]
  }
};
