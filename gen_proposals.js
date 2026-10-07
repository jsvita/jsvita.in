#!/usr/bin/env node
/* gen_proposals.js — JSVita operations layer: proposal templates.
   6 templates × 5 sections (Scope, Timeline, Price, Terms, Payment Schedule).
   Renders one HTML page per proposal: premium gold-on-black, print-ready
   (browser → Save as PDF), noindex. Structure mirrors privacy/terms. */
const fs = require("fs");
const SRC = __dirname;

const SVG = '<svg class="mark" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><g transform="translate(120,120)"><polygon points="0,-105 91,-52 91,52 0,105 -91,52 -91,-52" fill="#0A0A0C" stroke="url(#jvPG)" stroke-width="4"/><polygon points="0,-95 83,-46 83,46 0,95 -83,46 -83,-46" fill="none" stroke="url(#jvPG)" stroke-width="1.4" opacity="0.55"/><path d="M -15,-45 L -15,25 C -15,45 0,55 25,45 C 40,38 48,22 48,22" fill="none" stroke="url(#jvPG)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M 28,-38 C 15,-48 -15,-42 -22,-25 C -28,-10 18,-2 12,20 C 6,38 -22,42 -35,30" fill="none" stroke="url(#jvPG)" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M -50,-20 L 0,65 L 50,-20" fill="none" stroke="url(#jvPL)" stroke-width="3" opacity="0.4"/></g></svg>';

const BASE_CSS = `
    :root{--gold:#D4AF37;--glow:#F7D774;--deep:#8a6a14;--muted:#b3a493;--rule:rgba(212,175,55,.2)}
    *{margin:0;padding:0;box-sizing:border-box}
    body{min-height:100vh;background:radial-gradient(900px 600px at 76% -8%, rgba(212,175,55,.08), transparent 60%), radial-gradient(700px 500px at -8% 100%, rgba(184,134,11,.06), transparent 55%), #050505;font-family:'DM Sans',system-ui,sans-serif;color:#f7f1e8}
    header{width:min(880px,calc(100% - 24px));margin:26px auto 0;display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-radius:16px;background:rgba(0,0,0,.6);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid var(--rule)}
    header a.home{display:flex;align-items:center;gap:10px;text-decoration:none;color:inherit}
    .mark{width:40px;height:40px;display:block;filter:drop-shadow(0 2px 10px rgba(212,175,55,.4))}
    .bname{font-family:'Playfair Display',serif;font-weight:700;font-size:17px;letter-spacing:.04em}
    .pill{font-size:12.5px;color:#e8d9ae;text-decoration:none;border:1px solid rgba(212,175,55,.3);padding:8px 16px;border-radius:999px;transition:.25s}
    .pill:hover{border-color:rgba(212,175,55,.7);color:var(--glow)}
    main{width:min(760px,calc(100% - 24px));margin:46px auto 80px}
    .eyebrow{font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.3em;text-transform:uppercase;color:var(--deep);margin-bottom:10px}
    h1{font-family:'Playfair Display',serif;font-size:clamp(28px,5vw,40px);font-weight:800;margin-bottom:8px}
    .updated{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.18em;color:var(--muted);text-transform:uppercase;margin-bottom:34px}
    section{padding:22px 0;border-top:1px solid var(--rule)}
    section:first-of-type{border-top:none;padding-top:0}
    h2{font-family:'Playfair Display',serif;font-size:19px;font-weight:700;margin-bottom:10px;color:var(--glow)}
    p,li{font-size:14px;line-height:1.75;color:#cfc6b8}
    ul{margin:8px 0 0 18px}
    li{margin-bottom:6px}
    b{color:#f0d57c;font-weight:600}
    a{color:var(--glow)}
    table{width:100%;border-collapse:collapse;margin-top:12px}
    td{padding:10px 12px;border:1px solid var(--rule);font-size:13.5px;color:#cfc6b8}
    td:first-child{color:#f0d57c;font-weight:600;width:38%}
    .foot{margin-top:44px;padding-top:20px;border-top:1px solid var(--rule);text-align:center;font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.2em;color:#776a55;text-transform:uppercase}
    @media print{body{background:#fff;color:#111}header,.pill{display:none}p,li,td{color:#111}b,h2{color:#7a5c00}h1{color:#111}.foot{color:#666}}
`;

