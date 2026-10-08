import { useEffect, useRef, useState } from 'react';
import Button from '../../components/Button';
import styles from './Admin.module.scss';

type AddCatalogItemProps = {
  label: string;
  dismissKey?: number | null;
  onOpen?: () => void;
  form: (onClose: () => void) => React.ReactNode;
  children: (view: {
    button: React.ReactNode;
    form: React.ReactNode;
  }) => React.ReactNode;
};

function AddCatalogItem({
  label,
  dismissKey,
  onOpen,
  form,
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

  const close = () => setOpen(false);

  return children({
    button: open ? null : (
      <Button
        type="button"
        cta
        className={styles.addCatalogItem}
        onClick={() => {
          onOpen?.();
          setOpen(true);
        }}
      >
        {label}
      </Button>
    ),
    form: open ? form(close) : null,
  });
}

export default AddCatalogItem;
