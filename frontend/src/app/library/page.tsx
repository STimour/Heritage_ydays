'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getToken } from '@/lib/api/auth';
import { storiesApi, type StoryFeedItem } from '@/lib/api/stories';
import { usersApi, type LibraryStory, type UserProfile } from '@/lib/api/users';
import Sidebar from '@/components/layout/Sidebar';
import StoryCard from '@/components/feed/StoryCard';

/* ── Theme → cover color ── */
const THEME_COVERS: Record<string, string> = {
  ROMANCE:   '#E6A8D9', COMEDY:    '#E6A8D9',
  DRAMA:     '#6481DC', THRILLER:  '#6481DC', MYSTERY:   '#6481DC', SCI_FI: '#6481DC',
  ADVENTURE: '#AFE391', FANTASY:   '#AFE391', OTHER:     '#AFE391',
  HORROR:    '#F37E40',
};
const FALLBACK = ['#6481DC', '#E6A8D9', '#AFE391', '#F37E40'];

function coverColor(story: LibraryStory) {
  if (story.mainTheme && THEME_COVERS[story.mainTheme]) return THEME_COVERS[story.mainTheme];
  return FALLBACK[story.id % FALLBACK.length];
}

function tagLabel(story: LibraryStory) {
  return story.tags?.[0] ?? story.mainTheme ?? 'Récit';
}

