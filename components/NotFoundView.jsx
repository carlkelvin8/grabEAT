'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Shell from '@/components/Shell'
import PageCover from '@/components/PageCover'
import { dict } from '@/lib/dict'
import { LOCATIONS, path } from '@/lib/site'

// Body of the global 404. It renders outside the [locale] layout, so the language comes from the URL.
export default function NotFoundView() {
  const locale = usePathname()?.startsWith('/en') ? 'en' : 'no'
  const d = dict[locale]; const pg = d.pages.notFound
  return (
    <Shell locale={locale} pageKey="home">
      <PageCover
        eyebrow={pg.eyebrow} rows={pg.title} lead={pg.lead} live={d.locations.open}
        actions={<>
          <Link className="btn gold" href={path(locale, 'home')}>{pg.home}<span className="arrow" aria-hidden="true"><i>→</i></span></Link>
          <Link className="btn ghost plain" href={path(locale, 'locations')}>{d.cta.find}</Link>
        </>}
        art={<div className="cover-kiosk-art nf-art"><span className="nf-code" aria-hidden="true">404</span><Image src="/images/cutouts/grabeat-kiosk-pod.png" alt="" width={534} height={780} sizes="(max-width: 900px) 60vw, 26vw" /></div>}
      />
      <section className="section other-spots">
        <div className="wrap">
          <span className="eyebrow">{d.nav.locations}</span>
          <ul className="other-list">{LOCATIONS.slice(0, 4).map((x) => <li key={x.slug}><Link href={path(locale, 'locations', x.slug)}><span>{x.name}</span><i>→</i></Link></li>)}</ul>
        </div>
      </section>
    </Shell>
  )
}
