import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Shell from '@/components/Shell'
import Accordion from '@/components/Accordion'
import Newsletter from '@/components/Newsletter'
import PostCard from '@/components/PostCard'
import ShareLinks from '@/components/ShareLinks'
import { dict } from '@/lib/dict'
import { pageMetadata } from '@/lib/seo'
import { article, faqPage, breadcrumbs } from '@/lib/schema'
import { allPosts, findPost, related, postMeta, categoryLabel, formatDate, readingTime } from '@/lib/blog'
import { LOCALES, path } from '@/lib/site'

export const revalidate = 3600
export const dynamicParams = true // posts scheduled for later are rendered on first request after they go live

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => allPosts().filter((p) => !p.draft).map((p) => ({ locale, slug: p.slug[locale] })))
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params
  const post = findPost(locale, slug)
  if (!post) return {}
  return { ...pageMetadata(locale, 'blog', post.slug, postMeta(locale, post)), ...(post.draft ? { robots: { index: false } } : {}) }
}

export default async function Post({ params }) {
  const { locale, slug } = await params
  const post = findPost(locale, slug)
  if (!post) notFound()
  const d = dict[locale]; const b = d.blog
  const faq = post.faq?.[locale]
  const schema = [article(locale, post), breadcrumbs([[b.h1, path(locale, 'blog')], [post.title[locale], path(locale, 'blog', post.slug)]])]
  if (faq?.length) schema.push(faqPage(faq))
  const ctas = { find: [d.cta.find, path(locale, 'locations')], apply: [d.cta.apply, path(locale, 'business')], menu: [d.cta.viewMenu, path(locale, 'menu')] }
  const [ctaLabel, ctaHref] = ctas[post.cta] || ctas.find
  const card = (p) => ({ id: p.id, draft: !!p.draft, category: p.category, categoryLabel: categoryLabel(locale, p.category), title: p.title[locale], date: formatDate(locale, p.publishDate), minutes: `${readingTime(p, locale)} ${b.min}`, cover: p.cover, href: path(locale, 'blog', p.slug) })
  const more = related(post)

  return (
    <Shell locale={locale} pageKey="blog" sub={post.slug} schema={schema}>
      <article className="post">
        <header className="post-head">
          <div className="wrap">
            <Link className="back u-link" href={path(locale, 'blog')}>← {b.back}</Link>
            <span className={`chip post-cat cat-${post.category}`}>{categoryLabel(locale, post.category)}{post.draft ? ' · DRAFT' : ''}</span>
            <h1 data-reveal="lines"><span className="split-line"><span>{post.title[locale]}</span></span></h1>
            <p className="lead" data-reveal="up">{post.excerpt[locale]}</p>
            <div className="post-meta" data-reveal="up">
              <span>{b.by} <b>{post.author}</b></span>
              <time dateTime={post.publishDate}>{formatDate(locale, post.publishDate)}</time>
              <span>{readingTime(post, locale)} {b.min}</span>
              <ShareLinks title={post.title[locale]} labels={{ share: b.share, copy: b.copy, copied: b.copied }} />
            </div>
          </div>
        </header>

        {post.cover && (
          <figure className="post-cover" data-reveal="clip">
            <Image src={post.cover} alt="" fill priority sizes="(max-width: 900px) 100vw, 1200px" />
          </figure>
        )}

        <div className="post-body">
          {post.body[locale].map((para, i) => <p key={i}>{para}</p>)}
        </div>

        {faq?.length ? (
          <section className="post-faq">
            <h2>{d.home.faqTitle}</h2>
            <Accordion items={faq} />
          </section>
        ) : null}

        <aside className="post-end" data-dark>
          <div>
            <h2>{ctaLabel}</h2>
            <Link className="btn gold" href={ctaHref} data-magnetic>{ctaLabel}<span className="arrow" aria-hidden="true"><i>→</i></span></Link>
          </div>
          <div className="post-end-news"><Newsletter locale={locale} /></div>
        </aside>
      </article>

      {more.length > 0 && (
        <section className="jlist post-related">
          <div className="wrap">
            <h2 className="jlist-title">{b.related}</h2>
            <div className="jgrid">{more.map((p) => <PostCard key={p.id} post={card(p)} readLabel={b.read} />)}</div>
          </div>
        </section>
      )}
    </Shell>
  )
}
