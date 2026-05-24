'use client';

import { useEffect, useState } from 'react';
import { foldersApi, type FolderDTO } from '@/lib/api/folders';
import { toast } from '@/lib/toast';

const TONE_COLORS: Record<string, string> = {
  TRANSMISSION: '#E6A8D9',
  PASSE:        '#6481DC',
  MOI:          '#AEE290',
  FUTUR:        '#F37E40',
};
const FALLBACK_COLORS = ['#E6A8D9', '#AEE290', '#6481DC', '#F37E40', '#D4ADEA', '#B8E89C'];

function folderColor(folder: FolderDTO, idx: number): string {
  if (folder.tone && TONE_COLORS[folder.tone]) return TONE_COLORS[folder.tone];
  return FALLBACK_COLORS[idx % FALLBACK_COLORS.length];
}

interface Props {
  storyId: number;
  onClose: () => void;
}

export default function AddToFolderModal({ storyId, onClose }: Props) {
  const [folders,  setFolders]  = useState<FolderDTO[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [search,   setSearch]   = useState('');
  const [saving,   setSaving]   = useState(false);

  useEffect(() => {
    foldersApi.getAll().then(setFolders).catch(() => {});
  }, []);

  const filtered = folders.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  async function handleSave() {
    if (selected === null) return;
    setSaving(true);
    try {
      await foldersApi.addStory(selected, storyId);
      toast('saved', 'Récit sauvegardé dans le dossier');
      onClose();
    } catch {
      // noop
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-[#FBFAF4] rounded-[16px] w-[440px] shadow-xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2
            className="text-[22px] font-semibold text-[#22221F]"
            style={{ fontFamily: 'var(--font-display), sans-serif' }}
          >
            Sauvegarder dans…
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#E5E3D5] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#22221F" strokeWidth="2" strokeLinecap="round">
              <line x1="1" y1="1" x2="13" y2="13" /><line x1="13" y1="1" x2="1" y2="13" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-6 pb-3">
          <div className="flex items-center gap-2 bg-white border border-[#E5E3D5] rounded-[8px] px-3 h-[40px]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#585852" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un dossier…"
              className="flex-1 bg-transparent text-[14px] text-[#22221F] placeholder:text-[#585852] outline-none"
            />
          </div>
        </div>

        {/* Folder list */}
        <div className="px-6 flex flex-col gap-[2px] max-h-[280px] overflow-y-auto pb-2">
          {filtered.length === 0 && (
            <p className="text-[14px] text-[#585852] py-6 text-center">Aucun dossier trouvé.</p>
          )}
          {filtered.map((folder, i) => {
            const color = folderColor(folder, i);
            const isSelected = selected === folder.id;
            return (
              <button
                key={folder.id}
                onClick={() => setSelected(isSelected ? null : folder.id)}
                className={`flex items-center gap-3 px-3 py-[10px] rounded-[8px] transition-colors text-left ${
                  isSelected ? 'bg-white' : 'hover:bg-white/60'
                }`}
              >
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span className="flex-1 text-[14px] text-[#22221F]">{folder.name}</span>
                <span className="text-[12px] text-[#585852]">
                  {folder.storyCount} récit{folder.storyCount !== 1 ? 's' : ''}
                </span>
                {isSelected && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22221F" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E5E3D5]">
          <button
            onClick={handleSave}
            disabled={selected === null || saving}
            className="w-full h-[44px] bg-[#22221F] rounded-[8px] text-[14px] font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-40"
            style={{ fontFamily: 'var(--font-display), sans-serif' }}
          >
            {saving ? 'Sauvegarde…' : 'Sauvegarder'}
          </button>
        </div>
      </div>
    </div>
  );
}
