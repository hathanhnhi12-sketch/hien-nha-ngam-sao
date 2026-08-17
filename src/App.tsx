import React, { useState, useEffect } from 'react';
import { 
  Character, 
  PlaylistItem, 
  GalleryItem, 
  LoveLetter, 
  TarotCard, 
  CelestialQuote, 
  UserProfile, 
  GiftHistoryItem 
} from './types';
import { StorageService } from './services/storageService';
import { AuthService } from './services/authService';
import { useThemeStore } from './stores/useThemeStore';
import { usePlayerStore } from './stores/usePlayerStore';
import { useMinigameStore } from './stores/useMinigameStore';
import { toast } from './stores/useToastStore';

// Layout & UI Components
import { BackgroundEffects } from './components/layout/BackgroundEffects';
import { SectionBackground } from './components/common/SectionBackground';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MusicPlayerBar } from './components/layout/MusicPlayerBar';
import { ToastContainer } from './components/ui/ToastContainer';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { UserProfileModal } from './components/auth/UserProfileModal';
import { CharacterFormModal } from './components/character/CharacterFormModal';

// Pages
import { HomePage } from './pages/Home/HomePage';
import { CharactersPage } from './pages/Characters/CharactersPage';
import { CharacterDetailPage } from './pages/CharacterDetail/CharacterDetailPage';
import { LeaderboardPage } from './pages/Leaderboard/LeaderboardPage';
import { VotePage } from './pages/Vote/VotePage';
import { SendLovePage } from './pages/SendLove/SendLovePage';
import { FeedbackPage } from './pages/Feedback/FeedbackPage';
import { PlaylistPage } from './pages/Playlist/PlaylistPage';
import { GalleryPage } from './pages/Gallery/GalleryPage';
import { OtherSpacesHub } from './pages/OtherSpaces/OtherSpacesHub';
import { MinigamePage } from './pages/Minigame/MinigamePage';
import { RankingPage } from './pages/Ranking/RankingPage';
import { AdminPage } from './pages/Admin/AdminPage';

