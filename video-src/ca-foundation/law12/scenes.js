/* Business Laws Lesson 1.2 — Nature of Contracts */
var META = { crumb: "CA Foundation · Business Laws · <b>Nature of Contracts</b>" };
function timeline(at) {
  var W = 760, H = 200, xs = [60, 290, 450, 700], lb = [["1 June", "Offer posted"], ["4 June", "Acceptance posted"], ["5 June", "Revocation"], ["7 June", "Reaches Ravi"]], s = '<line x1="30" y1="90" x2="' + (W - 30) + '" y2="90" stroke="#1E2A47" stroke-width="4"/>';
  xs.forEach(function (x, i) { var q = k(at + i * 0.12), c = i === 1 ? "#1F9A94" : i === 2 ? "#F28C28" : "#1E2A47"; s += '<g opacity="' + q + '"><circle cx="' + x + '" cy="90" r="13" fill="' + c + '"/><text x="' + x + '" y="55" text-anchor="middle" font-size="22" font-weight="800" fill="' + c + '" font-family="Outfit">' + lb[i][0] + '</text><text x="' + x + '" y="135" text-anchor="middle" font-size="18" font-weight="600" fill="#4A5370" font-family="Outfit">' + lb[i][1] + "</text></g>"; });
  return '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '">' + s + "</svg>";
}
var SCENES = [
  introScene("Nature of Contracts", "CA Foundation · Business Laws · Lesson 1.2", ["Offer", "Acceptance", "Essentials", "Classification"]),
  { tag: "Definitions", draw: function () {
    return T("From proposal to contract") + sp(36) + '<div class="row" style="gap:6px">' + pill("Proposal", 0.08) + arrow(0.2) + pill("Promise", 0.28, "n") + arrow(0.4) + pill("Agreement", 0.48) + arrow(0.6) + pill("Contract", 0.68, "n") + "</div>" + sp(30) + note("Contract = agreement + enforceability (s.2(h))", 0.82);
  } },
  { tag: "Definitions", draw: function () {
    return T("Every contract is an agreement…") + sp(30) + '<div class="row" style="gap:24px;align-items:stretch">' + cardT("Agreement only", "Dinner with a friend", "no intention to create legal relations", 0.15, 340, "var(--muted)") + cardT("Contract", "Buying a car for ₹6 lakh", "enforceable by law", 0.5, 340, "var(--teal)") + "</div>";
  } },
  { tag: "Section 10", draw: function () {
    return T("The essentials of a valid contract") + sp(22) + listOf([["Free consent", "ss.13–22"], ["Competent parties", "ss.11–12"], ["Lawful consideration", "s.2(d), s.23"], ["Lawful object", "s.23"], ["Not expressly declared void", "ss.24–30"]], 0.08, 0.15, 700, 25);
  } },
  { tag: "Offer", draw: function () {
    return T("Offer or invitation to offer?") + sp(28) + '<div class="row" style="gap:24px;align-items:stretch">' + cardT("Invitation to offer", "Price list · shop display", "the customer makes the offer", 0.12, 340, "var(--orange)") + cardT("General offer", "Reward notice", "accepted by performing it", 0.5, 340, "var(--teal)") + "</div>";
  } },
  { tag: "Acceptance", draw: function () {
    return T("Acceptance must be absolute (s.7)") + sp(30) + boxed("“I accept, but at ₹500 less”", 0.12, 30) + sp(24) + down(0.4) + sp(10) + note("Counter-offer: the original offer is rejected", 0.55);
  } },
  { tag: "Postal rule", draw: function () {
    return T("Ravi and Neha") + sp(30) + timeline(0.1);
  } },
  { tag: "Postal rule", draw: function () {
    return T("When is acceptance complete? (s.4)") + sp(20) + timeline(-1) + sp(16) + eq("Against Ravi: when posted, <span class='t'>4 June</span>", 0.15, 26) + eq("Revocation on 5 June: <span class='o'>too late</span>", 0.45, 26) + sp(10) + boxed("A binding contract exists", 0.72, 28);
  } },
  { tag: "Classification", draw: function () {
    return T("Five outcomes") + sp(26) + grid([["Valid", "Enforceable", "all essentials"], ["Void", "No effect", "s.2(g)"], ["Voidable", "At one party's option", "s.2(i)"], ["Illegal", "Void + tainted", "forbidden by law"], ["Unenforceable", "Technical defect", "e.g. not stamped"]], 3, 0.1, 0.12, 240);
  } },
  mcqScene("A contract made under coercion is…", ["Voidable at the option of the party coerced", "Void from the start", "Illegal", "Valid and binding"], 0, "Section 19: consent caused by coercion makes the contract voidable."),
  recapScene([["Contract", "agreement enforceable by law"], ["Section 10", "test every essential"], ["Acceptance", "absolute and unqualified"], ["Postal rule", "binds the offerer when posted"]], "Now try the contract checker below ↓")
];
