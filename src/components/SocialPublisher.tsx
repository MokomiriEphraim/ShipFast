import React, { useState, useRef } from 'react';
import { 
  Share2, 
  Send, 
  Image as ImageIcon, 
  Zap, 
  Loader2, 
  Check, 
  ExternalLink,
  Upload,
  X as XIcon
} from 'lucide-react';
import { SocialPlatform } from '../types';
import { PostPreviewMockup } from './PostPreviewMockups';

interface SocialPublisherProps {
  onPublish: (platforms: SocialPlatform[], content: any, mediaUrl?: string, scheduleTime?: string | null) => Promise<any>;
}

export const SocialPublisher: React.FC<SocialPublisherProps> = ({ onPublish }) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([
    'linkedin', 'x', 'instagram', 'tiktok', 'facebook'
  ]);
  const [activePreviewPlatform, setActivePreviewPlatform] = useState<SocialPlatform>('linkedin');
  
  const [linkedinText, setLinkedinText] = useState(
    "Announcing our new tool: Built in TypeScript with real-time features and clean UI.\n\nKey Highlights:\n- Fast and responsive\n- Clean design\n- Easy to use\n\nCheck out the GitHub link and let us know your thoughts in the comments!\n\n#TypeScript #WebDev #Coding #Software"
  );
  
  const [xText, setXText] = useState(
    "We just built a new TypeScript tool!\n\n- Super fast\n- Instant GitHub link\n- Simple and clean\n\nCheck it out below\n#buildinpublic #typescript #dev"
  );

  const [instagramCaption, setInstagramCaption] = useState(
    "Clean design meets fast coding.\n\nBuilding simple tools that work great. Code is open on GitHub.\n\nDouble tap if you love clean software!"
  );
  const [instagramHashtags, setInstagramHashtags] = useState("#developer #minimalism #software #typescript #coding #tech");

  const [tiktokHook, setTiktokHook] = useState("Here is how to build and deploy code in seconds!");
  const [tiktokScript, setTiktokScript] = useState(
    "0:00 - Look at this screen.\n0:02 - One click writes the code and puts it on GitHub.\n0:05 - Here is the live link.\n0:08 - Try it yourself, link in bio!"
  );
  const [tiktokCaption, setTiktokCaption] = useState("This makes coding so much easier #coding #developer #tech");

  const [facebookText, setFacebookText] = useState(
    "Hello friends! We just released a new coding and content tool. It creates clean code and shares posts to all your favorite social networks in one click. What do you think?"
  );

  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleDateTime, setScheduleDateTime] = useState('');
  
  const [publishing, setPublishing] = useState(false);
  const [publishResults, setPublishResults] = useState<any>(null);
  const [aiOptimizing, setAiOptimizing] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const togglePlatform = (p: SocialPlatform) => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter(item => item !== p));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const handleSelectAll = () => {
    setSelectedPlatforms(['linkedin', 'x', 'instagram', 'tiktok', 'facebook']);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setMediaUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAutoGenerateCopy = async () => {
    if (!aiTopic.trim()) return;
    setAiOptimizing(true);
    try {
      // Check if prompt indicates generating a picture/image
      const wantsImage = /pic|picture|image|photo|artwork|graphic|visual|poster|draw/i.test(aiTopic);

      // Concurrently run text copy generation and optional image generation
      const textPromise = fetch('/api/generate/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiTopic, format: 'all-platforms' })
      }).then(r => r.json());

      let imagePromise: Promise<any> | null = null;
      if (wantsImage) {
        imagePromise = fetch('/api/generate/image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: aiTopic })
        }).then(r => r.json()).catch(err => {
          console.warn('Auto image gen fallback:', err);
          return null;
        });
      }

      const [textData, imgData] = await Promise.all([textPromise, imagePromise]);

      if (textData?.success && textData.data) {
        const d = textData.data;
        if (d.linkedin) setLinkedinText(d.linkedin);
        if (d.xPost) setXText(d.xPost);
        if (d.instagramCaption) setInstagramCaption(d.instagramCaption);
        if (d.instagramHashtags) setInstagramHashtags((d.instagramHashtags || []).join(' '));
        if (d.tiktokHook) setTiktokHook(d.tiktokHook);
        if (d.tiktokScript) setTiktokScript(d.tiktokScript);
        if (d.tiktokCaption) setTiktokCaption(d.tiktokCaption);
        if (d.facebookPost) setFacebookText(d.facebookPost);
      }

      if (imgData?.success && imgData.imageUrl) {
        setMediaUrl(imgData.imageUrl);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiOptimizing(false);
    }
  };

  const handleDispatch = async () => {
    setPublishing(true);
    setPublishResults(null);
    try {
      const contentPayload = {
        linkedin: linkedinText,
        x: { singlePost: xText, thread: [xText] },
        instagram: { caption: instagramCaption, hashtags: instagramHashtags.split(' ') },
        tiktok: { hook: tiktokHook, script: tiktokScript, caption: tiktokCaption },
        facebook: facebookText
      };

      const res = await onPublish(
        selectedPlatforms,
        contentPayload,
        mediaUrl,
        isScheduling && scheduleDateTime ? scheduleDateTime : null
      );
      setPublishResults(res);
    } catch (err: any) {
      alert(`Posting failed: ${err.message}`);
    } finally {
      setPublishing(false);
    }
  };

  const openRealPostLauncher = (platform: string) => {
    if (platform === 'x') {
      const textToTweet = xText;
      window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(textToTweet)}`, '_blank');
    } else if (platform === 'linkedin') {
      navigator.clipboard.writeText(linkedinText);
      window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(linkedinText)}`, '_blank');
    } else if (platform === 'facebook') {
      navigator.clipboard.writeText(facebookText);
      window.open(`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(facebookText)}&u=${encodeURIComponent(window.location.origin)}`, '_blank');
    } else if (platform === 'instagram') {
      navigator.clipboard.writeText(`${instagramCaption}\n\n${instagramHashtags}`);
      window.open('https://www.instagram.com', '_blank');
    } else if (platform === 'tiktok') {
      navigator.clipboard.writeText(`[HOOK]: ${tiktokHook}\n\n[SCRIPT]:\n${tiktokScript}\n\n[CAPTION]: ${tiktokCaption}`);
      window.open('https://www.tiktok.com/upload', '_blank');
    }
  };

  const currentContent = {
    linkedin: linkedinText,
    x: { singlePost: xText, thread: [xText] },
    instagram: { caption: instagramCaption, hashtags: instagramHashtags.split(' ') },
    tiktok: { hook: tiktokHook, script: tiktokScript, caption: tiktokCaption },
    facebook: facebookText
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-5 sm:space-y-6">
      {/* Unified Hero Header + Target Networks + AI Prompt Bar */}
      <div className="liquid-glass rounded-2xl sm:rounded-3xl p-4 sm:p-7 space-y-4 sm:space-y-5 shadow-sm">
        {/* Header Title Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.06] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-black animate-pulse"></span>
              <h1 className="font-display font-black text-xl sm:text-2xl tracking-tight text-black">
                Post to Social Media
              </h1>
            </div>
            <p className="text-zinc-600 text-xs sm:text-sm mt-1 font-medium">
              Post directly to <strong>LinkedIn, X, Instagram, TikTok, and Facebook</strong> all at once or schedule for later.
            </p>
          </div>

          <button
            onClick={handleSelectAll}
            className="btn-glass-secondary w-full sm:w-auto px-3.5 py-1.5 rounded-xl text-xs cursor-pointer font-bold justify-center shrink-0"
          >
            Select All (5)
          </button>
        </div>

        {/* Target Platforms 5-Card Row */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-600">
              Target Social Platforms ({selectedPlatforms.length}/5 Selected)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
            {(['linkedin', 'x', 'instagram', 'tiktok', 'facebook'] as SocialPlatform[]).map((platform) => {
              const isSelected = selectedPlatforms.includes(platform);
              return (
                <div
                  key={platform}
                  onClick={() => togglePlatform(platform)}
                  className={`p-3 sm:p-4 rounded-2xl cursor-pointer transition-all flex flex-col justify-between border ${
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
                  <span className={`text-[10px] mt-2 sm:mt-3 font-mono font-bold uppercase tracking-wider ${
                    isSelected ? 'text-zinc-800' : 'text-zinc-400'
                  }`}>
                    {isSelected ? 'SELECTED' : 'OFF'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Prompt Auto-Writer Bar */}
        <div className="bg-white/80 border border-black/10 p-2.5 sm:p-3 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs text-black font-bold whitespace-nowrap pl-1">
            <Zap className="w-3.5 h-3.5 text-black shrink-0 fill-black" />
            <span>Write with AI:</span>
          </div>
          <input
            type="text"
            value={aiTopic}
            onChange={(e) => setAiTopic(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !aiOptimizing && aiTopic.trim()) {
                handleAutoGenerateCopy();
              }
            }}
            placeholder="What is your post about? (e.g. 'Launching our high-speed developer tool on GitHub')..."
            className="w-full bg-white border border-black/10 rounded-xl px-3 py-2 text-xs text-black outline-none focus:border-black shadow-inner font-medium"
          />
          <button
            onClick={handleAutoGenerateCopy}
            disabled={aiOptimizing || !aiTopic.trim()}
            className="btn-primary-liquid px-4 py-2 rounded-xl text-xs whitespace-nowrap flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 font-semibold shrink-0"
          >
            {aiOptimizing ? <Loader2 className="w-3.5 h-3.5 animate-spin text-white" /> : <Zap className="w-3.5 h-3.5 fill-white" />}
            <span>{aiOptimizing ? 'Generating...' : `Write for ${selectedPlatforms.length === 5 ? 'All 5' : `${selectedPlatforms.length} Platforms`}`}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace (Editing & Live Preview) with Blurred Loading State */}
      <div className="relative">
        {/* Blurred Loading Overlay when Generating Content */}
        {aiOptimizing && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/60 backdrop-blur-md rounded-3xl p-6 transition-all duration-300 shadow-xl border border-black/10 min-h-[420px]">
            <div className="bg-black text-white p-6 sm:p-8 rounded-3xl shadow-2xl max-w-md w-full text-center space-y-4 border border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto shadow-inner">
                <Loader2 className="w-6 h-6 animate-spin text-white" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-extrabold text-base sm:text-lg text-white">
                  Generating 5 Social Media Posts
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Tailoring formatting, hooks, hashtags, scripts & threads for LinkedIn, X, Instagram, TikTok & Facebook...
                </p>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-white h-full w-2/3 animate-pulse rounded-full"></div>
              </div>
            </div>
          </div>
        )}

        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 transition-all duration-300 ${
          aiOptimizing ? 'filter blur-[2px] opacity-40 pointer-events-none select-none' : ''
        }`}>
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5">
            <div className="liquid-glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/[0.06] pb-3">
              <span className="text-xs text-zinc-700 font-bold uppercase">
                Editing: {activePreviewPlatform.toUpperCase()}
              </span>
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {(['linkedin', 'x', 'instagram', 'tiktok', 'facebook'] as SocialPlatform[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setActivePreviewPlatform(p)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all shrink-0 ${
                      activePreviewPlatform === p
                        ? 'bg-black text-white font-bold'
                        : 'bg-white text-zinc-700 hover:text-black border border-black/10'
                    }`}
                  >
                    {p.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Specific Form */}
            {activePreviewPlatform === 'linkedin' && (
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-600 font-semibold">
                  <span>LinkedIn Post Text</span>
                  <span>{linkedinText.length} / 3000 letters</span>
                </div>
                <textarea
                  rows={7}
                  value={linkedinText}
                  onChange={(e) => setLinkedinText(e.target.value)}
                  className="w-full bg-white/95 border border-black/10 rounded-xl p-3 text-xs text-black outline-none focus:border-black font-sans leading-relaxed shadow-inner"
                />
              </div>
            )}

            {activePreviewPlatform === 'x' && (
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-600 font-semibold">
                  <span>X / Twitter Post Text</span>
                  <span className={xText.length > 280 ? 'text-red-500 font-bold' : ''}>
                    {xText.length} / 280 letters
                  </span>
                </div>
                <textarea
                  rows={5}
                  value={xText}
                  onChange={(e) => setXText(e.target.value)}
                  className={`w-full bg-white/95 border rounded-xl p-3 text-xs text-black outline-none font-sans leading-relaxed shadow-inner ${
                    xText.length > 280 ? 'border-red-500' : 'border-black/10 focus:border-black'
                  }`}
                />
              </div>
            )}

            {activePreviewPlatform === 'instagram' && (
              <div className="space-y-2 sm:space-y-3">
                <div className="text-xs text-zinc-700 font-bold">Instagram Caption</div>
                <textarea
                  rows={5}
                  value={instagramCaption}
                  onChange={(e) => setInstagramCaption(e.target.value)}
                  className="w-full bg-white/95 border border-black/10 rounded-xl p-3 text-xs text-black outline-none focus:border-black font-sans shadow-inner"
                />
                <div className="text-xs text-zinc-700 font-bold">Hashtags</div>
                <input
                  type="text"
                  value={instagramHashtags}
                  onChange={(e) => setInstagramHashtags(e.target.value)}
                  className="w-full bg-white/95 border border-black/10 rounded-xl px-3 py-2 text-xs text-black outline-none focus:border-black shadow-inner"
                />
              </div>
            )}

            {activePreviewPlatform === 'tiktok' && (
              <div className="space-y-2 sm:space-y-3">
                <div className="text-xs text-zinc-700 font-bold">3-Second Video Hook</div>
                <input
                  type="text"
                  value={tiktokHook}
                  onChange={(e) => setTiktokHook(e.target.value)}
                  className="w-full bg-white/95 border border-black/10 rounded-xl px-3 py-2 text-xs text-black outline-none focus:border-black shadow-inner"
                />
                <div className="text-xs text-zinc-700 font-bold">Video Script</div>
                <textarea
                  rows={4}
                  value={tiktokScript}
                  onChange={(e) => setTiktokScript(e.target.value)}
                  className="w-full bg-white/95 border border-black/10 rounded-xl p-3 text-xs text-black outline-none focus:border-black shadow-inner"
                />
                <div className="text-xs text-zinc-700 font-bold">Post Caption</div>
                <input
                  type="text"
                  value={tiktokCaption}
                  onChange={(e) => setTiktokCaption(e.target.value)}
                  className="w-full bg-white/95 border border-black/10 rounded-xl px-3 py-2 text-xs text-black outline-none focus:border-black shadow-inner"
                />
              </div>
            )}

            {activePreviewPlatform === 'facebook' && (
              <div className="space-y-2 sm:space-y-3">
                <div className="text-xs text-zinc-700 font-bold">Facebook Post Text</div>
                <textarea
                  rows={6}
                  value={facebookText}
                  onChange={(e) => setFacebookText(e.target.value)}
                  className="w-full bg-white/95 border border-black/10 rounded-xl p-3 text-xs text-black outline-none focus:border-black font-sans shadow-inner"
                />
              </div>
            )}

            {/* Media Attachment: Direct Upload from PC or Auto-Generated by Prompt */}
            <div className="pt-3 border-t border-black/[0.06] space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs text-zinc-700 font-bold flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-black shrink-0" />
                  <span>Attached Image (Post Media)</span>
                </label>
                <span className="text-[10px] text-zinc-500 font-medium">
                  Upload from PC or describe in prompt above
                </span>
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />

              {mediaUrl ? (
                /* Attached Image Preview Card */
                <div className="bg-white/90 border border-black/10 rounded-2xl p-2.5 flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/5 border border-black/10 shrink-0">
                      <img src={mediaUrl} alt="Attached preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-black truncate">Image attached & ready</p>
                      <p className="text-[10px] text-zinc-500 truncate">Will be published with your post</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 rounded-lg border border-black/10 text-[11px] font-bold text-black hover:bg-black/5 cursor-pointer"
                    >
                      Change
                    </button>
                    <button
                      onClick={() => setMediaUrl('')}
                      className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                      title="Remove attached image"
                    >
                      <XIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                /* PC Upload Dropzone Button */
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-3.5 rounded-2xl border-2 border-dashed border-black/20 hover:border-black bg-white/60 hover:bg-white flex items-center justify-center gap-2.5 text-xs font-bold text-black cursor-pointer transition-all shadow-2xs"
                >
                  <Upload className="w-4 h-4 text-black" />
                  <span>Upload Image from PC</span>
                </button>
              )}
            </div>
          </div>

          {/* Post Action */}
          <div className="liquid-glass rounded-2xl sm:rounded-3xl p-4 sm:p-5 space-y-3 sm:space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="scheduleToggle"
                  checked={isScheduling}
                  onChange={(e) => setIsScheduling(e.target.checked)}
                  className="accent-black cursor-pointer w-4 h-4"
                />
                <label htmlFor="scheduleToggle" className="text-xs text-black font-bold cursor-pointer">
                  Schedule for later
                </label>
              </div>

              {isScheduling && (
                <input
                  type="datetime-local"
                  value={scheduleDateTime}
                  onChange={(e) => setScheduleDateTime(e.target.value)}
                  className="bg-white border border-black/10 rounded-xl px-3 py-1.5 text-xs text-black outline-none shadow-xs w-full sm:w-auto"
                />
              )}
            </div>

            <button
              onClick={handleDispatch}
              disabled={publishing || selectedPlatforms.length === 0}
              className="btn-primary-liquid w-full py-3 sm:py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 font-semibold"
            >
              {publishing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Posting to {selectedPlatforms.length} platforms...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>
                    {isScheduling ? `Schedule for ${selectedPlatforms.length} Platforms` : `Post to ${selectedPlatforms.length} Platforms Now`}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Results Box */}
          {publishResults && (
            <div className="liquid-glass p-4 sm:p-5 rounded-2xl sm:rounded-3xl space-y-3 shadow-md border-2 border-black/10">
              <div className="flex items-center justify-between">
                <span className="text-xs text-black font-extrabold flex items-center gap-1.5">
                  <Check className="w-4 h-4 stroke-[3]" />
                  Post Successful!
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-black text-white font-bold">
                  {publishResults.dispatchedCount} Platforms
                </span>
              </div>
              <p className="text-xs text-zinc-800 font-medium">{publishResults.summary}</p>
              
              <div className="space-y-2 pt-1">
                {Object.entries(publishResults.results || {}).map(([p, r]: [string, any]) => (
                  <div key={p} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white/90 p-2.5 rounded-xl border border-black/10 text-xs shadow-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-black"></span>
                      <span className="text-black font-bold uppercase">{p}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openRealPostLauncher(p)}
                        className="px-2.5 py-1 rounded-lg bg-black text-white hover:bg-zinc-800 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>Post on {p.toUpperCase()}</span>
                      </button>
                      <a
                        href={r.postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-600 hover:text-black font-semibold flex items-center gap-1 hover:underline text-[11px]"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Mockup View */}
        <div className="lg:col-span-6 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-zinc-700 font-bold uppercase">
              Live Preview
            </span>
            <span className="text-[10px] text-zinc-500 font-bold">
              Exact Platform Look
            </span>
          </div>

          <PostPreviewMockup
            platform={activePreviewPlatform}
            content={currentContent}
            imageUrl={mediaUrl}
          />
        </div>
      </div>
    </div>
  </div>
  );
};
