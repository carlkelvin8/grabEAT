const SLUGS = {
  menu: ['meny', 'menu'], 'how-it-works': ['slik-fungerer-det', 'how-it-works'], solutions: ['losninger', 'solutions'],
  about: ['om-oss', 'about'], contact: ['kontakt', 'contact'], 'for-business': ['for-bedrifter', 'for-business'],
  locations: ['lokasjoner', 'locations'], investors: ['investorer', 'investors'], join: ['bli-med', 'join'], 'thank-you': ['takk', 'thank-you'],
  privacy: ['personvern', 'privacy'], terms: ['vilkar', 'terms'], blog: ['blogg', 'blog'],
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { globalNotFound: true },
  async rewrites() {
    return Object.entries(SLUGS).flatMap(([folder, [no]]) => [
      { source: `/no/${no}`, destination: `/no/${folder}` },
      { source: `/no/${no}/:path*`, destination: `/no/${folder}/:path*` },
    ])
  },
  async redirects() {
    const r = [
      { source: '/', destination: '/no', permanent: false },
      // old / inconsistent URLs -> one canonical URL (301)
      { source: '/how-it-work', destination: '/en/how-it-works', permanent: true },
      { source: '/how-it-work/', destination: '/en/how-it-works', permanent: true },
      { source: '/how-it-works', destination: '/en/how-it-works', permanent: true },
      { source: '/how-it-works/', destination: '/en/how-it-works', permanent: true },
    ]
    // Norwegian pages must be reached through Norwegian slugs
    for (const [folder, [no]] of Object.entries(SLUGS)) {
      if (folder !== no) r.push({ source: `/no/${folder}`, destination: `/no/${no}`, permanent: true })
    }
    // English pages must be reached through English slugs (they already match the folders)
    return r
  },
}
export default nextConfig
