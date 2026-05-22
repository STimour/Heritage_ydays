'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getToken } from '@/lib/api/auth';
import { circlesApi } from '@/lib/api/circles';
import { usersApi, type UserProfile } from '@/lib/api/users';
import Sidebar from '@/components/layout/Sidebar';

/* ── Tone options ── */
const TONES = [
  { label: 'Transmission', color: '#E6A8D9' },
  { label: 'Passé',        color: '#AFE391' },
  { label: 'Moi',          color: '#6481DC' },
  { label: 'Futur',        color: '#F37E40' },
] as const;

/* ── Privacy options ── */
const PRIVACY = [
  { value: 'private', label: 'Privé',    sub: 'Sur invitation uniquement. Les récits restent entre membres.' },
  { value: 'link',    label: 'Sur lien', sub: 'Accessible via un lien unique que vous partagez.' },
  { value: 'public',  label: 'Public',   sub: 'Visible par toute la communauté Héritage Écrit.' },
] as const;

/* ── Section label ── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold text-[#585852] tracking-wide mb-4"
      style={{ fontFamily: 'var(--font-display), sans-serif' }}>
      {children}
    </p>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] font-semibold text-[#22221F] mb-2"
      style={{ fontFamily: 'var(--font-display), sans-serif' }}>
      {children}
    </p>
  );
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function NewGroupPage() {
  const router = useRouter();
  const [me,          setMe]          = useState<UserProfile | null>(null);
  const [name,        setName]        = useState('');
  const [description, setDescription] = useState('');
  const [tone,        setTone]        = useState<typeof TONES[number]>(TONES[0]);
  const [privacy,     setPrivacy]     = useState<typeof PRIVACY[number]['value']>(PRIVACY[0].value);
  const [inviteInput, setInviteInput] = useState('');
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState('');

  useEffect(() => {
    if (!getToken()) { router.replace('/login'); return; }
    usersApi.getMe().then(setMe).catch(() => {});
  }, [router]);

  async function handleSubmit() {
    if (!name.trim()) { setError('Le nom du groupe est obligatoire.'); return; }
    setSaving(true);
    setError('');
    try {
      const circle = await circlesApi.create({
        name: name.trim(),
        description: description.trim() || undefined,
        memberIds: [],
      });
      router.push(`/groups/${circle.id}`);
    } catch {
      setError('Une erreur est survenue. Réessayez.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#FBFAF4]" style={{ fontFamily: 'var(--font-body), sans-serif' }}>
      <Sidebar />

      <div className="flex-1 px-12 pt-[40px] pb-16">

        {/* Breadcrumb */}
        <p className="text-[13px] font-medium text-[#585852] mb-3"
          style={{ fontFamily: 'var(--font-display), sans-serif' }}>
          <Link href="/groups" className="hover:underline">Mes groupes</Link>
          {' › '}
          <span>Nouveau groupe</span>
        </p>

        {/* Title */}
        <h1 className="text-[40px] font-medium text-[#22221F] mb-2"
          style={{ fontFamily: 'var(--font-display), sans-serif' }}>
          Créer un nouveau groupe
        </h1>
        <p className="text-[15px] font-normal text-[#585852] mb-8">
          Un espace privé pour partager vos récits avec vos proches.
        </p>

        {/* Two-column layout */}
        <div className="flex gap-6 items-start">

          {/* ── Form (720px white) ── */}
          <div className="bg-white rounded-[16px] p-8 flex flex-col gap-8" style={{ width: 720, flexShrink: 0 }}>

            {/* 01 — Identité */}
            <div>
              <SectionLabel>01 — Identité du groupe</SectionLabel>
              <FieldLabel>Nom du groupe</FieldLabel>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Famille Achard"
                className="w-full h-[52px] bg-[#FBFAF4] rounded-[8px] px-5 text-[15px] font-medium text-[#22221F] placeholder:text-[#E5E3D5] outline-none mb-6"
              />
              <FieldLabel>Description</FieldLabel>
              <div className="relative">
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value.slice(0, 280))}
                  placeholder="Un lieu pour rassembler les récits, souvenirs et traditions…"
                  rows={4}
                  className="w-full bg-[#FBFAF4] rounded-[8px] px-5 py-4 text-[14px] font-normal text-[#22221F] placeholder:text-[#585852] outline-none resize-none"
                />
                <span className="absolute bottom-3 right-4 text-[11px] font-medium text-[#585852]">
                  {description.length} / 280
                </span>
              </div>
            </div>

            {/* 02 — Apparence */}
            <div>
              <SectionLabel>02 — Apparence</SectionLabel>
              <FieldLabel>Image de couverture</FieldLabel>
              <div className="w-full h-[140px] bg-[#FBFAF4] rounded-[8px] flex items-center gap-4 px-6 mb-6 cursor-pointer hover:bg-[#F5F4EE] transition-colors border-2 border-dashed border-[#E5E3D5]">
                <span className="text-[32px] font-medium text-[#22221F]">+</span>
                <div>
                  <p className="text-[14px] font-semibold text-[#22221F]">Glissez une image ou cliquez pour téléverser</p>
                  <p className="text-[12px] font-normal text-[#585852] mt-1">JPG, PNG — 2 Mo maximum · recommandé 1440 × 400</p>
                </div>
              </div>

              <FieldLabel>Tonalité dominante</FieldLabel>
              <div className="flex gap-3">
                {TONES.map(t => (
                  <button
                    key={t.label}
                    onClick={() => setTone(t)}
                    className="flex items-center gap-3 h-[72px] px-4 rounded-[8px] transition-colors"
                    style={{
                      width: 150,
                      backgroundColor: tone.label === t.label ? '#F5F4EE' : '#FBFAF4',
                      border: tone.label === t.label ? '2px solid #22221F' : '2px solid transparent',
                    }}
                  >
                    <span className="w-8 h-8 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                    <span className="text-[13px] font-semibold text-[#22221F]"
                      style={{ fontFamily: 'var(--font-display), sans-serif' }}>
                      {t.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 03 — Confidentialité */}
            <div>
              <SectionLabel>03 — Confidentialité</SectionLabel>
              <div className="flex flex-col gap-3">
                {PRIVACY.map(p => (
                  <button
                    key={p.value}
                    onClick={() => setPrivacy(p.value)}
                    className="flex items-start gap-4 h-[72px] px-5 bg-[#FBFAF4] rounded-[8px] text-left hover:bg-[#F5F4EE] transition-colors"
                  >
                    {/* Radio */}
                    <div className="w-6 h-6 rounded-full border-2 border-[#E5E3D5] bg-white flex items-center justify-center mt-[26px] shrink-0">
                      {privacy === p.value && (
                        <div className="w-3 h-3 rounded-full bg-[#22221F]" />
                      )}
                    </div>
                    <div className="flex flex-col justify-center h-full">
                      <span className="text-[14px] font-bold text-[#22221F]"
                        style={{ fontFamily: 'var(--font-display), sans-serif' }}>
                        {p.label}
                      </span>
                      <span className="text-[12px] font-normal text-[#585852]">{p.sub}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 04 — Inviter */}
            <div>
              <SectionLabel>04 — Inviter des proches (optionnel)</SectionLabel>
              <input
                type="email"
                value={inviteInput}
                onChange={e => setInviteInput(e.target.value)}
                placeholder="Saisissez une adresse email puis appuyez sur Entrée"
                className="w-full h-[52px] bg-[#FBFAF4] rounded-[8px] px-5 text-[14px] font-normal text-[#22221F] placeholder:text-[#585852] outline-none"
              />
            </div>
          </div>

          {/* ── Right column: Preview + Actions ── */}
          <div className="flex flex-col gap-4 flex-1">

            {/* Preview (white) */}
            <div className="bg-white rounded-[16px] p-6">
              <p className="text-[11px] font-bold text-[#585852] tracking-wide mb-5"
                style={{ fontFamily: 'var(--font-display), sans-serif' }}>
                APERÇU EN DIRECT
              </p>

              {/* Mini cover */}
              <div className="relative w-full h-[160px] rounded-[12px] overflow-hidden mb-5"
                style={{ backgroundColor: tone.color }}>
                <div className="absolute -right-6 -top-6 w-[120px] h-[120px] rounded-full bg-white/20" />
                <div className="absolute -left-3 bottom-[-18px] w-[90px] h-[90px] rounded-full bg-white/20" />
                <span className="absolute top-4 left-4 bg-[#FBFAF4] text-[11px] font-semibold text-[#22221F] px-3 py-[5px] rounded-full">
                  {tone.label}
                </span>
                <div className="absolute bottom-4 left-4">
                  <p className="text-[26px] font-medium text-[#22221F] leading-tight">
                    {name || 'Nom du groupe'}
                  </p>
                  <p className="text-[11px] font-medium text-[#22221F]">
                    {PRIVACY.find(p => p.value === privacy)?.label} · 0 membre · 0 récit
                  </p>
                </div>
              </div>

              {/* Description preview */}
              <p className="text-[13px] font-normal text-[#585852] mb-6 line-clamp-3">
                {description || 'La description apparaîtra ici.'}
              </p>

              {/* Members */}
              <p className="text-[10px] font-bold text-[#585852] tracking-wide mb-2"
                style={{ fontFamily: 'var(--font-display), sans-serif' }}>
                MEMBRES
              </p>
              {me ? (
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-[#6481DC] flex items-center justify-center">
                    <span className="text-[13px] font-bold text-[#FBFAF4]">{initials(me.displayName)}</span>
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#22221F]">{me.displayName}</p>
                    <p className="text-[11px] font-normal text-[#585852]">Fondateur·rice</p>
                  </div>
                </div>
              ) : (
                <p className="text-[12px] text-[#585852] mb-5">
                  Vous serez seul·e pour commencer. Invitez vos proches ci-contre.
                </p>
              )}

              {/* Hint */}
              <div className="bg-[#FBFAF4] rounded-[8px] px-4 py-4">
                <p className="text-[12px] font-bold text-[#22221F] mb-1">💡  Astuce</p>
                <p className="text-[11px] font-normal text-[#585852] leading-relaxed">
                  Plus la description est personnelle, plus vos proches auront envie de partager leurs souvenirs.
                </p>
              </div>
            </div>

            {/* Actions (dark) */}
            <div className="bg-[#22221F] rounded-[16px] p-6 flex flex-col gap-3">
              {error && <p className="text-[13px] text-red-400 text-center">{error}</p>}
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="w-full h-[52px] bg-[#E6A8D9] rounded-[8px] text-[15px] font-bold text-[#22221F] hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{ fontFamily: 'var(--font-display), sans-serif' }}
              >
                {saving ? 'Création…' : 'Créer le groupe'}
              </button>
              <Link
                href="/groups"
                className="w-full h-[44px] flex items-center justify-center text-[13px] font-semibold text-[#FBFAF4] hover:opacity-70 transition-opacity"
                style={{ fontFamily: 'var(--font-display), sans-serif' }}
              >
                Annuler
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
