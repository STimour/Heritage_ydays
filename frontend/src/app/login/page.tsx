'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authApi, saveToken } from '@/lib/api/auth';

/* ── Icônes inline (simplifiées, fidèles aux logos officiels) ── */

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

function AppleIcon() {
  return (
    <svg width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.09 7.4c0-1.9 1.55-2.82 1.62-2.87C9.8 2.73 8.1 2.5 7.48 2.49c-1.38-.14-2.7.82-3.4.82-.7 0-1.77-.8-2.92-.78A4.33 4.33 0 0 0 .52 4.7C-.84 6.97-.03 10.3 1.3 12.1c.66.95 1.44 2.02 2.47 1.98 1-.04 1.38-.64 2.58-.64 1.2 0 1.55.64 2.6.62 1.07-.02 1.74-.97 2.39-1.93a9.4 9.4 0 0 0 1.08-2.22C12.38 9.91 9.09 8.7 9.09 7.4ZM6.7.86C7.23.22 7.6-.65 7.5-1.53c-.77.03-1.7.51-2.25 1.15-.49.57-.92 1.48-.8 2.34.85.06 1.72-.43 2.25-1.1Z" fill="white" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPw, setShowPw]         = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { token } = await authApi.login(email, password);
      saveToken(token);
      router.push('/feed');
    } catch {
      setError('Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FBFAF4]" style={{ fontFamily: 'var(--font-body), sans-serif' }}>

      {/* ── TopBar (72px) ── */}
      <header className="w-full h-[72px] flex items-center justify-between px-[48px]">
        <Link href="/">
          <Image src="/images/logo.svg" alt="Héritage" width={152} height={50} priority />
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-normal text-[#585852]">
            Pas encore de compte&nbsp;?
          </span>
          <Link
            href="/signup"
            className="text-[13px] font-bold text-[#22221F] px-4 py-[6px] hover:opacity-70 transition-opacity"
          >
            S&apos;inscrire
          </Link>
        </div>
      </header>

      {/* ── Main (gap + marges = 48px) ── */}
      <main className="flex items-start gap-[48px] mx-[48px] mb-[48px] justify-center lg:justify-start">

        {/* ── Panel Visual (gauche, desktop only) ── */}
        <div className="hidden lg:flex flex-col justify-between w-[720px] shrink-0 h-[872px] bg-[#22221F] rounded-[32px] relative overflow-hidden px-[56px] py-[80px]">

          {/* Blobs positionnés selon Figma (coordonnées relatives au panel) */}
          <div className="absolute top-[-80px] right-[-80px] w-[320px] h-[320px] rounded-full bg-[#E6A8D9] opacity-60 pointer-events-none" />
          <div className="absolute left-[-80px] top-[480px] w-[260px] h-[260px] rounded-full bg-[#6481DC] opacity-55 pointer-events-none" />
          <div className="absolute left-[380px] top-[560px] w-[180px] h-[180px] rounded-full bg-[#F37E40] opacity-45 pointer-events-none" />

          {/* Citation */}
          <div className="relative z-10">
            <div
              className="text-[140px] font-bold text-[#FBFAF4] leading-none select-none"
              style={{ fontFamily: 'var(--font-display), sans-serif' }}
            >
              &ldquo;
            </div>
            <div className="-mt-5">
              <p
                className="text-[32px] font-medium text-[#FBFAF4] leading-[1.25] max-w-[600px]"
                style={{ fontFamily: 'var(--font-display), sans-serif' }}
              >
                Je voulais juste que mes petits-enfants se souviennent de ma voix.
              </p>
              <p className="text-[18px] font-normal text-[#E5E3D5] leading-[26px] mt-8 max-w-[600px]">
                Et en écrivant ces pages, j&apos;ai retrouvé la mienne.
              </p>
            </div>
          </div>

          {/* Autrice */}
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#E6A8D9] flex items-center justify-center shrink-0">
              <span className="text-[16px] font-bold text-[#22221F]">MA</span>
            </div>
            <div>
              <p className="text-[15px] font-bold text-[#FBFAF4]">Marguerite Achard</p>
              <p className="text-[12px] font-normal text-[#E5E3D5]">Grand-mère, autrice de 12 récits</p>
            </div>
          </div>
        </div>

        {/* ── Panel Form (droite) ── */}
        <div className="w-full max-w-[576px] lg:w-[576px] lg:max-w-none lg:shrink-0 bg-white border border-[#22221F] rounded-[32px] px-[56px] pt-[88px] pb-[56px]">

          {/* Titre */}
          <h1
            className="text-[36px] font-medium text-[#22221F] leading-[1.44] mb-[8px]"
            style={{ fontFamily: 'var(--font-display), sans-serif' }}
          >
            Content de vous revoir
          </h1>
          <p className="text-[14px] font-normal text-[#585852] mb-[38px]">
            Reprenez l&apos;écriture là où vous l&apos;avez laissée.
          </p>

          {/* Boutons sociaux */}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              className="w-full h-[52px] flex items-center justify-center gap-3 bg-[#FBFAF4] border border-[#22221F] rounded-[14px] text-[14px] font-semibold text-[#22221F] hover:bg-[#E5E3D5] transition-colors cursor-pointer"
            >
              <div className="w-5 h-5 rounded-[4px] bg-white flex items-center justify-center shadow-sm">
                <GoogleIcon />
              </div>
              Continuer avec Google
            </button>
            <button
              type="button"
              className="w-full h-[52px] flex items-center justify-center gap-3 bg-[#FBFAF4] border border-[#22221F] rounded-[14px] text-[14px] font-semibold text-[#22221F] hover:bg-[#E5E3D5] transition-colors cursor-pointer"
            >
              <div className="w-5 h-5 rounded-[4px] bg-[#22221F] flex items-center justify-center">
                <AppleIcon />
              </div>
              Continuer avec Apple
            </button>
          </div>

          {/* Divider "ou par email" */}
          <div className="flex items-center gap-4 my-[36px]">
            <div className="flex-1 h-px bg-[#E5E3D5]" />
            <span className="text-[11px] font-medium text-[#585852] shrink-0">ou par email</span>
            <div className="flex-1 h-px bg-[#E5E3D5]" />
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-5">

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
                  placeholder="leo@achard.fr"
                  required
                  autoComplete="email"
                  className="w-full h-[52px] bg-[#FBFAF4] border border-[#22221F] rounded-[12px] px-5 text-[14px] font-medium text-[#22221F] placeholder:text-[#585852]/60 outline-none focus:ring-2 focus:ring-[#22221F]/20 transition-shadow"
                  style={{ fontFamily: 'var(--font-body), sans-serif' }}
                />
              </div>

              {/* Mot de passe */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-[12px] font-semibold text-[#22221F]">
                    Mot de passe
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] font-medium text-[#585852] hover:text-[#22221F] transition-colors"
                  >
                    Mot de passe oublié&nbsp;?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full h-[52px] bg-[#FBFAF4] border border-[#22221F] rounded-[12px] px-5 pr-12 text-[14px] font-medium text-[#22221F] placeholder:text-[#585852]/60 outline-none focus:ring-2 focus:ring-[#22221F]/20 transition-shadow"
                    style={{ fontFamily: 'var(--font-body), sans-serif' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    aria-label={showPw ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#585852] hover:text-[#22221F] transition-colors cursor-pointer text-[16px] leading-none"
                  >
                    👁
                  </button>
                </div>
              </div>

              {/* Se souvenir de moi */}
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className="flex items-center gap-2 w-fit cursor-pointer"
              >
                <span
                  className={`w-4 h-4 rounded-[4px] flex items-center justify-center shrink-0 transition-colors ${
                    rememberMe
                      ? 'bg-[#22221F]'
                      : 'border border-[#22221F] bg-transparent'
                  }`}
                >
                  {rememberMe && (
                    <span className="text-[11px] font-bold text-[#FBFAF4] leading-none">✓</span>
                  )}
                </span>
                <span className="text-[12px] font-normal text-[#22221F]">
                  Se souvenir de moi sur ce navigateur
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
                className="w-full h-[56px] bg-[#22221F] rounded-[28px] text-[15px] font-bold text-[#FBFAF4] hover:opacity-80 transition-opacity disabled:opacity-40 cursor-pointer mt-2"
              >
                {loading ? 'Connexion…' : 'Se connecter'}
              </button>

            </div>
          </form>

          {/* Texte légal */}
          <p className="text-[11px] font-normal text-[#585852] text-center leading-[18px] mt-[36px]">
            En vous connectant, vous acceptez nos{' '}
            <Link href="/terms" className="underline underline-offset-2 hover:text-[#22221F] transition-colors">
              conditions d&apos;utilisation
            </Link>{' '}
            et notre{' '}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-[#22221F] transition-colors">
              politique de confidentialité
            </Link>.
          </p>
        </div>

      </main>
    </div>
  );
}
