import React, { useState, useEffect } from 'react';
import {
  Sparkles, User, Wrench, FolderGit2, Briefcase, GraduationCap,
  Award, Trophy, BookOpen, MessageSquareQuote, Plus, Trash2, Edit2,
  Check, Star, ExternalLink, Eye, Image as ImageIcon, Upload, Save
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getProfile, updateProfile, uploadProfileImage,
  adminGetProjects, adminCreateProject, adminUpdateProject, adminDeleteProject, adminTogglePin, adminUpdateProjectStatus,
  adminGetSkills, adminCreateSkill, adminUpdateSkill, adminDeleteSkill, adminToggleSkill,
  adminGetExperiences, adminCreateExperience, adminUpdateExperience, adminDeleteExperience,
  adminGetEducations, adminCreateEducation, adminUpdateEducation, adminDeleteEducation,
  adminGetCertificates, adminCreateCertificate, adminUpdateCertificate, adminDeleteCertificate,
  adminGetAchievements, adminCreateAchievement, adminUpdateAchievement, adminDeleteAchievement,
  adminGetBlogs, adminCreateBlog, adminUpdateBlog, adminDeleteBlog,
  adminGetTestimonials, adminCreateTestimonial, adminUpdateTestimonial, adminDeleteTestimonial, adminToggleApproveTestimonial, adminToggleFeatureTestimonial,
  adminUploadMedia
} from '@/api/adminApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { getAssetUrl, compressImage } from '@/lib/utils';

