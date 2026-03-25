"use client";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { storiesApi } from "@/lib/api/services";
import { tags, tonalites } from "@/mocks/data";

export default function NewStoryPage() {
  const [form, setForm] = useState<{ title: string; content: string; resume: string; tonalite: string; tags: string[]; visibility: "PRIVATE" | "CIRCLE" | "PUBLIC"; isPublished: boolean }>({ title: "", content: "", resume: "", tonalite: tonalites[0], tags: [tags[0]], visibility: "CIRCLE", isPublished: false });
  return (
    <AppShell title="Titre de l’histoire">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          <Input placeholder="Titre" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Textarea rows={18} placeholder="Commencer à écrire l'histoire" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        </div>
        <aside className="space-y-3 rounded-2xl bg-white p-4">
          <p className="text-sm font-semibold">Visibilité</p>
          <select className="w-full rounded-lg border p-2" value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value as "PRIVATE" | "CIRCLE" | "PUBLIC" })}><option value="PRIVATE">Privé</option><option value="CIRCLE">Cercle familial</option><option value="PUBLIC">Public</option></select>
          <p className="text-sm font-semibold">Tonalité</p>
          <select className="w-full rounded-lg border p-2" value={form.tonalite} onChange={(e) => setForm({ ...form, tonalite: e.target.value })}>{tonalites.map((t) => <option key={t}>{t}</option>)}</select>
          <p className="text-sm font-semibold">Étiquettes</p>
          <div className="flex flex-wrap gap-2">{tags.map((tag) => <button key={tag} type="button" onClick={() => setForm((prev) => ({ ...prev, tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag] }))} className={`rounded-full px-3 py-1 text-xs ${form.tags.includes(tag) ? "bg-indigo-600 text-white" : "bg-slate-200"}`}>{tag}</button>)}</div>
          <Button onClick={async () => { await storiesApi.create({ ...form, coverImage: "" }); window.location.href = "/app/library"; }} className="w-full">Achever et publier</Button>
        </aside>
      </div>
    </AppShell>
  );
}
