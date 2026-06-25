import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';
import { useSettings } from '../contexts/SettingsContext';

/**
 * Shared layout for blog articles.
 * Props:
 *   meta      – { title, description, slug, datePublished, keywords }
 *   faqItems  – [{ question, answer }]
 *   relatedLinks – [{ label, to }]   internal links
 *   children  – article body JSX
 */
export default function BlogArticle({ meta, faqItems = [], relatedLinks = [], children }) {
  const { settings } = useSettings();
  const cleanPhone = settings?.phone?.replace(/\D/g, '');
  const whatsappHref = cleanPhone ? `https://wa.me/${cleanPhone}` : null;
  const breadcrumbs = [
    { name: 'Blog', url: '/blog' },
    { name: meta.title, url: `/blog/${meta.slug}` },
  ];

  return (
    <PageTransition>
      <SEO
        title={meta.title}
        description={meta.description}
        keywords={meta.keywords}
        url={`/blog/${meta.slug}`}
        type="article"
        article={{ author: 'Quads Fitness Team', datePublished: meta.datePublished }}
        faqItems={faqItems}
        breadcrumbs={breadcrumbs}
        noLocalBusiness
      />

      {/* Header */}
      <section className="relative pt-36 pb-12 px-6 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-accent text-white/30 uppercase tracking-widest">
            <Link to="/" className="hover:text-brand-orange transition-colors">Home</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-brand-orange transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-white/50 truncate max-w-xs">{meta.title}</span>
          </nav>

          <span className="text-xs font-accent uppercase tracking-[0.3em] text-brand-orange block mb-3">// QUADS FITNESS INSIGHTS</span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-display text-white uppercase tracking-tight leading-tight mb-6"
          >
            {meta.title}
          </motion.h1>

          <div className="flex items-center gap-4 text-xs font-accent text-white/40 uppercase tracking-widest border-t border-white/5 pt-4">
            <span>By Quads Fitness Team</span>
            <span className="text-white/20">|</span>
            <time dateTime={meta.datePublished}>
              {new Date(meta.datePublished).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
            <span className="text-white/20">|</span>
            <span>Manimajra, India</span>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Article content */}
          <article className="lg:col-span-8 prose-article">
            {children}

            {/* FAQ Section */}
            {faqItems.length > 0 && (
              <div className="mt-16 border-t border-white/10 pt-12">
                <h2 className="text-2xl font-display text-white uppercase tracking-wide mb-8">Frequently Asked Questions</h2>
                <div className="space-y-5">
                  {faqItems.map(({ question, answer }, i) => (
                    <div key={i} className="bg-brand-surface2 border border-white/5 p-6">
                      <h3 className="text-base font-display text-white uppercase tracking-wide mb-2">{question}</h3>
                      <p className="text-white/60 font-body text-sm leading-relaxed">{answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-brand-surface border border-white/5 p-6 sticky top-28">
              <h3 className="text-xs font-accent uppercase tracking-widest text-brand-gold mb-5">// Quick Links</h3>
              <div className="space-y-3">
                <Link to="/programs" className="flex items-center gap-2 text-sm font-body text-white/70 hover:text-brand-orange transition-colors group">
                  <span className="text-brand-orange group-hover:translate-x-1 transition-transform">→</span> View Membership Plans
                </Link>
                <Link to="/trainers" className="flex items-center gap-2 text-sm font-body text-white/70 hover:text-brand-orange transition-colors group">
                  <span className="text-brand-orange group-hover:translate-x-1 transition-transform">→</span> Meet Our Trainers
                </Link>
                <Link to="/contact" className="flex items-center gap-2 text-sm font-body text-white/70 hover:text-brand-orange transition-colors group">
                  <span className="text-brand-orange group-hover:translate-x-1 transition-transform">→</span> Contact Us
                </Link>
                {relatedLinks.map(({ label, to }) => (
                  <Link key={to} to={to} className="flex items-center gap-2 text-sm font-body text-white/70 hover:text-brand-orange transition-colors group">
                    <span className="text-brand-orange group-hover:translate-x-1 transition-transform">→</span> {label}
                  </Link>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-xs font-accent text-white/40 uppercase tracking-widest mb-4">Ready to Start?</p>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-gradient-to-r from-brand-orange to-brand-gold text-brand-dark font-accent font-bold text-xs uppercase tracking-widest px-6 py-3 hover:opacity-90 transition-opacity"
                >
                  Join Quads Fitness Today
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Back to Blog */}
      <div className="py-12 px-6 border-t border-white/5 text-center">
        <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-accent uppercase tracking-widest text-brand-gold hover:text-brand-orange transition-colors">
          ← Back to All Articles
        </Link>
      </div>
    </PageTransition>
  );
}
