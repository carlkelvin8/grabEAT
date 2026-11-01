import Rich from './Rich'

// Editorial opening for inner pages: eyebrow, oversized title with a serif-italic accent,
// lead, optional facts and actions, and an optional visual on the right.
// `large` makes the visual the hero of the cover: tall, standing on the section floor.
export default function PageCover({ eyebrow, rows, lead, live, meta, actions, art, dark, large }) {
  return (
    <section className={`pcover ${art ? 'has-art' : ''} ${large ? 'pcover-lg' : ''} ${dark ? 'dark' : ''}`} data-dark={dark ? '' : undefined}>
      <i className="pcover-glow" aria-hidden="true" />
      <div className="wrap pcover-grid">
        <div className="pcover-copy">
          <div className="pcover-top">
            {live && <span className="chip live">{live}</span>}
            <span className="eyebrow">{eyebrow}</span>
          </div>
          <h1 data-reveal="lines">{rows.map((r, i) => <span className="split-line" key={i}><span><Rich text={r} /></span></span>)}</h1>
          {lead && <p className="lead" data-reveal="up">{lead}</p>}
          {actions && <div className="pcover-actions" data-reveal="up">{actions}</div>}
          {meta && (
            <dl className="pcover-meta" data-reveal="stagger">
              {meta.map(([n, l]) => <div key={l}><dt>{n}</dt><dd>{l}</dd></div>)}
            </dl>
          )}
        </div>
        {art && (
          <div className="pcover-art" data-reveal={large ? "up" : "clip"}>
            {large && <svg className="pcover-arch" viewBox="0 0 400 560" preserveAspectRatio="none" aria-hidden="true"><path d="M20 560 V200 A180 180 0 0 1 380 200 V560" /></svg>}
            {art}
          </div>
        )}
      </div>
    </section>
  )
}
