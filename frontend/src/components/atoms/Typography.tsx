/**
 * Typography components
 */

import { ReactNode } from 'react';

interface TypographyProps {
  children: ReactNode;
  className?: string;
}

export function H1({ children, className = '' }: TypographyProps) {
  return (
    <h1 className={`text-4xl md:text-5xl font-bold text-slate-900 ${className}`}>
      {children}
    </h1>
  );
}

export function H2({ children, className = '' }: TypographyProps) {
  return (
    <h2 className={`text-3xl md:text-4xl font-bold text-slate-900 ${className}`}>
      {children}
    </h2>
  );
}

export function H3({ children, className = '' }: TypographyProps) {
  return (
    <h3 className={`text-2xl font-bold text-slate-900 ${className}`}>
      {children}
    </h3>
  );
}

export function P({ children, className = '' }: TypographyProps) {
  return (
    <p className={`text-base text-slate-700 leading-relaxed ${className}`}>
      {children}
    </p>
  );
}

export function Small({ children, className = '' }: TypographyProps) {
  return (
    <p className={`text-sm text-slate-600 ${className}`}>
      {children}
    </p>
  );
}
