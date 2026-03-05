import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Tool } from '../types';
import { 
  Wrench, 
  Search,
  Edit2,
  Trash2,
  Plus,
  Package
} from 'lucide-react';

const ToolsPage: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTools = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tools');
      setTools(response.data.data);
    } catch (error) {
      console.error('Error fetching tools', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o código..." 
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-700 transition-all shadow-lg active:scale-[0.98]">
          <Plus size={20} />
          <span>Nueva Herramienta</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-80 bg-gray-100 rounded-3xl border border-gray-200"></div>
          ))}
        </div>
      ) : filteredTools.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400">
          <Package size={48} className="mx-auto mb-4 opacity-20" />
          <p className="font-medium text-lg">No se encontraron herramientas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map((tool) => (
            <div key={tool.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className="h-48 relative bg-slate-50 overflow-hidden">
                {tool.image ? (
                  <img src={`http://localhost:3000${tool.image}`} alt={tool.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-200">
                    <Wrench size={64} strokeWidth={1} />
                  </div>
                )}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-xl text-[10px] font-black uppercase shadow-lg ${
                  tool.isAvailable ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                }`}>
                  {tool.isAvailable ? 'Disponible' : 'Prestado'}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-black text-gray-900 leading-tight group-hover:text-emerald-600 transition-colors tracking-tight">{tool.name}</h3>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Cod: {tool.code}</p>
                <p className="text-sm text-slate-500 line-clamp-2 mb-6 font-medium leading-relaxed">{tool.description}</p>
                
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 rounded-xl font-bold transition-all text-xs uppercase tracking-tighter active:scale-95 border border-transparent hover:border-emerald-100">
                    <Edit2 size={14} /> Editar
                  </button>
                  <button className="px-4 py-3 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all active:scale-95 border border-transparent hover:border-rose-100">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ToolsPage;
