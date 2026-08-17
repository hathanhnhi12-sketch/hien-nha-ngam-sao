import React from 'react';
import { ItemRarity, CharacterStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'status' | 'rarity' | 'gold' | 'tag';
  status?: CharacterStatus;
  rarity?: ItemRarity;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  status,
  rarity,
  className = ''
}) => {
  let style = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide ';

  if (variant === 'status' && status) {
    switch (status) {
      case 'open':
        style += 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 ';
        break;
      case 'updating':
        style += 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30 ';
        break;
      case 'unreleased':
        style += 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30 animate-pulse ';
        break;
    }
  } else if (variant === 'rarity' && rarity) {
    switch (rarity) {
      case 'common':
        style += 'bg-slate-500/15 text-slate-600 dark:text-slate-300 border border-slate-400/30 ';
        break;
      case 'uncommon':
        style += 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-400/30 ';
        break;
      case 'rare':
        style += 'bg-blue-500/15 text-blue-600 dark:text-blue-300 border border-blue-400/30 ';
        break;
      case 'epic':
        style += 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-400/30 ';
        break;
      case 'legendary':
        style += 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-400/30 ';
        break;
      case 'celestial':
        style += 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-600 dark:text-pink-300 border border-pink-400/40 shadow-sm ';
        break;
    }
  } else if (variant === 'gold') {
    style += 'bg-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-400/40 ';
  } else if (variant === 'tag') {
    style += 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/40 ';
  } else {
    style += 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 ';
  }

  return (
    <span className={`${style} ${className}`}>
      {children}
    </span>
  );
};
