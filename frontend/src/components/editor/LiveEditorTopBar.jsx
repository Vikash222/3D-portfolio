import React from 'react';
import {
  Save,
  Eye,
  Edit3,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Layers,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';

export default function LiveEditorTopBar({
  isLiveSaving,
  hasUnsavedChanges,
  isPreviewMode,
  onTogglePreviewMode,
  onSaveLiveChanges,
  onExitToAdmin,
  activeSection,
  onSelectSection,
  isDrawerOpen,
  onToggleDrawer,
}) {
  const sections = [
    { id: 'hero', label: 'Hero & 3D Portrait' },
    { id: 'about', label: 'About & Story' },
    { id: 'skills', label: 'Skills & Tech Stack' },
    { id: 'projects', label: 'Featured Projects' },
    { id: 'education-leadership', label: 'NIC Camp & Campus Life' },
    { id: 'github', label: 'GitHub Repos' },
    { id: 'social-feed', label: 'Live Social Stream' },
    { id: 'experience', label: 'Career Timeline' },
    { id: 'services', label: 'Services' },
    { id: 'testimonials', label: 'Endorsements' },
    { id: 'contact', label: 'Contact & Socials' },
  ];

  const handleJumpToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (onSelectSection) {
      onSelectSection(sectionId);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#080d1a]/95 backdrop-blur-xl border-b border-cyan-500/30 shadow-2xl shadow-black/60 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Editor Brand & Section Quick Jump */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600/30 via-indigo-600/30 to-cyan-500/30 border border-cyan-500/40 shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            <span className="text-xs font-bold text-cyan-300 font-mono tracking-tight flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>LIVE VISUAL PAGE EDITOR</span>
            </span>
          </div>

          {/* Quick Section Jump Dropdown */}
          <div className="hidden md:flex items-center gap-1">
            <span className="text-xs text-slate-400 font-mono mr-1">Jump to:</span>
            <select
              value={activeSection || 'hero'}
              onChange={(e) => handleJumpToSection(e.target.value)}
              aria-label="Jump to section"
              className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/15 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none cursor-pointer"
            >
              {sections.map((sec) => (
                <option key={sec.id} value={sec.id} className="bg-slate-900 text-white">
                  {sec.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center: Unsaved Changes Badge */}
        <div className="hidden sm:flex items-center gap-2">
          {hasUnsavedChanges ? (
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 animate-pulse">
              <span>⚡ You have unsaved visual edits</span>
            </span>
          ) : (
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>All changes synced</span>
            </span>
          )}
        </div>

        {/* Right: Drawer toggle, Preview Mode Toggle, Save Changes, Exit */}
        <div className="flex items-center gap-2">
          {/* Side Drawer Toggle */}
          {onToggleDrawer && (
            <button
              type="button"
              onClick={onToggleDrawer}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isDrawerOpen
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-400/50 shadow-sm'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
              title={isDrawerOpen ? 'Close Side Inspector Drawer' : 'Open Side Inspector Drawer'}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">{isDrawerOpen ? 'Hide Drawer' : 'Side Drawer'}</span>
            </button>
          )}

          {/* Visitor Preview Toggle */}
          <button
            type="button"
            onClick={onTogglePreviewMode}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isPreviewMode
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
            title={isPreviewMode ? 'Switch back to Edit Mode (show edit badges)' : 'Preview as Visitor (hide edit badges)'}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isPreviewMode ? 'Viewing as Visitor' : 'Preview Visitor Mode'}</span>
          </button>

          {/* Save Live Changes Button */}
          <button
            type="button"
            disabled={isLiveSaving || !hasUnsavedChanges}
            onClick={onSaveLiveChanges}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg ${
              hasUnsavedChanges
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/25 animate-pulse'
                : 'bg-white/10 text-slate-400 cursor-not-allowed opacity-60'
            }`}
            title="Save all visual edits to the database"
          >
            {isLiveSaving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-950" />
                <span>Saving Live...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Live Changes</span>
              </>
            )}
          </button>

          {/* Exit to Admin CMS */}
          <button
            type="button"
            onClick={onExitToAdmin}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            title="Return to Admin CMS Dashboard"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Exit to Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
}
