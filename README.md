# InnerBrick — static rebuild

A same-to-same rebuild of https://innerbrick.lovable.app/ as a dependency-free static
site: the original markup, the original compiled stylesheet, the original photography,
plus a small vanilla script that restores the interactions the React app provided.

## Run it

```bash
cd innerbrick-clone
python -m http.server 4173      # then open http://127.0.0.1:4173
```

Any static file server works — the site has no build step and no runtime dependencies.

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
| `/privacy` | `privacy/index.html` |
| `/terms` | `terms/index.html` |
| `/thank-you` | `thank-you/index.html` |

## Assets

- `assets/styles.css` — the site's compiled Tailwind v4 stylesheet, taken unchanged.
- `assets/site.css` — hero headline entrance animation (the original does this with GSAP).
- `assets/app.js` — interactions, see below.
- `assets/img/` — logo, product photography, favicon.

## Interactions (`assets/app.js`)

- Header turns solid (`bg-background/92`, blur, border) after 24 px of scroll.
- Mobile hamburger menu with the same markup and active-route highlighting.
- `.reveal` elements fade/rise in as they enter the viewport, staggered 90 ms
  (capped at 450 ms) exactly like the original observer.
- Hero headline lines rise out of their clipping wrapper on load.
- `/products` material filter (All / Wood / MDF / Resin / Custom) including the
  "Nothing in Custom yet — but we can still make it." empty state.
- Product page engraving note: live `n/400` counter that also travels into the
  `mailto:` enquiry body.
- `/custom` order form: same validation messages as the original, then hands off to
  the visitor's mail client and lands on `/thank-you`.

## Regenerating

`tools/extract.py` rebuilds the HTML files from the pages captured from the live site
(in the system temp dir under `ib/`). `tools/verify.py` re-checks every page against
the live site (rendered text + screenshot pixel diff), and `tools/cdp-test.mjs` drives
the interactions through Chrome DevTools Protocol:

```bash
python tools/verify.py
node tools/cdp-test.mjs     # needs Chrome started with --remote-debugging-port=9222
```
