import {
  type LandlordApplication,
  type SubmitLandlordApplicationPayload,
} from '../../types/landlord';
import { API_BASE_URL } from '../config';
import { LANDLORD_ERROR_TYPES, LandlordError } from './types';

export const LANDLORD_PHOTO_CONFIG = {
  MIN_COUNT: 3,
  MAX_COUNT: 15,
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024,
} as const;

export interface SubmitLandlordApplicationRequest {
  token: string;
  payload: SubmitLandlordApplicationPayload;
}

export function validateWorkspacePhotos(
  payload: SubmitLandlordApplicationPayload
): void {
  if (payload.photos.length < LANDLORD_PHOTO_CONFIG.MIN_COUNT) {
    throw new LandlordError(
      'Добавьте минимум 3 фотографии',
      400,
      LANDLORD_ERROR_TYPES.INVALID_PHOTO_COUNT
    );
  }

  if (payload.photos.length > LANDLORD_PHOTO_CONFIG.MAX_COUNT) {
    throw new LandlordError(
      'Можно загрузить максимум 15 фотографий',
      400,
      LANDLORD_ERROR_TYPES.INVALID_PHOTO_COUNT
    );
  }

  const invalidType = payload.photos.find((photo) => {
    return !(
      LANDLORD_PHOTO_CONFIG.ALLOWED_MIME_TYPES as readonly string[]
    ).includes(photo.type);
  });
  if (invalidType) {
    throw new LandlordError(
      `Формат файла ${invalidType.name} не поддерживается`,
      400,
      LANDLORD_ERROR_TYPES.INVALID_PHOTO_FORMAT
    );
  }

  const invalidSize = payload.photos.find(
    (photo) => photo.size > LANDLORD_PHOTO_CONFIG.MAX_FILE_SIZE_BYTES
  );
  if (invalidSize) {
    throw new LandlordError(
      `Файл ${invalidSize.name} превышает 10 МБ`,
      400,
      LANDLORD_ERROR_TYPES.INVALID_PHOTO_SIZE
    );
  }
}

export function buildWorkspaceFormData(
  payload: SubmitLandlordApplicationPayload
) {
  const formData = new FormData();

  formData.append('name', payload.placeName);
  formData.append('city', payload.city);
  formData.append('address', payload.address);
  formData.append('kind', payload.placeTypes[0] ?? '');

  if (payload.description) {
    formData.append('description', payload.description);
  }

  formData.append('openTime', payload.workingHours.from);
  formData.append('closeTime', payload.workingHours.to);

  payload.workingDays.forEach((day) => {
    formData.append('workingDays', day);
  });

  formData.append('minRentMinutes', String(payload.minRentalDurationMinutes));

  formData.append('pricePerHour', String(payload.pricePerHour ?? 0.01));

  if (payload.legalInfo?.companyName) {
    formData.append('legalName', payload.legalInfo.companyName);
  }

  if (payload.legalInfo?.registrationNumber) {
    formData.append(
      'legalRegistrationNo',
      payload.legalInfo.registrationNumber
    );
  }

  if (payload.legalInfo?.bankDetails) {
    formData.append('legalDetails', payload.legalInfo.bankDetails);
  }

  payload.photos.forEach((photo) => {
    formData.append('photos', photo);
  });

  return formData;
}

export async function submitApplication({
  token,
  payload,
}: SubmitLandlordApplicationRequest): Promise<LandlordApplication> {
  validateWorkspacePhotos(payload);

  const response = await fetch(`${API_BASE_URL}/landlord/request-landlord`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: buildWorkspaceFormData(payload),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new LandlordError(
        'Требуется авторизация',
        response.status,
        LANDLORD_ERROR_TYPES.UNKNOWN
      );
    }
    if (response.status === 403) {
      throw new LandlordError(
        'Недостаточно прав для добавления рабочего места',
        response.status,
        LANDLORD_ERROR_TYPES.UNKNOWN
      );
    }
    if (response.status === 400) {
      throw new LandlordError(
        'Проверьте корректность данных формы',
        response.status,
        LANDLORD_ERROR_TYPES.INVALID_PAYLOAD
      );
    }
    throw new LandlordError(
      `Ошибка сервера: ${response.status}`,
      response.status,
      LANDLORD_ERROR_TYPES.UNKNOWN
    );
  }

  return response.json() as Promise<LandlordApplication>;
}
