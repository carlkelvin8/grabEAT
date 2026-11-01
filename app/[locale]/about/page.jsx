import Link from 'next/link'
import Image from 'next/image'
import Shell from '@/components/Shell'
import PageCover from '@/components/PageCover'
import { dict } from '@/lib/dict'
import { pageMetadata } from '@/lib/seo'
import { path } from '@/lib/site'
import { TRUST } from '@/content/trust'

export async function generateMetadata({ params }) { const { locale } = await params; return pageMetadata(locale, 'about') }

export default async function About({ params }) {
  const { locale } = await params
  const d = dict[locale]; const pg = d.pages.about
  return (
    <Shell locale={locale} pageKey="about">
      <PageCover large eyebrow={pg.eyebrow} rows={pg.title} lead={d.about.body} meta={pg.facts}
        art={<div className="cover-kiosk-art"><Image src="/images/cutouts/grabeat-kiosk-pod.png" alt={d.home.kioskAlt} width={534} height={780} priority sizes="(max-width: 900px) 60vw, 26vw" /></div>} />
      <section className="section mission" data-dark>
        <div className="wrap">
          <span className="eyebrow" style={{ color: 'var(--gold)' }}>{pg.missionTag}</span>
          <p className="mission-text" data-reveal="up">{pg.mission}</p>
          <div className="pcover-actions" data-reveal="up">
            <Link className="btn gold" href={path(locale, 'how')} data-magnetic>{d.nav.how}<span className="arrow" aria-hidden="true"><i>→</i></span></Link>
            <Link className="btn light" href={path(locale, 'contact')} data-magnetic>{d.nav.contact}<span className="arrow" aria-hidden="true"><i>→</i></span></Link>
          </div>
        </div>
      </section>
      {TRUST.partners.length > 0 && (
        <section className="section partners">
          <div className="wrap">
            <div className="sec-head"><span className="eyebrow">{d.home.partnersTag}</span><h2 className="sec-title">{d.home.partnersTitle}</h2></div>
            <ul className="partner-grid" data-reveal="stagger">{TRUST.partners.map((p) => <li key={p.name}><Image src={p.logo} alt={p.name} width={360} height={160} sizes="240px" /></li>)}</ul>
          </div>
        </section>
      )}
    </Shell>
  )
}
