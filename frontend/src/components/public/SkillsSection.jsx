import React, { useEffect, useState } from 'react';
import { getSkills } from '../../api/skillApi'; // Assuming this exists, with a fallback
import { cn } from '../../lib/utils';

const fallbackSkills = [
  { category: 'CORE LANGUAGES', items: ['Java', 'Python', 'JavaScript (ES6+)', 'TypeScript'] },
  { category: 'WEB & BACKEND TECHNOLOGIES', items: ['React', 'Tailwind CSS', 'shadcn/ui', 'Laravel 11', 'Headless REST API', 'MySQL 8.0', 'Middleware', 'Redux', 'Express'] },
  { category: 'TOOLS & ECOSYSTEM', items: ['Git', 'GitHub', 'VS Code', 'Figma', 'AI Tools & Copilots', 'Docker', 'Linux', 'Vite'] },
  { category: 'FRAMEWORKS & CONCEPTS', items: ['Data Structures & Algorithms (DSA)', 'Object-Oriented Programming (OOP)', 'Loop Engineering', 'REST Architecture', 'AIML', 'Model Integration'] },
];

export default function SkillsSection() {
  const [skills, setSkills] = useState(fallbackSkills);

  useEffect(() => {
    // Attempt to fetch from API
    const fetchSkills = async () => {
      try {
        if (typeof getSkills === 'function') {
          const data = await getSkills();
          if (data && data.length > 0) {
            // Group by category if API returns flat list, or use as is
            // Assuming data is formatted correctly or we just keep fallback for safety
          }
        }
      } catch (error) {
        console.error('Failed to fetch skills', error);
      }
    };
    fetchSkills();
  }, []);

  return (
    <section id="skills" className="py-24 bg-white scroll-mt-20">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-16">
          <span className="text-[#DDA75B] text-sm font-bold tracking-widest uppercase mb-2 block">
            MY TOOLKIT
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-[#2D2926] font-bold mb-4">
            What I Work With
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl">
            A comprehensive overview of my technical arsenal, ranging from core programming languages to modern architectural paradigms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills.map((group, idx) => (
            <div key={idx} className="border border-gray-100 rounded-2xl p-8 hover:shadow-md transition-shadow bg-[#F9F6F0]/30">
              <h3 className="text-[#2D2926] font-bold text-lg mb-6 tracking-wide">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-3">
                {group.items.map((item, i) => (
                  <span 
                    key={i} 
                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-[#2D2926] text-sm font-medium rounded-full hover:border-[#DDA75B] hover:text-[#DDA75B] transition-colors cursor-default"
                  >
                    <span className={cn("w-2 h-2 rounded-full mr-2", 
                      idx === 0 ? "bg-[#DDA75B]" : 
                      idx === 1 ? "bg-[#8A9A86]" : 
                      idx === 2 ? "bg-[#E8C5C8]" : "bg-[#2D2926]"
                    )} />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
