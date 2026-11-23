/* AIStudyTools registration gate.
   Courses and tools ask a visitor to register once (name, email, optional mobile, role).
   The details are emailed to AIStudyTools (FormSubmit) and remembered in this browser.
   Usage: <script src="/static/register.js?v=1" defer></script>
   Other scripts can read the learner with window.ASTUser.get(), or wait with ASTUser.ready(fn). */
(function () {
  "use strict";
  var KEY = "ast_user", EMAIL = "intelliqueresearchschool@gmail.com";
  var mem = null, waiting = [];

  function get() {
    if (mem) return mem;
    try { var v = JSON.parse(localStorage.getItem(KEY) || "null"); if (v && v.email) mem = v; } catch (e) {}
    return mem;
  }
  function put(u) { mem = u; try { localStorage.setItem(KEY, JSON.stringify(u)); } catch (e) {} }
  function done() { var w = waiting; waiting = []; w.forEach(function (f) { try { f(mem); } catch (e) {} }); }
  window.ASTUser = {
    get: get,
    save: function (u) { put(u); done(); },
    ready: function (f) { if (get()) f(mem); else waiting.push(f); }
  };

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function pageName() { return (document.title || "").split("|")[0].trim() || location.pathname; }

  var CSS = '#ast-reg{position:fixed;inset:0;z-index:2147483000;background:rgba(30,27,75,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:flex-start;justify-content:center;overflow-y:auto;padding:24px 16px;font-family:inherit}' +
    '#ast-reg .rb{background:#fff;color:#1E1B4B;max-width:480px;width:100%;border-radius:20px;padding:26px 24px;box-shadow:0 20px 60px rgba(30,27,75,.35);margin:auto 0}' +
    '#ast-reg h2{font-size:24px;line-height:1.25;margin:8px 0 6px;color:#1E1B4B}#ast-reg p{margin:0 0 10px;font-size:15px;line-height:1.5;color:#4B4F6B}' +
    '#ast-reg .tg{display:inline-block;background:#EEF0FF;color:#4338CA;font-weight:700;font-size:13px;border-radius:999px;padding:4px 10px}' +
    '#ast-reg label{display:block;font-weight:700;font-size:14px;margin:12px 0 5px;color:#1E1B4B}#ast-reg label span{font-weight:500;color:#6B7090}' +
    '#ast-reg input[type=text],#ast-reg input[type=email],#ast-reg input[type=tel],#ast-reg select{width:100%;box-sizing:border-box;font:inherit;font-size:16px;padding:11px 12px;border:2px solid #E3E5F3;border-radius:12px;background:#fff;color:#1E1B4B}' +
    '#ast-reg input:focus,#ast-reg select:focus{outline:none;border-color:#4F46E5}' +
    '#ast-reg .ck{display:flex;gap:9px;align-items:flex-start;font-weight:500;font-size:14px;line-height:1.45;color:#4B4F6B}#ast-reg .ck input{margin-top:3px;width:18px;height:18px;flex:none}' +
    '#ast-reg button{width:100%;margin-top:16px;font:inherit;font-weight:800;font-size:17px;border:0;border-radius:14px;padding:13px 16px;background:#4F46E5;color:#fff;cursor:pointer}#ast-reg button:disabled{opacity:.6;cursor:wait}' +
    '#ast-reg .er{color:#B42318;font-weight:600;font-size:14px;min-height:20px;margin-top:8px}#ast-reg .sm{font-size:13px;color:#6B7090;margin-top:12px;text-align:center}#ast-reg a{color:#4F46E5}';

  function show() {
    if (document.getElementById("ast-reg")) return;
    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    var d = document.createElement("div"); d.id = "ast-reg"; d.setAttribute("role", "dialog"); d.setAttribute("aria-modal", "true"); d.setAttribute("aria-labelledby", "ast-reg-h");
    d.innerHTML = '<form class="rb" novalidate><span class="tg">Free registration</span>' +
      '<h2 id="ast-reg-h">Register to continue</h2>' +
      '<p>Register once to use <b>' + esc(pageName()) + '</b> and all AIStudyTools courses and tools. It takes 20 seconds.</p>' +
      '<label for="ar-n">Full name <span>(as it should appear on your certificate)</span></label><input id="ar-n" type="text" autocomplete="name" required>' +
      '<label for="ar-e">Email</label><input id="ar-e" type="email" autocomplete="email" placeholder="you@example.com" required>' +
      '<label for="ar-p">Mobile / WhatsApp <span>(optional)</span></label><input id="ar-p" type="tel" autocomplete="tel" inputmode="tel" placeholder="+91">' +
      '<label for="ar-r">I am a</label><select id="ar-r"><option value="">Choose one</option><option>Student</option><option>Exam aspirant</option><option>Faculty / Researcher</option><option>Working professional</option><option>Other</option></select>' +
      '<label class="ck"><input id="ar-c" type="checkbox"> <span>I agree to the <a href="/terms/" target="_blank">Terms</a> and <a href="/privacy/" target="_blank">Privacy Policy</a>, and AIStudyTools may contact me about my courses.</span></label>' +
      '<div class="er" aria-live="polite"></div><button type="submit">Register and continue</button>' +
      '<p class="sm">Registered before on another device? Just fill this in again. · <a href="/">Back to home</a></p></form>';
    document.body.appendChild(d);
    var prevOverflow = document.body.style.overflow; document.body.style.overflow = "hidden";
    var f = d.querySelector("form"), er = d.querySelector(".er"), b = d.querySelector("button");
    setTimeout(function () { var n = document.getElementById("ar-n"); if (n) n.focus(); }, 50);
    f.addEventListener("submit", function (e) {
      e.preventDefault(); er.textContent = "";
      var u = { name: f.querySelector("#ar-n").value.trim(), email: f.querySelector("#ar-e").value.trim().toLowerCase(), phone: f.querySelector("#ar-p").value.trim(), role: f.querySelector("#ar-r").value };
      if (u.name.length < 2) { er.textContent = "Please enter your full name."; return; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(u.email)) { er.textContent = "Please enter a valid email address."; return; }
      if (u.phone && !/^[+()\d\s-]{8,18}$/.test(u.phone)) { er.textContent = "Please check your mobile number, or leave it empty."; return; }
      if (!u.role) { er.textContent = "Please choose who you are."; return; }
      if (!f.querySelector("#ar-c").checked) { er.textContent = "Please tick the box to agree."; return; }
      u.at = new Date().toISOString(); u.first_page = location.pathname;
      b.disabled = true; b.textContent = "Registering…";
      var data = { _subject: "Registration: " + u.name + " (" + u.role + ")", _template: "table", _captcha: "false", name: u.name, email: u.email, whatsapp: u.phone, role: u.role, page: pageName(), url: location.href };
      var finish = function () {
        put(u);
        try { gtag("event", "sign_up", { method: "form", role: u.role, page: location.pathname }); } catch (x) {}
        d.remove(); document.body.style.overflow = prevOverflow; done();
      };
      fetch("https://formsubmit.co/ajax/" + EMAIL, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(finish)
        /* Never lock a learner out because the email service is down: let them in and keep the details in the browser. */
        .catch(finish);
    });
  }

  function start() { if (!get()) show(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
