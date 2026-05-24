'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getToken } from '@/lib/api/auth';
import { storiesApi, type StoryDetail, type StoryFeedItem } from '@/lib/api/stories';
import Sidebar from '@/components/layout/Sidebar';
import StoryCard from '@/components/feed/StoryCard';
import AddToFolderModal from '@/components/ui/AddToFolderModal';

/* ── Theme chip colors (same as StoryCard) ── */
const THEME_LABEL: Record<string, string> = {
  ROMANCE: 'Romance', COMEDY: 'Comédie', DRAMA: 'Drame',
  THRILLER: 'Thriller', MYSTERY: 'Mystère', SCI_FI: 'Science-fiction',
  ADVENTURE: 'Aventure', FANTASY: 'Fantaisie', HORROR: 'Horreur', OTHER: 'Autre',
};

function relativeDate(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "Aujourd'hui";
  if (d === 1) return 'Hier';
  if (d < 7)   return `Il y a ${d} jours`;
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

/* ── Skeleton ── */
function SkeletonDetail() {
  return (
    <div className="animate-pulse flex flex-col gap-6 max-w-[668px] mx-auto pt-[160px]">
      <div className="h-6 w-24 bg-[#E5E3D5] rounded-full" />
      <div className="h-10 w-full bg-[#E5E3D5] rounded" />
      <div className="h-10 w-3/4 bg-[#E5E3D5] rounded" />
      <div className="flex items-center gap-3 mt-2">
        <div className="w-10 h-10 rounded-full bg-[#E5E3D5]" />
        <div className="flex flex-col gap-1">
          <div className="h-3 w-28 bg-[#E5E3D5] rounded" />
          <div className="h-3 w-20 bg-[#E5E3D5] rounded" />
        </div>
      </div>
      <div className="h-32 bg-[#E5E3D5] rounded-[12px] mt-4" />
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-4 bg-[#E5E3D5] rounded w-full" />
      ))}
    </div>
  );
}

/* ── Share icon ── */
function ShareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FBFAF4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function SaveIcon({ saved }: { saved: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={saved ? '#FBFAF4' : 'none'} stroke="#FBFAF4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export default function StoryDetailPage() {
  const router  = useRouter();
  const params  = useParams();
  const id      = Number(params.id);

  const [story,     setStory]     = useState<StoryDetail | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [saved,     setSaved]     = useState(false);
  const [error,     setError]     = useState(false);
  const [showSave,  setShowSave]  = useState(false);

  useEffect(() => {
    if (!getToken()) { router.replace('/login'); return; }
    storiesApi.getDetail(id)
      .then(data => { setStory(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [id, router]);

  async function handleToggleSave() {
    if (!saved) {
      setShowSave(true);
    } else {
      try {
        const res = await storiesApi.toggleSave(id);
        setSaved(res.saved);
      } catch { /* silent */ }
    }
  }

  const themeLabel = story?.mainTheme ? (THEME_LABEL[story.mainTheme] ?? story.mainTheme) : null;

  return (
    <div className="flex min-h-screen bg-[#FBFAF4]" style={{ fontFamily: 'var(--font-body), sans-serif' }}>
      <Sidebar collapsed />

      {/* ── Fixed action buttons top-right ── */}
      <div className="fixed top-10 right-10 flex items-center gap-3 z-50">
        <button className="w-10 h-10 rounded-full bg-[#22221F] flex items-center justify-center hover:opacity-80 transition-opacity">
          <ShareIcon />
        </button>
        <button
          onClick={handleToggleSave}
          className="w-10 h-10 rounded-full bg-[#22221F] flex items-center justify-center hover:opacity-80 transition-opacity"
        >
          <SaveIcon saved={saved} />
        </button>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 px-12 pb-24">

        {loading && <SkeletonDetail />}

        {error && (
          <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <p className="text-[18px] text-[#585852]">Récit introuvable.</p>
            <Link href="/feed" className="text-[#6481DC] underline">Retour au fil</Link>
          </div>
        )}

        {!loading && !error && story && (
          <div className="flex flex-col">

            {/* ── Tag + Title + Author ── */}
            <div className="max-w-[668px] mx-auto pt-[160px] flex flex-col gap-0">

              {/* Tag chip */}
              {themeLabel && (
                <span
                  className="self-start text-[12px] font-medium px-[14px] py-[6px] rounded-full border mb-[18px]"
                  style={{ backgroundColor: '#F1EBFF', borderColor: '#E6A8D9', color: '#733C67' }}
                >
                  {themeLabel}
                </span>
              )}

              {/* Title */}
              <h1
                className="text-[30px] font-medium text-[#22221F] leading-[1.2] mb-[24px]"
                style={{ fontFamily: 'var(--font-display), sans-serif' }}
              >
                {story.title}
              </h1>

              {/* Author row */}
              <div className="flex items-center gap-3 mb-[48px]">
                <div className="w-10 h-10 rounded-full bg-[#E5E3D5] flex items-center justify-center shrink-0 overflow-hidden">
                  {story.authorPhoto ? (
                    <img src={story.authorPhoto} alt={story.authorName} className="w-full h-full object-cover" />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#585852" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  )}
                </div>
                <div className="flex flex-col gap-[2px]">
                  <span className="text-[12px] font-medium text-[#22221F]" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
                    {story.authorName}
                  </span>
                  <span className="text-[12px] font-normal text-[#585852]">
                    {relativeDate(story.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Summary card with floating label ── */}
            {story.resume && (
              <div className="relative max-w-[438px] mx-auto mb-[48px]">
                {/* Floating RÉSUMÉ label */}
                <span
                  className="absolute -top-[12px] left-6 text-[11px] font-medium px-3 py-[3px] bg-[#FBFAF4] text-[#585852] border border-[#E5E3D5] rounded-full"
                  style={{ fontFamily: 'var(--font-display), sans-serif' }}
                >
                  RÉSUMÉ
                </span>
                <div
                  className="bg-white rounded-[12px] px-10 py-8 text-[14px] font-normal text-[#22221F] leading-[21px]"
                  style={{ border: '1px solid rgba(88,88,82,0.2)' }}
                >
                  {story.resume}
                </div>
              </div>
            )}

            {/* ── Body text ── */}
            <div className="max-w-[438px] mx-auto">
              <p className="text-[16px] font-normal text-[#22221F] leading-[21px] whitespace-pre-wrap">
                {story.content}
              </p>
            </div>

            {/* ── Separator ── */}
            <div className="max-w-[668px] mx-auto w-full mt-16 mb-12 h-px bg-[#E5E3D5]" />

            {/* ── Related stories ── */}
            {story.suggestions && story.suggestions.length > 0 && (
              <div className="max-w-[668px] mx-auto w-full">
                <h2
                  className="text-[30px] font-bold text-[#22221F] mb-2"
                  style={{ fontFamily: 'var(--font-body), sans-serif' }}
                >
                  Poursuivre la lecture
                </h2>
                <p
                  className="text-[16px] font-medium text-[#22221F] mb-8"
                  style={{ fontFamily: 'var(--font-display), sans-serif' }}
                >
                  D&apos;autres récits
                </p>
                <div className="grid grid-cols-2 gap-10">
                  {story.suggestions.slice(0, 2).map((s: StoryFeedItem) => (
                    <StoryCard key={s.id} story={s} />
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {showSave && (
        <AddToFolderModal
          storyId={id}
          onClose={() => { setShowSave(false); setSaved(true); }}
        />
      )}
    </div>
  );
}
