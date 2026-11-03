/* SSC CGL · Quant · Simple & compound interest. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["interest"] = {
  id: "interest", subject: "quant", num: 6, title: "Simple & compound interest",
  minutes: 45,
  why: "Interest gives 1–2 Tier 1 questions and more in Tier 2. Most are one-step once you know the SI and CI formulas and the CI − SI shortcut.",
  video: "videos/SSC_Q06_Interest.mp4",
  slides: [
    { h: "Why interest matters", body: "<p>Interest questions come in a few fixed patterns:</p><ul><li>simple interest (SI) and amount</li><li>a sum doubling or becoming n times</li><li>compound interest (CI) and amount</li><li>the difference between CI and SI</li><li>half-yearly and quarterly compounding</li></ul><p>Compound interest is just <b>successive percentage change</b>, which you already know.</p>" },
    { h: "Simple interest", body: "<p class='f'>SI = P × R × T ÷ 100 &nbsp;&nbsp; Amount = P + SI</p><p>P = principal, R = rate % per year, T = time in years.</p><p>₹5,000 at 8% for 3 years: SI = 5,000 × 8 × 3 ÷ 100 = <b>₹1,200</b>, amount ₹6,200.</p><p>SI is the same every year: the interest is always on the original principal.</p>",
      ask: { q: "Find the SI on ₹12,000 at 6% per year for 2½ years.", a: "12,000 × 6 × 2.5 ÷ 100 = ₹1,800." } },
    { h: "Doubling and n times (SI)", body: "<p>A sum becomes n times when the SI = (n − 1) × P.</p><p class='f'>R × T = 100 × (n − 1)</p><ul><li>Doubles in 8 years → R = 100 ÷ 8 = <b>12.5%</b>.</li><li>At that rate it becomes 3 times when R × T = 200 → T = <b>16 years</b>.</li></ul>",
      ask: { q: "At SI a sum becomes 3 times in 16 years. In how many years will it become 5 times?", a: "R = 200 ÷ 16 = 12.5%. For 5 times, R × T = 400, so T = 32 years." } },
    { h: "Compound interest", body: "<p>With CI, each year's interest is added to the principal, so interest earns interest.</p><p class='f'>A = P × (1 + R/100)ⁿ &nbsp;&nbsp; CI = A − P</p><p>₹10,000 at 10% for 2 years: 10,000 × 1.1 × 1.1 = 12,100, so CI = <b>₹2,100</b> (SI would be ₹2,000).</p>",
      ask: { q: "Find the amount on ₹8,000 at 5% compounded yearly for 2 years.", a: "8,000 × 1.05 × 1.05 = ₹8,820." } },
    { h: "CI as successive percentages", body: "<p>Two years at 10% is a rise of 10% then 10%: 10 + 10 + (10 × 10)/100 = <b>21%</b>.</p><ul><li>2 years at R%: effective rate = 2R + R²/100</li><li>3 years at 10%: 1.1³ = 1.331 → <b>33.1%</b></li></ul><p>So CI on ₹10,000 for 3 years at 10% = 33.1% of 10,000 = ₹3,310.</p>" },
    { h: "CI − SI shortcut", body: "<p class='f'>2 years: CI − SI = P × (R/100)²</p><p class='f'>3 years: CI − SI = P × (R/100)² × (3 + R/100)</p><p>₹10,000 at 10%: 2 years → 10,000 × 0.01 = <b>₹100</b>; 3 years → 100 × 3.1 = <b>₹310</b>.</p>",
      ask: { q: "The difference between CI and SI for 2 years at 5% is ₹25. Find the sum.", a: "P × 0.05² = 25, so P = 25 ÷ 0.0025 = ₹10,000." } },
    { h: "Half-yearly and quarterly", body: "<ul><li><b>Half-yearly</b>: rate ÷ 2, time × 2.</li><li><b>Quarterly</b>: rate ÷ 4, time × 4.</li></ul><p>₹16,000 at 10% per year, compounded half-yearly, 1 year → 5% for 2 periods: 16,000 × 1.05² = <b>₹17,640</b>.</p>",
      ask: { q: "₹10,000 at 8% per year compounded quarterly for 6 months. Find the amount.", a: "2% for 2 quarters: 10,000 × 1.02² = ₹10,404." } },
    { h: "Finding the rate from two amounts", body: "<p>A sum amounts to ₹6,050 in 2 years and ₹6,655 in 3 years at CI.</p><p>The 3rd year's interest is 6,655 − 6,050 = 605, earned on 6,050. Rate = 605 ÷ 6,050 = <b>10%</b>.</p><p>Under SI, the yearly interest is constant: ₹7,800 in 3 years and ₹9,000 in 5 years → ₹600 a year → P = 7,800 − 1,800 = ₹6,000.</p>" },
    { h: "Different rates, growth and decay", body: "<ul><li>Rates change each year: A = P(1 + r₁/100)(1 + r₂/100). ₹5,000 at 10% then 20% → 5,000 × 1.1 × 1.2 = <b>₹6,600</b>.</li><li>Population growth uses the CI formula. Depreciation uses (1 − r/100)ⁿ.</li><li>Under CI, if a sum doubles in T years it becomes 4 times in 2T and 8 times in 3T.</li></ul>",
      ask: { q: "At CI a sum becomes 4 times in 6 years. In how many years will it become 16 times?", a: "16 = 4², so 2 × 6 = 12 years." } },
    { h: "Exam strategy", body: "<ul><li>SI: think “same interest every year”. CI: think “successive %”.</li><li>Use multiplying factors: 10% → 1.1, 5% → 1.05.</li><li>For CI − SI questions, use the shortcut, not the full formula.</li><li>Check whether compounding is yearly, half-yearly or quarterly.</li></ul><p>Next: try the <b>Try it</b> tools, then the practice set.</p>" }
  ],
  tools: ["siSolve", "sivsci", "cidiff", "multiply"],
  formulas: [
    ["Simple interest", "SI = P × R × T ÷ 100"],
    ["Amount", "A = P + SI"],
    ["SI: sum becomes n times", "R × T = 100 × (n − 1)"],
    ["Compound amount", "A = P × (1 + R/100)ⁿ"],
    ["Compound interest", "CI = A − P"],
    ["Effective rate, 2 years", "2R + R²/100"],
    ["CI − SI, 2 years", "P × (R/100)²"],
    ["CI − SI, 3 years", "P × (R/100)² × (3 + R/100)"],
    ["Half-yearly / quarterly", "R/2 and 2n / R/4 and 4n"],
    ["Different rates", "P(1 + r₁/100)(1 + r₂/100)…"],
    ["Rate from two CI amounts", "(A₂ − A₁) ÷ A₁ × 100 for consecutive years"],
    ["CI: doubles in T years", "4 times in 2T, 8 times in 3T"]
  ],
  /* a: index of the correct option is always 0 here; options are shuffled on screen */
  practice: [
    { q: "What is the simple interest on ₹5,000 at 8% per year for 3 years?", o: ["₹1,200", "₹1,000", "₹1,400", "₹1,240"], why: "5,000 × 8 × 3 ÷ 100 = ₹1,200.", hint: "SI = PRT ÷ 100." },
    { q: "A sum doubles in 8 years at simple interest. The rate is…", o: ["12.5%", "8%", "10%", "16%"], why: "SI = P in 8 years, so R = 100 ÷ 8 = 12.5%.", hint: "Doubling means SI = P." },
    { q: "At simple interest a sum becomes 3 times in 16 years. In how many years will it become 5 times?", o: ["32 years", "40 years", "24 years", "30 years"], why: "R × 16 = 200 → R = 12.5%. For 5 times, R × T = 400 → T = 32.", hint: "R × T = 100 × (n − 1)." },
    { q: "What is the compound interest on ₹10,000 at 10% for 2 years, compounded yearly?", o: ["₹2,100", "₹2,000", "₹2,210", "₹1,100"], why: "10,000 × 1.1² = 12,100, so CI = ₹2,100.", hint: "A = P(1 + R/100)²." },
    { q: "What does ₹8,000 amount to at 5% compound interest in 2 years?", o: ["₹8,820", "₹8,800", "₹8,840", "₹9,261"], why: "8,000 × 1.05 × 1.05 = ₹8,820.", hint: "Multiply by 1.05 twice." },
    { q: "The difference between CI and SI on a sum for 2 years at 5% is ₹25. The sum is…", o: ["₹10,000", "₹5,000", "₹12,500", "₹20,000"], why: "P × (5/100)² = 25 → P = 25 ÷ 0.0025 = ₹10,000.", hint: "CI − SI = P(R/100)² for 2 years." },
    { q: "₹16,000 is invested at 10% per year compounded half-yearly for 1 year. The amount is…", o: ["₹17,640", "₹17,600", "₹17,664", "₹17,424"], why: "5% for 2 half-years: 16,000 × 1.05² = ₹17,640.", hint: "Half the rate, double the periods." },
    { q: "The simple interest on a sum for 3 years at 6% is ₹900. The sum is…", o: ["₹5,000", "₹4,500", "₹6,000", "₹5,400"], why: "P = 900 × 100 ÷ (6 × 3) = ₹5,000.", hint: "P = SI × 100 ÷ (R × T)." },
    { q: "At compound interest a sum doubles in 4 years. In how many years will it become 8 times?", o: ["12 years", "16 years", "8 years", "24 years"], why: "8 = 2³, so 3 × 4 = 12 years.", hint: "Each doubling takes 4 years." },
    { q: "The effective rate for 2 years at 10% compound interest is…", o: ["21%", "20%", "22%", "10.5%"], why: "10 + 10 + (10 × 10)/100 = 21%.", hint: "Successive percentage change." }
  ],
  test: {
    minutes: 8, right: 2, wrong: 0.5,
    items: [
      { q: "The difference between CI and SI on ₹10,000 at 10% for 3 years is…", o: ["₹310", "₹300", "₹331", "₹100"], why: "P(R/100)²(3 + R/100) = 10,000 × 0.01 × 3.1 = ₹310." },
      { q: "A sum amounts to ₹6,050 in 2 years and ₹6,655 in 3 years at compound interest. The rate is…", o: ["10%", "12%", "8%", "11%"], why: "Interest in year 3 = 605 on 6,050 → 605 ÷ 6,050 = 10%." },
      { q: "A sum amounts to ₹13,310 in 3 years at 10% compound interest. The principal is…", o: ["₹10,000", "₹9,000", "₹11,000", "₹10,500"], why: "13,310 ÷ 1.1³ = 13,310 ÷ 1.331 = ₹10,000." },
      { q: "₹5,000 is invested at 10% for the first year and 20% for the second, compounded yearly. The amount is…", o: ["₹6,600", "₹6,500", "₹6,000", "₹6,720"], why: "5,000 × 1.1 × 1.2 = ₹6,600." },
      { q: "A sum becomes ₹7,800 in 3 years and ₹9,000 in 5 years at simple interest. The rate is…", o: ["10%", "12%", "8%", "15%"], why: "SI per year = 1,200 ÷ 2 = 600. P = 7,800 − 1,800 = 6,000. R = 600 ÷ 6,000 = 10%." },
      { q: "The compound interest on ₹10,000 at 8% per year compounded quarterly for 6 months is…", o: ["₹404", "₹400", "₹416", "₹408"], why: "2% for 2 quarters: 10,000 × 1.02² = 10,404, so CI = ₹404." },
      { q: "At compound interest a sum becomes 4 times in 6 years. In how many years will it become 16 times?", o: ["12 years", "24 years", "18 years", "9 years"], why: "16 = 4², so 2 × 6 = 12 years." },
      { q: "The SI and CI on a sum for 2 years at the same rate are ₹1,200 and ₹1,260. The rate is…", o: ["10%", "5%", "12%", "20%"], why: "SI per year = 600. The extra ₹60 is interest on 600 for a year, so R = 60 ÷ 600 = 10%." },
      { q: "At what rate of simple interest will ₹2,500 amount to ₹3,250 in 4 years?", o: ["7.5%", "7%", "8%", "6.5%"], why: "SI = 750. R = 750 × 100 ÷ (2,500 × 4) = 7.5%." },
      { q: "A town of 50,000 grows by 4% every year. Its population after 2 years is…", o: ["54,080", "54,000", "54,160", "52,000"], why: "50,000 × 1.04² = 50,000 × 1.0816 = 54,080." }
    ]
  }
};