function page(p) {
  return `<!doctype html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/jsvita-logo.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <meta name="theme-color" content="#050505" />
  <meta name="robots" content="noindex, nofollow" />
  <meta name="description" content="${p.desc}" />
  <title>${p.title}</title>
  <link rel="canonical" href="https://jsvita.in/${p.slug}" />
  <script>if(/\\.html$/.test(location.pathname))location.replace(location.pathname.replace(/\\.html$/,"")+location.search+location.hash);</script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>${BASE_CSS}</style>
</head>
<body>
  <header>
    <a class="home" href="/">${SVG}<span class="bname">JSVita</span></a>
    <a class="pill" href="/">← Back to site</a>
  </header>
  <main>
    <p class="eyebrow">Proposal Template · Internal</p>
    <h1>${p.h1}</h1>
    <p class="updated">${p.tag} · Base template — final proposals are itemised per client</p>
${p.body}
    <div class="foot">SHRIDHAR JOHN · JSVITA · JSVITA.IN</div>
  </main>
  <svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs><linearGradient id="jvPG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#F3E5AB"/><stop offset="35%" stop-color="#D4AF37"/><stop offset="70%" stop-color="#AA771C"/><stop offset="100%" stop-color="#F3E5AB"/></linearGradient><linearGradient id="jvPL" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#C5A059"/><stop offset="50%" stop-color="#FDF0CD"/><stop offset="100%" stop-color="#C5A059"/></linearGradient></defs></svg>
</body>
</html>
`;
}

