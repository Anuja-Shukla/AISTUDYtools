/* SSC CGL · Reasoning · Order & ranking. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["ranking"] = {
  id: "ranking", subject: "reasoning", num: 7, title: "Order & ranking",
  minutes: 30,
  why: "Order and ranking gives 1–2 Tier 1 marks. Almost every question uses one formula: left + right − 1 = total. The rest are comparisons (taller, heavier) that you line up.",
  video: "videos/SSC_R07_Ranking.mp4",
  slides: [
    { h: "The one formula", body: "<p>For a person in a row:</p><p style=\"font-size:20px;font-weight:800;text-align:center\">left + right − 1 = total</p><p>The person is counted from both ends, so subtract 1.</p><p>7th from top and 18th from bottom → 7 + 18 − 1 = <b>24</b> students.</p>", viz: { type: "row", n: 11, p: 4 } },
    { h: "Position from the other end", body: "<p>From the other end = total − position + 1.</p><ul><li>Row of 40, 15th from left → 40 − 15 + 1 = <b>26th</b> from right.</li><li>12th from top in a class of 50 → <b>39th</b> from bottom.</li></ul>",
      ask: { q: "Row of 25, 9th from the left. Position from the right?", a: "25 − 9 + 1 = 17th." } },
    { h: "People between two persons", body: "<p>Change both positions to the same end first.</p><p>Row of 30: A is 10th from left, B is 15th from right → B is 30 − 15 + 1 = 16th from left.</p><p>Between = 16 − 10 − 1 = <b>5</b>.</p>" },
    { h: "Interchange questions", body: "<p>Riya is 12th from left and Meena is 8th from right. They swap, and Riya becomes 18th from left.</p><p>Riya now stands where Meena was. So Meena was 18th from left and 8th from right.</p><p>Total = 18 + 8 − 1 = <b>25</b>.</p>" },
    { h: "Same rank from both ends", body: "<p>If someone is k-th from both ends, total = 2k − 1.</p><p>6th from both ends → 11 people. 13th from both ends → 25.</p>" },
    { h: "Comparisons", body: "<p>Write a chain, tallest on the left.</p><p>D &gt; A, A &gt; B, B &gt; C, C &gt; E → <b>D &gt; A &gt; B &gt; C &gt; E</b>.</p><ul><li>Tallest: D · shortest: E · middle: B</li><li>“Taller than only E” means 2nd from the bottom.</li></ul>",
      ask: { q: "A > B, C < B, D > A. Who is lightest?", a: "D > A > B > C → C." } },
    { h: "Queues", body: "<p>X is 12th from the front. Y is 4 places ahead of X → 12 − 4 = <b>8th</b>.</p><p>B is 5 places behind A, who is 8th → <b>13th</b>.</p><p>Ahead means a smaller number; behind means a larger number.</p>" },
    { h: "Exam strategy", body: "<ul><li>Write L + R − 1 = N on paper first.</li><li>Convert every position to the same end.</li><li>Draw a short row of dots for interchange questions.</li><li>For comparisons, write one chain and read the answer off it.</li></ul>" }
  ],
  tools: ["rankcalc", "rankbetween", "rankorder", "rankgame"],
  formulas: [
    ["Total", "left + right − 1"],
    ["Other end", "total − position + 1"],
    ["Between (same end)", "|p₁ − p₂| − 1"],
    ["k-th from both ends", "total = 2k − 1"],
    ["Interchange", "new position of one = old position of the other"]
  ],
  practice: [
    { q: "Ravi is 7th from the top and 18th from the bottom of his class. How many students are there?", o: ["24", "25", "23", "26"], why: "7 + 18 − 1.", hint: "Subtract 1." },
    { q: "In a row of 40, A is 15th from the left. What is A’s position from the right?", o: ["26th", "25th", "27th", "24th"], why: "40 − 15 + 1.", hint: "Total − position + 1." },
    { q: "Row of 30: A is 10th from the left and B is 15th from the right. How many are between them?", o: ["5", "4", "6", "3"], why: "B is 16th from left; 16 − 10 − 1.", hint: "Convert B to the left end." },
    { q: "Sita is 12th from the top in a class of 50. Her rank from the bottom is:", o: ["39th", "38th", "40th", "37th"], why: "50 − 12 + 1.", hint: "Other end." },
    { q: "P is taller than Q, Q is taller than R, and S is taller than P. Who is the tallest?", o: ["S", "P", "Q", "R"], why: "S > P > Q > R.", hint: "Write a chain." },
    { q: "In a queue, A is 8th from the front. B is 5 places behind A. B’s position from the front is:", o: ["13th", "12th", "3rd", "14th"], why: "8 + 5.", hint: "Behind = larger number." },
    { q: "In a class of 30, Mohan is 9th from the top. Sohan is 6 ranks below Mohan. Sohan’s rank from the bottom is:", o: ["16th", "15th", "17th", "14th"], why: "Sohan is 15th from top; 30 − 15 + 1.", hint: "Find Sohan from the top first." },
    { q: "D > A, A > B, B > C, C > E (by height). Who is in the middle?", o: ["B", "A", "C", "D"], why: "D > A > B > C > E.", hint: "Five people; the 3rd." },
    { q: "Riya is 12th from left and Meena 8th from right. They swap, and Riya is now 18th from left. How many are in the row?", o: ["25", "26", "24", "20"], why: "Meena was 18th from left; 18 + 8 − 1.", hint: "Riya takes Meena’s place." },
    { q: "Amit is 6th from both ends of a row. How many are in the row?", o: ["11", "12", "10", "13"], why: "2 × 6 − 1.", hint: "2k − 1." }
  ],
  test: {
    minutes: 6, right: 2, wrong: 0.5,
    items: [
      { q: "A student is 11th from the top and 30th from the bottom. How many students are there?", o: ["40", "41", "39", "42"], why: "11 + 30 − 1." },
      { q: "In a row of 25, X is 9th from the left. X’s position from the right is:", o: ["17th", "16th", "18th", "15th"], why: "25 − 9 + 1." },
      { q: "Row of 50: A is 20th from the left and B is 20th from the right. How many are between them?", o: ["10", "11", "9", "12"], why: "B is 31st from left; 31 − 20 − 1." },
      { q: "15th from the top in a class of 45 is what rank from the bottom?", o: ["31st", "30th", "32nd", "29th"], why: "45 − 15 + 1." },
      { q: "A is heavier than B, C is lighter than B, D is heavier than A. Who is the lightest?", o: ["C", "B", "A", "D"], why: "D > A > B > C." },
      { q: "In a queue, X is 12th from the front. Y is 4 places ahead of X. Y’s position is:", o: ["8th", "16th", "9th", "7th"], why: "Ahead → 12 − 4." },
      { q: "A girl is 13th from both ends of a row. How many are in the row?", o: ["25", "26", "24", "27"], why: "2 × 13 − 1." },
      { q: "A is 10th from left and B 6th from right. They swap, and A becomes 15th from left. How many are in the row?", o: ["20", "21", "19", "25"], why: "B was 15th from left; 15 + 6 − 1." },
      { q: "C is taller than only E. B is taller than A and C but shorter than D. Who is the tallest?", o: ["D", "B", "A", "C"], why: "D > B > A > C > E." },
      { q: "Ram is 10th from the top in a class of 35. How many students are below him?", o: ["25", "26", "24", "34"], why: "35 − 10." }
    ]
  }
};
