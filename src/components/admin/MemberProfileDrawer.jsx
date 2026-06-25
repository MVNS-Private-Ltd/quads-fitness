import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX, FiEdit2, FiSave, FiUser, FiMail, FiPhone, FiCalendar,
  FiActivity, FiAlertCircle, FiStar, FiCheckCircle, FiClock, FiTrendingUp
} from 'react-icons/fi';
import { getMember, updateMember, getTrainers, getPlans } from '../../services/api';
import { StatusChip, inputCls, selectCls, FormField } from './SharedAdminUI';

const formatDate = (d) => d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—';
const formatDateInput = (d) => d ? new Date(d).toISOString().split('T')[0] : '';

function InfoBlock({ label, value, className = '' }) {
  return (
    <div className={`bg-brand-dark p-4 rounded-xl border border-white/5 ${className}`}>
      <span className="text-xs text-brand-muted block mb-1 uppercase tracking-wider">{label}</span>
      <p className="text-brand-platinum font-medium text-sm">{value || '—'}</p>
    </div>
  );
}

function StatBadge({ value, label, color = 'text-brand-gold' }) {
  return (
    <div className="bg-brand-dark border border-white/5 rounded-xl p-4 text-center">
      <p className={`text-2xl font-display font-bold ${color}`}>{value}</p>
      <p className="text-xs text-brand-muted mt-1">{label}</p>
    </div>
  );
}

