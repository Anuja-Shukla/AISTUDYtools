/* SSC CGL · Reasoning · Direction sense. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["direction"] = {
  id: "direction", subject: "reasoning", num: 6, title: "Direction sense",
  minutes: 35,
  why: "Direction sense gives 1–2 Tier 1 marks. You track turns and distances, then find the final direction or the shortest distance. A rough sketch and Pythagoras solve almost every question.",
  video: "videos/SSC_R06_Direction.mp4",
  slides: [
    { h: "The compass", body: "<p>Four main directions and four corners:</p><ul><li>North, East, South, West, going <b>clockwise</b></li><li>NE, SE, SW, NW lie halfway between</li></ul><p>On paper: north is up, east is right.</p>", viz: { type: "compass" } },
    { h: "Turns", body: "<ul><li><b>Right turn</b> = 90° clockwise: N → E → S → W → N</li><li><b>Left turn</b> = 90° anticlockwise: N → W → S → E → N</li><li>45° moves to a corner, 180° is an about-turn</li></ul>",
      ask: { q: "Facing north, you turn right, right, then left. Which way do you face?", a: "N → E → S → E. East." } },
    { h: "Angles as numbers", body: "<p>Give each direction an angle clockwise from north: N 0°, NE 45°, E 90°, SE 135°, S 180°, SW 225°, W 270°, NW 315°.</p><p>Clockwise turn: add. Anticlockwise: subtract. Then take the answer modulo 360.</p><p>Facing south (180°), turn 135° clockwise → 315° → <b>north-west</b>.</p>" },
    { h: "Distance: sketch and add", body: "<p>Keep a running total of east–west and north–south moves.</p><p>5 km north, right 3 km, right 5 km → north 5 and south 5 cancel; 3 km east remains.</p><p>The answer is <b>3 km</b> from the start, to the east.</p>" },
    { h: "Shortest distance: Pythagoras", body: "<p>Net east 4, net north 3 → distance = √(4² + 3²) = <b>5</b>.</p><p>Common triples: 3-4-5, 6-8-10, 5-12-13, 8-15-17.</p><p>Direction: both north and east remain → <b>north-east</b>.</p>",
      ask: { q: "Walk 6 km west, then 8 km south. Distance from start?", a: "√(36 + 64) = 10 km, south-west." } },
    { h: "Shadows", body: "<ul><li>Morning: the sun is in the <b>east</b>, so shadows fall to the <b>west</b>.</li><li>Evening: the sun is in the west, so shadows fall to the east.</li><li>At noon there is almost no shadow.</li></ul><p>Morning, shadow to your right → your right is west → you face <b>south</b>.</p>" },
    { h: "Relative position", body: "<p>“A is 10 m south of B; C is 6 m east of A. Where is C from B?”</p><p>Put B at the origin. A = (0, −10), C = (6, −10). C is <b>south-east</b> of B.</p><p>Always ask: from whom? “C from B” means stand at B and look at C.</p>" },
    { h: "Exam strategy", body: "<ul><li>Draw the path on paper with north up.</li><li>Track the facing direction after every turn.</li><li>Add up east–west and north–south separately.</li><li>Use Pythagoras triples for the shortest distance.</li></ul>" }
  ],
  tools: ["dirwalk", "dirturn", "dirshadow", "dirgame"],
  formulas: [
    ["Right turn", "+90° (clockwise)"],
    ["Left turn", "−90° (anticlockwise)"],
    ["Angles", "N 0°, E 90°, S 180°, W 270°"],
    ["Shortest distance", "√(x² + y²)"],
    ["Triples", "3-4-5, 6-8-10, 5-12-13, 8-15-17"],
    ["Shadows", "morning → west; evening → east"]
  ],
  practice: [
    { q: "A man walks 5 km north, turns right and walks 3 km, then turns right and walks 5 km. How far is he from the start?", o: ["3 km", "13 km", "5 km", "8 km"], why: "North and south cancel; 3 km east remains.", hint: "Sketch it." },
    { q: "Ravi walks 4 km east and then 3 km north. How far is he from the start?", o: ["5 km", "7 km", "1 km", "6 km"], why: "√(16 + 9) = 5.", hint: "3-4-5 triangle." },
    { q: "Facing north, you turn right, then right again, then left. Which way do you face?", o: ["East", "West", "North", "South"], why: "N → E → S → E.", hint: "Track each turn." },
    { q: "A girl faces south and turns 135° clockwise. Which way does she face now?", o: ["North-west", "North-east", "South-west", "West"], why: "180° + 135° = 315° = NW.", hint: "Use angles." },
    { q: "In the morning, Ram’s shadow falls to his right. Which way is he facing?", o: ["South", "North", "East", "West"], why: "Morning shadows point west; west on his right means he faces south.", hint: "Where is the sun in the morning?" },
    { q: "A is 10 m south of B. C is 6 m east of A. In which direction is C from B?", o: ["South-east", "South-west", "North-east", "East"], why: "C = (6, −10) from B.", hint: "Put B at the centre." },
    { q: "Walk 10 m south, turn left and walk 20 m, turn left and walk 10 m, turn right and walk 5 m. How far are you from the start?", o: ["25 m", "35 m", "20 m", "45 m"], why: "North–south cancels; 20 + 5 = 25 m east.", hint: "Track the facing direction." },
    { q: "P walks 6 km west, turns left and walks 8 km. How far is P from the start?", o: ["10 km", "14 km", "2 km", "12 km"], why: "6-8-10 triple.", hint: "Left from west is south." },
    { q: "In the evening, a man stands facing his shadow. Which way is he facing?", o: ["East", "West", "North", "South"], why: "Evening sun is in the west; the shadow points east.", hint: "The shadow points away from the sun." },
    { q: "Go 3 km north, 4 km west, then 3 km south. Where are you from the start?", o: ["4 km west", "4 km east", "10 km north-west", "3 km south"], why: "North and south cancel; 4 km west remains.", hint: "Add each axis." }
  ],
  test: {
    minutes: 7, right: 2, wrong: 0.5,
    items: [
      { q: "Walk 8 km north, turn left and walk 6 km. Distance from the start?", o: ["10 km", "14 km", "2 km", "12 km"], why: "6-8-10." },
      { q: "Facing east, you turn left, left, then right. Which way do you face?", o: ["North", "South", "East", "West"], why: "E → N → W → N." },
      { q: "Facing west, you turn 90° anticlockwise. You now face:", o: ["South", "North", "East", "South-west"], why: "Anticlockwise from west is south." },
      { q: "Facing north, you turn 225° clockwise. You now face:", o: ["South-west", "South-east", "North-west", "West"], why: "0° + 225° = SW." },
      { q: "A is 5 m north of B. C is 5 m west of B. In which direction is A from C?", o: ["North-east", "North-west", "South-east", "East"], why: "From C (−5, 0), A (0, 5) is up and right." },
      { q: "Walk 15 m east, turn right and walk 8 m, turn right and walk 15 m. Where are you from the start?", o: ["8 m south", "8 m north", "15 m west", "17 m south-west"], why: "East and west cancel; 8 m south remains." },
      { q: "In the morning Rahul faces the sun, then turns right twice. He now faces:", o: ["West", "East", "North", "South"], why: "E → S → W." },
      { q: "Walk 2 km south, 3 km east, then 6 km north. Distance from the start?", o: ["5 km", "11 km", "7 km", "4 km"], why: "Net 3 east, 4 north → 5." },
      { q: "A man walks 12 m north and then 5 m east. The shortest distance to the start is:", o: ["13 m", "17 m", "7 m", "12 m"], why: "5-12-13." },
      { q: "In the morning, a man’s shadow falls exactly behind him. He faces:", o: ["East", "West", "North", "South"], why: "Morning shadows fall west, so he faces east." }
    ]
  }
};
