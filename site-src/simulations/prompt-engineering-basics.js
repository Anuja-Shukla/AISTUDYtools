const scenes = {
  start: {
    text: "You need the AI to write a product description for a new noise-cancelling headphone. What's your first move?",
    choices: [
      { label: "Just ask: \"Write a product description for headphones.\"", next: "vague" },
      { label: "Give it the product name, key features, target audience, and desired tone.", next: "specific" }
    ]
  },
  vague: {
    text: "The AI returns a generic, three-sentence description that could apply to almost any headphones. It's usable, but bland — and you'll need several rounds of edits to make it useful.",
    choices: [
      { label: "Try again with more specific details this time.", next: "specific" },
      { label: "Just edit the generic draft by hand.", next: "end_vague" }
    ]
  },
  specific: {
    text: "You prompt: \"Write a 100-word product description for the AuraPods Pro, wireless noise-cancelling headphones with 30-hour battery life, aimed at frequent business travelers. Tone: confident, concise, no clich\u00e9s.\" The AI returns a tight, relevant draft close to what you need.",
    choices: [
      { label: "Accept it as final.", next: "end_good" },
      { label: "Ask the AI to generate two alternate tones to compare.", next: "iterate" }
    ]
  },
  iterate: {
    text: "You ask for a playful alternate version and a more premium/luxury version. Now you have three options to compare side by side, and you pick the one that best matches your brand voice.",
    choices: [
      { label: "Finish the simulation.", next: "end_best" }
    ]
  },
  end_vague: {
    text: "Outcome: You got something usable, but spent extra time manually rewriting details the AI never had. Lesson: vague prompts shift the work back onto you.",
    choices: [
      { label: "Restart", next: "start" }
    ]
  },
  end_good: {
    text: "Outcome: Specific context up front got you a strong first draft with minimal editing. Lesson: giving the AI product details, audience, and tone up front saves rounds of back-and-forth.",
    choices: [
      { label: "Restart", next: "start" }
    ]
  },
  end_best: {
    text: "Outcome: Specific context plus asking for variations gave you real options to choose from, not just one guess. Lesson: once a prompt is working, asking for structured alternatives is often more useful than accepting the first output.",
    choices: [
      { label: "Restart", next: "start" }
    ]
  }
};

let current = "start";

function render() {
  const scene = scenes[current];
  const root = document.getElementById("sim-root");
  const choicesHtml = scene.choices.map(c =>
    `<button onclick="go('${c.next}')">${c.label}</button>`
  ).join("");
  root.innerHTML = `
    <h2>Scene</h2>
    <p>${scene.text}</p>
    <div class="sim-choices">${choicesHtml}</div>
  `;
}

function go(next) {
  current = next;
  render();
}

render();
