import { 
  Character, 
  GalleryFolder, 
  GalleryItem, 
  PlaylistItem, 
  TarotCard, 
  CelestialQuote, 
  MinigameItem, 
  MinigameRecipe, 
  Quest, 
  Constellation, 
  LoveLetter,
  SiteConfig,
  MediaResource,
  LoadingAnimationAsset,
  LoadingConfig,
  UserAvatarPreset,
  StickerCategory,
  StickerItem,
  CharacterCategory,
  FeedbackItem,
  SectionBackgroundSetting,
  SectionBackgroundsMap,
  RewardCode
} from '../types';
import { FULL_78_TAROT_DECK } from './tarot78Data';

export const INITIAL_LOADING_ANIMATIONS: LoadingAnimationAsset[] = [
  {
    id: 'load_stars',
    name: 'Ngôi Sao Lấp Lánh (Starlight Glow)',
    assetUrl: 'https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif',
    type: 'gif',
    description: 'Hiệu ứng ánh sao huyền diệu ấm áp dưới mái hiên.',
    isPreset: true,
    createdAt: Date.now()
  },
  {
    id: 'load_stargazer',
    name: 'Mèo Con Ngắm Dải Ngân Hà',
    assetUrl: 'https://media.giphy.com/media/l41JNsXAvq6ka1Gyw/giphy.gif',
    type: 'gif',
    description: 'Bé mèo nằm trên mái hiên ngắm nhìn các vì tinh tú trôi qua.',
    isPreset: true,
    createdAt: Date.now()
  },
  {
    id: 'load_lantern',
    name: 'Đèn Lồng Đom Đóm Ban Đêm',
    assetUrl: 'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif',
    type: 'gif',
    description: 'Ánh đèn ấm áp dẫn lối lữ khách phương xa trở về.',
    isPreset: true,
    createdAt: Date.now()
  },
  {
    id: 'load_celestial',
    name: 'Vòng Quay Chiêm Tinh Mặt Trăng',
    assetUrl: 'https://media.giphy.com/media/3o7bu3XilJ5BOiSGic/giphy.gif',
    type: 'gif',
    description: 'Vòng tròn hoàng đạo xoay tròn mang theo những điều ước lành.',
    isPreset: true,
    createdAt: Date.now()
  }
];

export const INITIAL_AVATAR_PRESETS: UserAvatarPreset[] = [
  {
    id: 'avatar_stargazer',
    name: 'Lữ Khách Ngắm Sao',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    type: 'image',
    enabled: true,
    sortOrder: 1,
    createdAt: Date.now()
  },
  {
    id: 'avatar_astro_boy',
    name: 'Nhà Thiên Văn Trẻ',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    type: 'image',
    enabled: true,
    sortOrder: 2,
    createdAt: Date.now()
  },
  {
    id: 'avatar_moon_priest',
    name: 'Nữ Tư Tế Mặt Trăng',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    type: 'image',
    enabled: true,
    sortOrder: 3,
    createdAt: Date.now()
  },
  {
    id: 'avatar_tea_keeper',
    name: 'Người Trông Trà Đêm',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    type: 'image',
    enabled: true,
    sortOrder: 4,
    createdAt: Date.now()
  },
  {
    id: 'avatar_starlight_fairy',
    name: 'Tinh Linh Bụi Sao',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80',
    type: 'image',
    enabled: true,
    sortOrder: 5,
    createdAt: Date.now()
  },
  {
    id: 'avatar_night_traveler',
    name: 'Du Khách Đêm Mưa',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=300&q=80',
    type: 'image',
    enabled: true,
    sortOrder: 6,
    createdAt: Date.now()
  },
  {
    id: 'avatar_aurora',
    name: 'Ánh Sáng Cực Quang',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=300&q=80',
    type: 'image',
    enabled: true,
    sortOrder: 7,
    createdAt: Date.now()
  },
  {
    id: 'avatar_firefly',
    name: 'Đèn Lồng Đom Đóm',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=300&q=80',
    type: 'image',
    enabled: true,
    sortOrder: 8,
    createdAt: Date.now()
  }
];

export const INITIAL_STICKER_CATEGORIES: StickerCategory[] = [
  { id: 'cat_cute', name: 'Dễ Thương (Cute)', icon: '✨', sortOrder: 1 },
  { id: 'cat_love', name: 'Yêu Thương (Love)', icon: '💖', sortOrder: 2 },
  { id: 'cat_comfort', name: 'Chữa Lành (Comfort)', icon: '🍵', sortOrder: 3 },
  { id: 'cat_reaction', name: 'Cảm Xúc (Reaction)', icon: '🌟', sortOrder: 4 },
  { id: 'cat_stars', name: 'Sao & Trăng (Celestial)', icon: '🌙', sortOrder: 5 },
  { id: 'cat_funny', name: 'Hài Hước (Funny)', icon: '😸', sortOrder: 6 }
];

