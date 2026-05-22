'use client';

import { useEffect, useState } from 'react';
import { subscribeToast, type ToastType } from '@/lib/toast';

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

function ToastIcon({ type }: { type: ToastType }) {
  switch (type) {
    case 'published':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    case 'saved':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6481DC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      );
    case 'invited':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E6A8D9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
        </svg>
      );
    case 'folder':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#AEE290" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      );
    case 'pdf':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F37E40" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
        </svg>
      );
    case 'draft':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#AEE290" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
      );
  }
}

function ToastCard({ item, onRemove }: { item: ToastItem; onRemove: (id: string) => void }) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const start = Date.now();
    const duration = 3000;
    let rafId: number;
    const tick = () => {
      const elapsed = Date.now() - start;
      setProgress(Math.max(0, 100 - (elapsed / duration) * 100));
      if (elapsed < duration) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="relative flex items-center gap-3 bg-[#22221F] rounded-[12px] px-4 py-[14px] min-w-[300px] max-w-[380px] shadow-xl overflow-hidden">
      <ToastIcon type={item.type} />
      <span className="flex-1 text-[14px] font-medium text-[#FBFAF4] leading-snug">{item.message}</span>
      <button
        onClick={() => onRemove(item.id)}
        className="ml-1 w-6 h-6 flex items-center justify-center text-[#585852] hover:text-[#FBFAF4] transition-colors shrink-0"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="1" y1="1" x2="9" y2="9" /><line x1="9" y1="1" x2="1" y2="9" />
        </svg>
      </button>
      <div
        className="absolute bottom-0 left-0 h-[3px] bg-white/25"
        style={{ width: `${progress}%`, transition: 'width 100ms linear' }}
      />
    </div>
  );
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    return subscribeToast(({ type, message }) => {
      const id = Math.random().toString(36).slice(2);
      setToasts(prev => [...prev, { id, type, message }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 3500);
    });
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
      {toasts.map(item => (
        <div key={item.id} className="pointer-events-auto">
          <ToastCard
            item={item}
            onRemove={id => setToasts(prev => prev.filter(t => t.id !== id))}
          />
        </div>
      ))}
    </div>
  );
}
