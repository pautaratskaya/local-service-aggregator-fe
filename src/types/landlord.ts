export const LANDLORD_APPLICATION_STATUSES = {
  DRAFT: 'DRAFT',
  PENDING_REVIEW: 'PENDING_REVIEW',
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
  daysOff: string[];
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
  id: number | string;
  userId: number;
  status: LandlordApplicationStatus;
  createdAt: string;
  updatedAt: string;
  formData: Omit<SubmitLandlordApplicationPayload, 'photos'> & {
    photoUrls: string[];
  };
}
