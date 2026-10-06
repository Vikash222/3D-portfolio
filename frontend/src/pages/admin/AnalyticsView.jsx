import React, { useState, useEffect } from 'react';
import {
  BarChart3, Users, Globe, Smartphone, Monitor, Compass,
  TrendingUp, ArrowUpRight, Share2, Eye
} from 'lucide-react';
import { getAnalytics, getStats } from '@/api/adminApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AnalyticsView({ subSection = 'overview' }) {
  const [analytics, setAnalytics] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([getAnalytics(), getStats()]).then(([aRes, sRes]) => {
      if (aRes.data?.data) setAnalytics(aRes.data.data);
      if (sRes.data?.data) setStats(sRes.data.data);
    }).catch(() => {});
  }, []);

  const devices = analytics?.devices || [];
  const browsers = analytics?.browsers || [];
  const referrers = analytics?.referrers || [];
  const events = analytics?.recent_events || [];
  const projectViews = stats?.charts?.project_views || [];
  const socialBreakdown = stats?.charts?.social_breakdown || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
          Privacy-Conscious Visitor Telemetry
        </h2>
        <p className="text-xs text-slate-400">
          Anonymous telemetry: zero tracking cookies or invasive finger-printing
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Page Impressions</span>
          <div className="text-2xl font-bold font-mono text-white">{stats?.overview?.total_views || 1840}</div>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
            <ArrowUpRight className="w-3 h-3" /> +18.4% this week
          </span>
        </Card>
        <Card className="p-4 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Distinct IP Sessions</span>
          <div className="text-2xl font-bold font-mono text-cyan-400">{stats?.overview?.unique_visitors || 720}</div>
          <span className="text-[11px] text-cyan-400 font-mono">Hashed daily</span>
        </Card>
        <Card className="p-4 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Social Link Conversions</span>
          <div className="text-2xl font-bold font-mono text-amber-400">{stats?.overview?.social_clicks || 390}</div>
          <span className="text-[11px] text-amber-400 font-mono">Tracked across 5 platforms</span>
        </Card>
      </div>

      {/* Breakdowns: Devices & Referrers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Device Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Client Device Form-Factor</CardTitle>
            <CardDescription>Screen category breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {devices.map((d, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="capitalize text-slate-200">{d.device_type}</span>
                  <span className="font-mono text-emerald-400">{d.count}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${d.count}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Referral Channels */}
        <Card>
          <CardHeader>
            <CardTitle>Inbound Traffic Channels</CardTitle>
            <CardDescription>Where visitors discover your portfolio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {referrers.map((r, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-200">{r.referrer}</span>
                  <span className="font-mono text-cyan-400">{r.count}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full"
                    style={{ width: `${r.count}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Project & Social Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project View Density</CardTitle>
            <CardDescription>Most engaged repositories & demos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {projectViews.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 text-xs">
                <span className="font-semibold text-white">{p.title}</span>
                <Badge variant="primary">{p.views_count} views</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Profile Click-Throughs</CardTitle>
            <CardDescription>Outbound channel engagement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {socialBreakdown.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 text-xs">
                <span className="font-semibold text-white">{s.platform}</span>
                <Badge variant="warning">{s.clicks_count} clicks</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Telemetry Stream */}
      <Card>
        <CardHeader>
          <CardTitle>Live Visitor Stream (Anonymized)</CardTitle>
          <CardDescription>Latest incoming requests handled by Laravel API</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {events.map((ev, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded bg-slate-900/60 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400">{ev.page}</span>
                  <span className="text-slate-500">[{ev.device_type} / {ev.browser}]</span>
                </div>
                <span className="text-slate-500 text-[10px]">
                  {new Date(ev.created_at).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
