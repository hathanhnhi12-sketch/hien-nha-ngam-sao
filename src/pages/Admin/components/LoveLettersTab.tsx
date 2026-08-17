import React, { useState } from 'react';
import { LoveLetter } from '../../../types';
import { StorageService } from '../../../services/storageService';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { Textarea } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { ImageLightbox } from '../../../components/ui/ImageLightbox';
import { toast } from '../../../stores/useToastStore';
import { 
  HeartHandshake, 
  MessageCircle, 
  Trash2, 
  Heart,
  Clock,
  User,
  Image as ImageIcon,
  Smile,
  CheckCircle2,
  Mail,
  MailOpen,
  Archive,
  ArchiveRestore,
  Search,
  Filter,
  Eye
} from 'lucide-react';

interface LoveLettersTabProps {
  loveLetters: LoveLetter[];
  onReplyLetter: (id: string, reply: string) => void;
  onDeleteLetter: (id: string) => void;
  onRefresh?: () => void;
}

export const LoveLettersTab: React.FC<LoveLettersTabProps> = ({
  loveLetters,
  onReplyLetter,
  onDeleteLetter,
  onRefresh
}) => {
  const [replyingLetter, setReplyingLetter] = useState<LoveLetter | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'read' | 'archived' | 'media'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const handleOpenReply = (letter: LoveLetter) => {
    setReplyingLetter(letter);
    setReplyContent(letter.reply || letter.replyFromAdmin || '');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingLetter) return;

    onReplyLetter(replyingLetter.id, replyContent.trim());
    StorageService.markLoveLetterRead(replyingLetter.id, true);
    toast.success('✦ Đã gửi hồi âm của Người Trông Coi đến lữ khách!');
    setReplyingLetter(null);
    if (onRefresh) onRefresh();
  };

  const handleToggleRead = (id: string, currentRead: boolean) => {
    StorageService.markLoveLetterRead(id, !currentRead);
    toast.success(currentRead ? 'Đã đánh dấu là chưa đọc.' : 'Đã đánh dấu là đã đọc.');
    if (onRefresh) onRefresh();
  };

  const handleToggleArchive = (id: string, currentArchived: boolean) => {
    StorageService.toggleArchiveLoveLetter(id);
    toast.success(currentArchived ? 'Đã chuyển ra khỏi mục lưu trữ.' : 'Đã lưu trữ lá thư.');
    if (onRefresh) onRefresh();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Cậu có chắc muốn xoá lá thư tâm tình này vĩnh viễn không?')) {
      onDeleteLetter(id);
      toast.success('Đã xoá lá thư.');
      if (onRefresh) onRefresh();
    }
  };

  // Stats calculation
  const totalLetters = loveLetters.length;
  const unreadCount = loveLetters.filter(l => l.isRead === false).length;
  const archivedCount = loveLetters.filter(l => l.isArchived === true).length;
  const withMediaCount = loveLetters.filter(l => Boolean(l.imageUrl || l.stickerUrl)).length;

  const filteredLetters = loveLetters.filter((letter) => {
    // Filter condition
    if (activeFilter === 'unread' && letter.isRead !== false) return false;
    if (activeFilter === 'read' && letter.isRead === false) return false;
    if (activeFilter === 'archived' && !letter.isArchived) return false;
    if (activeFilter === 'media' && !letter.imageUrl && !letter.stickerUrl) return false;
    if (activeFilter !== 'archived' && letter.isArchived) return false; // don't show archived in other views

    // Search condition
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      const matchAuthor = (letter.author || letter.senderName || '').toLowerCase().includes(q);
      const matchTo = (letter.toCharacter || '').toLowerCase().includes(q);
      const matchContent = letter.content.toLowerCase().includes(q);
      if (!matchAuthor && !matchTo && !matchContent) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header & Stats */}
      <GlassCard className="p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-600 text-white flex items-center justify-center font-bold shadow-lg shadow-rose-500/20 shrink-0">
              <HeartHandshake className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                Hộp Thư Yêu Thương (Admin Inbox)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hộp thư riêng tư lưu trữ và quản lý tất cả những lời tâm sự, đính kèm hình ảnh và sticker từ lữ khách.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-800">
              Chưa đọc: {unreadCount}
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold">
              Tổng thư: {totalLetters}
            </div>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Hộp thư đến ({totalLetters - archivedCount})
            </button>

            <button
              onClick={() => setActiveFilter('unread')}
              className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
                activeFilter === 'unread'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Chưa đọc</span>
              <span className="font-bold text-[10px]">({unreadCount})</span>
            </button>

            <button
              onClick={() => setActiveFilter('read')}
              className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
                activeFilter === 'read'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <MailOpen className="w-3.5 h-3.5" />
              <span>Đã đọc</span>
            </button>

            <button
              onClick={() => setActiveFilter('media')}
              className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
                activeFilter === 'media'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Có đính kèm ({withMediaCount})</span>
            </button>

            <button
              onClick={() => setActiveFilter('archived')}
              className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
                activeFilter === 'archived'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Lưu trữ ({archivedCount})</span>
            </button>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm thư theo tên, nội dung..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>
        </div>
      </GlassCard>

      {/* Letters List */}
      <div className="space-y-4">
        {filteredLetters.length === 0 ? (
          <GlassCard className="p-12 text-center text-slate-400 space-y-2">
            <Mail className="w-8 h-8 mx-auto opacity-30" />
            <p className="text-sm font-medium">Không có lá thư nào trong mục này</p>
          </GlassCard>
        ) : (
          filteredLetters.map((letter) => {
            const isUnread = letter.isRead === false;
            return (
              <GlassCard
                key={letter.id}
                className={`p-5 space-y-3.5 transition-all ${
                  isUnread
                    ? 'border-rose-400/80 bg-rose-50/15 dark:bg-rose-950/15 ring-2 ring-rose-400/30'
                    : ''
                }`}
              >
                {/* Letter Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 flex-wrap">
                    {isUnread && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold animate-pulse">
                        MỚI
                      </span>
                    )}

                    <span className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-rose-500" />
                      {letter.author || letter.senderName || 'Lữ khách ẩn danh'}
                    </span>

                    {letter.toCharacter && (
                      <span className="text-xs text-amber-500 font-semibold bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                        Gửi tới: {letter.toCharacter}
                      </span>
                    )}

                    {letter.mood && (
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        Tâm trạng: {letter.mood}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(letter.createdAt).toLocaleString('vi-VN')}
                    </span>
                    <span className="flex items-center gap-1 text-rose-500 font-bold">
                      <Heart className="w-3.5 h-3.5 fill-rose-500" />
                      {letter.likes || 0}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic bg-slate-50 dark:bg-slate-850/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 whitespace-pre-wrap">
                  "{letter.content}"
                </p>

                {/* Attached Image or Sticker */}
                {(letter.imageUrl || letter.stickerUrl) && (
                  <div className="flex items-center gap-3 pt-1">
                    {letter.imageUrl && (
                      <div className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 w-24 h-24 sm:w-32 sm:h-32 shrink-0">
                        <img
                          src={letter.imageUrl}
                          alt="Attached media"
                          className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform"
                          onClick={() => setLightboxImage(letter.imageUrl!)}
                        />
                        <div
                          onClick={() => setLightboxImage(letter.imageUrl!)}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold cursor-pointer transition-opacity"
                        >
                          <Eye className="w-4 h-4 mr-1" /> Xem ảnh
                        </div>
                      </div>
                    )}

                    {letter.stickerUrl && (
                      <div className="flex flex-col items-center p-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                        <img
                          src={letter.stickerUrl}
                          alt={letter.stickerName || 'Sticker'}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                        />
                        {letter.stickerName && (
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                            {letter.stickerName}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Existing Admin Reply */}
                {(letter.reply || letter.replyFromAdmin) && (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
                    <span className="font-bold text-amber-500 flex items-center gap-1">
                      ✦ Hồi âm từ Người Trông Coi:
                    </span>
                    <p className="text-slate-700 dark:text-slate-200 italic whitespace-pre-wrap">
                      {letter.reply || letter.replyFromAdmin}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleRead(letter.id, letter.isRead !== false)}
                      className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                    >
                      {letter.isRead === false ? (
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Đánh dấu đã đọc
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" /> Đánh dấu chưa đọc
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => handleToggleArchive(letter.id, letter.isArchived === true)}
                      className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer ml-3"
                    >
                      {letter.isArchived ? (
                        <span className="flex items-center gap-1">
                          <ArchiveRestore className="w-3.5 h-3.5" /> Khôi phục hộp thư
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Archive className="w-3.5 h-3.5" /> Lưu trữ
                        </span>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="xs"
                      variant="secondary"
                      onClick={() => handleOpenReply(letter)}
                      icon={<MessageCircle className="w-3 h-3" />}
                    >
                      {(letter.reply || letter.replyFromAdmin) ? 'Sửa Hồi Âm' : 'Viết Hồi Âm'}
                    </Button>

                    <Button
                      size="xs"
                      variant="danger"
                      onClick={() => handleDelete(letter.id)}
                      icon={<Trash2 className="w-3 h-3" />}
                    >
                      Xoá
                    </Button>
                  </div>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>

      {/* Reply Modal */}
      {replyingLetter && (
        <Modal
          isOpen={true}
          onClose={() => setReplyingLetter(null)}
          maxWidth="md"
          title="✦ Viết Lời Hồi Âm Từ Người Trông Coi"
        >
          <form onSubmit={handleSendReply} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-xs space-y-1">
              <span className="font-semibold text-slate-500">
                Thư từ: {replyingLetter.author || replyingLetter.senderName || 'Lữ khách'}
              </span>
              <p className="text-slate-700 dark:text-slate-300 italic line-clamp-3">
                "{replyingLetter.content}"
              </p>
            </div>

            <Textarea
              label="Nội dung hồi âm ấm áp"
              placeholder="Gửi đến cậu những cái ôm nhẹ nhàng dưới bầu trời đêm..."
              rows={4}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              required
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setReplyingLetter(null)}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={!replyContent.trim()}
              >
                Gửi Lời Hồi Âm
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Lightbox */}
      <ImageLightbox
        isOpen={Boolean(lightboxImage)}
        imageUrl={lightboxImage || ''}
        title="Hình ảnh đính kèm trong thư"
        onClose={() => setLightboxImage(null)}
      />

    </div>
  );
};
