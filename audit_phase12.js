#!/usr/bin/env node
/* audit_phase12.js — Phase 1.2 final audit: SEO, schema, a11y, legacy traces.
   Scans every generated .html file in the workspace (excluding internal tools). */
const fs = require("fs");
const path = require("path");
const SRC = __dirname;
const SKIP = new Set(["admin.html", "dashboard.html", "login.html", "welcome.html", "reel.html", "terms.html", "privacy.html", "consultation.html", "refund-policy.html", "cookie-policy.html",
  /* private operations surfaces (noindex, gated): not public SEO pages */
  "admin-crm.html", "portal.html", "invoice.html", "proposal-business-website.html", "proposal-landing-page.html", "proposal-website-redesign.html", "proposal-meta-ads.html", "proposal-website-maintenance.html", "proposal-ca-services.html",
  /* legacy workspace copies — deleted from deploy at Phase 1.1/1.2 */
  "connect.html", "cv.html", "cv-print.html",
  /* non-production workspace extras (not in deploy repo, not in sitemap) */
  "jsvita_3d.html", "thankyou.html"]);
let files = fs.readdirSync(SRC).filter(f => f.endsWith(".html") && !SKIP.has(f));
let issues = [];
let checks = { pages: files.length, h1: 0, title: 0, desc: 0, canonical: 0, og: 0, tw: 0, jsonld: 0, crumbs: 0, common: 0 };
const LEGACY = [
  [/cv\.html|cv-print\.html|connect\.html/i, "legacy page link"],
  [/Shridhar-John-CV/i, "CV file reference"],
  [/\bCV\b/, "CV token"],
  [/\bResume\b/i, "Resume token"],
  [/\bStudent\b/i, "Student token"],
  [/og-image\.png/, "legacy og-image"],
];
for (const f of files) {
  const raw = fs.readFileSync(path.join(SRC, f), "utf8");
  /* scan rendered content: strip scripts, styles and comments; collapse whitespace (multi-line meta tags) */
  const html = raw.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<!--[\s\S]*?-->/g, "").replace(/\s+/g, " ");
  const jsonldRaw = (raw.match(/application\/ld\+json/g) || []).length;
  const tag = (re) => (html.match(re) || []).length;
  const h1 = tag(/<h1[ >]/g), title = tag(/<title[ >]/g), desc = tag(/<meta[^>]*name="description"/g);
  const canon = tag(/<link[^>]*rel="canonical"/g), og = tag(/<meta[^>]*property="og:(title|description|image|url)"/g);
  const tw = tag(/<meta[^>]*name="twitter:(card|title|description|image)"/g);
  const ldCount = jsonldRaw, crumb = raw.includes("BreadcrumbList");
  const common = raw.includes("/jsv-common.js");
  checks.h1 += h1; checks.title += title; checks.desc += desc; checks.canonical += canon;
  checks.og += og; checks.tw += tw; checks.jsonld += ldCount; checks.crumbs += crumb ? 1 : 0; checks.common += common ? 1 : 0;
  if (h1 !== 1) issues.push(`${f}: ${h1} H1 tags`);
  if (title !== 1) issues.push(`${f}: ${title} title tags`);
  if (desc !== 1) issues.push(`${f}: ${desc} meta descriptions`);
  if (!canon) issues.push(`${f}: no canonical`);
  if (og < 4) issues.push(`${f}: incomplete OG (${og}/4)`);
  if (tw < 4) issues.push(`${f}: incomplete Twitter (${tw}/4)`);
  if (ldCount < 1) issues.push(`${f}: no JSON-LD`);
  if (!common) issues.push(`${f}: jsv-common.js missing`);
  if (!/<link[^>]+rel="icon"|favicon/.test(html)) issues.push(`${f}: favicon ref missing`);
  for (const [re, label] of LEGACY) {
    if (re.test(html)) {
      const m = html.match(re);
      issues.push(`${f}: LEGACY ${label} -> ${JSON.stringify(m[0])}`);
    }
  }
  /* alt text on <img> (rendered imgs only) */
  const imgs = html.match(/<img[^>]*>/g) || [];
  for (const img of imgs) if (!/alt=/.test(img)) issues.push(`${f}: <img> without alt: ${img.slice(0, 80)}`);
}
/* contact-specific */
const contact = fs.readFileSync(path.join(SRC, "contact.html"), "utf8");
if (!contact.includes("hello@jsvita.in")) issues.push("contact.html: hello@jsvita.in missing");
if (!contact.includes("Budget Range")) issues.push("contact.html: Budget Range missing");
if (!contact.includes("Expected Timeline")) issues.push("contact.html: Expected Timeline missing");
if (!contact.includes("Project Timeline")) issues.push("contact.html: Project Timeline missing");
if (!contact.includes("Preferred Contact Method")) issues.push("contact.html: Preferred Contact Method missing");
/* footer email on generated pages */
const biz = fs.readFileSync(path.join(SRC, "business-websites.html"), "utf8");
if (!biz.includes("support@jsvita.in")) issues.push("business-websites.html: support@jsvita.in missing in footer");
/* case page structure check */
const casePage = fs.readFileSync(path.join(SRC, "case-arka-retail.html"), "utf8");
for (const s of ["Overview", "Challenge", "Research", "Design Process", "Development Process", "Technology Stack", "Outcome", "Lessons Learned", "Project Gallery", "Project Status"]) {
  if (!casePage.includes(s)) issues.push(`case-arka-retail.html: section "${s}" missing`);
}
/* sitemap legacy check */
const sm = fs.readFileSync(path.join(SRC, "sitemap.xml"), "utf8");
if (/connect\.html|cv\.html|cv-print\.html/.test(sm)) issues.push("sitemap.xml: legacy URLs present");

