export type ToastType = 'published' | 'saved' | 'invited' | 'folder' | 'pdf' | 'draft';

export interface ToastEvent {
  type: ToastType;
  message: string;
}

type Listener = (e: ToastEvent) => void;
const listeners: Listener[] = [];

export function toast(type: ToastType, message: string): void {
  listeners.forEach(fn => fn({ type, message }));
}

export function subscribeToast(fn: Listener): () => void {
  listeners.push(fn);
  return () => {
    const i = listeners.indexOf(fn);
    if (i >= 0) listeners.splice(i, 1);
  };
}
