import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helpText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helpText, className, ...props }, ref) => {
          const baseStyles = 'w-full px-4 py-2 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition';
          const borderStyle = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : 'border-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20';

      return (
              <div className="flex flex-col gap-1">
                {label && <label className="text-sm font-medium text-slate-300">{label}</label>label>}
                      <input
                                  ref={ref}
                                  className={`${baseStyles} ${borderStyle} ${className || ''}`}
                        {...props}
                                />
                {error && <span className="text-xs text-red-400">{error}</span>span>}
                {helpText && !error && <span className="text-xs text-slate-400">{helpText}</span>span>}
              </div>div>
            );
    }
  );

Input.displayName = 'Input';

export default Input;</div>
