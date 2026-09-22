import React, { useState, useEffect } from 'react';
import { Shield, Menu, X, Terminal, ArrowUpRight, Sparkles, UserCheck, User } from 'lucide-react';

export default function Navbar({
  user,
  onNavigateAdmin,
  profile,
  isEditMode = false,
  onOpenAuth,
  clientUser,
  onOpenClientPortal,
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Services', href: '#services' },
    { label: 'Education', href: '#education-leadership' },
    { label: 'GitHub', href: '#github' },
    { label: 'Activity', href: '#social-feed' },
    { label: 'Reviews', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed ${isEditMode ? 'top-12 sm:top-14' : 'top-0'} left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#080305]/98 backdrop-blur-2xl border-b border-red-500/25 shadow-2xl shadow-black/80 py-3.5 sm:py-4'
          : 'bg-[#080305]/92 backdrop-blur-2xl border-b border-white/10 shadow-xl shadow-black/50 py-4 sm:py-5'
      }`}
    >
      {/* Top subtle red accent line for polished thick header depth */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Brand */}
        <a href="#" className="flex items-center gap-3 group shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 p-[2px] shadow-md shadow-red-500/30 group-hover:shadow-red-500/60 transition-all duration-300 shrink-0">
            <div className="w-full h-full bg-[#12070b] rounded-[14px] overflow-hidden flex items-center justify-center">
              <img
                src={profile?.avatar_url || profile?.hero_image_url || '/assets/vikash-hero.jpg'}
                alt={profile?.name || 'Vikash Kumar'}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.parentElement?.querySelector('.vk-fallback');
                  if (fallback) fallback.style.display = 'inline';
                }}
              />
              <span className="vk-fallback font-black text-red-400 text-sm hidden">VK</span>
            </div>
          </div>
          <div>
            <span className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5 group-hover:text-red-400 transition-colors">
              {profile?.name || 'Vikash Kumar'}
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
            </span>
            <span className="text-[10px] text-red-400 font-mono tracking-wider block font-bold">
              B.TECH CSE &bull; IKGPTU MAIN CAMPUS
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 bg-[#12070b]/90 border border-white/10 px-3 py-1.5 rounded-full shadow-lg backdrop-blur-xl shrink-0">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-semibold text-slate-300 hover:text-white px-2.5 xl:px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          {/* If Logged in as Client */}
          {clientUser ? (
            <button
              type="button"
              onClick={onOpenClientPortal}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/40 shadow-sm transition-all cursor-pointer hover:-translate-y-0.5"
              title={`Logged in as ${clientUser.name} - Open Client Portal`}
            >
              <UserCheck className="w-3.5 h-3.5 text-red-400" />
              <span className="max-w-[120px] truncate">{clientUser.name}</span>
            </button>
          ) : user ? (
            /* If Logged in as Admin */
            <button
              type="button"
              onClick={onNavigateAdmin}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-400/40 shadow-sm transition-all cursor-pointer hover:-translate-y-0.5"
              title="Admin CMS & 2FA Panel"
            >
              <Shield className="w-3.5 h-3.5 text-rose-400" />
              <span>Admin Panel</span>
            </button>
          ) : (
            /* Single Unified Sign In / Register Button */
            <button
              type="button"
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/15 hover:border-red-400/40 transition-all cursor-pointer hover:-translate-y-0.5"
              title="Sign In or Register (Client & Admin)"
            >
              <User className="w-3.5 h-3.5 text-red-400" />
              <span>Sign In / Register</span>
            </button>
          )}

          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-500 text-white border border-red-400/40 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 backdrop-blur-xl transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
            <span>Let's Talk</span>
          </a>
        </div>

        {/* Mobile menu buttons */}
        <div className="flex md:hidden items-center gap-2">
          {clientUser ? (
            <button
              type="button"
              onClick={onOpenClientPortal}
              className="p-2 rounded-xl border border-red-500/40 bg-red-500/10 text-red-300"
              title="Client Portal"
            >
              <UserCheck className="w-4 h-4" />
            </button>
          ) : user ? (
            <button
              type="button"
              onClick={onNavigateAdmin}
              className="p-2 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300"
              title="Admin Panel"
            >
              <Shield className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="p-2 rounded-xl border border-white/10 bg-[#12070b] text-slate-300"
              title="Sign In / Register"
            >
              <User className="w-4 h-4 text-red-400" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl border border-white/10 bg-[#12070b] text-slate-300 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#080305]/98 backdrop-blur-2xl px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-semibold text-slate-300 hover:text-red-400 p-2 rounded-lg hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            {clientUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenClientPortal?.();
                }}
                className="w-full text-center text-xs font-bold px-4 py-2.5 rounded-xl bg-red-500/20 text-red-300 border border-red-500/40 flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>Open Client Portal ({clientUser.name})</span>
              </button>
            ) : user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateAdmin?.();
                }}
                className="w-full text-center text-xs font-bold px-4 py-2.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-400/40 flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" />
                <span>Admin CMS Panel ({user.name})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth?.();
                }}
                className="w-full text-center text-xs font-bold px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4 text-red-400" />
                <span>Sign In / Register (Client &amp; Admin)</span>
              </button>
            )}
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center text-xs font-bold px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 text-white border border-red-400/40 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
              <span>Let's Talk</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
