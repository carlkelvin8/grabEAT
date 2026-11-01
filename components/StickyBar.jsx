import { dict } from '@/lib/dict'
import { SITE, LOCATIONS, mapsDirections } from '@/lib/site'

// Mobile-only bar: "Find kiosk" opens Google Maps directions, "Call" dials the main number.
export default function StickyBar({ locale }) {
  const d = dict[locale]
  return (
    <div className="sticky-bar">
      <a href={mapsDirections(LOCATIONS[0].mapsQuery)} target="_blank" rel="noopener noreferrer" data-track="find_kiosk">{d.cta.findShort}</a>
      <a href={`tel:${SITE.phoneHref}`}>{d.cta.call}</a>
    </div>
  )
}
