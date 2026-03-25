'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { mockStories, mockTags } from '@/mocks';
import { Story } from '@/types';
import { Button } from '@/components/atoms/Button';
import { Avatar } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import { H1, P, Small } from '@/components/atoms/Typography';
import { StoryCard } from '@/components/molecules/StoryCard';
import { ArrowLeft, Bookmark, Share2, Clock, Eye } from 'lucide-react';

export default function StoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const storyId = parseInt(params.id as string);

  // Find story
  const story = mockStories.find((s) => s.id === storyId);

  // Get suggestions (stories with similar tags)
  const suggestions = mockStories.filter(
    (s) =>
      s.id !== storyId &&
      s.tags?.some((tag) =>
        story?.tags?.some((t) => t.id === tag.id)
      )
  ).slice(0, 3);

  const [isSaved, setIsSaved] = useState(false);

  if (!story) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <Button variant="outline" onClick={() => router.back()} className="flex items gap-2 mb-8">
          <ArrowLeft size={18} />
          Retour
        </Button>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <P className="text-slate-600 text-lg">Histoire non trouvée</P>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Retour
      </button>

      {/* Story Header */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        {story.coverImage && (
          <div className="w-full h-96 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
            <img
              src={story.coverImage}
              alt={story.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <H1 className="flex-1">{story.title}</H1>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title={isSaved ? 'Supprimer des sauvegardes' : 'Ajouter aux sauvegardes'}
              >
                <Bookmark
                  size={24}
                  className={isSaved ? 'text-blue-600 fill-current' : 'text-slate-400'}
                />
              </button>
              <button
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title="Partager"
              >
                <Share2 size={24} className="text-slate-400" />
              </button>
            </div>
          </div>

          {/* Tags */}
          {story.tags && story.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-6">
              {story.tags.map((tag) => (
                <Badge key={tag.id} variant="primary">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Author & Meta */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t border-slate-200 pt-6">
            <div className="flex items-center gap-4">
              <Avatar src={story.author.photo} size="lg" />
              <div>
                <p className="font-bold text-slate-900">{story.author.displayName}</p>
                <p className="text-sm text-slate-500">
                  {new Date(story.createdAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="flex gap-6 text-slate-600">
              {story.tempsLectureCalcul && (
                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  <span className="text-sm font-medium">{story.tempsLectureCalcul} min</span>
                </div>
              )}
              {story.saveCount !== undefined && (
                <div className="flex items-center gap-2">
                  <Eye size={18} />
                  <span className="text-sm font-medium">{story.saveCount} sauvegardes</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Story Content */}
      <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
        {story.resume && (
          <div className="mb-8 pb-6 border-b border-slate-200">
            <H1 className="text-2xl mb-4">Résumé</H1>
            <P className="text-lg text-slate-700">{story.resume}</P>
          </div>
        )}

        <div className="prose prose-sm md:prose max-w-none text-slate-700 leading-relaxed">
          <div className="whitespace-pre-wrap text-base">
            {story.content}
          </div>
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mb-8">
          <H1 className="text-2xl mb-6">Histoires similares</H1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestions.map((sugg) => (
              <StoryCard key={sugg.id} story={sugg} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
