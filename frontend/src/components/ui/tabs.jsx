import React from 'react';
import { cn } from '@/lib/utils';

export function Tabs({ tabs, activeTab, onChange, className }) {
  return (
    <div className={cn('flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800/80 overflow-x-auto', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer',
              isActive
                ? 'bg-slate-800 text-emerald-400 font-semibold shadow-sm border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            )}
          >
            {tab.icon && <span className="w-3.5 h-3.5">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={cn('px-1.5 py-0.2 rounded-full text-[10px]', isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400')}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
