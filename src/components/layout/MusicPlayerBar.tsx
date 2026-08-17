import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Volume2, VolumeX, Maximize2, Minimize2, Music } from 'lucide-react';
import { PlaylistItem } from '../../types';

interface MusicPlayerBarProps {
  currentTrack: PlaylistItem;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  isRepeat: boolean;
  isExpanded: boolean;
  togglePlay: () => void;
  handleNext: () => void;
  handlePrev: () => void;
  seek: (seconds: number) => void;
  setVolume: (vol: number) => void;
  setIsMuted: (muted: boolean) => void;
  setIsShuffle: () => void;
  setIsRepeat: () => void;
  setIsExpanded: (exp: boolean) => void;
  playlist: PlaylistItem[];
  playTrack: (index: number) => void;
}

export const MusicPlayerBar: React.FC<MusicPlayerBarProps> = ({
  currentTrack,
  isPlaying,
  progress,
  duration,
  volume,
  isMuted,
  isShuffle,
  isRepeat,
  isExpanded,
  togglePlay,
  handleNext,
  handlePrev,
  seek,
  setVolume,
  setIsMuted,
  setIsShuffle,
  setIsRepeat,
  setIsExpanded,
  playlist,
  playTrack
}) => {
  if (!currentTrack) return null;

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <>
      {/* Expanded Deck View */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-gradient-to-b from-indigo-950/80 to-slate-900/90 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-6">
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
            >
              <Minimize2 className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <span className="text-xs text-amber-300 font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
                <Music className="w-3.5 h-3.5" /> Giai Điệu Dưới Mái Hiên
              </span>
              <h3 className="text-xl font-bold">{currentTrack.title}</h3>
              <p className="text-xs text-slate-400">{currentTrack.artist}</p>
            </div>

            {/* Vinyl spinning disc */}
            <div className="flex justify-center my-4">
              <div className={`relative w-44 h-44 sm:w-56 sm:h-56 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-purple-600 to-indigo-600 shadow-2xl ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '18s' }}>
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover rounded-full border-4 border-slate-900"
                />
                <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                </div>
              </div>
            </div>

            {/* Progress Slider */}
            <div className="space-y-1.5">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={progress}
                onChange={(e) => seek(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={setIsShuffle}
                className={`p-2 rounded-full transition-colors ${isShuffle ? 'text-amber-300 bg-amber-400/20' : 'text-slate-400 hover:text-white'}`}
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                onClick={handlePrev}
                className="p-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={togglePlay}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold flex items-center justify-center shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-transform"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-slate-950" /> : <Play className="w-6 h-6 fill-slate-950 ml-1" />}
              </button>

              <button
                onClick={handleNext}
                className="p-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              <button
                onClick={setIsRepeat}
                className={`p-2 rounded-full transition-colors ${isRepeat ? 'text-amber-300 bg-amber-400/20' : 'text-slate-400 hover:text-white'}`}
              >
                <Repeat className="w-4 h-4" />
              </button>
            </div>

            {/* Volume control */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button onClick={() => setIsMuted(!isMuted)} className="text-slate-400 hover:text-white">
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-28 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Mini-Player */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30 w-[95%] max-w-2xl">
        <div className="relative flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/90 dark:bg-slate-950/90 border border-indigo-500/30 shadow-2xl backdrop-blur-xl text-white">
          
          {/* Track Info */}
          <div className="flex items-center gap-3 min-w-0 max-w-[45%]">
            <div className={`relative w-10 h-10 rounded-xl overflow-hidden shrink-0 ring-1 ring-amber-400/50 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '14s' }}>
              <img src={currentTrack.coverUrl} alt={currentTrack.title} className="w-full h-full object-cover" />
            </div>
            <div className="truncate">
              <h4 className="text-xs font-bold truncate text-slate-100">{currentTrack.title}</h4>
              <p className="text-[10px] text-slate-400 truncate">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Core Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handlePrev}
              className="hidden sm:block p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition-transform"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950 ml-0.5" />}
            </button>

            <button
              onClick={handleNext}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Right Expand button */}
          <div className="flex items-center gap-2">
            <span className="hidden md:block text-[10px] text-slate-400 font-mono">
              {formatTime(progress)} / {formatTime(duration)}
            </span>
            <button
              onClick={() => setIsExpanded(true)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Mở rộng trình phát nhạc"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thin bottom progress line */}
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-800 rounded-b-2xl overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-amber-400"
              style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
