import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { markMyAttendance } from '../../services/memberApi';

export default function MemberMarkAttendancePage() {
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('Marking your attendance...');
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const markAttendance = async () => {
      try {
        const data = await markMyAttendance();
        
        if (mounted) {
          setStatus('success');
          setMessage(data.message || 'Attendance marked successfully!');
          
          // Auto-redirect to dashboard after a few seconds
          setTimeout(() => {
            if (mounted) navigate('/member/dashboard');
          }, 3000);
        }
      } catch (err) {
        if (mounted) {
          setStatus('error');
          setMessage(err.message || 'Failed to mark attendance. Please try again or contact front desk.');
        }
      }
    };

    markAttendance();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-brand-darker flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-sm w-full bg-brand-dark border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden"
      >
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader className="w-16 h-16 text-brand-gold animate-spin mb-4" />
            <h2 className="text-xl font-heading text-white uppercase tracking-wider">{message}</h2>
            <p className="text-white/50 mt-2 text-sm">Please wait while we log your entry...</p>
          </div>
        )}

        {status === 'success' && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center"
          >
            <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
            <h2 className="text-2xl font-heading text-white uppercase tracking-wider mb-2">You're In!</h2>
            <p className="text-green-400 font-medium">{message}</p>
            <p className="text-white/40 text-sm mt-6">Redirecting to your dashboard...</p>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center"
          >
            <XCircle className="w-20 h-20 text-red-500 mb-4" />
            <h2 className="text-2xl font-heading text-white uppercase tracking-wider mb-2">Oops!</h2>
            <p className="text-red-400 font-medium">{message}</p>
            <button 
              onClick={() => navigate('/member/dashboard')}
              className="mt-8 bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg transition-colors text-sm uppercase tracking-wider"
            >
              Go to Dashboard
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
