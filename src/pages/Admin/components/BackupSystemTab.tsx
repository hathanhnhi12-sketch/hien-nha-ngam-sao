import React, { useState } from 'react';
import { StorageService } from '../../../services/storageService';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { Textarea } from '../../../components/ui/Input';
import { toast } from '../../../stores/useToastStore';
import { 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  FileJson,
  RefreshCw
} from 'lucide-react';

interface BackupSystemTabProps {
  onResetSeedData: () => void;
}

export const BackupSystemTab: React.FC<BackupSystemTabProps> = ({ onResetSeedData }) => {
  const [importJson, setImportJson] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const handleExportBackup = () => {
    try {
      const jsonStr = StorageService.exportFullBackup();
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(jsonStr);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `hien-nha-ngam-sao-cms-backup-${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      toast.success('✦ Đã tải xuống file sao lưu JSON an toàn!');
    } catch (err) {
      toast.error('Lỗi khi xuất file sao lưu.');
    }
  };

  const handleImportBackup = () => {
    if (!importJson.trim()) {
      toast.error('Vui lòng dán chuỗi JSON hợp lệ vào ô bên dưới.');
      return;
    }

    try {
      setIsImporting(true);
      const parsed = JSON.parse(importJson.trim());
      
      if (parsed.characters) StorageService.saveCharacters(parsed.characters);
      if (parsed.siteConfig) StorageService.saveSiteConfig(parsed.siteConfig);
      if (parsed.mediaResources) StorageService.saveMediaResources(parsed.mediaResources);
      if (parsed.playlist) StorageService.savePlaylist(parsed.playlist);
      if (parsed.galleryItems) StorageService.saveGalleryItems(parsed.galleryItems);
      if (parsed.tarotDeck) StorageService.saveTarotDeck(parsed.tarotDeck);
      if (parsed.quotes) StorageService.saveQuotes(parsed.quotes);
      if (parsed.scenarios) StorageService.saveScenarios(parsed.scenarios);
      if (parsed.voteSettings) StorageService.saveVoteSetting(parsed.voteSettings);
      if (parsed.minigameItems) StorageService.saveMinigameItems(parsed.minigameItems);
      if (parsed.loveLetters) StorageService.saveLoveLetters(parsed.loveLetters);
      if (parsed.users) StorageService.saveAllUsers(parsed.users);

      toast.success('✦ Đã phục hồi toàn bộ dữ liệu hệ thống từ file JSON!');
      setImportJson('');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      toast.error('JSON không hợp lệ hoặc có lỗi cấu trúc. Vui lòng kiểm tra lại.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleResetRankings = () => {
    if (window.confirm('Cậu có chắc chắn muốn reset toàn bộ Bảng Xếp Hạng, Lượt Thích và Bình Chọn về 0?')) {
      StorageService.resetAllCharacterHearts();
      StorageService.resetRankingData('vote');
      toast.success('Đã reset toàn bộ lượt thích & bình chọn.');
    }
  };

  const handleResetComments = () => {
    if (window.confirm('Cậu có chắc chắn muốn xoá toàn bộ bình luận dưới tất cả nhân vật?')) {
      StorageService.resetComments();
      toast.success('Đã làm sạch toàn bộ bình luận.');
    }
  };

  const handleResetGarden = () => {
    if (window.confirm('Cậu có chắc chắn muốn làm mới nông trại / minigame?')) {
      StorageService.resetMinigameData();
      toast.success('Đã làm mới dữ liệu nông trại.');
    }
  };

  const handleResetAllSeed = () => {
    if (window.confirm('CẢNH BÁO CAO ĐỘ: Toàn bộ dữ liệu website sẽ được đưa về dữ liệu gốc chuẩn ban đầu của tác giả (gồm 78 lá Tarot, nhân vật mẫu, cấu hình chuẩn). Cậu có chắc muốn tiếp tục?')) {
      onResetSeedData();
      toast.success('✦ Đã khôi phục toàn bộ hệ thống về nguyên bản!');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. BACKUP & RESTORE */}
      <GlassCard className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-slate-800">
          <Database className="w-5 h-5 text-indigo-500" />
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Sao Lưu & Phục Hồi Dữ Liệu Toàn Bộ Website
          </h2>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Xuất toàn bộ cơ sở dữ liệu CMS (Cấu hình, Nhân vật, 78 lá Tarot, Bài hát, Thư viện ảnh, Danh ngôn, Lời nhắn) ra file JSON để lưu trữ an toàn hoặc chuyển sang máy khác.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button
            variant="gold"
            size="md"
            onClick={handleExportBackup}
            icon={<Download className="w-4 h-4" />}
          >
            ✦ Tải Xuống File Sao Lưu Đầy Đủ (.json)
          </Button>
        </div>
      </GlassCard>

      {/* 2. IMPORT BACKUP */}
      <GlassCard className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-slate-800">
          <Upload className="w-5 h-5 text-emerald-500" />
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Nhập & Phục Hồi Dữ Liệu Từ JSON
          </h2>
        </div>

        <Textarea
          placeholder="Dán nội dung file JSON sao lưu vào đây để phục hồi dữ liệu..."
          value={importJson}
          onChange={(e) => setImportJson(e.target.value)}
          rows={4}
        />

        <div className="flex justify-end">
          <Button
            variant="secondary"
            size="md"
            onClick={handleImportBackup}
            disabled={!importJson.trim() || isImporting}
            icon={<FileJson className="w-4 h-4" />}
          >
            Phục Hồi Dữ Liệu Từ JSON
          </Button>
        </div>
      </GlassCard>

      {/* 3. DANGER ZONE RESETS */}
      <GlassCard className="p-5 sm:p-6 space-y-4 border border-rose-500/30">
        <div className="flex items-center gap-2.5 pb-2 border-b border-rose-500/20 text-rose-500">
          <AlertTriangle className="w-5 h-5" />
          <h2 className="text-base font-bold">
            Vùng Nguy Hiểm & Đặt Lại Từng Phần (Selective Resets)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 flex items-center justify-between gap-3 border border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                Reset Bảng Xếp Hạng & Tim
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Đưa toàn bộ loveCount và voteCount về 0
              </p>
            </div>
            <Button size="xs" variant="danger" onClick={handleResetRankings}>
              Reset
            </Button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 flex items-center justify-between gap-3 border border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                Xoá Toàn Bộ Bình Luận
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Làm sạch bình luận dưới các nhân vật
              </p>
            </div>
            <Button size="xs" variant="danger" onClick={handleResetComments}>
              Xoá Hết
            </Button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 flex items-center justify-between gap-3 border border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                Reset Nông Trại Vườn Sao
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Khôi phục ô đất và số lượt đào khoáng
              </p>
            </div>
            <Button size="xs" variant="danger" onClick={handleResetGarden}>
              Làm Mới
            </Button>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-500/10 flex items-center justify-between gap-3 border border-rose-500/30">
            <div>
              <h3 className="text-xs font-bold text-rose-500">
                Khôi Phục Toàn Bộ Seed Gốc
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Reset toàn bộ web về phiên bản ban đầu
              </p>
            </div>
            <Button size="xs" variant="danger" onClick={handleResetAllSeed} icon={<RotateCcw className="w-3 h-3" />}>
              Khôi Phục Gốc
            </Button>
          </div>
        </div>
      </GlassCard>

    </div>
  );
};
