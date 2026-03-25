/**
 * Story Card Component - Reusable across pages
 */

import Link from 'next/link';
import { Story } from '@/types';
import { Card } from '@/components/atoms/Card';
import { Avatar } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import { Bookmark, Share2 } from 'lucide-react';

interface StoryCardProps {
  story: Story;
  showAuthor?: boolean;
}

export function StoryCard({ story, showAuthor = true }: StoryCardProps) {
  return (
    <Link href={`/app/stories/${story.id}`}>
      <Card interactive>
        {story.coverImage && (
          <div className="w-full h-40 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
            <img
              src={story.coverImage}
              alt={story.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-lg leading-tight line-clamp-2 text-slate-900">
              {story.title}
            </h3>
            <div className="flex gap-1 flex-shrink-0">
              <button className="p-1 hover:bg-slate-100 rounded" onClick={(e) => {
                e.preventDefault();
                // TODO: Save story logic
              }}>
                <Bookmark size={18} className="text-blue-600" />
              </button>
              <button className="p-1 hover:bg-slate-100 rounded" onClick={(e) => {
                e.preventDefault();
                // TODO: Share modal
              }}>
                <Share2 size={18} className="text-slate-400" />
              </button>
            </div>
          </div>

          {story.tags && story.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap mb-3">
              {story.tags.slice(0, 2).map((tag) => (
                <Badge key={tag.id} size="sm" variant="primary">
                  {tag.name}
                </Badge>
              ))}
              {story.tags.length > 2 && (
                <Badge size="sm" variant="secondary">
                  +{story.tags.length - 2}
                </Badge>
              )}
            </div>
          )}

          <p className="text-sm text-slate-600 line-clamp-2 mb-3">
            {story.resume || story.content.substring(0, 120) + '...'}
          </p>

          <div className="flex items-center justify-between text-xs text-slate-500">
            {showAuthor && story.author && (
              <div className="flex items-center gap-2">
                <Avatar src={story.author.photo} size="sm" />
                <div>
                  <p className="font-medium text-slate-700">{story.author.displayName}</p>
                  <p className="text-slate-500">
                    {new Date(story.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            )}
            <div className="text-right">
              {story.tempsLectureCalcul && (
                <p className="text-slate-500">{story.tempsLectureCalcul} min</p>
              )}
              {story.saveCount !== undefined && (
                <p className="text-slate-500">{story.saveCount} sauvegardes</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
