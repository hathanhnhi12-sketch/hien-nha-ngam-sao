import React, { useState, useEffect } from 'react';
import { CharacterComment, StickerItem } from '../../types';
import { StorageService } from '../../services/storageService';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { GlassCard } from '../ui/GlassCard';
import { StickerPicker } from '../ui/StickerPicker';
import { ImageLightbox } from '../ui/ImageLightbox';
import { useMinigameStore } from '../../stores/useMinigameStore';
import { AccountService } from '../../services/accountService';
import { toast } from '../../stores/useToastStore';
import { UserAvatar } from '../common/UserAvatar';
import { 
  MessageSquare, 
  Pin, 
  Trash2, 
  EyeOff, 
  Eye, 
  Send, 
  Smile, 
  Image as ImageIcon, 
  X, 
  Upload, 
  Sparkles,
  User
} from 'lucide-react';

interface CharacterCommentSectionProps {
  characterId: string;
  isAdmin: boolean;
}

export const CharacterCommentSection: React.FC<CharacterCommentSectionProps> = ({
  characterId,
  isAdmin
}) => {
  const [comments, setComments] = useState<CharacterComment[]>([]);
  const { profile } = useMinigameStore();
  const [nickname, setNickname] = useState(profile.nickname || '');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedSticker, setSelectedSticker] = useState<StickerItem | null>(null);
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string>('');
  const [isStickerPickerOpen, setIsStickerPickerOpen] = useState(false);
  const [isImageInputOpen, setIsImageInputOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Avatar presets
  const availableAvatars = StorageService.getUserAvatarPresets().filter(p => p.enabled);

  const loadComments = () => {
    setComments(StorageService.getComments(characterId));
  };

  useEffect(() => {
    loadComments();
  }, [characterId]);

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước ảnh đính kèm tối đa 5MB.');
      return;
    }

    // Validate format
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      toast.error('Chỉ chấp nhận file ảnh JPG, PNG, WEBP hoặc GIF.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      setImageUrl(base64);
      toast.success('Đã đính kèm ảnh!');
      setIsImageInputOpen(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !imageUrl && !selectedSticker) {
      toast.error('Vui lòng nhập nội dung, đính kèm ảnh hoặc chọn sticker.');
      return;
    }
    if (content.length > 500) {
      toast.error('Nội dung bình luận tối đa 500 ký tự.');
      return;
    }

    setIsSubmitting(true);
    try {
      StorageService.addComment(
        characterId, 
        nickname.trim() || 'Lữ khách qua đường', 
        content.trim(),
        imageUrl || undefined,
        selectedSticker?.assetUrl,
        selectedSticker?.name,
        selectedAvatarUrl || undefined
      );

      const expConfig = StorageService.getSiteConfig().expConfig;
      if (expConfig && profile.email) {
        AccountService.secureAction(profile.uid, 'add_exp', { amount: expConfig.comment || 5 }).catch(console.error);
      }

      toast.success('Bình luận của bạn đã được gửi đến dưới Mái Hiên ✦');
      setContent('');
      setImageUrl('');
      setSelectedSticker(null);
      loadComments();
    } catch {
      toast.error('Có chút trục trặc, thử lại nhé.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePin = (commentId: string, currentPinned: boolean) => {
    StorageService.updateComment(characterId, commentId, { isPinned: !currentPinned });
    toast.success(currentPinned ? 'Đã bỏ ghim bình luận' : 'Đã ghim bình luận lên đầu ✦');
    loadComments();
  };

  const handleToggleHide = (commentId: string, currentHidden: boolean) => {
    StorageService.updateComment(characterId, commentId, { isHidden: !currentHidden });
    toast.success(currentHidden ? 'Đã hiển thị bình luận' : 'Đã ẩn bình luận');
    loadComments();
  };

  const handleDelete = (commentId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
      StorageService.deleteComment(characterId, commentId);
      toast.success('Đã xóa bình luận');
      loadComments();
    }
  };

  const displayComments = isAdmin ? comments : comments.filter(c => !c.isHidden);
  // Sort pinned first
  const sortedComments = [...displayComments].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.createdAt - a.createdAt;
  });

  return (
    <div className="space-y-6 pt-6 border-t border-indigo-100/40 dark:border-slate-800/80">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-500 dark:text-amber-400" />
          Bình Luận Từ Lữ Khách ({displayComments.length})
        </h3>
        <span className="text-xs text-slate-400">Không cần đăng nhập tài khoản</span>
      </div>

      {/* Anonymous Comment Form */}
      <GlassCard className="p-4 sm:p-5" variant="default">
        <form onSubmit={handleSubmit} className="space-y-3">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex-1 w-full">
              <Input
                label="Biệt danh của bạn"
                placeholder="Ví dụ: Người yêu trăng, Sao băng nhỏ..."
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={30}
              />
            </div>

            {/* Quick avatar selection */}
            {availableAvatars.length > 0 && (
              <div className="w-full sm:w-auto">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Chọn Avatar nhanh
                </label>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-[280px]">
                  <button
                    type="button"
                    onClick={() => setSelectedAvatarUrl('')}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border-2 cursor-pointer transition-all ${
                      selectedAvatarUrl === '' ? 'border-amber-400 bg-amber-400/20' : 'border-transparent bg-slate-200 dark:bg-slate-700'
                    }`}
                    title="Avatar chữ cái ngẫu nhiên"
                  >
                    <User className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  </button>
                  {availableAvatars.slice(0, 6).map((av) => {
                    const presetUrl = av.url || av.avatarUrl || '';
                    const isSelected = selectedAvatarUrl === presetUrl;
                    return (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setSelectedAvatarUrl(presetUrl)}
                        className={`rounded-full p-0.5 transition-all cursor-pointer ${
                          isSelected ? 'ring-2 ring-amber-400 scale-105' : 'opacity-80 hover:opacity-100'
                        }`}
                        title={av.name}
                      >
                        <UserAvatar
                          src={presetUrl}
                          alt={av.name}
                          size="sm"
                          shape="circle"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <Textarea
            label="Nội dung lời nhắn (tối đa 500 ký tự)"
            placeholder="Gửi một lời chào, cảm nghĩ hoặc lời động viên ấm áp tới nhân vật..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            maxLength={500}
          />

          {/* Attached Previews */}
          {(imageUrl || selectedSticker) && (
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              {imageUrl && (
                <div className="relative group">
                  <img
                    src={imageUrl}
                    alt="Đính kèm"
                    className="w-16 h-16 object-cover rounded-lg border border-slate-300 dark:border-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs shadow-md cursor-pointer hover:bg-rose-600"
                    title="Gỡ ảnh"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {selectedSticker && (
                <div className="relative group flex items-center gap-2 p-1 bg-white/60 dark:bg-slate-900/60 rounded-lg">
                  <img
                    src={selectedSticker.assetUrl}
                    alt={selectedSticker.name}
                    className="w-14 h-14 object-contain"
                  />
                  <div className="text-left pr-6">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      {selectedSticker.name}
                    </span>
                    <span className="text-[10px] text-amber-500 font-medium">Sticker biểu cảm</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedSticker(null)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs shadow-md cursor-pointer hover:bg-rose-600"
                    title="Gỡ sticker"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Image URL input popover */}
          {isImageInputOpen && (
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Đính kèm hình ảnh</span>
                <button
                  type="button"
                  onClick={() => setIsImageInputOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Dán link ảnh (https://...)"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                />

                <label className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-indigo-100 transition-colors">
                  <Upload className="w-3.5 h-3.5" /> Tải tệp lên (Max 5MB)
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => setIsStickerPickerOpen(true)}
                icon={<Smile className="w-3.5 h-3.5 text-amber-500" />}
              >
                Sticker / GIF
              </Button>

              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => setIsImageInputOpen(!isImageInputOpen)}
                icon={<ImageIcon className="w-3.5 h-3.5 text-sky-500" />}
              >
                Ảnh đính kèm
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-400">
                {content.length}/500
              </span>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSubmitting || (!content.trim() && !imageUrl && !selectedSticker)}
                icon={<Send className="w-3.5 h-3.5" />}
              >
                Gửi Bình Luận
              </Button>
            </div>
          </div>
        </form>
      </GlassCard>

      {/* Comment List */}
      <div className="space-y-3">
        {sortedComments.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 italic">
            Chưa có bình luận nào. Hãy là người đầu tiên để lại dấu ấn dưới hiên sao nhé ✦
          </div>
        ) : (
          sortedComments.map((comment) => (
            <GlassCard
              key={comment.id}
              className={`p-3.5 sm:p-4 text-left transition-all ${
                comment.isPinned
                  ? 'border-amber-400/50 dark:border-amber-400/40 bg-amber-50/20 dark:bg-amber-950/20 shadow-md'
                  : ''
              } ${comment.isHidden ? 'opacity-50 border-rose-300' : ''}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <UserAvatar
                    src={comment.avatarUrl}
                    alt={comment.nickname}
                    size="sm"
                    shape="circle"
                    ring="amber"
                  />

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {comment.nickname}
                      </span>
                      {comment.isPinned && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-500 bg-amber-400/15 px-2 py-0.5 rounded-full">
                          <Pin className="w-2.5 h-2.5" /> Được ghim
                        </span>
                      )}
                      {comment.isHidden && (
                        <span className="text-[10px] font-semibold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">
                          Đã ẩn
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(comment.createdAt).toLocaleDateString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: 'numeric',
                        month: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                {/* Admin moderation buttons */}
                {isAdmin && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleTogglePin(comment.id, comment.isPinned)}
                      className={`p-1.5 rounded-lg text-xs cursor-pointer ${
                        comment.isPinned ? 'text-amber-500 bg-amber-400/20' : 'text-slate-400 hover:text-amber-500'
                      }`}
                      title={comment.isPinned ? 'Bỏ ghim' : 'Ghim lên đầu'}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleToggleHide(comment.id, comment.isHidden)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 cursor-pointer"
                      title={comment.isHidden ? 'Hiện bình luận' : 'Ẩn bình luận'}
                    >
                      {comment.isHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 cursor-pointer"
                      title="Xóa bình luận"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Text content */}
              {comment.content && (
                <p className="mt-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-10 whitespace-pre-wrap">
                  {comment.content}
                </p>
              )}

              {/* Attached Image or Sticker */}
              {(comment.imageUrl || comment.stickerUrl) && (
                <div className="pl-10 mt-3 flex items-center gap-3">
                  {comment.imageUrl && (
                    <div className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 max-w-[200px] max-h-[160px]">
                      <img
                        src={comment.imageUrl}
                        alt="Đính kèm"
                        className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform"
                        onClick={() => setLightboxImage(comment.imageUrl!)}
                      />
                    </div>
                  )}

                  {comment.stickerUrl && (
                    <div className="flex flex-col items-center">
                      <img
                        src={comment.stickerUrl}
                        alt={comment.stickerName || 'Sticker'}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                      />
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          ))
        )}
      </div>

      {/* Sticker Picker Modal */}
      <StickerPicker
        isOpen={isStickerPickerOpen}
        onClose={() => setIsStickerPickerOpen(false)}
        onSelectSticker={(sticker) => {
          setSelectedSticker(sticker);
          toast.success(`Đã chọn sticker: ${sticker.name}`);
        }}
      />

      {/* Lightbox for clicked images */}
      <ImageLightbox
        isOpen={Boolean(lightboxImage)}
        imageUrl={lightboxImage || ''}
        title="Hình ảnh bình luận"
        onClose={() => setLightboxImage(null)}
      />

    </div>
  );
};
