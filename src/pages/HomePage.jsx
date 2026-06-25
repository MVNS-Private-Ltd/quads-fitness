import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaChevronRight, FaBolt, FaShieldAlt, FaCrosshairs, FaStar, FaQuoteLeft, FaMapMarkerAlt } from 'react-icons/fa';
import PageTransition from '../components/PageTransition';
import Hero from '../components/Hero'; 
import ExplodingWeightSection from '../components/ExplodingWeightSection';
import SEO from '../components/SEO';
import { getPublicReviews } from '../services/api';
import { useSettings } from '../contexts/SettingsContext';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const faqItems = [
  { question: "What are the gym timings?", answer: "We are open Morning: 5:00 AM – 10:00 AM and Evening: 11:00 AM – 9:00 PM, seven days a week. No matter your schedule, there is no excuse not to show up." },
  { question: "What membership plans are available?", answer: "We offer a 3 Months Plan, a 13 Months Plan, and dedicated Personal Training packages for 1 and 3 months — designed for every level of commitment." },
  { question: "Do you offer personal training?", answer: "Yes. Our certified coaches provide 1-on-1 personal training tailored to your goals — whether that is building strength, losing weight, or transforming your body from the ground up." },
  { question: "Where is Quads Fitness located?", answer: "Quads Fitness is located at Manimajra near Shivalik Garden, Police Station Shubhash Nagar, Manimajra. Contact us or view the map on our Contact page for exact directions." },
  { question: "How much does gym membership cost in Manimajra?", answer: "Our memberships start at ₹2,800 for 3 months — the best value for a serious training facility in Manimajra." }
];

