export const CATALOG_ITEM_IN_USE = 'CATALOG_ITEM_IN_USE';

export type CatalogItemInUseDetails = {
  itemType: string;
  itemId: number;
  workspaces: number;
  masters: number;
  bookings: number;
};

export class CatalogItemInUseError extends Error {
  details: CatalogItemInUseDetails;

  constructor(details: CatalogItemInUseDetails) {
    super(formatCatalogItemInUseMessage(details));
    this.name = 'CatalogItemInUseError';
    this.details = details;
  }
}

export function formatCatalogItemInUseMessage(
  details: CatalogItemInUseDetails,
): string {
  const parts: string[] = [];

  if (details.workspaces > 0) {
    parts.push(`в ${ruCount(details.workspaces, 'помещении', 'помещениях')}`);
  }

  if (details.masters > 0) {
    parts.push(`у ${ruCount(details.masters, 'мастера', 'мастеров')}`);
  }

  if (details.bookings > 0) {
    parts.push(`в ${ruCount(details.bookings, 'записи', 'записях')}`);
  }

  const usage = joinRu(parts);

  if (!usage) {
    return 'Нельзя удалить: элемент уже используется.';
  }

  return `Нельзя удалить: используется ${usage}. Сначала отвяжите этот элемент.`;
}

export async function catalogItemInUseErrorFromResponse(
  response: Response,
): Promise<CatalogItemInUseError | null> {
  if (response.status !== 409) {
    return null;
  }

  try {
    const body: unknown = await response.json();

    if (!isCatalogItemInUseBody(body)) {
      return null;
    }

    return new CatalogItemInUseError(body.details);
  } catch {
    return null;
  }
}

function isCatalogItemInUseBody(
  body: unknown,
): body is { code: string; details: CatalogItemInUseDetails } {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const record = body as {
    code?: unknown;
    details?: {
      itemType?: unknown;
      itemId?: unknown;
      workspaces?: unknown;
      masters?: unknown;
      bookings?: unknown;
    };
  };

  return (
    record.code === CATALOG_ITEM_IN_USE &&
    !!record.details &&
    typeof record.details.itemType === 'string' &&
    typeof record.details.itemId === 'number' &&
    typeof record.details.workspaces === 'number' &&
    typeof record.details.masters === 'number' &&
    typeof record.details.bookings === 'number'
  );
}

function ruCount(n: number, one: string, other: string): string {
  const word = n % 10 === 1 && n % 100 !== 11 ? one : other;

  return `${n} ${word}`;
}

function joinRu(parts: string[]): string {
  if (parts.length <= 1) {
    return parts[0] ?? '';
  }

  return `${parts.slice(0, -1).join(', ')} и ${parts[parts.length - 1]}`;
}
