"use client";
import Link from "next/link";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { circlesApi, friendsApi } from "@/lib/api/services";
import { useEffect } from "react";
import { Contact } from "@/types/domain";
import { useRouter } from "next/navigation";

export default function NewGroupPage() {
  const router = useRouter();
  const [users, setUsers] = useState<Contact[]>([]);
  const [memberIds, setMemberIds] = useState<number[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  useEffect(() => { friendsApi.list().then(setUsers); }, []);

  return (
    <AppShell title="Nouveau groupe">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6">
        <Link href="/app/groups" className="text-sm">← Retour au groupe</Link>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="space-y-3"><label>Nom du groupe<Input value={name} onChange={(e) => setName(e.target.value)} /></label><label>Description<Textarea rows={6} value={description} onChange={(e) => setDescription(e.target.value)} /></label></div>
          <div className="space-y-2 rounded-xl border p-3"><p className="font-semibold">Invités</p>{users.map((user) => <label key={user.id} className="flex items-center justify-between"><span>{user.displayName}</span><input type="checkbox" checked={memberIds.includes(user.id)} onChange={() => setMemberIds((prev) => prev.includes(user.id) ? prev.filter((id) => id !== user.id) : [...prev, user.id])} /></label>)}</div>
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <div className="mt-5 flex justify-end"><Button onClick={async () => { if (!name.trim()) { setError("Le nom du groupe est obligatoire."); return; } await circlesApi.create({ name, description, memberIds }); router.push("/app/groups"); router.refresh(); }}>Créer le groupe</Button></div>
      </div>
    </AppShell>
  );
}