function sec(h, inner) { return `    <section>\n      <h2>${h}</h2>\n${inner}    </section>\n`; }
function ul(items) { return `      <ul>\n${items.map(i => `        <li>${i}</li>`).join("\n")}\n      </ul>\n`; }
function p(txt) { return `      <p>${txt}</p>\n`; }
function sched(rows) {
  return `      <table>\n${rows.map(r => `        <tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join("\n")}\n      </table>\n`;
}

const TERMS = p('Fixed scope per the signed proposal. 50% advance to schedule the work, 50% balance before launch. Two revision rounds included per milestone; extra rounds are itemised. Client supplies content, brand assets, domain and hosting access; JSVita supplies everything else. Ownership of the delivered website transfers on final payment. See the <a href="/terms">Terms &amp; Conditions</a>, <a href="/refund-policy">Refund Policy</a> and <a href="/privacy">Privacy Policy</a>.');

const PROPOSALS = [
  {
    slug: "proposal-business-website", h1: "Business Website Proposal", tag: "Business Website",
    title: "Business Website Proposal Template — JSVita", desc: "JSVita business website proposal template — scope, timeline, price bands, terms and the 50/50 payment schedule.",
    body:
      sec("Scope", ul([
        "Up to 10 bespoke pages (Home, Services, About, Contact + supporting pages)",
        "Premium custom design — no templates; mobile-first responsive build",
        "SEO setup: metadata, schema, sitemap, Search Console wiring",
        "WhatsApp + contact form lead capture, click-to-call",
        "Analytics & conversion tracking configured",
        "Performance pass: Core Web Vitals targets, image and script optimisation",
        "Content placement for up to 2 rounds; stock imagery sourcing"
      ])) +
      sec("Timeline", p("<b>2–4 weeks</b> from advance + content handover. First working demo within 48 hours of kickoff. Milestone reviews at design approval, development checkpoint and pre-launch QA.")) +
      sec("Price", p("Package bands: <b>₹2,999 – ₹12,999</b> depending on page count, custom functionality and content volume. Every proposal is itemised line-by-line — no hourly meters, no surprise invoices. Domain, hosting and third-party licences are billed separately at cost.")) +
      sec("Terms", TERMS) +
      sec("Payment Schedule", sched([["50% advance", "Due on proposal acceptance — schedules the work. No work begins before advance payment."], ["50% balance", "Due before launch — site goes live after full clearance."], ["Optional care plan", "Monthly maintenance billed separately, cancellable monthly."]]))
  },
  {
    slug: "proposal-landing-page", h1: "Landing Page Proposal", tag: "Landing Page",
    title: "Landing Page Proposal Template — JSVita", desc: "JSVita landing page proposal template — one page, one goal: scope, timeline, price bands, terms and the 50/50 payment schedule.",
    body:
      sec("Scope", ul([
        "One conversion-engineered page built around a single campaign goal",
        "Persuasion structure: offer, proof, objection handling, single CTA",
        "Speed budget: sub-second mobile load target",
        "Lead form + WhatsApp capture, CRM-ready field schema",
        "A/B-ready hero and CTA variants (one round)",
        "Analytics events: view, scroll depth, form start, conversion"
      ])) +
      sec("Timeline", p("<b>5–10 days</b> from advance + offer details. First draft within 48 hours. Fastest turnaround in the JSVita catalogue.")) +
      sec("Price", p("Bands: <b>₹1,299 – ₹4,999</b> by copy depth, custom graphics and funnel wiring. Itemised per proposal; Meta Ads management quoted separately.")) +
      sec("Terms", TERMS) +
      sec("Payment Schedule", sched([["50% advance", "Due on acceptance — work begins only after advance clears."], ["50% balance", "Due before the page goes live."]]))
  },
  {
    slug: "proposal-website-redesign", h1: "Website Redesign Proposal", tag: "Website Redesign",
    title: "Website Redesign Proposal Template — JSVita", desc: "JSVita website redesign proposal template — scope, timeline, price bands, terms and the 50/50 payment schedule.",
    body:
      sec("Scope", ul([
        "Full visual and structural rebuild of the existing site",
        "Content and URL audit — 301 redirect map so rankings follow",
        "Mobile-first rebuild with modern performance budgets",
        "Technical SEO overhaul: metadata, schema, crawlability, Core Web Vitals",
        "Lead capture upgrade: forms, WhatsApp, tracking",
        "Post-launch monitoring for 30 days"
      ])) +
      sec("Timeline", p("<b>3–5 weeks</b> from advance + access to the current site. Staged cutover: staging preview → approval → DNS switch. The old site stays live until the new one is approved.")) +
      sec("Price", p("Bands: <b>₹4,999 – ₹12,999+</b> by page count, content migration volume and legacy complexity. Redirect mapping and SEO recovery are included in every redesign proposal.")) +
      sec("Terms", TERMS) +
      sec("Payment Schedule", sched([["50% advance", "Due on acceptance — schedules the audit and design phases."], ["50% balance", "Due before the DNS cutover / launch."]]))
  },
  {
    slug: "proposal-meta-ads", h1: "Meta Ads Proposal", tag: "Meta Ads",
    title: "Meta Ads Proposal Template — JSVita", desc: "JSVita Meta Ads proposal template — scope, timeline, price bands, terms and the 50/50 payment schedule.",
    body:
      sec("Scope", ul([
        "Full-funnel campaign architecture: prospecting, retargeting, retention",
        "Creative system: ad posters and story formats built to test weekly",
        "Pixel & Conversions API setup with end-to-end event verification",
        "Landing alignment: dedicated conversion pages where the funnel needs them",
        "Weekly optimisation: budget shifts toward what measurably converts",
        "Monthly performance report: spend, CPL, ROAS, next actions"
      ])) +
      sec("Timeline", p("<b>Setup in 1 week</b>; campaigns run on monthly cycles with weekly test-and-learn sprints. Minimum viable data in 2–3 weeks before scaling decisions.")) +
      sec("Price", p("Management fee: <b>₹4,999 – ₹12,999/month</b> by creative volume and funnel complexity, plus ad spend paid directly to Meta by the client. The first month's management fee is the advance; subsequent months billed at cycle start.")) +
      sec("Terms", TERMS.replace("50% advance to schedule the work, 50% balance before launch.", "Retainer-based: the monthly management fee is invoiced at the start of each cycle.")) +
      sec("Payment Schedule", sched([["Month 1 management fee", "50% to begin setup, 50% before campaigns go live."], ["Months 2+", "Full management fee at cycle start; ad spend is the client's Meta account."], ["Ad spend", "Never handled by JSVita — billed directly by Meta to the client's payment method."]]))
  },
  {
    slug: "proposal-website-maintenance", h1: "Website Maintenance Proposal", tag: "Website Maintenance",
    title: "Website Maintenance Proposal Template — JSVita", desc: "JSVita website maintenance proposal template — scope, timeline, price bands, terms and the payment schedule.",
    body:
      sec("Scope", ul([
        "Core, plugin and dependency updates with post-update testing",
        "Security monitoring, malware scanning and hardening",
        "Scheduled backups with documented restore points",
        "Performance monitoring and monthly speed tune-ups",
        "Small content and design edits (monthly allowance)",
        "24-hour response window on every request"
      ])) +
      sec("Timeline", p("Monthly cycles beginning on the 1st. Onboarding audit in the first week; ongoing care thereafter. Cancel any month before the cycle starts — no lock-in.")) +
      sec("Price", p("Plans: <b>₹499 – ₹2,999/month</b> by site size and edit volume. Itemised in the proposal; annual prepay saves one month.")) +
      sec("Terms", TERMS.replace("50% advance to schedule the work, 50% balance before launch.", "Subscription: billed monthly in advance, cancellable before the next cycle.")) +
      sec("Payment Schedule", sched([["Monthly plan", "Billed in advance at each cycle start."], ["Annual prepay", "12 months for the price of 11, invoiced once."]]))
  },
  {
    slug: "proposal-ca-services", h1: "CA Services Proposal", tag: "CA Services",
    title: "CA Services Proposal Template — JSVita", desc: "JSVita CA Services proposal template — GST, taxation, registration and compliance scope, timeline and payment terms.",
    body:
      sec("Scope", ul([
        "GST registration and monthly/quarterly filing",
        "Income tax returns — individuals and businesses",
        "Company / LLP / partnership registration end-to-end",
        "Bookkeeping and accounting on monthly cycles",
        "Compliance calendar and deadline management",
        "Advisory: structure, deductions, notices"
      ])) +
      sec("Timeline", p("Registrations: <b>3–10 working days</b> subject to government processing. Filings per the statutory calendar. Ledgers updated on monthly cycles.")) +
      sec("Price", p("Per-service pricing from the JSVita CA Services rate card — GST filing from <b>₹499/month</b>, ITR from <b>₹999</b>, registrations from <b>₹2,999</b>. Every mandate gets a written engagement letter with exact fees.")) +
      sec("Terms", p("Governed by the engagement letter for each mandate. Government fees and GST at actuals. Professional fees billed per the engagement letter; recurring mandates are billed at cycle start. Confidentiality per the <a href=\"/privacy\">Privacy Policy</a>; service terms per the <a href=\"/terms\">Terms &amp; Conditions</a>.")) +
      sec("Payment Schedule", sched([["One-time services", "Full fee on engagement (registration, ITR, notices)."], ["Recurring mandates", "Monthly/quarterly fees billed at cycle start."], ["Government fees", "Billed at actuals with receipts."]]))
  }
];

let n = 0;
for (const pr of PROPOSALS) {
  fs.writeFileSync(SRC + "/" + pr.slug + ".html", page(pr));
  console.log("wrote", pr.slug + ".html");
  n++;
}
console.log("gen_proposals: " + n + " templates written");
