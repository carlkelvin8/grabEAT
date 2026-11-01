'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'

// Location rows. When a location has its own photo (`photo` on the item), that photo follows
// the cursor while hovering its row. Locations without a photo show no preview at all.
export default function SpotList({ items, open, view }) {
  const prev = useRef(null)
  const [hover, setHover] = useState(null)
  const hasPhotos = items.some((it) => it.photo)

  useEffect(() => {
    const el = prev.current
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' })
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' })
    const r = gsap.quickTo(el, 'rotation', { duration: 0.8, ease: 'power3.out' })
    let lastX = 0
    const move = (e) => { x(e.clientX + 30); y(e.clientY - 110); r(Math.max(-12, Math.min(12, (e.clientX - lastX) * 0.6))); lastX = e.clientX }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [hasPhotos])

  const enter = (it) => {
    setHover(it.photo ? it : null)
    if (prev.current) gsap.to(prev.current, { opacity: it.photo ? 1 : 0, scale: it.photo ? 1 : 0.6, duration: 0.5, ease: 'power3.out' })
  }
  const leave = () => prev.current && gsap.to(prev.current, { opacity: 0, scale: 0.6, duration: 0.5, ease: 'power3.out' })

  return (
    <>
      <ul className="spot-list" data-reveal="stagger" onPointerLeave={leave}>
        {items.map((it, i) => (
          <li className="spot" key={it.href} onPointerEnter={() => enter(it)}>
            <Link href={it.href} data-cursor={view}>
              <span className="spot-i">{String(i + 1).padStart(2, '0')}</span>
              <span className="spot-name">{it.name}</span>
              <span className="spot-area"><span className="chip live">{open}</span> &nbsp;{it.area}</span>
              <span className="spot-arrow" aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ul>
      {hasPhotos && (
        <div className="spot-preview" ref={prev} aria-hidden="true">
          {hover && <Image src={hover.photo} alt="" fill sizes="300px" />}
        </div>
      )}
    </>
  )
}
