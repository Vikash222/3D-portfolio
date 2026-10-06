import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Upload, Trash2, Search, Filter, Eye, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminGetMedia, adminUploadMedia, adminDeleteMedia } from '@/api/adminApi';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import { getAssetUrl, compressImage } from '@/lib/utils';

export default function MediaView() {
  const [mediaList, setMediaList] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewItem, setPreviewItem] = useState(null);
  const [uploadCategory, setUploadCategory] = useState('general');

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      const res = await adminGetMedia();
      if (res.data?.data) setMediaList(res.data.data);
    } catch (e) {
      toast.error('Failed to load media files');
    }
  };

  const handleUpload = async (e) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;
    try {
      const file = await compressImage(rawFile, 1920);
      const form = new FormData();
      form.append('file', file);
      form.append('category', uploadCategory);

      await adminUploadMedia(form);
      toast.success('File uploaded successfully!');
      loadMedia();
    } catch (e) {
      toast.error('Upload failed. Maximum size is 10MB.');
    }
  };

  const filteredMedia = mediaList.filter((m) => {
    const matchesCategory = categoryFilter === 'all' || m.category === categoryFilter;
    const matchesSearch = !searchQuery || (m.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-emerald-400" />
            Media Library & Assets Manager
          </h2>
          <p className="text-xs text-slate-400">Total files: {mediaList.length} &middot; Automatic optimization & CDN storage</p>
        </div>

        {/* Upload Button */}
        <div className="flex items-center gap-2">
          <select
            value={uploadCategory}
            onChange={(e) => setUploadCategory(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg p-2"
          >
            <option value="projects">Category: Projects</option>
            <option value="profile">Category: Profile</option>
            <option value="certificates">Category: Certificates</option>
            <option value="gallery">Category: Gallery</option>
            <option value="general">Category: General</option>
          </select>
          <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs cursor-pointer shadow-sm transition-colors">
            <Upload className="w-3.5 h-3.5" /> Upload Media
            <input type="file" onChange={handleUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'projects', 'profile', 'certificates', 'gallery', 'general'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                categoryFilter === cat ? 'bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search filenames..."
            className="h-8 text-xs"
          />
        </div>
      </div>

      {/* Grid of Media */}
      {filteredMedia.length === 0 ? (
        <Card className="p-12 text-center text-slate-500 text-xs">
          No media files found in this category. Click "Upload Media" above to add images.
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((m) => {
            const isImage = m.mime_type?.startsWith('image/') || m.url?.match(/\.(jpeg|jpg|png|gif|webp|svg)$/i);
            return (
              <Card key={m.id} className="overflow-hidden group p-2 space-y-2 flex flex-col justify-between">
                <div
                  onClick={() => setPreviewItem(m)}
                  className="aspect-square rounded-lg bg-slate-950 overflow-hidden relative cursor-pointer flex items-center justify-center border border-slate-800"
                >
                  {isImage ? (
                    <img src={getAssetUrl(m.url)} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <FileText className="w-8 h-8 text-slate-500" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-white truncate block" title={m.name}>{m.name}</span>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>{m.size_bytes ? `${Math.round(m.size_bytes / 1024)} KB` : 'N/A'}</span>
                    <Badge variant="secondary">{m.category}</Badge>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(m.url);
                      toast.success('URL copied to clipboard!');
                    }}
                    className="text-[11px] text-emerald-400 hover:underline"
                  >
                    Copy URL
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm(`Delete media item ${m.name}?`)) {
                        await adminDeleteMedia(m.id);
                        toast.success('Media removed');
                        loadMedia();
                      }
                    }}
                    className="p-1 text-rose-400 hover:text-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      <Dialog
        open={Boolean(previewItem)}
        onClose={() => setPreviewItem(null)}
        title={previewItem?.name || 'Media Preview'}
      >
        <div className="space-y-4">
          <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center max-h-80">
            <img src={getAssetUrl(previewItem?.url)} alt="Preview" className="max-h-80 object-contain" />
          </div>
          <div className="text-xs text-slate-400 space-y-1 font-mono">
            <div>URL: <span className="text-emerald-400 select-all">{previewItem?.url}</span></div>
            <div>Category: {previewItem?.category}</div>
            <div>Dimensions: {previewItem?.dimensions || 'Auto'}</div>
            <div>Size: {previewItem?.size_bytes ? `${Math.round(previewItem.size_bytes / 1024)} KB` : 'N/A'}</div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
