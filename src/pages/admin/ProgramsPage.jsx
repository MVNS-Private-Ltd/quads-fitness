import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  StatusChip, EmptyState, TableFilterBar,
  FormModal, ConfirmDialog, FormField,
  inputCls, selectCls, textareaCls
} from '../../components/admin/SharedAdminUI';
import { FiList, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { getPrograms, createProgram, updateProgram, deleteProgram } from '../../services/api';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: 'easeIn' } }
};

const EMPTY_FORM = { title: '', description: '', duration: '', instructor: '', status: 'Active', featured: false };

export default function ProgramsPage() {
  const [programs, setPrograms] = useState([]);
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
    getPrograms('?all=true').then(data => {
      setPrograms(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (program, e) => {
    e?.stopPropagation();
    setEditTarget(program);
    setForm({
      title: program.title || '',
      description: program.description || '',
      duration: program.duration || '',
      instructor: program.instructor || '',
      status: program.status || 'Active',
      featured: !!program.featured,
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required.'); return; }
    setSubmitting(true);
    setError('');
    try {
      if (editTarget) {
        await updateProgram(editTarget.id, form);
      } else {
        await createProgram(form);
      }
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
      await deleteProgram(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-display text-white mb-2">Training Programs</h2>
          <p className="text-brand-muted font-body">Manage fitness programs and classes.</p>
        </div>
        <button onClick={openCreate} className="px-6 py-3 bg-brand-gold text-brand-darker font-heading font-bold rounded-xl hover:bg-white transition-colors shadow-glow-gold flex items-center gap-2">
          <FiPlus size={18} /> Create Program
        </button>
      </div>
      
      <div className="bg-brand-surface2 border border-white/5 rounded-2xl p-6">
        <TableFilterBar filters={[{ label: 'Status', options: ['Active', 'Draft'] }]} />

        {loading ? (
          <div className="text-brand-muted py-8 text-center animate-pulse">Loading programs...</div>
        ) : programs.length === 0 ? (
          <EmptyState
            title="No Programs"
            message="Start by creating a fitness program that will appear on the public website."
            icon={FiList}
            action={<button onClick={openCreate} className="px-6 py-2 bg-brand-gold text-brand-darker font-bold rounded-xl hover:bg-white transition-colors">Create Program</button>}
          />
        ) : (
          <div className="space-y-4">
            {programs.map((program, idx) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-brand-dark border border-white/5 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-white/10 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-lg font-heading text-white">{program.title}</h3>
                    <StatusChip status={program.status} />
                    {program.featured && <span className="bg-brand-gold/20 text-brand-gold text-xs px-2 py-0.5 rounded-full font-bold">Featured</span>}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 text-xs text-brand-muted">
                    {program.instructor && <span>Instructor: <span className="text-brand-platinum">{program.instructor}</span></span>}
                    {program.duration && <span>Duration: <span className="text-brand-platinum">{program.duration}</span></span>}
                    {program.description && <p className="text-brand-muted mt-1 text-sm truncate max-w-md">{program.description}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => openEdit(program, e)}
                    className="p-2 text-brand-muted hover:text-brand-gold transition-colors bg-brand-surface border border-white/5 hover:border-brand-gold/20 rounded-lg"
                    title="Edit"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(program)}
                    className="p-2 text-brand-muted hover:text-red-500 transition-colors bg-brand-surface border border-white/5 hover:border-red-500/20 rounded-lg"
                    title="Delete"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        title={editTarget ? 'Edit Program' : 'Create Program'}
        submitting={submitting}
      >
        {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{error}</p>}
        <FormField label="Program Title" required>
          <input className={inputCls} value={form.title} onChange={set('title')} placeholder="e.g. Hypertrophy Mastery" />
        </FormField>
        <FormField label="Description">
          <textarea className={textareaCls} rows={3} value={form.description} onChange={set('description')} placeholder="Brief description shown on website..." />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Duration">
            <input className={inputCls} value={form.duration} onChange={set('duration')} placeholder="e.g. 12 Weeks" />
          </FormField>
          <FormField label="Instructor">
            <input className={inputCls} value={form.instructor} onChange={set('instructor')} placeholder="Trainer name" />
          </FormField>
        </div>
        <FormField label="Status">
          <select className={selectCls} value={form.status} onChange={set('status')}>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
          </select>
        </FormField>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.featured} onChange={set('featured')} className="w-4 h-4 accent-brand-gold" />
          <span className="text-brand-platinum text-sm">Mark as Featured</span>
        </label>
      </FormModal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Program"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
      />
    </motion.div>
  );
}
