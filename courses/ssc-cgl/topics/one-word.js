/* SSC CGL · English · One-word substitution. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["one-word"] = {
  id: "one-word", subject: "english", num: 4, title: "One-word substitution",
  minutes: 25,
  why: "One-word substitution gives 1–3 Tier 1 marks: replace a phrase with one word. Most answers come from a few word families (-cide, -phobia, -cracy, -logy, -ist), so learn the parts, not just the list.",
  video: "videos/SSC_E04_One_Word.mp4",
  slides: [
    { h: "Learn families, not lists", body: "<table class=\"pt\"><tr><th>Part</th><th>Means</th><th>Example</th></tr><tr><td>-cide</td><td>killing</td><td>matricide (mother)</td></tr><tr><td>-phobia</td><td>fear</td><td>acrophobia (heights)</td></tr><tr><td>-cracy</td><td>rule by</td><td>democracy (people)</td></tr><tr><td>-logy / -nomy</td><td>study</td><td>astronomy (stars)</td></tr><tr><td>-ist</td><td>a person who</td><td>optimist</td></tr></table>" },
    { h: "Killing: -cide", body: "<ul><li>patricide – father · matricide – mother</li><li>fratricide – brother · infanticide – infant</li><li>homicide – a human being · genocide – a whole people</li></ul>" },
    { h: "Fear: -phobia", body: "<ul><li>acrophobia – heights · hydrophobia – water</li><li>claustrophobia – closed spaces · agoraphobia – open or crowded places</li></ul>",
      ask: { q: "Fear of closed spaces?", a: "Claustrophobia." } },
    { h: "Places and people", body: "<ul><li>aviary – birds · apiary – bees · aquarium – fish · kennel – dogs</li><li>polyglot – knows many languages · somnambulist – walks in sleep</li><li>patriot – loves the country · atheist – does not believe in God</li></ul>" },
    { h: "il- / in- words", body: "<ul><li>illiterate – cannot read or write</li><li>illegible – handwriting that cannot be read</li><li>inaudible – cannot be heard · invisible – cannot be seen</li><li>ineligible – not qualified · indelible – cannot be erased</li></ul><p>These look alike; match the exact meaning.</p>" },
    { h: "Exam strategy", body: "<ul><li>Find the key idea (who? what? fear? killing? rule?).</li><li>Pick the family, then the exact word.</li><li>Watch near-misses: biography vs autobiography, illegible vs ineligible.</li></ul>" }
  ],
  tools: ["owsdrill", "owsparts", "owsbuild"],
  formulas: [["-cide", "killing"], ["-phobia", "fear"], ["-cracy", "rule"], ["-logy / -nomy", "study of"], ["-ist", "a person who"], ["auto-", "self (autobiography)"], ["poly-", "many (polyglot)"]],
  practice: [
    { q: "One who cannot read or write:", o: ["Illiterate", "Literate", "Ignorant", "Innocent"], why: "il + literate.", hint: "Opposite of literate." },
    { q: "A person who loves his or her country:", o: ["Patriot", "Traitor", "Tourist", "Pilgrim"], why: "patri = fatherland.", hint: "Opposite of traitor." },
    { q: "Fear of heights:", o: ["Acrophobia", "Hydrophobia", "Claustrophobia", "Agoraphobia"], why: "acro = high.", hint: "-phobia family." },
    { q: "A place where birds are kept:", o: ["Aviary", "Apiary", "Aquarium", "Kennel"], why: "avi = bird.", hint: "Apiary is for bees." },
    { q: "A person who does not eat meat:", o: ["Vegetarian", "Carnivore", "Omnivore", "Cannibal"], why: "Eats only plant foods.", hint: "Opposite of meat-eater." },
    { q: "A speech made without preparation:", o: ["Extempore", "Monologue", "Soliloquy", "Dialogue"], why: "Extempore = on the spot.", hint: "No preparation." },
    { q: "The study of stars and planets:", o: ["Astronomy", "Astrology", "Geology", "Botany"], why: "Astronomy is the science; astrology is prediction.", hint: "The science." },
    { q: "A person who walks in his or her sleep:", o: ["Somnambulist", "Insomniac", "Pedestrian", "Hypnotist"], why: "somnus = sleep, ambulare = walk.", hint: "Sleep + walk." },
    { q: "Government by the people:", o: ["Democracy", "Autocracy", "Monarchy", "Bureaucracy"], why: "demos = people.", hint: "-cracy family." },
    { q: "That which cannot be seen:", o: ["Invisible", "Illegible", "Inaudible", "Indelible"], why: "vis = see.", hint: "Root vis." }
  ],
  test: {
    minutes: 5, right: 2, wrong: 0.5,
    items: [
      { q: "One who knows many languages:", o: ["Polyglot", "Bilingual", "Translator", "Orator"], why: "poly = many; glot = tongue." },
      { q: "A place where bees are kept:", o: ["Apiary", "Aviary", "Hive-house", "Granary"], why: "api = bee." },
      { q: "Fear of water:", o: ["Hydrophobia", "Acrophobia", "Claustrophobia", "Agoraphobia"], why: "hydro = water." },
      { q: "A person who does not believe in God:", o: ["Atheist", "Theist", "Pilgrim", "Priest"], why: "a- = without; theos = God." },
      { q: "Killing of one’s own mother:", o: ["Matricide", "Patricide", "Fratricide", "Homicide"], why: "mater = mother." },
      { q: "Handwriting that cannot be read:", o: ["Illegible", "Ineligible", "Invisible", "Inaudible"], why: "legere = read." },
      { q: "The story of a person’s life written by that person:", o: ["Autobiography", "Biography", "Novel", "Diary"], why: "auto = self." },
      { q: "A person who always looks on the bright side:", o: ["Optimist", "Pessimist", "Realist", "Egoist"], why: "Hopeful outlook." },
      { q: "An animal that eats both plants and meat:", o: ["Omnivore", "Herbivore", "Carnivore", "Insectivore"], why: "omni = all." },
      { q: "A word with the same meaning as another word:", o: ["Synonym", "Antonym", "Homonym", "Acronym"], why: "syn = same." }
    ]
  }
};
