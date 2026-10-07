#!/usr/bin/env node
/* make_home.js — build the JSVITA 2.1 premium static homepage.
   Replaces the old React-era mirror page (agency-era) with a hand-built
   luxury technology-company homepage that shares the 2.1 design system
   (hero_styles.css / hero_script.js are inlined later by patch_hero3.js). */
const fs = require("fs");
const MIRROR = "C:/Users/JSVita/AppData/Local/Temp/oldsite/mirror/index.html";
const CSS = fs.readFileSync("C:/Users/JSVita/Downloads/JSVita/hero_styles.css", "utf8");
const DESC = "JSVita is a founder-led technology company building premium websites, client portals, CRM platforms, AI automation and business infrastructure for ambitious companies.";
const TITLE = "JSVita — Building Premium Digital Systems";

/* original JSV hexagon mark — static inline replica of the generator LOGO_JS
   (same polygons/gradients; paints instantly, no JS or FOUT) */
const HEX = (size) => '<svg width="' + size + '" height="' + size + '" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><defs><linearGradient id="jvOffGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#F3E5AB"/><stop offset="35%" stop-color="#D4AF37"/><stop offset="70%" stop-color="#AA771C"/><stop offset="100%" stop-color="#F3E5AB"/></linearGradient><linearGradient id="jvOffLin" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#C5A059"/><stop offset="50%" stop-color="#FDF0CD"/><stop offset="100%" stop-color="#C5A059"/></linearGradient></defs><g transform="translate(120,120)"><polygon points="0,-105 91,-52 91,52 0,105 -91,52 -91,-52" fill="#0A0A0C" stroke="url(#jvOffGrad)" stroke-width="4"/><polygon points="0,-95 83,-46 83,46 0,95 -83,46 -83,-46" fill="none" stroke="url(#jvOffGrad)" stroke-width="1.4" opacity="0.55"/><path d="M -15,-45 L -15,25 C -15,45 0,55 25,45 C 40,38 48,22 48,22" fill="none" stroke="url(#jvOffGrad)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M 28,-38 C 15,-48 -15,-42 -22,-25 C -28,-10 18,-2 12,20 C 6,38 -22,42 -35,30" fill="none" stroke="url(#jvOffGrad)" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M -50,-20 L 0,65 L 50,-20" fill="none" stroke="url(#jvOffLin)" stroke-width="3" opacity="0.4"/></g></svg>';

const svg = (paths) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + "</svg>";
const ICO = {
  web: '<path d="M4 20h16M4 16h16"/><circle cx="12" cy="9" r="5"/><path d="M12 4v10M9 9h6" />',
  portal: '<rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  crm: '<path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/>',
  ai: '<path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/><circle cx="12" cy="12" r="3"/>',
  ga: '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6"/><path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
  platform: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>'
};
const sol = [
  ["Premium Websites", "High-converting websites with luxury design.", ICO.web],
  ["Client Portals", "Secure client dashboards and project systems.", ICO.portal],
  ["Lead CRM Systems", "Sales pipelines and automation infrastructure.", ICO.crm],
  ["AI Automation", "Automated workflows and business operations.", ICO.ai],
  ["Analytics Systems", "Business intelligence dashboards.", ICO.ga],
  ["Custom Platforms", "Tailored digital products for modern companies.", ICO.platform]
];

/* Selected Work — real, shipped client systems (no vanity numbers) */
const works = [
  { slug: "patel-co", ind: "Professional services", ch: "Manual client intake and long proposal cycles.", so: "Consultation funnel: premium web presence, structured lead intake and automated client flow.", out: "Discovery calls doubled; client response times dropped under an hour." },
  { slug: "arka-retail", ind: "Retail / D2C", ch: "Fragmented brand experience across campaigns and product pages.", so: "Rebuilt presence with a premium design system and conversion-focused product paths.", out: "Coherent brand recognition and a structured funnel from ad click to enquiry." },
  { slug: "krishnan-interiors", ind: "Design studio", ch: "Strong portfolio with no digital showcase.", so: "Editorial-style showcase with gallery, case stories and guided enquiry flow.", out: "Qualified project enquiries from the website within weeks of launch." }
];

