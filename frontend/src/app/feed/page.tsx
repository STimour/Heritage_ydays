'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter }     from 'next/navigation';
import { getToken }      from '@/lib/api/auth';
import { storiesApi, type StoryFeedItem } from '@/lib/api/stories';
import Sidebar           from '@/components/layout/Sidebar';
import StoryCard         from '@/components/feed/StoryCard';

/* ── Icône loupe ── */
function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#585852" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

/* ── Skeleton card ── */
function SkeletonCard() {
  return (
    <div className="flex flex-col bg-white rounded-[16px] overflow-hidden animate-pulse">
      <div className="h-[150px] bg-[#E5E3D5]" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3 w-16 bg-[#E5E3D5] rounded" />
        <div className="h-5 w-full bg-[#E5E3D5] rounded" />
        <div className="h-5 w-3/4 bg-[#E5E3D5] rounded" />
        <div className="h-3 w-full bg-[#E5E3D5] rounded" />
        <div className="h-3 w-5/6 bg-[#E5E3D5] rounded" />
      </div>
      <div className="mx-4 h-px bg-[#E5E3D5]" />
      <div className="mx-4 my-3 flex justify-between">
        <div className="h-3 w-24 bg-[#E5E3D5] rounded" />
        <div className="h-3 w-8 bg-[#E5E3D5] rounded" />
      </div>
    </div>
  );
}

/* ── Empty state ── */
function EmptyState() {
  return (
    <div className="col-span-1 flex flex-col items-center justify-center py-24 gap-4 sm:col-span-2 lg:col-span-3 xl:col-span-4">
      <div className="w-16 h-16 rounded-full bg-[#E5E3D5] flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#585852" strokeWidth="1.5">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      </div>
      <p className="text-[16px] font-medium text-[#22221F]" style={{ fontFamily: 'var(--font-display)' }}>
        Aucun récit pour l&apos;instant
      </p>
      <p className="text-[14px] text-[#585852]">
        Soyez le premier à partager votre histoire.
      </p>
    </div>
  );
}

export default function FeedPage() {
  const router  = useRouter();
  const [stories,     setStories]     = useState<StoryFeedItem[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search,      setSearch]      = useState('');
  const [page,        setPage]        = useState(0);
  const [hasMore,     setHasMore]     = useState(true);

  const loadFeed = useCallback(async () => {
    setLoading(true);
    try {
      const data = await storiesApi.getFeed(0, 12);
      setStories(data.content);
      setPage(0);
      setHasMore(data.totalPages > 1);
    } catch {
      setStories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const next = page + 1;
      const data = await storiesApi.getFeed(next, 12);
      setStories(prev => [...prev, ...data.content]);
      setPage(next);
      setHasMore(next + 1 < data.totalPages);
    } catch {
      // ignore
    } finally {
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    if (!getToken()) { router.replace('/login'); return; }
    loadFeed();
  }, [loadFeed, router]);

  const filtered = search.trim()
    ? stories.filter(s =>
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.authorName.toLowerCase().includes(search.toLowerCase())
      )
    : stories;

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-[#FBFAF4]" style={{ fontFamily: 'var(--font-body), sans-serif' }}>
      <Sidebar />

      {/* ── Zone principale ── */}
      <div className="flex min-w-0 flex-1 flex-col gap-8 px-4 py-6 pb-24 lg:px-12 lg:py-12 lg:pb-12">

        {/* ── Header ── */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          {/* Titre */}
          <div className="flex min-w-0 flex-col gap-4">
            <h1
              className="text-[32px] font-medium text-[#22221F] leading-[32px] lg:text-[40px] lg:leading-[36px]"
              style={{ fontFamily: 'var(--font-display), sans-serif' }}
            >
              Découvrir des vies
            </h1>
            <p className="text-[16px] font-normal text-[#22221F]">
              Explorez les récits et mémoires de la communauté.
            </p>
          </div>

          {/* Barre de recherche + filtres */}
          <div className="flex min-w-0 w-full flex-col gap-4 lg:w-[436px] lg:shrink-0">
            {/* SearchBar — 436×42, sand fill, r=12 */}
            <div className="flex items-center gap-[7px] h-[42px] bg-[#E5E3D5] rounded-[12px] px-6">
              <SearchIcon />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher"
                className="min-w-0 flex-1 bg-transparent text-[16px] font-medium text-[#585852] placeholder:text-[#585852] outline-none"
                style={{ fontFamily: 'var(--font-display), sans-serif' }}
              />
            </div>

            {/* Filtres */}
            <div className="flex flex-wrap items-center gap-4">
              <button className="flex items-center gap-1 text-[16px] font-medium text-[#585852] hover:text-[#22221F] transition-colors" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
                Filtres <span className="text-[12px]">▾</span>
              </button>
              <button className="flex items-center gap-1 text-[16px] font-medium text-[#585852] hover:text-[#22221F] transition-colors" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
                Les plus récents <span className="text-[12px]">▾</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Grille de cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filtered.length === 0 ? (
            <EmptyState />
          ) : (
            filtered.map(story => <StoryCard key={story.id} story={story} />)
          )}
        </div>

        {/* ── Voir plus ── */}
        {!loading && hasMore && !search && (
          <div className="flex justify-center pt-4">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="px-8 py-3 border border-[#22221F] rounded-[10px] text-[14px] font-medium text-[#22221F] hover:bg-[#22221F] hover:text-white transition-colors disabled:opacity-40"
              style={{ fontFamily: 'var(--font-display), sans-serif' }}
            >
              {loadingMore ? 'Chargement…' : 'Voir plus'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
