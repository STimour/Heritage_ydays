"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { STORY_THEME_OPTIONS, STORY_VISIBILITY_OPTIONS, circlesApi, storiesApi } from "@/lib/api/services";
import { Theme, Visibility } from "@/types/domain";

type StoryForm = {
  title: string;
  content: string;
  resume: string;
  mainTheme: Theme;
  tagsInput: string;
  visibility: Visibility;
  circleId?: number;
};

export default function NewStoryPage() {
  const router = useRouter();
  const [form, setForm] = useState<StoryForm>({
    title: "",
    content: "",
    resume: "",
    mainTheme: STORY_THEME_OPTIONS[0].value,
    tagsInput: "",
    visibility: "CUSTOM",
  });
  const [groups, setGroups] = useState<Array<{ id: number; name: string }>>([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    circlesApi
      .list()
      .then((data) => setGroups(data.map((group) => ({ id: group.id, name: group.name }))))
      .catch(() => setGroups([]));
  }, []);

  function parseTags(input: string): string[] {
    return input
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  async function submitStory(isPublished: boolean) {
    if (!form.title.trim() || !form.content.trim()) {
      setError("Le titre et le contenu sont obligatoires.");
      return;
    }
    if (form.visibility === "CUSTOM" && !form.circleId) {
      setError("Sélectionnez un cercle pour une visibilité personnalisée.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await storiesApi.create({
        title: form.title,
        content: form.content,
        resume: form.resume,
        visibility: form.visibility,
        mainTheme: form.mainTheme,
        tags: parseTags(form.tagsInput),
        isPublished,
        circleId: form.visibility === "CUSTOM" ? form.circleId : undefined,
      });
      router.push("/app/library");
      router.refresh();
    } catch {
      setError("Impossible de créer l’histoire.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell title="Titre de l’histoire">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          <Input placeholder="Titre" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Textarea rows={4} placeholder="Résumé" value={form.resume} onChange={(e) => setForm({ ...form, resume: e.target.value })} />
          <Textarea rows={18} placeholder="Commencer à écrire l'histoire" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        </div>
        <aside className="space-y-3 rounded-2xl bg-white p-4">
          <p className="text-sm font-semibold">Visibilité</p>
          <select className="w-full rounded-lg border p-2" value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value as Visibility })}>
            {STORY_VISIBILITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {form.visibility === "CUSTOM" && (
            <>
              <p className="text-sm font-semibold">Cercle</p>
              <select
                className="w-full rounded-lg border p-2"
                value={form.circleId ?? ""}
                onChange={(e) => setForm({ ...form, circleId: e.target.value ? Number(e.target.value) : undefined })}
              >
                <option value="">Sélectionner un cercle</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </>
          )}
          <p className="text-sm font-semibold">Tonalité</p>
          <select className="w-full rounded-lg border p-2" value={form.mainTheme} onChange={(e) => setForm({ ...form, mainTheme: e.target.value as Theme })}>
            {STORY_THEME_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-sm font-semibold">Étiquettes</p>
          <Input placeholder="Ex: Famille, Souvenir" value={form.tagsInput} onChange={(e) => setForm({ ...form, tagsInput: e.target.value })} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="space-y-2">
            <Button type="button" onClick={() => submitStory(true)} className="w-full" disabled={submitting}>
              {submitting ? "Publication..." : "Achever et publier"}
            </Button>
            <button
              type="button"
              onClick={() => submitStory(false)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold"
              disabled={submitting}
            >
              Enregistrer en brouillon
            </button>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
