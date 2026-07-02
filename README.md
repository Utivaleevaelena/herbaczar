# HERBACZAR — Vercel deploy

Static site (no build step). React + Babel are loaded from CDN and JSX is compiled in the browser.

## Deploy

**Option A — drag & drop**
1. Go to https://vercel.com/new
2. Drag this whole folder onto the page (or the zip's contents).
3. Framework preset: **Other** · Build command: *(none)* · Output directory: `./`
4. Deploy.

**Option B — CLI**
```bash
npm i -g vercel
cd vercel-build
vercel        # preview
vercel --prod # production
```

## Files
- `index.html` — entry point
- `styles.css`, `translations.js`
- `app.jsx`, `sections-a.jsx`, `sections-b.jsx`, `tweaks-panel.jsx`
- `images/`, `videos/`
- `vercel.json` — clean URLs + asset caching

## Note
JSX is transpiled client-side via Babel standalone (fine for this landing page).
For maximum performance later, precompile the `.jsx` to a single bundle — no code changes needed to ship now.
