// border variants cycling: pink, teal, gold
const borderVariants = ['card-pink', 'card-teal', 'card-gold']

// index pattern to match screenshot: pink, teal, gold, teal, pink, teal, teal, pink, teal
const borderPattern = [
  'card-pink',
  'card-teal',
  'card-gold',
  'card-teal',
  'card-pink',
  'card-teal',
  'card-teal',
  'card-teal',
  'card-teal',
]

export default function SkeletonCard({ index = 0 }) {
  const variant = borderPattern[index % borderPattern.length]

  return (
    <div
      className={`${variant} rounded-sm bg-[#131829] relative overflow-hidden`}
      style={{ minHeight: '220px' }}
    >
      {/* Faint index label */}
      <span className="absolute bottom-4 left-4 font-mono text-[10px] text-white/10 skeleton-shimmer">
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Subtle inner glow at top */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </div>
  )
}
