'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const DESK = '(min-width: 900px) and (min-height: 640px)'

// "How it works" as a pinned three-act scene:
//   1 find the kiosk (kiosk + the five places), 2 pick a meal (dishes orbit),
//   3 heat and eat (a five-minute timer that runs down with the scroll).
export default function StepsStory({ steps, places, dishes, labels }) {
  const root = useRef(null)
  const [step, setStep] = useState(0)
  const [secs, setSecs] = useState(300)

  useEffect(() => {
    const el = root.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mm = gsap.matchMedia()
    mm.add(DESK, () => {
      const q = gsap.utils.selector(el)
      const texts = q('.ss-text'), scenes = q('.ss-scene'), ring = q('.timer-ring')[0]
      const N = texts.length
      const dur = reduce ? 0 : 1
      gsap.set([...texts.slice(1)], { autoAlpha: 0, y: 40 })
      gsap.set([...scenes.slice(1)], { autoAlpha: 0, scale: 0.92 })
      let cur = 0
      const go = (i) => {
        if (i === cur) return
        const dir = i > cur ? 1 : -1
        gsap.to(texts[cur], { autoAlpha: 0, y: -40 * dir, duration: 0.45 * dur, ease: 'power2.in', overwrite: true })
        gsap.fromTo(texts[i], { autoAlpha: 0, y: 40 * dir }, { autoAlpha: 1, y: 0, duration: 0.9 * dur, delay: 0.2 * dur, ease: 'expo.out', overwrite: true })
        gsap.to(scenes[cur], { autoAlpha: 0, scale: 0.92, filter: 'blur(10px)', duration: 0.5 * dur, ease: 'power2.in', overwrite: true })
        gsap.fromTo(scenes[i], { autoAlpha: 0, scale: 1.08, filter: 'blur(10px)' }, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 1 * dur, delay: 0.15 * dur, ease: 'expo.out', overwrite: true })
        cur = i; setStep(i)
      }
      const st = ScrollTrigger.create({
        trigger: q('.ss-pin')[0], start: 'top top', end: `+=${N * 85}%`, pin: true, anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress
          go(Math.min(N - 1, Math.floor(p * N)))
          const t = Math.max(0, Math.min(1, (p - (N - 1) / N) * N * 1.15)) // last act: timer runs down
          setSecs(Math.round(300 * (1 - t)))
          if (ring) ring.style.strokeDashoffset = String(1 - t)
          el.style.setProperty('--p', p.toFixed(3))
        },
      })
      return () => st.kill()
    })
    mm.add('(max-width: 899px), (max-height: 639px)', () => {
      // small screens: the timer runs once when it scrolls into view
      if (reduce) { setSecs(0); return }
      const o = { s: 300 }
      const ring = el.querySelector('.ss-scene.s3 .timer-ring')
      const tw = gsap.to(o, { s: 0, duration: 3, ease: 'power1.inOut', onUpdate: () => { setSecs(Math.round(o.s)); if (ring) ring.style.strokeDashoffset = String(1 - o.s / 300) }, scrollTrigger: { trigger: el.querySelector('.ss-scene.s3'), start: 'top 75%', once: true } })
      return () => tw.kill()
    })
    return () => mm.revert()
  }, [])

  const mm = String(Math.floor(secs / 60)), ss = String(secs % 60).padStart(2, '0')
  return (
    <section className="ss" ref={root} aria-label={labels.title}>
      <div className="ss-pin">
        <div className="ss-progress" aria-hidden="true">
          {steps.map(([t], i) => <span key={t} className={step === i ? 'on' : step > i ? 'done' : ''}><b>{String(i + 1).padStart(2, '0')}</b>{t}</span>)}
        </div>

        <div className="ss-grid">
          <div className="ss-texts">
            {steps.map(([t, p], i) => (
              <article className={`ss-text t${i + 1}`} key={t}>
                <span className="ss-num">{String(i + 1).padStart(2, '0')}</span>
                <h2>{t}</h2>
                <p>{p}</p>
              </article>
            ))}
          </div>

          <div className="ss-stage">
            {/* act 1: the kiosk and where to find it */}
            <div className="ss-scene s1">
              <div className="s1-kiosk"><Image src="/images/cutouts/grabeat-kiosk-pod.png" alt="" width={534} height={780} sizes="(max-width: 900px) 50vw, 22vw" /></div>
              <ul className="s1-places">{places.map((p, i) => <li key={p} style={{ '--i': i }}><i />{p}</li>)}</ul>
            </div>
            {/* act 2: choose from the menu */}
            <div className="ss-scene s2">
              <div className="orbit">
                {dishes.map((d, i) => (
                  <div className="orbit-item" key={d.name} style={{ '--a': `${(360 / dishes.length) * i}deg` }}>
                    <Image src={d.cutout} alt={d.name} width={400} height={400} sizes="180px" />
                  </div>
                ))}
              </div>
              <div className="orbit-core"><b>50+</b><span>{labels.choose}</span></div>
            </div>
            {/* act 3: heat and eat */}
            <div className="ss-scene s3">
              <div className="timer">
                <svg viewBox="0 0 120 120" aria-hidden="true">
                  <circle cx="60" cy="60" r="54" className="timer-track" pathLength="1" />
                  <circle cx="60" cy="60" r="54" className="timer-ring" pathLength="1" />
                </svg>
                <div className="timer-read" aria-live="off">
                  <small>{labels.ready}</small>
                  <b>{mm}:{ss}</b>
                </div>
              </div>
              <p className="timer-note">{labels.timerNote}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
