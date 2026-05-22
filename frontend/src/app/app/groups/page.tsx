import Link from "next/link";
import { AppShell } from "@/components/app/AppShell";
import { appApi } from "@/lib/api/services";

export default async function GroupsPage() {
  const groups = await appApi.groups.list();
  return (
    <AppShell title="Les groupes" actions={<Link href="/app/groups/new" className="rounded-xl bg-indigo-600 px-4 py-2 text-white">+ Créer</Link>}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{groups.map((group) => <article key={group.id} className="rounded-2xl bg-white p-5"><h3 className="text-2xl font-bold">{group.name}</h3><p className="mt-2 text-sm text-slate-600">{group.storyCount} récits · {group.memberIds.length} membres</p></article>)}<Link href="/app/groups/new" className="grid place-items-center rounded-2xl bg-white p-8 text-center font-semibold">+ Ajouter un groupe</Link></div>
    </AppShell>
  );
}
