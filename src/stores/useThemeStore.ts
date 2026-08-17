import { useState, useEffect } from 'react';
import { ThemeMode, DisplayMode, SkyBackgroundTheme } from '../types';

const THEME_KEY = 'hien_nha_theme_mode';
const DISPLAY_KEY = 'hien_nha_display_mode';
const SKY_THEME_KEY = 'hien_nha_sky_bg_theme';

export function useThemeStore() {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem(THEME_KEY) as ThemeMode) || 'dark';
  });

  const [displayMode, setDisplayModeState] = useState<DisplayMode>(() => {
    return (localStorage.getItem(DISPLAY_KEY) as DisplayMode) || 'auto';
  });

  const [skyTheme, setSkyThemeState] = useState<SkyBackgroundTheme>(() => {
    return (localStorage.getItem(SKY_THEME_KEY) as SkyBackgroundTheme) || 'default';
  });

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(DISPLAY_KEY, displayMode);
  }, [displayMode]);

  useEffect(() => {
    localStorage.setItem(SKY_THEME_KEY, skyTheme);
  }, [skyTheme]);

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setDisplayMode = (mode: DisplayMode) => {
    setDisplayModeState(mode);
  };

  const setSkyTheme = (st: SkyBackgroundTheme) => {
    setSkyThemeState(st);
  };

  return {
    theme,
    toggleTheme,
    displayMode,
    setDisplayMode,
    skyTheme,
    setSkyTheme,
    backgroundTheme: skyTheme,
    setBackgroundTheme: setSkyTheme
  };
}
