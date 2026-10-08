import { useState } from 'react';
import { useCatalogFormKeys } from './useCatalogFormKeys';
import Button from '../../components/Button';
import TextareaInput from '../../components/TextareaInput';
import TextInput from '../../components/TextInput';
import styles from './Admin.module.scss';

type CatalogDetailsFormProps = {
  name?: string | null;
  description?: string | null;
  isLoading?: boolean;
  loadingMessage?: string;
  loadError?: string;
  onCancel: () => void;
  onSubmit?: (payload: { name: string; description: string }) => void;
  isPending?: boolean;
  canSubmit?: boolean;
};

function CatalogDetailsForm({
  name: sourceName,
  description: sourceDescription,
  isLoading = false,
  loadingMessage = 'Загружаем...',
  loadError,
  onCancel,
  onSubmit,
  isPending = false,
  canSubmit = true,
}: CatalogDetailsFormProps) {
  const [name, setName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const nameValue = name ?? sourceName ?? '';
  const descriptionValue = description ?? sourceDescription ?? '';
  const canSave = canSubmit && !!nameValue.trim() && !isPending && !isLoading && !loadError;

  const save = () => {
    if (!canSave || !onSubmit) {
      return;
    }

    onSubmit({
      name: nameValue.trim(),
      description: descriptionValue.trim(),
    });
  };

  useCatalogFormKeys({
    onCancel,
    onSubmit: save,
    canSubmit: canSave,
    onShowErrors: () => setShowErrors(true),
  });

  if (isLoading) {
    return <p className={styles.empty}>{loadingMessage}</p>;
  }

  if (loadError) {
    return <p className={styles.empty}>{loadError}</p>;
  }

  return (
    <div className={styles.catalogForm}>
      <TextInput
        label="Название"
        required
        value={nameValue}
        onChange={(event) => setName(event.target.value)}
        error={showErrors && !nameValue.trim() ? 'Введите название' : undefined}
      />
      <TextareaInput
        label="Описание"
        value={descriptionValue}
        onChange={(event) => setDescription(event.target.value)}
      />
      <div className={styles.catalogFormActions}>
        <Button type="button" onClick={onCancel}>
          Отмена
        </Button>
        <span
          className={styles.saveButton}
          onMouseEnter={() => setShowErrors(true)}
        >
          <Button type="button" cta disabled={!canSave} onClick={save}>
            Сохранить
          </Button>
        </span>
      </div>
    </div>
  );
}

export default CatalogDetailsForm;
