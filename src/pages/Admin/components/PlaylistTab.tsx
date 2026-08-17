import React, { useState } from 'react';
import { PlaylistItem } from '../../../types';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { toast } from '../../../stores/useToastStore';
import { 
  Music, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  Search, 
  Play, 
  Disc
} from 'lucide-react';

interface PlaylistTabProps {
  playlist: PlaylistItem[];
  onSaveTrack: (track: PlaylistItem) => void;
  onDeleteTrack: (id: string) => void;
}

export const PlaylistTab: React.FC<PlaylistTabProps> = ({
  playlist,
  onSaveTrack,
  onDeleteTrack
}) => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState<PlaylistItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [url, setUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [duration, setDuration] = useState('03:30');

  const handleOpenAdd = () => {
    setEditingTrack(null);
    setTitle('');
    setArtist('Lofi Veranda / V.A');
    setUrl('');
    setCoverUrl('https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&auto=format&fit=crop&q=80');
    setDuration('03:30');
    setModalOpen(true);
  };

  const handleOpenEdit = (track: PlaylistItem) => {
    setEditingTrack(track);
    setTitle(track.title);
    setArtist(track.artist);
    setUrl(track.url);
    setCoverUrl(track.coverUrl || '');
    setDuration(track.duration || '03:30');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      toast.error('Vui lòng nhập đầy đủ tên bài hát và link audio.');
      return;
    }

    const item: PlaylistItem = {
      id: editingTrack ? editingTrack.id : `track_${Date.now()}`,
      title: title.trim(),
      artist: artist.trim() || 'Hiên Nhà Ngắm Sao',
      audioUrl: url.trim(),
      url: url.trim(),
      coverUrl: coverUrl.trim() || 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&auto=format&fit=crop&q=80',
      duration: duration.trim() || '03:30',
      order: editingTrack ? (editingTrack.order ?? 1) : (playlist.length + 1),
      isActive: editingTrack ? (editingTrack.isActive ?? true) : true
    };

    onSaveTrack(item);
    toast.success(editingTrack ? 'Đã cập nhật bài hát thành công ✦' : 'Đã thêm bài hát vào playlist ✦');
    setModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Cậu có chắc muốn xoá bài hát "${name}" khỏi Playlist không?`)) {
      onDeleteTrack(id);
      toast.success('Đã xoá bài hát khỏi Playlist.');
    }
  };

  const filtered = playlist.filter(t => {
    const q = search.toLowerCase();
    const tTitle = (t.title || '').toLowerCase();
    const tArtist = (t.artist || '').toLowerCase();
    return tTitle.includes(q) || tArtist.includes(q);
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <GlassCard className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Playlist Âm Nhạc ({playlist.length} Bài)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Quản lý các giai điệu du dương phát dưới mái hiên sao.
              </p>
            </div>
          </div>

          <Button
            variant="gold"
            size="md"
            onClick={handleOpenAdd}
            icon={<Plus className="w-4 h-4" />}
          >
            ✦ Thêm Bài Hát Mới
          </Button>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 max-w-sm">
          <Input
            placeholder="Tìm kiếm bài hát, nghệ sĩ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
      </GlassCard>

      {/* Playlist List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((track, index) => (
          <GlassCard key={track.id} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <span className="text-xs font-bold text-slate-400 w-4 text-center">
                {index + 1}
              </span>
              <img
                src={track.coverUrl || 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&auto=format&fit=crop&q=80'}
                alt={track.title}
                className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10 shrink-0"
              />
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                  {track.title}
                </h3>
                <p className="text-xs text-slate-400 truncate">
                  {track.artist}
                </p>
                <span className="text-[10px] text-amber-500 font-semibold">
                  ⏱ {track.duration || '03:30'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                size="xs"
                variant="secondary"
                onClick={() => handleOpenEdit(track)}
                icon={<Edit3 className="w-3 h-3" />}
              >
                Sửa
              </Button>
              <Button
                size="xs"
                variant="danger"
                onClick={() => handleDelete(track.id, track.title)}
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
        title={editingTrack ? '✦ Chỉnh Sửa Bài Hát' : '✦ Thêm Bài Hát Mới'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Tên bài hát *"
            placeholder="Ví dụ: Giấc Mộng Đêm Sao"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Input
            label="Nghệ sĩ / Trình bày"
            placeholder="Ví dụ: Lofi Chill / Hiên Nhà"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
          />

          <Input
            label="URL File Audio (.mp3, audio stream) *"
            placeholder="https://.../song.mp3"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="URL Ảnh Bìa Bài Hát"
              placeholder="https://images.unsplash.com/..."
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
            />
            <Input
              label="Thời lượng (Thời gian)"
              placeholder="03:45"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Huỷ
            </Button>
            <Button type="submit" variant="gold" icon={<Save className="w-4 h-4" />}>
              Lưu Bài Hát
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
