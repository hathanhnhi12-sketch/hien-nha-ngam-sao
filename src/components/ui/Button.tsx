import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold' | 'soft';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  disabled,
  ...props
}) => {
  let baseStyle = 'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] ';

  switch (size) {
    case 'sm':
      baseStyle += 'text-xs px-3 py-1.5 rounded-xl gap-1.5 ';
      break;
    case 'lg':
      baseStyle += 'text-base px-6 py-3 rounded-2xl gap-2.5 shadow-md ';
      break;
    default:
      baseStyle += 'text-sm px-4 py-2 rounded-xl gap-2 ';
      break;
  }

  switch (variant) {
    case 'primary':
      baseStyle += 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-500/20 ';
      break;
    case 'gold':
      baseStyle += 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-900 font-semibold shadow-md shadow-amber-500/25 ';
      break;
    case 'secondary':
      baseStyle += 'bg-indigo-50 dark:bg-slate-800 text-indigo-900 dark:text-indigo-200 hover:bg-indigo-100 dark:hover:bg-slate-700 border border-indigo-200/50 dark:border-slate-700 ';
      break;
    case 'soft':
      baseStyle += 'bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm ';
      break;
    case 'ghost':
      baseStyle += 'bg-transparent hover:bg-slate-500/10 text-slate-700 dark:text-slate-200 ';
      break;
    case 'danger':
      baseStyle += 'bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/20 ';
      break;
  }

  return (
    <button className={`${baseStyle} ${className}`} disabled={disabled || loading} {...props}>
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children}
    </button>
  );
};
