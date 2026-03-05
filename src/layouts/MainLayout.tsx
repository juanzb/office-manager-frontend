import React from 'react';
import { NavLink, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Wrench, 
  ClipboardList, 
  LogOut,
  User as UserIcon,
  Settings,
  ChevronRight
} from 'lucide-react';
import { Permission } from '../types/enums';

const MainLayout: React.FC = () => {
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} />, permission: null },
    { to: '/users', label: 'Usuarios', icon: <Users size={20} />, permission: Permission.READ_USERS },
    { to: '/tools', label: 'Herramientas', icon: <Wrench size={20} />, permission: Permission.READ_TOOLS },
    { to: '/loans', label: 'Préstamos', icon: <ClipboardList size={20} />, permission: Permission.READ_LOANS },
    { to: '/my-loans', label: 'Mis Préstamos', icon: <ClipboardList size={20} />, permission: null },
    { to: '/settings', label: 'Configuración', icon: <Settings size={20} />, permission: Permission.MANAGE_SETTINGS },
  ];

  const currentTitle = navItems.find(item => item.to === location.pathname)?.label || 'Dashboard';

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-2xl transition-all duration-300 flex-shrink-0">
        <div className="p-6">
          <h2 className="text-xl font-black tracking-tighter text-white flex items-center gap-2">
            <span className="bg-white text-slate-900 p-1 rounded-lg">OM</span>
            Office Manager
          </h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            if (item.permission && !hasPermission(item.permission)) return null;
            return (
              <NavLink 
                key={item.to} 
                to={item.to} 
                className={({ isActive }) => `
                  flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive ? 'bg-white/10 text-white shadow-inner' : 'text-slate-400 hover:bg-white/5 hover:text-white'}
                `}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </div>
                <ChevronRight size={14} className={`transition-all duration-300 ${location.pathname === item.to ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} />
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-semibold border border-transparent hover:border-red-500/20"
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10 flex-shrink-0">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">{currentTitle}</h1>
          
          <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 leading-none">{user?.name}</p>
              <p className="text-[10px] text-slate-500 mt-1 font-black uppercase tracking-widest">{user?.role}</p>
            </div>
            {user?.avatar ? (
              <img src={`http://localhost:3000${user.avatar}`} alt="Avatar" className="w-10 h-10 rounded-xl object-cover ring-2 ring-white shadow-sm" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center shadow-sm ring-2 ring-white">
                <UserIcon size={20} />
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
