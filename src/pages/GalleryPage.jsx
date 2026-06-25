import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getGallery } from '../services/api';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      // By default getGallery gets published items (since the public API should only return published)
      // Actually our backend api currently fetches all, but we will filter out drafts here or backend.
      // Let's filter on frontend just in case backend returns all.
      const data = await getGallery();
      setImages(data.filter(img => img.status === 'Published'));
    } catch (err) {
      console.error('Failed to load gallery', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(images.map(img => img.category).filter(Boolean))];
  const filteredImages = filter === 'All' ? images : images.filter(img => img.category === filter);

  return (
    <PageTransition>
      <SEO 
        title="Gym Gallery | Quads Fitness" 
        description="See our state-of-the-art gym facilities and visual evidence of transformations in Manimajra." 
        url="/gallery" 
      />
      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-orange font-accent uppercase tracking-widest text-xs mb-4 block">// FACILITY ARCHIVE</span>
          <h1 className="text-5xl md:text-6xl font-display text-white uppercase mb-6 tracking-tight">
            VISUAL <span className="text-gradient">EVIDENCE</span>
          </h1>
          <p className="text-brand-muted font-body text-lg">
            No filters. No excuses. Just raw progress and the environment that forged it.
          </p>
        </div>

        {/* Filters */}
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full font-accent text-xs uppercase tracking-widest transition-all ${
                  filter === cat
                    ? 'bg-brand-gold text-brand-darker font-bold'
                    : 'bg-brand-surface2 text-brand-muted border border-white/10 hover:border-brand-gold/50 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-12 h-12 border-4 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin"></div>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-24 text-brand-muted">
            <p>No visual records currently available in this sector.</p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredImages.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1 }}
                className="break-inside-avoid group relative overflow-hidden rounded-xl bg-brand-surface2 border border-white/5"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title
                    ? `${item.title} - Quads Fitness Manimajra`
                    : item.category
                    ? `${item.category} at Quads Fitness Gym, Manimajra`
                    : 'Gym equipment and facilities at Quads Fitness Manimajra'
                  }
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                {(item.title || item.category) && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    {item.category && <span className="text-brand-gold text-xs font-accent tracking-widest uppercase mb-1">{item.category}</span>}
                    {item.title && <h3 className="text-white font-display text-xl">{item.title}</h3>}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
