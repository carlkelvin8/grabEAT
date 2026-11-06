'use client'
import { useState, useRef, useEffect } from 'react'
import { SITE, LOCATIONS, path } from '@/lib/site'
import { MENU } from '@/content/menu'
import { BASE } from '@/lib/sendLead'

// Rule-based assistant: every answer is written by hand from facts already on the website.
// No AI model and no network call. Unknown questions are sent to the contact page.

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9æøå ]/g, ' ')
const prices = MENU.map((m) => m.price)
const MIN = Math.min(...prices), MAX = Math.max(...prices)
const SUPPLIERS = ['Tren og Mat', 'Asian Corner', 'Le Chef', 'Nawabs'].join(', ')

const T = {
  no: {
    title: 'grabEAT-assistent', sub: 'Automatiske svar fra nettsiden', open: 'Åpne chat', close: 'Lukk chat', send: 'Send', ph: 'Skriv et spørsmål …',
    hello: 'Hei! Jeg svarer på vanlige spørsmål om grabEAT: kiosker, åpningstider, meny og hvordan du får en kiosk. Hva lurer du på?',
    fallback: 'Det kan jeg dessverre ikke svare på her. Kontakt oss, så hjelper vi deg.',
    chips: ['Hvor finner jeg en kiosk?', 'Når er dere åpne?', 'Hva koster maten?', 'Hvordan fungerer det?', 'Få en kiosk til bedriften', 'Kontakt'],
  },
  en: {
    title: 'grabEAT assistant', sub: 'Automated answers from the website', open: 'Open chat', close: 'Close chat', send: 'Send', ph: 'Type a question …',
    hello: 'Hi! I answer common questions about grabEAT: kiosks, opening hours, the menu and how to get a kiosk. What would you like to know?',
    fallback: "I can't answer that here, sorry. Contact us and we'll help you.",
    chips: ['Where can I find a kiosk?', 'When are you open?', 'How much does the food cost?', 'How does it work?', 'Get a kiosk for my business', 'Contact'],
  },
}

const answers = (locale) => {
  const no = locale === 'no'
  const places = LOCATIONS.map((l) => `${l.name}: ${l.hours}`).join('; ')
  return [
    { k: ['kiosk', 'kiosker', 'lokasjon', 'lokasjoner', 'hvor', 'finne', 'finn', 'sted', 'where', 'find', 'location', 'locations', 'near', 'forum', 'kokstad', 'voss', 'kvale', 'tesla', 'gulating', 'lagmannsrett', 'vestlandshallen', 'bergen'],
      a: no ? `Vi har fem kiosker i Bergen og på Voss: ${places}.` : `We have five kiosks in Bergen and Voss: ${places}.`,
      link: ['locations', no ? 'Se alle lokasjoner' : 'See all locations'] },
    { k: ['apen', 'apent', 'apne', 'apning', 'apningstid', 'apningstider', 'stengt', 'natt', 'open', 'hours', 'opening', 'closed', 'night', 'when', 'nar', '24'],
      a: places },
    { k: ['pris', 'priser', 'koster', 'kost', 'kr', 'nok', 'betal', 'betale', 'price', 'prices', 'cost', 'much', 'pay', 'payment', 'card', 'kort'],
      a: no ? `Rettene koster fra ${MIN} til ${MAX} kr. Du betaler trygt og kontaktløst i kiosken.` : `Meals cost from ${MIN} to ${MAX} NOK. You pay safely and contactlessly at the kiosk.`,
      link: ['menu', no ? 'Se menyen' : 'See the menu'] },
    { k: ['meny', 'mat', 'rett', 'retter', 'spise', 'vegetar', 'vegan', 'menu', 'food', 'meal', 'meals', 'dish', 'dishes', 'eat'],
      a: no ? `Menyen har over 50 varme og sunne retter, laget av fire kjøkken (${SUPPLIERS}). Fra koreansk bulgogi til smørkylling.` : `The menu has over 50 hot, healthy dishes from four kitchens (${SUPPLIERS}). From Korean bulgogi to butter chicken.`,
      link: ['menu', no ? 'Se menyen' : 'See the menu'] },
    { k: ['allergi', 'allergier', 'allergen', 'allergener', 'gluten', 'laktose', 'nott', 'nøtter', 'ingrediens', 'ingredienser', 'allergy', 'allergens', 'allergies', 'ingredient', 'ingredients', 'nut', 'nuts', 'lactose'],
      a: no ? 'Ingredienser og allergener er ikke publisert på nettsiden ennå. Kontakt oss før du bestiller hvis du har allergier.' : "Ingredients and allergens aren't published on the website yet. Please contact us first if you have allergies.",
      link: ['contact', no ? 'Kontakt oss' : 'Contact us'] },
    { k: ['fungerer', 'bruke', 'bestille', 'hvordan', 'minutt', 'minutter', 'varme', 'how', 'works', 'use', 'order', 'minutes', 'heat'],
      a: no ? 'Slik fungerer det: 1) Finn en kiosk. 2) Velg et måltid fra menyen. 3) Betal trygt og kontaktløst. 4) Nyt. Måltidet er klart på få minutter, uten kø og uten å bestille på forhånd.' : 'How it works: 1) Find a kiosk. 2) Choose a meal from the menu. 3) Pay safely and contactlessly. 4) Enjoy. Your meal is ready in minutes, with no queue and no need to order ahead.',
      link: ['how', no ? 'Slik fungerer det' : 'How it works'] },
    { k: ['bedrift', 'bedriften', 'kantine', 'arbeidsplass', 'soke', 'sok', 'strom', 'internett', 'host', 'business', 'workplace', 'canteen', 'apply', 'company', 'install', 'electric', 'internet', 'partner'],
      a: no ? 'Vil du ha en grabEAT-kiosk hos deg? Kiosken trenger bare strøm og internett. Send en søknad, så vurderer vi den og besøker lokasjonen din.' : 'Want a grabEAT kiosk at your site? It only needs electricity and internet. Send an application and we will review it and visit your location.',
      link: ['business', no ? 'For bedrifter' : 'For business'] },
    { k: ['kontakt', 'telefon', 'ring', 'epost', 'mail', 'adresse', 'contact', 'phone', 'call', 'email', 'address', 'reach'],
      a: no ? `Du når oss på ${SITE.phone} eller ${SITE.email}.` : `You can reach us on ${SITE.phone} or ${SITE.email}.`,
      link: ['contact', no ? 'Kontaktside' : 'Contact page'] },
    { k: ['invest', 'investor', 'investere', 'investing', 'investors'],
      a: no ? 'Er du interessert i å investere? Les mer på siden for investorer.' : 'Interested in investing? Read more on the investors page.',
      link: ['investors', no ? 'For investorer' : 'For investors'] },
    { k: ['om oss', 'hvem', 'historie', 'hva er grabeat', 'about', 'who', 'story', 'what is grabeat'],
      a: no ? 'grabEAT AS gjør varm, sunn mat tilgjengelig hele døgnet fra kiosker i Bergen og på Voss.' : 'grabEAT AS makes hot, healthy food available around the clock from kiosks in Bergen and Voss.',
      link: ['about', no ? 'Om oss' : 'About us'] },
    { k: ['hei', 'hallo', 'hello', 'hi', 'hey', 'takk', 'thanks', 'thank'],
      a: no ? 'Hei! Hva kan jeg hjelpe deg med?' : 'Hi! How can I help you?' },
  ]
}

