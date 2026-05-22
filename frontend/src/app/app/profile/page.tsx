import { AppShell } from "@/components/app/AppShell";
import { appApi } from "@/lib/api/services";

export default async function ProfilePage() {
  const user = await appApi.users.me();
  return (
    <AppShell title="Profil">
      <section className="rounded-2xl bg-white p-6"><h2 className="text-2xl font-bold">{user.displayName}</h2><p className="text-slate-600">{user.email}</p><div className="mt-4 grid gap-4 md:grid-cols-3"><article><p className="text-2xl font-bold">32</p><p>Écrits</p></article><article><p className="text-2xl font-bold">12</p><p>Collections</p></article><article><p className="text-2xl font-bold">143</p><p>Lectures</p></article></div></section>
      <section className="mt-6 grid gap-6 lg:grid-cols-2"><article className="rounded-2xl bg-white p-5"><h3 className="text-xl font-bold">Paramètres du compte</h3><ul className="mt-3 space-y-2"><li>Ami·e·s</li><li>Notifications</li><li>Sécurité et confidentialité</li><li>Langue et région</li></ul></article><article className="rounded-2xl bg-white p-5"><h3 className="text-xl font-bold">Statistiques</h3><p className="mt-2 text-slate-600">Votre héritage s’enrichit ce mois-ci.</p></article></section>
      <div className="mt-6 flex gap-3"><button className="rounded-xl bg-indigo-600 px-4 py-2 text-white">Déconnexion</button><button className="rounded-xl bg-red-700 px-4 py-2 text-white">Supprimer le compte</button></div>
    </AppShell>
  );
}
