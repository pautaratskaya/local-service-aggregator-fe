import { useLayoutEffect, useMemo, useState } from 'react';
import type { Workspace } from '../../../api/admin/listLandlords';
import type { WorkspaceFormPayload } from '../../../api/landlord/formData';
import { WORKSPACE_PHOTO_CONFIG } from '../../../api/landlord/formData';
import Button from '../../../components/Button';
import CheckboxInput from '../../../components/CheckboxInput';
import FileInput from '../../../components/FileInput';
import PageLoader from '../../../components/PageLoader';
import SelectInput from '../../../components/SelectInput';
import TextareaInput from '../../../components/TextareaInput';
import TextInput from '../../../components/TextInput';
import { premisePhotoToFile } from '../../BecomeLandlord/rejectedPremise';
import formStyles from '../../../components/PremiseForm/PremiseForm.module.scss';
import { useCatalogTree } from '../../../hooks/useCatalogTree';
import { useWorkspaceTypes } from '../../../hooks/useWorkspaceTypes';
import {
  MIN_RENTAL_DURATIONS,
  type MinRentalDurationMinutes,
} from '../../../types/landlord';
import styles from './WorkspaceForm.module.scss';

const MIN_RENT_OPTIONS = [
  { value: String(MIN_RENTAL_DURATIONS.MINUTES_30), label: '30 мин' },
  { value: String(MIN_RENTAL_DURATIONS.MINUTES_60), label: '1 час' },
  { value: String(MIN_RENTAL_DURATIONS.MINUTES_120), label: '2 часа' },
];

type Errors = Partial<Record<string, string>>;

type WorkspaceFormProps = {
  description: string;
  submitLabel: string;
  isPending: boolean;
  submitError?: unknown;
  photosRequired?: boolean;
  initialWorkspace?: Workspace | null;
  onSubmit: (payload: WorkspaceFormPayload) => void;
};

