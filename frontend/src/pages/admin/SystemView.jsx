import React, { useState, useEffect } from 'react';
import {
  Users, History, Database, Settings, ShieldCheck, Download,
  Upload, Save, AlertTriangle, CheckCircle2, Lock, Smartphone,
  KeyRound, Copy, Check, QrCode
} from 'lucide-react';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import {
  getAdminUsers, updateAdminUserRole, getActivityLogs,
  exportBackup, restoreBackup, getProfile, updateProfile,
  updateAdminAccount, get2FaStatus, setup2Fa, confirm2Fa, disable2Fa
} from '@/api/adminApi';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';

export default function SystemView({ section = 'users' }) {
  const [users, setUsers] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [restoreJson, setRestoreJson] = useState('');

  const { user: authUser, setAuth } = useAuthStore();
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingAccount, setSavingAccount] = useState(false);

  // 2FA state
  const [twoFactorStatus, setTwoFactorStatus] = useState({ enabled: false, recovery_codes: [] });
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [setupData, setSetupData] = useState(null);
  const [confirmCode, setConfirmCode] = useState('');
  const [confirming2Fa, setConfirming2Fa] = useState(false);
  const [recoveryCodesModalOpen, setRecoveryCodesModalOpen] = useState(false);
  const [newRecoveryCodes, setNewRecoveryCodes] = useState([]);
  const [disableModalOpen, setDisableModalOpen] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');
  const [disabling2Fa, setDisabling2Fa] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);

  useEffect(() => {
    if (authUser) {
      setAdminName(authUser.name || '');
      setAdminEmail(authUser.email || '');
    }
  }, [authUser]);

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
        try {
          const twoFaRes = await get2FaStatus();
          if (twoFaRes.data?.data) setTwoFactorStatus(twoFaRes.data.data);
        } catch (_) {}
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

  const handleUpdateAccount = async (e) => {
    e?.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      return toast.error('New passwords do not match');
    }
    if (newPassword && !currentPassword) {
      return toast.error('Please enter current password to set a new password');
    }
    try {
      setSavingAccount(true);
      const payload = {
        name: adminName,
        email: adminEmail,
      };
      if (currentPassword && newPassword) {
        payload.current_password = currentPassword;
        payload.new_password = newPassword;
      }
      const res = await updateAdminAccount(payload);
      if (res.data?.success) {
        toast.success('Admin credentials updated successfully!');
        if (res.data?.data) {
          setAuth(useAuthStore.getState().token, res.data.data);
        }
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(res.data?.message || 'Failed to update credentials');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update credentials');
    } finally {
      setSavingAccount(false);
    }
  };

  const handleStart2FaSetup = async () => {
    try {
      const res = await setup2Fa();
      if (res.data?.data) {
        setSetupData(res.data.data);
        setConfirmCode('');
        setCopiedSecret(false);
        setSetupModalOpen(true);
      }
    } catch (e) {
      toast.error('Failed to initiate 2FA setup');
    }
  };

  const handleCopySecret = () => {
    if (setupData?.secret) {
      navigator.clipboard.writeText(setupData.secret);
      setCopiedSecret(true);
      toast.success('Secret key copied to clipboard!');
      setTimeout(() => setCopiedSecret(false), 2000);
    }
  };

  const handleConfirm2Fa = async (e) => {
    e?.preventDefault();
    if (!confirmCode || confirmCode.trim().length !== 6) {
      return toast.error('Please enter the 6-digit code from Microsoft Authenticator');
    }
    try {
      setConfirming2Fa(true);
      const res = await confirm2Fa(confirmCode.trim());
      if (res.data?.success) {
        toast.success('Microsoft Authenticator 2-FA enabled successfully!');
        setSetupModalOpen(false);
        setTwoFactorStatus({
          enabled: true,
          recovery_codes: res.data.data?.recovery_codes || [],
        });
        setNewRecoveryCodes(res.data.data?.recovery_codes || []);
        setRecoveryCodesModalOpen(true);
      } else {
        toast.error(res.data?.message || 'Invalid code');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid code. Verify time synchronization in Microsoft Authenticator.');
    } finally {
      setConfirming2Fa(false);
    }
  };

  const handleDisable2Fa = async (e) => {
    e?.preventDefault();
    if (!disablePassword) {
      return toast.error('Please enter your password to disable 2FA');
    }
    try {
      setDisabling2Fa(true);
      const res = await disable2Fa(disablePassword);
      if (res.data?.success) {
        toast.success('2FA has been disabled');
        setTwoFactorStatus({ enabled: false, recovery_codes: [] });
        setDisableModalOpen(false);
        setDisablePassword('');
      } else {
        toast.error(res.data?.message || 'Failed to disable 2FA');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Incorrect password');
    } finally {
      setDisabling2Fa(false);
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

          {/* Admin Account & Security Card */}
          <Card className="space-y-4">
            <CardHeader className="pb-3 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Admin Login Credentials & Security
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Change your admin login email address or set a new password
                  </CardDescription>
                </div>
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-[10px]">
                  SECURE ACCESS
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <form onSubmit={handleUpdateAccount} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Admin Name</label>
                    <Input
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      placeholder="Vikash Kumar"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Admin Email (Login ID)</label>
                    <Input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@mrvikash.in"
                      required
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <span className="text-xs font-semibold text-slate-300 block">Change Password (Leave blank to keep current)</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Current Password</label>
                      <Input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Current password"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">New Password</label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min 6 characters"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Confirm New Password</label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat new password"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={savingAccount} variant="default" size="sm">
                    <Save className="w-3.5 h-3.5" />
                    {savingAccount ? 'Saving...' : 'Update Admin Credentials'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Microsoft Authenticator 2-Factor Authentication (2FA) Card */}
          <Card className="space-y-4">
            <CardHeader className="pb-3 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-cyan-400" />
                    Microsoft Authenticator 2-Factor Authentication (2FA)
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Secure admin login with 6-digit Time-Based One-Time Passwords (TOTP)
                  </CardDescription>
                </div>
                {twoFactorStatus.enabled ? (
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> 2FA ACTIVE
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-amber-500/30 text-amber-400 bg-amber-500/10 text-[10px]">
                    2FA NOT ENABLED
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {twoFactorStatus.enabled ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-emerald-300">Account Protected</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Whenever you sign in, you will be prompted for a 6-digit code from Microsoft Authenticator.
                      </p>
                    </div>
                  </div>

                  {twoFactorStatus.recovery_codes?.length > 0 && (
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                          <KeyRound className="w-3.5 h-3.5 text-amber-400" /> Backup Recovery Codes
                        </span>
                        <span className="text-[10px] text-slate-500">{twoFactorStatus.recovery_codes.length} remaining</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        If you lose access to Microsoft Authenticator, use one of these single-use codes to sign in:
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-xs">
                        {twoFactorStatus.recovery_codes.map((code, idx) => (
                          <div key={idx} className="p-1.5 rounded bg-slate-950 border border-slate-800 text-center text-slate-300">
                            {code}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={() => {
                        setDisablePassword('');
                        setDisableModalOpen(true);
                      }}
                      variant="danger"
                      size="sm"
                    >
                      Disable 2-Factor Authentication
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-white">Enable Microsoft Authenticator</h4>
                    <p className="text-xs text-slate-400 max-w-lg">
                      Scan a QR code using Microsoft Authenticator (iOS/Android) or any standard TOTP app. Login will require both password and a 6-digit code.
                    </p>
                  </div>
                  <Button
                    onClick={handleStart2FaSetup}
                    variant="default"
                    size="sm"
                    className="shrink-0 font-semibold"
                  >
                    <Smartphone className="w-4 h-4 mr-1.5" />
                    Setup 2-FA (Microsoft)
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* 2FA Setup Modal */}
      <Dialog
        open={setupModalOpen}
        onClose={() => setSetupModalOpen(false)}
        title="Setup Microsoft Authenticator (2FA)"
      >
        {setupData && (
          <div className="space-y-5">
            <div className="text-xs text-slate-300 space-y-1">
              <p><strong>Step 1:</strong> Open <strong>Microsoft Authenticator</strong> on your phone.</p>
              <p><strong>Step 2:</strong> Tap <strong>+ (Add Account)</strong> → <strong>Other (Google, Facebook, etc.)</strong>.</p>
              <p><strong>Step 3:</strong> Scan the QR code below:</p>
            </div>

            <div className="flex justify-center p-4 bg-white rounded-xl w-fit mx-auto shadow-lg">
              <QRCodeSVG
                value={setupData.qr_data || setupData.otpauth_uri}
                size={180}
                level="M"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-400 block">Can't scan? Enter this Secret Key manually:</label>
              <div className="flex items-center gap-2">
                <Input
                  value={setupData.secret}
                  readOnly
                  className="font-mono text-xs select-all bg-slate-900"
                />
                <Button
                  onClick={handleCopySecret}
                  variant="outline"
                  size="sm"
                  type="button"
                  className="shrink-0"
                >
                  {copiedSecret ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </Button>
              </div>
            </div>

            <form onSubmit={handleConfirm2Fa} className="pt-2 border-t border-slate-800 space-y-3">
              <label className="text-xs text-slate-300 font-medium block">
                <strong>Step 4:</strong> Enter the 6-digit code from Microsoft Authenticator to verify:
              </label>
              <Input
                type="text"
                value={confirmCode}
                onChange={(e) => setConfirmCode(e.target.value)}
                placeholder="123456"
                maxLength={6}
                className="font-mono text-center tracking-widest text-lg font-bold"
                autoFocus
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  onClick={() => setSetupModalOpen(false)}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={confirming2Fa}
                  variant="default"
                  size="sm"
                >
                  {confirming2Fa ? 'Verifying...' : 'Confirm & Activate 2FA'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </Dialog>

      {/* Recovery Codes Modal (Shown right after successful activation) */}
      <Dialog
        open={recoveryCodesModalOpen}
        onClose={() => setRecoveryCodesModalOpen(false)}
        title="2FA Activated! Save Your Recovery Codes"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Save these single-use recovery codes in a safe place. If you ever lose your phone, you will need these to log in.</span>
          </div>

          <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-center text-slate-200">
            {newRecoveryCodes.map((code, idx) => (
              <div key={idx} className="p-1.5 bg-slate-900 rounded border border-slate-800">
                {code}
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={() => {
                navigator.clipboard.writeText(newRecoveryCodes.join('\n'));
                toast.success('Recovery codes copied!');
                setRecoveryCodesModalOpen(false);
              }}
              variant="default"
              size="sm"
            >
              <Copy className="w-3.5 h-3.5 mr-1" /> Copy Codes & Finish
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Disable 2FA Modal */}
      <Dialog
        open={disableModalOpen}
        onClose={() => setDisableModalOpen(false)}
        title="Disable Microsoft Authenticator"
      >
        <form onSubmit={handleDisable2Fa} className="space-y-4">
          <p className="text-xs text-slate-400">
            Enter your admin password to confirm disabling Two-Factor Authentication.
          </p>

          <div>
            <label className="text-xs text-slate-300 block mb-1">Admin Password</label>
            <Input
              type="password"
              value={disablePassword}
              onChange={(e) => setDisablePassword(e.target.value)}
              placeholder="Enter current password"
              autoFocus
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button
              type="button"
              onClick={() => setDisableModalOpen(false)}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={disabling2Fa}
              variant="danger"
              size="sm"
            >
              {disabling2Fa ? 'Disabling...' : 'Confirm Disable 2FA'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
