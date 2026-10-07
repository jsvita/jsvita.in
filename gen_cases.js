#!/usr/bin/env node
/* gen_cases.js — Phase 2.0: /portfolio, /case-studies hub, 6 /case-* pages, /contact.
   Consumes shared template pieces from gen_webpages.js; content from gen_cases_data.js.
   Idempotent: re-running overwrites all files with current copy. */
const W = require("./gen_webpages.js");
const { SRC, fs, LOGO_JS, HEADER, FOOTER, head, ctaBand, COMMON_JS } = W;
const { CASES, CATS } = require("./gen_cases_data.js");

const EXTRA = `
.ba-grid{display:grid;gap:16px;margin-top:28px}
@media(min-width:760px){.ba-grid{grid-template-columns:1fr 1fr}}
.ba-card{border-radius:18px;padding:22px;border:1px solid rgba(212,175,55,.2);background:linear-gradient(160deg,rgba(36,28,21,.9),rgba(23,17,12,.9))}
.ba-card h3{font:700 13px "JetBrains Mono",monospace;letter-spacing:.22em;text-transform:uppercase;margin:0 0 12px}
.ba-before h3{color:#B9AC9E}
.ba-after{border-color:rgba(212,175,55,.5);background:linear-gradient(160deg,rgba(212,175,55,.14),rgba(23,17,12,.92))}
.ba-after h3{color:#F7D774}
.ba-card li{list-style:none;padding:9px 0 9px 26px;position:relative;color:#D8CCBE;font-size:14.5px;border-bottom:1px solid rgba(212,175,55,.1)}
.ba-card li:last-child{border-bottom:0}
.ba-card li::before{content:"\\2014";position:absolute;left:2px;color:#8D8275}
.ba-after li::before{content:"\\2713";color:#F7D774;font-weight:700}
.exec{display:grid;gap:14px;margin-top:26px}
@media(min-width:700px){.exec{grid-template-columns:1fr 1fr}}
.exec .card h3{color:#F7D774;font-size:15.5px}
.stats{display:grid;gap:14px;margin-top:26px;grid-template-columns:repeat(3,1fr)}
.stat{padding:18px 12px;border-radius:14px;border:1px solid rgba(212,175,55,.22);background:rgba(212,175,55,.06);text-align:center}
.stat strong{display:block;font:800 26px/1.1 "Playfair Display",Georgia,serif;background:linear-gradient(100deg,#fdf8ec,#f7d774 45%,#d4af37);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.stat span{display:block;margin-top:6px;font:600 10px/1.3 "JetBrains Mono",monospace;letter-spacing:.14em;text-transform:uppercase;color:#8D8275}
.pt-mock{display:flex;justify-content:center;margin-bottom:16px}
.pt-mock svg{width:100%;max-width:280px;height:auto;filter:drop-shadow(0 16px 26px rgba(0,0,0,.45))}
.pt-mock.phone svg{max-width:132px}
.pcard{border:1px solid rgba(212,175,55,.2);background:linear-gradient(160deg,rgba(36,28,21,.9),rgba(23,17,12,.9));border-radius:18px;padding:20px;display:flex;flex-direction:column}
.pcard h3{color:#F7D774;font-size:16.5px}
.pcard .ind{font:600 10px "JetBrains Mono",monospace;letter-spacing:.14em;text-transform:uppercase;color:#8D8275;margin:4px 0 10px}
.pcard p{color:#B9AC9E;font-size:14px;margin-top:6px}
.pcard .res{color:#F7D774}
.pcard a{display:inline-flex;margin-top:14px;padding:10px 18px;border-radius:999px;border:1px solid rgba(212,175,55,.35);color:#F7D774;text-decoration:none;font:600 12.5px "DM Sans",sans-serif;transition:background .2s}
.pcard a:hover{background:rgba(212,175,55,.1)}
.act{display:grid;gap:14px;margin-top:26px}
@media(min-width:700px){.act{grid-template-columns:repeat(3,1fr)}}
.act .card{text-align:center}
.act .card .big{font:800 17px "Playfair Display",Georgia,serif;color:#F7D774;margin-top:8px}
.demo-badge{display:inline-block;margin:0 0 12px;padding:5px 13px;border-radius:999px;border:1px solid rgba(212,175,55,.5);background:rgba(212,175,55,.1);color:#F7D774;font:700 10px/1 "JetBrains Mono",monospace;letter-spacing:.16em;text-transform:uppercase}
.pcard-demo{border-style:dashed}
.pc-status{color:#B9AC9E;font-size:13.5px}
.pc-status strong{color:#F7D774}
.cs-tech,.cs-lessons{display:grid;gap:10px;margin-top:22px;padding:0;list-style:none}
@media(min-width:700px){.cs-tech{grid-template-columns:repeat(2,1fr)}}
.cs-tech li,.cs-lessons li{list-style:none;position:relative;padding:12px 16px 12px 42px;border:1px solid rgba(212,175,55,.22);border-radius:12px;background:rgba(212,175,55,.06);color:#D8CCBE;font-size:14.5px}
.cs-tech li::before{content:"\\2713";position:absolute;left:14px;top:12px;color:#F7D774;font-weight:700}
.cs-lessons li::before{content:"\\2192";position:absolute;left:14px;top:12px;color:#F7D774;font-weight:700}
.cs-gallery{display:flex;gap:28px;justify-content:center;align-items:flex-start;flex-wrap:wrap;margin-top:24px}
.cs-gallery .pt-mock{margin-bottom:0}
.cs-g-desktop{flex:1 1 340px;max-width:560px}
.cs-g-desktop svg{max-width:100%;width:100%}
.cs-g-mobile{flex:0 0 auto;max-width:150px}
`;

