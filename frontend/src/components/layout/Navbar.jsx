import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Shield, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Navbar({ profile, navigationItems }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = navigationItems && navigationItems.length > 0
    ? navigationItems
    : [
        { label: 'Home', url: '#' },
        { label: 'About', url: '#about' },
        { label: 'Skills', url: '#skills' },
        { label: 'Projects', url: '#projects' },
        { label: 'Experience', url: '#experience' },
        { label: 'Contact', url: '#contact' },
      ];

  const primaryColor = profile?.theme_settings?.primary_color || '#DDA75B';

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-[#121214]/95 backdrop-blur-md border-b border-slate-800/80 py-3 shadow-lg'
          : 'bg-[#121214]/80 backdrop-blur-sm py-5'
      )}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Left: Brand / Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div
            style={{ backgroundColor: primaryColor }}
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-black text-sm shadow-md transition-transform group-hover:scale-105"
          >
            VK
          </div>
          <span className="text-[#F9F6F0] font-serif font-bold text-lg tracking-wider">
            {profile?.name || 'Vikash Kumar'}
          </span>
        </a>

        {/* Center: Dynamic Nav Links */}
        <div className="hidden md:flex items-center space-x-7">
          {navLinks.map((link, i) => (
            <a
              key={i}
              href={link.url || link.href}
              className="text-[#F9F6F0]/80 hover:text-white transition-colors duration-200 text-xs font-semibold tracking-wide uppercase"
            >
              {link.label || link.name}
            </a>
          ))}
        </div>

        {/* Right: Admin CMS shortcut & Mobile menu */}
        <div className="flex items-center space-x-3">
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Admin CMS</span>
          </Link>

          <button
            className="md:hidden p-2 text-[#F9F6F0]"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Sheet */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm md:hidden">
          <div className="w-64 bg-[#121214] border-l border-slate-800 h-full shadow-2xl flex flex-col p-6 animate-in slide-in-from-right">
            <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
              <span className="font-serif font-bold text-[#F9F6F0]">NAVIGATION</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col space-y-5">
              {navLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url || link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors uppercase tracking-wider"
                >
                  {link.label || link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-slate-800">
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-xs text-emerald-400 font-semibold"
                >
                  <span>Open Admin Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
