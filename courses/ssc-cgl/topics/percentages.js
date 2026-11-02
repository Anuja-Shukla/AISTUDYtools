/* SSC CGL · Quant · Percentages. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["percentages"] = {
  id: "percentages", subject: "quant", num: 3, title: "Percentages",
  minutes: 45,
  why: "Percentages appear directly in 1–2 Tier 1 questions and sit inside profit & loss, interest, data interpretation and ratio questions too.",
  video: "videos/SSC_Q03_Percentages.mp4",
  slides: [
    { h: "Why percentages matter", body: "<p>Percentages are the language of Quant. You will meet them in:</p><ul><li>direct questions (x% of y, % change)</li><li>profit, loss and discount</li><li>simple and compound interest</li><li>data interpretation charts</li></ul><p>Master this topic first and five other topics become easier.</p>" },
    { h: "Per cent means per hundred", body: "<p><b>37%</b> means 37 out of every 100. So 37% = 37/100 = 0.37.</p>", viz: { type: "grid", n: 37 },
      ask: { q: "Write 8% as a fraction in its lowest terms.", a: "8/100 = 2/25" } },
    { h: "Finding x% of y quickly", body: "<p>Break the percentage into easy pieces: 10%, 5% and 1%.</p><p><b>35% of 240</b> = 30% + 5% = 72 + 12 = <b>84</b>.</p><p>Trick: x% of y = y% of x. So 16% of 25 = 25% of 16 = <b>4</b>.</p>",
      ask: { q: "Find 45% of 360.", a: "40% = 144, 5% = 18, so 45% = 162." } },
    { h: "The fraction table", body: "<p>Know these by heart. They turn long division into one step.</p>", viz: { type: "fractions" },
      ask: { q: "37.5% is which fraction?", a: "37.5% = 3 × 12.5% = 3/8." } },
    { h: "What per cent is A of B?", body: "<p>Per cent = A ÷ B × 100.</p><p>What % of 80 is 28? 28 ÷ 80 × 100 = <b>35%</b>.</p>",
      ask: { q: "18 is what per cent of 72?", a: "18/72 = 1/4 = 25%." } },
    { h: "Percentage change", body: "<p>Change % = (New − Old) ÷ <b>Old</b> × 100.</p><p>₹80 → ₹100: change = 20, so 20 ÷ 80 × 100 = <b>25% increase</b>.</p><p class='warn'>Always divide by the old (original) value.</p>",
      ask: { q: "A price goes from ₹50 to ₹65. Find the % increase.", a: "15 ÷ 50 × 100 = 30%." } },
    { h: "The base trap", body: "<p>If A is r% more than B, then B is less than A by</p><p class='f'>r ÷ (100 + r) × 100</p><p>A is 25% more than B → B is 25/125 = <b>20%</b> less than A. The answers are different because the base is different.</p>",
      ask: { q: "A earns 50% more than B. By what % does B earn less than A?", a: "50 ÷ 150 × 100 = 33⅓%." } },
    { h: "Successive change", body: "<p>Two changes one after the other (a% then b%):</p><p class='f'>Net % = a + b + ab ÷ 100</p><p>Use a negative sign for a decrease. Two discounts of 20% and 10%: −20 − 10 + 200/100 = <b>−28%</b>, a single discount of 28%.</p>",
      ask: { q: "A price rises 20% and then falls 10%. Net change?", a: "20 − 10 + (20 × −10)/100 = 10 − 2 = 8% increase." } },
    { h: "Price, consumption and spending", body: "<p>Spending = Price × Consumption. If the price rises by r%, consumption must fall by</p><p class='f'>r ÷ (100 + r) × 100</p><p>to keep spending the same. If the price falls by r%, consumption can rise by r ÷ (100 − r) × 100.</p>",
      ask: { q: "The price of rice falls 20%. By how much can a family increase consumption for the same spending?", a: "20 ÷ 80 × 100 = 25%." } },
    { h: "Growth and depreciation", body: "<p>Population, prices or machine values that change by r% every year:</p><p class='f'>Value after n years = P × (1 ± r/100)ⁿ</p><p>₹1,00,000 machine, 10% depreciation, 2 years: 1,00,000 × 0.9 × 0.9 = <b>₹81,000</b>.</p>",
      ask: { q: "A town of 10,000 grows 10% a year. Population after 2 years?", a: "10,000 × 1.1 × 1.1 = 12,100." } },
    { h: "Exam strategy", body: "<ul><li>Use multiplying factors: +15% → × 1.15, −15% → × 0.85.</li><li>Look at the options first; often one estimate is enough.</li><li>Convert awkward percentages to fractions (16⅔% = 1/6).</li><li>Aim for under 40 seconds per question.</li></ul><p>Next: play with the <b>Try it</b> tools, then do the practice set.</p>" }
  ],
  tools: ["pctOf", "change", "successive", "flash"],
  formulas: [
    ["x% of y", "x × y ÷ 100 (and x% of y = y% of x)"],
    ["A as a % of B", "A ÷ B × 100"],
    ["% change", "(New − Old) ÷ Old × 100"],
    ["A is r% more than B → B is less than A by", "r ÷ (100 + r) × 100"],
    ["A is r% less than B → B is more than A by", "r ÷ (100 − r) × 100"],
    ["Successive changes a%, b%", "a + b + ab ÷ 100"],
    ["Price up r%, keep spending fixed", "cut consumption by r ÷ (100 + r) × 100"],
    ["Growth / depreciation", "P × (1 ± r/100)ⁿ"],
    ["Fractions", "1/2 = 50%, 1/3 = 33⅓%, 1/4 = 25%, 1/6 = 16⅔%, 1/7 = 14 2/7%, 1/8 = 12½%, 1/9 = 11 1/9%, 1/11 = 9 1/11%, 1/12 = 8⅓%"]
  ],
  /* a: index of the correct option is always 0 here; options are shuffled on screen */
  practice: [
    { q: "What is 35% of 240?", o: ["84", "74", "96", "86"], why: "10% of 240 = 24, so 30% = 72 and 5% = 12. 72 + 12 = 84.", hint: "Split 35% into 30% + 5%." },
    { q: "What per cent of 80 is 28?", o: ["35%", "28%", "30%", "40%"], why: "28 ÷ 80 × 100 = 35%.", hint: "A ÷ B × 100." },
    { q: "A number increased by 20% becomes 360. What is the number?", o: ["300", "288", "340", "320"], why: "Number × 1.2 = 360, so the number = 360 ÷ 1.2 = 300.", hint: "Use the multiplying factor 1.2." },
    { q: "A's salary is 25% more than B's. By what per cent is B's salary less than A's?", o: ["20%", "25%", "22.5%", "15%"], why: "25 ÷ (100 + 25) × 100 = 20%.", hint: "The base changes: use r ÷ (100 + r)." },
    { q: "A price is raised by 10% and then reduced by 10%. What is the net change?", o: ["1% decrease", "No change", "1% increase", "2% decrease"], why: "10 − 10 + (10 × −10)/100 = −1, a 1% decrease.", hint: "a + b + ab/100 with b = −10." },
    { q: "A town of 20,000 grows by 10% every year. What will its population be after 2 years?", o: ["24,200", "24,000", "22,000", "24,400"], why: "20,000 × 1.1 × 1.1 = 24,200.", hint: "Growth compounds: multiply by 1.1 twice." },
    { q: "To pass, a student needs 40% marks. She scores 178 and fails by 22 marks. What are the maximum marks?", o: ["500", "450", "400", "550"], why: "Pass mark = 178 + 22 = 200 = 40% of the maximum, so the maximum = 200 ÷ 0.4 = 500.", hint: "First find the pass mark." },
    { q: "The price of petrol rises by 20%. By how much must consumption fall to keep spending the same?", o: ["16⅔%", "20%", "25%", "15%"], why: "20 ÷ 120 × 100 = 16⅔%.", hint: "r ÷ (100 + r) × 100." },
    { q: "12½% of a number is 45. What is the number?", o: ["360", "320", "400", "540"], why: "12½% = 1/8, so the number = 45 × 8 = 360.", hint: "12½% is a fraction from the table." },
    { q: "Two successive discounts of 20% and 10% equal a single discount of…", o: ["28%", "30%", "25%", "32%"], why: "−20 − 10 + (−20 × −10)/100 = −28, a single discount of 28%.", hint: "Use a + b + ab/100 with negative signs." }
  ],
  test: {
    minutes: 8, right: 2, wrong: 0.5,
    items: [
      { q: "What is 15% of 15% of 400?", o: ["9", "6", "12", "22.5"], why: "15% of 400 = 60, and 15% of 60 = 9." },
      { q: "If 60% of a number is 252, what is 25% of the number?", o: ["105", "126", "84", "112"], why: "Number = 252 ÷ 0.6 = 420. 25% of 420 = 105." },
      { q: "A's income is 40% more than B's. By what per cent is B's income less than A's?", o: ["28 4/7%", "40%", "30%", "25%"], why: "40 ÷ 140 × 100 = 28 4/7%." },
      { q: "The length of a rectangle increases by 20% and the breadth decreases by 20%. The area…", o: ["decreases by 4%", "does not change", "increases by 4%", "decreases by 2%"], why: "20 − 20 + (20 × −20)/100 = −4, so the area falls by 4%." },
      { q: "In an election between two candidates, the winner gets 58% of the valid votes and wins by 1,920 votes. How many valid votes were cast?", o: ["12,000", "11,500", "10,000", "12,800"], why: "The margin is 58% − 42% = 16% of the votes = 1,920, so the total = 1,920 ÷ 0.16 = 12,000." },
      { q: "A man spends 75% of his income. His income rises by 20% and his spending by 10%. By what per cent do his savings rise?", o: ["50%", "30%", "45%", "25%"], why: "Take income 100: spending 75, savings 25. New income 120, new spending 82.5, new savings 37.5. Rise = 12.5 ÷ 25 = 50%." },
      { q: "The price of an article falls by 25%. By what per cent must the new price rise to get back to the original?", o: ["33⅓%", "25%", "30%", "20%"], why: "25 ÷ (100 − 25) × 100 = 33⅓%." },
      { q: "A machine worth ₹1,00,000 depreciates by 10% every year. What is it worth after 2 years?", o: ["₹81,000", "₹80,000", "₹90,000", "₹82,000"], why: "1,00,000 × 0.9 × 0.9 = ₹81,000." },
      { q: "x is 20% of y and y is 25% of z. What per cent of z is x?", o: ["5%", "45%", "20%", "10%"], why: "x = 0.2 × 0.25 × z = 0.05z, so x is 5% of z." },
      { q: "When the price of sugar falls by 20%, a person can buy 5 kg more for ₹600. What was the original price per kg?", o: ["₹30", "₹24", "₹25", "₹36"], why: "The saving is 20% of ₹600 = ₹120, which buys 5 kg at the new price, so the new price = ₹24/kg. Original price = 24 ÷ 0.8 = ₹30/kg." }
    ]
  }
};
