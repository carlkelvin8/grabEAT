'use client'
import { useState } from 'react'
import { dict } from '@/lib/dict'
import { track } from '@/lib/track'

export default function Newsletter({ locale }) {
  const t = dict[locale].newsletter
  const [state, setState] = useState('idle')
  async function onSubmit(e) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setState('sending')
    try {
      const res = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: 'newsletter', locale, email: fd.get('email'), consent: true, marketingConsent: fd.get('marketingConsent') === 'on' }) })
      if (!res.ok) throw new Error()
      track('newsletter_signup')
      setState('done'); e.currentTarget.reset()
    } catch { setState('error') }
  }
  return (
    <form className="news" onSubmit={onSubmit}>
      <p className="news-title">{t.title}</p>
      <div className="news-row">
        <input type="email" name="email" required placeholder={t.placeholder} aria-label={t.placeholder} />
        <button type="submit" aria-label={t.button} disabled={state === 'sending'}>→</button>
      </div>
      <label className="check"><input type="checkbox" name="marketingConsent" required defaultChecked={false} /><span>{t.consent}</span></label>
      {state === 'done' && <p role="status">✓</p>}
      {state === 'error' && <p role="alert">{dict[locale].form.error}</p>}
    </form>
  )
}