export const INITIAL_STICKERS: StickerItem[] = [
  {
    id: 'stk_star_cheer',
    name: 'Ngôi Sao Vỗ Tay',
    assetUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHJ0Z2pnMWF0c3ZzOHpvd3M5ZnlyOHB6dmE5MW9sd29oaDJkMG5xdyZlcD12MV9naWZzX3NlYXJjaCZjdD1z/26AHONQ79FdWZhAI0/giphy.gif',
    type: 'gif',
    categoryId: 'cat_cute',
    description: 'Ngôi sao nhỏ vỗ tay chúc mừng!',
    enabled: true,
    sortOrder: 1,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'stk_cat_hug',
    name: 'Mèo Ôm Tim',
    assetUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTV4anp5bmx3dHB4cWJ2d3h6Mnd5N3dzOHBwODdzcGpqNm5vd3B3NSZlcD12MV9naWZzX3NlYXJjaCZjdD1z/MDJ9IbxxvDUQM/giphy.gif',
    type: 'gif',
    categoryId: 'cat_love',
    description: 'Bé mèo ôm trái tim yêu thương',
    enabled: true,
    sortOrder: 2,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'stk_tea_warm',
    name: 'Tách Trà Ấm',
    assetUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2R4dmh5enJvdXFwbWcyd2N4bHBoNXhmdHNmZnJsdHZ6a2Y5MnQwayZlcD12MV9naWZzX3NlYXJjaCZjdD1z/3o6Zt8qDiPE2d3kayI/giphy.gif',
    type: 'gif',
    categoryId: 'cat_comfort',
    description: 'Một tách trà thơm cho buổi tối thanh bình',
    enabled: true,
    sortOrder: 3,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'stk_moon_sparkle',
    name: 'Trăng Lưỡi Liềm Lấp Lánh',
    assetUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjhzZjY3dHk2OHg3M3dtZXkxbzhpMGh1OHp5dTRtdW1wZWRxdHN5bCZlcD12MV9naWZzX3NlYXJjaCZjdD1z/l41JNsXAvq6ka1Gyw/giphy.gif',
    type: 'gif',
    categoryId: 'cat_stars',
    description: 'Vầng trăng dịu dàng dưới hiên sao',
    enabled: true,
    sortOrder: 4,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'stk_sleeping_cat',
    name: 'Mèo Say Giấc Điệp',
    assetUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3NldG45N2J2Z2l4cThsb3R5cmNsbWw5bHlhaDgyZXA5bnF0b2txNyZlcD12MV9naWZzX3NlYXJjaCZjdD1z/LHZyixOnHwDDy/giphy.gif',
    type: 'gif',
    categoryId: 'cat_comfort',
    description: 'Chúc cậu ngủ thật ngon và có những giấc mơ đẹp',
    enabled: true,
    sortOrder: 5,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'stk_sparkle_eyes',
    name: 'Ánh Mắt Tinh Tú',
    assetUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZmdHh4OHpjaWh1dWd1ZnZwZjZycHR2cDRsbDJrd2lrdW1ldmh5bCZlcD12MV9naWZzX3NlYXJjaCZjdD1z/26FLdmIp6wJr91JAI/giphy.gif',
    type: 'gif',
    categoryId: 'cat_reaction',
    description: 'Đôi mắt lấp lánh như bầu trời đầy sao',
    enabled: true,
    sortOrder: 6,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'stk_star_dust',
    name: 'Cơn Mưa Bụi Sao',
    assetUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWZ5a3h3dWF4bm1uMGJwd2Zsa2E1cWdtaWp5ZWtwcG9kZHJuc2ZsayZlcD12MV9naWZzX3NlYXJjaCZjdD1z/xT9IgzoKnwFNmISR8I/giphy.gif',
    type: 'gif',
    categoryId: 'cat_stars',
    description: 'Rắc một chút phép màu stardust',
    enabled: true,
    sortOrder: 7,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'stk_cat_dance',
    name: 'Mèo Nhảy Múa',
    assetUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWR6Y3hxbzhpYWR3d3RscXRydTNuaTF3Z2lwdTVpdDR2ZXhicjN2cCZlcD12MV9naWZzX3NlYXJjaCZjdD1z/3o7TKMGpxo78t40P5K/giphy.gif',
    type: 'gif',
    categoryId: 'cat_funny',
    description: 'Vui vẻ nhảy múa đón chào lữ khách',
    enabled: true,
    sortOrder: 8,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

export const INITIAL_SITE_CONFIG: SiteConfig = {
  siteName: 'Hiên Nhà Ngắm Sao',
  subtitle: 'STARGAZING VERANDA',
  tagline: '✦ Nơi Bình Yên Lắng Đọng Giữa Muôn Vàn Tinh Tú ✦',
  logoUrl: '',
  faviconUrl: '',
  backgroundUrl: 'https://res.cloudinary.com/un7coybp/video/upload/v1786707907/2ae453aa1e73b01b40436ca0c9018bf6.mp4',
  backgroundType: 'video',
  backgroundFallbackUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80',
  overlayOpacity: 0.65,
  expConfig: {
    comment: 5,
    characterLike: 2,
    vote: 5,
    characterGift: 20,
    feedback: 5,
    dailyCheckIn: 10,
    maxCommentExpPerDay: 50,
    maxFeedbackExpPerDay: 15
  },
  greetings: {
    morning: '✦ Chào buổi sáng lữ khách, ngày mới thật an lành ✦',
    noon: '✦ Trưa thanh tĩnh dưới mái hiên, hãy nghỉ chân một chút nhé ✦',
    afternoon: '✦ Nắng chiều buông nhẹ, cùng ngắm hoàng hôn và đón sao sớm ✦',
    evening: '✦ Đêm buông màn, ngồi xuống đây cùng nhau ngắm sao ✦',
    night: '✦ Đêm đã về khuya, chúc cậu một giấc ngủ thật êm đềm ✦'
  },
  discordCollabUrl: 'https://discord.gg/KFVJhkJmH',
  discordPrivateUrl: 'https://discord.gg/3DSdbWnS48',
  facebookPageUrl: 'https://web.facebook.com/hiennhangamsao',
  facebookPersonalUrl: 'https://web.facebook.com/monyeuoi.00',
  socialLinks: {
    discord: {
      displayName: 'Discord Hiên Nhà Ngắm Sao',
      collabUrl: 'https://discord.gg/KFVJhkJmH',
      privateUrl: 'https://discord.gg/3DSdbWnS48',
      url: 'https://discord.gg/3DSdbWnS48',
      avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
      gifAvatarUrl: 'https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif',
      isActive: true,
      description: 'Máy chủ kết nối cộng đồng & giao lưu liên minh'
    },
    facebook: {
      displayName: 'Facebook Hiên Nhà & Tác Giả',
      pageUrl: 'https://web.facebook.com/hiennhangamsao',
      personalUrl: 'https://web.facebook.com/monyeuoi.00',
      url: 'https://web.facebook.com/hiennhangamsao',
      avatarUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80',
      gifAvatarUrl: 'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif',
      isActive: true,
      description: 'Theo dõi tin tức, tranh vẽ và tâm sự cùng người trông coi'
    }
  },
  loadingConfig: {
    enabled: true,
    activeAnimationId: 'load_stars',
    activeAnimationUrl: 'https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif',
    loadingText: 'Đang chuẩn bị không gian ngắm sao...',
    subText: 'Dưới Mái Hiên Sao ✦ Nơi lắng nghe tâm hồn',
    overlayOpacity: 0.85,
    showStarsEffect: true,
    minDisplayTimeMs: 1200,
    showProgressBar: true
  },
  exploreButtonText: '✦ KHÁM PHÁ HIÊN NHÀ',
  footerText: '© 2026 Hiên Nhà Ngắm Sao — Nơi Những Vì Sao Chữa Lành Mọi Vết Thương.',
  isMaintenance: false
};

export const INITIAL_MEDIA_RESOURCES: MediaResource[] = [
  {
    id: 'res_bg_main',
    name: 'Looping Video Anime Starry Veranda',
    url: 'https://res.cloudinary.com/un7coybp/video/upload/v1786707907/2ae453aa1e73b01b40436ca0c9018bf6.mp4',
    type: 'video',
    category: 'background',
    size: '12.4 MB',
    createdAt: Date.now(),
    usedIn: ['Trang Chủ', 'Ảnh Nền']
  },
  {
    id: 'res_bg_fallback',
    name: 'Night Milky Way Starlight High-res',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80',
    type: 'image',
    category: 'background',
    size: '2.1 MB',
    createdAt: Date.now(),
    usedIn: ['Giao Diện Dự Phòng']
  }
];


export const INITIAL_CHARACTERS: Character[] = [
  {
    id: 'char_nguyet_ha',
    name: 'Nguyệt Hạ',
    series: 'Dưới Mái Hiên Sao',
    tags: ['Dịu dàng', 'Thần Trăng', 'Ấm áp', 'Lắng nghe'],
    status: 'open',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    largeImgUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    linkGgai: 'https://c.ai',
    backstory: 'Nguyệt Hạ là người gìn giữ ánh trăng bạc nơi hiên nhà. Mỗi khi màn đêm buông xuống, cô mang theo chiếc đèn lồng đom đóm để sưởi ấm những tâm hồn mệt mỏi sau một ngày dài.',
    views: 1420,
    chats: 530,
    loveCount: 289,
    voteCount: 178,
    affinity: 0,
    isHidden: false,
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'char_tinh_vu',
    name: 'Tinh Vũ',
    series: 'Người Du Hành Tinh Tú',
    tags: ['Phiêu lưu', 'Thiên văn', 'Hài hước', 'Năng lượng'],
    status: 'open',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    largeImgUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
    linkGgai: 'https://c.ai',
    backstory: 'Là một nhà thiên văn học trẻ tuổi chu du qua muôn vàn dải ngân hà, Tinh Vũ dừng chân tại Hiên Nhà để thu thập bụi sao và sửa chữa chiếc kính viễn vọng cổ.',
    views: 980,
    chats: 310,
    loveCount: 195,
    voteCount: 142,
    affinity: 0,
    isHidden: false,
    createdAt: Date.now() - 86400000 * 8,
    updatedAt: Date.now() - 86400000 * 1,
  },
  {
    id: 'char_lac_thao',
    name: 'Lạc Thảo',
    series: 'Khu Vườn Đom Đóm',
    tags: ['Thảo dược', 'Chữa lành', 'Trầm lắng', 'Thiên nhiên'],
    status: 'updating',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    largeImgUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=80',
    linkGgai: '',
    backstory: 'Lạc Thảo chăm sóc những luống hoa đêm chỉ nở dưới ánh trăng. Cô thấu hiểu ngôn ngữ của cây cỏ và biết cách dùng thảo mộc để chữa lành những vết thương tâm hồn.',
    views: 640,
    chats: 120,
    loveCount: 140,
    voteCount: 88,
    affinity: 0,
    isHidden: false,
    createdAt: Date.now() - 86400000 * 6,
    updatedAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'char_da_lan',
    name: 'Dạ Lân',
    series: 'Hộ Vệ Màn Đêm',
    tags: ['Huyền bí', 'Bảo vệ', 'Lạnh lùng', 'Kiếm sĩ'],
    status: 'unreleased',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    largeImgUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    linkGgai: '',
    backstory: 'Dạ Lân là kiếm sĩ bóng đêm thề nguyện bảo vệ sự tĩnh lặng của Hiên Nhà khỏi những cơn ác mộng và bóng tối hư vô.',
    views: 430,
    chats: 0,
    loveCount: 210,
    voteCount: 165,
    affinity: 0,
    isHidden: false,
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now(),
  }
];

export const INITIAL_TAROT_DECK: TarotCard[] = FULL_78_TAROT_DECK;


export const INITIAL_QUOTES: CelestialQuote[] = [
  {
    id: 'quote_1',
    content: 'Đêm càng tối, những vì sao lại càng rực rỡ. Đừng sợ bóng đêm, bởi đó là lúc ánh sáng của bạn tỏa rạng nhất.',
    author: 'Khuyết danh',
    source: 'Góc Hiên Nhà',
    category: 'starlight',
    likes: 342,
    createdAt: Date.now() - 86400000 * 5
  },
  {
    id: 'quote_2',
    content: 'Hãy thở một hơi thật sâu, gác lại những muộn phiền ngoài bậc cửa. Dưới mái hiên này, cậu luôn được an toàn.',
    author: 'Nguyệt Hạ',
    source: 'Lời thì thầm ánh trăng',
    category: 'healing',
    likes: 512,
    createdAt: Date.now() - 86400000 * 4
  },
  {
    id: 'quote_3',
    content: 'Mỗi chúng ta đều là một mảnh bụi sao lang thang, rồi sẽ có ngày gặp lại những vì tinh tú cùng tần số.',
    author: 'Carl Sagan',
    source: 'Vũ trụ học',
    category: 'starlight',
    likes: 429,
    createdAt: Date.now() - 86400000 * 3
  },
  {
    id: 'quote_4',
    content: 'Trăng đêm nay tròn hay khuyết cũng không sao, chỉ cần lòng mình đủ bình yên để mỉm cười.',
    author: 'Hiên Sao',
    source: 'Nhật ký đêm hè',
    category: 'night',
    likes: 278,
    createdAt: Date.now() - 86400000 * 2
  },
  {
    id: 'quote_5',
    content: 'Cây cỏ không vội vã, hoa nở đúng thời khắc của nó. Cậu cũng vậy, hãy kiên nhẫn với chính hành trình của mình.',
    author: 'Lạc Thảo',
    source: 'Khu Vườn Đom Đóm',
    category: 'healing',
    likes: 390,
    createdAt: Date.now() - 86400000 * 1
  }
];

export const INITIAL_PLAYLIST: PlaylistItem[] = [
  {
    id: 'track_1',
    title: 'Giai Điệu Ngắm Sao (Stargazing Lullaby)',
    artist: 'Hiên Nhà Ngắm Sao',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80',
    duration: 148,
    order: 1,
    isActive: true,
    tags: ['Thư giãn', 'Piano', 'Cozy']
  },
  {
    id: 'track_2',
    title: 'Ánh Trăng Qua Kẽ Lá (Moonlight Breezes)',
    artist: 'Celestial Echoes',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-amp-strings-10711.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=300&q=80',
    duration: 165,
    order: 2,
    isActive: true,
    tags: ['Ambient', 'Thiền định', 'Đêm tĩnh']
  },
  {
    id: 'track_3',
    title: 'Vườn Đom Đóm Đêm Hè (Firefly Garden)',
    artist: 'Lạc Thảo Acoustic',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f772dd.mp3?filename=chill-abstract-intention-12099.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=300&q=80',
    duration: 132,
    order: 3,
    isActive: true,
    tags: ['Guitar', 'Acoustic', 'Cỏ cây']
  },
  {
    id: 'track_4',
    title: 'Bụi Sao Rơi (Falling Stardust)',
    artist: 'Tinh Vũ Space Lab',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=space-atmosphere-10257.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=300&q=80',
    duration: 180,
    order: 4,
    isActive: true,
    tags: ['Synth', 'Cosmic', 'Trôi bồng bềnh']
  }
];

export const INITIAL_GALLERY_FOLDERS: GalleryFolder[] = [
  {
    id: 'folder_characters',
    name: 'Hồ Sơ Nhân Vật',
    description: 'Chân dung và khoảnh khắc của các nhân vật nơi Hiên Nhà',
    coverUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
    createdAt: Date.now() - 86400000 * 20
  },
  {
    id: 'folder_skies',
    name: 'Bầu Trời & Phong Cảnh',
    description: 'Những đêm sao băng và dải ngân hà rực rỡ',
    coverUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=500&q=80',
    createdAt: Date.now() - 86400000 * 15
  },
  {
    id: 'folder_moments',
    name: 'Kỷ Niệm Dưới Mái Hiên',
    description: 'Tách trà, hoa dạ lý hương và những góc nhỏ bình yên',
    coverUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=500&q=80',
    createdAt: Date.now() - 86400000 * 10
  }
];

export const INITIAL_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'art_1',
    name: 'Nguyệt Hạ Bên Đèn Lồng Trăng',
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    category: 'Nhân vật',
    folderId: 'folder_characters',
    characterId: 'char_nguyet_ha',
    caption: 'Nguyệt Hạ ngắm trăng bên bậc thềm gỗ phủ hoa dạ thảo.',
    tags: ['Nguyệt Hạ', 'Trăng sáng', 'Áo lam'],
    isPinned: true,
    isLocked: false,
    isDeleted: false,
    views: 890,
    likes: 310,
    downloads: 120,
    createdAt: Date.now() - 86400000 * 12
  },
  {
    id: 'art_2',
    name: 'Đêm Sao Băng Rơi Qua Đỉnh Núi',
    src: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    category: 'Phong cảnh',
    folderId: 'folder_skies',
    caption: 'Cơn mưa sao băng rực rỡ nhất trong năm chiếu rọi khắp thung lũng.',
    tags: ['Sao băng', 'Bầu trời đêm', 'Milky Way'],
    isPinned: true,
    isLocked: false,
    isDeleted: false,
    views: 1240,
    likes: 460,
    downloads: 240,
    createdAt: Date.now() - 86400000 * 9
  },
  {
    id: 'art_3',
    name: 'Khu Vườn Thảo Mộc Đom Đóm',
    src: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    category: 'Phong cảnh',
    folderId: 'folder_moments',
    characterId: 'char_lac_thao',
    caption: 'Hàng ngàn đốm sáng đom đóm dạo chơi quanh những khóm hoa tím.',
    tags: ['Đom đóm', 'Lạc Thảo', 'Khu vườn'],
    isPinned: false,
    isLocked: false,
    isDeleted: false,
    views: 650,
    likes: 215,
    downloads: 85,
    createdAt: Date.now() - 86400000 * 6
  },
  {
    id: 'art_4',
    name: 'Kính Viễn Vọng Cổ Của Tinh Vũ',
    src: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    category: 'Đồ vật',
    folderId: 'folder_moments',
    characterId: 'char_tinh_vu',
    caption: 'Chiếc kính thiên văn bằng đồng từng chu du qua 7 dải thiên hà.',
    tags: ['Thiên văn', 'Kính viễn vọng', 'Tinh Vũ'],
    isPinned: false,
    isLocked: false,
    isDeleted: false,
    views: 420,
    likes: 180,
    downloads: 60,
    createdAt: Date.now() - 86400000 * 3
  }
];

