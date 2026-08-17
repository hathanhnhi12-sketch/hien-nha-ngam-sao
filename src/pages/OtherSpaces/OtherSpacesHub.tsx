import React, { useState } from 'react';
import { TarotCard, CelestialQuote, BackgroundTheme } from '../../types';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { toast } from '../../stores/useToastStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { 
  Sparkles, 
  Moon, 
  Quote, 
  Palette, 
  Eye, 
  RotateCw, 
  Copy, 
  Heart, 
  Compass,
  Star,
  Trees,
  CloudRain,
  Snowflake,
  Sun,
  Flame,
  ChevronRight,
  Info
} from 'lucide-react';

interface OtherSpacesHubProps {
  tarotCards: TarotCard[];
  quotes: CelestialQuote[];
  onLikeQuote: (id: string) => void;
}

export const OtherSpacesHub: React.FC<OtherSpacesHubProps> = ({
  tarotCards,
  quotes,
  onLikeQuote
}) => {
  const [activeTab, setActiveTab] = useState<'tarot' | 'quotes' | 'background' | 'observatory'>('tarot');
  const { backgroundTheme, setBackgroundTheme } = useThemeStore();

  // TAROT STATE
  const [tarotSpread, setTarotSpread] = useState<'single' | 'three' | 'five'>('single');
  const [drawnCards, setDrawnCards] = useState<{ card: TarotCard; isReversed: boolean }[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);

  // QUOTES STATE
  const [quoteCategory, setQuoteCategory] = useState<string>('all');
  const quoteCategories = ['all', 'Chữa lành', 'Đêm & Sao', 'Bình yên', 'Tình cảm', 'Triết lý'];

  // OBSERVATORY CONSTELLATIONS
  const constellations = [
    {
      id: 'orion',
      name: 'Chòm Sao Thợ Săn (Orion)',
      season: 'Mùa Đông & Mùa Xuân',
      stars: 'Betelgeuse (Sao khổng lồ đỏ), Rigel (Sao xanh trắng), Đai Lưng Orion',
      myth: 'Thợ săn vĩ đại trong thần thoại, kiêu hãnh bước đi giữa dải ngân hà với chiếc thắt lưng phát sáng rực rỡ.',
      meaning: 'Sự kiên định, lòng dũng cảm vượt qua nghịch cảnh và ánh sáng dẫn đường trong đêm tối.'
    },
    {
      id: 'ursa_major',
      name: 'Chòm Sao Đại Hùng & Bắc Đẩu (Ursa Major)',
      season: 'Quanh Năm (Bắc Bán Cầu)',
      stars: '7 ngôi sao chòm Bắc Đẩu Thất Tinh (Dubhe, Merak, Alioth, Mizar...)',
      myth: 'Được mệnh danh là chiếc gáo vàng múc nước sông Ngân. Hai ngôi sao ngoài cùng chỉ thẳng vào Sao Bắc Cực.',
      meaning: 'Chiếc kim chỉ nam vĩnh cửu của những người lữ khách đi tìm hướng đi trong cuộc đời.'
    },
    {
      id: 'cassiopeia',
      name: 'Chòm Sao Thiên Hậu (Cassiopeia)',
      season: 'Mùa Thu & Mùa Đông',
      stars: 'Hình chữ W (Schedar, Caph, Gamma Cassiopeiae...)',
      myth: 'Hoàng hậu kiêu sa ngồi trên ngai vàng của bầu trời đêm phương Bắc.',
      meaning: 'Vẻ đẹp tĩnh lặng, sự tự tin và lời nhắc nhở giữ gìn sự khiêm nhường thanh cao.'
    },
    {
      id: 'cygnus',
      name: 'Chòm Sao Thiên Nga (Cygnus / Northern Cross)',
      season: 'Mùa Hè & Mùa Thu',
      stars: 'Deneb (Tạo nên Tam Giác Mùa Hè cùng Vega & Altair)',
      myth: 'Chú thiên nga sải cánh bay dọc theo dòng sông Ngân Hà lấp lánh.',
      meaning: 'Sự thuần khiết, tự do bay lượn và tình yêu vượt qua mọi ranh giới của không gian.'
    },
    {
      id: 'scorpius',
      name: 'Chòm Sao Thiên Yết (Scorpius)',
      season: 'Mùa Hè',
      stars: 'Antares (Trái tim đỏ của Bọ Cạp)',
      myth: 'Chiếc đuôi uốn cong rực lửa nổi bật ở chân trời phía Nam.',
      meaning: 'Sự biến chuyển, nội lực mạnh mẽ và khả năng tái sinh từ thử thách.'
    }
  ];
  const [selectedConstellation, setSelectedConstellation] = useState(constellations[0]);

  // TAROT DRAW LOGIC
  const handleDrawTarot = () => {
    if (tarotCards.length === 0) return;
    setIsShuffling(true);
    setDrawnCards([]);

    setTimeout(() => {
      const count = tarotSpread === 'single' ? 1 : tarotSpread === 'three' ? 3 : 5;
      const shuffled = [...tarotCards].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, count).map(card => ({
        card,
        isReversed: Math.random() < 0.3 // 30% chance reversed
      }));
      setDrawnCards(selected);
      setIsShuffling(false);
      toast.star('Các lá bài định mệnh đã hé lộ dưới ánh trăng ✦');
    }, 800);
  };

  const filteredQuotes = quotes.filter(q => quoteCategory === 'all' || q.category === quoteCategory);

  const handleCopyQuote = (content: string, author: string) => {
    navigator.clipboard.writeText(`"${content}" — ${author}`);
    toast.success('Đã sao chép câu nói chữa lành ✦');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-500 dark:text-amber-300 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5" /> Không Gian Kỳ Diệu
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
          Không Gian Khác
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Nơi trải nghiệm bài Tarot huyền bí, đài quan sát bầu trời sao và những câu châm ngôn chữa lành.
        </p>

        {/* Space Hub Navigation Tabs */}
        <div className="pt-4 flex justify-center">
          <div className="flex flex-wrap items-center justify-center p-1 bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs backdrop-blur-md gap-1">
            <button
              onClick={() => setActiveTab('tarot')}
              className={`px-3.5 py-2 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'tarot'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mystic Tarot</span>
            </button>

            <button
              onClick={() => setActiveTab('observatory')}
              className={`px-3.5 py-2 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'observatory'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Đài Thiên Văn</span>
            </button>

            <button
              onClick={() => setActiveTab('quotes')}
              className={`px-3.5 py-2 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'quotes'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Quote className="w-3.5 h-3.5" />
              <span>Góc Chữa Lành</span>
            </button>

            <button
              onClick={() => setActiveTab('background')}
              className={`px-3.5 py-2 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'background'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Bầu Trời Đêm</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: MYSTIC TAROT */}
      {activeTab === 'tarot' && (
        <div className="space-y-8">
          <GlassCard className="p-6 sm:p-8 text-center space-y-6 max-w-3xl mx-auto" variant="porch">
            <div className="space-y-2">
              <span className="text-xs text-amber-300 font-bold uppercase tracking-widest block">
                ✦ Bói Bài Chiêm Tinh Dưới Ánh Trăng ✦
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Hãy tập trung vào câu hỏi hoặc tâm sự của bạn
              </h2>
              <p className="text-xs text-slate-300 max-w-lg mx-auto">
                Hít thở sâu 3 nhịp, nghĩ về điều bạn đang băn khoăn và chọn kiểu trải bài phù hợp dưới đây.
              </p>
            </div>

            {/* Spread Selector */}
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setTarotSpread('single')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  tarotSpread === 'single'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                1 Lá (Thông điệp ngày)
              </button>
              <button
                onClick={() => setTarotSpread('three')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  tarotSpread === 'three'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                3 Lá (Quá khứ - Hiện tại - Tương lai)
              </button>
              <button
                onClick={() => setTarotSpread('five')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  tarotSpread === 'five'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                5 Lá (Ngũ Hành Vũ Trụ)
              </button>
            </div>

            {/* Draw Button */}
            <div>
              <Button
                variant="gold"
                size="lg"
                onClick={handleDrawTarot}
                disabled={isShuffling}
                icon={<RotateCw className={`w-4 h-4 ${isShuffling ? 'animate-spin' : ''}`} />}
              >
                {isShuffling ? 'Đang Xào Bài Trong Màn Đêm...' : 'Rút Bài Dưới Ánh Trăng ✦'}
              </Button>
            </div>
          </GlassCard>

          {/* Drawn Cards Display */}
          {drawnCards.length > 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {drawnCards.map(({ card, isReversed }, index) => {
                  const positionLabel =
                    tarotSpread === 'three'
                      ? index === 0 ? '✦ Quá Khứ' : index === 1 ? '✦ Hiện Tại' : '✦ Tương Lai'
                      : tarotSpread === 'five'
                      ? index === 0 ? '✦ Đất (Nền tảng)' : index === 1 ? '✦ Nước (Cảm xúc)' : index === 2 ? '✦ Lửa (Hành động)' : index === 3 ? '✦ Gió (Suy nghĩ)' : '✦ Tinh Tú (Kết quả)'
                      : '✦ Lời Nhắn Từ Vũ Trụ';

                  return (
                    <GlassCard
                      key={index}
                      className="p-5 flex flex-col justify-between space-y-4 border-amber-300/40 dark:border-amber-400/30"
                      variant="glow"
                    >
                      <div className="space-y-3 text-center">
                        <Badge variant="gold">{positionLabel}</Badge>
                        
                        <div className="relative mx-auto w-32 h-48 rounded-2xl overflow-hidden ring-2 ring-amber-400 shadow-xl bg-slate-900">
                          <img
                            src={card.image}
                            alt={card.name}
                            className={`w-full h-full object-cover transition-transform duration-500 ${isReversed ? 'rotate-180' : ''}`}
                          />
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center gap-1.5">
                            {card.name}
                            {isReversed && <span className="text-xs text-rose-500 font-semibold">(Ngược)</span>}
                          </h3>
                          <span className="text-[11px] text-slate-400">Bộ: {card.suit || card.arcana}</span>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-indigo-100/40 dark:border-slate-800">
                        <div>
                          <strong className="text-indigo-600 dark:text-amber-300">Ý nghĩa: </strong>
                          <span>{isReversed ? card.reversed : card.upright}</span>
                        </div>
                        {card.advice && (
                          <p className="text-[11px] text-slate-400 italic">
                            "Lời khuyên: {card.advice}"
                          </p>
                        )}
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: OBSERVATORY & CONSTELLATIONS */}
      {activeTab === 'observatory' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Constellations List */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Các Chòm Sao Tiêu Biểu
            </h3>

            <div className="space-y-2">
              {constellations.map((c) => (
                <GlassCard
                  key={c.id}
                  onClick={() => setSelectedConstellation(c)}
                  hoverEffect={true}
                  className={`p-3.5 text-left transition-all ${
                    selectedConstellation.id === c.id
                      ? 'border-amber-400/80 bg-amber-50/20 dark:bg-amber-950/20 shadow-md ring-1 ring-amber-400'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{c.name}</h4>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <span className="text-[10px] text-slate-400">{c.season}</span>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Right Column: Active Constellation Showcase */}
          <div className="lg:col-span-8 space-y-6">
            <GlassCard variant="porch" className="p-6 sm:p-8 space-y-6">
              <div className="space-y-2">
                <span className="text-xs text-amber-300 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-amber-300" /> Đài Quan Sát Thiên Văn
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {selectedConstellation.name}
                </h2>
                <Badge variant="gold">Thời điểm quan sát tốt nhất: {selectedConstellation.season}</Badge>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-200">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-indigo-500/20 space-y-1">
                  <span className="font-bold text-amber-300 block">Các ngôi sao định danh:</span>
                  <p className="text-slate-300">{selectedConstellation.stars}</p>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-slate-100 block">Thần thoại & Truyền thuyết:</span>
                  <p className="leading-relaxed text-slate-300">{selectedConstellation.myth}</p>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-amber-300 block">Ý nghĩa chiêm nghiệm dưới hiên nhà:</span>
                  <p className="leading-relaxed text-slate-300">{selectedConstellation.meaning}</p>
                </div>
              </div>
            </GlassCard>
          </div>

        </div>
      )}

      {/* TAB 3: CELESTIAL QUOTES */}
      {activeTab === 'quotes' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-2xl text-xs w-fit mx-auto">
            {quoteCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setQuoteCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl font-medium transition-all ${
                  quoteCategory === cat
                    ? 'bg-pink-500 text-white font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {cat === 'all' ? 'Tất cả' : cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredQuotes.map((q) => (
              <GlassCard key={q.id} className="p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <Badge variant="tag">{q.category}</Badge>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 italic leading-relaxed">
                    "{q.content}"
                  </p>
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-300 block">
                    — {q.author}
                  </span>
                </div>

                <div className="pt-2 border-t border-indigo-100/40 dark:border-slate-800 flex items-center justify-between text-xs">
                  <button
                    onClick={() => onLikeQuote(q.id)}
                    className="flex items-center gap-1 text-rose-500 hover:text-rose-600 font-semibold"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>{q.likes || 0}</span>
                  </button>

                  <button
                    onClick={() => handleCopyQuote(q.content, q.author)}
                    className="text-slate-400 hover:text-slate-200 p-1 flex items-center gap-1"
                    title="Sao chép"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép</span>
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: LIVE NIGHT SKY BACKGROUND PICKER */}
      {activeTab === 'background' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Chọn Bầu Khí Quyển Dưới Mái Hiên
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Thay đổi không gian thị giác thời gian thực theo tâm trạng của bạn.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { id: 'default', name: 'Hiên Đêm Yên Bình', icon: <Moon className="w-6 h-6 text-amber-300" />, desc: 'Sao dịu nhẹ & gió đêm' },
              { id: 'night', name: 'Bầu Trời Tinh Tú', icon: <Star className="w-6 h-6 text-indigo-400" />, desc: 'Dày đặc sao lấp lánh' },
              { id: 'milkyway', name: 'Dải Ngân Hà', icon: <Sparkles className="w-6 h-6 text-purple-400" />, desc: 'Vệt sáng vũ trụ mộng mơ' },
              { id: 'porch', name: 'Hiên Trà Đêm', icon: <Flame className="w-6 h-6 text-amber-400" />, desc: 'Ánh đèn vàng ấm áp' },
              { id: 'firefly', name: 'Rừng Đom Đóm', icon: <Trees className="w-6 h-6 text-emerald-400" />, desc: 'Đom đóm lập lòe' },
              { id: 'rain', name: 'Mưa Rơi Tí Tách', icon: <CloudRain className="w-6 h-6 text-sky-400" />, desc: 'Hạt mưa đêm thanh thản' },
              { id: 'aurora', name: 'Cực Quang Huyền Ảo', icon: <Sun className="w-6 h-6 text-teal-400" />, desc: 'Dải màu xanh ngọc' },
              { id: 'snow', name: 'Tuyết Rơi Đêm Sao', icon: <Snowflake className="w-6 h-6 text-blue-200" />, desc: 'Bông tuyết trắng xóa' },
            ].map((theme) => {
              const isSelected = backgroundTheme === theme.id;
              return (
                <GlassCard
                  key={theme.id}
                  onClick={() => {
                    setBackgroundTheme(theme.id as BackgroundTheme);
                    toast.success(`Đã đổi bầu không khí thành "${theme.name}" ✦`);
                  }}
                  hoverEffect={true}
                  className={`p-4 text-center space-y-2 cursor-pointer transition-all ${
                    isSelected ? 'ring-2 ring-amber-400 border-amber-400 bg-amber-50/20 dark:bg-amber-950/20' : ''
                  }`}
                >
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-900/80 flex items-center justify-center shadow-inner">
                    {theme.icon}
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{theme.name}</h4>
                  <p className="text-[10px] text-slate-400">{theme.desc}</p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
