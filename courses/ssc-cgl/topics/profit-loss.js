/* SSC CGL · Quant · Profit, loss & discount. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["profit-loss"] = {
  id: "profit-loss", subject: "quant", num: 7, title: "Profit, loss & discount",
  minutes: 45,
  why: "Profit, loss and discount give 2–3 Tier 1 questions, one of the highest-scoring arithmetic topics. Almost every question is percentages in disguise.",
  video: "videos/SSC_Q07_Profit_Loss.mp4",
  slides: [
    { h: "Why profit and loss matter", body: "<p>This topic uses three prices:</p><ul><li><b>CP</b>, cost price: what the seller paid</li><li><b>MP</b>, marked (list) price: the price on the tag</li><li><b>SP</b>, selling price: what the buyer actually pays</li></ul><p>Profit and loss are % of the <b>CP</b>. Discount is % of the <b>MP</b>. Keep these two bases straight and most questions become easy.</p>" },
    { h: "Profit and loss %", body: "<p class='f'>Profit = SP − CP &nbsp;&nbsp; Profit % = Profit ÷ CP × 100</p><p>CP ₹400, SP ₹500 → profit ₹100 → 100 ÷ 400 = <b>25%</b>.</p><p class='warn'>Always divide by the CP, not the SP.</p>",
      ask: { q: "An article bought for ₹250 is sold for ₹220. Find the loss %.", a: "Loss = 30, so 30 ÷ 250 × 100 = 12%." } },
    { h: "SP from CP and back", body: "<p>Use multiplying factors:</p><p class='f'>SP = CP × (100 + P%) ÷ 100 &nbsp;&nbsp; CP = SP × 100 ÷ (100 + P%)</p><ul><li>20% profit → × 1.2 &nbsp; 15% loss → × 0.85</li></ul><p>Sold for ₹690 at 15% profit → CP = 690 ÷ 1.15 = <b>₹600</b>.</p>",
      ask: { q: "By selling for ₹1,140 a man loses 5%. At what price should he sell to gain 5%?", a: "CP = 1,140 ÷ 0.95 = 1,200. SP = 1,200 × 1.05 = ₹1,260." } },
    { h: "Marked price and discount", body: "<p class='f'>Discount = MP − SP &nbsp;&nbsp; SP = MP × (100 − D%) ÷ 100</p><p>MP ₹1,200 with 15% off → SP = 1,200 × 0.85 = <b>₹1,020</b>.</p><p>Discount is always on the <b>marked</b> price.</p>",
      ask: { q: "A discount of 15% saves ₹102. Find the marked price and the selling price.", a: "MP = 102 ÷ 0.15 = ₹680. SP = 680 − 102 = ₹578." } },
    { h: "Mark up, then discount", body: "<p>A trader marks goods 40% above CP and gives 25% off. CP 100 → MP 140 → SP 140 × 0.75 = 105 → <b>5% profit</b>.</p><p class='f'>MP ÷ CP = (100 + P%) ÷ (100 − D%)</p><p>To make 20% profit after a 20% discount: 120 ÷ 80 = 1.5 → mark up by <b>50%</b>.</p>", viz: { type: "chainprice", cp: 100, up: 40, d: 25 },
      ask: { q: "Goods are marked 30% above CP and sold at 10% discount. Profit %?", a: "1.3 × 0.9 = 1.17 → 17% profit." } },
    { h: "Successive discounts", body: "<p>Two discounts are applied one after the other, not added.</p><p class='f'>Single equivalent = d₁ + d₂ − d₁d₂ ÷ 100</p><p>20% and 10%: 20 + 10 − 2 = <b>28%</b> (not 30%). MP ₹5,000 → 5,000 × 0.8 × 0.9 = ₹3,600.</p>",
      ask: { q: "Find a single discount equal to 10% and 5%.", a: "10 + 5 − 0.5 = 14.5%." } },
    { h: "Same SP, gain on one and loss on the other", body: "<p>Two items are sold at the <b>same price</b>, one at x% gain and one at x% loss. The result is always a loss:</p><p class='f'>Loss % = x² ÷ 100</p><p>Each sold for ₹990 at 10% gain and 10% loss → loss = <b>1%</b>.</p>",
      ask: { q: "Two articles sold for ₹4,800 each: 20% gain on one, 20% loss on the other. Find the overall result.", a: "CPs 4,000 and 6,000. Total CP 10,000, SP 9,600 → loss ₹400 (4%)." } },
    { h: "Dishonest dealer", body: "<p>A shopkeeper uses a 900 g weight for 1 kg and charges the cost price of 1 kg.</p><p class='f'>Profit % = (true − false) ÷ false × 100</p><p>(1,000 − 900) ÷ 900 = <b>11 1/9%</b>.</p><p>If he also adds a markup: profit factor = (1 + markup) × true ÷ false. 800 g and 10% above CP → 1.1 × 1,000 ÷ 800 = 1.375 → <b>37.5%</b>.</p>",
      ask: { q: "A dealer uses 800 g for 1 kg at cost price. Profit %?", a: "200 ÷ 800 = 25%." } },
    { h: "Offers and articles", body: "<ul><li><b>Buy x, get y free</b>: discount = y ÷ (x + y). Buy 3 get 1 → 1 ÷ 4 = <b>25%</b>.</li><li><b>CP of a articles = SP of b articles</b>: profit % = (a − b) ÷ b × 100. CP of 12 = SP of 10 → 2 ÷ 10 = <b>20%</b>.</li><li><b>Gain = SP of some articles</b>: on selling 33 m a man gains the SP of 11 m → CP of 33 = SP of 22 → 11 ÷ 22 = 50%.</li></ul>",
      ask: { q: "Buy 4, get 1 free. What is the effective discount?", a: "1 ÷ 5 = 20%." } },
    { h: "Exam strategy", body: "<ul><li>Take CP = 100 when no prices are given.</li><li>Profit and loss on CP; discount on MP.</li><li>Use multiplying factors in a chain: CP × 1.4 × 0.75.</li><li>Successive discounts: never add them.</li></ul><p>Next: try the <b>Try it</b> tools, then the practice set.</p>" }
  ],
  tools: ["plcalc", "mpchain", "discs", "dealer"],
  formulas: [
    ["Profit / loss", "SP − CP / CP − SP"],
    ["Profit % / loss %", "on CP: Profit ÷ CP × 100"],
    ["SP from CP", "CP × (100 ± P%) ÷ 100"],
    ["CP from SP", "SP × 100 ÷ (100 ± P%)"],
    ["Discount", "MP − SP, as % of MP"],
    ["SP from MP", "MP × (100 − D%) ÷ 100"],
    ["Mark-up needed", "MP ÷ CP = (100 + P%) ÷ (100 − D%)"],
    ["Successive discounts d₁, d₂", "d₁ + d₂ − d₁d₂ ÷ 100"],
    ["Same SP, x% gain and x% loss", "loss of x² ÷ 100 %"],
    ["False weight", "(true − false) ÷ false × 100"],
    ["Buy x get y free", "discount = y ÷ (x + y)"],
    ["CP of a = SP of b", "profit % = (a − b) ÷ b × 100"]
  ],
  /* a: index of the correct option is always 0 here; options are shuffled on screen */
  practice: [
    { q: "An article bought for ₹400 is sold for ₹500. The profit % is…", o: ["25%", "20%", "100%", "30%"], why: "Profit 100 on CP 400 = 25%.", hint: "Divide by the CP." },
    { q: "An article bought for ₹250 is sold for ₹220. The result is…", o: ["12% loss", "13.6% loss", "12% profit", "30% loss"], why: "Loss 30 on CP 250 = 12%.", hint: "Loss % is on the CP." },
    { q: "An article sold for ₹690 gives a 15% profit. Its cost price is…", o: ["₹600", "₹586.50", "₹675", "₹620"], why: "CP = 690 ÷ 1.15 = ₹600.", hint: "Divide by 1.15, don't take 15% off." },
    { q: "An article marked at ₹1,200 is sold at 15% discount. The selling price is…", o: ["₹1,020", "₹1,180", "₹1,035", "₹1,000"], why: "1,200 × 0.85 = ₹1,020.", hint: "Discount is on the MP." },
    { q: "Goods are marked 30% above cost and sold at 10% discount. The profit % is…", o: ["17%", "20%", "13%", "27%"], why: "1.3 × 0.9 = 1.17 → 17%.", hint: "Chain the factors." },
    { q: "Successive discounts of 20% and 10% equal a single discount of…", o: ["28%", "30%", "25%", "32%"], why: "20 + 10 − 200 ÷ 100 = 28%.", hint: "Don't add them." },
    { q: "Two items are each sold for ₹990, one at 10% gain and one at 10% loss. Overall…", o: ["1% loss", "No profit or loss", "1% gain", "2% loss"], why: "Same SP, x% gain and loss → loss of x²/100 = 1%.", hint: "There is always a loss." },
    { q: "A dealer sells at cost price but uses a 900 g weight for 1 kg. His profit % is…", o: ["11 1/9%", "10%", "9 1/11%", "11%"], why: "100 ÷ 900 × 100 = 11 1/9%.", hint: "Divide by the false weight." },
    { q: "“Buy 3, get 1 free” is a discount of…", o: ["25%", "33⅓%", "20%", "30%"], why: "1 free out of 4 = 25%.", hint: "Free items ÷ total items." },
    { q: "The CP of 12 articles equals the SP of 10. The profit % is…", o: ["20%", "16⅔%", "2%", "25%"], why: "(12 − 10) ÷ 10 = 20%.", hint: "Divide by the smaller number." }
  ],
  test: {
    minutes: 8, right: 2, wrong: 0.5,
    items: [
      { q: "By selling an article for ₹1,140 a man loses 5%. To gain 5%, he should sell it for…", o: ["₹1,260", "₹1,200", "₹1,254", "₹1,197"], why: "CP = 1,140 ÷ 0.95 = 1,200. SP = 1,200 × 1.05 = ₹1,260." },
      { q: "A trader marks his goods 40% above cost and allows a 25% discount. His profit % is…", o: ["5%", "15%", "10%", "−5%"], why: "1.4 × 0.75 = 1.05 → 5% profit." },
      { q: "An article marked at ₹5,000 is sold after successive discounts of 10% and 20%. The selling price is…", o: ["₹3,600", "₹3,500", "₹3,750", "₹3,400"], why: "5,000 × 0.9 × 0.8 = ₹3,600." },
      { q: "How much above cost should goods be marked so that a 20% discount still leaves a 20% profit?", o: ["50%", "40%", "44%", "60%"], why: "MP ÷ CP = 120 ÷ 80 = 1.5 → 50% above cost." },
      { q: "A shopkeeper uses an 800 g weight for 1 kg and sells at 10% above cost. His profit % is…", o: ["37.5%", "30%", "35%", "32.5%"], why: "1.1 × 1,000 ÷ 800 = 1.375 → 37.5%." },
      { q: "A man buys 10 pens for ₹9 and sells 9 pens for ₹10. His profit % is…", o: ["23 37/81%", "21%", "11 1/9%", "19%"], why: "CP per pen 0.9, SP per pen 10/9. (10/9) ÷ 0.9 = 100/81 → 23 37/81%." },
      { q: "Two articles are sold for ₹4,800 each, one at 20% gain and the other at 20% loss. The overall result is…", o: ["₹400 loss", "No loss", "₹400 gain", "₹200 loss"], why: "CPs are 4,000 and 6,000: total 10,000. SP 9,600 → loss ₹400." },
      { q: "On selling 33 m of cloth, a man gains the selling price of 11 m. His gain % is…", o: ["50%", "33⅓%", "25%", "66⅔%"], why: "SP of 33 − CP of 33 = SP of 11, so CP of 33 = SP of 22. Gain = 11 ÷ 22 = 50%." },
      { q: "A 15% discount on an article saves ₹102. The selling price is…", o: ["₹578", "₹680", "₹598", "₹582"], why: "MP = 102 ÷ 0.15 = 680. SP = 680 − 102 = ₹578." },
      { q: "The profit when an article is sold for ₹425 equals the loss when it is sold for ₹355. The cost price is…", o: ["₹390", "₹380", "₹400", "₹385"], why: "CP is halfway: (425 + 355) ÷ 2 = ₹390." }
    ]
  }
};
