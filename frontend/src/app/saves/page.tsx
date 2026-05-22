'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/api/auth';
import { foldersApi, type FolderDTO } from '@/lib/api/folders';
import Sidebar from '@/components/layout/Sidebar';

const BANNER_COLORS = ['#E6A8D9', '#AEE290', '#6481DC', '#F37E40', '#D4ADEA', '#B8E89C'];

/* ── Illustration décorative du banner ── */
function BannerIllustration({ color }: { color: string }) {
  const blobColor = adjustColor(color, -20);
  return (
    <svg viewBox="0 0 350 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* blob organique coin bas-gauche */}
      <ellipse cx="-10" cy="140" rx="120" ry="100" fill={blobColor} fillOpacity="0.5" />
      {/* mini card histoire flottante */}
      <g transform="translate(220, 28)">
        <rect x="0" y="0" width="72" height="88" rx="8" fill="white" fillOpacity="0.9" />
        <rect x="10" y="18" width="52" height="4" rx="2" fill={blobColor} fillOpacity="0.6" />
        <rect x="10" y="28" width="40" height="4" rx="2" fill={blobColor} fillOpacity="0.4" />
        <rect x="10" y="38" width="48" height="4" rx="2" fill={blobColor} fillOpacity="0.4" />
        <rect x="10" y="48" width="36" height="4" rx="2" fill={blobColor} fillOpacity="0.4" />
      </g>
    </svg>
  );
}

