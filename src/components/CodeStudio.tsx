import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Github, 
  Play, 
  Copy, 
  Check, 
  Download, 
  Loader2, 
  FileCode2, 
  Terminal, 
  Zap,
  Code2
} from 'lucide-react';
import JSZip from 'jszip';
import { CodeProjectBundle, GitHubPushResult } from '../types';
import { GitHubPushModal } from './GitHubPushModal';
import { StreamingCode } from './StreamingCode';

interface CodeStudioProps {
  githubToken?: string;
  onSaveGithubToken?: (token: string) => void;
  onPushSuccess?: (result: GitHubPushResult) => void;
  onSaveToHistory?: (result: any) => void;
  openaiApiKey?: string;
}

export const CodeStudio: React.FC<CodeStudioProps> = ({
  githubToken,
  onSaveGithubToken,
  onPushSuccess,
  onSaveToHistory,
  openaiApiKey
}) => {
  const [prompt, setPrompt] = useState(
    'Create a real-time event dispatcher with queue management and clean UI in TypeScript and React'
  );
  const [language, setLanguage] = useState('typescript');
  const [framework, setFramework] = useState('react');
  
  const [loading, setLoading] = useState(false);
  const [codeBundle, setCodeBundle] = useState<CodeProjectBundle>({
    repoName: 'event-orchestrator',
    fileName: 'EventOrchestrator.tsx',
    language: 'typescript',
    code: `import React, { useState } from 'react';

interface EventItem {
  id: string;
  name: string;
  time: string;
  status: 'Done' | 'Pending';
}

export default function EventOrchestrator() {
  const [events, setEvents] = useState<EventItem[]>([]);

  const addEvent = () => {
    const item: EventItem = {
      id: 'event_' + Math.floor(Math.random() * 1000),
      name: 'User Action Triggered',
      time: new Date().toLocaleTimeString(),
      status: 'Done'
    };
    setEvents(prev => [item, ...prev]);
  };

  return (
    <div className="p-4 sm:p-8 bg-white text-black min-h-screen">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex justify-between items-center border-b border-zinc-200 pb-4">
          <h1 className="text-lg sm:text-xl font-bold">Event Manager</h1>
          <button 
            onClick={addEvent}
            className="px-3.5 py-1.5 bg-black text-white rounded-xl text-xs font-semibold hover:bg-zinc-800"
          >
            + Add Event
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 sm:p-4 bg-zinc-50 border border-zinc-200 rounded-2xl">
            <span className="text-xs text-zinc-500 font-bold">EVENTS</span>
            <div className="text-xl sm:text-2xl font-bold mt-1">{events.length}</div>
          </div>
          <div className="p-3 sm:p-4 bg-zinc-50 border border-zinc-200 rounded-2xl">
            <span className="text-xs text-zinc-500 font-bold">STATUS</span>
            <div className="text-xl sm:text-2xl font-bold mt-1 text-emerald-600">Online</div>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          {events.length === 0 ? (
            <p className="text-xs text-zinc-400">No events yet. Click "+ Add Event" above.</p>
          ) : (
            events.map(e => (
              <div key={e.id} className="flex justify-between p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium">
                <span>{e.name}</span>
                <span className="text-zinc-500">{e.time}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}`,
    previewHtml: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white text-black p-4 sm:p-6 font-sans">
  <div class="max-w-md mx-auto p-4 sm:p-6 bg-zinc-50 border border-zinc-200 rounded-3xl shadow-sm space-y-4">
    <div class="flex items-center justify-between border-b border-zinc-200 pb-3">
      <h2 class="text-base sm:text-lg font-bold">Event Manager</h2>
      <button id="addBtn" class="px-3 py-1.5 bg-black text-white font-semibold text-xs rounded-xl hover:bg-zinc-800">
        + Trigger
      </button>
    </div>
    <div class="p-3 bg-white border border-zinc-200 rounded-xl">
      <span className="text-xs text-zinc-500">Events Count</span>
      <div id="count" class="text-xl font-bold">0</div>
    </div>
    <div id="list" class="space-y-2 text-xs max-h-48 overflow-y-auto">
      <div class="text-zinc-400">Click '+ Trigger' to test.</div>
    </div>
  </div>
  <script>
    let c = 0;
    document.getElementById('addBtn').onclick = () => {
      c++;
      document.getElementById('count').innerText = c;
      const el = document.createElement('div');
      el.className = 'p-2 bg-white rounded-lg border border-zinc-200 flex justify-between text-xs';
      el.innerHTML = '<span>Action #' + c + '</span><span class="font-bold text-emerald-600">Done</span>';
      document.getElementById('list').prepend(el);
    };
  </script>
</body>
</html>`,
    explanation: 'Event manager component with state tracking and preview.',
    commitMessage: 'feat: add event manager component',
    readme: `# Event Manager\n\nGenerated TypeScript component.\n\n## Quick Start\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\``,
    files: []
  });

  const [activeTab, setActiveTab] = useState<'code' | 'sandbox' | 'readme'>('code');
  const [copied, setCopied] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingFinished, setStreamingFinished] = useState(false);

  const handleGenerateCode = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setStreamingFinished(false);
    try {
      const res = await fetch('/api/generate/code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          language,
          framework,
          openaiApiKey
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate code');
      }
      setCodeBundle(data.data);
      setActiveTab('code');
      setIsStreaming(true);
      setStreamingFinished(false);

      // Scroll to code inspector area
      setTimeout(() => {
        const inspectorEl = document.getElementById('code-inspector');
        if (inspectorEl) {
          inspectorEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);

      if (onSaveToHistory) {
        onSaveToHistory({
          id: `code_${Date.now()}`,
          prompt,
          headline: data.data.repoName,
          summary: data.data.explanation,
          generatedAt: new Date().toISOString(),
          code: data.data,
          social: {
            linkedin: '',
            x: { singlePost: '', thread: [] },
            instagram: { caption: '', hashtags: [] },
            tiktok: { hook: '', script: '', caption: '' },
            facebook: ''
          },
          imageUrl: '',
          tags: ['#Code', '#Software', '#Development']
        });
      }
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeBundle.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    const zip = new JSZip();
    const repoName = codeBundle.repoName || 'my-project';
    
    zip.file(codeBundle.fileName || 'App.tsx', codeBundle.code);
    zip.file('README.md', codeBundle.readme || `# ${repoName}`);
    if (codeBundle.previewHtml) {
      zip.file('index.html', codeBundle.previewHtml);
    }
    const pkg = {
      name: repoName,
      version: '1.0.0',
      description: codeBundle.explanation,
      main: codeBundle.fileName,
      scripts: { dev: "vite", build: "vite build" }
    };
    zip.file('package.json', JSON.stringify(pkg, null, 2));

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${repoName}.zip`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const codePresets = [
    { title: 'Crypto Trading Engine', prompt: 'High-frequency Crypto Orderbook with real-time bid/ask spread calculator, depth visualizer, and simulated matching engine in TypeScript' },
    { title: 'Next.js AI Agent UI', prompt: 'Complete Next.js 15 AI Agent streaming interface in React & TypeScript with glassmorphic cards, token count metrics, and export controls' },
    { title: 'Waveform Audio Player', prompt: 'Interactive Multi-Track Audio Waveform visualizer & player with time markers, zoom scrubber, and speed controls in React' },
    { title: 'Stripe Webhook Router', prompt: 'Production Stripe Webhook event router with HMAC signature verification, idempotency handling, and customer portal sync' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-5 sm:space-y-8">
      {/* Header */}
      <div className="liquid-glass rounded-2xl sm:rounded-3xl p-4 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-black"></span>
            <span className="text-xs text-zinc-600 font-bold uppercase">CODE GENERATOR & GITHUB</span>
          </div>
          <h1 className="font-display font-extrabold text-xl sm:text-3xl text-black mt-1">
            Write Code & Push to GitHub Right Away
          </h1>
          <p className="text-zinc-600 text-xs sm:text-sm mt-1 font-medium">
            Describe what code you need. We'll generate clean TypeScript, create a live preview sandbox, and push directly to GitHub with a link.
          </p>
        </div>
      </div>

      {/* Code Prompt Generator Box */}
      <div className="liquid-glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs text-zinc-700 font-bold uppercase flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-black shrink-0" />
            What code do you want to build?
          </span>
        </div>

        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your component, app, or function in plain words..."
          className="w-full bg-white/95 border border-black/10 rounded-2xl p-3 text-xs sm:text-sm text-black outline-none focus:border-black shadow-inner font-medium"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
            {codePresets.map((cp, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(cp.prompt)}
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-white/80 border border-black/10 text-zinc-800 hover:text-black hover:border-black text-xs whitespace-nowrap cursor-pointer shadow-2xs font-medium shrink-0"
              >
                + {cp.title}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerateCode}
            disabled={loading || !prompt.trim()}
            className="btn-primary-liquid w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Writing Code...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-white" />
                <span>Generate Code</span>
              </>
            )}
          </button>
        </div>

        {/* Thinking Indicator for CodeStudio */}
        {loading && (
          <div className="p-4 rounded-2xl bg-white/95 border border-black/10 space-y-3 shadow-md overflow-hidden relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-4 h-4 rounded-full border-2 border-black/10" />
                  <motion.div 
                    className="absolute inset-0 w-4 h-4 rounded-full border-2 border-t-black border-r-transparent border-b-transparent border-l-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  />
                </div>
                <span className="text-[11px] font-bold text-black uppercase tracking-wider">
                  Architecting implementation...
                </span>
              </div>
            </div>
            <div className="relative h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-black rounded-full"
                animate={{ width: ["10%", "50%", "85%"] }}
                transition={{ duration: 8, ease: "easeInOut" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Code Inspector & Live Sandbox Section */}
      <div id="code-inspector" className="space-y-4 animate-fade-in-up">
        {/* Toolbar */}
        <div className="liquid-glass p-3.5 sm:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'code', label: 'Code', icon: FileCode2 },
              { id: 'sandbox', label: 'Live Test', icon: Play },
              { id: 'readme', label: 'README', icon: Terminal },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-white/80 text-zinc-700 hover:text-black border border-black/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyCode}
              className="btn-glass-secondary px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer font-bold"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownloadZip}
              className="btn-glass-secondary px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer font-bold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download ZIP</span>
            </button>
          </div>
        </div>

        {/* Tab content area... */}
        {activeTab === 'code' && (
          <div className="rounded-2xl sm:rounded-3xl border border-black/10 bg-white overflow-hidden shadow-lg">
            <div className="bg-zinc-100/90 px-3.5 sm:px-4 py-2 sm:py-2.5 border-b border-black/[0.08] flex items-center justify-between text-xs text-zinc-700 font-semibold">
              <div className="flex items-center gap-2 truncate">
                <span className={`w-2 h-2 rounded-full shrink-0 ${streamingFinished ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : isStreaming ? 'bg-blue-500 animate-pulse' : 'bg-black'}`}></span>
                <span className="text-black font-bold truncate">{codeBundle.fileName}</span>
                <span className="text-zinc-400">|</span>
                <span className="text-zinc-600 uppercase font-bold">{codeBundle.language}</span>
                
                {streamingFinished && (
                  <motion.span 
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-1 text-emerald-600 font-bold ml-2"
                  >
                    <Check className="w-3 h-3" />
                    <span>COMPLETE</span>
                  </motion.span>
                )}
              </div>
              <span className="text-zinc-500 font-medium hidden sm:inline">Repo: {codeBundle.repoName}</span>
            </div>

            <div className="p-3.5 sm:p-5 bg-white overflow-x-auto max-h-[500px] min-h-[200px] relative">
              {loading && !isStreaming ? (
                <div className="space-y-3">
                  {[...Array(8)].map((_, i) => (
                    <div 
                      key={i} 
                      className="h-3 bg-zinc-100 rounded-full animate-pulse" 
                      style={{ width: `${Math.random() * 40 + 50}%`, animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                  <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-black" />
                      <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">Architecting...</span>
                    </div>
                  </div>
                </div>
              ) : (
                <StreamingCode 
                  text={codeBundle.code} 
                  streaming={isStreaming} 
                  onComplete={() => {
                    setIsStreaming(false);
                    setStreamingFinished(true);
                  }}
                  speed={15}
                />
              )}
            </div>
          </div>
        )}

        {activeTab === 'sandbox' && (
          <div className="rounded-2xl sm:rounded-3xl border border-black/10 bg-zinc-50 overflow-hidden shadow-xl h-[400px] sm:h-[550px] relative">
            <div className="bg-white/80 backdrop-blur-md px-3.5 sm:px-4 py-2 border-b border-black/[0.08] flex items-center justify-between text-xs text-zinc-700 font-semibold absolute top-0 left-0 right-0 z-10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Interactive Live Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-400 text-[10px] font-mono">SANDBOX ACTIVE</span>
                <span className="text-black font-bold">Running</span>
              </div>
            </div>
            <div className="w-full h-full pt-8">
              <iframe
                key={codeBundle.repoName} // Force re-render on new bundle
                title="Code Preview Sandbox"
                srcDoc={codeBundle.previewHtml || `<!DOCTYPE html><html><body style="background:#fff;color:#000;padding:40px;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;"><div><h3>Preview Loaded</h3><p>${codeBundle.explanation}</p></div></body></html>`}
                className="w-full h-full border-0 bg-white"
                sandbox="allow-scripts allow-same-origin allow-modals"
              />
            </div>
          </div>
        )}

        {activeTab === 'readme' && (
          <div className="liquid-glass p-4 sm:p-8 rounded-2xl sm:rounded-3xl text-xs space-y-3 shadow-sm">
            <span className="text-zinc-700 font-bold uppercase block">README.md</span>
            <pre className="p-3.5 sm:p-4 bg-white/95 border border-black/10 rounded-2xl text-black font-mono whitespace-pre-line leading-relaxed shadow-inner overflow-x-auto">
              {codeBundle.readme}
            </pre>
          </div>
        )}

        {/* Satisfied CTA Section */}
        <div className="mt-8 pt-6 border-t border-black/[0.08] flex flex-col items-center text-center space-y-4">
          <div className="space-y-1">
            <h3 className="font-display font-bold text-base text-black">Satisfied with the code and preview?</h3>
            <p className="text-xs text-zinc-500 font-medium">Create a new repository and push this project directly to your GitHub account</p>
          </div>
          <button
            onClick={() => setIsGitHubModalOpen(true)}
            className="btn-primary-liquid px-8 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg transform hover:scale-105 transition-all"
          >
            <Github className="w-4 h-4" />
            <span>Push to GitHub & Get Live Link</span>
          </button>
        </div>
      </div>

      <GitHubPushModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
        codeBundle={codeBundle}
        defaultToken={githubToken}
        onSaveToken={onSaveGithubToken}
        onPushSuccess={onPushSuccess}
      />
    </div>
  );
};
