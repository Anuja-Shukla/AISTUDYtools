/* SSC CGL · Quant · Averages. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["averages"] = {
  id: "averages", subject: "quant", num: 5, title: "Averages",
  minutes: 40,
  why: "Averages give 1–2 Tier 1 questions every year and are the base for data interpretation, statistics and speed questions.",
  video: "videos/SSC_Q05_Averages.mp4",
  slides: [
    { h: "Why averages matter", body: "<p>Average questions look different but use one idea: <b>total = average × count</b>. You will see:</p><ul><li>someone joining, leaving or being replaced</li><li>two groups combined</li><li>a wrong entry corrected</li><li>a batsman's average after one more innings</li><li>average speed</li></ul>" },
    { h: "Average and total", body: "<p class='f'>Average = Sum ÷ Number of items &nbsp;&nbsp; Sum = Average × Number</p><p>The average of 24, 36, 42, 18 and 30 is 150 ÷ 5 = <b>30</b>.</p><p>Most questions are solved by working with <b>totals</b>, not averages.</p>",
      ask: { q: "The average of 5 numbers is 18. What is their sum?", a: "18 × 5 = 90." } },
    { h: "The deviation (assumed average) method", body: "<p>Pick a base close to the numbers and add the average of the differences.</p><p>Marks 72, 75, 78, 81, 74. Base 75 → differences −3, 0, +3, +6, −1 → total +5 → average difference +1.</p><p class='f'>Average = 75 + 1 = 76</p><p>The differences always balance to zero around the true average.</p>" },
    { h: "Consecutive numbers", body: "<p>For numbers in equal steps (an AP), the average is the <b>middle term</b> = (first + last) ÷ 2.</p><ul><li>First n natural numbers: (n + 1) ÷ 2</li><li>First n even numbers: n + 1</li><li>First n odd numbers: n</li></ul><p>Average of 1 to 50 = 51 ÷ 2 = <b>25.5</b>.</p>",
      ask: { q: "Find the average of all odd numbers from 11 to 29.", a: "(11 + 29) ÷ 2 = 20." } },
    { h: "Someone joins or leaves", body: "<p>Average age of 10 students is 15. With the teacher it becomes 16. Teacher's age?</p><p>New total − old total = 16 × 11 − 15 × 10 = 176 − 150 = <b>26</b>.</p><p class='f'>Joiner = new average + (old count) × (rise)</p><p>Here: 16 + 10 × 1 = 26.</p>",
      ask: { q: "The average of 5 numbers is 40. One is removed and the average becomes 38. Which number was removed?", a: "200 − 38 × 4 = 200 − 152 = 48." } },
    { h: "Replacement", body: "<p>When one item is replaced, the count stays the same:</p><p class='f'>New item = old item + count × change in average</p><p>Average weight of 8 people rises by 1.5 kg when a 52 kg person is replaced. New person = 52 + 8 × 1.5 = <b>64 kg</b>.</p>",
      ask: { q: "Average weight of 8 persons rises by 2.5 kg when a new person replaces one of 65 kg. New person's weight?", a: "65 + 8 × 2.5 = 85 kg." } },
    { h: "Combined (weighted) average", body: "<p class='f'>Combined average = (n₁a₁ + n₂a₂) ÷ (n₁ + n₂)</p><p>Section A: 30 students, average 60. Section B: 20 students, average 70.</p><p>(1,800 + 1,400) ÷ 50 = <b>64</b>, closer to 60 because A is bigger.</p>",
      ask: { q: "40 students average 50 and 60 students average 60. Combined average?", a: "(2,000 + 3,600) ÷ 100 = 56." } },
    { h: "Correcting a wrong entry", body: "<p>Average of 20 values is 45, but 36 was written as 63.</p><p>The total was too high by 63 − 36 = 27, so the average is too high by 27 ÷ 20 = 1.35.</p><p class='f'>Correct average = 45 − 1.35 = 43.65</p>" },
    { h: "Average speed: the trap", body: "<p>Equal distances at x and y km/h: average speed is <b>not</b> (x + y) ÷ 2.</p><p class='f'>Average speed = 2xy ÷ (x + y)</p><p>Going at 40 and returning at 60: 2 × 40 × 60 ÷ 100 = <b>48 km/h</b>, not 50.</p><p>Average speed is always total distance ÷ total time.</p>",
      ask: { q: "A cyclist goes at 30 km/h and returns at 20 km/h. Average speed?", a: "2 × 30 × 20 ÷ 50 = 24 km/h." } },
    { h: "Batsman's average", body: "<p>In the 11th innings a batsman scores 90 and his average rises by 5.</p><p>Let the old average be a: 10a + 90 = 11(a + 5) → a = 35. New average = <b>40</b>.</p><p class='f'>New average = score − (old innings) × rise = 90 − 10 × 5</p>" },
    { h: "Exam strategy", body: "<ul><li>Convert every average to a total first.</li><li>Joining, leaving and replacing: use the one-line formulas.</li><li>For speeds over equal distances, never add and halve.</li><li>Use the deviation method for long lists of close numbers.</li></ul><p>Next: try the <b>Try it</b> tools, then the practice set.</p>" }
  ],
  tools: ["devavg", "joinleave", "combavg", "avgspeed"],
  formulas: [
    ["Average", "Sum ÷ Number of items"],
    ["Sum", "Average × Number of items"],
    ["Deviation method", "Base + (sum of differences ÷ count)"],
    ["Numbers in equal steps (AP)", "(first + last) ÷ 2"],
    ["First n natural / even / odd numbers", "(n + 1) ÷ 2 / n + 1 / n"],
    ["Someone joins", "joiner = new avg × (n + 1) − old avg × n"],
    ["Someone leaves", "leaver = old avg × n − new avg × (n − 1)"],
    ["Replacement", "new item = old item + n × change in average"],
    ["Combined average", "(n₁a₁ + n₂a₂) ÷ (n₁ + n₂)"],
    ["Wrong entry", "correct avg = old avg − (wrong − right) ÷ n"],
    ["Average speed, equal distances", "2xy ÷ (x + y); three distances: 3xyz ÷ (xy + yz + zx)"],
    ["Batsman, next innings", "new avg = score − (old innings) × rise"]
  ],
  /* a: index of the correct option is always 0 here; options are shuffled on screen */
  practice: [
    { q: "What is the average of 24, 36, 42, 18 and 30?", o: ["30", "32", "28", "36"], why: "Sum = 150, so 150 ÷ 5 = 30.", hint: "Add, then divide by 5." },
    { q: "What is the average of the first 50 natural numbers?", o: ["25.5", "25", "26", "50"], why: "(1 + 50) ÷ 2 = 25.5.", hint: "First plus last, divided by 2." },
    { q: "The average of 5 numbers is 40. When one is removed, the average becomes 38. The number removed is…", o: ["48", "42", "40", "38"], why: "200 − 4 × 38 = 200 − 152 = 48.", hint: "Old total minus new total." },
    { q: "The average age of 30 students is 14. When the teacher is included, it becomes 15. The teacher's age is…", o: ["45", "44", "46", "31"], why: "15 × 31 − 14 × 30 = 465 − 420 = 45.", hint: "Joiner = new avg + old count × rise." },
    { q: "Class A has 40 students with average 50 and class B has 60 with average 60. The combined average is…", o: ["56", "55", "54", "58"], why: "(2,000 + 3,600) ÷ 100 = 56.", hint: "Work with totals." },
    { q: "A car goes from A to B at 40 km/h and returns at 60 km/h. The average speed is…", o: ["48 km/h", "50 km/h", "45 km/h", "52 km/h"], why: "Equal distances: 2 × 40 × 60 ÷ (40 + 60) = 48 km/h.", hint: "Don't add and halve." },
    { q: "The average of 10 numbers is 25. If each number is multiplied by 3, the new average is…", o: ["75", "28", "25", "50"], why: "Multiplying every number by 3 multiplies the average by 3.", hint: "What happens to the total?" },
    { q: "The average of 20 values was 45, but 36 was wrongly written as 63. The correct average is…", o: ["43.65", "46.35", "44.1", "43.2"], why: "The total was 27 too high: 45 − 27 ÷ 20 = 43.65.", hint: "Find how much the total was off." },
    { q: "A batsman scores 90 in his 11th innings and his average rises by 5. His new average is…", o: ["40", "45", "35", "50"], why: "New average = 90 − 10 × 5 = 40.", hint: "Score − old innings × rise." },
    { q: "The average of three consecutive even numbers is 24. The largest is…", o: ["26", "24", "28", "22"], why: "The middle one is 24, so the numbers are 22, 24, 26.", hint: "For equal steps, average = middle number." }
  ],
  test: {
    minutes: 8, right: 2, wrong: 0.5,
    items: [
      { q: "The average of 7 numbers is 30. The average of the first four is 28 and of the last four is 33. The fourth number is…", o: ["34", "30", "32", "36"], why: "28 × 4 + 33 × 4 − 30 × 7 = 112 + 132 − 210 = 34 (the 4th number is counted twice)." },
      { q: "The average weight of 8 persons increases by 2.5 kg when a new person replaces one of 65 kg. The new person weighs…", o: ["85 kg", "80 kg", "75 kg", "90 kg"], why: "65 + 8 × 2.5 = 85 kg." },
      { q: "The average salary of all workers is ₹8,000. Seven technicians average ₹12,000 and the rest average ₹6,000. How many workers are there?", o: ["21", "22", "20", "24"], why: "84,000 + 6,000(n − 7) = 8,000n → 42,000 = 2,000n → n = 21." },
      { q: "The average of 11 results is 50. The first six average 49 and the last six average 52. The sixth result is…", o: ["56", "50", "52", "54"], why: "294 + 312 − 550 = 56." },
      { q: "The average of all odd numbers from 1 to 99 is…", o: ["50", "49", "51", "49.5"], why: "(1 + 99) ÷ 2 = 50." },
      { q: "A man covers three equal distances at 10, 20 and 30 km/h. His average speed is…", o: ["16 4/11 km/h", "20 km/h", "18 km/h", "15 km/h"], why: "3 ÷ (1/10 + 1/20 + 1/30) = 3 ÷ 11/60 = 180/11 = 16 4/11 km/h." },
      { q: "The average of four consecutive odd numbers is 24. The product of the smallest and the largest is…", o: ["567", "525", "621", "575"], why: "The numbers are 21, 23, 25, 27. 21 × 27 = 567." },
      { q: "At their marriage the average age of a husband and wife was 23. Five years later they have a 1-year-old child. The family's average age now is…", o: ["19", "20", "18", "21"], why: "(28 + 28 + 1) ÷ 3 = 57 ÷ 3 = 19." },
      { q: "The average mark of 30 students is 45. The top 5 average 80. The average of the rest is…", o: ["38", "40", "36", "35"], why: "(1,350 − 400) ÷ 25 = 38." },
      { q: "The average of the first 10 multiples of 7 is…", o: ["38.5", "35", "42", "38"], why: "7 × (1 + 10) ÷ 2 = 38.5." }
    ]
  }
};
