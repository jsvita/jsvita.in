#!/usr/bin/env node
/* prep_preview.js — build gate-free preview copy of the site for local visual QA */
const fs = require("fs");
const path = require("path");

const MIRROR = "C:/Users/JSVita/AppData/Local/Temp/oldsite/mirror";
const DEST = "C:/Users/JSVita/Downloads/JSVita/.freebuff/preview_site";

fs.rmSync(DEST, { recursive: true, force: true });
fs.mkdirSync(DEST, { recursive: true });
fs.cpSync(path.join(MIRROR, "assets"), path.join(DEST, "assets"), { recursive: true });
try { fs.copyFileSync(path.join(MIRROR, "CNAME"), path.join(DEST, "CNAME")); } catch (e) {}
try { fs.copyFileSync(path.join(MIRROR, "shridhar-portrait.jpg"), path.join(DEST, "shridhar-portrait.jpg")); } catch (e) {}
try { fs.copyFileSync(path.join(MIRROR, "favicon.svg"), path.join(DEST, "favicon.svg")); } catch (e) {}
try { fs.copyFileSync(path.join(MIRROR, "sitemap.xml"), path.join(DEST, "sitemap.xml")); } catch (e) {}
try { fs.copyFileSync(path.join(MIRROR, "robots.txt"), path.join(DEST, "robots.txt")); } catch (e) {}
try { fs.copyFileSync(path.join(MIRROR, "jsvita-logo.svg"), path.join(DEST, "jsvita-logo.svg")); } catch (e) {}
try { fs.copyFileSync(path.join(MIRROR, "jsvita-og.png"), path.join(DEST, "jsvita-og.png")); } catch (e) {}
/* branded auth routes: jsvita/ directory */
if (fs.existsSync(path.join(MIRROR, "jsvita"))) fs.cpSync(path.join(MIRROR, "jsvita"), path.join(DEST, "jsvita"), { recursive: true });
try { fs.copyFileSync(path.join(MIRROR, "manifest.json"), path.join(DEST, "manifest.json")); } catch (e) {}

let h = fs.readFileSync(path.join(MIRROR, "index.html"), "utf8");
/* strip the jsgate splash div (redirects visitors to /login.html locally) */
const before1 = h.length;
h = h.replace(/<div id=jsgate>[\s\S]*?<\/div>\s*(?=<div id="root">)/, "");
/* strip the gate script block (v1 "access gate" and v2 "gate — splashless") */
const before2 = h.length;
h = h.replace(/<script>\s*\/\* JSVita (access )?gate[\s\S]*?<\/script>/, "");
fs.writeFileSync(path.join(DEST, "index.html"), h);
console.log("gate div removed:", before1 - h.length > 0, "| gate script removed:", before2 - h.length > 0);

/* login.html so the MEMBERS chip navigates somewhere real */
const LOGIN = "C:/Users/JSVita/Downloads/JSVita/login.html";
if (fs.existsSync(LOGIN)) fs.copyFileSync(LOGIN, path.join(DEST, "login.html"));
/* member dashboard — login redirects here after successful auth */
const DASH = "C:/Users/JSVita/Downloads/JSVita/dashboard.html";
if (fs.existsSync(DASH)) fs.copyFileSync(DASH, path.join(DEST, "dashboard.html"));
/* admin console */
const ADMIN = "C:/Users/JSVita/Downloads/JSVita/admin.html";
if (fs.existsSync(ADMIN)) fs.copyFileSync(ADMIN, path.join(DEST, "admin.html"));
/* post-login welcome screen */
const WELCOME = "C:/Users/JSVita/Downloads/JSVita/welcome.html";
if (fs.existsSync(WELCOME)) fs.copyFileSync(WELCOME, path.join(DEST, "welcome.html"));
/* Phase 1.1: cv.html / cv-print.html / connect.html deleted — no longer copied */
/* founder page (Phase 2 — About Founder) + company about page (JSVita 1.0) */
const FOUNDER = "C:/Users/JSVita/Downloads/JSVita/founder.html";
if (fs.existsSync(FOUNDER)) fs.copyFileSync(FOUNDER, path.join(DEST, "founder.html"));
const ABOUT = "C:/Users/JSVita/Downloads/JSVita/about.html";
if (fs.existsSync(ABOUT)) fs.copyFileSync(ABOUT, path.join(DEST, "about.html"));
/* shared runtime (Phase 7) — tracking, Clarity, Calendly modal */
const COMMON = "C:/Users/JSVita/Downloads/JSVita/jsv-common.js";
if (fs.existsSync(COMMON)) fs.copyFileSync(COMMON, path.join(DEST, "jsv-common.js"));
/* dedicated service pages (Phase 7) + lead-gen pages (Phase 8) + Phase 8 studio pages */
for (const SVC of ["web-development.html", "ai-automation.html", "branding.html", "consultation.html", "thankyou.html", "finance.html", "finance-taxation.html", "finance-gst.html", "finance-accounting.html", "finance-compliance.html", "finance-setup.html", "finance-audit.html", "business-websites.html", "startup-websites.html", "portfolio-websites.html", "landing-pages.html", "website-redesign.html", "website-maintenance.html", "ca-services.html", "web-solutions.html", "meta-ads.html", "lead-generation.html", "ad-creative-design.html", "portfolio.html", "case-studies.html", "contact.html", "case-arka-retail.html", "case-krishnan-interiors.html", "case-patel-co.html", "case-arka-ads.html", "case-krishnan-creative.html", "case-jsvita-platform.html"]) {
  const SRC = path.join("C:/Users/JSVita/Downloads/JSVita", SVC);
  if (fs.existsSync(SRC)) fs.copyFileSync(SRC, path.join(DEST, SVC));
}
/* operations surfaces — CRM, client portal, invoices, proposal templates */
for (const OPS of ["admin-crm.html", "portal.html", "invoice.html", "proposal-business-website.html", "proposal-landing-page.html", "proposal-website-redesign.html", "proposal-meta-ads.html", "proposal-website-maintenance.html", "proposal-ca-services.html"]) {
  const OSRC = path.join("C:/Users/JSVita/Downloads/JSVita", OPS);
  if (fs.existsSync(OSRC)) fs.copyFileSync(OSRC, path.join(DEST, OPS));
}
/* legal pages (privacy/terms live in the mirror; refund/cookie in the workspace) */
for (const LEGAL of ["privacy.html", "terms.html", "refund-policy.html", "cookie-policy.html"]) {
  const msrc = path.join(MIRROR, LEGAL);
  const wsrc = path.join("C:/Users/JSVita/Downloads/JSVita", LEGAL);
  if (fs.existsSync(msrc)) fs.copyFileSync(msrc, path.join(DEST, LEGAL));
  else if (fs.existsSync(wsrc)) fs.copyFileSync(wsrc, path.join(DEST, LEGAL));
}
/* resume PDF removed — Download PDF now live-exports from cv.html (Save as PDF) */
console.log("preview_site built at", DEST);