export default function MemberProfileDrawer({ memberId, onClose, onUpdate }) {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});
  const [trainers, setTrainers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (!memberId) return;
    setLoading(true);
    setEditing(false);
    setActiveTab('profile');

    Promise.all([getMember(memberId), getTrainers(), getPlans()])
      .then(([m, t, p]) => {
        setMember(m);
        setTrainers(t);
        setPlans(p);
        setForm({
          name: m.name || '',
          email: m.email || '',
          phone: m.phone || '',
          age: m.age || '',
          gender: m.gender || '',
          emergencyContact: m.emergencyContact || '',
          healthNotes: m.healthNotes || '',
          fitnessGoals: m.fitnessGoals || '',
          status: m.status || 'Active',
          planId: m.planId || '',
          trainerId: m.trainerId || '',
          membershipExpiry: formatDateInput(m.membershipExpiry),
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [memberId]);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateMember(member.id, form);
      setMember(prev => ({ ...prev, ...updated }));
      setEditing(false);
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const statusColor = {
    Active: 'text-green-400',
    Expired: 'text-red-400',
    Inactive: 'text-yellow-400',
    Paused: 'text-yellow-400',
    Suspended: 'text-red-400',
  };

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'membership', label: 'Membership' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'progress', label: 'Progress' },
  ];

  return (
    <AnimatePresence>
      {memberId && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 h-full w-full max-w-xl bg-brand-surface2 border-l border-white/5 z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-brand-dark flex-shrink-0">
              <h2 className="text-lg font-display text-white">Member Profile</h2>
              <div className="flex items-center gap-3">
                {!loading && member && (
                  editing ? (
                    <>
                      <button
                        onClick={() => setEditing(false)}
                        className="px-4 py-2 text-sm text-brand-muted border border-white/10 rounded-xl hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 text-sm bg-brand-gold text-brand-darker font-bold rounded-xl hover:bg-white transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        <FiSave size={14} />
                        {saving ? 'Saving…' : 'Save Changes'}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditing(true)}
                      className="px-4 py-2 text-sm border border-brand-gold/40 text-brand-gold rounded-xl hover:bg-brand-gold hover:text-brand-darker transition-colors flex items-center gap-2"
                    >
                      <FiEdit2 size={14} /> Edit
                    </button>
                  )
                )}
                <button onClick={onClose} className="p-2 text-brand-muted hover:text-white transition-colors">
                  <FiX size={20} />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" />
              </div>
            ) : !member ? (
              <div className="flex-1 flex items-center justify-center text-brand-muted">Member not found</div>
            ) : (
              <>
                {/* Member Header */}
                <div className="px-6 py-5 bg-brand-dark border-b border-white/5 flex-shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-brand-surface2 border border-brand-gold/30 flex items-center justify-center text-brand-gold font-display text-2xl font-bold overflow-hidden">
                      {member.profilePhoto ? (
                        <img src={member.profilePhoto} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        member.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-display text-white truncate">{member.name}</h3>
                      <p className="text-brand-muted text-sm truncate">{member.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <StatusChip status={member.status} />
                        {member.membershipExpiry && (
                          <span className="text-xs text-brand-muted">
                            Expires {formatDate(member.membershipExpiry)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <StatBadge value={member.attendance?.length || 0} label="Check-ins" />
                    <StatBadge
                      value={member.review?.rating ? `${member.review.rating}★` : '—'}
                      label="Review"
                      color="text-brand-gold"
                    />
                    <StatBadge
                      value={member.progressLogs?.length || 0}
                      label="Progress Logs"
                      color="text-blue-400"
                    />
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/5 flex-shrink-0 bg-brand-dark">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-3 text-xs font-accent uppercase tracking-wider transition-colors ${
                        activeTab === tab.id
                          ? 'text-brand-gold border-b-2 border-brand-gold'
                          : 'text-brand-muted hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">

                  {/* ── PROFILE TAB ── */}
                  {activeTab === 'profile' && (
                    editing ? (
                      <div className="space-y-4">
                        <FormField label="Full Name" required>
                          <input className={inputCls} value={form.name} onChange={set('name')} />
                        </FormField>
                        <FormField label="Email">
                          <input type="email" className={inputCls} value={form.email} onChange={set('email')} />
                        </FormField>
                        <div className="grid grid-cols-2 gap-3">
                          <FormField label="Phone">
                            <input className={inputCls} value={form.phone} onChange={set('phone')} />
                          </FormField>
                          <FormField label="Age">
                            <input type="number" className={inputCls} value={form.age} onChange={set('age')} />
                          </FormField>
                        </div>
                        <FormField label="Gender">
                          <select className={selectCls} value={form.gender} onChange={set('gender')}>
                            <option value="">Not specified</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </FormField>
                        <FormField label="Emergency Contact">
                          <input className={inputCls} value={form.emergencyContact} onChange={set('emergencyContact')} placeholder="Name & phone" />
                        </FormField>
                        <FormField label="Fitness Goals">
                          <textarea className={`${inputCls} min-h-[80px]`} value={form.fitnessGoals} onChange={set('fitnessGoals')} />
                        </FormField>
                        <FormField label="Health Notes">
                          <textarea className={`${inputCls} min-h-[80px]`} value={form.healthNotes} onChange={set('healthNotes')} placeholder="Injuries, conditions, notes…" />
                        </FormField>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <InfoBlock label="Phone" value={member.phone} />
                          <InfoBlock label="Age" value={member.age} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <InfoBlock label="Gender" value={member.gender} />
                          <InfoBlock label="Member Since" value={formatDate(member.joinedAt)} />
                        </div>
                        <InfoBlock label="Emergency Contact" value={member.emergencyContact} />
                        {member.fitnessGoals && <InfoBlock label="Fitness Goals" value={member.fitnessGoals} />}
                        {member.healthNotes && (
                          <div className="bg-yellow-500/5 border border-yellow-500/20 p-4 rounded-xl">
                            <div className="flex items-center gap-2 mb-1">
                              <FiAlertCircle size={14} className="text-yellow-500" />
                              <span className="text-xs text-yellow-500 font-medium uppercase tracking-wider">Health Notes</span>
                            </div>
                            <p className="text-brand-platinum text-sm">{member.healthNotes}</p>
                          </div>
                        )}
                        {member.review && (
                          <div className="bg-brand-dark border border-white/5 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-brand-muted uppercase tracking-wider">Review Submitted</span>
                              <StatusChip status={member.review.status} />
                            </div>
                            <div className="flex text-brand-gold text-sm mb-1">
                              {'★'.repeat(member.review.rating)}{'☆'.repeat(5 - member.review.rating)}
                            </div>
                            <p className="text-brand-platinum text-sm italic">"{member.review.comment}"</p>
                          </div>
                        )}
                      </div>
                    )
                  )}

                  {/* ── MEMBERSHIP TAB ── */}
                  {activeTab === 'membership' && (
                    editing ? (
                      <div className="space-y-4">
                        <FormField label="Status">
                          <select className={selectCls} value={form.status} onChange={set('status')}>
                            <option value="Active">Active</option>
                            <option value="Expired">Expired</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Paused">Paused</option>
                            <option value="Suspended">Suspended</option>
                          </select>
                        </FormField>
                        <FormField label="Membership Plan">
                          <select className={selectCls} value={form.planId} onChange={set('planId')}>
                            <option value="">No Plan</option>
                            {plans.map(p => <option key={p.id} value={p.id}>{p.name} — ₹{p.price}/{p.billing}</option>)}
                          </select>
                        </FormField>
                        <FormField label="Assigned Trainer">
                          <select className={selectCls} value={form.trainerId} onChange={set('trainerId')}>
                            <option value="">No Trainer</option>
                            {trainers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                          </select>
                        </FormField>
                        <FormField label="Membership Expiry Date">
                          <input type="date" className={inputCls} value={form.membershipExpiry} onChange={set('membershipExpiry')} />
                        </FormField>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-brand-dark border border-white/5 rounded-xl p-5">
                          <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">Current Plan</p>
                          {member.plan ? (
                            <>
                              <p className="text-xl font-display text-white">{member.plan.name}</p>
                              <p className="text-brand-gold font-medium">₹{member.plan.price} / {member.plan.billing}</p>
                            </>
                          ) : (
                            <p className="text-brand-muted">No plan assigned</p>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <InfoBlock label="Membership Start" value={formatDate(member.joinedAt)} />
                          <InfoBlock label="Expiry Date" value={formatDate(member.membershipExpiry)} />
                        </div>
                        <InfoBlock label="Assigned Trainer" value={member.trainer?.name} />
                        <div className="bg-brand-dark border border-white/5 rounded-xl p-4 flex items-center justify-between">
                          <span className="text-xs text-brand-muted uppercase tracking-wider">Status</span>
                          <StatusChip status={member.status} />
                        </div>
                      </div>
                    )
                  )}

                  {/* ── ATTENDANCE TAB ── */}
                  {activeTab === 'attendance' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-brand-muted">Recent 10 Check-ins</p>
                        <span className="text-brand-gold font-bold text-sm">{member.attendance?.length || 0} total</span>
                      </div>
                      {member.attendance?.length === 0 ? (
                        <div className="text-center text-brand-muted py-8 border border-white/5 rounded-xl">
                          No attendance records yet.
                        </div>
                      ) : (
                        member.attendance.map(a => (
                          <div key={a.id} className="bg-brand-dark border border-white/5 rounded-xl px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FiCheckCircle size={16} className="text-green-500" />
                              <span className="text-brand-platinum text-sm">{formatDate(a.date)}</span>
                            </div>
                            <div className="text-xs text-brand-muted">
                              {a.timeIn && <span>{a.timeIn}{a.timeOut ? ` – ${a.timeOut}` : ''}</span>}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* ── PROGRESS TAB ── */}
                  {activeTab === 'progress' && (
                    <div className="space-y-3">
                      {member.progressLogs?.length === 0 ? (
                        <div className="text-center text-brand-muted py-8 border border-white/5 rounded-xl">
                          No progress logs yet.
                        </div>
                      ) : (
                        member.progressLogs.map(log => (
                          <div key={log.id} className="bg-brand-dark border border-white/5 rounded-xl px-4 py-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-brand-muted">{formatDate(log.date)}</span>
                              <FiTrendingUp size={14} className="text-brand-gold" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              {log.weight && (
                                <div>
                                  <p className="text-xs text-brand-muted">Weight</p>
                                  <p className="text-brand-platinum font-medium">{log.weight} kg</p>
                                </div>
                              )}
                              {log.bmi && (
                                <div>
                                  <p className="text-xs text-brand-muted">BMI</p>
                                  <p className="text-brand-platinum font-medium">{log.bmi}</p>
                                </div>
                              )}
                            </div>
                            {log.notes && <p className="text-sm text-brand-muted mt-2 italic">{log.notes}</p>}
                          </div>
                        ))
                      )}
                    </div>
                  )}

                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
