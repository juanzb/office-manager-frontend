import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Loan, User, Tool } from '../types';
import Modal from '../components/Modal';
import { 
  Search,
  CheckCircle,
  Clock,
  RotateCcw,
  Plus,
  History,
  User as UserIcon,
  Wrench,
  Save,
  Loader2
} from 'lucide-react';

const LoansPage: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    userId: '',
    toolId: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [loansRes, usersRes, toolsRes] = await Promise.all([
        api.get('/loans'),
        api.get('/users'),
        api.get('/tools')
      ]);
      setLoans(loansRes.data.data);
      setUsers(usersRes.data.data);
      // Filter only available tools for the form
      setTools(toolsRes.data.data.filter((t: Tool) => t.isAvailable));
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.post('/loans', {
        userId: parseInt(formData.userId),
        toolIds: [parseInt(formData.toolId)]
      });
      setIsModalOpen(false);
      setFormData({ userId: '', toolId: '' });
      fetchData();
    } catch (error) {
      console.error('Error creating loan', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReturnLoan = async (loan: Loan) => {
    if (!window.confirm('¿Confirmar devolución de la herramienta?')) return;
    try {
      await api.delete('/loans/return', {
        data: {
          userId: Number(loan.user.id),
          toolId: loan.tool.id
        }
      });
      fetchData();
    } catch (error) {
      console.error('Error returning loan', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredLoans = loans.filter(loan => 
    loan.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.tool.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por usuario o herramienta..." 
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-amber-500 transition-all text-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-amber-500 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-amber-600 transition-all shadow-lg active:scale-[0.98]"
        >
          <Plus size={20} />
          <span>Registrar Préstamo</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 tracking-widest uppercase">Herramienta</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 tracking-widest uppercase">Usuario</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 tracking-widest uppercase">Fecha Préstamo</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 tracking-widest uppercase">Estado</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 tracking-widest uppercase text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-4"><div className="h-10 bg-gray-100 rounded-xl w-full"></div></td>
                  </tr>
                ))
              ) : filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs italic">
                    <History size={48} className="mx-auto mb-4 opacity-10" />
                    No hay registros de préstamos
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 tracking-tight">{loan.tool.name}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{loan.tool.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center text-[10px] font-black uppercase shadow-sm">
                          {loan.user.name.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-slate-700 tracking-tight">{loan.user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[11px] text-slate-500 font-bold uppercase tracking-tighter">
                      {formatDate(loan.loanDate)}
                    </td>
                    <td className="px-6 py-4">
                      {loan.status === 'active' ? (
                        <span className="flex items-center gap-1.5 text-amber-700 font-black text-[10px] uppercase bg-amber-50 px-3 py-1 rounded-lg w-fit ring-1 ring-amber-100 shadow-sm">
                          <Clock size={12} /> Pendiente
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-emerald-700 font-black text-[10px] uppercase bg-emerald-50 px-3 py-1 rounded-lg w-fit ring-1 ring-emerald-100 shadow-sm">
                          <CheckCircle size={12} /> Devuelto
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        {loan.status === 'active' && (
                          <button 
                            onClick={() => handleReturnLoan(loan)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg"
                          >
                            <RotateCcw size={14} /> Devolver
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Nuevo Préstamo"
      >
        <form onSubmit={handleCreateLoan} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Seleccionar Usuario</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <select 
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-amber-500 transition-all text-sm font-bold outline-none appearance-none"
                value={formData.userId}
                onChange={e => setFormData({ ...formData, userId: e.target.value })}
              >
                <option value="">Buscar usuario...</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Seleccionar Herramienta</label>
            <div className="relative">
              <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <select 
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-amber-500 transition-all text-sm font-bold outline-none appearance-none"
                value={formData.toolId}
                onChange={e => setFormData({ ...formData, toolId: e.target.value })}
              >
                <option value="">Buscar herramienta disponible...</option>
                {tools.map(tool => (
                  <option key={tool.id} value={tool.id}>{tool.name} - {tool.code}</option>
                ))}
              </select>
            </div>
          </div>

          <button 
            disabled={submitting}
            type="submit" 
            className="w-full flex items-center justify-center gap-2 bg-amber-500 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-amber-600 transition-all shadow-xl shadow-amber-100 active:scale-95 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            <span>Registrar Préstamo</span>
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default LoansPage;
