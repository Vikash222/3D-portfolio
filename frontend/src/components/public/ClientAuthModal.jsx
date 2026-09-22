import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, Shield, AlertCircle } from 'lucide-react';
import { login, registerClient } from '../../services/api';

export default function ClientAuthModal({ isOpen, onClose, onAuthSuccess, onSwitchToAdmin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      let res;
      if (isRegister) {
        res = await registerClient(name, email, password);
      } else {
        res = await login(email, password);
      }

      localStorage.setItem('portfolio_client_token', res.token);
      localStorage.setItem('portfolio_client_user', JSON.stringify(res.user));
      onAuthSuccess(res.user);
      onClose();
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Authentication failed. Please verify your details.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#12060b] text-white rounded-3xl p-8 border border-white/15 shadow-2xl shadow-red-950/60 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-400/30 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-red-500/20 text-red-400">
            <User className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            {isRegister ? 'Create Client ID' : 'Client & Recruiter Portal'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {isRegister
              ? 'Register with your email to track project requests and messages'
              : 'Sign in to access your inquiries, quotes & saved projects'}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">
                YOUR FULL NAME
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sarah Jenkins"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-sm text-white focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 placeholder-slate-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">
              WORK / PERSONAL EMAIL
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@company.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-sm text-white focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 placeholder-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">
              PASSWORD
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-sm text-white focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 placeholder-slate-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-sm shadow-xl shadow-red-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{isRegister ? 'Create Account & Continue' : 'Sign In to Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col items-center gap-3 text-xs text-slate-400">
          <div>
            {isRegister ? 'Already have an ID?' : "Don't have an ID yet?"}{' '}
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setErrorMessage('');
              }}
              className="text-red-400 font-bold hover:underline cursor-pointer"
            >
              {isRegister ? 'Sign In here' : 'Register now'}
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onSwitchToAdmin();
            }}
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-red-300 font-medium transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-red-400" />
            <span>Site Administrator? Enter 2FA Admin CMS</span>
          </button>
        </div>
      </div>
    </div>
  );
}