/* device mocks (static gold fills — no defs needed) */
function lapMock() {
  return '<svg viewBox="0 0 320 196" role="img" aria-label="Project preview on a laptop">'
    + '<rect x="22" y="6" width="276" height="156" rx="10" fill="rgba(20,14,8,.85)" stroke="rgba(212,175,55,.32)"/>'
    + '<rect x="22" y="6" width="276" height="24" rx="10" fill="rgba(212,175,55,.08)"/>'
    + '<circle cx="36" cy="18" r="3.2" fill="#D4AF37" opacity=".8"/><circle cx="47" cy="18" r="3.2" fill="#D4AF37" opacity=".5"/><circle cx="58" cy="18" r="3.2" fill="#D4AF37" opacity=".3"/>'
    + '<rect x="96" y="14" width="128" height="8" rx="4" fill="#B9AC9E" opacity=".28"/>'
    + '<rect x="40" y="46" width="110" height="11" rx="5" fill="#F7D774" opacity=".85"/>'
    + '<rect x="40" y="66" width="82" height="6" rx="3" fill="#B9AC9E" opacity=".5"/>'
    + '<rect x="40" y="80" width="96" height="6" rx="3" fill="#B9AC9E" opacity=".35"/>'
    + '<rect x="40" y="98" width="70" height="18" rx="9" fill="rgba(212,175,55,.55)"/>'
    + '<rect x="186" y="46" width="94" height="70" rx="8" fill="none" stroke="rgba(212,175,55,.4)"/>'
    + '<path d="M196 104 L214 92 L232 100 L250 84 L268 92" fill="none" stroke="#F7D774" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'
    + '<rect x="186" y="122" width="94" height="26" rx="6" fill="none" stroke="rgba(212,175,55,.3)"/>'
    + '<rect x="196" y="132" width="52" height="6" rx="3" fill="#B9AC9E" opacity=".4"/>'
    + '<rect x="6" y="166" width="308" height="12" rx="6" fill="rgba(212,175,55,.16)"/>'
    + '<rect x="136" y="166" width="48" height="5" rx="2.5" fill="rgba(20,14,8,.9)"/></svg>';
}
function phoneMock() {
  return '<svg viewBox="0 0 140 240" role="img" aria-label="Project preview on a phone">'
    + '<rect x="12" y="4" width="116" height="232" rx="24" fill="rgba(20,14,8,.85)" stroke="rgba(212,175,55,.32)"/>'
    + '<rect x="52" y="10" width="36" height="8" rx="4" fill="rgba(212,175,55,.35)"/>'
    + '<rect x="22" y="28" width="96" height="188" rx="14" fill="rgba(212,175,55,.05)"/>'
    + '<rect x="32" y="42" width="64" height="9" rx="4.5" fill="#F7D774" opacity=".85"/>'
    + '<rect x="32" y="58" width="44" height="5" rx="2.5" fill="#B9AC9E" opacity=".5"/>'
    + '<rect x="32" y="72" width="76" height="52" rx="8" fill="none" stroke="rgba(212,175,55,.4)"/>'
    + '<path d="M40 112 L54 100 L68 106 L82 92 L96 98" fill="none" stroke="#F7D774" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'
    + '<rect x="32" y="132" width="36" height="30" rx="6" fill="none" stroke="rgba(212,175,55,.35)"/>'
    + '<rect x="74" y="132" width="36" height="30" rx="6" fill="none" stroke="rgba(212,175,55,.35)"/>'
    + '<rect x="32" y="170" width="76" height="20" rx="10" fill="rgba(212,175,55,.55)"/></svg>';
}
function mock(c, slug) {
  const art = c.phone ? phoneMock() : lapMock();
  return '<div class="pt-mock' + (c.phone ? " phone" : "") + '" aria-hidden="true">' + art + "</div>";
}

