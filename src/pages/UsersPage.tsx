import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import type { User } from '../types';
import { Role } from '../types/enums';
import { 
  Edit2, 
  Trash2, 
  UserPlus, 
  Search,
  Check,
  X
} from 'lucide-react';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o email..." 
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]">
          <UserPlus size={18} />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 tracking-widest uppercase">Usuario</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 tracking-widest uppercase">Email</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 tracking-widest uppercase">Rol</th>
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
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs italic">No se encontraron usuarios</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img src={`http://localhost:3000${user.avatar}`} alt="" className="w-10 h-10 rounded-xl object-cover ring-1 ring-gray-100" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center text-sm font-black uppercase shadow-sm">
                            {user.name.charAt(0)}
                          </div>
                        )}
                        <span className="font-black text-slate-900 tracking-tight">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-bold tracking-tight">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm ${getRoleBadgeClass(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.isActive ? (
                        <span className="flex items-center gap-1.5 text-emerald-600 font-black text-[10px] uppercase bg-emerald-50 px-3 py-1 rounded-lg w-fit ring-1 ring-emerald-100 shadow-sm">
                          <Check size={12} /> Activo
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-rose-600 font-black text-[10px] uppercase bg-rose-50 px-3 py-1 rounded-lg w-fit ring-1 ring-rose-100 shadow-sm">
                          <X size={12} /> Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-all" title="Editar">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition-all" title="Eliminar">
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
      </div>
    </div>
  );
};

export default UsersPage;
