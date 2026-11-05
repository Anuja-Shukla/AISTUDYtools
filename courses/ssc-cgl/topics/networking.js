/* SSC CGL · Computer Knowledge (Tier 2) · Networking & cyber security. Original teaching material and questions by AIStudyTools. */
window.SSC_TOPICS = window.SSC_TOPICS || {};
window.SSC_TOPICS["networking"] = {
  id: "networking", subject: "computer", num: 4, title: "Networking & cyber security",
  minutes: 30,
  why: "Networking and cyber security questions test network types and devices, topologies, kinds of malware and safe online habits. Learn each term with a one-line meaning.",
  video: "videos/SSC_C04_Networking_Security.mp4",
  slides: [
    { h: "Network types by size", body: "<table class=\"pt\"><tr><th>Type</th><th>Covers</th></tr><tr><td>PAN</td><td>a person’s devices (Bluetooth)</td></tr><tr><td>LAN</td><td>a room, office or campus</td></tr><tr><td>MAN</td><td>a city</td></tr><tr><td>WAN</td><td>countries — the Internet is the largest WAN</td></tr></table>" },
    { h: "Devices and topologies", body: "<ul><li><b>Router</b> – connects networks and routes data · <b>switch / hub</b> – connects devices in a LAN</li><li><b>Modem</b> – converts digital ↔ analog signals</li><li><b>MAC address</b> – the hardware address of a network card; <b>IP address</b> – the network address</li><li>Topologies: <b>star</b> (central hub), <b>bus</b> (one cable), <b>ring</b>, <b>mesh</b></li></ul>" },
    { h: "Malware", body: "<ul><li><b>Virus</b> – attaches to a host file and spreads when it runs.</li><li><b>Worm</b> – copies itself across networks without a host file.</li><li><b>Trojan horse</b> – harmful software disguised as useful.</li><li><b>Spyware</b> – secretly collects information.</li><li><b>Ransomware</b> – locks or encrypts data and demands payment.</li></ul>",
      ask: { q: "Which malware spreads by itself without a host file?", a: "A worm." } },
    { h: "Attacks and defences", body: "<ul><li><b>Phishing</b> – fake messages that trick you into giving passwords or OTPs.</li><li><b>Firewall</b> – blocks unauthorised network access.</li><li><b>Encryption</b> – turns data into a code only the right key can open.</li><li><b>Two-factor authentication</b> – password plus a second check such as an OTP.</li><li>India’s CERT-In responds to cyber security incidents.</li></ul>" },
    { h: "Safe habits", body: "<ul><li>Use long passwords with upper and lower case letters, numbers and symbols.</li><li>Never share OTPs; check links before clicking.</li><li>Keep software and antivirus updated.</li></ul>" }
  ],
  tools: ["pwcheck", "netsize", "threatgame"],
  formulas: [["PAN / LAN / MAN / WAN", "personal / local / city / wide"], ["Router / modem", "routes between networks / digital ↔ analog"], ["Virus / worm / Trojan", "needs host / self-spreading / disguised"], ["Phishing", "fake messages to steal details"], ["Firewall", "blocks unauthorised access"]],
  practice: [
    { q: "LAN stands for:", o: ["Local Area Network", "Large Area Network", "Long Access Network", "Linked Area Node"], why: "Local Area Network.", hint: "Local." },
    { q: "A network that covers a city is a:", o: ["MAN", "LAN", "PAN", "WAN"], why: "Metropolitan Area Network.", hint: "Metropolitan." },
    { q: "A device that connects different networks and routes data is a:", o: ["Router", "Monitor", "Keyboard", "Scanner"], why: "Router.", hint: "Routes." },
    { q: "In which topology are all devices connected to a central hub?", o: ["Star", "Bus", "Ring", "Mesh"], why: "Star.", hint: "Points around a centre." },
    { q: "Harmful software disguised as a useful program is a:", o: ["Trojan horse", "Worm", "Firewall", "Cookie"], why: "Named after the wooden horse.", hint: "Greek legend." },
    { q: "Fake emails that trick people into revealing passwords are called:", o: ["Phishing", "Spamming", "Hacking a firewall", "Encryption"], why: "Phishing.", hint: "Sounds like fishing." },
    { q: "A firewall is used to:", o: ["Block unauthorised network access", "Cool the computer", "Speed up the internet", "Store passwords"], why: "Security barrier.", hint: "A wall." },
    { q: "A program that copies itself across networks without needing a host file is a:", o: ["Worm", "Virus", "Trojan", "Spyware"], why: "Worm.", hint: "Crawls by itself." },
    { q: "Which is the strongest password?", o: ["Tr#9vLq!2mZ", "password", "12345678", "rahul1990"], why: "Long, with mixed character types.", hint: "Mix of types." },
    { q: "Ransomware:", o: ["Locks or encrypts data and demands payment", "Speeds up the computer", "Cleans viruses", "Backs up files"], why: "Ransom.", hint: "Ransom." }
  ],
  test: {
    minutes: 5, right: 3, wrong: 1,
    items: [
      { q: "An example of a WAN is:", o: ["The Internet", "A home Wi-Fi network", "A Bluetooth headset link", "An office printer"], why: "The largest WAN." },
      { q: "In a bus topology:", o: ["All devices share a single cable", "All devices connect to a hub", "Devices form a closed loop", "Every device links to every other"], why: "One backbone cable." },
      { q: "A modem:", o: ["Converts digital signals to analog and back", "Prints documents", "Stores data", "Displays images"], why: "Modulator–demodulator." },
      { q: "Two-factor authentication means:", o: ["A password plus a second check such as an OTP", "Two passwords typed twice", "Two users sharing an account", "Logging in from two devices"], why: "Two kinds of proof." },
      { q: "A computer virus needs:", o: ["A host file or program to spread", "No file at all", "A printer", "An internet browser only"], why: "That is how it differs from a worm." },
      { q: "Spyware:", o: ["Secretly collects user information", "Protects against viruses", "Repairs files", "Encrypts emails for safety"], why: "Spies on the user." },
      { q: "Encryption means:", o: ["Converting data into a code to protect it", "Deleting data", "Copying data", "Compressing images"], why: "Only the key can unlock it." },
      { q: "Bluetooth is an example of a:", o: ["PAN", "LAN", "MAN", "WAN"], why: "Personal Area Network." },
      { q: "A MAC address is:", o: ["The hardware address of a network card", "An email address", "A website address", "An Apple computer"], why: "Media Access Control." },
      { q: "CERT-In is India’s agency for:", o: ["Responding to cyber security incidents", "Issuing passports", "Telecom licences", "Satellite launches"], why: "Indian Computer Emergency Response Team." }
    ]
  }
};
