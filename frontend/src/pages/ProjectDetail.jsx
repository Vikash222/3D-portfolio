import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Star } from 'lucide-react';
import { Github } from '../components/icons';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { getProject } from '../api/projectApi'; // Assuming this exists

const fallbackProject = {
  id: 1,
  title: 'LoopSense AI Telemetry',
  description: 'Advanced telemetry system for monitoring loop architectures with intelligent anomaly detection. This system leverages deep learning models to predict system failures before they occur, ensuring high availability and robust performance for mission-critical applications.',
  category: 'FULL STACK',
  stars: 124,
  tech: ['Go', 'gRPC', 'Prometheus', 'Docker', 'React', 'TypeScript'],
  githubUrl: '#',
  liveUrl: '#',
  content: 'Long form content explaining the architecture, challenges faced, and solutions implemented...'
};

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(fallbackProject);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (typeof getProject === 'function') {
          // If we had a real API call: const data = await getProject(id);
          // setProject(data);
        }
      } catch (error) {
        console.error('Failed to fetch project', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-[#F9F6F0] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F9F6F0] flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#DDA75B] transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>
          
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-[#2D2926] text-white text-xs font-bold px-3 py-1 rounded-full">
                {project.category}
              </span>
              <span className="flex items-center text-sm font-medium text-gray-600 gap-1">
                <Star className="w-4 h-4 text-[#DDA75B] fill-[#DDA75B]" /> {project.stars} stars
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#2D2926] mb-6">
              {project.title}
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              {project.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tech.map((t, i) => (
                <span key={i} className="bg-white border border-gray-200 text-[#2D2926] text-sm px-4 py-1.5 rounded-full font-medium shadow-sm">
                  {t}
                </span>
              ))}
            </div>
            
            <div className="flex gap-4">
              <a href={project.githubUrl} className="inline-flex items-center justify-center bg-[#2D2926] text-white px-6 py-3 rounded-lg font-medium hover:bg-black transition-colors gap-2">
                <Github className="w-5 h-5" /> View Source
              </a>
              <a href={project.liveUrl} className="inline-flex items-center justify-center border-2 border-[#2D2926] text-[#2D2926] px-6 py-3 rounded-lg font-medium hover:bg-[#2D2926] hover:text-white transition-colors gap-2">
                Live Demo <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div className="w-full h-64 md:h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl mb-12 shadow-lg flex items-center justify-center text-white/50">
            [ Project Image Gallery / Video Placeholder ]
          </div>
          
          <article className="prose prose-lg max-w-none text-gray-700">
            <h2>About The Project</h2>
            <p>{project.content}</p>
            <p>More detailed explanation of architecture, choices, and implementation can be added here.</p>
          </article>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
