import React, { useState } from 'react';
import { Character, PlaylistItem, GalleryItem, LoveLetter, TarotCard, CelestialQuote } from '../../types';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StorageService } from '../../services/storageService';
import { SiteConfigTab } from './components/SiteConfigTab';
import { LoadingScreenTab } from './components/LoadingScreenTab';
import { SocialAppearanceTab } from './components/SocialAppearanceTab';
import { AvatarLibraryTab } from './components/AvatarLibraryTab';
import { StickersTab } from './components/StickersTab';
import { VoteConfigTab } from './components/VoteConfigTab';
import { CharactersTab } from './components/CharactersTab';
import { ScenariosTab } from './components/ScenariosTab';
import { TarotTab } from './components/TarotTab';
import { QuotesTab } from './components/QuotesTab';
import { ShopItemsTab } from './components/ShopItemsTab';
import { PlaylistTab } from './components/PlaylistTab';
import { GalleryTab } from './components/GalleryTab';
import { MediaLibraryTab } from './components/MediaLibraryTab';
import { LoveLettersTab } from './components/LoveLettersTab';
import { UsersTab } from './components/UsersTab';
import { BackupSystemTab } from './components/BackupSystemTab';
import { RankingTab } from './components/RankingTab';
import { CharacterCategoriesTab } from './components/CharacterCategoriesTab';
import { FeedbackTab } from './components/FeedbackTab';
import { BackgroundsTab } from './components/BackgroundsTab';
import { RewardCodesTab } from './components/RewardCodesTab';
import { 
  ShieldAlert, 
  Globe, 
  Vote, 
  Users, 
  MessageSquareQuote, 
  Sparkles, 
  Quote as QuoteIcon, 
  ShoppingBag, 
  Music, 
  Image as ImageIcon, 
  FolderArchive, 
  HeartHandshake, 
  UserCheck, 
  Database, 
  LogOut,
  LayoutDashboard,
  Heart,
  Eye,
  Smile,
  Share2,
  Film,
  UserCircle,
  Trophy,
  Tag,
  MessageSquarePlus,
  Palette,
  Gift
} from 'lucide-react';

export type AdminTab = 
  | 'overview' 
  | 'site-config' 
  | 'loading-screen'
  | 'backgrounds'
  | 'social-links'
  | 'avatar-library'
  | 'reward-codes'
  | 'stickers'
  | 'characters' 
  | 'categories'
  | 'ranking'
  | 'vote-config' 
  | 'feedback'
  | 'scenarios' 
  | 'tarot' 
  | 'quotes' 
  | 'shop' 
  | 'playlist' 
  | 'gallery' 
  | 'media' 
  | 'letters' 
  | 'users' 
  | 'backup';

interface AdminPageProps {
  characters: Character[];
  playlist: PlaylistItem[];
  galleryItems: GalleryItem[];
  loveLetters: LoveLetter[];
  tarotCards: TarotCard[];
  quotes: CelestialQuote[];
  onSaveCharacter: (char: Character) => void;
  onDeleteCharacter: (id: string) => void;
  onCharactersUpdated?: () => void;
  onSavePlaylistTrack: (track: PlaylistItem) => void;
  onDeletePlaylistTrack: (id: string) => void;
  onSaveGalleryItem: (item: GalleryItem) => void;
  onDeleteGalleryItem: (id: string) => void;
  onReplyLoveLetter: (id: string, reply: string) => void;
  onDeleteLoveLetter: (id: string) => void;
  onResetSeedData: () => void;
  onLogoutAdmin: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  characters,
  playlist,
  galleryItems,
  loveLetters,
  tarotCards,
  quotes,
  onSaveCharacter,
  onDeleteCharacter,
  onCharactersUpdated,
  onSavePlaylistTrack,
  onDeletePlaylistTrack,
  onSaveGalleryItem,
  onDeleteGalleryItem,
  onReplyLoveLetter,
  onDeleteLoveLetter,
  onResetSeedData,
  onLogoutAdmin
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Metrics
  const totalCharacters = characters.length;
  const totalLoves = characters.reduce((a, b) => a + (b.loveCount || 0), 0);
  const totalVotes = characters.reduce((a, b) => a + (b.voteCount || 0), 0);
  const totalViews = characters.reduce((a, b) => a + (b.views || 0), 0);
  const totalLetters = loveLetters.length;
  const mediaResources = StorageService.getMediaResources();
  const allUsers = StorageService.getAllUsers();

