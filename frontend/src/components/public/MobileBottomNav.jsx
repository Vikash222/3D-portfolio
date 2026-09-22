import React, { useState, useEffect } from 'react';
import {
  Home,
  Briefcase,
  Layers,
  PhoneCall,
  Bot,
  Sparkles,
} from 'lucide-react';

export default function MobileBottomNav({ onOpenChat, onOpenQuickContact }) {
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      const projectsEl = document.getElementById('projects');
      const skillsEl = document.getElementById('skills');
      const contactEl = document.getElementById('contact');

      if (contactEl && scrollPos >= contactEl.offsetTop) {
        setActiveTab('contact');
      } else if (skillsEl && scrollPos >= skillsEl.offsetTop) {
        setActiveTab('skills');
      } else if (projectsEl && scrollPos >= projectsEl.offsetTop) {
        setActiveTab('projects');
      } else {
        setActiveTab('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id, tabName) => {
    setActiveTab(tabName);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="md:hidden fixed bottom-3 inset-x-3 z-40 pointer-events-none">
      <nav className="pointer-events-auto max-w-md mx-auto bg-[#0e0408]/92 backdrop-blur-2xl border border-white/10 rounded-[26px] p-1.5 shadow-2xl shadow-red-950/50 flex items-center justify-between">
        {/* Tab 1: Home */}
        <button
          onClick={() => scrollToSection('hero', 'home')}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'home'
              ? 'text-red-400 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Home className={`w-5 h-5 transition-transform ${activeTab === 'home' ? 'scale-110' : ''}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
        </button>

        {/* Tab 2: Projects */}
        <button
          onClick={() => scrollToSection('projects', 'projects')}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'projects'
              ? 'text-red-400 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Briefcase className={`w-5 h-5 transition-transform ${activeTab === 'projects' ? 'scale-110' : ''}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Projects</span>
        </button>

        {/* Tab 3: ELEVATED AI TWIN BUTTON (Center Hero) */}
        <div className="flex-1 flex items-center justify-center -mt-6">
          <button
            onClick={onOpenChat}
            className="group relative w-14 h-14 rounded-full bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 text-white shadow-lg shadow-red-500/40 active:scale-90 transition-transform flex items-center justify-center cursor-pointer border-[3px] border-[#0e0408]"
            title="Chat with Vikash's AI Twin"
          >
            <Bot className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 border-2 border-[#0e0408]" />
            </span>
          </button>
        </div>

        {/* Tab 4: Skills */}
        <button
          onClick={() => scrollToSection('skills', 'skills')}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'skills'
              ? 'text-red-400 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className={`w-5 h-5 transition-transform ${activeTab === 'skills' ? 'scale-110' : ''}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Skills</span>
        </button>

        {/* Tab 5: Contact Sheet */}
        <button
          onClick={onOpenQuickContact}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'contact'
              ? 'text-red-400 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <PhoneCall className={`w-5 h-5 transition-transform ${activeTab === 'contact' ? 'scale-110' : ''}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Contact</span>
        </button>
      </nav>
    </div>
  );
}
