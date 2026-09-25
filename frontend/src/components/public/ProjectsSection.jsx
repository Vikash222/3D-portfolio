import React, { useEffect, useState } from 'react';
import { ArrowRight, Star, ExternalLink } from 'lucide-react';
import { Github } from '../icons';
import { getProjects } from '../../api/projectApi'; // Assuming this exists

const fallbackProjects = [
  {
    id: 1,
    title: 'LoopSense AI Telemetry',
    description: 'Advanced telemetry system for monitoring loop architectures with intelligent anomaly detection.',
    category: 'FULL STACK',
    stars: 124,
    tech: ['Go', 'gRPC', 'Prometheus', 'Docker'],
    githubUrl: '#',
    liveUrl: '#',
  },
  {
    id: 2,
    title: 'Synapse Headless Core',
    description: 'A robust headless CMS architecture designed for high-throughput content delivery.',
    category: 'HEADLESS ARCHITECTURE',
    stars: 89,
    tech: ['React', 'Laravel', 'MySQL'],
    githubUrl: '#',
    liveUrl: '#',
  },
  {
    id: 3,
    title: 'Algorithmic Market Flow',
    description: 'Predictive modeling engine for analyzing market trends using deep learning models.',
    category: 'MACHINE LEARNING',
    stars: 210,
    tech: ['Python', 'TensorFlow', 'Pandas'],
    githubUrl: '#',
    liveUrl: '#',
  },
];

export default function ProjectsSection() {
  const [projects, setProjects] = useState(fallbackProjects);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (typeof getProjects === 'function') {
          const data = await getProjects();
          if (data && data.length > 0) setProjects(data);
        }
      } catch (error) {
        console.error('Failed to fetch projects', error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <section id="projects" className="py-24 bg-[#F9F6F0] scroll-mt-20">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-[#DDA75B] text-sm font-bold tracking-widest uppercase mb-2 block">
              FEATURED WORK
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-[#2D2926] font-bold">
              Things I've Built
            </h2>
          </div>
          <a href="#" className="inline-flex items-center text-[#2D2926] font-semibold hover:text-[#DDA75B] transition-colors group">
            Explore All On Repo on GitHub 
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group">
              {/* Thumbnail Placeholder */}
              <div className="h-48 bg-gradient-to-br from-[#2D2926] to-[#4a4541] relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#2D2926]">
                  {project.category}
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#2D2926] flex items-center gap-1">
                  <Star className="w-3 h-3 text-[#DDA75B] fill-[#DDA75B]" /> {project.stars}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-serif font-bold text-[#2D2926] mb-2 line-clamp-1">{project.title}</h3>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-1">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((t, i) => (
                    <span key={i} className="bg-[#F9F6F0] text-[#2D2926] text-xs px-2.5 py-1 rounded-md font-medium">
                      {t}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <a href={project.githubUrl} className="text-gray-400 hover:text-[#2D2926] transition-colors flex items-center gap-2 text-sm font-medium">
                    <Github className="w-4 h-4" /> Code
                  </a>
                  <a href={project.liveUrl} className="text-gray-400 hover:text-[#DDA75B] transition-colors flex items-center gap-2 text-sm font-medium">
                    Live Demo <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
