import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  StatusChip, EmptyState, TableFilterBar, PreviewDrawer,
  FormModal, ConfirmDialog, FormField,
  inputCls, selectCls, textareaCls
} from '../../components/admin/SharedAdminUI';
import { FiTag, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { getOffers, createOffer, updateOffer, deleteOffer } from '../../services/api';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: 'easeIn' } }
};

const EMPTY_FORM = { title: '', description: '', badgeText: '', validUntil: '', status: 'Active', featured: false };

export default function OffersPage() {
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [offers, setOffers] = useState([]);
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
    getOffers('?all=true').then(d => { setOffers(d); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (offer, e) => {
    e?.stopPropagation();
    setEditTarget(offer);
    setForm({
      title: offer.title || '',
      description: offer.description || '',
      badgeText: offer.badgeText || '',
      validUntil: offer.validUntil ? offer.validUntil.split('T')[0] : '',
      status: offer.status || 'Active',
      featured: !!offer.featured,
    });
    setError('');
    setModalOpen(true);
    setSelectedOffer(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required.'); return; }
    setSubmitting(true);
    setError('');
    try {
      if (editTarget) { await updateOffer(editTarget.id, form); }
      else { await createOffer(form); }
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
      await deleteOffer(deleteTarget.id);
      setDeleteTarget(null);
      setSelectedOffer(null);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const formatDate = (d) => d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Ongoing';

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-display text-white mb-2">Offers & Promos</h2>
          <p className="text-brand-muted font-body">Manage discounts and promotional banners.</p>
        </div>
        <button onClick={openCreate} className="px-6 py-3 bg-brand-gold text-brand-darker font-heading font-bold rounded-xl hover:bg-white transition-colors shadow-glow-gold flex items-center gap-2">
          <FiPlus size={18} /> Create Offer
        </button>
      </div>

      <div className="bg-brand-surface2 border border-white/5 rounded-2xl p-6">
        <TableFilterBar filters={[{ label: 'Status', options: ['Active', 'Draft', 'Expired'] }]} />

        {loading ? (
          <div className="text-brand-muted py-8 text-center animate-pulse">Loading offers...</div>
        ) : offers.length === 0 ? (
          <EmptyState
            title="No Active Offers"
            message="Create promo offers to boost member sign-ups."
            icon={FiTag}
            action={<button onClick={openCreate} className="px-6 py-2 bg-brand-gold text-brand-darker font-bold rounded-xl hover:bg-white transition-colors">Create Offer</button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-3 px-4 text-brand-muted font-body text-sm">Offer Name</th>
                  <th className="py-3 px-4 text-brand-muted font-body text-sm">Badge</th>
                  <th className="py-3 px-4 text-brand-muted font-body text-sm">Valid Until</th>
                  <th className="py-3 px-4 text-brand-muted font-body text-sm">Status</th>
                  <th className="py-3 px-4 text-brand-muted font-body text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer, idx) => (
                  <motion.tr
                    key={offer.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => setSelectedOffer(offer)}
                  >
                    <td className="py-4 px-4 text-white font-medium">{offer.title}</td>
                    <td className="py-4 px-4">
                      {offer.badgeText
                        ? <span className="bg-brand-dark border border-brand-gold/30 text-brand-gold px-2 py-1 rounded text-xs font-mono">{offer.badgeText}</span>
                        : <span className="text-brand-muted text-xs">—</span>}
                    </td>
                    <td className="py-4 px-4 text-brand-muted text-sm">{formatDate(offer.validUntil)}</td>
                    <td className="py-4 px-4"><StatusChip status={offer.status} /></td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={(e) => openEdit(offer, e)} className="p-2 text-brand-muted hover:text-brand-gold bg-brand-dark rounded-lg border border-white/5 hover:border-brand-gold/20 transition-colors" title="Edit">
                          <FiEdit2 size={15} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(offer); }} className="p-2 text-brand-muted hover:text-red-500 bg-brand-dark rounded-lg border border-white/5 hover:border-red-500/20 transition-colors" title="Delete">
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
      <PreviewDrawer isOpen={!!selectedOffer} onClose={() => setSelectedOffer(null)} title="Offer Details">
        {selectedOffer && (
          <div className="space-y-5">
            <div className="bg-brand-dark p-6 rounded-2xl border border-brand-gold/20 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute -top-4 -right-4 text-brand-gold/10"><FiTag size={100} /></div>
              <h3 className="text-2xl font-display text-white mb-3 relative z-10">{selectedOffer.title}</h3>
              {selectedOffer.badgeText && (
                <span className="bg-brand-surface2 border border-brand-gold/30 text-brand-gold px-4 py-2 rounded-lg font-mono text-lg tracking-widest relative z-10">{selectedOffer.badgeText}</span>
              )}
            </div>
            {selectedOffer.description && (
              <div className="bg-brand-dark p-4 rounded-xl border border-white/5">
                <p className="text-brand-platinum text-sm">{selectedOffer.description}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-brand-dark p-4 rounded-xl border border-white/5">
                <span className="text-xs text-brand-muted block mb-1">Status</span>
                <StatusChip status={selectedOffer.status} />
              </div>
              <div className="bg-brand-dark p-4 rounded-xl border border-white/5">
                <span className="text-xs text-brand-muted block mb-1">Expires</span>
                <span className="text-brand-platinum">{formatDate(selectedOffer.validUntil)}</span>
              </div>
            </div>
            <div className="pt-4 border-t border-white/5 flex gap-3">
              <button onClick={(e) => openEdit(selectedOffer, e)} className="flex-1 py-3 bg-brand-gold text-brand-darker font-bold rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2">
                <FiEdit2 size={16} /> Edit Offer
              </button>
              <button onClick={() => setDeleteTarget(selectedOffer)} className="py-3 px-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-colors">
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        )}
      </PreviewDrawer>

      {/* Create / Edit Modal */}
      <FormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} title={editTarget ? 'Edit Offer' : 'Create Offer'} submitting={submitting}>
        {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{error}</p>}
        <FormField label="Offer Title" required>
          <input className={inputCls} value={form.title} onChange={set('title')} placeholder="e.g. Summer Special" />
        </FormField>
        <FormField label="Description">
          <textarea className={textareaCls} rows={2} value={form.description} onChange={set('description')} placeholder="What's included in this offer..." />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Badge Text">
            <input className={inputCls} value={form.badgeText} onChange={set('badgeText')} placeholder="e.g. 50% OFF" />
          </FormField>
          <FormField label="Valid Until">
            <input type="date" className={inputCls} value={form.validUntil} onChange={set('validUntil')} />
          </FormField>
        </div>
        <FormField label="Status">
          <select className={selectCls} value={form.status} onChange={set('status')}>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Expired">Expired</option>
          </select>
        </FormField>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.featured} onChange={set('featured')} className="w-4 h-4 accent-brand-gold" />
          <span className="text-brand-platinum text-sm">Feature this offer prominently</span>
        </label>
      </FormModal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Offer"
        message={`Permanently delete "${deleteTarget?.title}"? This cannot be undone.`}
      />
    </motion.div>
  );
}
