import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../../components/PageTransition';
import SEO from '../../components/SEO';

const articles = [
  {
    slug: 'best-gym-in-manimajra',
    title: 'Best Gym in Manimajra — Why Quads Fitness Stands Out',
    description: 'Looking for the best gym in Manimajra? Discover why Quads Fitness is the top choice for serious fitness enthusiasts. View plans & join today.',
    date: '2026-06-01',
    category: 'Gym Guide',
  },
  {
    slug: 'how-to-choose-gym-membership-manimajra',
    title: 'How to Choose the Right Gym Membership Plan in Manimajra',
    description: 'Compare gym membership options in Manimajra. Learn what to look for before committing — from pricing to facilities. Book your free trial now.',
    date: '2026-06-05',
    category: 'Membership',
  },
  {
    slug: 'benefits-of-personal-training-manimajra',
    title: 'Benefits of Personal Training at a Gym in Manimajra',
    description: 'Unlock faster results with 1-on-1 personal training in Manimajra. Certified coaches, custom plans, and real transformations — join Quads Fitness.',
    date: '2026-06-10',
    category: 'Personal Training',
  },
  {
    slug: 'morning-vs-evening-gym-sessions',
    title: 'Morning vs Evening Gym Sessions — Which is Better?',
    description: 'Morning or evening workouts — which delivers better results? Quads Fitness in Manimajra is open 5AM–10AM and 11AM–9PM. Find your optimal slot.',
    date: '2026-06-14',
    category: 'Fitness Tips',
  },
  {
    slug: 'beginners-guide-fitness-manimajra',
    title: "Complete Beginner's Guide to Starting Your Fitness Journey in Manimajra",
    description: "New to the gym? This beginner's guide to fitness in Manimajra covers everything — gear, plans, nutrition, and finding the right gym. Start today.",
    date: '2026-06-19',
    category: 'Beginner Guide',
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function BlogIndexPage() {
  return (
    <PageTransition>
      <SEO
        title="Fitness Blog | Gym Tips & Guides | Quads Fitness Manimajra"
        description="Expert gym tips, fitness guides, and membership advice from Quads Fitness — Manimajra's best gym. Read our latest articles and join today."
        keywords="fitness blog Manimajra, gym tips Manimajra, personal training guide, gym membership advice"
        url="/blog"
        breadcrumbs={[{ name: 'Blog', url: '/blog' }]}
        noLocalBusiness
      />

      {/* Header */}
      <section className="relative pt-40 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs font-accent uppercase tracking-[0.3em] text-brand-orange block mb-3">// INSIGHTS & GUIDES</span>
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-6xl md:text-8xl font-display text-white uppercase tracking-tight leading-none mb-4"
          >
            FITNESS <span className="text-gradient">INTEL</span>
          </motion.h1>
          <div className="hazard-line mb-6" />
          <p className="text-white/55 font-body text-base max-w-2xl">
            Real advice from Manimajra's most results-focused gym. No fluff — just actionable fitness knowledge to help you train smarter.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, i) => (
            <motion.article
              key={article.slug}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: i * 0.08 }}
              className="group combat-plate p-0 overflow-hidden flex flex-col rounded-none"
            >
              {/* Category Banner */}
              <div className="bg-gradient-to-r from-brand-orange/20 to-brand-gold/10 border-b border-white/5 px-6 py-3 flex items-center justify-between">
                <span className="text-[10px] font-accent uppercase tracking-widest text-brand-orange">{article.category}</span>
                <time className="text-[10px] font-accent text-white/30" dateTime={article.date}>
                  {new Date(article.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                </time>
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <h2 className="text-xl font-display text-white uppercase tracking-wide leading-tight mb-4 group-hover:text-brand-gold transition-colors">
                  {article.title}
                </h2>
                <p className="text-white/50 font-body text-sm leading-relaxed mb-8 flex-grow">
                  {article.description}
                </p>
                <Link
                  to={`/blog/${article.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-accent uppercase tracking-widest text-brand-orange hover:text-brand-gold transition-colors"
                >
                  Read Article →
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-white/5 bg-brand-dark text-center">
        <p className="text-white/50 font-body text-sm mb-2 uppercase tracking-widest font-accent">Ready to stop reading and start training?</p>
        <h3 className="text-3xl font-display text-white uppercase mb-6">Join the Best Gym in <span className="text-gradient">Manimajra</span></h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/programs" className="btn-aggressive bg-gradient-to-r from-brand-orange to-brand-gold text-brand-dark font-accent font-bold px-8 py-4 text-sm uppercase tracking-widest">
            View Membership Plans
          </Link>
          <Link to="/contact" className="btn-aggressive border border-white/20 text-white font-accent font-bold px-8 py-4 text-sm uppercase tracking-widest hover:border-brand-orange transition-colors">
            Contact Us
          </Link>
        </div>
      </section>
    </PageTransition>
  );
}