  const navItems = [
    { id: 'overview', label: 'Tổng Quan', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'site-config', label: 'Trang Chủ & Nhận Diện', icon: <Globe className="w-4 h-4" /> },
    { id: 'backgrounds', label: 'Hình Nền Từng Vùng', icon: <Palette className="w-4 h-4 text-purple-400" /> },
    { id: 'loading-screen', label: 'Màn Hình Tải', icon: <Film className="w-4 h-4" /> },
    { id: 'social-links', label: 'Discord & FB', icon: <Share2 className="w-4 h-4" /> },
    { id: 'avatar-library', label: 'Avatar Lữ Khách', icon: <UserCircle className="w-4 h-4" /> },
    { id: 'reward-codes', label: 'Mã Quà & Hộp Thư', icon: <Gift className="w-4 h-4 text-amber-400" /> },
    { id: 'stickers', label: 'Sticker & GIF', icon: <Smile className="w-4 h-4" /> },
    { id: 'characters', label: `Nhân Vật (${characters.length})`, icon: <Users className="w-4 h-4" /> },
    { id: 'categories', label: 'Danh Mục & Tag', icon: <Tag className="w-4 h-4 text-amber-500" /> },
    { id: 'ranking', label: 'Bảng Xếp Hạng', icon: <Trophy className="w-4 h-4 text-amber-500" /> },
    { id: 'vote-config', label: 'Cài Đặt Bình Chọn', icon: <Vote className="w-4 h-4" /> },
    { id: 'feedback', label: 'Hòm Thư Góp Ý', icon: <MessageSquarePlus className="w-4 h-4 text-emerald-400" /> },
    { id: 'scenarios', label: 'Tình Huống Nhập Vai', icon: <MessageSquareQuote className="w-4 h-4" /> },
    { id: 'tarot', label: '78 Lá Tarot', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'quotes', label: 'Câu Nói Ánh Sao', icon: <QuoteIcon className="w-4 h-4" /> },
    { id: 'shop', label: 'Cửa Tiệm & Quà', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'playlist', label: `Playlist (${playlist.length})`, icon: <Music className="w-4 h-4" /> },
    { id: 'gallery', label: `Thư Viện Ảnh (${galleryItems.length})`, icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'media', label: `Kho Media (${mediaResources.length})`, icon: <FolderArchive className="w-4 h-4" /> },
    { id: 'letters', label: `Hộp Thư (${loveLetters.length})`, icon: <HeartHandshake className="w-4 h-4" /> },
    { id: 'users', label: `Lữ Khách (${allUsers.length})`, icon: <UserCheck className="w-4 h-4" /> },
    { id: 'backup', label: 'Sao Lưu & Hệ Thống', icon: <Database className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-16">
      
      {/* Top Banner */}
      <GlassCard variant="porch" className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/20 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Bảng Quản Trị Toàn Diện
                </h1>
                <Badge variant="gold">OWNER CMS</Badge>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Chủ sở hữu: <span className="font-mono text-amber-300 font-semibold">thanhnhi12@gmail.com</span> • Toàn quyền vận hành không cần viết code.
              </p>
            </div>
          </div>

          <Button
            variant="danger"
            size="sm"
            onClick={onLogoutAdmin}
            icon={<LogOut className="w-4 h-4" />}
          >
            Đăng Xuất Quản Trị
          </Button>
        </div>
      </GlassCard>

      {/* Navigation Sub-Menu Bar */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs backdrop-blur-md overflow-x-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as AdminTab)}
              className={`px-3 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <GlassCard className="p-4 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500 shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{totalCharacters}</span>
                <p className="text-xs text-slate-400">Nhân vật</p>
              </div>
            </GlassCard>

            <GlassCard className="p-4 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500 shrink-0">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{totalLoves}</span>
                <p className="text-xs text-slate-400">Trái tim trao gửi</p>
              </div>
            </GlassCard>

            <GlassCard className="p-4 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
                <Vote className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{totalVotes}</span>
                <p className="text-xs text-slate-400">Phiếu bình chọn</p>
              </div>
            </GlassCard>

            <GlassCard className="p-4 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{totalViews}</span>
                <p className="text-xs text-slate-400">Lượt ghé thăm</p>
              </div>
            </GlassCard>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <GlassCard className="p-5 space-y-3 cursor-pointer hover:border-amber-400 transition-colors" onClick={() => setActiveTab('ranking')}>
              <div className="flex items-center gap-2.5">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Bảng Xếp Hạng & Tim</h3>
              </div>
              <p className="text-xs text-slate-400">
                Xem xếp hạng thời gian thực, quản lý số tim nhận được và đặt lại dữ liệu thứ hạng.
              </p>
            </GlassCard>

            <GlassCard className="p-5 space-y-3 cursor-pointer hover:border-amber-400 transition-colors" onClick={() => setActiveTab('site-config')}>
              <div className="flex items-center gap-2.5">
                <Globe className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Cấu Hình Trang Chủ</h3>
              </div>
              <p className="text-xs text-slate-400">
                Thay đổi video nền, khẩu hiệu, lời chào thời gian thực và liên kết cộng đồng.
              </p>
            </GlassCard>

            <GlassCard className="p-5 space-y-3 cursor-pointer hover:border-amber-400 transition-colors" onClick={() => setActiveTab('characters')}>
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Quản Lý Nhân Vật</h3>
              </div>
              <p className="text-xs text-slate-400">
                Thêm văn án mới, avatar nhân vật, link bot chat và trạng thái mở cổng.
              </p>
            </GlassCard>

            <GlassCard className="p-5 space-y-3 cursor-pointer hover:border-amber-400 transition-colors" onClick={() => setActiveTab('vote-config')}>
              <div className="flex items-center gap-2.5">
                <Vote className="w-5 h-5 text-emerald-500" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Cài Đặt Bình Chọn</h3>
              </div>
              <p className="text-xs text-slate-400">
                Đóng/Mở cổng bình chọn, đặt thể lệ và điều chỉnh thời gian diễn ra.
              </p>
            </GlassCard>
          </div>
        </div>
      )}

      {activeTab === 'site-config' && <SiteConfigTab />}
      {activeTab === 'backgrounds' && <BackgroundsTab />}
      {activeTab === 'loading-screen' && <LoadingScreenTab />}
      {activeTab === 'social-links' && <SocialAppearanceTab />}
      {activeTab === 'avatar-library' && <AvatarLibraryTab />}
      {activeTab === 'reward-codes' && <RewardCodesTab />}
      {activeTab === 'stickers' && <StickersTab />}
      {activeTab === 'characters' && (
        <CharactersTab
          characters={characters}
          onSaveCharacter={onSaveCharacter}
          onDeleteCharacter={onDeleteCharacter}
        />
      )}
      {activeTab === 'categories' && (
        <CharacterCategoriesTab
          characters={characters}
          onCharactersUpdated={onCharactersUpdated}
        />
      )}
      {activeTab === 'ranking' && (
        <RankingTab
          characters={characters}
          onCharactersUpdated={onCharactersUpdated}
        />
      )}
      {activeTab === 'vote-config' && <VoteConfigTab />}
      {activeTab === 'feedback' && <FeedbackTab characters={characters} />}
      {activeTab === 'scenarios' && <ScenariosTab />}
      {activeTab === 'tarot' && <TarotTab />}
      {activeTab === 'quotes' && <QuotesTab />}
      {activeTab === 'shop' && <ShopItemsTab />}
      {activeTab === 'playlist' && (
        <PlaylistTab
          playlist={playlist}
          onSaveTrack={onSavePlaylistTrack}
          onDeleteTrack={onDeletePlaylistTrack}
        />
      )}
      {activeTab === 'gallery' && (
        <GalleryTab
          galleryItems={galleryItems}
          onSaveGalleryItem={onSaveGalleryItem}
          onDeleteGalleryItem={onDeleteGalleryItem}
        />
      )}
      {activeTab === 'media' && <MediaLibraryTab />}
      {activeTab === 'letters' && (
        <LoveLettersTab
          loveLetters={loveLetters}
          onReplyLetter={onReplyLoveLetter}
          onDeleteLetter={onDeleteLoveLetter}
        />
      )}
      {activeTab === 'users' && <UsersTab />}
      {activeTab === 'backup' && <BackupSystemTab onResetSeedData={onResetSeedData} />}

    </div>
  );
};
