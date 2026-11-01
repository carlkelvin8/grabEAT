'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Site-wide scroll reveals driven by data attributes, so every page shares one motion language:
//   data-reveal="lines"   each .split-line > span slides up from its mask
//   data-reveal="up"      element fades and rises
//   data-reveal="stagger" direct children rise one after another
//   data-reveal="clip"    element unmasks from the bottom
export default function Reveal() {
  const pathname = usePathname()
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      const st = (el) => ({ trigger: el, start: 'top 86%', once: true })
      gsap.utils.toArray('[data-reveal="lines"]').forEach((el) => {
        gsap.from(el.querySelectorAll('.split-line > span'), { yPercent: 110, duration: 1.1, stagger: 0.1, ease: 'expo.out', scrollTrigger: st(el) })
      })
      gsap.utils.toArray('[data-reveal="up"]').forEach((el) => gsap.from(el, { y: 50, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: st(el) }))
      gsap.utils.toArray('[data-reveal="stagger"]').forEach((el) => gsap.from(el.children, { y: 60, opacity: 0, duration: 1, stagger: 0.08, ease: 'expo.out', scrollTrigger: st(el) }))
      gsap.utils.toArray('[data-reveal="clip"]').forEach((el) => gsap.from(el, { clipPath: 'inset(100% 0 0 0)', duration: 1.3, ease: 'expo.inOut', scrollTrigger: st(el) }))
    })
    return () => ctx.revert()
  }, [pathname])
  return null
}
