'use client'
import { useState } from 'react'

export default function CopyButton({ text, labels }) {
  const [done, setDone] = useState(false)
  const copy = async () => { try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1600) } catch {} }
  return <button type="button" className="copy-btn" onClick={copy}>{done ? labels.copied : labels.copy}</button>
}
