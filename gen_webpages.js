#!/usr/bin/env node
/* gen_webpages.js — Phase 8: generate 6 website-service pages + /ca-services division page.
   Idempotent: re-running overwrites the 7 files with current copy. Template mirrors
   web-development.html (proven pattern: standalone, black+gold, jsv-common.js, lead forms). */
const fs = require("fs");
const SRC = "C:/Users/JSVita/Downloads/JSVita";

const LOGO_JS = `<script>
(function(){
  try {
    var defs='<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="jvOffGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#F3E5AB"/><stop offset="35%" stop-color="#D4AF37"/><stop offset="70%" stop-color="#AA771C"/><stop offset="100%" stop-color="#F3E5AB"/></linearGradient><linearGradient id="jvOffLin" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#C5A059"/><stop offset="50%" stop-color="#FDF0CD"/><stop offset="100%" stop-color="#C5A059"/></linearGradient></defs></svg>';
    var logo='<svg width="__W__" height="__W__" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><g transform="translate(120,120)"><polygon points="0,-105 91,-52 91,52 0,105 -91,52 -91,-52" fill="#0A0A0C" stroke="url(#jvOffGrad)" stroke-width="4"/><polygon points="0,-95 83,-46 83,46 0,95 -83,46 -83,-46" fill="none" stroke="url(#jvOffGrad)" stroke-width="1.4" opacity="0.55"/><path d="M -15,-45 L -15,25 C -15,45 0,55 25,45 C 40,38 48,22 48,22" fill="none" stroke="url(#jvOffGrad)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M 28,-38 C 15,-48 -15,-42 -22,-25 C -28,-10 18,-2 12,20 C 6,38 -22,42 -35,30" fill="none" stroke="url(#jvOffGrad)" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M -50,-20 L 0,65 L 50,-20" fill="none" stroke="url(#jvOffLin)" stroke-width="3" opacity="0.4"/></g></svg>';
    var d=document.createElement('div');d.style.cssText='position:absolute;width:0;height:0;overflow:hidden';d.innerHTML=defs;document.body.appendChild(d.firstChild);
    document.getElementById('brandLogo').innerHTML=logo.replace(/__W__/g,'34');
    document.getElementById('heroLogo').innerHTML=logo.replace(/__W__/g,'84');
  } catch(e){}
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'service_page_view', page: '__SLUG__' });
  } catch(e){}
})();
</script>`;

/* shared runtime: lead forms, tracking, Calendly modal (ID-gated) */
const COMMON_JS = '<scr' + 'ipt src="/jsv-common.js" defer></scr' + 'ipt>';

const CSS = `:root{color-scheme:dark}
*{box-sizing:border-box;margin:0;padding:0}
body{background:#1E1813;color:#FAF6F0;font:400 16px/1.7 "DM Sans",system-ui,sans-serif;-webkit-font-smoothing:antialiased;min-height:100vh;position:relative;overflow-x:hidden}
body::before{content:"";position:fixed;inset:0;background:radial-gradient(60% 40% at 50% 0%,rgba(212,175,55,.07),transparent 70%);pointer-events:none}
a{color:inherit}
.wrap{max-width:880px;margin:0 auto;padding:0 22px}
header.top{position:sticky;top:0;z-index:10;backdrop-filter:blur(14px);background:rgba(23,17,12,.8);border-bottom:1px solid rgba(212,175,55,.16)}
.bar{max-width:1060px;margin:0 auto;padding:14px 22px;display:flex;align-items:center;justify-content:space-between;gap:14px}
.brand{display:flex;align-items:center;gap:11px;text-decoration:none}
.brand .name{font:800 17px "Playfair Display",Georgia,serif;letter-spacing:.02em;background:linear-gradient(92deg,#F3E5AB,#D4AF37 45%,#F7D774);-webkit-background-clip:text;background-clip:text;color:transparent}
.topnav{display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;font:600 13px "DM Sans",sans-serif;justify-content:flex-end}
@media(max-width:860px){.bar{flex-direction:column;align-items:flex-start;gap:10px}.topnav{justify-content:flex-start}}
.topnav a{text-decoration:none;color:#B9AC9E;transition:color .2s}
.topnav a:hover{color:#F7D774}
.topnav a.pill{color:#17110C;background:linear-gradient(120deg,#F3E5AB,#D4AF37);padding:8px 16px;border-radius:999px}
.crumbs{font:600 11px/1 "JetBrains Mono",monospace;letter-spacing:.14em;text-transform:uppercase;color:#8D8275;padding-top:26px}
.crumbs a{color:#B9AC9E;text-decoration:none}
.crumbs a:hover{color:#F7D774}
.hero{text-align:center;padding:36px 0 6px}
.hero .mark{width:84px;height:84px;margin:0 auto;filter:drop-shadow(0 0 26px rgba(212,175,55,.4))}
.eyebrow{font:700 11px/1 "JetBrains Mono",monospace;letter-spacing:.34em;text-transform:uppercase;color:#D4AF37;margin-top:22px}
h1{font:800 clamp(30px,4.6vw,46px)/1.15 "Playfair Display",Georgia,serif;margin-top:14px}
.lede{max-width:640px;margin:18px auto 0;color:#D8CCBE;font-size:16.5px}
.ctas{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:26px}
.cta{display:inline-flex;align-items:center;gap:9px;text-decoration:none;font:700 14px "DM Sans",sans-serif;color:#17110C;background:linear-gradient(120deg,#F3E5AB,#D4AF37);padding:14px 28px;border-radius:999px;box-shadow:0 14px 40px -14px rgba(212,175,55,.55);transition:transform .2s}
.cta:hover{transform:translateY(-2px)}
.ghost{display:inline-flex;align-items:center;gap:9px;text-decoration:none;font:600 13px "DM Sans",sans-serif;color:#F7D774;border:1px solid rgba(212,175,55,.45);padding:13px 24px;border-radius:999px}
section{padding:52px 0}
.band{border-top:1px solid rgba(212,175,55,.12)}
.kicker{font:700 11px/1 "JetBrains Mono",monospace;letter-spacing:.3em;text-transform:uppercase;color:#D4AF37}
h2{font:700 clamp(22px,3.2vw,32px)/1.2 "Playfair Display",Georgia,serif;margin-top:10px}
.sub{color:#B9AC9E;margin-top:10px;max-width:640px}
.grid3{display:grid;gap:16px;margin-top:28px}
@media(min-width:760px){.grid3{grid-template-columns:repeat(3,1fr)}}
.card{border:1px solid rgba(212,175,55,.2);background:linear-gradient(160deg,rgba(36,28,21,.9),rgba(23,17,12,.9));border-radius:16px;padding:20px;transition:transform .25s,border-color .25s}
.card:hover{transform:translateY(-3px);border-color:rgba(212,175,55,.45)}
.card h3{font:700 15.5px "DM Sans",sans-serif;color:#F7D774}
.card p{margin-top:7px;color:#B9AC9E;font-size:14px}
.stats{display:grid;gap:14px;margin-top:28px;grid-template-columns:repeat(3,1fr)}
.stat{padding:18px 12px;border-radius:14px;border:1px solid rgba(212,175,55,.22);background:rgba(212,175,55,.06);text-align:center}
.stat strong{display:block;font:800 26px/1.1 "Playfair Display",Georgia,serif;background:linear-gradient(100deg,#fdf8ec,#f7d774 45%,#d4af37);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.stat span{display:block;margin-top:6px;font:600 10px/1.3 "JetBrains Mono",monospace;letter-spacing:.14em;text-transform:uppercase;color:#8D8275}
.rel{display:flex;flex-wrap:wrap;gap:12px;margin-top:24px}
.rel a{display:inline-flex;padding:12px 20px;border-radius:999px;border:1px solid rgba(212,175,55,.35);color:#F7D774;text-decoration:none;font:600 13px "DM Sans",sans-serif;transition:background .2s}
.rel a:hover{background:rgba(212,175,55,.1)}
details{border:1px solid rgba(212,175,55,.2);border-radius:14px;padding:16px 20px;margin-top:12px;background:rgba(36,28,21,.7)}
summary{cursor:pointer;font:700 15px "DM Sans",sans-serif;color:#F7D774}
details p{margin-top:10px;color:#B9AC9E;font-size:14.5px}
.ctaband{text-align:center;padding:60px 0 70px}
footer{border-top:1px solid rgba(212,175,55,.14);padding:30px 0 40px;color:#8D8275;font-size:13.5px}
footer .frow{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;justify-content:center}
footer a{color:#B9AC9E;text-decoration:none}
footer a:hover{color:#F7D774}
.dot{width:3px;height:3px;border-radius:50%;background:#D4AF37;display:inline-block}
.fform{margin-top:28px;border:1px solid rgba(212,175,55,.24);background:linear-gradient(160deg,rgba(36,28,21,.92),rgba(23,17,12,.92));border-radius:20px;padding:26px;text-align:left;max-width:640px;margin-left:auto;margin-right:auto}
.fform .frow2{display:grid;gap:14px;grid-template-columns:1fr}
@media(min-width:600px){.fform .frow2{grid-template-columns:1fr 1fr}}
.fform label{display:block;font:600 12.5px "DM Sans",sans-serif;color:#D8CCBE;margin-bottom:6px;letter-spacing:.02em}
.fform input,.fform select,.fform textarea{width:100%;font:400 14px/1.5 "DM Sans",sans-serif;color:#FAF6F0;background:rgba(255,255,255,.04);border:1px solid rgba(212,175,55,.28);border-radius:10px;padding:11px 13px;outline:none;transition:border-color .2s,box-shadow .2s}
.fform input:focus,.fform select:focus,.fform textarea:focus{border-color:#D4AF37;box-shadow:0 0 0 3px rgba(212,175,55,.16)}
.fform textarea{resize:vertical;min-height:96px}
.fform button{margin-top:16px;width:100%;border:0;cursor:pointer;font:700 14px "DM Sans",sans-serif;color:#17110C;background:linear-gradient(120deg,#F3E5AB,#D4AF37);padding:14px 22px;border-radius:999px;box-shadow:0 14px 34px -14px rgba(212,175,55,.55);transition:transform .2s}
.fform button:hover{transform:translateY(-1px)}
.fform button:disabled{opacity:.6;cursor:default;transform:none}
.jv-lead-error{margin-top:12px;color:#F7D774;font-size:13px}
.cardlink{display:inline-flex;margin-top:12px;padding:9px 16px;border-radius:999px;border:1px solid rgba(212,175,55,.35);color:#F7D774;text-decoration:none;font:600 12px "DM Sans",sans-serif;transition:background .2s}.cardlink:hover{background:rgba(212,175,55,.1)}
.fcols{display:grid;gap:26px;grid-template-columns:1fr;margin-top:6px;text-align:left}
@media(min-width:760px){.fcols{grid-template-columns:1.4fr 1fr 1fr 1fr}}
.fbrand{font:800 20px "Playfair Display",Georgia,serif;background:linear-gradient(100deg,#fdf8ec,#f7d774 45%,#d4af37);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.ftag{font:600 10.5px "JetBrains Mono",monospace;letter-spacing:.22em;text-transform:uppercase;color:#D4AF37;margin-top:4px}
.fstate{color:#8D8275;font-size:13px;line-height:1.65;margin-top:10px;max-width:36ch}
.fcol{display:flex;flex-direction:column;gap:8px}
.fcol-k{font:700 10.5px "JetBrains Mono",monospace;letter-spacing:.22em;text-transform:uppercase;color:#D4AF37;margin-bottom:2px}
.fcol a{color:#B9AC9E;text-decoration:none;font-size:13.5px;transition:color .2s}
.fcol a:hover{color:#F7D774}
.flegal{margin-top:26px;padding-top:18px;border-top:1px solid rgba(212,175,55,.12)}
`;

