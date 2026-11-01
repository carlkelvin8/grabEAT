'use client'
import { useState } from 'react'

// Topic chips that write a first line into the contact form's message field.
export default function ContactTopics({ label, topics, prefill }) {
  const [on, setOn] = useState(null)
  const choose = (t, i) => {
    setOn(i)
    const ta = document.querySelector('.contact-form textarea[name="message"]')
    if (!ta) return
    const rest = ta.value.startsWith(prefill) ? ta.value.split('\n').slice(1).join('\n') : ta.value
    ta.value = `${prefill}${t}.\n${rest}`.trimEnd() + '\n'
    ta.focus()
  }
  return (
    <div className="topics">
      <span className="eyebrow">{label}</span>
      <div className="topic-chips">
        {topics.map((t, i) => <button key={t} type="button" className={on === i ? 'on' : ''} onClick={() => choose(t, i)}>{t}</button>)}
      </div>
    </div>
  )
}
