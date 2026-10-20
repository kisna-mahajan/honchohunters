# honchohunters

Marketing website for **Honcho Hunters** (honchohunters.com), a confidential executive search and leadership intelligence platform founded by Anil Mahajane, MBA (IIFT). It also recruits independent recruiters into a Channel Partner Network.

## Tech Stack
- Hand-written static HTML + one shared stylesheet + one small JS file. No build step, no framework, no package.json.
- Hosted on **GitHub Pages** from `main` (repo root), custom domain via `CNAME`, DNS on Cloudflare (see README.md).
- Forms post to **formsubmit.co** → `confidential@honchohunters.com`, then redirect back with `?submitted=true`; an inline script on the page swaps the form for a thank-you card.
- Fonts: Google Fonts (Inter, Playfair Display).

## Project Structure
```
index.html                    Home page
about/index.html              About / founder
defence/ gcc/ healthcare/     Practice (industry vertical) pages, each an index.html
consumer-electronics/ steel/ cement/
engage/index.html             "Share Your Profile" form for senior candidates
channel-partners/index.html   Channel Partner landing page: explains + links the two models
channel-partners-01.html      Option 1 - Success-Sharing Partnership (detail page + application form)
channel-partners-02.html      Option 2 - Approved-Profile Partnership (detail page + application form)
assets/css/style.css          All styles (design tokens in :root)
assets/js/main.js             Mobile nav, Practices dropdown, scroll-reveal for cards
assets/images/                Hero images, logo, favicon
sitemap.xml, robots.txt       SEO
llms.txt                      Plain-language site summary for AI crawlers (keep in sync with page content)
.claude/launch.json           Local preview server config ("site", port 8765)
.claude/pages_server.py       Tiny Python static server that mimics GitHub Pages URL resolution
```

## Architecture
- Every page repeats the full nav + footer markup (no includes). A nav/footer change must be made in **every** HTML file.
- All asset and page links are root-absolute (`/assets/...`, `/about/`), so pages work at any depth.
- Page section rhythm: `hero` (with `divider--page-curve`) → alternating `section--light` / `section--card` / `section--dark` with `divider--X-to-Y` S-curves between them → `footer` (some pages have a `cta-banner` before the footer).
- **How the S-curves render (seamless curves):** in browsers with CSS mask support (all current ones), every `.divider` span and hero page-curve is hidden. The element right after it (`.divider + *`, `.hero--curve + *`) is pulled up 90px and masked to the S-curve, so both neighbours show their real gradient backgrounds right up to the curve. Extra padding (`170px` instead of `80px`, or `180px` on `cta-banner`) keeps content where it was. The `divider--X-to-Y` colour variants only matter as the no-mask fallback. To add a curve, put a divider span between two sections; any variant name works, but use the matching one.
- Each page carries its own SEO head (title, description, canonical, OG/Twitter, geo meta) and JSON-LD. The Organization entity lives on the home page as `https://honchohunters.com/#organization`; other pages reference that `@id`.
- Channel Partner pages: the landing page has no form. Each option page has its own form, with a distinct `_subject`, a hidden `partnership_model` field and its own `_next` URL.

## Build & Deploy
- No build. Edit the HTML/CSS and push `main`; GitHub Pages deploys automatically.
- Local preview: start the `site` config in `.claude/launch.json` (Claude: `preview_start` name `site`), or run `python -I .claude/pages_server.py . 8765` and open http://localhost:8765/. Plain `python -m http.server` will 404 on `/channel-partners-01` because it does not resolve extensionless URLs.

## Current State
- 2026-10-20: The Channel Partners section was split into a two-option landing page plus the two option pages, using the owner's copy and SEO/GEO brief. The sitemap and llms.txt now list all three. `Channel_partner-hero.jpg` was resized to 2000px wide and recompressed (2.7 MB to 326 KB).
- 2026-10-20: Owner preference: **no em dashes anywhere on the site.** Use a spaced hyphen (` - `) instead. En dashes in ranges (₹500–₹2,000, 1–3) are kept.
- 2026-10-20: All hero JPEGs were resized to 2000px wide at quality 80 (each now 146–401 KB, down from 1.6–11.7 MB). Do the same for any new hero image before adding it: System.Drawing in PowerShell, HighQualityBicubic, JPEG quality 80. None of the originals had EXIF rotation tags; check for them on new images, because re-encoding strips them.
- 2026-10-20: Owner preference: **cards in a short last row stretch to the full grid width** (e.g. 5 cards in 3 columns: the last 2 share the full row). `style.css` handles this for `.grid--cols-2/3/4/5` at every breakpoint, so just use those classes. For 7 cards use `.grid--cols-4` (4 + 3), not `.grid--cols-3`, which would leave one full-width card.
- 2026-10-20: The owner prefers lean pages without repeated content. The Channel Partners landing page lost its closing CTA banner, an intro bullet list that duplicated the option cards, and a filler FAQ.
  - Option 1 lost its closing banner, a benefit card that duplicated Partnership Levels, and 4 FAQs that restated on-page sections.
  - Option 2 lost:
    - its closing "Our Philosophy" banner and the intro box under the hero
    - the "Prompt Payment Process" icon panel (same 4 facts as the hero stats)
    - 3 benefit cards that repeated those same facts
    - the "Choose Your Partnership Model" section, now a cross-link note under the form, mirroring Option 1
    - 7 FAQs that duplicated "Earnings and Payment Terms"
