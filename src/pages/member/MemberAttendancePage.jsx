import { useState, useEffect } from 'react';
import { getMe, getCachedMe } from '../../services/memberApi';
import { CalendarCheck, Clock, TrendingDown, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ITEMS_PER_PAGE = 10;

export default function MemberAttendancePage() {
  const [attendance, setAttendance] = useState(getCachedMe()?.attendance || []);
  const [loading, setLoading] = useState(!getCachedMe());
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      const data = await getMe();
      setAttendance(data.attendance || []);
    } catch (err) {
      setError('Failed to load attendance history.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse pb-10">
        <div className="h-24 bg-brand-dark rounded-xl" />
        <div className="grid grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-brand-dark rounded-xl" />)}
        </div>
        <div className="h-80 bg-brand-dark rounded-xl" />
      </div>
    );
  }

  // Stats
  const now = new Date();
  const thisMonth = attendance.filter(a => {
    const d = new Date(a.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonth = attendance.filter(a => {
    const d = new Date(a.date);
    return d.getMonth() === lastMonthDate.getMonth() && d.getFullYear() === lastMonthDate.getFullYear();
  });
  const trend = thisMonth.length - lastMonth.length;

  // Pagination
  const totalPages = Math.max(1, Math.ceil(attendance.length / ITEMS_PER_PAGE));
  const paged = attendance.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-heading font-bold text-white mb-1">My Attendance</h1>
        <p className="text-brand-gray">Your complete gym check-in history.</p>
      </motion.div>

      {error && (
        <div className="bg-red-500/10 text-red-400 p-4 rounded-lg border border-red-500/25">{error}</div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          {
            icon: <CalendarCheck size={22} className="text-brand-gold" />,
            label: 'Total Check-ins',
            value: attendance.length,
            sub: 'All time'
          },
          {
            icon: <Clock size={22} className="text-brand-gold" />,
            label: 'This Month',
            value: thisMonth.length,
            sub: now.toLocaleString('default', { month: 'long' })
          },
          {
            icon: trend >= 0
              ? <TrendingUp size={22} className="text-green-400" />
              : <TrendingDown size={22} className="text-red-400" />,
            label: 'Monthly Trend',
            value: `${trend >= 0 ? '+' : ''}${trend}`,
            sub: 'vs last month',
            color: trend >= 0 ? 'text-green-400' : 'text-red-400'
          }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-brand-dark border border-brand-gray/10 rounded-xl p-5 flex items-center gap-5"
          >
            <div className="w-12 h-12 bg-brand-darker rounded-full flex items-center justify-center border border-brand-gold/15 flex-shrink-0">
              {stat.icon}
            </div>
            <div>
              <p className="text-brand-gray text-xs uppercase tracking-wider mb-0.5">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color || 'text-white'}`}>{stat.value}</p>
              <p className="text-brand-gray text-xs">{stat.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* History Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-brand-dark border border-brand-gray/10 rounded-2xl overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-brand-gray/10 bg-brand-darker/30">
          <h2 className="text-lg font-heading font-bold text-white">Check-in History</h2>
        </div>

        {attendance.length === 0 ? (
          /* ── EMPTY STATE ─────────────────── */
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-3xl bg-brand-darker border border-brand-gray/10 flex items-center justify-center">
                <CalendarCheck size={40} className="text-brand-gray/30" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-brand-gold/10 rounded-full flex items-center justify-center border border-brand-gold/20">
                <Clock size={14} className="text-brand-gold" />
              </div>
            </div>
            <h3 className="text-white font-bold text-xl mb-2">No Visits Recorded Yet</h3>
            <p className="text-brand-gray text-sm max-w-sm leading-relaxed">
              Every time you visit Quads, your check-in will appear here. 
              Start your journey and watch your consistency grow!
            </p>
            <div className="mt-6 px-5 py-2.5 border border-brand-gold/30 text-brand-gold text-sm rounded-lg">
              Your first visit is just around the corner 💪
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-brand-darker/20 border-b border-brand-gray/10">
                    <th className="px-6 py-3 text-brand-gray text-xs font-medium uppercase tracking-widest">Date</th>
                    <th className="px-6 py-3 text-brand-gray text-xs font-medium uppercase tracking-widest">Day</th>
                    <th className="px-6 py-3 text-brand-gray text-xs font-medium uppercase tracking-widest">Time In</th>
                    <th className="px-6 py-3 text-brand-gray text-xs font-medium uppercase tracking-widest">Time Out</th>
                    <th className="px-6 py-3 text-brand-gray text-xs font-medium uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-gray/5">
                  {paged.map((record, idx) => {
                    const d = new Date(record.date);
                    return (
                      <motion.tr
                        key={record.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.03 }}
                        className="hover:bg-brand-darker/30 transition-colors"
                      >
                        <td className="px-6 py-4 text-white font-medium">
                          {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 text-brand-gray">
                          {d.toLocaleDateString('en-US', { weekday: 'long' })}
                        </td>
                        <td className="px-6 py-4 text-brand-gray">{record.timeIn || '—'}</td>
                        <td className="px-6 py-4 text-brand-gray">{record.timeOut || '—'}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                            record.status === 'Present'
                              ? 'bg-green-500/10 text-green-400'
                              : 'bg-red-500/10 text-red-400'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-brand-gray/10">
                <p className="text-brand-gray text-sm">
                  Page {page} of {totalPages} — {attendance.length} total visits
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-brand-gray/20 text-brand-gray hover:text-white hover:border-brand-gold/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-brand-gray/20 text-brand-gray hover:text-white hover:border-brand-gold/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
