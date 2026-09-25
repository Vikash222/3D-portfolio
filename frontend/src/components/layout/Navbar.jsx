import React, { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Navbar() {
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
    { name: 'Home', href: '#' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-[#F9F6F0]/90 backdrop-blur-md shadow-sm py-4'
          : 'bg-[#F9F6F0] py-6'
      )}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Left: Logo */}
        <a href="#" className="text-[#2D2926] font-serif font-bold text-xl uppercase tracking-wider">
          Vikash Kumar
        </a>

        {/* Center: Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[#2D2926]/80 hover:text-[#DDA75B] transition-colors duration-300 text-sm font-medium"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Right: Dark Mode Toggle & Mobile Menu */}
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-black/5 transition-colors">
            <Moon className="w-5 h-5 text-[#2D2926]" />
          </button>
          
          <button
            className="md:hidden p-2 text-[#2D2926]"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Sheet */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm">
          <div className="w-64 bg-[#F9F6F0] h-full shadow-2xl flex flex-col p-6 animate-in slide-in-from-right">
            <div className="flex justify-between items-center mb-8">
              <span className="font-serif font-bold text-[#2D2926]">MENU</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2">
                <X className="w-6 h-6 text-[#2D2926]" />
              </button>
            </div>
            <div className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg text-[#2D2926] font-medium hover:text-[#DDA75B] transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
