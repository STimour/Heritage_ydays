'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authApi, saveToken } from '@/lib/api/auth';

/* ── Icône Google (réutilisée depuis login) ── */
function GoogleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.5 7.67c0-.49-.04-.96-.12-1.42H7.5v2.68h3.93a3.36 3.36 0 0 1-1.46 2.21v1.84h2.37C13.8 11.58 14.5 9.79 14.5 7.67Z" fill="#4285F4" />
      <path d="M7.5 15c1.97 0 3.63-.65 4.84-1.77l-2.37-1.84c-.65.44-1.49.7-2.47.7-1.9 0-3.5-1.28-4.08-3H.97v1.9A7.5 7.5 0 0 0 7.5 15Z" fill="#34A853" />
      <path d="M3.42 8.96A4.5 4.5 0 0 1 3.18 7.5c0-.51.09-1.01.24-1.46V4.14H.97A7.5 7.5 0 0 0 0 7.5c0 1.21.29 2.36.97 3.36l2.45-1.9Z" fill="#FBBC05" />
      <path d="M7.5 2.98c1.07 0 2.03.37 2.79 1.09l2.09-2.09A7.43 7.43 0 0 0 7.5 0 7.5 7.5 0 0 0 .97 4.14l2.45 1.9C4 4.26 5.6 2.98 7.5 2.98Z" fill="#EA4335" />
    </svg>
  );
}

/* ── Icônes benefits ── */
function PenIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22221F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22221F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FBFAF4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

/* ── Calcul force du mot de passe ── */
function usePasswordStrength(password: string) {
  return useMemo(() => {
    if (!password) return { pct: 0, label: '', color: '#E5E3D5' };
    let score = 0;
    if (password.length >= 8)  score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    const pct = (score / 5) * 100;
    if (score <= 1) return { pct, label: 'Faible',  color: '#F37E40' };
    if (score <= 3) return { pct, label: 'Moyen',   color: '#F37E40' };
    return { pct, label: 'Fort · min. 8 caractères, 1 majuscule, 1 chiffre', color: '#AEE290' };
  }, [password]);
}

/* ── Bénéfices (gauche) ── */
const BENEFITS = [
  {
    icon: <PenIcon />,
    bg: '#E6A8D9',
    title: 'Écriture guidée',
    desc: 'Des pistes douces pour ne plus avoir peur de la page blanche.',
  },
  {
    icon: <LockIcon />,
    bg: '#AFE391',
    title: 'Groupes privés',
    desc: 'Partagez vos récits uniquement avec vos proches choisis.',
  },
  {
    icon: <SendIcon />,
    bg: '#6481DC',
    title: 'Export & sauvegarde',
    desc: 'Exportez en PDF, livre imprimé, ou transmettez à vos héritiers.',
  },
] as const;

