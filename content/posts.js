// Blog posts. grabEAT supplies the articles (1 per week); add each one here.
//
// Scheduling: a post goes live automatically on `publishDate` (YYYY-MM-DD, Oslo time) with no
// redeploy needed; pages revalidate hourly. Pick the same weekday each week, e.g. every Tuesday.
// `draft: true` posts are never public and only show in development, to preview the template.
//
// Fields: slug/title/excerpt/body per language (`no`, `en`), `category` ('food' | 'kiosks' | 'news'),
// `author`, optional `faq` ([[question, answer], ...] per language) and `cta`
// ('find' | 'apply' | 'menu') for the button at the end of the post, and optional `cover`
// (an image path under /public) shown on the journal page and at the top of the article.
// `desc` explains each topic on the journal page.
export const CATEGORIES = {
  food: { no: 'Mat', en: 'Food', desc: { no: 'Rettene, leverandørene og hva som gjør et måltid sunt og mettende.', en: 'The dishes, the suppliers and what makes a meal healthy and filling.' } },
  kiosks: { no: 'Kiosker', en: 'Kiosks', desc: { no: 'Hvordan kioskene fungerer, og hvor du finner dem døgnet rundt.', en: 'How the kiosks work, and where to find them around the clock.' } },
  news: { no: 'Nyheter', en: 'News', desc: { no: 'Nye lokasjoner, nye retter og nytt fra grabEAT.', en: 'New locations, new dishes and news from grabEAT.' } },
}

export const POSTS = [
  {
    id: 'sample-template-preview',
    draft: true,
    publishDate: '2026-12-01',
    category: 'kiosks',
    author: 'grabEAT',
    cta: 'find',
    cover: '/images/kiosks/grabeat-kiosk-pod.jpg',
    slug: { no: 'eksempel-artikkel', en: 'sample-article' },
    title: { no: 'Eksempel: slik ser en artikkel ut', en: 'Sample: what an article looks like' },
    excerpt: {
      no: 'Dette er en eksempelartikkel som viser bloggmalen. Den vises ikke på det offentlige nettstedet.',
      en: 'This is a sample article showing the blog template. It does not appear on the public site.',
    },
    body: {
      no: ['Dette er første avsnitt i en eksempelartikkel.', 'Her kommer et avsnitt til. De ekte artiklene leveres av grabEAT.'],
      en: ['This is the first paragraph of a sample article.', 'Here is another paragraph. The real articles are supplied by grabEAT.'],
    },
    faq: {
      no: [['Er dette en ekte artikkel?', 'Nei, det er bare et eksempel på malen.']],
      en: [['Is this a real article?', 'No, it is only an example of the template.']],
    },
  },
]
