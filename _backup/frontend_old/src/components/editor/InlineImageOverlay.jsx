import React, { useRef } from 'react';
import { Upload, Scissors, Trash2, Camera } from 'lucide-react';
import { useVisualEditor } from '../../context/VisualEditorContext';

export default function InlineImageOverlay({
  currentSrc,
  onImageChanged,
  onImageDeleted,
  aspect = '16:9',
  title = 'Edit Photo',
  className = '',
}) {
  const { isEditMode, isPreviewMode, openImageCropper } = useVisualEditor();
  const editable = isEditMode && !isPreviewMode;
  const fileInputRef = useRef(null);

  if (!editable) return null;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-30 flex flex-wrap items-center gap-1.5 pointer-events-auto ${className}`}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          fileInputRef.current?.click();
        }}
        className="px-2.5 py-1.5 rounded-xl bg-blue-600/95 hover:bg-blue-500 text-white text-[11px] font-bold shadow-xl border border-blue-400/50 flex items-center gap-1 cursor-pointer hover:scale-105 active:scale-95 transition-all"
        title="Upload & Cut New Photo"
      >
        <Upload className="w-3.5 h-3.5" />
        <span>Change Photo</span>
      </button>

      {currentSrc && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            openImageCropper({
              currentSrc,
              defaultAspect: aspect,
              title,
              onApply: onImageChanged,
            });
          }}
          className="px-2.5 py-1.5 rounded-xl bg-amber-500/95 hover:bg-amber-400 text-slate-950 text-[11px] font-bold shadow-xl border border-amber-300/50 flex items-center gap-1 cursor-pointer hover:scale-105 active:scale-95 transition-all"
          title="Cut / Zoom / Scale this Photo"
        >
          <Scissors className="w-3.5 h-3.5" />
          <span>Cut / Scale</span>
        </button>
      )}

      {onImageDeleted && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm('Are you sure you want to delete this photo?')) {
              onImageDeleted();
            }
          }}
          className="p-1.5 rounded-xl bg-rose-600/95 hover:bg-rose-500 text-white shadow-xl border border-rose-400/50 cursor-pointer hover:scale-105 active:scale-95 transition-all"
          title="Delete Photo"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const previewUrl = URL.createObjectURL(file);
            openImageCropper({
              currentSrc: previewUrl,
              originalFile: file,
              defaultAspect: aspect,
              title,
              onApply: onImageChanged,
            });
            e.target.value = '';
          }
        }}
        className="hidden"
      />
    </div>
  );
}
