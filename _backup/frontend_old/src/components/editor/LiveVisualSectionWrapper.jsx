import React from 'react';
import { Edit3, Sparkles } from 'lucide-react';

export default function LiveVisualSectionWrapper({
  sectionId,
  title,
  isEditMode,
  isPreviewMode,
  onOpenEditor,
  children,
}) {
  if (!isEditMode || isPreviewMode) {
    return children;
  }

  return (
    <div className="relative group/section transition-all duration-200">
      {/* Floating Section Edit Badge Button */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-30 pointer-events-auto">
        <button
          type="button"
          onClick={() => onOpenEditor(sectionId)}
          className="px-3.5 py-2 rounded-2xl bg-[#090e1c]/95 hover:bg-blue-600 text-cyan-300 hover:text-white border border-cyan-500/40 hover:border-blue-400 shadow-xl shadow-cyan-500/10 hover:shadow-blue-500/30 text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer hover:scale-105 group-hover/section:ring-2 group-hover/section:ring-cyan-400/40"
          title={`Click to visually edit ${title}`}
        >
          <Edit3 className="w-3.5 h-3.5 text-cyan-400 group-hover/section:animate-bounce" />
          <span>Edit {title}</span>
        </button>
      </div>

      {/* Subtle Visual Boundary Highlighter on Hover */}
      <div className="absolute inset-0 pointer-events-none rounded-3xl border-2 border-dashed border-transparent group-hover/section:border-cyan-400/40 transition-colors duration-200" />

      {children}
    </div>
  );
}
