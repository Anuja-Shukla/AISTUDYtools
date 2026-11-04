/* SSC CGL · Quant · Mixtures & alligation. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["mixtures"] = {
  id: "mixtures", subject: "quant", num: 9, title: "Mixtures & alligation",
  minutes: 40,
  why: "Mixtures give about one Tier 1 question, and alligation is a shortcut you can reuse for averages, profit, interest and speed questions too.",
  video: "videos/SSC_Q09_Mixtures.mp4",
  slides: [
    { h: "Why alligation matters", body: "<p>When two things with different values are mixed, the mixture's value lies <b>between</b> them. Alligation tells you the mixing ratio in one step.</p><ul><li>two kinds of rice, tea or sugar at different prices</li><li>solutions with different strengths (%)</li><li>adding water to milk</li><li>repeated removal and replacement</li></ul><p>It is just a weighted average, solved backwards.</p>" },
    { h: "The alligation rule", body: "<p class='f'>Cheaper : Dearer = (Dearer − Mean) : (Mean − Cheaper)</p><p>Rice at ₹40/kg and ₹60/kg mixed to cost ₹46/kg:</p><p>(60 − 46) : (46 − 40) = 14 : 6 = <b>7 : 3</b>.</p><p>Each quantity gets the difference on the <b>other</b> side: the cross.</p>", viz: { type: "allig", c: 40, d: 60, m: 46 },
      ask: { q: "Tea at ₹30/kg and ₹45/kg is mixed to get ₹40/kg. Find the ratio.", a: "(45 − 40) : (40 − 30) = 5 : 10 = 1 : 2." } },
    { h: "Mixing strengths (%)", body: "<p>The same rule works for concentrations.</p><p>20% acid and 50% acid mixed to get 30%: (50 − 30) : (30 − 20) = 20 : 10 = <b>2 : 1</b>.</p><p>Boys average 60 and girls 75; class average 66 → boys : girls = 9 : 6 = 3 : 2. It is the same idea.</p>",
      ask: { q: "Solutions of 40% and 60% alcohol are mixed in the ratio 3 : 2. Find the strength.", a: "(3 × 40 + 2 × 60) ÷ 5 = 48%." } },
    { h: "Water costs nothing", body: "<p>Treat water as an ingredient that costs ₹0.</p><p>Milk at ₹50/L; to bring the cost down to ₹40/L:</p><p>Water : Milk = (50 − 40) : (40 − 0) = 10 : 40 = <b>1 : 4</b>.</p>",
      ask: { q: "In what ratio must water be mixed with milk costing ₹60/L to get a mixture worth ₹48/L?", a: "(60 − 48) : (48 − 0) = 12 : 48 = 1 : 4." } },
    { h: "Selling the mixture at cost price", body: "<p>A milkman sells a milk-and-water mixture at the cost price of pure milk and gains 25%.</p><p>The gain comes only from the free water, so water = 25% of the milk.</p><p class='f'>Water : Milk = 25 : 100 = 1 : 4</p>",
      ask: { q: "He gains 20% instead. Find water : milk.", a: "20 : 100 = 1 : 5." } },
    { h: "Adding to change a ratio", body: "<p>60 L of milk and water in the ratio 2 : 1 → milk 40 L, water 20 L.</p><p>To make it 1 : 2, water must be 80 L, so add <b>60 L</b> of water.</p><p class='warn'>Keep the ingredient that does not change fixed, and rebuild the other.</p>",
      ask: { q: "30 kg of a mix is 10% sugar. How much sugar must be added to make it 25% sugar?", a: "The other 27 kg stays and must be 75%: total = 36 kg, so add 6 kg of sugar." } },
    { h: "Removal and replacement", body: "<p>A vessel has x litres of milk. y litres are taken out and replaced with water, n times.</p><p class='f'>Milk left = x × (1 − y/x)ⁿ</p><p>40 L, 4 L replaced twice: 40 × 0.9 × 0.9 = <b>32.4 L</b> of milk.</p><p>It works like a fixed % loss each time.</p>",
      ask: { q: "80 L of wine; 8 L is replaced with water three times. Wine left?", a: "80 × 0.9³ = 58.32 L." } },
    { h: "Mixing two mixtures", body: "<p>Vessel A has milk : water 3 : 1; vessel B has 5 : 3. Equal amounts are mixed.</p><p>Milk fractions: 3/4 and 5/8 → average = (6/8 + 5/8) ÷ 2 = 11/16.</p><p class='f'>Milk : Water = 11 : 5</p><p>For unequal amounts, weight each fraction by its quantity.</p>" },
    { h: "Exam strategy", body: "<ul><li>Find the cheaper, dearer and mean values, then draw the cross.</li><li>Water = ₹0, pure ingredient = 100%.</li><li>Removal and replacement: use (1 − y/x)ⁿ.</li><li>Alligation also works for averages, interest at two rates and two speeds over time.</li></ul><p>Next: try the <b>Try it</b> tools, then the practice set.</p>" }
  ],
  tools: ["alligx", "mixpct", "replace", "mixratio"],
  formulas: [
    ["Alligation", "Cheaper : Dearer = (Dearer − Mean) : (Mean − Cheaper)"],
    ["Mean of a mix", "(q₁v₁ + q₂v₂) ÷ (q₁ + q₂)"],
    ["Water added to milk", "Water : Milk = (milk price − mix price) : mix price"],
    ["Sold at CP of milk with g% gain", "Water : Milk = g : 100"],
    ["Removal and replacement", "left = x × (1 − y/x)ⁿ"],
    ["Mix of two mixtures (equal amounts)", "average the fractions of each ingredient"],
    ["Add one ingredient to reach a %", "keep the other ingredient fixed, rebuild the total"]
  ],
  /* a: index of the correct option is always 0 here; options are shuffled on screen */
  practice: [
    { q: "Rice at ₹40/kg and ₹60/kg is mixed to cost ₹46/kg. In what ratio?", o: ["7 : 3", "3 : 7", "2 : 3", "3 : 2"], why: "(60 − 46) : (46 − 40) = 14 : 6 = 7 : 3.", hint: "Draw the cross." },
    { q: "Tea at ₹30/kg and ₹45/kg is mixed to get tea worth ₹40/kg. The ratio is…", o: ["1 : 2", "2 : 1", "1 : 3", "3 : 1"], why: "(45 − 40) : (40 − 30) = 5 : 10.", hint: "Cheaper gets dearer − mean." },
    { q: "20% and 50% acid solutions are mixed to get 30% acid. The ratio is…", o: ["2 : 1", "1 : 2", "3 : 2", "2 : 3"], why: "(50 − 30) : (30 − 20) = 20 : 10.", hint: "Same rule with %." },
    { q: "Milk costs ₹50/L. Water : milk to make the mixture cost ₹40/L is…", o: ["1 : 4", "4 : 1", "1 : 5", "1 : 3"], why: "(50 − 40) : (40 − 0) = 10 : 40.", hint: "Water costs ₹0." },
    { q: "A milkman sells a mixture at the cost price of milk and gains 20%. Water : milk is…", o: ["1 : 5", "1 : 4", "1 : 6", "5 : 1"], why: "The gain is the free water: 20 : 100.", hint: "Gain % = water as % of milk." },
    { q: "From 40 L of milk, 4 L is replaced with water, twice. Milk left is…", o: ["32.4 L", "32 L", "36 L", "33.6 L"], why: "40 × 0.9² = 32.4 L.", hint: "Multiply by (1 − 4/40) each time." },
    { q: "60 L of a mixture has milk : water = 2 : 1. How much water must be added to make it 1 : 2?", o: ["60 L", "40 L", "20 L", "80 L"], why: "Milk 40 stays; water must be 80, so add 60.", hint: "Keep milk fixed." },
    { q: "Equal quantities of mixtures with milk : water 3 : 1 and 5 : 3 are mixed. The new ratio is…", o: ["11 : 5", "8 : 4", "15 : 1", "2 : 1"], why: "Milk fractions 3/4 and 5/8 average to 11/16.", hint: "Average the milk fractions." },
    { q: "Boys average 60 marks, girls 75 and the class 66. Boys : girls is…", o: ["3 : 2", "2 : 3", "5 : 4", "4 : 5"], why: "(75 − 66) : (66 − 60) = 9 : 6.", hint: "Alligation works for averages." },
    { q: "How much sugar at ₹42/kg must be mixed with 30 kg at ₹48/kg to get ₹45/kg?", o: ["30 kg", "25 kg", "20 kg", "36 kg"], why: "(48 − 45) : (45 − 42) = 1 : 1, so 30 kg.", hint: "Find the ratio first." }
  ],
  test: {
    minutes: 8, right: 2, wrong: 0.5,
    items: [
      { q: "In what ratio must water be mixed with milk costing ₹60/L to get a mixture worth ₹48/L?", o: ["1 : 4", "4 : 1", "1 : 5", "1 : 3"], why: "(60 − 48) : (48 − 0) = 12 : 48 = 1 : 4." },
      { q: "30 kg of a mix contains 10% sugar. How much sugar must be added to make it 25% sugar?", o: ["6 kg", "4.5 kg", "7.5 kg", "5 kg"], why: "27 kg of the rest must be 75% of the total: 36 kg. Add 6 kg." },
      { q: "A vessel has 80 L of wine. 8 L is replaced with water three times. Wine left is…", o: ["58.32 L", "56 L", "57.6 L", "59.04 L"], why: "80 × 0.9³ = 58.32 L." },
      { q: "Vessels A and B have milk : water 5 : 2 and 3 : 4. Equal quantities are mixed. The new ratio is…", o: ["4 : 3", "5 : 2", "3 : 4", "1 : 1"], why: "Milk fractions 5/7 and 3/7 average to 4/7, so 4 : 3." },
      { q: "A merchant sells part of 50 kg of sugar at 8% profit and the rest at 18%, making 14% overall. How much did he sell at 18%?", o: ["30 kg", "20 kg", "25 kg", "35 kg"], why: "8% : 18% = (18 − 14) : (14 − 8) = 2 : 3 → 18% part = 30 kg." },
      { q: "₹4,000 is lent partly at 5% and partly at 10% simple interest. Yearly interest is ₹300. The amount at 5% is…", o: ["₹2,000", "₹1,500", "₹2,500", "₹3,000"], why: "Average rate 7.5% → (10 − 7.5) : (7.5 − 5) = 1 : 1." },
      { q: "60 L of milk and water is in the ratio 7 : 5. How much of the mixture must be replaced with water to make it 1 : 1?", o: ["8 4/7 L", "10 L", "6 L", "12 L"], why: "Milk 35 must fall to 30: 35(1 − x/60) = 30 → x = 60/7 = 8 4/7 L." },
      { q: "A man covers 64 km in 7 hours, partly walking at 4 km/h and partly cycling at 16 km/h. How far did he walk?", o: ["16 km", "48 km", "12 km", "20 km"], why: "Average speed 64/7. Walking : cycling time = (16 − 64/7) : (64/7 − 4) = 4 : 3 → walks 4 h = 16 km." },
      { q: "729 mL of milk and water is in the ratio 7 : 2. How much water must be added to make it 7 : 3?", o: ["81 mL", "60 mL", "72 mL", "90 mL"], why: "Milk 567, water 162. For 7 : 3 water must be 243: add 81 mL." },
      { q: "40% and 60% alcohol solutions are mixed in the ratio 3 : 2. The mixture's strength is…", o: ["48%", "50%", "52%", "46%"], why: "(3 × 40 + 2 × 60) ÷ 5 = 48%." }
    ]
  }
};
