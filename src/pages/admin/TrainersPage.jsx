import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  StatusChip, EmptyState, TableFilterBar, PreviewDrawer,
  FormModal, ConfirmDialog, FormField, AvatarPlaceholder,
  inputCls, selectCls, textareaCls
} from '../../components/admin/SharedAdminUI';
import { FiEdit2, FiUserPlus, FiEye, FiTrash2, FiInstagram } from 'react-icons/fi';
import { getTrainers, createTrainer, updateTrainer, deleteTrainer } from '../../services/api';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: 'easeIn' } }
};

const EMPTY_FORM = { name: '', specialty: '', bio: '', instagram: '', status: 'Active', featured: false, image: null };

export default function TrainersPage() {
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [trainers, setTrainers] = useState([]);
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
    getTrainers('?all=true').then(d => { setTrainers(d); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (trainer, e) => {
    e?.stopPropagation();
    setEditTarget(trainer);
    setForm({
      name: trainer.name || '',
      specialty: trainer.specialty || '',
      bio: trainer.bio || '',
      instagram: trainer.instagram || '',
      status: trainer.status || 'Active',
      featured: !!trainer.featured,
      image: null
    });
    setError('');
    setModalOpen(true);
    setSelectedTrainer(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Name is required.'); return; }
    setSubmitting(true);
    setError('');
    const payload = new FormData();
    Object.keys(form).forEach(key => {
      if (form[key] !== null && form[key] !== undefined && form[key] !== '') {
        if (key === 'featured') {
          payload.append(key, form[key] ? 'true' : '');
        } else {
          payload.append(key, form[key]);
        }
      }
    });

    try {
      if (editTarget) { await updateTrainer(editTarget.id, payload); }
      else { await createTrainer(payload); }
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
      await deleteTrainer(deleteTarget.id);
      setDeleteTarget(null);
      setSelectedTrainer(null);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const set = (field) => (e) => setForm(f => ({ 
    ...f, 
    [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.type === 'file' ? e.target.files[0] : e.target.value 
  }));

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-display text-white mb-2">Trainers & Staff</h2>
          <p className="text-brand-muted font-body">Manage fitness instructors and their assignments.</p>
        </div>
        <button onClick={openCreate} className="px-6 py-3 bg-brand-gold text-brand-darker font-heading font-bold rounded-xl hover:bg-white transition-colors shadow-glow-gold flex items-center gap-2">
          <FiUserPlus size={18} /> Add Trainer
        </button>
      </div>

      <div className="bg-brand-surface2 border border-white/5 rounded-2xl p-6">
        <TableFilterBar filters={[{ label: 'Status', options: ['Active', 'Inactive'] }]} />

        {loading ? (
          <div className="text-brand-muted py-8 text-center animate-pulse">Loading trainers...</div>
        ) : trainers.length === 0 ? (
          <EmptyState
            title="No Trainers Yet"
            message="Add your first trainer to start assigning members."
            action={<button onClick={openCreate} className="px-6 py-2 bg-brand-gold text-brand-darker font-bold rounded-xl hover:bg-white transition-colors">Add Trainer</button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-3 px-4 text-brand-muted font-body text-sm">Trainer</th>
                  <th className="py-3 px-4 text-brand-muted font-body text-sm">Specialty</th>
                  <th className="py-3 px-4 text-brand-muted font-body text-sm">Status</th>
                  <th className="py-3 px-4 text-brand-muted font-body text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {trainers.map((trainer, idx) => (
                  <motion.tr
                    key={trainer.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => setSelectedTrainer(trainer)}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {trainer.imageUrl ? (
                          <img src={trainer.imageUrl} alt={trainer.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                        ) : (
                          <AvatarPlaceholder name={trainer.name} size="sm" />
                        )}
                        <div>
                          <p className="text-white font-medium flex items-center gap-2">
                            {trainer.name}
                            {trainer.featured && <span className="text-[10px] bg-brand-gold/20 text-brand-gold px-1.5 py-0.5 rounded uppercase">Featured</span>}
                          </p>
                          {trainer.instagram && <p className="text-brand-muted text-xs truncate max-w-[160px]">{trainer.instagram}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-brand-platinum text-sm">{trainer.specialty || '—'}</td>
                    <td className="py-4 px-4"><StatusChip status={trainer.status} /></td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={(e) => openEdit(trainer, e)} className="p-2 text-brand-muted hover:text-brand-gold bg-brand-dark rounded-lg border border-white/5 hover:border-brand-gold/20 transition-colors" title="Edit">
                          <FiEdit2 size={15} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(trainer); }} className="p-2 text-brand-muted hover:text-red-500 bg-brand-dark rounded-lg border border-white/5 hover:border-red-500/20 transition-colors" title="Delete">
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
      <PreviewDrawer isOpen={!!selectedTrainer} onClose={() => setSelectedTrainer(null)} title="Trainer Profile">
        {selectedTrainer && (
          <div className="space-y-5">
            <div className="flex items-center gap-4 border-b border-white/5 pb-5">
              {selectedTrainer.imageUrl ? (
                <img src={selectedTrainer.imageUrl} alt={selectedTrainer.name} className="w-20 h-20 rounded-full object-cover border border-brand-gold/40" />
              ) : (
                <AvatarPlaceholder name={selectedTrainer.name} size="xl" />
              )}
              <div>
                <h3 className="text-2xl font-display text-white">{selectedTrainer.name}</h3>
                <p className="text-brand-gold font-medium">{selectedTrainer.specialty}</p>
                <div className="mt-1"><StatusChip status={selectedTrainer.status} /></div>
              </div>
            </div>
            <div>
              <label className="text-xs text-brand-muted uppercase tracking-wider mb-2 block">Bio</label>
              <div className="bg-brand-dark p-4 rounded-xl border border-white/5">
                <p className="text-brand-platinum text-sm leading-relaxed">{selectedTrainer.bio || 'No biography provided.'}</p>
              </div>
            </div>
            {selectedTrainer.instagram && (
              <div>
                <label className="text-xs text-brand-muted uppercase tracking-wider mb-2 block">Instagram</label>
                <div className="flex items-center gap-3 bg-brand-dark p-3 rounded-xl border border-white/5">
                  <FiInstagram className="text-brand-muted shrink-0" />
                  <a href={selectedTrainer.instagram} target="_blank" rel="noreferrer" className="text-brand-gold text-sm hover:underline truncate">{selectedTrainer.instagram}</a>
                </div>
              </div>
            )}
            <div className="pt-4 border-t border-white/5 flex gap-3">
              <button onClick={(e) => openEdit(selectedTrainer, e)} className="flex-1 py-3 bg-brand-dark border border-white/10 text-white rounded-xl hover:border-brand-gold transition-colors flex items-center justify-center gap-2">
                <FiEdit2 size={16} /> Edit Profile
              </button>
              <button onClick={() => setDeleteTarget(selectedTrainer)} className="py-3 px-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-colors">
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        )}
      </PreviewDrawer>

      {/* Create / Edit Modal */}
      <FormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} title={editTarget ? 'Edit Trainer' : 'Add Trainer'} submitting={submitting}>
        {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{error}</p>}
        <FormField label="Full Name" required>
          <input className={inputCls} value={form.name} onChange={set('name')} placeholder="e.g. Marcus Riley" />
        </FormField>
        <FormField label="Profile Image">
          <input type="file" className={inputCls} onChange={set('image')} accept="image/*" />
        </FormField>
        <FormField label="Specialty">
          <input className={inputCls} value={form.specialty} onChange={set('specialty')} placeholder="e.g. Strength & Conditioning" />
        </FormField>
        <FormField label="Bio">
          <textarea className={textareaCls} rows={3} value={form.bio} onChange={set('bio')} placeholder="Short professional background..." />
        </FormField>
        <FormField label="Instagram / Social Link">
          <input className={inputCls} value={form.instagram} onChange={set('instagram')} placeholder="https://instagram.com/..." />
        </FormField>
        <FormField label="Status">
          <select className={selectCls} value={form.status} onChange={set('status')}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </FormField>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.featured} onChange={set('featured')} className="w-4 h-4 accent-brand-gold" />
          <span className="text-brand-platinum text-sm">Feature on website</span>
        </label>
      </FormModal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Remove Trainer"
        message={`Remove "${deleteTarget?.name}" from the system? This cannot be undone.`}
      />
    </motion.div>
  );
}
