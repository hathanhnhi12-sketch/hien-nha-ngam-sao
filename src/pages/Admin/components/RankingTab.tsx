import React, { useState, useMemo } from 'react';
import { Character } from '../../../types';
import { StorageService } from '../../../services/storageService';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { toast } from '../../../stores/useToastStore';
import { 
  Trophy, 
  Heart, 
  RotateCw, 
  Trash2, 
  Search, 
  Sparkles, 
  Crown, 
  Users, 
  Flame, 
  AlertTriangle, 
  CheckSquare, 
  Square,
  ArrowUpDown,
  Filter,
  CheckCircle2
} from 'lucide-react';

interface RankingTabProps {
  characters: Character[];
  onCharactersUpdated?: () => void;
}

export const RankingTab: React.FC<RankingTabProps> = ({
  characters: initialCharacters,
  onCharactersUpdated
}) => {
  const [characterList, setCharacterList] = useState<Character[]>(() => {
    return StorageService.getCharacters();
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Confirmation Modals State
  const [singleResetTarget, setSingleResetTarget] = useState<Character | null>(null);
  const [batchResetModalOpen, setBatchResetModalOpen] = useState(false);
  const [resetAllModalOpen, setResetAllModalOpen] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);

  const refreshData = () => {
    const updated = StorageService.getCharacters();
    setCharacterList(updated);
    if (onCharactersUpdated) {
      onCharactersUpdated();
    }
  };

  // Deterministically sort characters by Heart Count (loveCount DESC)
  const rankedCharacters = useMemo(() => {
    const list = [...characterList].filter(c => !c.isHidden);
    return list.sort((a, b) => {
      const diff = (b.loveCount || 0) - (a.loveCount || 0);
      if (diff !== 0) return diff;
      return a.id.localeCompare(b.id);
    });
  }, [characterList]);

  // Filtered list for search
  const filteredRankings = useMemo(() => {
    if (!searchQuery.trim()) return rankedCharacters;
    const q = searchQuery.toLowerCase();
    return rankedCharacters.filter(c => 
      c.name.toLowerCase().includes(q) ||
      (c.series && c.series.toLowerCase().includes(q))
    );
  }, [rankedCharacters, searchQuery]);

  // Ranking Statistics
  const totalRanked = rankedCharacters.length;
  const totalHearts = rankedCharacters.reduce((acc, c) => acc + (c.loveCount || 0), 0);
  const champion = rankedCharacters[0] || null;
  const avgHearts = totalRanked > 0 ? (totalHearts / totalRanked).toFixed(1) : '0';

  // Toggle selection for batch actions
  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredRankings.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRankings.map(c => c.id));
    }
  };

  // 1. Recalculate Ranking Handler
  const handleRecalculateRanking = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      const sorted = StorageService.recalculateRanking();
      setCharacterList(sorted);
      setIsRecalculating(false);
      if (onCharactersUpdated) onCharactersUpdated();
      toast.success('✦ Đã tính toán và đồng bộ lại thứ hạng bảng xếp hạng thành công!');
    }, 400);
  };

  // 2. Reset Single Character Hearts
  const handleConfirmSingleReset = () => {
    if (!singleResetTarget) return;
    StorageService.resetCharacterHearts(singleResetTarget.id);
    refreshData();
    toast.success(`✦ Đã đặt lại số tim của "${singleResetTarget.name}" về 0 thành công.`);
    setSingleResetTarget(null);
  };

  // 3. Reset Selected Characters Hearts
  const handleConfirmBatchReset = () => {
    if (selectedIds.length === 0) return;
    StorageService.resetSelectedCharacterHearts(selectedIds);
    refreshData();
    toast.success(`✦ Đã đặt lại số tim của ${selectedIds.length} nhân vật đã chọn về 0.`);
    setSelectedIds([]);
    setBatchResetModalOpen(false);
  };

  // 4. Reset ALL Characters Hearts
  const handleConfirmResetAll = () => {
    StorageService.resetAllCharacterHearts();
    refreshData();
    setSelectedIds([]);
    setResetAllModalOpen(false);
    toast.success('✦ Đã đặt lại toàn bộ số tim của tất cả nhân vật về 0.');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <GlassCard className="p-5 sm:p-6" variant="porch">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-500 text-white flex items-center justify-center font-bold shadow-lg shadow-rose-500/20 shrink-0">
              <Trophy className="w-6 h-6 text-amber-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Quản Lý Bảng Xếp Hạng & Tim Yêu Thích
                </h2>
                <Badge variant="gold">LIVE RANKING</Badge>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Thứ hạng được tính toán trực tiếp từ số lượng Trái Tim (❤️) thực tế do Lữ khách gửi gắm trên từng hồ sơ nhân vật.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              icon={<RotateCw className={`w-4 h-4 ${isRecalculating ? 'animate-spin' : ''}`} />}
              onClick={handleRecalculateRanking}
              disabled={isRecalculating}
            >
              Tính Lại Thứ Hạng
            </Button>
            
            {selectedIds.length > 0 && (
              <Button
                variant="danger"
                size="sm"
                icon={<Trash2 className="w-4 h-4" />}
                onClick={() => setBatchResetModalOpen(true)}
              >
                Đặt Lại Tim ({selectedIds.length})
              </Button>
            )}

            <Button
              variant="danger"
              size="sm"
              icon={<AlertTriangle className="w-4 h-4" />}
              onClick={() => setResetAllModalOpen(true)}
            >
              Đặt Lại Toàn Bộ Tim
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Metrics & Spotlight Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Top 1 Champion Card */}
        <GlassCard className="p-4 md:col-span-2 flex items-center gap-4 border-amber-400/40 bg-amber-50/10 dark:bg-amber-950/20 relative overflow-hidden" variant="glow">
          <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow">
            <Crown className="w-3 h-3 fill-slate-950" /> Quán Quân Hiện Tại
          </div>

          {champion ? (
            <>
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden ring-2 ring-amber-400 shadow-md shrink-0">
                <img src={champion.avatarUrl} alt={champion.name} className="w-full h-full object-cover" />
                <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[10px] text-amber-300 font-bold text-center py-0.5">
                  TOP 1
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 truncate">
                  {champion.name}
                </h3>
                <span className="text-xs text-slate-400 block truncate">{champion.series || 'Chưa phân nhóm'}</span>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-500 font-bold text-xs">
                    <Heart className="w-3.5 h-3.5 fill-rose-500" /> {champion.loveCount || 0} Trái Tim
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-xs text-slate-400 py-4">Chưa có nhân vật nào trong hệ thống.</div>
          )}
        </GlassCard>

        {/* Total Hearts */}
        <GlassCard className="p-4 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500 shrink-0">
            <Heart className="w-6 h-6 fill-rose-500/20" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{totalHearts}</span>
            <p className="text-xs text-slate-400">Tổng Trái Tim Trao Gửi</p>
          </div>
        </GlassCard>

        {/* Total Ranked Characters */}
        <GlassCard className="p-4 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{totalRanked}</span>
            <p className="text-xs text-slate-400">Nhân Vật Tham Gia</p>
          </div>
        </GlassCard>

      </div>

      {/* Main Ranking Table Card */}
      <GlassCard className="p-5 space-y-4">
        
        {/* Table Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              {selectedIds.length === filteredRankings.length && filteredRankings.length > 0 ? (
                <>
                  <CheckSquare className="w-4 h-4 text-amber-500" /> Bỏ Chọn Tất Cả
                </>
              ) : (
                <>
                  <Square className="w-4 h-4 text-slate-400" /> Chọn Tất Cả ({filteredRankings.length})
                </>
              )}
            </button>

            {selectedIds.length > 0 && (
              <span className="text-xs font-bold text-amber-500 px-2">
                Đã chọn {selectedIds.length} nhân vật
              </span>
            )}
          </div>

          <div className="w-full sm:w-72">
            <Input
              placeholder="Tìm kiếm nhân vật theo tên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Character Ranking List */}
        <div className="space-y-2.5">
          {filteredRankings.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Không tìm thấy nhân vật nào phù hợp với từ khóa tìm kiếm.
            </div>
          ) : (
            filteredRankings.map((char, index) => {
              const isSelected = selectedIds.includes(char.id);
              const rankPosition = index + 1;

              return (
                <div
                  key={char.id}
                  className={`p-3 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-400/50 shadow-sm'
                      : rankPosition === 1
                      ? 'bg-amber-50/20 dark:bg-amber-950/20 border-amber-400/40'
                      : 'bg-white/40 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Left: Checkbox + Rank + Avatar + Name */}
                  <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
                    <button
                      onClick={() => handleToggleSelect(char.id)}
                      className="text-slate-400 hover:text-amber-500 transition-colors p-1 cursor-pointer shrink-0"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-amber-500" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    {/* Rank Badge */}
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-black text-sm">
                      {rankPosition === 1 ? (
                        <div className="w-full h-full rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-md font-bold">
                          #1
                        </div>
                      ) : rankPosition === 2 ? (
                        <div className="w-full h-full rounded-xl bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-slate-100 flex items-center justify-center shadow font-bold">
                          #2
                        </div>
                      ) : rankPosition === 3 ? (
                        <div className="w-full h-full rounded-xl bg-amber-700 text-amber-100 flex items-center justify-center shadow font-bold">
                          #3
                        </div>
                      ) : (
                        <span className="text-slate-400 font-bold">#{rankPosition}</span>
                      )}
                    </div>

                    <img
                      src={char.avatarUrl}
                      alt={char.name}
                      className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                          {char.name}
                        </h4>
                        {rankPosition === 1 && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-400/20 text-amber-600 dark:text-amber-300">
                            TOP 1
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 truncate block">
                        {char.series || 'Chưa phân nhóm'} • ID: {char.id}
                      </span>
                    </div>
                  </div>

                  {/* Right: Scores & Reset Control */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    
                    {/* Heart Count Box */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 dark:bg-rose-950/30 border border-rose-500/20 text-rose-500 font-bold text-xs">
                      <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                      <span>{char.loveCount || 0} Tim</span>
                    </div>

                    {/* Secondary Voting Stats for Context */}
                    <div className="hidden md:flex items-center gap-1 text-[11px] text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg">
                      <span>🗳️ {char.voteCount || 0} phiếu</span>
                      <span className="mx-1 opacity-40">•</span>
                      <span>🎁 {char.affinity || 0} điểm</span>
                    </div>

                    {/* Reset Button for this character */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSingleResetTarget(char)}
                      className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 px-2.5 py-1 h-auto"
                      title="Đặt lại số tim của nhân vật này về 0"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      Đặt lại Tim
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </GlassCard>

      {/* MODAL 1: Confirm Single Character Heart Reset */}
      <Modal
        isOpen={Boolean(singleResetTarget)}
        onClose={() => setSingleResetTarget(null)}
        title="✦ XÁC NHẬN ĐẶT LẠI SỐ TIM NHÂN VẬT"
        maxWidth="sm"
      >
        {singleResetTarget && (
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800">
              <img
                src={singleResetTarget.avatarUrl}
                alt={singleResetTarget.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                  {singleResetTarget.name}
                </h4>
                <p className="text-xs text-rose-500 font-semibold">
                  Số tim hiện tại: {singleResetTarget.loveCount || 0} ❤️
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Bạn có chắc chắn muốn đặt lại số tim của nhân vật <strong className="text-slate-900 dark:text-white">{singleResetTarget.name}</strong> về <strong>0</strong>?
              <br />
              <span className="text-amber-500 mt-1 block">
                ✦ Thứ hạng của nhân vật trên bảng xếp hạng sẽ được tính toán lại ngay lập tức. Hành động này không xóa nhân vật hay các dữ liệu khác.
              </span>
            </p>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button variant="ghost" onClick={() => setSingleResetTarget(null)}>
                Hủy
              </Button>
              <Button variant="danger" onClick={handleConfirmSingleReset}>
                Xác Nhận Đặt Lại
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 2: Confirm Selected Characters Reset */}
      <Modal
        isOpen={batchResetModalOpen}
        onClose={() => setBatchResetModalOpen(false)}
        title="✦ XÁC NHẬN ĐẶT LẠI TIM CÁC NHÂN VẬT ĐÃ CHỌN"
        maxWidth="sm"
      >
        <div className="space-y-4 py-2">
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>Sắp đặt lại số tim của {selectedIds.length} nhân vật về 0.</span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Số tim yêu thích của tất cả {selectedIds.length} nhân vật đã chọn sẽ trở về 0 và bảng xếp hạng sẽ tự động cập nhật lại.
          </p>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" onClick={() => setBatchResetModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="danger" onClick={handleConfirmBatchReset}>
              Xác Nhận ({selectedIds.length} Nhân Vật)
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL 3: Strong Double Confirmation for Reset ALL */}
      <Modal
        isOpen={resetAllModalOpen}
        onClose={() => setResetAllModalOpen(false)}
        title="⚠️ XÁC NHẬN ĐẶT LẠI TOÀN BỘ TRÁI TIM"
        maxWidth="sm"
      >
        <div className="space-y-4 py-2">
          <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <span>HÀNH ĐỘNG KHÔNG THỂ HOÀN TÁC!</span>
            </div>
            <p className="text-xs leading-relaxed">
              Tất cả số tim của <strong>TOÀN BỘ {rankedCharacters.length} nhân vật</strong> sẽ bị xóa về <strong>0</strong>. Bảng xếp hạng sẽ được làm mới hoàn toàn.
            </p>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 italic">
            Lưu ý: Hành động này chỉ làm mới chỉ số Tim (❤️), không xóa thông tin nhân vật, ảnh hồ sơ, bình luận hay các dữ liệu khác.
          </p>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" onClick={() => setResetAllModalOpen(false)}>
              Hủy Bỏ
            </Button>
            <Button variant="danger" onClick={handleConfirmResetAll}>
              ĐẶT LẠI TOÀN BỘ
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
