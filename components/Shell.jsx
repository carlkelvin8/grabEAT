import Header from './Header'
import Footer from './Footer'
import StickyBar from './StickyBar'
import JsonLd from './JsonLd'
import Reveal from './Reveal'
import Chatbot from './Chatbot'
import { organization } from '@/lib/schema'
import { dict } from '@/lib/dict'

export default function Shell({ locale, pageKey, sub, schema, children }) {
  return (
    <>
      <a className="skip" href="#content">{dict[locale].skip}</a>
      <Header locale={locale} pageKey={pageKey} sub={sub} />
      <main id="content">{children}</main>
      <Footer locale={locale} />
      <Reveal />
      <StickyBar locale={locale} />
      <Chatbot locale={locale} />
      <JsonLd data={[organization(), ...(schema ? [].concat(schema) : [])]} />
    </>
  )
}
