import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/public/HeroSection';
import AboutSection from '../components/public/AboutSection';
import SkillsSection from '../components/public/SkillsSection';
import ProjectsSection from '../components/public/ProjectsSection';
import ExperienceSection from '../components/public/ExperienceSection';
import EducationCertificatesSection from '../components/public/EducationCertificatesSection';
import TestimonialsSection from '../components/public/TestimonialsSection';
import CTABanner from '../components/public/CTABanner';
import ContactSection from '../components/public/ContactSection';
import Footer from '../components/layout/Footer';
import { getPortfolio, trackEvent } from '../api/adminApi';
import { Wrench } from 'lucide-react';

const initialPortfolioState = {
  profile: {
    name: 'Vikash Kumar',
    headline: 'Senior Systems Engineer & AI Researcher — Architecting Next-Gen Intelligence',
    about_description: 'I am a passionate software engineer pursuing B.Tech Computer Science & Engineering at I.K. Gujral Punjab Technical University.',
    availability_status: 'Open for Opportunities',
    email: 'vikash@mrvikash.in',
    location: 'Punjab, India',
    theme_settings: { primary_color: '#DDA75B', accent_color: '#8A9A86' },
    hero_settings: {
      badge: 'CSE STUDENT · 2026',
      title_prefix: "Hi, I'm",
      highlight_name: 'Vikash',
      tagline: 'Architecting scalable web and mobile applications, integrated with intelligent AI models.',
      primary_btn_text: 'Explore Work',
      primary_btn_link: '#projects',
      secondary_btn_text: 'Download Resume',
      secondary_btn_link: '#contact',
      status_subtext: 'Full-Stack Developer · Distributed Systems · AI Integration'
    }
  },
  skills: [],
  projects: [],
  experiences: [],
  educations: [],
  certificates: [],
  achievements: [],
  testimonials: [],
  social_links: [
    { id: 1, platform: 'GitHub', url: 'https://github.com/Vikash222', is_visible: true },
    { id: 2, platform: 'LinkedIn', url: 'https://linkedin.com/in/mrvikash-kumar', is_visible: true },
    { id: 3, platform: 'Email', url: 'mailto:connect@mrvikash.in', is_visible: true },
  ],
  navigation_items: [
    { label: 'Home', url: '#' },
    { label: 'About', url: '#about' },
    { label: 'Skills', url: '#skills' },
    { label: 'Projects', url: '#projects' },
    { label: 'Experience', url: '#experience' },
    { label: 'Contact', url: '#contact' },
  ],
  sections_config: [
    { id: 'hero', name: 'Hero Section', enabled: true, order: 1 },
    { id: 'about', name: 'About Me', enabled: true, order: 2 },
    { id: 'skills', name: 'Skills & Toolkit', enabled: true, order: 3 },
    { id: 'projects', name: 'Featured Projects', enabled: true, order: 4 },
    { id: 'experience', name: 'Experience Timeline', enabled: true, order: 5 },
    { id: 'education', name: 'Education & Academics', enabled: true, order: 6 },
    { id: 'testimonials', name: 'Testimonials', enabled: true, order: 7 },
    { id: 'cta', name: 'Call To Action', enabled: true, order: 8 },
    { id: 'contact', name: 'Contact & Connect', enabled: true, order: 9 },
  ],
};

const CACHE_KEY = 'portfolio_bundle_cache';

const getCachedPortfolio = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (err) {
    console.warn('Failed to parse cached portfolio:', err);
  }
  return null;
};

