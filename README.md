# honchohunters
Website for honchohunters.com

Static HTML/CSS/JS site, deployed via GitHub Pages with a custom domain.

## Structure
- `index.html` — homepage
- `assets/css/style.css` — styles
- `assets/js/main.js` — scripts
- `assets/images/` — image assets
- `CNAME` — custom domain for GitHub Pages (honchohunters.com)

## Deployment
1. Push to `main`.
2. In GitHub repo Settings → Pages, set source to deploy from the `main` branch (root).
3. At your domain registrar, point DNS for `honchohunters.com`:
   - `A` records (apex) → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` record for `www` → `kisna-mahajan.github.io`
4. Once DNS propagates and GitHub verifies the domain, enable "Enforce HTTPS" in Settings → Pages.
