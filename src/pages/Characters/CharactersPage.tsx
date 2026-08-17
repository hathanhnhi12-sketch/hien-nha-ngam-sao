import React, { useState, useMemo, useEffect } from 'react';
import { Character, CharacterStatus, ChatScenario, CharacterCategory } from '../../types';
import { CharacterCard } from '../../components/character/CharacterCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { GlassCard } from '../../components/ui/GlassCard';
import { Modal } from '../../components/ui/Modal';
import { StorageService } from '../../services/storageService';
import { Search, Plus, Sparkles, Users, Crown, Dice5, MessageSquareQuote, Tag, X } from 'lucide-react';

interface CharactersPageProps {
  characters: Character[];
  scenarios: ChatScenario[];
  isAdmin: boolean;
  onSelectCharacter: (character: Character) => void;
  onLoveCharacter: (e: React.MouseEvent, id: string) => void;
  isCharacterLoved: (id: string) => boolean;
  onOpenAddModal: () => void;
  initialCategory?: string;
}

export const CharactersPage: React.FC<CharactersPageProps> = ({
  characters,
  scenarios,
  isAdmin,
  onSelectCharacter,
  onLoveCharacter,
  isCharacterLoved,
  onOpenAddModal,
  initialCategory
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSeries, setSelectedSeries] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  
  // Dynamic categories from StorageService
  const [categories, setCategories] = useState<CharacterCategory[]>(() => 
    StorageService.getCharacterCategories().filter(c => c.enabled !== false)
  );

  useEffect(() => {
    setCategories(StorageService.getCharacterCategories().filter(c => c.enabled !== false));
  }, []);

  const [scenarioModalOpen, setScenarioModalOpen] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<ChatScenario | null>(null);

  // Extract unique series
  const seriesList = useMemo(() => {
    const set = new Set<string>();
    characters.forEach(c => {
      if (c.series) set.add(c.series);
    });
    return Array.from(set);
  }, [characters]);

  // Favorite Character (Rank #1)
  const topCharacter = useMemo(() => {
    const sorted = [...characters].sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));
    return sorted[0] || null;
  }, [characters]);

  // Handle Random Character
  const handleRandomCharacter = () => {
    const availableChars = characters.filter(c => !c.isHidden && c.status === 'open');
    if (availableChars.length > 0) {
      const randomChar = availableChars[Math.floor(Math.random() * availableChars.length)];
      onSelectCharacter(randomChar);
    }
  };

  // Handle Random Scenario
  const handleRandomScenario = () => {
    const activeScenarios = scenarios.filter(s => s.isActive);
    if (activeScenarios.length > 0) {
      const randomScen = activeScenarios[Math.floor(Math.random() * activeScenarios.length)];
      setCurrentScenario(randomScen);
      setScenarioModalOpen(true);
    }
  };

  // Category character count helper
  const getCategoryCount = (catName: string) => {
    if (catName === 'all') {
      return isAdmin ? characters.length : characters.filter(c => !c.isHidden).length;
    }
    const lowerName = catName.toLowerCase().replace(/^#/, '').trim();
    return characters.filter(c => {
      if (!isAdmin && c.isHidden) return false;
      return c.tags?.some(t => {
        const norm = t.toLowerCase().replace(/^#/, '').trim();
        return norm === lowerName || norm.includes(lowerName) || lowerName.includes(norm);
      });
    }).length;
  };

  // Filtered list
  const filteredCharacters = useMemo(() => {
    return characters.filter(char => {
      // Hidden filter (admin sees all, regular users only see non-hidden)
      if (!isAdmin && char.isHidden) return false;

      // Status filter
      if (selectedStatus !== 'all' && char.status !== selectedStatus) return false;

      // Series filter
      if (selectedSeries !== 'all' && char.series !== selectedSeries) return false;

      // Category / Tag filter
      if (selectedCategory !== 'all') {
        const target = selectedCategory.toLowerCase().replace(/^#/, '').trim();
        const hasMatchingTag = char.tags?.some(t => {
          const norm = t.toLowerCase().replace(/^#/, '').trim();
          return norm === target || norm.includes(target) || target.includes(norm);
        });
        if (!hasMatchingTag) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = char.name.toLowerCase().includes(q);
        const matchSeries = char.series?.toLowerCase().includes(q);
        const matchTags = char.tags?.some(t => t.toLowerCase().includes(q));
        const matchBackstory = char.backstory?.toLowerCase().includes(q);
        return matchName || matchSeries || matchTags || matchBackstory;
      }

      return true;
    });
  }, [characters, isAdmin, selectedStatus, selectedSeries, selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header with Title & Creator Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-500 dark:text-amber-300 uppercase tracking-widest block">
            ✦ Danh Sách Tri Kỷ
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Hồ Sơ Nhân Vật
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gặp gỡ những người bạn dưới mái hiên, cùng chia sẻ tâm sự và gửi gắm yêu thương.
          </p>
        </div>

        {/* ADMIN ONLY "+" Button */}
        {isAdmin && (
          <Button
            variant="gold"
            onClick={onOpenAddModal}
            icon={<Plus className="w-4 h-4" />}
          >
            Thêm Nhân Vật Mới
          </Button>
        )}
      </div>

      {/* THREE SPECIAL BLOCKS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* BLOCK 1: NHÂN VẬT ĐƯỢC YÊU THÍCH NHẤT */}
        <GlassCard className="p-5 flex flex-col justify-between items-start space-y-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Crown className="w-24 h-24" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Crown className="w-4 h-4" /> Nhân vật được yêu thích nhất
            </h2>
            {topCharacter ? (
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {topCharacter.name}
              </h3>
            ) : (
              <h3 className="text-slate-500 italic">Chưa có dữ liệu</h3>
            )}
          </div>
          {topCharacter && (
            <Button 
              variant="soft" 
              size="sm" 
              onClick={() => onSelectCharacter(topCharacter)}
            >
              Xem Hồ Sơ →
            </Button>
          )}
        </GlassCard>

        {/* BLOCK 2: RANDOM NHÂN VẬT */}
        <GlassCard className="p-5 flex flex-col justify-between items-start space-y-4 bg-indigo-50/50 dark:bg-indigo-900/20">
          <div>
            <h2 className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Gặp gỡ ngẫu nhiên
            </h2>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Random Nhân Vật
            </h3>
          </div>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleRandomCharacter}
            icon={<Dice5 className="w-4 h-4" />}
          >
            Quay Random
          </Button>
        </GlassCard>

        {/* BLOCK 3: RANDOM TÌNH HUỐNG */}
        <GlassCard className="p-5 flex flex-col justify-between items-start space-y-4 bg-emerald-50/50 dark:bg-emerald-900/20">
          <div>
            <h2 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <MessageSquareQuote className="w-4 h-4" /> Gợi ý nhập vai
            </h2>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Random Tình Huống
            </h3>
          </div>
          <Button 
            variant="gold" 
            size="sm" 
            onClick={handleRandomScenario}
            icon={<Dice5 className="w-4 h-4" />}
          >
            Lấy Tình Huống
          </Button>
        </GlassCard>
      </div>

      {/* DEDICATED CATEGORY / TAG FILTER BAR */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Tag className="w-3.5 h-3.5 text-amber-500" />
            <span>Danh mục khám phá:</span>
          </div>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs text-amber-500 hover:text-amber-600 dark:text-amber-400 flex items-center gap-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Bỏ lọc danh mục
            </button>
          )}
        </div>

        {/* Category horizontal scrolling bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {/* All Category Pill */}
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 font-bold scale-105'
                : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800'
            }`}
          >
            <span>#Tất Cả</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              selectedCategory === 'all'
                ? 'bg-slate-950/20 text-slate-950 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}>
              {getCategoryCount('all')}
            </span>
          </button>

          {/* Dynamic Category Pills */}
          {categories.map((cat) => {
            const count = getCategoryCount(cat.name);
            const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 font-bold scale-105'
                    : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800'
                }`}
              >
                <span>#{cat.name}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-slate-950/20 text-slate-950 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-indigo-100/50 dark:border-slate-800 backdrop-blur-md">
        
        {/* Search input */}
        <div className="w-full md:w-80">
          <Input
            placeholder="Tìm kiếm theo tên, series, tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Tabs */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedStatus === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setSelectedStatus('open')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedStatus === 'open'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Đang mở
            </button>
            <button
              onClick={() => setSelectedStatus('updating')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedStatus === 'updating'
                  ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-300 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Cập nhật
            </button>
            <button
              onClick={() => setSelectedStatus('unreleased')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedStatus === 'unreleased'
                  ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Chưa phát hành
            </button>
          </div>

          {/* Series Dropdown */}
          {seriesList.length > 0 && (
            <select
              value={selectedSeries}
              onChange={(e) => setSelectedSeries(e.target.value)}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 rounded-xl border border-transparent focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              <option value="all">Tất cả Series ({seriesList.length})</option>
              {seriesList.map((s, idx) => (
                <option key={idx} value={s}>{s}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Characters Grid */}
      {filteredCharacters.length === 0 ? (
        <EmptyState
          icon={<Users className="w-8 h-8" />}
          title={selectedCategory !== 'all' ? `Chưa có nhân vật nào trong danh mục #${selectedCategory}` : "Không tìm thấy nhân vật phù hợp"}
          description={selectedCategory !== 'all' ? "Hãy thử chọn một danh mục khác hoặc quay lại xem tất cả nhân vật nhé." : "Hãy thử đổi từ khóa tìm kiếm hoặc bỏ chọn các bộ lọc nhé."}
          action={
            selectedCategory !== 'all' ? (
              <Button variant="gold" size="sm" onClick={() => setSelectedCategory('all')}>
                Xem Tất Cả Nhân Vật
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCharacters.map((char) => (
            <CharacterCard
              key={char.id}
              character={char}
              onSelect={onSelectCharacter}
              onLove={onLoveCharacter}
              isLoved={isCharacterLoved(char.id)}
            />
          ))}
        </div>
      )}

      {/* Scenario Modal */}
      <Modal
        isOpen={scenarioModalOpen}
        onClose={() => setScenarioModalOpen(false)}
        title="✦ Tình Huống Nhập Vai"
        maxWidth="md"
      >
        {currentScenario && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {currentScenario.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              {currentScenario.text}
            </p>
            <div className="flex justify-end pt-2">
              <Button onClick={handleRandomScenario} variant="secondary" size="sm" icon={<Dice5 className="w-4 h-4" />}>
                Quay Lại Tình Huống Khác
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};
