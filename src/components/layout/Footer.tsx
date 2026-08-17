import React, { useState, useEffect } from 'react';
import { Moon, Sparkles, Heart, Compass, Music, Image as ImageIcon, Users, Gamepad2, HeartHandshake, ExternalLink, MessageSquarePlus } from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { SocialAppearanceConfig } from '../../types';

interface FooterProps {
  navigate: (route: string) => void;
  isAdmin?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  navigate
}) => {
  const [socials, setSocials] = useState<SocialAppearanceConfig>(() => StorageService.getSocialLinks());

  useEffect(() => {
    setSocials(StorageService.getSocialLinks());
  }, []);

  return (
    <footer className="w-full mt-20 border-t border-indigo-100/50 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/60 backdrop-blur-xl transition-colors pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Quote */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-indigo-600 p-0.5 shadow-md">
                <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center text-amber-300">
                  <Moon className="w-4 h-4 fill-amber-300/30 text-amber-300" />
                </div>
              </div>
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-indigo-700 to-purple-600 dark:from-amber-200 dark:via-purple-200 dark:to-indigo-200 bg-clip-text text-transparent">
                Hiên Nhà Ngắm Sao
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              “Ngồi xuống đây một chút, cùng nhau ngắm sao. Đêm càng tối, những vì tinh tú lại càng rực rỡ.”
            </p>

            {/* Social Communities */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              {socials.discord?.enabled && (
                <a
                  href={socials.discord.serverUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#5865F2]/10 hover:bg-[#5865F2]/20 border border-[#5865F2]/30 text-[#5865F2] text-xs font-semibold transition-all group"
                >
                  <img
                    src={socials.discord.avatarUrl}
                    alt="Discord"
                    className="w-5 h-5 rounded-full object-cover group-hover:scale-110 transition-transform"
                  />
                  <span>{socials.discord.displayName}</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              )}

              {socials.facebook?.enabled && (
                <a
                  href={socials.facebook.pageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/30 text-[#1877F2] text-xs font-semibold transition-all group"
                >
                  <img
                    src={socials.facebook.avatarUrl}
                    alt="Facebook"
                    className="w-5 h-5 rounded-full object-cover group-hover:scale-110 transition-transform"
                  />
                  <span>{socials.facebook.pageName}</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 pt-2">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Cozy Fantasy
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-400" /> Chữa Lành & Bình Yên
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wider uppercase">
              Không Gian Dưới Hiên
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button onClick={() => navigate('characters')} className="hover:text-indigo-600 dark:hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Users className="w-3.5 h-3.5 opacity-70" /> Hồ Sơ Nhân Vật
                </button>
              </li>
              <li>
                <button onClick={() => navigate('other-spaces')} className="hover:text-indigo-600 dark:hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Compass className="w-3.5 h-3.5 opacity-70" /> Tarot & Bầu Trời Đêm
                </button>
              </li>
              <li>
                <button onClick={() => navigate('gallery')} className="hover:text-indigo-600 dark:hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <ImageIcon className="w-3.5 h-3.5 opacity-70" /> Album Kỷ Niệm
                </button>
              </li>
              <li>
                <button onClick={() => navigate('minigame')} className="hover:text-indigo-600 dark:hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Gamepad2 className="w-3.5 h-3.5 opacity-70" /> Khu Vườn & Hồ Câu Cá
                </button>
              </li>
            </ul>
          </div>

          {/* Connection */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wider uppercase">
              Gắn Kết & Tâm Sự
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button onClick={() => navigate('send-love')} className="hover:text-indigo-600 dark:hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <HeartHandshake className="w-3.5 h-3.5 opacity-70" /> Gửi Lời Yêu Thương (Kín đáo)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('feedback')} className="hover:text-indigo-600 dark:hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <MessageSquarePlus className="w-3.5 h-3.5 opacity-70" /> Hòm Thư Góp Ý & Báo Lỗi
                </button>
              </li>
              <li>
                <button onClick={() => navigate('vote')} className="hover:text-indigo-600 dark:hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Sparkles className="w-3.5 h-3.5 opacity-70" /> Bình Chọn Nhân Vật
                </button>
              </li>
              <li>
                <button onClick={() => navigate('playlist')} className="hover:text-indigo-600 dark:hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Music className="w-3.5 h-3.5 opacity-70" /> Giai Điệu Đêm
                </button>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 mt-8 border-t border-indigo-100/40 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© 2026 Hiên Nhà Ngắm Sao — Một góc hiên ấm áp dành cho bạn.</p>
          <p className="mt-2 sm:mt-0 text-slate-400 dark:text-slate-500">
            Design with care ✦ Stargazing Veranda
          </p>
        </div>
      </div>
    </footer>
  );
};
