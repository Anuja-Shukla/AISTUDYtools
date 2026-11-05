/* SSC CGL · General Awareness · Physics. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["physics"] = {
  id: "physics", subject: "ga", num: 5, title: "Physics",
  minutes: 30,
  why: "Physics gives 2–3 GA marks: SI units, instruments, light, sound, electricity and Newton’s laws. Questions are short facts — learn them as pairs (quantity–unit, defect–lens, effect–example).",
  video: "videos/SSC_G05_Physics.mp4",
  slides: [
    { h: "SI units", body: "<table class=\"pt\"><tr><td>Force – newton (N)</td><td>Work, energy – joule (J)</td></tr><tr><td>Power – watt (W)</td><td>Current – ampere (A)</td></tr><tr><td>Resistance – ohm (Ω)</td><td>Frequency – hertz (Hz)</td></tr><tr><td>Pressure – pascal (Pa)</td><td>Charge – coulomb (C)</td></tr></table><p>1 horsepower ≈ 746 W.</p>" },
    { h: "Motion and gravity", body: "<ul><li>Newton’s first law is the <b>law of inertia</b>.</li><li>Second law: F = m × a. Third law: every action has an equal and opposite reaction.</li><li>g on Earth ≈ <b>9.8 m/s²</b>.</li></ul>" },
    { h: "Light", body: "<ul><li>Speed of light ≈ <b>3 × 10⁸ m/s</b>.</li><li>Rainbow: <b>dispersion</b> of light (with refraction and reflection in drops).</li><li>Blue sky: <b>scattering</b> of light.</li><li>Myopia (short sight) → <b>concave</b> lens; hypermetropia (long sight) → <b>convex</b> lens.</li><li>Rear-view mirror in vehicles: <b>convex</b> mirror (wider view).</li></ul>",
      ask: { q: "Which lens corrects short-sightedness?", a: "A concave lens." } },
    { h: "Sound", body: "<ul><li>Sound needs a medium; it cannot travel through a <b>vacuum</b>.</li><li>Sound waves are <b>longitudinal</b>.</li><li>Sound is fastest in solids, slower in liquids, slowest in gases.</li></ul>" },
    { h: "Electricity and instruments", body: "<ul><li>A fuse works on the <b>heating effect</b> of current.</li><li>A generator (dynamo) turns mechanical energy into electrical energy; a motor does the reverse.</li><li>Barometer – air pressure · thermometer – temperature · ammeter – current · voltmeter – voltage · hygrometer – humidity.</li></ul>" },
    { h: "How to revise", body: "<ul><li>Learn units and instruments as pairs using the tool below.</li><li>For light, remember: concave for short sight, convex for long sight.</li></ul>" }
  ],
  tools: ["unitlook", "factquiz", "factcards"],
  formulas: [["Force / work / power", "newton / joule / watt"], ["Current / resistance / frequency", "ampere / ohm / hertz"], ["Speed of light", "≈ 3 × 10⁸ m/s"], ["g on Earth", "≈ 9.8 m/s²"], ["Myopia / hypermetropia", "concave / convex lens"], ["1 hp", "≈ 746 W"]],
  practice: [
    { q: "The SI unit of force is:", o: ["Newton", "Joule", "Watt", "Pascal"], why: "Newton (N).", hint: "Named after Isaac Newton." },
    { q: "The SI unit of work and energy is:", o: ["Joule", "Newton", "Watt", "Volt"], why: "Joule (J).", hint: "Also the unit of heat." },
    { q: "The speed of light in vacuum is about:", o: ["3 × 10⁸ m/s", "3 × 10⁵ m/s", "3 × 10⁶ km/s", "330 m/s"], why: "≈ 300,000 km/s.", hint: "330 m/s is sound." },
    { q: "The unit of electric current is:", o: ["Ampere", "Volt", "Ohm", "Coulomb"], why: "Ampere (A).", hint: "Measured by an ammeter." },
    { q: "Sound cannot travel through:", o: ["Vacuum", "Water", "Steel", "Air"], why: "It needs a medium.", hint: "Outer space." },
    { q: "Atmospheric pressure is measured with a:", o: ["Barometer", "Thermometer", "Hygrometer", "Ammeter"], why: "Barometer.", hint: "Baro = pressure." },
    { q: "A rainbow forms mainly due to:", o: ["Dispersion of light", "Scattering of light", "Diffraction of sound", "Polarisation"], why: "White light splits into colours.", hint: "Prism effect." },
    { q: "Myopia (short-sightedness) is corrected with a:", o: ["Concave lens", "Convex lens", "Plane mirror", "Bifocal mirror"], why: "Diverging lens.", hint: "Opposite of convex." },
    { q: "Newton’s first law of motion is also called the law of:", o: ["Inertia", "Gravitation", "Acceleration", "Action and reaction"], why: "Objects keep their state unless a force acts.", hint: "Resistance to change." },
    { q: "The SI unit of power is:", o: ["Watt", "Joule", "Newton", "Ampere"], why: "Watt = joule per second.", hint: "Light bulbs are rated in it." }
  ],
  test: {
    minutes: 5, right: 2, wrong: 0.5,
    items: [
      { q: "The unit of electrical resistance is:", o: ["Ohm", "Ampere", "Volt", "Watt"], why: "Ohm (Ω)." },
      { q: "The unit of frequency is:", o: ["Hertz", "Decibel", "Newton", "Tesla"], why: "Hertz (Hz)." },
      { q: "Acceleration due to gravity on Earth is about:", o: ["9.8 m/s²", "1.6 m/s²", "98 m/s²", "0.98 m/s²"], why: "≈ 9.8 m/s²." },
      { q: "Hypermetropia (long-sightedness) is corrected with a:", o: ["Convex lens", "Concave lens", "Plane glass", "Cylindrical mirror"], why: "Converging lens." },
      { q: "Rear-view mirrors in vehicles are:", o: ["Convex mirrors", "Concave mirrors", "Plane mirrors", "Cylindrical mirrors"], why: "Give a wider field of view." },
      { q: "An electric fuse works on the:", o: ["Heating effect of current", "Magnetic effect of current", "Chemical effect of current", "Lighting effect"], why: "The wire melts when current is too high." },
      { q: "A device that converts mechanical energy into electrical energy is a:", o: ["Generator", "Motor", "Transformer", "Battery"], why: "A motor does the reverse." },
      { q: "Sound waves are:", o: ["Longitudinal waves", "Transverse waves", "Electromagnetic waves", "Stationary waves only"], why: "Compressions and rarefactions." },
      { q: "The sky looks blue because of:", o: ["Scattering of light", "Reflection of light", "Dispersion of light", "Refraction of sound"], why: "Blue light scatters most." },
      { q: "One horsepower is about:", o: ["746 watts", "1000 watts", "500 watts", "100 watts"], why: "≈ 746 W." }
    ]
  },
  facts: [["Unit of force?", "Newton", ["Joule", "Pascal", "Watt"]], ["Unit of energy?", "Joule", ["Watt", "Newton", "Volt"]], ["Unit of power?", "Watt", ["Joule", "Ampere", "Ohm"]], ["Unit of current?", "Ampere", ["Volt", "Ohm", "Coulomb"]], ["Unit of resistance?", "Ohm", ["Ampere", "Henry", "Tesla"]], ["Unit of frequency?", "Hertz", ["Decibel", "Newton", "Watt"]], ["Unit of pressure?", "Pascal", ["Newton", "Joule", "Bar only"]], ["Instrument for air pressure?", "Barometer", ["Hygrometer", "Ammeter", "Lactometer"]], ["Instrument for humidity?", "Hygrometer", ["Barometer", "Hydrometer", "Odometer"]], ["Instrument for current?", "Ammeter", ["Voltmeter", "Galvanometer only", "Barometer"]], ["Lens for myopia?", "Concave", ["Convex", "Plane", "Bifocal only"]], ["Lens for hypermetropia?", "Convex", ["Concave", "Plane", "Cylindrical"]], ["Why is the sky blue?", "Scattering", ["Reflection", "Dispersion", "Refraction"]], ["Rainbow is due to?", "Dispersion", ["Scattering", "Interference", "Polarisation"]], ["Sound cannot pass through?", "Vacuum", ["Water", "Iron", "Air"]], ["Speed of light?", "≈ 3 × 10⁸ m/s", ["≈ 330 m/s", "≈ 3 × 10⁵ m/s", "≈ 1500 m/s"]], ["Newton’s first law?", "Law of inertia", ["F = ma", "Action–reaction", "Gravitation"]], ["Fuse works on?", "Heating effect", ["Magnetic effect", "Chemical effect", "Induction"]]]
};