const workCards = works.map(w =>
  '<a class="work-card" href="/case-' + w.slug + '">' +
    '<div class="work-vis" aria-hidden="true"><div class="ui">' +
      '<div class="ui-bar"><i></i><i></i><i></i></div>' +
      '<div class="ui-body"><div class="ui-line g"></div><div class="ui-line s"></div><div class="ui-line xs"></div></div>' +
      '<div class="ui-tiles"><i></i><i></i><i></i></div>' +
    '</div></div>' +
    '<div class="work-body">' +
      '<span class="work-ind">' + w.ind + "</span>" +
      '<div class="work-txt"><div><dt>Challenge</dt><dd>' + w.ch + "</dd></div>" +
      '<div><dt>Solution</dt><dd>' + w.so + "</dd></div>" +
      '<div><dt>Outcome</dt><dd>' + w.out + "</dd></div></div>" +
      '<span class="work-link">View case study</span>' +
    "</div></a>").join("\n        ");

const solCards = sol.map(s =>
  '<article class="cardx"><div class="cico">' + svg(s[2]) + "</div><h3>" + s[0] + "</h3><p>" + s[1] + "</p></article>").join("\n      ");

const tech = [
  ["Firebase", "Auth, realtime data and secure client sessions."],
  ["Google Cloud", "Global infrastructure for hosting and delivery."],
  ["AI Systems", "Applied AI for content, support and operations."],
  ["Analytics", "Measurement that changes decisions."],
  ["Automation", "Workflows that remove manual steps."],
  ["Hosting Infrastructure", "Fast, resilient, globally distributed."]
].map(t => '<div class="tile"><b>' + t[0] + "</b><span>" + t[1] + "</span></div>").join("\n        ");

const trust = [
  ["Premium Design", "Design quality that reflects on your company, not ours."],
  ["Fast Delivery", "First working demo within 48 hours of kickoff."],
  ["Transparent Pricing", "Fixed, itemized proposals — no hourly surprises."],
  ["Direct Founder Access", "You work with Shridhar, not an account layer."],
  ["Secure Infrastructure", "Encrypted sessions and hardened delivery."],
  ["Long-Term Support", "Systems that keep improving after launch."]
].map((t, i) => {
  const tick = '<span class="tick">' + svg('<path d="M5 13l4 4L19 7"/>') + "</span>";
  return '<div><div class="trust-item">' + tick + "<div><b>" + t[0] + "</b><span>" + t[1] + "</span></div></div></div>";
}).join("\n        ");

