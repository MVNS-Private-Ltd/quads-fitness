import { useState, useEffect } from 'react';
import { getMyProgressLogs, addMyProgressLog, getCachedProgressLogs } from '../../services/memberApi';
import { Activity, Plus, TrendingUp, TrendingDown, Minus, Scale, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MemberProgressPage() {
  const [logs, setLogs] = useState(getCachedProgressLogs() || []);
  const [loading, setLoading] = useState(!getCachedProgressLogs());
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({ weight: '', height: '', notes: '' });

  useEffect(() => { loadProgress(); }, []);

  const loadProgress = async () => {
    try {
      const data = await getMyProgressLogs();
      setLogs(data);
    } catch (err) {
      setError('Failed to load progress logs.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      let calculatedBmi = null;
      if (formData.weight && formData.height) {
        const h = parseFloat(formData.height) / 100;
        const w = parseFloat(formData.weight);
        if (h > 0 && w > 0) calculatedBmi = w / (h * h);
      }

      const payload = {
        weight: formData.weight,
        bmi: calculatedBmi,
        notes: formData.notes
      };

      const newLog = await addMyProgressLog(payload);
      setLogs([newLog, ...logs]);
      setIsAdding(false);
      setFormData({ weight: '', height: '', notes: '' });
    } catch (err) {
      setError(err.message || 'Failed to add log.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6 pb-10">
        <div className="h-20 bg-brand-dark rounded-xl" />
        <div className="grid grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-brand-dark rounded-xl" />)}
        </div>
        <div className="h-80 bg-brand-dark rounded-xl" />
      </div>
    );
  }

  const latestLog = logs[0];
  const prevLog = logs[1];
  const weightChange = latestLog?.weight && prevLog?.weight
    ? (latestLog.weight - prevLog.weight).toFixed(1)
    : null;
  const bmiChange = latestLog?.bmi && prevLog?.bmi
    ? (latestLog.bmi - prevLog.bmi).toFixed(1)
    : null;

  const getBmiCategory = (bmi) => {
    if (!bmi) return { label: '—', color: 'text-brand-gray' };
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-400' };
    if (bmi < 25) return { label: 'Normal', color: 'text-green-400' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-400' };
    return { label: 'Obese', color: 'text-red-400' };
  };

  const bmiCat = getBmiCategory(latestLog?.bmi);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-1">Fitness Progress</h1>
          <p className="text-brand-gray">Track your weight and BMI over time.</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-brand-gold text-brand-darker font-bold px-5 py-2.5 rounded-xl hover:bg-brand-gold/90 transition-all hover:scale-105 active:scale-95 self-start sm:self-auto"
          >
            <Plus size={18} />
            Log Entry
          </button>
        )}
      </motion.div>

      {error && (
        <div className="bg-red-500/10 text-red-400 p-4 rounded-lg border border-red-500/25">{error}</div>
      )}

      {/* Stats Row */}
      {logs.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
          {[
            {
              label: 'Current Weight',
              value: latestLog?.weight ? `${latestLog.weight} kg` : '—',
              change: weightChange,
              icon: <Scale size={18} className="text-brand-gold" />
            },
            {
              label: 'Current BMI',
              value: latestLog?.bmi ? latestLog.bmi.toFixed(1) : '—',
              change: bmiChange,
              suffix: bmiCat.label,
              suffixColor: bmiCat.color,
              icon: <Activity size={18} className="text-brand-gold" />
            },
            {
              label: 'Total Logs',
              value: logs.length,
              sub: 'entries',
              icon: <TrendingUp size={18} className="text-brand-gold" />
            }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.2 }}
              className="bg-brand-dark border border-brand-gray/10 rounded-xl p-5"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-brand-darker rounded-lg">{stat.icon}</div>
                {stat.change !== null && stat.change !== undefined && (
                  <span className={`text-xs font-bold flex items-center gap-0.5 ${
                    parseFloat(stat.change) < 0 ? 'text-green-400' : parseFloat(stat.change) > 0 ? 'text-red-400' : 'text-brand-gray'
                  }`}>
                    {parseFloat(stat.change) < 0 ? <TrendingDown size={12} /> : parseFloat(stat.change) > 0 ? <TrendingUp size={12} /> : <Minus size={12} />}
                    {stat.change > 0 ? '+' : ''}{stat.change}
                  </span>
                )}
              </div>
              <p className="text-brand-gray text-xs uppercase tracking-wider mb-0.5">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              {stat.suffixColor ? (
                <p className={`text-xs font-medium ${stat.suffixColor}`}>{stat.suffix}</p>
              ) : stat.sub ? (
                <p className="text-xs text-brand-gray">{stat.sub}</p>
              ) : null}
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Entry Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-brand-dark border border-brand-gold/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-heading text-xl text-white font-bold">New Progress Entry</h3>
                <button
                  onClick={() => setIsAdding(false)}
                  className="text-brand-gray hover:text-white transition-colors p-1"
                >
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-brand-gray mb-2">
                    Weight (kg) <span className="text-brand-red">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    min="20"
                    max="500"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full bg-brand-darker border border-brand-gray/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-brand-gold transition-colors"
                    placeholder="e.g. 75.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-gray mb-2">
                    Height (cm) <span className="text-brand-gray/50 font-normal">(for BMI calculation)</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="50"
                    max="300"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    className="w-full bg-brand-darker border border-brand-gray/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-brand-gold transition-colors"
                    placeholder="e.g. 175"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-brand-gray mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows="2"
                    className="w-full bg-brand-darker border border-brand-gray/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-brand-gold transition-colors resize-none"
                    placeholder="How are you feeling today? Any milestones?"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-5 py-2.5 text-brand-gray hover:text-white transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-brand-gold text-brand-darker px-7 py-2.5 rounded-xl font-bold hover:bg-brand-gold/90 transition-all disabled:opacity-60 flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-brand-darker/30 border-t-brand-darker rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Entry'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-brand-dark border border-brand-gray/10 rounded-2xl overflow-hidden"
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-brand-gray/10 bg-brand-darker/20">
          <Activity size={18} className="text-brand-gold" />
          <h2 className="text-lg font-heading font-bold text-white">Log History</h2>
          {logs.length > 0 && (
            <span className="ml-auto text-xs text-brand-gray bg-brand-darker px-2.5 py-1 rounded-full">
              {logs.length} {logs.length === 1 ? 'entry' : 'entries'}
            </span>
          )}
        </div>

        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-3xl bg-brand-darker border border-brand-gray/10 flex items-center justify-center">
                <Scale size={40} className="text-brand-gray/30" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-9 h-9 bg-brand-gold/10 rounded-full flex items-center justify-center border border-brand-gold/20">
                <Plus size={16} className="text-brand-gold" />
              </div>
            </div>
            <h3 className="text-white font-bold text-xl mb-2">No Logs Yet</h3>
            <p className="text-brand-gray text-sm max-w-sm leading-relaxed mb-6">
              Start logging your weight and BMI to track your fitness journey.
              Consistent tracking is the key to reaching your goals!
            </p>
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 bg-brand-gold text-brand-darker font-bold px-6 py-3 rounded-xl hover:bg-brand-gold/90 transition-all hover:scale-105 active:scale-95"
            >
              <Plus size={18} />
              Log Your First Entry
            </button>
          </div>
        ) : (
          <div className="divide-y divide-brand-gray/5">
            {logs.map((log, idx) => {
              const prev = logs[idx + 1];
              const wDiff = log.weight && prev?.weight ? (log.weight - prev.weight).toFixed(1) : null;
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 hover:bg-brand-darker/20 transition-colors"
                >
                  <div>
                    <p className="text-brand-gold font-bold">
                      {new Date(log.date).toLocaleDateString('en-US', {
                        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </p>
                    {log.notes && <p className="text-brand-gray text-sm mt-0.5">{log.notes}</p>}
                  </div>
                  <div className="flex gap-8 items-center flex-shrink-0">
                    <div className="text-center">
                      <p className="text-brand-gray text-xs uppercase tracking-wider mb-0.5">Weight</p>
                      <p className="text-white font-bold text-lg">{log.weight ? `${log.weight} kg` : '—'}</p>
                      {wDiff !== null && (
                        <p className={`text-xs font-medium ${parseFloat(wDiff) < 0 ? 'text-green-400' : parseFloat(wDiff) > 0 ? 'text-red-400' : 'text-brand-gray'}`}>
                          {parseFloat(wDiff) > 0 ? '+' : ''}{wDiff} kg
                        </p>
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-brand-gray text-xs uppercase tracking-wider mb-0.5">BMI</p>
                      <p className="text-white font-bold text-lg">{log.bmi || '—'}</p>
                      {log.bmi && (
                        <p className={`text-xs font-medium ${getBmiCategory(log.bmi).color}`}>
                          {getBmiCategory(log.bmi).label}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );

}
