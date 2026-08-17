import React, { useState, useEffect } from 'react';
import { Character, CharacterCategory } from '../../../types';
import { StorageService } from '../../../services/storageService';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { Badge } from '../../../components/ui/Badge';
import { toast } from '../../../stores/useToastStore';
import { 
  Tag, 
  Plus, 
  Edit2, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  Users, 
  Sparkles, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Search,
  CheckCircle2,
  ListOrdered
} from 'lucide-react';

interface CharacterCategoriesTabProps {
  characters: Character[];
  onCharactersUpdated?: () => void;
}

export const CharacterCategoriesTab: React.FC<CharacterCategoriesTabProps> = ({
  characters,
  onCharactersUpdated
}) => {
  const [categories, setCategories] = useState<CharacterCategory[]>(() => 
    StorageService.getCharacterCategories()
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State for Add / Edit Category
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CharacterCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#F59E0B',
    enabled: true
  });

  // Modal State for Bulk Tag/Category Assignment to Characters
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [targetCategory, setTargetCategory] = useState<CharacterCategory | null>(null);
  const [selectedCharIds, setSelectedCharIds] = useState<string[]>([]);

  // Refresh
  const reloadCategories = () => {
    setCategories(StorageService.getCharacterCategories());
  };

  useEffect(() => {
    reloadCategories();
  }, []);

  // Character count helper
  const getCharCountForCategory = (catName: string) => {
    const target = catName.toLowerCase().replace(/^#/, '').trim();
    return characters.filter(c => 
      c.tags?.some(t => {
        const norm = t.toLowerCase().replace(/^#/, '').trim();
        return norm === target || norm.includes(target) || target.includes(norm);
      })
    ).length;
  };

  // Open Create
  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      color: '#F59E0B',
      enabled: true
    });
    setModalOpen(true);
  };

  // Open Edit
  const handleOpenEdit = (cat: CharacterCategory) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      color: cat.color || '#F59E0B',
      enabled: cat.enabled !== false
    });
    setModalOpen(true);
  };

  // Save Category
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Tên danh mục không được để trống!');
      return;
    }

    const cleanName = formData.name.replace(/^#/, '').trim();

    if (editingCategory) {
      // Update
      const updatedCat: CharacterCategory = {
        ...editingCategory,
        name: cleanName,
        description: formData.description.trim(),
        color: formData.color,
        enabled: formData.enabled,
        updatedAt: Date.now()
      };
      StorageService.saveCharacterCategory(updatedCat);
      toast.success(`Đã cập nhật danh mục #${cleanName}`);
    } else {
      // Create new
      const newCat: CharacterCategory = {
        id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        name: cleanName,
        description: formData.description.trim(),
        color: formData.color,
        sortOrder: categories.length + 1,
        enabled: formData.enabled,
        createdAt: Date.now()
      };
      StorageService.saveCharacterCategory(newCat);
      toast.success(`Đã tạo danh mục mới #${cleanName}`);
    }

    setModalOpen(false);
    reloadCategories();
  };

  // Delete Category
  const handleDeleteCategory = (cat: CharacterCategory) => {
    const count = getCharCountForCategory(cat.name);
    const msg = count > 0 
      ? `Danh mục #${cat.name} hiện đang gắn với ${count} nhân vật. Bạn có chắc chắn muốn xoá danh mục này khỏi danh sách?` 
      : `Bạn có chắc chắn muốn xoá danh mục #${cat.name}?`;

    if (window.confirm(msg)) {
      StorageService.deleteCharacterCategory(cat.id);
      toast.success(`Đã xoá danh mục #${cat.name}`);
      reloadCategories();
    }
  };

  // Toggle Category Enabled
  const handleToggleEnabled = (cat: CharacterCategory) => {
    const updated = { ...cat, enabled: !cat.enabled };
    StorageService.saveCharacterCategory(updated);
    reloadCategories();
    toast.info(`Danh mục #${cat.name} đã ${updated.enabled ? 'bật hiển thị' : 'tạm ẩn'}`);
  };

  // Move Sort Order
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= categories.length) return;

    const list = [...categories];
    const temp = list[index];
    list[index] = list[newIndex];
    list[newIndex] = temp;

    StorageService.reorderCharacterCategories(list);
    reloadCategories();
  };

  // Reset to default categories
  const handleResetDefaults = () => {
    if (window.confirm('Khôi phục danh sách danh mục nhân vật về mặc định ban đầu?')) {
      StorageService.resetCharacterCategories();
      reloadCategories();
      toast.success('Đã khôi phục danh mục mặc định thành công');
    }
  };

  // Open Quick Character Assignment Modal
  const handleOpenAssignModal = (cat: CharacterCategory) => {
    setTargetCategory(cat);
    const catName = cat.name.toLowerCase().replace(/^#/, '').trim();
    const assigned = characters
      .filter(c => c.tags?.some(t => {
        const norm = t.toLowerCase().replace(/^#/, '').trim();
        return norm === catName || norm.includes(catName);
      }))
      .map(c => c.id);

    setSelectedCharIds(assigned);
    setAssignModalOpen(true);
  };

  // Save Character Assignment
  const handleSaveAssignments = () => {
    if (!targetCategory) return;
    const catTagName = targetCategory.name.replace(/^#/, '').trim();

    // Iterate through all characters
    characters.forEach(char => {
      const isSelected = selectedCharIds.includes(char.id);
      const currentTags = Array.isArray(char.tags) ? [...char.tags] : [];
      const hasTag = currentTags.some(t => t.toLowerCase() === catTagName.toLowerCase());

      if (isSelected && !hasTag) {
        // Add tag
        const updatedChar: Character = {
          ...char,
          tags: [...currentTags, catTagName],
          updatedAt: Date.now()
        };
        StorageService.saveCharacter(updatedChar);
      } else if (!isSelected && hasTag) {
        // Remove tag
        const updatedChar: Character = {
          ...char,
          tags: currentTags.filter(t => t.toLowerCase() !== catTagName.toLowerCase()),
          updatedAt: Date.now()
        };
        StorageService.saveCharacter(updatedChar);
      }
    });

    toast.success(`Đã cập nhật danh mục #${catTagName} cho các nhân vật!`);
    setAssignModalOpen(false);
    if (onCharactersUpdated) onCharactersUpdated();
    reloadCategories();
  };

  // Filter categories by search
  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-amber-400/20 text-amber-500 dark:text-amber-300">
                <Tag className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Quản Lý Danh Mục & Tag Nhân Vật
              </h2>
              <Badge variant="gold">DYNAMIC CMS</Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Tạo, chỉnh sửa, sắp xếp thứ tự và phân loại nhân vật theo từng chủ đề hoặc tag (#PhiêuLưu, #HuyềnBí, #ChữaLành...).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleResetDefaults}
              icon={<RotateCcw className="w-4 h-4" />}
            >
              Mặc Định
            </Button>
            <Button
              variant="gold"
              size="sm"
              onClick={handleOpenCreate}
              icon={<Plus className="w-4 h-4" />}
            >
              Thêm Danh Mục Mới
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800">
          <Input
            placeholder="Tìm kiếm danh mục theo tên hoặc mô tả..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
      </GlassCard>

      {/* Categories Table / Cards List */}
      <div className="grid grid-cols-1 gap-3">
        {filteredCategories.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-500">
            Không tìm thấy danh mục nào phù hợp với từ khóa tìm kiếm.
          </div>
        ) : (
          filteredCategories.map((cat, index) => {
            const count = getCharCountForCategory(cat.name);
            return (
              <GlassCard 
                key={cat.id} 
                className={`p-4 transition-all duration-200 ${
                  !cat.enabled ? 'opacity-60 bg-slate-50/50 dark:bg-slate-900/30' : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Left: Reorder & Info */}
                  <div className="flex items-center gap-3">
                    {/* Sort reorder arrows */}
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0}
                        title="Di chuyển lên trên"
                        className="p-1 text-slate-400 hover:text-amber-500 disabled:opacity-20 disabled:hover:text-slate-400 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === categories.length - 1}
                        title="Di chuyển xuống dưới"
                        className="p-1 text-slate-400 hover:text-amber-500 disabled:opacity-20 disabled:hover:text-slate-400 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Badge Pill */}
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span 
                          className="px-3 py-1 rounded-xl font-bold text-sm text-slate-950 flex items-center gap-1.5 shadow-sm"
                          style={{ backgroundColor: cat.color || '#F59E0B' }}
                        >
                          <Tag className="w-3.5 h-3.5 text-slate-950/70" />
                          #{cat.name}
                        </span>
                        
                        {/* Status Badge */}
                        {cat.enabled ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium">
                            Hiển thị
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-500 font-medium">
                            Đang ẩn
                          </span>
                        )}

                        {/* Character count */}
                        <button
                          onClick={() => handleOpenAssignModal(cat)}
                          title="Nhấp để gán nhanh danh mục này cho các nhân vật"
                          className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1 hover:bg-indigo-100 transition-colors cursor-pointer"
                        >
                          <Users className="w-3 h-3" />
                          <span>{count} nhân vật</span>
                        </button>
                      </div>

                      {/* Description */}
                      {cat.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                          {cat.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {/* Quick Character Assign */}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleOpenAssignModal(cat)}
                      icon={<Users className="w-3.5 h-3.5" />}
                    >
                      Gán Nhân Vật
                    </Button>

                    {/* Toggle Visibility */}
                    <button
                      onClick={() => handleToggleEnabled(cat)}
                      title={cat.enabled ? 'Ẩn danh mục khỏi thanh lọc' : 'Bật hiển thị danh mục'}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      {cat.enabled ? <Eye className="w-4 h-4 text-emerald-500" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                    </button>

                    {/* Edit */}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleOpenEdit(cat)}
                      icon={<Edit2 className="w-3.5 h-3.5" />}
                    >
                      Sửa
                    </Button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteCategory(cat)}
                      title="Xoá danh mục"
                      className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </GlassCard>
            );
          })
        )}
      </div>

      {/* MODAL: ADD / EDIT CATEGORY */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? `✦ Chỉnh Sửa Danh Mục: #${editingCategory.name}` : '✦ Tạo Danh Mục Nhân Vật Mới'}
        maxWidth="md"
      >
        <form onSubmit={handleSaveCategory} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Tên danh mục / Tag (Không cần gõ dấu #) <span className="text-rose-500">*</span>
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="VD: Phiêu Lưu, Huyền Bí, Hài Hước..."
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Mô tả ngắn về thể loại
            </label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mô tả phong cách và tinh thần của các nhân vật trong danh mục..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Màu sắc nhận diện (Theme Color)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent p-0"
                />
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Trạng thái hiển thị
              </label>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="cat_enabled_chk"
                  checked={formData.enabled}
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
                <label htmlFor="cat_enabled_chk" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer font-medium">
                  Hiển thị trên thanh lọc công khai
                </label>
              </div>
            </div>
          </div>

          {/* Preview pill */}
          <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 block mb-1">Xem trước thẻ tag:</span>
            <span 
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold text-slate-950 shadow-sm"
              style={{ backgroundColor: formData.color || '#F59E0B' }}
            >
              <Tag className="w-3.5 h-3.5" />
              #{formData.name.trim() || 'TênDanhMục'}
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200/60 dark:border-slate-800">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="gold" type="submit">
              {editingCategory ? 'Lưu Thay Đổi' : 'Tạo Danh Mục'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: ASSIGN CATEGORY TO CHARACTERS */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title={targetCategory ? `✦ Gán Danh Mục: #${targetCategory.name} cho Nhân Vật` : 'Gán Danh Mục'}
        maxWidth="lg"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Chọn các nhân vật sẽ mang tag <span className="font-bold text-amber-500">#{targetCategory?.name}</span>. Khi người dùng lọc theo danh mục này trên trang công khai, các nhân vật đã chọn sẽ xuất hiện.
          </p>

          <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
            {characters.map((char) => {
              const isChecked = selectedCharIds.includes(char.id);
              return (
                <div
                  key={char.id}
                  onClick={() => {
                    if (isChecked) {
                      setSelectedCharIds(selectedCharIds.filter(id => id !== char.id));
                    } else {
                      setSelectedCharIds([...selectedCharIds, char.id]);
                    }
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-400/60 text-slate-900 dark:text-white'
                      : 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={char.avatarUrl} 
                      alt={char.name} 
                      className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700" 
                    />
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {char.name}
                        {char.series && (
                          <span className="text-[10px] text-slate-400">({char.series})</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {char.tags?.map((t, idx) => (
                          <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                    isChecked 
                      ? 'bg-amber-400 border-amber-500 text-slate-950' 
                      : 'border-slate-300 dark:border-slate-700'
                  }`}>
                    {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Đã chọn: <strong className="text-amber-500">{selectedCharIds.length}</strong> nhân vật
            </span>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => setAssignModalOpen(false)}>
                Đóng
              </Button>
              <Button variant="gold" size="sm" onClick={handleSaveAssignments}>
                Áp Dụng Cho {selectedCharIds.length} Nhân Vật
              </Button>
            </div>
          </div>
        </div>
      </Modal>

    </div>
  );
};
