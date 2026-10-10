import { useEffect } from 'react';

type UseCatalogFormKeysArgs = {
  onCancel: () => void;
  onSubmit: () => void;
  canSubmit: boolean;
  onShowErrors: () => void;
  submitFromTextarea?: boolean;
};

export function useCatalogFormKeys({
  onCancel,
  onSubmit,
  canSubmit,
  onShowErrors,
  submitFromTextarea = false,
}: UseCatalogFormKeysArgs) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (submitFromTextarea) {
          event.stopPropagation();
        }
        onCancel();
        return;
      }

      if (event.key !== 'Enter' || event.shiftKey) {
        return;
      }

      if (
        !submitFromTextarea &&
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      event.preventDefault();
      if (submitFromTextarea) {
        event.stopPropagation();
      }

      if (!canSubmit) {
        onShowErrors();
        return;
      }

      onSubmit();
    };

    document.addEventListener('keydown', onKeyDown, submitFromTextarea);
    return () =>
      document.removeEventListener('keydown', onKeyDown, submitFromTextarea);
  }, [onCancel, onSubmit, canSubmit, onShowErrors, submitFromTextarea]);
}
