import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Share2, 
  Code2, 
  Image as ImageIcon, 
  Loader2, 
  Copy, 
  Check, 
  Github, 
  Download, 
  Play, 
  FileCode2, 
  Layers
} from 'lucide-react';
import JSZip from 'jszip';
import { OmniGenerationResult, SocialPlatform, GitHubPushResult } from '../types';
import { PostPreviewMockup } from './PostPreviewMockups';
import { GitHubPushModal } from './GitHubPushModal';
import { StreamingCode } from './StreamingCode';

interface OmniGeneratorProps {
  initialPrompt?: string;
  onPublishToSocial: (platforms: SocialPlatform[], content: any, mediaUrl?: string, scheduleTime?: string | null) => Promise<any>;
  onSaveToHistory: (result: OmniGenerationResult) => void;
  onPushSuccess: (result: GitHubPushResult) => void;
  githubToken?: string;
  onSaveGithubToken?: (token: string) => void;
  openaiApiKey?: string;
}

export const OmniGenerator: React.FC<OmniGeneratorProps> = ({
  initialPrompt = '',
  onPublishToSocial,
  onSaveToHistory,
  onPushSuccess,
  githubToken,
  onSaveGithubToken,
  openaiApiKey
}) => {
  const [prompt, setPrompt] = useState(
    initialPrompt || 'Next.js 15 AI agent SaaS with clean glass UI, Stripe subscription billing, real-time streaming, and launch campaigns for LinkedIn, X threads, Instagram, TikTok and Facebook'
  );
  const [tone, setTone] = useState('Professional & Friendly');
  const [language, setLanguage] = useState('typescript');
  const [targetPlatforms, setTargetPlatforms] = useState<SocialPlatform[]>(['linkedin', 'x', 'instagram', 'tiktok', 'facebook']);
  
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState<string>('');
  const [result, setResult] = useState<OmniGenerationResult | null>(null);
  const [activeTab, setActiveTab] = useState<'social' | 'code' | 'preview' | 'image' | 'summary'>('social');
  const [selectedSocialPlatform, setSelectedSocialPlatform] = useState<SocialPlatform>('linkedin');
  
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isStreamingCode, setIsStreamingCode] = useState(false);
  const [streamingFinished, setStreamingFinished] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishFeedback, setPublishFeedback] = useState<string | null>(null);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | null>(0);

  const togglePlatform = (p: SocialPlatform) => {
    if (targetPlatforms.includes(p)) {
      if (targetPlatforms.length > 1) {
        setTargetPlatforms(targetPlatforms.filter(item => item !== p));
      }
    } else {
      setTargetPlatforms([...targetPlatforms, p]);
    }
  };

  const presets = [
    {
      title: "AI SaaS Launch",
      tag: "SaaS Launch",
      tone: "Professional & Friendly",
      language: "typescript",
      prompt: "Next.js 15 AI agent SaaS with clean glass UI, Stripe subscription billing, real-time streaming, and launch campaigns for LinkedIn, X threads, Instagram, TikTok and Facebook"
    },
    {
      title: "Crypto Trading Bot",
      tag: "Trading Bot",
      tone: "Technical & Detailed",
      language: "typescript",
      prompt: "Real-time Crypto Arbitrage and Algorithmic Trading Bot with live WebSocket orderbook, profit simulator in TypeScript, and social announcement posts"
    },
    {
      title: "AI Video Studio",
      tag: "Video Studio",
      tone: "Professional & Friendly",
      language: "typescript",
      prompt: "AI Video Generator Studio with multi-track timeline, voiceover synthesis, dynamic waveform audio visualizer in React, and launch posts with TikTok hooks and Instagram carousels"
    },
    {
      title: "Social Agent",
      tag: "Social Agent",
      tone: "Professional & Friendly",
      language: "typescript",
      prompt: "Autonomous Multi-Agent Hub that monitors trending tech topics, drafts carousels, generates visuals, and publishes to LinkedIn, X, Instagram, TikTok, and Facebook"
    }
  ];

  const handleSelectPreset = (p: typeof presets[0], index: number) => {
    setPrompt(p.prompt);
    setTone(p.tone);
    setLanguage(p.language);
    setSelectedPresetIndex(index);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult(null);
    setStreamingFinished(false);
    setPublishFeedback(null);
    setActiveStep('Starting generation...');

    try {
      setTimeout(() => setActiveStep('Writing posts for LinkedIn, X, Instagram, TikTok & Facebook...'), 600);
      setTimeout(() => setActiveStep('Writing clean TypeScript code and live preview...'), 1600);
      setTimeout(() => setActiveStep('Creating high quality images...'), 2600);

      const res = await fetch('/api/generate/omni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          tone,
          targetPlatforms,
          language,
          openaiApiKey
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Generation failed');
      }

      const generationResult: OmniGenerationResult = {
        id: `post_${Date.now()}`,
        prompt,
        headline: data.data.headline,
        summary: data.data.summary,
        social: data.data.social,
        code: data.data.code,
        imagePrompt: data.data.imagePrompt,
        imageStyle: data.data.imageStyle,
        imageAspectRatio: data.data.imageAspectRatio,
        imageUrl: data.data.imageUrl,
        tags: data.data.tags || ['#Tech', '#Coding', '#WebDev', '#TypeScript'],
        generatedAt: data.data.generatedAt || new Date().toISOString()
      };

      setResult(generationResult);
      setActiveTab('code');
      setIsStreamingCode(true);
      setStreamingFinished(false);
      onSaveToHistory(generationResult);

      // Scroll to result area
      setTimeout(() => {
        const resultEl = document.getElementById('generation-result');
        if (resultEl) {
          resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err: any) {
      console.error(err);
      setPublishFeedback(`Error: ${err.message}`);
    } finally {
      setLoading(false);
      setActiveStep('');
    }
  };

  const handlePublishAll = async () => {
    if (!result) return;
    setPublishing(true);
    setPublishFeedback(null);
    try {
      await onPublishToSocial(
        targetPlatforms,
        result.social,
        result.imageUrl
      );
      setPublishFeedback(`Successfully posted to all 5 social platforms! You can see your live links in Post History.`);
    } catch (err: any) {
      setPublishFeedback(`Failed to post: ${err.message}`);
    } finally {
      setPublishing(false);
    }
  };

  const handleCopyCode = () => {
    if (!result?.code?.code) return;
    navigator.clipboard.writeText(result.code.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadZip = async () => {
    if (!result?.code) return;
    const zip = new JSZip();
    const repoName = result.code.repoName || 'my-new-app';

    zip.file(result.code.fileName || 'App.tsx', result.code.code);
    zip.file('README.md', result.code.readme || `# ${repoName}\n\n${result.summary}`);
    
    const packageJson = {
      name: repoName,
      version: '1.0.0',
      private: true,
      description: result.headline,
      dependencies: {
        react: "^19.0.0",
        "react-dom": "^19.0.0",
        "lucide-react": "^0.546.0"
      }
    };
    zip.file('package.json', JSON.stringify(packageJson, null, 2));

    if (result.code.previewHtml) {
      zip.file('index.html', result.code.previewHtml);
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${repoName}.zip`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-5 sm:space-y-8">
      {/* Hero Header Section */}
      <div className="liquid-glass rounded-2xl sm:rounded-3xl p-4 sm:p-8 relative overflow-hidden shadow-sm">
        <div className="max-w-3xl space-y-2 sm:space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/80 border border-black/10 text-[11px] sm:text-xs text-zinc-800 font-bold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-black"></span>
            <span>ALL-IN-ONE GENERATOR</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl tracking-tight text-black leading-tight">
            Generate Code, Social Posts & Images in One Click
          </h1>
          <p className="text-zinc-600 text-xs sm:text-base leading-relaxed font-medium">
            Type your idea below. We'll write customized posts for <strong>LinkedIn, X, Instagram, TikTok & Facebook</strong>, write working <strong>code with instant GitHub push</strong>, and generate images ready to post.
          </p>
        </div>

        {/* Input Master Box */}
        <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 relative z-10">
          {/* Target Social Platforms Selector directly on top of the chat bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-600">
                Target Social Platforms ({targetPlatforms.length}/5 Selected)
              </span>
              <button
                onClick={() => setTargetPlatforms(['linkedin', 'x', 'instagram', 'tiktok', 'facebook'])}
                className="text-[11px] font-mono font-bold uppercase text-black hover:underline cursor-pointer"
              >
                Select All
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
              {(['linkedin', 'x', 'instagram', 'tiktok', 'facebook'] as SocialPlatform[]).map((platform) => {
                const isSelected = targetPlatforms.includes(platform);
                return (
                  <div
                    key={platform}
                    onClick={() => togglePlatform(platform)}
                    className={`p-3 sm:p-3.5 rounded-2xl cursor-pointer transition-all flex flex-col justify-between border ${
                      isSelected
                        ? 'bg-white border-black shadow-sm transform -translate-y-0.5'
                        : 'bg-white/60 border-black/10 hover:border-black/40 hover:bg-white text-zinc-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-mono font-bold uppercase ${isSelected ? 'text-black' : 'text-zinc-500'}`}>
                        {platform}
                      </span>
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                        isSelected ? 'bg-black text-white border-black' : 'border-zinc-300 bg-white'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                    <span className={`text-[10px] mt-2 font-mono font-bold uppercase tracking-wider ${
                      isSelected ? 'text-zinc-800' : 'text-zinc-400'
                    }`}>
                      {isSelected ? 'SELECTED' : 'OFF'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative rounded-2xl border border-black/10 bg-white/90 backdrop-blur-xl p-2.5 sm:p-3.5 shadow-sm focus-within:border-black focus-within:ring-2 focus-within:ring-black/5 transition-all">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="What would you like to create? (e.g. 'A real-time notification app with clean UI and social media launch posts')..."
              className="w-full bg-transparent p-1.5 sm:p-2 text-xs sm:text-sm text-black placeholder-zinc-400 outline-none resize-none font-sans font-medium"
            />

            {/* Quick config options row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-3 pt-3 px-1 border-t border-black/[0.06]">
              {/* Action Button */}
              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="btn-primary-liquid w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Generate Everything</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Instant Demo Presets */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] text-zinc-600 font-bold uppercase tracking-wider">
                Instant Demo Prompts (Click to Load):
              </span>
              <span className="text-[10px] text-zinc-500 font-medium hidden sm:inline">
                Auto-configures Tone & Code Language
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
              {presets.map((p, idx) => {
                const isSelected = selectedPresetIndex === idx && prompt === p.prompt;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectPreset(p, idx)}
                    className={`px-3 py-1.5 rounded-xl border text-xs whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 font-semibold shrink-0 ${
                      isSelected
                        ? 'bg-black text-white border-black shadow-sm transform -translate-y-0.5'
                        : 'bg-white/80 border-black/10 hover:border-black text-zinc-800 hover:text-black hover:bg-white shadow-2xs'
                    }`}
                  >
                    <span>{p.tag}</span>
                    <span className={`text-[10px] ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>• {p.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Loading progress indicator */}
        {loading && (
          <div className="mt-4 sm:mt-6 p-5 rounded-2xl bg-white/95 border border-black/10 space-y-4 shadow-lg overflow-hidden relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-5 h-5 rounded-full border-2 border-black/10" />
                  <motion.div 
                    className="absolute inset-0 w-5 h-5 rounded-full border-2 border-t-black border-r-transparent border-b-transparent border-l-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  />
                  <motion.div 
                    className="absolute inset-0 w-5 h-5 rounded-full bg-black/5"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-black uppercase tracking-wider block">
                    Thinking...
                  </span>
                  <span className="text-[10px] text-zinc-500 font-medium block">
                    {activeStep}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded-md border border-zinc-100">
                AI ENGINE ACTIVE
              </span>
            </div>
            
            <div className="relative h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-black rounded-full"
                animate={{ width: ["10%", "30%", "60%", "90%"] }}
                transition={{ duration: 10, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ left: ["-20%", "120%"] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Generated Results */}
      {result && (
        <div id="generation-result" className="space-y-4 sm:space-y-6 animate-fade-in-up">
          {/* Top Bar */}
          <div className="liquid-glass p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4 shadow-sm">
            <div className="w-full md:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-md bg-black/5 border border-black/10 text-black font-bold">
                  Ready to post
                </span>
                <span className="text-xs text-zinc-500 font-medium">
                  {new Date(result.generatedAt).toLocaleTimeString()}
                </span>
              </div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-black mt-1 leading-snug">
                {result.headline}
              </h2>
            </div>

            {/* Quick Action buttons */}
            <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                onClick={handlePublishAll}
                disabled={publishing}
                className="btn-primary-liquid w-full sm:w-auto px-4 py-2 sm:py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {publishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>Post to All 5</span>
              </button>

              <button
                onClick={() => setIsGitHubModalOpen(true)}
                className="btn-glass-secondary w-full sm:w-auto px-4 py-2 sm:py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer font-bold"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Push to GitHub</span>
              </button>

              <button
                onClick={handleDownloadZip}
                className="btn-glass-secondary w-full sm:w-auto px-3.5 py-2 sm:py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer font-bold"
                title="Download complete project ZIP"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ZIP</span>
              </button>
            </div>
          </div>

          {/* Feedback banner */}
          {publishFeedback && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-black/10 text-xs text-black font-semibold flex items-center justify-between shadow-sm">
              <span>{publishFeedback}</span>
              <button onClick={() => setPublishFeedback(null)} className="text-zinc-500 hover:text-black">✕</button>
            </div>
          )}

          {/* Tab Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-2 border-b border-black/[0.08] pb-2 overflow-x-auto scrollbar-none">
            {[
              { id: 'social', label: 'Social Posts', icon: Share2 },
              { id: 'code', label: 'Code', icon: Code2 },
              { id: 'preview', label: 'Live Test', icon: Play },
              { id: 'image', label: 'Image', icon: ImageIcon },
              { id: 'summary', label: 'Overview', icon: Layers },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs transition-all cursor-pointer whitespace-nowrap font-semibold flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-black text-white shadow-md'
                    : 'bg-white/60 text-zinc-700 hover:text-black hover:bg-white border border-black/[0.06]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: SOCIAL NETWORKS */}
          {activeTab === 'social' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
              <div className="lg:col-span-5 space-y-4">
                <div className="liquid-glass rounded-2xl p-4 sm:p-5 space-y-3">
                  <span className="text-xs text-zinc-600 font-bold uppercase tracking-wider block">
                    Choose Platform to Preview & Edit
                  </span>
                  <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                    {(['linkedin', 'x', 'instagram', 'tiktok', 'facebook'] as SocialPlatform[]).map((p) => (
                      <button
                        key={p}
                        onClick={() => setSelectedSocialPlatform(p)}
                        className={`p-2 sm:p-2.5 rounded-xl text-center text-xs font-bold cursor-pointer border transition-all truncate ${
                          selectedSocialPlatform === p
                            ? 'bg-black text-white border-black shadow-sm'
                            : 'bg-white/80 text-zinc-700 border-black/10 hover:text-black hover:bg-white'
                        }`}
                      >
                        {p.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="liquid-glass rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-700 font-bold uppercase">Post Details</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/5 text-black font-bold">
                      Ready
                    </span>
                  </div>
                  <div className="space-y-2 text-xs text-zinc-700 font-medium">
                    <div className="flex justify-between py-1 border-b border-black/[0.06]">
                      <span>Platform</span>
                      <span className="text-black font-bold uppercase">{selectedSocialPlatform}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-black/[0.06]">
                      <span>Image attached</span>
                      <span className="text-black font-bold">Yes (High Res)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-black/[0.06]">
                      <span>Hashtags</span>
                      <span className="text-black font-bold truncate max-w-[180px]">{result.tags?.join(' ')}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => onPublishToSocial([selectedSocialPlatform], result.social, result.imageUrl)}
                      className="w-full btn-primary-liquid py-2.5 sm:py-3 rounded-xl text-xs font-semibold cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Post to {selectedSocialPlatform.toUpperCase()} Only</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Post Preview */}
              <div className="lg:col-span-7">
                <PostPreviewMockup
                  platform={selectedSocialPlatform}
                  content={result.social}
                  imageUrl={result.imageUrl}
                />
              </div>
            </div>
          )}

          {/* TAB 2: CODE */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="liquid-glass p-3.5 sm:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-black text-white flex items-center justify-center font-bold shadow-sm shrink-0">
                    <FileCode2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-black">{result.code.fileName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-black/5 text-black font-bold uppercase">
                        {result.code.language}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 font-medium">Repo: {result.code.repoName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleCopyCode}
                    className="btn-glass-secondary flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer font-bold"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white/95 backdrop-blur-2xl overflow-hidden shadow-lg">
                <div className="bg-zinc-100/90 px-3.5 sm:px-4 py-2 sm:py-2.5 border-b border-black/[0.08] flex items-center justify-between text-xs text-zinc-700 font-semibold">
                  <span className="flex items-center gap-2 truncate">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${streamingFinished ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : isStreamingCode ? 'bg-blue-500 animate-pulse' : 'bg-black'}`}></span>
                    <span className="truncate">{result.code.fileName}</span>
                    {streamingFinished && (
                      <motion.span 
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-1 text-emerald-600 font-bold ml-2"
                      >
                        <Check className="w-3 h-3" />
                        <span>READY</span>
                      </motion.span>
                    )}
                  </span>
                  <span className="hidden sm:inline">{result.code.commitMessage}</span>
                </div>
                <div className="p-3.5 sm:p-5 bg-white overflow-x-auto max-h-[500px] min-h-[200px] relative">
                  {loading && !isStreamingCode ? (
                    <div className="space-y-3">
                      {[...Array(6)].map((_, i) => (
                        <div 
                          key={i} 
                          className="h-3 bg-zinc-100 rounded-full animate-pulse" 
                          style={{ width: `${Math.random() * 40 + 50}%`, animationDelay: `${i * 100}ms` }}
                        />
                      ))}
                      <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="w-6 h-6 animate-spin text-black" />
                          <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">Writing...</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <StreamingCode 
                      text={result.code.code} 
                      streaming={isStreamingCode} 
                      onComplete={() => {
                        setIsStreamingCode(false);
                        setStreamingFinished(true);
                      }}
                      speed={15}
                    />
                  )}
                </div>
              </div>

              {result.code.readme && (
                <div className="liquid-glass p-4 sm:p-5 rounded-2xl space-y-2">
                  <span className="text-xs text-zinc-700 font-bold uppercase block">README.md</span>
                  <pre className="text-xs font-mono text-black whitespace-pre-line bg-white/90 p-3 sm:p-4 rounded-xl border border-black/[0.08] shadow-inner overflow-x-auto">
                    {result.code.readme}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LIVE PREVIEW */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="liquid-glass p-3.5 sm:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
                <div>
                  <h3 className="font-display font-bold text-sm text-black">Live Interactive Preview</h3>
                  <p className="text-xs text-zinc-600 font-medium">Test your generated code right here in the browser</p>
                </div>
              </div>

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
                    key={result.id} // Force re-render on new generation
                    title="Live Preview"
                    srcDoc={result.code.previewHtml || `<!DOCTYPE html><html><head><meta charset="UTF-8"><script src="https://cdn.tailwindcss.com"></script></head><body class="bg-white text-black p-8 font-sans h-screen flex items-center justify-center m-0"><div class="p-6 bg-zinc-50 border border-zinc-200 rounded-2xl shadow-sm max-w-sm w-full text-center"><h2 class="text-lg font-bold mb-2">${result.headline}</h2><p class="text-zinc-600 text-xs mb-4">${result.summary}</p><button class="w-full bg-black text-white font-semibold py-2.5 rounded-xl text-xs">Click to test</button></div></body></html>`}
                    className="w-full h-full border-0 bg-white"
                    sandbox="allow-scripts allow-same-origin allow-modals"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: IMAGE */}
          {activeTab === 'image' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
              <div className="lg:col-span-8 rounded-2xl sm:rounded-3xl liquid-glass overflow-hidden shadow-lg p-3 sm:p-4 flex flex-col items-center justify-center relative group">
                <img
                  src={result.imageUrl}
                  alt="Generated"
                  className="w-full h-auto rounded-xl sm:rounded-2xl border border-black/10 object-cover max-h-[550px] shadow-md"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <a
                    href={result.imageUrl}
                    download={`image_${result.id}.png`}
                    className="p-3 bg-white text-black rounded-full shadow-lg hover:scale-110 transition-transform"
                    title="Download Image"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                </div>
              </div>
              <div className="lg:col-span-4 space-y-4">
                <div className="liquid-glass p-4 sm:p-5 rounded-2xl space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs text-zinc-700 font-bold uppercase block">AI VISION LOG</span>
                    <p className="text-[11px] text-zinc-500 font-medium">Style: {result.imageStyle || 'Auto-detected'}</p>
                  </div>
                  
                  <div className="p-3.5 bg-white/90 rounded-xl border border-black/10 shadow-inner">
                    <p className="text-xs text-black italic font-medium leading-relaxed">
                      "{result.imagePrompt}"
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <span className="text-[11px] text-zinc-600 font-bold uppercase tracking-wider block">Quick Post with Image:</span>
                    <div className="grid grid-cols-1 gap-2">
                      {(['linkedin', 'x', 'instagram', 'tiktok', 'facebook'] as SocialPlatform[]).map((p) => (
                        <button
                          key={p}
                          onClick={() => onPublishToSocial([p], result.social, result.imageUrl)}
                          className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-black/10 hover:border-black bg-white hover:bg-zinc-50 transition-all text-xs font-bold cursor-pointer group"
                        >
                          <span className="uppercase">{p}</span>
                          <Share2 className="w-3.5 h-3.5 text-zinc-400 group-hover:text-black transition-colors" />
                        </button>
                      ))}
                    </div>
                    
                    <div className="pt-3 border-t border-black/[0.06]">
                      <a
                        href={result.imageUrl}
                        download={`image_${result.id}.png`}
                        className="btn-glass-secondary w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Save to Device</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: OVERVIEW */}
          {activeTab === 'summary' && (
            <div className="liquid-glass p-5 sm:p-8 rounded-2xl sm:rounded-3xl space-y-4 shadow-sm">
              <div>
                <span className="text-xs text-zinc-500 font-bold uppercase">Overview</span>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-black mt-1">{result.headline}</h3>
              </div>
              <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed font-medium">{result.summary}</p>
            </div>
          )}

          {/* Satisfied CTA Section */}
          <div className="mt-8 pt-6 border-t border-black/[0.08] flex flex-col items-center text-center space-y-4">
            <div className="space-y-1">
              <h3 className="font-display font-bold text-base text-black">Satisfied with the result?</h3>
              <p className="text-xs text-zinc-500 font-medium">Push your code and preview to a new GitHub repository in one click</p>
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
      )}

      {/* GitHub Push Modal */}
      {result && (
        <GitHubPushModal
          isOpen={isGitHubModalOpen}
          onClose={() => setIsGitHubModalOpen(false)}
          codeBundle={result.code}
          defaultToken={githubToken}
          onSaveToken={onSaveGithubToken}
          onPushSuccess={onPushSuccess}
        />
      )}
    </div>
  );
};
