'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/api/auth';
import { usersApi, type Contact, type UserSearchResult } from '@/lib/api/users';
import Sidebar from '@/components/layout/Sidebar';

/* ── Avatar colors cycle ── */
const AVATAR_COLORS = ['#E6A8D9', '#AFE391', '#6481DC', '#F37E40', '#E5E3D5', '#22221F'];
const AVATAR_TEXT   = ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#22221F', '#FBFAF4'];

function avatarProps(id: number) {
  const i = id % AVATAR_COLORS.length;
  return { bg: AVATAR_COLORS[i], text: AVATAR_TEXT[i] };
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

/* ── Close contact avatar ── */
function ContactBubble({ contact }: { contact: Contact }) {
  const { bg, text } = avatarProps(contact.id);
  return (
    <div className="flex flex-col items-center gap-2" style={{ width: 100 }}>
      <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center overflow-hidden shrink-0"
        style={{ backgroundColor: bg }}>
        {contact.photo
          ? <img src={contact.photo} alt={contact.displayName} className="w-full h-full object-cover" />
          : <span className="text-[20px] font-bold" style={{ color: text }}>{initials(contact.displayName)}</span>
        }
      </div>
      <span className="text-[12px] font-medium text-[#22221F] text-center leading-tight line-clamp-1 w-full"
        style={{ fontFamily: 'var(--font-display), sans-serif' }}>
        {contact.displayName.split(' ')[0]}
      </span>
    </div>
  );
}

/* ── Suggestion card (355×260) ── */
function SuggestionCard({ user, onFollow }: { user: UserSearchResult; onFollow: (id: number) => void }) {
  const { bg, text } = avatarProps(user.id);
  const [sent, setSent] = useState(user.pendingRequest);

  async function handleFollow() {
    if (sent || user.alreadyFriend) return;
    try {
      await usersApi.sendRequest(user.id);
      setSent(true);
      onFollow(user.id);
    } catch { /* silent */ }
  }

  return (
    <div className="bg-white rounded-[12px] flex flex-col p-6 gap-0" style={{ width: 355, height: 260 }}>
      {/* Top row: avatar + name/desc */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
          style={{ backgroundColor: bg }}>
          {user.photo
            ? <img src={user.photo} alt={user.displayName} className="w-full h-full object-cover" />
            : <span className="text-[20px] font-bold" style={{ color: text }}>{initials(user.displayName)}</span>
          }
        </div>
        <div className="flex flex-col gap-[2px]">
          <span className="text-[18px] font-medium text-[#22221F]"
            style={{ fontFamily: 'var(--font-display), sans-serif' }}>
            {user.displayName}
          </span>
          {user.pseudo && (
            <span className="text-[12px] font-medium text-[#585852]">@{user.pseudo}</span>
          )}
        </div>
      </div>

      {/* Quote placeholder */}
      <p className="text-[13px] font-normal text-[#585852] mb-auto line-clamp-2">
        {user.alreadyFriend ? 'Déjà dans vos proches.' : 'Découvrez ses récits et son univers.'}
      </p>

      {/* Follow button */}
      <button
        onClick={handleFollow}
        disabled={sent || user.alreadyFriend}
        className="w-full h-[44px] rounded-[8px] flex items-center justify-center text-[14px] font-medium transition-opacity
          disabled:opacity-50"
        style={{
          backgroundColor: user.alreadyFriend ? '#E5E3D5' : '#22221F',
          color: user.alreadyFriend ? '#22221F' : '#FBFAF4',
          fontFamily: 'var(--font-display), sans-serif',
        }}
      >
        {user.alreadyFriend ? 'Déjà proche' : sent ? 'Demande envoyée' : 'Suivre'}
      </button>
    </div>
  );
}

/* ── Tabs ── */
const TABS = ['Proches', 'Abonnements', 'Abonnés', 'Suggestions'] as const;
type Tab = typeof TABS[number];

export default function NetworkPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('Proches');
  const [contacts,    setContacts]    = useState<Contact[]>([]);
  const [suggestions, setSuggestions] = useState<UserSearchResult[]>([]);
  const [search,      setSearch]      = useState('');
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    if (!getToken()) { router.replace('/login'); return; }
    Promise.all([
      usersApi.getContacts(),
      usersApi.search('a'),
    ]).then(([c, s]) => {
      setContacts(c);
      setSuggestions(s.filter(u => !u.alreadyFriend).slice(0, 6));
    }).catch(() => {}).finally(() => setLoading(false));
  }, [router]);

  const handleSearch = useCallback(async (q: string) => {
    if (!q.trim()) return;
    try {
      const res = await usersApi.search(q);
      setSuggestions(res.slice(0, 6));
    } catch { /* silent */ }
  }, []);

  const filtered = search.trim()
    ? contacts.filter(c => c.displayName.toLowerCase().includes(search.toLowerCase()))
    : contacts;

  return (
    <div className="flex min-h-screen bg-[#FBFAF4]" style={{ fontFamily: 'var(--font-body), sans-serif' }}>
      <Sidebar />

      <div className="flex-1 px-12 pt-[48px] pb-16">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-8 mb-8">
          <div className="flex flex-col gap-[14px]">
            <h1 className="text-[40px] font-medium text-[#22221F]"
              style={{ fontFamily: 'var(--font-display), sans-serif' }}>
              Mon réseau
            </h1>
            <p className="text-[16px] font-normal text-[#22221F]">
              Suivez les voix qui vous inspirent et tissez des liens durables.
            </p>
          </div>

          {/* Search + Invite */}
          <div className="flex flex-col gap-3 shrink-0">
            <div className="flex items-center gap-[7px] h-[42px] w-[436px] bg-[#E5E3D5] rounded-[12px] px-6">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#585852" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); handleSearch(e.target.value); }}
                placeholder="Rechercher"
                className="flex-1 bg-transparent text-[16px] font-medium text-[#585852] placeholder:text-[#585852] outline-none"
                style={{ fontFamily: 'var(--font-display), sans-serif' }}
              />
            </div>
            <div className="flex justify-end">
              <button className="flex items-center gap-2 h-[54px] px-6 bg-[#22221F] rounded-[8px] text-[14px] font-medium text-[#FBFAF4] hover:opacity-90 transition-opacity"
                style={{ fontFamily: 'var(--font-display), sans-serif' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FBFAF4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Inviter un proche
              </button>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-2 mb-8">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="h-[44px] px-5 rounded-[8px] text-[13px] font-medium transition-colors"
              style={{
                backgroundColor: activeTab === tab ? '#22221F' : '#FFFFFF',
                color: activeTab === tab ? '#FBFAF4' : '#22221F',
                fontFamily: 'var(--font-display), sans-serif',
              }}
            >
              {tab}{tab === 'Proches' ? ` · ${contacts.length}` : ''}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="animate-pulse flex flex-col gap-6">
            <div className="flex gap-4">
              {[1,2,3,4,5].map(i => <div key={i} className="w-[72px] h-[72px] rounded-full bg-[#E5E3D5]" />)}
            </div>
            <div className="grid grid-cols-3 gap-5">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-[260px] bg-[#E5E3D5] rounded-[12px]" />)}
            </div>
          </div>
        ) : (
          <>
            {/* ── Proches section ── */}
            {activeTab === 'Proches' && (
              <>
                <h2 className="text-[20px] font-medium text-[#22221F] mb-5"
                  style={{ fontFamily: 'var(--font-display), sans-serif' }}>
                  Vos proches
                </h2>
                {filtered.length === 0 ? (
                  <p className="text-[14px] text-[#585852] mb-8">Aucun proche pour l&apos;instant.</p>
                ) : (
                  <div className="flex gap-0 overflow-x-auto pb-4 mb-10">
                    {filtered.map(c => <ContactBubble key={c.id} contact={c} />)}
                  </div>
                )}
              </>
            )}

            {/* ── Suggestions section ── */}
            {(activeTab === 'Proches' || activeTab === 'Suggestions') && (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-[20px] font-medium text-[#22221F]"
                    style={{ fontFamily: 'var(--font-display), sans-serif' }}>
                    Suggestions pour vous
                  </h2>
                  <span className="text-[14px] font-medium text-[#6481DC] cursor-pointer hover:underline">
                    Voir tout →
                  </span>
                </div>

                {suggestions.length === 0 ? (
                  <p className="text-[14px] text-[#585852]">Aucune suggestion disponible.</p>
                ) : (
                  <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(3, 355px)' }}>
                    {suggestions.map(u => (
                      <SuggestionCard
                        key={u.id}
                        user={u}
                        onFollow={() => setSuggestions(prev =>
                          prev.map(x => x.id === u.id ? { ...x, pendingRequest: true } : x)
                        )}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Other tabs placeholder */}
            {(activeTab === 'Abonnements' || activeTab === 'Abonnés') && (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <p className="text-[16px] text-[#585852]">Bientôt disponible.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
