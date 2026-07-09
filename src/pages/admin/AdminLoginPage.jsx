import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';
import { loginAdmin } from '../../lib/adminAuth';
import BrandLogo from '../../components/BrandLogo';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await loginAdmin(email, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-darker flex items-center justify-center px-6 relative overflow-hidden">

      {/* Ambient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.04)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent" />

      {/* Corner Brackets */}
      <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-brand-gold/20" />
      <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-brand-gold/20" />
      <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-brand-gold/20" />
      <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-brand-gold/20" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-xl border border-brand-gold/20 mb-6 p-2">
            <BrandLogo className="h-full w-full object-contain" alt="Quads Fitness logo" />
          </div>
          <span className="text-[10px] font-accent tracking-[0.4em] text-brand-orange uppercase block mb-3">
            // RESTRICTED ACCESS
          </span>
          <h1 className="text-3xl font-display text-white uppercase tracking-wider">
            QUADS<span className="text-brand-gold">.ADMIN</span>
          </h1>
          <p className="text-white/30 font-body text-xs mt-2 tracking-wide">
            Authorization required to access the control panel.
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-brand-surface2 border border-white/5 p-8 relative">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-brand-orange via-brand-gold to-transparent" />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-accent tracking-widest text-white/40 uppercase flex items-center gap-2 mb-2">
                  <FiLock size={10} /> Admin Email
                </label>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  autoComplete="email"
                  className="w-full bg-brand-dark border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold transition-colors rounded-none font-body tracking-widest"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label className="text-[10px] font-accent tracking-widest text-white/40 uppercase flex items-center gap-2 mb-2">
                  <FiLock size={10} /> Password
                </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  autoComplete="current-password"
                  className="w-full bg-brand-dark border border-white/10 px-4 py-3 pr-12 text-sm text-white focus:outline-none focus:border-brand-gold transition-colors rounded-none font-body tracking-widest"
                  placeholder="Enter password..."
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
            </div>

            {error && (
              <div className="text-red-400 text-xs font-accent bg-red-500/10 border border-red-500/20 px-4 py-3 uppercase tracking-wider">
                ⚠ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password || !email}
              className="w-full py-4 bg-gradient-to-r from-brand-orange to-brand-gold text-brand-dark font-accent font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <FiShield size={14} />
                {loading ? 'Authenticating...' : 'Authorize Access'}
              </span>
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-white/15 text-[10px] font-accent tracking-widest uppercase mt-6">
          QUADS FITNESS CONTROL SYSTEM v1.0
        </p>
      </motion.div>
    </div>
  );
}