/* assombrit légèrement une couleur hex pour le blob */
function adjustColor(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const r = clamp(((n >> 16) & 0xff) + amount);
  const g = clamp(((n >> 8) & 0xff) + amount);
  const b = clamp((n & 0xff) + amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/* ── FolderCard ── */
function FolderCard({ folder, color, onDelete }: { folder: FolderDTO; color: string; onDelete: (id: number) => void }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm(`Supprimer le dossier "${folder.name}" ?`)) return;
    setDeleting(true);
    try {
      await foldersApi.remove(folder.id);
      onDelete(folder.id);
    } catch {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col bg-white rounded-[16px] overflow-hidden">
      {/* Banner coloré */}
      <div className="h-[140px] flex-shrink-0" style={{ backgroundColor: color }}>
        <BannerIllustration color={color} />
      </div>

      {/* Body */}
      <div className="flex flex-col px-5 pt-4 pb-5 gap-3">
        <div className="flex items-start justify-between gap-2">
          <p
            className="text-[18px] font-semibold text-[#22221F] leading-snug"
            style={{ fontFamily: 'var(--font-display), sans-serif' }}
          >
            {folder.name}
          </p>
          <button
            onClick={handleDelete}
            disabled={deleting}
            title="Supprimer le dossier"
            className="shrink-0 w-7 h-7 flex items-center justify-center text-[#585852] hover:text-red-500 transition-colors disabled:opacity-40"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
          </button>
        </div>

        <hr className="border-[#E5E3D5]" />

        <p className="text-[14px] text-[#585852]">
          {folder.storyCount} récit{folder.storyCount !== 1 ? 's' : ''}
        </p>

        <button
          onClick={() => router.push(`/saves/${folder.id}`)}
          className="flex items-center justify-center gap-2 w-full py-[10px] border border-[#E5E3D5] rounded-[8px] text-[14px] font-medium text-[#22221F] hover:bg-[#F5F4EE] transition-colors"
          style={{ fontFamily: 'var(--font-display), sans-serif' }}
        >
          Ouvrir le dossier
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22221F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ── Skeleton card ── */
function SkeletonCard() {
  return (
    <div className="flex flex-col bg-white rounded-[16px] overflow-hidden animate-pulse">
      <div className="h-[140px] bg-[#E5E3D5]" />
      <div className="px-5 pt-4 pb-5 flex flex-col gap-3">
        <div className="h-5 w-3/4 bg-[#E5E3D5] rounded" />
        <hr className="border-[#E5E3D5]" />
        <div className="h-4 w-1/3 bg-[#E5E3D5] rounded" />
        <div className="h-10 bg-[#E5E3D5] rounded-[8px]" />
      </div>
    </div>
  );
}

/* ── Tone options for folder ── */
const FOLDER_TONES: { value: string; label: string; color: string }[] = [
  { value: 'TRANSMISSION', label: 'Transmission', color: '#E6A8D9' },
  { value: 'PASSE',        label: 'Passé',        color: '#6481DC' },
  { value: 'MOI',          label: 'Moi',          color: '#AEE290' },
  { value: 'FUTUR',        label: 'Futur',        color: '#F37E40' },
];

/* ── Modal nouveau dossier ── */
function NewFolderModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (name: string, isPrivate: boolean, tone?: string, description?: string) => Promise<void>;
}) {
  const [name,        setName]        = useState('');
  const [isPrivate,   setIsPrivate]   = useState(false);
  const [tone,        setTone]        = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [loading,     setLoading]     = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await onCreate(name.trim(), isPrivate, tone ?? undefined, description.trim() || undefined);
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className="bg-[#FBFAF4] rounded-[16px] w-[480px] shadow-xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-7 pb-5">
          <h2
            className="text-[22px] font-semibold text-[#22221F]"
            style={{ fontFamily: 'var(--font-display), sans-serif' }}
          >
            Nouveau dossier
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-8 pb-8">
          {/* Nom */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-[#585852]">Nom du dossier</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex : Souvenirs d'enfance"
              className="w-full h-[44px] px-4 bg-white border border-[#E5E3D5] rounded-[8px] text-[14px] text-[#22221F] placeholder:text-[#585852] outline-none focus:border-[#22221F] transition-colors"
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-[#585852]">Description <span className="font-normal">(optionnelle)</span></label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Une phrase pour décrire ce dossier…"
              rows={2}
              className="w-full px-4 py-3 bg-white border border-[#E5E3D5] rounded-[8px] text-[14px] text-[#22221F] placeholder:text-[#585852] outline-none focus:border-[#22221F] transition-colors resize-none"
            />
          </div>

          {/* Tonalité */}
          <div className="flex flex-col gap-3">
            <label className="text-[13px] font-medium text-[#585852]">Tonalité <span className="font-normal">(optionnelle)</span></label>
            <div className="flex items-center gap-3">
              {FOLDER_TONES.map(({ value, label, color }) => {
                const selected = tone === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTone(selected ? null : value)}
                    title={label}
                    className="relative flex items-center justify-center"
                  >
                    {selected && (
                      <span className="absolute inset-0 rounded-full border-2 border-[#22221F] scale-[1.25]" />
                    )}
                    <span className="w-9 h-9 rounded-full block" style={{ backgroundColor: color }} />
                    {selected && (
                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#22221F]" />
                    )}
                  </button>
                );
              })}
              {tone && (
                <span className="text-[12px] text-[#585852] ml-1">
                  {FOLDER_TONES.find(t => t.value === tone)?.label}
                </span>
              )}
            </div>
          </div>

          {/* Privé toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setIsPrivate(p => !p)}
              className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${isPrivate ? 'bg-[#22221F]' : 'bg-[#E5E3D5]'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isPrivate ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
            <span className="text-[14px] text-[#22221F]">Dossier privé</span>
          </label>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-[10px] border border-[#E5E3D5] rounded-[8px] text-[14px] font-medium text-[#585852] hover:bg-[#E5E3D5] transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!name.trim() || loading}
              className="flex-1 py-[10px] bg-[#22221F] rounded-[8px] text-[14px] font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {loading ? 'Création…' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Page principale ── */
export default function SavesPage() {
  const router  = useRouter();
  const [folders, setFolders] = useState<FolderDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await foldersApi.getAll();
      setFolders(data);
    } catch {
      setFolders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!getToken()) { router.replace('/login'); return; }
    load();
  }, [load, router]);

  async function handleCreate(name: string, isPrivate: boolean, tone?: string, description?: string) {
    const created = await foldersApi.create({ name, privateFolder: isPrivate, tone, description });
    setFolders(prev => [...prev, created]);
  }

  function handleDelete(id: number) {
    setFolders(prev => prev.filter(f => f.id !== id));
  }

  return (
    <div className="flex min-h-screen bg-[#FBFAF4]" style={{ fontFamily: 'var(--font-body), sans-serif' }}>
      <Sidebar />

      <div className="flex-1 flex flex-col gap-8 px-12 py-12">

        {/* ── Header ── */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <h1
              className="text-[40px] font-medium text-[#22221F] leading-[1]"
              style={{ fontFamily: 'var(--font-display), sans-serif' }}
            >
              Mes sauvegardes
            </h1>
            <p className="text-[16px] text-[#585852]">
              Organisez en dossiers les récits qui vous touchent.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-[#22221F] rounded-[10px] text-[14px] font-medium text-white hover:opacity-90 transition-opacity shrink-0"
            style={{ fontFamily: 'var(--font-display), sans-serif' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nouveau dossier
          </button>
        </div>

        {/* ── Section label ── */}
        {!loading && (
          <div className="flex items-center gap-3">
            <span
              className="text-[16px] font-semibold text-[#22221F]"
              style={{ fontFamily: 'var(--font-display), sans-serif' }}
            >
              Dossiers
            </span>
            <span className="text-[16px] text-[#585852]">{folders.length}</span>
          </div>
        )}

        {/* ── Grille ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : folders.length === 0
              ? (
                <div className="col-span-3 flex flex-col items-center justify-center py-24 gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#E5E3D5] flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#585852" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <p className="text-[16px] font-medium text-[#22221F]" style={{ fontFamily: 'var(--font-display)' }}>
                    Aucun dossier pour l&apos;instant
                  </p>
                  <p className="text-[14px] text-[#585852]">Créez votre premier dossier pour organiser vos récits.</p>
                  <button
                    onClick={() => setShowModal(true)}
                    className="mt-2 px-5 py-3 bg-[#22221F] rounded-[10px] text-[14px] font-medium text-white hover:opacity-90 transition-opacity"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    + Nouveau dossier
                  </button>
                </div>
              )
              : folders.map((folder, i) => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  color={BANNER_COLORS[i % BANNER_COLORS.length]}
                  onDelete={handleDelete}
                />
              ))
          }
        </div>
      </div>

      {showModal && (
        <NewFolderModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
