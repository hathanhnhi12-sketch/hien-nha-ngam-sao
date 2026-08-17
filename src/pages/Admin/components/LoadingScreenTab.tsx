import React, { useState, useEffect } from 'react';
import { LoadingAnimationAsset, LoadingConfig } from '../../../types';
import { StorageService } from '../../../services/storageService';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { MediaUploader } from '../../../components/ui/MediaUploader';
import { Modal } from '../../../components/ui/Modal';
import { toast } from '../../../stores/useToastStore';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Eye, 
  Sliders, 
  RefreshCw,
  Film,
  Star
} from 'lucide-react';

export const LoadingScreenTab: React.FC = () => {
  const [animations, setAnimations] = useState<LoadingAnimationAsset[]>(() => StorageService.getLoadingAnimations());
  const [siteConfig, setSiteConfig] = useState(() => StorageService.getSiteConfig());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewAnimation, setPreviewAnimation] = useState<LoadingAnimationAsset | null>(null);

  // New animation form state
  const [name, setName] = useState('');
  const [assetUrl, setAssetUrl] = useState('');
  const [description, setDescription] = useState('');
  const [animType, setAnimType] = useState<'gif' | 'webp' | 'apng' | 'video' | 'image'>('gif');

  // Config settings form
  const loadingConfig = siteConfig.loadingConfig || {
    activeAnimationId: 'load_stars',
    activeAnimationUrl: 'https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif',
    loadingText: 'Đang chuẩn bị không gian ngắm sao...',
    subText: 'Dưới Mái Hiên Sao ✦ Nơi lắng nghe tâm hồn',
    overlayOpacity: 0.9,
    showStarsEffect: true
  };

  const [loadingText, setLoadingText] = useState(loadingConfig.loadingText || '');
  const [subText, setSubText] = useState(loadingConfig.subText || '');
  const [overlayOpacity, setOverlayOpacity] = useState(loadingConfig.overlayOpacity ?? 0.9);
  const [showStarsEffect, setShowStarsEffect] = useState(loadingConfig.showStarsEffect !== false);

  const reloadData = () => {
    setAnimations(StorageService.getLoadingAnimations());
    setSiteConfig(StorageService.getSiteConfig());
  };

  const handleSetActive = (anim: LoadingAnimationAsset) => {
    StorageService.setActiveLoadingAnimation(anim.id);
    reloadData();
    toast.success(`✦ Đã đặt "${anim.name}" làm hoạt cảnh tải trang chính thức!`);
  };

  const handleOpenAdd = () => {
    setName('');
    setAssetUrl('');
    setDescription('');
    setAnimType('gif');
    setIsAddModalOpen(true);
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !assetUrl.trim()) {
      toast.error('Vui lòng nhập tên hoạt cảnh và tải lên tệp/đường dẫn.');
      return;
    }

    const created = StorageService.addLoadingAnimation({
      name: name.trim(),
      assetUrl: assetUrl.trim(),
      type: animType,
      description: description.trim()
    });

    reloadData();
    setIsAddModalOpen(false);
    toast.success(`✦ Đã thêm hoạt cảnh "${created.name}" vào thư viện!`);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xoá hoạt cảnh "${name}" khỏi danh sách?`)) {
      StorageService.deleteLoadingAnimation(id);
      reloadData();
      toast.success('Đã xoá hoạt cảnh.');
    }
  };

  const handleSaveConfig = () => {
    StorageService.updateLoadingConfig({
      loadingText: loadingText.trim(),
      subText: subText.trim(),
      overlayOpacity: Number(overlayOpacity),
      showStarsEffect
    });
    reloadData();
    toast.success('✦ Đã lưu cấu hình màn hình tải trang thành công!');
  };

  const activeAnim = animations.find(a => a.id === loadingConfig.activeAnimationId) || animations[0];

  return (
    <div className="space-y-6">
      
      {/* Tab Header Banner */}
      <GlassCard className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-500/20 shrink-0">
              <Sparkles className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                Quản Lý Màn Hình Tải Trang & Hiệu Ứng
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tuỳ chỉnh hoạt cảnh GIF / WebP / APNG / Video hiển thị khi lữ khách truy cập hoặc chuyển trang.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              icon={<Eye className="w-4 h-4" />}
              onClick={() => {
                setPreviewAnimation(activeAnim);
                setIsPreviewModalOpen(true);
              }}
            >
              Xem Thử Trực Tiếp
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={handleOpenAdd}
            >
              Tải Hoạt Cảnh Mới
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Active Animation Spotlight & Live Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Animation Card */}
        <GlassCard className="p-5 flex flex-col items-center text-center space-y-4 border-amber-400/40 bg-amber-50/10 dark:bg-amber-950/10" variant="glow">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-700 dark:text-amber-300 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400" /> Hoạt Cảnh Đang Áp Dụng
          </div>

          <div className="w-36 h-36 rounded-3xl p-1 bg-gradient-to-tr from-amber-400 to-indigo-600 shadow-xl overflow-hidden">
            <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center p-2">
              <img
                src={activeAnim?.assetUrl}
                alt={activeAnim?.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
              {activeAnim?.name || 'Ngôi Sao Lấp Lánh'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
              {activeAnim?.description || 'Hiệu ứng hoạt cảnh hiển thị trên toàn bộ website.'}
            </p>
          </div>

          <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
            Định dạng: {activeAnim?.type?.toUpperCase() || 'GIF'} • ID: {activeAnim?.id}
          </div>
        </GlassCard>

        {/* Global Loading Screen Text & Effects Settings */}
        <GlassCard className="p-5 lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Sliders className="w-4 h-4 text-indigo-500 dark:text-amber-400" />
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
              Cấu Hình Lời Chào & Độ Trong Suốt Màn Hình Tải
            </h3>
          </div>

          <div className="space-y-3.5">
            <Input
              label="Tiêu đề chính khi đang tải"
              value={loadingText}
              onChange={(e) => setLoadingText(e.target.value)}
              placeholder="Ví dụ: Đang chuẩn bị không gian ngắm sao..."
            />

            <Input
              label="Lời nhắn phụ / Châm ngôn"
              value={subText}
              onChange={(e) => setSubText(e.target.value)}
              placeholder="Ví dụ: Dưới Mái Hiên Sao ✦ Nơi lắng nghe tâm hồn"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Độ mờ lớp nền (Overlay Opacity): {overlayOpacity}
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="1.0"
                  step="0.05"
                  value={overlayOpacity}
                  onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
                  className="w-full accent-amber-400"
                />
              </div>

              <div className="flex items-center justify-between sm:justify-start gap-3 p-3 rounded-xl bg-slate-100/60 dark:bg-slate-800/60">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Hiệu ứng ánh sáng huyền ảo
                </span>
                <input
                  type="checkbox"
                  checked={showStarsEffect ?? false}
                  onChange={(e) => setShowStarsEffect(e.target.checked)}
                  className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveConfig}
                icon={<CheckCircle2 className="w-4 h-4" />}
              >
                Lưu Thay Đổi Cấu Hình
              </Button>
            </div>
          </div>
        </GlassCard>

      </div>

      {/* Animation Library Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Film className="w-4 h-4 text-indigo-500" />
            Thư Viện Hoạt Cảnh Sẵn Có ({animations.length})
          </h3>
          <span className="text-xs text-slate-400">Chọn "Áp dụng" để chuyển đổi hoạt cảnh trực tiếp</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {animations.map((anim) => {
            const isActive = anim.id === loadingConfig.activeAnimationId;
            return (
              <GlassCard
                key={anim.id}
                className={`p-4 flex flex-col justify-between space-y-3 transition-all ${
                  isActive
                    ? 'border-amber-400 bg-amber-50/20 dark:bg-amber-950/20 shadow-md ring-2 ring-amber-400/40'
                    : 'hover:border-indigo-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="relative w-full h-32 rounded-2xl bg-slate-950 overflow-hidden flex items-center justify-center p-2 border border-slate-800">
                    <img
                      src={anim.assetUrl}
                      alt={anim.name}
                      className="max-w-full max-h-full object-contain"
                    />
                    {isActive && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold shadow">
                        Đang dùng
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate">
                      {anim.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                      {anim.description || 'Không có mô tả.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {isActive ? (
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Đang hoạt động
                    </span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetActive(anim)}
                      className="text-xs py-1 px-2.5 h-auto"
                    >
                      Áp Dụng
                    </Button>
                  )}

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setPreviewAnimation(anim);
                        setIsPreviewModalOpen(true);
                      }}
                      className="p-1.5 h-auto"
                      title="Xem thử toàn màn hình"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Button>

                    {!anim.isPreset && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(anim.id, anim.name)}
                        className="p-1.5 h-auto text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                        title="Xoá hoạt cảnh này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Add Animation Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="✦ TẢI LÊN HOẠT CẢNH MÀN HÌNH TẢI MỚI"
        maxWidth="md"
      >
        <form onSubmit={handleSaveNew} className="space-y-4">
          <Input
            label="Tên hoạt cảnh"
            placeholder="Ví dụ: Đèn lồng đom đóm, Bé mèo ngắm sao..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Loại định dạng
              </label>
              <select
                value={animType}
                onChange={(e) => setAnimType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-white/80 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
              >
                <option value="gif">Ảnh Động GIF</option>
                <option value="webp">Ảnh Động WebP</option>
                <option value="apng">Ảnh Động APNG</option>
                <option value="video">Video ngắn MP4</option>
                <option value="image">Ảnh Tĩnh PNG/JPG</option>
              </select>
            </div>

            <Input
              label="Ghi chú ngắn"
              placeholder="Hiệu ứng ánh sáng nhẹ..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <MediaUploader
            label="Tệp hoạt cảnh hoặc URL"
            value={assetUrl}
            onChange={setAssetUrl}
            acceptTypes={['gif', 'image', 'video']}
            maxSizeMB={15}
            placeholder="Dán link GIF hoặc tải ảnh động lên..."
            helperText="Khuyến nghị dùng GIF hoặc WebP chuyển động mượt mà dưới 10MB để tải nhanh."
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsAddModalOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!name.trim() || !assetUrl.trim()}
            >
              Lưu Hoạt Cảnh
            </Button>
          </div>
        </form>
      </Modal>

      {/* Full Live Preview Simulation Modal */}
      {isPreviewModalOpen && previewAnimation && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 backdrop-blur-xl animate-fade-in cursor-pointer p-4"
          style={{
            backgroundColor: `rgba(10, 15, 30, ${overlayOpacity})`
          }}
          onClick={() => setIsPreviewModalOpen(false)}
        >
          <div className="absolute top-4 right-4 z-20">
            <Button variant="outline" size="sm" onClick={() => setIsPreviewModalOpen(false)}>
              Đóng Xem Thử (ESC)
            </Button>
          </div>

          <div className="flex flex-col items-center text-center space-y-4 max-w-sm">
            <div className="w-32 h-32 rounded-3xl p-1 bg-gradient-to-tr from-amber-400 via-indigo-500 to-purple-600 shadow-2xl">
              <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center p-2">
                <img
                  src={previewAnimation.assetUrl}
                  alt={previewAnimation.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-white">
              <div className="inline-flex items-center gap-1.5 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hiên Nhà Ngắm Sao</span>
              </div>
              <h3 className="text-base font-bold tracking-tight">
                {loadingText || 'Đang chuẩn bị không gian ngắm sao...'}
              </h3>
              <p className="text-xs text-slate-400 italic">
                {subText || 'Dưới Mái Hiên Sao ✦ Nơi lắng nghe tâm hồn'}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