/* ---- case page ---- */
function casePage(c) {
  const stats = c.stats.map(s => `      <div class="stat"><strong>${s[0]}</strong><span>${s[1]}</span></div>`).join("\n");
  const exec = c.execution.map(e => `      <div class="card"><h3>${e[0]}</h3><p>${e[1]}</p></div>`).join("\n");
  const design = (c.design || []).map(e => `      <div class="card"><h3>${e[0]}</h3><p>${e[1]}</p></div>`).join("\n");
  const tech = (c.tech || ["Bespoke JSVita build"]).map(t => `        <li>${t}</li>`).join("\n");
  const lessons = (c.lessons || []).map(l => `        <li>${l}</li>`).join("\n");
  const before = c.before.map(b => `        <li>${b}</li>`).join("\n");
  const after = c.after.map(a => `        <li>${a}</li>`).join("\n");
  const others = CASES.filter(x => x.slug !== c.slug).slice(0, 3)
    .map(x => `      <a href="/${x.slug}" data-jv-track="case_details_open" data-jv-info="${c.slug}-rel">${x.name}</a>`).join("\n      ");
  const p = { slug: c.slug, crumb: c.short, title: c.title, desc: c.desc, ogDesc: c.ogDesc, svcType: c.svcType, svcDesc: c.svcDesc, extraCss: EXTRA };
  return head(p) + "\n" + HEADER + `

<main class="wrap">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/case-studies">Case Studies</a> / <span>${c.short}</span></nav>
  <div class="hero">
    <div class="mark" id="heroLogo"></div>
    <p class="eyebrow">Case Study &middot; ${c.cat}</p>
    <h1>${c.name}</h1>
    <p class="lede">${c.industry} &mdash; ${c.tagline}</p>
    <p class="demo-note">${c.slug === "case-jsvita-platform" ? "Internal project" : "Demonstration project"} \u2014 designed and built in-house by JSVita to show the standard, not client work. Project Status: ${c.status || "Delivered \u00b7 Demo Build"}.</p>
    <div class="ctas">
      <a class="cta" href="/#contact" data-jv-track="service_page_cta" data-jv-info="${c.slug}">Start a similar project</a>
      <a class="ghost" href="#" data-jv-calendly data-jv-track="consultation_request" data-jv-info="${c.slug}">Book Free Consultation</a>
    </div>
  </div>

  <section class="band">
    <div class="stats" style="margin-top:0">
${stats}
    </div>
  </section>

  <section class="band">
    <p class="kicker">Overview</p>
    <h2>The engagement at a glance</h2>
    <p class="sub">${c.overview || c.tagline}</p>
  </section>

  <section class="band">
    <p class="kicker">Challenge</p>
    <h2>Where they started</h2>
    <p class="sub">${c.challenge}</p>
  </section>

  <section class="band">
    <p class="kicker">Research</p>
    <h2>What the research showed</h2>
    <p class="sub">${c.research || c.strategy}</p>
  </section>

  <section class="band">
    <p class="kicker">Design Process</p>
    <h2>From brief to visual system</h2>
    <div class="exec">
${design}
    </div>
  </section>

  <section class="band">
    <p class="kicker">Development Process</p>
    <h2>What we built</h2>
    <div class="exec">
${exec}
    </div>
  </section>

  <section class="band">
    <p class="kicker">Technology Stack</p>
    <h2>The stack behind it</h2>
    <ul class="cs-tech">
${tech}
    </ul>
  </section>

  <section class="band">
    <p class="kicker">Outcome</p>
    <h2>What it earned</h2>
    <p class="sub">${c.result}</p>
    <div class="ba-grid">
      <div class="ba-card ba-before">
        <h3>Before JSVita</h3>
        <ul>
${before}
        </ul>
      </div>
      <div class="ba-card ba-after">
        <h3>After JSVita</h3>
        <ul>
${after}
        </ul>
      </div>
    </div>
  </section>

  <section class="band">
    <p class="kicker">Lessons Learned</p>
    <h2>What it taught us</h2>
    <ul class="cs-lessons">
${lessons}
    </ul>
  </section>

  <section class="band">
    <p class="kicker">Project Gallery</p>
    <h2>Desktop and mobile previews</h2>
    <div class="cs-gallery">
      <div class="cs-g-desktop pt-mock">${lapMock()}</div>
      <div class="cs-g-mobile pt-mock phone">${phoneMock()}</div>
    </div>
  </section>

  <section class="band">
    <p class="kicker">Related</p>
    <div class="rel">
${others}
      <a href="/portfolio" data-jv-track="service_page_click" data-jv-info="${c.slug}">Full portfolio</a>
    </div>
  </section>
` + ctaBand({ h1: c.name, slug: c.slug }) + FOOTER + "\n" + LOGO_JS.replace("__SLUG__", c.slug) + "\n" + COMMON_JS + "\n</body>\n</html>\n";
}

