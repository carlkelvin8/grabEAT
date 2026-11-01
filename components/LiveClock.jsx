'use client'
import { useEffect, useState } from 'react'

// Current time in Norway, so "open now" is literally true at any hour.
export default function LiveClock({ city, label, locale }) {
  const [t, setT] = useState(null)
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat(locale === 'no' ? 'nb-NO' : 'en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Oslo' })
    const tick = () => setT(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 15000)
    return () => clearInterval(id)
  }, [locale])
  return (
    <span className="live-clock" aria-live="off">
      <span className="chip live">{label}</span>
      <span className="lc-time">{city} <b suppressHydrationWarning>{t ?? '--:--'}</b></span>
    </span>
  )
}
