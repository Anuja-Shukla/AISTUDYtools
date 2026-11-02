/* SSC CGL · Quant · Number system. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["number-system"] = {
  id: "number-system", subject: "quant", num: 1, title: "Number system",
  minutes: 50,
  why: "Number system gives 1–3 direct Tier 1 questions (divisibility, HCF & LCM, remainders, unit digits) and is the base for simplification and every arithmetic topic.",
  video: "videos/SSC_Q01_Number_System.mp4",
  slides: [
    { h: "Why number system matters", body: "<p>This is the foundation of Quant. Expect questions on:</p><ul><li>types of numbers and primes</li><li>divisibility rules</li><li>factors, HCF and LCM</li><li>remainders and unit digits</li><li>sums of series and trailing zeros</li></ul><p>Most of these can be solved in under 30 seconds once you know the rule.</p>" },
    { h: "Types of numbers", body: "<ul><li><b>Natural</b>: 1, 2, 3, … &nbsp; <b>Whole</b>: 0, 1, 2, … &nbsp; <b>Integers</b>: … −2, −1, 0, 1, 2 …</li><li><b>Rational</b>: can be written p/q (q ≠ 0), e.g. 0.75 = 3/4. <b>Irrational</b>: cannot, e.g. √2, π.</li><li><b>Prime</b>: exactly two factors (2, 3, 5, 7, 11 …). <b>Composite</b>: more than two.</li><li><b>Co-prime</b>: HCF is 1, e.g. 8 and 15.</li></ul><p class='warn'>1 is neither prime nor composite. 2 is the only even prime. There are 25 primes up to 100.</p>",
      ask: { q: "Is 91 a prime number?", a: "No. 91 = 7 × 13. To test a number, try primes up to its square root (√91 ≈ 9.5, so try 2, 3, 5, 7)." } },
    { h: "Divisibility rules", body: "<ul><li><b>2</b>: last digit even &nbsp; <b>5</b>: last digit 0 or 5 &nbsp; <b>10</b>: last digit 0</li><li><b>3</b> / <b>9</b>: sum of digits divisible by 3 / 9</li><li><b>4</b>: last two digits divisible by 4 &nbsp; <b>8</b>: last three digits divisible by 8</li><li><b>6</b>: divisible by both 2 and 3</li><li><b>11</b>: (sum of digits in odd places) − (sum in even places) is 0 or a multiple of 11</li></ul><p>918082 → 2 − 8 + 0 − 8 + 1 − 9 = −22, a multiple of 11, so 918082 is divisible by 11.</p>",
      ask: { q: "Is 5,346 divisible by 6?", a: "Yes. It is even, and 5 + 3 + 4 + 6 = 18 is divisible by 3. (5346 ÷ 6 = 891.)" } },
    { h: "Prime factors and number of factors", body: "<p>Write the number as powers of primes. If N = a<sup>p</sup> × b<sup>q</sup> × c<sup>r</sup>, then</p><p class='f'>Number of factors = (p + 1)(q + 1)(r + 1)</p><p>360 = 2³ × 3² × 5¹ → (3 + 1)(2 + 1)(1 + 1) = <b>24 factors</b>.</p>",
      ask: { q: "How many factors does 72 have?", a: "72 = 2³ × 3², so (3 + 1)(2 + 1) = 12 factors." } },
    { h: "HCF and LCM", body: "<p>From prime factors: <b>HCF</b> takes the lowest power of common primes; <b>LCM</b> takes the highest power of every prime.</p><p>12 = 2² × 3, 18 = 2 × 3² → HCF = 2 × 3 = <b>6</b>, LCM = 2² × 3² = <b>36</b>.</p><p class='f'>For two numbers: HCF × LCM = product of the numbers</p>",
      ask: { q: "The HCF of two numbers is 8 and their LCM is 96. One number is 32. Find the other.", a: "8 × 96 ÷ 32 = 24." } },
    { h: "HCF and LCM word problems", body: "<ul><li><b>“Together again”, “smallest”, “least”</b> → LCM. Bells ringing every 6, 8 and 12 minutes ring together every LCM = 24 minutes.</li><li><b>“Greatest”, “largest”, “maximum size”</b> → HCF.</li><li>Least number leaving the <b>same remainder r</b> when divided by a, b, c = LCM(a, b, c) + r.</li><li>Greatest number dividing x, y, z leaving remainders p, q, r = HCF(x − p, y − q, z − r).</li></ul>",
      ask: { q: "Find the smallest number which leaves remainder 5 when divided by 12, 15 or 20.", a: "LCM(12, 15, 20) = 60, so the number is 60 + 5 = 65." } },
    { h: "Remainders", body: "<p>Work with remainders instead of big numbers:</p><p class='f'>Remainder of (a × b) ÷ n = remainder of (rem a × rem b) ÷ n</p><p>17 × 23 ÷ 5 → remainders 2 and 3 → 2 × 3 = 6 → remainder <b>1</b>.</p><p>For powers, look for a power that leaves remainder 1: 2³ = 8 leaves 1 when divided by 7.</p>",
      ask: { q: "Find the remainder when 2¹⁰ is divided by 7.", a: "2³ leaves 1, so 2⁹ = (2³)³ leaves 1 and 2¹⁰ leaves 1 × 2 = 2. (1024 = 7 × 146 + 2.)" } },
    { h: "Unit digit cycles", body: "<p>The last digit of powers repeats in a cycle of at most 4:</p><ul><li>2 → 2, 4, 8, 6 &nbsp; 3 → 3, 9, 7, 1 &nbsp; 7 → 7, 9, 3, 1 &nbsp; 8 → 8, 4, 2, 6</li><li>4 → 4, 6 &nbsp; 9 → 9, 1 &nbsp; 0, 1, 5, 6 → always the same</li></ul><p>Divide the power by 4 and use the remainder (remainder 0 means the 4th term). Unit digit of 7³⁵: 35 ÷ 4 leaves 3 → <b>3</b>.</p>",
      ask: { q: "What is the unit digit of 3⁴²?", a: "42 ÷ 4 leaves 2, and the 2nd term of 3, 9, 7, 1 is 9." } },
    { h: "Sums of series", body: "<p class='f'>1 + 2 + … + n = n(n + 1) ÷ 2</p><p class='f'>1² + 2² + … + n² = n(n + 1)(2n + 1) ÷ 6</p><p class='f'>1³ + 2³ + … + n³ = [n(n + 1) ÷ 2]²</p><p class='f'>Sum of the first n odd numbers = n²</p><p>1 + 2 + … + 50 = 50 × 51 ÷ 2 = <b>1,275</b>.</p>",
      ask: { q: "Find the sum of the first 20 odd numbers.", a: "20² = 400." } },
    { h: "Trailing zeros in n!", body: "<p>A zero at the end needs a 2 × 5, and 5s are rarer, so count the 5s:</p><p class='f'>Zeros in n! = [n/5] + [n/25] + [n/125] + …</p><p>100! → 20 + 4 = <b>24 zeros</b>. ([x] means the whole-number part.)</p>",
      ask: { q: "How many zeros are at the end of 60!?", a: "[60/5] + [60/25] = 12 + 2 = 14." } },
    { h: "Exam strategy", body: "<ul><li>Read the key word first: “least/together” → LCM, “greatest” → HCF.</li><li>For divisibility questions, test the options instead of solving.</li><li>Never multiply big numbers to find a remainder or unit digit; reduce first.</li><li>Learn the primes up to 100 and the four unit-digit cycles.</li></ul><p>Next: try the <b>Try it</b> tools, then the practice set.</p>" }
  ],
  tools: ["divis", "factors", "hcflcm", "unitd"],
  formulas: [
    ["Divisible by 3 / 9", "sum of digits divisible by 3 / 9"],
    ["Divisible by 4 / 8", "last two / last three digits divisible by 4 / 8"],
    ["Divisible by 11", "(odd-place digit sum) − (even-place digit sum) = 0 or a multiple of 11"],
    ["Number of factors of a^p × b^q × c^r", "(p + 1)(q + 1)(r + 1)"],
    ["Two numbers", "HCF × LCM = product of the numbers"],
    ["Least number leaving remainder r with a, b, c", "LCM(a, b, c) + r"],
    ["Greatest number leaving remainders p, q with x, y", "HCF(x − p, y − q)"],
    ["Remainder of a product", "multiply the remainders, then divide again"],
    ["Unit digit cycles", "2: 2486 · 3: 3971 · 7: 7931 · 8: 8426 · 4: 46 · 9: 91 · 0, 1, 5, 6 fixed"],
    ["1 + 2 + … + n", "n(n + 1) ÷ 2"],
    ["1² + … + n²", "n(n + 1)(2n + 1) ÷ 6"],
    ["1³ + … + n³", "[n(n + 1) ÷ 2]²"],
    ["First n odd numbers", "n²"],
    ["Trailing zeros in n!", "[n/5] + [n/25] + [n/125] + …"]
  ],
  /* a: index of the correct option is always 0 here; options are shuffled on screen */
  practice: [
    { q: "Which of these is a prime number?", o: ["97", "91", "87", "51"], why: "91 = 7 × 13, 87 = 3 × 29 and 51 = 3 × 17. 97 has no prime factor up to √97 ≈ 9.8.", hint: "Test 2, 3, 5 and 7 on each option." },
    { q: "How many factors does 180 have?", o: ["18", "12", "16", "20"], why: "180 = 2² × 3² × 5, so (2 + 1)(2 + 1)(1 + 1) = 18.", hint: "Write 180 as powers of primes first." },
    { q: "What is the HCF of 36 and 84?", o: ["12", "6", "18", "24"], why: "36 = 2² × 3², 84 = 2² × 3 × 7. Common lowest powers: 2² × 3 = 12.", hint: "Take the lowest power of each common prime." },
    { q: "The product of two numbers is 1,350 and their HCF is 15. What is their LCM?", o: ["90", "75", "105", "135"], why: "LCM = product ÷ HCF = 1,350 ÷ 15 = 90.", hint: "HCF × LCM = product." },
    { q: "What is the unit digit of 2⁴³?", o: ["8", "2", "4", "6"], why: "The cycle of 2 is 2, 4, 8, 6. 43 ÷ 4 leaves 3, so the 3rd term: 8.", hint: "Divide the power by 4." },
    { q: "What is the remainder when 2²⁰ is divided by 7?", o: ["4", "1", "2", "6"], why: "2³ leaves 1, so 2¹⁸ leaves 1 and 2²⁰ = 2¹⁸ × 4 leaves 4.", hint: "Find a power of 2 that leaves remainder 1." },
    { q: "Which of these numbers is divisible by 11?", o: ["9,295", "9,259", "9,925", "9,529"], why: "9295: 5 − 9 + 2 − 9 = −11, a multiple of 11 (9295 = 11 × 845). For the others the difference is not 0 or a multiple of 11.", hint: "Alternate + and − from the right." },
    { q: "What is the least number which leaves remainder 4 when divided by 6, 9 or 15?", o: ["94", "90", "184", "49"], why: "LCM(6, 9, 15) = 90, so the number is 90 + 4 = 94.", hint: "LCM + remainder." },
    { q: "What is the sum of the first 25 odd numbers?", o: ["625", "650", "600", "576"], why: "Sum of the first n odd numbers = n² = 25² = 625.", hint: "There is a one-step formula." },
    { q: "How many zeros are at the end of 125!?", o: ["31", "25", "30", "28"], why: "[125/5] + [125/25] + [125/125] = 25 + 5 + 1 = 31.", hint: "Count the 5s, including 25 and 125." }
  ],
  test: {
    minutes: 8, right: 2, wrong: 0.5,
    items: [
      { q: "What is the largest 4-digit number exactly divisible by 88?", o: ["9944", "9988", "9900", "9856"], why: "9999 ÷ 88 leaves remainder 55, so 9999 − 55 = 9944 (= 88 × 113)." },
      { q: "The 4-digit number 52k6 is divisible by 9. What is the digit k?", o: ["5", "4", "3", "6"], why: "5 + 2 + 6 + k = 13 + k must be a multiple of 9, so k = 5 (5256 = 9 × 584)." },
      { q: "The LCM of two numbers is 4 times their HCF, and HCF + LCM = 125. If one number is 100, what is the other?", o: ["25", "50", "75", "20"], why: "HCF + 4 × HCF = 125, so HCF = 25 and LCM = 100. Other number = 25 × 100 ÷ 100 = 25." },
      { q: "Three bells ring at intervals of 12, 15 and 18 minutes. They ring together at 9:00 a.m. When will they next ring together?", o: ["12:00 noon", "11:00 a.m.", "10:30 a.m.", "1:00 p.m."], why: "LCM(12, 15, 18) = 180 minutes = 3 hours after 9:00 a.m." },
      { q: "What is the unit digit of 7⁹⁵ × 3⁵⁸?", o: ["7", "1", "3", "9"], why: "95 ÷ 4 leaves 3 → 7⁹⁵ ends in 3. 58 ÷ 4 leaves 2 → 3⁵⁸ ends in 9. 3 × 9 = 27 → 7." },
      { q: "What is the remainder when 3¹⁰⁰ is divided by 8?", o: ["1", "3", "5", "7"], why: "3² = 9 leaves 1, so 3¹⁰⁰ = (3²)⁵⁰ leaves 1." },
      { q: "How many numbers from 1 to 100 are divisible by 3 or 5?", o: ["47", "53", "43", "50"], why: "33 multiples of 3 + 20 multiples of 5 − 6 multiples of 15 = 47." },
      { q: "What is 1² + 2² + 3² + … + 10²?", o: ["385", "355", "400", "505"], why: "10 × 11 × 21 ÷ 6 = 385." },
      { q: "A number leaves remainder 39 when divided by 357. What remainder does it leave when divided by 17?", o: ["5", "39", "22", "12"], why: "357 = 17 × 21, so the remainder is 39 ÷ 17 → 5." },
      { q: "What is the greatest number that divides 187 and 233 leaving remainders 7 and 8 respectively?", o: ["45", "15", "9", "90"], why: "HCF(187 − 7, 233 − 8) = HCF(180, 225) = 45." }
    ]
  }
};
