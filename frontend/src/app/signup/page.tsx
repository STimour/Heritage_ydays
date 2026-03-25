'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { H2, P } from '@/components/atoms/Typography';
import { Header } from '@/components/organisms/PublicHeader';
import { Footer } from '@/components/organisms/PublicFooter';

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!displayName.trim()) {
      newErrors.displayName = 'Le nom est requis';
    }
    if (!email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email invalide';
    }
    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await signup(email, password, displayName);
      router.push('/app/discover');
    } catch (err) {
      setErrors({ form: 'Erreur lors de l\'inscription. Veuillez réessayer.' });
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-md p-8">
            <H2 className="text-center mb-2">Créer un compte</H2>
            <P className="text-center text-slate-600 mb-8">
              Rejoignez des milliers de familles préservant leurs histoires
            </P>

            {errors.form && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {errors.form}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                label="Nom complet"
                placeholder="Jean Dupont"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                error={errors.displayName}
                disabled={isLoading}
              />
              <Input
                type="email"
                label="Email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                disabled={isLoading}
              />
              <Input
                type="password"
                label="Mot de passe"
                placeholder="Au moins 6 caractères"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                disabled={isLoading}
              />
              <Input
                type="password"
                label="Confirmez le mot de passe"
                placeholder="Répétez votre mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                disabled={isLoading}
              />

              <Button fullWidth size="lg" disabled={isLoading}>
                {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <P className="text-sm text-slate-600">
                Vous avez déjà un compte ?{' '}
                <Link href="/login" className="text-blue-600 font-medium hover:underline">
                  Se connecter
                </Link>
              </P>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
