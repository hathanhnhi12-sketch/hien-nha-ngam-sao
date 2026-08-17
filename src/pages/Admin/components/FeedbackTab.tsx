import React, { useState, useMemo, useEffect } from 'react';
import { Character, FeedbackItem, FeedbackStatus } from '../../../types';
import { StorageService } from '../../../services/storageService';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { Input, Textarea } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { toast } from '../../../stores/useToastStore';
import { 
  MessageSquarePlus, 
  Search, 
  Trash2, 
  Archive, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  MessageCircle, 
  Image as ImageIcon, 
  FileText, 
  Download, 
  Reply, 
  RotateCcw,
  CheckSquare,
  Square,
  Filter,
  CheckCircle,
  Eye
} from 'lucide-react';

interface FeedbackTabProps {
  characters: Character[];
}

export const FeedbackTab: React.FC<FeedbackTabProps> = ({ characters }) => {
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>(() => 
    StorageService.getFeedbackList()
  );

  const [selectedCharFilter, setSelectedCharFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selection for batch actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Reply Modal
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyTargetItem, setReplyTargetItem] = useState<FeedbackItem | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyStatus, setReplyStatus] = useState<FeedbackStatus>('resolved');

  // Lightbox Modal
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const reloadFeedback = () => {
    setFeedbackList(StorageService.getFeedbackList());
  };

  useEffect(() => {
    reloadFeedback();
  }, []);

  // Filtered List
  const filteredList = useMemo(() => {
    return feedbackList.filter(item => {
      // Character filter
      if (selectedCharFilter !== 'all' && item.characterId !== selectedCharFilter) {
        return false;
      }
      // Status filter
      if (selectedStatusFilter !== 'all' && item.status !== selectedStatusFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchContent = item.content.toLowerCase().includes(q);
        const matchNickname = item.nickname.toLowerCase().includes(q);
        const matchChar = item.characterName?.toLowerCase().includes(q);
        const matchReply = item.adminNote?.toLowerCase().includes(q);
        return matchContent || matchNickname || matchChar || matchReply;
      }
      return true;
    });
  }, [feedbackList, selectedCharFilter, selectedStatusFilter, searchQuery]);

  // Counts
  const newCount = feedbackList.filter(f => f.status === 'new').length;
  const reviewingCount = feedbackList.filter(f => f.status === 'reviewing').length;
  const resolvedCount = feedbackList.filter(f => f.status === 'resolved' || f.status === 'fixed').length;
  const archivedCount = feedbackList.filter(f => f.status === 'archived').length;

  // Change single status
  const handleChangeStatus = (id: string, newStatus: FeedbackStatus) => {
    StorageService.updateFeedbackStatus(id, newStatus);
    toast.success(`Đã cập nhật trạng thái góp ý thành: ${newStatus}`);
    reloadFeedback();
  };

  // Open Reply Modal
  const handleOpenReplyModal = (item: FeedbackItem) => {
    setReplyTargetItem(item);
    setReplyText(item.adminNote || '');
    setReplyStatus(item.status);
    setReplyModalOpen(true);
  };

  // Save Reply
  const handleSaveReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyTargetItem) return;

    StorageService.updateFeedbackStatus(
      replyTargetItem.id,
      replyStatus,
      replyText.trim() || undefined
    );

    toast.success('Đã lưu phản hồi của người trông coi!');
    setReplyModalOpen(false);
    reloadFeedback();
  };

  // Delete Single
  const handleDeleteItem = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá vĩnh viễn ý kiến góp ý này?')) {
      StorageService.deleteFeedback(id);
      toast.success('Đã xoá góp ý thành công');
      reloadFeedback();
    }
  };

  // Toggle Selection
  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Select All in current view
  const handleSelectAll = () => {
    if (selectedIds.length === filteredList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredList.map(f => f.id));
    }
  };

  // Batch Status Update
  const handleBatchStatus = (status: FeedbackStatus) => {
    if (selectedIds.length === 0) return;
    selectedIds.forEach(id => {
      StorageService.updateFeedbackStatus(id, status);
    });
    toast.success(`Đã cập nhật ${selectedIds.length} mục sang trạng thái ${status}`);
    setSelectedIds([]);
    reloadFeedback();
  };

  // Batch Delete
  const handleBatchDelete = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Bạn có chắc chắn muốn xoá ${selectedIds.length} mục đã chọn?`)) {
      selectedIds.forEach(id => {
        StorageService.deleteFeedback(id);
      });
      toast.success(`Đã xoá ${selectedIds.length} mục góp ý`);
      setSelectedIds([]);
      reloadFeedback();
    }
  };

  // Reset to initial
  const handleResetFeedback = () => {
    if (window.confirm('Khôi phục danh sách góp ý về dữ liệu mẫu ban đầu?')) {
      StorageService.resetFeedback();
      reloadFeedback();
      toast.success('Đã khôi phục dữ liệu mẫu góp ý thành công');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-emerald-400/20 text-emerald-500 dark:text-emerald-300">
                <MessageSquarePlus className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Quản Lý Ý Kiến Góp Ý & Báo Lỗi
              </h2>
              <Badge variant="gold">FEEDBACK CMS</Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Tiếp nhận, xử lý ý kiến từ người dùng, phản hồi lời nhắn và theo dõi tiến độ sửa lỗi cho từng nhân vật.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleResetFeedback}
              icon={<RotateCcw className="w-4 h-4" />}
            >
              Mặc Định
            </Button>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-200/60 dark:border-slate-800">
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/50 dark:border-indigo-900/50">
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 block">Mới Tiếp Nhận</span>
            <span className="text-xl font-bold text-indigo-900 dark:text-indigo-200">{newCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/50 dark:border-amber-900/50">
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 block">Đang Xem Xét</span>
            <span className="text-xl font-bold text-amber-900 dark:text-amber-200">{reviewingCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-900/50">
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block">Đã Xong / Khắc Phục</span>
            <span className="text-xl font-bold text-emerald-900 dark:text-emerald-200">{resolvedCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-500 block">Lưu Trữ</span>
            <span className="text-xl font-bold text-slate-700 dark:text-slate-300">{archivedCount}</span>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800">
          <div className="w-full md:w-80">
            <Input
              placeholder="Tìm kiếm nội dung, biệt danh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Character Filter */}
            <select
              value={selectedCharFilter}
              onChange={(e) => setSelectedCharFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl border border-transparent focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              <option value="all">Tất cả Nhân Vật ({characters.length})</option>
              {characters.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl border border-transparent focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="new">Mới nhận ({newCount})</option>
              <option value="reviewing">Đang xem xét ({reviewingCount})</option>
              <option value="resolved">Đã tiếp nhận</option>
              <option value="fixed">Đã khắc phục</option>
              <option value="archived">Đã lưu trữ ({archivedCount})</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Batch Action Bar (if items selected) */}
      {selectedIds.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-amber-400 text-slate-950 flex flex-wrap items-center justify-between gap-3 shadow-lg shadow-amber-400/20">
          <div className="flex items-center gap-2 font-bold text-xs">
            <CheckSquare className="w-4 h-4" />
            <span>Đã chọn {selectedIds.length} mục góp ý</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleBatchStatus('reviewing')}
            >
              Xem Xét
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleBatchStatus('resolved')}
            >
              Tiếp Nhận
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleBatchStatus('fixed')}
            >
              Khắc Phục
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleBatchStatus('archived')}
            >
              Lưu Trữ
            </Button>
            <button
              onClick={handleBatchDelete}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Xoá {selectedIds.length} Mục
            </button>
          </div>
        </div>
      )}

      {/* Select all header */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <button
          onClick={handleSelectAll}
          className="flex items-center gap-1.5 font-semibold hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
        >
          {selectedIds.length === filteredList.length && filteredList.length > 0 ? (
            <CheckSquare className="w-4 h-4 text-amber-500" />
          ) : (
            <Square className="w-4 h-4" />
          )}
          <span>Chọn tất cả {filteredList.length} mục hiển thị</span>
        </button>
        <span>Hiển thị {filteredList.length} phản hồi</span>
      </div>

      {/* Feedback List Cards */}
      <div className="space-y-3">
        {filteredList.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-500">
            Không tìm thấy góp ý nào theo tiêu chí đã chọn.
          </div>
        ) : (
          filteredList.map((item) => {
            const targetChar = characters.find(c => c.id === item.characterId);
            const isChecked = selectedIds.includes(item.id);

            return (
              <GlassCard 
                key={item.id} 
                className={`p-5 transition-all space-y-3.5 ${
                  isChecked ? 'ring-2 ring-amber-400 bg-amber-50/20' : ''
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleSelect(item.id)}
                      className="text-slate-400 hover:text-amber-500 cursor-pointer"
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-amber-500" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>

                    {/* Character avatar & name */}
                    <div className="flex items-center gap-2">
                      {targetChar && (
                        <img
                          src={targetChar.avatarUrl}
                          alt={targetChar.name}
                          className="w-7 h-7 rounded-xl object-cover ring-1 ring-amber-400"
                        />
                      )}
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {targetChar?.name || item.characterName || 'Nhân Vật'}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          Gửi bởi: <strong className="text-slate-600 dark:text-slate-300">{item.nickname}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Select */}
                    <select
                      value={item.status}
                      onChange={(e) => handleChangeStatus(item.id, e.target.value as FeedbackStatus)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-xl border-0 cursor-pointer focus:ring-1 focus:ring-amber-400 ${
                        item.status === 'new' ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' :
                        item.status === 'reviewing' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' :
                        item.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                        item.status === 'fixed' ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400' :
                        'bg-slate-500/20 text-slate-500'
                      }`}
                    >
                      <option value="new">✨ Mới Nhận</option>
                      <option value="reviewing">🔍 Đang Xem Xét</option>
                      <option value="resolved">✅ Đã Tiếp Nhận</option>
                      <option value="fixed">🛠️ Đã Khắc Phục</option>
                      <option value="archived">📦 Lưu Trữ</option>
                    </select>

                    <span className="text-[11px] text-slate-400">
                      {new Date(item.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                  {item.content}
                </p>

                {/* Attachments Section */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Attached Image Thumbnail */}
                  {item.imageUrl && (
                    <div 
                      onClick={() => setPreviewImage(item.imageUrl || null)}
                      className="flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-amber-400 transition-colors"
                    >
                      <img src={item.imageUrl} alt="Thumbnail" className="w-10 h-10 rounded-lg object-cover" />
                      <span className="text-[11px] font-semibold text-amber-500 pr-2">Xem ảnh</span>
                    </div>
                  )}

                  {/* Attached File */}
                  {item.file && (
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                      <FileText className="w-4 h-4 text-indigo-500" />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {item.file.name} ({formatFileSize(item.file.size)})
                      </span>
                      {item.file.dataUrl && (
                        <a 
                          href={item.file.dataUrl} 
                          download={item.file.name} 
                          className="text-indigo-500 font-bold hover:underline pl-1"
                        >
                          Tải về
                        </a>
                      )}
                    </div>
                  )}

                  {/* Attached Sticker */}
                  {item.stickerUrl && (
                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800">
                      <img src={item.stickerUrl} alt="Sticker" className="w-8 h-8 object-contain" />
                      <span className="text-[11px] font-semibold text-amber-900 dark:text-amber-300 pr-2">
                        {item.stickerName || 'Sticker'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Existing Admin Reply */}
                {item.adminNote && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 text-xs space-y-1">
                    <div className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                      <Sparkles className="w-3 h-3" />
                      <span>Phản hồi của Admin:</span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed pl-4">
                      {item.adminNote}
                    </p>
                  </div>
                )}

                {/* Bottom Actions Row */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    variant="gold"
                    size="sm"
                    onClick={() => handleOpenReplyModal(item)}
                    icon={<Reply className="w-3.5 h-3.5" />}
                  >
                    {item.adminNote ? 'Sửa Phản Hồi' : 'Trả Lời / Ghi Chú'}
                  </Button>

                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    title="Xoá ý kiến này"
                    className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </GlassCard>
            );
          })
        )}
      </div>

      {/* MODAL: ADMIN REPLY */}
      <Modal
        isOpen={replyModalOpen}
        onClose={() => setReplyModalOpen(false)}
        title="✦ Phản Hồi Ý Kiến Góp Ý"
        maxWidth="md"
      >
        {replyTargetItem && (
          <form onSubmit={handleSaveReply} className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <span className="font-bold text-slate-500 block mb-1">Ý kiến của {replyTargetItem.nickname}:</span>
              <p className="text-slate-800 dark:text-slate-200 italic line-clamp-3">
                "{replyTargetItem.content}"
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Cập nhật trạng thái xử lý
              </label>
              <select
                value={replyStatus}
                onChange={(e) => setReplyStatus(e.target.value as FeedbackStatus)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer"
              >
                <option value="new">✨ Mới Nhận</option>
                <option value="reviewing">🔍 Đang Xem Xét</option>
                <option value="resolved">✅ Đã Tiếp Nhận & Trả Lời</option>
                <option value="fixed">🛠️ Đã Khắc Phục</option>
                <option value="archived">📦 Lưu Trữ</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Nội dung phản hồi công khai từ người trông coi mái hiên
              </label>
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Nhập lời cảm ơn hoặc thông tin cập nhật cho người dùng..."
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200/60 dark:border-slate-800">
              <Button variant="secondary" type="button" onClick={() => setReplyModalOpen(false)}>
                Hủy
              </Button>
              <Button variant="gold" type="submit">
                Lưu & Hiển Thị Phản Hồi
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* LIGHTBOX MODAL */}
      <Modal
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
        title="✦ Hình Ảnh Đính Kèm"
        maxWidth="lg"
      >
        {previewImage && (
          <div className="flex justify-center p-2">
            <img
              src={previewImage}
              alt="Expanded"
              className="max-h-[75vh] w-auto rounded-2xl object-contain shadow-2xl"
            />
          </div>
        )}
      </Modal>

    </div>
  );
};
