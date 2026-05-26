'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/api/auth';
import { storiesApi } from '@/lib/api/stories';
import Sidebar from '@/components/layout/Sidebar';

/* ── Visibility options ── */
type Visibility = 'CUSTOM' | 'PRIVATE' | 'PUBLIC';

const VISIBILITY_OPTIONS: {
  value: Visibility;
  label: string;
  sub: string;
  Icon: () => React.ReactElement;
}[] = [
  {
    value: 'CUSTOM',
    label: 'Cercle familiale',
    sub: 'Seuls vos proches invités',
    Icon: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    value: 'PRIVATE',
    label: 'Privé',
    sub: 'Juste pour vous',
    Icon: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    value: 'PUBLIC',
    label: 'Public',
    sub: 'Visible par tout le monde',
    Icon: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
];

/* ── Tonalité (theme) color selector ── */
const TONE_OPTIONS: { theme: string; color: string }[] = [
  { theme: 'ROMANCE',   color: '#E6A8D9' },
  { theme: 'DRAMA',     color: '#6481DC' },
  { theme: 'HORROR',    color: '#F37E40' },
  { theme: 'ADVENTURE', color: '#AEE290' },
];

/* ── Formatting toolbar icons ── */
function BoldIcon()  { return <span className="text-[16px] font-bold leading-none">B</span>; }
function ItalicIcon() { return <span className="text-[16px] italic leading-none">/</span>; }
function H2Icon()    { return <span className="text-[16px] font-medium leading-none">H2</span>; }
function QuoteIcon() { return <span className="text-[16px] leading-none">&ldquo;</span>; }
function ImageIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#585852" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

export default function NewStoryPage() {
  const router = useRouter();

  const [title,      setTitle]      = useState('');
  const [content,    setContent]    = useState('');
  const [visibility, setVisibility] = useState<Visibility>('CUSTOM');
  const [theme,      setTheme]      = useState<string | null>(null);
  const [tagInput,   setTagInput]   = useState('');
  const [tags,       setTags]       = useState<string[]>([]);
  const [saving,     setSaving]     = useState(false);
  const [saveLabel,  setSaveLabel]  = useState('');
  const [autoSaved,  setAutoSaved]  = useState(false);
  const [error,      setError]      = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const storyIdRef  = useRef<number | null>(null);

  useEffect(() => {
    if (!getToken()) { router.replace('/login'); }
  }, [router]);

  function insertFormatting(format: 'bold' | 'italic' | 'h2' | 'quote') {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end   = ta.selectionEnd;
    const selected = content.slice(start, end);

    if (format === 'h2' || format === 'quote') {
      const prefix = format === 'h2' ? '## ' : '> ';
      const lineStart = content.lastIndexOf('\n', start - 1) + 1;
      const already = content.slice(lineStart).startsWith(prefix);
      const newContent = already
        ? content.slice(0, lineStart) + content.slice(lineStart + prefix.length)
        : content.slice(0, lineStart) + prefix + content.slice(lineStart);
      setContent(newContent);
      const offset = already ? -prefix.length : prefix.length;
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + offset; ta.focus(); }, 0);
      return;
    }

    const [before, after] = format === 'bold' ? ['**', '**'] : ['_', '_'];
    const newContent = content.slice(0, start) + before + selected + after + content.slice(end);
    setContent(newContent);
    setTimeout(() => {
      ta.selectionStart = start + before.length;
      ta.selectionEnd   = start + before.length + selected.length;
      ta.focus();
    }, 0);
  }

  /* auto-save (debounced 2s) */
  useEffect(() => {
    if (!title.trim() && !content.trim()) return;
    const timer = setTimeout(async () => {
      try {
        if (!storyIdRef.current) {
          const story = await storiesApi.create({
            title: title.trim() || 'Sans titre',
            content: content.trim() || ' ',
            visibility: 'PRIVATE',
          });
          storyIdRef.current = story.id;
        } else {
          await storiesApi.update(storyIdRef.current, {
            title: title.trim() || 'Sans titre',
            content: content.trim() || ' ',
          });
        }
        setAutoSaved(true);
      } catch {
        // silent — don't disrupt writing
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [title, content]); // eslint-disable-line react-hooks/exhaustive-deps

  /* auto-resize textarea */
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = ta.scrollHeight + 'px';
  }, [content]);

  function addTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter' && e.key !== ',') return;
    e.preventDefault();
    const t = tagInput.trim().replace(/^#/, '');
    if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
    setTagInput('');
  }

  function removeTag(t: string) {
    setTags(prev => prev.filter(x => x !== t));
  }

  async function handlePublish() {
    if (!title.trim())   { setError('Le titre est obligatoire.'); return; }
    if (!content.trim()) { setError('Le contenu est obligatoire.'); return; }
    setSaving(true);
    setError('');
    try {
      let story;
      if (storyIdRef.current) {
        story = await storiesApi.update(storyIdRef.current, {
          title: title.trim(),
          content: content.trim(),
          visibility,
          mainTheme: theme,
          tags,
        });
      } else {
        story = await storiesApi.create({
          title: title.trim(),
          content: content.trim(),
          visibility,
          mainTheme: theme,
          tags,
        });
      }
      setSaveLabel('Publié !');
      router.push(`/stories/${story.id}`);
    } catch {
      setError('Une erreur est survenue. Réessayez.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-[#FBFAF4]" style={{ fontFamily: 'var(--font-body), sans-serif' }}>
      <Sidebar collapsed />

      {/* ── Editor + Right panel ── */}
      <div className="flex min-w-0 min-h-screen flex-1 flex-col pb-24 lg:flex-row lg:pb-0">

        {/* ── Editor ── */}
        <div className="relative flex min-w-0 flex-1 flex-col px-4 pt-6 pb-0 lg:px-[24px] lg:pt-[48px]">

          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Titre de l'histoire"
            className="min-w-0 w-full bg-transparent text-[36px] font-medium text-[#22221F] placeholder:text-[#E5E3D5] outline-none leading-tight mb-6 lg:text-[56px]"
            style={{ fontFamily: 'var(--font-display), sans-serif' }}
          />

          {/* Divider */}
          <div className="h-px bg-[#E5E3D5] mb-6" />

          {/* Content textarea */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Commencer à écrire de l'histoire"
            className="min-w-0 flex-1 w-full bg-transparent text-[16px] font-medium text-[#22221F] placeholder:text-[#585852] outline-none resize-none leading-[1.7] pb-[80px]"
            style={{ fontFamily: 'var(--font-body), sans-serif', minHeight: '400px' }}
          />

          {/* Bottom formatting toolbar */}
          <div className="sticky bottom-0 flex max-w-full justify-end overflow-x-auto pb-4">
            <div className="flex shrink-0 items-center gap-0 bg-[#FBFAF4] border border-[#E5E3D5] rounded-[8px] px-2 py-1">
              {([
                { el: <BoldIcon />,   title: 'Gras',     fmt: 'bold'   as const },
                { el: <ItalicIcon />, title: 'Italique', fmt: 'italic' as const },
              ] as { el: React.ReactElement; title: string; fmt: 'bold' | 'italic' }[]).map(({ el, title: t, fmt }) => (
                <button key={t} title={t} onMouseDown={e => { e.preventDefault(); insertFormatting(fmt); }}
                  className="w-[30px] h-[30px] flex items-center justify-center text-[#585852] hover:text-[#22221F] hover:bg-[#E5E3D5] rounded-[4px] transition-colors">
                  {el}
                </button>
              ))}
              <div className="w-px h-4 bg-[#E5E3D5] mx-1" />
              {([
                { el: <H2Icon />,    title: 'Titre H2', fmt: 'h2'    as const },
                { el: <QuoteIcon />, title: 'Citation', fmt: 'quote' as const },
                { el: <ImageIcon />, title: 'Image',    fmt: null },
              ] as { el: React.ReactElement; title: string; fmt: 'h2' | 'quote' | null }[]).map(({ el, title: t, fmt }) => (
                <button key={t} title={t}
                  onMouseDown={fmt ? (e => { e.preventDefault(); insertFormatting(fmt); }) : undefined}
                  className="w-[30px] h-[30px] flex items-center justify-center text-[#585852] hover:text-[#22221F] hover:bg-[#E5E3D5] rounded-[4px] transition-colors">
                  {el}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right panel "Paramètres" ── */}
        <div
          className="flex min-w-0 w-full flex-col border-t border-[#E5E3D5] pt-8 pb-8 lg:w-[362px] lg:shrink-0 lg:border-l lg:border-t-0 lg:pt-[48px] overflow-y-auto"
          style={{ fontFamily: 'var(--font-body), sans-serif' }}
        >
          <div className="flex min-w-0 flex-col gap-0 px-4 lg:px-8">

            {/* Header */}
            <div className="mb-6 flex min-w-0 items-center justify-between gap-3">
              <span className="text-[22px] font-medium text-[#22221F]" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
                Paramètres
              </span>
              <span className="flex items-center gap-[6px] bg-[#E5E3D5] rounded-full px-3 py-[4px]">
                <span className={`w-1 h-1 rounded-full ${autoSaved ? 'bg-[#22221F]' : 'bg-[#F37E40]'}`} />
                <span className="text-[12px] font-normal text-[#22221F]">
                  {autoSaved ? 'Sauvegardé' : 'Brouillons'}
                </span>
              </span>
            </div>

            {/* Save status */}
            {saveLabel && (
              <div className="flex items-center gap-3 bg-[#E5E3D5] rounded-[8px] px-4 py-3 mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22221F" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <span className="text-[14px] font-normal text-[#22221F]">{saveLabel}</span>
              </div>
            )}

            {/* Visibilité */}
            <p className="text-[16px] font-medium text-[#22221F] mb-4" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
              Visibilité
            </p>
            <div className="flex flex-col gap-0 mb-8">
              {VISIBILITY_OPTIONS.map(({ value, label, sub, Icon }) => {
                const selected = visibility === value;
                return (
                  <button
                    key={value}
                    onClick={() => setVisibility(value)}
                    className={`flex items-center gap-4 px-4 py-4 rounded-[8px] transition-colors text-left ${
                      selected ? 'bg-white' : 'bg-[#FBFAF4] hover:bg-[#F5F4EE]'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      selected ? 'bg-[#22221F] text-white' : 'bg-[#E5E3D5] text-[#585852]'
                    }`}>
                      <Icon />
                    </div>
                    <div className="flex flex-col gap-[2px]">
                      <span className="text-[16px] font-medium text-[#22221F]">{label}</span>
                      <span className="text-[14px] font-normal text-[#22221F]">{sub}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="h-px bg-[#E5E3D5] mb-6" />

            {/* Tonalité */}
            <p className="text-[16px] font-medium text-[#22221F] mb-4" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
              Tonalité
            </p>
            <div className="mb-8 flex flex-wrap items-center gap-[14px]">
              {TONE_OPTIONS.map(({ theme: t, color }) => {
                const selected = theme === t;
                return (
                  <button
                    key={t}
                    onClick={() => setTheme(selected ? null : t)}
                    className="relative flex items-center justify-center"
                    title={t}
                  >
                    {selected && (
                      <span className="absolute inset-0 rounded-full border-2 border-[#22221F] scale-[1.2]" />
                    )}
                    <span
                      className="w-10 h-10 rounded-full block"
                      style={{ backgroundColor: color }}
                    />
                    {selected && (
                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#22221F]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="h-px bg-[#E5E3D5] mb-6" />

            {/* Étiquettes */}
            <p className="text-[16px] font-medium text-[#22221F] mb-3" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
              Étiquettes (Tags)
            </p>
            <div className="mb-3 flex min-w-0 items-center gap-2 rounded-[8px] border border-[#E5E3D5] bg-white px-3 py-[10px]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#585852" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
              </svg>
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={addTag}
                placeholder="Famille, voyage, ..."
                className="min-w-0 flex-1 bg-transparent text-[14px] text-[#22221F] placeholder:text-[#E5E3D5] outline-none"
              />
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map(t => (
                  <span
                    key={t}
                    className="flex items-center gap-1 bg-[#E5E3D5] rounded-full px-3 py-[6px] text-[12px] font-medium text-[#22221F]"
                  >
                    <button
                      onClick={() => removeTag(t)}
                      className="w-4 h-4 flex items-center justify-center hover:opacity-70"
                    >
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="#22221F" strokeWidth="2" strokeLinecap="round">
                        <line x1="1" y1="1" x2="7" y2="7"/><line x1="7" y1="1" x2="1" y2="7"/>
                      </svg>
                    </button>
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="text-[13px] text-red-500 mb-4">{error}</p>
            )}

            {/* Publish button */}
            <button
              onClick={handlePublish}
              disabled={saving}
              className="flex items-center justify-center gap-3 w-full h-[48px] bg-[#22221F] rounded-[8px] text-[16px] font-medium text-[#FBFAF4] hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ fontFamily: 'var(--font-display), sans-serif' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FBFAF4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
              {saving ? 'Publication…' : 'Publier'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