function head(p) {
  const svc = p.ca
    ? '{"@context":"https://schema.org","@type":"Service","name":"JSVita CA Services — GST, Tax, Registration & Compliance","serviceType":"Chartered Accountant services","url":"https://jsvita.in/ca-services","description":"GST registration and filing, income tax returns, business registration, accounting, compliance and financial advisory — led by CA Mahalakshmi.","provider":{"@type":"Organization","name":"JSVita CA Services","parentOrganization":{"@type":"Organization","name":"JSVita","url":"https://jsvita.in/"},"employee":{"@type":"Person","name":"CA Mahalakshmi","jobTitle":"Chartered Accountant","email":"ca.mahalakshmi@jsvita.in"},"telephone":"+916361792699","email":"ca.mahalakshmi@jsvita.in","address":{"@type":"PostalAddress","addressLocality":"Bangalore","addressRegion":"Karnataka","addressCountry":"IN"}},"areaServed":["Bangalore","India","Worldwide"]}'
    : p.division
    ? '{"@context":"https://schema.org","@type":"Service","name":"JSVita Web Solutions — Premium Website Development","serviceType":"Website development","url":"https://jsvita.in/web-solutions","description":"Premium website development and digital solutions — business websites, startup websites, portfolio websites, landing pages, website redesign and maintenance.","provider":{"@type":"Organization","name":"JSVita Web Solutions","parentOrganization":{"@type":"Organization","name":"JSVita","url":"https://jsvita.in/"},"telephone":"+916361792699","email":"support@jsvita.in","address":{"@type":"PostalAddress","addressLocality":"Bangalore","addressRegion":"Karnataka","addressCountry":"IN"}},"areaServed":["Bangalore","India","Worldwide"]}'
    : '{"@context":"https://schema.org","@type":"Service","name":"' + p.h1 + '","serviceType":"' + p.svcType + '","url":"https://jsvita.in/' + p.slug + '","description":"' + p.svcDesc + '","provider":{"@type":"Organization","name":"JSVita","url":"https://jsvita.in/","telephone":"+916361792699","email":"support@jsvita.in","address":{"@type":"PostalAddress","addressLocality":"Bangalore","addressRegion":"Karnataka","addressCountry":"IN"}},"areaServed":["Bangalore","India","Worldwide"]}';
  return `<!doctype html>
<html lang="en" class="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${p.title}</title>
<meta name="description" content="${p.desc}">
<meta property="og:title" content="${p.title}">
<meta property="og:description" content="${p.ogDesc}">
<meta property="og:type" content="website">
<meta property="og:url" content="https://jsvita.in/${p.slug}">
<meta property="og:image" content="https://jsvita.in/jsvita-og.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${p.title}">
<meta name="twitter:description" content="${p.ogDesc}">
<meta name="twitter:image" content="https://jsvita.in/jsvita-og.png">
<link rel="canonical" href="https://jsvita.in/${p.slug}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
<script type="application/ld+json">
${svc}
</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://jsvita.in/"},{"@type":"ListItem","position":2,"name":"${p.crumb}","item":"https://jsvita.in/${p.slug}"}]}
</script>
<style>
${CSS}
${p.extraCss || ""}
</style>
</head>
<body>`;
}

const HEADER = `<header class="top">
  <div class="bar">
    <a class="brand" href="/"><span id="brandLogo" aria-hidden="true"></span><span class="name">JSVita</span></a>
    <nav class="topnav" aria-label="Primary">
      <a href="/">Home</a>
      <a href="/#solutions">Solutions</a>
      <a href="/portfolio">Projects</a>
      <a href="/#technology">Technology</a>
      <a href="/ca-services">CA SERVICES</a>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
      <a class="pill" href="/contact">Book Strategy Call</a>
    </nav>
  </div>
</header>`;

