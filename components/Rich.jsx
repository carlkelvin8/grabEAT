// Renders copy where *words* between asterisks become <em> (the serif italic accent).
export default function Rich({ text }) {
  return text.split('*').map((part, i) => (i % 2 ? <em key={i}>{part}</em> : part))
}
