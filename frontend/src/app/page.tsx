import Link from "next/link";
import { InstallAppBanner } from "@/components/app/InstallAppBanner";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 md:px-8">
      <header className="mb-12 flex items-center justify-between">
        <div className="h-10 w-32 rounded bg-indigo-100" />
        <div className="flex gap-2">
          <Link href="/login" className="rounded-xl border px-4 py-2 text-sm">Connexion</Link>
          <Link href="/signup" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm text-white">Inscription</Link>
        </div>
      </header>

      <section className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <h1 className="text-5xl font-bold">Chaque vie est un chef-d’œuvre.</h1>
          <p className="mt-4 text-slate-600">Écrivez, partagez et transmettez les souvenirs de votre famille dans une application simple et élégante.</p>
          <div className="mt-6 flex gap-3"><Button>Découvrir les récits</Button><Link href="/signup" className="rounded-xl border px-4 py-2">Commencer</Link></div>
        </div>
        <div className="rounded-3xl bg-indigo-100 p-8"><div className="h-64 rounded-2xl border border-indigo-300" /></div>
      </section>

      <section className="my-16 text-center">
        <h2 className="text-3xl font-semibold">Redonner au temps sa juste valeur.</h2>
      </section>

      <InstallAppBanner />

      <footer className="mt-16 border-t pt-6 text-sm text-slate-600">© 2026 Héritage. Tous droits réservés.</footer>
    </main>
  );
}
