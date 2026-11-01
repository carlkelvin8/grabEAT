# grabEAT website: status, time estimate and content needed

Rough estimates in working hours for the work that is still open. They assume the content below arrives complete. Writing the content itself is not included.

## Priority 1: Fix now
**Done:** Norwegian and English pages, hreflang, language switcher, unique titles and descriptions, `/how-it-work` redirect, 5 locations, one phone format, internal broken-link check (36 URLs, no broken links).
**Open:** ~5 h
- Fill in email, address and social links everywhere (1 h)
- Replace illustrations with real photos, descriptive filenames, alt text, WebP (3 h)
- Add all locations to each Google Business Profile (owner task, grabEAT)
- Check partner logo links and the image gallery once those exist (1 h)

**Need from grabEAT:** email, head-office address, social links, real photos of meals and kiosks, partner logos with links.

## Priority 2: Google and AI search
**Done:** kiosk pages, JSON-LD (Organization, FoodEstablishment, FAQPage, Menu/MenuItem, Article, BreadcrumbList), robots.txt, sitemap, GA4 and conversion events in code.
**Open:** ~8 h
- Run Google Rich Results Test and fix any warnings (2 h)
- Add Search Console and GA4, submit the sitemap, confirm the events fire (3 h, needs account access)
- Enter the final FAQ on the home and kiosk pages (2 h)
- Per-kiosk address, how to find it, photos and Google profile link (1 h)

**Need:** final FAQ questions and answers (Norwegian and English), per-kiosk address and directions, Google Business Profile URL per kiosk, GA4 measurement ID, Search Console access.

## Priority 3: Conversion and trust
**Done:** simplified buttons, business page structure, menu structure with allergen and diet tags, simplified comparison, forms with separate unticked marketing consent, thank-you page, cookie banner, Privacy and Terms drafts.
**Open:** ~9 h
- Connect all forms to HubSpot and test each lead (3 h)
- Enter the real menu: prices, ingredients, allergens, tags (2 h)
- Business page text and cost comparison (1 h)
- Reviews, press logos with links, founder story (2 h)
- Replace the Google Form with per-kiosk Google review buttons (1 h)

**Need:** HubSpot portal ID, form GUIDs and subscription type ID; menu data; business-page text and numbers; reviews, press mentions with logos and links, founder story; Google review link per kiosk; legal review of the Privacy and Terms drafts.

## Priority 4: Email and QR
**Done:** QR signup page, footer and menu-page newsletter signup.
**Open:** ~3 h
- Confirm the first-meal offer text and connect the form to HubSpot (1 h)
- Measure load time on mobile and tune to under 2 seconds (2 h)

**Need:** the exact first-meal offer, the final QR destination URL.

## Priority 5: Mobile and speed
**Done:** sticky Find kiosk and Call bar, Open Graph and Twitter tags with a PNG share image, Meta Pixel and LinkedIn Insight code behind cookie consent.
**Open:** ~8 h
- Run PageSpeed Insights, fix anything below 85 on mobile (4 h)
- Test every page on a real iPhone and Android (3 h)
- Replace the placeholder share image with a designed 1200×630 image (1 h)

**Need:** Meta Pixel ID and LinkedIn Partner ID if ads run, a final share image.

## Priority 6: Blog
**Done:** template with categories, author, date, related posts, Article and FAQ schema, closing buttons and newsletter signup, Norwegian and English versions with hreflang, sitemap entries, scheduled publishing by `publishDate`.
**Open:** about 15 min per post, ~7 h across 26 posts
- Enter each post in `content/posts.js` with a publish date on the same weekday each week.

**Need:** the posts (title, excerpt, body, category, Norwegian and English, optional FAQ), one per week.

## Not in the PDF but required
- Deploy the site to the `grabeat.no` domain and redirect the old URLs (~5 h). The current live site is separate from this build.
- Decide the default language for `/` (currently redirects to `/no`).
- Confirm the spelling "Gulating lagmannsrett" (the PDF says "Lagmansrett").
