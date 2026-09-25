import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getMessages, markMessageRead, deleteMessage } from '../../api/adminApi';
import toast from 'react-hot-toast';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await getMessages();
      setMessages(res.data || []);
    } catch (err) {
      toast.error('FAILED TO FETCH MESSAGES');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleRead = async (id) => {
    try {
      await markMessageRead(id);
      fetchMessages();
    } catch (err) {
      toast.error('ACTION FAILED');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('CONFIRM DELETION OF MESSAGE?')) {
      try {
        await deleteMessage(id);
        toast.success('MESSAGE DELETED');
        fetchMessages();
      } catch (err) {
        toast.error('DELETION FAILED');
      }
    }
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <AdminLayout>
      <div className="border border-[#33ff33] p-4">
        <div className="border-b border-[#33ff33] pb-2 mb-3 font-bold uppercase flex justify-between items-center">
          <span>[02] INQUIRIES & LETTERS INBOX · {unreadCount} NEW</span>
          <div className="flex gap-2">
            <button className="border border-[#33ff33] text-[#33ff33] hover:bg-[#33ff33] hover:text-[#0a0f0a] px-3 py-1 uppercase text-xs transition-colors">
              [Mark All Read]
            </button>
            <button className="border border-[#33ff33] text-[#33ff33] hover:bg-[#33ff33] hover:text-[#0a0f0a] px-3 py-1 uppercase text-xs transition-colors">
              [Export .CSV]
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="text-xs uppercase border-b border-dashed border-[#33ff33]">
              <tr>
                <th className="px-2 py-2 border-r border-dashed border-[#33ff33]">STATUS</th>
                <th className="px-2 py-2 border-r border-dashed border-[#33ff33]">SENDER / ORIGIN</th>
                <th className="px-2 py-2 border-r border-dashed border-[#33ff33]">SUBJECT & EXCERPT</th>
                <th className="px-2 py-2 border-r border-dashed border-[#33ff33]">RECEIVED</th>
                <th className="px-2 py-2">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="p-4 text-center animate-pulse">FETCHING INBOX...</td></tr>
              ) : messages.length === 0 ? (
                <tr><td colSpan="5" className="p-4 text-center text-[#ffcc00]">INBOX EMPTY</td></tr>
              ) : (
                messages.map((m) => (
                  <tr key={m._id || m.id} className={`border-b border-dashed border-gray-800 hover:bg-[#111a11] ${!m.isRead ? 'text-[#ffcc00]' : ''}`}>
                    <td className="px-2 py-2 border-r border-dashed border-gray-800">
                      {!m.isRead ? '[NEW]' : '[READ]'}
                    </td>
                    <td className="px-2 py-2 border-r border-dashed border-gray-800">
                      <div className="font-bold">{m.name}</div>
                      <div className="text-xs opacity-70">&lt;{m.email}&gt;</div>
                    </td>
                    <td className="px-2 py-2 border-r border-dashed border-gray-800 max-w-xs truncate">
                      <div className="font-bold">{m.subject || 'NO SUBJECT'}</div>
                      <div className="text-xs opacity-70 truncate">{m.message}</div>
                    </td>
                    <td className="px-2 py-2 border-r border-dashed border-gray-800">
                      {new Date(m.createdAt).toLocaleString()}
                    </td>
                    <td className="px-2 py-2 flex gap-2">
                      <a href={`mailto:${m.email}`} className="text-xs uppercase hover:text-[#33ff33]">[REPLY]</a>
                      {!m.isRead && <button onClick={() => handleRead(m._id || m.id)} className="text-xs uppercase hover:text-[#33ff33]">[READ]</button>}
                      <button onClick={() => handleDelete(m._id || m.id)} className="text-xs uppercase text-red-500 hover:text-red-400">[DEL]</button>
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
