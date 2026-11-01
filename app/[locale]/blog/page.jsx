import Shell from '@/components/Shell'
import Rich from '@/components/Rich'
import PostCard from '@/components/PostCard'
import JournalIndex from '@/components/JournalIndex'
import Newsletter from '@/components/Newsletter'
import { dict } from '@/lib/dict'
import { pageMetadata } from '@/lib/seo'
import { allPosts, categoryLabel, formatDate, readingTime } from '@/lib/blog'
import { CATEGORIES } from '@/content/posts'
import { path } from '@/lib/site'

export const revalidate = 3600 // scheduled posts appear without a redeploy

export async function generateMetadata({ params }) { const { locale } = await params; return pageMetadata(locale, 'blog') }

const Lines = ({ rows, as: Tag = 'h2', className }) => (
  <Tag className={className} data-reveal="lines">{rows.map((r, i) => <span className="split-line" key={i}><span><Rich text={r} /></span></span>)}</Tag>
)

export default async function Journal({ params }) {
  const { locale } = await params
  const b = dict[locale].blog
  const posts = allPosts().map((p) => ({
    id: p.id, draft: !!p.draft, category: p.category, categoryLabel: categoryLabel(locale, p.category),
    title: p.title[locale], excerpt: p.excerpt[locale], author: p.author, date: formatDate(locale, p.publishDate),
    minutes: `${readingTime(p, locale)} ${b.min}`, cover: p.cover, href: path(locale, 'blog', p.slug),
  }))
  const [featured, ...rest] = posts
  const cats = Object.keys(CATEGORIES).map((k) => [k, CATEGORIES[k][locale]])

  return (
    <Shell locale={locale} pageKey="blog">
      {/* masthead */}
      <section className="jmast">
        <div className="wrap">
          <div className="jmast-top">
            <span className="eyebrow">{b.kicker}</span>
            <span className="jmast-count">{posts.length} {posts.length === 1 ? b.story : b.stories}</span>
          </div>
          <Lines rows={b.title} as="h1" className="jmast-title" />
          <div className="jmast-foot">
            <p className="lead" data-reveal="up">{b.intro}</p>
            <ul className="jmast-cats" data-reveal="stagger">
              {cats.map(([k, label]) => <li key={k}><span>{label}</span><b>{posts.filter((p) => p.category === k).length}</b></li>)}
            </ul>
          </div>
        </div>
      </section>

      {featured ? (
        <>
          <section className="jfeature">
            <div className="wrap">
              <span className="eyebrow">{b.featured}</span>
              <div data-reveal="up"><PostCard post={featured} variant="feature" readLabel={b.read} /></div>
            </div>
          </section>
          {rest.length > 0 && (
            <section className="jlist">
              <div className="wrap">
                <h2 className="jlist-title">{b.latest}</h2>
                <JournalIndex posts={rest} cats={cats} allLabel={b.all} readLabel={b.read} />
              </div>
            </section>
          )}
        </>
      ) : (
        <section className="jempty">
          <div className="wrap">
            <div className="jempty-copy">
              <Lines rows={b.emptyTitle} />
              <p className="lead" data-reveal="up">{b.emptyText}</p>
              <div className="jempty-news" data-reveal="up"><Newsletter locale={locale} /></div>
            </div>
            <ol className="jempty-issue" aria-hidden="true">
              {['01', '02', '03'].map((n) => <li key={n}><span>{n}</span><i /><i /><i /></li>)}
            </ol>
          </div>
        </section>
      )}

      {/* topics */}
      <section className="jtopics">
        <div className="wrap">
          <h2 className="jtopics-title">{b.topicsTitle}</h2>
          <ol className="jtopic-list" data-reveal="stagger">
            {cats.map(([k, label], i) => (
              <li key={k} className={`cat-${k}`}>
                <span className="jtopic-n">{String(i + 1).padStart(2, '0')}</span>
                <h3>{label}</h3>
                <p>{CATEGORIES[k].desc[locale]}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* newsletter band (only when there are posts; the empty state already has the form) */}
      {featured && (
        <section className="jnews" data-dark>
          <div className="wrap">
            <Lines rows={b.newsTitle} />
            <div className="jnews-form">
              <p>{b.newsText}</p>
              <Newsletter locale={locale} />
            </div>
          </div>
        </section>
      )}
    </Shell>
  )
}
