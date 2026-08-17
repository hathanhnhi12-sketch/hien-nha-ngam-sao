import React, { useState } from 'react';
import { Character } from '../../types';
import { GlassCard } from '../../components/ui/GlassCard';
import { Badge } from '../../components/ui/Badge';
import { Trophy, Heart, Sparkles, Vote, Gift, Star } from 'lucide-react';

export type RankingCategory = 'total' | 'love' | 'vote' | 'affinity';

interface LeaderboardPageProps {
  characters: Character[];
  onSelectCharacter: (character: Character) => void;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({
  characters,
  onSelectCharacter
}) => {
  const [activeCategory, setActiveCategory] = useState<RankingCategory>('total');

  const categories = [
    { id: 'total' as RankingCategory, label: 'Tổng Điểm Ánh Sao', icon: <Star className="w-4 h-4 text-amber-400" /> },
    { id: 'love' as RankingCategory, label: 'Yêu Thích ❤️', icon: <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> },
    { id: 'vote' as RankingCategory, label: 'Bình Chọn 🗳️', icon: <Vote className="w-4 h-4 text-indigo-400" /> },
    { id: 'affinity' as RankingCategory, label: 'Thân Thiết 🎁', icon: <Gift className="w-4 h-4 text-emerald-400" /> },
  ];

  const getScore = (char: Character, cat: RankingCategory): number => {
    switch (cat) {
      case 'love':
        return char.loveCount || 0;
      case 'vote':
        return char.voteCount || 0;
      case 'affinity':
        return char.affinity || 0;
      case 'total':
      default:
        return (char.loveCount || 0) + (char.voteCount || 0) + (char.affinity || 0);
    }
  };

  const getScoreBadge = (char: Character, cat: RankingCategory) => {
    const score = getScore(char, cat);
    switch (cat) {
      case 'love':
        return (
          <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-500 font-bold text-xs">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> {score} Tim
          </span>
        );
      case 'vote':
        return (
          <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 font-bold text-xs">
            <Vote className="w-3.5 h-3.5 text-indigo-400" /> {score} Phiếu
          </span>
        );
      case 'affinity':
        return (
          <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
            <Gift className="w-3.5 h-3.5 text-emerald-400" /> {score} Điểm
          </span>
        );
      case 'total':
      default:
        return (
          <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-400 font-bold text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> {score} Điểm Sao
          </span>
        );
    }
  };

  // Deterministically sort by score descending, breaking ties by ID ascending
  const sortedCharacters = [...characters]
    .filter(c => !c.isHidden)
    .sort((a, b) => {
      const diff = getScore(b, activeCategory) - getScore(a, activeCategory);
      if (diff !== 0) return diff;
      return a.id.localeCompare(b.id);
    });

  const top1 = sortedCharacters[0];
  const top2 = sortedCharacters[1];
  const top3 = sortedCharacters[2];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-fade-in pb-16">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-500 dark:text-amber-300 text-xs font-semibold">
          <Trophy className="w-4 h-4 text-amber-400" /> BẢNG VINH DANH ÁNH SAO
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Bảng Xếp Hạng Tri Kỷ
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Vinh danh những người bạn tri kỷ nhận được nhiều tình cảm, trái tim yêu thương và sự đồng hành nhất dưới mái hiên.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center justify-center gap-2 p-1.5 bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl max-w-xl mx-auto backdrop-blur-md overflow-x-auto">
        {categories.map(cat => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* TOP 3 PODIUM */}
      {sortedCharacters.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
          
          {/* Top 2 - Silver */}
          {top2 && (
            <GlassCard
              onClick={() => onSelectCharacter(top2)}
              hoverEffect={true}
              className="order-2 md:order-1 p-5 text-center space-y-3 relative overflow-hidden border-slate-300 dark:border-slate-600 shadow-lg cursor-pointer"
            >
              <div className="absolute -top-1 -right-1 w-12 h-12 bg-slate-300 dark:bg-slate-600 text-slate-900 font-bold rounded-bl-3xl flex items-start justify-end p-2 text-sm shadow">
                #2
              </div>
              <div className="relative mx-auto w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-slate-300 dark:ring-slate-500 shadow-xl">
                <img src={top2.avatarUrl} alt={top2.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{top2.name}</h3>
                <span className="text-[11px] text-slate-400">{top2.series || 'Dưới Mái Hiên'}</span>
              </div>
              <div className="flex justify-center pt-1">
                {getScoreBadge(top2, activeCategory)}
              </div>
            </GlassCard>
          )}

          {/* Top 1 - Gold (Elevated Center) */}
          {top1 && (
            <GlassCard
              onClick={() => onSelectCharacter(top1)}
              hoverEffect={true}
              variant="glow"
              className="order-1 md:order-2 p-6 text-center space-y-4 relative overflow-hidden md:-translate-y-4 border-amber-400 shadow-2xl cursor-pointer"
            >
              <div className="absolute -top-1 -right-1 w-14 h-14 bg-gradient-to-br from-amber-300 to-yellow-500 text-slate-950 font-extrabold rounded-bl-3xl flex items-start justify-end p-2 text-base shadow-lg">
                <Trophy className="w-5 h-5 text-slate-950" />
              </div>
              <div className="relative mx-auto w-28 h-28 rounded-2xl overflow-hidden ring-4 ring-amber-400 shadow-2xl">
                <img src={top1.avatarUrl} alt={top1.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-500 text-[10px] font-extrabold uppercase mb-1">
                  ✦ Quán Quân Ánh Sao ✦
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-amber-200">{top1.name}</h3>
                <span className="text-xs text-slate-400">{top1.series || 'Dưới Mái Hiên'}</span>
              </div>
              <div className="flex justify-center pt-1">
                {getScoreBadge(top1, activeCategory)}
              </div>
            </GlassCard>
          )}

          {/* Top 3 - Bronze */}
          {top3 && (
            <GlassCard
              onClick={() => onSelectCharacter(top3)}
              hoverEffect={true}
              className="order-3 p-5 text-center space-y-3 relative overflow-hidden border-amber-700/50 dark:border-amber-700/60 shadow-lg cursor-pointer"
            >
              <div className="absolute -top-1 -right-1 w-12 h-12 bg-amber-700 text-amber-100 font-bold rounded-bl-3xl flex items-start justify-end p-2 text-sm shadow">
                #3
              </div>
              <div className="relative mx-auto w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-amber-700 shadow-xl">
                <img src={top3.avatarUrl} alt={top3.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{top3.name}</h3>
                <span className="text-[11px] text-slate-400">{top3.series || 'Dưới Mái Hiên'}</span>
              </div>
              <div className="flex justify-center pt-1">
                {getScoreBadge(top3, activeCategory)}
              </div>
            </GlassCard>
          )}

        </div>
      )}

      {/* FULL RANKINGS LIST */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-wider uppercase flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> Tất Cả Thứ Hạng ({sortedCharacters.length})
          </h3>
          <span className="text-xs text-slate-400">
            Cập nhật trực tiếp từ tương tác thực tế
          </span>
        </div>

        <div className="space-y-2.5">
          {sortedCharacters.map((char, index) => (
            <GlassCard
              key={char.id}
              onClick={() => onSelectCharacter(char)}
              hoverEffect={true}
              className="p-3.5 sm:p-4 flex items-center justify-between gap-4 cursor-pointer"
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <span className={`w-7 text-center font-black text-sm sm:text-base ${
                  index === 0 ? 'text-amber-500' : index === 1 ? 'text-slate-400' : index === 2 ? 'text-amber-700' : 'text-slate-400'
                }`}>
                  #{index + 1}
                </span>

                <img
                  src={char.avatarUrl}
                  alt={char.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-1 ring-slate-300 dark:ring-slate-700 shrink-0"
                />

                <div className="truncate">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                    {char.name}
                  </h4>
                  <span className="text-[11px] text-slate-400 truncate block">
                    {char.series || 'Dưới Mái Hiên'}
                  </span>
                </div>
              </div>

              {/* Category Score Badge */}
              <div className="shrink-0">
                {getScoreBadge(char, activeCategory)}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

    </div>
  );
};
