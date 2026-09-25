import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Star,
  CheckCircle2,
  ExternalLink,
  Upload,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';
import { LinkedinIcon } from '../common/Icons';
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  uploadFile,
} from '../../services/api';

export default function TestimonialsView() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    avatar_url: '',
    content: '',
    rating: 5,
    is_verified: true,
    linkedin_url: '',
    project_context: '',
    sort_order: 0,
  });

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const data = await getTestimonials();
      setTestimonials(data.testimonials || []);
    } catch (err) {
      console.error('Failed to load testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleOpenAdd = () => {
    setEditingTestimonial(null);
    setFormData({
      name: '',
      role: 'VP of Engineering',
      company: '',
      avatar_url: '',
      content: '',
      rating: 5,
      is_verified: true,
      linkedin_url: 'https://linkedin.com/in/',
      project_context: '',
      sort_order: testimonials.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingTestimonial(item);
    setFormData({
      name: item.name || '',
      role: item.role || '',
      company: item.company || '',
      avatar_url: item.avatar_url || '',
      content: item.content || '',
      rating: item.rating || 5,
      is_verified: item.is_verified === 1 || item.is_verified === true,
      linkedin_url: item.linkedin_url || '',
      project_context: item.project_context || '',
      sort_order: item.sort_order || 0,
    });
    setIsModalOpen(true);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      const res = await uploadFile(file);
      setFormData((prev) => ({ ...prev, avatar_url: res.url }));
    } catch (err) {
      alert('Failed to upload avatar image.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTestimonial) {
        await updateTestimonial(editingTestimonial.id, formData);
      } else {
        await createTestimonial(formData);
      }
      setIsModalOpen(false);
      loadTestimonials();
    } catch (err) {
      alert('Failed to save endorsement. Please verify required fields.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this endorsement?')) return;
    try {
      await deleteTestimonial(id);
      loadTestimonials();
    } catch (err) {
      alert('Failed to delete endorsement.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-blue-400" />
            Verified Endorsements & Testimonials
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Manage real-person endorsements, verified colleague badges, LinkedIn profile links, and executive quotes.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Real Endorsement</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-16 text-center text-slate-500 text-sm">
            Loading endorsements...
          </div>
        ) : testimonials.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500 text-sm">
            No endorsements listed yet. Click "Add Real Endorsement" to add one.
          </div>
        ) : (
          testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-[#0b101d] rounded-2xl p-6 border border-white/10 flex flex-col justify-between hover:border-blue-500/30 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {item.is_verified && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>

                {item.project_context && (
                  <div className="text-[10px] font-mono text-slate-400 mb-3 truncate">
                    Context: <span className="text-cyan-300 font-semibold">{item.project_context}</span>
                  </div>
                )}

                <p className="text-xs text-slate-300 italic line-clamp-4 leading-relaxed mb-4">
                  "{item.content}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  {item.avatar_url ? (
                    <img
                      src={item.avatar_url}
                      alt={item.name}
                      className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center text-sm border border-blue-500/30 shrink-0">
                      {item.name ? item.name.charAt(0) : 'U'}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                    <p className="text-[11px] text-slate-400 truncate">
                      {item.role} {item.company && `• ${item.company}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-2">
                  {item.linkedin_url && (
                    <a
                      href={item.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-blue-400 transition-colors"
                      title="LinkedIn"
                    >
                      <LinkedinIcon className="w-3.5 h-3.5 fill-current" />
                    </a>
                  )}
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Edit Endorsement"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                    title="Delete Endorsement"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#090d16] border border-white/10 rounded-2xl w-full max-w-xl p-6 sm:p-8 relative my-8 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-400" />
              {editingTestimonial ? 'Edit Real Endorsement' : 'Add Real Person Endorsement'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">PERSON NAME *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Marcus Vance"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">ROLE / TITLE *</label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. VP of Cloud Engineering"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">COMPANY / ORG</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Stratos Systems"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    PROJECT CONTEXT (SHORT)
                  </label>
                  <input
                    type="text"
                    value={formData.project_context}
                    onChange={(e) => setFormData({ ...formData, project_context: e.target.value })}
                    placeholder="e.g. Microservices Scaling to 250k DAU"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    LINKEDIN PROFILE URL
                  </label>
                  <input
                    type="url"
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">STAR RATING (1-5)</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-blue-400 focus:outline-none"
                  >
                    <option value={5}>5 Stars (Exceptional)</option>
                    <option value={4}>4 Stars (Very Good)</option>
                    <option value={3}>3 Stars (Good)</option>
                  </select>
                </div>
              </div>

              {/* Avatar Upload */}
              <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-cyan-400" />
                    REAL PERSON PHOTO / AVATAR
                  </label>
                  <button
                    type="button"
                    disabled={uploadingAvatar}
                    onClick={() => avatarInputRef.current?.click()}
                    className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    {uploadingAvatar ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        Upload Photo
                      </>
                    )}
                  </button>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>

                {formData.avatar_url && (
                  <div className="flex items-center gap-3">
                    <img
                      src={formData.avatar_url}
                      alt="Avatar Preview"
                      className="w-12 h-12 rounded-full object-cover border border-white/20"
                    />
                    <span className="text-xs text-emerald-400">Photo attached successfully</span>
                  </div>
                )}

                <input
                  type="text"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                  placeholder="Or enter image URL (https://...)"
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  ENDORSEMENT COMMENT / QUOTE *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write the executive quote or peer feedback here..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-blue-400 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_verified"
                    checked={formData.is_verified}
                    onChange={(e) => setFormData({ ...formData, is_verified: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 bg-black/40 border-white/20 focus:ring-0"
                  />
                  <label htmlFor="is_verified" className="text-xs text-slate-300 cursor-pointer">
                    Mark as Verified Real-Person Endorsement
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-mono text-slate-400">Sort:</label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) =>
                      setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })
                    }
                    className="w-16 px-2 py-1 rounded-lg bg-black/40 border border-white/10 text-xs text-white text-center"
                  />
                </div>
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
                  <span>{editingTestimonial ? 'Save Changes' : 'Publish Endorsement'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
