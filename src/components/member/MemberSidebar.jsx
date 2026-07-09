import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  Activity, 
  CalendarCheck, 
  CreditCard,
  LogOut,
  X,
  MessageSquare,
  Utensils
} from 'lucide-react';
import { logoutMember } from '../../lib/memberAuth';
import BrandLogo from '../../components/BrandLogo';

const navItems = [
  { name: 'Dashboard', path: '/member/dashboard', icon: LayoutDashboard },
  { name: 'Profile', path: '/member/profile', icon: User },
  { name: 'Progress', path: '/member/progress', icon: Activity },
  { name: 'Attendance', path: '/member/attendance', icon: CalendarCheck },
  { name: 'Membership', path: '/member/membership', icon: CreditCard },
  { name: 'Diet Plans', path: '/member/diet', icon: Utensils },
  { name: 'Rate Us', path: '/member/review', icon: MessageSquare },
];

export default function MemberSidebar({ onClose }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutMember();
    navigate('/member/login');
  };

  return (
    <div className="flex flex-col h-full bg-brand-dark text-brand-gray">
      {/* Logo Area */}
      <div className="flex items-center justify-between h-20 px-6 border-b border-brand-gold/10">
        <BrandLogo className="h-10 w-auto" alt="Quads Fitness logo" />
        <button onClick={onClose} className="lg:hidden text-brand-gold p-2">
          <X size={24} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                isActive
                  ? 'bg-brand-gold/10 text-brand-gold shadow-[inset_4px_0_0_0_#d4af37]'
                  : 'text-brand-gray hover:bg-brand-darker hover:text-brand-gold'
              }`
            }
          >
            <item.icon size={20} className="mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-brand-gold/10">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-brand-gray hover:text-brand-red hover:bg-brand-darker rounded-lg transition-all duration-300 font-medium group"
        >
          <LogOut size={20} className="mr-3 group-hover:text-brand-red transition-colors" />
          Log Out
        </button>
      </div>
    </div>
  );
}
