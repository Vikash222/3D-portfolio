import React from 'react';
import { Download, Sparkles } from 'lucide-react';
import profileImg from '../../assets/vikash-hero.jpg';

export default function HeroSection() {
  return (
    <section className="relative bg-[#2D2926] pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden min-h-screen flex items-center">
      {/* Background Effect */}
      <div className="absolute top-1/4 -right-32 w-[600px] h-[600px] bg-[#DDA75B]/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Left Content */}
          <div className="flex-1 text-left">
            <div className="inline-block mb-6 px-3 py-1 border border-[#DDA75B]/30 rounded-full">
              <span className="text-[#DDA75B] text-xs font-semibold tracking-widest uppercase">
                CSE STUDENT &middot; 2026
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-serif text-[#F9F6F0] font-bold leading-tight mb-6">
              Hi, I'm <span className="text-[#DDA75B]">Vikash</span>
            </h1>
            
            <p className="text-lg md:text-xl text-[#F9F6F0]/70 max-w-2xl mb-10 leading-relaxed font-sans">
              Architecting scalable web and mobile applications, integrated with intelligent AI models.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* Row 1: View My Work */}
              <div className="flex flex-wrap gap-3">
                {['CSE', 'STUDY', 'AIML'].map((label) => (
                  <button key={label} className="bg-[#DDA75B] text-[#2D2926] px-6 py-2.5 rounded-md font-semibold hover:bg-[#c9954a] transition-colors flex items-center">
                    {label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex gap-4 mb-10">
              <button className="border border-[#DDA75B] text-[#DDA75B] px-6 py-2.5 rounded-md font-semibold hover:bg-[#DDA75B]/10 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" /> Download Resume
              </button>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-[#F9F6F0]/50">
              <Sparkles className="w-4 h-4 text-[#DDA75B]" />
              <span>Top Freelancer &middot; Software & Game Hacking &middot; 2 yrs</span>
            </div>
          </div>
          
          {/* Right Content (Image) */}
          <div className="flex-1 w-full max-w-md relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-2xl border-4 border-[#2D2926]">
              <div className="absolute inset-0 bg-[#DDA75B]/20 mix-blend-overlay z-10" />
              <img 
                src={profileImg} 
                alt="Vikash Kumar" 
                className="w-full h-full object-cover grayscale-[20%]"
                onError={(e) => { e.target.src = '/assets/vikash-hero.jpg'; }}
              />
            </div>
            {/* Decorative block */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#E8C5C8] rounded-bl-3xl -z-10" />
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#8A9A86] rounded-tr-3xl -z-10" />
          </div>
          
        </div>
      </div>
    </section>
  );
}
