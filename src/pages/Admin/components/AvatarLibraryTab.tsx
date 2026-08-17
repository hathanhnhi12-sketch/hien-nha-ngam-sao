import React, { useState } from 'react';
import { UserAvatarPreset } from '../../../types';
import { StorageService } from '../../../services/storageService';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { toast } from '../../../stores/useToastStore';
import { UserAvatar } from '../../../components/common/UserAvatar';
import { AvatarInputPreview } from '../../../components/common/AvatarInputPreview';
import { isGifUrl } from '../../../utils/avatarUtils';
import { 
  Users, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Edit2, 
  Smile, 
  ShieldAlert,
  Search,
  Activity,
  Wrench
} from 'lucide-react';

export const AvatarLibraryTab: React.FC = () => {
  const [presets, setPresets] = useState<UserAvatarPreset[]>(() => StorageService.getUserAvatarPresets());
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPreset, setEditingPreset] = useState<UserAvatarPreset | null>(null);

  // Diagnostic sandbox URL tester
  const [testUrl, setTestUrl] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<'image' | 'gif'>('image');
  const [badge, setBadge] = useState('');
  const [enabled, setEnabled] = useState(true);

  const reloadData = () => {
    setPresets(StorageService.getUserAvatarPresets());
  };

  const handleOpenAdd = () => {
    setEditingPreset(null);
    setName('');
    setUrl('');
    setType('image');
    setBadge('');
    setEnabled(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (preset: UserAvatarPreset) => {
    setEditingPreset(preset);
    setName(preset.name);
    setUrl(preset.url || preset.avatarUrl || '');
    setType(preset.type === 'gif' ? 'gif' : isGifUrl(preset.url || preset.avatarUrl) ? 'gif' : 'image');
    setBadge(preset.badge || '');
    setEnabled(preset.enabled);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) {
      toast.error('Vui lòng nhập tên avatar và cung cấp đường dẫn ảnh.');
      return;
    }

    const detectedType = isGifUrl(url) ? 'gif' : type;

    if (editingPreset) {
      StorageService.updateUserAvatarPreset(editingPreset.id, {
        name: name.trim(),
        url: url.trim(),
        avatarUrl: url.trim(),
        type: detectedType,
        badge: badge.trim() || undefined,
        enabled
      });
      toast.success(`✦ Đã cập nhật avatar "${name}"!`);
    } else {
      StorageService.addUserAvatarPreset({
        name: name.trim(),
        url: url.trim(),
        avatarUrl: url.trim(),
        type: detectedType,
        badge: badge.trim() || undefined,
        enabled
      });
      toast.success(`✦ Đã thêm avatar "${name}" vào thư viện người dùng!`);
    }

    reloadData();
    setIsModalOpen(false);
  };

  const handleToggleEnable = (preset: UserAvatarPreset) => {
    StorageService.updateUserAvatarPreset(preset.id, {
      enabled: !preset.enabled
    });
    reloadData();
    toast.success(preset.enabled ? 'Đã tạm ẩn avatar này.' : 'Đã bật hiển thị avatar này!');
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xoá avatar "${name}"?`)) {
      StorageService.deleteUserAvatarPreset(id);
      reloadData();
      toast.success('Đã xoá avatar.');
    }
  };

  const filteredPresets = presets.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = presets.filter(p => p.enabled).length;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <GlassCard className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-500 text-white flex items-center justify-center font-bold shadow-lg shadow-rose-500/20 shrink-0">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                Thư Viện Avatar Lữ Khách (User Avatar Library)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Quản lý các mẫu ảnh đại diện tĩnh và GIF động (Cloudinary, Imgur, URL trực tiếp, ảnh tải lên) cho lữ khách tuỳ ý chọn lựa.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
              Đang hoạt động: <span className="text-amber-500 font-bold">{activeCount}</span> / {presets.length}
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={handleOpenAdd}
            >
              Thêm Avatar Mới
            </Button>
          </div>
        </div>

        {/* Search Input */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 relative max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên avatar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
          />
        </div>
      </GlassCard>

      {/* Admin Avatar URL Tester Sandbox */}
      <GlassCard className="p-4 sm:p-5 border-indigo-200/50 dark:border-indigo-500/30">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-indigo-600 dark:text-indigo-300">
          <Wrench className="w-4 h-4 text-indigo-500" />
          <span>Công Cụ Thử Nghiệm & Kiểm Định Avatar (Diagnostic Tool)</span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
          Kiểm tra khả năng tải và hiển thị của mọi đường dẫn ảnh (Cloudinary, GIF động, URL có token/query params) trước khi phân phối cho người dùng.
        </p>
        <AvatarInputPreview
          value={testUrl}
          onChange={setTestUrl}
          label="Nhập URL hoặc tải tệp thử nghiệm"
          placeholder="Dán link ảnh (https://res.cloudinary.com/... hoặc https://...)"
          showAdminDiagnostic={true}
        />
      </GlassCard>

      {/* Preset Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredPresets.map((preset) => {
          const presetUrl = preset.url || preset.avatarUrl || '';
          return (
            <GlassCard
              key={preset.id}
              className={`p-3.5 flex flex-col items-center justify-between space-y-3 transition-all relative ${
                preset.enabled 
                  ? 'hover:border-amber-400' 
                  : 'opacity-50 grayscale hover:grayscale-0'
              }`}
            >
              {/* Status Badge */}
              <span className={`absolute top-2 left-2 px-1.5 py-0.2 rounded-md text-[9px] font-bold ${
                preset.enabled 
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
              }`}>
                {preset.enabled ? 'Hoạt động' : 'Tạm ẩn'}
              </span>

              {/* Avatar Preview using Canonical UserAvatar */}
              <div className="mt-3">
                <UserAvatar
                  src={presetUrl}
                  alt={preset.name}
                  size="2xl"
                  shape="rounded"
                  badge={preset.badge}
                  isGif={preset.type === 'gif' || isGifUrl(presetUrl)}
                />
              </div>

              {/* Info */}
              <div className="text-center w-full">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                  {preset.name}
                </h4>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-1 w-full pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => handleToggleEnable(preset)}
                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    preset.enabled 
                      ? 'text-slate-400 hover:text-rose-500 hover:bg-rose-500/10' 
                      : 'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10'
                  }`}
                  title={preset.enabled ? 'Tạm ẩn' : 'Bật hiển thị'}
                >
                  {preset.enabled ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenEdit(preset)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-500/10 transition-colors cursor-pointer"
                  title="Chỉnh sửa"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(preset.id, preset.name)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Xoá avatar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPreset ? '✦ CHỈNH SỬA AVATAR LỮ KHÁCH' : '✦ THÊM AVATAR LỮ KHÁCH MỚI'}
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Tên đại diện Avatar"
            placeholder="Ví dụ: Bé Mèo Sao Băng, Thỏ Trắng Vầng Trăng..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Định dạng hiển thị
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-white/80 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
              >
                <option value="image">Ảnh Tĩnh (PNG / JPG / WEBP)</option>
                <option value="gif">Ảnh Động (GIF)</option>
              </select>
            </div>

            <Input
              label="Huy hiệu nhỏ (tùy chọn)"
              placeholder="VD: VIP, MỚI, EVENT..."
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="enablePreset"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
            />
            <label htmlFor="enablePreset" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              Cho phép lữ khách sử dụng avatar này
            </label>
          </div>

          <AvatarInputPreview
            label="Tệp hình ảnh Avatar hoặc URL"
            value={url}
            onChange={(newUrl) => {
              setUrl(newUrl);
              if (isGifUrl(newUrl)) {
                setType('gif');
              }
            }}
            placeholder="Dán link ảnh (Cloudinary, Imgur, GIF, PNG, JPG)..."
            helperText="Avatar nên có tỉ lệ vuông 1:1 để hiển thị tròn đẹp nhất. Hỗ trợ mọi nguồn ảnh và GIF."
            showAdminDiagnostic={true}
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!name.trim() || !url.trim()}
            >
              {editingPreset ? 'Lưu Thay Đổi' : 'Thêm Vào Thư Viện'}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
