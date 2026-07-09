import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useSettings } from '../contexts/SettingsContext'
import AboutCurlScene from './AboutCurlScene'

const features = [
  {
    number: '01',
    title: 'World-Class Equipment',
    desc: 'Latest machines, progressive free weights, and premium training zones designed for serious results.'
  },
  {
    number: '02',
    title: 'Expert Trainers',
    desc: 'Certified coaches who guide your form, structure your plan, and keep your progress moving.'
  },
  {
    number: '03',
    title: 'Relentless Atmosphere',
    desc: 'A disciplined, high-energy environment that pushes you to show up stronger every single day.'
  },
]

export default function About() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const { settings } = useSettings()

  const aboutTitle = settings?.aboutTitle?.trim() || ''
  const aboutSubtitle = settings?.aboutSubtitle?.trim() || ''

  return (
    <section id="about" className="relative overflow-hidden bg-brand-dark py-24 lg:py-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-[-8rem] top-[-4rem] h-80 w-80 rounded-full bg-brand-orange/8 blur-[120px]" />
        <div className="absolute left-[-6rem] bottom-[-5rem] h-72 w-72 rounded-full bg-brand-orange/6 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,107,0,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,0,0.14) 1px, transparent 1px)`,
            backgroundSize: '56px 56px'
          }}
        />
      </div>

      <div
        ref={ref}
        className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10"
      >
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="h-0.5 w-10 bg-brand-orange" />
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-orange">
              About Us
            </span>
          </div>

          {aboutTitle && (
            <h2 className="mb-6 font-display text-[clamp(2.8rem,5vw,5.2rem)] leading-none text-white whitespace-pre-line">
              {aboutTitle}
            </h2>
          )}

          {aboutSubtitle && (
            <p className="mb-8 max-w-lg text-lg leading-relaxed text-white/62">
              {aboutSubtitle}
            </p>
          )}

          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-base font-semibold text-brand-orange transition-all duration-300 hover:gap-4"
          >
            Book a Tour <span>→</span>
          </a>

          <div className="mt-10 space-y-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.65,
                  delay: 0.15 + i * 0.12,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="card-hover group flex items-start gap-5 rounded-[1.5rem] border border-white/6 bg-gradient-to-br from-white/[0.045] to-white/[0.015] p-6 backdrop-blur-sm"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-orange/30 bg-brand-orange/10 text-sm font-bold text-brand-orange">
                  {f.number}
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-semibold text-white">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-white/52">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <AboutCurlScene sectionRef={ref} />
        </motion.div>
      </div>
    </section>
  )
}
