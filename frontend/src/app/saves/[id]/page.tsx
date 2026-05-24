'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getToken } from '@/lib/api/auth';
import { foldersApi, type FolderDetailDTO } from '@/lib/api/folders';
import Sidebar from '@/components/layout/Sidebar';
import StoryCard from '@/components/feed/StoryCard';

const BANNER_COLORS = ['#E6A8D9', '#AEE290', '#6481DC', '#F37E40', '#D4ADEA', '#B8E89C'];

function getBannerColor(id: number) {
  return BANNER_COLORS[id % BANNER_COLORS.length];
}

/* ── Blob décoratif du banner ── */
function BannerBlob({ color }: { color: string }) {
  const lighter = color + '80';
  return (
    <svg
      className="absolute top-0 right-0 h-full w-[260px]"
      viewBox="0 0 260 140"
      fill="none"
      preserveAspectRatio="xMaxYMid slice"
    >
      <ellipse cx="220" cy="30" rx="120" ry="100" fill={lighter} />
      <ellipse cx="260" cy="120" rx="80" ry="70" fill={lighter} />
    </svg>
  );
}

/* ── Skeleton banner ── */
function SkeletonBanner() {
  return <div className="w-full h-[140px] rounded-[16px] bg-[#E5E3D5] animate-pulse" />;
}

/* ── Skeleton card ── */
function SkeletonCard() {
  return (
    <div className="flex flex-col bg-white rounded-[16px] overflow-hidden animate-pulse">
      <div className="h-[150px] bg-[#E5E3D5]" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3 w-20 bg-[#E5E3D5] rounded" />
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

export default function FolderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [folder,     setFolder]     = useState<FolderDetailDTO | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [notFound,   setNotFound]   = useState(false);
  const [sortNewest, setSortNewest] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await foldersApi.getDetail(id);
      setFolder(data);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!getToken()) { router.replace('/login'); return; }
    if (!id) { setNotFound(true); return; }
    load();
  }, [load, router, id]);

  const color = getBannerColor(id);
  const sortedStories = folder
    ? [...folder.stories].sort((a, b) => {
        const da = new Date(a.createdAt).getTime();
        const db = new Date(b.createdAt).getTime();
        return sortNewest ? db - da : da - db;
      })
    : [];

  return (
    <div className="flex min-h-screen bg-[#FBFAF4]" style={{ fontFamily: 'var(--font-body), sans-serif' }}>
      <Sidebar />

      <div className="flex-1 flex flex-col gap-8 px-12 py-10">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-[14px] text-[#585852]">
          <Link
            href="/saves"
            className="hover:text-[#22221F] transition-colors"
            style={{ fontFamily: 'var(--font-display), sans-serif' }}
          >
            Mes sauvegardes
          </Link>
          <span>›</span>
          <span
            className="text-[#22221F] font-medium"
            style={{ fontFamily: 'var(--font-display), sans-serif' }}
          >
            {loading ? '…' : (folder?.name ?? 'Dossier')}
          </span>
        </nav>

        {/* ── Banner ── */}
        {loading ? (
          <SkeletonBanner />
        ) : notFound ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <p className="text-[18px] font-medium text-[#22221F]" style={{ fontFamily: 'var(--font-display)' }}>
              Dossier introuvable.
            </p>
            <Link href="/saves" className="text-[14px] text-[#585852] underline">
              Retour aux sauvegardes
            </Link>
          </div>
        ) : folder && (
          <div
            className="relative w-full h-[140px] rounded-[16px] overflow-hidden flex flex-col justify-center px-8"
            style={{ backgroundColor: color }}
          >
            <BannerBlob color={color} />
            <h1
              className="relative text-[32px] font-bold text-[#22221F] leading-tight z-10"
              style={{ fontFamily: 'var(--font-display), sans-serif' }}
            >
              {folder.name}
            </h1>
            <p className="relative text-[14px] text-[#22221F]/70 mt-1 z-10">
              {folder.stories.length} récit{folder.stories.length !== 1 ? 's' : ''} sauvegardé{folder.stories.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* ── Section header ── */}
        {!loading && !notFound && folder && (
          <div className="flex items-center justify-between">
            <span
              className="text-[16px] font-medium text-[#22221F]"
              style={{ fontFamily: 'var(--font-display), sans-serif' }}
            >
              Ajouté récemment
            </span>
            <button
              onClick={() => setSortNewest(p => !p)}
              className="flex items-center gap-2 h-[40px] px-4 bg-[#E5E3D5] rounded-[10px] text-[14px] font-medium text-[#22221F] hover:bg-[#D5D3C5] transition-colors"
              style={{ fontFamily: 'var(--font-display), sans-serif' }}
            >
              {sortNewest ? 'Les plus récents' : 'Les plus anciens'}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22221F" strokeWidth="2" strokeLinecap="round"
                style={{ transform: sortNewest ? 'none' : 'rotate(180deg)', transition: 'transform 0.2s' }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>
        )}

        {/* ── Grille ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          ) : !notFound && folder && folder.stories.length === 0 ? (
            <div className="col-span-4 flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-16 h-16 rounded-full bg-[#E5E3D5] flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#585852" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p className="text-[16px] font-medium text-[#22221F]" style={{ fontFamily: 'var(--font-display)' }}>
                Ce dossier est vide
              </p>
              <p className="text-[14px] text-[#585852]">
                Sauvegardez des récits depuis le fil d&apos;actualité.
              </p>
            </div>
          ) : !notFound && folder && (
            sortedStories.map(story => <StoryCard key={story.id} story={story} />)
          )}
        </div>

      </div>
    </div>
  );
}
