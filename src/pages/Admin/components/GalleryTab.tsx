import React, { useState } from 'react';
import { GalleryItem } from '../../../types';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { Input, Textarea } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { toast } from '../../../stores/useToastStore';
import { 
  Image as ImageIcon, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  Search, 
  Heart,
  ExternalLink
} from 'lucide-react';

interface GalleryTabProps {
  galleryItems: GalleryItem[];
  onSaveGalleryItem: (item: GalleryItem) => void;
  onDeleteGalleryItem: (id: string) => void;
}

export const GalleryTab: React.FC<GalleryTabProps> = ({
  galleryItems,
  onSaveGalleryItem,
  onDeleteGalleryItem
}) => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [category, setCategory] = useState('Minh Hoạ');
  const [author, setAuthor] = useState('Hiên Nhà Ngắm Sao');
  const [caption, setCaption] = useState('');

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTitle('');
    setImageUrl('');
    setCharacterName('');
    setCategory('Minh Hoạ');
    setAuthor('Hiên Nhà Ngắm Sao');
    setCaption('');
    setModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setTitle(item.title || item.name || '');
    setImageUrl(item.imageUrl || item.src || '');
    setCharacterName(item.characterName || '');
    setCategory(item.category || 'Minh Hoạ');
    setAuthor(item.author || 'Hiên Nhà Ngắm Sao');
    setCaption(item.caption || item.description || '');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      toast.error('Vui lòng nhập đầy đủ tiêu đề và link hình ảnh.');
      return;
    }

    const item: GalleryItem = {
      id: editingItem ? editingItem.id : `gallery_${Date.now()}`,
      name: title.trim(),
      title: title.trim(),
      src: imageUrl.trim(),
      imageUrl: imageUrl.trim(),
      type: editingItem?.type || 'image',
      characterName: characterName.trim() || undefined,
      category: category.trim() || 'Minh Hoạ',
      author: author.trim() || 'Hiên Nhà Ngắm Sao',
      caption: caption.trim() || undefined,
      description: caption.trim() || undefined,
      tags: editingItem?.tags || [category.trim() || 'Minh Hoạ'],
      isPinned: editingItem?.isPinned || false,
      isLocked: editingItem?.isLocked || false,
      isDeleted: editingItem?.isDeleted || false,
      views: editingItem?.views || 0,
      downloads: editingItem?.downloads || 0,
      likes: editingItem?.likes || 0,
      createdAt: editingItem?.createdAt || Date.now()
    };

    onSaveGalleryItem(item);
    toast.success(editingItem ? 'Đã cập nhật tác phẩm thành công ✦' : 'Đã thêm ảnh mới vào Thư Viện ✦');
    setModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Cậu có chắc muốn xoá tác phẩm "${name}" khỏi Thư Viện không?`)) {
      onDeleteGalleryItem(id);
      toast.success('Đã xoá ảnh khỏi Thư Viện.');
    }
  };

  const filtered = galleryItems.filter(i => {
    const itemTitle = (i.title || i.name || '').toLowerCase();
    const itemChar = (i.characterName || '').toLowerCase();
    const itemCat = (i.category || '').toLowerCase();
    const q = search.toLowerCase();
    return itemTitle.includes(q) || itemChar.includes(q) || itemCat.includes(q);
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <GlassCard className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Thư Viện Ảnh & Tranh Vẽ ({galleryItems.length} Tác Phẩm)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Quản lý các tác phẩm nghệ thuật, fanart và poster nhân vật dưới mái hiên sao.
              </p>
            </div>
          </div>

          <Button
            variant="gold"
            size="md"
            onClick={handleOpenAdd}
            icon={<Plus className="w-4 h-4" />}
          >
            ✦ Đăng Tác Phẩm Mới
          </Button>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 max-w-sm">
          <Input
            placeholder="Tìm kiếm tác phẩm, nhân vật..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
      </GlassCard>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <GlassCard key={item.id} className="p-3 flex flex-col justify-between space-y-2.5">
            <div className="space-y-2">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 shadow">
                <img
                  src={item.imageUrl || item.src}
                  alt={item.title || item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-950/80 text-white backdrop-blur-md">
                    {item.category || 'Minh Hoạ'}
                  </span>
                </div>
                <div className="absolute bottom-2 right-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-950/80 text-rose-400 backdrop-blur-md flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-rose-500" /> {item.likes || 0}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                  {item.title || item.name}
                </h3>
                {item.characterName && (
                  <p className="text-xs text-amber-500 font-medium truncate">
                    ✦ {item.characterName}
                  </p>
                )}
                {(item.caption || item.description) && (
                  <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                    {item.caption || item.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
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
                onClick={() => handleDelete(item.id, item.title || item.name || 'Tác phẩm')}
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
        maxWidth="md"
        title={editingItem ? '✦ Chỉnh Sửa Tác Phẩm' : '✦ Đăng Tác Phẩm Mới'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Tiêu đề tác phẩm *"
            placeholder="Ví dụ: Đêm Ngắm Sao Cùng Dạ Nguyệt"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Input
            label="URL Hình ảnh chất lượng cao *"
            placeholder="https://images.unsplash.com/... hoặc link ảnh online"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nhân vật liên quan"
              placeholder="Ví dụ: Dạ Nguyệt"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
            />
            <Input
              label="Thể loại / Album"
              placeholder="Minh Hoạ, Poster, Concept Art"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <Input
            label="Tác giả / Hoạ sĩ"
            placeholder="Hiên Nhà Ngắm Sao / Mỡn"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />

          <Textarea
            label="Lời bình / Chú thích tác phẩm"
            placeholder="Khoảnh khắc êm đềm dưới bầu trời đầy sao..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Huỷ
            </Button>
            <Button type="submit" variant="gold" icon={<Save className="w-4 h-4" />}>
              Lưu Tác Phẩm
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
