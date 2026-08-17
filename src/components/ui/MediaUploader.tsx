import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, Video, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';

interface MediaUploaderProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  acceptTypes?: ('image' | 'video' | 'gif' | 'audio')[];
  maxSizeMB?: number;
  placeholder?: string;
  helperText?: string;
  className?: string;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  label,
  value,
  onChange,
  acceptTypes = ['image', 'gif'],
  maxSizeMB = 8,
  placeholder = 'Nhập đường dẫn URL hoặc chọn tệp...',
  helperText,
  className = ''
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'url'>('upload');
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedMimeTypes = acceptTypes.map(t => {
    switch (t) {
      case 'image': return 'image/png, image/jpeg, image/webp, image/svg+xml';
      case 'gif': return 'image/gif';
      case 'video': return 'video/mp4, video/webm';
      case 'audio': return 'audio/mp3, audio/mpeg, audio/ogg, audio/wav';
      default: return '*/*';
    }
  }).join(', ');

  const handleFile = (file: File) => {
    setErrorMsg(null);
    if (!file) return;

    // Size validation
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setErrorMsg(`Tệp quá lớn (${(file.size / (1024 * 1024)).toFixed(1)}MB). Giới hạn tối đa là ${maxSizeMB}MB.`);
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onChange(result);
      }
      setIsProcessing(false);
    };
    reader.onerror = () => {
      setErrorMsg('Không thể đọc tệp tin. Vui lòng thử lại.');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const isVideo = value && (value.endsWith('.mp4') || value.endsWith('.webm') || value.startsWith('data:video/'));

  return (
    <div className={`space-y-2.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
            {label}
          </label>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[11px]">
            <button
              type="button"
              onClick={() => setActiveMode('upload')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                activeMode === 'upload'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-amber-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <span className="flex items-center gap-1">
                <Upload className="w-3 h-3" /> Tải tệp lên
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('url')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                activeMode === 'url'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-amber-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <span className="flex items-center gap-1">
                <LinkIcon className="w-3 h-3" /> Nhập URL
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Upload Box Mode */}
      {activeMode === 'upload' ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all duration-200 ${
            dragOver
              ? 'border-amber-400 bg-amber-50/20 dark:bg-amber-950/20 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-amber-400/60 bg-white/40 dark:bg-slate-900/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedMimeTypes}
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          
          <div className="flex flex-col items-center justify-center gap-2 py-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-amber-400/10 text-indigo-600 dark:text-amber-300 flex items-center justify-center">
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-indigo-600 dark:border-amber-300 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                {isProcessing ? 'Đang xử lý tệp tin...' : 'Kéo thả tệp vào đây hoặc nhấn để chọn'}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Hỗ trợ: {acceptTypes.join(', ').toUpperCase()} (Tối đa {maxSizeMB}MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* URL Input Mode */
        <div className="space-y-1.5">
          <Input
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
              setErrorMsg(null);
              onChange(e.target.value);
            }}
            icon={<LinkIcon className="w-4 h-4 text-slate-400" />}
          />
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="flex items-center gap-1.5 text-xs text-rose-500 dark:text-rose-400">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Helper text */}
      {helperText && !errorMsg && (
        <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
          {helperText}
        </p>
      )}

      {/* Preview Card if Value exists */}
      {value && (
        <div className="relative flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 animate-fade-in">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-700/50 flex items-center justify-center">
              {isVideo ? (
                <video src={value} className="w-full h-full object-cover" muted autoPlay loop />
              ) : (
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              )}
            </div>
            <div className="space-y-0.5 overflow-hidden">
              <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Đã nạp tài nguyên</span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-[220px] sm:max-w-xs font-mono">
                {value.startsWith('data:') ? 'Tệp ảnh/video mã hoá cục bộ' : value}
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange('')}
            className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 p-2"
            title="Gỡ bỏ tài nguyên này"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
