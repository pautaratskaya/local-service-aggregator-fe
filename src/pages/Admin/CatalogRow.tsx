import Button from '../../components/Button';
import styles from './Admin.module.scss';

type CatalogRowProps = {
  name: string;
  description?: string | null;
  open?: boolean;
  onOpen?: () => void;
  onEdit: () => void;
  onDelete?: () => void;
  deleteDisabled?: boolean;
  children?: React.ReactNode;
};

function CatalogRow({
  name,
  description,
  open = false,
  onOpen,
  onEdit,
  onDelete,
  deleteDisabled = false,
  children,
}: CatalogRowProps) {
  const title = (
    <>
      <span className={styles.catalogName}>{name}</span>
      {description ? (
        <span className={styles.catalogDescription}>{description}</span>
      ) : null}
    </>
  );

  return (
    <li
      className={`${styles.catalogItem} ${open ? styles.catalogItemOpen : ''}`}
    >
      <div className={styles.catalogRow}>
        {onOpen ? (
          <button type="button" className={styles.catalogOpen} onClick={onOpen}>
            {title}
          </button>
        ) : (
          <div className={styles.catalogOpen}>{title}</div>
        )}
        <div className={styles.catalogActions}>
          <Button type="button" onClick={onEdit}>
            Изменить
          </Button>
          <Button type="button" disabled={deleteDisabled} onClick={onDelete}>
            Удалить
          </Button>
        </div>
      </div>
      {children}
    </li>
  );
}

export default CatalogRow;
