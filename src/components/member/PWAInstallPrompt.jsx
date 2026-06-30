import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Detects if the user is on iOS Safari
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);
const isInStandaloneMode = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Already installed or dismissed? Don't show
    if (isInStandaloneMode()) return;
    if (sessionStorage.getItem('pwa-dismissed')) return;

    if (isIOS()) {
      // iOS doesn't fire beforeinstallprompt — show manual guide instead
      setTimeout(() => setShowBanner(true), 3000);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS()) {
      setShowIOSGuide(true);
      return;
    }
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShowBanner(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    sessionStorage.setItem('pwa-dismissed', '1');
  };

  if (dismissed || isInStandaloneMode()) return null;

  return (
    <>
      {/* Bottom Install Banner */}
      <AnimatePresence>
        {showBanner && !showIOSGuide && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-[9999] p-4 safe-bottom"
          >
            <div className="max-w-sm mx-auto bg-brand-dark border border-brand-gold/30 rounded-2xl p-4 shadow-2xl shadow-black/60 flex items-center gap-4">
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center flex-shrink-0">
                <img src="/icons/icon-72x72.png" alt="Quads App" className="w-9 h-9 rounded-lg" />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm leading-snug">Install Quads Fitness</p>
                <p className="text-brand-gray text-xs mt-0.5">Add to home screen for instant check-ins</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={handleDismiss}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-brand-gray hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
                <button
                  onClick={handleInstall}
                  className="flex items-center gap-1.5 bg-brand-gold text-brand-darker font-bold px-3 py-2 rounded-xl text-xs hover:bg-brand-gold/90 transition-all active:scale-95"
                >
                  <Download size={13} />
                  Install
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS Manual Guide Modal */}
      <AnimatePresence>
        {showIOSGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-end justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowIOSGuide(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-full max-w-sm bg-brand-dark border border-white/10 rounded-3xl p-6 mb-2 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <img src="/icons/icon-72x72.png" alt="Quads" className="w-10 h-10 rounded-xl" />
                  <div>
                    <p className="text-white font-bold text-sm">Install Quads Fitness</p>
                    <p className="text-brand-gray text-xs">on your iPhone / iPad</p>
                  </div>
                </div>
                <button onClick={() => setShowIOSGuide(false)} className="text-brand-gray hover:text-white p-1">
                  <X size={20} />
                </button>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                {[
                  {
                    num: '1',
                    text: (
                      <>
                        Tap the <strong className="text-white">Share</strong> button{' '}
                        <span className="inline-block text-lg">⬆️</span> at the bottom of Safari
                      </>
                    ),
                  },
                  {
                    num: '2',
                    text: (
                      <>
                        Scroll down and tap{' '}
                        <strong className="text-white">"Add to Home Screen"</strong>{' '}
                        <span className="inline-block text-lg">➕</span>
                      </>
                    ),
                  },
                  {
                    num: '3',
                    text: (
                      <>
                        Tap <strong className="text-white">Add</strong> in the top right. Done! 🎉
                      </>
                    ),
                  },
                ].map((step) => (
                  <div key={step.num} className="flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full bg-brand-gold text-brand-darker font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {step.num}
                    </div>
                    <p className="text-brand-gray text-sm leading-relaxed">{step.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-3 bg-brand-gold/10 border border-brand-gold/20 rounded-xl">
                <p className="text-brand-gold text-xs text-center font-medium">
                  📱 After installing, scan the QR code to check in instantly — no login needed!
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
