import { motion } from 'framer-motion';
import { FaDumbbell, FaUsers, FaMedal } from 'react-icons/fa';
import PageTransition from '../components/PageTransition';
import About from '../components/About';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export default function AboutPage() {
  return (
    <PageTransition>
      {/* Aggressive Minimal Hero Header */}
      <section className="relative pt-44 pb-12 px-6 overflow-hidden">
        {/* HD Background Image */}
        <div className="absolute inset-0 z-0">
          <img src="/images/gym-bg-2.jpg" alt="Quads Fitness Facility" className="w-full h-full object-cover object-center" />
        </div>
        <div className="absolute inset-0 z-10 bg-brand-darker/80" />
        
        <div className="max-w-7xl mx-auto relative z-20">
          <span className="text-xs font-accent uppercase tracking-[0.3em] text-brand-gold block mb-2">// MISSION PROFILE</span>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-6xl md:text-8xl font-display text-white uppercase tracking-tight mb-4"
          >
            FORGED IN <span className="text-gradient">IRON</span>
          </motion.h1>
          <div className="hazard-line mb-8"></div>
          <p className="text-white/60 font-body text-base max-w-2xl leading-relaxed">
            We built this place for people who still show up when it hurts. No excuses, no shortcuts. Quads Fitness is where courage meets the barbell — and where ordinary people discover what they are truly made of.
          </p>
        </div>
      </section>

      {/* 3D Scene Section */}
      <section className="relative z-20">
        <About /> 
      </section>

      {/* Core Operational Values */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="combat-plate p-8 rounded-none">
            <div className="flex flex-col h-full">
              <FaDumbbell className="text-2xl text-brand-orange mb-6" />
              <h3 className="text-2xl font-display text-white uppercase tracking-wider mb-3">ELITE EQUIPMENT</h3>
              <p className="text-white/50 font-body text-xs leading-relaxed">
                Every machine, every rack, every barbell on our floor was chosen for one reason — to help you get stronger. No distractions. Just iron and intention.
              </p>
            </div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="combat-plate p-8 rounded-none md:-translate-y-4">
            <div className="flex flex-col h-full">
              <FaUsers className="text-2xl text-brand-gold mb-6" />
              <h3 className="text-2xl font-display text-white uppercase tracking-wider mb-3">DEDICATED COACHES</h3>
              <p className="text-white/50 font-body text-xs leading-relaxed">
                Our trainers are certified professionals who specialise in building programs around you — your goals, your limits, your timeline. They don't give up when you want to.
              </p>
            </div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="combat-plate p-8 rounded-none">
            <div className="flex flex-col h-full">
              <FaMedal className="text-2xl text-brand-orange mb-6" />
              <h3 className="text-2xl font-display text-white uppercase tracking-wider mb-3">REAL PROGRESS TRACKING</h3>
              <p className="text-white/50 font-body text-xs leading-relaxed">
                We remove guesswork entirely. Your progress is tracked, measured, and adjusted every step of the way — because moving forward requires knowing where you stand.
              </p>
            </div>
          </motion.div>

        </div>
      </section>
    </PageTransition>
  );
}