- 2026-10-20: Owner preference: **S-curve borders must be seamless everywhere.** The flat divider bands made gradient dark sections look like rectangles. They were replaced with the mask technique (see Architecture). Every boundary between a dark section and a different background now has a curve; 8 straight edges got new dividers, including Defence → Coverage and Consumer Electronics → Segments.
- 2026-10-20 (UX review): **every background change between sections is now an S-curve.** 14 more curves went in between light and white sections; the only straight edges left are above the footer. Other changes:
  - About now ends FAQ → closing CTA → footer, so the page finishes on the call to action.
  - Defence "Built for Defence Leadership" changed from 5 narrow cards in one row to 3 + 2.
  - Footers are identical on all 12 pages (the phone was removed from the Channel Partners footers; it stays in their Contact sections).
  - Footer column headings are `<h2>` (were `<h4>`, which skipped heading levels).
  - No wording changed in the review. Same-colour neighbours are left alone (Steel/Cement have two white sections in a row; the CP pages have light/light pairs).

## Known Issues
- formsubmit.co may ask the inbox owner to confirm the first submission coming from each new form page. Send a test application from each of `/channel-partners-01` and `/channel-partners-02` after deploying.

## Pending Work
1. Test-submit both new Channel Partner forms on the live site and confirm the emails arrive.
2. Owner to decide: trim the long hero paragraphs on the practice pages (Defence runs to about 9 lines on a phone) the way the Channel Partner heroes were trimmed. This is a wording change, so get approval first.
3. Owner to decide: whether to show the Mobile / WhatsApp number in the footer on every page. It is currently in no footer, only in the Channel Partner Contact sections.
4. Submit the updated sitemap in Google Search Console, then monitor indexing of all three Channel Partner URLs.

## Decisions Log
- **Option pages are root-level `.html` files, not folders.** The SEO brief's canonical URLs have no trailing slash (`/channel-partners-01`). GitHub Pages serves `channel-partners-01.html` at that exact URL with a 200. A `channel-partners-01/index.html` folder would 301-redirect to the trailing-slash URL, and canonicals should never point at a redirect. Keep canonical, sitemap and internal links all on the no-slash form.
- **Canonical host is `https://honchohunters.com` (no www)** on every page. Commit 1e2fc55 had moved the Channel Partners canonical to www; the newer SEO brief puts it back to non-www to match the rest of the site.
- **No FAQPage schema on the Channel Partner pages.** Per the SEO brief, FAQs stay visible on the page but don't rely on FAQ rich results. The pages use WebPage + BreadcrumbList.
- Option 1 copy said to "apply through the main Channel Partner page", while the main page says to apply on each option page. To avoid the loop, Option 1 got its own form and its "How do I get started?" FAQ points to that form.

## Gotchas
- PowerShell 5.1 `Get-Content` / `Set-Content` without `-Encoding utf8` will mangle ₹, en dashes and other non-ASCII text in these files. Use the editor tools or Python for bulk text edits.
- Don't put an inline `padding-top` on a section that follows a divider or a curved hero, or an inline `padding-bottom` on a section that precedes a divider. The inline value overrides the 90px compensation, and the S-curve will cut into the content.
- In `style.css`, the `max-width: 560px` block must stay **after** the `max-width: 760px` block. When it sat before it, the 760px rule won and phones showed `.grid--cols-3` cards two to a row.
- `main.js` wires up only the first `.nav__dropdown`. A second nav dropdown needs JS changes.
- `.reveal` cards fade in on scroll, so screenshots taken right after load can show blank or half-faded cards. That is not a bug.
- `assets/images/favicon.png` had an uncommitted change from the owner before 2026-10-20. Don't sweep it into unrelated commits without asking.
