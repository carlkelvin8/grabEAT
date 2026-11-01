// Crawls the site from /no and /en and reports every internal link that is broken (4xx/5xx)
// or that only works through a redirect. Usage: node scripts/check-links.mjs http://localhost:5173
const base = (process.argv[2] || 'http://localhost:5173').replace(/\/$/, '')
const seen = new Map(), queue = ['/no', '/en'], bad = [], redirected = []
const hrefs = (html) => [...html.matchAll(/<a\b[^>]*?href="([^"#]+)(?:#[^"]*)?"/g)].map((m) => m[1])
const alts = (html) => [...html.matchAll(/<link rel="(?:alternate|canonical)"[^>]*href="([^"]+)"/g)].map((m) => m[1])

while (queue.length) {
  const p = queue.shift()
  if (seen.has(p)) continue
  const res = await fetch(base + p, { redirect: 'manual' })
  seen.set(p, res.status)
  if (res.status >= 300 && res.status < 400) { redirected.push(`${p} -> ${res.headers.get('location')}`); continue }
  if (res.status >= 400) { bad.push(`${res.status} ${p}`); continue }
  if (!(res.headers.get('content-type') || '').includes('html')) continue
  const html = await res.text()
  for (const h of [...hrefs(html), ...alts(html)]) {
    if (/^(mailto:|tel:|javascript:)/.test(h)) continue
    let u = h
    if (/^https?:\/\//.test(h)) {
      if (h.startsWith('https://grabeat.no')) u = h.replace('https://grabeat.no', '')
      else if (h.startsWith(base)) u = h.slice(base.length)
      else continue // external (Google Maps etc.)
    }
    if (u.startsWith('/') && !u.startsWith('/_next') && !seen.has(u) && !queue.includes(u)) queue.push(u)
  }
}
console.log(`checked ${seen.size} URLs`)
console.log(bad.length ? 'BROKEN:\n' + bad.join('\n') : 'no broken links')
console.log(redirected.length ? 'REDIRECTING INTERNAL LINKS:\n' + redirected.join('\n') : 'no internal links depend on redirects')
process.exit(bad.length ? 1 : 0)
