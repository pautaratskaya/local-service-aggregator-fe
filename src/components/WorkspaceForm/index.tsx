import { useLayoutEffect, useMemo, useState } from 'react';
import type { LandlordWorkspaceSummary } from '../../api/admin/listLandlords';
import { LANDLORD_PHOTO_CONFIG } from '../../api/landlord/submitApplication';
import Button from '../Button';
import PageLoader from '../PageLoader';
import CheckboxInput from '../CheckboxInput';
import FileInput from '../FileInput';
import LegalInfoInput from '../LegalInfoInput';
import SelectInput from '../SelectInput';
import TextareaInput from '../TextareaInput';
import TextInput from '../TextInput';
import WorkingHoursInput, {
  DEFAULT_WORKING_DAYS,
} from '../WorkingHoursInput';
import {
  applyRejectedWorkspace,
  workspacePhotoToFile,
} from '../../pages/BecomeLandlord/rejectedWorkspace';
import {
  MIN_RENTAL_DURATIONS,
  toWeekdayApiValue,
  type LandlordLegalInfo,
  type MinRentalDurationMinutes,
  type SubmitLandlordApplicationPayload,
} from '../../types/landlord';
import styles from './WorkspaceForm.module.scss';

// TODO: request from backend
const PLACE_TYPE_OPTIONS = [
  { value: 'Парикмахерское кресло', label: 'Парикмахерское кресло' },
  { value: 'Кабинет для маникюра', label: 'Кабинет для маникюра' },
  { value: 'Массажный кабинет', label: 'Массажный кабинет' },
  { value: 'Студия', label: 'Студия' },
];
const MIN_RENTAL_OPTIONS = [
  { value: String(MIN_RENTAL_DURATIONS.MINUTES_30), label: '30 мин' },
  { value: String(MIN_RENTAL_DURATIONS.MINUTES_60), label: '1 час' },
  { value: String(MIN_RENTAL_DURATIONS.MINUTES_120), label: '2 часа' },
];

type Errors = Partial<Record<string, string>>;

type WorkspaceFormProps = {
  description: string;
  notice?: string;
  submitLabel: string;
  pendingLabel?: string;
  isPending: boolean;
  submitError?: unknown;
  initialWorkspace?: LandlordWorkspaceSummary | null;
  onSubmit: (payload: SubmitLandlordApplicationPayload) => void;
};

