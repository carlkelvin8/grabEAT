import Link from 'next/link'
import Image from 'next/image'

// Journal card. With a cover it shows the photo; without one it becomes a typographic tile
// in the category's colour, so the grid never shows an empty image box.
export default function PostCard({ post, variant = 'card', readLabel }) {
  const feature = variant === 'feature'
  return (
    <article className={`jcard ${feature ? 'jcard-feature' : ''} cat-${post.category}`}>
      <Link href={post.href} className="jcard-media" data-cursor={readLabel} tabIndex={-1} aria-hidden="true">
        {post.cover
          ? <Image src={post.cover} alt="" fill sizes={feature ? '(max-width: 900px) 92vw, 55vw' : '(max-width: 900px) 92vw, 30vw'} />
          : <span className="jcard-type"><b>{post.categoryLabel.charAt(0)}</b><i>{post.categoryLabel}</i></span>}
      </Link>
      <div className="jcard-body">
        <div className="jcard-meta">
          <span className="jcard-cat">{post.categoryLabel}{post.draft ? ' · DRAFT' : ''}</span>
          <span>{post.date}</span>
          <span>{post.minutes}</span>
        </div>
        <h3><Link href={post.href} className="jcard-link">{post.title}</Link></h3>
        {post.excerpt && <p>{post.excerpt}</p>}
        {feature && <span className="btn gold sm jcard-cta" aria-hidden="true">{readLabel}<span className="arrow"><i>→</i></span></span>}
      </div>
    </article>
  )
}
