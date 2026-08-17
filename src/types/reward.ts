export type RewardType = 'coin' | 'stardust' | 'energy' | 'exp' | 'item';

export interface RewardItem {
  type: RewardType;
  amount: number;
  itemId?: string; // If type is 'item'
  itemName?: string;
  itemIcon?: string;
}

export interface RewardPackage {
  rewards: RewardItem[];
}

export interface RewardBoxItem {
  id?: string;
  name?: string;
  reward: RewardItem;
  weight: number; // For probability
}

export interface RewardCode {
  id: string; // The code itself (e.g. 'STARBOX2026')
  code: string; // Normalized uppercase code
  name?: string;
  description?: string;
  rewardType: 'direct' | 'random_box';
  rewardPackage?: RewardPackage;
  rewardPool?: RewardBoxItem[];
  maxUses: number | null; // null for unlimited
  currentUses: number;
  expiresAt: number | null;
  isActive: boolean;
  isOneUsePerAccount?: boolean;
  createdAt: number;
}

export interface RewardBox {
  id: string;
  name: string;
  description: string;
  icon: string;
  items: RewardBoxItem[];
  isActive: boolean;
}

export interface MailboxMessage {
  id: string;
  sender: string;
  title: string;
  message: string;
  rewardPackage?: RewardPackage;
  isRead: boolean;
  isClaimed: boolean;
  createdAt: number;
}

export interface RewardRedemption {
  id: string;
  codeId: string;
  code: string;
  userId: string;
  userNickname?: string;
  redeemedAt: number;
  rewardPackage: RewardPackage;
}
