import { useLayoutEffect, useMemo, useState } from 'react';
import type { Premise } from '../../api/admin/listLandlords';
import { LANDLORD_PHOTO_CONFIG } from '../../api/landlord/formData';
import {
  applyRejectedPremise,
  premisePhotoToFile,
} from '../../pages/BecomeLandlord/rejectedPremise';
import type {
  LandlordLegalInfo,
  SubmitLandlordApplicationPayload,
} from '../../types/landlord';
import Button from '../Button';
import CheckboxInput from '../CheckboxInput';
import FileInput from '../FileInput';
import LegalInfoInput from '../LegalInfoInput';
import PageLoader from '../PageLoader';
import TextareaInput from '../TextareaInput';
import TextInput from '../TextInput';
import styles from './PremiseForm.module.scss';

type Errors = Partial<Record<string, string>>;

type PremiseFormProps = {
  description?: string;
  notice?: string;
  submitLabel: string;
  pendingLabel?: string;
  isPending: boolean;
  submitError?: unknown;
  initialPremise?: Premise | null;
  showTerms?: boolean;
  onSubmit: (payload: SubmitLandlordApplicationPayload) => void;
};

function PremiseForm({
  description,
  notice,
  submitLabel,
  pendingLabel = 'Отправляем...',
  isPending,
  submitError,
  initialPremise,
  showTerms = true,
  onSubmit,
}: PremiseFormProps) {
  const initialPremiseId = initialPremise?.id;
  const [placeName, setPlaceName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [descriptionText, setDescriptionText] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [photosSettled, setPhotosSettled] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [bankDetails, setBankDetails] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  useLayoutEffect(() => {
    if (!initialPremise) {
      return;
    }

    applyRejectedPremise(initialPremise, {
      setPlaceName,
      setCity,
      setAddress,
      setDescription: setDescriptionText,
      setCompanyName,
      setRegistrationNumber,
      setBankDetails,
    });

    let cancelled = false;
    const photosToLoad = [...initialPremise.photos].sort(
      (a, b) => a.order - b.order,
    );

    if (photosToLoad.length === 0) {
      setPhotosSettled(true);
      return;
    }

    setPhotosLoading(true);
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
          setPhotosLoading(false);
          setPhotosSettled(true);
        }
      });

    return () => {
      cancelled = true;
    };
    // Refetching the same premise must not cancel the photo download.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPremiseId]);

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

    if (!placeName.trim()) {
      nextErrors.placeName = 'Введите название помещения';
    }
    if (!city.trim()) nextErrors.city = 'Введите город';
    if (!address.trim()) nextErrors.address = 'Введите адрес';
    if (descriptionText.trim().length > 1000) {
      nextErrors.description = 'Описание должно быть до 1000 символов';
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
    if (legalInfo && !legalInfo.companyName) {
      nextErrors.legalInfo = 'Укажите название юридического лица или ИП';
    }
    if (showTerms && !termsAccepted) {
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

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    onSubmit({
      placeName: placeName.trim(),
      city: city.trim(),
      address: address.trim(),
      description: descriptionText.trim(),
      legalInfo,
      photos,
      termsAccepted,
    });
  };

  const waitingForInitialPhotos =
    (initialPremise?.photos.length ?? 0) > 0 && !photosSettled;

  if (waitingForInitialPhotos) {
    return <PageLoader />;
  }

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
      <div className={styles.content}>
        {description && <p className={styles.description}>{description}</p>}
        {notice && <p className={styles.error}>{notice}</p>}
        <TextInput
          label="Название помещения"
          required
          value={placeName}
          onChange={(e) => setPlaceName(e.target.value)}
          placeholder="Например, Beauti Baza"
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
        <TextareaInput
          label="Описание"
          value={descriptionText}
          onChange={(e) => setDescriptionText(e.target.value)}
          maxLength={1000}
          placeholder="Опишите помещение"
          error={errors.description}
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
        {showTerms && (
          <>
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
          </>
        )}
        {submitError != null && (
          <p className={styles.error}>
            {submitError instanceof Error
              ? submitError.message
              : 'Не удалось отправить форму'}
          </p>
        )}
      </div>
      <footer>
        <Button type="submit" cta disabled={isPending || photosLoading}>
          {isPending ? pendingLabel : submitLabel}
        </Button>
      </footer>
    </form>
  );
}

export default PremiseForm;
