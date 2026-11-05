/* SSC CGL · Computer Knowledge (Tier 2) · Computer basics. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["basics"] = {
  id: "basics", subject: "computer", num: 1, title: "Computer basics",
  minutes: 30,
  why: "Computer Knowledge is a Tier 2 section. Basics covers the parts of a computer, memory, input and output devices, number systems and units of storage. Most questions are one-line definitions.",
  video: "videos/SSC_C01_Computer_Basics.mp4",
  slides: [
    { h: "Parts of a computer", body: "<ul><li><b>CPU</b> (Central Processing Unit) – the “brain”: ALU (arithmetic and logic), CU (control unit) and registers.</li><li><b>Memory</b> – stores data and instructions.</li><li><b>Input devices</b> – keyboard, mouse, scanner, microphone.</li><li><b>Output devices</b> – monitor, printer, speaker.</li></ul>" },
    { h: "Memory", body: "<table class=\"pt\"><tr><th>Type</th><th>Fact</th></tr><tr><td>Registers</td><td>fastest, inside the CPU</td></tr><tr><td>Cache</td><td>small, fast, between CPU and RAM</td></tr><tr><td>RAM</td><td>main memory; volatile (lost when power is off)</td></tr><tr><td>ROM</td><td>non-volatile; holds start-up instructions (BIOS)</td></tr><tr><td>Hard disk, SSD, pen drive</td><td>secondary storage</td></tr></table>" },
    { h: "Units of storage", body: "<ul><li>bit = 0 or 1 (smallest unit) · 1 nibble = 4 bits · 1 byte = 8 bits</li><li>1 KB = 1024 bytes · 1 MB = 1024 KB · 1 GB = 1024 MB · 1 TB = 1024 GB</li></ul>",
      ask: { q: "How many bits make one byte?", a: "8." } },
    { h: "Number systems", body: "<ul><li>Binary (base 2): 0, 1 · Octal (base 8) · Decimal (base 10) · Hexadecimal (base 16: 0–9, A–F)</li><li>5 in binary = 101 (4 + 1). 10 in binary = 1010.</li></ul>" },
    { h: "History and software", body: "<ul><li>Charles Babbage – “father of the computer” (Analytical Engine).</li><li>Operating systems: Windows, Linux, macOS, Android.</li><li>Software = programs; hardware = physical parts.</li></ul>" },
    { h: "Exam strategy", body: "<ul><li>Learn full forms (CPU, ALU, RAM, ROM, BIOS, USB).</li><li>Remember the memory speed ladder: registers → cache → RAM → disk.</li><li>Practise conversions with the tool below.</li></ul>" }
  ],
  tools: ["baseconv", "storeconv", "devgame"],
  formulas: [["1 byte", "8 bits"], ["1 KB / MB / GB", "1024 of the unit below"], ["RAM / ROM", "volatile / non-volatile"], ["Fastest memory", "registers → cache → RAM → disk"], ["ALU", "arithmetic and logical operations"]],
  practice: [
    { q: "CPU stands for:", o: ["Central Processing Unit", "Central Program Unit", "Computer Personal Unit", "Control Processing Unit"], why: "Central Processing Unit.", hint: "Processing." },
    { q: "1 byte equals:", o: ["8 bits", "4 bits", "16 bits", "1024 bits"], why: "8 bits.", hint: "A nibble is 4." },
    { q: "RAM is:", o: ["Volatile memory", "Permanent memory", "Secondary storage", "Read-only memory"], why: "Its data is lost when power is off.", hint: "Power off → lost." },
    { q: "Which is an input device?", o: ["Keyboard", "Monitor", "Printer", "Speaker"], why: "It sends data into the computer.", hint: "You type on it." },
    { q: "1 KB equals:", o: ["1024 bytes", "1000 bits", "1024 bits", "100 bytes"], why: "2¹⁰ bytes.", hint: "Power of 2." },
    { q: "The “brain” of the computer is the:", o: ["CPU", "RAM", "Hard disk", "Monitor"], why: "It processes instructions.", hint: "Processing unit." },
    { q: "ROM mainly stores:", o: ["Start-up instructions (BIOS)", "Files you are editing", "Internet pages", "Deleted files"], why: "Non-volatile firmware.", hint: "Read-only." },
    { q: "The binary number system uses the digits:", o: ["0 and 1", "0 to 7", "0 to 9", "1 and 2"], why: "Base 2.", hint: "Bi = two." },
    { q: "Which is an output device?", o: ["Printer", "Scanner", "Mouse", "Microphone"], why: "It produces results for the user.", hint: "Gives you paper." },
    { q: "The ALU performs:", o: ["Arithmetic and logical operations", "Storage of files", "Display of output", "Internet connection"], why: "Arithmetic Logic Unit.", hint: "Its name." }
  ],
  test: {
    minutes: 5, right: 3, wrong: 1,
    items: [
      { q: "ALU stands for:", o: ["Arithmetic Logic Unit", "Array Logic Unit", "Arithmetic Long Unit", "Applied Logic Utility"], why: "Arithmetic Logic Unit." },
      { q: "The smallest unit of data in a computer is a:", o: ["Bit", "Byte", "Nibble", "Kilobyte"], why: "0 or 1." },
      { q: "1 GB equals:", o: ["1024 MB", "1000 KB", "1024 KB", "100 MB"], why: "1024 MB." },
      { q: "Which is secondary storage?", o: ["Hard disk", "RAM", "Cache", "Register"], why: "Stores data permanently." },
      { q: "Which is NOT an input device?", o: ["Monitor", "Keyboard", "Scanner", "Mouse"], why: "A monitor is an output device." },
      { q: "Decimal 5 in binary is:", o: ["101", "110", "111", "100"], why: "4 + 1." },
      { q: "Cache memory is:", o: ["Small, fast memory between the CPU and RAM", "A type of hard disk", "Permanent storage", "An input device"], why: "Speeds up access." },
      { q: "The “father of the computer” is:", o: ["Charles Babbage", "Alan Turing", "Bill Gates", "Tim Berners-Lee"], why: "Analytical Engine." },
      { q: "The fastest memory is:", o: ["Registers", "Cache", "RAM", "Hard disk"], why: "Inside the CPU." },
      { q: "Which is an operating system?", o: ["Windows", "MS Word", "Google Chrome", "Excel"], why: "The others are applications." }
    ]
  }
};
