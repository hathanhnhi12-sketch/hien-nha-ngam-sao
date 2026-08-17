import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { Character, CharacterStatus } from '../../types';
import { toast } from '../../stores/useToastStore';
import { Sparkles, Save, User, Image, Link, BookOpen } from 'lucide-react';

interface CharacterFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  characterToEdit?: Character | null;
  onSave: (character: Character) => void;
}

export const CharacterFormModal: React.FC<CharacterFormModalProps> = ({
  isOpen,
  onClose,
  characterToEdit,
  onSave
}) => {
  const [name, setName] = useState('');
  const [series, setSeries] = useState('');
  const [status, setStatus] = useState<CharacterStatus>('open');
  const [tagsStr, setTagsStr] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [largeImgUrl, setLargeImgUrl] = useState('');
  const [linkGgai, setLinkGgai] = useState('');
  const [backstory, setBackstory] = useState('');

  useEffect(() => {
    if (characterToEdit) {
      setName(characterToEdit.name || '');
      setSeries(characterToEdit.series || '');
      setStatus(characterToEdit.status || 'open');
      setTagsStr(characterToEdit.tags?.join(', ') || '');
      setAvatarUrl(characterToEdit.avatarUrl || '');
      setLargeImgUrl(characterToEdit.largeImgUrl || '');
      setLinkGgai(characterToEdit.linkGgai || '');
      setBackstory(characterToEdit.backstory || '');
    } else {
      setName('');
      setSeries('Dưới Mái Hiên Sao');
      setStatus('open');
      setTagsStr('Dịu dàng, Chữa lành, Lắng nghe');
      setAvatarUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
      setLargeImgUrl('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80');
      setLinkGgai('');
      setBackstory('Một nhân vật hiền hòa luôn chào đón lữ khách ghé thăm hiên nhà...');
    }
  }, [characterToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Vui lòng nhập tên nhân vật.');
      return;
    }

    const tags = tagsStr
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const character: Character = {
      id: characterToEdit?.id || 'char_' + Date.now(),
      name: name.trim(),
      series: series.trim() || 'Dưới Mái Hiên Sao',
      status,
      tags: tags.length > 0 ? tags : ['Hiên Nhà'],
      avatarUrl: avatarUrl.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      largeImgUrl: largeImgUrl.trim() || avatarUrl.trim(),
      linkGgai: linkGgai.trim(),
      backstory: backstory.trim(),
      views: characterToEdit?.views || 0,
      chats: characterToEdit?.chats || 0,
      loveCount: characterToEdit?.loveCount || 0,
      voteCount: characterToEdit?.voteCount || 0,
      affinity: characterToEdit?.affinity || 0,
      isHidden: characterToEdit?.isHidden || false,
      createdAt: characterToEdit?.createdAt || Date.now(),
      updatedAt: Date.now()
    };

    onSave(character);
    toast.success(characterToEdit ? 'Đã cập nhật nhân vật ✦' : 'Đã tạo nhân vật mới thành công ✦');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={characterToEdit ? '✦ Chỉnh Sửa Nhân Vật' : '✦ Tạo Nhân Vật Mới (Dấu +)'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Tên nhân vật *"
            placeholder="Ví dụ: Nguyệt Hạ"
            value={name}
            onChange={e => setName(e.target.value)}
            icon={<User className="w-4 h-4" />}
            required
          />

          <Input
            label="Series / Nguồn gốc"
            placeholder="Ví dụ: Dưới Mái Hiên Sao"
            value={series}
            onChange={e => setSeries(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Trạng thái cổng
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as CharacterStatus)}
              className="w-full px-3.5 py-2 text-sm bg-white/70 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="open">OPEN — Đang mở cổng</option>
              <option value="updating">UPDATING — Đang cập nhật</option>
              <option value="unreleased">UNRELEASED — Chưa phát hành</option>
            </select>
          </div>

          <Input
            label="Tags (phân cách bằng dấu phẩy)"
            placeholder="Dịu dàng, Thần Trăng, Ấm áp"
            value={tagsStr}
            onChange={e => setTagsStr(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="URL Hình đại diện (Avatar)"
            placeholder="https://..."
            value={avatarUrl}
            onChange={e => setAvatarUrl(e.target.value)}
            icon={<Image className="w-4 h-4" />}
          />

          <Input
            label="URL Ảnh nền lớn (Cover banner)"
            placeholder="https://..."
            value={largeImgUrl}
            onChange={e => setLargeImgUrl(e.target.value)}
            icon={<Image className="w-4 h-4" />}
          />
        </div>

        <Input
          label="Link Trò Chuyện (Chat Link)"
          placeholder="https://c.ai/c/..."
          value={linkGgai}
          onChange={e => setLinkGgai(e.target.value)}
          icon={<Link className="w-4 h-4" />}
          helperText="Nếu để trống hoặc unreleased, nút chat sẽ hiển thị trạng thái tương ứng."
        />

        {/* VĂN ÁN */}
        <Textarea
          label="✦ VĂN ÁN (Tóm tắt cốt truyện / Tiểu sử) *"
          placeholder="Giới thiệu xuất thân, cốt truyện và hành trình của nhân vật..."
          value={backstory}
          onChange={e => setBackstory(e.target.value)}
          rows={4}
          required
        />

        <div className="pt-4 flex justify-end gap-2.5">
          <Button type="button" variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" variant="gold" icon={<Save className="w-4 h-4" />}>
            {characterToEdit ? 'Lưu Thay Đổi' : 'Tạo Nhân Vật'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
