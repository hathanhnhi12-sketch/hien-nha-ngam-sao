import { useState, useEffect, useRef } from 'react';
import { UserProfile, GardenPlot, MinigameItem, Quest, MinigameRecipe, GiftHistoryItem } from '../types';
import { StorageService } from '../services/storageService';
import { toast } from './useToastStore';
import confetti from 'canvas-confetti';

export interface UIPlot {
  id: number;
  isPlanted: boolean;
  plantedSeedId?: string;
  plantedAt?: number;
  readyAt: number;
  stage: number;
  isWatered: boolean;
  isFertilized: boolean;
}

export interface FishingState {
  isCast: boolean;
  hasBite: boolean;
}

export interface DiggingTile {
  id: number;
  isDug: boolean;
  content?: { type: 'chest' | 'gem' | 'coin'; value: number } | null;
}

export interface ShopStockItem {
  id: string;
  itemId: string;
  price: number;
  stock: number;
}

const INITIAL_DIGGING_GRID = (): DiggingTile[] => {
  return Array.from({ length: 16 }, (_, i) => {
    const rand = Math.random();
    let content: DiggingTile['content'] = null;
    if (rand > 0.8) {
      content = { type: 'chest', value: 100 };
    } else if (rand > 0.5) {
      content = { type: 'gem', value: 50 };
    } else if (rand > 0.25) {
      content = { type: 'coin', value: 25 };
    }
    return {
      id: i,
      isDug: false,
      content
    };
  });
};