/* ── Composant principal ── */
export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [agreed,    setAgreed]    = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  const strength = usePasswordStrength(password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) { setError("Veuillez accepter les conditions d'utilisation."); return; }
    setLoading(true);
    setError('');
    try {
      const { token } = await authApi.register(firstName, lastName, email, password);
      saveToken(token);
      router.push('/feed');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('403') || msg.includes('409') || msg.includes('Conflict')) {
        setError('Cet email est peut-être déjà utilisé. Essayez de vous connecter.');
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FBFAF4]" style={{ fontFamily: 'var(--font-body), sans-serif' }}>

      {/* ── TopBar ── */}
      <header className="w-full h-[72px] flex items-center justify-between px-[48px]">
        <Link href="/">
          <Image src="/images/logo.svg" alt="Héritage" width={152} height={50} priority />
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-normal text-[#585852]">Déjà membre&nbsp;?</span>
          <Link
            href="/login"
            className="text-[13px] font-bold text-[#22221F] px-4 py-[6px] hover:opacity-70 transition-opacity"
          >
            Se connecter
          </Link>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex items-start gap-[48px] mx-[48px] mb-[48px] justify-center lg:justify-start">

        {/* ── Panel Benefits (gauche, desktop only) ── */}
        <div className="hidden lg:flex flex-col w-[576px] shrink-0 h-[872px] pt-[72px]">

          {/* Titre */}
          <h2
            className="text-[52px] font-medium text-[#22221F] leading-[58px]"
            style={{ fontFamily: 'var(--font-display), sans-serif' }}
          >
            Commencer à écrire votre héritage.
          </h2>

          {/* Sous-titre */}
          <p className="text-[17px] font-normal text-[#585852] leading-[26px] mt-5">
            Un espace calme, sans pub, sans algorithme.<br />
            Vos mots, pour ceux qui comptent.
          </p>

          {/* Benefits */}
          <div className="flex flex-col mt-11 gap-7">
            {BENEFITS.map(({ icon, bg, title, desc }) => (
              <div key={title} className="flex items-center gap-6">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: bg }}
                >
                  {icon}
                </div>
                <div>
                  <p className="text-[16px] font-bold text-[#22221F] leading-[21px]">{title}</p>
                  <p className="text-[13px] font-normal text-[#585852] leading-[20px] mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Proof card */}
          <div className="mt-[72px] flex items-center gap-5 bg-white border border-[#22221F] rounded-[20px] h-[80px] px-6">
            {/* Avatars empilés */}
            <div className="flex shrink-0">
              {['#E6A8D9', '#AEE290', '#6481DC', '#F37E40'].map((color, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white"
                  style={{ backgroundColor: color, marginLeft: i === 0 ? 0 : '-8px', zIndex: 4 - i, position: 'relative' }}
                />
              ))}
            </div>
            <div>
              <p className="text-[14px] font-bold text-[#22221F]">Rejoint par 2&nbsp;400+ familles</p>
              <p className="text-[11px] font-normal text-[#585852] mt-0.5">
                ★ ★ ★ ★ ★&nbsp;&nbsp;·&nbsp;&nbsp;« Un cadeau pour mes enfants. »
              </p>
            </div>
          </div>
        </div>

        {/* ── Panel Form (droite, 720px) ── */}
        <div className="w-full max-w-[720px] lg:w-[720px] lg:max-w-none lg:shrink-0 bg-white border border-[#22221F] rounded-[32px] px-[56px] pt-[56px] pb-[104px]">

          {/* Step pill */}
          <div className="inline-flex items-center justify-center w-[90px] h-[26px] bg-[#E6A8D9] rounded-[13px] mb-[18px]">
            <span className="text-[11px] font-bold text-[#22221F]">Étape 1/3</span>
          </div>

          {/* Titre */}
          <h1
            className="text-[34px] font-medium text-[#22221F] leading-[49px] mb-[1px]"
            style={{ fontFamily: 'var(--font-display), sans-serif' }}
          >
            Créons votre compte
          </h1>
          <p className="text-[14px] font-normal text-[#585852] mb-[32px]">
            Quelques informations pour commencer.
          </p>

          {/* Google */}
          <button
            type="button"
            className="w-full h-[52px] flex items-center justify-center gap-3 bg-[#FBFAF4] border border-[#22221F] rounded-[14px] text-[14px] font-semibold text-[#22221F] hover:bg-[#E5E3D5] transition-colors cursor-pointer mb-[36px]"
          >
            <div className="w-5 h-5 rounded-[4px] bg-white flex items-center justify-center shadow-sm">
              <GoogleIcon />
            </div>
            S&apos;inscrire avec Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-[28px]">
            <div className="flex-1 h-px bg-[#E5E3D5]" />
            <span className="text-[11px] font-medium text-[#585852] shrink-0">ou par email</span>
            <div className="flex-1 h-px bg-[#E5E3D5]" />
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-5">

              {/* Prénom + Nom en ligne */}
              <div className="flex gap-4">
                <div className="flex flex-col gap-2 flex-1">
                  <label htmlFor="firstName" className="text-[12px] font-semibold text-[#22221F]">
                    Prénom
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Marius"
                    required
                    autoComplete="given-name"
                    className="w-full h-[52px] bg-[#FBFAF4] border border-[#22221F] rounded-[12px] px-5 text-[14px] font-medium text-[#22221F] placeholder:text-[#585852]/60 outline-none focus:ring-2 focus:ring-[#22221F]/20 transition-shadow"
                    style={{ fontFamily: 'var(--font-body), sans-serif' }}
                  />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <label htmlFor="lastName" className="text-[12px] font-semibold text-[#22221F]">
                    Nom
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Claix"
                    required
                    autoComplete="family-name"
                    className="w-full h-[52px] bg-[#FBFAF4] border border-[#22221F] rounded-[12px] px-5 text-[14px] font-medium text-[#22221F] placeholder:text-[#585852]/60 outline-none focus:ring-2 focus:ring-[#22221F]/20 transition-shadow"
                    style={{ fontFamily: 'var(--font-body), sans-serif' }}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-[12px] font-semibold text-[#22221F]">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="marius@claix.fr"
                  required
                  autoComplete="email"
                  className="w-full h-[52px] bg-[#FBFAF4] border border-[#22221F] rounded-[12px] px-5 text-[14px] font-medium text-[#22221F] placeholder:text-[#585852]/60 outline-none focus:ring-2 focus:ring-[#22221F]/20 transition-shadow"
                  style={{ fontFamily: 'var(--font-body), sans-serif' }}
                />
              </div>

              {/* Mot de passe + barre de force */}
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-[12px] font-semibold text-[#22221F]">
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  autoComplete="new-password"
                  className="w-full h-[52px] bg-[#FBFAF4] border border-[#22221F] rounded-[12px] px-5 text-[14px] font-medium text-[#22221F] placeholder:text-[#585852]/60 outline-none focus:ring-2 focus:ring-[#22221F]/20 transition-shadow"
                  style={{ fontFamily: 'var(--font-body), sans-serif' }}
                />
                {/* Strength bar */}
                <div className="w-full h-[6px] bg-[#E5E3D5] rounded-[3px] overflow-hidden mt-1">
                  <div
                    className="h-full rounded-[3px] transition-all duration-300"
                    style={{ width: `${strength.pct}%`, backgroundColor: strength.color }}
                  />
                </div>
                {strength.label && (
                  <p className="text-[11px] font-normal text-[#585852]">{strength.label}</p>
                )}
              </div>

              {/* CGU */}
              <button
                type="button"
                onClick={() => setAgreed(!agreed)}
                className="flex items-start gap-3 text-left cursor-pointer"
              >
                <span
                  className={`w-4 h-4 rounded-[4px] flex items-center justify-center shrink-0 mt-[1px] transition-colors ${
                    agreed ? 'bg-[#22221F]' : 'border border-[#22221F]'
                  }`}
                >
                  {agreed && (
                    <svg width="11" height="7" viewBox="0 0 11 7" fill="none">
                      <path d="M1 3.5L4 6.5L10 1" stroke="#FBFAF4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="text-[12px] font-normal text-[#585852] leading-[18px]">
                  J&apos;accepte les{' '}
                  <Link href="/terms" className="underline underline-offset-2 text-[#22221F] hover:opacity-70">
                    conditions d&apos;utilisation
                  </Link>{' '}
                  et la{' '}
                  <Link href="/privacy" className="underline underline-offset-2 text-[#22221F] hover:opacity-70">
                    politique de confidentialité
                  </Link>{' '}
                  d&apos;Héritage Écrit.
                </span>
              </button>

              {/* Erreur */}
              {error && (
                <p className="text-[13px] text-red-500 -mb-2">{error}</p>
              )}

              {/* CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[56px] bg-[#22221F] rounded-[28px] text-[15px] font-bold text-[#FBFAF4] hover:opacity-80 transition-opacity disabled:opacity-40 cursor-pointer"
              >
                {loading ? 'Création en cours…' : 'Continuer →'}
              </button>

            </div>
          </form>
        </div>

      </main>
    </div>
  );
}
