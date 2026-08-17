// src/types/gallery.ts
export interface GalleryFolder {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  parentId?: string | null;
  createdAt: number;
}

export interface GalleryItem {
  id: string;
  name: string;
  title?: string;
  src: string;
  imageUrl?: string;
  type: 'image' | 'gif' | 'video';
  category: string;
  folderId?: string;
  characterId?: string;
  characterName?: string;
  author?: string;
  caption?: string;
  description?: string;
  tags: string[];
  isPinned: boolean;
  isLocked: boolean;
  isDeleted: boolean;
  views: number;
  likes: number;
  downloads: number;
  createdAt: number;
}

// src/types/playlist.ts
export interface PlaylistItem {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  url?: string;
  src?: string;
  coverUrl: string;
  duration?: number | string;
  order: number;
  isActive: boolean;
  tags?: string[];
}

// src/types/tarot.ts
export type TarotSpreadType = 'one_card' | 'three_cards' | 'five_elements' | 'relationship' | 'career' | 'celtic_cross';

export interface TarotCard {
  id: string;
  name: string;
  nameEn?: string;
  arcana: 'major' | 'minor';
  arcanaType?: 'major' | 'minor';
  number: number;
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  keywords: string[];
  upright: string;
  meaningUpright?: string;
  reversed: string;
  meaningReversed?: string;
  love: string;
  career: string;
  health: string;
  advice: string;
  image: string;
  imageUrl?: string;
  description?: string;
  element?: string;
}

export interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  positionName: string;
  positionMeaning: string;
}

// src/types/quote.ts
export interface CelestialQuote {
  id: string;
  content: string;
  author: string;
  source?: string;
  category?: 'starlight' | 'healing' | 'love' | 'night' | 'life' | string;
  likes: number;
  createdAt?: number;
}

// src/types/siteConfig.ts
export interface SiteGreetingConfig {
  morning: string;    // 05:00 - 10:59
  noon: string;       // 11:00 - 13:59
  afternoon: string;  // 14:00 - 17:59
  evening: string;    // 18:00 - 22:59
  night: string;      // 23:00 - 04:59
}

export interface LoadingAnimationAsset {
  id: string;
  name: string;
  assetUrl: string;
  thumbnailUrl?: string;
  type: 'gif' | 'webp' | 'apng' | 'video' | 'image';
  description?: string;
  isPreset?: boolean;
  createdAt: number;
}

export interface LoadingConfig {
  enabled: boolean;
  activeAnimationId: string;
  activeAnimationUrl: string;
  loadingText?: string;
  subText?: string;
  overlayOpacity?: number;
  showStarsEffect?: boolean;
  minDisplayTimeMs?: number;
  showProgressBar?: boolean;
}

export interface SocialPlatformConfig {
  displayName: string;
  pageName?: string;
  serverName?: string;
  serverUrl?: string;
  pageUrl?: string;
  personalUrl?: string;
  collabUrl?: string;
  privateUrl?: string;
  url?: string;
  avatarUrl: string;
  gifAvatarUrl?: string;
  badge?: string;
  enabled?: boolean;
  isActive?: boolean;
  description?: string;
}

export interface SocialAppearanceConfig {
  discord: SocialPlatformConfig;
  facebook: SocialPlatformConfig;
}

export interface SiteSocialConfig {
  discord: SocialPlatformConfig;
  facebook: SocialPlatformConfig;
}

export interface UserAvatarPreset {
  id: string;
  name: string;
  sourceType?: 'upload' | 'url';
  storagePath?: string;
  url: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  avatarUrl?: string;
  mimeType?: string;
  badge?: string;
  type?: 'image' | 'gif' | 'webp';
  enabled: boolean;
  active?: boolean;
  sortOrder?: number;
  createdAt?: number;
}

export interface StickerCategory {
  id: string;
  name: string;
  icon?: string;
  sortOrder?: number;
}

export interface StickerItem {
  id: string;
  name: string;
  assetUrl: string;
  thumbnailUrl?: string;
  type: 'sticker' | 'gif' | 'image';
  categoryId: string;
  description?: string;
  enabled: boolean;
  sortOrder?: number;
  createdAt?: number;
  updatedAt?: number;
}

export interface ExpConfig {
  comment: number;
  characterLike: number;
  vote: number;
  characterGift: number;
  feedback: number;
  dailyCheckIn: number;
  maxCommentExpPerDay: number;
  maxFeedbackExpPerDay: number;
}

export interface SiteConfig {
  siteName: string;
  subtitle: string;
  tagline: string;
  logoUrl?: string;
  faviconUrl?: string;
  backgroundUrl: string;
  backgroundType: 'video' | 'image';
  backgroundFallbackUrl: string;
  overlayOpacity: number;
  greetings: SiteGreetingConfig;
  discordCollabUrl: string;
  discordPrivateUrl: string;
  facebookPageUrl: string;
  facebookPersonalUrl: string;
  socialLinks?: SiteSocialConfig;
  loadingConfig?: LoadingConfig;
  expConfig?: ExpConfig;
  exploreButtonText: string;
  footerText: string;
  isMaintenance?: boolean;
}

export interface MediaResource {
  id: string;
  name: string;
  title?: string;
  url: string;
  type: 'image' | 'video' | 'audio' | 'gif' | 'other';
  category: 'loading' | 'avatar' | 'social' | 'sticker' | 'background' | 'character' | 'tarot' | 'shop' | 'album' | 'playlist' | 'general';
  size?: string;
  description?: string;
  createdAt: number;
  usedIn?: string[];
}

export interface SectionBackgroundSetting {
  route?: string;
  title?: string;
  description?: string;
  type?: 'image' | 'video' | 'gradient' | 'none';
  backgroundType?: 'image' | 'video' | 'gradient' | 'none';
  url?: string;
  backgroundUrl?: string;
  mobileUrl?: string;
  mobileBackgroundUrl?: string;
  videoUrl?: string;
  fallbackUrl?: string;
  backgroundFallbackUrl?: string;
  opacity?: number;
  overlayOpacity?: number;
  blur?: number;
  overlayGradient?: boolean;
  brightness?: number;
  contrast?: number;
  isFixed?: boolean;
  showStarsEffect?: boolean;
  enabled: boolean;
  updatedAt?: number;
}

export type SectionBackgroundsMap = Record<string, SectionBackgroundSetting>;
