import { useState, useEffect } from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error' | 'star';
  message: string;
}

type Listener = (toasts: ToastMessage[]) => void;
let toastsList: ToastMessage[] = [];
const listeners: Set<Listener> = new Set();

function notify() {
  // Use queueMicrotask/setTimeout to prevent updating ToastContainer during another component's render phase
  if (typeof queueMicrotask === 'function') {
    queueMicrotask(() => {
      listeners.forEach(l => l([...toastsList]));
    });
  } else {
    setTimeout(() => {
      listeners.forEach(l => l([...toastsList]));
    }, 0);
  }
}

export const toast = {
  success: (message: string) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    toastsList = [...toastsList, { id, type: 'success', message }];
    notify();
    setTimeout(() => toast.remove(id), 3500);
  },
  error: (message: string) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    toastsList = [...toastsList, { id, type: 'error', message }];
    notify();
    setTimeout(() => toast.remove(id), 4000);
  },
  star: (message: string) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    toastsList = [...toastsList, { id, type: 'star', message }];
    notify();
    setTimeout(() => toast.remove(id), 4000);
  },
  info: (message: string) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    toastsList = [...toastsList, { id, type: 'info', message }];
    notify();
    setTimeout(() => toast.remove(id), 3500);
  },
  remove: (id: string) => {
    toastsList = toastsList.filter(t => t.id !== id);
    notify();
  }
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>(toastsList);

  useEffect(() => {
    listeners.add(setToasts);
    return () => {
      listeners.delete(setToasts);
    };
  }, []);

  return { toasts, removeToast: toast.remove };
}
