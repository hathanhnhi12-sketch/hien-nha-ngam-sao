import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Character, MinigameItem, InventorySlot } from '../../types';
import { Gift, Sparkles, Heart } from 'lucide-react';

interface GiftCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
  inventory: InventorySlot[];
  items: MinigameItem[];
  onGift: (characterId: string, characterName: string, itemId: string, quantity: number) => void;
}

export const GiftCharacterModal: React.FC<GiftCharacterModalProps> = ({
  isOpen,
  onClose,
  character,
  inventory,
  items,
  onGift
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Available giftable items from inventory (flowers, tea, relic gems, gifts)
  const availableGifts = inventory
    .map(slot => {
      const item = items.find(i => i.id === slot.itemId);
      if (!item) return null;
      if (item.category === 'flower' || item.category === 'gift' || item.category === 'treasure' || item.category === 'dish') {
        return { item, quantity: slot.quantity };
      }
      return null;
    })
    .filter(Boolean) as { item: MinigameItem; quantity: number }[];

  const selectedItem = items.find(i => i.id === selectedItemId);
  const selectedSlot = inventory.find(s => s.itemId === selectedItemId);

  const handleSendGift = () => {
    if (!selectedItemId || !selectedItem) return;
    onGift(character.id, character.name, selectedItemId, quantity);
    onClose();
    setSelectedItemId('');
    setQuantity(1);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={`✦ TẶNG QUÀ CHO ${character.name.toUpperCase()}`}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/50 dark:border-indigo-500/30">
          <img
            src={character.avatarUrl}
            alt={character.name}
            className="w-12 h-12 rounded-xl object-cover ring-1 ring-amber-400"
          />
          <div className="text-xs">
            <h4 className="font-bold text-slate-800 dark:text-slate-100">{character.name}</h4>
            <p className="text-slate-500 dark:text-slate-400">
              Độ thân thiết hiện tại: <span className="font-bold text-amber-500">{character.affinity || 0} điểm</span>
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Chọn vật phẩm từ túi đồ
          </label>
          
          {availableGifts.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
              Trong túi đồ chưa có hoa, trà, món ăn hay quà tặng nào. Hãy ghé Khu Vườn hoặc Moon Shop nhé!
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5 max-h-48 overflow-y-auto custom-scrollbar p-1">
              {availableGifts.map(({ item, quantity: stock }) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedItemId(item.id);
                    setQuantity(1);
                  }}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                    selectedItemId === item.id
                      ? 'border-amber-400 bg-amber-50/40 dark:bg-amber-950/30 ring-1 ring-amber-400'
                      : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                  }`}
                >
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate text-slate-800 dark:text-slate-100">{item.name}</div>
                    <div className="text-[10px] text-slate-400">Số lượng: x{stock}</div>
                    <div className="text-[10px] text-amber-500 font-semibold">+{item.giftAffinityBonus || 20} thân thiết</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedItem && selectedSlot && (
          <div className="flex items-center justify-between pt-2 border-t border-indigo-100/40 dark:border-slate-800">
            <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              Số lượng tặng:
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold"
              >
                -
              </button>
              <span className="text-sm font-bold w-6 text-center">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(selectedSlot.quantity, quantity + 1))}
                className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold"
              >
                +
              </button>
            </div>
          </div>
        )}

        <div className="pt-3 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Đóng
          </Button>
          <Button
            variant="gold"
            disabled={!selectedItemId || availableGifts.length === 0}
            onClick={handleSendGift}
            icon={<Heart className="w-4 h-4" />}
          >
            Tặng Quà ✦
          </Button>
        </div>
      </div>
    </Modal>
  );
};
