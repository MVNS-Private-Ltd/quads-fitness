import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGrid, FiUsers, FiMessageSquare, FiSettings, FiLogOut, FiMenu, FiX, FiActivity, FiTrendingUp, FiDollarSign, FiCalendar, FiCheckSquare, FiList, FiEdit2, FiTrash2, FiClipboard, FiSearch, FiBell, FiPlus, FiFileText, FiUpload, FiGlobe, FiUserPlus, FiMessageCircle, FiStar, FiImage, FiTag } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

import CMSPage from './admin/CMSPage';
import TrainersPage from './admin/TrainersPage';
import PlansPage from './admin/PlansPage';
import LeadsPage from './admin/LeadsPage';
import GalleryPage from './admin/GalleryPage';
import ReviewsPage from './admin/ReviewsPage';
import ActivityLogsPage from './admin/ActivityLogsPage';
import SettingsPage from './admin/SettingsPage';
import UsersPage from './admin/UsersPage';
import ProgramsPage from './admin/ProgramsPage';
import DietPlansPage from './admin/DietPlansPage';
import AttendancePage from './admin/AttendancePage';
import AdminQrAttendancePage from './admin/AdminQrAttendancePage';
import { getStats, getMembers, getLeads, getAdminNotifications, markNotificationRead } from '../services/api';
import { logoutAdmin } from '../lib/adminAuth';
import BrandLogo from '../components/BrandLogo';






// Reusable Animation Variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: 'easeIn' } }
};

// --- Sub-Pages ---

