'use client'
import { useEffect, useState } from 'react'
import { CONSENT_KEY } from '@/lib/track'

export default function CookieBanner({ text, accept, reject }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    try { if (!localStorage.getItem(CONSENT_KEY)) setShow(true) } catch { setShow(true) }
  }, [])
  const choose = (v) => {
    try { localStorage.setItem(CONSENT_KEY, v) } catch {}
    window.dispatchEvent(new Event('grabeat-consent'))
    setShow(false)
  }
  if (!show) return null
  return (
    <div className="cookie" role="dialog" aria-label="Cookies">
      <p>{text}</p>
      <div>
        <button className="pill sm ghost" onClick={() => choose('denied')}>{reject}</button>
        <button className="pill sm" onClick={() => choose('granted')}>{accept}</button>
      </div>
    </div>
  )
}
