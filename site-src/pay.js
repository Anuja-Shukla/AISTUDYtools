/* AIStudyTools paid-course enrolment (Razorpay Checkout + payment server). No secrets here. */
(function () {
  var box = document.getElementById("pay_box");
  if (!box) return;
  var API = (box.getAttribute("data-api") || "").replace(/\/+$/, "");
  var COURSE = box.getAttribute("data-course");
  var PASS = "ast_pass_" + COURSE;
  var cfg = null;

  function $(id) { return document.getElementById(id); }
  function track(name, params) { try { if (window.gtag) window.gtag("event", name, params); } catch (e) {} }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function getPass() { try { return JSON.parse(localStorage.getItem(PASS) || "null"); } catch (e) { return null; } }
  function setPass(p) { try { localStorage.setItem(PASS, JSON.stringify(p)); } catch (e) {} }
  function msg(id, text, ok) { var el = $(id); if (el) { el.textContent = text || ""; el.className = "pay-msg" + (ok ? " ok" : ""); } }
  function rupees(paise) { return "₹" + (paise / 100).toLocaleString("en-IN"); }
  function post(path, data) {
    return fetch(API + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || "Request failed"); return j; }); });
  }

  function soon(text) {
    box.innerHTML = '<h3>Enrolment opens soon</h3><p class="muted" style="margin-top:6px">' + esc(text || "We are finalising this course. Leave your details and we will tell you when enrolment opens.") + '</p><a class="btn btn-accent" style="margin-top:14px" href="#demo:Courses">Register interest</a>';
  }

  function enrolled(p) {
    box.innerHTML = '<span class="tag mint">Enrolled ✓</span><h3 style="margin-top:10px">You are enrolled in ' + esc(cfg ? cfg.title : "this course") + '</h3>' +
      '<p class="muted" style="margin-top:6px">Email: <b>' + esc(p.email) + '</b><br>Payment ID: <b>' + esc(p.payment_id) + '</b></p>' +
      '<p class="small muted" style="margin-top:8px">Keep your payment ID: with your email it restores access on another device or browser.</p>' +
      '<div id="pay_content" class="pay-msg" style="margin-top:12px"></div>';
    fetch(API + "/api/content?course=" + encodeURIComponent(COURSE), { headers: { Authorization: "Bearer " + p.token } })
      .then(function (r) {
        var el = $("pay_content");
        if (r.ok) el.innerHTML = '<a class="btn btn-ink" href="learn/">Start the course →</a>';
        else if (r.status === 404) el.textContent = "The course will open here on launch day. We will also email you.";
        else if (r.status === 401) { try { localStorage.removeItem(PASS); } catch (e) {} el.textContent = "Your access could not be confirmed. Please use Restore access below."; }
      }).catch(function () {});
  }

  function form() {
    box.innerHTML = '<div class="pay-price"><b>' + rupees(cfg.amount) + '</b><span>one-time · lifetime access · certificate</span></div>' +
      '<div class="field" style="margin-top:14px"><label for="pay_name">Full name (as it should appear on your certificate)</label><input id="pay_name" autocomplete="name" maxlength="80"></div>' +
      '<div class="field" style="margin-top:12px"><label for="pay_email">Email</label><input id="pay_email" type="email" autocomplete="email" maxlength="254"></div>' +
      '<div class="field" style="margin-top:12px"><label for="pay_phone">Mobile (optional, for the payment form)</label><input id="pay_phone" type="tel" autocomplete="tel" maxlength="15"></div>' +
      '<label class="small" style="display:flex;gap:8px;align-items:flex-start;margin-top:12px"><input type="checkbox" id="pay_agree" style="margin-top:4px"> <span>I agree to the <a href="/terms/">Terms</a> and the <a href="/refund-policy/">Refund policy</a>.</span></label>' +
      '<button class="btn btn-ink" type="button" id="pay_go" style="margin-top:14px;width:100%;justify-content:center">Pay ' + rupees(cfg.amount) + ' and enrol</button>' +
      '<p id="pay_msg" class="pay-msg" role="status"></p>' +
      '<p class="small muted" style="margin-top:10px">Payments are processed securely by Razorpay (UPI, cards, net banking, wallets). We never see your card or bank details.</p>';
    $("pay_go").onclick = buy;
  }

  function loadCheckout() {
    return new Promise(function (res, rej) {
      if (window.Razorpay) return res();
      var s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = function () { res(); };
      s.onerror = function () { rej(new Error("Could not load the payment window. Check your connection and try again.")); };
      document.head.appendChild(s);
    });
  }

  function buy() {
    var name = $("pay_name").value.trim(), email = $("pay_email").value.trim(), phone = $("pay_phone").value.trim();
    if (!name) return msg("pay_msg", "Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return msg("pay_msg", "Please enter a valid email address.");
    if (!$("pay_agree").checked) return msg("pay_msg", "Please accept the Terms and Refund policy.");
    var btn = $("pay_go"); btn.disabled = true; msg("pay_msg", "Opening the payment window…", true);
    track("begin_checkout", { currency: "INR", value: cfg ? cfg.amount / 100 : 0, items: [{ item_id: COURSE, item_name: cfg ? cfg.title : COURSE }] });
    Promise.all([post("/api/order", { course: COURSE, name: name, email: email, phone: phone }), loadCheckout()])
      .then(function (r) {
        var o = r[0];
        var rz = new window.Razorpay({
          key: o.key_id, order_id: o.order_id, amount: o.amount, currency: o.currency,
          name: "AIStudyTools", description: o.title + " course",
          prefill: { name: name, email: email, contact: phone },
          notes: { course: COURSE },
          theme: { color: "#4F46E5" },
          handler: function (resp) {
            msg("pay_msg", "Payment received. Confirming…", true);
            post("/api/verify", { order_id: resp.razorpay_order_id, payment_id: resp.razorpay_payment_id, signature: resp.razorpay_signature })
              .then(function (v) { var p = { token: v.token, email: v.email, payment_id: v.payment_id }; setPass(p); track("purchase", { transaction_id: v.payment_id, currency: "INR", value: cfg ? cfg.amount / 100 : 0, items: [{ item_id: COURSE, item_name: cfg ? cfg.title : COURSE }] }); enrolled(p); })
              .catch(function () { btn.disabled = false; msg("pay_msg", "Your payment went through but we could not confirm it yet. Use Restore access below with your email and payment ID " + resp.razorpay_payment_id + ", or contact us."); });
          },
          modal: { ondismiss: function () { btn.disabled = false; msg("pay_msg", "Payment window closed. No money was taken unless you completed the payment."); } }
        });
        rz.on("payment.failed", function (e) { btn.disabled = false; msg("pay_msg", "Payment failed: " + ((e && e.error && e.error.description) || "please try again") + "."); });
        rz.open();
      })
      .catch(function (e) { btn.disabled = false; msg("pay_msg", e.message); });
  }

  var rb = document.getElementById("rs_go");
  if (rb) rb.onclick = function () {
    var email = $("rs_email").value.trim(), pid = $("rs_pid").value.trim();
    if (!API) return msg("rs_msg", "Enrolment is not open yet.");
    rb.disabled = true; msg("rs_msg", "Checking…", true);
    post("/api/restore", { course: COURSE, email: email, payment_id: pid })
      .then(function (v) { var p = { token: v.token, email: v.email, payment_id: v.payment_id }; setPass(p); msg("rs_msg", "Access restored ✓", true); enrolled(p); box.scrollIntoView({ behavior: "smooth", block: "center" }); })
      .catch(function (e) { msg("rs_msg", e.message); })
      .then(function () { rb.disabled = false; });
  };

  if (!API) return soon();
  fetch(API + "/api/config?course=" + encodeURIComponent(COURSE))
    .then(function (r) { return r.json(); })
    .then(function (c) {
      cfg = c;
      var p = getPass();
      if (p && p.token) return enrolled(p);
      if (!c.open) return soon();
      form();
    })
    .catch(function () { var p = getPass(); if (p && p.token) return enrolled(p); soon("Enrolment is temporarily unavailable. Please try again in a few minutes."); });
})();
