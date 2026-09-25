import React from 'react';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/public/HeroSection';
import AboutSection from '../components/public/AboutSection';
import SkillsSection from '../components/public/SkillsSection';
import ProjectsSection from '../components/public/ProjectsSection';
import CTABanner from '../components/public/CTABanner';
import ContactSection from '../components/public/ContactSection';
import Footer from '../components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F9F6F0]">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <CTABanner />
      <ContactSection />
      <Footer />
    </div>
  );
}
