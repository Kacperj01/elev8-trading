# ELEV8 Trading website

The ELEV8 Trading brand site: mentorship, premium Discord, Telegram signals and the free ELEV8 Journal.
The journal itself lives in its own repo and at elev8tradingjournal.com; this site only links to it.

## Layout
- `docs/`: the website, served by GitHub Pages (Settings > Pages > Deploy from a branch > `main` / `docs`).
  Plain HTML, CSS and JS, no build step.
- `docs/assets/main.js`: settings at the top (Supabase project, Vantage partner link).
- `supabase/mentorship_applications.sql`: run once in the Supabase SQL editor to create the
  mentorship applications table. Visitors can only add applications; read them in the Supabase Table Editor.
- `tools/og.html`: source of the link preview image `docs/assets/og.png`.

## Rules
- Every page says ELEV8 is for education only, not financial advice, is not affiliated with any prop firm,
  and discloses the Vantage partnership.
- Keep the ELEV8 colours and the Outfit font.
- Only the public (publishable) Supabase key goes in the site. Never the service key or any other secret.

## Domain
The site is served at https://elev8trading.app (`docs/CNAME`). DNS: apex A records to GitHub Pages
(185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153), AAAA records
(2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153) and
`www` CNAME to `kacperj01.github.io`. `.app` domains only work over HTTPS, so keep "Enforce HTTPS" on in Settings > Pages.
