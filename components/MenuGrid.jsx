'use client'
import { useState } from 'react'
import MealCard from './MealCard'

// Editorial menu: one chapter per supplier. Dishes with a photo get a plate card,
// the rest are typeset as a classic menu list with dotted leaders and prices.
export default function MenuGrid({ items, suppliers, t }) {
  const [sup, setSup] = useState('all')
  const groups = (sup === 'all' ? suppliers : [sup]).map((s) => ({ s, list: items.filter((i) => i.supplier === s) }))
  return (
    <>
      <div className="chips" role="tablist">
        {[['all', t.all], ...suppliers.map((s) => [s, s])].map(([k, label]) => (
          <button key={k} type="button" className={sup === k ? 'on' : ''} onClick={() => setSup(k)} role="tab" aria-selected={sup === k}>
            {label} <small>{k === 'all' ? items.length : items.filter((i) => i.supplier === k).length}</small>
          </button>
        ))}
      </div>
      {groups.map(({ s, list }) => {
        const withPhoto = list.filter((i) => i.photo)
        const rest = list.filter((i) => !i.photo)
        return (
          <section className="menu-group" key={s} aria-label={s}>
            <div className="menu-group-head"><h2>{s}</h2><span>{list.length} {t.dishes}</span></div>
            {withPhoto.length > 0 && <div className="meal-grid">{withPhoto.map((item) => <MealCard key={item.id} item={item} />)}</div>}
            {rest.length > 0 && (
              <ul className="menu-rows">
                {rest.map((i) => (
                  <li key={i.id}>
                    <span className="name">{i.name}</span>
                    {i.tags?.length ? <ul className="tags">{i.tags.map((tg) => <li key={tg}>{tg}</li>)}</ul> : null}
                    <span className="dots" aria-hidden="true" />
                    <span className="price">{i.price} kr</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )
      })}
    </>
  )
}
