import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Check,
  Code,
  Database,
  Box,
  ShieldCheck,
  Layers,
  Cpu,
  Globe,
  Server,
  Smartphone,
} from 'lucide-react';
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from '../../services/api';

const iconOptions = [
  'Code',
  'Database',
  'Box',
  'ShieldCheck',
  'Sparkles',
  'Layers',
  'Cpu',
  'Globe',
  'Server',
  'Smartphone',
];

const iconMap = {
  Code,
  Database,
  Box,
  ShieldCheck,
  Sparkles,
  Layers,
  Cpu,
  Globe,
  Server,
  Smartphone,
};

export default function ServicesView() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'Code',
    features: '',
    sort_order: 0,
  });

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await getServices();
      setServices(data.services || []);
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      icon: 'Code',
      features: "Component-driven design systems\nHigh-speed REST API endpoints\nState management & real-time WebSockets\nLighthouse 95+ performance",
      sort_order: services.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (svc) => {
    setEditingService(svc);
    setFormData({
      title: svc.title || '',
      description: svc.description || svc.desc || '',
      icon: svc.icon || 'Code',
      features: Array.isArray(svc.features)
        ? svc.features.join('\n')
        : svc.features || '',
      sort_order: svc.sort_order || 0,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      features: formData.features
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean),
    };

    try {
      if (editingService) {
        await updateService(editingService.id, payload);
      } else {
        await createService(payload);
      }
      setIsModalOpen(false);
      loadServices();
    } catch (err) {
      alert('Failed to save service. Please check your inputs.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await deleteService(id);
      loadServices();
    } catch (err) {
      alert('Failed to delete service.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-400" />
            Services & Offerings Manager
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Manage your specialized architectural offerings, feature bullet points, and icon styles displayed on the public portfolio.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full py-16 text-center text-slate-500 text-sm">
            Loading services...
          </div>
        ) : services.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500 text-sm">
            No services configured. Click "Add New Service" to create your first offering.
          </div>
        ) : (
          services.map((svc) => {
            const IconComp = iconMap[svc.icon] || Sparkles;
            const features = Array.isArray(svc.features)
              ? svc.features
              : typeof svc.features === 'string'
              ? svc.features.split('\n').filter(Boolean)
              : [];

            return (
              <div
                key={svc.id}
                className="bg-[#0b101d] rounded-2xl p-6 border border-white/10 flex flex-col justify-between hover:border-blue-500/30 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-slate-500">
                      Order: #{svc.sort_order || 0}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{svc.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {svc.description || svc.desc}
                  </p>

                  {features.length > 0 && (
                    <div className="space-y-2 pt-3 border-t border-white/5">
                      {features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                          <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-white/5">
                  <button
                    onClick={() => handleOpenEdit(svc)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Edit Service"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(svc.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                    title="Delete Service"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#090d16] border border-white/10 rounded-2xl w-full max-w-lg p-6 sm:p-8 relative my-8 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">SERVICE TITLE *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Distributed Cloud Architecture"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">ICON IDENTIFIER</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-blue-400 focus:outline-none"
                  >
                    {iconOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">SORT ORDER</label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) =>
                      setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">DESCRIPTION *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="High-level overview of this capability..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-blue-400 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  KEY FEATURES / BULLETS (ONE PER LINE)
                </label>
                <textarea
                  rows={4}
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-blue-400 focus:outline-none font-mono text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingService ? 'Save Changes' : 'Create Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
