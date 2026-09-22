import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Save,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Upload,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  RefreshCw,
  Flag,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  Star,
  Layers,
  Eye,
  Scissors,
} from 'lucide-react';
import { getAdminProfile, updateAdminProfile, uploadFile } from '../../services/api';
import ImageCropModal from './ImageCropModal';

export default function ProfileView({ onProfileUpdated }) {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    tagline: '',
    bio: '',
    hero_image_url: '',
    camp_image_url: '/assets/nic-camp.jpg',
    camp_title: 'National Integration Camp (NIC)',
    camp_caption: 'Vikash Kumar with Fellow Delegates at National Integration Camp (NIC)',
    camp_gallery: [],
    email: '',
    phone: '',
    location: '',
    github: '',
    linkedin: '',
    twitter: '',
    instagram: '',
    resume_url: '',
    status_badge: '',
    years_experience: 5,
    projects_completed: 40,
    satisfied_clients: 25,
    code_commits: '15K+',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingCampIndex, setUploadingCampIndex] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Interactive Image Cropper & Scaler Modal state
  const [cropperState, setCropperState] = useState({
    isOpen: false,
    imageSrc: '',
    originalFile: null,
    title: '',
    defaultAspect: '16:9',
    target: null, // 'hero' | { type: 'camp', index: number }
  });

  const imageInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getAdminProfile();
        if (data.profile) {
          let initialGallery = [];
          if (Array.isArray(data.profile.camp_gallery) && data.profile.camp_gallery.length > 0) {
            initialGallery = data.profile.camp_gallery;
          } else {
            initialGallery = [
              {
                id: 'camp_1',
                image_url: data.profile.camp_image_url || '/assets/nic-camp.jpg',
                title: data.profile.camp_title || 'National Integration Camp (NIC)',
                tag: 'NIC Delegate',
                badge: 'Youth Leadership & National Integration',
                date: '2024',
                caption: data.profile.camp_caption || 'Vikash Kumar with Fellow Delegates at National Integration Camp (NIC)',
              },
            ];
          }

          setFormData({
            name: data.profile.name || '',
            title: data.profile.title || '',
            tagline: data.profile.tagline || '',
            bio: data.profile.bio || '',
            hero_image_url: data.profile.hero_image_url || '',
            camp_image_url: data.profile.camp_image_url || (initialGallery[0]?.image_url || '/assets/nic-camp.jpg'),
            camp_title: data.profile.camp_title || (initialGallery[0]?.title || 'National Integration Camp (NIC)'),
            camp_caption: data.profile.camp_caption || (initialGallery[0]?.caption || 'Vikash Kumar with Fellow Delegates at National Integration Camp (NIC)'),
            camp_gallery: initialGallery,
            email: data.profile.email || '',
            phone: data.profile.phone || '',
            location: data.profile.location || '',
            github: data.profile.github || '',
            linkedin: data.profile.linkedin || '',
            twitter: data.profile.twitter || '',
            instagram: data.profile.instagram || '',
            resume_url: data.profile.resume_url || '',
            status_badge: data.profile.status_badge || '',
            years_experience: data.profile.years_experience || 5,
            projects_completed: data.profile.projects_completed || 40,
            satisfied_clients: data.profile.satisfied_clients || 25,
            code_commits: data.profile.code_commits || '15K+',
          });
        }
      } catch (err) {
        setMessage({ text: 'Failed to load profile data.', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open cropper when user selects a file for Big Hero Image
  const handleHeroFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setCropperState({
      isOpen: true,
      imageSrc: previewUrl,
      originalFile: file,
      title: 'Cut / Scale Hero 3D Portrait',
      defaultAspect: '4:5',
      target: 'hero',
    });
    e.target.value = '';
  };

  // Open cropper for existing Hero Image
  const handleOpenHeroCropper = () => {
    if (!formData.hero_image_url) return;
    setCropperState({
      isOpen: true,
      imageSrc: formData.hero_image_url,
      originalFile: null,
      title: 'Adjust / Cut Hero 3D Portrait',
      defaultAspect: '4:5',
      target: 'hero',
    });
  };

  // Add new Camp Photo / Event Card
  const handleAddCampPhoto = () => {
    const newId = `camp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newItem = {
      id: newId,
      image_url: '',
      title: '',
      tag: 'NIC Delegate',
      badge: 'Youth Leadership & Teamwork',
      date: new Date().getFullYear().toString(),
      caption: '',
    };
    setFormData((prev) => ({
      ...prev,
      camp_gallery: [...(prev.camp_gallery || []), newItem],
    }));
    setMessage({
      text: 'New camp card added! Click "Upload & Cut Photo" and enter details below.',
      type: 'success',
    });
  };

  // Open cropper when user selects file for specific Camp Item
  const handleCampPhotoFileSelected = (index, file) => {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setCropperState({
      isOpen: true,
      imageSrc: previewUrl,
      originalFile: file,
      title: `Cut / Scale Camp Photo #${index + 1}`,
      defaultAspect: '16:9',
      target: { type: 'camp', index },
    });
  };

  // Open cropper for existing Camp Photo
  const handleOpenCampCropper = (index) => {
    const item = formData.camp_gallery?.[index];
    if (!item?.image_url) return;
    setCropperState({
      isOpen: true,
      imageSrc: item.image_url,
      originalFile: null,
      title: `Cut & Scale: ${item.title || `Camp #${index + 1}`}`,
      defaultAspect: '16:9',
      target: { type: 'camp', index },
    });
  };

  // Callback after user crops / scales and confirms in ImageCropModal
  const handleCropperApply = async (processedFile) => {
    if (!cropperState.target) return;

    try {
      setMessage({ text: '', type: '' });

      if (cropperState.target === 'hero') {
        setUploadingImage(true);
        const res = await uploadFile(processedFile);
        setFormData((prev) => ({ ...prev, hero_image_url: res.url }));
        setMessage({
          text: 'Hero portrait cropped & uploaded! Click "Save Changes" below to make it live.',
          type: 'success',
        });
      } else if (cropperState.target.type === 'camp') {
        const index = cropperState.target.index;
        setUploadingCampIndex(index);
        const res = await uploadFile(processedFile);
        setFormData((prev) => {
          const currentList = prev.camp_gallery || [];
          const updated = currentList.map((itm, i) => {
            if (i === index) {
              return { ...itm, image_url: res.url };
            }
            return itm;
          });
          return {
            ...prev,
            camp_gallery: updated,
            camp_image_url: index === 0 ? res.url : (updated[0]?.image_url || prev.camp_image_url),
          };
        });
        setMessage({
          text: `Photo cropped & uploaded for card #${index + 1}! Remember to click "Save Changes".`,
          type: 'success',
        });
      }
    } catch (err) {
      const errText =
        err.response?.data?.message ||
        'Photo upload failed. Check your connection or try a smaller crop.';
      setMessage({ text: errText, type: 'error' });
    } finally {
      setUploadingImage(false);
      setUploadingCampIndex(null);
    }
  };

  // Update field of specific Camp Item safely
  const handleCampFieldChange = (index, field, value) => {
    setFormData((prev) => {
      const currentList = prev.camp_gallery || [];
      const updated = currentList.map((itm, i) => {
        if (i === index) {
          return { ...itm, [field]: value };
        }
        return itm;
      });
      return {
        ...prev,
        camp_gallery: updated,
        camp_title: index === 0 && field === 'title' ? value : (updated[0]?.title || prev.camp_title),
        camp_caption: index === 0 && field === 'caption' ? value : (updated[0]?.caption || prev.camp_caption),
        camp_image_url: index === 0 && field === 'image_url' ? value : (updated[0]?.image_url || prev.camp_image_url),
      };
    });
  };

  // Delete a Camp Photo Card
  const handleDeleteCampPhoto = (index) => {
    if (window.confirm(`Are you sure you want to delete camp photo card #${index + 1}?`)) {
      setFormData((prev) => {
        const updated = (prev.camp_gallery || []).filter((_, i) => i !== index);
        return {
          ...prev,
          camp_gallery: updated,
          camp_image_url: updated[0]?.image_url || '',
          camp_title: updated[0]?.title || 'National Integration Camp (NIC)',
          camp_caption: updated[0]?.caption || '',
        };
      });
      setMessage({ text: 'Camp photo card removed! Click "Save Changes" to apply.', type: 'success' });
    }
  };

  // Move Camp Photo Up / Down
  const handleMoveCampPhoto = (index, direction) => {
    setFormData((prev) => {
      const list = [...(prev.camp_gallery || [])];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return {
        ...prev,
        camp_gallery: list,
        camp_image_url: list[0]?.image_url || prev.camp_image_url,
        camp_title: list[0]?.title || prev.camp_title,
        camp_caption: list[0]?.caption || prev.camp_caption,
      };
    });
  };

  // Set as Primary / Cover Photo
  const handleSetPrimaryCampPhoto = (index) => {
    setFormData((prev) => {
      const list = [...(prev.camp_gallery || [])];
      const selected = list.splice(index, 1)[0];
      list.unshift(selected);
      return {
        ...prev,
        camp_gallery: list,
        camp_image_url: selected.image_url,
        camp_title: selected.title,
        camp_caption: selected.caption,
      };
    });
    setMessage({ text: 'Card moved to Primary Cover position! Remember to Save Changes.', type: 'info' });
  };

  // Upload Resume PDF
  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingResume(true);
      setMessage({ text: '', type: '' });
      const res = await uploadFile(file);
      setFormData((prev) => ({ ...prev, resume_url: res.url }));
      setMessage({ text: 'Resume PDF uploaded successfully! Remember to Save Changes.', type: 'success' });
    } catch (err) {
      const errText = err.response?.data?.message || 'Resume upload failed. PDF files under 20MB recommended.';
      setMessage({ text: errText, type: 'error' });
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await updateAdminProfile(formData);
      setMessage({ text: 'Profile settings saved successfully and live on the portfolio!', type: 'success' });
      if (onProfileUpdated) onProfileUpdated(res.profile);
    } catch (err) {
      const errText =
        err.response?.data?.message ||
        (err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(' ')
          : 'Failed to update profile settings.');
      setMessage({ text: errText, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-slate-500 text-sm">Loading profile data...</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-blue-400" />
          Profile & 3D Hero Configuration
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Update personal brand identity, upload your big 3D perspective hero portrait, attach your downloadable resume PDF, and configure live metrics.
        </p>
      </div>

      {message.text && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl text-sm ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: Big Hero Photo & Resume PDF Uploaders */}
        <div className="bg-[#0b101d] rounded-2xl p-7 border border-white/10 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            Media Assets & Direct Uploads
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Big Hero 3D Portrait Uploader */}
            <div className="bg-black/30 rounded-xl p-5 border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-cyan-400" />
                  BIG HERO 3D PORTRAIT
                </label>
                {formData.hero_image_url && (
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Active Image
                  </span>
                )}
              </div>

              {/* Preview Box */}
              <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center group">
                {formData.hero_image_url ? (
                  <img
                    src={formData.hero_image_url}
                    alt="Hero Preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="text-center p-4">
                    <ImageIcon className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                    <span className="text-xs text-slate-400">No Hero Image Set</span>
                  </div>
                )}

                {/* Upload Overlay */}
                <div className="absolute inset-0 bg-black/75 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 gap-2">
                  <button
                    type="button"
                    disabled={uploadingImage}
                    onClick={() => imageInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md hover:scale-105"
                  >
                    {uploadingImage ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Browse / Cut New Photo</span>
                      </>
                    )}
                  </button>

                  {formData.hero_image_url && (
                    <button
                      type="button"
                      onClick={handleOpenHeroCropper}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      <span>Cut / Scale This Photo</span>
                    </button>
                  )}

                  <span className="text-[10px] text-slate-300">Auto-cuts to 4:5 Portrait</span>
                </div>
              </div>

              {/* Action Buttons Below Preview */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={uploadingImage}
                  onClick={() => imageInputRef.current?.click()}
                  className="flex-1 py-2 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{formData.hero_image_url ? 'Replace / Cut Photo' : 'Upload Hero Photo'}</span>
                </button>

                {formData.hero_image_url && (
                  <button
                    type="button"
                    onClick={handleOpenHeroCropper}
                    className="py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    title="Cut edges or adjust size / zoom"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>Cut / Scale</span>
                  </button>
                )}
              </div>

              {/* Hidden File Input */}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleHeroFileSelected}
                className="hidden"
              />

              {/* Manual URL Input Fallback */}
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  OR DIRECT IMAGE URL:
                </label>
                <input
                  type="text"
                  name="hero_image_url"
                  value={formData.hero_image_url}
                  onChange={handleChange}
                  placeholder="https://... or /storage/uploads/..."
                  className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Resume PDF Uploader */}
            <div className="bg-black/30 rounded-xl p-5 border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-purple-400" />
                  DOWNLOADABLE RESUME / CV (PDF)
                </label>
                {formData.resume_url && (
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    PDF Attached
                  </span>
                )}
              </div>

              {/* Resume Card Display */}
              <div className="aspect-4/3 rounded-xl bg-black/60 border border-white/10 flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <FileText className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Curriculum Vitae (PDF)</span>
                  <span className="text-[11px] text-slate-400">Available to recruiters in Hero & About sections</span>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    disabled={uploadingResume}
                    onClick={() => resumeInputRef.current?.click()}
                    className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    {uploadingResume ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        Upload PDF Document
                      </>
                    )}
                  </button>

                  {formData.resume_url && (
                    <a
                      href={formData.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors"
                      title="View Current PDF"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Hidden Resume File Input */}
              <input
                ref={resumeInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                className="hidden"
              />

              {/* Manual Resume URL Input */}
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  OR DIRECT RESUME LINK / GOOGLE DRIVE:
                </label>
                <input
                  type="text"
                  name="resume_url"
                  value={formData.resume_url}
                  onChange={handleChange}
                  placeholder="https://... or /storage/uploads/..."
                  className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Multi-Camp & Youth Leadership Photo Gallery Manager */}
          <div className="bg-black/30 rounded-2xl p-6 border border-amber-500/30 space-y-6">
            {/* Header with Title + Add Button */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div>
                <label className="text-sm font-mono font-bold text-amber-300 flex items-center gap-2">
                  <Flag className="w-5 h-5 text-amber-400" />
                  <span>CAMP &amp; YOUTH LEADERSHIP GALLERY ({formData.camp_gallery?.length || 0})</span>
                </label>
                <p className="text-xs text-slate-400 mt-1">
                  Upload multiple photos from National Integration Camp (NIC), leadership summits, and team activities.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddCampPhoto}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-md shadow-amber-600/20 flex items-center gap-1.5 cursor-pointer hover:scale-102"
              >
                <Plus className="w-4 h-4" />
                <span>Add Another Camp Photo</span>
              </button>
            </div>

            {/* List of Camp Photo Cards */}
            <div className="space-y-6">
              {(formData.camp_gallery || []).map((item, index) => {
                const isPrimary = index === 0;
                const isUploading = uploadingCampIndex === index;

                return (
                  <div
                    key={item.id || index}
                    className={`rounded-2xl p-5 border transition-all ${
                      isPrimary
                        ? 'bg-amber-500/5 border-amber-500/40 shadow-sm'
                        : 'bg-black/40 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* Top Action Bar of Card */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300">
                          #{index + 1}
                        </span>
                        {isPrimary ? (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-mono">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            Primary Cover Photo
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryCampPhoto(index)}
                            className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-white/5 hover:bg-amber-500/20 text-slate-400 hover:text-amber-300 border border-white/10 transition-colors cursor-pointer"
                          >
                            Set as Cover Photo
                          </button>
                        )}
                        <span className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                          {item.title || 'Untitled Camp Event'}
                        </span>
                      </div>

                      {/* Move & Delete controls */}
                      <div className="flex items-center gap-1">
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => handleMoveCampPhoto(index, 'up')}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {index < (formData.camp_gallery?.length || 0) - 1 && (
                          <button
                            type="button"
                            onClick={() => handleMoveCampPhoto(index, 'down')}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteCampPhoto(index)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer border border-rose-500/20 ml-1"
                          title="Delete this camp card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                      {/* Left: Photo Preview & Upload */}
                      <div className="md:col-span-5 space-y-3">
                        <div className="relative rounded-xl overflow-hidden bg-black/70 border border-white/10 flex items-center justify-center min-h-[180px] max-h-[220px]">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.title || 'Camp Photo'}
                              className="w-full h-auto max-h-[220px] object-contain"
                            />
                          ) : (
                            <div className="text-center p-4">
                              <ImageIcon className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                              <span className="text-xs text-slate-400 block font-semibold">No Image Uploaded</span>
                              <span className="text-[10px] text-slate-500">Upload JPG, PNG or WebP</span>
                            </div>
                          )}

                          {isUploading && (
                            <div className="absolute inset-0 bg-black/80 flex items-center justify-center gap-2 text-xs font-bold text-amber-300">
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Uploading...</span>
                            </div>
                          )}
                        </div>

                        {/* File Upload / Cut Controls */}
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="flex-1 py-2 px-3 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{item.image_url ? 'Replace / Cut Photo' : 'Upload & Cut Photo'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={isUploading}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleCampPhotoFileSelected(index, file);
                                e.target.value = '';
                              }}
                              className="hidden"
                            />
                          </label>

                          {item.image_url && (
                            <button
                              type="button"
                              onClick={() => handleOpenCampCropper(index)}
                              className="py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                              title="Cut, crop or adjust size / zoom of this photo"
                            >
                              <Scissors className="w-3.5 h-3.5" />
                              <span>Cut / Scale</span>
                            </button>
                          )}
                        </div>

                        {/* Direct URL input */}
                        <div>
                          <input
                            type="text"
                            value={item.image_url ?? ''}
                            onChange={(e) => handleCampFieldChange(index, 'image_url', e.target.value)}
                            placeholder="Image URL or /assets/photo.jpg"
                            className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-slate-300 focus:border-amber-400 focus:outline-none font-mono"
                          />
                        </div>
                      </div>

                      {/* Right: Text Fields */}
                      <div className="md:col-span-7 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-mono text-slate-400 mb-1">
                              CAMP / EVENT TITLE:
                            </label>
                            <input
                              type="text"
                              value={item.title ?? ''}
                              onChange={(e) => handleCampFieldChange(index, 'title', e.target.value)}
                              placeholder="e.g. National Integration Camp (NIC)"
                              className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white focus:border-amber-400 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-slate-400 mb-1">
                              ROLE / DELEGATE BADGE:
                            </label>
                            <input
                              type="text"
                              value={item.tag ?? ''}
                              onChange={(e) => handleCampFieldChange(index, 'tag', e.target.value)}
                              placeholder="e.g. NIC Delegate / Team Lead"
                              className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white focus:border-amber-400 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-mono text-slate-400 mb-1">
                              SUB-TITLE / SPECIALIZATION:
                            </label>
                            <input
                              type="text"
                              value={item.badge ?? ''}
                              onChange={(e) => handleCampFieldChange(index, 'badge', e.target.value)}
                              placeholder="e.g. Youth Leadership & National Integration"
                              className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white focus:border-amber-400 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-slate-400 mb-1">
                              YEAR / DURATION:
                            </label>
                            <input
                              type="text"
                              value={item.date ?? ''}
                              onChange={(e) => handleCampFieldChange(index, 'date', e.target.value)}
                              placeholder="e.g. 2024 / 7-Day Delegation"
                              className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white focus:border-amber-400 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">
                            PHOTO CAPTION &amp; LEADERSHIP STORY:
                          </label>
                          <textarea
                            rows={3}
                            value={item.caption ?? ''}
                            onChange={(e) => handleCampFieldChange(index, 'caption', e.target.value)}
                            placeholder="Describe what happened in this camp, cultural exchange, teamwork..."
                            className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white focus:border-amber-400 focus:outline-none resize-none leading-relaxed"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Add Card Button */}
            <button
              type="button"
              onClick={handleAddCampPhoto}
              className="w-full py-3.5 rounded-2xl border-2 border-dashed border-amber-500/30 hover:border-amber-500/60 text-amber-300 hover:text-white bg-amber-500/5 hover:bg-amber-500/15 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.005]"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Another Camp / Event Photo Card</span>
            </button>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                💡 <strong>How it displays on your live website:</strong> When you add multiple camp photos, an interactive <strong>photo carousel slider with previous/next arrows</strong>, thumbnail selector, and a full-screen <strong>Lightbox Gallery</strong> will appear on your homepage under Education &amp; Campus Experience.
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 2: General Identification & Taglines */}
        <div className="bg-[#0b101d] rounded-2xl p-7 border border-white/10 space-y-6">
          <h3 className="text-base font-bold text-white">Identity & Headline</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">FULL NAME *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                STATUS BADGE (HERO PILL)
              </label>
              <input
                type="text"
                name="status_badge"
                value={formData.status_badge}
                onChange={handleChange}
                placeholder="Available for Select Contracts & High-Impact Roles"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              PRIMARY TITLE / ROLE HEADLINE *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              HERO SUBTITLE / ELEVATOR PITCH
            </label>
            <textarea
              name="tagline"
              rows={2}
              value={formData.tagline}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-cyan-400 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">ABOUT ME BIOGRAPHY</label>
            <textarea
              name="bio"
              rows={5}
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-cyan-400 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* SECTION 3: Contact & Social Handles */}
        <div className="bg-[#0b101d] rounded-2xl p-7 border border-white/10 space-y-6">
          <h3 className="text-base font-bold text-white">Contact Info & Social Networks</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">EMAIL ADDRESS *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">PHONE / WHATSAPP</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">LOCATION</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">GITHUB PROFILE URL</label>
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">LINKEDIN URL</label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">TWITTER / X URL</label>
              <input
                type="url"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">INSTAGRAM URL</label>
              <input
                type="url"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/mrvikash7493"
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: Live Statistics Counters */}
        <div className="bg-[#0b101d] rounded-2xl p-7 border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white">Live Hero Statistics Counters</h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">YEARS EXP</label>
              <input
                type="number"
                name="years_experience"
                value={formData.years_experience}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">PROJECTS COMPLETED</label>
              <input
                type="number"
                name="projects_completed"
                value={formData.projects_completed}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">CLIENTS SERVED</label>
              <input
                type="number"
                name="satisfied_clients"
                value={formData.satisfied_clients}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">CODE COMMITS</label>
              <input
                type="text"
                name="code_commits"
                value={formData.code_commits}
                onChange={handleChange}
                placeholder="15K+"
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Interactive Image Cropper & Scaler Modal ("Cut / Small karne ka tool") */}
      <ImageCropModal
        isOpen={cropperState.isOpen}
        imageSrc={cropperState.imageSrc}
        originalFile={cropperState.originalFile}
        title={cropperState.title}
        defaultAspect={cropperState.defaultAspect}
        onClose={() =>
          setCropperState((prev) => ({
            ...prev,
            isOpen: false,
            originalFile: null,
          }))
        }
        onApply={handleCropperApply}
      />
    </div>
  );
}
