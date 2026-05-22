import Link from "next/link";
import { AppShell } from "@/components/app/AppShell";
import { StoryCard } from "@/components/app/StoryCard";
import { appApi } from "@/lib/api/services";

export default async function LibraryPage() {
  const stories = await appApi.stories.list();
  const mine = stories.filter((story) => story.authorId === 1);
  return (
    <AppShell title="Ma Bibliothèque" actions={<Link href="/app/stories/new" className="rounded-xl bg-indigo-600 px-4 py-2 text-white">+ Écrire</Link>}>
      <div className="mb-5 border-b pb-2 text-sm"><span className="mr-8 border-b-2 border-indigo-600 pb-2">Publiés ({mine.filter((s) => s.isPublished).length})</span> Brouillons ({mine.filter((s) => !s.isPublished).length})</div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{mine.map((story) => <StoryCard key={story.id} story={story} />)}<Link href="/app/stories/new" className="grid place-items-center rounded-2xl bg-white p-8 text-center text-3xl font-bold">+
        <span className="mt-2 block text-base">Écrire une nouvelle histoire</span></Link></div>
    </AppShell>
  );
}
