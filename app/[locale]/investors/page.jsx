import Link from 'next/link'
import Image from 'next/image'
import Shell from '@/components/Shell'
import PageCover from '@/components/PageCover'
import { dict } from '@/lib/dict'
import { pageMetadata } from '@/lib/seo'
import { SITE, path } from '@/lib/site'
import { TRUST } from '@/content/trust'

export async function generateMetadata({ params }) { const { locale } = await params; return pageMetadata(locale, 'investors') }

export default async function Investors({ params }) {
  const { locale } = await params
  const d = dict[locale]; const pg = d.pages.investors
  return (
    <Shell locale={locale} pageKey="investors">
      <PageCover eyebrow={pg.eyebrow} rows={pg.title} lead={d.investors.contact} meta={d.pages.about.facts}
        actions={<>
          <Link className="btn gold" href={path(locale, 'contact')} data-magnetic>{d.nav.contact}<span className="arrow" aria-hidden="true"><i>→</i></span></Link>
          {SITE.email && <a className="btn ghost plain" href={`mailto:${SITE.email}`}>{SITE.email}</a>}
        </>} />
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
