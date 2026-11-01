import Image from 'next/image'
import Shell from '@/components/Shell'
import PageCover from '@/components/PageCover'
import MenuGrid from '@/components/MenuGrid'
import Newsletter from '@/components/Newsletter'
import { dict } from '@/lib/dict'
import { pageMetadata } from '@/lib/seo'
import { menu } from '@/lib/schema'
import { MENU, SUPPLIERS } from '@/content/menu'

export async function generateMetadata({ params }) { const { locale } = await params; return pageMetadata(locale, 'menu') }

export default async function MenuPage({ params }) {
  const { locale } = await params
  const d = dict[locale]; const m = d.menu; const pg = d.pages.menu
  const plates = MENU.filter((x) => x.cutout).slice(0, 3)
  const from = Math.min(...MENU.map((x) => x.price))
  return (
    <Shell locale={locale} pageKey="menu" schema={menu(locale)}>
      <PageCover
        eyebrow={`grabEAT · ${MENU.length} ${pg.dishes}`} rows={pg.title} lead={m.intro} live={d.locations.open}
        meta={[[String(MENU.length), pg.dishes], [String(SUPPLIERS.length), pg.suppliers], [`${from} kr`, pg.from]]}
        art={(
          <div className="plate-stack" aria-hidden="true">
            {plates.map((p, i) => <Image key={p.id} className={`ps ps${i}`} src={p.cutout} alt="" width={400} height={400} sizes="(max-width: 900px) 50vw, 300px" priority={i === 0} />)}
          </div>
        )}
      />
      <section className="section menu-sec">
        <div className="wrap">
          <MenuGrid items={MENU} suppliers={SUPPLIERS} t={{ all: m.all, dishes: pg.dishes }} />
        </div>
      </section>
      <section className="jnews" data-dark>
        <div className="wrap">
          <h2 data-reveal="lines"><span className="split-line"><span>{d.newsletter.title}</span></span></h2>
          <div className="jnews-form"><Newsletter locale={locale} /></div>
        </div>
      </section>
    </Shell>
  )
}
