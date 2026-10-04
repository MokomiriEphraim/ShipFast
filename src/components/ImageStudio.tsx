import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Image as ImageIcon, 
  Download, 
  Copy, 
  Check, 
  Share2, 
  Loader2, 
  Ratio, 
  Palette, 
  Zap 
} from 'lucide-react';

interface ImageStudioProps {
  onSendToSocial: (imageUrl: string) => void;
  openaiApiKey?: string;
}

export const ImageStudio: React.FC<ImageStudioProps> = ({ onSendToSocial, openaiApiKey }) => {
  const [prompt, setPrompt] = useState(
    'Modern clean glass tech illustration with soft light reflections and sleek shapes'
  );
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '1:1' | '9:16' | '4:3'>('16:9');
  const [style, setStyle] = useState('minimalist clean modern');
  
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const styles = [
    { id: 'minimalist clean modern', label: 'Clean & Minimal' },
    { id: 'isometric blueprint white on black tech design', label: 'Tech Blueprint' },
    { id: '3D modern glass render luxury lighting', label: '3D Glass' },
    { id: 'clean typography graphic poster design', label: 'Graphic Poster' }
  ];

  const aspectRatios = [
    { id: '16:9', label: '16:9 (X & LinkedIn)' },
    { id: '1:1', label: '1:1 (Instagram)' },
    { id: '9:16', label: '9:16 (TikTok & Story)' },
    { id: '4:3', label: '4:3 (Card)' }
  ] as const;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/generate/image', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(openaiApiKey ? { 'x-openai-key': openaiApiKey } : {})
        },
        body: JSON.stringify({
          prompt,
          style,
          aspectRatio,
          openaiApiKey
        })
      });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        setCurrentImage(data.imageUrl);
      } else if (data.error) {
        alert(`Image error: ${data.error}`);
      }
    } catch (e: any) {
      alert(`Image error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUri = () => {
    if (!currentImage) return;
    navigator.clipboard.writeText(currentImage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-5 sm:space-y-8">
      {/* Header */}
      <div className="liquid-glass rounded-2xl sm:rounded-3xl p-4 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 shadow-sm">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-black"></span>
            <span className="text-xs text-zinc-600 font-bold uppercase tracking-widest">SMART IMAGE ENGINE</span>
          </div>
          <h1 className="font-display font-extrabold text-xl sm:text-3xl text-black mt-1 leading-tight">
            Architect Visuals with Natural Language
          </h1>
          <p className="text-zinc-600 text-xs sm:text-sm mt-1.5 font-medium">
            Just describe what you want. Our AI automatically determines the best **Art Style** and **Aspect Ratio** for your platforms.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8">
        {/* Left Controls */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-5">
          <div className="liquid-glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4 shadow-sm relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div>
                <label className="text-xs text-zinc-700 font-bold uppercase block mb-2 flex items-center gap-1.5 tracking-wider">
                  <ImageIcon className="w-3.5 h-3.5 text-black shrink-0" />
                  What are we creating?
                </label>
                <textarea
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. 'A 9:16 cyberpunk poster for a hackathon' or 'A 1:1 minimalist logo for a tech startup'..."
                  className="w-full bg-white/95 border border-black/10 rounded-2xl p-4 text-xs sm:text-sm text-black font-sans outline-none focus:border-black shadow-inner font-medium placeholder:text-zinc-400 leading-relaxed"
                />
              </div>

              <div className="p-3.5 bg-zinc-50 border border-black/[0.03] rounded-xl">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">
                  💡 Tip: Mention aspect ratios (9:16, 16:9, 1:1) or styles in your prompt and the AI will listen.
                </p>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="btn-primary-liquid w-full py-3.5 sm:py-4 rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 font-bold tracking-wider uppercase shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Architecting Vision...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Generate Vision</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {currentImage && (
            <div className="liquid-glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3.5 shadow-sm">
              <span className="text-[11px] text-zinc-600 font-bold uppercase tracking-widest block">Quick Post with this Image:</span>
              <div className="grid grid-cols-1 gap-2">
                {(['linkedin', 'x', 'instagram', 'tiktok', 'facebook'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => onSendToSocial(currentImage)}
                    className="flex items-center justify-between px-3.5 py-3 rounded-xl border border-black/10 hover:border-black bg-white hover:bg-zinc-50 transition-all text-xs font-bold cursor-pointer group"
                  >
                    <span className="uppercase">{p}</span>
                    <Share2 className="w-3.5 h-3.5 text-zinc-400 group-hover:text-black transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Canvas */}
        <div className="lg:col-span-7 space-y-3 sm:space-y-4">
          <div className="liquid-glass p-3.5 sm:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <span className="text-xs text-zinc-700 font-bold uppercase tracking-wider">
              Visual Output
            </span>
            {currentImage && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyUri}
                  className="btn-glass-secondary px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer font-bold shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied URL' : 'Copy URL'}</span>
                </button>
                <a
                  href={currentImage}
                  download="artwork.png"
                  className="btn-primary-liquid px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer font-bold shrink-0 shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save Artwork</span>
                </a>
              </div>
            )}
          </div>

          <div className="rounded-2xl sm:rounded-3xl border border-black/10 bg-zinc-50/50 min-h-[300px] sm:min-h-[550px] flex items-center justify-center p-3 sm:p-5 overflow-hidden shadow-xl relative group">
            {loading ? (
              <div className="text-center space-y-4 p-8 relative z-10 bg-white/40 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl">
                <div className="relative w-12 h-12 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-black/5" />
                  <motion.div 
                    className="absolute inset-0 rounded-full border-4 border-t-black border-r-transparent border-b-transparent border-l-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Vision Engaged</p>
                  <p className="text-xs text-black font-bold">Rendering High-Resolution Output...</p>
                </div>
              </div>
            ) : currentImage ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={currentImage}
                  alt="Generated output"
                  className="max-h-[500px] w-auto max-w-full rounded-xl sm:rounded-2xl object-contain border border-black/10 shadow-2xl transition-transform group-hover:scale-[1.02]"
                />
              </div>
            ) : (
              <div className="text-center space-y-4 p-12">
                <div className="w-16 h-16 bg-white rounded-3xl shadow-sm border border-black/5 flex items-center justify-center mx-auto transform -rotate-6">
                  <ImageIcon className="w-8 h-8 text-zinc-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-black font-bold">Awaiting your prompt...</p>
                  <p className="text-xs text-zinc-500 font-medium max-w-[240px] mx-auto leading-relaxed">
                    Describe your vision on the left to generate a platform-ready high-resolution artwork.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
