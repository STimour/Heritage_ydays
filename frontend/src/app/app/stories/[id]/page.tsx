import { AppShell } from "@/components/app/AppShell";
import { StoryCard } from "@/components/app/StoryCard";
import { serverAppApi } from "@/lib/api/server";
import { Badge } from "@/components/ui/Badge";
import { SaveStoryButton } from "@/components/app/SaveStoryButton";

export default async function StoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const story = await serverAppApi.stories.byId(Number(id));
  const suggestions = story.suggestions.map((item) => ({
    id: item.id,
    title: item.title,
    createdAt: item.createdAt,
    tags: item.tags,
    saveCount: item.saveCount,
    excerpt: item.preview,
  }));

  return (
    <AppShell title="Lire l'histoire">
      <article className="mx-auto max-w-3xl rounded-2xl bg-white p-8">
        {story.mainTheme && <Badge>{story.mainTheme}</Badge>}
        <h2 className="mt-3 text-4xl font-bold">{story.title}</h2>
        <p className="mt-2 text-sm text-slate-500">{story.createdAt} · {story.saveCount} enregistrements</p>
        <div className="mt-3">
          <SaveStoryButton storyId={story.id} />
        </div>
        <p className="mt-6 font-medium">Résumé</p>
        <p className="text-slate-600">{story.resume}</p>
        <p className="mt-6 whitespace-pre-line text-slate-700">{story.content}</p>
      </article>
      <section className="mt-10">
        <h3 className="mb-3 text-2xl font-bold">Poursuivre la lecture</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{suggestions.map((item) => <StoryCard key={item.id} story={item} />)}</div>
      </section>
    </AppShell>
  );
}
