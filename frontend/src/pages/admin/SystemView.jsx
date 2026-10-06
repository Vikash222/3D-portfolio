import React, { useState, useEffect } from 'react';
import {
  Users, History, Database, Settings, ShieldCheck, Download,
  Upload, Save, AlertTriangle, CheckCircle2, Lock
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getAdminUsers, updateAdminUserRole, getActivityLogs,
  exportBackup, restoreBackup, getProfile, updateProfile
} from '@/api/adminApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

export default function SystemView({ section = 'users' }) {
  const [users, setUsers] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [restoreJson, setRestoreJson] = useState('');

  useEffect(() => {
    loadData();
  }, [section]);

  const loadData = async () => {
    try {
      if (section === 'users') {
        const res = await getAdminUsers();
        if (res.data?.data) setUsers(res.data.data);
      } else if (section === 'activity-logs') {
        const res = await getActivityLogs();
        if (res.data?.data) setActivityLogs(res.data.data.data || res.data.data || []);
      } else if (section === 'settings') {
        const res = await getProfile();
        if (res.data?.data) setProfile(res.data.data);
      }
    } catch (e) {
      toast.error('Failed to load system settings');
    }
  };

  const handleExportBackup = async () => {
    try {
      const res = await exportBackup();
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(res.data));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `portfolio-database-backup-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success('Database backup exported!');
    } catch (e) {
      toast.error('Backup export failed');
    }
  };

  const handleRestoreBackup = async () => {
    if (!restoreJson.trim()) {
      toast.error('Please paste or select a JSON backup file');
      return;
    }
    if (!confirm('Are you sure you want to restore the database from this backup?')) return;

    try {
      await restoreBackup(JSON.parse(restoreJson));
      toast.success('Database successfully restored from backup!');
      setRestoreJson('');
    } catch (e) {
      toast.error('Failed to restore backup: Invalid JSON');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setRestoreJson(event.target.result);
      toast.success('Backup file loaded into staging. Click "Restore Database" to apply.');
    };
    reader.readAsText(file);
  };

  const handleSaveSettings = async () => {
    if (!profile) return;
    try {
      await updateProfile({ site_settings: profile.site_settings });
      toast.success('Global site settings updated!');
    } catch (e) {
      toast.error('Failed to save settings');
    }
  };

  return (
    <div className="space-y-6">
      {/* ===================== USERS & ROLES ===================== */}
      {section === 'users' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              Administrative Users & RBAC Roles
            </h2>
            <p className="text-xs text-slate-400">Manage permission tiers: Super Admin, Editor, Moderator, Viewer</p>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono">
                  <tr>
                    <th className="p-3.5">User</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Assigned Role</th>
                    <th className="p-3.5">Last Authenticated</th>
                    <th className="p-3.5 text-right">Role Management</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-900/40">
                      <td className="p-3.5 font-bold text-white flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-[10px]">
                          {u.name.slice(0, 2).toUpperCase()}
                        </div>
                        {u.name}
                      </td>
                      <td className="p-3.5 text-slate-300 font-mono">{u.email}</td>
                      <td className="p-3.5">
                        <Badge variant={u.role === 'admin' || u.role === 'super_admin' ? 'default' : 'secondary'}>
                          {u.role.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-3.5 text-slate-400 font-mono">
                        {u.last_login_at ? new Date(u.last_login_at).toLocaleString() : 'Never'}
                      </td>
                      <td className="p-3.5 text-right">
                        <select
                          value={u.role}
                          onChange={async (e) => {
                            await updateAdminUserRole(u.id, e.target.value);
                            toast.success(`Role updated to ${e.target.value}`);
                            loadData();
                          }}
                          className="bg-slate-800 text-slate-200 text-xs rounded-lg px-2 py-1 border border-slate-700"
                        >
                          <option value="super_admin">Super Admin</option>
                          <option value="admin">Admin</option>
                          <option value="editor">Editor</option>
                          <option value="moderator">Moderator</option>
                          <option value="viewer">Viewer</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ===================== ACTIVITY LOGS ===================== */}
      {section === 'activity-logs' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-emerald-400" />
              Audit Trail & Security Logs
            </h2>
            <p className="text-xs text-slate-400">Chronological history of all admin actions and database mutations</p>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono">
                  <tr>
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">Actor</th>
                    <th className="p-3.5">Action Code</th>
                    <th className="p-3.5">Details</th>
                    <th className="p-3.5">Client IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {activityLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-900/40">
                      <td className="p-3.5 text-slate-400 font-mono whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="p-3.5 font-semibold text-white">{log.user_name}</td>
                      <td className="p-3.5">
                        <Badge variant="primary">{log.action}</Badge>
                      </td>
                      <td className="p-3.5 text-slate-300">{log.details}</td>
                      <td className="p-3.5 font-mono text-slate-500 text-[11px]">{log.ip_address || '127.0.0.1'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ===================== BACKUP & RESTORE ===================== */}
      {section === 'backup' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              Database Backup & Disaster Recovery
            </h2>
            <p className="text-xs text-slate-400">Export complete JSON snapshots of all portfolio tables and restore on demand</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="space-y-4 p-6 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white">Manual Export Snapshot</h3>
                <p className="text-xs text-slate-400">
                  Downloads all profiles, projects, skills, experiences, educations, certificates, reviews, and settings as a secure JSON archive.
                </p>
              </div>
              <Button onClick={handleExportBackup} variant="default" size="default">
                <Download className="w-4 h-4" /> Download Backup Archive
              </Button>
            </Card>

            <Card className="space-y-4 p-6">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white">Restore from Backup Archive</h3>
                <p className="text-xs text-slate-400">
                  Load a previously exported JSON backup file to overwrite/restore database contents.
                </p>
              </div>

              <input type="file" accept=".json" onChange={handleFileSelect} className="text-xs text-slate-400" />

              <Textarea
                rows={4}
                value={restoreJson}
                onChange={(e) => setRestoreJson(e.target.value)}
                placeholder="Or paste backup JSON content here..."
                className="font-mono text-[11px]"
              />

              <Button onClick={handleRestoreBackup} variant="danger" size="default" className="w-full">
                <Upload className="w-4 h-4" /> Restore Database
              </Button>
            </Card>
          </div>
        </div>
      )}

      {/* ===================== GLOBAL SETTINGS ===================== */}
      {section === 'settings' && profile && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-emerald-400" />
                Global Portfolio Settings
              </h2>
              <p className="text-xs text-slate-400">Maintenance mode, visitor visibility, and copyright branding</p>
            </div>
            <Button onClick={handleSaveSettings} variant="default" size="sm">
              <Save className="w-3.5 h-3.5" /> Save Global Settings
            </Button>
          </div>

          <Card className="space-y-4">
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Site Title</label>
                <Input
                  value={profile.site_settings?.site_name || 'Vikash Kumar Portfolio'}
                  onChange={(e) => setProfile({
                    ...profile,
                    site_settings: { ...profile.site_settings, site_name: e.target.value }
                  })}
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Footer Copyright Line</label>
                <Input
                  value={profile.site_settings?.copyright_text || 'Vikash Kumar © 2025. All Rights Reserved.'}
                  onChange={(e) => setProfile({
                    ...profile,
                    site_settings: { ...profile.site_settings, copyright_text: e.target.value }
                  })}
                />
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-3">
                <Switch
                  checked={profile.site_settings?.maintenance_mode || false}
                  onChange={(val) => setProfile({
                    ...profile,
                    site_settings: { ...profile.site_settings, maintenance_mode: val }
                  })}
                  label="Enable Maintenance Mode (Hides public pages from visitors)"
                />
                <Switch
                  checked={profile.site_settings?.coming_soon || false}
                  onChange={(val) => setProfile({
                    ...profile,
                    site_settings: { ...profile.site_settings, coming_soon: val }
                  })}
                  label="Coming Soon Mode Banner"
                />
                <Switch
                  checked={profile.site_settings?.enable_reviews !== false}
                  onChange={(val) => setProfile({
                    ...profile,
                    site_settings: { ...profile.site_settings, enable_reviews: val }
                  })}
                  label="Allow visitors to submit testimonials on public portfolio"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
