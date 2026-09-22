import React, { useState, useEffect } from 'react';
import {
  FolderGit2,
  ExternalLink,
  Star,
  GitFork,
  Code,
  Sparkles,
  Search,
  ArrowUpRight,
} from 'lucide-react';
import { GithubIcon } from '../common/Icons';
import { useVisualEditor } from '../../context/VisualEditorContext';
import InlineText from '../editor/InlineText';

const initialRepos = [
  {
    name: 'gate-entryptu',
    description: 'Security-assisted campus gate entry automation system for IKGPTU. Features student QR passes & guard verification.',
    language: 'PHP',
    html_url: 'https://github.com/Vikash222/gate-entryptu',
    stars: 0,
    forks: 0,
    category: 'Backend',
  },
  {
    name: 'hostel-kavach-privacy',
    description: 'Hostel Attendance & Management platform with GPS/geofenced mobile check-ins and multi-role university portals.',
    language: 'JavaScript',
    html_url: 'https://github.com/Vikash222/hostel-kavach-privacy',
    stars: 0,
    forks: 0,
    category: 'Full Stack',
  },
  {
    name: 'resume-forge-ai',
    description: 'AI-powered ATS-friendly resume creator platform deployed on Vercel with real-time markdown & PDF rendering.',
    language: 'TypeScript',
    html_url: 'https://github.com/Vikash222/resume-forge-ai',
    stars: 0,
    forks: 0,
    category: 'AI & Web',
  },
  {
    name: 'resume-forge',
    description: 'AI-powered ATS friendly resume & portfolio builder tailored for engineering internships and developer roles.',
    language: 'TypeScript',
    html_url: 'https://github.com/Vikash222/resume-forge',
    stars: 0,
    forks: 0,
    category: 'AI & Web',
  },
  {
    name: 'smart-booking-system',
    description: 'Online booking management system built with modern web technologies, Firebase cloud sync, and responsive UI.',
    language: 'JavaScript',
    html_url: 'https://github.com/Vikash222/smart-booking-system',
    stars: 0,
    forks: 0,
    category: 'Full Stack',
  },
  {
    name: 'SurvilAI-2',
    description: 'SurvilAI CCTV smart surveillance and computer vision stream analyzer for automated motion anomaly detection.',
    language: 'Python',
    html_url: 'https://github.com/Vikash222/SurvilAI-2',
    stars: 0,
    forks: 0,
    category: 'AI & Vision',
  },
  {
    name: 'NetworkScannerProject',
    description: 'Automated network port scanner, packet analyzer, and host discovery tool for cybersecurity diagnostics.',
    language: 'Python',
    html_url: 'https://github.com/Vikash222/NetworkScannerProject',
    stars: 0,
    forks: 0,
    category: 'Cybersecurity',
  },
  {
    name: 'ai-ivr-call-assistant',
    description: 'AI automated IVR phone call assistant and voice workflow integration prototype.',
    language: 'Python',
    html_url: 'https://github.com/Vikash222/ai-ivr-call-assistant',
    stars: 0,
    forks: 0,
    category: 'AI & Audio',
  },
  {
    name: '3D-portfolio',
    description: 'Interactive 3D WebGL developer portfolio featuring Three.js animations, shaders, and micro-interactions.',
    language: 'JavaScript',
    html_url: 'https://github.com/Vikash222/3D-portfolio',
    stars: 0,
    forks: 0,
    category: 'Frontend & 3D',
  },
  {
    name: 'Bosslive',
    description: 'High-speed live interactive streaming interface and media pipeline prototype.',
    language: 'TypeScript',
    html_url: 'https://github.com/Vikash222/Bosslive',
    stars: 0,
    forks: 0,
    category: 'Full Stack',
  },
  {
    name: 'CRICKET-111111',
    description: 'Interactive sports platform and real-time score analytics interface built with TypeScript.',
    language: 'TypeScript',
    html_url: 'https://github.com/Vikash222/CRICKET-111111',
    stars: 0,
    forks: 0,
    category: 'Frontend',
  },
  {
    name: 'register',
    description: 'Subdomain registry tool and dynamic domain configuration utility.',
    language: 'JavaScript',
    html_url: 'https://github.com/Vikash222/register',
    stars: 0,
    forks: 0,
    category: 'Web Tools',
  },
  {
    name: 'callage-gym-',
    description: 'College gym membership, equipment inventory, and athlete registration management portal.',
    language: 'HTML / CSS',
    html_url: 'https://github.com/Vikash222/callage-gym-',
    stars: 0,
    forks: 0,
    category: 'Frontend',
  },
  {
    name: 'netflix-clone-',
    description: 'Modern responsive video streaming UI clone with category carousel and trailer modals.',
    language: 'JavaScript',
    html_url: 'https://github.com/Vikash222/netflix-clone-',
    stars: 0,
    forks: 0,
    category: 'Frontend',
  },
  {
    name: 'shipping-site-',
    description: 'E-commerce and logistics order tracking interface prototype inspired by Amazon.',
    language: 'HTML / CSS',
    html_url: 'https://github.com/Vikash222/shipping-site-',
    stars: 0,
    forks: 0,
    category: 'Frontend',
  },
  {
    name: 'portfolio',
    description: 'Personal web engineering showcase and project repository.',
    language: 'JavaScript',
    html_url: 'https://github.com/Vikash222/portfolio',
    stars: 0,
    forks: 0,
    category: 'Frontend',
  },
];

