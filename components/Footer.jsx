import Link from 'next/link'
import Newsletter from './Newsletter'
import Logo from './Logo'
import Rich from './Rich'
import { dict } from '@/lib/dict'
import { SITE, LOCATIONS, path } from '@/lib/site'

export default function Footer({ locale }) {
  const d = dict[locale]
  const [a, b] = d.home.footerLine
  return (
    <footer className="footer" data-dark>
      <i className="ft-glow" aria-hidden="true" />
      <div className="wrap">
        <p className="ft-statement" data-reveal="lines"><span className="split-line"><span>{a}</span></span><span className="split-line"><span><Rich text={b} /></span></span></p>
        <div className="ft-cta">
          <Link className="btn gold" href={path(locale, 'locations')} data-track="find_kiosk" data-magnetic>{d.cta.find}<span className="arrow" aria-hidden="true"><i>→</i></span></Link>
          <Link className="btn light" href={path(locale, 'business')} data-magnetic>{d.cta.apply}<span className="arrow" aria-hidden="true"><i>→</i></span></Link>
        </div>
        <div className="ft-cols">
          <div>
            <Logo className="ft-logo" />
            <p className="ft-contact">
              <a className="u-link" href={`tel:${SITE.phoneHref}`}>{SITE.phone}</a><br />
              {SITE.email && <><a className="u-link" href={`mailto:${SITE.email}`}>{SITE.email}</a><br /></>}
              {SITE.address && <>{SITE.address}<br /></>}
              {SITE.socials.map((so) => <a key={so.url} className="u-link" href={so.url} target="_blank" rel="noopener noreferrer">{so.name}</a>)}
            </p>
          </div>
          <ul>
            <li className="ft-h">{d.nav.locations}</li>
            {LOCATIONS.map((l) => <li key={l.slug}><Link className="u-link" href={path(locale, 'locations', l.slug)}>{l.name}</Link></li>)}
          </ul>
          <ul>
            <li className="ft-h">{d.footer.company}</li>
            {['menu', 'how', 'solutions', 'blog', 'about', 'contact'].map((k) => <li key={k}><Link className="u-link" href={path(locale, k)}>{d.nav[k]}</Link></li>)}
            <li><Link className="u-link" href={path(locale, 'investors')}>{d.cta.invest}</Link></li>
          </ul>
          <div><Newsletter locale={locale} /></div>
        </div>
        <p className="copy">
          <span>© 2026 {d.footer.copy}</span>
          <span><Link href={path(locale, 'privacy')}>{d.footer.privacy}</Link> · <Link href={path(locale, 'terms')}>{d.footer.terms}</Link></span>
        </p>
      </div>
    </footer>
  )
}
