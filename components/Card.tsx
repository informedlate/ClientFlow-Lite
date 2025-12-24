import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    elevated?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ children, elevated = false, className, ...props }, ref) => {
          const baseStyles = 'rounded-lg border border-slate-700 bg-slate-800';
          const elevatedStyle = elevated ? 'shadow-lg' : '';

      return (
              <div
                        ref={ref}
                        className={`${baseStyles} ${elevatedStyle} ${className || ''}`}
                {...props}
                      >
                {children}
              </div>div>
            );
    }
  );

Card.displayName = 'Card';

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ children, className, ...props }, ref) => (
          <div ref={ref} className={`px-6 py-4 border-b border-slate-700 ${className || ''}`} {...props}>
            {children}
          </div>div>
        )
      );

CardHeader.displayName = 'CardHeader';

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
    ({ children, className, ...props }, ref) => (
          <div ref={ref} className={`px-6 py-4 ${className || ''}`} {...props}>
            {children}
          </div>div>
        )
      );

CardBody.displayName = 'CardBody';

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
    ({ children, className, ...props }, ref) => (
          <div
                  ref={ref}
                  className={`px-6 py-4 border-t border-slate-700 bg-slate-900 rounded-b-lg ${className || ''}`}
            {...props}
                >
            {children}
          </div>div>
        )
      );

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardBody, CardFooter };</div>
