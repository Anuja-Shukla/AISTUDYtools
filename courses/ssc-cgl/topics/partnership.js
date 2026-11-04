/* SSC CGL · Quant · Partnership. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["partnership"] = {
  id: "partnership", subject: "quant", num: 8, title: "Partnership",
  minutes: 35,
  why: "Partnership gives about one Tier 1 question. It is ratio applied to money and time, so it is quick marks once you multiply capital by months.",
  video: "videos/SSC_Q08_Partnership.mp4",
  slides: [
    { h: "Why partnership matters", body: "<p>When people put money into a business, the profit is shared in proportion to <b>how much</b> each invested and <b>for how long</b>.</p><ul><li>same time → share by capital</li><li>different times → share by capital × months</li><li>a working partner may get a salary first</li></ul><p>Every question reduces to a ratio, then sharing an amount.</p>" },
    { h: "Same time: share by capital", body: "<p>A invests ₹30,000 and B ₹45,000 for the same period. Profit ₹15,000.</p><p>Capital ratio 30 : 45 = 2 : 3 → 5 parts → 1 part = ₹3,000.</p><p class='f'>A = ₹6,000 &nbsp;&nbsp; B = ₹9,000</p>", viz: { type: "share", r: [2, 3], total: 15000 },
      ask: { q: "A, B and C invest ₹20,000, ₹30,000 and ₹50,000 for a year. Profit ₹12,000. C's share?", a: "Ratio 2 : 3 : 5 → C = 5/10 × 12,000 = ₹6,000." } },
    { h: "Different times: capital × months", body: "<p class='f'>Profit share ∝ Capital × Time</p><p>A invests ₹40,000 for 12 months, B ₹60,000 for 6 months.</p><p>40 × 12 = 480 and 60 × 6 = 360 → <b>4 : 3</b>.</p><p>The product is called “capital-months”: it measures money working in the business.</p>",
      ask: { q: "A and B invest in the ratio 5 : 7 for times in the ratio 2 : 3. Find their profit ratio.", a: "(5 × 2) : (7 × 3) = 10 : 21." } },
    { h: "Joining later", body: "<p>A starts with ₹50,000. B joins after 4 months with ₹60,000. Profit at the year end is ₹18,000.</p><p>A: 50 × 12 = 600, B: 60 × 8 = 480 → 5 : 4 → 9 parts of ₹2,000.</p><p class='f'>A = ₹10,000 &nbsp;&nbsp; B = ₹8,000</p><p class='warn'>B is in for 12 − 4 = 8 months, not 4.</p>" },
    { h: "Changing capital", body: "<p>Add each block of capital × months separately.</p><p>A invests ₹30,000 and withdraws ₹10,000 after 6 months: 30 × 6 + 20 × 6 = 300.</p><p>B invests ₹25,000 for the whole year: 25 × 12 = 300.</p><p class='f'>Ratio 300 : 300 = 1 : 1</p>",
      ask: { q: "A and B start with ₹5,000 and ₹4,000. After 3 months A adds ₹2,000 and B withdraws ₹1,000. Profit ₹7,800. A's share?", a: "A: 5 × 3 + 7 × 9 = 78. B: 4 × 3 + 3 × 9 = 39. Ratio 2 : 1 → A = ₹5,200." } },
    { h: "Working partner", body: "<p>Pay the salary or commission <b>first</b>, then share the rest.</p><p>Profit ₹50,000. A gets 10% for managing; the rest is shared 3 : 2.</p><p>A: 5,000 + 3/5 × 45,000 = <b>₹32,000</b>. B: 2/5 × 45,000 = ₹18,000.</p>",
      ask: { q: "A gets 20% of the profit as a manager's fee and the rest is shared equally. A receives ₹36,000 in all. Total profit?", a: "0.2P + 0.4P = 0.6P = 36,000 → P = ₹60,000." } },
    { h: "Finding the missing time or capital", body: "<p>Work backwards from the profit ratio:</p><p class='f'>Time ratio = profit ratio ÷ capital ratio</p><p>A invests ₹3,000 for a year; B invests ₹4,000; profits are equal. 3,000 × 12 = 4,000 × t → t = 9 months, so B joined <b>after 3 months</b>.</p>",
      ask: { q: "Capitals are 3 : 5 and profits 9 : 10. Find the ratio of times.", a: "(9/3) : (10/5) = 3 : 2." } },
    { h: "Exam strategy", body: "<ul><li>Write capital × months for each partner, in thousands to keep numbers small.</li><li>Joined after x months → in for (12 − x) months.</li><li>Salary or commission comes off the top first.</li><li>Shares like ½ : ⅓ : ¼ → multiply by the LCM (12) → 6 : 4 : 3.</li></ul><p>Next: try the <b>Try it</b> tools, then the practice set.</p>" }
  ],
  tools: ["partsplit", "captime", "workp", "findmiss"],
  formulas: [
    ["Same time", "profit ratio = capital ratio"],
    ["Different times", "profit ratio = capital × time"],
    ["Joined after x months (1-year business)", "time = 12 − x"],
    ["Capital changes", "add capital × months for each period"],
    ["Working partner", "pay salary / commission first, share the rest"],
    ["Time ratio", "profit ratio ÷ capital ratio"],
    ["Capital ratio", "profit ratio ÷ time ratio"],
    ["Fractional shares ½ : ⅓ : ¼", "multiply by the LCM → 6 : 4 : 3"]
  ],
  /* a: index of the correct option is always 0 here; options are shuffled on screen */
  practice: [
    { q: "A invests ₹30,000 and B ₹45,000 for the same period. Out of a profit of ₹15,000, B gets…", o: ["₹9,000", "₹6,000", "₹7,500", "₹10,000"], why: "Ratio 2 : 3 → B = 3/5 × 15,000 = ₹9,000.", hint: "Same time: share by capital." },
    { q: "A, B and C invest ₹20,000, ₹30,000 and ₹50,000 for a year. Out of ₹12,000 profit, C gets…", o: ["₹6,000", "₹5,000", "₹4,000", "₹3,600"], why: "Ratio 2 : 3 : 5 → C = 5/10 × 12,000.", hint: "Total parts = 10." },
    { q: "A invests ₹40,000 for 12 months and B ₹60,000 for 6 months. Their profit ratio is…", o: ["4 : 3", "2 : 3", "3 : 4", "1 : 1"], why: "480 : 360 = 4 : 3.", hint: "Capital × months." },
    { q: "A starts a business with ₹50,000. B joins after 4 months with ₹60,000. Out of ₹18,000 profit at the year end, B gets…", o: ["₹8,000", "₹10,000", "₹9,000", "₹7,200"], why: "600 : 480 = 5 : 4 → B = 4/9 × 18,000 = ₹8,000.", hint: "B is in for 8 months." },
    { q: "A invests ₹30,000 and withdraws ₹10,000 after 6 months. B invests ₹25,000 for the year. Their profit ratio is…", o: ["1 : 1", "6 : 5", "5 : 6", "3 : 2"], why: "A: 30 × 6 + 20 × 6 = 300. B: 25 × 12 = 300.", hint: "Add each block separately." },
    { q: "A invests ₹3,000 for a year. B invests ₹4,000 and their profits are equal. After how many months did B join?", o: ["3", "4", "6", "9"], why: "36,000 = 4,000 × t → t = 9 months, so B joined after 3.", hint: "Find B's months first." },
    { q: "Capitals are in the ratio 3 : 4 : 5 and times 4 : 3 : 2. The profit ratio is…", o: ["6 : 6 : 5", "3 : 4 : 5", "4 : 3 : 2", "12 : 12 : 5"], why: "12 : 12 : 10 = 6 : 6 : 5.", hint: "Multiply term by term." },
    { q: "Profit is ₹50,000. A gets 10% for managing and the rest is shared 3 : 2. A's total is…", o: ["₹32,000", "₹30,000", "₹27,000", "₹35,000"], why: "5,000 + 3/5 × 45,000 = 32,000.", hint: "Take the 10% out first." },
    { q: "Profit is shared 2 : 3 and A invested ₹16,000 for the same time as B. B invested…", o: ["₹24,000", "₹20,000", "₹32,000", "₹10,667"], why: "16,000 × 3/2 = ₹24,000.", hint: "Capital ratio = profit ratio." },
    { q: "A and B invest in the ratio 5 : 7 for times in the ratio 2 : 3. Their profit ratio is…", o: ["10 : 21", "5 : 7", "2 : 3", "15 : 14"], why: "(5 × 2) : (7 × 3) = 10 : 21.", hint: "Capital × time." }
  ],
  test: {
    minutes: 7, right: 2, wrong: 0.5,
    items: [
      { q: "A, B and C invest ₹20,000, ₹25,000 and ₹30,000 for 12, 8 and 6 months. Out of ₹31,000 profit, B gets…", o: ["₹10,000", "₹12,000", "₹9,000", "₹10,333"], why: "240 : 200 : 180 = 12 : 10 : 9 → B = 10/31 × 31,000." },
      { q: "A starts with ₹45,000. B joins after 3 months with ₹30,000 and C after 6 months with ₹30,000. Out of ₹33,000 profit at the year end, C gets…", o: ["₹6,000", "₹9,000", "₹7,000", "₹11,000"], why: "540 : 270 : 180 = 6 : 3 : 2 → C = 2/11 × 33,000." },
      { q: "A invests ₹8,000. After 4 months B joins with ₹12,000. Out of ₹11,000 profit at the year end, A gets…", o: ["₹5,500", "₹4,400", "₹6,600", "₹4,000"], why: "8 × 12 = 96 and 12 × 8 = 96, so they share equally." },
      { q: "Capitals are 3 : 5 and profits 9 : 10. The ratio of the times is…", o: ["3 : 2", "2 : 3", "27 : 50", "5 : 3"], why: "(9/3) : (10/5) = 3 : 2." },
      { q: "A invests ₹60,000 and withdraws half after 6 months. B invests ₹40,000 for the year. Out of ₹34,000 profit, A gets…", o: ["₹18,000", "₹16,000", "₹20,400", "₹17,000"], why: "A: 360 + 180 = 540. B: 480. 9 : 8 → A = 9/17 × 34,000." },
      { q: "A gets 20% of the profit as a manager's fee and the rest is shared equally. A receives ₹36,000 in all. The total profit is…", o: ["₹60,000", "₹45,000", "₹72,000", "₹90,000"], why: "0.2P + 0.4P = 0.6P = 36,000 → P = ₹60,000." },
      { q: "B joins A's business with 1½ times A's capital and their profits are equal at the year end. B joined after…", o: ["4 months", "6 months", "3 months", "8 months"], why: "12 = 1.5 × (12 − x) → 12 − x = 8 → x = 4." },
      { q: "Investments are 2 : 3 : 5 and profits 4 : 9 : 15. The ratio of times is…", o: ["2 : 3 : 3", "4 : 3 : 3", "1 : 2 : 3", "2 : 3 : 5"], why: "4/2 : 9/3 : 15/5 = 2 : 3 : 3." },
      { q: "A and B start with ₹5,000 and ₹4,000. After 3 months A adds ₹2,000 and B withdraws ₹1,000. Out of ₹7,800 profit, A gets…", o: ["₹5,200", "₹4,200", "₹5,000", "₹4,800"], why: "A: 15 + 63 = 78. B: 12 + 27 = 39. 2 : 1 → A = ₹5,200." },
      { q: "Three partners share profit in the ratio ½ : ⅓ : ¼. Out of ₹39,000, the second partner gets…", o: ["₹12,000", "₹13,000", "₹9,000", "₹18,000"], why: "× 12 → 6 : 4 : 3. Second = 4/13 × 39,000 = ₹12,000." }
    ]
  }
};