export default function ContentView({ section = 'hero' }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Lists
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  // Modals & Forms
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadData();
  }, [section]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (['hero', 'about'].includes(section)) {
        const res = await getProfile();
        if (res.data?.data) setProfile(res.data.data);
      } else if (section === 'skills') {
        const res = await adminGetSkills();
        if (res.data?.data) setSkills(res.data.data);
      } else if (section === 'projects') {
        const res = await adminGetProjects();
        if (res.data?.data) setProjects(res.data.data);
      } else if (section === 'experience') {
        const res = await adminGetExperiences();
        if (res.data?.data) setExperiences(res.data.data);
      } else if (section === 'education') {
        const res = await adminGetEducations();
        if (res.data?.data) setEducations(res.data.data);
      } else if (section === 'certificates') {
        const res = await adminGetCertificates();
        if (res.data?.data) setCertificates(res.data.data);
      } else if (section === 'achievements') {
        const res = await adminGetAchievements();
        if (res.data?.data) setAchievements(res.data.data);
      } else if (section === 'blog') {
        const res = await adminGetBlogs();
        if (res.data?.data) setBlogs(res.data.data);
      } else if (section === 'testimonials') {
        const res = await adminGetTestimonials();
        if (res.data?.data) setTestimonials(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load ' + section);
    } finally {
      setLoading(false);
    }
  };

  // --- SAVE HERO & ABOUT PROFILE ---
  const handleSaveProfile = async (updates) => {
    try {
      const res = await updateProfile(updates);
      if (res.data?.data) {
        setProfile(res.data.data);
        toast.success('Saved successfully! Public portfolio updated.');
      }
    } catch (err) {
      toast.error('Failed to save profile changes');
    }
  };

  const handleImageUpload = async (e) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;
    try {
      const file = await compressImage(rawFile, 1920);
      const form = new FormData();
      form.append('image', file);
      const res = await uploadProfileImage(form);
      if (res.data?.data) {
        setProfile(res.data.data);
        toast.success('Profile photo uploaded and updated!');
      }
    } catch (e) {
      toast.error('Failed to upload image');
    }
  };

  return (
    <div className="space-y-6">
      {/* ===================== HERO SECTION ===================== */}
      {section === 'hero' && profile && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Hero Section CMS</h2>
              <p className="text-xs text-slate-400">Configure greeting, headline, call-to-action buttons, and portrait</p>
            </div>
            <Button
              onClick={() => handleSaveProfile({ hero_settings: profile.hero_settings, availability_status: profile.availability_status })}
              variant="default"
              size="sm"
            >
              <Save className="w-3.5 h-3.5" /> Save Changes
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 space-y-4">
              <CardHeader>
                <CardTitle>Hero Copy & CTAs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 font-medium mb-1 block">Badge Pill</label>
                    <Input
                      value={profile.hero_settings?.badge || ''}
                      onChange={(e) => setProfile({ ...profile, hero_settings: { ...profile.hero_settings, badge: e.target.value } })}
                      placeholder="CSE STUDENT · 2026"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-medium mb-1 block">Availability Status</label>
                    <Input
                      value={profile.availability_status || ''}
                      onChange={(e) => setProfile({ ...profile, availability_status: e.target.value })}
                      placeholder="Open for Summer 2025 Roles"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 font-medium mb-1 block">Title Prefix</label>
                    <Input
                      value={profile.hero_settings?.title_prefix || ''}
                      onChange={(e) => setProfile({ ...profile, hero_settings: { ...profile.hero_settings, title_prefix: e.target.value } })}
                      placeholder="Hi, I'm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-medium mb-1 block">Highlight Name</label>
                    <Input
                      value={profile.hero_settings?.highlight_name || ''}
                      onChange={(e) => setProfile({ ...profile, hero_settings: { ...profile.hero_settings, highlight_name: e.target.value } })}
                      placeholder="Vikash"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium mb-1 block">Main Hero Tagline</label>
                  <Textarea
                    rows={2}
                    value={profile.hero_settings?.tagline || ''}
                    onChange={(e) => setProfile({ ...profile, hero_settings: { ...profile.hero_settings, tagline: e.target.value } })}
                    placeholder="Architecting scalable web and mobile applications..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 font-medium mb-1 block">Primary Button Text</label>
                    <Input
                      value={profile.hero_settings?.primary_btn_text || ''}
                      onChange={(e) => setProfile({ ...profile, hero_settings: { ...profile.hero_settings, primary_btn_text: e.target.value } })}
                      placeholder="Explore Work"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-medium mb-1 block">Primary Button Link</label>
                    <Input
                      value={profile.hero_settings?.primary_btn_link || ''}
                      onChange={(e) => setProfile({ ...profile, hero_settings: { ...profile.hero_settings, primary_btn_link: e.target.value } })}
                      placeholder="#projects"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 font-medium mb-1 block">Secondary Button Text</label>
                    <Input
                      value={profile.hero_settings?.secondary_btn_text || ''}
                      onChange={(e) => setProfile({ ...profile, hero_settings: { ...profile.hero_settings, secondary_btn_text: e.target.value } })}
                      placeholder="Download Resume"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-medium mb-1 block">Secondary Button Link</label>
                    <Input
                      value={profile.hero_settings?.secondary_btn_link || ''}
                      onChange={(e) => setProfile({ ...profile, hero_settings: { ...profile.hero_settings, secondary_btn_link: e.target.value } })}
                      placeholder="#contact"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium mb-1 block">Subtext Badge</label>
                  <Input
                    value={profile.hero_settings?.status_subtext || ''}
                    onChange={(e) => setProfile({ ...profile, hero_settings: { ...profile.hero_settings, status_subtext: e.target.value } })}
                    placeholder="Top Freelancer · Full-Stack & AI · 2+ Years Exp"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Profile Photo Uploader & Live Card */}
            <Card className="space-y-4 flex flex-col justify-between">
              <div>
                <CardHeader>
                  <CardTitle>Profile Portrait</CardTitle>
                  <CardDescription>Hero avatar shown on public portfolio</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-[4/5] rounded-xl overflow-hidden border border-slate-700 bg-slate-900 relative group">
                    <img
                      src={getAssetUrl(profile.profile_image_url, '/assets/vikash-hero.jpg')}
                      alt="Vikash"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <label className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" /> Replace Photo
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </CardContent>
              </div>

              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
                ✓ Public portfolio hero will refresh immediately when changes are saved.
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ===================== ABOUT SECTION ===================== */}
      {section === 'about' && profile && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">About Section CMS</h2>
              <p className="text-xs text-slate-400">Manage professional bio, background narrative, and key metric counters</p>
            </div>
            <Button
              onClick={() => handleSaveProfile({
                name: profile.name,
                professional_name: profile.professional_name,
                tagline: profile.tagline,
                headline: profile.headline,
                bio: profile.bio,
                about_description: profile.about_description,
                location: profile.location,
                phone: profile.phone,
                email: profile.email,
                about_stats: profile.about_stats,
              })}
              variant="default"
              size="sm"
            >
              <Save className="w-3.5 h-3.5" /> Save Changes
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="space-y-4">
              <CardHeader>
                <CardTitle>Personal Narrative</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 font-medium mb-1 block">Full Legal Name</label>
                    <Input
                      value={profile.name || ''}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-medium mb-1 block">Professional Name</label>
                    <Input
                      value={profile.professional_name || ''}
                      onChange={(e) => setProfile({ ...profile, professional_name: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium mb-1 block">Short Tagline</label>
                  <Input
                    value={profile.tagline || ''}
                    onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium mb-1 block">Short Bio</label>
                  <Textarea
                    rows={3}
                    value={profile.bio || ''}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium mb-1 block">Detailed About Paragraph</label>
                  <Textarea
                    rows={4}
                    value={profile.about_description || ''}
                    onChange={(e) => setProfile({ ...profile, about_description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 font-medium mb-1 block">Location</label>
                    <Input
                      value={profile.location || ''}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-medium mb-1 block">Phone</label>
                    <Input
                      value={profile.phone || ''}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-medium mb-1 block">Email</label>
                    <Input
                      value={profile.email || ''}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Statistics Counters */}
            <Card className="space-y-4">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Personal Metrics & Statistics</CardTitle>
                  <CardDescription>Live stats displayed on the about card</CardDescription>
                </div>
                <Button
                  onClick={() => {
                    const stats = profile.about_stats || [];
                    setProfile({ ...profile, about_stats: [...stats, { label: 'New Metric', value: '100+', unit: 'Unit' }] });
                  }}
                  size="sm"
                  variant="secondary"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Metric
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.about_stats?.map((stat, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="flex-1">
                      <label className="text-[10px] text-slate-500 font-mono block">Label</label>
                      <Input
                        value={stat.label}
                        onChange={(e) => {
                          const updated = [...profile.about_stats];
                          updated[idx].label = e.target.value;
                          setProfile({ ...profile, about_stats: updated });
                        }}
                        className="h-7 text-xs"
                      />
                    </div>
                    <div className="w-24">
                      <label className="text-[10px] text-slate-500 font-mono block">Value</label>
                      <Input
                        value={stat.value}
                        onChange={(e) => {
                          const updated = [...profile.about_stats];
                          updated[idx].value = e.target.value;
                          setProfile({ ...profile, about_stats: updated });
                        }}
                        className="h-7 text-xs font-mono font-bold text-emerald-400"
                      />
                    </div>
                    <div className="w-24">
                      <label className="text-[10px] text-slate-500 font-mono block">Subtext</label>
                      <Input
                        value={stat.unit || ''}
                        onChange={(e) => {
                          const updated = [...profile.about_stats];
                          updated[idx].unit = e.target.value;
                          setProfile({ ...profile, about_stats: updated });
                        }}
                        className="h-7 text-xs"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const updated = profile.about_stats.filter((_, i) => i !== idx);
                        setProfile({ ...profile, about_stats: updated });
                      }}
                      className="text-rose-400 hover:text-rose-300 p-1 mt-4"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ===================== SKILLS SECTION ===================== */}
      {section === 'skills' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Skills & Arsenal Manager</h2>
              <p className="text-xs text-slate-400">Total skills: {skills.length} · Categorized by engineering discipline</p>
            </div>
            <Button
              onClick={() => {
                setEditItem(null);
                setFormData({ name: '', category_name: 'Frontend', proficiency: 90, icon: 'Code', is_enabled: true });
                setModalOpen(true);
              }}
              variant="default"
              size="sm"
            >
              <Plus className="w-3.5 h-3.5" /> Add Skill
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">{skill.name}</span>
                    <Badge variant={skill.is_enabled ? 'default' : 'secondary'}>
                      {skill.proficiency || 85}%
                    </Badge>
                  </div>
                  <span className="text-[11px] text-slate-400 block">{skill.category_name || skill.category}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={async () => {
                      await adminToggleSkill(skill.id);
                      loadData();
                    }}
                    title={skill.is_enabled ? 'Disable' : 'Enable'}
                    className={`p-1.5 rounded-lg text-xs ${skill.is_enabled ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-800'}`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setEditItem(skill);
                      setFormData({ ...skill });
                      setModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm(`Delete skill ${skill.name}?`)) {
                        await adminDeleteSkill(skill.id);
                        loadData();
                        toast.success('Deleted');
                      }
                    }}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== PROJECTS SECTION ===================== */}
      {section === 'projects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Projects CMS</h2>
              <p className="text-xs text-slate-400">Total active projects: {projects.length}</p>
            </div>
            <Button
              onClick={() => {
                setEditItem(null);
                setFormData({
                  title: '',
                  description: '',
                  category: 'Full Stack',
                  tech_tags: ['React', 'Laravel'],
                  github_link: '',
                  live_link: '',
                  status: 'published',
                  is_pinned: false,
                });
                setModalOpen(true);
              }}
              variant="default"
              size="sm"
            >
              <Plus className="w-3.5 h-3.5" /> Add Project
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <Card key={proj.id} className="overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="aspect-video bg-slate-950 relative overflow-hidden">
                    <img
                      src={proj.thumbnail_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'}
                      alt={proj.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge variant="primary">{proj.category}</Badge>
                    </div>
                    {proj.is_pinned && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="warning">Featured</Badge>
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-white text-base leading-tight">{proj.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{proj.description}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.tech_tags?.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-800/80 flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={async () => {
                        await adminTogglePin(proj.id);
                        loadData();
                      }}
                      className={`p-1.5 rounded-lg text-xs ${proj.is_pinned ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400 hover:bg-slate-800'}`}
                      title="Toggle Pin"
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>
                    {proj.live_link && (
                      <a href={proj.live_link} target="_blank" rel="noreferrer" className="p-1.5 text-slate-400 hover:text-white">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      onClick={() => {
                        setEditItem(proj);
                        setFormData({ ...proj });
                        setModalOpen(true);
                      }}
                      size="sm"
                      variant="outline"
                    >
                      <Edit2 className="w-3 h-3" /> Edit
                    </Button>
                    <button
                      onClick={async () => {
                        if (confirm(`Delete project ${proj.title}?`)) {
                          await adminDeleteProject(proj.id);
                          loadData();
                          toast.success('Project deleted');
                        }
                      }}
                      className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ===================== EXPERIENCES SECTION ===================== */}
      {section === 'experience' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Experience Timeline CMS</h2>
              <p className="text-xs text-slate-400">Total career stops: {experiences.length}</p>
            </div>
            <Button
              onClick={() => {
                setEditItem(null);
                setFormData({ company: '', position: '', period: '', location: '', description: '', is_current: false });
                setModalOpen(true);
              }}
              variant="default"
              size="sm"
            >
              <Plus className="w-3.5 h-3.5" /> Add Experience
            </Button>
          </div>

          <div className="space-y-3">
            {experiences.map((exp) => (
              <Card key={exp.id} className="p-4 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">{exp.position}</span>
                    <span className="text-emerald-400 font-semibold text-xs">@ {exp.company}</span>
                    {exp.is_current && <Badge variant="default">Current</Badge>}
                  </div>
                  <span className="text-xs text-slate-400 font-mono block">{exp.period || '2024'} &middot; {exp.location || 'Remote'}</span>
                  <p className="text-xs text-slate-300 mt-2 max-w-2xl">{exp.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => {
                      setEditItem(exp);
                      setFormData({ ...exp });
                      setModalOpen(true);
                    }}
                    size="sm"
                    variant="outline"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </Button>
                  <button
                    onClick={async () => {
                      if (confirm('Delete experience?')) {
                        await adminDeleteExperience(exp.id);
                        loadData();
                      }
                    }}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ===================== EDUCATION SECTION ===================== */}
      {section === 'education' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Education & Academics</h2>
              <p className="text-xs text-slate-400">Total degrees: {educations.length}</p>
            </div>
            <Button
              onClick={() => {
                setEditItem(null);
                setFormData({ institution: '', degree: '', field_of_study: 'Computer Science', grade: '8.5 CGPA', start_date: '2022', end_date: '2026' });
                setModalOpen(true);
              }}
              variant="default"
              size="sm"
            >
              <Plus className="w-3.5 h-3.5" /> Add Education
            </Button>
          </div>

          <div className="space-y-3">
            {educations.map((edu) => (
              <Card key={edu.id} className="p-4 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">{edu.degree}</span>
                    <Badge variant="primary">{edu.grade || '8.5 CGPA'}</Badge>
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold">{edu.institution}</span>
                  <span className="text-[11px] text-slate-400 block font-mono">{edu.start_date} - {edu.end_date}</span>
                  <p className="text-xs text-slate-300 mt-2">{edu.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => {
                      setEditItem(edu);
                      setFormData({ ...edu });
                      setModalOpen(true);
                    }}
                    size="sm"
                    variant="outline"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </Button>
                  <button
                    onClick={async () => {
                      if (confirm('Delete education record?')) {
                        await adminDeleteEducation(edu.id);
                        loadData();
                      }
                    }}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ===================== CERTIFICATES & ACHIEVEMENTS ===================== */}
      {section === 'certificates' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Certificates Manager</h2>
              <p className="text-xs text-slate-400">Total certifications: {certificates.length}</p>
            </div>
            <Button
              onClick={() => {
                setEditItem(null);
                setFormData({ title: '', issuer: '', issue_date: '2024', credential_id: '', credential_url: '' });
                setModalOpen(true);
              }}
              variant="default"
              size="sm"
            >
              <Plus className="w-3.5 h-3.5" /> Add Certificate
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <Card key={cert.id} className="p-4 flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-bold text-white text-sm">{cert.title}</h3>
                  <span className="text-xs text-emerald-400 font-medium block">{cert.issuer} &middot; {cert.issue_date}</span>
                  {cert.credential_id && (
                    <span className="text-[10px] text-slate-500 font-mono block">ID: {cert.credential_id}</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    onClick={() => {
                      setEditItem(cert);
                      setFormData({ ...cert });
                      setModalOpen(true);
                    }}
                    size="sm"
                    variant="outline"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </Button>
                  <button
                    onClick={async () => {
                      if (confirm('Delete certificate?')) {
                        await adminDeleteCertificate(cert.id);
                        loadData();
                      }
                    }}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {section === 'achievements' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Achievements & Honors</h2>
              <p className="text-xs text-slate-400">Total achievements: {achievements.length}</p>
            </div>
            <Button
              onClick={() => {
                setEditItem(null);
                setFormData({ title: '', description: '', date: '2024', image_url: '', external_link: '' });
                setModalOpen(true);
              }}
              variant="default"
              size="sm"
            >
              <Plus className="w-3.5 h-3.5" /> Add Achievement
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((ach) => (
              <Card key={ach.id} className="p-4 flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-bold text-white text-sm">{ach.title}</h3>
                  <span className="text-xs text-amber-400 font-mono block">{ach.date}</span>
                  <p className="text-xs text-slate-300 mt-1">{ach.description}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    onClick={() => {
                      setEditItem(ach);
                      setFormData({ ...ach });
                      setModalOpen(true);
                    }}
                    size="sm"
                    variant="outline"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </Button>
                  <button
                    onClick={async () => {
                      if (confirm('Delete achievement?')) {
                        await adminDeleteAchievement(ach.id);
                        loadData();
                      }
                    }}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ===================== BLOG SECTION ===================== */}
      {section === 'blog' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Blog & Publications CMS</h2>
              <p className="text-xs text-slate-400">Total articles: {blogs.length}</p>
            </div>
            <Button
              onClick={() => {
                setEditItem(null);
                setFormData({ title: '', slug: '', excerpt: '', content: '', category: 'Engineering', status: 'published', featured_image: '' });
                setModalOpen(true);
              }}
              variant="default"
              size="sm"
            >
              <Plus className="w-3.5 h-3.5" /> New Post
            </Button>
          </div>

          <div className="space-y-3">
            {blogs.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No posts created yet.</p>
            ) : (
              blogs.map((b) => (
                <Card key={b.id} className="p-4 flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base">{b.title}</span>
                      <Badge variant="primary">{b.category}</Badge>
                      <Badge variant={b.status === 'published' ? 'default' : 'secondary'}>{b.status}</Badge>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">/{b.slug}</span>
                    <p className="text-xs text-slate-300 mt-1">{b.excerpt}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      onClick={() => {
                        setEditItem(b);
                        setFormData({ ...b });
                        setModalOpen(true);
                      }}
                      size="sm"
                      variant="outline"
                    >
                      <Edit2 className="w-3 h-3" /> Edit
                    </Button>
                    <button
                      onClick={async () => {
                        if (confirm('Delete post?')) {
                          await adminDeleteBlog(b.id);
                          loadData();
                        }
                      }}
                      className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* ===================== TESTIMONIALS / REVIEWS ===================== */}
      {section === 'testimonials' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Testimonials & Reviews CMS</h2>
              <p className="text-xs text-slate-400">Total reviews: {testimonials.length} · Public submissions require admin approval</p>
            </div>
            <Button
              onClick={() => {
                setEditItem(null);
                setFormData({ name: '', designation: '', company: '', content: '', rating: 5, is_approved: true });
                setModalOpen(true);
              }}
              variant="default"
              size="sm"
            >
              <Plus className="w-3.5 h-3.5" /> Add Review
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((test) => (
              <Card key={test.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">{test.name}</h3>
                    <span className="text-xs text-slate-400 block">{test.designation} &middot; {test.company}</span>
                    <div className="flex items-center gap-1 text-yellow-400 mt-1">
                      {Array.from({ length: test.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400" />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={async () => {
                        await adminToggleApproveTestimonial(test.id);
                        loadData();
                      }}
                      className={`px-2 py-1 rounded text-xs font-semibold ${test.is_approved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}
                    >
                      {test.is_approved ? 'Approved' : 'Pending'}
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm('Delete review?')) {
                          await adminDeleteTestimonial(test.id);
                          loadData();
                        }
                      }}
                      className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-300 italic border-l-2 border-slate-700 pl-3">"{test.content}"</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ===================== GENERAL ITEM DIALOG ===================== */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`${editItem ? 'Edit' : 'Add'} ${section.toUpperCase()}`}
      >
        <div className="space-y-4">
          {section === 'skills' && (
            <>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Skill Name</label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. React 19"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Category</label>
                <select
                  value={formData.category_name || 'Frontend'}
                  onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-100"
                >
                  <option value="Programming Languages">Programming Languages</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="DevOps">DevOps</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Tools">Tools</option>
                  <option value="Concepts">Concepts</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Proficiency: {formData.proficiency || 85}%</label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={formData.proficiency || 85}
                  onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) })}
                  className="w-full accent-emerald-500"
                />
              </div>
            </>
          )}

          {section === 'projects' && (
            <>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Project Title</label>
                <Input
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="LoopSense AI Telemetry"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Category</label>
                <Input
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Full Stack / AI"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Short Description</label>
                <Textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">GitHub Link</label>
                  <Input
                    value={formData.github_link || ''}
                    onChange={(e) => setFormData({ ...formData, github_link: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Live Demo Link</label>
                  <Input
                    value={formData.live_link || ''}
                    onChange={(e) => setFormData({ ...formData, live_link: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Thumbnail Image</label>
                <div className="flex gap-2">
                  <Input
                    value={formData.thumbnail_url || ''}
                    onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                    placeholder="https://... or upload image"
                    className="flex-1"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 cursor-pointer shrink-0 transition-colors">
                    <Upload className="w-3.5 h-3.5" /> Upload File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const form = new FormData();
                        form.append('file', file);
                        form.append('category', 'projects');
                        try {
                          const res = await adminUploadMedia(form);
                          if (res.data?.data?.url) {
                            setFormData({ ...formData, thumbnail_url: res.data.data.url });
                            toast.success('Project image uploaded!');
                          }
                        } catch (err) {
                          toast.error('Failed to upload image');
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
                {formData.thumbnail_url && (
                  <div className="mt-2 w-32 h-20 rounded-lg border border-slate-700 overflow-hidden bg-slate-950">
                    <img src={getAssetUrl(formData.thumbnail_url)} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Tech Stack (comma separated)</label>
                <Input
                  value={Array.isArray(formData.tech_tags) ? formData.tech_tags.join(', ') : formData.tech_tags || ''}
                  onChange={(e) => setFormData({ ...formData, tech_tags: e.target.value.split(',').map(s => s.trim()) })}
                  placeholder="React 19, Go, Docker"
                />
              </div>
            </>
          )}

          {section === 'experience' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Company</label>
                  <Input
                    value={formData.company || ''}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Role / Position</label>
                  <Input
                    value={formData.position || ''}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Period</label>
                  <Input
                    value={formData.period || ''}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    placeholder="Jun 2024 - Present"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Location</label>
                  <Input
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Remote"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Description</label>
                <Textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <Switch
                checked={formData.is_current || false}
                onChange={(val) => setFormData({ ...formData, is_current: val })}
                label="Currently working here"
              />
            </>
          )}

          {section === 'education' && (
            <>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Institution</label>
                <Input
                  value={formData.institution || ''}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Degree</label>
                  <Input
                    value={formData.degree || ''}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Grade / CGPA</label>
                  <Input
                    value={formData.grade || ''}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Start Year</label>
                  <Input
                    value={formData.start_date || ''}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">End Year</label>
                  <Input
                    value={formData.end_date || ''}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}

          {section === 'certificates' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Certificate Title</label>
                  <Input
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="AWS Solutions Architect"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Issuer / Organization</label>
                  <Input
                    value={formData.issuer || ''}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    placeholder="Amazon Web Services"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Issue Date / Year</label>
                  <Input
                    value={formData.issue_date || ''}
                    onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                    placeholder="2024"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Credential ID (Optional)</label>
                  <Input
                    value={formData.credential_id || ''}
                    onChange={(e) => setFormData({ ...formData, credential_id: e.target.value })}
                    placeholder="CERT-8921"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Credential / Verification URL</label>
                <Input
                  value={formData.credential_url || ''}
                  onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Certificate Image / Badge</label>
                <div className="flex gap-2">
                  <Input
                    value={formData.image_url || ''}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://... or upload image"
                    className="flex-1"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 cursor-pointer shrink-0 transition-colors">
                    <Upload className="w-3.5 h-3.5" /> Upload File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const form = new FormData();
                        form.append('file', file);
                        form.append('category', 'certificates');
                        try {
                          const res = await adminUploadMedia(form);
                          if (res.data?.data?.url) {
                            setFormData({ ...formData, image_url: res.data.data.url });
                            toast.success('Certificate image uploaded!');
                          }
                        } catch (err) {
                          toast.error('Failed to upload image');
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
                {formData.image_url && (
                  <div className="mt-2 w-28 h-20 rounded-lg border border-slate-700 overflow-hidden bg-slate-950">
                    <img src={getAssetUrl(formData.image_url)} alt="Certificate Preview" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>
            </>
          )}

          {section === 'achievements' && (
            <>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Achievement Title</label>
                <Input
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="National Hackathon Winner"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Date / Year</label>
                  <Input
                    value={formData.date || ''}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="2024"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">External Link (Optional)</label>
                  <Input
                    value={formData.external_link || ''}
                    onChange={(e) => setFormData({ ...formData, external_link: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Description</label>
                <Textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Achievement Image / Trophy</label>
                <div className="flex gap-2">
                  <Input
                    value={formData.image_url || ''}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://... or upload image"
                    className="flex-1"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 cursor-pointer shrink-0 transition-colors">
                    <Upload className="w-3.5 h-3.5" /> Upload File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const form = new FormData();
                        form.append('file', file);
                        form.append('category', 'achievements');
                        try {
                          const res = await adminUploadMedia(form);
                          if (res.data?.data?.url) {
                            setFormData({ ...formData, image_url: res.data.data.url });
                            toast.success('Achievement image uploaded!');
                          }
                        } catch (err) {
                          toast.error('Failed to upload image');
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
                {formData.image_url && (
                  <div className="mt-2 w-28 h-20 rounded-lg border border-slate-700 overflow-hidden bg-slate-950">
                    <img src={getAssetUrl(formData.image_url)} alt="Achievement Preview" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>
            </>
          )}

          {section === 'blog' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Post Title</label>
                  <Input
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Category</label>
                  <Input
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Engineering / AI"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Slug (URL)</label>
                  <Input
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="my-first-post"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Status</label>
                  <select
                    value={formData.status || 'published'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 text-xs rounded-lg p-2 text-white"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Featured Cover Image</label>
                <div className="flex gap-2">
                  <Input
                    value={formData.featured_image || ''}
                    onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                    placeholder="https://... or upload image"
                    className="flex-1"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 cursor-pointer shrink-0 transition-colors">
                    <Upload className="w-3.5 h-3.5" /> Upload File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const form = new FormData();
                        form.append('file', file);
                        form.append('category', 'blog');
                        try {
                          const res = await adminUploadMedia(form);
                          if (res.data?.data?.url) {
                            setFormData({ ...formData, featured_image: res.data.data.url });
                            toast.success('Cover image uploaded!');
                          }
                        } catch (err) {
                          toast.error('Failed to upload image');
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
                {formData.featured_image && (
                  <div className="mt-2 w-32 h-20 rounded-lg border border-slate-700 overflow-hidden bg-slate-950">
                    <img src={getAssetUrl(formData.featured_image)} alt="Cover Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Excerpt</label>
                <Textarea
                  rows={2}
                  value={formData.excerpt || ''}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Content (Markdown)</label>
                <Textarea
                  rows={5}
                  value={formData.content || ''}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="# Article Heading..."
                />
              </div>
            </>
          )}

          {section === 'testimonials' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Reviewer Name</label>
                  <Input
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Company</label>
                  <Input
                    value={formData.company || ''}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Designation</label>
                <Input
                  value={formData.designation || ''}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Rating (1-5 stars)</label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating || 5}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Review Text</label>
                <Textarea
                  rows={3}
                  value={formData.content || ''}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button
              variant="default"
              onClick={async () => {
                try {
                  if (section === 'skills') {
                    if (editItem) await adminUpdateSkill(editItem.id, formData);
                    else await adminCreateSkill(formData);
                  } else if (section === 'projects') {
                    if (editItem) await adminUpdateProject(editItem.id, formData);
                    else await adminCreateProject(formData);
                  } else if (section === 'experience') {
                    if (editItem) await adminUpdateExperience(editItem.id, formData);
                    else await adminCreateExperience(formData);
                  } else if (section === 'education') {
                    if (editItem) await adminUpdateEducation(editItem.id, formData);
                    else await adminCreateEducation(formData);
                  } else if (section === 'certificates') {
                    if (editItem) await adminUpdateCertificate(editItem.id, formData);
                    else await adminCreateCertificate(formData);
                  } else if (section === 'achievements') {
                    if (editItem) await adminUpdateAchievement(editItem.id, formData);
                    else await adminCreateAchievement(formData);
                  } else if (section === 'blog') {
                    if (editItem) await adminUpdateBlog(editItem.id, formData);
                    else await adminCreateBlog(formData);
                  } else if (section === 'testimonials') {
                    if (editItem) await adminUpdateTestimonial(editItem.id, formData);
                    else await adminCreateTestimonial(formData);
                  }
                  toast.success('Saved successfully');
                  setModalOpen(false);
                  loadData();
                } catch (e) {
                  toast.error('Failed to save');
                }
              }}
            >
              Save {section}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
