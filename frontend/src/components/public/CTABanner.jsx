import React from 'react';

export default function CTABanner() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="bg-[#2D2926] rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#DDA75B]/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="md:w-3/5 relative z-10">
            <span className="text-[#8A9A86] text-sm font-bold tracking-widest uppercase mb-4 block">
              OPEN RESEARCH PIPELINE
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-[#F9F6F0] font-bold mb-4 leading-tight">
              Interested in collaborative systems research?
            </h2>
            <p className="text-[#F9F6F0]/70 text-lg">
              I am actively looking for opportunities to collaborate on open-source projects, academic research, and complex engineering challenges.
            </p>
          </div>
          
          <div className="md:w-2/5 flex flex-col sm:flex-row gap-4 relative z-10 w-full md:justify-end">
            <button className="bg-[#DDA75B] text-[#2D2926] px-8 py-4 rounded-xl font-bold hover:bg-[#c9954a] transition-all transform hover:scale-105 shadow-lg whitespace-nowrap">
              Submit a Proposal
            </button>
            <button className="border-2 border-[#F9F6F0]/20 text-[#F9F6F0] px-8 py-4 rounded-xl font-bold hover:bg-[#F9F6F0]/10 transition-colors whitespace-nowrap">
              View Open Topics
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
