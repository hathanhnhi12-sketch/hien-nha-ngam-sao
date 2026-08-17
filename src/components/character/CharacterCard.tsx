import React from 'react';
import { Character } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { Eye, Heart, Vote, MessageCircle, Sparkles } from 'lucide-react';

interface CharacterCardProps {
  character: Character;
  onSelect: (character: Character) => void;
  onLove: (e: React.MouseEvent, id: string) => void;
  isLoved?: boolean;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onSelect,
  onLove,
  isLoved = false
}) => {
  const isUnreleased = character.status === 'unreleased';

  return (
    <GlassCard
      onClick={() => onSelect(character)}
      hoverEffect={true}
      className={`group relative overflow-hidden flex flex-col h-full border ${
        isUnreleased
          ? 'border-purple-400/40 dark:border-purple-500/30'
          : 'border-white/60 dark:border-slate-800'
      }`}
    >
      {/* Top Cover / Visual Area */}
      <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-slate-900">
        <img
          src={character.avatarUrl || character.largeImgUrl}
          alt={character.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="status" status={character.status}>
            {character.status === 'open' ? '✦ Đang mở cổng' : character.status === 'updating' ? '✦ Đang cập nhật' : '✦ Chưa phát hành'}
          </Badge>
        </div>

        {/* Love button overlay */}
        <button
          onClick={(e) => onLove(e, character.id)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-transform active:scale-90 cursor-pointer ${
            isLoved
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
              : 'bg-black/40 text-white/80 hover:text-rose-400 hover:bg-black/60'
          }`}
          title="Yêu thích nhân vật"
        >
          <Heart className={`w-4 h-4 ${isLoved ? 'fill-white' : ''}`} />
        </button>

        {/* Bottom image metadata */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <span className="text-[11px] font-medium text-amber-300 tracking-wide uppercase block">
            {character.series}
          </span>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
            {character.name}
            {isUnreleased && <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-spin" style={{ animationDuration: '8s' }} />}
          </h3>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        {/* Backstory teaser */}
        <div className="p-2.5 rounded-xl bg-indigo-50/60 dark:bg-slate-800/40 border border-indigo-100/50 dark:border-slate-700/40 text-xs text-slate-600 dark:text-slate-300 italic line-clamp-2">
          "{character.backstory}"
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {character.tags.slice(0, 3).map((tag, idx) => (
            <Badge key={idx} variant="tag">
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Footer Stats & Button */}
        <div className="pt-2 border-t border-indigo-100/40 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              {character.loveCount || 0}
            </span>
            <span className="flex items-center gap-1">
              <Vote className="w-3.5 h-3.5 text-indigo-400" />
              {character.voteCount || 0}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              {character.views || 0}
            </span>
          </div>

          <span className="text-xs font-semibold text-indigo-600 dark:text-amber-300 group-hover:underline">
            Xem hồ sơ →
          </span>
        </div>
      </div>
    </GlassCard>
  );
};
