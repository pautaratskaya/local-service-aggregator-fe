import Button from '../../components/Button';
import { useDialogLock } from '../../hooks/useDialogLock';
import styles from './Admin.module.scss';
import { useCatalogFormKeys } from './useCatalogFormKeys';

type CatalogDeleteDialogProps = {
  name: string;
  nested?: string;
  isPending?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

function CatalogDeleteDialog({
  name,
  nested,
  isPending = false,
  onCancel,
  onConfirm,
}: CatalogDeleteDialogProps) {
  useCatalogFormKeys({
    onCancel,
    onSubmit: onConfirm,
    canSubmit: !isPending,
    onShowErrors: () => undefined,
  });

  useDialogLock();

  return (
    <div className={styles.deleteDialogOverlay} onClick={onCancel}>
      <div
        className={styles.deleteDialog}
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <h2>Удалить «{name}»?</h2>
        {nested === 'услуги' ? (
          <p>Удалятся все услуги.</p>
        ) : nested ? (
          <p>Вместе с этим удалится всё внутри: {nested}.</p>
        ) : (
          <p>Это действие нельзя отменить.</p>
        )}
        <div className={styles.catalogFormActions}>
          <Button type="button" onClick={onCancel} disabled={isPending}>
            Отмена
          </Button>
          <Button type="button" cta onClick={onConfirm} disabled={isPending}>
            Удалить
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CatalogDeleteDialog;
