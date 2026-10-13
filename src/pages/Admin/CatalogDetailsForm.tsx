import { useState } from 'react';
import { useCatalogFormKeys } from './useCatalogFormKeys';
import Button from '../../components/Button';
import TextareaInput from '../../components/TextareaInput';
import TextInput from '../../components/TextInput';
import styles from './Admin.module.scss';

type CatalogDetails = {
  name: string;
  description: string;
};

type WorkspaceTypeDetails = CatalogDetails & {
  specialistName: string;
};

type CatalogDetailsFormBase = {
  name?: string | null;
  description?: string | null;
  isLoading?: boolean;
  loadingMessage?: string;
  loadError?: string;
  onCancel: () => void;
  isPending?: boolean;
  canSubmit?: boolean;
};

type CatalogDetailsFormProps = CatalogDetailsFormBase &
  (
    | {
        withSpecialist?: false;
        specialistName?: never;
        onSubmit?: (payload: CatalogDetails) => void;
      }
    | {
        withSpecialist: true;
        specialistName?: string;
        onSubmit?: (payload: WorkspaceTypeDetails) => void;
      }
  );

function CatalogDetailsForm({
  name: sourceName,
  description: sourceDescription,
  specialistName: sourceSpecialist,
  isLoading = false,
  loadingMessage = 'Загружаем...',
  loadError,
  onCancel,
  isPending = false,
  canSubmit = true,
  ...props
}: CatalogDetailsFormProps) {
  const [name, setName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [specialistName, setSpecialistName] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const nameValue = name ?? sourceName ?? '';
  const descriptionValue = description ?? sourceDescription ?? '';
  const specialistValue = specialistName ?? sourceSpecialist ?? '';
  const canSave =
    canSubmit &&
    !!nameValue.trim() &&
    (!props.withSpecialist || !!specialistValue.trim()) &&
    !isPending &&
    !isLoading &&
    !loadError;

  const save = () => {
    if (!canSave || !props.onSubmit) {
      return;
    }

    const details = {
      name: nameValue.trim(),
      description: descriptionValue.trim(),
    };

    if (props.withSpecialist) {
      props.onSubmit({
        ...details,
        specialistName: specialistValue.trim(),
      });
      return;
    }

    props.onSubmit(details);
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
      {props.withSpecialist && (
        <TextInput
          label="Специалист"
          required
          value={specialistValue}
          onChange={(event) => setSpecialistName(event.target.value)}
          error={
            showErrors && !specialistValue.trim()
              ? 'Введите название специалиста'
              : undefined
          }
        />
      )}
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
