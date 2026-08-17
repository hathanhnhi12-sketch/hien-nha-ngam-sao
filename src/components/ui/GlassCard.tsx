import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glow' | 'subtle' | 'porch' | 'solid';
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  variant = 'default',
  hoverEffect = false,
  ...props
}) => {
  let baseStyle = 'rounded-2xl backdrop-blur-md transition-all duration-300 ';

  switch (variant) {
    case 'glow':
      baseStyle += 'bg-white/10 dark:bg-slate-900/60 border border-amber-300/30 dark:border-amber-400/25 shadow-lg shadow-amber-500/10 ';
      break;
    case 'subtle':
      baseStyle += 'bg-white/40 dark:bg-slate-900/40 border border-white/40 dark:border-slate-800/60 shadow-sm ';
      break;
    case 'porch':
      baseStyle += 'bg-gradient-to-b from-indigo-950/70 to-slate-950/80 dark:from-slate-900/80 dark:to-indigo-950/90 border border-indigo-400/20 text-white shadow-xl ';
      break;
    case 'solid':
      baseStyle += 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md ';
      break;
    default:
      baseStyle += 'bg-white/60 dark:bg-slate-900/50 border border-white/60 dark:border-slate-700/40 shadow-md ';
      break;
  }

  if (hoverEffect) {
    baseStyle += 'hover:-translate-y-1 hover:shadow-xl hover:border-indigo-400/40 dark:hover:border-amber-400/40 cursor-pointer ';
  }

  return (
    <div className={`${baseStyle} ${className}`} {...props}>
      {children}
    </div>
  );
};
