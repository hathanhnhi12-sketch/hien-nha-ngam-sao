import React, { useState } from 'react';
import { MediaResource } from '../../../types';
import { StorageService } from '../../../services/storageService';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { Input, Textarea } from '../../../components/ui/Input';
import { MediaUploader } from '../../../components/ui/MediaUploader';
import { Modal } from '../../../components/ui/Modal';
import { ImageLightbox } from '../../../components/ui/ImageLightbox';
import { toast } from '../../../stores/useToastStore';
import { 
  FolderArchive, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  ExternalLink, 
  Search, 
  Video, 
  Image as ImageIcon, 
  Music, 
  Sparkles, 
  Tag, 
  Eye, 
  Edit2
} from 'lucide-react';

export const MediaLibraryTab: React.FC = () => {
  const [resources, setResources] = useState<MediaResource[]>(() => StorageService.getMediaResources());
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'video' | 'image' | 'gif' | 'audio' | 'other'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<MediaResource | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<'video' | 'image' | 'gif' | 'audio' | 'other'>('image');
  const [category, setCategory] = useState('Nền & Không Gian');
  const [description, setDescription] = useState('');

  const reloadData = () => {
    setResources(StorageService.getMediaResources());
  };

  const handleOpenAdd = () => {
    setEditingResource(null);
    setTitle('');
    setUrl('');
    setType('image');
    setCategory('Nền & Không Gian');
    setDescription('');
    setModalOpen(true);
  };

  const handleOpenEdit = (res: MediaResource) => {
    setEditingResource(res);
    setTitle(res.title || res.name || '');
    setUrl(res.url);
    setType(res.type as any || 'image');
    setCategory(res.category || 'Nền & Không Gian');
    setDescription(res.description || '');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      toast.error('Vui lòng nhập đầy đủ tên tài nguyên và tải tệp/nhập URL.');
      return;
    }

    if (editingResource) {
      StorageService.updateMediaResource(editingResource.id, {
        title: title.trim(),
        name: title.trim(),
        url: url.trim(),
        type,
        category: category.trim(),
        description: description.trim()
      });
      toast.success('✦ Đã cập nhật tài nguyên media!');
    } else {
      StorageService.addMediaResource({
        title: title.trim(),
        name: title.trim(),
        url: url.trim(),
        type,
        category: category.trim(),
        description: description.trim(),
        usedIn: [category.trim()]
      });
      toast.success('✦ Đã lưu tài nguyên vào Kho Lưu Trữ Tập Trung!');
    }

    reloadData();
    setModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc muốn xoá tài nguyên "${name}" khỏi kho không?`)) {
      StorageService.deleteMediaResource(id);
      reloadData();
      toast.success('Đã xoá tài nguyên.');
    }
  };

  const handleCopyUrl = (urlToCopy: string, id: string) => {
    navigator.clipboard.writeText(urlToCopy);
    setCopiedId(id);
    toast.success('Đã copy đường dẫn URL vào bộ nhớ đệm!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Categories list
  const categoriesList = Array.from(new Set(resources.map(r => r.category || 'Chung')));

  const filtered = resources.filter(r => {
    const q = search.toLowerCase();
    const rTitle = (r.title || r.name || '').toLowerCase();
    const rCategory = (r.category || '').toLowerCase();
    const rDesc = (r.description || '').toLowerCase();
    const matchesSearch = rTitle.includes(q) || rCategory.includes(q) || rDesc.includes(q);
    const matchesType = selectedType === 'all' || r.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <GlassCard className="p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-amber-400 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-500/20 shrink-0">
              <FolderArchive className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                Kho Tài Nguyên Tập Trung ({resources.length} Tài Nguyên)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Quản lý toàn diện mọi hình ảnh, GIF động, Video nền, Âm thanh và hoạt cảnh trên toàn hệ thống Hiên Nhà.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenAdd}
            icon={<Plus className="w-4 h-4" />}
          >
            Tải Tài Nguyên Mới
          </Button>
        </div>

        {/* Filter Controls */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="w-full sm:w-72">
            <Input
              placeholder="Tìm theo tên, vị trí sử dụng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Type filters */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs overflow-x-auto">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedType === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Tất cả ({resources.length})
            </button>
            <button
              onClick={() => setSelectedType('image')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedType === 'image'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Ảnh ({resources.filter(r => r.type === 'image').length})
            </button>
            <button
              onClick={() => setSelectedType('gif')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedType === 'gif'
                  ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-300 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              GIF ({resources.filter(r => r.type === 'gif').length})
            </button>
            <button
              onClick={() => setSelectedType('video')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedType === 'video'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Video ({resources.filter(r => r.type === 'video').length})
            </button>
            <button
              onClick={() => setSelectedType('audio')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedType === 'audio'
                  ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-300 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Audio ({resources.filter(r => r.type === 'audio').length})
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((res) => {
          const isVid = res.type === 'video';
          const isAud = res.type === 'audio';
          return (
            <GlassCard key={res.id} className="p-3.5 flex flex-col justify-between space-y-3 hover:border-indigo-400 dark:hover:border-slate-600 transition-all">
              <div className="space-y-2">
                {/* Media Preview Box */}
                <div className="relative w-full h-32 rounded-xl bg-slate-950 overflow-hidden flex items-center justify-center p-1 border border-slate-800 group">
                  {isVid ? (
                    <video src={res.url} className="w-full h-full object-cover" muted loop autoPlay />
                  ) : isAud ? (
                    <div className="flex flex-col items-center gap-1 text-rose-400">
                      <Music className="w-8 h-8 animate-pulse" />
                      <audio src={res.url} controls className="h-6 w-36 scale-75" />
                    </div>
                  ) : (
                    <img
                      src={res.url}
                      alt={res.title || res.name}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
                      onClick={() => setLightboxUrl(res.url)}
                    />
                  )}

                  {!isVid && !isAud && (
                    <div
                      onClick={() => setLightboxUrl(res.url)}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold cursor-pointer transition-opacity"
                    >
                      <Eye className="w-4 h-4 mr-1" /> Phóng to
                    </div>
                  )}

                  <span className="absolute top-1.5 left-1.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-amber-300 border border-slate-700 flex items-center gap-1">
                    {res.type === 'video' && <Video className="w-2.5 h-2.5" />}
                    {res.type === 'image' && <ImageIcon className="w-2.5 h-2.5" />}
                    {res.type === 'gif' && <Sparkles className="w-2.5 h-2.5" />}
                    {res.type === 'audio' && <Music className="w-2.5 h-2.5" />}
                    {res.category || 'Chung'}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                    {res.title || res.name}
                  </h3>
                  {res.description && (
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                      {res.description}
                    </p>
                  )}
                </div>

                {/* UsedIn tags */}
                {res.usedIn && res.usedIn.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {res.usedIn.map((tag, idx) => (
                      <span key={idx} className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => handleCopyUrl(res.url, res.id)}
                  icon={copiedId === res.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  className="text-[11px] py-1 px-2 h-auto"
                >
                  {copiedId === res.id ? 'Đã Copy' : 'Copy'}
                </Button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(res)}
                    className="p-1.5 text-slate-400 hover:text-indigo-500 rounded-lg cursor-pointer transition-colors"
                    title="Chỉnh sửa tài nguyên"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-slate-400 hover:text-amber-500 rounded-lg transition-colors"
                    title="Mở liên kết trực tiếp"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleDelete(res.id, res.title || res.name || 'Tài nguyên')}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg cursor-pointer transition-colors"
                    title="Xoá tài nguyên"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="md"
        title={editingResource ? '✦ CHỈNH SỬA TÀI NGUYÊN MEDIA' : '✦ ĐĂNG KÝ TÀI NGUYÊN MEDIA MỚI'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Tên tài nguyên *"
            placeholder="Ví dụ: Video Nền Sao Rơi Đêm Khuya"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Loại tài nguyên
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-white/80 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
              >
                <option value="image">Hình ảnh (Image / Poster)</option>
                <option value="gif">Ảnh động (GIF / WebP)</option>
                <option value="video">Video chuyển động (MP4 / WebM)</option>
                <option value="audio">Âm thanh / BGM (MP3 / WAV)</option>
                <option value="other">Tài liệu / Khác</option>
              </select>
            </div>

            <Input
              label="Danh mục / Vị trí áp dụng"
              placeholder="Màn Hình Tải, Avatar, Sticker, Nền..."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <MediaUploader
            label="Tệp tài nguyên hoặc URL *"
            value={url}
            onChange={setUrl}
            acceptTypes={['image', 'gif', 'video', 'audio']}
            maxSizeMB={15}
            placeholder="Dán link trực tiếp hoặc tải tệp lên..."
          />

          <Textarea
            label="Mô tả công dụng (Tuỳ chọn)"
            placeholder="Ghi chú về tài nguyên này..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Huỷ
            </Button>
            <Button type="submit" variant="primary" disabled={!title.trim() || !url.trim()}>
              {editingResource ? 'Lưu Thay Đổi' : 'Lưu Vào Kho'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Lightbox */}
      <ImageLightbox
        isOpen={Boolean(lightboxUrl)}
        imageUrl={lightboxUrl || ''}
        title="Xem tài nguyên"
        onClose={() => setLightboxUrl(null)}
      />

    </div>
  );
};
