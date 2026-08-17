import React, { useState } from 'react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { StorageService } from '../../../services/storageService';
import { AccountService } from '../../../services/accountService';
import { RewardCode, RewardBoxItem, RewardItem, RewardPackage, UserProfile } from '../../../types';
import { toast } from '../../../stores/useToastStore';
import { 
  Gift, 
  Plus, 
  Edit3, 
  Trash2, 
  Send, 
  Sparkles, 
  Coins, 
  Zap, 
  Tag, 
  Dice5, 
  Package, 
  Clock, 
  Copy, 
  Users, 
  CheckCircle2,
  Mail,
  ToggleLeft,
  ToggleRight,
  Flame
} from 'lucide-react';

export const RewardCodesTab: React.FC = () => {
  const [codes, setCodes] = useState<RewardCode[]>(() => StorageService.getRewardCodes());
  const [redemptions, setRedemptions] = useState(() => StorageService.getRedemptions());
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => StorageService.getAllUsers());

  // Code Editor Modal
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [editingCodeId, setEditingCodeId] = useState<string | null>(null);
  
  // Form State
  const [codeStr, setCodeStr] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rewardType, setRewardType] = useState<'direct' | 'random_box'>('direct');
  
  // Direct package amounts
  const [coinAmount, setCoinAmount] = useState<number>(500);
  const [stardustAmount, setStardustAmount] = useState<number>(100);
  const [energyAmount, setEnergyAmount] = useState<number>(50);
  const [expAmount, setExpAmount] = useState<number>(200);

  // Random Box Pool
  const [poolItems, setPoolItems] = useState<RewardBoxItem[]>([
    { id: 'pool_1', name: '1,000 Nguyệt Xu', reward: { type: 'coin', amount: 1000 }, weight: 40 },
    { id: 'pool_2', name: '200 Bụi Sao Lấp Lánh', reward: { type: 'stardust', amount: 200 }, weight: 30 },
    { id: 'pool_3', name: '100 Năng Lượng Tinh Tú', reward: { type: 'energy', amount: 100 }, weight: 20 },
    { id: 'pool_4', name: '500 EXP Tiến Hoá', reward: { type: 'exp', amount: 500 }, weight: 10 }
  ]);

  const [maxUses, setMaxUses] = useState<string>('500');
  const [expiresInDays, setExpiresInDays] = useState<string>('30');
  const [isActive, setIsActive] = useState(true);

  // Direct Mail Sender Modal
  const [isMailModalOpen, setIsMailModalOpen] = useState(false);
  const [mailTarget, setMailTarget] = useState<'all' | 'specific'>('all');
  const [targetUserId, setTargetUserId] = useState('');
  const [mailTitle, setMailTitle] = useState('✦ Quà Tặng Tri Ân Từ Người Trông Coi');
  const [mailContent, setMailContent] = useState('Cảm ơn bạn đã luôn đồng hành và thắp sáng mái hiên đêm. Món quà nhỏ này hy vọng sẽ mang lại niềm vui cho bạn!');
  const [mailCoins, setMailCoins] = useState(500);
  const [mailStardust, setMailStardust] = useState(100);
  const [mailEnergy, setMailEnergy] = useState(50);
  const [mailExp, setMailExp] = useState(200);
  const [isSendingMail, setIsSendingMail] = useState(false);

  const refreshData = () => {
    setCodes(StorageService.getRewardCodes());
    setRedemptions(StorageService.getRedemptions());
    setAllUsers(StorageService.getAllUsers());
  };

  const handleOpenCreateCode = () => {
    setEditingCodeId(null);
    setCodeStr('');
    setName('');
    setDescription('');
    setRewardType('direct');
    setCoinAmount(500);
    setStardustAmount(100);
    setEnergyAmount(50);
    setExpAmount(200);
    setMaxUses('500');
    setExpiresInDays('30');
    setIsActive(true);
    setIsCodeModalOpen(true);
  };

  const handleOpenEditCode = (code: RewardCode) => {
    setEditingCodeId(code.id);
    setCodeStr(code.code);
    setName(code.name);
    setDescription(code.description);
    setRewardType(code.rewardType);

    if (code.rewardPackage) {
      const c = code.rewardPackage.rewards.find(r => r.type === 'coin')?.amount || 0;
      const s = code.rewardPackage.rewards.find(r => r.type === 'stardust')?.amount || 0;
      const e = code.rewardPackage.rewards.find(r => r.type === 'energy')?.amount || 0;
      const x = code.rewardPackage.rewards.find(r => r.type === 'exp')?.amount || 0;
      setCoinAmount(c);
      setStardustAmount(s);
      setEnergyAmount(e);
      setExpAmount(x);
    }
    if (code.rewardPool) {
      setPoolItems(code.rewardPool);
    }
    setMaxUses(code.maxUses !== null ? String(code.maxUses) : '');
    setExpiresInDays(code.expiresAt ? String(Math.max(1, Math.round((code.expiresAt - Date.now()) / 86400000))) : '');
    setIsActive(code.isActive);
    setIsCodeModalOpen(true);
  };

  const handleSaveCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeStr.trim()) {
      toast.error('Vui lòng nhập mã quà tặng.');
      return;
    }
    if (!name.trim()) {
      toast.error('Vui lòng nhập tên gói quà.');
      return;
    }

    const normalized = codeStr.trim().toUpperCase();
    const expiryTimestamp = expiresInDays && Number(expiresInDays) > 0 
      ? Date.now() + Number(expiresInDays) * 86400000 
      : null;
    const maxUsesNum = maxUses && Number(maxUses) > 0 ? Number(maxUses) : null;

    const directRewards: RewardItem[] = [];
    if (coinAmount > 0) directRewards.push({ type: 'coin', amount: coinAmount });
    if (stardustAmount > 0) directRewards.push({ type: 'stardust', amount: stardustAmount });
    if (energyAmount > 0) directRewards.push({ type: 'energy', amount: energyAmount });
    if (expAmount > 0) directRewards.push({ type: 'exp', amount: expAmount });

    const codeData: Omit<RewardCode, 'createdAt' | 'currentUses'> = {
      id: normalized,
      code: normalized,
      name: name.trim(),
      description: description.trim(),
      rewardType,
      rewardPackage: rewardType === 'direct' ? { rewards: directRewards } : undefined,
      rewardPool: rewardType === 'random_box' ? poolItems : undefined,
      maxUses: maxUsesNum,
      expiresAt: expiryTimestamp,
      isActive,
      isOneUsePerAccount: true
    };

    if (editingCodeId) {
      StorageService.updateRewardCode(editingCodeId, codeData);
      toast.success(`Đã cập nhật mã ${normalized}!`);
    } else {
      StorageService.addRewardCode(codeData);
      toast.star(`✦ Đã phát hành mã quà tặng mới: ${normalized}!`);
    }

    setIsCodeModalOpen(false);
    refreshData();
  };

  const handleDeleteCode = (id: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa mã "${id}" không?`)) {
      StorageService.deleteRewardCode(id);
      toast.success('Đã xóa mã quà tặng.');
      refreshData();
    }
  };

  const handleToggleCodeActive = (code: RewardCode) => {
    StorageService.updateRewardCode(code.id, { isActive: !code.isActive });
    toast.success(`Đã ${!code.isActive ? 'kích hoạt' : 'tạm dừng'} mã ${code.code}`);
    refreshData();
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép mã: ${text}`);
  };

  // Send Direct Mail to Mailbox
  const handleSendDirectMail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mailTitle.trim() || !mailContent.trim()) {
      toast.error('Vui lòng nhập tiêu đề và nội dung thư.');
      return;
    }

    const rewards: RewardItem[] = [];
    if (mailCoins > 0) rewards.push({ type: 'coin', amount: mailCoins });
    if (mailStardust > 0) rewards.push({ type: 'stardust', amount: mailStardust });
    if (mailEnergy > 0) rewards.push({ type: 'energy', amount: mailEnergy });
    if (mailExp > 0) rewards.push({ type: 'exp', amount: mailExp });

    const rewardPackage: RewardPackage = { rewards };
    setIsSendingMail(true);

    try {
      if (mailTarget === 'specific') {
        if (!targetUserId.trim()) {
          toast.error('Vui lòng chọn hoặc nhập User ID người nhận.');
          setIsSendingMail(false);
          return;
        }
        await AccountService.sendDirectReward(
          'thanhnhi12@gmail.com',
          targetUserId.trim(),
          mailTitle.trim(),
          mailContent.trim(),
          rewardPackage
        );
        toast.star(`✦ Đã gửi thư thưởng tới lữ khách (${targetUserId})!`);
      } else {
        // Send to all known users + current local user
        const targetIds = Array.from(new Set([
          ...allUsers.map(u => u.uid),
          StorageService.getUserProfile().uid
        ]));
        
        for (const uid of targetIds) {
          StorageService.sendDirectMailboxReward(
            uid,
            mailTitle.trim(),
            mailContent.trim(),
            rewardPackage
          );
        }
        toast.star(`✦ Đã phát thư thưởng đồng loạt tới ${targetIds.length} lữ khách!`);
      }

      setIsMailModalOpen(false);
      refreshData();
    } catch (e) {
      toast.error('Gửi thư không thành công.');
    } finally {
      setIsSendingMail(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Controls */}
      <GlassCard variant="porch" className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-400" />
              Trung Tâm Quản Lý Mã Thưởng & Hộp Thư (Gift Codes & Mailbox)
            </h2>
            <Badge variant="gold">{codes.length} Mã</Badge>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Tạo giftcode tặng quà trực tiếp hoặc hộp quà may mắn (Random Box) với tỉ lệ rớt vật phẩm linh hoạt.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            icon={<Send className="w-4 h-4 text-indigo-400" />}
            onClick={() => setIsMailModalOpen(true)}
          >
            Gửi Thư Trực Tiếp
          </Button>
          <Button
            variant="gold"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleOpenCreateCode}
          >
            Tạo Mã Mới
          </Button>
        </div>
      </GlassCard>

      {/* Codes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {codes.map((code) => {
          const isExpired = code.expiresAt && code.expiresAt < Date.now();
          const isLimitReached = code.maxUses !== null && code.currentUses >= code.maxUses;

          return (
            <GlassCard key={code.id} className="p-4 flex flex-col justify-between space-y-3 relative overflow-hidden" variant="subtle">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-500 dark:text-amber-300 font-mono font-bold text-sm tracking-wide border border-amber-500/30">
                      {code.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(code.code)}
                      className="p-1 text-slate-400 hover:text-amber-400 transition-colors"
                      title="Sao chép mã"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    {code.rewardType === 'random_box' ? (
                      <Badge variant="purple">Hộp Ngẫu Nhiên</Badge>
                    ) : (
                      <Badge variant="indigo">Gói Thưởng Trực Tiếp</Badge>
                    )}
                    {code.isActive && !isExpired && !isLimitReached ? (
                      <Badge variant="emerald">Hoạt động</Badge>
                    ) : (
                      <Badge variant="danger">
                        {isExpired ? 'Hết hạn' : isLimitReached ? 'Hết lượt' : 'Tạm dừng'}
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{code.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                    {code.description}
                  </p>
                </div>

                {/* Reward Preview */}
                <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800 text-xs space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {code.rewardType === 'random_box' ? 'Danh sách vật phẩm rơi:' : 'Phần thưởng chắc chắn nhận:'}
                  </div>

                  {code.rewardType === 'random_box' && code.rewardPool ? (
                    <div className="space-y-1">
                      {code.rewardPool.map((p) => (
                        <div key={p.id} className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-700 dark:text-slate-300 font-medium">✦ {p.name}</span>
                          <span className="text-purple-500 dark:text-purple-400 font-mono font-bold">({p.weight}%)</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {code.rewardPackage?.rewards.map((r, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold text-[11px]">
                          +{r.amount} {r.type === 'coin' ? 'Nguyệt Xu' : r.type === 'stardust' ? 'Bụi Sao' : r.type === 'energy' ? 'Năng Lượng' : 'EXP'}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Uses & Expiry */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Đã dùng: <strong className="text-slate-700 dark:text-slate-200">{code.currentUses}</strong>
                    {code.maxUses !== null && ` / ${code.maxUses}`}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {code.expiresAt ? new Date(code.expiresAt).toLocaleDateString() : 'Vô thời hạn'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => handleToggleCodeActive(code)}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
                >
                  {code.isActive ? (
                    <>
                      <ToggleRight className="w-4 h-4 text-emerald-500" /> Tạm dừng
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-4 h-4 text-slate-400" /> Kích hoạt
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Edit3 className="w-3.5 h-3.5" />}
                    onClick={() => handleOpenEditCode(code)}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-rose-500 hover:text-rose-600"
                    icon={<Trash2 className="w-3.5 h-3.5" />}
                    onClick={() => handleDeleteCode(code.id)}
                  >
                    Xóa
                  </Button>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Redemptions Log Card */}
      <GlassCard className="p-5 space-y-3" variant="subtle">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Lịch Sử Lữ Khách Đã Nhập Code ({redemptions.length})
          </h3>
          <span className="text-xs text-slate-400">Ghi nhận tức thời</span>
        </div>

        <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-2">
          {redemptions.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400">
              Chưa có lượt nhập mã nào.
            </div>
          ) : (
            redemptions.slice().reverse().map((redemp) => (
              <div
                key={redemp.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {redemp.userNickname || 'Lữ Khách'}
                  </span>
                  <span className="text-slate-400">nhập mã</span>
                  <span className="font-mono font-bold text-amber-500">
                    {redemp.code}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {new Date(redemp.redeemedAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </GlassCard>

      {/* Modal: Create/Edit Code */}
      <Modal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        title={editingCodeId ? '✦ CHỈNH SỬA MÃ QUÀ TẶNG' : '✦ PHÁT HÀNH MÃ QUÀ TẶNG MỚI'}
        maxWidth="lg"
      >
        <form onSubmit={handleSaveCode} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Mã quà tặng (Uppercase) *"
              placeholder="ví dụ: HIENNHA2026, SUMMERBOX"
              value={codeStr}
              onChange={(e) => setCodeStr(e.target.value.toUpperCase())}
              icon={<Tag className="w-4 h-4 text-amber-500" />}
              required
            />
            <Input
              label="Tên hiển thị gói quà *"
              placeholder="ví dụ: Quà Mừng Lữ Khách"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <Input
            label="Mô tả quà tặng"
            placeholder="Lời nhắn gửi khi nhận quà..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Reward Type Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Loại hình phần thưởng:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRewardType('direct')}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                  rewardType === 'direct'
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Package className="w-4 h-4 text-indigo-400" />
                <div>
                  <div className="text-xs font-bold">Gói Thưởng Trực Tiếp</div>
                  <div className="text-[10px] text-slate-400">Tặng cố định xu, bụi sao, EXP</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRewardType('random_box')}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                  rewardType === 'random_box'
                    ? 'border-purple-500 bg-purple-500/10 text-purple-400 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Dice5 className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="text-xs font-bold">Hộp Quà May Mắn (Random Box)</div>
                  <div className="text-[10px] text-slate-400">Rơi ngẫu nhiên theo tỉ lệ %</div>
                </div>
              </button>
            </div>
          </div>

          {/* Direct Reward Package Inputs */}
          {rewardType === 'direct' ? (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800 space-y-3">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Thiết lập số lượng phần thưởng:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Input
                  label="Nguyệt Xu"
                  type="number"
                  value={coinAmount}
                  onChange={(e) => setCoinAmount(Math.max(0, Number(e.target.value)))}
                />
                <Input
                  label="Bụi Sao"
                  type="number"
                  value={stardustAmount}
                  onChange={(e) => setStardustAmount(Math.max(0, Number(e.target.value)))}
                />
                <Input
                  label="Năng Lượng"
                  type="number"
                  value={energyAmount}
                  onChange={(e) => setEnergyAmount(Math.max(0, Number(e.target.value)))}
                />
                <Input
                  label="Điểm EXP"
                  type="number"
                  value={expAmount}
                  onChange={(e) => setExpAmount(Math.max(0, Number(e.target.value)))}
                />
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-800/40 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-purple-700 dark:text-purple-300">
                <span>Danh Sách Vật Phẩm & Tỉ Lệ Rơi (%):</span>
                <span className="text-[11px] text-purple-400">Tổng trọng số: {poolItems.reduce((a,b)=>a+b.weight,0)}%</span>
              </div>

              <div className="space-y-2">
                {poolItems.map((item, idx) => (
                  <div key={item.id} className="flex items-center gap-2 text-xs">
                    <input
                      type="text"
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                      value={item.name}
                      onChange={(e) => {
                        const next = [...poolItems];
                        next[idx].name = e.target.value;
                        setPoolItems(next);
                      }}
                      placeholder="Tên phần thưởng..."
                    />
                    <div className="w-24 flex items-center gap-1">
                      <input
                        type="number"
                        className="w-16 px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-center font-bold"
                        value={item.weight}
                        onChange={(e) => {
                          const next = [...poolItems];
                          next[idx].weight = Number(e.target.value);
                          setPoolItems(next);
                        }}
                      />
                      <span className="text-slate-400">%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Limits & Expiration */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Giới hạn tổng số lượt nhận"
              type="number"
              placeholder="Để trống = Không giới hạn"
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              helperText="Ví dụ: 500 lượt đổi"
            />
            <Input
              label="Thời hạn sử dụng (Số ngày kể từ hôm nay)"
              type="number"
              placeholder="Để trống = Vĩnh viễn"
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(e.target.value)}
              helperText="Ví dụ: 30 ngày"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setIsCodeModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="gold">
              {editingCodeId ? 'Cập Nhật Mã' : 'Phát Hành Mã'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Send Direct Mail to Mailbox */}
      <Modal
        isOpen={isMailModalOpen}
        onClose={() => setIsMailModalOpen(false)}
        title="✦ GỬI THƯ THƯỞNG TRỰC TIẾP TỚI HỘP THƯ (MAILBOX)"
        maxWidth="md"
      >
        <form onSubmit={handleSendDirectMail} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Đối tượng nhận thư:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMailTarget('all')}
                className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-colors cursor-pointer ${
                  mailTarget === 'all'
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Gửi toàn bộ Lữ Khách
              </button>
              <button
                type="button"
                onClick={() => setMailTarget('specific')}
                className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-colors cursor-pointer ${
                  mailTarget === 'specific'
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Lữ khách cụ thể
              </button>
            </div>
          </div>

          {mailTarget === 'specific' && (
            <Input
              label="User ID hoặc Gmail lữ khách *"
              placeholder="ví dụ: user_123 hoặc email@gmail.com"
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              required
            />
          )}

          <Input
            label="Tiêu đề thư *"
            placeholder="Tiêu đề thư thưởng..."
            value={mailTitle}
            onChange={(e) => setMailTitle(e.target.value)}
            required
          />

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Nội dung thư *
            </label>
            <textarea
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-amber-400 focus:outline-none min-h-[80px]"
              placeholder="Lời nhắn gửi..."
              value={mailContent}
              onChange={(e) => setMailContent(e.target.value)}
              required
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800 space-y-2">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Phần thưởng đính kèm thư:
            </div>
            <div className="grid grid-cols-4 gap-2">
              <Input
                label="Nguyệt Xu"
                type="number"
                value={mailCoins}
                onChange={(e) => setMailCoins(Math.max(0, Number(e.target.value)))}
              />
              <Input
                label="Bụi Sao"
                type="number"
                value={mailStardust}
                onChange={(e) => setMailStardust(Math.max(0, Number(e.target.value)))}
              />
              <Input
                label="Năng Lượng"
                type="number"
                value={mailEnergy}
                onChange={(e) => setMailEnergy(Math.max(0, Number(e.target.value)))}
              />
              <Input
                label="EXP"
                type="number"
                value={mailExp}
                onChange={(e) => setMailExp(Math.max(0, Number(e.target.value)))}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setIsMailModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="gold" disabled={isSendingMail} icon={<Send className="w-4 h-4" />}>
              {isSendingMail ? 'Đang gửi thư...' : 'Gửi Thư & Phần Thưởng'}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