export default function HomePage() {
  const [reviews, setReviews] = useState([]);
  const { settings } = useSettings();

  useEffect(() => {
    getPublicReviews()
      .then(data => setReviews(data))
      .catch(err => console.error("Failed to load reviews", err));
  }, []);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : null;

  return (
    <PageTransition>
      <SEO 
        title="Quads Fitness | Premium Gym in Manimajra" 
        description="Elevate your fitness journey at Quads. A premium training facility in Manimajra with elite coaching, state-of-the-art equipment, and results-driven programs." 
        keywords="gym, fitness, personal trainer, membership, Manimajra gym, best gym in Manimajra" 
        url="/" 
        faqItems={faqItems}
        aggregateRating={averageRating ? { ratingValue: averageRating, reviewCount: reviews.length } : null}
      />
      
      {/* 1. Main 3D Hero Section */}
      <Hero />

      {/* 2. Systems Briefing Teaser & About SEO Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <span className="text-xs font-accent uppercase tracking-[0.3em] text-brand-orange block mb-2">// SECURITY CLEARANCE ACTIVE</span>
            <h2 className="text-4xl md:text-5xl font-display text-white uppercase tracking-tight leading-none mb-4">
              ABOUT QUADS <br /> <span className="text-gradient">FITNESS</span>
            </h2>
            <div className="hazard-line mb-6"></div>
          </div>
          <div className="lg:col-span-7 space-y-6 border-l border-white/5 pl-0 lg:pl-8">
            <p className="text-white/70 font-body text-base leading-relaxed">
              Quads Fitness is the <strong>best gym in Manimajra</strong> for people who are serious about changing. We cut out everything that doesn't build you up. What remains is pure work — heavy iron, honest coaching, and a culture where progress is the only goal.
            </p>
            <p className="text-white/70 font-body text-base leading-relaxed">
              Whether you're looking for a premier <strong>fitness centre in Manimajra</strong> or a high-intensity <strong>gym near me Manimajra</strong>, our facility gives you everything you need to move forward — and nothing that holds you back.
            </p>
            <div className="flex gap-4 pt-4">
              <Link to="/about" className="btn-aggressive bg-gradient-to-r from-brand-orange to-brand-gold text-brand-dark font-accent font-bold uppercase tracking-widest px-6 py-3 rounded-none shadow-glow-gold">
                <span>Review Full Background</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 border-y border-white/5 bg-brand-surface2">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-display text-brand-gold font-black mb-2">5,000+</p>
            <p className="text-xs font-accent uppercase tracking-widest text-white/50">Members Trained</p>
          </div>
          <div>
            <p className="text-4xl font-display text-brand-gold font-black mb-2">12+</p>
            <p className="text-xs font-accent uppercase tracking-widest text-white/50">Expert Trainers</p>
          </div>
          <div>
            <p className="text-4xl font-display text-brand-gold font-black mb-2">7</p>
            <p className="text-xs font-accent uppercase tracking-widest text-white/50">Days A Week</p>
          </div>
          <div>
            <p className="text-4xl font-display text-brand-gold font-black mb-2">10+</p>
            <p className="text-xs font-accent uppercase tracking-widest text-white/50">Years Experience</p>
          </div>
        </div>
      </section>

      {/* 3D Storytelling Interactive Section */}
      <ExplodingWeightSection />

      {/* 4. Real Member Reviews (Dynamic) */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-orange/[0.01] pointer-events-none"></div>
        <div className="relative z-10">
          <div className="text-center mb-16">
            <span className="text-xs font-accent tracking-widest text-brand-orange uppercase block mb-2">// METRIC PROOF INDEX</span>
            <h3 className="text-4xl md:text-5xl font-display text-white uppercase tracking-wider mb-2">VERIFIED <span className="text-gradient">TESTIMONIALS</span></h3>
            {averageRating && (
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="text-white font-bold">{averageRating} / 5.0</span>
                <div className="flex">
                  {[...Array(5)].map((_, idx) => (
                    <FaStar key={idx} className={idx < Math.round(averageRating) ? "text-brand-gold" : "text-white/20"} />
                  ))}
                </div>
                <span className="text-white/50 text-xs uppercase tracking-widest">({reviews.length} Reviews)</span>
              </div>
            )}
            <p className="text-white/50 font-body text-sm leading-relaxed max-w-md mx-auto">
              Real records from active operators within the facility. We let the results speak.
            </p>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-12 text-brand-muted border border-white/5 bg-brand-surface2 rounded-2xl max-w-2xl mx-auto">
              <p>No verified reviews have been cleared for public display yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review, i) => (
                (() => {
                  const memberName = review.memberName?.trim() || 'Verified Member';
                  const avatarLetter = memberName.charAt(0).toUpperCase();

                  return (
                <div key={review.id} className="bg-brand-surface2 border border-white/5 rounded-2xl p-8 relative group hover:border-brand-gold/30 transition-all duration-300">
                  <div className="absolute top-8 right-8 text-white/5 group-hover:text-brand-gold/10 transition-colors">
                    <FaQuoteLeft size={40} />
                  </div>
                  <div className="flex text-brand-gold mb-6 relative z-10 text-sm">
                    {[...Array(5)].map((_, idx) => (
                      <FaStar key={idx} className={idx < review.rating ? "text-brand-gold" : "text-white/20"} />
                    ))}
                  </div>
                  <p className="text-white/80 font-body text-sm leading-relaxed mb-8 relative z-10 line-clamp-4">
                    {review.comment ? `"${review.comment}"` : '"Review pending public display approval."'}
                  </p>
                  <div className="flex items-center gap-4 relative z-10 border-t border-white/5 pt-6">
                    <div className="w-10 h-10 rounded-full bg-brand-dark border border-brand-gold/30 flex items-center justify-center text-brand-gold font-bold">
                      {avatarLetter}
                    </div>
                    <div>
                      <h4 className="text-white font-display uppercase tracking-wider text-sm">{memberName}</h4>
                      <p className="text-brand-muted text-xs font-accent tracking-widest uppercase">Verified Member</p>
                    </div>
                  </div>
                </div>
                  );
                })()
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Location Section */}
      <section className="py-24 px-6 border-t border-white/5 bg-brand-dark">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-display text-white uppercase mb-6">Our Location in <span className="text-brand-orange">Manimajra</span></h2>
            <p className="text-white/60 font-body mb-8">Located strategically in Manimajra, Quads Fitness provides a massive training floor easily accessible with ample parking. Come visit us during operating hours.</p>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 border border-white/10 bg-brand-surface2">
                <FaMapMarkerAlt className="text-brand-gold text-xl shrink-0 mt-1" />
                <div>
                  <h4 className="text-white uppercase font-display text-sm mb-1">Address</h4>
                  {settings?.address && <p className="text-white/50 text-sm">{settings.address}</p>}
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Link to="/contact" className="btn-aggressive border border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white font-accent font-bold uppercase tracking-widest px-8 py-4 rounded-none transition-colors">
                Get Directions
              </Link>
            </div>
          </div>
          <div className="h-96 bg-brand-surface2 border border-white/10 p-2">
            {/* Dark mode styled Google Map Embed */}
            {settings?.address ? (
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(settings.address)}&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) contrast(80%) grayscale(20%)" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Quads Fitness Location"
              ></iframe>
            ) : null}
          </div>
        </div>
      </section>

      {/* 5. Frequently Asked Questions (SEO) */}
      <section className="py-24 px-6 border-t border-white/5 bg-brand-darker">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-accent tracking-widest text-brand-orange uppercase block mb-2">// INTEL ARCHIVE</span>
            <h3 className="text-3xl md:text-4xl font-display text-white uppercase tracking-wider mb-6">FREQUENTLY ASKED <span className="text-gradient">QUESTIONS</span></h3>
          </div>
          
          <div className="space-y-6">
            {faqItems.map((faq, i) => (
              <div key={i} className="bg-brand-surface2 border border-white/5 p-6">
                <h4 className="text-lg font-display text-white uppercase mb-2">{faq.question}</h4>
                <p className="text-white/60 font-body text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-gradient-to-t from-brand-orange/10 to-transparent border-t border-white/5 text-center">
        <h2 className="text-4xl md:text-5xl font-display text-white uppercase mb-6">The best gym in <span className="text-gradient">Manimajra</span> is waiting for you</h2>
        <p className="text-white/60 mb-10 max-w-xl mx-auto">Every champion started exactly where you are. Stop waiting for the right moment. Devote your heart — and begin.</p>
        <Link to="/programs" className="btn-aggressive bg-brand-orange text-white font-accent font-bold uppercase tracking-widest px-10 py-5 text-lg shadow-glow-gold">
          Start Your Transformation
        </Link>
      </section>

    </PageTransition>
  );
}
