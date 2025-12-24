import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    fullWidth?: boolean;
    children: React.ReactNode;
}

const variantStyles = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white border-0',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-white border-0',
    danger: 'bg-red-600 hover:bg-red-700 text-white border-0',
    ghost: 'bg-transparent hover:bg-slate-700 text-slate-300 border border-slate-600',
};

const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
      {
              variant = 'primary',
              size = 'md',
              isLoading = false,
              fullWidth = false,
              disabled,
              children,
              className,
              ...props
      },
          ref
        ) => {
              const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed';
              const widthStyle = fullWidth ? 'w-full' : '';
              const variantStyle = variantStyles[variant];
              const sizeStyle = sizeStyles[size];

      return (
              <button
                        ref={ref}
                        disabled={disabled || isLoading}
                        className={`${baseStyles} ${variantStyle} ${sizeStyle} ${widthStyle} ${className || ''}`}
                {...props}
                      >
                {isLoading && (
                                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                              <path
                                                              className="opacity-75"
                                                              fill="currentColor"
                                                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                            />
                                  </svg>svg>
                      )}
                {children}
              </button>button>
            );
        }
  );

Button.displayName = 'Button';

export default Button;</button>
