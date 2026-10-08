import { useEffect, useRef, useState } from 'react';
import Button from '../../components/Button';
import styles from './Admin.module.scss';

type AddCatalogItemProps = {
  label: string;
  dismissKey?: number | null;
  onOpen?: () => void;
  children: (onClose: () => void) => React.ReactNode;
};

function AddCatalogItem({
  label,
  dismissKey,
  onOpen,
  children,
}: AddCatalogItemProps) {
  const [open, setOpen] = useState(false);
  const previousDismissKey = useRef(dismissKey);

  useEffect(() => {
    if (previousDismissKey.current !== dismissKey && dismissKey != null) {
      setOpen(false);
    }

    previousDismissKey.current = dismissKey;
  }, [dismissKey]);

  if (open) {
    return children(() => setOpen(false));
  }

  return (
    <Button
      type="button"
      className={styles.addCatalogItem}
      onClick={() => {
        onOpen?.();
        setOpen(true);
      }}
    >
      {label}
    </Button>
  );
}

export default AddCatalogItem;
