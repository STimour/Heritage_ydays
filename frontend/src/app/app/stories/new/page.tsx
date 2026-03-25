'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StoryVisibility, CreateStoryRequest } from '@/types';
import { mockTags } from '@/mocks';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Card } from '@/components/atoms/Card';
import { H2, P } from '@/components/atoms/Typography';
import { ArrowLeft } from 'lucide-react';

export default function NewStoryPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [resume, setResume] = useState('');
  const [visibility, setVisibility] = useState<StoryVisibility>(StoryVisibility.PRIVATE);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleTagToggle = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('Veuillez remplir le titre et le contenu');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Call API to create story
      // For now, just show success
      alert('Histoire créée avec succès !');
      router.push('/app/library');
    } catch (error) {
      alert('Erreur lors de la création de l\'histoire');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

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

      <H2 className="mb-2">Écrire une nouvelle histoire</H2>
      <P className="text-slate-600 mb-8 max-w-2xl">
        Partagez vos souvenirs préférés avec votre famille et vos proches.
      </P>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <Card className="p-6">
          <Input
            type="text"
            label="Titre de l'histoire"
            placeholder="Donnez un titre à votre histoire..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Card>

        {/* Content */}
        <Card className="p-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">Contenu</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Écrivez votre histoire ici..."
            className="w-full h-80 p-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            required
          />
        </Card>

        {/* Resume */}
        <Card className="p-6">
          <Input
            label="Résumé (optionnel)"
            placeholder="Un aperçu court de votre histoire..."
            value={resume}
            onChange={(e) => setResume(e.target.value)}
          />
        </Card>

        {/* Tags */}
        <Card className="p-6">
          <label className="block text-sm font-medium text-slate-700 mb-4">
            Tags (sélectionnez jusqu'à 5)
          </label>
          <div className="flex flex-wrap gap-2">
            {mockTags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleTagToggle(tag.id)}
                disabled={selectedTags.length >= 5 && !selectedTags.includes(tag.id)}
                className={`px-4 py-2 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedTags.includes(tag.id)
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </Card>

        {/* Visibility */}
        <Card className="p-6">
          <label className="block text-sm font-medium text-slate-700 mb-4">
            Visibilité
          </label>
          <div className="space-y-3">
            {Object.values(StoryVisibility).map((vis) => (
              <label key={vis} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  value={vis}
                  checked={visibility === vis}
                  onChange={() => setVisibility(vis)}
                  className="w-4 h-4"
                />
                <span className="font-medium text-slate-900">
                  {vis === StoryVisibility.PRIVATE && 'Privé - Seulement pour moi'}
                  {vis === StoryVisibility.CIRCLE && 'Cercle - Mes groupes'}
                  {vis === StoryVisibility.PUBLIC && 'Public - Tous'}
                </span>
              </label>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Annuler
          </Button>
          <Button disabled={isLoading}>{isLoading ? 'Création...' : 'Publier'}</Button>
        </div>
      </form>
    </div>
  );
}
