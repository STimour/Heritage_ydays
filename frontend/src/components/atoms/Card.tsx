/**
 * Card component
 */

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'featured';
  interactive?: boolean;
}

export function Card({
  children,
  className = '',
  variant = 'default',
  interactive = false,
}: CardProps) {
  const baseClasses = 'rounded-lg bg-white border border-slate-200 overflow-hidden';
  const variantClasses = {
    default: 'shadow-sm hover:shadow-md transition-shadow',
    featured: 'shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-slate-50 to-slate-100/50',
  };
  const interactiveClass = interactive ? 'cursor-pointer' : '';

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${interactiveClass} ${className}`}>
      {children}
    </div>
  );
}