const languageColors = {
  JavaScript: 'bg-amber-400',
  TypeScript: 'bg-blue-500',
  Python: 'bg-emerald-500',
  PHP: 'bg-indigo-500',
  'HTML / CSS': 'bg-rose-400',
  HTML: 'bg-rose-400',
};

export default function GitHubReposSection({ profile = null }) {
  const { updateAboutDetail } = useVisualEditor();
  const [repos, setRepos] = useState(initialRepos);
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Try live fetch from GitHub API on mount
  useEffect(() => {
    const fetchLiveRepos = async () => {
      try {
        const res = await fetch('https://api.github.com/users/Vikash222/repos?per_page=100&sort=updated');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped = data.map((r) => ({
              name: r.name,
              description: r.description || 'Open-source software repository on GitHub.',
              language: r.language || 'Code',
              html_url: r.html_url,
              stars: r.stargazers_count || 0,
              forks: r.forks_count || 0,
            }));
            setRepos(mapped);
          }
        }
      } catch (err) {
        // Fallback to initial curated repos
      }
    };
    fetchLiveRepos();
  }, []);

  const languages = ['All', 'Python', 'TypeScript', 'JavaScript', 'PHP', 'HTML'];

  const filteredRepos = repos.filter((repo) => {
    const matchesLang =
      selectedLanguage === 'All' ||
      (repo.language && repo.language.toLowerCase().includes(selectedLanguage.toLowerCase()));
    const matchesSearch =
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesLang && matchesSearch;
  });

  return (
    <section id="github" className="py-28 relative overflow-hidden bg-transparent">
      {/* Background Ambience */}
      <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/60 border border-red-500/30 text-red-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-lg shadow-red-950/30">
            <GithubIcon className="w-3.5 h-3.5 fill-current" />
            <InlineText
              value={profile?.about_details?.github_badge ?? 'Live GitHub Repositories'}
              placeholder="Live GitHub Repositories"
              onChange={(val) => updateAboutDetail('github_badge', val)}
            />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            <InlineText
              value={profile?.about_details?.github_title_1 ?? 'Explore All Open-Source Work on'}
              placeholder="Explore All Open-Source Work on"
              onChange={(val) => updateAboutDetail('github_title_1', val)}
            />{' '}
            <span className="bg-gradient-to-r from-red-500 via-rose-500 to-red-400 bg-clip-text text-transparent">
              <InlineText
                value={profile?.about_details?.github_title_gradient ?? 'GitHub @Vikash222'}
                placeholder="GitHub @Vikash222"
                onChange={(val) => updateAboutDetail('github_title_gradient', val)}
              />
            </span>
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
            <InlineText
              as="span"
              value={profile?.about_details?.github_subtitle ?? 'Every software repository, automation script, campus system, and web tool built by Vikash is public and open-source.'}
              placeholder="Every software repository, automation script, campus system, and web tool built by Vikash is public and open-source."
              onChange={(val) => updateAboutDetail('github_subtitle', val)}
            />
          </p>

          <div className="mt-6 flex justify-center">
            <a
              href={profile?.github || "https://github.com/Vikash222"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-bold text-xs shadow-lg border border-white/15 transition-all hover:shadow-red-500/20 cursor-pointer"
            >
              <GithubIcon className="w-4 h-4 fill-white" />
              <InlineText
                as="span"
                value={profile?.about_details?.github_btn_text ?? 'Follow @Vikash222 on GitHub'}
                placeholder="Follow @Vikash222 on GitHub"
                onChange={(val) => updateAboutDetail('github_btn_text', val)}
              />
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap items-center gap-2">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedLanguage === lang
                    ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-500 text-white shadow-lg shadow-red-500/25 border border-red-400/40'
                    : 'bg-slate-900/70 text-slate-300 hover:text-white hover:bg-slate-800 border border-white/10'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search repositories..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/70 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:border-red-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Repositories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRepos.map((repo, idx) => {
            const langDotColor = languageColors[repo.language] || 'bg-red-500';
            return (
              <a
                key={repo.name || idx}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="cosmic-card cosmic-card-hover rounded-2xl p-6 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <FolderGit2 className="w-4 h-4 text-red-400 shrink-0" />
                      <h3 className="text-sm font-black text-white group-hover:text-red-400 transition-colors truncate">
                        {repo.name}
                      </h3>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-400 transition-colors shrink-0" />
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
                    {repo.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${langDotColor}`} />
                    <span className="font-semibold text-slate-300">{repo.language || 'Code'}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      {repo.stars || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3.5 h-3.5 text-slate-400" />
                      {repo.forks || 0}
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