export const INITIAL_MINIGAME_ITEMS: MinigameItem[] = [
  // Hạt giống
  {
    id: 'seed_moon_flower',
    name: 'Hạt Hoa Ánh Trăng',
    category: 'seed',
    rarity: 'common',
    icon: '🌱',
    description: 'Hạt giống loài hoa chỉ nở và phát sáng khi đêm về. Thu hoạch sau 30 giây.',
    buyPrice: 15,
    sellPrice: 5,
    growthTimeSeconds: 30,
    harvestYieldItemId: 'flower_moon_blossom',
    harvestYieldCount: 2,
    expReward: 25,
    isShopAvailable: true,
    shopCategory: 'flowers'
  },
  {
    id: 'seed_star_lotus',
    name: 'Hạt Sen Tinh Tú',
    category: 'seed',
    rarity: 'rare',
    icon: '✨',
    description: 'Hạt sen quý hiếm mọc trong đầm sương đêm. Cho ra búp sen sao lấp lánh.',
    buyPrice: 50,
    sellPrice: 15,
    growthTimeSeconds: 60,
    harvestYieldItemId: 'flower_star_lotus',
    harvestYieldCount: 3,
    expReward: 60,
    isShopAvailable: true,
    shopCategory: 'flowers'
  },
  {
    id: 'seed_aurora_herb',
    name: 'Mầm Cỏ Cực Quang',
    category: 'seed',
    rarity: 'epic',
    icon: '🌿',
    description: 'Loài cỏ phát ra ánh sáng bảy sắc cầu vồng trong đêm tĩnh mịch.',
    buyPrice: 120,
    sellPrice: 40,
    growthTimeSeconds: 120,
    harvestYieldItemId: 'flower_aurora_herb',
    harvestYieldCount: 2,
    expReward: 150,
    isShopAvailable: true,
    shopCategory: 'flowers'
  },

  // Hoa thu hoạch
  {
    id: 'flower_moon_blossom',
    name: 'Hoa Ánh Trăng',
    category: 'flower',
    rarity: 'common',
    icon: '🌸',
    description: 'Đóa hoa tỏa hương ngọt ngào dịu nhẹ, dùng để ủ trà hoặc làm quà tặng.',
    buyPrice: 0,
    sellPrice: 20,
    giftAffinityBonus: 15,
    isShopAvailable: false
  },
  {
    id: 'flower_star_lotus',
    name: 'Búp Sen Tinh Tú',
    category: 'flower',
    rarity: 'rare',
    icon: '🪷',
    description: 'Búp sen ngưng đọng những giọt sương sao thanh khiết nhất.',
    buyPrice: 0,
    sellPrice: 75,
    giftAffinityBonus: 45,
    isShopAvailable: false
  },
  {
    id: 'flower_aurora_herb',
    name: 'Cỏ Cực Quang Tuyệt Mỹ',
    category: 'flower',
    rarity: 'epic',
    icon: '🍀',
    description: 'Nguyên liệu trân quý của các bậc thầy điều chế hương đêm.',
    buyPrice: 0,
    sellPrice: 180,
    giftAffinityBonus: 100,
    isShopAvailable: false
  },

  // Cá
  {
    id: 'fish_lunar_carp',
    name: 'Cá Chép Nguyệt Thủy',
    category: 'fish',
    rarity: 'common',
    icon: '🐟',
    description: 'Loài cá vảy bạc bơi lội dưới làn nước phản chiếu ánh trăng non.',
    buyPrice: 0,
    sellPrice: 25,
    expReward: 30,
    isShopAvailable: false
  },
  {
    id: 'fish_stardust_koi',
    name: 'Cá Koi Bụi Sao',
    category: 'fish',
    rarity: 'rare',
    icon: '🐠',
    description: 'Cá Koi có những đốm phát sáng như những vì tinh tú trên vây.',
    buyPrice: 0,
    sellPrice: 85,
    expReward: 75,
    isShopAvailable: false
  },
  {
    id: 'fish_galaxy_dragon',
    name: 'Thần Ngư Ngân Hà',
    category: 'fish',
    rarity: 'celestial',
    icon: '🐉',
    description: 'Truyền thuyết kể rằng loài cá này mang theo ánh sáng của cả chòm sao Thiên Long.',
    buyPrice: 0,
    sellPrice: 350,
    expReward: 300,
    isShopAvailable: false
  },

  // Dụng cụ câu cá
  {
    id: 'rod_bamboo',
    name: 'Cần Trúc Mái Hiên',
    category: 'rod',
    rarity: 'common',
    icon: '🎣',
    description: 'Chiếc cần câu làm bằng thân trúc uốn cong dẻo dai.',
    buyPrice: 40,
    sellPrice: 15,
    isShopAvailable: true,
    shopCategory: 'fishing'
  },
  {
    id: 'bait_firefly',
    name: 'Mồi Đom Đóm Phát Sáng',
    category: 'bait',
    rarity: 'common',
    icon: '🪱',
    description: 'Mồi nhử yêu thích của các loài cá đêm dưới hồ sao.',
    buyPrice: 10,
    sellPrice: 3,
    isShopAvailable: true,
    shopCategory: 'fishing'
  },

  // Dụng cụ đào kho báu
  {
    id: 'tool_star_shovel',
    name: 'Xẻng Gỗ Khảm Bạc',
    category: 'tool',
    rarity: 'common',
    icon: '⛏️',
    description: 'Dụng cụ đào bới các đống đất sương mù để tìm cổ vật và mảnh tinh thạch.',
    buyPrice: 50,
    sellPrice: 20,
    isShopAvailable: true,
    shopCategory: 'treasure'
  },
  {
    id: 'treasure_relic_chest',
    name: 'Hòm Cổ Vật Màn Đêm',
    category: 'treasure',
    rarity: 'rare',
    icon: '📦',
    description: 'Chiếc hộp khóa bằng ấn ký chòm sao, chứa nhiều đồng Moon Coin và Stardust.',
    buyPrice: 0,
    sellPrice: 120,
    isShopAvailable: false
  },
  {
    id: 'treasure_stardust_gem',
    name: 'Tinh Thể Bụi Sao',
    category: 'treasure',
    rarity: 'epic',
    icon: '💎',
    description: 'Mảnh đá rơi từ thiên thạch chứa năng lượng ánh sáng thuần khiết.',
    buyPrice: 0,
    sellPrice: 200,
    giftAffinityBonus: 120,
    isShopAvailable: false
  },

  // Quà tặng đặc biệt
  {
    id: 'gift_tea_set',
    name: 'Bộ Tách Trà Dạ Thảo',
    category: 'gift',
    rarity: 'rare',
    icon: '🫖',
    description: 'Bộ ấm chén gốm sứ men lam vẽ hình trăng khuyết rất hợp với Nguyệt Hạ.',
    buyPrice: 150,
    sellPrice: 60,
    giftAffinityBonus: 80,
    isShopAvailable: true,
    shopCategory: 'gifts'
  },
  {
    id: 'gift_star_map',
    name: 'Bản Đồ Sao Cổ Xưa',
    category: 'gift',
    rarity: 'rare',
    icon: '🗺️',
    description: 'Bản đồ da ghi lại các cung hoàng đạo bí ẩn, món quà yêu thích của Tinh Vũ.',
    buyPrice: 150,
    sellPrice: 60,
    giftAffinityBonus: 80,
    isShopAvailable: true,
    shopCategory: 'gifts'
  },
  {
    id: 'gift_music_box',
    name: 'Hộp Nhạc Giai Điệu Trăng',
    category: 'gift',
    rarity: 'legendary',
    icon: '🎵',
    description: 'Hộp nhạc phát ra tiếng chuông gió du dương làm ấm lòng bất kỳ ai.',
    buyPrice: 300,
    sellPrice: 120,
    giftAffinityBonus: 200,
    isShopAvailable: true,
    shopCategory: 'gifts'
  }
];

