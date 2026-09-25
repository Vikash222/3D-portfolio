import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminGetSkills, adminDeleteSkill } from '../../api/skillApi';
import toast from 'react-hot-toast';

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await adminGetSkills();
      setSkills(res.data || []);
    } catch (err) {
      toast.error('FAILED TO FETCH SKILLS');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('CONFIRM DELETION OF SKILL?')) {
      try {
        await adminDeleteSkill(id);
        toast.success('SKILL DELETED');
        fetchSkills();
      } catch (err) {
        toast.error('DELETION FAILED');
      }
    }
  };

  const categories = ['All', 'Languages', 'Web', 'Tools', 'Concepts'];
  const filteredSkills = filter === 'All' ? skills : skills.filter(s => s.category === filter);

  return (
    <AdminLayout>
      <div className="border border-[#33ff33] p-4">
        <div className="border-b border-[#33ff33] pb-2 mb-3 font-bold uppercase flex justify-between items-center">
          <span>SKILLS DATABASE</span>
          <button className="border border-[#33ff33] text-[#33ff33] hover:bg-[#33ff33] hover:text-[#0a0f0a] px-3 py-1 uppercase text-xs transition-colors">
            [+ ADD SKILL]
          </button>
        </div>
        
        <div className="flex gap-4 mb-4 text-sm border-b border-dashed border-[#33ff33] pb-2">
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setFilter(cat)}
              className={`uppercase ${filter === cat ? 'text-[#ffcc00] font-bold' : 'hover:text-[#ffcc00]'}`}
            >
              [{cat}]
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="text-xs uppercase border-b border-dashed border-[#33ff33]">
              <tr>
                <th className="px-2 py-2 border-r border-dashed border-[#33ff33]">#</th>
                <th className="px-2 py-2 border-r border-dashed border-[#33ff33]">SKILL NAME</th>
                <th className="px-2 py-2 border-r border-dashed border-[#33ff33]">CATEGORY</th>
                <th className="px-2 py-2 border-r border-dashed border-[#33ff33]">PROFICIENCY</th>
                <th className="px-2 py-2 border-r border-dashed border-[#33ff33]">ORDER</th>
                <th className="px-2 py-2">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="p-4 text-center animate-pulse">FETCHING RECORDS...</td></tr>
              ) : filteredSkills.length === 0 ? (
                <tr><td colSpan="6" className="p-4 text-center text-[#ffcc00]">NO RECORDS FOUND</td></tr>
              ) : (
                filteredSkills.map((s, idx) => (
                  <tr key={s._id || s.id} className="border-b border-dashed border-gray-800 hover:bg-[#111a11]">
                    <td className="px-2 py-2 border-r border-dashed border-gray-800">{idx + 1}</td>
                    <td className="px-2 py-2 border-r border-dashed border-gray-800 font-bold">{s.name}</td>
                    <td className="px-2 py-2 border-r border-dashed border-gray-800">{s.category}</td>
                    <td className="px-2 py-2 border-r border-dashed border-gray-800">
                      {'█'.repeat(s.proficiency)}{'░'.repeat(5 - s.proficiency)}
                    </td>
                    <td className="px-2 py-2 border-r border-dashed border-gray-800">{s.order || 0}</td>
                    <td className="px-2 py-2 flex gap-2">
                      <button className="text-xs uppercase hover:text-[#ffcc00]">[EDIT]</button>
                      <button onClick={() => handleDelete(s._id || s.id)} className="text-xs uppercase text-red-500 hover:text-red-400">[DEL]</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
