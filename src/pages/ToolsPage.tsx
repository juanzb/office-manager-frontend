import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Tool } from '../types';
import Modal from '../components/Modal';
import { 
  Wrench, 
  Search,
  Edit2,
  Trash2,
  Plus,
  Package,
  Hash,
  FileText,
  Save,
  Loader2,
  Image as ImageIcon,
  Tag
} from 'lucide-react';

const ToolsPage: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    reference: '',
    serial: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  const handleCreateTool = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      
      // 1. Create the tool
      const toolResponse = await api.post('/tools', formData);
      const toolId = toolResponse.data.id;
      
      // 2. Upload image if selected
      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append('file', selectedFile);
        await api.post(`/tools/${toolId}/upload`, uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      setIsModalOpen(false);
      setFormData({ name: '', description: '', reference: '', serial: '' });
      setSelectedFile(null);
      fetchTools();
    } catch (error) {
      console.error('Error creating tool', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTool = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar esta herramienta?')) return;
    try {
      await api.delete(`/tools/${id}`);
      fetchTools();
    } catch (error) {
      console.error('Error deleting tool', error);
    }
  };

  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.serial.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nombre, ref o serial..." 
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-700 transition-all shadow-lg active:scale-[0.98]"
        >
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
                <div className="flex flex-wrap gap-2 mb-4">
                  <p className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-lg uppercase tracking-widest">Ref: {tool.reference}</p>
                  <p className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg uppercase tracking-widest">Serial: {tool.serial}</p>
                </div>
                <p className="text-sm text-slate-500 line-clamp-2 mb-6 font-medium leading-relaxed">{tool.description}</p>
                
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 rounded-xl font-bold transition-all text-xs uppercase tracking-tighter active:scale-95 border border-transparent hover:border-emerald-100">
                    <Edit2 size={14} /> Editar
                  </button>
                  <button 
                    onClick={() => handleDeleteTool(tool.id)}
                    className="px-4 py-3 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all active:scale-95 border border-transparent hover:border-rose-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Nueva Herramienta"
      >
        <form onSubmit={handleCreateTool} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Nombre de la Herramienta</label>
            <div className="relative">
              <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                required
                type="text" 
                placeholder="Ej. Taladro Percutor"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-600 transition-all text-sm font-bold placeholder:text-slate-300 outline-none"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Referencia</label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input 
                  required
                  type="text" 
                  placeholder="Ej. REF-450"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-600 transition-all text-sm font-bold placeholder:text-slate-300 outline-none"
                  value={formData.reference}
                  onChange={e => setFormData({ ...formData, reference: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Número de Serial</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input 
                  required
                  type="text" 
                  minLength={3}
                  placeholder="Ej. SN-12345"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-600 transition-all text-sm font-bold placeholder:text-slate-300 outline-none"
                  value={formData.serial}
                  onChange={e => setFormData({ ...formData, serial: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Descripción</label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 text-slate-300" size={20} />
              <textarea 
                required
                minLength={3}
                rows={3}
                placeholder="Detalles técnicos, estado, etc."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-600 transition-all text-sm font-bold placeholder:text-slate-300 outline-none resize-none"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Imagen de la Herramienta</label>
            <div className="relative">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {selectedFile ? (
                      <p className="text-sm font-bold text-emerald-600">{selectedFile.name}</p>
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 mb-2 text-slate-400" />
                        <p className="text-xs font-bold text-slate-400">Click para subir imagen</p>
                      </>
                    )}
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
                </label>
              </div>
            </div>
          </div>

          <button 
            disabled={submitting}
            type="submit" 
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 active:scale-95 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            <span>Guardar Herramienta</span>
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ToolsPage;
