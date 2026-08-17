import React, { useState } from 'react';
import { SiteConfig } from '../../../types';
import { StorageService } from '../../../services/storageService';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { Input, Textarea } from '../../../components/ui/Input';
import { toast } from '../../../stores/useToastStore';
import { 
  Globe, 
  Save, 
  RotateCcw, 
  Image as ImageIcon, 
  Video, 
  Clock, 
  Share2, 
  MessageCircle, 
  Sparkles,
  Sliders
} from 'lucide-react';

export const SiteConfigTab: React.FC = () => {
  const [config, setConfig] = useState<SiteConfig>(() => StorageService.getSiteConfig());
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      StorageService.saveSiteConfig(config);
      toast.success('✦ Đã lưu toàn bộ cấu hình trang chủ thành công!');
    } catch (err) {
      toast.error('Có lỗi xảy ra khi lưu cấu hình.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Cậu có chắc chắn muốn khôi phục cấu hình trang chủ về mặc định ban đầu không?')) {
      const initial = StorageService.getSiteConfig();
      setConfig(initial);
      StorageService.saveSiteConfig(initial);
      toast.success('Đã khôi phục cấu hình trang chủ về mặc định.');
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      
      {/* 1. BRANDING & HEADLINES */}
      <GlassCard className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-slate-800">
          <Globe className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            1. Nhận Diện & Tiêu Đề Trang Chủ
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Tên Website (Site Name) *"
            value={config.siteName}
            onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
            placeholder="Hiên Nhà Ngắm Sao"
            required
          />
          <Input
            label="Phụ đề tiếng Anh (Subtitle)"
            value={config.subtitle}
            onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
            placeholder="STARGAZING VERANDA"
          />
        </div>

        <Input
          label="Khẩu hiệu / Tagline chính"
          value={config.tagline}
          onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
          placeholder="✦ Nơi Bình Yên Lắng Đọng Giữa Muôn Vàn Tinh Tú ✦"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nút Khám Phá (Explore Button Text)"
            value={config.exploreButtonText || '✦ KHÁM PHÁ HIÊN NHÀ'}
            onChange={(e) => setConfig({ ...config, exploreButtonText: e.target.value })}
            placeholder="✦ KHÁM PHÁ HIÊN NHÀ"
          />
          <Input
            label="Dòng chữ chân trang (Footer Text)"
            value={config.footerText}
            onChange={(e) => setConfig({ ...config, footerText: e.target.value })}
            placeholder="Dưới Mái Hiên Sao • Ngắm Sao & Chữa Lành • © 2026"
          />
        </div>
      </GlassCard>

      {/* 2. CINEMATIC BACKGROUND MEDIA */}
      <GlassCard className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-slate-800">
          <Video className="w-5 h-5 text-indigo-500" />
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            2. Video & Hình Nền Động
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Định dạng nền
            </label>
            <select
              value={config.backgroundType}
              onChange={(e) => setConfig({ ...config, backgroundType: e.target.value as 'video' | 'image' })}
              className="w-full px-3.5 py-2 text-sm bg-white/70 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="video">Video MP4 Động (.mp4)</option>
              <option value="image">Hình Ảnh Tĩnh (.jpg, .png, .webp)</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <Input
              label="URL Video/Hình Nền Chính"
              value={config.backgroundUrl}
              onChange={(e) => setConfig({ ...config, backgroundUrl: e.target.value })}
              placeholder="https://res.cloudinary.com/.../video.mp4"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="URL Hình Nền Dự Phòng (Fallback Image)"
            value={config.backgroundFallbackUrl}
            onChange={(e) => setConfig({ ...config, backgroundFallbackUrl: e.target.value })}
            placeholder="https://images.unsplash.com/..."
          />

          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              <span>Độ mờ màn che (Overlay Opacity): {Math.round((config.overlayOpacity ?? 0.65) * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.95"
              step="0.05"
              value={config.overlayOpacity ?? 0.65}
              onChange={(e) => setConfig({ ...config, overlayOpacity: parseFloat(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer mt-2"
            />
          </div>
        </div>
      </GlassCard>

      {/* 3. TIME-BASED GREETINGS */}
      <GlassCard className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-slate-800">
          <Clock className="w-5 h-5 text-emerald-500" />
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            3. Lời Chào Thời Gian Thực (Theo Khung Giờ)
          </h2>
        </div>

        <div className="space-y-3">
          <Input
            label="Sáng sớm (05:00 - 10:59)"
            value={config.greetings.morning}
            onChange={(e) => setConfig({
              ...config,
              greetings: { ...config.greetings, morning: e.target.value }
            })}
          />
          <Input
            label="Buổi trưa (11:00 - 13:59)"
            value={config.greetings.noon}
            onChange={(e) => setConfig({
              ...config,
              greetings: { ...config.greetings, noon: e.target.value }
            })}
          />
          <Input
            label="Chiều tà (14:00 - 17:59)"
            value={config.greetings.afternoon}
            onChange={(e) => setConfig({
              ...config,
              greetings: { ...config.greetings, afternoon: e.target.value }
            })}
          />
          <Input
            label="Đầu tối (18:00 - 22:59)"
            value={config.greetings.evening}
            onChange={(e) => setConfig({
              ...config,
              greetings: { ...config.greetings, evening: e.target.value }
            })}
          />
          <Input
            label="Đêm khuya (23:00 - 04:59)"
            value={config.greetings.night}
            onChange={(e) => setConfig({
              ...config,
              greetings: { ...config.greetings, night: e.target.value }
            })}
          />
        </div>
      </GlassCard>

      {/* 4. SOCIAL & COMMUNITY LINKS */}
      <GlassCard className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-slate-800">
          <Share2 className="w-5 h-5 text-sky-500" />
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            4. Liên Kết Mạng Xã Hội & Cộng Đồng
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Discord Server Collab (Liên Minh)"
            value={config.discordCollabUrl}
            onChange={(e) => setConfig({ ...config, discordCollabUrl: e.target.value })}
            placeholder="https://discord.gg/..."
            icon={<MessageCircle className="w-4 h-4 text-indigo-400" />}
          />
          <Input
            label="Discord Server Riêng Của Hiên Nhà"
            value={config.discordPrivateUrl}
            onChange={(e) => setConfig({ ...config, discordPrivateUrl: e.target.value })}
            placeholder="https://discord.gg/..."
            icon={<Sparkles className="w-4 h-4 text-purple-400" />}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Facebook Fanpage Chính Thức"
            value={config.facebookPageUrl}
            onChange={(e) => setConfig({ ...config, facebookPageUrl: e.target.value })}
            placeholder="https://web.facebook.com/..."
            icon={<Share2 className="w-4 h-4 text-sky-400" />}
          />
          <Input
            label="Facebook Cá Nhân Của Tác Giả (Mỡn)"
            value={config.facebookPersonalUrl}
            onChange={(e) => setConfig({ ...config, facebookPersonalUrl: e.target.value })}
            placeholder="https://web.facebook.com/..."
            icon={<Share2 className="w-4 h-4 text-blue-400" />}
          />
        </div>
      </GlassCard>

      {/* ACTION BAR */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleReset}
          icon={<RotateCcw className="w-4 h-4" />}
        >
          Khôi Phục Mặc Định
        </Button>

        <Button
          type="submit"
          variant="gold"
          size="md"
          loading={isSaving}
          icon={<Save className="w-4 h-4" />}
        >
          ✦ Lưu Toàn Bộ Cấu Hình Trang Chủ
        </Button>
      </div>

    </form>
  );
};