function answer(locale, q) {
  const words = norm(q).split(/\s+/).filter(Boolean)
  const text = ' ' + words.join(' ') + ' '
  let best = null, score = 0
  for (const it of answers(locale)) {
    let s = 0
    for (const k of it.k) {
      const nk = norm(k).trim()
      if (nk.includes(' ') ? text.includes(' ' + nk + ' ') : words.includes(nk)) s += nk.length > 3 ? 2 : 1
    }
    if (s > score) { score = s; best = it }
  }
  return best
}

export default function Chatbot({ locale }) {
  const t = T[locale]
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState([{ from: 'bot', text: t.hello }])
  const [val, setVal] = useState('')
  const end = useRef(null)
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }) }, [msgs, open])

  function ask(q) {
    const text = q.trim()
    if (!text) return
    const hit = answer(locale, text)
    const bot = hit ? { from: 'bot', text: hit.a, link: hit.link } : { from: 'bot', text: t.fallback, link: ['contact', locale === 'no' ? 'Kontakt oss' : 'Contact us'] }
    setMsgs((m) => [...m, { from: 'me', text }, bot])
    setVal('')
  }
  const href = (key) => `${BASE}${path(locale, key)}${BASE ? "/" : ""}`

  return (
    <div className="cb">
      {open && (
        <div className="cb-panel" role="dialog" aria-label={t.title}>
          <div className="cb-head">
            <div><strong>{t.title}</strong><small>{t.sub}</small></div>
            <button type="button" onClick={() => setOpen(false)} aria-label={t.close}>×</button>
          </div>
          <div className="cb-body" aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className={`cb-msg ${m.from}`}>{m.text}{m.link && <a href={href(m.link[0])}>{m.link[1]} →</a>}</div>
            ))}
            {msgs.length < 3 && <div className="cb-chips">{t.chips.map((c) => <button type="button" key={c} onClick={() => ask(c)}>{c}</button>)}</div>}
            <div ref={end} />
          </div>
          <form className="cb-form" onSubmit={(e) => { e.preventDefault(); ask(val) }}>
            <input value={val} onChange={(e) => setVal(e.target.value)} placeholder={t.ph} aria-label={t.ph} maxLength={200} />
            <button type="submit">{t.send}</button>
          </form>
        </div>
      )}
      <button type="button" className="cb-fab" onClick={() => setOpen((o) => !o)} aria-label={open ? t.close : t.open}>{open ? '×' : '💬'}</button>
    </div>
  )
}
