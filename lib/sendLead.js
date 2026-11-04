// Prefix for raw <a> links. Next adds basePath to <Link> by itself, but not to plain anchors.
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH || ''

// Default: leads go to /api/lead (HubSpot). The WordPress build has no server routes, so its leads
// go to the site's existing Elementor Pro "Contact Form" on the same origin instead.
const WP_BUILD = process.env.NEXT_PUBLIC_WP_BUILD === '1'
const WP_FORM = { postId: '15047', formId: '732e946' }
const TOPIC = { host: 'Interested in bringing grabEAT to your workplace' }
const LABEL = { host: 'Kioskforesporsel', contact: 'Kontakt', qr: 'QR / pris-varsel', newsletter: 'Nyhetsbrev' }

async function sendToWordPress(b) {
  const fd = new FormData()
  fd.append('action', 'elementor_pro_forms_send_form')
  fd.append('post_id', WP_FORM.postId)
  fd.append('form_id', WP_FORM.formId)
  fd.append('queried_id', WP_FORM.postId)
  fd.append('referer_title', 'grabEAT')
  fd.append('form_fields[name]', b.name || String(b.email).split('@')[0])
  fd.append('form_fields[field_69d722e]', b.company || '')
  fd.append('form_fields[email]', b.email)
  // The Elementor form requires a numeric phone, even for sign-ups that do not ask for one.
  fd.append('form_fields[phone]', String(b.phone || '').replace(/[^\d]/g, '') || '0')
  if (TOPIC[b.kind]) fd.append('form_fields[field_5635893][]', TOPIC[b.kind])
  const lines = [`[${LABEL[b.kind] || b.kind}] via grabEAT /${b.locale || 'no'}/`, b.siteLocation && `Lokasjon: ${b.siteLocation}`, b.message, b.phone && `Telefon: ${b.phone}`, `Markedsforing: ${b.marketingConsent ? 'ja' : 'nei'}`].filter(Boolean)
  fd.append('form_fields[message]', lines.join('\n'))
  if (b.marketingConsent) fd.append('form_fields[field_8f6a68f]', 'on')
  const res = await fetch('/wp-admin/admin-ajax.php', { method: 'POST', body: fd })
  const json = await res.json().catch(() => null)
  if (!res.ok || !json || json.success !== true) throw new Error('send_failed')
}

async function sendToApi(b) {
  const res = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) })
  if (!res.ok) throw new Error('send_failed')
}

export const sendLead = WP_BUILD ? sendToWordPress : sendToApi
