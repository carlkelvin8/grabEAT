import { SITE, LOCATIONS, absolute, path } from './site'
import { dict } from './dict'
import { MENU, SUPPLIERS } from '@/content/menu'

const clean = (o) => JSON.parse(JSON.stringify(o)) // drops undefined

export function organization() {
  return clean({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': absolute('/#organization'),
    name: SITE.legalName,
    alternateName: SITE.name,
    url: SITE.url,
    logo: absolute(SITE.logo),
    telephone: SITE.phone,
    email: SITE.email || undefined,
    sameAs: SITE.socials.length ? SITE.socials.map((s) => s.url) : undefined,
  })
}

export function kiosk(locale, loc) {
  return clean({
    '@context': 'https://schema.org',
    '@type': 'FoodEstablishment',
    '@id': absolute(path(locale, 'locations', loc.slug)) + '#kiosk',
    name: `grabEAT ${loc.name}`,
    url: absolute(path(locale, 'locations', loc.slug)),
    telephone: SITE.phone,
    email: SITE.email || undefined,
    image: absolute(`/og-${locale}.png`),
    parentOrganization: { '@id': absolute('/#organization') },
    address: {
      '@type': 'PostalAddress',
      streetAddress: loc.address || undefined,
      addressLocality: loc.area[locale],
      addressCountry: 'NO',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
  })
}

export function faqPage(faq) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  }
}

// Only real menu data should be published as Menu/MenuItem. Prices and allergens are added once supplied.
export function menu(locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: `${SITE.name} ${dict[locale].menu.h1}`,
    url: absolute(path(locale, 'menu')),
    inLanguage: locale === 'no' ? 'nb' : 'en',
    hasMenuSection: SUPPLIERS.map((sup) => ({
      '@type': 'MenuSection',
      name: sup,
      hasMenuItem: MENU.filter((m) => m.supplier === sup).map((m) => clean({
        '@type': 'MenuItem',
        name: m.name,
        image: m.photo ? absolute(m.photo) : undefined,
        offers: { '@type': 'Offer', price: m.price, priceCurrency: 'NOK' },
        suitableForDiet: m.tags?.includes('vegetarian') ? ['https://schema.org/VegetarianDiet'] : undefined,
      })),
    })),
  }
}

export function breadcrumbs(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: absolute(url) })),
  }
}

export function article(locale, post) {
  const url = absolute(path(locale, 'blog', post.slug))
  return clean({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title[locale],
    description: post.excerpt[locale],
    inLanguage: locale === 'no' ? 'nb' : 'en',
    datePublished: post.publishDate,
    dateModified: post.publishDate,
    mainEntityOfPage: url,
    url,
    image: absolute(`/og-${locale}.png`),
    author: { '@type': 'Organization', name: post.author || SITE.name },
    publisher: { '@id': absolute('/#organization') },
  })
}
