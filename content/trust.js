// Social proof. Leave the arrays empty until real content exists: the "customers" slide only
// renders when there is something to show, so the site never ships "coming soon" placeholders.
//
// reviews: [{ quote: { no: '...', en: '...' }, who: 'Name', role: 'Role or company' }]
// press:   [{ name: 'Outlet', url: 'https://...', logo: '/press/outlet.svg' }]
// founder: { name: 'Name', text: { no: '...', en: '...' } } or null
// partners: [{ name: 'Name', logo: '/images/partners/...png', url?: 'https://...' }]
// partners: logos shown on grabeat.no (programmes and supporters). No links until the URLs are confirmed.
export const TRUST = {
  reviews: [],
  press: [],
  founder: null,
  partners: [
    { name: 'Forskningsrådet', logo: '/images/partners/grabeat-partner-forskningsradet.png' },
    { name: 'Unity Spark', logo: '/images/partners/grabeat-partner-unity-spark.png' },
    { name: 'Startup Immigrants', logo: '/images/partners/grabeat-partner-startup-immigrants.png' },
    { name: 'TNA GTA', logo: '/images/partners/grabeat-partner-tna-gta.png' },
    { name: 'Aggrator', logo: '/images/partners/grabeat-partner-aggrator.png' },
    { name: 'Charge Incubator', logo: '/images/partners/grabeat-partner-charge.png' },
  ],
}
