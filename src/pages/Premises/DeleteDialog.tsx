import { useEffect } from 'react';
import Button from '../../components/Button';
import { useDialogLock } from '../../hooks/useDialogLock';
import styles from './Premises.module.scss';

type DeleteDialogProps = {
  title: string;
  message: string;
  isPending: boolean;
  error?: unknown;
  onCancel: () => void;
  onConfirm: () => void;
};

function DeleteDialog({
  title,
  message,
  isPending,
  error,
  onCancel,
  onConfirm,
}: DeleteDialogProps) {
  useDialogLock();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onCancel]);

  return (
    <div className={styles.deleteOverlay} onClick={onCancel}>
      <form
        className={styles.deleteDialog}
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        onSubmit={(event) => {
          event.preventDefault();
          if (!isPending) {
            onConfirm();
          }
        }}
      >
        <h2>{title}</h2>
        <p>{message}</p>
        {error != null && (
          <p className={styles.deleteError}>
            {error instanceof Error ? error.message : 'Не удалось удалить'}
          </p>
        )}
        <div className={styles.deleteActions}>
          <Button type="button" onClick={onCancel} disabled={isPending}>
            Отмена
          </Button>
          <Button type="submit" cta disabled={isPending}>
            Удалить
          </Button>
        </div>
      </form>
    </div>
  );
}

export default DeleteDialog;
