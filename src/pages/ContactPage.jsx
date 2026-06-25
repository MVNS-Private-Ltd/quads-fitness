import { useState } from 'react';
import { motion } from 'framer-motion';
import { createLead } from '../services/api';
import { FaPhone, FaMapMarkerAlt, FaClock, FaPaperPlane, FaWhatsapp } from 'react-icons/fa';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';
import { useSettings } from '../contexts/SettingsContext';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'hypertrophy', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { settings } = useSettings();
  const cleanPhone = settings?.phone?.replace(/\D/g, '');
  const whatsappHref = cleanPhone ? `https://wa.me/${cleanPhone}` : null;
  const phoneHref = cleanPhone ? `tel:+${cleanPhone}` : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await createLead({ ...form, subject: `Program: ${form.subject}` });
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', subject: 'hypertrophy', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Failed to transmit data: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <PageTransition>
      <SEO 
        title="Contact Us | Quads Fitness" 
        description="Get in touch with Quads Fitness in Manimajra. Secure a facility access allocation or request a consultation." 
        url="/contact" 
      />
      {/* 1. Cinematic Industrial Header */}
      <section className="relative pt-44 pb-12 px-6 overflow-hidden">
        {/* HD Background Image */}
        <div className="absolute inset-0 z-0">
          <img src="/images/gym-bg-4.jpg" alt="Quads Fitness Reception" className="w-full h-full object-cover object-center" />
        </div>
        <div className="absolute inset-0 z-10 bg-brand-darker/80" />

        <div className="max-w-7xl mx-auto z-20 relative text-left">
          <span className="text-xs font-accent uppercase tracking-[0.3em] text-brand-orange block mb-2">// TAKE THE FIRST STEP</span>
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-6xl md:text-8xl font-display text-white uppercase tracking-tight leading-none mb-4"
          >
            INITIALIZE <span className="text-gradient">COMMS</span>
          </motion.h1>
          <div className="hazard-line mb-6"></div>
          <p className="text-white/50 font-body text-sm max-w-xl leading-relaxed">
            We respond to every inquiry within 24 hours. Fill in your details below and one of our coaches will reach out to get you started. The hardest part is deciding to begin.
          </p>
        </div>
      </section>

      {/* 2. Main Terminal Layout */}
      <section className="pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Tactical Directory */}
          <div className="lg:col-span-5 space-y-6">

            <div className="combat-plate p-6 rounded-none">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-surface2 border border-white/5 text-brand-orange text-lg">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <div className="text-[10px] font-accent text-white/30 tracking-widest uppercase">// PHYSICAL GRID</div>
                  <h4 className="text-lg font-display text-white uppercase mt-1 mb-2">HEADQUARTERS</h4>
                  {settings?.address && <p className="text-xs font-body text-white/60 leading-relaxed">{settings.address}</p>}
                </div>
              </div>
            </div>

            <div className="combat-plate p-6 rounded-none">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-surface2 border border-white/5 text-brand-gold text-lg">
                  <FaPhone />
                </div>
                <div>
                  <div className="text-[10px] font-accent text-white/30 tracking-widest uppercase">// DIRECT SECURE LINK</div>
                  <h4 className="text-lg font-display text-white uppercase mt-1 mb-2">COMMUNICATION</h4>
                  <div className="text-xs font-body text-white/60 space-y-2 mt-2">
                    {phoneHref && <a href={phoneHref} className="block hover:text-brand-orange transition-colors">{settings.phone}</a>}
                    {settings?.email && <a href={`mailto:${settings.email}`} className="block hover:text-brand-orange transition-colors">{settings.email}</a>}
                    {whatsappHref && (
                      <a 
                        href={whatsappHref} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-2 mt-3 text-brand-gold hover:text-brand-orange transition-colors font-bold uppercase tracking-widest text-[10px]"
                      >
                        <FaWhatsapp className="text-sm" />
                        WhatsApp Secure Link
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="combat-plate p-6 rounded-none">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-surface2 border border-white/5 text-brand-orange text-lg">
                  <FaClock />
                </div>
                <div>
                  <div className="text-[10px] font-accent text-white/30 tracking-widest uppercase">// OPERATIONAL WINDOW</div>
                  <h4 className="text-lg font-display text-white uppercase mt-1 mb-3">GYM TIMINGS</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-xs font-accent text-white/50 uppercase tracking-widest">Morning</span>
                      <span className="text-xs font-body text-brand-gold font-bold">
                        {settings?.mondayHours?.split('|')[0]?.trim() || ''}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-xs font-accent text-white/50 uppercase tracking-widest">Evening</span>
                      <span className="text-xs font-body text-brand-gold font-bold">
                        {settings?.mondayHours?.split('|')[1]?.trim() || ''}
                      </span>
                    </div>
                    <p className="text-[10px] font-accent text-white/30 pt-1">Open 7 days a week</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Transmission Array Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="lg:col-span-7 bg-brand-surface/40 border border-white/5 p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-brand-orange via-brand-gold to-transparent"></div>

            <div className="mb-8">
              <span className="text-[10px] font-accent text-brand-gold tracking-widest uppercase">YOUR JOURNEY STARTS HERE</span>
              <h3 className="text-2xl font-display text-white uppercase tracking-wide mt-1">REACH OUT TO US</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-accent tracking-wider text-white/40 uppercase">YOUR NAME *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={set('name')}
                    className="w-full bg-brand-dark/80 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-orange transition-colors rounded-none font-body"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-accent tracking-wider text-white/40 uppercase">YOUR PHONE NUMBER *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={set('phone')}
                    className="w-full bg-brand-dark/80 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-orange transition-colors rounded-none font-body"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-accent tracking-wider text-white/40 uppercase">YOUR EMAIL ADDRESS *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={set('email')}
                  className="w-full bg-brand-dark/80 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold transition-colors rounded-none font-body"
                  placeholder="operator@domain.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-accent tracking-wider text-white/40 uppercase">WHAT ARE YOU TRAINING FOR? *</label>
                <select
                  value={form.subject}
                  onChange={set('subject')}
                  className="w-full bg-brand-dark/80 border border-white/10 px-4 py-3 text-sm text-white/80 focus:outline-none focus:border-brand-orange transition-colors rounded-none font-accent tracking-wider appearance-none cursor-pointer"
                >
                  <option value="hypertrophy">BUILD MUSCLE — STRENGTH TRAINING</option>
                  <option value="athleticism">ATHLETIC PERFORMANCE — SPEED & POWER</option>
                  <option value="combat">FAT LOSS — CONDITIONING</option>
                  <option value="transformation">FULL BODY TRANSFORMATION — 16 WEEKS</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-accent tracking-wider text-white/40 uppercase">TELL US ABOUT YOURSELF *</label>
                <textarea
                  rows="4"
                  required
                  value={form.message}
                  onChange={set('message')}
                  className="w-full bg-brand-dark/80 border border-white/10 p-4 text-sm text-white focus:outline-none focus:border-brand-orange transition-colors rounded-none font-body resize-none"
                  placeholder="Tell us about your current fitness level, goals, availability, or anything else we should know..."
                ></textarea>
              </div>

              {success && (
                <div className="text-green-400 text-xs font-accent bg-green-500/10 border border-green-500/20 px-4 py-3 uppercase tracking-widest">
                  ✓ Transmission received — we will respond within 24 hours.
                </div>
              )}
              {error && (
                <div className="text-red-400 text-xs font-accent bg-red-500/10 border border-red-500/20 px-4 py-3">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-aggressive w-full py-4 bg-gradient-to-r from-brand-orange to-brand-gold text-brand-dark font-accent font-bold uppercase tracking-widest text-xs cursor-pointer shadow-glow-gold hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center gap-2">
                  {submitting ? 'Sending your message...' : 'Send My Enquiry'} <FaPaperPlane className="text-[10px]" />
                </span>
              </button>
            </form>
          </motion.div>

        </div>
      </section>

      {/* 3. Google Maps Embed */}
      <section className="px-6 pb-16 max-w-7xl mx-auto">
        <div className="w-full overflow-hidden rounded-none border border-white/5">
          <iframe
            title="Quads Fitness Location - Manimajra"
            src={settings?.address ? `https://www.google.com/maps?q=${encodeURIComponent(settings.address)}&output=embed` : 'about:blank'}
            width="100%"
            height="380"
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <p className="text-white/30 text-xs font-body mt-3">
          {settings?.address ? `📍 ${settings.address}` : ''}
        </p>
      </section>

      {/* 4. Gym Membership Plans Manimajra — Keyword Section */}
      <section className="py-20 px-6 border-t border-white/5 bg-brand-dark">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-xs font-accent uppercase tracking-[0.3em] text-brand-orange block mb-3">// ACCESS TIERS</span>
          <h2 className="text-3xl md:text-4xl font-display text-white uppercase tracking-wide mb-4">
            GYM MEMBERSHIP PLANS <span className="text-gradient">MANIMAJRA</span>
          </h2>
          <p className="text-white/55 font-body text-base max-w-2xl mx-auto mb-12 leading-relaxed">
            Quads Fitness offers some of the most competitive gym membership prices in Manimajra. No hidden fees. No auto-renewals. Just real results.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
            {[
              { name: '3 Months Plan', price: '₹2,800', detail: 'Best starter plan. Full gym access, all equipment.' },
              { name: '13 Months Plan', price: '₹8,000', detail: 'Best value long-term membership. Priority slot booking.' },
              { name: 'Personal Training – 1 Month', price: '₹5,000', detail: '1-on-1 coaching with certified trainer for 30 days.' },
              { name: 'Personal Training – 3 Months', price: '₹12,000', detail: '3-month intensive with dedicated trainer & progress reports.' },
            ].map((plan) => (
              <div key={plan.name} className="combat-plate p-6 rounded-none border border-white/10 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-accent uppercase tracking-widest text-white/80 mb-3">{plan.name}</h3>
                  <p className="text-3xl font-display text-brand-gold font-black mb-3">{plan.price}</p>
                  <p className="text-white/50 font-body text-xs leading-relaxed">{plan.detail}</p>
                </div>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 text-[10px] font-accent uppercase tracking-widest text-brand-orange hover:text-brand-gold transition-colors"
                >
                  Enquire on WhatsApp →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
