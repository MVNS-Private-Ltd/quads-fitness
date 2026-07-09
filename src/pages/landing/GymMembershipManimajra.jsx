import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../../components/PageTransition';
import SEO from '../../components/SEO';
import { useSettings } from '../../contexts/SettingsContext';

const plans = [
  { name: '3 Months Plan', price: '₹2,800', per: '≈ ₹933/month', features: ['Full gym access', 'All equipment', 'Morning & evening slots', 'No joining fee'], highlight: false },
  { name: '13 Months Plan', price: '₹8,000', per: '≈ ₹615/month', features: ['Full gym access', 'All equipment', 'Priority slot booking', 'Best value long-term', 'No joining fee'], highlight: true },
  { name: 'PT — 1 Month', price: '₹5,000', per: 'Full coaching cycle', features: ['1-on-1 personal trainer', 'Custom programme', 'Nutritional guidance', 'Progress tracking'], highlight: false },
  { name: 'PT — 3 Months', price: '₹12,000', per: 'Full transformation', features: ['1-on-1 personal trainer', 'Progressive periodisation', 'Diet & recovery support', 'Monthly assessments'], highlight: false },
];

const faqItems = [
  { question: 'How much is gym membership in Manimajra?', answer: 'At Quads Fitness, gym membership starts at ₹2,800 for 3 months. Our 13-month plan at ₹8,000 works out to just ₹615/month — the best value premium membership in Manimajra.' },
  { question: 'Are there any joining fees or hidden charges?', answer: 'No joining fees, no registration charges, no hidden costs. The price you see is the price you pay.' },
  { question: 'Can I upgrade my membership plan later?', answer: 'Yes — contact our front desk at any time to discuss upgrading your plan or adding personal training to your existing membership.' },
  { question: 'Does the membership include access to all equipment?', answer: 'All memberships include full access to our complete equipment floor — free weights, machines, cables, and cardio zones — during all open hours.' },
];

export default function GymMembershipManimajra() {
  const { settings } = useSettings();
  const cleanPhone = settings?.phone?.replace(/\D/g, '');
  const whatsappHref = cleanPhone ? `https://wa.me/${cleanPhone}` : null;
  return (
    <PageTransition>
      <SEO
        title="Gym Membership Plans in Manimajra | From ₹2,800 | Quads Fitness"
        description="Affordable gym membership plans in Manimajra from ₹2,800. No hidden fees, premium facilities, certified trainers. Compare plans & join Quads Fitness today."
        keywords="gym membership Manimajra, gym fees Manimajra, cheap gym membership Manimajra, best gym membership Manimajra"
        url="/gym-membership-manimajra"
        service={{ name: 'Gym Membership', description: 'Premium gym membership plans in Manimajra with full equipment access and flexible timings', areaServed: 'Manimajra, India' }}
        faqItems={faqItems}
        breadcrumbs={[{ name: 'Gym Membership Manimajra', url: '/gym-membership-manimajra' }]}
      />

      {/* Hero */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(212,175,55,0.06),transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-xs font-accent uppercase tracking-[0.3em] text-brand-gold block mb-3">// ACCESS TIERS</span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-display text-white uppercase tracking-tight leading-tight mb-6"
          >
            GYM MEMBERSHIP<br /><span className="text-gradient">MANIMAJRA</span>
          </motion.h1>
          <div className="hazard-line max-w-xs mx-auto mb-6" />
          <p className="text-white/65 font-body text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            No hidden fees. No lock-in surprises. Quads Fitness offers Manimajra's most straightforward membership pricing with premium facilities that back it up.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs font-accent uppercase tracking-widest">
            {['Starting ₹2,800', 'No Joining Fee', 'Open 7 Days', '5AM – 9PM'].map(tag => (
              <span key={tag} className="bg-brand-surface2 border border-white/10 px-4 py-2 text-white/60">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="py-20 px-6 border-t border-white/5 bg-brand-dark">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display text-white uppercase tracking-wide">Choose Your Plan</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div key={plan.name} className={`relative flex flex-col p-8 border rounded-none ${plan.highlight ? 'border-brand-orange bg-brand-surface shadow-[0_0_30px_rgba(255,107,0,0.12)] md:-translate-y-3' : 'border-white/5 bg-brand-surface/40'}`}>
                {plan.highlight && <span className="absolute top-0 left-0 right-0 bg-brand-orange text-white text-[9px] uppercase font-accent font-bold py-1 text-center tracking-widest">Best Value</span>}
                <div className={plan.highlight ? 'mt-4' : ''}>
                  <h3 className="text-sm font-accent uppercase tracking-widest text-white/70 mb-4">{plan.name}</h3>
                  <p className="text-4xl font-display text-white font-black mb-1">{plan.price}</p>
                  <p className="text-xs font-body text-white/40 mb-6">{plan.per}</p>
                  <ul className="space-y-2.5 mb-8 border-t border-white/5 pt-6">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-xs text-white/65 font-body">
                        <span className="text-brand-orange">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer"
                  className={`mt-auto block text-center py-3 text-xs font-accent font-bold uppercase tracking-widest transition-all ${plan.highlight ? 'bg-brand-orange text-white hover:bg-orange-600' : 'bg-brand-surface2 text-white border border-white/10 hover:border-brand-orange'}`}>
                  Enquire Now
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Points */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-display text-white uppercase tracking-wide mb-12 text-center">Why Quads Fitness Membership is Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Zero Hidden Fees', body: 'The price you see is what you pay. No registration fees, no towel fees, no locker fees.' },
              { title: 'Premium Equipment Included', body: 'Full access to every piece of equipment on our floor — free weights, machines, cables, cardio.' },
              { title: 'Flexible Timings', body: 'Two session windows daily: 5AM–10AM and 11AM–9PM. Train when it works for your schedule.' },
              { title: 'Real Coaching', body: 'Our trained staff are on the floor during all hours to answer questions and correct form — included at no extra cost.' },
            ].map(item => (
              <div key={item.title} className="flex gap-4 p-6 bg-brand-surface2 border border-white/5">
                <span className="text-brand-gold text-xl font-bold shrink-0">→</span>
                <div>
                  <h3 className="text-base font-display text-white uppercase mb-2">{item.title}</h3>
                  <p className="text-white/55 font-body text-sm leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 border-t border-white/5 bg-brand-dark">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-display text-white uppercase tracking-wide mb-10 text-center">Membership FAQs</h2>
          <div className="space-y-5">
            {faqItems.map(({ question, answer }) => (
              <div key={question} className="bg-brand-surface border border-white/5 p-6">
                <h3 className="text-base font-display text-white uppercase mb-2">{question}</h3>
                <p className="text-white/60 font-body text-sm leading-relaxed">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-white/5 text-center">
        <h2 className="text-3xl font-display text-white uppercase mb-4">Ready to Join <span className="text-gradient">Quads Fitness?</span></h2>
        <p className="text-white/50 font-body text-sm mb-8 max-w-lg mx-auto">Manimajra's most results-focused gym. Pick your plan and start training tomorrow.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/contact" className="btn-aggressive bg-gradient-to-r from-brand-orange to-brand-gold text-brand-dark font-accent font-bold px-10 py-4 text-sm uppercase tracking-widest shadow-glow-gold">
            Contact Us
          </Link>
          <Link to="/trainers" className="btn-aggressive border border-white/20 text-white font-accent font-bold px-8 py-4 text-sm uppercase tracking-widest hover:border-brand-orange transition-colors">
            Meet Our Trainers
          </Link>
        </div>
      </section>
    </PageTransition>
  );
}
