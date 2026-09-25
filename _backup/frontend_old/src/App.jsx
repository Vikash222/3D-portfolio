import React, { useState, useEffect } from 'react';
import Navbar from './components/public/Navbar';
import HeroSection from './components/public/HeroSection';
import AboutSection from './components/public/AboutSection';
import SkillsSection from './components/public/SkillsSection';
import ProjectsSection from './components/public/ProjectsSection';
import ExperienceSection from './components/public/ExperienceSection';
import ServicesSection from './components/public/ServicesSection';
import TestimonialsSection from './components/public/TestimonialsSection';
import ContactSection from './components/public/ContactSection';
import Footer from './components/public/Footer';
import AiAssistantWidget from './components/public/AiAssistantWidget';
import ClientPortalView from './components/public/ClientPortalView';
import LeadershipEducationSection from './components/public/LeadershipEducationSection';
import GitHubReposSection from './components/public/GitHubReposSection';
import SocialFeedSection from './components/public/SocialFeedSection';
import MobileBottomNav from './components/public/MobileBottomNav';
import MobileQuickContactSheet from './components/public/MobileQuickContactSheet';

import AdminLayout from './components/admin/AdminLayout';
import DashboardView from './components/admin/DashboardView';
import MessagesView from './components/admin/MessagesView';
import SocialStreamView from './components/admin/SocialStreamView';
import ProjectsView from './components/admin/ProjectsView';
import SkillsView from './components/admin/SkillsView';
import ExperienceView from './components/admin/ExperienceView';
import ServicesView from './components/admin/ServicesView';
import TestimonialsView from './components/admin/TestimonialsView';
import ProfileView from './components/admin/ProfileView';
import AiSettingsView from './components/admin/AiSettingsView';
import SecurityView from './components/admin/SecurityView';
import FreelancePricingAdminView from './components/admin/FreelancePricingAdminView';
import ProjectTemplatesAdminView from './components/admin/ProjectTemplatesAdminView';
import LoginView from './components/admin/LoginView';

import LiveEditorTopBar from './components/editor/LiveEditorTopBar';
import LiveVisualSectionWrapper from './components/editor/LiveVisualSectionWrapper';
import LiveEditorDrawer from './components/editor/LiveEditorDrawer';
import { VisualEditorContext } from './context/VisualEditorContext';
import ImageCropModal from './components/admin/ImageCropModal';
import GalaxyBackground from './components/public/GalaxyBackground';
import { Edit3, CheckCircle2 } from 'lucide-react';

import {
  getPortfolioData,
  getDashboardStats,
  logout,
  updateAdminProfile,
  uploadFile,
  createProject as apiCreateProject,
  updateProject as apiUpdateProject,
  deleteProject as apiDeleteProject,
  createSkill as apiCreateSkill,
  updateSkill as apiUpdateSkill,
  deleteSkill as apiDeleteSkill,
} from './services/api';

