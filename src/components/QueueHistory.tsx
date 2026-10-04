import React from 'react';
import { 
  ExternalLink, 
  Clock, 
  Github, 
  Trash2, 
  RefreshCw, 
  Layers
} from 'lucide-react';
import { PostHistoryItem } from '../types';

interface QueueHistoryProps {
  history: PostHistoryItem[];
  onRePublish: (item: PostHistoryItem) => void;
  onClearHistory: () => void;
}

export const QueueHistory: React.FC<QueueHistoryProps> = ({
  history,
  onRePublish,
  onClearHistory
}) => {
  const totalPosts = history.length;
  const totalReach = history.reduce((acc, curr) => {
    const itemReach = Object.values(curr.results || {}).reduce((s, r) => s + (r.reachEstimate || 0), 0);
    return acc + itemReach;
  }, 0);

  const totalRepos = history.filter(h => h.githubUrl).length;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-5 sm:space-y-8">
      {/* Header Box */}
      <div className="liquid-glass rounded-2xl sm:rounded-3xl p-4 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 relative overflow-hidden">
        <div className="space-y-1 sm:space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-black"></span>
            <span className="text-xs text-zinc-600 font-bold uppercase tracking-wider">
              YOUR POSTS & ACTIVITY
            </span>
          </div>
          <h1 className="font-display font-extrabold text-xl sm:text-3xl text-black tracking-tight">
            Post History & Saved Links
          </h1>
          <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed font-medium">
            See all the posts and code you generated and shared to <strong>LinkedIn, X, Instagram, TikTok, Facebook, and GitHub</strong>.
          </p>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => window.location.reload()}
              className="btn-glass-secondary flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer text-zinc-700 font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync</span>
            </button>
            <button
              onClick={onClearHistory}
              className="btn-glass-secondary flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer text-zinc-700 hover:text-red-600 font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>

      {/* Stats Grid - 3 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
        <div className="liquid-glass-card rounded-xl sm:rounded-2xl p-3.5 sm:p-5 space-y-1">
          <span className="text-[10px] sm:text-xs text-zinc-500 font-bold uppercase">TOTAL GENERATIONS</span>
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-black">{totalPosts}</div>
          <p className="text-[10px] sm:text-[11px] text-zinc-600 font-medium">Synced with MongoDB</p>
        </div>

        <div className="liquid-glass-card rounded-xl sm:rounded-2xl p-3.5 sm:p-5 space-y-1">
          <span className="text-[10px] sm:text-xs text-zinc-500 font-bold uppercase">SOCIAL REACH</span>
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-black">{totalReach.toLocaleString()}</div>
          <p className="text-[10px] sm:text-[11px] text-zinc-600 font-medium">Estimated Views</p>
        </div>

        <div className="liquid-glass-card rounded-xl sm:rounded-2xl p-3.5 sm:p-5 space-y-1">
          <span className="text-[10px] sm:text-xs text-zinc-500 font-bold uppercase">GITHUB REPOS</span>
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-black">{totalRepos}</div>
          <p className="text-[10px] sm:text-[11px] text-zinc-600 font-medium">Pushed to GitHub</p>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-zinc-700 uppercase font-bold tracking-wider">
            RECENT ACTIVITY
          </span>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-black/5 text-zinc-800 font-bold">
            {history.length} ITEMS SYNCED
          </span>
        </div>

        {history.length === 0 ? (
          <div className="p-8 sm:p-12 text-center rounded-2xl sm:rounded-3xl liquid-glass space-y-3">
            <Layers className="w-8 sm:w-10 h-8 sm:h-10 text-zinc-400 mx-auto" />
            <p className="text-xs text-zinc-600 font-medium">No activity found on this device. Start creating to see history!</p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="liquid-glass rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-sm hover:shadow-md transition-all border border-black/[0.08]"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 border-b border-black/[0.06] pb-2.5 sm:pb-3">
                <div className="flex items-center gap-2 truncate">
                  <div className="w-2 h-2 rounded-full bg-black shrink-0"></div>
                  <h3 className="font-display font-bold text-sm sm:text-base text-black truncate">{item.title}</h3>
                  <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-md bg-black/5 border border-black/10 text-black font-bold uppercase shrink-0">
                    {item.githubUrl ? 'CODE + GITHUB' : 'SOCIAL POSTS'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-600 font-medium shrink-0">
                  <Clock className="w-3 h-3 text-black" />
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Prompt snippet */}
              <p className="text-xs text-zinc-800 bg-white/90 p-2.5 sm:p-3 rounded-xl border border-black/[0.07] shadow-inner font-medium">
                "{item.prompt}"
              </p>

              {/* Platforms Published links */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1">
                {(item.results && Object.keys(item.results).length > 0) && (
                  <>
                    <span className="text-[10px] sm:text-[11px] text-zinc-600 font-bold uppercase mr-1">Social:</span>
                    {Object.entries(item.results).map(([platform, res]) => (
                      <a
                        key={platform}
                        href={res.postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/90 border border-black/[0.1] hover:border-black text-[11px] sm:text-xs text-black font-bold transition-all cursor-pointer shadow-xs"
                      >
                        <span className="uppercase">{platform}</span>
                        <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-zinc-600" />
                      </a>
                    ))}
                  </>
                )}

                {item.githubUrl && (
                  <>
                    <span className="text-[10px] sm:text-[11px] text-zinc-600 font-bold uppercase ml-2 mr-1">Repo:</span>
                    <a
                      href={item.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black text-white text-[11px] sm:text-xs font-bold transition-all cursor-pointer shadow-sm hover:bg-zinc-800"
                    >
                      <Github className="w-3 h-3" />
                      <span>GITHUB REPO</span>
                      <ExternalLink className="w-2.5 h-2.5 text-zinc-400" />
                    </a>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
