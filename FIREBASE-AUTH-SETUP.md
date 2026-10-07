# Firebase Authentication — Professional Setup Runbook (JSVita)

Project: **jsvita-login** · Login page: `login.html` · Production: **https://jsvita.in**
Auth domain target: **auth.jsvita.in** · Email domain: **jsvita.in** · Sender: **JSVita Team \<noreply@jsvita.in\>**

---

## ⚡ Live status (2026-10-07 — Google Sign-In fix shipped)

| Item | State |
|---|---|
| Root cause of the "blank white `__/auth/handler`" hang | ✅ **FOUND & FIXED** — login page CSP (`frame-src`) allowed only `*.firebaseapp.com|*.firebaseio.com`, so the SDK's widget iframe on `auth.jsvita.in` was refused; popup never completed the handshake. `frame-src` now allows `https://auth.jsvita.in`. |
| Hardening | ✅ `authDomain` pinned to the default `jsvita-login.firebaseapp.com` in login.html (widget path, always implicitly authorized); [jv-auth] console logging of every auth-state change, popup success/error, redirect result; press-and-hold the Google button (700 ms) = full-page redirect fallback. |
| Authorized domains (verified live via Identity Toolkit API) | ✅ `localhost`, `jsvita-login.firebaseapp.com`, `jsvita-login.web.app`, `jsvita.in`, `auth.jsvita.in` — ⚠️ add `www.jsvita.in` in Console for completeness. |
| `auth.jsvita.in` handler + scripts (`handler.js`, `experiments.js`) | ✅ LIVE (curl HTTP 200, byte-identical to firebaseapp.com) — the Sep 27 DNS record went through; hosting custom domain is serving correctly. |
| Google provider | ✅ enabled (the sign-in popup opened and fetched the Google project config) |
| Authorized domains incl. `jsvita.in` + `auth.jsvita.in` (2026-09-27 API setup) | ✅ **LIVE** (verified via API) |
| `auth.jsvita.in` connected to Hosting site `jsvita-login` | ✅ **REGISTERED** — awaiting DNS (`dnsStatus: DNS_MISSING`) |
| Custom email domain `jsvita.in` verification | 🟡 **IN_PROGRESS** — will pass after DNS; then Apply in console |
| Email templates (sender, subject, body) | ❌ **BLOCKED by Google**: `EMAIL_TEMPLATE_UPDATE_NOT_ALLOWED` — free-tier Firebase Auth restriction; requires Blaze/Identity Platform upgrade OR Firebase Support |
| Action URL → `auth.jsvita.in/__/auth/action` | ❌ Same block (part of same config gate) |
| Site code (`login.html`, `index.html` in GitHub repo) | ✅ fixed & committed locally — **push only after DNS is live** |

