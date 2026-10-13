import { useEffect } from 'react';

// Shared across all dialogs: locks can overlap and close in any order.
let lockCount = 0;
let originalOverflow = '';

export function useDialogLock(active = true) {
  useEffect(() => {
    if (!active) {
      return;
    }

    if (lockCount === 0) {
      originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    lockCount += 1;

    return () => {
      lockCount -= 1;

      if (lockCount === 0) {
        document.body.style.overflow = originalOverflow;
      }
    };
  }, [active]);
}
