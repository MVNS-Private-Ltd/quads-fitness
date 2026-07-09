import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scanner } from '@yudiel/react-qr-scanner';
import { X, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MemberQRScanner({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleScan = (result) => {
    if (result && result.length > 0) {
      const qrValue = result[0].rawValue;
      // We check if it's the correct attendance URL
      if (qrValue.includes('/member/attendance/mark')) {
        onClose();
        navigate('/member/attendance/mark');
      } else {
        setError('Invalid QR Code. Please scan the Quads Attendance QR code.');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4"
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10">
            <div className="flex items-center gap-2 text-white">
              <QrCode className="text-brand-gold" size={24} />
              <span className="font-heading text-xl uppercase tracking-wider">Scan QR</span>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scanner Area */}
          <div className="w-full max-w-sm aspect-square relative rounded-3xl overflow-hidden shadow-2xl border-2 border-brand-gold/30">
            <Scanner
              onScan={handleScan}
              onError={(e) => console.log('QR Error:', e)}
              components={{
                audio: false,
                finder: false,
              }}
              styles={{
                container: { width: '100%', height: '100%' },
              }}
            />
            {/* Custom Finder Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-64 h-64 border-2 border-brand-gold rounded-3xl relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-brand-gold rounded-tl-3xl -mt-1 -ml-1"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-brand-gold rounded-tr-3xl -mt-1 -mr-1"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-brand-gold rounded-bl-3xl -mb-1 -ml-1"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-brand-gold rounded-br-3xl -mb-1 -mr-1"></div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="h-12 mt-8 flex items-center justify-center">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg text-sm text-center max-w-xs"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="text-brand-gray/60 text-sm mt-4 text-center max-w-xs">
            Point your camera at the attendance QR code located at the front desk.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
