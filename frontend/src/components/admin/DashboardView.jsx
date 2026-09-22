import React, { useEffect, useState } from 'react';
import {
  Mail,
  FolderGit2,
  Cpu,
  Briefcase,
  ShieldCheck,
  ArrowUpRight,
  Clock,
  Eye,
  CheckCircle,
  AlertCircle,
  Edit3,
} from 'lucide-react';
import { getDashboardStats, toggleMessageRead } from '../../services/api';

export default function DashboardView({ onNavigate, onViewMessage, onOpenLiveEditor }) {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStatsData(data);
    } catch (err) {
      setError('Failed to fetch dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleToggleRead = async (id, e) => {
    e.stopPropagation();
    try {
      await toggleMessageRead(id);
      loadStats();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = statsData?.stats || {};
  const recentMessages = statsData?.recent_messages || [];

  const cards = [
    {
      title: 'Unread Inquiries',
      value: stats.unread_messages || 0,
      icon: Mail,
      color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30',
      action: () => onNavigate('messages'),
      highlight: (stats.unread_messages || 0) > 0,
    },
    {
      title: 'Total Messages',
      value: stats.total_messages || 0,
      icon: Mail,
      color: 'from-indigo-500/20 to-purple-500/20 text-indigo-400 border-indigo-500/30',
      action: () => onNavigate('messages'),
    },
    {
      title: 'Live Projects',
      value: stats.total_projects || 0,
      icon: FolderGit2,
      color: 'from-violet-500/20 to-pink-500/20 text-violet-400 border-violet-500/30',
      action: () => onNavigate('projects'),
    },
    {
      title: 'Active Skills',
      value: stats.total_skills || 0,
      icon: Cpu,
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
      action: () => onNavigate('skills'),
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-cyan-950/40 via-blue-950/20 to-transparent p-6 rounded-2xl border border-cyan-500/20">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Executive Dashboard</h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time portfolio management, inquiry monitoring, and in-page visual editing.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenLiveEditor}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all cursor-pointer hover:scale-105"
          >
            <Edit3 className="w-4 h-4 text-cyan-200" />
            <span>Open Live Frontend Editor</span>
          </button>

          <button
            onClick={() => onNavigate('security')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>2FA Security</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={card.action}
              className={`admin-card admin-card-hover rounded-2xl p-6 cursor-pointer relative overflow-hidden group ${
                card.highlight ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/10' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} border flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </div>
              <div className="text-3xl font-black text-white tracking-tight">{card.value}</div>
              <div className="text-xs font-medium text-slate-400 mt-1">{card.title}</div>
            </div>
          );
        })}
      </div>

      {/* Recent Contact Messages Section */}
      <div className="admin-card rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Recent Inquiries</h3>
              <p className="text-xs text-slate-400">Direct client contacts sent via public portfolio</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('messages')}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 transition-all cursor-pointer"
          >
            <span>View All Messages</span>
            <span>&rarr;</span>
          </button>
        </div>

        {recentMessages.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-500">
              <Mail className="w-6 h-6" />
            </div>
            <p className="text-slate-400 text-sm font-medium">No contact inquiries received yet.</p>
            <p className="text-xs text-slate-600">Messages submitted through the contact section will appear here in real time.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5 overflow-hidden rounded-xl border border-white/5">
            {recentMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => onViewMessage(msg)}
                className={`py-4 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.04] transition-all cursor-pointer ${
                  !msg.is_read ? 'bg-cyan-950/25 border-l-2 border-cyan-400' : ''
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center font-bold text-xs text-cyan-300 shrink-0">
                    {msg.name?.charAt(0) || 'U'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{msg.name}</span>
                      {!msg.is_read && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 shadow-xs">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1 max-w-md mt-0.5">
                      {msg.subject || msg.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                  <button
                    onClick={(e) => handleToggleRead(msg.id, e)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-cyan-300 transition-colors"
                    title={msg.is_read ? 'Mark Unread' : 'Mark Read'}
                  >
                    <CheckCircle className={`w-4 h-4 ${msg.is_read ? 'text-emerald-400' : ''}`} />
                  </button>
                  <Eye className="w-4 h-4 text-slate-500 hover:text-white" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
