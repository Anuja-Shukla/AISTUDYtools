/* Lesson 1.2 — Equations */
var META = { crumb: "CA Foundation · Quantitative Aptitude · <b>Equations</b>" };
var SCENES = [
  introScene("Equations", "CA Foundation · Quantitative Aptitude · Lesson 1.2", ["Linear", "Simultaneous", "Quadratic", "Cubic"]),
  { tag: "Linear equations", draw: function () {
    return T("What is an equation?") + sp(30) + note("Left side = right side", 0.15, true) + sp(30) +
      eq("2x + 5 = 17", 0.55, 46) + down(0.65, "− 5") + eq("2x = 12", 0.7, 46) + down(0.78, "÷ 2") + boxed("x = 6", 0.85);
  } },
  { tag: "Linear equations", draw: function () {
    return T("Break-even at Kiran Traders") + sp(40) + '<div class="row" style="gap:22px">' + cardT("Selling price", "₹50", "per chair", 0.12, 230, "var(--teal)") + cardT("Variable cost", "₹30", "per chair", 0.32, 230, "var(--orange)") + cardT("Fixed cost", "₹10,000", "per month", 0.5, 230) + "</div>" + sp(36) + note("How many chairs to break even?", 0.78);
  } },
  { tag: "Linear equations", draw: function () {
    return T("Break-even: revenue = cost") + sp(30) + eq('<span class="t">50x</span> = <span class="o">30x + 10,000</span>', 0.12, 44) + down(0.4, "− 30x") + eq("20x = 10,000", 0.45, 44) + down(0.62, "÷ 20") + boxed("x = 500 chairs", 0.68);
  } },
  { tag: "Simultaneous equations", draw: function () {
    return T("Two unknowns, two equations") + sp(50) + card(eq("2x + 3y = 13", 0.25, 44) + eq("3x − y = 3", 0.55, 44), 0.2, 480);
  } },
  { tag: "Simultaneous equations", draw: function () {
    return T("Substitute") + sp(16) + eq('3x − y = 3 &nbsp;⟹&nbsp; <span class="o">y = 3x − 3</span>', 0.05, 34) + down(0.22) + eq("2x + 3(3x − 3) = 13", 0.25, 36) + eq("2x + 9x − 9 = 13", 0.4, 36) + eq("11x = 22 &nbsp;⟹&nbsp; x = 2", 0.58, 36) + sp(12) + boxed("x = 2, y = 3", 0.8);
  } },
  { tag: "Simultaneous equations", draw: function () {
    return T("Check in both equations") + sp(40) + card(eq('2(2) + 3(3) = 13 <span class="t">✓</span>', 0.1, 38) + eq('3(2) − 3 = 3 <span class="t">✓</span>', 0.3, 38), 0.05, 520) + sp(34) +
      '<div class="row">' + note("Elimination", 0.6, true) + note("Substitution", 0.65, true) + note("Cramer's rule", 0.7, true) + "</div>";
  } },
  { tag: "Quadratic equations", draw: function () {
    return T("Quadratic equations") + sp(30) + eq('ax² + bx + c = 0 &nbsp;<span class="m" style="font-size:26px">(a ≠ 0)</span>', 0.1, 46) + sp(36) + boxed("x = [ −b ± √(b² − 4ac) ] ÷ 2a", 0.6, 40);
  } },
  { tag: "Quadratic equations", draw: function () {
    return T("Solve x² − 5x + 6 = 0") + sp(14) + '<div class="row">' + pill("a = 1", 0.05, "l") + pill("b = −5", 0.08, "l") + pill("c = 6", 0.11, "l") + "</div>" + sp(16) +
      eq("D = b² − 4ac = 25 − 24 = 1", 0.15, 38) + eq("x = (5 ± √1) ÷ 2", 0.45, 38) + sp(10) + '<div class="row" style="gap:20px">' + boxed("x = 3", 0.72) + boxed("x = 2", 0.76) + "</div>";
  } },
  { tag: "Quadratic equations", draw: function () {
    return T("The discriminant D = b² − 4ac") + sp(36) + '<div class="row" style="gap:20px;align-items:stretch">' +
      cardT("D &gt; 0", "Two real roots", "unequal (rational if D is a perfect square)", 0.25, 255, "var(--teal)") + cardT("D = 0", "Equal roots", "one repeated value", 0.55, 255, "var(--orange)") + cardT("D &lt; 0", "No real roots", "complex (imaginary)", 0.75, 255) + "</div>";
  } },
  { tag: "Quadratic equations", draw: function () {
    return T("Sum and product of roots") + sp(24) + '<div class="row" style="gap:22px">' + cardT("Sum α + β", "−b/a", "3 + 2 = 5", 0.08, 280, "var(--teal)") + cardT("Product αβ", "c/a", "3 × 2 = 6", 0.28, 280, "var(--orange)") + "</div>" + sp(30) +
      boxed("x² − (sum)x + product = 0", 0.66, 34);
  } },
  { tag: "Cubic equations", draw: function () {
    return T("Cubics: find one root, then divide") + sp(20) + eq("x³ − 6x² + 11x − 6 = 0", 0.05, 38) + eq('Try x = 1: &nbsp;1 − 6 + 11 − 6 = 0 <span class="t">✓</span>', 0.25, 32) + down(0.42, "÷ (x − 1)") + eq("x² − 5x + 6 = 0", 0.5, 38) + sp(10) + boxed("Roots: 1, 2, 3", 0.78);
  } },
  mcqScene("One root of x² − kx + 8 = 0 is 2. What is k?", ["6", "4", "8", "10"], 0, "Product of roots = 8, so the other root is 4. Sum = 2 + 4 = 6 = k."),
  recapScene([["Solve, then check", "substitute back"], ["Quadratic formula", "x = [−b ± √D]/2a"], ["Read the discriminant", "D = b² − 4ac"], ["Sum and product", "−b/a and c/a"]])
];
