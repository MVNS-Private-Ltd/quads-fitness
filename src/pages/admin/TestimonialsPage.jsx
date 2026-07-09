import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StatusChip, EmptyState, TableFilterBar, PreviewDrawer, AvatarPlaceholder } from '../../components/admin/SharedAdminUI';
import { FiMessageSquare, FiPlus, FiEdit2, FiStar } from 'react-icons/fi';
import { getTestimonials } from '../../services/api';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: 'easeIn' } }
};

export default function TestimonialsPage() {
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTestimonials().then(data => {
      setTestimonials(data);
      setLoading(false);
    }).catch(console.error);
  }, []);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-display text-white mb-2">Testimonials & Reviews</h2>
          <p className="text-brand-muted font-body">Manage success stories shown on the website.</p>
        </div>
        <button className="px-6 py-3 bg-brand-gold text-brand-darker font-heading font-bold rounded-xl hover:bg-white transition-colors shadow-glow-gold flex items-center gap-2">
          <FiPlus size={18} /> Add Review
        </button>
      </div>

      <div className="bg-brand-surface2 border border-white/5 rounded-2xl p-6">
        <TableFilterBar 
          filters={[{ label: 'Status', options: ['Published', 'Draft'] }]} 
        />

        {loading ? (
          <div className="text-brand-muted py-8 text-center">Loading testimonials...</div>
        ) : testimonials.length === 0 ? (
          <EmptyState 
            title="No Testimonials" 
            message="Gather reviews to display on your site." 
            icon={FiMessageSquare}
            action={<button className="px-6 py-2 bg-brand-dark border border-white/10 text-white rounded-xl hover:border-brand-gold transition-colors">Add Review</button>}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                key={testimonial.id}
                className="bg-brand-dark border border-white/5 rounded-2xl p-6 hover:border-brand-gold/30 transition-colors cursor-pointer flex flex-col"
                onClick={() => setSelectedTestimonial(testimonial)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <AvatarPlaceholder name={testimonial.clientName} size="md" />
                    <div>
                      <p className="text-white font-medium">{testimonial.clientName}</p>
                      <p className="text-brand-muted text-xs truncate max-w-[120px]">{testimonial.transformation || 'Client'}</p>
                    </div>
                  </div>
                  <StatusChip status={testimonial.status} />
                </div>
                <div className="flex text-brand-gold mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} size={14} className={i < (testimonial.rating || 5) ? 'fill-current' : 'opacity-30'} />
                  ))}
                </div>
                <p className="text-brand-platinum text-sm italic flex-1">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <PreviewDrawer 
        isOpen={!!selectedTestimonial} 
        onClose={() => setSelectedTestimonial(null)} 
        title="Edit Testimonial"
      >
        {selectedTestimonial && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
              <AvatarPlaceholder name={selectedTestimonial.clientName} size="lg" />
              <div>
                <h3 className="text-xl font-display text-white">{selectedTestimonial.clientName}</h3>
                <p className="text-brand-muted text-sm">{selectedTestimonial.transformation}</p>
              </div>
            </div>
            
            <div>
              <label className="text-xs text-brand-muted uppercase tracking-wider mb-2 block">Quote</label>
              <textarea 
                className="w-full bg-brand-dark border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-gold h-32 resize-none"
                defaultValue={selectedTestimonial.quote}
                readOnly
              />
            </div>

            <div className="flex justify-between items-center bg-brand-dark p-4 rounded-xl border border-white/5">
              <span className="text-brand-platinum text-sm">Status</span>
              <StatusChip status={selectedTestimonial.status} />
            </div>

            <div className="pt-6 border-t border-white/5 flex gap-3">
              <button className="flex-1 py-3 bg-brand-gold text-brand-darker font-bold rounded-xl hover:bg-white transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        )}
      </PreviewDrawer>
    </motion.div>
  );
}
