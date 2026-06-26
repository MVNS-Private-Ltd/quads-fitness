import { useState, useEffect } from 'react';
import { getGallery } from '../services/api';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';
import SpiralGallery from '../components/SpiralGallery';

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGallery()
      .then(data => setImages(data.filter(img => img.status === 'Published')))
      .catch(err => console.error('Failed to load gallery', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageTransition>
      <SEO
        title="Gym Gallery | Quads Fitness"
        description="See our state-of-the-art gym facilities and visual evidence of transformations in Manimajra."
        url="/gallery"
      />

      {loading ? (
        <div className="flex justify-center items-center h-screen bg-brand-darker">
          <div className="w-12 h-12 border-4 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" />
        </div>
      ) : images.length === 0 ? (
        <div className="flex justify-center items-center h-screen bg-brand-darker">
          <p className="text-brand-muted font-body text-lg">No photos uploaded yet. Check back soon.</p>
        </div>
      ) : (
        <SpiralGallery images={images} />
      )}
    </PageTransition>
  );
}
