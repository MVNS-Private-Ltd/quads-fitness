import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { StatusChip, EmptyState, TableFilterBar, AvatarPlaceholder, FormModal, FormField, selectCls, inputCls } from '../../components/admin/SharedAdminUI';
import { FiCheckSquare, FiPlus } from 'react-icons/fi';
import { getAttendance, getMembers, markAttendance } from '../../services/api';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: 'easeIn' } }
};

export default function AttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [form, setForm] = useState({
    memberId: '',
    date: new Date().toISOString().split('T')[0],
    timeIn: new Date().toTimeString().split(' ')[0].substring(0, 5),
    timeOut: '',
    status: 'Present'
  });

  const load = () => {
    setLoading(true);
    Promise.all([getAttendance(), getMembers()])
      .then(([a, m]) => {
        setAttendanceRecords(a);
        setMembers(m);
        setLoading(false);
      })
      .catch(console.error);
  };

  useEffect(() => {
    load();
  }, []);

  const openModal = () => {
    setError('');
    setForm({
      memberId: '',
      date: new Date().toISOString().split('T')[0],
      timeIn: new Date().toTimeString().split(' ')[0].substring(0, 5),
      timeOut: '',
      status: 'Present'
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.memberId) {
      setError('Please select a member.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      // Append seconds if missing
      const payload = {
        memberId: form.memberId,
        date: form.date,
        timeIn: form.timeIn ? (form.timeIn.length === 5 ? form.timeIn + ':00' : form.timeIn) : null,
        timeOut: form.timeOut ? (form.timeOut.length === 5 ? form.timeOut + ':00' : form.timeOut) : null,
        status: form.status
      };
      
      // The backend expects full ISO strings for dates but stores time directly as String in SQLite. Wait, in SQLite it's better to store full ISO date strings if we are merging them. But the backend creates `new Date(date)` which sets time to 00:00:00 for the `date` field. The timeIn/Out fields are Strings. 
      // Payload format:
      // { memberId: Number, timeIn: String, timeOut: String, status: String, date: ISOString }
      const finalPayload = {
        ...form,
        date: new Date(form.date).toISOString()
      };
      
      await markAttendance(finalPayload);
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.message || 'Failed to mark attendance.');
    } finally {
      setSubmitting(false);
    }
  };

  const setF = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, { 
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleTimeString(undefined, {
      hour: '2-digit', minute: '2-digit'
    });
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-display text-white mb-2">Attendance Log</h2>
          <p className="text-brand-muted font-body">Monitor member check-ins and check-outs.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/attendance/qr" className="px-6 py-3 bg-brand-dark border border-brand-gold/50 text-brand-gold font-heading font-bold rounded-xl hover:bg-brand-gold/10 transition-colors flex items-center gap-2">
            Print QR Code
          </Link>
          <button onClick={openModal} className="px-6 py-3 bg-brand-gold text-brand-darker font-heading font-bold rounded-xl hover:bg-white transition-colors shadow-glow-gold flex items-center gap-2">
            <FiPlus size={18} /> Mark Attendance
          </button>
        </div>
      </div>
      
      <div className="bg-brand-surface2 border border-white/5 rounded-2xl overflow-hidden p-6">
        <TableFilterBar 
          filters={[{ label: 'Status', options: ['Active (Present)', 'Inactive (Absent)'] }]} 
        />

        {loading ? (
          <div className="text-brand-muted py-8 text-center">Loading attendance...</div>
        ) : attendanceRecords.length === 0 ? (
          <EmptyState title="No Records" message="No attendance records found for today." icon={FiCheckSquare} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-dark border-b border-white/10">
                  <th className="py-4 px-6 text-brand-muted font-body text-sm font-medium uppercase tracking-wider rounded-tl-xl">Member</th>
                  <th className="py-4 px-6 text-brand-muted font-body text-sm font-medium uppercase tracking-wider">Date</th>
                  <th className="py-4 px-6 text-brand-muted font-body text-sm font-medium uppercase tracking-wider">Time In</th>
                  <th className="py-4 px-6 text-brand-muted font-body text-sm font-medium uppercase tracking-wider">Time Out</th>
                  <th className="py-4 px-6 text-brand-muted font-body text-sm font-medium uppercase tracking-wider rounded-tr-xl">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((record, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={record.id} 
                    className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group cursor-pointer"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <AvatarPlaceholder name={record.member?.name || 'Unknown'} size="sm" />
                        <span className="text-white font-medium group-hover:text-brand-gold transition-colors">{record.member?.name || 'Unknown Member'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-brand-platinum text-sm">{formatDate(record.date)}</td>
                    <td className="py-4 px-6 text-brand-muted text-sm">{record.timeIn || '-'}</td>
                    <td className="py-4 px-6 text-brand-muted text-sm">{record.timeOut || '-'}</td>
                    <td className="py-4 px-6">
                      <StatusChip status={record.status} />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <FormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} title="Mark Attendance" submitting={submitting}>
        {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{error}</p>}
        
        <FormField label="Member" required>
          <select className={selectCls} value={form.memberId} onChange={setF('memberId')} required>
            <option value="">Select a Member</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.name} ({m.email})</option>)}
          </select>
        </FormField>

        <FormField label="Date" required>
          <input type="date" className={inputCls} value={form.date} onChange={setF('date')} required />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Time In" required>
            <input type="time" className={inputCls} value={form.timeIn} onChange={setF('timeIn')} required />
          </FormField>
          <FormField label="Time Out">
            <input type="time" className={inputCls} value={form.timeOut} onChange={setF('timeOut')} />
          </FormField>
        </div>

        <FormField label="Status" required>
          <select className={selectCls} value={form.status} onChange={setF('status')} required>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </FormField>
      </FormModal>

    </motion.div>
  );
}
