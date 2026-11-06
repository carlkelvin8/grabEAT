import Link from 'next/link'
import Image from 'next/image'
import Shell from '@/components/Shell'
import PageCover from '@/components/PageCover'
import KioskFinder from '@/components/KioskFinder'
import Rich from '@/components/Rich'
import { dict } from '@/lib/dict'
import { pageMetadata } from '@/lib/seo'
import { LOCATIONS, path, mapsDirections, mapsEmbed } from '@/lib/site'

export async function generateMetadata({ params }) { const { locale } = await params; return pageMetadata(locale, 'locations') }

const Arrow = () => <span className="arrow" aria-hidden="true"><i>→</i></span>

export default async function Locations({ params }) {
  const { locale } = await params
  const d = dict[locale]; const l = d.locations; const pg = d.pages.locations
  const items = LOCATIONS.map((loc) => ({
    slug: loc.slug, name: loc.name, hours: loc.hours, operating: loc.operating, area: loc.area[locale], href: path(locale, 'locations', loc.slug),
    directions: mapsDirections(loc.mapsQuery), embed: mapsEmbed(loc.mapsQuery),
  }))
  const cities = [...new Set(LOCATIONS.map((x) => x.area[locale]))].map((c) => [c, LOCATIONS.filter((x) => x.area[locale] === c)])

  return (
    <Shell locale={locale} pageKey="locations">
      <PageCover
        eyebrow={pg.eyebrow} rows={pg.title} lead={pg.lead}
        art={<div className="cover-kiosk-art"><Image src="/images/cutouts/grabeat-kiosk-pod.png" alt={d.home.kioskAlt} width={534} height={780} priority sizes="(max-width: 900px) 60vw, 26vw" /></div>}
      />

      <section className="section finder-sec">
        <div className="wrap">
          <KioskFinder items={items} labels={{ pick: pg.pick, details: pg.details, directions: l.directions, open: l.open, map: l.map }} />
        </div>
      </section>

      <section className="section cities" data-dark>
        <div className="wrap">
          <h2 className="sec-title" data-reveal="lines">{pg.cities.map((r, i) => <span className="split-line" key={i}><span><Rich text={r} /></span></span>)}</h2>
          <div className="city-grid" data-reveal="stagger">
            {cities.map(([city, locs]) => (
              <div className="city" key={city}>
                <div className="city-head"><h3>{city}</h3><b>{locs.length}</b></div>
                <ul>{locs.map((x) => <li key={x.slug}><Link className="u-link" href={path(locale, 'locations', x.slug)}>{x.name}</Link><span className={`chip${x.operating ? ' live' : ''}`}>{x.hours}</span></li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section loc-cta">
        <div className="wrap">
          <h2 data-reveal="lines">{pg.cta.map((r, i) => <span className="split-line" key={i}><span><Rich text={r} /></span></span>)}</h2>
          <p className="lead" data-reveal="up">{pg.ctaText}</p>
          <div data-reveal="up"><Link className="btn gold" href={path(locale, 'business')} data-magnetic>{d.cta.apply}<Arrow /></Link></div>
        </div>
      </section>
    </Shell>
  )
}
