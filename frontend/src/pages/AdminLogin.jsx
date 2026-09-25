import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/adminApi';
import { useAuthStore } from '../store/authStore';

const loginSchema = z.object({
  email: z.string().email({ message: "INVALID EMAIL ADDRESS" }),
  password: z.string().min(6, { message: "PASSWORD MUST BE AT LEAST 6 CHARACTERS" })
});

export default function AdminLogin() {
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    try {
      setErrorMsg('');
      const response = await login(data);
      if (response.data.token) {
        setAuth(response.data.token, response.data.admin);
        navigate('/admin');
      } else {
        setErrorMsg('AUTH FAILED: INVALID CREDENTIALS');
      }
    } catch (error) {
      setErrorMsg('AUTH ERROR: ' + (error.response?.data?.message || 'SYSTEM FAILURE'));
    }
  };

  return (
    <div className="admin-terminal min-h-screen bg-[#0a0f0a] text-[#33ff33] font-mono flex items-center justify-center p-4 relative before:content-[''] before:absolute before:inset-0 before:pointer-events-none before:bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] before:bg-[length:100%_4px,3px_100%] before:z-50">
      <div className="border border-[#33ff33] p-8 max-w-md w-full relative z-10 bg-[#0a0f0a]">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-bold uppercase tracking-widest border-b border-[#33ff33] pb-4">
            VIKASH KUMAR // ADMIN CONSOLE
          </h1>
          <div className="mt-4 animate-pulse">AWAITING CREDENTIALS_</div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {errorMsg && (
            <div className="text-red-500 border border-red-500 p-2 text-sm uppercase">
              {errorMsg}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm uppercase font-bold">EMAIL:</label>
            <input 
              type="email" 
              {...register('email')}
              className="bg-[#0a0f0a] border border-[#33ff33] text-[#33ff33] px-3 py-2 font-mono focus:outline-none focus:ring-1 focus:ring-[#33ff33]"
              autoComplete="email"
              autoFocus
            />
            {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm uppercase font-bold">PASSWORD:</label>
            <input 
              type="password" 
              {...register('password')}
              className="bg-[#0a0f0a] border border-[#33ff33] text-[#33ff33] px-3 py-2 font-mono focus:outline-none focus:ring-1 focus:ring-[#33ff33]"
              autoComplete="current-password"
            />
            {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="border border-[#33ff33] text-[#33ff33] hover:bg-[#33ff33] hover:text-[#0a0f0a] px-3 py-3 uppercase font-bold transition-colors mt-4 w-full"
          >
            {isSubmitting ? 'PROCESSING...' : '[AUTHENTICATE]'}
          </button>
        </form>
      </div>
    </div>
  );
}
