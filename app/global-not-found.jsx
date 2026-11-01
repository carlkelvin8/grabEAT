import { Fraunces, Inter } from 'next/font/google'
import NotFoundView from '@/components/NotFoundView'
import SmoothScroll from '@/components/SmoothScroll'
import Cursor from '@/components/Cursor'
import './globals.css'

// Our root layout lives in app/[locale], so unmatched URLs need a global 404 (next.config: experimental.globalNotFound).
const serif = Fraunces({ subsets: ['latin'], axes: ['opsz', 'SOFT', 'WONK'], style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' })
const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })

export const metadata = { title: '404 | grabEAT', robots: { index: false } }

export default function GlobalNotFound() {
  return (
    <html lang="nb" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <SmoothScroll />
        <NotFoundView />
        <Cursor />
      </body>
    </html>
  )
}
