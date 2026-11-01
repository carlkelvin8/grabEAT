'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Rich from './Rich'

gsap.registerPlugin(ScrollTrigger)

const DESK = '(min-width: 900px) and (min-height: 640px)'
const clamp01 = (v) => Math.max(0, Math.min(1, v))
const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
const fmt = (min) => { const m = ((Math.round(min / 5) * 5) % 1440 + 1440) % 1440; return [String(Math.floor(m / 60)).padStart(2, '0'), String(m % 60).padStart(2, '0')] }
// point on the sky arc (viewBox 1000 × 560), t = 0 at the left horizon, 1 at the right
const arc = (t) => [500 - 440 * Math.cos(Math.PI * t), 520 - 440 * Math.sin(Math.PI * t)]

// "A day with grabEAT": a pinned, scroll-scrubbed day from morning to night. The clock runs,
// the sky changes, the sun crosses the arc and becomes the moon, and each chapter brings its
// own place and dish. Visitors can also drag the timeline or jump to a chapter.
export default function DayStory({ chapters, labels, kioskAlt }) {
  const root = useRef(null)
  const st = useRef(null)
  const dragging = useRef(false)
  const [active, setActive] = useState(0)
  const [time, setTime] = useState(fmt(toMin(chapters[0].time)))
  const [pct, setPct] = useState(0)
  const N = chapters.length

  useEffect(() => {
    const el = root.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mm = gsap.matchMedia()

    mm.add(DESK, () => {
      const q = gsap.utils.selector(el)
      const skies = q('.sky'), chs = q('.day-ch'), dishes = q('.day-dish'), sun = q('g.orb-sun')[0], moon = q('g.orb-moon')[0]
      const mins = chapters.map((c, i) => toMin(c.time) + (i && toMin(c.time) < toMin(chapters[i - 1].time) ? 1440 : 0))
      const centers = chapters.map((_, i) => (i + 0.5) / N)
      const dur = reduce ? 0 : 1
      gsap.set([...chs.slice(1), ...dishes.slice(1)], { autoAlpha: 0 })
      let cur = 0

      const show = (i) => {
        if (i === cur) return
        const dir = i > cur ? 1 : -1
        gsap.to(chs[cur], { autoAlpha: 0, y: -40 * dir, filter: 'blur(8px)', duration: 0.5 * dur, ease: 'power2.in', overwrite: true })
        gsap.fromTo(chs[i], { autoAlpha: 0, y: 50 * dir, filter: 'blur(8px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.9 * dur, delay: 0.25 * dur, ease: 'expo.out', overwrite: true })
        gsap.to(dishes[cur], { autoAlpha: 0, y: 80 * dir, rotate: 40 * dir, scale: 0.8, duration: 0.6 * dur, ease: 'power2.in', overwrite: true })
        gsap.fromTo(dishes[i], { autoAlpha: 0, y: -120 * dir, rotate: -90 * dir, scale: 0.7 }, { autoAlpha: 1, y: 0, rotate: 0, scale: 1, duration: 1.2 * dur, delay: 0.2 * dur, ease: 'back.out(1.4)', overwrite: true })
        cur = i
        setActive(i)
      }

      const render = (p) => {
        // sky: each chapter's light peaks at its own point in the day
        skies.forEach((s, i) => { s.style.opacity = i === 0 ? 1 : clamp01(1 - Math.abs(p - centers[i]) * N * 0.95 + (i === N - 1 && p > centers[i] ? 1 : 0)) })
        const night = clamp01((p - 0.62) / 0.2)
        el.style.setProperty('--night', night.toFixed(3))
        el.style.setProperty('--eve', clamp01(1 - Math.abs(p - centers[N - 2]) * N * 0.95).toFixed(3))
        night > 0.5 ? el.setAttribute('data-dark', '') : el.removeAttribute('data-dark')
        // clock: piecewise between chapter times
        let m = mins[0]
        if (p >= centers[N - 1]) m = mins[N - 1]
        else for (let i = 0; i < N - 1; i++) if (p >= centers[i] && p < centers[i + 1]) m = mins[i] + (mins[i + 1] - mins[i]) * ((p - centers[i]) / (centers[i + 1] - centers[i]))
        setTime(fmt(m))
        // sun crosses the sky, then the moon rises
        const [sx, sy] = arc(0.05 + clamp01(p / 0.7) * 0.9)
        const [mx, my] = arc(0.15 + clamp01((p - 0.55) / 0.45) * 0.55)
        sun.setAttribute('transform', `translate(${sx.toFixed(1)} ${sy.toFixed(1)})`); sun.style.opacity = 1 - night
        moon.setAttribute('transform', `translate(${mx.toFixed(1)} ${my.toFixed(1)})`); moon.style.opacity = night
        // the sun reddens and swells as it nears the horizon
        el.style.setProperty('--low', clamp01((sy - 200) / 300).toFixed(3))
        if (!dragging.current) setPct(Math.round(p * 1000))
        show(Math.min(N - 1, Math.floor(p * N)))
      }

      st.current = ScrollTrigger.create({
        trigger: q('.day-pin')[0], start: 'top top', end: `+=${N * 90}%`, pin: true, anticipatePin: 1,
        refreshPriority: 10, // sits above the other pinned scenes, so it must be measured first
        onUpdate: (self) => render(self.progress),
      })
      ScrollTrigger.sort()
      ScrollTrigger.refresh()
      render(0)
      return () => { st.current = null }
    })

    // small screens: chapters stack, each one reveals as it arrives
    mm.add('(max-width: 899px), (max-height: 639px)', () => {
      if (reduce) return
      gsap.utils.toArray(el.querySelectorAll('.day-ch')).forEach((c) => {
        gsap.from(c.querySelectorAll('.ch-time, h3, p, .ch-place, .ch-dish'), { y: 40, opacity: 0, stagger: 0.08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 80%', once: true } })
      })
    })
    return () => mm.revert()
  }, [chapters, N])

  const goTo = (p, smooth = true) => {
    const s = st.current
    if (!s) return
    const y = s.start + p * (s.end - s.start)
    window.__lenis ? window.__lenis.scrollTo(y, smooth ? { duration: 1.4 } : { immediate: true }) : window.scrollTo({ top: y, behavior: smooth ? 'smooth' : 'auto' })
  }

  return (
    <section className="day" ref={root} aria-label={labels.tag}>
      <div className="day-pin">
        <div className="day-sky" aria-hidden="true">
          {chapters.map((c, i) => <i key={c.time} className={`sky sky-${i}`} />)}
          <i className="stars" />
        </div>
        <svg className="day-arc" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
          <defs>
            {/* sun: wide bloom, soft corona, limb-darkened disc */}
            <radialGradient id="sunBloom"><stop offset="0" stopColor="#fff1c9" stopOpacity=".95" /><stop offset=".18" stopColor="#ffd98a" stopOpacity=".7" /><stop offset=".45" stopColor="#f7a440" stopOpacity=".22" /><stop offset="1" stopColor="#f08a2a" stopOpacity="0" /></radialGradient>
            <radialGradient id="sunCorona"><stop offset=".55" stopColor="#fff6dc" stopOpacity=".9" /><stop offset=".75" stopColor="#ffd27a" stopOpacity=".45" /><stop offset="1" stopColor="#ffb347" stopOpacity="0" /></radialGradient>
            <radialGradient id="sunDisc" cx=".46" cy=".44" r=".6"><stop offset="0" stopColor="#fffdf3" /><stop offset=".55" stopColor="#fff0bf" /><stop offset=".85" stopColor="#ffd06a" /><stop offset="1" stopColor="#f6a43a" /></radialGradient>
            <radialGradient id="sunTint"><stop offset="0" stopColor="#ff8a3d" stopOpacity=".55" /><stop offset="1" stopColor="#e2452a" stopOpacity=".95" /></radialGradient>
            <linearGradient id="ray" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fff3cf" stopOpacity=".7" /><stop offset="1" stopColor="#fff3cf" stopOpacity="0" /></linearGradient>
            <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" /></filter>
            {/* moon: grey regolith texture, maria, craters, phase shadow, cold halo */}
            <radialGradient id="moonHalo"><stop offset="0" stopColor="#fffaf0" stopOpacity=".5" /><stop offset=".3" stopColor="#e8e4da" stopOpacity=".16" /><stop offset="1" stopColor="#e8e4da" stopOpacity="0" /></radialGradient>
            <radialGradient id="moonDisc" cx=".38" cy=".36" r=".72"><stop offset="0" stopColor="#fbf8f1" /><stop offset=".55" stopColor="#e7e1d3" /><stop offset=".9" stopColor="#c3bba8" /><stop offset="1" stopColor="#a69d89" /></radialGradient>
            <radialGradient id="crater" cx=".42" cy=".4" r=".6"><stop offset="0" stopColor="#8f8775" stopOpacity=".55" /><stop offset=".75" stopColor="#b3ab97" stopOpacity=".35" /><stop offset="1" stopColor="#fffaf0" stopOpacity=".5" /></radialGradient>
            <radialGradient id="moonShade" cx=".1" cy=".5" r=".95"><stop offset=".55" stopColor="#0c0a08" stopOpacity="0" /><stop offset=".8" stopColor="#0c0a08" stopOpacity=".45" /><stop offset="1" stopColor="#0c0a08" stopOpacity=".8" /></radialGradient>
            <clipPath id="moonClip"><circle r="44" /></clipPath>
            <filter id="moonTex" x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency=".11" numOctaves="4" seed="11" />
              <feColorMatrix type="matrix" values="0 0 0 0 .35  0 0 0 0 .32  0 0 0 0 .27  0 0 0 .55 -.12" />
            </filter>
          </defs>
          <path className="arc-line" d="M60 520 A440 440 0 0 1 940 520" />

          <g className="orb-sun" transform="translate(82 433)">
            <circle r="230" fill="url(#sunBloom)" className="sun-bloom" />
            <g className="sun-rays">
              {Array.from({ length: 18 }, (_, i) => <rect key={i} x="70" y="-1.2" width={i % 2 ? 110 : 160} height="2.4" rx="1.2" fill="url(#ray)" transform={`rotate(${i * 20})`} />)}
            </g>
            <circle r="92" fill="url(#sunCorona)" filter="url(#soft)" />
            <circle r="58" fill="url(#sunDisc)" />
            <circle r="58" fill="url(#sunTint)" className="sun-tint" />
          </g>

          <g className="orb-moon" transform="translate(200 300)" style={{ opacity: 0 }}>
            <circle r="150" fill="url(#moonHalo)" />
            <circle r="44" fill="url(#moonDisc)" />
            <g clipPath="url(#moonClip)">
              <rect x="-44" y="-44" width="88" height="88" filter="url(#moonTex)" />
              <ellipse cx="-12" cy="-10" rx="15" ry="11" fill="#968d79" opacity=".38" />
              <ellipse cx="8" cy="6" rx="12" ry="9" fill="#968d79" opacity=".32" />
              <ellipse cx="-20" cy="14" rx="9" ry="6" fill="#968d79" opacity=".28" />
              {[[-24, -22, 4], [14, -20, 3], [20, 18, 5], [-6, 24, 3.2], [-30, 4, 2.6], [4, -30, 2.2], [26, -4, 2.4]].map(([x, y, r]) => <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill="url(#crater)" />)}
              <circle r="44" fill="url(#moonShade)" />
            </g>
          </g>
        </svg>

        <header className="day-head">
          <span className="eyebrow">{labels.tag}</span>
          <h2>{labels.title.map((r, i) => <span key={i} className="split-line"><span><Rich text={r} /></span></span>)}</h2>
        </header>

        <div className="day-clock" aria-live="polite" aria-atomic="true">
          <span>{time[0]}</span><span className="colon">:</span><span>{time[1]}</span>
          <small><i className="dot" />{labels.open}</small>
        </div>

        <div className="day-kiosk" aria-hidden="true">
          <i className="kiosk-glow" />
          <Image src="/images/cutouts/grabeat-kiosk-pod.png" alt="" width={534} height={780} sizes="(max-width: 900px) 40vw, 18vw" />
        </div>

        <div className="day-dishes" aria-hidden="true">
          {chapters.map((c) => (
            <div className="day-dish" key={c.time}>
              <Image src={c.dish.cutout} alt="" width={400} height={400} sizes="(max-width: 900px) 50vw, 300px" />
            </div>
          ))}
        </div>

        <div className="day-chapters">
          {chapters.map((c, i) => (
            <article className={`day-ch ch-${i}`} key={c.time} aria-hidden={active !== i ? 'true' : undefined}>
              <span className="ch-time">{String(i + 1).padStart(2, '0')} · {c.time}</span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              <Link className="ch-place u-link" href={c.place.href} tabIndex={active === i ? 0 : -1}>{c.place.name} →</Link>
              <figure className="ch-dish">
                <Image src={c.dish.cutout} alt={c.dish.name} width={400} height={400} sizes="60vw" />
                <figcaption>{c.dish.name} · {c.dish.price} kr</figcaption>
              </figure>
            </article>
          ))}
        </div>

        <nav className="day-nav" aria-label={labels.scrub}>
          <div className="day-times">
            {chapters.map((c, i) => (
              <button key={c.time} type="button" className={active === i ? 'on' : ''} aria-current={active === i ? 'step' : undefined}
                onClick={() => goTo((i + 0.5) / N)}>
                <b>{c.time}</b><span>{c.title}</span>
              </button>
            ))}
          </div>
          <input type="range" min="0" max="1000" value={pct} aria-label={labels.scrub} data-cursor="⟷"
            onPointerDown={() => { dragging.current = true }} onPointerUp={() => { dragging.current = false }}
            onChange={(e) => { setPct(+e.target.value); goTo(+e.target.value / 1000, false) }} />
          <p className="day-hint">{labels.hint}</p>
        </nav>
      </div>
    </section>
  )
}
