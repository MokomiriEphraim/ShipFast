import React, { useState } from 'react';
import { 
  X, 
  Github, 
  Check, 
  Sliders,
  Zap
} from 'lucide-react';
import { AccountConnections } from '../types';

interface IntegrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: AccountConnections;
  onSave: (accounts: AccountConnections) => void;
}

export const IntegrationsModal: React.FC<IntegrationsModalProps> = ({
  isOpen,
  onClose,
  accounts,
  onSave
}) => {
  const [githubToken, setGithubToken] = useState(accounts.githubToken || '');
  const [githubUsername, setGithubUsername] = useState(accounts.githubUsername || 'developer');
  const [openaiApiKey, setOpenaiApiKey] = useState(accounts.openaiApiKey || '');
  const [linkedinConnected, setLinkedinConnected] = useState(accounts.linkedinConnected);
  const [xConnected, setXConnected] = useState(accounts.xConnected);
  const [instagramConnected, setInstagramConnected] = useState(accounts.instagramConnected);
  const [tiktokConnected, setTiktokConnected] = useState(accounts.tiktokConnected);
  const [facebookConnected, setFacebookConnected] = useState(accounts.facebookConnected);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      githubToken: githubToken.trim(),
      githubUsername: githubUsername.trim(),
      openaiApiKey: openaiApiKey.trim(),
      linkedinConnected,
      xConnected,
      instagramConnected,
      tiktokConnected,
      facebookConnected
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/40 backdrop-blur-md">
      <div className="liquid-glass rounded-2xl sm:rounded-3xl w-full max-w-lg max-h-[92vh] sm:max-h-[85vh] shadow-2xl overflow-hidden text-black border border-white/80 flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-black/[0.08] flex items-center justify-between bg-white/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-black text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-black">Settings & Accounts</h2>
              <p className="text-[11px] text-zinc-500 font-medium">Manage GitHub and social networks</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 sm:p-2 rounded-xl hover:bg-black/5 text-zinc-600 hover:text-black cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto">
          {/* GitHub Config Box */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white/95 border border-black/10 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-black">
                <Github className="w-4 h-4" />
                <span>GITHUB SETTINGS</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-black/5 text-black font-bold">
                Optional
              </span>
            </div>

            <div>
              <label className="text-[11px] text-zinc-700 font-bold uppercase block mb-1">
                GitHub Personal Access Token
              </label>
              <input
                type="password"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-1.5 sm:py-2 text-xs text-black outline-none focus:border-black shadow-inner font-mono"
              />
              <p className="text-[10px] text-zinc-500 mt-1">
                Pushes directly to your personal GitHub account.
              </p>
            </div>

            <div>
              <label className="text-[11px] text-zinc-700 font-bold uppercase block mb-1">
                Your GitHub Username
              </label>
              <input
                type="text"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                placeholder="e.g. your-github-name"
                className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-1.5 sm:py-2 text-xs text-black outline-none focus:border-black shadow-inner font-mono"
              />
            </div>
          </div>

          {/* OpenAI Config Box */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white/95 border border-black/10 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-black">
                <Zap className="w-4 h-4" />
                <span>AI MODEL SETTINGS</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-black/5 text-black font-bold">
                Optional
              </span>
            </div>

            <div>
              <label className="text-[11px] text-zinc-700 font-bold uppercase block mb-1">
                OpenAI API Key (GPT-4o-mini)
              </label>
              <input
                type="password"
                value={openaiApiKey}
                onChange={(e) => setOpenaiApiKey(e.target.value)}
                placeholder="sk-xxxxxxxxxxxxxxxxxxxx"
                className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-1.5 sm:py-2 text-xs text-black outline-none focus:border-black shadow-inner font-mono"
              />
              <p className="text-[10px] text-zinc-500 mt-1">
                Use your own OpenAI key for cheaper, faster code generation.
              </p>
            </div>
          </div>

          {/* Social Channels Config */}
          <div className="space-y-2.5 sm:space-y-3">
            <span className="text-xs text-zinc-700 font-bold uppercase block">
              Connected Social Networks
            </span>
            
            <div className="space-y-2">
              {[
                { id: 'li', name: 'LinkedIn', state: linkedinConnected, set: setLinkedinConnected, note: 'Post updates' },
                { id: 'x', name: 'X (Twitter)', state: xConnected, set: setXConnected, note: 'Post tweets' },
                { id: 'ig', name: 'Instagram', state: instagramConnected, set: setInstagramConnected, note: 'Share images' },
                { id: 'tt', name: 'TikTok', state: tiktokConnected, set: setTiktokConnected, note: 'Post scripts' },
                { id: 'fb', name: 'Facebook', state: facebookConnected, set: setFacebookConnected, note: 'Share posts' }
              ].map((item) => (
                <div key={item.id} className="p-3 bg-white/90 rounded-2xl border border-black/[0.08] flex items-center justify-between shadow-2xs">
                  <div>
                    <div className="text-xs font-bold text-black">{item.name}</div>
                    <div className="text-[10px] text-zinc-500 font-medium">{item.note}</div>
                  </div>
                  <button
                    onClick={() => item.set(!item.state)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold cursor-pointer transition-all ${
                      item.state ? 'bg-black text-white shadow-xs' : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                    }`}
                  >
                    {item.state ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-black/[0.08] bg-white/60 flex items-center justify-between shrink-0">
          <span className="text-[10px] text-zinc-500 font-medium">Saved in browser</span>
          <button
            onClick={handleSave}
            className="btn-primary-liquid px-5 sm:px-6 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            {savedSuccess ? <Check className="w-4 h-4" /> : null}
            <span>{savedSuccess ? 'Saved' : 'Save Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
