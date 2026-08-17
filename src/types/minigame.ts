// src/types/minigame.ts
export type ItemCategory = 
  | 'seed' 
  | 'flower' 
  | 'fish' 
  | 'rod' 
  | 'bait' 
  | 'tool' 
  | 'treasure' 
  | 'ingredient' 
  | 'dish' 
  | 'gift' 
  | 'special';

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'celestial';

export interface MinigameItem {
  id: string;
  name: string;
  category: ItemCategory;
  rarity: ItemRarity;
  icon: string;
  description: string;
  buyPrice: number;
  sellPrice: number;
  growthTimeSeconds?: number;
  harvestYieldItemId?: string;
  harvestYieldCount?: number;
  expReward?: number;
  giftAffinityBonus?: number;
  affinityGain?: number;
  isShopAvailable?: boolean;
  shopCategory?: 'flowers' | 'fishing' | 'treasure' | 'cooking' | 'gifts';
}

export interface InventorySlot {
  itemId: string;
  quantity: number;
}

export interface GardenPlot {
  id: number;
  status: 'empty' | 'growing' | 'ready';
  seedItemId?: string;
  plantedAt?: number;
  growthDurationSeconds?: number;
  isWatered: boolean;
  isFertilized: boolean;
}

export interface RecipeIngredient {
  itemId: string;
  quantity: number;
}

export interface MinigameRecipe {
  id: string;
  name: string;
  description: string;
  icon: string;
  ingredients: RecipeIngredient[];
  resultItemId: string;
  resultQty: number;
  cookTimeSeconds: number;
  expReward: number;
  coinReward: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'master';
  unlockedAtLevel: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: 'daily' | 'achievement';
  type: 'harvest' | 'fish' | 'dig' | 'cook' | 'gift' | 'visit' | 'love' | 'chat';
  target: number;
  progress: number;
  rewardExp: number;
  rewardCoins: number;
  rewardStardust: number;
  rewardItemId?: string;
  rewardItemQty?: number;
  isClaimed: boolean;
  isCompleted: boolean;
}

export interface UserStats {
  level: number;
  exp: number;
  coins: number;
  stardust: number;
  energy: number;
  maxEnergy: number;
  streak: number;
  lastCheckInDate: string;
  freeLuckyBoxCount: number;
  lastLuckyBoxReset: string;
  totalHarvested: number;
  totalFished: number;
  totalDug: number;
  totalCooked: number;
  totalGiftsSent: number;
}

export interface UserProfile {
  uid: string;
  email?: string;
  displayName: string;
  nickname: string;
  avatarUrl: string;
  bio?: string;
  role: 'user' | 'owner';
  customTitle?: string;
  stats: UserStats;
  inventory: InventorySlot[];
  garden: GardenPlot[];
  favoriteCharacterIds: string[];
  favoriteQuoteIds: string[];
  lastLogin: number;
  createdAt: number;
}

export interface GiftHistoryItem {
  id: string;
  characterId: string;
  characterName: string;
  itemId: string;
  itemName: string;
  itemIcon: string;
  quantity: number;
  affinityGained: number;
  timestamp: number;
}

export interface Constellation {
  id: string;
  name: string;
  vietnameseName: string;
  season: string;
  starsCount: number;
  mythology: string;
  meaning: string;
  color: string;
  starPoints: { x: number; y: number; size: number; label?: string }[];
  lines: [number, number][];
}
