import Link from 'next/link'
import Image from 'next/image'
import Shell from '@/components/Shell'
import Rich from '@/components/Rich'
import HomeMotion from '@/components/HomeMotion'
import SpotList from '@/components/SpotList'
import Showcase from '@/components/Showcase'
import Accordion from '@/components/Accordion'
import DayStory from '@/components/DayStory'
import LiveClock from '@/components/LiveClock'
import { dict } from '@/lib/dict'
import { pageMetadata } from '@/lib/seo'
import { faqPage } from '@/lib/schema'
import { LOCATIONS, path } from '@/lib/site'
import { MENU, SUPPLIERS } from '@/content/menu'
import { TRUST } from '@/content/trust'

export async function generateMetadata({ params }) {
  const { locale } = await params
  return pageMetadata(locale, 'home')
}

const Arrow = () => <span className="arrow" aria-hidden="true"><i>→</i></span>

const Lines = ({ rows, className }) => (
  <h2 className={className} data-reveal="lines">
    {rows.map((r, i) => <span className="split-line" key={i}><span><Rich text={r} /></span></span>)}
  </h2>
)

export default async function Home({ params }) {
  const { locale } = await params
  const d = dict[locale]
  const h = d.home
  const photos = MENU.filter((m) => m.photo)
  const byId = (needle) => photos.find((m) => m.id.includes(needle))
  const [p1, p2, p3, p4] = [byId('bulgogi'), byId('butter-chicken'), byId('jamaican'), byId('tikka')]
  const screen = photos.slice(0, 6)
  const [w1, ...restWords] = h.hero.l1.split(' ')
  const w2 = restWords.join(' ')

  return (
    <Shell locale={locale} pageKey="home" schema={faqPage(h.faq)}>
      <HomeMotion />

      {/* 1 · HERO — magazine cover: one kiosk, type wrapped around it */}
      <section className="cover" aria-labelledby="cover-title">
        <div className="cover-light" aria-hidden="true" />
        <div className="cover-beams" aria-hidden="true"><i /><i /><i /></div>
        <i className="cover-veil" aria-hidden="true" />

        <div className="cover-top">
          <span className="eyebrow">{h.hero.eyebrow}</span>
          <LiveClock city="Bergen" label={h.hero.live} locale={locale} />
        </div>

        <div className="cover-stage">
          <svg className="cover-arch" viewBox="0 0 400 560" preserveAspectRatio="none" aria-hidden="true">
            <path d="M20 560 V200 A180 180 0 0 1 380 200 V560" />
          </svg>
          <h1 id="cover-title" className="cover-title">
            <span className="ct-row ct-flank">
              <span className="ct-w ct-left"><span className="hw">{w1}</span></span>
              <span className="ct-gap" aria-hidden="true" />
              <span className="ct-w ct-right"><span className="hw">{w2}</span></span>
            </span>
            <span className="ct-row ct-front"><span className="hw"><em>{h.hero.em}</em> {h.hero.l2}</span></span>
          </h1>
          <div className="cover-kiosk" data-depth="0.25">
            <div className="kiosk-rig">
            <Image className="kiosk-img" src="/images/cutouts/grabeat-kiosk-pod.png" alt={h.kioskAlt} width={534} height={780} priority sizes="(max-width: 900px) 60vw, 34vh" />
            {/* the kiosk's own screen comes alive: a sliding digital menu with real dishes */}
            <div className="kiosk-screen" aria-hidden="true">
              <div className="ks-bar"><b>grab<span>EAT</span></b><i>{h.hero.live}</i></div>
              <div className="ks-window">
                <div className="ks-track">
                  {[...screen, ...screen.slice(0, 3)].map((m, i) => (
                    <figure key={i}>
                      <Image src={m.photo} alt="" width={160} height={160} sizes="90px" />
                      <figcaption>{m.price} kr</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
              <i className="ks-glare" />
            </div>
            <Image className="kiosk-reflect" src="/images/cutouts/grabeat-kiosk-pod.png" alt="" width={534} height={780} sizes="(max-width: 900px) 60vw, 34vh" aria-hidden="true" />
            </div>
          </div>
        </div>

        <div className="cover-bottom">
          <p className="cover-lead">{h.sub}</p>
          <div className="cover-ctas">
            <Link className="btn gold" href={path(locale, 'locations')} data-track="find_kiosk" data-magnetic>{d.cta.find}<Arrow /></Link>
            <Link className="btn ghost plain" href={path(locale, 'business')} data-magnetic>{d.cta.apply}</Link>
          </div>
          <dl className="cover-facts">
            {h.hero.facts.map(([n, l]) => <div key={l}><dt>{n}</dt><dd>{l}</dd></div>)}
          </dl>
        </div>
      </section>

      {/* 2 · STORY — an interactive day: clock, sky, places and dishes change as you scroll */}
      <DayStory
        kioskAlt={h.kioskAlt}
        labels={{ tag: h.day.tag, title: h.day.title, hint: h.day.hint, scrub: h.day.scrub, open: h.day.open }}
        chapters={h.day.chapters.map(([time, title, text, slug, dishKey]) => {
          const loc = LOCATIONS.find((l) => l.slug === slug)
          const dish = byId(dishKey)
          return { time, title, text, place: { name: loc.name, href: path(locale, 'locations', slug) }, dish: { name: dish.name, price: dish.price, cutout: dish.cutout } }
        })}
      />

      {/* 3 · FOOD — horizontal gallery of real dishes */}
      <section className="food" aria-label={h.food.tag}>
        <div className="food-pin">
          <div className="food-track" data-cursor={h.food.drag}>
            <div className="food-intro">
              <span className="eyebrow">{h.food.tag}</span>
              <Lines rows={h.food.title} />
              <p className="lead">{h.food.lead}</p>
              <ul className="supplier-list">
                {SUPPLIERS.map((s) => <li key={s}>{s}<span>{MENU.filter((m) => m.supplier === s).length}</span></li>)}
              </ul>
            </div>
            {photos.map((m, i) => (
              <article className="dish" key={m.id}>
                <div className="dish-top"><span>{m.supplier}</span><span className="dish-num">{String(i + 1).padStart(2, '0')}</span></div>
                <div className={`dish-plate ${m.cutout ? 'cut' : ''}`}>{m.cutout
                  ? <Image className="plate-img" src={m.cutout} alt={m.name} width={400} height={400} sizes="340px" />
                  : <div className="disc"><Image src={m.photo} alt={m.name} width={400} height={400} sizes="340px" /></div>}</div>
                <div className="dish-bottom"><h3>{m.name}</h3><span className="price">{m.price} kr</span></div>
              </article>
            ))}
            <article className="dish cta-card" data-dark>
              <h3><Rich text={h.menuNote} /></h3>
              <Link className="btn gold" href={path(locale, 'menu')} data-magnetic>{h.food.all}<Arrow /></Link>
            </article>
          </div>
        </div>
      </section>

      {/* 4 · HOW IT WORKS — short teaser; the full pinned story lives on /how-it-works */}
      <section className="section how-teaser">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">{h.howTag}</span>
            <Lines rows={[d.how.h1]} className="sec-title" />
          </div>
          <ol className="steps-row" data-reveal="stagger">
            {d.how.steps.map(([t, p], i) => <li key={t}><span className="n">{String(i + 1).padStart(2, '0')}</span><h3>{t}</h3><p>{p}</p></li>)}
          </ol>
          <div style={{ marginTop: 36 }}><Link className="btn" href={path(locale, 'how')} data-magnetic>{d.nav.how}<Arrow /></Link></div>
        </div>
      </section>

      {/* 5 · LOCATIONS — editorial list with cursor-following preview */}
      <section className="section spots">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">{h.spots.tag}</span>
            <Lines rows={h.spots.title} className="sec-title" />
            <p className="lead" data-reveal="up">{h.spots.lead}</p>
          </div>
          <SpotList
            items={LOCATIONS.map((l) => ({ href: path(locale, 'locations', l.slug), name: l.name, area: l.area[locale], photo: l.photo }))}
            open={d.locations.open} view={h.spots.view}
          />
        </div>
      </section>

      {/* 6 · COMPARISON — editorial table */}
      <section className="section versus">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">{h.versus.tag}</span>
            <Lines rows={h.versus.title} className="sec-title" />
          </div>
          <div className="vs-table" role="table" aria-label={h.cmpTitle.join(' ')} data-reveal="stagger">
            {h.cmpHead.map((c, i) => <span key={`h${i}`} role="columnheader" className={`vs-h ${i === 3 ? 'vs-us vs-us-first' : ''}`}>{c}</span>)}
            {h.cmpRows.map((r, ri) => r.map((c, j) => (
              <span key={`${ri}${j}`} role={j === 0 ? 'rowheader' : 'cell'}
                className={j === 0 ? 'vs-k' : j === 3 ? `vs-us ${ri === h.cmpRows.length - 1 ? 'vs-us-last' : ''}` : 'vs-them'}>{c}</span>
            )))}
          </div>
        </div>
      </section>

      {/* 7 · BUSINESS — product showcase */}
      <section className="section biz" data-dark>
        <div className="wrap">
          <div className="biz-copy">
            <span className="eyebrow" style={{ color: 'var(--gold)' }}>{h.biz.tag}</span>
            <Lines rows={h.biz.title} />
            <p className="lead" data-reveal="up" style={{ opacity: 0.8 }}>{d.business.intro}</p>
            <ol className="biz-steps" data-reveal="stagger">
              {d.business.steps.map(([t, p]) => <li key={t}><b>{t}</b><span>{p}</span></li>)}
            </ol>
            <div><Link className="btn gold" href={path(locale, 'business')} data-magnetic>{d.cta.apply}<Arrow /></Link></div>
          </div>
          <Showcase
            image="/images/kiosks/grabeat-kiosk-magex.jpg" alt={h.kioskAlt} note={h.photoNote}
            spots={h.biz.hotspots.map(([t, p], i) => ({ title: t, text: p, x: [50, 46, 62][i], y: [84, 46, 34][i] }))}
          />
        </div>
      </section>

      {/* 8 · PARTNERS */}
      {TRUST.partners.length > 0 && (
        <section className="section partners">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">{h.partnersTag}</span>
              <Lines rows={[h.partnersTitle]} className="sec-title" />
            </div>
            <ul className="partner-grid" data-reveal="stagger">
              {TRUST.partners.map((p) => <li key={p.name}><Image src={p.logo} alt={p.name} width={360} height={160} sizes="240px" /></li>)}
            </ul>
          </div>
        </section>
      )}

      {/* 9 · FAQ */}
      <section className="section faq-sec">
        <div className="wrap">
          <div className="faq-side">
            <span className="eyebrow">{h.faqTag}</span>
            <Lines rows={[h.faqTitle]} />
            <div><Link className="btn" href={path(locale, 'contact')} data-magnetic>{d.nav.contact}<Arrow /></Link></div>
          </div>
          <Accordion items={h.faq} />
        </div>
      </section>
    </Shell>
  )
}
