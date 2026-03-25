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

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      await login(email, password);
      router.push('/app/discover');
    } catch (err) {
      setError('Erreur de connexion. Veuillez vérifier vos identifiants.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-md p-8">
            <H2 className="text-center mb-2">Connexion</H2>
            <P className="text-center text-slate-600 mb-8">
              Accédez à vos histoires familiales
            </P>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                label="Email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              <Input
                type="password"
                label="Mot de passe"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />

              <Button fullWidth size="lg" disabled={isLoading}>
                {isLoading ? 'Connexion en cours...' : 'Se connecter'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <P className="text-sm text-slate-600">
                Pas encore inscrit ?{' '}
                <Link href="/signup" className="text-blue-600 font-medium hover:underline">
                  Créer un compte
                </Link>
              </P>
            </div>
          </div>

          {/* Quick login tip for development */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <P className="text-sm text-blue-800 font-medium mb-2">💡 Mode développement</P>
            <P className="text-xs text-blue-700">
              Vous pouvez utiliser n'importe quel email et mot de passe pour le test.
            </P>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
