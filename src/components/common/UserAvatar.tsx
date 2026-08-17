import React, { useState, useEffect } from 'react';
import { DEFAULT_AVATAR_FALLBACK, DEFAULT_AVATAR_SVG, normalizeAvatarUrl, isGifUrl } from '../../utils/avatarUtils';

export interface UserAvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'custom';
  className?: string;
  fallbackSrc?: string;
  shape?: 'circle' | 'rounded' | 'square';
  ring?: 'gold' | 'emerald' | 'amber' | 'indigo' | 'slate' | 'none' | boolean;
  level?: number;
  badge?: string;
  showCrown?: boolean;
  isGif?: boolean;
  interactive?: boolean;
  title?: string;
  onClick?: (e: React.MouseEvent) => void;
  lazy?: boolean;
}

const SIZE_CLASSES = {
  xs: 'w-5 h-5 min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px] text-[9px]',
  sm: 'w-7 h-7 min-w-[28px] min-h-[28px] max-w-[28px] max-h-[28px] text-[11px]',
  md: 'w-9 h-9 min-w-[36px] min-h-[36px] max-w-[36px] max-h-[36px] text-xs',
  lg: 'w-12 h-12 min-w-[48px] min-h-[48px] max-w-[48px] max-h-[48px] text-sm',
  xl: 'w-16 h-16 min-w-[64px] min-h-[64px] max-w-[64px] max-h-[64px] text-base',
  '2xl': 'w-20 h-20 min-w-[80px] min-h-[80px] max-w-[80px] max-h-[80px] text-lg',
  '3xl': 'w-24 h-24 min-w-[96px] min-h-[96px] max-w-[96px] max-h-[96px] text-xl',
  custom: ''
};

const SHAPE_CLASSES = {
  circle: 'rounded-full',
  rounded: 'rounded-2xl',
  square: 'rounded-xl'
};

const RING_CLASSES = {
  gold: 'ring-2 ring-amber-400/80 shadow-md shadow-amber-400/10',
  amber: 'ring-2 ring-amber-400/80 shadow-md shadow-amber-400/10',
  emerald: 'ring-2 ring-emerald-400/80 shadow-md shadow-emerald-400/10',
  indigo: 'ring-2 ring-indigo-400/80 shadow-md shadow-indigo-400/10',
  slate: 'ring-1 ring-slate-300 dark:ring-slate-700',
  none: ''
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  alt = 'Lữ khách',
  size = 'md',
  className = '',
  fallbackSrc = DEFAULT_AVATAR_FALLBACK,
  shape = 'circle',
  ring = 'none',
  level,
  badge,
  showCrown = false,
  isGif: explicitIsGif,
  interactive = false,
  title,
  onClick,
  lazy = true
}) => {
  const normalizedSrc = normalizeAvatarUrl(src);
  const [currentSrc, setCurrentSrc] = useState<string>(normalizedSrc || fallbackSrc);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sync state if src changes
  useEffect(() => {
    const updated = normalizeAvatarUrl(src);
    if (updated) {
      setCurrentSrc(updated);
      setHasError(false);
      setIsLoading(true);
    } else {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
      setIsLoading(false);
    }
  }, [src, fallbackSrc]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    // If the primary source fails, gracefully fall back to fallbackSrc
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else if (currentSrc !== DEFAULT_AVATAR_SVG) {
      // If even the fallbackSrc fails, use embedded SVG
      setCurrentSrc(DEFAULT_AVATAR_SVG);
      setHasError(true);
    }
  };

  const sizeClass = size !== 'custom' ? SIZE_CLASSES[size] : '';
  const shapeClass = SHAPE_CLASSES[shape];
  
  let ringClass = '';
  if (typeof ring === 'boolean') {
    ringClass = ring ? RING_CLASSES.gold : '';
  } else if (ring && RING_CLASSES[ring]) {
    ringClass = RING_CLASSES[ring];
  }

  const isAnimated = explicitIsGif !== undefined ? explicitIsGif : isGifUrl(currentSrc);

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${sizeClass} ${shapeClass} ${
        interactive ? 'cursor-pointer transition-transform hover:scale-105 active:scale-95' : ''
      } ${className}`}
      onClick={onClick}
      title={title || alt}
    >
      {/* Crown indicator for Top 1 */}
      {showCrown && (
        <span className="absolute -top-3 -right-1 text-base sm:text-lg filter drop-shadow z-10 animate-bounce">
          👑
        </span>
      )}

      {/* Main Avatar Container */}
      <div
        className={`relative overflow-hidden w-full h-full flex items-center justify-center bg-slate-800 ${shapeClass} ${ringClass}`}
      >
        {/* Subtle loading placeholder */}
        {isLoading && (
          <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse flex items-center justify-center z-0">
            <span className="text-[10px] text-slate-400 font-bold">✦</span>
          </div>
        )}

        {/* Browser-native image tag preserves animated GIFs and arbitrary CDN transforms */}
        <img
          src={currentSrc}
          alt={alt}
          loading={lazy ? 'lazy' : 'eager'}
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover block transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } ${shapeClass}`}
        />

        {/* GIF indicator badge if animated */}
        {isAnimated && !hasError && size !== 'xs' && (
          <span className="absolute top-0.5 right-0.5 px-1 py-0.2 bg-black/70 text-amber-300 font-extrabold text-[7px] rounded leading-none backdrop-blur-xs">
            GIF
          </span>
        )}

        {/* Text badge if attached */}
        {badge && (
          <span className="absolute bottom-0 inset-x-0 bg-black/70 text-amber-300 text-[8px] text-center font-bold truncate leading-tight">
            {badge}
          </span>
        )}
      </div>

      {/* Level Tag Overlay */}
      {typeof level === 'number' && (
        <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-sm border border-white/40">
          Lv.{level}
        </span>
      )}
    </div>
  );
};
