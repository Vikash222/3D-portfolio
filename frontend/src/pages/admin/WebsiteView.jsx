import React, { useState, useEffect } from 'react';
import {
  Menu, Layers, Palette, Search, Phone, Share2, Plus, Trash2,
  Edit2, ArrowUp, ArrowDown, Save, ExternalLink, Check, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getProfile, updateProfile,
  adminGetNavigation, adminCreateNavigation, adminUpdateNavigation, adminDeleteNavigation,
  adminGetSocials, adminCreateSocial, adminUpdateSocial, adminDeleteSocial
} from '@/api/adminApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';

export default function WebsiteView({ section = 'navigation' }) {
  const [profile, setProfile] = useState(null);
  const [navItems, setNavItems] = useState([]);
  const [socials, setSocials] = useState([]);

  // Modal for Nav / Social
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('nav');
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadData();
  }, [section]);

  const loadData = async () => {
    try {
      const pRes = await getProfile();
      if (pRes.data?.data) setProfile(pRes.data.data);

      if (section === 'navigation') {
        const res = await adminGetNavigation();
        if (res.data?.data) setNavItems(res.data.data);
      } else if (section === 'socials') {
        const res = await adminGetSocials();
        if (res.data?.data) setSocials(res.data.data);
      }
    } catch (e) {
      toast.error('Failed to load website settings');
    }
  };

  const handleSaveProfile = async (updates) => {
    try {
      const res = await updateProfile(updates);
      if (res.data?.data) {
        setProfile(res.data.data);
        toast.success('Website configuration saved!');
      }
    } catch (e) {
      toast.error('Failed to save settings');
    }
  };

  const moveSection = (index, direction) => {
    if (!profile?.sections_config) return;
    const items = [...profile.sections_config];
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const temp = items[index];
    items[index] = items[target];
    items[target] = temp;
    // update order
    items.forEach((item, i) => item.order = i + 1);
    setProfile({ ...profile, sections_config: items });
  };

  return (
    <div className="space-y-6">
      {/* ===================== NAVIGATION ===================== */}
      {section === 'navigation' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Menu className="w-5 h-5 text-emerald-400" />
                Navigation Menu Manager
              </h2>
              <p className="text-xs text-slate-400">Configure navbar links on public portfolio</p>
            </div>
            <Button
              onClick={() => {
                setModalType('nav');
                setFormData({ label: '', url: '#', icon: 'Home', is_visible: true, display_order: navItems.length + 1 });
                setModalOpen(true);
              }}
              size="sm"
              variant="default"
            >
              <Plus className="w-3.5 h-3.5" /> Add Menu Item
            </Button>
          </div>

          <div className="space-y-2">
            {navItems.map((item) => (
              <Card key={item.id} className="p-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-mono text-emerald-400 text-xs">
                    {item.display_order || 1}
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm">{item.label}</span>
                    <span className="text-xs text-slate-400 font-mono block">{item.url}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={item.is_visible}
                    onChange={async (val) => {
                      await adminUpdateNavigation(item.id, { is_visible: val });
                      loadData();
                    }}
                    label={item.is_visible ? 'Visible' : 'Hidden'}
                  />
                  <button
                    onClick={async () => {
                      if (confirm(`Delete menu item ${item.label}?`)) {
                        await adminDeleteNavigation(item.id);
                        loadData();
                      }
                    }}
                    className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ===================== SECTIONS ORDER & TOGGLE ===================== */}
      {section === 'sections' && profile && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                Public Website Sections Control
              </h2>
              <p className="text-xs text-slate-400">Reorder sections and toggle visibility without changing frontend code</p>
            </div>
            <Button
              onClick={() => handleSaveProfile({ sections_config: profile.sections_config })}
              size="sm"
              variant="default"
            >
              <Save className="w-3.5 h-3.5" /> Save Section Order
            </Button>
          </div>

          <div className="space-y-2">
            {profile.sections_config?.map((sec, idx) => (
              <Card key={sec.id} className="p-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center text-xs font-mono font-bold text-slate-500">#{idx + 1}</span>
                  <div>
                    <span className="font-bold text-white text-sm">{sec.name}</span>
                    <span className="text-[11px] text-slate-500 font-mono block">id: #{sec.id}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={idx === 0}
                    onClick={() => moveSection(idx, -1)}
                    className="p-1 rounded bg-slate-800 text-slate-300 disabled:opacity-30 hover:bg-slate-700"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={idx === profile.sections_config.length - 1}
                    onClick={() => moveSection(idx, 1)}
                    className="p-1 rounded bg-slate-800 text-slate-300 disabled:opacity-30 hover:bg-slate-700"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <Switch
                    checked={sec.enabled}
                    onChange={(val) => {
                      const updated = [...profile.sections_config];
                      updated[idx].enabled = val;
                      setProfile({ ...profile, sections_config: updated });
                    }}
                    label={sec.enabled ? 'Enabled' : 'Disabled'}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ===================== THEME & APPEARANCE ===================== */}
      {section === 'theme' && profile && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-emerald-400" />
                Theme & Appearance Customizer
              </h2>
              <p className="text-xs text-slate-400">Tweak theme accents, color schemes, and visual styles</p>
            </div>
            <Button
              onClick={() => handleSaveProfile({ theme_settings: profile.theme_settings })}
              size="sm"
              variant="default"
            >
              <Save className="w-3.5 h-3.5" /> Apply Theme
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="space-y-4">
              <CardHeader>
                <CardTitle>Color Palette Tokens</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Primary Color Preset</label>
                  <div className="flex items-center gap-3">
                    {['#DDA75B', '#10B981', '#6366F1', '#F43F5E', '#06B6D4', '#F59E0B'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setProfile({
                          ...profile,
                          theme_settings: { ...profile.theme_settings, primary_color: color }
                        })}
                        style={{ backgroundColor: color }}
                        className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                          profile.theme_settings?.primary_color === color ? 'border-white scale-110 shadow-lg' : 'border-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Custom Primary Hex Code</label>
                  <Input
                    value={profile.theme_settings?.primary_color || '#DDA75B'}
                    onChange={(e) => setProfile({
                      ...profile,
                      theme_settings: { ...profile.theme_settings, primary_color: e.target.value }
                    })}
                    className="font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Accent Complement Hex</label>
                  <Input
                    value={profile.theme_settings?.accent_color || '#8A9A86'}
                    onChange={(e) => setProfile({
                      ...profile,
                      theme_settings: { ...profile.theme_settings, accent_color: e.target.value }
                    })}
                    className="font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Corner Radius</label>
                  <select
                    value={profile.theme_settings?.border_radius || '12px'}
                    onChange={(e) => setProfile({
                      ...profile,
                      theme_settings: { ...profile.theme_settings, border_radius: e.target.value }
                    })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-100"
                  >
                    <option value="6px">Subtle (6px)</option>
                    <option value="12px">Modern (12px)</option>
                    <option value="20px">Curved (20px)</option>
                    <option value="999px">Pill (Fully Rounded)</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Live Preview Card */}
            <Card className="flex flex-col justify-between">
              <div>
                <CardHeader>
                  <CardTitle>Real-Time Theme Preview</CardTitle>
                  <CardDescription>Simulated hero preview with your active accent colors</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    style={{
                      borderRadius: profile.theme_settings?.border_radius || '12px',
                      borderColor: profile.theme_settings?.primary_color || '#DDA75B'
                    }}
                    className="p-6 bg-slate-950 border-2 space-y-3"
                  >
                    <span
                      style={{ color: profile.theme_settings?.primary_color || '#DDA75B' }}
                      className="text-xs font-mono font-bold tracking-wider uppercase block"
                    >
                      B.TECH CSE &middot; PREVIEW
                    </span>
                    <h3 className="text-2xl font-bold text-white">
                      Hi, I'm <span style={{ color: profile.theme_settings?.primary_color || '#DDA75B' }}>Vikash</span>
                    </h3>
                    <p className="text-xs text-slate-300">
                      Architecting scalable applications with intelligent models.
                    </p>
                    <div className="flex gap-2 pt-2">
                      <button
                        style={{
                          backgroundColor: profile.theme_settings?.primary_color || '#DDA75B',
                          borderRadius: profile.theme_settings?.border_radius || '12px'
                        }}
                        className="px-4 py-1.5 text-xs font-bold text-black shadow-md"
                      >
                        Action Button
                      </button>
                      <button
                        style={{
                          borderColor: profile.theme_settings?.accent_color || '#8A9A86',
                          color: profile.theme_settings?.accent_color || '#8A9A86',
                          borderRadius: profile.theme_settings?.border_radius || '12px'
                        }}
                        className="px-4 py-1.5 text-xs font-bold border"
                      >
                        Secondary
                      </button>
                    </div>
                  </div>
                </CardContent>
              </div>

              <div className="p-4 m-5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400">
                Click "Apply Theme" above to save changes to the public portfolio database.
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ===================== SEO MANAGEMENT ===================== */}
      {section === 'seo' && profile && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-emerald-400" />
                SEO, OpenGraph & Metadata Management
              </h2>
              <p className="text-xs text-slate-400">Search engine indexing tags and social link share previews</p>
            </div>
            <Button
              onClick={() => handleSaveProfile({ seo_settings: profile.seo_settings })}
              size="sm"
              variant="default"
            >
              <Save className="w-3.5 h-3.5" /> Save SEO Settings
            </Button>
          </div>

          <Card className="space-y-4">
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Meta Browser Title Tag</label>
                <Input
                  value={profile.seo_settings?.meta_title || ''}
                  onChange={(e) => setProfile({
                    ...profile,
                    seo_settings: { ...profile.seo_settings, meta_title: e.target.value }
                  })}
                  placeholder="Vikash Kumar | Full-Stack & AI Systems Portfolio"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Meta Description</label>
                <Textarea
                  rows={2}
                  value={profile.seo_settings?.meta_description || ''}
                  onChange={(e) => setProfile({
                    ...profile,
                    seo_settings: { ...profile.seo_settings, meta_description: e.target.value }
                  })}
                  placeholder="Official portfolio of Vikash Kumar..."
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Meta Keywords (comma-separated)</label>
                <Input
                  value={profile.seo_settings?.keywords || ''}
                  onChange={(e) => setProfile({
                    ...profile,
                    seo_settings: { ...profile.seo_settings, keywords: e.target.value }
                  })}
                  placeholder="Vikash Kumar, Full Stack, React, Laravel, AI"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">OpenGraph OG:Title</label>
                  <Input
                    value={profile.seo_settings?.og_title || ''}
                    onChange={(e) => setProfile({
                      ...profile,
                      seo_settings: { ...profile.seo_settings, og_title: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Canonical URL</label>
                  <Input
                    value={profile.seo_settings?.canonical_url || ''}
                    onChange={(e) => setProfile({
                      ...profile,
                      seo_settings: { ...profile.seo_settings, canonical_url: e.target.value }
                    })}
                    placeholder="https://mrvikash.in"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ===================== CONTACT SETTINGS ===================== */}
      {section === 'contact' && profile && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Phone className="w-5 h-5 text-emerald-400" />
                Contact Info & Availability Settings
              </h2>
              <p className="text-xs text-slate-400">Direct contact channels and availability message on public footer</p>
            </div>
            <Button
              onClick={() => handleSaveProfile({ contact_info: profile.contact_info })}
              size="sm"
              variant="default"
            >
              <Save className="w-3.5 h-3.5" /> Save Contact Info
            </Button>
          </div>

          <Card className="space-y-4">
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Contact Email</label>
                  <Input
                    value={profile.contact_info?.email || ''}
                    onChange={(e) => setProfile({
                      ...profile,
                      contact_info: { ...profile.contact_info, email: e.target.value }
                    })}
                    placeholder="connect@mrvikash.in"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Phone Number</label>
                  <Input
                    value={profile.contact_info?.phone || ''}
                    onChange={(e) => setProfile({
                      ...profile,
                      contact_info: { ...profile.contact_info, phone: e.target.value }
                    })}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Physical Location</label>
                  <Input
                    value={profile.contact_info?.location || ''}
                    onChange={(e) => setProfile({
                      ...profile,
                      contact_info: { ...profile.contact_info, location: e.target.value }
                    })}
                    placeholder="Punjab, India"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Average Response Time</label>
                  <Input
                    value={profile.contact_info?.response_time || ''}
                    onChange={(e) => setProfile({
                      ...profile,
                      contact_info: { ...profile.contact_info, response_time: e.target.value }
                    })}
                    placeholder="2-4 hrs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Availability Subtitle</label>
                <Input
                  value={profile.contact_info?.available_for || ''}
                  onChange={(e) => setProfile({
                    ...profile,
                    contact_info: { ...profile.contact_info, available_for: e.target.value }
                  })}
                  placeholder="Internships, Freelance, Collaborations"
                />
              </div>

              <Switch
                checked={profile.contact_info?.enable_form !== false}
                onChange={(val) => setProfile({
                  ...profile,
                  contact_info: { ...profile.contact_info, enable_form: val }
                })}
                label="Allow visitors to submit messages through contact form"
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* ===================== SOCIAL MEDIA ===================== */}
      {section === 'socials' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-emerald-400" />
                Social Media Platforms & Click Analytics
              </h2>
              <p className="text-xs text-slate-400">Total platforms: {socials.length} · Live click tracking enabled</p>
            </div>
            <Button
              onClick={() => {
                setModalType('social');
                setFormData({ platform: '', username: '', url: 'https://', icon: 'Globe', is_visible: true, display_order: socials.length + 1 });
                setModalOpen(true);
              }}
              size="sm"
              variant="default"
            >
              <Plus className="w-3.5 h-3.5" /> Add Platform
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {socials.map((s) => (
              <Card key={s.id} className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{s.platform}</span>
                    <Badge variant="secondary">{s.clicks_count || 0} Clicks</Badge>
                  </div>
                  <span className="text-xs text-slate-400 font-mono block truncate max-w-xs">{s.url}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={s.is_visible}
                    onChange={async (val) => {
                      await adminUpdateSocial(s.id, { is_visible: val });
                      loadData();
                    }}
                  />
                  <button
                    onClick={async () => {
                      if (confirm(`Delete ${s.platform}?`)) {
                        await adminDeleteSocial(s.id);
                        loadData();
                      }
                    }}
                    className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Item Modal (Nav / Social) */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalType === 'nav' ? 'Add Navigation Item' : 'Add Social Platform'}
      >
        <div className="space-y-4">
          {modalType === 'nav' ? (
            <>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Menu Label</label>
                <Input
                  value={formData.label || ''}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="e.g. Testimonials"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Target Anchor / URL</label>
                <Input
                  value={formData.url || ''}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="#testimonials"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Platform Name</label>
                <Input
                  value={formData.platform || ''}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  placeholder="e.g. YouTube"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Profile Link URL</label>
                <Input
                  value={formData.url || ''}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Username / Handle</label>
                <Input
                  value={formData.username || ''}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="@username"
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button
              variant="default"
              onClick={async () => {
                try {
                  if (modalType === 'nav') await adminCreateNavigation(formData);
                  else await adminCreateSocial(formData);
                  toast.success('Added successfully');
                  setModalOpen(false);
                  loadData();
                } catch (e) {
                  toast.error('Failed to create');
                }
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
