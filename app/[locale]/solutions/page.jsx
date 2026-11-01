import Link from 'next/link'
import Image from 'next/image'
import Shell from '@/components/Shell'
import PageCover from '@/components/PageCover'
import Showcase from '@/components/Showcase'
import { dict } from '@/lib/dict'
import { pageMetadata } from '@/lib/seo'
import { path } from '@/lib/site'

export async function generateMetadata({ params }) { const { locale } = await params; return pageMetadata(locale, 'solutions') }

const KIOSK = { pod: ['/images/kiosks/grabeat-kiosk-pod.jpg', 1536, 1024], hub: ['/images/kiosks/grabeat-kiosk-hub-r1.jpg', 768, 382], magex: ['/images/kiosks/grabeat-kiosk-magex.jpg', 1600, 973] }

export default async function Solutions({ params }) {
  const { locale } = await params
  const d = dict[locale]; const pg = d.pages.solutions; const h = d.home
  return (
    <Shell locale={locale} pageKey="solutions">
      <PageCover eyebrow={pg.eyebrow} rows={pg.title} lead={d.solutions.intro}
        actions={<Link className="btn gold" href={path(locale, 'business')} data-magnetic>{d.cta.apply}<span className="arrow" aria-hidden="true"><i>→</i></span></Link>} />
      <section className="section points">
        <div className="wrap">
          <ol className="point-list" data-reveal="stagger">
            {d.solutions.points.map((p, i) => <li key={p}><span>{String(i + 1).padStart(2, '0')}</span><h2>{p}</h2></li>)}
          </ol>
        </div>
      </section>
      <section className="section lineup">
        <div className="wrap">
          <div className="sec-head"><span className="eyebrow">{pg.lineupTag}</span></div>
          <div className="lineup-grid" data-reveal="stagger">
            {pg.lineup.map(([name, key]) => (
              <figure key={key} className="lineup-item">
                <div className="lineup-img"><Image src={KIOSK[key][0]} alt={name} width={KIOSK[key][1]} height={KIOSK[key][2]} sizes="(max-width: 900px) 92vw, 30vw" /></div>
                <figcaption>{name}</figcaption>
              </figure>
            ))}
          </div>
          <p className="showcase-note">{pg.note}</p>
        </div>
      </section>
      <section className="section biz" data-dark>
        <div className="wrap">
          <div className="biz-copy">
            <span className="eyebrow" style={{ color: 'var(--gold)' }}>{h.biz.tag}</span>
            <h2>{h.biz.title.map((r, i) => <span key={i} style={{ display: 'block' }}>{r.replaceAll('*', '')}</span>)}</h2>
            <p className="lead" style={{ opacity: 0.8 }}>{d.business.intro}</p>
            <div><Link className="btn gold" href={path(locale, 'business')} data-magnetic>{d.cta.apply}<span className="arrow" aria-hidden="true"><i>→</i></span></Link></div>
          </div>
          <Showcase image="/images/kiosks/grabeat-kiosk-magex.jpg" alt={h.kioskAlt} note={h.photoNote}
            spots={h.biz.hotspots.map(([t, p], i) => ({ title: t, text: p, x: [50, 46, 62][i], y: [84, 46, 34][i] }))} />
        </div>
      </section>
    </Shell>
  )
}
