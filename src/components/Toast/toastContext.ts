import { createContext, useContext } from 'react';

export type ToastType = 'notification' | 'success' | 'error';

export type ShowToast = (type: ToastType, message: string) => void;

export const ToastContext = createContext<ShowToast | null>(null);

export function useToast() {
  const showToast = useContext(ToastContext);

  if (!showToast) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return showToast;
}
