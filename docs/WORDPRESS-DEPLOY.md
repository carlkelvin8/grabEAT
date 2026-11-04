# Deploying to grabeat.no (WordPress)

grabeat.no runs a static export of this site inside WordPress. The normal `npm run build` is unchanged and still uses `/api/lead`, `robots.js` and `sitemap.js`.

## How it is set up
- **Files:** the export is an inactive plugin, `grabEAT Next (static files)`, served from `/wp-content/plugins/grabeat-next/`. Do not activate it.
- **Pages:** each route has a WordPress page (Elementor Canvas template) with a full-screen iframe of that route. `/no/` is the front page; `/en/` and every subpage are its siblings and children.
- **Address bar:** a script in each page copies the iframe's path and title to the top window with `history.replaceState`. Do not use `pushState`: iframe navigation already adds history entries, so Back would need two presses.
- **Forms:** the export posts to the Elementor "Contact Form" on the Contact Us page (post 15047, form 732e946), see `lib/sendLead.js`. If that form is deleted or its fields change, the leads stop.
- **Old pages:** redirected with the Redirection plugin (Tools > Redirection).

## Updating the site
1. `npm run build:wp -- <version>` writes `dist/grabeat-next.zip`. It needs bash, perl and python.
2. In WordPress: Plugins > Add New > Upload Plugin, then "Replace current with uploaded".
3. A new route also needs a new WordPress page. Copy an existing one and change the iframe `src`.

## Limits
- No blog post pages: the build removes that route, because it fails while no post is published. Restore it in `scripts/build-wordpress.sh` once posts exist.
- Google sees little content on each page because of the iframe. Hosting the Next.js site directly on the domain would fix this and bring back `/api/lead`.
