import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { 
  Users, 
  Wrench, 
  ClipboardList, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    users: 0,
    tools: 0,
    activeLoans: 0,
    availableTools: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, toolsRes, loansRes, availableRes] = await Promise.all([
          api.get('/users?limit=1'),
          api.get('/tools?limit=1'),
          api.get('/loans?limit=100'),
          api.get('/tools/available?limit=1')
        ]);

        setStats({
          users: usersRes.data.meta.total,
          tools: toolsRes.data.meta.total,
          activeLoans: loansRes.data.data.filter((l: any) => l.status === 'active').length,
          availableTools: availableRes.data.meta.total
        });
      } catch (error) {
        console.error('Error fetching dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Usuarios Totales', value: stats.users, icon: <Users size={24} />, color: 'bg-indigo-500' },
    { label: 'Herramientas Totales', value: stats.tools, icon: <Wrench size={24} />, color: 'bg-emerald-500' },
    { label: 'Préstamos Activos', value: stats.activeLoans, icon: <ClipboardList size={24} />, color: 'bg-amber-500' },
    { label: 'Disp. para Préstamo', value: stats.availableTools, icon: <AlertTriangle size={24} />, color: 'bg-rose-500' },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-2xl shadow-sm border border-gray-100"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 hover:shadow-md transition-shadow cursor-default group">
            <div className={`${card.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">{card.label}</p>
              <h3 className="text-3xl font-black text-gray-900 tracking-tight">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Actividad Reciente</h3>
            <button className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
              Ver todo <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
            <ClipboardList size={48} className="mb-4 opacity-20" />
            <p className="font-medium">No hay actividad reciente para mostrar</p>
          </div>
        </div>

        <div className="bg-indigo-600 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
          
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-2 leading-tight">Acceso Rápido</h3>
            <p className="text-indigo-100 text-sm leading-relaxed mb-8">Gestiona el inventario y los préstamos de forma ágil desde el panel.</p>
          </div>

          <div className="space-y-3 relative z-10">
            <button className="w-full bg-white text-indigo-600 font-bold py-4 rounded-2xl shadow-sm hover:shadow-lg transition-all active:scale-[0.98]">
              Registrar Nuevo Préstamo
            </button>
            <button className="w-full bg-indigo-500 text-white font-bold py-4 rounded-2xl hover:bg-indigo-400 transition-all active:scale-[0.98]">
              Añadir Herramienta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
