'use client'
import { useEffect, useState } from 'react'
import Script from 'next/script'
import { CONSENT_KEY, track } from '@/lib/track'

const GA = process.env.NEXT_PUBLIC_GA_ID
const PIXEL = process.env.NEXT_PUBLIC_META_PIXEL_ID
const LINKEDIN = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID

// Loads GA4 / Meta Pixel / LinkedIn Insight only after consent, and tracks the conversion clicks.
export default function Analytics() {
  const [ok, setOk] = useState(false)

  useEffect(() => {
    const read = () => { try { setOk(localStorage.getItem(CONSENT_KEY) === 'granted') } catch {} }
    read()
    window.addEventListener('grabeat-consent', read)
    return () => window.removeEventListener('grabeat-consent', read)
  }, [])

  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest?.('a')
      if (!a) return
      const href = a.getAttribute('href') || ''
      if (href.startsWith('tel:')) track('click_phone')
      else if (href.startsWith('mailto:')) track('click_email')
      else if (a.dataset.track === 'find_kiosk') track('click_find_kiosk')
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  if (!ok) return null
  return (
    <>
      {GA && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA}');`}</Script>
        </>
      )}
      {PIXEL && (
        <Script id="meta-pixel" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL}');fbq('track','PageView');`}</Script>
      )}
      {LINKEDIN && (
        <Script id="linkedin" strategy="afterInteractive">{`window._linkedin_partner_id="${LINKEDIN}";window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(window._linkedin_partner_id);(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName("script")[0];var b=document.createElement("script");b.type="text/javascript";b.async=true;b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";s.parentNode.insertBefore(b,s)})(window.lintrk);`}</Script>
      )}
    </>
  )
}
