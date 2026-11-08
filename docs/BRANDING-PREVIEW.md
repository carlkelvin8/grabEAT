# Unpublished branding preview

Branch: `codex/logo-brand-refresh`. These changes are local; nothing has been
uploaded to WordPress, deployed, or published.

## Design

- White page surfaces, navigation, footer, cards, menus, and cookie/chat panels.
- Titles use `#327319`, the dark opaque leaf fill in `public/images/grabeat-logo.png`.
- General text uses `#3D3D3D`.
- Primary actions use `#FD3601`, the main opaque logo wordmark fill, with
  `#181818` text. Hover uses `#F53601` and a subtle shadow.
- Text contrast: body/white 10.86:1; green/white 5.83:1; primary label/orange
  4.82:1; hover label/orange 4.57:1.
- Existing Fraunces and Inter fonts are retained at the user's request.
  Cocomat Pro is deferred until licensed webfont files are provided.
- Existing content, images, routes, layout geometry, and interactions remain.

`app/branding.css` is loaded after the existing stylesheet for both languages
and the global 404. The home animation no longer injects the old background
and text colors. White surfaces also apply during the day/night scene.

## Review locally

Run `npm run build`, then `npm run start -- -H 127.0.0.1 -p 5173`.
Open http://127.0.0.1:5173/en or http://127.0.0.1:5173/no.
This preview is available only on the local computer.

## Publication

The WordPress site embeds a static export; Astra settings do not style its
contents. Follow `docs/WORDPRESS-DEPLOY.md` only after explicit approval.
Replacing the static-files plugin changes the live site immediately and is
not an unpublished WordPress draft. No plugin upload or replacement was done.

## Validation

- Production build and SEO metadata checks passed.
- 38 pages in both languages checked at 1440, 768, and 390 pixels: 114 checks,
  with no color mismatches, horizontal overflow, or JavaScript page errors.
- Primary hover states, FAQ toggles, navigation, menu filters, and kiosk
  selection passed at all three widths: 15 interaction checks.
- Internal link crawl: 34 URLs, no broken links or redirect-dependent links.
- Forms were not submitted; third-party analytics and maps were blocked in
  automated checks. This validates the local site, not external services.
