import React from 'react';
import { cn } from '@/lib/utils';

export function Switch({ checked, onChange, label, className }) {
  return (
    <label className={cn('inline-flex items-center gap-2 cursor-pointer select-none', className)}>
      <div
        onClick={() => onChange(!checked)}
        className={cn(
          'w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out',
          checked ? 'bg-emerald-500' : 'bg-slate-700'
        )}
      >
        <div
          className={cn(
            'bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out',
            checked ? 'translate-x-4' : 'translate-x-0'
          )}
        />
      </div>
      {label && <span className="text-xs text-slate-300 font-medium">{label}</span>}
    </label>
  );
}
