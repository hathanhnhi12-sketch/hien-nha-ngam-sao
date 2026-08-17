import React, { useEffect, useState, useRef } from 'react';
import { StorageService } from '../../services/storageService';
import { Sparkles, Stars } from 'lucide-react';

interface LoadingScreenProps {
  isLoading?: boolean;
  isVisible?: boolean;
  onComplete?: () => void;
  customText?: string;
  subText?: string;
  durationMs?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  isLoading,
  isVisible,
  onComplete,
  customText,
  subText,
  durationMs
}) => {
  // Combine isLoading & isVisible props; default to false if undefined
  const active = Boolean(isLoading ?? isVisible ?? false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const failsafeRef = useRef<NodeJS.Timeout | null>(null);
  const fadeRef = useRef<NodeJS.Timeout | null>(null);

  const loadingConfig = StorageService.getLoadingConfig();
  const targetDuration = Math.min(
    Math.max(durationMs || loadingConfig.minDisplayTimeMs || 650, 400),
    2500
  );

  useEffect(() => {
    if (active) {
      setShouldRender(true);
      setIsFadingOut(false);

      // Clear any pending timers
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (failsafeRef.current) clearTimeout(failsafeRef.current);
      if (fadeRef.current) clearTimeout(fadeRef.current);

      // Transition completion timer
      timeoutRef.current = setTimeout(() => {
        setIsFadingOut(true);
        fadeRef.current = setTimeout(() => {
          setShouldRender(false);
          onComplete?.();
        }, 300); // 300ms fadeout
      }, targetDuration);

      // Absolute hard failsafe timeout (2500ms max)
      failsafeRef.current = setTimeout(() => {
        setShouldRender(false);
        setIsFadingOut(false);
        onComplete?.();
      }, 2500);
    } else {
      setIsFadingOut(true);
      fadeRef.current = setTimeout(() => {
        setShouldRender(false);
        setIsFadingOut(false);
      }, 250);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (failsafeRef.current) clearTimeout(failsafeRef.current);
      if (fadeRef.current) clearTimeout(fadeRef.current);
    };
  }, [active, targetDuration, onComplete]);

  if (!shouldRender && !active) return null;

  const displayText = customText || loadingConfig.loadingText || 'Đang chuẩn bị không gian ngắm sao...';
  const displaySubText = subText || loadingConfig.subText || 'Dưới Mái Hiên Sao ✦ Nơi lắng nghe tâm hồn';
  const animationUrl = loadingConfig.activeAnimationUrl || 'https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif';

  return (
    <div
      id="route-transition-loading-screen"
      role="status"
      aria-live="polite"
      aria-label={displayText}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-xl transition-all duration-300 pointer-events-none ${
        isFadingOut ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundColor: `rgba(10, 15, 30, ${loadingConfig.overlayOpacity ?? 0.88})`
      }}
    >
      {/* Background Starry Glimmer Effect */}
      {loadingConfig.showStarsEffect !== false && (
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/25 via-slate-950/40 to-slate-950/80 animate-pulse" />
      )}

      <div className="relative z-10 flex flex-col items-center text-center p-6 max-w-sm space-y-4 animate-fade-in select-none">
        {/* Animated CMS Graphic */}
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden p-1 bg-gradient-to-tr from-amber-400/40 via-indigo-500/40 to-purple-600/40 shadow-2xl shadow-indigo-500/30">
          <div className="w-full h-full rounded-[22px] bg-slate-950/85 overflow-hidden flex items-center justify-center p-2">
            <img
              src={animationUrl}
              alt="Loading Animation"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>

        {/* Text and Subtitle */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Hiên Nhà Ngắm Sao</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight font-display">
            {displayText}
          </h3>
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed italic">
            {displaySubText}
          </p>
        </div>

        {/* Dynamic Glowing Star Pulse Indicator */}
        <div className="flex items-center justify-center gap-2 pt-1 text-amber-300/80">
          <Stars className="w-4 h-4 animate-bounce" style={{ animationDuration: '1.2s' }} />
          <span className="text-[11px] font-medium tracking-widest uppercase text-slate-400">
            Đang chuyển không gian
          </span>
          <Stars className="w-4 h-4 animate-bounce" style={{ animationDuration: '1.2s', animationDelay: '0.2s' }} />
        </div>
      </div>
    </div>
  );
};
