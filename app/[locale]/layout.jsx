import { Fraunces, Inter } from 'next/font/google'
import { notFound } from 'next/navigation'
import { LOCALES, SITE } from '@/lib/site'
import { dict } from '@/lib/dict'
import Analytics from '@/components/Analytics'
import CookieBanner from '@/components/CookieBanner'
import SmoothScroll from '@/components/SmoothScroll'
import Cursor from '@/components/Cursor'
import Loader from '@/components/Loader'
import '../globals.css'
import '../branding.css'

const serif = Fraunces({ subsets: ['latin'], axes: ['opsz', 'SOFT', 'WONK'], style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' })
const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })

export const dynamicParams = false
export function generateStaticParams() { return LOCALES.map((locale) => ({ locale })) }

export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#ffffff' }

export const metadata = {
  metadataBase: new URL(SITE.url),
  applicationName: SITE.name,
}

export default async function RootLayout({ children, params }) {
  const { locale } = await params
  if (!LOCALES.includes(locale)) notFound()
  const d = dict[locale]
  return (
    <html lang={d.htmlLang} className={`${serif.variable} ${sans.variable}`}>
      <body>
        <noscript><style>{'.loader{display:none!important}'}</style></noscript>
        <SmoothScroll />
        <Loader />
        {children}
        <Cursor />
        <CookieBanner {...d.cookie} />
        <Analytics />
      </body>
    </html>
  )
}
