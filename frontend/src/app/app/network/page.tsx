"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { friendsApi, usersApi } from "@/lib/api/services";
import { Contact, PendingRequest, UserSearchResult } from "@/types/domain";
import { Input } from "@/components/ui/Input";

export default function NetworkPage() {
  const [pending, setPending] = useState<PendingRequest[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<UserSearchResult[]>([]);

  async function loadNetwork() {
    const [pendingData, contactsData] = await Promise.all([friendsApi.pendingRequests(), friendsApi.list()]);
    setPending(pendingData);
    setContacts(contactsData);
  }

  useEffect(() => {
    loadNetwork();
  }, []);

  async function handleSearch() {
    const query = search.trim();
    if (!query) {
      setResults([]);
      return;
    }
    const users = await usersApi.search(query);
    setResults(users);
  }

  async function acceptRequest(requestId: number) {
    await friendsApi.acceptRequest(requestId);
    await loadNetwork();
  }

  async function rejectRequest(requestId: number) {
    await friendsApi.rejectRequest(requestId);
    await loadNetwork();
  }

  async function removeFriend(userId: number) {
    await friendsApi.remove(userId);
    await loadNetwork();
  }

  async function sendRequest(userId: number) {
    await friendsApi.sendRequest(userId);
    await handleSearch();
  }

  return (
    <AppShell title="Mon Réseau">
      <section>
        <h2 className="mb-3 text-2xl font-bold">Trouver des contacts</h2>
        <div className="mb-3 flex max-w-xl gap-2">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nom ou pseudo" />
          <button onClick={handleSearch} className="rounded-xl border px-4 py-2 text-sm">Rechercher</button>
        </div>
        {results.length > 0 && (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {results.map((result) => (
              <article key={result.id} className="rounded-2xl bg-white p-4">
                <p className="text-lg font-semibold">{result.displayName}</p>
                <p className="text-sm text-slate-500">{result.pseudo ?? ""}</p>
                <button
                  className="mt-3 rounded-full border border-indigo-500 px-4 py-1 text-sm text-indigo-600 disabled:opacity-50"
                  disabled={result.alreadyFriend || result.pendingRequest}
                  onClick={() => sendRequest(result.id)}
                >
                  {result.alreadyFriend ? "Déjà ami" : result.pendingRequest ? "Demande en attente" : "Envoyer une demande"}
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
      <section className="mt-8"><h2 className="mb-3 text-2xl font-bold">Demandes en attente ({pending.length})</h2><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{pending.map((item) => <article key={item.id} className="flex items-center justify-between rounded-full bg-white p-3"><span>{item.senderName}</span><div className="space-x-3"><button onClick={() => acceptRequest(item.id)}>✓</button><button onClick={() => rejectRequest(item.id)}>✕</button></div></article>)}</div></section>
      <section className="mt-8"><h2 className="mb-3 text-2xl font-bold">Mes contacts ({contacts.length})</h2><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{contacts.map((c) => <article key={c.id} className="rounded-2xl bg-white p-5 text-center"><p className="text-lg font-semibold">{c.displayName}</p><button onClick={() => removeFriend(c.id)} className="mt-3 rounded-full border border-indigo-500 px-4 py-1 text-sm text-indigo-600">Supprimer de mes amis</button></article>)}</div></section>
    </AppShell>
  );
}
