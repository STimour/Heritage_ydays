/**
 * PWA Install Banner Component
 */

'use client';

import { useState } from 'react';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { Button } from '@/components/atoms/Button';
import { X } from 'lucide-react';

export function InstallAppBanner() {
  const { isInstallable, isInstalled, promptInstall } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);

  if (!isInstallable || isInstalled || dismissed) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">Installez l&apos;application Héritage</h3>
          <p className="text-sm opacity-90">
            Accédez gratuitement à vos histoires familiales depuis votre téléphone ou ordinateur
          </p>
        </div>
        <div className="flex gap-2 items-center flex-shrink-0">
          <Button variant="secondary" size="sm" onClick={() => promptInstall()}>
            Télécharger
          </Button>
          <button
            onClick={() => setDismissed(true)}
            className="p-2 hover:bg-white/20 rounded-lg transition"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
