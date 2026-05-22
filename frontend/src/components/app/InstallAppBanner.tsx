"use client";

import { useState } from "react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { Button } from "@/components/ui/Button";

export function InstallAppBanner() {
  const { canInstall, isIos, install, isInstalled } = useInstallPrompt();
  const [message, setMessage] = useState("");

  if (isInstalled) return null;

  return (
    <section className="rounded-3xl bg-indigo-100 p-8">
      <h3 className="text-2xl font-bold">Emportez Héritage partout</h3>
      <p className="mt-2 text-slate-700">Installez l’application pour un accès rapide, même depuis votre écran d’accueil.</p>
      {canInstall ? (
        <Button
          className="mt-4"
          onClick={async () => {
            const ok = await install();
            setMessage(ok ? "Installation lancée." : "Installation annulée.");
          }}
        >
          Télécharger l’application
        </Button>
      ) : isIos ? (
        <p className="mt-4 text-sm text-slate-700">Sur Safari iOS : touchez Partager puis « Sur l’écran d’accueil ».</p>
      ) : (
        <p className="mt-4 text-sm text-slate-700">Le bouton d’installation apparaît quand le navigateur le permet.</p>
      )}
      {message && <p className="mt-2 text-sm text-slate-600">{message}</p>}
    </section>
  );
}
