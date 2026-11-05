/* SSC CGL · Computer Knowledge (Tier 2) · Software & MS Office. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["software"] = {
  id: "software", subject: "computer", num: 2, title: "Software & MS Office",
  minutes: 30,
  why: "Software and MS Office questions test keyboard shortcuts, file extensions, the job of each Office program and basic Excel formulas. Practise the shortcuts with your hands, not just your eyes.",
  video: "videos/SSC_C02_Software_Office.mp4",
  slides: [
    { h: "Types of software", body: "<ul><li><b>System software</b>: operating systems (Windows, Linux), device drivers.</li><li><b>Application software</b>: Word, Excel, PowerPoint, browsers.</li><li><b>Utility software</b>: antivirus, backup, disk cleanup.</li></ul>" },
    { h: "MS Office programs", body: "<table class=\"pt\"><tr><th>Program</th><th>Used for</th><th>Extension</th></tr><tr><td>Word</td><td>documents</td><td>.docx</td></tr><tr><td>Excel</td><td>spreadsheets</td><td>.xlsx</td></tr><tr><td>PowerPoint</td><td>presentations</td><td>.pptx</td></tr><tr><td>Access</td><td>databases</td><td>.accdb</td></tr></table>" },
    { h: "Shortcuts everyone asks", body: "<table class=\"pt\"><tr><td>Ctrl + C copy</td><td>Ctrl + X cut</td><td>Ctrl + V paste</td></tr><tr><td>Ctrl + Z undo</td><td>Ctrl + Y redo</td><td>Ctrl + A select all</td></tr><tr><td>Ctrl + S save</td><td>Ctrl + P print</td><td>Ctrl + B bold</td></tr><tr><td>Ctrl + I italic</td><td>Ctrl + U underline</td><td>F5 slide show (PowerPoint)</td></tr></table>",
      ask: { q: "What does Ctrl + Z do?", a: "Undo." } },
    { h: "Excel basics", body: "<ul><li>A cell address is column letter + row number: <b>B3</b> = column B, row 3.</li><li>Formulas start with <b>=</b>.</li><li>=SUM(A1:A5) adds; =AVERAGE(...) averages; =MAX, =MIN, =COUNT.</li></ul>" },
    { h: "Exam strategy", body: "<ul><li>Learn shortcuts in groups: editing (C, X, V, Z, Y), formatting (B, I, U), file (S, P, O, N).</li><li>Remember extensions end in “x” since Office 2007.</li><li>Try formulas in the mini sheet below.</li></ul>" }
  ],
  tools: ["shortcutdrill", "minisheet", "swtype"],
  formulas: [["Copy / cut / paste", "Ctrl + C / X / V"], ["Undo / redo", "Ctrl + Z / Y"], ["Save / print / select all", "Ctrl + S / P / A"], ["Word / Excel / PowerPoint", ".docx / .xlsx / .pptx"], ["Excel formulas", "start with =; SUM, AVERAGE, MAX, MIN, COUNT"]],
  practice: [
    { q: "Ctrl + C is used to:", o: ["Copy", "Cut", "Close", "Paste"], why: "C for copy.", hint: "Copy." },
    { q: "Ctrl + Z is used to:", o: ["Undo", "Redo", "Zoom", "Save"], why: "Undo the last action.", hint: "Go back." },
    { q: "The MS Office program for spreadsheets is:", o: ["Excel", "Word", "PowerPoint", "Outlook"], why: "Excel.", hint: "Rows and columns." },
    { q: "The default extension of a Word document (2007 onwards) is:", o: [".docx", ".xlsx", ".pptx", ".txt"], why: ".docx.", hint: "doc." },
    { q: "In Excel, the cell B3 means:", o: ["Column B, row 3", "Row B, column 3", "Sheet B, page 3", "Third cell of sheet B"], why: "Column letter, then row number.", hint: "Letter = column." },
    { q: "Which Excel function adds values?", o: ["SUM", "ADD", "TOTAL", "PLUS"], why: "=SUM(range).", hint: "Sum." },
    { q: "The shortcut to save a file is:", o: ["Ctrl + S", "Ctrl + V", "Ctrl + A", "Ctrl + P"], why: "S for save.", hint: "S." },
    { q: "PowerPoint is mainly used for:", o: ["Presentations", "Databases", "Email", "Accounting only"], why: "Slides.", hint: "Slides." },
    { q: "Which is system software?", o: ["Operating system", "MS Word", "A web browser", "A game"], why: "It runs the hardware.", hint: "Windows, Linux." },
    { q: "Ctrl + P is used to:", o: ["Print", "Paste", "Present", "Protect"], why: "P for print.", hint: "Printer." }
  ],
  test: {
    minutes: 5, right: 3, wrong: 1,
    items: [
      { q: "Ctrl + V is used to:", o: ["Paste", "View", "Verify", "Copy"], why: "Paste." },
      { q: "Ctrl + X is used to:", o: ["Cut", "Exit", "Copy", "Close"], why: "Cut." },
      { q: "The default extension of an Excel workbook (2007 onwards) is:", o: [".xlsx", ".docx", ".pptx", ".csvx"], why: ".xlsx." },
      { q: "In Excel, a formula begins with:", o: ["=", "+", "#", "$"], why: "An equals sign." },
      { q: "Ctrl + B is used to:", o: ["Make text bold", "Go back", "Insert a border", "Open a blank page"], why: "Bold." },
      { q: "In PowerPoint, F5 is used to:", o: ["Start the slide show from the beginning", "Save the file", "Insert a slide", "Spell check"], why: "F5." },
      { q: "Ctrl + A is used to:", o: ["Select all", "Align left", "Add a page", "Open the address bar"], why: "Select all." },
      { q: "Which Excel function finds the mean?", o: ["AVERAGE", "MEAN", "MID", "SUM"], why: "=AVERAGE(range)." },
      { q: "Antivirus software is an example of:", o: ["Utility software", "Application software", "Firmware", "Malware"], why: "It maintains the system." },
      { q: "Ctrl + Y is used to:", o: ["Redo", "Undo", "Yank", "Print preview"], why: "Redo." }
    ]
  }
};
