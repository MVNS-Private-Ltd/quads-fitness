import { useState, useEffect } from 'react';
import { getMemberDietPlans, getCachedDietPlans } from '../../services/memberApi';
import { motion } from 'framer-motion';
import { Salad, Flame, UtensilsCrossed, Clock, ChevronDown, ChevronUp, Zap, Target } from 'lucide-react';

const GOAL_META = {
  'Muscle Gain':  { color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   icon: Zap },
  'Fat Loss':     { color: 'text-orange-400',  bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: Flame },
  'Maintenance':  { color: 'text-green-400',   bg: 'bg-green-500/10',  border: 'border-green-500/20',  icon: Target },
};

function getGoalMeta(goalType) {
  return GOAL_META[goalType] || { color: 'text-brand-gold', bg: 'bg-brand-gold/10', border: 'border-brand-gold/20', icon: Salad };
}

function DietCard({ plan, index }) {
  const [expanded, setExpanded] = useState(false);
  const meta = getGoalMeta(plan.goalType);
  const GoalIcon = meta.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bg-brand-dark border border-brand-gray/10 rounded-2xl overflow-hidden hover:border-brand-gold/20 transition-all duration-300 group"
    >
      {/* Card Header */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl ${meta.bg} ${meta.border} border flex items-center justify-center flex-shrink-0`}>
              <GoalIcon size={20} className={meta.color} />
            </div>
            <div>
              <h3 className="text-white font-heading font-bold text-lg leading-tight">{plan.title}</h3>
              {plan.goalType && (
                <span className={`text-xs font-semibold uppercase tracking-wider ${meta.color}`}>
                  {plan.goalType}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap gap-3 mb-4">
          {plan.calories && (
            <div className="flex items-center gap-1.5 bg-brand-darker/60 rounded-lg px-3 py-1.5">
              <Flame size={13} className="text-orange-400" />
              <span className="text-xs text-brand-gray font-medium">{plan.calories} kcal</span>
            </div>
          )}
          {plan.meals && (
            <div className="flex items-center gap-1.5 bg-brand-darker/60 rounded-lg px-3 py-1.5">
              <UtensilsCrossed size={13} className="text-brand-gold" />
              <span className="text-xs text-brand-gray font-medium">{plan.meals} meals/day</span>
            </div>
          )}
        </div>

        {/* Description preview */}
        {plan.description && (
          <p className={`text-brand-gray text-sm leading-relaxed ${!expanded ? 'line-clamp-2' : ''}`}>
            {plan.description}
          </p>
        )}

        {/* Expand toggle */}
        {plan.description && plan.description.length > 100 && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1 mt-3 text-xs text-brand-gold hover:text-brand-gold/80 font-medium transition-colors"
          >
            {expanded ? (
              <><ChevronUp size={14} /> Show less</>
            ) : (
              <><ChevronDown size={14} /> Read more</>
            )}
          </button>
        )}
      </div>

      {/* Bottom accent bar */}
      <div className={`h-1 w-0 group-hover:w-full transition-all duration-500 ${meta.bg.replace('/10', '/40')}`} />
    </motion.div>
  );
}

export default function MemberDietPage() {
  const [plans, setPlans] = useState(getCachedDietPlans() || []);
  const [loading, setLoading] = useState(!getCachedDietPlans());
  const [error, setError] = useState('');

  useEffect(() => {
    if (getCachedDietPlans()) return; // already cached, no need to refetch
    getMemberDietPlans()
      .then(data => { setPlans(data); })
      .catch(() => setError('Failed to load diet plans. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 pb-10">
        <div className="h-10 w-48 bg-brand-dark rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-brand-dark rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-heading font-bold text-white mb-1">Diet Plans</h1>
        <p className="text-brand-gray text-sm">
          Nutrition plans curated by our trainers to support your fitness goals.
        </p>
      </motion.div>

      {error && (
        <div className="bg-red-500/10 text-red-400 px-4 py-3 rounded-xl border border-red-500/20 text-sm">
          {error}
        </div>
      )}

      {plans.length === 0 && !error ? (
        /* ── EMPTY STATE ── */
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-24 px-8 text-center bg-brand-dark border border-brand-gray/10 rounded-2xl"
        >
          <div className="w-20 h-20 rounded-3xl bg-brand-darker border border-brand-gray/10 flex items-center justify-center mb-6">
            <Salad size={36} className="text-brand-gray/30" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No Plans Yet</h2>
          <p className="text-brand-gray max-w-xs text-sm leading-relaxed">
            Your trainers haven't published any diet plans yet. Check back soon or speak to a staff member.
          </p>
        </motion.div>
      ) : (
        <>
          {/* Goal filter summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-3"
          >
            {Object.entries(GOAL_META).map(([goal, meta]) => {
              const count = plans.filter(p => p.goalType === goal).length;
              if (count === 0) return null;
              const Icon = meta.icon;
              return (
                <div key={goal} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${meta.bg} ${meta.border} ${meta.color}`}>
                  <Icon size={12} />
                  {goal} · {count}
                </div>
              );
            })}
          </motion.div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {plans.map((plan, i) => (
              <DietCard key={plan.id} plan={plan} index={i} />
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-brand-gray/50 text-xs pt-4"
          >
            For a personalised plan, speak to your trainer at the front desk.
          </motion.p>
        </>
      )}
    </div>
  );
}
