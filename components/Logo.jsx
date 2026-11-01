import Image from 'next/image'

// Official grabEAT logo (orange wordmark, green leaf). `tagline` keeps the "Sunne og varme måltider 24/7" line.
export default function Logo({ className = '', priority = false }) {
  return (
    <Image className={`logo-img ${className}`} src="/images/grabeat-logo.png" alt="grabEAT" width={800} height={330} priority={priority} sizes="(max-width: 900px) 120px, 160px" />
  )
}
