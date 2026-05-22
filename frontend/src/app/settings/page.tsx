'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getToken } from '@/lib/api/auth';
import { usersApi, type UserProfile } from '@/lib/api/users';
import Sidebar from '@/components/layout/Sidebar';
import { toast } from '@/lib/toast';

/* ── Section nav ── */
type Section = 'profile' | 'security' | 'privacy';

const SECTIONS: { key: Section; label: string; icon: React.ReactNode }[] = [
  {
    key: 'profile',
    label: 'Mon profil',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    key: 'security',
    label: 'Sécurité',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    key: 'privacy',
    label: 'Confidentialité',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

/* ── Avatar preview ── */
function AvatarPreview({ photo, name }: { photo: string; name: string }) {
  const initials = name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className="w-full h-full object-cover"
        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />
    );
  }
  return (
    <span
      className="text-[28px] font-bold text-[#FBFAF4]"
      style={{ fontFamily: 'var(--font-display), sans-serif' }}
    >
      {initials || '?'}
    </span>
  );
}

/* ── Labelled field ── */
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] font-medium text-[#585852]">{label}</label>
      {children}
      {hint && <p className="text-[12px] text-[#585852]">{hint}</p>}
    </div>
  );
}

/* ── Input ── */
function Input({ value, onChange, placeholder, prefix }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  prefix?: string;
}) {
  return (
    <div className="flex items-center h-[44px] bg-white border border-[#E5E3D5] rounded-[8px] overflow-hidden focus-within:border-[#22221F] transition-colors">
      {prefix && (
        <span className="px-3 text-[14px] text-[#585852] border-r border-[#E5E3D5] h-full flex items-center select-none">
          {prefix}
        </span>
      )}
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-4 bg-transparent text-[14px] text-[#22221F] placeholder:text-[#C5C3B5] outline-none h-full"
      />
    </div>
  );
}

/* ── Profile section ── */
function ProfileSection({ profile, onSaved }: {
  profile: UserProfile;
  onSaved: (updated: UserProfile) => void;
}) {
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [pseudo,      setPseudo]      = useState(profile.pseudo ?? '');
  const [bio,         setBio]         = useState('');
  const [photo,       setPhoto]       = useState(profile.photo ?? '');
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState('');

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!displayName.trim()) { setError('Le nom affiché est obligatoire.'); return; }
    setError('');
    setSaving(true);
    try {
      const updated = await usersApi.updateMe({
        displayName: displayName.trim(),
        pseudo:      pseudo.trim() || undefined,
        bio:         bio.trim()   || undefined,
        photo:       photo.trim() || undefined,
      });
      onSaved(updated);
      toast('saved', 'Profil mis à jour');
    } catch {
      setError('Une erreur est survenue. Réessayez.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-8">

      {/* ── Avatar block ── */}
      <div className="flex items-center gap-6 pb-8 border-b border-[#E5E3D5]">
        <div className="w-[100px] h-[100px] rounded-full bg-[#22221F] flex items-center justify-center shrink-0 overflow-hidden">
          <AvatarPreview photo={photo} name={displayName} />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-[16px] font-medium text-[#22221F]" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
            Photo de profil
          </p>
          <p className="text-[13px] text-[#585852]">Entrez l&apos;URL d&apos;une image publique.</p>
          <div className="mt-1">
            <Input
              value={photo}
              onChange={setPhoto}
              placeholder="https://…"
            />
          </div>
        </div>
      </div>

      {/* ── Info fields ── */}
      <div className="flex flex-col gap-6">
        <Field label="Nom affiché" hint="Ce nom est visible par tous les membres.">
          <Input
            value={displayName}
            onChange={setDisplayName}
            placeholder="Votre nom complet"
          />
        </Field>

        <Field label="Pseudonyme" hint="Identifiant unique, sans espaces.">
          <Input
            value={pseudo}
            onChange={setPseudo}
            placeholder="mon_pseudo"
            prefix="@"
          />
        </Field>

        <Field label="Bio" hint="Décrivez-vous en quelques mots (optionnel).">
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="Passionné·e d'histoires familiales…"
            rows={3}
            className="w-full px-4 py-3 bg-white border border-[#E5E3D5] rounded-[8px] text-[14px] text-[#22221F] placeholder:text-[#C5C3B5] outline-none focus:border-[#22221F] transition-colors resize-none"
          />
        </Field>
      </div>

      {/* ── Read-only stats ── */}
      <div className="flex gap-6 py-6 border-t border-b border-[#E5E3D5]">
        {[
          { label: 'Récits publiés',     value: profile.storyCount },
          { label: 'Sauvegardes reçues', value: profile.savedCount },
          { label: 'Dossiers créés',     value: profile.folderCount },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-1">
            <span className="text-[24px] font-bold text-[#22221F]" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
              {value}
            </span>
            <span className="text-[12px] text-[#585852]">{label}</span>
          </div>
        ))}
      </div>

      {/* ── Error + Save ── */}
      {error && (
        <p className="text-[13px] text-red-500 -mt-4">{error}</p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="h-[48px] px-8 bg-[#22221F] rounded-[8px] text-[14px] font-medium text-[#FBFAF4] hover:opacity-90 transition-opacity disabled:opacity-40"
          style={{ fontFamily: 'var(--font-display), sans-serif' }}
        >
          {saving ? 'Enregistrement…' : 'Enregistrer les modifications'}
        </button>
        <Link
          href="/profile"
          className="text-[14px] text-[#585852] hover:text-[#22221F] transition-colors"
        >
          Annuler
        </Link>
      </div>
    </form>
  );
}

/* ── Security section ── */
function SecuritySection() {
  return (
    <div className="flex flex-col gap-6">
      <div className="pb-8 border-b border-[#E5E3D5]">
        <p className="text-[15px] font-medium text-[#22221F] mb-1" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
          Mot de passe
        </p>
        <p className="text-[13px] text-[#585852] mb-5">
          La modification du mot de passe se fait par email de réinitialisation.
        </p>
        <button
          className="h-[44px] px-6 border border-[#E5E3D5] rounded-[8px] text-[14px] font-medium text-[#22221F] hover:bg-[#F5F4EE] transition-colors"
          style={{ fontFamily: 'var(--font-display), sans-serif' }}
        >
          Envoyer un lien de réinitialisation
        </button>
      </div>

      <div>
        <p className="text-[15px] font-medium text-red-600 mb-1" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
          Zone de danger
        </p>
        <p className="text-[13px] text-[#585852] mb-5">
          La suppression de votre compte est définitive et irréversible.
        </p>
        <button
          className="h-[44px] px-6 border border-red-200 rounded-[8px] text-[14px] font-medium text-red-600 hover:bg-red-50 transition-colors"
          style={{ fontFamily: 'var(--font-display), sans-serif' }}
        >
          Supprimer mon compte
        </button>
      </div>
    </div>
  );
}

/* ── Privacy section ── */
function PrivacySection() {
  const [publicProfile, setPublicProfile] = useState(true);
  const [notifications, setNotifications] = useState(true);

  function Toggle({ value, onChange, label, hint }: {
    value: boolean;
    onChange: (v: boolean) => void;
    label: string;
    hint: string;
  }) {
    return (
      <div className="flex items-start justify-between gap-8 py-5 border-b border-[#E5E3D5]">
        <div>
          <p className="text-[14px] font-medium text-[#22221F]" style={{ fontFamily: 'var(--font-display), sans-serif' }}>{label}</p>
          <p className="text-[12px] text-[#585852] mt-[2px]">{hint}</p>
        </div>
        <button
          type="button"
          onClick={() => onChange(!value)}
          className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 mt-1 ${value ? 'bg-[#22221F]' : 'bg-[#E5E3D5]'}`}
        >
          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${value ? 'translate-x-4' : 'translate-x-0'}`} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Toggle
        value={publicProfile}
        onChange={setPublicProfile}
        label="Profil public"
        hint="Votre profil et vos récits publics sont visibles par tous."
      />
      <Toggle
        value={notifications}
        onChange={setNotifications}
        label="Notifications par email"
        hint="Recevoir un email lorsque quelqu'un sauvegarde ou commente votre récit."
      />
    </div>
  );
}

/* ── Main page ── */
export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState<Section>('profile');

  useEffect(() => {
    if (!getToken()) { router.replace('/login'); return; }
    usersApi.getMe()
      .then(setProfile)
      .catch(() => router.replace('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  const sectionTitle = SECTIONS.find(s => s.key === section)?.label ?? '';

  return (
    <div className="flex min-h-screen bg-[#FBFAF4]" style={{ fontFamily: 'var(--font-body), sans-serif' }}>
      <Sidebar />

      <div className="flex-1 px-12 pt-[48px] pb-16">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-[13px] text-[#585852] mb-8">
          <Link href="/profile" className="hover:text-[#22221F] transition-colors" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
            Mon profil
          </Link>
          <span>›</span>
          <span className="text-[#22221F] font-medium" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
            Paramètres
          </span>
        </nav>

        {/* ── Page title ── */}
        <h1
          className="text-[40px] font-medium text-[#22221F] leading-none mb-2"
          style={{ fontFamily: 'var(--font-display), sans-serif' }}
        >
          Paramètres
        </h1>
        <p className="text-[16px] text-[#585852] mb-10">
          Gérez votre profil et vos préférences.
        </p>

        {/* ── Two-column layout ── */}
        <div className="flex gap-10">

          {/* Left nav */}
          <div className="flex flex-col gap-1 w-[220px] shrink-0">
            {SECTIONS.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setSection(key)}
                className={`flex items-center gap-3 px-4 py-3 rounded-[10px] text-left transition-colors ${
                  section === key
                    ? 'bg-white text-[#22221F]'
                    : 'text-[#585852] hover:bg-white/60 hover:text-[#22221F]'
                }`}
                style={{ fontFamily: 'var(--font-display), sans-serif' }}
              >
                <span className={section === key ? 'text-[#22221F]' : 'text-[#585852]'}>{icon}</span>
                <span className="text-[14px] font-medium">{label}</span>
              </button>
            ))}
          </div>

          {/* Right content */}
          <div className="flex-1 max-w-[600px]">

            {/* Section header */}
            <div className="mb-8 pb-5 border-b border-[#E5E3D5]">
              <h2
                className="text-[22px] font-semibold text-[#22221F]"
                style={{ fontFamily: 'var(--font-display), sans-serif' }}
              >
                {sectionTitle}
              </h2>
            </div>

            {/* Skeleton */}
            {loading && (
              <div className="animate-pulse flex flex-col gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-[100px] h-[100px] rounded-full bg-[#E5E3D5]" />
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="h-4 w-32 bg-[#E5E3D5] rounded" />
                    <div className="h-3 w-48 bg-[#E5E3D5] rounded" />
                    <div className="h-10 bg-[#E5E3D5] rounded-[8px] mt-2" />
                  </div>
                </div>
                <div className="h-11 bg-[#E5E3D5] rounded-[8px]" />
                <div className="h-11 bg-[#E5E3D5] rounded-[8px]" />
                <div className="h-24 bg-[#E5E3D5] rounded-[8px]" />
                <div className="h-12 w-48 bg-[#E5E3D5] rounded-[8px]" />
              </div>
            )}

            {/* Sections */}
            {!loading && profile && section === 'profile' && (
              <ProfileSection profile={profile} onSaved={setProfile} />
            )}
            {!loading && section === 'security' && <SecuritySection />}
            {!loading && section === 'privacy'  && <PrivacySection />}
          </div>
        </div>
      </div>
    </div>
  );
}