const FOOTER = `<footer>
  <div class="wrap">
    <div class="fcols">
      <div class="fcol fcol-brand">
        <div class="fbrand">JSVita</div>
        <div class="ftag">Building Digital Excellence</div>
        <p class="fstate">Premium websites, client portals, CRM platforms, AI automation and business infrastructure — engineered end-to-end for ambitious companies.</p>
      </div>
      <div class="fcol">
        <span class="fcol-k">Systems</span>
        <a href="/business-websites">Premium Websites</a>
        <a href="/web-solutions">Web Solutions</a>
        <a href="/lead-generation">Lead CRM Systems</a>
        <a href="/consultation">AI Automation</a>
      </div>
      <div class="fcol">
        <span class="fcol-k">Company</span>
        <a href="/about">About</a>
        <a href="/#process">Process</a>
        <a href="/#faq">FAQ</a>
        <a href="/contact">Contact</a>
        <a href="/ca-services">CA SERVICES</a>
      </div>
      <div class="fcol">
        <span class="fcol-k">Resources</span>
        <a href="/case-studies">Case Studies</a>
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms &amp; Conditions</a>
        <a href="/refund-policy">Refund Policy</a>
        <a href="/cookie-policy">Cookie Policy</a>
      </div>
    </div>
    <div class="frow flegal">
      <span>&copy; 2026 JSVita Technologies</span><span class="dot"></span>
      <a href="mailto:support@jsvita.in">support@jsvita.in</a><span class="dot"></span>
      <span class="ffounder">Founded by Shridhar John</span>
    </div>
  </div>
  <!-- JSVITA ADMIN-READY FUTURE SURFACES — Client Portal · Admin Dashboard · Project Tracking (hidden until launch) -->
  <div hidden aria-hidden="true" data-jv-future>
    <span data-future="client-portal">Client Portal</span>
    <span data-future="admin-dashboard">Admin Dashboard</span>
    <span data-future="project-tracking">Project Tracking</span>
  </div>
</footer>`;

function sections(p) {
  let s = "";
  s += `  <section class="band">
    <p class="kicker">What's included</p>
    <h2>${p.includedTitle}</h2>
    <div class="grid3">
` + p.included.map(c => `      <div class="card"><h3>${c[0]}</h3><p>${c[1]}</p></div>`).join("\n") + `
    </div>
  </section>

  <section class="band">
    <p class="kicker">The numbers</p>
    <h2>Measured, not promised</h2>
    <div class="stats">
` + p.stats.map(x => `      <div class="stat"><strong>${x[0]}</strong><span>${x[1]}</span></div>`).join("\n") + `
    </div>
  </section>

  <section class="band">
    <p class="kicker">How it runs</p>
    <h2>Four deliberate steps</h2>
    <div class="grid3">
` + p.process.map(x => `      <div class="card"><h3>${x[0]}</h3><p>${x[1]}</p></div>`).join("\n") + `
    </div>
  </section>

  <section class="band">
    <p class="kicker">FAQ</p>
    <h2>Before you ask</h2>
` + p.faq.map(q => `    <details><summary>${q[0]}</summary><p>${q[1]}</p></details>`).join("\n") + `
  </section>

  <section class="band">
    <p class="kicker">Related</p>
    <div class="rel">
` + p.related.map(r => `      <a href="${r[0]}" data-jv-track="service_page_click" data-jv-info="${r[0].replace("/", "")}">${r[1]}</a>`).join("\n") + `
    </div>
  </section>`;
  return s;
}

function ctaBand(p) {
  return `
  <section class="ctaband band">
    <p class="kicker">Work with ${p.ca ? "JSVita CA Services" : "JSVita"}</p>
    <h2>${p.caH2}</h2>
    <div class="ctas">
      <a class="cta" href="/#contact" data-jv-track="service_page_cta" data-jv-info="${p.slug}-bottom">${p.ca ? "Book CA Consultation" : "Start your project"}</a>
      <a class="ghost" href="#" data-jv-calendly data-jv-track="consultation_request" data-jv-info="${p.slug}">Book Free Consultation</a>
    </div>
  </section>
</main>
`;
}

function stdPage(p) {
  return head(p) + "\n" + HEADER + `

<main class="wrap">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <span>${p.crumb}</span></nav>
  <div class="hero">
    <div class="mark" id="heroLogo"></div>
    <p class="eyebrow">JSVita &middot; Service</p>
    <h1>${p.h1}</h1>
    <p class="lede">${p.lede}</p>
    <div class="ctas">
      <a class="cta" href="/#contact" data-jv-track="service_page_cta" data-jv-info="${p.slug}">Start your project</a>
      <a class="ghost" href="#" data-jv-calendly data-jv-track="consultation_request" data-jv-info="${p.slug}">Book Free Consultation</a>
    </div>
  </div>

` + sections(p) + ctaBand(p) + FOOTER + "\n" + LOGO_JS.replace("__SLUG__", p.slug) + "\n" + COMMON_JS + "\n</body>\n</html>\n";
}

function caPage(p) {
  const services = p.caServices.map(c => `      <div class="card"><h3>${c[0]}</h3><p>${c[1]}</p></div>`).join("\n");
  const faq = p.faq.map(q => `    <details><summary>${q[0]}</summary><p>${q[1]}</p></details>`).join("\n");
  return head(p) + "\n" + HEADER + `

<main class="wrap">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <span>JSVita CA Services</span></nav>
  <div class="hero">
    <div class="mark" id="heroLogo"></div>
    <p class="eyebrow">JSVita CA Services &middot; A JSVita Division</p>
    <h1>CA Services</h1>
    <p class="lede">Led by <strong>CA Mahalakshmi, Chartered Accountant</strong> — GST, income tax, business registration, accounting and compliance, delivered inside the same premium standard as every JSVita build.</p>
    <div class="ctas">
      <a class="cta" href="/#contact" data-jv-track="service_page_cta" data-jv-info="ca-services">Book CA Consultation</a>
      <a class="ghost" href="https://wa.me/916361792699?text=Hi%20JSVita%20CA%20Services%20%E2%80%94%20I%27d%20like%20to%20book%20a%20CA%20consultation." target="_blank" rel="noopener" data-jv-track="finance_whatsapp_click" data-jv-info="ca-services">WhatsApp the CA Services desk</a>
    </div>
  </div>

  <section class="band">
    <p class="kicker">Services</p>
    <h2>Everything a business needs to stay compliant</h2>
    <div class="grid3">
${services}
    </div>
  </section>

  <section class="band">
    <p class="kicker">Why the division exists</p>
    <h2>One team for your website <em>and</em> your filings</h2>
    <div class="grid3">
      <div class="card"><h3>Registration to reporting</h3><p>From GST registration and MSME/Startup filings to monthly accounting — one accountable desk.</p></div>
      <div class="card"><h3>Guided, not transactional</h3><p>You speak with a Chartered Accountant, not a portal. Every filing explained before it is filed.</p></div>
      <div class="card"><h3>Integrated with your build</h3><p>Launching a business with JSVita? Registration, GST and email setup run in parallel with your website build.</p></div>
    </div>
    <div class="stats" style="margin-top:28px">
      <div class="stat"><strong>7</strong><span>Core CA services</span></div>
      <div class="stat"><strong>100%</strong><span>Digital filings, documented</span></div>
      <div class="stat"><strong>24h</strong><span>Response window</span></div>
    </div>
  </section>

  <section class="band">
    <p class="kicker">Pricing</p>
    <h2>Transparent, fixed fees</h2>
    <p class="sub">CA Consultation from &#8377;999 &middot; Business Registration from &#8377;4,999 &middot; Accounting &amp; Compliance &#8377;2,999/month. Quoted and invoiced separately from website packages — book a consultation for an exact, itemised quote.</p>
  </section>

  <section class="band">
    <p class="kicker">FAQ</p>
    <h2>Before you ask</h2>
${faq}
  </section>

  <section class="band">
    <p class="kicker">Request a callback</p>
    <h2>Tell us what you need filed</h2>
    <form class="fform" data-jv-lead-form="ca-services" data-jv-lead-email="ca.mahalakshmi@jsvita.in" data-jv-lead-subject="New CA enquiry — jsvita.in/ca-services">
      <input type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute!important;left:-9999px;height:1px;width:1px;opacity:0;pointer-events:none">
      <div class="frow2">
        <div><label for="ca-name">Name</label><input id="ca-name" name="Name" placeholder="Your name" required></div>
        <div><label for="ca-email">Email or WhatsApp</label><input id="ca-email" name="Email" placeholder="you@company.com" required></div>
      </div>
      <div style="margin-top:14px"><label for="ca-service">Service needed</label>
        <select id="ca-service" name="Service">
          <option>CA Consultation</option>
          <option>GST Registration</option>
          <option>GST Filing</option>
          <option>Income Tax Return Filing</option>
          <option>Business / MSME Registration</option>
          <option>Accounting &amp; Bookkeeping</option>
          <option>Compliance Services</option>
          <option>Financial Advisory</option>
        </select>
      </div>
      <div style="margin-top:14px"><label for="ca-msg">Details</label><textarea id="ca-msg" name="Details" placeholder="Tell CA Mahalakshmi what you need — e.g. new company, GST registration, monthly books&#8230;" required></textarea></div>
      <button type="submit">Request CA callback</button>
    </form>
  </section>

  <section class="band">
    <p class="kicker">Related</p>
    <div class="rel">
      <a href="/finance" data-jv-track="finance_division_click" data-jv-info="ca-services">Finance &amp; Tax Resource Centre</a>
      <a href="/finance-gst" data-jv-track="finance_resource_click" data-jv-info="ca-services">GST Guide</a>
      <a href="/finance-taxation" data-jv-track="finance_resource_click" data-jv-info="ca-services">Taxation Guide</a>
      <a href="/finance-setup" data-jv-track="finance_resource_click" data-jv-info="ca-services">Business Setup Guide</a>
      <a href="/business-websites" data-jv-track="service_page_click" data-jv-info="ca-services">Business Websites</a>
    </div>
  </section>
` + ctaBand(p) + FOOTER + "\n" + LOGO_JS.replace("__SLUG__", p.slug) + "\n" + COMMON_JS + "\n</body>\n</html>\n";
}

