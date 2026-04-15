"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { storiesApi } from "@/lib/api/services";

export function SaveStoryButton({ storyId }: { storyId: number }) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSaveToggle() {
    setLoading(true);
    try {
      const response = await storiesApi.toggleSave(storyId);
      setSaved(response.saved);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button type="button" onClick={handleSaveToggle} disabled={loading}>
      {loading ? "Mise à jour..." : saved ? "Retirer de mes sauvegardes" : "Sauvegarder"}
    </Button>
  );
}
