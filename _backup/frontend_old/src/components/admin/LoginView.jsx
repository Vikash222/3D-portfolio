import React, { useState, useEffect } from 'react';
import {
  Lock,
  Mail,
  User,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Key,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Eye,
  EyeOff,
  Briefcase,
  Terminal,
  Phone,
} from 'lucide-react';
import {
  login,
  registerClient,
  verify2Fa,
} from '../../services/api';

export default function LoginView({
  onAdminSuccess,
  onClientSuccess,
  onBackToPortfolio,
  initialMode = 'signin', // 'signin' | 'register'
}) {
  const [tab, setTab] = useState(initialMode); // 'signin' | 'register'
  const [step, setStep] = useState('credentials'); // 'credentials' | '2fa'

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 2FA Fields
  const [challengeToken, setChallengeToken] = useState('');
  const [totpCode, setTotpCode] = useState('');

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Central dispatch: route user based on authenticated role
  const handleAuthDispatch = (user, token) => {
    if (user.role === 'admin') {
      localStorage.setItem('portfolio_admin_token', token);
      localStorage.setItem('portfolio_admin_user', JSON.stringify(user));
      if (onAdminSuccess) onAdminSuccess(user, token);
    } else {
      localStorage.setItem('portfolio_client_token', token);
      localStorage.setItem('portfolio_client_user', JSON.stringify(user));
      if (onClientSuccess) onClientSuccess(user, token);
    }
  };

  // 1. Submit Sign In (Works for BOTH Admin and Client)
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const res = await login(email, password);

      if (res.requires_2fa) {
        setChallengeToken(res.challenge_token);
        setStep('2fa');
      } else {
        handleAuthDispatch(res.user, res.token);
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Invalid email or password. Please verify your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  // 2. Submit Client Registration
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!phone.trim()) {
      setErrorMessage('Please enter your phone number.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await registerClient(name, email, password, phone);
      handleAuthDispatch(res.user, res.token);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Registration failed. This email might already be registered.'
      );
    } finally {
      setLoading(false);
    }
  };

  // 3. Submit Admin 2FA Code
  const handle2FaSubmit = async (e) => {
    e.preventDefault();
    if (!totpCode.trim()) {
      setErrorMessage('Please enter the 6-digit authentication code.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await verify2Fa(challengeToken, totpCode);
      handleAuthDispatch(res.user, res.token);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Invalid authentication code. Please check your Microsoft Authenticator app.'
      );
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-[#070305] flex items-center justify-center p-4 relative overflow-hidden selection:bg-red-600 selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-red-600/15 via-rose-600/10 to-red-950/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-4">
        {/* Top return navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToPortfolio}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-red-400 transition-colors cursor-pointer bg-white/5 hover:bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Portfolio</span>
          </button>

          <span className="text-[11px] font-mono text-red-400/90 bg-red-500/10 px-2.5 py-1 rounded-lg border border-red-500/20">
            Unified Portal
          </span>
        </div>

        {/* Main Card */}
        <div className="rounded-3xl p-6 sm:p-8 border border-white/10 bg-[#12060b]/90 backdrop-blur-2xl shadow-2xl shadow-black/90 space-y-6">
          {/* Header Branding */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 p-[1px] mx-auto shadow-xl shadow-red-600/25">
              <div className="w-full h-full bg-[#0a0306] rounded-[15px] flex items-center justify-center">
                {step === '2fa' ? (
                  <ShieldCheck className="w-6 h-6 text-emerald-400 animate-pulse" />
                ) : (
                  <Sparkles className="w-6 h-6 text-red-400" />
                )}
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {step === '2fa'
                ? 'Two-Factor Verification'
                : tab === 'signin'
                ? 'Sign In to Your Account'
                : 'Create Client Account'}
            </h2>
            <p className="text-xs text-slate-400">
              {step === '2fa'
                ? 'Enter the 6-digit TOTP code from Microsoft Authenticator'
                : tab === 'signin'
                ? 'Single login for Clients & Admin (system auto-directs your role)'
                : 'Access 1-on-1 chat, project builder, and live milestones'}
            </p>
          </div>

          {/* Feedback messages */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 2FA Challenge Step */}
          {step === '2fa' ? (
            <form onSubmit={handle2FaSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-300 font-bold uppercase">
                  6-Digit Authenticator Code
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    autoFocus
                    maxLength={6}
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white font-mono text-center tracking-[0.5em] text-lg font-bold focus:border-red-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('credentials')}
                  className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify Code ➔'}
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Mode Toggle Tabs (Sign In / Create Account) */}
              <div className="p-1 rounded-xl bg-black/40 border border-white/10 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setTab('signin');
                    setErrorMessage('');
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                    tab === 'signin'
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTab('register');
                    setErrorMessage('');
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                    tab === 'register'
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Form: Sign In vs Create Account */}
              <form
                onSubmit={tab === 'signin' ? handleSignInSubmit : handleRegisterSubmit}
                className="space-y-4"
              >
                {tab === 'register' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-mono text-slate-300 font-semibold">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe / Jane Client"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-red-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-mono text-slate-300 font-semibold">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-red-400"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono text-slate-300 font-semibold">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={tab === 'signin' ? 'admin@portfolio.local or your email' : 'you@example.com'}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-red-400"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono text-slate-300 font-semibold">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-red-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {tab === 'register' && (
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-mono text-slate-300 font-semibold">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-red-400"
                      />
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  {loading ? (
                    <span>Authenticating...</span>
                  ) : tab === 'signin' ? (
                    <>
                      <span>Sign In with Email</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Create Client Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

            </>
          )}
        </div>

        {/* Security & Role Hint Footnote */}
        <p className="text-[11px] text-center text-slate-500 font-mono">
          Secured with Laravel Sanctum tokens, SHA-256 password hashing &amp; TOTP 2FA.
        </p>
      </div>
    </div>
  );
}
