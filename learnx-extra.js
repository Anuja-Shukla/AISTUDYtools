/* AIStudyTools – extra LearnX sections (Studio + Evaluate). Loaded from index.html / 404.html. */
(function () {
  var EMAIL = "intelliqueresearchschool@gmail.com";
  var PHONE = "+91 7303559258";
  var TEL = "+917303559258";
  var ID = "lx-extra";

  var css = `
#lx-extra{--lx:oklch(0.55 0.22 264);--lx2:oklch(0.62 0.2 300);--ink:oklch(0.21 0.03 264);--mut:oklch(0.5 0.03 264);--line:oklch(0.92 0.01 264);font-family:inherit;color:var(--ink)}
#lx-extra *{box-sizing:border-box}
#lx-extra .lx-wrap{max-width:1200px;margin:0 auto;padding:0 20px}
#lx-extra section{padding:72px 0}
#lx-extra .lx-eyebrow{display:inline-block;font-size:13px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--lx);background:oklch(0.55 0.22 264 / .08);padding:6px 12px;border-radius:999px;margin-bottom:14px}
#lx-extra h2{font-size:clamp(26px,3.4vw,38px);line-height:1.15;font-weight:700;margin:0 0 12px}
#lx-extra .lx-lead{font-size:17px;line-height:1.6;color:var(--mut);max-width:720px;margin:0 0 32px}
#lx-extra .lx-grid{display:grid;gap:18px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
#lx-extra .lx-card{background:#fff;border:1px solid var(--line);border-radius:18px;padding:22px;box-shadow:0 6px 24px -12px oklch(0.3 0.05 264 / .25)}
#lx-extra .lx-card h3{font-size:17px;font-weight:700;margin:10px 0 6px}
#lx-extra .lx-card p{font-size:14.5px;line-height:1.55;color:var(--mut);margin:0}
#lx-extra .lx-ico{font-size:26px}
#lx-extra .lx-flow{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin:0 0 28px}
#lx-extra .lx-pill{background:#fff;border:1px solid var(--line);border-radius:999px;padding:10px 16px;font-weight:600;font-size:14.5px}
#lx-extra .lx-arrow{color:var(--lx);font-weight:700}
#lx-extra .lx-note{margin-top:22px;display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}
#lx-extra .lx-box{border-radius:16px;padding:18px 20px;font-size:14.5px;line-height:1.55}
#lx-extra .lx-box b{display:block;margin-bottom:4px;color:var(--ink)}
#lx-extra .lx-soft{background:oklch(0.97 0.01 264);color:var(--mut)}
#lx-extra .lx-promo{background:linear-gradient(135deg,var(--lx),var(--lx2));color:#fff}
#lx-extra .lx-promo b{color:#fff}
#lx-extra .lx-btns{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px}
#lx-extra .lx-btn{display:inline-flex;align-items:center;gap:8px;padding:13px 24px;border-radius:999px;font-weight:600;font-size:15px;text-decoration:none;cursor:pointer;border:0;transition:transform .15s}
#lx-extra .lx-btn:hover{transform:translateY(-2px)}
#lx-extra .lx-primary{background:var(--lx);color:#fff;box-shadow:0 8px 20px -8px var(--lx)}
#lx-extra .lx-ghost{background:#fff;color:var(--lx);border:1px solid oklch(0.55 0.22 264 / .35)}
#lx-extra .lx-alt{background:oklch(0.97 0.005 250)}
#lx-extra .lx-split{display:grid;gap:40px;grid-template-columns:1fr 1.1fr;align-items:center}
@media (max-width:900px){#lx-extra .lx-split{grid-template-columns:1fr}}
#lx-extra .lx-steps{list-style:none;padding:0;margin:0 0 22px;display:grid;gap:14px}
#lx-extra .lx-steps li{display:flex;gap:14px;align-items:flex-start}
#lx-extra .lx-num{flex:none;width:32px;height:32px;border-radius:50%;background:var(--lx);color:#fff;font-weight:700;display:grid;place-items:center;font-size:14px}
#lx-extra .lx-steps b{display:block}
#lx-extra .lx-steps span{color:var(--mut);font-size:14.5px;line-height:1.5}
#lx-extra .lx-tags{display:flex;flex-wrap:wrap;gap:8px}
#lx-extra .lx-tag{font-size:13px;font-weight:600;padding:6px 12px;border-radius:999px;background:oklch(0.55 0.22 264 / .08);color:var(--lx)}
#lx-extra .lx-media{position:relative;border-radius:20px;overflow:hidden;background:#0f172a;box-shadow:0 24px 60px -24px oklch(0.3 0.1 264 / .55);cursor:pointer}
#lx-extra .lx-media video,#lx-extra .lx-media img{display:block;width:100%;height:auto}
#lx-extra .lx-play{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:flex;align-items:center;gap:10px;background:rgba(255,255,255,.95);color:var(--ink);font-weight:700;padding:12px 20px;border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.25);font-size:15px}
#lx-extra .lx-play i{width:0;height:0;border-left:12px solid var(--lx);border-top:8px solid transparent;border-bottom:8px solid transparent;display:inline-block}
#lx-extra .lx-cap{font-size:13px;color:var(--mut);margin-top:10px;text-align:center}
#lx-modal{position:fixed;inset:0;background:rgba(10,12,30,.8);display:none;align-items:center;justify-content:center;z-index:9999;padding:16px}
#lx-modal.on{display:flex}
#lx-modal video{width:min(1100px,100%);max-height:88vh;border-radius:14px;background:#000}
#lx-modal button{position:absolute;top:14px;right:18px;background:#fff;border:0;border-radius:999px;width:40px;height:40px;font-size:22px;cursor:pointer}
`;

  var studioFeatures = [
    ["💬", "Chat with the video", "Learners ask questions and get instant text or voice answers, in their own language."],
    ["🎮", "Gamified quizzes", "Drag-and-drop games with scoreboards, plus board games and immersive games."],
    ["🧠", "Mind maps", "From a template, from scratch or generated from a structured file. Editable, with images."],
    ["📝", "Summaries & notes", "Short summaries of the whole video plus notes learners can add to. Save as image, PDF or editable file."],
    ["🔎", "Search inside videos", "Jump to the exact moment with timestamp search."],
    ["🌐", "Localisation", "Multi-language content, checked by a human for accuracy."],
    ["🏗️", "3D & immersive", "Bring 2D engineering drawings to life, or explore interior and architecture models."],
    ["📈", "Adaptive feedback", "See how each learner engages and suggest practice for weak areas."]
  ];

  function html() {
    var cards = studioFeatures.map(function (f) {
      return '<div class="lx-card"><div class="lx-ico">' + f[0] + '</div><h3>' + f[1] + '</h3><p>' + f[2] + '</p></div>';
    }).join("");
    var mail = "mailto:" + EMAIL;
    return '' +
      '<section id="studio"><div class="lx-wrap">' +
        '<span class="lx-eyebrow">For institutions &amp; training teams</span>' +
        '<h2>LearnX Studio: turn your existing content into interactive learning</h2>' +
        '<p class="lx-lead">Students often don\'t ask questions in class, lose focus or forget what they learned. LearnX Studio takes the videos and PDFs you already have and repurposes them into multimodal, interactive learning, built on Brain Science, role play and gamification.</p>' +
        '<div class="lx-flow"><span class="lx-pill">📄 Your PDFs &amp; videos</span><span class="lx-arrow">→</span><span class="lx-pill">🎮 Simulation games</span><span class="lx-arrow">+</span><span class="lx-pill">🧠 Mind maps</span><span class="lx-arrow">+</span><span class="lx-pill">💬 AI video chat</span></div>' +
        '<div class="lx-grid">' + cards + '</div>' +
        '<div class="lx-note">' +
          '<div class="lx-box lx-soft"><b>🔒 Private by design</b>Runs on your own system (on-premise, cloud or hybrid). Answers come only from your content, with no exposure to the public internet or public GPTs.</div>' +
          '<div class="lx-box lx-soft"><b>💼 Pricing</b>Custom, based on the type and amount of content, users (student / teacher), features needed and deployment. Annual maintenance: 15% of total billing.</div>' +
          '<div class="lx-box lx-promo"><b>🎁 This month</b>Free mind map with every video.</div>' +
        '</div>' +
        '<div class="lx-btns"><a class="lx-btn lx-primary" href="' + mail + '?subject=LearnX%20Studio%20demo%20request">Book a demo</a><a class="lx-btn lx-ghost" href="tel:' + TEL + '">Call ' + PHONE + '</a></div>' +
      '</div></section>' +

      '<section id="evaluate" class="lx-alt"><div class="lx-wrap lx-split">' +
        '<div>' +
          '<span class="lx-eyebrow">AI-assisted assessment</span>' +
          '<h2>LearnX Evaluate</h2>' +
          '<p class="lx-lead" style="margin-bottom:24px">Assess faster. Grade fairly. Give feedback that teaches.</p>' +
          '<ol class="lx-steps">' +
            '<li><span class="lx-num">1</span><div><b>Create</b><span>Set up a test from a PDF, with passing criteria, accuracy threshold and number of attempts.</span></div></li>' +
            '<li><span class="lx-num">2</span><div><b>Attempt</b><span>Students answer multiple choice, written, match-the-pairs and image-based questions.</span></div></li>' +
            '<li><span class="lx-num">3</span><div><b>AI evaluates</b><span>Every answer gets an accuracy score and specific, written feedback.</span></div></li>' +
            '<li><span class="lx-num">4</span><div><b>Teacher decides</b><span>Review, override the score, add suggestions and publish the report card.</span></div></li>' +
          '</ol>' +
          '<div class="lx-tags"><span class="lx-tag">Multiple choice</span><span class="lx-tag">Written answers</span><span class="lx-tag">Match the pairs</span><span class="lx-tag">Image-based</span></div>' +
          '<div class="lx-btns"><a class="lx-btn lx-primary" href="' + mail + '?subject=LearnX%20Evaluate%20access%20request">Request access</a><button type="button" class="lx-btn lx-ghost" data-lx-open>▶ Watch 75-sec demo</button></div>' +
        '</div>' +
        '<div>' +
          '<div class="lx-media" data-lx-open>' +
            '<video src="/videos/evaluate-loop.mp4" poster="/videos/evaluate-poster.jpg" autoplay muted loop playsinline preload="metadata" aria-label="AI feedback on a student answer"></video>' +
            '<span class="lx-play"><i></i> Watch demo</span>' +
          '</div>' +
          '<p class="lx-cap">AI feedback on a real student answer, reviewed by the teacher.</p>' +
        '</div>' +
      '</div></section>';
  }

  function openModal() {
    var m = document.getElementById("lx-modal");
    if (!m) {
      m = document.createElement("div");
      m.id = "lx-modal";
      m.innerHTML = '<button type="button" aria-label="Close">×</button><video src="/videos/evaluate-highlight.mp4" controls playsinline></video>';
      document.body.appendChild(m);
      m.addEventListener("click", function (e) { if (e.target === m || e.target.tagName === "BUTTON") close(); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    }
    function close() { m.classList.remove("on"); m.querySelector("video").pause(); }
    m.classList.add("on");
    var v = m.querySelector("video"); v.currentTime = 0; v.play().catch(function () {});
  }

  function inject() {
    if (location.pathname.replace(/\/+$/, "") !== "/learnx") return;
    if (document.getElementById(ID)) return;
    var anchor = [].slice.call(document.querySelectorAll("section")).find(function (s) {
      var h = s.querySelector("h2"); return h && /LearnX Solutions/i.test(h.textContent);
    });
    if (!anchor) return;
    if (!document.getElementById("lx-extra-css")) {
      var st = document.createElement("style"); st.id = "lx-extra-css"; st.textContent = css; document.head.appendChild(st);
    }
    var box = document.createElement("div");
    box.id = ID;
    box.innerHTML = html();
    anchor.parentNode.insertBefore(box, anchor.nextSibling);
    [].forEach.call(box.querySelectorAll("[data-lx-open]"), function (el) { el.addEventListener("click", openModal); });
  }

  new MutationObserver(inject).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener("DOMContentLoaded", inject);
  inject();
})();
