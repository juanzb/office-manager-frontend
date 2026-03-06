import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { 
  Users, 
  Wrench, 
  ClipboardList, 
  AlertTriangle,
  ArrowRight,
  UserPlus,
  Clock,
  CheckCircle2,
  XCircle,
  Search
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    users: 0,
    tools: 0,
    activeLoans: 0,
    availableTools: 0
  });
  const [recentLoans, setRecentLoans] = useState([]);
  const [availableToolsList, setAvailableToolsList] = useState([]);
  const [usersWithoutTools, setUsersWithoutTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, toolsRes, loansRes, availableRes] = await Promise.all([
          api.get('/users?limit=100'),
          api.get('/tools?limit=100'),
          api.get('/loans?limit=5&sort=createdAt:DESC'),
          api.get('/tools/available?limit=5')
        ]);

        const allUsers = usersRes.data.data;
        const activeLoans = loansRes.data.data; // Note: This might be just the first 5

        // To calculate users without tools, we need ALL active loans or a specific endpoint
        // For now, let's fetch a bit more or assume the user has a small enough dataset for this example
        const allActiveLoansRes = await api.get('/loans?status=active&limit=100');
        const activeLoanUserIds = new Set(allActiveLoansRes.data.data.map((l: any) => l.userId));
        
        const withoutTools = allUsers.filter((u: any) => !activeLoanUserIds.has(u.id)).slice(0, 5);

        setStats({
          users: usersRes.data.meta.total,
          tools: toolsRes.data.meta.total,
          activeLoans: allActiveLoansRes.data.meta.total,
          availableTools: availableRes.data.meta.total
        });

        setRecentLoans(loansRes.data.data);
        setAvailableToolsList(availableRes.data.data);
        setUsersWithoutTools(withoutTools);

      } catch (error) {
        console.error('Error fetching dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { label: 'Usuarios Totales', value: stats.users, icon: <Users size={24} />, color: 'bg-indigo-600', textColor: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    { label: 'Herramientas', value: stats.tools, icon: <Wrench size={24} />, color: 'bg-emerald-600', textColor: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { label: 'Préstamos Activos', value: stats.activeLoans, icon: <ClipboardList size={24} />, color: 'bg-amber-600', textColor: 'text-amber-600', bgColor: 'bg-amber-50' },
    { label: 'Disp. para Préstamo', value: stats.availableTools, icon: <AlertTriangle size={24} />, color: 'bg-rose-600', textColor: 'text-rose-600', bgColor: 'bg-rose-50' },
  ];

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white rounded-3xl border border-slate-100 shadow-sm"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-96 bg-white rounded-3xl border border-slate-100 shadow-sm"></div>
          <div className="h-96 bg-white rounded-3xl border border-slate-100 shadow-sm"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 group">
            <div className={`${card.bgColor} ${card.textColor} w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500`}>
              {card.icon}
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Activity / Loans */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Préstamos Recientes</h3>
                <p className="text-sm text-slate-500 font-medium">Últimos movimientos registrados</p>
              </div>
              <Link to="/loans" className="p-3 bg-slate-50 text-slate-600 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all group">
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentLoans.length > 0 ? (
                recentLoans.map((loan: any) => (
                  <div key={loan.id} className="flex items-center justify-between p-4 rounded-3xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                        <Clock size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 leading-none mb-1">{loan.tool?.name || 'Herramienta'}</p>
                        <p className="text-xs text-slate-500 font-medium">Asignado a <span className="text-indigo-600 font-bold">{loan.user?.name}</span></p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div className="hidden sm:block">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Fecha</p>
                        <p className="text-sm font-bold text-slate-700">{new Date(loan.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
                        loan.status === 'active' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {loan.status === 'active' ? 'Activo' : 'Devuelto'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <ClipboardList size={48} className="mb-4 opacity-10" />
                  <p className="font-bold">No hay préstamos registrados</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Available Tools */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Herramientas Libres</h3>
                <Link to="/tools" className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">Ver todas</Link>
              </div>
              <div className="space-y-4">
                {availableToolsList.map((tool: any) => (
                  <div key={tool.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Wrench size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{tool.name}</p>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{tool.code}</p>
                    </div>
                    <div className="ml-auto">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 block"></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Users without tools */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Usuarios sin Herramientas</h3>
                <Link to="/users" className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">Ver todos</Link>
              </div>
              <div className="space-y-4">
                {usersWithoutTools.map((user: any) => (
                  <div key={user.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                      <Users size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{user.role}</p>
                    </div>
                    <div className="ml-auto">
                      <UserPlus size={16} className="text-slate-300 hover:text-indigo-600 cursor-pointer transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Quick Stats */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-200 text-white relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-4 leading-tight">Acciones Rápidas</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/loans')}
                  className="w-full bg-white text-indigo-600 font-black py-4 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <ClipboardList size={20} />
                  Nuevo Préstamo
                </button>
                <button 
                  onClick={() => navigate('/tools')}
                  className="w-full bg-indigo-500 text-white font-black py-4 rounded-2xl hover:bg-indigo-400 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Wrench size={20} />
                  Añadir Herramienta
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-lg font-black text-slate-900 tracking-tight mb-6">Resumen de Estado</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                  <CheckCircle2 size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Disponibilidad</p>
                    <p className="text-sm font-black text-slate-900">{Math.round((stats.availableTools / (stats.tools || 1)) * 100)}%</p>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                      style={{ width: `${(stats.availableTools / (stats.tools || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner">
                  <Clock size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Uso de Herramientas</p>
                    <p className="text-sm font-black text-slate-900">{Math.round((stats.activeLoans / (stats.tools || 1)) * 100)}%</p>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full transition-all duration-1000" 
                      style={{ width: `${(stats.activeLoans / (stats.tools || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center">
                  <Search size={24} />
               </div>
               <div>
                 <h4 className="font-black tracking-tight">Búsqueda Global</h4>
                 <p className="text-xs text-slate-400 font-medium">Encuentra lo que necesites</p>
               </div>
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Buscar usuario o herramienta..." 
                className="w-full bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-600 transition-all"
              />
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
