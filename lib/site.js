// Single source of truth for site-wide facts. Values marked TODO are not supplied yet
// and are hidden from the UI and from structured data until filled in.
export const SITE = {
  name: 'grabEAT',
  legalName: 'grabEAT AS',
  url: 'https://grabeat.no',
  phone: '+47 472 23 288',
  phoneHref: '+4747223288',
  email: 'post@grabeat.no',
  address: '', // TODO: supply head-office address
  socials: [{ name: 'Instagram', url: 'https://www.instagram.com/grabeat.no/' }],
  logo: '/images/grabeat-logo.png',
}

export const LOCALES = ['no', 'en']
export const DEFAULT_LOCALE = 'no'

// internal key -> public slug per locale ('' = home)
export const SLUGS = {
  home: { no: '', en: '' },
  menu: { no: 'meny', en: 'menu' },
  how: { no: 'slik-fungerer-det', en: 'how-it-works' },
  solutions: { no: 'losninger', en: 'solutions' },
  about: { no: 'om-oss', en: 'about' },
  contact: { no: 'kontakt', en: 'contact' },
  business: { no: 'for-bedrifter', en: 'for-business' },
  locations: { no: 'lokasjoner', en: 'locations' },
  investors: { no: 'investorer', en: 'investors' },
  join: { no: 'bli-med', en: 'join' },
  thanks: { no: 'takk', en: 'thank-you' },
  privacy: { no: 'personvern', en: 'privacy' },
  terms: { no: 'vilkar', en: 'terms' },
  blog: { no: 'blogg', en: 'blog' },
}

// internal route folder names (what exists under app/[locale]/)
export const FOLDERS = {
  home: '', menu: 'menu', how: 'how-it-works', solutions: 'solutions', about: 'about', contact: 'contact',
  business: 'for-business', locations: 'locations', investors: 'investors', join: 'join', thanks: 'thank-you', privacy: 'privacy', terms: 'terms', blog: 'blog',
}

export function path(locale, key, sub) {
  const slug = SLUGS[key][locale]
  const tail = sub && typeof sub === 'object' ? sub[locale] : sub
  const parts = [locale, slug, tail].filter(Boolean)
  return '/' + parts.join('/')
}

export function absolute(p) {
  return SITE.url + p
}

export function alternates(key, sub) {
  return {
    canonicalFor: (locale) => absolute(path(locale, key, sub)),
    languages: {
      nb: absolute(path('no', key, sub)),
      en: absolute(path('en', key, sub)),
      'x-default': absolute(path('no', key, sub)),
    },
  }
}

// Add `photo: '/images/locations/<slug>.jpg'` to a location once a real photo of that kiosk exists;
// it then shows as the hover preview on the home page.
export const LOCATIONS = [
  { slug: 'forum-kokstad', name: 'Forum Kokstad', area: { no: 'Bergen', en: 'Bergen' }, address: '', mapsQuery: 'Forum Kokstad Bergen' },
  { slug: 'kvale-rasteplass-voss', name: 'Kvåle Rasteplass', area: { no: 'Voss', en: 'Voss' }, address: '', mapsQuery: 'Kvåle Rasteplass Voss' },
  { slug: 'tesla-kokstad', name: 'Tesla Kokstad', area: { no: 'Bergen', en: 'Bergen' }, address: '', mapsQuery: 'Tesla Kokstad Bergen' },
  { slug: 'gulating-lagmannsrett', name: 'Gulating Lagmannsrett', area: { no: 'Bergen', en: 'Bergen' }, address: '', mapsQuery: 'Gulating Lagmannsrett Bergen' },
  { slug: 'vestlandshallen', name: 'Vestlandshallen', area: { no: 'Bergen', en: 'Bergen' }, address: '', mapsQuery: 'Vestlandshallen Bergen' },
]

export const mapsDirections = (q) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`
export const mapsEmbed = (q) => `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`
