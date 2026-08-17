import React, { useState } from 'react';
import { VoteSetting } from '../../../types';
import { StorageService } from '../../../services/storageService';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { Input, Textarea } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { toast } from '../../../stores/useToastStore';
import { 
  Vote, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  FileText,
  AlertTriangle
} from 'lucide-react';

export const VoteConfigTab: React.FC = () => {
  const [setting, setSetting] = useState<VoteSetting>(() => StorageService.getVoteSetting());
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      StorageService.saveVoteSetting(setting);
      toast.success('✦ Đã cập nhật cài đặt bình chọn thành công!');
    } catch (err) {
      toast.error('Có lỗi xảy ra khi lưu cài đặt bình chọn.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleOpen = () => {
    const nextState = !setting.isOpen;
    setSetting({ ...setting, isOpen: nextState });
    StorageService.saveVoteSetting({ ...setting, isOpen: nextState });
    toast.success(nextState ? '✦ Đã MỞ CỔNG Bình Chọn cho lữ khách!' : '✦ Đã ĐÓNG CỔNG Bình Chọn (Chưa phát hành)');
  };

  const handleResetVotes = () => {
    if (window.confirm('CẢNH BÁO: Thao tác này sẽ reset toàn bộ số lượt bình chọn (voteCount) của tất cả nhân vật về 0. Cậu có chắc không?')) {
      StorageService.resetRankingData('vote');
      setSetting(prev => ({ ...prev, totalVotes: 0 }));
      toast.success('Đã reset toàn bộ phiếu bình chọn về 0.');
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      
      {/* 1. MASTER TOGGLE & STATUS */}
      <GlassCard className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Vote className="w-5 h-5 text-indigo-500" />
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Trạng Thái Cổng Bình Chọn Ánh Sao
              </h2>
              <Badge variant={setting.isOpen ? 'open' : 'unreleased'}>
                {setting.isOpen ? '✦ ĐANG MỞ BÌNH CHỌN' : '✦ ĐANG ĐÓNG (CHƯA PHÁT HÀNH)'}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Khi đóng, lữ khách truy cập tab "Bình Chọn" sẽ thấy màn hình thông báo "Chưa Phát Hành" và không thể bỏ phiếu.
            </p>
          </div>

          <Button
            type="button"
            variant={setting.isOpen ? 'danger' : 'gold'}
            size="md"
            onClick={handleToggleOpen}
            icon={setting.isOpen ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          >
            {setting.isOpen ? 'Đóng Cổng Bình Chọn' : 'Mở Cổng Bình Chọn'}
          </Button>
        </div>
      </GlassCard>

      {/* 2. ELECTION INFORMATION & RULES */}
      <GlassCard className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-slate-800">
          <FileText className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Thông Tin & Thể Lệ Bình Chọn
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Tiêu đề cuộc bình chọn *"
            value={setting.title}
            onChange={(e) => setSetting({ ...setting, title: e.target.value })}
            placeholder="Bình Chọn Nhân Vật Được Yêu Thích Nhất Mùa Này"
            required
          />

          <Input
            label="Phụ đề / Mô tả ngắn"
            value={setting.description}
            onChange={(e) => setSetting({ ...setting, description: e.target.value })}
            placeholder="Hãy gửi lá phiếu ánh sao của bạn tới nhân vật đã sưởi ấm tâm hồn bạn..."
          />
        </div>

        <Textarea
          label="Thể lệ & Quy định bình chọn"
          value={setting.rules || ''}
          onChange={(e) => setSetting({ ...setting, rules: e.target.value })}
          placeholder="Mỗi lữ khách được gửi 1 lá phiếu ánh sao mỗi ngày. Kết quả sẽ được công bố vào đêm trăng tròn..."
          rows={3}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Thời gian bắt đầu (Tuỳ chọn)"
            value={setting.startDate || ''}
            onChange={(e) => setSetting({ ...setting, startDate: e.target.value })}
            placeholder="01/01/2026"
            icon={<Calendar className="w-4 h-4" />}
          />

          <Input
            label="Thời gian kết thúc (Tuỳ chọn)"
            value={setting.endDate || ''}
            onChange={(e) => setSetting({ ...setting, endDate: e.target.value })}
            placeholder="31/12/2026"
            icon={<Calendar className="w-4 h-4" />}
          />
        </div>
      </GlassCard>

      {/* 3. METRICS & DANGER RESET */}
      <GlassCard className="p-5 sm:p-6 space-y-4" variant="subtle">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Tổng số phiếu bình chọn đã ghi nhận: <span className="text-amber-500 font-extrabold">{setting.totalVotes || 0} phiếu</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Số phiếu tích luỹ từ tất cả các nhân vật trên hệ thống.
            </p>
          </div>

          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={handleResetVotes}
            icon={<AlertTriangle className="w-4 h-4" />}
          >
            Reset Tất Cả Phiếu Về 0
          </Button>
        </div>
      </GlassCard>

      {/* ACTION SAVE BAR */}
      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          variant="gold"
          size="md"
          loading={isSaving}
          icon={<Save className="w-4 h-4" />}
        >
          ✦ Lưu Toàn Bộ Cài Đặt Bình Chọn
        </Button>
      </div>

    </form>
  );
};
