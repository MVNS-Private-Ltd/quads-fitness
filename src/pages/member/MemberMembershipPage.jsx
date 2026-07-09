import { useState, useEffect } from 'react';
import { getMe, getCachedMe } from '../../services/memberApi';
import {
  CreditCard, CheckCircle2, AlertTriangle, Calendar,
  Clock, User, Dumbbell, Star
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function MemberMembershipPage() {
  const [member, setMember] = useState(getCachedMe() || null);
  const [loading, setLoading] = useState(!getCachedMe());
  const [error, setError] = useState('');

  useEffect(() => {
    loadMembership();
  }, []);

  const loadMembership = async () => {
    try {
      const data = await getMe();
      setMember(data);
    } catch (err) {
      setError('Failed to load membership data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-8 pb-10">
        <div className="h-20 bg-brand-dark rounded-xl" />
        <div className="grid grid-cols-2 gap-6">
          <div className="h-64 bg-brand-dark rounded-2xl" />
          <div className="h-64 bg-brand-dark rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error && !member) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 pb-10 mt-8">
        <h1 className="text-3xl font-heading font-bold text-white mb-1">Membership Plan</h1>
        <div className="bg-red-500/10 text-red-400 p-4 rounded-lg border border-red-500/25">{error}</div>
      </div>
    );
  }

  if (!member) return null;

  const plan = member.plan;
  let features = [];
  try {
    if (plan?.features) features = JSON.parse(plan.features);
  } catch (e) {
    features = [];
  }

  const statusColor =
    member.status === 'Active' ? 'text-green-400 bg-green-500/10 border-green-500/20' :
    member.status === 'Suspended' ? 'text-red-400 bg-red-500/10 border-red-500/20' :
    'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-heading font-bold text-white mb-1">Membership Plan</h1>
        <p className="text-brand-gray">Your active subscription and benefits.</p>
      </motion.div>

      {error && (
        <div className="bg-red-500/10 text-red-400 p-4 rounded-lg border border-red-500/25">{error}</div>
      )}

      {!plan ? (
        /* ── NO PLAN EMPTY STATE ─────────────────── */
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 px-8 text-center bg-brand-dark border border-brand-gray/10 rounded-2xl"
        >
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-3xl bg-brand-darker border border-brand-gray/10 flex items-center justify-center">
              <CreditCard size={40} className="text-brand-gray/30" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-9 h-9 bg-brand-red/10 rounded-full flex items-center justify-center border border-brand-red/20">
              <AlertTriangle size={16} className="text-brand-red" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No Plan Assigned</h2>
          <p className="text-brand-gray max-w-sm text-sm leading-relaxed mb-8">
            You don't currently have an active membership plan. 
            Visit the front desk or speak to a staff member to get started.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg mb-8">
            {[
              { icon: <Dumbbell size={18} />, text: 'Access to all equipment' },
              { icon: <User size={18} />, text: 'Personal trainer support' },
              { icon: <Star size={18} />, text: 'Premium facilities' },
            ].map((item, i) => (
              <div key={i} className="bg-brand-darker border border-brand-gray/10 rounded-xl p-4 flex flex-col items-center gap-2 text-center">
                <div className="text-brand-gold">{item.icon}</div>
                <p className="text-brand-gray text-xs">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-brand-gold border border-brand-gold/30 bg-brand-gold/5 px-6 py-3 rounded-xl text-sm font-medium">
            Contact the front desk to activate your plan
          </div>
        </motion.div>

      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Plan Card ──────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 relative bg-gradient-to-b from-brand-dark to-brand-darker border border-brand-gold/25 rounded-2xl p-7 overflow-hidden shadow-[0_8px_40px_-12px_rgba(212,175,55,0.18)]"
          >
            {/* Glow */}
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-brand-gold/8 rounded-full blur-2xl pointer-events-none" />

            <div className="relative">
              {/* Status badge */}
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full border mb-6 ${statusColor}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {member.status}
              </span>

              <div className="flex items-start gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center flex-shrink-0">
                  <CreditCard size={22} className="text-brand-gold" />
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-bold text-white leading-tight">{plan.name}</h2>
                  {plan.description && (
                    <p className="text-brand-gray text-sm mt-0.5 leading-snug">{plan.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-brand-gray/10">
                <span className="text-4xl font-extrabold text-brand-gold">
                  ₹{parseFloat(plan.price).toFixed(0)}
                </span>
                <span className="text-brand-gray text-sm">/ {plan.billing}</span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-brand-gray">
                    <Calendar size={14} /> Member since
                  </div>
                  <span className="text-white font-medium">
                    {member.joinedAt
                      ? new Date(member.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : '—'}
                  </span>
                </div>
                {member.trainer && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-brand-gray">
                      <User size={14} /> Trainer
                    </div>
                    <span className="text-white font-medium">{member.trainer.name}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-brand-gray">
                    <Clock size={14} /> Billing
                  </div>
                  <span className="text-white font-medium capitalize">{plan.billing}ly</span>
                </div>
              </div>

              <p className="text-brand-gray/50 text-xs mt-6 text-center leading-relaxed">
                To modify or upgrade your plan, speak with a staff member at the front desk.
              </p>
            </div>
          </motion.div>

          {/* ── Benefits ───────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-3 bg-brand-dark border border-brand-gray/10 rounded-2xl p-7"
          >
            <h3 className="text-xl font-heading font-bold text-white mb-6 flex items-center gap-2">
              <Star size={18} className="text-brand-gold" />
              What's Included
            </h3>

            {features.length > 0 ? (
              <ul className="space-y-3">
                {features.map((feature, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.05 }}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-brand-darker/50 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-brand-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 size={14} className="text-brand-gold" />
                    </div>
                    <span className="text-brand-gray leading-snug text-sm">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <CheckCircle2 size={32} className="text-brand-gray/30 mb-3" />
                <p className="text-brand-gray text-sm">No specific features listed for this plan.</p>
                <p className="text-brand-gray/50 text-xs mt-1">Contact the front desk for details.</p>
              </div>
            )}

            {/* Quick usage stats */}
            <div className="mt-8 pt-6 border-t border-brand-gray/10 grid grid-cols-2 gap-4">
              <div className="bg-brand-darker/50 rounded-xl p-4 text-center">
                <p className="text-brand-gray text-xs uppercase tracking-wider mb-1">Total Visits</p>
                <p className="text-2xl font-bold text-white">{member.attendance?.length || 0}</p>
              </div>
              <div className="bg-brand-darker/50 rounded-xl p-4 text-center">
                <p className="text-brand-gray text-xs uppercase tracking-wider mb-1">Progress Logs</p>
                <p className="text-2xl font-bold text-white">{member.progressLogs?.length || 0}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
