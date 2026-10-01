export const LANDLORD_APPLICATION_STATUSES = {
  NO: 'NO',
  WAITING_APPROVAL: 'WAITING_APPROVAL',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export type LandlordApplicationStatus =
  (typeof LANDLORD_APPLICATION_STATUSES)[keyof typeof LANDLORD_APPLICATION_STATUSES];

export const MIN_RENTAL_DURATIONS = {
  MINUTES_30: 30,
  MINUTES_60: 60,
  MINUTES_120: 120,
} as const;

export type MinRentalDurationMinutes =
  (typeof MIN_RENTAL_DURATIONS)[keyof typeof MIN_RENTAL_DURATIONS];

export const WEEKDAYS = {
  MONDAY: 'Пн',
  TUESDAY: 'Вт',
  WEDNESDAY: 'Ср',
  THURSDAY: 'Чт',
  FRIDAY: 'Пт',
  SATURDAY: 'Сб',
  SUNDAY: 'Вс',
} as const;

export type Weekday = keyof typeof WEEKDAYS;

export const WEEKDAY_LABELS = Object.values(WEEKDAYS);

const WEEKDAY_API_BY_LABEL = Object.fromEntries(
  Object.entries(WEEKDAYS).map(([apiDay, label]) => [label, apiDay])
) as Record<(typeof WEEKDAYS)[Weekday], Weekday>;

export function toWeekdayApiValue(label: string): Weekday | string {
  return WEEKDAY_API_BY_LABEL[label as (typeof WEEKDAYS)[Weekday]] ?? label;
}

export interface LandlordPhotoMeta {
  name: string;
  size: number;
  type: string;
}

export interface LandlordLegalInfo {
  companyName: string;
  registrationNumber: string;
  bankDetails: string;
}

export interface LandlordWorkingHours {
  from: string;
  to: string;
}

export interface LandlordApplicationFormData {
  placeName: string;
  city: string;
  address: string;
  placeTypes: string[];
  description: string;
  workingHours: LandlordWorkingHours;
  minRentalDurationMinutes: MinRentalDurationMinutes;
  pricePerHour: number | null;
  legalInfo: LandlordLegalInfo | null;
  termsAccepted: boolean;
}

export interface SubmitLandlordApplicationPayload extends Omit<
  LandlordApplicationFormData,
  'termsAccepted'
> {
  workingDays: string[];
  photos: File[];
}

export interface LandlordApplication {
  id: number;
  name: string;
  city: string;
  photoUrls: string[];
}
