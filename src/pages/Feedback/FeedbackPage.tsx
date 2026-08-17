import React, { useState, useMemo, useEffect } from 'react';
import { Character, FeedbackItem, FeedbackStatus, StickerItem, UserProfile } from '../../types';
import { StorageService } from '../../services/storageService';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { StickerPicker } from '../../components/ui/StickerPicker';
import { Modal } from '../../components/ui/Modal';
import { toast } from '../../stores/useToastStore';
import { 
  MessageSquarePlus, 
  Send, 
  Sparkles, 
  Image as ImageIcon, 
  FileText, 
  Smile, 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Download, 
  MessageCircle, 
  User, 
  Paperclip,
  CheckCircle,
  HelpCircle,
  Search,
  Filter
} from 'lucide-react';

interface FeedbackPageProps {
  characters: Character[];
  userProfile?: UserProfile;
  onNavigateCharacter?: (character: Character) => void;
}

export const FeedbackPage: React.FC<FeedbackPageProps> = ({
  characters,
  userProfile,
  onNavigateCharacter
}) => {
  // Published characters
  const publishedCharacters = useMemo(() => {
    return characters.filter(c => !c.isHidden);
  }, [characters]);

  // Selected Character filter ('all' or char.id)
  const [selectedCharId, setSelectedCharId] = useState<string>('all');

  // Feedback list state
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>(() => 
    StorageService.getFeedbackList()
  );

  const reloadFeedback = () => {
    setFeedbackList(StorageService.getFeedbackList());
  };

  useEffect(() => {
    reloadFeedback();
  }, []);

  // Form State
  const [formCharId, setFormCharId] = useState<string>(
    publishedCharacters[0]?.id || 'char_1'
  );
  const [nickname, setNickname] = useState<string>(
    userProfile?.displayName || ''
  );
  const [content, setContent] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    size: number;
    type: string;
    dataUrl?: string;
  } | null>(null);
  const [selectedSticker, setSelectedSticker] = useState<StickerItem | null>(null);
  const [isStickerPickerOpen, setIsStickerPickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null);

  // Sync default formCharId if filter changes
  useEffect(() => {
    if (selectedCharId !== 'all') {
      setFormCharId(selectedCharId);
    }
  }, [selectedCharId]);

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước ảnh tối đa là 5MB.');
      return;
    }

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      toast.error('Vui lòng chọn tệp hình ảnh định dạng JPG, PNG, WEBP hoặc GIF.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      setImageUrl(base64);
      toast.success('Đã tải lên hình ảnh đính kèm!');
    };
    reader.readAsDataURL(file);
  };

  // Handle Document / Log File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Kích thước tệp đính kèm tối đa là 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setAttachedFile({
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        dataUrl
      });
      toast.success(`Đã đính kèm tệp: ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  // Submit Feedback
  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !imageUrl && !attachedFile && !selectedSticker) {
      toast.error('Vui lòng nhập nội dung góp ý, đính kèm hình ảnh hoặc sticker.');
      return;
    }

    setIsSubmitting(true);

    const targetChar = characters.find(c => c.id === formCharId);

    const newFeedback: FeedbackItem = {
      id: `fb_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      characterId: formCharId,
      characterName: targetChar?.name || 'Nhân Vật',
      nickname: nickname.trim() || 'Lữ Khách Phương Xa',
      content: content.trim(),
      imageUrl: imageUrl || undefined,
      file: attachedFile || undefined,
      stickerUrl: selectedSticker?.assetUrl,
      stickerName: selectedSticker?.name,
      status: 'new',
      isRead: false,
      createdAt: Date.now()
    };

    StorageService.saveFeedback(newFeedback);
    setIsSubmitting(false);
    toast.star('Cảm ơn bạn! Ý kiến đóng góp đã được gửi tới người trông coi mái hiên ✦');

    // Reset Form
    setContent('');
    setImageUrl('');
    setAttachedFile(null);
    setSelectedSticker(null);
    reloadFeedback();
  };

  // Filtered feedback list
  const filteredFeedback = useMemo(() => {
    return feedbackList.filter(item => {
      // Exclude archived from public view
      if (item.status === 'archived') return false;

      if (selectedCharId !== 'all' && item.characterId !== selectedCharId) {
        return false;
      }
      return true;
    });
  }, [feedbackList, selectedCharId]);

  // Status helper
  const renderStatusBadge = (status: FeedbackStatus) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20">
            <Sparkles className="w-3 h-3 text-indigo-400" /> Mới Nhận
          </span>
        );
      case 'reviewing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/20">
            <Clock className="w-3 h-3 text-amber-400" /> Đang Xem Xét
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Đã Tiếp Nhận
          </span>
        );
      case 'fixed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/20">
            <CheckCircle className="w-3 h-3 text-purple-400" /> Đã Khắc Phục
          </span>
        );
      default:
        return null;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} ngày trước`;
    return new Date(timestamp).toLocaleDateString('vi-VN');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
      
      {/* Top Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-semibold backdrop-blur-md">
          <MessageSquarePlus className="w-3.5 h-3.5" /> Bảng Góp Ý & Báo Lỗi Trực Tiếp
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Hòm Thư Góp Ý Nhân Vật
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Hãy chia sẻ cảm nhận, ý tưởng phát triển cốt truyện, hoặc thông báo lỗi bạn gặp phải khi trò chuyện cùng nhân vật. Mọi ý kiến đều được người trông coi lắng nghe và tiếp nhận ✦
        </p>
      </div>

      {/* HORIZONTAL CHARACTER SELECTION BAR */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-amber-500" />
            Chọn nhân vật để xem & gửi góp ý:
          </span>
          {selectedCharId !== 'all' && (
            <button
              onClick={() => setSelectedCharId('all')}
              className="text-amber-500 hover:text-amber-600 dark:text-amber-400 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Xem tất cả
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-none">
          {/* ALL CHARACTERS PILL */}
          <button
            onClick={() => setSelectedCharId('all')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              selectedCharId === 'all'
                ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 scale-105 ring-2 ring-amber-400/50'
                : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-slate-950/20 flex items-center justify-center font-bold">
              ✦
            </div>
            <span>Tất Cả Nhân Vật</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              selectedCharId === 'all'
                ? 'bg-slate-950/20 text-slate-950 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}>
              {feedbackList.filter(f => f.status !== 'archived').length}
            </span>
          </button>

          {/* DYNAMIC CHARACTER PILLS */}
          {publishedCharacters.map((char) => {
            const isSelected = selectedCharId === char.id;
            const count = feedbackList.filter(f => f.characterId === char.id && f.status !== 'archived').length;
            return (
              <button
                key={char.id}
                onClick={() => setSelectedCharId(char.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 scale-105 ring-2 ring-amber-400/50 font-bold'
                    : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800'
                }`}
              >
                <img
                  src={char.avatarUrl}
                  alt={char.name}
                  className="w-6 h-6 rounded-xl object-cover ring-1 ring-slate-300 dark:ring-slate-700"
                />
                <span>{char.name}</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: SUBMISSION FORM (5 COLUMNS) */}
        <div className="lg:col-span-5 sticky top-24">
          <GlassCard className="p-6 space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 dark:border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <MessageSquarePlus className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Gửi Ý Kiến Mới
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Góp ý, đề xuất tính năng hoặc báo lỗi hội thoại
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              {/* Target Character Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Nhân vật cần góp ý <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formCharId}
                  onChange={(e) => setFormCharId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer"
                >
                  {publishedCharacters.map((char) => (
                    <option key={char.id} value={char.id}>
                      {char.name} {char.series ? `(${char.series})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nickname */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Biệt danh của bạn (Tùy chọn)
                </label>
                <Input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Lữ Khách Phương Xa"
                  icon={<User className="w-4 h-4" />}
                />
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                  ✦ Tuyệt đối bảo mật: Email & tài khoản cá nhân của bạn không bao giờ hiển thị công khai.
                </span>
              </div>

              {/* Content Textarea */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Nội dung phản hồi / Góp ý / Báo lỗi <span className="text-rose-500">*</span>
                </label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Nhập cảm nhận về nhân vật, đoạn hội thoại bị lỗi, hoặc ý tưởng mà bạn muốn bổ sung..."
                  rows={4}
                  required
                />
              </div>

              {/* Attached Preview Areas */}
              {/* Image Preview */}
              {imageUrl && (
                <div className="relative rounded-2xl overflow-hidden border border-amber-400/50 bg-slate-950/20 p-2">
                  <div className="flex items-center justify-between text-xs text-amber-500 font-semibold mb-1.5 px-1">
                    <span className="flex items-center gap-1"><ImageIcon className="w-3.5 h-3.5" /> Ảnh đính kèm</span>
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="text-slate-400 hover:text-rose-500 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full max-h-48 object-cover rounded-xl"
                  />
                </div>
              )}

              {/* File Info Preview */}
              {attachedFile && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/60">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-500 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {attachedFile.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {formatFileSize(attachedFile.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAttachedFile(null)}
                    className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Sticker Preview */}
              {selectedSticker && (
                <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800">
                  <div className="flex items-center gap-2">
                    <img src={selectedSticker.assetUrl} alt={selectedSticker.name} className="w-10 h-10 object-contain rounded-lg" />
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-300">{selectedSticker.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedSticker(null)}
                    className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Attachment Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {/* Image Upload Input */}
                <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer transition-all">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                  <span>Ảnh</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {/* File Upload Input */}
                <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer transition-all">
                  <Paperclip className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Tệp</span>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Sticker Picker Button */}
                <button
                  type="button"
                  onClick={() => setIsStickerPickerOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer transition-all"
                >
                  <Smile className="w-3.5 h-3.5 text-pink-500" />
                  <span>Sticker / GIF</span>
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="gold"
                className="w-full py-3"
                disabled={isSubmitting}
                icon={<Send className="w-4 h-4" />}
              >
                Gửi Ý Kiến Góp Ý
              </Button>
            </form>
          </GlassCard>
        </div>

        {/* RIGHT COLUMN: FEEDBACK CARDS LIST (7 COLUMNS) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-amber-500" />
              <span>Ý Kiến & Phản Hồi Đã Gửi</span>
              <span className="text-xs font-normal text-slate-500">
                ({filteredFeedback.length})
              </span>
            </h3>
          </div>

          {filteredFeedback.length === 0 ? (
            <GlassCard className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-500 flex items-center justify-center mx-auto">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Chưa có phản hồi nào cho mục này
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Hãy là người đầu tiên để lại ý kiến đóng góp hoặc gửi lời nhắn cho nhân vật nhé!
              </p>
            </GlassCard>
          ) : (
            filteredFeedback.map((item) => {
              const targetChar = characters.find(c => c.id === item.characterId);
              return (
                <GlassCard key={item.id} className="p-5 space-y-3 transition-all hover:shadow-md">
                  
                  {/* Top Bar: Character & Nickname & Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      {targetChar ? (
                        <div 
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-bold cursor-pointer hover:bg-amber-100 dark:hover:bg-slate-700 transition-colors"
                          onClick={() => onNavigateCharacter && onNavigateCharacter(targetChar)}
                        >
                          <img
                            src={targetChar.avatarUrl}
                            alt={targetChar.name}
                            className="w-5 h-5 rounded-lg object-cover ring-1 ring-amber-400"
                          />
                          <span>{targetChar.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-amber-500">
                          {item.characterName || 'Nhân Vật'}
                        </span>
                      )}

                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        từ <strong className="text-slate-900 dark:text-white">{item.nickname}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {renderStatusBadge(item.status)}
                      <span className="text-[11px] text-slate-400">
                        {formatTimeAgo(item.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Feedback Text Content */}
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {item.content}
                  </p>

                  {/* Attached Image */}
                  {item.imageUrl && (
                    <div className="pt-1">
                      <img
                        src={item.imageUrl}
                        alt="Đính kèm"
                        onClick={() => setPreviewModalImage(item.imageUrl || null)}
                        className="max-h-56 rounded-2xl object-cover cursor-pointer hover:opacity-90 transition-opacity border border-slate-200 dark:border-slate-700 shadow-sm"
                      />
                    </div>
                  )}

                  {/* Attached File */}
                  {item.file && (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                        <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                          {item.file.name}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          ({formatFileSize(item.file.size)})
                        </span>
                      </div>
                      {item.file.dataUrl && (
                        <a
                          href={item.file.dataUrl}
                          download={item.file.name}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-100 transition-colors"
                        >
                          <Download className="w-3 h-3" />
                          <span>Tải tệp</span>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Attached Sticker */}
                  {item.stickerUrl && (
                    <div className="pt-1 flex items-center gap-2">
                      <img
                        src={item.stickerUrl}
                        alt={item.stickerName || 'Sticker'}
                        className="w-14 h-14 object-contain"
                      />
                      {item.stickerName && (
                        <span className="text-[11px] font-medium text-slate-400">
                          ✦ {item.stickerName}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Creator / Admin Note Response */}
                  {item.adminNote && (
                    <div className="mt-3 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Lời nhắn từ Người Trông Coi Mái Hiên:</span>
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 leading-relaxed pl-5">
                        {item.adminNote}
                      </p>
                    </div>
                  )}

                </GlassCard>
              );
            })
          )}
        </div>

      </div>

      {/* STICKER PICKER POPUP */}
      <StickerPicker
        isOpen={isStickerPickerOpen}
        onClose={() => setIsStickerPickerOpen(false)}
        onSelectSticker={(sticker) => setSelectedSticker(sticker)}
      />

      {/* IMAGE EXPAND MODAL */}
      <Modal
        isOpen={!!previewModalImage}
        onClose={() => setPreviewModalImage(null)}
        title="✦ Hình Ảnh Đính Kèm"
        maxWidth="lg"
      >
        {previewModalImage && (
          <div className="flex justify-center p-2">
            <img
              src={previewModalImage}
              alt="Expanded"
              className="max-h-[75vh] w-auto rounded-2xl object-contain shadow-2xl"
            />
          </div>
        )}
      </Modal>

    </div>
  );
};
