import React, { useState, useEffect } from 'react';
import {
  CreditCard,
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
} from 'lucide-react';
import {
  getAdminPricingPackages,
  createPricingPackage,
  updatePricingPackage,
  deletePricingPackage,
  getAdminProfile,
  updateAdminProfile,
} from '../../services/api';

export default function FreelancePricingAdminView() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Razorpay Payment Link State
  const [razorpayPaymentLink, setRazorpayPaymentLink] = useState('https://razorpay.me/@vikashkumar2049');
  const [freelanceStatus, setFreelanceStatus] = useState('Available for High-Impact Projects');
  const [isSavingRazorpay, setIsSavingRazorpay] = useState(false);

  // Package Modal State (Create / Edit)
  const [editingPackage, setEditingPackage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [packageForm, setPackageForm] = useState({
    title: '',
    price_inr: '',
    tagline: '',
    delivery_days: 7,
    features: ['Modern Responsive UI', 'Clean Code Handover'],
    is_popular: false,
    is_active: true,
  });
  const [featureInput, setFeatureInput] = useState('');
  const [isSavingPackage, setIsSavingPackage] = useState(false);

  // Load Data
  const loadData = async () => {
    try {
      setLoading(true);
      const [pkgRes, profileRes] = await Promise.all([
        getAdminPricingPackages().catch(() => ({ packages: [] })),
        getAdminProfile().catch(() => ({ profile: {} })),
      ]);

      setPackages(pkgRes.packages || []);

      if (profileRes.profile) {
        setRazorpayPaymentLink(profileRes.profile.razorpay_payment_link || 'https://razorpay.me/@vikashkumar2049');
        setFreelanceStatus(profileRes.profile.freelance_status || 'Available for High-Impact Projects');
      }
    } catch (err) {
      setError('Failed to load freelance pricing settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save Razorpay Payment Link & Status
  const handleSaveRazorpay = async (e) => {
    e.preventDefault();
    setIsSavingRazorpay(true);
    setSuccessMsg('');
    setError('');

    try {
      await updateAdminProfile({
        razorpay_payment_link: razorpayPaymentLink,
        freelance_status: freelanceStatus,
        name: 'Vikash Kumar',
        title: 'Lead Full-Stack Engineer',
        email: 'heyvikash@icloud.com',
      });

      setSuccessMsg('Razorpay payment link & freelance status saved successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
      setError('Failed to save settings.');
    } finally {
      setIsSavingRazorpay(false);
    }
  };

  // Open Modal for Create / Edit
  const handleOpenModal = (pkg = null) => {
    if (pkg) {
      setEditingPackage(pkg);
      setPackageForm({
        title: pkg.title,
        price_inr: pkg.price_inr,
        tagline: pkg.tagline,
        delivery_days: pkg.delivery_days,
        features: Array.isArray(pkg.features) ? pkg.features : [],
        is_popular: Boolean(pkg.is_popular),
        is_active: Boolean(pkg.is_active),
      });
    } else {
      setEditingPackage(null);
      setPackageForm({
        title: '',
        price_inr: '',
        tagline: '',
        delivery_days: 5,
        features: ['React + Tailwind Modern UI', 'Production Deployment Handover'],
        is_popular: false,
        is_active: true,
      });
    }
    setFeatureInput('');
    setIsModalOpen(true);
  };

  // Add Feature to form
  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    if (!packageForm.features.includes(featureInput.trim())) {
      setPackageForm({
        ...packageForm,
        features: [...packageForm.features, featureInput.trim()],
      });
    }
    setFeatureInput('');
  };

  const handleRemoveFeature = (idx) => {
    setPackageForm({
      ...packageForm,
      features: packageForm.features.filter((_, i) => i !== idx),
    });
  };

  // Save Package (Create or Update)
  const handleSavePackage = async (e) => {
    e.preventDefault();
    if (!packageForm.title.trim() || !packageForm.price_inr) {
      alert('Please provide title and price.');
      return;
    }

    setIsSavingPackage(true);
    setError('');

    try {
      if (editingPackage) {
        const res = await updatePricingPackage(editingPackage.id, packageForm);
        setPackages((prev) =>
          prev.map((p) => (p.id === editingPackage.id ? res.package : p))
        );
      } else {
        const res = await createPricingPackage(packageForm);
        setPackages((prev) => [...prev, res.package]);
      }

      setIsModalOpen(false);
      setSuccessMsg('Pricing package saved successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
      setError('Failed to save pricing package.');
    } finally {
      setIsSavingPackage(false);
    }
  };

  // Delete Package
  const handleDeletePackage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pricing package?')) return;

    try {
      await deletePricingPackage(id);
      setPackages((prev) => prev.filter((p) => p.id !== id));
      setSuccessMsg('Package removed.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert('Failed to delete package.');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Freelance Hub &amp; Pricing Packages</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500 text-black">
              Razorpay Gateway
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Configure live Razorpay payment processing and manage tiered freelance pricing packages shown to clients.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal(null)}
          className="self-start sm:self-center inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold shadow-lg shadow-cyan-500/20 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Pricing Package</span>
        </button>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
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

      {/* Razorpay Direct Payment Link Card */}
      <div className="admin-card rounded-2xl border border-white/10 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Razorpay Direct Payment Link</h3>
              <p className="text-xs text-slate-400">
                Direct link payments via your verified Razorpay.me page. No API keys or webhooks needed.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-cyan-400 font-semibold px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 w-fit">
            Active
          </span>
        </div>

        <form onSubmit={handleSaveRazorpay} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-mono uppercase text-slate-300">
              Razorpay Payment Link (Personal / Business Handle)
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={razorpayPaymentLink}
                onChange={(e) => setRazorpayPaymentLink(e.target.value)}
                placeholder="https://razorpay.me/@vikashkumar2049"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={() => window.open(razorpayPaymentLink, '_blank')}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-cyan-400 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all whitespace-nowrap"
              >
                <span>Open Link ↗</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Clients booking freelance packages will directly open this verified Razorpay page (<code className="text-cyan-300">razorpay.me/@vikashkumar2049</code>).
            </p>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
              Public Freelance Availability Badge
            </label>
            <input
              type="text"
              value={freelanceStatus}
              onChange={(e) => setFreelanceStatus(e.target.value)}
              placeholder="e.g. Available for Freelance & High-Impact Roles"
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingRazorpay}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-md shadow-cyan-500/20"
            >
              <Save className="w-4 h-4" />
              <span>{isSavingRazorpay ? 'Saving...' : 'Save Configuration'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Pricing Packages List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-cyan-400" />
            <span>Active Freelance Packages ({packages.length})</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">Displayed in Client Portal &amp; Services</span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
            <span>Loading packages...</span>
          </div>
        ) : packages.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm admin-card rounded-2xl border border-white/10">
            No pricing packages found. Click "Add Pricing Package" above to create one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="admin-card rounded-2xl border border-white/10 p-6 flex flex-col justify-between space-y-4 relative"
              >
                {pkg.is_popular && (
                  <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-cyan-500 text-black text-[10px] font-black uppercase tracking-wider">
                    Featured
                  </span>
                )}

                <div>
                  <h4 className="text-lg font-bold text-white">{pkg.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{pkg.tagline}</p>
                  <div className="my-3 text-2xl font-black text-emerald-400 font-mono">
                    ₹{Number(pkg.price_inr).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mb-3">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{pkg.delivery_days} days delivery</span>
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-300 border-t border-white/5 pt-3">
                    {(pkg.features || []).map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
                  <button
                    onClick={() => handleOpenModal(pkg)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                    title="Edit Package"
                  >
                    <Edit2 className="w-4 h-4 text-cyan-400" />
                  </button>
                  <button
                    onClick={() => handleDeletePackage(pkg.id)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                    title="Delete Package"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Package Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="admin-card border border-white/20 rounded-2xl max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative text-slate-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-4">
              {editingPackage ? 'Edit Pricing Package' : 'Create New Pricing Package'}
            </h3>

            <form onSubmit={handleSavePackage} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">Package Title *</label>
                <input
                  type="text"
                  required
                  value={packageForm.title}
                  onChange={(e) => setPackageForm({ ...packageForm, title: e.target.value })}
                  placeholder="e.g. Full-Stack Web App"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1">Price in INR (₹) *</label>
                  <input
                    type="number"
                    required
                    value={packageForm.price_inr}
                    onChange={(e) => setPackageForm({ ...packageForm, price_inr: e.target.value })}
                    placeholder="14999"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1">Delivery (Days) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={packageForm.delivery_days}
                    onChange={(e) => setPackageForm({ ...packageForm, delivery_days: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">Tagline / Short Summary *</label>
                <input
                  type="text"
                  required
                  value={packageForm.tagline}
                  onChange={(e) => setPackageForm({ ...packageForm, tagline: e.target.value })}
                  placeholder="End-to-end database, REST API backend, admin CMS panel..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">Package Features</label>
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
                    placeholder="e.g. Next.js SSR, MySQL Database, Post-Delivery Support"
                    className="flex-1 px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {packageForm.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-mono"
                    >
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="hover:text-red-400 font-bold ml-1 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={packageForm.is_popular}
                    onChange={(e) => setPackageForm({ ...packageForm, is_popular: e.target.checked })}
                    className="rounded text-cyan-500 focus:ring-cyan-400"
                  />
                  <span>Mark as Most Popular / Featured Tier</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={packageForm.is_active}
                    onChange={(e) => setPackageForm({ ...packageForm, is_active: e.target.checked })}
                    className="rounded text-cyan-500 focus:ring-cyan-400"
                  />
                  <span>Active (Visible on Site)</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingPackage}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  {isSavingPackage ? 'Saving...' : 'Save Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
