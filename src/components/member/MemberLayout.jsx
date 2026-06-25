import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import MemberSidebar from './MemberSidebar';
import { Menu, X } from 'lucide-react';

export default function MemberLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-brand-darker font-sans text-brand-gray overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-brand-dark border-r border-brand-gold/10 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <MemberSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Header (Mobile Only) */}
        <div className="flex items-center justify-between p-4 bg-brand-dark border-b border-brand-gold/10 lg:hidden">
          <span className="font-heading text-xl text-brand-gold uppercase tracking-wider">Quads Member</span>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-brand-gold hover:bg-brand-darker rounded-md focus:outline-none"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-darker p-4 md:p-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
