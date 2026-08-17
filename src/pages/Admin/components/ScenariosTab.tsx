import React, { useState } from 'react';
import { ChatScenario } from '../../../types';
import { StorageService } from '../../../services/storageService';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { Input, Textarea } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { toast } from '../../../stores/useToastStore';
import { 
  MessageSquareQuote, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  Sparkles,
  Search
} from 'lucide-react';

export const ScenariosTab: React.FC = () => {
  const [scenarios, setScenarios] = useState<ChatScenario[]>(() => StorageService.getScenarios());
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingScenario, setEditingScenario] = useState<ChatScenario | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [category, setCategory] = useState('');

  const handleOpenAdd = () => {
    setEditingScenario(null);
    setTitle('');
    setText('');
    setCategory('Lắng Nghe & Tâm Tình');
    setModalOpen(true);
  };

  const handleOpenEdit = (sc: ChatScenario) => {
    setEditingScenario(sc);
    setTitle(sc.title);
    setText(sc.text);
    setCategory(sc.category || 'Tâm Tình');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !text.trim()) {
      toast.error('Vui lòng điền đầy đủ tiêu đề và nội dung tình huống.');
      return;
    }

    const item: ChatScenario = {
      id: editingScenario ? editingScenario.id : `sc_${Date.now()}`,
      title: title.trim(),
      text: text.trim(),
      category: category.trim() || 'Nhập Vai'
    };

    StorageService.saveScenario(item);
    setScenarios(StorageService.getScenarios());
    toast.success(editingScenario ? 'Đã cập nhật tình huống thành công ✦' : 'Đã tạo tình huống mới ✦');
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Cậu có chắc muốn xoá tình huống này không?')) {
      StorageService.deleteScenario(id);
      setScenarios(StorageService.getScenarios());
      toast.success('Đã xoá tình huống thành công.');
    }
  };

  const filtered = scenarios.filter(s => {
    const sTitle = (s.title || '').toLowerCase();
    const sText = (s.text || '').toLowerCase();
    const sCategory = (s.category || '').toLowerCase();
    const q = search.toLowerCase();
    return sTitle.includes(q) || sText.includes(q) || sCategory.includes(q);
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <GlassCard className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <MessageSquareQuote className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Gợi Ý Tình Huống Nhập Vai ({scenarios.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Quản lý các kịch bản, lời gợi ý mở đầu hội thoại cho lữ khách tại trang Nhân Vật.
              </p>
            </div>
          </div>

          <Button
            variant="gold"
            size="md"
            onClick={handleOpenAdd}
            icon={<Plus className="w-4 h-4" />}
          >
            ✦ Thêm Tình Huống
          </Button>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 max-w-sm">
          <Input
            placeholder="Tìm kiếm tình huống..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
      </GlassCard>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((sc) => (
          <GlassCard key={sc.id} className="p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  {sc.category || 'Tâm Tình'}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {sc.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4 bg-slate-50 dark:bg-slate-850 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                {sc.text}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                size="xs"
                variant="secondary"
                onClick={() => handleOpenEdit(sc)}
                icon={<Edit3 className="w-3 h-3" />}
              >
                Sửa
              </Button>
              <Button
                size="xs"
                variant="danger"
                onClick={() => handleDelete(sc.id)}
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
        maxWidth="lg"
        title={editingScenario ? '✦ Chỉnh Sửa Tình Huống' : '✦ Thêm Tình Huống Mới'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Tiêu đề tình huống *"
            placeholder="Ví dụ: Đêm Mưa Dưới Mái Hiên"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Input
            label="Phân loại / Thể loại"
            placeholder="Ví dụ: Chữa Lành, Kỳ Ảo, Thú Vị"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <Textarea
            label="Nội dung kịch bản tình huống *"
            placeholder="Mô tả bối cảnh, hành động mở đầu và câu nói gợi ý..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            required
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Huỷ
            </Button>
            <Button type="submit" variant="gold" icon={<Save className="w-4 h-4" />}>
              Lưu Tình Huống
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
