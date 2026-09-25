import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminGetProjects, adminDeleteProject, adminTogglePin } from '../../api/projectApi';
import toast from 'react-hot-toast';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await adminGetProjects();
      setProjects(res.data || []);
    } catch (err) {
      toast.error('FAILED TO FETCH PROJECTS');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('CONFIRM DELETION OF PROJECT? THIS CANNOT BE UNDONE.')) {
      try {
        await adminDeleteProject(id);
        toast.success('PROJECT DELETED');
        fetchProjects();
      } catch (err) {
        toast.error('DELETION FAILED');
      }
    }
  };

  const handleTogglePin = async (id) => {
    try {
      await adminTogglePin(id);
      fetchProjects();
    } catch (err) {
      toast.error('TOGGLE FAILED');
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row gap-4 h-full">
        <div className="flex-1 flex flex-col border border-[#33ff33] p-4">
          <div className="border-b border-[#33ff33] pb-2 mb-3 font-bold uppercase flex justify-between items-center">
            <span>[01] PROJECTS CMS · {projects.length} ITEMS REGISTERED</span>
            <button className="border border-[#33ff33] text-[#33ff33] hover:bg-[#33ff33] hover:text-[#0a0f0a] px-3 py-1 uppercase text-xs transition-colors">
              [+ ADD NEW]
            </button>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-xs uppercase border-b border-dashed border-[#33ff33]">
                <tr>
                  <th className="px-2 py-2 border-r border-dashed border-[#33ff33]">#</th>
                  <th className="px-2 py-2 border-r border-dashed border-[#33ff33]">TITLE / SLUG</th>
                  <th className="px-2 py-2 border-r border-dashed border-[#33ff33]">STATUS</th>
                  <th className="px-2 py-2 border-r border-dashed border-[#33ff33]">VIEWS</th>
                  <th className="px-2 py-2">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="p-4 text-center animate-pulse">FETCHING RECORDS...</td></tr>
                ) : projects.length === 0 ? (
                  <tr><td colSpan="5" className="p-4 text-center text-[#ffcc00]">NO RECORDS FOUND</td></tr>
                ) : (
                  projects.map((p, idx) => (
                    <tr key={p._id || p.id} className="border-b border-dashed border-gray-800 hover:bg-[#111a11]">
                      <td className="px-2 py-2 border-r border-dashed border-gray-800">{idx + 1}</td>
                      <td className="px-2 py-2 border-r border-dashed border-gray-800">
                        <div className="font-bold">{p.title}</div>
                        <div className="text-xs opacity-70">{p.slug || 'no-slug'} {p.pinned && <span className="text-[#ffcc00]">[PINNED]</span>}</div>
                      </td>
                      <td className="px-2 py-2 border-r border-dashed border-gray-800">
                        {p.isPublished ? <span className="text-[#33ff33]">PUBLISHED</span> : <span className="text-[#ffcc00]">DRAFT</span>}
                      </td>
                      <td className="px-2 py-2 border-r border-dashed border-gray-800">{p.views || 0}</td>
                      <td className="px-2 py-2 flex gap-2">
                        <button className="text-xs uppercase hover:text-[#ffcc00]">[EDIT]</button>
                        <button onClick={() => handleTogglePin(p._id || p.id)} className="text-xs uppercase hover:text-[#ffcc00]">[TOGGLE]</button>
                        <button onClick={() => handleDelete(p._id || p.id)} className="text-xs uppercase text-red-500 hover:text-red-400">[DEL]</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 border-t border-dashed border-[#33ff33] pt-2 flex justify-between items-center text-xs">
            <span>Rows 1-{projects.length} of {projects.length} records. Paginated.</span>
            <div className="flex gap-2">
              <button className="hover:text-[#ffcc00]">&lt;&lt; PREV</button>
              <button className="hover:text-[#ffcc00]">NEXT &gt;&gt;</button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-80 border border-[#33ff33] p-4 flex flex-col">
          <div className="border-b border-[#33ff33] pb-2 mb-3 font-bold uppercase text-[#ffcc00]">
            [03] LIVE EDIT / QUICK OVERWRITE
          </div>
          <div className="text-sm opacity-70 text-center py-8">
            SELECT A RECORD TO EDIT INLINE
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