function relativeDate(ds: string) {
  const d = Math.floor((Date.now() - new Date(ds).getTime()) / 86400000);
  if (d === 0) return "Aujourd'hui";
  if (d === 1) return 'Hier';
  if (d < 7)   return `Il y a ${d} j`;
  return new Date(ds).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

/* ── Library card (264×389) ── */
function LibraryCard({ story, me }: { story: LibraryStory; me: UserProfile | null }) {
  const color = coverColor(story);

  return (
    <Link
      href={`/stories/${story.id}`}
      className="flex min-w-0 w-full flex-col overflow-hidden rounded-[16px] bg-white transition-shadow hover:shadow-md lg:w-[264px] lg:shrink-0"
    >
      {/* Cover (264×150) */}
      <div className="relative h-[150px] w-full shrink-0 overflow-hidden" style={{ backgroundColor: color }}>
        {/* Blobs */}
        <div className="absolute -right-8 -top-8 w-[150px] h-[150px] rounded-full bg-white/30" />
        <div className="absolute -left-4 bottom-[-20px] w-[90px] h-[90px] rounded-full bg-white/30" />
      </div>

      {/* Body */}
      <div className="flex min-w-0 flex-col gap-[6px] px-4 pt-[13px]">
        {/* Tag + date row */}
        <div className="flex min-w-0 items-center justify-between gap-2">
          <span
            className="text-[12px] font-medium px-[10px] py-[6px] rounded-full"
            style={{ backgroundColor: '#E7F2FF', color: '#2D4AA3', fontFamily: 'var(--font-display), sans-serif' }}
          >
            {tagLabel(story)}
          </span>
          <span className="shrink-0 text-[10px] font-medium text-[#585852]">{relativeDate(story.createdAt)}</span>
        </div>

        {/* Title */}
        <h3
          className="text-[18px] font-medium text-[#22221F] leading-snug line-clamp-2 mt-1"
          style={{ fontFamily: 'var(--font-display), sans-serif' }}
        >
          {story.title}
        </h3>

        {/* Preview */}
        <p className="text-[12px] font-normal text-[#585852] leading-[18px] line-clamp-3">
          {story.preview}
        </p>
      </div>

      {/* Divider */}
      <div className="mx-4 mt-4 h-px bg-[#E5E3D5]" />

      {/* Footer */}
      <div className="mx-4 my-[13px] flex min-w-0 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {/* Avatar */}
          <div className="w-6 h-6 rounded-full bg-[#6481DC] flex items-center justify-center shrink-0">
            <span className="text-[9px] font-bold text-white">
              {me ? me.displayName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() : 'M'}
            </span>
          </div>
          <span className="min-w-0 truncate text-[12px] font-medium text-[#22221F]">
            {me ? me.displayName.split(' ')[0] : 'Moi'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22221F" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          <span className="text-[10px] font-medium text-[#22221F]">{story.saveCount}</span>
        </div>
      </div>
    </Link>
  );
}

/* ── Tabs ── */
const TABS = ['Toutes', 'Favoris', 'À lire plus tard', 'Lu', 'Collections'] as const;
type Tab = typeof TABS[number];

export default function LibraryPage() {
  const router = useRouter();
  const [stories,      setStories]      = useState<LibraryStory[]>([]);
  const [savedStories, setSavedStories] = useState<StoryFeedItem[]>([]);
  const [favLoading,   setFavLoading]   = useState(false);
  const [favLoaded,    setFavLoaded]    = useState(false);
  const [me,           setMe]           = useState<UserProfile | null>(null);
  const [tab,          setTab]          = useState<Tab>('Toutes');
  const [search,       setSearch]       = useState('');
  const [loading,      setLoading]      = useState(true);
  const [total,        setTotal]        = useState(0);

  useEffect(() => {
    if (!getToken()) { router.replace('/login'); return; }
    Promise.all([
      storiesApi.getLibrary(0, 12),
      usersApi.getMe(),
    ]).then(([lib, user]) => {
      setStories(lib.content);
      setTotal(lib.totalElements);
      setMe(user);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    if (tab !== 'Favoris' || favLoaded) return;
    setFavLoading(true);
    storiesApi.getSaved(0, 20)
      .then(data => { setSavedStories(data.content); setFavLoaded(true); })
      .catch(() => {})
      .finally(() => setFavLoading(false));
  }, [tab, favLoaded]);

  const featured = stories[0] ?? null;
  const recent   = stories.slice(0, 4);

  const filtered = search.trim()
    ? stories.filter(s => s.title.toLowerCase().includes(search.toLowerCase()))
    : recent;

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-[#FBFAF4]" style={{ fontFamily: 'var(--font-body), sans-serif' }}>
      <Sidebar />

      <div className="min-w-0 flex-1 px-4 py-6 pb-24 lg:px-12 lg:pt-[48px] lg:pb-16">

        {/* ── Header ── */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 flex-col gap-[14px]">
            <h1 className="text-[32px] font-medium text-[#22221F] lg:text-[40px]"
              style={{ fontFamily: 'var(--font-display), sans-serif' }}>
              Ma bibliothèque
            </h1>
            <p className="text-[16px] font-normal text-[#22221F]">
              Vos collections, vos étagères, vos mondes intérieurs.
            </p>
          </div>

          {/* Search */}
          <div className="flex h-[42px] min-w-0 w-full items-center gap-[7px] rounded-[12px] bg-[#E5E3D5] px-6 lg:w-[436px] lg:shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#585852" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher"
              className="min-w-0 flex-1 bg-transparent text-[16px] font-medium text-[#585852] placeholder:text-[#585852] outline-none"
              style={{ fontFamily: 'var(--font-display), sans-serif' }}
            />
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="mb-8 flex max-w-full gap-2 overflow-x-auto pb-1">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="h-[36px] shrink-0 px-5 rounded-[8px] text-[12px] font-medium transition-colors"
              style={{
                backgroundColor: tab === t ? '#22221F' : '#FFFFFF',
                color: tab === t ? '#FBFAF4' : '#22221F',
                fontFamily: 'var(--font-display), sans-serif',
              }}
            >
              {t}{t === 'Toutes' ? ` · ${total}` : ''}
            </button>
          ))}
        </div>

        {/* ── Favoris tab ── */}
        {tab === 'Favoris' && (
          favLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1,2,3,4].map(i => <div key={i} className="h-[320px] bg-[#E5E3D5] rounded-[16px] animate-pulse" />)}
            </div>
          ) : savedStories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <p className="text-[16px] text-[#585852]">Aucun récit sauvegardé.</p>
              <Link href="/feed" className="text-[14px] text-[#6481DC] hover:underline">
                Explorer le fil →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {savedStories.map(s => <StoryCard key={s.id} story={s} />)}
            </div>
          )
        )}

        {tab !== 'Favoris' && loading ? (
          <div className="animate-pulse flex flex-col gap-8">
            <div className="h-[180px] bg-[#E5E3D5] rounded-[16px]" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:hidden">
              {[1,2,3,4].map(i => <div key={i} className="h-[389px] bg-[#E5E3D5] rounded-[16px]" />)}
            </div>
            <div className="hidden gap-6 lg:grid" style={{ gridTemplateColumns: 'repeat(4, 264px)' }}>
              {[1,2,3,4].map(i => <div key={i} className="h-[389px] bg-[#E5E3D5] rounded-[16px]" />)}
            </div>
          </div>
        ) : tab !== 'Favoris' && (
          <>
            {/* ── Continuer la lecture ── */}
            {featured && (
              <>
                <h2 className="text-[22px] font-medium text-[#22221F] mb-4"
                  style={{ fontFamily: 'var(--font-display), sans-serif' }}>
                  Continuer la lecture
                </h2>
                <div
                  className="relative mb-10 flex min-h-[180px] flex-col gap-5 overflow-hidden rounded-[16px] px-5 py-6 lg:h-[180px] lg:flex-row lg:items-center lg:gap-0 lg:px-0 lg:py-0"
                  style={{ backgroundColor: '#E5E3D5' }}
                >
                  {/* Decorative blob */}
                  <div className="absolute -right-8 -top-12 w-[360px] h-[280px] rounded-full"
                    style={{ backgroundColor: coverColor(featured) + '60' }} />

                  {/* Book cover */}
                  <div
                    className="relative z-10 flex shrink-0 items-center justify-center rounded-[4px] lg:ml-8"
                    style={{ width: 100, height: 132, backgroundColor: '#22221F' }}
                  >
                    <span className="text-[18px] font-bold text-[#FBFAF4]">H.É.</span>
                  </div>

                  {/* Info */}
                  <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-center gap-[6px] lg:ml-7">
                    <span className="text-[11px] font-medium text-[#585852] tracking-wide uppercase">
                      {tagLabel(featured)}
                    </span>
                    <p className="min-w-0 text-[28px] font-medium text-[#22221F] leading-tight line-clamp-1"
                      style={{ fontFamily: 'var(--font-display), sans-serif' }}>
                      {featured.title}
                    </p>
                    <p className="text-[13px] font-normal text-[#585852]">
                      {me ? me.displayName : 'Auteur'} · 12 minutes de lecture restantes
                    </p>

                    {/* Progress bar */}
                    <div className="mt-1 flex w-full items-center gap-3 lg:w-[440px]">
                      <div className="flex-1 h-[6px] rounded-full bg-[#FBFAF4] overflow-hidden">
                        <div className="h-full rounded-full bg-[#22221F]" style={{ width: '65%' }} />
                      </div>
                      <span className="text-[12px] font-medium text-[#22221F] shrink-0">65%</span>
                    </div>
                  </div>

                  {/* Resume button */}
                  <Link
                    href={`/stories/${featured.id}`}
                    className="relative z-10 flex h-[48px] w-full shrink-0 items-center justify-center rounded-[8px] text-[13px] font-medium text-[#FBFAF4] transition-opacity hover:opacity-90 lg:mr-8 lg:w-[200px]"
                    style={{ backgroundColor: '#22221F', fontFamily: 'var(--font-display), sans-serif' }}
                  >
                    Reprendre la lecture
                  </Link>
                </div>
              </>
            )}

            {/* ── Récemment ajoutés ── */}
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <h2 className="text-[22px] font-medium text-[#22221F]"
                style={{ fontFamily: 'var(--font-display), sans-serif' }}>
                Récemment ajoutés
              </h2>
              {/* Filtres */}
              <button
                className="flex h-[40px] w-full items-center justify-center gap-2 rounded-[8px] bg-white px-5 text-[14px] font-medium text-[#585852] transition-colors hover:bg-[#F5F4EE] lg:w-[140px]"
                style={{ fontFamily: 'var(--font-display), sans-serif' }}
              >
                Filtres
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#585852" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <p className="text-[16px] text-[#585852]">Aucun récit dans votre bibliothèque.</p>
                <Link href="/stories/new"
                  className="text-[14px] text-[#6481DC] hover:underline">
                  Écrire un récit →
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:hidden">
                  {filtered.map(s => <LibraryCard key={s.id} story={s} me={me} />)}
                </div>
                <div className="hidden gap-6 lg:grid" style={{ gridTemplateColumns: 'repeat(4, 264px)' }}>
                  {filtered.map(s => <LibraryCard key={s.id} story={s} me={me} />)}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