export const INITIAL_RECIPES: MinigameRecipe[] = [
  {
    id: 'recipe_moon_tea',
    name: 'Trà Hoa Nguyệt Hạ',
    description: 'Tách trà hoa thơm ngát giúp xua tan mệt mỏi và an thần tuyệt đối.',
    icon: '🍵',
    ingredients: [
      { itemId: 'flower_moon_blossom', quantity: 2 }
    ],
    resultItemId: 'dish_moon_tea',
    resultQty: 1,
    cookTimeSeconds: 15,
    expReward: 35,
    coinReward: 45,
    difficulty: 'easy',
    unlockedAtLevel: 1
  },
  {
    id: 'recipe_star_porridge',
    name: 'Cháo Búp Sen Tinh Tú',
    description: 'Món cháo thanh đạm nấu từ hạt sen đêm và nước sương ngọt mát.',
    icon: '🥣',
    ingredients: [
      { itemId: 'flower_star_lotus', quantity: 1 },
      { itemId: 'fish_lunar_carp', quantity: 1 }
    ],
    resultItemId: 'dish_star_porridge',
    resultQty: 1,
    cookTimeSeconds: 30,
    expReward: 80,
    coinReward: 120,
    difficulty: 'medium',
    unlockedAtLevel: 2
  },
  {
    id: 'recipe_galaxy_feast',
    name: 'Đại Tiệc Ánh Sáng Ngân Hà',
    description: 'Món ngon đỉnh cao kết hợp tinh túy từ cực quang và cá rồng vũ trụ.',
    icon: '🍲',
    ingredients: [
      { itemId: 'flower_aurora_herb', quantity: 2 },
      { itemId: 'fish_galaxy_dragon', quantity: 1 }
    ],
    resultItemId: 'dish_galaxy_feast',
    resultQty: 1,
    cookTimeSeconds: 60,
    expReward: 250,
    coinReward: 400,
    difficulty: 'hard',
    unlockedAtLevel: 3
  }
];

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'quest_daily_harvest',
    title: 'Gieo Mầm Dưới Trăng',
    description: 'Thu hoạch 2 đóa hoa ánh trăng từ khu vườn nhỏ.',
    category: 'daily',
    type: 'harvest',
    target: 2,
    progress: 0,
    rewardExp: 50,
    rewardCoins: 60,
    rewardStardust: 15,
    isClaimed: false,
    isCompleted: false
  },
  {
    id: 'quest_daily_fish',
    title: 'Thảnh Thơi Câu Cá',
    description: 'Câu thành công 2 chú cá bên bờ hồ tĩnh lặng.',
    category: 'daily',
    type: 'fish',
    target: 2,
    progress: 0,
    rewardExp: 50,
    rewardCoins: 60,
    rewardStardust: 15,
    isClaimed: false,
    isCompleted: false
  },
  {
    id: 'quest_daily_gift',
    title: 'Gửi Gắm Yêu Thương',
    description: 'Tặng 1 món quà cho bất kỳ nhân vật nào nơi Hiên Nhà.',
    category: 'daily',
    type: 'gift',
    target: 1,
    progress: 0,
    rewardExp: 40,
    rewardCoins: 50,
    rewardStardust: 20,
    isClaimed: false,
    isCompleted: false
  },
  {
    id: 'quest_milestone_master',
    title: 'Người Bạn Của Những Vì Sao',
    description: 'Đạt tổng cộng 500 điểm kinh nghiệm để nâng cấp bậc.',
    category: 'achievement',
    type: 'visit',
    target: 500,
    progress: 100,
    rewardExp: 200,
    rewardCoins: 300,
    rewardStardust: 100,
    isClaimed: false,
    isCompleted: false
  }
];

