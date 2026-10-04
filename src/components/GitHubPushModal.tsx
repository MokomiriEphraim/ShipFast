import React, { useState } from 'react';
import { 
  Github, 
  Check, 
  Copy, 
  ExternalLink, 
  GitCommit, 
  Globe, 
  Lock, 
  Terminal, 
  X, 
  Loader2,
  FileCode2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CodeProjectBundle, GitHubPushResult } from '../types';

interface GitHubPushModalProps {
  isOpen: boolean;
  onClose: () => void;
  codeBundle: CodeProjectBundle;
  defaultToken?: string;
  onSaveToken?: (token: string) => void;
  onPushSuccess?: (result: GitHubPushResult) => void;
}

export const GitHubPushModal: React.FC<GitHubPushModalProps> = ({
  isOpen,
  onClose,
  codeBundle,
  defaultToken = '',
  onSaveToken,
  onPushSuccess
}) => {
  const [token, setToken] = useState(defaultToken);
  const [repoName, setRepoName] = useState(codeBundle.repoName || 'my-new-project');
  const [description, setDescription] = useState(codeBundle.explanation || 'Created with Ship Fast');
  const [commitMessage, setCommitMessage] = useState(codeBundle.commitMessage || 'Initial commit');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GitHubPushResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedClone, setCopiedClone] = useState(false);

  if (!isOpen) return null;

  const handlePush = async () => {
    setLoading(true);
    setError(null);
    try {
      if (onSaveToken && token) {
        onSaveToken(token);
      }

      const files = codeBundle.files && codeBundle.files.length > 0 ? codeBundle.files : [
        { path: codeBundle.fileName || 'App.tsx', content: codeBundle.code },
        { path: 'README.md', content: codeBundle.readme || `# ${repoName}` }
      ];

      const response = await fetch('/api/github/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token.trim(),
          repoName,
          description,
          commitMessage,
          isPrivate,
          files
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to push to GitHub');
      }

      setResult(data);
      if (onPushSuccess) {
        onPushSuccess(data);
      }
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#000000', '#52525b', '#a1a1aa', '#ffffff']
      });
    } catch (err: any) {
      setError(err.message || 'Error communicating with GitHub');
    } finally {
      setLoading(false);
    }
  };

  const copyCloneCmd = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/40 backdrop-blur-md">
      <div className="liquid-glass rounded-2xl sm:rounded-3xl w-full max-w-xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col text-black border border-white/80">
        {/* Header */}
        <div className="p-3.5 sm:p-5 border-b border-black/[0.08] flex items-center justify-between bg-white/60 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-black text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <Github className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base sm:text-lg text-black">Push to GitHub</h2>
              <p className="text-[11px] sm:text-xs text-zinc-500 font-medium">Create repository & get link</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl hover:bg-black/5 text-zinc-600 hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              Error: {error}
            </div>
          )}

          {result ? (
            <div className="space-y-4 sm:space-y-5">
              {/* Success Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/95 border border-black/10 text-center space-y-1.5 sm:space-y-2 shadow-sm">
                <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-full bg-black text-white flex items-center justify-center shadow-xs">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                </div>
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-black">
                  Repository Created!
                </h3>
                <p className="text-xs text-zinc-600 font-medium">
                  {result.message}
                </p>
              </div>

              {/* Direct Repository Link Box */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-black/10 space-y-2.5 shadow-xs">
                <span className="text-[10px] sm:text-[11px] text-zinc-600 font-bold uppercase tracking-wider block">YOUR GITHUB LINK</span>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={result.repoUrl}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-black select-all font-semibold font-mono"
                  />
                  <a
                    href={result.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary-liquid px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer hover:underline font-semibold shrink-0"
                  >
                    <span>Open</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Clone Command */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-black/10 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-600 font-bold flex items-center gap-1">
                    <Terminal className="w-3.5 h-3.5 text-black" />
                    Clone Command
                  </span>
                  <button
                    onClick={() => copyCloneCmd(`git clone ${result.cloneUrl}`)}
                    className="text-[11px] text-zinc-700 hover:text-black font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedClone ? <Check className="w-3 h-3 text-black" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedClone ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-zinc-100 p-2.5 rounded-xl border border-zinc-200 font-mono text-xs text-black font-medium overflow-x-auto">
                  git clone {result.cloneUrl}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setResult(null)}
                  className="btn-glass-secondary flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs cursor-pointer font-bold"
                >
                  Push Another
                </button>
                <button
                  onClick={onClose}
                  className="btn-primary-liquid flex-1 sm:flex-initial px-6 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5 sm:space-y-4">
              <div>
                <label className="block text-xs text-zinc-700 font-bold uppercase mb-1">
                  Repository Name
                </label>
                <div className="flex items-center rounded-xl sm:rounded-2xl border border-black/10 bg-white px-3 py-2 sm:py-2.5 focus-within:border-black shadow-inner">
                  <span className="text-xs font-mono text-zinc-400 mr-1">github.com/</span>
                  <input
                    type="text"
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    placeholder="my-new-app"
                    className="w-full bg-transparent text-xs text-black outline-none font-semibold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-700 font-bold uppercase mb-1 flex items-center gap-1.5">
                  <GitCommit className="w-3.5 h-3.5 text-black" />
                  Commit Message
                </label>
                <input
                  type="text"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder="Initial commit"
                  className="w-full rounded-xl sm:rounded-2xl border border-black/10 bg-white px-3 py-2 sm:py-2.5 text-xs text-black outline-none focus:border-black shadow-inner font-medium"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-700 font-bold uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short summary of this project..."
                  className="w-full rounded-xl sm:rounded-2xl border border-black/10 bg-white px-3 py-2 text-xs text-black outline-none focus:border-black shadow-inner font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-0.5">
                <button
                  type="button"
                  onClick={() => setIsPrivate(false)}
                  className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border text-left cursor-pointer transition-all flex items-center gap-2 ${
                    !isPrivate ? 'border-black bg-black text-white shadow-md' : 'border-black/10 bg-white/80 text-zinc-700'
                  }`}
                >
                  <Globe className="w-4 h-4 shrink-0" />
                  <div>
                    <div className="text-xs font-bold">Public</div>
                    <div className={`text-[9px] sm:text-[10px] ${!isPrivate ? 'text-zinc-300' : 'text-zinc-500'}`}>Anyone</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPrivate(true)}
                  className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border text-left cursor-pointer transition-all flex items-center gap-2 ${
                    isPrivate ? 'border-black bg-black text-white shadow-md' : 'border-black/10 bg-white/80 text-zinc-700'
                  }`}
                >
                  <Lock className="w-4 h-4 shrink-0" />
                  <div>
                    <div className="text-xs font-bold">Private</div>
                    <div className={`text-[9px] sm:text-[10px] ${isPrivate ? 'text-zinc-300' : 'text-zinc-500'}`}>Only you</div>
                  </div>
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/90 border border-black/10 space-y-1.5 shadow-2xs">
                <label className="text-xs text-black font-bold flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5" />
                  GitHub Token (Optional)
                </label>
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="ghp_... (or leave blank)"
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-1.5 text-xs text-black outline-none focus:border-black shadow-inner font-mono"
                />
              </div>

              <div className="pt-1 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-glass-secondary flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs cursor-pointer font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePush}
                  disabled={loading}
                  className="btn-primary-liquid flex-1 sm:flex-initial px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Pushing...</span>
                    </>
                  ) : (
                    <>
                      <Github className="w-4 h-4" />
                      <span>Push Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
