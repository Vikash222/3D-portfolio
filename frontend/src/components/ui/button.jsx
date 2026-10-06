import React from 'react';
import { cn } from '@/lib/utils';

export function Button({ className, variant = 'default', size = 'default', children, ...props }) {
  const variants = {
    default: 'bg-emerald-500 text-black font-semibold hover:bg-emerald-400 shadow-sm',
    primary: 'bg-indigo-600 text-white font-medium hover:bg-indigo-500 shadow-sm',
    secondary: 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700/60',
    outline: 'border border-slate-700 text-slate-300 hover:bg-slate-800/80 hover:text-white',
    ghost: 'text-slate-400 hover:text-white hover:bg-slate-800/50',
    danger: 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white',
  };

  const sizes = {
    default: 'h-9 px-4 py-2 text-sm rounded-lg',
    sm: 'h-7 px-2.5 text-xs rounded-md',
    lg: 'h-11 px-6 text-base rounded-xl',
    icon: 'h-9 w-9 p-0 rounded-lg flex items-center justify-center',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
        variants[variant] || variants.default,
        sizes[size] || sizes.default,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