const Overview = () => {
  const [stats, setStats] = useState({ totalMembers: 0, activePrograms: 0, unreadLeads: 0, totalRevenue: 0, monthlyData: [], weeklyAttendanceData: [] });
  const [recentUsers, setRecentUsers] = useState([]);
  const [unreadMsgs, setUnreadMsgs] = useState([]);

  useEffect(() => {
    getStats().then(data => setStats(data || {})).catch(() => {});
    getMembers().then(data => {
      const allMembers = data || [];
      // Sort by joinedAt desc and take 3
      allMembers.sort((a,b) => new Date(b.joinedAt) - new Date(a.joinedAt));
      setRecentUsers(allMembers.slice(0, 3));
    }).catch(() => {});
    getLeads().then(data => setUnreadMsgs((data || []).filter(l => l.status === 'Unread').slice(0, 5))).catch(() => {});
  }, []);



  return (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
    <div>
      <h2 className="text-3xl font-display text-white mb-2">Dashboard Overview</h2>
      <p className="text-brand-muted font-body">Welcome back! Here's what's happening today.</p>
    </div>

    {/* Stats Top Area */}
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
      {/* Members Status — Donut Pie Chart (Takes 2 cols) */}
      <div className="lg:col-span-2 bg-brand-surface2 border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xl font-heading text-white">Members Status</h3>
        </div>
        <p className="text-brand-muted text-xs mb-4">Current active vs inactive breakdown.</p>

        {/* Legend pills */}
        <div className="flex gap-4 mb-4">
          {[
            { label: 'Active',       color: '#d4af37' },
            { label: 'Inactive',     color: '#6b7280' },
            { label: 'Never Checked-In', color: '#4f46e5' },
          ].map(l => (
            <span key={l.label} className="flex items-center gap-1.5 text-xs text-white/60">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: l.color }} />
              {l.label}
            </span>
          ))}
        </div>

        <div className="relative h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                <filter id="glow-gold">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <Pie
                data={[
                  { name: 'Active',           value: stats.activeMembers   || 0 },
                  { name: 'Inactive',         value: Math.max(0, (stats.totalMembers || 0) - (stats.activeMembers || 0)) },
                  { name: 'Never Checked-In', value: 0 },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                <Cell fill="#d4af37" />
                <Cell fill="#4b5563" />
                <Cell fill="#4f46e5" />
              </Pie>
              <RechartsTooltip
                contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', fontSize: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Centre label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-3xl font-display text-white leading-none">{stats.totalMembers || 0}</p>
            <p className="text-xs text-brand-muted mt-1">Total</p>
          </div>
        </div>

        {/* Stat pills below */}
        <div className="flex justify-around mt-4 pt-4 border-t border-white/5">
          <div className="text-center">
            <p className="text-xl font-display text-brand-gold">{stats.activeMembers || 0}</p>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Active</p>
          </div>
          <div className="w-px bg-white/5" />
          <div className="text-center">
            <p className="text-xl font-display text-gray-400">{Math.max(0,(stats.totalMembers||0)-(stats.activeMembers||0))}</p>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Inactive</p>
          </div>
          <div className="w-px bg-white/5" />
          <div className="text-center">
            <p className="text-xl font-display text-indigo-400">0</p>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Never</p>
          </div>
        </div>
      </div>

      {/* Monthly Overview — Dual Line Chart */}
      <div className="lg:col-span-3 bg-brand-surface2 border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="text-xl font-heading text-white">Monthly Overview</h3>
            <p className="text-brand-muted text-xs mt-0.5">Track performance trends over the selected months.</p>
          </div>
          <span className="text-xs text-brand-muted bg-brand-dark border border-white/10 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Last 6 Months
          </span>
        </div>

        {/* Legend */}
        <div className="flex gap-6 mb-4 mt-3">
          <span className="flex items-center gap-2 text-xs text-white/60">
            <span className="w-6 h-0.5 rounded-full inline-block" style={{ backgroundColor: '#ff6b6b' }} />Primary Metric
          </span>
          <span className="flex items-center gap-2 text-xs text-white/60">
            <span className="w-6 h-0.5 rounded-full inline-block" style={{ backgroundColor: '#6366f1' }} />Secondary Metric
          </span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.monthlyData?.length ? stats.monthlyData : []} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="lineGradPrimary" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ff6b6b" />
                  <stop offset="100%" stopColor="#ff8c42" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" stroke="#555" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#555" fontSize={11} tickLine={false} axisLine={false} />
              <RechartsTooltip
                contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', fontSize: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Line
                type="monotone"
                dataKey="members"
                stroke="url(#lineGradPrimary)"
                strokeWidth={2.5}
                dot={{ fill: '#ff6b6b', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#ff6b6b' }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ fill: '#6366f1', r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#6366f1' }}
                strokeDasharray="0"
                opacity={0.7}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>



    {/* Row 2: Weekly Attendance + Unread Messages */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      <div className="lg:col-span-2 bg-brand-surface2 border border-white/5 rounded-2xl p-6">
        <h3 className="text-xl font-heading text-white mb-6">Weekly Attendance</h3>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.weeklyAttendanceData?.length ? stats.weeklyAttendanceData : []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <RechartsTooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Bar dataKey="attendance" fill="#ff6b35" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-brand-surface2 border border-white/5 rounded-2xl p-6">
        <h3 className="text-xl font-heading text-white mb-4">Unread Messages</h3>
        <div className="space-y-4">
          {unreadMsgs.length === 0 ? (
            <p className="text-brand-muted text-sm text-center py-4">No unread messages</p>
          ) : unreadMsgs.map(msg => (
            <div key={msg.id} className="p-4 bg-brand-dark rounded-xl border border-white/5 hover:border-brand-orange/30 transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-white font-medium text-sm">{msg.name}</h4>
                <span className="text-brand-orange text-xs">New</span>
              </div>
              <p className="text-brand-muted text-sm truncate">{msg.subject || 'New Inquiry'}</p>
            </div>
          ))}
          <Link to="/admin/leads" className="block text-center w-full py-3 mt-2 text-sm font-heading text-brand-gold hover:text-white transition-colors border border-brand-gold/20 hover:border-brand-gold rounded-xl">
            View All Messages
          </Link>
        </div>
      </div>
    </div>

    {/* Row 3: Recent Registrations */}
    <div className="mt-6">
      <div className="bg-brand-surface2 border border-white/5 rounded-2xl p-6">
        <h3 className="text-xl font-heading text-white mb-4">Recent Registrations</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-3 px-4 text-brand-muted font-body text-sm">Name</th>
                <th className="py-3 px-4 text-brand-muted font-body text-sm">Plan</th>
                <th className="py-3 px-4 text-brand-muted font-body text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.length === 0 ? (
                <tr><td colSpan="3" className="py-4 px-4 text-brand-muted text-sm text-center">No recent members</td></tr>
              ) : recentUsers.map(user => (
                <tr key={user.id} className="border-b border-white/5 last:border-0 hover:bg-brand-dark/50 transition-colors">
                  <td className="py-3 px-4 text-white font-medium">{user.name}</td>
                  <td className="py-3 px-4 text-brand-gold">{user.plan?.name || 'No Plan'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </motion.div>
  );
};



// --- Main Admin Layout ---

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const loadNotifications = () => {
    getAdminNotifications()
      .then(data => setNotifications(data || []))
      .catch(() => {});
  };

  useEffect(() => {
    loadNotifications();
  }, [location.pathname]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkRead = async (id, e) => {
    e.stopPropagation();
    try {
      await markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (_) {}
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    await Promise.all(unread.map(n => markNotificationRead(n.id).catch(() => {})));
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const getNotifIcon = (type) => {
    const icons = {
      EXPIRY: '🔴',
      REMINDER: '⏰',
      REVIEW: '⭐',
      LEAD: '📩',
    };
    return icons[type] || '🔔';
  };

  const getNotifRoute = (type) => {
    const routes = {
      EXPIRY: '/admin/users',
      REMINDER: '/admin/users',
      REVIEW: '/admin/reviews',
      LEAD: '/admin/leads',
    };
    return routes[type] || '/admin';
  };

  const formatTimeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const navItems = [
    { name: 'Overview', path: '/admin', icon: FiGrid },
    { name: 'Website Content', path: '/admin/cms', icon: FiGlobe },
    { name: 'Trainers', path: '/admin/trainers', icon: FiUserPlus },
    { name: 'Plans', path: '/admin/plans', icon: FiDollarSign },
    { name: 'Inquiries', path: '/admin/leads', icon: FiMessageCircle },
    { name: 'Member Reviews', path: '/admin/reviews', icon: FiMessageSquare },
    { name: 'Gallery', path: '/admin/gallery', icon: FiImage },
    { name: 'Activity Logs', path: '/admin/logs', icon: FiActivity },
    { name: 'Members', path: '/admin/users', icon: FiUsers },
    { name: 'Programs', path: '/admin/programs', icon: FiList },
    { name: 'Diet Plans', path: '/admin/diet-plans', icon: FiClipboard },
    { name: 'Attendance', path: '/admin/attendance', icon: FiCheckSquare },
    { name: 'Settings', path: '/admin/settings', icon: FiSettings },
  ];

  return (
    <div className="flex h-screen w-full bg-brand-darker font-body text-white overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-brand-surface2 border-r border-white/5 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}
      >
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          <Link to="/" className="flex items-center gap-3">
            <BrandLogo className="h-8 w-8 object-cover object-top" alt="Quads Fitness logo" />
            <span className="text-xl font-display tracking-wider text-white">
              QUADS<span className="text-brand-gold">.ADMIN</span>
            </span>
          </Link>
          <button className="lg:hidden text-brand-muted hover:text-white" onClick={() => setSidebarOpen(false)}>
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <p className="text-xs font-bold text-brand-muted tracking-widest uppercase mb-4">Menu</p>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
              return (
                <Link 
                  key={item.name} 
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20' : 'text-brand-muted hover:bg-white/5 hover:text-white'}`}
                >
                  <item.icon size={20} className={isActive ? 'text-brand-gold' : ''} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-white/5">
          <button 
            onClick={logoutAdmin}
            className="flex items-center space-x-3 text-brand-muted hover:text-white transition-colors w-full px-4 py-3 rounded-xl hover:bg-white/5"
          >
            <FiLogOut size={20} />
            <span className="font-medium">Exit Admin</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-20 bg-brand-surface2/50 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 lg:px-10 z-10">
          <div className="flex items-center space-x-4">
            <button className="lg:hidden text-white" onClick={() => setSidebarOpen(true)}>
              <FiMenu size={24} />
            </button>
            <h1 className="text-xl font-heading text-white hidden sm:block">
              {navItems.find(item => location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path)))?.name || 'Dashboard'}
            </h1>
          </div>
          
          <div className="hidden md:flex items-center bg-brand-dark border border-white/10 rounded-full px-4 py-2 flex-1 max-w-md mx-6 focus-within:border-brand-gold transition-colors relative">
            <FiSearch className="text-brand-muted mr-3" />
            <input 
              type="text" 
              placeholder="Search members, plans, inquiries..." 
              className="bg-transparent text-sm text-white focus:outline-none w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* Search Dropdown Mock */}
            {searchQuery && (
              <div className="absolute top-full left-0 mt-2 w-full bg-brand-surface2 border border-white/5 rounded-xl shadow-2xl p-2 z-50">
                <div className="px-3 py-2 text-xs font-bold text-brand-muted uppercase tracking-wider">Results for "{searchQuery}"</div>
                <div className="p-3 text-sm text-brand-gold hover:bg-white/5 rounded-lg cursor-pointer">Searching...</div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                className="relative p-2 text-brand-muted hover:text-white transition-colors"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <FiBell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-brand-orange rounded-full text-[10px] font-bold flex items-center justify-center text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-96 bg-brand-surface2 border border-white/5 rounded-2xl shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-white/5 flex justify-between items-center bg-brand-dark">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-medium">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="bg-brand-orange text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button onClick={handleMarkAllRead} className="text-xs text-brand-gold cursor-pointer hover:text-white transition-colors">
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-brand-muted text-sm">
                          <FiBell size={24} className="mx-auto mb-2 opacity-30" />
                          No notifications yet
                        </div>
                      ) : notifications.map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => { setShowNotifications(false); navigate(getNotifRoute(notif.type)); }}
                          className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer flex items-start gap-3 ${!notif.isRead ? 'bg-brand-gold/5' : ''}`}
                        >
                          <span className="text-lg flex-shrink-0 mt-0.5">{getNotifIcon(notif.type)}</span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${notif.isRead ? 'text-brand-muted' : 'text-white font-medium'} line-clamp-2`}>
                              {notif.message}
                            </p>
                            <p className="text-xs text-brand-muted mt-1">{formatTimeAgo(notif.createdAt)}</p>
                          </div>
                          {!notif.isRead && (
                            <button
                              onClick={(e) => handleMarkRead(notif.id, e)}
                              className="flex-shrink-0 w-2 h-2 bg-brand-orange rounded-full mt-1.5 hover:opacity-60 transition-opacity"
                              title="Mark as read"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-white/5 text-center bg-brand-dark">
                      <Link to="/admin/logs" className="text-xs text-brand-gold hover:text-white transition-colors" onClick={() => setShowNotifications(false)}>View Activity Logs</Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button className="relative p-2 text-brand-muted hover:text-white transition-colors">
              <FiMessageSquare size={20} />
            </button>
            <div className="h-8 w-px bg-white/10 mx-2"></div>
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white group-hover:text-brand-gold transition-colors">Admin User</p>
                <p className="text-xs text-brand-muted">Superadmin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-brand-gold/20 border border-brand-gold flex items-center justify-center text-brand-gold font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 relative">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-[100px] pointer-events-none" />
          
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Overview />} />
              <Route path="cms" element={<CMSPage />} />
              <Route path="trainers" element={<TrainersPage />} />
              <Route path="plans" element={<PlansPage />} />
              <Route path="leads" element={<LeadsPage />} />
              <Route path="reviews" element={<ReviewsPage />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="logs" element={<ActivityLogsPage />} />
              <Route path="programs" element={<ProgramsPage />} />
              <Route path="diet-plans" element={<DietPlansPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="attendance/qr" element={<AdminQrAttendancePage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