/* ---- portfolio page ---- */
function portfolioPage() {
  const sections = CATS.map(cat => {
    const cards = CASES.filter(c => c.cat === cat)
      .map(c => `      <article class="pcard pcard-demo">${mock(c)}<h3>${c.name}</h3><p class="ind">${c.cat} \u00b7 ${c.industry}</p><span class="demo-badge">Demo Project</span><p class="pc-status"><strong>Project Status</strong> \u2014 ${c.status || "Delivered \u00b7 Demo Build"}</p><p><strong>Challenge</strong> \u2014 ${c.objective || c.tagline}</p><p><strong>Solution</strong> \u2014 ${c.strategy}</p><p><strong>Technology</strong> \u2014 ${c.cat} \u00b7 bespoke JSVita build</p><p class="res"><strong>Outcome</strong> \u2014 ${c.stats[0][0]} ${c.stats[0][1].toLowerCase()}</p><a href="/${c.slug}" data-jv-track="case_details_open" data-jv-info="portfolio">View Project</a></article>`)
      .join("\n");
    return `  <section class="band">
    <p class="kicker">${cat}</p>
    <div class="grid3" style="margin-top:18px">
${cards}
    </div>
  </section>`;
  }).join("\n");
  const p = {
    slug: "portfolio", crumb: "Portfolio", h1: "Portfolio",
    title: "Portfolio — Websites, Meta Ads & Creative | JSVita",
    desc: "The JSVita portfolio — business websites, landing pages, Meta Ads campaigns and creative design engagements, each with the result it earned.",
    ogDesc: "Websites, campaigns and creative — the JSVita portfolio, with results.",
    svcType: "Web development portfolio", svcDesc: "Selected JSVita engagements across websites, campaigns and creative design.",
    extraCss: EXTRA
  };
  return head(p) + "\n" + HEADER + `

<main class="wrap">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <span>Portfolio</span></nav>
  <div class="hero">
    <div class="mark" id="heroLogo"></div>
    <p class="eyebrow">Portfolio</p>
    <h1>Work that grows businesses</h1>
    <p class="lede">Selected engagements across <strong>websites, Meta Ads campaigns and creative design</strong> \u2014 each delivered to the JSVita standard, each with the result it earned.</p>
    <div class="ctas">
      <a class="cta" href="/#contact" data-jv-track="service_page_cta" data-jv-info="portfolio">Start Your Project</a>
      <a class="ghost" href="/#pricing" data-jv-track="view_pricing_click" data-jv-info="portfolio">View Pricing</a>
    </div>
  </div>

${sections}

  <section class="band">
    <p class="kicker">Honest by default</p>
    <h2>Demonstration work, clearly labelled</h2>
    <p class="sub">Every project shown here is a demonstration build produced in-house by JSVita — labelled Demo Project or Internal Project, never presented as client work. They exist to show the standard every real engagement is held to. Real client stories are added here as verified engagements complete.</p>
  </section>

  <section class="band">
    <p class="kicker">Every engagement, broken down</p>
    <h2>Read the case studies</h2>
    <div class="rel" style="margin-top:22px">
${CASES.map(c => `      <a href="/${c.slug}" data-jv-track="case_details_open" data-jv-info="portfolio-hub">${c.name}</a>`).join("\n")}
    </div>
  </section>
` + ctaBand(p) + FOOTER + "\n" + LOGO_JS.replace("__SLUG__", p.slug) + "\n" + COMMON_JS + "\n</body>\n</html>\n";
}

