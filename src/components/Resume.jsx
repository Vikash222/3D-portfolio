import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Shield, Cpu, Globe, Heart, Award } from 'lucide-react';

const Resume = () => {
  const [activeTab, setActiveTab] = useState('biography');

  const data = {
    biography: [
      { 
        title: "About Me", 
        school: "Vikash Kumar", 
        year: "Born: 2007", 
        desc: "I am from Bihar, India, and currently pursuing my B.Tech in Computer Science at I.K. Gujral Punjab Technical University (IKGPTU). At present, I live in Jalandhar for my studies." 
      },
      { 
        title: "Passions & Interests", 
        school: "Beyond Coding", 
        year: "Lifestyle", 
        desc: "Active in NSS volunteering and flood relief donations. In my free time, I explore tech trends, play cricket and badminton, and solve complex puzzles." 
      }
    ],
    skills: [
      { 
        title: "Skills", 
        school: "React, Tailwind, C++, Python,JavaScript (Basic),React.js,Firebase", 
        year: "Tech", 
        desc: "Python-focused developer interested in problem-solving and application development, while building responsive web interfaces with React, Tailwind, JavaScript, and Firebase." 
      },
      { 
        title: "Tools", 
        school: "Git, VS Code,GitHub", 
        year: "Expertise", 
        desc: " Proficient in Git for version control and open-source contributions." 
      },
      {
        title: "Languages",
        school: "English & Hindi",
        year: "Fluent",
        desc: "Hindi (Native) | English (Professional)"
      }
    ],
    education: [
      { 
        title: "B.Tech CSE", 
        school: "IKG Punjab Technical University", 
        year: "2024 - 2028", 
        desc: "Focusing on Software Development . Expected graduation in 2028." 
      },
      { 
        title: "Schooling (12th)", 
        school: "Delhi Public School", 
        year: "2024", 
        desc: "Completed . Core subjects: Physics, Chemistry, Math." 
      },
      { 
        title: "Schooling (10th)", 
        school: "Aryan residential public school", 
        year: "2022", 
        desc: "Completed . Core subjects" 
      }
    ]
  };

  return (
    <section id="resume" className="py-24 bg-[#141E30] text-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black uppercase tracking-widest italic"
          >
            My <span className="text-[#35577D]">Profile</span>
          </motion.h2>
          <p className="text-gray-500 text-xs mt-4 uppercase tracking-[0.3em]">Experience | Education | Skills</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-[#1d2a45] p-1.5 rounded-full border border-white/5 shadow-2xl overflow-x-auto no-scrollbar">
            {['biography', 'skills', 'education'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab ? 'bg-[#35577D] text-white' : 'text-gray-500 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content Box */}
        <div className="relative bg-[#1d2a45] border border-white/5 rounded-[3rem] p-8 md:p-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="grid md:grid-cols-2 gap-12"
            >
              {data[activeTab].map((item, idx) => (
                <div key={idx} className="relative pl-10 border-l-2 border-[#35577D]/20 group">
                  {/* Glowing Bullet Point */}
                  <div className="absolute -left-[9px] top-0 w-4 h-4 bg-[#141E30] border-2 border-[#35577D] rounded-full group-hover:bg-[#35577D] transition-all shadow-[0_0_15px_#35577D]"></div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-2xl font-bold uppercase tracking-tighter italic group-hover:text-[#35577D] transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-[10px] font-black bg-white/5 px-3 py-1 rounded-full text-gray-500 border border-white/5">
                      {item.year}
                    </span>
                  </div>
                  
                  <p className="text-[#35577D] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                    {item.school}
                  </p>
                  
                  <p className="text-gray-400 text-sm leading-relaxed leading-7">
                    {item.desc}
                  </p>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Resume;