/* ---- Quality check: duplicate titles / descriptions (Duplicate Content = 0) ---- */
const titleMap = {}, descMap = {};
for (const f of files) {
  const raw = fs.readFileSync(path.join(SRC, f), "utf8");
  const t = (raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1];
  const d = (raw.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/) || raw.match(/<meta[^>]*content="([^"]*)"[^>]*name="description"/) || [])[1];
  if (t) { const k = t.trim(); (titleMap[k] = titleMap[k] || []).push(f); }
  if (d) { const k = d.trim(); (descMap[k] = descMap[k] || []).push(f); }
}
for (const [k, fl] of Object.entries(titleMap)) if (fl.length > 1) issues.push("DUPLICATE TITLE -> " + fl.join(", "));
for (const [k, fl] of Object.entries(descMap)) if (fl.length > 1) issues.push("DUPLICATE DESCRIPTION -> " + fl.join(", "));

/* ---- Quality check: broken internal links + anchors (Broken Links = 0, 404 = 0) ---- */
const RUNTIME_IDS = new Set(["home", "solutions", "projects", "work", "technology", "about", "contact", "founder", "top", "skills", "services", "process", "faq", "why", "why-choose", "pricing", "trust", "trust-cards", "meta-ads", "testimonials", "jsv-stats", "consult", "divisions", "vision", "leadership", "experience", "story"]);
function pageExists(p) {
  if (!p || p === "/") return true;
  const rel = p.replace(/^\//, "");
  if (fs.existsSync(path.join(SRC, rel))) return true; /* exact asset/file (favicon.svg, icon-512.png…) */
  return fs.existsSync(path.join(SRC, rel + ".html")); /* pretty URL -> page */
}
for (const f of files) {
  const raw = fs.readFileSync(path.join(SRC, f), "utf8");
  const rendered = raw.replace(/<script[\s\S]*?<\/script>/gi, "");
  const hrefs = [...new Set([...rendered.matchAll(/href="([^"]*)"/g)].map(m => m[1]))];
  for (const h of hrefs) {
    if (!h || /^(https?:|mailto:|tel:|data:)/.test(h)) continue;
    if (h.startsWith("/assets/")) continue; /* Vite build assets — verified in the deploy repo */
    const [p, frag] = h.split("#");
    if (p && !pageExists(p)) { issues.push("BROKEN LINK in " + f + " -> " + h); continue; }
    if (frag) {
      const target = p === "" || p === "/" ? "index.html" : p.replace(/^\//, "") + ".html";
      if (RUNTIME_IDS.has(frag) && (target === "index.html")) continue;
      const tr = fs.readFileSync(path.join(SRC, target), "utf8");
      if (!new RegExp("id=\"" + frag + "\"").test(tr) && !(target === "index.html" && RUNTIME_IDS.has(frag))) issues.push("BROKEN ANCHOR in " + f + " -> " + h);
    }
  }
}

/* ---- Quality check: fake testimonials never render (homepage) ---- */
const MIRROR2 = path.join(process.env.APPDATA || "", "..", "Local", "Temp", "oldsite", "mirror", "index.html");
const mIdx2 = fs.readFileSync(MIRROR2, "utf8").replace(/<script[\s\S]*?<\/script>/gi, "");
if (/Client Stories Coming Soon|placeholder review|invented testimonial/i.test(mIdx2)) issues.push("mirror/index.html: fake/placeholder testimonial copy present");
/* homepage = patched mirror (workspace index.html is the pre-patch React source) */
const MIRROR = path.join(process.env.APPDATA || "", "..", "Local", "Temp", "oldsite", "mirror", "index.html");
const mirrorRaw = fs.readFileSync(MIRROR, "utf8");
const mirrorIdx = mirrorRaw.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<!--[\s\S]*?-->/g, "").replace(/\s+/g, " ");
const mChecks = {
  title: (mirrorIdx.match(/<title[ >]/g) || []).length,
  desc: (mirrorIdx.match(/<meta[^>]*name="description"/g) || []).length,
  canon: (mirrorIdx.match(/<link[^>]*rel="canonical"/g) || []).length,
  og: (mirrorIdx.match(/<meta[^>]*property="og:(title|description|image|url)"/g) || []).length,
  tw: (mirrorIdx.match(/<meta[^>]*name="twitter:(card|title|description|image)"/g) || []).length,
  ld: (mirrorRaw.match(/application\/ld\+json/g) || []).length
};
if (mChecks.title !== 1) issues.push("mirror/index.html: " + mChecks.title + " title tags");
if (mChecks.desc !== 1) issues.push("mirror/index.html: " + mChecks.desc + " meta descriptions");
if (!mChecks.canon) issues.push("mirror/index.html: no canonical");
if (mChecks.og < 4) issues.push("mirror/index.html: incomplete OG (" + mChecks.og + "/4)");
if (mChecks.tw < 4) issues.push("mirror/index.html: incomplete Twitter (" + mChecks.tw + "/4)");
if (mChecks.ld < 1) issues.push("mirror/index.html: no JSON-LD");
if (/cv\.html|cv-print\.html|connect\.html|Shridhar-John-CV|og-image\.png/.test(mirrorIdx)) issues.push("mirror/index.html: legacy reference present");
if (mirrorIdx.includes("Web Solutions</a>") || mirrorIdx.includes("Growth Solutions")) issues.push("mirror/index.html: agency-era nav/copy regression");
console.log("=== PHASE 1.2 AUDIT ===");
console.log(JSON.stringify(checks));
console.log("mirror index:", JSON.stringify(mChecks));
/* JSVITA 2.1: the company leads with its own systems — CA Services and
   growth-agency menus are retired from the primary navigation by design. */
if (issues.length) { console.log("ISSUES (" + issues.length + "):"); issues.forEach(i => console.log("  - " + i)); process.exitCode = 1; }
else console.log("ALL CHECKS PASSED (" + files.length + " pages)");
