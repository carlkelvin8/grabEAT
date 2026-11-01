import Link from 'next/link'
import Image from 'next/image'
import Shell from '@/components/Shell'
import PageCover from '@/components/PageCover'
import { dict } from '@/lib/dict'
import { pageMetadata } from '@/lib/seo'
import { path } from '@/lib/site'

export async function generateMetadata({ params }) {
  const { locale } = await params
  const md = pageMetadata(locale, 'thanks')
  return { ...md, robots: { index: false, follow: false } } // conversion page: keep out of search results
}

export default async function Thanks({ params }) {
  const { locale } = await params
  const d = dict[locale]; const pg = d.pages.thanks
  return (
    <Shell locale={locale} pageKey="thanks">
      <PageCover
        eyebrow={pg.eyebrow} rows={pg.title} lead={d.thanks.body}
        actions={<>
          <Link className="btn gold" href={path(locale, 'home')} data-magnetic>{d.thanks.back}<span className="arrow" aria-hidden="true"><i>→</i></span></Link>
          <Link className="btn ghost plain" href={path(locale, 'menu')} data-magnetic>{d.cta.viewMenu}</Link>
        </>}
        art={<div className="cover-kiosk-art"><Image src="/images/cutouts/grabeat-kiosk-pod.png" alt="" width={534} height={780} priority sizes="(max-width: 900px) 60vw, 26vw" /></div>}
      />
    </Shell>
  )
}
