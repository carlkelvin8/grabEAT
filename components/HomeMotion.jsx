'use client'
import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

// All home-page choreography. Desktop gets pinned, scrubbed scenes; small screens get
// lighter reveals. Nothing runs for prefers-reduced-motion. ScrollTriggers are created
// in page order so pin spacing above is accounted for below.
export default function HomeMotion() {
  useEffect(() => {
    const mm = gsap.matchMedia()
    const splits = []
    let offReady = () => {}

    mm.add({ motion: '(prefers-reduced-motion: no-preference)', desk: '(min-width: 900px)' }, (ctx) => {
      const { motion, desk } = ctx.conditions
      if (!motion) return

      /* ---------- cover hero: intro (waits for the loader) ---------- */
      const chars = new SplitText('.cover-title .hw', { type: 'words,chars' })
      splits.push(chars)
      const inRow = (sel) => chars.chars.filter((c) => c.closest(sel))
      const left = inRow('.ct-left'), right = inRow('.ct-right'), front = inRow('.ct-front')
      const intro = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
      intro
        .from('.cover-light', { scale: 0.4, opacity: 0, duration: 2.2 }, 0)
        .from('.cover-arch path', { strokeDasharray: 1600, strokeDashoffset: 1600, duration: 2.2, ease: 'power2.inOut' }, 0)
        // intro moves the inner rig; the scroll scene below owns .cover-kiosk, so they never fight
        .from('.kiosk-rig', { yPercent: 18, opacity: 0, scale: 0.94, duration: 1.8 }, 0.15)
        .from(left, { xPercent: -110, opacity: 0, duration: 1.3, stagger: { each: 0.04, from: 'end' } }, 0.35)
        .from(right, { xPercent: 110, opacity: 0, duration: 1.3, stagger: 0.04 }, 0.35)
        .from(front, { yPercent: 110, rotate: 5, duration: 1.2, stagger: 0.03 }, 0.6)
        .from('.cover-top > *', { y: 16, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.5)
        .from('.cover-bottom > *', { y: 20, opacity: 0, duration: 0.9, stagger: 0.1 }, 1.0)
      const play = () => intro.play()
      if (window.__grabeatReady) play()
      else { window.addEventListener('grabeat:ready', play, { once: true }); offReady = () => window.removeEventListener('grabeat:ready', play) }
      const failsafe = setTimeout(play, 2600)

      // the warm light pulses slowly
      gsap.to('.cover-light', { scale: 1.08, opacity: 0.85, duration: 5, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 2 })

      // pointer: kiosk turns slightly in 3D
      const kiosk = document.querySelector('.cover-kiosk')
      gsap.set(kiosk, { transformPerspective: 1200 })
      const kx = gsap.quickTo(kiosk, 'rotationY', { duration: 1.2, ease: 'power3.out' })
      const ky = gsap.quickTo(kiosk, 'rotationX', { duration: 1.2, ease: 'power3.out' })
      const layers = gsap.utils.toArray('.cover [data-depth]').filter((el) => el !== kiosk).map((el) => ({
        d: parseFloat(el.dataset.depth), x: gsap.quickTo(el, 'x', { duration: 1.1, ease: 'power3.out' }), y: gsap.quickTo(el, 'y', { duration: 1.1, ease: 'power3.out' }),
      }))
      const onMove = (e) => {
        const nx = e.clientX / window.innerWidth - 0.5, ny = e.clientY / window.innerHeight - 0.5
        kx(nx * 10); ky(-ny * 6)
        layers.forEach((l) => { l.x(nx * 50 * l.d); l.y(ny * 34 * l.d) })
      }
      if (desk) window.addEventListener('pointermove', onMove)

      // scrolling away: the cover holds, the words part, and the camera flies into the kiosk screen
      const fly = gsap.timeline({ scrollTrigger: desk
        ? { trigger: '.cover', start: 'top top', end: '+=90%', scrub: 0.7, pin: true, refreshPriority: 20 }
        : { trigger: '.cover', start: 'top top', end: 'bottom top', scrub: true } })
      fly
        .to('.ct-left', { xPercent: -70, opacity: 0, ease: 'power2.in' }, 0)
        .to('.ct-right', { xPercent: 70, opacity: 0, ease: 'power2.in' }, 0)
        .to('.ct-front', { yPercent: 90, opacity: 0, ease: 'power2.in' }, 0)
        .to('.cover-top, .cover-bottom', { y: -30, opacity: 0, ease: 'power2.in' }, 0)
        .to('.cover-arch, .cover-beams', { opacity: 0, scale: 1.3, ease: 'none' }, 0)
        .to('.kiosk-reflect', { opacity: 0 }, 0)
      if (desk) {
        fly
          // zoom about the screen's centre and bring it to the middle of the viewport
          .to('.cover-kiosk', { scale: 4.4, xPercent: 10, yPercent: 12, transformOrigin: '39.6% 31.1%', ease: 'power3.in', duration: 1 }, 0.05)
          // into the dark of the screen...
          .to('.cover-veil', { opacity: 1, duration: 0.22, ease: 'power2.in' }, 0.62)
          .set('.cover-kiosk', { opacity: 0 }, 0.86)
          // ...and out into the morning of the day story
          .to('.cover-veil', { backgroundColor: '#f3c9a3', duration: 0.18 }, 0.86)
      } else {
        fly.to('.cover-kiosk', { scale: 1.12, yPercent: 6, ease: 'none' }, 0)
      }

      /* ---------- food: horizontal gallery ---------- */
      if (desk) {
        const track = document.querySelector('.food-track')
        const slide = gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth), ease: 'none',
          scrollTrigger: { trigger: '.food-pin', start: 'top top', end: () => `+=${track.scrollWidth - window.innerWidth}`, scrub: 0.8, pin: true, invalidateOnRefresh: true },
        })
        gsap.utils.toArray('.dish').forEach((card) => {
          const plate = card.querySelector('.dish-plate .disc')
          if (plate) gsap.fromTo(plate, { rotate: -50, scale: 0.75 }, { rotate: 50, scale: 1, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: slide, start: 'left right', end: 'right left', scrub: true } })
          gsap.from(card.querySelector('.dish-bottom'), { y: 40, opacity: 0, ease: 'power2.out', scrollTrigger: { trigger: card, containerAnimation: slide, start: 'left 85%', end: 'left 45%', scrub: true } })
        })
        // cards lean with scroll velocity
        const skew = gsap.quickTo('.dish', 'skewX', { duration: 0.5, ease: 'power3.out' })
        ScrollTrigger.create({ trigger: '.food-pin', start: 'top top', end: () => `+=${track.scrollWidth}`, onUpdate: (s) => skew(gsap.utils.clamp(-8, 8, s.getVelocity() / -250)), onLeave: () => skew(0), onLeaveBack: () => skew(0) })
      }

      /* ---------- comparison: grabEAT column glows in ---------- */
      gsap.from('.vs-us', { backgroundColor: 'rgba(27,22,19,0)', color: '#1b1613', stagger: 0.08, duration: 1, scrollTrigger: { trigger: '.vs-table', start: 'top 70%', once: true } })

      /* ---------- business: kiosk rises out of the dark ---------- */
      gsap.from('.showcase-stage', { y: 120, rotationX: 18, scale: 0.9, transformPerspective: 1400, ease: 'none', scrollTrigger: { trigger: '.biz', start: 'top bottom', end: 'center center', scrub: true } })

      return () => { window.removeEventListener('pointermove', onMove); clearTimeout(failsafe); offReady() }
    })

    // first refresh after images/fonts settle so pin lengths are right
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh)
    return () => { window.removeEventListener('load', refresh); mm.revert(); splits.forEach((s) => s.revert()) }
  }, [])
  return null
}
