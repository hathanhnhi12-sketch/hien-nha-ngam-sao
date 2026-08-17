import React, { useState, useEffect } from 'react';
import { SectionBackgroundSetting, SectionBackgroundsMap } from '../../../types';
import { StorageService } from '../../../services/storageService';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { toast } from '../../../stores/useToastStore';
import { 
  Palette, 
  Image as ImageIcon, 
  Video, 
  Sparkles, 
  RotateCcw, 
  Monitor, 
  Smartphone, 
  Layers, 
  Eye, 
  Sliders, 
  Save, 
  Upload, 
  CheckCircle2, 
  X,
  Layout
} from 'lucide-react';

const SECTION_METADATA: { key: keyof SectionBackgroundsMap; label: string; description: string; icon: string }[] = [
  { key: 'home', label: 'Trang Chủ', description: 'Màn hình đón chào lữ khách và ngắm sao', icon: '🏠' },
  { key: 'characters', label: 'Danh Sách Nhân Vật', description: 'Khu vực khám phá và lọc nhân vật', icon: '👥' },
  { key: 'character-detail', label: 'Chi Tiết Nhân Vật', description: 'Không gian hồ sơ, tình huống nhập vai và trò chuyện', icon: '📜' },
  { key: 'leaderboard', label: 'Bảng Xếp Hạng', description: 'Vinh danh nhân vật theo lượt tim', icon: '🏆' },
  { key: 'vote', label: 'Bình Chọn', description: 'Khu vực bỏ phiếu ánh sao định kỳ', icon: '🗳️' },
  { key: 'send-love', label: 'Hòm Thư Yêu Thương', description: 'Gửi thư kín và lời nhắn riêng tư', icon: '💌' },
  { key: 'feedback', label: 'Hòm Thư Góp Ý', description: 'Bảng tiếp nhận phản hồi & báo lỗi theo nhân vật', icon: '📬' },
  { key: 'playlist', label: 'Playlist Âm Nhạc', description: 'Trình phát giai điệu thư giãn dưới mái hiên', icon: '🎵' },
  { key: 'gallery', label: 'Album Ảnh', description: 'Bộ sưu tập hình ảnh và fanart nghệ thuật', icon: '🖼️' },
  { key: 'other-spaces', label: 'Không Gian Khác', description: 'Trải bài Tarot, trích dẫn chiêm tinh và thư viện', icon: '🪐' },
  { key: 'minigame', label: 'Khu Vườn & Minigame', description: 'Vòng quay, câu đố và điểm danh nhận quà', icon: '🎮' },
  { key: 'admin', label: 'Bảng Quản Trị CMS', description: 'Khu vực điều khiển và kiểm soát toàn bộ website', icon: '⚡' },
];

