import React from 'react';
import { 
  Share2, 
  Code2, 
  Image as ImageIcon, 
  Clock, 
  LayoutGrid
} from 'lucide-react';
import { AccountConnections } from '../types';

interface NavigationProps {
  activeTab: 'omni' | 'social' | 'code' | 'image' | 'history';
  setActiveTab: (tab: 'omni' | 'social' | 'code' | 'image' | 'history') => void;
  accounts: AccountConnections;
  onOpenSettings: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  onOpenSettings
}) => {
  const tabs = [
    { id: 'omni', label: 'ALL IN ONE', shortLabel: 'ALL IN ONE', icon: LayoutGrid },
    { id: 'social', label: 'SOCIAL POSTS', shortLabel: 'SOCIAL', icon: Share2 },
    { id: 'code', label: 'CODE & GITHUB', shortLabel: 'CODE', icon: Code2 },
    { id: 'image', label: 'IMAGES', shortLabel: 'IMAGES', icon: ImageIcon },
    { id: 'history', label: 'HISTORY', shortLabel: 'HISTORY', icon: Clock },
  ] as const;

  return (
    <header className="sticky top-2.5 sm:top-4 z-50 px-2 sm:px-6 w-full">
      {/* Floating Capsule Bar */}
      <div className="max-w-6xl mx-auto rounded-full bg-white/95 backdrop-blur-2xl border border-black/10 shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-1.5 sm:p-2 flex items-center justify-between gap-1.5 sm:gap-3 transition-all">
        {/* Left: Brand Monogram Badge */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 pl-1">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-black text-white flex items-center justify-center font-mono font-bold text-xs tracking-wider shadow-sm shrink-0">
            <span>SF</span>
          </div>

          <span className="font-display font-black text-xs sm:text-sm tracking-tight text-black hidden md:inline">
            SHIP FAST
          </span>

          <div className="h-4 w-px bg-zinc-200 hidden md:block mx-0.5" />
        </div>

        {/* Center: Floating Navigation Pills */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          <nav className="flex items-center gap-1 sm:gap-1.5">
            {tabs.map((tab, idx) => {
              const isActive = activeTab === tab.id;
              return (
                <React.Fragment key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-2.5 sm:px-3.5 py-1.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                      isActive
                        ? 'bg-black text-white shadow-sm'
                        : 'text-zinc-600 hover:text-black hover:bg-black/5'
                    }`}
                  >
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0"></span>
                    )}
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.shortLabel}</span>
                  </button>

                  {/* Subtle divider between key sections on desktop */}
                  {idx === 0 && (
                    <div className="h-3.5 w-px bg-zinc-200 hidden lg:block mx-1" />
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        {/* Right: Floating Action CTA Button matching reference image */}
        <div className="shrink-0 pr-0.5">
          <button 
            onClick={onOpenSettings}
            className="bg-black hover:bg-zinc-800 text-white rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase flex items-center gap-1 sm:gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0"
            title="Account Settings"
          >
            <span className="text-zinc-400 font-bold">&gt;_</span>
            <span className="hidden sm:inline">SETTINGS</span>
            <span className="text-zinc-400 text-xs">↗</span>
          </button>
        </div>
      </div>
    </header>
  );
};
