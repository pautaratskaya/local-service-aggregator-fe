export const MIN_RENTAL_DURATIONS = {
  MINUTES_30: 30,
  MINUTES_60: 60,
  MINUTES_120: 120,
} as const;

export type MinRentalDurationMinutes =
  (typeof MIN_RENTAL_DURATIONS)[keyof typeof MIN_RENTAL_DURATIONS];

export interface LandlordLegalInfo {
  companyName: string;
  registrationNumber: string;
  bankDetails: string;
}

export interface SubmitLandlordApplicationPayload {
  placeName: string;
  city: string;
  address: string;
  description: string;
  legalInfo: LandlordLegalInfo | null;
  termsAccepted: boolean;
  photos: File[];
}
