/**
 * App Shell - Sidebar Navigation for Desktop
 */

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/atoms/Avatar';
import { Button } from '@/components/atoms/Button';
import {
  Home,
  BookOpen,
  Bookmark,
  Users,
  Settings,
  LogOut,
  PlusCircle,
  LayoutDashboard,
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const menuItems = [
    { href: '/app/discover', icon: Home, label: 'Découvrir', mobile: false },
    { href: '/app/library', icon: BookOpen, label: 'Ma bibliothèque', mobile: false },
    { href: '/app/saved', icon: Bookmark, label: 'Sauvegardes', mobile: false },
    { href: '/app/groups', icon: Users, label: 'Groupes', mobile: false },
    { href: '/app/network', icon: Users, label: 'Mon réseau', mobile: false },
    { href: '/app/profile', icon: Settings, label: 'Profil', mobile: false },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href);

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar - Desktop only */}
      <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-slate-200 shadow-sm">
        {/* Logo */}
        <div className="p-6 border-b border-slate-200">
          <Link href="/app/discover" className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Héritage
            </span>
          </Link>
        </div>

        {/* Main Menu */}
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Info */}
        <div className="border-t border-slate-200 p-6 space-y-4">
          {user && (
            <div className="flex items-center gap-3">
              <Avatar src={user.photo} size="md" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 truncate">{user.displayName}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
          )}
          <Button
            variant="danger"
            size="sm"
            fullWidth
            onClick={handleLogout}
            className="flex items-center justify-center gap-2"
          >
            <LogOut size={16} />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <Link href="/app/discover" className="text-xl font-bold">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Héritage
            </span>
          </Link>
          <Link href="/app/profile">
            <Avatar src={user?.photo} size="sm" />
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden bg-white border-t border-slate-200 px-4 py-2 flex justify-around">
          {menuItems.slice(0, 5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 px-3 text-xs font-medium rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'text-blue-600'
                  : 'text-slate-600'
              }`}
            >
              <item.icon size={24} />
              {/* Icon only on mobile */}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
