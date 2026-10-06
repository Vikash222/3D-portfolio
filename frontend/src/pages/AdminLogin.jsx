import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, Eye, EyeOff, Sparkles, Smartphone, KeyRound, ArrowLeft } from 'lucide-react';
import { login, verify2Fa } from '../api/adminApi';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const loginSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export default function AdminLogin() {
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState('credentials'); // 'credentials' | '2fa'
  const [challengeToken, setChallengeToken] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [verifying2Fa, setVerifying2Fa] = useState(false);

  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setErrorMsg('');
      const response = await login(data);
      const result = response.data;
      if (result.success && result.data?.requires_2fa) {
        setChallengeToken(result.data.challenge_token);
        setStep('2fa');
      } else if (result.success && result.data?.token) {
        setAuth(result.data.token, result.data.user);
        navigate('/admin');
      } else {
        setErrorMsg(result.message || 'Authentication failed');
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Invalid credentials or server offline');
    }
  };

  const handleVerify2Fa = async (e) => {
    e.preventDefault();
    if (!totpCode || totpCode.trim().length < 6) {
      return setErrorMsg('Please enter a valid 6-digit code or recovery code');
    }
    try {
      setErrorMsg('');
      setVerifying2Fa(true);
      const res = await verify2Fa({
        challenge_token: challengeToken,
        code: totpCode.trim(),
      });
      const result = res.data;
      if (result.success && result.data?.token) {
        setAuth(result.data.token, result.data.user);
        navigate('/admin');
      } else {
        setErrorMsg(result.message || 'Verification failed');
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Invalid 2FA code. Please try again.');
    } finally {
      setVerifying2Fa(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background radial glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md border-slate-800 bg-[#0d131f]/90 backdrop-blur-xl shadow-2xl relative z-10 p-2 sm:p-4">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-black font-mono font-bold text-lg mb-2">
            {step === '2fa' ? <Smartphone className="w-6 h-6 text-black" /> : 'VK'}
          </div>
          <CardTitle className="text-xl font-bold text-white tracking-tight">
            {step === '2fa' ? '2-Factor Authentication' : 'Portfolio Admin Console'}
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            {step === '2fa'
              ? 'Enter the 6-digit code from Microsoft Authenticator'
              : 'Sign in to access portfolio content management and live telemetry'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {errorMsg && (
            <div className="p-3 mb-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {errorMsg}
            </div>
          )}

          {step === 'credentials' ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address
                </label>
                <Input
                  type="email"
                  {...register('email')}
                  placeholder="admin@mrvikash.in"
                  autoComplete="email"
                  autoFocus
                />
                {errors.email && <span className="text-rose-400 text-xs">{errors.email.message}</span>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" /> Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <span className="text-rose-400 text-xs">{errors.password.message}</span>}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 h-10 font-bold"
              >
                {isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}
                <ArrowRight className="w-4 h-4" />
              </Button>

              <div className="text-center pt-2">
                <Link to="/" className="text-xs text-slate-400 hover:text-emerald-400 transition-colors">
                  ← Return to Public Portfolio
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerify2Fa} className="space-y-4">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
                <span>Protected with <strong>Microsoft Authenticator</strong>. Enter your temporary 6-digit code or backup recovery key.</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-emerald-400" /> 6-Digit TOTP or Recovery Code
                </label>
                <Input
                  type="text"
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  placeholder="123456"
                  maxLength={10}
                  className="font-mono text-center tracking-widest text-lg font-bold"
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                disabled={verifying2Fa}
                className="w-full mt-2 h-10 font-bold"
              >
                {verifying2Fa ? 'Verifying...' : 'Verify 2FA & Access Dashboard'}
                <ShieldCheck className="w-4 h-4" />
              </Button>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep('credentials');
                    setErrorMsg('');
                    setTotpCode('');
                  }}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                </button>
                <Link to="/" className="text-xs text-slate-400 hover:text-emerald-400 transition-colors">
                  Return to Home
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
