import { dict } from './dict'
import { SITE, alternates, absolute, path } from './site'

// Builds Next.js metadata for a page: unique title/description, canonical, hreflang, OG and Twitter.
export function pageMetadata(locale, key, sub, override) {
  const m = override || dict[locale].meta[key]
  const alt = alternates(key, sub)
  const url = alt.canonicalFor(locale)
  const image = absolute(`/og-${locale}.png`)
  return {
    title: { absolute: m.title },
    description: m.desc,
    alternates: { canonical: url, languages: alt.languages },
    openGraph: {
      title: m.title, description: m.desc, url, siteName: SITE.name, type: 'website',
      locale: locale === 'no' ? 'nb_NO' : 'en_GB', images: [{ url: image, width: 1200, height: 630, alt: 'grabEAT' }],
    },
    twitter: { card: 'summary_large_image', title: m.title, description: m.desc, images: [image] },
  }
}