function WorkspaceForm({
  description,
  notice,
  submitLabel,
  pendingLabel = 'Отправляем...',
  isPending,
  submitError,
  initialWorkspace,
  onSubmit,
}: WorkspaceFormProps) {
  const initialWorkspaceId = initialWorkspace?.id;
  const [placeName, setPlaceName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [placeType, setPlaceType] = useState('');
  const [descriptionText, setDescriptionText] = useState('');
  const [workFrom, setWorkFrom] = useState('09:00');
  const [workTo, setWorkTo] = useState('21:00');
  const [workingDays, setWorkingDays] =
    useState<string[]>(DEFAULT_WORKING_DAYS);
  const [minRentalDurationMinutes, setMinRentalDurationMinutes] =
    useState<MinRentalDurationMinutes>(MIN_RENTAL_DURATIONS.MINUTES_60);
  const [pricePerHour, setPricePerHour] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [photosSettled, setPhotosSettled] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [bankDetails, setBankDetails] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  useLayoutEffect(() => {
    if (!initialWorkspace) {
      return;
    }

    applyRejectedWorkspace(initialWorkspace, {
      setPlaceName,
      setCity,
      setAddress,
      setPlaceType,
      setDescription: setDescriptionText,
      setWorkFrom,
      setWorkTo,
      setWorkingDays,
      setMinRentalDurationMinutes,
      setPricePerHour,
      setCompanyName,
      setRegistrationNumber,
      setBankDetails,
    });

    let cancelled = false;
    const photosToLoad = [...initialWorkspace.photos].sort(
      (a, b) => a.order - b.order,
    );

    if (photosToLoad.length === 0) {
      setPhotosSettled(true);
      return;
    }

    setPhotosLoading(true);
    void Promise.all(photosToLoad.map((photo) => workspacePhotoToFile(photo)))
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
          setPhotosLoading(false);
          setPhotosSettled(true);
        }
      });

    return () => {
      cancelled = true;
    };
    // Refetching the same workspace must not cancel the photo download.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialWorkspaceId]);

  const legalInfo: LandlordLegalInfo | null = useMemo(() => {
    if (!companyName && !registrationNumber && !bankDetails) {
      return null;
    }

    return {
      companyName: companyName.trim(),
      registrationNumber: registrationNumber.trim(),
      bankDetails: bankDetails.trim(),
    };
  }, [companyName, registrationNumber, bankDetails]);

  const validateForm = () => {
    const nextErrors: Errors = {};

    if (!placeName.trim()) nextErrors.placeName = 'Введите название рабочего места';
    if (!city.trim()) nextErrors.city = 'Введите город';
    if (!address.trim()) nextErrors.address = 'Введите адрес';
    if (!placeType) nextErrors.placeType = 'Выберите тип рабочего места';
    if (!descriptionText.trim()) nextErrors.description = 'Добавьте описание';
    if (descriptionText.trim().length > 1000) {
      nextErrors.description = 'Описание должно быть до 1000 символов';
    }
    if (workingDays.length === 0) {
      nextErrors.workingHours = 'Выберите хотя бы один рабочий день';
    } else if (!workFrom || !workTo || workFrom >= workTo) {
      nextErrors.workingHours =
        'Проверьте время работы: начало должно быть раньше окончания';
    }
    if (photos.length < LANDLORD_PHOTO_CONFIG.MIN_COUNT) {
      nextErrors.photos = 'Нужно минимум 3 фотографии';
    }
    if (photos.length > LANDLORD_PHOTO_CONFIG.MAX_COUNT) {
      nextErrors.photos = 'Можно загрузить максимум 15 фотографий';
    }
    if (
      photos.some(
        (photo) =>
          !LANDLORD_PHOTO_CONFIG.ALLOWED_MIME_TYPES.includes(
            photo.type as never,
          ),
      )
    ) {
      nextErrors.photos =
        'Допустимы только JPG, PNG и WEBP файлы для фотографий';
    }
    if (
      photos.some(
        (photo) => photo.size > LANDLORD_PHOTO_CONFIG.MAX_FILE_SIZE_BYTES,
      )
    ) {
      nextErrors.photos = 'Размер каждого файла должен быть не больше 10 МБ';
    }
    if (!pricePerHour || Number(pricePerHour) <= 0) {
      nextErrors.pricePerHour = 'Введите корректную цену за час';
    }
    if (legalInfo && !legalInfo.companyName) {
      nextErrors.legalInfo = 'Укажите название юридического лица или ИП';
    }
    if (!termsAccepted) {
      nextErrors.termsAccepted =
        'Подтвердите согласие с условиями для арендодателей';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onPhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    setPhotos((prev) => [...prev, ...selectedFiles]);
  };

  const onPhotoRemove = (index: number) => {
    setPhotos((prev) => prev.filter((_, photoIndex) => photoIndex !== index));
  };

  const onWorkingDayToggle = (day: string) => {
    setWorkingDays((prev) =>
      prev.includes(day)
        ? prev.filter((value) => value !== day)
        : [...prev, day],
    );
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    onSubmit({
      placeName: placeName.trim(),
      city: city.trim(),
      address: address.trim(),
      placeTypes: [placeType],
      description: descriptionText.trim(),
      workingHours: {
        from: workFrom,
        to: workTo,
      },
      workingDays: workingDays.map((day) => toWeekdayApiValue(day)),
      minRentalDurationMinutes,
      pricePerHour: Number(pricePerHour),
      legalInfo,
      photos,
    });
  };

  const waitingForInitialPhotos =
    (initialWorkspace?.photos.length ?? 0) > 0 && !photosSettled;

  if (waitingForInitialPhotos) {
    return <PageLoader />;
  }

  return (
    <div className={styles.form}>
      <div className={styles.content}>
        <p className={styles.description}>{description}</p>
        {notice && <p className={styles.error}>{notice}</p>}
        <TextInput
          label="Название рабочего места"
          required
          value={placeName}
          onChange={(e) => setPlaceName(e.target.value)}
          placeholder="Например, Кабинет Beauty Spot"
          autoFocus
          error={errors.placeName}
        />
        <TextInput
          label="Город"
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Введите город"
          error={errors.city}
        />
        {/* TODO: add map; ?? merge with the city, or make the city selectable (not text input) ?? */}
        <TextInput
          label="Адрес"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Введите адрес"
          error={errors.address}
        />
        {/* TODO: add 'Другое' option */}
        <SelectInput
          label="Тип рабочего места"
          required
          value={placeType}
          onChange={(e) => setPlaceType(e.target.value)}
          aria-label="Тип рабочего места"
          options={PLACE_TYPE_OPTIONS}
          placeholder="Выберите тип"
          error={errors.placeType}
        />
        <TextareaInput
          label="Описание рабочего места"
          required
          value={descriptionText}
          onChange={(e) => setDescriptionText(e.target.value)}
          maxLength={1000}
          placeholder="Опишите особенности и оборудование"
          error={errors.description}
        />
        <WorkingHoursInput
          label="Время работы рабочего места"
          required
          workFrom={workFrom}
          workTo={workTo}
          workingDays={workingDays}
          onWorkFromChange={setWorkFrom}
          onWorkToChange={setWorkTo}
          onWorkingDayToggle={onWorkingDayToggle}
          error={errors.workingHours}
        />
        <SelectInput
          label="Минимальное время аренды"
          required
          value={String(minRentalDurationMinutes)}
          onChange={(e) =>
            setMinRentalDurationMinutes(
              Number(e.target.value) as MinRentalDurationMinutes,
            )
          }
          aria-label="Минимальное время аренды"
          options={MIN_RENTAL_OPTIONS}
        />
        {/*  TODO: add currency selector */}
        <TextInput
          label="Цена за час"
          required
          type="number"
          min={1}
          step={1}
          value={pricePerHour}
          onChange={(e) => setPricePerHour(e.target.value)}
          placeholder="Например, 30"
          error={errors.pricePerHour}
        />
        <FileInput
          label="Фотографии рабочего места (3-15 шт.)"
          required
          accept=".jpg,.jpeg,.png,.webp"
          multiple
          onChange={onPhotoChange}
          onFileRemove={onPhotoRemove}
          files={photos}
          error={errors.photos}
        />
        <LegalInfoInput
          companyName={companyName}
          registrationNumber={registrationNumber}
          bankDetails={bankDetails}
          onCompanyNameChange={setCompanyName}
          onRegistrationNumberChange={setRegistrationNumber}
          onBankDetailsChange={setBankDetails}
          error={errors.legalInfo}
        />
        <CheckboxInput
          label="Я принимаю условия использования платформы для арендодателей"
          required
          checked={termsAccepted}
          onChange={setTermsAccepted}
          error={errors.termsAccepted}
        />
        <a href="#" onClick={(e) => e.preventDefault()} className={styles.link}>
          Открыть условия использования
        </a>
        {submitError != null && (
          <p className={styles.error}>
            {submitError instanceof Error
              ? submitError.message
              : 'Не удалось отправить форму'}
          </p>
        )}
      </div>
      <footer>
        <Button
          onClick={handleSubmit}
          cta
          disabled={isPending || photosLoading}
        >
          {isPending ? pendingLabel : submitLabel}
        </Button>
      </footer>
    </div>
  );
}

export default WorkspaceForm;
