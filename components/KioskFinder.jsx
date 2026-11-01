'use client'
import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'

// Location picker: big rows on the left, a live Google map on the right that follows the selection.
export default function KioskFinder({ items, labels }) {
  const [sel, setSel] = useState(0)
  const [loading, setLoading] = useState(true)
  const cur = items[sel]
  const pick = (i) => { if (i !== sel) { setLoading(true); setSel(i) } }
  return (
    <div className="finder">
      <ol className="finder-list" role="listbox" aria-label={labels.pick}>
        {items.map((it, i) => (
          <li key={it.slug} role="option" aria-selected={sel === i} className={sel === i ? 'on' : ''}
            onPointerEnter={() => window.matchMedia('(hover: hover)').matches && pick(i)}>
            <button type="button" onClick={() => pick(i)} className="finder-row">
              <span className="f-i">{String(i + 1).padStart(2, '0')}</span>
              <span className="f-name">{it.name}</span>
              <span className="f-area">{it.area}</span>
            </button>
            <div className="finder-actions">
              <span className="chip live">{labels.open}</span>
              <Link className="u-link" href={it.href}>{labels.details} →</Link>
              <a className="u-link" href={it.directions} target="_blank" rel="noopener noreferrer" data-track="find_kiosk">{labels.directions} ↗</a>
            </div>
          </li>
        ))}
      </ol>
      <div className="finder-map">
        <div className="finder-map-head">
          <AnimatePresence mode="wait">
            <motion.div key={cur.slug} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
              <span className="eyebrow">{cur.area}</span>
              <h2>{cur.name}</h2>
            </motion.div>
          </AnimatePresence>
          <a className="btn gold sm" href={cur.directions} target="_blank" rel="noopener noreferrer" data-track="find_kiosk">{labels.directions}<span className="arrow" aria-hidden="true"><i>↗</i></span></a>
        </div>
        <div className={`finder-frame ${loading ? 'loading' : ''}`}>
          <iframe key={cur.slug} title={`${labels.map}: ${cur.name}`} src={cur.embed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" onLoad={() => setLoading(false)} />
        </div>
      </div>
    </div>
  )
}
