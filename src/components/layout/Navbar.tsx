import React, { useState } from 'react';
import { ThemeMode, DisplayMode, UserProfile } from '../../types';
import { UserAvatar } from '../common/UserAvatar';
import { 
  Sparkles, 
  Moon, 
  Sun, 
  Menu, 
  X, 
  ShieldAlert, 
  Users, 
  Trophy, 
  Vote, 
  HeartHandshake, 
  Music, 
  Image as ImageIcon, 
  Compass, 
  Gamepad2, 
  Coins, 
  Home, 
  Monitor, 
  Smartphone,
  Check,
  MessageSquarePlus
} from 'lucide-react';

interface NavbarProps {
  currentRoute: string;
  navigate: (route: string) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
  userProfile: UserProfile;
  onOpenProfile: () => void;
  isAdmin: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  navigate,
  theme,
  toggleTheme,
  displayMode,
  setDisplayMode,
  userProfile,
  onOpenProfile,
  isAdmin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [displayDropdownOpen, setDisplayDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: <Home className="w-4 h-4" /> },
    { id: 'characters', label: 'Nhân vật', icon: <Users className="w-4 h-4" /> },
    { id: 'leaderboard', label: 'Bảng Xếp Hạng NV', icon: <Trophy className="w-4 h-4" /> },
    { id: 'ranking', label: 'Bảng Xếp Hạng Lữ Khách', icon: <Trophy className="w-4 h-4" /> },
    { id: 'vote', label: 'Bình chọn', icon: <Vote className="w-4 h-4" /> },
    { id: 'send-love', label: 'Lời yêu thương', icon: <HeartHandshake className="w-4 h-4" /> },
    { id: 'feedback', label: 'Góp ý', icon: <MessageSquarePlus className="w-4 h-4" /> },
    { id: 'playlist', label: 'Playlist', icon: <Music className="w-4 h-4" /> },
    { id: 'gallery', label: 'Album', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'other-spaces', label: 'Không gian khác', icon: <Compass className="w-4 h-4" /> },
    { id: 'minigame', label: 'Minigame', icon: <Gamepad2 className="w-4 h-4" /> },
  ];

  const handleNavigate = (route: string) => {
    navigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/70 dark:bg-slate-950/70 border-b border-indigo-100/50 dark:border-indigo-900/30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => handleNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-indigo-500 to-purple-600 p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center text-amber-300">
                <Moon className="w-5 h-5 fill-amber-300/30 text-amber-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 dark:from-amber-200 dark:via-purple-200 dark:to-indigo-200 bg-clip-text text-transparent">
                Hiên Nhà Ngắm Sao
              </span>
              <span className="text-[10px] tracking-widest text-slate-400 dark:text-slate-400 uppercase -mt-0.5 font-medium">
                Stargazing Veranda
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map(item => {
              const isActive = currentRoute === item.id || (item.id === 'home' && currentRoute === '');
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-500/15 text-indigo-700 dark:text-amber-300 border border-indigo-300/30 dark:border-amber-400/30 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="opacity-80">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Display Mode Switcher */}
            <div className="relative">
              <button
                onClick={() => setDisplayDropdownOpen(!displayDropdownOpen)}
                title="Chế độ hiển thị (Auto/Desktop/Mobile)"
                className="p-2 rounded-xl bg-slate-100/70 dark:bg-slate-900/70 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-800 transition-colors"
              >
                {displayMode === 'desktop' ? <Monitor className="w-4 h-4" /> : displayMode === 'mobile' ? <Smartphone className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </button>

              {displayDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 py-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-md z-50 text-xs">
                  <button
                    onClick={() => { setDisplayMode('auto'); setDisplayDropdownOpen(false); }}
                    className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                  >
                    <span>Tự động</span>
                    {displayMode === 'auto' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                  <button
                    onClick={() => { setDisplayMode('desktop'); setDisplayDropdownOpen(false); }}
                    className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                  >
                    <span>Desktop</span>
                    {displayMode === 'desktop' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                  <button
                    onClick={() => { setDisplayMode('mobile'); setDisplayDropdownOpen(false); }}
                    className="w-full px-3 py-1.5 flex items-center justify-between text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                  >
                    <span>Mobile View</span>
                    {displayMode === 'mobile' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                </div>
              )}
            </div>

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Đêm'}
              className="p-2 rounded-xl bg-slate-100/70 dark:bg-slate-900/70 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Admin Dashboard Pill (ONLY visible when authenticated as admin) */}
            {isAdmin && (
              <button
                onClick={() => handleNavigate('admin')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/20 text-amber-600 dark:text-amber-300 border border-amber-400/40 text-xs font-bold hover:bg-amber-400/30 transition-all shadow-sm"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Quản Trị</span>
              </button>
            )}

            {/* User Profile Badge Button */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-2xl bg-indigo-50 dark:bg-slate-900/80 border border-indigo-200/60 dark:border-indigo-500/20 hover:border-indigo-400/50 transition-all cursor-pointer"
            >
              <UserAvatar
                src={userProfile.avatarUrl}
                alt={userProfile.displayName}
                size="sm"
                shape="square"
                ring="amber"
              />
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[80px]">
                  {userProfile.displayName}
                </span>
                <span className="text-[10px] text-amber-500 font-semibold flex items-center gap-0.5">
                  <Coins className="w-2.5 h-2.5" />
                  {userProfile.stats.coins}
                </span>
              </div>
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-slate-100/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-indigo-100/40 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl px-4 py-4 space-y-1.5 shadow-2xl">
          {navItems.map(item => {
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}

          {isAdmin && (
            <button
              onClick={() => handleNavigate('admin')}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold bg-amber-400/20 text-amber-600 dark:text-amber-300 border border-amber-400/30"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Bảng Điều Khiển Quản Trị</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
