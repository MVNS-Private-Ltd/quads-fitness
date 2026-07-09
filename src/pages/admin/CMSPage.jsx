import { useState } from 'react';
import { motion } from 'framer-motion';
import { StatusChip, TableFilterBar, PreviewDrawer } from '../../components/admin/SharedAdminUI';
import { FiEdit2, FiGlobe, FiEye } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: 'easeIn' } }
};

// CMS pages map directly to the React router pages — this is the admin view
// of the live public pages. No separate DB model needed.
const SITE_PAGES = [
  { id: 'home', title: 'Home Page', path: '/', adminPath: '/admin/settings', description: 'Hero, programs teaser, stat block', status: 'Published' },
  { id: 'about', title: 'About Us', path: '/about', adminPath: '/admin/settings', description: 'Mission, 3D scene, core values', status: 'Published' },
  { id: 'programs', title: 'Programs & Plans', path: '/programs', adminPath: '/admin/programs', description: 'Training programs + membership tiers', status: 'Published' },
  { id: 'contact', title: 'Contact', path: '/contact', adminPath: '/admin/leads', description: 'Inquiry form feeds the Leads page', status: 'Published' },
];

export default function CMSPage() {
  const [selectedPage, setSelectedPage] = useState(null);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-display text-white mb-2">Website Content</h2>
          <p className="text-brand-muted font-body">Overview of all live public pages and their admin control modules.</p>
        </div>
        <a href="/" target="_blank" rel="noreferrer" className="px-6 py-3 bg-brand-dark border border-white/10 text-white font-heading font-bold rounded-xl hover:border-brand-gold transition-colors flex items-center gap-2">
          <FiGlobe size={18} /> Preview Live Site
        </a>
      </div>

      <div className="bg-brand-surface2 border border-white/5 rounded-2xl p-6">
        <TableFilterBar filters={[{ label: 'Status', options: ['Published', 'Draft'] }]} />

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-3 px-4 text-brand-muted font-body text-sm">Page Title</th>
                <th className="py-3 px-4 text-brand-muted font-body text-sm">Path</th>
                <th className="py-3 px-4 text-brand-muted font-body text-sm">Content Source</th>
                <th className="py-3 px-4 text-brand-muted font-body text-sm">Status</th>
                <th className="py-3 px-4 text-brand-muted font-body text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {SITE_PAGES.map((page, idx) => (
                <motion.tr
                  key={page.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => setSelectedPage(page)}
                >
                  <td className="py-4 px-4 text-white font-medium">{page.title}</td>
                  <td className="py-4 px-4 text-brand-muted text-sm font-mono">{page.path}</td>
                  <td className="py-4 px-4 text-brand-platinum text-sm">{page.description}</td>
                  <td className="py-4 px-4"><StatusChip status={page.status} /></td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={page.path}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 text-brand-muted hover:text-white bg-brand-dark rounded-lg border border-white/5 hover:border-white/20 transition-colors"
                        title="Preview page"
                      >
                        <FiEye size={16} />
                      </a>
                      {page.adminPath && (
                        <Link
                          to={page.adminPath}
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-brand-muted hover:text-brand-gold bg-brand-dark rounded-lg border border-white/5 hover:border-brand-gold/20 transition-colors"
                          title="Edit content"
                        >
                          <FiEdit2 size={16} />
                        </Link>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PreviewDrawer isOpen={!!selectedPage} onClose={() => setSelectedPage(null)} title="Page Overview">
        {selectedPage && (
          <div className="space-y-5">
            <div>
              <label className="text-xs text-brand-muted uppercase tracking-wider mb-1 block">Title</label>
              <p className="text-white text-lg font-medium">{selectedPage.title}</p>
            </div>
            <div>
              <label className="text-xs text-brand-muted uppercase tracking-wider mb-1 block">Public URL</label>
              <p className="text-brand-gold font-mono">{selectedPage.path}</p>
            </div>
            <div>
              <label className="text-xs text-brand-muted uppercase tracking-wider mb-1 block">Content Source</label>
              <p className="text-brand-platinum text-sm">{selectedPage.description}</p>
            </div>
            <div>
              <label className="text-xs text-brand-muted uppercase tracking-wider mb-1 block">Status</label>
              <div className="mt-2"><StatusChip status={selectedPage.status} /></div>
            </div>
            <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
              <a href={selectedPage.path} target="_blank" rel="noreferrer" className="w-full py-3 bg-brand-dark border border-white/10 text-white rounded-xl hover:border-brand-gold transition-colors flex items-center justify-center gap-2">
                <FiEye size={16} /> Preview Live Page
              </a>
              {selectedPage.adminPath && (
                <Link to={selectedPage.adminPath} className="w-full py-3 bg-brand-gold text-brand-darker font-bold rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2">
                  <FiEdit2 size={16} /> Manage Content
                </Link>
              )}
            </div>
          </div>
        )}
      </PreviewDrawer>
    </motion.div>
  );
}
