import { useLayoutEffect, useMemo, useState } from 'react';
import Button from '../../components/Button';
import PageLoader from '../../components/PageLoader';
import Modal from '../../components/Modal';
import TextInput from '../../components/TextInput';
import TextareaInput from '../../components/TextareaInput';
import SelectInput from '../../components/SelectInput';
import FileInput from '../../components/FileInput';
import { LANDLORD_PHOTO_CONFIG } from '../../api/landlord/submitApplication';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useLandlordWorkspaces } from '../../hooks/useLandlordWorkspaces';
import {
  MIN_RENTAL_DURATIONS,
  toWeekdayApiValue,
  type MinRentalDurationMinutes,
  type LandlordLegalInfo,
} from '../../types/landlord';
import { ROLE_APPLICATION_STATUSES } from '../../types/user';
import WorkingHoursInput, {
  DEFAULT_WORKING_DAYS,
} from '../../components/WorkingHoursInput';
import LegalInfoInput from '../../components/LegalInfoInput';
import CheckboxInput from '../../components/CheckboxInput';
import { useSubmitLandlordApplication } from './hooks/useSubmitLandlordApplication';
import {
  applyRejectedWorkspace,
  pickRejectedWorkspace,
  workspacePhotoToFile,
} from './rejectedWorkspace';
import styles from './BecomeLandlord.module.scss';

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

function BecomeLandlord() {
  const { data: user } = useCurrentUser();
  const isReapply =
    user?.landlordRoleStatus === ROLE_APPLICATION_STATUSES.REJECTED;
  const workspacesQuery = useLandlordWorkspaces(isReapply);
  const rejectedWorkspace = pickRejectedWorkspace(workspacesQuery.data);
  const rejectedWorkspaceId = rejectedWorkspace?.id;
  const [placeName, setPlaceName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [placeType, setPlaceType] = useState('');
  const [description, setDescription] = useState('');
  const [workFrom, setWorkFrom] = useState('09:00');
  const [workTo, setWorkTo] = useState('21:00');
  const [workingDays, setWorkingDays] =
    useState<string[]>(DEFAULT_WORKING_DAYS);
  const [minRentalDurationMinutes, setMinRentalDurationMinutes] =
    useState<MinRentalDurationMinutes>(MIN_RENTAL_DURATIONS.MINUTES_60);
  const [pricePerHour, setPricePerHour] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [bankDetails, setBankDetails] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  useLayoutEffect(() => {
    if (!rejectedWorkspace) {
      return;
    }

    applyRejectedWorkspace(rejectedWorkspace, {
      setPlaceName,
      setCity,
      setAddress,
      setPlaceType,
      setDescription,
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
    const photosToLoad = [...rejectedWorkspace.photos].sort(
      (a, b) => a.order - b.order,
    );

    if (photosToLoad.length === 0) {
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
        }
      });

    return () => {
      cancelled = true;
    };
    // Refetching the same workspace must not cancel the photo download.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rejectedWorkspaceId]);

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

  const submitMutation = useSubmitLandlordApplication();

  const validateForm = () => {
    const nextErrors: Errors = {};

    if (!placeName.trim()) nextErrors.placeName = 'Введите название помещения';
    if (!city.trim()) nextErrors.city = 'Введите город';
    if (!address.trim()) nextErrors.address = 'Введите адрес';
    if (!placeType) nextErrors.placeType = 'Выберите тип помещения';
    if (!description.trim()) nextErrors.description = 'Добавьте описание';
    if (description.trim().length > 1000) {
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
            photo.type as never
          )
      )
    ) {
      nextErrors.photos =
        'Допустимы только JPG, PNG и WEBP файлы для фотографий';
    }
    if (
      photos.some(
        (photo) => photo.size > LANDLORD_PHOTO_CONFIG.MAX_FILE_SIZE_BYTES
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
        : [...prev, day]
    );
  };

  const onSubmit = () => {
    if (!validateForm()) {
      return;
    }
    submitMutation.mutate({
      placeName: placeName.trim(),
      city: city.trim(),
      address: address.trim(),
      placeTypes: [placeType],
      description: description.trim(),
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

  const showLoader =
    isReapply &&
    !workspacesQuery.isError &&
    (workspacesQuery.isLoading || photosLoading);

  return (
    <Modal title={isReapply ? 'Исправить заявку' : 'Стать арендодателем'}>
      <div className={styles.becomeLandlord}>
        {showLoader ? (
          <PageLoader />
        ) : (
          <>
        <div className={styles.content}>
          <p className={styles.description}>
            {isReapply
              ? 'Проверьте данные отклонённой заявки и отправьте её снова.'
              : 'Заполните обязательные поля для отправки заявки на модерацию'}
          </p>
          {isReapply && workspacesQuery.isError && (
            <p className={styles.error}>
              Не удалось загрузить предыдущую заявку. Заполните форму заново.
            </p>
          )}
          <TextInput
            label="Название помещения/рабочего места"
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
            label="Тип помещения/рабочего места"
            required
            value={placeType}
            onChange={(e) => setPlaceType(e.target.value)}
            aria-label="Тип помещения"
            options={PLACE_TYPE_OPTIONS}
            placeholder="Выберите тип"
            error={errors.placeType}
          />
          <TextareaInput
            label="Описание помещения/рабочего места"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1000}
            placeholder="Опишите особенности и оборудование"
            error={errors.description}
          />
          <WorkingHoursInput
            label="Время работы помещения"
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
                Number(e.target.value) as MinRentalDurationMinutes
              )
            }
            aria-label="Минимальное время аренды"
            options={MIN_RENTAL_OPTIONS}
          />

          {/*  TODO: add currency selector */}
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
            label="Фотографии помещения (3-15 шт.)"
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
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className={styles.link}
          >
            Открыть условия использования
          </a>
          {submitMutation.error && (
            <p className={styles.error}>
              {submitMutation.error instanceof Error
                ? submitMutation.error.message
                : 'Не удалось отправить заявку'}
            </p>
          )}
        </div>

        <footer>
          <Button
            onClick={onSubmit}
            cta
            disabled={
              submitMutation.isPending ||
              photosLoading ||
              (isReapply && workspacesQuery.isLoading)
            }
          >
            {submitMutation.isPending
              ? 'Отправляем...'
              : isReapply
                ? 'Отправить снова'
                : 'Отправить на модерацию'}
          </Button>
        </footer>
          </>
        )}
      </div>
    </Modal>
  );
}

export default BecomeLandlord;