function WorkspaceForm({
  description,
  submitLabel,
  isPending,
  submitError,
  photosRequired = true,
  initialWorkspace,
  onSubmit,
}: WorkspaceFormProps) {
  const initialWorkspaceId = initialWorkspace?.id;
  const workspaceTypes = useWorkspaceTypes();
  const catalogTree = useCatalogTree();
  const [workspaceTypeId, setWorkspaceTypeId] = useState('');
  const [descriptionText, setDescriptionText] = useState('');
  const [pricePerHour, setPricePerHour] = useState('');
  const [minRentMinutes, setMinRentMinutes] =
    useState<MinRentalDurationMinutes>(MIN_RENTAL_DURATIONS.MINUTES_60);
  const [serviceItemIds, setServiceItemIds] = useState<number[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photosSettled, setPhotosSettled] = useState(!initialWorkspace);
  const [errors, setErrors] = useState<Errors>({});

  useLayoutEffect(() => {
    if (!initialWorkspace) {
      return;
    }

    setWorkspaceTypeId(String(initialWorkspace.workspaceTypeId));
    setDescriptionText(initialWorkspace.description ?? '');
    setPricePerHour(String(initialWorkspace.pricePerHour));
    setMinRentMinutes(
      initialWorkspace.minRentMinutes as MinRentalDurationMinutes,
    );
    setServiceItemIds(initialWorkspace.serviceItemIds);

    let cancelled = false;
    const photosToLoad = [...initialWorkspace.photos].sort(
      (a, b) => a.order - b.order,
    );

    if (photosToLoad.length === 0) {
      setPhotosSettled(true);
      return;
    }

    void Promise.all(photosToLoad.map((photo) => premisePhotoToFile(photo)))
      .then((files) => {
        if (!cancelled) {
          setPhotos(files);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setErrors((current) => ({
            ...current,
            photos: 'Не удалось подгрузить фотографии. Добавьте их заново.',
          }));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setPhotosSettled(true);
        }
      });

    return () => {
      cancelled = true;
    };
    // Refetching the same workspace must not overwrite edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialWorkspaceId]);

  const services = useMemo(() => {
    const typeId = Number(workspaceTypeId);

    return (
      catalogTree.data
        ?.flatMap((group) => group.workspaceTypes)
        .find((type) => type.id === typeId)?.services ?? []
    );
  }, [catalogTree.data, workspaceTypeId]);

  const validateForm = () => {
    const nextErrors: Errors = {};
    const price = Number(pricePerHour);

    if (!workspaceTypeId) {
      nextErrors.workspaceTypeId = 'Выберите тип рабочего места';
    }
    if (!pricePerHour || Number.isNaN(price) || price < 0.01) {
      nextErrors.pricePerHour = 'Введите цену аренды от 0.01';
    }
    if (photosRequired || photos.length > 0) {
      if (photos.length < WORKSPACE_PHOTO_CONFIG.MIN_COUNT) {
        nextErrors.photos = 'Нужно минимум 1 фотография';
      }
      if (photos.length > WORKSPACE_PHOTO_CONFIG.MAX_COUNT) {
        nextErrors.photos = 'Можно загрузить максимум 10 фотографий';
      }
      if (
        photos.some(
          (photo) =>
            !WORKSPACE_PHOTO_CONFIG.ALLOWED_MIME_TYPES.includes(
              photo.type as never,
            ),
        )
      ) {
        nextErrors.photos =
          'Допустимы только JPG, PNG и WEBP файлы для фотографий';
      }
      if (
        photos.some(
          (photo) => photo.size > WORKSPACE_PHOTO_CONFIG.MAX_FILE_SIZE_BYTES,
        )
      ) {
        nextErrors.photos = 'Размер каждого файла должен быть не больше 10 МБ';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    onSubmit({
      workspaceTypeId: Number(workspaceTypeId),
      description: descriptionText.trim() || undefined,
      pricePerHour: Number(pricePerHour),
      minRentMinutes,
      serviceItemIds,
      photos: photos.length > 0 ? photos : undefined,
    });
  };

  const onTypeChange = (value: string) => {
    setWorkspaceTypeId(value);
    setServiceItemIds([]);
  };

  const onServiceToggle = (serviceId: number, checked: boolean) => {
    setServiceItemIds((current) =>
      checked
        ? [...current, serviceId]
        : current.filter((id) => id !== serviceId),
    );
  };

  if (
    initialWorkspace &&
    initialWorkspace.photos.length > 0 &&
    !photosSettled
  ) {
    return <PageLoader />;
  }

  return (
    <form
      className={formStyles.form}
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
      <div className={formStyles.content}>
        <p className={formStyles.description}>{description}</p>
        <SelectInput
          label="Тип рабочего места"
          required
          value={workspaceTypeId}
          onChange={(event) => onTypeChange(event.target.value)}
          aria-label="Тип рабочего места"
          options={(workspaceTypes.data ?? []).map((type) => ({
            value: String(type.id),
            label: type.workspaceName,
          }))}
          placeholder="Выберите тип"
          error={
            errors.workspaceTypeId ??
            (workspaceTypes.isError
              ? 'Не удалось загрузить типы рабочих мест'
              : undefined)
          }
        />
        <TextareaInput
          label="Описание"
          value={descriptionText}
          onChange={(event) => setDescriptionText(event.target.value)}
          placeholder="Опишите рабочее место"
        />
        <TextInput
          label="Цена аренды за час"
          required
          type="number"
          min={0.01}
          step={0.01}
          value={pricePerHour}
          onChange={(event) => setPricePerHour(event.target.value)}
          placeholder="Например, 25.50"
          error={errors.pricePerHour}
        />
        <SelectInput
          label="Минимальное время аренды"
          required
          value={String(minRentMinutes)}
          onChange={(event) =>
            setMinRentMinutes(
              Number(event.target.value) as MinRentalDurationMinutes,
            )
          }
          aria-label="Минимальное время аренды"
          options={MIN_RENT_OPTIONS}
        />
        <div className={styles.services}>
          <p className={styles.servicesTitle}>Услуги на этом месте</p>
          {catalogTree.isError && (
            <p className={formStyles.error}>Не удалось загрузить услуги</p>
          )}
          {!catalogTree.isError && workspaceTypeId && services.length === 0 && (
            <p className={styles.servicesEmpty}>У этого типа нет услуг</p>
          )}
          {services.map((service) => (
            <CheckboxInput
              key={service.id}
              label={service.name}
              checked={serviceItemIds.includes(service.id)}
              onChange={(checked) => onServiceToggle(service.id, checked)}
            />
          ))}
        </div>
        <FileInput
          label={
            photosRequired
              ? 'Фотографии (1-10 шт.)'
              : 'Новые фотографии (1-10 шт., необязательно)'
          }
          required={photosRequired}
          accept=".jpg,.jpeg,.png,.webp"
          multiple
          onChange={(event) => {
            const selectedFiles = Array.from(event.target.files ?? []);
            setPhotos((current) => [...current, ...selectedFiles]);
          }}
          onFileRemove={(index) =>
            setPhotos((current) => current.filter((_, i) => i !== index))
          }
          files={photos}
          error={errors.photos}
        />
        {submitError != null && (
          <p className={formStyles.error}>
            {submitError instanceof Error
              ? submitError.message
              : 'Не удалось отправить форму'}
          </p>
        )}
      </div>
      <footer>
        <Button type="submit" cta disabled={isPending}>
          {isPending ? 'Отправляем...' : submitLabel}
        </Button>
      </footer>
    </form>
  );
}

export default WorkspaceForm;
