'use client';

import { useState } from 'react';
import { mockFolders, mockCurrentUser } from '@/mocks';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { H2, P } from '@/components/atoms/Typography';
import { Input } from '@/components/atoms/Input';
import { Folder as FolderIcon, PlusCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function SavedPage() {
  const [folders, setFolders] = useState(mockFolders);
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderForm, setShowNewFolderForm] = useState(false);

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const folder = {
      id: Math.max(...folders.map((f) => f.id), 0) + 1,
      name: newFolderName,
      owner: mockCurrentUser,
      privateFolder: true,
      createdAt: new Date().toISOString(),
      storyCount: 0,
      stories: [],
    };

    setFolders([...folders, folder]);
    setNewFolderName('');
    setShowNewFolderForm(false);
  };

  const handleDeleteFolder = (folderId: number) => {
    setFolders(folders.filter((f) => f.id !== folderId));
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <H2 className="mb-2">Mes sauvegardes</H2>
        <P className="text-slate-600">Organisez et gérez vos histoires préférées</P>
      </div>

      {/* New Folder Form */}
      {showNewFolderForm && (
        <Card className="p-6 mb-8 bg-blue-50 border-blue-200">
          <form onSubmit={handleCreateFolder} className="flex gap-2">
            <Input
              type="text"
              placeholder="Nom du dossier..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              autoFocus
            />
            <Button size="sm" className="flex-shrink-0">
              Créer
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowNewFolderForm(false)}
              className="flex-shrink-0"
            >
              Annuler
            </Button>
          </form>
        </Card>
      )}

      {/* Add Folder Button */}
      {!showNewFolderForm && folders.length > 0 && (
        <Button
          variant="outline"
          className="mb-8 flex items-center gap-2"
          onClick={() => setShowNewFolderForm(true)}
        >
          <PlusCircle size={18} />
          Nouveau dossier
        </Button>
      )}

      {/* Folders Grid */}
      {folders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {folders.map((folder) => (
            <Link key={folder.id} href={`/app/saved/${folder.id}`}>
              <Card interactive className="p-6 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FolderIcon size={24} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900">{folder.name}</h3>
                      <p className="text-sm text-slate-500">
                        {folder.storyCount} histoire{folder.storyCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteFolder(folder.id);
                    }}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  Créé {new Date(folder.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <FolderIcon size={48} className="mx-auto mb-4 text-slate-400" />
          <P className="text-slate-600 mb-4">Vous n'avez pas encore de dossiers</P>
          <Button onClick={() => setShowNewFolderForm(true)}>
            Créer votre premier dossier
          </Button>
        </Card>
      )}
    </div>
  );
}
