/* SSC CGL · Quant · Time, speed & distance. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["tsd"] = {
  id: "tsd", subject: "quant", num: 11, title: "Time, speed & distance",
  minutes: 50,
  why: "Speed, trains, boats and races give 2–3 Tier 1 questions and more in Tier 2. Unit conversion and relative speed solve most of them.",
  video: "videos/SSC_Q11_TSD.mp4",
  slides: [
    { h: "Why speed questions matter", body: "<p>One formula drives the whole topic:</p><p class='f'>Distance = Speed × Time</p><ul><li>unit conversion (km/h and m/s)</li><li>late and early arrival</li><li>relative speed: meeting and chasing</li><li>trains crossing poles, platforms and other trains</li><li>boats and streams, and races</li></ul>" },
    { h: "Units: km/h and m/s", body: "<p class='f'>km/h → m/s: × 5/18 &nbsp;&nbsp; m/s → km/h: × 18/5</p><p>72 km/h = 72 × 5/18 = <b>20 m/s</b>. &nbsp; 54 km/h = 15 m/s.</p><p class='warn'>Train questions give lengths in metres and speeds in km/h. Convert before dividing.</p>",
      ask: { q: "Convert 15 m/s to km/h.", a: "15 × 18/5 = 54 km/h." } },
    { h: "Same distance: speed and time are inverse", body: "<p>If the speed ratio is 3 : 4, the time ratio is 4 : 3.</p><p>A man walking at 4 km/h is 10 minutes late; at 5 km/h he is 5 minutes early. The difference is 15 minutes = 1/4 hour.</p><p>d/4 − d/5 = 1/4 → d/20 = 1/4 → <b>d = 5 km</b>.</p>",
      ask: { q: "Walking at 5/6 of his usual speed, a man is 10 minutes late. His usual time?", a: "New time = 6/5 of usual, so the extra 1/5 = 10 min → usual = 50 min." } },
    { h: "Relative speed", body: "<ul><li><b>Towards each other</b> (opposite directions): add the speeds.</li><li><b>Same direction</b> (chasing): subtract.</li></ul><p>Two cars 300 km apart drive towards each other at 40 and 60 km/h → 300 ÷ 100 = <b>3 hours</b>.</p><p>A thief is 2 km ahead at 10 km/h; police follow at 12 km/h → 2 ÷ 2 = <b>1 hour</b>.</p>" },
    { h: "Trains", body: "<p>A train must cover its <b>own length</b> plus the length of whatever it crosses.</p><ul><li>Pole or person: distance = train length</li><li>Platform or bridge: train + platform</li></ul><p>A 150 m train at 54 km/h (15 m/s): pole in 150 ÷ 15 = <b>10 s</b>; a 250 m platform in 400 ÷ 15 = <b>26⅔ s</b>.</p>",
      ask: { q: "A train passes a pole in 15 s and a 100 m platform in 25 s. How long is it?", a: "L/15 = (L + 100)/25 → L = 150 m." } },
    { h: "Two trains", body: "<p class='f'>Time = (L₁ + L₂) ÷ relative speed</p><p>120 m and 180 m trains at 50 and 40 km/h:</p><ul><li>opposite directions: 90 km/h = 25 m/s → 300 ÷ 25 = <b>12 s</b></li><li>same direction: 10 km/h = 25/9 m/s → 300 ÷ 25/9 = <b>108 s</b></li></ul>" },
    { h: "Boats and streams", body: "<p class='f'>Downstream = b + s &nbsp;&nbsp; Upstream = b − s</p><p class='f'>b = (down + up) ÷ 2 &nbsp;&nbsp; s = (down − up) ÷ 2</p><p>Downstream 15 km/h, upstream 9 km/h → boat <b>12</b>, stream <b>3</b> km/h.</p>",
      ask: { q: "A boat goes 24 km downstream in 2 h and comes back in 3 h. Speed of the stream?", a: "Down 12, up 8 → s = (12 − 8) ÷ 2 = 2 km/h." } },
    { h: "Average speed and meeting times", body: "<ul><li>Equal distances at x and y: average speed = 2xy ÷ (x + y). 120 km at 40 and 120 km at 60 → <b>48 km/h</b>.</li><li>Trains starting at different times: first find the gap when the second starts, then use relative speed.</li></ul><p>A and B are 110 km apart; a train leaves A at 7 a.m. at 20 km/h, another leaves B at 8 a.m. at 25 km/h. By 8 a.m. the gap is 90 km → 90 ÷ 45 = 2 h → they meet at <b>10 a.m.</b></p>" },
    { h: "Races", body: "<p>“A beats B by 20 m in a 100 m race” means: when A runs 100 m, B runs 80 m. Speed ratio A : B = 5 : 4.</p><p>In a 1 km race A beats B by 100 m and B beats C by 100 m. When A runs 1,000, B runs 900 and C runs 900 × 0.9 = 810 → A beats C by <b>190 m</b>.</p>" },
    { h: "Exam strategy", body: "<ul><li>Convert units first: km/h × 5/18 for m/s.</li><li>Opposite directions add speeds; same direction subtracts.</li><li>Trains: add the lengths of everything crossed.</li><li>Boats: average of downstream and upstream is the boat's speed.</li></ul><p>Next: try the <b>Try it</b> tools, then the practice set.</p>" }
  ],
  tools: ["sdt", "relmeet", "trainx", "boats"],
  formulas: [
    ["Distance", "Speed × Time"],
    ["km/h → m/s", "× 5/18 (m/s → km/h: × 18/5)"],
    ["Same distance", "speed ratio a : b → time ratio b : a"],
    ["Towards each other", "relative speed = s₁ + s₂"],
    ["Same direction", "relative speed = s₁ − s₂"],
    ["Train crossing a pole", "time = train length ÷ speed"],
    ["Train crossing a platform", "(train + platform) ÷ speed"],
    ["Two trains", "(L₁ + L₂) ÷ relative speed"],
    ["Downstream / upstream", "b + s / b − s"],
    ["Boat / stream speed", "(d + u) ÷ 2 / (d − u) ÷ 2"],
    ["Average speed, equal distances", "2xy ÷ (x + y)"],
    ["Late / early", "d = s₁s₂ × (time difference) ÷ (s₂ − s₁)"]
  ],
  /* a: index of the correct option is always 0 here; options are shuffled on screen */
  practice: [
    { q: "72 km/h is equal to…", o: ["20 m/s", "25 m/s", "18 m/s", "72 m/s"], why: "72 × 5/18 = 20 m/s.", hint: "Multiply by 5/18." },
    { q: "A car covers 210 km in 3½ hours. Its speed is…", o: ["60 km/h", "70 km/h", "55 km/h", "65 km/h"], why: "210 ÷ 3.5 = 60.", hint: "Speed = distance ÷ time." },
    { q: "Two cars 300 km apart drive towards each other at 40 and 60 km/h. They meet after…", o: ["3 hours", "5 hours", "7.5 hours", "2 hours"], why: "300 ÷ (40 + 60) = 3.", hint: "Towards each other: add speeds." },
    { q: "A thief 2 km ahead runs at 10 km/h. A policeman follows at 12 km/h. He catches the thief in…", o: ["1 hour", "2 hours", "30 minutes", "12 minutes"], why: "2 ÷ (12 − 10) = 1 hour.", hint: "Same direction: subtract." },
    { q: "A 150 m train at 54 km/h crosses a pole in…", o: ["10 s", "15 s", "8 s", "12 s"], why: "54 km/h = 15 m/s; 150 ÷ 15 = 10 s.", hint: "Convert to m/s first." },
    { q: "The same train crosses a 250 m platform in…", o: ["26 2/3 s", "16 2/3 s", "25 s", "30 s"], why: "(150 + 250) ÷ 15 = 26⅔ s.", hint: "Add the platform length." },
    { q: "A boat goes downstream at 15 km/h and upstream at 9 km/h. Its speed in still water is…", o: ["12 km/h", "3 km/h", "6 km/h", "24 km/h"], why: "(15 + 9) ÷ 2 = 12.", hint: "Average the two speeds." },
    { q: "Walking at 4 km/h a man is 10 min late; at 5 km/h he is 5 min early. The distance is…", o: ["5 km", "4 km", "6 km", "10 km"], why: "d/4 − d/5 = 15/60 → d = 5.", hint: "The time difference is 15 minutes." },
    { q: "Trains of 120 m and 180 m run in opposite directions at 50 and 40 km/h. They cross each other in…", o: ["12 s", "108 s", "10 s", "15 s"], why: "90 km/h = 25 m/s; 300 ÷ 25 = 12 s.", hint: "Add lengths, add speeds." },
    { q: "A beats B by 20 m in a 100 m race. The ratio of their speeds A : B is…", o: ["5 : 4", "4 : 5", "6 : 5", "5 : 6"], why: "A runs 100 while B runs 80: 100 : 80 = 5 : 4.", hint: "Same time, different distances." }
  ],
  test: {
    minutes: 9, right: 2, wrong: 0.5,
    items: [
      { q: "A man goes at 30 km/h and returns at 20 km/h, taking 5 hours in all. The one-way distance is…", o: ["60 km", "50 km", "75 km", "48 km"], why: "d/30 + d/20 = 5 → d × 5/60 = 5 → d = 60." },
      { q: "A train passes a pole in 15 s and a 100 m platform in 25 s. Its length is…", o: ["150 m", "100 m", "200 m", "125 m"], why: "L/15 = (L + 100)/25 → 10L = 1,500 → L = 150 m." },
      { q: "Trains of 140 m and 160 m run in the same direction at 60 and 42 km/h. The faster one passes the other in…", o: ["60 s", "10 s", "30 s", "20 s"], why: "18 km/h = 5 m/s; 300 ÷ 5 = 60 s." },
      { q: "A boat goes 24 km downstream in 2 h and returns in 3 h. The speed of the stream is…", o: ["2 km/h", "4 km/h", "10 km/h", "5 km/h"], why: "Down 12, up 8 → (12 − 8) ÷ 2 = 2." },
      { q: "In a 1 km race A beats B by 100 m, and B beats C by 100 m. A beats C by…", o: ["190 m", "200 m", "180 m", "210 m"], why: "When A runs 1,000, B runs 900 and C runs 810." },
      { q: "Walking at 5/6 of his usual speed, a man is 10 minutes late. His usual time is…", o: ["50 minutes", "60 minutes", "40 minutes", "45 minutes"], why: "New time = 6/5 usual; extra 1/5 = 10 min → 50 min." },
      { q: "Stations A and B are 110 km apart. A train leaves A at 7 a.m. at 20 km/h towards B; another leaves B at 8 a.m. at 25 km/h towards A. They meet at…", o: ["10 a.m.", "9 a.m.", "10:30 a.m.", "11 a.m."], why: "By 8 a.m. the gap is 90 km; 90 ÷ 45 = 2 h → 10 a.m." },
      { q: "A 240 m train passes a man walking at 6 km/h in the same direction in 18 s. The train's speed is…", o: ["54 km/h", "48 km/h", "42 km/h", "60 km/h"], why: "Relative speed 240/18 m/s = 48 km/h; train = 48 + 6 = 54 km/h." },
      { q: "A boat's speed in still water is 10 km/h and the stream's is 2 km/h. It goes 48 km downstream and back. Total time?", o: ["10 hours", "9.6 hours", "8 hours", "12 hours"], why: "48 ÷ 12 + 48 ÷ 8 = 4 + 6 = 10 h." },
      { q: "A car goes 120 km at 40 km/h and the next 120 km at 60 km/h. Its average speed is…", o: ["48 km/h", "50 km/h", "45 km/h", "52 km/h"], why: "240 ÷ (3 + 2) = 48 km/h." }
    ]
  }
};
