'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

// Logo intro on every full page load (first visit, reload, return visit). It lives in the
// root layout, so client-side navigation between pages does not replay it.
// Skipped for prefers-reduced-motion; hidden for visitors without JavaScript (see layout).
export default function Loader() {
  const ref = useRef(null)
  const [show, setShow] = useState(true)

  useEffect(() => {
    const ready = () => { window.__grabeatReady = true; window.dispatchEvent(new Event('grabeat:ready')) }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setShow(false); ready(); return }
    const el = ref.current
    const q = gsap.utils.selector(el)
    document.documentElement.classList.add('is-loading')
    window.__lenis?.stop()
    const n = { v: 0 }
    const count = q('.loader-count')[0]
    const done = () => {
      document.documentElement.classList.remove('is-loading')
      window.__lenis?.start()
      setShow(false)
    }
    const tl = gsap.timeline({ onComplete: done })
    tl.fromTo(q('.loader-glow'), { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4, ease: 'expo.out' }, 0)
      // the wordmark is written in from left to right
      .fromTo(q('.lm-base'), { clipPath: 'inset(0 100% 0 0)', scale: 0.94 }, { clipPath: 'inset(0 0% 0 0)', scale: 1, duration: 1.1, ease: 'power3.inOut' }, 0.1)
      .fromTo(q('.loader-line i'), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power2.inOut' }, 0.2)
      .to(n, { v: 100, duration: 1.2, ease: 'power2.inOut', onUpdate: () => { count.textContent = String(Math.round(n.v)).padStart(3, '0') } }, 0.2)
      // a light sweep across the letters, then a small pop
      .fromTo(q('.lm-shine'), { xPercent: -130 }, { xPercent: 130, duration: 0.8, ease: 'power2.inOut' }, 1.0)
      .to(q('.loader-mark'), { scale: 1.05, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out' }, 1.3)
      // out: the mark lifts away and the two halves open like a curtain
      .to(q('.loader-inner, .loader-glow'), { y: -30, opacity: 0, duration: 0.4, ease: 'power3.in' }, 1.75)
      .add(ready, 1.95)
      .to(q('.loader-panel.top'), { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, 1.9)
      .to(q('.loader-panel.bottom'), { yPercent: 100, duration: 0.9, ease: 'expo.inOut' }, 1.9)
    return () => { tl.kill(); document.documentElement.classList.remove('is-loading'); window.__lenis?.start() }
  }, [])

  if (!show) return null
  return (
    <div className="loader" ref={ref} aria-hidden="true">
      <i className="loader-panel top" />
      <i className="loader-panel bottom" />
      <i className="loader-glow" />
      <div className="loader-inner">
        <div className="loader-mark">
          <img className="lm-base" src="/images/grabeat-logo.png" alt="" width="260" height="107" />
          <i className="lm-shine" />
        </div>
        <div className="loader-line"><i /></div>
        <span className="loader-count">000</span>
      </div>
    </div>
  )
}
