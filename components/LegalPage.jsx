import Shell from './Shell'
import PageCover from './PageCover'
import { dict } from '@/lib/dict'

export default function LegalPage({ locale, pageKey }) {
  const d = dict[locale][pageKey]
  return (
    <Shell locale={locale} pageKey={pageKey}>
      <PageCover eyebrow={dict[locale].pages.legal.eyebrow} rows={[d.h1]} lead={d.draft} />
      <section className="section legal-sec">
        <div className="wrap legal-grid">
          <nav className="legal-toc" aria-label={d.h1}>
            <ol>{d.sections.map(([h], i) => <li key={h}><a className="u-link" href={`#s${i + 1}`}>{h}</a></li>)}</ol>
          </nav>
          <div className="legal-body">
            {d.sections.map(([h, t], i) => (
              <section id={`s${i + 1}`} key={h} data-reveal="up">
                <span className="legal-n">{String(i + 1).padStart(2, '0')}</span>
                <h2>{h}</h2>
                <p>{t}</p>
              </section>
            ))}
          </div>
        </div>
      </section>
    </Shell>
  )
}
