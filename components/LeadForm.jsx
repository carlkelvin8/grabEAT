'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { track } from '@/lib/track'

// kind: 'host' (kiosk application) | 'contact' | 'qr'
export default function LeadForm({ kind, locale, thanksPath, privacyHref, t, locations = [] }) {
  const router = useRouter()
  const [state, setState] = useState('idle')

  async function onSubmit(e) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    if (fd.get('website')) return // honeypot
    setState('sending')
    const body = Object.fromEntries(fd.entries())
    body.kind = kind
    body.locale = locale
    body.marketingConsent = fd.get('marketingConsent') === 'on'
    body.consent = fd.get('consent') === 'on'
    try {
      const res = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error('bad')
      track(kind === 'host' ? 'generate_lead' : kind === 'qr' ? 'qr_signup' : 'contact_submit', { form: kind })
      router.push(thanksPath)
    } catch {
      setState('error')
    }
  }

  const isQr = kind === 'qr'
  return (
    <form className="lead-form" onSubmit={onSubmit}>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      {!isQr && <label className="field">{t.name}<input name="name" required autoComplete="name" /></label>}
      {kind === 'host' && <label className="field">{t.company}<input name="company" required autoComplete="organization" /></label>}
      <label className="field">{t.email}<input type="email" name="email" required autoComplete="email" /></label>
      <label className="field">{isQr ? t.phoneOpt : t.phone}<input type="tel" name="phone" autoComplete="tel" required={kind === 'host'} /></label>
      {kind === 'host' && <label className="field">{t.location}<input name="siteLocation" /></label>}
      {kind === 'contact' && <label className="field">{t.message}<textarea name="message" rows={4} required /></label>}
      <label className="check"><input type="checkbox" name="consent" required /><span>{t.consentRequired} <a href={privacyHref} target="_blank" rel="noopener">{t.privacyLink}</a></span></label>
      {/* separate, unticked marketing consent (GDPR) */}
      <label className="check"><input type="checkbox" name="marketingConsent" defaultChecked={false} /><span>{t.consentMarketing}</span></label>
      <button className="btn gold" type="submit" disabled={state === 'sending'} data-magnetic>{state === 'sending' ? t.sending : t.submit}<span className="arrow" aria-hidden="true"><i>→</i></span></button>
      {state === 'error' && <p className="form-error" role="alert">{t.error}</p>}
    </form>
  )
}
