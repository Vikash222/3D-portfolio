import React from 'react';
import { cn } from '@/lib/utils';

export function Textarea({ className, rows = 3, ...props }) {
  return (
    <textarea
      rows={rows}
      className={cn(
        'w-full rounded-lg bg-slate-900/80 border border-slate-700/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all resize-none',
        className
      )}
      {...props}
    />
  );
}
