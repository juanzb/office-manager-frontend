import React, { useState } from 'react';
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
  ChevronRight,
  Menu,
  X,
  Bell
} from 'lucide-react';
import { Permission } from '../types/enums';

const MainLayout: React.FC = () => {
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <nav className="flex-1 px-4 space-y-2 mt-4">
      {navItems.map((item) => {
        if (item.permission && !hasPermission(item.permission)) return null;
        return (
          <NavLink 
            key={item.to} 
            to={item.to} 
            onClick={onClick}
            className={({ isActive }) => `
              flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group
              ${isActive 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                : 'text-slate-500 hover:bg-slate-100 hover:text-indigo-600'}
            `}
          >
            <div className="flex items-center gap-3">
              <span className={`transition-transform duration-300 group-hover:scale-110`}>
                {item.icon}
              </span>
              <span className="font-semibold tracking-tight">{item.label}</span>
            </div>
            <ChevronRight size={14} className={`transition-all duration-300 ${location.pathname === item.to ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} />
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col sticky top-0 h-screen z-20">
        <div className="p-8">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-indigo-600 text-white p-2.5 rounded-2xl shadow-xl shadow-indigo-100 group-hover:rotate-12 transition-transform duration-500">
              <Wrench size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight leading-none">OFFICE</h2>
              <p className="text-xs font-black text-indigo-600 tracking-[0.2em] mt-1">MANAGER</p>
            </div>
          </div>
        </div>
        
        <NavLinks />

        <div className="p-6 mt-auto border-t border-slate-100">
          <div className="bg-slate-50 rounded-3xl p-4 mb-4 flex items-center gap-3">
             {user?.avatar ? (
              <img src={`http://localhost:3000${user.avatar}`} alt="Avatar" className="w-10 h-10 rounded-xl object-cover ring-2 ring-white shadow-sm" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm">
                <UserIcon size={20} />
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest truncate">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-red-500 hover:bg-red-50 font-bold rounded-2xl transition-all active:scale-95"
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Mobile */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-white z-50 transform transition-transform duration-500 ease-in-out lg:hidden shadow-2xl
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2.5 rounded-2xl">
              <Wrench size={24} />
            </div>
            <h2 className="text-xl font-black tracking-tight">OFFICE</h2>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl">
            <X size={24} />
          </button>
        </div>
        <NavLinks onClick={() => setIsMobileMenuOpen(false)} />
        <div className="absolute bottom-0 w-full p-6 border-t border-slate-100">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 px-4 py-4 text-red-500 bg-red-50 font-bold rounded-2xl"
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2.5 hover:bg-slate-100 rounded-2xl text-slate-600 transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{currentTitle}</h1>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-10 w-px bg-slate-200 mx-2 hidden md:block"></div>
            
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">{user?.name}</p>
                <p className="text-[10px] text-slate-500 mt-1 font-black uppercase tracking-widest">{user?.role}</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-slate-100 ring-4 ring-slate-50 overflow-hidden cursor-pointer hover:ring-indigo-100 transition-all">
                 {user?.avatar ? (
                  <img src={`http://localhost:3000${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <UserIcon size={20} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50">
          <div className="max-w-7xl mx-auto space-y-8 pb-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