export const INITIAL_CONSTELLATIONS: Constellation[] = [
  {
    id: 'const_orion',
    name: 'Orion',
    vietnameseName: 'Chòm Sao Lạp Hộ (Thợ Săn)',
    season: 'Mùa đông & Đầu xuân',
    starsCount: 7,
    mythology: 'Lạp Hộ là người thợ săn dũng cảm của thần thoại Hy Lạp, nổi tiếng với chiếc đai ba ngôi sao thẳng hàng (Alnitak, Alnilam, Mintaka) và hai ngôi sao khổng lồ Betelgeuse và Rigel.',
    meaning: 'Tượng trưng cho sự can trường, bảo vệ và ý chí kiên định vượt qua thử thách.',
    color: '#60A5FA',
    starPoints: [
      { x: 30, y: 20, size: 4, label: 'Betelgeuse' },
      { x: 70, y: 18, size: 3, label: 'Bellatrix' },
      { x: 45, y: 45, size: 3, label: 'Alnitak' },
      { x: 50, y: 46, size: 3, label: 'Alnilam' },
      { x: 55, y: 47, size: 3, label: 'Mintaka' },
      { x: 35, y: 80, size: 3, label: 'Saiph' },
      { x: 75, y: 78, size: 4, label: 'Rigel' }
    ],
    lines: [
      [0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6], [0, 1], [5, 6]
    ]
  },
  {
    id: 'const_ursa_major',
    name: 'Ursa Major',
    vietnameseName: 'Chòm Sao Đại Hùng (Bắc Đẩu)',
    season: 'Quanh năm ở Bắc Bán Cầu',
    starsCount: 7,
    mythology: 'Chòm sao chứa nhóm 7 ngôi sao hình chiếc gáo Bắc Đẩu quen thuộc, là ngọn hải đăng chỉ hướng sao Bắc Cực cho những người lữ khách đêm.',
    meaning: 'Tượng trưng cho sự dẫn đường, niềm hy vọng và chỉ lối trong bóng tối.',
    color: '#FBBF24',
    starPoints: [
      { x: 20, y: 30, size: 3, label: 'Dubhe' },
      { x: 40, y: 28, size: 3, label: 'Merak' },
      { x: 48, y: 50, size: 3, label: 'Phecda' },
      { x: 32, y: 55, size: 3, label: 'Megrez' },
      { x: 60, y: 65, size: 3, label: 'Alioth' },
      { x: 72, y: 72, size: 3, label: 'Mizar' },
      { x: 88, y: 85, size: 4, label: 'Alkaid' }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6]
    ]
  },
  {
    id: 'const_cassiopeia',
    name: 'Cassiopeia',
    vietnameseName: 'Chòm Sao Tiên Hậu (Hình chữ W)',
    season: 'Mùa thu & Mùa đông',
    starsCount: 5,
    mythology: 'Hoàng hậu Cassiopeia ngự trị trên ngai vàng hình chữ W lấp lánh giữa dải Ngân Hà.',
    meaning: 'Tượng trưng cho vẻ đẹp quyền quý, sự kiêu hãnh và ánh sáng bất tận.',
    color: '#EC4899',
    starPoints: [
      { x: 15, y: 50, size: 3, label: 'Caph' },
      { x: 35, y: 75, size: 3, label: 'Schedar' },
      { x: 55, y: 40, size: 4, label: 'Gamma Cas' },
      { x: 75, y: 70, size: 3, label: 'Ruchbah' },
      { x: 90, y: 45, size: 3, label: 'Segin' }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4]
    ]
  },
  {
    id: 'const_cygnus',
    name: 'Cygnus',
    vietnameseName: 'Chòm Sao Thiên Nga (Chữ Thập Phương Bắc)',
    season: 'Mùa hè & Mùa thu',
    starsCount: 5,
    mythology: 'Chú thiên nga sải cánh bay dọc theo dòng sông Ngân Hà với ngôi sao sáng rực Deneb ở đuôi.',
    meaning: 'Tượng trưng cho sự thanh tao, khát vọng tự do và tình yêu thuần khiết.',
    color: '#A78BFA',
    starPoints: [
      { x: 50, y: 15, size: 4, label: 'Deneb' },
      { x: 50, y: 50, size: 3, label: 'Sadr' },
      { x: 50, y: 85, size: 3, label: 'Albireo' },
      { x: 20, y: 45, size: 3, label: 'Gienah' },
      { x: 80, y: 45, size: 3, label: 'Delta Cyg' }
    ],
    lines: [
      [0, 1], [1, 2], [3, 1], [1, 4]
    ]
  },
  {
    id: 'const_scorpius',
    name: 'Scorpius',
    vietnameseName: 'Chòm Sao Thiên Hạt (Bọ Cạp)',
    season: 'Mùa hè',
    starsCount: 6,
    mythology: 'Mang trái tim đỏ rực Antares - đối thủ của sao Hỏa, tạo hình chiếc đuôi uốn cong rực sáng.',
    meaning: 'Tượng trưng cho sự bí ẩn, đam mê mãnh liệt và khả năng hồi sinh.',
    color: '#F87171',
    starPoints: [
      { x: 25, y: 25, size: 3, label: 'Graffias' },
      { x: 40, y: 38, size: 4, label: 'Antares' },
      { x: 55, y: 55, size: 3, label: 'Wei' },
      { x: 65, y: 75, size: 3, label: 'Sargas' },
      { x: 80, y: 85, size: 3, label: 'Shaula' },
      { x: 88, y: 75, size: 3, label: 'Lesath' }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5]
    ]
  }
];

