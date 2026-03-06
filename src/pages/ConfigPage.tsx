import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import type { Area, Contract } from '../types';
import Modal from '../components/Modal';
import { 
  Building2, 
  FileText, 
  Plus, 
  Hash, 
  Tag, 
  Save,
  Loader2,
  Trash2
} from 'lucide-react';

const ConfigPage: React.FC = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  
  // Form states
  const [newArea, setNewArea] = useState({ name: '', code: '' });
  const [newContract, setNewContract] = useState({ name: '', code: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [areasRes, contractsRes] = await Promise.all([
        api.get('/config/areas'),
        api.get('/config/contracts')
      ]);
      setAreas(areasRes.data);
      setContracts(contractsRes.data);
    } catch (error) {
      console.error('Error fetching config data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateArea = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.post('/config/areas', newArea);
      setNewArea({ name: '', code: '' });
      setIsAreaModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error creating area', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.post('/config/contracts', newContract);
      setNewContract({ name: '', code: '' });
      setIsContractModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error creating contract', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">Configuración del Sistema</h2>
        <p className="text-sm text-slate-500 font-medium">Gestiona áreas de trabajo y tipos de contrato</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Areas Section */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <Building2 size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Áreas</h3>
            </div>
            <button 
              onClick={() => setIsAreaModalOpen(true)}
              className="p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-50 rounded-2xl animate-pulse" />)
            ) : areas.length === 0 ? (
              <p className="text-center py-8 text-slate-400 font-bold uppercase tracking-widest text-xs italic">No hay áreas registradas</p>
            ) : (
              areas.map(area => (
                <div key={area.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-indigo-100 transition-all group">
                  <div>
                    <p className="font-black text-slate-900 leading-tight mb-1">{area.name}</p>
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{area.code}</p>
                  </div>
                  <button className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Contracts Section */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <FileText size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Contratos</h3>
            </div>
            <button 
              onClick={() => setIsContractModalOpen(true)}
              className="p-3 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95"
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-50 rounded-2xl animate-pulse" />)
            ) : contracts.length === 0 ? (
              <p className="text-center py-8 text-slate-400 font-bold uppercase tracking-widest text-xs italic">No hay contratos registrados</p>
            ) : (
              contracts.map(contract => (
                <div key={contract.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-emerald-100 transition-all group">
                  <div>
                    <p className="font-black text-slate-900 leading-tight mb-1">{contract.name}</p>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{contract.code}</p>
                  </div>
                  <button className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Area Modal */}
      <Modal 
        isOpen={isAreaModalOpen} 
        onClose={() => setIsAreaModalOpen(false)} 
        title="Nueva Área"
      >
        <form onSubmit={handleCreateArea} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Nombre del Área</label>
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                required
                type="text" 
                placeholder="Ej. Recursos Humanos"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 transition-all text-sm font-bold placeholder:text-slate-300 outline-none"
                value={newArea.name}
                onChange={e => setNewArea({ ...newArea, name: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Código</label>
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                required
                type="text" 
                placeholder="Ej. RRHH"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 transition-all text-sm font-bold placeholder:text-slate-300 outline-none"
                value={newArea.code}
                onChange={e => setNewArea({ ...newArea, code: e.target.value })}
              />
            </div>
          </div>
          <button 
            disabled={submitting}
            type="submit" 
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            <span>Guardar Área</span>
          </button>
        </form>
      </Modal>

      {/* Contract Modal */}
      <Modal 
        isOpen={isContractModalOpen} 
        onClose={() => setIsContractModalOpen(false)} 
        title="Nuevo Tipo de Contrato"
      >
        <form onSubmit={handleCreateContract} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Nombre del Contrato</label>
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                required
                type="text" 
                placeholder="Ej. Indefinido"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-600 transition-all text-sm font-bold placeholder:text-slate-300 outline-none"
                value={newContract.name}
                onChange={e => setNewContract({ ...newContract, name: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Código</label>
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                required
                type="text" 
                placeholder="Ej. INDF"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-600 transition-all text-sm font-bold placeholder:text-slate-300 outline-none"
                value={newContract.code}
                onChange={e => setNewContract({ ...newContract, code: e.target.value })}
              />
            </div>
          </div>
          <button 
            disabled={submitting}
            type="submit" 
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 active:scale-95 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            <span>Guardar Contrato</span>
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ConfigPage;
