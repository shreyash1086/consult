import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  History, 
  Settings, 
  LogOut, 
  Users, 
  FileText, 
  BarChart3,
  ShieldCheck
} from 'lucide-react';
import { useAuthStore } from '../store/auth.store';
import { Role } from '../types';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      logout();
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const navItems = {
    [Role.CANDIDATE]: [
      { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
      { to: '/assessments', icon: <BookOpen size={20} />, label: 'Assessments' },
      { to: '/submissions', icon: <History size={20} />, label: 'My History' },
    ],
    [Role.TRAINER]: [
      { to: '/dashboard', icon: <FileText size={20} />, label: 'Submissions' },
      { to: '/admin/analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
    ],
    [Role.ADMIN]: [
      { to: '/admin/scenarios', icon: <Settings size={20} />, label: 'Scenarios' },
      { to: '/admin/users', icon: <Users size={20} />, label: 'Users' },
      { to: '/admin/analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
    ],
  };

  const currentNav = user ? navItems[user.role] : [];

  return (
    <div className="w-72 h-screen bg-near-black border-r border-white/5 flex flex-col p-6 sticky top-0">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-brand-red/20">
          C
        </div>
        <div>
          <span className="text-xl font-bold tracking-tight text-white">Consult</span>
          <span className="text-brand-red font-bold">AI</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/20 mb-4 px-2">Menu</p>
        {currentNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300
              ${isActive 
                ? 'bg-brand-red/10 text-brand-red font-bold translate-x-1 shadow-[4px_0_0_0_#E84040' 
                : 'text-white/40 hover:text-white hover:bg-white/5'}
            `}
          >
            {item.icon}
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-4 pt-6 border-t border-white/5 px-2">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white/40">
            {user?.name.charAt(0)}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-white/20 uppercase tracking-widest">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-white/40 hover:text-red-500 hover:bg-red-500/5 transition-all text-sm group"
        >
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
