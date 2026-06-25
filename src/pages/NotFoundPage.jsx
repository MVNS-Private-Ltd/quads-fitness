import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

export default function NotFoundPage() {
  return (
    <PageTransition>
      <section className="min-h-[80vh] flex items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,107,0,0.05),transparent_70%)] pointer-events-none" />
        
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-9xl font-display text-brand-orange font-black block mb-4 opacity-20">404</span>
            <h1 className="text-4xl md:text-5xl font-display text-white uppercase tracking-tight mb-6">
              Area <span className="text-brand-orange">Restricted</span>
            </h1>
            <p className="text-white/60 font-body text-base leading-relaxed mb-10">
              The page you are attempting to access does not exist in our database. It may have been relocated, deleted, or you do not have the required clearance.
            </p>
            
            <Link to="/" className="btn-aggressive bg-brand-gold text-brand-dark font-accent font-bold uppercase tracking-widest px-8 py-4 shadow-glow-gold inline-block">
              Return to Base
            </Link>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}
