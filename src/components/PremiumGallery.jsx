import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight, FiZoomIn } from 'react-icons/fi';

/* ── Lightbox ─────────────────────────────────────────────────────────────── */
function Lightbox({ images, index, onClose, onPrev, onNext }) {
  const img = images[index];

  useEffect(() => {
    const fn = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose, onNext, onPrev]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="fixed top-5 right-5 z-[60] w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-brand-gold text-white hover:text-black transition-all border border-white/20"
      >
        <FiX size={18} />
      </button>

      {/* Counter */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[60] text-white/60 text-sm font-body tracking-widest">
        {index + 1} / {images.length}
      </div>

      {/* Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="fixed left-4 z-[60] w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-brand-gold text-white hover:text-black transition-all border border-white/20"
      >
        <FiChevronLeft size={22} />
      </button>

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="fixed right-4 z-[60] w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-brand-gold text-white hover:text-black transition-all border border-white/20"
      >
        <FiChevronRight size={22} />
      </button>

      {/* Image */}
      <motion.div
        key={index}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col items-center gap-4 px-4 w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={img.imageUrl}
          alt={img.title || 'Gallery photo'}
          className="max-h-[80vh] max-w-full w-auto object-contain rounded-2xl shadow-2xl"
          draggable={false}
        />
        {img.title && (
          <p className="text-white/70 text-sm font-body tracking-wide">{img.title}</p>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ── Masonry Grid ─────────────────────────────────────────────────────────── */
function GalleryCard({ img, index, onClick }) {
  // Give every 5th card a double-height look for visual interest
  const isTall = index % 7 === 0 || index % 7 === 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.07 }}
      className={`relative overflow-hidden rounded-2xl cursor-pointer group ${isTall ? 'row-span-2' : ''}`}
      onClick={onClick}
    >
      <img
        src={img.imageUrl}
        alt={img.title || 'Quads Fitness'}
        className={`w-full object-cover transition-transform duration-700 group-hover:scale-110 ${isTall ? 'h-[480px]' : 'h-[240px]'}`}
        loading="lazy"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

      {/* Hover content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400">
        {img.title && (
          <p className="text-white font-heading text-sm tracking-wide truncate">{img.title}</p>
        )}
        {img.category && (
          <span className="text-brand-gold text-xs font-accent uppercase tracking-widest">{img.category}</span>
        )}
      </div>

      {/* Zoom icon */}
      <div className="absolute top-4 right-4 w-9 h-9 bg-brand-gold/0 group-hover:bg-brand-gold rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
        <FiZoomIn size={16} className="text-brand-darker" />
      </div>

      {/* Gold border flash on hover */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-brand-gold/40 transition-colors duration-400 pointer-events-none" />
    </motion.div>
  );
}

/* ── Main Component ───────────────────────────────────────────────────────── */
export default function PremiumGallery({ images }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const categories = ['All', ...Array.from(new Set(images.map(i => i.category).filter(Boolean)))];

  const filtered = activeCategory === 'All'
    ? images
    : images.filter(i => i.category === activeCategory);

  const openLightbox = (idx) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = useCallback(() => setLightboxIndex(i => (i - 1 + filtered.length) % filtered.length), [filtered.length]);
  const nextImage = useCallback(() => setLightboxIndex(i => (i + 1) % filtered.length), [filtered.length]);

  return (
    <div className="min-h-screen bg-brand-darker">

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <div className="relative pt-28 pb-16 px-6 text-center overflow-hidden">
        {/* Background radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-gold/5 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 text-brand-gold font-accent uppercase tracking-[0.3em] text-xs font-bold mb-4">
            <span className="w-8 h-px bg-brand-gold/60" />
            Our Gym
            <span className="w-8 h-px bg-brand-gold/60" />
          </span>
          <h1 className="font-display text-5xl md:text-7xl text-white tracking-tight uppercase leading-none mb-4">
            Inside<br />
            <span className="text-brand-gold">Quads</span>
          </h1>
          <p className="text-white/50 font-body text-base max-w-md mx-auto">
            Real iron. Real sweat. Real results.
          </p>
        </motion.div>
      </div>

      {/* ── Category Filters ─────────────────────────────────────────────── */}
      {categories.length > 1 && (
        <div className="flex justify-center gap-2 flex-wrap px-6 pb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium font-body tracking-wide transition-all duration-200 border ${
                activeCategory === cat
                  ? 'bg-brand-gold text-brand-darker border-brand-gold shadow-glow-gold'
                  : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* ── Masonry Grid ─────────────────────────────────────────────────── */}
      <div className="px-4 md:px-8 lg:px-16 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4"
          >
            {filtered.map((img, i) => (
              <div key={img.id} className="break-inside-avoid mb-4">
                <GalleryCard img={img} index={i} onClick={() => openLightbox(i)} />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="flex justify-center items-center py-32 text-white/40 font-body">
            No photos in this category yet.
          </div>
        )}
      </div>

      {/* ── Lightbox ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={filtered}
            index={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
