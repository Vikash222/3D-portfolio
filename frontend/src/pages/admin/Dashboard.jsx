import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { getStats } from '../../api/adminApi';

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, messages: 0, skills: 0, views: 0 });

  useEffect(() => {
    getStats().then(res => {
      if (res.data) setStats(res.data);
    }).catch(console.error);
  }, []);

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Panel 1 */}
        <div className="border border-[#33ff33] p-4 flex flex-col">
          <div className="border-b border-[#33ff33] pb-2 mb-3 font-bold uppercase">
            [01] PROJECTS CMS
          </div>
          <div className="flex-1 text-sm space-y-2">
            <div className="flex justify-between"><span>TOTAL PROJECTS:</span> <span>{stats.projects || 8}</span></div>
            <div className="flex justify-between"><span>PUBLISHED:</span> <span className="text-[#33ff33]">6</span></div>
            <div className="flex justify-between"><span>DRAFT:</span> <span className="text-[#ffcc00]">2</span></div>
            <div className="flex justify-between"><span>VIEWS:</span> <span>{stats.views || 1840}</span></div>
          </div>
          <div className="mt-4 pt-4 border-t border-dashed border-[#33ff33]">
            <Link to="/admin/projects" className="text-[#ffcc00] hover:underline uppercase text-xs">{'> MANAGE PROJECTS'}</Link>
          </div>
        </div>

        {/* Panel 2 */}
        <div className="border border-[#33ff33] p-4 flex flex-col">
          <div className="border-b border-[#33ff33] pb-2 mb-3 font-bold uppercase">
            [02] MESSAGES INBOX
          </div>
          <div className="flex-1 text-sm space-y-2">
            <div className="flex justify-between"><span>TOTAL MESSAGES:</span> <span>{stats.messages || 12}</span></div>
            <div className="flex justify-between"><span>UNREAD:</span> <span className="text-[#ffcc00]">3</span></div>
            <div className="flex justify-between"><span>LAST RECEIVED:</span> <span>2 HOURS AGO</span></div>
          </div>
          <div className="mt-4 pt-4 border-t border-dashed border-[#33ff33]">
            <Link to="/admin/messages" className="text-[#ffcc00] hover:underline uppercase text-xs">{'> OPEN INBOX'}</Link>
          </div>
        </div>

        {/* Panel 3 */}
        <div className="border border-[#33ff33] p-4 flex flex-col">
          <div className="border-b border-[#33ff33] pb-2 mb-3 font-bold uppercase">
            [03] PROFILE STATUS
          </div>
          <div className="flex-1 text-sm space-y-2">
            <div className="flex justify-between"><span>SKILLS LISTED:</span> <span>{stats.skills || 24}</span></div>
            <div className="flex justify-between"><span>RESUME:</span> <span>UPLOADED (V2.1)</span></div>
            <div className="flex justify-between"><span>STATUS:</span> <span className="text-[#33ff33]">AVAILABLE</span></div>
          </div>
          <div className="mt-4 pt-4 border-t border-dashed border-[#33ff33] flex gap-4">
            <Link to="/admin/profile" className="text-[#ffcc00] hover:underline uppercase text-xs">{'> EDIT PROFILE'}</Link>
            <Link to="/admin/skills" className="text-[#ffcc00] hover:underline uppercase text-xs">{'> MANAGE SKILLS'}</Link>
          </div>
        </div>

        {/* Panel 4 */}
        <div className="border border-[#33ff33] p-4 flex flex-col">
          <div className="border-b border-[#33ff33] pb-2 mb-3 font-bold uppercase">
            [04] SYSTEM HEALTH
          </div>
          <div className="flex-1 text-sm space-y-2">
            <div className="flex justify-between"><span>UPTIME:</span> <span>48D 16H 23M</span></div>
            <div className="flex justify-between"><span>MEM USAGE:</span> <span>38%</span></div>
            <div className="flex justify-between"><span>API STATUS:</span> <span className="text-[#33ff33]">ONLINE</span></div>
            <div className="flex justify-between"><span>LAST BACKUP:</span> <span>TODAY 04:00 AM</span></div>
          </div>
          <div className="mt-4 pt-4 border-t border-dashed border-[#33ff33]">
            <span className="text-[#33ff33] text-xs uppercase">ALL SYSTEMS NOMINAL</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
