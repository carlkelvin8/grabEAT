# Approved branding release

The reviewed design from `codex/logo-brand-refresh` was merged into `main`
at commit `73fc33b` and published on 8 November 2026 with user approval.
WordPress confirmed the grabEAT Next static-files package update from 1.7 to 1.8.
Live site: https://grabeat.no/.

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
contents. The existing `scripts/build-wordpress.sh` workflow built version 1.8,
which was uploaded through the approved Chrome profile and replaced the
existing package. The static-files plugin remains inactive as required by
the integration. Future replacements require approval because they change
the live site immediately.

The previous 1.7 package is retained locally at
`dist/grabeat-next-rollback-1.7.zip`. The deployed 1.8 ZIP SHA-256 is
`250d122d719885e7df931dd2ebe341124a0df5d920e190072b6a06e1bae7784f`.

## Validation

- Production build and SEO metadata checks passed.
- 38 pages in both languages checked at 1440, 768, and 390 pixels: 114 checks,
  with no color mismatches, horizontal overflow, or JavaScript page errors.
- Primary hover states, FAQ toggles, navigation, menu filters, and kiosk
  selection passed at all three widths: 15 interaction checks.
- Internal link crawl: 34 URLs, no broken links or redirect-dependent links.
- Forms were not submitted; third-party analytics and maps were blocked in
  automated checks. This validates the local site, not external services.
- After publication, 58 live HTML and stylesheet files matched the deployment
  archive byte for byte, without cache-busting query parameters.
- The live WordPress iframe integration passed 24 page checks at desktop,
  tablet, and mobile widths, plus navigation, primary hover, FAQ, menu-filter,
  and kiosk-selection checks. No JavaScript page errors were observed.
  Existing Inter body fonts were confirmed. No server cache purge was needed.
