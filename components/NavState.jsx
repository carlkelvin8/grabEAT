'use client'
import { useEffect } from 'react'

// Header behaviour: solid after scrolling, hides on scroll down, shows on scroll up,
// and switches to light text while it sits over a [data-dark] section.
export default function NavState() {
  useEffect(() => {
    const nav = document.querySelector('.nav')
    if (!nav) return
    let last = window.scrollY, raf = 0
    const update = () => {
      raf = 0
      const y = window.scrollY
      nav.classList.toggle('scrolled', y > 40)
      nav.classList.toggle('hidden', y > 300 && y > last + 4 && !document.body.classList.contains('menu-open'))
      if (y < last - 4) nav.classList.remove('hidden')
      last = y
      const under = document.elementsFromPoint(window.innerWidth / 2, 40).find((e) => !nav.contains(e) && !e.closest('.cursor, .progress'))
      nav.classList.toggle('on-dark', !!under?.closest('[data-dark]') && !document.body.classList.contains('menu-open'))
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf) }
  }, [])
  return null
}
