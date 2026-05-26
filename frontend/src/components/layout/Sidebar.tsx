'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearToken } from '@/lib/api/auth';

/* ── Icônes SVG inline (Lucide style, stroke=2) ── */
function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#22221F' : '#585852'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function BookmarkIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#22221F' : '#585852'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function BookIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#22221F' : '#585852'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}
function UsersIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#22221F' : '#585852'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function UserIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#22221F' : '#585852'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function PencilIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FBFAF4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}
function PencilNavIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#22221F' : '#585852'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}
const NAV_ITEMS = [
  { href: '/feed',          label: 'Accueil',         Icon: HomeIcon },
  { href: '/saves',         label: 'Mes sauvegardes', Icon: BookmarkIcon },
  { href: '/library',       label: 'Ma bibliothèque', Icon: BookIcon },
  { href: '/groups',        label: 'Mes groupes',     Icon: UsersIcon },
  { href: '/profile',       label: 'Mon profil',      Icon: UserIcon },
] as const;

const MOBILE_NAV_ITEMS = [
  { href: '/feed',        label: 'Accueil',     Icon: HomeIcon },
  { href: '/library',     label: 'Biblio',      Icon: BookIcon },
  { href: '/saves',       label: 'Sauvegardes', Icon: BookmarkIcon },
  { href: '/groups',      label: 'Groupes',     Icon: UsersIcon },
  { href: '/stories/new', label: 'Écrire',      Icon: PencilNavIcon },
  { href: '/profile',     label: 'Profil',      Icon: UserIcon },
] as const;

function LogoLink({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <Link
      href="/feed"
      aria-label="Accueil Héritage"
      className={
        collapsed
          ? 'w-10 h-10 flex items-center justify-center mb-8'
          : 'w-[80px] h-[80px] flex items-center justify-center'
      }
    >
      <img
        src="/icons/icon-192x192.svg"
        alt="Héritage"
        className={collapsed ? 'w-7 h-7 object-contain' : 'w-14 h-14 object-contain'}
      />
    </Link>
  );
}

function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-6 border-t border-[#E5E3D5] bg-[#FBFAF4]/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(34,34,31,0.08)] backdrop-blur lg:hidden"
      style={{ fontFamily: 'var(--font-display), sans-serif' }}
    >
      {MOBILE_NAV_ITEMS.map(({ href, label, Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            className={`flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-[8px] text-[10px] font-medium transition-colors ${
              active ? 'text-[#22221F]' : 'text-[#585852]'
            }`}
          >
            <Icon active={active} />
            <span className="max-w-full truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function Sidebar({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname();
  const router   = useRouter();

  function handleLogout() {
    clearToken();
    router.push('/login');
  }

  if (collapsed) {
    return (
      <>
      <MobileNav />
      <aside
        className="hidden lg:flex flex-col items-center w-[96px] shrink-0 min-h-screen bg-[#FBFAF4] border-r border-[#E5E3D5] py-6"
        style={{ fontFamily: 'var(--font-body), sans-serif' }}
      >
        {/* Expand button */}
        <Link href="/feed" className="w-10 h-10 bg-white rounded-[8px] flex items-center justify-center hover:bg-[#E5E3D5] transition-colors mb-6">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#22221F" strokeWidth="2" strokeLinecap="round">
            <rect x="1" y="1" width="16" height="16" rx="2" />
            <line x1="6" y1="1" x2="6" y2="17" />
          </svg>
        </Link>

        {/* Logo */}
        <LogoLink collapsed />

        {/* Nav icons */}
        <nav className="flex flex-col gap-5">
          {NAV_ITEMS.map(({ href, Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`w-10 h-10 flex items-center justify-center rounded-[8px] transition-colors ${
                  active ? 'bg-[#E5E3D5]' : 'hover:bg-[#E5E3D5]/60'
                }`}
              >
                <Icon active={active} />
              </Link>
            );
          })}
        </nav>

        {/* CTA pencil */}
        <div className="mt-auto">
          <Link
            href="/stories/new"
            className="w-12 h-12 flex items-center justify-center bg-[#6481DC] rounded-[8px] hover:opacity-90 transition-opacity"
          >
            <PencilIcon />
          </Link>
        </div>
      </aside>
      </>
    );
  }

  return (
    <>
    <MobileNav />
    <aside
      className="hidden lg:flex flex-col w-[247px] shrink-0 min-h-screen bg-[#FBFAF4] border-r border-[#E5E3D5]"
      style={{ fontFamily: 'var(--font-body), sans-serif' }}
    >
      {/* ── Top : Logo + collapse ── */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <LogoLink />
        <button className="w-10 h-10 bg-white rounded-[8px] flex items-center justify-center hover:bg-[#E5E3D5] transition-colors">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#22261F" strokeWidth="2" strokeLinecap="round">
            <rect x="1" y="1" width="16" height="16" rx="2" />
            <line x1="6" y1="1" x2="6" y2="17" />
          </svg>
        </button>
      </div>

      {/* ── Nav items ── */}
      <nav className="flex flex-col gap-4 px-6 mt-10">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-2 py-2 rounded-[8px] transition-colors ${
                active
                  ? 'bg-[#E5E3D5]'
                  : 'hover:bg-[#E5E3D5]/60'
              }`}
            >
              <Icon active={active} />
              <span
                className={`text-[16px] font-medium leading-none ${
                  active ? 'text-[#22221F]' : 'text-[#585852]'
                }`}
                style={{ fontFamily: 'var(--font-display), sans-serif' }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* ── CTA "Écrire un récit" ── */}
      <div className="mt-auto px-6 pb-8">
        <button
          onClick={handleLogout}
          className="w-full text-[13px] text-[#585852] hover:text-[#22221F] mb-4 text-left transition-colors"
        >
          Se déconnecter
        </button>
        <Link
          href="/stories/new"
          className="flex items-center gap-2 px-6 py-3 bg-[#6481DC] rounded-[8px] hover:opacity-90 transition-opacity"
        >
          <PencilIcon />
          <span
            className="text-[16px] font-medium text-white"
            style={{ fontFamily: 'var(--font-display), sans-serif' }}
          >
            Écrire un récit
          </span>
        </Link>
      </div>
    </aside>
    </>
  );
}
