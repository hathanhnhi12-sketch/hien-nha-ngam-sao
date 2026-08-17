import React, { useState, useEffect, useMemo } from 'react';
import { CelestialQuote, UserProfile, SiteConfig } from '../../types';
import { StorageService } from '../../services/storageService';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { UserAvatar } from '../../components/common/UserAvatar';
import { 
  Sparkles, 
  Moon, 
  Compass, 
  ExternalLink, 
  MessageCircle, 
  Share2, 
  Sun, 
  Volume2, 
  VolumeX, 
  User, 
  Quote as QuoteIcon,
  RefreshCw,
  Stars,
  Heart
} from 'lucide-react';

interface HomePageProps {
  quotes: CelestialQuote[];
  navigate: (route: string) => void;
  theme: string;
  toggleTheme: () => void;
  userProfile?: UserProfile;
  onOpenProfile?: () => void;
  isPlayingMusic?: boolean;
  onToggleMusic?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  quotes,
  navigate,
  theme,
  toggleTheme,
  userProfile,
  onOpenProfile,
  isPlayingMusic,
  onToggleMusic
}) => {
  // Modal states
  const [discordModalOpen, setDiscordModalOpen] = useState(false);
  const [facebookModalOpen, setFacebookModalOpen] = useState(false);

  // Dynamic Site Config from Owner CMS
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => StorageService.getSiteConfig());

  // Listen for storage changes
  useEffect(() => {
    setSiteConfig(StorageService.getSiteConfig());
  }, []);

  // Time-based dynamic greeting
  const [greeting, setGreeting] = useState('');
  useEffect(() => {
    const updateGreeting = () => {
      const g = siteConfig.greetings || {
        morning: '✦ Chào buổi sáng lữ khách, ngày mới thật an lành ✦',
        noon: '✦ Trưa thanh tĩnh dưới mái hiên, hãy nghỉ chân một chút nhé ✦',
        afternoon: '✦ Nắng chiều buông nhẹ, cùng ngắm hoàng hôn và đón sao sớm ✦',
        evening: '✦ Đêm buông màn, ngồi xuống đây cùng nhau ngắm sao ✦',
        night: '✦ Đêm đã về khuya, chúc cậu một giấc ngủ thật êm đềm ✦'
      };
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 11) {
        setGreeting(g.morning);
      } else if (hour >= 11 && hour < 14) {
        setGreeting(g.noon);
      } else if (hour >= 14 && hour < 18) {
        setGreeting(g.afternoon);
      } else if (hour >= 18 && hour < 23) {
        setGreeting(g.evening);
      } else {
        setGreeting(g.night);
      }
    };
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, [siteConfig]);

  // Single random quote picked on mount / refresh
  const [quoteIndex, setQuoteIndex] = useState(0);
  useEffect(() => {
    if (quotes.length > 0) {
      setQuoteIndex(Math.floor(Math.random() * quotes.length));
    }
  }, [quotes.length]);

  const currentQuote = useMemo(() => {
    if (quotes.length > 0 && quotes[quoteIndex]) {
      return quotes[quoteIndex];
    }
    return {
      content: 'Đêm càng tối, những vì sao lại càng rực rỡ. Đừng sợ bóng đêm, bởi đó là lúc ánh sáng của bạn tỏa rạng nhất.',
      author: 'Hiên Nhà Ngắm Sao'
    };
  }, [quotes, quoteIndex]);

  const handleShuffleQuote = () => {
    if (quotes.length > 1) {
      let nextIndex = Math.floor(Math.random() * quotes.length);
      while (nextIndex === quoteIndex && quotes.length > 1) {
        nextIndex = Math.floor(Math.random() * quotes.length);
      }
      setQuoteIndex(nextIndex);
    }
  };

  // Explore action navigates to characters with global route transition
  const handleExplore = () => {
    navigate('characters');
  };

  return (
    <div className="relative min-h-[90vh] sm:min-h-[94vh] flex flex-col justify-between overflow-hidden rounded-3xl sm:rounded-[36px] shadow-2xl border border-indigo-200/40 dark:border-indigo-500/20 m-2 sm:m-4">
      
      {/* 1. CINEMATIC VIDEO/IMAGE BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
        {siteConfig.backgroundType === 'video' ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            src={siteConfig.backgroundUrl}
            className="w-full h-full object-cover scale-105 filter brightness-[0.82] contrast-[1.08] transition-all duration-700"
          />
        ) : (
          <img
            src={siteConfig.backgroundUrl || siteConfig.backgroundFallbackUrl}
            alt="Background"
            className="w-full h-full object-cover scale-105 filter brightness-[0.82] contrast-[1.08] transition-all duration-700"
          />
        )}
        {/* Luminous atmospheric overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950/85 backdrop-blur-[0.5px]"
          style={{ opacity: siteConfig.overlayOpacity ?? 0.65 }}
        />
        
        {/* Soft radial starlight vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,14,39,0.7)_100%)]" />
      </div>

      {/* 2. MINIMALIST TOP HEADER */}
      <header className="relative z-10 w-full px-5 sm:px-8 py-5 sm:py-6 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          {siteConfig.logoUrl ? (
            <img src={siteConfig.logoUrl} alt="Logo" className="w-10 h-10 rounded-2xl object-cover" />
          ) : (
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-300 to-indigo-400 p-0.5 shadow-lg shadow-amber-400/20">
              <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center text-amber-300">
                <Moon className="w-5 h-5 fill-amber-300/30 text-amber-300 animate-float-slow" />
              </div>
            </div>
          )}
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white drop-shadow-md">
              {siteConfig.siteName}
            </span>
            <span className="text-[10px] sm:text-[11px] tracking-[0.25em] text-amber-200/90 uppercase font-semibold">
              {siteConfig.subtitle}
            </span>
          </div>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-2">
          {onToggleMusic && (
            <button
              onClick={onToggleMusic}
              title={isPlayingMusic ? 'Tắt nhạc nền' : 'Bật nhạc nền thư giãn'}
              className="p-2.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 text-amber-300 border border-amber-400/30 backdrop-blur-md transition-all shadow-md hover:scale-105 cursor-pointer"
            >
              {isPlayingMusic ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-70" />}
            </button>
          )}

          <button
            onClick={toggleTheme}
            title="Đổi giao diện sáng/tối"
            className="p-2.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 text-amber-300 border border-amber-400/30 backdrop-blur-md transition-all shadow-md hover:scale-105 cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {onOpenProfile && userProfile && (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-2xl bg-slate-900/70 hover:bg-slate-800/90 border border-amber-400/40 backdrop-blur-md transition-all shadow-md hover:scale-105 cursor-pointer"
            >
              <UserAvatar
                src={userProfile.avatarUrl}
                alt={userProfile.displayName}
                size="sm"
                shape="square"
                ring="amber"
              />
              <span className="text-xs font-bold text-slate-100 hidden sm:inline max-w-[80px] truncate">
                {userProfile.displayName}
              </span>
            </button>
          )}
        </div>
      </header>

      {/* 3. CENTER LANDING STAGE */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-8 py-8 sm:py-12 max-w-4xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Dynamic Real-time Device Greeting */}
        <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-slate-900/70 border border-amber-300/40 text-amber-300 text-xs sm:text-sm font-semibold shadow-lg backdrop-blur-md animate-pulse-glow">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{greeting}</span>
          <Stars className="w-4 h-4 text-amber-300" />
        </div>

        {/* Luminous Title Headline */}
        <div className="space-y-2 sm:space-y-3 max-w-4xl mx-auto px-2">
          <h1 className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl hero-title-gradient leading-[1.18] tracking-normal select-none my-1">
            {siteConfig.siteName ? siteConfig.siteName.toUpperCase() : 'HIÊN NHÀ NGẮM SAO'}
          </h1>
          <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-amber-200/90 uppercase drop-shadow-md">
            {siteConfig.tagline}
          </p>
        </div>

        {/* Single Ambient Quote */}
        <div className="relative max-w-xl mx-auto p-5 sm:p-6 rounded-3xl bg-slate-950/60 border border-white/20 shadow-2xl backdrop-blur-lg group">
          <QuoteIcon className="w-6 h-6 text-amber-400/70 mx-auto mb-2 opacity-80" />
          <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed italic">
            "{currentQuote.content}"
          </p>
          <div className="mt-3 flex items-center justify-between text-xs text-amber-300/90 pt-2 border-t border-white/10">
            <span className="font-semibold">— {currentQuote.author || 'Hiên Nhà Ngắm Sao'}</span>
            <button
              onClick={handleShuffleQuote}
              title="Đổi câu nói khác"
              className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4. EXACTLY 3 ACTION BUTTONS */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
          
          {/* Button 1: KHÁM PHÁ */}
          <Button
            size="lg"
            variant="gold"
            onClick={handleExplore}
            icon={<Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '12s' }} />}
            className="text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl shadow-xl shadow-amber-500/25 transform hover:scale-105 active:scale-95 transition-all font-extrabold cursor-pointer"
          >
            {siteConfig.exploreButtonText || '✦ KHÁM PHÁ HIÊN NHÀ'}
          </Button>

          {/* Button 2: DISCORD */}
          <Button
            size="lg"
            variant="soft"
            onClick={() => setDiscordModalOpen(true)}
            icon={<MessageCircle className="w-5 h-5 text-indigo-400" />}
            className="text-sm sm:text-base px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-400/40 text-white backdrop-blur-md shadow-lg transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            DISCORD CỘNG ĐỒNG
          </Button>

          {/* Button 3: FACEBOOK */}
          <Button
            size="lg"
            variant="soft"
            onClick={() => setFacebookModalOpen(true)}
            icon={<Share2 className="w-5 h-5 text-sky-400" />}
            className="text-sm sm:text-base px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl bg-sky-950/80 hover:bg-sky-900 border border-sky-400/40 text-white backdrop-blur-md shadow-lg transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            FACEBOOK KẾT NỐI
          </Button>

        </div>

      </main>

      {/* 5. MINIMAL BOTTOM COPYRIGHT/TAGLINE */}
      <footer className="relative z-10 w-full px-5 py-4 text-center text-xs text-slate-400/80 font-medium">
        <p className="flex items-center justify-center gap-1.5">
          <span>{siteConfig.footerText}</span>
        </p>
      </footer>

      {/* DISCORD POPUP MODAL (2 Options) */}
      <Modal
        isOpen={discordModalOpen}
        onClose={() => setDiscordModalOpen(false)}
        maxWidth="md"
        title="✦ CỔNG DISCORD HIÊN NHÀ NGẮM SAO"
      >
        <div className="space-y-4 py-2">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Hãy chọn máy chủ bạn muốn ghé thăm để trò chuyện, nhận thông báo nhân vật mới và cùng ngắm sao với cộng đồng:
          </p>

          <div className="space-y-3">
            {/* Option 1: Server Collab */}
            <a
              href={siteConfig.discordCollabUrl || 'https://discord.gg/KFVJhkJmH'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 border border-indigo-200 dark:border-indigo-500/30 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-amber-300 transition-colors">
                    1. SERVER COLLAB
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Máy chủ hợp tác & giao lưu liên minh các hiên nhà
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-amber-300 transition-colors" />
            </a>

            {/* Option 2: Server Riêng */}
            <a
              href={siteConfig.discordPrivateUrl || 'https://discord.gg/3DSdbWnS48'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/80 border border-purple-200 dark:border-purple-500/30 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-amber-300 transition-colors">
                    2. SERVER RIÊNG
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Tổ ấm chính thức của Hiên Nhà Ngắm Sao
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-purple-600 dark:group-hover:text-amber-300 transition-colors" />
            </a>
          </div>
        </div>
      </Modal>

      {/* FACEBOOK POPUP MODAL (2 Options) */}
      <Modal
        isOpen={facebookModalOpen}
        onClose={() => setFacebookModalOpen(false)}
        maxWidth="md"
        title="✦ KẾT NỐI FACEBOOK"
      >
        <div className="space-y-4 py-2">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Theo dõi trang chính thức hoặc nhắn tin tâm tình cùng người trông coi hiên nhà:
          </p>

          <div className="space-y-3">
            {/* Option 1: Fanpage */}
            <a
              href={siteConfig.facebookPageUrl || 'https://web.facebook.com/hiennhangamsao'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/80 border border-sky-200 dark:border-sky-500/30 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-sm shadow">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-amber-300 transition-colors">
                    1. PAGE CHÍNH
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Fanpage chính thức: Hiên Nhà Ngắm Sao
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-sky-600 dark:group-hover:text-amber-300 transition-colors" />
            </a>

            {/* Option 2: Personal Profile */}
            <a
              href={siteConfig.facebookPersonalUrl || 'https://web.facebook.com/monyeuoi.00'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/80 border border-rose-200 dark:border-rose-500/30 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-sm shadow">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-amber-300 transition-colors">
                    2. ACC CÁ NHÂN
                  </h4>
                  <p className="text-xs text-rose-600 dark:text-rose-300 font-medium italic">
                    P/S: Mấy bạn ib riêng với mình ở acc nì nhée.
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-rose-600 dark:group-hover:text-amber-300 transition-colors" />
            </a>
          </div>
        </div>
      </Modal>

    </div>
  );
};
