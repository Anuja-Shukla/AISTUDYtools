/* SSC CGL · General Awareness · Chemistry. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["chemistry"] = {
  id: "chemistry", subject: "ga", num: 6, title: "Chemistry",
  minutes: 30,
  why: "Chemistry gives 2–3 GA marks: symbols, common names of compounds, acids and bases, metals and alloys, and everyday chemistry. Learn the common names in a table and the pH scale with examples.",
  video: "videos/SSC_G06_Chemistry.mp4",
  slides: [
    { h: "Symbols from Latin", body: "<ul><li>Sodium – <b>Na</b> (natrium) · Potassium – <b>K</b> (kalium)</li><li>Iron – <b>Fe</b> (ferrum) · Gold – <b>Au</b> (aurum)</li><li>Silver – <b>Ag</b> (argentum) · Lead – <b>Pb</b> (plumbum)</li><li>Copper – <b>Cu</b> (cuprum) · Mercury – <b>Hg</b></li></ul>" },
    { h: "Common names", body: "<table class=\"pt\"><tr><td>Common salt</td><td>sodium chloride</td></tr><tr><td>Baking soda</td><td>sodium bicarbonate</td></tr><tr><td>Washing soda</td><td>sodium carbonate</td></tr><tr><td>Bleaching powder</td><td>calcium oxychloride</td></tr><tr><td>Plaster of Paris</td><td>made from gypsum</td></tr><tr><td>Laughing gas</td><td>nitrous oxide</td></tr><tr><td>Dry ice</td><td>solid carbon dioxide</td></tr></table>" },
    { h: "Acids, bases and pH", body: "<ul><li>pH 7 is neutral (pure water); below 7 acidic; above 7 basic.</li><li>Acids turn blue litmus <b>red</b>; bases turn red litmus <b>blue</b>.</li><li>Vinegar – acetic acid · lemon – citric acid · curd – lactic acid.</li></ul>",
      ask: { q: "What is the pH of pure water?", a: "7 — neutral." } },
    { h: "Air and gases", body: "<ul><li>Most abundant gas in air: <b>nitrogen</b> (about 78%).</li><li>Lightest gas: <b>hydrogen</b>.</li><li>Fire extinguishers often use <b>carbon dioxide</b>.</li></ul>" },
    { h: "Metals and alloys", body: "<ul><li>Mercury is a metal that is liquid at room temperature.</li><li>Diamond (carbon) is the hardest natural substance.</li><li>Rusting needs <b>oxygen and moisture</b>; galvanising coats iron with <b>zinc</b>.</li><li>Brass = copper + zinc · bronze = copper + tin · steel = iron + carbon.</li></ul>" },
    { h: "How to revise", body: "<ul><li>Learn the Latin symbols as a group.</li><li>Use the element finder for atomic numbers 1–30.</li><li>Link each acid to its everyday source.</li></ul>" }
  ],
  tools: ["elemfind", "phscale", "factquiz"],
  formulas: [["Na, K, Fe, Au, Ag, Pb, Cu", "sodium, potassium, iron, gold, silver, lead, copper"], ["pH", "< 7 acid · 7 neutral · > 7 base"], ["Common salt / baking soda", "NaCl / NaHCO₃"], ["Brass / bronze", "Cu + Zn / Cu + Sn"], ["Air", "≈ 78% nitrogen, 21% oxygen"]],
  practice: [
    { q: "The chemical symbol of sodium is:", o: ["Na", "So", "Sd", "S"], why: "From Latin natrium.", hint: "Latin name." },
    { q: "The pH of pure water is:", o: ["7", "0", "14", "5"], why: "Neutral.", hint: "Neutral." },
    { q: "Common salt is:", o: ["Sodium chloride", "Sodium carbonate", "Calcium chloride", "Potassium chloride"], why: "NaCl.", hint: "NaCl." },
    { q: "Which gas is commonly used in fire extinguishers?", o: ["Carbon dioxide", "Oxygen", "Hydrogen", "Nitrogen dioxide"], why: "It does not support burning.", hint: "We breathe it out." },
    { q: "The lightest gas is:", o: ["Hydrogen", "Helium", "Oxygen", "Nitrogen"], why: "Atomic number 1.", hint: "First element." },
    { q: "The most abundant gas in the air is:", o: ["Nitrogen", "Oxygen", "Carbon dioxide", "Argon"], why: "About 78%.", hint: "Not oxygen." },
    { q: "The hardest natural substance is:", o: ["Diamond", "Iron", "Quartz", "Graphite"], why: "A form of carbon.", hint: "A gem." },
    { q: "Rusting of iron needs:", o: ["Oxygen and moisture", "Only oxygen", "Only water", "Carbon dioxide"], why: "Both are needed.", hint: "Two things." },
    { q: "Baking soda is:", o: ["Sodium bicarbonate", "Sodium carbonate", "Calcium carbonate", "Sodium chloride"], why: "NaHCO₃.", hint: "Used in cakes." },
    { q: "Which metal is liquid at room temperature?", o: ["Mercury", "Sodium", "Aluminium", "Zinc"], why: "Mercury (Hg).", hint: "Used in old thermometers." }
  ],
  test: {
    minutes: 5, right: 2, wrong: 0.5,
    items: [
      { q: "The chemical symbol of gold is:", o: ["Au", "Ag", "Go", "Gd"], why: "Latin aurum." },
      { q: "The acid in vinegar is:", o: ["Acetic acid", "Citric acid", "Lactic acid", "Tartaric acid"], why: "Acetic acid." },
      { q: "Laughing gas is:", o: ["Nitrous oxide", "Nitrogen dioxide", "Carbon monoxide", "Ammonia"], why: "N₂O." },
      { q: "Bleaching powder is:", o: ["Calcium oxychloride", "Calcium carbonate", "Sodium chloride", "Calcium sulphate"], why: "Calcium oxychloride." },
      { q: "Plaster of Paris is made from:", o: ["Gypsum", "Limestone", "Bauxite", "Haematite"], why: "By heating gypsum." },
      { q: "Galvanisation means coating iron with:", o: ["Zinc", "Tin", "Copper", "Chromium"], why: "Zinc protects against rust." },
      { q: "Acids turn blue litmus paper:", o: ["Red", "Green", "Yellow", "Colourless"], why: "Acid → red." },
      { q: "The atomic number of carbon is:", o: ["6", "12", "8", "14"], why: "12 is its mass number." },
      { q: "Brass is an alloy of:", o: ["Copper and zinc", "Copper and tin", "Iron and carbon", "Lead and tin"], why: "Bronze is copper and tin." },
      { q: "Dry ice is solid:", o: ["Carbon dioxide", "Water", "Nitrogen", "Ammonia"], why: "Solid CO₂." }
    ]
  },
  facts: [["Symbol of potassium?", "K", ["P", "Po", "Pt"]], ["Symbol of iron?", "Fe", ["Ir", "In", "I"]], ["Symbol of silver?", "Ag", ["Si", "Au", "Sv"]], ["Symbol of lead?", "Pb", ["Ld", "Le", "Li"]], ["Symbol of copper?", "Cu", ["Co", "Cp", "Cr"]], ["Washing soda?", "Sodium carbonate", ["Sodium bicarbonate", "Calcium carbonate", "Sodium chloride"]], ["Acid in lemon?", "Citric acid", ["Acetic acid", "Lactic acid", "Formic acid"]], ["Acid in curd?", "Lactic acid", ["Citric acid", "Acetic acid", "Oxalic acid"]], ["Bronze is?", "Copper + tin", ["Copper + zinc", "Iron + carbon", "Lead + tin"]], ["Steel is?", "Iron + carbon", ["Iron + zinc", "Copper + tin", "Aluminium + copper"]], ["Base turns red litmus?", "Blue", ["Red", "Green", "Yellow"]], ["pH below 7 means?", "Acidic", ["Basic", "Neutral", "Salty"]], ["Oxygen in air?", "About 21%", ["About 78%", "About 1%", "About 50%"]], ["Hardest natural substance?", "Diamond", ["Graphite", "Quartz", "Steel"]], ["Liquid metal?", "Mercury", ["Sodium", "Zinc", "Tin"]], ["Laughing gas?", "Nitrous oxide", ["Ozone", "Methane", "Ammonia"]]]
};
