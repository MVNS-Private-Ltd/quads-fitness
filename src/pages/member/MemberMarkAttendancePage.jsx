import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, CalendarCheck, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { markMyAttendance, getCachedMe } from '../../services/memberApi';

export default function MemberMarkAttendancePage() {
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('Marking your attendance...');
  const [timeIn, setTimeIn] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const now = new Date();
    setTimeIn(now.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit'
    }));

    const markAttendance = async () => {
      try {
        const data = await markMyAttendance();
        if (mounted) {
          setStatus('success');
          setMessage(data.message || 'Attendance marked successfully!');
          setTimeout(() => {
            if (mounted) navigate('/member/dashboard');
          }, 4000);
        }
      } catch (err) {
        if (mounted) {
          setStatus('error');
          setMessage(err.message || 'Failed to mark attendance. Please try again.');
        }
      }
    };

    markAttendance();
    return () => { mounted = false; };
  }, [navigate]);

  const member = getCachedMe();
  const firstName = member?.name?.split(' ')[0] || 'Member';
  const today = new Date().toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="min-h-screen bg-brand-darker flex flex-col items-center justify-center p-5 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-brand-gold/5 blur-3xl" />
      </div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <img src="/icons/icon-96x96.png" alt="Quads Fitness" className="w-16 h-16 rounded-2xl mx-auto mb-3 shadow-lg" />
        <p className="text-brand-gold text-xs font-bold uppercase tracking-[0.3em]">Quads Fitness</p>
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="w-full max-w-[340px] bg-brand-dark border border-white/8 rounded-3xl p-8 shadow-2xl shadow-black/50 relative overflow-hidden"
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-gold to-transparent" />

        <AnimatePresence mode="wait">

          {/* Loading */}
          {status === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center gap-5"
            >
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-brand-gold animate-spin" />
                </div>
              </div>
              <div>
                <h2 className="text-white font-heading text-xl font-bold uppercase tracking-wide mb-1">
                  Checking You In
                </h2>
                <p className="text-brand-gray text-sm">Please wait a moment...</p>
              </div>
            </motion.div>
          )}

          {/* Success */}
          {status === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="flex flex-col items-center text-center gap-5"
            >
              {/* Success icon with ring animation */}
              <div className="relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 15 }}
                  className="w-24 h-24 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center"
                >
                  <CheckCircle className="w-12 h-12 text-green-400" strokeWidth={1.5} />
                </motion.div>
                {/* Ping ring */}
                <span className="absolute inset-0 rounded-full border border-green-500/30 animate-ping opacity-40" />
              </div>

              <div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-white font-heading text-2xl font-bold uppercase tracking-wide mb-1"
                >
                  You're In! 💪
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-green-400 font-semibold text-sm"
                >
                  Welcome, {firstName}!
                </motion.p>
              </div>

              {/* Info chips */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full bg-brand-darker/60 rounded-2xl p-4 space-y-3 border border-white/5"
              >
                <div className="flex items-center gap-3 text-sm">
                  <CalendarCheck size={16} className="text-brand-gold flex-shrink-0" />
                  <span className="text-brand-gray">{today}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock size={16} className="text-brand-gold flex-shrink-0" />
                  <span className="text-brand-gray">Check-in at <strong className="text-white">{timeIn}</strong></span>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-brand-gray/60 text-xs"
              >
                Taking you to your dashboard...
              </motion.p>
            </motion.div>
          )}

          {/* Error */}
          {status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="flex flex-col items-center text-center gap-5"
            >
              <div className="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center">
                <XCircle className="w-12 h-12 text-red-400" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-white font-heading text-xl font-bold uppercase tracking-wide mb-2">Oops!</h2>
                <p className="text-red-400 text-sm leading-relaxed">{message}</p>
              </div>
              <button
                onClick={() => navigate('/member/dashboard')}
                className="w-full bg-brand-gold text-brand-darker font-bold py-3 rounded-xl text-sm uppercase tracking-wider hover:bg-brand-gold/90 active:scale-95 transition-all"
              >
                Go to Dashboard
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>

      {/* Motivational footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-brand-gray/40 text-xs text-center"
      >
        Train hard. Live strong. 🔥
      </motion.p>
    </div>
  );
}
