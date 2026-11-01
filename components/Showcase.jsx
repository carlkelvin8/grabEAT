'use client'
import { useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'

// Kiosk product shot: a warm spotlight follows the pointer, the frame tilts in 3D,
// and pulsing hotspots open short explanations.
export default function Showcase({ image, alt, note, spots }) {
  const stage = useRef(null)
  const [open, setOpen] = useState(null)
  const move = (e) => {
    const el = stage.current
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height
    el.style.setProperty('--mx', `${px * 100}%`); el.style.setProperty('--my', `${py * 100}%`)
    gsap.to(el, { rotationY: (px - 0.5) * 10, rotationX: -(py - 0.5) * 8, duration: 0.8, ease: 'power3.out', transformPerspective: 1400 })
  }
  const reset = () => stage.current && gsap.to(stage.current, { rotationY: 0, rotationX: 0, duration: 1, ease: 'elastic.out(1,0.5)' })
  return (
    <div className="showcase" data-reveal="up">
      <div className="showcase-stage" ref={stage} onPointerMove={move} onPointerLeave={reset}>
        <Image src={image} alt={alt} width={1600} height={973} sizes="(max-width: 900px) 92vw, 55vw" />
        <div className="spotlight" aria-hidden="true" />
        {spots.map((s, i) => (
          <button key={s.title} type="button" className="hotspot" style={{ left: `${s.x}%`, top: `${s.y}%` }}
            aria-expanded={open === i} aria-label={s.title} onClick={() => setOpen(open === i ? null : i)} onPointerEnter={() => setOpen(i)}>
            {open === i ? '×' : '+'}
          </button>
        ))}
        <AnimatePresence>
          {open !== null && (
            <motion.div key={open} className="hotspot-tip" role="status"
              style={{ left: `min(${spots[open].x}%, calc(100% - 250px))`, top: `calc(${spots[open].y}% + 26px)` }}
              initial={{ opacity: 0, y: 10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
              <b>{spots[open].title}</b>{spots[open].text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="showcase-note">{note}</p>
    </div>
  )
}
