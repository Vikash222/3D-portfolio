import React, { useState, useEffect } from 'react';
import {
  Share2,
  Plus,
  Trash2,
  Edit2,
  Pin,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Upload,
  RefreshCw,
} from 'lucide-react';
import { GithubIcon, InstagramIcon, LinkedInIcon } from '../common/Icons';
import {
  getAdminSocialPosts,
  createAdminSocialPost,
  updateAdminSocialPost,
  deleteAdminSocialPost,
  togglePinAdminSocialPost,
  uploadFile,
} from '../../services/api';

export default function SocialStreamView() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [editingPost, setEditingPost] = useState(null);

  const initialForm = {
    platform: 'instagram',
    post_url: '',
    title: '',
    caption: '',
    image_url: '',
    author_name: 'Vikash Kumar',
    likes: '',
    comments: '',
    is_pinned: false,
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getAdminSocialPosts();
      if (data && data.posts) {
        setPosts(data.posts);
      }
    } catch (err) {
      setMessage({ text: 'Failed to load social posts.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const res = await uploadFile(file);
      setFormData((prev) => ({ ...prev, image_url: res.url }));
      setMessage({ text: 'Post image uploaded successfully!', type: 'success' });
    } catch (err) {
      setMessage({ text: 'Image upload failed. Try a smaller image (<5MB).', type: 'error' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const payload = {
        platform: formData.platform,
        post_url: formData.post_url,
        title: formData.title,
        caption: formData.caption,
        image_url: formData.image_url,
        author_name: formData.author_name,
        is_pinned: formData.is_pinned,
        metrics: {
          likes: formData.likes ? parseInt(formData.likes) : 0,
          comments: formData.comments ? parseInt(formData.comments) : 0,
        },
      };

      if (editingPost) {
        await updateAdminSocialPost(editingPost.id, payload);
        setMessage({ text: 'Social post updated successfully!', type: 'success' });
      } else {
        await createAdminSocialPost(payload);
        setMessage({ text: 'Social post published to live feed!', type: 'success' });
      }

      setFormData(initialForm);
      setEditingPost(null);
      fetchPosts();
    } catch (err) {
      setMessage({ text: 'Failed to save social post.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      platform: post.platform || 'instagram',
      post_url: post.post_url || '',
      title: post.title || '',
      caption: post.caption || '',
      image_url: post.image_url || '',
      author_name: post.author_name || 'Vikash Kumar',
      likes: post.metrics?.likes || '',
      comments: post.metrics?.comments || '',
      is_pinned: !!post.is_pinned,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this post from the feed?')) return;
    try {
      await deleteAdminSocialPost(id);
      setMessage({ text: 'Post deleted successfully.', type: 'success' });
      fetchPosts();
    } catch (err) {
      setMessage({ text: 'Failed to delete post.', type: 'error' });
    }
  };

  const handleTogglePin = async (id) => {
    try {
      const res = await togglePinAdminSocialPost(id);
      setMessage({ text: res.message, type: 'success' });
      fetchPosts();
    } catch (err) {
      setMessage({ text: 'Failed to toggle pin.', type: 'error' });
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Share2 className="w-6 h-6 text-blue-400" />
          Live Social Stream Manager
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          GitHub commits are automatically synced live. Use this panel to embed and feature your latest Instagram photos, reels, and LinkedIn articles on your portfolio feed.
        </p>
      </div>

      {message.text && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl text-sm ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Add / Edit Form Card */}
      <div className="bg-[#0b101d] rounded-2xl p-7 border border-white/10 space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          {editingPost ? 'Edit Social Post' : 'Add New Social Post / Embed'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Platform Selector */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">PLATFORM *</label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-blue-400 focus:outline-none cursor-pointer"
              >
                <option value="instagram" className="bg-slate-900 text-white">Instagram</option>
                <option value="linkedin" className="bg-slate-900 text-white">LinkedIn</option>
                <option value="github" className="bg-slate-900 text-white">GitHub Highlight</option>
                <option value="twitter" className="bg-slate-900 text-white">Twitter / X</option>
              </select>
            </div>

            {/* Post URL */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono text-slate-300 mb-1">
                POST / PROFILE URL *
              </label>
              <input
                type="url"
                name="post_url"
                required
                value={formData.post_url}
                onChange={handleChange}
                placeholder="https://www.instagram.com/p/... or https://www.linkedin.com/posts/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-blue-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title / Headline */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                TITLE / HEADLINE
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Life at IKGPTU or Built Hostel Kavach..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-blue-400 focus:outline-none"
              />
            </div>

            {/* Author Handle */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">AUTHOR DISPLAY</label>
              <input
                type="text"
                name="author_name"
                value={formData.author_name}
                onChange={handleChange}
                placeholder="@mrvikash7493 or Vikash Kumar"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-blue-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">CAPTION / CONTENT</label>
            <textarea
              name="caption"
              rows={3}
              value={formData.caption}
              onChange={handleChange}
              placeholder="Paste your post caption, thoughts, or key takeaways..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-blue-400 focus:outline-none resize-none"
            />
          </div>

          {/* Image URL & Uploader */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                ATTACHED IMAGE URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://... or upload below"
                  className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:border-blue-400 focus:outline-none"
                />
                <label className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1">
                  {uploadingImage ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">LIKES (EST.)</label>
                <input
                  type="number"
                  name="likes"
                  value={formData.likes}
                  onChange={handleChange}
                  placeholder="142"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:border-blue-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">COMMENTS</label>
                <input
                  type="number"
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  placeholder="28"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:border-blue-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Pin Checkbox & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/10">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                name="is_pinned"
                checked={formData.is_pinned}
                onChange={handleChange}
                className="w-4 h-4 rounded text-blue-600 bg-black/40 border-white/20"
              />
              <span className="font-semibold">Pin this post to the top of the social feed</span>
            </label>

            <div className="flex items-center gap-2">
              {editingPost && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingPost(null);
                    setFormData(initialForm);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-400 text-xs font-semibold hover:bg-white/5 cursor-pointer"
                >
                  Cancel Edit
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {saving ? 'Publishing...' : editingPost ? 'Update Post' : 'Add to Social Feed'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Existing Social Posts List */}
      <div className="bg-[#0b101d] rounded-2xl p-7 border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white">Existing Social Media Posts</h3>

        {loading ? (
          <div className="py-8 text-center text-slate-500 text-sm">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-sm">
            No manual social posts yet. Use the form above to add an Instagram or LinkedIn post!
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => {
              const isInstagram = post.platform === 'instagram';
              const isLinkedin = post.platform === 'linkedin';

              return (
                <div
                  key={post.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-black/30 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 ${
                        isInstagram
                          ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600'
                          : isLinkedin
                          ? 'bg-blue-600'
                          : 'bg-slate-800'
                      }`}
                    >
                      {isInstagram && <InstagramIcon className="w-4 h-4" />}
                      {isLinkedin && <LinkedInIcon className="w-4 h-4" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white truncate max-w-sm">
                          {post.title || post.caption?.slice(0, 40) || 'Social Post'}
                        </h4>
                        {post.is_pinned && (
                          <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                            PINNED
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 truncate block">
                        {post.caption?.slice(0, 80) || post.post_url}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleTogglePin(post.id)}
                      className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                        post.is_pinned
                          ? 'bg-amber-500/20 border-amber-500/30 text-amber-300'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                      title={post.is_pinned ? 'Unpin post' : 'Pin to top'}
                    >
                      <Pin className="w-4 h-4" />
                    </button>

                    <a
                      href={post.post_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors"
                      title="Visit Post URL"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <button
                      onClick={() => handleEdit(post)}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
                      title="Edit Post"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                      title="Delete Post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