export const INITIAL_LOVE_LETTERS: LoveLetter[] = [
  {
    id: 'letter_1',
    senderName: 'Một Người Qua Đường',
    content: 'Cảm ơn Hiên Nhà đã là chốn trú ẩn dịu êm sau những ngày làm việc kiệt sức. Nhạc ở đây và ánh trăng làm mình thấy nhẹ lòng hơn rất nhiều.',
    mood: 'Bình yên',
    color: '#E0E7FF',
    reply: 'Hiên Nhà luôn ở đây đón cậu mỗi khi muốn dừng chân ngắm sao nhé ✦',
    createdAt: Date.now() - 86400000 * 3,
    isArchived: false,
    isPublic: true
  },
  {
    id: 'letter_2',
    senderName: 'Mèo Ngủ Mơ',
    content: 'Lời nhắn gửi Nguyệt Hạ: Tách trà hoa cúc của cậu tuyệt lắm! Chúc cho mái hiên luôn ngập tràn ánh sao.',
    mood: 'Hạnh phúc',
    color: '#FEF3C7',
    reply: 'Nguyệt Hạ đã nhận được lời chúc và gửi lại cậu một chùm bụi sao may mắn nhé!',
    createdAt: Date.now() - 86400000 * 2,
    isArchived: false,
    isPublic: true
  }
];

