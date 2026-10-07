#!/usr/bin/env node
/* patch_hero3.js — replace the previously injected hero block with current css+js */
const fs = require("fs");
const path = require("path");
const MIRROR = "C:/Users/JSVita/AppData/Local/Temp/oldsite/mirror";
const SRC = "C:/Users/JSVita/Downloads/JSVita";
const INDEX = path.join(MIRROR, "index.html");

const css = fs.readFileSync(path.join(SRC, "hero_styles.css"), "utf8");
const js = fs.readFileSync(path.join(SRC, "hero_script.js"), "utf8").replace(/<\/script>/g, "<\\/script>");

const re = /<style data-pg="hero-premium">[\s\S]*?<\/style>\s*<script data-pg="hero-premium">[\s\S]*?<\/script>/;
let h = fs.readFileSync(INDEX, "utf8");
const block =
  '<style data-pg="hero-premium">\n' + css + "\n    </style>\n    " +
  '<script data-pg="hero-premium">' + js + "</script>";

if (!re.test(h)) { console.error("MISS  existing hero block not found"); process.exit(1); }
h = h.replace(re, block);
fs.writeFileSync(INDEX, h);
console.log("OK    hero block replaced with current version");
console.log("sanity: section#top in html =", h.indexOf("section#top") !== -1);
