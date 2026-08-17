import React, { useState } from 'react';
import { PlaylistItem } from '../../types';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { toast } from '../../stores/useToastStore';
import { Music, Play, Pause, Disc, Plus, Trash2, Heart, Volume2, Sparkles } from 'lucide-react';

interface PlaylistPageProps {
  playlist: PlaylistItem[];
  currentTrackIndex: number;
  isPlaying: boolean;
  playTrack: (index: number) => void;
  togglePlay: () => void;
  isAdmin: boolean;
  onAddTrack?: (track: PlaylistItem) => void;
  onDeleteTrack?: (id: string) => void;
}

export const PlaylistPage: React.FC<PlaylistPageProps> = ({
  playlist,
  currentTrackIndex,
  isPlaying,
  playTrack,
  togglePlay,
  isAdmin,
  onAddTrack,
  onDeleteTrack
}) => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');

  const currentTrack = playlist[currentTrackIndex] || playlist[0];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !audioUrl.trim()) {
      toast.error('Vui lòng nhập tiêu đề và liên kết âm thanh.');
      return;
    }

    const newTrack: PlaylistItem = {
      id: 'track_' + Date.now(),
      title: title.trim(),
      artist: artist.trim() || 'Hiên Nhà Ngắm Sao',
      audioUrl: audioUrl.trim(),
      coverUrl: coverUrl.trim() || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
      duration: 180,
      order: playlist.length + 1,
      isActive: true,
      tags: ['Acoustic', 'Healing']
    };

    if (onAddTrack) {
      onAddTrack(newTrack);
      toast.success('Đã thêm bài hát vào danh sách phát ✦');
      setAddModalOpen(false);
      setTitle('');
      setArtist('');
      setAudioUrl('');
      setCoverUrl('');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-600 dark:text-pink-300 text-xs font-semibold">
            <Music className="w-3.5 h-3.5" /> Giai Điệu Dưới Mái Hiên
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
            Playlist Chữa Lành
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Lắng nghe những nốt nhạc êm đềm, hòa cùng tiếng gió đêm và ánh sao lung linh.
          </p>
        </div>

        {isAdmin && (
          <Button
            variant="gold"
            onClick={() => setAddModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Thêm Bài Hát
          </Button>
        )}
      </div>

      {/* Featured Now Playing Deck */}
      {currentTrack && (
        <GlassCard variant="porch" className="p-6 sm:p-8 overflow-hidden relative">
          <div className="flex flex-col md:flex-row items-center gap-6 z-10 relative">
            
            {/* Spinning Album Disc */}
            <div className="relative shrink-0">
              <div
                className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-purple-600 to-indigo-600 shadow-2xl ${
                  isPlaying ? 'animate-spin' : ''
                }`}
                style={{ animationDuration: '14s' }}
              >
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover rounded-full border-4 border-slate-950"
                />
                <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-slate-950 border-2 border-amber-400 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                </div>
              </div>
            </div>

            {/* Track Info & Visualizer */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <span className="text-xs text-amber-300 font-bold uppercase tracking-widest flex items-center justify-center md:justify-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Đang Phát Dưới Hiên Nhà
              </span>
              <h2 className="text-xl sm:text-3xl font-extrabold text-white">{currentTrack.title}</h2>
              <p className="text-xs sm:text-sm text-slate-300">{currentTrack.artist}</p>

              {/* Animated Equalizer Waveform */}
              <div className="flex items-end justify-center md:justify-start gap-1 h-8 pt-2">
                {[40, 70, 90, 60, 30, 85, 100, 50, 75, 45, 95, 60].map((h, i) => (
                  <div
                    key={i}
                    className={`w-1 bg-gradient-to-t from-indigo-400 to-amber-300 rounded-full transition-all duration-300 ${
                      isPlaying ? 'animate-pulse' : 'h-2 opacity-40'
                    }`}
                    style={{
                      height: isPlaying ? `${Math.max(20, Math.round(h * Math.random()))}%` : '20%',
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>

              <div className="pt-2">
                <Button
                  variant="gold"
                  size="md"
                  onClick={togglePlay}
                  icon={isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950" />}
                >
                  {isPlaying ? 'Tạm Dừng Giai Điệu' : 'Phát Giai Điệu'}
                </Button>
              </div>
            </div>

          </div>
        </GlassCard>
      )}

      {/* Playlist Track Table */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-wider uppercase">
          Danh Sách Giai Điệu ({playlist.length})
        </h3>

        <div className="space-y-2">
          {playlist.map((track, idx) => {
            const isThisPlaying = currentTrackIndex === idx && isPlaying;
            const isThisSelected = currentTrackIndex === idx;

            return (
              <GlassCard
                key={track.id}
                onClick={() => playTrack(idx)}
                hoverEffect={true}
                className={`p-3 sm:p-4 flex items-center justify-between gap-4 transition-all ${
                  isThisSelected
                    ? 'border-amber-400/60 bg-amber-50/20 dark:bg-amber-950/20 shadow-md'
                    : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isThisSelected) {
                        togglePlay();
                      } else {
                        playTrack(idx);
                      }
                    }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                      isThisPlaying
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-slate-300'
                    }`}
                  >
                    {isThisPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>

                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-10 h-10 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                  />

                  <div className="truncate">
                    <h4 className={`text-xs sm:text-sm font-bold truncate ${isThisSelected ? 'text-amber-500 dark:text-amber-300' : 'text-slate-800 dark:text-slate-100'}`}>
                      {track.title}
                    </h4>
                    <span className="text-[11px] text-slate-400 truncate block">
                      {track.artist}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 shrink-0">
                  <span>{track.duration ? `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}` : '3:00'}</span>

                  {isAdmin && onDeleteTrack && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Xóa bài hát "${track.title}"?`)) {
                          onDeleteTrack(track.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg"
                      title="Xóa bài hát"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Add Track Modal (Admin Only) */}
      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} maxWidth="md" title="✦ THÊM BÀI HÁT MỚI">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input
            label="Tiêu đề bài hát *"
            placeholder="Ví dụ: Starry Night Whispers"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Input
            label="Nghệ sĩ / Thể loại"
            placeholder="Ví dụ: Lofi Chill / Hiên Nhà"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
          />

          <Input
            label="URL Âm thanh (mp3/stream) *"
            placeholder="https://..."
            value={audioUrl}
            onChange={(e) => setAudioUrl(e.target.value)}
            required
          />

          <Input
            label="URL Ảnh bìa (Cover art)"
            placeholder="https://images.unsplash.com/..."
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
          />

          <div className="pt-3 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setAddModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="gold" type="submit">
              Lưu Bài Hát
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