const HTML = `<!doctype html>
<html lang="en" class="dark">
<head>
<meta charset="UTF-8" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
<link rel="manifest" href="/manifest.json" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<meta name="theme-color" content="#050505" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="author" content="Shridhar John" />
<title>${TITLE}</title>
<meta name="description" content="${DESC}" />
<link rel="canonical" href="https://jsvita.in/" />
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Organization","name":"JSVita","url":"https://jsvita.in/","logo":"https://jsvita.in/jsvita-logo.svg","description":"Founder-led technology company building premium websites, client portals, CRM platforms, AI automation and business infrastructure.","email":"support@jsvita.in","telephone":"+916361792699","founder":{"@type":"Person","name":"Shridhar John","jobTitle":"Founder"},"address":{"@type":"PostalAddress","addressLocality":"Bangalore","addressRegion":"Karnataka","addressCountry":"IN"}}
</script>
<!-- Open Graph / social preview -->
<meta property="og:type" content="website" />
<meta property="og:site_name" content="JSVita" />
<meta property="og:title" content="${TITLE}" />
<meta property="og:description" content="${DESC}" />
<meta property="og:url" content="https://jsvita.in/" />
<meta property="og:image" content="https://jsvita.in/jsvita-og.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="${TITLE}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${TITLE}" />
<meta name="twitter:description" content="${DESC}" />
<meta name="twitter:image" content="https://jsvita.in/jsvita-og.png" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="preload" as="image" href="/shridhar-portrait.jpg" fetchpriority="high" />
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet" />
<style data-pg="hero-premium">
${CSS}
</style>
<script data-pg="hero-premium">/* jsvita 2.1 homepage runtime */</script>
<script src="/jsv-common.js" defer></script>
</head>
<body>

<header class="top" id="home">
  <div class="bar">
    <a class="brand" href="/#home" aria-label="JSVita home">
      <span class="logo-slot">${HEX(34)}</span><span class="bname">JSVita</span>
    </a>
    <nav class="nav" aria-label="Primary">
      <a href="/#home">Home</a>
      <a href="/#solutions">Solutions</a>
      <a href="/#projects">Projects</a>
      <a href="/#technology">Technology</a>
      <a href="/#about">About</a>
      <a href="/#contact">Contact</a>
      <a class="pillnav" href="/contact">Book Strategy Call</a>
    </nav>
    <button class="navburger" aria-label="Open menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>

<main>

<!-- ================= HERO ================= -->
<section class="hero" id="top">
  <div class="wrap hero-wrap">
    <div class="emblem">${HEX(118)}</div>
    <p class="kick">Building Digital Excellence</p>
    <h1 class="h1" data-reveal>Building Premium Digital Systems</h1>
    <p class="lede" data-reveal>JSVita designs websites, automation systems, client portals, CRM platforms and AI-powered business infrastructure for ambitious companies.</p>
    <div class="hero-cta" data-reveal>
      <a class="btn-gold" href="/contact">Book Strategy Call</a>
      <a class="btn-ghost" href="/#projects">View Projects</a>
    </div>
    <div class="cap-row" data-reveal>
      <span>Website Systems</span><span>Client Portals</span><span>CRM Platforms</span><span>AI Automation</span><span>Business Infrastructure</span>
    </div>
  </div>
  <div aria-hidden="true" style="position:absolute;inset:auto 0 -30% 0;height:60%;pointer-events:none;background:radial-gradient(45% 55% at 50% 100%, rgba(212,175,55,.09), transparent 70%)"></div>
</section>

<!-- ============ WHAT WE BUILD (Solutions) ============ -->
<section class="jv" id="solutions" style="padding-top:96px">
  <div class="wrap">
    <div class="shead center">
      <p class="kick">What We Build</p>
      <h2 class="h2" data-reveal>Premium systems,<br />built end-to-end</h2>
      <p class="sub" data-reveal>Every surface a modern company runs on — designed, engineered and supported by one accountable team.</p>
    </div>
    <div class="grid6" id="solutions-cards">
      ${solCards}
    </div>
  </div>
</section>

<!-- ============ SELECTED WORK / SELECTED PROJECTS ============ -->
<section class="jv tight" id="projects">
  <div class="wrap">
    <div class="shead center">
      <p class="kick">Selected Work</p>
      <h2 class="h2" data-reveal>Projects with<br />measurable outcomes</h2>
      <p class="sub" data-reveal>Three systems, three industries — each a real client engagement, shown honestly.</p>
    </div>
    <div class="grid3" id="workCards">
      ${workCards}
    </div>
    <p style="text-align:center;margin-top:34px"><a class="cap-link" href="/portfolio" style="color:var(--gold-2);text-decoration:none;font:700 13.5px var(--sans);letter-spacing:.02em;border-bottom:1px solid rgba(212,175,55,.35);padding-bottom:3px">View all projects →</a></p>
  </div>
</section>

<!-- ============ TECHNOLOGY STACK ============ -->
<section class="jv tight" id="technology">
  <div class="wrap">
    <div class="shead center">
      <p class="kick">Technology Stack</p>
      <h2 class="h2" data-reveal>Built on serious<br />infrastructure</h2>
    </div>
    <div class="grid3" id="techTiles">
      ${tech}
    </li>
    </div>
  </div>
</section>

<!-- ============ TRUST ============ -->
<section class="jv tight" id="about">
  <div class="wrap">
    <div class="shead center">
      <p class="kick">Why Companies Choose JSVita</p>
      <h2 class="h2" data-reveal>A technology partner,<br />not a vendor</h2>
    </div>
    <div class="grid2" id="trustGrid">
      ${trust}
    </div>
    <!-- founder -->
    <div class="founder" id="founder" style="margin-top:96px">
      <div class="founder-photo">
        <img src="/shridhar-portrait.jpg" alt="Shridhar John — founder of JSVita" width="430" height="538" />
      </div>
      <div class="founder-copy" data-reveal>
        <p class="kick">Founder</p>
        <h2 class="h2">Built by Shridhar John</h2>
        <p>JSVita is a founder-led technology company focused on premium websites, intelligent systems and digital infrastructure.</p>
        <p>Every system is designed and delivered under one standard — direct, accountable, and built to improve with time.</p>
        <p class="founder-sig">Shridhar John</p>
        <span class="founder-role">Founder &amp; Principal Engineer</span>
        <p style="margin-top:22px"><a href="/about" style="color:var(--gold-2);text-decoration:none;font:700 13.5px var(--sans);border-bottom:1px solid rgba(212,175,55,.35);padding-bottom:3px">More about JSVita →</a></p>
      </copy>
      </div>
    </div>
  </div>
</section>

<!-- ============ CONTACT ============ -->
<section class="jv" id="contact" style="background:linear-gradient(180deg,transparent,rgba(212,175,55,.035))">
  <div class="wrap">
    <div class="contact-grid">
      <div data-reveal>
        <p class="kick">Contact</p>
        <h2 class="h2">Let's Build Something Extraordinary</h2>
        <p class="lede" style="color:var(--ink-2)">Tell us what you're building — we reply within 24 hours with a clear plan and fixed pricing.</p>
        <div class="contact-points">
          <div class="point">
            <div><b>Email</b><span><a href="mailto:support@jsvita.in">support@jsvita.in</a> · replies within 24 hours</span></div>
          </div>
          <div class="point">
            <div><b>Direct</b><span><a href="tel:+916361792699">+91 63617 92699</a> · Bangalore · worldwide clients</span></div>
          </div>
        </points>
        </div>
      </div>
      <div class="pform" data-reveal>
        <form data-jv-lead-form="web-home-21" data-jv-lead-redirect="/thankyou" novalidate>
          <div class="frow2">
            <div class="fld"><label for="cname">Name</label><input id="cname" name="Name" required placeholder="Full name" autocomplete="name" /></div>
            <div class="fld"><label for="cbus">Business</label><input id="cbus" name="business" placeholder="Company or brand" autocomplete="organization" /></div>
          </div>
          <div class="frow2">
            <div class="fld"><label for="cphone">Phone</label><input id="cphone" name="Phone" type="tel" placeholder="+91" autocomplete="tel" /></div>
            <div class="fld"><label for="cemail">Email</label><input id="cemail" name="Email" type="email" required placeholder="you@company.com" autocomplete="email" /></div>
          </div>
          <div class="fld"><label for="cdetails">Project Details</label><textarea id="cdetails" name="Project Details" placeholder="What are you building? Goals, current setup, deadlines…" required></textarea></div>
          <div class="frow2">
            <div class="fld"><label for="cbudget">Budget</label>
              <select id="cbudget" name="Budget">
                <option>Under ₹50k</option>
                <option>₹50k – ₹1L</option>
                <option>₹1L – ₹3L</option>
                <option>₹3L+</option>
              </select>
            </div>
            <div class="fld"><label for="ctime">Timeline</label>
              <select id="ctime" name="Timeline">
                <option>ASAP</option>
                <option>1–3 months</option>
                <option>3–6 months</tag>,
                <option>Flexible</option>
              </select>
            </div>
          </div>
          <button class="btn-gold" type="submit" style="width:100%;margin-top:8px">Request Proposal&nbsp;→</button>
        </form>
      </div>
    </div>
  </div>
</section>

</main>

<!-- ================= FOOTER (minimal) ================= -->
<footer class="foot">
  <div class="wrap">
    <div style="margin:0 auto 18px;width:46px;height:46px" class="logo-slot">${HEX(46)}</div>
    <p class="ftag">Building Digital Excellence</p>
    <a class="fmail" href="mailto:support@jsvita.in">support@jsvita.in</a>
    <p class="ffound">Founded by Shridhar John</p>
    <div class="frow">
      <a href="/privacy">Privacy</a><i class="dot"></i>
      <a href="/terms">Terms</a><i class="dot"></i>
      <span>© 2026 JSVita Technologies</span>
    </div>
  </div>
</footer>

</body>
</html>
`;

let h = HTML;
/* close stray helper tags the template strings above may contain */
h = h.replace(/<\/li>\s*<\/div>\s*<\/section>\s*<\/section>/, "</div>\n  </div>\n</section>");
h = h.replace(/<\/copy>/g, "</div>");
h = h.replace(/<\/points>/g, "</div>");
h = h.replace(/<\/tag>,/g, "</option>");
fs.writeFileSync(MIRROR, h);
console.log("OK  JSVITA 2.1 static homepage written to mirror/index.html");
console.log("    bytes:", h.length, "| sections:", (h.match(/<section/g) || []).length, "| links:", (h.match(/href="/g) || []).length);
