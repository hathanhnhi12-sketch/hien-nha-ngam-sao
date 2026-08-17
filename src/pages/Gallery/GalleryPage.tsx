import React, { useState, useMemo } from 'react';
import { GalleryItem } from '../../types';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { toast } from '../../stores/useToastStore';
import { 
  Image as ImageIcon, 
  Search, 
  Heart, 
  Eye, 
  Download, 
  Copy, 
  Share2, 
  Plus, 
  Trash2, 
  Sparkles,
  Maximize2
} from 'lucide-react';

interface GalleryPageProps {
  galleryItems: GalleryItem[];
  isAdmin: boolean;
  onLikeImage: (id: string) => void;
  onAddImage?: (item: GalleryItem) => void;
  onDeleteImage?: (id: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({
  galleryItems,
  isAdmin,
  onLikeImage,
  onAddImage,
  onDeleteImage
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'likes' | 'views'>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);

  // Admin Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [src, setSrc] = useState('');
  const [category, setCategory] = useState('Nhân vật');
  const [description, setDescription] = useState('');

  const categories = ['all', 'Nhân vật', 'Phong cảnh đêm', 'Khoảnh khắc', 'Chiêm tinh'];

  const filteredItems = useMemo(() => {
    return galleryItems
      .filter((item) => {
        if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const itemName = (item.name || item.title || '').toLowerCase();
          const itemDesc = (item.description || item.caption || '').toLowerCase();
          return itemName.includes(q) || itemDesc.includes(q);
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'likes') return (b.likes || 0) - (a.likes || 0);
        if (sortBy === 'views') return (b.views || 0) - (a.views || 0);
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
  }, [galleryItems, selectedCategory, searchQuery, sortBy]);

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Đã sao chép liên kết hình ảnh ✦');
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !src.trim()) {
      toast.error('Vui lòng điền tên và link ảnh.');
      return;
    }

    const newItem: GalleryItem = {
      id: 'gallery_' + Date.now(),
      name: name.trim(),
      src: src.trim(),
      type: 'image',
      category,
      caption: description.trim(),
      description: description.trim(),
      tags: [category],
      isPinned: false,
      isLocked: false,
      isDeleted: false,
      downloads: 0,
      likes: 0,
      views: 0,
      createdAt: Date.now()
    };

    if (onAddImage) {
      onAddImage(newItem);
      toast.success('Đã thêm ảnh vào Album Kỷ Niệm ✦');
      setIsAddModalOpen(false);
      setName('');
      setSrc('');
      setDescription('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-300 text-xs font-semibold">
            <ImageIcon className="w-3.5 h-3.5" /> Kho Lưu Giữ Kỷ Niệm
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
            Album Ảnh Hiên Nhà
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Nơi trưng bày những tác phẩm, khoảnh khắc ngắm sao và hình ảnh nghệ thuật.
          </p>
        </div>

        {isAdmin && (
          <Button
            variant="gold"
            onClick={() => setIsAddModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Thêm Ảnh Mới
          </Button>
        )}
      </div>

      {/* Filter & Controls Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-indigo-100/50 dark:border-slate-800 backdrop-blur-md">
        
        {/* Search */}
        <div className="w-full md:w-72">
          <Input
            placeholder="Tìm tên ảnh hoặc mô tả..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Category & Sort */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {cat === 'all' ? 'Tất cả' : cat}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 rounded-xl border border-transparent focus:outline-none focus:ring-1 focus:ring-amber-400"
          >
            <option value="newest">Mới nhất</option>
            <option value="likes">Nhiều tim nhất</option>
            <option value="views">Nhiều lượt xem</option>
          </select>
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredItems.length === 0 ? (
        <EmptyState
          icon={<ImageIcon className="w-8 h-8" />}
          title="Không tìm thấy tác phẩm nào"
          description="Hãy thử đổi bộ lọc hoặc từ khóa tìm kiếm."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveLightboxItem(item)}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer h-72 border border-white/40 dark:border-slate-800"
            >
              <img
                src={item.src || item.imageUrl}
                alt={item.name || item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLikeImage(item.id);
                  }}
                  className="p-1.5 rounded-full bg-slate-950/50 backdrop-blur-md text-white/80 hover:text-rose-400 hover:scale-110 transition-transform"
                >
                  <Heart className="w-4 h-4 fill-white/20" />
                </button>
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <Badge variant="tag" className="mb-1 text-[10px]">
                  {item.category || 'Minh hoạ'}
                </Badge>
                <h4 className="text-sm font-bold text-slate-100 truncate">{item.name || item.title}</h4>
                
                <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1.5 border-t border-white/10 mt-1.5">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-400" /> {item.likes || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3 text-slate-400" /> {item.views || 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <Modal
        isOpen={!!activeLightboxItem}
        onClose={() => setActiveLightboxItem(null)}
        maxWidth="4xl"
      >
        {activeLightboxItem && (
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 max-h-[70vh] flex items-center justify-center">
              <img
                src={activeLightboxItem.src || activeLightboxItem.imageUrl}
                alt={activeLightboxItem.name || activeLightboxItem.title}
                className="max-w-full max-h-[65vh] object-contain rounded-xl"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{activeLightboxItem.name || activeLightboxItem.title}</h3>
                  <Badge variant="gold">{activeLightboxItem.category}</Badge>
                </div>
                {(activeLightboxItem.description || activeLightboxItem.caption) && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-lg">
                    {activeLightboxItem.description || activeLightboxItem.caption}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onLikeImage(activeLightboxItem.id)}
                  icon={<Heart className="w-4 h-4 text-rose-500" />}
                >
                  {activeLightboxItem.likes || 0} Thích
                </Button>

                <Button
                  size="sm"
                  variant="soft"
                  onClick={() => handleCopyLink(activeLightboxItem.src || activeLightboxItem.imageUrl || '')}
                  icon={<Copy className="w-4 h-4" />}
                >
                  Sao chép URL
                </Button>

                {isAdmin && onDeleteImage && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      if (confirm(`Xóa ảnh "${activeLightboxItem.name || activeLightboxItem.title}"?`)) {
                        onDeleteImage(activeLightboxItem.id);
                        setActiveLightboxItem(null);
                      }
                    }}
                    icon={<Trash2 className="w-4 h-4" />}
                  >
                    Xóa Ảnh
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Admin Add Image Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} maxWidth="md" title="✦ THÊM ẢNH MỚI VÀO ALBUM">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input
            label="Tên tác phẩm / Tiêu đề *"
            placeholder="Ví dụ: Đêm Trăng Trên Hiên Nhà"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="URL Hình ảnh (Trực tiếp) *"
            placeholder="https://images.unsplash.com/..."
            value={src}
            onChange={(e) => setSrc(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Danh mục
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-white/70 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
            >
              <option value="Nhân vật">Nhân vật</option>
              <option value="Phong cảnh đêm">Phong cảnh đêm</option>
              <option value="Khoảnh khắc">Khoảnh khắc</option>
              <option value="Chiêm tinh">Chiêm tinh</option>
            </select>
          </div>

          <Input
            label="Mô tả hoặc cảm xúc"
            placeholder="Vài dòng cảm nhận..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="pt-3 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="gold" type="submit">
              Lưu Vào Album
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
