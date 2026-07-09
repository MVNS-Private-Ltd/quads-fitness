import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../../components/PageTransition';
import SEO from '../../components/SEO';
import { useSettings } from '../../contexts/SettingsContext';

const faqItems = [
  { question: 'How much does personal training cost in Manimajra?', answer: 'At Quads Fitness, personal training starts at ₹5,000 for one month and ₹12,000 for three months, with fully personalised programming included.' },
  { question: 'How often will I train with my personal trainer?', answer: 'Typically 3–5 sessions per week, depending on your goals and recovery. Your trainer will design the optimal schedule for you.' },
  { question: 'Do personal trainers at Quads Fitness design diet plans?', answer: 'Yes — our coaches provide nutritional guidelines alongside your training programme to maximise your results.' },
  { question: 'Can beginners sign up for personal training in Manimajra?', answer: 'Absolutely. Our personal trainers work with all levels, from complete beginners to competitive athletes.' },
];

export default function PersonalTrainingManimajra() {
  const { settings } = useSettings();
  const cleanPhone = settings?.phone?.replace(/\D/g, '');
  const whatsappHref = cleanPhone ? `https://wa.me/${cleanPhone}` : null;
  return (
    <PageTransition>
      <SEO
        title="Personal Training in Manimajra | Certified Coaches | Quads Fitness"
        description="Get 1-on-1 personal training in Manimajra with certified coaches. Custom plans, proven results. Starting ₹5,000/month. Book your consultation today."
        keywords="personal training Manimajra, personal trainer Manimajra, 1-on-1 coaching Manimajra, gym trainer Manimajra"
        url="/personal-training-manimajra"
        service={{ name: 'Personal Training', description: '1-on-1 certified personal training sessions in Manimajra', areaServed: 'Manimajra, India' }}
        faqItems={faqItems}
        breadcrumbs={[{ name: 'Personal Training Manimajra', url: '/personal-training-manimajra' }]}
      />

      {/* Hero */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,107,0,0.08),transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-accent uppercase tracking-[0.3em] text-brand-orange block mb-3">// 1-ON-1 ELITE COACHING</span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-7xl font-display text-white uppercase tracking-tight leading-tight mb-6"
            >
              PERSONAL<br />TRAINING<br /><span className="text-gradient">MANIMAJRA</span>
            </motion.h1>
            <div className="hazard-line mb-6" />
            <p className="text-white/65 font-body text-lg leading-relaxed mb-8">
              Stop guessing. Start progressing. Our certified personal trainers in Manimajra build programmes around your body, your goals, and your schedule — delivering real, measurable results in the fastest possible timeframe.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer"
                className="btn-aggressive bg-gradient-to-r from-brand-orange to-brand-gold text-brand-dark font-accent font-bold px-8 py-4 text-sm uppercase tracking-widest shadow-glow-gold hover:opacity-95">
                Book Free Consultation
              </a>
              <Link to="/programs" className="btn-aggressive border border-white/20 text-white font-accent font-bold px-8 py-4 text-sm uppercase tracking-widest hover:border-brand-orange transition-colors">
                View All Plans
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { stat: '₹5,000', label: '1-Month Personal Training', sub: 'Full personalised coaching cycle' },
              { stat: '₹12,000', label: '3-Month Personal Training', sub: 'Sustained transformation programme' },
              { stat: '5AM–9PM', label: 'Flexible Session Times', sub: 'Morning and evening slots available' },
            ].map((item) => (
              <div key={item.label} className="combat-plate p-6 rounded-none border border-white/10 flex gap-6 items-center">
                <span className="text-3xl font-display text-brand-gold font-black shrink-0">{item.stat}</span>
                <div>
                  <h3 className="text-sm font-display text-white uppercase tracking-wide">{item.label}</h3>
                  <p className="text-white/40 text-xs font-body">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6 border-t border-white/5 bg-brand-dark">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-accent uppercase tracking-widest text-brand-gold block mb-2">// WHY 1-ON-1</span>
            <h2 className="text-4xl font-display text-white uppercase tracking-wide">Benefits of Personal Training</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Custom Programming', body: 'Every workout is designed for your specific goals, movement patterns, and recovery capacity — not a generic template.' },
              { title: 'Injury Prevention', body: 'Your trainer corrects form in real time, eliminating the bad habits that lead to joint pain and long-term injury.' },
              { title: 'Faster Results', body: 'Structured periodisation and regular load progressions mean you progress systematically rather than randomly.' },
              { title: 'Nutritional Guidance', body: 'Complementary dietary frameworks tailored to support your training — whether you are losing fat, building muscle, or both.' },
              { title: 'Full Accountability', body: 'Booked sessions create commitment. Your trainer also checks in between sessions to support your adherence.' },
              { title: 'Expert Knowledge', body: 'Our Manimajra-based coaches hold recognised certifications and stay current with evidence-based training methods.' },
            ].map((b) => (
              <div key={b.title} className="combat-plate p-6 rounded-none">
                <h3 className="text-lg font-display text-white uppercase mb-3">{b.title}</h3>
                <p className="text-white/55 font-body text-sm leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-display text-white uppercase tracking-wide mb-10 text-center">Frequently Asked Questions</h2>
          <div className="space-y-5">
            {faqItems.map(({ question, answer }) => (
              <div key={question} className="bg-brand-surface2 border border-white/5 p-6">
                <h3 className="text-base font-display text-white uppercase mb-2">{question}</h3>
                <p className="text-white/60 font-body text-sm leading-relaxed">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-brand-orange/10 to-brand-gold/5 border-t border-white/5 text-center">
        <h2 className="text-3xl font-display text-white uppercase mb-4">Start Personal Training in <span className="text-gradient">Manimajra</span> Today</h2>
        <p className="text-white/50 font-body text-sm mb-8 max-w-lg mx-auto">Join the members who've transformed their bodies with Quads Fitness certified coaching. Your programme starts the day you contact us.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer"
            className="btn-aggressive bg-gradient-to-r from-brand-orange to-brand-gold text-brand-dark font-accent font-bold px-10 py-4 text-sm uppercase tracking-widest shadow-glow-gold">
            WhatsApp Us Now
          </a>
          <Link to="/trainers" className="btn-aggressive border border-white/20 text-white font-accent font-bold px-8 py-4 text-sm uppercase tracking-widest hover:border-brand-orange transition-colors">
            Meet Our Trainers
          </Link>
        </div>
      </section>
    </PageTransition>
  );
}
