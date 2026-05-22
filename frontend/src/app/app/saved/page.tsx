import { AppShell } from "@/components/app/AppShell";
import { appApi } from "@/lib/api/services";

export default async function SavedPage() {
  const collections = await appApi.collections.list();
  return (
    <AppShell title="Mes Sauvegardes">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{collections.map((collection) => <article key={collection.id} className="rounded-2xl bg-white p-5"><div className="h-8 w-8 rounded bg-slate-100" /><h3 className="mt-14 text-xl font-semibold">{collection.name}</h3><p className="text-slate-500">{collection.storyCount} récits</p></article>)}<article className="grid place-items-center rounded-2xl bg-white p-5 text-center font-semibold">+ Ajouter une collection</article></div>
    </AppShell>
  );
}