function divPage(p) {
  const svc = p.divServices.map(c => `      <div class="card"><h3>${c[0]}</h3><p>${c[1]}</p><a class="cardlink" href="${c[2]}" data-jv-track="service_page_click" data-jv-info="web-solutions">Explore ${c[0]} &rarr;</a></div>`).join("\n");
  const faq = p.divFaq.map(q => `    <details><summary>${q[0]}</summary><p>${q[1]}</p></details>`).join("\n");
  return head(p) + "\n" + HEADER + `

<main class="wrap">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <span>JSVita Web Solutions</span></nav>
  <div class="hero">
    <div class="mark" id="heroLogo"></div>
    <p class="eyebrow">A JSVita Division &middot; Digital &amp; Professional Business Solutions</p>
    <h1>JSVita Web Solutions</h1>
    <p class="lede">Premium website development and digital solutions — <strong>business websites, startup websites, portfolio websites, landing pages, redesigns and maintenance</strong>, delivered end-to-end by senior hands to one global standard.</p>
    <div class="ctas">
      <a class="cta" href="/#contact" data-jv-track="service_page_cta" data-jv-info="web-solutions">Start Your Project</a>
      <a class="ghost" href="#" data-jv-calendly data-jv-track="consultation_request" data-jv-info="web-solutions">Book Free Consultation</a>
    </div>
  </div>

  <section class="band">
    <p class="kicker">What we build</p>
    <h2>Six services. One premium standard.</h2>
    <div class="grid3">
${svc}
    </div>
  </section>

  <section class="band">
    <p class="kicker">Why the division exists</p>
    <h2>Company-first delivery, not freelancer roulette</h2>
    <div class="grid3">
      <div class="card"><h3>Senior, direct</h3><p>You work with the senior team from brief to launch — no relays, no dilution, no handoff loss.</p></div>
      <div class="card"><h3>Bespoke, never templates</h3><p>Every build is designed around your business and engineered for speed, SEO and conversion.</p></div>
      <div class="card"><h3>Integrated with the group</h3><p>Registration, GST and compliance run in parallel through JSVita CA Services while your site is built.</p></div>
    </div>
    <div class="stats" style="margin-top:28px">
      <div class="stat"><strong>6</strong><span>Service lines, one standard</span></div>
      <div class="stat"><strong>48h</strong><span>Kickoff to first demo</span></div>
      <div class="stat"><strong>100%</strong><span>Bespoke builds</span></div>
    </div>
  </section>

  <section class="band">
    <p class="kicker">FAQ</p>
    <h2>Before you ask</h2>
${faq}
  </section>

  <section class="band">
    <p class="kicker">Request a proposal</p>
    <h2>Tell us what you need built</h2>
    <form class="fform" data-jv-lead-form="web-solutions" data-jv-lead-subject="New web solutions enquiry — jsvita.in/web-solutions">
      <input type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute!important;left:-9999px;height:1px;width:1px;opacity:0;pointer-events:none">
      <div class="frow2">
        <div><label for="ws-name">Name</label><input id="ws-name" name="Name" placeholder="Your name" required></div>
        <div><label for="ws-email">Email or WhatsApp</label><input id="ws-email" name="Email" placeholder="you@company.com" required></div>
      </div>
      <div style="margin-top:14px"><label for="ws-service">What do you need?</label>
        <select id="ws-service" name="Service">
          <option>Business Website</option>
          <option>Startup Website</option>
          <option>Portfolio Website</option>
          <option>Landing Page</option>
          <option>Website Redesign</option>
          <option>Website Maintenance</option>
          <option>AI Automation</option>
          <option>Digital Branding</option>
          <option>Not sure yet</option>
        </select>
      </div>
      <div style="margin-top:14px"><label for="ws-msg">Details</label><textarea id="ws-msg" name="Details" placeholder="Tell us about your business and what the site must achieve&#8230;" required></textarea></div>
      <button type="submit">Request proposal</button>
    </form>
  </section>

  <section class="band">
    <p class="kicker">Related</p>
    <div class="rel">
      <a href="/ca-services" data-jv-track="division_click" data-jv-info="web-solutions-related">JSVita CA Services</a>
      <a href="/finance" data-jv-track="finance_division_click" data-jv-info="web-solutions">Finance &amp; Tax Resource Centre</a>
      <a href="/ai-automation" data-jv-track="service_page_click" data-jv-info="web-solutions">AI &amp; Automation</a>
      <a href="/branding" data-jv-track="service_page_click" data-jv-info="web-solutions">Digital Branding</a>
    </div>
  </section>
` + ctaBand(p) + FOOTER + "\n" + LOGO_JS.replace("__SLUG__", p.slug) + "\n" + COMMON_JS + "\n</body>\n</html>\n";
}

