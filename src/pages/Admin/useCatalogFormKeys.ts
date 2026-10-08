import { useEffect } from 'react';

type UseCatalogFormKeysArgs = {
  onCancel: () => void;
  onSubmit: () => void;
  canSubmit: boolean;
  onShowErrors: () => void;
};

export function useCatalogFormKeys({
  onCancel,
  onSubmit,
  canSubmit,
  onShowErrors,
}: UseCatalogFormKeysArgs) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCancel();
        return;
      }

      if (event.key !== 'Enter' || event.shiftKey) {
        return;
      }

      if (event.target instanceof HTMLTextAreaElement) {
        return;
      }

      event.preventDefault();

      if (!canSubmit) {
        onShowErrors();
        return;
      }

      onSubmit();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onCancel, onSubmit, canSubmit, onShowErrors]);
}
