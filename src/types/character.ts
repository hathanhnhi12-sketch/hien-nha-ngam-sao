// src/types/character.ts
export type CharacterStatus = 'open' | 'updating' | 'unreleased';

export interface Character {
  id: string;
  name: string;
  series: string;
  tags: string[];
  status: CharacterStatus;
  avatarUrl: string;
  largeImgUrl: string;
  linkGgai: string;
  backstory: string;
  views: number;
  chats: number;
  loveCount: number;
  voteCount: number;
  affinity?: number;
  isHidden: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface CharacterComment {
  id: string;
  characterId: string;
  nickname: string;
  content: string;
  imageUrl?: string;
  stickerUrl?: string;
  stickerName?: string;
  avatarUrl?: string;
  createdAt: number;
  isHidden: boolean;
  isPinned: boolean;
  avatarSeed?: number;
}

export interface LoveLetter {
  id: string;
  senderName: string;
  author?: string;
  recipient?: string;
  toCharacter?: string;
  content: string;
  message?: string;
  imageUrl?: string;
  stickerUrl?: string;
  stickerName?: string;
  mood?: string;
  color?: string;
  reply?: string;
  replyFromAdmin?: string;
  likes?: number;
  isPinned?: boolean;
  isRead?: boolean;
  createdAt: number;
  isArchived: boolean;
  isPublic: boolean;
}

export interface VoteSetting {
  id: string;
  isOpen: boolean;
  title: string;
  description?: string;
  rules?: string;
  startDate?: string;
  endDate?: string;
  totalVotes: number;
  updatedAt: number;
}

export interface ChatScenario {
  id: string;
  title: string;
  text: string;
  category: string;
  isActive?: boolean;
  order?: number;
  createdAt?: number;
  updatedAt?: number;
}

export interface CharacterCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  sortOrder: number;
  enabled: boolean;
  createdAt: number;
  updatedAt?: number;
}

export type FeedbackStatus = 'new' | 'reviewing' | 'fixed' | 'resolved' | 'archived';

export interface FeedbackAttachedFile {
  name: string;
  size: number;
  type: string;
  dataUrl?: string;
}

export interface FeedbackItem {
  id: string;
  characterId: string;
  characterName?: string;
  nickname: string;
  content: string;
  imageUrl?: string;
  file?: FeedbackAttachedFile;
  stickerUrl?: string;
  stickerName?: string;
  status: FeedbackStatus;
  adminNote?: string;
  isRead?: boolean;
  createdAt: number;
  updatedAt?: number;
}
