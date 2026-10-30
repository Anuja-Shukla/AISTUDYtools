/* AIStudyTools course gate: loads a locked course only for signed-in learners with access
   (paid students, faculty allotted by the admin, admins). Usage on a course page:
   <script src="/static/gate.js" data-api="https://pay.aistudytools.com" data-course="ca-foundation-accounting" data-videos="CAFACC_VIDEOS" defer></script> */
(function () {
  var me = document.currentScript || document.querySelector("script[data-course]");
  var API = (me.getAttribute("data-api") || "").replace(/\/$/, "") + "/api/";
  var COURSE = me.getAttribute("data-course"), VG = me.getAttribute("data-videos");
  var KEY = "ast_session", tok = "";
  try { tok = localStorage.getItem(KEY) || ""; } catch (e) {}
  var app = document.getElementById("app");
  var pageTitle = (document.title || "").split("|")[0].trim();

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function call(path, body) {
    var h = { "Content-Type": "application/json" }; if (tok) h.Authorization = "Bearer " + tok;
    return fetch(API + path, { method: body ? "POST" : "GET", headers: h, body: body ? JSON.stringify(body) : undefined })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok) { var e = new Error(j.error || "Something went wrong (" + r.status + ")."); e.status = r.status; throw e; } return j; }); });
  }
  function save(t) { tok = t || ""; try { if (tok) localStorage.setItem(KEY, tok); else localStorage.removeItem(KEY); } catch (e) {} }
  function rs(p) { return "₹" + (p / 100).toLocaleString("en-IN"); }
  function day(iso) { return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }); }
  function shell(inner) {
    app.innerHTML = '<div class="card" style="max-width:640px;margin:34px auto">' + inner + "</div>";
  }
  function note(t, bad) { return t ? '<p style="margin-top:12px;padding:10px 12px;border-radius:12px;font-weight:600;background:' + (bad ? "var(--red);color:var(--red-fg)" : "var(--mint);color:var(--mint-fg)") + '">' + esc(t) + "</p>" : ""; }
  function offerLine(o) {
    var also = o.courses.length > 1 ? "Includes all " + o.courses.length + " papers of " + esc(o.title.replace(/\s*\(.*\)$/, "")) + ". " : "";
    return '<p style="margin:10px 0 0"><b style="font-size:26px">' + rs(o.amount) + "</b> <span class=\"muted\">" + (o.days ? "for " + (o.days === 365 ? "1 year" : o.days + " days") + " from the day you enrol" : "one-time") + "</span></p>" +
      '<p class="muted small" style="margin-top:4px">' + also + "Notes, worked examples, interactive tools, teaching videos, quick checks, a final test and a certificate.</p>";
  }

  /* ---------- screens ---------- */
  function signIn(o, msg) {
    shell('<span class="tag indigo">' + esc(o.title) + "</span><h2 style=\"margin-top:10px\">" + esc(pageTitle) + "</h2>" + offerLine(o) +
      '<hr style="border:0;border-top:1px solid var(--border);margin:18px 0">' +
      "<h3>Sign in to continue</h3><p class=\"muted small\" style=\"margin:4px 0 10px\">Use your e-mail. We will send you a 6-digit code; no password needed. Faculty: use the e-mail your access was given to.</p>" +
      '<div id="g1"><div class="field"><label for="ge">E-mail</label><input id="ge" type="email" autocomplete="email" placeholder="you@example.com"></div>' +
      '<div class="field" style="margin-top:8px"><label for="gn">Your name (as it should appear on your certificate)</label><input id="gn" autocomplete="name"></div>' +
      '<div class="row" style="margin-top:12px"><button class="btn btn-accent" id="gsend">Send code</button></div></div>' +
      '<div id="g2" hidden><div class="field"><label for="gc">6-digit code</label><input id="gc" inputmode="numeric" maxlength="6" autocomplete="one-time-code"></div>' +
      '<div class="row" style="margin-top:12px"><button class="btn btn-accent" id="gverify">Sign in</button><button class="btn btn-soft" id="gback">Use another e-mail</button></div></div>' +
      '<div id="gmsg">' + note(msg, true) + "</div>");
    var email = "";
    document.getElementById("gsend").onclick = function () {
      var b = this; email = document.getElementById("ge").value.trim().toLowerCase(); b.disabled = true;
      call("loginstart", { email: email }).then(function (j) { document.getElementById("g1").hidden = true; document.getElementById("g2").hidden = false; document.getElementById("gmsg").innerHTML = note(j.message); document.getElementById("gc").focus(); })
        .catch(function (e) { document.getElementById("gmsg").innerHTML = note(e.message, true); }).then(function () { b.disabled = false; });
    };
    document.getElementById("gback").onclick = function () { document.getElementById("g1").hidden = false; document.getElementById("g2").hidden = true; document.getElementById("gmsg").innerHTML = ""; };
    document.getElementById("gverify").onclick = function () {
      var b = this; b.disabled = true;
      call("loginverify", { email: email, code: document.getElementById("gc").value, name: document.getElementById("gn").value })
        .then(function (j) { save(j.token); boot(); }).catch(function (e) { document.getElementById("gmsg").innerHTML = note(e.message, true); }).then(function () { b.disabled = false; });
    };
  }

  function noAccess(a, msg) {
    var o = a.offer, faculty = a.role === "faculty";
    var body = '<span class="tag indigo">' + esc(o.title) + "</span><h2 style=\"margin-top:10px\">" + esc(pageTitle) + "</h2>" +
      '<p class="muted small" style="margin-top:6px">Signed in as <b>' + esc(a.email) + '</b> · <a href="#" id="gout">Sign out</a></p>';
    if (faculty) {
      body += note("Your faculty account does not include this course yet. Please contact the AIStudyTools admin to have it allotted.", true);
    } else if (!o.open) {
      body += offerLine(o) + note("Enrolment opens soon. Please check back shortly.", true);
    } else {
      body += offerLine(o) + '<div class="row" style="margin-top:14px"><button class="btn btn-accent" id="gbuy">Enrol for ' + rs(o.amount) + "</button></div>" +
        '<p class="muted small" style="margin-top:8px">Secure payment by Razorpay (UPI, cards, net banking). A receipt is e-mailed to you. See our <a href="/refund-policy/">refund policy</a>.</p>';
    }
    shell(body + '<div id="gmsg">' + note(msg, true) + "</div>");
    document.getElementById("gout").onclick = function (e) { e.preventDefault(); save(""); boot(); };
    var buy = document.getElementById("gbuy");
    if (buy) buy.onclick = function () { pay(o, a, buy); };
  }

  function loadScript(src) {
    return new Promise(function (res, rej) { var s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = function () { rej(new Error("Could not load " + src)); }; document.head.appendChild(s); });
  }

  function pay(o, a, btn) {
    btn.disabled = true;
    var gm = document.getElementById("gmsg");
    (window.Razorpay ? Promise.resolve() : loadScript("https://checkout.razorpay.com/v1/checkout.js"))
      .then(function () { return call("order", { course: o.product }); })
      .then(function (ord) {
        var rz = new window.Razorpay({
          key: ord.key_id, order_id: ord.order_id, amount: ord.amount, currency: ord.currency, name: "AIStudyTools", description: ord.title,
          prefill: { name: ord.name, email: ord.email, contact: ord.phone || "" }, theme: { color: "#4F46E5" },
          handler: function (r) {
            gm.innerHTML = note("Payment received. Unlocking your course…");
            call("verify", { order_id: r.razorpay_order_id, payment_id: r.razorpay_payment_id, signature: r.razorpay_signature })
              .then(function (j) { save(j.token); boot(); })
              .catch(function (e) { gm.innerHTML = note("We received your payment but could not confirm it yet (" + e.message + "). Please refresh in a minute; your access is saved against " + ord.email + ".", true); });
          },
          modal: { ondismiss: function () { btn.disabled = false; } }
        });
        rz.on("payment.failed", function (r) { gm.innerHTML = note("Payment failed: " + ((r.error && r.error.description) || "please try again") + ". No money was taken if this was declined.", true); btn.disabled = false; });
        rz.open();
      })
      .catch(function (e) { gm.innerHTML = note(e.message, true); btn.disabled = false; });
  }

  function unlock(a) {
    var bar = document.createElement("div");
    bar.className = "wrap noprint";
    bar.style.cssText = "font-size:13px;color:var(--faint);padding-top:8px;text-align:right";
    bar.innerHTML = "Signed in as " + esc(a.email) + (a.source === "allotted" ? " · faculty access" : "") + (a.expires ? " · access until " + day(a.expires) : "") + ' · <a href="#" id="gout2">Sign out</a>';
    app.parentNode.insertBefore(bar, app);
    document.getElementById("gout2").onclick = function (e) { e.preventDefault(); save(""); location.reload(); };
    app.innerHTML = '<p class="muted" style="text-align:center;margin:40px 0">Loading your course…</p>';
    call("vlinks?course=" + encodeURIComponent(COURSE)).then(function (v) { if (VG) window[VG] = v.videos || {}; }).catch(function () { if (VG) window[VG] = {}; })
      .then(function () {
        return fetch(API + "content?course=" + encodeURIComponent(COURSE), { headers: { Authorization: "Bearer " + tok } })
          .then(function (r) { if (!r.ok) return r.json().then(function (j) { throw new Error(j.error || "Could not load the course."); }); return r.text(); });
      })
      .then(function (code) {
        var s = document.createElement("script");
        s.src = URL.createObjectURL(new Blob([code], { type: "application/javascript" }));
        document.body.appendChild(s);
      })
      .catch(function (e) { shell("<h2>Could not load the course</h2>" + note(e.message, true) + '<p class="muted small" style="margin-top:10px">Please refresh the page. If this continues, contact us.</p>'); });
  }

  function boot() {
    app.innerHTML = '<p class="muted" style="text-align:center;margin:40px 0">Checking your access…</p>';
    call("access?course=" + encodeURIComponent(COURSE)).then(function (a) {
      if (!a.signed_in) { if (tok) save(""); signIn(a.offer); return; }
      if (a.access) unlock(a); else noAccess(a);
    }).catch(function (e) {
      if (e.status === 401) { save(""); return call("access?course=" + encodeURIComponent(COURSE)).then(function (a) { signIn(a.offer, "Your session has ended. Please sign in again."); }); }
      shell("<h2>" + esc(pageTitle) + "</h2>" + note("We could not reach the course server. Please check your connection and refresh.", true));
    });
  }
  boot();
})();