export function useMinigameStore() {
  const [profile, setProfile] = useState<UserProfile>(() => StorageService.getUserProfile());
  const [items, setItems] = useState<MinigameItem[]>(() => StorageService.getMinigameItems());
  const [recipes, setRecipes] = useState<MinigameRecipe[]>(() => StorageService.getMinigameRecipes());
  const [quests, setQuests] = useState<Quest[]>(() => StorageService.getQuests());
  const [giftHistory, setGiftHistory] = useState<GiftHistoryItem[]>(() => StorageService.getGiftHistory());
  const [mailbox, setMailbox] = useState<any[]>([]);
  
  // Interactive Minigame states
  const [fishingState, setFishingState] = useState<FishingState>({ isCast: false, hasBite: false });
  const fishingTimerRef = useRef<any>(null);
  const [diggingGrid, setDiggingGrid] = useState<DiggingTile[]>(INITIAL_DIGGING_GRID);

  useEffect(() => {
    if (profile.email) {
      import('../services/accountService').then(m => {
        m.AccountService.linkAccount(profile.email!, profile, (latestProfile) => {
          setProfile(prev => ({ ...prev, ...latestProfile }));
          StorageService.saveUserProfile({ ...profile, ...latestProfile });
        }, (msgs) => {
          setMailbox(msgs);
        }).then(linkedProfile => {
          setProfile(prev => ({ ...prev, ...linkedProfile }));
          StorageService.saveUserProfile({ ...profile, ...linkedProfile });
        });
      }).catch(console.error);
    }
  }, [profile.email]);

  // Save profile on change
  useEffect(() => {
    StorageService.saveUserProfile(profile);
  }, [profile]);

  // Save quests on change
  useEffect(() => {
    StorageService.saveQuests(quests);
  }, [quests]);

  // Ticker for garden growth countdown
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addExp = (amount: number) => {
    let leveledUpLevel: number | null = null;
    setProfile(prev => {
      let newExp = prev.stats.exp + amount;
      let newLevel = prev.stats.level;
      const maxExpForLevel = newLevel * 100;

      if (newExp >= maxExpForLevel) {
        newExp -= maxExpForLevel;
        newLevel += 1;
        leveledUpLevel = newLevel;
      }

      return {
        ...prev,
        stats: {
          ...prev.stats,
          exp: newExp,
          level: newLevel
        }
      };
    });

    if (leveledUpLevel !== null) {
      const lvl = leveledUpLevel;
      setTimeout(() => {
        toast.star(`Chúc mừng! Bạn đã đạt Cấp ${lvl} dưới Mái Hiên ✦`);
        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {}
      }, 0);
    }
  };

  const addCoins = (amount: number) => {
    setProfile(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        coins: Math.max(0, prev.stats.coins + amount)
      }
    }));
  };

  const addStardust = (amount: number) => {
    setProfile(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        stardust: Math.max(0, prev.stats.stardust + amount)
      }
    }));
  };

  const consumeEnergy = (amount: number): boolean => {
    if (profile.stats.energy < amount) {
      toast.error('Năng lượng không đủ! Hãy ngồi nghỉ ngơi dưới hiên nhà hoặc điểm danh để hồi phục.');
      return false;
    }
    setProfile(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        energy: Math.max(0, prev.stats.energy - amount)
      }
    }));
    return true;
  };

  const updateProfile = (updated: UserProfile) => {
    setProfile(updated);
    StorageService.saveUserProfile(updated);
  };

  const addItemToInventory = (itemId: string, quantity: number = 1) => {
    setProfile(prev => {
      const inv = [...prev.inventory];
      const existing = inv.find(s => s.itemId === itemId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        inv.push({ itemId, quantity });
      }
      return { ...prev, inventory: inv };
    });
  };

  const removeItemFromInventory = (itemId: string, quantity: number = 1): boolean => {
    let success = false;
    setProfile(prev => {
      const inv = [...prev.inventory];
      const existing = inv.find(s => s.itemId === itemId);
      if (existing && existing.quantity >= quantity) {
        existing.quantity -= quantity;
        const cleaned = inv.filter(s => s.quantity > 0);
        success = true;
        return { ...prev, inventory: cleaned };
      }
      return prev;
    });
    return success;
  };

  const getItemCount = (itemId: string): number => {
    const slot = profile.inventory.find(s => s.itemId === itemId);
    return slot ? slot.quantity : 0;
  };

  // Quest progress helper
  const progressQuest = (type: Quest['type'], amount: number = 1) => {
    let completedQuestTitle: string | null = null;
    setQuests(prev => prev.map(q => {
      if (q.type === type && !q.isCompleted) {
        const nextProg = Math.min(q.target, q.progress + amount);
        const isCompleted = nextProg >= q.target;
        if (isCompleted && !q.isCompleted) {
          completedQuestTitle = q.title;
        }
        return {
          ...q,
          progress: nextProg,
          isCompleted
        };
      }
      return q;
    }));

    if (completedQuestTitle) {
      const title = completedQuestTitle;
      setTimeout(() => {
        toast.star(`Nhiệm vụ hoàn thành: ${title} ✦`);
      }, 0);
    }
  };

  // Garden logic
  const gardenPlots: UIPlot[] = (profile.garden && profile.garden.length > 0 ? profile.garden : [
    { id: 0, status: 'empty', isWatered: false, isFertilized: false },
    { id: 1, status: 'empty', isWatered: false, isFertilized: false },
    { id: 2, status: 'empty', isWatered: false, isFertilized: false },
    { id: 3, status: 'empty', isWatered: false, isFertilized: false }
  ]).map(p => {
    const isPlanted = p.status !== 'empty' && !!p.seedItemId;
    const duration = (p.growthDurationSeconds || 30) * 1000;
    const plantedAt = p.plantedAt || Date.now();
    const readyAt = plantedAt + duration;
    const now = Date.now();
    let stage = 0;
    if (now >= readyAt) stage = 2;
    else if (now >= plantedAt + duration * 0.5) stage = 1;

    return {
      id: p.id,
      isPlanted,
      plantedSeedId: p.seedItemId,
      plantedAt: p.plantedAt,
      readyAt,
      stage,
      isWatered: !!p.isWatered,
      isFertilized: !!p.isFertilized
    };
  });

  const plantSeed = (plotId: number, seedItemId: string) => {
    const seed = items.find(i => i.id === seedItemId);
    if (!seed || getItemCount(seedItemId) <= 0) {
      toast.error('Bạn không có đủ hạt giống này.');
      return;
    }

    if (!consumeEnergy(5)) return;

    removeItemFromInventory(seedItemId, 1);
    setProfile(prev => {
      const garden = prev.garden.map(plot => {
        if (plot.id === plotId) {
          return {
            ...plot,
            status: 'growing' as const,
            seedItemId,
            plantedAt: Date.now(),
            growthDurationSeconds: seed.growthTimeSeconds || 30,
            isWatered: true,
            isFertilized: false
          };
        }
        return plot;
      });
      return { ...prev, garden };
    });
    toast.success(`Đã gieo ${seed.name} vào luống đất ✦`);
  };

  const waterPlot = (plotId: number) => {
    setProfile(prev => ({
      ...prev,
      garden: prev.garden.map(p => p.id === plotId ? { ...p, isWatered: true } : p)
    }));
    toast.success('Đã tưới nước cho luống hoa ✦');
  };

  const fertilizePlot = (plotId: number) => {
    setProfile(prev => ({
      ...prev,
      garden: prev.garden.map(p => {
        if (p.id === plotId) {
          // Speed up growth by 50%
          const plantedAt = (p.plantedAt || Date.now()) - ((p.growthDurationSeconds || 30) * 500);
          return { ...p, isFertilized: true, plantedAt };
        }
        return p;
      })
    }));
    toast.star('Đã bón phân lân sao! Cây lớn nhanh hơn ✦');
  };

  const harvestPlot = (plotId: number) => {
    const plot = profile.garden.find(p => p.id === plotId);
    if (!plot || !plot.seedItemId) return;

    const seed = items.find(i => i.id === plot.seedItemId);
    if (!seed || !seed.harvestYieldItemId) return;

    const yieldItem = items.find(i => i.id === seed.harvestYieldItemId);
    const yieldCount = seed.harvestYieldCount || 2;

    addItemToInventory(seed.harvestYieldItemId, yieldCount);
    addExp(seed.expReward || 30);
    addCoins(10);

    setProfile(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        totalHarvested: (prev.stats.totalHarvested || 0) + yieldCount
      },
      garden: prev.garden.map(p => p.id === plotId ? { id: plotId, status: 'empty', isWatered: false, isFertilized: false } : p)
    }));

    progressQuest('harvest', yieldCount);
    toast.star(`Thu hoạch thành công +${yieldCount} ${yieldItem?.name || 'Hoa Tinh Tú'} ✦`);
    try {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    } catch {}
  };

  // Fishing logic
  const castFishingRod = () => {
    if (!consumeEnergy(5)) return;

    setFishingState({ isCast: true, hasBite: false });
    toast.info('Đã buông cần câu xuống hồ... Hãy đợi cá cắn câu!');

    if (fishingTimerRef.current) clearTimeout(fishingTimerRef.current);
    const delay = 2000 + Math.random() * 2500;
    fishingTimerRef.current = setTimeout(() => {
      setFishingState({ isCast: true, hasBite: true });
      toast.star('Cá đã cắn câu! Hãy giật cần ngay! 🎣');
    }, delay);
  };

  const reelFishingRod = () => {
    if (fishingTimerRef.current) clearTimeout(fishingTimerRef.current);

    if (fishingState.hasBite) {
      const fishPool = items.filter(i => i.category === 'fish');
      const rand = Math.random();
      let caughtFish = fishPool[0] || { id: 'fish_moon_carp', name: 'Cá Chép Ánh Trăng', icon: '🎏', expReward: 35 };

      if (rand > 0.85) {
        caughtFish = fishPool.find(f => f.rarity === 'celestial') || caughtFish;
      } else if (rand > 0.5) {
        caughtFish = fishPool.find(f => f.rarity === 'rare') || caughtFish;
      }

      addItemToInventory(caughtFish.id, 1);
      addExp(caughtFish.expReward || 35);
      addCoins(15);

      setProfile(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          totalFished: (prev.stats.totalFished || 0) + 1
        }
      }));

      progressQuest('fish', 1);
      toast.star(`Tuyệt vời! Bạn vừa câu được ${caughtFish.name} ${caughtFish.icon} ✦`);
      try {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      } catch {}
    } else {
      toast.info('Bạn đã thu cần về. Chưa có chú cá nào cắn câu.');
    }

    setFishingState({ isCast: false, hasBite: false });
  };

  const catchFish = () => {
    if (!consumeEnergy(5)) return null;
    const fishPool = items.filter(i => i.category === 'fish');
    const caughtFish = fishPool[0];
    if (caughtFish) {
      addItemToInventory(caughtFish.id, 1);
      addExp(35);
      addCoins(15);
      progressQuest('fish', 1);
    }
    return caughtFish;
  };

  // Digging logic
  const digTile = (tileId: number) => {
    const tile = diggingGrid.find(t => t.id === tileId);
    if (!tile || tile.isDug) return;

    if (!consumeEnergy(3)) return;

    let rewardText = '';
    if (tile.content) {
      if (tile.content.type === 'chest') {
        addItemToInventory('treasure_relic_chest', 1);
        addExp(50);
        addStardust(30);
        rewardText = 'Hòm Cổ Vật Màn Đêm (+30 Stardust)';
      } else if (tile.content.type === 'gem') {
        addItemToInventory('treasure_stardust_gem', 1);
        addExp(40);
        addStardust(15);
        rewardText = 'Tinh Thể Bụi Sao (+15 Stardust)';
      } else {
        const coinGain = tile.content.value || 25;
        addCoins(coinGain);
        addExp(20);
        rewardText = `${coinGain} Moon Coins`;
      }
    }

    setDiggingGrid(prev => prev.map(t => t.id === tileId ? { ...t, isDug: true } : t));
    setProfile(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        totalDug: (prev.stats.totalDug || 0) + 1
      }
    }));

    progressQuest('dig', 1);
    if (rewardText) {
      toast.star(`Khai quật thành công: nhận được ${rewardText} ✦`);
    } else {
      toast.info('Ô đất này trống, hãy thử đào ô khác nhé!');
    }
  };

  const resetDiggingGrid = () => {
    setDiggingGrid(INITIAL_DIGGING_GRID());
    toast.success('Đã làm mới bản đồ kho báu ✦');
  };

  const digTreasure = (_gridIndex: number) => {
    digTile(_gridIndex);
    return 'Kho báu';
  };

  // Cooking logic
  const cookRecipe = (recipeId: string) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;

    for (const ing of recipe.ingredients) {
      if (getItemCount(ing.itemId) < ing.quantity) {
        toast.error('Bạn không có đủ nguyên liệu để chế biến món này.');
        return;
      }
    }

    if (!consumeEnergy(8)) return;

    recipe.ingredients.forEach(ing => {
      removeItemFromInventory(ing.itemId, ing.quantity);
    });

    addExp(recipe.expReward);
    addCoins(recipe.coinReward);

    setProfile(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        totalCooked: (prev.stats.totalCooked || 0) + 1,
        energy: Math.min(prev.stats.maxEnergy, prev.stats.energy + (recipe.energyRestore || 20))
      }
    }));

    progressQuest('cook', 1);
    toast.star(`Đã nấu thành công ${recipe.name} ${recipe.icon} (+${recipe.energyRestore} Thể Lực) ✦`);
    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    } catch {}
  };

  // Shop logic
  const shopStock: ShopStockItem[] = items
    .filter(i => i.isShopAvailable !== false)
    .map(i => ({
      id: 'shop_' + i.id,
      itemId: i.id,
      price: i.price || 25,
      stock: 99
    }));

  const buyItem = (itemId: string, quantity: number = 1) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const totalCost = (item.price || 25) * quantity;
    if (profile.stats.coins < totalCost) {
      toast.error('Bạn không có đủ Moon Coin để mua vật phẩm này.');
      return;
    }

    addCoins(-totalCost);
    addItemToInventory(itemId, quantity);
    toast.success(`Đã mua ${quantity}x ${item.name} (${totalCost}🪙) ✦`);
  };

  const sellItem = (itemId: string, quantity: number = 1) => {
    const item = items.find(i => i.id === itemId);
    if (!item || getItemCount(itemId) < quantity) {
      toast.error('Không đủ vật phẩm để bán.');
      return;
    }

    const totalGain = (item.sellPrice || 10) * quantity;
    removeItemFromInventory(itemId, quantity);
    addCoins(totalGain);
    toast.success(`Đã bán ${quantity}x ${item.name} (+${totalGain}🪙) ✦`);
  };

  // Daily Check-in
  const dailyCheckIn = () => {
    const today = new Date().toISOString().split('T')[0];
    if (profile.stats.lastCheckInDate === today) {
      toast.info('Hôm nay bạn đã điểm danh rồi. Hãy quay lại vào ngày mai nhé!');
      return;
    }

    const nextStreak = profile.stats.streak + 1;
    const coinsReward = 50 + nextStreak * 10;
    const stardustReward = 15 + nextStreak * 5;

    addCoins(coinsReward);
    addStardust(stardustReward);
    addExp(60);

    setProfile(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        streak: nextStreak,
        lastCheckInDate: today,
        energy: prev.stats.maxEnergy
      }
    }));

    toast.star(`Điểm danh ngày ${nextStreak} thành công: +${coinsReward} Coins, +${stardustReward} Stardust, Hồi phục 100% Năng lượng ✦`);
    try {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
    } catch {}
  };

  const claimCheckIn = dailyCheckIn;

  // Lucky Box
  const openLuckyBox = () => {
    if (profile.stats.freeLuckyBoxCount <= 0 && profile.stats.coins < 50) {
      toast.error('Hết lượt mở miễn phí và không đủ 50 Moon Coins.');
      return null;
    }

    const isFree = profile.stats.freeLuckyBoxCount > 0;
    if (!isFree) {
      addCoins(-50);
    } else {
      setProfile(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          freeLuckyBoxCount: Math.max(0, prev.stats.freeLuckyBoxCount - 1)
        }
      }));
    }

    const rand = Math.random();
    let prizeName = '';

    if (rand > 0.8) {
      addItemToInventory('gift_music_box', 1);
      prizeName = 'Hộp Nhạc Giai Điệu Trăng (Legendary)';
      addStardust(50);
    } else if (rand > 0.5) {
      addItemToInventory('gift_star_map', 1);
      prizeName = 'Bản Đồ Sao Cổ Xưa (Rare)';
      addCoins(80);
    } else {
      addItemToInventory('seed_star_lotus', 2);
      prizeName = '2x Hạt Sen Tinh Tú';
      addCoins(40);
    }

    addExp(45);
    toast.star(`Mở Hộp May Mắn: Nhận được ${prizeName} ✦`);
    try {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } catch {}
    return { message: `Chúc mừng bạn đã nhận được: ${prizeName}!` };
  };

  // Gift to character
  const giftCharacter = (characterId: string, characterName: string, itemId: string, quantity: number = 1) => {
    const item = items.find(i => i.id === itemId);
    if (!item || getItemCount(itemId) < quantity) {
      toast.error('Không đủ vật phẩm trong túi đồ.');
      return { success: false, affinityGained: 0 };
    }

    removeItemFromInventory(itemId, quantity);
    const bonus = (item.giftAffinityBonus || 20) * quantity;
    
    const chars = StorageService.getCharacters();
    const target = chars.find(c => c.id === characterId);
    if (target) {
      target.affinity = (target.affinity || 0) + bonus;
      StorageService.saveCharacters(chars);
    }

    const historyItem: GiftHistoryItem = {
      id: 'gift_log_' + Date.now(),
      characterId,
      characterName,
      itemId,
      itemName: item.name,
      itemIcon: item.icon,
      quantity,
      affinityGained: bonus,
      timestamp: Date.now()
    };

    StorageService.addGiftHistory(historyItem);
    setGiftHistory(StorageService.getGiftHistory());

    setProfile(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        totalGiftsSent: (prev.stats.totalGiftsSent || 0) + quantity
      }
    }));

    progressQuest('gift', quantity);
    addExp(30 * quantity);
    toast.star(`Đã gửi tặng ${characterName} ${quantity}x ${item.name}! +${bonus} Điểm thân thiết ✦`);
    return { success: true, affinityGained: bonus };
  };

  // Claim Quest
  const claimQuestReward = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || !quest.isCompleted || quest.isClaimed) return;

    addExp(quest.rewardExp);
    addCoins(quest.rewardCoins);
    addStardust(quest.rewardStardust);

    if (quest.rewardItemId && quest.rewardItemQty) {
      addItemToInventory(quest.rewardItemId, quest.rewardItemQty);
    }

    setQuests(prev => prev.map(q => q.id === questId ? { ...q, isClaimed: true } : q));
    toast.star(`Đã nhận thưởng nhiệm vụ: +${quest.rewardCoins} Coins, +${quest.rewardStardust} Stardust ✦`);
    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    } catch {}
  };

  const claimQuest = claimQuestReward;

  return {
    profile,
    inventory: profile.inventory,
    items,
    recipes,
    quests,
    giftHistory,
    mailbox,
    gardenPlots,
    fishingState,
    diggingGrid,
    shopStock,
    addCoins,
    addStardust,
    addExp,
    plantSeed,
    waterPlot,
    fertilizePlot,
    harvestPlot,
    castFishingRod,
    reelFishingRod,
    digTile,
    resetDiggingGrid,
    cookRecipe,
    buyItem,
    sellItem,
    claimCheckIn,
    claimQuestReward,
    dailyCheckIn,
    claimQuest,
    openLuckyBox,
    giftCharacter,
    addItemToInventory,
    removeItemFromInventory,
    getItemCount,
    setProfile,
    updateProfile,
    catchFish,
    digTreasure
  };
}
