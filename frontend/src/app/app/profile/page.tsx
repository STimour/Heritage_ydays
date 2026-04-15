"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app/AppShell";
import { authApi, usersApi } from "@/lib/api/services";
import { User } from "@/types/domain";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    usersApi.me().then(setUser);
  }, []);

  async function logout() {
    await authApi.logout();
    router.push("/login");
    router.refresh();
  }

  async function deleteAccount() {
    const confirmed = window.confirm("Confirmer la suppression du compte ? Cette action est définitive.");
    if (!confirmed) {
      return;
    }
    await usersApi.deleteMe();
    await authApi.logout();
    router.push("/login");
    router.refresh();
  }

  if (!user) {
    return <AppShell title="Profil">Chargement...</AppShell>;
  }

  return (
    <AppShell title="Profil">
      <section className="rounded-2xl bg-white p-6"><h2 className="text-2xl font-bold">{user.displayName}</h2><p className="text-slate-600">{user.email ?? "Email non disponible"}</p><div className="mt-4 grid gap-4 md:grid-cols-3"><article><p className="text-2xl font-bold">{user.storyCount ?? 0}</p><p>Écrits</p></article><article><p className="text-2xl font-bold">{user.folderCount ?? 0}</p><p>Collections</p></article><article><p className="text-2xl font-bold">{user.savedCount ?? 0}</p><p>Sauvegardes</p></article></div></section>
      <section className="mt-6 grid gap-6 lg:grid-cols-2"><article className="rounded-2xl bg-white p-5"><h3 className="text-xl font-bold">Paramètres du compte</h3><ul className="mt-3 space-y-2"><li>Profil public</li><li>Identité visuelle</li><li>Confidentialité</li></ul></article><article className="rounded-2xl bg-white p-5"><h3 className="text-xl font-bold">Statistiques</h3><p className="mt-2 text-slate-600">Les métriques affichées proviennent de votre profil backend.</p></article></section>
      <div className="mt-6 flex gap-3"><button onClick={logout} className="rounded-xl bg-indigo-600 px-4 py-2 text-white">Déconnexion</button><button onClick={deleteAccount} className="rounded-xl bg-red-700 px-4 py-2 text-white">Supprimer le compte</button></div>
    </AppShell>
  );
}
