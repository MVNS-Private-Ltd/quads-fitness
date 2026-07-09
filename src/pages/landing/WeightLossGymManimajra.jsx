import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../../components/PageTransition';
import SEO from '../../components/SEO';
import { useSettings } from '../../contexts/SettingsContext';

const faqItems = [
  { question: 'Can I lose weight by joining a gym in Manimajra?', answer: 'Yes — a structured combination of resistance training, cardio, and proper nutrition at Quads Fitness in Manimajra is one of the most effective approaches to sustainable fat loss.' },
  { question: 'How long does it take to see weight loss results at the gym?', answer: 'Most members notice visible changes in 6–8 weeks with consistent training 4 days per week and a caloric deficit. Your personal trainer will set realistic milestones.' },
  { question: 'Is cardio or weightlifting better for weight loss?', answer: 'Both have a role. Resistance training builds muscle that increases your resting metabolism, while cardio burns additional calories. A combined approach at Quads Fitness delivers the best fat loss results.' },
  { question: 'Do you offer diet plans alongside gym membership for weight loss?', answer: 'Our personal trainers provide nutritional frameworks and guidance as part of personal training packages. For medical-grade diet planning, we recommend consulting a registered dietitian.' },
  { question: 'What is the best gym programme for weight loss in Manimajra?', answer: 'A full-body resistance training programme 3–4 days per week, combined with 2–3 cardio sessions and a controlled nutritional plan, is optimal for weight loss. Our trainers at Quads Fitness design exactly this type of programme.' },
];

