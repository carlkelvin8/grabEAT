#!/usr/bin/env bash
# Builds the static export that runs on grabeat.no and zips it as dist/grabeat-next.zip.
# The zip is uploaded through Plugins > Add New > Upload Plugin, never activated. See docs/WORDPRESS-DEPLOY.md.
# Works on a throwaway copy (.wp-build), so the repo itself keeps its server routes.
# Usage: npm run build:wp -- 1.5
set -e
VERSION="${1:-1.0}"
B=/wp-content/plugins/grabeat-next
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
W="$ROOT/.wp-build"

rm -rf "$W" && mkdir -p "$W" "$ROOT/dist"
cd "$ROOT"
tar --exclude=./node_modules --exclude=./.git --exclude=./.next --exclude=./.wp-build --exclude=./dist -cf - . | tar -xf - -C "$W"
cp -r node_modules "$W/node_modules"
cd "$W"

# Static export cannot have server routes. The blog post route also fails while no post is published yet.
rm -rf app/api app/robots.js app/sitemap.js 'app/[locale]/blog/[slug]'
cat > next.config.mjs <<EOF
export default { output: 'export', trailingSlash: true, basePath: '$B', images: { unoptimized: true }, experimental: { globalNotFound: true } }
EOF
NEXT_PUBLIC_WP_BUILD=1 NEXT_PUBLIC_BASE_PATH="$B" npx next build

P="$W/pkg/grabeat-next"
mkdir -p "$P" && cp -r out/. "$P/" && cd "$P"

# The normal build serves Norwegian slugs through rewrites; a static host needs real folders.
for pair in menu:meny how-it-works:slik-fungerer-det solutions:losninger about:om-oss contact:kontakt for-business:for-bedrifter locations:lokasjoner investors:investorer join:bli-med thank-you:takk privacy:personvern terms:vilkar blog:blogg; do
  f=${pair%%:*}; s=${pair##*:}
  [ -d "no/$f" ] && cp -r "no/$f" "no/$s"
done

# Paths in data and plain tags do not get basePath, and the language switcher links use the absolute site URL.
find . -type f \( -name '*.html' -o -name '*.js' -o -name '*.css' -o -name '*.txt' \) -print0 | xargs -0 perl -pi -e 's#(?<![A-Za-z0-9_\-/.])/(images/|icon\.png|apple-icon\.png|og-en\.png|og-no\.png)#'$B'/$1#g'
find . -name '*.html' -print0 | xargs -0 perl -pi -e 's#(<a [^>]*?href=")https://grabeat\.no/(en|no)/#$1'$B'/$2/#g'

printf '<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=%s/no/"><title>grabEAT</title>' "$B" > index.html
printf '<?php\n/**\n * Plugin Name: grabEAT Next (static files)\n * Description: Holds the static export of the grabEAT website. Contains no executable code; do not activate.\n * Version: %s\n */\nif ( ! defined( "ABSPATH" ) ) { exit; }\n' "$VERSION" > grabeat-next.php

# Python, because PowerShell's Compress-Archive writes backslashes that break on Linux hosts.
cd "$W/pkg"
python -c "
import zipfile, os, sys
z = zipfile.ZipFile(sys.argv[1], 'w', zipfile.ZIP_DEFLATED)
for r, d, f in os.walk('grabeat-next'):
    for n in f:
        p = os.path.join(r, n)
        z.write(p, p.replace(os.sep, '/'))
z.close()" "$ROOT/dist/grabeat-next.zip"
rm -rf "$W"
ls -la "$ROOT/dist/grabeat-next.zip"
