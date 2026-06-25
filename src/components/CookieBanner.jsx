import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('quads-cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('quads-cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('quads-cookie-consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none"
        >
          <div className="max-w-4xl mx-auto bg-brand-surface border border-white/10 p-6 shadow-2xl pointer-events-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-display uppercase tracking-wider mb-2">Initialize Intake Protocol</h3>
              <p className="text-white/60 font-body text-sm leading-relaxed">
                We use strict tracking protocols (cookies) to optimize your experience, analyze site traffic, and personalize content. Accept to proceed with full clearance.
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <button
                onClick={handleDecline}
                className="text-white/50 hover:text-white font-accent text-xs uppercase tracking-widest transition-colors px-4 py-3"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="btn-aggressive bg-brand-orange text-white font-accent font-bold uppercase tracking-widest px-6 py-3"
              >
                Accept All
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
