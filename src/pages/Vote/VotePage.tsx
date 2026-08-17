import React from 'react';
import { Character, VoteSetting } from '../../types';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Vote, Sparkles, CheckCircle2, Clock, Lock, Hourglass } from 'lucide-react';

interface VotePageProps {
  characters: Character[];
  onVote: (characterId: string) => void;
  votedIds: string[];
  voteSetting?: VoteSetting;
}

export const VotePage: React.FC<VotePageProps> = ({
  characters,
  onVote,
  votedIds,
  voteSetting
}) => {
  const isVotingOpen = voteSetting?.isOpen ?? false;
  const totalVotes = characters.reduce((acc, c) => acc + (c.voteCount || 0), 0);

  // If Vote feature is unreleased / closed by Owner
  if (!isVotingOpen) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-6">
        <GlassCard className="p-8 sm:p-12 space-y-6 border-indigo-500/20 shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Hourglass className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" /> CHƯA PHÁT HÀNH
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {voteSetting?.title || 'Bình Chọn Nhân Vật Ánh Sao'}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              {voteSetting?.description || 'Tính năng Bình Chọn Nhân Vật Yêu Thích hiện đang được chuẩn bị và sẽ được mở theo các mùa sự kiện đặc biệt.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/15 text-xs text-slate-500 dark:text-slate-400 space-y-1 text-left max-w-md mx-auto">
            <p className="font-semibold text-slate-700 dark:text-slate-300">✦ Thông tin sự kiện:</p>
            <p>• Trạng thái: <strong>Tạm đóng / Chưa mở bình chọn</strong></p>
            {voteSetting?.startDate && <p>• Ngày dự kiến: <strong>{voteSetting.startDate} ~ {voteSetting.endDate}</strong></p>}
            <p>• Hãy theo dõi thông báo từ Mái Hiên để không bỏ lỡ mùa bình chọn tiếp theo!</p>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-semibold">
          <Vote className="w-3.5 h-3.5" /> Vòng Bình Chọn Ánh Sao
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
          {voteSetting?.title || 'Bình Chọn Nhân Vật Yêu Thích'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {voteSetting?.description || 'Hãy trao lá phiếu của bạn cho nhân vật đã mang lại nhiều cảm xúc và sự bình yên nhất dưới hiên nhà.'}
        </p>

        <div className="pt-2 flex items-center justify-center gap-6 text-xs text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Tổng lượt bình chọn: <strong className="text-slate-900 dark:text-white">{totalVotes}</strong>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-emerald-500 font-medium">
            <Clock className="w-3.5 h-3.5" /> Đang mở bình chọn
          </span>
        </div>
      </div>

      {/* Character Voting Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {characters.filter(c => !c.isHidden).map((char) => {
          const charVotes = char.voteCount || 0;
          const votePercentage = totalVotes > 0 ? Math.round((charVotes / totalVotes) * 100) : 0;
          const hasVoted = votedIds.includes(char.id);

          return (
            <GlassCard key={char.id} className="p-4 sm:p-5 flex flex-col justify-between space-y-4">
              <div className="flex items-start gap-3.5">
                <img
                  src={char.avatarUrl}
                  alt={char.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-300/40 dark:ring-indigo-500/30 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 truncate">
                      {char.name}
                    </h3>
                    <Badge variant="gold">{charVotes} phiếu</Badge>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{char.series}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic line-clamp-1 mt-1">
                    "{char.backstory}"
                  </p>
                </div>
              </div>

              {/* Vote Percentage Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  <span>Tỷ lệ ủng hộ</span>
                  <span>{votePercentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${votePercentage}%` }}
                  />
                </div>
              </div>

              {/* Vote Button */}
              <Button
                variant={hasVoted ? 'soft' : 'primary'}
                className="w-full justify-center"
                onClick={() => onVote(char.id)}
                icon={hasVoted ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Vote className="w-4 h-4" />}
              >
                {hasVoted ? 'Đã Gửi Phiếu (Bình chọn thêm)' : 'Bình Chọn Cho Nhân Vật'}
              </Button>
            </GlassCard>
          );
        })}
      </div>

    </div>
  );
};

