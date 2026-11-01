import Shell from '@/components/Shell'
import PageCover from '@/components/PageCover'
import LeadForm from '@/components/LeadForm'
import { dict } from '@/lib/dict'
import { pageMetadata } from '@/lib/seo'
import { path } from '@/lib/site'

export async function generateMetadata({ params }) { const { locale } = await params; return pageMetadata(locale, 'join') }

// Mobile-first QR landing page: one short form, no heavy client scripts beyond the form.
// The first-meal offer text is confirmed by grabEAT before the QR codes are printed.
export default async function Join({ params }) {
  const { locale } = await params
  const d = dict[locale]; const j = d.join; const pg = d.pages.join
  const t = { ...d.form, submit: d.cta.join }
  return (
    <Shell locale={locale} pageKey="join">
      <PageCover eyebrow={pg.eyebrow} rows={pg.title} lead={j.intro} live={d.locations.open} />
      <section className="section join-sec">
        <div className="wrap">
          <div className="contact-card join-card" data-reveal="up">
            <LeadForm kind="qr" locale={locale} thanksPath={path(locale, 'thanks')} privacyHref={path(locale, 'privacy')} t={t} />
          </div>
        </div>
      </section>
    </Shell>
  )
}
