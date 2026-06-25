import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useSettings } from '../contexts/SettingsContext'

export default function CTA() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { settings } = useSettings()
  const cleanPhone = settings?.phone?.replace(/\D/g, '')
  const whatsappHref = cleanPhone ? `https://wa.me/${cleanPhone}` : null
  const phoneHref = cleanPhone ? `tel:+${cleanPhone}` : null

  return (
    <section id="contact" className="py-24 bg-brand-dark relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-brand-orange/8 blur-[120px]" />
      </div>

      <div ref={ref} className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-0.5 w-10 bg-brand-orange" />
            <span className="text-brand-orange text-sm font-semibold tracking-[0.2em] uppercase">Get Started</span>
            <div className="h-0.5 w-10 bg-brand-orange" />
          </div>
          <h2 className="font-display text-[clamp(3rem,7vw,6rem)] leading-none text-white mb-6">
            YOUR FIRST CLASS<br />
            IS <span className="text-gradient">FREE</span>
          </h2>
          <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
            No commitment. No credit card. Just show up and experience the Quads difference for yourself.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-orange hover:bg-orange-500 text-white font-bold px-10 py-4 rounded-full text-lg transition-all duration-200 hover:shadow-2xl hover:shadow-orange-500/40 hover:-translate-y-1"
              >
                WhatsApp Us 💬
              </a>
            )}
            {phoneHref && (
              <a
                href={phoneHref}
                className="border border-white/20 hover:border-brand-orange text-white font-semibold px-10 py-4 rounded-full text-lg transition-all duration-200 hover:text-brand-orange"
              >
                Call Now 📞
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
