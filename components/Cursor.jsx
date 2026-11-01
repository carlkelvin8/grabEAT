'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

// Dot + trailing ring. Grows over links; shows a word over elements with data-cursor="Label".
// Also makes [data-magnetic] elements pull toward the pointer. Fine pointers only.
export default function Cursor() {
  const ref = useRef(null)
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const el = ref.current
    if (!fine || !el) return
    const dot = el.querySelector('.dot'), ring = el.querySelector('.ring'), label = el.querySelector('b')
    const dx = gsap.quickTo(dot, 'x', { duration: 0.08 }), dy = gsap.quickTo(dot, 'y', { duration: 0.08 })
    const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' }), ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' })
    let magnet = null, mx = null, my = null
    const move = (e) => {
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY)
      const t = e.target.closest?.('[data-cursor], a, button, summary, [role="tab"]')
      const word = t?.closest?.('[data-cursor]')?.dataset.cursor
      el.classList.toggle('label', !!word)
      el.classList.toggle('hover', !!t && !word)
      if (word) label.textContent = word
      const m = reduce ? null : e.target.closest?.('[data-magnetic]')
      if (m !== magnet) {
        if (magnet) gsap.to(magnet, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' })
        magnet = m
        if (m) { mx = gsap.quickTo(m, 'x', { duration: 0.4, ease: 'power3.out' }); my = gsap.quickTo(m, 'y', { duration: 0.4, ease: 'power3.out' }) }
      }
      if (magnet) { const r = magnet.getBoundingClientRect(); mx((e.clientX - r.left - r.width / 2) * 0.3); my((e.clientY - r.top - r.height / 2) * 0.4) }
    }
    const leave = () => el.classList.add('hide')
    const enter = () => el.classList.remove('hide')
    window.addEventListener('pointermove', move)
    document.addEventListener('pointerleave', leave)
    document.addEventListener('pointerenter', enter)
    return () => { window.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave); document.removeEventListener('pointerenter', enter) }
  }, [])
  return <div className="cursor" ref={ref} aria-hidden="true"><div className="dot" /><div className="ring"><b /></div></div>
}
