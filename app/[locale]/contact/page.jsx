import Shell from '@/components/Shell'
import PageCover from '@/components/PageCover'
import LeadForm from '@/components/LeadForm'
import ContactTopics from '@/components/ContactTopics'
import CopyButton from '@/components/CopyButton'
import { dict } from '@/lib/dict'
import { pageMetadata } from '@/lib/seo'
import { SITE, LOCATIONS, path } from '@/lib/site'

export async function generateMetadata({ params }) { const { locale } = await params; return pageMetadata(locale, 'contact') }

export default async function Contact({ params }) {
  const { locale } = await params
  const d = dict[locale]; const c = d.contact; const pg = d.pages.contact
  const t = { ...d.form, submit: d.cta.send }
  const insta = SITE.socials.find((s) => s.name === 'Instagram')
  const channels = [
    { k: pg.channels[0], value: SITE.phone, href: `tel:${SITE.phoneHref}`, copy: SITE.phone },
    SITE.email && { k: pg.channels[1], value: SITE.email, href: `mailto:${SITE.email}`, copy: SITE.email },
    insta && { k: pg.channels[2], value: '@grabeat.no', href: insta.url, external: true },
  ].filter(Boolean)

  return (
    <Shell locale={locale} pageKey="contact">
      <PageCover eyebrow={pg.eyebrow} rows={pg.title} lead={c.intro} />
      <section className="section contact-sec">
        <div className="wrap contact-grid">
          <div className="contact-left">
            <ul className="channels" data-reveal="stagger">
              {channels.map((ch) => (
                <li key={ch.value}>
                  <span className="ch-k">{ch.k[0]}</span>
                  <a className="ch-v" href={ch.href} {...(ch.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} data-cursor={ch.k[1]}>{ch.value}</a>
                  <span className="ch-actions">
                    {ch.copy && <CopyButton text={ch.copy} labels={{ copy: pg.copy, copied: pg.copied }} />}
                    <a className="ch-go" href={ch.href} aria-label={ch.k[1]} {...(ch.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>↗</a>
                  </span>
                </li>
              ))}
            </ul>
            <div className="contact-spots" data-reveal="up">
              <span className="eyebrow">{d.nav.locations}</span>
              <p>{LOCATIONS.map((l) => l.name).join(' · ')}</p>
            </div>
          </div>
          <div className="contact-card" data-reveal="up">
            <h2>{c.formTitle}</h2>
            <ContactTopics label={pg.topicsLabel} topics={pg.topics} prefill={pg.prefill} />
            <div className="contact-form"><LeadForm kind="contact" locale={locale} thanksPath={path(locale, 'thanks')} privacyHref={path(locale, 'privacy')} t={t} /></div>
          </div>
        </div>
      </section>
    </Shell>
  )
}
