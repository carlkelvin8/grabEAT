import Image from 'next/image'

// One dish with a real photo, shown as a plate. Dishes without photos use the menu list instead.
export default function MealCard({ item, sizes = '(max-width: 900px) 40vw, 240px', anim }) {
  return (
    <article className="meal" data-a={anim}>
      <div className="meal-photo">
        <Image src={item.photo} alt={item.name} fill sizes={sizes} />
      </div>
      <div className="meal-info">
        <span className="meal-sup">{item.supplier}</span>
        <h3>{item.name}</h3>
        <b className="meal-price">{item.price} kr</b>
        {item.tags?.length ? <ul className="tags">{item.tags.map((t) => <li key={t}>{t}</li>)}</ul> : null}
      </div>
    </article>
  )
}
