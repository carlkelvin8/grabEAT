import { SITE } from '@/lib/site'

// Search engines and AI crawlers are explicitly allowed.
export default function robots() {
  const allow = { allow: '/', disallow: ['/api/'] }
  return {
    rules: [
      { userAgent: '*', ...allow },
      { userAgent: 'Googlebot', ...allow },
      { userAgent: 'GPTBot', ...allow },
      { userAgent: 'ClaudeBot', ...allow },
      { userAgent: 'PerplexityBot', ...allow },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  }
}
