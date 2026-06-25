import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { FaFire, FaClock, FaBolt, FaChevronRight, FaShieldAlt } from 'react-icons/fa';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';
import { useSettings } from '../contexts/SettingsContext';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
import { fetchActiveMembershipPlans, fetchActivePrograms } from '../lib/supabaseApi';

export default function ProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();
  const cleanPhone = settings?.phone?.replace(/\D/g, '');
  const whatsappHref = cleanPhone ? `https://wa.me/${cleanPhone}` : null;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [p, t] = await Promise.all([fetchActivePrograms(), fetchActiveMembershipPlans()]);
        if (!mounted) return;
        setPrograms(p);
        setTiers(t);
      } catch (e) {
        console.error('ProgramsPage fetch failed', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const tierCards = useMemo(() => {
    return (tiers || []).map((t) => {
      const features = Array.isArray(t.features) ? t.features : t.features ? JSON.parse(t.features) : [];
      return {
        id: t.id,
        name: t.name,
        price: typeof t.price === 'number' ? String(t.price) : (t.price ?? '').toString(),
        billing: t.billing || 'mo',
        features,
        highlight: !!t.featured,
      };
    });
  }, [tiers]);
  return (
    <PageTransition>
      <SEO 
        title="Gym Programs & Membership Plans | Quads Fitness" 
        description="Explore our training programs and membership plans in Manimajra. Hypertrophy, strength, and personal training — built for people who are serious about results." 
        url="/programs" 
      />
      {/* Cinematic Industrial Header */}
      <section className="relative pt-44 pb-16 px-6 overflow-hidden">
        {/* HD Background Image */}
        <div className="absolute inset-0 z-0">
          <img src="/images/gym-bg-3.jpg" alt="Quads Fitness Weight Floor" className="w-full h-full object-cover object-center" />
        </div>
        <div className="absolute inset-0 z-10 bg-brand-darker/80" />

        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 font-display text-[24rem] text-white/[0.02] select-none pointer-events-none font-black transform translate-x-20 -translate-y-20 z-20">X</div>
        <div className="max-w-7xl mx-auto z-20 relative text-left">
          <span className="text-xs font-accent uppercase tracking-[0.3em] text-brand-orange block mb-3">// PERFORMANCE BLUEPRINTS</span>
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-6xl md:text-8xl font-display text-white uppercase tracking-tight leading-none mb-4"
          >
            TRAINING <span className="text-gradient">SYSTEMS</span>
          </motion.h1>
          <div className="hazard-line mb-6"></div>
          <p className="text-white/55 font-body text-base max-w-2xl leading-relaxed">
            Manimajra's most results-focused training programmes — from 3-month strength cycles to 13-month full transformations, and 1-on-1 <strong className="text-white/80">personal training in Manimajra</strong>. Choose your path. Commit to it.
          </p>
        </div>
      </section>

      <section className="pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
{loading ? (
            <div className="col-span-full text-brand-muted text-sm">Loading programs...</div>
          ) : programs.length === 0 ? (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-center border border-dashed border-white/10 bg-brand-surface/20">
              <div className="text-4xl text-brand-orange/50 mb-4">
                <FaBolt />
              </div>
              <h3 className="text-2xl font-display text-white uppercase tracking-wide mb-2">Programs Coming Soon</h3>
              <p className="text-brand-muted font-body max-w-md text-sm">
                Our training programs are being prepared and will be available soon. Check back shortly or contact us to get started today.
              </p>
            </div>
          ) : (
            programs.map((prog, idx) => (
              <motion.div 
                key={prog.id ?? idx} 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                variants={fadeInUp} 
                className="combat-plate p-8 rounded-none"
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="flex justify-end items-start mb-6">
                      <div className="flex gap-4 text-[10px] uppercase font-accent tracking-widest text-white/40">
                        <span className="border border-white/5 px-2 py-0.5 bg-brand-dark">{prog.duration}</span>
                        <span className="border border-brand-orange/20 px-2 py-0.5 bg-brand-orange/5 text-brand-orange">{prog.status}</span>
                      </div>
                    </div>
                    <h3 className="text-3xl font-display text-white uppercase tracking-wide mb-3">
                      {prog.title}
                    </h3>
                    <p className="text-white/50 font-body text-sm leading-relaxed mb-8">
                      {prog.description ?? prog.instructor ?? ''}
                    </p>
                  </div>
                  
                  <Link 
                    to="/contact" 
                    className="inline-flex items-center gap-2 text-xs font-accent uppercase tracking-widest text-brand-orange hover:text-brand-gold transition-colors duration-300"
                  >
                    Begin Your Journey <FaChevronRight className="text-[10px]" />
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Heavy Duty Pricing Grid */}
      <section className="py-24 px-6 border-t border-white/5 bg-brand-dark">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <span className="text-xs font-accent tracking-widest text-brand-gold uppercase block mb-2">// ACCESS ALLOCATION</span>
            <h2 className="text-4xl md:text-5xl font-display text-white uppercase tracking-wide">MEMBERSHIP TIERS</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {loading ? (
              <div className="col-span-full text-brand-muted text-sm">Loading tiers...</div>
            ) : tierCards.length === 0 ? (
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-center border border-dashed border-white/10 bg-brand-surface/20">
                <div className="text-4xl text-brand-gold/50 mb-4">
                  <FaShieldAlt />
                </div>
                <h3 className="text-2xl font-display text-white uppercase tracking-wide mb-2">Plans Unavailable</h3>
                <p className="text-brand-muted font-body max-w-md text-sm">
                  Membership plans are being finalised. Contact us directly or visit the front desk to enroll today.
                </p>
              </div>
            ) : (
              tierCards.map((tier, idx) => (
                <motion.div 
                  key={tier.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  variants={fadeInUp}
                  className={`relative p-8 rounded-none border transition-all duration-300 flex flex-col justify-between ${
                    tier.highlight 
                      ? 'border-brand-orange bg-brand-surface border-t-4 shadow-[0_0_30px_rgba(255,107,0,0.15)] md:-translate-y-4' 
                      : 'border-white/5 bg-brand-surface/40 hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-xs uppercase font-accent tracking-widest text-white/60">{tier.name}</h4>
                      {tier.highlight && <span className="bg-brand-orange text-white text-[9px] uppercase font-accent font-bold px-2 py-0.5">CRITICAL ACCESS</span>}
                    </div>
                    
                    <div className="flex items-baseline mb-8">
                      <span className="text-5xl font-display font-black text-white">₹{tier.price}</span>
                      <span className="text-white/40 text-xs uppercase font-accent ml-2">/ {tier.billing}</span>
                    </div>

                    <ul className="space-y-3.5 mb-10 border-t border-white/5 pt-6">
                      {(tier.features || []).map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2 text-xs text-white/70 font-body">
                          <span className="text-brand-orange mt-0.5">_</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to="/contact"
                    className={`btn-aggressive w-full py-3 text-center text-xs font-accent font-bold uppercase tracking-widest transition-all rounded-none ${
                      tier.highlight 
                        ? 'bg-brand-orange text-white hover:bg-orange-600' 
                        : 'bg-brand-surface2 text-white border border-white/10 hover:bg-brand-surface'
                    }`}
                  >
                    <span>Start Today</span>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Personal Training Landing Section */}
      <section id="personal-training" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-accent uppercase tracking-[0.3em] text-brand-orange block mb-3">// 1-ON-1 ELITE COACHING</span>
            <h2 className="text-4xl md:text-5xl font-display text-white uppercase tracking-tight leading-tight mb-6">
              PERSONAL TRAINING<br /><span className="text-gradient">IN MANIMAJRA</span>
            </h2>
            <div className="hazard-line mb-6"></div>
            <p className="text-white/65 font-body text-base leading-relaxed mb-4">
              Our certified personal trainers in Manimajra build programs completely around you — your schedule, your goals, your current level. Every session is purposeful. Nothing is wasted.
            </p>
            <p className="text-white/65 font-body text-base leading-relaxed mb-8">
              Whether you are starting from zero or pushing past a plateau, our 1-month and 3-month personal training programmes are structured to deliver real, measurable results. You will know exactly how far you have come.
            </p>
            <ul className="space-y-3 mb-10">
              {[
                'Personalised workout & nutrition planning',
                'Daily form correction & performance tracking',
                'Flexible morning & evening session slots',
                'Available for men, women & senior citizens',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-white/70 font-body">
                  <span className="text-brand-orange font-bold">—</span> {item}
                </li>
              ))}
            </ul>
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-aggressive inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-gold text-brand-dark font-accent font-bold px-8 py-4 text-sm uppercase tracking-widest shadow-glow-gold hover:opacity-95"
              >
                Book a Free Consultation
              </a>
            )}
          </div>
          <div className="space-y-4">
            {[
              { plan: 'Personal Trainer — 1 Month', price: '₹5,000', desc: 'Ideal for rapid kickstart and goal-setting. Full 1-month coaching cycle.' },
              { plan: 'Personal Trainer — 3 Months', price: '₹12,000', desc: 'Deep-dive programme for sustained strength gain and body recomposition over 3 months.' },
            ].map((item) => (
              <div key={item.plan} className="combat-plate p-8 rounded-none border border-white/10">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-display text-white uppercase tracking-wide">{item.plan}</h3>
                  <span className="text-2xl font-display text-brand-gold font-black">{item.price}</span>
                </div>
                <p className="text-white/55 font-body text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
            <div className="bg-brand-orange/5 border border-brand-orange/20 p-6 rounded-none">
              <p className="text-white/60 font-body text-xs leading-relaxed">
                <strong className="text-brand-gold uppercase tracking-widest text-[10px] block mb-2">// GYM TIMINGS</strong>
                Morning: 5:00 AM – 10:00 AM &nbsp;|&nbsp; Evening: 11:00 AM – 9:00 PM<br />
                Personal Training sessions can be scheduled during any open slot.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
