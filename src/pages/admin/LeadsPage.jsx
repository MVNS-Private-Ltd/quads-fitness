import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StatusChip, EmptyState, TableFilterBar, PreviewDrawer } from '../../components/admin/SharedAdminUI';
import { FiMessageCircle, FiEye, FiCheck, FiTrash2 } from 'react-icons/fi';
import { getLeads, updateLead, replyToLead, deleteLead } from '../../services/api';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: 'easeIn' } }
};

export default function LeadsPage() {
  const [selectedLead, setSelectedLead] = useState(null);
  const [leads, setLeads] = useState([]);
  const [allLeads, setAllLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [interestFilter, setInterestFilter] = useState('');

  useEffect(() => {
    if (selectedLead) {
      setIsReplying(false);
      setReplyText('');
    }
  }, [selectedLead]);

  useEffect(() => {
    getLeads().then(data => {
      setAllLeads(data);
      setLeads(data);
      setLoading(false);
    }).catch(console.error);
  }, []);

  // Apply filters whenever search/status/interest change
  useEffect(() => {
    let filtered = allLeads;
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(l =>
        l.name?.toLowerCase().includes(q) ||
        l.email?.toLowerCase().includes(q) ||
        l.phone?.toLowerCase().includes(q)
      );
    }
    if (statusFilter) {
      filtered = filtered.filter(l => l.status === statusFilter);
    }
    if (interestFilter) {
      filtered = filtered.filter(l => (l.interest || '').toLowerCase().includes(interestFilter.toLowerCase()));
    }
    setLeads(filtered);
  }, [search, statusFilter, interestFilter, allLeads]);

  const handleUpdateStatus = async (status) => {
    try {
      await updateLead(selectedLead.id, { status });
      setAllLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, status } : l));
      setSelectedLead({ ...selectedLead, status });
    } catch (err) {
      console.error('Failed to update lead status:', err);
      alert('Failed to update status.');
    }
  };

  const handleDelete = async (lead, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm(`Delete inquiry from ${lead.name}? This cannot be undone.`)) return;
    try {
      await deleteLead(lead.id);
      setAllLeads(prev => prev.filter(l => l.id !== lead.id));
      if (selectedLead?.id === lead.id) setSelectedLead(null);
    } catch (err) {
      console.error(err);
      alert('Failed to delete inquiry.');
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setSendingReply(true);
    try {
      await replyToLead(selectedLead.id, replyText);
      const newStatus = 'Contacted';
      setAllLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, status: newStatus } : l));
      setSelectedLead({ ...selectedLead, status: newStatus });
      setIsReplying(false);
      setReplyText('');
      alert('Reply sent successfully!');
    } catch (err) {
      console.error(err);
      // Still mark as contacted even if email failed
      try {
        await updateLead(selectedLead.id, { status: 'Contacted' });
        const newStatus = 'Contacted';
        setAllLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, status: newStatus } : l));
        setSelectedLead({ ...selectedLead, status: newStatus });
      } catch (_) {}
      alert('Email could not be sent, but the lead has been marked as Contacted.');
      setIsReplying(false);
      setReplyText('');
    } finally {
      setSendingReply(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, { 
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <div>
        <h2 className="text-3xl font-display text-white mb-2">Inquiries & Leads</h2>
        <p className="text-brand-muted font-body">Manage contact form submissions and prospective members.</p>
      </div>

      <div className="bg-brand-surface2 border border-white/5 rounded-2xl p-6">
        <TableFilterBar 
          onSearch={setSearch}
          filters={[
            { label: 'Status', options: ['Unread', 'Contacted', 'Closed'], onChange: (e) => setStatusFilter(e.target.value) },
            { label: 'Interest', options: ['Personal Training', 'Membership', 'Diet Plan', 'General'], onChange: (e) => setInterestFilter(e.target.value) }
          ]} 
        />

        {loading ? (
          <div className="text-brand-muted py-8 text-center">Loading leads...</div>
        ) : leads.length === 0 ? (
          <EmptyState 
            title="No Inquiries" 
            message="You don't have any pending leads right now." 
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-3 px-4 text-brand-muted font-body text-sm">Name</th>
                  <th className="py-3 px-4 text-brand-muted font-body text-sm">Interest</th>
                  <th className="py-3 px-4 text-brand-muted font-body text-sm">Date</th>
                  <th className="py-3 px-4 text-brand-muted font-body text-sm">Status</th>
                  <th className="py-3 px-4 text-brand-muted font-body text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={lead.id} 
                    className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group cursor-pointer"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <td className="py-4 px-4">
                      <p className="text-white font-medium">{lead.name}</p>
                      <p className="text-brand-muted text-xs">{lead.email}</p>
                    </td>
                    <td className="py-4 px-4 text-brand-platinum text-sm">{lead.interest || 'General'}</td>
                    <td className="py-4 px-4 text-brand-muted text-sm">{formatDate(lead.createdAt)}</td>
                    <td className="py-4 px-4"><StatusChip status={lead.status} /></td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="p-2 text-brand-muted hover:text-white bg-brand-dark rounded-lg border border-white/5 hover:border-white/20 transition-colors"
                          title="View details"
                        >
                          <FiEye size={16} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(lead, e)}
                          className="p-2 text-brand-muted hover:text-red-400 bg-brand-dark rounded-lg border border-white/5 hover:border-red-500/30 transition-colors"
                          title="Delete inquiry"
                        >
                          <FiTrash2 size={16} />
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

      <PreviewDrawer 
        isOpen={!!selectedLead} 
        onClose={() => setSelectedLead(null)} 
        title="Lead Details"
      >
        {selectedLead && (
          <div className="space-y-6">
            <div className="bg-brand-dark p-5 rounded-2xl border border-white/5">
              <h3 className="text-xl font-display text-white mb-1">{selectedLead.name}</h3>
              <p className="text-brand-gold text-sm mb-4">{selectedLead.email}</p>
              {selectedLead.phone && <p className="text-brand-muted text-sm mb-4">Phone: {selectedLead.phone}</p>}
              <StatusChip status={selectedLead.status} />
            </div>

            <div>
              <label className="text-xs text-brand-muted uppercase tracking-wider mb-2 block">Interest</label>
              <p className="text-white bg-brand-dark p-3 rounded-xl border border-white/5">{selectedLead.interest || 'General Inquiry'}</p>
            </div>
            
            {selectedLead.message && (
              <div>
                <label className="text-xs text-brand-muted uppercase tracking-wider mb-2 block">Message</label>
                <p className="text-white bg-brand-dark p-4 rounded-xl border border-white/5 whitespace-pre-wrap text-sm">{selectedLead.message}</p>
              </div>
            )}

            <div>
              <label className="text-xs text-brand-muted uppercase tracking-wider mb-2 block">Date Received</label>
              <p className="text-brand-platinum">{formatDate(selectedLead.createdAt)}</p>
            </div>

            {isReplying ? (
              <div className="pt-6 border-t border-white/5 space-y-3">
                <label className="text-xs text-brand-muted uppercase tracking-wider mb-2 block">Your Reply</label>
                <textarea
                  className="w-full bg-brand-dark border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-brand-orange"
                  rows="5"
                  placeholder="Type your reply here... An email will be sent automatically to the user."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  disabled={sendingReply}
                ></textarea>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsReplying(false)}
                    disabled={sendingReply}
                    className="flex-1 py-3 bg-brand-dark border border-white/10 text-white rounded-xl hover:bg-white/5 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleReply}
                    disabled={sendingReply || !replyText.trim()}
                    className="flex-1 py-3 bg-brand-gold text-brand-darker font-bold rounded-xl hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {sendingReply ? 'Sending...' : <><FiMessageCircle size={16} /> Send Reply</>}
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-6 border-t border-white/5 flex gap-3">
                <button 
                  onClick={() => setIsReplying(true)}
                  className="flex-1 py-3 bg-brand-dark border border-white/10 text-white rounded-xl hover:border-brand-gold transition-colors flex items-center justify-center gap-2"
                >
                  <FiMessageCircle size={16} /> Write Reply
                </button>
                <button 
                  onClick={() => handleUpdateStatus('Contacted')}
                  disabled={selectedLead.status === 'Contacted'}
                  className="flex-1 py-3 bg-brand-gold text-brand-darker font-bold rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiCheck size={16} /> {selectedLead.status === 'Contacted' ? 'Contacted' : 'Mark Contacted'}
                </button>
              </div>
              <button
                onClick={(e) => handleDelete(selectedLead, e)}
                className="w-full py-3 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <FiTrash2 size={15} /> Delete Inquiry
              </button>
            )}
          </div>
        )}
      </PreviewDrawer>
    </motion.div>
  );
}
