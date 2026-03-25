import { AppShell } from "@/components/app/AppShell";
import { appApi } from "@/lib/api/services";

export default async function NetworkPage() {
  const pending = await appApi.users.pendingRequests();
  const contacts = await appApi.users.contacts();
  return (
    <AppShell title="Mon Réseau">
      <section><h2 className="mb-3 text-2xl font-bold">Demandes en attente ({pending.length})</h2><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{pending.map((item) => <article key={item.id} className="flex items-center justify-between rounded-full bg-white p-3"><span>{item.fromUser.displayName}</span><div className="space-x-3"><button>✓</button><button>✕</button></div></article>)}</div></section>
      <section className="mt-8"><h2 className="mb-3 text-2xl font-bold">Mes contacts ({contacts.length})</h2><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{contacts.map((c) => <article key={c.id} className="rounded-2xl bg-white p-5 text-center"><p className="text-lg font-semibold">{c.displayName}</p><button className="mt-3 rounded-full border border-indigo-500 px-4 py-1 text-sm text-indigo-600">Supprimer de mes amis</button></article>)}</div></section>
    </AppShell>
  );
}
