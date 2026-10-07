#!/usr/bin/env node
/* update_sitemap.js — add the Phase 8 + 8.2 pages to sitemap.xml (workspace + mirror), idempotent per URL. */
const fs = require("fs");
const FILES = [
  "C:/Users/JSVita/Downloads/JSVita/sitemap.xml",
  "C:/Users/JSVita/AppData/Local/Temp/oldsite/mirror/sitemap.xml"
];
/* [slug, priority] — checked/added individually so partial states heal themselves */
const URLS = [
  ["business-websites", "0.8"],
  ["startup-websites", "0.8"],
  ["portfolio-websites", "0.8"],
  ["landing-pages", "0.8"],
  ["website-redesign", "0.8"],
  ["website-maintenance", "0.8"],
  ["ca-services", "1.0"],
  ["web-solutions", "1.0"],
  ["portfolio", "0.9"],
  ["case-studies", "0.8"],
  ["contact", "0.8"],
  ["case-arka-retail", "0.7"],
  ["case-krishnan-interiors", "0.7"],
  ["case-patel-co", "0.7"],
  ["case-arka-ads", "0.7"],
  ["case-krishnan-creative", "0.7"],
  ["case-jsvita-platform", "0.7"],
  ["about", "0.8"],
  ["meta-ads", "0.8"],
  ["lead-generation", "0.8"],
  ["ad-creative-design", "0.8"]
];
/* Phase 2.1 + 1.1: legacy personal pages leave the sitemap (idempotent removal) */
const REMOVE = ["connect", "cv", "cv-print"];
const anchor = "<url><loc>https://jsvita.in/consultation</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>";
for (const f of FILES) {
  let s = fs.readFileSync(f, "utf8");
  const eol = s.indexOf("\r\n") !== -1 ? "\r\n" : "\n";
  if (s.indexOf(anchor) === -1) { console.error(f + ": anchor not found"); process.exit(1); }
  let added = 0, removed = 0;
  for (const slug of REMOVE) {
    const re = new RegExp("\\s*<url><loc>https://jsvita\\.in/" + slug + "</loc>(?:(?!</url>)[\\s\\S])*?</url>", "");
    if (re.test(s)) { s = s.replace(re, ""); removed++; }
  }
  for (const [slug, pr] of URLS) {
    if (s.indexOf("jsvita.in/" + slug) !== -1) continue;
    const entry = "<url><loc>https://jsvita.in/" + slug + "</loc><changefreq>monthly</changefreq><priority>" + pr + "</priority></url>";
    s = s.replace(anchor, anchor + eol + "  " + entry);
    added++;
  }
  fs.writeFileSync(f, s);
  const n = (s.match(/<url>/g) || []).length;
  console.log(f.split("/").pop() + ": +" + added + " -" + removed + " -> now " + n + " URLs (eol=" + (eol === "\r\n" ? "CRLF" : "LF") + ")");
}
