const items = [
  'STRENGTH TRAINING', 'CARDIO', 'ZUMBA', 'CROSSFIT', 'YOGA',
  'PERSONAL TRAINING', 'WEIGHT LOSS', 'MUSCLE BUILDING', 'BOXING',
  'NUTRITION COACHING', 'STRENGTH TRAINING', 'CARDIO', 'ZUMBA', 'CROSSFIT', 'YOGA',
  'PERSONAL TRAINING', 'WEIGHT LOSS', 'MUSCLE BUILDING', 'BOXING', 'NUTRITION COACHING',
]

export default function Ticker() {
  return (
    <div className="bg-brand-orange py-4 overflow-hidden border-y border-orange-600">
      <div className="ticker-track flex gap-12 whitespace-nowrap w-max">
        {items.map((item, i) => (
          <span key={i} className="font-display text-white text-lg tracking-widest flex items-center gap-12">
            {item}
            <span className="text-white/50 text-sm">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
