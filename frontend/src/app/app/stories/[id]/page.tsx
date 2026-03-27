import { AppShell } from "@/components/app/AppShell";
import { StoryCard } from "@/components/app/StoryCard";
import { appApi } from "@/lib/api/services";
import { Badge } from "@/components/ui/Badge";

export default async function StoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const story = await appApi.stories.byId(Number(id));
  const stories = await appApi.stories.list();

  return (
    <AppShell title="Lire l'histoire">
      <article className="mx-auto max-w-3xl rounded-2xl bg-white p-8">
        <Badge>{story.tonalite}</Badge>
        <h2 className="mt-3 text-4xl font-bold">{story.title}</h2>
        <p className="mt-2 text-sm text-slate-500">{story.createdAt} · {story.saveCount} enregistrements</p>
        <p className="mt-6 font-medium">Résumé</p>
        <p className="text-slate-600">{story.resume}</p>
        <p className="mt-6 whitespace-pre-line text-slate-700">{story.content.repeat(12)}</p>
      </article>
      <section className="mt-10">
        <h3 className="mb-3 text-2xl font-bold">Poursuivre la lecture</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{stories.filter((s) => s.id !== story.id).map((item) => <StoryCard key={item.id} story={item} />)}</div>
      </section>
    </AppShell>
  );
}
