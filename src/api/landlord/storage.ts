import type { LandlordApplication } from '../../types/landlord';

const STORAGE_KEY = 'landlord-applications';

function readApplications(): Record<number, LandlordApplication> {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw) as Record<number, LandlordApplication>;
  } catch {
    return {};
  }
}

export function getStoredApplication(
  userId: number
): LandlordApplication | null {
  const applications = readApplications();
  return applications[userId] ?? null;
}

export function storeApplication(application: LandlordApplication): void {
  const applications = readApplications();
  applications[application.userId] = application;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
}