const PAGES = [
  {
    slug: "business-websites", crumb: "Business Websites", h1: "Business Websites",
    title: "Business Websites — Websites That Win Customers | JSVita",
    desc: "High-converting business websites by JSVita — premium design, SEO foundations, analytics and WhatsApp integration, launched end-to-end in days.",
    ogDesc: "Premium, high-converting business websites — design, SEO, analytics and launch, end-to-end.",
    svcType: "Business website development",
    svcDesc: "High-converting multi-page business websites — premium design, SEO foundations, analytics, professional email and launch support.",
    lede: "A premium multi-page website that turns visitors into enquiries and sales — designed, engineered and launched end-to-end with an operator's discipline.",
    includedTitle: "Everything a business presence needs",
    included: [
      ["Premium responsive design", "Bespoke pages designed for your brand — never templates, never generic."],
      ["SEO foundations", "Clean structure, metadata, sitemap and indexing configured at launch."],
      ["Analytics & conversion tracking", "Every enquiry, call and click measured from day one."],
      ["WhatsApp & contact actions", "One-tap chat, call and enquiry actions built into every page."],
      ["Performance optimization", "Fast loads on every device — speed is a ranking and conversion factor."],
      ["Professional email", "Branded mailboxes on your own domain with SPF, DKIM and DMARC."]
    ],
    stats: [["48h", "From kickoff to first demo"], ["100%", "Bespoke — never templates"], ["24h", "Response window"]],
    process: [
      ["01 · Discovery call", "A free, focused conversation about your business, customers and goals."],
      ["02 · Fixed proposal", "An itemised scope with deliverables, timeline and transparent pricing."],
      ["03 · Design & build", "Bespoke design and development, reviewed with you at every milestone."],
      ["04 · Launch & grow", "Domain, hosting, analytics and handover — then measurable growth."]
    ],
    faq: [
      ["How much does a business website cost?", "Website packages start from \u20B91,299, with the most popular Professional package at \u20B94,999 — see the transparent packages in the JSVita pricing section. Every proposal is fixed and itemised, with no hourly meters."],
      ["How long until launch?", "Most business websites launch within days of kickoff. You see a first working demo within 48 hours."],
      ["Can you migrate my existing content?", "Yes — content, domain and email migrate cleanly, and old URLs redirect so your rankings follow."]
    ],
    related: [["/startup-websites", "Startup Websites"], ["/landing-pages", "Landing Pages"], ["/website-redesign", "Website Redesign"]],
    caH2: "Bring the standard to your business"
  },
  {
    slug: "startup-websites", crumb: "Startup Websites", h1: "Startup Websites",
    title: "Startup Websites — Launch-Ready, Investor-Ready | JSVita",
    desc: "Launch-ready startup websites by JSVita — premium design that makes young ventures look established, with room to scale.",
    ogDesc: "Launch-ready startup websites — look established from day one, scale without rebuilds.",
    svcType: "Startup website development",
    svcDesc: "Launch-ready startup websites — premium design, fast builds, clean positioning and a foundation that scales.",
    lede: "Launch-ready sites that make young ventures look established — fast builds, clean positioning, and a foundation that scales past your first customers.",
    includedTitle: "Built for day one and the day after",
    included: [
      ["Launch-fast builds", "A working demo within 48 hours; launch in days, not months."],
      ["Credible positioning", "Copy and structure that make your venture look established from day one."],
      ["Investor-and-customer-ready", "A presence you can send to a VC or a first client with confidence."],
      ["SEO foundations", "Structured metadata and clean markup so you're findable early."],
      ["Analytics from first visit", "Know where your first users come from, from the very first day."],
      ["Scales with you", "Add pricing pages, careers, product pages — without a rebuild."]
    ],
    stats: [["48h", "From kickoff to first demo"], ["Days", "Not months — to launch"], ["100%", "Yours — domain, code, content"]],
    process: [
      ["01 · Discovery call", "Your stage, your audience, your next milestone — we scope for that."],
      ["02 · Fixed proposal", "An itemised startup scope with a launch timeline you can plan around."],
      ["03 · Design & build", "Premium design and build, with demo checkpoints as you fundraise or pitch."],
      ["04 · Launch & iterate", "Go live, measure, and add sections as the company grows."]
    ],
    faq: [
      ["What does a startup website cost?", "Startup packages start from \u20B91,299 — the Startup package (\u20B97,999) bundles the site with a brand starter kit, campaign landing page and lead capture. GST registration runs alongside through JSVita CA Services."],
      ["Can you register the business too?", "Yes — JSVita CA Services handles GST registration, MSME registration and compliance alongside your build."],
      ["We'll pivot — does the site survive?", "The architecture is modular; repositioning copy and sections is a small iteration, not a rebuild."]
    ],
    related: [["/business-websites", "Business Websites"], ["/landing-pages", "Landing Pages"], ["/ca-services", "CA Services"]],
    caH2: "Launch like you mean it"
  },
  {
    slug: "portfolio-websites", crumb: "Portfolio Websites", h1: "Portfolio Websites",
    title: "Portfolio Websites — Work, Beautifully Presented | JSVita",
    desc: "Portfolio websites by JSVita — elegant showcase sites for professionals, studios and creators, with the polish your work deserves.",
    ogDesc: "Elegant portfolio websites for professionals, studios and creators — work presented with polish.",
    svcType: "Portfolio website development",
    svcDesc: "Elegant portfolio websites for professionals, studios and creators — curated case presentation, galleries and premium typography.",
    lede: "Elegant showcase sites for professionals, studios and creators — your work presented with the polish it deserves, built to win the next client or role.",
    includedTitle: "Presentation, engineered",
    included: [
      ["Curated case presentation", "Projects framed as outcomes — brief, approach, result."],
      ["Gallery & media polish", "Image galleries, reels and embeds that load fast and look sharp."],
      ["Premium typography", "Editorial-grade type and spacing that flatters your work."],
      ["About & contact flow", "A short, confident story and a one-tap way to reach you."],
      ["Mobile-first", "Your portfolio reviewed on phones — where most first views happen."],
      ["Speed & SEO basics", "Fast loads, clean titles and share cards that look right in any preview."]
    ],
    stats: [["48h", "From kickoff to first demo"], ["100%", "Bespoke — never templates"], ["24h", "Response window"]],
    process: [
      ["01 · Discovery call", "Your craft, your audience, the work you want more of."],
      ["02 · Curation & proposal", "We pick the projects that sell and scope the build."],
      ["03 · Design & build", "Editorial design around your best work, reviewed with you."],
      ["04 · Launch", "Domain, sharing cards and analytics — then send the link everywhere."]
    ],
    faq: [
      ["Can I update projects myself?", "Yes — we hand over a simple way to add or swap work, or add a maintenance plan and we do it for you."],
      ["Can you build on my existing domain?", "Yes — we work with your domain or set a new one up end-to-end."],
      ["What does a portfolio website cost?", "Most portfolio sites sit between the Business (\u20B92,999) and Professional (\u20B94,999) packages depending on scope. Every proposal is fixed and itemised."]
    ],
    related: [["/branding", "Digital Branding"], ["/website-redesign", "Website Redesign"], ["/business-websites", "Business Websites"]],
    caH2: "Make your work impossible to scroll past"
  },
  {
    slug: "landing-pages", crumb: "Landing Pages", h1: "Landing Pages",
    title: "Landing Pages — Built to Convert | JSVita",
    desc: "Landing pages by JSVita — single-purpose conversion pages for campaigns, products and launches. Sharp copy, fast load, measurable results.",
    ogDesc: "Single-purpose conversion pages for campaigns, products and launches — sharp, fast, measurable.",
    svcType: "Landing page development",
    svcDesc: "Single-purpose conversion landing pages for campaigns, products and launches — sharp copy, fast load, wired analytics.",
    lede: "Single-purpose pages engineered for one action — sign up, book, buy. Sharp copy, fast load, and analytics wired so you know exactly what worked.",
    includedTitle: "Everything conversion-critical",
    included: [
      ["One-page, one-goal", "Structure and copy engineered around a single action."],
      ["Conversion copywriting", "Headlines and sections written to move the reader, not to fill space."],
      ["Sub-second loads", "Minimal, optimised builds — speed is a conversion feature."],
      ["Form or WhatsApp CTA", "Enquiry forms delivered to your inbox, or one-tap WhatsApp."],
      ["A/B-ready structure", "Sections built so variants can be tested without rework."],
      ["Campaign analytics", "Source, event and conversion tracking wired to your ad campaigns."]
    ],
    stats: [["<1s", "Target load time"], ["1", "Goal per page — zero clutter"], ["24h", "Response window"]],
    process: [
      ["01 · Brief", "The offer, the audience and the one action that matters."],
      ["02 · Copy + wireframe", "A persuasive skeleton approved before any design."],
      ["03 · Design & build", "A fast, premium page — desktop and mobile perfected."],
      ["04 · Launch & measure", "Pixels, events and reporting — then iterate on the data."]
    ],
    faq: [
      ["How fast can a landing page ship?", "Typically within days — a landing page is the fastest premium build JSVita ships. Campaign deadline? Tell us and we plan backwards from it."],
      ["Can it match my ad campaign?", "Yes — message-match between ad and page is standard practice here."],
      ["What does a landing page cost?", "Landing pages start from \u20B91,299 (the Starter package is a single conversion page), depending on copy and integrations. Fixed, itemised proposals only."]
    ],
    related: [["/business-websites", "Business Websites"], ["/startup-websites", "Startup Websites"], ["/ai-automation", "AI & Automation"]],
    caH2: "One page, one goal, zero friction"
  },
  {
    slug: "website-redesign", crumb: "Website Redesign", h1: "Website Redesign",
    title: "Website Redesign — Premium Modernisation | JSVita",
    desc: "Website redesign by JSVita — a dated site rebuilt into a premium, faster, mobile-first experience without disrupting what already works.",
    ogDesc: "Your existing presence, elevated — a premium, faster, mobile-first rebuild without disruption.",
    svcType: "Website redesign",
    svcDesc: "Premium website redesign — modernisation of dated sites into fast, mobile-first, conversion-ready experiences with clean migration.",
    lede: "Modernisation without disruption — your dated site rebuilt into a premium, faster, mobile-first experience, with your rankings protected along the way.",
    includedTitle: "What a redesign includes",
    included: [
      ["Premium visual upgrade", "A bespoke, modern design that retires the dated look for good."],
      ["Speed & Core Web Vitals", "Rebuilt for fast loads and green vital signs."],
      ["Mobile-first rebuild", "Designed for phones first, scaled up to desktop."],
      ["SEO-safe migration", "Redirects, metadata and sitemap handled so rankings follow."],
      ["Content refinement", "Copy sharpened to position and convert — not just re-skinned."],
      ["Analytics rewire", "Clean event tracking so before/after performance is measurable."]
    ],
    stats: [["48h", "Redesign concept demo"], ["0", "Rankings sacrificed — redirects done right"], ["24h", "Response window"]],
    process: [
      ["01 · Audit call", "What's working, what's leaking, what the new site must protect."],
      ["02 · Redesign proposal", "A fixed, itemised scope: pages, migration plan, timeline."],
      ["03 · Rebuild", "Bespoke design and build, with the old site live until switchover."],
      ["04 · Switch & monitor", "Launch with redirects and analytics — then we watch the numbers together."]
    ],
    faq: [
      ["Will we lose our Google rankings?", "Not if it's done right. Redirects, metadata and sitemap work are part of every JSVita redesign — most clients see rankings improve on the faster, better-structured site."],
      ["Can we redesign in stages?", "Yes — highest-impact pages first, staged rollouts that never leave you with a half-broken site."],
      ["What does a redesign cost?", "Redesigns start from \u20B92,999 (Business) depending on page count and migration complexity. Fixed, itemised proposals."]
    ],
    related: [["/website-maintenance", "Website Maintenance"], ["/business-websites", "Business Websites"], ["/branding", "Digital Branding"]],
    caH2: "Keep the equity, lose the dated look"
  },
  {
    slug: "website-maintenance", crumb: "Website Maintenance", h1: "Website Maintenance",
    title: "Website Maintenance — Care Plans | JSVita",
    desc: "Website maintenance by JSVita — updates, security, backups, performance and small improvements on a predictable monthly plan.",
    ogDesc: "Updates, security, backups, performance and small improvements — predictable monthly care.",
    svcType: "Website maintenance",
    svcDesc: "Predictable website maintenance — updates, security, backups, performance monitoring and small improvements on monthly care plans.",
    lede: "Updates, security, backups, performance and small improvements — predictable care so your site never decays, on a simple monthly plan.",
    includedTitle: "What care covers",
    included: [
      ["Updates & security", "Platform, plugin and certificate updates applied and verified."],
      ["Backups", "Scheduled backups with a tested restore path — not just a checkbox."],
      ["Performance monitoring", "Uptime and speed watched; issues fixed before you notice."],
      ["Content updates", "Text, images, new sections and seasonal changes handled for you."],
      ["Small improvements", "A monthly allowance of tweaks — the site keeps getting better."],
      ["Monthly report", "What changed, what was fixed, what's next — in one short note."]
    ],
    stats: [["24h", "Response window"], ["Monthly", "Report & review note"], ["100%", "Documented changes"]],
    process: [
      ["01 · Onboarding audit", "A full health check: speed, security, SEO, backups, broken things."],
      ["02 · Fix-forward", "The audit's findings are fixed first — you start from healthy."],
      ["03 · Monthly care", "Updates, backups, monitoring and your included tweaks."],
      ["04 · Review", "A monthly note: what changed, what's recommended, what's next."]
    ],
    faq: [
      ["What does maintenance cost?", "Care plans are priced monthly after your onboarding audit — most plans land in the same range as the Business package. Fixed monthly fee, cancel any month."],
      ["Do you maintain sites you didn't build?", "Usually, yes — it starts with the onboarding audit; if the foundations are unsound we'll tell you straight."],
      ["Can I pause the plan?", "Yes — plans run month to month. Pause or cancel any month; your site stays yours."]
    ],
    related: [["/website-redesign", "Website Redesign"], ["/business-websites", "Business Websites"], ["/ai-automation", "AI & Automation"]],
    caH2: "Your site, always cared for"
  },
  {
    slug: "ca-services", ca: true, crumb: "JSVita CA Services", h1: "CA Services",
    title: "JSVita CA Services — GST, Tax, Registration & Compliance | CA Mahalakshmi",
    desc: "JSVita CA Services, led by CA Mahalakshmi, Chartered Accountant — GST registration and filing, income tax returns, business registration, accounting, compliance and financial advisory — a division of JSVita.",
    ogDesc: "GST, income tax, business registration, accounting and compliance — led by CA Mahalakshmi, Chartered Accountant.",
    caH2: "Bring the filings to the CA Services desk",
    caServices: [
      ["GST Registration", "Fresh GSTIN — application, scrutiny and certificate, handled end-to-end."],
      ["GST Filing", "GSTR-1 and GSTR-3B filed monthly, reconciled, never missed."],
      ["Income Tax Return Filing", "ITRs for businesses and professionals — accurate, documented, on time."],
      ["Business Registration", "Proprietorship, partnership, LLP or company — plus MSME/Udyam."],
      ["Accounting & Bookkeeping", "Clean monthly books on modern tooling, ready for any review."],
      ["Compliance Services", "Calendars, notices and secretarial hygiene — nothing slips."],
      ["Financial Advisory", "Cash-flow planning, structuring and growth guidance from a CA."]
    ],
    faq: [
      ["Who leads JSVita CA Services?", "The division is managed by CA Mahalakshmi, Chartered Accountant — taxation, accounting and compliance for growing businesses."],
      ["What does a CA consultation cost?", "Consultations start from \u20B9999. Business registration from \u20B94,999 and monthly accounting & compliance at \u20B92,999/month — see the pricing section."],
      ["Can you register my business and build my website together?", "Yes — that's exactly the Startup Launch Package: premium website plus GST registration, business setup guidance, professional email and 30 days of support."]
    ]
  },
  {
    slug: "web-solutions", division: true, crumb: "JSVita Web Solutions", h1: "JSVita Web Solutions",
    title: "JSVita Web Solutions — Premium Website Development | JSVita",
    desc: "JSVita Web Solutions is the website development division of JSVita — business websites, startup websites, portfolio websites, landing pages, website redesign and maintenance, delivered to one premium standard.",
    ogDesc: "Premium website development and digital solutions — the JSVita Web Solutions division.",
    divServices: [
      ["Business Websites", "Premium, high-converting company sites — design, SEO, analytics and launch, end-to-end.", "/business-websites"],
      ["Startup Websites", "Launch-fast sites for new ventures — credibility, clarity and room to scale.", "/startup-websites"],
      ["Portfolio Websites", "Showcase work beautifully with a site built to win clients and opportunities.", "/portfolio-websites"],
      ["Landing Pages", "One page, one goal — campaign-ready pages engineered to convert.", "/landing-pages"],
      ["Website Redesign", "A dated site rebuilt modern, fast and mobile-first — without losing rankings.", "/website-redesign"],
      ["Website Maintenance", "Updates, security, backups and improvements on a predictable monthly plan.", "/website-maintenance"]
    ],
    divFaq: [
      ["What is JSVita Web Solutions?", "JSVita Web Solutions is the website development division of JSVita — business websites, startup websites, portfolio websites, landing pages, redesigns and maintenance, delivered to one premium standard."],
      ["What does a website cost?", "Packages start at \u20B91,299 (Starter) and the most popular Professional package is \u20B94,999 — fixed, itemised proposals, no hourly meters. See the pricing section on the homepage."],
      ["Do you handle GST and company registration too?", "Yes — through JSVita CA Services, the Chartered Accountant division of JSVita managed by CA Mahalakshmi. Many clients launch the website and registrations together with the Startup Launch Package."]
    ]
  }
];

