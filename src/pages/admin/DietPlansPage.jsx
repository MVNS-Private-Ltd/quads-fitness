import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StatusChip, EmptyState, TableFilterBar } from '../../components/admin/SharedAdminUI';
import { FiClipboard, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { getDietPlans } from '../../services/api';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: 'easeIn' } }
};

export default function DietPlansPage() {
  const [dietPlans, setDietPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDietPlans().then(data => {
      setDietPlans(data);
      setLoading(false);
    }).catch(console.error);
  }, []);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-display text-white mb-2">Diet Plans</h2>
          <p className="text-brand-muted font-body">Manage nutrition and meal plans for members.</p>
        </div>
        <button className="px-6 py-3 bg-brand-gold text-brand-darker font-heading font-bold rounded-xl hover:bg-white transition-colors shadow-glow-gold">
          + Create Diet Plan
        </button>
      </div>
      
      <div className="bg-brand-surface2 border border-white/5 rounded-2xl p-6">
        <TableFilterBar 
          filters={[{ label: 'Goal Type', options: ['Muscle Gain', 'Fat Loss', 'Maintenance'] }, { label: 'Status', options: ['Active', 'Draft'] }]} 
        />

        {loading ? (
          <div className="text-brand-muted py-8 text-center">Loading diet plans...</div>
        ) : dietPlans.length === 0 ? (
          <EmptyState title="No Diet Plans" message="Create nutrition plans for your members." icon={FiClipboard} action={<button className="px-6 py-2 bg-brand-dark border border-white/10 text-white rounded-xl hover:border-brand-gold transition-colors">Create Plan</button>} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dietPlans.map((plan, idx) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                key={plan.id}
                className="bg-brand-dark border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-brand-gold/30 transition-colors"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <StatusChip status={plan.status} />
                    <div className="flex items-center space-x-2">
                      <button className="p-1.5 text-brand-muted hover:text-white transition-colors rounded-md hover:bg-white/5">
                        <FiEdit2 size={16} />
                      </button>
                      <button className="p-1.5 text-brand-muted hover:text-red-500 transition-colors rounded-md hover:bg-white/5">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-xl font-heading text-white mb-2">{plan.title}</h3>
                  <p className="text-brand-gold text-sm font-medium mb-4">{plan.goalType || 'General'}</p>
                  
                  <div className="space-y-2 text-sm text-brand-muted">
                    <div className="flex justify-between">
                      <span>Daily Calories:</span>
                      <span className="text-white">{plan.calories || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Meals per Day:</span>
                      <span className="text-white">{plan.meals || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-6 py-2.5 text-sm font-medium text-brand-gold hover:text-white transition-colors border border-brand-gold/20 hover:border-brand-gold rounded-xl">
                  View Details
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
