import React, { useState } from 'react';
import { CelestialQuote } from '../../../types';
import { StorageService } from '../../../services/storageService';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { Input, Textarea } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { toast } from '../../../stores/useToastStore';
import { 
  Quote as QuoteIcon, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  Search, 
  Heart,
  User
} from 'lucide-react';

export const QuotesTab: React.FC = () => {
  const [quotes, setQuotes] = useState<CelestialQuote[]>(() => StorageService.getQuotes());
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<CelestialQuote | null>(null);

  // Form states
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');

  const handleOpenAdd = () => {
    setEditingQuote(null);
    setContent('');
    setAuthor('Hiên Nhà Ngắm Sao');
    setCategory('Chữa Lành');
    setModalOpen(true);
  };

  const handleOpenEdit = (q: CelestialQuote) => {
    setEditingQuote(q);
    setContent(q.content);
    setAuthor(q.author || 'Hiên Nhà Ngắm Sao');
    setCategory(q.category || 'Chữa Lành');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Vui lòng nhập nội dung câu nói.');
      return;
    }

    const item: CelestialQuote = {
      id: editingQuote ? editingQuote.id : `quote_${Date.now()}`,
      content: content.trim(),
      author: author.trim() || 'Hiên Nhà Ngắm Sao',
      category: category.trim() || 'Chữa Lành',
      likes: editingQuote?.likes || 0
    };

    StorageService.saveQuote(item);
    setQuotes(StorageService.getQuotes());
    toast.success(editingQuote ? 'Đã cập nhật câu nói ánh sao ✦' : 'Đã thêm câu nói mới ✦');
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Cậu có chắc muốn xoá câu nói này không?')) {
      StorageService.deleteQuote(id);
      setQuotes(StorageService.getQuotes());
      toast.success('Đã xoá câu nói thành công.');
    }
  };

  const filtered = quotes.filter(q => {
    const qContent = (q.content || '').toLowerCase();
    const qAuthor = (q.author || '').toLowerCase();
    const qCategory = (q.category || '').toLowerCase();
    const s = search.toLowerCase();
    return qContent.includes(s) || qAuthor.includes(s) || qCategory.includes(s);
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <GlassCard className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shrink-0">
              <QuoteIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Câu Nói Ánh Sao & Danh Ngôn ({quotes.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Những lời thì thầm chữa lành xuất hiện tại Trang Chủ và Không Gian Khác.
              </p>
            </div>
          </div>

          <Button
            variant="gold"
            size="md"
            onClick={handleOpenAdd}
            icon={<Plus className="w-4 h-4" />}
          >
            ✦ Thêm Câu Nói Mới
          </Button>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 max-w-sm">
          <Input
            placeholder="Tìm kiếm danh ngôn, tác giả..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
      </GlassCard>

      {/* Quotes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((quote) => (
          <GlassCard key={quote.id} className="p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                  {quote.category || 'Chữa Lành'}
                </span>
                <span className="text-xs text-rose-500 font-semibold flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-rose-500" /> {quote.likes || 0}
                </span>
              </div>
              <p className="text-sm text-slate-800 dark:text-slate-100 italic leading-relaxed">
                "{quote.content}"
              </p>
              <p className="text-xs text-amber-500 font-semibold">
                — {quote.author || 'Hiên Nhà Ngắm Sao'}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                size="xs"
                variant="secondary"
                onClick={() => handleOpenEdit(quote)}
                icon={<Edit3 className="w-3 h-3" />}
              >
                Sửa
              </Button>
              <Button
                size="xs"
                variant="danger"
                onClick={() => handleDelete(quote.id)}
                icon={<Trash2 className="w-3 h-3" />}
              >
                Xoá
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Modal Add/Edit */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="md"
        title={editingQuote ? '✦ Chỉnh Sửa Câu Nói' : '✦ Thêm Câu Nói Mới'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Textarea
            label="Nội dung câu nói *"
            placeholder="Đêm càng tối, những vì sao lại càng rực rỡ..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Tác giả / Nguồn"
              placeholder="Hiên Nhà Ngắm Sao"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              icon={<User className="w-4 h-4" />}
            />
            <Input
              label="Thể loại / Tâm trạng"
              placeholder="Chữa Lành, Hy Vọng, Tri Kỷ"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Huỷ
            </Button>
            <Button type="submit" variant="gold" icon={<Save className="w-4 h-4" />}>
              Lưu Câu Nói
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
