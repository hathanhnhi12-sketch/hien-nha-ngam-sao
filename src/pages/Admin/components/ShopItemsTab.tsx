import React, { useState } from 'react';
import { MinigameItem, ItemRarity, ItemCategory } from '../../../types';
import { StorageService } from '../../../services/storageService';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { Input, Textarea } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { Badge } from '../../../components/ui/Badge';
import { toast } from '../../../stores/useToastStore';
import { 
  ShoppingBag, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  Search, 
  Coins, 
  Heart,
  Sparkles,
  Gift
} from 'lucide-react';

export const ShopItemsTab: React.FC = () => {
  const [items, setItems] = useState<MinigameItem[]>(() => StorageService.getMinigameItems());
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MinigameItem | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ItemCategory>('gift');
  const [rarity, setRarity] = useState<ItemRarity>('rare');
  const [buyPrice, setBuyPrice] = useState(50);
  const [sellPrice, setSellPrice] = useState(25);
  const [affinityGain, setAffinityGain] = useState(20);
  const [icon, setIcon] = useState('🍵');

  const handleOpenAdd = () => {
    setEditingItem(null);
    setName('');
    setDescription('');
    setCategory('gift');
    setRarity('rare');
    setBuyPrice(50);
    setSellPrice(25);
    setAffinityGain(20);
    setIcon('✨');
    setModalOpen(true);
  };

  const handleOpenEdit = (item: MinigameItem) => {
    setEditingItem(item);
    setName(item.name);
    setDescription(item.description);
    setCategory(item.category);
    setRarity(item.rarity);
    setBuyPrice(item.buyPrice);
    setSellPrice(item.sellPrice);
    setAffinityGain(item.affinityGain || 10);
    setIcon(item.icon);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Vui lòng nhập tên vật phẩm.');
      return;
    }

    const item: MinigameItem = {
      id: editingItem ? editingItem.id : `item_${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      category,
      rarity,
      buyPrice: Number(buyPrice),
      sellPrice: Number(sellPrice),
      affinityGain: Number(affinityGain),
      icon: icon.trim() || '🎁',
      isShopAvailable: true
    };

    StorageService.saveMinigameItem(item);
    setItems(StorageService.getMinigameItems());
    toast.success(editingItem ? 'Đã cập nhật vật phẩm cửa tiệm ✦' : 'Đã tạo vật phẩm mới ✦');
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Cậu có chắc muốn xoá vật phẩm này khỏi Cửa Tiệm Trăng không?')) {
      StorageService.deleteMinigameItem(id);
      setItems(StorageService.getMinigameItems());
      toast.success('Đã xoá vật phẩm.');
    }
  };

  const filtered = items.filter(i => {
    const q = search.toLowerCase();
    const iName = (i.name || '').toLowerCase();
    const iDesc = (i.description || '').toLowerCase();
    const iCat = (i.category || '').toLowerCase();
    return iName.includes(q) || iDesc.includes(q) || iCat.includes(q);
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <GlassCard className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Vật Phẩm Cửa Tiệm & Quà Tặng ({items.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Quản lý vật phẩm trong Cửa Tiệm Trăng, giá bán, độ hiếm và điểm thân thiết khi tặng nhân vật.
              </p>
            </div>
          </div>

          <Button
            variant="gold"
            size="md"
            onClick={handleOpenAdd}
            icon={<Plus className="w-4 h-4" />}
          >
            ✦ Tạo Vật Phẩm Mới
          </Button>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 max-w-sm">
          <Input
            placeholder="Tìm kiếm vật phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
      </GlassCard>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <GlassCard key={item.id} className="p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl p-2 rounded-2xl bg-slate-100 dark:bg-slate-800/80">
                  {item.icon}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  item.rarity === 'legendary' ? 'bg-amber-400 text-slate-950' :
                  item.rarity === 'epic' ? 'bg-purple-600 text-white' :
                  item.rarity === 'rare' ? 'bg-indigo-600 text-white' :
                  'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  {item.rarity}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                  {item.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-850 text-xs font-semibold">
                <div className="text-amber-500 flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5" />
                  <span>{item.buyPrice} Bụi Sao</span>
                </div>
                <div className="text-rose-500 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5" />
                  <span>+{item.affinityGain || 0} Thân Thiết</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                size="xs"
                variant="secondary"
                onClick={() => handleOpenEdit(item)}
                icon={<Edit3 className="w-3 h-3" />}
              >
                Sửa
              </Button>
              <Button
                size="xs"
                variant="danger"
                onClick={() => handleDelete(item.id)}
                icon={<Trash2 className="w-3 h-3" />}
              >
                Xoá
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="lg"
        title={editingItem ? '✦ Chỉnh Sửa Vật Phẩm' : '✦ Tạo Vật Phẩm Mới'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Tên vật phẩm *"
                placeholder="Ví dụ: Trà Hoa Đậu Biếc"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                label="Biểu tượng Emoji *"
                placeholder="🍵 hoặc ✨"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Phân loại
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full px-3.5 py-2 text-sm bg-white/70 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
              >
                <option value="gift">Quà Tặng Nhân Vật (Gift)</option>
                <option value="seed">Hạt Giống Vườn Sao (Seed)</option>
                <option value="material">Nguyên Liệu Nấu/Chế Tạo (Material)</option>
                <option value="dish">Món Ăn Hoàn Chỉnh (Dish)</option>
                <option value="consumable">Tiêu Hao / Hồi Năng Lượng (Consumable)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Độ hiếm
              </label>
              <select
                value={rarity}
                onChange={(e) => setRarity(e.target.value as ItemRarity)}
                className="w-full px-3.5 py-2 text-sm bg-white/70 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
              >
                <option value="common">Thường (Common)</option>
                <option value="uncommon">Khá (Uncommon)</option>
                <option value="rare">Hiếm (Rare)</option>
                <option value="epic">Cực Phẩm (Epic)</option>
                <option value="legendary">Huyền Thoại (Legendary)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              type="number"
              label="Giá Mua (Bụi Sao)"
              value={buyPrice}
              onChange={(e) => setBuyPrice(Number(e.target.value))}
              required
            />
            <Input
              type="number"
              label="Giá Bán Lại"
              value={sellPrice}
              onChange={(e) => setSellPrice(Number(e.target.value))}
              required
            />
            <Input
              type="number"
              label="Điểm Thân Thiết Nhận Được"
              value={affinityGain}
              onChange={(e) => setAffinityGain(Number(e.target.value))}
              required
            />
          </div>

          <Textarea
            label="Mô tả tác dụng & câu chuyện vật phẩm"
            placeholder="Tách trà thơm ngát mang hương vị của màn đêm thanh tịnh..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Huỷ
            </Button>
            <Button type="submit" variant="gold" icon={<Save className="w-4 h-4" />}>
              Lưu Vật Phẩm
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
