import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Sparkles, User, Wrench, FolderGit2,
  Briefcase, GraduationCap, Award, Trophy, BookOpen, MessageSquareQuote,
  Inbox, Star, Bell, Image as ImageIcon, Menu, Layers, Palette, Search,
  Phone, Share2, BarChart3, Users, History, Database, Settings,
  LogOut, ExternalLink, X, ChevronRight, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { logout as apiLogout, getNotifications, markNotificationRead, globalSearch } from '@/api/adminApi';
import { Dialog } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminLayout({ children, activeTab, onSelectTab }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Keyboard shortcut CMD+K / CTRL+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch notifications
  useEffect(() => {
    getNotifications().then((res) => {
      if (res.data?.data) {
        setNotifications(res.data.data.notifications || []);
        setUnreadCount(res.data.data.unread_count || 0);
      }
    }).catch(() => {});
  }, []);

  // Search handler
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const timer = setTimeout(() => {
        globalSearch(searchQuery).then((res) => {
          if (res.data?.data) setSearchResults(res.data.data);
        }).catch(() => {});
      }, 250);
      return () => clearTimeout(timer);
    } else {
      setSearchResults(null);
    }
  }, [searchQuery]);

  const handleLogout = async () => {
    try { await apiLogout(); } catch (e) {}
    logout();
    navigate('/admin/login');
  };

  const navGroups = [
    {
      group: null,
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      group: 'CONTENT',
      items: [
        { id: 'hero', label: 'Hero', icon: Sparkles },
        { id: 'about', label: 'About', icon: User },
        { id: 'skills', label: 'Skills', icon: Wrench },
        { id: 'projects', label: 'Projects', icon: FolderGit2 },
        { id: 'experience', label: 'Experience', icon: Briefcase },
        { id: 'education', label: 'Education', icon: GraduationCap },
        { id: 'certificates', label: 'Certificates', icon: Award },
        { id: 'achievements', label: 'Achievements', icon: Trophy },
        { id: 'blog', label: 'Blog', icon: BookOpen },
        { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
      ],
    },
    {
      group: 'COMMUNICATION',
      items: [
        { id: 'inbox', label: 'Inbox', icon: Inbox, badge: unreadCount ? `${unreadCount}` : null },
        { id: 'reviews', label: 'Reviews', icon: Star },
        { id: 'notifications', label: 'Notifications', icon: Bell },
      ],
    },
    {
      group: 'MEDIA',
      items: [
        { id: 'media', label: 'Media Library', icon: ImageIcon },
      ],
    },
    {
      group: 'WEBSITE',
      items: [
        { id: 'navigation', label: 'Navigation', icon: Menu },
        { id: 'sections', label: 'Sections', icon: Layers },
        { id: 'theme', label: 'Theme', icon: Palette },
        { id: 'seo', label: 'SEO', icon: Search },
        { id: 'contact', label: 'Contact', icon: Phone },
        { id: 'socials', label: 'Social Media', icon: Share2 },
      ],
    },
    {
      group: 'ANALYTICS',
      items: [
        { id: 'analytics-overview', label: 'Overview', icon: BarChart3 },
        { id: 'analytics-visitors', label: 'Visitors', icon: Users },
        { id: 'analytics-projects', label: 'Projects', icon: FolderGit2 },
        { id: 'analytics-socials', label: 'Social Analytics', icon: Share2 },
      ],
    },
    {
      group: 'SYSTEM',
      items: [
        { id: 'users', label: 'Users & Roles', icon: Users },
        { id: 'activity-logs', label: 'Activity Logs', icon: History },
        { id: 'backup', label: 'Backup', icon: Database },
        { id: 'settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  const handleNavClick = (tabId) => {
    if (onSelectTab) {
      onSelectTab(tabId);
    } else {
      navigate(`/admin?tab=${tabId}`);
    }
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Header */}
      <header className="sticky top-0 z-40 h-16 bg-[#0a0f18]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 font-mono font-bold text-black text-sm">
              VK
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-bold text-white tracking-wide block leading-none">
                PORTFOLIO CMS
              </span>
              <span className="text-[10px] text-emerald-400 font-mono tracking-wider">
                V2.6 · HIGH-TECH DESK
              </span>
            </div>
          </div>
        </div>

        {/* Center: Global Search Trigger */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={() => setSearchModalOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:border-slate-700 text-xs transition-all shadow-inner"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span>Search projects, skills, messages, docs...</span>
            </span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700/60 font-mono">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Actions, Live Indicator, Notifications, User */}
        <div className="flex items-center gap-2.5">
          {/* Status pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>SQLite · Live</span>
          </div>

          {/* View Public Portfolio */}
          <Link
            to="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700/80 hover:border-emerald-500/50 bg-slate-900/60 hover:bg-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-all"
          >
            <span>View Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#0a0f18] animate-pulse" />
              )}
            </button>

            {/* Notification Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-800 bg-[#0f172a] p-3 text-slate-200 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs font-semibold">
                  <span className="text-white">Notifications ({unreadCount} unread)</span>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-1.5 max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-500 py-3 text-center">No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.link) handleNavClick(n.link.replace('/admin/', ''));
                          setNotificationsOpen(false);
                        }}
                        className={`p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                          n.is_read ? 'bg-slate-900/40 text-slate-400' : 'bg-emerald-500/10 text-slate-200 border border-emerald-500/20'
                        }`}
                      >
                        <div className="font-semibold text-white">{n.title}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{n.message}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User profile & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="hidden sm:block text-right">
              <div className="text-xs font-semibold text-white leading-tight">
                {user?.name || 'Vikash Kumar'}
              </div>
              <div className="text-[10px] text-emerald-400 font-mono">
                {user?.role?.toUpperCase() || 'SUPER ADMIN'}
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container: Sidebar + Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Responsive Sidebar */}
        <aside
          className={`fixed md:sticky top-16 z-30 h-[calc(100vh-4rem)] w-64 bg-[#0a0f18] border-r border-slate-800/80 flex flex-col transition-transform duration-200 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                {group.group && (
                  <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">
                    {group.group}
                  </div>
                )}
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-500/20 to-transparent text-emerald-300 font-semibold border-l-2 border-emerald-400'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                        <span>{item.label}</span>
                      </span>
                      {item.badge && (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500/20 text-rose-400 font-mono font-bold">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-500 flex items-center justify-between">
            <span>v2.6 Enterprise</span>
            <span className="text-emerald-500 font-mono">Synced</span>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-black/60 backdrop-blur-xs md:hidden"
          />
        )}

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#070b12]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Global Search Modal (CMD+K) */}
      <Dialog
        open={searchModalOpen}
        onClose={() => { setSearchModalOpen(false); setSearchQuery(''); }}
        title="Global Search"
        className="max-w-xl"
      >
        <div className="space-y-4">
          <Input
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type to search projects, skills, messages, sections..."
            className="text-base py-3"
          />

          <div className="space-y-3 max-h-72 overflow-y-auto">
            {searchResults && (
              <>
                {searchResults.projects?.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Projects</span>
                    <div className="space-y-1 mt-1">
                      {searchResults.projects.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => { handleNavClick('projects'); setSearchModalOpen(false); }}
                          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 cursor-pointer text-xs flex justify-between items-center"
                        >
                          <span className="font-semibold text-white">{p.title}</span>
                          <Badge variant="secondary">{p.category}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.skills?.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Skills</span>
                    <div className="space-y-1 mt-1">
                      {searchResults.skills.map((s) => (
                        <div
                          key={s.id}
                          onClick={() => { handleNavClick('skills'); setSearchModalOpen(false); }}
                          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 cursor-pointer text-xs flex justify-between items-center"
                        >
                          <span className="font-semibold text-white">{s.name}</span>
                          <span className="text-slate-400 text-[11px]">{s.category_name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.messages?.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Messages</span>
                    <div className="space-y-1 mt-1">
                      {searchResults.messages.map((m) => (
                        <div
                          key={m.id}
                          onClick={() => { handleNavClick('inbox'); setSearchModalOpen(false); }}
                          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 cursor-pointer text-xs flex justify-between items-center"
                        >
                          <div>
                            <span className="font-semibold text-white block">{m.name}</span>
                            <span className="text-slate-400 text-[11px]">{m.subject || m.email}</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {!searchResults && (
              <div className="text-xs text-slate-400 space-y-2 pt-2">
                <p>Quick navigation:</p>
                <div className="grid grid-cols-2 gap-2">
                  {['dashboard', 'projects', 'skills', 'hero', 'about', 'inbox', 'theme', 'seo'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => { handleNavClick(tab); setSearchModalOpen(false); }}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-left capitalize text-slate-300"
                    >
                      → {tab}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
}
