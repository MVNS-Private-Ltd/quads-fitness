import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const programs = [
  { tag: 'Popular', title: 'Strength & Conditioning', duration: '60 min', level: 'All Levels', color: 'from-orange-600/20 to-transparent', border: 'border-orange-500/30' },
  { tag: 'New', title: 'HIIT & Cardio Blast', duration: '45 min', level: 'Intermediate', color: 'from-red-600/20 to-transparent', border: 'border-red-500/20' },
  { tag: '', title: 'Yoga & Flexibility', duration: '60 min', level: 'Beginner', color: 'from-purple-600/10 to-transparent', border: 'border-purple-500/20' },
  { tag: '', title: 'Personal Training', duration: 'Custom', level: 'All Levels', color: 'from-blue-600/10 to-transparent', border: 'border-blue-500/20' },
  { tag: 'Hot', title: 'Zumba Dance Fitness', duration: '50 min', level: 'All Levels', color: 'from-pink-600/10 to-transparent', border: 'border-pink-500/20' },
  { tag: '', title: 'CrossFit Training', duration: '60 min', level: 'Advanced', color: 'from-green-600/10 to-transparent', border: 'border-green-500/20' },
]

export default function Programs() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="programs" className="py-24 bg-brand-darker relative">
      <div className="absolute left-0 bottom-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-[120px]" />
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-0.5 w-10 bg-brand-orange" />
            <span className="text-brand-orange text-sm font-semibold tracking-[0.2em] uppercase">Our Programs</span>
            <div className="h-0.5 w-10 bg-brand-orange" />
          </div>
          <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-none text-white">
            TRAIN LIKE A <span className="text-gradient">CHAMPION</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {programs.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={`card-hover bg-gradient-to-br ${p.color} border ${p.border} rounded-2xl p-6 bg-brand-surface relative overflow-hidden cursor-pointer`}
            >
              {p.tag && (
                <span className="absolute top-4 right-4 bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full">
                  {p.tag}
                </span>
              )}
              <div className="mb-4 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">
                🏃
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{p.title}</h3>
              <div className="flex gap-4 text-white/40 text-sm">
                <span>⏱ {p.duration}</span>
                <span>📊 {p.level}</span>
              </div>
              <button className="mt-5 text-brand-orange text-sm font-semibold hover:text-orange-400 transition-colors flex items-center gap-1">
                Learn More <span>→</span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
