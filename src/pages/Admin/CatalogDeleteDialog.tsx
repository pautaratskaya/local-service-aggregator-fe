import Button from '../../components/Button';
import { useDialogLock } from '../../hooks/useDialogLock';
import styles from './Admin.module.scss';
import { useCatalogFormKeys } from './useCatalogFormKeys';

export type CatalogDeleteKind = 'services' | 'types' | 'typesAndServices';

type CatalogDeleteDialogProps = {
  name: string;
  kind?: CatalogDeleteKind;
  isPending?: boolean;
  error?: unknown;
  onCancel: () => void;
  onConfirm: () => void;
};

const deleteCopy: Record<CatalogDeleteKind, string> = {
  services: 'Вместе с этим удалятся все услуги.',
  types: 'Вместе с этим удалится всё внутри: типы помещений.',
  typesAndServices:
    'Вместе с этим удалится всё внутри: типы помещений и услуги.',
};

function CatalogDeleteDialog({
  name,
  kind,
  isPending = false,
  error,
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
        <p>{kind ? deleteCopy[kind] : 'Это действие нельзя отменить.'}</p>
        {error != null && (
          <p className={styles.deleteError}>
            {error instanceof Error ? error.message : 'Не удалось удалить'}
          </p>
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