export default function WeightLossGymManimajra() {
  const { settings } = useSettings();
  const cleanPhone = settings?.phone?.replace(/\D/g, '');
  const whatsappHref = cleanPhone ? `https://wa.me/${cleanPhone}` : null;
  return (
    <PageTransition>
      <SEO
        title="Weight Loss Gym in Manimajra | Burn Fat, Build Strength | Quads Fitness"
        description="Achieve real weight loss at Quads Fitness — Manimajra's top gym. Expert trainers, structured fat-loss programmes, and affordable plans. Join today."
        keywords="weight loss gym Manimajra, fat loss gym Manimajra, gym for weight loss Manimajra, lose weight Manimajra"
        url="/weight-loss-gym-manimajra"
        service={{ name: 'Weight Loss Training', description: 'Structured weight loss and fat loss gym programmes in Manimajra with certified personal trainers', areaServed: 'Manimajra, India' }}
        faqItems={faqItems}
        breadcrumbs={[{ name: 'Weight Loss Gym Manimajra', url: '/weight-loss-gym-manimajra' }]}
      />

      {/* Hero */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,107,0,0.06),transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-xs font-accent uppercase tracking-[0.3em] text-brand-orange block mb-3">// FAT LOSS PROTOCOLS</span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-display text-white uppercase tracking-tight leading-tight mb-6"
          >
            WEIGHT LOSS<br />GYM IN<br /><span className="text-gradient">MANIMAJRA</span>
          </motion.h1>
          <div className="hazard-line max-w-xs mx-auto mb-6" />
          <p className="text-white/65 font-body text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            Real fat loss requires more than running on a treadmill. Quads Fitness in Manimajra delivers structured, science-backed weight loss programmes that preserve muscle while stripping fat — permanently.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer"
              className="btn-aggressive bg-gradient-to-r from-brand-orange to-brand-gold text-brand-dark font-accent font-bold px-8 py-4 text-sm uppercase tracking-widest shadow-glow-gold">
              Start Your Transformation
            </a>
            <Link to="/programs" className="btn-aggressive border border-white/20 text-white font-accent font-bold px-8 py-4 text-sm uppercase tracking-widest hover:border-brand-orange transition-colors">
              View Plans & Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Why We're Effective */}
      <section className="py-20 px-6 border-t border-white/5 bg-brand-dark">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display text-white uppercase tracking-wide">Our Weight Loss Approach</h2>
            <p className="text-white/50 font-body text-sm mt-3 max-w-xl mx-auto">We don't do fad programmes. We deliver evidence-based fat loss that lasts.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Baseline Assessment', body: 'Your trainer records your current body composition, movement patterns, and fitness markers to establish a clear starting point.' },
              { step: '02', title: 'Custom Fat-Loss Programme', body: 'A periodised resistance + cardio programme calibrated to your caloric needs and schedule — never a generic template.' },
              { step: '03', title: 'Nutritional Framework', body: 'Practical dietary guidance focused on protein targets, caloric deficit management, and sustainable eating habits.' },
              { step: '04', title: 'Progressive Overload', body: 'Your programme evolves every 4 weeks to prevent adaptation plateaus and keep your metabolism responding.' },
              { step: '05', title: 'Cardio Integration', body: 'Strategic cardio programming — LISS, HIIT, or hybrid — selected based on your recovery capacity and timeline.' },
              { step: '06', title: 'Monthly Progress Reviews', body: 'Regular check-ins track body composition changes and adjust the programme to keep you on target.' },
            ].map(item => (
              <div key={item.step} className="combat-plate p-8 rounded-none">
                <span className="text-4xl font-display text-brand-orange/30 font-black block mb-3">{item.step}</span>
                <h3 className="text-lg font-display text-white uppercase mb-3">{item.title}</h3>
                <p className="text-white/55 font-body text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans for weight loss */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-display text-white uppercase tracking-wide mb-4">Programmes for Weight Loss</h2>
          <p className="text-white/50 font-body text-sm mb-12 max-w-xl mx-auto">For best results, we recommend personal training. But all memberships give you access to our structured group programming and floor coaching.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {[
              { name: 'Personal Training — 1 Month', price: '₹5,000', ideal: 'Ideal for: kickstarting fat loss with expert guidance', features: ['Custom fat-loss programme', '1-on-1 sessions', 'Cardio & strength balanced', 'Nutritional guidance', 'Weekly progress check'] },
              { name: 'Personal Training — 3 Months', price: '₹12,000', ideal: 'Ideal for: complete body recomposition over 12 weeks', features: ['3-phase progressive programme', 'Monthly body composition review', 'Full diet framework', 'HIIT & LISS cardio planning', 'Lifestyle habit coaching'] },
            ].map(plan => (
              <div key={plan.name} className="combat-plate p-8 border border-white/10 rounded-none">
                <h3 className="text-xl font-display text-white uppercase tracking-wide mb-1">{plan.name}</h3>
                <p className="text-3xl font-display text-brand-gold font-black mb-2">{plan.price}</p>
                <p className="text-xs font-accent text-brand-orange uppercase tracking-widest mb-6">{plan.ideal}</p>
                <ul className="space-y-2">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white/65 font-body">
                      <span className="text-brand-orange text-xs">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer"
                  className="mt-6 block text-center bg-brand-orange text-white py-3 text-xs font-accent font-bold uppercase tracking-widest hover:bg-orange-600 transition-colors">
                  Enquire on WhatsApp
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 border-t border-white/5 bg-brand-dark">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-display text-white uppercase tracking-wide mb-10 text-center">Weight Loss FAQs</h2>
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
        <h2 className="text-3xl font-display text-white uppercase mb-4">Begin Your Fat-Loss Journey in <span className="text-gradient">Manimajra</span></h2>
        <p className="text-white/50 font-body text-sm mb-8 max-w-lg mx-auto">Real weight loss takes a real plan. Let our coaches at Quads Fitness build yours.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/contact" className="btn-aggressive bg-gradient-to-r from-brand-orange to-brand-gold text-brand-dark font-accent font-bold px-10 py-4 text-sm uppercase tracking-widest shadow-glow-gold">
            Book a Consultation
          </Link>
          <Link to="/personal-training-manimajra" className="btn-aggressive border border-white/20 text-white font-accent font-bold px-8 py-4 text-sm uppercase tracking-widest hover:border-brand-orange transition-colors">
            Personal Training Options
          </Link>
        </div>
      </section>
    </PageTransition>
  );
}
