import React from 'react';
import { GlassCard } from './GlassCard';
import { Button } from './Button';
import { Sparkles } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <GlassCard className={`p-8 sm:p-12 text-center max-w-md mx-auto space-y-4 ${className}`} variant="subtle">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/10 dark:bg-amber-400/10 border border-indigo-500/20 dark:border-amber-400/20 flex items-center justify-center text-3xl shadow-inner">
        {icon || <Sparkles className="w-8 h-8 text-amber-400" />}
      </div>
      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">{description}</p>
      </div>
      {actionText && onAction && (
        <div className="pt-2">
          <Button variant="gold" size="sm" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </GlassCard>
  );
};
