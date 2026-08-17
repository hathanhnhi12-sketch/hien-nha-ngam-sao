import React, { useState } from 'react';
import { TarotCard } from '../../../types';
import { StorageService } from '../../../services/storageService';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { Input, Textarea } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { Badge } from '../../../components/ui/Badge';
import { toast } from '../../../stores/useToastStore';
import { 
  Sparkles, 
  Search, 
  Edit3, 
  Save, 
  RotateCcw,
  BookOpen
} from 'lucide-react';

export const TarotTab: React.FC = () => {
  const [tarotDeck, setTarotDeck] = useState<TarotCard[]>(() => StorageService.getTarotDeck());
  const [search, setSearch] = useState('');
  const [selectedArcana, setSelectedArcana] = useState<'all' | 'major' | 'minor'>('all');
  const [editingCard, setEditingCard] = useState<TarotCard | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [meaningUpright, setMeaningUpright] = useState('');
  const [meaningReversed, setMeaningReversed] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleOpenEdit = (card: TarotCard) => {
    setEditingCard(card);
    setName(card.name || '');
    setNameEn(card.nameEn || '');
    setMeaningUpright(card.upright || card.meaningUpright || '');
    setMeaningReversed(card.reversed || card.meaningReversed || '');
    setDescription(card.advice || card.description || '');
    setImageUrl(card.image || card.imageUrl || '');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard) return;

    const updated: TarotCard = {
      ...editingCard,
      name: name.trim(),
      nameEn: nameEn.trim() || undefined,
      upright: meaningUpright.trim(),
      meaningUpright: meaningUpright.trim(),
      reversed: meaningReversed.trim(),
      meaningReversed: meaningReversed.trim(),
      advice: description.trim() || editingCard.advice || '',
      description: description.trim() || undefined,
      image: imageUrl.trim(),
      imageUrl: imageUrl.trim()
    };

    StorageService.saveTarotCard(updated);
    setTarotDeck(StorageService.getTarotDeck());
    toast.success(`Đã cập nhật lá bài ${updated.name} ✦`);
    setModalOpen(false);
  };

  const handleResetDeck = () => {
    if (window.confirm('Cậu có chắc chắn muốn khôi phục toàn bộ 78 lá Tarot về thiết lập chuẩn ban đầu không?')) {
      StorageService.resetTarotDeck();
      setTarotDeck(StorageService.getTarotDeck());
      toast.success('Đã khôi phục toàn bộ 78 lá bài Tarot về nguyên bản.');
    }
  };

  const filtered = tarotDeck.filter(c => {
    const q = search.toLowerCase();
    const cardName = (c.name || '').toLowerCase();
    const cardNameEn = (c.nameEn || '').toLowerCase();
    const cardUpright = (c.upright || c.meaningUpright || '').toLowerCase();
    const cardReversed = (c.reversed || c.meaningReversed || '').toLowerCase();
    const cardKeywords = (c.keywords || []).map(k => (k || '').toLowerCase());
    
    const matchesSearch = cardName.includes(q) ||
      cardNameEn.includes(q) ||
      cardUpright.includes(q) ||
      cardReversed.includes(q) ||
      cardKeywords.some(k => k.includes(q));

    const cardArcana = c.arcana || c.arcanaType || 'major';
    const matchesArcana = selectedArcana === 'all' || cardArcana === selectedArcana;
    return matchesSearch && matchesArcana;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <GlassCard className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Bộ Bài Tarot 78 Lá ({tarotDeck.length} Lá)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Chỉnh sửa lời giải quẻ, ý nghĩa xuôi, ý nghĩa ngược và hình ảnh cho từng lá bài.
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleResetDeck}
            icon={<RotateCcw className="w-4 h-4" />}
          >
            Khôi Phục 78 Lá Chuẩn
          </Button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Tìm theo tên lá bài, từ khóa ý nghĩa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
            <button
              onClick={() => setSelectedArcana('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedArcana === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Tất cả (78)
            </button>
            <button
              onClick={() => setSelectedArcana('major')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedArcana === 'major'
                  ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Ẩn Chính / Major (22)
            </button>
            <button
              onClick={() => setSelectedArcana('minor')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedArcana === 'minor'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Ẩn Phụ / Minor (56)
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Tarot Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((card) => (
          <GlassCard key={card.id} className="p-3.5 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="relative rounded-xl overflow-hidden aspect-[2/3] bg-slate-900 shadow-md">
                <img
                  src={card.image || card.imageUrl}
                  alt={card.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-950/80 text-amber-300 backdrop-blur-md">
                    {(card.arcana || card.arcanaType) === 'major' ? `Major #${card.number ?? '✦'}` : `Minor ${card.suit || ''}`}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                  {card.name}
                </h3>
                <p className="text-[11px] text-slate-400 truncate">
                  {card.nameEn || card.name}
                </p>
              </div>

              <div className="space-y-1 text-[11px] bg-slate-50 dark:bg-slate-850 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-emerald-600 dark:text-emerald-400 font-medium line-clamp-1">
                  ▲ Xuôi: {card.upright || card.meaningUpright}
                </p>
                <p className="text-amber-600 dark:text-amber-400 font-medium line-clamp-1">
                  ▼ Ngược: {card.reversed || card.meaningReversed}
                </p>
              </div>
            </div>

            <Button
              size="xs"
              variant="secondary"
              onClick={() => handleOpenEdit(card)}
              icon={<Edit3 className="w-3 h-3" />}
              className="w-full justify-center"
            >
              Chỉnh Sửa Lá Bài
            </Button>
          </GlassCard>
        ))}
      </div>

      {/* Edit Modal */}
      {editingCard && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          maxWidth="lg"
          title={`✦ Chỉnh Sửa Lá Bài: ${editingCard.name}`}
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Tên lá bài tiếng Việt *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Tên lá bài tiếng Anh"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
              />
            </div>

            <Input
              label="URL Hình ảnh lá bài"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              required
            />

            <Input
              label="Ý nghĩa khi bốc XUÔI (Upright Meaning) *"
              value={meaningUpright}
              onChange={(e) => setMeaningUpright(e.target.value)}
              required
            />

            <Input
              label="Ý nghĩa khi bốc NGƯỢC (Reversed Meaning) *"
              value={meaningReversed}
              onChange={(e) => setMeaningReversed(e.target.value)}
              required
            />

            <Textarea
              label="Mô tả chi tiết / Lời khuyên của vì sao"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
                Huỷ
              </Button>
              <Button type="submit" variant="gold" icon={<Save className="w-4 h-4" />}>
                Lưu Thay Đổi
              </Button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
