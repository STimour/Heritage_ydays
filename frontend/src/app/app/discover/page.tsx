'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { mockStories, filterStoriesByVisibility, searchStoriesByTitle } from '@/mocks';
import { StoryVisibility } from '@/types';
import { StoryCard } from '@/components/molecules/StoryCard';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { H2, P } from '@/components/atoms/Typography';
import { PlusCircle, Search } from 'lucide-react';

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<number | null>(null);

  // Filter stories based on search and tags
  const filteredStories = useMemo(() => {
    let result = filterStoriesByVisibility(StoryVisibility.PUBLIC);

    if (searchQuery) {
      result = result.filter((story) =>
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.resume?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedTag) {
      result = result.filter((story) =>
        story.tags?.some((tag) => tag.id === selectedTag)
      );
    }

    return result;
  }, [searchQuery, selectedTag]);

  // Get unique tags from stories
  const tags = useMemo(() => {
    const tagSet = new Map();
    mockStories.forEach((story) => {
      story.tags?.forEach((tag) => {
        if (!tagSet.has(tag.id)) {
          tagSet.set(tag.id, tag);
        }
      });
    });
    return Array.from(tagSet.values());
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <H2 className="mb-2">Découvrez les histoires familiales</H2>
          <P className="text-slate-600 max-w-2xl">
            Explorez les récits inspirants d&apos;autres familles et trouvez votre plume pour écrire les vôtres.
          </P>
        </div>
        <Link href="/app/stories/new" className="flex-shrink-0">
          <Button className="flex items-center gap-2">
            <PlusCircle size={18} />
            <span className="hidden sm:inline">Écrire</span>
          </Button>
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            <Input
              type="text"
              placeholder="Rechercher une histoire..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tags Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              selectedTag === null
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
            }`}
          >
            Tous
          </button>
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(selectedTag === tag.id ? null : tag.id)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedTag === tag.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      {/* Stories Grid */}
      {filteredStories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <P className="text-slate-600 text-lg">
            {searchQuery || selectedTag ? 'Aucune histoire ne correspond à votre recherche.' : 'Aucune histoire disponible.'}
          </P>
          {(searchQuery || selectedTag) && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setSelectedTag(null);
              }}
            >
              Réinitialiser la recherche
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
