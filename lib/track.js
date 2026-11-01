'use client'
// Fires a GA4 event if analytics consent was given and gtag has loaded.
export function track(event, params = {}) {
  if (typeof window === 'undefined') return
  if (typeof window.gtag === 'function') window.gtag('event', event, params)
  if (typeof window.fbq === 'function' && event === 'generate_lead') window.fbq('track', 'Lead')
}
export const CONSENT_KEY = 'grabeat-consent'
