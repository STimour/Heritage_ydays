'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getToken } from '@/lib/api/auth';
import { circlesApi, type Circle } from '@/lib/api/circles';
import type { StoryFeedItem } from '@/lib/api/stories';
import Sidebar from '@/components/layout/Sidebar';
import StoryCard from '@/components/feed/StoryCard';

const COVER_COLORS = ['#E6A8D9', '#AFE391', '#F37E40', '#6481DC', '#22221F', '#E5E3D5'];
const TONE_LABELS  = ['Cercle familial', 'Passions', 'Souvenirs', 'Quotidien', 'Professionnel', 'Historique'];
const AVATAR_COLORS = ['#E6A8D9', '#6481DC', '#AFE391', '#F37E40', '#E5E3D5', '#22221F', '#E6A8D9', '#6481DC'];
const AVATAR_TEXT   = ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#22221F', '#FBFAF4', '#FFFFFF', '#FFFFFF'];

type Tab = 'stories' | 'members' | 'about';

function relativeDate(ds: string) {
  const d = Math.floor((Date.now() - new Date(ds).getTime()) / 86400000);
  if (d === 0) return "Aujourd'hui";
  if (d === 1) return 'Hier';
  if (d < 7) return `Il y a ${d} jours`;
  return new Date(ds).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function GroupDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const numId = Number(id);

  const [circle,  setCircle]  = useState<Circle | null>(null);
  const [stories, setStories] = useState<StoryFeedItem[]>([]);
  const [tab,     setTab]     = useState<Tab>('stories');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!getToken()) { router.replace('/login'); return; }
    Promise.all([
      circlesApi.getMyCircles(),
      circlesApi.getCircleStories(numId, 0, 12),
    ]).then(([circles, feed]) => {
      const found = circles.find(c => c.id === numId);
      if (!found) { setNotFound(true); }
      else { setCircle(found); setStories(feed.content); }
    }).catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [numId, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#FBFAF4]">
        <Sidebar />
        <div className="flex-1 animate-pulse">
          <div className="h-[280px] bg-[#E5E3D5]" />
          <div className="px-12 py-8 flex flex-col gap-4">
            <div className="h-6 w-48 bg-[#E5E3D5] rounded" />
            <div className="grid grid-cols-2 gap-10">
              {[1,2,3,4].map(i => <div key={i} className="h-[389px] bg-[#E5E3D5] rounded-[16px]" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !circle) {
    return (
      <div className="flex min-h-screen bg-[#FBFAF4]">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-[18px] text-[#585852]">Groupe introuvable.</p>
          <Link href="/groups" className="text-[#6481DC] underline">Retour aux groupes</Link>
        </div>
      </div>
    );
  }

  const idx   = circle.id % COVER_COLORS.length;
  const color = COVER_COLORS[idx];
  const tone  = TONE_LABELS[idx];
  const isDark = color === '#22221F';

  return (
    <div className="flex min-h-screen bg-[#FBFAF4]" style={{ fontFamily: 'var(--font-body), sans-serif' }}>
      <Sidebar />

      <div className="flex-1 flex flex-col">

        {/* ── Breadcrumb ── */}
        <div className="px-12 pt-6">
          <p className="text-[12px] font-medium text-[#585852]"
            style={{ fontFamily: 'var(--font-display), sans-serif' }}>
            <Link href="/groups" className="hover:underline">Mes groupes</Link>
            {' / '}
            <span>{circle.name}</span>
          </p>
        </div>

        {/* ── Hero (1129×280) ── */}
        <div className="relative mx-12 mt-4 h-[280px] rounded-[16px] overflow-hidden"
          style={{ backgroundColor: color }}>
          {/* Blobs */}
          <div className="absolute -right-16 -top-8 w-[420px] h-[340px] rounded-full bg-white/20" />
          <div className="absolute -left-8 bottom-[-40px] w-[240px] h-[240px] rounded-full bg-white/20" />
          <div className="absolute right-[160px] top-[40px] w-[160px] h-[160px] rounded-full"
            style={{ backgroundColor: isDark ? '#585852' : `${color}88` }} />

          {/* Content */}
          <div className="absolute inset-0 px-10 py-8 flex flex-col justify-between">
            <div className="flex flex-col gap-3">
              {/* Tone chip */}
              <span className="self-start bg-white text-[12px] font-medium text-[#22221F] px-4 py-[6px] rounded-full">
                {tone}
              </span>
              {/* Name */}
              <h1 className="text-[48px] font-medium text-[#22221F] leading-tight"
                style={{ fontFamily: 'var(--font-display), sans-serif' }}>
                {circle.name}
              </h1>
              {/* Meta */}
              <p className="text-[14px] font-medium text-[#22221F]">
                Depuis {new Date(circle.createdAt).getFullYear()} · {circle.memberCount} membre{circle.memberCount !== 1 ? 's' : ''}
              </p>
              {/* Description */}
              {circle.description && (
                <p className="text-[14px] font-normal text-[#22221F] line-clamp-1">
                  &ldquo;{circle.description}&rdquo;
                </p>
              )}
            </div>

            {/* CTAs */}
            <div className="flex gap-3">
              <button className="h-[44px] px-8 bg-white rounded-[8px] text-[13px] font-medium text-[#22221F] hover:opacity-90 transition-opacity"
                style={{ fontFamily: 'var(--font-display), sans-serif' }}>
                Inviter
              </button>
              <button className="h-[44px] px-8 bg-white rounded-[8px] text-[13px] font-medium text-[#22221F] hover:opacity-90 transition-opacity"
                style={{ fontFamily: 'var(--font-display), sans-serif' }}>
                Paramètres
              </button>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="px-12 mt-6 flex gap-2">
          {([
            { key: 'stories', label: `Fil de récits · ${stories.length}` },
            { key: 'members', label: `Membres · ${circle.memberCount}` },
            { key: 'about',   label: 'À propos' },
          ] as { key: Tab; label: string }[]).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="h-[40px] px-5 rounded-[8px] text-[13px] font-medium transition-colors"
              style={{
                backgroundColor: tab === t.key ? '#22221F' : '#FFFFFF',
                color: tab === t.key ? '#FBFAF4' : '#22221F',
                fontFamily: 'var(--font-display), sans-serif',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Main content ── */}
        <div className="px-12 mt-6 pb-16 flex gap-8">

          {/* Left: story cards (684px = 2×264 + 40 gap) */}
          <div className="flex flex-col gap-0" style={{ width: 684 }}>
            {tab === 'stories' && (
              stories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <p className="text-[16px] text-[#585852]">Aucun récit partagé dans ce groupe.</p>
                  <Link href="/stories/new"
                    className="text-[14px] text-[#6481DC] hover:underline">
                    Partager un récit →
                  </Link>
                </div>
              ) : (
                <div className="grid gap-10" style={{ gridTemplateColumns: '264px 264px' }}>
                  {stories.map(s => <StoryCard key={s.id} story={s} />)}
                </div>
              )
            )}

            {tab === 'members' && (
              <div className="bg-white rounded-[16px] p-6">
                <p className="text-[18px] font-medium text-[#22221F] mb-1"
                  style={{ fontFamily: 'var(--font-display), sans-serif' }}>
                  Membres
                </p>
                <p className="text-[12px] text-[#585852] mb-6">{circle.memberCount} personne{circle.memberCount !== 1 ? 's' : ''}</p>
                <div className="flex flex-wrap gap-4">
                  {Array.from({ length: Math.max(circle.memberCount, 1) }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-2" style={{ width: 80 }}>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                        <span className="text-[14px] font-bold"
                          style={{ color: AVATAR_TEXT[i % AVATAR_TEXT.length] }}>
                          M{i + 1}
                        </span>
                      </div>
                      <span className="text-[11px] font-medium text-[#22221F] text-center">
                        Membre {i + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'about' && (
              <div className="bg-white rounded-[16px] p-6">
                <p className="text-[18px] font-medium text-[#22221F] mb-4"
                  style={{ fontFamily: 'var(--font-display), sans-serif' }}>
                  À propos
                </p>
                <p className="text-[13px] text-[#585852] leading-relaxed mb-6">
                  {circle.description || 'Aucune description.'}
                </p>
                <div className="flex gap-12">
                  <div>
                    <p className="text-[11px] font-medium text-[#585852] mb-1">Créé le</p>
                    <p className="text-[14px] font-medium text-[#22221F]">
                      {relativeDate(circle.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-[#585852] mb-1">Visibilité</p>
                    <p className="text-[14px] font-medium text-[#22221F]">Cercle privé</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar (421px) */}
          <div className="flex flex-col gap-4 flex-1">

            {/* Members widget */}
            <div className="bg-white rounded-[16px] p-6">
              <div className="flex items-start justify-between mb-1">
                <p className="text-[18px] font-medium text-[#22221F]"
                  style={{ fontFamily: 'var(--font-display), sans-serif' }}>
                  Membres
                </p>
                <button className="text-[12px] font-medium text-[#6481DC] hover:underline">
                  Voir tout →
                </button>
              </div>
              <p className="text-[12px] text-[#585852] mb-5">{circle.memberCount} personne{circle.memberCount !== 1 ? 's' : ''}</p>
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: Math.min(circle.memberCount || 1, 8) }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                      <span className="text-[14px] font-bold"
                        style={{ color: AVATAR_TEXT[i % AVATAR_TEXT.length] }}>
                        M{i + 1}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-[#22221F] text-center">
                      M.{i + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* About widget */}
            <div className="bg-white rounded-[16px] p-6">
              <p className="text-[18px] font-medium text-[#22221F] mb-4"
                style={{ fontFamily: 'var(--font-display), sans-serif' }}>
                À propos
              </p>
              <p className="text-[13px] text-[#585852] leading-relaxed mb-6 line-clamp-4">
                {circle.description || 'Aucune description renseignée.'}
              </p>
              <div className="flex gap-8">
                <div>
                  <p className="text-[11px] font-medium text-[#585852] mb-1">Créé le</p>
                  <p className="text-[14px] font-medium text-[#22221F]">
                    {relativeDate(circle.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-[#585852] mb-1">Visibilité</p>
                  <p className="text-[14px] font-medium text-[#22221F]">Cercle privé</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
