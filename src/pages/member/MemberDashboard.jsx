import { useState, useEffect } from 'react';
import { getMe, getMemberOffers, getCachedMe, getCachedOffers } from '../../services/memberApi';
import {
  Dumbbell, CalendarCheck, TrendingUp, UserCheck,
  Megaphone, Clock, AlertCircle, ChevronRight, Target, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

import MemberQRScanner from '../../components/member/MemberQRScanner';
import { QrCode } from 'lucide-react';

export default function MemberDashboard() {
  const [member, setMember] = useState(getCachedMe() || null);
  const [offers, setOffers] = useState(getCachedOffers() || []);
  const [loading, setLoading] = useState(!getCachedMe());
  const [error, setError] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [memberData, offersData] = await Promise.all([
        getMe(),
        getMemberOffers().catch(() => [])
      ]);
      setMember(memberData);
      setOffers(offersData);
    } catch (err) {
      setError('Failed to load dashboard data. Please refresh or contact support.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse pb-10">
        <div className="h-36 bg-brand-dark rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-brand-dark rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-64 bg-brand-dark rounded-xl" />
          <div className="h-64 bg-brand-dark rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="text-brand-red w-16 h-16 mb-4 opacity-80" />
        <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
        <p className="text-brand-gray mb-6">{error}</p>
        <button
          onClick={loadDashboard}
          className="bg-brand-gold text-brand-darker font-bold px-6 py-3 rounded-lg hover:bg-brand-gold/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!member) return null;

  const recentAttendance = member.attendance?.slice(0, 5) || [];
  const latestLog = member.progressLogs?.[0];
  const thisMonthAttendance = member.attendance?.filter(a => {
    const d = new Date(a.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }) || [];

  return (
    <div className="space-y-8 pb-10">
      <MemberQRScanner isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />

      {/* ── Welcome Hero ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="relative bg-gradient-to-br from-brand-dark via-brand-darker to-brand-dark border border-brand-gold/15 p-7 md:p-10 rounded-2xl overflow-hidden"
      >
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-brand-gold/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-40 h-40 bg-blue-500/3 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-brand-gold text-sm font-medium uppercase tracking-widest mb-1">Member Portal</p>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">
              Welcome back, <span className="text-brand-gold">{member.name.split(' ')[0]}</span>!
            </h1>
            <p className="text-brand-gray text-base">
              {member.status === 'Active'
                ? "Your membership is active. Let's crush today's goals."
                : `Your membership status is: ${member.status}. Please contact the front desk.`}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <button
              onClick={() => setIsScannerOpen(true)}
              className="flex items-center gap-2 bg-brand-gold text-brand-darker font-bold px-5 py-3 rounded-xl hover:bg-brand-gold/90 transition-all hover:scale-105 active:scale-95 text-sm shadow-lg shadow-brand-gold/20"
            >
              <QrCode size={18} />
              Scan QR to Check In
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Stat Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            icon: <Dumbbell size={22} className="text-brand-gold" />,
            title: 'Current Plan',
            value: member.plan?.name || 'No Plan',
            sub: member.status,
            status: member.status === 'Active' ? 'good' : 'warn',
            link: '/member/membership'
          },
          {
            icon: <CalendarCheck size={22} className="text-brand-gold" />,
            title: 'This Month',
            value: `${thisMonthAttendance.length} visits`,
            sub: 'Check-ins',
            status: null,
            link: '/member/attendance'
          },
          {
            icon: <TrendingUp size={22} className="text-brand-gold" />,
            title: 'Latest BMI',
            value: latestLog?.bmi ? latestLog.bmi.toFixed(1) : '--',
            sub: latestLog ? new Date(latestLog.date).toLocaleDateString() : 'Not tracked yet',
            status: null,
            link: '/member/progress'
          },
          {
            icon: <UserCheck size={22} className="text-brand-gold" />,
            title: 'Trainer',
            value: member.trainer?.name || 'Unassigned',
            sub: member.trainer?.specialty || 'Contact front desk',
            status: null,
            link: '/member/profile'
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.2 }}
          >
            <Link
              to={card.link}
              className="block bg-brand-dark border border-brand-gray/10 hover:border-brand-gold/20 p-5 rounded-xl group transition-all hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-brand-darker rounded-lg group-hover:bg-brand-gold/10 transition-colors">
                  {card.icon}
                </div>
                <ChevronRight size={14} className="text-brand-gray/40 group-hover:text-brand-gold transition-colors mt-1" />
              </div>
              <p className="text-brand-gray text-xs font-medium uppercase tracking-wider mb-1">{card.title}</p>
              <h3 className="text-xl font-bold text-white mb-1 truncate">{card.value}</h3>
              <p className={`text-xs truncate ${
                card.status === 'good' ? 'text-green-400' :
                card.status === 'warn' ? 'text-red-400' :
                'text-brand-gray'
              }`}>{card.sub}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* ── Main Content Grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Recent Attendance */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-brand-dark border border-brand-gray/10 rounded-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-brand-gray/10">
            <div className="flex items-center gap-3">
              <CalendarCheck className="text-brand-gold" size={20} />
              <h2 className="text-lg font-heading font-bold text-white">Recent Check-ins</h2>
            </div>
            <Link
              to="/member/attendance"
              className="text-brand-gold text-sm hover:text-white transition-colors flex items-center gap-1"
            >
              View All <ChevronRight size={14} />
            </Link>
          </div>

          {recentAttendance.length > 0 ? (
            <div className="divide-y divide-brand-gray/5">
              {recentAttendance.map((log, idx) => (
                <motion.div
                  key={log.id || idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.05 * idx }}
                  className="flex items-center justify-between px-6 py-4 hover:bg-brand-darker/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
                      <Clock size={14} className="text-brand-gold" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">
                        {new Date(log.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                      {log.timeIn && (
                        <p className="text-brand-gray text-xs">{log.timeIn}{log.timeOut ? ` – ${log.timeOut}` : ''}</p>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    log.status === 'Present'
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-red-500/10 text-red-400'
                  }`}>
                    {log.status}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-darker border border-brand-gray/10 flex items-center justify-center mb-4">
                <CalendarCheck size={28} className="text-brand-gray/40" />
              </div>
              <h3 className="text-white font-bold mb-1">No Check-ins Yet</h3>
              <p className="text-brand-gray text-sm max-w-xs">
                Your attendance history will appear here once you start visiting the gym.
              </p>
            </div>
          )}
        </motion.div>

        {/* Right Column: Offers + Alerts */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-6"
        >
          {/* Membership Status Alert */}
          {member.status !== 'Active' && (
            <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={18} className="text-red-400" />
                <h3 className="text-red-400 font-bold">Membership {member.status}</h3>
              </div>
              <p className="text-brand-gray text-sm">Please contact the front desk to resolve your account status.</p>
            </div>
          )}

          {/* Active Offers & Notifications */}
          <div className="bg-brand-dark border border-brand-gray/10 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 p-5 border-b border-brand-gray/10">
              <Megaphone size={18} className="text-brand-gold" />
              <h2 className="text-lg font-heading font-bold text-white">Offers & Updates</h2>
            </div>

            {offers.length > 0 ? (
              <div className="divide-y divide-brand-gray/5">
                {offers.map((offer, i) => (
                  <div key={offer.id} className="p-5">
                    {offer.badgeText && (
                      <span className="inline-block text-xs font-bold tracking-widest uppercase bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded mb-2">
                        {offer.badgeText}
                      </span>
                    )}
                    <h3 className="text-white font-bold text-sm mb-1">{offer.title}</h3>
                    {offer.description && (
                      <p className="text-brand-gray text-xs leading-relaxed">{offer.description}</p>
                    )}
                    {offer.validUntil && (
                      <p className="text-brand-gray/50 text-xs mt-2">
                        Valid until {new Date(offer.validUntil).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              // Plan active notice as fallback if no offers
              <div className="p-6 text-center">
                {member.plan ? (
                  <div>
                    <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-3">
                      <Target size={22} className="text-brand-gold" />
                    </div>
                    <p className="text-white font-bold text-sm mb-1">You're on {member.plan.name}</p>
                    <p className="text-brand-gray text-xs">Stay consistent and keep pushing your limits!</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-brand-gray text-sm">No active offers right now.</p>
                    <p className="text-brand-gray/60 text-xs mt-1">Check back soon!</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Progress Nudge */}
          {!latestLog && (
            <Link
              to="/member/progress"
              className="block bg-gradient-to-br from-brand-gold/10 to-brand-gold/5 border border-brand-gold/25 rounded-xl p-5 hover:border-brand-gold/40 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp size={18} className="text-brand-gold" />
                <h3 className="text-brand-gold font-bold text-sm">Log Your First Check-in</h3>
              </div>
              <p className="text-brand-gray text-xs leading-relaxed">
                Track your weight and BMI to monitor your fitness journey over time.
              </p>
              <div className="flex items-center gap-1 mt-3 text-brand-gold text-xs font-medium group-hover:gap-2 transition-all">
                Get started <ChevronRight size={12} />
              </div>
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  );
}
