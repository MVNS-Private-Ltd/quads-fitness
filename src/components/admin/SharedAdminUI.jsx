import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiCalendar, FiX, FiInbox, FiAlertTriangle } from 'react-icons/fi';

export const StatusChip = ({ status }) => {
  let styles = 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  const s = (status || '').toLowerCase();
  if (s === 'active' || s === 'published') {
    styles = 'bg-green-500/10 text-green-500 border-green-500/20';
  } else if (s === 'draft' || s === 'pending' || s === 'new') {
    styles = 'bg-brand-gold/10 text-brand-gold border-brand-gold/20';
  } else if (s === 'expired' || s === 'inactive') {
    styles = 'bg-red-500/10 text-red-500 border-red-500/20';
  } else if (s === 'contacted') {
    styles = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
  } else if (s === 'featured') {
    styles = 'bg-purple-500/10 text-purple-400 border-purple-500/20';
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles}`}>
      {status}
    </span>
  );
};

export const EmptyState = ({ title, message, icon: Icon = FiInbox, action }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center">
    <div className="w-16 h-16 bg-brand-dark rounded-full flex items-center justify-center mb-4 border border-white/5">
      <Icon className="w-8 h-8 text-brand-muted" />
    </div>
    <h3 className="text-xl font-heading text-white mb-2">{title}</h3>
    <p className="text-brand-muted text-sm max-w-sm mb-6">{message}</p>
    {action}
  </div>
);

export const TableFilterBar = ({ onSearch, filters = [] }) => (
  <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
    <div className="flex items-center bg-brand-dark border border-white/10 rounded-xl px-4 py-2 w-full md:max-w-md focus-within:border-brand-gold transition-colors">
      <FiSearch className="text-brand-muted mr-3 shrink-0" />
      <input 
        type="text" 
        placeholder="Search..." 
        className="bg-transparent text-sm text-white focus:outline-none w-full placeholder:text-brand-muted/60"
        onChange={(e) => onSearch && onSearch(e.target.value)}
      />
    </div>
    <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
      {filters.map((filter, idx) => (
        <select
          key={idx}
          className="bg-brand-dark border border-white/10 rounded-xl px-4 py-2 text-sm text-brand-muted focus:outline-none focus:border-brand-gold transition-colors appearance-none"
          onChange={filter.onChange}
        >
          <option value="">{filter.label}: All</option>
          {filter.options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
        </select>
      ))}
      <button className="flex items-center justify-center p-2.5 bg-brand-dark border border-white/10 rounded-xl text-brand-muted hover:text-white transition-colors min-w-[42px]">
        <FiCalendar size={18} />
      </button>
    </div>
  </div>
);

export const PreviewDrawer = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div 
          initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-y-0 right-0 w-full md:w-[460px] bg-brand-surface2 border-l border-white/5 shadow-2xl z-50 flex flex-col"
        >
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-brand-darker shrink-0">
            <h2 className="text-xl font-heading text-white">{title}</h2>
            <button onClick={onClose} className="p-2 text-brand-muted hover:text-white transition-colors rounded-lg hover:bg-white/5">
              <FiX size={20} />
            </button>
          </div>
          <div className="p-6 flex-1 overflow-y-auto">
            {children}
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

/** Generic full-screen modal for create/edit forms */
export const FormModal = ({ isOpen, onClose, title, children, onSubmit, submitting }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-brand-surface2 border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-heading text-white">{title}</h2>
              <button onClick={onClose} className="p-2 text-brand-muted hover:text-white transition-colors rounded-lg hover:bg-white/5">
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={onSubmit} className="p-6 flex-1 overflow-y-auto space-y-4">
              {children}
              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 bg-brand-dark border border-white/10 text-white rounded-xl hover:border-white/30 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-brand-gold text-brand-darker font-bold rounded-xl hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

/** Confirmation dialog for destructive actions */
export const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Delete', loading }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 z-[60] backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        >
          <div className="bg-brand-surface2 border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertTriangle className="text-red-500 w-7 h-7" />
            </div>
            <h3 className="text-xl font-heading text-white mb-2">{title}</h3>
            <p className="text-brand-muted text-sm mb-6">{message}</p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 bg-brand-dark border border-white/10 text-white rounded-xl hover:border-white/30 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 py-2.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Deleting...' : confirmLabel}
              </button>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

/** Reusable styled form field */
export const FormField = ({ label, children, required }) => (
  <div>
    <label className="text-xs text-brand-muted uppercase tracking-wider mb-1.5 block">
      {label}{required && <span className="text-red-400 ml-1">*</span>}
    </label>
    {children}
  </div>
);

/** Standard input styles — use as className */
export const inputCls = "w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-gold transition-colors placeholder:text-brand-muted/50";
export const selectCls = "w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-gold transition-colors";
export const textareaCls = "w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-gold transition-colors resize-none";

export const AvatarPlaceholder = ({ name, imageUrl, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl'
  };
  
  if (imageUrl) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden shrink-0 border border-brand-gold/20`}>
        <img src={imageUrl} alt={name || 'Avatar'} className="w-full h-full object-cover" />
      </div>
    );
  }

  const initials = name
    ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : '?';

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-brand-surface flex items-center justify-center text-brand-gold font-bold border border-brand-gold/20 shrink-0`}>
      {initials}
    </div>
  );
};
