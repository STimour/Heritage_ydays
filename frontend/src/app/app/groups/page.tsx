'use client';

import { useState } from 'react';
import { mockCircles, mockCurrentUser } from '@/mocks';
import { Circle } from '@/types';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { H2, P } from '@/components/atoms/Typography';
import { Input } from '@/components/atoms/Input';
import { Avatar } from '@/components/atoms/Avatar';
import { Users, PlusCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function GroupsPage() {
  const [groups, setGroups] = useState(mockCircles);
  const [newGroupName, setNewGroupName] = useState('');
  const [showNewGroupForm, setShowNewGroupForm] = useState(false);

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const newGroup: Circle = {
      id: Math.max(...groups.map((g) => g.id), 0) + 1,
      name: newGroupName,
      owner: mockCurrentUser,
      createdAt: new Date().toISOString(),
      members: [mockCurrentUser],
    };

    setGroups([...groups, newGroup]);
    setNewGroupName('');
    setShowNewGroupForm(false);
  };

  const handleDeleteGroup = (groupId: number) => {
    setGroups(groups.filter((g) => g.id !== groupId));
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <H2 className="mb-2">Mes groupes</H2>
          <P className="text-slate-600">Créez et gérez vos groupes familiaux</P>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => setShowNewGroupForm(true)}
        >
          <PlusCircle size={18} />
          <span className="hidden sm:inline">Nouveau groupe</span>
        </Button>
      </div>

      {/* New Group Form */}
      {showNewGroupForm && (
        <Card className="p-6 mb-8 bg-blue-50 border-blue-200">
          <form onSubmit={handleCreateGroup} className="flex gap-2">
            <Input
              type="text"
              placeholder="Nom du groupe..."
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              autoFocus
            />
            <Button size="sm" className="flex-shrink-0">
              Créer
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowNewGroupForm(false)}
              className="flex-shrink-0"
            >
              Annuler
            </Button>
          </form>
        </Card>
      )}

      {/* Groups Grid */}
      {groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Card key={group.id} interactive className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{group.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Users size={16} className="text-slate-500" />
                    <p className="text-sm text-slate-600">
                      {group.members?.length || 0} membre{(group.members?.length || 0) !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                {group.owner.id === mockCurrentUser.id && (
                  <button
                    onClick={() => handleDeleteGroup(group.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              {/* Members */}
              {group.members && (
                <div className="mb-4 pb-4 border-t border-slate-200 pt-4">
                  <p className="text-xs font-medium text-slate-600 mb-2">Membres:</p>
                  <div className="flex gap-1">
                    {group.members.map((member) => (
                      <Avatar
                        key={member.id}
                        src={member.photo}
                        size="sm"
                        alt={member.displayName}
                      />
                    ))}
                  </div>
                </div>
              )}

              <Button variant="secondary" fullWidth size="sm">
                Voir le groupe
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Users size={48} className="mx-auto mb-4 text-slate-400" />
          <P className="text-slate-600 mb-4">Vous n'avez pas encore de groupes</P>
          <Button onClick={() => setShowNewGroupForm(true)}>
            Créer votre premier groupe
          </Button>
        </Card>
      )}
    </div>
  );
}
