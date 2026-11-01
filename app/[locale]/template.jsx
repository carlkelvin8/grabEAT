'use client'
import { motion, useReducedMotion } from 'framer-motion'

// Page transition: each route fades in (opacity only, so fixed and pinned children keep working).
export default function Template({ children }) {
  const reduce = useReducedMotion()
  return (
    <motion.div className="page-fade" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}
