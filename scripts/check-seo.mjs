// Fails if any page title is over 60 chars or description over 155 chars, in either language.
import { dict } from '../lib/dict.js'
let bad = 0
for (const [loc, d] of Object.entries(dict)) {
  for (const [key, m] of Object.entries(d.meta)) {
    const t = m.title.length, s = m.desc.length
    const ok = t <= 60 && s <= 155
    if (!ok) bad++
    console.log(`${ok ? 'ok ' : 'BAD'} ${loc}/${key} title=${t} desc=${s}`)
  }
}
process.exit(bad ? 1 : 0)