const PRESET_BACKGROUNDS = [
  { name: 'Đêm Sao Lấp Lánh', url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Cực Quang Huyền Bí', url: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=2065&auto=format&fit=crop' },
  { name: 'Hiên Nhà Ấm Áp', url: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=2050&auto=format&fit=crop' },
  { name: 'Rừng Đêm Đom Đóm', url: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=2055&auto=format&fit=crop' },
  { name: 'Thiên Hà Tím Mộng Mơ', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop' },
  { name: 'Hoàng Hôn Tĩnh Lặng', url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?q=80&w=2000&auto=format&fit=crop' },
];

export const BackgroundsTab: React.FC = () => {
  const [backgrounds, setBackgrounds] = useState<SectionBackgroundsMap>(() => 
    StorageService.getSectionBackgrounds()
  );

  const [activeSectionKey, setActiveSectionKey] = useState<keyof SectionBackgroundsMap>('home');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  const reloadBackgrounds = () => {
    setBackgrounds(StorageService.getSectionBackgrounds());
  };

  useEffect(() => {
    reloadBackgrounds();
  }, []);

  const activeSetting: SectionBackgroundSetting = backgrounds[activeSectionKey] || {
    type: 'image',
    url: '',
    opacity: 0.15,
    blur: 0,
    overlayGradient: true,
    enabled: true
  };

  const handleUpdateActiveSetting = (partial: Partial<SectionBackgroundSetting>) => {
    const updatedSetting: SectionBackgroundSetting = {
      ...activeSetting,
      ...partial
    };

    const newMap: SectionBackgroundsMap = {
      ...backgrounds,
      [activeSectionKey]: updatedSetting
    };

    setBackgrounds(newMap);
    StorageService.saveSectionBackground(activeSectionKey, updatedSetting);
  };

  // Upload Desktop Background Image
  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>, isMobile = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước ảnh tối đa là 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      if (isMobile) {
        handleUpdateActiveSetting({ mobileUrl: base64 });
        toast.success('Đã tải lên hình nền cho thiết bị di động!');
      } else {
        handleUpdateActiveSetting({ url: base64, type: 'image' });
        toast.success('Đã tải lên hình nền máy tính thành công!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Reset all to seed
  const handleResetAll = () => {
    if (window.confirm('Khôi phục toàn bộ hình nền các phân vùng về cấu hình ban đầu?')) {
      StorageService.resetSectionBackgrounds();
      reloadBackgrounds();
      toast.success('Đã khôi phục hình nền các phân vùng thành công');
    }
  };

  const currentMeta = SECTION_METADATA.find(m => m.key === activeSectionKey);

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-purple-400/20 text-purple-500 dark:text-purple-300">
                <Palette className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Quản Lý Hình Nền Từng Phân Vùng
              </h2>
              <Badge variant="gold">BACKGROUND MANAGER</Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Tự do cá nhân hóa hình nền, video nền, độ mờ (opacity), độ nhòe (blur) và hiệu ứng chuyển sắc cho từng trang riêng biệt trên website.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleResetAll}
              icon={<RotateCcw className="w-4 h-4" />}
            >
              Khôi Phục Mặc Định
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Section Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {SECTION_METADATA.map((meta) => {
          const isSelected = activeSectionKey === meta.key;
          const setting = backgrounds[meta.key];
          return (
            <button
              key={meta.key}
              onClick={() => setActiveSectionKey(meta.key)}
              className={`p-3 rounded-2xl text-left transition-all duration-200 cursor-pointer flex flex-col justify-between h-24 relative overflow-hidden border ${
                isSelected
                  ? 'bg-amber-400/15 border-amber-400 dark:border-amber-400/80 shadow-md ring-2 ring-amber-400/30'
                  : 'bg-white/60 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-lg">{meta.icon}</span>
                {setting?.enabled !== false ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="Đang bật" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-400" title="Tắt" />
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {meta.label}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {setting?.type === 'video' ? 'Video nền' : setting?.type === 'none' ? 'Không nền' : 'Ảnh nền'}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Configuration & Live Preview Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Editor Controls (7 Columns) */}
        <div className="lg:col-span-7 space-y-5">
          <GlassCard className="p-6 space-y-6">
            
            {/* Header of Active Section */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{currentMeta?.icon}</span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Cấu hình hình nền: {currentMeta?.label}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {currentMeta?.description}
                  </p>
                </div>
              </div>

              {/* Enable toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="section_bg_enabled"
                  checked={activeSetting.enabled !== false}
                  onChange={(e) => handleUpdateActiveSetting({ enabled: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
                <label htmlFor="section_bg_enabled" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Kích hoạt
                </label>
              </div>
            </div>

            {/* Background Type Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Loại hình nền
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { type: 'image', label: 'Hình ảnh', icon: <ImageIcon className="w-4 h-4" /> },
                  { type: 'video', label: 'Video MP4', icon: <Video className="w-4 h-4" /> },
                  { type: 'gradient', label: 'Chuyển sắc', icon: <Sparkles className="w-4 h-4" /> },
                  { type: 'none', label: 'Mặc định', icon: <X className="w-4 h-4" /> },
                ].map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => handleUpdateActiveSetting({ type: item.type as any })}
                    className={`p-2.5 rounded-xl text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer border ${
                      activeSetting.type === item.type
                        ? 'bg-amber-400 text-slate-950 border-amber-500 font-bold shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-200'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Type Specific Fields */}
            {activeSetting.type === 'image' && (
              <div className="space-y-4 pt-1">
                {/* Desktop URL */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Monitor className="w-3.5 h-3.5 text-indigo-500" />
                      URL ảnh nền Desktop
                    </label>
                    <label className="text-[11px] text-amber-500 font-bold hover:underline cursor-pointer flex items-center gap-1">
                      <Upload className="w-3 h-3" /> Tải ảnh từ máy tính
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUploadImage(e, false)}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <Input
                    value={activeSetting.url || ''}
                    onChange={(e) => handleUpdateActiveSetting({ url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                {/* Mobile URL (Optional) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-pink-500" />
                      URL ảnh nền Mobile (Tùy chọn)
                    </label>
                    <label className="text-[11px] text-pink-500 font-bold hover:underline cursor-pointer flex items-center gap-1">
                      <Upload className="w-3 h-3" /> Tải ảnh mobile
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUploadImage(e, true)}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <Input
                    value={activeSetting.mobileUrl || ''}
                    onChange={(e) => handleUpdateActiveSetting({ mobileUrl: e.target.value })}
                    placeholder="Để trống nếu muốn dùng chung với Desktop"
                  />
                </div>

                {/* Preset Wallpapers */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Kho hình nền tuyển chọn sẵn:
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {PRESET_BACKGROUNDS.map((preset, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleUpdateActiveSetting({ url: preset.url })}
                        className="group relative rounded-xl overflow-hidden aspect-video border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-amber-400 transition-all shadow-sm"
                      >
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent flex items-end p-1">
                          <span className="text-[9px] font-medium text-white truncate">{preset.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSetting.type === 'video' && (
              <div className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    URL Video nền (MP4 / WebM)
                  </label>
                  <Input
                    value={activeSetting.videoUrl || ''}
                    onChange={(e) => handleUpdateActiveSetting({ videoUrl: e.target.value })}
                    placeholder="https://.../video.mp4"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Ảnh dự phòng khi không tải được video (Poster / Fallback Image)
                  </label>
                  <Input
                    value={activeSetting.url || ''}
                    onChange={(e) => handleUpdateActiveSetting({ url: e.target.value })}
                    placeholder="https://.../fallback.jpg"
                  />
                </div>
              </div>
            )}

            {/* Sliders: Opacity & Blur */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200/60 dark:border-slate-800">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Độ trong suốt (Opacity)</span>
                  <span className="font-mono text-amber-500">{Math.round((activeSetting.opacity ?? 0.15) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="1.0"
                  step="0.05"
                  value={activeSetting.opacity ?? 0.15}
                  onChange={(e) => handleUpdateActiveSetting({ opacity: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Độ nhòe mịn (Blur)</span>
                  <span className="font-mono text-amber-500">{activeSetting.blur ?? 0}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={activeSetting.blur ?? 0}
                  onChange={(e) => handleUpdateActiveSetting({ blur: parseInt(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Overlay Gradient Switch */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Lớp phủ làm dịu (Overlay Gradient)
                </span>
                <span className="text-[11px] text-slate-400">
                  Tạo dải mờ dịu mắt giúp chữ và thẻ nội dung luôn sắc nét, dễ đọc.
                </span>
              </div>
              <input
                type="checkbox"
                checked={activeSetting.overlayGradient !== false}
                onChange={(e) => handleUpdateActiveSetting({ overlayGradient: e.target.checked })}
                className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            {/* Quick Save Feedback Button */}
            <div className="flex justify-end pt-2">
              <Button
                variant="gold"
                size="sm"
                onClick={() => toast.success(`Đã lưu cấu hình hình nền cho ${currentMeta?.label}!`)}
                icon={<Save className="w-4 h-4" />}
              >
                Lưu Thay Đổi
              </Button>
            </div>

          </GlassCard>
        </div>

        {/* Right: Live Preview Screen (5 Columns) */}
        <div className="lg:col-span-5 sticky top-24 space-y-3">
          <GlassCard className="p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-amber-500" />
                Xem trước hiệu ứng trực quan
              </span>

              {/* Device Toggle */}
              <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${
                    previewDevice === 'desktop' ? 'bg-white dark:bg-slate-700 text-amber-500 shadow-sm' : 'text-slate-400'
                  }`}
                  title="Xem dạng máy tính"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${
                    previewDevice === 'mobile' ? 'bg-white dark:bg-slate-700 text-amber-500 shadow-sm' : 'text-slate-400'
                  }`}
                  title="Xem dạng di động"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Device Frame */}
            <div className={`mx-auto rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700 shadow-xl transition-all duration-300 relative ${
              previewDevice === 'mobile' ? 'w-60 h-96' : 'w-full h-72'
            }`}>
              
              {/* Background Layer inside frame */}
              {activeSetting.enabled !== false && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {activeSetting.type === 'video' && activeSetting.videoUrl ? (
                    <video
                      src={activeSetting.videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                      style={{
                        opacity: activeSetting.opacity ?? 0.15,
                        filter: activeSetting.blur ? `blur(${activeSetting.blur}px)` : 'none'
                      }}
                    />
                  ) : (
                    <div
                      className="w-full h-full bg-cover bg-center transition-all duration-300"
                      style={{
                        backgroundImage: `url(${
                          previewDevice === 'mobile' && activeSetting.mobileUrl
                            ? activeSetting.mobileUrl
                            : activeSetting.url || PRESET_BACKGROUNDS[0].url
                        })`,
                        opacity: activeSetting.opacity ?? 0.15,
                        filter: activeSetting.blur ? `blur(${activeSetting.blur}px)` : 'none'
                      }}
                    />
                  )}

                  {/* Gradient Overlay */}
                  {activeSetting.overlayGradient !== false && (
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/80 pointer-events-none" />
                  )}
                </div>
              )}

              {/* Sample Content overlay */}
              <div className="relative z-10 w-full h-full p-4 flex flex-col justify-between text-white select-none">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                    {currentMeta?.label}
                  </span>
                  <span className="text-[10px] opacity-70">Hiên Nhà Ngắm Sao</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 backdrop-blur-md border border-white/10 space-y-1">
                  <h4 className="text-xs font-bold text-amber-300">✦ Nội dung mẫu</h4>
                  <p className="text-[10px] text-slate-300 line-clamp-2">
                    Hình nền được căn chỉnh hoàn hảo, không làm vỡ bố cục và hỗ trợ mượt mà trên mọi thiết bị.
                  </p>
                </div>

                <div className="flex items-center justify-between text-[9px] opacity-60">
                  <span>{previewDevice === 'desktop' ? 'Màn hình rộng' : 'Màn hình di động'}</span>
                  <span>Độ mờ: {Math.round((activeSetting.opacity ?? 0.15) * 100)}%</span>
                </div>
              </div>

            </div>
          </GlassCard>
        </div>

      </div>

    </div>
  );
};
