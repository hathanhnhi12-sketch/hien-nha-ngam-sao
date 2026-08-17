import React, { useState } from 'react';
import { StickerItem, StickerCategory } from '../../../types';
import { StorageService } from '../../../services/storageService';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { MediaUploader } from '../../../components/ui/MediaUploader';
import { Modal } from '../../../components/ui/Modal';
import { StickerPicker } from '../../../components/ui/StickerPicker';
import { toast } from '../../../stores/useToastStore';
import { 
  Smile, 
  Plus, 
  Trash2, 
  Edit2, 
  FolderPlus, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Search, 
  Eye,
  Layers
} from 'lucide-react';

export const StickersTab: React.FC = () => {
  const [categories, setCategories] = useState<StickerCategory[]>(() => StorageService.getStickerCategories());
  const [stickers, setStickers] = useState<StickerItem[]>(() => StorageService.getStickers());
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isStickerModalOpen, setIsStickerModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isTestPickerOpen, setIsTestPickerOpen] = useState(false);
  const [editingSticker, setEditingSticker] = useState<StickerItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<StickerCategory | null>(null);

  // Sticker Form State
  const [stkName, setStkName] = useState('');
  const [stkUrl, setStkUrl] = useState('');
  const [stkCategoryId, setStkCategoryId] = useState('');
  const [stkType, setStkType] = useState<'image' | 'gif'>('gif');
  const [stkDesc, setStkDesc] = useState('');
  const [stkEnabled, setStkEnabled] = useState(true);

  // Category Form State
  const [catName, setCatName] = useState('');
  const [catIcon, setCatIcon] = useState('✨');
  const [catOrder, setCatOrder] = useState(1);

  const reloadData = () => {
    setCategories(StorageService.getStickerCategories());
    setStickers(StorageService.getStickers());
  };

  // Sticker Handlers
  const handleOpenAddSticker = () => {
    setEditingSticker(null);
    setStkName('');
    setStkUrl('');
    setStkCategoryId(categories[0]?.id || 'cat_cute');
    setStkType('gif');
    setStkDesc('');
    setStkEnabled(true);
    setIsStickerModalOpen(true);
  };

  const handleOpenEditSticker = (s: StickerItem) => {
    setEditingSticker(s);
    setStkName(s.name);
    setStkUrl(s.assetUrl);
    setStkCategoryId(s.categoryId);
    setStkType(s.type);
    setStkDesc(s.description || '');
    setStkEnabled(s.enabled);
    setIsStickerModalOpen(true);
  };

  const handleSaveSticker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stkName.trim() || !stkUrl.trim() || !stkCategoryId) {
      toast.error('Vui lòng điền đủ tên, danh mục và chọn tệp ảnh/GIF sticker.');
      return;
    }

    if (editingSticker) {
      StorageService.updateSticker(editingSticker.id, {
        name: stkName.trim(),
        assetUrl: stkUrl.trim(),
        categoryId: stkCategoryId,
        type: stkType,
        description: stkDesc.trim(),
        enabled: stkEnabled
      });
      toast.success(`✦ Đã cập nhật sticker "${stkName}"!`);
    } else {
      StorageService.addSticker({
        name: stkName.trim(),
        assetUrl: stkUrl.trim(),
        categoryId: stkCategoryId,
        type: stkType,
        description: stkDesc.trim(),
        enabled: stkEnabled
      });
      toast.success(`✦ Đã thêm sticker "${stkName}" vào kho!`);
    }

    reloadData();
    setIsStickerModalOpen(false);
  };

  const handleDeleteSticker = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xoá sticker "${name}"?`)) {
      StorageService.deleteSticker(id);
      reloadData();
      toast.success('Đã xoá sticker.');
    }
  };

  const handleToggleSticker = (s: StickerItem) => {
    StorageService.updateSticker(s.id, { enabled: !s.enabled });
    reloadData();
    toast.success(s.enabled ? 'Đã tạm ẩn sticker.' : 'Đã bật hiển thị sticker!');
  };

  // Category Handlers
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCatName('');
    setCatIcon('✨');
    setCatOrder(categories.length + 1);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) {
      toast.error('Vui lòng nhập tên danh mục.');
      return;
    }

    if (editingCategory) {
      StorageService.updateStickerCategory(editingCategory.id, {
        name: catName.trim(),
        icon: catIcon.trim(),
        sortOrder: Number(catOrder)
      });
      toast.success('✦ Đã cập nhật danh mục sticker!');
    } else {
      StorageService.addStickerCategory({
        name: catName.trim(),
        icon: catIcon.trim(),
        sortOrder: Number(catOrder)
      });
      toast.success('✦ Đã thêm danh mục sticker mới!');
    }

    reloadData();
    setIsCategoryModalOpen(false);
  };

  const handleDeleteCategory = (cat: StickerCategory) => {
    const count = stickers.filter(s => s.categoryId === cat.id).length;
    if (window.confirm(`Xoá danh mục "${cat.name}"? ${count > 0 ? `Lưu ý: ${count} sticker thuộc danh mục này cũng sẽ bị xoá!` : ''}`)) {
      StorageService.deleteStickerCategory(cat.id);
      reloadData();
      toast.success('Đã xoá danh mục.');
    }
  };

  const filteredStickers = stickers.filter(s => {
    const matchesCat = activeCategoryFilter === 'all' || s.categoryId === activeCategoryFilter;
    const matchesSearch = searchTerm === '' || s.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <GlassCard className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-pink-500/20 shrink-0">
              <Smile className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                Quản Lý Kho Sticker & GIF Biểu Cảm
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Thêm mới, phân loại danh mục và tuỳ chỉnh các nhãn dán, ảnh động cảm xúc dùng trong Bình Luận & Thư Yêu Thương.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              icon={<Eye className="w-4 h-4" />}
              onClick={() => setIsTestPickerOpen(true)}
            >
              Xem Thử Bộ Chọn
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<FolderPlus className="w-4 h-4" />}
              onClick={handleOpenAddCategory}
            >
              Thêm Danh Mục
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={handleOpenAddSticker}
            >
              Tải Sticker / GIF Mới
            </Button>
          </div>
        </div>

        {/* Categories & Filter Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              onClick={() => setActiveCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition-all cursor-pointer ${
                activeCategoryFilter === 'all'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Tất cả ({stickers.length})
            </button>

            {categories.map((cat) => {
              const count = stickers.filter(s => s.categoryId === cat.id).length;
              return (
                <div key={cat.id} className="inline-flex items-center">
                  <button
                    onClick={() => setActiveCategoryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
                      activeCategoryFilter === cat.id
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                    <span className="opacity-60 text-[10px]">({count})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat)}
                    className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer ml-0.5"
                    title={`Xoá danh mục ${cat.name}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm sticker theo tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>
        </div>
      </GlassCard>

      {/* Sticker Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredStickers.map((sticker) => {
          const cat = categories.find(c => c.id === sticker.categoryId);
          return (
            <GlassCard
              key={sticker.id}
              className={`p-3.5 flex flex-col items-center justify-between space-y-2.5 transition-all relative ${
                sticker.enabled ? 'hover:border-amber-400' : 'opacity-40 grayscale'
              }`}
            >
              {/* Badges */}
              <div className="w-full flex items-center justify-between">
                <span className="text-[10px] text-slate-400 truncate max-w-[80px]">
                  {cat?.icon} {cat?.name || 'Chung'}
                </span>
                {sticker.type === 'gif' && (
                  <span className="px-1.5 py-0.2 rounded-md bg-amber-400/20 text-amber-600 dark:text-amber-300 text-[9px] font-bold">
                    GIF
                  </span>
                )}
              </div>

              {/* Graphic */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center p-1 group">
                <img
                  src={sticker.assetUrl}
                  alt={sticker.name}
                  className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-200"
                />
              </div>

              {/* Info */}
              <div className="text-center w-full">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                  {sticker.name}
                </h4>
                {sticker.description && (
                  <p className="text-[10px] text-slate-400 truncate">{sticker.description}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-1 w-full pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => handleToggleSticker(sticker)}
                  className={`p-1 rounded-lg text-xs transition-colors cursor-pointer ${
                    sticker.enabled ? 'text-slate-400 hover:text-rose-500' : 'text-emerald-500'
                  }`}
                  title={sticker.enabled ? 'Tạm ẩn' : 'Bật hiển thị'}
                >
                  {sticker.enabled ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenEditSticker(sticker)}
                  className="p-1 rounded-lg text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer"
                  title="Chỉnh sửa"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteSticker(sticker.id, sticker.name)}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                  title="Xoá"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Add / Edit Sticker Modal */}
      <Modal
        isOpen={isStickerModalOpen}
        onClose={() => setIsStickerModalOpen(false)}
        title={editingSticker ? '✦ CHỈNH SỬA STICKER / GIF' : '✦ THÊM STICKER / GIF MỚI'}
        maxWidth="md"
      >
        <form onSubmit={handleSaveSticker} className="space-y-4">
          <Input
            label="Tên biểu cảm / Sticker"
            placeholder="Ví dụ: Ôm ấm áp, Thả tim lấp lánh, Chúc ngủ ngon..."
            value={stkName}
            onChange={(e) => setStkName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Danh mục phân loại
              </label>
              <select
                value={stkCategoryId}
                onChange={(e) => setStkCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white/80 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Định dạng tệp
              </label>
              <select
                value={stkType}
                onChange={(e) => setStkType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-white/80 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
              >
                <option value="gif">Ảnh Động (GIF)</option>
                <option value="image">Ảnh Tĩnh (PNG / WebP / JPG)</option>
              </select>
            </div>
          </div>

          <Input
            label="Mô tả cảm xúc (Tùy chọn)"
            placeholder="Dành cho lời chúc ấm áp..."
            value={stkDesc}
            onChange={(e) => setStkDesc(e.target.value)}
          />

          <MediaUploader
            label="Tệp hình ảnh Sticker / GIF hoặc URL"
            value={stkUrl}
            onChange={setStkUrl}
            acceptTypes={['gif', 'image']}
            maxSizeMB={8}
            placeholder="Dán link ảnh động GIF hoặc tải tệp lên..."
            helperText="Khuyến nghị nền trong suốt (transparent) để hiển thị đẹp trên cả giao diện sáng & tối."
          />

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="enableSticker"
              checked={stkEnabled}
              onChange={(e) => setStkEnabled(e.target.checked)}
              className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
            />
            <label htmlFor="enableSticker" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              Bật hiển thị cho người dùng lựa chọn
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsStickerModalOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!stkName.trim() || !stkUrl.trim()}
            >
              {editingSticker ? 'Lưu Thay Đổi' : 'Thêm Vào Kho Sticker'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="✦ THÊM DANH MỤC STICKER MỚI"
        maxWidth="sm"
      >
        <form onSubmit={handleSaveCategory} className="space-y-4">
          <Input
            label="Tên danh mục"
            placeholder="Ví dụ: Đêm Muộn, Ngọt Ngào, Cổ Vũ..."
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Biểu tượng Emoji"
              placeholder="💖"
              value={catIcon}
              onChange={(e) => setCatIcon(e.target.value)}
              required
            />

            <Input
              label="Thứ tự hiển thị"
              type="number"
              value={catOrder}
              onChange={(e) => setCatOrder(Number(e.target.value))}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsCategoryModalOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!catName.trim()}
            >
              Lưu Danh Mục
            </Button>
          </div>
        </form>
      </Modal>

      {/* Test Picker Modal */}
      <StickerPicker
        isOpen={isTestPickerOpen}
        onClose={() => setIsTestPickerOpen(false)}
        onSelectSticker={(s) => {
          toast.success(`Bạn đã thử chọn sticker: ${s.name}`);
        }}
      />

    </div>
  );
};
