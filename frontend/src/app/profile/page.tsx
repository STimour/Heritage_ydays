'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getToken } from '@/lib/api/auth';
import { usersApi, type UserProfile, type LibraryStory } from '@/lib/api/users';
import { storiesApi } from '@/lib/api/stories';
import Sidebar from '@/components/layout/Sidebar';

/* ── Theme colors (same as StoryCard) ── */
const THEME_COLOR: Record<string, string> = {
  ROMANCE: '#E6A8D9', COMEDY: '#E6A8D9',
  DRAMA: '#6481DC', THRILLER: '#6481DC', MYSTERY: '#6481DC', SCI_FI: '#6481DC',
  ADVENTURE: '#AFE391', FANTASY: '#AFE391', OTHER: '#AFE391',
  HORROR: '#F37E40',
};
const FALLBACK = ['#6481DC', '#E6A8D9', '#AFE391', '#F37E40'];

function relativeDate(dateStr: string): string {
  const d = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (d === 0) return "Aujourd'hui";
  if (d === 1) return 'Hier';
  if (d < 7) return `Il y a ${d} jours`;
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
}

function initials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

/* ── Stat card ── */
function StatCard({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="flex flex-col gap-2 bg-white px-6 pt-5 pb-4 flex-1">
      <span className="text-[32px] font-bold text-[#22221F] leading-none" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
        {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
      </span>
      <span className="text-[12px] font-medium text-[#585852]" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
        {label}
      </span>
    </div>
  );
}

/* ── Mini story card (264×389) ── */
function LibraryCard({ story, authorName }: { story: LibraryStory; authorName: string }) {
  const coverColor = story.mainTheme && THEME_COLOR[story.mainTheme]
    ? THEME_COLOR[story.mainTheme]
    : FALLBACK[story.id % FALLBACK.length];

  return (
    <Link
      href={`/stories/${story.id}`}
      className="flex flex-col bg-white rounded-[16px] overflow-hidden hover:shadow-md transition-shadow"
      style={{ fontFamily: 'var(--font-body), sans-serif', width: '264px', flexShrink: 0 }}
    >
      {/* Cover */}
      <div className="h-[150px] w-full shrink-0" style={{ backgroundColor: coverColor }} />

      {/* Body */}
      <div className="flex flex-col gap-3 px-4 pt-[13px]">
        <div className="flex items-center justify-between">
          {story.tags?.[0] && (
            <span className="text-[12px] font-medium px-[10px] py-[4px] rounded-full"
              style={{ backgroundColor: '#E7F2FF', color: '#2D4AA3' }}>
              {story.tags[0]}
            </span>
          )}
          <span className="text-[10px] font-medium text-[#585852] ml-auto">
            {relativeDate(story.createdAt)}
          </span>
        </div>
        <h3 className="text-[18px] font-medium text-[#22221F] leading-snug line-clamp-2"
          style={{ fontFamily: 'var(--font-display), sans-serif' }}>
          {story.title}
        </h3>
        <p className="text-[12px] text-[#585852] leading-[18px] line-clamp-3">
          {story.preview}
        </p>
      </div>

      {/* Divider */}
      <div className="mx-4 mt-4 h-px bg-[#E5E3D5]" />

      {/* Footer */}
      <div className="mx-4 my-[13px] flex items-center justify-between">
        <span className="text-[12px] font-medium text-[#22221F]" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
          {authorName}
        </span>
        <span className="text-[10px] font-medium text-[#22221F] flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22221F" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          {story.saveCount}
        </span>
      </div>
    </Link>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stories, setStories] = useState<LibraryStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) { router.replace('/login'); return; }
    Promise.all([
      usersApi.getMe(),
      storiesApi.getLibrary(0, 4),
    ]).then(([prof, lib]) => {
      setProfile(prof);
      setStories(lib.content);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#FBFAF4]">
        <Sidebar />
        <div className="flex-1 animate-pulse p-12 flex flex-col gap-6">
          <div className="h-10 w-48 bg-[#E5E3D5] rounded" />
          <div className="h-[220px] bg-[#E5E3D5] rounded-[16px]" />
          <div className="flex gap-5">
            {[1,2,3,4].map(i => <div key={i} className="flex-1 h-[100px] bg-[#E5E3D5] rounded" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const ini = initials(profile.displayName);

  return (
    <div className="flex min-h-screen bg-[#FBFAF4]" style={{ fontFamily: 'var(--font-body), sans-serif' }}>
      <Sidebar />

      {/* ── Content ── */}
      <div className="flex-1 px-12 pt-[48px] pb-16">

        {/* Header */}
        <h1 className="text-[40px] font-medium text-[#22221F] mb-[14px]"
          style={{ fontFamily: 'var(--font-display), sans-serif' }}>
          Mon profil
        </h1>
        <p className="text-[16px] font-normal text-[#22221F] mb-[36px]">
          Votre espace personnel, vos récits et votre héritage.
        </p>

        {/* Cover banner */}
        <div className="relative w-full h-[220px] bg-[#E5E3D5] rounded-[16px] mb-5 flex items-center px-5">
          {/* Avatar */}
          <div className="w-[140px] h-[140px] rounded-full bg-[#22221F] flex items-center justify-center shrink-0 overflow-hidden">
            {profile.photo ? (
              <img src={profile.photo} alt={profile.displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[48px] font-bold text-[#FBFAF4]"
                style={{ fontFamily: 'var(--font-display), sans-serif' }}>
                {ini}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="ml-6 flex flex-col gap-1">
            <span className="text-[32px] font-medium text-[#22221F]"
              style={{ fontFamily: 'var(--font-display), sans-serif' }}>
              {profile.displayName}
            </span>
            {profile.pseudo && (
              <span className="text-[14px] font-medium text-[#585852]">
                @{profile.pseudo}
              </span>
            )}
          </div>

          {/* Edit button */}
          <Link
            href="/settings"
            className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center justify-center px-6 h-[48px] bg-[#22221F] rounded-[8px] text-[14px] font-medium text-[#FBFAF4] hover:opacity-90 transition-opacity"
            style={{ fontFamily: 'var(--font-display), sans-serif' }}
          >
            Modifier le profil
          </Link>
        </div>

        {/* Stats */}
        <div className="flex gap-5 mb-10">
          <StatCard value={profile.storyCount}  label="Récits publiés" />
          <StatCard value={profile.savedCount}  label="Sauvegardes reçues" />
          <StatCard value={profile.folderCount} label="Groupes rejoints" />
          <StatCard value={0}                   label="Abonnés" />
        </div>

        {/* Section header */}
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-[24px] font-medium text-[#22221F]"
            style={{ fontFamily: 'var(--font-display), sans-serif' }}>
            Mes derniers récits
          </h2>
          <Link href="/library"
            className="text-[14px] font-medium text-[#6481DC] hover:underline">
            Voir tout →
          </Link>
        </div>

        {/* Story cards grid */}
        {stories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <p className="text-[16px] text-[#585852]">Vous n&apos;avez pas encore de récits.</p>
            <Link href="/stories/new"
              className="text-[14px] font-medium text-[#6481DC] hover:underline">
              Écrire votre premier récit →
            </Link>
          </div>
        ) : (
          <div className="flex gap-6">
            {stories.map(s => (
              <LibraryCard key={s.id} story={s} authorName={profile.displayName} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
