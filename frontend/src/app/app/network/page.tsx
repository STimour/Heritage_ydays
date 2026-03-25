'use client';

import { useState, useMemo } from 'react';
import { mockUsers, mockCurrentUser, searchUsersByName, mockFriendRequests } from '@/mocks';
import { FriendRequest } from '@/types';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Avatar } from '@/components/atoms/Avatar';
import { Card } from '@/components/atoms/Card';
import { H2, P } from '@/components/atoms/Typography';
import { Search, UserPlus, CheckCircle, XCircle, UserMinus } from 'lucide-react';

export default function NetworkPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [requestsState, setRequestsState] = useState<FriendRequest[]>(mockFriendRequests);
  const [friendsList, setFriendsList] = useState(mockUsers.filter((u) => u.id !== mockCurrentUser.id).slice(0, 3));

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchUsersByName(searchQuery).filter((u) => u.id !== mockCurrentUser.id);
  }, [searchQuery]);

  const handleAcceptRequest = (requestId: number) => {
    setRequestsState(requestsState.filter((r) => r.id !== requestId));
    // In real app, would update friendsList
  };

  const handleRejectRequest = (requestId: number) => {
    setRequestsState(requestsState.filter((r) => r.id !== requestId));
  };

  const handleAddFriend = (userId: number) => {
    // TODO: Send friend request
    alert('Demande d\'ami envoyée !');
  };

  const handleRemoveFriend = (userId: number) => {
    setFriendsList(friendsList.filter((f) => f.id !== userId));
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <H2 className="mb-2">Mon réseau</H2>
      <P className="text-slate-600 mb-8 max-w-2xl">
        Gérez vos amis et demandes d'amitié pour partager vos histoires en famille
      </P>

      {/* Pending Requests */}
      {requestsState.length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Demandes en attente ({requestsState.length})</h3>
          <div className="space-y-3">
            {requestsState.map((request) => (
              <Card key={request.id} className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar src={request.fromUser.photo} />
                    <div className="flex-1">
                      <p className="font-bold text-slate-900">
                        {request.fromUser.displayName}
                      </p>
                      <p className="text-sm text-slate-500">
                        {request.fromUser.pseudo}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      className="p-2 hover:bg-green-50 rounded-lg transition-colors text-green-600"
                      title="Accepter"
                    >
                      <CheckCircle size={20} />
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                      title="Refuser"
                    >
                      <XCircle size={20} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Search Users */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold mb-6">Rechercher des amis</h3>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 text-slate-400" size={20} />
          <Input
            type="text"
            placeholder="Cherchez un ami par nom ou pseudo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {searchQuery && searchResults.length > 0 && (
          <div className="space-y-3">
            {searchResults.map((user) => (
              <Card key={user.id} className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar src={user.photo} />
                    <div className="flex-1">
                      <p className="font-bold text-slate-900">{user.displayName}</p>
                      <p className="text-sm text-slate-500">{user.pseudo}</p>
                      {user.bio && <p className="text-xs text-slate-600 line-clamp-1">{user.bio}</p>}
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddFriend(user.id)}
                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600 flex-shrink-0"
                    title="Ajouter"
                  >
                    <UserPlus size={20} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {searchQuery && searchResults.length === 0 && (
          <Card className="p-8 text-center">
            <P className="text-slate-600">Aucun utilisateur trouvé</P>
          </Card>
        )}
      </div>

      {/* Friends List */}
      <div>
        <h3 className="text-2xl font-bold mb-6">Mes amis ({friendsList.length})</h3>
        {friendsList.length > 0 ? (
          <div className="space-y-3">
            {friendsList.map((friend) => (
              <Card key={friend.id} className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar src={friend.photo} />
                    <div className="flex-1">
                      <p className="font-bold text-slate-900">{friend.displayName}</p>
                      <p className="text-sm text-slate-500">{friend.pseudo}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFriend(friend.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600 flex-shrink-0"
                    title="Supprimer"
                  >
                    <UserMinus size={20} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <P className="text-slate-600">Vous n'avez pas encore d'amis</P>
          </Card>
        )}
      </div>
    </div>
  );
}