export default function App() {
  const [route, setRoute] = useState('public'); // 'public' | 'editor' | 'login' | 'admin' | 'client-portal'
  const [adminView, setAdminView] = useState('dashboard'); // 'dashboard' | 'messages' | 'projects' | 'skills' | 'experience' | 'services' | 'testimonials' | 'profile' | 'ai-settings' | 'security'
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [clientUser, setClientUser] = useState(null);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isMobileContactOpen, setIsMobileContactOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedMessageFromDash, setSelectedMessageFromDash] = useState(null);

  // Live Visual Front-End Editor states
  const [activeEditorSection, setActiveEditorSection] = useState('hero');
  const [isEditorDrawerOpen, setIsEditorDrawerOpen] = useState(false);
  const [isLiveEditorPreview, setIsLiveEditorPreview] = useState(false);
  const [hasLiveEditorUnsavedChanges, setHasLiveEditorUnsavedChanges] = useState(false);
  const [isLiveSaving, setIsLiveSaving] = useState(false);
  const [liveSaveMessage, setLiveSaveMessage] = useState('');

  // Initialize admin & client auth states from local storage
  useEffect(() => {
    const savedAdminToken = localStorage.getItem('portfolio_admin_token');
    const savedAdminUser = localStorage.getItem('portfolio_admin_user');
    if (savedAdminToken && savedAdminUser) {
      try {
        setUser(JSON.parse(savedAdminUser));
      } catch (e) {
        localStorage.removeItem('portfolio_admin_token');
        localStorage.removeItem('portfolio_admin_user');
      }
    }

    const savedClientToken = localStorage.getItem('portfolio_client_token');
    const savedClientUser = localStorage.getItem('portfolio_client_user');
    if (savedClientToken && savedClientUser) {
      try {
        setClientUser(JSON.parse(savedClientUser));
      } catch (e) {
        localStorage.removeItem('portfolio_client_token');
        localStorage.removeItem('portfolio_client_user');
      }
    }

    // Direct URL path or hash routing for /admin and /client
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path.includes('/admin') || hash.includes('#admin')) {
      if (savedAdminToken) {
        setRoute('admin');
      } else {
        setRoute('login');
      }
    } else if (path.includes('/client') || path.includes('/portal') || hash.includes('#client') || hash.includes('#portal')) {
      if (savedClientToken) {
        setRoute('client-portal');
      } else {
        setRoute('login');
      }
    } else if (path.includes('/login') || hash.includes('#login') || path.includes('/register') || hash.includes('#register')) {
      if (savedAdminToken) {
        setRoute('admin');
      } else if (savedClientToken) {
        setRoute('client-portal');
      } else {
        setRoute('login');
      }
    }
  }, []);

  // Fetch Public Portfolio Data
  const loadPortfolio = async () => {
    try {
      setLoading(true);
      const data = await getPortfolioData();
      setPortfolioData(data);
    } catch (err) {
      console.error('Failed to load portfolio data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Unread Count for Admin
  const checkUnreadCount = async () => {
    if (!localStorage.getItem('portfolio_admin_token')) return;
    try {
      const data = await getDashboardStats();
      setUnreadCount(data.stats?.unread_messages || 0);
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  // Dynamically sync browser tab favicon & title with profile picture
  useEffect(() => {
    const avatar = portfolioData?.profile?.avatar_url || portfolioData?.profile?.hero_image_url || '/assets/vikash-hero.jpg';
    if (avatar) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.type = 'image/jpeg';
      link.href = avatar;
    }
    if (portfolioData?.profile?.name) {
      document.title = `${portfolioData.profile.name} | B.Tech CSE Student & Full-Stack Developer | IKGPTU`;
    }
  }, [portfolioData?.profile?.avatar_url, portfolioData?.profile?.hero_image_url, portfolioData?.profile?.name]);

  useEffect(() => {
    if (user) {
      checkUnreadCount();
      const interval = setInterval(checkUnreadCount, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Navigate to Admin
  const handleNavigateAdmin = () => {
    if (user) {
      setRoute('admin');
    } else {
      setRoute('login');
    }
  };

  const handleLoginSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    setRoute('admin');
    setAdminView('dashboard');
    checkUnreadCount();
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setRoute('public');
  };

  const handleClientAuthSuccess = (authenticatedClient) => {
    setClientUser(authenticatedClient);
    setRoute('client-portal');
  };

  const handleClientLogout = async () => {
    await logout();
    setClientUser(null);
    setRoute('public');
  };

  const handleViewMessageFromDashboard = (msg) => {
    setSelectedMessageFromDash(msg);
    setAdminView('messages');
  };

  const handleOpenLiveEditor = (section = 'hero') => {
    setActiveEditorSection(section);
    setIsEditorDrawerOpen(false);
    setIsLiveEditorPreview(false);
    setRoute('editor');
  };

  // Visual In-Place Cropper Modal State
  const [cropperState, setCropperState] = useState({
    isOpen: false,
    imageSrc: '',
    originalFile: null,
    title: 'Cut & Scale Photo',
    defaultAspect: '16:9',
    onApply: null,
  });

  const openImageCropper = ({ currentSrc, originalFile, title, defaultAspect, onApply }) => {
    setCropperState({
      isOpen: true,
      imageSrc: currentSrc,
      originalFile: originalFile || null,
      title: title || 'Cut & Scale Photo',
      defaultAspect: defaultAspect || '16:9',
      onApply,
    });
  };

  const handleCropperApply = async (processedFile) => {
    try {
      setIsLiveSaving(true);
      const res = await uploadFile(processedFile);
      if (cropperState.onApply) {
        cropperState.onApply(res.url);
      }
      setHasLiveEditorUnsavedChanges(true);
      setLiveSaveMessage('Photo updated successfully! Click "Save Live Changes" to persist.');
      setTimeout(() => setLiveSaveMessage(''), 3500);
    } catch (err) {
      console.error('Failed to upload cropped photo:', err);
      alert('Photo upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsLiveSaving(false);
      setCropperState((prev) => ({ ...prev, isOpen: false, onApply: null }));
    }
  };

  // In-Place WYSIWYG Updaters
  const updateProfileField = (field, value) => {
    setPortfolioData((prev) =>
      prev
        ? {
            ...prev,
            profile: {
              ...prev.profile,
              [field]: value,
            },
          }
        : prev
    );
    setHasLiveEditorUnsavedChanges(true);
  };

  const updateAboutDetail = (key, value) => {
    setPortfolioData((prev) =>
      prev
        ? {
            ...prev,
            profile: {
              ...prev.profile,
              about_details: {
                ...(prev.profile?.about_details || {}),
                [key]: value,
              },
            },
          }
        : prev
    );
    setHasLiveEditorUnsavedChanges(true);
  };

  const updateCampItem = (index, updatedItem) => {
    setPortfolioData((prev) => {
      if (!prev || !prev.profile) return prev;
      const currentGallery =
        Array.isArray(prev.profile.camp_gallery) && prev.profile.camp_gallery.length > 0
          ? [...prev.profile.camp_gallery]
          : [
              {
                id: 'camp_1',
                image_url: prev.profile.camp_image_url || '/assets/nic-camp.jpg',
                title: prev.profile.camp_title || 'National Integration Camp (NIC)',
                tag: 'NIC Delegate',
                badge: 'Youth Leadership & National Integration Delegate',
                date: '2024',
                caption: prev.profile.camp_caption || '',
              },
            ];
      currentGallery[index] = updatedItem;
      return {
        ...prev,
        profile: {
          ...prev.profile,
          camp_gallery: currentGallery,
          camp_image_url:
            index === 0 ? updatedItem.image_url : currentGallery[0]?.image_url || prev.profile.camp_image_url,
          camp_title:
            index === 0 ? updatedItem.title : currentGallery[0]?.title || prev.profile.camp_title,
          camp_caption:
            index === 0 ? updatedItem.caption : currentGallery[0]?.caption || prev.profile.camp_caption,
        },
      };
    });
    setHasLiveEditorUnsavedChanges(true);
  };

  const deleteCampItem = (index) => {
    setPortfolioData((prev) => {
      if (!prev || !prev.profile) return prev;
      const currentGallery = (prev.profile.camp_gallery || []).filter((_, i) => i !== index);
      return {
        ...prev,
        profile: {
          ...prev.profile,
          camp_gallery: currentGallery,
          camp_image_url: currentGallery[0]?.image_url || '',
          camp_title: currentGallery[0]?.title || '',
          camp_caption: currentGallery[0]?.caption || '',
        },
      };
    });
    setHasLiveEditorUnsavedChanges(true);
  };

  const addCampItem = (newItem) => {
    setPortfolioData((prev) => {
      if (!prev || !prev.profile) return prev;
      const currentGallery = Array.isArray(prev.profile.camp_gallery)
        ? [...prev.profile.camp_gallery, newItem]
        : [newItem];
      return {
        ...prev,
        profile: {
          ...prev.profile,
          camp_gallery: currentGallery,
        },
      };
    });
    setHasLiveEditorUnsavedChanges(true);
  };

  const updateProject = (updatedProject) => {
    setPortfolioData((prev) => {
      if (!prev) return prev;
      const updatedList = (prev.projects || []).map((p) =>
        p.id === updatedProject.id || p.slug === updatedProject.slug ? updatedProject : p
      );
      return { ...prev, projects: updatedList };
    });
    setHasLiveEditorUnsavedChanges(true);
    if (
      typeof updatedProject.id === 'number' ||
      (!String(updatedProject.id).startsWith('proj_') &&
        !String(updatedProject.id).startsWith('new_'))
    ) {
      apiUpdateProject(updatedProject.id, updatedProject).catch((err) =>
        console.error('Project sync error:', err)
      );
    }
  };

  const deleteProject = (projectId) => {
    setPortfolioData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        projects: (prev.projects || []).filter((p) => p.id !== projectId),
      };
    });
    setHasLiveEditorUnsavedChanges(true);
    if (
      typeof projectId === 'number' ||
      (!String(projectId).startsWith('proj_') && !String(projectId).startsWith('new_'))
    ) {
      apiDeleteProject(projectId).catch((err) => console.error('Project delete error:', err));
    }
  };

  const addProject = (newProject) => {
    setPortfolioData((prev) => {
      if (!prev) return prev;
      return { ...prev, projects: [...(prev.projects || []), newProject] };
    });
    setHasLiveEditorUnsavedChanges(true);
    apiCreateProject(newProject)
      .then((res) => {
        if (res?.project?.id) {
          setPortfolioData((curr) =>
            curr
              ? {
                  ...curr,
                  projects: curr.projects.map((p) =>
                    p.id === newProject.id ? res.project : p
                  ),
                }
              : curr
          );
        }
      })
      .catch((err) => console.error('Create project error:', err));
  };

  const updateSkill = (skillId, updatedSkill) => {
    setPortfolioData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        skills: (prev.skills || []).map((s) => (s.id === skillId ? updatedSkill : s)),
      };
    });
    setHasLiveEditorUnsavedChanges(true);
    if (typeof skillId === 'number' || !String(skillId).startsWith('skill_')) {
      apiUpdateSkill(skillId, updatedSkill).catch((err) =>
        console.error('Skill sync error:', err)
      );
    }
  };

  const deleteSkill = (skillId) => {
    setPortfolioData((prev) => {
      if (!prev) return prev;
      return { ...prev, skills: (prev.skills || []).filter((s) => s.id !== skillId) };
    });
    setHasLiveEditorUnsavedChanges(true);
    if (typeof skillId === 'number' || !String(skillId).startsWith('skill_')) {
      apiDeleteSkill(skillId).catch((err) => console.error('Skill delete error:', err));
    }
  };

  const addSkill = (newSkill) => {
    setPortfolioData((prev) => {
      if (!prev) return prev;
      return { ...prev, skills: [...(prev.skills || []), newSkill] };
    });
    setHasLiveEditorUnsavedChanges(true);
    apiCreateSkill(newSkill)
      .then((res) => {
        if (res?.skill?.id) {
          setPortfolioData((curr) =>
            curr
              ? {
                  ...curr,
                  skills: curr.skills.map((s) => (s.id === newSkill.id ? res.skill : s)),
                }
              : curr
          );
        }
      })
      .catch((err) => console.error('Create skill error:', err));
  };

  const handleUpdateProfileFromEditor = (updatedProfile) => {
    setPortfolioData((prev) => (prev ? { ...prev, profile: updatedProfile } : prev));
    setHasLiveEditorUnsavedChanges(true);
  };

  const handleUpdateProjectsFromEditor = (updatedProjects) => {
    setPortfolioData((prev) => (prev ? { ...prev, projects: updatedProjects } : prev));
    setHasLiveEditorUnsavedChanges(true);
  };

  const handleUpdateSkillsFromEditor = (updatedSkills) => {
    setPortfolioData((prev) => (prev ? { ...prev, skills: updatedSkills } : prev));
    setHasLiveEditorUnsavedChanges(true);
  };

  const handleSaveLiveChanges = async () => {
    if (!portfolioData?.profile) return;
    try {
      setIsLiveSaving(true);
      await updateAdminProfile(portfolioData.profile);
      setHasLiveEditorUnsavedChanges(false);
      setLiveSaveMessage('All visual edits saved to database successfully!');
      setTimeout(() => setLiveSaveMessage(''), 4000);
    } catch (err) {
      console.error('Failed to save live edits:', err);
      alert('Failed to save visual edits: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsLiveSaving(false);
    }
  };


  // Extract Portfolio Content
  const isEditMode = route === 'editor';
  const profile = portfolioData?.profile;
  const skills = portfolioData?.skills || [];
  const projects = portfolioData?.projects || [];
  const experiences = portfolioData?.experiences || [];
  const services = portfolioData?.services || [];
  const testimonials = portfolioData?.testimonials || [];

  // Render Unified Login / Register Page (Client & Admin)
  if (route === 'login') {
    return (
      <LoginView
        onAdminSuccess={handleLoginSuccess}
        onClientSuccess={handleClientAuthSuccess}
        onBackToPortfolio={() => setRoute('public')}
      />
    );
  }

  // Render Client Inquiries Portal
  if (route === 'client-portal') {
    return (
      <ClientPortalView
        clientUser={clientUser}
        onBackToPortfolio={() => setRoute('public')}
        onLogout={handleClientLogout}
        projects={projects}
        profile={profile}
      />
    );
  }

  // Render Admin CMS
  if (route === 'admin') {
    return (
      <AdminLayout
        currentView={adminView}
        setCurrentView={(view) => {
          setSelectedMessageFromDash(null);
          setAdminView(view);
        }}
        unreadCount={unreadCount}
        user={user}
        onLogout={handleLogout}
        onViewLive={() => {
          setRoute('public');
          loadPortfolio(); // refresh live data
        }}
        onOpenLiveEditor={() => handleOpenLiveEditor('hero')}
      >
        {adminView === 'dashboard' && (
          <DashboardView
            onNavigate={(view) => setAdminView(view)}
            onViewMessage={handleViewMessageFromDashboard}
            onOpenLiveEditor={() => handleOpenLiveEditor('hero')}
          />
        )}
        {adminView === 'messages' && (
          <MessagesView initialSelectedMessage={selectedMessageFromDash} />
        )}
        {adminView === 'pricing' && <FreelancePricingAdminView />}
        {adminView === 'builder-templates' && <ProjectTemplatesAdminView />}
        {adminView === 'social-stream' && <SocialStreamView />}
        {adminView === 'projects' && <ProjectsView />}
        {adminView === 'skills' && <SkillsView />}
        {adminView === 'experience' && <ExperienceView />}
        {adminView === 'services' && <ServicesView />}
        {adminView === 'testimonials' && <TestimonialsView />}
        {adminView === 'profile' && (
          <ProfileView
            onProfileUpdated={(updatedProfile) => {
              setPortfolioData((prev) => (prev ? { ...prev, profile: updatedProfile } : prev));
            }}
          />
        )}
        {adminView === 'ai-settings' && <AiSettingsView />}
        {adminView === 'security' && (
          <SecurityView
            user={user}
            onUserUpdated={(updatedUser) => {
              setUser(updatedUser);
              localStorage.setItem('portfolio_admin_user', JSON.stringify(updatedUser));
            }}
          />
        )}
      </AdminLayout>
    );
  }

  return (
    <VisualEditorContext.Provider
      value={{
        isEditMode,
        isPreviewMode: isLiveEditorPreview,
        updateProfileField,
        updateAboutDetail,
        updateCampItem,
        deleteCampItem,
        addCampItem,
        updateProject,
        deleteProject,
        addProject,
        updateSkill,
        deleteSkill,
        addSkill,
        openImageCropper,
        markDirty: () => setHasLiveEditorUnsavedChanges(true),
      }}
    >
      <div className="min-h-screen relative bg-[#070305] text-slate-100 flex flex-col selection:bg-red-600 selection:text-white overflow-x-hidden">
        {/* Living Full-Page Starfield & Spiral Galaxy Cosmic Canvas */}
        <GalaxyBackground />

        {/* Sticky Live Editor Top Bar (Shown only in Live Editor Mode) */}
        {isEditMode && (
        <LiveEditorTopBar
          isLiveSaving={isLiveSaving}
          hasUnsavedChanges={hasLiveEditorUnsavedChanges}
          isPreviewMode={isLiveEditorPreview}
          onTogglePreviewMode={() => setIsLiveEditorPreview((prev) => !prev)}
          onSaveLiveChanges={handleSaveLiveChanges}
          onExitToAdmin={() => setRoute('admin')}
          activeSection={activeEditorSection}
          isDrawerOpen={isEditorDrawerOpen}
          onToggleDrawer={() => setIsEditorDrawerOpen((prev) => !prev)}
          onSelectSection={(sec) => {
            setActiveEditorSection(sec);
            setIsEditorDrawerOpen(true);
          }}
        />
      )}

      {/* Floating Success Toast when edits are saved */}
      {liveSaveMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-emerald-500 text-slate-950 text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4" />
          <span>{liveSaveMessage}</span>
        </div>
      )}

      {/* Sticky Header Navbar */}
      <Navbar
        user={user}
        onNavigateAdmin={handleNavigateAdmin}
        profile={profile}
        isEditMode={isEditMode}
        onOpenAuth={() => setRoute('login')}
        clientUser={clientUser}
        onOpenClientPortal={() => setRoute('client-portal')}
      />

      {/* Main Public Page Content with Live Visual Section Wrappers */}
      <main className="flex-1 pb-20 md:pb-0 relative z-10">
        <LiveVisualSectionWrapper
          sectionId="hero"
          title="Hero & 3D Portrait"
          isEditMode={isEditMode}
          isPreviewMode={isLiveEditorPreview}
          onOpenEditor={(sec) => {
            setActiveEditorSection(sec);
            setIsEditorDrawerOpen(true);
          }}
        >
          <HeroSection
            profile={profile}
            onOpenChat={() => setIsAiChatOpen(true)}
          />
        </LiveVisualSectionWrapper>

        <LiveVisualSectionWrapper
          sectionId="about"
          title="About Narrative & Story"
          isEditMode={isEditMode}
          isPreviewMode={isLiveEditorPreview}
          onOpenEditor={(sec) => {
            setActiveEditorSection(sec);
            setIsEditorDrawerOpen(true);
          }}
        >
          <AboutSection profile={profile} />
        </LiveVisualSectionWrapper>

        <LiveVisualSectionWrapper
          sectionId="skills"
          title="Skills & Tech Stack"
          isEditMode={isEditMode}
          isPreviewMode={isLiveEditorPreview}
          onOpenEditor={(sec) => {
            setActiveEditorSection(sec);
            setIsEditorDrawerOpen(true);
          }}
        >
          <SkillsSection skills={skills} profile={profile} />
        </LiveVisualSectionWrapper>

        <LiveVisualSectionWrapper
          sectionId="projects"
          title="Featured Projects"
          isEditMode={isEditMode}
          isPreviewMode={isLiveEditorPreview}
          onOpenEditor={(sec) => {
            setActiveEditorSection(sec);
            setIsEditorDrawerOpen(true);
          }}
        >
          <ProjectsSection projects={projects} profile={profile} />
        </LiveVisualSectionWrapper>

        <LiveVisualSectionWrapper
          sectionId="education-leadership"
          title="Campus Life & Camp Gallery"
          isEditMode={isEditMode}
          isPreviewMode={isLiveEditorPreview}
          onOpenEditor={(sec) => {
            setActiveEditorSection(sec);
            setIsEditorDrawerOpen(true);
          }}
        >
          <LeadershipEducationSection profile={profile} />
        </LiveVisualSectionWrapper>

        <LiveVisualSectionWrapper
          sectionId="github"
          title="GitHub Repositories"
          isEditMode={isEditMode}
          isPreviewMode={isLiveEditorPreview}
          onOpenEditor={(sec) => {
            setActiveEditorSection(sec);
            setIsEditorDrawerOpen(true);
          }}
        >
          <GitHubReposSection profile={profile} />
        </LiveVisualSectionWrapper>

        <LiveVisualSectionWrapper
          sectionId="social-feed"
          title="Live Social Feed"
          isEditMode={isEditMode}
          isPreviewMode={isLiveEditorPreview}
          onOpenEditor={(sec) => {
            setActiveEditorSection(sec);
            setIsEditorDrawerOpen(true);
          }}
        >
          <SocialFeedSection />
        </LiveVisualSectionWrapper>

        <LiveVisualSectionWrapper
          sectionId="experience"
          title="Career Timeline"
          isEditMode={isEditMode}
          isPreviewMode={isLiveEditorPreview}
          onOpenEditor={(sec) => {
            setActiveEditorSection(sec);
            setIsEditorDrawerOpen(true);
          }}
        >
          <ExperienceSection experiences={experiences} />
        </LiveVisualSectionWrapper>

        <LiveVisualSectionWrapper
          sectionId="services"
          title="Services & Capabilities"
          isEditMode={isEditMode}
          isPreviewMode={isLiveEditorPreview}
          onOpenEditor={(sec) => {
            setActiveEditorSection(sec);
            setIsEditorDrawerOpen(true);
          }}
        >
          <ServicesSection
            services={services}
            profile={profile}
          />
        </LiveVisualSectionWrapper>

        <LiveVisualSectionWrapper
          sectionId="testimonials"
          title="Peer Endorsements"
          isEditMode={isEditMode}
          isPreviewMode={isLiveEditorPreview}
          onOpenEditor={(sec) => {
            setActiveEditorSection(sec);
            setIsEditorDrawerOpen(true);
          }}
        >
          <TestimonialsSection testimonials={testimonials} profile={profile} />
        </LiveVisualSectionWrapper>

        <LiveVisualSectionWrapper
          sectionId="contact"
          title="Contact & Direct Links"
          isEditMode={isEditMode}
          isPreviewMode={isLiveEditorPreview}
          onOpenEditor={(sec) => {
            setActiveEditorSection(sec);
            setIsEditorDrawerOpen(true);
          }}
        >
          <ContactSection profile={profile} loggedInUser={clientUser || user} />
        </LiveVisualSectionWrapper>
      </main>

      {/* Footer */}
      <Footer
        onNavigateAdmin={handleNavigateAdmin}
        profile={profile}
      />

      {/* Floating Gemini AI Assistant Widget (Desktop Floating / Mobile Bottom Sheet) */}
      <AiAssistantWidget
        profile={profile}
        isOpen={isAiChatOpen}
        onToggle={(open) => setIsAiChatOpen(open)}
      />

      {/* Mobile-Only iOS Floating Bottom Navigation Dock */}
      <MobileBottomNav
        onOpenChat={() => setIsAiChatOpen(true)}
        onOpenQuickContact={() => setIsMobileContactOpen(true)}
      />

      {/* Mobile-Only Quick Contact Sheet (WhatsApp, Call, Email, Resume, Share) */}
      <MobileQuickContactSheet
        isOpen={isMobileContactOpen}
        onClose={() => setIsMobileContactOpen(false)}
        profile={profile}
        onNavigateAdmin={handleNavigateAdmin}
      />

      {/* Live Visual In-Page Inspector Drawer */}
      {isEditMode && (
        <LiveEditorDrawer
          isOpen={isEditorDrawerOpen}
          onClose={() => setIsEditorDrawerOpen(false)}
          activeSection={activeEditorSection}
          onSelectSection={(sec) => setActiveEditorSection(sec)}
          profile={profile}
          onUpdateProfile={handleUpdateProfileFromEditor}
          projects={projects}
          onUpdateProjects={handleUpdateProjectsFromEditor}
          skills={skills}
          onUpdateSkills={handleUpdateSkillsFromEditor}
          onSaveLiveChanges={handleSaveLiveChanges}
          isLiveSaving={isLiveSaving}
          hasUnsavedChanges={hasLiveEditorUnsavedChanges}
        />
      )}

      {/* Visual In-Page Image Cropper & Scaler Modal */}
      <ImageCropModal
        isOpen={cropperState.isOpen}
        imageSrc={cropperState.imageSrc}
        originalFile={cropperState.originalFile}
        title={cropperState.title}
        defaultAspect={cropperState.defaultAspect}
        onClose={() => setCropperState((prev) => ({ ...prev, isOpen: false, onApply: null }))}
        onApply={handleCropperApply}
      />
    </div>
  </VisualEditorContext.Provider>
  );
}
