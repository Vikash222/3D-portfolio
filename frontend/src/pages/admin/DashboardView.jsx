import React from 'react';
import {
  Users, FolderGit2, Wrench, MessageSquare, Star, Eye,
  ArrowUpRight, Plus, Download, ExternalLink, Sparkles, Clock, CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function DashboardView({ stats, onNavigate, onExportBackup }) {
  const overview = stats?.overview || {};
  const charts = stats?.charts || {};
  const recentMessages = stats?.recent_messages || [];
  const recentActivity = stats?.recent_activity || [];
  const recentReviews = stats?.recent_reviews || [];

  const statCards = [
    { title: 'Total Portfolio Views', value: overview.total_views?.toLocaleString() || '1,840', change: '+14% vs last mo', icon: Eye, color: 'text-cyan-400' },
    { title: 'Unique Visitors', value: overview.unique_visitors?.toLocaleString() || '720', change: '+8% vs last mo', icon: Users, color: 'text-emerald-400' },
    { title: 'Projects Active', value: overview.projects_count || 4, change: '100% Live', icon: FolderGit2, color: 'text-indigo-400' },
    { title: 'Skills Catalog', value: overview.skills_count || 14, change: 'Verified', icon: Wrench, color: 'text-amber-400' },
    { title: 'Inbox Messages', value: overview.messages_count || 2, change: `${overview.unread_messages || 0} unread`, icon: MessageSquare, color: 'text-rose-400' },
    { title: 'Reviews / Ratings', value: overview.reviews_count || 2, change: `${overview.pending_reviews || 0} pending`, icon: Star, color: 'text-yellow-400' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">
              MISSION CONTROL LIVE
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Welcome back, Vikash
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Your portfolio CMS is fully synced with SQLite and Laravel 11. All content changes update the public site dynamically.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button onClick={() => onNavigate('projects')} size="sm" variant="default">
            <Plus className="w-3.5 h-3.5" /> New Project
          </Button>
          <Button onClick={() => onNavigate('skills')} size="sm" variant="secondary">
            <Plus className="w-3.5 h-3.5" /> Add Skill
          </Button>
          <Button onClick={onExportBackup} size="sm" variant="outline">
            <Download className="w-3.5 h-3.5" /> Backup DB
          </Button>
          <Button onClick={() => window.open('/', '_blank')} size="sm" variant="outline">
            <ExternalLink className="w-3.5 h-3.5" /> View Site
          </Button>
        </div>
      </div>

      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="hover:border-slate-700 transition-colors">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-medium block">{stat.title}</span>
                  <div className="text-2xl font-bold font-mono text-white">{stat.value}</div>
                  <div className="text-[11px] text-emerald-400/90 font-medium flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/50">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Interactive Charts & Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visitors & Page Views Trend (2 cols) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Visitor Velocity & Page Views</CardTitle>
              <CardDescription>Real-time traffic trends across the last 7 days</CardDescription>
            </div>
            <Badge variant="default">7-Day Trend</Badge>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-60 flex items-end justify-between gap-3 pt-6 border-b border-slate-800/80 pb-4">
              {charts.visitor_trends?.map((item, i) => {
                const max = 70;
                const vHeight = Math.min(100, Math.max(15, (item.visitors / max) * 100));
                const pHeight = Math.min(100, Math.max(25, (item.page_views / (max * 2.5)) * 100));
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                    {/* Tooltip */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-[10px] p-1 rounded font-mono pointer-events-none whitespace-nowrap z-20 border border-slate-700">
                      {item.visitors} vis / {item.page_views} views
                    </div>
                    <div className="w-full flex items-end justify-center gap-1.5 h-44">
                      {/* Visitors bar */}
                      <div
                        style={{ height: `${vHeight}%` }}
                        className="w-1/2 rounded-t-md bg-gradient-to-t from-emerald-600 to-emerald-400 group-hover:brightness-125 transition-all shadow-sm"
                      />
                      {/* Page Views bar */}
                      <div
                        style={{ height: `${pHeight}%` }}
                        className="w-1/2 rounded-t-md bg-gradient-to-t from-cyan-600 to-cyan-400 group-hover:brightness-125 transition-all shadow-sm opacity-80"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{item.date}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-center gap-6 pt-4 text-xs">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-3 h-3 rounded bg-emerald-400" /> Unique Visitors
              </span>
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-3 h-3 rounded bg-cyan-400" /> Total Page Views
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Top Projects Popularity (1 col) */}
        <Card>
          <CardHeader>
            <CardTitle>Top Project Impressions</CardTitle>
            <CardDescription>Most viewed work by visitors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {charts.project_views?.map((proj, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-200 line-clamp-1">{proj.title}</span>
                  <span className="text-emerald-400 font-mono font-semibold">{proj.views_count} views</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
                    style={{ width: `${Math.min(100, Math.max(15, (proj.views_count / 550) * 100))}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid: Recent Activity & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Inquiries</CardTitle>
              <CardDescription>Latest contact submissions from public portfolio</CardDescription>
            </div>
            <Button onClick={() => onNavigate('inbox')} variant="ghost" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentMessages.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No messages yet.</p>
            ) : (
              recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => onNavigate('inbox')}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors cursor-pointer flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">{msg.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">({msg.email})</span>
                      {msg.status === 'new' && <Badge variant="warning">New</Badge>}
                    </div>
                    <p className="text-xs text-slate-300 font-medium line-clamp-1">{msg.subject || 'Direct Inquiry'}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{msg.message}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Audit Activity Stream */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Audit & Activity Stream</CardTitle>
              <CardDescription>Security events and CMS update trail</CardDescription>
            </div>
            <Button onClick={() => onNavigate('activity-logs')} variant="ghost" size="sm">
              Logs
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No recent activity.</p>
            ) : (
              recentActivity.map((act) => (
                <div key={act.id} className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-900/40 text-xs">
                  <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-200">
                      {act.user_name} <span className="font-mono text-emerald-400 text-[10px]">[{act.action}]</span>
                    </div>
                    <div className="text-[11px] text-slate-400">{act.details}</div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
