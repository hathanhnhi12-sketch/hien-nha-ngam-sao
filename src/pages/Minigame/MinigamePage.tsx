import React, { useState } from 'react';
import { useMinigameStore } from '../../stores/useMinigameStore';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { toast } from '../../stores/useToastStore';
import { UserAvatar } from '../../components/common/UserAvatar';
import { 
  Gamepad2, 
  Sprout, 
  Fish, 
  Pickaxe, 
  UtensilsCrossed, 
  ShoppingBag, 
  Package, 
  CalendarCheck, 
  ScrollText, 
  Gift, 
  Coins, 
  Sparkles, 
  Zap, 
  Droplet, 
  Flame, 
  RotateCw,
  CheckCircle2,
  Clock,
  ArrowRight,
  User
} from 'lucide-react';

export const MinigamePage: React.FC = () => {
  const {
    profile,
    gardenPlots,
    inventory,
    items,
    recipes,
    quests,
    fishingState,
    diggingGrid,
    shopStock,
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
    openLuckyBox,
    updateProfile
  } = useMinigameStore();

  const [activeTab, setActiveTab] = useState<'garden' | 'fishing' | 'digging' | 'cooking' | 'shop' | 'inventory' | 'checkin' | 'quests' | 'luckybox'>('garden');
  const [selectedSeedId, setSelectedSeedId] = useState<string>('');
  const [selectedInventoryCategory, setSelectedInventoryCategory] = useState<string>('all');
  const [selectedShopCategory, setSelectedShopCategory] = useState<string>('all');
  const [luckyBoxOpening, setLuckyBoxOpening] = useState(false);
  const [luckyBoxReward, setLuckyBoxReward] = useState<any>(null);

  // Filter seed items available in inventory for planting
  const availableSeeds = inventory
    .map(slot => {
      const item = items.find(i => i.id === slot.itemId);
      if (item && item.category === 'seed') {
        return { item, quantity: slot.quantity };
      }
      return null;
    })
    .filter(Boolean) as { item: any; quantity: number }[];

  const formatCountdown = (ms: number) => {
    if (ms <= 0) return 'Có thể thu hoạch!';
    const totalSecs = Math.ceil(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}p ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const handleOpenLuckyBox = () => {
    if (profile.stats.coins < 50) {
      toast.error('Cần ít nhất 50 Moon Coin để mở Hộp Quà May Mắn.');
      return;
    }
    setLuckyBoxOpening(true);
    setLuckyBoxReward(null);

    setTimeout(() => {
      const reward = openLuckyBox();
      setLuckyBoxOpening(false);
      setLuckyBoxReward(reward);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Currency & Status Header */}
      <GlassCard variant="porch" className="p-4 sm:p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <UserAvatar
              src={profile.avatarUrl}
              alt={profile.displayName}
              size="lg"
              shape="rounded"
              ring="gold"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">{profile.displayName}</h2>
                <Badge variant="gold">Lv.{profile.stats.level}</Badge>
              </div>
              <p className="text-xs text-slate-300">
                Kinh nghiệm: {profile.stats.exp} / {profile.stats.level * 100} EXP
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-amber-400/30 text-amber-300 font-bold">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>{profile.stats.coins} Coin</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-purple-400/30 text-purple-300 font-bold">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>{profile.stats.stardust} Stardust</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-sky-400/30 text-sky-300 font-bold">
              <Zap className="w-4 h-4 text-sky-400" />
              <span>{profile.stats.energy} / {profile.stats.maxEnergy} Thể Lực</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-rose-400/30 text-rose-300 font-bold">
              <Flame className="w-4 h-4 text-rose-400" />
              <span>{profile.stats.streak} ngày</span>
            </div>
          </div>

        </div>
      </GlassCard>

      {/* Minigame Sub-navigation Tabs */}
      <div className="flex justify-center overflow-x-auto pb-2">
        <div className="flex p-1 bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs backdrop-blur-md gap-1">
          <button
            onClick={() => setActiveTab('garden')}
            className={`px-3 sm:px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'garden'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Sprout className="w-4 h-4" /> Khu Vườn (Farm)
          </button>

          <button
            onClick={() => setActiveTab('fishing')}
            className={`px-3 sm:px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'fishing'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Fish className="w-4 h-4" /> Hồ Câu Cá
          </button>

          <button
            onClick={() => setActiveTab('digging')}
            className={`px-3 sm:px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'digging'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Pickaxe className="w-4 h-4" /> Đào Kho Báu
          </button>

          <button
            onClick={() => setActiveTab('cooking')}
            className={`px-3 sm:px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'cooking'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" /> Bếp Nấu Ăn
          </button>

          <button
            onClick={() => setActiveTab('shop')}
            className={`px-3 sm:px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'shop'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Moon Shop
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 sm:px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'inventory'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" /> Túi Đồ
          </button>

          <button
            onClick={() => setActiveTab('checkin')}
            className={`px-3 sm:px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'checkin'
                ? 'bg-pink-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <CalendarCheck className="w-4 h-4" /> Điểm Danh
          </button>

          <button
            onClick={() => setActiveTab('quests')}
            className={`px-3 sm:px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'quests'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <ScrollText className="w-4 h-4" /> Nhiệm Vụ
          </button>

          <button
            onClick={() => setActiveTab('luckybox')}
            className={`px-3 sm:px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'luckybox'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Gift className="w-4 h-4" /> Hộp May Mắn
          </button>
        </div>
      </div>

      {/* TAB: GARDEN (FARM) */}
      {activeTab === 'garden' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-500" />
                Khu Vườn Ánh Trăng
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gieo hạt giống dưới ánh sao, tưới nước và chăm bón để thu hoạch những đóa hoa quý hiếm.
              </p>
            </div>

            {/* Seed selection dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Chọn hạt giống:</span>
              <select
                value={selectedSeedId}
                onChange={(e) => setSelectedSeedId(e.target.value)}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 font-medium"
              >
                <option value="">-- Chọn hạt từ túi ({availableSeeds.length}) --</option>
                {availableSeeds.map(({ item, quantity }) => (
                  <option key={item.id} value={item.id}>
                    {item.name} (còn x{quantity})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4 Soil Plots Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {gardenPlots.map((plot) => {
              const plantItem = items.find(i => i.id === plot.plantedSeedId);
              const now = Date.now();
              const isReady = plot.isPlanted && now >= plot.readyAt;
              const remainingTime = Math.max(0, plot.readyAt - now);
              const progressPercent = plot.isPlanted
                ? Math.min(100, Math.round(((now - (plot.readyAt - (plantItem?.growthDurationSeconds || 30) * 1000)) / ((plantItem?.growthDurationSeconds || 30) * 1000)) * 100))
                : 0;

              return (
                <GlassCard
                  key={plot.id}
                  className={`p-5 flex flex-col justify-between space-y-4 border-2 transition-all ${
                    isReady
                      ? 'border-emerald-400/80 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-lg'
                      : plot.isPlanted
                      ? 'border-indigo-300/60 dark:border-slate-700'
                      : 'border-dashed border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <div className="space-y-2 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Ô Đất #{plot.id + 1}
                    </span>

                    {/* Plant Visual Avatar */}
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-center text-4xl shadow-inner">
                      {plot.isPlanted ? (
                        isReady ? (
                          <span className="animate-bounce">{plantItem?.icon || '🌸'}</span>
                        ) : (
                          <span className="animate-pulse">{plot.stage === 0 ? '🌱' : plot.stage === 1 ? '🌿' : '🪴'}</span>
                        )
                      ) : (
                        <span className="opacity-40">🟫</span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        {plot.isPlanted ? plantItem?.name || 'Cây Trồng' : 'Đất Trống'}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        {plot.isPlanted ? (isReady ? '✦ Đã nở hoa!' : formatCountdown(remainingTime)) : 'Chưa gieo hạt giống'}
                      </p>
                    </div>

                    {plot.isPlanted && !isReady && (
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Actions for Plot */}
                  <div className="space-y-2 pt-2 border-t border-indigo-100/40 dark:border-slate-800">
                    {!plot.isPlanted ? (
                      <Button
                        size="sm"
                        variant="gold"
                        className="w-full justify-center"
                        disabled={!selectedSeedId}
                        onClick={() => {
                          if (!selectedSeedId) {
                            toast.error('Vui lòng chọn hạt giống ở góc trên trước.');
                            return;
                          }
                          plantSeed(plot.id, selectedSeedId);
                        }}
                      >
                        Gieo Hạt
                      </Button>
                    ) : isReady ? (
                      <Button
                        size="sm"
                        variant="gold"
                        className="w-full justify-center shadow-md animate-pulse"
                        onClick={() => harvestPlot(plot.id)}
                      >
                        Thu Hoạch 🌸
                      </Button>
                    ) : (
                      <div className="grid grid-cols-2 gap-1.5">
                        <Button
                          size="sm"
                          variant={plot.isWatered ? 'secondary' : 'primary'}
                          disabled={plot.isWatered}
                          onClick={() => waterPlot(plot.id)}
                          icon={<Droplet className="w-3.5 h-3.5" />}
                          className="justify-center text-xs"
                        >
                          {plot.isWatered ? 'Đã tưới' : 'Tưới'}
                        </Button>

                        <Button
                          size="sm"
                          variant="soft"
                          onClick={() => fertilizePlot(plot.id)}
                          icon={<Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                          className="justify-center text-xs"
                        >
                          Phân bón
                        </Button>
                      </div>
                    )}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: FISHING */}
      {activeTab === 'fishing' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <GlassCard variant="porch" className="p-8 text-center space-y-6">
            <div className="space-y-2">
              <span className="text-xs text-sky-300 font-bold uppercase tracking-widest block">
                ✦ Hồ Câu Cá Bán Nguyệt ✦
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Thả Cần Câu Dưới Ánh Trăng
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Hồ nước phản chiếu ngàn vì sao, nơi những chú cá ánh bạc bơi lội thanh bình.
              </p>
            </div>

            {/* Pond Visual Canvas / Tension State */}
            <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-tr from-sky-900 via-indigo-900 to-slate-950 border-4 border-sky-400/40 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
              <div className="text-5xl animate-pulse">
                {fishingState.isCast ? (fishingState.hasBite ? '🎣❗' : '🌊') : '🐟'}
              </div>
              <span className="text-[11px] text-sky-200 mt-2 font-medium">
                {fishingState.isCast
                  ? fishingState.hasBite
                    ? 'CÁ ĐÃ CẮN CÂU! GIẬT NGAY!'
                    : 'Đang đợi cá cắn câu...'
                  : 'Sẵn sàng thả cần'}
              </span>
            </div>

            {/* Fishing Action Button */}
            <div>
              {!fishingState.isCast ? (
                <Button
                  size="lg"
                  variant="gold"
                  onClick={castFishingRod}
                  icon={<Fish className="w-5 h-5" />}
                >
                  Thả Cần Câu (Tiêu hao 5 Thể Lực)
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant={fishingState.hasBite ? 'danger' : 'secondary'}
                  className={fishingState.hasBite ? 'animate-bounce shadow-xl' : ''}
                  onClick={reelFishingRod}
                  icon={<RotateCw className="w-5 h-5" />}
                >
                  {fishingState.hasBite ? 'KÉO CẦN NGAY ✦' : 'Kéo Cần Về'}
                </Button>
              )}
            </div>
          </GlassCard>
        </div>
      )}

      {/* TAB: DIGGING */}
      {activeTab === 'digging' && (
        <div className="max-w-xl mx-auto space-y-6">
          <GlassCard className="p-6 text-center space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center gap-2">
                <Pickaxe className="w-5 h-5 text-amber-500" />
                Thung Lũng Tinh Tú — Đào Kho Báu
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dùng cuốc đào tìm cổ vật, đá phát sáng và kho báu sao chìm sâu dưới lòng đất. (Mỗi ô tốn 3 Thể Lực)
              </p>
            </div>

            {/* 4x4 Grid */}
            <div className="grid grid-cols-4 gap-2.5 max-w-sm mx-auto p-2 bg-slate-900/60 rounded-2xl border border-amber-500/30 shadow-inner">
              {diggingGrid.map((tile) => (
                <button
                  key={tile.id}
                  onClick={() => digTile(tile.id)}
                  disabled={tile.isDug}
                  className={`h-16 rounded-xl flex items-center justify-center text-xl font-bold transition-all ${
                    tile.isDug
                      ? 'bg-slate-800 text-white border border-slate-700'
                      : 'bg-gradient-to-b from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-amber-200 border border-amber-500/40 shadow cursor-pointer active:scale-95'
                  }`}
                >
                  {tile.isDug ? (
                    tile.content ? (
                      <span className="animate-bounce">
                        {tile.content.type === 'chest' ? '💎' : tile.content.type === 'gem' ? '✨' : '🪙'}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">Trống</span>
                    )
                  ) : (
                    '⛏️'
                  )}
                </button>
              ))}
            </div>

            <Button variant="secondary" size="sm" onClick={resetDiggingGrid}>
              Làm Mới Bản Đồ Kho Báu
            </Button>
          </GlassCard>
        </div>
      )}

      {/* TAB: COOKING */}
      {activeTab === 'cooking' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-orange-500" />
              Bếp Nấu Ăn Dưới Mái Hiên
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Kết hợp các nguyên liệu hoa quả, cá câu được để chế biến những món ăn và thức uống thanh nhã.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recipes.map((recipe) => {
              // Check if user has all ingredients
              const canCook = recipe.ingredients.every(ing => {
                const slot = inventory.find(s => s.itemId === ing.itemId);
                return slot && slot.quantity >= ing.quantity;
              });

              return (
                <GlassCard key={recipe.id} className="p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{recipe.icon}</span>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{recipe.name}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{recipe.description}</p>
                        </div>
                      </div>
                      <Badge variant="gold">+{recipe.energyRestore} Thể Lực</Badge>
                    </div>

                    {/* Required ingredients list */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1 text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 block">Nguyên liệu cần:</span>
                      <div className="flex flex-wrap gap-2">
                        {recipe.ingredients.map((ing, idx) => {
                          const item = items.find(i => i.id === ing.itemId);
                          const slot = inventory.find(s => s.itemId === ing.itemId);
                          const hasEnough = (slot?.quantity || 0) >= ing.quantity;

                          return (
                            <span
                              key={idx}
                              className={`px-2 py-0.5 rounded-md text-[11px] ${
                                hasEnough
                                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 font-medium'
                                  : 'bg-rose-500/15 text-rose-600 dark:text-rose-300'
                              }`}
                            >
                              {item?.icon} {item?.name} (x{slot?.quantity || 0}/{ing.quantity})
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant={canCook ? 'gold' : 'secondary'}
                    disabled={!canCook}
                    onClick={() => cookRecipe(recipe.id)}
                    className="w-full justify-center"
                  >
                    {canCook ? 'Bắt Đầu Nấu Món 🍳' : 'Thiếu Nguyên Liệu'}
                  </Button>
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: MOON SHOP */}
      {activeTab === 'shop' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-500" />
                Moon Shop & Chợ Giao Thương
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Mua sắm hạt giống, cần câu, công cụ kho báu, nguyên liệu nấu ăn và quà tặng nhân vật.
              </p>
            </div>

            {/* 5 EXPLICIT SHOP CATEGORIES */}
            <div className="flex flex-wrap p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs gap-1">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'flowers', label: '🌸 Trồng hoa' },
                { id: 'fishing', label: '🎣 Câu cá' },
                { id: 'treasure', label: '⛏️ Đào kho báu' },
                { id: 'cooking', label: '🍳 Nấu ăn' },
                { id: 'gifts', label: '🎁 Quà tặng' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedShopCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
                    selectedShopCategory === cat.id
                      ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-300 font-bold shadow'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {shopStock
              .filter(shopItem => {
                if (selectedShopCategory === 'all') return true;
                const item = items.find(i => i.id === shopItem.itemId);
                if (!item) return false;

                // Match with shopCategory or inferred category
                if (item.shopCategory) return item.shopCategory === selectedShopCategory;
                if (selectedShopCategory === 'flowers') return item.category === 'seed' || item.category === 'flower' || item.category === 'tool';
                if (selectedShopCategory === 'fishing') return item.category === 'rod' || item.category === 'bait' || item.category === 'fish';
                if (selectedShopCategory === 'treasure') return item.category === 'treasure' || item.category === 'tool';
                if (selectedShopCategory === 'cooking') return item.category === 'ingredient' || item.category === 'dish';
                if (selectedShopCategory === 'gifts') return item.category === 'gift' || item.category === 'special';
                return true;
              })
              .map((shopItem) => {
                const item = items.find(i => i.id === shopItem.itemId);
                if (!item) return null;

                return (
                  <GlassCard key={shopItem.id} className="p-4 flex flex-col justify-between space-y-3" variant="subtle">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl shrink-0 p-2 rounded-2xl bg-white/50 dark:bg-slate-800/80 shadow-inner">{item.icon}</span>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold truncate text-slate-800 dark:text-slate-100">{item.name}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{item.description}</p>
                        <div className="mt-1 flex items-center gap-1.5">
                          <Badge variant="gold">
                            <Coins className="w-3 h-3 mr-0.5" />
                            {shopItem.price} Coin
                          </Badge>
                          <span className="text-[10px] text-slate-400">Còn lại: {shopItem.stock}</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="gold"
                      disabled={shopItem.stock <= 0 || profile.stats.coins < shopItem.price}
                      onClick={() => buyItem(shopItem.itemId, 1)}
                      className="w-full justify-center"
                    >
                      Mua Ngay (x1)
                    </Button>
                  </GlassCard>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB: INVENTORY */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-500" />
                Túi Đồ Lữ Khách ({inventory.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Các hạt giống, sản vật thu hoạch, cá và bảo vật bạn đang sở hữu.
              </p>
            </div>

            {/* Category tabs */}
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
              {['all', 'seed', 'flower', 'fish', 'dish', 'treasure'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedInventoryCategory(cat)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    selectedInventoryCategory === cat
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {cat === 'all' ? 'Tất cả' : cat === 'seed' ? 'Hạt giống' : cat === 'flower' ? 'Hoa' : cat === 'fish' ? 'Cá' : cat === 'dish' ? 'Món ăn' : 'Kho báu'}
                </button>
              ))}
            </div>
          </div>

          {inventory.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
              Túi đồ của bạn đang trống. Hãy ghé Moon Shop hoặc làm nông nhé!
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {inventory
                .filter(slot => {
                  if (selectedInventoryCategory === 'all') return true;
                  const item = items.find(i => i.id === slot.itemId);
                  return item?.category === selectedInventoryCategory;
                })
                .map((slot) => {
                  const item = items.find(i => i.id === slot.itemId);
                  if (!item) return null;

                  return (
                    <GlassCard key={slot.itemId} className="p-3 text-center space-y-2 flex flex-col justify-between">
                      <div>
                        <span className="text-3xl block my-1">{item.icon}</span>
                        <h4 className="text-xs font-bold truncate text-slate-800 dark:text-slate-100">{item.name}</h4>
                        <span className="text-[10px] text-amber-500 font-semibold block">Số lượng: x{slot.quantity}</span>
                      </div>

                      {item.sellPrice && (
                        <Button
                          size="sm"
                          variant="soft"
                          onClick={() => sellItem(item.id, 1)}
                          className="w-full text-[11px] py-1 justify-center"
                        >
                          Bán ({item.sellPrice}🪙)
                        </Button>
                      )}
                    </GlassCard>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* TAB: DAILY CHECK-IN */}
      {activeTab === 'checkin' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <GlassCard className="p-6 sm:p-8 text-center space-y-6" variant="porch">
            <div className="space-y-1">
              <span className="text-xs text-amber-300 font-bold uppercase tracking-widest block">
                ✦ Điểm Danh Nhận Quà Dưới Hiên Sao ✦
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Chuỗi Điểm Danh: {profile.stats.streak} Ngày
              </h3>
              <p className="text-xs text-slate-300">
                Ghé thăm hiên nhà mỗi ngày để nhận quà tặng, thể lực và Moon Coin miễn phí!
              </p>
            </div>

            {/* 7 Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                const isClaimed = profile.stats.streak >= day;
                const isCurrent = profile.stats.streak + 1 === day;

                return (
                  <div
                    key={day}
                    className={`p-3 rounded-2xl text-center space-y-1 border ${
                      isClaimed
                        ? 'bg-emerald-500/20 border-emerald-400/60 text-emerald-300'
                        : isCurrent
                        ? 'bg-amber-400/20 border-amber-400 text-amber-300 ring-2 ring-amber-400'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="text-[10px] font-bold block">Ngày {day}</span>
                    <span className="text-xl block">{day === 7 ? '🎁' : day % 2 === 0 ? '✨' : '🪙'}</span>
                    <span className="text-[10px] block font-semibold">{isClaimed ? '✓ Nhận' : `+${day * 15}🪙`}</span>
                  </div>
                );
              })}
            </div>

            <div>
              <Button
                variant="gold"
                size="lg"
                onClick={claimCheckIn}
                icon={<CalendarCheck className="w-5 h-5" />}
              >
                Điểm Danh Hôm Nay ✦
              </Button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* TAB: QUESTS */}
      {activeTab === 'quests' && (
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <ScrollText className="w-5 h-5 text-purple-500" />
              Nhiệm Vụ & Thành Tựu Hàng Ngày
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hoàn thành các hoạt động dưới hiên nhà để nhận thưởng kinh nghiệm và tiền tệ.
            </p>
          </div>

          <div className="space-y-3">
            {quests.map((quest) => {
              const isDone = quest.progress >= quest.target;

              return (
                <GlassCard key={quest.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                        {quest.title}
                      </h4>
                      {quest.isClaimed && <Badge variant="status" status="open">Đã Nhận</Badge>}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{quest.description}</p>

                    {/* Progress Bar */}
                    <div className="space-y-1 max-w-xs">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Tiến độ</span>
                        <span>{quest.progress} / {quest.target}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${Math.min(100, (quest.progress / quest.target) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-xs font-bold text-amber-500">
                      +{quest.rewardCoins} 🪙 / +{quest.rewardExp} EXP
                    </span>
                    <Button
                      size="sm"
                      variant={isDone && !quest.isClaimed ? 'gold' : 'secondary'}
                      disabled={!isDone || quest.isClaimed}
                      onClick={() => claimQuestReward(quest.id)}
                    >
                      {quest.isClaimed ? 'Đã Nhận' : isDone ? 'Nhận Thưởng ✦' : 'Chưa Xong'}
                    </Button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: LUCKY BOX */}
      {activeTab === 'luckybox' && (
        <div className="max-w-md mx-auto space-y-6">
          <GlassCard variant="porch" className="p-8 text-center space-y-6">
            <div className="space-y-1">
              <span className="text-xs text-amber-300 font-bold uppercase tracking-widest block">
                ✦ Rương Báu Huyền Bí ✦
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Hộp Quà May Mắn Tinh Tú
              </h3>
              <p className="text-xs text-slate-300">
                Mở rương bí ẩn với giá 50 Moon Coin để nhận ngẫu nhiên hoa hiếm, thẻ bói hoặc stardust lấp lánh!
              </p>
            </div>

            <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-purple-600 to-indigo-600 p-1 shadow-2xl flex items-center justify-center text-5xl">
              <div className={`w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center ${luckyBoxOpening ? 'animate-bounce' : ''}`}>
                🎁
              </div>
            </div>

            <div>
              <Button
                size="lg"
                variant="gold"
                disabled={luckyBoxOpening}
                onClick={handleOpenLuckyBox}
                icon={<Sparkles className="w-5 h-5" />}
              >
                {luckyBoxOpening ? 'Đang Mở Rương...' : 'Mở Rương (50 Coin) ✦'}
              </Button>
            </div>

            {luckyBoxReward && (
              <div className="p-4 rounded-2xl bg-amber-400/20 border border-amber-400 text-amber-200 text-xs font-bold animate-fade-in">
                {luckyBoxReward.message}
              </div>
            )}
          </GlassCard>
        </div>
      )}

    </div>
  );
};
