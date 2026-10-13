import { useState } from 'react';
import { useCatalogFormKeys } from './useCatalogFormKeys';
import Button from '../../components/Button';
import TextareaInput from '../../components/TextareaInput';
import TextInput from '../../components/TextInput';
import { useCreateServiceItem } from './hooks/useCreateServiceItem';
import { useGetServiceItem } from './hooks/useGetServiceItem';
import { useUpdateServiceItem } from './hooks/useUpdateServiceItem';
import styles from './Admin.module.scss';

type ServiceItemFormProps = {
  id: number;
  onClose: () => void;
};

function ServiceItemForm({ id, onClose }: ServiceItemFormProps) {
  const { data, isLoading, isError, error } = useGetServiceItem(id);
  const updateServiceItem = useUpdateServiceItem();
  const [name, setName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const nameValue = name ?? data?.name ?? '';
  const descriptionValue = description ?? data?.description ?? '';
  const canSave =
    !!data &&
    !isLoading &&
    !isError &&
    !!nameValue.trim() &&
    !updateServiceItem.isPending;

  const save = () => {
    if (!canSave) {
      return;
    }

    updateServiceItem.mutate(
      {
        id,
        payload: {
          name: nameValue.trim(),
          description: descriptionValue.trim(),
        },
      },
      { onSuccess: onClose },
    );
  };

  useCatalogFormKeys({
    onCancel: onClose,
    onSubmit: save,
    canSubmit: canSave,
    onShowErrors: () => setShowErrors(true),
  });

  if (isLoading) {
    return <p className={styles.empty}>Загружаем услугу...</p>;
  }

  if (isError || !data) {
    return (
      <p className={styles.empty}>
        {error instanceof Error ? error.message : 'Не удалось загрузить услугу'}
      </p>
    );
  }

  return (
    <div className={styles.catalogForm}>
      <TextInput
        label="Название"
        required
        value={nameValue}
        onChange={(event) => setName(event.target.value)}
        error={
          showErrors && !nameValue.trim() ? 'Введите название' : undefined
        }
      />
      <TextareaInput
        label="Описание"
        value={descriptionValue}
        onChange={(event) => setDescription(event.target.value)}
      />
      <div className={styles.catalogFormActions}>
        <Button type="button" onClick={onClose}>
          Отмена
        </Button>
        <span
          className={styles.saveButton}
          onMouseEnter={() => setShowErrors(true)}
        >
          <Button
            type="button"
            cta
            disabled={!canSave}
            onClick={save}
          >
            Сохранить
          </Button>
        </span>
      </div>
    </div>
  );
}

type CreateServiceItemFormProps = {
  workspaceTypeId: number;
  onClose: () => void;
};

export function CreateServiceItemForm({
  workspaceTypeId,
  onClose,
}: CreateServiceItemFormProps) {
  const createServiceItem = useCreateServiceItem();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const canSave = !!name.trim() && !createServiceItem.isPending;

  const save = () => {
    if (!canSave) {
      return;
    }

    createServiceItem.mutate(
      {
        workspaceTypeId,
        payload: {
          name: name.trim(),
          description: description.trim(),
        },
      },
      { onSuccess: onClose },
    );
  };

  useCatalogFormKeys({
    onCancel: onClose,
    onSubmit: save,
    canSubmit: canSave,
    onShowErrors: () => setShowErrors(true),
  });

  return (
    <div className={styles.catalogForm}>
      <TextInput
        label="Название"
        required
        value={name}
        onChange={(event) => setName(event.target.value)}
        error={showErrors && !name.trim() ? 'Введите название' : undefined}
      />
      <TextareaInput
        label="Описание"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <div className={styles.catalogFormActions}>
        <Button type="button" onClick={onClose}>
          Отмена
        </Button>
        <span
          className={styles.saveButton}
          onMouseEnter={() => setShowErrors(true)}
        >
          <Button
            type="button"
            cta
            disabled={!canSave}
            onClick={save}
          >
            Сохранить
          </Button>
        </span>
      </div>
    </div>
  );
}

export default ServiceItemForm;
