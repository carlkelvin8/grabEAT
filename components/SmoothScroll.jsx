'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Lenis smooth scrolling driven by the GSAP ticker, so ScrollTrigger and Lenis stay in sync.
// Also drives the top scroll-progress bar. Off for reduced motion and touch devices.
export default function SmoothScroll() {
  const pathname = usePathname()

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let lenis
    const tick = (t) => lenis?.raf(t * 1000)
    if (!reduce) {
      lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true })
      window.__lenis = lenis
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
    }
    const bar = document.querySelector('.progress i')
    const prog = bar && gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.2 } })
    return () => { gsap.ticker.remove(tick); lenis?.destroy(); window.__lenis = undefined; prog?.scrollTrigger?.kill(); prog?.kill() }
  }, [])

  useEffect(() => {
    window.__lenis ? window.__lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0)
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [pathname])

  return <div className="progress" aria-hidden="true"><i /></div>
}
