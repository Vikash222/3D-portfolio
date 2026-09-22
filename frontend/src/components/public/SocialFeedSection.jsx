import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  GitCommit,
  GitBranch,
  ExternalLink,
  RefreshCw,
  Heart,
  MessageCircle,
  Share2,
  Calendar,
  Sparkles,
  Pin,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
} from 'lucide-react';
import { GithubIcon, InstagramIcon, LinkedInIcon } from '../common/Icons';
import { getSocialFeed } from '../../services/api';

export default function SocialFeedSection() {
  const [feed, setFeed] = useState([]);
  const [counts, setCounts] = useState({ total: 0, github: 0, instagram: 0, linkedin: 0 });
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isFeedOpen, setIsFeedOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const handleCardClick = (key) => {
    if (key === 'all') {
      if (selectedFilter === 'all') {
        setIsFeedOpen((prev) => !prev);
      } else {
        setSelectedFilter('all');
        setIsFeedOpen(true);
      }
    } else {
      if (selectedFilter === key && isFeedOpen) {
        setIsFeedOpen(false);
      } else {
        setSelectedFilter(key);
        setIsFeedOpen(true);
      }
    }
  };

  const fetchFeed = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);

      const data = await getSocialFeed();
      if (data && data.feed) {
        setFeed(data.feed);
        if (data.counts) setCounts(data.counts);
      }
    } catch (err) {
      console.error('Failed to load social feed:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const filteredFeed =
    selectedFilter === 'all'
      ? feed
      : feed.filter((item) => item.platform === selectedFilter);

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now - date) / 1000);

    if (diffSeconds < 60) return 'Just now';
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <section id="social-feed" className="py-24 relative overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/60 border border-red-500/30 text-red-300 text-xs font-semibold uppercase tracking-wider mb-3 shadow-lg shadow-red-950/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            Real-Time Social &amp; Code Activity
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Live Social Pulse &amp;{' '}
            <span className="bg-gradient-to-r from-red-500 via-rose-500 to-red-400 bg-clip-text text-transparent">
              Activity Stream
            </span>
          </h2>
          <p className="mt-3 text-slate-300 text-base sm:text-lg leading-relaxed">
            Whenever I push code to GitHub or post updates on Instagram &amp; LinkedIn, they appear here live.
          </p>
        </div>

        {/* Unified 4-Card Platform Selector & Direct Profile Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              key: 'all',
              label: 'All Updates',
              handle: 'Unified Activity Feed',
              sub: 'Live GitHub Commits & Social Pulse',
              count: feed.length,
              icon: Activity,
              iconBg: 'bg-red-500/20 text-red-400 border border-red-500/30',
              url: null,
            },
            {
              key: 'github',
              label: 'GitHub Commits',
              handle: '@Vikash222',
              sub: '16+ Repositories • Live Commits',
              count: counts.github,
              icon: GithubIcon,
              iconBg: 'bg-white/10 text-white border border-white/20',
              url: 'https://github.com/Vikash222',
            },
            {
              key: 'instagram',
              label: 'Instagram',
              handle: '@mrvikash7493',
              sub: 'Tech Stories & Campus Life',
              count: counts.instagram,
              icon: InstagramIcon,
              iconBg: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white',
              url: 'https://www.instagram.com/mrvikash7493/',
            },
            {
              key: 'linkedin',
              label: 'LinkedIn',
              handle: 'Vikash Kumar',
              sub: 'Engineering Articles & Professional Network',
              count: counts.linkedin,
              icon: LinkedInIcon,
              iconBg: 'bg-red-600/20 text-red-400 border border-red-500/40',
              url: 'https://www.linkedin.com/in/vikash-kumar-ab436131a/',
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedFilter === tab.key;

            return (
              <div
                key={tab.key}
                onClick={() => handleCardClick(tab.key)}
                className={`relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer text-left flex flex-col justify-between group ${
                  isSelected && isFeedOpen
                    ? 'cosmic-card border-red-400 shadow-xl shadow-red-500/20 ring-2 ring-red-500/30 -translate-y-0.5'
                    : 'bg-[#12070b]/75 hover:bg-[#1a0a10] border-white/10 hover:border-red-500/30 shadow-xs hover:shadow-md'
                }`}
              >
                <div>
                  {/* Top Bar: Icon + Live Count Badge + Action/Chevron Icon */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 ${tab.iconBg}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                          isSelected && isFeedOpen
                            ? 'bg-red-600 text-white font-black'
                            : 'bg-white/10 text-slate-300 group-hover:bg-red-500/20 group-hover:text-red-300'
                        }`}
                      >
                        {tab.count}
                      </span>

                      {tab.key === 'all' ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick(tab.key);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-300 hover:bg-white/10 transition-colors cursor-pointer"
                          title={isFeedOpen ? 'Click to hide/collapse feed' : 'Click to open/expand feed'}
                        >
                          {isFeedOpen && isSelected ? (
                            <EyeOff className="w-4 h-4 text-red-400" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      ) : tab.url ? (
                        <a
                          href={tab.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-300 hover:bg-white/10 transition-colors cursor-pointer"
                          title={`Open ${tab.label} Profile in New Tab`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      ) : null}
                    </div>
                  </div>

                  {/* Card Main Labels */}
                  <h3 className="font-extrabold text-sm sm:text-base text-white group-hover:text-red-400 transition-colors">
                    {tab.label}
                  </h3>
                  <span className="text-xs font-mono font-bold text-red-400 block mt-0.5">
                    {tab.handle}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {tab.sub}
                  </p>
                </div>

                {/* Bottom Status / Filter Switcher */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span
                    className={`font-semibold transition-colors ${
                      isSelected && isFeedOpen
                        ? 'text-red-300 font-bold'
                        : 'text-slate-400 group-hover:text-slate-300'
                    }`}
                  >
                    {tab.key === 'all'
                      ? isFeedOpen && isSelected
                        ? '● Open (Click to Hide)'
                        : '○ Hidden (Click to Open)'
                      : isSelected && isFeedOpen
                      ? 'Viewing Filter'
                      : 'Filter Feed'}
                  </span>

                  {tab.url ? (
                    <a
                      href={tab.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-bold text-slate-300 hover:text-red-300 transition-all border border-white/10 hover:border-red-400/40"
                    >
                      <span>Open Link</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fetchFeed(true);
                      }}
                      disabled={refreshing}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-bold text-slate-300 hover:text-red-300 transition-all border border-white/10 hover:border-red-400/40 cursor-pointer"
                      title="Sync live GitHub & social stream"
                    >
                      <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin text-red-400' : ''}`} />
                      <span>Sync</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>


        {/* Collapsible Feed Grid Container */}
        <AnimatePresence mode="wait">
          {!isFeedOpen ? (
            <motion.div
              key="collapsed-banner"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="cosmic-card rounded-3xl p-8 text-center max-w-xl mx-auto shadow-xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-3 border border-red-500/20 shadow-xs">
                <Activity className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-base font-bold text-white">
                Activity Stream is Collapsed
              </h3>
              <p className="text-xs text-slate-400 mt-1 mb-4 max-w-md mx-auto">
                Click &quot;All Updates&quot; above or the button below to expand the live GitHub commits and social activity stream.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedFilter('all');
                  setIsFeedOpen(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-red-500/25 transition-all hover:scale-102 cursor-pointer"
              >
                <span>Expand Activity Stream</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="expanded-feed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="cosmic-card rounded-3xl p-6 animate-pulse space-y-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10" />
                        <div className="space-y-1.5 flex-1">
                          <div className="h-3 bg-white/10 rounded w-1/3" />
                          <div className="h-2.5 bg-white/5 rounded w-1/2" />
                        </div>
                      </div>
                      <div className="h-16 bg-white/5 rounded-xl" />
                      <div className="h-4 bg-white/10 rounded w-2/3" />
                    </div>
                  ))}
                </div>
              ) : filteredFeed.length === 0 ? (
                <div className="cosmic-card rounded-3xl p-12 text-center max-w-lg mx-auto">
                  <Activity className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-white">No recent updates in this category</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    New commits or posts will be reflected here automatically once published.
                  </p>
                </div>
              ) : (
                <>
                  <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                      {filteredFeed.map((item) => {
                        const isGithub = item.platform === 'github';
                        const isInstagram = item.platform === 'instagram';
                        const isLinkedin = item.platform === 'linkedin';

                        return (
                          <motion.div
                            layout
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.25 }}
                            key={item.id}
                            className="cosmic-card cosmic-card-hover rounded-3xl overflow-hidden flex flex-col justify-between group"
                          >
                            <div>
                              {/* Optional Media Image Banner */}
                              {item.image_url && (
                                <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                                  <img
                                    src={item.image_url}
                                    alt={item.title || 'Social Post'}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                                  <div className="absolute top-3 left-3">
                                    <span
                                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full text-white shadow-md flex items-center gap-1 ${
                                        isInstagram
                                          ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600'
                                          : isLinkedin
                                          ? 'bg-blue-600'
                                          : 'bg-slate-900 border border-white/20'
                                      }`}
                                    >
                                      {isInstagram && <InstagramIcon className="w-3 h-3" />}
                                      {isLinkedin && <LinkedInIcon className="w-3 h-3" />}
                                      <span className="capitalize">{item.platform}</span>
                                    </span>
                                  </div>
                                </div>
                              )}

                              <div className="p-6">
                                {/* Header with Platform Icon & Time */}
                                <div className="flex items-center justify-between gap-2 mb-3">
                                  <div className="flex items-center gap-2.5">
                                    <div
                                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 ${
                                        isGithub
                                          ? 'bg-white/10 border border-white/20'
                                          : isInstagram
                                          ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600'
                                          : 'bg-blue-600'
                                      }`}
                                    >
                                      {isGithub && <GithubIcon className="w-4 h-4" />}
                                      {isInstagram && <InstagramIcon className="w-4 h-4" />}
                                      {isLinkedin && <LinkedInIcon className="w-4 h-4" />}
                                    </div>

                                    <div>
                                      <span className="text-xs font-bold text-white block leading-tight">
                                        {isGithub
                                          ? item.repo_name || 'GitHub Repo'
                                          : item.author_name || 'Vikash Kumar'}
                                      </span>
                                      <span className="text-[10px] text-slate-400 font-mono">
                                        {formatTimeAgo(item.published_at)}
                                      </span>
                                    </div>
                                  </div>

                                  {item.is_pinned && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                                      <Pin className="w-2.5 h-2.5" />
                                      Pinned
                                    </span>
                                  )}
                                </div>

                                {/* Title */}
                                <h3 className="text-sm sm:text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors line-clamp-2">
                                  {item.title}
                                </h3>

                                {/* Caption / Commit message */}
                                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
                                  {item.caption}
                                </p>

                                {/* Metrics Pills (Commits/Branch or Likes/Comments) */}
                                {item.metrics && (
                                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10 text-[11px] text-slate-400">
                                    {item.metrics.branch && (
                                      <span className="inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                                        <GitBranch className="w-3 h-3 text-cyan-400" />
                                        {item.metrics.branch}
                                      </span>
                                    )}
                                    {item.metrics.likes !== undefined && (
                                      <span className="inline-flex items-center gap-1">
                                        <Heart className="w-3 h-3 text-rose-400" />
                                        {item.metrics.likes} likes
                                      </span>
                                    )}
                                    {item.metrics.comments !== undefined && (
                                      <span className="inline-flex items-center gap-1">
                                        <MessageCircle className="w-3 h-3 text-indigo-400" />
                                        {item.metrics.comments} comments
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Card Footer with Direct External Link */}
                            <div className="px-6 py-3.5 bg-white/5 border-t border-white/10 flex items-center justify-between">
                              <span className="text-[11px] font-medium text-slate-400">
                                {isGithub ? 'View Commit / Code' : `View on ${item.platform}`}
                              </span>

                              <a
                                href={item.post_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                              >
                                <span>Open</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </motion.div>

                  {/* Collapse Button at bottom of feed */}
                  <div className="mt-8 text-center">
                    <button
                      type="button"
                      onClick={() => setIsFeedOpen(false)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold border border-white/10 shadow-lg transition-all cursor-pointer"
                    >
                      <ChevronUp className="w-4 h-4 text-cyan-400" />
                      <span>Hide / Collapse Activity Stream</span>
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
