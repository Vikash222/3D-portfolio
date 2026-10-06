import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getStats, exportBackup } from '@/api/adminApi';
import AdminLayout from '@/components/admin/AdminLayout';

import DashboardView from './DashboardView';
import ContentView from './ContentView';
import CommunicationView from './CommunicationView';
import MediaView from './MediaView';
import WebsiteView from './WebsiteView';
import AnalyticsView from './AnalyticsView';
import SystemView from './SystemView';

export default function Dashboard() {
  const { tab } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const normalizeTab = (raw) => {
    if (!raw) return 'dashboard';
    const aliases = {
      profile: 'about',
      messages: 'inbox',
      analytics: 'analytics-overview',
      content: 'hero',
      security: 'users',
      roles: 'users',
      logs: 'activity-logs',
    };
    return aliases[raw] || raw;
  };

  const currentTab = normalizeTab(tab || searchParams.get('tab'));
  const [activeTab, setActiveTab] = useState(currentTab);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    setActiveTab(normalizeTab(tab || searchParams.get('tab')));
  }, [tab, searchParams]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    getStats()
      .then((res) => {
        if (res.data?.data) setStats(res.data.data);
      })
      .catch(() => {});
  };

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const handleExportBackup = async () => {
    try {
      const res = await exportBackup();
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(res.data));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success('Database backup archive downloaded');
    } catch (e) {
      toast.error('Backup download failed');
    }
  };

  // Group categorizer
  const isContent = ['hero', 'about', 'skills', 'projects', 'experience', 'education', 'certificates', 'achievements', 'blog', 'testimonials'].includes(activeTab);
  const isCommunication = ['inbox', 'reviews', 'notifications'].includes(activeTab);
  const isMedia = activeTab === 'media';
  const isWebsite = ['navigation', 'sections', 'theme', 'seo', 'contact', 'socials'].includes(activeTab);
  const isAnalytics = activeTab.startsWith('analytics');
  const isSystem = ['users', 'activity-logs', 'backup', 'settings'].includes(activeTab);

  return (
    <AdminLayout activeTab={activeTab} onSelectTab={handleSelectTab}>
      {activeTab === 'dashboard' && (
        <DashboardView
          stats={stats}
          onNavigate={handleSelectTab}
          onExportBackup={handleExportBackup}
        />
      )}

      {isContent && <ContentView section={activeTab} />}
      {isCommunication && <CommunicationView section={activeTab} />}
      {isMedia && <MediaView />}
      {isWebsite && <WebsiteView section={activeTab} />}
      {isAnalytics && <AnalyticsView subSection={activeTab} />}
      {isSystem && <SystemView section={activeTab} />}
    </AdminLayout>
  );
}
