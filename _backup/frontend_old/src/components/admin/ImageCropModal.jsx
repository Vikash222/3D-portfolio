import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Move,
  Maximize2,
  Minimize2,
  Sparkles,
  Scissors,
  ArrowRight,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';

/**
 * ImageCropModal
 * Allows cutting (cropping), scaling (small / zoom), panning, and rotating photos
 * before uploading, preventing upload size errors and fitting perfectly in portfolio cards.
 */
export default function ImageCropModal({
  isOpen,
  imageSrc,
  originalFile,
  title = 'Crop & Resize Photo',
  defaultAspect = '16:9', // '16:9' | '4:3' | '1:1' | '4:5' | 'contain'
  onClose,
  onApply,
}) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [aspect, setAspect] = useState(defaultAspect);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState(false);

  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  // Reset state whenever a new image or modal opens
  useEffect(() => {
    if (isOpen && imageSrc) {
      setScale(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
      setAspect(defaultAspect);

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        imageRef.current = img;
        drawPreview();
      };
      img.src = imageSrc;
    }
  }, [isOpen, imageSrc, defaultAspect]);

  // Compute aspect ratio dimensions
  const getAspectDimensions = useCallback(() => {
    switch (aspect) {
      case '16:9':
        return { w: 16, h: 9, label: '16:9 (Landscape Banner)' };
      case '4:3':
        return { w: 4, h: 3, label: '4:3 (Standard Photo)' };
      case '1:1':
        return { w: 1, h: 1, label: '1:1 (Square)' };
      case '4:5':
        return { w: 4, h: 5, label: '4:5 (Portrait Card)' };
      case 'contain':
      default:
        return { w: 16, h: 9, label: 'Fit Full Photo (No Cut)' };
    }
  }, [aspect]);

  // Redraw preview on canvas
  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fixed internal canvas resolution for high-definition output
    const targetWidth = 1280;
    const { w, h } = getAspectDimensions();
    const targetHeight = Math.round((targetWidth * h) / w);

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    ctx.clearRect(0, 0, targetWidth, targetHeight);

    // Background fill (dark elegant tone if contain mode)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    ctx.save();
    // Center transformations
    ctx.translate(targetWidth / 2 + position.x, targetHeight / 2 + position.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);

    const isRotated90 = rotation % 180 !== 0;
    const imgW = isRotated90 ? img.height : img.width;
    const imgH = isRotated90 ? img.width : img.height;

    // Calculate base fit ratio
    let baseRatio = 1;
    if (aspect === 'contain') {
      // Fit completely inside the frame without cropping any part
      baseRatio = Math.min(targetWidth / imgW, targetHeight / imgH) * 0.95;
    } else {
      // Cover the entire target frame
      baseRatio = Math.max(targetWidth / imgW, targetHeight / imgH);
    }

    const drawW = img.width * baseRatio;
    const drawH = img.height * baseRatio;

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
  }, [scale, rotation, position, aspect, getAspectDimensions]);

  useEffect(() => {
    if (imageRef.current) {
      drawPreview();
    }
  }, [drawPreview]);

  // Mouse Drag to Pan
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Drag to Pan
  const handleTouchStart = (e) => {
    if (!e.touches[0]) return;
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y,
    });
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !e.touches[0]) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Rotate by 90 degrees clockwise
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Reset to original center
  const handleReset = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  // Export cropped canvas to compressed WebP/JPEG Blob & File
  const handleApply = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      setIsProcessing(true);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setIsProcessing(false);
            return;
          }

          const fileName = originalFile
            ? originalFile.name.replace(/\.[^/.]+$/, '') + '-cropped.webp'
            : `photo-${Date.now()}.webp`;

          const croppedFile = new File([blob], fileName, {
            type: 'image/webp',
            lastModified: Date.now(),
          });

          const previewUrl = URL.createObjectURL(blob);
          onApply(croppedFile, previewUrl);
          setIsProcessing(false);
          onClose();
        },
        'image/webp',
        0.88
      );
    } catch (err) {
      console.error('Error cropping image:', err);
      setIsProcessing(false);
    }
  };

  // Skip crop and use original file directly
  const handleSkipCrop = () => {
    if (originalFile) {
      onApply(originalFile, imageSrc);
      onClose();
    } else {
      handleApply();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0f172a] rounded-3xl border border-white/15 shadow-2xl overflow-hidden flex flex-col my-auto text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>{title}</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Cut &amp; Scale Tool
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Zoom, crop, or fit your photo so it looks crisp and never fails to upload.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas Interactive Viewport */}
        <div className="p-5 bg-black/50 flex flex-col items-center">
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`relative w-full max-w-lg aspect-16/9 rounded-2xl overflow-hidden border-2 border-dashed border-amber-400/40 bg-slate-950 flex items-center justify-center select-none shadow-inner ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain pointer-events-none"
            />

            {/* Helper overlay */}
            <div className="absolute top-2 left-2 pointer-events-none">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/70 text-slate-300 border border-white/10 flex items-center gap-1">
                <Move className="w-3 h-3 text-amber-400" />
                Drag to Reposition Photo
              </span>
            </div>

            <div className="absolute bottom-2 right-2 pointer-events-none">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/70 text-slate-300 border border-white/10">
                Zoom: {(scale * 100).toFixed(0)}% • {rotation}°
              </span>
            </div>
          </div>

          {/* Aspect Ratio Selector Chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-mono text-slate-400 mr-1">Aspect Ratio:</span>
            {[
              { id: '16:9', label: '16:9 Banner' },
              { id: '4:3', label: '4:3 Classic' },
              { id: '1:1', label: '1:1 Square' },
              { id: '4:5', label: '4:5 Portrait' },
              { id: 'contain', label: 'Fit Full Photo (No Cut)' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setAspect(opt.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  aspect === opt.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Controls Section */}
        <div className="p-5 border-t border-white/10 space-y-4 bg-slate-900/60">
          {/* Zoom / Scale Slider ("Small karne ka option") */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5 w-28 shrink-0">
              <ZoomIn className="w-3.5 h-3.5 text-cyan-400" />
              <span>SIZE / ZOOM:</span>
            </label>

            <button
              type="button"
              onClick={() => setScale((prev) => Math.max(0.3, prev - 0.1))}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
              title="Make Smaller (Zoom Out)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <input
              type="range"
              min="0.3"
              max="3"
              step="0.05"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="flex-1 accent-amber-500 cursor-pointer h-1.5 bg-white/10 rounded-lg appearance-none"
            />

            <button
              type="button"
              onClick={() => setScale((prev) => Math.min(3, prev + 0.1))}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
              title="Zoom In (Cut Edges)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono text-amber-300 w-12 text-right">
              {(scale * 100).toFixed(0)}%
            </span>
          </div>

          {/* Quick Action Tools: Rotate & Reset */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRotate}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Rotate 90°</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                <span>Reset Center</span>
              </button>
            </div>

            <div className="text-[11px] text-emerald-400/90 font-mono flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Optimized WebP &bull; Ultra-fast load</span>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-t border-white/10 bg-slate-950">
          <div>
            {originalFile && (
              <button
                type="button"
                onClick={handleSkipCrop}
                disabled={isProcessing}
                className="text-xs text-slate-400 hover:text-slate-200 underline underline-offset-4 transition-colors cursor-pointer"
              >
                Upload Original Photo (Skip Crop)
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleApply}
              disabled={isProcessing}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-amber-500/25 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Apply &amp; Upload Cropped Photo</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
