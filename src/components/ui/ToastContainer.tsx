import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '../../stores/useToastStore';
import { Sparkles, CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-2">
      <AnimatePresence>
        {toasts.map(toast => {
          let icon = <Info className="w-4 h-4 text-sky-400" />;
          let border = 'border-slate-300/40 dark:border-slate-700/60';

          if (toast.type === 'success') {
            icon = <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
            border = 'border-emerald-500/30';
          } else if (toast.type === 'error') {
            icon = <AlertCircle className="w-4 h-4 text-rose-400" />;
            border = 'border-rose-500/30';
          } else if (toast.type === 'star') {
            icon = <Sparkles className="w-4 h-4 text-amber-300" />;
            border = 'border-amber-400/40 shadow-amber-500/10';
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 ${border} border shadow-xl backdrop-blur-md text-slate-800 dark:text-slate-100 text-xs font-medium`}
            >
              <div className="flex items-center gap-2.5">
                <span className="shrink-0">{icon}</span>
                <span className="leading-snug">{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 p-1 text-slate-400 hover:text-slate-200 rounded-full hover:bg-slate-800/40"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center my-6 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-dashed border-indigo-200/50 dark:border-indigo-500/20 backdrop-blur-sm">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-500 dark:text-amber-300 mb-3 shadow-inner">
        {icon || <Sparkles className="w-6 h-6" />}
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mb-4 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};
