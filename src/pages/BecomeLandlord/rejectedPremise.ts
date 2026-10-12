import type { LandlordPhoto, Premise } from '../../api/admin/listLandlords';

const REJECTED_PREMISE_STATUS = 'REJECTED';

export function pickRejectedPremise(
  premises: Premise[] | undefined,
): Premise | null {
  if (!premises?.length) {
    return null;
  }

  return (
    premises
      .filter((item) => item.status === REJECTED_PREMISE_STATUS)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0] ?? null
  );
}

export function applyRejectedPremise(
  premise: Premise,
  setters: {
    setPlaceName: (value: string) => void;
    setCity: (value: string) => void;
    setAddress: (value: string) => void;
    setDescription: (value: string) => void;
    setCompanyName: (value: string) => void;
    setRegistrationNumber: (value: string) => void;
    setBankDetails: (value: string) => void;
  },
) {
  setters.setPlaceName(premise.name);
  setters.setCity(premise.city);
  setters.setAddress(premise.address);
  setters.setDescription(premise.description ?? '');
  setters.setCompanyName(premise.legalName ?? '');
  setters.setRegistrationNumber(premise.legalRegistrationNo ?? '');
  setters.setBankDetails(premise.legalDetails ?? '');
}

const API_PHOTO_HOST = 'beautibaza.duckdns.org';

function photoRequestUrl(url: string) {
  if (import.meta.env.MODE !== 'development') {
    return url;
  }

  try {
    const parsed = new URL(url);
    if (parsed.hostname === API_PHOTO_HOST) {
      return `${parsed.pathname}${parsed.search}`;
    }
  } catch {
    return url;
  }

  return url;
}

function fileTypeFromName(name: string) {
  const extension = name.split('.').pop()?.toLowerCase();

  if (extension === 'png') {
    return 'image/png';
  }
  if (extension === 'webp') {
    return 'image/webp';
  }

  return 'image/jpeg';
}

// TODO: think of better way to do it. confirm with BE
export async function premisePhotoToFile(photo: LandlordPhoto) {
  const response = await fetch(photoRequestUrl(photo.url));

  if (!response.ok) {
    throw new Error(`Не удалось загрузить фото: ${response.status}`);
  }

  const blob = await response.blob();
  const name =
    photo.url.split('/').pop()?.split('?')[0] || `photo-${photo.id}.jpg`;
  const type = blob.type || fileTypeFromName(name);

  return new File([blob], name, { type });
}
