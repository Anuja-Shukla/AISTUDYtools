/* SSC CGL · Quant · Time & work, pipes & cisterns. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["time-work"] = {
  id: "time-work", subject: "quant", num: 10, title: "Time & work, pipes & cisterns",
  minutes: 45,
  why: "Time & work and pipes & cisterns give 1–2 Tier 1 questions. The LCM (total units) method turns almost all of them into simple division.",
  video: "videos/SSC_Q10_Time_Work.mp4",
  slides: [
    { h: "Why time & work matters", body: "<p>All these questions use one idea: <b>work = rate × time</b>.</p><ul><li>people or machines working together</li><li>someone leaving midway</li><li>men, days and hours (man-days)</li><li>sharing wages</li><li>pipes filling and leaks emptying a tank</li></ul><p>The fastest method: pretend the job has a fixed number of <b>units</b>.</p>" },
    { h: "Rate of work", body: "<p>If A finishes a job in 10 days, A does <b>1/10</b> of it each day.</p><p class='f'>Together: 1/A + 1/B per day &nbsp;&nbsp; Time = 1 ÷ (combined rate)</p><p>A 10 days, B 15 days: 1/10 + 1/15 = 1/6 → <b>6 days</b>.</p>",
      ask: { q: "A takes 12 days and B 18 days. How long together?", a: "1/12 + 1/18 = 5/36 → 36/5 = 7.2 days." } },
    { h: "The LCM (total units) method", body: "<p>Let the job be the LCM of the days. A 10 days, B 15 days → job = <b>30 units</b>.</p><ul><li>A does 30 ÷ 10 = 3 units a day</li><li>B does 30 ÷ 15 = 2 units a day</li><li>Together 5 units a day → 30 ÷ 5 = <b>6 days</b></li></ul><p>No fractions, and it scales to three people or pipes easily.</p>", viz: { type: "units", d: [10, 15] } },
    { h: "Efficiency", body: "<p>Efficiency and time are <b>inversely</b> proportional. If A is twice as efficient as B, A takes half the time.</p><p>Together they take 12 days. Units/day: A 2, B 1 → 3 units × 12 = 36 units. A alone: 36 ÷ 2 = <b>18 days</b>.</p>",
      ask: { q: "A is 50% more efficient than B, who alone takes 30 days. How long do they take together?", a: "A takes 30 ÷ 1.5 = 20 days. Together: 1/20 + 1/30 = 1/12 → 12 days." } },
    { h: "Someone leaves midway", body: "<p>A takes 20 days and B 30 days → job = 60 units; A 3/day, B 2/day.</p><p>They work together for 6 days: 6 × 5 = 30 units. Then A leaves.</p><p>B does the remaining 30 units at 2 a day → <b>15 more days</b>.</p>",
      ask: { q: "A takes 15 days and B 20 days. They work together for 4 days. What fraction is left?", a: "4 × (1/15 + 1/20) = 4 × 7/60 = 28/60. Left = 32/60 = 8/15." } },
    { h: "Men, days and hours", body: "<p class='f'>M₁ × D₁ × H₁ ÷ W₁ = M₂ × D₂ × H₂ ÷ W₂</p><p>12 men take 10 days, so 15 men take 12 × 10 ÷ 15 = <b>8 days</b>.</p><p>10 men, 8 hours a day, 12 days → 16 men, 6 hours a day: 10 × 8 × 12 = 16 × 6 × D → D = <b>10 days</b>.</p>",
      ask: { q: "20 men can finish a job in 30 days. After 10 days, 5 men leave. How long does the rest take?", a: "Work left = 20 × 20 = 400 man-days. 400 ÷ 15 = 26⅔ days." } },
    { h: "Sharing wages", body: "<p>Wages are shared in the ratio of <b>work done</b>. When people work for the same number of days, that is the ratio of their efficiencies.</p><p>A takes 10 days and B 15 days; they work together for ₹1,500. Efficiency 3 : 2 → A gets <b>₹900</b>, B ₹600.</p>" },
    { h: "Pipes and cisterns", body: "<p>A filling pipe does <b>+</b> work; a leak or outlet does <b>−</b> work.</p><p>A fills a tank in 12 h, B empties it in 18 h. Net: 1/12 − 1/18 = 1/36 → <b>36 hours</b>.</p><p>If a pipe takes 8 h but 10 h with a leak, the leak alone empties it in 1 ÷ (1/8 − 1/10) = 40 h.</p>",
      ask: { q: "A fills a tank in 10 h, B in 15 h, and C empties it in 30 h. All open: how long to fill?", a: "1/10 + 1/15 − 1/30 = 4/30 → 7.5 hours." } },
    { h: "Exam strategy", body: "<ul><li>Take the job = LCM of the times; work in units per day.</li><li>Efficiency ratio = inverse of the time ratio.</li><li>Pipes: fill is +, empty is −.</li><li>Man-days: M × D × H stays the same for the same job.</li></ul><p>Next: try the <b>Try it</b> tools, then the practice set.</p>" }
  ],
  tools: ["together", "leaves", "mandays", "pipes"],
  formulas: [
    ["One day's work", "1 ÷ days"],
    ["Working together", "1 ÷ (1/a + 1/b)"],
    ["Two people", "ab ÷ (a + b)"],
    ["LCM method", "job = LCM of times; units/day = job ÷ time"],
    ["Efficiency", "inversely proportional to time"],
    ["Man-days", "M₁D₁H₁ ÷ W₁ = M₂D₂H₂ ÷ W₂"],
    ["Wages", "in the ratio of work done"],
    ["Pipes", "fill +, empty −; time = 1 ÷ net rate"],
    ["Leak", "leak time = 1 ÷ (1/normal − 1/with leak)"],
    ["A+B, B+C, C+A given", "A + B + C = half the sum of the three rates"]
  ],
  /* a: index of the correct option is always 0 here; options are shuffled on screen */
  practice: [
    { q: "A can finish a job in 10 days and B in 15. Together they take…", o: ["6 days", "12.5 days", "5 days", "8 days"], why: "30 units; A 3/day, B 2/day → 30 ÷ 5 = 6.", hint: "Use LCM 30 as the job." },
    { q: "A takes 12 days and B 18 days. Together they take…", o: ["7.2 days", "15 days", "6 days", "7.5 days"], why: "36 units; 3 + 2 = 5 a day → 36 ÷ 5 = 7.2.", hint: "LCM of 12 and 18 is 36." },
    { q: "A is twice as efficient as B and together they take 12 days. A alone takes…", o: ["18 days", "24 days", "36 days", "16 days"], why: "Units/day 2 + 1 = 3; job = 36; A: 36 ÷ 2 = 18.", hint: "Give A 2 units and B 1 unit a day." },
    { q: "12 men can do a job in 10 days. 15 men can do it in…", o: ["8 days", "12.5 days", "9 days", "7 days"], why: "12 × 10 = 120 man-days ÷ 15 = 8.", hint: "Man-days stay the same." },
    { q: "Pipe A fills a tank in 12 h and B empties it in 18 h. Both open, the tank fills in…", o: ["36 hours", "7.2 hours", "30 hours", "6 hours"], why: "1/12 − 1/18 = 1/36.", hint: "The emptying pipe is negative." },
    { q: "A takes 20 days and B 30. They work together for 6 days, then A leaves. B finishes the rest in…", o: ["15 days", "12 days", "18 days", "10 days"], why: "60 units; 6 × 5 = 30 done; 30 ÷ 2 = 15.", hint: "Find what is done in 6 days first." },
    { q: "A and B together take 8 days; A alone takes 12. B alone takes…", o: ["24 days", "20 days", "16 days", "4 days"], why: "1/8 − 1/12 = 1/24.", hint: "Subtract A's rate." },
    { q: "A takes 10 days and B 15. They work together and earn ₹1,500. A's share is…", o: ["₹900", "₹600", "₹750", "₹1,000"], why: "Efficiency 3 : 2 → A = 3/5 × 1,500.", hint: "Share by work done." },
    { q: "Pipes A and B fill a tank in 10 h and 15 h; C empties it in 30 h. All three open, it fills in…", o: ["7.5 hours", "6 hours", "8 hours", "5 hours"], why: "1/10 + 1/15 − 1/30 = 4/30.", hint: "Add the fillers, subtract the emptier." },
    { q: "10 men working 8 hours a day finish a job in 12 days. 16 men working 6 hours a day finish it in…", o: ["10 days", "8 days", "12 days", "9 days"], why: "10 × 8 × 12 = 16 × 6 × D → D = 10.", hint: "M × D × H is constant." }
  ],
  test: {
    minutes: 9, right: 2, wrong: 0.5,
    items: [
      { q: "A and B can do a job in 12 days, B and C in 15 days, and C and A in 20 days. All three together take…", o: ["10 days", "12 days", "15 days", "8 days"], why: "2(A + B + C) = 1/12 + 1/15 + 1/20 = 1/5, so A + B + C = 1/10." },
      { q: "With the same data, A alone takes…", o: ["30 days", "20 days", "60 days", "24 days"], why: "A = (A + B + C) − (B + C) = 1/10 − 1/15 = 1/30." },
      { q: "A takes 15 days and B 20 days. They work together for 4 days. The fraction of work left is…", o: ["8/15", "7/15", "1/4", "1/10"], why: "4 × 7/60 = 7/15 done, so 8/15 is left." },
      { q: "A is 50% more efficient than B. B alone takes 30 days. Together they take…", o: ["12 days", "15 days", "18 days", "10 days"], why: "A takes 20 days. 1/20 + 1/30 = 1/12." },
      { q: "20 men can finish a job in 30 days. After 10 days, 5 men leave. The rest of the work takes…", o: ["26 2/3 days", "20 days", "25 days", "30 days"], why: "Left: 20 × 20 = 400 man-days ÷ 15 men = 26⅔ days." },
      { q: "Taps A and B fill a tank in 6 h and 8 h. Both are opened; after 2 h, B is closed. The tank is full after…", o: ["4.5 hours", "4 hours", "5 hours", "3.5 hours"], why: "In 2 h: 2 × 7/24 = 14/24. A fills 10/24 at 4/24 per hour in 2.5 h. Total 4.5 h." },
      { q: "A pipe fills a tank in 8 h, but because of a leak it takes 10 h. The leak alone empties the full tank in…", o: ["40 hours", "18 hours", "20 hours", "80 hours"], why: "1/8 − 1/10 = 1/40." },
      { q: "6 men or 10 women can do a job in 15 days. 3 men and 5 women together take…", o: ["15 days", "30 days", "7.5 days", "20 days"], why: "3 men = 5 women, so the team is 10 women: 15 days." },
      { q: "A does 1/3 of a job in 5 days and B does 2/5 of it in 10 days. Together they finish it in…", o: ["9 3/8 days", "10 days", "8 days", "9 days"], why: "A takes 15 days, B 25 days. 1/15 + 1/25 = 8/75 → 75/8 = 9⅜ days." },
      { q: "A, B and C can do a job in 10, 12 and 15 days. Working together, they earn ₹4,500. C's share is…", o: ["₹1,200", "₹1,500", "₹1,800", "₹1,000"], why: "Efficiency 6 : 5 : 4 (job of 60 units). C = 4/15 × 4,500 = ₹1,200." }
    ]
  }
};
