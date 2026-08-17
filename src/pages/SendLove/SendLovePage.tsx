import React, { useState } from 'react';
import { LoveLetter, Character, StickerItem } from '../../types';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { StickerPicker } from '../../components/ui/StickerPicker';
import { toast } from '../../stores/useToastStore';
import { 
  HeartHandshake, 
  Heart, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  MailCheck, 
  Lock,
  Smile,
  Image as ImageIcon,
  Upload,
  X
} from 'lucide-react';

interface SendLovePageProps {
  loveLetters: LoveLetter[];
  characters: Character[];
  onAddLetter: (letter: LoveLetter) => void;
  onLikeLetter?: (id: string) => void;
  isAdmin?: boolean;
  onDeleteLetter?: (id: string) => void;
  onReplyLetter?: (id: string, reply: string) => void;
}

export const SendLovePage: React.FC<SendLovePageProps> = ({
  characters,
  onAddLetter
}) => {
  const [senderName, setSenderName] = useState('');
  const [recipient, setRecipient] = useState('Hiên Nhà Ngắm Sao');
  const [message, setMessage] = useState('');
  const [mood, setMood] = useState('Bình yên');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedSticker, setSelectedSticker] = useState<StickerItem | null>(null);
  const [isStickerPickerOpen, setIsStickerPickerOpen] = useState(false);
  const [isImageInputOpen, setIsImageInputOpen] = useState(false);
  const [isSentSuccess, setIsSentSuccess] = useState(false);

  const moods = ['Bình yên', 'Ấm áp', 'Hạnh phúc', 'Biết ơn', 'Nhớ nhung', 'Hy vọng'];

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước ảnh đính kèm tối đa 5MB.');
      return;
    }

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      toast.error('Chỉ chấp nhận file ảnh JPG, PNG, WEBP hoặc GIF.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      setImageUrl(base64);
      toast.success('Đã đính kèm ảnh vào bức thư!');
      setIsImageInputOpen(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !imageUrl && !selectedSticker) {
      toast.error('Vui lòng nhập nội dung lời nhắn, đính kèm ảnh hoặc sticker.');
      return;
    }

    const newLetter: LoveLetter = {
      id: 'letter_' + Date.now(),
      senderName: senderName.trim() || 'Một Lữ Khách',
      author: senderName.trim() || 'Một Lữ Khách',
      recipient: recipient.trim() || 'Hiên Nhà Ngắm Sao',
      toCharacter: recipient.trim() || 'Hiên Nhà Ngắm Sao',
      content: message.trim(),
      message: message.trim(),
      mood,
      imageUrl: imageUrl || undefined,
      stickerUrl: selectedSticker?.assetUrl,
      stickerName: selectedSticker?.name,
      likes: 0,
      isPinned: false,
      isArchived: false,
      isRead: false,
      isPublic: false, // Strictly private mailbox!
      createdAt: Date.now()
    };

    onAddLetter(newLetter);
    setIsSentSuccess(true);
    toast.star('Bức thư của bạn đã được gửi an toàn vào Hòm Thư Mái Hiên ✦');
    setMessage('');
    setSenderName('');
    setImageUrl('');
    setSelectedSticker(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-4">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-600 dark:text-pink-300 text-xs font-semibold backdrop-blur-md">
          <HeartHandshake className="w-3.5 h-3.5" /> Hòm Thư Kín Mái Hiên
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 font-display">
          Gửi Lời Yêu Thương
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Nơi gửi gắm những lời nhắn chân thành, ấm áp đến nhân vật hoặc người trông coi hiên nhà. Mọi bức thư đều được giữ kín và bảo mật riêng tư ✦
        </p>
      </div>

      {/* Success Banner */}
      {isSentSuccess && (
        <div className="p-5 sm:p-6 rounded-3xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-900 dark:text-emerald-200 flex items-start gap-4 animate-fade-in">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
            <MailCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold">Bức thư đã được trao gửi thành công!</h4>
            <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
              Bức thư của bạn đã được trao gửi an toàn vào Hòm Thư Mái Hiên. Lời nhắn sẽ được giữ kín và chuyển tới người trông coi hiên nhà ✦
            </p>
            <button
              onClick={() => setIsSentSuccess(false)}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-300 underline pt-1 block cursor-pointer"
            >
              Gửi thêm một bức thư khác
            </button>
          </div>
        </div>
      )}

      {/* Private Submission Card */}
      <GlassCard className="p-6 sm:p-8 max-w-2xl mx-auto border-pink-200/50 dark:border-pink-500/20 shadow-xl" variant="glow">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-pink-100/60 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <Lock className="w-3.5 h-3.5 text-pink-500" />
          <span>Hòm thư riêng tư — Không hiển thị công khai trên website</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Biệt danh của bạn"
              placeholder="Ví dụ: Một lữ khách qua đường..."
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              maxLength={30}
            />

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Gửi tới ai?
              </label>
              <select
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-white/70 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                <option value="Hiên Nhà Ngắm Sao">Hiên Nhà Ngắm Sao (Chung)</option>
                {characters.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
              Tâm trạng lúc gửi gắm
            </label>
            <div className="flex flex-wrap gap-2">
              {moods.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    mood === m
                      ? 'bg-pink-500 text-white shadow-md font-semibold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <Textarea
            label="Nội dung bức thư (tối đa 500 ký tự) *"
            placeholder="Viết vài dòng tâm sự, lời chúc hay điều cậu muốn gửi gắm vào màn đêm..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            maxLength={500}
            helperText="Lời nhắn sẽ được lưu giữ nguyên vẹn trong hòm thư của Mái Hiên."
          />

          {/* Attached Previews */}
          {(imageUrl || selectedSticker) && (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-100/90 dark:bg-slate-850 border border-pink-200/60 dark:border-slate-700">
              {imageUrl && (
                <div className="relative group">
                  <img
                    src={imageUrl}
                    alt="Đính kèm"
                    className="w-20 h-20 object-cover rounded-xl border border-pink-300 dark:border-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs shadow-md cursor-pointer hover:bg-rose-600"
                    title="Gỡ ảnh"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {selectedSticker && (
                <div className="relative group flex items-center gap-2 p-1.5 bg-white/70 dark:bg-slate-900/70 rounded-xl">
                  <img
                    src={selectedSticker.assetUrl}
                    alt={selectedSticker.name}
                    className="w-16 h-16 object-contain"
                  />
                  <div className="text-left pr-6">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      {selectedSticker.name}
                    </span>
                    <span className="text-[10px] text-pink-500 font-medium">Sticker gửi kèm</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedSticker(null)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs shadow-md cursor-pointer hover:bg-rose-600"
                    title="Gỡ sticker"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Image Input Popover */}
          {isImageInputOpen && (
            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Đính kèm hình ảnh tâm tình</span>
                <button
                  type="button"
                  onClick={() => setIsImageInputOpen(false)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Dán link ảnh (https://...)"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
                />

                <label className="px-3 py-1.5 rounded-xl bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-300 border border-pink-200 dark:border-pink-800 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-pink-100 transition-colors">
                  <Upload className="w-3.5 h-3.5" /> Tải ảnh lên (Max 5MB)
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Form Bottom Controls */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsStickerPickerOpen(true)}
                icon={<Smile className="w-4 h-4 text-pink-500" />}
              >
                Gửi Kèm Sticker
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsImageInputOpen(!isImageInputOpen)}
                icon={<ImageIcon className="w-4 h-4 text-sky-500" />}
              >
                Đính Kèm Ảnh
              </Button>
            </div>

            <Button
              type="submit"
              variant="pink"
              size="lg"
              disabled={!message.trim() && !imageUrl && !selectedSticker}
              icon={<Send className="w-4 h-4" />}
            >
              Gửi Bức Thư
            </Button>
          </div>
        </form>
      </GlassCard>

      {/* Security note */}
      <div className="text-center text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-pink-400" />
        <span>Tất cả thư được lưu vào Hộp Thư Riêng Tư của Người Trông Coi Mái Hiên.</span>
      </div>

      {/* Sticker Picker */}
      <StickerPicker
        isOpen={isStickerPickerOpen}
        onClose={() => setIsStickerPickerOpen(false)}
        onSelectSticker={(stk) => {
          setSelectedSticker(stk);
          toast.success(`Đã chọn sticker: ${stk.name}`);
        }}
      />

    </div>
  );
};
