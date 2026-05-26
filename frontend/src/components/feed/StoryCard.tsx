'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { StoryFeedItem } from '@/lib/api/stories';
import AddToFolderModal from '@/components/ui/AddToFolderModal';

/* ── Mapping thème → couleurs Figma ── */
const THEME_CONFIG: Record<string, { cover: string; tagText: string; label: string }> = {
  ROMANCE:   { cover: '#E6A8D9', tagText: '#733C67', label: 'Romance' },
  COMEDY:    { cover: '#E6A8D9', tagText: '#733C67', label: 'Comédie' },
  DRAMA:     { cover: '#6481DC', tagText: '#2E4AA3', label: 'Drame' },
  THRILLER:  { cover: '#6481DC', tagText: '#2E4AA3', label: 'Thriller' },
  MYSTERY:   { cover: '#6481DC', tagText: '#2E4AA3', label: 'Mystère' },
  SCI_FI:    { cover: '#6481DC', tagText: '#2E4AA3', label: 'Science-fiction' },
  ADVENTURE: { cover: '#AFE391', tagText: '#316115', label: 'Aventure' },
  FANTASY:   { cover: '#AFE391', tagText: '#316115', label: 'Fantaisie' },
  HORROR:    { cover: '#F37E40', tagText: '#7A3200', label: 'Horreur' },
  OTHER:     { cover: '#AFE391', tagText: '#316115', label: 'Autre' },
};

const FALLBACK_COVERS = ['#6481DC', '#E6A8D9', '#AFE391', '#F37E40'];

function getTheme(story: StoryFeedItem) {
  if (story.mainTheme && THEME_CONFIG[story.mainTheme]) return THEME_CONFIG[story.mainTheme];
  const fallbackColor = FALLBACK_COVERS[story.id % FALLBACK_COVERS.length];
  return { cover: fallbackColor, tagText: '#22221F', label: story.tags?.[0] ?? 'Récit' };
}

function relativeDate(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 5)   return "À l'instant";
  if (h < 1)   return 'Ce matin';
  if (h < 12)  return "Aujourd'hui";
  if (d < 1)   return 'Hier soir';
  if (d === 1) return 'Hier';
  if (d < 7)   return `Il y a ${d} jours`;
  return 'Il y a une semaine';
}

export default function StoryCard({ story }: { story: StoryFeedItem }) {
  const theme = getTheme(story);
  const [showSave, setShowSave] = useState(false);
  const [saved,    setSaved]    = useState(false);

  return (
    <>
    <Link
      href={`/stories/${story.id}`}
      className="flex min-w-0 flex-col bg-white rounded-[16px] overflow-hidden hover:shadow-md transition-shadow"
      style={{ fontFamily: 'var(--font-body), sans-serif' }}
    >
      {/* ── Cover (150px) ── */}
      <div
        className="relative h-[150px] w-full shrink-0"
        style={{ backgroundColor: theme.cover }}
      >
        {/* Tag chip — bas gauche */}
        <span
          className="absolute bottom-3 left-4 text-[12px] font-medium px-[10px] py-[4px] rounded-full bg-white/40 backdrop-blur-sm"
          style={{ color: theme.tagText, fontFamily: 'var(--font-display), sans-serif' }}
        >
          {theme.label}
        </span>
      </div>

      {/* ── Body ── */}
      <div className="flex min-w-0 flex-col gap-4 px-4 pt-[13px]">
        <div className="flex min-w-0 flex-col gap-[6px]">
          {/* Date */}
          <p
            className="text-[10px] font-medium text-[#585852]"
            style={{ fontFamily: 'var(--font-display), sans-serif' }}
          >
            {relativeDate(story.createdAt)}
          </p>
          {/* Titre */}
          <h3
            className="text-[18px] font-medium text-[#22221F] leading-snug line-clamp-2"
            style={{ fontFamily: 'var(--font-display), sans-serif' }}
          >
            {story.title}
          </h3>
          {/* Extrait */}
          <p className="text-[12px] font-normal text-[#585852] leading-[18px] line-clamp-3">
            {story.preview}
          </p>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="mx-4 mt-4 h-px bg-[#E5E3D5]" />

      {/* ── Footer ── */}
      <div className="mx-4 my-[13px] flex min-w-0 items-center justify-between gap-3">
        <span
          className="min-w-0 truncate text-[12px] font-medium text-[#22221F]"
          style={{ fontFamily: 'var(--font-display), sans-serif' }}
        >
          {story.authorName}
        </span>
        <button
          onClick={e => { e.preventDefault(); setShowSave(true); }}
          className="flex items-center gap-1 text-[10px] font-medium text-[#22221F] hover:opacity-70 transition-opacity"
          style={{ fontFamily: 'var(--font-display), sans-serif' }}
          title="Sauvegarder dans un dossier"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill={saved ? '#22221F' : 'none'} stroke="#22221F" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          {story.saveCount}
        </button>
      </div>
    </Link>

    {showSave && (
      <AddToFolderModal
        storyId={story.id}
        onClose={() => { setShowSave(false); setSaved(true); }}
      />
    )}
    </>
  );
}