export default function App() {
  // Global theme and display state
  const { theme, displayMode, backgroundTheme, toggleTheme, setDisplayMode } = useThemeStore();

  // Audio player store
  const {
    playlist,
    currentTrackIndex,
    isPlaying,
    progress,
    duration,
    volume,
    isMuted,
    isShuffle,
    isRepeat,
    isExpanded,
    setPlaylist,
    playTrack,
    togglePlay,
    handleNext,
    handlePrev,
    seek,
    setVolume,
    setIsMuted,
    setIsShuffle,
    setIsRepeat,
    setIsExpanded
  } = usePlayerStore();

  // Minigame store
  const {
    profile,
    inventory,
    items,
    updateProfile,
    giftCharacter,
    giftHistory,
    mailbox
  } = useMinigameStore();

  // Navigation state
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  
  // Dedicated route transition state (STRICTLY for intentional user route navigation, NEVER for initial load or refresh)
  const [isRouteTransitioning, setIsRouteTransitioning] = useState<boolean>(false);
  const transitionTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  // Auth & Admin state
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userProfileModalOpen, setUserProfileModalOpen] = useState<boolean>(false);
  const [addCharacterModalOpen, setAddCharacterModalOpen] = useState<boolean>(false);

  // Main data collections
  const [characters, setCharacters] = useState<Character[]>([]);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loveLetters, setLoveLetters] = useState<LoveLetter[]>([]);
  const [tarotCards, setTarotCards] = useState<TarotCard[]>([]);
  const [quotes, setQuotes] = useState<CelestialQuote[]>([]);
  const [lovedCharacterIds, setLovedCharacterIds] = useState<string[]>([]);
  const [votedCharacterIds, setVotedCharacterIds] = useState<string[]>([]);

  // Initial Load from Storage
  useEffect(() => {
    AuthService.init();
    const unsubscribe = AuthService.onAuthStateChanged((adminState) => {
      setIsAdmin(adminState);
    });

    setCharacters(StorageService.getCharacters());
    setScenarios(StorageService.getScenarios());
    const storedPlaylist = StorageService.getPlaylist();
    setPlaylist(storedPlaylist);
    setGalleryItems(StorageService.getGallery());
    setLoveLetters(StorageService.getLoveLetters());
    setTarotCards(StorageService.getTarotCards());
    setQuotes(StorageService.getQuotes());
    setLovedCharacterIds(StorageService.getLovedCharacterIds());
    setVotedCharacterIds(StorageService.getVotedCharacterIds());

    return () => unsubscribe();
  }, [setPlaylist]);

  // Route Navigation handler - Triggers transition ONLY on intentional route change
  const navigate = (route: string) => {
    if (route === currentRoute) return;

    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }

    setIsRouteTransitioning(true);
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    transitionTimerRef.current = setTimeout(() => {
      setIsRouteTransitioning(false);
    }, 650);
  };

  // Character selection
  const handleSelectCharacter = (char: Character) => {
    // Increment view count
    StorageService.incrementViews(char.id);
    const updated = { ...char, views: (char.views || 0) + 1 };
    setCharacters(prev => prev.map(c => c.id === char.id ? updated : c));
    setSelectedCharacter(updated);
    navigate('character-detail');
  };

  // Love Character handler
  const handleLoveCharacter = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (lovedCharacterIds.includes(id)) {
      toast.star('Cậu đã gửi gắm tình cảm tới nhân vật này rồi ✦');
      return;
    }

    StorageService.loveCharacter(id);
    setLovedCharacterIds(prev => [...prev, id]);
    setCharacters(prev => prev.map(c => c.id === id ? { ...c, loveCount: (c.loveCount || 0) + 1 } : c));
    if (selectedCharacter && selectedCharacter.id === id) {
      setSelectedCharacter(prev => prev ? { ...prev, loveCount: (prev.loveCount || 0) + 1 } : null);
    }

    if (profile.email) {
      const expConfig = StorageService.getSiteConfig().expConfig;
      if (expConfig) {
        import('./services/accountService').then(m => m.AccountService.secureAction(profile.uid, 'add_exp', { amount: expConfig.characterLike || 2 })).catch(console.error);
      }
    }

    toast.star('Đã gửi một trái tim ấm áp tới nhân vật ❤️');
  };

  // Vote Character handler
  const handleVoteCharacter = (id: string) => {
    StorageService.voteCharacter(id);
    setVotedCharacterIds(prev => [...prev, id]);
    setCharacters(prev => prev.map(c => c.id === id ? { ...c, voteCount: (c.voteCount || 0) + 1 } : c));
    if (selectedCharacter && selectedCharacter.id === id) {
      setSelectedCharacter(prev => prev ? { ...prev, voteCount: (prev.voteCount || 0) + 1 } : null);
    }
    
    if (profile.email) {
      const expConfig = StorageService.getSiteConfig().expConfig;
      if (expConfig) {
        import('./services/accountService').then(m => m.AccountService.secureAction(profile.uid, 'add_exp', { amount: expConfig.vote || 5 })).catch(console.error);
      }
    }

    toast.success('Lá phiếu ánh sao của bạn đã được ghi nhận ✦');
  };

  // Increment Chat count
  const handleIncrementChat = (id: string) => {
    StorageService.incrementChats(id);
    setCharacters(prev => prev.map(c => c.id === id ? { ...c, chats: (c.chats || 0) + 1 } : c));
    if (selectedCharacter && selectedCharacter.id === id) {
      setSelectedCharacter(prev => prev ? { ...prev, chats: (prev.chats || 0) + 1 } : null);
    }
  };

  // Gift Character handler
  const handleGiftCharacter = (characterId: string, characterName: string, itemId: string, quantity: number) => {
    const res = giftCharacter(characterId, characterName, itemId, quantity);
    if (res.success) {
      // update local characters state
      setCharacters(prev => prev.map(c => c.id === characterId ? { ...c, affinity: (c.affinity || 0) + res.affinityGained } : c));
      if (selectedCharacter && selectedCharacter.id === characterId) {
        setSelectedCharacter(prev => prev ? { ...prev, affinity: (prev.affinity || 0) + res.affinityGained } : null);
      }
    }
  };

  // Gallery like
  const handleLikeImage = (id: string) => {
    StorageService.likeGalleryItem(id);
    setGalleryItems(prev => prev.map(g => g.id === id ? { ...g, likes: (g.likes || 0) + 1 } : g));
    toast.success('Đã thả tim cho tác phẩm ✦');
  };

  // Quote like
  const handleLikeQuote = (id: string) => {
    StorageService.likeQuote(id);
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, likes: (q.likes || 0) + 1 } : q));
    toast.success('Đã lưu lại sự đồng cảm cùng câu nói ✦');
  };

  // Love Letter like
  const handleLikeLetter = (id: string) => {
    StorageService.likeLoveLetter(id);
    setLoveLetters(prev => prev.map(l => l.id === id ? { ...l, likes: (l.likes || 0) + 1 } : l));
    toast.star('Đã thả tim bức thư dưới ánh trăng ❤️');
  };

  // Love Letter add
  const handleAddLoveLetter = (letter: LoveLetter) => {
    StorageService.addLoveLetter(letter);
    setLoveLetters(StorageService.getLoveLetters());

    if (profile.email) {
      const expConfig = StorageService.getSiteConfig().expConfig;
      if (expConfig) {
        import('./services/accountService').then(m => m.AccountService.secureAction(profile.uid, 'add_exp', { amount: expConfig.feedback || 5 })).catch(console.error);
      }
    }
  };

  // Admin Actions
  const handleSaveCharacter = (char: Character) => {
    StorageService.saveCharacter(char);
    setCharacters(StorageService.getCharacters());
    if (selectedCharacter && selectedCharacter.id === char.id) {
      setSelectedCharacter(char);
    }
  };

  const handleDeleteCharacter = (id: string) => {
    StorageService.deleteCharacter(id);
    setCharacters(StorageService.getCharacters());
    if (selectedCharacter && selectedCharacter.id === id) {
      setSelectedCharacter(null);
      setCurrentRoute('characters');
    }
  };

  const handleSavePlaylistTrack = (track: PlaylistItem) => {
    StorageService.savePlaylistItem(track);
    const updated = StorageService.getPlaylist();
    setPlaylist(updated);
  };

  const handleDeletePlaylistTrack = (id: string) => {
    StorageService.deletePlaylistItem(id);
    const updated = StorageService.getPlaylist();
    setPlaylist(updated);
  };

  const handleSaveGalleryItem = (item: GalleryItem) => {
    StorageService.saveGalleryItem(item);
    setGalleryItems(StorageService.getGallery());
  };

  const handleDeleteGalleryItem = (id: string) => {
    StorageService.deleteGalleryItem(id);
    setGalleryItems(StorageService.getGallery());
  };

  const handleReplyLoveLetter = (id: string, reply: string) => {
    StorageService.replyLoveLetter(id, reply);
    setLoveLetters(StorageService.getLoveLetters());
  };

  const handleDeleteLoveLetter = (id: string) => {
    StorageService.deleteLoveLetter(id);
    setLoveLetters(StorageService.getLoveLetters());
  };

  const handleResetSeedData = () => {
    StorageService.resetToSeedData();
    setCharacters(StorageService.getCharacters());
    setPlaylist(StorageService.getPlaylist());
    setGalleryItems(StorageService.getGallery());
    setLoveLetters(StorageService.getLoveLetters());
    setTarotCards(StorageService.getTarotCards());
    setQuotes(StorageService.getQuotes());
    toast.success('Đã khôi phục dữ liệu mẫu gốc ban đầu ✦');
  };

  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    navigate('admin');
  };

  const handleLogoutAdmin = () => {
    AuthService.logoutAdmin();
    setIsAdmin(false);
    toast.success('Đã đăng xuất phiên quản trị an toàn.');
    navigate('home');
  };

  // Device display mode wrapper classes
  let containerStyle = 'w-full min-h-screen transition-colors duration-300 ';
  if (displayMode === 'mobile') {
    containerStyle += 'max-w-md mx-auto shadow-2xl my-4 rounded-3xl border border-indigo-500/30 overflow-hidden ';
  }

  const currentTrack = playlist[currentTrackIndex] || playlist[0];

  return (
    <div className={`relative min-h-screen ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-[#f7f8fc] text-slate-800'}`}>
      
      {/* Dynamic Animated Starlight Background Effects */}
      <BackgroundEffects theme={backgroundTheme} />

      {/* Per-Section Customizable Background Layer */}
      <SectionBackground currentRoute={currentRoute} />

      {/* Main Container */}
      <div className={containerStyle}>
        
        {/* Navbar (Hidden on home landing screen for full cinematic immersion) */}
        {currentRoute !== 'home' && (
          <Navbar
            currentRoute={currentRoute}
            navigate={navigate}
            theme={theme}
            toggleTheme={toggleTheme}
            displayMode={displayMode}
            setDisplayMode={setDisplayMode}
            userProfile={profile}
            onOpenProfile={() => setUserProfileModalOpen(true)}
            isAdmin={isAdmin}
          />
        )}

        {/* Dynamic Route Content Views */}
        <main className={`relative z-10 ${currentRoute === 'home' ? 'p-0' : 'pt-6 sm:pt-8 pb-16'}`}>
          {currentRoute === 'home' && (
            <HomePage
              quotes={quotes}
              navigate={navigate}
              theme={theme}
              toggleTheme={toggleTheme}
              userProfile={profile}
              onOpenProfile={() => setUserProfileModalOpen(true)}
              isPlayingMusic={isPlaying}
              onToggleMusic={togglePlay}
            />
          )}

          {currentRoute === 'characters' && (
            <CharactersPage
              characters={characters}
              scenarios={scenarios}
              isAdmin={isAdmin}
              onSelectCharacter={handleSelectCharacter}
              onLoveCharacter={handleLoveCharacter}
              isCharacterLoved={(id) => lovedCharacterIds.includes(id)}
              onOpenAddModal={() => setAddCharacterModalOpen(true)}
            />
          )}

          {currentRoute === 'character-detail' && selectedCharacter && (
            <CharacterDetailPage
              character={selectedCharacter}
              onBack={() => navigate('characters')}
              isAdmin={isAdmin}
              onLove={handleLoveCharacter}
              isLoved={lovedCharacterIds.includes(selectedCharacter.id)}
              onVote={handleVoteCharacter}
              onOpenEditModal={(char) => {
                setSelectedCharacter(char);
                setAddCharacterModalOpen(true);
              }}
              inventory={inventory}
              items={items}
              onGift={handleGiftCharacter}
              onIncrementChat={handleIncrementChat}
            />
          )}

          {currentRoute === 'leaderboard' && (
            <LeaderboardPage
              characters={characters}
              onSelectCharacter={handleSelectCharacter}
            />
          )}

          {currentRoute === 'vote' && (
            <VotePage
              characters={characters}
              onVote={handleVoteCharacter}
              votedIds={votedCharacterIds}
            />
          )}

          {currentRoute === 'send-love' && (
            <SendLovePage
              loveLetters={loveLetters}
              characters={characters}
              onAddLetter={handleAddLoveLetter}
              onLikeLetter={handleLikeLetter}
              isAdmin={isAdmin}
              onDeleteLetter={handleDeleteLoveLetter}
              onReplyLetter={handleReplyLoveLetter}
            />
          )}

          {currentRoute === 'feedback' && (
            <FeedbackPage
              characters={characters}
              userProfile={profile}
              onNavigateCharacter={handleSelectCharacter}
            />
          )}

          {currentRoute === 'playlist' && (
            <PlaylistPage
              playlist={playlist}
              currentTrackIndex={currentTrackIndex}
              isPlaying={isPlaying}
              playTrack={playTrack}
              togglePlay={togglePlay}
              isAdmin={isAdmin}
              onAddTrack={handleSavePlaylistTrack}
              onDeleteTrack={handleDeletePlaylistTrack}
            />
          )}

          {currentRoute === 'gallery' && (
            <GalleryPage
              galleryItems={galleryItems}
              isAdmin={isAdmin}
              onLikeImage={handleLikeImage}
              onAddImage={handleSaveGalleryItem}
              onDeleteImage={handleDeleteGalleryItem}
            />
          )}

          {currentRoute === 'other-spaces' && (
            <OtherSpacesHub
              tarotCards={tarotCards}
              quotes={quotes}
              onLikeQuote={handleLikeQuote}
            />
          )}

          {currentRoute === 'minigame' && (
            <MinigamePage />
          )}

          {currentRoute === 'ranking' && (
            <RankingPage />
          )}

          {currentRoute === 'admin' && (
            <AdminPage
              characters={characters}
              playlist={playlist}
              galleryItems={galleryItems}
              loveLetters={loveLetters}
              tarotCards={tarotCards}
              quotes={quotes}
              onSaveCharacter={handleSaveCharacter}
              onDeleteCharacter={handleDeleteCharacter}
              onCharactersUpdated={() => setCharacters(StorageService.getCharacters())}
              onSavePlaylistTrack={handleSavePlaylistTrack}
              onDeletePlaylistTrack={handleDeletePlaylistTrack}
              onSaveGalleryItem={handleSaveGalleryItem}
              onDeleteGalleryItem={handleDeleteGalleryItem}
              onReplyLoveLetter={handleReplyLoveLetter}
              onDeleteLoveLetter={handleDeleteLoveLetter}
              onResetSeedData={handleResetSeedData}
              onLogoutAdmin={handleLogoutAdmin}
            />
          )}
        </main>

        {/* Footer (Hidden on home landing screen) */}
        {currentRoute !== 'home' && (
          <Footer
            navigate={navigate}
            isAdmin={isAdmin}
          />
        )}

        {/* Bottom Floating Music Player Bar */}
        <MusicPlayerBar
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          progress={progress}
          duration={duration}
          volume={volume}
          isMuted={isMuted}
          isShuffle={isShuffle}
          isRepeat={isRepeat}
          isExpanded={isExpanded}
          togglePlay={togglePlay}
          handleNext={handleNext}
          handlePrev={handlePrev}
          seek={seek}
          setVolume={setVolume}
          setIsMuted={setIsMuted}
          setIsShuffle={setIsShuffle}
          setIsRepeat={setIsRepeat}
          setIsExpanded={setIsExpanded}
          playlist={playlist}
          playTrack={playTrack}
        />

        {/* Route Transition Loading Screen (Only active during intentional navigation) */}
        <LoadingScreen
          isLoading={isRouteTransitioning}
          onComplete={() => setIsRouteTransitioning(false)}
        />

        {/* Global Toast Notification Container */}
        <ToastContainer />

        {/* User Profile Modal (With Virtual Email & Admin Discovery) */}
        <UserProfileModal
          isOpen={userProfileModalOpen}
          onClose={() => setUserProfileModalOpen(false)}
          profile={profile}
          onUpdateProfile={updateProfile}
          giftHistory={giftHistory}
          mailbox={mailbox}
          onAdminLoginSuccess={handleAdminLoginSuccess}
        />

        {/* Add/Edit Character Modal (Triggered by + or Admin Edit) */}
        <CharacterFormModal
          isOpen={addCharacterModalOpen}
          onClose={() => setAddCharacterModalOpen(false)}
          characterToEdit={selectedCharacter}
          onSave={(char) => {
            handleSaveCharacter(char);
            setAddCharacterModalOpen(false);
          }}
        />

      </div>
    </div>
  );
}
