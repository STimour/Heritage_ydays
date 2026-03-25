'use client';

import Link from 'next/link';
import { Header } from '@/components/organisms/PublicHeader';
import { Footer } from '@/components/organisms/PublicFooter';
import { InstallAppBanner } from '@/components/organisms/InstallAppBanner';
import { Button } from '@/components/atoms/Button';
import { H1, H2, P } from '@/components/atoms/Typography';
import { Card } from '@/components/atoms/Card';
import { BookOpen, Users, Lock, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <InstallAppBanner />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <H1 className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Préservez vos histoires familiales
              </H1>
              <P className="text-lg mb-8 text-slate-700">
                Héritage est une plateforme pour écrire, partager et découvrir les histoires qui façonnent votre famille. 
                Transformez vos souvenirs en patrimoines numériques que les générations futures chériront.
              </P>
              <div className="flex gap-4 flex-wrap">
                <Link href="/signup">
                  <Button size="lg">
                    Commencer gratuitement
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg">
                    Se connecter
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-96 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 rounded-2xl flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;q=80,c=rgba%28255,255,255,.2%29,url=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9InVybCgjcGF0dGVybjApIi8+PGRlZnM+PHBhdHRlcm4gaWQ9InBhdHRlcm4wIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjIuNSIgZmlsbD0iI2ZmZiIvPjwvcGF0dGVybj48L2RlZnM+PC9zdmc+')] bg-white/5 backdrop-blur-sm"></div>
              <BookOpen size={120} className="text-white/30" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white/50 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <H2 className="text-center mb-4">Pourquoi choisir Héritage ?</H2>
            <P className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
              Une plateforme complète pour capturer, organiser et partager vos histoires familiales
            </P>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard
                icon={<BookOpen className="w-8 h-8" />}
                title="Écrivez librement"
                description="Racontez vos histoires avec un éditeur simple et intuitif, pas de limites."
              />
              <FeatureCard
                icon={<Users className="w-8 h-8" />}
                title="Partagez en famille"
                description="Créez des groupes privés et partagez vos récits avec les proches."
              />
              <FeatureCard
                icon={<Lock className="w-8 h-8" />}
                title="Sécurisé et privé"
                description="Contrôlez totalement la visibilité de vos histoires et données personnelles."
              />
              <FeatureCard
                icon={<Zap className="w-8 h-8" />}
                title="Installable"
                description="Une véritable application mobile et web sans installation complexe."
              />
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="max-w-6xl mx-auto px-4 py-16">
          <H2 className="text-center mb-12">Des familles nous font confiance</H2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Testimonial
              quote="Héritage m'a permis de préserver les souvenirs de ma grand-mère pour mes enfants. C'est un cadeau inestimable."
              author="Marie Dupont"
              role="Utilisatrice depuis 2023"
            />
            <Testimonial
              quote="L'application est si facile à utiliser. Nos enfants lisent les histoires de famille chaque semaine."
              author="Jean Martin"
              role="Père de trois enfants"
            />
            <Testimonial
              quote="C'est l'outil parfait pour un projet de généalogie familiale. Hautement recommandé !"
              author="Sophie Leblanc"
              role="Généalogiste amateur"
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <H2 className="text-white mb-6">Prêt à commencer ?</H2>
            <P className="text-blue-100 mb-8 text-lg">
              Rejoignez des milliers de familles qui préservent leur héritage culturel dès aujourd'hui.
            </P>
            <Link href="/signup">
              <Button size="lg" variant="secondary">
                Créer un compte gratuit
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="p-6 text-center">
      <div className="flex justify-center mb-4 text-blue-600">{icon}</div>
      <h3 className="font-bold text-lg mb-2 text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600">{description}</p>
    </Card>
  );
}

function Testimonial({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role: string;
}) {
  return (
    <Card variant="featured" className="p-6">
      <p className="text-slate-700 mb-4 italic">"{quote}"</p>
      <p className="font-bold text-slate-900">{author}</p>
      <p className="text-sm text-slate-500">{role}</p>
    </Card>
  );
}
