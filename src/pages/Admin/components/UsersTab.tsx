import React, { useState } from 'react';
import { UserProfile } from '../../../types';
import { StorageService } from '../../../services/storageService';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { Badge } from '../../../components/ui/Badge';
import { toast } from '../../../stores/useToastStore';
import { UserAvatar } from '../../../components/common/UserAvatar';
import { 
  UserCheck, 
  Search, 
  Edit3, 
  Coins, 
  Sparkles, 
  Zap, 
  Save,
  Shield,
  Clock
} from 'lucide-react';

export const UsersTab: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>(() => StorageService.getAllUsers());
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [displayName, setDisplayName] = useState('');
  const [coins, setCoins] = useState(100);
  const [stardust, setStardust] = useState(50);
  const [energy, setEnergy] = useState(100);
  const [level, setLevel] = useState(1);
  const [customTitle, setCustomTitle] = useState('');

  const handleOpenEdit = (user: UserProfile) => {
    setEditingUser(user);
    setDisplayName(user.displayName);
    setCoins(user.stats?.coins ?? 100);
    setStardust(user.stats?.stardust ?? 50);
    setEnergy(user.stats?.energy ?? 100);
    setLevel(user.stats?.level ?? 1);
    setCustomTitle(user.customTitle || '');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const updated: UserProfile = {
      ...editingUser,
      displayName: displayName.trim() || 'Lữ khách phương xa',
      customTitle: customTitle.trim() || undefined,
      stats: {
        ...editingUser.stats,
        coins: Number(coins),
        stardust: Number(stardust),
        energy: Number(energy),
        level: Number(level)
      }
    };

    StorageService.saveOrUpdateUser(updated);
    setUsers(StorageService.getAllUsers());
    toast.success(`Đã cập nhật thông tin lữ khách ${updated.displayName} ✦`);
    setModalOpen(false);
  };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const uName = (u.displayName || '').toLowerCase();
    const uEmail = (u.email || '').toLowerCase();
    const uId = (u.uid || '').toLowerCase();
    return uName.includes(q) || uEmail.includes(q) || uId.includes(q);
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <GlassCard className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Danh Sách Lữ Khách ({users.length} Tài Khoản)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Xem hồ sơ lữ khách ghé thăm, điều chỉnh Xu Ánh Sao, Bụi Sao và Danh hiệu.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 max-w-sm">
          <Input
            placeholder="Tìm theo biệt danh, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
      </GlassCard>

      {/* Users List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((user) => (
          <GlassCard key={user.uid} className="p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <UserAvatar
                    src={user.avatarUrl}
                    alt={user.displayName}
                    size="md"
                    shape="rounded"
                    ring="slate"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        {user.displayName}
                      </h3>
                      {user.email === 'thanhnhi12@gmail.com' && (
                        <Badge variant="gold">OWNER</Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono truncate">
                      {user.email || user.uid}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Cấp {user.stats?.level || 1}
                </span>
              </div>

              {/* Currencies */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 text-xs font-semibold text-center">
                <div className="text-amber-500 flex flex-col items-center">
                  <span className="text-[10px] text-slate-400 font-normal">Xu Sao</span>
                  <span>{user.stats?.coins || 0}</span>
                </div>
                <div className="text-purple-500 flex flex-col items-center">
                  <span className="text-[10px] text-slate-400 font-normal">Bụi Sao</span>
                  <span>{user.stats?.stardust || 0}</span>
                </div>
                <div className="text-emerald-500 flex flex-col items-center">
                  <span className="text-[10px] text-slate-400 font-normal">Năng Lượng</span>
                  <span>{user.stats?.energy || 100}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                size="xs"
                variant="secondary"
                onClick={() => handleOpenEdit(user)}
                icon={<Edit3 className="w-3 h-3" />}
              >
                Chỉnh Sửa Số Dư & Thông Tin
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          maxWidth="md"
          title={`✦ Điều Chỉnh Tài Khoản: ${editingUser.displayName}`}
        >
          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Tên hiển thị / Biệt danh"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />

            <Input
              label="Danh hiệu tuỳ chỉnh"
              placeholder="Ví dụ: Người Ngắm Sao Đêm Khuya"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="number"
                label="Số Dư Xu Ánh Sao"
                value={coins}
                onChange={(e) => setCoins(Number(e.target.value))}
                icon={<Coins className="w-4 h-4 text-amber-500" />}
              />
              <Input
                type="number"
                label="Số Dư Bụi Sao (Stardust)"
                value={stardust}
                onChange={(e) => setStardust(Number(e.target.value))}
                icon={<Sparkles className="w-4 h-4 text-purple-500" />}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="number"
                label="Năng Lượng Hiện Tại"
                value={energy}
                onChange={(e) => setEnergy(Number(e.target.value))}
                icon={<Zap className="w-4 h-4 text-emerald-500" />}
              />
              <Input
                type="number"
                label="Cấp Độ Lữ Khách"
                value={level}
                onChange={(e) => setLevel(Number(e.target.value))}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
                Huỷ
              </Button>
              <Button type="submit" variant="gold" icon={<Save className="w-4 h-4" />}>
                Lưu Thay Đổi
              </Button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