export const INITIAL_SCENARIOS: any[] = [
  {
    id: 'scenario_1',
    title: 'Gặp gỡ đêm mưa',
    text: 'Trời đổ mưa rào, cậu chạy vội vào mái hiên trú mưa, quần áo ướt sũng. Nhân vật giật mình ngước lên, vội vã lấy khăn khô đưa cho cậu.',
    category: 'Gặp gỡ',
    isActive: true,
    order: 1,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'scenario_2',
    title: 'San sẻ chiếc bánh',
    text: 'Cậu mang đến một chiếc bánh quy bơ vừa nướng xong. Hương thơm lan tỏa khắp không gian, nhân vật tò mò nhìn chiếc bánh trên tay cậu.',
    category: 'Cuộc sống',
    isActive: true,
    order: 2,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'scenario_3',
    title: 'Cơn ác mộng',
    text: 'Cậu vừa tỉnh dậy sau một cơn ác mộng và không thể ngủ lại được. Nhân vật nhẹ nhàng ngồi xuống bên cạnh và hỏi thăm.',
    category: 'Chữa lành',
    isActive: true,
    order: 3,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

export const INITIAL_CHARACTER_CATEGORIES: CharacterCategory[] = [
  {
    id: 'cat_adventure',
    name: 'Phiêu Lưu',
    description: 'Hành trình vượt ngàn dặm tinh cầu và khám phá những miền đất kỳ ảo.',
    color: '#F59E0B',
    sortOrder: 1,
    enabled: true,
    createdAt: Date.now()
  },
  {
    id: 'cat_fantasy',
    name: 'Huyền Bí',
    description: 'Bí ẩn phép thuật, cổ thư và những điều kỳ diệu chưa được giải mã.',
    color: '#8B5CF6',
    sortOrder: 2,
    enabled: true,
    createdAt: Date.now()
  },
  {
    id: 'cat_healing',
    name: 'Chữa Lành',
    description: 'Sự vỗ về dịu dàng, lắng nghe tâm tư và xoa dịu những âu lo mệt mỏi.',
    color: '#10B981',
    sortOrder: 3,
    enabled: true,
    createdAt: Date.now()
  },
  {
    id: 'cat_romance',
    name: 'Lãng Mạn',
    description: 'Những rung cảm ấm áp, ánh nhìn thẹn thùng và lời thì thầm dưới trăng.',
    color: '#EC4899',
    sortOrder: 4,
    enabled: true,
    createdAt: Date.now()
  },
  {
    id: 'cat_comedy',
    name: 'Hài Hước',
    description: 'Những khoảnh khắc dí dỏm, tiếng cười rộn rã và sự vui tươi vô tư lự.',
    color: '#F97316',
    sortOrder: 5,
    enabled: true,
    createdAt: Date.now()
  },
  {
    id: 'cat_night',
    name: 'Đêm Khuya',
    description: 'Không gian tĩnh lặng khi vạn vật say giấc, chỉ còn đôi ta ngắm sao.',
    color: '#6366F1',
    sortOrder: 6,
    enabled: true,
    createdAt: Date.now()
  },
  {
    id: 'cat_wisdom',
    name: 'Trí Tuệ',
    description: 'Những bài học chiêm nghiệm, triết lý nhân sinh và sự thấu suốt.',
    color: '#06B6D4',
    sortOrder: 7,
    enabled: true,
    createdAt: Date.now()
  },
  {
    id: 'cat_other',
    name: 'Khác',
    description: 'Những thể loại đặc biệt và phong cách độc đáo khác.',
    color: '#64748B',
    sortOrder: 8,
    enabled: true,
    createdAt: Date.now()
  }
];

export const INITIAL_FEEDBACK_ITEMS: FeedbackItem[] = [
  {
    id: 'fb_1',
    characterId: 'char_1',
    characterName: 'Nguyệt Hạ',
    nickname: 'Lữ Khách Phương Xa',
    content: 'Lời thoại của Nguyệt Hạ trong tình huống đêm mưa rất xúc động và truyền cảm! Mình rất thích tính cách dịu dàng của nhân vật.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
    stickerUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZmdHh4OHpjaWh1dWd1ZnZwZjZycHR2cDRsbDJrd2lrdW1ldmh5bCZlcD12MV9naWZzX3NlYXJjaCZjdD1z/26FLdmIp6wJr91JAI/giphy.gif',
    stickerName: 'Ánh Mắt Tinh Tú',
    status: 'resolved',
    adminNote: 'Cảm ơn lữ khách đã yêu mến Nguyệt Hạ! Tụi mình sẽ tiếp tục phát triển thêm nhiều tình huống mới ✦',
    isRead: true,
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000
  },
  {
    id: 'fb_2',
    characterId: 'char_2',
    characterName: 'Tử Yên',
    nickname: 'Mèo Mê Ngắm Sao',
    content: 'Nhân vật Tử Yên thi thoảng trả lời hơi ngắn khi hỏi về bí thuật cổ xưa, mong Ad bổ sung thêm kiến thức về chiêm tinh học cho bạn ấy nhé!',
    status: 'reviewing',
    adminNote: 'Đã ghi nhận, tụi mình đang bổ sung thêm tài liệu cổ thư chiêm tinh vào prompt của Tử Yên.',
    isRead: true,
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now()
  },
  {
    id: 'fb_3',
    characterId: 'char_3',
    characterName: 'Huyền Dạ',
    nickname: 'Bóng Đêm Thầm Lặng',
    content: 'Ảnh chân dung đại diện của Huyền Dạ siêu ngầu! Nếu có thêm hiệu ứng gif động nữa thì tuyệt đỉnh luôn ạ.',
    status: 'new',
    isRead: false,
    createdAt: Date.now() - 3600000 * 4,
    updatedAt: Date.now() - 3600000 * 4
  }
];

export const INITIAL_SECTION_BACKGROUNDS: SectionBackgroundsMap = {
  home: {
    route: 'home',
    title: 'Trang Chủ (Cover Landing)',
    description: 'Màn hình bìa đón chào lữ khách bước vào hiên nhà ngắm sao.',
    backgroundUrl: 'https://res.cloudinary.com/un7coybp/video/upload/v1786707907/2ae453aa1e73b01b40436ca0c9018bf6.mp4',
    backgroundType: 'video',
    overlayOpacity: 0.65,
    blur: 0,
    brightness: 0.85,
    contrast: 1.08,
    isFixed: true,
    showStarsEffect: true,
    enabled: true
  },
  characters: {
    route: 'characters',
    title: 'Hồ Sơ Nhân Vật',
    description: 'Danh sách những người bạn tri kỷ dưới mái hiên cùng bộ lọc danh mục.',
    backgroundUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80',
    backgroundType: 'image',
    overlayOpacity: 0.70,
    blur: 1,
    brightness: 0.75,
    contrast: 1.05,
    isFixed: true,
    showStarsEffect: true,
    enabled: true
  },
  feedback: {
    route: 'feedback',
    title: 'Góp Ý & Báo Lỗi',
    description: 'Bảng tiếp nhận phản hồi, ý kiến đóng góp và báo lỗi về các nhân vật.',
    backgroundUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1920&q=80',
    backgroundType: 'image',
    overlayOpacity: 0.75,
    blur: 0,
    brightness: 0.75,
    contrast: 1.05,
    isFixed: true,
    showStarsEffect: true,
    enabled: true
  },
  leaderboard: {
    route: 'leaderboard',
    title: 'Bảng Xếp Hạng Tri Kỷ',
    description: 'Bảng vinh danh nhân vật được yêu thích và nhận nhiều tim nhất.',
    backgroundUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    backgroundType: 'image',
    overlayOpacity: 0.72,
    blur: 0,
    brightness: 0.80,
    contrast: 1.10,
    isFixed: true,
    showStarsEffect: true,
    enabled: true
  },
  vote: {
    route: 'vote',
    title: 'Bình Chọn Tri Kỷ',
    description: 'Khu vực bỏ phiếu bình chọn ngôi sao được yêu thích nhất.',
    backgroundUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80',
    backgroundType: 'image',
    overlayOpacity: 0.70,
    blur: 0,
    brightness: 0.80,
    contrast: 1.05,
    isFixed: true,
    showStarsEffect: true,
    enabled: true
  },
  'send-love': {
    route: 'send-love',
    title: 'Hộp Thư Yêu Thương',
    description: 'Nơi gửi gắm những cánh thư và tâm sự gửi đến các nhân vật.',
    backgroundUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1920&q=80',
    backgroundType: 'image',
    overlayOpacity: 0.75,
    blur: 0,
    brightness: 0.78,
    contrast: 1.05,
    isFixed: true,
    showStarsEffect: true,
    enabled: true
  },
  playlist: {
    route: 'playlist',
    title: 'Playlist Âm Nhạc',
    description: 'Không gian giai điệu êm đềm cùng danh sách bài hát.',
    backgroundUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1920&q=80',
    backgroundType: 'image',
    overlayOpacity: 0.75,
    blur: 1,
    brightness: 0.70,
    contrast: 1.05,
    isFixed: true,
    showStarsEffect: true,
    enabled: true
  },
  gallery: {
    route: 'gallery',
    title: 'Thư Viện Album Ảnh',
    description: 'Kho hình ảnh, poster và khoảnh khắc lung linh dưới mái hiên.',
    backgroundUrl: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&w=1920&q=80',
    backgroundType: 'image',
    overlayOpacity: 0.75,
    blur: 0,
    brightness: 0.75,
    contrast: 1.05,
    isFixed: true,
    showStarsEffect: true,
    enabled: true
  },
  'other-spaces': {
    route: 'other-spaces',
    title: 'Không Gian Khác & Tarot',
    description: '78 lá bài Tarot, chiêm tinh và những câu nói ánh sao.',
    backgroundUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1920&q=80',
    backgroundType: 'image',
    overlayOpacity: 0.75,
    blur: 0,
    brightness: 0.75,
    contrast: 1.05,
    isFixed: true,
    showStarsEffect: true,
    enabled: true
  },
  minigame: {
    route: 'minigame',
    title: 'Minigame',
    description: 'Nông trại sao, câu cá đêm, trộm kho báu, nấu ăn và Moon Shop.',
    backgroundUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1920&q=80',
    backgroundType: 'image',
    overlayOpacity: 0.70,
    blur: 0,
    brightness: 0.80,
    contrast: 1.05,
    isFixed: true,
    showStarsEffect: true,
    enabled: true
  },
  admin: {
    route: 'admin',
    title: 'Bảng Quản Trị CMS',
    description: 'Trung tâm điều khiển và quản trị toàn diện của chủ nhân mái hiên.',
    backgroundUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80',
    backgroundType: 'image',
    overlayOpacity: 0.80,
    blur: 2,
    brightness: 0.65,
    contrast: 1.05,
    isFixed: true,
    showStarsEffect: true,
    enabled: true
  }
};

export const INITIAL_REWARD_CODES: RewardCode[] = [
  {
    id: 'HIENNHA2026',
    code: 'HIENNHA2026',
    name: 'Quà Mừng Lữ Khách Ghé Hiên Nhà',
    description: 'Tặng 500 Nguyệt Xu, 100 Bụi Sao, 50 Năng Lượng và 200 Điểm EXP.',
    rewardType: 'direct',
    rewardPackage: {
      rewards: [
        { type: 'coin', amount: 500 },
        { type: 'stardust', amount: 100 },
        { type: 'energy', amount: 50 },
        { type: 'exp', amount: 200 }
      ]
    },
    maxUses: 1000,
    currentUses: 42,
    expiresAt: null,
    isActive: true,
    isOneUsePerAccount: true,
    createdAt: Date.now() - 86400000 * 5
  },
  {
    id: 'STARBOX2026',
    code: 'STARBOX2026',
    name: 'Hộp Quà May Mắn Ánh Sao (Random Box)',
    description: 'Mở hộp quà ngẫu nhiên nhận thưởng xu, bụi sao quý hoặc năng lượng.',
    rewardType: 'random_box',
    rewardPool: [
      { id: 'pool_1', name: 'Kho Báu 1,000 Nguyệt Xu', reward: { type: 'coin', amount: 1000 }, weight: 40 },
      { id: 'pool_2', name: '200 Bụi Sao Lấp Lánh', reward: { type: 'stardust', amount: 200 }, weight: 30 },
      { id: 'pool_3', name: '100 Năng Lượng Tinh Tú', reward: { type: 'energy', amount: 100 }, weight: 20 },
      { id: 'pool_4', name: '500 EXP Tiến Hoá', reward: { type: 'exp', amount: 500 }, weight: 10 }
    ],
    maxUses: 500,
    currentUses: 18,
    expiresAt: null,
    isActive: true,
    isOneUsePerAccount: true,
    createdAt: Date.now() - 86400000 * 3
  },
  {
    id: 'WELCOMESTAR',
    code: 'WELCOMESTAR',
    name: 'Tân Thủ Lữ Khách Khởi Đầu',
    description: '300 Nguyệt Xu và 50 Bụi Sao cho người bạn mới.',
    rewardType: 'direct',
    rewardPackage: {
      rewards: [
        { type: 'coin', amount: 300 },
        { type: 'stardust', amount: 50 },
        { type: 'energy', amount: 30 }
      ]
    },
    maxUses: null,
    currentUses: 120,
    expiresAt: null,
    isActive: true,
    isOneUsePerAccount: true,
    createdAt: Date.now() - 86400000 * 10
  }
];

