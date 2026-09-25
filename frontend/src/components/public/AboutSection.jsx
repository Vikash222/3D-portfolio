import React from 'react';
import { Code, BookOpen, ChevronRight, Activity } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-[#F9F6F0] scroll-mt-20">
      <div className="container mx-auto px-6 md:px-12">
        
        <div className="mb-12">
          <span className="text-[#DDA75B] text-sm font-bold tracking-widest uppercase mb-2 block">
            MY BACKGROUND
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-[#2D2926] font-bold">
            About Me
          </h2>
        </div>
        
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Left Column */}
          <div className="md:w-3/5 space-y-6 text-[#2D2926]/80 text-lg leading-relaxed">
            <p>
              I am a passionate software engineer currently pursuing my <strong className="text-[#2D2926]">B.Tech Computer Science & Engineering</strong> at <strong className="text-[#2D2926]">I.K. Gujral Punjab Technical University</strong>.
            </p>
            <p>
              My focus lies in building scalable systems and integrating advanced AI models. I enjoy working on complex <strong className="text-[#2D2926]">loop architectures</strong> and robust backend systems that power seamless frontend experiences.
            </p>
            <p>
              Whether it's reverse-engineering software, contributing to open-source, or freelancing on challenging projects, I am driven by the continuous pursuit of knowledge and problem-solving.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-6">
              <a href="#" className="inline-flex items-center gap-2 border border-[#2D2926]/20 px-5 py-2 rounded-full text-sm font-medium hover:border-[#DDA75B] hover:text-[#DDA75B] transition-colors">
                <Code className="w-4 h-4" /> View Code on GitHub
              </a>
              <a href="#" className="inline-flex items-center gap-2 border border-[#2D2926]/20 px-5 py-2 rounded-full text-sm font-medium hover:border-[#DDA75B] hover:text-[#DDA75B] transition-colors">
                <BookOpen className="w-4 h-4" /> Academic Handbook
              </a>
              <a href="#" className="inline-flex items-center gap-2 border border-[#2D2926]/20 px-5 py-2 rounded-full text-sm font-medium hover:border-[#DDA75B] hover:text-[#DDA75B] transition-colors">
                What's Next <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="md:w-2/5">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="inline-block bg-[#E8C5C8]/20 text-[#2D2926] text-xs font-bold px-3 py-1 rounded-full mb-6">
                ACADEMIC STATUS
              </div>
              
              <h3 className="text-2xl font-serif font-bold text-[#2D2926] mb-2">3rd Year - CSE</h3>
              <p className="text-sm text-gray-500 mb-8">I.K. Gujral Punjab Technical University, Kapurthala</p>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-bold text-[#DDA75B] mb-1">8.5</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">GPA</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#2D2926] mb-1">13+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Projects</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#2D2926] mb-1">500+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Code Lines</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#8A9A86] mb-1 flex items-center gap-1">
                    99.6% <Activity className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Uptime</div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-[#DDA75B] h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <div className="text-right text-xs text-gray-400 mt-2">Degree Progress</div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
