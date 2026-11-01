import Image from 'next/image'
import Shell from '@/components/Shell'
import PageCover from '@/components/PageCover'
import LeadForm from '@/components/LeadForm'
import { dict } from '@/lib/dict'
import { pageMetadata } from '@/lib/seo'
import { path } from '@/lib/site'

export async function generateMetadata({ params }) { const { locale } = await params; return pageMetadata(locale, 'business') }

export default async function Business({ params }) {
  const { locale } = await params
  const d = dict[locale]; const b = d.business; const pg = d.pages.business
  const t = { ...d.form, submit: d.cta.apply }
  return (
    <Shell locale={locale} pageKey="business">
      <PageCover eyebrow={pg.eyebrow} rows={pg.title} lead={b.intro}
        actions={<a className="btn gold" href="#apply" data-magnetic>{b.formTitle}<span className="arrow" aria-hidden="true"><i>↓</i></span></a>}
        art={<div className="cover-kiosk-art"><Image src="/images/cutouts/grabeat-kiosk-pod.png" alt={d.home.kioskAlt} width={534} height={780} priority sizes="(max-width: 900px) 60vw, 26vw" /></div>} />
      <section className="section points">
        <div className="wrap biz-two">
          <div>
            <span className="eyebrow">{b.benefitsTitle}</span>
            <ol className="point-list compact" data-reveal="stagger">{b.benefits.map((x, i) => <li key={x}><span>{String(i + 1).padStart(2, '0')}</span><h2>{x}</h2></li>)}</ol>
          </div>
          <div className="needs-card" data-reveal="up">
            <span className="eyebrow">{b.needTitle}</span>
            <ul>{b.need.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        </div>
      </section>
      {/* Cost comparison with a canteen: add here once grabEAT supplies the figures. */}
      <section className="section how-strip" data-dark>
        <div className="wrap">
          <h2 className="sec-title">{b.stepsTitle}</h2>
          <ol className="steps-row" data-reveal="stagger">{b.steps.map(([s, p], i) => <li key={s}><span className="n">{i + 1}</span><h3>{s}</h3><p>{p}</p></li>)}</ol>
        </div>
      </section>
      <section className="section apply" id="apply">
        <div className="wrap contact-grid">
          <div className="contact-left">
            <h2 className="sec-title" data-reveal="lines"><span className="split-line"><span>{b.formTitle}</span></span></h2>
          </div>
          <div className="contact-card" data-reveal="up">
            <LeadForm kind="host" locale={locale} thanksPath={path(locale, 'thanks')} privacyHref={path(locale, 'privacy')} t={t} />
          </div>
        </div>
      </section>
    </Shell>
  )
}
