"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { foldersApi } from "@/lib/api/services";
import { Collection } from "@/types/domain";

export default function SavedPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [creating, setCreating] = useState(false);

  async function loadCollections() {
    const data = await foldersApi.list(true);
    setCollections(data);
  }

  useEffect(() => {
    loadCollections();
  }, []);

  async function createCollection() {
    const name = window.prompt("Nom de la collection");
    if (!name?.trim()) {
      return;
    }
    setCreating(true);
    try {
      await foldersApi.create(name.trim(), true);
      await loadCollections();
    } finally {
      setCreating(false);
    }
  }

  return (
    <AppShell title="Mes Sauvegardes">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {collections.map((collection) => <article key={collection.id} className="rounded-2xl bg-white p-5"><div className="h-8 w-8 rounded bg-slate-100" /><h3 className="mt-14 text-xl font-semibold">{collection.name}</h3><p className="text-slate-500">{collection.storyCount} récits</p></article>)}
        <button disabled={creating} onClick={createCollection} className="grid place-items-center rounded-2xl bg-white p-5 text-center font-semibold">{creating ? "Création..." : "+ Ajouter une collection"}</button>
      </div>
    </AppShell>
  );
}
