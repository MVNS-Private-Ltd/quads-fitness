import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiUpload } from 'react-icons/fi';
import { getSettings, updateSettings } from '../../services/api';
import BrandLogo from '../../components/BrandLogo';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: 'easeIn' } }
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings().then(setSettings).catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const SETTINGS_SAVE_FIELDS = [
    'gymName', 'tagline', 'email', 'phone', 'address',
    'instagram', 'facebook', 'twitter', 'youtube',
    'mondayHours', 'tuesdayHours', 'wednesdayHours', 'thursdayHours', 'fridayHours', 'saturdayHours', 'sundayHours',
    'primaryColor', 'logoUrl', 'metaTitle', 'metaDescription',
    'heroTitle', 'heroSubtitle', 'aboutTitle', 'aboutSubtitle',
  ];

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const dataToSave = {};
      for (const key of SETTINGS_SAVE_FIELDS) {
        const value = settings[key];
        if (value !== undefined && value !== null) {
          dataToSave[key] = value;
        }
      }

      const updated = await updateSettings(dataToSave);
      setSettings(updated);
      alert('Settings saved successfully!');
    } catch (err) {
      alert('Failed to save settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return <div className="text-white">Loading settings...</div>;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-display text-white mb-2">Platform Settings</h2>
          <p className="text-brand-muted font-body">Manage gym details, branding, and system configuration.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-brand-gold text-brand-darker font-heading font-bold rounded-xl hover:bg-white transition-colors shadow-glow-gold flex items-center gap-2 disabled:opacity-50"
        >
          <FiSave size={18} /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 shrink-0 space-y-2">
          {['General Details', 'Branding & Assets', 'Content', 'Social Links', 'Operating Hours'].map(tab => {
            const tabId = tab.toLowerCase().split(' ')[0];
            const isActive = activeTab === tabId;
            return (
              <button
                key={tabId}
                onClick={() => setActiveTab(tabId)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium ${isActive ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20' : 'text-brand-muted hover:bg-white/5 hover:text-white'}`}
              >
                {tab}
              </button>
            )
          })}
        </div>

        <div className="flex-1 bg-brand-surface2 border border-white/5 rounded-2xl p-6 lg:p-8">
          {activeTab === 'general' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">
              <h3 className="text-xl font-heading text-white border-b border-white/10 pb-4 mb-6">General Gym Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-brand-muted uppercase tracking-wider mb-2 block">Gym Name</label>
                  <input type="text" name="gymName" value={settings.gymName || ''} onChange={handleChange} className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-gold focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-brand-muted uppercase tracking-wider mb-2 block">Contact Email</label>
                  <input type="email" name="email" value={settings.email || ''} onChange={handleChange} className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-gold focus:outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-brand-muted uppercase tracking-wider mb-2 block">Location Address</label>
                  <input type="text" name="address" value={settings.address || ''} onChange={handleChange} className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-gold focus:outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-brand-muted uppercase tracking-wider mb-2 block">Phone Number</label>
                  <input type="text" name="phone" value={settings.phone || ''} onChange={handleChange} className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-gold focus:outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-brand-muted uppercase tracking-wider mb-2 block">Meta Title</label>
                  <input type="text" name="metaTitle" value={settings.metaTitle || ''} onChange={handleChange} className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-gold focus:outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-brand-muted uppercase tracking-wider mb-2 block">Meta Description</label>
                  <textarea name="metaDescription" value={settings.metaDescription || ''} onChange={handleChange} className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-gold focus:outline-none" rows="3" />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'branding' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">
              <h3 className="text-xl font-heading text-white border-b border-white/10 pb-4 mb-6">Branding & Assets</h3>
              <div>
                <label className="text-xs text-brand-muted uppercase tracking-wider mb-2 block">Main Logo URL</label>
                <div className="flex items-center gap-6">
                  <BrandLogo settings={settings} className="w-24 h-24 bg-brand-dark rounded-xl border border-white/10 p-2" alt="Logo" />
                  <div className="flex-1">
                    <input type="text" name="logoUrl" value={settings.logoUrl || ''} onChange={handleChange} placeholder="/logo.png" className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-gold focus:outline-none mb-2" />
                    <p className="text-brand-muted text-xs">Enter full URL or relative path.</p>
                  </div>
                </div>
              </div>
              <div className="pt-6">
                <label className="text-xs text-brand-muted uppercase tracking-wider mb-2 block">Primary Brand Color</label>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg border border-white/10" style={{ backgroundColor: settings.primaryColor || '#d4af37' }}></div>
                  <input type="text" name="primaryColor" value={settings.primaryColor || ''} onChange={handleChange} className="w-32 bg-brand-dark border border-white/10 rounded-xl px-4 py-2 text-white font-mono focus:border-brand-gold focus:outline-none" />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'content' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">
              <h3 className="text-xl font-heading text-white border-b border-white/10 pb-4 mb-6">Website Content</h3>
              <p className="text-brand-muted text-sm -mt-2">Edit the live text shown on your public website pages.</p>
              <div className="bg-brand-dark/50 border border-brand-gold/20 rounded-2xl p-6 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-brand-gold/10 rounded-lg flex items-center justify-center">
                    <span className="text-brand-gold text-xs font-bold">H</span>
                  </div>
                  <p className="text-white font-heading font-semibold">Hero Section</p>
                </div>
                <div>
                  <label className="text-xs text-brand-muted uppercase tracking-wider mb-2 block">Hero Title</label>
                  <input
                    type="text"
                    name="heroTitle"
                    value={settings.heroTitle || ''}
                    onChange={handleChange}
                    className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-gold focus:outline-none font-heading tracking-wide"
                    placeholder="e.g. FORGE YOUR BEST BODY EVER"
                  />
                  <p className="text-brand-muted text-xs mt-1">This is the large headline on the homepage hero section.</p>
                </div>
                <div>
                  <label className="text-xs text-brand-muted uppercase tracking-wider mb-2 block">Hero Subtitle</label>
                  <textarea
                    name="heroSubtitle"
                    value={settings.heroSubtitle || ''}
                    onChange={handleChange}
                    className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-gold focus:outline-none leading-relaxed"
                    rows="4"
                    placeholder="e.g. Biromechanically optimized configurations, expert kinetic tracking..."
                  />
                  <p className="text-brand-muted text-xs mt-1">Descriptive text shown beneath the hero title.</p>
                </div>
                {/* Live Preview */}
                <div className="bg-brand-darker rounded-xl p-5 border border-white/5">
                  <p className="text-[10px] text-brand-muted uppercase tracking-widest mb-3">Live Preview</p>
                  <p className="text-white font-display text-xl tracking-tight uppercase leading-tight">
                    {settings.heroTitle || 'FORGE YOUR BEST BODY EVER'}
                  </p>
                  <p className="text-white/50 text-xs mt-2 leading-relaxed font-body">
                    {settings.heroSubtitle || 'Biromechanically optimized configurations, expert kinetic tracking, and an uncompromising iron environment.'}
                  </p>
                </div>
              </div>

              <div className="bg-brand-dark/50 border border-brand-gold/20 rounded-2xl p-6 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-brand-gold/10 rounded-lg flex items-center justify-center">
                    <span className="text-brand-gold text-xs font-bold">A</span>
                  </div>
                  <p className="text-white font-heading font-semibold">About Us Section</p>
                </div>
                <div>
                  <label className="text-xs text-brand-muted uppercase tracking-wider mb-2 block">About Title</label>
                  <input
                    type="text"
                    name="aboutTitle"
                    value={settings.aboutTitle || ''}
                    onChange={handleChange}
                    className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-gold focus:outline-none font-display tracking-wide"
                    placeholder="e.g. MORE THAN JUST A GYM"
                  />
                  <p className="text-brand-muted text-xs mt-1">This is the large headline on the about us section.</p>
                </div>
                <div>
                  <label className="text-xs text-brand-muted uppercase tracking-wider mb-2 block">About Subtitle</label>
                  <textarea
                    name="aboutSubtitle"
                    value={settings.aboutSubtitle || ''}
                    onChange={handleChange}
                    className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-gold focus:outline-none leading-relaxed"
                    rows="4"
                    placeholder="e.g. Quads Fitness Gym has been transforming bodies..."
                  />
                  <p className="text-brand-muted text-xs mt-1">Descriptive text shown beneath the about us title.</p>
                </div>
                {/* Live Preview */}
                <div className="bg-brand-darker rounded-xl p-5 border border-white/5">
                  <p className="text-[10px] text-brand-muted uppercase tracking-widest mb-3">Live Preview</p>
                  <p className="text-white font-display text-xl tracking-tight uppercase leading-tight">
                    {settings.aboutTitle || 'MORE THAN JUST A GYM'}
                  </p>
                  <p className="text-white/50 text-xs mt-2 leading-relaxed font-body">
                    {settings.aboutSubtitle || 'Quads Fitness Gym has been transforming bodies and mindsets in Ludhiana for over 8 years.'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'social' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">
              <h3 className="text-xl font-heading text-white border-b border-white/10 pb-4 mb-6">Social Media Links</h3>
              {['instagram', 'facebook', 'twitter', 'youtube'].map(platform => (
                <div key={platform}>
                  <label className="text-xs text-brand-muted uppercase tracking-wider mb-2 block">{platform}</label>
                  <input type="url" name={platform} value={settings[platform] || ''} onChange={handleChange} placeholder={`https://${platform}.com/yourhandle`} className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-gold focus:outline-none" />
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'operating' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">
              <h3 className="text-xl font-heading text-white border-b border-white/10 pb-4 mb-6">Operating Hours</h3>
              <p className="text-brand-muted text-sm mb-6">Set your gym opening hours. Format e.g. "05:00 - 23:00" or "Closed".</p>

              <div className="space-y-4">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                  <div key={day} className="flex items-center gap-4 bg-brand-dark p-3 rounded-xl border border-white/5">
                    <div className="w-24 text-white font-medium text-sm capitalize">{day}</div>
                    <input type="text" name={`${day}Hours`} value={settings[`${day}Hours`] || ''} onChange={handleChange} className="flex-1 bg-brand-surface border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-gold" />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
