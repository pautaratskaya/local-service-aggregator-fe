import type {
  LandlordWorkspacePhoto,
  LandlordWorkspaceSummary,
} from '../../api/admin/listLandlords';
import {
  MIN_RENTAL_DURATIONS,
  WEEKDAYS,
  type MinRentalDurationMinutes,
  type Weekday,
} from '../../types/landlord';

function timeValue(value: string) {
  return value.slice(0, 5);
}

function isMinRentalDuration(value: number): value is MinRentalDurationMinutes {
  return (
    value === MIN_RENTAL_DURATIONS.MINUTES_30 ||
    value === MIN_RENTAL_DURATIONS.MINUTES_60 ||
    value === MIN_RENTAL_DURATIONS.MINUTES_120
  );
}

export function applyRejectedWorkspace(
  workspace: LandlordWorkspaceSummary,
  setters: {
    setPlaceName: (value: string) => void;
    setCity: (value: string) => void;
    setAddress: (value: string) => void;
    setPlaceType: (value: string) => void;
    setDescription: (value: string) => void;
    setWorkFrom: (value: string) => void;
    setWorkTo: (value: string) => void;
    setWorkingDays: (value: string[]) => void;
    setMinRentalDurationMinutes: (value: MinRentalDurationMinutes) => void;
    setPricePerHour: (value: string) => void;
    setCompanyName: (value: string) => void;
    setRegistrationNumber: (value: string) => void;
    setBankDetails: (value: string) => void;
  }
) {
  setters.setPlaceName(workspace.name);
  setters.setCity(workspace.city);
  setters.setAddress(workspace.address);
  setters.setPlaceType(workspace.kind);
  setters.setDescription(workspace.description ?? '');
  setters.setWorkFrom(timeValue(workspace.openTime));
  setters.setWorkTo(timeValue(workspace.closeTime));
  setters.setWorkingDays(
    workspace.workingDays.map((day) => WEEKDAYS[day as Weekday] ?? day)
  );
  if (isMinRentalDuration(workspace.minRentMinutes)) {
    setters.setMinRentalDurationMinutes(workspace.minRentMinutes);
  }
  setters.setPricePerHour(String(workspace.pricePerHour));
  setters.setCompanyName(workspace.legalName ?? '');
  setters.setRegistrationNumber(workspace.legalRegistrationNo ?? '');
  setters.setBankDetails(workspace.legalDetails ?? '');
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
export async function workspacePhotoToFile(photo: LandlordWorkspacePhoto) {
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
