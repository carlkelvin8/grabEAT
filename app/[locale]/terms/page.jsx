import LegalPage from '@/components/LegalPage'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata({ params }) { const { locale } = await params; return pageMetadata(locale, 'terms') }
export default async function Page({ params }) { const { locale } = await params; return <LegalPage locale={locale} pageKey="terms" /> }
