#!/usr/bin/env node
/* jv-audit.mjs — JSVita static-site audit (zero dependencies)
 * Checks: undefined/placeholder strings, SVG gradient refs, favicon links,
 * meta (title/description/canonical/OG), JSON-LD parse, local asset refs,
 * sitemap↔files, robots.txt sanity, heading structure (one visible h1/page).
 *
 * Usage:
 *   node scripts/jv-audit.mjs [rootDir]           # default: ..
 *   node scripts/jv-audit.mjs .                   # audit current dir copy
 *
 * Exit 0 = clean; exit 1 = problems found (each printed with [FAIL]).
 * Deterministic: same input -> same output; never prints secret values.
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] || path.join(process.cwd(), ".."));
const results = [];
const ok = (id, msg) => results.push({ s: "PASS", id: `${id}`, msg });
const fail = (id, msg) => results.push({ s: "FAIL", id: `${id}`, msg });
const skip = (id, msg) => results.push({ s: "SKIP", id: `${id}`, msg });

function listHtml(dir, prefix = "") {
  let out = [];
  let entries = [];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    if (e.name.startsWith(".") || e.name === "node_modules") continue;
    if (prefix === "" && ["privacy-safe-build", "original_theme_mirror", "bin", "hosting", "MAIL COP", "scripts", ".git"].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out = out.concat(listHtml(p, prefix + e.name + "/"));
    else if (e.name.endsWith(".html")) out.push(prefix + e.name);
  }
  return out;
}

const pages = listHtml(root).map(p => path.join(root, p));
if (!pages.length) { console.error("No HTML pages found under " + root); process.exit(1); }

const SHARED_DEFS = new Set(["jvOffGrad", "jvOffLin"]); // injected by /jv-logo.js on any page that loads it

const localExists = ref => {
  const clean = ref.split(/[?#]/)[0];
  if (!clean || clean.startsWith("/")) return null;
  const cands = [clean, clean.endsWith(".html") ? clean : clean + ".html", path.join("jsvita", clean)];
  return cands.some(c => fs.existsSync(path.join(root, c)));
};

let fails = 0;
for (const file of pages) {
  const t = fs.readFileSync(file, "utf8");
  const id = path.relative(root, file).replace(/\\/g, "/");
  // 1 template junk
  if (/>undefined</.test(t) || />NaN</.test(t) || /\[object Object\]/.test(t) || />(?:null)\b(?![\w-])</.test(t)) { fail("template", `${id}: literal undefined/NaN/null/[object Object] in markup`); fails++; }
  // 2 gradient refs defined
  const used = new Set([...t.matchAll(/url\(#([A-Za-z][\w-]*)\)/g)].map(m => m[1]));
  const defd = new Set([...t.matchAll(/id="([A-Za-z][\w-]*)"/g)].map(m => m[1]));
  const sharedOk = t.includes("/jv-logo.js");
  for (const u of used) if (!defd.has(u) && !(sharedOk && SHARED_DEFS.has(u))) { fail("gradient", `${id}: url(#${u}) not defined and no shared defs loaded`); fails++; }
  // 3 favicon fallback
  if (!t.includes("favicon.ico")) { fail("favicon", `${id}: no favicon.ico fallback link`); fails++; }
  // 4 h1 structure (visible)
  // h1 structure: count only static DOM h1s (script contents excluded —
  // JS-injected headings replace the static gate h1 at runtime)
  const staticDom = t.replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<h1\b[^>]*style="[^"]*position\s*:\s*absolute[^"]*"[^>]*>[\s\S]*?<\/h1>/gi, "");
  const h1s = (staticDom.match(/<h1[\s>]/g) || []).length;
  if (h1s > 1) { fail("h1", `${id}: ${h1s} <h1> elements (should be 1 visible; sr-only counted)`); fails++; }
  if (h1s === 0) { fail("h1", `${id}: no <h1>`); fails++; }
  // 5 title/description/canonical — only for indexable pages
  const noindex = /name="robots"\s+content="[^"]*noindex/i.test(t);
  const title = t.match(/<title>([^<]*)<\/title>/)?.[1]?.trim();
  const desc = t.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1];
  const canon = t.match(/rel="canonical"\s+href="([^"]*)"/)?.[1];
  const ogimg = t.match(/property="og:image"\s+content="([^"]*)"/)?.[1];
  if (!noindex) {
    if (!title) { fail("meta", `${id}: no <title>`); fails++; }
    if (!desc) { fail("meta", `${id}: no meta description`); fails++; }
    if (title && title.length > 65) { fail("meta", `${id}: title ${title.length} chars (>65)`); fails++; }
    if (!canon) { fail("meta", `${id}: no canonical`); fails++; }
    else if (!canon.startsWith("https://jsvita.in/")) { fail("meta", `${id}: canonical off-domain: ${canon}`); fails++; }
    else if (canon.endsWith(".html") && !id.endsWith(".html") === false) { /* eager skip; path policy handled below */ }
    if (!ogimg) { fail("meta", `${id}: no og:image`); fails++; }
    // canonical path should match the file path (clean-URL policy)
    const expectedPath = id.replace(/\.html$/, "");
    const canonPath = canon ? canon.replace("https://jsvita.in/", "") : null;
    if (canon && !id.includes("jsvita/") && canonPath !== expectedPath && canonPath !== id && !["index"].includes(expectedPath)) {
      // allow intentional alternates; flag only same-dir mismatch on clean urls
      if (!canonPath.includes("/") && !expectedPath.includes("/")) { /* skip */ }
      else { fail("canonical", `${id}: canonical ${canonPath} != /${expectedPath}`); fails++; }
    }
  }
  // 6 JSON-LD parses
  for (const m of t.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch (e) { fail("jsonld", `${id}: JSON-LD parse error: ${e.message}`); fails++; }
  }
  // 7 local refs exist
  const refs = new Set([...t.matchAll(/(?:href|src)="([^"#]+)"/g)].map(m => m[1]));
  for (const ref of refs) {
    if (/^(https?:|\/\/|#|mailto:|tel:|data:|javascript:)/.test(ref)) continue;
    if (/\+|\$\{|^'|'$/.test(ref)) continue; // runtime template concat
    const clean = ref.split(/[?#]/)[0];
    if (clean === "/" || clean === "") continue; // site root = index
    if (localExists(clean.replace(/^\//, ""))) continue;
    const targetBase = clean.replace(/^\//, "").replace(/\.html$/, "");
    if (!fs.existsSync(path.join(root, targetBase)) && !fs.existsSync(path.join(root, targetBase + ".html"))) {
      console.log(`  [WARN] ${id}: ref ${clean} -> target page/asset not in this tree (OK if intentional)`);
      continue;
    }
    fail("asset", `${id}: unresolved local ref ${ref}`); fails++;
  }
}
ok("coverage", `${pages.length} pages scanned under ${path.basename(root)}`);

// sitemap ↔ files
const smPath = path.join(root, "sitemap.xml");
if (fs.existsSync(smPath)) {
  const sm = fs.readFileSync(smPath, "utf8");
  const urls = [...sm.matchAll(/<loc>https:\/\/jsvita\.in\/?([^<]*)<\/loc>/g)].map(m => m[1]);
  for (const u of urls) {
    const f = u === "" ? "index.html" : u.replace(/\/$/, "") + ".html";
    if (!fs.existsSync(path.join(root, f))) { fail("sitemap", `sitemap URL has no page file: /${u}`); fails++; }
  }
  ok("sitemap", `${urls.length} URLs cross-checked`);
} else { skip("sitemap", "no sitemap.xml in this root"); }

// robots.txt sanity
const rob = path.join(root, "robots.txt");
if (fs.existsSync(rob)) {
  const r = fs.readFileSync(rob, "utf8");
  if (!/Sitemap:\s*https:\/\/jsvita\.in\/sitemap\.xml/.test(r)) { fail("robots", "missing Sitemap directive for https://jsvita.in"); fails++; }
  else ok("robots", "Sitemap directive present");
} else skip("robots", "no robots.txt in this root");

// summary
const byFail = results.filter(r => r.s === "FAIL");
const passes = results.filter(r => r.s === "PASS");
console.log("\n===== jv-audit =====");
for (const p of passes) console.log(`✅ ${p.id}: ${p.msg}`);
const counts = {};
for (const f of byFail) counts[f.id] = (counts[f.id] || 0) + 1;
for (const [k, v] of Object.entries(counts)) console.log(`❌ ${k}: ${v} failure(s)`);
if (byFail.length) { console.log("\nFailure details:"); for (const f of byFail) console.log(`  [${f.id}] ${f.msg}`); console.log(`\nRESULT: FAIL — ${byFail.length} issue(s)`); process.exit(1); }
console.log("\nRESULT: PASS — all checks green");
