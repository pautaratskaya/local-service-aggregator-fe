import { ruCount } from '../../helpers';
import type { SubmitLandlordApplicationPayload } from '../../types/landlord';
import { LANDLORD_ERROR_TYPES, LandlordError } from './types';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export const LANDLORD_PHOTO_CONFIG = {
  MIN_COUNT: 3,
  MAX_COUNT: 15,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
} as const;

export const WORKSPACE_PHOTO_CONFIG = {
  MIN_COUNT: 1,
  MAX_COUNT: 10,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
} as const;

type PhotoConfig = {
  MIN_COUNT: number;
  MAX_COUNT: number;
  ALLOWED_MIME_TYPES: readonly string[];
  MAX_FILE_SIZE_BYTES: number;
};

export interface PremiseFormPayload {
  name: string;
  city: string;
  address: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  legalName?: string;
  legalRegistrationNo?: string;
  legalDetails?: string;
  photos?: File[];
}

export interface WorkspaceFormPayload {
  workspaceTypeId: number;
  description?: string;
  pricePerHour: number;
  minRentMinutes: number;
  serviceItemIds?: number[];
  photos?: File[];
}

export function toPremiseFormPayload(
  payload: SubmitLandlordApplicationPayload,
): PremiseFormPayload & { photos: File[] } {
  return {
    name: payload.placeName,
    city: payload.city,
    address: payload.address,
    description: payload.description || undefined,
    legalName: payload.legalInfo?.companyName || undefined,
    legalRegistrationNo: payload.legalInfo?.registrationNumber || undefined,
    legalDetails: payload.legalInfo?.bankDetails || undefined,
    photos: payload.photos,
  };
}

export function validatePhotos(
  photos: File[] | undefined,
  config: PhotoConfig,
  required: boolean,
) {
  if (!photos?.length) {
    if (!required) {
      return;
    }

    throw new LandlordError(
      `Добавьте минимум ${photoCount(config.MIN_COUNT)}`,
      400,
      LANDLORD_ERROR_TYPES.INVALID_PHOTO_COUNT,
    );
  }

  if (photos.length < config.MIN_COUNT) {
    throw new LandlordError(
      `Добавьте минимум ${photoCount(config.MIN_COUNT)}`,
      400,
      LANDLORD_ERROR_TYPES.INVALID_PHOTO_COUNT,
    );
  }

  if (photos.length > config.MAX_COUNT) {
    throw new LandlordError(
      `Можно загрузить максимум ${photoCount(config.MAX_COUNT)}`,
      400,
      LANDLORD_ERROR_TYPES.INVALID_PHOTO_COUNT,
    );
  }

  const invalidType = photos.find(
    (photo) => !config.ALLOWED_MIME_TYPES.includes(photo.type),
  );

  if (invalidType) {
    throw new LandlordError(
      `Формат файла ${invalidType.name} не поддерживается`,
      400,
      LANDLORD_ERROR_TYPES.INVALID_PHOTO_FORMAT,
    );
  }

  const invalidSize = photos.find(
    (photo) => photo.size > config.MAX_FILE_SIZE_BYTES,
  );

  if (invalidSize) {
    throw new LandlordError(
      `Файл ${invalidSize.name} превышает 10 МБ`,
      400,
      LANDLORD_ERROR_TYPES.INVALID_PHOTO_SIZE,
    );
  }
}

export function buildPremiseFormData(
  payload: PremiseFormPayload,
  options?: { termsAccepted?: boolean },
) {
  const formData = new FormData();

  formData.append('name', payload.name);
  formData.append('city', payload.city);
  formData.append('address', payload.address);
  appendIfPresent(formData, 'description', payload.description);

  if (payload.latitude != null) {
    formData.append('latitude', String(payload.latitude));
  }

  if (payload.longitude != null) {
    formData.append('longitude', String(payload.longitude));
  }

  appendIfPresent(formData, 'legalName', payload.legalName);
  appendIfPresent(formData, 'legalRegistrationNo', payload.legalRegistrationNo);
  appendIfPresent(formData, 'legalDetails', payload.legalDetails);

  if (options?.termsAccepted) {
    formData.append('termsAccepted', 'true');
  }

  payload.photos?.forEach((photo) => {
    formData.append('photos', photo);
  });

  return formData;
}

export function buildWorkspaceFormData(payload: WorkspaceFormPayload) {
  const formData = new FormData();

  formData.append('workspaceTypeId', String(payload.workspaceTypeId));
  appendIfPresent(formData, 'description', payload.description);
  formData.append('pricePerHour', payload.pricePerHour.toFixed(2));
  formData.append('minRentMinutes', String(payload.minRentMinutes));

  // Undefined keeps the current services on update.
  payload.serviceItemIds?.forEach((id) => {
    formData.append('serviceItemIds', String(id));
  });

  payload.photos?.forEach((photo) => {
    formData.append('photos', photo);
  });

  return formData;
}

function photoCount(count: number) {
  return ruCount(count, 'фотографию', 'фотографий', 'фотографии');
}

function appendIfPresent(formData: FormData, key: string, value?: string) {
  if (value) {
    formData.append(key, value);
  }
}