let ok = 0;
for (const p of PAGES) {
  const html = p.ca ? caPage(p) : p.division ? divPage(p) : stdPage(p);
  const file = SRC + "/" + p.slug + ".html";
  fs.writeFileSync(file, html);
  console.log("wrote", file, "(" + html.length + " bytes)");
  ok++;
}
console.log("gen_webpages: " + ok + " pages written");

module.exports = { SRC, fs, LOGO_JS, CSS, HEADER, FOOTER, head, ctaBand, PAGES, COMMON_JS };

/* ============================================================
   Phase 1.1 · Growth service pages — /meta-ads, /lead-generation,
   /ad-creative-design. Same head/header/footer system as stdPage,
   with a Benefits → Numbers → Process → Portfolio (demo-honest)
   → FAQ → Related arc and the shared lead-form runtime.
   ============================================================ */
function growthPage(p) {
  const included = p.included.map(c => `      <div class="card"><h3>${c[0]}</h3><p>${c[1]}</p></div>`).join("\n");
  const stats = p.stats.map(x => `      <div class="stat"><strong>${x[0]}</strong><span>${x[1]}</span></div>`).join("\n");
  const process = p.process.map(x => `      <div class="card"><h3>${x[0]}</h3><p>${x[1]}</p></div>`).join("\n");
  const pf = p.portfolio.map(x => `      <div class="card"><h3>${x[0]}</h3><p>${x[1]}</p><a class="cardlink" href="${x[2]}" data-jv-track="case_details_open" data-jv-info="${p.slug}">View Project &rarr;</a></div>`).join("\n");
  const faq = p.faq.map(q => `    <details><summary>${q[0]}</summary><p>${q[1]}</p></details>`).join("\n");
  const related = p.related.map(r => `      <a href="${r[0]}" data-jv-track="service_page_click" data-jv-info="${r[0].replace("/", "")}">${r[1]}</a>`).join("\n");
  return head(p) + "\n" + HEADER + `

<main class="wrap">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <span>${p.crumb}</span></nav>
  <div class="hero">
    <div class="mark" id="heroLogo"></div>
    <p class="eyebrow">JSVita &middot; Growth Service</p>
    <h1>${p.h1}</h1>
    <p class="lede">${p.lede}</p>
    <div class="ctas">
      <a class="cta" href="/#contact" data-jv-track="service_page_cta" data-jv-info="${p.slug}">Start your project</a>
      <a class="ghost" href="#" data-jv-calendly data-jv-track="consultation_request" data-jv-info="${p.slug}">Book Free Consultation</a>
    </div>
  </div>

  <section class="band">
    <p class="kicker">Benefits</p>
    <h2>${p.includedTitle}</h2>
    <div class="grid3">
${included}
    </div>
  </section>

  <section class="band">
    <p class="kicker">The numbers</p>
    <h2>Measured, not promised</h2>
    <div class="stats">
${stats}
    </div>
  </section>

  <section class="band">
    <p class="kicker">Process</p>
    <h2>How the engagement runs</h2>
    <div class="grid3">
${process}
    </div>
  </section>

  <section class="band">
    <p class="kicker">Portfolio</p>
    <h2>Demo projects that show the standard</h2>
    <p class="sub">${p.pfNote}</p>
    <div class="grid3">
${pf}
    </div>
  </section>

  <section class="band">
    <p class="kicker">FAQ</p>
    <h2>Before you ask</h2>
${faq}
  </section>

  <section class="band">
    <p class="kicker">Related</p>
    <div class="rel">
${related}
    </div>
  </section>
` + ctaBand(p) + FOOTER + "\n" + LOGO_JS.replace("__SLUG__", p.slug) + "\n" + COMMON_JS + "\n</body>\n</html>\n";
}

