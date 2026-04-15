import { AppShell } from "@/components/app/AppShell";
import { StoryCard } from "@/components/app/StoryCard";
import { STORY_THEME_OPTIONS } from "@/lib/api/services";
import { serverAppApi } from "@/lib/api/server";
import { Input } from "@/components/ui/Input";
import { Theme } from "@/types/domain";

function isTheme(value: string | undefined): value is Theme {
  if (!value) {
    return false;
  }
  return STORY_THEME_OPTIONS.some((option) => option.value === value);
}

export default async function DiscoverPage({ searchParams }: { searchParams: Promise<{ q?: string; theme?: string }> }) {
  const params = await searchParams;
  const query = params.q?.trim().toLowerCase() ?? "";
  const theme = isTheme(params.theme) ? params.theme : undefined;

  const stories = await serverAppApi.stories.list();
  const filtered = stories
    .filter((story) => !theme || story.mainTheme === theme)
    .filter((story) => {
      if (!query) {
        return true;
      }
      return [story.title, story.preview, story.tags.join(" "), story.authorName].join(" ").toLowerCase().includes(query);
    });

  const storyCards = filtered.map((story) => ({
    id: story.id,
    title: story.title,
    createdAt: story.createdAt,
    tags: story.tags,
    saveCount: story.saveCount,
    excerpt: story.preview,
  }));

  return (
    <AppShell
      title="Découvrir des vies"
      actions={
        <form className="flex w-full max-w-xl items-center gap-2" method="GET">
          <Input name="q" defaultValue={params.q ?? ""} placeholder="Rechercher" className="w-64" />
          <select name="theme" defaultValue={theme ?? ""} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
            <option value="">Toutes les tonalités</option>
            {STORY_THEME_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button type="submit" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
            Filtrer
          </button>
        </form>
      }
    >
      <div className="mb-6 rounded-2xl bg-indigo-100 p-5">Recherche active sur titre, aperçu, auteur et tags.</div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{storyCards.map((story) => <StoryCard key={story.id} story={story} />)}</div>
    </AppShell>
  );
}
