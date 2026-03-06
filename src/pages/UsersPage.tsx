import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import type { User, Area, Contract } from '../types';
import { Role } from '../types/enums';
import Modal from '../components/Modal';
import { 
  Edit2, 
  Trash2, 
  UserPlus, 
  Search,
  Check,
  X,
  MoreVertical,
  Mail,
  Shield,
  Activity,
  Save,
  Loader2,
  Lock,
  Building2,
  FileText
} from 'lucide-react';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: Role.USER,
    areaId: '',
    contractId: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, areasRes, contractsRes] = await Promise.all([
        api.get('/users'),
        api.get('/config/areas'),
        api.get('/config/contracts')
      ]);
      setUsers(usersRes.data.data);
      setAreas(areasRes.data);
      setContracts(contractsRes.data);
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const dataToSubmit = {
        ...formData,
        areaId: formData.areaId ? parseInt(formData.areaId) : undefined,
        contractId: formData.contractId ? parseInt(formData.contractId) : undefined
      };
      await api.post('/users/register', dataToSubmit);
      setIsModalOpen(false);
      setFormData({
        name: '',
        username: '',
        email: '',
        password: '',
        role: Role.USER,
        areaId: '',
        contractId: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error creating user', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
    try {
      await api.delete(`/users/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeClass = (role: string) => {
    switch(role) {
      case Role.ADMIN: return 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200';
      case Role.MANAGER: return 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200';
      default: return 'bg-slate-100 text-slate-700 ring-1 ring-slate-200';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">Gestión de Usuarios</h2>
          <p className="text-sm text-slate-500 font-medium">Administra los accesos y roles del personal</p>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o email..." 
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 transition-all text-sm font-bold placeholder:text-slate-400 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 group"
          >
            <UserPlus size={18} className="group-hover:rotate-12 transition-transform" />
            <span>Nuevo Usuario</span>
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 tracking-widest uppercase">Nombre de Usuario</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 tracking-widest uppercase text-center">Rol</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 tracking-widest uppercase text-center">Estado</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 tracking-widest uppercase text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={4} className="px-8 py-6"><div className="h-12 bg-slate-50 rounded-2xl w-full"></div></td>
                </tr>
              ))
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-24 text-center">
                   <div className="flex flex-col items-center justify-center text-slate-400">
                      <Search size={48} className="mb-4 opacity-10" />
                      <p className="font-bold uppercase tracking-widest text-xs">No se encontraron usuarios</p>
                   </div>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-all group cursor-default">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      {user.avatar ? (
                        <img src={`http://localhost:3000${user.avatar}`} alt="" className="w-12 h-12 rounded-2xl object-cover ring-4 ring-slate-50 shadow-sm" />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-lg font-black uppercase shadow-inner">
                          {user.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-black text-slate-900 tracking-tight leading-none mb-1 group-hover:text-indigo-600 transition-colors">{user.name}</p>
                        <p className="text-xs text-slate-500 font-bold">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm inline-flex items-center gap-1.5 ${getRoleBadgeClass(user.role)}`}>
                      <Shield size={12} /> {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    {user.isActive ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-600 font-black text-[10px] uppercase bg-emerald-50 px-3 py-1.5 rounded-xl ring-1 ring-emerald-100">
                        <Activity size={12} /> Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-rose-600 font-black text-[10px] uppercase bg-rose-50 px-3 py-1.5 rounded-xl ring-1 ring-rose-100">
                        <Activity size={12} /> Inactivo
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <button className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm" title="Editar">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm" title="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View ... (rest of mobile view) */}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Registrar Nuevo Usuario"
      >
        <form onSubmit={handleCreateUser} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Nombre Completo</label>
              <div className="relative">
                <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input 
                  required
                  type="text" 
                  placeholder="Ej. Juan Pérez"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 transition-all text-sm font-bold placeholder:text-slate-300 outline-none"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Nombre de Usuario</label>
              <div className="relative">
                <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input 
                  required
                  type="text" 
                  placeholder="Ej. jperez"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 transition-all text-sm font-bold placeholder:text-slate-300 outline-none"
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input 
                  required
                  type="email" 
                  placeholder="usuario@empresa.com"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 transition-all text-sm font-bold placeholder:text-slate-300 outline-none"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input 
                  required
                  type="password" 
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 transition-all text-sm font-bold placeholder:text-slate-300 outline-none"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Rol del Usuario</label>
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <select 
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 transition-all text-sm font-bold outline-none appearance-none"
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value as Role })}
                >
                  <option value={Role.USER}>Usuario</option>
                  <option value={Role.MANAGER}>Gestor</option>
                  <option value={Role.ADMIN}>Administrador</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Área</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <select 
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 transition-all text-sm font-bold outline-none appearance-none"
                  value={formData.areaId}
                  onChange={e => setFormData({ ...formData, areaId: e.target.value })}
                >
                  <option value="">Seleccionar Área</option>
                  {areas.map(area => (
                    <option key={area.id} value={area.id}>{area.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Contrato</label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <select 
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 transition-all text-sm font-bold outline-none appearance-none"
                  value={formData.contractId}
                  onChange={e => setFormData({ ...formData, contractId: e.target.value })}
                >
                  <option value="">Seleccionar Contrato</option>
                  {contracts.map(contract => (
                    <option key={contract.id} value={contract.id}>{contract.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button 
            disabled={submitting}
            type="submit" 
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            <span>Registrar Usuario</span>
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default UsersPage;
