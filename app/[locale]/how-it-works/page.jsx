import Link from 'next/link'
import Image from 'next/image'
import Shell from '@/components/Shell'
import PageCover from '@/components/PageCover'
import StepsStory from '@/components/StepsStory'
import Rich from '@/components/Rich'
import { dict } from '@/lib/dict'
import { pageMetadata } from '@/lib/seo'
import { LOCATIONS, path } from '@/lib/site'
import { MENU } from '@/content/menu'

export async function generateMetadata({ params }) { const { locale } = await params; return pageMetadata(locale, 'how') }

const Arrow = () => <span className="arrow" aria-hidden="true"><i>→</i></span>

export default async function How({ params }) {
  const { locale } = await params
  const d = dict[locale]; const pg = d.pages.how
  const dishes = MENU.filter((m) => m.cutout).slice(0, 6).map((m) => ({ name: m.name, cutout: m.cutout }))
  return (
    <Shell locale={locale} pageKey="how">
      <PageCover
        eyebrow={pg.eyebrow} rows={pg.title} lead={pg.lead} live={d.locations.open}
        meta={[['3', locale === 'no' ? 'steg' : 'steps'], ['~5', 'min'], ['24/7', locale === 'no' ? 'åpent' : 'open']]}
        art={<div className="cover-kiosk-art"><Image src="/images/cutouts/grabeat-kiosk-pod.png" alt={d.home.kioskAlt} width={534} height={780} priority sizes="(max-width: 900px) 60vw, 26vw" /></div>}
      />
      <StepsStory
        steps={d.how.steps}
        places={LOCATIONS.map((l) => l.name)}
        dishes={dishes}
        labels={{ title: d.how.h1, ready: pg.ready, timerNote: pg.timerNote, choose: pg.choose }}
      />
      <section className="section loc-cta">
        <div className="wrap">
          <h2 data-reveal="lines">{pg.end.map((r, i) => <span className="split-line" key={i}><span><Rich text={r} /></span></span>)}</h2>
          <div className="pcover-actions" data-reveal="up">
            <Link className="btn gold" href={path(locale, 'locations')} data-track="find_kiosk" data-magnetic>{d.cta.find}<Arrow /></Link>
            <Link className="btn ghost plain" href={path(locale, 'menu')} data-magnetic>{d.cta.viewMenu}</Link>
          </div>
        </div>
      </section>
    </Shell>
  )
}
