import React, { useState } from 'react';
import { SiteSocialConfig, SocialPlatformConfig } from '../../../types';
import { StorageService } from '../../../services/storageService';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { MediaUploader } from '../../../components/ui/MediaUploader';
import { toast } from '../../../stores/useToastStore';
import { 
  Share2, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  Eye, 
  MessageSquare, 
  Facebook, 
  Image as ImageIcon,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const SocialAppearanceTab: React.FC = () => {
  const [socialConfig, setSocialConfig] = useState<SiteSocialConfig>(() => StorageService.getSocialLinks());
  const [activeSubTab, setActiveSubTab] = useState<'discord' | 'facebook'>('discord');

  const handleUpdatePlatform = (platform: 'discord' | 'facebook', field: keyof SocialPlatformConfig, value: any) => {
    setSocialConfig(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value
      }
    }));
  };

  const handleSaveAll = () => {
    StorageService.saveSocialLinks(socialConfig);
    toast.success('✦ Đã lưu cấu hình giao diện & ảnh đại diện mạng xã hội thành công!');
  };

  const discord = socialConfig.discord;
  const facebook = socialConfig.facebook;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <GlassCard className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-500/20 shrink-0">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                Giao Diện & Avatar Discord / Facebook
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tuỳ chỉnh độc lập ảnh đại diện, ảnh động GIF, tên hiển thị và các liên kết mạng xã hội của Hiên Nhà.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={<CheckCircle2 className="w-4 h-4" />}
            onClick={handleSaveAll}
          >
            Lưu Toàn Bộ Cấu Hình
          </Button>
        </div>

        {/* Platform Selector Tabs */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveSubTab('discord')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'discord'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#5865F2]" />
            <span>Discord Hiên Nhà & Hợp Tác</span>
          </button>

          <button
            onClick={() => setActiveSubTab('facebook')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'facebook'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#1877F2]" />
            <span>Facebook Page & Cá Nhân</span>
          </button>
        </div>
      </GlassCard>

      {/* Main Content Grid: Editor + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Editor Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {activeSubTab === 'discord' ? (
            /* Discord Settings */
            <GlassCard className="p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-[#5865F2]/10 text-[#5865F2]">
                    <MessageSquare className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      Cài Đặt Discord Server & Hợp Tác
                    </h3>
                    <p className="text-[11px] text-slate-400">Tùy biến avatar đại diện và liên kết phòng chat</p>
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
                  <span>Hiển thị</span>
                  <input
                    type="checkbox"
                    checked={discord.enabled ?? false}
                    onChange={(e) => handleUpdatePlatform('discord', 'enabled', e.target.checked)}
                    className="w-4 h-4 accent-indigo-600 rounded"
                  />
                </label>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Tên hiển thị Discord"
                    value={discord.displayName}
                    onChange={(e) => handleUpdatePlatform('discord', 'displayName', e.target.value)}
                    placeholder="Hiên Nhà Ngắm Sao Discord"
                  />
                  <Input
                    label="Huy hiệu / Tag phụ"
                    value={discord.badge || ''}
                    onChange={(e) => handleUpdatePlatform('discord', 'badge', e.target.value)}
                    placeholder="Ví dụ: Official Community"
                  />
                </div>

                <Input
                  label="Mô tả ngắn"
                  value={discord.description || ''}
                  onChange={(e) => handleUpdatePlatform('discord', 'description', e.target.value)}
                  placeholder="Không gian trò chuyện, tâm sự đêm muộn cùng lữ khách phương xa."
                />

                <MediaUploader
                  label="Ảnh đại diện Discord (Avatar)"
                  value={discord.avatarUrl}
                  onChange={(url) => handleUpdatePlatform('discord', 'avatarUrl', url)}
                  acceptTypes={['image', 'gif']}
                  helperText="Hỗ trợ ảnh tĩnh PNG, JPG hoặc ảnh động GIF chuyển động đẹp mắt."
                />

                <MediaUploader
                  label="Ảnh GIF động đại diện phụ / Hiệu ứng hover (Tùy chọn)"
                  value={discord.gifAvatarUrl || ''}
                  onChange={(url) => handleUpdatePlatform('discord', 'gifAvatarUrl', url)}
                  acceptTypes={['gif', 'image']}
                  helperText="Ảnh động GIF sẽ phát khi lữ khách rê chuột vào nút liên kết Discord."
                />

                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
                    Các Đường Dẫn Kết Nối Discord
                  </h4>

                  <Input
                    label="Link Discord Hợp Tác / Giao Lưu Công Khai (Collab URL)"
                    value={discord.collabUrl || ''}
                    onChange={(e) => handleUpdatePlatform('discord', 'collabUrl', e.target.value)}
                    placeholder="https://discord.gg/..."
                  />

                  <Input
                    label="Link Discord Cá Nhân / Ban Quản Trị (Private URL)"
                    value={discord.privateUrl || ''}
                    onChange={(e) => handleUpdatePlatform('discord', 'privateUrl', e.target.value)}
                    placeholder="https://discord.com/users/..."
                  />
                </div>
              </div>
            </GlassCard>
          ) : (
            /* Facebook Settings */
            <GlassCard className="p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-[#1877F2]/10 text-[#1877F2]">
                    <Facebook className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      Cài Đặt Facebook Fanpage & Cá Nhân
                    </h3>
                    <p className="text-[11px] text-slate-400">Tùy biến avatar đại diện và liên kết trang Facebook</p>
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
                  <span>Hiển thị</span>
                  <input
                    type="checkbox"
                    checked={facebook.enabled ?? false}
                    onChange={(e) => handleUpdatePlatform('facebook', 'enabled', e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded"
                  />
                </label>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Tên hiển thị Facebook"
                    value={facebook.displayName}
                    onChange={(e) => handleUpdatePlatform('facebook', 'displayName', e.target.value)}
                    placeholder="Hiên Nhà Ngắm Sao Fanpage"
                  />
                  <Input
                    label="Huy hiệu / Tag phụ"
                    value={facebook.badge || ''}
                    onChange={(e) => handleUpdatePlatform('facebook', 'badge', e.target.value)}
                    placeholder="Ví dụ: Trang chính thức"
                  />
                </div>

                <Input
                  label="Mô tả ngắn"
                  value={facebook.description || ''}
                  onChange={(e) => handleUpdatePlatform('facebook', 'description', e.target.value)}
                  placeholder="Nơi chia sẻ những câu chuyện nhỏ, hình ảnh và cập nhật mới nhất."
                />

                <MediaUploader
                  label="Ảnh đại diện Facebook (Avatar)"
                  value={facebook.avatarUrl}
                  onChange={(url) => handleUpdatePlatform('facebook', 'avatarUrl', url)}
                  acceptTypes={['image', 'gif']}
                  helperText="Ảnh đại diện sẽ xuất hiện trên thẻ liên kết và chân trang."
                />

                <MediaUploader
                  label="Ảnh GIF động đại diện phụ / Hiệu ứng hover (Tùy chọn)"
                  value={facebook.gifAvatarUrl || ''}
                  onChange={(url) => handleUpdatePlatform('facebook', 'gifAvatarUrl', url)}
                  acceptTypes={['gif', 'image']}
                  helperText="Ảnh động GIF sẽ phát khi lữ khách tương tác với thẻ Facebook."
                />

                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                    Các Đường Dẫn Kết Nối Facebook
                  </h4>

                  <Input
                    label="Link Facebook Fanpage Chính Thức"
                    value={facebook.pageUrl || ''}
                    onChange={(e) => handleUpdatePlatform('facebook', 'pageUrl', e.target.value)}
                    placeholder="https://facebook.com/..."
                  />

                  <Input
                    label="Link Facebook Cá Nhân Chủ Nhà (Personal Profile)"
                    value={facebook.personalUrl || ''}
                    onChange={(e) => handleUpdatePlatform('facebook', 'personalUrl', e.target.value)}
                    placeholder="https://facebook.com/thanhnhi..."
                  />
                </div>
              </div>
            </GlassCard>
          )}

        </div>

        {/* Live Preview Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard className="p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Eye className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Xem Thử Thẻ Liên Kết (Live Preview)
              </h3>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Đây là hình ảnh thẻ liên kết tương tác thực tế hiển thị cho người xem trên website:
            </p>

            {/* Discord Preview Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#5865F2]/20 via-slate-900/60 to-slate-950 border border-[#5865F2]/30 shadow-lg space-y-3 group transition-all">
              <div className="flex items-start gap-3.5">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-900 border border-[#5865F2]/40 shrink-0">
                  <img
                    src={discord.gifAvatarUrl || discord.avatarUrl}
                    alt={discord.displayName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#5865F2] flex items-center justify-center text-white text-[10px]">
                    <MessageSquare className="w-3 h-3" />
                  </div>
                </div>

                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-white truncate">
                      {discord.displayName || 'Discord Hiên Nhà'}
                    </h4>
                    {discord.badge && (
                      <span className="px-1.5 py-0.2 rounded-md bg-[#5865F2]/30 text-[#5865F2] text-[9px] font-bold shrink-0">
                        {discord.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {discord.description || 'Không gian trò chuyện cùng các vì sao...'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                {discord.collabUrl && (
                  <a
                    href={discord.collabUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-1.5 px-3 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Tham Gia Server</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {discord.privateUrl && (
                  <a
                    href={discord.privateUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                  >
                    Chủ Nhà
                  </a>
                )}
              </div>
            </div>

            {/* Facebook Preview Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1877F2]/20 via-slate-900/60 to-slate-950 border border-[#1877F2]/30 shadow-lg space-y-3 group transition-all">
              <div className="flex items-start gap-3.5">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-900 border border-[#1877F2]/40 shrink-0">
                  <img
                    src={facebook.gifAvatarUrl || facebook.avatarUrl}
                    alt={facebook.displayName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#1877F2] flex items-center justify-center text-white text-[10px]">
                    <Facebook className="w-3 h-3" />
                  </div>
                </div>

                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-white truncate">
                      {facebook.displayName || 'Facebook Hiên Nhà'}
                    </h4>
                    {facebook.badge && (
                      <span className="px-1.5 py-0.2 rounded-md bg-[#1877F2]/30 text-blue-300 text-[9px] font-bold shrink-0">
                        {facebook.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {facebook.description || 'Theo dõi những mẩu chuyện nhỏ và bài viết mới...'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                {facebook.pageUrl && (
                  <a
                    href={facebook.pageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-1.5 px-3 rounded-xl bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Theo Dõi Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {facebook.personalUrl && (
                  <a
                    href={facebook.personalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                  >
                    Cá Nhân
                  </a>
                )}
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                className="w-full"
                icon={<CheckCircle2 className="w-4 h-4" />}
                onClick={handleSaveAll}
              >
                Lưu Thay Đổi Giao Diện Mạng Xã Hội
              </Button>
            </div>

          </GlassCard>
        </div>

      </div>

    </div>
  );
};
