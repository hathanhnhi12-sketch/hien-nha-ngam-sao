import React, { useState, useEffect, useRef } from 'react';
import { UserAvatar } from './UserAvatar';
import { verifyImageLoad, readAvatarFile, normalizeAvatarUrl, isGifUrl, ImageDiagnosticResult } from '../../utils/avatarUtils';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  Upload, 
  Link as LinkIcon, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  HelpCircle, 
  Trash2, 
  Terminal,
  Activity
} from 'lucide-react';

export interface AvatarInputPreviewProps {
  value: string;
  onChange: (newUrl: string) => void;
  label?: string;
  showAdminDiagnostic?: boolean;
  className?: string;
  placeholder?: string;
  helperText?: string;
}

export const AvatarInputPreview: React.FC<AvatarInputPreviewProps> = ({
  value,
  onChange,
  label = 'Ảnh Đại Diện (Avatar)',
  showAdminDiagnostic = false,
  className = '',
  placeholder = 'Dán link ảnh (Cloudinary, Imgur, GIF, PNG, JPG)...',
  helperText = 'Hỗ trợ link ảnh bất kỳ (kể cả Cloudinary, link có tham số), hoặc ảnh GIF động.'
}) => {
  const [activeTab, setActiveTab] = useState<'url' | 'upload'>('url');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [diagnostic, setDiagnostic] = useState<ImageDiagnosticResult | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Re-verify whenever value changes
  useEffect(() => {
    const normalized = normalizeAvatarUrl(value);
    if (!normalized) {
      setStatus('idle');
      setErrorMessage(null);
      setDiagnostic(null);
      return;
    }

    let isCurrent = true;
    setStatus('loading');
    setErrorMessage(null);

    verifyImageLoad(normalized)
      .then((res) => {
        if (!isCurrent) return;
        setDiagnostic(res);
        if (res.valid) {
          setStatus('success');
          setErrorMessage(null);
        } else {
          setStatus('error');
          setErrorMessage(res.error || 'Không thể tải ảnh này. Hãy kiểm tra lại đường dẫn hoặc chọn ảnh khác.');
        }
      })
      .catch(() => {
        if (!isCurrent) return;
        setStatus('error');
        setErrorMessage('Không thể tải ảnh này. Hãy kiểm tra lại đường dẫn hoặc chọn ảnh khác.');
      });

    return () => {
      isCurrent = false;
    };
  }, [value]);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setErrorMessage(null);
    try {
      const res = await readAvatarFile(file, 8);
      if (res.error) {
        setErrorMessage(res.error);
        setStatus('error');
      } else if (res.url) {
        onChange(res.url);
      }
    } catch {
      setErrorMessage('Lỗi khi tải tệp lên từ thiết bị.');
      setStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header and Mode Selector */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
          {label}
        </label>
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl text-[11px]">
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              activeTab === 'url'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-amber-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <LinkIcon className="w-3 h-3" /> Nhập URL
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-amber-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Upload className="w-3 h-3" /> Tải từ thiết bị
          </button>
        </div>
      </div>

      {/* Input or Upload Area */}
      {activeTab === 'url' ? (
        <div className="space-y-1.5">
          <Input
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            icon={<LinkIcon className="w-4 h-4 text-slate-400" />}
          />
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-amber-400 bg-amber-50/20 dark:bg-amber-950/20'
              : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-amber-400/60 bg-white/40 dark:bg-slate-900/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp, image/gif"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          />
          <div className="flex flex-col items-center justify-center gap-2 py-1">
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 dark:bg-amber-400/10 text-indigo-600 dark:text-amber-300 flex items-center justify-center">
              {isUploading ? (
                <div className="w-4 h-4 border-2 border-indigo-600 dark:border-amber-300 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                {isUploading ? 'Đang đọc tệp tin...' : 'Chọn ảnh hoặc kéo thả vào đây'}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                PNG, JPG, WEBP, GIF (Tối đa 8MB)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Helper text */}
      {helperText && !errorMessage && (
        <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
          {helperText}
        </p>
      )}

      {/* LIVE AVATAR PREVIEW CARD */}
      {value && (
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850/80 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Canonical Reusable Avatar */}
              <UserAvatar
                src={value}
                size="xl"
                shape="rounded"
                ring={status === 'success' ? 'gold' : status === 'error' ? 'none' : 'none'}
              />

              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Xem trước Avatar
                  </span>

                  {status === 'loading' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full border border-sky-500 border-t-transparent animate-spin" />
                      Đang tải...
                    </span>
                  )}

                  {status === 'success' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Hợp lệ
                    </span>
                  )}

                  {status === 'error' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Đang dùng ảnh dự phòng
                    </span>
                  )}
                </div>

                <p className="text-[10px] text-slate-400 font-mono truncate max-w-[200px] sm:max-w-xs">
                  {value.startsWith('data:') ? 'Tệp ảnh từ thiết bị' : value}
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange('')}
              className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 p-2 shrink-0"
              title="Xoá avatar này"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          {/* User-friendly error message */}
          {errorMessage && (
            <div className="flex items-start gap-1.5 p-2.5 rounded-xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 text-xs text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-semibold">{errorMessage}</p>
                <p className="text-[11px] opacity-80">
                  Hệ thống sẽ tự động hiển thị ảnh mặc định để giao diện của bạn luôn đẹp mắt.
                </p>
              </div>
            </div>
          )}

          {/* ADMIN DIAGNOSTIC PANEL (Visible only to Admin) */}
          {showAdminDiagnostic && (
            <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700/60 space-y-1.5 font-mono text-[10px] text-slate-600 dark:text-slate-400 bg-slate-900/60 p-2.5 rounded-xl">
              <div className="flex items-center gap-1 text-amber-400 font-bold uppercase tracking-wider mb-1">
                <Terminal className="w-3 h-3" /> Admin Diagnostic Panel
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <div>
                  <span className="text-slate-500">Avatar Source: </span>
                  <span className="text-slate-200">{value.startsWith('data:') ? 'DEVICE_BLOB' : 'EXTERNAL_URL'}</span>
                </div>
                <div>
                  <span className="text-slate-500">Protocol: </span>
                  <span className="text-emerald-400 font-bold">{diagnostic?.protocol || 'DETECTING...'}</span>
                </div>
                <div>
                  <span className="text-slate-500">Detected Type: </span>
                  <span className="text-purple-400 font-bold">{isGifUrl(value) ? 'ANIMATED_GIF' : 'STATIC_IMAGE'}</span>
                </div>
                <div>
                  <span className="text-slate-500">Browser Load: </span>
                  <span className={status === 'success' ? 'text-emerald-400 font-bold' : status === 'error' ? 'text-rose-400 font-bold' : 'text-sky-400'}>
                    {status.toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Fallback Avatar: </span>
                  <span className={status === 'error' ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                    {status === 'error' ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
                {diagnostic?.dimensions && (
                  <div>
                    <span className="text-slate-500">Dimensions: </span>
                    <span className="text-slate-200">{diagnostic.dimensions.width}x{diagnostic.dimensions.height}px</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
