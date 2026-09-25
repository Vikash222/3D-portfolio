import React from 'react';
import {
  LayoutDashboard,
  Mail,
  FolderGit2,
  Cpu,
  Briefcase,
  User,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Terminal,
  Menu,
  X,
  Sparkles,
  MessageSquare,
  Bot,
  Share2,
  Edit3,
  CreditCard,
  Layers,
} from 'lucide-react';

export default function AdminLayout({
  currentView,
  setCurrentView,
  unreadCount = 0,
  user,
  onLogout,
  onViewLive,
  onOpenLiveEditor,
  children,
}) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'live-editor',
      label: 'Live Frontend Page Editor',
      icon: Edit3,
      badge: 'VISUAL',
      isLiveEditor: true,
    },
    {
      id: 'messages',
      label: 'Messages & Live Chat',
      icon: Mail,
      badge: unreadCount > 0 ? unreadCount : null,
    },
    { id: 'pricing', label: 'Freelance & Razorpay', icon: CreditCard },
    { id: 'builder-templates', label: 'Builder Templates', icon: Layers },
    { id: 'social-stream', label: 'Social Stream', icon: Share2 },
    { id: 'projects', label: 'Projects & Snaps', icon: FolderGit2 },
    { id: 'skills', label: 'Skills & Stack', icon: Cpu },
    { id: 'experience', label: 'Career Timeline', icon: Briefcase },
    { id: 'services', label: 'Services & Offerings', icon: Sparkles },
    { id: 'testimonials', label: 'Real Endorsements', icon: MessageSquare },
    { id: 'profile', label: 'Profile, 3D Hero & NIC Camp', icon: User },
    { id: 'ai-settings', label: 'Gemini AI Assistant', icon: Bot },
    { id: 'security', label: '2FA & Security', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#090d16] border-b border-white/10 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-blue-400" />
          <span className="font-bold text-sm tracking-tight text-white">Vikash CMS Admin</span>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white">
              {unreadCount} unread
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-30 w-64 bg-[#080c18] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } h-screen overflow-y-auto`}
      >
        <div>
          {/* Admin Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-[1.5px] shadow-sm">
                <div className="w-full h-full bg-[#080c18] rounded-[10px] flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-blue-400" />
                </div>
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-tight">Vikash CMS</h1>
                <span className="text-[11px] text-blue-400/80 font-mono">LARAVEL 11 &bull; 2FA TOTP</span>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.isLiveEditor && onOpenLiveEditor) {
                      onOpenLiveEditor();
                      setSidebarOpen(false);
                      return;
                    }
                    setCurrentView(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    item.isLiveEditor
                      ? 'bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 hover:from-blue-600/30'
                      : isActive
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${item.isLiveEditor ? 'text-cyan-400' : isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span className={item.isLiveEditor ? 'font-bold' : ''}>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.isLiveEditor
                          ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/30'
                          : 'bg-blue-600 text-white animate-pulse'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User & Live Portfolio Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={onOpenLiveEditor}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <Edit3 className="w-3.5 h-3.5 text-cyan-200" />
            <span>Open Live Visual Page Editor</span>
          </button>

          <button
            onClick={onViewLive}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            <span>View Live Luxury Portfolio</span>
          </button>

          <div className="pt-2 flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-300 font-bold text-xs">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-semibold text-white block truncate max-w-[100px]">
                  {user?.name || 'Admin'}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Online
                </span>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-[#060911] p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
