/* SSC CGL · Quant · Data interpretation. Original teaching material and questions by AIStudyTools. All data are made up for practice. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["di"] = {
  id: "di", subject: "quant", num: 16, title: "Data interpretation",
  minutes: 45,
  why: "Data interpretation gives a set of 3–5 Tier 1 questions on one table or chart. They use percentages, ratios and averages, so speed and approximation matter most.",
  video: "videos/SSC_Q16_DI.mp4",
  slides: [
    { h: "Why data interpretation matters", body: "<p>One chart, several questions. You will see:</p><ul><li><b>tables</b> of values by year or category</li><li><b>bar charts</b> (single or grouped)</li><li><b>pie charts</b> in % or degrees</li><li><b>line graphs</b> showing a trend</li></ul><p>Every question uses skills you already have: % change, ratio, average and approximation.</p>" },
    { h: "Read before you calculate", body: "<ul><li>Read the title and the <b>units</b> (₹ crore, thousands, %).</li><li>Check what each axis or column means.</li><li>Look at the options first: often an estimate is enough.</li><li>Do all the questions on one chart together; you will reuse numbers.</li></ul><p class='warn'>Most DI mistakes come from the wrong base year or the wrong unit, not from arithmetic.</p>" },
    { h: "% change from a table", body: "<p>Sales (₹ crore): 2019 120 · 2020 150 · 2021 135 · 2022 180 · 2023 216.</p><p class='f'>% change = (New − Old) ÷ Old × 100</p><ul><li>2019 → 2020: 30 ÷ 120 = <b>25%</b></li><li>2020 → 2021: −15 ÷ 150 = −10%</li><li>2021 → 2022: 45 ÷ 135 = <b>33⅓%</b> (the highest growth)</li></ul>", viz: { type: "bars", l: ["2019", "2020", "2021", "2022", "2023"], v: [120, 150, 135, 180, 216] },
      ask: { q: "What is the ratio of sales in 2021 to 2023?", a: "135 : 216 = 5 : 8." } },
    { h: "Averages and totals", body: "<p>Average sales = (120 + 150 + 135 + 180 + 216) ÷ 5 = 801 ÷ 5 = <b>160.2</b>.</p><p>Shortcut: take a base (say 150) and add the average of the differences: (−30 + 0 − 15 + 30 + 66) ÷ 5 = 10.2 → 160.2.</p>" },
    { h: "Pie charts", body: "<p>A full pie is 100% = 360°, so <b>1% = 3.6°</b>.</p><p>A family spends ₹40,000 a month: Rent 30%, Food 25%, Savings 20%, Education 15%, Transport 10%.</p><ul><li>Angle for Food = 25 × 3.6 = <b>90°</b></li><li>Savings = 20% of 40,000 = <b>₹8,000</b></li><li>Rent − Education = 15% of 40,000 = ₹6,000</li></ul>", viz: { type: "pie", l: ["Rent", "Food", "Savings", "Education", "Transport"], v: [30, 25, 20, 15, 10] },
      ask: { q: "A sector is 54° of a ₹50 lakh budget. How much is it?", a: "54 ÷ 360 = 15% → ₹7.5 lakh." } },
    { h: "Bar charts and comparisons", body: "<p>Students in four colleges: A 400, B 550, C 300, D 750 (total 2,000).</p><ul><li>D's share = 750 ÷ 2,000 = <b>37.5%</b></li><li>B is more than A by 150 ÷ 400 = <b>37.5%</b></li><li>Average = 2,000 ÷ 4 = 500</li></ul><p>“A is what % of B” divides by B; “A is what % more than B” divides the difference by B.</p>" },
    { h: "Line graphs", body: "<p>On a line graph, the <b>steepest</b> segment shows the biggest change in value, but not always the biggest <b>% change</b>: a rise of 30 from 60 (50%) beats a rise of 40 from 120 (33%).</p><p>Always divide by the starting value when the question asks for a percentage.</p>" },
    { h: "Exam strategy", body: "<ul><li>Note the unit and the base before calculating.</li><li>Round to friendly numbers when the options are far apart.</li><li>Compare fractions by cross-multiplying instead of dividing.</li><li>Pie charts: % × 3.6 = degrees.</li></ul><p>Next: try the <b>Try it</b> tools, including a random DI drill, then the practice set.</p>" }
  ],
  tools: ["ditable", "pietool", "fraccmp", "didrill"],
  formulas: [
    ["% change", "(New − Old) ÷ Old × 100"],
    ["A as % of B", "A ÷ B × 100"],
    ["A is % more than B", "(A − B) ÷ B × 100"],
    ["Share of total", "part ÷ total × 100"],
    ["Pie: % to degrees", "% × 3.6"],
    ["Pie: degrees to amount", "angle ÷ 360 × total"],
    ["Average", "sum ÷ number of items"],
    ["Compare a/b and c/d", "compare a × d with b × c"]
  ],
  /* a: index of the correct option is always 0 here; options are shuffled on screen */
  practice: [
    { q: "Sales (₹ crore): 2019 120, 2020 150. The % increase is…", o: ["25%", "20%", "30%", "15%"], why: "30 ÷ 120 = 25%.", hint: "Divide by the earlier year." },
    { q: "Sales (₹ crore): 120, 150, 135, 180, 216 for 2019–2023. The average is…", o: ["160.2", "165", "155.4", "162"], why: "801 ÷ 5 = 160.2.", hint: "Add and divide by 5." },
    { q: "Using the same sales, which year had the highest % growth over the previous year?", o: ["2022", "2020", "2023", "2021"], why: "2022: 45 ÷ 135 = 33⅓%, the largest.", hint: "Compare growth ÷ previous value." },
    { q: "Using the same sales, the ratio of 2021 to 2023 is…", o: ["5 : 8", "3 : 5", "5 : 7", "8 : 5"], why: "135 : 216 = 5 : 8 (both ÷ 27).", hint: "Find the HCF." },
    { q: "A family spends 25% of ₹40,000 on food. In a pie chart, the food sector's angle is…", o: ["90°", "100°", "72°", "25°"], why: "25 × 3.6 = 90°.", hint: "1% = 3.6°." },
    { q: "The family saves 20% of ₹40,000. Savings = ?", o: ["₹8,000", "₹6,000", "₹10,000", "₹4,000"], why: "0.2 × 40,000.", hint: "Percentage of the total." },
    { q: "Rent is 30% and education 15% of ₹40,000. Rent exceeds education by…", o: ["₹6,000", "₹12,000", "₹4,500", "₹15,000"], why: "15% of 40,000 = 6,000.", hint: "Subtract the percentages first." },
    { q: "Colleges A, B, C, D have 400, 550, 300 and 750 students. D's share of the total is…", o: ["37.5%", "40%", "35%", "75%"], why: "750 ÷ 2,000.", hint: "Total = 2,000." },
    { q: "Using the same data, B has how many % more students than A?", o: ["37.5%", "27.3%", "15%", "150%"], why: "150 ÷ 400 = 37.5%.", hint: "Divide the difference by A." },
    { q: "Using the same data, the average number of students per college is…", o: ["500", "550", "475", "400"], why: "2,000 ÷ 4.", hint: "Total ÷ 4." }
  ],
  test: {
    minutes: 9, right: 2, wrong: 0.5,
    items: [
      { q: "Car production (thousands) by company P over 4 years: 40, 45, 50, 60. Total production?", o: ["195", "190", "200", "185"], why: "40 + 45 + 50 + 60 = 195." },
      { q: "Company Q produced 35, 42, 56, 49 (thousands) in the same years as P (40, 45, 50, 60). In which year did Q exceed P?", o: ["Year 3", "Year 2", "Year 4", "Year 1"], why: "Year 3: 56 > 50." },
      { q: "P's production rose from 40 to 60 over the four years. The % increase is…", o: ["50%", "33⅓%", "20%", "60%"], why: "20 ÷ 40 = 50%." },
      { q: "In year 2, P made 45 and Q made 42. Ratio P : Q = ?", o: ["15 : 14", "14 : 15", "9 : 7", "5 : 4"], why: "45 : 42 = 15 : 14." },
      { q: "Q's production: 35, 42, 56, 49. Its average is…", o: ["45.5", "46", "44.5", "47"], why: "182 ÷ 4 = 45.5." },
      { q: "In a pie chart of a company's spending, salaries take 108°. What % is that?", o: ["30%", "27%", "36%", "33%"], why: "108 ÷ 3.6 = 30%." },
      { q: "Total spending is ₹50 lakh and marketing is 54°. Marketing spend = ?", o: ["₹7.5 lakh", "₹5.4 lakh", "₹10.8 lakh", "₹6 lakh"], why: "54 ÷ 360 × 50 = 7.5." },
      { q: "Raw material is 90° and transport 36° of ₹50 lakh. Raw material exceeds transport by…", o: ["₹7.5 lakh", "₹5.4 lakh", "₹12.5 lakh", "₹5 lakh"], why: "54 ÷ 360 × 50 = 7.5." },
      { q: "A student's marks (out of 100): 84, 76, 68, 72, 80. The average is…", o: ["76", "75", "77", "78"], why: "380 ÷ 5 = 76." },
      { q: "Using the same marks, in how many subjects is the score above the average?", o: ["2", "3", "1", "4"], why: "Only 84 and 80 are above 76." }
    ]
  }
};
