'use client';

import { mockStories, mockCurrentUser } from '@/mocks';
import { StoryCard } from '@/components/molecules/StoryCard';
import { Button } from '@/components/atoms/Button';
import { H2, P } from '@/components/atoms/Typography';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default function LibraryPage() {
  const userStories = mockStories.filter((s) => s.author.id === mockCurrentUser.id);
  const publishedStories = userStories.filter((s) => s.isPublished);
  const draftStories = userStories.filter((s) => !s.isPublished);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <H2 className="mb-2">Ma bibliothèque</H2>
          <P className="text-slate-600">Découvrez vos histoires publiées et en brouillon</P>
        </div>
        <Link href="/app/stories/new">
          <Button className="flex items-center gap-2">
            <PlusCircle size={18} />
            <span className="hidden sm:inline">Nouvelle histoire</span>
          </Button>
        </Link>
      </div>

      {/* Published Stories */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold mb-6">Publiées ({publishedStories.length})</h3>
        {publishedStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedStories.map((story) => (
              <StoryCard key={story.id} story={story} showAuthor={false} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <P className="text-slate-600 mb-4">Vous n'avez pas encore d'histoires publiées</P>
            <Link href="/app/stories/new">
              <Button>Écrire votre première histoire</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Draft Stories */}
      {draftStories.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-6">Brouillons ({draftStories.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {draftStories.map((story) => (
              <div key={story.id} className="relative">
                <StoryCard story={story} showAuthor={false} />
                <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                  Brouillon
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
