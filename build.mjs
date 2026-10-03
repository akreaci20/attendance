// Cloudflare Pages build step:  node build.mjs   (output directory: dist)
// Copies the static site to dist/ and writes dist/js/config.js from environment variables,
// so the SAME repository can be deployed for any institute by changing only the env values.
import { cpSync, mkdirSync, rmSync, writeFileSync, existsSync } from "node:fs";

const url = (process.env.SUPABASE_URL || "").trim();
const key = (process.env.SUPABASE_PUBLISHABLE_KEY || "").trim();
const domain = (process.env.AUTH_EMAIL_DOMAIN || "login.local").trim();

if (!url || !key) {
  console.error("ERROR: set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in the Cloudflare Pages environment variables.");
  process.exit(1);
}
if (/service_role/i.test(key) || key.split(".").length === 3 && JSON.parse(Buffer.from(key.split(".")[1], "base64url").toString()).role === "service_role") {
  console.error("ERROR: that looks like a service_role key. Never use it in the frontend. Use the publishable/anon key.");
  process.exit(1);
}

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist/js", { recursive: true });
for (const f of ["login.html", "index.html", "absentapi.html"]) if (existsSync(f)) cpSync(f, `dist/${f}`);
for (const d of ["css", "assets"]) if (existsSync(d)) cpSync(d, `dist/${d}`, { recursive: true });
cpSync("js", "dist/js", { recursive: true });
rmSync("dist/js/config.js", { force: true });
rmSync("dist/js/config.example.js", { force: true });
if (existsSync("_headers")) cpSync("_headers", "dist/_headers");

writeFileSync(
  "dist/js/config.js",
  `window.APP_CONFIG = ${JSON.stringify({ SUPABASE_URL: url, SUPABASE_PUBLISHABLE_KEY: key, AUTH_EMAIL_DOMAIN: domain }, null, 2)};\n`
);
console.log("Built dist/ for", url);
