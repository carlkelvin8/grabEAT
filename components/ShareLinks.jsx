'use client'
import { useState } from 'react'

// Copy link + native share (where the browser supports it).
export default function ShareLinks({ title, labels }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => { try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch {} }
  const share = () => navigator.share?.({ title, url: window.location.href }).catch(() => {})
  return (
    <div className="share">
      <span>{labels.share}</span>
      <button type="button" onClick={copy}>{copied ? labels.copied : labels.copy}</button>
      <button type="button" onClick={share} className="share-native">↗</button>
    </div>
  )
}
