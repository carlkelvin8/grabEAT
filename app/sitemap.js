import { SLUGS, LOCATIONS, LOCALES, absolute, path } from '@/lib/site'
import { allPosts } from '@/lib/blog'

export const revalidate = 3600

// Both languages, with hreflang alternates for every entry. The thank-you page is left out on purpose.
export default function sitemap() {
  const pages = Object.keys(SLUGS).filter((k) => k !== 'thanks').map((k) => ({ key: k }))
  const kiosks = LOCATIONS.map((l) => ({ key: 'locations', sub: l.slug }))
  const posts = allPosts().filter((p) => !p.draft).map((p) => ({ key: 'blog', sub: p.slug }))
  return [...pages, ...kiosks, ...posts].flatMap(({ key, sub }) =>
    LOCALES.map((locale) => ({
      url: absolute(path(locale, key, sub)),
      lastModified: new Date(),
      alternates: { languages: { nb: absolute(path('no', key, sub)), en: absolute(path('en', key, sub)) } },
    })),
  )
}
