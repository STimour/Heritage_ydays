'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getToken } from '@/lib/api/auth';
import { circlesApi, type Circle } from '@/lib/api/circles';
import Sidebar from '@/components/layout/Sidebar';

/* ── Cover colors cycle (from Figma) ── */
const COVER_COLORS = ['#E6A8D9', '#AFE391', '#F37E40', '#6481DC', '#22221F', '#E5E3D5'];
const TONE_LABELS  = ['Cercle familial', 'Passions', 'Souvenirs', 'Quotidien', 'Professionnel', 'Historique'];

/* ── Group card (355×380) ── */
function GroupCard({ circle }: { circle: Circle }) {
  const idx   = circle.id % COVER_COLORS.length;
  const color = COVER_COLORS[idx];
  const tone  = TONE_LABELS[idx];
  const isDark = color === '#22221F';

  return (
    <Link
      href={`/groups/${circle.id}`}
      className="flex flex-col bg-white rounded-[16px] overflow-hidden hover:shadow-md transition-shadow"
      style={{ width: 355, flexShrink: 0 }}
    >
      {/* Cover (355×160) */}
      <div className="relative h-[160px] w-full overflow-hidden" style={{ backgroundColor: color }}>
        {/* White blobs */}
        <div className="absolute -right-8 -top-8 w-[200px] h-[200px] rounded-full bg-white/20" />
        <div className="absolute -left-4 bottom-[-20px] w-[120px] h-[120px] rounded-full bg-white/20" />

        {/* Tone chip */}
        <span className="absolute top-6 left-6 bg-white text-[11px] font-medium text-[#22221F] px-3 py-[6px] rounded-full">
          {tone}
        </span>

        {/* Overlapping avatars */}
        <div className="absolute bottom-4 right-4 flex">
          {[0,1,2,3].map(i => (
            <div
              key={i}
              className="w-9 h-9 rounded-full border-2 border-white -ml-2 first:ml-0"
              style={{ backgroundColor: isDark ? '#585852' : `${color}99`, zIndex: 4 - i }}
            />
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="px-6 pt-5 pb-0">
        <h3 className="text-[22px] font-medium text-[#22221F] mb-2 line-clamp-1"
          style={{ fontFamily: 'var(--font-display), sans-serif' }}>
          {circle.name}
        </h3>
        {circle.description && (
          <p className="text-[13px] font-normal text-[#585852] leading-[18px] line-clamp-2 mb-6">
            {circle.description}
          </p>
        )}
        {!circle.description && <div className="mb-6" />}
      </div>

      {/* Divider */}
      <div className="mx-6 h-px bg-[#E5E3D5]" />

      {/* Footer */}
      <div className="mx-6 my-4 flex items-center justify-between">
        <span className="text-[12px] font-medium text-[#22221F]">
          {circle.memberCount} membre{circle.memberCount !== 1 ? 's' : ''}
        </span>
      </div>

      {/* View CTA */}
      <div className="mx-6 mb-5 flex items-center justify-center gap-2 h-9 bg-[#FBFAF4] rounded-[8px]">
        <span className="text-[13px] font-medium text-[#22221F]"
          style={{ fontFamily: 'var(--font-display), sans-serif' }}>
          Voir le groupe
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22221F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </Link>
  );
}

/* ── Empty state ── */
function EmptyState() {
  return (
    <div className="col-span-3 flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-16 h-16 rounded-full bg-[#E5E3D5] flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#585852" strokeWidth="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>
      <p className="text-[16px] font-medium text-[#22221F]" style={{ fontFamily: 'var(--font-display)' }}>
        Aucun groupe pour l&apos;instant
      </p>
      <p className="text-[14px] text-[#585852]">Créez votre premier cercle de partage.</p>
      <Link href="/groups/new"
        className="mt-2 px-6 py-3 bg-[#22221F] rounded-[8px] text-[14px] font-medium text-[#FBFAF4] hover:opacity-90 transition-opacity"
        style={{ fontFamily: 'var(--font-display)' }}>
        Nouveau groupe
      </Link>
    </div>
  );
}

const TABS = ['Tous', 'Famille', 'Amis', 'Professionnels', 'Cercles privés'] as const;

export default function GroupsPage() {
  const router = useRouter();
  const [circles, setCircles] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Tous');

  useEffect(() => {
    if (!getToken()) { router.replace('/login'); return; }
    circlesApi.getMyCircles()
      .then(setCircles)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <div className="flex min-h-screen bg-[#FBFAF4]" style={{ fontFamily: 'var(--font-body), sans-serif' }}>
      <Sidebar />

      <div className="flex-1 px-12 pt-[48px] pb-16">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex flex-col gap-[14px]">
            <h1 className="text-[40px] font-medium text-[#22221F]"
              style={{ fontFamily: 'var(--font-display), sans-serif' }}>
              Mes groupes
            </h1>
            <p className="text-[16px] font-normal text-[#22221F]">
              Gérez vos cercles de partage et découvrez les récits qui vous lient.
            </p>
          </div>
          <Link
            href="/groups/new"
            className="flex items-center gap-2 h-[54px] px-6 bg-[#22221F] rounded-[8px] text-[14px] font-bold text-[#FBFAF4] hover:opacity-90 transition-opacity shrink-0"
            style={{ fontFamily: 'var(--font-display), sans-serif' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FBFAF4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nouveau groupe
          </Link>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-2 mb-8">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="h-[40px] px-5 rounded-[8px] text-[13px] font-medium transition-colors"
              style={{
                backgroundColor: activeTab === tab ? '#22221F' : '#FFFFFF',
                color: activeTab === tab ? '#FBFAF4' : '#22221F',
                fontFamily: 'var(--font-display), sans-serif',
              }}
            >
              {tab}{tab === 'Tous' ? ` · ${circles.length}` : ''}
            </button>
          ))}
        </div>

        {/* ── Grid ── */}
        {loading ? (
          <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(3, 355px)' }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-[380px] bg-[#E5E3D5] rounded-[16px] animate-pulse" />
            ))}
          </div>
        ) : circles.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(3, 355px)' }}>
            {circles.map(c => <GroupCard key={c.id} circle={c} />)}
          </div>
        )}
      </div>
    </div>
  );
}
