import React, { useState, useEffect } from 'react';
import { StickerItem, StickerCategory } from '../../types';
import { StorageService } from '../../services/storageService';
import { Modal } from './Modal';
import { Search, Sparkles, X, Smile, Clock } from 'lucide-react';

interface StickerPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSticker: (sticker: StickerItem) => void;
}

export const StickerPicker: React.FC<StickerPickerProps> = ({
  isOpen,
  onClose,
  onSelectSticker
}) => {
  const [categories, setCategories] = useState<StickerCategory[]>([]);
  const [stickers, setStickers] = useState<StickerItem[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      const cats = StorageService.getStickerCategories().sort((a, b) => a.sortOrder - b.sortOrder);
      const stks = StorageService.getStickers().filter(s => s.enabled);
      setCategories(cats);
      setStickers(stks);
      setSearchTerm('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredStickers = stickers.filter(sticker => {
    const matchesCategory = activeCategoryId === 'all' || sticker.categoryId === activeCategoryId;
    const matchesSearch = searchTerm.trim() === '' ||
      sticker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sticker.description && sticker.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleSelect = (sticker: StickerItem) => {
    onSelectSticker(sticker);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="✦ KHO STICKER & GIF CẢM XÚC"
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm sticker, biểu cảm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar text-xs">
          <button
            onClick={() => setActiveCategoryId('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition-all cursor-pointer ${
              activeCategoryId === 'all'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Tất cả ({stickers.length})
          </button>

          {categories.map((cat) => {
            const count = stickers.filter(s => s.categoryId === cat.id).length;
            const isActive = activeCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{cat.icon || '✨'}</span>
                <span>{cat.name}</span>
                <span className="opacity-60 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Sticker Grid */}
        <div className="max-h-80 overflow-y-auto pr-1">
          {filteredStickers.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Smile className="w-8 h-8 mx-auto opacity-40" />
              <p className="text-xs">Không tìm thấy sticker nào phù hợp</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {filteredStickers.map((sticker) => (
                <button
                  key={sticker.id}
                  type="button"
                  onClick={() => handleSelect(sticker)}
                  className="group relative flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-400/80 hover:bg-amber-50/30 dark:hover:bg-amber-950/30 transition-all duration-200 hover:scale-105 cursor-pointer text-left"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center overflow-hidden">
                    <img
                      src={sticker.assetUrl}
                      alt={sticker.name}
                      loading="lazy"
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-200"
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate max-w-full text-center mt-1.5 px-1">
                    {sticker.name}
                  </span>
                  {sticker.type === 'gif' && (
                    <span className="absolute top-1.5 right-1.5 px-1.5 py-0.2 rounded-md bg-amber-400/20 text-amber-600 dark:text-amber-300 text-[9px] font-bold">
                      GIF
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