**DNS record to add at Squarespace (from Firebase's own API response):**

| Type | Host | Value |
|---|---|---|
| A | `auth` | `199.36.158.100` |

After adding: verification auto-completes, SSL mints (~10–60 min), then re-run
`node scripts/firebase-auth-setup.mjs --check` or the domain:verify curl to confirm.

## 0. What exists already (done in this repo)

| Item | Status |
|---|---|
| `login.html` — `authDomain` switched to `auth.jsvita.in` | ✅ done |
| `firebase.json` — Hosting config for `auth.jsvita.in` site (SPA fallback + security headers) | ✅ done |
| `.firebaserc` — project alias `default → jsvita-login` | ✅ done |
| `hosting/` — branded landing page, `__/auth` fallback pages, 404, robots.txt | ✅ done |
| `scripts/firebase-auth-setup.mjs` — sets authorized domains, sender identity, all 3 email templates, action URL via **Identity Toolkit Admin API**; `--check` mode prints live config | ✅ done |
| `DNS-RECORDS.md` — every DNS record with Squarespace-specific host names | ✅ done |

---

## 1. One-time tooling setup

**Path A — service account key (no gcloud needed; works everywhere):**

1. https://console.firebase.google.com → ⚙️ Project settings → **Service accounts**
2. **Generate new private key** → save the downloaded JSON as `service-account.json` in this folder
3. `service-account.json` is already git-ignored — never commit or share it
4. Run: `node scripts/firebase-auth-setup.mjs --check`  (add `--sa path/to/key.json` for a custom location)

**Path B — CLI tools:**

```bash
npm install -g firebase-tools      # or: npx firebase-tools (no install)
firebase login                     # opens browser
gcloud auth login                  # for the API script (same Google account)
gcloud config set project jsvita-login
gcloud services enable identitytoolkit.googleapis.com --project jsvita-login
```

Either way, the identity used needs **Firebase Authentication Admin** (`roles/firebaseauth.admin`)
or Owner on the project.

---

## 2. Deploy the auth.jsvita.in hosting site

```bash
firebase deploy --only hosting --project jsvita-login
```

Then connect the domain:

1. **Firebase Console → Hosting → Add custom domain**
2. Enter `auth.jsvita.in` → **Quick Setup**
3. Add the A/CNAME record it shows (see `DNS-RECORDS.md` Step 2)
4. Wait for status **Connected** (SSL auto-provisioned, usually < 1 h)

Sanity test once connected:

```bash
curl -I https://auth.jsvita.in/__/auth/handler
# Expect: 400 "Unable to process request due to missing initial state" — that is CORRECT.
# It proves the Firebase auth handler is live on your domain.
```

---

## 3. Configure Authentication (domains, sender, templates)

> ⚠️ **Known limitation discovered 2026-09-27:** this project returns
> `EMAIL_TEMPLATE_UPDATE_NOT_ALLOWED` from both the console UI and the admin API
> for *all* email-template and action-URL writes (subtype `FIREBASE_AUTH`).
> Google gates custom senders/templates behind **Identity Platform (Blaze plan)**.
> Options: (a) upgrade to Blaze (free tier still applies, pay only for usage) and
> retry the script; or (b) contact Firebase Support to request the unlock.

### Option A — scripted (recommended)

```bash
node scripts/firebase-auth-setup.mjs --check   # inspect current config first
node scripts/firebase-auth-setup.mjs           # apply: domains + sender + templates + action URL
```

The script:
- adds `jsvita.in` and `auth.jsvita.in` to **Authorized domains**
- sets **From:** `noreply@jsvita.in` with display name **"JSVita Team"** on all three templates
- installs the three templates (subject + body exactly as specified below)
- sets the **action URL** to `https://auth.jsvita.in/__/auth/action` (this is what
  replaces every `jsvita-login.firebaseapp.com` link inside the emails)
- calls `domain:verify` for `jsvita.in` and **prints the exact DNS records Google
  requires** — copy them from the output into Squarespace

### Option B — Firebase Console (equivalent, manual)

**Authorized domains** — Authentication → Settings → Authorized domains → Add:
- `jsvita.in`
- `auth.jsvita.in`

**Email domain** — Authentication → Templates → edit any template → **customize domain**
→ enter `jsvita.in` → add the DNS records it shows (same as the script prints).

**Action URL** — Authentication → Templates → **Customize action URL**:
`https://auth.jsvita.in/__/auth/action`

**Sender + templates** — edit each template: sender name `JSVita Team`,
sender email `noreply@jsvita.in`, subject/body per the tables below.

> The **sender email's domain must be the verified custom email domain** — that's
> why `noreply@jsvita.in` only becomes available after DNS verification completes.

### Templates installed by the script

**Email verification (password sign-ups):**

| Field | Value |
|---|---|
| Subject | `Verify Your Email Address - JSVita` |
| From | `JSVita Team <noreply@jsvita.in>` |
| Body | `Hello %DISPLAY_NAME%,`<br><br>`Welcome to JSVita.`<br><br>`Please verify your email address by clicking the link below:`<br><br>`%LINK%`<br><br>`If you did not create a JSVita account, you can safely ignore this email.`<br><br>`Regards,`<br>`JSVita Team`<br>`https://jsvita.in` |

**Password reset:**

| Field | Value |
|---|---|
| Subject | `Reset Your JSVita Password` |
| From | `JSVita Team <noreply@jsvita.in>` |
| Body | `Hello %DISPLAY_NAME%,`<br><br>`We received a request to reset the password for the JSVita account registered with %EMAIL%.`<br><br>`Click the link below to choose a new password:`<br><br>`%LINK%`<br><br>`This link expires soon for your security. If you did not request a password reset, you can safely ignore this email — your password will not change.`<br><br>`Regards,`<br>`JSVita Team`<br>`https://jsvita.in` |

**Email change verification:**

| Field | Value |
|---|---|
| Subject | `Confirm Your New Email Address - JSVita` |
| From | `JSVita Team <noreply@jsvita.in>` |
| Body | `Hello %DISPLAY_NAME%,`<br><br>`You requested to change the email address on your JSVita account from %EMAIL% to %NEW_EMAIL%.`<br><br>`Click the link below to confirm this change:`<br><br>`%LINK%`<br><br>`If you did not request this change, you can safely ignore this email — your account will keep its current email address.`<br><br>`Regards,`<br>`JSVita Team`<br>`https://jsvita.in` |

Placeholders Google substitutes automatically: `%DISPLAY_NAME% %EMAIL% %NEW_EMAIL% %APP_NAME% %LINK%`.

---

## 4. DNS records

See **`DNS-RECORDS.md`** — it contains the live-checked current state of your zone,
the exact records to add (with Squarespace host-name conventions), SPF guidance,
and a verification checklist. Summary:

1. Firebase-given **TXT** (ownership) + **CNAME** (DKIM) for the email domain
2. One combined **SPF** TXT at the apex (you currently have none)
3. **A `199.36.158.100`** for host `auth` (Hosting custom domain)
4. Optional but recommended: **DMARC** TXT at `_dmarc`

**Do not touch** the four `185.199.x.x` apex A records (GitHub Pages) — the apex
stays where it is; only `auth.jsvita.in` moves to Firebase.

---

## 5. Activation order (important)

1. Deploy hosting (`firebase deploy --only hosting`)
2. Add `auth.jsvita.in` in Hosting → wait for **Connected**
3. Run the setup script (or Console flow) → it prints DNS records
4. Add DNS records at Squarespace → wait for propagation (minutes–24 h)
5. Re-run `node scripts/firebase-auth-setup.mjs --check` → confirm `dnsInfo` shows verified
6. Firebase Console → Templates → **Apply Custom Domain** (activates the email domain)
7. Re-deploy nothing needed — `login.html` already points at the new authDomain

If you skip step 6, emails keep using the default `noreply@<project>.firebaseapp.com`
sender even though verification passed.

---

## 6. Verification checklist

| Test | Expected |
|---|---|
| Google sign-in popup URL bar | `https://auth.jsvita.in/__/auth/handler?...` |
| `curl -I https://auth.jsvita.in/__/auth/handler` | 400 *missing initial state* (correct) |
| Password-reset email "From:" | `JSVita Team <noreply@jsvita.in>` |
| Password-reset email link | `https://auth.jsvita.in/__/auth/action?...` — **no `firebaseapp.com`** |
| Sign-up with a new email | verification email uses your template |
| Change email in Firebase Console (per user) | email-change template fires |
| `login.html` loads on jsvita.in and signs in | no `auth/unauthorized-domain` errors |

### If something breaks

| Symptom | Fix |
|---|---|
| `auth/unauthorized-domain` in popup flow | Authorized domains list missing `auth.jsvita.in` or `jsvita.in` |
| Popup opens but errors instantly | Hosting site for `auth.jsvita.in` not yet **Connected** (SSL pending) |
| Emails still from `noreply@jsvita-login.firebaseapp.com` | Custom email domain verified but not **applied** (Templates → Apply Custom Domain) |
| Verification stuck > 24 h | DNS not propagated — check with `nslookup` per `DNS-RECORDS.md` step 3 |
| SPF failing for receivers | You created two SPF records, or omitted the Google include — merge into one apex TXT |

---

## 7. Rollback

- Revert `login.html` `authDomain` to `jsvita-login.firebaseapp.com` and redeploy —
  the old domain keeps working; Google never removes project subdomains.
- Templates/domain changes can be reverted in Console (Templates → edit → reset)
  or by re-running the script after editing `TEMPLATES` in it.
- DNS: remove the `auth` A/CNAME record to disconnect the hosting domain.
