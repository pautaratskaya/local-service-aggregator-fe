import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import TextInput from '../../components/TextInput';
import TextareaInput from '../../components/TextareaInput';
import SelectInput from '../../components/SelectInput';
import FileInput from '../../components/FileInput';
// import { landlordService } from '../../api/landlord/landlordService';
import { LANDLORD_PHOTO_CONFIG } from '../../api/landlord/submitApplication';
import { useAuthStore } from '../../stores/authStore';
import {
  MIN_RENTAL_DURATIONS,
  type MinRentalDurationMinutes,
  type LandlordLegalInfo,
} from '../../types/landlord';
import WorkingHoursInput from // WORKING_DAYS,
'../../components/WorkingHoursInput';
import styles from './BecomeLandlord.module.scss';

const PLACE_TYPE_OPTIONS = [
  { value: 'Парикмахерское кресло', label: 'Парикмахерское кресло' },
  { value: 'Кабинет для маникюра', label: 'Кабинет для маникюра' },
  { value: 'Массажный кабинет', label: 'Массажный кабинет' },
  { value: 'Студия', label: 'Студия' },
];
// TODO: confirm the format
// const API_DAY_BY_UI_DAY: Record<string, string> = {
//   Пн: 'MONDAY',
//   Вт: 'TUESDAY',
//   Ср: 'WEDNESDAY',
//   Чт: 'THURSDAY',
//   Пт: 'FRIDAY',
//   Сб: 'SATURDAY',
//   Вс: 'SUNDAY',
// };

const MIN_RENTAL_OPTIONS = [
  { value: String(MIN_RENTAL_DURATIONS.MINUTES_30), label: '30 мин' },
  { value: String(MIN_RENTAL_DURATIONS.MINUTES_60), label: '1 час' },
  { value: String(MIN_RENTAL_DURATIONS.MINUTES_120), label: '2 часа' },
];

type Errors = Partial<Record<string, string>>;

function BecomeLandlord() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const [placeName, setPlaceName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [placeType, setPlaceType] = useState('');
  const [description, setDescription] = useState('');
  const [workFrom, setWorkFrom] = useState('09:00');
  const [workTo, setWorkTo] = useState('21:00');
  const [daysOff, setDaysOff] = useState<string[]>([]);
  const [minRentalDurationMinutes, setMinRentalDurationMinutes] =
    useState<MinRentalDurationMinutes>(MIN_RENTAL_DURATIONS.MINUTES_60);
  const [pricePerHour, setPricePerHour] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [companyName, setCompanyName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [bankDetails, setBankDetails] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

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

  const submitMutation = useMutation({
    mutationFn: () => {
      if (!user) {
        throw new Error('Требуется авторизация');
      }
      if (!token) {
        throw new Error('Не найден токен авторизации');
      }

      // TODO: review the mapping
      // const workingDays = WORKING_DAYS.filter(
      //   (day) => !daysOff.includes(day)
      // ).map((day) => API_DAY_BY_UI_DAY[day]);

      // TODO: use real API
      return Promise.resolve();

      // return landlordService.submitApplication({
      //   userId: user.id,
      //   token,
      //   roles: user.roles, // TODO: remove? check all the props
      //   payload: {
      //     placeName: placeName.trim(),
      //     city: city.trim(),
      //     address: address.trim(),
      //     placeTypes: [placeType],
      //     description: description.trim(),
      //     workingHours: {
      //       from: workFrom,
      //       to: workTo,
      //       daysOff,
      //     },
      //     workingDays,
      //     minRentalDurationMinutes,
      //     pricePerHour: Number(pricePerHour),
      //     legalInfo,
      //     photos,
      //   },
      // });
    },
    onSuccess: async () => {
      if (user) {
        await queryClient.invalidateQueries({
          queryKey: ['landlord-application', user.id],
        });
      }
      const background = location.state?.background;
      navigate(background?.pathname || '/');
    },
  });

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
    if (!workFrom || !workTo || workFrom >= workTo) {
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

  const onDaysOffToggle = (day: string) => {
    setDaysOff((prev) =>
      prev.includes(day)
        ? prev.filter((value) => value !== day)
        : [...prev, day]
    );
  };

  const onSubmit = () => {
    if (!validateForm()) {
      return;
    }
    submitMutation.mutate();
  };

  return (
    <Modal title="Стать арендодателем">
      <div className={styles.becomeLandlord}>
        <div className={styles.content}>
          <p className={styles.description}>
            Заполните обязательные поля для отправки заявки на модерацию
          </p>
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
            daysOff={daysOff}
            onWorkFromChange={setWorkFrom}
            onWorkToChange={setWorkTo}
            onDaysOffToggle={onDaysOffToggle}
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
          <fieldset className={styles.legal}>
            <legend>Юридическая информация (опционально)</legend>
            <label>
              Название юр.лица/ИП
              <input
                className={styles.nativeControl}
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </label>
            <label>
              УНП/ОГРН
              <input
                className={styles.nativeControl}
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
              />
            </label>
            <label>
              Реквизиты
              <textarea
                className={styles.nativeControl}
                value={bankDetails}
                onChange={(e) => setBankDetails(e.target.value)}
              />
            </label>
          </fieldset>
          {errors.legalInfo && (
            <p className={styles.error}>{errors.legalInfo}</p>
          )}
          <label className={styles.terms}>
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            Я принимаю условия использования платформы для арендодателей
          </label>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className={styles.link}
          >
            Открыть условия использования
          </a>
          {errors.termsAccepted && (
            <p className={styles.error}>{errors.termsAccepted}</p>
          )}
          {submitMutation.error && (
            <p className={styles.error}>
              {submitMutation.error instanceof Error
                ? submitMutation.error.message
                : 'Не удалось отправить заявку'}
            </p>
          )}
        </div>

        <footer>
          <Button onClick={onSubmit} cta disabled={submitMutation.isPending}>
            {submitMutation.isPending
              ? 'Отправляем...'
              : 'Отправить на модерацию'}
          </Button>
        </footer>
      </div>
    </Modal>
  );
}

export default BecomeLandlord;
