import React, { useState, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { UserAvatar } from './UserAvatar';
import { UserAvatarPreset } from '../../types';
import { StorageService } from '../../services/storageService';
import { toast } from '../../stores/useToastStore';
import { isGifUrl, normalizeAvatarUrl } from '../../utils/avatarUtils';
import { 
  Upload, 
  Link as LinkIcon, 
  Sparkles, 
  Check, 
  Image as ImageIcon,
  CheckCircle2,
  RefreshCw,
  FolderHeart
} from 'lucide-react';

interface AvatarPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatarUrl: string;
  onSelectAvatar: (url: string) => void;
  title?: string;
}

export const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({
  isOpen,
  onClose,
  currentAvatarUrl,
  onSelectAvatar,
  title = '✦ CHỌN HÌNH ĐẠI DIỆN LỮ KHÁCH'
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'upload' | 'url'>('presets');
  const [selectedUrl, setSelectedUrl] = useState<string>(currentAvatarUrl || '');
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [uploadPreview, setUploadPreview] = useState<string>('');
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const presets: UserAvatarPreset[] = StorageService.getUserAvatarPresets().filter(p => p.enabled);

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước ảnh tối đa là 5MB.');
      return;
    }

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Định dạng tệp không được hỗ trợ. Vui lòng chọn PNG, JPG, WEBP hoặc GIF.');
      return;
    }

    setIsProcessingUpload(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setUploadPreview(dataUrl);
      setSelectedUrl(dataUrl);
      setIsProcessingUpload(false);
      toast.success('Đã tải ảnh lên thành công! Nhấn "Áp Dụng" để lưu.');
    };
    reader.onerror = () => {
      setIsProcessingUpload(false);
      toast.error('Không thể đọc tệp ảnh.');
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    const cleanUrl = normalizeAvatarUrl(customUrlInput);
    if (!cleanUrl) {
      toast.error('Vui lòng nhập đường dẫn hình ảnh hợp lệ.');
      return;
    }
    setSelectedUrl(cleanUrl);
    toast.success('Đã nhận diện đường dẫn ảnh.');
  };

  const handleConfirm = () => {
    if (!selectedUrl) {
      toast.error('Vui lòng chọn hoặc tải lên một hình ảnh.');
      return;
    }
    onSelectAvatar(selectedUrl);
    toast.star('Đã cập nhật hình đại diện thành công ✦');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg" title={title}>
      <div className="space-y-5">
        
        {/* Current Active Preview Header */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/40 border border-indigo-500/20">
          <div className="flex items-center gap-3">
            <UserAvatar
              src={selectedUrl || currentAvatarUrl}
              size="xl"
              shape="rounded"
              ring="gold"
            />
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Avatar Đang Chọn</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Ảnh này sẽ đồng bộ trên toàn bộ hồ sơ, bình luận và xếp hạng của bạn.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleConfirm}
            icon={<CheckCircle2 className="w-4 h-4" />}
          >
            Áp Dụng Avatar
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-indigo-100/60 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'presets'
                ? 'border-indigo-600 dark:border-amber-400 text-indigo-600 dark:text-amber-300'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FolderHeart className="w-3.5 h-3.5" />
            Mẫu Thư Viện ({presets.length})
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'upload'
                ? 'border-indigo-600 dark:border-amber-400 text-indigo-600 dark:text-amber-300'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Tải Từ Thiết Bị
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'url'
                ? 'border-indigo-600 dark:border-amber-400 text-indigo-600 dark:text-amber-300'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            Dán URL Trực Tiếp
          </button>
        </div>

        {/* Tab 1: Presets from Admin Library */}
        {activeTab === 'presets' && (
          <div className="space-y-3">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Nhấp vào một avatar mẫu bên dưới để chọn:
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5 max-h-64 overflow-y-auto p-1 custom-scrollbar">
              {presets.map((preset) => {
                const presetUrl = preset.url || preset.avatarUrl || preset.imageUrl || '';
                const isSelected = selectedUrl === presetUrl;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedUrl(presetUrl)}
                    className={`group relative flex flex-col items-center justify-center p-1 rounded-2xl transition-all cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-amber-400 scale-105 bg-amber-400/10 shadow-md'
                        : 'opacity-80 hover:opacity-100 hover:scale-105 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                    title={preset.name}
                  >
                    <UserAvatar
                      src={presetUrl}
                      alt={preset.name}
                      size="xl"
                      shape="rounded"
                      badge={preset.badge}
                      isGif={preset.type === 'gif' || isGifUrl(presetUrl)}
                    />
                    
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}

                    <span className="text-[9px] font-semibold text-slate-600 dark:text-slate-300 truncate w-full text-center mt-1">
                      {preset.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Upload from Device */}
        {activeTab === 'upload' && (
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-indigo-200 dark:border-indigo-800 hover:border-indigo-400 dark:hover:border-indigo-600 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-indigo-50/30 dark:bg-indigo-950/20"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                className="hidden"
              />
              
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-amber-400 flex items-center justify-center shadow-inner">
                  {isProcessingUpload ? (
                    <RefreshCw className="w-6 h-6 animate-spin" />
                  ) : (
                    <Upload className="w-6 h-6" />
                  )}
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {isProcessingUpload ? 'Đang đọc tệp...' : 'Bấm vào đây để chọn ảnh từ máy tính hoặc điện thoại'}
                </div>
                <p className="text-[11px] text-slate-400">
                  Hỗ trợ định dạng PNG, JPG, JPEG, WEBP và ảnh GIF động (tối đa 5MB).
                </p>
              </div>
            </div>

            {uploadPreview && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    src={uploadPreview}
                    size="lg"
                    shape="rounded"
                    ring="gold"
                  />
                  <div>
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ảnh tải lên đã sẵn sàng</span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Đã hiển thị xem trước theo tỷ lệ chuẩn.
                    </span>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Chọn Tệp Khác
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Direct URL Input */}
        {activeTab === 'url' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                label="Đường dẫn ảnh trực tiếp (Image URL)"
                placeholder="https://res.cloudinary.com/... hoặc link ảnh PNG, JPG, GIF..."
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                icon={<LinkIcon className="w-4 h-4" />}
                helperText="Hỗ trợ link Cloudinary, Imgur, Tenor, Discord CDN, URL có token..."
              />
              <div className="flex justify-end">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleApplyUrl}
                  disabled={!customUrlInput.trim()}
                >
                  Kiểm Tra & Chọn Link Này
                </Button>
              </div>
            </div>

            {selectedUrl && activeTab === 'url' && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-3">
                <UserAvatar
                  src={selectedUrl}
                  size="lg"
                  shape="rounded"
                  ring="gold"
                />
                <div className="truncate flex-1">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    Xem trước từ URL
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {selectedUrl}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            {selectedUrl ? '✦ Đã chọn 1 hình đại diện' : 'Chưa chọn hình ảnh'}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={onClose}>
              Đóng
            </Button>
            <Button variant="primary" onClick={handleConfirm}>
              Xác Nhận & Lưu
            </Button>
          </div>
        </div>

      </div>
    </Modal>
  );
};
