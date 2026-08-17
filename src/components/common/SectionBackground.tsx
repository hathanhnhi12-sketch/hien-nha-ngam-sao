import React, { useState, useEffect } from 'react';
import { SectionBackgroundSetting, SectionBackgroundsMap } from '../../types';
import { StorageService } from '../../services/storageService';

interface SectionBackgroundProps {
  currentRoute: string;
}

export const SectionBackground: React.FC<SectionBackgroundProps> = ({ currentRoute }) => {
  const [backgrounds, setBackgrounds] = useState<SectionBackgroundsMap>(() => 
    StorageService.getSectionBackgrounds()
  );

  useEffect(() => {
    // Reload backgrounds whenever currentRoute changes or storage updates
    setBackgrounds(StorageService.getSectionBackgrounds());
  }, [currentRoute]);

  // Map route to key
  let sectionKey: keyof SectionBackgroundsMap = 'home';
  if (currentRoute === 'characters') sectionKey = 'characters';
  else if (currentRoute === 'character-detail') sectionKey = 'character-detail';
  else if (currentRoute === 'leaderboard') sectionKey = 'leaderboard';
  else if (currentRoute === 'vote') sectionKey = 'vote';
  else if (currentRoute === 'send-love') sectionKey = 'send-love';
  else if (currentRoute === 'feedback') sectionKey = 'feedback';
  else if (currentRoute === 'playlist') sectionKey = 'playlist';
  else if (currentRoute === 'gallery') sectionKey = 'gallery';
  else if (currentRoute === 'other-spaces') sectionKey = 'other-spaces';
  else if (currentRoute === 'minigame') sectionKey = 'minigame';
  else if (currentRoute === 'admin') sectionKey = 'admin';

  const setting: SectionBackgroundSetting | undefined = backgrounds[sectionKey];

  if (!setting || setting.enabled === false || setting.type === 'none') {
    return null;
  }

  const opacity = setting.opacity ?? 0.15;
  const blur = setting.blur ?? 0;
  const filterStyle = blur > 0 ? `blur(${blur}px)` : 'none';

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-500">
      {/* Video Background */}
      {setting.type === 'video' && setting.videoUrl ? (
        <video
          src={setting.videoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover transition-opacity duration-500"
          style={{
            opacity,
            filter: filterStyle
          }}
        />
      ) : setting.type === 'gradient' ? (
        <div
          className="w-full h-full bg-gradient-to-tr from-indigo-900/30 via-purple-900/20 to-amber-600/20 transition-opacity duration-500"
          style={{
            opacity,
            filter: filterStyle
          }}
        />
      ) : setting.url || setting.mobileUrl ? (
        /* Image Background with responsive mobile support */
        <picture className="w-full h-full">
          {setting.mobileUrl && (
            <source media="(max-width: 768px)" srcSet={setting.mobileUrl} />
          )}
          <img
            src={setting.url || setting.mobileUrl}
            alt="Section Background"
            className="w-full h-full object-cover transition-opacity duration-500"
            style={{
              opacity,
              filter: filterStyle
            }}
          />
        </picture>
      ) : null}

      {/* Overlay Gradient */}
      {setting.overlayGradient !== false && (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-transparent to-slate-950/60 pointer-events-none" />
      )}
    </div>
  );
};
