'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

// FAQ accordion. Every answer stays in the HTML (collapsed to height 0, not removed),
// so search engines and AI crawlers can read all of them.
export default function Accordion({ items }) {
  const [open, setOpen] = useState(0)
  return (
    <div className="acc" data-reveal="stagger">
      {items.map(([q, a], i) => {
        const on = open === i
        return (
          <div className={`acc-item ${on ? 'open' : ''}`} key={q}>
            <button type="button" className="acc-q" aria-expanded={on} aria-controls={`acc-${i}`} onClick={() => setOpen(on ? -1 : i)}>
              {q}<span className="acc-icon" aria-hidden="true" />
            </button>
            <motion.div id={`acc-${i}`} className="acc-a" initial={false} animate={{ height: on ? 'auto' : 0, opacity: on ? 1 : 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
              <p>{a}</p>
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}
