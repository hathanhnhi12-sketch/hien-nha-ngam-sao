import { 
  Character, 
  CharacterComment, 
  GalleryFolder, 
  GalleryItem, 
  PlaylistItem, 
  TarotCard, 
  CelestialQuote, 
  MinigameItem, 
  MinigameRecipe, 
  Quest, 
  LoveLetter, 
  VoteSetting, 
  UserProfile,
  GiftHistoryItem,
  ChatScenario,
  SiteConfig,
  MediaResource,
  LoadingAnimationAsset,
  LoadingConfig,
  SocialPlatformConfig,
  SiteSocialConfig,
  UserAvatarPreset,
  StickerCategory,
  StickerItem,
  CharacterCategory,
  FeedbackItem,
  FeedbackStatus,
  SectionBackgroundSetting,
  SectionBackgroundsMap,
  RewardCode,
  RewardRedemption,
  RewardPackage,
  MailboxMessage
} from '../types';
import { 
  INITIAL_CHARACTERS, 
  INITIAL_GALLERY_FOLDERS, 
  INITIAL_GALLERY_ITEMS, 
  INITIAL_PLAYLIST, 
  INITIAL_TAROT_DECK, 
  INITIAL_QUOTES, 
  INITIAL_MINIGAME_ITEMS, 
  INITIAL_RECIPES, 
  INITIAL_QUESTS, 
  INITIAL_LOVE_LETTERS,
  INITIAL_SCENARIOS,
  INITIAL_SITE_CONFIG,
  INITIAL_MEDIA_RESOURCES,
  INITIAL_LOADING_ANIMATIONS,
  INITIAL_AVATAR_PRESETS,
  INITIAL_STICKER_CATEGORIES,
  INITIAL_STICKERS,
  INITIAL_CHARACTER_CATEGORIES,
  INITIAL_FEEDBACK_ITEMS,
  INITIAL_SECTION_BACKGROUNDS,
  INITIAL_REWARD_CODES
} from '../data/initialData';

const STORAGE_KEYS = {
  SITE_CONFIG: 'hien_nha_site_config',
  MEDIA_RESOURCES: 'hien_nha_media_resources',
  CHARACTERS: 'hien_nha_characters',
  COMMENTS_PREFIX: 'hien_nha_comments_',
  GALLERY_FOLDERS: 'hien_nha_gallery_folders',
  GALLERY_ITEMS: 'hien_nha_gallery_items',
  PLAYLIST: 'hien_nha_playlist',
  TAROT_DECK: 'hien_nha_tarot_deck',
  QUOTES: 'hien_nha_quotes',
  LOVE_LETTERS: 'hien_nha_love_letters',
  VOTE_SETTINGS: 'hien_nha_vote_settings',
  MINIGAME_ITEMS: 'hien_nha_minigame_items',
  MINIGAME_RECIPES: 'hien_nha_minigame_recipes',
  QUESTS: 'hien_nha_quests',
  USER_PROFILE: 'hien_nha_user_profile',
  ALL_USERS: 'hien_nha_all_users',
  GIFT_HISTORY: 'hien_nha_gift_history',
  FAVORITES: 'hien_nha_favorites',
  LOVED_IDS: 'hien_nha_loved_char_ids',
  VOTED_IDS: 'hien_nha_voted_char_ids',
  SCENARIOS: 'hien_nha_scenarios',
  LOADING_ANIMATIONS: 'hien_nha_loading_animations',
  USER_AVATAR_PRESETS: 'hien_nha_avatar_presets',
  STICKER_CATEGORIES: 'hien_nha_sticker_categories',
  STICKERS: 'hien_nha_stickers',
  CHARACTER_CATEGORIES: 'hien_nha_character_categories',
  FEEDBACK: 'hien_nha_feedback_items',
  SECTION_BACKGROUNDS: 'hien_nha_section_backgrounds',
  REWARD_CODES: 'hien_nha_reward_codes',
  REWARD_REDEMPTIONS: 'hien_nha_reward_redemptions',
  MAILBOX_PREFIX: 'hien_nha_mailbox_'
};

