import { useCallback, useMemo, useState } from 'react';
import { CrossIcon } from '../../icons';
import { ToastContext, type ShowToast, type ToastType } from './toastContext';
import styles from './Toast.module.scss';

type ToastItem = {
  id: number;
  type: ToastType;
  message: string;
};

const DISMISS_MS = 4000;

let nextId = 0;

function ToastView({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: number) => void;
}) {
  return (
    <div className={`${styles.toast} ${styles[toast.type]}`} role="status">
      <p className={styles.message}>{toast.message}</p>
      <button
        type="button"
        className={styles.close}
        aria-label="Закрыть"
        onClick={() => onDismiss(toast.id)}
      >
        <CrossIcon />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback<ShowToast>((type, message) => {
    const id = nextId;
    nextId += 1;
    setToasts((current) => [...current, { id, type, message }]);
    window.setTimeout(() => dismiss(id), DISMISS_MS);
  }, [dismiss]);

  const value = useMemo(() => showToast, [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={styles.stack} aria-live="polite">
        {toasts.map((toast) => (
          <ToastView key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
