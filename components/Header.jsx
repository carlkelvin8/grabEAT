import Link from 'next/link'
import { dict } from '@/lib/dict'
import { path } from '@/lib/site'
import Logo from './Logo'
import NavState from './NavState'
import MobileMenu from './MobileMenu'

export default function Header({ locale, pageKey, sub }) {
  const d = dict[locale]
  const other = locale === 'no' ? 'en' : 'no'
  const keys = ['menu', 'how', 'solutions', 'locations', 'blog', 'about', 'contact']
  const links = keys.map((k) => ({ href: path(locale, k), label: d.nav[k], current: k === pageKey }))
  const switchHref = path(other, pageKey, sub)
  return (
    <header className="nav">
      <NavState />
      <Link className="logo" href={path(locale, 'home')} aria-label="grabEAT"><Logo priority /></Link>
      <nav className="nav-links" aria-label="Main">
        {links.map((l) => <Link key={l.href} className="u-link" href={l.href} aria-current={l.current ? 'page' : undefined}>{l.label}</Link>)}
      </nav>
      <div className="nav-right">
        <Link className="lang" href={switchHref} hrefLang={other === 'no' ? 'nb' : 'en'} lang={other === 'no' ? 'nb' : 'en'}>{other === 'no' ? 'NO' : 'EN'}</Link>
        <Link className="btn sm" href={path(locale, 'locations')} data-track="find_kiosk" data-magnetic>
          {d.cta.findShort}<span className="arrow" aria-hidden="true"><i>→</i></span>
        </Link>
        <MobileMenu
          links={[...links, { href: path(locale, 'business'), label: d.cta.apply }]}
          lang={{ href: switchHref, label: d.switchTo }}
          phone={{ href: 'tel:+4747223288', label: '+47 472 23 288' }}
          labels={{ open: d.nav.menu, close: '×' }}
        />
      </div>
    </header>
  )
}