// Safe JSON parser
function safeGet<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch {
    return defaultValue;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

// Initial default user
export const DEFAULT_USER_PROFILE: UserProfile = {
  uid: 'guest_stargazer',
  displayName: 'Lữ Khách Đêm',
  nickname: 'Lữ Khách Đêm',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  bio: 'Một tâm hồn yêu thích ngồi dưới mái hiên ngắm nhìn các vì tinh tú.',
  role: 'user',
  stats: {
    level: 1,
    exp: 0,
    coins: 150,
    stardust: 30,
    energy: 100,
    maxEnergy: 100,
    streak: 1,
    lastCheckInDate: '',
    freeLuckyBoxCount: 3,
    lastLuckyBoxReset: new Date().toISOString().split('T')[0],
    totalHarvested: 0,
    totalFished: 0,
    totalDug: 0,
    totalCooked: 0,
    totalGiftsSent: 0
  },
  inventory: [
    { itemId: 'seed_moon_flower', quantity: 3 },
    { itemId: 'rod_bamboo', quantity: 1 },
    { itemId: 'bait_firefly', quantity: 5 },
    { itemId: 'tool_star_shovel', quantity: 1 },
    { itemId: 'gift_tea_set', quantity: 1 }
  ],
  garden: [
    { id: 0, status: 'empty', isWatered: false, isFertilized: false },
    { id: 1, status: 'empty', isWatered: false, isFertilized: false },
    { id: 2, status: 'empty', isWatered: false, isFertilized: false },
    { id: 3, status: 'empty', isWatered: false, isFertilized: false }
  ],
  favoriteCharacterIds: [],
  favoriteQuoteIds: [],
  lastLogin: Date.now(),
  createdAt: Date.now()
};

export const DEFAULT_VOTE_SETTING: VoteSetting = {
  id: 'main_vote_season',
  isOpen: false, // Default to FALSE ("Chưa phát hành" until Owner enables in CMS)
  title: 'Bình Chọn Nhân Vật Yêu Thích - Mùa Sao Băng',
  description: 'Hãy bình chọn cho người bạn đồng hành bạn trân quý nhất dưới mái hiên!',
  totalVotes: 0,
  startDate: '2026-09-01',
  endDate: '2026-10-01',
  rules: 'Mỗi lữ khách có 1 phiếu bình chọn mỗi ngày. Điểm số bình chọn được lưu trữ độc lập.',
  updatedAt: Date.now()
};

export class StorageService {
  // Characters
  static getCharacters(): Character[] {
    const chars = safeGet<Character[]>(STORAGE_KEYS.CHARACTERS, []);
    if (!chars || chars.length === 0) {
      safeSet(STORAGE_KEYS.CHARACTERS, INITIAL_CHARACTERS);
      return INITIAL_CHARACTERS;
    }
    return chars;
  }

  static saveCharacters(characters: Character[]): void {
    safeSet(STORAGE_KEYS.CHARACTERS, characters);
  }

  static getCharacterById(id: string): Character | undefined {
    return this.getCharacters().find(c => c.id === id);
  }

  static saveCharacter(character: Character): void {
    const chars = this.getCharacters();
    const index = chars.findIndex(c => c.id === character.id);
    if (index >= 0) {
      chars[index] = { ...character, updatedAt: Date.now() };
    } else {
      chars.unshift({ ...character, createdAt: Date.now(), updatedAt: Date.now() });
    }
    this.saveCharacters(chars);
  }

  static deleteCharacter(id: string): void {
    const chars = this.getCharacters().filter(c => c.id !== id);
    this.saveCharacters(chars);
  }

  static incrementCharacterViews(id: string): void {
    const chars = this.getCharacters();
    const char = chars.find(c => c.id === id);
    if (char) {
      char.views = (char.views || 0) + 1;
      this.saveCharacters(chars);
    }
  }

  static loveCharacter(id: string): boolean {
    const lovedIds = safeGet<string[]>(STORAGE_KEYS.LOVED_IDS, []);
    if (lovedIds.includes(id)) {
      return false; // Already loved in this session/browser
    }
    lovedIds.push(id);
    safeSet(STORAGE_KEYS.LOVED_IDS, lovedIds);

    const chars = this.getCharacters();
    const char = chars.find(c => c.id === id);
    if (char) {
      char.loveCount = (char.loveCount || 0) + 1;
      this.saveCharacters(chars);
      return true;
    }
    return false;
  }

  static isCharacterLoved(id: string): boolean {
    const lovedIds = safeGet<string[]>(STORAGE_KEYS.LOVED_IDS, []);
    return lovedIds.includes(id);
  }

  static voteCharacter(id: string): boolean {
    const settings = this.getVoteSetting();
    if (!settings.isOpen) return false;

    const votedIds = safeGet<string[]>(STORAGE_KEYS.VOTED_IDS, []);
    votedIds.push(id);
    safeSet(STORAGE_KEYS.VOTED_IDS, votedIds);

    const chars = this.getCharacters();
    const char = chars.find(c => c.id === id);
    if (char) {
      char.voteCount = (char.voteCount || 0) + 1;
      this.saveCharacters(chars);

      settings.totalVotes = (settings.totalVotes || 0) + 1;
      this.saveVoteSetting(settings);
      return true;
    }
    return false;
  }

  // Comments
  static getComments(characterId: string): CharacterComment[] {
    const key = STORAGE_KEYS.COMMENTS_PREFIX + characterId;
    const comments = safeGet<CharacterComment[]>(key, []);
    if (comments.length === 0) {
      // Seed an initial heartwarming comment
      const initialComment: CharacterComment = {
        id: 'comment_init_' + characterId,
        characterId,
        nickname: 'Lữ khách phương xa',
        content: 'Chào cậu, góc hiên hôm nay thật êm ả. Chúc cậu một buổi tối thật an lành!',
        createdAt: Date.now() - 3600000 * 5,
        isHidden: false,
        isPinned: true,
        avatarSeed: 1
      };
      safeSet(key, [initialComment]);
      return [initialComment];
    }
    return comments;
  }

  static addComment(
    characterId: string, 
    nickname: string, 
    content: string,
    imageUrl?: string,
    stickerUrl?: string,
    stickerName?: string,
    avatarUrl?: string
  ): CharacterComment {
    const key = STORAGE_KEYS.COMMENTS_PREFIX + characterId;
    const comments = this.getComments(characterId);
    
    // Sanitize string
    const cleanNick = nickname.trim().slice(0, 30);
    const cleanContent = content.trim().slice(0, 500);

    const newComment: CharacterComment = {
      id: 'comment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      characterId,
      nickname: cleanNick || 'Ẩn danh',
      content: cleanContent,
      imageUrl: imageUrl ? imageUrl.trim() : undefined,
      stickerUrl: stickerUrl ? stickerUrl.trim() : undefined,
      stickerName: stickerName ? stickerName.trim() : undefined,
      avatarUrl: avatarUrl ? avatarUrl.trim() : undefined,
      createdAt: Date.now(),
      isHidden: false,
      isPinned: false,
      avatarSeed: Math.floor(Math.random() * 8) + 1
    };

    comments.unshift(newComment);
    safeSet(key, comments);
    return newComment;
  }

  static updateComment(characterId: string, commentId: string, updates: Partial<CharacterComment>): void {
    const key = STORAGE_KEYS.COMMENTS_PREFIX + characterId;
    const comments = this.getComments(characterId);
    const index = comments.findIndex(c => c.id === commentId);
    if (index >= 0) {
      comments[index] = { ...comments[index], ...updates };
      safeSet(key, comments);
    }
  }

  static deleteComment(characterId: string, commentId: string): void {
    const key = STORAGE_KEYS.COMMENTS_PREFIX + characterId;
    const comments = this.getComments(characterId).filter(c => c.id !== commentId);
    safeSet(key, comments);
  }

  // Gallery
  static getGalleryFolders(): GalleryFolder[] {
    const folders = safeGet<GalleryFolder[]>(STORAGE_KEYS.GALLERY_FOLDERS, []);
    if (folders.length === 0) {
      safeSet(STORAGE_KEYS.GALLERY_FOLDERS, INITIAL_GALLERY_FOLDERS);
      return INITIAL_GALLERY_FOLDERS;
    }
    return folders;
  }

  static saveGalleryFolders(folders: GalleryFolder[]): void {
    safeSet(STORAGE_KEYS.GALLERY_FOLDERS, folders);
  }

  static getGalleryItems(): GalleryItem[] {
    const items = safeGet<GalleryItem[]>(STORAGE_KEYS.GALLERY_ITEMS, []);
    if (items.length === 0) {
      safeSet(STORAGE_KEYS.GALLERY_ITEMS, INITIAL_GALLERY_ITEMS);
      return INITIAL_GALLERY_ITEMS;
    }
    return items;
  }

  static saveGalleryItems(items: GalleryItem[]): void {
    safeSet(STORAGE_KEYS.GALLERY_ITEMS, items);
  }

  // Playlist
  static getPlaylist(): PlaylistItem[] {
    const list = safeGet<PlaylistItem[]>(STORAGE_KEYS.PLAYLIST, []);
    if (list.length === 0) {
      safeSet(STORAGE_KEYS.PLAYLIST, INITIAL_PLAYLIST);
      return INITIAL_PLAYLIST;
    }
    return list;
  }

  static savePlaylist(tracks: PlaylistItem[]): void {
    safeSet(STORAGE_KEYS.PLAYLIST, tracks);
  }

  // Quotes
  static getQuotes(): CelestialQuote[] {
    const quotes = safeGet<CelestialQuote[]>(STORAGE_KEYS.QUOTES, []);
    if (quotes.length === 0) {
      safeSet(STORAGE_KEYS.QUOTES, INITIAL_QUOTES);
      return INITIAL_QUOTES;
    }
    return quotes;
  }

  static saveQuotes(quotes: CelestialQuote[]): void {
    safeSet(STORAGE_KEYS.QUOTES, quotes);
  }

  // Love Letters
  static getLoveLetters(): LoveLetter[] {
    const letters = safeGet<LoveLetter[]>(STORAGE_KEYS.LOVE_LETTERS, []);
    if (letters.length === 0) {
      safeSet(STORAGE_KEYS.LOVE_LETTERS, INITIAL_LOVE_LETTERS);
      return INITIAL_LOVE_LETTERS;
    }
    return letters;
  }

  static saveLoveLetters(letters: LoveLetter[]): void {
    safeSet(STORAGE_KEYS.LOVE_LETTERS, letters);
  }

  static sendLoveLetter(senderName: string, content: string, mood?: string, color?: string): LoveLetter {
    const letters = this.getLoveLetters();
    const newLetter: LoveLetter = {
      id: 'letter_' + Date.now(),
      senderName: senderName.trim().slice(0, 40) || 'Lữ khách ẩn danh',
      content: content.trim().slice(0, 1000),
      mood: mood || 'Ấm áp',
      color: color || '#EEF2FF',
      createdAt: Date.now(),
      isArchived: false,
      isPublic: true
    };
    letters.unshift(newLetter);
    this.saveLoveLetters(letters);
    return newLetter;
  }

  // Vote Settings
  static getVoteSetting(): VoteSetting {
    return safeGet<VoteSetting>(STORAGE_KEYS.VOTE_SETTINGS, DEFAULT_VOTE_SETTING);
  }

  static saveVoteSetting(settings: VoteSetting): void {
    safeSet(STORAGE_KEYS.VOTE_SETTINGS, settings);
  }

  static resetVotes(characterId?: string): void {
    const chars = this.getCharacters();
    if (characterId) {
      const c = chars.find(item => item.id === characterId);
      if (c) c.voteCount = 0;
    } else {
      chars.forEach(c => { c.voteCount = 0; c.loveCount = 0; });
      const setting = this.getVoteSetting();
      setting.totalVotes = 0;
      this.saveVoteSetting(setting);
    }
    this.saveCharacters(chars);
  }

  static resetCharacterHearts(characterId: string): void {
    const chars = this.getCharacters();
    const char = chars.find(c => c.id === characterId);
    if (char) {
      char.loveCount = 0;
      this.saveCharacters(chars);
    }
  }

  static resetSelectedCharacterHearts(characterIds: string[]): void {
    const chars = this.getCharacters();
    const idSet = new Set(characterIds);
    chars.forEach(c => {
      if (idSet.has(c.id)) {
        c.loveCount = 0;
      }
    });
    this.saveCharacters(chars);
  }

  static resetAllCharacterHearts(): void {
    const chars = this.getCharacters();
    chars.forEach(c => {
      c.loveCount = 0;
    });
    this.saveCharacters(chars);
    safeSet(STORAGE_KEYS.LOVED_IDS, []);
  }

  static recalculateRanking(): Character[] {
    const chars = this.getCharacters();
    // Deterministic sort: Primary = loveCount descending, Secondary = ID ascending
    chars.sort((a, b) => {
      const diff = (b.loveCount || 0) - (a.loveCount || 0);
      if (diff !== 0) return diff;
      return a.id.localeCompare(b.id);
    });
    this.saveCharacters(chars);
    return chars;
  }

  static resetRankingData(type: 'love' | 'vote' | 'chat' | 'views' = 'vote'): void {
    const chars = this.getCharacters();
    chars.forEach(c => {
      if (type === 'love') c.loveCount = 0;
      else if (type === 'vote') c.voteCount = 0;
      else if (type === 'chat') c.chats = 0;
      else if (type === 'views') c.views = 0;
    });
    this.saveCharacters(chars);
    if (type === 'vote') {
      const setting = this.getVoteSetting();
      setting.totalVotes = 0;
      this.saveVoteSetting(setting);
      safeSet(STORAGE_KEYS.VOTED_IDS, []);
    }
  }

  static resetComments(): void {
    const chars = this.getCharacters();
    chars.forEach(char => {
      localStorage.removeItem(STORAGE_KEYS.COMMENTS_PREFIX + char.id);
    });
  }

  static resetUserData(): void {
    safeSet(STORAGE_KEYS.USER_PROFILE, DEFAULT_USER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.GIFT_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.FAVORITES);
    localStorage.removeItem(STORAGE_KEYS.LOVED_IDS);
    localStorage.removeItem(STORAGE_KEYS.VOTED_IDS);
  }

  // Minigame Data
  static getMinigameItems(): MinigameItem[] {
    const items = safeGet<MinigameItem[]>(STORAGE_KEYS.MINIGAME_ITEMS, []);
    if (items.length === 0) {
      safeSet(STORAGE_KEYS.MINIGAME_ITEMS, INITIAL_MINIGAME_ITEMS);
      return INITIAL_MINIGAME_ITEMS;
    }
    return items;
  }

  static saveMinigameItems(items: MinigameItem[]): void {
    safeSet(STORAGE_KEYS.MINIGAME_ITEMS, items);
  }

  static getMinigameRecipes(): MinigameRecipe[] {
    const recipes = safeGet<MinigameRecipe[]>(STORAGE_KEYS.MINIGAME_RECIPES, []);
    if (recipes.length === 0) {
      safeSet(STORAGE_KEYS.MINIGAME_RECIPES, INITIAL_RECIPES);
      return INITIAL_RECIPES;
    }
    return recipes;
  }

  static saveMinigameRecipes(recipes: MinigameRecipe[]): void {
    safeSet(STORAGE_KEYS.MINIGAME_RECIPES, recipes);
  }

  static getQuests(): Quest[] {
    const quests = safeGet<Quest[]>(STORAGE_KEYS.QUESTS, []);
    if (quests.length === 0) {
      safeSet(STORAGE_KEYS.QUESTS, INITIAL_QUESTS);
      return INITIAL_QUESTS;
    }
    return quests;
  }

  static saveQuests(quests: Quest[]): void {
    safeSet(STORAGE_KEYS.QUESTS, quests);
  }

  // User Profile
  static getUserProfile(): UserProfile {
    return safeGet<UserProfile>(STORAGE_KEYS.USER_PROFILE, DEFAULT_USER_PROFILE);
  }

  static saveUserProfile(profile: UserProfile): void {
    safeSet(STORAGE_KEYS.USER_PROFILE, profile);
    if (profile.email) {
      import('./accountService').then(m => m.AccountService.updatePublicFields(profile.uid, profile)).catch(console.error);
    }
  }

  // Gift History
  static getGiftHistory(): GiftHistoryItem[] {
    return safeGet<GiftHistoryItem[]>(STORAGE_KEYS.GIFT_HISTORY, []);
  }

  static addGiftHistory(item: GiftHistoryItem): void {
    const history = this.getGiftHistory();
    history.unshift(item);
    safeSet(STORAGE_KEYS.GIFT_HISTORY, history.slice(0, 50));
  }

  // Additional helper methods and aliases
  static getGallery(): GalleryItem[] {
    return this.getGalleryItems();
  }

  static getTarotCards(): TarotCard[] {
    return this.getTarotDeck();
  }

  static getLovedCharacterIds(): string[] {
    return safeGet<string[]>(STORAGE_KEYS.LOVED_IDS, []);
  }

  static getVotedCharacterIds(): string[] {
    return safeGet<string[]>(STORAGE_KEYS.VOTED_IDS, []);
  }

  static incrementViews(id: string): void {
    this.incrementCharacterViews(id);
  }

  static incrementChats(id: string): void {
    const chars = this.getCharacters();
    const char = chars.find(c => c.id === id);
    if (char) {
      char.chats = (char.chats || 0) + 1;
      this.saveCharacters(chars);
    }
  }

  static likeGalleryItem(id: string): void {
    const items = this.getGalleryItems();
    const item = items.find(i => i.id === id);
    if (item) {
      item.likes = (item.likes || 0) + 1;
      this.saveGalleryItems(items);
    }
  }

  static likeQuote(id: string): void {
    const quotes = this.getQuotes();
    const quote = quotes.find(q => q.id === id);
    if (quote) {
      quote.likes = (quote.likes || 0) + 1;
      this.saveQuotes(quotes);
    }
  }

  static likeLoveLetter(id: string): void {
    const letters = this.getLoveLetters();
    const letter = letters.find(l => l.id === id);
    if (letter) {
      letter.likes = (letter.likes || 0) + 1;
      this.saveLoveLetters(letters);
    }
  }

  static addLoveLetter(letter: LoveLetter): void {
    const letters = this.getLoveLetters();
    letters.unshift(letter);
    this.saveLoveLetters(letters);
  }

  static saveGalleryItem(item: GalleryItem): void {
    const items = this.getGalleryItems();
    const index = items.findIndex(i => i.id === item.id);
    if (index >= 0) {
      items[index] = item;
    } else {
      items.unshift(item);
    }
    this.saveGalleryItems(items);
  }

  static deleteGalleryItem(id: string): void {
    const items = this.getGalleryItems().filter(i => i.id !== id);
    this.saveGalleryItems(items);
  }

  // ================= SITE CONFIG CMS =================
  static getSiteConfig(): SiteConfig {
    const config = safeGet<SiteConfig | null>(STORAGE_KEYS.SITE_CONFIG, null);
    if (!config) {
      safeSet(STORAGE_KEYS.SITE_CONFIG, INITIAL_SITE_CONFIG);
      return INITIAL_SITE_CONFIG;
    }
    return {
      ...INITIAL_SITE_CONFIG,
      ...config,
      socialLinks: {
        ...INITIAL_SITE_CONFIG.socialLinks,
        ...(config.socialLinks || {})
      },
      loadingConfig: {
        ...INITIAL_SITE_CONFIG.loadingConfig,
        ...(config.loadingConfig || {})
      },
      expConfig: {
        ...INITIAL_SITE_CONFIG.expConfig,
        ...(config.expConfig || {})
      }
    } as SiteConfig;
  }

  static saveSiteConfig(config: SiteConfig): void {
    safeSet(STORAGE_KEYS.SITE_CONFIG, config);
  }

  // ================= LOADING SCREEN & EFFECTS CMS =================
  static getLoadingAnimations(): LoadingAnimationAsset[] {
    const list = safeGet<LoadingAnimationAsset[]>(STORAGE_KEYS.LOADING_ANIMATIONS, []);
    if (list.length === 0) {
      safeSet(STORAGE_KEYS.LOADING_ANIMATIONS, INITIAL_LOADING_ANIMATIONS);
      return INITIAL_LOADING_ANIMATIONS;
    }
    return list;
  }

  static saveLoadingAnimations(animations: LoadingAnimationAsset[]): void {
    safeSet(STORAGE_KEYS.LOADING_ANIMATIONS, animations);
  }

  static addLoadingAnimation(anim: Omit<LoadingAnimationAsset, 'id' | 'createdAt'>): LoadingAnimationAsset {
    const list = this.getLoadingAnimations();
    const newAnim: LoadingAnimationAsset = {
      ...anim,
      id: `load_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now()
    };
    list.unshift(newAnim);
    this.saveLoadingAnimations(list);

    // Also register in Media Resources for centralized tracking
    this.addMediaResource({
      name: newAnim.name,
      title: newAnim.name,
      url: newAnim.assetUrl,
      type: newAnim.type === 'video' ? 'video' : 'gif',
      category: 'loading',
      description: newAnim.description || 'Hiệu ứng hoạt cảnh màn hình tải',
      usedIn: ['Màn Hình Tải Trang']
    });

    return newAnim;
  }

  static deleteLoadingAnimation(id: string): void {
    const list = this.getLoadingAnimations().filter(a => a.id !== id);
    this.saveLoadingAnimations(list);

    // If active animation was deleted, fallback to first available
    const siteConfig = this.getSiteConfig();
    if (siteConfig.loadingConfig?.activeAnimationId === id && list.length > 0) {
      this.setActiveLoadingAnimation(list[0].id);
    }
  }

  static setActiveLoadingAnimation(id: string): void {
    const animations = this.getLoadingAnimations();
    const target = animations.find(a => a.id === id);
    if (!target) return;

    const siteConfig = this.getSiteConfig();
    siteConfig.loadingConfig = {
      ...siteConfig.loadingConfig,
      activeAnimationId: target.id,
      activeAnimationUrl: target.assetUrl
    };
    this.saveSiteConfig(siteConfig);
  }

  static getLoadingConfig(): LoadingConfig {
    const siteConfig = this.getSiteConfig();
    return siteConfig.loadingConfig || {
      enabled: true,
      activeAnimationId: 'load_stars',
      activeAnimationUrl: 'https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif',
      loadingText: 'Đang chuẩn bị không gian ngắm sao...',
      subText: 'Dưới Mái Hiên Sao ✦ Nơi lắng nghe tâm hồn',
      overlayOpacity: 0.85,
      showStarsEffect: true,
      minDisplayTimeMs: 1200,
      showProgressBar: true
    };
  }

  static updateLoadingConfig(updates: Partial<LoadingConfig>): void {
    const siteConfig = this.getSiteConfig();
    const current = this.getLoadingConfig();
    siteConfig.loadingConfig = {
      ...current,
      ...updates
    };
    this.saveSiteConfig(siteConfig);
  }

  // ================= SOCIAL LINKS APPEARANCE CMS =================
  static getSocialLinks(): SiteSocialConfig {
    const siteConfig = this.getSiteConfig();
    return siteConfig.socialLinks || INITIAL_SITE_CONFIG.socialLinks!;
  }

  static saveSocialLinks(socialLinks: SiteSocialConfig): void {
    const siteConfig = this.getSiteConfig();
    siteConfig.socialLinks = socialLinks;
    // Keep top-level URLs synced for backward compatibility
    if (socialLinks.discord) {
      siteConfig.discordCollabUrl = socialLinks.discord.collabUrl || siteConfig.discordCollabUrl;
      siteConfig.discordPrivateUrl = socialLinks.discord.privateUrl || siteConfig.discordPrivateUrl;
    }
    if (socialLinks.facebook) {
      siteConfig.facebookPageUrl = socialLinks.facebook.pageUrl || siteConfig.facebookPageUrl;
      siteConfig.facebookPersonalUrl = socialLinks.facebook.personalUrl || siteConfig.facebookPersonalUrl;
    }
    this.saveSiteConfig(siteConfig);
  }

  static updateSocialPlatform(platform: 'discord' | 'facebook', updates: Partial<SocialPlatformConfig>): void {
    const current = this.getSocialLinks();
    const updated = {
      ...current,
      [platform]: {
        ...current[platform],
        ...updates
      }
    };
    this.saveSocialLinks(updated);
  }

  // ================= USER AVATAR LIBRARY CMS =================
  static getUserAvatarPresets(): UserAvatarPreset[] {
    const list = safeGet<UserAvatarPreset[]>(STORAGE_KEYS.USER_AVATAR_PRESETS, []);
    if (list.length === 0) {
      safeSet(STORAGE_KEYS.USER_AVATAR_PRESETS, INITIAL_AVATAR_PRESETS);
      return INITIAL_AVATAR_PRESETS;
    }
    return list;
  }

  static saveUserAvatarPresets(presets: UserAvatarPreset[]): void {
    safeSet(STORAGE_KEYS.USER_AVATAR_PRESETS, presets);
  }

  static addUserAvatarPreset(preset: Omit<UserAvatarPreset, 'id' | 'createdAt'>): UserAvatarPreset {
    const list = this.getUserAvatarPresets();
    const newPreset: UserAvatarPreset = {
      ...preset,
      id: `avatar_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now()
    };
    list.push(newPreset);
    this.saveUserAvatarPresets(list);

    // Register in Media Resource library
    this.addMediaResource({
      name: newPreset.name,
      title: newPreset.name,
      url: newPreset.url,
      type: newPreset.type === 'gif' ? 'gif' : 'image',
      category: 'avatar',
      description: 'Avatar Preset cho Lữ Khách',
      usedIn: ['Thư Viện Avatar Lữ Khách']
    });

    return newPreset;
  }

  static updateUserAvatarPreset(id: string, updates: Partial<UserAvatarPreset>): void {
    const list = this.getUserAvatarPresets();
    const index = list.findIndex(p => p.id === id);
    if (index >= 0) {
      list[index] = { ...list[index], ...updates };
      this.saveUserAvatarPresets(list);
    }
  }

  static deleteUserAvatarPreset(id: string): void {
    const list = this.getUserAvatarPresets().filter(p => p.id !== id);
    this.saveUserAvatarPresets(list);
  }

  // ================= STICKERS & GIFS CMS =================
  static getStickerCategories(): StickerCategory[] {
    const list = safeGet<StickerCategory[]>(STORAGE_KEYS.STICKER_CATEGORIES, []);
    if (list.length === 0) {
      safeSet(STORAGE_KEYS.STICKER_CATEGORIES, INITIAL_STICKER_CATEGORIES);
      return INITIAL_STICKER_CATEGORIES;
    }
    return list;
  }

  static saveStickerCategories(categories: StickerCategory[]): void {
    safeSet(STORAGE_KEYS.STICKER_CATEGORIES, categories);
  }

  static addStickerCategory(cat: Omit<StickerCategory, 'id'>): StickerCategory {
    const list = this.getStickerCategories();
    const newCat: StickerCategory = {
      ...cat,
      id: `cat_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`
    };
    list.push(newCat);
    this.saveStickerCategories(list);
    return newCat;
  }

  static updateStickerCategory(id: string, updates: Partial<StickerCategory>): void {
    const list = this.getStickerCategories();
    const index = list.findIndex(c => c.id === id);
    if (index >= 0) {
      list[index] = { ...list[index], ...updates };
      this.saveStickerCategories(list);
    }
  }

  static deleteStickerCategory(id: string): void {
    const list = this.getStickerCategories().filter(c => c.id !== id);
    this.saveStickerCategories(list);

    // Delete or reassign stickers in that category
    const stickers = this.getStickers().filter(s => s.categoryId !== id);
    this.saveStickers(stickers);
  }

  static getStickers(): StickerItem[] {
    const list = safeGet<StickerItem[]>(STORAGE_KEYS.STICKERS, []);
    if (list.length === 0) {
      safeSet(STORAGE_KEYS.STICKERS, INITIAL_STICKERS);
      return INITIAL_STICKERS;
    }
    return list;
  }

  static saveStickers(stickers: StickerItem[]): void {
    safeSet(STORAGE_KEYS.STICKERS, stickers);
  }

  static addSticker(sticker: Omit<StickerItem, 'id' | 'createdAt' | 'updatedAt'>): StickerItem {
    const list = this.getStickers();
    const newSticker: StickerItem = {
      ...sticker,
      id: `stk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    list.unshift(newSticker);
    this.saveStickers(list);

    // Register in centralized Media Resource library
    this.addMediaResource({
      name: newSticker.name,
      title: newSticker.name,
      url: newSticker.assetUrl,
      type: newSticker.type === 'gif' ? 'gif' : 'image',
      category: 'sticker',
      description: newSticker.description || 'Sticker/GIF cảm xúc',
      usedIn: ['Thư Viện Sticker', 'Bình Luận', 'Gửi Lời Yêu Thương']
    });

    return newSticker;
  }

  static updateSticker(id: string, updates: Partial<StickerItem>): void {
    const list = this.getStickers();
    const index = list.findIndex(s => s.id === id);
    if (index >= 0) {
      list[index] = { ...list[index], ...updates, updatedAt: Date.now() };
      this.saveStickers(list);
    }
  }

  static deleteSticker(id: string): void {
    const list = this.getStickers().filter(s => s.id !== id);
    this.saveStickers(list);
  }

  // ================= LOVE LETTERS (INBOX) ENHANCED =================
  static markLoveLetterRead(id: string, isRead: boolean = true): void {
    const letters = this.getLoveLetters();
    const letter = letters.find(l => l.id === id);
    if (letter) {
      letter.isRead = isRead;
      this.saveLoveLetters(letters);
    }
  }

  static toggleArchiveLoveLetter(id: string): void {
    const letters = this.getLoveLetters();
    const letter = letters.find(l => l.id === id);
    if (letter) {
      letter.isArchived = !letter.isArchived;
      this.saveLoveLetters(letters);
    }
  }

  // ================= MEDIA RESOURCE CMS =================
  static getMediaResources(): MediaResource[] {
    const list = safeGet<MediaResource[]>(STORAGE_KEYS.MEDIA_RESOURCES, []);
    if (list.length === 0) {
      safeSet(STORAGE_KEYS.MEDIA_RESOURCES, INITIAL_MEDIA_RESOURCES);
      return INITIAL_MEDIA_RESOURCES;
    }
    return list;
  }

  static saveMediaResources(resources: MediaResource[]): void {
    safeSet(STORAGE_KEYS.MEDIA_RESOURCES, resources);
  }

  static addMediaResource(resource: Omit<MediaResource, 'id' | 'createdAt'>): MediaResource {
    const list = this.getMediaResources();
    // Avoid exact duplicate URL entries
    const existing = list.find(r => r.url === resource.url);
    if (existing) {
      if (resource.usedIn && resource.usedIn.length > 0) {
        const combined = Array.from(new Set([...(existing.usedIn || []), ...resource.usedIn]));
        existing.usedIn = combined;
        this.saveMediaResources(list);
      }
      return existing;
    }

    const newRes: MediaResource = {
      ...resource,
      id: `res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: Date.now()
    };
    list.unshift(newRes);
    this.saveMediaResources(list);
    return newRes;
  }

  static updateMediaResource(id: string, updates: Partial<MediaResource>): void {
    const list = this.getMediaResources();
    const index = list.findIndex(r => r.id === id);
    if (index >= 0) {
      list[index] = { ...list[index], ...updates };
      this.saveMediaResources(list);
    }
  }

  static deleteMediaResource(id: string): void {
    const list = this.getMediaResources().filter(r => r.id !== id);
    this.saveMediaResources(list);
  }

  // ================= TAROT 78 CMS =================
  static getTarotDeck(): TarotCard[] {
    const deck = safeGet<TarotCard[]>(STORAGE_KEYS.TAROT_DECK, []);
    if (deck.length < 78) {
      safeSet(STORAGE_KEYS.TAROT_DECK, INITIAL_TAROT_DECK);
      return INITIAL_TAROT_DECK;
    }
    return deck;
  }

  static saveTarotDeck(deck: TarotCard[]): void {
    safeSet(STORAGE_KEYS.TAROT_DECK, deck);
  }

  static saveTarotCard(card: TarotCard): void {
    const deck = this.getTarotDeck();
    const index = deck.findIndex(c => c.id === card.id);
    if (index >= 0) {
      deck[index] = card;
    } else {
      deck.push(card);
    }
    this.saveTarotDeck(deck);
  }

  static resetTarotDeck(): void {
    safeSet(STORAGE_KEYS.TAROT_DECK, INITIAL_TAROT_DECK);
  }

  // ================= MOON SHOP / MINIGAME ITEMS CMS =================
  static saveMinigameItem(item: MinigameItem): void {
    const items = this.getMinigameItems();
    const index = items.findIndex(i => i.id === item.id);
    if (index >= 0) {
      items[index] = item;
    } else {
      items.push(item);
    }
    this.saveMinigameItems(items);
  }

  static deleteMinigameItem(id: string): void {
    const items = this.getMinigameItems().filter(i => i.id !== id);
    this.saveMinigameItems(items);
  }

  // ================= PLAYLIST CMS =================
  static savePlaylistItem(track: PlaylistItem): void {
    const tracks = this.getPlaylist();
    const index = tracks.findIndex(t => t.id === track.id);
    if (index >= 0) {
      tracks[index] = track;
    } else {
      tracks.push(track);
    }
    this.savePlaylist(tracks);
  }

  static deletePlaylistItem(id: string): void {
    const tracks = this.getPlaylist().filter(t => t.id !== id);
    this.savePlaylist(tracks);
  }

  // ================= QUOTES CMS =================
  static saveQuote(quote: CelestialQuote): void {
    const quotes = this.getQuotes();
    const index = quotes.findIndex(q => q.id === quote.id);
    if (index >= 0) {
      quotes[index] = quote;
    } else {
      quotes.unshift(quote);
    }
    this.saveQuotes(quotes);
  }

  static deleteQuote(id: string): void {
    const quotes = this.getQuotes().filter(q => q.id !== id);
    this.saveQuotes(quotes);
  }

  // ================= SCENARIOS CMS =================
  static saveScenario(scenario: ChatScenario): void {
    const scenarios = this.getScenarios();
    const index = scenarios.findIndex(s => s.id === scenario.id);
    if (index >= 0) {
      scenarios[index] = scenario;
    } else {
      scenarios.push(scenario);
    }
    this.saveScenarios(scenarios);
  }

  static deleteScenario(id: string): void {
    const scenarios = this.getScenarios().filter(s => s.id !== id);
    this.saveScenarios(scenarios);
  }

  // ================= USERS MANAGEMENT CMS =================
  static getAllUsers(): UserProfile[] {
    const list = safeGet<UserProfile[]>(STORAGE_KEYS.ALL_USERS, []);
    const currentUser = this.getUserProfile();
    if (list.length === 0) {
      const initialUsers = [currentUser];
      safeSet(STORAGE_KEYS.ALL_USERS, initialUsers);
      return initialUsers;
    }
    // Make sure currentUser is included
    if (!list.some(u => u.uid === currentUser.uid)) {
      list.unshift(currentUser);
    }
    return list;
  }

  static saveAllUsers(users: UserProfile[]): void {
    safeSet(STORAGE_KEYS.ALL_USERS, users);
  }

  static saveOrUpdateUser(user: UserProfile): void {
    const list = this.getAllUsers();
    const index = list.findIndex(u => u.uid === user.uid);
    if (index >= 0) {
      list[index] = user;
    } else {
      list.push(user);
    }
    this.saveAllUsers(list);
    // If it's current user, also update current profile
    const current = this.getUserProfile();
    if (current.uid === user.uid) {
      this.saveUserProfile(user);
    }
  }

  // ================= TARGETED DANGER ZONE RESETS =================
  static resetRankingAndHearts(): void {
    const characters = this.getCharacters().map(c => ({
      ...c,
      loveCount: 0,
      voteCount: 0,
      affinity: 0
    }));
    this.saveCharacters(characters);
    safeSet(STORAGE_KEYS.LOVED_IDS, []);
    safeSet(STORAGE_KEYS.VOTED_IDS, []);
  }

  static resetAllComments(): void {
    const characters = this.getCharacters();
    characters.forEach(char => {
      safeSet(STORAGE_KEYS.COMMENTS_PREFIX + char.id, []);
    });
  }

  static resetMinigameData(): void {
    const user = this.getUserProfile();
    user.garden = DEFAULT_USER_PROFILE.garden;
    user.stats.totalHarvested = 0;
    user.stats.totalFished = 0;
    user.stats.totalDug = 0;
    user.stats.totalCooked = 0;
    user.stats.totalGiftsSent = 0;
    user.stats.freeLuckyBoxCount = 3;
    this.saveUserProfile(user);
    this.saveOrUpdateUser(user);
  }

  static resetUserStatsAndCurrency(): void {
    const user = this.getUserProfile();
    user.stats.coins = 150;
    user.stats.stardust = 30;
    user.stats.energy = 100;
    user.stats.exp = 0;
    user.stats.level = 1;
    user.inventory = DEFAULT_USER_PROFILE.inventory;
    this.saveUserProfile(user);
    this.saveOrUpdateUser(user);
  }

  static resetShopStock(): void {
    const items = this.getMinigameItems().map(item => ({
      ...item,
      stock: 99
    }));
    this.saveMinigameItems(items);
  }

  static replyLoveLetter(id: string, replyText: string): void {
    const letters = this.getLoveLetters();
    const letter = letters.find(l => l.id === id);
    if (letter) {
      letter.reply = replyText;
      letter.replyFromAdmin = replyText;
      this.saveLoveLetters(letters);
    }
  }

  static deleteLoveLetter(id: string): void {
    const letters = this.getLoveLetters().filter(l => l.id !== id);
    this.saveLoveLetters(letters);
  }

  static resetToSeedData(): void {
    safeSet(STORAGE_KEYS.SITE_CONFIG, INITIAL_SITE_CONFIG);
    safeSet(STORAGE_KEYS.MEDIA_RESOURCES, INITIAL_MEDIA_RESOURCES);
    safeSet(STORAGE_KEYS.LOADING_ANIMATIONS, INITIAL_LOADING_ANIMATIONS);
    safeSet(STORAGE_KEYS.USER_AVATAR_PRESETS, INITIAL_AVATAR_PRESETS);
    safeSet(STORAGE_KEYS.STICKER_CATEGORIES, INITIAL_STICKER_CATEGORIES);
    safeSet(STORAGE_KEYS.STICKERS, INITIAL_STICKERS);
    safeSet(STORAGE_KEYS.CHARACTERS, INITIAL_CHARACTERS);
    safeSet(STORAGE_KEYS.GALLERY_FOLDERS, INITIAL_GALLERY_FOLDERS);
    safeSet(STORAGE_KEYS.GALLERY_ITEMS, INITIAL_GALLERY_ITEMS);
    safeSet(STORAGE_KEYS.PLAYLIST, INITIAL_PLAYLIST);
    safeSet(STORAGE_KEYS.TAROT_DECK, INITIAL_TAROT_DECK);
    safeSet(STORAGE_KEYS.QUOTES, INITIAL_QUOTES);
    safeSet(STORAGE_KEYS.LOVE_LETTERS, INITIAL_LOVE_LETTERS);
    safeSet(STORAGE_KEYS.MINIGAME_ITEMS, INITIAL_MINIGAME_ITEMS);
    safeSet(STORAGE_KEYS.MINIGAME_RECIPES, INITIAL_RECIPES);
    safeSet(STORAGE_KEYS.QUESTS, INITIAL_QUESTS);
    safeSet(STORAGE_KEYS.VOTE_SETTINGS, DEFAULT_VOTE_SETTING);
    safeSet(STORAGE_KEYS.SCENARIOS, INITIAL_SCENARIOS);
    safeSet(STORAGE_KEYS.CHARACTER_CATEGORIES, INITIAL_CHARACTER_CATEGORIES);
    safeSet(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACK_ITEMS);
    safeSet(STORAGE_KEYS.SECTION_BACKGROUNDS, INITIAL_SECTION_BACKGROUNDS);
    safeSet(STORAGE_KEYS.LOVED_IDS, []);
    safeSet(STORAGE_KEYS.VOTED_IDS, []);
  }

  // Scenarios
  static getScenarios(): ChatScenario[] {
    const list = safeGet<ChatScenario[]>(STORAGE_KEYS.SCENARIOS, []);
    if (list.length === 0) {
      safeSet(STORAGE_KEYS.SCENARIOS, INITIAL_SCENARIOS);
      return INITIAL_SCENARIOS;
    }
    return list;
  }

  static saveScenarios(scenarios: ChatScenario[]): void {
    safeSet(STORAGE_KEYS.SCENARIOS, scenarios);
  }

  // ==========================================
  // SECTION A: Character Categories
  // ==========================================
  static getCharacterCategories(): CharacterCategory[] {
    const list = safeGet<CharacterCategory[]>(STORAGE_KEYS.CHARACTER_CATEGORIES, []);
    if (list.length === 0) {
      safeSet(STORAGE_KEYS.CHARACTER_CATEGORIES, INITIAL_CHARACTER_CATEGORIES);
      return INITIAL_CHARACTER_CATEGORIES;
    }
    return list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }

  static saveCharacterCategory(category: CharacterCategory): void {
    const list = this.getCharacterCategories();
    const existingIndex = list.findIndex(c => c.id === category.id);
    if (existingIndex >= 0) {
      list[existingIndex] = { ...category, updatedAt: Date.now() };
    } else {
      list.push({ ...category, createdAt: category.createdAt || Date.now(), updatedAt: Date.now() });
    }
    safeSet(STORAGE_KEYS.CHARACTER_CATEGORIES, list);
  }

  static deleteCharacterCategory(id: string): void {
    const list = this.getCharacterCategories().filter(c => c.id !== id);
    safeSet(STORAGE_KEYS.CHARACTER_CATEGORIES, list);
  }

  static reorderCharacterCategories(categories: CharacterCategory[]): void {
    const updated = categories.map((cat, index) => ({
      ...cat,
      sortOrder: index + 1
    }));
    safeSet(STORAGE_KEYS.CHARACTER_CATEGORIES, updated);
  }

  static resetCharacterCategories(): void {
    safeSet(STORAGE_KEYS.CHARACTER_CATEGORIES, INITIAL_CHARACTER_CATEGORIES);
  }

  // ==========================================
  // SECTION B: Feedback Board
  // ==========================================
  static getFeedbackList(): FeedbackItem[] {
    const list = safeGet<FeedbackItem[]>(STORAGE_KEYS.FEEDBACK, []);
    if (list.length === 0) {
      safeSet(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACK_ITEMS);
      return INITIAL_FEEDBACK_ITEMS;
    }
    return list.sort((a, b) => b.createdAt - a.createdAt);
  }

  static getFeedbackById(id: string): FeedbackItem | null {
    const list = this.getFeedbackList();
    return list.find(f => f.id === id) || null;
  }

  static saveFeedback(item: FeedbackItem): void {
    const list = this.getFeedbackList();
    const existingIndex = list.findIndex(f => f.id === item.id);
    if (existingIndex >= 0) {
      list[existingIndex] = { ...item, updatedAt: Date.now() };
    } else {
      list.unshift({ ...item, createdAt: item.createdAt || Date.now(), updatedAt: Date.now() });
    }
    safeSet(STORAGE_KEYS.FEEDBACK, list);
  }

  static updateFeedbackStatus(id: string, status: FeedbackStatus, adminNote?: string): void {
    const list = this.getFeedbackList();
    const item = list.find(f => f.id === id);
    if (item) {
      item.status = status;
      if (adminNote !== undefined) {
        item.adminNote = adminNote;
      }
      item.updatedAt = Date.now();
      safeSet(STORAGE_KEYS.FEEDBACK, list);
    }
  }

  static markFeedbackRead(id: string): void {
    const list = this.getFeedbackList();
    const item = list.find(f => f.id === id);
    if (item) {
      item.isRead = true;
      safeSet(STORAGE_KEYS.FEEDBACK, list);
    }
  }

  static deleteFeedback(id: string): void {
    const list = this.getFeedbackList().filter(f => f.id !== id);
    safeSet(STORAGE_KEYS.FEEDBACK, list);
  }

  static resetFeedback(): void {
    safeSet(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACK_ITEMS);
  }

  // ==========================================
  // SECTION C: Per-Section Backgrounds
  // ==========================================
  static getSectionBackgrounds(): SectionBackgroundsMap {
    const backgrounds = safeGet<SectionBackgroundsMap>(STORAGE_KEYS.SECTION_BACKGROUNDS, {});
    if (Object.keys(backgrounds).length === 0) {
      safeSet(STORAGE_KEYS.SECTION_BACKGROUNDS, INITIAL_SECTION_BACKGROUNDS);
      return INITIAL_SECTION_BACKGROUNDS;
    }
    // Merge with initial defaults to ensure all routes exist
    return { ...INITIAL_SECTION_BACKGROUNDS, ...backgrounds };
  }

  static getSectionBackground(route: string): SectionBackgroundSetting {
    const all = this.getSectionBackgrounds();
    if (all[route]) {
      return all[route];
    }
    return INITIAL_SECTION_BACKGROUNDS[route] || {
      route,
      title: route,
      backgroundType: 'image',
      overlayOpacity: 0.7,
      blur: 0,
      brightness: 0.8,
      contrast: 1.05,
      isFixed: true,
      showStarsEffect: true,
      enabled: true
    };
  }

  static saveSectionBackground(keyOrSetting: string | SectionBackgroundSetting, updates?: Partial<SectionBackgroundSetting>): void {
    const all = this.getSectionBackgrounds();
    if (typeof keyOrSetting === 'string') {
      const key = keyOrSetting;
      const current = all[key] || {
        route: key,
        title: key,
        backgroundType: 'image',
        type: 'image',
        overlayOpacity: 0.7,
        opacity: 0.15,
        blur: 0,
        brightness: 0.8,
        contrast: 1.05,
        isFixed: true,
        showStarsEffect: true,
        enabled: true
      };
      all[key] = {
        ...current,
        ...updates,
        updatedAt: Date.now()
      };
    } else {
      const setting = keyOrSetting;
      const routeKey = setting.route || 'home';
      all[routeKey] = {
        ...setting,
        updatedAt: Date.now()
      };
    }
    safeSet(STORAGE_KEYS.SECTION_BACKGROUNDS, all);
  }

  static resetSectionBackgrounds(): void {
    safeSet(STORAGE_KEYS.SECTION_BACKGROUNDS, INITIAL_SECTION_BACKGROUNDS);
  }

  // ================= REWARD CODES & MAILBOX CMS =================
  static getRewardCodes(): RewardCode[] {
    const list = safeGet<RewardCode[]>(STORAGE_KEYS.REWARD_CODES, []);
    if (list.length === 0) {
      safeSet(STORAGE_KEYS.REWARD_CODES, INITIAL_REWARD_CODES);
      return INITIAL_REWARD_CODES;
    }
    return list;
  }

  static saveRewardCodes(codes: RewardCode[]): void {
    safeSet(STORAGE_KEYS.REWARD_CODES, codes);
  }

  static addRewardCode(code: Omit<RewardCode, 'createdAt' | 'currentUses'>): RewardCode {
    const list = this.getRewardCodes();
    const normalizedCode = code.code.trim().toUpperCase();
    const newCode: RewardCode = {
      ...code,
      id: normalizedCode,
      code: normalizedCode,
      currentUses: 0,
      createdAt: Date.now()
    };
    // Replace if exists, else append
    const existingIdx = list.findIndex(c => c.code === normalizedCode || c.id === normalizedCode);
    if (existingIdx >= 0) {
      list[existingIdx] = newCode;
    } else {
      list.unshift(newCode);
    }
    this.saveRewardCodes(list);
    return newCode;
  }

  static updateRewardCode(id: string, updates: Partial<RewardCode>): void {
    const list = this.getRewardCodes();
    const index = list.findIndex(c => c.id === id || c.code === id);
    if (index >= 0) {
      list[index] = { ...list[index], ...updates };
      this.saveRewardCodes(list);
    }
  }

  static deleteRewardCode(id: string): void {
    const list = this.getRewardCodes().filter(c => c.id !== id && c.code !== id);
    this.saveRewardCodes(list);
  }

  static getRedemptions(): RewardRedemption[] {
    return safeGet<RewardRedemption[]>(STORAGE_KEYS.REWARD_REDEMPTIONS, []);
  }

  static saveRedemptions(list: RewardRedemption[]): void {
    safeSet(STORAGE_KEYS.REWARD_REDEMPTIONS, list);
  }

  // Local Reward Code Redemption Engine (with weighted Random Box support)
  static redeemCodeLocal(
    userId: string, 
    codeInput: string, 
    currentProfile: UserProfile
  ): { success: boolean; message: string; rewardPackage?: RewardPackage; updatedProfile?: UserProfile } {
    const normalized = codeInput.trim().toUpperCase();
    const codes = this.getRewardCodes();
    const codeObj = codes.find(c => c.code.toUpperCase() === normalized || c.id.toUpperCase() === normalized);

    if (!codeObj) {
      return { success: false, message: 'Mã phần thưởng không tồn tại hoặc đã hết hạn.' };
    }

    if (!codeObj.isActive) {
      return { success: false, message: 'Mã phần thưởng này hiện đang tạm dừng.' };
    }

    if (codeObj.expiresAt && codeObj.expiresAt < Date.now()) {
      return { success: false, message: 'Mã phần thưởng đã quá hạn sử dụng.' };
    }

    if (codeObj.maxUses !== null && codeObj.currentUses >= codeObj.maxUses) {
      return { success: false, message: 'Mã phần thưởng đã hết lượt sử dụng.' };
    }

    const redemptions = this.getRedemptions();
    const alreadyRedeemed = redemptions.some(r => r.code === normalized && r.userId === userId);
    if (alreadyRedeemed) {
      return { success: false, message: 'Tài khoản của bạn đã nhận phần thưởng từ mã này rồi.' };
    }

    // Resolve reward package
    let awardedPackage: RewardPackage = { rewards: [] };

    if (codeObj.rewardType === 'random_box' && codeObj.rewardPool && codeObj.rewardPool.length > 0) {
      // Calculate total weight
      const totalWeight = codeObj.rewardPool.reduce((acc, item) => acc + (item.weight || 1), 0);
      let rand = Math.random() * totalWeight;
      let selectedItem = codeObj.rewardPool[0];

      for (const poolItem of codeObj.rewardPool) {
        if (rand < (poolItem.weight || 1)) {
          selectedItem = poolItem;
          break;
        }
        rand -= (poolItem.weight || 1);
      }

      awardedPackage = {
        rewards: [selectedItem.reward]
      };
    } else if (codeObj.rewardPackage) {
      awardedPackage = codeObj.rewardPackage;
    }

    // Apply rewards to profile
    const stats = { ...currentProfile.stats };
    const inventory = [...currentProfile.inventory];

    for (const reward of awardedPackage.rewards) {
      if (reward.type === 'coin') stats.coins = (stats.coins || 0) + reward.amount;
      if (reward.type === 'stardust') stats.stardust = (stats.stardust || 0) + reward.amount;
      if (reward.type === 'energy') stats.energy = Math.min(stats.maxEnergy, (stats.energy || 0) + reward.amount);
      if (reward.type === 'exp') {
        stats.exp = (stats.exp || 0) + reward.amount;
        let rExp = stats.level * 100;
        while (stats.exp >= rExp) {
          stats.level = stats.level + 1;
          stats.exp = stats.exp - rExp;
          rExp = stats.level * 100;
        }
      }
      if (reward.type === 'item' && reward.itemId) {
        const existingSlot = inventory.find(s => s.itemId === reward.itemId);
        if (existingSlot) {
          existingSlot.quantity += reward.amount;
        } else {
          inventory.push({ itemId: reward.itemId, quantity: reward.amount });
        }
      }
    }

    const updatedProfile: UserProfile = {
      ...currentProfile,
      stats,
      inventory
    };

    // Save profile locally
    this.saveUserProfile(updatedProfile);

    // Increment code usage
    this.updateRewardCode(codeObj.id, { currentUses: (codeObj.currentUses || 0) + 1 });

    // Record redemption
    redemptions.push({
      id: `redemp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      codeId: codeObj.id,
      code: normalized,
      userId,
      userNickname: currentProfile.nickname || currentProfile.displayName,
      redeemedAt: Date.now(),
      rewardPackage: awardedPackage
    });
    this.saveRedemptions(redemptions);

    return {
      success: true,
      message: 'Nhận phần thưởng thành công!',
      rewardPackage: awardedPackage,
      updatedProfile
    };
  }

  // User Mailbox (Hộp Thư)
  static getUserMailbox(userId: string): MailboxMessage[] {
    const key = `${STORAGE_KEYS.MAILBOX_PREFIX}${userId}`;
    const list = safeGet<MailboxMessage[]>(key, []);
    if (list.length === 0) {
      const welcomeMsg: MailboxMessage = {
        id: `mail_welcome_${userId}`,
        sender: 'Người Trông Coi Mái Hiên',
        title: '✦ Lời Chào Mừng Lữ Khách Đêm',
        message: 'Chào mừng bạn ghé thăm Mái Hiên! Nơi đây lưu giữ những thanh âm yên bình, vần thơ ánh sao và những người bạn tri kỷ dưới bầu trời.',
        rewardPackage: {
          rewards: [
            { type: 'coin', amount: 200 },
            { type: 'stardust', amount: 50 },
            { type: 'energy', amount: 30 }
          ]
        },
        isRead: false,
        isClaimed: false,
        createdAt: Date.now()
      };
      safeSet(key, [welcomeMsg]);
      return [welcomeMsg];
    }
    return list.sort((a, b) => b.createdAt - a.createdAt);
  }

  static saveUserMailbox(userId: string, messages: MailboxMessage[]): void {
    const key = `${STORAGE_KEYS.MAILBOX_PREFIX}${userId}`;
    safeSet(key, messages);
  }

  static sendDirectMailboxReward(
    targetUserId: string,
    title: string,
    message: string,
    rewardPackage: RewardPackage
  ): MailboxMessage {
    const mailbox = this.getUserMailbox(targetUserId);
    const newMsg: MailboxMessage = {
      id: `mail_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      sender: 'Người Trông Coi Mái Hiên',
      title: title.trim() || '✦ Quà Tặng Từ Người Trông Coi',
      message: message.trim() || 'Một món quà nhỏ gửi tặng lữ khách dưới bầu trời đêm.',
      rewardPackage,
      isRead: false,
      isClaimed: false,
      createdAt: Date.now()
    };
    mailbox.unshift(newMsg);
    this.saveUserMailbox(targetUserId, mailbox);
    return newMsg;
  }

  static claimUserMailboxReward(
    userId: string,
    messageId: string,
    currentProfile: UserProfile
  ): { success: boolean; message: string; updatedProfile?: UserProfile } {
    const mailbox = this.getUserMailbox(userId);
    const msg = mailbox.find(m => m.id === messageId);
    if (!msg) {
      return { success: false, message: 'Thư không tồn tại.' };
    }
    if (msg.isClaimed) {
      return { success: false, message: 'Phần thưởng này đã được nhận trước đó.' };
    }

    // Apply rewards
    const stats = { ...currentProfile.stats };
    const inventory = [...currentProfile.inventory];

    if (msg.rewardPackage && msg.rewardPackage.rewards) {
      for (const reward of msg.rewardPackage.rewards) {
        if (reward.type === 'coin') stats.coins = (stats.coins || 0) + reward.amount;
        if (reward.type === 'stardust') stats.stardust = (stats.stardust || 0) + reward.amount;
        if (reward.type === 'energy') stats.energy = Math.min(stats.maxEnergy, (stats.energy || 0) + reward.amount);
        if (reward.type === 'exp') {
          stats.exp = (stats.exp || 0) + reward.amount;
          let rExp = stats.level * 100;
          while (stats.exp >= rExp) {
            stats.level = stats.level + 1;
            stats.exp = stats.exp - rExp;
            rExp = stats.level * 100;
          }
        }
        if (reward.type === 'item' && reward.itemId) {
          const existingSlot = inventory.find(s => s.itemId === reward.itemId);
          if (existingSlot) {
            existingSlot.quantity += reward.amount;
          } else {
            inventory.push({ itemId: reward.itemId, quantity: reward.amount });
          }
        }
      }
    }

    msg.isClaimed = true;
    msg.isRead = true;
    this.saveUserMailbox(userId, mailbox);

    const updatedProfile: UserProfile = {
      ...currentProfile,
      stats,
      inventory
    };
    this.saveUserProfile(updatedProfile);

    return {
      success: true,
      message: 'Đã nhận phần thưởng thành công!',
      updatedProfile
    };
  }

  static markMailAsReadLocal(userId: string, messageId: string): void {
    const mailbox = this.getUserMailbox(userId);
    const msg = mailbox.find(m => m.id === messageId);
    if (msg && !msg.isRead) {
      msg.isRead = true;
      this.saveUserMailbox(userId, mailbox);
    }
  }

  // Backup Export
  static exportFullBackup(): string {
    const backupData = {
      version: '2.5.0-CMS',
      exportedAt: new Date().toISOString(),
      siteConfig: this.getSiteConfig(),
      loadingAnimations: this.getLoadingAnimations(),
      userAvatarPresets: this.getUserAvatarPresets(),
      rewardCodes: this.getRewardCodes(),
      stickerCategories: this.getStickerCategories(),
      stickers: this.getStickers(),
      characterCategories: this.getCharacterCategories(),
      feedback: this.getFeedbackList(),
      sectionBackgrounds: this.getSectionBackgrounds(),
      mediaResources: this.getMediaResources(),
      characters: this.getCharacters(),
      galleryFolders: this.getGalleryFolders(),
      galleryItems: this.getGalleryItems(),
      playlist: this.getPlaylist(),
      tarotDeck: this.getTarotDeck(),
      quotes: this.getQuotes(),
      loveLetters: this.getLoveLetters(),
      minigameItems: this.getMinigameItems(),
      minigameRecipes: this.getMinigameRecipes(),
      scenarios: this.getScenarios(),
      voteSettings: this.getVoteSetting(),
      users: this.getAllUsers()
    };
    return JSON.stringify(backupData, null, 2);
  }
}

