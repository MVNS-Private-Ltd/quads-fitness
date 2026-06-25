import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  StatusChip, EmptyState, TableFilterBar, PreviewDrawer,
  FormModal, ConfirmDialog, FormField, AvatarPlaceholder,
  inputCls, selectCls, textareaCls
} from '../../components/admin/SharedAdminUI';
import { FiEdit2, FiPlus, FiDollarSign, FiTrash2 } from 'react-icons/fi';
import { getPlans, createPlan, updatePlan, deletePlan } from '../../services/api';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: 'easeIn' } }
};

const EMPTY_FORM = { name: '', description: '', price: '', billing: 'Monthly', features: '', status: 'Active', featured: false };

const parseFeatures = (plan) => {
  try {
    const f = plan.features;
    return Array.isArray(f) ? f.join('\n') : (typeof f === 'string' ? JSON.parse(f).join('\n') : '');
  } catch { return plan.features || ''; }
};

export default function PlansPage() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    getPlans('?all=true').then(d => { setPlans(d); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (plan, e) => {
    e?.stopPropagation();
    setEditTarget(plan);
    setForm({
      name: plan.name || '',
      description: plan.description || '',
      price: plan.price?.toString() || '',
      billing: plan.billing || 'Monthly',
      features: parseFeatures(plan),
      status: plan.status || 'Active',
      featured: !!plan.featured,
    });
    setError('');
    setModalOpen(true);
    setSelectedPlan(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Plan name is required.'); return; }
    if (!form.price) { setError('Price is required.'); return; }
    setSubmitting(true);
    setError('');
    const payload = {
      ...form,
      price: parseFloat(form.price),
      features: JSON.stringify(form.features.split('\n').map(l => l.trim()).filter(Boolean)),
      featured: form.featured ? true : false,
    };
    try {
      if (editTarget) { await updatePlan(editTarget.id, payload); }
      else { await createPlan(payload); }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deletePlan(deleteTarget.id);
      setDeleteTarget(null);
      setSelectedPlan(null);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const featList = (plan) => {
    try {
      const f = plan.features;
      return Array.isArray(f) ? f : (typeof f === 'string' ? JSON.parse(f) : []);
    } catch { return []; }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-display text-white mb-2">Membership Plans</h2>
          <p className="text-brand-muted font-body">Manage pricing tiers and subscriptions.</p>
        </div>
        <button onClick={openCreate} className="px-6 py-3 bg-brand-gold text-brand-darker font-heading font-bold rounded-xl hover:bg-white transition-colors shadow-glow-gold flex items-center gap-2">
          <FiPlus size={18} /> Create Plan
        </button>
      </div>

      <div className="bg-brand-surface2 border border-white/5 rounded-2xl p-6">
        <TableFilterBar filters={[{ label: 'Billing Cycle', options: ['Monthly', 'Quarterly', 'Yearly'] }]} />

        {loading ? (
          <div className="text-brand-muted py-8 text-center animate-pulse">Loading plans...</div>
        ) : plans.length === 0 ? (
          <EmptyState
            title="No Plans Defined"
            message="Create membership plans for users to subscribe to."
            action={<button onClick={openCreate} className="px-6 py-2 bg-brand-gold text-brand-darker font-bold rounded-xl hover:bg-white transition-colors">Create Plan</button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-3 px-4 text-brand-muted font-body text-sm">Plan Name</th>
                  <th className="py-3 px-4 text-brand-muted font-body text-sm">Price</th>
                  <th className="py-3 px-4 text-brand-muted font-body text-sm">Billing</th>
                  <th className="py-3 px-4 text-brand-muted font-body text-sm">Status</th>
                  <th className="py-3 px-4 text-brand-muted font-body text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan, idx) => (
                  <motion.tr
                    key={plan.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => setSelectedPlan(plan)}
                  >
                    <td className="py-4 px-4">
                      <span className="text-white font-medium">{plan.name}</span>
                      {plan.featured && <span className="ml-2 text-xs bg-brand-gold/20 text-brand-gold px-1.5 py-0.5 rounded uppercase">Featured</span>}
                    </td>
                    <td className="py-4 px-4 text-brand-gold font-medium">${plan.price}</td>
                    <td className="py-4 px-4 text-brand-muted text-sm capitalize">{plan.billing}</td>
                    <td className="py-4 px-4"><StatusChip status={plan.status} /></td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={(e) => openEdit(plan, e)} className="p-2 text-brand-muted hover:text-brand-gold bg-brand-dark rounded-lg border border-white/5 hover:border-brand-gold/20 transition-colors" title="Edit">
                          <FiEdit2 size={15} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(plan); }} className="p-2 text-brand-muted hover:text-red-500 bg-brand-dark rounded-lg border border-white/5 hover:border-red-500/20 transition-colors" title="Delete">
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Preview Drawer */}
      <PreviewDrawer isOpen={!!selectedPlan} onClose={() => setSelectedPlan(null)} title="Plan Details">
        {selectedPlan && (
          <div className="space-y-5">
            <div className="bg-brand-dark p-6 rounded-2xl border border-brand-gold/20 flex flex-col items-center text-center">
              <FiDollarSign className="text-brand-gold/40 w-10 h-10 mb-2" />
              <h3 className="text-2xl font-display text-white mb-2">{selectedPlan.name}</h3>
              <div className="flex items-end gap-1 mb-3">
                <span className="text-4xl font-display text-brand-gold">${selectedPlan.price}</span>
                <span className="text-brand-muted text-sm mb-1">/{selectedPlan.billing?.toLowerCase()}</span>
              </div>
              <StatusChip status={selectedPlan.status} />
            </div>
            {selectedPlan.description && (
              <div>
                <label className="text-xs text-brand-muted uppercase tracking-wider mb-2 block">Description</label>
                <div className="bg-brand-dark p-4 rounded-xl border border-white/5 text-brand-platinum text-sm">{selectedPlan.description}</div>
              </div>
            )}
            <div>
              <label className="text-xs text-brand-muted uppercase tracking-wider mb-2 block">Features</label>
              <ul className="bg-brand-dark p-4 rounded-xl border border-white/5 space-y-2">
                {featList(selectedPlan).map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-brand-platinum text-sm">
                    <span className="text-brand-gold mt-0.5">•</span> {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4 border-t border-white/5 flex gap-3">
              <button onClick={(e) => openEdit(selectedPlan, e)} className="flex-1 py-3 bg-brand-gold text-brand-darker font-bold rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2">
                <FiEdit2 size={16} /> Edit Plan
              </button>
              <button onClick={() => setDeleteTarget(selectedPlan)} className="py-3 px-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-colors">
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        )}
      </PreviewDrawer>

      {/* Create / Edit Modal */}
      <FormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} title={editTarget ? 'Edit Plan' : 'Create Plan'} submitting={submitting}>
        {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{error}</p>}
        <FormField label="Plan Name" required>
          <input className={inputCls} value={form.name} onChange={set('name')} placeholder="e.g. Elite" />
        </FormField>
        <FormField label="Description">
          <textarea className={textareaCls} rows={2} value={form.description} onChange={set('description')} placeholder="Short description..." />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Price ($/mo)" required>
            <input type="number" className={inputCls} value={form.price} onChange={set('price')} placeholder="99" min="0" />
          </FormField>
          <FormField label="Billing Cycle">
            <select className={selectCls} value={form.billing} onChange={set('billing')}>
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Yearly</option>
            </select>
          </FormField>
        </div>
        <FormField label="Features (one per line)">
          <textarea className={textareaCls} rows={4} value={form.features} onChange={set('features')} placeholder={"Full gym access\nPersonal trainer\nNutrition plan"} />
        </FormField>
        <FormField label="Status">
          <select className={selectCls} value={form.status} onChange={set('status')}>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
          </select>
        </FormField>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.featured} onChange={set('featured')} className="w-4 h-4 accent-brand-gold" />
          <span className="text-brand-platinum text-sm">Mark as Featured (highlighted on website)</span>
        </label>
      </FormModal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Plan"
        message={`Permanently delete "${deleteTarget?.name}"? Members on this plan will be unaffected.`}
      />
    </motion.div>
  );
}
