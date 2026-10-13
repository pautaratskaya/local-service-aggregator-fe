import { API_BASE_URL } from '../config';
import { checkSession } from '../session';
import {
  LANDLORD_ERROR_TYPES,
  LandlordError,
  landlordConflictMessage,
} from './types';

const APPLICATION_CONFLICT_MESSAGE =
  'Заявка уже на рассмотрении или роль арендодателя уже подтверждена';

export const LANDLORD_CONFLICT_FALLBACKS = {
  APPLICATION: APPLICATION_CONFLICT_MESSAGE,
  PREMISE: 'Не удалось сохранить помещение',
  WORKSPACE: 'Не удалось сохранить рабочее место',
} as const;

type LandlordRequestOptions = {
  conflictFallback: string;
  forbiddenMessage?: string;
};

export async function landlordRequest(
  path: string,
  token: string,
  init: RequestInit | undefined,
  options: LandlordRequestOptions,
) {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        ...init?.headers,
      },
    });

    checkSession(response);

    if (!response.ok) {
      throw await landlordErrorFromResponse(response, options);
    }

    return response;
  } catch (error) {
    if (error instanceof LandlordError) {
      throw error;
    }

    throw new LandlordError(
      'Не удалось подключиться к серверу',
      0,
      LANDLORD_ERROR_TYPES.NETWORK,
    );
  }
}

async function landlordErrorFromResponse(
  response: Response,
  options: LandlordRequestOptions,
) {
  if (response.status === 401) {
    return new LandlordError(
      'Требуется авторизация',
      response.status,
      LANDLORD_ERROR_TYPES.UNKNOWN,
    );
  }

  if (response.status === 403) {
    return new LandlordError(
      options.forbiddenMessage ?? 'Недостаточно прав',
      response.status,
      LANDLORD_ERROR_TYPES.UNKNOWN,
    );
  }

  if (response.status === 400) {
    return new LandlordError(
      'Проверьте корректность данных формы',
      response.status,
      LANDLORD_ERROR_TYPES.INVALID_PAYLOAD,
    );
  }

  if (response.status === 409) {
    const code = await readConflictCode(response);

    return new LandlordError(
      landlordConflictMessage(code, options.conflictFallback),
      response.status,
      code ?? LANDLORD_ERROR_TYPES.UNKNOWN,
    );
  }

  return new LandlordError(
    `Ошибка сервера: ${response.status}`,
    response.status,
    LANDLORD_ERROR_TYPES.UNKNOWN,
  );
}

async function readConflictCode(response: Response) {
  try {
    const body: unknown = await response.json();

    if (!body || typeof body !== 'object') {
      return undefined;
    }

    const code = (body as { code?: unknown }).code;

    return typeof code === 'string' ? code : undefined;
  } catch {
    return undefined;
  }
}
