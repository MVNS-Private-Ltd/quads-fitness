import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  StatusChip, EmptyState, TableFilterBar, PreviewDrawer,
  FormModal, ConfirmDialog, FormField, AvatarPlaceholder,
  inputCls, selectCls
} from '../../components/admin/SharedAdminUI';
import { FiUsers, FiPlus, FiEdit2, FiTrash2, FiEye, FiRefreshCw } from 'react-icons/fi';
import { getMembers, createMember, updateMember, deleteMember, getTrainers, getPlans } from '../../services/api';
import MemberProfileDrawer from '../../components/admin/MemberProfileDrawer';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: 'easeIn' } }
};

const EMPTY_FORM = { 
  name: '', 
  email: '', 
  phone: '', 
  status: 'Active', 
  planId: '', 
  age: '',
  gender: '',
  joinedAt: new Date().toISOString().split('T')[0],
  membershipExpiry: '',
  healthNotes: ''
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [renewTarget, setRenewTarget] = useState(null);
  const [renewPlanId, setRenewPlanId] = useState('');
  const [error, setError] = useState('');

  const [trainers, setTrainers] = useState([]);
  const [plans, setPlans] = useState([]);

  const load = () => {
    setLoading(true);
    Promise.all([getMembers(), getTrainers(), getPlans()])
      .then(([m, t, p]) => {
        setUsers(m);
        setTrainers(t);
        setPlans(p);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (user, e) => {
    e?.stopPropagation();
    setEditTarget(user);
    setForm({ 
      name: user.name || '', 
      email: user.email || '', 
      phone: user.phone || '', 
      status: user.status || 'Active',
      planId: user.planId || '',
      age: user.age || '',
      gender: user.gender || '',
      joinedAt: user.joinedAt ? new Date(user.joinedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      membershipExpiry: user.membershipExpiry ? new Date(user.membershipExpiry).toISOString().split('T')[0] : '',
      healthNotes: user.healthNotes || ''
    });
    setError('');
    setModalOpen(true);
    setSelectedUserId(null);
  };

  const handleRenewPrompt = (user, e) => {
    e.stopPropagation();
    setRenewTarget(user);
    setRenewPlanId(user.planId || '');
  };

  const submitRenew = async (e) => {
    e.preventDefault();
    if (!renewPlanId) { setError('Select a plan'); return; }
    
    const plan = plans.find(p => p.id === Number(renewPlanId));
    const now = new Date();
    const joinedAt = now.toISOString().split('T')[0];
    
    let monthsToAdd = 1;
    if (plan) {
      const planNameLower = plan.name.toLowerCase();
      if (planNameLower.includes('3 months')) monthsToAdd = 3;
      if (planNameLower.includes('6 months')) monthsToAdd = 6;
      if (planNameLower.includes('12 months') || planNameLower.includes('1 year')) monthsToAdd = 12;
      if (planNameLower.includes('13 months')) monthsToAdd = 13;
    }
    now.setMonth(now.getMonth() + monthsToAdd);
    const membershipExpiry = now.toISOString().split('T')[0];

    setSubmitting(true);
    try {
      await updateMember(renewTarget.id, {
        planId: renewPlanId,
        joinedAt,
        membershipExpiry,
        status: 'Active'
      });
      setRenewTarget(null);
      load();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Name is required.'); return; }
    if (!form.email.trim()) { setError('Email is required.'); return; }
    if (!form.phone.trim()) { setError('Phone number is required.'); return; }
    if (!form.age) { setError('Age is required.'); return; }
    if (!form.gender) { setError('Gender is required.'); return; }
    if (!form.planId) { setError('Membership plan is required.'); return; }
    if (!form.joinedAt) { setError('Start date is required.'); return; }
    if (!form.membershipExpiry) { setError('Expiry date is required.'); return; }

    setSubmitting(true);
    setError('');
    try {
      if (editTarget) { await updateMember(editTarget.id, form); }
      else { await createMember(form); }
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
      await deleteMember(deleteTarget.id);
      setDeleteTarget(null);
      setSelectedUserId(null);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const set = (field) => (e) => {
    const value = e.target.value;
    setForm(f => {
      const newForm = { ...f, [field]: value };
      
      // Auto-calculate expiry date when plan changes
      if (field === 'planId' && value && newForm.joinedAt) {
        const plan = plans.find(p => p.id === Number(value));
        if (plan) {
          const startDate = new Date(newForm.joinedAt);
          let monthsToAdd = 1; // default fallback
          
          const planNameLower = plan.name.toLowerCase();
          if (planNameLower.includes('3 months')) monthsToAdd = 3;
          if (planNameLower.includes('6 months')) monthsToAdd = 6;
          if (planNameLower.includes('12 months') || planNameLower.includes('1 year')) monthsToAdd = 12;
          if (planNameLower.includes('13 months')) monthsToAdd = 13;
          if (planNameLower.includes('1 month')) monthsToAdd = 1;
          
          startDate.setMonth(startDate.getMonth() + monthsToAdd);
          newForm.membershipExpiry = startDate.toISOString().split('T')[0];
        }
      }
      return newForm;
    });
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-display text-white mb-2">Members Directory</h2>
          <p className="text-brand-muted font-body">Manage all your fitness center members.</p>
        </div>
        <button onClick={openCreate} className="px-6 py-3 bg-brand-gold text-brand-darker font-heading font-bold rounded-xl hover:bg-white transition-colors shadow-glow-gold flex items-center gap-2">
          <FiPlus size={18} /> Add Member
        </button>
      </div>
      
      <div className="bg-brand-surface2 border border-white/5 rounded-2xl overflow-hidden p-6">
        <TableFilterBar filters={[{ label: 'Status', options: ['Active', 'Inactive'] }]} />

        {loading ? (
          <div className="text-brand-muted py-8 text-center animate-pulse">Loading members...</div>
        ) : users.length === 0 ? (
          <EmptyState
            title="No Members Found"
            message="You don't have any registered members yet."
            icon={FiUsers}
            action={<button onClick={openCreate} className="px-6 py-2 bg-brand-gold text-brand-darker font-bold rounded-xl hover:bg-white transition-colors">Add Member</button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-dark border-b border-white/10">
                  <th className="py-4 px-6 text-brand-muted font-body text-sm font-medium uppercase tracking-wider">Member</th>
                  <th className="py-4 px-6 text-brand-muted font-body text-sm font-medium uppercase tracking-wider">Plan</th>
                  <th className="py-4 px-6 text-brand-muted font-body text-sm font-medium uppercase tracking-wider">Joined</th>
                  <th className="py-4 px-6 text-brand-muted font-body text-sm font-medium uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-brand-muted font-body text-sm font-medium uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-pointer group"
                    onClick={(e) => { e.stopPropagation(); setSelectedUserId(user.id); }}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <AvatarPlaceholder name={user.name} imageUrl={user.profilePhoto} size="md" />
                        <div>
                          <p className="text-white font-medium group-hover:text-brand-gold transition-colors">{user.name}</p>
                          <p className="text-brand-muted text-xs">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-brand-platinum text-sm">{user.plan?.name || '—'}</td>
                    <td className="py-4 px-6 text-brand-muted text-sm">{formatDate(user.joinedAt)}</td>
                    <td className="py-4 px-6"><StatusChip status={user.status} /></td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.status === 'Expired' && (
                          <button onClick={(e) => handleRenewPrompt(user, e)} className="p-1.5 text-brand-muted hover:text-green-400 transition-colors rounded-md hover:bg-white/5" title="Renew">
                            <FiRefreshCw size={15} />
                          </button>
                        )}
                        <button onClick={(e) => { e.stopPropagation(); setSelectedUserId(user.id); }} className="p-1.5 text-brand-muted hover:text-blue-400 transition-colors rounded-md hover:bg-white/5" title="View Profile">
                          <FiEye size={15} />
                        </button>
                        <button onClick={(e) => openEdit(user, e)} className="p-1.5 text-brand-muted hover:text-brand-gold transition-colors rounded-md hover:bg-white/5" title="Edit">
                          <FiEdit2 size={15} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(user); }} className="p-1.5 text-brand-muted hover:text-red-500 transition-colors rounded-md hover:bg-white/5" title="Delete">
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

      {/* Full Member Profile Drawer */}
      <MemberProfileDrawer
        memberId={selectedUserId}
        onClose={() => setSelectedUserId(null)}
        onUpdate={load}
      />

      {/* Create / Edit Modal */}
      <FormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} title={editTarget ? 'Edit Member' : 'Add Member'} submitting={submitting}>
        {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{error}</p>}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Full Name" required>
            <input className={inputCls} value={form.name} onChange={set('name')} placeholder="e.g. Alex Johnson" />
          </FormField>
          <FormField label="Email Address" required>
            <input type="email" className={inputCls} value={form.email} onChange={set('email')} placeholder="alex@email.com" />
          </FormField>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormField label="Phone" required>
            <input className={inputCls} value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" />
          </FormField>
          <FormField label="Age" required>
            <input type="number" className={inputCls} value={form.age} onChange={set('age')} placeholder="25" />
          </FormField>
          <FormField label="Gender" required>
            <select className={selectCls} value={form.gender} onChange={set('gender')}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </FormField>
        </div>
        
        <FormField label="Membership Plan" required>
          <select className={selectCls} value={form.planId} onChange={set('planId')}>
            <option value="">Select Plan...</option>
            {plans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </FormField>

        {form.joinedAt && form.membershipExpiry && form.planId && (
          <div className="bg-brand-dark/50 border border-brand-gold/10 p-3 rounded-lg flex justify-between text-sm text-brand-muted">
            <span>Starts: <strong className="text-white">{formatDate(form.joinedAt)}</strong></span>
            <span>Expires: <strong className="text-white">{formatDate(form.membershipExpiry)}</strong></span>
          </div>
        )}

        <FormField label="Health Notes / Medical Conditions">
          <textarea className={inputCls} rows="2" value={form.healthNotes} onChange={set('healthNotes')} placeholder="Any prior injuries or conditions..."></textarea>
        </FormField>
      </FormModal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Remove Member"
        message={`Permanently remove "${deleteTarget?.name}" from the system?`}
      />

      {/* Renew Modal */}
      <FormModal isOpen={!!renewTarget} onClose={() => setRenewTarget(null)} onSubmit={submitRenew} title={`Renew ${renewTarget?.name}`} submitting={submitting}>
        {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2 mb-4">{error}</p>}
        <p className="text-sm text-brand-muted mb-4">Select a new plan to renew this member's subscription. Their start date will be set to today.</p>
        <FormField label="Select New Plan" required>
          <select className={selectCls} value={renewPlanId} onChange={(e) => setRenewPlanId(e.target.value)}>
            <option value="">Select Plan...</option>
            {plans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </FormField>
      </FormModal>
    </motion.div>
  );
}
