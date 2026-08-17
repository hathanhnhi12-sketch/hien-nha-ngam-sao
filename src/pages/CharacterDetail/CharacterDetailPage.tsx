import React, { useState } from 'react';
import { Character, InventorySlot, MinigameItem } from '../../types';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CharacterCommentSection } from '../../components/character/CharacterCommentSection';
import { GiftCharacterModal } from '../../components/character/GiftCharacterModal';
import { toast } from '../../stores/useToastStore';
import { 
  Heart, 
  Vote, 
  Gift, 
  MessageCircle, 
  MessageSquareQuote, 
  Sparkles, 
  ArrowLeft, 
  Edit3, 
  BookOpen
} from 'lucide-react';

interface CharacterDetailPageProps {
  character: Character;
  onBack: () => void;
  isAdmin: boolean;
  onLove: (e: React.MouseEvent, id: string) => void;
  isLoved: boolean;
  onVote: (id: string) => void;
  onOpenEditModal: (character: Character) => void;
  inventory: InventorySlot[];
  items: MinigameItem[];
  onGift: (characterId: string, characterName: string, itemId: string, quantity: number) => void;
  onIncrementChat: (characterId: string) => void;
}

export const CharacterDetailPage: React.FC<CharacterDetailPageProps> = ({
  character,
  onBack,
  isAdmin,
  onLove,
  isLoved,
  onVote,
  onOpenEditModal,
  inventory,
  items,
  onGift,
  onIncrementChat
}) => {
  const [giftModalOpen, setGiftModalOpen] = useState(false);
  const isUnreleased = character.status === 'unreleased';
  const isUpdating = character.status === 'updating';

  const handleStartChat = () => {
    if (isUnreleased) {
      toast.star(`Nhân vật ${character.name} đang chuẩn bị xuất hiện. Cậu hãy đón chờ nhé!`);
      return;
    }
    if (isUpdating) {
      toast.star(`Nhân vật ${character.name} đang được tinh chỉnh cốt truyện. Hãy thử lại sau nhé!`);
      return;
    }
    if (!character.linkGgai) {
      toast.star(`Cổng trò chuyện của ${character.name} sẽ sớm được kết nối.`);
      return;
    }

    onIncrementChat(character.id);
    window.open(character.linkGgai, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-amber-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách nhân vật
        </button>

        {isAdmin && (
          <Button
            size="sm"
            variant="gold"
            onClick={() => onOpenEditModal(character)}
            icon={<Edit3 className="w-3.5 h-3.5" />}
          >
            Chỉnh Sửa Nhân Vật
          </Button>
        )}
      </div>

      {/* Main Character Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Visual Artwork & Quick Actions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-indigo-200/50 dark:border-indigo-500/20 bg-slate-900 group">
            <img
              src={character.largeImgUrl || character.avatarUrl}
              alt={character.name}
              className="w-full h-auto max-h-[500px] object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

            {/* Top Status */}
            <div className="absolute top-4 left-4">
              <Badge variant="status" status={character.status}>
                {character.status === 'open' ? '✦ Đang mở cổng' : character.status === 'updating' ? '✦ Đang cập nhật' : '✦ Chưa phát hành'}
              </Badge>
            </div>

            {/* Bottom Meta */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-widest block">
                {character.series}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
                {character.name}
                {isUnreleased && <Sparkles className="w-4 h-4 text-purple-300 animate-spin" style={{ animationDuration: '8s' }} />}
              </h1>
            </div>
          </div>

          {/* Interaction Quick Bar */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={isLoved ? 'danger' : 'soft'}
              size="sm"
              onClick={(e) => onLove(e, character.id)}
              icon={<Heart className={`w-4 h-4 ${isLoved ? 'fill-white' : ''}`} />}
              className="justify-center"
            >
              {character.loveCount || 0} Yêu thích
            </Button>

            <Button
              variant="soft"
              size="sm"
              onClick={() => onVote(character.id)}
              icon={<Vote className="w-4 h-4 text-indigo-500" />}
              className="justify-center"
            >
              {character.voteCount || 0} Bình chọn
            </Button>

            <Button
              variant="gold"
              size="sm"
              onClick={() => setGiftModalOpen(true)}
              icon={<Gift className="w-4 h-4" />}
              className="justify-center"
            >
              Tặng Quà
            </Button>
          </div>

          {/* Affinity & View Metrics */}
          <GlassCard className="p-3.5 space-y-2 text-xs text-slate-600 dark:text-slate-300" variant="subtle">
            <div className="flex items-center justify-between">
              <span>Độ thân thiết với Lữ Khách:</span>
              <span className="font-bold text-amber-500">{character.affinity || 0} điểm</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Lượt ghé thăm:</span>
              <span className="font-medium text-slate-700 dark:text-slate-200">{character.views || 0} lượt</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Số cuộc trò chuyện:</span>
              <span className="font-medium text-slate-700 dark:text-slate-200">{character.chats || 0} lần</span>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Chat CTA, Văn Án, Comments */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Primary Chat CTA Action */}
          <div>
            <Button
              size="lg"
              variant={isUnreleased || isUpdating ? 'secondary' : 'primary'}
              onClick={handleStartChat}
              icon={isUnreleased || isUpdating ? <Sparkles className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
              className="w-full justify-center text-sm sm:text-base py-3.5 shadow-xl"
            >
              {isUnreleased
                ? '✦ Trò Chuyện — Chưa Phát Hành'
                : isUpdating
                ? '✦ Trò Chuyện — Đang Cập Nhật'
                : '✦ Trò Chuyện Cùng Nhân Vật (Mở Cổng)'}
            </Button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {character.tags.map((tag, idx) => (
              <Badge key={idx} variant="tag" className="px-3 py-1 text-xs">
                #{tag}
              </Badge>
            ))}
          </div>

          {/* VĂN ÁN (Strictly Labeled as VĂN ÁN, removing personality/setting/relationship) */}
          <GlassCard className="p-5 sm:p-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              VĂN ÁN
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {character.backstory || 'Chưa có thông tin văn án.'}
            </p>
          </GlassCard>

          {/* Anonymous Comments Section */}
          <CharacterCommentSection characterId={character.id} isAdmin={isAdmin} />

        </div>
      </div>

      {/* Gift Giving Modal */}
      <GiftCharacterModal
        isOpen={giftModalOpen}
        onClose={() => setGiftModalOpen(false)}
        character={character}
        inventory={inventory}
        items={items}
        onGift={onGift}
      />

    </div>
  );
};
