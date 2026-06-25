import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useSettings } from '../contexts/SettingsContext'

const containerVar = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } }
}

const itemVar = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
}

export default function Hero() {
  const { settings } = useSettings();

  const heroTitle = settings?.heroTitle?.trim() || settings?.gymName?.trim() || 'QUADS FITNESS'
  const heroSubtitle = settings?.heroSubtitle?.trim() || 'Premium gym training in Manimajra.'
  const cleanPhone = settings?.phone?.replace(/\D/g, '')
  const phoneHref = cleanPhone ? `tel:+${cleanPhone}` : undefined
  const whatsappHref = cleanPhone ? `https://wa.me/${cleanPhone}` : undefined

  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-brand-darker">
      {/* HD Background Image */}
      <div className="absolute inset-0 z-0">
        <img src="/images/gym-bg-1.jpg" alt="Quads Fitness Gym Floor" className="w-full h-full object-cover object-center" />
      </div>



      {/* readability overlay */}
      <div className="absolute inset-0 z-10 bg-black/70" />

      {/* grid texture */}
      <div
        className="absolute inset-0 z-10 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255,107,0,0.25) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,107,0,0.25) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* glow + gradient */}
      <div className="absolute inset-0 z-10 pointer-events-none" style={{
        background: `
          radial-gradient(circle at 80% 20%, rgba(255, 107, 0, 0.08) 0%, transparent 40%),
          radial-gradient(circle at 10% 90%, rgba(194, 65, 12, 0.08) 0%, transparent 35%),
          linear-gradient(to right, rgba(0,0,0,0.4), rgba(0,0,0,0.15), rgba(0,0,0,0.3))
        `
      }}>
      </div>

      {/* content */}
      <div className="relative z-20 min-h-screen max-w-7xl mx-auto px-6 pt-36 pb-12 flex items-center">
        <motion.div
          variants={containerVar}
          initial="hidden"
          animate="show"
          className="w-full max-w-3xl flex flex-col gap-10"
        >
          <motion.h1
            variants={itemVar}
            className="font-display text-[clamp(3.5rem,8.5vw,7.5rem)] leading-[0.95] tracking-tight uppercase text-white"
          >
            {heroTitle}
          </motion.h1>

          {heroSubtitle && (
            <motion.p
              variants={itemVar}
              className="text-white/65 text-base md:text-lg leading-relaxed max-w-xl font-body"
            >
              {heroSubtitle}
            </motion.p>
          )}

          <motion.div variants={itemVar} className="flex flex-wrap gap-6 mt-2">
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-aggressive bg-gradient-to-r from-brand-orange to-brand-gold text-brand-dark font-accent font-bold px-8 py-4 text-sm uppercase tracking-widest shadow-glow-gold hover:opacity-95"
              >
                <span>Join Now</span>
              </a>
            )}

            <Link
              to="/programs"
              className="btn-aggressive border border-white/20 text-white font-accent font-bold px-8 py-4 text-sm uppercase tracking-widest hover:border-brand-orange hover:text-brand-orange transition-colors backdrop-blur-sm"
            >
              <span>View Training Plans</span>
            </Link>
          </motion.div>

          {phoneHref && (
            <motion.div variants={itemVar} className="mt-1">
              <p className="text-white/50 text-xs font-accent tracking-widest uppercase flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Call Us: <a href={phoneHref} className="text-brand-orange hover:text-brand-gold transition-colors font-bold">{settings.phone}</a>
              </p>
            </motion.div>
          )}

          <motion.div
            variants={itemVar}
            className="flex flex-wrap gap-8 pt-6 border-t border-white/10 mt-4 max-w-xl"
          >
            {[
              { val: '480+', label: 'Lives Transformed' },
              { val: '15+', label: 'Expert Coaches' },
              { val: '100%', label: 'Commitment Required' }
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl md:text-3xl text-brand-orange tracking-tight">
                  {s.val}
                </p>
                <p className="text-white/40 text-[10px] font-accent uppercase tracking-widest mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="w-0.5 h-8 bg-gradient-to-b from-brand-orange to-transparent"
        />
      </motion.div>
    </section>
  )
}
