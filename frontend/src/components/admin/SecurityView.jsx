import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import {
  ShieldCheck,
  ShieldAlert,
  Key,
  Copy,
  Check,
  AlertCircle,
  RefreshCw,
  Lock,
  Smartphone,
} from 'lucide-react';
import {
  setup2Fa,
  confirm2Fa,
  disable2Fa,
  regenerateRecoveryCodes,
} from '../../services/api';

export default function SecurityView({ user, onUserUpdated }) {
  const [is2FaEnabled, setIs2FaEnabled] = useState(!!user?.two_factor_enabled);
  const [setupData, setSetupData] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [disablePassword, setDisablePassword] = useState('');
  const [isDisabling, setIsDisabling] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedRecovery, setCopiedRecovery] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

  const handleStartSetup = async () => {
    setLoading(true);
    setStatusMessage({ text: '', type: '' });
    try {
      const data = await setup2Fa();
      setSetupData(data);
    } catch (err) {
      setStatusMessage({
        text: 'Failed to initiate 2FA setup. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSetup = async (e) => {
    e.preventDefault();
    if (verificationCode.length !== 6) {
      setStatusMessage({ text: 'Please enter a 6-digit code.', type: 'error' });
      return;
    }

    setLoading(true);
    setStatusMessage({ text: '', type: '' });
    try {
      const res = await confirm2Fa(verificationCode);
      setIs2FaEnabled(true);
      setRecoveryCodes(res.recovery_codes || []);
      setSetupData(null);
      setVerificationCode('');
      setStatusMessage({
        text: '2FA has been successfully verified & enabled with Microsoft Authenticator!',
        type: 'success',
      });
      if (onUserUpdated) onUserUpdated({ ...user, two_factor_enabled: true });
    } catch (err) {
      setStatusMessage({
        text:
          err.response?.data?.message ||
          'Invalid verification code. Please check your authenticator clock.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2Fa = async (e) => {
    e.preventDefault();
    if (!disablePassword) {
      setStatusMessage({ text: 'Please enter your password to disable 2FA.', type: 'error' });
      return;
    }

    setLoading(true);
    setStatusMessage({ text: '', type: '' });
    try {
      await disable2Fa(disablePassword);
      setIs2FaEnabled(false);
      setIsDisabling(false);
      setDisablePassword('');
      setRecoveryCodes([]);
      setStatusMessage({
        text: 'Two-Factor Authentication has been disabled.',
        type: 'success',
      });
      if (onUserUpdated) onUserUpdated({ ...user, two_factor_enabled: false });
    } catch (err) {
      setStatusMessage({
        text: err.response?.data?.message || 'Password incorrect. Could not disable 2FA.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateCodes = async () => {
    setLoading(true);
    try {
      const res = await regenerateRecoveryCodes();
      setRecoveryCodes(res.recovery_codes || []);
      setStatusMessage({ text: 'New emergency recovery codes generated!', type: 'success' });
    } catch (err) {
      setStatusMessage({ text: 'Failed to regenerate codes.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, setCopied) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Security & 2FA Auth Center</h2>
        <p className="text-sm text-slate-400 mt-1">
          Configure TOTP RFC 6238 two-factor authentication via Microsoft Authenticator or Google Authenticator.
        </p>
      </div>

      {statusMessage.text && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300'
              : 'bg-red-950/40 border border-red-500/30 text-red-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <ShieldCheck className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* 2FA Status Card */}
      <div className="admin-card rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                is2FaEnabled
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              }`}
            >
              {is2FaEnabled ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Microsoft Authenticator 2FA</h3>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    is2FaEnabled
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {is2FaEnabled ? 'ENABLED & SECURED' : 'DISABLED'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Standard RFC 6238 TOTP time-based algorithm. Zero SMS cost, works 100% offline.
              </p>
            </div>
          </div>

          {!is2FaEnabled && !setupData && (
            <button
              onClick={handleStartSetup}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
            >
              <Smartphone className="w-4 h-4" />
              <span>Enable 2FA Setup</span>
            </button>
          )}

          {is2FaEnabled && !isDisabling && (
            <button
              onClick={() => setIsDisabling(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold border border-red-500/20 transition-colors cursor-pointer"
            >
              Disable 2FA
            </button>
          )}
        </div>

        {/* 2FA Setup Flow Step (QR Code & Verification) */}
        {setupData && !is2FaEnabled && (
          <div className="pt-6 border-t border-white/10 space-y-6 animate-fadeIn">
            <div className="bg-black/30 p-5 rounded-2xl border border-white/10">
              <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500 text-black flex items-center justify-center text-xs font-bold">
                  1
                </span>
                Scan QR Code with Microsoft Authenticator
              </h4>
              <p className="text-xs text-slate-400 mb-5">
                Open Microsoft Authenticator on your mobile device, tap "+" to add an account, choose "Work or school" or "Other account", and scan the QR code.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* QR Code Container */}
                <div className="p-3 bg-white rounded-2xl shadow-xl">
                  <QRCodeCanvas
                    value={setupData.otpauth_uri}
                    size={180}
                    level="H"
                    includeMargin={false}
                  />
                </div>

                <div className="flex-1 space-y-3">
                  <div>
                    <span className="text-xs text-slate-400 block font-mono mb-1">
                      OR ENTER SECRET KEY MANUALLY:
                    </span>
                    <div className="flex items-center gap-2">
                      <code className="px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-cyan-300 font-mono text-xs sm:text-sm tracking-wider flex-1 select-all break-all">
                        {setupData.secret}
                      </code>
                      <button
                        onClick={() => copyToClipboard(setupData.secret, setCopiedSecret)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                        title="Copy Secret"
                      >
                        {copiedSecret ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    Issuer: <strong>Portfolio Admin</strong> | Account: <strong>{user?.email}</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2: Confirm 6-Digit Code */}
            <form onSubmit={handleConfirmSetup} className="bg-black/30 p-5 rounded-2xl border border-white/10 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500 text-black flex items-center justify-center text-xs font-bold">
                  2
                </span>
                Verify 6-Digit Code from Authenticator
              </h4>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <input
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  required
                  className="w-48 px-4 py-2.5 rounded-xl bg-black/60 border border-cyan-500/50 text-center font-mono text-lg tracking-widest text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={loading || verificationCode.length !== 6}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
                  >
                    Confirm & Activate 2FA
                  </button>

                  <button
                    type="button"
                    onClick={() => setSetupData(null)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Disable Confirmation Form */}
        {isDisabling && is2FaEnabled && (
          <form
            onSubmit={handleDisable2Fa}
            className="p-5 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-3 animate-fadeIn"
          >
            <h4 className="text-sm font-bold text-red-300 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Confirm Password to Disable 2FA
            </h4>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <input
                type="password"
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                placeholder="Enter current password..."
                required
                className="w-full sm:w-64 px-3.5 py-2 rounded-xl bg-black/50 border border-red-500/40 text-sm text-white focus:outline-none"
              />
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold"
                >
                  Confirm Disable
                </button>
                <button
                  type="button"
                  onClick={() => setIsDisabling(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Emergency Recovery Codes Display */}
        {recoveryCodes.length > 0 && (
          <div className="p-5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                <Key className="w-4 h-4 text-cyan-400" />
                Emergency Backup Recovery Codes
              </h4>
              <button
                onClick={() => copyToClipboard(recoveryCodes.join('\n'), setCopiedRecovery)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-semibold cursor-pointer"
              >
                {copiedRecovery ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedRecovery ? 'Copied All' : 'Copy All'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Save these one-time codes in a safe place. If you lose access to Microsoft Authenticator, you can use these to log into your admin account.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              {recoveryCodes.map((code, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-black/50 border border-white/10 font-mono text-xs text-center text-slate-200 select-all"
                >
                  {code}
                </div>
              ))}
            </div>
          </div>
        )}

        {is2FaEnabled && recoveryCodes.length === 0 && (
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-slate-400">Need emergency backup codes?</span>
            <button
              onClick={handleRegenerateCodes}
              disabled={loading}
              className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate Recovery Codes</span>
            </button>
          </div>
        )}
      </div>

      {/* Security Best Practices */}
      <div className="admin-card rounded-2xl p-6 border border-white/10 space-y-3">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          Zero-Trust Security Architecture
        </h4>
        <ul className="text-xs text-slate-400 space-y-2 leading-relaxed">
          <li>&bull; Authenticator tokens expire every 30 seconds according to RFC 6238.</li>
          <li>&bull; Works offline on your smartphone even without cell signal or internet.</li>
          <li>&bull; API endpoints protected via cryptographically hashed Laravel Sanctum bearer tokens.</li>
        </ul>
      </div>
    </div>
  );
}
