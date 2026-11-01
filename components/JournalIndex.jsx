'use client'
import { useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import PostCard from './PostCard'

// Category tabs with a sliding underline; the grid re-flows with a soft fade when filtering.
export default function JournalIndex({ posts, cats, allLabel, readLabel }) {
  const [cat, setCat] = useState('all')
  const shown = cat === 'all' ? posts : posts.filter((p) => p.category === cat)
  const tabs = [['all', allLabel, posts.length], ...cats.map(([k, label]) => [k, label, posts.filter((p) => p.category === k).length])]
  return (
    <LayoutGroup>
      <div className="jtabs" role="tablist">
        {tabs.map(([k, label, n]) => (
          <button key={k} type="button" role="tab" aria-selected={cat === k} className={cat === k ? 'on' : ''} onClick={() => setCat(k)} disabled={n === 0 && k !== 'all'}>
            {label}<sup>{n}</sup>
            {cat === k && <motion.i className="jtab-line" layoutId="jtab-line" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
          </button>
        ))}
      </div>
      <motion.div className="jgrid" layout>
        <AnimatePresence mode="popLayout">
          {shown.map((p) => (
            <motion.div key={p.id} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
              <PostCard post={p} readLabel={readLabel} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  )
}
