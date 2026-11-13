# InnerBrick -static rebuild

A same-to-same rebuild of https://innerbrick.lovable.app/ as a dependency-free static
site: the original markup, the original compiled stylesheet, the original photography,
plus a small vanilla script that restores the interactions the React app provided.

## Run it

```bash
cd innerbrick-clone
python -m http.server 4173      # then open http://127.0.0.1:4173
```

Any static file server works -the site has no build step and no runtime dependencies.

## Pages

| Route | File |
| --- | --- |
| `/` | `index.html` |
| `/products` | `products/index.html` |
| `/products/ganesha-keepsake-box` | `products/ganesha-keepsake-box/index.html` |
| `/products/deity-relief-panel` | `products/deity-relief-panel/index.html` |
| `/products/institutional-memento` | `products/institutional-memento/index.html` |
| `/products/custom-3d-figure` | `products/custom-3d-figure/index.html` |
| `/custom` | `custom/index.html` |
| `/about` | `about/index.html` |
| `/contact` | `contact/index.html` |
| `/custom-gifts-delhi-ncr` | `custom-gifts-delhi-ncr/index.html` |
| `/privacy` | `privacy/index.html` |
| `/terms` | `terms/index.html` |
| `/thank-you` | `thank-you/index.html` |

## Assets

- `assets/styles.css` -the site's compiled Tailwind v4 stylesheet, taken unchanged.
- `assets/site.css` -hero headline entrance animation plus the components added for the
  SEO/CRO pass (trust strip, sticky CTA bar, quote form, comparison table, FAQ accordion).
- `assets/config.js` -**the one place to change the studio phone number**, WhatsApp
  number, email and catalogue prices. Every WhatsApp and `tel:` link is built from it.
- `assets/app.js` -interactions, see below.
- `assets/img/` -logo and product photography, all WebP (largest file ≈ 114 KB).

## Interactions (`assets/app.js`)

- Header turns solid (`bg-background/92`, blur, border) after 24 px of scroll.
- Mobile hamburger menu with the same markup and active-route highlighting.
- `.reveal` elements fade/rise in as they enter the viewport, staggered 90 ms
  (capped at 450 ms) exactly like the original observer.
- Hero headline lines rise out of their clipping wrapper on load.
- `/products` material filter (All / Wood / MDF / Resin / Custom) including the
  "Nothing in Custom yet -but we can still make it." empty state.
- Product page engraving note: live `n/400` counter that also travels into the
  `mailto:` enquiry body.
- Instant quote form (`/custom`, `/contact`, every `/products/*` page): validates name
  and WhatsApp number, then opens WhatsApp with the details pre-filled. No backend.
- Every WhatsApp / call link (`data-wa-link`, `data-tel-link`) is rewritten from
  `assets/config.js` on load, including the sticky mobile bar.

## Before you deploy

1. Open `assets/config.js` and replace `whatsappNumber`, `phoneTel` and
   `phoneDisplay`. The placeholders (`919000000000` / `+91 90000 00000`) also appear
   verbatim in the JSON-LD `telephone` fields and in the no-JS `href` fallbacks —
   search for `9000000000` and replace those if you want crawlers and no-JS visitors
   to see the real number too.
2. Prices live in the page copy and in the `Product` schema offers (₹649 figure,
   ₹899 keepsake box, ₹1,299 relief panel, ₹749 memento).
3. `vercel.json` sets long-lived caching for `/assets/img/*`, keeps `app.js`/`site.css`
   on a one-day cache, disables trailing slashes, and redirects the apex domain to
   `https://www.innerbrick.shop` so it matches the canonical tags. Vercel applies it on
   deploy; no dashboard equivalent is needed.

## Hosting (Vercel + Hostinger DNS)

The site is static, so Vercel serves it straight from the CDN -there is no build step
and no framework preset needed (Framework Preset: **Other**, Build Command empty,
Output Directory: leave blank / `.`).

In Vercel → Project → Settings → Domains, add **both** `www.innerbrick.shop` and
`innerbrick.shop`, and set `www` as the primary domain.

At Hostinger (hPanel → Domains → DNS records), keep Hostinger's nameservers and set:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | the apex value Vercel shows for this domain (currently `216.198.79.1`; older projects use `76.76.21.21`) |
| CNAME | `www` | `cname.vercel-dns.com` |

Remove any Hostinger parking/website-builder A or CNAME records for `@` and `www` that
conflict - in particular the `2.57.91.91` parking A record, which serves the "Parked
Domain name on Hostinger DNS system" page on the bare domain. Then wait for propagation;
Vercel issues the TLS certificate automatically once the records resolve.

The apex must also be added in Vercel → Settings → Domains, otherwise requests to it are
not routed to the project. With `www` as primary, Vercel (and the redirect in
`vercel.json`) sends the apex to `https://www.innerbrick.shop` in one hop.

## Regenerating

The HTML is hand-maintained now that the audit copy and schema are in place. The
original extraction tooling (`tools/extract.py`, `tools/verify.py`, `tools/cdp-test.mjs`)
was used for the first rebuild and is no longer part of this repository -re-running it
would overwrite the SEO copy, H1s and JSON-LD.
