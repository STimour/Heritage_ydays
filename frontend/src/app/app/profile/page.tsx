'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Avatar } from '@/components/atoms/Avatar';
import { Card } from '@/components/atoms/Card';
import { H2, H3, P } from '@/components/atoms/Typography';
import { mockStories } from '@/mocks';
import { User, Trash2, Edit, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [bio, setBio] = useState(user?.bio || '');

  const userStories = mockStories.filter((s) => s.author.id === user?.id);
  const publishedStories = userStories.filter((s) => s.isPublished);

  const handleSaveProfile = () => {
    // TODO: Call API to update profile
    setIsEditing(false);
    alert('Profil mii à jour !');
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleDeleteAccount = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      // TODO: Call API to delete account
      handleLogout();
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      {/* Profile Header */}
      <Card className="p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
          <Avatar src={user?.photo} size="xl" />
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <Input
                  label="Nom"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
                <textarea
                  className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Parlez de vous..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button onClick={handleSaveProfile} size="sm">
                    Enregistrer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <H2>{user?.displayName}</H2>
                <P className="text-slate-600 mb-4">@{user?.pseudo}</P>
                {user?.bio && <P className="text-slate-700 mb-4">{user.bio}</P>}
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit size={16} />
                  Modifier le profil
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{publishedStories.length}</p>
            <p className="text-sm text-slate-600">Histoires publiées</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{user?.id}</p>
            <p className="text-sm text-slate-600">Amis</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {publishedStories.reduce((sum, s) => sum + (s.saveCount || 0), 0)}
            </p>
            <p className="text-sm text-slate-600">Sauvegardes reçues</p>
          </div>
        </div>
      </Card>

      {/* Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <H3 className="text-lg mb-4">Notifications</H3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <P className="text-sm mb-0">Nouvelles demandes d'amis</P>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <P className="text-sm mb-0">Historiques partagées avec vous</P>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4" />
              <P className="text-sm mb-0">Recommandations personnalisées</P>
            </label>
          </div>
        </Card>

        <Card className="p-6">
          <H3 className="text-lg mb-4">Confidentialité</H3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <P className="text-sm mb-0">Profil visible publiquement</P>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <P className="text-sm mb-0">Permettre les recherches</P>
            </label>
          </div>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="p-6 border-red-200 bg-red-50">
        <H3 className="text-lg mb-4 text-red-900">Zone de danger</H3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-red-900">Déconnexion</p>
              <p className="text-sm text-red-700">Vous serez déconnecté de tous les appareils</p>
            </div>
            <Button
              variant="danger"
              size="sm"
              className="flex items-center gap-2 flex-shrink-0"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Déconnexion
            </Button>
          </div>
          <div className="border-t border-red-200 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-red-900">Supprimer mon compte</p>
                <p className="text-sm text-red-700">Cette action est irréversible</p>
              </div>
              <Button
                variant="danger"
                size="sm"
                className="flex items-center gap-2 flex-shrink-0"
                onClick={handleDeleteAccount}
              >
                <Trash2 size={16} />
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
