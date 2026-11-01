import { NextResponse } from 'next/server'

const GUIDS = {
  host: process.env.HUBSPOT_FORM_GUID_HOST,
  contact: process.env.HUBSPOT_FORM_GUID_CONTACT,
  newsletter: process.env.HUBSPOT_FORM_GUID_NEWSLETTER,
  qr: process.env.HUBSPOT_FORM_GUID_QR,
}

const emailOk = (s) => typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length < 255

// Saves a lead in HubSpot (Forms API). If HubSpot is not configured, development accepts the
// request but production refuses it, so no lead is ever silently lost.
export async function POST(req) {
  let b
  try { b = await req.json() } catch { return NextResponse.json({ ok: false }, { status: 400 }) }
  if (!Object.hasOwn(GUIDS, b.kind) || !emailOk(b.email) || b.consent !== true) return NextResponse.json({ ok: false }, { status: 400 })

  const portal = process.env.HUBSPOT_PORTAL_ID
  const guid = GUIDS[b.kind]
  if (!portal || !guid) {
    if (process.env.NODE_ENV === 'production') return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 })
    console.log(`[lead:${b.kind}] HubSpot not configured; accepted in development without storing.`)
    return NextResponse.json({ ok: true, stored: false })
  }

  const map = { name: 'firstname', company: 'company', email: 'email', phone: 'phone', message: 'message', siteLocation: 'kiosk_location' }
  const fields = Object.entries(map).filter(([k]) => b[k]).map(([k, name]) => ({ name, value: String(b[k]).slice(0, 2000) }))
  const res = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${portal}/${guid}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fields,
      context: { pageUri: req.headers.get('referer') || undefined },
      legalConsentOptions: {
        consent: {
          consentToProcess: true,
          text: 'Consent to store details to answer the enquiry.',
          // Needs the portal's own subscription type id; without it HubSpot only records processing consent.
          communications: process.env.HUBSPOT_SUBSCRIPTION_TYPE_ID ? [{ value: !!b.marketingConsent, subscriptionTypeId: Number(process.env.HUBSPOT_SUBSCRIPTION_TYPE_ID), text: 'Marketing emails from grabEAT' }] : [],
        },
      },
    }),
  })
  if (!res.ok) return NextResponse.json({ ok: false }, { status: 502 })
  return NextResponse.json({ ok: true, stored: true })
}
