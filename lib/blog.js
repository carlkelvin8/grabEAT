import { POSTS, CATEGORIES } from '@/content/posts'

// Today's date in Oslo as YYYY-MM-DD, so a post goes live at midnight Norwegian time.
const osloToday = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Oslo' }).format(new Date())

const showDrafts = process.env.NODE_ENV !== 'production'

export function allPosts() {
  const today = osloToday()
  return POSTS.filter((p) => (p.draft ? showDrafts : p.publishDate <= today))
    .sort((a, b) => b.publishDate.localeCompare(a.publishDate))
}

export const findPost = (locale, slug) => allPosts().find((p) => p.slug[locale] === slug)

export function related(post, n = 3) {
  const others = allPosts().filter((p) => p.id !== post.id)
  const same = others.filter((p) => p.category === post.category)
  return [...same, ...others.filter((p) => p.category !== post.category)].slice(0, n)
}

export const categoryLabel = (locale, key) => CATEGORIES[key]?.[locale] || key
export const formatDate = (locale, iso) =>
  new Intl.DateTimeFormat(locale === 'no' ? 'nb-NO' : 'en-GB', { dateStyle: 'long', timeZone: 'Europe/Oslo' }).format(new Date(iso + 'T12:00:00Z'))

// "Title | grabEAT" capped at 60 characters; description capped at 155.
export function postMeta(locale, post) {
  const suffix = ' | grabEAT'
  let t = post.title[locale]
  if (t.length + suffix.length > 60) t = t.slice(0, 60 - suffix.length - 1).trimEnd() + '…'
  let d = post.excerpt[locale]
  if (d.length > 155) d = d.slice(0, 154).trimEnd() + '…'
  return { title: t + suffix, desc: d }
}

// Minutes to read, from the body word count (200 words a minute, at least 1).
export const readingTime = (post, locale) => Math.max(1, Math.round(post.body[locale].join(' ').split(/\s+/).length / 200))