const GROWTH_PAGES = [
  {
    slug: "meta-ads", crumb: "Meta Ads", h1: "Meta Ads",
    title: "Meta Ads — Full-Funnel Campaigns That Convert | JSVita",
    desc: "Meta Ads management by JSVita — audience targeting, creative testing, lead forms, landing pages, conversion tracking and weekly optimisation across Facebook and Instagram.",
    ogDesc: "Full-funnel Meta campaigns — targeting, creative, tracking and optimisation that fills the pipeline.",
    svcType: "Meta ads campaign management",
    svcDesc: "Full-funnel Meta advertising — audience targeting, creative testing, lead forms, landing pages, pixel and conversion tracking, weekly optimisation.",
    lede: "Advertising that fills the pipeline — full-funnel Meta campaigns on Facebook and Instagram: precise targeting, tested creative, honest tracking and weekly optimisation.",
    includedTitle: "What a JSVita Meta engagement includes",
    included: [
      ["Audience targeting & funnels", "Prospecting and retargeting layers aimed at the people most likely to buy."],
      ["Creative design & testing", "Scroll-stopping ad creatives, produced and tested as a system — not one lucky poster."],
      ["Lead forms & instant capture", "Native Meta lead forms that capture qualified enquiries in two taps."],
      ["Landing pages that convert", "Dedicated campaign pages engineered around one goal per campaign."],
      ["Pixel & conversion tracking", "Events verified end-to-end — every rupee of spend attributable."],
      ["Weekly optimisation & reporting", "Budgets shifted toward what measurably converts, with a plain-language report."]
    ],
    stats: [["Full-funnel", "Prospecting to retargeting"], ["Weekly", "Creative & budget optimisation"], ["100%", "Tracked conversions"]],
    process: [
      ["01 · Brief & audience mapping", "Your offer, your buyers, and the funnel that connects them."],
      ["02 · Campaign architecture", "Prospecting, retargeting and retention layers with clean budgets."],
      ["03 · Creative production", "Ad variants built for testing — hooks, offers and visuals."],
      ["04 · Launch & pixel verification", "Campaigns live with tracking verified before spend scales."],
      ["05 · Optimise & scale", "Weekly testing and shifts toward the ads that earn their budget."]
    ],
    pfNote: "The engagements below are demonstration builds, produced in-house to show the JSVita standard end-to-end. No client results are claimed.",
    portfolio: [
      ["Arka Retail — Festive Ads Sprint", "Demo sprint: 3.8× average ROAS — campaign architecture, 27-variant creative system, layered retargeting.", "/case-arka-ads"],
      ["Krishnan Interiors — Festive Creative Suite", "Demo campaign: 2.4× CTR — 27 ad posters and formats built as one visual system.", "/case-krishnan-creative"]
    ],
    faq: [
      ["What does Meta Ads management cost?", "Ad spend is paid by you directly to Meta; JSVita's management fee depends on campaign scope and is quoted as a fixed monthly amount — see the pricing section and proposal for the exact figure."],
      ["Do you provide the ad creatives too?", "Yes — creative production and testing are part of every engagement, and a dedicated Ad Creative Design sprint is available for larger batches."],
      ["How soon can campaigns go live?", "Typically within days: audience and funnel mapped, creatives produced, pixel verified — then launch. You approve everything before spend starts."],
      ["What results can I expect?", "Honest answer: it depends on your offer, budget and market. What is guaranteed is structure — clean tracking, weekly optimisation and reports that show exactly what every rupee did."],
      ["Do you also build the landing pages?", "Yes — dedicated conversion landing pages are a core JSVita service and the natural pair with any campaign."]
    ],
    related: [["/lead-generation", "Lead Generation"], ["/ad-creative-design", "Ad Creative Design"], ["/landing-pages", "Landing Pages"]],
    caH2: "Turn ad spend into enquiries"
  },
  {
    slug: "lead-generation", crumb: "Lead Generation", h1: "Lead Generation",
    title: "Lead Generation — Systems That Fill the Pipeline | JSVita",
    desc: "Lead generation systems by JSVita — campaigns, lead forms, landing pages, automation and follow-up that turn attention into qualified, tracked enquiries.",
    ogDesc: "Not just traffic — a system: capture, qualification and follow-up engineered so every enquiry is ready to close.",
    svcType: "Lead generation systems",
    svcDesc: "Lead generation systems — capture assets, qualification flows, automated follow-up and CRM-ready pipelines fed by campaigns.",
    lede: "Not just traffic — a system: capture, qualification and automated follow-up engineered so every enquiry lands where it should, ready to close.",
    includedTitle: "What a JSVita lead system includes",
    included: [
      ["Capture assets", "Landing pages and lead forms engineered for one job: converting attention into enquiries."],
      ["Qualification flows", "Fields and logic that filter tyre-kickers before they reach your inbox."],
      ["Automated follow-up", "Instant acknowledgements and routing — no lead waits hours for a first reply."],
      ["CRM-ready pipeline", "Leads delivered to your inbox, sheet or CRM — structured, tagged, auditable."],
      ["Multi-channel campaigns", "Meta, WhatsApp and email working the same pipeline — not three disconnected funnels."],
      ["Reporting & lead quality review", "Where leads came from, what they cost, and how quality trends week over week."]
    ],
    stats: [["0", "Missed enquiries"], ["24h", "Response window"], ["100%", "Leads tracked & attributed"]],
    process: [
      ["01 · Offer & audience", "What you sell, to whom, and the promise that makes them raise a hand."],
      ["02 · Capture build", "Landing page, forms and qualification logic — built and approved."],
      ["03 · Campaign launch", "Traffic switched on with tracking verified end-to-end."],
      ["04 · Automate follow-up", "Routing, acknowledgements and handoff — the pipeline runs itself."],
      ["05 · Measure & refine", "Lead quality reviewed weekly; the system tightens as data accrues."]
    ],
    pfNote: "The engagements below are demonstration builds, produced in-house to show the JSVita standard end-to-end. No client results are claimed.",
    portfolio: [
      ["Patel & Co. — Consultation Funnel", "Demo funnel: one conversion page feeding an AI operations suite — routing, scheduling, reporting.", "/case-patel-co"],
      ["Krishnan Interiors — SEO Growth Engine", "Demo engagement: 3× qualified enquiries through search-first capture.", "/case-krishnan-interiors"]
    ],
    faq: [
      ["What does a lead generation system cost?", "Scoped in the proposal: capture build, campaigns and automation are itemised separately — capture assets start at website-package pricing, campaigns at management-fee pricing. Fixed and itemised, always."],
      ["Are Meta Ads included?", "Campaigns can be run by JSVita (see Meta Ads) or by your team — the capture and follow-up system works with both."],
      ["Where do the leads go?", "Where you work: email, WhatsApp, a Google Sheet or your CRM. Structured and tagged so nothing is lost or duplicated."],
      ["How fast do leads arrive?", "Typically within days of campaigns going live. Quality is reviewed weekly — the goal is leads you can close, not just volume."],
      ["Do you qualify leads before they reach me?", "Yes — form fields, flows and automation filter and route enquiries so your time goes to serious buyers."]
    ],
    related: [["/meta-ads", "Meta Ads"], ["/landing-pages", "Landing Pages"], ["/business-websites", "Business Websites"]],
    caH2: "Build the pipeline once — fill it forever"
  },
  {
    slug: "ad-creative-design", crumb: "Ad Creative Design", h1: "Ad Creative Design",
    title: "Ad Creative Design — Scroll-Stopping Campaign Assets | JSVita",
    desc: "Ad creative design by JSVita — scroll-stopping ad posters, story and reel formats, catalogue creatives and a branded template kit, built as one tested system.",
    ogDesc: "Ad posters, story formats and campaign visuals designed as one system — built to be tested, not just admired.",
    svcType: "Ad creative design",
    svcDesc: "Ad creative design — ad posters, story and reel formats, feed and catalogue creatives, branded template kits and testing variants.",
    lede: "Creatives that stop the scroll — ad posters, story formats and campaign visuals designed as one system, built to be tested, not just admired.",
    includedTitle: "What a JSVita creative sprint includes",
    included: [
      ["Ad poster system", "Scroll-stopping posters with a locked layout language and offer hierarchy."],
      ["Story & reel formats", "Vertical variants engineered for thumb-stop in the first second."],
      ["Feed & catalogue creatives", "Product and project showcases that survive compression."],
      ["Branded template kit", "A kit your team can extend without breaking the visual system."],
      ["Hook & offer variants", "Testing variants per concept — creative volume with discipline."],
      ["Every size, every placement", "Delivered crop-perfect for every placement you run."]
    ],
    stats: [["27", "Creatives in a demo sprint"], ["5 days", "Demo turnaround"], ["1", "Visual system across formats"]],
    process: [
      ["01 · Brief & references", "The campaign, the offer and the feeds your audience lives in."],
      ["02 · Visual system", "Layout language, type and colour locked before production."],
      ["03 · Production", "The batch — posters, stories, feed sets — built to the system."],
      ["04 · Review", "You approve; refinements happen inside the system, not outside it."],
      ["05 · Delivery & template kit", "Every size and placement, plus the kit for what comes next."]
    ],
    pfNote: "The engagements below are demonstration builds, produced in-house to show the JSVita standard end-to-end. No client results are claimed.",
    portfolio: [
      ["Krishnan Interiors — Festive Creative Suite", "Demo sprint: 27 creatives in 5 days — 2.4× CTR versus the previous season.", "/case-krishnan-creative"],
      ["Arka Retail — Festive Ads Sprint", "Demo campaign creative: the 27-variant testing system behind 3.8× ROAS.", "/case-arka-ads"]
    ],
    faq: [
      ["How many creatives do I get?", "Scoped in the proposal — sprints typically batch 10–30 assets across placements, built as one system rather than one-off posts."],
      ["Do you design for platforms beyond Meta?", "Yes — Google Display, print and catalogue formats on request; the system flexes to the placement."],
      ["Can you match my existing brand?", "Yes — or, if there is no brand system yet, the sprint builds the kit as it goes."],
      ["What does a creative sprint cost?", "Priced per batch and itemised in the proposal — most sprints land between landing-page and Business-package pricing."],
      ["Do you write the copy too?", "Yes — hooks and offer copy are part of every creative, written to be tested."]
    ],
    related: [["/meta-ads", "Meta Ads"], ["/lead-generation", "Lead Generation"], ["/branding", "Digital Branding"]],
    caH2: "Creative that earns its placement"
  }
];

for (const p of GROWTH_PAGES) {
  const html = growthPage(p);
  const file = SRC + "/" + p.slug + ".html";
  fs.writeFileSync(file, html);
  console.log("wrote", file, "(" + html.length + " bytes)");
}
