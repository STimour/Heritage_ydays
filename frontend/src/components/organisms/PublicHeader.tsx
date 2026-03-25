/**
 * Landing Page Header / Navigation
 */

import Link from 'next/link';
import { Button } from '@/components/atoms/Button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Héritage
          </span>
        </Link>
        <nav className="flex gap-4 items-center">
          <Link href="/login">
            <Button variant="outline" size="sm">
              Connexion
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">
              S&apos;inscrire
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