/* ---- case-studies hub ---- */
function caseHubPage() {
  const cards = CASES.map(c => `      <article class="pcard pcard-demo">${mock(c)}<h3>${c.name}</h3><p class="ind">${c.cat} \u00b7 ${c.industry}</p><span class="demo-badge">Demo Project</span><p class="pc-status"><strong>Project Status</strong> \u2014 ${c.status || "Delivered \u00b7 Demo Build"}</p><p>${c.tagline}</p><p class="res"><strong>Outcome</strong> \u2014 ${c.stats[0][0]} ${c.stats[0][1].toLowerCase()}</p><a href="/${c.slug}" data-jv-track="case_details_open" data-jv-info="case-hub">View Project</a></article>`).join("\n");
  const p = {
    slug: "case-studies", crumb: "Case Studies", h1: "Case Studies",
    title: "Case Studies — Overview, Research, Process & Outcome | JSVita",
    desc: "JSVita case studies — overview, challenge, research, design and development process, technology stack, outcome and lessons learned for every engagement.",
    ogDesc: "From overview to lessons learned — every JSVita case study, fully documented.",
    svcType: "Digital project case studies", svcDesc: "Detailed JSVita case studies across web, campaigns and creative.",
    extraCss: EXTRA
  };
  return head(p) + "\n" + HEADER + `

<main class="wrap">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <span>Case Studies</span></nav>
  <div class="hero">
    <div class="mark" id="heroLogo"></div>
    <p class="eyebrow">Case Studies</p>
    <h1>Proof, not promises</h1>
    <p class="lede">Every engagement follows one structure: <strong>Overview</strong>, <strong>Challenge</strong>, <strong>Research</strong>, <strong>Design Process</strong>, <strong>Development Process</strong>, <strong>Technology Stack</strong>, <strong>Outcome</strong>, <strong>Lessons Learned</strong> and <strong>Project Gallery</strong> \u2014 no gaps, no varnish. Demonstration work is labelled as such.</p>
  </div>

  <section class="band">
    <div class="grid3" style="margin-top:0">
${cards}
    </div>
  </section>

  <section class="band">
    <p class="kicker">Next step</p>
    <h2>Yours could be next</h2>
    <p class="sub">Tell JSVita what growth looks like for your business \u2014 get a fixed, itemised proposal within 24 hours.</p>
    <div class="ctas">
      <a class="cta" href="/#contact" data-jv-track="service_page_cta" data-jv-info="case-studies">Start Your Project</a>
      <a class="ghost" href="/portfolio" data-jv-track="service_page_click" data-jv-info="case-studies">Browse the portfolio</a>
    </div>
  </section>
` + ctaBand(p) + FOOTER + "\n" + LOGO_JS.replace("__SLUG__", p.slug) + "\n" + COMMON_JS + "\n</body>\n</html>\n";
}

