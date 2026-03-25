/**
 * Layouts and templates for public/protected areas
 */

import { ReactNode } from 'react';

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      {children}
    </div>
  );
}

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-blue-50">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
