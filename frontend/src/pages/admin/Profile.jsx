import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getProfile, updateProfile } from '../../api/adminApi';
import toast from 'react-hot-toast';

export default function Profile() {
  const [profile, setProfile] = useState({
    availability: '',
    heroHeadline: '',
    resumeUrl: '',
    focusTopic: '',
    githubUrl: '',
    linkedinUrl: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProfile().then(res => {
      if (res.data) setProfile(res.data);
    }).catch(err => {
      toast.error('FAILED TO FETCH PROFILE');
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(profile);
      toast.success('PROFILE UPDATED SECURELY');
    } catch (err) {
      toast.error('UPDATE FAILED');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="border border-[#33ff33] p-4 max-w-2xl mx-auto">
        <div className="border-b border-[#33ff33] pb-2 mb-4 font-bold uppercase text-[#ffcc00]">
          [03] LIVE EDIT / QUICK OVERWRITE · DB.PROFILES
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase font-bold">AVAILABILITY STATUS:</label>
            <select 
              name="availability" 
              value={profile.availability} 
              onChange={handleChange}
              className="bg-[#0a0f0a] border border-[#33ff33] text-[#33ff33] px-3 py-2 font-mono focus:outline-none focus:ring-1 focus:ring-[#33ff33]"
            >
              <option value="AVAILABLE">AVAILABLE FOR HIRE / INTERNSHIPS</option>
              <option value="BUSY">CURRENTLY EMPLOYED / BUSY</option>
              <option value="UNAVAILABLE">UNAVAILABLE</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase font-bold">HERO HEADLINE / BIO LEAD:</label>
            <textarea 
              name="heroHeadline" 
              value={profile.heroHeadline || ''} 
              onChange={handleChange}
              rows="3"
              className="bg-[#0a0f0a] border border-[#33ff33] text-[#33ff33] px-3 py-2 font-mono focus:outline-none focus:ring-1 focus:ring-[#33ff33]"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase font-bold">FOCUS TOPIC:</label>
              <input 
                type="text" 
                name="focusTopic" 
                value={profile.focusTopic || ''} 
                onChange={handleChange}
                className="bg-[#0a0f0a] border border-[#33ff33] text-[#33ff33] px-3 py-2 font-mono focus:outline-none focus:ring-1 focus:ring-[#33ff33]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase font-bold">EMAIL:</label>
              <input 
                type="email" 
                name="email" 
                value={profile.email || ''} 
                onChange={handleChange}
                className="bg-[#0a0f0a] border border-[#33ff33] text-[#33ff33] px-3 py-2 font-mono focus:outline-none focus:ring-1 focus:ring-[#33ff33]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase font-bold">GITHUB URL:</label>
              <input 
                type="url" 
                name="githubUrl" 
                value={profile.githubUrl || ''} 
                onChange={handleChange}
                className="bg-[#0a0f0a] border border-[#33ff33] text-[#33ff33] px-3 py-2 font-mono focus:outline-none focus:ring-1 focus:ring-[#33ff33]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase font-bold">LINKEDIN URL:</label>
              <input 
                type="url" 
                name="linkedinUrl" 
                value={profile.linkedinUrl || ''} 
                onChange={handleChange}
                className="bg-[#0a0f0a] border border-[#33ff33] text-[#33ff33] px-3 py-2 font-mono focus:outline-none focus:ring-1 focus:ring-[#33ff33]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 border-t border-dashed border-[#33ff33] pt-4 mt-2">
            <label className="text-xs uppercase font-bold">RESUME PDF URL:</label>
            <input 
              type="text" 
              name="resumeUrl" 
              value={profile.resumeUrl || ''} 
              onChange={handleChange}
              className="bg-[#0a0f0a] border border-[#33ff33] text-[#33ff33] px-3 py-2 font-mono focus:outline-none focus:ring-1 focus:ring-[#33ff33]"
            />
            <div className="text-xs text-[#ffcc00] mt-1">OR UPLOAD NEW FILE (NOT IMPLEMENTED YET)</div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="border border-[#33ff33] text-[#33ff33] hover:bg-[#33ff33] hover:text-[#0a0f0a] px-3 py-3 uppercase font-bold transition-colors mt-4"
          >
            {loading ? 'COMMITTING...' : '[ COMMIT CHANGES TO DB ]'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
