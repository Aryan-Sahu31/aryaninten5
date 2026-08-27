# ShopFlow — Capstone Product Catalog

A modular, client-side-routed e-commerce catalog built as a full-stack
deployment capstone project. Vanilla HTML/CSS/JS (no framework), designed
so every requirement of the assignment maps to a specific, inspectable
piece of the codebase.

## How this maps to the assignment

| Requirement | Where it lives |
|---|---|
| Modular frontend architecture | `src/js/` — router, store, api, components, and pages are separate ES modules with a single composition root (`main.js`) |
| Client-side routing | `src/js/router.js` — History API router, no full page reloads |
| Optimize assets (images, minified code) | Hand-authored SVG product images (tiny, lazy-loaded) + `build.js`, which bundles 14 JS modules into one minified file and minifies CSS |
| Deploy live to a modern platform | `vercel.json`, `netlify.toml`, and the Render steps below — all pre-configured for you |

## Folder structure

```
capstone/
├── src/                    # Source — readable, un-bundled, for development
│   ├── index.html
│   ├── css/styles.css
│   ├── js/
│   │   ├── main.js         # composition root — wires routes + mounts the app
│   │   ├── router.js        # History API router
│   │   ├── store.js         # cart state (pub-sub + localStorage)
│   │   ├── api.js           # async data-access layer
│   │   ├── utils.js
│   │   ├── data/products.js
│   │   ├── components/      # Header, Footer, ProductCard
│   │   └── pages/           # Catalog, Product, Cart, CheckoutSuccess, NotFound
│   └── assets/products/*.svg
├── dist/                    # Production build output — THIS is what you deploy
├── build.js                 # bundles + minifies src → dist
├── package.json
├── vercel.json               # Vercel rewrite config (already set up)
├── netlify.toml               # Netlify build + rewrite config (already set up)
└── README.md
```

## Running it locally

**Important:** `src/index.html` uses `<script type="module">` with relative
imports. Browsers block ES module imports over the `file://` protocol
(a CORS restriction), so opening `src/index.html` by double-clicking it
will show a blank page. Use a local server instead:

```bash
# Option A — no install needed
npx serve src

# Option B — Python
cd src && python3 -m http.server 5500

# Option C — VS Code
# Right-click src/index.html → "Open with Live Server"
```

Then visit the printed `localhost` URL.

## Building for production

```bash
npm install
npm run build
```

This bundles all 14 JS modules into `dist/js/bundle.min.js`, minifies the
CSS into `dist/css/styles.min.css`, and copies the HTML shell + image
assets into `dist/`. The build script prints a before/after size summary.
Unlike `src`, the built bundle is a plain script (not an ES module), so
`dist/index.html` even works if you just double-click it.

## Deploying

The app has multiple client-side routes (`/`, `/product/:id`, `/cart`,
`/checkout/success`). Because these only exist in the browser (not as real
files on the server), **your host must be told to serve `index.html` for
any path it doesn't recognize** — otherwise refreshing `/cart` will 404.
That fallback rule is already configured for you below.

### Vercel
1. Push this project to a GitHub repo.
2. On [vercel.com](https://vercel.com), click **New Project** → import the repo.
3. Vercel will read `vercel.json` automatically (build command `npm run build`, output directory `dist`, SPA rewrite included). Click **Deploy**.
4. You'll get a live URL like `https://your-project.vercel.app`.

### Netlify
- **Fastest option (no Git needed):** run `npm run build` locally, then drag the `dist` folder onto [app.netlify.com/drop](https://app.netlify.com/drop). You get a live URL immediately.
- **Git-based:** push to GitHub, then on [netlify.com](https://netlify.com) click **Add new site** → **Import an existing project**. Netlify reads `netlify.toml` automatically.

### Render
1. Push this project to a GitHub repo.
2. On [render.com](https://render.com), click **New** → **Static Site**, and connect the repo.
3. Set **Build Command** to `npm run build` and **Publish Directory** to `dist`.
4. After the first deploy, open the site's **Redirects/Rewrites** tab and add a rule: Source `/*`, Destination `/index.html`, Action **Rewrite**. (Render configures this per-site in the dashboard rather than via a checked-in file.)

## Architecture notes

- **Data layer (`api.js`)** — every read goes through an `async` function that returns a Promise, exactly as it would against a real backend. Swapping the in-memory array for `fetch('/api/products')` later touches only this one file.
- **State (`store.js`)** — the cart uses a tiny pub-sub pattern: any module can `subscribe()` to changes (the header badge does) without importing the cart page or vice versa.
- **Routing (`router.js`)** — intercepts clicks on `[data-link]` anchors, updates the URL with `history.pushState`, and re-renders only the `#app` outlet. Browser back/forward works via `popstate`.
- **Components vs. pages** — `components/` are small, reusable render functions (a product card, the header). `pages/` are route handlers that fetch data and compose components into a full view.
