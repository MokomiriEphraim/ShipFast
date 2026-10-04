import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StreamingCodeProps {
  text: string;
  streaming?: boolean;
  className?: string;
  speed?: number; // ms per word
  onComplete?: () => void;
}

export const StreamingCode: React.FC<StreamingCodeProps> = ({
  text,
  streaming = false,
  className,
  speed = 30, // speed of reveal
  onComplete
}) => {
  const [displayCount, setDisplayCount] = useState(0);
  const words = useMemo(() => {
    // Split by any sequence of whitespace or specific code delimiters to make it feel "coded"
    return text.split(/(\s+)/);
  }, [text]);
  const totalSteps = words.length;
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!streaming) {
      setDisplayCount(totalSteps);
      return;
    }

    setDisplayCount(0);
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current >= totalSteps) {
        clearInterval(interval);
        setDisplayCount(totalSteps);
        onComplete?.();
      } else {
        setDisplayCount(current);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, streaming, totalSteps, speed, onComplete]);

  // Auto-scroll logic for code generation
  useEffect(() => {
    if (streaming && scrollRef.current) {
      const container = scrollRef.current;
      // Scroll to the bottom with a slight offset to keep the caret in view but not at the absolute edge
      container.scrollTop = container.scrollHeight;
    }
  }, [displayCount, streaming]);

  return (
    <div 
      ref={scrollRef}
      className={cn(
        "font-mono text-[11px] sm:text-xs leading-relaxed select-text whitespace-pre overflow-y-auto custom-scrollbar relative",
        streaming && "ring-2 ring-blue-500/20 bg-blue-50/5", // Subtle spotlight background when streaming
        className
      )}
      style={{ scrollBehavior: 'smooth' }}
    >
      <div className="min-w-full inline-block pb-4">
        {words.slice(0, displayCount).map((word, i) => {
          // Spotlight effect: most recent words are bright and slightly scaled
          const isVeryRecent = streaming && i >= displayCount - 2;
          const isRecent = streaming && i >= displayCount - 8;
          
          return (
            <motion.span
              key={i}
              initial={false}
              animate={{
                color: isVeryRecent ? '#2563eb' : isRecent ? '#3b82f6' : '#000000',
                textShadow: isVeryRecent ? '0 0 8px rgba(37, 99, 235, 0.3)' : 'none',
                scale: isVeryRecent ? 1.02 : 1,
              }}
              transition={{
                duration: 0.4,
                ease: "easeOut"
              }}
              className="inline-block"
            >
              {word}
            </motion.span>
          );
        })}
        
        {streaming && displayCount < totalSteps && (
          <motion.span
            animate={{ 
              opacity: [1, 0, 1],
              scale: [1, 1.2, 1]
            }}
            transition={{ repeat: Infinity, duration: 0.6 }}
            className="inline-block w-2 h-4 ml-0.5 bg-blue-600 align-middle shadow-[0_0_12px_rgba(37,99,235,0.6)] rounded-sm"
          />
        )}
      </div>

      {/* Spotlight Overlay */}
      {streaming && (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-white/5 shadow-[inset_0_-20px_40px_-10px_rgba(37,99,235,0.05)]" />
      )}
    </div>
  );
};
