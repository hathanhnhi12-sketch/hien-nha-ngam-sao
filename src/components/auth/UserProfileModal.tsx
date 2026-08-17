import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { StorageService } from '../../services/storageService';
import { UserProfile, GiftHistoryItem, UserAvatarPreset, MailboxMessage } from '../../types';
import { AuthService } from '../../services/authService';
import { AccountService } from '../../services/accountService';
import { toast } from '../../stores/useToastStore';
import { UserAvatar } from '../common/UserAvatar';
import { AvatarPickerModal } from '../common/AvatarPickerModal';
import { 
  Sparkles, 
  Coins, 
  Zap, 
  Flame, 
  Gift, 
  Heart, 
  User, 
  Mail, 
  KeyRound, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2,
  Lock,
  Camera,
  FolderHeart,
  Tag,
  Clock,
  ArrowRight
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  giftHistory: GiftHistoryItem[];
  mailbox?: MailboxMessage[];
  onAdminLoginSuccess?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  giftHistory,
  mailbox = [],
  onAdminLoginSuccess
}) => {
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [nickname, setNickname] = useState(profile.nickname || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [emailInput, setEmailInput] = useState(profile.email || '');
  const [adminPassword, setAdminPassword] = useState('');
  const [isVerifyingAdmin, setIsVerifyingAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'sync' | 'gifts' | 'mailbox' | 'redeem'>('info');
  const [redeemCode, setRedeemCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const avatarPresets: UserAvatarPreset[] = StorageService.getUserAvatarPresets().filter(p => p.enabled);

  useEffect(() => {
    if (isOpen) {
      setDisplayName(profile.displayName);
      setNickname(profile.nickname || '');
      setBio(profile.bio || '');
      setAvatarUrl(profile.avatarUrl);
      setEmailInput(profile.email || '');
      setAdminPassword('');
      setRedeemCode('');
    }
  }, [isOpen, profile]);

  const isOwnerEmail = AuthService.isOwnerEmail(emailInput);

  const handleSaveInfo = () => {
    if (!displayName.trim()) {
      toast.error('Vui lòng nhập tên hiển thị.');
      return;
    }
    const updated: UserProfile = {
      ...profile,
      displayName: displayName.trim().slice(0, 30),
      nickname: nickname.trim().slice(0, 30) || displayName.trim().slice(0, 30),
      bio: bio.trim().slice(0, 150),
      avatarUrl,
      email: emailInput.trim().toLowerCase() || profile.email
    };
    onUpdateProfile(updated);
    AccountService.updatePublicFields(profile.uid, {
      displayName: updated.displayName,
      nickname: updated.nickname,
      bio: updated.bio,
      avatarUrl: updated.avatarUrl
    });
    toast.success('Đã cập nhật hồ sơ thành công ✦');
    onClose();
  };

  const handleLinkAccount = async () => {
    if (!emailInput.trim() || !emailInput.includes('@')) {
      toast.error('Vui lòng nhập định dạng địa chỉ Gmail hợp lệ.');
      return;
    }

    setIsSyncing(true);
    try {
      const synced = await AccountService.linkAccount(emailInput.trim(), profile, (newProfile) => {
        onUpdateProfile(newProfile);
      });
      onUpdateProfile(synced);
      toast.star('✦ Đã liên kết & đồng bộ tài khoản thành công!');
    } catch (e) {
      toast.error('Không thể đồng bộ tài khoản lúc này.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRedeemCode = async () => {
    if (!redeemCode.trim()) {
      toast.error('Vui lòng nhập mã phần thưởng.');
      return;
    }
    setIsRedeeming(true);
    const res = await AccountService.secureAction(profile.uid, 'redeem_code', { codeId: redeemCode.trim() });
    setIsRedeeming(false);
    if (res.success) {
      toast.star(`✦ ${res.message || 'Nhận thưởng thành công!'}`);
      setRedeemCode('');
      if (res.updatedProfile) {
        onUpdateProfile(res.updatedProfile);
      }
    } else {
      toast.error(res.message || 'Mã không hợp lệ, đã hết hạn hoặc đã được nhận.');
    }
  };

  const handleAdminVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPassword) {
      toast.error('Vui lòng nhập mật khẩu quản trị.');
      return;
    }

    setIsVerifyingAdmin(true);
    try {
      const res = await AuthService.loginAdmin(emailInput, adminPassword);
      if (res.success) {
        toast.star('✦ Chào mừng Người Trông Coi trở về với Mái Hiên!');
        onClose();
        if (onAdminLoginSuccess) {
          onAdminLoginSuccess();
        }
      } else {
        toast.error(res.message || 'Thông tin quản trị không hợp lệ.');
      }
    } catch {
      toast.error('Thông tin quản trị không hợp lệ.');
    } finally {
      setIsVerifyingAdmin(false);
    }
  };

  const unreadCount = mailbox.filter(m => !m.isRead).length;
  const unclaimedCount = mailbox.filter(m => m.rewardPackage && m.rewardPackage.rewards.length > 0 && !m.isClaimed).length;

  const expRequired = profile.stats.level * 100;
  const expPercent = Math.min(100, Math.round((profile.stats.exp / expRequired) * 100));

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg" title="✦ HỒ SƠ LỮ KHÁCH ĐÊM">
        <div className="space-y-6">
          
          {/* Profile Banner */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/40 border border-indigo-500/20">
            <div className="relative group">
              <UserAvatar
                src={avatarUrl}
                alt={displayName}
                size="2xl"
                shape="rounded"
                ring="gold"
                level={profile.stats.level}
              />
              <button
                type="button"
                onClick={() => setIsAvatarPickerOpen(true)}
                className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-amber-300 text-[10px] font-bold cursor-pointer backdrop-blur-xs"
                title="Thay đổi ảnh đại diện"
              >
                <Camera className="w-4 h-4 mb-0.5" />
                <span>Đổi Avatar</span>
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  {profile.displayName || 'Lữ Khách Đêm'}
                </h3>
                {AuthService.isAdminLoggedIn() ? (
                  <Badge variant="gold">✦ Người Trông Coi</Badge>
                ) : (
                  <Badge variant="indigo">Lv.{profile.stats.level} Lữ Khách</Badge>
                )}
                {profile.nickname && (
                  <span className="text-xs text-amber-500 font-semibold">
                    @{profile.nickname}
                  </span>
                )}
              </div>
              
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 italic">
                {profile.bio || 'Chưa có lời tự bạch...'}
              </p>

              {/* EXP Bar */}
              <div className="pt-2 max-w-xs mx-auto sm:mx-0">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Kinh Nghiệm</span>
                  <span>{profile.stats.exp}/{expRequired} EXP ({expPercent}%)</span>
                </div>
                <div className="w-full bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${expPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              icon={<Camera className="w-3.5 h-3.5" />}
              onClick={() => setIsAvatarPickerOpen(true)}
            >
              Đổi Avatar
            </Button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <GlassCard className="p-3 text-center space-y-1" variant="subtle">
              <Coins className="w-5 h-5 text-amber-400 mx-auto" />
              <div className="text-xs text-slate-500 dark:text-slate-400">Nguyệt Xu</div>
              <div className="text-base font-bold text-slate-800 dark:text-slate-100">{profile.stats.coins}</div>
            </GlassCard>

            <GlassCard className="p-3 text-center space-y-1" variant="subtle">
              <Sparkles className="w-5 h-5 text-purple-400 mx-auto" />
              <div className="text-xs text-slate-500 dark:text-slate-400">Bụi Sao</div>
              <div className="text-base font-bold text-slate-800 dark:text-slate-100">{profile.stats.stardust}</div>
            </GlassCard>

            <GlassCard className="p-3 text-center space-y-1" variant="subtle">
              <Zap className="w-5 h-5 text-indigo-400 mx-auto" />
              <div className="text-xs text-slate-500 dark:text-slate-400">Năng Lượng</div>
              <div className="text-base font-bold text-slate-800 dark:text-slate-100">{profile.stats.energy}/{profile.stats.maxEnergy}</div>
            </GlassCard>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-indigo-100/60 dark:border-slate-800 overflow-x-auto custom-scrollbar">
            <button
              onClick={() => setActiveTab('info')}
              className={`pb-2.5 px-3.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'info'
                  ? 'border-indigo-600 dark:border-amber-400 text-indigo-600 dark:text-amber-300'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Thông Tin Cá Nhân
            </button>
            <button
              onClick={() => setActiveTab('sync')}
              className={`pb-2.5 px-3.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'sync'
                  ? 'border-indigo-600 dark:border-amber-400 text-indigo-600 dark:text-amber-300'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Lưu Hồ Sơ / Định Danh
            </button>
            <button
              onClick={() => setActiveTab('redeem')}
              className={`pb-2.5 px-3.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'redeem'
                  ? 'border-indigo-600 dark:border-amber-400 text-indigo-600 dark:text-amber-300'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Tag className="w-3.5 h-3.5 text-amber-500" />
              Nhập Code
            </button>
            <button
              onClick={() => setActiveTab('mailbox')}
              className={`pb-2.5 px-3.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'mailbox'
                  ? 'border-indigo-600 dark:border-amber-400 text-indigo-600 dark:text-amber-300'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              Hộp Thư
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-rose-500 text-white font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('gifts')}
              className={`pb-2.5 px-3.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'gifts'
                  ? 'border-indigo-600 dark:border-amber-400 text-indigo-600 dark:text-amber-300'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              Quà Tặng ({giftHistory.length})
            </button>
          </div>

          {/* Tab 1: Profile Info */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Tên hiển thị"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="Nhập tên của bạn..."
                  icon={<User className="w-4 h-4" />}
                />
                <Input
                  label="Biệt danh ẩn danh (Nickname)"
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                  placeholder="Biệt danh hiển thị trên bình luận..."
                  icon={<User className="w-4 h-4" />}
                  helperText="Tên này dùng khi bạn bình luận hoặc gửi đóng góp."
                />
              </div>

              <Input
                label="Lời tự giới thiệu (Bio)"
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Một câu trích dẫn hoặc cảm xúc dưới mái hiên..."
                icon={<Heart className="w-4 h-4" />}
              />

              {/* Fast Preset Picker Grid */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <FolderHeart className="w-3.5 h-3.5 text-amber-500" />
                    <span>Mẫu Avatar Có Sẵn ({avatarPresets.length})</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsAvatarPickerOpen(true)}
                    className="text-xs text-indigo-500 hover:text-indigo-600 dark:text-amber-400 font-semibold cursor-pointer"
                  >
                    + Tải từ thiết bị / Thư viện đầy đủ
                  </button>
                </div>

                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-32 overflow-y-auto p-1 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200/50 dark:border-slate-800 custom-scrollbar">
                  {avatarPresets.slice(0, 16).map((preset) => {
                    const presetUrl = preset.url || preset.avatarUrl || preset.imageUrl || '';
                    const isSelected = avatarUrl === presetUrl;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setAvatarUrl(presetUrl)}
                        className={`relative rounded-xl overflow-hidden p-0.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'ring-2 ring-amber-400 scale-105 shadow-md'
                            : 'opacity-70 hover:opacity-100 hover:scale-105'
                        }`}
                        title={preset.name}
                      >
                        <UserAvatar
                          src={presetUrl}
                          alt={preset.name}
                          size="lg"
                          shape="rounded"
                          badge={preset.badge}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <Button variant="secondary" onClick={onClose}>
                  Đóng
                </Button>
                <Button variant="primary" onClick={handleSaveInfo}>
                  Lưu Thay Đổi
                </Button>
              </div>
            </div>
          )}

          {/* Tab 2: Account Sync & Gmail Linking */}
          {activeTab === 'sync' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-500/30 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-indigo-900 dark:text-amber-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Định Danh & Đồng Bộ Hồ Sơ Lữ Khách</span>
                </div>
                <p className="leading-relaxed">
                  Nhập địa chỉ Gmail để lưu giữ toàn bộ thông tin tài khoản, nông trại, túi đồ, hộp thư thưởng và chuỗi điểm danh xuyên suốt các phiên ghé thăm.
                </p>
                <div className="text-[11px] text-slate-400 italic">
                  * Gmail của bạn được bảo mật tuyệt đối và không bao giờ hiển thị công khai.
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      label="Gmail định danh của bạn"
                      type="email"
                      placeholder="vidu: tenban@gmail.com"
                      value={emailInput}
                      onChange={e => setEmailInput(e.target.value)}
                      icon={<Mail className="w-4 h-4" />}
                    />
                  </div>
                  <div className="pt-6">
                    <Button
                      variant="primary"
                      onClick={handleLinkAccount}
                      disabled={isSyncing || !emailInput.trim()}
                      icon={<CheckCircle2 className="w-4 h-4" />}
                    >
                      {isSyncing ? 'Đang đồng bộ...' : 'Liên Kết Ngay'}
                    </Button>
                  </div>
                </div>

                {profile.email && (
                  <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-300/40 flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Đã liên kết với: <strong className="font-semibold">{profile.email}</strong></span>
                    </div>
                    <Badge variant="emerald">Đã đồng bộ</Badge>
                  </div>
                )}

                {/* DYNAMIC ADMIN DISCOVERY */}
                {isOwnerEmail && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-indigo-500/15 border border-amber-400/40 shadow-lg space-y-3 animate-fade-in">
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-300 font-bold text-xs">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Xác nhận quyền Người Trông Coi (Admin Authorization)</span>
                    </div>

                    <form onSubmit={handleAdminVerify} className="space-y-3">
                      <Input
                        label="Mật khẩu quản trị *"
                        type="password"
                        placeholder="Nhập mật khẩu quản trị..."
                        value={adminPassword}
                        onChange={e => setAdminPassword(e.target.value)}
                        icon={<Lock className="w-4 h-4" />}
                        required
                      />

                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          variant="gold"
                          disabled={isVerifyingAdmin}
                          icon={<KeyRound className="w-4 h-4" />}
                        >
                          {isVerifyingAdmin ? 'Đang xác thực...' : 'Xác nhận quyền quản trị'}
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab: Redeem Code */}
          {activeTab === 'redeem' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border border-amber-400/30 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-300">
                  <Tag className="w-4 h-4" />
                  <span>Trung Tâm Nhập Mã Quà Tặng (Reward Code)</span>
                </div>
                <p className="leading-relaxed">
                  Nhập mã quà tặng từ các sự kiện, phát thưởng trên Discord/Facebook hoặc quà tri ân của Người Trông Coi để nhận xu, bụi sao và vật phẩm giá trị.
                </p>
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Nhập mã thưởng (ví dụ: HIENNHA2026, STARBOX2026)..."
                    value={redeemCode}
                    onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                    icon={<Tag className="w-4 h-4 text-amber-500" />}
                  />
                </div>
                <Button
                  variant="gold"
                  onClick={handleRedeemCode}
                  disabled={isRedeeming || !redeemCode.trim()}
                  icon={<Sparkles className="w-4 h-4" />}
                >
                  {isRedeeming ? 'Đang Kiểm Tra...' : 'Đổi Thưởng'}
                </Button>
              </div>

              {/* Sample Hint Codes */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">
                  Mã quà tặng gợi ý cho lữ khách:
                </div>
                <div className="flex flex-wrap gap-2">
                  {['HIENNHA2026', 'STARBOX2026', 'WELCOMESTAR'].map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setRedeemCode(code)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950/40 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-300 text-xs font-mono font-bold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Gift History */}
          {activeTab === 'gifts' && (
            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
              {giftHistory.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  Bạn chưa tặng món quà nào. Hãy ghé thăm các nhân vật để gửi gắm tình cảm nhé!
                </div>
              ) : (
                giftHistory.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.itemIcon}</span>
                      <div>
                        <span className="font-semibold text-slate-800 dark:text-slate-100">
                          {item.quantity}x {item.itemName}
                        </span>
                        <span className="text-slate-400"> gửi tới </span>
                        <span className="text-indigo-600 dark:text-amber-300 font-medium">
                          {item.characterName}
                        </span>
                      </div>
                    </div>
                    <Badge variant="gold">+{item.affinityGained} Thân thiết</Badge>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 4: Mailbox */}
          {activeTab === 'mailbox' && (
            <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
              {mailbox.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  Hộp thư trống.
                </div>
              ) : (
                mailbox.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex flex-col gap-2 p-3.5 rounded-xl border text-xs transition-colors ${
                      msg.isRead 
                        ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-200/50 dark:border-slate-700/50' 
                        : 'bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-200/50 dark:border-indigo-500/30 shadow-sm'
                    }`}
                    onClick={() => {
                       if (!msg.isRead) {
                          AccountService.markMailAsRead(profile.uid, msg.id);
                       }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        {!msg.isRead && <div className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-amber-400 animate-pulse" />}
                        <span>{msg.title}</span>
                      </div>
                      <div className="text-slate-400 text-[10px] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line text-xs">
                      {msg.message}
                    </div>
                    
                    {msg.rewardPackage && msg.rewardPackage.rewards.length > 0 && (
                      <div className="mt-1 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                        <div className="text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                          Phần thưởng đính kèm:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {msg.rewardPackage.rewards.map((r, idx) => (
                             <div key={idx} className="px-2.5 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg flex items-center gap-1 font-medium text-xs border border-amber-200/40 dark:border-amber-700/30">
                                {r.type === 'coin' && <Coins className="w-3.5 h-3.5" />}
                                {r.type === 'stardust' && <Sparkles className="w-3.5 h-3.5" />}
                                {r.type === 'energy' && <Zap className="w-3.5 h-3.5" />}
                                {r.type === 'exp' && <Sparkles className="w-3.5 h-3.5 text-purple-400" />}
                                +{r.amount} {r.type === 'coin' ? 'Nguyệt Xu' : r.type === 'stardust' ? 'Bụi Sao' : r.type === 'energy' ? 'Năng Lượng' : r.type === 'exp' ? 'EXP' : 'Vật Phẩm'}
                             </div>
                          ))}
                        </div>
                        
                        {!msg.isClaimed && (
                          <div className="mt-2.5 flex justify-end">
                            <Button 
                              variant="gold" 
                              size="sm"
                              onClick={async (e) => {
                                 e.stopPropagation();
                                 const res = await AccountService.claimMailboxReward(profile.uid, msg.id, profile);
                                 if (res.success) {
                                    toast.star('✦ Đã nhận phần thưởng thành công!');
                                    if (res.updatedProfile) {
                                       onUpdateProfile(res.updatedProfile);
                                    }
                                 } else {
                                    toast.error(res.message || 'Có lỗi xảy ra hoặc phần thưởng đã được nhận.');
                                 }
                              }}
                            >
                              Nhận Phần Thưởng
                            </Button>
                          </div>
                        )}
                        {msg.isClaimed && (
                           <div className="mt-2 text-right text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex justify-end items-center gap-1">
                             <CheckCircle2 className="w-3.5 h-3.5" /> Đã nhận thưởng
                           </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </Modal>

      {/* Avatar Picker Modal */}
      <AvatarPickerModal
        isOpen={isAvatarPickerOpen}
        onClose={() => setIsAvatarPickerOpen(false)}
        currentAvatarUrl={avatarUrl}
        onSelectAvatar={(newUrl) => {
          setAvatarUrl(newUrl);
          const updated: UserProfile = {
            ...profile,
            avatarUrl: newUrl
          };
          onUpdateProfile(updated);
          AccountService.updatePublicFields(profile.uid, { avatarUrl: newUrl });
        }}
      />
    </>
  );
};
