#!/usr/bin/env node
/* patch_phase8b.js — JSVITA 2.1 era: integrity check on the static homepage.
   Historical work already lives in make_home.js (single source of truth for
   the mirror page); this script now greps compiled output for regressions
   and exits non-zero if any banned agency-era token shows up. */
const fs = require("fs");
const INDEX = "C:/Users/JSVita/AppData/Local/Temp/oldsite/mirror/index.html";
let h = fs.readFileSync(INDEX, "utf8");
/* scan rendered output: strip scripts/styles/comments + collapse whitespace
   (otherwise cleanup detectors inside the runtime script match their own needles) */
h = h.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<!--[\s\S]*?-->/g, "");
const banned = [
  ["Web Solutions</a>", "nav Web Solutions link"],
  ["agency", "agency token"],
  ["Growth agency", "agency phrase"],
  ["growth solutions", "agency-era SEO copy"],
  ["Meta Ads", "marketing jargon"],
  ["Start a Project", "legacy CTA text"],
  ["Free Consultation", "legacy CTA text"]
];
let bad = 0;
for (const [needle, label] of banned) {
  if (h.includes(needle)) { console.log("REGRESSION:", label, "->", needle); bad++; }
}
const want = [
  "Building Premium Digital Systems",
  "What We Build",
  "Selected Work",
  "Technology Stack",
  "Why Companies Choose JSVita",
  "Built by Shridhar John",
  "Let's Build Something Extraordinary",
  "Book Strategy Call",
  "View Projects",
  "Request Proposal"
];
const missing = want.filter(w => !h.includes(w));
console.log("mirror index bytes:", h.length, "| sections:", (h.match(/<section/g) || []).length);
if (bad === 0 && missing.length === 0) {
  console.log("patch_phase8b: OK — JSVITA 2.1 homepage verified, no agency-era tokens");
} else {
  if (missing.length) console.log("MISSING 2.1 SECTIONS:", missing.join(" | "));
  console.log("patch_phase8b: FAILURES=" + (bad + missing.length));
  process.exit(1);
}
