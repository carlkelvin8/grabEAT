import { notFound } from 'next/navigation'
import Shell from '@/components/Shell'
import Image from 'next/image'
import Accordion from '@/components/Accordion'
import PageCover from '@/components/PageCover'
import Link from 'next/link'
import MealCard from '@/components/MealCard'
import { dict } from '@/lib/dict'
import { MENU, FEATURED } from '@/content/menu'
import { pageMetadata } from '@/lib/seo'
import { kiosk, faqPage, breadcrumbs } from '@/lib/schema'
import { SITE, LOCATIONS, LOCALES, path, mapsEmbed, mapsDirections } from '@/lib/site'

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => LOCATIONS.map((l) => ({ locale, slug: l.slug })))
}

const find = (slug) => LOCATIONS.find((l) => l.slug === slug)

function copy(locale, loc) {
  const area = loc.area[locale]
  return locale === 'no'
    ? { title: `grabEAT ${loc.name}, ${area} | Varm mat 24/7`, desc: `grabEAT-kiosken ved ${loc.name} i ${area} er åpen 24/7. Se kart, veibeskrivelse og meny for varm, sunn mat.` }
    : { title: `grabEAT ${loc.name}, ${area} | Hot food 24/7`, desc: `The grabEAT kiosk at ${loc.name} in ${area} is open 24/7. See the map, directions and menu for hot, healthy food.` }
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params
  const loc = find(slug)
  if (!loc) return {}
  return pageMetadata(locale, 'locations', slug, copy(locale, loc))
}

export default async function KioskPage({ params }) {
  const { locale, slug } = await params
  const loc = find(slug)
  if (!loc) notFound()
  const d = dict[locale]; const l = d.locations
  const area = loc.area[locale]
  // Short FAQ built only from known facts. Client supplies the final Q&A (TODO).
  const faq = locale === 'no'
    ? [[`Når er kiosken ved ${loc.name} åpen?`, 'Kiosken er åpen 24/7.'], ['Hva selger kiosken?', 'Varme og sunne måltider fra grabEAT.']]
    : [[`When is the ${loc.name} kiosk open?`, 'The kiosk is open 24/7.'], ['What does the kiosk sell?', 'Hot, healthy meals from grabEAT.']]
  const crumbs = breadcrumbs([[d.nav.locations, path(locale, 'locations')], [loc.name, path(locale, 'locations', slug)]])

  return (
    <Shell locale={locale} pageKey="locations" sub={slug} schema={[kiosk(locale, loc), faqPage(faq), crumbs]}>
      <PageCover
        eyebrow={`${area} · ${l.open}`} rows={['grabEAT', `*${loc.name}.*`]} live={l.open}
        lead={locale === 'no' ? `Varme, sunne måltider ved ${loc.name} i ${area}, hele døgnet.` : `Hot, healthy meals at ${loc.name} in ${area}, around the clock.`}
        actions={<a className="btn gold" href={mapsDirections(loc.mapsQuery)} target="_blank" rel="noopener noreferrer" data-track="find_kiosk" data-magnetic>{l.directions}<span className="arrow" aria-hidden="true"><i>↗</i></span></a>}
        art={<div className="cover-kiosk-art"><Image src="/images/cutouts/grabeat-kiosk-pod.png" alt={d.home.kioskAlt} width={534} height={780} priority sizes="(max-width: 900px) 60vw, 26vw" /></div>}
      />
      <section className="section loc-info">
        <div className="wrap loc-detail">
          <dl className="info-list" data-reveal="stagger">
            <div><dt>{l.open}</dt><dd>00:00 – 23:59</dd></div>
            <div><dt>{locale === 'no' ? 'By' : 'City'}</dt><dd>{area}</dd></div>
            {loc.address && <div><dt>{l.address}</dt><dd>{loc.address}</dd></div>}
            {loc.howToFind && <div><dt>{l.howToFind}</dt><dd>{loc.howToFind[locale]}</dd></div>}
            <div><dt>{locale === 'no' ? 'Telefon' : 'Phone'}</dt><dd><a className="u-link" href={`tel:${SITE.phoneHref}`}>{SITE.phone}</a></dd></div>
            {/* Link each page to its Google Business Profile once the URL is supplied. */}
            {loc.reviewUrl && <div><dt>Google</dt><dd><a className="u-link" href={loc.reviewUrl} target="_blank" rel="noopener noreferrer">{l.review} ↗</a></dd></div>}
          </dl>
          <div className="map-card" data-reveal="clip">
            <iframe className="map" title={`${l.map}: ${loc.name}`} src={mapsEmbed(loc.mapsQuery)} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </section>
      <section className="section loc-menu">
        <div className="wrap">
          <div className="sec-head"><span className="eyebrow">{l.menuTitle}</span><h2 className="sec-title" data-reveal="lines"><span className="split-line"><span>{locale === 'no' ? 'Dette kan du spise her.' : 'What you can eat here.'}</span></span></h2></div>
          <div className="meal-grid" data-reveal="stagger">{FEATURED.slice(0, 4).map((id) => <MealCard key={id} item={MENU.find((m) => m.id === id)} />)}</div>
          <div style={{ marginTop: 40 }}><Link className="btn" href={path(locale, 'menu')} data-magnetic>{d.cta.viewMenu}<span className="arrow" aria-hidden="true"><i>→</i></span></Link></div>
        </div>
      </section>
      <section className="section faq-sec">
        <div className="wrap">
          <div className="faq-side"><span className="eyebrow">FAQ</span><h2>{l.faqTitle}</h2></div>
          <Accordion items={faq} />
        </div>
      </section>
      <section className="section other-spots">
        <div className="wrap">
          <span className="eyebrow">{d.nav.locations}</span>
          <ul className="other-list" data-reveal="stagger">
            {LOCATIONS.filter((x) => x.slug !== loc.slug).map((x) => <li key={x.slug}><Link href={path(locale, 'locations', x.slug)}><span>{x.name}</span><i>→</i></Link></li>)}
          </ul>
        </div>
      </section>
    </Shell>
  )
}
