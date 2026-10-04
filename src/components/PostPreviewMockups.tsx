import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Repeat, 
  Share, 
  Bookmark, 
  ThumbsUp, 
  Send, 
  MoreHorizontal, 
  Music2, 
  Disc, 
  CheckCircle,
  Copy,
  Check
} from 'lucide-react';
import { SocialPlatform } from '../types';

interface PostPreviewMockupsProps {
  platform: SocialPlatform;
  content: {
    linkedin?: string;
    x?: {
      singlePost?: string;
      thread?: string[];
    } | string;
    instagram?: {
      caption?: string;
      hashtags?: string[];
    } | string;
    tiktok?: {
      hook?: string;
      script?: string;
      caption?: string;
    } | string;
    facebook?: string;
  };
  imageUrl?: string;
  authorName?: string;
  authorHandle?: string;
}

export const PostPreviewMockup: React.FC<PostPreviewMockupsProps> = ({
  platform,
  content,
  imageUrl,
  authorName = 'Mpho Shiang',
  authorHandle = 'mphoshiang'
}) => {
  const [copied, setCopied] = useState(false);
  const [threadIndex, setThreadIndex] = useState(0);

  const getCopyableText = (): string => {
    if (platform === 'linkedin') return typeof content.linkedin === 'string' ? content.linkedin : '';
    if (platform === 'x') {
      if (typeof content.x === 'object' && content.x !== null) {
        if (content.x.thread && content.x.thread.length > 0) {
          return content.x.thread.join('\n\n---\n\n');
        }
        return content.x.singlePost || '';
      }
      return typeof content.x === 'string' ? content.x : '';
    }
    if (platform === 'instagram') {
      if (typeof content.instagram === 'object' && content.instagram !== null) {
        return `${content.instagram.caption || ''}\n\n${(content.instagram.hashtags || []).join(' ')}`;
      }
      return typeof content.instagram === 'string' ? content.instagram : '';
    }
    if (platform === 'tiktok') {
      if (typeof content.tiktok === 'object' && content.tiktok !== null) {
        return `[HOOK]: ${content.tiktok.hook || ''}\n\n[SCRIPT]:\n${content.tiktok.script || ''}\n\n[CAPTION]: ${content.tiktok.caption || ''}`;
      }
      return typeof content.tiktok === 'string' ? content.tiktok : '';
    }
    if (platform === 'facebook') return typeof content.facebook === 'string' ? content.facebook : '';
    return '';
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCopyableText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="liquid-glass rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl flex flex-col border border-black/10 w-full max-w-full">
      {/* Top Bar with Platform Tag and Quick Copy */}
      <div className="bg-white/90 backdrop-blur-md px-3.5 sm:px-5 py-2.5 sm:py-3 border-b border-black/[0.08] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-black"></span>
          <span className="text-xs font-extrabold uppercase tracking-wider text-black">
            {platform.toUpperCase()} PREVIEW
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-black text-white hover:bg-zinc-800 text-xs font-bold transition-all cursor-pointer shadow-xs"
        >
          {copied ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Platform Container */}
      <div className="p-3 sm:p-6 overflow-y-auto max-h-[500px] sm:max-h-[550px] bg-zinc-50/50">
        {/* X / TWITTER PREVIEW */}
        {platform === 'x' && (
          <div className="bg-white border border-zinc-200 rounded-2xl p-3.5 sm:p-5 text-black font-sans max-w-lg mx-auto shadow-sm">
            <div className="flex items-start gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 shadow-xs">
                {authorName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 sm:gap-1.5 truncate">
                    <span className="font-bold text-xs sm:text-sm text-black truncate">{authorName}</span>
                    <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-black fill-black shrink-0" />
                    <span className="text-zinc-500 text-[11px] sm:text-xs truncate">@{authorHandle}</span>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-zinc-400 shrink-0" />
                </div>

                {/* Tweet text */}
                <div className="mt-2 text-xs sm:text-[14px] text-zinc-900 whitespace-pre-line leading-relaxed font-normal">
                  {typeof content.x === 'object' && content.x !== null ? (
                    content.x.thread && content.x.thread.length > 0 ? (
                      <div>
                        <div className="text-[10px] sm:text-xs bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-md mb-2 text-zinc-700 font-bold inline-block">
                          Thread ({threadIndex + 1}/{content.x.thread.length})
                        </div>
                        <p>{content.x.thread[threadIndex] || content.x.singlePost}</p>
                        {content.x.thread.length > 1 && (
                          <div className="flex gap-1.5 mt-2.5 pt-2 border-t border-zinc-100">
                            {content.x.thread.map((_, i) => (
                              <button
                                key={i}
                                onClick={() => setThreadIndex(i)}
                                className={`px-2 py-0.5 text-[10px] sm:text-xs font-mono rounded-lg cursor-pointer ${
                                  threadIndex === i ? 'bg-black text-white font-bold' : 'bg-zinc-100 text-zinc-600'
                                }`}
                              >
                                #{i + 1}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      content.x.singlePost || 'No tweet generated.'
                    )
                  ) : (
                    typeof content.x === 'string' ? content.x : 'Ready to tweet.'
                  )}
                </div>

                {/* Attached image if present */}
                {imageUrl && (
                  <div className="mt-2.5 rounded-xl sm:rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-100">
                    <img src={imageUrl} alt="X media attachment" className="w-full h-auto object-cover max-h-56 sm:max-h-72" />
                  </div>
                )}

                {/* X Engagement Bar */}
                <div className="flex items-center justify-between mt-3 text-zinc-500 text-xs pt-2.5 border-t border-zinc-100">
                  <div className="flex items-center gap-1 hover:text-black cursor-pointer">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>24</span>
                  </div>
                  <div className="flex items-center gap-1 hover:text-black cursor-pointer">
                    <Repeat className="w-3.5 h-3.5" />
                    <span>89</span>
                  </div>
                  <div className="flex items-center gap-1 hover:text-black cursor-pointer">
                    <Heart className="w-3.5 h-3.5" />
                    <span>342</span>
                  </div>
                  <div className="flex items-center gap-1 hover:text-black cursor-pointer">
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>56</span>
                  </div>
                  <Share className="w-3.5 h-3.5 hover:text-black cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LINKEDIN PREVIEW */}
        {platform === 'linkedin' && (
          <div className="bg-white border border-zinc-200 rounded-2xl p-3.5 sm:p-5 text-black font-sans max-w-lg mx-auto shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs sm:text-base shrink-0">
                  {authorName[0]}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs sm:text-sm text-black">{authorName}</span>
                    <span className="text-[9px] sm:text-[10px] text-zinc-600 border border-zinc-200 bg-zinc-50 px-1 rounded">1st</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-zinc-500 font-medium">Software Engineer & Creator</p>
                  <p className="text-[9px] sm:text-[10px] text-zinc-400">1h · 🌐</p>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-zinc-400 shrink-0" />
            </div>

            {/* LinkedIn Post Text */}
            <div className="mt-2.5 sm:mt-3 text-xs sm:text-[13.5px] text-zinc-900 whitespace-pre-line leading-relaxed font-normal">
              {typeof content.linkedin === 'string' ? content.linkedin : 'LinkedIn post draft ready.'}
            </div>

            {/* Media Attachment */}
            {imageUrl && (
              <div className="mt-2.5 sm:mt-3 rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100">
                <img src={imageUrl} alt="LinkedIn post media" className="w-full h-auto object-cover max-h-60 sm:max-h-80" />
              </div>
            )}

            {/* Social Stats */}
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-zinc-500 mt-3 pb-2 border-b border-zinc-100">
              <div className="flex items-center gap-1.5">
                <span className="flex -space-x-1">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[8px] font-bold">👍</span>
                  <span className="w-4 h-4 rounded-full bg-zinc-800 text-white flex items-center justify-center text-[8px] font-bold">💡</span>
                </span>
                <span className="font-semibold text-zinc-700">128 reactions</span>
              </div>
              <span>42 comments · 18 reposts</span>
            </div>

            {/* Actions toolbar */}
            <div className="flex items-center justify-around text-xs font-semibold text-zinc-600 pt-2">
              <button className="flex items-center gap-1 py-1 px-1.5 sm:px-2 hover:bg-zinc-100 rounded-lg cursor-pointer hover:text-black text-[11px] sm:text-xs">
                <ThumbsUp className="w-3.5 h-3.5" /> Like
              </button>
              <button className="flex items-center gap-1 py-1 px-1.5 sm:px-2 hover:bg-zinc-100 rounded-lg cursor-pointer hover:text-black text-[11px] sm:text-xs">
                <MessageCircle className="w-3.5 h-3.5" /> Comment
              </button>
              <button className="flex items-center gap-1 py-1 px-1.5 sm:px-2 hover:bg-zinc-100 rounded-lg cursor-pointer hover:text-black text-[11px] sm:text-xs">
                <Repeat className="w-3.5 h-3.5" /> Repost
              </button>
              <button className="flex items-center gap-1 py-1 px-1.5 sm:px-2 hover:bg-zinc-100 rounded-lg cursor-pointer hover:text-black text-[11px] sm:text-xs">
                <Send className="w-3.5 h-3.5" /> Send
              </button>
            </div>
          </div>
        )}

        {/* INSTAGRAM PREVIEW */}
        {platform === 'instagram' && (
          <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden max-w-sm mx-auto text-black font-sans shadow-sm">
            {/* Header */}
            <div className="p-3 flex items-center justify-between border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full p-[1.5px] bg-gradient-to-tr from-zinc-400 to-black">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-bold text-black">
                    {authorName[0]}
                  </div>
                </div>
                <span className="font-bold text-xs text-black">{authorHandle}</span>
              </div>
              <MoreHorizontal className="w-4 h-4 text-zinc-400" />
            </div>

            {/* Image Visual */}
            <div className="aspect-square bg-zinc-100 w-full flex items-center justify-center overflow-hidden">
              {imageUrl ? (
                <img src={imageUrl} alt="Instagram visual" className="w-full h-full object-cover" />
              ) : (
                <div className="text-zinc-400 text-xs">NO MEDIA ATTACHED</div>
              )}
            </div>

            {/* Actions Bar */}
            <div className="p-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 hover:text-red-500 cursor-pointer" />
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 hover:text-black cursor-pointer" />
                  <Send className="w-4 h-4 sm:w-5 sm:h-5 hover:text-black cursor-pointer" />
                </div>
                <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 hover:text-black cursor-pointer" />
              </div>
              <p className="font-extrabold text-xs mb-1 text-black">1,492 likes</p>

              {/* Caption */}
              <div className="text-xs text-zinc-800 leading-relaxed">
                <span className="font-bold mr-1 text-black">{authorHandle}</span>
                {typeof content.instagram === 'object' && content.instagram !== null ? (
                  <>
                    <p className="inline whitespace-pre-line">{content.instagram.caption}</p>
                    {content.instagram.hashtags && content.instagram.hashtags.length > 0 && (
                      <div className="mt-1.5 text-zinc-600 font-medium text-[11px]">
                        {content.instagram.hashtags.join(' ')}
                      </div>
                    )}
                  </>
                ) : (
                  <span>{typeof content.instagram === 'string' ? content.instagram : 'Instagram post'}</span>
                )}
              </div>
              <p className="text-[10px] text-zinc-400 mt-1.5 font-medium">View all 38 comments</p>
              <p className="text-[9px] text-zinc-400 uppercase mt-0.5">2 HOURS AGO</p>
            </div>
          </div>
        )}

        {/* TIKTOK PREVIEW */}
        {platform === 'tiktok' && (
          <div className="bg-zinc-950 border border-zinc-300 rounded-3xl overflow-hidden w-full max-w-[290px] sm:max-w-xs mx-auto text-white font-sans relative aspect-[9/16] flex flex-col justify-between p-3.5 sm:p-4 shadow-2xl">
            {/* Background or video placeholder */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-zinc-900 via-black to-zinc-950">
              {imageUrl && (
                <img src={imageUrl} alt="TikTok background" className="w-full h-full object-cover opacity-60" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            </div>

            {/* Top header */}
            <div className="relative z-10 flex items-center justify-between text-xs text-zinc-400">
              <span>LIVE</span>
              <div className="flex gap-2.5 text-white font-bold text-xs">
                <span className="text-zinc-400">Following</span>
                <span className="border-b-2 border-white pb-0.5">For You</span>
              </div>
              <span>🔍</span>
            </div>

            {/* Center Hook Overlay */}
            <div className="relative z-10 my-auto text-center px-1">
              {typeof content.tiktok === 'object' && content.tiktok?.hook && (
                <div className="bg-white/90 text-black border border-white backdrop-blur-md px-3 py-2 sm:px-4 sm:py-3 rounded-2xl shadow-xl">
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-zinc-600 block mb-0.5">⚡ 3-SEC HOOK</span>
                  <p className="font-display font-extrabold text-xs sm:text-sm text-black leading-tight">
                    "{content.tiktok.hook}"
                  </p>
                </div>
              )}
            </div>

            {/* Bottom metadata & right floating action icons */}
            <div className="relative z-10 flex items-end justify-between gap-2">
              <div className="flex-1 space-y-1.5 text-xs min-w-0">
                <p className="font-bold text-xs sm:text-sm truncate">@{authorHandle}</p>
                <div className="text-zinc-200 line-clamp-2 text-[10px] sm:text-[11px] leading-snug">
                  {typeof content.tiktok === 'object' && content.tiktok !== null ? (
                    content.tiktok.caption || content.tiktok.script
                  ) : (
                    typeof content.tiktok === 'string' ? content.tiktok : 'TikTok Script'
                  )}
                </div>
                <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-zinc-300">
                  <Music2 className="w-3 h-3 text-white animate-spin shrink-0" />
                  <span className="truncate">original sound - {authorName}</span>
                </div>
              </div>

              {/* Right vertical icons */}
              <div className="flex flex-col items-center gap-2.5 sm:gap-3 text-center shrink-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-black font-bold flex items-center justify-center text-[10px]">
                  {authorName[0]}
                </div>
                <div className="flex flex-col items-center">
                  <Heart className="w-5 h-5 fill-white text-white" />
                  <span className="text-[9px] mt-0.5">84.2K</span>
                </div>
                <div className="flex flex-col items-center">
                  <MessageCircle className="w-5 h-5 fill-white text-white" />
                  <span className="text-[9px] mt-0.5">1.2K</span>
                </div>
                <div className="flex flex-col items-center">
                  <Share className="w-5 h-5 text-white" />
                  <span className="text-[9px] mt-0.5">4.1K</span>
                </div>
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-zinc-700 bg-zinc-900 flex items-center justify-center animate-spin">
                  <Disc className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FACEBOOK PREVIEW */}
        {platform === 'facebook' && (
          <div className="bg-white border border-zinc-200 rounded-2xl p-3.5 sm:p-5 text-black font-sans max-w-lg mx-auto shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs sm:text-base shrink-0">
                  {authorName[0]}
                </div>
                <div>
                  <span className="font-bold text-xs sm:text-sm text-black block">{authorName}</span>
                  <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-zinc-500">
                    <span>Just now</span>
                    <span>·</span>
                    <span>👥 Public</span>
                  </div>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-zinc-400 shrink-0" />
            </div>

            {/* Post copy */}
            <div className="mt-2.5 sm:mt-3 text-xs sm:text-[14px] text-zinc-900 whitespace-pre-line leading-relaxed">
              {typeof content.facebook === 'string' ? content.facebook : 'Facebook community post ready.'}
            </div>

            {/* Attached media */}
            {imageUrl && (
              <div className="mt-2.5 sm:mt-3 rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100">
                <img src={imageUrl} alt="Facebook media" className="w-full h-auto object-cover max-h-60 sm:max-h-80" />
              </div>
            )}

            {/* Facebook reactions */}
            <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-3 pb-2 border-b border-zinc-100">
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px]">👍</span>
                <span className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[9px]">❤️</span>
                <span className="ml-1 font-semibold text-zinc-700">482</span>
              </div>
              <span>76 Comments</span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-around text-xs font-semibold text-zinc-600 pt-2">
              <button className="flex items-center gap-1 py-1 px-2 hover:bg-zinc-100 rounded-lg cursor-pointer hover:text-black">
                <ThumbsUp className="w-3.5 h-3.5" /> Like
              </button>
              <button className="flex items-center gap-1 py-1 px-2 hover:bg-zinc-100 rounded-lg cursor-pointer hover:text-black">
                <MessageCircle className="w-3.5 h-3.5" /> Comment
              </button>
              <button className="flex items-center gap-1 py-1 px-2 hover:bg-zinc-100 rounded-lg cursor-pointer hover:text-black">
                <Share className="w-3.5 h-3.5" /> Share
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
