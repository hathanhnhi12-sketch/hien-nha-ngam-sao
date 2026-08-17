import { useState, useEffect, useRef } from 'react';
import { PlaylistItem } from '../types';
import { StorageService } from '../services/storageService';

export function usePlayerStore() {
  const [playlist, setPlaylist] = useState<PlaylistItem[]>(() => StorageService.getPlaylist());
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.7);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = playlist[currentTrackIndex] || playlist[0];

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.volume = volume;

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        handleNext();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const wasPlaying = isPlaying;
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.load();
      if (wasPlaying) {
        audioRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current.src || audioRef.current.src === '') {
        audioRef.current.src = currentTrack.audioUrl;
      }
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn('Audio autoplay blocked or stream error:', err);
        setIsPlaying(false);
      });
    }
  };

  const playTrack = (index: number) => {
    if (index >= 0 && index < playlist.length) {
      setCurrentTrackIndex(index);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = playlist[index].audioUrl;
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  };

  const handleNext = () => {
    if (playlist.length === 0) return;
    if (isShuffle) {
      const nextIdx = Math.floor(Math.random() * playlist.length);
      playTrack(nextIdx);
    } else {
      const nextIdx = (currentTrackIndex + 1) % playlist.length;
      playTrack(nextIdx);
    }
  };

  const handlePrev = () => {
    if (playlist.length === 0) return;
    const prevIdx = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    playTrack(prevIdx);
  };

  const seek = (timeInSeconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = timeInSeconds;
      setProgress(timeInSeconds);
    }
  };

  const refreshPlaylist = () => {
    setPlaylist(StorageService.getPlaylist());
  };

  return {
    playlist,
    setPlaylist,
    currentTrack,
    currentTrackIndex,
    isPlaying,
    progress,
    duration,
    volume,
    isMuted,
    isShuffle,
    isRepeat,
    isExpanded,
    togglePlay,
    playTrack,
    handleNext,
    handlePrev,
    seek,
    setVolume,
    setIsMuted,
    setIsShuffle: () => setIsShuffle(prev => !prev),
    setIsRepeat: () => setIsRepeat(prev => !prev),
    setIsExpanded,
    refreshPlaylist
  };
}
