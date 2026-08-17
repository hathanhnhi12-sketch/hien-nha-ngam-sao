import React, { useState } from 'react';
import { Character } from '../../../types';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { CharacterFormModal } from '../../../components/character/CharacterFormModal';
import { toast } from '../../../stores/useToastStore';
import { 
  Users, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Heart, 
  Vote, 
  Sparkles,
  MessageCircle,
  ExternalLink
} from 'lucide-react';

interface CharactersTabProps {
  characters: Character[];
  onSaveCharacter: (char: Character) => void;
  onDeleteCharacter: (id: string) => void;
}

export const CharactersTab: React.FC<CharactersTabProps> = ({
  characters,
  onSaveCharacter,
  onDeleteCharacter
}) => {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'open' | 'updating' | 'unreleased'>('all');
  const [charToEdit, setCharToEdit] = useState<Character | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredCharacters = characters.filter(c => {
    const s = search.toLowerCase();
    const cName = (c.name || '').toLowerCase();
    const cSeries = (c.series || '').toLowerCase();
    const cTags = (c.tags || []).map(t => (t || '').toLowerCase());
    
    const matchesSearch = cName.includes(s) ||
      cSeries.includes(s) ||
      cTags.some(t => t.includes(s));
    const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = () => {
    setCharToEdit(null);
    setModalOpen(true);
  };

  const handleEdit = (char: Character) => {
    setCharToEdit(char);
    setModalOpen(true);
  };

  const handleDelete = (char: Character) => {
    if (window.confirm(`Cậu có chắc chắn muốn xoá nhân vật "${char.name}" khỏi Hiên Nhà không?`)) {
      onDeleteCharacter(char.id);
      toast.success(`Đã xoá nhân vật ${char.name} thành công.`);
    }
  };

  const handleToggleHide = (char: Character) => {
    const nextHidden = !char.isHidden;
    onSaveCharacter({
      ...char,
      isHidden: nextHidden,
      updatedAt: Date.now()
    });
    toast.success(nextHidden ? `Đã ẩn nhân vật ${char.name}` : `Đã hiển thị lại nhân vật ${char.name}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Search Bar */}
      <GlassCard className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Quản Lý Nhân Vật ({characters.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tạo mới, chỉnh sửa thông tin, văn án, link bot và trạng thái cổng.
              </p>
            </div>
          </div>

          <Button
            variant="gold"
            size="md"
            onClick={handleCreate}
            icon={<Plus className="w-4 h-4" />}
            className="w-full sm:w-auto shrink-0"
          >
            ✦ Tạo Nhân Vật Mới
          </Button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Tìm theo tên, series, tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedStatus === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Tất cả ({characters.length})
            </button>
            <button
              onClick={() => setSelectedStatus('open')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedStatus === 'open'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Đang mở ({characters.filter(c => c.status === 'open').length})
            </button>
            <button
              onClick={() => setSelectedStatus('updating')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedStatus === 'updating'
                  ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-300 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Cập nhật ({characters.filter(c => c.status === 'updating').length})
            </button>
            <button
              onClick={() => setSelectedStatus('unreleased')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedStatus === 'unreleased'
                  ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Chưa phát hành ({characters.filter(c => c.status === 'unreleased').length})
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Characters List Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCharacters.map((char) => (
          <GlassCard
            key={char.id}
            className={`p-4 flex flex-col justify-between space-y-3 transition-all ${
              char.isHidden ? 'opacity-55 border-dashed border-rose-400/50' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <img
                src={char.avatarUrl}
                alt={char.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-400/30 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                    {char.name}
                  </h3>
                  <Badge variant="status" status={char.status} className="text-[10px] py-0.5 px-2">
                    {char.status === 'open' ? 'Mở' : char.status === 'updating' ? 'Cập nhật' : 'Chưa phát hành'}
                  </Badge>
                </div>
                <p className="text-xs text-amber-500 font-medium truncate mt-0.5">
                  {char.series || 'Dưới Mái Hiên Sao'}
                </p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {char.tags?.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-4 gap-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center text-[10px] text-slate-600 dark:text-slate-300">
              <div>
                <span className="block font-bold text-rose-500">{char.loveCount || 0}</span>
                <span>Yêu thích</span>
              </div>
              <div>
                <span className="block font-bold text-indigo-500">{char.voteCount || 0}</span>
                <span>Bình chọn</span>
              </div>
              <div>
                <span className="block font-bold text-amber-500">{char.affinity || 0}</span>
                <span>Thân thiết</span>
              </div>
              <div>
                <span className="block font-bold text-emerald-500">{char.views || 0}</span>
                <span>Lượt xem</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleToggleHide(char)}
                  title={char.isHidden ? 'Hiển thị nhân vật' : 'Ẩn nhân vật'}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    char.isHidden ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                >
                  {char.isHidden ? <EyeOff className="w-4 h-4 text-rose-500" /> : <Eye className="w-4 h-4" />}
                </button>

                {char.linkGgai && (
                  <a
                    href={char.linkGgai}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Mở link bot chat"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  size="xs"
                  variant="secondary"
                  onClick={() => handleEdit(char)}
                  icon={<Edit3 className="w-3 h-3" />}
                >
                  Sửa
                </Button>

                <Button
                  size="xs"
                  variant="danger"
                  onClick={() => handleDelete(char)}
                  icon={<Trash2 className="w-3 h-3" />}
                >
                  Xoá
                </Button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Edit/Add Character Modal */}
      <CharacterFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        characterToEdit={charToEdit}
        onSave={(char) => {
          onSaveCharacter(char);
          setModalOpen(false);
        }}
      />

    </div>
  );
};
