import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatusChip, EmptyState, TableFilterBar } from '../../components/admin/SharedAdminUI';
import { FiClipboard, FiEdit2, FiTrash2, FiX, FiPlus } from 'react-icons/fi';
import { getDietPlans, createDietPlan, updateDietPlan, deleteDietPlan } from '../../services/api';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: 'easeIn' } }
};

const EMPTY_FORM = { title: '', goalType: '', calories: '', meals: 3, description: '', status: 'Active' };

export default function DietPlansPage() {
  const [dietPlans, setDietPlans] = useState([]);
  const [allPlans, setAllPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState('');
  const [goalFilter, setGoalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchPlans = () => {
    getDietPlans('?all=true').then(data => {
      setAllPlans(data);
      setDietPlans(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => { fetchPlans(); }, []);

  // Filtering
  useEffect(() => {
    let filtered = allPlans;
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(p => p.title?.toLowerCase().includes(q) || p.goalType?.toLowerCase().includes(q));
    }
    if (goalFilter) filtered = filtered.filter(p => (p.goalType || '').toLowerCase().includes(goalFilter.toLowerCase()));
    if (statusFilter) filtered = filtered.filter(p => p.status === statusFilter);
    setDietPlans(filtered);
  }, [search, goalFilter, statusFilter, allPlans]);

  const openCreate = () => {
    setEditingPlan(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (plan, e) => {
    e.stopPropagation();
    setEditingPlan(plan);
    setForm({ title: plan.title, goalType: plan.goalType || '', calories: plan.calories || '', meals: plan.meals || 3, description: plan.description || '', status: plan.status || 'Active' });
    setShowModal(true);
  };

  const handleDelete = async (plan, e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete "${plan.title}"? This cannot be undone.`)) return;
    try {
      await deleteDietPlan(plan.id);
      setAllPlans(prev => prev.filter(p => p.id !== plan.id));
    } catch (err) {
      alert('Failed to delete diet plan.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return alert('Title is required.');
    setSaving(true);
    try {
      if (editingPlan) {
        const updated = await updateDietPlan(editingPlan.id, form);
        setAllPlans(prev => prev.map(p => p.id === editingPlan.id ? updated : p));
      } else {
        const created = await createDietPlan(form);
        setAllPlans(prev => [created, ...prev]);
      }
      setShowModal(false);
    } catch (err) {
      alert('Failed to save diet plan. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-display text-white mb-2">Diet Plans</h2>
          <p className="text-brand-muted font-body">Manage nutrition and meal plans for members.</p>
        </div>
        <button onClick={openCreate} className="px-6 py-3 bg-brand-gold text-brand-darker font-heading font-bold rounded-xl hover:bg-white transition-colors shadow-glow-gold flex items-center gap-2">
          <FiPlus size={18} /> Create Diet Plan
        </button>
      </div>

      <div className="bg-brand-surface2 border border-white/5 rounded-2xl p-6">
        <TableFilterBar
          onSearch={setSearch}
          filters={[
            { label: 'Goal Type', options: ['Muscle Gain', 'Fat Loss', 'Maintenance'], onChange: (e) => setGoalFilter(e.target.value) },
            { label: 'Status', options: ['Active', 'Draft'], onChange: (e) => setStatusFilter(e.target.value) }
          ]}
        />

        {loading ? (
          <div className="text-brand-muted py-8 text-center">Loading diet plans...</div>
        ) : dietPlans.length === 0 ? (
          <EmptyState title="No Diet Plans" message="Create nutrition plans for your members." icon={FiClipboard}
            action={<button onClick={openCreate} className="px-6 py-2 bg-brand-dark border border-white/10 text-white rounded-xl hover:border-brand-gold transition-colors">Create Plan</button>}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dietPlans.map((plan, idx) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                key={plan.id}
                className="bg-brand-dark border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-brand-gold/30 transition-colors"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <StatusChip status={plan.status} />
                    <div className="flex items-center space-x-2">
                      <button onClick={(e) => openEdit(plan, e)} className="p-1.5 text-brand-muted hover:text-brand-gold transition-colors rounded-md hover:bg-white/5" title="Edit">
                        <FiEdit2 size={16} />
                      </button>
                      <button onClick={(e) => handleDelete(plan, e)} className="p-1.5 text-brand-muted hover:text-red-400 transition-colors rounded-md hover:bg-white/5" title="Delete">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-xl font-heading text-white mb-1">{plan.title}</h3>
                  <p className="text-brand-gold text-sm font-medium mb-4">{plan.goalType || 'General'}</p>
                  {plan.description && (
                    <p className="text-brand-muted text-sm mb-4 line-clamp-2">{plan.description}</p>
                  )}
                  <div className="space-y-2 text-sm text-brand-muted">
                    <div className="flex justify-between">
                      <span>Daily Calories:</span>
                      <span className="text-white">{plan.calories || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Meals per Day:</span>
                      <span className="text-white">{plan.meals || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                <button onClick={(e) => openEdit(plan, e)} className="w-full mt-6 py-2.5 text-sm font-medium text-brand-gold hover:text-white transition-colors border border-brand-gold/20 hover:border-brand-gold rounded-xl">
                  Edit Details
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-brand-surface2 border border-white/10 rounded-2xl p-8 w-full max-w-lg shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-display text-white">{editingPlan ? 'Edit Diet Plan' : 'Create Diet Plan'}</h3>
                  <button onClick={() => setShowModal(false)} className="text-brand-muted hover:text-white transition-colors">
                    <FiX size={24} />
                  </button>
                </div>
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="text-xs text-brand-muted uppercase tracking-wider mb-1 block">Plan Title *</label>
                    <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold transition-colors"
                      placeholder="e.g. High Protein Muscle Plan" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-brand-muted uppercase tracking-wider mb-1 block">Goal Type</label>
                      <select value={form.goalType} onChange={e => setForm(f => ({ ...f, goalType: e.target.value }))}
                        className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold transition-colors appearance-none">
                        <option value="">Select goal</option>
                        <option value="Muscle Gain">Muscle Gain</option>
                        <option value="Fat Loss">Fat Loss</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-brand-muted uppercase tracking-wider mb-1 block">Status</label>
                      <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                        className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold transition-colors appearance-none">
                        <option value="Active">Active</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-brand-muted uppercase tracking-wider mb-1 block">Daily Calories</label>
                      <input value={form.calories} onChange={e => setForm(f => ({ ...f, calories: e.target.value }))}
                        className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold transition-colors"
                        placeholder="e.g. 2500 kcal" />
                    </div>
                    <div>
                      <label className="text-xs text-brand-muted uppercase tracking-wider mb-1 block">Meals per Day</label>
                      <input type="number" min={1} max={10} value={form.meals} onChange={e => setForm(f => ({ ...f, meals: e.target.value }))}
                        className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-brand-muted uppercase tracking-wider mb-1 block">Description</label>
                    <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                      className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold transition-colors resize-none"
                      placeholder="Brief description of this plan..." />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowModal(false)}
                      className="flex-1 py-3 bg-brand-dark border border-white/10 text-white rounded-xl hover:bg-white/5 transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={saving}
                      className="flex-1 py-3 bg-brand-gold text-brand-darker font-bold rounded-xl hover:bg-white transition-colors disabled:opacity-50">
                      {saving ? 'Saving...' : (editingPlan ? 'Save Changes' : 'Create Plan')}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
