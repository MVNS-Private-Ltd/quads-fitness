import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { loginMember } from '../../lib/memberAuth';
import { supabase } from '../../lib/supabaseClient';
import { ArrowLeft, Phone, Mail, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BrandLogo from '../../components/BrandLogo';
import { getSettings } from '../../services/api';

export default function MemberLoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [gymPhone, setGymPhone] = useState('');
  
  // Phone auth state
  const [authMode, setAuthMode] = useState('main'); // 'main' | 'phone'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  // Check for not-found flag from MemberGuard redirect
  useEffect(() => {
    if (location.state?.notFound) {
      setError('No member profile found for this email. Contact the gym to activate your access.');
    }
  }, [location.state]);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && !location.state?.notFound) {
        navigate('/member/dashboard', { replace: true });
      }
    });
  }, [navigate, location.state]);

  // Fetch gym phone number from settings
  useEffect(() => {
    getSettings()
      .then(data => setGymPhone(data.phone || ''))
      .catch(() => {});
  }, []);

  // Handle Google Auth
  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/member/dashboard',
        },
      });
      if (oauthError) throw oauthError;
    } catch (err) {
      setError(err.message || 'Google sign-in failed. Please try again.');
      setLoading(false);
    }
  };

  // Handle Phone OTP: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Normalize phone: ensure +91 prefix for India
    let normalized = phoneNumber.replace(/\s+/g, '').replace(/-/g, '');
    if (!normalized.startsWith('+')) {
      normalized = '+91' + normalized;
    }

    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: normalized,
      });
      if (otpError) throw otpError;
      setOtpSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please check the phone number and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Phone OTP: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let normalized = phoneNumber.replace(/\s+/g, '').replace(/-/g, '');
    if (!normalized.startsWith('+')) {
      normalized = '+91' + normalized;
    }

    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        phone: normalized,
        token: otpCode,
        type: 'sms',
      });
      if (verifyError) throw verifyError;
      if (data?.session) {
        const from = location.state?.from?.pathname || '/member/dashboard';
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-darker bg-noise flex items-center justify-center p-4">
      <Link to="/" className="absolute top-8 left-8 text-brand-gold hover:text-white transition-colors flex items-center font-medium z-20">
        <ArrowLeft className="mr-2" size={20} />
        Back to Website
      </Link>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-brand-dark border border-brand-gold/20 p-8 rounded-xl shadow-[0_0_50px_-12px_rgba(212,175,55,0.15)] relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-50"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-gold/5 rounded-full blur-3xl"></div>

        <AnimatePresence mode="wait">
          {authMode === 'main' ? (
            <motion.div
              key="main"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
              className="relative z-10"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <BrandLogo className="h-14 w-auto" alt="Quads Fitness logo" />
                </div>
                <h1 className="font-heading text-4xl text-brand-gold tracking-widest uppercase mb-2">Member Login</h1>
                <p className="text-white/50 text-sm tracking-wide">Sign in to see your plan, progress, and attendance.</p>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg text-center leading-relaxed"
                >
                  {error}
                  {gymPhone && error.includes('contact the gym') && (
                    <a 
                      href={`tel:${gymPhone}`} 
                      className="block mt-2 text-brand-gold font-semibold hover:underline"
                    >
                      📞 Call {gymPhone}
                    </a>
                  )}
                </motion.div>
              )}

              {/* Google Auth Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-white text-gray-800 font-semibold py-3.5 px-4 rounded-lg flex justify-center items-center hover:bg-gray-50 transition-all duration-200 shadow-sm disabled:opacity-60 group"
              >
                <svg className="w-5 h-5 mr-3 flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              {/* Divider */}
              <div className="my-6 flex items-center">
                <div className="h-px bg-white/10 flex-1"></div>
                <span className="text-white/30 text-xs uppercase tracking-widest px-4">or</span>
                <div className="h-px bg-white/10 flex-1"></div>
              </div>

              {/* Phone Auth Button */}
              <button
                type="button"
                disabled
                className="w-full bg-brand-darker border border-white/10 text-white/50 font-semibold py-3.5 px-4 rounded-lg flex justify-center items-center cursor-not-allowed group"
              >
                <Phone size={18} className="mr-3 text-brand-gold/50 flex-shrink-0" />
                Sign in with Phone (Coming Soon)
              </button>

              {/* Help Section */}
              <div className="mt-8 pt-6 border-t border-white/5">
                <p className="text-white/40 text-xs text-center leading-relaxed">
                  Your online access isn't set up?
                </p>
                <p className="text-white/50 text-sm text-center mt-2 leading-relaxed">
                  {gymPhone ? (
                    <>Call us at <a href={`tel:${gymPhone}`} className="text-brand-gold font-semibold hover:underline">{gymPhone}</a> and we'll activate your member access.</>
                  ) : (
                    <>Contact the front desk and we'll activate your member access.</>
                  )}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="relative z-10"
            >
              {/* Back button */}
              <button
                type="button"
                onClick={() => { setAuthMode('main'); setOtpSent(false); setOtpCode(''); setPhoneNumber(''); setError(''); }}
                className="flex items-center text-white/50 hover:text-white text-sm mb-6 transition-colors"
              >
                <ChevronLeft size={16} className="mr-1" />
                Back to login options
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
                  <Phone size={24} className="text-brand-gold" />
                </div>
                <h2 className="font-heading text-2xl text-white tracking-wider uppercase mb-1">
                  {otpSent ? 'Enter OTP' : 'Phone Login'}
                </h2>
                <p className="text-white/50 text-sm">
                  {otpSent 
                    ? `We sent a code to ${phoneNumber}` 
                    : 'Enter the phone number registered with your membership.'
                  }
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg text-center"
                >
                  {error}
                </motion.div>
              )}

              {!otpSent ? (
                /* Step 1: Phone Number Input */
                <form onSubmit={handleSendOtp} className="space-y-5">
                  <div>
                    <label className="block text-white/60 text-xs mb-2 uppercase tracking-wider">Phone Number</label>
                    <div className="flex">
                      <span className="bg-brand-darker border border-white/10 border-r-0 text-white/50 rounded-l-lg px-3 flex items-center text-sm font-mono">+91</span>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                        className="flex-1 bg-brand-darker border border-white/10 text-white rounded-r-lg px-4 py-3 focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/30 transition-all font-mono tracking-wider"
                        placeholder="98765 43210"
                        maxLength={10}
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || phoneNumber.length < 10}
                    className="w-full bg-brand-gold text-brand-darker font-bold py-3 px-4 rounded-lg uppercase tracking-wider hover:bg-brand-gold/90 transition-all flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending OTP...
                      </span>
                    ) : (
                      'Send OTP'
                    )}
                  </button>
                </form>
              ) : (
                /* Step 2: OTP Input */
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div>
                    <label className="block text-white/60 text-xs mb-2 uppercase tracking-wider">Verification Code</label>
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full bg-brand-darker border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/30 transition-all text-center text-2xl font-mono tracking-[0.5em]"
                      placeholder="------"
                      maxLength={6}
                      required
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpCode.length < 6}
                    className="w-full bg-brand-gold text-brand-darker font-bold py-3 px-4 rounded-lg uppercase tracking-wider hover:bg-brand-gold/90 transition-all flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </span>
                    ) : (
                      'Verify & Sign In'
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtpCode(''); }}
                    className="w-full text-white/40 hover:text-white text-sm py-2 transition-colors"
                  >
                    Didn't receive the code? Try again
                  </button>
                </form>
              )}

              {/* Help Section */}
              <div className="mt-8 pt-6 border-t border-white/5">
                <p className="text-white/40 text-xs text-center leading-relaxed">
                  Make sure the phone number matches your gym registration.
                </p>
                {gymPhone && (
                  <p className="text-white/50 text-sm text-center mt-2">
                    Need help? Call <a href={`tel:${gymPhone}`} className="text-brand-gold font-semibold hover:underline">{gymPhone}</a>
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
