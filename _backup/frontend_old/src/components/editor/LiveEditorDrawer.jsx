import React, { useState, useRef } from 'react';
import {
  X,
  Save,
  Sparkles,
  Upload,
  Scissors,
  Plus,
  Trash2,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Layers,
  Image as ImageIcon,
  User,
  GraduationCap,
  Code2,
  FolderGit2,
  Briefcase,
  Mail,
  Share2,
} from 'lucide-react';
import ImageCropModal from '../admin/ImageCropModal';
import { uploadFile } from '../../services/api';

export default function LiveEditorDrawer({
  isOpen,
  onClose,
  activeSection,
  onSelectSection,
  profile,
  onUpdateProfile,
  projects,
  onUpdateProjects,
  skills,
  onUpdateSkills,
  onSaveLiveChanges,
  isLiveSaving,
  hasUnsavedChanges,
}) {
  const [cropperState, setCropperState] = useState({
    isOpen: false,
    imageSrc: '',
    originalFile: null,
    title: '',
    defaultAspect: '16:9',
    target: null, // 'hero' | { type: 'camp', index: number } | { type: 'project', index: number }
  });

  const [uploading, setUploading] = useState(false);
  const heroFileInputRef = useRef(null);

  if (!isOpen) return null;

  const sectionsList = [
    { id: 'hero', label: 'Hero & 3D Portrait', icon: User },
    { id: 'about', label: 'About & Story', icon: Sparkles },
    { id: 'education-leadership', label: 'NIC Camp & Gallery', icon: GraduationCap },
    { id: 'skills', label: 'Skills & Tech Stack', icon: Code2 },
    { id: 'projects', label: 'Featured Projects', icon: FolderGit2 },
    { id: 'experience', label: 'Career Timeline', icon: Briefcase },
    { id: 'contact', label: 'Contact & Socials', icon: Mail },
  ];

  // Helper to update top-level profile fields in real-time
  const handleProfileChange = (field, value) => {
    onUpdateProfile({
      ...profile,
      [field]: value,
    });
  };

  // Helper to update nested about_details
  const handleAboutDetailChange = (field, value) => {
    onUpdateProfile({
      ...profile,
      about_details: {
        ...(profile?.about_details || {}),
        [field]: value,
      },
    });
  };

  // Hero Image Cut / Upload
  const handleHeroFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setCropperState({
      isOpen: true,
      imageSrc: previewUrl,
      originalFile: file,
      title: 'Cut / Scale Hero Portrait',
      defaultAspect: '4:5',
      target: 'hero',
    });
    e.target.value = '';
  };

  // Camp Photo Cut / Upload
  const handleCampPhotoFileSelected = (index, file) => {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setCropperState({
      isOpen: true,
      imageSrc: previewUrl,
      originalFile: file,
      title: `Cut & Scale Camp Photo #${index + 1}`,
      defaultAspect: '16:9',
      target: { type: 'camp', index },
    });
  };

  // Callback when cropped image is ready
  const handleCropperApply = async (processedFile) => {
    if (!cropperState.target) return;
    try {
      setUploading(true);
      const res = await uploadFile(processedFile);

      if (cropperState.target === 'hero') {
        onUpdateProfile({
          ...profile,
          hero_image_url: res.url,
          avatar_url: res.url,
        });
      } else if (cropperState.target.type === 'camp') {
        const index = cropperState.target.index;
        const currentList = profile?.camp_gallery || [];
        const updated = currentList.map((itm, i) => {
          if (i === index) {
            return { ...itm, image_url: res.url };
          }
          return itm;
        });
        onUpdateProfile({
          ...profile,
          camp_gallery: updated,
          camp_image_url: index === 0 ? res.url : (updated[0]?.image_url || profile?.camp_image_url),
        });
      } else if (cropperState.target.type === 'project') {
        const index = cropperState.target.index;
        if (projects && projects[index]) {
          const updated = [...projects];
          updated[index] = { ...updated[index], image_url: res.url };
          onUpdateProjects(updated);
        }
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Photo upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Camp gallery mutations
  const handleCampFieldChange = (index, field, value) => {
    const currentList = profile?.camp_gallery || [];
    const updated = currentList.map((itm, i) => {
      if (i === index) {
        return { ...itm, [field]: value };
      }
      return itm;
    });
    onUpdateProfile({
      ...profile,
      camp_gallery: updated,
      camp_title: index === 0 && field === 'title' ? value : (updated[0]?.title || profile?.camp_title),
      camp_caption: index === 0 && field === 'caption' ? value : (updated[0]?.caption || profile?.camp_caption),
    });
  };

  const handleAddCampCard = () => {
    const newItem = {
      id: `camp_${Date.now()}`,
      image_url: '',
      title: '',
      tag: 'NIC Delegate',
      badge: 'Youth Leadership',
      date: new Date().getFullYear().toString(),
      caption: '',
    };
    onUpdateProfile({
      ...profile,
      camp_gallery: [...(profile?.camp_gallery || []), newItem],
    });
  };

  const handleDeleteCampCard = (index) => {
    const updated = (profile?.camp_gallery || []).filter((_, i) => i !== index);
    onUpdateProfile({
      ...profile,
      camp_gallery: updated,
      camp_image_url: updated[0]?.image_url || '',
      camp_title: updated[0]?.title || '',
      camp_caption: updated[0]?.caption || '',
    });
  };

  return (
    <>
      <aside aria-label="Visual page editor drawer" className="fixed top-14 bottom-0 right-0 z-50 w-full sm:w-[480px] bg-[#0a0f1d]/98 backdrop-blur-2xl border-l border-cyan-500/30 shadow-2xl flex flex-col text-slate-100 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 border-b border-white/10 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Live Section Inspector</h3>
              <p className="text-[11px] text-cyan-400 font-mono">Edits update on page in real-time</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isLiveSaving || !hasUnsavedChanges}
              onClick={onSaveLiveChanges}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                hasUnsavedChanges
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-white/10 text-slate-400 opacity-60'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Section Selector Horizontal Bar */}
        <div className="px-3 py-2 bg-black/40 border-b border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {sectionsList.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => {
                  onSelectSection(sec.id);
                  const el = document.getElementById(sec.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Editable Form Controls Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* SECTION: HERO */}
          {activeSection === 'hero' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200">
                ✨ Edit your primary headline, status pill, tagline, and big portrait picture.
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">NAME / DISPLAY BRAND:</label>
                <input
                  type="text"
                  value={profile?.name ?? ''}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">AVAILABILITY / STATUS BADGE:</label>
                <input
                  type="text"
                  value={profile?.status_badge ?? ''}
                  onChange={(e) => handleProfileChange('status_badge', e.target.value)}
                  placeholder="e.g. B.Tech CSE 2nd Year @ IKGPTU • Open for Software Internships"
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">HERO BIO TAGLINE:</label>
                <textarea
                  rows={3}
                  value={profile?.tagline ?? ''}
                  onChange={(e) => handleProfileChange('tagline', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Hero Portrait Quick Cut & Replace */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-300">HERO 3D PORTRAIT PHOTO</span>
                  {uploading && <span className="text-[10px] text-cyan-400 animate-pulse">Uploading...</span>}
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-16 h-20 rounded-xl overflow-hidden bg-slate-900 border border-white/10 shrink-0">
                    <img
                      src={profile?.hero_image_url || '/assets/vikash-hero.jpg'}
                      alt="Hero"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <button
                      type="button"
                      onClick={() => heroFileInputRef.current?.click()}
                      className="w-full py-1.5 px-3 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-cyan-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload &amp; Cut Photo</span>
                    </button>

                    {profile?.hero_image_url && (
                      <button
                        type="button"
                        onClick={() =>
                          setCropperState({
                            isOpen: true,
                            imageSrc: profile.hero_image_url,
                            originalFile: null,
                            title: 'Adjust / Cut Hero Portrait',
                            defaultAspect: '4:5',
                            target: 'hero',
                          })
                        }
                        className="w-full py-1.5 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Scissors className="w-3.5 h-3.5" />
                        <span>Cut / Scale This Photo</span>
                      </button>
                    )}

                    <input
                      ref={heroFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleHeroFileSelected}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: ABOUT */}
          {activeSection === 'about' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200">
                📖 Edit your bio narrative, origins, academic status, and personal interests.
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">MAIN ABOUT NARRATIVE:</label>
                <textarea
                  rows={6}
                  value={profile?.bio ?? ''}
                  onChange={(e) => handleProfileChange('bio', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">HOMETOWN / STATE:</label>
                  <input
                    type="text"
                    value={profile?.about_details?.hometown ?? 'Bihar, India'}
                    onChange={(e) => handleAboutDetailChange('hometown', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">BORN YEAR:</label>
                  <input
                    type="text"
                    value={profile?.about_details?.born ?? '2007'}
                    onChange={(e) => handleAboutDetailChange('born', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">UNIVERSITY &amp; LOCATION:</label>
                <input
                  type="text"
                  value={profile?.about_details?.university ?? 'I.K. Gujral Punjab Technical University (IKGPTU), Main Campus'}
                  onChange={(e) => handleAboutDetailChange('university', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">PASSIONS &amp; ACTIVITIES:</label>
                <textarea
                  rows={3}
                  value={profile?.about_details?.passions ?? ''}
                  onChange={(e) => handleAboutDetailChange('passions', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none resize-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* SECTION: EDUCATION & CAMP GALLERY */}
          {activeSection === 'education-leadership' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold font-mono text-amber-300">CAMP &amp; YOUTH LEADERSHIP CARDS</h4>
                  <p className="text-[11px] text-slate-400">Photos appear in the live carousel &amp; lightbox</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddCampCard}
                  className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Card</span>
                </button>
              </div>

              <div className="space-y-4">
                {(profile?.camp_gallery || []).map((camp, idx) => (
                  <div key={camp.id || idx} className="p-3.5 rounded-xl bg-black/50 border border-amber-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-amber-400">Card #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteCampCard(idx)}
                        className="p-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-900 border border-white/10 shrink-0 flex items-center justify-center">
                        {camp.image_url ? (
                          <img src={camp.image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-slate-600" />
                        )}
                      </div>

                      <div className="flex-1 flex gap-1.5">
                        <label className="flex-1 py-1.5 px-2 rounded-lg bg-amber-600/30 hover:bg-amber-600/40 text-amber-300 text-[11px] font-bold border border-amber-500/30 text-center cursor-pointer flex items-center justify-center gap-1">
                          <Upload className="w-3 h-3" />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleCampPhotoFileSelected(idx, file);
                              e.target.value = '';
                            }}
                            className="hidden"
                          />
                        </label>

                        {camp.image_url && (
                          <button
                            type="button"
                            onClick={() =>
                              setCropperState({
                                isOpen: true,
                                imageSrc: camp.image_url,
                                originalFile: null,
                                title: `Cut & Scale Camp Photo #${idx + 1}`,
                                defaultAspect: '16:9',
                                target: { type: 'camp', index: idx },
                              })
                            }
                            className="py-1.5 px-2 rounded-lg bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/30 cursor-pointer flex items-center gap-1"
                          >
                            <Scissors className="w-3 h-3" />
                            <span>Cut</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-0.5">TITLE:</label>
                      <input
                        type="text"
                        value={camp.title ?? ''}
                        onChange={(e) => handleCampFieldChange(idx, 'title', e.target.value)}
                        placeholder="e.g. National Integration Camp (NIC)"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-0.5">ROLE BADGE:</label>
                        <input
                          type="text"
                          value={camp.tag ?? ''}
                          onChange={(e) => handleCampFieldChange(idx, 'tag', e.target.value)}
                          placeholder="e.g. NIC Delegate"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-white focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-0.5">YEAR:</label>
                        <input
                          type="text"
                          value={camp.date ?? ''}
                          onChange={(e) => handleCampFieldChange(idx, 'date', e.target.value)}
                          placeholder="2024"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-white focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-0.5">CAPTION &amp; STORY:</label>
                      <textarea
                        rows={2}
                        value={camp.caption ?? ''}
                        onChange={(e) => handleCampFieldChange(idx, 'caption', e.target.value)}
                        placeholder="Describe activities and leadership..."
                        className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-white focus:border-amber-400 focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: FEATURED PROJECTS */}
          {activeSection === 'projects' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200">
                🚀 Projects list updates live on the website as you edit titles, descriptions, and links.
              </div>

              {(projects || []).map((proj, pIdx) => (
                <div key={proj.id || pIdx} className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate max-w-[240px]">{proj.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                      {proj.category || 'Full-Stack'}
                    </span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-0.5">PROJECT TITLE:</label>
                    <input
                      type="text"
                      value={proj.title ?? ''}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[pIdx] = { ...updated[pIdx], title: e.target.value };
                        onUpdateProjects(updated);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-0.5">SHORT DESCRIPTION:</label>
                    <textarea
                      rows={2}
                      value={proj.description ?? ''}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[pIdx] = { ...updated[pIdx], description: e.target.value };
                        onUpdateProjects(updated);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-0.5">LIVE URL:</label>
                      <input
                        type="text"
                        value={proj.live_url ?? ''}
                        onChange={(e) => {
                          const updated = [...projects];
                          updated[pIdx] = { ...updated[pIdx], live_url: e.target.value };
                          onUpdateProjects(updated);
                        }}
                        placeholder="https://..."
                        className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-0.5">GITHUB REPO:</label>
                      <input
                        type="text"
                        value={proj.github_url ?? ''}
                        onChange={(e) => {
                          const updated = [...projects];
                          updated[pIdx] = { ...updated[pIdx], github_url: e.target.value };
                          onUpdateProjects(updated);
                        }}
                        placeholder="https://github.com/..."
                        className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SECTION: SKILLS */}
          {activeSection === 'skills' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200">
                ⚡ Adjust skill proficiency or names in real-time.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(skills || []).map((skill, sIdx) => (
                  <div key={skill.id || sIdx} className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{skill.name}</span>
                      <span className="text-cyan-400 font-mono">{skill.proficiency ?? 85}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={skill.proficiency ?? 85}
                      onChange={(e) => {
                        const updated = [...skills];
                        updated[sIdx] = { ...updated[sIdx], proficiency: parseInt(e.target.value) };
                        onUpdateSkills(updated);
                      }}
                      className="w-full accent-cyan-400 h-1 bg-white/10 rounded cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: CONTACT & SOCIALS */}
          {activeSection === 'contact' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200">
                📬 Edit direct contact links, WhatsApp number, and social profiles.
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">EMAIL ADDRESS:</label>
                <input
                  type="email"
                  value={profile?.email ?? ''}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">PHONE / WHATSAPP:</label>
                <input
                  type="text"
                  value={profile?.phone ?? ''}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">LINKEDIN URL:</label>
                <input
                  type="text"
                  value={profile?.linkedin ?? ''}
                  onChange={(e) => handleProfileChange('linkedin', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">GITHUB URL:</label>
                <input
                  type="text"
                  value={profile?.github ?? ''}
                  onChange={(e) => handleProfileChange('github', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">INSTAGRAM URL:</label>
                <input
                  type="text"
                  value={profile?.instagram ?? ''}
                  onChange={(e) => handleProfileChange('instagram', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Save Button */}
        <div className="p-4 border-t border-white/10 bg-slate-900/95 flex items-center justify-between gap-3">
          <span className="text-xs font-mono text-slate-400">
            {hasUnsavedChanges ? '⚡ Unsaved live edits' : 'Synced with site'}
          </span>

          <button
            type="button"
            disabled={isLiveSaving || !hasUnsavedChanges}
            onClick={onSaveLiveChanges}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg ${
              hasUnsavedChanges
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/25 animate-pulse'
                : 'bg-white/10 text-slate-400 cursor-not-allowed opacity-60'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{isLiveSaving ? 'Saving...' : 'Save Live Changes'}</span>
          </button>
        </div>
      </aside>

      {/* Cropper Modal for in-page image cropping */}
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
    </>
  );
}