export default function Home() {
  const [data, setData] = useState(() => getCachedPortfolio());
  const [isLoading, setIsLoading] = useState(!data);

  useEffect(() => {
    // 1. Fetch dynamic portfolio bundle
    getPortfolio()
      .then((res) => {
        const bundle = res.data?.data;
        if (bundle) {
          setData((prev) => {
            const merged = {
              ...(prev || initialPortfolioState),
              ...bundle,
              profile: { ...(prev?.profile || initialPortfolioState.profile), ...(bundle.profile || {}) },
              sections_config: bundle.sections_config || prev?.sections_config || initialPortfolioState.sections_config,
            };
            try {
              localStorage.setItem(CACHE_KEY, JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });

          // Update document title and SEO tags
          if (bundle.profile?.seo_settings?.meta_title) {
            document.title = bundle.profile.seo_settings.meta_title;
          } else if (bundle.profile?.name) {
            document.title = `${bundle.profile.name} — Portfolio & Systems Engineer`;
          }

          // Apply theme color variables to root
          if (bundle.profile?.theme_settings?.primary_color) {
            document.documentElement.style.setProperty('--primary-color', bundle.profile.theme_settings.primary_color);
          }
        }
      })
      .catch((err) => {
        console.warn('Portfolio API sync notice (running on fallback):', err?.message || err);
        setData((prev) => prev || initialPortfolioState);
      })
      .finally(() => {
        setIsLoading(false);
      });

    // 2. Track anonymous page impression
    trackEvent({
      page: window.location.pathname || '/',
      event_type: 'pageview',
    }).catch(() => {});
  }, []);

  // First-load protection: If fetching for the very first time and no cache exists, show sleek loader to prevent flash of default mock data
  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-[#121214] flex flex-col items-center justify-center text-white">
        <div className="relative flex items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center animate-pulse shadow-lg shadow-amber-500/5">
            <span className="font-serif font-bold text-xl text-amber-400">VK</span>
          </div>
          <div className="absolute inset-0 rounded-2xl border border-amber-500/30 animate-ping opacity-25" />
        </div>
      </div>
    );
  }

  // Handle Maintenance Mode
  const isMaintenance = data?.site_settings?.maintenance_mode;
  if (isMaintenance && !localStorage.getItem('token')) {
    return (
      <div className="min-h-screen bg-[#121214] flex flex-col items-center justify-center text-white px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
          <Wrench className="w-8 h-8 text-amber-500" />
        </div>
        <h1 className="text-3xl font-serif font-bold mb-3">Under Scheduled Maintenance</h1>
        <p className="text-slate-400 max-w-md text-sm mb-6 leading-relaxed">
          The portfolio is currently undergoing system upgrades and content synchronization. We will be back online shortly.
        </p>
        <a
          href="/admin/login"
          className="text-xs font-mono text-emerald-400 hover:underline border border-slate-800 px-4 py-2 rounded-lg bg-slate-900"
        >
          Staff & Admin Portal
        </a>
      </div>
    );
  }

  const profile = data?.profile || {};
  const sectionsConfig = data?.sections_config || initialPortfolioState.sections_config;

  // Sort sections according to CMS configuration
  const sortedSections = [...sectionsConfig]
    .filter((sec) => sec && sec.enabled !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="min-h-screen bg-[#121214] text-[#F9F6F0] selection:bg-amber-500/30 selection:text-white">
      <Navbar profile={profile} navigationItems={data?.navigation_items} />

      <main>
        {sortedSections.map((sec) => {
          switch (sec.id) {
            case 'hero':
              return <HeroSection key="hero" profile={profile} isLoading={isLoading} />;
            case 'about':
              return <AboutSection key="about" profile={profile} educations={data?.educations} />;
            case 'skills':
              return <SkillsSection key="skills" skills={data?.skills} profile={profile} />;
            case 'projects':
              return <ProjectsSection key="projects" projects={data?.projects} profile={profile} />;
            case 'experience':
              return <ExperienceSection key="experience" experiences={data?.experiences} />;
            case 'education': {
              const certsEnabled = sectionsConfig.find(s => s.id === 'certificates')?.enabled !== false;
              const achMatch = sectionsConfig.find(s => s.id === 'achievements');
              const achEnabled = achMatch ? achMatch.enabled !== false : certsEnabled;
              
              return (
                <EducationCertificatesSection
                  key="education-certs"
                  educations={data?.educations}
                  certificates={certsEnabled ? data?.certificates : []}
                  achievements={achEnabled ? data?.achievements : []}
                  profile={profile}
                />
              );
            }
            case 'testimonials':
              return <TestimonialsSection key="testimonials" testimonials={data?.testimonials} profile={profile} />;
            case 'cta':
              return <CTABanner key="cta" />;
            case 'contact':
              return <ContactSection key="contact" profile={profile} />;
            default:
              return null;
          }
        })}
      </main>

      <Footer profile={profile} socialLinks={data?.social_links} />
    </div>
  );
}
