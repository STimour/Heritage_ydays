import { AppShell } from "@/components/app/AppShell";
import { StoryCard } from "@/components/app/StoryCard";
import { appApi } from "@/lib/api/services";
import { Input } from "@/components/ui/Input";

export default async function DiscoverPage() {
  const stories = await appApi.stories.list();
  return (
    <AppShell title="Découvrir des vies" actions={<Input placeholder="Rechercher" className="w-64" />}>
      <div className="mb-6 rounded-2xl bg-indigo-100 p-5">Filtres, tonalité et tags</div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{stories.filter((s) => s.isPublished).map((story) => <StoryCard key={story.id} story={story} />)}</div>
    </AppShell>
  );
}
