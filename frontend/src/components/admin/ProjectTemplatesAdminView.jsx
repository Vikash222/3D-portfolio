import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Check,
  CheckCircle2,
  AlertCircle,
  Save,
  Clock,
  IndianRupee,
  Sparkles,
  X,
  RefreshCw,
  Search,
  Filter,
  Copy,
  ExternalLink,
  Tag,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  getAdminProjectTemplates,
  createProjectTemplate,
  updateProjectTemplate,
  deleteProjectTemplate,
  getProjects,
} from '../../services/api';

const PRESET_CATEGORIES = [
  'Full-Stack Web App',
  'AI SaaS & LLM Integration',
  'Mobile App (Cross-Platform)',
  'Campus Automation & Smart Systems',
  'REST APIs & Database Architecture',
  'High-Converting UI/UX Landing Page',
];

const PRESET_BUDGETS = [
  '₹5,000 - ₹10,000',
  '₹15,000 - ₹35,000',
  '₹35,000 - ₹75,000',
  '₹75,000+',
];

const PRESET_TIMELINES = [
  '3-5 Days',
  '1-2 Weeks',
  '2-3 Weeks',
  '3-4 Weeks',
  'Flexible / Long-Term',
];

export default function ProjectTemplatesAdminView() {
  const [templates, setTemplates] = useState([]);
  const [portfolioProjects, setPortfolioProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Search & Filter
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [featureInput, setFeatureInput] = useState('');

  // Form State
  const [form, setForm] = useState({
    title: '',
    category: 'Full-Stack Web App',
    short_description: '',
    description: '',
    budget_range: '₹15,000 - ₹35,000',
    timeline: '1-2 Weeks',
    features: ['Modern Responsive UI', 'REST API Architecture', 'Clean Code Handover'],
    demo_url: '',
    is_active: true,
    sort_order: 0,
  });

  // Load Data
  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [tmplRes, portRes] = await Promise.all([
        getAdminProjectTemplates().catch(() => ({ templates: [] })),
        getProjects().catch(() => ({ projects: [] })),
      ]);

      setTemplates(tmplRes.templates || []);
      setPortfolioProjects(portRes.projects || []);
    } catch (err) {
      setError('Failed to load project templates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Open Modal for Create
  const handleOpenCreateModal = () => {
    setEditingTemplate(null);
    setForm({
      title: '',
      category: 'Full-Stack Web App',
      short_description: '',
      description: '',
      budget_range: '₹15,000 - ₹35,000',
      timeline: '1-2 Weeks',
      features: ['Authentication & RBAC', 'RESTful API Backend', 'Interactive Responsive Frontend'],
      demo_url: '',
      is_active: true,
      sort_order: templates.length + 1,
    });
    setFeatureInput('');
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (tmpl) => {
    setEditingTemplate(tmpl);
    setForm({
      title: tmpl.title || '',
      category: tmpl.category || 'Full-Stack Web App',
      short_description: tmpl.short_description || '',
      description: tmpl.description || '',
      budget_range: tmpl.budget_range || '₹15,000 - ₹35,000',
      timeline: tmpl.timeline || '1-2 Weeks',
      features: Array.isArray(tmpl.features) ? tmpl.features : [],
      demo_url: tmpl.demo_url || '',
      is_active: tmpl.is_active ?? true,
      sort_order: tmpl.sort_order ?? 0,
    });
    setFeatureInput('');
    setIsModalOpen(true);
  };

  // Clone from an existing portfolio project
  const handleCloneFromPortfolio = (projectId) => {
    if (!projectId) return;
    const project = portfolioProjects.find((p) => p.id === parseInt(projectId));
    if (!project) return;

    setForm((prev) => ({
      ...prev,
      title: project.title || prev.title,
      category: project.category || prev.category,
      short_description: project.short_description || project.long_description?.slice(0, 180) || prev.short_description,
      description: project.long_description || project.short_description || prev.description,
      features: Array.isArray(project.tech_stack) && project.tech_stack.length > 0
        ? project.tech_stack
        : prev.features,
      demo_url: project.live_url || project.github_url || prev.demo_url,
    }));
  };

  // Add Feature Tag
  const handleAddFeature = () => {
    const trimmed = featureInput.trim();
    if (!trimmed) return;
    if (form.features.includes(trimmed)) {
      setFeatureInput('');
      return;
    }
    setForm({ ...form, features: [...form.features, trimmed] });
    setFeatureInput('');
  };

  // Remove Feature Tag
  const handleRemoveFeature = (idx) => {
    setForm({
      ...form,
      features: form.features.filter((_, i) => i !== idx),
    });
  };

  // Save (Create or Update)
  const handleSaveTemplate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert('Please enter a template title.');
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccessMsg('');

    try {
      if (editingTemplate) {
        const res = await updateProjectTemplate(editingTemplate.id, form);
        setTemplates((prev) =>
          prev.map((t) => (t.id === editingTemplate.id ? res.template : t))
        );
        setSuccessMsg(`Template "${form.title}" updated successfully!`);
      } else {
        const res = await createProjectTemplate(form);
        setTemplates((prev) => [res.template, ...prev]);
        setSuccessMsg(`New template "${form.title}" created successfully!`);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      setError('Failed to save project template. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Quick Toggle Active Status
  const handleToggleActive = async (tmpl) => {
    try {
      const updated = !tmpl.is_active;
      await updateProjectTemplate(tmpl.id, { is_active: updated });
      setTemplates((prev) =>
        prev.map((t) => (t.id === tmpl.id ? { ...t, is_active: updated } : t))
      );
      setSuccessMsg(`Template "${tmpl.title}" is now ${updated ? 'Active in Builder' : 'Hidden from Builder'}.`);
    } catch (err) {
      setError('Failed to update template status.');
    }
  };

  // Delete Template
  const handleDeleteTemplate = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete template "${title}"?`)) {
      return;
    }

    try {
      await deleteProjectTemplate(id);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      setSuccessMsg(`Template "${title}" deleted successfully.`);
    } catch (err) {
      setError('Failed to delete template.');
    }
  };

  // Filter templates
  const filteredTemplates = templates.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      (t.short_description && t.short_description.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      categoryFilter === 'ALL' || t.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="admin-card rounded-2xl border border-white/10 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>Showcase Builder Templates</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {templates.length} Total
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage the foundation projects shown under <strong className="text-cyan-300">"Option 1: Base this Project on Vikash's Showcase Templates"</strong> in the Client Portal.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Refresh Templates"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Showcase Template</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates or tech..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <button
            onClick={() => setCategoryFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
              categoryFilter === 'ALL'
                ? 'bg-cyan-500 text-black font-bold'
                : 'bg-white/5 hover:bg-white/10 text-slate-400 border border-white/10'
            }`}
          >
            All Categories ({templates.length})
          </button>
          {PRESET_CATEGORIES.map((cat) => {
            const count = templates.filter((t) => t.category === cat).length;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-cyan-500 text-black font-bold'
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 border border-white/10'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
          <span>Loading showcase templates...</span>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="admin-card rounded-2xl border border-white/10 p-12 text-center space-y-3">
          <Layers className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="font-bold text-white text-base">No Showcase Templates Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {search || categoryFilter !== 'ALL'
              ? 'No templates match your search filter.'
              : 'Add your first showcase template to give clients interactive blueprint foundations in their project builder.'}
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Template</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {filteredTemplates.map((tmpl) => (
            <div
              key={tmpl.id}
              className={`admin-card rounded-2xl border transition-all p-5 space-y-4 flex flex-col justify-between ${
                tmpl.is_active
                  ? 'border-white/10 hover:border-cyan-500/40 bg-slate-900/60'
                  : 'border-white/5 opacity-60 bg-black/40'
              }`}
            >
              <div className="space-y-3">
                {/* Header row: category + active status */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold truncate max-w-[200px]">
                    {tmpl.category}
                  </span>

                  <button
                    onClick={() => handleToggleActive(tmpl)}
                    className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                      tmpl.is_active
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25'
                        : 'bg-slate-800 border-white/10 text-slate-400 hover:text-white'
                    }`}
                    title="Click to toggle visibility in Client Portal Builder"
                  >
                    {tmpl.is_active ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-slate-500" />}
                    <span>{tmpl.is_active ? 'Active in Builder' : 'Hidden'}</span>
                  </button>
                </div>

                {/* Title */}
                <div>
                  <h3 className="font-bold text-white text-base leading-snug">{tmpl.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {tmpl.short_description || tmpl.description}
                  </p>
                </div>

                {/* Budget & Timeline specs */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <IndianRupee className="w-3 h-3" />
                    <span>{tmpl.budget_range || '₹15,000 - ₹35,000'}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Clock className="w-3 h-3" />
                    <span>{tmpl.timeline || '1-2 Weeks'}</span>
                  </span>
                </div>

                {/* Feature Chips */}
                {Array.isArray(tmpl.features) && tmpl.features.length > 0 && (
                  <div className="pt-2 border-t border-white/5">
                    <div className="text-[10px] font-mono uppercase text-slate-500 mb-1.5 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-cyan-400" />
                      <span>Autofills Features for Client:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {tmpl.features.map((feat, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 font-mono"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons Footer */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-slate-500">
                  Order: #{tmpl.sort_order ?? 0}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(tmpl)}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(tmpl.id, tmpl.title)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs cursor-pointer transition-all"
                    title="Delete Template"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================================================================
          ADD / EDIT TEMPLATE MODAL
          ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="admin-card border border-white/20 rounded-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {editingTemplate ? 'Edit Showcase Template' : 'Create Showcase Template'}
                </h3>
                <p className="text-xs text-slate-400">
                  Pre-fills specs for clients in "Option 1: Base this Project on Vikash's Showcase Templates".
                </p>
              </div>
            </div>

            {/* Quick Clone helper from Portfolio */}
            {portfolioProjects.length > 0 && !editingTemplate && (
              <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 mb-5 space-y-1.5">
                <label className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                  <Copy className="w-3.5 h-3.5" />
                  <span>Quick Autofill: Clone from Portfolio Project</span>
                </label>
                <select
                  onChange={(e) => handleCloneFromPortfolio(e.target.value)}
                  defaultValue=""
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value="" disabled>-- Select a portfolio project to clone --</option>
                  {portfolioProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.category})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400">
                  Selecting a project will automatically populate the title, category, description, and tech stack tags.
                </p>
              </div>
            )}

            <form onSubmit={handleSaveTemplate} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                  Template Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Multi-Tenant AI Document Assistant"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Category & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-mono uppercase text-slate-300">
                      Category *
                    </label>
                    <span className="text-[10px] text-cyan-400 font-mono">Editable</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="e.g. AI SaaS & LLM Integration"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
                  />
                  <div className="flex flex-wrap items-center gap-1 mt-2">
                    <span className="text-[10px] text-slate-500 font-mono">Presets:</span>
                    {PRESET_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setForm({ ...form, category: cat })}
                        className={`text-[10px] px-2 py-0.5 rounded-md border font-mono transition-all cursor-pointer truncate max-w-[150px] ${
                          form.category === cat
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold'
                            : 'bg-white/5 hover:bg-white/10 text-slate-400 border-white/10 hover:text-white'
                        }`}
                        title={cat}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-mono uppercase text-slate-300">
                      Suggested Budget Range *
                    </label>
                    <span className="text-[10px] text-cyan-400 font-mono font-bold">100% Editable</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={form.budget_range}
                    onChange={(e) => setForm({ ...form, budget_range: e.target.value })}
                    placeholder="e.g. ₹20,000 - ₹40,000 or ₹50,000 Fixed"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400 font-mono"
                  />
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="text-[10px] text-slate-500 font-mono">Quick Presets:</span>
                    {PRESET_BUDGETS.map((bg) => (
                      <button
                        key={bg}
                        type="button"
                        onClick={() => setForm({ ...form, budget_range: bg })}
                        className={`text-[10px] px-2 py-0.5 rounded-md border font-mono transition-all cursor-pointer ${
                          form.budget_range === bg
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 font-bold'
                            : 'bg-white/5 hover:bg-white/10 text-slate-400 border-white/10 hover:text-white'
                        }`}
                      >
                        {bg}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Timeline & Sort Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-mono uppercase text-slate-300">
                      Suggested Timeline *
                    </label>
                    <span className="text-[10px] text-cyan-400 font-mono">Editable</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={form.timeline}
                    onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                    placeholder="e.g. 1-2 Weeks or 10 Days"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400 font-mono"
                  />
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="text-[10px] text-slate-500 font-mono">Presets:</span>
                    {PRESET_TIMELINES.map((tl) => (
                      <button
                        key={tl}
                        type="button"
                        onClick={() => setForm({ ...form, timeline: tl })}
                        className={`text-[10px] px-2 py-0.5 rounded-md border font-mono transition-all cursor-pointer ${
                          form.timeline === tl
                            ? 'bg-blue-500/20 text-blue-300 border-blue-400 font-bold'
                            : 'bg-white/5 hover:bg-white/10 text-slate-400 border-white/10 hover:text-white'
                        }`}
                      >
                        {tl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                    Display Sort Order (Integer)
                  </label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                    placeholder="1, 2, 3..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                  Short Scope Summary (Shown on Card)
                </label>
                <input
                  type="text"
                  value={form.short_description}
                  onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                  placeholder="One sentence summary of the solution..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                  Full Description &amp; Architecture (Autofills Client Form)
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Comprehensive description of the features, database models, and workflows..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              {/* Features Tags Manager */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                  Preset Capabilities / Feature Tags
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="e.g. Razorpay Integration, OAuth, Admin CMS (Press Enter)"
                    className="flex-1 px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-bold cursor-pointer transition-all"
                  >
                    Add Tag
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 rounded-xl bg-black/30 border border-white/5">
                  {form.features.length === 0 ? (
                    <span className="text-[11px] text-slate-500 italic p-1">No feature tags added yet.</span>
                  ) : (
                    form.features.map((feat, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono"
                      >
                        <span>{feat}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          className="text-slate-400 hover:text-red-400 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/40 border border-white/10">
                <div>
                  <h4 className="text-xs font-bold text-white">Active in Client Builder</h4>
                  <p className="text-[11px] text-slate-400">
                    When enabled, this template will be selectable in the Interactive Freelance Project Builder.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, is_active: !form.is_active })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    form.is_active
                      ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800 text-slate-400 border border-white/10'
                  }`}
                >
                  {form.is_active ? 'Active' : 'Disabled'}
                </button>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-black font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-cyan-500/20"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : editingTemplate ? 'Update Template' : 'Create Template'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
