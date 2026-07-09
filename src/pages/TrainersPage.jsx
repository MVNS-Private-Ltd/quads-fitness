import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';
import { useEffect, useState } from 'react';
import { getTrainers } from '../services/api';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function TrainersPage() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const t = await getTrainers();
        if (mounted) setTrainers(t);
      } catch (e) {
        console.error('TrainersPage fetch failed', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <PageTransition>
      <SEO 
        title="Expert Personal Trainers | Quads Fitness" 
        description="Meet our elite kinetic coaches and personal trainers in Manimajra dedicated to maximizing your athletic output." 
        url="/trainers" 
      />
      <section className="relative pt-44 pb-16 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 font-display text-[24rem] text-white/[0.02] select-none pointer-events-none font-black transform translate-x-20 -translate-y-20">T</div>
        <div className="max-w-7xl mx-auto z-10 text-left">
          <span className="text-xs font-accent uppercase tracking-[0.3em] text-brand-orange block mb-3">// ELITE KINETIC COACHES</span>
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-6xl md:text-8xl font-display text-white uppercase tracking-tight leading-none mb-4"
          >
            OUR <span className="text-gradient">COMMANDERS</span>
          </motion.h1>
          <div className="hazard-line mb-6"></div>
        </div>
      </section>

      <section className="pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-brand-muted text-sm">Loading commanders...</div>
          ) : trainers.length === 0 ? (
            <div className="col-span-full text-brand-muted text-sm">No active trainers found.</div>
          ) : (
            trainers.map((trainer, idx) => {
              const imgUrl = trainer.imageUrl || trainer.image_url || trainer.image;
              return (
                <motion.div 
                  key={trainer.id ?? idx} 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  variants={fadeInUp} 
                  className="combat-plate group p-0 overflow-hidden flex flex-col h-full rounded-none"
                >
                  <div className="relative h-80 overflow-hidden bg-brand-darker">
                    {imgUrl ? (
                      <img src={imgUrl} alt={`${trainer.name} - Personal Trainer at Quads Fitness, Manimajra`} loading="lazy" className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 mix-blend-luminosity hover:mix-blend-normal" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brand-muted font-display text-4xl opacity-20 uppercase tracking-widest">{trainer.name?.charAt(0) || 'T'}</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 left-6 flex gap-2">
                      <span className="bg-brand-orange text-white text-[9px] uppercase font-accent font-bold px-2 py-0.5">{trainer.specialty || 'General Training'}</span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow justify-between bg-brand-surface/40">
                    <div>
                      <h3 className="text-2xl font-display text-white uppercase tracking-wide mb-2">
                        {trainer.name}
                      </h3>
                      <p className="text-white/50 font-body text-xs leading-relaxed mb-6">
                        {trainer.bio || 'Elite performance specialist dedicated to maximizing output and optimizing biomechanics.'}
                      </p>
                    </div>
                    <Link 
                      to="/contact" 
                      className="inline-flex items-center gap-2 text-xs font-accent uppercase tracking-widest text-brand-orange hover:text-brand-gold transition-colors duration-300"
                    >
                      Request Consultation <FaChevronRight className="text-[10px]" />
                    </Link>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </section>
    </PageTransition>
  );
}