/* ---- contact page ---- */
function contactPage() {
  const trust = ["Response within 24 hours", "Free consultation", "Direct communication", "Transparent pricing"]
    .map(t => `        <div class="card" style="text-align:center;padding:14px"><p style="margin:0;color:#F7D774;font:700 14px 'DM Sans',sans-serif">\u2713 ${t}</p></div>`).join("\n");
  const p = {
    slug: "contact", crumb: "Contact", h1: "Contact JSVita",
    title: "Contact JSVita — WhatsApp, Book a Call or Email | 24h Response",
    desc: "Contact JSVita directly — WhatsApp consultation, a scheduled call or email. Response within 24 hours, free consultation, transparent pricing.",
    ogDesc: "Three direct lines to JSVita — WhatsApp, call or email. 24-hour response.",
    svcType: "Digital services enquiry", svcDesc: "Contact JSVita for websites, Meta Ads campaigns, creative design and CA services.",
    extraCss: EXTRA
  };
  return head(p) + "\n" + HEADER + `

<main class="wrap">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <span>Contact</span></nav>
  <div class="hero">
    <div class="mark" id="heroLogo"></div>
    <p class="eyebrow">Contact JSVita</p>
    <h1>Talk to JSVita</h1>
    <p class="lede">Three direct lines, no gatekeepers \u2014 <strong>WhatsApp, a scheduled call, or email</strong>. Response within 24 hours, every working day.</p>
    <div class="ctas">
      <a class="cta" href="https://wa.me/916361792699?text=Hi%20JSVita%20%E2%80%94%20I%27d%20like%20to%20start%20a%20project." target="_blank" rel="noopener" data-jv-track="finance_whatsapp_click" data-jv-info="contact-page">WhatsApp Consultation</a>
      <a class="ghost" href="#" data-jv-calendly data-jv-track="consultation_request" data-jv-info="contact-page">Book a Call</a>
      <a class="ghost" href="mailto:hello@jsvita.in" data-jv-track="email_click" data-jv-info="contact-page">Email JSVita</a>
    </div>
    <p class="demo-note">Email — general enquiries: <a href="mailto:hello@jsvita.in" style="color:#F7D774">hello@jsvita.in</a> &middot; project support: <a href="mailto:support@jsvita.in" style="color:#F7D774">support@jsvita.in</a></p>
  </div>

  <section class="band">
    <p class="kicker">Trust indicators</p>
    <h2>What you can count on</h2>
    <div class="grid3" style="grid-template-columns:repeat(2,1fr);margin-top:18px">
${trust}
    </div>
  </section>

  <section class="band">
    <p class="kicker">Or send the brief</p>
    <h2>Tell us what you need built</h2>
    <form class="fform" data-jv-lead-form="contact" data-jv-lead-subject="New contact enquiry — jsvita.in/contact">
      <input type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute!important;left:-9999px;height:1px;width:1px;opacity:0;pointer-events:none">
      <div class="frow2">
        <div><label for="ct-name">Name</label><input id="ct-name" name="Name" placeholder="Your name" required></div>
        <div><label for="ct-email">Email or WhatsApp</label><input id="ct-email" name="Email" placeholder="you@company.com" required></div>
      </div>
      <div class="frow2">
        <div><label for="ct-business">Business Name</label><input id="ct-business" name="Business Name" placeholder="Company or brand"></div>
        <div><label for="ct-phone">Phone</label><input id="ct-phone" name="Phone" type="tel" placeholder="Phone / WhatsApp number"></div>
      </div>
      <div style="margin-top:14px"><label for="ct-service">Service</label>
        <select id="ct-service" name="Service">
          <option>Business Website</option>
          <option>Startup Website</option>
          <option>Portfolio Website</option>
          <option>Landing Page</option>
          <option>Website Redesign</option>
          <option>Website Maintenance</option>
          <option>Meta Ads / Lead Generation</option>
          <option>Creative Design</option>
          <option>GST / Tax / Compliance</option>
          <option>Not sure yet</option>
        </select>
      </div>
      <div style="margin-top:14px"><label for="ct-budget">Budget Range</label>
        <select id="ct-budget" name="Budget">
          <option value="" disabled selected>Select a budget range</option>
          <option>₹1,299 – ₹2,999</option>
          <option>₹2,999 – ₹4,999</option>
          <option>₹4,999 – ₹7,999</option>
          <option>₹7,999 – ₹12,999</option>
          <option>₹12,999+</option>
        </select>
      </div>
      <div style="margin-top:14px"><label for="ct-timeline">Expected Timeline</label>
        <select id="ct-timeline" name="Project Timeline">
          <option value="" disabled selected>When do you need this?</option>
          <option>Immediately / ASAP</option>
          <option>Within 1\u20132 weeks</option>
          <option>Within 1 month</option>
          <option>1\u20133 months</option>
          <option>Flexible / planning ahead</option>
        </select>
      </div>
      <div style="margin-top:14px"><label for="ct-method">Preferred Contact Method</label>
        <select id="ct-method" name="Preferred Contact Method">
          <option value="" disabled selected>How should we reach you?</option>
          <option>WhatsApp</option>
          <option>Phone Call</option>
          <option>Email</option>
        </select>
      </div>
      <div style="margin-top:14px"><label for="ct-msg">Details</label><textarea id="ct-msg" name="Details" placeholder="Tell us about your business and what success looks like&#8230;" required></textarea></div>
      <button type="submit">Start Your Project</button>
    </form>
  </section>

  <section class="band">
    <p class="kicker">Related</p>
    <div class="rel">
      <a href="/#pricing" data-jv-track="service_page_cta" data-jv-info="contact">Pricing</a>
      <a href="/portfolio" data-jv-track="service_page_click" data-jv-info="contact">Portfolio</a>
      <a href="/case-studies" data-jv-track="case_details_open" data-jv-info="contact">Case Studies</a>
      <a href="/ca-services" data-jv-track="division_click" data-jv-info="contact">JSVita CA Services</a>
    </div>
  </section>
` + ctaBand(p) + FOOTER + "\n" + LOGO_JS.replace("__SLUG__", p.slug) + "\n" + COMMON_JS + "\n</body>\n</html>\n";
}

/* ---- write ---- */
let n = 0;
const files = [
  ["portfolio.html", portfolioPage()],
  ["case-studies.html", caseHubPage()],
  ["contact.html", contactPage()]
];
for (const c of CASES) files.push([c.slug + ".html", casePage(c)]);
for (const [file, html] of files) {
  fs.writeFileSync(SRC + "/" + file, html);
  console.log("wrote", file, "(" + html.length + " bytes)");
  n++;
}
console.log("gen_cases: " + n + " pages written");
