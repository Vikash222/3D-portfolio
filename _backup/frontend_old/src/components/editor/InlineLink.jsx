import React, { useState, useRef, useEffect } from 'react';
import { Link2, ExternalLink, Check, X } from 'lucide-react';
import { useVisualEditor } from '../../context/VisualEditorContext';

export default function InlineLink({
  href = '#',
  onHrefChange,
  target,
  rel,
  className = '',
  title = 'Edit Link URL',
  children,
}) {
  const { isEditMode, isPreviewMode } = useVisualEditor();
  const editable = isEditMode && !isPreviewMode;

  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [urlInput, setUrlInput] = useState(href || '');
  const popoverRef = useRef(null);

  useEffect(() => {
    setUrlInput(href || '');
  }, [href]);

  useEffect(() => {
    if (!isEditingUrl) return;
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsEditingUrl(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditingUrl]);

  if (!editable) {
    return (
      <a href={href} target={target} rel={rel} className={className}>
        {children}
      </a>
    );
  }

  const handleApplyUrl = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (onHrefChange) {
      onHrefChange(urlInput.trim());
    }
    setIsEditingUrl(false);
  };

  return (
    <span className="relative inline-block group/link">
      <a
        href={href}
        target={target}
        rel={rel}
        onClick={(e) => {
          if (editable) {
            e.preventDefault();
            e.stopPropagation();
            setIsEditingUrl((prev) => !prev);
          }
        }}
        className={`${className} outline-dashed outline-1 outline-blue-400/60 hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-pointer`}
        title="🔗 Click to edit link URL"
      >
        {children}
      </a>

      {/* Floating Link Editor Icon Indicator */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsEditingUrl((prev) => !prev);
        }}
        className="absolute -top-2.5 -right-2.5 z-20 w-5 h-5 rounded-full bg-blue-600 text-white shadow-md flex items-center justify-center text-[10px] hover:scale-110 active:scale-95 transition-all opacity-0 group-hover/link:opacity-100 cursor-pointer"
        title="Edit Link URL"
      >
        <Link2 className="w-3 h-3" />
      </button>

      {/* Link Edit Popover */}
      {isEditingUrl && (
        <div
          ref={popoverRef}
          onClick={(e) => e.stopPropagation()}
          className="absolute z-50 top-full mt-2 left-0 min-w-[280px] sm:min-w-[340px] p-3 rounded-2xl bg-[#090e1c] border border-cyan-500/50 shadow-2xl text-white text-xs space-y-2 animate-fadeIn"
        >
          <div className="flex items-center justify-between text-cyan-400 font-bold font-mono">
            <span className="flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5" />
              <span>Edit Link Destination</span>
            </span>
            <button
              type="button"
              onClick={() => setIsEditingUrl(false)}
              className="p-1 text-slate-400 hover:text-white rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://... or #section"
            className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleApplyUrl(e);
              if (e.key === 'Escape') setIsEditingUrl(false);
            }}
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-slate-400 truncate max-w-[180px]">
              Current: {href || '(empty)'}
            </span>
            <button
              type="button"
              onClick={handleApplyUrl}
              className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shadow-md"
            >
              <Check className="w-3 h-3" />
              <span>Apply</span>
            </button>
          </div>
        </div>
      )}
    </span>
  );
}
