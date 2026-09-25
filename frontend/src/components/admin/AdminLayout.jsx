import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getStats, logout as apiLogout } from '../../api/adminApi';
import { useAuthStore } from '../../store/authStore';

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [stats, setStats] = useState({ projects: 0, messages: 0, visits: 0 });

  useEffect(() => {
    getStats().then(res => {
      if (res.data) setStats(res.data);
    }).catch(console.error);
  }, []);

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch(e) {}
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-terminal min-h-screen bg-[#0a0f0a] text-[#33ff33] font-mono flex flex-col relative before:content-[''] before:absolute before:inset-0 before:pointer-events-none before:bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] before:bg-[length:100%_4px,3px_100%] before:z-50">
      {/* Top Status Bar */}
      <header className="border-b border-[#33ff33] p-2 text-xs flex flex-col gap-2 relative z-10">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div className="font-bold">VIKASH KUMAR // CONSOLE V2.4 [LOCAL ROOT]</div>
          <div className="hidden md:block">● DB: MySQL 8.0 · PHP 8.3 / Laravel 11 · Host: 127.0.0.1:8000 · SSL: OK · Up: 48d 16h</div>
          <div className="flex gap-2">
            <Link to="/admin/projects" className="border border-[#33ff33] text-[#33ff33] hover:bg-[#33ff33] hover:text-[#0a0f0a] px-3 py-1 uppercase text-xs transition-colors">[+ New Project]</Link>
            <button className="border border-[#33ff33] text-[#33ff33] hover:bg-[#33ff33] hover:text-[#0a0f0a] px-3 py-1 uppercase text-xs transition-colors">[Flush Cache]</button>
            <Link to="/" target="_blank" className="border border-[#33ff33] text-[#33ff33] hover:bg-[#33ff33] hover:text-[#0a0f0a] px-3 py-1 uppercase text-xs transition-colors">[✓ View Site]</Link>
            <button onClick={handleLogout} className="border border-[#33ff33] text-[#33ff33] hover:bg-[#33ff33] hover:text-[#0a0f0a] px-3 py-1 uppercase text-xs transition-colors">[Logout]</button>
          </div>
        </div>
        <div className="border-t border-dashed border-[#33ff33] pt-2 flex flex-wrap gap-4 text-[#ffcc00]">
          <span>PROJECTS: {stats.projects || 8}</span>
          <span>MESSAGES: {stats.messages || 3} ACT</span>
          <span>TOTAL VISITS: {stats.visits || '1,840'}</span>
          <span>MEM / LOAD: 382MB / 1GB</span>
          <span>PING LATENCY: 14ms</span>
          <span>AVAILABILITY: OPEN FOR INTERNSHIPS</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 relative z-10">
        <div className="mb-4 flex gap-4 text-xs border-b border-[#33ff33] pb-2">
          <Link to="/admin" className="hover:text-[#ffcc00] uppercase">[Dashboard]</Link>
          <Link to="/admin/projects" className="hover:text-[#ffcc00] uppercase">[Projects]</Link>
          <Link to="/admin/skills" className="hover:text-[#ffcc00] uppercase">[Skills]</Link>
          <Link to="/admin/messages" className="hover:text-[#ffcc00] uppercase">[Messages]</Link>
          <Link to="/admin/profile" className="hover:text-[#ffcc00] uppercase">[Profile]</Link>
        </div>
        {children}
      </main>

      {/* Footer Bar */}
      <footer className="border-t border-[#33ff33] p-2 text-xs flex justify-between items-center relative z-10">
        <div>Vikash Kumar © 2025 - Private Admin Desk</div>
        <div className="text-right">Minimalist Brutalist Webmaster Console · Response: 12ms · PHP 8.3 FastCGI</div>
      </footer>
    </div>
  );
}
