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
3. DNS is managed in **Cloudflare**. In the Cloudflare dashboard for `honchohunters.com`, add:
   - `A` records (apex `@`) → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` record for `www` → `kisna-mahajan.github.io`
   - Set these records' proxy status to **DNS only** (grey cloud, not orange) while GitHub verifies the custom domain — a proxied (orange cloud) record can break GitHub's domain verification and SSL cert issuance.
4. Once GitHub shows the domain as verified, enable "Enforce HTTPS" in Settings → Pages.
5. After HTTPS is confirmed working on GitHub's side, you can switch the records back to **Proxied** (orange cloud) in Cloudflare if you want Cloudflare's CDN/WAF in front of the site. Set Cloudflare SSL/TLS mode to **Full (strict)** so it doesn't conflict with GitHub's cert.
