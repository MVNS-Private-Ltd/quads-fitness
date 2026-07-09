import { useState, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PWAUpdatePrompt() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.ready.then((registration) => {
      // If there's an update waiting in the background, show prompt
      if (registration.waiting) {
        setWaitingWorker(registration.waiting);
        setShowUpdate(true);
      }

      // Listen for new service worker installation
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          // Has new service worker finished installing and is waiting to activate?
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            setWaitingWorker(newWorker);
            setShowUpdate(true);
          }
        });
      });
    });

    // Handle the page reload once the new service worker takes over
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      // Tell the new service worker to take over immediately
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  return (
    <AnimatePresence>
      {showUpdate && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-4 left-0 right-0 z-[9999] px-4"
        >
          <div className="max-w-sm mx-auto bg-brand-gold text-brand-darker rounded-2xl p-4 shadow-2xl flex items-center gap-4 border border-brand-gold/50">
            {/* Icon */}
            <div className="w-10 h-10 rounded-full bg-brand-darker/10 flex items-center justify-center flex-shrink-0">
              <RefreshCw size={20} className="text-brand-darker" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm leading-snug">Update Available!</p>
              <p className="text-brand-darker/80 text-xs mt-0.5 font-medium">A new version of Quads is ready.</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleDismiss}
                className="w-8 h-8 flex items-center justify-center rounded-full text-brand-darker/60 hover:text-brand-darker hover:bg-brand-darker/5 transition-colors"
              >
                <X size={16} />
              </button>
              <button
                onClick={handleUpdate}
                className="bg-brand-darker text-brand-gold font-bold px-4 py-2 rounded-xl text-xs shadow-lg hover:bg-black transition-all active:scale-95"
              >
                Update Now
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
