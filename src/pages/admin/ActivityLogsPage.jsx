import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TableFilterBar, EmptyState } from '../../components/admin/SharedAdminUI';
import { FiActivity, FiUser, FiSettings, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { getLogs } from '../../services/api';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: 'easeIn' } }
};

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLogs().then(data => {
      setLogs(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const getIcon = (actionStr) => {
    const action = actionStr.toLowerCase();
    if (action.includes('update')) return <FiEdit2 className="text-blue-500" />;
    if (action.includes('delete') || action.includes('remove')) return <FiTrash2 className="text-red-500" />;
    if (action.includes('system') || action.includes('setting')) return <FiSettings className="text-brand-muted" />;
    if (action.includes('publish') || action.includes('create') || action.includes('add')) return <FiActivity className="text-green-500" />;
    return <FiUser className="text-brand-gold" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString(undefined, { 
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <div>
        <h2 className="text-3xl font-display text-white mb-2">Activity Logs</h2>
        <p className="text-brand-muted font-body">System-wide audit trail of all actions and changes.</p>
      </div>

      <div className="bg-brand-surface2 border border-white/5 rounded-2xl p-6">
        <TableFilterBar 
          filters={[{ label: 'Action Type', options: ['Updates', 'Deletions', 'System'] }, { label: 'User', options: ['Admin User', 'System'] }]} 
        />

        {loading ? (
           <div className="text-brand-muted py-8 text-center">Loading logs...</div>
        ) : logs.length === 0 ? (
           <EmptyState message="No activity logs found." icon={FiActivity} />
        ) : (
          <div className="space-y-4">
            {logs.map((log, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={log.id} 
                className="flex items-start gap-4 p-4 bg-brand-dark border border-white/5 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-brand-surface flex items-center justify-center shrink-0 border border-white/10">
                  {getIcon(log.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-white font-medium text-sm truncate">{log.action}</h4>
                    <span className="text-xs text-brand-muted whitespace-nowrap ml-4">{formatDate(log.createdAt)}</span>
                  </div>
                  <p className="text-brand-platinum text-sm mb-1">{log.details}</p>
                  <div className="flex items-center gap-1.5 text-xs text-brand-gold">
                    <FiUser size={12} />
                    <span>{log.user}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
