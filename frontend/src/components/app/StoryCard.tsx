import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Story } from "@/types/domain";

export function StoryCard({ story }: { story: Story }) {
  return (
    <Link href={`/app/stories/${story.id}`} className="block overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="h-40 bg-indigo-100" />
      <div className="space-y-2 p-4">
        <Badge>{story.tags[0]}</Badge>
        <p className="text-xs text-slate-500">{story.createdAt}</p>
        <h3 className="text-xl font-bold">{story.title}</h3>
        <p className="line-clamp-2 text-sm text-slate-600">{story.resume}</p>
        <p className="text-sm text-slate-800">{story.saveCount} enregistrements</p>
      </div>
    </Link>
  );
}
