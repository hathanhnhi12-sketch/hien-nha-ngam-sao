import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = (props) => {
  const {
    label,
    error,
    helperText,
    icon,
    className = '',
    id,
    type,
    ...rest
  } = props;

  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const isFileInput = type === 'file';
  const isControlled = 'value' in props;
  
  const inputProps = { ...rest, type };
  if (isControlled && !isFileInput) {
    inputProps.value = props.value ?? '';
  }

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-slate-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full ${icon ? 'pl-9' : 'pl-3.5'} pr-3.5 py-2 text-sm bg-white/70 dark:bg-slate-900/70 border ${
            error
              ? 'border-rose-400 focus:ring-rose-400'
              : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-amber-400'
          } rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-amber-400/20 backdrop-blur-sm transition-all ${className}`}
          {...inputProps}
        />
      </div>
      {error ? (
        <p className="text-xs text-rose-500">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea: React.FC<TextareaProps> = (props) => {
  const {
    label,
    error,
    helperText,
    className = '',
    id,
    ...rest
  } = props;

  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const isControlled = 'value' in props;
  
  const inputProps = { ...rest };
  if (isControlled) {
    inputProps.value = props.value ?? '';
  }

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`w-full px-3.5 py-2.5 text-sm bg-white/70 dark:bg-slate-900/70 border ${
          error
            ? 'border-rose-400 focus:ring-rose-400'
            : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-amber-400'
        } rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-amber-400/20 backdrop-blur-sm transition-all resize-y ${className}`}
        {...inputProps}
      />
      {error ? (
        <p className="text-xs text-rose-500">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
};
